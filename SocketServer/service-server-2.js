// Importing necessary libraries
const smartcard = require("smartcard");
const Devices = smartcard.Devices;
const Iso7816Application = smartcard.Iso7816Application;
const CommandApdu = smartcard.CommandApdu;
const TLV = require("node-tlv");
const devices = new Devices();
const http = require("http");
const socketIo = require("socket.io");
const hex2ascii = require("hex2ascii");
const hexify = require("hexify");

// Create HTTP server and WebSocket server
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*", // Change to your client's origin URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const net = require("net");

// Define the server details
const serverHost = "127.0.0.1";
const serverPort = 8888;

const client = new net.Socket();

function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}

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
          // deviceNo: "12321SS4BAHS",
          deviceNo: "12321SS4BAHS",
          action: "heartbeat",
          timestamp: getCurrentTimeInSeconds(),
          interval: 30,
          local_ip: "192.168.1.23",
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

// Function to split AFL (Application File Locator) data into chunks
function splitAFL(dataHex) {
  const chunks = dataHex.match(/.{1,8}/g) || [];
  return chunks;
}

// AID list for different card types
const aidList = [
  {
    name: "Mastercard",
    value: "A0000000041010",
  },
  {
    name: "Visa",
    value: "A0000000031010",
  },
  {
    name: "Amex",
    value: "A000000025",
  },
  {
    name: "JCB",
    value: "A000000065",
  },
];

// async function kirimSnapshot(socket) {
//   try {
//     const url = "http://192.168.1.:6067/attendDevice/sendSnapshot";
//     const requestBody = {
//       deviceNo: "12321SS4BAHS",
//     };
//     const response = await axios.post(url, requestBody, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     // console.log("Response:", response.data);

//     if (response.data.message === "success") {
//       setTimeout(() => {
//         const directoryPath =
//           "D:/transforme/E-VOA/new-device/camera-1/temp/12321SS4BAHS";
//         const files = fs.readdirSync(directoryPath);
//         let newestFile;
//         let newestTime = 0;

//         files.forEach((file) => {
//           const filePath = path.join(directoryPath, file);
//           const fileStat = fs.statSync(filePath);

//           if (file.startsWith("F") && fileStat.mtimeMs > newestTime) {
//             newestTime = fileStat.mtimeMs;
//             newestFile = file;
//           }
//         });

//         // Pastikan file ditemukan sebelum melanjutkan
//         if (!newestFile) {
//           console.log("Tidak ada file yang ditemukan.");
//           return;
//         }

//         const imagePath = path.join(directoryPath, newestFile);

//         // Baca file gambar dan ubah menjadi base64
//         const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
//         console.log("imageBase64: ", imageBase64);
//         console.log("keluar kirimSnapshot");

//         // Kirim base64 ke client
//         socket.emit("snapshot_data", {
//           base64: imageBase64,
//           filename: newestFile,
//         });
//       }, 3000);
//     }

//     // Cari file gambar dengan awalan 'F' dan pilih yang terbaru
//     console.log("Masuk kirimSnapshot");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

async function kirimSnapshot(socket) {
  try {
    console.log("Masuk kirimSnapshot WOIIII");
    const url = "http://192.168.1.24:6067/attendDevice/sendSnapshot";
    const requestBody = {
      deviceNo: "12321SS4BAHS",
    };
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Response:", response.data); 

    if (response.data.message === "success") {
      setTimeout(() => {
        const directoryPath =
          "D:/transforme/E-VOA/new-device/camera-1/temp/12321SS4BAHS";
          if (!fs.existsSync(directoryPath)) {
            socket.emit("not-found-directory", {
              "message": "directory-not-found"
            });
            console.log("Direktori tidak ditemukan.");
            return;
          }
        const files = fs.readdirSync(directoryPath);
        let newestFile;
        let newestTime = 0;

        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);

          if (file.startsWith("F") && fileStat.mtimeMs > newestTime) {
            newestTime = fileStat.mtimeMs;
            newestFile = file;
          }
        });

        if (!newestFile) {
          // socket.emit("gagal_snapshot", {
          //  "message": "no-image-found"
          // });
          kirimSnapshot(socket);
          console.log("Tidak ada file yang ditemukan.");
          return;
        }

        const imagePath = path.join(directoryPath, newestFile);
        const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
        console.log("imageBase64: ", imageBase64);
        console.log("keluar kirimSnapshot");

        socket.emit("snapshot_data", {
          base64: imageBase64,
          filename: newestFile,
        });

        // Hapus file setelah dikirimkan
        fs.unlinkSync(imagePath);
        console.log("File dihapus setelah berhasil dikirim.");

      }, 2000);
    } else {
      socket.emit("gagal_snapshot", {
        "message": "failed-to-take-snapshot"
      });
    }


  } catch (error) {
    console.error("Error:", error);
  }
}



async function commandSelectPSE(application, card, data) {
  let response = await application.selectFile(data);
  return response;
}

async function commandReadRecord(application, card, data) {
  let apdu = new CommandApdu({
    bytes: data,
  });

  let response = await application.issueCommand(apdu);
  return response;
}

async function commandGetGPO(application, card, data) {
  let apdu = new CommandApdu({
    bytes: data,
  });

  let response = await application.issueCommand(apdu);
  return response;
}

async function commandSelectAID(application, card, data) {
  let response = await application.selectFile(data);
  return response;
}

// Object to store card data
let dataStore = {};

function setupDevicesEvent(devices) {
  // Event listener for device activation
  devices.on("device-activated", (event) => {
    const currentDevices = event.devices;
    let device = event.device;
    console.log(`Device '${device}' activated, devices: ${currentDevices}`);
    for (let prop in currentDevices) {
      console.log("Devices: " + currentDevices[prop]);
    }

    // Event listener for card insertion
    device.on("card-inserted", async (event) => {
      let card = event.card;
      const atr = card.getAtr();
      console.log(`Card '${card.getAtr()}' inserted into '${event.device}'`);

      // Log card information
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

      async function parseGPO(application, card, data) {
        console.log("========== START PARSE GPO ==========");
        console.log("GPO Data: ", data);
        res = data;
        tlv = TLV.parse(res);
        let cc = tlv.find("57");
        if (cc) {
          ccnum = cc.value.slice(0, 16);
          expdate = cc.value.slice(17, 21);
          isPDOL = true;
          dataStore.ccnum = ccnum;
          dataStore.expdate = expdate;
          console.table(dataStore);

          // Validate credit card number using Luhn algorithm
          if (validateCreditCardNumber(ccnum)) {
            console.log("Valid Credit Card Number:", ccnum);
            // Proceed with handling the valid credit card number
          } else {
            console.log("Invalid Credit Card Number:", ccnum);
            // Handle invalid credit card number
          }
          sendServertoClient("getCredentials", dataStore);
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
          let responseReadRecord = await commandReadRecord(application, card, [
            0x00,
            0xb2,
            p1,
            updatedDecimalValue,
            0x00,
          ]);
          console.info(
            `READ RECORD Response 77: '${responseReadRecord.isOk()}' '${responseReadRecord}' '${responseReadRecord.meaning()}'`
          );

          if (responseReadRecord.isOk()) {
            res = responseReadRecord.data;
            tlv = TLV.parse(res);
            let cc = tlv.find("57");
            if (cc) {
              ccnum = cc.value.slice(0, 16);
              expdate = cc.value.slice(17, 21);
              dataStore.ccnum = ccnum;
              dataStore.expdate = expdate;
            } else {
              let cc = tlv.find("5a");
              ccnum = cc.value;
              let exp = tlv.find("5f24");
              expdate = exp.value;
              dataStore.ccnum = ccnum;
              dataStore.expdate = expdate;
            }

            if (dataStore.cardtype.includes("NSICCS")) {
              console.log("response NSICCS: ", res);
              let tlvFindCartType = tlv.find("5f20");
              console.log("tlvFindCartType", tlvFindCartType.value);
              let temp = hex2ascii(tlvFindCartType.value.replace(/20/g, ""));
              console.log("temp", temp);
              const cardVisa = ccnum.startsWith("4");
              const cardMastercard = ccnum.startsWith("5");
              const cardJCB = ccnum.startsWith("35");
              const cardGPN = ccnum.startsWith("3");

              if (cardVisa) {
                dataStore.cardtype = "Visa";
              } else if (cardMastercard) {
                dataStore.cardtype = "Mastercard";
              } else if (cardJCB) {
                dataStore.cardtype = "JCB";
              } else if (cardGPN) {
                dataStore.cardtype = "GPN";
              } else {
                dataStore.cardtype = "";
              }
            } else {
              // Deteksi kartu berdasarkan prefix nomor kartu (panjang 6 digit pertama)
              const cardVisa = ccnum.startsWith("4");
              const cardMastercard = ccnum.startsWith("5");
              const cardJCB = ccnum.startsWith("35");
              const cardGPN = ccnum.startsWith("3");

              if (cardVisa) {
                dataStore.cardtype = "Visa";
              } else if (cardMastercard) {
                dataStore.cardtype = "Mastercard";
              } else if (cardJCB) {
                dataStore.cardtype = "JCB";
              } else if (cardGPN) {
                dataStore.cardtype = "GPN";
              } else {
                dataStore.cardtype = "";
              }
            }

            console.table(dataStore);
            sendServertoClient("getCredentials", dataStore);
          }
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

          let responseReadRecord = await commandReadRecord(application, card, [
            0x00,
            0xb2,
            p1,
            updatedDecimalValue,
            0x00,
          ]);
          console.info(
            `READ RECORD Response 80: '${responseReadRecord.isOk()}' '${responseReadRecord}' '${responseReadRecord.meaning()}'`
          );

          if (responseReadRecord.isOk()) {
            res = responseReadRecord.data;
            tlv = TLV.parse(res);
            let cc = tlv.find("57");
            ccnum = cc.value.slice(0, 16);
            expdate = cc.value.slice(17, 21);
            dataStore.ccnum = ccnum;
            dataStore.expdate = expdate;
            console.table(dataStore);
            sendServertoClient("getCredentials", dataStore);
          }
        }
        console.log("========== END PARSE GPO ==========");
      }

      async function prosesGPO(application, card, data) {
        console.log("========== START PROCCES GPO ==========");
        console.log("GPO Data: ", data);
        res = data;
        tlv = TLV.parse(res);
        let temp = tlv.find("50");
        cardtype = hex2ascii("0x" + temp.value);
        console.log("cardtype", cardtype);
        dataStore.cardtype = cardtype;
        pdol = tlv.find("9f38");

        console.log("Card Type: ", cardtype);
        // console.log("PDOL: ", pdol);
        if (pdol && cardtype.includes("Debit")) {
          let responseGPO = await commandGetGPO(
            application,
            card,
            [0x80, 0xa8, 0x00, 0x00, 0x04, 0x83, 0x02, 0x69, 0x64]
          );
          console.info(
            `GPO Response: '${responseGPO.isOk()}' '${responseGPO}' '${responseGPO.meaning()}'`
          );
          if (responseGPO.isOk()) {
            await parseGPO(application, card, responseGPO.data);
          }
        } else if (pdol) {
          console.log("PDOL found");
          let responseGPO = await commandGetGPO(
            application,
            card,
            [
              0x80, 0xa8, 0x00, 0x00, 0x23, 0x83, 0x21, 0xf0, 0x20, 0x40, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x09, 0x56, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0x78, 0x20,
              0x12, 0x31, 0x00, 0x01, 0x02, 0x03, 0x04, 0x00,
            ]
          );
          console.info(
            `GPO Response: '${responseGPO.isOk()}' '${responseGPO}' '${responseGPO.meaning()}'`
          );
          if (responseGPO.isOk()) {
            await parseGPO(application, card, responseGPO.data);
          }
        } else {
          console.log("PDOL not found");
          let responseGPO = await commandGetGPO(
            application,
            card,
            [0x80, 0xa8, 0x00, 0x00, 0x02, 0x83, 0x00, 0x00]
          );
          console.info(
            `GPO Response: '${responseGPO.isOk()}' '${responseGPO}' '${responseGPO.meaning()}'`
          );
          if (responseGPO.isOk()) {
            await parseGPO(application, card, responseGPO.data);
          }
        }

        console.log("========== END PROCCESS GPO ==========");
      }

      // Event listener for application selection
      application.on("application-selected", (event) => {
        console.log(`Application Selected ${event.application}`);
      });

      try {
        console.log("========== START COMMAND ==========");
        let responseSelectPSE = await commandSelectPSE(
          application,
          card,
          [
            0x31, 0x50, 0x41, 0x59, 0x2e, 0x53, 0x59, 0x53, 0x2e, 0x44, 0x44,
            0x46, 0x30, 0x31,
          ]
        );
        console.info(
          `Select PSE Response: '${responseSelectPSE.isOk()}' '${responseSelectPSE}' '${responseSelectPSE.meaning()}'`
        );
        // if PSE is selected, issue READ RECORD command
        if (responseSelectPSE.isOk()) {
          let responseReadRecord = await commandReadRecord(
            application,
            card,
            [0x00, 0xb2, 0x01, 0x0c, 0x00]
          );
          console.info(
            `READ RECORD Response: '${responseReadRecord.isOk()}' '${responseReadRecord}' '${responseReadRecord.meaning()}'`
          );
          res = responseReadRecord.data;
          tlv = TLV.parse(res);
          aid = tlv.find("4f");
          console.log("AID: ", aid.value);
          let responseSelectAID = await commandSelectAID(
            application,
            card,
            hexify.toByteArray(aid.value)
          );
          console.info(
            `SELECT APP WITH AID Response: '${responseSelectAID.isOk()}' '${responseSelectAID}' '${responseSelectAID.meaning()}'`
          );
          if (responseSelectAID.isOk()) {
            await prosesGPO(application, card, responseSelectAID.data);
          }
        } else {
          console.error("Error: Response Select PSE failed");
          for (let i = 0; i < aidList.length; i++) {
            let responseSelectAID = await commandSelectAID(
              application,
              card,
              hexify.toByteArray(aidList[i].value)
            );
            console.info(
              `SELECT APP WITH AID Response index: '${
                aidList[i].value
              }' '${responseSelectAID.isOk()}' '${responseSelectAID}' '${responseSelectAID.meaning()}'`
            );
            if (responseSelectAID.isOk()) {
              await prosesGPO(application, card, responseSelectAID.data);
              break;
            }
          }
        }

        console.log("========== END COMMAND ==========");
      } catch (error) {
        console.error("Error in card communication:", error);
        setupDevicesEvent(devices);
        // Event listener for card removal
        // card.on("card-removed", (event) => {
        //   console.log(`Card removed from '${event.name}' \n`);
        // });
      }
      // Event listener for card removal
      // card.on("card-removed", (event) => {
      //   console.log(`Card removed from '${event.name}' \n`);
      // });
    });

    // // Event listener for card removal
    device.on("card-removed", (event) => {
      console.log(`Card removed from '${event.name}' \n`);
    });
  });

  // Event listener for device deactivation
  devices.on("device-deactivated", (event) => {
    console.log(
      `Device '${event.device}' deactivated, devices: [${event.devices}]`
    );
  });
}

setupDevicesEvent(devices);

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("client connected to server socket.io 4499");
  socket.emit("isRequest", "EMAIL");

  socket.on("WebClientMessage", (data) => {
    // console.log("WebClientMessage Data: ", data);
    const dataParse = JSON.parse(data);
    // console.log("dataParse: ", dataParse);
    console.log("WebClientMessage: ", dataParse);
    switch (dataParse.code) {
      case "email":
        sendServertoClient("isRequest", "EMAIL");
        break;
      case "card":
        sendServertoClient("isRequest", "CARD");
        break;
      case "input-card-number":
        sendServertoClient("onMessage", JSON.stringify(dataParse));
        break;
      case "input-expired":
        sendServertoClient("onMessage", JSON.stringify(dataParse));
        break;
      case "input-cvv":
        sendServertoClient("onMessage", JSON.stringify(dataParse));
        break;
      case "take-snapshot":
        kirimSnapshot(socket);
        break;
      default:
        sendServertoClient("isRequest", "DEFAULT");
    }
  });

  socket.on("DeviceAppClient", (data) => {
    console.log("DeviceAppClient Data: ", data);
    const dataParse = JSON.parse(data);
    // console.log("DeviceAppClient dataParse: ", dataParse);
    switch (dataParse.code) {
      case "SUBMIT-EMAIL":
        sendServertoClient("isRequest", "DEFAULT");
        sendServertoClient("submit-email", JSON.stringify(dataParse));
        break;
      case "SUBMIT-CARD":
        sendServertoClient("isRequest", "DEFAULT");
        sendServertoClient("submit-card", JSON.stringify(dataParse));

        break;
      case "input-email":
        sendServertoClient("input-email", JSON.stringify(dataParse));
        break;
      case "input-email-confirm":
        sendServertoClient("input-email-confirm", JSON.stringify(dataParse));
        break;
      case "input-card-number":
        sendServertoClient("input-card-number", JSON.stringify(dataParse));
        break;
      case "input-expired":
        sendServertoClient("input-expired", JSON.stringify(dataParse));
        break;
      case "input-cvv":
        sendServertoClient("input-cvv", JSON.stringify(dataParse));
        break;
      case "take-snapshot":
        kirimSnapshot(socket);
        break;
      default:
    }
  });
});

// Function to send data to client
const sendServertoClient = (code, message) => {
  io.emit(code, message);
};

// Function to validate credit card number using Luhn algorithm
function validateCreditCardNumber(ccNum) {
  let sum = 0;
  let doubleUp = false;
  /* from the right to left, double every other digit starting with the second to last digit.*/
  for (let i = ccNum.length - 1; i >= 0; i--) {
    let curDigit = parseInt(ccNum.charAt(i));
    /* double every other digit starting with the second to last digit */
    if (doubleUp) {
      /* doubled number is greater than 9 than subtracted 9 */
      if ((curDigit *= 2) > 9) curDigit -= 9;
    }
    /* add up the digits of the doubled number or the original number.*/
    sum += curDigit;
    /* toggle boolean for doubling digits */
    doubleUp = !doubleUp;
  }
  /* the sum of all the numbers in the ccNum must be divisible by 10 to pass the Luhn formula */
  return sum % 10 == 0;
}

// Starting the server
server.listen(4498, () => {
  console.log(`Server running on port 4499`);
});
