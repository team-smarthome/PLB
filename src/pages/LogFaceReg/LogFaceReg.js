import React, { useEffect, useRef, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import { useNavigate } from 'react-router-dom'
import { addPendingRequest4020, initiateSocket4020 } from '../../utils/socket'
import Modals from '../../components/Modal/Modal'
import './logfacereg.style.css'
import { apiInsertLog, loginCamera } from '../../services/api'
import axios from 'axios'

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket_IO_4020 = initiateSocket4020();
    const [logData, setLogData] = useState([])
    const [showModalConfig, setShowModalConfig] = useState(true)
    const [showModalLogin, setShowModalLogin] = useState(false)
    const [ipServerPC, setIpServerPC] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ipServerCamera, setIpServerCamera] = useState([]);
    const [isConfigEmpty, setIsConfigEmpty] = useState(false)
    const [status, setStatus] = useState("loading")
    const ipCameraRef = useRef(null)
    const [statusAll, setStatusAll] = useState("")

    const tokenLocalStorage = localStorage.getItem('logCameraToken')
    const ipServerCameraLocalStorage = localStorage.getItem('ipServerCamera')
    const ipServerPCLocalStorage = localStorage.getItem('ipServerPC')
    const ipCameraLocalStorage = localStorage.getItem('cameraIpNew')

}
const handleChange = (e) => {
    setParams({
        ...params,
        [selectedCondition]: e.target.value
    })
}
const handleChangeStatus = (e) => {
    setParams({
        ...params,
        passStatus: parseInt(e.target.value)
    })
}
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

useEffect(() => {
    const ipCameraNew = localStorage.getItem('cameraIpNew')
    if (ipServerCamera.length === 0 && ipCameraNew) {
        socket_IO_4020.on("responseHistoryLogs", (data) => {
            if (data.length > 0) {
                console.log(data, "datayanddapatdariwes")
                setStatus("success")
                setLogData(data)
                const dataInsert = {
                    personId: data[0]?.personId,
                    personCode: data[0]?.personCode,
                    similarity: data[0]?.images_info[0]?.similarity,
                    passStatus: data[0]?.passStatus === 6 ? "Failed" : "Success",
                    time: data[0]?.time,
                    img_path: data[0]?.images_info[0]?.img_path,
                    ipCamera: ipCameraNew
                }

                const response = apiInsertLog(dataInsert)
                response.then(res => {
                    console.log(res, "responInsert")
                    if (res.status === 200) {
                        setTimeout(() => {
                            if (socket_IO_4020.connected) {
                                console.log("masuk_sini_socket")
                                socket_IO_4020.emit('historyLog')
                            } else {
                                console.log("masuk_sini_socket_gagal")
                                addPendingRequest4020({ action: 'historyLog' });
                                socket_IO_4020.connect();
                            }
                        }, 2000);
                    } else {
                        console.log("masuk_sini_gagal")
                    }
                }).catch(err => console.log(err))
            }
        })
        return () => {
            socket_IO_4020.off('responseHistoryLogs')
            socket_IO_4020.off('historyLog')
        }
    } else {
        console.log("masuk_sini_noip")
        // setShowModalConfig(true)
    }

}, [socket_IO_4020])



const customRowRenderer = (row) => (
    <>
        <td>{row?.personId}</td>
        <td>{row?.personCode}</td>
        <td>{row?.name}</td>
        <td>{row?.images_info[0]?.similarity}</td>
        <td>{row?.passStatus === 6 ? "Failed" : "Success"}</td>
        <td>{handleEpochToDate(row?.time)}</td>
        <td>
            <img
                src={`${ipCameraLocalStorage}/ofsimage/${row.images_info[0].img_path}`}
                alt="result"
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
            />
        </td>
    </>
);

const getDetailData = (row) => {
    navigate('/validation', { state: { detailDataLog: row, isCp: true } })
}

const generateExcel = () => {
    const Excel = require("exceljs");
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Payment Report");

    const headers = ['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time"]
    worksheet.addRow(headers);

    logData.forEach((item, index) => {
        const row = [
            index + 1,
            item.personId,
            item.personCode,
            item.name,
            item?.images_info[0]?.similarity,
            item?.passStatus === 6 ? "Failed" : "Success",
            handleEpochToDate(item?.time),
        ];
        worksheet.addRow(row);
    });

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
        const baseFilename = "Log_FaceReg.xlsx";
        const filename = getFilenameWithDateTime(baseFilename);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
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

const handleCloseModal = () => {
    setShowModalConfig(false)
    setIpServerCamera([])
    setIpServerPC("")
}


const handleSubmit = async () => {
    setShowModalConfig(false)
    console.log(ipServerCamera, "ipServerCameraManaBro")
    localStorage.setItem("cameraIpNew", ipServerCamera)
    try {
        if (ipServerCamera !== "") {
            const response = await axios.put(`http://${ipServerCamera}/cgi-bin/entry.cgi/system/login`, {
                "sUserName": "admin",
                "sPassword": btoa("Maxvision@2024")
            })
            const dataRes = response?.data?.data;
            if (response.data.status.code === 200) {
                const loginData = `Face-Token=${dataRes.token}; face-username="admin"; roleId=${dataRes.auth}; sidebarStatus=${dataRes.status}; token=${dataRes.token}`;
                const dataSendWs = {
                    ipServerCamera: ipServerCamera,
                    cookiesCamera: loginData
                }
                if (socket_IO_4020.connected) {
                    console.log(dataSendWs, "ipServerCamera222222")
                    socket_IO_4020.emit('logHistory2', dataSendWs)
                } else {
                    console.log(ipServerCamera, "ipServerCamera333333")
                    addPendingRequest4020({ action: 'logHistory2', data: dataSendWs });
                    socket_IO_4020.connect();
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
};

const ModalConfigContent = () => {
    return (
        <div className="config-container">
            <div className="input-config">
                <span>IP Server Camera</span>
                <input type="text" value={ipServerCamera} onChange={(e) => setIpServerCamera(e.target.value)} />
            </div>
        </div>
    )
}

return (
    <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
        <div className="input-search-container">
            <div className="search-table-list">
                <div className="search-table">
                    <select
                        value={selectedCondition}
                        onChange={handleSelectChange}
                    // style={{ marginRight: '10px', }}
                    >
                        <option value="name">Name</option>
                        <option value="personCode">Employee ID</option>
                    </select>

                    <input type="text"
                        value={selectedCondition == "name" ? params.name : params.personCode}
                        onChange={handleChange}
                        placeholder={`Masukkan ${selectedCondition == "name" ? "nama" : "nomor plb"}`}
                        style={{ marginRight: 5 }}
                    />

                    <select
                        value={params.passStatus}
                        onChange={handleChangeStatus}
                    // style={{ marginRight: '10px', }}
                    >
                        <option value="-1">All</option>
                        <option value="0">Success</option>
                        <option value="6">Failed</option>
                    </select>
                </div>
            </div>
            <div className="buttons-container" style={{ display: 'flex', gap: 10 }}>
                <button
                    style={{ backgroundColor: 'blue' }}
                    onClick={() => setShowModalConfig(true)}
                >
                    Config
                </button>
                <button
                    onClick={generateExcel}
                    style={{ backgroundColor: "green" }}
                >Export
                </button>
                <button
                    onClick={() => console.log("params", params)}
                >Search
                </button>
            </div>
        </div>
        {status === "loading" && (
            <div className="loading">
                <span className="loader-loading-table"></span>
            </div>
        )}
        {status === "success" && logData &&
            <TableLog
                tHeader={['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time", "Image Result"]}
                tBody={logData}
                handler={getDetailData}
                rowRenderer={customRowRenderer}
            />
        }
        <Modals
            buttonName="Confirm"
            headerName="Config Ip Camera"
            showModal={showModalConfig}
            closeModal={handleCloseModal}
            onConfirm={handleSubmit}
        >
            {ModalConfigContent()}
        </Modals>
    </div>
)
}

export default LogFaceReg
