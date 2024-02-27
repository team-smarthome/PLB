const net = require("net");

// Define the server details
const serverHost = "127.0.0.1";
const serverPort = 8888;

// Create a new TCP socket client
const client = new net.Socket();

// Function to get current time
function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}

// Connect to the server
client.connect(serverPort, serverHost, () => {
  console.log("Connected to server");

  // Send data to the server
  const requestData = {
    deviceNo: "12321SS4BAHS",
    action: "connect",
    timestamp: getCurrentTimeInSeconds(),
  };
  console.log("request data", requestData);
  client.write(JSON.stringify(requestData));
});
client.on("data", (data) => {
  console.log("Received data from server:", data.toString("utf-8"));
  const responseData = JSON.parse(data.toString("utf-8"));
  if (responseData.message && responseData.message.code) {
    const code = responseData.message.code;
    switch (code) {
      case "connect":
        // Send data to the server
        const requestData = {
          deviceNo: "12321SS4BAHS",
          action: "heartbeat",
          timestamp: getCurrentTimeInSeconds(),
          interval: 30,
          local_ip: "192.168.1.7",
        };
        console.log("request data", requestData);
        client.write(JSON.stringify(requestData));
        break;
      default:
        break;
    }
  } else {
    console.log("Invalid response data:", responseData);
  }
});
