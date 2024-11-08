import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import icon_kemenkumham from "../../assets/images/Kemenkumham_Imigrasi.png";
import { FaWpforms } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import LogoutIcon from "../../assets/images/logout.png";
import Swal from "sweetalert2";
import { initiateSocketConfig } from "../../utils/socket";



const Home = () => {
  const socket2_IO_4000Home = initiateSocketConfig();
  const [canApply, setCanApply] = useState(false);
  const [waitingHome, setWaitingHome] = useState(true)
  useEffect(() => {
    socket2_IO_4000Home.emit("DataIPCamera")
    if (socket2_IO_4000Home.connected) {
      setWaitingHome(true)
    } else {
      setWaitingHome(false)
    }

  }, []);

  useEffect(() => {
    socket2_IO_4000Home.on("ResponseDataIPCamera", (data) => {
      console.log("dataUserKameraSettingHome", data);
      if (data.ipCamera.length > 0) {
        if (data.status === "connected") {
          setCanApply(true);
          console.log("dataUserKameraSetting", data);
          localStorage.setItem('ServerCamera', true);
          setWaitingHome(false)
        } else {
          setCanApply(false);
          setWaitingHome(false)
        }
      } else {
        setCanApply(false);
        setWaitingHome(false)
      }
    });

    return () => {
      socket2_IO_4000Home.off("DataIPCamera");
    }
  }, [socket2_IO_4000Home]);

  const navigate = useNavigate();
  const btnOnClick_Apply = () => {
    if (!canApply) {
      Swal.fire({
        title: "Silakan atur server terlebih dahulu",
        icon: "warning",
        confirmButtonColor: "#3D5889",
      });
      navigate("/configuration");
    } else {
      navigate("/apply");
    }
  };

  const btnOnClick_Informasi = () => {
    navigate("/configuration");
  };

  const btnOnClick_Search_Passport = () => {
    navigate("/history-register");
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
      title: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
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
        <h1>Selamat Datang di</h1>
        <h1>Pos Lintas Batas</h1>
        {/* <h1>Welcome to</h1>
        <h1>Border Crossing Pass</h1> */}
      </div>

      <div className="home-hero-style">
        <div className="bg-apply-information">
          <div className="div-kanan-apply">
            <div className={`div-kanan-atas-apply ${waitingHome ? 'disabled' : ''}`}
              onClick={!waitingHome ? btnOnClick_Apply : null}
              style={{ pointerEvents: waitingHome ? 'none' : 'auto' }}>
              <FaWpforms size={60} />
              {/* Apply */}
              Ajukan
            </div>
            <div className={`div-kanan-bawah-apply ${waitingHome ? 'disabled' : ''}`}
              onClick={!waitingHome ? btnOnClick_Search_Passport : null}
              style={{ pointerEvents: waitingHome ? 'none' : 'auto' }}>
              <IoSearchSharp size={60} />
              Riwayat Pendaftaran
              {/* History Register */}
            </div>
          </div>
          <div className={`div-kiri-apply ${waitingHome ? 'disabled' : ''}`}
            onClick={!waitingHome ? btnOnClick_Informasi : null}
            style={{ pointerEvents: waitingHome ? 'none' : 'auto' }}>
            <TbSettingsCog size={80} />
            Pengaturan
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
