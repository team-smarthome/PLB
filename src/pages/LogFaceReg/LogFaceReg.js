import React, { useEffect, useRef, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import { useNavigate } from 'react-router-dom'
import { addPendingRequest4020, initiateSocket4020 } from '../../utils/socket'
import Modals from '../../components/Modal/Modal'
import './logfacereg.style.css'
import { apiGetIp, apiInsertLog, getDataLogApi, loginCamera } from '../../services/api'
import axios from 'axios'
import Cookies from 'js-cookie';
import ImgsViewer from "react-images-viewer";
import { Select } from 'flowbite-react'

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket_IO_4020 = initiateSocket4020();
    const [logData, setLogData] = useState([])
    const [showModalConfig, setShowModalConfig] = useState(false)
    const [optionIp, setOptionIp] = useState([])
    const [showModalLogin, setShowModalLogin] = useState(false)
    const [ipServerPC, setIpServerPC] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ipServerCamera, setIpServerCamera] = useState([]);
    const [isConfigEmpty, setIsConfigEmpty] = useState(false)
    const [status, setStatus] = useState("loading")
    const ipCameraRef = useRef(null)
    const [statusAll, setStatusAll] = useState("")
    const [dataUserId, setDataUserId] = useState({})
    const tokenLocalStorage = localStorage.getItem('logCameraToken')
    const ipServerCameraLocalStorage = localStorage.getItem('ipServerCamera')
    const ipServerPCLocalStorage = localStorage.getItem('ipServerPC')
    const ipCameraLocalStorage = localStorage.getItem('cameraIpNew')
    const [selectedOption, setSelectedOption] = useState('192.2.1');
    const [noPassport, setNoPassport] = useState("");
    const [noRegister, setNoRegister] = useState("");
    const [name, setName] = useState("");
    const [page, setPage] = useState(1);
    const [selectedCondition, setSelectedCondition] = useState('name');
    const [isOpenImage, setIsOpenImage] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [imagesData, setImagesData] = useState([])
    const [params, setParams] = useState({
        name: "",
        personId: "",
        startDate: "",
        endDate: "",
        passStatus: ""
    })


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
        const ipCameraNew = localStorage.getItem('cameraIpNew');
        console.log(selectedOption, "selectedOptionRow12312312312");
        if (ipServerCamera.length === 0 && ipCameraNew && selectedOption !== "192.2.1") {
            socket_IO_4020.on("responseHistoryLogs", (data) => {
                if (data.length > 0) {
                    console.log(data, "datayanddapatdariwes");
                    setStatus("success");
                    setLogData(data);

                    const dataInsert = {
                        personId: data[0]?.personId,
                        personCode: data[0]?.personCode,
                        name: data[0]?.name,
                        similarity: data[0]?.images_info[0]?.similarity,
                        passStatus: data[0]?.passStatus === 6 ? "Failed" : "Success",
                        time: data[0]?.time,
                        img_path: `http://${ipCameraNew}/ofsimage/${data[0]?.images_info[0]?.img_path}`,
                        ipCamera: ipCameraNew
                    };

                    // Kirim data ke API
                    apiInsertLog(dataInsert)
                        .then(res => {
                            console.log(res, "responInsert");
                            if (res.status === 201) {
                                setTimeout(() => {
                                    if (socket_IO_4020.connected) {
                                        console.log("masuk_sini_socket");
                                        socket_IO_4020.emit('historyLog');
                                    } else {
                                        console.log("masuk_sini_socket_gagal");
                                        addPendingRequest4020({ action: 'historyLog' });
                                        socket_IO_4020.connect();
                                    }
                                }, 2000);
                            } else {
                                console.log("masuk_sini_gagal");
                            }
                        })
                        .catch(err => console.log(err));
                }
            });

            // Bersihkan listener socket saat komponen di-unmount
            return () => {
                socket_IO_4020.off('responseHistoryLogs');
                socket_IO_4020.off('historyLog');
            };
        } else {
            setStatus("loading");
            console.log("masuk_sini_noip");
        }

    }, [socket_IO_4020, ipServerCamera, selectedOption]);



    const getLogData = async () => {
        try {
            const response = await getDataLogApi(params);
            setStatus("success")
            console.log(response.data.data, "dataLog")
            setLogData(response.data.data)
        } catch (error) {
            setStatus("succes")
            console.log(error.message)
        }
    }

    const handleSearch = () => {
        setSelectedOption('192.2.1')
        getLogData()
    }
    useEffect(() => {
        setStatus('loading')
        const getDataIp = Cookies.get('userdata');
        const getAllIp = apiGetIp(JSON.parse(getDataIp)?.petugas?.id);
        getAllIp.then(res => {
            if (res.data.status === 200) {
                const dataOptions = res.data.data.map(item => ({
                    value: item.ipAddress,
                    label: item.namaKamera,
                }));
                const defaultOption = {
                    value: '192.2.1',
                    label: 'All Camera'
                };
                const updatedOptions = [defaultOption, ...dataOptions];
                setOptionIp(updatedOptions);
                console.log(updatedOptions, "dataOptions");
            }
        }).catch(err => console.log(err.message))
        const fetchData = async () => {
            const filterParams = {
                page: page,
                no_passport: noPassport,
                name: name,
                no_register: noRegister,
            };
            await getLogData();
        };

        fetchData();

    }, [selectedOption])

    const handleSelectChange = (event) => {
        setLogData([])
        setStatus("loading")
        console.log(logData, "selectedOptionRow123")
        setStatus("loading")
        localStorage.setItem('cameraIpNew', event.target.value)
        handleSubmit(event.target.value)
        setSelectedOption(event.target.value);
        console.log('Selected_IP:', event.target.value);
    };



    const customRowRenderer = (row) => {
        console.log(selectedOption, "selectedOptionRow");
        console.log(row, "selectedOptionRow");
        return (
            <>
                {!selectedOption.includes("192.168") ? (
                    <>
                        <td>{row?.personId}</td>
                        <td>{row?.personCode}</td>
                        <td>{row?.name}</td>
                        <td>{row?.similarity}</td>
                        <td>{row?.passStatus === 6 ? "Failed" : "Success"}</td>
                        <td>{handleEpochToDate(row?.time)}</td>
                        <td>
                            <img
                                src={`${row?.img_path}`}
                                alt="result"
                                width={100}
                                height={100}
                                style={{ borderRadius: "50%" }}
                            />
                        </td>
                        <td>{row?.ipCamera}</td>
                    </>
                ) : (
                    <>
                        <td>{row?.personId}</td>
                        <td>{row?.personCode}</td>
                        <td>{row?.name}</td>
                        <td>{row?.images_info?.[0]?.similarity ?? row?.similarity}</td>
                        <td>{row?.passStatus === 6 ? "Failed" : "Success"}</td>
                        <td>{handleEpochToDate(row?.time)}</td>
                        <td>
                            <img
                                src={row?.images_info?.[0]?.img_path ? `http://${ipCameraLocalStorage}/ofsimage/${row.images_info[0].img_path}` : ''}
                                alt="result"
                                width={100}
                                height={100}
                                style={{ borderRadius: "50%" }}
                            />

                        </td>
                        <td>{ipCameraLocalStorage}</td>
                    </>
                )}
            </>
        );
    };

    const handleSelectChange2 = (e) => {
        setParams({
            ...params,
            [selectedCondition]: ""
        })
        setSelectedCondition(e.target.value);

    }
    const handleChange = (e) => {
        setParams({
            ...params,
            [selectedCondition]: e.target.value
        })
    }

    const getDetailData = (row) => {
        // console.log(row.personCode)
        navigate('/validation', { state: { detailDataLog: row.personCode, isCp: true } })
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
    // const resultArray =  ? logData.map(item => ({ src: item.img_path })) : logData.map(item => ({ src: `http://${ipCameraLocalStorage}/ofsimage/${item?.images_info[0]?.img_path}` }));
    useEffect(() => {
        if (!selectedOption.includes("192.168")) {
            const imagesMap = logData.map(item => ({ src: item.img_path }))
            setImagesData(imagesMap)
        } else {
            const imagesIpMap = logData.map(item => ({ src: `http://${ipCameraLocalStorage}/ofsimage/${item?.images_info[0]?.img_path}` }))
            setImagesData(imagesIpMap)

        }
    }, [])

    const handleOpenImage = (row, index) => {
        setIsOpenImage(true)
        setCurrentImage(index)
    }
    const nextImage = () => {
        setCurrentImage(currentImage + 1)
    }
    const prevImage = () => {
        setCurrentImage(currentImage - 1)
    }
    // cons
    const handleSubmit = async (ipParams) => {
        try {
            if (ipParams !== "") {
                const response = await axios.put(`http://${ipParams}/cgi-bin/entry.cgi/system/login`, {
                    "sUserName": "admin",
                    "sPassword": btoa("Maxvision@2024")
                })
                const dataRes = response?.data?.data;
                if (response.data.status.code === 200) {
                    const loginData = `Face-Token=${dataRes.token}; face-username="admin"; roleId=${dataRes.auth}; sidebarStatus=${dataRes.status}; token=${dataRes.token}`;
                    const dataSendWs = {
                        ipServerCamera: ipParams,
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

    const handleChangeStatus = (e) => {
        setParams({
            ...params,
            passStatus: e.target.value
        })
    }

    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container">
                <div className="search-table-list">
                    <div className="search-table">
                        <select
                            value={selectedCondition}
                            onChange={handleSelectChange2}
                        // style={{ marginRight: '10px', }}
                        >
                            <option value="name">Nama</option>
                            <option value="personId">Nomor Passport</option>
                        </select>

                        <input type="text"
                            value={selectedCondition === "name" ? params.name : params.personId}
                            onChange={handleChange}
                            placeholder={`Masukkan ${selectedCondition == "name" ? "nama" : "nomor plb"}`}
                            style={{ marginRight: 5 }}
                        />
                        <select
                            value={params.passStatus}
                            onChange={handleChangeStatus}
                            style={{ marginRight: '20px', }}
                        >
                            <option value="">All</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                        </select>

                        <span>Start Date : </span>
                        <input type="datetime-local"
                            value={params.startDate}
                            onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                            style={{ marginRight: '10px', }}
                            st
                        />
                        <span>End Date : </span>
                        <input type="datetime-local"
                            value={params.endDate}
                            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                        />
                    </div>

                </div>
                <div className="buttons-container" style={{ display: 'flex', gap: 10 }}>
                    <select
                        value={selectedOption}
                        onChange={handleSelectChange}
                    >
                        {optionIp.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={generateExcel}
                        style={{ backgroundColor: "green" }}
                    >Export
                    </button>
                    <button
                        onClick={handleSearch}
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
                    tHeader={['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time", "Image Result", "IP Camera"]}
                    tBody={logData}
                    handler={handleOpenImage}
                    rowRenderer={customRowRenderer}
                />
            }
            <ImgsViewer
                imgs={imagesData}
                isOpen={isOpenImage}
                onClickPrev={prevImage}
                onClickNext={nextImage}
                onClose={() => { setIsOpenImage(false) }}
                currImg={currentImage}
            />
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
