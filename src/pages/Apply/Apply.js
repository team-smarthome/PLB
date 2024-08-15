import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import { useAtom } from "jotai";
import dataPasporImg from "../../utils/dataPhotoPaspor";
import "./ApplyStyle.css";
import Swal from "sweetalert2";
import { Toast } from "../../components/Toast/Toast";

const Apply = () => {
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
      } else if (cardStatus === "iddle" || cardStatus === "searchPassport") {
        const params = {
          code: "email",
          data: "",
        };
        // navigate("/home");
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

      } else if (cardStatus === "successSearch") {
        setIsEnableStep(true);
        setCardStatus("goPayment");
        // setTitleHeader("Payment");
      } else if (cardStatus === "emailSucces") {
        // setCardStatus("postalCode");
        setCardStatus("lookCamera")
        setTabStatus(3);
      } else if (cardStatus === "takePhotoSucces") {
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


  useEffect(() => {
    const cardNumberPetugasFix = 11 + localStorage.getItem("cardNumberPetugas");
    // Periksa apakah cardNumberPetugasFix adalah string sebelum melakukan replace
    if (typeof cardNumberPetugasFix === "string") {
      const cardNumberPetugas = cardNumberPetugasFix.replace(/"/g, "");
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

  useEffect(() => {
    if (cardStatus === "goPayment") {
      setIsEnableStep(false);
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

  useEffect(() => {
    if (statusPaymentCredit) {
      // setCardPaymentProps({
      //   isWaiting: false,
      //   isCreditCard: false,
      //   isPaymentCredit: false,
      //   isPaymentCash: false,
      //   isPrinted: true,
      //   isSuccess: false,
      //   isFailed: false,
      //   isPhoto: false,
      // });
      doSaveRequestVoaPayment(sharedData);
    }
  }, [statusPaymentCredit]);

  const doSaveRequestVoaPayment = async (sharedData) => {
    // console.log("doSaveRequestVoaPayment");
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
    const bodyParam = {
      passportNumber: sharedData.passportData.docNumber,
      expiredDate: sharedData.passportData.formattedExpiryDate,
      fullName: sharedData.passportData.fullName,
      dateOfBirth: sharedData.passportData.formattedBirthDate,
      nationalityCode: sharedData.passportData.nationality,
      sex: sharedData.passportData.sex === "male" ? "M" : "F",
      issuingCountry: sharedData.passportData.issuingState,
      photoFace: sharedData.photoFace ? sharedData.photoFace : `data:image/jpeg;base64,${dataPasporImg.visibleImage}`,
      email: sharedData.email
        ? sharedData.email
        : sharedData.passportData.email,
      postalCode: sharedData.postal_code ? sharedData.postal_code : sharedData.passportData.postal_code,
      paymentMethod: shareDataPaymentProps.paymentMethod,
      cc_no: shareDataPaymentProps.cardNumber.replace(/\s/g, ""),
      cc_exp: shareDataPaymentProps.expiry.replace("/", ""),
      cvv: shareDataPaymentProps.cvv,
      type:
        shareDataPaymentProps.type === "" ? null : shareDataPaymentProps.type,
      token: token,
      key: key,
      deviceId: devicedId.replace(/"/g, ""),
      airportId: airportId.replace(/"/g, ""),
      jenisDeviceId: jenisDeviceId.replace(/"/g, ""),
    };

    setIsEnableStep(false);

    console.log("bodyParam", bodyParam);
  };

  useEffect(() => {
    if (confirm) {
      if (meesageConfirm === "Passport is not from voa country.") {
        const params = {
          code: "email",
          data: "",
        };
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
        // setTimeout(() => {
        //   setDisabled(false);
        //   setCardPaymentProps({
        //     isWaiting: false,
        //     isCreditCard: false,
        //     isPaymentCredit: false,
        //     isPaymentCash: false,
        //     isPrinted: false,
        //     isSuccess: false,
        //     isFailed: false,
        //     isPhoto: false,
        //     isDoRetake: false,
        //   });
        // }, 3000);
      } else if (
        meesageConfirm === "Passport is not active for at least 6 months."
      ) {
        const params = {
          code: "email",
          data: "",
        };
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
        const params = {
          code: "email",
          data: "",
        };
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
        const params = {
          code: "email",
          data: "",
        };
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
          const params = {
            code: "email",
            data: "",
          };
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
          // navigate("/");
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
        const params = {
          code: "email",
          data: "",
        };
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
