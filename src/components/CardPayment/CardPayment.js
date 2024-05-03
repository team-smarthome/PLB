import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrintIcon from "../../assets/images/image-9.svg";
import InsertCard from "../../assets/images/image-8.svg";
import Success from "../../assets/images/image-2.svg";
import Failed from "../../assets/images/image-3.svg";
import "./CardPaymentStyle.css";
import Printer from "../Printer/Printer";
import { useReactToPrint } from "react-to-print";
import Credit from "../../assets/images/credit.png";
import Cash from "../../assets/images/cash.png";
import io from "socket.io-client";
import Swal from "sweetalert2";
import axios from "axios";
import { Toast } from "../Toast/Toast";
import Webcam from "react-webcam";
import Select from "react-select";
import { url_dev } from "../../services/env";

const socket = io("http://localhost:4499");

const CardPayment = ({
  onStatusChange,
  onStatusConfirm,
  isCreditCard,
  isPaymentCredit,
  isPaymentCash,
  isFailed,
  isPrinted,
  isWaiting,
  isSuccess,
  isPhoto,
  isDoRetake,
  sendDataUpdatePayment,
  dataUser,
  confirm,
  dataNumberPermohonan,
  FailedPesan,
  statusPaymentCredit,
  sendDataPhotoPayment,
}) => {
  const navigate = useNavigate();
  const printRef = useRef();
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState(null);
  const [loading, isLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberWarning, setCardNumberWarning] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [expiryWarning, setExpiryWarning] = useState(false);
  const [cvv, setCvv] = useState("");
  const [type, setType] = useState("");
  const [isCheckedType, setIsCheckedType] = useState(false);
  const [cvvWarning, setCvvWarning] = useState(false);
  const [seconds, setSeconds] = useState(8);
  const [dataPasporUser, setDataPasporUser] = useState(null);
  const [dataPermohonanUser, setDataPermohonanUser] = useState(null);
  const [failedMessage, setFailedMessage] = useState(
    "Network / Card error / declined dll"
  );
  const [number, setNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportName, setPassportName] = useState("");
  const [passportUrl, setPassportUrl] = useState("");
  const [receipt, setReceipt] = useState("");
  const [optionCreditTypes, setOptionCreditTypes] = useState([]);
  const [printLokasi, setPrintLokasi] = useState("");

  //price
  const { fee, fee_cash, value } = JSON.parse(
    localStorage.getItem("price")
  ) ?? { fee: "0", fee_cash: "0", value: "0.0000" };

  const formattedNumber = (num) =>
    parseInt(num).toLocaleString("id-ID", { minimumFractionDigits: 0 });


  useEffect(() => {
    const city = JSON.parse(localStorage.getItem("user"));
    const officeCity = city?.organization?.officeCity;

    if (officeCity === "DENPASAR") {
      setPrintLokasi("DPS");
    } else if (officeCity === "JAKARTA") {
      setPrintLokasi("CGK");
    }
  }, []);

  const numericValue = parseFloat(value);
  const numericFee = parseFloat(fee);
  const numericFeeCash = parseFloat(fee_cash);
  const formattedFee = formattedNumber(fee);
  const formattedFeeCash = formattedNumber(numericFeeCash);
  const formattedValue = formattedNumber(numericValue);
  const formattedTotal = formattedNumber(numericValue + numericFee);
  const formattedTotalCash = formattedNumber(numericValue + numericFeeCash);

  //cardNumberPetugass
  const petugasNumber = localStorage.getItem("deviceId")?.replace(/"/g, "");
  const cardNumberPetugass = "11" + petugasNumber;

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages(imageSrc);
    sendDataPhotoPayment({
      isDoRetake: true,
      isPhoto: false,
      capturedImages: imageSrc,
    });
  };

  const doRetake = () => {
    sendDataPhotoPayment({
      isDoRetake: false,
      isPhoto: true,
      capturedImages: null,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
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
    axios
      .get(`${url_dev}TypeCard.php`)
      .then((res) => {
        const responseData = res.data;

        if (
          responseData &&
          responseData.status === 200 &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          const creditTypes = responseData.data.map((item) => {
            return {
              value: item.value,
              label: item.label,
            };
          });

          setOptionCreditTypes(creditTypes);
        } else {
          // console.error("Invalid or unexpected API response format");
        }
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const socketIoClient = io("http://localhost:4499");

    socketIoClient.on("connect", () => {
      console.log("Connected to server socket.io");
    });

    socketIoClient.on("getCredentials", (data) => {
      if (data) {
        const inputCC = data.ccnum.replace(/\D/g, "");
        if (inputCC.length <= 16) {
          setCardNumber(
            inputCC
              .match(/.{1,4}/g)
              ?.join(" ")
              .substring(0, 19)
          );

          const params = {
            code: "input-card-number",
            data: inputCC
              .match(/.{1,4}/g)
              ?.join(" ")
              .substring(0, 19),
          };
          socket.emit("WebClientMessage", JSON.stringify(params));
        }
        const inputExp = data.expdate;
        const year = inputExp.substring(0, 2);
        const month = inputExp.substring(2, 4);
        const formatedDate = month + year;
        setExpiry((prevExpiry) => {
          const formattedInput = formatedDate
            .replace(/(\d{2})(\d{0,2})/, "$1/$2")
            .replace(/(\/\d{2})\d+?$/, "$1");

          if (/^\d{0,2}\/?\d{0,2}$/.test(formattedInput)) {
            const params = {
              code: "input-expired",
              data: formattedInput,
            };
            socket.emit("WebClientMessage", JSON.stringify(params));

            return formattedInput;
          } else {
            const params = {
              code: "input-expired",
              data: prevExpiry,
            };
            socket.emit("WebClientMessage", JSON.stringify(params));

            return prevExpiry;
          }
        });

        const inputType = data.cardtype;
        const capitalizedType = inputType.toLowerCase().toUpperCase();
        const cleanedType = capitalizedType.replace("CREDIT", "").trim();
        const finalType =
          cleanedType === "Visa"
            ? "VISA"
            : cleanedType === "Mastercard"
              ? "MASTERCARD"
              : cleanedType;
        setType(finalType);

        if (data.cardtype === "" || data.cardtype !== "") {
          setIsCheckedType(true);
        }
      }
    });

    const handleInputCardNumber = (data) => {
      try {
        const dataParse = JSON.parse(data);
        console.log("Received input-card-number data: ", dataParse);
        const text = dataParse?.data;
        setCardNumber(text);
      } catch (error) {
        console.error("Error parsing input-card-number data:", error);
      }
    };

    const handleInputExpiredDate = (data) => {
      try {
        const dataParse = JSON.parse(data);
        console.log("Received input-expired data: ", dataParse);
        const text = dataParse?.data;
        setExpiry(text);
      } catch (error) {
        console.error("Error parsing input-expired data:", error);
      }
    };

    const handleInputCVV = (data) => {
      try {
        const dataParse = JSON.parse(data);
        console.log("Received input-cvv data: ", dataParse);
        const text = dataParse?.data;
        setCvv(text);
      } catch (error) {
        console.error("Error parsing input-cvv data:", error);
      }
    };

    socketIoClient.on("input-card-number", handleInputCardNumber);
    socketIoClient.on("input-expired", handleInputExpiredDate);
    socketIoClient.on("input-cvv", handleInputCVV);

    return () => {
      socketIoClient.disconnect();
      socketIoClient.off("input-card-number", handleInputCardNumber);
      socketIoClient.off("input-expired", handleInputExpiredDate);
      socketIoClient.off("input-cvv", handleInputCVV);
    };
  }, []);

  useEffect(() => {
    if (paymentMethod && cardNumber !== "" && expiry !== "") {
      if (
        !isFailed &&
        !isWaiting &&
        !isPrinted &&
        !isSuccess &&
        !isPaymentCredit &&
        !isPaymentCash &&
        !isPhoto &&
        !isDoRetake &&
        !isCreditCard
      ) {
        // sendDataUpdatePayment({
        //   isCreditCard: false,
        //   isWaiting: false,
        //   isFailed: false,
        //   isPrinted: false,
        //   isSuccess: false,
        //   isPaymentCredit: false,
        //   isPaymentCash: false,
        //   isPhoto: false,
        //   isDoRetake: false,
        //   paymentMethod: paymentMethod,
        //   cardNumber: cardNumber,
        //   expiry: expiry,
        //   cvv: cvv,
        //   type: type,
        // });
        const params = {
          code: "card",
          data: "",
        };
        socket.emit("WebClientMessage", JSON.stringify(params));
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setType("");
        setIsCheckedType(false);
        setDataPasporUser(dataUser);
        setDataPermohonanUser(dataNumberPermohonan);
      }
    } else {
      setTimeout(() => {
        if (
          !isFailed &&
          !isWaiting &&
          !isPrinted &&
          !isSuccess &&
          !isPaymentCredit &&
          !isPaymentCash &&
          !isPhoto &&
          !isDoRetake &&
          isCreditCard
        ) {
          sendDataUpdatePayment({
            isCreditCard: false,
            isWaiting: false,
            isFailed: false,
            isPrinted: false,
            isSuccess: false,
            isPaymentCredit: true,
            isPaymentCash: false,
            isPhoto: false,
            isDoRetake: false,
            paymentMethod: paymentMethod,
            cardNumber: cardNumber,
            expiry: expiry,
            cvv: cvv,
            type: type,
          });
          const params = {
            code: "card",
            data: "",
          };
          socket.emit("WebClientMessage", JSON.stringify(params));
          setDataPasporUser(dataUser);
          setDataPermohonanUser(dataNumberPermohonan);
        }
      }, 1000);
    }
  }, [
    paymentMethod,
    cardNumber,
    cvv,
    type,
    dataNumberPermohonan,
    dataUser,
    expiry,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isCreditCard,
    isPaymentCredit,
    isPaymentCash,
    isDoRetake,
    isPhoto,
    sendDataUpdatePayment,
  ]);

  useEffect(() => {
    setDataPasporUser(dataUser);
    setDataPermohonanUser(dataNumberPermohonan);
    if (
      isPrinted &&
      !isFailed &&
      !isSuccess &&
      !isWaiting &&
      !isPaymentCredit &&
      !isPaymentCash &&
      !isCreditCard
    ) {

      setNumber(dataPermohonanUser?.visa_number ?? "");
      setReceipt(dataPermohonanUser?.visa_receipt ?? "");
      setPassportNumber(dataPermohonanUser?.passport_number ?? "");
      setPassportName(dataPermohonanUser?.name ?? "");
      setPassportUrl(dataPermohonanUser?.url ?? "");
      handlePrint();
      const timerPrintOut = setTimeout(() => {
        sendDataUpdatePayment({
          isCreditCard: false,
          isWaiting: false,
          isFailed: false,
          isPrinted: false,
          isSuccess: true,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPhoto: false,
          isDoRetake: false,
          paymentMethod: paymentMethod,
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
          type: type,
        });
      }, 3000);

      return () => clearTimeout(timerPrintOut);
    }
  }, [
    paymentMethod,
    cardNumber,
    cvv,
    type,
    dataPermohonanUser,
    expiry,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isCreditCard,
    isPaymentCredit,
    isPaymentCash,
    isPhoto,
    isDoRetake,
    sendDataUpdatePayment,
    handlePrint,
  ]);

  useEffect(() => {
    // ini jika isSuccess true
    if (
      !isPrinted &&
      !isFailed &&
      isSuccess &&
      !isWaiting &&
      !isPaymentCredit &&
      !isPaymentCash &&
      !isCreditCard &&
      !isPhoto &&
      !isDoRetake
    ) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    isFailed,
    isPrinted,
    isWaiting,
    isSuccess,
    isPaymentCredit,
    isPaymentCash,
    isCreditCard,
    isPhoto,
    isDoRetake,
  ]);

  useEffect(() => {
    if (cardNumber !== "") {
      setCardNumberWarning(false);
    }
  }, [cardNumber]);

  useEffect(() => {
    if (expiry !== "") {
      setExpiryWarning(false);
    }
  }, [expiry]);

  useEffect(() => {
    if (cvv !== "") {
      setCvvWarning(false);
    }
  }, [cvv]);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/home");
    }
  }, [navigate, seconds]);

  // useEffect jika isFailed true, maka setFailedMessage dengan FailedMessage
  useEffect(() => {
    if (isFailed) {
      if (FailedPesan === "Invalid JWT Token") {
        setFailedMessage("please re-login and re-scan passport.");
      } else if (
        FailedPesan === "Network / Card error / declined dll" ||
        failedMessage === ""
      ) {
        setFailedMessage("Network / Card error / declined dll");
      } else {
        setFailedMessage(FailedPesan);
      }
    }
  }, [FailedPesan, isFailed]);

  useEffect(() => {
    setFailedMessage(FailedPesan);
    // console.log("failedMessage cardPayment: ", failedMessage);
  }, [FailedPesan, failedMessage]);

  const handleExpiryChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setExpiry((prevExpiry) => {
        const formattedInput = input
          .replace(/(\d{2})(\d{0,2})/, "$1/$2")
          .replace(/(\/\d{2})\d+?$/, "$1");

        if (/^\d{0,2}\/?\d{0,2}$/.test(formattedInput)) {
          return formattedInput;
        } else {
          return prevExpiry;
        }
      });
    }
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 16) {
      setCardNumber(
        input
          .match(/.{1,4}/g)
          ?.join(" ")
          .substring(0, 19)
      );
    }
  };

  const handlePaymentCredit = () => {
    handleTokenExpiration();
    setPaymentMethod("KIOSK");
    sendDataUpdatePayment({
      isWaiting: false,
      isFailed: false,
      isPrinted: false,
      isSuccess: false,
      isCreditCard: true,
      isPaymentCredit: false,
      isPaymentCash: false,
      isPhoto: false,
      isDoRetake: false,
      paymentMethod: paymentMethod,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
      type: type,
    });
  };

  const handlePaymentCash = () => {
    handleTokenExpiration();
    setIsCheckedType(false);
    setPaymentMethod("KICASH");
    setExpiry("00/00");
    setCvv("000");
    setType("CASH");
    setDataPasporUser(dataUser);
    // console.log("berhasil");
    setCardNumber(cardNumberPetugass);
    // console.log("cardNumberPetugas: ", cardNumberPetugass);
    sendDataUpdatePayment({
      isWaiting: false,
      isFailed: false,
      isPrinted: false,
      isSuccess: false,
      isCreditCard: false,
      isPaymentCredit: false,
      isPaymentCash: true,
      isPhoto: false,
      isDoRetake: false,
      paymentMethod: paymentMethod,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
      type: type,
    });
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  const handleConfirm = () => {
    const newStatusConfirm = !confirm;
    onStatusConfirm(newStatusConfirm);
  };

  const handleSubmit = (e) => {
    handleTokenExpiration();
    e.preventDefault();

    if (cardNumber === "") {
      setCardNumberWarning(true);
    } else if (expiry === "") {
      setExpiryWarning(true);
    } else if (cvv === "") {
      setCvvWarning(true);
    } else {
      // SweetAlert dialog and further actions
      setCvvWarning(false);
      setCardNumberWarning(false);
      setExpiryWarning(false);
      Swal.fire({
        title: "Are you sure want to Pay?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3D5889",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          const card_data = {
            cc_no: cardNumber,
            cc_exp: expiry,
            ccv: cvv,
            type: type,
          };

          const bill_data = {
            billing_id: "",
            amount: "",
            currency: "",
          };

          const user_data = {
            pass_no: dataPasporUser.passportData.docNumber,
            pass_name: dataPasporUser.passportData.fullName,
            country: dataPasporUser.passportData.nationality,
          };

          const dataParam = {
            card_data: { ...card_data },
            bill_data: { ...bill_data },
            user_data: { ...user_data },
          };

          console.log("dataParam: ", dataParam);
          sendDataUpdatePayment({
            isWaiting: false,
            isConfirm: false,
            isFailed: false,
            isPrinted: false,
            isPaymentCash: false,
            isPaymentCredit: false,
            isCreditCard: false,
            isSuccess: false,
            isPhoto: false,
            isDoRetake: false,
            paymentMethod: paymentMethod,
            cardNumber: cardNumber,
            expiry: expiry,
            cvv: cvv,
            type: type,
          });

          const newStatusPaymentCreditCard = !statusPaymentCredit;
          onStatusChange(newStatusPaymentCreditCard);
        }
      });
    }
  };

  const handleSubmitKICASH = () => {
    handleTokenExpiration();
    isLoading(false);
    setCardNumber(cardNumberPetugass);
    if (cardNumber === "") {
      setCardNumberWarning(true);
    } else if (expiry === "") {
      setExpiryWarning(true);
    } else if (cvv === "") {
      setCvvWarning(true);
    } else if (cardNumber !== "" && cvv !== "" && expiry !== "") {
      setCardNumberWarning(false);
      setExpiryWarning(false);
      setCvvWarning(false);
      const card_data = {
        cc_no: cardNumber,
        cc_exp: expiry,
        cvv: cvv,
        type: type,
      };

      const bill_data = {
        billing_id: "",
        amount: "",
        currency: "",
      };

      const user_data = {
        pass_no: dataPasporUser.passportData.docNumber,
        pass_name: dataPasporUser.passportData.fullName,
        country: dataPasporUser.passportData.nationality,
      };

      // console.log("dataPasporUser: ", dataPasporUser);

      const dataParam = {
        card_data: { ...card_data },
        bill_data: { ...bill_data },
        user_data: { ...user_data },
      };

      console.log("dataParam: ", dataParam);
      sendDataUpdatePayment({
        isWaiting: false,
        isConfirm: false,
        isFailed: false,
        isPrinted: false,
        isSuccess: false,
        isPhoto: false,
        isDoRetake: false,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
        type: type,
      });
      const newStatusPaymentCreditCard = !statusPaymentCredit;
      onStatusChange(newStatusPaymentCreditCard);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      isLoading(true);
      const response = await axios.post(`${url_dev}Login.php`, {
        username,
        password,
      });

      if (
        response.data.JwtToken.token !== null &&
        response.data.JwtToken.token !== "" &&
        response.data.status === "success"
      ) {
        localStorage.setItem("JwtToken", response.data.JwtToken.token);
        const userProfile = await axios.get(`${url_dev}ProfileMe.php`, {
          headers: {
            Authorization: `Bearer ${response.data.JwtToken.token}`,
          },
        });

        if (
          userProfile.data.user_data !== null &&
          userProfile.data.price !== null &&
          userProfile.data.api !== null
        ) {
          if (
            userProfile.data.api.key === localStorage.getItem("key") &&
            userProfile.data.api.token === localStorage.getItem("token")
          ) {
            localStorage.setItem("key", userProfile.data.api.key);
            localStorage.setItem("token", userProfile.data.api.token);
            localStorage.setItem(
              "user",
              JSON.stringify(userProfile.data.user_data)
            );
            localStorage.setItem(
              "price",
              JSON.stringify(userProfile.data.price)
            );
            sendDataUpdatePayment({
              isConfirm: false,
              isFailed: false,
              isPrinted: false,
              isSuccess: false,
              isWaiting: true,
              isPhoto: false,
              isDoRetake: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              paymentMethod: paymentMethod,
              cardNumber: cardNumber,
              expiry: expiry,
              cvv: cvv,
              type: type,
            });
            handleSubmitKICASH();
          } else if (
            userProfile.data.api.key !== localStorage.getItem("key") &&
            userProfile.data.api.token !== localStorage.getItem("token")
          ) {
            isLoading(false);
            Swal.fire({
              icon: "error",
              title: "Please use the same account from the previous login",
            });
            sendDataUpdatePayment({
              isWaiting: false,
              isFailed: false,
              isPrinted: false,
              isSuccess: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: true,
              isPhoto: false,
              isDoRetake: false,
              paymentMethod: paymentMethod,
              cardNumber: cardNumber,
              expiry: expiry,
              cvv: cvv,
              type: type,
            });
          } else {
            isLoading(false);
            Swal.fire({
              icon: "error",
              title: "Please use the same account from the previous login",
            });
          }
        } else {
          isLoading(false);
          Swal.fire({
            icon: "error",
            title: "Failed to Payment",
          });
        }
      } else if (
        response.data.status === "error" ||
        response.data.message === "Login failed"
      ) {
        isLoading(false);
        Swal.fire({
          icon: "error",
          title: "Please use the same account from the previous login",
        });
        sendDataUpdatePayment({
          isWaiting: false,
          isFailed: false,
          isPrinted: false,
          isSuccess: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: true,
          isPhoto: false,
          isDoRetake: false,
          paymentMethod: paymentMethod,
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
          type: type,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Username or Password Invalid!",
        });
      }
    } catch (error) {
      isLoading(false);
      // console.error("Error during login:", error);
      if (error.response && error.response.status === 401) {
        Toast.fire({
          icon: "error",
          title: "Username or Password is Wrong",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "VPN connection is interrupted",
        });
      }
      sendDataUpdatePayment({
        isWaiting: false,
        isFailed: false,
        isPrinted: false,
        isSuccess: false,
        isCreditCard: false,
        isPaymentCredit: false,
        isPaymentCash: true,
        isPhoto: false,
        isDoRetake: false,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
        type: type,
      });
    }
  };
  // const handleSubmitCash = (e) => {
  //   e.preventDefault();
  //   handlePrint();
  // };

  const handleSubmitCash = (e) => {
    // handlePrint();
    e.preventDefault();

    Swal.fire({
      title: "Are you sure want to Pay?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3D5889",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Login",
          html:
            '<input id="swal-input1" class="swal2-input" placeholder="UserName">' +
            '<input id="swal-input2" type="password" class="swal2-input" placeholder="Password">',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Submit",
          confirmButtonColor: "#3D5889",
          cancelButtonText: "Cancel",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            const username = document.getElementById("swal-input1").value;
            const password = document.getElementById("swal-input2").value;

            // Lakukan sesuatu dengan email dan password yang diambil

            if (username && password) {
              sendDataUpdatePayment({
                isConfirm: false,
                isFailed: false,
                isPrinted: false,
                isSuccess: false,
                isWaiting: true,
                isPaymentCash: false,
                isPaymentCredit: false,
                isCreditCard: false,
                paymentMethod: paymentMethod,
                cardNumber: cardNumber,
                expiry: expiry,
                cvv: cvv,
                type: type,
              });
              handleLogin(username, password);
            } else {
              Swal.fire("Please enter username and password");
            }
          }
        });
      }
    });
  };

  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">
          <h1 className="card-title">
            {isPrinted ? (
              "Payment Success"
            ) : isSuccess ? (
              <>
                Your VOA has been issued
                <br />
                Please Check Your email
              </>
            ) : isFailed ? (
              "Payment Failed"
            ) : isCreditCard ? (
              "Please input your credit card"
            ) : isPaymentCredit ? (
              "Confirmation Payment -CC"
            ) : isPaymentCash ? (
              "Confirmation Payment - Cash"
            ) : isWaiting ? (
              ""
            ) : isPhoto ? (
              "Please look at camera"
            ) : isDoRetake ? (
              "Take Photo Success"
            ) : (
              "Chose payment method"
            )}
          </h1>
          {isPrinted ? (
            <div className="isPrint-container1">
              <img src={Success} alt="" className="card-image-success1" />
              <div className="print-container1">
                <h2>
                  Please wait until receipt has been
                  <br />
                  printed
                </h2>
                <img className="card-image-print1" src={PrintIcon} />
              </div>
            </div>
          ) : isSuccess ? (
            <div className="issusccess-container1">
              <img src={Success} alt="" className="card-image-issuccess1" />
              <div className="issusccess-register1">
                <div className="issusccess-register2">
                  <h3>Visa Number: </h3>
                  <h3>Visa Receipt: </h3>
                </div>
                <div className="issusccess-register2">
                  <h3>{number}</h3>
                  <h3>{receipt}</h3>
                </div>
              </div>
              <h4>Please capture this page when receipt not printed out</h4>

              <button onClick={handleBackHome}>
                <h2>OK</h2>
                <span>({seconds})</span>
              </button>
            </div>
          ) : isFailed ? (
            <div className="isfailed-payment">
              <div className="isfailed-payment2">
                <h3>
                  Reason Failed :{" "}
                  {failedMessage
                    ? failedMessage
                    : "Network / Card error / declined"}
                </h3>
              </div>
              <img src={Failed} alt="" className="card-image-issuccess1" />
              <div className="form-group-payment-submit1">
                <button type="submit" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          ) : isCreditCard ? (
            <div className="card-container-image">
              <img src={InsertCard} alt="" className="card-image1" />
            </div>
          ) : isPaymentCredit ? (
            <form className="payment-credit-cardCC" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <div className="credit-card-payment1">
                  <div className="amount">
                    <p>Amount</p>
                    <p>Transaction Fee</p>
                    <p>Total Amount</p>
                  </div>
                  <div className="amount-price">
                    <div className="amount-box1">
                      <input type="text" value={`Rp. ${formattedValue}`} />
                    </div>
                    <div className="amount-box2">
                      <input type="text" value={`Rp. ${formattedFee}`} />
                    </div>
                    <div className="amount-box3">
                      <input type="text" value={`Rp. ${formattedTotal}`} />
                    </div>
                  </div>
                </div>
                <div className="credit-card-payment2">
                  <div className="credit-card-payment3">
                    <p>Card Number</p>
                    <p>Expired</p>
                    <p>CVV</p>
                  </div>
                  <div className="credit-card-payment4">
                    <div className="credit-card-value10">
                      <div className="credit-card-value10X">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                        />
                        {cardNumberWarning && (
                          <div className="warning">
                            Please enter Card Number!
                          </div>
                        )}
                      </div>
                      <div className="credit-card-value10Y">
                        <Select
                          id="creditType"
                          value={
                            type
                              ? optionCreditTypes.find(
                                (option) => option.value === type
                              )
                              : ""
                          }
                          onChange={(selectedOption) =>
                            setType(selectedOption.value)
                          }
                          isDisabled={isCheckedType}
                          options={optionCreditTypes}
                          className="basic-single"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              flex: 1,
                              width: "26vh",
                              borderRadius: "10px",
                              backgroundColor: "rgba(217, 217, 217, 0.75)",
                              fontFamily: "Roboto, Arial, sans-serif",
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              flex: 1,
                              width: "100%",
                            }),
                            control: (provided) => ({
                              ...provided,
                              flex: 1,
                              width: "100%",
                              backgroundColor: "rgba(217, 217, 217, 0.75)",
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <div className="credit-card-value2">
                      <input
                        type="text"
                        // value="12/25"
                        value={expiry}
                        onChange={handleExpiryChange}
                      />
                      {expiryWarning && (
                        <div className="warning">Please enter Expiry Card!</div>
                      )}
                    </div>
                    <div className="credit-card-value3">
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                      {cvvWarning && (
                        <div className="warning">Please enter cvv!</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="confirm-payment-credit">
                  <div className="confirm-payment-credit2">
                    <div className="form-group-payment-submit2">
                      <button type="submit">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : isPaymentCash ? (
            <form className="payment-credit-cardCC" onSubmit={handleSubmitCash}>
              <div>
                <div className="credit-card-payment1">
                  <div className="amount">
                    <p>Amount</p>
                    <p>Transaction Fee</p>
                    <p>Total Amount</p>
                  </div>
                  <div className="amount-price">
                    <div className="amount-box1">
                      <input type="text" value={`Rp. ${formattedValue}`} />
                    </div>
                    <div className="amount-box2">
                      <input type="text" value={`Rp. ${formattedFeeCash}`} />
                    </div>
                    <div className="amount-box3">
                      <input type="text" value={`Rp. ${formattedTotalCash}`} />
                    </div>
                  </div>
                </div>
                <div className="credit-card-payment21">
                  <div className="credit-card-payment31">
                    <p>Card Number</p>
                  </div>
                  <div className="credit-card-payment4">
                    <div className="credit-card-value1">
                      <input type="text" value={cardNumberPetugass} />
                    </div>
                    {cardNumberWarning && (
                      <div className="warning">
                        Please enter your card number!
                      </div>
                    )}
                  </div>
                </div>
                <div className="confirm-payment-credit">
                  <div className="confirm-payment-credit2">
                    <div className="form-group-payment-submit3">
                      <button type="submit">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : isWaiting ? (
            <div style={{ color: "#3d5889" }}>
              <h1>Please wait...</h1>
            </div>
          ) : isPhoto ? (
            <>
              <div
                className="webcam-container"
                style={{ marginTop: "5%", marginBottom: "8%" }}
              >
                <Webcam
                  className="webcam"
                  audio={false}
                  ref={webcamRef}
                  mirrored={true}
                  screenshotFormat="image/jpeg"
                  width={120}
                  height={220}
                  videoConstraints={{
                    width: { min: 120 },
                    height: { min: 220 },
                    aspectRatio: 0.6666666667,
                  }}
                />
                <div className="bounding-box"></div>
              </div>
              <button onClick={capture} className="ok-button">
                Take a face photo
              </button>
            </>
          ) : isDoRetake ? (
            <>
              <div className="box-image">
                <img
                  src={capturedImages}
                  alt="Captured Image"
                  className="potrait-image"
                  style={{
                    width: "40vh",
                    height: "35vh",
                    marginLeft: "12vh",
                    marginBottom: "10%",
                    marginTop: "5%",
                  }}
                />
              </div>
              <button onClick={doRetake} className="retake-button">
                Retake
              </button>
            </>
          ) : (
            <div className="payment-method">
              <div className="payment-credit" onClick={handlePaymentCredit}>
                <img src={Credit} alt="" />
                <p>Credit/Debit Card</p>
              </div>
              <div className="payment-cash" onClick={handlePaymentCash}>
                <img src={Cash} alt="" />
                <p>Cash</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Printer
        dataNumberPermohonanPropsVisa={number}
        dataNumberPermohonanPropsReceipt={receipt}
        printRefProps={printRef}
        dataPrice={formattedValue}
        dataLokasi={printLokasi}
        passportumber={passportNumber}
        passportName={passportName}
        passportUrl={passportUrl}
      />
    </div>
  );
};

export default CardPayment;