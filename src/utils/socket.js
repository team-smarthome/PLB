import { io } from 'socket.io-client';

let socket;

let pendingTakePhotoRequests = [];

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
// export const initiateSocket = () => {
//     if (!socket) {
//         socket = io('http://localhost:4000');
//         console.log('Socket connection initiated');
//     }
//     return socket;
// };
