import React, { useEffect, useRef, useState } from 'react'
import { apiGetAllIp, simpanPelintas } from '../../services/api'
import Cookies from 'js-cookie'
import './realtimefacereg.css'
import { FaImage } from 'react-icons/fa'
import { Toast } from '../Toast/Toast'
import ModalData from '../Modal/ModalData'
import { io } from 'socket.io-client'


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
        const newSocket = io('http://localhost:4030')
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }

    useEffect(() => {
        if (!socket) {
            return
        }
        socket.emit("realtimeFR", { ipCamera })

        socket.on("realtimeFRResponse", (res) => {
            const { status, data } = res
            const personId = localStorage.getItem("personId")
            if (status === 200) {
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
        <div
            className='p-8  '
        >
            <div className="flex justify-between items-center">
                <h2>Realtime FaceReg</h2>
                <div className="flex flex-row gap-4">
                    {ipCamera &&
                        <button
                            className='
                p-4 text-sm font-bold cursor-pointer border-0 text-white rounded bg-transparent bg-blue-500'
                            onClick={() => setModalOpen(true)}
                        >Input Data Manual</button>
                    }
                    {ipCamera && <button
                        className='p-4 text-sm font-bold cursor-pointer border-1 text-black rounded bg-transparent hover:bg-gray-200 transition-colors duration-300'
                        onClick={handleClearCamera}
                        disabled={status == "loading"}
                    >
                        Ganti Kamera
                    </button>}
                </div>
            </div>
            {
                ipCamera ?
                    <>
                        <div className="flex flex-row-reverse justify-evenly items-center gap-4 ">
                            <div className="">
                                <h3>Foto Document</h3>
                                {
                                    faceRegData.documentImage ? (
                                        <img
                                            src={`data:image/jpeg;base64,${faceRegData.documentImage}`}
                                            alt="Document Image"
                                            className='object-cover'
                                            height={300}
                                        />
                                    ) : (
                                        <div className="w-[400px] h-[300px] flex justify-center items-center bg-gray-200">
                                            <FaImage size={150} color="#aaa" />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="">
                                <h3>Foto Register</h3>
                                {
                                    faceRegData.profile_image ? (
                                        <img
                                            src={`data:image/jpeg;base64,${faceRegData.profile_image}`}
                                            alt="Document Image"
                                            className='object-cover'
                                            height={300}
                                        />
                                    ) : (
                                        <div className="w-[400px] h-[300px] flex justify-center items-center bg-gray-200">
                                            <FaImage size={150} color="#aaa" />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="">
                                <h3>Foto FaceReg</h3>
                                {
                                    faceRegData.faceRegImage ? (
                                        <img
                                            src={`data:image/jpeg;base64,${faceRegData.faceRegImage}`}
                                            alt="Document Image"
                                            className='object-cover'
                                            height={300}
                                        />
                                    ) : (
                                        <div className="w-[400px] h-[300px] flex justify-center items-center bg-gray-200">
                                            <FaImage size={150} color="#aaa" />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="pt-4 flex justify-center">
                            <h2>Skor Kemiripan : {faceRegData?.similiarity ?? "-"}</h2>
                        </div>
                        {
                            !IsFaceRegDataNull ?
                                <>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className='p-2 text-lg text-white bg-red-800 hover:bg-red-900 min-w-36 rounded-xl border-none cursor-pointer'
                                            disabled={status == "loading"}
                                            onClick={() => insertDataLog("tolak")}
                                        >Tolak</button>
                                        <button
                                            className='p-2 text-lg text-white bg-btnPrimary hover:bg-[#0F2D4B] min-w-36 rounded-xl border-1 border-black cursor-pointer'
                                            onClick={connectToSocket}
                                            disabled={status == "loading"}
                                        >{status == "loading" ? "Mohon Tunggu..." : "Ulangi"}</button>
                                        <button
                                            className={`p-2 text-lg text-white ${score === 100 ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-6e00"} min-w-36 rounded-xl border-none ${score == 100 ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            onClick={() => insertDataLog("izinkan")}
                                            disabled={status == "loading"}
                                        >Ijinkan</button>
                                    </div>
                                </> :
                                <>

                                </>
                        }
                    </> :
                    <>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="container-dalam">
                                <div className="bagian-atas-server">
                                    <p className="">Pilih Kamera</p>
                                </div>
                                <div className="bagian-bawah-server flex gap-6">
                                    <div className="w-full flex items-center">
                                        <select
                                            value={selectedCamera}
                                            onChange={handleSelectCamera}
                                        >
                                            <option value="">Pilih Kamera</option>
                                            {listCamera.map((data) => {
                                                return (
                                                    <option value={data.ipAddress}>{`${data.namaKamera} - ${data.ipAddress}`}</option>
                                                )
                                            })}
                                        </select>

                                    </div>
                                    <button className="ok-button"
                                        onClick={handleConfirmCamera}
                                    >
                                        Konfirmasi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
            }
            <ModalData open={modalOpen} onClose={() => { setModalOpen(false) }}
            />
        </div>
    )
}

export default RealtimeFaceReg