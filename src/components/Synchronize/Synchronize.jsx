import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Toast } from "../../components/Toast/Toast";
import { apiGetDataLogRegister, apiInsertIP } from '../../services/api';
import Cookies from 'js-cookie';
import Select from 'react-select';  // Import React Select

const Synchronize = () => {
    const [ipServerSynch, setIpServerSynch] = useState("");
    const [loading, setLoading] = useState(false);
    const [detailData, setDetailData] = useState({
        is_depart: null // default to null
    });
    let socket_server_4010;

    useEffect(() => {
        const serverIPSocket = localStorage.getItem('serverIPSocket');
        if (serverIPSocket) {
            setIpServerSynch(serverIPSocket);
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        if (!detailData?.ipAddress) {
            Toast.fire({
                icon: 'error',
                title: 'Please input the IP camera',
            });
            setLoading(false);
            return;
        } else if (!detailData?.namaKamera) {
            Toast.fire({
                icon: 'error',
                title: 'Please input the camera name',
            });
            setLoading(false);
            return;
        } else if (detailData?.is_depart === null) {
            Toast.fire({
                icon: 'error',
                title: 'Please select the depart status',
            });
            setLoading(false);
            return;
        }

        console.log("MASUKKESINI");
        const nilaiIp = detailData?.ipAddress;
        let paramsToSend = {
            method: "addfaceinfonotify",
            params: {
                data: [],
            },
        };

        const sendDataToWsSynch = {
            ipServerCamera: [nilaiIp]
        }

        const getDataUserCookie = Cookies.get('userdata');
        const dataUserIp = JSON.parse(getDataUserCookie);
        const dataApiKemera = {
            ...detailData,
            userId: dataUserIp?.petugas?.id,
        };

        if (ipServerSynch) {
            socket_server_4010 = io(`http://${ipServerSynch}:4010`);
            try {
                setLoading(true);
                socket_server_4010.emit('saveCameraData', sendDataToWsSynch);
                await socket_server_4010.on('saveDataCamera', async (data) => {
                    if (data === "successfully") {
                        const res = await apiGetDataLogRegister();
                        const dataApi = res.data.data;

                        if (res.data.status === 200) {
                            dataApi.forEach(item => {
                                paramsToSend.params.data.push({
                                    personId: item?.no_passport,
                                    personNum: item?.no_passport,
                                    personName: item?.name,
                                    personGender: item?.gender === "M" ? 1 : 0,
                                    validStartTime: Math.floor(new Date().getTime() / 1000).toString(),
                                    validEndTime: Math.floor(new Date(`${item.expired_date}T23:59:00`).getTime() / 1000).toString(),
                                    identityDataBase64: item?.profile_image,
                                    status: 0,
                                    reserve: "",
                                });
                            });

                            socket_server_4010.emit('sync', { paramsToSend, nilaiIp });
                            socket_server_4010.on('responseSync', (data) => {
                                if (data === "Successfully") {
                                    const insertIpKamera = apiInsertIP(dataApiKemera);
                                    insertIpKamera.then((res) => {
                                        if (res.status === 200) {
                                            setLoading(false);
                                            Toast.fire({
                                                icon: 'success',
                                                title: 'Successfully synchronized',
                                            });
                                        }
                                    }).catch((err) => {
                                        Toast.fire({
                                            icon: "error",
                                            title: "Failed to save data to API",
                                        })
                                        setLoading(false);
                                    });
                                } else {
                                    Toast.fire({
                                        icon: 'error',
                                        title: 'Failed to synchronize',
                                    });
                                    setLoading(false);
                                }
                            });
                        }
                    } else {
                        setLoading(false);
                        Toast.fire({
                            icon: "error",
                            title: "IP Camera Not Found",
                        });
                    }
                })
            } catch (error) {
                Toast.fire({
                    icon: 'error',
                    title: 'Failed to Get Data from API',
                });
                setLoading(false);
            }
        } else {
            setLoading(false);
            Toast.fire({
                icon: 'error',
                title: 'Please input the server IP',
            });
        }
    };

    // Options for React Select
    const departOptions = [
        { value: true, label: 'Arrival' },
        { value: false, label: 'Departure' }
    ];

    return (
        <div className="flex flex-col h-full gap-6">
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-xl">
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
                        <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                        <span className="mt-2 text-sm text-gray-600">Synchronizing...</span>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-navy-900">Set IP Camera To Synchronize</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure and synchronize camera settings</p>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label htmlFor="cameraName" className="text-sm font-semibold text-gray-700">Camera Name</label>
                        <input
                            type="text"
                            name="cameraName"
                            id="cameraName"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={detailData?.namaKamera || ""}
                            onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label htmlFor="ipCamera" className="text-sm font-semibold text-gray-700">IP Camera</label>
                        <input
                            type="text"
                            name="ipCamera"
                            id="ipCamera"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={detailData?.ipAddress || ""}
                            onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label htmlFor="isDepart" className="text-sm font-semibold text-gray-700">Depart Status</label>
                        <Select
                            id="isDepart"
                            options={departOptions}
                            placeholder="Choose Status"
                            value={departOptions.find(option => option.value === detailData.is_depart)}
                            onChange={(selectedOption) => setDetailData({ ...detailData, is_depart: selectedOption.value })}
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
                    <button 
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm h-[42px] w-full md:w-auto" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Synchronize
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Synchronize;
