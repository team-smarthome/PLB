const webSocketsServerPort = 4030;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = '192.168.2.210';
let cookiesCamera = '';
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

const handleHistoryLogs = async () => {
    console.log("masukkesini")
    const responseNotfound = {
        "status": 404,
        "message": "User Not Found",
        "records": []
    }
    const responseExpired = {
        "status": 401,
        "message": "Your session has expired.",
        "records": []
    }
    let timeNow = new Date();
    timeNow.setHours(23, 59, 59, 0);
    let epochTime = Math.floor(timeNow.getTime() / 1000);
    try {
        console.log("masukkesini2")
        const response = await axios.put(
            `http://${ipCamera}/cgi-bin/entry.cgi/event/control-record?search=condition2`,
            { "name": "", "beginTime": "-25200", "endTime": `${epochTime}`, "type": "all", "gender": "all", "beginPosition": 0, "endPosition": 19, "limit": 20, "page": 1, "status": "all", "passState": 0, "passStatus": -1, "personCode": "", "minAge": 0, "maxAge": 100 },
            {
                headers: {
                    'Cookie': cookiesCamera,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("masukkesini21")
        console.log('response', response.data)
        if (response.data.status.message === "Successfully") {
            if (response?.data?.data?.matchList.length > 0) {
                console.log("masukkesini3")
                // socket.emit("responseHistoryLogs", response?.data?.data?.matchList);
            } else {
                console.log("masukkesini4")
                // socket.emit("responseHistoryLogs", responseNotfound);
            }
        } else {
            if (response.data.status === 'Your session has expired.') {
                console.log("masukkesini5")
                // socket.emit("responseHistoryLogs", responseExpired);
            } else {
                console.log("masukkesini6")
                // socket.emit("responseHistoryLogs", responseNotfound);
            }
        }
    } catch (error) {
        console.log("masukkesini7")
        console.error('Error:', error.message);
    }
}

handleHistoryLogs();




io.on("connection", (socket) => {
    socket.emit("message", "Welcome to the RTSP to HLS stream");
    // socket.on("saveCameraData", (data) => {
    //     ipCamera = data.ipServerCamera;
    //     console.log("DataDariInformation", data);
    // });

    socket.on("historyLog", () => {
        console.log("============masukkesinigksi============")
        handleHistoryLogs(socket);
    });

    socket.on("logHistory2", (data) => {
        console.log(data, "dataSocket")
        ipCamera = data?.ipServerCamera;
        cookiesCamera = data?.cookiesCamera

        if (ipCamera !== '' && cookiesCamera !== '') {
            console.log("masukkesini")
            handleHistoryLogs(socket);
        }
    });


});