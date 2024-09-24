import React, { useState, useEffect } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import CardPayment from "../CardPayment/CardPayment";
import "./BodyContentValidation.style.css";
import FormDataValidation from "../FormDataValidation/FormDataValidation";
import CardStatusValidation from "../CardStatusValidation/CardStatusValidation";
import CardListValidation from "../CardListValidation/CardListValidation";

const BodyContentValidation = ({
  dataLogs,
  tabStatus,
  setTabStatus,
  setCardStatus,
  setTitleFooter,
  setTitleHeader,
  dataPrimaryPassport,

  isShowHeader = true
}) => {
  const [sharedData, setSharedData] = useState({
    passportData: null,
    photoToSend: null,
    photoFace: null,
    email: null,
    city: null,
    postal_code: null,
  });
  console.log(dataLogs, "dataLogs from body content validation")
  const handleDataFromCardStatus = ({
    statusCardBox,
    ambilImage,
    capturedImage,
    emailUser,
    city,
    postalCode,
    titleHeader,
    titleFooter,
  }) => {
    setSharedData((prevData) => ({
      ...prevData,
      photoToSend: ambilImage,
      photoFace: capturedImage,
      email: emailUser,
      city: city,
      postal_code: postalCode,
    }));

    setTitleHeader(titleHeader);
    setTitleFooter(titleFooter);
    setCardStatus(statusCardBox);
  };


  useEffect(() => {
    setSharedData({ passportData: dataPrimaryPassport });
    // console.log("dataPrimaryPassport", dataPrimaryPassport);
  }, [dataPrimaryPassport]);


  return (
    <div className="body-content">
      <div className="left-panel">
        <>
          <div className="left-panel-top">
            <CardListValidation status={tabStatus} setStatus={setTabStatus} />
          </div>
          <div className="left-panel-bottom">
            <CardStatusValidation
              passportImage={dataLogs?.profile_image}
              status={tabStatus}
            />
          </div>
        </>

      </div>
      <div className="right-panel">
        <FormDataValidation setSharedData={setSharedData} dataLogs={dataLogs} />
      </div>
    </div>
  );
};

export default BodyContentValidation;