import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import { FaWpforms } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";


const Home = () => {
  const navigate = useNavigate();
  const btnOnClick_Apply = () => {
    navigate("/apply");
  };

  const btnOnClick_Informasi = () => {
    navigate("/configuration");
  };

  const btnOnClick_Search_Passport = () => {
    navigate("/log");
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
        <h1>Border Crossing Pass</h1>
      </div>

      <div className="home-hero-style">
        <div className="bg-apply-information">
          <div className="div-kanan-apply">
            <div className="div-kanan-atas-apply" onClick={btnOnClick_Apply}>
              <FaWpforms size={60} />
              Apply
            </div>
            <div className="div-kanan-bawah-apply" onClick={btnOnClick_Search_Passport}>
              <IoSearchSharp size={60} />
              History Log
            </div>
          </div>
          <div className="div-kiri-apply" onClick={btnOnClick_Informasi}>
            <TbSettingsCog size={80} />
            Configuration
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
