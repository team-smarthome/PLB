import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import { apiPaymentGateway } from "../../services/api";
import dataPasporImg from "../../utils/dataPhotoPaspor";
import io from "socket.io-client";
import "./ApplyStyle.css";
import Swal from "sweetalert2";
import { Toast } from "../../components/Toast/Toast";
const socket_IO = io("http://localhost:4499");

const Apply = () => {
  const navigate = useNavigate();
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(false);
  const [tabStatus, setTabStatus] = useState(1);
  const [cardStatus, setCardStatus] = useState("iddle");
  const [dataPrimaryPassport, setDataPrimaryPassport] = useState(null);
  // const [dataPhotoPassport] = useState(null);
  const [dataPhotoPassport, setDataPhotoPassport] = useState(null);
  const [cardNumberPetugas, setCardNumberPetugas] = useState("");
  const [sharedData, setSharedData] = useState(null);
  const [statusPaymentCredit, setStatusPaymentCredit] = useState(false);
  const [titleHeader, setTitleHeader] = useState("Apply VOA");
  const [titleFooter, setTitleFooter] = useState("Next Step");
  const [dataPermohonan, setDataPermohonan] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [meesageConfirm, setMessageConfirm] = useState(
    "Network / Card error / declined dll"
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [cardPaymentProps, setCardPaymentProps] = useState({
    isCreditCard: false,
    isPaymentCredit: false,
    isPaymentCash: false,
    isPrinted: false,
    isSuccess: false,
    isWaiting: false,
    isFailed: false,
    isPhoto: false,
    isDoRetake: false,
  });

  const [shareDataPaymentProps, setShareDataPaymentProps] = useState({
    paymentMethod: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    type: "",
  });

  const receiveDataFromChild = (data) => {
    console.log("data", data);

    const newDataPassport = {
      docType: data.documentCode,
      issuingState: data.issuingState,
      surName: data.lastName,
      foreName: data.firstName,
      docNumber: data.documentNumber,
      documentNumberCheckDigit: data.documentNumberCheckDigit,
      nationality: data.nationality,
      birthDate: data.birthDate,
      birthDateCheckDigit: data.birthDateCheckDigit,
      sex: data.sex,
      expiryDate: data.expirationDate,
      expirationDateCheckDigit: data.expirationDateCheckDigit,
      personalNumber: data.personalNumber,
      personalNumberCheckDigit: data.personalNumberCheckDigit,
      compositeCheckDigit: data.compositeCheckDigit,
    };

    console.log("newDataPassport", newDataPassport);

    // Handle received data
    const dataHardCodePaspor = newDataPassport;
    // const dataHarCodePasporImg = dataPasporImg;

    let fullName =
      dataHardCodePaspor.foreName + " " + dataHardCodePaspor.surName;

    dataHardCodePaspor.fullName = fullName;
    const day = parseInt(dataHardCodePaspor.expiryDate.substring(0, 2));
    const month = parseInt(dataHardCodePaspor.expiryDate.substring(2, 4)) - 1;
    const year = 2000 + parseInt(dataHardCodePaspor.expiryDate.substring(4, 6));

    const expiryDates = new Date(year, month, day).toISOString().split("T")[0];
    const birthDates = new Date(year, month, day).toISOString().split("T")[0];

    dataHardCodePaspor.formattedExpiryDate = expiryDates;
    dataHardCodePaspor.formattedBirthDate = birthDates;

    console.log("dataHardCodePaspor", newDataPassport);

    setDataPrimaryPassport(dataHardCodePaspor);
    setCardStatus("checkData");
    setIsEnableStep(true);
    setIsEnableBack(true);
  };

  const [receiveTempData, setRecievedTempData] = useState([]);
  const checkAndHandleTokenExpiration = () => {
    const jwtToken = localStorage.getItem("JwtToken");
    if (!jwtToken) {
      return false;
    }

    const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    const now = Date.now();
    const isExpired = now > expirationTime;

    return !isExpired;
  };

  // Contoh penggunaan di tempat lain
  const handleTokenExpiration = () => {
    const isTokenValid = checkAndHandleTokenExpiration();

    if (!isTokenValid) {
      // Token has expired, handle the expiration here
      Swal.fire({
        icon: "error",
        text: "Expired JWT Token",
        confirmButtonColor: "#3d5889",
      }).then((result) => {
        // If the user clicks "OK", clear localStorage
        if (result.isConfirmed) {
          navigate("/");
          localStorage.removeItem("user");
          localStorage.removeItem("JwtToken");
          localStorage.removeItem("cardNumberPetugas");
          localStorage.removeItem("key");
          localStorage.removeItem("token");
          localStorage.removeItem("jenisDeviceId");
          localStorage.removeItem("deviceId");
          localStorage.removeItem("airportId");
          localStorage.removeItem("price");
        }
      });
    }
  };

  useEffect(() => {
    const cardNumberPetugas = "1101320000001255";
    if (cardNumberPetugas) {
      setCardNumberPetugas(cardNumberPetugas);
    }
  }, []);

  useEffect(() => {
    if (cardPaymentProps.isPaymentCash || cardPaymentProps.isPaymentCredit) {
      setIsEnableBack(true);
    } else if (cardPaymentProps.isWaiting) {
      setDisabled(true);
    } else if (cardPaymentProps.isDoRetake) {
      setIsEnableStep(true);
    } else if (cardPaymentProps.isPhoto) {
      setIsEnableStep(false);
    }
  }, [cardPaymentProps]);

  const btnOnClick_Back = () => {
    if (!isOnline) {
      Toast.fire({
        icon: "error",
        title: "No Internet Connection",
      });
      return;
    }

    if (isEnableBack) {
      if (cardPaymentProps.isPaymentCredit || cardPaymentProps.isPaymentCash) {
        handleTokenExpiration();
        setCardPaymentProps({
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isWaiting: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isDoRetake: false,
        });
        setShareDataPaymentProps({
          paymentMethod: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
          type: "",
        });
        const params = {
          code: "default",
          data: "",
        };
        socket_IO.emit("WebClientMessage", JSON.stringify(params));
      } else if (cardStatus === "iddle") {
        navigate("/home");
      } else if (cardStatus === "lookCamera") {
        setTabStatus(1);
        setCardStatus("checkData");
      } else if (cardStatus === "postalCode") {
        const params = {
          code: "email",
          data: "",
        };
        socket_IO.emit("WebClientMessage", JSON.stringify(params));
        setCardStatus("inputEmail");
        setTabStatus(3);
        setCardStatus("inputEmail");
      } else if (cardStatus === "takePhotoSucces") {
        setTabStatus(1);
        setCardStatus("checkData");
      } else if (cardStatus === "waiting") {
        setTabStatus(1);
        setCardStatus("checkData");
      }
    }
  };

  const btnOnClick_Step = () => {
    if (!isOnline) {
      Toast.fire({
        icon: "error",
        title: "No Internet Connection",
      });
      return;
    }
    if (isEnableStep) {
      if (cardStatus === "checkData") {
        const params = {
          code: "email",
          data: "",
        };
        socket_IO.emit("WebClientMessage", JSON.stringify(params));
        setCardStatus("inputEmail");
        setCardStatus("lookCamera");
        setTabStatus(2);
      } else if (cardStatus === "takePhotoSucces") {
        const params = {
          code: "email",
          data: "",
        };
        socket_IO.emit("WebClientMessage", JSON.stringify(params));
        setCardStatus("inputEmail");
        setTabStatus(3);
      } else if (cardStatus === "emailSucces") {
        setCardStatus("postalCode");
        setTabStatus(4);
      } else if (titleFooter === "Payment" && !cardPaymentProps.isDoRetake) {
        setCardStatus("goPayment");
        setTitleHeader("Payment");
      } else if (titleFooter === "Next Print") {
        setCardPaymentProps({
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isWaiting: false,
          isPrinted: true,
          isSuccess: false,
          isFailed: false,
          isPhoto: false,
          isDoRetake: false,
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
            isPhoto: false,
            isDoRetake: false,
          });
          setStatusPaymentCredit(false);
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
        }, 3000);
      } else if (titleFooter === "Payment" && cardPaymentProps.isDoRetake) {
        // console.log("ini dijalankan");
        doSaveRequestVoaPayment(sharedData);
      } else if (cardStatus === "iddle") {
        const params = {
          code: "email",
          data: "",
        };
        socket_IO.emit("WebClientMessage", JSON.stringify(params));
        setCardStatus("inputEmail");
      }
    }
  };
  useEffect(() => {
    if (cardStatus === "goPayment") {
      setIsEnableStep(false);
    } else if (
      cardStatus === "iddle" ||
      cardStatus === "lookCamera" ||
      cardStatus === "postalCode" ||
      cardStatus === "takePhotoSucces" ||
      cardStatus === "waiting"
    ) {
      socket_IO.on("deviceId", (deviceId) => {
        console.log(deviceId);
        localStorage.setItem("deviceId", deviceId);

      });
      socket_IO.on("jenisDeviceId", (jenisDeviceId) => {
        console.log(jenisDeviceId);
        localStorage.setItem("jenisDeviceId", jenisDeviceId);

      });
      socket_IO.on("airportId", (airportId) => {
        console.log(airportId);
        localStorage.setItem("airportId", airportId);

      });
    }
  }, [cardStatus]);

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
      // setCardPaymentProps({
      //   isCreditCard: false,
      //   isPaymentCredit: false,
      //   isPaymentCash: false,
      //   isPrinted: true,
      //   isSuccess: false,
      //   isWaiting: false,
      //   isFailed: false,
      //   isPhoto: false,
      //   isDoRetake: false,
      // });
    }
  }, [statusPaymentCredit]);

  useEffect(() => {
    if (cardPaymentProps.isPrinted) {
      setDisabled(true);
    }
  }, [cardPaymentProps]);

  const doSaveRequestVoaPayment = async (sharedData) => {
    // console.log("doSaveRequestVoaPayment");
    const token = localStorage.getItem("token");
    const key = localStorage.getItem("key");
    // const devicedId = localStorage.getItem("deviceId");
    // const airportId = localStorage.getItem("airportId");
    // const jenisDeviceId = localStorage.getItem("jenisDeviceId");
    const devicedId = "01320000001255";
    const airportId = "CGK";
    const jenisDeviceId = "01";

    const bearerToken = localStorage.getItem("JwtToken");
    const header = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };
    const bodyParam = {
      passportNumber: sharedData.passportData.docNumber,
      expiredDate: sharedData.passportData.formattedExpiryDate,
      fullName: sharedData.passportData.fullName,
      dateOfBirth: sharedData.passportData.formattedBirthDate,
      nationalityCode: sharedData.passportData.nationality,
      sex: sharedData.passportData.sex === "Male" ? "M" : "F",
      issuingCountry: sharedData.passportData.issuingState,
      photoPassport: `data:image/jpeg;base64,${dataPasporImg.visibleImage}`,
      photoFace: sharedData.photoFace ? sharedData.photoFace : "",
      email: sharedData.email,
      postalCode: sharedData.postal_code,
      paymentMethod: shareDataPaymentProps.paymentMethod,
      cc_no: shareDataPaymentProps.cardNumber.replace(/\s/g, ""),
      cc_exp: shareDataPaymentProps.expiry.replace("/", ""),
      // cvv: shareDataPaymentProps.cvv,
      type:
        shareDataPaymentProps.type === "" ? null : shareDataPaymentProps.type,
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
        isPhoto: false,
        isDoRetake: false,
      });
      const res = await apiPaymentGateway(header, bodyParam);
      const data = res.data;
      // console.log("data", data);
      setDataPermohonan(data.data);
      if (data.code === 200 && data.message === "E-Voa created successfuly!") {
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: true,
          isSuccess: false,
          isFailed: false,
          isPhoto: false,
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
            isPhoto: false,
          });
          setTimeout(() => {
            setStatusPaymentCredit(false);
            setRecievedTempData([]);
            setDataPrimaryPassport(null);
          }, 3000);
        }, 3000);
      } else if (
        data.status === "Failed" ||
        data.code === 500 ||
        data.status === "failed" ||
        data.status === 500 ||
        data.code === 400 ||
        data.code === 401 ||
        data.status === "error" ||
        data.status === "Error" ||
        data.status === 400
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
          isPhoto: false,
          isDoRetake: false,
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
              isPhoto: false,
              isDoRetake: false,
            });
            setTimeout(() => {
              setStatusPaymentCredit(false);
              setCardStatus("iddle");
              setRecievedTempData([]);
              setDataPrimaryPassport(null);
              setIsEnableBack(true);
            }, 5000);
          } else if (messageError === "Passport is not active for at least") {
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
              isPhoto: false,
              isDoRetake: false,
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
              isPhoto: false,
              isDoRetake: false,
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
              isPhoto: false,
              isDoRetake: false,
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
              setCardPaymentProps({
                isWaiting: false,
                isCreditCard: false,
                isPaymentCredit: false,
                isPaymentCash: false,
                isPrinted: false,
                isSuccess: false,
                isFailed: false,
                isPhoto: false,
                isDoRetake: false,
              });
            }, 2000);
          } else if (
            messageError === "Invalid JWT Token" ||
            messageError === "Expired JWT Token"
          ) {
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
                isPhoto: false,
                isDoRetake: false,
              });
              navigate("/");
              localStorage.removeItem("user");
              localStorage.removeItem("JwtToken");
              localStorage.removeItem("cardNumberPetugas");
              localStorage.removeItem("key");
              localStorage.removeItem("token");
              localStorage.removeItem("jenisDeviceId");
              localStorage.removeItem("deviceId");
              localStorage.removeItem("airportId");
              localStorage.removeItem("price");
            }, 5000);
          } else if (
            messageError === "Required field 'photoFace' is missing" ||
            messageError ===
              "Face on the passport doesn't match with captured image."
          ) {
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: false,
              isSuccess: false,
              isFailed: false,
              isPhoto: true,
              isDoRetake: false,
            });
            setIsEnableBack(false);
            setIsEnableStep(false);
            setDisabled(false);

            //ubah nilai photoFace jadi null
            sharedData.photoFace = "";
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
                isPhoto: false,
                isDoRetake: false,
              });
            }, 5000);
          }
        }, 5000);
      }
    } catch (err) {
      setCardPaymentProps({
        isWaiting: false,
        isCreditCard: false,
        isPaymentCredit: false,
        isPaymentCash: false,
        isPrinted: false,
        isSuccess: false,
        isFailed: true,
        isPhoto: false,
        isDoRetake: false,
      });
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
          isPhoto: false,
          isDoRetake: false,
        });
      }, 5000);
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
          isPhoto: false,
          isDoRetake: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else if (meesageConfirm === "Failed when request payment pg") {
        setDisabled(false);
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPhoto: false,
          isDoRetake: false,
        });
      } else if (
        meesageConfirm === "Passport is not active for at least 6 months."
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
          isPhoto: false,
          isDoRetake: false,
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
          isPhoto: false,
          isDoRetake: false,
        });
        setTimeout(() => {
          setStatusPaymentCredit(false);
          setCardStatus("iddle");
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setIsEnableBack(true);
          setConfirm(false);
        }, 5000);
      } else if (
        meesageConfirm === "Required field 'photoFace' is missing" ||
        meesageConfirm ===
          "Face on the passport doesn't match with captured image."
      ) {
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPhoto: true,
          isDoRetake: false,
        });
        setIsEnableBack(false);
        setIsEnableStep(false);
        setDisabled(false);
      } else if (
        meesageConfirm === "Invalid JWT Token" ||
        meesageConfirm === "Expired JWT Token"
      ) {
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
            isPhoto: false,
            isDoRetake: false,
          });
          navigate("/");
          localStorage.removeItem("user");
          localStorage.removeItem("JwtToken");
          localStorage.removeItem("cardNumberPetugas");
          localStorage.removeItem("key");
          localStorage.removeItem("token");
          localStorage.removeItem("jenisDeviceId");
          localStorage.removeItem("deviceId");
          localStorage.removeItem("airportId");
          localStorage.removeItem("price");
        }, 5000);
      } else {
        // console.log("jalan gk ya??");
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
          isPhoto: false,
          isDoRetake: false,
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
        FailedMessage={meesageConfirm}
        sendDataToParent1={receiveDataFromChild}
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
