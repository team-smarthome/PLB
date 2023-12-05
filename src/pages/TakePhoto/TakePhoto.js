import React from "react";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";
import Footer from "../../components/Footer/Footer";
import "./TakePhotoStyle.css";

const TakePhoto = () => {
  return (
    <div className="bg-take-photo">
      <Header title="Apply VOA" />
      <Content />
      <Footer
        titleBack="Back"
        titleStep="Next Step"
        isEnableBack={true}
        isEnableStep={true}
      />
    </div>
  );
};

export default TakePhoto;
