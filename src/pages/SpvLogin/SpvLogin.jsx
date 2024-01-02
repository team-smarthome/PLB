import React from "react";
import "./SpvLogin.css";
import { useNavigate } from "react-router-dom";

function SpvLogin() {
  const navigate = useNavigate();
  const storage = JSON.parse(localStorage.getItem("user"));
  const name = storage.fullName;

  const handleLaporan = async (e) => {
    navigate("/report");
    console.log("navigate to /report");
  };

  return (
    <div className="body-spv">
      <h1 className="title-page">Welcome SPV, {name}</h1>
      <div className="button-combo">
        <button className="button" onClick={handleLaporan}>
          Laporan Per Petugas
        </button>
        <button disabled={true} className="button disabled">
          Menu
        </button>
      </div>
    </div>
  );
}

export default SpvLogin;
