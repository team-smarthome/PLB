import React, { useEffect, useState } from "react";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import image_maintenance from "../../assets/images/maintenance-page.png";
import "./LoginStyle.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Toast } from "../../components/Toast/Toast";
import { url_dev } from "../../services/env";
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [maintenance, setMaintenance] = useState(false);

  const handleMaintenance = async () => {
    try {
      await axios.get(`${url_dev}Maintenance.php`).then((response) => {
        console.log(response.data);
        console.log(response.data.status);
        console.log(response.data.maintenance);
        if (response.data.status === "success" && response.data.maintenance === 1) {
          console.log("Maintenance is active");
          setMaintenance(true);
        } else {
          console.log("Maintenance is inactive");
          setMaintenance(false);
        }
      });
    } catch (error) {
      console.log(error);
      setMaintenance(false);
    }
  }



  useEffect(() => {
    handleMaintenance();
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



  // useEffect(() => {
  //   let timer;
  //   if (loading) {
  //     timer = setTimeout(() => {
  //       Toast.fire({
  //         icon: "error",
  //         title: "VPN connection is interrupted",
  //       });
  //       isLoading(false)
  //     }, 10000); // 0 seconds
  //   } else {
  //     clearTimeout(timer);
  //   }

  //   return () => clearTimeout(timer);
  // }, [loading]);

  const version = "3.0.4";

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
    if (!isOnline) {
      Toast.fire({
        icon: "error",
        title: "No Internet Connection",
      });
      return;
    }
    try {
      isLoading(true);
      const response = await axios.post(`${url_dev}Login.php`, {
        username,
        password,
      });

      if (
        response.data.JwtToken.token !== null &&
        response.data.JwtToken.token !== "" &&
        response.data.status === "success"
      ) {
        localStorage.setItem("JwtToken", response.data.JwtToken.token);

        const userProfile = await axios.get(`${url_dev}ProfileMe.php`, {
          headers: {
            Authorization: `Bearer ${response.data.JwtToken.token}`,
          },
        });

        // Check if userProfile.data.user_data is not null
        if (
          userProfile.data.user_data !== null &&
          userProfile.data.price !== null &&
          userProfile.data.api !== null
        ) {
          isLoading(false);
          localStorage.setItem(
            "user",
            JSON.stringify(userProfile.data.user_data)
          );
          localStorage.setItem("price", JSON.stringify(userProfile.data.price));
          localStorage.setItem("key", userProfile.data.api.key);
          localStorage.setItem("token", userProfile.data.api.token);

          const userInfo = JSON.parse(localStorage.getItem("user"));

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
          isLoading(false);
          localStorage.removeItem("JwtToken");
          Toast.fire({
            icon: "error",
            title: "Failed to Login",
          });
        }
      } else if (
        response.data.status === "error" ||
        response.data.message === "Login failed"
      ) {
        Toast.fire({
          icon: "error",
          title: "Username or Password is Wrong",
        });
        isLoading(false);
      } else {
        // Kondisi tambahan jika login tidak berhasil namun tidak ada pesan error yang sesuai
        Toast.fire({
          icon: "error",
          title: "Failed to Login. Please try again.",
        });
        isLoading(false);
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
      {maintenance ? (
        <>
          <div className="maintenace_image">
            <img src={image_maintenance} alt="maintenance" />
          </div>
        </>
      ) : (
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
      )}

    </>
  );
};

export default Login;
