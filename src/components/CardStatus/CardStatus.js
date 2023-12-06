// CardStatus.js
import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";
import "./CardStatusStyle.css";

const CardStatus = ({ statusCardBox, sendDataToInput }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Now you can use the captured image source (imageSrc) as needed
    console.log("Captured image source:", imageSrc);
  };

  let imageSource;
  let headerText1, headerText2, headerText3;

  switch (statusCardBox) {
    case "iddle":
      imageSource = Gambar1;
      headerText1 = "Please input your passport";
      headerText2 = "photo page into the reader";
      break;
    case "success":
      imageSource = Gambar2;
      headerText1 = "Passport has successfuly";
      headerText2 = "scanned";
      break;
    case "errorchecksum":
      imageSource = Gambar3;
      headerText1 = "Passport has not successfuly";
      headerText2 = "scanned, Please rescan";
      break;
    case "errorVoa":
      imageSource = Gambar3;
      headerText1 = "Your Country is not eligible";
      headerText2 = "for Apply VOA";
      break;
    case "errorBulan":
      imageSource = Gambar3;
      headerText1 = "Your passport expires in less";
      headerText2 = "than 6 months";
      break;
    case "errorDanger":
      imageSource = Gambar3;
      headerText1 = "Your passport is from danger country";
      headerText2 = "";
      break;
    case "errorIntal":
      imageSource = Gambar3;
      headerText1 = "Your passport is already had staypermit active.";
      headerText2 = "";
      break;
    case "checkData":
      imageSource = Gambar4;
      headerText1 = "Please Check Your Passport Data";
      headerText2 = "tap on checkbox if true";
      headerText3 = "tap on edit icon if you want correct the data";
      break;
    case "lookCamera":
      imageSource = Gambar6;
      headerText1 = "Please look at the camera";
      break;
    case "takePhotoSucces":
      imageSource = Gambar7;
      headerText1 = "Take Photo Succes";
      break;
    case "inputEmail":
      headerText1 = "Please Input Your Email Address";
      headerText2 = "VOA will be send to email";
      break;
    case "emailSucces":
      imageSource = Gambar2;
      headerText1 = "Email Successfull Saved";
      break;
    default:
      imageSource = Gambar1;
  }

  const videoConstraints = {
    width: { min: 120 },
    height: { min: 220 },
    aspectRatio: 0.6666666667,
    // facingMode: "user",
  };

  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">
          {statusCardBox === "inputEmail" ? (
            <>
              <h1 className="card-title">{headerText1}</h1>
              <p>{headerText2}</p>
              <div className="input-email">
                <input type="text" name="email" placeholder="email" />
                <input
                  type="text"
                  name="emailConfirmation"
                  placeholder="email confirmation"
                />
              </div>
              <button type="button" className="ok-button">
                OK
              </button>
            </>
          ) : (
            <>
              {statusCardBox === "checkData" ? (
                <>
                  <h1 className="card-title check-data-title">{headerText1}</h1>
                  <p>{headerText2}</p>
                  <p>{headerText3}</p>
                  <img src={imageSource} alt="" className="card-image" />
                </>
              ) : (
                <>
                  {statusCardBox === "lookCamera" ? (
                    <>
                      <h1 className="card-title">{headerText1}</h1>
                      <div className="webcam-container">
                        <Webcam
                          className="webcam"
                          audio={false}
                          ref={webcamRef}
                          mirrored={true}
                          screenshotFormat="image/jpeg"
                          width={120}
                          height={220}
                          videoConstraints={videoConstraints}
                        />
                        <div className="bounding-box"></div>
                      </div>
                      <button onClick={capture} className="ok-button">
                        Take a face photo
                      </button>
                    </>
                  ) : (
                    <>
                      {statusCardBox === "takePhotoSucces" ? (
                        <>
                          {capturedImage && (
                            <img
                              src={capturedImage}
                              alt="capturedImage"
                              className="card-image"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <h1 className="card-title">
                            {headerText1}
                            <br />
                            {headerText2}
                          </h1>
                          {statusCardBox === "iddle" ? (
                            <>
                              <img
                                src={imageSource}
                                alt=""
                                // onClick={handleImageClick}
                                className="card-image"
                              />
                            </>
                          ) : (
                            <>
                              <img
                                src={imageSource}
                                alt=""
                                className="card-image"
                              />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardStatus;
