import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import LogoutIcon from "../../assets/images/logout.png";
import DataContext from "../../context/DataContext";
import ApplyIcons from '../../assets/images/apply-icons.png';
import SearchPassport from '../../assets/images/search_passport.png';
import PeopleSetting from '../../assets/images/people_setting.png';
import { FaWpforms } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import axios from "axios";
import { url_dev } from "../../services/env";


const Home = () => {
  const navigate = useNavigate();
  const { setData } = useContext(DataContext);

  const btnOnClick_Apply = () => {
    localStorage.setItem("dataStatus", false);
    navigate("/apply");
    setData(false);
  };

  const btnOnClick_Informasi = () => {
    // console.log("INFORMASI");
    localStorage.setItem("dataStatus", false);
    navigate("/configuration");
    setData(false);
  };

  const btnOnClick_Search_Passport = () => {
    // console.log("INFORMASI");
    localStorage.setItem("dataStatus", true);
    navigate("/apply");
    setData(true);
  };

  const handleLogout = async () => {
    // Menampilkan konfirmasi alert ketika tombol logout diklik menggunakan SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3D5889",
    });

    if (result.isConfirmed) {
      // Proses logout di sini (hapus localStorage, dll.)
      navigate("/");
      localStorage.removeItem("user");
      localStorage.removeItem("JwtToken");
      localStorage.removeItem("cardNumberPetugas");
      localStorage.removeItem("key");
      localStorage.removeItem("token");
      localStorage.removeItem("jenisDeviceId");
      localStorage.removeItem("deviceId");
      localStorage.removeItem("airportId");
      localStorage.removeItem("price");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      changeMaintenance();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const changeMaintenance = async () => {
    try {
      await axios.get(`${url_dev}Maintenance.php`).then((response) => {
        console.log(response.data);
        console.log(response.data.status);
        console.log(response.data.maintenance);
        if (response.data.status === "success" && response.data.maintenance === 1) {
          console.log("Maintenance is active");
          navigate("/");
          localStorage.removeItem("user");
          localStorage.removeItem("JwtToken");
          localStorage.removeItem("cardNumberPetugas");
          localStorage.removeItem("key");
          localStorage.removeItem("token");
          localStorage.removeItem("jenisDeviceId");
          localStorage.removeItem("deviceId");
          localStorage.removeItem("airportId");
          localStorage.removeItem("price");
        } else {
          console.log("Maintenance is inactive");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


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
        <h1>Welcome to</h1>
        <h1>Visa on Arrival Application</h1>
      </div>

      <div className="home-hero-style">
        <div className="bg-apply-information">
          <div className="div-kanan-apply">
            <div className="div-kanan-atas-apply" onClick={btnOnClick_Apply}>
              {/* <img src={ApplyIcons} alt="apply-icons" /> */}
              <FaWpforms size={60} />
              Apply
            </div>
            <div className="div-kanan-bawah-apply" onClick={btnOnClick_Search_Passport}>
              {/* <img src={SearchPassport} alt="search_passport" /> */}
              <IoSearchSharp size={60} />
              Search Passport
            </div>
          </div>
          <div className="div-kiri-apply" onClick={btnOnClick_Informasi}>
            {/* <img src={PeopleSetting} alt="people_setting" /> */}
            <TbSettingsCog size={80} />
            Configuration
          </div>
        </div>
      </div>

      <div className="footer-bg-home">
        <div className="logout-footer" onClick={handleLogout}>
          <img
            src={LogoutIcon}
            alt="logout-icon"
          />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Home;
