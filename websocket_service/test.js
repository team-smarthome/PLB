const http = require("http");

// Data yang ingin dikirim
const data = JSON.stringify({
    sUserName: "admin",
    sPassword: Buffer.from("Maxvision@2024").toString("base64")  // Mengencode password ke Base64
});

const options = {
    hostname: '192.168.2.210',
    port: 80,
    path: '/cgi-bin/entry.cgi/system/login',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',  // Tipe konten JSON
        'Content-Length': data.length        // Panjang konten
    }
};

const req = http.request(options, res => {
    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error("Error:", error.message);
});

// Mengirimkan data JSON ke server
req.write(data);
req.end();
