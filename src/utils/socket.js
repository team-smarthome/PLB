import { io } from 'socket.io-client';
import { url_socket } from '../services/env';

let socket;

let socket4010;

let socket4020;

let pendingTakePhotoRequests = [];

let pendingTakePhotoRequests4010 = [];

let pendingTakePhotoRequests4020 = [];

const ipServer = localStorage.getItem('ipServer');

export const initiateSocket = () => {
    if (!socket) {
        socket = io('http://localhost:4000');

        // Event handler untuk koneksi berhasil
        socket.on('connect', () => {
            console.log('testWebsocket Socket connection established');
            while (pendingTakePhotoRequests.length > 0) {
                const { action, data } = pendingTakePhotoRequests.shift(); // Ambil permintaan pertama
                if (action === 'take_photo') {
                    sendTakePhotoRequest(data);
                }
            }
        });

        // Event handler untuk koneksi terputus
        socket.on('disconnect', () => {
            console.log('testWebsocket Socket disconnected. Attempting to reconnect...');
        });

        // Event handler untuk reconnect attempt
        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`testWebsocket Reconnect attempt ${attemptNumber}`);
        });

        // Event handler untuk reconnect berhasil
        socket.on('reconnect', () => {
            console.log('testWebsocket Reconnected to socket server');
        });

        // Event handler untuk reconnect gagal
        socket.on('reconnect_failed', () => {
            console.log('testWebsocket Reconnect failed');
        });
    }
    return socket;
};


export const addPendingRequest = (request) => {
    pendingTakePhotoRequests.push(request);
};

const sendTakePhotoRequest = (data) => {
    if (socket) {
        socket.emit("take_photo", data);
    }
};

export const initiateSocketConfig = () => {
    if (!socket) {
        socket = io('http://localhost:4000');
        console.log('Socket connection initiated');
    }
    return socket;
};


export const initiateSocket4010 = () => {
    if (!socket4010) {
        if (!url_socket) {
            console.log('testWebsocket4010 ipServer tidak ada');
            return;
        }
        socket4010 = io(`${url_socket}:4010`);
        socket4010.on('connect', () => {
            console.log('testWebsocket4010 Socket connection established');

            while (pendingTakePhotoRequests4010.length > 0) {
                const request = pendingTakePhotoRequests4010.shift();
                if (request.action === 'sendDataUser') {
                    sendTakePhotoRequest4010(request.data);
                }
            }
        });
        socket4010.on('disconnect', () => {
            console.log('testWebsocket4010 Socket disconnected. Attempting to reconnect...');
        });

        socket4010.on('reconnect_attempt', (attemptNumber) => {
            console.log(`testWebsocket4010 Reconnect attempt ${attemptNumber}`);
        });

        socket4010.on('reconnect', () => {
            console.log('testWebsocket4010 Reconnected to socket server');
        });

        socket4010.on('reconnect_failed', () => {
            console.log('testWebsocket4010 Reconnect failed');
        });
    }
    return socket4010;
};

export const addPendingRequest4010 = (request) => {
    console.log('testWebsocket4010 pendingRequest', request);
    pendingTakePhotoRequests4010.push(request);

};

const sendTakePhotoRequest4010 = (data) => {
    if (socket4010) {
        socket4010.emit("sendDataUser", data);
    }
};


export const initiateSocket4020 = () => {
    if (!socket4020) {
        socket4020 = io(`${url_socket}:4030`);
        socket4020.on('connect', () => {
            if (socket4020.connected) {
                console.log('coba connect 4030 fase 1')
                socket4020.emit("logHistory");
            } else {
                console.log('coba connect 4030 fase 2')
                //coba connect
                socket4020.connect();
                socket4020.emit("logHistory");
            }
        });

        // Event handler untuk koneksi terputus
        socket4020.on('disconnect', () => {
            console.log('testWebsocket Socket disconnected. Attempting to reconnect...');
        });

        // Event handler untuk reconnect attempt
        socket4020.on('reconnect_attempt', (attemptNumber) => {
            console.log(`testWebsocket Reconnect attempt ${attemptNumber}`);
        });

        // Event handler untuk reconnect berhasil
        socket4020.on('reconnect', () => {
            console.log('testWebsocket Reconnected to socket server');
        });

        // Event handler untuk reconnect gagal
        socket4020.on('reconnect_failed', () => {
            console.log('testWebsocket Reconnect failed');
        });
    }
    return socket4020;
};

export const addPendingRequest4020 = (request) => {
    console.log('testWebsocket4020 pendingRequest', request);
    pendingTakePhotoRequests4020.push(request);

};


