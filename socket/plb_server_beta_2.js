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
        const insertDataUser = ipCamera.filter((ip) => ip !== "").map(async (ip) => {
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
        socket.emit("responseSendDataUser", error.message);
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
        socket.emit("responseDeleteDataUser", "Failed");
    }
}


const handleEditDataUser = async (socket, dataUser) => {
    console.log("MENGIRIM DATA KE KAMERA");
    console.log("DataUser", dataUser.params.data);
    try {
        const insertDataUser = ipCamera.map(async (ip) => {
            console.log("apakah masuk ke dalam map");
            const url = `http://${ip}/facial_api/aiot_call`
            console.log("url", url);
            try {
                const response = await axios.post(url, {
                    method: "editfaceinfonotify",
                    params: {
                        data: [dataUser.params.data]
                    }

                });
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
        const ipToCheck = data?.ipServerCamera?.filter(ip => ip !== "");
        if (ipToCheck && ipToCheck.length > 0) {
            let allIpsReachable = true;
            for (const ip of ipToCheck) {
                console.log(ip, 'nilaiIPYgDikirim');

                if (ip === "") {
                    socket.emit("saveDataCamera", "failed - no IPs provided");
                    return;
                } else if (ipCamera.includes(ip)) {
                    socket.emit("saveDataCamera", "failed - IP already exists");
                    return;
                } else {
                    const res = await ping.promise.probe(ip);
                    if (res.alive) {
                        console.log(`IP ${ip} is reachable`);
                    } else {
                        console.log(`IP ${ip} is not reachable`);
                        allIpsReachable = false;
                        socket.emit("saveDataCamera", "notConnectedIp");
                    }
                }
            }

            if (allIpsReachable) {
                console.log("MasukSini");
                ipCamera = [...ipCamera, ...ipToCheck];
                for (const ip of ipCamera) {
                    try {
                        console.log("DataDariInformation1", ipCamera);
                        socket.emit("saveDataCamera", "successfully");
                        if (response.data.status === 0) {
                            console.log("DataDariInfoxrmation", ipCamera);
                            socket.emit("saveDataCamera", "successfully");
                        }
                    } catch (error) {
                        socket.emit("saveDataCamera", "Failed");
                        console.error(`Failed to hit API at ${ip}:`, error.message);
                    }
                }
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
        // return console.log("DataDariInformation2", typeof data?.ipServerCamera[0]);
        if (data?.ipServerCamera[0] === "") {
            socket.emit("deleteDataCamera", "failed - no IPs provided for deletion");
            return;
        }
        const ipToDelete = data?.ipServerCamera[0];

        if (ipToDelete && ipToDelete.length > 0) {
            ipCamera = ipCamera.filter(ip => !ipToDelete.includes(ip));
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
                    try {
                        const response = await axios.post(`http://${newIp}/facial_api/aiot_call`, {
                            method: "set_ui_display_tips",
                            params: {
                                show_contents: data?.operationalStatus
                            }
                        });
                        if (response.data.status === 0) {
                            console.log("DataDariInformation3", ipCamera);
                            socket.emit("editDataCamera", "successfullyEdited");
                        }
                    }
                    catch (error) {
                        console.error(`Failed to hit API at ${newIp}:`, error.message);
                        socket.emit("editDataCamera", "failed");
                    }
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
        const validIpCameras = [...new Set(data?.ipServerCamera?.filter(ip => ip !== "" && !ipCamera.includes(ip)))];
        ipCamera = [...ipCamera, ...validIpCameras];
        console.log("IPKAmera", ipCamera);

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


    socket.on("deleteDataUser", (data) => {
        console.log("DatayangditerimaDelete", data);
        handleDeleteDataUser(socket, data)
    })

    socket.on("sendDataUser", (data) => {
        let allIpsReachableSend = true;
        ipCamera.filter((ip) => ip !== "").map(async (ip) => {
            if (ip === "") {
                socket.emit("responseSendDataUser", "failed - no IPs provided");
                return;
            } else {
                const res = await ping.promise.probe(ip);
                if (res.alive) {
                    console.log(`IP ${ip} is reachable`);
                } else {
                    allIpsReachableSend = false;
                    console.log(`IP ${ip} is not reachable`);
                    socket.emit("responseSendDataUser", "Kamera dengan IP " + ip + " tidak terhubung");
                }
            }
        });
        console.log("================Menerima Data dari Registers=======")
        if (allIpsReachableSend) {
            handleSendDataToApi(socket, data);
        }
    });

    socket.on("editDataUser", async (data) => {
        console.log("================Menerima Data dari Registers=======")
        // handleEditDataUser(socket, data);
        const { paramsToSendEdit } = data;
        try {
            const insertDataUser = ipCamera.map(async (ip) => {
                const url = `http://${ip}/facial_api/aiot_call`
                console.log("url", url);
                try {
                    const response = await axios.post(url, paramsToSendEdit);
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
    });

    socket.on('getCameraData', () => {
        socket.emit('DataIPCamera', {
            ipCamera: ipCamera,
        });
    });

    socket.on('sync', async (data) => {
        const { paramsToSend, nilaiIp } = data;
        console.log('Data:', paramsToSend);
        console.log('IP:', nilaiIp);
        try {
            const syncRequest = await axios.post(`http://${nilaiIp}/facial_api/aiot_call`, paramsToSend);
            if (syncRequest?.data?.status === 0) {
                socket.emit("responseSync", "Successfully");
            } else {
                socket.emit("responseSync", "Failed");
            }
        } catch (error) {
            socket.emit("responseSync", "Failed");
        }
    })

});