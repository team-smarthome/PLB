// CardStatus.js
import React, { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";
import "./CardStatusStyle.css";

const CardStatus = ({ sendDataToInput }) => {
  const [status, setStatus] = useState("iddle");
  const [capturedImage, setCapturedImage] = useState(null); // State untuk menyimpan gambar yang diambil
  const location = useLocation();

  const initialFormData = {
    passport_number: "X123J123",
  };
  const [formdata, setFormData] = useState(initialFormData);

  const handleImageClick = async () => {
    try {
      // Simulate API call
      const response = await axios.get(
        `http://localhost:8080/api/data?passport_number=${formdata.passport_number}`
      );
      const data = response.data;
      console.log(data);
  
      // Pemeriksaan status dari response API
      switch (data.status) {
        case "success":
          setStatus("success");
          // Setelah 5 detik, ubah status menjadi "checkData"
          setTimeout(() => {
            setStatus("checkData");
          }, 5000);
          break;
        case "errorchecksum":
          setStatus("errorchecksum");
          break;
        case "errorVoa":
          setStatus("errorVoa");
          break;
        case "errorBulan":
          setStatus("errorBulan");
          break;
        default:
          // Jika status tidak sesuai dengan yang diharapkan
          console.warn("Unknown status from API response:", data.status);
      }
  
      // Call the function passed from the parent component
      sendDataToInput(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "scanpassport") {
      setStatus("iddle");
    } else if (path === "takephoto") {
      setStatus("takePhotoSucces");
    } else if (path === "inputemail") {
      setStatus("inputEmail");
    }
  }, [location.pathname]);

  let imageSource;
  let headerText1, headerText2, headerText3;

  switch (status) {
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
      headerText1 = "Please Input Your Email Address";  const handleImageClick = async () => {
        try {
          // Simulate API call
          const response = await axios.get(
            `http://localhost:8080/api/data?passport_number=${formdata.passport_number}`
          );
          const data = response.data;
          console.log(data);
    
          // Pemeriksaan status dari response API
          switch (data.status) {
            case "success":
              setStatus("success");
              break;
            case "errorchecksum":
              setStatus("errorchecksum");
              break;
            case "errorVoa":
              setStatus("errorVoa");
              break;
            case "errorBulan":
              setStatus("errorBulan");
              break;
            default:
              // Jika status tidak sesuai dengan yang diharapkan
              console.warn("Unknown status from API response:", data.status);
          }
    
          // Call the function passed from the parent component
          sendDataToInput(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      headerText2 = "VOA will be send to email";
      break;
    case "emailSucces":
      imageSource = Gambar2;
      headerText1 = "Email Successfull Saved";
      break;
    default:
      imageSource = Gambar1;
  }

  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">
          {status === "inputEmail" ? (
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
              {status === "checkData" ? (
                <>
                  <h1 className="card-title check-data-title">{headerText1}</h1>
                  <p>{headerText2}</p>
                  <p>{headerText3}</p>
                  <img src={imageSource} alt="" className="card-image" />
                </>
              ) : (
                <>
                  {status === "lookCamera" ? (
                    <>
                      <h1 className="card-title">{headerText1}</h1>
                      <Webcam
                        className="webcam"
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                      />
                      <button onClick={capture}>Capture photo</button>
                    </>
                  ) : (
                    <>
                      {status === "takePhotoSucces" ? (
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
                          {status === "iddle" ? (
                            <>
                              <img
                                src={imageSource}
                                alt=""
                                onClick={handleImageClick}
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
