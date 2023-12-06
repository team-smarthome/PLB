import React, { useState, useEffect } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import "./BodyContentStyle.css";

const BodyContent = ({ tabStatus, cardStatus, dataPrimaryPassport }) => {
  const [sharedData, setSharedData] = useState({
    passportData: null,
  });
  const handleDataFromCardStatus = (data) => {
    console.log("daadadadad: ", data);
    setSharedData({
      ...sharedData,
      passportData: data,
    });
  };

  useEffect(() => {
    setSharedData({ passportData: dataPrimaryPassport });
  }, [dataPrimaryPassport]);

  return (
    <div className="body-content">
      <div className="left-panel">
        <div className="left-panel-top">
          <CardList status={tabStatus} />
        </div>
        <div className="left-panel-bottom">
          <CardStatus
            statusCardBox={cardStatus}
            sendDataToInput={handleDataFromCardStatus}
          />
        </div>
      </div>
      <div className="right-panel">
        <FormData sharedData={sharedData} setSharedData={setSharedData} />
      </div>
    </div>
  );
};

export default BodyContent;
