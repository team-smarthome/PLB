import React, { useCallback, useState, useEffect } from 'react'
import { sampleData } from '../LogRegister/sampleSynchronize'
import { checkCountDataFaceReg } from '../../services/api'
import Swal from 'sweetalert2'
import { Toast } from '../../components/Toast/Toast'
import Modals from '../../components/Modal/Modal'
import Cookies from 'js-cookie';
import { addPendingRequest4050, initiateSocket4050 } from '../../utils/socket'
import { useNavigate } from 'react-router-dom'

const SynchronizeFaceReg = () => {
  const socket_IO_4050 = initiateSocket4050();
  const navigate = useNavigate();
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCounted, setIsCounted] = useState(true)
  const [modalAlertSynchronize, setModalAlertSynchronize] = useState(false)
  const [status, setStatus] = useState("not started")
  const [date, setDate] = useState({
    startDate: null,
    endDate: null
  })
  const [rawDateTimeInput, setRawDateTimeInput] = useState({
    startDate: null,
    endDate: null
  })

  const handleIncrement = useCallback(() => {
    if (isProcessing) return

    setIsProcessing(true)
    setCount(0)
    setSuccessCount(0)
    setFailedCount(0)

    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex >= sampleData.length) {
        clearInterval(interval)
        setIsProcessing(false)
        return
      }

      const item = sampleData[currentIndex]

      setCount(prev => prev + 1)
      if (item.status === 1) {
        setSuccessCount(prev => prev + 1)
      } else if (item.status === 0) {
        setFailedCount(prev => prev + 1)
      }

      currentIndex++
    }, 200)

    return () => clearInterval(interval)
  }, [sampleData, isProcessing])

  //   const progress = (count / sampleData.length) * 100
  // const percentage = Math.round((count / sampleData.length) * 100);

  const handleDateTimeChange = (e) => {
    const value = e.target.value;

    // Regex for validating the format: DD/MM/YYYY HH:MM, with a 4-digit year
    const dateTimePattern = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;

    // Allow partial input and make sure we don't lose data
    if (dateTimePattern.test(value) || value === '' || value.length <= 16) {
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
    try {
      const res = await checkCountDataFaceReg(date)
      console.log(res?.data)
      if (res?.status == 200) {
        if (res?.data?.total_data_belum == 0) {
          Toast.fire({
            icon: "error",
            title: "Data Tidak Ditemukan atau Data Sudah Terproses",
          });
          return
        } else {
          setTotal(res?.data?.total_data_belum)
          localStorage.setItem("date", JSON.stringify(date))
          localStorage.setItem("totalData", res?.data?.total_data_belum)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const handlePayload = async () => {
  //   const getUserdata = await Cookies.get('userdata');
  //   const getIpServer = await localStorage.getItem("serverIPSocket")
  //   const userData = JSON.parse(getUserdata)

  //   return {
  //     ...date,
  //     ipServer: getIpServer,
  //     userNip: userData?.nip,
  //     userFullName: userData?.petugas?.nama_petugas,
  //     jenis: "PLB-USER",
  //   }
  // }

  const handleIncrementCount = async () => {
    const getUserdata = await Cookies.get('userdata');
    const getIpServer = await localStorage.getItem("serverIPSocket")
    const userData = JSON.parse(getUserdata)
    const version = await localStorage.getItem("version")

    const dataPayload = {
      ...date,
      ipServer: getIpServer,
      userNip: userData?.nip,
      userFullName: userData?.petugas?.nama_petugas,
      jenis: "PLB",
      totalData: total,
      version: version
    }

    setModalAlertSynchronize(false)
    if (socket_IO_4050.connected) {
      socket_IO_4050.emit("simpan-perlintasan-face-reg", dataPayload);
    } else {
      addPendingRequest4050({ action: 'check-progress', data: dataPayload });

      socket_IO_4050.connect();
    }
  };


  useEffect(() => {
    socket_IO_4050.on("hasil-progress", (data) => {
      // console.log(data, "datadarisync");
      setStatus(data?.status);
      setCount(data?.completed);
      setSuccessCount(data?.success);
      setFailedCount(data?.failed);

      if (data?.status === "done") {
        localStorage.setItem("totalData", 0)
        localStorage.setItem("date", JSON.stringify({ startDate: null, endDate: null }))
      }
    });
  }, [socket_IO_4050]);


  const percentage = Math.round((count / total) * 100);

  const handleGetTotalAndDate = async () => {

    const getDate = await localStorage.getItem("date")
    const convertDate = JSON.parse(getDate)
    const getTotal = await localStorage.getItem("totalData")
    if (convertDate) {
      setDate({ ...date, startDate: convertDate.startDate, endDate: convertDate.endDate })
    }
    if (getTotal) {
      setTotal(getTotal)
    }

  }
  useEffect(() => {
    handleGetTotalAndDate()
  }, [])

  const handleClearDate = () => {
    setDate({
      startDate: null,
      endDate: null
    })
    setTotal(0)
    localStorage.removeItem("date")
    localStorage.removeItem("totalData")
  }
  console.log(date, total, "sini tan")
  return (
    <div
      className='p-8'
    >
      <div className="flex justify-between items-center">
        <h2>Sinkronisasi Data FaceReg</h2>

        {(date.startDate && date.endDate) && total > 0 && <button
          className='p-4 text-sm font-bold cursor-pointer border-1 text-black rounded bg-transparent hover:bg-gray-200 transition-colors duration-300'
          onClick={handleClearDate}
        >
          Ganti Tanggal
        </button>}
      </div>
      {(date.startDate && date.endDate) && total > 0 ?
        (
          <>
            <div className="mb-8">
              <div className="flex flex-row justify-between -my-4">
                <h3>Total Data : </h3>
                <h3>{total}</h3>
              </div>
              <div className="flex flex-row justify-between -my-4">
                <h3>Total Sukses : </h3>
                <h3>{successCount}</h3>
              </div>
              <div className="flex flex-row justify-between -my-4">
                <h3>Total Gagal : </h3>
                <h3>{failedCount}</h3>
              </div>
              <div className="flex flex-row justify-between -my-4">
                <h3>Data yang sudah diproses : </h3>
                <h3>{count}</h3>
              </div>
            </div>
            <div className="mb-8">
              <div class="flex justify-between mb-1">
                <span class="text-base font-medium text-black ">Progress</span>
                <span class="text-base font-medium text-black ">{`${percentage}`}{" "}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 ">
                <div className="bg-btnPrimary h-8 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-center items-center w-full">
              {status == "done" ?
                <button
                  onClick={() => navigate("/cpanel/log-register")}
                  className='w-[75%] p-2 text-base font-bold border-0 cursor-pointer bg-btnPrimary text-white rounded'
                >Kembali</button>
                :
                <button
                  onClick={() => setModalAlertSynchronize(true)}
                  className='w-[75%] p-2 text-base font-bold border-0 cursor-pointer bg-btnPrimary text-white rounded'
                >Mulai Sinkronisasi</button>}
            </div>
          </>
        ) :
        (
          <>
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col gap-6 w-full max-w-3xl">
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                  <div className="flex items-center gap-1 w-full">
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      className="p-2 border rounded w-full"
                      value={date.startDate}
                      onChange={handleDateTimeChange}
                    />
                  </div>
                  <span className="text-lg font-semibold">-</span>
                  <div className="flex items-center gap-1 w-full">
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      className="p-2 border rounded w-full"
                      value={date.endDate}
                      onChange={handleDateTimeChange}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={handleCheckDataCount}
                    className="w-full p-3 text-base font-bold border-0 cursor-pointer bg-btnPrimary text-white rounded"
                  >
                    Periksa Data
                  </button>
                </div>
              </div>
            </div>

          </>
        )}
      <Modals
        showModal={modalAlertSynchronize}
        closeModal={() => setModalAlertSynchronize(false)}
        buttonName="Lanjutkan"
        cancelButtonName='Batalkan'
        headerName="Peringatan"
        onConfirm={handleIncrementCount}
      >
        <div className="py-5">
          <p className="text-justify text-lg text-red-900">
            Pastikan Anda tetap berada di halaman sinkronisasi  selama proses sinkronisasi berlangsung dan jangan menutup jendela atau berpindah ke halaman lain. Keluar dari halaman ini dapat mengganggu proses sinkronisasi dan menyebabkan data tidak tersimpan dengan benar.
          </p>
        </div>


      </Modals>
    </div>
  )
}

export default SynchronizeFaceReg