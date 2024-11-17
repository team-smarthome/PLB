const { parentPort } = require('worker_threads');
const axios = require('axios');

async function fetchImageAsBase64(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        return Buffer.from(response.data, "binary").toString("base64");
    } catch (error) {
        console.error("Error fetching image:", error.message);
        return null;
    }
}

parentPort.on('message', async (log) => {
    try {
        const processedData = [];
        for (const item of log.data) {
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
        }
        parentPort.postMessage(processedData);
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
});
