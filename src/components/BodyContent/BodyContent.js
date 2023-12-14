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
  cardPaymentProps,
  setCardPaymentProps,
  shareDataPaymentProps,
  setShareDataPaymentProps,
  dataNumberPermohonan,
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

  const handleDataFormPaymentStatus = ({
    isConfirm,
    isFailed,
    isPrinted,
    isSuccess,
    paymentMethod,
    cardNumber,
    expiry,
    cvv,
  }) => {
    setCardPaymentProps({
      ...cardPaymentProps,
      isConfirm,
      isFailed,
      isPrinted,
      isSuccess,
    });

    setShareDataPaymentProps({
      ...shareDataPaymentProps,
      paymentMethod,
      cardNumber,
      expiry,
      cvv,
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
              />
            </div>
          </>
        ) : (
          <CardPayment
            {...cardPaymentProps}
            sendDataUpdatePayment={handleDataFormPaymentStatus}
            dataUser={sharedData}
            dataNumberPermohonan={dataNumberPermohonan}
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