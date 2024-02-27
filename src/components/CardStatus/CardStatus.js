import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./CardStatusStyle.css";

import Gambar1 from "../../assets/images/image-1.png";
import Gambar2 from "../../assets/images/image-2.svg";
import Gambar3 from "../../assets/images/image-3.svg";
import Gambar4 from "../../assets/images/image-4.svg";
import Gambar6 from "../../assets/images/image-6.svg";
import Gambar7 from "../../assets/images/image-7.svg";
import Face from "../../assets/images/face2.svg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dataKodePos from "../../utils/dataKodePos";
import { Label } from "flowbite-react";
import Select from "react-select";
import io from "socket.io-client";
const parse = require("mrz").parse;

const CardStatus = ({ statusCardBox, sendDataToInput, sendDataToParent2}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailConfirmation, setEmailConfirmation] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidEmailConfirmation, setIsValidEmailConfirmation] =
    useState(true);
  const [emailConfirmWarning, setEmailConfirmWarning] = useState(false);
  const [postalCodeWarning, setPostalCodeWarning] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const webcamRef = useRef(null);
  const [titleWarning, setTitleWarning] = useState("");
  const navigate = useNavigate();
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [kodePos, setKodePos] = useState("");
  // const [connected, setConnected] = useState(true);

  const kabupatenOptions = dataKodePos.data.map((item) => ({
    value: item.kabupaten,
    label: item.kabupaten,
  }));

  const checkAndHandleTokenExpiration = () => {
    const jwtToken = localStorage.getItem("JwtToken");
    if (!jwtToken) {
      // Token is not present, consider the user as not authenticated
      return false;
    }

    const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    const now = Date.now();
    const isExpired = now > expirationTime;

    return !isExpired;
  };

  // Contoh penggunaan di tempat lain
  const handleTokenExpiration = () => {
    const isTokenValid = checkAndHandleTokenExpiration();

    if (!isTokenValid) {
      // Token has expired, handle the expiration here
      Swal.fire({
        icon: "error",
        text: "Expired JWT Token",
        confirmButtonColor: "#3d5889",
      }).then((result) => {
        // If the user clicks "OK", clear localStorage
        if (result.isConfirmed) {
          navigate("/");
          localStorage.removeItem("user");
          localStorage.removeItem("JwtToken");
          localStorage.removeItem("cardNumberPetugas");
          localStorage.removeItem("key");
          localStorage.removeItem("token");
          localStorage.removeItem("jenisDeviceId");
          localStorage.removeItem("deviceId");
          localStorage.removeItem("airportId");
          localStorage.removeItem("price");
        }
      });
    }
  };

  const capture = () => {
    sendDataToInput({
      statusCardBox: "waiting",
      capturedImage: null,
      emailUser: null,
      titleHeader: "Apply VOA",
      titleFooter: "Next Step",
    })
    const socket = io('http://localhost:4499');

    socket.on('connect', () => {
      // setConnected(true);
      console.log('Terhubung ke server');
    });

    socket.on('snapshot_data', (data) => {
      console.log('base:', data.base64);
      const imageSrc = `data:image/jpeg;base64,${data.base64}`;
      console.log('imageSrc:', imageSrc);
      setCapturedImage(imageSrc);
  
      sendDataToInput({
        statusCardBox: "takePhotoSucces",
        capturedImage: imageSrc,
        emailUser: null,
        titleHeader: "Apply VOA",
        titleFooter: "Next Step",
        statusImage: false
      });
      console.log("Captured Image:", capturedImage);
    });
    const params = {
      code: "take-snapshot",
      data: "",
    };
    socket.emit("WebClientMessage", JSON.stringify(params));

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
    // console.log("Email Input Change:", event.target.value);
    setEmail(event.target.value);
    setEmailWarning(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(event.target.value));
  };

  const handleEmailConfirmationChange = (event) => {
    // console.log("Email Confirmation Input Change:", event.target.value);
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
    } else {
      sendDataToInput({
        statusCardBox: "emailSucces",
        emailUser: email,
        capturedImage: capturedImage,
        titleHeader: "Apply VOA",
        titleFooter: "Next Step",
      });
    }
  };

  const handleKabupatenChange = (selectedOption) => {
    setSelectedKabupaten(selectedOption);
  };

  const handleButtonClickPostalCode = () => {
    if (!selectedKabupaten) {
      setTitleWarning("Please select your city!");
      setPostalCodeWarning(true);
      return;
    } else {
      sendDataToInput({
        statusCardBox: "postalCodeSucces",
        emailUser: email,
        postalCode: kodePos,
        capturedImage: capturedImage,
        titleHeader: "Apply VOA",
        titleFooter: "Payment",
      });
    }
  };

  useEffect(() => {
    // Start Connect to Server Socket.IO
    const socket_IO = io("http://localhost:4499");
    socket_IO.on("connect", () => {
      console.log("Connected to server socket.io");
    });
    

    socket_IO.on("disconnect", () => {
      console.log("Disconnected from server socket.io");
    });

    const handleInputEmail = (data) => {
      try {
        const dataParse = JSON.parse(data);
        // console.log("Received input-email data: ", dataParse);
        const textEmail = dataParse.data;
        setEmail(textEmail);
        setEmailWarning(false);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setIsValidEmail(emailRegex.test(textEmail));
      } catch (error) {
        console.error("Error parsing input-email data:", error);
      }
    };

    const handleInputEmailConfirm = (data) => {
      try {
        const dataParse = JSON.parse(data);
        // console.log("Received input-email-confirm data: ", dataParse);
        const textEmail = dataParse.data;
        setEmailConfirmation(textEmail);
        setEmailConfirmWarning(false);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setIsValidEmailConfirmation(emailRegex.test(textEmail));
      } catch (error) {
        console.error("Error parsing input-email-confirm data:", error);
      }
    };
    

    const handleSubmitEmail = (data) => {
      try {
        const dataParse = JSON.parse(data);
        console.log("Received submit-email data: ", dataParse);

        sendDataToInput({
          statusCardBox: "emailSucces",
          emailUser: email,
          capturedImage: capturedImage,
          titleHeader: "Apply VOA",
          titleFooter: "Next Step",
        });
      } catch (error) {
        console.error("Error parsing submit-email data:", error);
      }
    };

    socket_IO.on("input-email", handleInputEmail);
    socket_IO.on("input-email-confirm", handleInputEmailConfirm);
    socket_IO.on("submit-email", handleSubmitEmail);

    return () => {
      socket_IO.disconnect();
      socket_IO.off("input-email", handleInputEmail);
      socket_IO.off("input-email-confirm", handleInputEmailConfirm);
      socket_IO.off("submit-email", handleSubmitEmail);
    };
  }, [capturedImage, email, sendDataToInput]);

  // useEffect(() => {
  //   if (!connected) {
  //     sendDataToInput({
  //       statusCardBox: "notconnectCamera",
  //       emailUser: null,
  //       capturedImage: null,
  //       titleHeader: "Apply VOA",
  //       titleFooter: "Next Step",
  //     });
  //   }
  // }, [connected, sendDataToInput]);

  useEffect(() => {
    // Cari data kode pos berdasarkan kabupaten yang dipilih
    if (selectedKabupaten) {
      const selectedKabupatenData = dataKodePos.data.find(
        (item) => item.kabupaten === selectedKabupaten.value
      );

      if (selectedKabupatenData) {
        setKodePos(selectedKabupatenData.kode_pos);
      }
    }
  }, [selectedKabupaten]);

  useEffect(() => {
    handleTokenExpiration();
  }, [capturedImage, doRetake, email, emailConfirmation]);

  useEffect(() => {
    console.log('capturedImage berubah:', capturedImage);
  }, [capturedImage]);

  const [inputValue, setInputValue] = useState("PMKORPARK<<JIEUN<<<<<<<<<<<<<<<<<<<<<<<<<<<<\nM472233993KOR8812049F30092442932311V18365920");
  let mrz = ["PMKORPARK<<JIEUN<<<<<<<<<<<<<<<<<<<<<<<<<<<<", "M472233993KOR8812049F30092442932311V18365920"];

  const handleScanedArea = (event) => {
    let text = event.target.value;
    if (text.length > 44) {
      const firstPart = text.substring(0, 44).replace(/\s/g, "");
      const secondPart = text.substring(44).replace(/\s/g, "");
      text = firstPart + "\n" + secondPart;
      mrz = ["PMKORPARK<<JIEUN<<<<<<<<<<<<<<<<<<<<<<<<<<<<", "M472233993KOR8812049F30092442932311V18365920"];
    }
    setInputValue(mrz);
  };


  const [checksum, setCheckSum] = useState(false);
  const handleButtonClickScaned = () => {
    console.log("inputValue: ", inputValue);
    if (mrz[0].length > 44 || mrz[1].length > 44) {
      setCheckSum(true);
    } else if (mrz[0].length === 0 || mrz[1].length === 0) {
      setCheckSum(true);
    }
    try {
      const mrzParsed = parse(mrz);
      console.log("mrz: ", mrzParsed.fields);

      sendDataToParent2(mrzParsed.fields);
      setCheckSum(false);
    } catch (error) {
      console.log(error.message);
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
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            {emailWarning && <div className="warning">{titleWarning}</div>}
            <div className="input-email">
              <input
                style={{ marginTop: "5%" }}
                type="text"
                name="email-confirmation"
                placeholder="Email Confirmation"
                value={emailConfirmation}
                onChange={handleEmailConfirmationChange}
              />
            </div>
            {emailConfirmWarning && (
              <div className="warning">{titleWarning}</div>
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

      case "postalCode":
        return (
          <>
            <h1
              className="card-title"
              style={{
                marginBottom: "8%",
              }}
            >
              Please Input Your City
            </h1>
            <div className="input-postal-code">
              <Select
                value={selectedKabupaten}
                onChange={handleKabupatenChange}
                options={kabupatenOptions}
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    flex: 1,
                    width: "50vh",
                    maxHeight: "30px",
                    borderRadius: "500px",
                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                    fontFamily: "Roboto, Arial, sans-serif",

                    marginBottom: "15%",
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    flex: 1,
                    width: "100%",
                  }),
                  control: (provided) => ({
                    ...provided,
                    flex: 1,
                    width: "100%",
                  }),
                }}
              />
            </div>
            <div className="input-email" style={{ marginBottom: "4%" }}>
              <input
                type="text"
                name="postal-code"
                placeholder="Postal Code"
                value={kodePos}
                readOnly
                disabled
              />
            </div>
            {postalCodeWarning && <div className="warning">{titleWarning}</div>}
            <button
              type="button"
              className="ok-button"
              onClick={handleButtonClickPostalCode}
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
            <div>
          <img src={Face} alt="" className="card-image" style={{backgroundColor: "", margin: 0, width: "150px", height: "150px"}} />
            </div>
            {/* <div className="webcam-container">
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
            </div> */}
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
            {/* <img src={imageSource} alt="" className="card-image" /> */}
            <textarea
              className="areaScan"
              autoFocus
              onChange={handleScanedArea}
              value={inputValue}
            ></textarea>
            {checksum && (
              <span style={{ color: "red", marginTop: "2%" }}>
                Can not empty or Please Re-Scan the Passport
              </span>
            )}
            <button className="ok-button" onClick={handleButtonClickScaned}>
              Confirm
            </button>
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
      case "postalCodeSucces":
        return Gambar2;
      case "errorConnection":
      return Gambar1;
      case "notconnectCamera":
        return Gambar1;
      default:
        return Gambar1;
    }
  };

  const getStatusHeaderText = () => {
    switch (statusCardBox) {
      case "iddle":
        return ["Please Scan your passport"];
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
      case "postalCodeSucces":
        return ["Postal Code Successfully Saved"];
      case "photoNotMatch":
        return ["Face Paspor and", "photo not Match"];
      case "errorConnection":
        return ["Connecting Device", "Please wait..."];
      case "errorWebsocket":
        return ["Error Connecting Device", "Device connection failed"];
      case "notconnectCamera":
        return ["Device Camera is not connected", "Please check the device"];
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
