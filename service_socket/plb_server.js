const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [];
const axios = require("axios");
const ping = require('ping');
let totalFacereg = 0;

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

const handleSendDataToApi = async (dataUser, data) => {
    const ipCameraCheckSend = [...data];

    console.log(ipCameraCheckSend.length, "totalIpKamera")

    if (ipCameraCheckSend.length === 0) {
        return { status: 500, message: "IP Kamera tidak ditemukan" };
    }
    const ipCamera = ipCameraCheckSend.filter((ip) => ip.ipAddress !== "");
    try {
        console.log("MENGIRIM DATA KE KAMERA");
        const insertDataUser = ipCamera.map(async (ip) => {
            const url = `http://${ip.ipAddress}/facial_api/aiot_call`
            try {
                const response = await axios.post(url, dataUser?.bodyParamsSendKamera);
                console.log(response.data)
                console.log(response.data.params)
                console.log("BERHASIL MENGIRIM DATA KE KAMERA", ip)
                return { status: response.data.status, message: `Berhasil mengirim data ke kamera dengan IP ${ip?.ipAddress}` };
            } catch (error) {
                return { status: 500, message: `Error ${error.message}` };
            }
        })
        const results = await Promise.all(insertDataUser);
        const allSuccessful = results.every(result => result.status === 0);
        const combinedMessage = results.map(result => result.message).join(', ');

        if (allSuccessful) {
            console.log("Berhasil Mengirim Data Ke Semua Kamera");
            return { status: 200, message: "Successfully" };
        } else {
            return { status: 500, message: combinedMessage };
        }

    } catch (error) {
        return { status: 500, message: error.message };
    }
};


const handleDeleteDataUser = async (dataUser, data) => {
    const ipCameraCheckSend = [...data];

    if (ipCameraCheckSend.length === 0) {
        return { status: 500, message: "IP Kamera tidak ditemukan" };
    }
    const ipCamera = ipCameraCheckSend.filter((ip) => ip.ipAddress !== "");

    try {
        const deleteRequest = ipCamera.map(async (ip) => {
            const url = `http://${ip?.ipAddress}/facial_api/aiot_call/service/sendPlatformInfo`
            try {
                const response = await axios.post(url, {
                    method: "delfaceinfonotify",
                    params: {
                        data: [
                            {
                                identityType: 1,
                                deletePersonId: 1,
                                personId: dataUser?.no_passport,
                                reserve: ""
                            }
                        ]
                    }
                });
                console.log("response delete", response.data);
                return { status: response?.data?.status, message: `Berhasil Menghupus data ke kamera dengan IP ${ip?.ipAddress}` };
            } catch (error) {
                console.log("error delete", error.message);
                return { status: 500, message: `Error ${error.message}` };
            }
        })
        const results = await Promise.all(deleteRequest);
        const allSuccessful = results.every(result => result.status === 0);
        const combinedMessage = results.map(result => result.message).join(', ');

        if (allSuccessful) {
            console.log("Berhasil Menghapus Data Ke Semua Kamera");
            return { status: 200, message: "Successfully" };
        } else {
            return { status: 500, message: combinedMessage };
        }
    } catch (error) {
        return { status: 500, message: error.message };
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


async function checkStatusKamera(ipServerCamera, operationalStatus) {
    console.log(operationalStatus, "operationalStatus")
    const ipToCheck = ipServerCamera?.filter(ip => ip !== "");
    if (ipToCheck && ipToCheck.length > 0) {
        for (const ip of ipToCheck) {
            if (ip === "") {
                return "failed - no IPs provided";
            } else {
                const res = await ping.promise.probe(ip);
                if (res.alive) {
                    console.log(`IP ${ip} is reachable`);
                    try {
                        console.log(ipServerCamera, 'adasasdasd')
                        const response = await axios.post(`http://${ip}/facial_api/aiot_call`, {
                            method: "set_ui_display_tips",
                            params: {
                                show_contents: operationalStatus,
                            }
                        });
                        if (response.data.status === 0) {
                            return "successfully";
                        }
                    }
                    catch (error) {
                        console.log("sini1234")
                        return error?.message;
                    }
                } else {
                    console.log(`IP ${ip} is not reachable`);
                    return "notConnectedIp";
                }
            }
        }
    } else {
        return "failed - no IPs provided";
    }
}


async function getDataKamera() {
    try {
        const { data } = await axios.get('http://localhost:8000/api/ip-kamera/SKOW');
        if (data.status === 200) {
            return { status: 200, data: data };
        }
    } catch (error) {
        return { status: 500, message: error.message };
    }
}


async function checkIpAccessible(params) {
    const ipCameraCheck = [...params];
    for (const ip of ipCameraCheck) {
        if (ip?.ipAddress === "") {
            return { reachable: false, error: "IP Kamera tidak ditemukan" };
        }
        try {
            const res = await ping.promise.probe(ip?.ipAddress);
            if (!res.alive) {
                return { reachable: false, error: `Kamera dengan IP ${ip?.ipAddress} tidak terhubung` };
            } else {
                console.log(`IP ${ip?.ipAddress} is reachable`);
            }
        } catch (err) {
            return { reachable: false, error: `Error pinging IP ${ip?.ipAddress}: ${err.message}` };
        }
    }
    return { reachable: true };
}


async function realtimeDataLog() {
    try {
        const { data } = await axios.get('http://localhost:8000/api/total-facereg');
        if (data.status === 200) {
            const totalData = data.total;
            if (totalData > totalFacereg) {
                console.log("Data Baru Ditemukan");
                totalFacereg = totalData;
                io.emit("logDataUpdate");
            }
        }

    } catch (error) {
        console.log("error hit api");
    }

    realtimeDataLog();
    // setTimeout(realtimeDataLog, 1000);
}

realtimeDataLog();


io.on("connection", (socket) => {

    // ============================ADD CAMERA(DONE)============================
    socket.on("saveCameraData", async (data) => {
        const { ipServerCamera, operationalStatus } = data;


        const response = await checkStatusKamera(ipServerCamera, operationalStatus);
        socket.emit("saveDataCamera", response);
    });

    // ============================Edit Camera(DONE)============================

    socket.on("editCameraData", async (data) => {


        console.log("masilsin", data)
        const { ipServerCamera, operationalStatus } = data;

        console.log('masuksini')

        const response = await checkStatusKamera(ipServerCamera, operationalStatus);
        socket.emit("editDataCamera", response);

    });

    // ============================Check Status Camera(DONE)============================

    socket.on("checkStatusKamera", async (data) => {
        let results = [];
        const dataIp = data.map((ip) => ip?.ipAddress);
        for (let ip of dataIp) {
            try {
                const res = await ping.promise.probe(ip);
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
    });


    // ============================Kirim Data Register(DONE)============================
    socket.on("sendDataUser", async (dataUser) => {
        try {
            const responseDataKamera = await getDataKamera();
            if (responseDataKamera?.data?.status === 500) {
                socket.emit("responseSendDataUser", responseDataKamera.message);
                return;
            }
            const ipData = responseDataKamera?.data?.data;
            const checkIP = await checkIpAccessible(ipData);
            if (!checkIP.reachable) {
                socket.emit("responseSendDataUser", checkIP.error);
                return;
            }
            const { status, message } = await handleSendDataToApi(dataUser, ipData);

            if (status === 200) {
                console.log("Berhasil Registrasi");
                socket.emit("responseSendDataUser", message);
                return;
            } else {
                console.log("Gagal Registrasi");
                socket.emit("responseSendDataUser", message);
                return;
            }
        } catch (error) {
            console.log("error", error.message);
            socket.emit("responseSendDataUser", error.message);
        }
    });

    // ============================Delete Data Register(DONE)============================
    socket.on("deleteDataUser", async (dataUser) => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/ip-kamera/SKOW');
            if (data.status === 200) {
                const ipData = data?.data;
                const checkIP = await checkIpAccessible(ipData);
                if (!checkIP.reachable) {
                    socket.emit("responseDeleteDataUser", checkIP.error);
                    return;
                }
                const { status, message } = await handleDeleteDataUser(dataUser, ipData);

                if (status === 200) {
                    console.log("Berhasil Menghapus Data");
                    socket.emit("responseDeleteDataUser", message);
                    return;
                } else {
                    console.log("Gagal Registrasi");
                    socket.emit("responseDeleteDataUser", message);
                    return;
                }

            } else if (data.data.length === 0) {
                socket.emit("responseDeleteDataUser", "IP Kamera tidak ditemukan");
            }
        } catch (error) {
            console.log("error", error.message);
            socket.emit("responseDeleteDataUser", error.message);
        }
    })

    // ============================Edit Data Register============================
    socket.on("editDataUser", async (data) => {
        console.log("================Menerima Data dari Registers=======")
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

    // ============================Sync Data Register(DONE)============================
    socket.on('sync', async (data) => {
        const { paramsToSend, nilaiIp } = data;
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