const webSocketsServerPort = 4000;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [''];
let ipServer = "";
let remoteSocket;
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
    console.log("Menjalankan mengambil photo");
    try {
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
        if (response.data.result === "ok") {
            console.log("succes hit api")
            const stop = await axios.post(`http://${ipCamera[0]}:6002/mvfacial_terminal`, {
                id: 1,
                jsonrpc: "2.0",
                method: "collect_cancel",
                params: null,
            });
            const imagePath = response.data.params.image_path;
            const imageUrl = `http://${ipCamera[0]}:80${imagePath}`;
            // Fetch image from the URL
            const imageResponse = await axios.get(imageUrl, {
                responseType: "arraybuffer",
            });
            const base64Image = Buffer.from(
                imageResponse.data,
                "binary"
            ).toString("base64");
            const imageBase64 = `data:image/jpeg;base64,${base64Image}`;
            if (stop.data.result === 'ok') {
                socket.emit("photo_taken2", imagePath);
                socket.emit("photo_taken", imageBase64);
                console.log("mengirim data ke frontend");
            } else {
                socket.emit("photo_taken2", imagePath);
                socket.emit("photo_taken", imageBase64);
                console.log("mengirim data ke frontend");
                console.log("gagal")
            }
        } else {
            console.error("cannot_take_photo");
            socket.emit("error_photo", "cannot_take_photo");
        }
    } catch (error) {
        console.error("cannot_take_photo", error);
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
    console.log("Sending data to remote server", data.ipServerCamera);
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
}

io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");
    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServer = data.ipServerPC;
        console.log("ipCamera", `http://${ipCamera[0]}:6002/mvfacial_terminal`);

        if (!remoteSocket) {
            initializeRemoteSocket();
        }
    });

    socket.on("take_photo", () => {
        console.log("Menerima perintah dari frontend")
        handleTakePhoto(socket);
    });

    socket.on("sendDataUser", (data) => {
        handleSendDataUser(data);
    });
});
