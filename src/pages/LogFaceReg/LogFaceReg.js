import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import ario from '../../assets/images/ario.jpeg'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const LogFaceReg = () => {
    const [logData, setLogData] = useState([])
    const navigate = useNavigate()
    const socket_IO = io("http://192.168.2.143:4020");
    useEffect(() => {
        socket_IO.on("responseHistoryLogs", (data) => {
            if (data.length > 0) {
                console.log(data, "data")
                setLogData(data)
                setInterval(() => {
                    socket_IO.emit('logHistory2')
                }, 5000);
            }
        });



    }, [socket_IO]);
    useEffect(() => {
        socket_IO.emit('logHistory')
    }, [])
    const dummy = [
        {
            id: 1,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            similiarity: 80,
            recognitionStatus: 'success',
            recognitionTime: '2024-09-06 16:45',
            profile_image: ario
        },
        {
            id: 2,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            similiarity: 80,
            recognitionStatus: 'success',
            recognitionTime: '2024-09-06 16:45',
            profile_image: ario
        },
        {
            id: 3,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            similiarity: 80,
            recognitionStatus: 'success',
            recognitionTime: '2024-09-06 16:45',
            profile_image: ario
        },
    ]
    const handleEpochToDate = (epoch) => {
        const date = new Date(epoch * 1000);


        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-indexed month
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate, "dataConvert");
        return formattedDate;
    };
    const customRowRenderer = (row) => (
        <>
            <td>{row?.personId}</td>
            <td>{row?.personCode}</td>
            <td>{row?.name}</td>
            <td>{row?.images_info[0]?.similarity}</td>
            <td>{row?.passStatus == 6 ? "Failed" : "Success"}</td>
            <td>{handleEpochToDate(row?.time)}</td>
            <td>
                <img
                    src={`http://192.168.2.166/ofsimage/${row.images_info[0].img_path}`}
                    alt="result"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                />
            </td>
        </>
    );
    const getDetailData = (row) => {
        // console.log(row, "rownya")
        navigate('/validation', { state: row })
    }
    const generateExcel = () => {
        const Excel = require("exceljs");
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        // Add column headers
        const headers = ['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time"]
        worksheet.addRow(headers);

        // Add data rows
        logData.forEach((item, index) => {
            const row = [
                index + 1,
                item.personId,
                item.personCode,
                item.name,
                item?.images_info[0]?.similarity,
                item?.passStatus == 6 ? "Failed" : "Success",
                handleEpochToDate(item?.time),
            ];
            worksheet.addRow(row);
        });



        // Save the workbook
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const getFilenameWithDateTime = (baseFilename) => {
                const now = new Date();
                const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
                const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
                return `${baseFilename.replace('.xlsx', '')}_${date}_${time}.xlsx`;
            };

            // Example usage
            const baseFilename = "Log_FaceReg.xlsx";
            const filename = getFilenameWithDateTime(baseFilename);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // For IE
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                // For other browsers
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        });
    };
    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container">
                <div className="search-table-list">
                    <div className="search-table">
                        <span>Nomor PLB : </span>
                        <input type="text" placeholder='Masukkan nomor plb' />
                    </div>
                    <div className="search-table">
                        <span>Nama : </span>
                        <input type="text" placeholder='Masukkan nama' />
                    </div>
                </div>
                <div className="buttons-container" style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={generateExcel}
                        style={{ backgroundColor: "green" }}
                    >Export
                    </button>
                    <button

                    >Search
                    </button>
                </div>
            </div>
            <TableLog
                tHeader={['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time", "Image Result"]}
                tBody={logData}
                // handler={getDetailData}
                rowRenderer={customRowRenderer}
            />
        </div>
    )
}

export default LogFaceReg