import React from "react";
import "./FooterStyle.css";

const Footer = ({ titleBack, titleStep, isEnableBack, isEnableStep }) => {
  const btnOnClick_Back = () => {};

  const btnOnClick_Step = () => {};

  return (
    <footer className="footer">
      <div className="container-footer">
        <div className="box-footer">
          <div className="bg-back" onClick={btnOnClick_Back}>
            <h2 className="text-back">{titleBack}</h2>
          </div>
          <div className="bg-step" onClick={btnOnClick_Step}>
            <h2 className="text-step">{titleStep}</h2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
