import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toast } from "../../components/Toast/Toast";
import './settingserver.css';

const SettingServer = () => {
    const [newWifiResults, setNewWifiResults] = useState("");
    const [loading, setLoading] = useState(false);
    let socket_server_4010;

    const handleSubmit = () => {
        setLoading(true);
        if (newWifiResults) {
            socket_server_4010 = io(`http://${newWifiResults}:4010`);

            socket_server_4010.on('connect', () => {
                console.log('Connected to server');
                setLoading(false);
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully connected to the server',
                });
            });

            socket_server_4010.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setLoading(false);
                Toast.fire({
                    icon: 'error',
                    title: 'Failed to connect to the server',
                });
            });
        } else {
            setLoading(false);
            Toast.fire({
                icon: 'error',
                title: 'Please input the server IP',
            });
        }
    };

    useEffect(() => {
        return () => {
            if (socket_server_4010) {
                socket_server_4010.disconnect();
                console.log('Disconnected from server');
            }
        };
    }, []);

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
                    <p>Set IP Server WebSocket</p>
                </div>
                <div className='bagian-bawah-server'>
                    <input
                        type="text"
                        name="ipServerPC"
                        id="ipServerPC"
                        value={newWifiResults}
                        style={{
                            width: '50%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                        onChange={(e) => setNewWifiResults(e.target.value)}
                    />
                    <button className="ok-button" onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingServer;
