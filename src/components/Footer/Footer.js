import React from "react";
import "./FooterStyle.css";

const Footer = ({
  titleBack,
  titleStep,
  isEnableBack,
  isEnableStep,
  btnOnClick_Back,
  btnOnClick_Step,
  isDisabled,
}) => {
  return (
    <footer className="footer">
      <div className="container-footer">
        {isDisabled ? null : (
          <div className="box-footer">
            <div
              className={`bg-back ${!isEnableBack ? "disabled" : ""}`}
              onClick={isEnableBack ? btnOnClick_Back : null}
            >
              <h2 className="text-back">{titleBack}</h2>
            </div>
            <div
              className={`bg-step ${!isEnableStep ? "disabled" : ""}`}
              onClick={isEnableStep ? btnOnClick_Step : null}
            >
              <h2 className="text-step">{titleStep}</h2>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
