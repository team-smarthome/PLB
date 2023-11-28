import React from "react";
import "./BackgroundStyle.css";
import backgroundImage from "../../assets/images/background.png";

const BackgroundPage = () => {
  return (
    <div className="background-page">
      <img
        src={backgroundImage}
        alt="Background"
        className="background-image"
      />
    </div>
  );
};

export default BackgroundPage;
