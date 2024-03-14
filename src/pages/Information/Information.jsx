import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import io from "socket.io-client";
import { Toast } from "../../components/Toast/Toast";

const Information = () => {
  const navigate = useNavigate();
  const [newWifiResults, setNewWifiResults] = useState("");
  const [lookCamera, setLookCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picture, setGambar] = useState("");
  const [success, setSuccess] = useState(false);
  const [testalat, setTestalat] = useState(false);
  const [hover, setHover] = useState(false);
  const [ipCamera, setIpCamera] = useState("");
  const [statusCardReader, setStatusCardReader] = useState("OFF");
  const [statusCamera, setStatusCamera] = useState("OFF");
  const [deviceNoCamera, setDeviceNoCamera] = useState("");

  useEffect(() => {
    const socketIO = io("http://localhost:4499");
    socketIO.on("getIpAddress", (newWifiResults) => {
      console.log("New IP address:", newWifiResults);
      setNewWifiResults(newWifiResults.ipAddressV4);
      setStatusCardReader("ON")
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

  const testcamera = () => {
    if (loading || success) {
      return;
    }
    setTestalat((prevState) => !prevState);
    setLookCamera((prevState) => !prevState);
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

  const btnOnClick_Apply = () => {
    navigate("/home");
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const socket = io("http://localhost:4498");

    // Create data object
    const data = {
      ipServerCamera: ipCamera,
      deviceNoCamera: deviceNoCamera,
    };

    // Emit data over socket
    socket.emit("saveCameraData", data);
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
            backgroundColor: "#acacac",
          }}
        >
          <form className="full-width-form" onSubmit={handleSubmit}>
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
                  {newWifiResults && <div className="checkbox-value2"></div>}
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
                  <label htmlFor="status_card_reader">Status Card Reader</label>
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
                  {statusCardReader  === "ON"  && <div className="checkbox-value2"></div>}
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
                  {statusCamera === "ON" && <div className="checkbox-value2"></div>}
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
                  {deviceNoCamera && <div className="checkbox-value2"></div>}
                </div>
              </div>
            </div>
            <button className="ok-button" style={{ width: "100%" }}>
              Save
            </button>
          </form>
          {/* <div
            style={{
              marginTop: "15%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1 className="title1">Your IP</h1>
            <br />
            <h1 className="title2" style={{ marginTop: "-10%" }}>
              {newWifiResults}
            </h1>
          </div>



          <div
            onClick={testcamera}
            style={{
              backgroundColor: "#3d5889",
              paddingTop: "2%",
              borderRadius: "10%",
              width: lookCamera ? "40%" : "40%",
            }}
          >
            <h1 className="title1">
              {!testalat? "Test Camera" : "Stop Test"}
            </h1>
          </div> */}
        </div>

        {loading ? (
          <>
            <div
              style={{
                backgroundColor: "#acacac",
                width: "100vh",
                borderRadius: "3%",
              }}
            >
              <h1 className="card-title" style={{ paddingTop: "20%" }}>
                Please wait...
              </h1>
              <div style={{ height: "200px" }}></div>
            </div>
          </>
        ) : lookCamera ? (
          <>
            <div
              style={{
                backgroundColor: "#acacac",
                width: "100vh",
                borderRadius: "3%",
              }}
            >
              <h1 className="card-title" style={{ paddingTop: "5%" }}>
                Please look at the camera
              </h1>
              <div style={{ height: "200px" }}></div>
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
                backgroundColor: "#acacac",
                width: "100vh",
                borderRadius: "3%",
              }}
            >
              <h1 className="card-title" style={{ paddingTop: "5%" }}>
                Success Capture
              </h1>
              <div
                style={{
                  height: "200px",
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
        ) : (
          <>
            <div
              className="grid-box-apply-information"
              style={{
                paddingLeft: "30%",
                paddingTop: "5%",
                // backgroundColor: "red"
                // marginTop: "25vh"
              }}
            >
              <div
                className="bg-apply"
                onClick={btnOnClick_Apply}
                style={{ width: "80%", marginRight: "50vh" }}
              >
                <h2
                  className="text-apply"
                  style={{
                    fontSize: "50px",
                  }}
                >
                  Back to Apply
                </h2>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Information;
