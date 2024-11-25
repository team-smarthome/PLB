import React, { useEffect, useState } from 'react'
import ImageSample from '../../assets/images/register_sample.jpg'
import Select from 'react-select'
import { apiGetAllIp } from '../../services/api'
import Cookies from 'js-cookie'
import './realtimefacereg.css'
import { FaImage } from 'react-icons/fa'
import { initiateSocket4020 } from '../../utils/socket'
import { Toast } from '../Toast/Toast'
import ModalData from '../Modal/ModalData'

const RealtimeFaceReg = () => {
    const socket = initiateSocket4020()
    const [score, setScore] = useState(100)
    const [ipCamera, setIpCamera] = useState("")
    const [listCamera, setListCamera] = useState([])
    const [selectedCamera, setSelectedCamera] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [resData, setResData] = useState(null)
    const [status, setStatus] = useState('idle')
    const [faceRegData, setFaceRegData] = useState({
        similiarity: null,
        // faceRegImage: "https://ftnews.co.id/storage/2024/09/Sumanto.jpg",
        faceRegImage: null,
        // profile_image: ImageSample,
        profile_image: null,
        // documentImage: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Indonesian_passport_data_page.jpg",
        documentImage: null
    })

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
        }
    }

    const handleSelectCamera = (e) => {
        setSelectedCamera(e.target.value)
    }

    const handleConfirmCamera = () => {
        setIpCamera(selectedCamera)
        localStorage.setItem("ipCameraFaceReg", selectedCamera)
    }

    const handleClearCamera = () => {
        setIpCamera("")
        localStorage.removeItem("ipCameraFaceReg", selectedCamera)
    }

    const functionCheckRealtime = async () => {
        if (socket.connected) {
            socket.emit("realtimeFR", { ipCamera });
        } else {
            console.log("Socket not connected")
            socket.connect()
        }
    }

    const insertDataLog = async () => {
        const dataRes = [
            {
                personId: resData?.personId,
                personCode: resData?.personCode,
                name: resData?.name,
                similarity: resData?.images_info[0]?.similarity || 0,
                passStatus: resData?.passStatus === 6 ? "Failed" : "Success",
                time: resData?.time,
                img_path: resData?.base64Image,
                ipCamera: ipCamera,
                is_depart: resData?.is_depart,

            }
        ]
        try {
            const { data: resInsertLog } = await apiInsertLog(dataRes);
            if (resInsertLog?.status == 200) {
                console.log("Data berhasil diinsert")
            }
        } catch (error) {
            console.error("Error inserting log data:", error);
        }
    }


    useEffect(() => {
        socket.on("realtimeFRResponse", (res) => {
            setStatus('loading')
            const { status, data } = res
            if (status == 200) {
                setStatus('success')
                setResData(data)
                setFaceRegData({
                    similiarity: data?.images_info[0]?.similarity,
                    faceRegImage: data.base64Image,
                    profile_image: data.profile_image,
                    documentImage: data.photo_passport
                })
            } else if (status == 404) {
                setStatus('failed')
                Toast.fire({
                    icon: 'error',
                    title: 'Data tidak ditemukan'
                })
                setResData(null)
                setFaceRegData({
                    similiarity: null,
                    faceRegImage: null,
                    profile_image: null,
                    documentImage: null
                })
                
            }else{
                setStatus('failed')
            }
            setStatus('failed')
        })
    }, [socket])

    useEffect(() => {
        console.log(faceRegData, "dasdasdasasdad")
    }, [faceRegData])

    useEffect(() => {
        fetchAllIp()
        getIpCamera()
    }, [])
    const IsFaceRegDataNull = Object.values(faceRegData).every(value => value === null);

    return (
        <div
            className='p-8'
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
                                        <div className="w-[450px] h-[300px] flex justify-center items-center bg-gray-200">
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
                                        <div className="w-[450px] h-[300px] flex justify-center items-center bg-gray-200">
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
                                        <div className="w-[450px] h-[300px] flex justify-center items-center bg-gray-200">
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
                                        >Tolak</button>
                                        <button
                                            className='p-2 text-lg text-white bg-btnPrimary hover:bg-[#0F2D4B] min-w-36 rounded-xl border-1 border-black cursor-pointer'
                                            onClick={functionCheckRealtime}
                                            disabled={status == "loading"}
                                        >{status == "loading" ? "Mohon Tunggu..." : "Ulangi"}</button>
                                        <button
                                            // disabled={score < 100}
                                            className={`p-2 text-lg text-white ${score === 100 ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-6e00"} min-w-36 rounded-xl border-none ${score == 100 ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            onClick={insertDataLog}
                                            disabled={status == "loading"}
                                        >Ijinkan</button>
                                    </div>
                                </> :
                                <>
                                    <div className="flex justify-center mb-8">
                                        <button
                                            className={`p-2 text-lg text-white bg-btnPrimary hover:bg-[#0F2D4B] w-40 rounded-xl border-none cursor-pointer`}
                                            onClick={functionCheckRealtime}
                                            disabled={status == "loading"}
                                        >{status == "loading" ? "Mohon Tunggu... " : "Periksa Data"}</button>
                                    </div>
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
                                        {/* <label htmlFor="isDepart" className="w-[30%]">
                    Depart Status
                    </label> */}
                                        <select
                                            value={selectedCamera}
                                            onChange={handleSelectCamera}
                                        // name='nationality' 
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
            // doneProgres={GetDataUserLog} 
            />
        </div>
    )
}

export default RealtimeFaceReg