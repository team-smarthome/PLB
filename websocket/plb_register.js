
const webSocketsServerPort = 4000;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [];
let ipServer = "";
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

const remoteSocket = ioClient(`http://${ipServer}:4010`);
remoteSocket.on("connect", () => {
    console.log("Connected to remote WebSocket server on port 4010");
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
    console.log("Menjalnakn mengambil photo");
    try {
        const response = await axios.post(
            `http://${ipCamera[0]}:6002/mvfacial_terminal`,
            {
                id: 1,
                jsonrpc: "2.0",
                method: "collect_start_sync",
                params: {
                    show_ui: 1,
                },
            }
        );
        if (response.data.result === "ok") {
            console.log("mendapatkan data image");
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

            // Emit the Base64 image to the client
            socket.emit("photo_taken2", imagePath);
            socket.emit("photo_taken", imageBase64);
            console.log("mengirim data ke frontend");
            // console.log("Take_Photo_Response:", imageBase64);
        } else {
            console.error("cannot_take_photo");
            socket.emit("error_photo", "cannot_take_photo");
        }
    } catch (error) {
        console.error("cannot_take_photo", error);
        socket.emit("error_photo", "cannot_take_photo");
    } finally {
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
    remoteSocket.emit("sendDataUserToServer", data);
}


remoteSocket.on("responseSendDataUserFromServer", (data) => {
    io.emit("responseSendDataUser", data);
});



io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");

    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServer = data.ipServerPC;
        console.log("ipCamera", `http://${ipCamera[0]}:6002/mvfacial_terminal`);
    })
    socket.on("take_photo", () => {
        handleTakePhoto(socket);
    });

    socket.on("sendDataUser", (data) => {
        handleSendDataUser(data);
    });

});