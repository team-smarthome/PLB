const webSocketsServerPort = 4030;
const http = require("http");
const puppeteer = require('puppeteer');
const { default: axios } = require("axios");
const ping = require("ping");
const socketIo = require("socket.io");


const server = http.createServer(function (request, response) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
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
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    },
});

async function handleHistoryLogs(ipCamera, cookiesCamera) {
    const timeNow = new Date();
    timeNow.setHours(23, 59, 59, 0);
    const epochTime = Math.floor(timeNow.getTime() / 1000);
    try {
        const response = await axios.put(`http://${ipCamera}/cgi-bin/entry.cgi/event/control-record?search=condition2`, {
            name: "",
            beginTime: "-25200",
            endTime: `${epochTime}`,
            type: "all",
            gender: "all",
            beginPosition: 0,
            endPosition: 19,
            limit: 20,
            page: 1,
            status: "all",
            passState: 0,
            passStatus: -1,
            personCode: "",
            minAge: 0,
            maxAge: 100,
        }, {
            headers: {
                Cookie: cookiesCamera,
                "Content-Type": "application/json",
            },
        });

        if (response?.data?.status?.message === "Successfully") {
            const data = response?.data?.data?.matchList[0];
            const imageUrl = `http://${ipCamera}/ofsimage/${data.images_info[0]?.img_path}`;
            const base64Image = await fetchImageAsBase64(imageUrl);
            console.log("dataPerson", data.personId);
            const { data: getDataPassport } = await axios.get(`http://127.0.0.1/PLB-API/public/api/datauser/${data.personId}`);
            if (getDataPassport.data === null) {
                console.log("Data tidak ditemukansaatget");
                return { status: 404, message: "Data tidak ditemukan", data: { base64Image } };
            } else {
                const { data: ResponseCamera } = await axios.get(`http://127.0.0.1/PLB-API/public/api/ipconfig?ipAddress=${ipCamera}`);
                console.log("ResponseCamera", ResponseCamera.data);
                return {
                    status: 200,
                    data: {
                        ...getDataPassport.data,
                        ...response.data.data.matchList[0],
                        base64Image,
                        is_depart: ResponseCamera.data[0]?.is_depart,
                    }
                }
            }
        }

    } catch (error) {
        return { status: error.response.status, message: error.response.data.message };
    }
}


async function fetchImageAsBase64(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        return `${Buffer.from(response.data, "binary").toString("base64")}`;
    } catch (error) {
        console.error("Error fetching image:", error.message);
        return null;
    }
}

async function checkIpAccessible(ip) {
    try {
        const res = await ping.promise.probe(ip, { timeout: 2 });
        console.log(`IP ${ip} is alive:`, res && res.alive);
        return res.alive;
    } catch (error) {
        console.error(`Error pinging IP ${ip}:`, error.message);
        return false;
    }
}

async function loginKamera(ip) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const apiUrl = `http://${ip?.ipCamera}/cgi-bin/entry.cgi/system/login`;
    const requestData = {
        sUserName: 'admin',
        sPassword: btoa('Maxvision@2024')
    };
    try {
        const response = await page.evaluate(async (url, data) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        }, apiUrl, requestData);
        if (response?.status?.code === 200) {
            const loginData = `Face-Token=${response?.data?.token}; face-username="admin"; roleId=${response?.data?.auth}; sidebarStatus=${response?.data?.status}; token=${response?.data?.token}`;
            return {
                ipCamera: ip?.ipCamera,
                cookiesCamera: loginData,
                status: 200,
            }
        }
    } catch (error) {
        return {
            ipCamera: ip?.ipCamera,
            cookiesCamera: "",
            status: 500,
        }
    } finally {
        await browser.close();
    }
}

io.on("connection", (socket) => {
    socket.on('realtimeFR', async (data) => {
        try {
            const accessible = await checkIpAccessible(data.ipCamera);
            if (accessible) {
                const loginKameraResponse = await loginKamera(data);
                if (loginKameraResponse.status === 200) {
                    const { ipCamera, cookiesCamera } = loginKameraResponse;
                    const historyLogs = await handleHistoryLogs(ipCamera, cookiesCamera);
                    socket.emit('realtimeFRResponse', historyLogs);
                    // callback(historyLogs);
                } else {
                    socket.emit('realtimeFRResponse', { status: 500, message: `Gagal login ke IP ${data.ipCamera}` });
                    // callback({ status: 500, message: `Gagal login ke IP ${data.ipCamera}` });
                }
            } else {
                socket.emit('realtimeFRResponse', { status: 404, message: `IP ${data.ipCamera} tidak dapat diakses.` });
                // callback({ status: 404, message: `IP ${data.ipCamera} tidak dapat diakses.` });
            }
        } catch (error) {
            socket.emit('realtimeFRResponse', { status: 500, message: error.message });
            // callback({ status: 500, message: error.message });
        }
    });
});