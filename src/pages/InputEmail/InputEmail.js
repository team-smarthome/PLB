import React from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/hero/Hero";
import Footer from "../../components/Footer/Footer";
import './InputEmailStyle.css';

const InputEmail = () => {
  return (
    <div className="bg-input-email">
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

export default InputEmail;
