import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { Toast } from "../../components/Toast/Toast";
import { apiGetDataLogRegister, apiInsertIP } from '../../services/api';
import Cookies from 'js-cookie';

const Synchronize = () => {
    const [ipServerSynch, setIpServerSynch] = useState("");
    const [loading, setLoading] = useState(false);
    const [detailData, setDetailData] = useState({})
    let socket_server_4010;


    useEffect(() => {
        const serverIPSocket = localStorage.getItem('serverIPSocket');
        if (serverIPSocket) {
            setIpServerSynch(serverIPSocket);
            // setNewWifiResults(serverIPSocket);
        }
    }, []);
    const handleSubmit = async () => {
        setLoading(true);
        const nilaiIp = detailData?.ipAddress;
        let paramsToSend = {
            method: "addfaceinfonotify",
            params: {
                data: [],
            },
        };
        const getDataUserCookie = Cookies.get('userdata');
        const dataUserIp = JSON.parse(getDataUserCookie);
        const dataApiKemera = {
            ...detailData,
            userId: dataUserIp?.petugas?.id,
        };
        if (ipServerSynch) {
            // socket_server_4010 = io(`http://${ipServerSynch}:4010`);
            socket_server_4010 = io(`http://127.0.0.1:4010`);
            try {
                const res = await apiGetDataLogRegister();
                const dataApi = res.data.data;

                if (res.data.status === 200) {
                    dataApi.forEach(item => {
                        paramsToSend.params.data.push({
                            personId: item?.no_passport,
                            personNum: item?.no_passport,
                            passStrategyId: "",
                            personIDType: 1,
                            personName: item?.name,
                            personGender: item?.gender === "M" ? 1 : 0,
                            validStartTime: Math.floor(new Date().getTime() / 1000).toString(),
                            validEndTime: Math.floor(new Date(`${item.expired_date}T23:59:00`).getTime() / 1000).toString(),
                            personType: 1,
                            identityType: 1,
                            identityId: item?.no_passport,
                            identitySubType: 1,
                            identificationTimes: -1,
                            // identityDataBase64: "database64",
                            identityDataBase64: item?.profile_image,
                            status: 0,
                            reserve: "",
                        });
                    });

                    socket_server_4010.emit('sync', { paramsToSend, nilaiIp }, () => {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully synchronized',
                        });
                    });

                    socket_server_4010.on('responseSync', (data) => {
                        if (data === "Successfully") {
                            const insertIpKamera = apiInsertIP(dataApiKemera);
                            insertIpKamera.then((res) => {
                                if (res.status === 200) {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Successfully synchronized',
                                    });
                                }
                            }).catch((err) => {
                                Toast.fire({
                                    icon: "error",
                                    title: "Gagal menyimpan data ke API",
                                })
                                console.log(err);
                            });
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: 'Failed to synchronize',
                            });
                        }
                    });
                }
            } catch (error) {
                Toast.fire({
                    icon: 'error',
                    title: 'Failed to Get Data from API',
                });
            } finally {
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
                    <p>Set IP Server To Synchronize</p>
                </div>
                <div className='bagian-bawah-server'>
                    <label htmlFor="cameraName">Camera Name</label>
                    <input
                        type="text"
                        name="cameraName"
                        id="cameraName"
                        // value={newWifiResults}
                        value={detailData?.namaKamera}
                        style={{
                            width: '50%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                        onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                    // onChange={({ target: { value } }) => setNewWifiResults(value)}
                    />
                    <label htmlFor="ipCamera">IP Camera</label>
                    <input
                        type="text"
                        name="ipCamera"
                        id="ipCamera"
                        // value={newWifiResults}
                        value={detailData?.ipAddress}
                        style={{
                            width: '50%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                        onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                    // onChange={(e) => setNewWifiResults(e.target.value)}
                    />
                    <button className="ok-button" onClick={handleSubmit}>
                        Synchronize
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Synchronize
