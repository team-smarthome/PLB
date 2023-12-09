import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import dataPaspor from "../../utils/dataPaspor";
import dataPhotoPaspor from "../../utils/dataPhotoPaspor";
import { apiValidationPassport, apiSimpanPermohonan } from "../../services/api";
import "./ApplyStyle.css";

const Apply = () => {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [passportImage, setPassportImage] = useState({});
  const [validationPerformed, setValidationPerformed] = useState(false);
  const [receivedData, setReceivedData] = useState(null);
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(false);
  const [tabStatus, setTabStatus] = useState(1);
  const [cardStatus, setCardStatus] = useState("iddle");
  const [dataPrimaryPassport, setDataPrimaryPassport] = useState(null);
  const [dataPhotoPassport, setDataPhotoPassport] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const [titleHeader, setTitleHeader] = useState("Apply VOA");
  const [titleFooter, setTitleFooter] = useState("Next Step");
  const [dataPermohonan, setDataPermohonan] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [cardPaymentProps, setCardPaymentProps] = useState({
    isConfirm: false,
    isPrinted: false,
    isSuccess: false,
    isFailed: false,
  });

  const [shareDataPaymentProps, setShareDataPaymentProps] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [receiveTempData, setRecievedTempData] = useState([]);

  const connectWebSocket = () => {
    const ipAddress = "192.168.4.31";

    if (ipAddress) {
      const socketURL = `ws://${ipAddress}:4488`;
      socketRef.current = new WebSocket(socketURL);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        setIsConnected(true);
      };
    }

    socketRef.current.onmessage = (event) => {
  const dataJson = JSON.parse(event.data);
  console.log("dataJson: ", dataJson);
  setCardStatus("iddle");

  switch (dataJson.msgType) {
    case "passportData":
      let fullName = dataJson.foreName + " " + dataJson.surName;
      const [day, month, year] = dataJson.birthDate.split("-").map(Number);
      const [day1, month1, year1] = dataJson.expiryDate.split("-").map(Number);

      const adjustedYear = year < 50 ? 2000 + year : 1900 + year;

      const formattedDate = new Date(adjustedYear, month - 1, day + 1)
        .toISOString()
        .split("T")[0];
      const expiryDate = new Date(year1, month1 - 1, day1 + 1)
        .toISOString()
        .split("T")[0];

      dataJson.fullName = fullName;
      dataJson.formattedBirthDate = formattedDate;
      dataJson.formattedExpiryDate = expiryDate;

      // Pemeriksaan docNumber
      if (dataJson.docNumber && dataJson.docNumber !== "" && !dataJson.docNumber.includes('*')) {
        setDataPrimaryPassport(dataJson);
        setRecievedTempData((previous) => [...previous, dataJson]);
      } else {
        // Jika docNumber tidak memenuhi kondisi, set dataPrimaryPassport menjadi null
        setDataPrimaryPassport(null);
      }

      break;
    case "visibleImage":
      setDataPhotoPassport(dataJson);
      setRecievedTempData((previous) => [...previous, dataJson]);
      break;
    default:
      setCardStatus("errorchecksum");
      // setDataPrimaryPassport(null);
      setTimeout(() => {
        setCardStatus("iddle");
      }, 2000);
      break;
  }
};



    // socketRef.current.onmessage = (event) => {
    //   const dataJson = JSON.parse(event.data);
    //   console.log("dataJson: ", dataJson);
    //   setCardStatus("iddle");
    
    //   switch (dataJson.msgType) {
    //     case "passportData":
    //       let fullName = dataJson.foreName + " " + dataJson.surName;
    //       const [day, month, year] = dataJson.birthDate.split("-").map(Number);
    //       const [day1, month1, year1] = dataJson.expiryDate.split("-").map(Number);
    
    //       const adjustedYear = year < 50 ? 2000 + year : 1900 + year;
    
    //       const formattedDate = new Date(adjustedYear, month - 1, day + 1)
    //         .toISOString()
    //         .split("T")[0];
    //       const expiryDate = new Date(year1, month1 - 1, day1 + 1)
    //         .toISOString()
    //         .split("T")[0];
    
    //       dataJson.fullName = fullName;
    //       dataJson.formattedBirthDate = formattedDate;
    //       dataJson.formattedExpiryDate = expiryDate;
    
    //       // Pemeriksaan docNumber
    //       if (dataJson.docNumber && dataJson.docNumber !== "" && !dataJson.docNumber.includes('*')) {
    //         setDataPrimaryPassport(dataJson);
    //         setRecievedTempData((previous) => [...previous, dataJson]);
    //       } else {
    //         // Jika docNumber tidak memenuhi kondisi, set dataPrimaryPassport menjadi null
    //         setDataPrimaryPassport(null);
    //       }
    
    //       break;
    //     case "visibleImage":
    //       setDataPhotoPassport(dataJson);
    //       setRecievedTempData((previous) => [...previous, dataJson]);
    //       break;
    //     default:
    //       setCardStatus("errorchecksum");
    //       setTimeout(() => {
    //         setCardStatus("iddle");
    //       }, 2000);
    //       break;
    //   }
    // };
    

    // socketRef.current.onmessage = (event) => {
    //   const dataJson = JSON.parse(event.data);
    //   console.log("dataJson: ", dataJson);
    //   setCardStatus("iddle");
    //   switch (dataJson.msgType) {
    //     case "passportData":
    //       let fullName = dataJson.foreName + " " + dataJson.surName;
    //       const [day, month, year] = dataJson.birthDate.split("-").map(Number);
    //       const [day1, month1, year1] = dataJson.expiryDate
    //         .split("-")
    //         .map(Number);

    //       const adjustedYear = year < 50 ? 2000 + year : 1900 + year;

    //       const formattedDate = new Date(adjustedYear, month - 1, day + 1)
    //         .toISOString()
    //         .split("T")[0];
    //       const expiryDate = new Date(year1, month1 - 1, day1 + 1)
    //         .toISOString()
    //         .split("T")[0];

    //       dataJson.fullName = fullName;
    //       dataJson.formattedBirthDate = formattedDate;
    //       dataJson.formattedExpiryDate = expiryDate;
    //       setDataPrimaryPassport(dataJson);
    //       setRecievedTempData((previous) => [...previous, dataJson]);
    //       // console.log("setSharedData: ", sharedData);
    //       break;
    //     case "visibleImage":
    //       setDataPhotoPassport(dataJson);
    //       setRecievedTempData((previous) => [...previous, dataJson]);
    //       break;
    //     default:
    //       setCardStatus("errorchecksum")
    //       setTimeout(() => {
    //         setCardStatus("iddle");
    //       }, 2000);
    //       break;
    //   }
    // };

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

  useEffect(() => {
    connectWebSocket();

    return () => {
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    console.log("tahap nol")
    console.log("receiveTempData: ", receiveTempData);
    if (receiveTempData.length === 2) {
      const passportUser = receiveTempData.find(
        (obj) => obj.msgType === "passportData"
      );
      const passportImage = receiveTempData.find( 
        (obj) => obj.msgType === "visibleImage"
      );
        console.log("kuy", passportUser)
      if (passportUser && passportImage ) {
        console.log("tahap satu")
        console.log("receiveTempData: ", receiveTempData);
        if (passportUser.docNumber !== "" && !passportUser.docNumber.includes('*')) {
          console.log("tahap dua")
        doCheckValidationPassport(passportUser, passportImage);
        }
      }
    } else if (receiveTempData.length > 2) {
      setRecievedTempData([]);
      setDataPrimaryPassport(null);
    }
  }, [receiveTempData]);
  

  const doCheckValidationPassport = async (dataPaspor, dataPhotoPaspor) => {
    console.log("docheckvalid", dataPaspor);
    const header = {
      "Content-Type": "application/json",
      token: "f74d6060186dfa9a312dbf6940a8f58471ad8d9c98f226748f4b350004b72838",
      Accept: "application/json",
      key: "d08b1e5dc34355b2cf1e6c23559a68380cca7d24",
    };

    const bodyParam = {
      passportNumber: dataPaspor.docNumber,
      expiredDate: dataPaspor.formattedExpiryDate,
      fullName: dataPaspor.fullName,
      dateOfBirth: dataPaspor.formattedBirthDate,
      nationalityCode: dataPaspor.nationality,
      sex: dataPaspor.sex === "MALE" ? "M" : "F",
      issuingCountry: dataPaspor.issuingState,
      photoPassport: `data:image/jpeg;base64,${dataPhotoPaspor.visibleImage}`,
    };

    try {
      const res = await apiValidationPassport(header, bodyParam);
      const data = res.data;
      console.log("tahap tiga");
      console.log("data: ", data);
      if (data.data.is_valid === true && data.code === 200) {
        console.log("tahap berhasil");
        setCardStatus("success");

        setTimeout(() => {
          setCardStatus("checkData");
          setIsEnableStep(true);
          setIsEnableBack(false);
        }, 5000);
      } else {
        const messageError = data.message;    
        console.log("tahap gagal");
        if (messageError === "Passport is not from voa country.") {
          setCardStatus("errorVoa");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
        } else if (
          messageError === "Passport is not active for at least 6 months."
        ) {
          setCardStatus("errorBulan");
          setRecievedTempData([]);
        } else if (messageError === "Passport is from danger country.") {
          setCardStatus("errorDanger");
          setRecievedTempData([]);
        } else if (messageError === "Passport is already had staypermit active.") {
          setCardStatus("errorIntal");
          setRecievedTempData([]);
        } 
      }
    } catch (err) {
      console.log("tahap error");
      console.log(err);
      throw err;
    }
  };

  const btnOnClick_Back = () => {
    if (isEnableBack) {
      navigate("/");
    }
  };

  const btnOnClick_Step = () => {
    if (isEnableStep) {
      if (cardStatus === "checkData") {
        setCardStatus("lookCamera");
        setTabStatus(2);
      } else if (cardStatus === "takePhotoSucces") {
        setCardStatus("inputEmail");
        setTabStatus(3);
      } else if (titleFooter === "Payment") {
        console.log("sharedData: ", sharedData);
        doSaveRequestVoaUser(sharedData);
      }
    }
  };

  const doSaveRequestVoaUser = async (sharedData) => {
    console.log(sharedData)
    const header = {
      "Content-Type": "application/json",
      token: "f74d6060186dfa9a312dbf6940a8f58471ad8d9c98f226748f4b350004b72838",
      Accept: "application/json",
      key: "d08b1e5dc34355b2cf1e6c23559a68380cca7d24",
    };

    const bodyParam = {
      passportNumber: sharedData.passportData.docNumber,
      expiredDate: sharedData.passportData.formattedExpiryDate,
      fullName: sharedData.passportData.fullName,
      dateOfBirth: sharedData.passportData.formattedBirthDate,
      nationalityCode: sharedData.passportData.nationality,
      sex: sharedData.passportData.sex === "MALE" ? "M" : "F",
      issuingCountry: sharedData.passportData.issuingState,
      photoPassport: `data:image/jpeg;base64,${dataPhotoPaspor.visibleImage}`,
      photoFace: sharedData.photoFace,
      email: sharedData.email,
      // postalCode: "14130",
      paymentMethod: "KIOSK",
    };

    setIsEnableStep(false);
    setCardStatus("waiting");

    try {
      const res = await apiSimpanPermohonan(header, bodyParam);
      const data = res.data;

      if (data.code === 200) {
        setIsEnableStep(true);

        console.log("data: ", data.data);
        setDataPermohonan(data.data);
        setCardStatus("goPayment");
        setTitleHeader("Payment");
        setDisabled(true);
      } else {
        setIsEnableStep(true);
      }
    } catch (err) {
      setIsEnableStep(false);
      console.log(err);
      throw err;
    }
  };

  const updateSharedData = (newSharedData) => {
    setSharedData(newSharedData);
  };

  return (
    <div className="background-apply-voa">
      <Header title={titleHeader} />
      <BodyContent
        tabStatus={tabStatus}
        cardStatus={cardStatus}
        setCardStatus={setCardStatus}
        setTitleHeader={setTitleHeader}
        setTitleFooter={setTitleFooter}
        dataPrimaryPassport={dataPrimaryPassport}
        updateSharedData={updateSharedData}
        cardPaymentProps={cardPaymentProps}
        setCardPaymentProps={setCardPaymentProps}
        shareDataPaymentProps={shareDataPaymentProps}
        setShareDataPaymentProps={setShareDataPaymentProps}
        dataNumberPermohonan={dataPermohonan}
      />
      <Footer
        titleBack="Back"
        titleStep={titleFooter}
        isEnableBack={isEnableBack}
        isEnableStep={isEnableStep}
        btnOnClick_Back={btnOnClick_Back}
        btnOnClick_Step={btnOnClick_Step}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default Apply;
