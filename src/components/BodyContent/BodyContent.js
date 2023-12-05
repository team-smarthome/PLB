import React, { useState } from "react";
import FormData from "../FormData/FormData";
import CardList from "../CardList/CardList";
import CardStatus from "../CardStatus/CardStatus";
import "./BodyContentStyle.css";

const BodyContent = () => {
  const [sharedData, setSharedData] = useState({
    passportData: null,
  });
  const handleDataFromCardStatus = (data) => {
    setSharedData({
      ...sharedData,
      passportData: data,
    });
  };
  return (
    <div className="body-content">
      <div className="left-panel">
        <div className="left-panel-top">
          <CardList />
        </div>
        <div className="left-panel-bottom">
          <CardStatus sendDataToInput={handleDataFromCardStatus} />
        </div>
      </div>
      <div className="right-panel">
        <FormData sharedData={sharedData} setSharedData={setSharedData} />
      </div>
    </div>
  );
};

export default BodyContent;
