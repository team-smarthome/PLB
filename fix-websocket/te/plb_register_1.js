const webSocketsServerPort = 4000;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = ['192.168.2.127'];
let ipServer = "192.168.2.143";
let remoteSocket = null;
const axios = require("axios");
const ioClient = require("socket.io-client");

const server = http.createServer(function (request, response) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000,
        "Access-Control-Allow-Headers": "*",
    };
    if (request.method === "OPTIONS") {
        response.writeHead(204, headers);
        response.end();
        return;
    }
});

server.listen(webSocketsServerPort);
console.log("Listening on port " + webSocketsServerPort);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const handleTakePhoto = async (socket) => {
    console.log("====== START TAKE PHOTO ======");
    try {
        console.log("masuk ke try")
        const response = await axios.post(
            `http://${ipCamera[0]}:6002/mvfacial_terminal`,
            {
                id: 1,
                jsonrpc: "2.0",
                method: "collect_start_sync",
                params: {
                    show_ui: 1,
                    time_out: 10,
                },
            }
        );

        if (response) {
            console.log("Menjalankan function stop")
            await axios.post(`http://${ipCamera[0]}:6002/mvfacial_terminal`, {
                id: 1,
                jsonrpc: "2.0",
                method: "collect_cancel",
                params: null,
            });
            // return;
        }

        if (response.data.result === "ok") {
            console.log("# SUCCESS FETCH API TAKE PHOTO #");
            const imagePath = response.data.params.image_path;
            const imageUrl = `http://${ipCamera[0]}:80${imagePath}`;

            const imageResponse = await axios.get(imageUrl, {
                responseType: "arraybuffer",
            });
            const base64Image = Buffer.from(
                imageResponse.data,
                "binary"
            ).toString("base64");
            const imageBase64 = `data:image/jpeg;base64,${base64Image}`;

            socket.emit("photo_taken", imageBase64);
            console.log("# SENDING IMAGE TO FRONT-END #");
        } else {
            console.error("# ERROR CANNOT TAKE PHOTO #");
            socket.emit("error_photo", "cannot_take_photo");
        }
    } catch (error) {
        console.error("# ERROR CANNOT TAKE PHOTO : ", error);
        socket.emit("error_photo", "cannot_take_photo");
        await axios.post(`http://${ipCamera[0]}:6002/mvfacial_terminal`, {
            id: 1,
            jsonrpc: "2.0",
            method: "collect_cancel",
            params: null,
        });
        console.log("stop_handle_run");
    }
};

const handleSendDataUser = async (data) => {
    console.log("# START SENDING DATA USER TO SERVER #");
    remoteSocket.emit("sendDataUserToServer", data);
}

const initializeRemoteSocket = () => {
    remoteSocket = ioClient(`http://${ipServer}:4010`);
    remoteSocket.on("connect", () => {
        console.log("Connected to remote WebSocket server on port 4010");
    });

    remoteSocket.on("responseSendDataUserFromServer", (data) => {
        io.emit("responseSendDataUser", data);
        console.log("responseSendDataUserFromServer", data);
    });

    remoteSocket.on("disconnect", () => {
        console.log("Disconnected from remote WebSocket server");
        // Coba reconnect setiap beberapa detik jika terputus
        const reconnectInterval = setInterval(() => {
            if (!remoteSocket.connected) {
                console.log("Attempting to reconnect...");
                remoteSocket.connect();
            } else {
                clearInterval(reconnectInterval);
            }
        }, 5000); // Interval reconnect dalam milidetik (misal 5 detik)
    });
};

const ensureRemoteSocketConnected = (callback) => {
    if (!remoteSocket || !remoteSocket.connected) {
        initializeRemoteSocket();
        remoteSocket.once("connect", () => {
            callback();
        });
    } else {
        callback();
    }
};


io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");
    if (!remoteSocket) {
        initializeRemoteSocket();
    }

    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServer = data.ipServerPC;
        console.log("# IPCAMERA: ", `http://${ipCamera[0]}:6002/mvfacial_terminal`);
    });

    socket.on("take_photo", () => {
        console.log("# RECEIVED ACTION TAKE PHOTO FROM FRONTEND #");
        handleTakePhoto(socket);
    });

    socket.on("sendDataUser", (data) => {
        ensureRemoteSocketConnected(() => {
            handleSendDataUser(data);
        });
    });

    // Heartbeat mechanism to keep the client connection alive
    const heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat");
    }, 10000); // Send heartbeat every 10 seconds

    socket.on("disconnect", () => {
        clearInterval(heartbeatInterval);
        console.log("Client disconnected");
    });
});
