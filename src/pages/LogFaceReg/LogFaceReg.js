import React, { useEffect, useRef, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import ario from '../../assets/images/ario.jpeg'
import { useNavigate } from 'react-router-dom'
import { addPendingRequest4020, initiateSocket4020 } from '../../utils/socket'
import Modals from '../../components/Modal/Modal'
import './logfacereg.style.css'
import { loginCamera } from '../../services/api'

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket_IO_4020 = initiateSocket4020();

    const [logData, setLogData] = useState([])
    const [showModalConfig, setShowModalConfig] = useState(false)
    const [showModalLogin, setShowModalLogin] = useState(false)
    const [ipServerPC, setIpServerPC] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ipServerCamera, setIpServerCamera] = useState([]);
    const [isConfigEmpty, setIsConfigEmpty] = useState(false)
    const [status, setStatus] = useState("loading")
    const ipCameraRef = useRef(null)

    const tokenLocalStorage = localStorage.getItem('logCameraToken')
    const ipServerCameraLocalStorage = localStorage.getItem('ipServerCamera')
    const ipServerPCLocalStorage = localStorage.getItem('ipServerPC')
    useEffect(() => {
        socket_IO_4020.on("responseHistoryLogs", (data) => {
            if (data.length > 0) {
                console.log(data, "datayanddapatdariwes")
                setStatus("success")
                setLogData(data)
                setInterval(() => {
                    if (socket_IO_4020.connected) {
                        socket_IO_4020.emit('logHistory')
                    } else {
                        addPendingRequest4020({ action: 'logHistory' });
                        socket_IO_4020.connect();
                    }

                }, 2000);
            }
        });
        return () => {
            socket_IO_4020.off('responseHistoryLogs')
            socket_IO_4020.off('logHistory')
        }
    }, [socket_IO_4020])

    useEffect(() => {

        console.log(tokenLocalStorage, ipServerCameraLocalStorage, ipServerPCLocalStorage, "Config sini")
        if (tokenLocalStorage && ipServerCameraLocalStorage && ipServerPCLocalStorage) {
            if (socket_IO_4020.connected) {
                socket_IO_4020.emit('saveCameraData', {
                    ipServerCamera: [ipServerCameraLocalStorage],
                    ipServerPCLocalStorage,
                    cookiesCamera: [tokenLocalStorage]
                })
                setIsConfigEmpty(false)
            }
        } else {
            console.log("gk ada")
            setIsConfigEmpty(true)
        }
        if (socket_IO_4020.connected) {
            socket_IO_4020.emit('logHistory')
        } else {
            addPendingRequest4020({ action: 'logHistory' });
            socket_IO_4020.connect();
        }
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
        navigate('/validation', { state: { detailDataLog: row, isCp: true } })
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

    const handleCloseModal = () => {
        setShowModalConfig(false)
        setIpServerCamera([])
        setIpServerPC("")
    }

    const handleCloseModalLogin = () => {
        setShowModalLogin(false)

    }

    const handleSubmit = () => {
        console.log(ipServerCamera, ipServerPC, "sini")
        if (ipServerCamera !== "" && ipServerPC !== "") {
            setShowModalLogin(true);
            localStorage.setItem('ipServerCamera', ipServerCamera)
            localStorage.setItem('ipServerPC', ipServerPC)
        }
    };

    const handleSubmitLogin = async () => {
        try {
            console.log(username, password, "sini login")
            const encodePassword = btoa(password)
            const payload = {
                sUserName: username,
                sPassword: encodePassword
            }
            const res = await loginCamera(ipServerCamera, payload)
            console.log(res, "res")
            const dataResponse = res.data.data
            if (res.status == 200) {
                const authUser = dataResponse.auth === 0 ? "admin" : "user"
                const loginData = `Face-Token=${dataResponse.token}; face-username=${authUser}; roleId=${dataResponse.auth}; sidebarStatus=${dataResponse.status}; token=${dataResponse.token}`;
                localStorage.setItem("logCameraToken", loginData)
                if (socket_IO_4020.connected) {
                    setShowModalConfig(false)
                    setShowModalLogin(false)
                    socket_IO_4020.emit('saveCameraData', {
                        ipServerCamera: [ipServerCamera],
                        ipServerPC,
                        cookiesCamera: [loginData]
                    })
                    socket_IO_4020.emit('logHistory')
                } else {
                    addPendingRequest4020({ action: 'logHistory' });
                    socket_IO_4020.connect();
                }
            }
        } catch (error) {
            console.log(error, "error")
        }
    }

    const ModalConfigContent = () => {
        return (
            <div className="config-container">
                <div className="input-config">
                    <span>IP Server PC</span>
                    <input type="text" value={ipServerPC} onChange={(e) => setIpServerPC(e.target.value)} />
                </div>
                <div className="input-config">
                    <span>IP Server Camera</span>
                    <input type="text" value={ipServerCamera} onChange={(e) => setIpServerCamera(e.target.value)} />
                </div>
                <Modals
                    showModal={showModalLogin}
                    closeModal={handleCloseModalLogin}
                    headerName="Login"
                    onConfirm={handleSubmitLogin}
                    buttonName="Confirm"
                >
                    {ModalLoginContent()}
                </Modals>
            </div>
        )
    }

    const ModalLoginContent = () => {
        return (
            <div className="config-container">
                <div className="input-config">
                    <span>Username</span>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-config">
                    <span>Password</span>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container"
            // style={{ opacity: status != "success" ? 0 : 1 }}
            >
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

                    >Search
                    </button>
                </div>
            </div>
            {status == "loading" && (
                <div className="loading">
                    <span className="loader-loading-table"></span>
                </div>
            )}
            {status == "success" && logData &&
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
