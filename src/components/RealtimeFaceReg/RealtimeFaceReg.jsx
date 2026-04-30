import React, { useEffect, useRef, useState } from 'react'
import { apiGetAllIp, simpanPelintas } from '../../services/api'
import Cookies from 'js-cookie'
import { FaImage } from 'react-icons/fa'
import { Toast } from '../Toast/Toast'
import ModalData from '../Modal/ModalData'
import { io } from 'socket.io-client'
import { url_socket } from '../../services/env'


const RealtimeFaceReg = () => {
    const [score, setScore] = useState(100)
    const [ipCamera, setIpCamera] = useState("")
    const [listCamera, setListCamera] = useState([])
    const [selectedCamera, setSelectedCamera] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [resData, setResData] = useState(null)
    const [status, setStatus] = useState('idle')
    const [faceRegData, setFaceRegData] = useState({
        similiarity: null,
        faceRegImage: null,
        profile_image: null,
        documentImage: null
    })
    const [socket, setSocket] = useState(null);
    // const personIdRef = useRef(null)
    const [lanjutRealtime, setLanjutRealtime] = useState(false)

    // const [personId, setPersonId] = useState(null)

    const fetchAllIp = async () => {
        const userCookie = Cookies.get('userdata');

        if (!userCookie) {
            console.error("No user cookie found");
            return;
        }

        const userInfo = JSON.parse(userCookie);

        try {
            const res = await apiGetAllIp(userInfo?.tpi_id);
            console.log(res?.data?.data)
            if (res?.data?.status == 200) {

                setListCamera(res?.data?.data)
            }
        } catch (err) {
            // setStatus("success")
            console.log(err.message);
        }
    };

    const getIpCamera = () => {
        const getKey = localStorage.getItem('ipCameraFaceReg')
        if (getKey) {
            setIpCamera(getKey)
            connectToSocket(getKey)
        }
    }

    const handleSelectCamera = (e) => {
        localStorage.removeItem("personId")
        setSelectedCamera(e.target.value)
    }

    const handleConfirmCamera = () => {
        setIpCamera(selectedCamera)
        localStorage.setItem("ipCameraFaceReg", selectedCamera)
        connectToSocket(selectedCamera)
    }

    const handleClearCamera = () => {
        setIpCamera("")
        localStorage.removeItem("ipCameraFaceReg", selectedCamera)
    }


    const insertDataLog = async (params) => {
        setStatus('loading')
        console.log(resData, "resData")
        const dataRes = [
            {
                "no_passport": resData?.personId,
                "name": resData?.name,
                "similarity": resData?.images_info[0]?.similarity || 0,
                "pass_status": params,
                "time": resData?.time,
                "facreg_img": resData?.base64Image,
                "ip_camera": ipCamera,
                "is_depart": resData?.is_depart,
            }
        ]
        try {
            const { data: resInsertLog } = await simpanPelintas(dataRes);
            if (resInsertLog?.status == 201) {
                if (params !== "tolak") {
                    Toast.fire({
                        icon: 'success',
                        title: 'Data Log berhasil ditambahkan'
                    })
                } else if (params === "tolak") {
                    localStorage.removeItem("personId")
                }
                setResData(null)
                setFaceRegData({
                    similiarity: null,
                    faceRegImage: null,
                    profile_image: null,
                    documentImage: null
                })
                setStatus('success')
                setLanjutRealtime(!lanjutRealtime)
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Data Log gagal ditambahkan'
            })
            setStatus('success')
            console.error("Error inserting log data:", error);
        }
    }

    const connectToSocket = (params) => {
        if (!params) {
            return
        }
        const newSocket = io(`${url_socket}:4030`)
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }


    const Ulangi = () => {
        socket.emit("realtimeFR", { ipCamera })
        localStorage.removeItem("personId")
        setLanjutRealtime(false)
    }

    useEffect(() => {
        if (!socket) {
            return
        }
        socket.emit("realtimeFR", { ipCamera })

        socket.on("realtimeFRResponse", (res) => {
            const { status, data } = res
            if (status === 200) {
                const personId = localStorage.getItem("personId")
                if (data?.personId !== personId) {
                    setResData(data)
                    setFaceRegData({
                        similiarity: data?.images_info[0]?.similarity,
                        faceRegImage: data.base64Image,
                        profile_image: data.profile_image,
                        documentImage: data.photo_passport
                    })
                    localStorage.setItem("personId", data?.personId)
                } else {
                    setResData(null)
                    setFaceRegData({
                        similiarity: null,
                        faceRegImage: null,
                        profile_image: null,
                        documentImage: null
                    })
                    // localStorage.removeItem("personId")
                    socket.emit("realtimeFR", { ipCamera })
                }
            } else {
                setResData(null)
                setFaceRegData({
                    similiarity: null,
                    faceRegImage: null,
                    profile_image: null,
                    documentImage: null
                })
                socket.emit("realtimeFR", { ipCamera })
            }
        })
        socket.on("disconnect", () => {
            // Toast.fire({
            //     icon: 'error',
            //     title: 'Socket disconnected'
            // })
        })

        return () => {
            socket.disconnect()
        }
    }, [socket])

    useEffect(() => {
        if (lanjutRealtime) {
            socket.emit("realtimeFR", { ipCamera })
            setLanjutRealtime(false)
        }
    }, [lanjutRealtime])

    // useEffect(() => {
    //     if (personId) {
    //         personIdRef.current = personId
    //     }
    // }, [personId])


    useEffect(() => {
        fetchAllIp()
        getIpCamera()
    }, [])
    const IsFaceRegDataNull = Object.values(faceRegData).every(value => value === null);

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Realtime FaceReg</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor realtime face recognition from cameras</p>
                </div>
                <div className="flex flex-row gap-4">
                    {ipCamera && (
                        <button
                            className="px-4 py-2 text-sm font-medium cursor-pointer border-none text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-sm"
                            onClick={() => setModalOpen(true)}
                        >
                            Input Data Manual
                        </button>
                    )}
                    {ipCamera && (
                        <button
                            className="px-4 py-2 text-sm font-medium cursor-pointer border border-gray-200 text-gray-700 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300 shadow-sm"
                            onClick={handleClearCamera}
                            disabled={status == "loading"}
                        >
                            Ganti Kamera
                        </button>
                    )}
                </div>
            </div>

            {ipCamera ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden p-6 gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-center font-semibold text-gray-700">Foto Document</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50 h-[300px]">
                                {faceRegData.documentImage ? (
                                    <img
                                        src={`data:image/jpeg;base64,${faceRegData.documentImage}`}
                                        alt="Document"
                                        className="object-contain w-full h-full"
                                    />
                                ) : (
                                    <FaImage size={80} className="text-gray-300" />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <h3 className="text-center font-semibold text-gray-700">Foto Register</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50 h-[300px]">
                                {faceRegData.profile_image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${faceRegData.profile_image}`}
                                        alt="Register"
                                        className="object-contain w-full h-full"
                                    />
                                ) : (
                                    <FaImage size={80} className="text-gray-300" />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <h3 className="text-center font-semibold text-gray-700">Foto FaceReg</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50 h-[300px]">
                                {faceRegData.faceRegImage ? (
                                    <img
                                        src={`data:image/jpeg;base64,${faceRegData.faceRegImage}`}
                                        alt="FaceReg"
                                        className="object-contain w-full h-full"
                                    />
                                ) : (
                                    <FaImage size={80} className="text-gray-300" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 mt-4">
                        <div className="bg-gray-50 px-8 py-4 rounded-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 m-0">Skor Kemiripan : <span className={faceRegData?.similiarity >= 80 ? "text-green-600" : faceRegData?.similiarity ? "text-red-600" : ""}>{faceRegData?.similiarity ?? "-"}</span></h2>
                        </div>

                        {!IsFaceRegDataNull && (
                            <div className="flex justify-center gap-4">
                                <button
                                    className="py-3 px-8 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 min-w-[140px] rounded-lg border-none cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                                    disabled={status == "loading"}
                                    onClick={() => insertDataLog("tolak")}
                                >
                                    Tolak
                                </button>
                                <button
                                    className="py-3 px-8 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 min-w-[140px] rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    onClick={Ulangi}
                                    disabled={status == "loading"}
                                >
                                    {status == "loading" ? (
                                        <><span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span> Mohon Tunggu...</>
                                    ) : (
                                        "Ulangi"
                                    )}
                                </button>
                                <button
                                    className={`py-3 px-8 text-sm font-semibold text-white min-w-[140px] rounded-lg border-none shadow-sm transition-colors ${score === 100 ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                                    onClick={() => insertDataLog("izinkan")}
                                    disabled={status == "loading"}
                                >
                                    Izinkan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden max-w-2xl mx-auto w-full mt-10">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-navy-900">Pilih Kamera</h2>
                        <p className="text-gray-500 text-sm mt-1">Pilih kamera untuk memulai monitoring Face Recognition</p>
                    </div>
                    <div className="p-6 flex gap-4 items-end">
                        <div className="flex-1 flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-semibold text-gray-700">Kamera</label>
                            <select
                                value={selectedCamera}
                                onChange={handleSelectCamera}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                            >
                                <option value="">Pilih Kamera</option>
                                {listCamera.map((data, index) => (
                                    <option key={index} value={data.ipAddress}>{`${data.namaKamera} - ${data.ipAddress}`}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm h-[38px] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleConfirmCamera}
                            disabled={!selectedCamera}
                        >
                            Konfirmasi
                        </button>
                    </div>
                </div>
            )}
            
            <ModalData open={modalOpen} onClose={() => { setModalOpen(false) }} />
        </div>
    );
}

export default RealtimeFaceReg