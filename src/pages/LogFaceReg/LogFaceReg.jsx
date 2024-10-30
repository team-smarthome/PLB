import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import { useNavigate } from 'react-router-dom'
import { addPendingRequest4020, initiateSocket4020 } from '../../utils/socket'
import './logfacereg.style.css'
import { apiGetAllIp, apiGetIp, apiInsertLog, getDataLogApi } from '../../services/api'
import axios from 'axios'
import Cookies from 'js-cookie';
import Select from "react-select";
import Pagination from '../../components/Pagination/Pagination'
import ImgsViewer from "react-images-viewer";

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket_IO_4020 = initiateSocket4020();
    const [logData, setLogData] = useState([])
    const [optionIp, setOptionIp] = useState([])
    const [status, setStatus] = useState("loading")
    const ipCameraLocalStorage = localStorage.getItem('cameraIpNew')
    const isDepartLocalStorage = localStorage.getItem('isDepart')
    const [selectedOption, setSelectedOption] = useState('192.2.1');
    const [selectedCondition, setSelectedCondition] = useState('personId');
    const [totalDataFilter, setTotalDataFilter] = useState(0);
    const [page, setPage] = useState(1);
    const [changePage, setChangePage] = useState(false)
    const [disablePaginate, setDisablePaginate] = useState(false)
    const [isOpenImage, setIsOpenImage] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [params, setParams] = useState({
        page: page,
        name: "",
        personId: "",
        startDate: "",
        endDate: "",
        passStatus: ""
    })
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

    const handleEpochToDate = (epoch) => {
        const date = new Date(epoch * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate, "dataConvert");
        return formattedDate;
    };

    async function fetchImageAsBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    }

    useEffect(() => {
        if (selectedOption !== "192.2.1") {
            setDisablePaginate(true)
        } else {
            setDisablePaginate(false)
        }
        const ipCameraNew = localStorage.getItem('cameraIpNew');
        const isDepartNew = localStorage.getItem('isDepart');
        console.log(isDepartNew, 'test1234')

        console.log(selectedCondition, 'test1234')

        if (ipCameraNew && selectedOption !== "192.2.1") {
            socket_IO_4020.on("responseHistoryLogs", async (data) => {
                if (data.length > 0) {
                    setStatus("success");
                    setLogData(data);

                    const dataInsertArray = await Promise.all(data.map(async (item) => {
                        const base64Image = await fetchImageAsBase64(`http://${ipCameraNew}/ofsimage/${item.images_info[0]?.img_path}`);
                        return {
                            personId: item.personId,
                            personCode: item.personCode,
                            name: item.name,
                            similarity: item.images_info[0]?.similarity,
                            passStatus: item.passStatus === 6 ? "Failed" : "Success",
                            time: item.time,
                            img_path: base64Image,
                            ipCamera: ipCameraNew,
                            is_depart: isDepartNew,
                        };
                    }));

                    console.log(dataInsertArray, "dataInsertArray");
                    try {
                        const res = await apiInsertLog(dataInsertArray);
                        console.log(res, "responInsert");

                        if (res.status === 201) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            if (socket_IO_4020.connected) {
                                console.log("masuk_sini_socket");
                                socket_IO_4020.emit('historyLog');
                            } else {
                                console.log("masuk_sini_socket_gagal");
                                addPendingRequest4020({ action: 'historyLog' });
                                socket_IO_4020.connect();
                            }
                        } else {
                            console.log("masuk_sini_gagal");
                        }
                    } catch (err) {
                        console.error("Error inserting data:", err);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        if (socket_IO_4020.connected) {
                            console.log("masuk_sini_socket");
                            socket_IO_4020.emit('historyLog');
                        } else {
                            console.log("masuk_sini_socket_gagal");
                            addPendingRequest4020({ action: 'historyLog' });
                            socket_IO_4020.connect();
                        }
                    }
                } else {
                    handleSubmit(selectedOption);
                    setStatus("success");
                }
            });

            return () => {
                socket_IO_4020.off('responseHistoryLogs');
                socket_IO_4020.off('historyLog');
            };
        } else {
            setStatus("loading")
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
        // const getAllIp = apiGetIp(JSON.parse(getDataIp)?.petugas?.id);
        const getAllIp = apiGetAllIp();
        getAllIp.then(res => {
            if (res.data.status === 200) {
                const dataOptions = res.data.data.map(item => ({
                    value: { ipAddress: item.ipAddress, isDepart: item.is_depart },
                    label: `${item.namaKamera} - ${item.ipAddress} ( ${item.is_depart ? "Arrival" : "Departure"} )`,
                }));
                const defaultOption = {
                    value: { ipAddress: '', isDepart: "" },
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

    const handleSelectChangeCustom = (selected) => {
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
        localStorage.setItem('cameraIpNew', selected.value?.ipAddress)
        localStorage.setItem('isDepart', selected.value?.isDepart)
        handleSubmit(selected.value?.ipAddress)
        setSelectedOption(selected.value?.ipAddress);
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
                        {/* <td>{row?.personCode}</td> */}
                        <td>{row?.name}</td>
                        <td>{row?.similarity}</td>
                        <td>{row?.passStatus === 6 || row?.passStatus === "Failed" ? "Failed" : "Success"}</td>
                        <td>{handleEpochToDate(row?.time)}</td>
                        <td>
                            <img
                                src={`data:image/jpeg;base64,${row?.image_base64}`}
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
                        {/* <td>{row?.personCode}</td> */}
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
        // console.log(row.personCode)
        navigate('/validation', { state: { detailDataLog: row.personCode, isCp: true } })
    }

    const generateExcel = () => {
        const Excel = require("exceljs");
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        const headers = ['No', 'no plb', 'name', 'similarity', 'recogniton status', "Recognition Time"]
        worksheet.addRow(headers);

        logData.forEach((item, index) => {
            const row = [
                index + 1,
                item.personId,
                // item.personCode,
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

    const resultArray = logData.map(item => ({ src: !selectedOption.includes("192.168") ? item.img_path : `http://${ipCameraLocalStorage}${item.sSnapshotPath}` }));
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
                            onChange={handleSelectChangeCustom}
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
                    style={{
                        backgroundColor: '#4F70AB',
                    }}
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
                        tHeader={['No', 'no plb', 'name', 'similarity', 'recogniton status', "Recognition Time", "Image Result", "IP Camera"]}
                        tBody={logData}
                        handler={handleOpenImage}
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
            <ImgsViewer
                imgs={resultArray}
                isOpen={isOpenImage}
                onClickPrev={prevImage}
                onClickNext={nextImage}
                onClose={() => { setIsOpenImage(false) }}
                currImg={currentImage}
            />
        </div >
    )
}

export default LogFaceReg
