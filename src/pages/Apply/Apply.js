import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BodyContent from "../../components/BodyContent/BodyContent";
import "./ApplyStyle.css";

const Apply = () => {
  return (
    <div className="background-apply-voa">
      <Header title="Apply VOA" />
      <BodyContent />
      <Footer
        titleBack="Back"
        titleStep="Next Step"
        isEnableBack={true}
        isEnableStep={true}
      />
    </div>
  );
};

export default Apply;
