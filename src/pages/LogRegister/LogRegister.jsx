import React, { useEffect, useRef, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import { useNavigate } from 'react-router-dom'
import { apiGetDataLogRegister, deleteDataUserPlb, editDataUserPlb, getAllNegaraData } from '../../services/api'
import { url_devel } from '../../services/env'
import Modals from '../../components/Modal/Modal'
import dataNegara from '../../utils/dataNegara'
import { initiateSocket4010 } from '../../utils/socket'
import Cookies from 'js-cookie';
import './logregister.style.css'
import Pagination from '../../components/Pagination/Pagination'
import Select from "react-select";
import Excel from "exceljs";
import { formatDateToIndonesian } from '../../utils/formatDate'

const LogRegister = () => {
    const socket_IO_4010 = initiateSocket4010();
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [status, setStatus] = useState("loading")
    const [totalDataFilter, setTotalDataFilter] = useState(0);
    const [isErrorImage, setIsErrorImage] = useState(false);
    const [page, setPage] = useState(1);
    const [detailData, setDetailData] = useState({
        passport_number: "",
        // register_code: "",
        full_name: "",
        date_of_birth: "",
        nationality: "",
        expiry_date: "",
        arrivalTime: "",
        destination_location: "",
        photo_passport: "",
        profile_image: ""

    })
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [search, setSearch] = useState({
        name: "",
        no_passport: "",
        startDate: "",
        endDate: "",
        gender: "",
        nationality: "",
    })
    const navigate = useNavigate()
    const [logData, setLogData] = useState([])
    const refInputFace = useRef();
    const refInputPassport = useRef()
    const [imageFace, setImageFace] = useState(null)
    const [imagePassport, setImagePassport] = useState(null)
    const [countryData, setCountryData] = useState([])
    const [changePage, setChangePage] = useState(false)
    const [dataNationality, setDataNationality] = useState([])


    const dataGender = [
        { value: "", label: "All Gender" },
        { value: "M", label: "MALE" },
        { value: "F", label: "FEMALE" },
    ];

    const getDataNationality = async () => {
        try {
            const { data } = await getAllNegaraData();
            if (data.status === 200) {
                console.log(data.data, "dataNegara")
                setDataNationality(data.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataNationality();
    }, []);

    const getLogRegister = async () => {
        try {
            const res = await apiGetDataLogRegister({
                ...search
            })
            if (res.data.status == 200) {
                console.log(res?.data, "consoleRegiste")
                setStatus("success")
                setLogData(res?.data?.data)
                setPagination(res?.data?.pagination);
                setTotalDataFilter(res.data?.data.length);
                setChangePage(false)
            }
        } catch (error) {
            setStatus("success")
            console.log(error.message)
        }
    }
    const getCountryData = async () => {
        try {
            const res = await getAllNegaraData()
            setCountryData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLogRegister()
        getCountryData()
    }, [])

    useEffect(() => {
        if (changePage) {
            getLogRegister()
        }

    }, [changePage])


    useEffect(() => {
        setSearch(prevState => ({
            ...prevState,
            page: page
        }));
        setChangePage(true)
    }, [page]);

    const deleteModal = (row) => {
        setDetailData({
            ...detailData,
            no_passport: row.no_passport || "",
            // no_register: row.no_register || "",
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
            // no_register: "",
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
        setStatus("loading")
        setShowModalDelete(false)
        try {
            const respnse = await new Promise((resolve, reject) => {
                socket_IO_4010.emit('deleteDataUser', {
                    no_passport: detailData.no_passport
                })

                socket_IO_4010.once('responseDeleteDataUser', (data) => {
                    console.log(data, "res_socket_delete")
                    if (data === "Successfully") {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                })
            })

            if (respnse === "Successfully") {
                const { data } = await deleteDataUserPlb(detailData.no_passport)
                if (data.status == 200) {
                    getLogRegister()
                    setShowModalDelete(false)
                    setStatus("success")
                } else {
                    getLogRegister()
                    setShowModalDelete(false)
                    setStatus("success")
                    Toast.fire({
                        icon: 'error',
                        title: 'Failed to delete data'
                    })
                }
            }
        } catch (error) {
            getLogRegister()
            setStatus("success")
            setShowModalDelete(false)
            Toast.fire({
                icon: 'error',
                title: 'Failed to delete data'
            })
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

    const handleError = () => {
        setIsErrorImage(true);
    };

    const customRowRenderer = (row) => (
        <>
            <td>{row.no_passport}</td>
            <td>{row.name}</td>
            <td>{row.gender === "M" ? "Male" : "Female"}</td>
            <td>{row.nationality}</td>
            <td>
                <>
                    <img
                        src={`data:image/jpeg;base64,${row.profile_image}`}
                        alt="Profile"
                        width={100}
                        height={100}
                        style={{ borderRadius: '50%' }}
                        onError={handleError}
                    />

                </>
            </td>
            <td>
                {formatDateToIndonesian(row.created_at)}
            </td>

            <td className='button-action' style={{ height: '100px', display: 'flex', alignItems: "center" }}>

                <button onClick={() => openModalEdit(row)}>Edit</button>
                <button onClick={() => deleteModal(row)} style={{ background: 'red' }}>Delete</button>
            </td>
        </>
    );

    const generateExcel = () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Log Register");

        // Add column headers
        const headers = ['No', 'No PLB/BCP', 'Nama', 'Tanggal Lahir', 'Gender', 'Nationality', 'Registration Date', 'Expired Date', 'Destination Location'];
        worksheet.addRow(headers);

        // Add data rows
        logData?.forEach((item, index) => {
            const row = [
                index + 1,
                item.no_passport,
                item.name,
                item.date_of_birth,
                item.gender === "M" ? "Laki-laki" : "Perempuan",
                item.nationality,
                item.created_at,
                item.expired_date,
                item.destination_location
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
                {/* <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div> */}
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
                        {countryData.map((negara) => {
                            return (
                                <option value={negara.nama_negara}>{negara.nama_negara}</option>
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
                    {/* <input type="text" name="destination_location" id="" value={detailData.destination_location} onChange={handleChange} /> */}
                    <select value={detailData.destination_location} name='destination_location' onChange={handleChange}>
                        <option value="">Pilih Negara</option>
                        {countryData.map((negara) => {
                            return (
                                <option value={negara.nama_negara}>{negara.nama_negara}</option>
                            )
                        })}
                    </select>
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
            // no_register: row.no_register || "",
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
            // no_register: "",
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
                {/* <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div> */}
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
                    <select value={detailData.destination_location} name='destination_location' onChange={handleChange}>
                        <option value="">Pilih Negara</option>
                        {countryData.map((negara) => {
                            return (
                                <option value={negara.nama_negara}>{negara.nama_negara}</option>
                            )
                        })}
                    </select>
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
        // console.log(detailData)
        setStatus("loading")
        setShowModalEdit(false)
        let paramsToSendEdit = {
            method: "addfaceinfonotify",
            params: {
                data: [],
            },
        };
        try {
            const res = await editDataUserPlb(detailData, detailData.no_passport)
            console.log(res, "res edit")
            paramsToSendEdit.params.data.push({
                personId: detailData?.no_passport,
                personNum: detailData?.no_passport,
                passStrategyId: "",
                personIDType: 1,
                personName: detailData?.name,
                personGender: detailData?.gender === "M" ? 1 : 0,
                validStartTime: Math.floor(new Date().getTime() / 1000).toString(),
                validEndTime: Math.floor(new Date(`${detailData.expired_date}T23:59:00`).getTime() / 1000).toString(),
                personType: 1,
                identityType: 1,
                identityId: detailData?.no_passport,
                identitySubType: 1,
                identificationTimes: -1,
                identityDataBase64: detailData?.profile_image ? detailData?.profile_image : "",
                status: 0,
                reserve: "",
            })
            if (res.status == 200) {
                socket_IO_4010.emit('editDataUser', { paramsToSendEdit });
                socket_IO_4010.on('responseEditDataUser', (data) => {
                    console.log(data, "res socket")
                    if (data === "Successfully") {
                        getLogRegister()
                        setStatus("success")
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
                    style={{ fontSize: 22, fontWeight: '400' }}
                >Are You Sure Want Delete <span style={{ fontWeight: "bold" }}>{detailData.name}</span> with PLB number <span style={{ fontWeight: "bold" }}>{detailData.no_passport}</span> ?</span>
            </div>
        )
    }

    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="face-reg-header h-20">
                <div className='face-reg-filter-name '>
                    <div className='label-filter-name' style={{
                        gap: "20%",
                        paddingTop: "3%",
                    }}>
                        <p>No. PLB</p>
                        <p>Full Name</p>
                        <p>Gender</p>

                    </div>
                    <div className='value-filter-name' style={{
                        width: "65%"
                    }}>
                        <input type="text"
                            value={search.no_passport.toUpperCase()}
                            onChange={(e) => setSearch({ ...search, no_passport: e.target.value.toUpperCase() })}

                        />

                        <input type="text"
                            value={search.name.toUpperCase()}
                            onChange={(e) => setSearch({ ...search, name: e.target.value.toUpperCase() })}
                            placeholder={`Enter Name`}
                        />
                        <Select

                            onChange={(selectedOption) => setSearch({ ...search, gender: selectedOption.value })}
                            options={dataGender}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Gender"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    flex: 1,
                                    width: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
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
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                }),
                            }}
                        />
                    </div>
                </div>
                <div className='face-reg-filter-kamera'>
                    <div className='label-filter-name' style={{
                        gap: "20%",
                        paddingTop: "3%"
                    }}>
                        <p>Start Date</p>
                        <p>End Date</p>
                        <p>Nationality</p>
                    </div>
                    <div className='value-filter-name'>
                        <input type="datetime-local"
                            value={search.startDate}
                            onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <input type="datetime-local"
                            value={search.endDate}
                            onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <Select
                            onChange={(selectedOption) => setSearch({ ...search, nationality: selectedOption.value })}
                            options={[
                                { value: "", label: "All Nationality" },
                                ...countryData.map(country => ({
                                    value: country.nama_negara,
                                    label: country.nama_negara
                                }))
                            ]}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    position: 'relative',
                                    flex: 1,
                                    width: "91.7%",
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
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
                                    backgroundColor: "rgba(217, 217, 217, 0.75)",
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='submit-buttons-registers' style={{
                width: "99.4%",
                paddingTop: "1%",
                paddingBottom: "1%",
            }}>
                <button
                    style={{
                        width: 150,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate("/cpanel/synchronize-register")}
                >Sinkronisasi Data</button>
                <button
                    onClick={generateExcel}
                    className='add-data'
                >Export
                </button>
                <button
                    className='search'
                    onClick={getLogRegister}
                    style={{
                        backgroundColor: '#4F70AB',
                    }}
                >Search
                </button>

            </div>
            {status === "loading" && (
                <div className="loading">
                    <span className="loader-loading-table"></span>
                </div>
            )}
            {status === "success" && logData &&
                <>
                    <TableLog
                        tHeader={['no plb', 'name', 'gender', 'nationality', 'profile image', 'registration date', "action"]}
                        tBody={logData}
                        page={page}
                        showIndex={true}
                        // handler={getDetailData}
                        rowRenderer={customRowRenderer}
                    />
                    <div className="table-footer">
                        <>Show {totalDataFilter} of {pagination?.total} entries</>
                        <Pagination
                            pageCount={pagination?.last_page}
                            onPageChange={(selectedPage) => setPage(selectedPage)}
                            currentPage={page}
                        />
                    </div>
                </>
            }
            {/* <Modals
                showModal={showModalAdd}
                buttonName="Submit"
                width={800}
                headerName="Add Register"
                closeModal={closeModalAdd}
            >
                {modalAddInput()}
            </Modals> */}
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