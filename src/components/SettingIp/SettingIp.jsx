import React, { useEffect, useState } from 'react';
import Select from "react-select";
import Cookies from 'js-cookie';
import { apiDeleteIp, apiEditIp, apiGetAllIp, apiGetIp, apiInsertIP, apiGetAllIpFilter } from '../../services/api';
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
                <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_depart ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {row.is_depart ? "Departure" : "Arrival"}
                    </span>
                </td>
                <td>
                    {kameraStatus ? (
                        <div className={`flex items-center gap-2 ${kameraStatus.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            <span className={`w-2 h-2 rounded-full ${kameraStatus.status === 'error' ? 'bg-red-600' : 'bg-green-600'}`}></span>
                            <span className="font-medium text-sm">{kameraStatus.status === 'error' ? 'Inactive' : 'Active'}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span className="font-medium text-sm">Unknown</span>
                        </div>
                    )}
                </td>

                <td>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openModalEdit(row)}
                            disabled={!canAddIpKamerea}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!canAddIpKamerea ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => openModalDelete(row)}
                            disabled={!canAddIpKamerea}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!canAddIpKamerea ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </>
        );
    };

    const modalAddLayout = () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Camera Name</span>
                <input type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={detailData?.namaKamera || ''}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Camera IP</span>
                <input type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={detailData?.ipAddress || ''}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Depart Status</span>
                <Select
                    value={optionFilterStatus.find((option) => option.value === operationalStatus) || optionFilterStatus[0]}
                    onChange={handleChangeStatus}
                    options={optionFilterStatus}
                    className="text-sm"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: '#e5e7eb',
                            borderRadius: '0.5rem',
                            minHeight: '42px',
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: '#3b82f6'
                            }
                        })
                    }}
                />
            </div>
        </div>
    )

    const modalEditLayout = () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Nama Kamera</span>
                <input type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={detailData?.namaKamera || ''}
                    onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">IP Kamera</span>
                <input type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={detailData?.ipAddress || ''}
                    onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-gray-700">Operasional</span>
                <Select
                    value={optionFilterStatus.find((option) => option.value === operationalStatus) || optionFilterStatus[0]}
                    onChange={handleChangeStatus}
                    options={optionFilterStatus}
                    className="text-sm"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: '#e5e7eb',
                            borderRadius: '0.5rem',
                            minHeight: '42px',
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: '#3b82f6'
                            }
                        })
                    }}
                />
            </div>
        </div>
    )

    const modalDeleteLayout = () => {
        return (
            <div className="py-4 text-center">
                <span className="text-lg text-gray-700">
                    Are You Sure Want Delete <span className="font-bold text-navy-900">{detailData.namaKamera}</span> with ip address <span className="font-bold text-navy-900">{detailData.ipAddress}</span>?
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Setting IP Kamera</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola dan monitor alamat IP kamera untuk sistem.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden relative">
                <div className="p-6 border-b border-gray-100 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Camera Filters */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3 justify-center text-sm font-semibold text-gray-700 w-1/4">
                                <p>Camera Name</p>
                                <p className="mt-2">Camera IP</p>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <Select
                                    options={[
                                        { value: "", label: "All Camera Name" },
                                        ...Array.from(new Set(listCamera.map(item => item.namaKamera))).map(namaKamera => ({
                                            value: namaKamera,
                                            label: namaKamera,
                                        })),
                                    ]}
                                    placeholder="Select Camera Name"
                                    defaultValue={{ value: "", label: "All Camera Name" }}
                                    onChange={(selected) => handleSelectChange("namaKamera", selected)}
                                    className="text-sm"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderColor: '#e5e7eb',
                                            borderRadius: '0.5rem',
                                            minHeight: '40px'
                                        })
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
                                    defaultValue={{ value: "", label: "All Camera IP" }}
                                    onChange={(selected) => handleSelectChange("ipAddress", selected)}
                                    className="text-sm"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderColor: '#e5e7eb',
                                            borderRadius: '0.5rem',
                                            minHeight: '40px'
                                        })
                                    }}
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3 justify-start pt-2 text-sm font-semibold text-gray-700 w-1/4">
                                <p>Status Camera</p>
                            </div>
                            <div className="flex flex-col flex-1">
                                <Select
                                    options={[
                                        { value: "", label: "All Status Camera" },
                                        ...optionFilterStatus2,
                                    ]}
                                    placeholder="Select Status Camera"
                                    defaultValue={{ value: "", label: "All Status Camera" }}
                                    onChange={(selected) => handleSelectChange("statusCamera", selected)}
                                    className="text-sm"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderColor: '#e5e7eb',
                                            borderRadius: '0.5rem',
                                            minHeight: '40px'
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end pt-2 border-t border-gray-100 mt-2">
                        <button
                            onClick={fetchAllIp}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                        >
                            Check Status
                        </button>
                        <button
                            onClick={handleSubmitFilter}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Search
                        </button>
                        {canAddIpKamerea && (
                            <button
                                onClick={openModalAdd}
                                className="px-6 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                Add Camera
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-white p-6 pt-0">
                    {status === "loading" && (
                        <div className="flex justify-center items-center h-40">
                            <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                        </div>
                    )}
                    
                    {status === "success" && (
                        <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
                            <TableLog
                                tHeader={['Nama Kamera', "Ip Address", "Depart Status", "Status", "Action"]}
                                tBody={listCamera}
                                showIndex={true}
                                rowRenderer={customRowRenderer}
                            />
                        </div>
                    )}
                </div>

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
            </div>
        </div>
    );
};

export default SettingIp;
