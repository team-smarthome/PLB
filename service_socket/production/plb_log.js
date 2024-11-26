const http = require("http");
const puppeteer = require('puppeteer');
const { default: axios } = require("axios");
const ping = require("ping");
let ipCameraData = [];

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


async function handleHistoryLogs() {
    const timeNow = new Date();
    timeNow.setHours(23, 59, 59, 0);
    const epochTime = Math.floor(timeNow.getTime() / 1000);
    try {
        const onlineCameras = ipCameraData.filter(item => item?.status === "online");

        const logs = await Promise.all(
            onlineCameras.map(camera => fetchCameraLogs(camera, epochTime))
        );

        const allSuccessful = logs.every(log => log.status === "Successfully");

        if (allSuccessful) {
            console.log("All IP Cameras successfully retrieved.");
            for (const log of logs) {
                console.log(`Processing data for IP Camera ${log.ipCamera}:`);
                const processedData = await processCameraData(log);
                await sendDataToAPI(processedData);
            }
        } else {
            console.warn("Some IP Cameras failed to retrieve data.");
        }
    } catch (error) {
        console.error("Unexpected error in handleHistoryLogs:", error.message);
    }

    await main();
}

async function fetchCameraLogs(camera, epochTime) {
    const { ipCamera, is_depart, cookiesCamera } = camera;
    const apiUrl = `http://${ipCamera}/cgi-bin/entry.cgi/event/control-record?search=condition2`;

    try {
        const response = await axios.put(
            apiUrl,
            {
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
            },
            {
                headers: {
                    Cookie: cookiesCamera,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            status: response?.data?.status?.message || "Error",
            data: response?.data?.data?.matchList || [],
            ipCamera,
            is_depart,
        };
    } catch (error) {
        console.error(`Error fetching logs for IP ${ipCamera}:`, error.message);
        return { status: "Error", data: [], ipCamera, is_depart };
    }
}

async function processCameraData(log) {
    const processedData = [];

    for (const item of log.data) {
        try {
            const imageUrl = `http://${log.ipCamera}/ofsimage/${item.images_info[0]?.img_path}`;
            const base64Image = await fetchImageAsBase64(imageUrl);

            processedData.push({
                personId: item.personId,
                personCode: item.personCode,
                name: item.name,
                similarity: item.images_info[0]?.similarity || 0,
                passStatus: item.passStatus === 6 ? "Failed" : "Success",
                time: item.time,
                img_path: base64Image,
                ipCamera: log.ipCamera,
                is_depart: log.is_depart,
            });
        } catch (error) {
            console.error(`Error processing record for IP ${log.ipCamera}:`, error.message);
        }
    }

    return processedData;
}

async function sendDataToAPI(data) {
    try {
        const response = await axios.post("http://127.0.0.1/PLB-API/public/api/face-reg", data);
        console.log("Data sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending data to API:", error.message);
    }
}

async function fetchImageAsBase64(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error fetching image:", error.message);
        return null;
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

async function getDataKamera() {
    try {
        const { data } = await axios.get('http://127.0.0.1/PLB-API/public/api/ip-kamera/SKOW');
        if (data.status === 200) {
            ipCameraData = data.data.map((item) => ({
                ipCamera: item.ipAddress,
                is_depart: item.is_depart,
            }));
        } else {
            console.error("Failed to fetch camera data: Invalid status");
        }
    } catch (error) {
        console.error("Error fetching camera data:", error.message);
    }
}

async function checkIpAccessible(ip) {
    try {
        const res = await ping.promise.probe(ip, { timeout: 2 });
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
            ipCameraData = ipCameraData.map(item =>
                item.ipCamera === ip?.ipCamera ? { ...item, cookiesCamera: loginData, status: "online" } : item
            );
        }
    } catch (error) {
        console.error(`Gagal login untuk IP ${ip}:`, error.message);
    } finally {
        await browser.close();
    }
}

async function main() {
    try {
        await getDataKamera();
        for (const camera of ipCameraData) {
            const { ipCamera } = camera;
            const accessible = await checkIpAccessible(ipCamera);
            if (accessible) {
                await loginKamera(camera);
            } else {
                console.log(`IP ${ipCamera} tidak dapat diakses.`);
            }
        }
        await handleHistoryLogs();
    } catch (error) {
        console.error("Error:", error)
        console.log("Retrying...");
        await main();
    }
}

main().catch(console.error);
