import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import dataPhotoPaspor from "../../utils/dataPhotoPaspor";
import { apiPaymentGateway } from "../../services/api";
import io from "socket.io-client";
import "./ApplyStyle.css";

const Apply = () => {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [passportUser, setPassportUser] = useState([]);
  const [passportImage, setPassportImage] = useState({});
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(false);
  const [tabStatus, setTabStatus] = useState(1);
  const [cardStatus, setCardStatus] = useState("iddle");
  const [dataPrimaryPassport, setDataPrimaryPassport] = useState(null);
  const [dataPhotoPassport, setDataPhotoPassport] = useState(null);
  const [cardNumberPetugas, setCardNumberPetugas] = useState("");
  const [sharedData, setSharedData] = useState(null);
  const [statusPaymentCredit, setStatusPaymentCredit] = useState(false);
  const [titleHeader, setTitleHeader] = useState("Apply VOA");
  const [titleFooter, setTitleFooter] = useState("Next Step");
  const [dataPermohonan, setDataPermohonan] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [meesageConfirm, setMessageConfirm] = useState("");

  const [cardPaymentProps, setCardPaymentProps] = useState({
    isCreditCard: false,
    isPaymentCredit: false,
    isPaymentCash: false,
    isPrinted: false,
    isSuccess: false,
    isWaiting: false,
    isFailed: false,
    isPyamentUrl: false,
  });

  const [shareDataPaymentProps, setShareDataPaymentProps] = useState({
    paymentMethod: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    type: "",
  });

  const [receiveTempData, setRecievedTempData] = useState([]);
  let isCloseTimeoutSet = false;
  const connectWebSocket = (ipAddress, socket_IO) => { //image2
    if (ipAddress) {
      const socketURL = `ws://${ipAddress}:4488`;
      socketRef.current = new WebSocket(socketURL);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        isCloseTimeoutSet = false;
        setCardStatus("errorConnection");
        setTimeout(() => {
          isCloseTimeoutSet = false;
          setCardStatus("iddle");
        }, 3000);

        setIsConnected(true);
      };

      socketRef.current.onmessage = (event) => {
        const dataJson = JSON.parse(event.data);
        console.log("Received data from server websocket:", dataJson);

        switch (dataJson.msgType) {
          case "passportData":
            let fullName = dataJson.foreName + " " + dataJson.surName;
            const [day, month, year] = dataJson.birthDate
              .split("-")
              .map(Number);
            const [day1, month1, year1] = dataJson.expiryDate
              .split("-")
              .map(Number);

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
            if (
              dataJson.docNumber &&
              dataJson.docNumber !== "" &&
              !dataJson.docNumber.includes("*")
            ) {
              setRecievedTempData((previous) => [...previous, dataJson]);
            } else {
              setDataPrimaryPassport(null);
            }

            break;
          case "visibleImage":
            setRecievedTempData((previous) => [...previous, dataJson]);
            break;
          case "DeviceController":
          let airportId = dataJson.airportId;
          let deviceId = dataJson.deviceId;
          let jenisDeviceId = dataJson.jenisDeviceId;

          localStorage.setItem("airportId", airportId);
          localStorage.setItem("deviceId", deviceId);
          localStorage.setItem("jenisDeviceId", jenisDeviceId);
          break;
          default:
            break;
        }
      };

      socketRef.current.onclose = () => {
        console.log("status: ", isCloseTimeoutSet);
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setCardStatus("errorConnection");
        setTimeout(() => {
          console.log("tahap timeout status", isCloseTimeoutSet);
          isCloseTimeoutSet = true;
        }, 3000);
        if (!isCloseTimeoutSet) {
          console.log("tahap close");
          setCardStatus("errorWebsocket");
        }
        socket_IO.emit("clientData", "re-newIpAddress") //image 1
      };
    }
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    const cardNumberPetugas = localStorage.getItem("cardNumberPetugas");

    if (cardNumberPetugas) {
      setCardNumberPetugas(cardNumberPetugas);
    }
  });

  useEffect(() => {
    // Start Connect to Server Socket.IO
    const socket_IO = io("http://localhost:4499");

    socket_IO.on("connect", () => {
      console.log("Connected to server socket.io");
    });

    socket_IO.on("disconnect", () => {
      console.log("Disconnected from server socket.io");
    });

    socket_IO.on("getIpAddress", (data) => {
      console.log("Received data from server socket.io:", data);
      connectWebSocket(data.ipAddressV4, socket_IO); //gambar 3
    });

    return () => {
      socket_IO.disconnect();
    };
  }, []);

  useEffect(() => {
    //Start Connect to Server Websocket
    connectWebSocket();

    return () => {
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    console.log("tahap nol");
    setDataPrimaryPassport(null);
    console.log("receiveTempData: ", receiveTempData);

    const prevPassportUserLength = passportUser.length;
    const prevPassportImageLength = passportImage.length;

    if (receiveTempData.length > 0) {
      const passportUser = receiveTempData.filter(
        (obj) => obj.msgType === "passportData"
      );
      const passportImage = receiveTempData.filter(
        (obj) => obj.msgType === "visibleImage"
      );
      console.log("passportUser", passportUser);
      console.log("passportImage", passportImage);
      if (passportUser.length > 0 && passportImage.length > 0) {
        console.log("tahap satu");
        const tempPassportUser = passportUser[0];
        const tempPassportImage = passportImage[0];
        if (
          tempPassportUser.docNumber !== "" &&
          !tempPassportUser.docNumber.includes("*") &&
          tempPassportUser.birthDate !== "" &&
          tempPassportUser.birthDate !== "0000-00-00" &&
          !tempPassportUser.birthDate.includes("*") &&
          tempPassportUser.dateOfBirthMrz !== "" &&
          !tempPassportUser.dateOfBirthMrz.includes("*") &&
          tempPassportUser.data !== "" &&
          !tempPassportUser.data.includes("*") &&
          tempPassportUser.docId !== "" &&
          !tempPassportUser.docId.includes("*") &&
          tempPassportUser.docType !== "" &&
          !tempPassportUser.docType.includes("*") &&
          tempPassportUser.sex !== "" &&
          !tempPassportUser.sex.includes("*") &&
          tempPassportImage.visibleImage !== ""
        ) {
          console.log("tahap dua");
          setTimeout(() => {
            setDataPrimaryPassport(tempPassportUser);
          }, 1000);
          setDataPhotoPassport(tempPassportImage);
          doCheckValidationPassport(tempPassportUser, tempPassportImage);
        } else {
          setCardStatus("errorchecksum");
          setTimeout(() => {
            setCardStatus("iddle");
          }, 2000);
        }
      } else if (
        (passportUser.length === 0 && passportImage.length > 0) ||
        (passportUser.length > 0 && passportImage.length === 0)
      ) {
        console.log("tahap testing");

        setCardStatus("waiting");

        const timeoutId = setTimeout(() => {
          const isConditionMet =
            (passportUser.length === 1 && passportImage.length === 0) ||
            (passportUser.length === 0 && passportImage.length === 1);

          if (isConditionMet) {
            setCardStatus("errorchecksum");
            setTimeout(() => {
              setCardStatus("iddle");
            }, 3000);
            setRecievedTempData([]);
          } else {
            console.log("Kondisi tidak terpenuhi setelah 10 detik");
            setRecievedTempData([]);
          }
        }, 10000);

        const cleanup = () => clearTimeout(timeoutId);

        return cleanup;
      } else {
        console.log("ttesting waiting");
        setCardStatus("errorchecksum");
        setDataPrimaryPassport(null);
      }
    } else {
      console.log("testing else akhir");
    }
  }, [receiveTempData, passportUser, passportImage]);

  const doCheckValidationPassport = async (dataPaspor) => {
    console.log("docheckvalid", dataPaspor);
    setCardStatus("success");
    setTimeout(() => {
      setCardStatus("checkData");
    }, 2000);

    setIsEnableStep(true);
    setIsEnableBack(false);
  };

  const btnOnClick_Back = () => {
    if (isEnableBack) {
      navigate("/home");
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
        setCardStatus("goPayment");
        setTitleHeader("Payment");
        setDisabled(true);
      } else if (titleFooter === "Next Print") {
        setCardPaymentProps({
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isWaiting: false,
          isPrinted: true,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          setCardPaymentProps({
            isWaiting: false,
            isCreditCard: false,
            isPaymentCredit: false,
            isPaymentCash: false,
            isPrinted: false,
            isSuccess: true,
            isFailed: false,
          });
          setStatusPaymentCredit(false);
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
        }, 3000);
      }
    }
  };

  const updateStatusPaymentCredit = (newstatusPaymentCredit) => {
    setStatusPaymentCredit(newstatusPaymentCredit);
  };

  const updateStatusConfirm = (newStatusConfirm) => {
    setConfirm(newStatusConfirm);
  };

  useEffect(() => {
    if (receiveTempData.length > 2) {
      setRecievedTempData([]);
    }
  }, [receiveTempData]);

  useEffect(() => {
    if (statusPaymentCredit) {
      doSaveRequestVoaPayment(sharedData);
    }
  }, [statusPaymentCredit]);

  useEffect(() => {
    if (cardPaymentProps.isPrinted) {
      setDisabled(true);
    }
  }, [cardPaymentProps]);

  const doSaveRequestVoaPayment = async (sharedData) => {
    console.log("doSaveRequestVoaPayment");
    const token = localStorage.getItem("token");
    const key = localStorage.getItem("key");
    const devicedId = localStorage.getItem("deviceId");
    const airportId = localStorage.getItem("airportId");
    const jenisDeviceId = localStorage.getItem("jenisDeviceId");

    const bearerToken = localStorage.getItem("JwtToken");
    const header = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };
    //chek apakah payment Method ada atau tidak
    console.log("sharedDataPaymentProps", shareDataPaymentProps);

   

    const bodyParam = {
      passportNumber: sharedData.passportData.docNumber,
      expiredDate: sharedData.passportData.formattedExpiryDate,
      fullName: sharedData.passportData.fullName,
      dateOfBirth: sharedData.passportData.formattedBirthDate,
      nationalityCode: sharedData.passportData.nationality,
      sex: sharedData.passportData.sex === "Male" ? "M" : "F",
      issuingCountry: sharedData.passportData.issuingState,
      photoPassport: `data:image/jpeg;base64,${dataPhotoPaspor.visibleImage}`,
      photoFace: sharedData.photoFace,
      email: sharedData.email,
      paymentMethod: shareDataPaymentProps.paymentMethod,
      cc_no: shareDataPaymentProps.cardNumber.replace(/\s/g, ""),
      cc_exp: shareDataPaymentProps.expiry.replace("/", ""),
      cvv: shareDataPaymentProps.cvv,
      type: shareDataPaymentProps.type,
      token: token,
      key: key,
      deviceId: devicedId,
      airportId: airportId,
      jenisDeviceId: jenisDeviceId,
    };
    setIsEnableStep(false);

    try {
      setCardPaymentProps({
        isCreditCard: false,
        isPaymentCredit: false,
        isPaymentCash: false,
        isWaiting: true,
        isPrinted: false,
        isSuccess: false,
        isFailed: false,
        isPyamentUrl: false,
      });
      const res = await apiPaymentGateway(header, bodyParam);
      const data = res.data;
      console.log("data", data);
      setDataPermohonan(data.data);
      if (data.code === 200 && data.data.length > 0 && data.data[0].form_url) {
        setTitleFooter("Next Print");
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: true,
        });
        setDisabled(false);
        setIsEnableStep(true);
        setIsEnableBack(false);
      } else if (data.code === 200 && data.data.form_url === null) {
        setStatusPaymentCredit(false);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: true,
          isPyamentUrl: false,
        });
      }
      
      else if (
        data.code === 200 &&
        data.message === "E-Voa created successfuly!"
      ) {
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: true,
          isSuccess: false,
          isFailed: false,
        });
        setDisabled(true);
        setTimeout(() => {
          setCardPaymentProps({
            isWaiting: false,
            isCreditCard: false,
            isPaymentCredit: false,
            isPaymentCash: false,
            isPrinted: false,
            isSuccess: true,
            isFailed: false,
          });
          setStatusPaymentCredit(false);
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
        }, 3000);
      } else if (
        data.status === "Failed" ||
        data.code === 500 ||
        data.status === "failed" ||
        data.status === 500 || data.code === 400 || data.code === 401 || data.status === "error" ||
        data.status === "Error" || data.status === 400
      ) {
        setStatusPaymentCredit(false);
        const messageError = data.message;
        setMessageConfirm(messageError);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: true,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          if (messageError === "Passport is not from voa country.") {
            setDisabled(false);
            setCardStatus("errorVoa");
            setTitleFooter("Next Step");
            setTabStatus(1);
            setTitleHeader("Apply VOA");
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
            }, 5000);
          } else if (
            messageError === "Passport is not active for at least 6 months."
          ) {
            setDisabled(false);
            setTitleHeader("Apply VOA");
            setCardStatus("errorBulan");
            setTitleFooter("Next Step");
            setTabStatus(1);
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
            }, 5000);
          } else if (messageError === "Passport is from danger country.") {
            setDisabled(false);
            setTitleHeader("Apply VOA");
            setCardStatus("errorDanger");
            setTitleFooter("Next Step");
            setTabStatus(1);
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
            }, 5000);
          } else if (
            messageError === "Passport is already had staypermit active."
          ) {
            setDisabled(false);
            setCardStatus("errorIntal");
            setTitleFooter("Next Step");
            setTabStatus(1);
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
              setTitleHeader("Apply VOA");
            }, 5000);
          } else if (messageError === "Failed when request payment pg") {
            setTimeout(() => {
              setDisabled(false);
              setTitleFooter("Next Step");
              setTabStatus(1);
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
              setCardPaymentProps({
                isWaiting: false,
                isCreditCard: false,
                isPaymentCredit: false,
                isPaymentCash: false,
                isPrinted: false,
                isSuccess: false,
                isFailed: false,
                isPyamentUrl: false,
              });
            }, 5000);
          } else if (messageError === "Invalid JWT Token") {
            setTimeout(() => {
              setDisabled(false);
              setTitleFooter("Next Step");
              setTabStatus(1);
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
              setCardPaymentProps({
                isWaiting: false,
                isCreditCard: false,
                isPaymentCredit: false,
                isPaymentCash: false,
                isPrinted: false,
                isSuccess: false,
                isFailed: false,
                isPyamentUrl: false,
              });
              navigate("/");
              localStorage.removeItem('user');
              localStorage.removeItem('JwtToken');
              localStorage.removeItem('cardNumberPetugas');
              localStorage.removeItem('key');
              localStorage.removeItem('token');
            }, 5000);
          } else if (messageError === "Required field 'photoFace' is missing") {
            setDisabled(false);
            setCardStatus("photoNotMatch");
            setTitleFooter("Next Step");
            setTabStatus(1);
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
              setTitleHeader("Apply VOA");
            }, 5000);
          } else {
            setTimeout(() => {
              setDisabled(false);
              setTitleFooter("Next Step");
              setTabStatus(1);
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
              setCardPaymentProps({
                isWaiting: false,
                isCreditCard: false,
                isPaymentCredit: false,
                isPaymentCash: false,
                isPrinted: false,
                isSuccess: false,
                isFailed: false,
                isPyamentUrl: false,
              });
            }, 5000);
          }
        }, 5000);
      }
    } catch (err) {
      console.log("tahap error");
      console.log(err);
      throw err;
    }
  };
  
  useEffect(() => {
    if (confirm) {
      if (meesageConfirm === "Passport is not from voa country.") {
        setDisabled(false);
        setCardStatus("errorVoa");
        setTitleFooter("Next Step");
        setTabStatus(1);
        setTitleHeader("Apply VOA");
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else if (meesageConfirm === "Passport is not active for at least 6 months.") {
        setDisabled(false);
        setTitleHeader("Apply VOA");
        setCardStatus("errorBulan");
        setTitleFooter("Next Step");
        setTabStatus(1);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else if (meesageConfirm === "Passport is from danger country.") {
        setDisabled(false);
        setTitleHeader("Apply VOA");
        setCardStatus("errorDanger");
        setTitleFooter("Next Step");
        setTabStatus(1);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else if (meesageConfirm === "Required field 'photoFace' is missing") {
        setDisabled(false);
        setTitleHeader("Apply VOA");
        setCardStatus("photoNotMatch");
        setTitleFooter("Next Step");
        setTabStatus(1);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else {
        console.log("jalan gk ya??")
        setDisabled(false); 
        setTabStatus(1);
        setTitleFooter("Next Step");
        setTitleHeader("Apply VOA");
        setStatusPaymentCredit(false);
        setCardStatus("iddle");
        setRecievedTempData([]);
        setDataPrimaryPassport(null);
        setIsEnableBack(true);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
        });
        setConfirm(false);
      }
    }
  }, [confirm]);

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
        cardNumberPetugas={cardNumberPetugas}
        dataPrimaryPassport={dataPrimaryPassport}
        statusPaymentCredit={statusPaymentCredit}
        confirm={confirm}
        onStatusChange={updateStatusPaymentCredit}
        onStatusConfirm={updateStatusConfirm}
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
