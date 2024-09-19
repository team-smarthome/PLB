const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = ["192.168.2.166", "192.168.2.171"];
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
            console.log("apakah masuk ke dalam map");
            const url = `http://${ip}/facial_api/aiot_call`
            console.log("url", url);
            try {
                const response = await axios.post(url, dataUser?.bodyParamsSendKamera);
                console.log(response.data)
                console.log(response.data.params)
                return { ip, status: response.data.status, data: response.data };
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
                    method: "delfaceinfonotify",
                    params: {
                        data: [
                            {
                                identityType: 1,
                                deletePersonId: 1,
                                personId: data?.no_passport,
                                reserve: ""
                            }
                        ]
                    }
                });
                console.log("response delete", response.data);
                return { ip, status: response?.data?.status, data: response?.data };
            } catch (error) {
                console.log("error delete", error.message);
                return { ip, status: 500, data: error.message };
            }
        })
        const results = await Promise.all(deleteRequest);
        console.log("hasil delete", results);
        const allSuccessful = results.every(result => result.status === 0);
        if (allSuccessful) {
            console.log("berhasil menghapus data");
            socket.emit("responseDeleteDataUser", "Successfully");
        } else {
            socket.emit("responseDeleteDataUser", "Failed");
            console.log("gagal menghapus data")
        }
    } catch (error) {
        console.log("error delete", error.message);
    }
}


const handleEditDataUser = async (socket, dataUser) => {
    console.log("MENGIRIM DATA KE KAMERA");
    try {
        const insertDataUser = ipCamera.map(async (ip) => {
            console.log("apakah masuk ke dalam map");
            const url = `http://${ip}/facial_api/aiot_call`
            console.log("url", url);
            try {
                const response = await axios.post(url, dataUser?.bodyParamsSendKamera);
                console.log(response.data)
                console.log(response.data.params)
                return { ip, status: response.data.status, data: response.data };
            } catch (error) {
                return { ip, status: 500, data: error.message };
            }
        })
        const results = await Promise.all(insertDataUser);
        console.log("hasil_edit", results);
        const allSuccessful = results.every(result => result.status === 0);

        if (allSuccessful) {
            socket.emit("responseEditDataUser", "Successfully");
            console.log('berhasil mengirim data');
        } else {
            socket.emit("responseEditDataUser", "failed");
            console.log("gagal mengirim data")
        }
    } catch (error) {
        socket.emit("responseEditDataUser", "failed");
    }
};


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
        console.log("DatayangditerimaDelete", data);
        handleDeleteDataUser(socket, data)
    })

    socket.on("sendDataUser", (data) => {
        console.log("================Menerima Data dari Registers=======")
        handleSendDataToApi(socket, data);
    });

    socket.on("editDataUser", (data) => {
        console.log("================Menerima Data dari Registers=======")
        handleEditDataUser(socket, data);
    });
});