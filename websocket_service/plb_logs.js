const webSocketsServerPort = 4040;
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const ipCamera = [];

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

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


const handleInsertLog = async () => {
    let timeNow = new Date();
    timeNow.setHours(23, 59, 59, 0);
    let epochTime = Math.floor(timeNow.getTime() / 1000);
    try {
        const getDatalog = ipCamera.map(async (ip) => {
            const response = await axios.put(
                `http://${ip}/cgi-bin/entry.cgi/event/control-record?search=condition2`,
                { "name": "", "beginTime": "-25200", "endTime": `${epochTime}`, "type": "all", "gender": "all", "beginPosition": 0, "endPosition": 19, "limit": 20, "page": 1, "status": "all", "passState": 0, "passStatus": -1, "personCode": "", "minAge": 0, "maxAge": 100 },
                {
                    headers: {
                        'Cookie': cookiesCamera,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });
    } catch (error) {
        console.log(error)
    }
}