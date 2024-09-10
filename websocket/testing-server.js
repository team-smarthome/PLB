const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = ['127.0.0.1', '127.0.0.1'];
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

const handleDeleteDataUser = async () => {
    try {
        const deleteRequest = ipCamera.map(async (ip) => {
            const url = `http://${ip}:8000/api/test-api`
            try {
                const response = await axios.get(url);
                return { ip, status: response.data.datalist[0].status, data: response.data.datalist[0].personId };
            } catch (error) {
                return { ip, status: 500, data: error.message };
            }
        })
        const results = await Promise.all(deleteRequest);
        const allSuccessful = results.every(result => result.status === 1);

        if (allSuccessful) {
            console.log('berhasil menghapus data');
        } else {
            console.log("gagal menghapus data")
        }
    } catch (error) {
        console.log("Error Message");
    }
}

handleDeleteDataUser();
io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");

    socket.on("saveCameraData", (data) => {
        ipCamera = data?.ipServerCamera;
        console.log("DataDariInformation", data);
    });

    socket.emit("DataIPCamera", {
        ipCamera: ipCamera,
        ipServerPC: ipCamera,
    });

    socket.on("deleteDataUser", (data) => {
        handleDeleteDataUser(socket, data)
    })
});
