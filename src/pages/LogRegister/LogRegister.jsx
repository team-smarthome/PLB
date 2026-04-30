import React, { useEffect, useRef, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import { useNavigate } from "react-router-dom";
import {
  apiGetDataLogRegister,
  deleteDataUserPlb,
  editDataUserPlb,
  getAllNegaraData,
} from "../../services/api";
import Modals from "../../components/Modal/Modal";
import dataNegara from "../../utils/dataNegara";
import { initiateSocket4010 } from "../../utils/socket";
import Pagination from "../../components/Pagination/Pagination";
import Select from "react-select";
import Excel from "exceljs";
import { formatDateToIndonesian } from "../../utils/formatDate";
import { Toast } from "../../components/Toast/Toast";
import { IoFilter } from "react-icons/io5";

const LogRegister = () => {
  const socket_IO_4010 = initiateSocket4010();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [status, setStatus] = useState("loading");
  const [totalDataFilter, setTotalDataFilter] = useState(0);
  const [isErrorImage, setIsErrorImage] = useState(false);
  const [exportStatus, setExportStatus] = useState("idle");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
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
    profile_image: "",
  });
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
    is_cekal: "",
  });
  const navigate = useNavigate();
  const [logData, setLogData] = useState([]);
  const refInputFace = useRef();
  const refInputPassport = useRef();
  const [imageFace, setImageFace] = useState(null);
  const [imagePassport, setImagePassport] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [changePage, setChangePage] = useState(false);
  const [dataNationality, setDataNationality] = useState([]);

  const dataGender = [
    { value: "", label: "All Gender" },
    { value: "M", label: "MALE" },
    { value: "F", label: "FEMALE" },
  ];

  const dataCekal = [
    { value: "", label: "All Status" },
    { value: true, label: "Cekal" },
    { value: false, label: "No Cekal" },
  ];

  const getDataNationality = async () => {
    try {
      const { data } = await getAllNegaraData();
      if (data.status === 200) {
        console.log(data.data, "dataNegara");
        setDataNationality(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLogRegister = async () => {
    try {
      setStatus("loading");
      const res = await apiGetDataLogRegister({
        ...search,
      });
      if (res.data.status == 200) {
        console.log(res?.data, "consoleRegiste");
        setStatus("success");
        setLogData(res?.data?.data);
        setPagination(res?.data?.pagination);
        setTotalDataFilter(res.data?.data.length);
        setChangePage(false);
      }
    } catch (error) {
      setStatus("success");
      console.log(error.message);
    }
  };
  const getCountryData = async () => {
    try {
      const res = await getAllNegaraData();
      setCountryData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
      arrival_time: row.arrival_time || new Date().toISOString().split("T")[0],
      destination_location: row.destination_location || "",
      photo_passport: row.photo_passport || "",
      profile_image: row.profile_image || "",
    });
    setShowModalDelete(true);
  };
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
      profile_image: "",
    });
    setShowModalDelete(false);
  };

  const synchronizeDataUser = (row) => {
    const bodyParamsSendKamera = {
      method: "addfaceinfonotify",
      params: {
        data: [
          {
            personId: row?.no_passport,
            personNum: row?.no_passport,
            passStrategyId: "",
            personIDType: 1,
            personName: row?.name,
            personGender: row?.gender === "M" ? 1 : 0,
            validStartTime: Math.floor(
              new Date().getTime() / 1000 - 86400,
            ).toString(),
            validEndTime: Math.floor(
              new Date(`${row?.expired_date}T23:59:00`).getTime() / 1000,
            ).toString(),
            personType: 1,
            identityType: 1,
            identityId: row?.no_passport,
            identitySubType: 1,
            identificationTimes: -1,
            identityDataBase64: row?.profile_image ? row?.profile_image : "",
            status: 0,
            reserve: "",
          },
        ],
      },
    };

    if (socket_IO_4010.connected) {
      setStatus("loading");
      console.log("testWebsocket4010 connected");
      socket_IO_4010.emit("syncCamera", { bodyParamsSendKamera });
    } else {
      console.log("testWebsocket4010 not connected");
      addPendingRequest4010({
        action: "syncCamera",
        data: { bodyParamsSendKamera },
      });
      socket_IO_4010.connect();
    }
  };

  useEffect(() => {
    socket_IO_4010.on("responseSyncCamera", (response) => {
      console.log("responseasdasdas", typeof response);
      if (response === "Successfully") {
        setStatus("success");
        Toast.fire({
          icon: "success",
          title: "Successfully synchronize data",
        });
      } else {
        setStatus("success");
        Toast.fire({
          icon: "error",
          title: "Failed to synchronize data",
        });
      }
    });
    return () => {
      socket_IO_4010.off("responseSyncCamera");
    };
  }, [socket_IO_4010]);

  useEffect(() => {
    getDataNationality();
    getLogRegister();
    getCountryData();
  }, []);

  useEffect(() => {
    if (changePage) {
      getLogRegister();
    }
  }, [changePage]);

  useEffect(() => {
    setSearch((prevState) => ({
      ...prevState,
      page: page,
      per_page: perPage,
    }));
    setChangePage(true);
  }, [page, perPage]);

  const handleDelete = async () => {
    setStatus("loading");
    setShowModalDelete(false);
    try {
      const respnse = await new Promise((resolve, reject) => {
        socket_IO_4010.emit("deleteDataUser", {
          no_passport: detailData.no_passport,
        });

        socket_IO_4010.once("responseDeleteDataUser", (data) => {
          console.log(data, "res_socket_delete");
          if (data === "Successfully") {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });

      if (respnse === "Successfully") {
        const { data } = await deleteDataUserPlb(detailData.no_passport);
        if (data.status == 200) {
          getLogRegister();
          setShowModalDelete(false);
          setStatus("success");
        } else {
          getLogRegister();
          setShowModalDelete(false);
          setStatus("success");
          Toast.fire({
            icon: "error",
            title: "Failed to delete data",
          });
        }
      }
    } catch (error) {
      getLogRegister();
      setStatus("success");
      setShowModalDelete(false);
      Toast.fire({
        icon: "error",
        title: "Failed to delete data",
      });
    }
  };

  const handleImageFace = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setDetailData({
          ...detailData,
          [event.target.name]: base64String,
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
      <td className="max-w-32 text-center">{row.no_passport}</td>
      <td className="max-w-32 text-center">{row.name}</td>
      <td className="text-center">{row.gender === "M" ? "Male" : "Female"}</td>
      <td className="w-auto text-center">{row.nationality}</td>
      <td className="text-center">
        {row?.is_cekal ? `Cekal - ${row?.skor_kemiripan || ""}` : "No Cekal"}
      </td>
      <td className="text-center">
        <>
          <img
            src={`data:image/jpeg;base64,${row.profile_image}`}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full"
            onError={handleError}
          />
        </>
      </td>
      <td className="text-center">{formatDateToIndonesian(row.created_at)}</td>

      <td
        className="flex items-center justify-center gap-2"
        style={{ height: "100px" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModalEdit(row);
          }}
          className="w-24 py-2 bg-[#fbaf17] text-base border-none text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteModal(row);
          }}
          className="w-24 py-2 text-base bg-red-500 border-none text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:cursor-pointer"
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            synchronizeDataUser(row);
          }}
          className="w-24 py-2 px-3 text-base bg-[#0056b3] border-none text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:cursor-pointer"
        >
          Sync
        </button>
      </td>
    </>
  );

  const generateExcel = async () => {
    setExportStatus("loading");
    const res = await apiGetDataLogRegister({
      startDate: search.startDate,
      endDate: search.endDate,
      "not-paginate": true,
    });
    const responseData = res?.data?.data;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Log Register");

    // Add column headers
    const headers = [
      "No",
      "No PLB/BCP",
      "Nama",
      "Tanggal Lahir",
      "Gender",
      "Nationality",
      "Status Cekal",
      "Registration Date",
      "Expired Date",
      "Destination Location",
    ];
    worksheet.addRow(headers);

    // Add data rows
    responseData?.forEach((item, index) => {
      const row = [
        index + 1,
        item.no_passport,
        item.name,
        item.date_of_birth,
        item.gender === "M" ? "Laki-laki" : "Perempuan",
        item.nationality,
        item?.is_cekal ? `Cekal - ${item?.skor_kemiripan || ""}` : "No Cekal",
        item.created_at,
        item.expired_date,
        item.destination_location,
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
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
        return `${baseFilename.replace(".xlsx", "")}_${date}_${time}.xlsx`;
      };

      // Example usage
      const date = new Date();
      const formattedDate = date
        .toISOString()
        .slice(0, 19)
        .replace(/[-T:]/g, ""); // e.g., 20241119_123456
      const baseFilename = `Log_Register_${formattedDate}.xlsx`;
      const filename = getFilenameWithDateTime(baseFilename);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE
        setExportStatus("success");
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // For other browsers
        setExportStatus("success");
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

  const openModalEdit = (row) => {
    console.log(row, "row");
    setDetailData({
      ...detailData,
      no_passport: row.no_passport || "",
      name: row.name || "",
      date_of_birth: row.date_of_birth || "",
      nationality: row.nationality || "",
      expired_date: row.expired_date || "",
      gender: row.gender || "",
      arrival_time: row.arrival_time,
      destination_location: row.destination_location || "",
      photo_passport: row.photo_passport || "",
      profile_image: row.profile_image || "",
    });
    setShowModalEdit(true);
  };

  const openModalDetail = (row) => {
    console.log(row, "row_1234");
    setDetailData({
      ...detailData,
      no_passport: row.no_passport || "",
      // no_register: row.no_register || "",
      name: row.name || "",
      date_of_birth: row.date_of_birth || "",
      nationality: row.nationality || "",
      expired_date: row.expired_date || "",
      gender: row.gender || "",
      arrival_time: row.arrival_time,
      destination_location: row.destination_location || "",
      photo_passport: row.photo_passport || "",
      profile_image: row.profile_image || "",
    });
    setShowModalDetail(true);
  };

  const closeModaledit = () => {
    setDetailData({
      no_passport: "",
      name: "",
      date_of_birth: "",
      nationality: "",
      expired_date: "",
      gender: "",
      arrival_time: "",
      destination_location: "",
      photo_passport: "",
      profile_image: "",
    });
    setShowModalEdit(false);
  };

  const closeModalDetail = () => {
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
      profile_image: "",
    });
    setShowModalDetail(false);
  };

  const handleChange = (e) => {
    let inputCondition;
    if (e.target.name === "name") {
      const cleanedValue = e.target.value.replace(/[^A-Za-z\s.-]/g, "");
      inputCondition = cleanedValue.toUpperCase();
    } else if (e.target.name === "no_passport") {
      inputCondition = e.target.value.toUpperCase();
    } else {
      inputCondition = e.target.value;
    }
    setDetailData({
      ...detailData,
      [e.target.name]: inputCondition,
    });
  };

  const modalEditInput = () => {
    return (
      <div className="register-container">
        <div className="register-input">
          <span>PLB / BCP Number</span>
          <input
            type="text"
            name="no_passport"
            id=""
            value={detailData.no_passport}
            onChange={handleChange}
          />
        </div>
        {/* <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div> */}
        <div className="register-input">
          <span>Full Name</span>
          <input
            type="text"
            name="name"
            id=""
            value={detailData.name}
            onChange={handleChange}
          />
        </div>
        <div className="register-input">
          <span>Date of Birth</span>
          <input
            type="date"
            name="date_of_birth"
            id=""
            value={detailData.date_of_birth}
            onChange={handleChange}
          />
        </div>
        <div className="register-input">
          <span>Gender</span>
          <select
            value={detailData.gender}
            name="gender"
            onChange={handleChange}
          >
            <option value="">Pilih Gender</option>
            <option value="M">Laki-Laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>
        <div className="register-input">
          <span>Nationality</span>
          <select
            value={detailData.nationality}
            name="nationality"
            onChange={handleChange}
          >
            <option value="">Pilih Negara</option>
            {countryData.map((negara) => {
              return (
                <option value={negara.nama_negara}>{negara.nama_negara}</option>
              );
            })}
          </select>
        </div>
        <div className="register-input">
          <span>Expired Date</span>
          <input
            type="date"
            name="expired_date"
            id=""
            value={detailData.expired_date}
            onChange={handleChange}
          />
        </div>
        <div className="register-input">
          <span>Registration Date</span>
          <input
            type="date"
            name="arrival_time"
            id=""
            value={detailData.arrival_time}
            onChange={handleChange}
          />
        </div>
        <div className="register-input" style={{ marginBottom: "5rem" }}>
          <span>Destination Location</span>
          <select
            value={detailData.destination_location}
            name="destination_location"
            onChange={handleChange}
          >
            <option value="">Pilih Negara</option>
            {countryData.map((negara) => {
              return (
                <option value={negara.nama_negara}>{negara.nama_negara}</option>
              );
            })}
          </select>
        </div>
        <div
          className="register-input input-file"
          style={{ marginBottom: "7rem" }}
        >
          <span>Face</span>
          <div
            className="input-file-container"
            onClick={() => refInputFace.current?.click()}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {detailData.profile_image ? (
              <img
                src={
                  detailData.profile_image
                    ? `data:image/jpeg;base64,${detailData.profile_image}`
                    : detailData.profile_image
                }
                alt=""
                height={175}
              />
            ) : (
              <span>Drag and Drop here </span>
            )}
          </div>
          <input
            type="file"
            name="profile_image"
            id=""
            style={{ display: "none" }}
            ref={refInputFace}
            onChange={(e) => handleImageFace(e)}
          />
        </div>
        <div className=" flex">
          <span className=" w-[50%]">Document PLB</span>
          <div
            className=" h-52 rounded-md text-center bg-gray-100 shadow-inner flex justify-center items-center flex-col gap-2 py-4"
            style={{
              display: "flex",
              width: "68%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {detailData.photo_passport ? (
              <>
                <img
                  src={
                    detailData.photo_passport
                      ? `data:image/jpeg;base64,${detailData.photo_passport}`
                      : detailData.photo_passport
                  }
                  alt=""
                  height={175}
                />
                <button
                  onClick={() =>
                    setDetailData({ ...detailData, photo_passport: "" })
                  }
                  className="bg-blue-500 text-white rounded-md px-2 py-2 hover:cursor-pointer"
                >
                  Ganti Dokumen
                </button>
              </>
            ) : (
              <span>Drag and Drop here </span>
            )}
          </div>
          <input
            type="file"
            name="photo_passport"
            id=""
            style={{ display: "none" }}
            ref={refInputPassport}
            onChange={(e) => handleImageFace(e)}
          />
        </div>
      </div>
    );
  };

  const closeModalAdd = () => {
    setShowModalAdd(false);
  };

  const modalDetailRow = () => {
    return (
      <div className="register-container">
        <div className="register-input">
          <span>PLB / BCP Number</span>
          <input
            type="text"
            name="no_passport"
            id=""
            value={detailData.no_passport}
            onChange={handleChange}
            disabled
          />
        </div>
        {/* <div className="register-input">
                    <span>Registration Number</span>
                    <input type="text" name="no_register" id="" value={detailData.no_register} onChange={handleChange} />
                </div> */}
        <div className="register-input">
          <span>Full Name</span>
          <input
            type="text"
            name="name"
            id=""
            value={detailData.name}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="register-input">
          <span>Date of Birth</span>
          <input
            type="date"
            name="date_of_birth"
            id=""
            value={detailData.date_of_birth}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="register-input">
          <span>Gender</span>
          <select
            value={detailData.gender}
            name="gender"
            onChange={handleChange}
            disabled
          >
            <option value="">Pilih Gender</option>
            <option value="M">Laki-Laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>
        <div className="register-input">
          <span>Nationality</span>
          <select
            value={detailData.nationality}
            name="nationality"
            onChange={handleChange}
            disabled
          >
            <option value="">Pilih Negara</option>
            {dataNegara.data.map((negara) => {
              return (
                <option
                  value={negara.value}
                >{`${negara.id_negara} - ${negara.deskripsi_negara}`}</option>
              );
            })}
          </select>
        </div>
        <div className="register-input">
          <span>Expired Date</span>
          <input
            type="date"
            name="expired_date"
            id=""
            value={detailData.expired_date}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="register-input">
          <span>Arrival Time</span>
          <input
            type="date"
            name="arrival_time"
            id=""
            value={detailData.arrival_time}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="register-input" style={{ marginBottom: "5rem" }}>
          <span>Destination Location</span>
          <select
            value={detailData.destination_location}
            name="destination_location"
            onChange={handleChange}
            disabled
          >
            <option value="">Pilih Negara</option>
            {countryData.map((negara) => {
              return (
                <option value={negara.nama_negara}>{negara.nama_negara}</option>
              );
            })}
          </select>
        </div>
        <div
          className="register-input input-file"
          style={{ marginBottom: "7rem" }}
        >
          <span>Face</span>
          <div
            className="input-file-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {detailData.profile_image ? (
              <img
                src={
                  detailData.profile_image
                    ? `data:image/jpeg;base64,${detailData.profile_image}`
                    : detailData.profile_image
                }
                alt=""
                height={175}
              />
            ) : (
              <span>Drag and Drop here </span>
            )}
          </div>
          <input
            type="file"
            name="profile_image"
            id=""
            style={{ display: "none" }}
            ref={refInputFace}
            onChange={(e) => handleImageFace(e)}
          />
        </div>
        <div
          className="register-input input-file"
          style={{ paddingTop: "2rem" }}
        >
          <span>Document PLB</span>
          <div
            className="input-file-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {detailData.photo_passport ? (
              <img
                src={
                  detailData.photo_passport
                    ? `data:image/jpeg;base64,${detailData.photo_passport}`
                    : detailData.photo_passport
                }
                alt=""
                height={175}
              />
            ) : (
              <span>Drag and Drop here </span>
            )}
          </div>
          <input
            type="file"
            name="photo_passport"
            id=""
            style={{ display: "none" }}
            ref={refInputPassport}
            onChange={(e) => handleImageFace(e)}
          />
        </div>
      </div>
    );
  };

  const filterModalContent = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              No. PLB
            </label>
            <input
              type="text"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={search.no_passport.toUpperCase()}
              onChange={(e) =>
                setSearch({
                  ...search,
                  no_passport: e.target.value.toUpperCase(),
                })
              }
              placeholder="Enter No. PLB"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Full Name
            </label>
            <input
              type="text"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={search.name.toUpperCase()}
              onChange={(e) => {
                const cleanedValue = e.target.value.replace(
                  /[^A-Za-z\s.-]/g,
                  "",
                );
                setSearch({ ...search, name: cleanedValue.toUpperCase() });
              }}
              placeholder="Enter Name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Gender
            </label>
            <Select
              onChange={(selectedOption) =>
                setSearch({ ...search, gender: selectedOption.value })
              }
              options={dataGender}
              placeholder="Select Gender"
              className="text-sm z-50"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "44px",
                  height: "44px",
                  backgroundColor: "#f9fafb", // match input (bg-gray-50)
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(59,130,246,0.3)"
                    : "none",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "44px",
                  padding: "0 12px",
                }),
                input: (base) => ({
                  ...base,
                  margin: 0,
                  padding: 0,
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "44px",
                }),
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Status Cekal
            </label>
            <Select
              onChange={(selectedOption) =>
                setSearch({ ...search, is_cekal: selectedOption.value })
              }
              options={dataCekal}
              placeholder="Select Status Cekal"
              className="text-sm"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "44px",
                  height: "44px",
                  backgroundColor: "#f9fafb", // match input (bg-gray-50)
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(59,130,246,0.3)"
                    : "none",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "44px",
                  padding: "0 12px",
                }),
                input: (base) => ({
                  ...base,
                  margin: 0,
                  padding: 0,
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "44px",
                }),
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Start Date
            </label>
            <input
              type="datetime-local"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
              value={search.startDate}
              onChange={(e) =>
                setSearch({ ...search, startDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              End Date
            </label>
            <input
              type="datetime-local"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
              value={search.endDate}
              onChange={(e) =>
                setSearch({ ...search, endDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Nationality
            </label>
            <Select
              onChange={(selectedOption) =>
                setSearch({ ...search, nationality: selectedOption.value })
              }
              options={[
                { value: "", label: "All Nationality" },
                ...countryData.map((country) => ({
                  value: country.nama_negara,
                  label: country.nama_negara,
                })),
              ]}
              placeholder="Select Nationality"
              className="text-sm"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "44px",
                  height: "44px",
                  backgroundColor: "#f9fafb", // match input (bg-gray-50)
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(59,130,246,0.3)"
                    : "none",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "44px",
                  padding: "0 12px",
                }),
                input: (base) => ({
                  ...base,
                  margin: 0,
                  padding: 0,
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "44px",
                }),
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const closeModalFilter = () => {
    setShowModalFilter(false);
  };

  const handleFilter = () => {
    getLogRegister();
    setShowModalFilter(false);
  };

  const handleEdit = async () => {
    setStatus("loading");

    const bodyParamsSendKamera = {
      method: "addfaceinfonotify",
      params: {
        data: [
          {
            personId: detailData?.no_passport,
            personNum: detailData?.no_passport,
            passStrategyId: "",
            personIDType: 1,
            personName: detailData?.name,
            personGender: detailData?.gender === "M" ? 1 : 0,
            validStartTime: Math.floor(
              new Date().getTime() / 1000 - 86400,
            ).toString(),
            validEndTime: Math.floor(
              new Date(`${detailData?.expired_date}T23:59:00`).getTime() / 1000,
            ).toString(),
            personType: 1,
            identityType: 1,
            identityId: detailData?.no_passport,
            identitySubType: 1,
            identificationTimes: -1,
            identityDataBase64: detailData?.profile_image
              ? detailData?.profile_image
              : "",
            status: 0,
            reserve: "",
          },
        ],
      },
    };

    if (socket_IO_4010.connected) {
      console.log("testWebsocket4010 connected");
      socket_IO_4010.emit(
        "editKeCamera",
        { bodyParamsSendKamera },
        async (response) => {
          if (response === "Successfully") {
            try {
              const { data: responseEdit } = await editDataUserPlb(
                detailData,
                detailData.no_passport,
              );
              if (responseEdit.status == 200) {
                getLogRegister();
                setStatus("success");
                setShowModalEdit(false);
                Toast.fire({
                  icon: "success",
                  title: "Data berhasil diubah.",
                });
              }
            } catch (error) {
              getLogRegister();
              setStatus("success");
              setShowModalEdit(false);
              Toast.fire({
                icon: "error",
                title: "Data gagal diubah.",
              });
              console.log(error);
            }
          }
        },
      );
    } else {
      console.log("testWebsocket4010 not connected");
      addPendingRequest4010({
        action: "editKeCamera",
        data: { bodyParamsSendKamera },
      });
    }

    setShowModalEdit(false);
    setStatus("success");
  };

  const modalDelete = () => {
    return (
      <div className="">
        <span style={{ fontSize: 22, fontWeight: "400" }}>
          Are You Sure Want Delete{" "}
          <span style={{ fontWeight: "bold" }}>{detailData.name}</span> with PLB
          number{" "}
          <span style={{ fontWeight: "bold" }}>{detailData.no_passport}</span> ?
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Log Register</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola dan lihat daftar riwayat pendaftaran pelintas batas.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={generateExcel}
              disabled={exportStatus === "loading"}
              className="px-6 py-2 border border-gray-300 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
            >
              {exportStatus === "loading" ? "Exporting..." : "Export"}
            </button>
            <button
              onClick={() => setShowModalFilter(true)}
              className="px-6 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <IoFilter />
              Filter
            </button>
            {/* <button
              onClick={getLogRegister}
              className="px-6 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
              </svg>
              Search
            </button> */}
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white p-6 pt-0">
          {status === "loading" && (
            <div className="flex justify-center items-center h-40">
              <span
                className="w-10 h-10 rounded-full animate-spin"
                style={{
                  border: "4px solid #172951",
                  borderTopColor: "transparent",
                }}
              ></span>
            </div>
          )}
          {status === "success" && logData && (
            <div className="flex flex-col h-full">
              <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
                <TableLog
                  tHeader={[
                    "no plb",
                    "name",
                    "gender",
                    "nationality",
                    "status cekal",
                    "profile image",
                    "registration date",
                    "action",
                  ]}
                  tBody={logData}
                  rowRenderer={customRowRenderer}
                  showIndex={true}
                  page={page}
                  handler={openModalDetail}
                  perPage={pagination.per_page}
                />
              </div>

              <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-medium text-gray-900">
                    {logData.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-gray-900">
                    {pagination?.total}
                  </span>{" "}
                  data
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Per halaman:</span>
                    <select
                      value={perPage}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <Pagination
                    pageCount={pagination?.last_page}
                    onPageChange={(selectedPage) => setPage(selectedPage)}
                    currentPage={page}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modals
        showModal={showModalFilter}
        buttonName="Search"
        width={800}
        headerName="Filter Register"
        closeModal={closeModalFilter}
        onConfirm={handleFilter}
      >
        {filterModalContent()}
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
        showModal={showModalDetail}
        buttonName="Submit"
        width={800}
        headerName="Detail Register"
        closeModal={closeModalDetail}
        isDetail
        // onConfirm={handleEdit}
      >
        {modalDetailRow()}
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
  );
};

export default LogRegister;
