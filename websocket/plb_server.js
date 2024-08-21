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
            `http://${ipServer}/plb-api/data_user_insert.php`,
            dataTosendAPI,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === "OK") {
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

            socket.emit("responseSendDataUserFromServer", "All requests to cameras were successful.");
        }
    } catch (error) {
        console.error('Error:', error);
        socket.emit("responseSendDataUserFromServer", "Failed to send data to all cameras.");
    }
};


// const handleSendDataToApi = async (socket, dataUser) => {
//     const dataTosendAPI = {
//         no_passport: dataUser?.bodyParamsSendKamera?.personNum,
//         no_register: dataUser?.bodyParamsSendKamera?.personId,
//         name: dataUser?.bodyParamsSendKamera?.name,
//         date_of_birth: dataUser?.bodyParamsSendKamera?.dateOfBirth,
//         gender: dataUser?.bodyParamsSendKamera?.sex,
//         nationality: dataUser?.bodyParamsSendKamera?.nationalityCode,
//         expired_date: dataUser?.bodyParamsSendKamera?.expiryDate,
//         arrival_time: dataUser?.bodyParamsSendKamera?.arrivalTime,
//         destination_location: dataUser?.bodyParamsSendKamera?.destinationLocation,
//         profile_image: dataUser?.bodyParamsSendKamera?.photoFace,
//     }
//     try {
//         const response = await axios.post(
//             `http://${ipServer}/plb-api/data_user_insert.php`,
//             dataTosendAPI,
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         if (response.data.status === "OK") {
//             try {
//                 const response = await axios.post(
//                     `http://${ipCamera}/cgi-bin/entry.cgi/event/person-info`,
//                     dataUser?.bodyParamsSendKamera,
//                     {
//                         headers: {
//                             'Cookie': dataUser?.CookieSend,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );
//                 socket.emit("responseSendDataUserFromServer", response.data.status.message);
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

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

    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
        ipServer = data.ipServerPC;
        cookiesCamera = data.cookiesCamera;
        console.log("DataDariInformation", data);
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