import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import { FaWpforms } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import LogoutIcon from "../../assets/images/logout.png";
import Swal from "sweetalert2";
import { RiAdminLine } from "react-icons/ri";
import Cookies from 'js-cookie';


const Home = () => {
  const userCookie = Cookies.get('userdata');
  const userInfo = JSON.parse(userCookie);

  const navigate = useNavigate();
  const btnOnClick_Apply = () => {
    navigate("/apply");
  };

  const btnOnClick_Informasi = () => {
    navigate("/configuration");
  };

  const btnOnClick_Search_Passport = () => {
    navigate("/history-register");
  };

  const btnOnClickCpanel = () => {
    navigate("/cpanel");
  };
  const deleteAllCookies = () => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  };


  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3D5889",
    });

    if (result.isConfirmed) {
      navigate("/");
      deleteAllCookies();

    }
  };

  return (
    <div className="bg-home">
      <div className="header-bg-home">
        <img
          src={icon_kemenkumham}
          alt="icon_kemenkumham"
          className="icon-image"
        />
      </div>
      <div className="header-2-home">
        <h1>Selamat Datang Di</h1>
        <h1>Registrasi Pas Lintas Batas</h1>
      </div>

      <div className="home-hero-style">
        <div className="bg-apply-information">
          <div className="div-kanan-apply">
            <div className={`div-kanan-atas-apply`}
              onClick={btnOnClick_Apply}
            >
              <FaWpforms size={60} />
              Daftar
            </div>
            {userInfo.role !== 2 ?
              <>
                <div className={`div-kanan-bawah-apply`}
                  onClick={btnOnClickCpanel}
                >
                  <RiAdminLine size={60} />
                  Panel Kontrol
                </div>
              </> :
              <>
                <div className={`div-kanan-bawah-apply`}
                  onClick={btnOnClick_Search_Passport}
                >
                  <IoSearchSharp size={60} />
                  History Register
                </div>
              </>
            }
          </div>
          <div className={`div-kiri-apply`}
            onClick={btnOnClick_Informasi}
          >
            <TbSettingsCog size={80} />
            Konfigurasi
          </div>
        </div>
      </div>
      <div className="footer-bg-home">
        <div className="logout-footer" onClick={handleLogout}>
          <img
            src={LogoutIcon}
            alt="logout-icon"
          />
          Keluar
        </div>
      </div>

    </div>
  );
};

export default Home;