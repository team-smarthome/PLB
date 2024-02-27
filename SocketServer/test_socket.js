const axios = require('axios');
const socketIo = require("socket.io");
const http = require("http");
const fs = require('fs');
const path = require('path');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

async function kirimSnapshot(socket) {
    try {
      const url = 'http://192.168.1.5:6067/attendDevice/sendSnapshot';
      const requestBody = {
        deviceNo: "12321SS4BAHS"
      };
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Response:', response.data);

      setTimeout(() => {
        const directoryPath = 'D:/transforme/E-VOA/new-device/camera-1/temp/12321SS4BAHS';
        const files = fs.readdirSync(directoryPath);
        let newestFile;
        let newestTime = 0;
        files.forEach(file => {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);
          if (file.startsWith('F') && fileStat.mtimeMs > newestTime) {
            newestTime = fileStat.mtimeMs;
            newestFile = file;
          }
        });
    
        // Pastikan file ditemukan sebelum melanjutkan
        if (!newestFile) {
          console.log('Tidak ada file yang ditemukan.');
          return;
        }
    
        const imagePath = path.join(directoryPath, newestFile);
    
        // Baca file gambar dan ubah menjadi base64
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
        socket.emit('snapshot_response', { code: 'success-snapshot', data: imageBase64 });
    
        // Tampilkan nama file gambar di console
        console.log('image_name:', newestFile);
    
        // Tampilkan base64 di console
        console.log('data:', imageBase64);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  }

io.on('connection', (socket) => {
  console.log('Terhubung ke server');

  socket.on('client_request', (data) => {
    switch(data.code) {
      case 'take-snapshot':
        // Jika klien meminta untuk mengambil snapshot, kirim permintaan ke API
        kirimSnapshot(socket);
        break;
      default:
        console.log('Kode tidak dikenal:', data.code);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
