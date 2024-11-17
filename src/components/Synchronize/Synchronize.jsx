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
        <div className='container-server'>
            {loading && (
                <div className="loading">
                    <span className="loader-loading-table"></span>
                    <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <div className='container-dalam'>
                <div className='bagian-atas-server'>
                    <p className=''>Set IP Camera To Synchronize</p>
                </div>
                <div className='bagian-bawah-server flex gap-6'>
                    <div className="w-full flex items-center ">
                        <label htmlFor="cameraName" className='w-[30%]'>Camera Name</label>
                        <input
                            type="text"
                            name="cameraName"
                            id="cameraName"
                            value={detailData?.namaKamera}
                            onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                        />
                    </div>
                    <div className="w-full flex items-center">
                        <label htmlFor="ipCamera" className='w-[30%]'>IP Camera</label>
                        <input
                            type="text"
                            name="ipCamera"
                            id="ipCamera"
                            value={detailData?.ipAddress}
                            onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                        />
                    </div>
                    <div className="w-full flex items-center">
                        <label htmlFor="isDepart" className='w-[30%]'>Depart Status</label>
                        <Select
                            id="isDepart"
                            options={departOptions}
                            placeholder="Choose Status"
                            value={departOptions.find(option => option.value === detailData.is_depart)}
                            onChange={(selectedOption) => setDetailData({ ...detailData, is_depart: selectedOption.value })}
                            className='w-[70%]'
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#E0E0E0',
                                    fontSize: '16px',
                                }),
                                option: (base) => ({
                                    ...base,
                                    fontSize: '16px',
                                }),
                            }}
                        />
                    </div>
                    <button className="ok-button" onClick={handleSubmit}>
                        Synchronize
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Synchronize;
