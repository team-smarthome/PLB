const fs = require("fs");
const path = require("path");

const webSocketsServerPort = 4040;
const http = require("http");
const socketIo = require("socket.io");

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

function getLatestImageFromFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        return { error: "error_folder" };
    }

    const files = fs.readdirSync(folderPath);

    const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(folderPath, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

    if (imageFiles.length > 0) {
        return { path: path.join(folderPath, imageFiles[0].name) };
    }
    return { error: "error_image" };
}

function clearFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            fs.unlinkSync(path.join(folderPath, file));
        }
    }
}

function handleTakePhoto(socket) {
    console.log("Taking photo...");
    const folderPath = "C:/pos-lintas-batas/photo-document";
    const latestImageInfo = getLatestImageFromFolder(folderPath);

    if (latestImageInfo.error) {
        console.log(latestImageInfo.error);
        socket.emit("document-data", { error: latestImageInfo.error });
    } else {
        const imageBuffer = fs.readFileSync(latestImageInfo.path);
        const base64Image = imageBuffer.toString("base64");

        socket.emit("document-data", { image: base64Image });

        clearFolder(folderPath);
    }
}

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("get-document", () => {
        console.log("# RECEIVED ACTION Get Document FROM FRONTEND #");
        handleTakePhoto(socket);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
