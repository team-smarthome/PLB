import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Toast } from "../../components/Toast/Toast";
import Select from "react-select";
import axios from "axios";
import { url_dev } from "../../services/env";
import Printer from "../../components/Printer/Printer";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Face from '../../assets/images/face.png'

const Information = () => {
  const navigate = useNavigate();
  const [newWifiResults, setNewWifiResults] = useState("");
  const [lookCamera, setLookCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picture, setGambar] = useState("");
  const [success, setSuccess] = useState(false);
  const [testCardReader, setTestCardReader] = useState(false);
  const [hover, setHover] = useState(false);
  const [ipCamera, setIpCamera] = useState("");
  const [statusCardReader, setStatusCardReader] = useState("OFF");
  const [statusCamera, setStatusCamera] = useState("OFF");
  const [deviceNoCamera, setDeviceNoCamera] = useState("");
  const [hoverBackToApply, setHoverBackToApply] = useState(false);
  const [hoverTestCardReader, setHoverTestCardReader] = useState(false);
  const [hoverTestPrinter, setHoverTestPrinter] = useState(false);
  const [hoverTestCamera, setHoverTestCamera] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [type, setType] = useState("");
  const [optionCreditTypes, setOptionCreditTypes] = useState([]);
  const [isCheckedType, setIsCheckedType] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    axios
      .get(`${url_dev}TypeCard.php`)
      .then((res) => {
        const responseData = res.data;

        if (
          responseData &&
          responseData.status === 200 &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          const creditTypes = responseData.data.map((item) => {
            return {
              value: item.value,
              label: item.label,
            };
          });

          setOptionCreditTypes(creditTypes);
        } else {
          // console.error("Invalid or unexpected API response format");
        }
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const socketIO = io("http://localhost:4499");
    socketIO.on("getIpAddress", (newWifiResults) => {
      console.log("New IP address:", newWifiResults);
      setNewWifiResults(newWifiResults.ipAddressV4);
      setStatusCardReader("ON");
    });
    return () => {
      socketIO.disconnect();
    };
  }, []);

  useEffect(() => {
    const socketCamera = io("http://localhost:4498");
    socketCamera.on("cameraDataToClient", (data) => {
      console.log("cameraDataToClient:", data);
      setIpCamera(data.ipServerCamera);
      setDeviceNoCamera(data.deviceNumber);
    });

    socketCamera.on("cameraStatus", (data) => {
      console.log("cameraStatus:", data);
      setStatusCamera(data.status);
    });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const testcamera = () => {
    if (loading || success) {
      return;
    }
    setLookCamera((prevState) => !prevState);
  };

  const handleExpiryChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setExpiry((prevExpiry) => {
        const formattedInput = input
          .replace(/(\d{2})(\d{0,2})/, "$1/$2")
          .replace(/(\/\d{2})\d+?$/, "$1");

        if (/^\d{0,2}\/?\d{0,2}$/.test(formattedInput)) {
          return formattedInput;
        } else {
          return prevExpiry;
        }
      });
    }
  };

  const capture = () => {
    const socket = io("http://localhost:4498");
    const params = {
      code: "take-snapshot",
      data: "",
    };
    setLoading(true);

    socket.emit("WebClientMessage", JSON.stringify(params));

    const timeout = setTimeout(() => {
      setLoading(false);
      setLookCamera(true);
      Toast.fire({
        icon: "error",
        title: "Failed to capture image",
      });
    }, 4000);

    socket.on("snapshot_data", (data) => {
      clearTimeout(timeout);
      setLoading(false);
      setLookCamera(false);
      setSuccess(true);
      const imageSrc = `data:image/jpeg;base64,${data.base64}`;
      setGambar(imageSrc);
      console.log("imageSrc:", imageSrc);
    });

    socket.on("not-found-directory", () => {
      clearTimeout(timeout);
      setLoading(false);
      setLookCamera(true);
      Toast.fire({
        icon: "error",
        title: "Error determining directory",
      });
    });

    socket.on("gagal_snapshot", () => {
      clearTimeout(timeout);
      setLoading(false);
      setLookCamera(true);
      Toast.fire({
        icon: "error",
        title: "Failed to capture image",
      });
    });
  };

  const doRetake = () => {
    setSuccess(false);
    setLookCamera(true);
    setGambar("");
  };

  const CardReader = () => {
    // setTestCardReader(true);
    setTestCardReader((prevState) => !prevState);
    setLoading(false);
    setSuccess(false);
    setLookCamera(false);
  };

  const btnOnClick_Apply = () => {
    navigate("/home");
  };

  const handleSubmit = (event) => {
    Toast.fire({
      icon: "success",
      title: "Data saved successfully",
    });
    event.preventDefault(); // Prevent default form submission behavior

    const socket = io("http://localhost:4498");

    // Create data object
    const data = {
      ipServerPc: newWifiResults,
      ipServerCamera: ipCamera,
      deviceNoCamera: deviceNoCamera,
    };

    // Emit data over socket
    socket.emit("saveCameraData", data);
    setTimeout(() => {
      window.location.reload();
      // setStatusCamera("ON");
    }, 2000);
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 16) {
      setCardNumber(
        input
          .match(/.{1,4}/g)
          ?.join(" ")
          .substring(0, 19)
      );
    }
  };

  return (
    <div className="bg-home">
      <div className="content-home">
        <div
          style={{
            display: "flex",
            gap: "20%",
            width: "60%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: loading || lookCamera || success ? "" : "#acacac",
            marginTop: "-120px",
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  width: "180vh",
                  height: "70vh",
                  borderRadius: "3%",
                }}
              >
                <h1
                  className="card-title"
                  style={{ paddingTop: "30%", fontSize: "35px" }}
                >
                  Please wait...
                </h1>
                <div style={{ height: "200px" }}></div>
              </div>
            </>
          ) : lookCamera ? (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  width: "130vh",
                  height: "70vh",
                  borderRadius: "3%",
                }}
              >
                <h1 className="card-title" style={{ paddingTop: "5%" }}>
                  Please look at the camera
                </h1>
                <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={Face} alt="wajah"
                  style={{
                    width: "30%",
                  }}
                />
                </div>
          
                <button
                  onClick={capture}
                  className="ok-button"
                  style={{ marginLeft: "29%", marginBottom: "5%" }}
                >
                  Take a face photo
                </button>
              </div>
            </>
          ) : success ? (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  width: "120vh",
                  height: "70vh",
                  borderRadius: "3%",
                }}
              >
                <h1 className="card-title" style={{ paddingTop: "5%" }}>
                  Success Capture
                </h1>
                <div
                  style={{
                    height: "280px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    style={{ width: "60%", height: "100%", borderRadius: "5%" }}
                    src={picture}
                    alt="Captured Image"
                  />
                </div>
                <button
                  onClick={doRetake}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  className="ok-button"
                  style={{
                    marginLeft: "29%",
                    marginBottom: "5%",
                    backgroundColor: hover ? "#fbaf17" : "red",
                  }}
                >
                  Do Retake
                </button>
              </div>
            </>
          ) : testCardReader ? (
            <>
              <form
                className="payment-credit-cardCC"
                style={{
                  width: "150vh",
                  height: "45vh",
                }}
              >
                <div>
                  <div className="credit-card-payment2">
                    <div className="credit-card-payment3">
                      <p>Card Number</p>
                      <p>Expired</p>
                      <p>CVV</p>
                    </div>
                    <div className="credit-card-payment4">
                      <div className="credit-card-value10">
                        <div className="credit-card-value10X">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                          />
                        </div>
                        <div className="credit-card-value10Y">
                          <Select
                            id="creditType"
                            value={
                              type
                                ? optionCreditTypes.find(
                                    (option) => option.value === type
                                  )
                                : ""
                            }
                            onChange={(selectedOption) =>
                              setType(selectedOption.value)
                            }
                            isDisabled={isCheckedType}
                            options={optionCreditTypes}
                            className="basic-single"
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                flex: 1,
                                width: "26vh",
                                borderRadius: "10px",
                                backgroundColor: "rgba(217, 217, 217, 0.75)",
                                fontFamily: "Roboto, Arial, sans-serif",
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
                                backgroundColor: "rgba(217, 217, 217, 0.75)",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="credit-card-value2">
                        <input
                          type="text"
                          // value="12/25"
                          value={expiry}
                          onChange={handleExpiryChange}
                        />
                      </div>
                      <div className="credit-card-value3">
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="confirm-payment-credit">
                    <div className="confirm-payment-credit2">
                      <div className="form-group-payment-submit2">
                        <button type="submit">Confirm</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <form
                className="full-width-form"
                onSubmit={handleSubmit}
                style={{
                  width: "120vh",
                }}
              >
                <div className="form-group">
                  <div className="wrapper-form">
                    <div className="wrapper-input">
                      <label htmlFor="ip_server_pc">IP Server PC</label>
                    </div>
                    <input
                      type="text"
                      name="ipServerPC"
                      id="ipServerPC"
                      className={newWifiResults ? "disabled-input" : ""}
                      value={newWifiResults}
                    />
                    <div className="checkbox-container2">
                      {newWifiResults && (
                        <div className="checkbox-value2"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="wrapper-form">
                    <div className="wrapper-input">
                      <label htmlFor="ip_server_camera">IP Server Camera</label>
                    </div>
                    <input
                      type="text"
                      name="ipServerCamera"
                      id="ipServerCamera"
                      className="disabled-input"
                      onChange={(e) => setIpCamera(e.target.value)}
                      value={ipCamera}
                    />
                    <div className="checkbox-container2">
                      {ipCamera && <div className="checkbox-value2"></div>}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="wrapper-form">
                    <div className="wrapper-input">
                      <label htmlFor="status_card_reader">
                        Status Card Reader
                      </label>
                    </div>
                    <input
                      type="text"
                      name="statusCardReader"
                      id="statusCardReader"
                      className="disabled-input"
                      onChange={(e) => setStatusCardReader(e.target.value)}
                      value={statusCardReader}
                    />
                    <div className="checkbox-container2">
                      {statusCardReader === "ON" && (
                        <div className="checkbox-value2"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="wrapper-form">
                    <div className="wrapper-input">
                      <label htmlFor="status_camera">Status Camera</label>
                    </div>
                    <input
                      type="text"
                      name="statusCamera"
                      id="statusCamera"
                      className="disabled-input"
                      onChange={(e) => setStatusCamera(e.target.value)}
                      value={statusCamera}
                    />
                    <div className="checkbox-container2">
                      {statusCamera === "ON" && (
                        <div className="checkbox-value2"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="wrapper-form">
                    <div className="wrapper-input">
                      <label htmlFor="device_no_camera">Device No Camera</label>
                    </div>
                    <input
                      type="text"
                      name="deviceNoCamera"
                      id="deviceNoCamera"
                      className="disabled-input"
                      onChange={(e) => setDeviceNoCamera(e.target.value)}
                      value={deviceNoCamera}
                    />
                    <div className="checkbox-container2">
                      {deviceNoCamera && (
                        <div className="checkbox-value2"></div>
                      )}
                    </div>
                  </div>
                </div>
                <button className="ok-button" style={{ width: "100%" }}>
                  Save
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <footer>
        <div
          className="footer"
          style={{
            // backgroundColor: "red",
            width: "100%",
            height: "70px",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            paddingTop: "10px",
          }}
        >
          <div
            onClick={btnOnClick_Apply}
            style={{
              backgroundColor: "#fbaf17",
              flex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "40px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "25px",
              cursor: hoverBackToApply ? "pointer" : "default",
            }}
            onMouseEnter={() => setHoverBackToApply(true)}
            onMouseLeave={() => setHoverBackToApply(false)}
          >
            Back To Apply
          </div>
          <div
            onClick={statusCardReader === "ON" ? CardReader : null}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "25px",
              cursor:
                hoverTestCardReader && statusCardReader === "ON"
                  ? "pointer"
                  : "default",
              backgroundColor:
                hoverTestCardReader && statusCardReader === "ON"
                  ? "red"
                  : "#3d5889",
              opacity: statusCardReader === "OFF" ? 0.5 : 1,
            }}
            onMouseEnter={() => setHoverTestCardReader(true)}
            onMouseLeave={() => setHoverTestCardReader(false)}
          >
            Test Card Reader
          </div>
          <div
            onClick={handlePrint}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "25px",
              cursor: hoverTestPrinter ? "pointer" : "default",
              backgroundColor: hoverTestPrinter ? "red" : "#3d5889",
            }}
            onMouseEnter={() => setHoverTestPrinter(true)}
            onMouseLeave={() => setHoverTestPrinter(false)}
          >
            Test Printer
          </div>

          <div
            onClick={testcamera}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "25px",
              cursor: hoverTestCamera ? "pointer" : "default",
              backgroundColor: hoverTestCamera ? "red" : "#3d5889",
            }}
            onMouseEnter={() => setHoverTestCamera(true)}
            onMouseLeave={() => setHoverTestCamera(false)}
          >
            Test Camera
          </div>
        </div>
      </footer>
      <Printer
        dataNumberPermohonanPropsVisa="Z1A012002"
        dataNumberPermohonanPropsReceipt="XA0188090"
        printRefProps={printRef}
        dataPrice="500.000"
        dataLokasi="TEST"
      />
    </div>
  );
};

export default Information;
