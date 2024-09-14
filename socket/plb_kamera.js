var spawn = require("child_process").spawn;
const fs = require("fs");
const webSocketsServerPort = 4001;
const http = require("http");
const socketIo = require("socket.io");
let ipCamera = "192.168.2.127";
const ping = require("ping");
let StatusCamera = "OFF";

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
    var filePath = "./videos/stream" + request.url;
    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        if (error) {
            if (error.code === "ENOENT") {
                fs.readFile("./404.html", function (error, content) {
                    response.end(content, "utf-8");
                });
            } else {
                response.writeHead(500);
                response.end(
                    "Sorry, check with the site admin for error: " +
                    error.code +
                    " ..\n"
                );
                response.end();
            }
        } else {
            response.end(content, "utf-8");
        }
    });
});
server.listen(webSocketsServerPort);
console.log("Listening on port " + webSocketsServerPort);
var processHLS = null;

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

function liveCamera() {
    var pathStream = `./videos/stream/stream_.m3u8`;
    // var cmd_ffmpeg = "ffmpeg";
    var cmd_ffmpeg = "/usr/local/bin/ffmpeg"
    var url_rtsp = `rtsp://admin:123456@${ipCamera}:554/stream`;

    var args_parameter = [
        "-fflags",
        "nobuffer",
        "-flags",
        "low_delay",
        "-i",
        url_rtsp,
        "-fflags",
        "flush_packets",
        "-max_delay",
        "0",
        "-flags",
        "+global_header",
        "-hls_time",
        "1",
        "-hls_list_size", "2",
        "-hls_flags", "delete_segments",
        "-vcodec",
        "copy",
        "-acodec",
        "aac",
        "-strict",
        "experimental",
        "-f",
        "hls",
        "-tune",
        "zerolatency",
        "-y",
        pathStream,
    ];

    console.log("Streaming camera...");
    io.emit("stream_camera", `http://localhost:4001/${ipCamera}_.m3u8`);
    console.log(`http://localhost:4001/${ipCamera}_.m3u8`);

    processHLS = spawn(cmd_ffmpeg, args_parameter);

    processHLS.stdout.on("data", function (data) {
    });

    processHLS.stderr.setEncoding("utf8");
    processHLS.stderr.on("data", function (data) {
        console.log(data.toString());
    });

    processHLS.on("error", function (err) {
        console.error(err);

    });

    processHLS.on("close", function (data) {
        // console.log("Process closed with code:", data);
    });
}


function pingForever() {
    ping.sys.probe(ipCamera, function (isAlive) {
        if (!isAlive) {
            StatusCamera = "OFF";
            io.emit("cameraStatus", {
                status: StatusCamera,
            });
        } else if (isAlive) {
            StatusCamera = "ON";
            io.emit("cameraStatus", {
                status: StatusCamera,
            });
        }
        setTimeout(pingForever, 5000);
    });
}


io.on("connection", (socket) => {
    pingForever();
    socket.emit("message", "Welcome to the RTSP to HLS stream");
    socket.emit("stream_camera", `http://localhost:4001/stream_.m3u8`);
    socket.emit("cameraDataToClient", {
        ipServerCamera: ipCamera,
    });
    socket.on("saveCameraData", (data) => {
        ipCamera = data.ipServerCamera;
    });
    socket.on("start_stream", () => {
        liveCamera();
    });

});
liveCamera();