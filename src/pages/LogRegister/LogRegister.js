import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import ario from '../../assets/images/ario.jpeg'
import { useNavigate } from 'react-router-dom'
import { apiGetDataLogRegister } from '../../services/api'
import { url_devel } from '../../services/env'

const LogRegister = () => {
    const [search, setSearch] = useState({
        name: "",
        no_passport: "",
        startDate: "",
        endDate: ""
    })
    const navigate = useNavigate()
    const [logData, setLogData] = useState([])
    const dummy = [
        {
            id: 1,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },
        {
            id: 2,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },
        {
            id: 3,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },

    ]
    const getDetailData = (row) => {
        // console.log(row, "rownya")
        navigate('/validation', { state: row })
    }

    const getLogRegister = async () => {
        try {
            const res = await apiGetDataLogRegister({
                ...search
            })
            if (res.status == 200) {
                console.log(res.data.data, "res.data.data")
                setLogData(res.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLogRegister()
    }, [])

    const customRowRenderer = (row) => (
        <>
            <td>{row.no_passport}</td>
            <td>{row.no_register}</td>
            <td>{row.name}</td>
            <td>{row.gender === "M" ? "Laki-laki" : "Perempuan"}</td>
            <td>{row.nationality}</td>
            <td>
                <img
                    src={`${url_devel}storage/${row.profile_image}`}
                    alt="Profile"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                />
            </td>
        </>
    );
    const generateExcel = () => {
        const Excel = require("exceljs");
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        // Add column headers
        const headers = ['No', 'no plb', 'no register', 'name', 'gender', 'nationality']
        worksheet.addRow(headers);

        // Add data rows
        logData.forEach((item, index) => {
            const row = [
                index + 1,
                item.no_passport,
                item.no_register,
                item.name,
                item.gender == "M" ? "Laki-laki" : "Perempuan",
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
            const baseFilename = "Log_Register.xlsx";
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
                        <input type="text" placeholder='Masukkan nomor plb' value={search.no_passport} onChange={(e) => setSearch({ ...search, no_passport: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>Nama : </span>
                        <input type="text" placeholder='Masukkan nama' value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>Start Date : </span>
                        <input type="datetime-local" value={search.startDate} onChange={(e) => setSearch({ ...search, startDate: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>End Date : </span>
                        <input type="datetime-local" value={search.endDate} onChange={(e) => setSearch({ ...search, endDate: e.target.value })} />
                    </div>
                </div>
                <div className="buttons-container" style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={generateExcel}
                        style={{ backgroundColor: "green" }}
                    >Export
                    </button>
                    <button
                        onClick={getLogRegister}>Search
                    </button>
                </div>
            </div>
            <TableLog
                tHeader={['No', 'no plb', 'no register', 'name', 'gender', 'nationality', 'profile image']}
                tBody={logData}
                // handler={getDetailData}
                rowRenderer={customRowRenderer}
            />
        </div>
    )
}

export default LogRegister