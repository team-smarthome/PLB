const io = require('socket.io-client');

// Menggunakan Socket.IO client-side
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Terhubung ke server');
});

// Tangkap data snapshot dari server
socket.on('snapshot_data', (data) => {
  console.log('base:', data.base64);
});

// Kirim permintaan untuk mengambil snapshot
socket.emit('client_request', { code: 'take-snapshot', data: '' });
