import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import dataPaspor from "../../utils/dataPaspor";
import dataPhotoPaspor from "../../utils/dataPhotoPaspor";
import { apiValidationPassport, apiSimpanPermohonan } from "../../services/api";
import "./ApplyStyle.css";

const Apply = () => {
  const navigate = useNavigate();
  const [validationPerformed, setValidationPerformed] = useState(false);
  const [isEnableBack, setIsEnableBack] = useState(true);
  const [isEnableStep, setIsEnableStep] = useState(false);
  const [tabStatus, setTabStatus] = useState(0);
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

  useEffect(() => {
    let fullName = dataPaspor.foreName + " " + dataPaspor.surName;
    const [day, month, year] = dataPaspor.birthDate.split("-").map(Number);
    const [day1, month1, year1] = dataPaspor.expiryDate.split("-").map(Number);

    const adjustedYear = year < 50 ? 2000 + year : 1900 + year;

    const formattedDate = new Date(adjustedYear, month - 1, day + 1)
      .toISOString()
      .split("T")[0];
    const expiryDate = new Date(year1, month1 - 1, day1 + 1)
      .toISOString()
      .split("T")[0];

    dataPaspor.fullName = fullName;
    dataPaspor.formattedBirthDate = formattedDate;
    dataPaspor.formattedExpiryDate = expiryDate;

    setDataPrimaryPassport(dataPaspor);
    setDataPhotoPassport(dataPhotoPaspor);

    if (!validationPerformed) {
      doCheckValidationPassport(dataPaspor, dataPhotoPaspor);

      setValidationPerformed(true);
    }
  }, [validationPerformed]);

  const doCheckValidationPassport = async (dataPaspor, dataPhotoPaspor) => {
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

      if (data.data.is_valid === true && data.code === 200) {
        setCardStatus("success");

        setTimeout(() => {
          setCardStatus("checkData");
          setIsEnableStep(true);
          setIsEnableBack(false);
        }, 5000);
      } else {
        const messageError = data.message;

        if (messageError === "Passport is not from voa country.") {
          setCardStatus("errorVoa");
        } else if (
          messageError === "Passport is not active for at least 6 months."
        ) {
          setCardStatus("errorBulan");
        } else if (messageError === "Passport is from danger country.") {
          setCardStatus("errorDanger");
        } else if (
          messageError === "Passport is already had staypermit active."
        ) {
          setCardStatus("errorIntal");
        }
      }
    } catch (err) {
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
        setTabStatus(1);
      } else if (cardStatus === "takePhotoSucces") {
        setCardStatus("inputEmail");
        setTabStatus(2);
      } else if (titleFooter === "Payment") {
        console.log("sharedData: ", sharedData);
        doSaveRequestVoaUser(sharedData);
      }
    }
  };

  const doSaveRequestVoaUser = async (sharedData) => {
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
      postalCode: "14130",
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
