import React, { useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import "./LoginStyle.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast/Toast";
import Cookies from 'js-cookie';
import { url_devel } from "../../services/env";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [sUserName, setUsername] = useState("");
  const [sPassword, setPassword] = useState("");
  const navigate = useNavigate();
  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loading, isLoading] = useState(false);



  const version = "1.0.0";

  const isAuthenticated = () => {
    return Cookies.get('token') !== undefined;
  };

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      isLoading(true);
      const response = await axios.post(`${url_devel}api/login`, {
        nip: sUserName,
        password: sPassword,
      });
      const dataRes = response.data;
      console.log(dataRes, "respinsehitapi");
      if (dataRes.status === 200) {
        isLoading(false);
        Cookies.set('token', dataRes.token, { expires: 1 });
        Cookies.set('userdata', JSON.stringify(dataRes.user), { expires: 1 });
        Toast.fire({
          icon: "success",
          title: "Berhasil Masuk",
        });
        navigate("/home");
      }
    } catch (error) {
      isLoading(false);
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
        <form className="form-login" onSubmit={handleLogin} autoComplete="off">
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
