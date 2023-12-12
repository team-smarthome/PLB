import React, { useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import "./LoginStyle.css";
import "boxicons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("username", username);
      console.log("password", password);
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      if (response.data.success) {
        setLoggedIn(true);
      } else {
        alert("Username atau password salah!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Terjadi kesalahan saat login.");
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-otp", { otp });
      if (response.data.success) {
        console.log("Verifikasi OTP berhasil");
        navigate("/home");
      } else {
        alert("Verifikasi OTP gagal. Periksa kembali kode OTP Anda.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("Terjadi kesalahan saat verifikasi OTP.");
    }
  };

  return (
    <>
      <div id="particles-js">
        <img
          src={icon_kemenkumham}
          alt="icon_kemenkumham"
          className="icon-image"
        />
      </div>
      <div className="animated bounceInDown">
        <div className="container">
          <span className="error animated tada" id="msg"></span>
          {!loggedIn ? (
            <form name="form1" className="box" onSubmit={handleLogin}>
              <h1>Login</h1>
              <input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                id="pwd"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={tooglePasswordVisibility}
                className="password-toggle-icon"
              >
                <box-icon
                  type="solid"
                  name={showPassword ? "hide" : "show"}
                  className="box-icon"
                />
              </button>
              <input type="submit" value="Sign in" className="btn1" />
            </form>
          ) : (
            <form name="form2" className="box" onSubmit={handleOTPVerification}>
              <h1>Verify OTP</h1>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                autoComplete="off"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input type="submit" value="Verify OTP" className="btn1" />
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
