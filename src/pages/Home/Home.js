import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import Logout from "../../assets/images/logout.png";
import LogoutIcon from "../../assets/images/logoutnew.png";

const Home = () => {
  const navigate = useNavigate();

  const btnOnClick_Apply = () => {
    navigate("/apply");
  };

  const btnOnClick_Informasi = () => {
    console.log("INFORMASI");
    const userInfo = JSON.parse(localStorage.getItem("user"));
    console.log(userInfo.group.code);
    if (
      userInfo.group.code.includes("ADM") ||
      userInfo.group.code.includes("SPV")
    ) {
      navigate("/information");
    } else {
      Swal.fire({
        icon: "error",
        // title: "Oops...",
        text: "You're not authorized to access this feature",
        confirmButtonColor: "#3D5889",
      });
    }
    // navigate("/information");
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
        <div className="logoutNew" onClick={handleLogout}>
          <div className="logout-text">
            <p className="text-logout">LOGOUT</p>
          </div>
          <div className="logout-image">
            <img src={LogoutIcon} alt="Logout" className="logout-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
