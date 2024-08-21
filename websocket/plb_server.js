const webSocketsServerPort = 4010;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = "192.168.2.127";
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
    console.log("Menjalnakn mengambil photo");
    try {
        const response = await axios.post(
            `http://${ipCamera}:6002/mvfacial_terminal`,
            {
                id: 1,
                jsonrpc: "2.0",
                method: "collect_start_sync",
                params: {
                    show_ui: 1,
                },
            }
        );
        // console.log(response.data.result, "response");
        if (response.data.result === "ok") {
            console.log("mendapatkan data image");
            const imagePath = response.data.params.image_path;
            const imageUrl = `http://${ipCamera}:80${imagePath}`;

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
        } else {
            console.error("cannot_take_photo");
            socket.emit("error_photo", "cannot_take_photo");
        }
    } catch (error) {
        console.error("cannot_take_photo", error);
        socket.emit("error_photo", "cannot_take_photo");
    } finally {
        await axios.post(`http://${ipCamera}:6002/mvfacial_terminal`, {
            id: 1,
            jsonrpc: "2.0",
            method: "collect_cancel",
            params: null,
        });
        console.log("stop_handle_run");
    }
};

const handleSendDataUser = async (socket, dataUser) => {
    try {
        const response = await axios.post(
            `http://${ipCamera}/cgi-bin/entry.cgi/event/person-info`,
            dataUser?.bodyParamsSendKamera,
            {
                headers: {
                    'Cookie': dataUser?.CookieSend,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("dataUser", dataUser);
        console.log(response.data, "responsenyasaatini");
        socket.emit("responseSendDataUser", response.data.status.message);
    } catch (error) {
        console.error('Error:', error);
    }
}


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

const handleSendDataToApi = async (socket, dataUser) => {
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
    }
    try {
        const response = await axios.post(
            `http://192.168.2.143/plb-api/data_user_insert.php`,
            dataTosendAPI,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response.data.status === "OK") {
            try {
                const response = await axios.post(
                    `http://${ipCamera}/cgi-bin/entry.cgi/event/person-info`,
                    dataUser?.bodyParamsSendKamera,
                    {
                        headers: {
                            'Cookie': dataUser?.CookieSend,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                socket.emit("responseSendDataUserFromServer", response.data.status.message);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleGetDataFilter = async (socket, dataUser) => {
    try {
        const response = await axios.post(
            `http://${ipCamera}/mdb/query`,
            { "name": "", "begin_time": "", "end_time": "", "query_type": 0, "offset": 0, "count": 100, "personCode": "", "page": 1, "limit": 100 },
            {
                headers: {
                    'Cookie': dataUser?.CookieSend,
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

io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");

    socket.emit("cameraDataToClient", {
        ipServerCamera: ipCamera,
    });
    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
    });
    socket.on("take_photo", () => {
        handleTakePhoto(socket);
    });

    socket.on("sendDataUser", (data) => {
        handleSendDataUser(socket, data);
    });

    socket.on("historyLog", (data) => {
        handleGetDataRecords(socket, data);
    });

    socket.on("startFilterUser", (data) => {
        handleGetDataFilter(socket, data);
    });

    socket.on("sendDataUserToServer", (data) => {
        handleSendDataToApi(socket, data);
    });

});