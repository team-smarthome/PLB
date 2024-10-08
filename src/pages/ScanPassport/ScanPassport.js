import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ScanPassportStyle.css";
import Hero from "../../components/hero/Hero";

const ScanPassport = () => {
  return (
    <div className="bg-scan-passport">
      <Header title="Apply PLB" />
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

export default ScanPassport;
