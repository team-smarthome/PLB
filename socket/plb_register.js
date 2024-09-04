const webSocketsServerPort = 4000;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = ['192.168.2.127'];
let ipServerPC = '192.168.2.143';
const axios = require("axios");

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

io.on("connection", (socket) => {
    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServerPC = data.ipServerPC;
        console.log("# IPCAMERA: ", `http://${ipCamera[0]}:6002/mvfacial_terminal`);
    });

    socket.on("take_photo", () => {
        console.log("# RECEIVED ACTION TAKE PHOTO FROM FRONTEND #");
        handleTakePhoto(socket);
    });

    socket.emit("DataIPCamera", {
        ipCamera: ipCamera[0],
        ipServerPC: ipServerPC,
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});