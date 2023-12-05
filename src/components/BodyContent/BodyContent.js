import React, { useState, useRef, useEffect } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import "./BodyContentStyle.css";

const BodyContent = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedData, setReceivedData] = useState(null);
  const [localIP, setLocalIP] = useState("Fetching...");
  const [passportImage, setPassportImage] = useState({});

  const [sharedData, setSharedData] = useState({
    passportData: null,
  });
  const handleDataFromCardStatus = (data) => {
    setSharedData({
      ...sharedData,
      passportData: data,
    });
  };

  // useEffect(() => {
  //   const getLocalIP = () => {
  //     const peerConnection = new RTCPeerConnection({ iceServers: [] });

  //     peerConnection.createDataChannel("");
  //     peerConnection
  //       .createOffer()
  //       .then((offer) => peerConnection.setLocalDescription(offer));

  //     peerConnection.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
  //         const ipAddress = ipRegex.exec(event.candidate.candidate)[1];

  //         console.log("Local IP Address:", ipAddress);

  //         setLocalIP(ipAddress);
  //       }
  //     };
  //   };

  //   getLocalIP();
  // }, []);

  // useEffect(() => {
  //   // Pastikan bahwa nilai localIP sudah terupdate sebelum memanggil connectWebSocket
  //   if (localIP !== "Fetching...") {
  //     connectWebSocket();
  //   }
  // }, [localIP]);

  const connectWebSocket = () => {
    const ipAddress = "192.168.1.38";

    if (ipAddress) {
      const socketURL = `ws://${ipAddress}:5588`;
      socketRef.current = new WebSocket(socketURL);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        setIsConnected(true);
      };
    }

    socketRef.current.onmessage = (event) => {
      const dataJson = JSON.parse(event.data);
      console.log("dataJson: ", dataJson);
      switch (dataJson.msgType) {
        case "passportData":
          setSharedData({ passportData: dataJson });
          // console.log("setSharedData: ", sharedData);
          break;
        case "visibleImage":
          setPassportImage(dataJson);
          // console.log(atob(passportImage.visibleImage));
          // console.log("setPassportImage: ", passportImage);
          break;
        default:
          break;
      }
      // setReceivedData(dataJson);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const sendMessage = (messageCode) => {
    console.log(socketRef.current);
    if (socketRef.current && socketRef.current.readyState === 1) {
      const messageObj = {
        msgCode: messageCode,
      };
      console.log(messageObj);
      socketRef.current.send(JSON.stringify(messageObj));
    } else {
      console.log("WebSocket connection is not open.");
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <div className="body-content">
      <div className="left-panel">
        <div className="left-panel-top">
          <CardList />
        </div>
        <div className="left-panel-bottom">
          <CardStatus sendDataToInput={handleDataFromCardStatus} />
        </div>
      </div>
      <div className="right-panel">
        <FormData
          sharedData={sharedData}
          setSharedData={setSharedData}
          passportImage={passportImage}
          setPassportImage={setPassportImage}
        />
      </div>
    </div>
  );
};

export default BodyContent;
