import React, { useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import "./LoginStyle.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast/Toast";
import { url_dev } from "../../services/env";
import { url_dev2 } from "../../services/env";
// import { Spinner } from "flowbite-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loading, isLoading] = useState(false);

  const version = "1.0.18";

  const isAuthenticated = () => {
    return localStorage.getItem("JwtToken") !== null;
  };

  if (isAuthenticated()) {
    if (
      JSON.parse(localStorage.getItem("user")).group.code.includes("ADM") ||
      JSON.parse(localStorage.getItem("user")).group.code.includes("SPV")
    ) {
      return <Navigate to="/report" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      isLoading(true);
      const response = await axios.post(`${url_dev2}Login.php`, {
        username,
        password,
      });

      if (response.data.status === "success") {
        isLoading(false);
        console.log("response: ", response.data);
        localStorage.setItem("JwtToken", response.data.JwtToken.token);
        localStorage.setItem("key", response.data.profile.api.key);
        localStorage.setItem("token", response.data.profile.api.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.profile.user_data)
        );

        localStorage.setItem(
          "price",
          JSON.stringify(response.data.profile.price)
        );

        const userInfo = await JSON.parse(localStorage.getItem("user"));
        if (
          userInfo.group.code.includes("ADM") ||
          userInfo.group.code.includes("SPV")
        ) {
          Toast.fire({
            icon: "success",
            title: "Welcome, Supervisor.",
          });
          navigate("/report");
        } else {
          Toast.fire({
            icon: "success",
            title: "Berhasil Masuk",
          });
          navigate("/home");
        }
      } else {
        alert("Username atau password salah!");
      }
    } catch (error) {
      isLoading(false);
      console.error("Error during login:", error);
      Toast.fire({
        icon: "error",
        title: "Gagal Masuk, UserName atau Password salah",
      });
    }
  };

  return (
    <>
      <div className={loading ? "form-loading-login" : "form-login-container"}>
        <div className="loader-login-spin">
          {loading && <span className="loader-loading-login"></span>}
        </div>

        <img
          src={icon_kemenkumham}
          alt="icon_kemenkumham"
          className="icon-imagess"
        />
        <form className="form-login" onSubmit={handleLogin}>
          <h3> Login</h3>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter UserName"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <div className="pass">
            <input
              type={showPassword ? "text" : "password"}
              className="pass"
              name="password"
              placeholder="Enter password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              id="show-hide"
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
              onClick={tooglePasswordVisibility}
            ></i>
          </div>
          <button className="login-button" type="submit">
            Log In
          </button>
          <div className="version-voa">
            <p>Version: {version}</p>
            {/* <hr /> */}
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
