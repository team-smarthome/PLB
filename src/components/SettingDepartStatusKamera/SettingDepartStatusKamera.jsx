import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Toast } from "../Toast/Toast";
import { apiGetDataLogRegister, apiInsertIP } from "../../services/api";
import Cookies from "js-cookie";
import Select from "react-select"; // Import React Select
import { initiateSocket4010 } from "../../utils/socket";

const SettingDepartStatusKamera = () => {
  const [ipServerSynch, setIpServerSynch] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({
    is_depart: null, // default to null
  });
  let socket_server_4010;
  const socket_IO_4010 = initiateSocket4010();
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const serverIPSocket = localStorage.getItem("serverIPSocket");
    if (serverIPSocket) {
      setIpServerSynch(serverIPSocket);
    }
  }, []);

  const handleSubmit = async () => {
    console.log('sfdnksanfksakfnan')
    const sendDataToWsEdit = {
      // oldIp: detailData.ipAddress,
      ipServerCamera: detailData.ipAddress,
      operationalStatus: detailData.is_depart ? "Arrival" : "Departure",
    };
    console.log(sendDataToWsEdit);
    socket_IO_4010.emit("changeName", sendDataToWsEdit);
    socket_IO_4010.once("renameSuccess", (data) => {
      Toast.fire({
        icon: "success",
        title: "Data berhasil diubah",
      });
      console.log(data, "ini data");

    });
    // return;

  };

  // Options for React Select
  const departOptions = [
    { value: true, label: "Arrival" },
    { value: false, label: "Departure" },
  ];

    return (
        <div className="flex flex-col h-full gap-6">
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-xl">
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
                        <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                        <span className="mt-2 text-sm text-gray-600">Loading...</span>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-navy-900">Change Camera Name</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure the depart status for a specific camera</p>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label htmlFor="ipCamera" className="text-sm font-semibold text-gray-700">IP Camera</label>
                        <input
                            type="text"
                            name="ipCamera"
                            id="ipCamera"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={detailData?.ipAddress || ""}
                            onChange={(e) => setDetailData({ ...detailData, ipAddress: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                        <label htmlFor="isDepart" className="text-sm font-semibold text-gray-700">Depart Status</label>
                        <Select
                            id="isDepart"
                            options={departOptions}
                            placeholder="Choose Status"
                            value={departOptions.find((option) => option.value === detailData.is_depart)}
                            onChange={(selectedOption) => setDetailData({ ...detailData, is_depart: selectedOption.value })}
                            className="text-sm"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#e5e7eb',
                                    borderRadius: '0.5rem',
                                    minHeight: '42px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#3b82f6'
                                    }
                                })
                            }}
                        />
                    </div>
                    <button 
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm h-[42px] w-full md:w-auto" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Ubah Status Camera
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingDepartStatusKamera;
