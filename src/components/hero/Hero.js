import React, { useState } from "react";
import './HeroStyle.css'
import Input from "../input/Input";
import List from "../list/List";
import CardStatus from "../CardStatus/CardStatus";

const Hero = () => {
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
    <div className="hero">
      <div className="container-hero">
        <div className="list"><List /></div>
        <div className="card">
          <CardStatus sendDataToInput={handleDataFromCardStatus} />
        </div>
      </div>
      <div className="form">
        <Input sharedData={sharedData} setSharedData={setSharedData}/>
      </div>
    </div>
  );
};

export default Hero;
