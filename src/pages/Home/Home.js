import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import LogoutIcon from "../../assets/images/logout.png";
import DataContext from "../../context/DataContext";
import ApplyIcons from '../../assets/images/apply-icons.png';
import SearchPassport from '../../assets/images/search_passport.png';
import PeopleSetting from '../../assets/images/people_setting.png';

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
              <img src={ApplyIcons} alt="apply-icons" />
              Apply
            </div>
            <div className="div-kanan-bawah-apply" onClick={btnOnClick_Search_Passport}>
              <img src={SearchPassport} alt="search_passport" />
              Search Passport
            </div>
          </div>
          <div className="div-kiri-apply" onClick={btnOnClick_Informasi}>
            <img src={PeopleSetting} alt="people_setting" />
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
