const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [];
const axios = require("axios");
const ping = require('ping');

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

    // ============================ADD CAMERA============================

    socket.on("saveCameraData", async (data) => {
        const ipToCheck = data?.ipServerCamera;

        if (ipToCheck && ipToCheck.length > 0) {
            let allIpsReachable = true;
            for (const ip of ipToCheck) {
                const res = await ping.promise.probe(ip);
                if (res.alive) {
                    console.log(`IP ${ip} is reachable`);
                } else {
                    console.log(`IP ${ip} is not reachable`);
                    allIpsReachable = false;
                }
            }

            if (allIpsReachable) {
                ipCamera = [...ipCamera, ...ipToCheck];
                console.log("DataDariInformation", ipCamera);
                socket.emit("saveDataCamera", "successfully");
            } else {
                console.log("IPs are not reachable");
                socket.emit("saveDataCamera", "notConnectedIp");
            }
        } else {
            socket.emit("saveDataCamera", "failed - no IPs provided");
        }
    });

    // ============================Deleted Camera============================

    socket.on("deleteCameraData", (data) => {
        const ipToDelete = data?.ipServerCamera;

        if (ipToDelete && ipToDelete.length > 0) {
            ipCamera = ipCamera.filter(ip => !ipToDelete.includes(ip));
            // ipCamera = ipCamera.filter(ip => ip !== ipToDelete);

            console.log("Updated ipCamera after deletion:", ipCamera);
            socket.emit("deleteDataCamera", "successfullyDeleted");
        } else {
            socket.emit("deleteDataCamera", "failed - no IPs provided for deletion");
        }
    });

    // ============================Edit Camera============================

    socket.on("editCameraData", async (data) => {
        const oldIp = data?.oldIp;
        const newIp = data?.newIp;

        if (oldIp && newIp) {
            const index = ipCamera.indexOf(oldIp);

            if (index !== -1) {
                const res = await ping.promise.probe(newIp);

                if (res.alive) {
                    ipCamera[index] = newIp;
                    console.log(`IP ${oldIp} telah diubah menjadi ${newIp}`);
                    socket.emit("editDataCamera", "successfullyEdited");
                } else {
                    console.log(`IP ${newIp} is not reachable, edit aborted`);
                    socket.emit("editDataCamera", "newIpNotReachable");
                }
            } else {
                console.log(`IP ${oldIp} tidak ditemukan di array`);
                socket.emit("editDataCamera", "ipNotFound");
            }
        } else {
            socket.emit("editDataCamera", "failed - missing oldIp or newIp");
        }
    });

    socket.on('saveCameraDataFirst', (data) => {
        console.log("DataDariInformation", data);
        ipCamera = [...ipCamera, ...data?.ipServerCamera];
        socket.emit("saveDataCamera", "successfully");
    });

    socket.on("checkStatusKamera", async () => {
        let results = [];
        for (let ip of ipCamera) {
            try {
                const res = await ping.promise.probe(ip)
                if (!res.alive) {
                    results.push({ ip, status: "error" });
                } else {
                    results.push({ ip, status: "ok" });
                }
            } catch (error) {
                results.push({ ip, status: "error" });
            }
        }
        socket.emit("statusKameraResponse", results);
    })


    // socket.emit("DataIPCamera", {
    //     ipCamera: ipCamera,
    //     ipServerPC: ipCamera,
    // });

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

    socket.on('getCameraData', () => {
        socket.emit('DataIPCamera', {
            ipCamera: ipCamera,
        });
    });
});