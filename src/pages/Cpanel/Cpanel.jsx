import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import {
  Route,
  Routes as ReactRoutes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import LogRegister from "../LogRegister/LogRegister";
import LogFaceReg from "../LogFaceReg/LogFaceReg";
import { RiMenu3Fill } from "react-icons/ri";
import Cookies from "js-cookie";

import UserManagement from "../UserManagement/UserManagement";
import SettingIp from "../../components/SettingIp/SettingIp";
import Country from "../Country/Country";
import SettingServer from "../../components/SettingServer/SettingServer";
import Synchronize from "../../components/Synchronize/Synchronize";
import CameraSetting from "../CameraSettings/CameraSetting";
import SynchronizeRegister from "../SynchronizeRegister/SynchronizeRegister";
import JobTitle from "../JobTitle/JobTitle";
import LogSimpanPelintas from "../LogSimpanPelintas/LogSimpanPelintas";
import SynchronizeFaceReg from "../SynchronizeFaceReg/SynchronizeFaceReg";
import SettingDepartStatusKamera from "../../components/SettingDepartStatusKamera/SettingDepartStatusKamera";
import RealtimeFaceReg from "../../components/RealtimeFaceReg/RealtimeFaceReg";
import Device from "../Device/Device";
import DeviceType from "../DeviceType/DeviceType";
const Cpanel = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({});
  const [showUserButton, setShowUserButton] = useState(false);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getUserData = async () => {
    const user = await Cookies.get("userdata");
    setUserData(JSON.parse(user));
  };

  useEffect(() => {
    getUserData();
  }, []);
  function handleSplitName(name) {
    if (name) {
      const splitName = name
        .split(" ")
        .slice(0, 3)
        .map((word) => word[0])
        .join("");
      return splitName;
    }
  }

  // console.log(userData)
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userdata");
    navigate("/");
  };
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 flex-shrink-0 ${isSidebarOpen ? "w-[280px]" : "w-0 overflow-hidden"}`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          userData={userData}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-h-0">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
          <RiMenu3Fill
            size={24}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={handleSidebarToggle}
          />
          <div className="flex items-center gap-3 text-gray-800 font-semibold text-lg">
            <div className="flex align-center justify-center border border-gray-300 p-1 rounded text-gray-500">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 112H96a64.07 64.07 0 00-64 64v208a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V176a64.07 64.07 0 00-64-64zm-16 272H112a16 16 0 01-16-16V224h320v144a16 16 0 01-16 16zM384 144H128v16h256zm-32-32H160v16h192z"></path>
              </svg>
            </div>
            Sistem Registrasi Pas Lintas Batas
          </div>
        </header>

        {/* Page Content */}
        <main className="flex flex-col flex-1 overflow-y-auto bg-slate-50 p-6">
          <ReactRoutes>
            <Route path="*" element={<NotFound />} />
            <Route
              path="/"
              element={<Navigate to="/cpanel/user-management" />}
            />
            <Route path="/log-register" element={<LogRegister />} />
            <Route path="/log-facereg" element={<LogFaceReg />} />
            <Route
              path="/log-simpan-pelintas"
              element={<LogSimpanPelintas />}
            />
            <Route path="/user-management" element={<UserManagement />} />
            {/* <Route path="/setting-server" element={<SettingServer />} /> */}
            {/* <Route path="/setting-camera" element={<SettingIp />} /> */}
            <Route path="/device" element={<Device />} />
            <Route path="/device-type" element={<DeviceType />} />
            <Route path="/destination-location" element={<Country />} />
            <Route path="/jabatan" element={<JobTitle />} />
            <Route path="/synchronize" element={<Synchronize />} />
            <Route
              path="/synchronize-facereg"
              element={<SynchronizeFaceReg />}
            />
            {/* <Route
              path="/setting-status-depart"
              element={<SettingDepartStatusKamera />}
            /> */}
            <Route path="/realtime-facereg" element={<RealtimeFaceReg />} />
          </ReactRoutes>
        </main>
      </div>
    </div>
  );
};

const NotFound = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>404 | Not Found</h1>
    </div>
  );
};
export default Cpanel;
