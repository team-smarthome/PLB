import React from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import "./TakePhotoStyle.css";

const TakePhoto = () => {
  return (
    <div className="bg-take-photo">
      <Header title="Apply VOA" />
      <Hero />
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
