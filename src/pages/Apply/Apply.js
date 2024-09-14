import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import { useAtom } from "jotai";
import dataPasporImg from "../../utils/dataPhotoPaspor";
import "./ApplyStyle.css";
import Swal from "sweetalert2";
import { Toast } from "../../components/Toast/Toast";
import { formData, resultDataScan, caputedImageAfter } from "../../utils/atomStates";
import { useNavigate } from "react-router-dom";
import { imageToSend } from "../../utils/atomStates";
import Cookies from 'js-cookie';
import { apiInsertDataUser, apiPblAddFaceRec, getUserbyPassport } from "../../services/api";
import { initiateSocket4010, addPendingRequest4010 } from "../../utils/socket";
import axios from "axios";

const Apply = () => {
  const socketRef = useRef(null);
  const socket_IO_4010 = initiateSocket4010();
  const [, setFormData] = useAtom(formData);
  const [image] = useAtom(imageToSend);
  const navigate = useNavigate();
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(true);
  const [tabStatus, setTabStatus] = useState(1);
  const [cardStatus, setCardStatus] = useState("iddle");
  const [dataPrimaryPassport, setDataPrimaryPassport] = useState(null);
  const [cardNumberPetugas, setCardNumberPetugas] = useState("");
  const [sharedData, setSharedData] = useState(null);
  const [statusPaymentCredit, setStatusPaymentCredit] = useState(false);
  const [titleHeader, setTitleHeader] = useState("Apply PLB");
  const [titleFooter, setTitleFooter] = useState("Next Step");
  const [dataPermohonan, setDataPermohonan] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [meesageConfirm, setMessageConfirm] = useState(
    "Network / Card error / declined dll"
  );
  const ipServer = localStorage.getItem("ipServer");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dataTrueorFalse = localStorage.getItem("dataStatus");
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
  const [dataScan, setDataScan] = useState()
  const [isConnected, setIsConnected] = useState(false);
  const [objectApi, setObjectApi] = useState(null);
  const [objectCamera, setObjectCamera] = useState(null);
  const [ipKamera, setIpKamera] = useState([]);
  let loginDataArray = [];

  let isCloseTimeoutSet = false;




  const receiveDataFromChild = (data) => {
    // console.log("dataFromChild", data);
    const sexMapping = {
      "M": "male",
      "F": "female"
    };

    if (dataTrueorFalse === "true" || data === "true") {
      const newDataSearchPassport = {
        docNumber: data.PassportNumber,
        formattedExpiryDate: data.ExpiredDate,
        fullName: data.FullName,
        formattedBirthDate: data.DateOfBirth,
        nationality: data.NationalityCode,
        sex: sexMapping[data.Sex],
        issuingState: data.IssuingCountry,
        noRegister: data.NoRegister,
        email: data.Email,
        postal_code: data.PostalCode,
        city: data.City,
        address: data.Address,
      };
      setDataPrimaryPassport(newDataSearchPassport);
      setCardStatus("successSearch");
      setIsEnableStep(true);
      setIsEnableBack(true);

    } else {
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

      // console.log("newDataPassport", newDataPassport);

      // Handle received data
      const dataHardCodePaspor = newDataPassport;

      let fullName =
        dataHardCodePaspor.foreName + " " + dataHardCodePaspor.surName;

      dataHardCodePaspor.fullName = fullName;

      // Buat fungsi untuk mengonversi format tanggal
      function formatDate(dateString) {
        if (!dateString || dateString.length !== 6) return null; // Pastikan format tanggal benar

        // Pisahkan tahun, bulan, dan tanggal dari string
        var year = dateString.substring(0, 2);
        var month = dateString.substring(2, 4);
        var day = dateString.substring(4, 6);

        const currentYear = new Date().getFullYear();

        year = parseInt(year) <= currentYear % 100 ? "20" + year : "19" + year;

        // Kembalikan tanggal dalam format yang diinginkan
        return year + "-" + month + "-" + day;
      }

      function formatDateExpiry(dateString) {
        if (!dateString || dateString.length !== 6) return null; // Pastikan format tanggal benar

        // Pisahkan tahun, bulan, dan tanggal dari string
        var year = dateString.substring(0, 2);
        var month = dateString.substring(2, 4);
        var day = dateString.substring(4, 6);

        // Konversi tahun menjadi format empat digit (asumsi tahun 1900-1999 atau 2000-2099)
        year = parseInt(year) < 50 ? "20" + year : "19" + year;

        // Kembalikan tanggal dalam format yang diinginkan
        return year + "-" + month + "-" + day;
      }

      // Terapkan format tanggal pada data paspor
      dataHardCodePaspor.formattedExpiryDate = formatDateExpiry(
        dataHardCodePaspor.expiryDate
      );
      dataHardCodePaspor.formattedBirthDate = formatDate(
        dataHardCodePaspor.birthDate
      );
      dataHardCodePaspor.email = dataHardCodePaspor.email
        ? dataHardCodePaspor.email
        : "";

      // console.log("dataHardCodePaspor", dataHardCodePaspor);

      setDataPrimaryPassport(dataHardCodePaspor);

      setCardStatus("success");
      setTimeout(() => {
        setCardStatus("checkData");
        setIsEnableStep(true);
        setIsEnableBack(true);
      }, 1000);
    }


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


  const connectWebSocket = (ipAddress, socket_IO) => {
    const socketURL = `ws://localhost:4488`;
    socketRef.current = new WebSocket(socketURL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      isCloseTimeoutSet = false;
      setCardStatus("iddle"); // Start in 'iddle' state after connection opens
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const dataJson = JSON.parse(event.data);
        console.log("Received data from server websocket:", dataJson);

        // Only attempt to decode if `dataJson.uvImage` exists
        if (dataJson.visibleImage) {
          setResDataScan(dataJson.visibleImage);
        }

        switch (dataJson.msgType) {
          case "passportData":
            break;
          case "visibleImage":
            setRecievedTempData((previous) => [...previous, dataJson]);
            break;
          case "DeviceController":
            const { airportId, deviceId, jenisDeviceId } = dataJson;
            localStorage.setItem("airportId", airportId);
            localStorage.setItem("deviceId", deviceId);
            localStorage.setItem("jenisDeviceId", jenisDeviceId);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message data:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setCardStatus("errorConnection");

      // Close handling and reconnection logic
      if (!isCloseTimeoutSet) {
        setCardStatus("errorWebsocket");
        setTimeout(() => {
          isCloseTimeoutSet = true;
        }, 3000);
      } else {
        // Attempt to reconnect or notify server
        // if (socket_IO) {
        //   socket_IO.emit("clientData", "re-newIpAddress");
        // } else {
        //   console.warn("socket_IO is undefined.");
        // }
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setCardStatus("errorConnection");
      setIsConnected(false);
    };
  };
  const connectWebSocket = (ipAddress, socket_IO) => {
    const socketURL = `ws://localhost:4488`;
    socketRef.current = new WebSocket(socketURL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      isCloseTimeoutSet = false;
      setCardStatus("iddle"); // Start in 'iddle' state after connection opens
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const dataJson = JSON.parse(event.data);
        console.log("Received data from server websocket:", dataJson);

        // Only attempt to decode if `dataJson.uvImage` exists
        if (dataJson.visibleImage) {
          setResDataScan(decodeBase64ToImage(dataJson.visibleImage));
        }

        switch (dataJson.msgType) {
          case "passportData":
            break;
          case "visibleImage":
            setRecievedTempData((previous) => [...previous, dataJson]);
            break;
          case "DeviceController":
            const { airportId, deviceId, jenisDeviceId } = dataJson;
            localStorage.setItem("airportId", airportId);
            localStorage.setItem("deviceId", deviceId);
            localStorage.setItem("jenisDeviceId", jenisDeviceId);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message data:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setCardStatus("errorConnection");

      // Close handling and reconnection logic
      if (!isCloseTimeoutSet) {
        setCardStatus("errorWebsocket");
        setTimeout(() => {
          isCloseTimeoutSet = true;
        }, 3000);
      } else {
        // Attempt to reconnect or notify server
        // if (socket_IO) {
        //   socket_IO.emit("clientData", "re-newIpAddress");
        // } else {
        //   console.warn("socket_IO is undefined.");
        // }
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setCardStatus("errorConnection");
      setIsConnected(false);
    };
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    connectWebSocket(null, socket_IO_4010); // Ensure to pass `socket_IO` properly

    return () => {
      closeWebSocket();
    };
  }, []);

  // Contoh penggunaan di tempat lain
  const handleTokenExpiration = () => {
    // const isTokenValid = checkAndHandleTokenExpiration();

    // if (!isTokenValid) {
    //   // Token has expired, handle the expiration here
    //   Swal.fire({
    //     icon: "error",
    //     text: "Expired JWT Token",
    //     confirmButtonColor: "#3d5889",
    //   }).then((result) => {
    //     // If the user clicks "OK", clear localStorage
    //     if (result.isConfirmed) {
    //       // navigate("/");
    //       localStorage.removeItem("user");
    //       localStorage.removeItem("JwtToken");
    //       localStorage.removeItem("cardNumberPetugas");
    //       localStorage.removeItem("key");
    //       localStorage.removeItem("token");
    //       localStorage.removeItem("jenisDeviceId");
    //       localStorage.removeItem("deviceId");
    //       localStorage.removeItem("airportId");
    //       localStorage.removeItem("price");
    //     }
    //   });
    // }
  };

  const updateStatusPaymentCredit = (newstatusPaymentCredit) => {
    setStatusPaymentCredit(newstatusPaymentCredit);
  };

  const updateStatusConfirm = (newStatusConfirm) => {
    setConfirm(newStatusConfirm);
  };

  const updateSharedData = (newSharedData) => {
    setSharedData(newSharedData);
  };
  const [resDataScan, setResDataScan] = useAtom(resultDataScan)
  const [caputedImageAfter2, setCaputedImageAfter2] = useAtom(caputedImageAfter)
  const btnOnClick_Back = () => {
    setResDataScan("")
    navigate('/home')
    if (!isOnline) {
      Toast.fire({
        icon: "error",
        title: "No Internet Connection",
      });
      return;
    }

    if (isEnableBack) {
      console.log("cardStatusSaatIni", cardStatus);
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
      } else if (cardStatus === "iddle" || cardStatus === "searchPassport") {
        navigate("/home");
      } else if (cardStatus === "lookCamera") {
        setTabStatus(1);
        setCardStatus("checkData");
      } else if (cardStatus === "postalCode") {
        const params = {
          code: "email",
          data: "",
        };
        setTabStatus(2);
        setCardStatus("inputEmail");
      } else if (cardStatus === "waiting") {
        setTabStatus(1);
        setCardStatus("checkData");
      }
    }
  };

  function isEmptyOrNull(value) {
    return value === "" || value === null;
  }

  // Function to check if an object has a specific property
  function hasProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }


  const btnOnClick_Step = () => {
    if (!isOnline) {
      Toast.fire({
        icon: "error",
        title: "No Internet Connection",
      });
      return;
    }
    if (isEnableStep) {
      if (cardStatus === "checkData" || cardStatus === "iddle") {
        const dataChecked = sharedData?.passportData;
        console.log("dataChecked", dataChecked);

        if (dataChecked === null || dataChecked === "") {
          Swal.fire({
            icon: "error",
            title: "Data still empty",
            text: "Please check your data",
            confirmButtonColor: "#3d5889",
          });
        } else if (
          isEmptyOrNull(dataChecked.docNumber) || !hasProperty(dataChecked, "docNumber") ||
          isEmptyOrNull(dataChecked.noRegister) || !hasProperty(dataChecked, "noRegister") ||
          isEmptyOrNull(dataChecked.fullName) || !hasProperty(dataChecked, "fullName") ||
          isEmptyOrNull(dataChecked.formattedBirthDate) || !hasProperty(dataChecked, "formattedBirthDate") ||
          isEmptyOrNull(dataChecked.sex) || !hasProperty(dataChecked, "sex") ||
          isEmptyOrNull(dataChecked.nationality) || !hasProperty(dataChecked, "nationality")
        ) {
          Swal.fire({
            icon: "error",
            title: "Have empty data",
            text: "Please check your data",
            confirmButtonColor: "#3d5889",
          });
        } else {
          setCardStatus("lookCamera");
          setTabStatus(2);
        }
      } else if (cardStatus === "takePhotoSucces") {
        setFormData(sharedData);
        setDataPermohonan(sharedData);
        doSaveRequestVoaPayment(sharedData);
        setCardStatus("goPayment");
        setCardPaymentProps({
          isWaiting: true,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
          isPhoto: false,
        });
        // setTimeout(() => {
        //   setCardPaymentProps({
        //     isWaiting: false,
        //     isCreditCard: false,
        //     isPaymentCredit: false,
        //     isPaymentCash: false,
        //     isPrinted: false,
        //     isSuccess: false,
        //     isFailed: false,
        //     isPyamentUrl: false,
        //     isPhoto: false,
        //     isDoRetake: false,
        //   });
        //   setDisabled(false);
        //   setIsEnableStep(true);
        //   setCardStatus("takePhotoSucces");
        // }, 100);
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
      }
    }
  };

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

  //console.log nilai image dari atom
  console.log("imageFromAtom", image);


  useEffect(() => {
    const cardNumberPetugasFix = 11 + localStorage.getItem("cardNumberPetugas");
    // Periksa apakah cardNumberPetugasFix adalah string sebelum melakukan replace
    if (typeof cardNumberPetugasFix === "string") {
      const cardNumberPetugas = cardNumberPetugasFix.replace(/"/g, "");
      setCardNumberPetugas(cardNumberPetugas);
    }
  }, []);

  const handleLogin = async (sUserName, sPassword, ipCameraSet, cameraIndex) => {
    console.log("LoginKamerake", cameraIndex, ipCameraSet)
    try {
      const encodedPassword = btoa(sPassword);
      const response = await axios.put(`http://${ipCameraSet}/cgi-bin/entry.cgi/system/login`, {
        sUserName,
        sPassword: encodedPassword,
      });
      const dataRes = response.data;
      let authUser = "";
      console.log(dataRes, "responsehitapi");
      if (dataRes.status.code === 200) {
        if (dataRes.data.auth === 0) {
          authUser = "admin";
        } else {
          authUser = "user";
        }
        const loginData = `Face-Token=${dataRes.data.token}; face-username=${authUser}; roleId=${dataRes.data.auth}; sidebarStatus=${dataRes.data.status}; token=${dataRes.data.token}`;
        loginDataArray[cameraIndex] = loginData;

        // Cek jika semua kamera sudah memiliki datanya
        if (loginDataArray.filter(data => data !== undefined).length === ipKamera.length) {
          const data = {
            ipServerPC: ipServer,
            ipServerCamera: ipKamera,
            cookiesCamera: loginDataArray,
          };
          Toast.fire({
            icon: "success",
            title: "Data berhasil disimpan",
          });
          socket_IO_4010.emit("saveCameraData", data);
          if (socket_IO_4010.connected) {
            console.log("testWebsocket4010 connected");
            socket_IO_4010.emit("sendDataUser", { bodyParamsSendKamera: objectCamera });
          } else {
            //connnect ulang ke socket_IO_4010
            console.log("testWebsocket4010 not connected");
            socket_IO_4010.emit("sendDataUser", { bodyParamsSendKamera: objectCamera });
            socket_IO_4010.connect();
          }
        }
      } else {
        Swal.fire(dataRes.status.message);
      }
    } catch (error) {
      Swal.fire("Gagal login");
    }
  };



  useEffect(() => {
    socket_IO_4010.on("DataIPCamera", (data) => {
      setIpKamera(data.ipCamera);
    });
    socket_IO_4010.on("responseSendDataUser", (data) => {
      console.log("dataResponseSendDataUser", data);
      if (data === "Successfully") {
        setCaputedImageAfter2(null);
        console.log("sharedDataTOSEndAPi", sharedData);
        const response = apiInsertDataUser(objectApi, ipServer);
        response.then((res) => {
          if (res.data.status === 200) {
            setCardPaymentProps({
              isWaiting: false,
              isCreditCard: false,
              isPaymentCredit: false,
              isPaymentCash: false,
              isPrinted: true,
              isSuccess: false,
              isFailed: false,
              isPyamentUrl: false,
              isPhoto: false,
            });
            setDisabled(true);
            setRecievedTempData([]);
            setDataPrimaryPassport(null);
          }
        }).catch((error) => {
          console.error("Error:", error);
        });
      } else if (data === 'Your session has expired.') {
        if (ipKamera.length > 0) {
          const showLoginDialog = (callback, initialUsername = "") => {
            Swal.fire({
              title: `Login`,
              html:
                `<input id="swal-input1" class="swal2-input" placeholder="Username" value="${initialUsername}">` +
                '<input id="swal-input2" type="password" class="swal2-input" placeholder="Password">',
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonText: "Kirim",
              confirmButtonColor: "#3D5889",
              cancelButtonText: "Batal",
              cancelButtonColor: "#d33",
            }).then((result) => {
              if (result.isConfirmed) {
                const username = document.getElementById("swal-input1").value;
                const password = document.getElementById("swal-input2").value;

                if (username && password) {
                  callback(username, password);
                } else {
                  Swal.fire("Harap masukkan username dan password");
                  showLoginDialog(callback, username);
                }
              }
            });
          };
          const loginAllCameras = (sUserName, sPassword) => {
            ipKamera.forEach((ipCameraSet, index) => {
              handleLogin(sUserName, sPassword, ipCameraSet, index);
            });
          };
          showLoginDialog((sUserName, sPassword) => {
            loginAllCameras(sUserName, sPassword);
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "Harap pilih jumlah kamera",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Gagal mengirim data",
        });
        setCardPaymentProps({
          isWaiting: false,
          isCreditCard: false,
          isPaymentCredit: false,
          isPaymentCash: false,
          isPrinted: false,
          isSuccess: false,
          isFailed: false,
          isPyamentUrl: false,
          isPhoto: false,
          isDoRetake: false,
        });
        setDisabled(false);
        setIsEnableStep(true);
        setCardStatus("takePhotoSucces");
        setTabStatus(2);
      }
    });

    return () => {
      socket_IO_4010.off("DataIPCamera");
      socket_IO_4010.off("responseSendDataUser");
    }
  }, [socket_IO_4010, objectApi]);

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

  useEffect(() => {
    if (cardStatus === "goPayment") {
      setIsEnableStep(true);
    } else if (cardStatus === "iddle") {
      const params = {
        code: "email",
        data: "",
      };
    } else if (
      cardStatus === "checkData" ||
      cardStatus === "inputEmail" ||
      cardStatus === "lookCamera" ||
      cardStatus === "postalCode" ||
      cardStatus === "takePhotoSucces" ||
      cardStatus === "waiting"
    ) {

    }
  }, [cardStatus]);

  useEffect(() => {
    if (receiveTempData.length > 2) {
      setRecievedTempData([]);
    }
  }, [receiveTempData]);

  useEffect(() => {
    if (cardPaymentProps.isPrinted) {
      setDisabled(true);
    }
  }, [cardPaymentProps]);


  const doSaveRequestVoaPayment = async (sharedData) => {

    const checkDataUser = await getUserbyPassport(sharedData?.passportData?.docNumber);
    console.log("checkDataUser", checkDataUser.data.data);
    if (checkDataUser.data.data.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Data sudah ada",
        text: "Silahkan periksa kembali data anda",
        confirmButtonColor: "#3d5889",
      });
      setCardPaymentProps({
        isWaiting: false,
        isCreditCard: false,
        isPaymentCredit: false,
        isPaymentCash: false,
        isPrinted: false,
        isSuccess: false,
        isFailed: false,
        isPyamentUrl: false,
        isPhoto: false,
        isDoRetake: false,
      });
      setDisabled(false);
      setIsEnableStep(true);
      setCardStatus("takePhotoSucces");
      return;
    }

    setCaputedImageAfter2(sharedData.photoFace);
    const bodyParamsSendKamera = {
      method: "addfaceinfonotify",
      params: {
        data: [
          {
            personId: sharedData.passportData.docNumber,
            personNum: sharedData.passportData.noRegister,
            passStrategyId: "",
            personIDType: 1,
            personName: sharedData.passportData.fullName,
            personGender: sharedData.passportData.sex === "male" ? 1 : 0,
            validStartTime: Math.floor(new Date().getTime() / 1000).toString(),
            validEndTime: Math.floor(new Date(`${sharedData.passportData.formattedExpiryDate}T23:59:00`).getTime() / 1000).toString(),
            personType: 1,
            identityType: 1,
            identityId: sharedData.passportData.docNumber,
            identitySubType: 1,
            identificationTimes: -1,
            identityDataBase64: sharedData.photoFace ? sharedData?.photoFace.split(',')[1] : "",
            status: 0,
            reserve: "",
          }
        ],
      }
    }
    const dataTosendAPI = {
      no_register: sharedData.passportData.noRegister,
      no_passport: sharedData.passportData.docNumber,
      name: sharedData.passportData.fullName,
      date_of_birth: sharedData.passportData.formattedBirthDate,
      gender: sharedData.passportData.sex === "male" ? "M" : "F",
      nationality: sharedData.passportData.nationality,
      expired_date: `${sharedData.passportData.formattedExpiryDate}`,
      arrival_time: new Date(),
      destination_location: sharedData.passportData.destinationLocation,
      profile_image: sharedData.photoFace ? sharedData.photoFace : `data:image/jpeg;base64,${dataPasporImg.visibleImage}`,
      photo_passport: resDataScan ? `data:image/jpeg;base64,${resDataScan}` : `data:image/jpeg;base64,${dataPasporImg.visibleImage}`,
    };
    setObjectApi(dataTosendAPI);
    setObjectCamera(bodyParamsSendKamera)

    console.log("sharedDataTOSEndAPi", sharedData);

    if (socket_IO_4010.connected) {
      console.log("testWebsocket4010 connected");
      socket_IO_4010.emit("sendDataUser", { bodyParamsSendKamera });
    } else {
      //connnect ulang ke socket_IO_4010
      console.log("testWebsocket4010 not connected");
      addPendingRequest4010({ action: "sendDataUser", data: { bodyParamsSendKamera } });
      socket_IO_4010.connect();
    }



    console.log("nilaiBodyParamsSendKamera", bodyParamsSendKamera);


    setIsEnableStep(false);

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
        dataScan={dataScan}
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
