import React, { useEffect, useRef, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import ario from '../../assets/images/ario.jpeg'
import { useNavigate } from 'react-router-dom'
import { apiGetDataLogRegister, deleteDataUserPlb, editDataUserPlb } from '../../services/api'
import { url_devel } from '../../services/env'
import Modals from '../../components/Modal/Modal'
import dataNegara from '../../utils/dataNegara'
import { initiateSocket4010 } from '../../utils/socket'
import axios from 'axios'

const LogRegister = () => {
    const socket_IO_4010 = initiateSocket4010();
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [status, setStatus] = useState("loading")
    const [detailData, setDetailData] = useState({
        passport_number: "",
        register_code: "",
        full_name: "",
        date_of_birth: "",
        nationality: "",
        expiry_date: "",
        arrivalTime: "",
        destination_location: "",
        photo_passport: "",
        profile_image: ""

    })
    const [search, setSearch] = useState({
        name: "",
        no_passport: "",
        startDate: "",
        endDate: ""
    })
    const navigate = useNavigate()
    const [logData, setLogData] = useState([])
    const refInputFace = useRef();
    const refInputPassport = useRef()
    const [imageFace, setImageFace] = useState(null)
    const [imagePassport, setImagePassport] = useState(null)
    const dummy = [
        {
            id: 1,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },
        {
            id: 2,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },
        {
            id: 3,
            no_plb: '3213122131',
            no_register: "431412321",
            name: "ario",
            gender: 'laki-laki',
            nationality: 'indonesia',
            profile_image: ario
        },

    ]

    const getLogRegister = async () => {
        try {
            const res = await apiGetDataLogRegister({
                ...search
            })
            if (res.status == 200) {
                console.log(res.data.data, "res.data.data")
                setStatus("success")
                setLogData(res.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLogRegister()
    }, [])

    const deleteModal = (row) => {
        setDetailData({
            ...detailData,
            no_passport: row.no_passport || "",
            no_register: row.no_register || "",
            name: row.name || "",
            date_of_birth: row.date_of_birth || "",
            nationality: row.nationality || "",
            expiry_date: row.expired_date || "",
            gender: row.gender || "",
            arrival_time: row.arrival_time || new Date().toISOString().split('T')[0],
            destination_location: row.destination_location || "",
            photo_passport: row.photo_passport || "",
            profile_image: row.profile_image || "",
        })
        setShowModalDelete(true)
    }
    const closeDeleteModal = () => {
        setDetailData({
            no_passport: "",
            no_register: "",
            name: "",
            date_of_birth: "",
            nationality: "",
            expiry_date: "",
            gender: "",
            arrival_time: "",
            destination_location: "",
            photo_passport: "",
            profile_image: ""
        })
        setShowModalDelete(false)
    }

    const handleDelete = async () => {
        try {
            const res = await deleteDataUserPlb(detailData.no_passport)
            console.log(res, "res delete")
            if (res.status == 200) {
                socket_IO_4010.emit('deleteDataUser', {
                    no_passport: detailData.no_passport
                })
                socket_IO_4010.on('responseDeleteDataUser', (data) => {
                    console.log(data, "res socket")
                    if (data === "Successfully") {
                        getLogRegister()
                        setShowModalDelete(false)
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleImageFace = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result;
                setDetailData({
                    ...detailData,
                    [event.target.name]: base64String
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const customRowRenderer = (row) => (
        <>
            <td>{row.no_passport}</td>
            <td>{row.no_register}</td>
            <td>{row.name}</td>
            <td>{row.gender === "M" ? "Laki-laki" : "Perempuan"}</td>
            <td>{row.nationality}</td>
            <td>
                <img
                    src={`data:image/jpeg;base64,${row.profile_image}`}
                    alt="Profile"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                />
            </td>
            <td className='button-action' style={{ height: '100px', display: 'flex', alignItems: "center" }}>
                {/* <button onClick={() => openModalEdit(row)}>Edit</button> */}
                <button onClick={() => deleteModal(row)} style={{ background: 'red' }}>Delete</button>
            </td>
        </>
    );

    const generateExcel = () => {
        const Excel = require("exceljs");
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        // Add column headers
        const headers = ['No', 'no plb', 'no register', 'name', 'gender', 'nationality']
        worksheet.addRow(headers);

        // Add data rows
        logData.forEach((item, index) => {
            const row = [
                index + 1,
                item.no_passport,
                item.no_register,
                item.name,
                item.gender === "M" ? "Laki-laki" : "Perempuan",
            ];
            worksheet.addRow(row);
        });



        // Save the workbook
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const getFilenameWithDateTime = (baseFilename) => {
                const now = new Date();
                const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
                const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
                return `${baseFilename.replace('.xlsx', '')}_${date}_${time}.xlsx`;
            };

            // Example usage
            const baseFilename = "Log_Register.xlsx";
            const filename = getFilenameWithDateTime(baseFilename);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // For IE
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                // For other browsers
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        });
    };

    const modalAddInput = () => {
        return (
            <div className="register-container">
                <div className="register-input">
                    <span>PLB / BCP Number</span>
                    <input type="text" name="no_passport" id="" value={detailData.no_passport} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Full Name</span>
                    <input type="text" name="name" id="" value={detailData.name} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Date of Birth</span>
                    <input type="date" name="date_of_birth" id="" value={detailData.date_of_birth} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Gender</span>
                    <select value={detailData.gender} name='gender' onChange={handleChange}>
                        <option value="">Pilih Gender</option>
                        <option value="M">Laki-Laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div className="register-input">
                    <span>Nationality</span>
                    <select value={detailData.nationality} name='nationality' onChange={handleChange}>
                        <option value="">Pilih Negara</option>
                        {dataNegara.data.map((negara) => {
                            return (
                                <option value={negara.id_negara}>{`${negara.id_negara} - ${negara.deskripsi_negara}`}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="register-input">
                    <span>Expired Date</span>
                    <input type="date" name="expiry_date" id="" value={detailData.expiry_date} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Arrival Time</span>
                    <input type="datetime-local" name="arrival_time" id="" value={detailData.arrival_time} onChange={handleChange} />
                </div>
                <div className="register-input" style={{ marginBottom: '5rem' }}>
                    <span>Destination Location</span>
                    <input type="text" name="destination_location" id="" value={detailData.destination_location} onChange={handleChange} />
                </div>
                <div className="register-input input-file" style={{ marginBottom: '7rem' }}>
                    <span>Face</span>
                    <div className="input-file-container" onClick={() => refInputFace.current?.click()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {detailData.profile_image ?
                            (
                                <img src={detailData.profile_image.includes('user_profile_images/') ? `${url_devel}storage/${detailData.profile_image}`
                                    : detailData.profile_image}
                                    alt="" height={175} />
                            )
                            :
                            (<span>Drag and Drop here </span>)}
                    </div>
                    <input type="file" name="profile_image" id="" style={{ display: 'none' }} ref={refInputFace} onChange={(e) => handleImageFace(e)} />
                </div>
                <div className="register-input input-file" style={{ paddingTop: '2rem' }}>
                    <span>Passport Image</span>
                    <div className="input-file-container" onClick={() => refInputPassport.current?.click()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {detailData.photo_passport ?
                            (
                                <img src={detailData.photo_passport.includes('user_photo_passport/') ? `${url_devel}storage/${detailData.photo_passport}`
                                    : detailData.photo_passport}
                                    alt="" height={175} />
                            )
                            :
                            (<span>Drag and Drop here </span>)}
                    </div>
                    <input type="file" name="photo_passport" id="" style={{ display: 'none' }} ref={refInputPassport} onChange={(e) => handleImageFace(e)} />
                </div>

            </div>
        )
    }

    const closeModalAdd = () => {
        setShowModalAdd(false)
    }


    const openModalEdit = (row) => {
        console.log(row, "row")
        setDetailData({
            ...detailData,
            no_passport: row.no_passport || "",
            no_register: row.no_register || "",
            name: row.name || "",
            date_of_birth: row.date_of_birth || "",
            nationality: row.nationality || "",
            expired_date: row.expired_date || "",
            gender: row.gender || "",
            arrival_time: row.arrival_time.split(':').slice(0, 2).join(':') || new Date().toISOString().split('T')[0],
            destination_location: row.destination_location || "",
            photo_passport: row.photo_passport || "",
            profile_image: row.profile_image || "",
        })
        setShowModalEdit(true)
    }

    const closeModaledit = () => {
        setDetailData({
            no_passport: "",
            no_register: "",
            name: "",
            date_of_birth: "",
            nationality: "",
            expired_date: "",
            gender: "",
            arrival_time: "",
            destination_location: "",
            photo_passport: "",
            profile_image: ""
        })
        setShowModalEdit(false)
    }
    const handleChange = (e) => {
        setDetailData({
            ...detailData,
            [e.target.name]: e.target.value
        })
    }
    const modalEditInput = () => {
        return (
            <div className="register-container">
                <div className="register-input">
                    <span>PLB / BCP Number</span>
                    <input type="text" name="no_passport" id="" value={detailData.no_passport} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Full Name</span>
                    <input type="text" name="name" id="" value={detailData.name} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Date of Birth</span>
                    <input type="date" name="date_of_birth" id="" value={detailData.date_of_birth} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Gender</span>
                    <select value={detailData.gender} name='gender' onChange={handleChange}>
                        <option value="">Pilih Gender</option>
                        <option value="M">Laki-Laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div className="register-input">
                    <span>Nationality</span>
                    <select value={detailData.nationality} name='nationality' onChange={handleChange}>
                        <option value="">Pilih Negara</option>
                        {dataNegara.data.map((negara) => {
                            return (
                                <option value={negara.id_negara}>{`${negara.id_negara} - ${negara.deskripsi_negara}`}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="register-input">
                    <span>Expired Date</span>
                    <input type="date" name="expired_date" id="" value={detailData.expired_date} onChange={handleChange} />
                </div>
                <div className="register-input">
                    <span>Arrival Time</span>
                    <input type="datetime-local" name="arrival_time" id="" value={detailData.arrival_time} onChange={handleChange} />
                </div>
                <div className="register-input" style={{ marginBottom: '5rem' }}>
                    <span>Destination Location</span>
                    <input type="text" name="destination_location" id="" value={detailData.destination_location} onChange={handleChange} />
                </div>
                <div className="register-input input-file" style={{ marginBottom: '7rem' }}>
                    <span>Face</span>
                    <div className="input-file-container" onClick={() => refInputFace.current?.click()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {detailData.profile_image ?
                            (
                                <img src={detailData.profile_image ? `data:image/jpeg;base64,${detailData.profile_image}`
                                    : detailData.profile_image}
                                    alt="" height={175} />
                            )
                            :
                            (<span>Drag and Drop here </span>)}
                    </div>
                    <input type="file" name="profile_image" id="" style={{ display: 'none' }} ref={refInputFace} onChange={(e) => handleImageFace(e)} />
                </div>
                <div className="register-input input-file" style={{ paddingTop: '2rem' }}>
                    <span>Passport Image</span>
                    <div className="input-file-container" onClick={() => refInputPassport.current?.click()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {detailData.photo_passport ?
                            (
                                <img src={detailData.photo_passport ? `data:image/jpeg;base64,${detailData.photo_passport}`
                                    : detailData.photo_passport}
                                    alt="" height={175} />
                            )
                            :
                            (<span>Drag and Drop here </span>)}
                    </div>
                    <input type="file" name="photo_passport" id="" style={{ display: 'none' }} ref={refInputPassport} onChange={(e) => handleImageFace(e)} />
                </div>

            </div>
        )
    }

    const handleEdit = async () => {
        try {
            const res = await editDataUserPlb(detailData, detailData.no_passport)
            const dataEdit = {
                method: "addfaceinfonotify",
                params: {
                    data: [
                        {
                            personId: detailData.passport_number,
                            personNum: detailData.register_code,
                            passStrategyId: "",
                            personIDType: 1,
                            personName: detailData.full_name,
                            personGender: detailData.gender === "M" ? 1 : 0,
                            validStartTime: Math.floor(new Date().getTime() / 1000).toString(),
                            validEndTime: Math.floor(new Date(`${detailData.expiry_date}T23:59:00`).getTime() / 1000).toString(),
                            personType: 1,
                            identityType: 1,
                            identityId: detailData.passport_number,
                            identitySubType: 1,
                            identificationTimes: -1,
                            identityDataBase64: detailData.profile_image ? detailData.profile_image : "",
                            status: 0,
                            reserve: "",
                        }
                    ],
                }
            }
            if (res.status == 200) {
                socket_IO_4010.emit('editDataUser', dataEdit)
                socket_IO_4010.on('responseEditDataUser', (data) => {
                    console.log(data, "res socket")
                    if (data == "Successfully") {
                        getLogRegister()
                        setShowModalDelete(false)
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const modalDelete = () => {
        return (
            <div className="" >
                <span
                    style={{ fontSize: 25, fontWeight: '400' }}
                >Are You Sure Want Delete <span style={{ fontWeight: "bold" }}>{detailData.name}</span> with passport <span style={{ fontWeight: "bold" }}>{detailData.no_passport}</span> ?</span>
            </div>
        )
    }
    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container">
                <div className="search-table-list">
                    <div className="search-table">
                        <span>Nomor PLB : </span>
                        <input type="text" placeholder='Masukkan nomor plb' value={search.no_passport} onChange={(e) => setSearch({ ...search, no_passport: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>Nama : </span>
                        <input type="text" placeholder='Masukkan nama' value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>Start Date : </span>
                        <input type="datetime-local" value={search.startDate} onChange={(e) => setSearch({ ...search, startDate: e.target.value })} />
                    </div>
                    <div className="search-table">
                        <span>End Date : </span>
                        <input type="datetime-local" value={search.endDate} onChange={(e) => setSearch({ ...search, endDate: e.target.value })} />
                    </div>
                </div>
                <div className="buttons-container" style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={getLogRegister}
                        style={{ backgroundColor: "#0e2133" }}
                    >Search
                    </button>
                    <button
                        onClick={generateExcel}
                        style={{ backgroundColor: "green" }}
                    >Export
                    </button>
                    {/* <button
                        onClick={() => setShowModalAdd(true)}
                        style={{ backgroundColor: "#11375c" }}
                    >Add
                    </button> */}
                </div>
            </div>
            {status === "loading" && (
                <div className="loading">
                    <span className="loader-loading-table"></span>
                </div>
            )}
            {status === "success" && logData && <TableLog
                tHeader={['No', 'no plb', 'no register', 'name', 'gender', 'nationality', 'profile image', "action"]}
                tBody={logData}
                // handler={getDetailData}
                rowRenderer={customRowRenderer}
            />}
            <Modals
                showModal={showModalAdd}
                buttonName="Submit"
                width={800}
                headerName="Add Register"
                closeModal={closeModalAdd}
            >
                {modalAddInput()}
            </Modals>
            <Modals
                showModal={showModalEdit}
                buttonName="Submit"
                width={800}
                headerName="Edit Register"
                closeModal={closeModaledit}
                onConfirm={handleEdit}
            >
                {modalEditInput()}
            </Modals>
            <Modals
                showModal={showModalDelete}
                buttonName="Confirm"
                width={800}
                headerName="Delete Register"
                closeModal={closeDeleteModal}
                onConfirm={handleDelete}
            >
                {modalDelete()}
            </Modals>
        </div>
    )
}

export default LogRegister