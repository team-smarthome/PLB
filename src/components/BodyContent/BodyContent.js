import React, { useState, useEffect } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import CardPayment from "../CardPayment/CardPayment";
import "./BodyContentStyle.css";

const BodyContent = ({
  tabStatus,
  cardStatus,
  setCardStatus,
  setTitleFooter,
  setTitleHeader,
  dataPrimaryPassport,
  updateSharedData,
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

  useEffect(() => {
    console.log("sharedData: ", sharedData);
    updateSharedData(sharedData);
  }, [sharedData]);

  useEffect(() => {
    setSharedData({ passportData: dataPrimaryPassport });
  }, [dataPrimaryPassport]);

  const cardPaymentProps = {
    isConfirm: false,
    isPrinted: false,
    isSuccess: false,
    isFailed: true,
  };

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
          <CardPayment {...cardPaymentProps} />
        )}
      </div>
      <div className="right-panel">
        <FormData sharedData={sharedData} setSharedData={setSharedData} />
      </div>
    </div>
  );
};

export default BodyContent;
