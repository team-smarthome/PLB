import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";

const Home = () => {
  const navigate = useNavigate();

  const btnOnClick_Apply = () => {
    navigate("/scanpassport");
  };

  const btnOnClick_Informasi = () => {
    console.log("INFORMASI");
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
      </div>
    </div>
  );
};

export default Home;
