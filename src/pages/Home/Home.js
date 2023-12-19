import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import Logout from "../../assets/images/logout.png";
const Home = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const btnOnClick_Apply = () => {
    navigate("/apply");
  };

  const btnOnClick_Informasi = () => {
    console.log("INFORMASI");
  };

  const handleLogout = () => {
    // Menampilkan konfirmasi alert ketika tombol logout diklik
    const userConfirmed = window.confirm("Are you sure you want to log out?");

    if (userConfirmed) {
      // Proses logout di sini (hapus localStorage, dll.)
      navigate("/");
      localStorage.removeItem("user");
      localStorage.removeItem("JwtToken");
      localStorage.removeItem("cardNumberPetugas");
      localStorage.removeItem("key");
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="bg-home">
      <div className="content-home">
        <img
          src={icon_kemenkumham}
          alt="icon_kemenkumham"
          className="icon-image"
        />
        <h1 className="title1">Welcome to</h1>
        <h1 className="title2">VISA on Arrival Machine</h1>
        <div className="bg-apply-information">
          <div className="grid-box-apply-information">
            <div className="bg-apply" onClick={btnOnClick_Apply}>
              <h2 className="text-apply">APPLY</h2>
            </div>
            <div className="bg-information" onClick={btnOnClick_Informasi}>
              <h2 className="text-information">Information</h2>
            </div>
          </div>
        </div>
        <div className="logout" onClick={handleLogout}>
          <div className="logout-2">
            <img src={Logout} alt="Logout" className="logout-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
