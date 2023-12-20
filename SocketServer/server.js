const http = require('http');
const os = require('os');
const cors = require('cors');

// Tambahkan baris ini di atas pembuatan server
const corsMiddleware = cors();

const server = http.createServer((req, res) => {
  // Terapkan middleware cors pada setiap permintaan
  corsMiddleware(req, res, () => {
    if (req.url === '/ip' && req.method === 'GET') {
      const networkInterfaces = os.networkInterfaces();
      let foundInterface = null;

      // Iterasi melalui antarmuka untuk mencari yang sesuai dengan IPv4 dan bukan loopback
      Object.keys(networkInterfaces).forEach(interfaceName => {
        const interfaceInfo = networkInterfaces[interfaceName];

        const match = interfaceInfo.find(info => info.family === 'IPv4' && !info.internal);

        if (match) {
          foundInterface = { interface: interfaceName, ip: match.address };
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(foundInterface));

      // Tampilkan IP di console server
      console.log('IP Address:', foundInterface ? foundInterface.ip : 'Not Found');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
});

const port = 5000;

server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
