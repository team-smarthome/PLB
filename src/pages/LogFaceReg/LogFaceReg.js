import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import { useNavigate } from 'react-router-dom'
import { addPendingRequest4020, initiateSocket4020 } from '../../utils/socket'
import './logfacereg.style.css'
import { apiGetIp, apiInsertLog, getDataLogApi } from '../../services/api'
import axios from 'axios'
import Cookies from 'js-cookie';
import Select from "react-select";
import Pagination from '../../components/Pagination/Pagination'

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket_IO_4020 = initiateSocket4020();
    const [logData, setLogData] = useState([])
    const [optionIp, setOptionIp] = useState([])
    const [status, setStatus] = useState("loading")
    const ipCameraLocalStorage = localStorage.getItem('cameraIpNew')
    const [selectedOption, setSelectedOption] = useState('192.2.1');
    const [selectedCondition, setSelectedCondition] = useState('personId');
    const [totalDataFilter, setTotalDataFilter] = useState(0);
    const [page, setPage] = useState(1);
    const [changePage, setChangePage] = useState(false)
    const [disablePaginate, setDisablePaginate] = useState(false)
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const optionFilter = [
        {
            value: 'personId',
            label: 'Nomor Passport'
        },
        {
            value: 'name',
            label: 'Nama'
        },
    ]

    const optionFilterStatus = [
        {
            value: '',
            label: 'All'
        },
        {
            value: 'Success',
            label: 'Success'
        },
        {
            value: 'Failed',
            label: 'Failed'
        },
    ]

    const [params, setParams] = useState({
        page: page,
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
        if (selectedOption !== "192.2.1") {
            setDisablePaginate(true)
        } else {
            setDisablePaginate(false)
        }
        const ipCameraNew = localStorage.getItem('cameraIpNew');
        console.log(selectedOption, "selectedOptionRow12312312312");
        if (ipCameraNew && selectedOption !== "192.2.1") {
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
                } else {
                    setStatus("success");
                }
            });
            return () => {
                socket_IO_4020.off('responseHistoryLogs');
                socket_IO_4020.off('historyLog');
            };
        } else {
            setStatus("loading");
            console.log("masuk_sini_noip");
        }

    }, [socket_IO_4020, selectedOption]);



    const getLogData = async () => {
        try {
            const response = await getDataLogApi(params);
            setStatus("success")
            console.log(response.data.data, "dataLog")
            setLogData(response.data.data)
            setTotalDataFilter(response?.data?.data?.length);
            console.log(response?.data?.pagination, "paginationyamase2");
            setPagination(response?.data?.pagination);
        } catch (error) {
            setStatus("succes")
            console.log(error.message)
        }
    }

    const getLogDataPaginate = async () => {
        try {
            const response = await getDataLogApi(params);
            setStatus("success")
            console.log(response.data.data, "dataLog")
            setLogData(response.data.data)
            setTotalDataFilter(response?.data?.data?.length);
            console.log(response?.data?.pagination, "paginationyamase2");
            setPagination(response?.data?.pagination);
            setChangePage(false)
        } catch (error) {
            setStatus("succes")
            console.log(error.message)
        }
    }


    const handleSearch = () => {
        setSelectedOption('192.2.1')
        setPage(1)
        setParams(prevState => ({
            ...prevState,
            page: 1
        }));
        getLogData()
    }

    useEffect(() => {
        if (selectedOption !== "192.2.1") {
            setDisablePaginate(true)
        } else {
            setDisablePaginate(false)
        }
        getLogData();
    }, [selectedOption])


    useEffect(() => {
        if (changePage) {
            console.log('apakahmasuksiniMASEEEEEE')
            getLogDataPaginate()
        }

    }, [changePage])


    useEffect(() => {
        setParams(prevState => ({
            ...prevState,
            page: page
        }));
        setChangePage(true)
    }, [page]);


    useEffect(() => {
        //=============GK PAKE INTERNET=============//
        // setStatus('success')
        // const dataOptinDummy = [
        //     {
        //         value: '192.2.1',
        //         label: 'All Camera'
        //     },
        //     {
        //         value: '192.168.2.166',
        //         label: 'Camera 1'
        //     },
        //     {
        //         value: '192.168.171',
        //         label: 'Camera 2'
        //     },
        // ]

        // setOptionIp(dataOptinDummy)
        //=============STOP=============//

        //=============PAKE INTERNET=============//

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
                setOptionIp(updatedOptions)
                console.log(updatedOptions, "dataOptions");
            }
        }).catch(err => console.log(err.message))
        //=============STOP=============//
    }, [])


    const handleSelectChange = (selected) => {
        setPage(1)
        setParams(
            {
                page: 1,
                name: "",
                personId: "",
                startDate: "",
                endDate: "",
                passStatus: ""
            }
        )
        setSelectedCondition("personId")
        setLogData([])
        setStatus("loading")
        console.log(logData, "selectedOptionRow123")
        setStatus("loading")
        localStorage.setItem('cameraIpNew', selected.value)
        handleSubmit(selected.value)
        setSelectedOption(selected.value);
        console.log('Selected_IP:', selected.value);

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
                        <td>{row?.passStatus === 6 || row?.passStatus === "Failed" ? "Failed" : "Success"}</td>
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
                        <td>{row?.passStatus === 6 || row?.passStatus === "Failed" ? "Failed" : "Success"}</td>
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


    const handleSelectChange2 = (selectedOption) => {
        setSelectedCondition(selectedOption.value);
        console.log(selectedOption.value, "selectedOptionRow");
        setParams({
            ...params,
            [selectedOption.value]: ""
        });
        console.log(params, "selectedOptionRow");
    };

    const handleChange = (e) => {
        setParams({
            ...params,
            [selectedCondition]: e.target.value
        })
    }

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
                item?.similarity,
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
                        addPendingRequest4020({ action: 'logHistory2', data: dataSendWs });
                        socket_IO_4020.connect();
                    }
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    const handleChangeStatus = (selectedOption) => {
        setParams(prevState => ({
            ...prevState,
            passStatus: selectedOption ? selectedOption.value : ""
        }));
    };

    // const handleChangeStatus = (selectedOption) => {
    //     setParams(prevState => {
    //         const newState = {
    //             ...prevState,
    //             passStatus: selectedOption ? selectedOption.value : ""
    //         };
    //         console.log(newState, "updated params in setParams callback");
    //         return newState;
    //     });
    //     console.log(selectedOption, "selectedOptionRowtest");
    // };



    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="face-reg-header">
                <div className='face-reg-filter-name'>
                    <div className='label-filter-name'>
                        <p>Filter By</p>
                        <p>{selectedCondition === "name" ? "Nama" : "Nomor Passport"}</p>
                        <p>Status</p>
                    </div>
                    <div className='value-filter-name'>
                        <Select
                            value={optionFilter.find(option => option.value === selectedCondition)}
                            onChange={handleSelectChange2}
                            options={optionFilter}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    flex: 1,
                                    width: "91.7%",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                    fontFamily: "Roboto, Arial, sans-serif",
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                }),
                            }}
                        />
                        <input type="text"
                            value={selectedCondition === "name" ? params.name : params.personId}
                            onChange={handleChange}
                            placeholder={`Enter ${selectedCondition == "name" ? "name" : "passport number"}`}
                            className='input-filter-name-1'
                        />
                        <Select
                            value={optionFilterStatus.find(option => option.value === params.passStatus) || optionFilterStatus[0]}
                            onChange={handleChangeStatus}
                            options={optionFilterStatus}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    flex: 1,
                                    width: "91.7%",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                    fontFamily: "Roboto, Arial, sans-serif",
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                }),
                            }}
                        />
                    </div>
                </div>
                <div className='face-reg-filter-kamera'>
                    <div className='label-filter-name'>
                        <p>Start Date</p>
                        <p>End Date</p>
                        <p>Select Camera</p>
                    </div>
                    <div className='value-filter-name'>
                        <input type="datetime-local"
                            value={params.startDate}
                            onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <input type="datetime-local"
                            value={params.endDate}
                            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <Select
                            value={optionIp.find(option => option.value === selectedOption)}
                            onChange={handleSelectChange}
                            options={
                                optionIp?.map((option) => (
                                    {
                                        value: option.value,
                                        label: option.label
                                    }
                                ))
                            }
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    flex: 1,
                                    width: "91.7%",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                    fontFamily: "Roboto, Arial, sans-serif",
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: "100%",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='submit-face-reg'>
                <button
                    onClick={generateExcel}
                >Export
                </button>
                <button
                    onClick={handleSearch}
                >Search
                </button>

            </div>
            {status === "loading" && (
                <div className="loading">
                    <span className="loader-loading-table"></span>
                </div>
            )}
            {status === "success" && logData &&
                <>
                    <TableLog
                        tHeader={['No', 'no plb', 'no register', 'name', 'similarity', 'recogniton status', "Recognition Time", "Image Result", "IP Camera"]}
                        tBody={logData}
                        handler={getDetailData}
                        rowRenderer={customRowRenderer}
                    />
                    {!disablePaginate && (
                        <div className="table-footer">
                            <>Show {totalDataFilter} of {pagination?.total} entries</>
                            <Pagination
                                pageCount={pagination?.last_page}
                                onPageChange={(selectedPage) => setPage(selectedPage)}
                            />
                        </div>
                    )}
                </>
            }
        </div>
    )
}

export default LogFaceReg
