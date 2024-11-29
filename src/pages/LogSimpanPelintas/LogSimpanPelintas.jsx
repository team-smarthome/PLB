import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import './logsimpanpelintas.style.css'
import { apiGetAllIp, getAllNegaraData, getDataLogApi, getAllSimpanPelintasApi, getSimpanPelintas } from '../../services/api'
import Cookies from 'js-cookie';
import Select from "react-select";
import Pagination from '../../components/Pagination/Pagination'
import ImgsViewer from "react-images-viewer";
import ModalData from '../../components/Modal/ModalData'
import Excel from "exceljs";
import { initiateSocket4010 } from '../../utils/socket';
import { useNavigate } from 'react-router-dom';
import Modals from '../../components/Modal/Modal';

const LogSimpanPelintas = () => {
    const socket = initiateSocket4010();
    const navigate = useNavigate();
    const [logData, setLogData] = useState([])
    const [optionIp, setOptionIp] = useState([])
    const [status, setStatus] = useState("loading")
    const [getPagination, setGetPagination] = useState(false)
    const [selectedCondition, setSelectedCondition] = useState('personId');
    const [exportStatus, setExportStatus] = useState("idle")
    const [totalDataFilter, setTotalDataFilter] = useState(0);
    const [page, setPage] = useState(1);
    const [isOpenImage, setIsOpenImage] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalDetail, setModalDetail] = useState(false)
    const [detailData, setDetailData] = useState({})
    const [dataNationality, setDataNationality] = useState([])
    const [params, setParams] = useState({
        page: page,
        nama_petugas: "",
        no_passport: "",
        startDate: "",
        endDate: "",
    })
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });

    //============================================ YANG DIGUNAKAN =============================================================//

    const GetDataUserLog = async () => {
        const userCookie = Cookies.get('userdata');

        if (!userCookie) {
            console.error("No user cookie found");
            return;
        }

        const userInfo = JSON.parse(userCookie);
        console.log(userInfo, "userInfoSimpanPelintas")
        try {
            const { data } = await getAllSimpanPelintasApi({ ...params, tpi_id: userInfo?.tpi_id });
            if (data.status === 200) {
                setLogData(data?.data)
                setTotalDataFilter(data?.data?.length);
                setPagination(data?.pagination);
            }
        } catch (error) {
            console.log(error?.message)
        }
    }

    const GetDataUserLogFilter = async () => {
        const dataIpKamera = localStorage.getItem('cameraIp')
        const dataLog = {
            page: 1,
            name: "",
            personId: "",
            startDate: "",
            endDate: "",
            passStatus: "",
            ipCamera: dataIpKamera
        }
        try {
            console.log(dataLog, "dataLog")
            const { data } = await getAllSimpanPelintasApi(dataLog);
            if (data.status === 200) {
                setLogData(data?.data)
                setTotalDataFilter(data?.data?.length);
                setPagination(data?.pagination);
            }
        } catch (error) {
            console.log(error?.message)
        }
    }


    const GetDataKamera = async () => {
        const userCookie = Cookies.get('userdata');

        if (!userCookie) {
            console.error("No user cookie found");
            return;
        }

        const userInfo = JSON.parse(userCookie);
        try {
            const { data } = await apiGetAllIp(userInfo?.tpi_id,);
            if (data.status === 200) {
                setOptionIp(data?.data)
            }

        } catch (error) {
            console.log(error?.message)
        }
    }

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

    const handleEpochToDate = (epoch) => {
        const date = new Date(epoch * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate, "dataConvert");
        return formattedDate;
    };

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
    };


    const handleSearch = async () => {
        handlePageChange(1);
        GetDataUserLog();
    }

    const customRowRenderer = (row) => {
        return (
            <>

                <td>{row?.no_passport}</td>
                <td>{row?.name || "Unkown"}</td>
                <td>{row?.gender === "M" ? "Laki-Laki" : row?.gender === "F" ? "Perempuan" : "Unkown"}</td>
                <td>{row?.tpi_id || "Unkown"}</td>
                <td>{row?.nationality || "Unkown"}</td>
                <td>{row?.user?.petugas?.nama_petugas}</td>
                <td>{row?.pass_status == "izinkan" ? "Success" : "Failed"}</td>


            </>
        );
    };

    const handleChange = (e) => {
        setParams({
            ...params,
            [selectedCondition]: e.target.value.toUpperCase()
        })
    }

    const generateExcel = async () => {
        setExportStatus("loading")
        const res = await getAllSimpanPelintasApi({ paginate: false })
        const responseData = res?.data?.data
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        const headers = ['no', 'no plb', 'name', 'gender', 'tpi id', 'nationality', "nama petugas", "status"]
        worksheet.addRow(headers);

        responseData.forEach((item, index) => {
            const row = [
                index + 1,
                item?.no_passport,
                item?.pelintas?.name,
                item?.pelintas?.gender === "M" ? "Laki-Laki" : item?.gender === "F" ? "Perempuan" : "Unkown",
                item?.pelintas?.tpi_id || "Unkown",
                item?.pelintas?.nationality || "Unkown",
                item?.is_success ? "Success" : "Failed",
                item?.user?.petugas?.nama_petugas,

            ];
            worksheet.addRow(row);
        });

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
            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, ""); // e.g., 20241119_123456
            const baseFilename = `Log_Simpan_Pelintas_${formattedDate}.xlsx`;
            const filename = getFilenameWithDateTime(baseFilename);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
                setExportStatus("success")
            } else {
                setExportStatus("success")
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

    const resultArray = logData.map(item => ({ src: `data:image/jpeg;base64,${item.image_base64}` }));

    const handleOpenImage = (row, index) => {
        setIsOpenImage(true)
        setCurrentImage(index)
    }
    const nextImage = () => {
        setCurrentImage(currentImage + 1)
    }
    const prevImage = () => {
        setCurrentImage(currentImage - 1)
    }

    const handleChangeStatus = (selectedOption) => {
        setParams(prevState => ({
            ...prevState,
            passStatus: selectedOption ? selectedOption.value : ""
        }));
    };


    useEffect(() => {
        localStorage.setItem('cameraIp', '')
        const fetchData = async () => {
            await Promise.all([GetDataUserLog(), GetDataKamera(), getDataNationality()])
            setStatus("success")
        }
        fetchData();



        socket.on('logDataUpdate', () => {
            GetDataUserLogFilter()
        });

        return () => {
            socket.off('logDataUpdate');
        }
    }, [])

    useEffect(() => {
        setParams((prevState) => ({
            ...prevState,
            page: page
        })
        )
        setGetPagination(true)
    }, [page]);

    useEffect(() => {
        if (getPagination) {
            GetDataUserLog()
        }
        setGetPagination(false)
    }, [getPagination])

    const handleCloseModalDetail = () => {
        setModalDetail(false)
        setDetailData({})
    }
    const handleOpenDetail = (row) => {
        setDetailData(row)
        setModalDetail(true)
        console.log(row)
    }
    const modalDetailRow = () => {
        return (
            <div className="register-container">
                <div className="register-input">
                    <span>PLB / BCP Number</span>
                    <input type="text" name="no_passport" id="" value={detailData.no_passport} onChange={handleChange} disabled />
                </div>
                {/* <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div> */}
                <div className="register-input">
                    <span>Full Name</span>
                    <input type="text" name="name" id="" value={detailData.name} onChange={handleChange} disabled />
                </div>
                <div className="register-input">
                    <span>Date of Birth</span>
                    <input type="date" name="date_of_birth" id="" value={detailData.date_of_birth} onChange={handleChange} disabled />
                </div>
                <div className="register-input">
                    <span>Gender</span>
                    <select value={detailData.gender} name='gender' onChange={handleChange} disabled>
                        <option value="">Pilih Gender</option>
                        <option value="M">Laki-Laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div className="register-input">
                    <span>Nationality</span>
                    <input type="text" name="name" id="" value={detailData.nationality} onChange={handleChange} disabled />
                </div>
                <div className="register-input">
                    <span>Expired Date</span>
                    <input type="date" name="expired_date" id="" value={detailData.expired_date} onChange={handleChange} disabled />
                </div>
                <div className="register-input" style={{ marginBottom: '5rem' }}>
                    <span>Destination Location</span>
                    <input type="text" name="name" id="" value={detailData.destination_location} onChange={handleChange} disabled />
                </div>
                <div className="register-input input-file" style={{ marginBottom: '7rem' }}>
                    <span>Profile Image</span>
                    <div className="input-file-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={detailData.profile_image ? `data:image/jpeg;base64,${detailData.profile_image}`
                            : detailData.profile_image}
                            alt="" height={175} />
                    </div>
                </div>
                <div className="register-input input-file" style={{ paddingTop: '2rem' }}>
                    <span>Photo Document</span>
                    <div className="input-file-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={detailData.photo_passport ? `data:image/jpeg;base64,${detailData.photo_passport}`
                            : detailData.photo_passport}
                            alt="" height={175} />
                    </div>
                </div>
                <div className="register-input input-file" style={{ paddingTop: '8rem' }}>
                    <span>Photo FaceReg</span>
                    <div className="input-file-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={detailData.facreg_img ? `data:image/jpeg;base64,${detailData.facreg_img}`
                            : detailData.facreg_img}
                            alt="" height={175} />
                    </div>
                </div>

            </div>
        )
    }



    //============================================ YANG DIGUNAKAN =============================================================//



    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className=" flex flex-row items-center gap-4">
                    <label htmlFor="plb" className="text-sm font-bold text-gray-700 w-[10%]">
                        No. PLB
                    </label>
                    <input
                        id="plb"
                        placeholder="Enter PLB number"
                        className="h-10 bg-gray-100 border-gray-200"
                        value={params.no_passport}
                        onChange={(e) => setParams({ ...params, no_passport: e.target.value.toUpperCase() })}
                    />
                </div>
                <div className=" flex flex-row items-center gap-4">
                    <label htmlFor="startDate" className="text-sm font-bold text-gray-700 ">
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        type="date"
                        //   placeholder="dd/mm/yyyy --:--"
                        className="h-10 bg-gray-100 border-gray-200 pr-10 w-full"
                        value={params.startDate}
                        onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                    />

                </div>
                <div className=" flex flex-row items-center gap-4">
                    <label htmlFor="fullName" className="text-sm font-bold text-gray-700 w-[10%]">
                        Nama Petugas
                    </label>
                    <input
                        id="namaPetugas"
                        placeholder="Enter Name"
                        className="h-10 bg-gray-100 border-gray-200"
                        value={params.nama_petugas}
                        onChange={(e) => setParams({ ...params, nama_petugas: e.target.value.toUpperCase() })}
                    />
                </div>
                <div className=" flex flex-row items-center gap-4">
                    <label htmlFor="endDate" className="text-sm font-bold text-gray-700">
                        End Date
                    </label>

                    <input
                        id="endDate"
                        type="date"
                        //   placeholder="dd/mm/yyyy --:--"
                        className="h-10 bg-gray-100 border-gray-200 pr-10"
                        value={params.endDate}
                        onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                    />

                </div>
            </div>
            <div className='submit-buttons-registers ' style={{
                width: "99.4%",
                paddingTop: "1%",
                paddingBottom: "1%",
                marginTop: "1%",
            }}>
                <button
                    style={{
                        width: 150,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate("/cpanel/synchronize-facereg")}
                >Sinkronisasi Data</button>
                <button
                    onClick={generateExcel}
                    className='add-data'
                    disabled={exportStatus === "loading"}
                >
                    {exportStatus == "loading" ?
                        "Exporting..."
                        : "Export"}
                </button>
                <button
                    className='search'
                    onClick={handleSearch}
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
                        tHeader={['no plb', 'name', 'gender', 'tpi id', 'nationality', "nama petugas", "status"]}
                        tBody={logData}
                        handler={handleOpenDetail}
                        rowRenderer={customRowRenderer}
                        showIndex={true}
                        page={page}
                        perPage={pagination?.per_page}
                    />
                    <div className="table-footer">
                        <>Show {totalDataFilter} of {pagination?.total} entries</>
                        <Pagination
                            pageCount={pagination?.last_page}
                            onPageChange={handlePageChange}
                            currentPage={page}
                        />
                    </div>

                </>
            }
            <ImgsViewer
                imgs={resultArray}
                isOpen={isOpenImage}
                onClickPrev={prevImage}
                onClickNext={nextImage}
                onClose={() => { setIsOpenImage(false) }}
                currImg={currentImage}
            />
            <Modals
                showModal={modalDetail}
                closeModal={handleCloseModalDetail}
                headerName="Detail Log"
                width={800}
                isDetail
            >
                {modalDetailRow()}
            </Modals>
            <ModalData open={modalOpen} onClose={() => { setModalOpen(false) }} doneProgres={GetDataUserLog} />
        </div >
    )
}

export default LogSimpanPelintas
