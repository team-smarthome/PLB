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
        console.log(data,"ini data");
        
    });
    // return;
    
  };

  // Options for React Select
  const departOptions = [
    { value: true, label: "Arrival" },
    { value: false, label: "Departure" },
  ];

  return (
    <div className="container-server">
      {loading && (
        <div className="loading">
          <span className="loader-loading-table"></span>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div className="container-dalam">
        <div className="bagian-atas-server">
          <p className="">Set Status Depart Camera</p>
        </div>
        <div className="bagian-bawah-server flex gap-6">
          {/* <div className="w-full flex items-center ">
                        <label htmlFor="cameraName" className='w-[30%]'>Camera Name</label>
                        <input
                            type="text"
                            name="cameraName"
                            id="cameraName"
                            value={detailData?.namaKamera}
                            onChange={(e) => setDetailData({ ...detailData, namaKamera: e.target.value })}
                        />
                    </div> */}
          <div className="w-full flex items-center">
            <label htmlFor="ipCamera" className="w-[30%]">
              IP Camera
            </label>
            <input
              type="text"
              name="ipCamera"
              id="ipCamera"
              value={detailData?.ipAddress}
              onChange={(e) =>
                setDetailData({ ...detailData, ipAddress: e.target.value })
              }
            />
          </div>
          <div className="w-full flex items-center">
            <label htmlFor="isDepart" className="w-[30%]">
              Depart Status
            </label>
            <Select
              id="isDepart"
              options={departOptions}
              placeholder="Choose Status"
              value={departOptions.find(
                (option) => option.value === detailData.is_depart
              )}
              onChange={(selectedOption) =>
                setDetailData({
                  ...detailData,
                  is_depart: selectedOption.value,
                })
              }
              className="w-[70%]"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#E0E0E0",
                  fontSize: "16px",
                }),
                option: (base) => ({
                  ...base,
                  fontSize: "16px",
                }),
              }}
            />
          </div>
          <button className="ok-button" onClick={handleSubmit}>
            Ubah Status Camera
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingDepartStatusKamera;
