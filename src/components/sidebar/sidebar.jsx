import React, { useEffect, useState } from "react";
import logo from "../../assets/images/Kemenkumham_Imigrasi.png";
import {
  FaSync,
  FaChevronDown,
  FaUsers,
  FaRegAddressCard,
  FaUserCircle,
  FaNetworkWired,
  FaDatabase,
  FaServer,
  FaMapMarkerAlt,
  FaDesktop,
} from "react-icons/fa";
import { FaCameraRotate } from "react-icons/fa6";
import { FcSynchronize } from "react-icons/fc";
import { TbLogs } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSettingsSharp, IoSpeedometer } from "react-icons/io5";
import Cookies from "js-cookie";
import { FaUserTie } from "react-icons/fa6";
import { TbUserScan } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";

const Sidebar = ({ isOpen, userData, handleLogout }) => {
  const [userInfo, setUserInfo] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState({});
  const [menuSetting, setMenuSetting] = useState({});

  const handleMenuToggle = (menuKey) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [menuKey]: !prevState[menuKey],
    }));
  };

  const handleSettingToggle = (menuKey) => {
    setMenuSetting((prevState) => ({
      ...prevState,
      [menuKey]: !prevState[menuKey],
    }));
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const userCookie = Cookies.get("userdata");
    if (!userCookie) {
      navigate("/");
      localStorage.clear();
    } else {
      const dataCookie = JSON.parse(userCookie);
      setUserInfo(dataCookie);
    }
  }, [navigate]);

  function handleSplitName(name) {
    if (name) {
      return name
        .split(" ")
        .slice(0, 3)
        .map((word) => word[0])
        .join("");
    }
    return "U";
  }

  const activeClass =
    "bg-[#1e293b] text-white border-l-4 border-blue-500 rounded-r-md";
  const inactiveClass =
    "text-gray-300 hover:bg-[#1e293b] hover:text-white rounded-md";

  return (
    <div
      className={`h-full bg-navy-900 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-[280px]" : "w-0 overflow-hidden"}`}
    >
      {isOpen && (
        <div className="flex flex-col items-center py-6 border-b border-slate-700/50">
          <img
            src={logo}
            alt="Imigrasi"
            className="w-16 h-16 mb-2 object-contain"
          />
          <h2 className="text-xl font-bold tracking-wider">Imigrasi</h2>
          <p className="text-xs text-gray-400">Registrasi Pas Lintas Batas</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <h3 className="text-xs font-semibold text-gray-500 mb-4 tracking-widest px-2">
          MENU
        </h3>
        <ul className="list-none space-y-1 pl-0">
          <li>
            <Link
              to="/cpanel/user-management"
              className={`no-underline flex items-center gap-3 px-3 py-3 transition-colors ${isActive("/cpanel/user-management") ? activeClass : inactiveClass}`}
            >
              <FaUsers size={20} />
              <span className="text-sm font-medium">User Management</span>
            </Link>
          </li>

          <li>
            <div
              className={`flex items-center justify-between px-3 py-3 cursor-pointer transition-colors ${menuOpen.category ? "bg-[#1e293b] text-white rounded-md" : inactiveClass}`}
              onClick={() => handleMenuToggle("category")}
            >
              <div className="flex items-center gap-3">
                <TbLogs size={20} />
                <span className="text-sm font-medium">Log</span>
              </div>
              <FaChevronDown
                size={14}
                className={`transition-transform duration-200 ${menuOpen.category ? "rotate-180" : ""}`}
              />
            </div>
          </li>

          {menuOpen.category && (
            <ul className="pl-10 pr-2 space-y-1 mt-1 mb-2 border-l border-slate-700 ml-5">
              <li>
                <Link
                  to="/cpanel/log-register"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/log-register") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaRegAddressCard size={16} />
                  Log Register
                </Link>
              </li>
              <li>
                <Link
                  to="/cpanel/log-facereg"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/log-facereg") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaUserCircle size={16} />
                  Log Facereg
                </Link>
              </li>
              <li>
                <Link
                  to="/cpanel/log-simpan-pelintas"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/log-simpan-pelintas") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaDatabase size={16} />
                  Log Simpan Pelintas
                </Link>
              </li>
            </ul>
          )}

          {userInfo.role !== 2 && (
            <li>
              <div
                className={`flex items-center justify-between px-3 py-3 cursor-pointer transition-colors ${menuSetting.master ? "bg-[#1e293b] text-white rounded-md" : inactiveClass}`}
                onClick={() => handleSettingToggle("master")}
              >
                <div className="flex items-center gap-3">
                  <FaDatabase size={20} />
                  <span className="text-sm font-medium">Master Data</span>
                </div>
                <FaChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${menuSetting.master ? "rotate-180" : ""}`}
                />
              </div>
            </li>
          )}

          {userInfo.role !== 2 && menuSetting.master && (
            <ul className="pl-10 pr-2 space-y-1 mt-1 mb-2 border-l border-slate-700 ml-5">
              <li>
                <Link
                  to="/cpanel/destination-location"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/destination-location") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaMapMarkerAlt size={16} />
                  Destination Location
                </Link>
              </li>
              <li>
                <Link
                  to="/cpanel/jabatan"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/jabatan") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaUserTie size={16} />
                  Jabatan
                </Link>
              </li>
              <li>
                <Link
                  to="/cpanel/device"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/device") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaDesktop size={16} />
                  Device
                </Link>
              </li>
              <li>
                <Link
                  to="/cpanel/device-type"
                  className={`no-underline flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive("/cpanel/device-type") ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  <FaDesktop size={16} />
                  Device Type
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </div>

      <div className="mt-auto px-4 py-4 border-t border-slate-700/50">
        {/* <button 
          onClick={() => navigate("/cpanel")} 
          className="w-full flex items-center justify-between px-4 py-3 bg-[#1e293b] hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors mb-4"
        >
          <div className="flex items-center gap-2">
            <FaSync /> Ke Dashboard Admin
          </div>
        </button> */}

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {handleSplitName(userData?.petugas?.nama_petugas)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">
                {userData?.petugas?.nama_petugas ?? "JohnDoe"}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                kanim {userData?.petugas?.kanim ?? "KANIM JAYAPURA"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors p-2"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
