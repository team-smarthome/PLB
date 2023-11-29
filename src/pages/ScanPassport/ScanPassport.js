import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ScanPassportStyle.css";
import Hero from "../../components/hero/Hero";

const ScanPassport = () => {
  return (
    <div className="bg-scan-passport">
      <Header title="Apply VOA" />
      {/* <div className="content-scan-passport">
        <div className="header-scan-passport"></div>
        <div className="body-scan-passport"></div>
        <div className="footer-scan-passport"></div>
      </div> */}
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
