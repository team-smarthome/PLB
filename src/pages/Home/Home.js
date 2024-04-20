import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import LogoutIcon from "../../assets/images/logoutnew.png";
import DataContext from "../../context/DataContext";
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
      <div className="content-home">
        <img
          src={icon_kemenkumham}
          alt="icon_kemenkumham"
          className="icon-image"
        />
        <h1 className="title1">Welcome to</h1>
        <h1 className="title2">Visa on Arrival Application</h1>
        <div className="bg-apply-information">
          <div style={{ display: "flex", gap: '6vh', paddingRight: '5vh', paddingLeft: '5vh' }}>

            <div style={{
              fontSize: "1.5em",
              display: "flex",
              flexDirection: "column",
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}>

              <h2
                onClick={btnOnClick_Apply}
                style={{
                  cursor: "pointer",
                  borderRadius: "15px",
                  textAlign: "center",
                  width: "100%",
                  backgroundColor: "#fbaf17",
                  color: "white",
                  paddingTop: "5vh",
                  paddingBottom: "5vh",
                  marginBottom: "-2vh",
                }} >Apply</h2>



              <h2 onClick={btnOnClick_Search_Passport} style={{
                cursor: "pointer",
                borderRadius: "15px",
                textAlign: "center",
                width: "100%",
                paddingTop: "5vh",
                paddingBottom: "5vh",
                color: "white",
                backgroundColor: "#0d004c",
              }} >Search Passport</h2>


            </div>


            <div style={{
              borderRadius: "15px",
              marginTop: "5vh",
              backgroundColor: "#3d5889",
              flex: 1,
              height: "37.5vh",
            }}>
              <div>
                <h2 style={{
                  cursor: "pointer",
                  borderRadius: "15px",
                  textAlign: "center",
                  width: "100%",
                  paddingTop: "13vh",
                  paddingBottom: "5vh",
                  color: "white",
                  backgroundColor: "#3d5889",
                }} onClick={btnOnClick_Informasi}>Configuration</h2>
              </div>

            </div>
          </div>
          {/* 
          <div className="grid-box-apply-information">
            <div className="bg-apply" onClick={btnOnClick_Apply}>
              <h2 className="text-apply">Apply</h2>
            </div>
            <div className="bg-information h-full" onClick={btnOnClick_Informasi}>
              <h2 className="text-information">Configuration</h2>
            </div>
            <div className="bg-information" onClick={btnOnClick_Search_Passport}>
              <h2 className="text-information">Search Passport</h2>
            </div>
          </div> */}
        </div>
        {JSON.parse(localStorage.getItem("user")).group.code.includes("SPV") ? (
          <div className="menuButton" onClick={() => navigate("/report")}>
            <div className="logout-text">
              <p className="text-logout">Report</p>
            </div>
          </div>
        ) : null}
        <div className="logoutNew" onClick={handleLogout}>
          <div className="logout-text">
            <p className="text-logout">Logout</p>
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
