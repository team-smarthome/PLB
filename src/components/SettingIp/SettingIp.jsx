import React, { useEffect, useState } from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import { apiDeleteIp, apiEditIp, apiGetAllIp, apiGetIp, apiInsertIP, apiGetAllIpFilter } from '../../services/api';
import './settingip.style.css'
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TableLog from '../TableLog/TableLog';
import Modals from '../Modal/Modal';
import { io } from 'socket.io-client';
import { Toast } from "../../components/Toast/Toast";

const SettingIp = () => {
    const [totalCameras, setTotalCameras] = useState(0);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [cameraNames, setCameraNames] = useState([]);
    const [cameraIPs, setCameraIPs] = useState([]);
    const [dataUserIp, setDataUserIp] = useState({});
    const [listCamera, setListCamera] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [detailData, setDetailData] = useState({})
    const [newWifiResults, setNewWifiResults] = useState("");
    const [canAddIpKamerea, setCanAddIpKamerea] = useState(false);
    const [status, setStatus] = useState("loading")
    const [kirimData, setSetKirimData] = useState(false)
    const [ipEdit, setIpEdit] = useState("")
    const [statusKamera, SetStatusKamera] = useState([])
    const [IpserverWebsocket, setIpserverWebsocket] = useState("")
    const [operationalStatus, setOperationalStatus] = useState();

    const handleSubmitIpServer = () => {
        setStatus("loading")
        if (newWifiResults) {
            const socket_server_4010 = io(`http://${newWifiResults}:4010`);

            socket_server_4010.emit('getCameraData')

            socket_server_4010.on('DataIPCamera', (data) => {
                if (data?.ipCamera.length === 0) {
                    console.log('DataIPCamera', data?.ipCamera.length);
                    socket_server_4010.emit('saveCameraDataFirst', { ipServerCamera: cameraIPs })
                }
            });

            socket_server_4010.on('connect', () => {
                console.log('connect to server');
                setCanAddIpKamerea(true);
                setStatus("success")
                Toast.fire({
                    icon: 'success',
                    title: 'Success Connect to Server'
                });
            });
        } else {
            setStatus("success")
            setCanAddIpKamerea(false);
            Toast.fire({
                icon: 'error',
                title: 'Please Input Ip Server'
            });
        }
    }
    const handleSubmitCrudKameraToServer = (action, params, dataApiKemera) => {
        closeModalAdd()
        closeModalDelete()
        setStatus("loading")

        //keep it
        // const editIpKamera = apiEditIp(dataApiKemera, detailData?.id);
        //                 return editIpKamera.then((res) => {
        //                     if (res.status == 200) {
        //                         fetchAllIp()
        //                         setStatus("success")
        //                         Toast.fire({
        //                             icon: "success",
        //                             title: "Data berhasil diubah",
        //                         });
        //                     }
        //                 }).catch((err) => {
        //                     setStatus("success")
        //                     Toast.fire({
        //                         icon: "error",
        //                         title: "Gagal mengubah data",
        //                     })
        //                     console.log(err);
        //                 });

        const websocketIp = localStorage.getItem('serverIPSocket')
        if (websocketIp) {
            const socket_server_4010 = io(`http://${websocketIp}:4010`);
            const sendDataToWs = {
                ipServerCamera: [params],
                operationalStatus: operationalStatus ? "Arrival" : "Departure"
            }

            const sendDataToWsEdit = {
                oldIp: ipEdit,
                newIp: dataApiKemera.ipAddress,
                operationalStatus: operationalStatus ? "Arrival" : "Departure"
            }

            if (action === "add") {
                socket_server_4010.emit("saveCameraData", sendDataToWs);
                socket_server_4010.on('saveDataCamera', (data) => {
                    if (data === "successfully") {
                        const insertIpKamera = apiInsertIP(dataApiKemera);
                        insertIpKamera.then((res) => {
                            if (res.status == 200) {
                                fetchAllIp()
                                setStatus("success")
                                Toast.fire({
                                    icon: "success",
                                    title: "Data berhasil disimpan",
                                });
                            }
                        }).catch((err) => {
                            setStatus("success")
                            Toast.fire({
                                icon: "error",
                                title: "Gagal menyimpan data ke API",
                            })
                            console.log(err);
                        });
                    } else {
                        setStatus("success")
                        Toast.fire({
                            icon: "error",
                            title: "IP Kamera Not Found",
                        });
                    }
                })
            } else if (action === "delete") {
                socket_server_4010.emit("deleteCameraData", sendDataToWs);
                socket_server_4010.on('deleteDataCamera', (data) => {
                    if (data === "successfullyDeleted") {
                        const deleteIpKamera = apiDeleteIp(dataApiKemera.id);
                        deleteIpKamera.then((res) => {
                            if (res.status == 200) {
                                fetchAllIp()
                                setStatus("success")
                                Toast.fire({
                                    icon: "success",
                                    title: "Data berhasil dihapus",
                                });
                            }
                        }).catch((err) => {
                            setStatus("success")
                            Toast.fire({
                                icon: "error",
                                title: "Gagal menghapus data",
                            })
                            console.log(err);
                        });
                    } else {
                        setStatus("success")
                        Toast.fire({
                            icon: "error",
                            title: "Gagal menghapus data",
                        });
                    }
                })
            } else if (action === "edit") {
                socket_server_4010.emit("editCameraData", sendDataToWsEdit);
                socket_server_4010.on('editDataCamera', (data) => {
                    if (data === "successfullyEdited") {
                        const editIpKamera = apiEditIp(dataApiKemera, detailData?.id);
                        editIpKamera.then((res) => {
                            if (res.status == 200) {
                                fetchAllIp()
                                setStatus("success")
                                Toast.fire({
                                    icon: "success",
                                    title: "Data berhasil diubah",
                                });
                            }
                        }).catch((err) => {
                            setStatus("success")
                            Toast.fire({
                                icon: "error",
                                title: "Gagal mengubah data",
                            })
                            console.log(err);
                        });
                    } else {
                        setStatus("success")
                        Toast.fire({
                            icon: "error",
                            title: "Gagal mengubah data",
                        });
                    }
                })
            }
        } else {
            setStatus("success")
            setCanAddIpKamerea(false)
            Toast.fire({
                icon: 'error',
                title: 'Please Input Ip Server'
            });
        }

    }

    const handleCheckStatus = () => {
        setStatus("loading")
        const websocketIp = localStorage.getItem('serverIPSocket')
        if (websocketIp) {
            const socket = io(`http://${websocketIp}:4010`);

            socket.emit("checkStatusKamera")

            socket.on("statusKameraResponse", (data) => {
                setStatus("success")
                SetStatusKamera(data)
                console.log("HASILDARISTATUSKAMERA", data)
            })

        } else {
            setStatus("success")
            setCanAddIpKamerea(false);
            Toast.fire({
                icon: 'error',
                title: 'Please Input Ip Server'
            });
        }
    }


    const optionCameras = [...Array(10)].map((_, index) => ({
        value: index + 1,
        label: `${index + 1} Kamera`,
    }));
    const getUserdata = Cookies.get('userdata');

    const fetchAllIp = async () => {
        try {
            // const res = await apiGetIp(dataUserIp?.petugas?.id);
            const res = await apiGetAllIp();
            console.log(res, 'res');
            setListCamera(res.data.data)
            if (res.data.data.length === 0) {
                setCameraNames(new Array(totalCameras).fill(''));
                setCameraIPs(new Array(totalCameras).fill(''));
                setIsEditing(false);
                setStatus("success")
            } else {
                const names = res.data.data.map(item => item.namaKamera);
                const ips = res.data.data.map(item => item.ipAddress);
                setTotalCameras(res.data.data.length);
                setCameraNames(names);
                setCameraIPs(ips);
                setIsEditing(true);
                setStatus("success")
            }
        } catch (err) {
            setStatus("success")
            console.log(err.message);
        }
    };
    useEffect(() => {
        setDataUserIp(JSON.parse(getUserdata));
        console.log(JSON.parse(getUserdata), 'hasildaricookie');


        if (dataUserIp?.petugas?.id) {
            fetchAllIp();
        }
    }, [dataUserIp?.petugas?.id, totalCameras]);

    useEffect(() => {
        handleCheckStatus()
        const websocketIp = localStorage.getItem('serverIPSocket');
        setIpserverWebsocket(websocketIp);
        console.log("nilaidariwebsocket", websocketIp);

        if (websocketIp) {
            const socket_server_4010 = io(`http://${websocketIp}:4010`);
            socket_server_4010.emit('getCameraData');
            socket_server_4010.on('DataIPCamera', (data) => {
                if (data?.ipCamera.length === 0) {
                    console.log('DataIPCamera', data?.ipCamera.length);
                    socket_server_4010.emit('saveCameraDataFirst', { ipServerCamera: cameraIPs });
                }
            });

            socket_server_4010.on('connect', () => {
                console.log('connect to server');
                setCanAddIpKamerea(true);
                setStatus("success");
                // Toast.fire({
                //     icon: 'success',
                //     title: 'Success Connect to Server'
                // });
            });
            socket_server_4010.on('connect_error', (error) => {
                console.error('Connection error:', error);
                // Toast.fire({
                //     icon: 'error',
                //     title: 'Failed to connect to the websocket server',
                // });
            });
        }

    }, [cameraIPs])



    // useEffect(async () => {
    //     await fetchAllIp();
    //     const websocketIp = localStorage.getItem('serverIPSocket')
    //     setIpserverWebsocket(websocketIp)
    //     console.log("nilaidariwebsocket", websocketIp);
    //     if (websocketIp) {
    //         const socket_server_4010 = io(`http://${websocketIp}:4010`);
    //         socket_server_4010.emit('getCameraData')
    //         socket_server_4010.on('DataIPCamera', (data) => {
    //             if (data?.ipCamera.length === 0) {
    //                 console.log('DataIPCamera', data?.ipCamera.length);
    //                 socket_server_4010.emit('saveCameraDataFirst', { ipServerCamera: cameraIPs })
    //             }
    //         });
    //         socket_server_4010.on('connect', () => {
    //             console.log('connect to server');
    //             setCanAddIpKamerea(true);
    //             setStatus("success")
    //             Toast.fire({
    //                 icon: 'success',
    //                 title: 'Success Connect to Server'
    //             });
    //         });
    //         socket_server_4010.on('connect_error', (error) => {
    //             console.error('Connection error:', error);
    //             Toast.fire({
    //                 icon: 'error',
    //                 title: 'Failed to connect to the websocket server',
    //             });
    //         });
    //     }
    // }, []);


    const handleTotalCamerasChange = (selectedOption) => {
        if (selectedOption) {
            const numCameras = selectedOption.value;
            setTotalCameras(numCameras);
            setCameraIPs(new Array(numCameras).fill(''));
            setCameraNames(new Array(numCameras).fill(''));
            setCurrentCameraIndex(0);
        } else {
            setTotalCameras(0);
            setCameraNames([]);
            setCameraIPs([]);
            setCurrentCameraIndex(0);
        }
    };

    const handleCameraNameChange = (e) => {
        const newCameraNames = [...cameraNames];
        newCameraNames[currentCameraIndex] = e.target.value;
        setCameraNames(newCameraNames);
    };

    const handleIPChange = (e) => {
        const newCameraIPs = [...cameraIPs];
        newCameraIPs[currentCameraIndex] = e.target.value;
        setCameraIPs(newCameraIPs);
    };

    const handleNextCamera = () => {
        if (currentCameraIndex < totalCameras - 1) {
            setCurrentCameraIndex(currentCameraIndex + 1);
        }
    };

    const handlePrevCamera = () => {
        if (currentCameraIndex > 0) {
            setCurrentCameraIndex(currentCameraIndex - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dataUserIp, 'dataUserIp');
        const dataApiKemera = {
            ...detailData,
            userId: dataUserIp?.petugas?.id,
            is_depart: operationalStatus
        };



        handleSubmitCrudKameraToServer("add", detailData?.ipAddress, dataApiKemera);

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(ipEdit, 'dataUserIp');
        const dataApiKemera = {
            namaKamera: detailData.namaKamera,
            ipAddress: detailData.ipAddress,
            userId: dataUserIp?.petugas?.id,
            is_depart: operationalStatus
        };

        handleSubmitCrudKameraToServer("edit", ipEdit, dataApiKemera);

        // console.log(dataApiKemera, 'dataApiKemera');
        // const editIpKamera = apiEditIp(dataApiKemera, detailData?.id);
        // editIpKamera.then((res) => {
        //     if (res.status == 200) {
        //         closeModalEdit()
        //         fetchAllIp()
        //     }
        // }).catch((err) => {
        //     console.log(err.message);
        // });

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleDelete = () => {
        handleSubmitCrudKameraToServer("delete", detailData?.ipAddress, detailData);
    }

    const openModalAdd = () => {
        // setDetailData(row)
        setModalAdd(true)
    }

    const closeModalAdd = () => {
        setDetailData({})
        setModalAdd(false)
    }
    const openModalEdit = (row) => {
        setIpEdit(row?.ipAddress)
        setDetailData({
            id: row.id,
            namaKamera: row.namaKamera,
            ipAddress: row.ipAddress,
        })
        setOperationalStatus(row.is_depart)
        setModalEdit(true)
    }

    const closeModalEdit = () => {
        setDetailData({})
        setModalEdit(false)
        setOperationalStatus(null)
    }
    const openModalDelete = (row) => {
        setDetailData(row)
        setModalDelete(true)
    }

    const closeModalDelete = () => {
        setDetailData({})
        setModalDelete(false)
    }

    const optionFilterStatus = [
        {
            value: '',
            label: 'Choose Status'
        },
        {
            value: true,
            label: 'Arrival'
        },
        {
            value: false,
            label: 'Departure'
        },
    ]

    const optionFilterStatus2 = [
        {
            value: true,
            label: 'Arrival'
        },
        {
            value: false,
            label: 'Departure'
        },
    ]


    const [formValues, setFormValues] = useState({
        namaKamera: "",
        ipAddress: "",
        statusCamera: "",
    });

    const handleChangeStatus = (selectedOption) => {
        if (selectedOption) {
            setOperationalStatus(selectedOption.value);
        }
    };

    const handleSelectChange = (key, selected) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [key]: selected ? selected.value : "",
        }));
    };

    const handleSubmitFilter = async () => {
        setStatus("loading")
        const params2 = {
            namaKamera: formValues.namaKamera,
            ipAddress: formValues.ipAddress,
            is_depart: formValues.statusCamera,
        };
        // return console.log(params2, "paramsCheckFilter");
        try {
            const response = await apiGetAllIpFilter({
                params: {
                    namaKamera: formValues.namaKamera,
                    ipAddress: formValues.ipAddress,
                    is_depart: formValues.statusCamera,
                }
            });
            setListCamera(response.data.data);
            setStatus("success")
        } catch (error) {
            setStatus("success")
            console.error("Error:", error);
        }
    };



    const customRowRenderer = (row) => {
        const kameraStatus = statusKamera.find(item => item.ip === row.ipAddress);
        return (
            <>
                <td>{row.namaKamera}</td>
                <td>{row.ipAddress}</td>
                <td>{row.is_depart ? "Arrival" : "Departure"}</td>
                <td>
                    {kameraStatus ? (
                        <div style={{ color: kameraStatus.status === 'error' ? 'red' : 'green' }}>
                            {kameraStatus.status === 'error' ? 'Inactive' : 'Active'}
                        </div>
                    ) : (
                        <div style={{ color: 'gray' }}>Unknown</div>
                    )}
                </td>

                <td className='button-action' style={{ height: '100px', display: 'flex', alignItems: "center" }}>
                    <button
                        onClick={() => openModalEdit(row)}
                        disabled={!canAddIpKamerea}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => openModalDelete(row)}
                        style={{ background: 'red' }}
                        disabled={!canAddIpKamerea}
                    >
                        Delete
                    </button>
                </td>

            </>
        );
    };

    const modalAddLayout = () => (
        <div className="modal-edit-container">
            <div className="input-config">
                <span>Camera Name</span>
                <input type="text"
                    value={detailData?.namaKamera}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>Camera IP</span>
                <input type="text"
                    value={detailData?.ipAddress}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>Depart Status</span>
                <Select
                    value={optionFilterStatus.find((option) => option.value === operationalStatus) || optionFilterStatus[0]}
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
    )
    const modalEditLayout = () => (
        <div className="modal-edit-container">
            <div className="input-config">
                <span>Nama Kamera</span>
                <input type="text"
                    value={detailData?.namaKamera}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>IP Kamera</span>
                <input type="text"
                    value={detailData?.ipAddress}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
            <div className="input-config">
                <span>Operasional</span>
                <Select
                    value={optionFilterStatus.find((option) => option.value === operationalStatus) || optionFilterStatus[0]}
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
    )

    const modalDeleteLayout = () => {
        return (
            <div className="" >
                <span
                    style={{ fontSize: 20, fontWeight: '400' }}
                >Are You Sure Want Delete <span style={{ fontWeight: "bold" }}>{detailData.namaKamera}</span> with ip address <span style={{ fontWeight: "bold" }}>{detailData.ipAddress}</span> ?</span>
            </div>
        )
    }
    return (
        <>
            <div className='config-container'>
                <div className='flex'>
                    <div className='flex flex-1'>
                        <div className='flex flex-col gap-4 text-lg text-[#3D5889] items-start pt-5 justify-center w-[25%]'>
                            <p>Camera Name</p>
                            <p>Camera IP</p>
                        </div>
                        <div className='w-[70%] flex flex-col gap-2'>
                            <Select
                                options={[
                                    { value: "", label: "All Camera Name" },
                                    ...listCamera.map((item) => ({
                                        value: item.namaKamera,
                                        label: item.namaKamera,
                                    })),
                                ]}
                                placeholder="Select Camera Name"
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={{ value: "", label: "All Camera Name" }}
                                onChange={(selected) => handleSelectChange("namaKamera", selected)}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '42px',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />
                            <Select
                                options={[
                                    { value: "", label: "All Camera IP" },
                                    ...listCamera.map((item) => ({
                                        value: item.ipAddress,
                                        label: item.ipAddress,
                                    })),
                                ]}
                                placeholder="Select Camera IP"
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={{ value: "", label: "All Camera IP" }}
                                onChange={(selected) => handleSelectChange("ipAddress", selected)}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '42px',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex flex-1'>
                        <div className='flex flex-col gap-4 text-lg text-[#3D5889] items-start pt-5 w-[25%]'>
                            <p>Status Camera</p>
                        </div>
                        <div className='w-[70%] flex flex-col pt-1'>
                            <Select
                                options={[
                                    { value: "", label: "All Status Camera" },
                                    ...optionFilterStatus2,
                                ]}
                                placeholder="Select Status Camera"
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={{ value: "", label: "All Status Camera" }}
                                onChange={(selected) => handleSelectChange("statusCamera", selected)}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '42px',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* <div className=' flex'>
                    <div className='flex flex-1 '>
                        <div className=' flex flex-col gap-4 text-lg text-[#3D5889] items-start pt-5 justify-center w-[25%] '>
                            <p>Camera Name</p>
                            <p>Camera IP</p>
                        </div>
                        <div className='w-[70%] flex  flex-col  gap-2'>
                            <Select
                                options={listCamera.map((item) => ({
                                    value: item.ipAddress,
                                    label: item.namaKamera,
                                }))}
                                placeholder="Select Camera Name"
                                className="basic-single  "
                                classNamePrefix="select"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '45px',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />
                            <Select
                                options={listCamera.map((item) => ({
                                    value: item.ipAddress,
                                    label: item.ipAddress,
                                }))}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select Camera IP"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '45px',
                                        width: '100%',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,

                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex flex-1 '>
                        <div className=' flex flex-col gap-4 text-lg text-[#3D5889] items-start pt-5  w-[25%] '>
                            <p>Status Camera</p>
                        </div>
                        <div className='w-[70%] flex  flex-col pt-1'>
                            <Select
                                options={optionFilterStatus2}
                                placeholder="Select Status Camera"
                                className="basic-single  "
                                classNamePrefix="select"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        height: '45px',
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                        fontFamily: 'Roboto, Arial, sans-serif',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    }),
                                }}
                            />

                        </div>
                    </div>
                </div > */}
                <div className='submit-face-reg'>
                    <button
                        style={{
                            backgroundColor: '#3DBB6F',
                            width: '10%',

                        }}
                        onClick={handleCheckStatus}
                    >Check Status
                    </button>
                    <button
                        style={{
                            backgroundColor: '#4F70AB',
                        }}
                        onClick={handleSubmitFilter}
                    >Search
                    </button>
                    {canAddIpKamerea && (
                        <>
                            <button
                                onClick={openModalAdd}
                            >Add
                            </button>
                        </>
                    )}



                </div>
                {
                    status === "loading" && (
                        <div className="loading">
                            <span className="loader-loading-table"></span>
                        </div>
                    )
                }
                {
                    status === "success" &&
                    <>
                        <TableLog
                            tHeader={['no', 'Nama Kamera', "Ip Address", "Depart Status", "Status", "Action"]}
                            tBody={listCamera}
                            rowRenderer={customRowRenderer}
                        />
                    </>
                }
                <Modals
                    buttonName="Submit"
                    headerName="Add Kamera"
                    closeModal={closeModalAdd}
                    showModal={modalAdd}
                    onConfirm={handleSubmit}
                >
                    {modalAddLayout()}
                </Modals>
                <Modals
                    buttonName="Submit"
                    headerName="Edit Kamera"
                    closeModal={closeModalEdit}
                    showModal={modalEdit}
                    onConfirm={handleEdit}
                >
                    {modalEditLayout()}
                </Modals>
                <Modals
                    buttonName="Submit"
                    headerName="Delete Kamera"
                    closeModal={closeModalDelete}
                    showModal={modalDelete}
                    onConfirm={handleDelete}
                >
                    {modalDeleteLayout()}
                </Modals>
                {/* <form
                // className=""
                onSubmit={isEditing ? handleEdit : handleSubmit} // Adjust submit handler based on mode
            // style={{ width: "120vh" }}
            >
                <div className="form-group">
                    <div className="wrapper-form">
                        <div className="wrapper-input">
                            <label htmlFor="total_cameras">Jumlah Kamera</label>
                        </div>
                        <Select
                            id="totalCameras"
                            name="totalCameras"
                            value={optionCameras.find(option => option.value === totalCameras)}
                            onChange={handleTotalCamerasChange}
                            options={optionCameras}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'rgba(217, 217, 217, 0.75)',
                                }),
                            }}
                        />
                    </div>
                </div>

                {totalCameras > 0 && (
                    <div className="form-group">
                        <div className="wrapper-form">
                            <div className="wrapper-input">
                                <label htmlFor="cameraName">Masukkan Nama Kamera {currentCameraIndex + 1}</label>
                            </div>
                            <input
                                type="text"
                                id="cameraName"
                                name="cameraName"
                                placeholder={`Nama Kamera ${currentCameraIndex + 1}`}
                                onChange={handleCameraNameChange}
                                value={cameraNames[currentCameraIndex] || ''}
                            />
                        </div>
                    </div>
                )}

                {totalCameras > 0 && (
                    <div className="form-group">
                        <div className="wrapper-form">
                            <div className="wrapper-input">
                                <label htmlFor="cameraIP">Masukkan IP untuk Kamera {currentCameraIndex + 1}</label>
                            </div>
                            <input
                                type="text"
                                id="cameraIP"
                                name="cameraIP"
                                onChange={handleIPChange}
                                value={cameraIPs[currentCameraIndex] || ''}
                            />
                        </div>
                    </div>
                )}

                <div className='button-config-list'>
                    <button
                        type="button"
                        onClick={handlePrevCamera}
                        disabled={currentCameraIndex === 0}
                    >
                        <MdKeyboardDoubleArrowLeft
                            size={16}
                        />
                        Sebelumnya
                    </button>
                    <button
                        type="button"
                        onClick={handleNextCamera}
                        disabled={currentCameraIndex === totalCameras - 1}
                    >
                        Berikutnya
                        <MdKeyboardDoubleArrowRight
                            size={16}
                        />
                    </button>
                </div>
            </form> */}
                {/* <div className="btn-submit">
                <button
                    type="submit"
                // className="btn-submit"
                >
                    {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                </button>
            </div> */}
                {/* <button
                onClick={handleDelete}
            >
                Delete
            </button> */}
            </div >
        </>
    );
};

export default SettingIp;
