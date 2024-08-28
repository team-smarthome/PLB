const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [];
let cookiesCamera = [];
let ipServer = "";
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


const handleGetDataRecords = async (socket, dataUser) => {
    try {
        const response = await axios.put(
            `http://${ipCamera}/cgi-bin/entry.cgi/event/control-record?search=condition2`,
            dataUser?.bodyParamsSendFilter,
            {
                headers: {
                    'Cookie': dataUser?.CookieSend,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data, "responsenyasaatini");
        if (response.data.status.message === "Successfully") {
            console.log(response.data.data, "responsenyasaatini");
            socket.emit("responseGetDataUser", response.data.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};

const handleSendDataToApi = async (socket, dataUser) => {
    console.log("MENGIRIM DATA KE KAMERA");

    const dataTosendAPI = {
        no_passport: dataUser?.bodyParamsSendKamera?.personNum,
        no_register: dataUser?.bodyParamsSendKamera?.personId,
        name: dataUser?.bodyParamsSendKamera?.name,
        date_of_birth: dataUser?.bodyParamsSendKamera?.dateOfBirth,
        gender: dataUser?.bodyParamsSendKamera?.sex,
        nationality: dataUser?.bodyParamsSendKamera?.nationalityCode,
        expired_date: dataUser?.bodyParamsSendKamera?.expiryDate,
        arrival_time: dataUser?.bodyParamsSendKamera?.arrivalTime,
        destination_location: dataUser?.bodyParamsSendKamera?.destinationLocation,
        profile_image: dataUser?.bodyParamsSendKamera?.photoFace,
    };

    console.log("Base64 yang diterima:", dataUser.bodyParamsSendKamera.photoFace);

    const formData = new FormData();
    formData.append('fileType', '0');

    // Konversi Base64 ke Blob
    const base64Image = dataUser?.bodyParamsSendKamera?.photoFace // Hilangkan prefix base64 jika ada
    const contentType = 'image/jpeg'; // Sesuaikan dengan tipe file
    const blob = base64ToBlob(base64Image, contentType);

    formData.append('fileData', blob, `${dataUser?.bodyParamsSendKamera?.name}.jpg`);

    const uploadUrls = ipCamera.map(camera => `http://${camera}/cgi-bin/entry.cgi/system/file-upload`);

    try {
        console.log("Mencoba mengakses API untuk file-upload");

        // Lakukan upload gambar ke semua kamera
        const uploadRequests = uploadUrls.map(url =>
            fetch(url, {
                method: 'POST',
                body: formData,
            })
        );

        // Tunggu hingga semua upload selesai
        const uploadResponses = await Promise.all(uploadRequests);

        // Cek status setiap respons
        uploadResponses.forEach((response, index) => {
            if (response.ok) {
                console.log(`Upload ke kamera ${ipCamera[index]} berhasil.`);
            } else {
                console.error(`Upload ke kamera ${ipCamera[index]} gagal dengan status: ${response.status}`);
            }
        });

        // Cek apakah semua upload berhasil
        const allUploadsSuccessful = uploadResponses.every(response => response.ok);

        if (allUploadsSuccessful) {
            console.log("Semua upload berhasil. Melanjutkan dengan mengirim data ke server.");

            const response = await axios.post(
                `http://${ipServer}/plb-api/data_user_insert.php`,
                dataTosendAPI,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === "OK") {
                console.log("Masukkesinibuatregister")
                const apiRequests = ipCamera.map((camera, index) => {
                    return axios.post(
                        `http://${camera}/cgi-bin/entry.cgi/event/person-info`,
                        dataUser?.bodyParamsSendKamera,
                        {
                            headers: {
                                'Cookie': cookiesCamera[index],
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                });
                await Promise.all(apiRequests);

                socket.emit("responseSendDataUserFromServer", "Successfully");
            } else {
                throw new Error('Failed to insert data to the server.');
            }
        } else {
            throw new Error('Failed to upload image to all cameras.');
        }
    } catch (error) {
        console.error('Error:', error);
        socket.emit("responseSendDataUserFromServer", "Failed to send data to all cameras.");
    }
};




const handleGetDataFilter = async (socket) => {
    try {
        const response = await axios.post(
            `http://${ipCamera[0]}/mdb/query`,
            { "name": "", "begin_time": "", "end_time": "", "query_type": 0, "offset": 0, "count": 100, "personCode": "", "page": 1, "limit": 100 },
            {
                headers: {
                    'Cookie': cookiesCamera[0],
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response.data.data.length > 0) {
            console.log(response.data.data, "responsenyasaatini");
            socket.emit("responseGetDataUserFilter", response.data.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const handleDeleteDataUser = async (socket, dataUser) => {
    try {
        console.log("personID", dataUser.personId)
        const apiRequests = ipCamera.map((camera, index) => {
            return axios.post(
                `http://${camera}/cgi-bin/entry.cgi/event/person-info-delete`,
                {
                    personId: dataUser?.personId
                },
                {
                    headers: {
                        'Cookie': cookiesCamera[index],
                        'Content-Type': 'application/json'
                    }
                }
            );
        });
        await Promise.all(apiRequests);
        // console.log("apakahmasukkesini")
        handleGetDataFilter(socket)

        // socket.emit("responseSendDataUserFromServer", "Successfully");

    } catch (error) {
        console.error('Error:', error);
        // socket.emit("responseSendDataUserFromServer", "Failed to send data to all cameras.");
    }
}

io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");

    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServer = data.ipServerPC;
        cookiesCamera = data.cookiesCamera;
        console.log("DataDariInformation", data);
    });


    socket.on("historyLog", (data) => {
        handleGetDataRecords(socket, data);
    });

    socket.on("startFilterUser", () => {
        handleGetDataFilter(socket);
    });

    socket.on("deleteDataUser", (data) => {

        handleDeleteDataUser(socket, data)
    })

    socket.on("sendDataUserToServer", (data) => {
        handleSendDataToApi(socket, data);
    });

});