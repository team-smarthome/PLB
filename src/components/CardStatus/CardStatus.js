import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./CardStatusStyle.css";

import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";

const CardStatus = ({ statusCardBox, sendDataToInput }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailConfirmation, setEmailConfirmation] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidEmailConfirmation, setIsValidEmailConfirmation] =
    useState(true);
  const [emailConfirmWarning, setEmailConfirmWarning] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const webcamRef = useRef(null);
  const [titleWarning, setTitleWarning] = useState("");
  
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    sendDataToInput({
      statusCardBox: "takePhotoSucces",
      capturedImage: imageSrc,
      emailUser: null,
      titleHeader: "Apply VOA",
      titleFooter: "Next Step",
    });
  };

  const doRetake = () => {
    sendDataToInput({
      statusCardBox: "lookCamera",
      capturedImage: null,
      emailUser: null,
      titleHeader: "Apply VOA",
      titleFooter: "Next Step",
    });
  };

  const handleEmailChange = (event) => {
    console.log("Email Input Change:", event.target.value);
    setEmail(event.target.value);
    setEmailWarning(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(event.target.value));
  };

  const handleEmailConfirmationChange = (event) => {
    console.log("Email Confirmation Input Change:", event.target.value);
    setEmailConfirmation(event.target.value);
    setEmailConfirmWarning(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmailConfirmation(emailRegex.test(event.target.value)); 
  };

  const handleOkButtonClick = () => {
    if (!email) {
      setTitleWarning("Please enter your email address!");
      setEmailWarning(true);
      return;
    } else if (!emailConfirmation) {
      setTitleWarning("Please enter your email address confirmation!");
      setEmailConfirmWarning(true);
      return;
    } else if (email !== emailConfirmation) {
      setTitleWarning("Email confirmation not match!");
      setEmailConfirmWarning(true);
      return;
    } else if (!isValidEmail) {
      setTitleWarning("Please enter a valid email address!");
      setEmailWarning(true);
      return;
    } else if (!isValidEmailConfirmation) {
      setTitleWarning("Please enter a valid email address confirmation!");
      setEmailConfirmWarning(true);
      return;
    }
    else {
      sendDataToInput({
        statusCardBox: "emailSucces",
        emailUser: email,
        capturedImage: capturedImage,
        titleHeader: "Apply VOA",
        titleFooter: "Payment",
      });
    }
  };

  const renderCardContent = () => {
    switch (statusCardBox) {
      case "inputEmail":
        return (
          <>
            <h1 className="card-title">Please Input Your Email Address</h1>
            <p>VOA will be sent to your email.</p>
            <div className="input-email">
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleEmailChange}
              />
            </div>
            {emailWarning && (
              <div className="warning">{titleWarning}</div>
            )}
            <div className="input-email">
              <input
              style={{marginTop: "5%"}}
                type="text"
                name="email-confirmation"
                placeholder="Email Confirmation"
                onChange={handleEmailConfirmationChange}
              />
            </div>
            {emailConfirmWarning && (
              <div className="warning">
                {titleWarning}
              </div>
            )}
            <button
              type="button"
              className="ok-button"
              onClick={handleOkButtonClick}
            >
              OK
            </button>
          </>
        );

      case "checkData":
        return (
          <>
            <h1 className="card-title check-data-title">
              Please Check Your Passport Data
            </h1>
            <p>Tap on checkbox if true.</p>
            <p>Tap on edit icon if you want to correct the data.</p>
            <img src={Gambar4} alt="" className="card-image" />
          </>
        );

      case "waiting":
        return (
          <>
            <h1 className="card-title check-data-title">Please wait...</h1>
          </>
        );

      case "lookCamera":
        return (
          <>
            <h1 className="card-title">Please look at the camera</h1>
            <div className="webcam-container">
              <Webcam
                className="webcam"
                audio={false}
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                width={120}
                height={220}
                videoConstraints={{
                  width: { min: 120 },
                  height: { min: 220 },
                  aspectRatio: 0.6666666667,
                }}
              />
              <div className="bounding-box"></div>
            </div>
            <button onClick={capture} className="ok-button">
              Take a face photo
            </button>
          </>
        );

      case "takePhotoSucces":
        return (
          <>
            {capturedImage && (
              <div className="container-box-image">
                <h1 className="card-title">Take Photo Success</h1>

                <div className="box-image">
                  <img
                    src={capturedImage}
                    alt="Captured Image"
                    className="potrait-image"
                  />
                </div>
                <button onClick={doRetake} className="retake-button">
                  Retake
                </button>
              </div>
            )}
          </>
        );

      default:
        const imageSource = getImageSource();
        return (
          <>
            <h1 className="card-title">
              {getStatusHeaderText().map((text, index) => (
                <React.Fragment key={index}>
                  {text}
                  <br />
                </React.Fragment>
              ))}
            </h1>
            <img src={imageSource} alt="" className="card-image" />
          </>
        );
    }
  };

  const getImageSource = () => {
    switch (statusCardBox) {
      case "success":
        return Gambar2;
      case "errorchecksum":
      case "errorVoa":
      case "errorBulan":
      case "errorDanger":
      case "errorIntal":
      case "inputEmail":
      case "photoNotMatch":
      case "errorWebsocket":
        return Gambar3;
      case "lookCamera":
        return Gambar6;
      case "takePhotoSucces":
        return Gambar7;
      case "emailSucces":
        return Gambar2;
      case "errorConnection":
        return Gambar1;
      default:
        return Gambar1;
    }
  };

  const getStatusHeaderText = () => {
    switch (statusCardBox) {
      case "iddle":
        return ["Please input your passport", "photo page into the reader"];
      case "success":
        return ["Passport has successfully", "scanned"];
      case "errorchecksum":
        return ["Passport has not successfully", "scanned. Please rescan"];
      case "errorVoa":
        return ["Your Country is not eligible", "for Apply VOA"];
      case "errorBulan":
        return ["Your passport expires in less", "than 6 months"];
      case "errorDanger":
        return ["Your passport is from danger country", ""];
      case "errorIntal":
        return ["Your passport already has an active stay permit.", ""];
      case "inputEmail":
        return ["Please Input Your Email Address", "VOA will be sent to email"];
      case "emailSucces":
        return ["Email Successfully Saved"];
      case "photoNotMatch":
        return ["Face Paspor and", "photo not Match"];
      case "errorConnection":
        return ["Connecting Device", "Please wait..."];
      case "errorWebsocket":
        return ["Error Connecting Device", "Device connection failed"];
      default:
        return [];
    }
  };

  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">{renderCardContent()}</div>
      </div>
    </div>
  );
};

export default CardStatus;
