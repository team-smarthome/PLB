import { useEffect, useState, useRef } from "react";
import BackIcons from "../../assets/images/back-arrow.png";
import "./InformationStyle.css";
import ProfileIcons from "../../assets/images/profile_configuration.png";
import ChangePasswordIcons from "../../assets/images/change_password.png";
import IPConfigIcons from "../../assets/images/ip-address.png";
import TestPrinterIcons from "../../assets/images/printer_configuration.png";
import TestCameraIcons from "../../assets/images/camera_configuration.png";
import Profile from "../../assets/images/avatar_image.png";
import Face from "../../assets/images/face.png";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useReactToPrint } from "react-to-print";
import Printer from "../../components/Printer/Printer";
import { Toast } from "../../components/Toast/Toast";

const Information = () => {
  const [newWifiResults, setNewWifiResults] = useState("");
  const [oldPasswordWarning, setOldPasswordWarning] = useState(false);
  const [newPasswordWarning, setNewPasswordWarning] = useState(false);
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState(false);
  const printRef = useRef();
  const navigate = useNavigate();
  const listConfiguration = [
    "Profile",
    "Change Password",
    "IP Config",
    "Test Camera",
    "Test Printer",
  ];
  const listIcons = [
    ProfileIcons,
    ChangePasswordIcons,
    IPConfigIcons,
    TestCameraIcons,
    TestPrinterIcons,
  ];

  const [currentTab, setCurrentTab] = useState(0);

  const dataUser = JSON.parse(localStorage.getItem("user"));
  console.log("DataUser", dataUser);

  const DataUser = {
    fullName: dataUser.fullName,
    email: dataUser.email,
    address: dataUser.organization.officeName,
    officeCity: dataUser.organization.officeCity,
    position: dataUser.position,
  };

  console.log("DataUserProfile", DataUser);
  const handleSubmitChangePassword = (event) => {
    event.preventDefault();
    const oldPassword = event.target.oldPassword.value;
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (oldPassword === "") {
      setOldPasswordWarning(true);
    } else if (newPassword === "") {
      setNewPasswordWarning(true);
    } else if (confirmPassword === "") {
      setConfirmPasswordWarning(true);
    } else if (newPassword !== confirmPassword) {
      setOldPasswordWarning(false);
      setNewPasswordWarning(false);
      setConfirmPasswordWarning(false);
      Toast.fire({
        icon: "error",
        title: "New password and confirm password must be the same",
      });
    } else if (
      oldPassword === newPassword &&
      oldPassword !== "" &&
      newPassword !== "" &&
      confirmPassword !== ""
    ) {
      setOldPasswordWarning(false);
      setNewPasswordWarning(false);
      setConfirmPasswordWarning(false);
    }
  };

  const handleOldPasswordChange = (e) => {
    if (e.target.value !== "") {
      setOldPasswordWarning(false);
    }
  };

  const handleNewPasswordChange = (e) => {
    if (e.target.value !== "") {
      setNewPasswordWarning(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    if (e.target.value !== "") {
      setConfirmPasswordWarning(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  const handleBackToApply = () => {
    navigate("/home");
  };

  useEffect(() => {
    const socketIO = io("http://localhost:4499");
    socketIO.on("getIpAddress", (newWifiResults) => {
      console.log("New IP address:", newWifiResults);
      setNewWifiResults(newWifiResults.ipAddressV4);
    });
    return () => {
      socketIO.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentTab === 4) {
      handlePrint();
      setTimeout(() => {
        setCurrentTab(0);
      }, 2000);
    }
  }, [currentTab, handlePrint]);

  return (
    <div className="bg-home">
      <div className="bg-information-container">
        <div className="bg-configuration">
          <div className="configuration-kiri">
            <div className="container-kiri">
              {currentTab === 0 ? (
                <>
                  <div className="profile_atas">
                    <img src={Profile} alt="profile_icons" />
                  </div>
                  <div className="kotak-profile">
                    <div className="profile-key">
                      <div className="profile-title">Full Name</div>
                      <div className="profile-title">Email </div>
                      <div className="profile-title">Address</div>
                      <div className="profile-title">Office City</div>
                      <div className="profile-title">Position</div>
                    </div>
                    <div className="profile-value">
                      <div className="profile-name">: {DataUser.fullName}</div>
                      <div className="profile-email">: {DataUser.email}</div>
                      <div className="profile-address">
                        : {DataUser.address}
                      </div>
                      <div className="profile-office-city">
                        : {DataUser.officeCity}
                      </div>
                      <div className="profile-position">
                        : {DataUser.position}
                      </div>
                    </div>
                  </div>
                </>
              ) : currentTab === 1 ? (
                <>
                  <div className="custom-container">
                    <form
                      onSubmit={handleSubmitChangePassword}
                      className="custom-form"
                    >
                      <h2 className="custom-heading">Change Password</h2>
                      <div className="custom-input-container">
                        <label htmlFor="oldPassword" className="custom-label">
                          Old Password
                        </label>
                        <input
                          type="password"
                          name="oldPassword"
                          id="oldPassword"
                          placeholder="Enter Old Password"
                          onChange={handleOldPasswordChange}
                          className="custom-input"
                        />
                        {oldPasswordWarning && (
                          <p style={{
                            color: "red",
                            textAlign: "start",
                            marginTop: "0.5rem",
                            marginBottom: "-0.5rem",
                          }}>Old password must not be empty</p>
                        )}
                        <label htmlFor="newPassword" className="custom-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          placeholder="Enter New Password"
                          onChange={handleNewPasswordChange}
                          className="custom-input"
                        />
                        {newPasswordWarning && (
                          <p style={{
                            color: "red",
                            textAlign: "start",
                            marginTop: "0.5rem",
                            marginBottom: "-0.5rem",
                          }} >New password must not be empty</p>
                        )}
                        <label
                          htmlFor="confirmPassword"
                          className="custom-label"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Enter Confirm Password"
                          onChange={handleConfirmPasswordChange}
                          className="custom-input"
                        />
                        {confirmPasswordWarning && (
                          <p style={{
                            color: "red",
                            textAlign: "start",
                            marginTop: "0.5rem",
                            marginBottom: "-0.5rem",
                          }}>Confirm password must not be empty</p>
                        )}
                      </div>
                      <div className="custom-button-container">
                        <button
                          style={{ width: "30%" }}
                          type="submit"
                          className="custom-button"
                        >
                          <p className="custom-button-text">Save</p>
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : currentTab === 2 ? (
                <>
                  <div className="ip-address">
                    <h1>IP Configuration</h1>
                    <h3>Current IP Address: {newWifiResults}</h3>
                  </div>
                </>
              ) : currentTab === 3 ? (
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
                    <div
                      style={{
                        height: "280px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={Face}
                        alt="wajah"
                        style={{
                          width: "30%",
                        }}
                      />
                    </div>

                    <button
                      className="ok-button"
                      style={{ marginLeft: "29%", marginBottom: "5%" }}
                    >
                      Take a face photo
                    </button>
                  </div>
                </>
              ) : (<>
                <h1>
                  Test Printer Configuration
                </h1>
                <h2>Please Wait...</h2>
              </>)}
            </div>
          </div>


          <div className="configuration-kanan">
            <div className="configuration-atas-kanan">
              <ul className="configuration-list">
                {listConfiguration.map((list, index) => (
                  <li
                    className={`configuration-list-item ${currentTab === index ? "isActived" : ""
                      }`}
                    onClick={() => setCurrentTab(index)}
                  >
                    <div className="number-style">
                      <img src={listIcons[index]} alt={`${list}_icons`} />
                    </div>
                    <div className="list-style">{list}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="configuration-bawah-kanan"
              onClick={handleBackToApply}
            >
              <img src={BackIcons} alt="back_icons" />
              Back to Home
            </div>
          </div>
        </div>
      </div>
      <Printer
        dataNumberPermohonanPropsVisa="Z1A012002"
        dataNumberPermohonanPropsReceipt="XA0188090"
        printRefProps={printRef}
        dataPrice="500.000"
        dataLokasi="TEST"
        passportumber="A0B0C0D001"
        passportName="Udin Samsul Arifin"
        passportUrl="https://www.google.com"
      />
    </div>
  );
};

export default Information;
