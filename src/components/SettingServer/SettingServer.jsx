import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toast } from "../../components/Toast/Toast";

const SettingServer = () => {
    const [newWifiResults, setNewWifiResults] = useState(window.location.hostname);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const serverIPSocket = localStorage.getItem('serverIPSocket');
        if (serverIPSocket) {
            setNewWifiResults(serverIPSocket);
        }
    }, []);

    const handleSubmit = () => {
        setLoading(true);
        if (newWifiResults) {
            const socket_server_4010 = io(`http://${newWifiResults}:4010`);
            socket_server_4010.on('connect', () => {
                console.log('Connected to server');
                setLoading(false);
                localStorage.setItem('serverIPSocket', newWifiResults);
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully connected to the server',
                });
            });

            socket_server_4010.once('connect_error', (error) => {
                console.error('Connection error:', error);
                setLoading(false);
                Toast.fire({
                    icon: 'error',
                    title: 'Failed to connect to the server',
                });
                socket_server_4010.close();
            });
        } else {
            setLoading(false);
            Toast.fire({
                icon: 'error',
                title: 'Please input the server IP',
            });
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h1 className="text-2xl font-bold text-navy-900">Setting Server</h1>
                <p className="text-gray-500 text-sm mt-1">Konfigurasi alamat IP server WebSocket untuk komunikasi data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 max-w-2xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                        <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                    </div>
                )}
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ipServerPC" className="text-sm font-semibold text-gray-700">IP Server WebSocket</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="ipServerPC"
                                id="ipServerPC"
                                value={newWifiResults}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="e.g. 192.168.1.100"
                                onChange={(e) => setNewWifiResults(e.target.value)}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingServer;
