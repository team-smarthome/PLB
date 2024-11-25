import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import { useAtom } from "jotai";
import dataPasporImg from "../../utils/dataPhotoPaspor";
import "./ApplyStyle.css";
import Swal from "sweetalert2";
import { Toast } from "../../components/Toast/Toast";
import { formData, resultDataScan, caputedImageAfter, ImageDocumentPLB, DataHasilCekal, LanjutSendData } from "../../utils/atomStates";
import { useNavigate } from "react-router-dom";
import { imageToSend } from "../../utils/atomStates";
import { apiInsertDataUser, GetDataCheckCekal, getAllNegaraData } from "../../services/api";
import { initiateSocket4010, addPendingRequest4010 } from "../../utils/socket";
import Cookies from 'js-cookie';
import { ipAddressServer } from "../../services/env";
import { LogoutComponent } from "../../utils/logout";

const Apply = () => {
  const socketRef = useRef(null);
  const socket_IO_4010 = initiateSocket4010();
  const [, setFormData] = useAtom(formData);
  const [_, setDataCekal] = useAtom(DataHasilCekal);
  const [image] = useAtom(imageToSend);
  const navigate = useNavigate();
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(true);
  const [skorKemiripan, setSkorKemiripan] = useState(0)
  const [tabStatus, setTabStatus] = useState(1);
  const [cardStatus, setCardStatus] = useState("iddle");
  const [dataPrimaryPassport, setDataPrimaryPassport] = useState(null);
  const [cardNumberPetugas, setCardNumberPetugas] = useState("");
  const [sharedData, setSharedData] = useState(null);
  const [statusPaymentCredit, setStatusPaymentCredit] = useState(false);
  const [titleHeader, setTitleHeader] = useState("Registrasi Pas Lintas Batas");
  const [titleFooter, setTitleFooter] = useState("Lanjut");
  const [dataPermohonan, setDataPermohonan] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [meesageConfirm, setMessageConfirm] = useState(
    "Network / Card error / declined dll"
  );
  const ipServer = ipAddressServer;
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

  const [country, setCountry] = useState([])

  const [sharedData2, setSharedData2] = useState(null);

  let loginDataArray = [];

  let isCloseTimeoutSet = false;

  // const [lanjutKirimData] = useAtom(LanjutSendData);
  const [lanjutKirimData, setLanjutKirimData] = useAtom(LanjutSendData);



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
        // noRegister: data.NoRegister,
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

      const dataHardCodePaspor = newDataPassport;

      let fullName =
        dataHardCodePaspor.foreName + " " + dataHardCodePaspor.surName;

      dataHardCodePaspor.fullName = fullName;

      function formatDate(dateString) {
        if (!dateString || dateString.length !== 6) return null;
        var year = dateString.substring(0, 2);
        var month = dateString.substring(2, 4);
        var day = dateString.substring(4, 6);

        const currentYear = new Date().getFullYear();

        year = parseInt(year) <= currentYear % 100 ? "20" + year : "19" + year;

        // Kembalikan tanggal dalam format yang diinginkan
        return year + "-" + month + "-" + day;
      }

      function formatDateExpiry(dateString) {
        if (!dateString || dateString.length !== 6) return null;
        var year = dateString.substring(0, 2);
        var month = dateString.substring(2, 4);
        var day = dateString.substring(4, 6);
        year = parseInt(year) < 50 ? "20" + year : "19" + year;

        return year + "-" + month + "-" + day;
      }

      dataHardCodePaspor.formattedExpiryDate = formatDateExpiry(
        dataHardCodePaspor.expiryDate
      );
      dataHardCodePaspor.formattedBirthDate = formatDate(
        dataHardCodePaspor.birthDate
      );
      dataHardCodePaspor.email = dataHardCodePaspor.email
        ? dataHardCodePaspor.email
        : "";
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

  useEffect(() => {
    if (lanjutKirimData) {
      console.log('apakahLanjutKesini12345')
      sendDataTOKameraServer(sharedData);
      setLanjutKirimData(false);
    }
  }, [lanjutKirimData]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllNegaraData();
        if (response.data.status === 200) {
          setCountry(response?.data?.data.map(item => ({
            value: item.nama_negara,
            label: item.nama_negara
          })))
        } else {
        }
      } catch (error) {
        console.error("Error fetching negara data:", error.message);
      }
    };

    fetchData();

  }, []);

  const updateStatusPaymentCredit = (newstatusPaymentCredit) => {
    setStatusPaymentCredit(newstatusPaymentCredit);
  };

  const updateStatusConfirm = (newStatusConfirm) => {
    setConfirm(newStatusConfirm);
  };

  const updateSharedData = (newSharedData) => {
    setSharedData(newSharedData);
  };
  const [resDataScan, setResDataScan] = useAtom(ImageDocumentPLB)
  const [caputedImageAfter2, setCaputedImageAfter2] = useAtom(caputedImageAfter)
  const btnOnClick_Back = () => {
    setResDataScan("")
    navigate('/home')


    if (isEnableBack) {
      console.log("cardStatusSaatIni", cardStatus);
      if (cardPaymentProps.isPaymentCredit || cardPaymentProps.isPaymentCash) {
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

  useEffect(() => {
    if (cardStatus === 'takePhotoSucces') {
      setTitleFooter('Check Cekal')
    }
  }, [cardStatus])

  const btnOnClick_Step = () => {

    if (isEnableStep) {
      if (cardStatus === "checkData" || cardStatus === "iddle" || cardStatus === "getDocumentSucces") {
        // doSaveRequestVoaPayment(sharedData);
        // setTitleFooter("Check Cekal");
        const dataChecked = sharedData?.passportData;
        // console.log("dataChecked", dataChecked);


        if (dataChecked === null || dataChecked === "") {
          Swal.fire({
            icon: "error",
            title: "Data Masih Kosong",
            text: "Silahkan periksa kembali data anda",
            confirmButtonColor: "#3d5889",
          });
        }
        else if (
          isEmptyOrNull(dataChecked.docNumber) || !hasProperty(dataChecked, "docNumber") ||
          isEmptyOrNull(dataChecked.fullName) || !hasProperty(dataChecked, "fullName") ||
          isEmptyOrNull(dataChecked.formattedBirthDate) || !hasProperty(dataChecked, "formattedBirthDate") ||
          isEmptyOrNull(dataChecked.sex) || !hasProperty(dataChecked, "sex") ||
          isEmptyOrNull(dataChecked.nationality) || !hasProperty(dataChecked, "nationality")
        ) {
          Swal.fire({
            icon: "error",
            title: "Masih ada data yang kosong",
            text: "Silahkan periksa kembali data anda",
            confirmButtonColor: "#3d5889",
          });
        }
        else {
          setCardStatus("lookCamera");
          setTabStatus(2);
        }
      } else if (cardStatus === "takePhotoSucces") {
        setFormData(sharedData);
        setDataPermohonan(sharedData);
        doSaveRequestVoaPayment(sharedData);
        setTitleFooter("Check Cekal");

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
          setCaputedImageAfter2(null);
          setRecievedTempData([]);
          setDataPrimaryPassport(null);
          setSharedData(null);
          setDataPermohonan(null);
          setSharedData2(null);
          setStatusPaymentCredit(false);
          setDataCekal([]);
          setCardStatus("iddle");
          setSkorKemiripan(0);
          setCaputedImageAfter2("")
          setObjectApi(null)
          setObjectCamera(null)
        }, 3000);
      } else if (titleFooter === "Payment" && cardPaymentProps.isDoRetake) {
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

  useEffect(() => {
    const cardNumberPetugasFix = 11 + localStorage.getItem("cardNumberPetugas");
    // Periksa apakah cardNumberPetugasFix adalah string sebelum melakukan replace
    if (typeof cardNumberPetugasFix === "string") {
      const cardNumberPetugas = cardNumberPetugasFix.replace(/"/g, "");
      setCardNumberPetugas(cardNumberPetugas);
    }
  }, []);


  useEffect(() => {
    socket_IO_4010.on("DataIPCamera", (data) => {
      setIpKamera(data.ipCamera);
    });
    socket_IO_4010.on("responseSendDataUser", (data) => {
      if (data === "Successfully") {
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
            console.error("Error:", error);
          }
        }).catch((error) => {
          Toast.fire({
            icon: "error",
            title: "Gagal mengirim data",
          });
          setCaputedImageAfter2(sharedData?.photoFace)
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
        });
      } else {
        Toast.fire({
          icon: "error",
          title: data,
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


  const formatBirthDateCekal = (formattedBirthDate) => {

    const dateParts = formattedBirthDate.split("-");
    const reformattedDate = dateParts.join("");
    return reformattedDate;
  };


  const formatToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const handleFormatDate = (params) => {
    const result = formatToYYYYMMDD(params);
    return result;
  };

  const sendDataTOKameraServer = async (sharedData) => {
    try {
      const getDataUser123 = Cookies.get('userdata');
      const parsedDataUser123 = JSON.parse(getDataUser123);

      console.log("sharedData1234", sharedData);
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

      setCaputedImageAfter2(sharedData.photoFace);

      const bodyParamsSendKamera = {
        method: "addfaceinfonotify",
        params: {
          data: [
            {
              personId: sharedData.passportData.docNumber,
              personNum: sharedData.passportData.docNumber,
              passStrategyId: "",
              personIDType: 1,
              personName: sharedData.passportData.fullName,
              personGender: sharedData.passportData.sex === "male" ? 1 : 0,
              validStartTime: Math.floor(new Date().getTime() / 1000 - 86400).toString(),
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
      };

      const dataTosendAPI = {
        no_passport: sharedData.passportData.docNumber,
        name: sharedData.passportData.fullName,
        date_of_birth: sharedData.passportData.formattedBirthDate,
        gender: sharedData.passportData.sex === "male" ? "M" : "F",
        nationality: sharedData.passportData.nationality,
        expired_date: `${sharedData.passportData.formattedExpiryDate}`,
        arrival_time: new Date(),
        destination_location: sharedData.passportData.destination_location,
        profile_image: sharedData.photoFace ? sharedData.photoFace : "",
        photo_passport: resDataScan ? `data:image/jpeg;base64,${resDataScan}` : "",
        petugas_id: parsedDataUser123.nip,
        tpi_id: parsedDataUser123.tpi_id,
        nama_tpi: parsedDataUser123.nama_tpi,
        is_cekal: skorKemiripan > 0 ? true : false,
        skor_kemiripan: skorKemiripan ? skorKemiripan : 0,
      };

      setObjectApi(dataTosendAPI);
      setObjectCamera(bodyParamsSendKamera);
      console.log(bodyParamsSendKamera, 'bodyParamsSendKamera')
      console.log("DataYNAAPIDIKIRIM", dataTosendAPI);
      console.log("sharedDataTOSEndAPi", sharedData);

      if (socket_IO_4010.connected) {
        console.log("testWebsocket4010 connected");
        socket_IO_4010.emit("sendDataUser", { bodyParamsSendKamera });
      } else {
        console.log("testWebsocket4010 not connected");
        addPendingRequest4010({ action: "sendDataUser", data: { bodyParamsSendKamera } });
        socket_IO_4010.connect();
      }

      console.log("nilaiBodyParamsSendKamera", bodyParamsSendKamera);
      setIsEnableStep(false);
    } catch (error) {
      setDisabled(false);
      setIsEnableStep(true);
      setCardStatus('takePhotoSucces');
      console.error("An error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Maaf, terjadi kesalahan saat memproses data. Silakan coba lagi.",
        confirmButtonColor: "#3d5889",
      });
    }
  };


  const doSaveRequestVoaPayment = async (sharedData) => {
    console.log("sharedDataType", typeof sharedData);
    setSharedData2(sharedData);
    try {
      console.log("masuksini2");
      setCardStatus("waiting");

      const getDataUser = Cookies.get('userdata');

      if (getDataUser === undefined || getDataUser === null) {
        await Swal.fire({
          icon: "error",
          title: "Sesi Login Anda Telah Berakhir",
          text: "Silahkan Login Kembali",
          showConfirmButton: false,
          timer: 2000
        });

        setTimeout(() => {
          LogoutComponent();
        }, 2000);

        return;
      }

      const parsedDataUser = JSON.parse(getDataUser);
      const version = localStorage.getItem("version") || "1.0.0";

      const DataCekCekal = {
        nip: parsedDataUser.nip,
        nama_lengkap: sharedData.passportData.fullName.toUpperCase(),
        tanggal_lahir: formatBirthDateCekal(sharedData.passportData.formattedBirthDate),
        kode_jenis_kelamin: sharedData.passportData.sex === "male" ? "M" : "F",
        kode_kewarganegaraan: sharedData.passportData.nationality?.toUpperCase() === "INDONESIA" ? "IDN" : "PNG",
        nomor_dokumen_perjalanan: sharedData.passportData.docNumber,
        tanggal_habis_berlaku_dokumen_perjalanan: handleFormatDate(sharedData.passportData.formattedExpiryDate),
        kode_negara_penerbit_dokumen_perjalanan: sharedData.passportData.nationality?.toUpperCase() === "INDONESIA" ? "IDN" : "PNG",
        arah_perlintasan: sharedData.passportData.nationality?.toUpperCase() === "INDONESIA" ? "O" : "I",
        apk_version: `versi ${version}`,
        ip_address_client: ipAddressServer,
        port_id: parsedDataUser.tpi_id,
        user_nip: parsedDataUser.nip,
        user_full_name: parsedDataUser?.petugas?.nama_petugas,
      }

      console.log("DataCekCekal", DataCekCekal);

      const CheckCekal = await GetDataCheckCekal(DataCekCekal);
      if (CheckCekal.data?.response_code === "25") {
        await sendDataTOKameraServer(sharedData);
      } else if (CheckCekal.data?.response_code === "00") {
        if (CheckCekal.data?.data.length > 0) {
          setDataCekal(CheckCekal.data?.data?.[0]);
          setCardStatus("kenaCekal");
          setSkorKemiripan(CheckCekal.data?.data?.[0]?.skor_kemiripan ? CheckCekal.data?.data?.[0]?.skor_kemiripan : 0);
        } else {
          await sendDataTOKameraServer(sharedData);
        }
      }
    } catch (error) {
      // console.log("error", error);
      await sendDataTOKameraServer(sharedData);
      // setCardStatus("takePhotoSucces");
      // Toast.fire({
      //  icon: "error",
      //  title: "Gagal Melakukan Cek Cekal",
      // });
    }
  };


  return (
    <div className="background-apply-voa">
      <Header title={titleHeader} />
      <BodyContent
        country={country}
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
        titleBack="Kembali"
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
