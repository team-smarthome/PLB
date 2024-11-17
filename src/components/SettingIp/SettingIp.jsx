import React, { useEffect, useState } from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import { apiDeleteIp, apiEditIp, apiGetAllIp, apiGetIp, apiInsertIP, apiGetAllIpFilter } from '../../services/api';
import './settingip.style.css'
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import TableLog from '../TableLog/TableLog';
import Modals from '../Modal/Modal';
import { Toast } from "../../components/Toast/Toast";
import { initiateSocket4010 } from '../../utils/socket';


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
    const socket_IO_4010 = initiateSocket4010();



    const handleSubmitCrudKameraToServer = (action, params, dataApiKemera) => {
        closeModalAdd()
        closeModalDelete()
        setStatus("loading")
        closeModalEdit()
        const sendDataToWs = {
            ipServerCamera: [params],
            operationalStatus: operationalStatus ? "Departure" : "Arrival"
        }

        const sendDataToWsEdit = {
            oldIp: ipEdit,
            ipServerCamera: [dataApiKemera.ipAddress],
            operationalStatus: operationalStatus ? "Departure" : "Arrival"
        }

        if (action === "add") {
            console.log("sendDataToWs", sendDataToWs);
            socket_IO_4010.emit("saveCameraData", sendDataToWs);
            socket_IO_4010.once('saveDataCamera', (data) => {
                if (data === "successfully") {
                    const insertIpKamera = apiInsertIP(dataApiKemera);
                    insertIpKamera.then((res) => {
                        if (res.status == 200) {
                            fetchAllIpAction()
                            setStatus("success")
                            Toast.fire({
                                icon: "success",
                                title: "Data berhasil disimpan",
                            });
                        }
                    }).catch((err) => {
                        const { response } = err
                        console.log("messsage12346", response?.data?.message)
                        setStatus("success")
                        Toast.fire({
                            icon: "error",
                            title: response?.data?.message || "Internal Server Error"
                        })
                        console.log(err);
                    });
                } else {
                    setStatus("success")
                    Toast.fire({
                        icon: "error",
                        title: data,
                    });
                }
            })
        } else if (action === "delete") {
            const deleteIpKamera = apiDeleteIp(dataApiKemera.id);
            deleteIpKamera.then((res) => {
                if (res.status == 200) {
                    fetchAllIpAction()
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
        } else if (action === "edit") {
            socket_IO_4010.emit("editCameraData", sendDataToWsEdit);
            socket_IO_4010.once('editDataCamera', (data) => {
                if (data === "successfully") {
                    const editIpKamera = apiEditIp(dataApiKemera, detailData?.id);
                    editIpKamera.then((res) => {
                        if (res.status == 200) {
                            fetchAllIpAction()
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
    }


    const handleCheckStatus = (listCamera) => {
        return new Promise((resolve, reject) => {
            setStatus("loading");
            socket_IO_4010.emit("checkStatusKamera", listCamera);
            socket_IO_4010.once("statusKameraResponse", (data) => {
                setStatus("success");
                SetStatusKamera(data);
                console.log("HASILDARISTATUSKAMERA", data);
                resolve(data);
            });

            socket_IO_4010.once('connect_error', (error) => {
                console.log('Connection error:', error);
                setStatus("success");
                SetStatusKamera([]);
                Toast.fire({
                    icon: 'error',
                    title: 'Gagal terhubung ke server!',
                });
                reject(error);
            });
        });
    };


    useEffect(() => {
        fetchAllIp();
        const userCookie = Cookies.get('userdata');
        const userInfo = JSON.parse(userCookie);
        setDataUserIp(userInfo);

        if (socket_IO_4010.connected) {
            console.log('Already connected to server');
            setCanAddIpKamerea(true);
            return;
        }
        socket_IO_4010.on('connect', () => {
            console.log('Connected to server');
            setCanAddIpKamerea(true);
            return;
        });

    }, []);


    const fetchAllIpAction = async () => {
        const userCookie = Cookies.get('userdata');

        if (!userCookie) {
            console.error("No user cookie found");
            return;
        }

        const userInfo = JSON.parse(userCookie);

        try {
            const res = await apiGetAllIp(userInfo?.tpi_id);
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
            }
        } catch (err) {
            setStatus("success")
            console.log(err.message);
        }
    };



    const fetchAllIp = async () => {
        const userCookie = Cookies.get('userdata');

        if (!userCookie) {
            console.error("No user cookie found");
            return;
        }

        const userInfo = JSON.parse(userCookie);

        try {
            const res = await apiGetAllIp(userInfo?.tpi_id);
            setListCamera(res.data.data)
            if (res.data.data.length === 0) {
                setCameraNames(new Array(totalCameras).fill(''));
                setCameraIPs(new Array(totalCameras).fill(''));
                setIsEditing(false);
                setStatus("success")
            } else {
                await handleCheckStatus(res.data.data);
                const names = res.data.data.map(item => item.namaKamera);
                const ips = res.data.data.map(item => item.ipAddress);
                setTotalCameras(res.data.data.length);
                setCameraNames(names);
                setCameraIPs(ips);
                setIsEditing(true);
            }
        } catch (err) {
            setStatus("success")
            console.log(err.message);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dataUserIp, 'dataUserIp');
        const dataApiKemera = {
            ...detailData,
            tpi_id: dataUserIp?.tpi_id,
            is_depart: operationalStatus
        };
        handleSubmitCrudKameraToServer("add", detailData?.ipAddress, dataApiKemera);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        const dataApiKemera = {
            namaKamera: detailData.namaKamera,
            ipAddress: detailData.ipAddress,
            tpi_id: dataUserIp?.tpi_id,
            is_depart: operationalStatus
        };

        handleSubmitCrudKameraToServer("edit", ipEdit, dataApiKemera);

        console.log('Form_submitted:', { totalCameras, cameraNames, cameraIPs });
    };

    const handleDelete = () => {
        handleSubmitCrudKameraToServer("delete", detailData?.ipAddress, detailData);
    }

    const openModalAdd = () => {
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
            value: false,
            label: 'Arrival'
        },
        {
            value: true,
            label: 'Departure'
        },
    ]

    const optionFilterStatus2 = [
        {
            value: false,
            label: 'Arrival'
        },
        {
            value: true,
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
                <td>{row.is_depart ? "Departure" : "Arrival"}</td>
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
                                    ...Array.from(new Set(listCamera.map(item => item.namaKamera))).map(namaKamera => ({
                                        value: namaKamera,
                                        label: namaKamera,
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
                                    ...Array.from(
                                        new Set(listCamera.map((item) => item.ipAddress))
                                    ).map((uniqueIp) => ({
                                        value: uniqueIp,
                                        label: uniqueIp,
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
                        onClick={fetchAllIp}
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
                            tHeader={['Nama Kamera', "Ip Address", "Depart Status", "Status", "Action"]}
                            tBody={listCamera}
                            showIndex={true}
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
            </div >
        </>
    );
};

export default SettingIp;
