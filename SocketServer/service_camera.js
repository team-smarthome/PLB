const http = require("http");
const socketIo = require("socket.io");


// Create HTTP server and WebSocket server
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*", // Change to your client's origin URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const net = require("net");

// Define the server details
const serverHost = "127.0.0.1";
const serverPort = 8888;

const client = new net.Socket();

function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}

client.connect(serverPort, serverHost, () => {
  console.log("Connected to server");

  // Send data to the server
  const requestData = {
    deviceNo: "12321SS4BAHS",
    action: "connect",
    timestamp: getCurrentTimeInSeconds(),
  };
  console.log("request data", requestData);
  client.write(JSON.stringify(requestData));
});
client.on("data", (data) => {
  console.log("Received data from server:", data.toString("utf-8"));
  const responseData = JSON.parse(data.toString("utf-8"));
  if (responseData.message && responseData.message.code) {
    const code = responseData.message.code;
    switch (code) {
      case "connect":
        // Send data to the server
        const requestData = {
          // deviceNo: "12321SS4BAHS",
          deviceNo: "12321SS4BAHS",
          action: "heartbeat",
          timestamp: getCurrentTimeInSeconds(),
          interval: 30,
          local_ip: "192.168.1.23",
        };
        console.log("request data", requestData);
        client.write(JSON.stringify(requestData));
        break;
      default:
        break;
    }
  } else {
    console.log("Invalid response data:", responseData);
  }
});


async function kirimSnapshot(socket) {
  try {
    console.log("Masuk kirimSnapshot WOIIII");
    const url = "http://192.168.1.24:6067/attendDevice/sendSnapshot";
    const requestBody = {
      deviceNo: "12321SS4BAHS",
    };
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Response:", response.data); 

    if (response.data.message === "success") {
      setTimeout(() => {
        const directoryPath =
          "D:/transforme/E-VOA/new-device/camera-1/temp/12321SS4BAHS";
          if (!fs.existsSync(directoryPath)) {
            socket.emit("not-found-directory", {
              "message": "directory-not-found"
            });
            console.log("Direktori tidak ditemukan.");
            return;
          }
        const files = fs.readdirSync(directoryPath);
        let newestFile;
        let newestTime = 0;

        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);

          if (file.startsWith("F") && fileStat.mtimeMs > newestTime) {
            newestTime = fileStat.mtimeMs;
            newestFile = file;
          }
        });

        if (!newestFile) {
          // socket.emit("gagal_snapshot", {
          //  "message": "no-image-found"
          // });
          kirimSnapshot(socket);
          console.log("Tidak ada file yang ditemukan.");
          return;
        }

        const imagePath = path.join(directoryPath, newestFile);
        const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
        console.log("imageBase64: ", imageBase64);
        console.log("keluar kirimSnapshot");

        socket.emit("snapshot_data", {
          base64: imageBase64,
          filename: newestFile,
        });

        // Hapus file setelah dikirimkan
        fs.unlinkSync(imagePath);
        console.log("File dihapus setelah berhasil dikirim.");

      }, 2000);
    } else {
      socket.emit("gagal_snapshot", {
        "message": "failed-to-take-snapshot"
      });
    }


  } catch (error) {
    console.error("Error:", error);
  }
}








io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("client connected to server socket.io 4498");

  socket.on("WebClientMessage", (data) => {
    // console.log("WebClientMessage Data: ", data);
    const dataParse = JSON.parse(data);
    // console.log("dataParse: ", dataParse);
    console.log("WebClientMessage: ", dataParse);
    switch (dataParse.code) {
      case "take-snapshot":
        kirimSnapshot(socket);
        break;
      default:
        console.log("Invalid code");
        break;
    }
  });

  socket.on("DeviceAppClient", (data) => {
    console.log("DeviceAppClient Data: ", data);
    const dataParse = JSON.parse(data);
    switch (dataParse.code) {
      case "take-snapshot":
        kirimSnapshot(socket);
        break;
      default:
        console.log("Invalid code");
        break;
    }
  });
});

// Starting the server
server.listen(4499, () => {
  console.log(`Server running on port 4498`);
});
