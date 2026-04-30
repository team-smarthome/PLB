import React, { useCallback, useState, useEffect } from "react";
import { sampleData } from "../LogRegister/sampleSynchronize";
import { checkCountDataFaceReg, getAllNegaraData } from "../../services/api";
import Swal from "sweetalert2";
import { Toast } from "../../components/Toast/Toast";
import Modals from "../../components/Modal/Modal";
import Cookies from "js-cookie";
import { addPendingRequest4050, initiateSocket4050 } from "../../utils/socket";
import { useNavigate } from "react-router-dom";
import { url_socket } from "../../services/env";

const SynchronizeFaceReg = () => {
  const socket_IO_4050 = initiateSocket4050();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCounted, setIsCounted] = useState(true);
  const [modalAlertSynchronize, setModalAlertSynchronize] = useState(false);
  const [progress, setProgress] = useState(false);
  const [isDepart, setIsDepart] = useState("");
  const [status, setStatus] = useState("not started");
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [rawDateTimeInput, setRawDateTimeInput] = useState({
    startDate: null,
    endDate: null,
  });

  const handleStatusChangeDepart = (event) => {
    const value = event.target.value;
    setIsDepart(value);
  };

  const handleIncrement = useCallback(() => {
    if (isProcessing) return;

    setIsProcessing(true);
    setCount(0);
    setSuccessCount(0);
    setFailedCount(0);

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= sampleData.length) {
        clearInterval(interval);
        setIsProcessing(false);
        return;
      }

      const item = sampleData[currentIndex];

      setCount((prev) => prev + 1);
      if (item.status === 1) {
        setSuccessCount((prev) => prev + 1);
      } else if (item.status === 0) {
        setFailedCount((prev) => prev + 1);
      }

      currentIndex++;
    }, 200);

    return () => clearInterval(interval);
  }, [sampleData, isProcessing]);

  //   const progress = (count / sampleData.length) * 100
  // const percentage = Math.round((count / sampleData.length) * 100);

  const handleDateTimeChange = (e) => {
    const value = e.target.value;

    // Regex for validating the format: DD/MM/YYYY HH:MM, with a 4-digit year
    const dateTimePattern = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;

    // Allow partial input and make sure we don't lose data
    if (dateTimePattern.test(value) || value === "" || value.length <= 16) {
      setRawDateTimeInput(value);

      // Only update formdata when the input is a complete and valid datetime
      // if (moment(value, "DD/MM/YYYY HH:mm", true).isValid()) {

      setDate({
        ...date,
        [e.target.name]: value,
      });
    }
    // } else if (value.length <= 16) {

    // Allow up to 16 characters (for DD/MM/YYYY HH:MM format)
    setRawDateTimeInput(value);
    // }
  };

  const handleCheckDataCount = async () => {
    if (!date.startDate && !date.endDate) {
      Toast.fire({
        icon: "error",
        title: "Tanggal atau Negara atau status keberangkatan Harus Diisi",
      });
      return;
    }
    try {
      const params = {
        ...date,
        is_depart: isDepart,
      };
      const res = await checkCountDataFaceReg(params);
      console.log(res?.data);
      if (res?.status == 200) {
        if (res?.data?.total_data_belum == 0) {
          Toast.fire({
            icon: "error",
            title: "Data Tidak Ditemukan atau Data Sudah Terproses",
          });
          return;
        } else {
          setTotal(res?.data?.total_data_belum);
          localStorage.setItem("dateFaceReg", JSON.stringify(date));
          localStorage.setItem("totalDataFaceReg", res?.data?.total_data_belum);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrementCount = async () => {
    setProgress(true);
    const getUserdata = await Cookies.get("userdata");
    const getIpServer = url_socket;
    const userData = JSON.parse(getUserdata);
    const version = await localStorage.getItem("version");

    const dataPayload = {
      ...date,
      ipServer: getIpServer,
      userNip: userData?.nip,
      userFullName: userData?.petugas?.nama_petugas,
      jenis: "PLB",
      totalData: total,
      version: version,
      is_depart: isDepart,
    };

    setModalAlertSynchronize(false);
    if (socket_IO_4050.connected) {
      socket_IO_4050.emit("simpan-perlintasan-face-reg", dataPayload);
    } else {
      Toast.fire({
        icon: "error",
        title: "Koneksi ke server terputus, silahkan coba lagi",
      });
      setProgress(false);
      return;
    }
  };

  useEffect(() => {
    socket_IO_4050.on("hasil-progress", (data) => {
      setStatus(data?.status);
      setCount(data?.completed);
      setSuccessCount(data?.success);
      setFailedCount(data?.failed);

      if (data?.status === "done") {
        localStorage.setItem("totalDataFaceReg", 0);
        localStorage.setItem(
          "dateFaceReg",
          JSON.stringify({ startDate: null, endDate: null }),
        );
      } else if (data?.status === "in-progress") {
        setProgress(true);
      } else if (data?.status === "not-started") {
        setProgress(false);
      }
    });

    socket_IO_4050.emit("check-progress");

    socket_IO_4050.on("disconnect", () => {
      Toast.fire({
        icon: "error",
        title: "Koneksi ke server terputus, silahkan coba lagi",
      });
      setProgress(false);
    });

    return () => {
      socket_IO_4050.off("check-progress");
    };
  }, []);

  const percentage = Math.round((count / total) * 100);

  const handleGetTotalAndDate = async () => {
    const getDate = await localStorage.getItem("dateFaceReg");
    const convertDate = JSON.parse(getDate);
    const getTotal = await localStorage.getItem("totalDataFaceReg");
    if (convertDate) {
      setDate({
        ...date,
        startDate: convertDate.startDate,
        endDate: convertDate.endDate,
      });
    }
    if (getTotal) {
      setTotal(getTotal);
    }
  };

  useEffect(() => {
    handleGetTotalAndDate();
  }, []);

  const handleClearDate = () => {
    setDate({
      startDate: null,
      endDate: null,
    });
    setTotal(0);
    localStorage.removeItem("dateFacereg");
    localStorage.removeItem("totalDataFaceReg");
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-4">
            Sinkronisasi Data
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sinkronisasi data face recognition dengan server.
          </p>
        </div>

        {date.startDate && date.endDate && total > 0 && (
          <button
            className="px-4 py-2 text-sm font-medium cursor-pointer border border-gray-200 text-gray-700 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300 shadow-sm"
            onClick={handleClearDate}
          >
            Ganti Tanggal
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden p-6">
        {date.startDate && date.endDate && total > 0 ? (
          <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Data</p>
                <p className="text-2xl font-bold text-gray-800">{total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 mb-1">Sukses</p>
                <p className="text-2xl font-bold text-green-700">
                  {successCount}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-red-600 mb-1">Gagal</p>
                <p className="text-2xl font-bold text-red-700">{failedCount}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Diproses</p>
                <p className="text-2xl font-bold text-blue-700">{count}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">
                  Progress Sinkronisasi
                </span>
                <span class="text-sm font-bold text-navy-900">
                  {`${percentage}`}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${percentage}%` }}
                >
                  <div
                    className="absolute top-0 bottom-0 left-0 right-0 bg-white/20"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                      backgroundSize: "1rem 1rem",
                      animation: "progress-stripes 1s linear infinite",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              {status == "done" ? (
                <button
                  onClick={() => navigate("/cpanel/log-simpan-pelintas")}
                  className="w-full md:w-[75%] py-3 px-6 text-sm font-semibold border-0 cursor-pointer bg-navy-900 hover:bg-blue-900 transition-colors text-white rounded-lg shadow-sm"
                >
                  Kembali ke Log
                </button>
              ) : (
                <button
                  onClick={handleIncrementCount}
                  disabled={progress}
                  className={`w-full md:w-[75%] py-3 px-6 text-sm font-semibold border-0 cursor-pointer text-white rounded-lg shadow-sm transition-all ${progress ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {progress ? (
                    <div className="flex items-center justify-center gap-3">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sinkronisasi Sedang Berlangsung...
                    </div>
                  ) : (
                    "Mulai Sinkronisasi"
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
            <div className="w-full max-w-2xl bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col gap-6 shadow-sm">
              <div className="text-center mb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-sm font-semibold cursor-pointer border border-gray-200 text-gray-700 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300 flex items-center shadow-sm"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
                  </svg>
                  Kembali
                </button>
                <h3 className="text-lg font-bold text-gray-800">
                  Filter Data Sinkronisasi
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pilih rentang tanggal dan status keberangkatan data yang akan
                  disinkronkan.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Tanggal Mulai
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    className="px-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                    value={date.startDate || ""}
                    onChange={handleDateTimeChange}
                  />
                </div>
                <span className="hidden md:block text-gray-400 font-bold mt-6">
                  -
                </span>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Tanggal Akhir
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    className="px-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                    value={date.endDate || ""}
                    onChange={handleDateTimeChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Status Keberangkatan
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                  onChange={handleStatusChangeDepart}
                  value={isDepart}
                >
                  <option value="">Semua Status</option>
                  <option value={false}>Kedatangan (Arrival)</option>
                  <option value={true}>Keberangkatan (Departure)</option>
                </select>
              </div>

              <div className="mt-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCheckDataCount}
                  className="w-full py-3 px-4 text-sm font-semibold cursor-pointer bg-navy-900 hover:bg-blue-800 transition-colors text-white rounded-lg shadow-sm"
                >
                  Periksa Ketersediaan Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modals
        showModal={modalAlertSynchronize}
        closeModal={() => setModalAlertSynchronize(false)}
        buttonName="Lanjutkan"
        cancelButtonName="Batalkan"
        headerName="Peringatan Penting"
        onConfirm={handleIncrementCount}
      >
        <div className="py-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex gap-4">
            <div className="mt-0.5 text-red-600">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
              </svg>
            </div>
            <p className="text-sm text-red-800 font-medium leading-relaxed">
              Pastikan Anda tetap berada di halaman sinkronisasi selama proses
              berlangsung. Jangan menutup browser atau berpindah ke halaman
              lain. Keluar dari halaman ini dapat menghentikan proses secara
              paksa dan menyebabkan data gagal tersimpan dengan benar.
            </p>
          </div>
        </div>
      </Modals>
    </div>
  );
};

export default SynchronizeFaceReg;
