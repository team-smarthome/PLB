import React, { useEffect, useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import "./LoginStyle.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast/Toast";
import Cookies from 'js-cookie';
import { url_dev } from "../../services/env";
// import { Spinner } from "flowbite-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [sUserName, setUsername] = useState("");
  const [sPassword, setPassword] = useState("");
  const navigate = useNavigate();
  const tooglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loading, isLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);


  useEffect(() => {
    // handleMaintenance();
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const version = "3.0.5";

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
      const encodedPassword = btoa(sPassword);
      const response = await axios.put(`http://192.168.2.127/cgi-bin/entry.cgi/system/login`, {
        sUserName,
        sPassword: encodedPassword,
      });
      const dataRes = response.data;
      console.log(response, "respinsehitapi");
      let authUser = ""
      if (dataRes.status.code === 200) {
        isLoading(false);
        if (dataRes.data.auth === 0) {
          authUser = "admin";
        } else {
          authUser = "user";
        }
        // Cookies.set('token', dataRes.data.token, { expires: 1, domain: '192.168.2.127' });
        // Cookies.set('sidebarStatus', dataRes.data.status, { expires: 1, domain: '192.168.2.127' });
        // Cookies.set('roleId', dataRes.data.auth, { expires: 1, domain: '192.168.2.127' });
        // Cookies.set('face-username', authUser, { expires: 1, domain: '192.168.2.127' });
        // Cookies.set('Face-Token', dataRes.data.token, { expires: 1, domain: '192.168.2.127' });


        Cookies.set('token', dataRes.data.token, { expires: 1 });
        Cookies.set('sidebarStatus', dataRes.data.status, { expires: 1 });
        Cookies.set('roleId', dataRes.data.auth, { expires: 1 });
        Cookies.set('face-username', authUser, { expires: 1 });
        Cookies.set('Face-Token', dataRes.data.token, { expires: 1 });
        Toast.fire({
          icon: "success",
          title: "Berhasil Masuk",
        });
        navigate("/home");
      }
    } catch (error) {
      isLoading(false);
      localStorage.removeItem("JwtToken");
      if (error.response && error.response.status === 401) {
        Toast.fire({
          icon: "error",
          title: "Username or Password is Wrong",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "VPN connection is interrupted",
        });
      }
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
