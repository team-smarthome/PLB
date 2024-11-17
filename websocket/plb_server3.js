const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = ['127.0.0.1'];
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

const handleSendDataToApi = async (socket, dataUser) => {
    console.log("MENGIRIM DATA KE KAMERA");
    try {
        const insertDataUser = ipCamera.map(async (ip) => {
            const url = `http://${ip}/facial_api/aiot_call`
            try {
                const response = await axios.post(url, dataUser?.bodyParamsSendKamera);
                return { ip, status: response.data.datalist[0].status, data: response.data.datalist[0].personId };
            } catch (error) {
                return { ip, status: 500, data: error.message };
            }
        })
        const results = await Promise.all(insertDataUser);
        const allSuccessful = results.every(result => result.status === 0);

        if (allSuccessful) {
            socket.emit("responseSendDataUser", "Successfully");
            console.log('berhasil mengirim data');
        } else {
            socket.emit("responseSendDataUser", "failed");
            console.log("gagal mengirim data")
        }
    } catch (error) {
        socket.emit("responseSendDataUser", "failed");
    }
};

const handleDeleteDataUser = async (socket, data) => {
    try {
        const deleteRequest = ipCamera.map(async (ip) => {
            const url = `http://${ip}/facial_api/aiot_call/service/sendPlatformInfo`
            try {
                const response = await axios.post(url, {
                    "method": "delfaceinfonotify",
                    "params": {
                        "data": [
                            {
                                "identityType": 1,
                                "deletePersonId": 1,
                                "personId": data?.no_pasport,
                                "reserve": ""
                            }
                        ]
                    }
                });
                return { ip, status: response.data.datalist[0].status, data: response.data.datalist[0].personId };
            } catch (error) {
                return { ip, status: 500, data: error.message };
            }
        })
        const results = await Promise.all(deleteRequest);
        const allSuccessful = results.every(result => result.status === 1);

        if (allSuccessful) {
            socket.emit("responseDeleteDataUser", "Successfully");
        } else {
            socket.emit("responseDeleteDataUser", "failed");
            console.log("gagal menghapus data")
        }
    } catch (error) {
        console.log("Error Message");
    }
}

io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");

    socket.on("saveCameraData", (data) => {
        ipCamera = data?.ipServerCamera;
        console.log("DataDariInformation", data);
        if (data) {
            socket.emit("saveDataCamera", "successfully");
        } else {
            socket.emit("saveDataCamera", "failed");
        }

    });

    socket.emit("DataIPCamera", {
        ipCamera: ipCamera,
        ipServerPC: ipCamera,
    });

    socket.on("deleteDataUser", (data) => {
        handleDeleteDataUser(socket, data)
    })

    socket.on("sendDataUser", (data) => {
        console.log("================Menerima Data dari Registers=======")
        handleSendDataToApi(socket, data);
    });
});