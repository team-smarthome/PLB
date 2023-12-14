import React, { useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import "./LoginStyle.css";
import "boxicons";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast/Toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
const isAuthenticated = () => {
  return localStorage.getItem('JwtToken') !== null;
};


  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("username", username);
      console.log("password", password);
      const response = await axios.post("http://10.20.68.82/molina-lte/api/Login.php", {
        username,
        password,
      });
  
      if (response.data.status === "success") {
        localStorage.setItem('JwtToken', response.data.JwtToken.token);
        localStorage.setItem('cardNumberPetugas', response.data.profile.card.number);
        localStorage.setItem("key", response.data.profile.api.key);
        localStorage.setItem("token", response.data.profile.api.token);
        localStorage.setItem("user", JSON.stringify(response.data.profile.user_data));
  
        Toast.fire({
          icon: "success",
          title: "Berhasil Masuk",
        });
        navigate("/home");
      } else {
        alert("Username atau password salah!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Toast.fire({
        icon: "error",
        title: "Gagal Masuk, UserName atau Password salah",
      });
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
          <form name="form1" className="box" onSubmit={handleLogin}>
            <h1>Login</h1>
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="passoword-togel">
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
            </div>
            <input type="submit" value="Sign in" className="btn1" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
