const smartcard = require("smartcard");
const Devices = smartcard.Devices;
const Iso7816Application = smartcard.Iso7816Application;
const hexify = require("hexify");
const CommandApdu = smartcard.CommandApdu;
const TLV = require("node-tlv");
const devices = new Devices();
const http = require("http");
const socketIo = require("socket.io");
const hex2ascii = require("hex2ascii");

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*", // Replace with your client's origin URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const { networkInterfaces } = require("os");

function splitAFL(dataHex) {
  const chunks = dataHex.match(/.{1,8}/g) || [];
  return chunks;
}
let data = {};

devices.on("device-activated", (event) => {
  const currentDevices = event.devices;
  let device = event.device;
  console.log(`Device '${device}' activated, devices: ${currentDevices}`);
  for (let prop in currentDevices) {
    console.log("Devices: " + currentDevices[prop]);
  }

  device.on("card-inserted", async (event) => {
    let card = event.card;
    const atr = card.getAtr();
    console.log(`Card '${card.getAtr()}' inserted into '${event.device}'`);

    const initialHeader = atr.slice(0, 2);
    const numHistoricalBytes = parseInt(atr.slice(2, 4), 16);
    const t0Configuration = atr.slice(4, 6);
    const t1Configuration = atr.slice(6, 8);
    const historicalBytes = atr.slice(8, 8 + numHistoricalBytes * 2);
    const tck = atr.slice(-2);

    console.log("Initial Header:", initialHeader);
    console.log("Number of Historical Bytes:", numHistoricalBytes);
    console.log("T=0 Configuration:", t0Configuration);
    console.log("T=1 Configuration:", t1Configuration);
    console.log("Historical Bytes:", historicalBytes);
    console.log("TCK:", tck);

    console.log(`Card '${card.getAtr()}' inserted into '${event.device}'\n`);

    card.on("command-issued", (event) => {
      console.log(`Command '${event.command}' issued to '${event.card}'\n`);
    });

    // card.on("response-received", (event) => {
    //   console.log(
    //     `Response '${event.response}' received from '${event.card}' in response to '${event.command}'\n`
    //   );
    // });

    const application = new Iso7816Application(card);
    let res = null;
    let tlv = null;
    let aid = null;
    let pdol = null;
    let ccnum = null;
    let expdate = null;
    let isPDOL = false;
    let isGPO = null;
    let cardtype = null;

    application.on("application-selected", (event) => {
      console.log(`Application Selected ${event.application}`);
    });

    application
      .selectFile([
        0x31, 0x50, 0x41, 0x59, 0x2e, 0x53, 0x59, 0x53, 0x2e, 0x44, 0x44, 0x46,
        0x30, 0x31,
      ])
      .then((response) => {
        console.info(
          `Select PSE Response: '${response}' '${response.meaning()}'`
        );
        return application.issueCommand(
          new CommandApdu({
            bytes: [0x00, 0xb2, 0x01, 0x0c, 0x00],
          })
        );
      })
      .then((response) => {
        console.info(
          `READ RECORD Response: '${response}' '${response.meaning()}'`
        );
        res = response.data;
        tlv = TLV.parse(res);
        aid = tlv.find("4f");
        return application.selectFile(hexify.toByteArray(aid.value));
      })
      .then(async (response) => {
        console.info(
          `SELECT APP WITH AID Response: '${response}' '${response.meaning()}'`
        );
        res = response.data;
        tlv = TLV.parse(res);
        let temp = tlv.find("50");
        cardtype = hex2ascii("0x" + temp.value);
        console.log("cardtype", cardtype);
        data.cardtype = cardtype;
        pdol = tlv.find("9f38");
        if (pdol && cardtype.includes("Debit")) {
          return application.issueCommand(
            new CommandApdu({
              // set this bytes to send data 500k idr + 19,5k idr for visa on arrival proposal
              bytes: [0x80, 0xa8, 0x00, 0x00, 0x04, 0x83, 0x02, 0x69, 0x64],
            })
          );
        } else if (pdol) {
          console.log("PDOL found");
          return application.issueCommand(
            new CommandApdu({
              // set this bytes to send data 500k idr + 19,5k idr for visa on arrival proposal
              bytes: [
                0x80, 0xa8, 0x00, 0x00, 0x23, 0x83, 0x21, 0xf0, 0x20, 0x40,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x09, 0x56, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x09, 0x78, 0x20, 0x12, 0x31, 0x00, 0x01, 0x02, 0x03, 0x04,
                0x00,
              ],
            })
          );
        } else {
          console.log("PDOL not found");

          // Issue default command
          let apdu = new CommandApdu({
            bytes: [0x80, 0xa8, 0x00, 0x00, 0x02, 0x83, 0x00, 0x00],
          });
          return application.issueCommand(apdu);
        }
      })
      .then((response) => {
        console.info(`GPO Response: '${response} '${response.meaning()}'`);
        res = response.data;
        tlv = TLV.parse(res);
        let cc = tlv.find("57");
        if (cc) {
          ccnum = cc.value.slice(0, 16);
          expdate = cc.value.slice(17, 21);
          isPDOL = true;
          data.ccnum = ccnum;
          data.expdate = expdate;
          console.table(data);
          sendServertoClient(data);
        } else if (tlv.tag === "77") {
          console.log("response 77");
          isGPO = 77;
          let afl = TLV.parse(res).find("94").value;
          let aflLength = afl.length / 2;
          // console.log("afl: ", afl);

          const aflChunks = splitAFL(afl);
          console.log("afl: ", aflChunks);

          const substringChunk = aflChunks[0].substring(0, 2);
          const decimalValue = parseInt(substringChunk, 16);
          console.log(substringChunk);

          let p1 = aflChunks[0].substring(2, 4);
          let p2 = aflChunks[0].substring(4, 6);
          const updatedDecimalValue = decimalValue + 4;
          const updatedHexValue = updatedDecimalValue
            .toString(16)
            .padStart(2, "0");
          console.log(
            `[=] ${1}: ${substringChunk} ${
              aflChunks[0]
            } SFI: ${updatedHexValue} P1: ${p1} P2: ${p2}`
          );
          return application.issueCommand(
            new CommandApdu({
              bytes: [0x00, 0xb2, p1, updatedDecimalValue, 0x00],
            })
          );
        } else if (tlv.tag === "80") {
          console.log("response 80: ");
          isGPO = 80;
          let acl = res.slice(4, 8);
          let afl = res.slice(8, -4);
          let aflLength = res.slice(8, -4).length;
          // console.log("acl: ", acl, "afl: ", afl);

          const aflChunks = splitAFL(afl);

          const substringChunk = aflChunks[0].substring(0, 2);
          const decimalValue = parseInt(substringChunk, 16);
          let p1 = aflChunks[0].substring(2, 4);
          let p2 = aflChunks[0].substring(4, 6);
          const updatedDecimalValue = decimalValue + 4;
          const updatedHexValue = updatedDecimalValue
            .toString(16)
            .padStart(2, "0");
          console.log(
            `[=] ${1}: ${substringChunk} ${
              aflChunks[1]
            } SFI: ${updatedHexValue} P1: ${p1} P2: ${p2}`
          );
          return application.issueCommand(
            new CommandApdu({
              bytes: [0x00, 0xb2, p1, updatedDecimalValue, 0x00],
            })
          );
        }
      })
      .then(async (response) => {
        if (isPDOL) {
          return;
        } else {
          if (isGPO === 77) {
            res = response.data;
            tlv = TLV.parse(res);
            if (data.cardtype.includes("NSICCS")) {
              console.log("response NSICCS: ", response);
              let tlvFindCartType = tlv.find("5f20");
              console.log("tlvFindCartType", tlvFindCartType.value);
              let cc = tlv.find("57");
              const ccnum = cc.value.slice(0, 16);
              const expdate = cc.value.slice(17, 21);
              data.ccnum = ccnum;
              data.expdate = expdate;
              let temp = hex2ascii("0x" + tlvFindCartType.value);
              const cardVisa = temp.match(/\bVISA\b/g);
              const cardMastercard = temp.match(/\bMastercard\b/g);
              const cardJCB = temp.match(/\bJCB\b/g);
              const cardGPN = temp.match(/\bGPN\b/g);
              if (cardVisa) {
                data.cardtype = cardVisa[0];
              } else if (cardMastercard) {
                data.cardtype = cardMastercard[0];
              } else if (cardJCB) {
                data.cardtype = cardJCB[0];
              } else if (cardGPN) {
                data.cardtype = cardGPN[0];
              } else {
                data.cardtype = "";
              }
              console.table(data);
              sendServertoClient(data);
            } else {
              ccnum = tlv.find("5a").value;
              expdate = tlv.find("5f24").value;
              data.ccnum = ccnum;
              data.expdate = expdate;
              console.table(data);
              sendServertoClient(data);
            }
          } else if (isGPO === 80) {
            res = response.data;
            tlv = TLV.parse(res);
            let cc = tlv.find("57");
            ccnum = cc.value.slice(0, 16);
            expdate = cc.value.slice(17, 21);
            data.ccnum = ccnum;
            data.expdate = expdate;
            console.table(data);
            sendServertoClient(data);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error, error.stack);
      });
  });
  device.on("card-removed", (event) => {
    console.log(`Card removed from '${event.name}' \n`);
  });
});

devices.on("device-deactivated", (event) => {
  console.log(
    `Device '${event.device}' deactivated, devices: [${event.devices}]`
  );
});

const sendServertoClient = (message) => {
  io.emit("getCredentials", message);
};

io.on("connection", (socket) => {
  let wifiResults = getWifiResults();
  console.log("connected");
  let status = "connected";
  socket.emit("connected", status);
  socket.emit("getCredentials", data);
  socket.emit("getIpAddress", wifiResults);

  socket.on("clientData", (data) => {
    if (data === "re-newIpAddress") {
      let newWifiResults = getWifiResults();
      console.log("new ip address: ", newWifiResults);
      socket.emit("getIpAddress", newWifiResults);
    }
  });
});

server.listen(4499, () => {
  console.log(`Server running on port 4499`);
});

function getWifiResults() {
  const nets = networkInterfaces();
  const results = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  const wifiResults = {};
  let wifiFound = false;

  for (const name of Object.keys(results)) {
    if (name.toLowerCase().includes("wi-fi")) {
      const ipAddressV4 = results[name][0];
      wifiResults.ipAddressV4 = ipAddressV4;
      wifiFound = true;
      break;
    }
  }

  if (!wifiFound) {
    const ipAddressV4 = Object.values(results)
      .flatMap((ipArray) => ipArray)
      .find((ip) => ip.includes("192.168."));

    wifiResults.ipAddressV4 = ipAddressV4 || "No local IP found";
  }

  return wifiResults;
}