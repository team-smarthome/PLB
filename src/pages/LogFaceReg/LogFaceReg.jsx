import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import './logfacereg.style.css'
import { apiGetAllIp, getAllNegaraData, getDataLogApi } from '../../services/api'
import Cookies from 'js-cookie';
import Select from "react-select";
import Pagination from '../../components/Pagination/Pagination'
import ImgsViewer from "react-images-viewer";
import ModalData from '../../components/Modal/ModalData'
import Excel from "exceljs";
import { initiateSocket4010 } from '../../utils/socket';
import { useNavigate } from 'react-router-dom';

const LogFaceReg = () => {
    const navigate = useNavigate()
    const socket = initiateSocket4010();
    const [logData, setLogData] = useState([])
    const [optionIp, setOptionIp] = useState([])
    const [status, setStatus] = useState("loading")
    const [getPagination, setGetPagination] = useState(false)
    const [selectedCondition, setSelectedCondition] = useState('personId');
    const [totalDataFilter, setTotalDataFilter] = useState(0);
    const [page, setPage] = useState(1);
    const [isOpenImage, setIsOpenImage] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [dataNationality, setDataNationality] = useState([])
    const [params, setParams] = useState({
        page: page,
        name: "",
        personId: "",
        startDate: "",
        endDate: "",
        passStatus: "",
        ipCamera: "",
        gender: "",
        nationality: "",
    })
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });

    const optionFilter = [
        {
            value: 'personId',
            label: 'Nomor Passport'
        },
        {
            value: 'name',
            label: 'Nama'
        },
    ]

    const optionFilterStatus = [
        {
            value: '',
            label: 'All'
        },
        {
            value: 'Success',
            label: 'Success'
        },
        {
            value: 'Failed',
            label: 'Failed'
        },
    ]


    const dataGender = [
        { value: "", label: "All Gender" },
        { value: "M", label: "MALE" },
        { value: "F", label: "FEMALE" },
    ];

    //============================================ YANG DIGUNAKAN =============================================================//

    const GetDataUserLog = async () => {
        try {
            const { data } = await getDataLogApi(params);
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
            const { data } = await getDataLogApi(dataLog);
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

                <td>{row?.personId}</td>
                <td>{row?.name}</td>
                <td>{row?.similarity}</td>
                <td>{row?.gender === "M" ? "Laki-Laki" : row?.gender === "F" ? "Perempuan" : "Unkown"}</td>
                <td>{row?.nationality || "Unkown"}</td>
                <td>{row?.passStatus === 6 || row?.passStatus === "Failed" ? "Failed" : "Success"}</td>
                <td>{handleEpochToDate(row?.time)}</td>
                <td className={`${row?.is_depart ? 'text-green-400' : 'text-red-400'}`}>{row?.is_depart ? "Departure" : "Arrival"}</td>
                <td>
                    <img
                        src={`data:image/jpeg;base64,${row?.image_base64}`}
                        alt="result"
                        width={100}
                        height={100}
                        style={{ borderRadius: "50%" }}
                    />
                </td>
                <td>{row?.ipCamera}</td>

            </>
        );
    };

    const handleChange = (e) => {
        setParams({
            ...params,
            [selectedCondition]: e.target.value.toUpperCase()
        })
    }

    const generateExcel = () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Payment Report");

        const headers = ['No', 'no plb', 'name', 'similarity', 'gender', 'nationality', 'recogniton status', "Recognition Time"]
        worksheet.addRow(headers);

        logData.forEach((item, index) => {
            const row = [
                index + 1,
                item.personId,
                item.name,
                item?.similarity,
                item?.gender,
                item?.nationality,
                item?.passStatus === 6 ? "Failed" : "Success",
                handleEpochToDate(item?.time),
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
            const baseFilename = "Log_FaceReg.xlsx";
            const filename = getFilenameWithDateTime(baseFilename);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
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



    //============================================ YANG DIGUNAKAN =============================================================//



    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="face-reg-header">
                <div className='face-reg-filter-name'>
                    <div className=' label-filter-name'>
                        <p>Filter By</p>
                        <p>{selectedCondition === "name" ? "Nama" : "Nomor Passport"}</p>
                        <p>Recognition Status</p>
                        <p>Gender</p>
                    </div>
                    <div className='value-filter-name'>
                        <Select
                            value={optionFilter.find(option => option.value === selectedCondition)}
                            onChange={(selectedOption) => {
                                setParams({
                                    ...params,
                                    [selectedOption.value]: ""
                                })
                                setSelectedCondition(selectedOption.value)
                            }}
                            options={optionFilter}
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
                        <input type="text"
                            value={selectedCondition === "name" ? params.name.toUpperCase() : params.personId.toUpperCase()}
                            onChange={handleChange}
                            placeholder={`Enter ${selectedCondition == "name" ? "name" : "passport number"}`}
                            className='input-filter-name-1'
                        />
                        <Select
                            onChange={handleChangeStatus}
                            options={optionFilterStatus}
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={optionFilterStatus[0]}
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
                        <Select
                            onChange={(selectedOption) => {
                                setParams({ ...params, page: 1, gender: selectedOption.value })
                            }}
                            options={dataGender}
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={dataGender[0]}
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
                <div className='face-reg-filter-kamera'>
                    <div className='label-filter-name'>
                        <p>Start Date</p>
                        <p>End Date</p>
                        <p>Select Camera</p>
                        <p>Nationality</p>
                    </div>
                    <div className='value-filter-name'>
                        <input type="datetime-local"
                            value={params.startDate}
                            onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <input type="datetime-local"
                            value={params.endDate}
                            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                            style={{
                                width: "88%",
                            }}
                        />
                        <Select
                            onChange={(selectedOption) => {
                                localStorage.setItem('cameraIp', selectedOption.value)
                                setParams({ ...params, page: 1, ipCamera: selectedOption.value })
                            }}
                            options={[
                                { value: '', label: 'All Camera' },
                                ...optionIp.map(item => ({ value: item.ipAddress, label: `${item.namaKamera} - ${item.ipAddress} ( ${item.is_depart ? "Departure" : "Arrival"} )` }))
                            ]}
                            defaultValue={{ value: '', label: 'All Camera' }}
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
                        <Select
                            onChange={(selectedOption) => setParams({ ...params, nationality: selectedOption.value })}
                            options={[
                                { value: "", label: "All Nationality" },
                                ...dataNationality.map(country => ({
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
                    style={{
                        width: 150,
                        cursor: 'pointer',
                        backgroundColor: "blue"
                    }}
                    onClick={() => setModalOpen(true)}
                >Input Data Manual</button>
                <button
                    onClick={generateExcel}
                    className='add-data'
                >Export
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
                        tHeader={['no plb', 'name', 'similarity', 'gender', 'nationality', 'recogniton status', "Recognition Time", "Depart Status", "Image Result", "IP Camera"]}
                        tBody={logData}
                        handler={handleOpenImage}
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
            <ModalData open={modalOpen} onClose={() => { setModalOpen(false) }} doneProgres={GetDataUserLog} />
        </div >
    )
}

export default LogFaceReg
