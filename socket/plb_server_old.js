const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = [];
let cookiesCamera = [];
let ipServer = "";
const axios = require("axios");
const dataIdentity = [];
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

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

    // Save photo to server
    const base64Data = dataUser?.bodyParamsSendKamera?.photoFace;
    const base64ImageF = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const filePath = path.join(__dirname, 'images', `${dataUser?.bodyParamsSendKamera?.name}.jpeg`);

    try {
        const uploadRequests = ipCamera.map((ip, index) => {
            fs.writeFileSync(filePath, base64ImageF, 'base64');

            const form = new FormData();
            form.append('fileType', '0');
            form.append('fileData', fs.createReadStream(filePath), { filename: `${dataUser?.bodyParamsSendKamera?.name}.jpeg` });

            console.log("Mencoba mengakses API untuk file-upload");
            console.log(form, "formnya");
            console.log(form.getHeaders(), "form getHeaders");

            // Upload image to all cameras

            const url = `http://${ip}/cgi-bin/entry.cgi/system/file-upload`;
            return fetch(url, {
                method: 'POST',
                body: form,
                headers: {
                    'Cookie': cookiesCamera[index],
                    ...form.getHeaders()
                }
            });
        });

        const uploadResponses = await Promise.all(uploadRequests);

        // const dataIdentity = []; // Array to store the paths of uploaded images

        const responsePromises = uploadResponses.map(async (response, index) => {
            console.log(`Response dari kamera ${ipCamera[index]} status: ${response.status}`);
            const text = await response.text();
            console.log(`Response text dari kamera ${ipCamera[index]}:`, text);
            try {
                const json = JSON.parse(text);
                if (json.status.code === 200) {
                    console.log(`Upload ke kamera ${ipCamera[index]} berhasil.`);
                    dataIdentity.push(json.data.path);
                } else {
                    console.error(`Upload ke kamera ${ipCamera[index]} gagal dengan status: ${json.status.code}`);
                }
            } catch (jsonError) {
                console.error(`Gagal mengubah response menjadi JSON dari kamera ${ipCamera[index]}:`, jsonError);
            }
        });

        await Promise.all(responsePromises);

        // Check if all uploads were successful
        const allUploadsSuccessful = uploadResponses.every(response => response.ok);
        if (allUploadsSuccessful) {
            console.log("Semua upload berhasil. Melanjutkan dengan mengirim data ke server.");
            console.log("DataIdentity", dataIdentity);

            try {
                // Send data to server
                const apiRequests = ipCamera.map((camera, index) => {
                    const dataToSendKamera = {
                        method: 1,
                        identityType: "1",
                        gender: dataUser?.bodyParamsSendKamera?.gender,
                        personId: dataUser?.bodyParamsSendKamera?.personId,
                        personNum: dataUser?.bodyParamsSendKamera?.personNum,
                        name: dataUser?.bodyParamsSendKamera?.name,
                        identityData: dataIdentity[index],
                        effectiveStartTime: dataUser?.bodyParamsSendKamera?.effectiveStartTime,
                        validEndTime: dataUser?.bodyParamsSendKamera?.validEndTime,
                        thirdpartyId: "",
                    };

                    return axios.post(
                        `http://${camera}/cgi-bin/entry.cgi/event/person-info`,
                        dataToSendKamera,
                        {
                            headers: {
                                'Cookie': cookiesCamera[index],
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                });

                const apiResponses = await Promise.all(apiRequests);

                apiResponses.forEach((response, index) => {
                    console.log(`Response dari server kamera ${ipCamera[index]} status: ${response.status}`);
                    console.log(`Response data dari server kamera ${ipCamera[index]}:`, response.data);
                });
                dataIdentity.length = 0;
                socket.emit("responseSendDataUserFromServer", "Successfully");
            } catch (error) {
                console.error('Error saat mengirim data ke server:', error);
                socket.emit("responseSendDataUserFromServer", "Failed to send data to all cameras.");
            }
        } else {
            console.log("Beberapa upload gagal. Tidak melanjutkan dengan mengirim data ke server.");
            socket.emit("responseSendDataUserFromServer", "Failed to upload image to all cameras.");
        }
    } catch (error) {
        console.error('Gagal menyimpan gambar:', error);
        socket.emit("responseSendDataUserFromServer", "Failed to save image and send data.");
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