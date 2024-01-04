import React, { useState, useEffect } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import CardPayment from "../CardPayment/CardPayment";
import "./BodyContentStyle.css";

const BodyContent = ({
  cardNumberPetugas,
  tabStatus,
  cardStatus,
  setCardStatus,
  setTitleFooter,
  setTitleHeader,
  dataPrimaryPassport,
  updateSharedData,
  onStatusChange,
  onStatusConfirm,
  cardPaymentProps,
  setCardPaymentProps,
  shareDataPaymentProps,
  setShareDataPaymentProps,
  dataNumberPermohonan,
  FailedMessage,
}) => {
  const [sharedData, setSharedData] = useState({
    passportData: null,
    photoFace: null,
    email: null,
  });

  const handleDataFromCardStatus = ({
    statusCardBox,
    capturedImage,
    emailUser,
    titleHeader,
    titleFooter,
  }) => {
    setSharedData((prevData) => ({
      ...prevData,
      photoFace: capturedImage,
      email: emailUser,
    }));

    setTitleHeader(titleHeader);
    setTitleFooter(titleFooter);
    setCardStatus(statusCardBox);
  };

  //useeffect apakah dataNumberPermohonan ada isinya atau tidak
  useEffect(() => {
    if (dataNumberPermohonan) {
      console.log("masuk oiii", dataNumberPermohonan);
    }
  }, [dataNumberPermohonan]);


  const handleDataFormPaymentStatus = ({
    isCreditCard,
    isPaymentCredit,
    isPaymentCash,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isPyamentUrl,
    paymentMethod,
    cardNumber,
    expiry,
    cvv,
    type,
  }) => {
    setCardPaymentProps({
      ...cardPaymentProps,
      isCreditCard,
      isPaymentCredit,
      isPaymentCash,
      isWaiting,
      isFailed,
      isPrinted,
      isSuccess,
      isPyamentUrl,
    });

    setShareDataPaymentProps({
      ...shareDataPaymentProps,
      paymentMethod,
      cardNumber,
      expiry,
      cvv,
      type
    });
  };

  useEffect(() => {
    updateSharedData(sharedData);
  }, [sharedData]);

  useEffect(() => {
    setSharedData({ passportData: dataPrimaryPassport });
  }, [dataPrimaryPassport]);

  //useEffect failedPesan
  useEffect(() => {
    if (FailedMessage) {
      console.log("FailedMessage", FailedMessage);
    }
  }, [FailedMessage]);

  return (
    <div className="body-content">
      <div className="left-panel">
        {cardStatus !== "goPayment" ? (
          <>
            <div className="left-panel-top">
              <CardList status={tabStatus} />
            </div>
            <div className="left-panel-bottom">
              <CardStatus
                statusCardBox={cardStatus}
                sendDataToInput={handleDataFromCardStatus}
              />
            </div>
          </>
        ) : (
          <CardPayment
            {...cardPaymentProps}
            sendDataUpdatePayment={handleDataFormPaymentStatus}
            dataUser={sharedData}
            dataNumberPermohonan={dataNumberPermohonan}
            FailedPesan={FailedMessage}
            onStatusChange={onStatusChange}
            onStatusConfirm={onStatusConfirm}
            cardNumberPetugas={cardNumberPetugas}
          />
        )}
      </div>
      <div className="right-panel">
        <FormData cardStatus={cardStatus} sharedData={sharedData} setSharedData={setSharedData} />
      </div>
    </div>
  );
};

export default BodyContent;