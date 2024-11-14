import React, { useEffect, useState } from 'react'
import { apiGetDataLogRegister, apiInsertLog } from '../../services/api'
import { Toast } from '../Toast/Toast'
import Select from "react-select";


const ModalData = ({ open, onClose, doneProgres }) => {
    const [inputName, setInputName] = useState(true)
    const [data, setData] = useState(null)
    const [isWaiting, setIswaiting] = useState(false)
    const [departStatus, setDepartStatus] = useState(false)
    const [search, setSearch] = useState({
        no_passport: ""
    })

    const selectOptions = [
        { value: false, label: "Arrival" },
        { value: true, label: "Departure" }
    ];

    const functionEpochTime = () => {
        const localDate = new Date();

        const dateString = localDate.toISOString().split('T')[0];

        const timeString = localDate.getHours().toString().padStart(2, '0') + ':' + localDate.getMinutes().toString().padStart(2, '0');

        const dateTimeString = `${dateString}T${timeString}`;

        const dateObject = new Date(dateTimeString);

        return dateObject.getTime();
    }

    useEffect(() => {
        setIswaiting(false)
        setData(null)
        setInputName(true)
        setSearch({
            no_passport: ""
        })
    }, [onClose])

    const handleCheckData = async () => {
        setInputName(false)
        setIswaiting(true)
        try {
            const { data } = await apiGetDataLogRegister({ ...search })
            if (data.status === 200 && data.data.length > 0) {
                setData(data.data[0])
                setIswaiting(false)
                setSearch({
                    no_passport: ""
                })
            } else {
                setIswaiting(false)
                setInputName(true)
                Toast.fire({
                    icon: 'error',
                    title: 'Data tidak ditemukan'
                })
                setSearch({
                    no_passport: ""
                })
            }
        } catch (error) {
            setIswaiting(false)
            setInputName(true)
            Toast.fire({
                icon: 'error',
                title: 'Gagal Mencari Data'
            })
            setSearch({
                no_passport: ""
            })
        }

    }

    const formatDate = (isoString) => {
        if (!isoString) return ""; // Handle null or undefined
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const handleSimpan = async (item) => {
        try {
            const params = [
                {
                    personId: item.no_passport || null,
                    personCode: item.personCode || null,
                    name: item.name || null,
                    similarity: 100,
                    passStatus: "Success",
                    time: functionEpochTime(),
                    img_path: item?.profile_image || null,
                    ipCamera: "0.0.0.0",
                    is_depart: departStatus,
                }
            ]

            const { data } = await apiInsertLog(params)

            if (data.status === 201) {
                Toast.fire({
                    icon: 'success',
                    title: 'Data Berhasil Disimpan'
                })
                onClose()
                doneProgres()
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Gagal Menyimpan Data'
                })
            }
        } catch (error) {
            console.log(error, 'kenapa_error')
            Toast.fire({
                icon: 'error',
                title: 'Tidak Dapat Terhubung Ke Server'
            })
        }
    }


    if (!open) return;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-[60%] h-[65%] flex flex-col">
                <div
                    className="flex justify-between items-center px-6 mb-4"
                    style={{ borderBottom: "2px solid #E5E7EB" }}
                >
                    <h2 className="text-3xl font-semibold">Check Data</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none bg-white border-none hover:bg-slate-50 hover:cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Tab */}

                {/* Modal Content */}
                <div className={`  grid ${inputName || isWaiting ? "grid-cols-1" : "grid-cols-2"}  px-2 flex-grow overflow-y-auto mt-6`}>

                    {isWaiting && (
                        <div className='flex items-center mt-[-3rem]  justify-center'>
                            <p className='text-4xl font-font-bold'>Mohon Tunggu....</p>
                        </div>
                    )}
                    {inputName && (
                        <form className='flex items-center mt-[-3rem] justify-center' onSubmit={handleCheckData}>
                            <div className='flex items-center justify-center flex-col px-16 pt-10 pb-4 bg-slate-200 rounded-lg'>
                                <p className='text-slate-800 text-3xl font-semibold'>Input Data Log Pelintas Manual</p>
                                <div className='w-full flex flex-col gap-5'>
                                    <div>
                                        <p className='text-black text-start'>Masukan Nomor PLB / BCP</p>
                                        <input
                                            type="text"
                                            className="w-full p-4  bg-white"
                                            placeholder="Masukan Nomor PLB / BCP"
                                            value={search.no_passport}
                                            onChange={(e) => setSearch({ ...search, no_passport: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-black text-start'>Masukan Nomor PLB / BCP</p>
                                        <Select
                                            onChange={(e) => setDepartStatus(e.value)}
                                            options={selectOptions}
                                            placeholder="Silakan Pilih Status Keberangkatan"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            styles={{
                                                container: (provided) => ({
                                                    ...provided,
                                                    position: 'relative',
                                                    flex: 1,
                                                    width: "108%",
                                                    borderRadius: "10px",
                                                    backgroundColor: "white",
                                                    fontFamily: "Roboto, Arial, sans-serif",
                                                }),
                                                valueContainer: (provided) => ({
                                                    ...provided,
                                                    flex: 1,
                                                    width: "100%",
                                                }),
                                                control: (provided) => ({
                                                    ...provided,
                                                    flex: 1,
                                                    width: "100%",
                                                    backgroundColor: "white",
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="text-white text-lg font-normal px-10 py-3 bg-[#17C964] border-none rounded-lg hover:bg-[#1AAB4A] focus:outline-none hover:cursor-pointer mt-4"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    )}
                    {data && (
                        <>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block text-slate-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={data?.name}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Kewarganegaraan
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={data?.nationality}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={data?.date_of_birth}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Nomor PLB / BCP
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={data?.no_passport}
                                    readOnly
                                />
                            </div>
                            <div className="px-3 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Jenis Kelamin
                                </label>
                                <input
                                    id="input2"
                                    type="text"
                                    className="w-[90%]  p-4 mt-2 bg-white"
                                    value={data?.gender === "M" ? "Laki-Laki" : "Perempuan"}
                                    readOnly
                                />
                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Tanggal Registrasi
                                </label>
                                <input
                                    id="input1"
                                    type="text"
                                    className="w-[90%] p-4 mt-2 bg-white"
                                    value={formatDate(data?.created_at)}
                                    readOnly
                                />
                            </div>

                            <div className="px-3 py-3">
                                <label htmlFor="input1" className="block  text-slate-700">
                                    Foto Wajah
                                </label>
                                <img

                                    src={`data:image/jpeg;base64,${data?.profile_image}`}
                                    alt="profile"
                                    className="w-[60%] h-[60%] p-4 mt-2 bg-white"
                                />

                            </div>
                            <div className="px-4 py-3">
                                <label htmlFor="input2" className="block  text-slate-700">
                                    Foto Dokumen PLB
                                </label>
                                <img
                                    src={`data:image/jpeg;base64,${data?.photo_passport}`}
                                    alt="profile"
                                    className="w-[60%] h-[60%] p-4 mt-2 bg-white"
                                />

                            </div>
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                <div className={`flex justify-end space-x-4 p-4`}>
                    {data && (
                        <>
                            <button
                                onClick={onClose}
                                className="text-base text-white px-4 py-3 bg-[#F31260] border-none rounded-lg hover:bg-[#D30F56] focus:outline-none hover:cursor-pointer"
                            >
                                Batalkan
                            </button>
                            <button

                                className={`text-base text-white px-4 py-3 bg-[#17C964] border-none rounded-lg hover:bg-[#1AAB4A] focus:outline-none hover:cursor-pointer`}
                                onClick={() => handleSimpan(data)}
                            >
                                Kirim
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div >
    )
}

export default ModalData
