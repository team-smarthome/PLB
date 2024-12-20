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
  sendDataToParent1,
  isShowHeader = true,
  country

}) => {
  const [sharedData, setSharedData] = useState({
    passportData: null,
    photoToSend: null,
    photoFace: null,
    email: null,
    city: null,
    postal_code: null,
  });

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

  const receiveDataFromChild = (data) => {
    sendDataToParent1(data);
  };


  const handleDataFormCardPaymentStatus = ({
    ambilImages,
    capturedImages,
    isDoRetake,
    isPhoto,
  }) => {

    setCardPaymentProps({
      ...cardPaymentProps,
      isDoRetake,
      isPhoto,
    });

    setSharedData((prevData) => ({
      ...prevData,
      photoFace: capturedImages,
    }));

    setSharedData((prevData) => ({
      ...prevData,
      photoToSend: ambilImages,
    }));
  };

  const handleDataFormPaymentStatus = ({
    isCreditCard,
    isPaymentCredit,
    isPaymentCash,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isPhoto,
    isDoRetake,
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
      isPhoto,
      isDoRetake,
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
                sendDataToParent2={receiveDataFromChild}
              />
            </div>
          </>
        ) : (
          <CardPayment
            {...cardPaymentProps}
            sendDataUpdatePayment={handleDataFormPaymentStatus}
            sendDataPhotoPayment={handleDataFormCardPaymentStatus}
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
        <FormData cardStatus={cardStatus} sharedData={sharedData} setSharedData={setSharedData} country={country} />
      </div>
    </div>
  );
};

export default BodyContent;