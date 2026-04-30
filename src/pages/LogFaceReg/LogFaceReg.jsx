import React, { useEffect, useRef, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import {
  apiDeleteLog,
  apiGetAllIp,
  getAllNegaraData,
  getDataLogApi,
  simpanPelintas,
} from "../../services/api";
import Cookies from "js-cookie";
import Select from "react-select";
import Pagination from "../../components/Pagination/Pagination";
import ImgsViewer from "react-images-viewer";
import ModalData from "../../components/Modal/ModalData";
import Excel from "exceljs";
import { initiateSocket4010 } from "../../utils/socket";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modal/Modal";
import { Toast } from "../../components/Toast/Toast";
import { IoFilter } from "react-icons/io5";

const LogFaceReg = () => {
  const navigate = useNavigate();
  const socket = initiateSocket4010();
  const [logData, setLogData] = useState([]);
  const [optionIp, setOptionIp] = useState([]);
  const [status, setStatus] = useState("idle");
  const [getPagination, setGetPagination] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("personId");
  const [exportStatus, setExportStatus] = useState("idle");
  const [totalDataFilter, setTotalDataFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataNationality, setDataNationality] = useState([]);
  const [actionPopup, setActionPopup] = useState(false);
  const [simpanModal, setSimpanModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [params, setParams] = useState({
    page: page,
    per_page: perPage,
    name: "",
    personId: "",
    startDate: "",
    endDate: "",
    passStatus: "",
    ipCamera: "",
    gender: "",
    nationality: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const optionFilter = [
    {
      value: "personId",
      label: "Nomor Passport",
    },
    {
      value: "name",
      label: "Nama",
    },
  ];

  const optionFilterStatus = [
    {
      value: "",
      label: "All",
    },
    {
      value: "Success",
      label: "Success",
    },
    {
      value: "Failed",
      label: "Failed",
    },
  ];

  const dataGender = [
    { value: "", label: "All Gender" },
    { value: "M", label: "MALE" },
    { value: "F", label: "FEMALE" },
  ];

  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);
  //============================================ YANG DIGUNAKAN =============================================================//

  const GetDataUserLog = async () => {
    const currentParams = paramsRef.current;
    console.log(currentParams, "paramsDariLog");
    setStatus("loading");
    try {
      const { data } = await getDataLogApi(currentParams);
      if (data.status === 200) {
        setStatus("success");
        const addCol = data?.data.map((item) => ({
          ...item,
          isSelected: false,
        }));
        setLogData(addCol);
        setTotalDataFilter(data?.data?.length);
        setPagination(data?.pagination);
      }
    } catch (error) {
      setStatus("failed");
      console.log(error?.message);
    }
  };

  const GetDataUserLogFilter = async () => {
    const dataIpKamera = localStorage.getItem("cameraIp");
    const dataLog = {
      page: 1,
      name: "",
      personId: "",
      startDate: "",
      endDate: "",
      passStatus: "",
      ipCamera: dataIpKamera,
    };
    try {
      console.log(params, "paramsDariLog");
      const { data } = await getDataLogApi(dataLog);
      if (data.status === 200) {
        setLogData(data?.data);
        setTotalDataFilter(data?.data?.length);
        setPagination(data?.pagination);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  const GetDataKamera = async () => {
    const userCookie = Cookies.get("userdata");

    if (!userCookie) {
      console.error("No user cookie found");
      return;
    }

    const userInfo = JSON.parse(userCookie);
    try {
      const { data } = await apiGetAllIp(userInfo?.tpi_id);
      if (data.status === 200) {
        setOptionIp(data?.data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

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

  const handleEpochToDate = (epoch) => {
    const date = new Date(epoch * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

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
  };

  const handleCheckBox = (e, index) => {
    const updateData = [...logData];

    updateData[index] = { ...updateData[index], isSelected: e.target.checked };

    setLogData(updateData);
  };

  const handleActionPopup = () => {
    const findData = logData.filter((data) => data.isSelected == true).length;
    if (findData > 0) {
      setActionPopup(true);
    } else {
      setActionPopup(false);
    }
  };

  useEffect(() => {
    handleActionPopup();
  }, [logData]);

  const customRowRenderer = (row, index) => {
    return (
      <>
        <td className="text-center">{row?.personId}</td>
        <td className="text-center">{row?.name}</td>
        <td className="text-center">{row?.similarity}</td>
        <td className="text-center">
          {row?.gender === "M"
            ? "Laki-Laki"
            : row?.gender === "F"
              ? "Perempuan"
              : "Unkown"}
        </td>
        <td className="text-center">{row?.nationality || "Unkown"}</td>
        <td className="text-center">
          {row?.passStatus === 6 || row?.passStatus === "Failed"
            ? "Failed"
            : "Success"}
        </td>
        <td className="text-center">{handleEpochToDate(row?.time)}</td>
        <td
          className={`${row?.is_depart ? "text-green-700" : "text-red-700"} text-center`}
        >
          {row?.is_depart ? "Departure" : "Arrival"}
        </td>
        <td className="text-center">
          <img
            src={`data:image/jpeg;base64,${row?.image_base64}`}
            alt="result"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
            onClick={() => handleOpenImage(row, index)}
          />
        </td>
        <td>{row?.ipCamera}</td>
        <td class="">
          <input
            onChange={(e) => {
              e.stopPropagation();
              handleCheckBox(e, index);
            }}
            id="disabled-checked-checkbox"
            type="checkbox"
            checked={row?.isSelected}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </td>
      </>
    );
  };

  const handleChange = (e) => {
    setParams({
      ...params,
      [selectedCondition]: e.target.value.toUpperCase(),
      page: 1,
    });
    handlePageChange(1);
  };

  const generateExcel = async () => {
    setExportStatus("loading");
    const res = await getDataLogApi({
      startDate: params.startDate,
      endDate: params.endDate,
      "not-paginate": true,
    });
    const responseData = res?.data?.data;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Payment Report");

    const headers = [
      "No",
      "no plb",
      "name",
      "similarity",
      "gender",
      "nationality",
      "recogniton status",
      "Recognition Time",
    ];
    worksheet.addRow(headers);

    responseData.forEach((item, index) => {
      const row = [
        index + 1,
        item.personId,
        item.name ?? "unkown",
        item?.similarity,
        item?.gender ?? "unkown",
        item?.nationality ?? "unkown",
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
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
        return `${baseFilename.replace(".xlsx", "")}_${date}_${time}.xlsx`;
      };

      const date = new Date();
      const formattedDate = date
        .toISOString()
        .slice(0, 19)
        .replace(/[-T:]/g, ""); // e.g., 20241119_123456
      const baseFilename = `Log_FaceReg_${formattedDate}.xlsx`;
      const filename = getFilenameWithDateTime(baseFilename);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        setExportStatus("success");
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
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

  const resultArray = (logData || []).map((item) => ({
    src: item.image_base64
      ? `data:image/jpeg;base64,${item.image_base64}`
      : "https://via.placeholder.com/150",
  }));

  const handleOpenImage = (row, index) => {
    console.log(index, row);
    setIsOpenImage(true);
    setCurrentImage(index);
  };
  const nextImage = () => {
    setCurrentImage(currentImage + 1);
  };
  const prevImage = () => {
    setCurrentImage(currentImage - 1);
  };

  const handleChangeStatus = (selectedOption) => {
    setParams((prevState) => ({
      ...prevState,
      page: 1,
      passStatus: selectedOption ? selectedOption.value : "",
    }));
    handlePageChange(1);
  };

  useEffect(() => {
    localStorage.setItem("cameraIp", "");
    const fetchData = async () => {
      await Promise.all([
        GetDataUserLog(),
        GetDataKamera(),
        getDataNationality(),
      ]);
      setStatus("success");
    };
    fetchData();

    socket.on("logDataUpdate", () => {
      console.log("123params1234", params);
      GetDataUserLog();
    });

    return () => {
      socket.off("logDataUpdate");
    };
  }, []);

  useEffect(() => {
    setParams((prevState) => ({
      ...prevState,
      page: page,
      per_page: perPage,
    }));
    setGetPagination(true);
  }, [page, perPage]);

  useEffect(() => {
    if (getPagination) {
      GetDataUserLog();
    }
    setGetPagination(false);
  }, [getPagination]);

  const selectedData = logData.filter((data) => data.isSelected == true);

  const handleSearchFilter = () => {
    handlePageChange(1);
    GetDataUserLogFilter();
    setShowModalFilter(false);
  };

  const handleCloseModalFilter = () => {
    setShowModalFilter(false);
  };

  const filterModalContent = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Filter By
            </label>
            <Select
              value={optionFilter.find(
                (option) => option.value === selectedCondition,
              )}
              onChange={(selectedOption) => {
                setParams({ ...params, [selectedOption.value]: "" });
                setSelectedCondition(selectedOption.value);
              }}
              options={optionFilter}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              {selectedCondition === "name" ? "Nama" : "Nomor Passport"}
            </label>
            <input
              type="text"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={
                selectedCondition === "name"
                  ? params.name.toUpperCase().replace(/[^A-Za-z\s.-]/g, "")
                  : params.personId.toUpperCase()
              }
              onChange={handleChange}
              placeholder={`Enter ${selectedCondition === "name" ? "name" : "passport number"}`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Recognition Status
            </label>
            <Select
              onChange={handleChangeStatus}
              options={optionFilterStatus}
              defaultValue={optionFilterStatus[0]}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Gender
            </label>
            <Select
              onChange={(selectedOption) => {
                setParams({
                  ...params,
                  page: 1,
                  gender: selectedOption.value,
                });
                handlePageChange(1);
              }}
              options={dataGender}
              defaultValue={dataGender[0]}
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
              value={params.startDate}
              onChange={(e) => {
                setParams({ ...params, startDate: e.target.value, page: 1 });
                handlePageChange(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              End Date
            </label>
            <input
              type="datetime-local"
              className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
              value={params.endDate}
              onChange={(e) => {
                setParams({ ...params, endDate: e.target.value, page: 1 });
                handlePageChange(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Select Camera
            </label>
            <Select
              onChange={(selectedOption) => {
                localStorage.setItem("cameraIp", selectedOption.value);
                setParams({
                  ...params,
                  page: 1,
                  ipCamera: selectedOption.value,
                });
                handlePageChange(1);
              }}
              options={[
                { value: "", label: "All Camera" },
                ...optionIp.map((item) => ({
                  value: item.ipAddress,
                  label: `${item.namaKamera} - ${item.ipAddress} ( ${item.is_depart ? "Departure" : "Arrival"} )`,
                })),
              ]}
              defaultValue={{ value: "", label: "All Camera" }}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Nationality
            </label>
            <Select
              onChange={(selectedOption) => {
                setParams({
                  ...params,
                  nationality: selectedOption.value,
                  page: 1,
                });
                handlePageChange(1);
              }}
              options={[
                { value: "", label: "All Nationality" },
                ...dataNationality.map((country) => ({
                  value: country.nama_negara,
                  label: country.nama_negara,
                })),
              ]}
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

  const handleSimpanPelintas = async () => {
    console.log("selectedData", selectedData);
    setStatus("loading");
    const mapSelectedData = selectedData.map((item) => {
      return {
        no_passport: item?.personId,
        name: item?.name,
        similarity: item?.similarity,
        pass_status: "izinkan",
        time: item?.time,
        facreg_img: item?.image_base64,
        ip_camera: item?.ipCamera,
        is_depart: item?.is_depart,
      };
    });
    console.log(mapSelectedData, "mapSelectedData");
    try {
      const { data: resInsertLog } = await simpanPelintas(mapSelectedData);
      if (resInsertLog?.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Data Log berhasil ditambahkan",
        });
        setSimpanModal(false);
        setStatus("success");
        console.log("Data berhasil diinsert");
        GetDataUserLog();
      }
    } catch (error) {
      setSimpanModal(false);
      Toast.fire({
        icon: "error",
        title: "Data Log gagal ditambahkan",
      });
      setStatus("success");
      console.error("Error inserting log data:", error);
    }
  };

  const handleDeleteLogs = async () => {
    const deletedData = selectedData.map((item) => {
      return item.id;
    });
    const data = {
      ids: deletedData,
    };
    try {
      const res = await apiDeleteLog(data);
      if (res?.status == 200 || res?.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Data Log berhasil dihapus",
        });

        setDeleteModal(false);
        setStatus("success");
        GetDataUserLog();
      }
    } catch (error) {
      setSimpanModal(false);
      Toast.fire({
        icon: "error",
        title: "Data Log gagal dihapus",
      });
      setStatus("success");
      console.error("Error inserting log data:", error);
    }
  };

  const handleSelectAll = () => {
    setLogData((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isSelected: true,
      })),
    );
  };

  const handleClearAll = () => {
    setLogData((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isSelected: false,
      })),
    );
  };
  console.log("loading: ", status);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Log FaceReg</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola dan lihat daftar riwayat pengenalan wajah pelintas batas.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-2 border border-navy-900 text-navy-900 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Input Data Manual
            </button>
            <button
              onClick={generateExcel}
              disabled={exportStatus === "loading"}
              className="px-6 py-2 border border-gray-300 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
            >
              {exportStatus === "loading" ? "Exporting..." : "Export"}
            </button>
            <button
              onClick={() => setShowModalFilter(true)}
              className="px-6 py-2 border bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <IoFilter />
              Filter
            </button>
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
                    "similarity",
                    "gender",
                    "nationality",
                    "recogniton status",
                    "Recognition Time",
                    "Depart Status",
                    "Image Result",
                    "IP Camera",
                    "Action",
                  ]}
                  tBody={logData}
                  rowRenderer={customRowRenderer}
                  showIndex={true}
                  page={page}
                  perPage={pagination?.per_page}
                />
              </div>

              {actionPopup && (
                <div className="fixed bottom-12 right-8 bg-white/90 backdrop-blur-md flex items-center justify-center gap-4 rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                  {logData.length == selectedData.length ? (
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      onClick={handleClearAll}
                    >
                      Kosongkan Semua
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      onClick={handleSelectAll}
                    >
                      Pilih Semua
                    </button>
                  )}
                  <button
                    className="px-4 py-2 border bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                    onClick={() => setSimpanModal(true)}
                  >
                    Simpan Pelintas
                  </button>
                  <button
                    className="px-4 py-2 border bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    onClick={() => setDeleteModal(true)}
                  >
                    Hapus Data
                  </button>
                </div>
              )}

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
                      value={perPage || 10}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => setPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <Pagination
                    pageCount={pagination?.last_page}
                    onPageChange={handlePageChange}
                    currentPage={page}
                  />
                </div>
              </div>
            </div>
          )}
          {status === "failed" && (
            <>
              <TableLog
                tHeader={[
                  "no plb",
                  "name",
                  "similarity",
                  "gender",
                  "nationality",
                  "recogniton status",
                  "Recognition Time",
                  "Depart Status",
                  "Image Result",
                  "IP Camera",
                  "Action",
                ]}
                tBody={[]}
                // handler={handleOpenImage}
                rowRenderer={customRowRenderer}
                showIndex={true}
                page={page}
                perPage={pagination?.per_page}
              />
            </>
          )}
        </div>
      </div>
      <ImgsViewer
        imgs={resultArray}
        isOpen={isOpenImage}
        onClickPrev={prevImage}
        onClickNext={nextImage}
        onClose={() => {
          setIsOpenImage(false);
        }}
        currImg={currentImage}
      />
      <Modals
        showModal={showModalFilter}
        headerName="Filter Data"
        width={800}
        height={500}
        closeModal={handleCloseModalFilter}
        buttonName="Apply"
        onConfirm={handleSearchFilter}
      >
        {filterModalContent()}
      </Modals>
      <Modals
        showModal={simpanModal}
        headerName="Sinkronisasi data"
        closeModal={() => setSimpanModal(false)}
        buttonName="Confirm"
        onConfirm={handleSimpanPelintas}
      >
        <span className="text-lg">
          Apakah anda ingin Sinkronisasi{" "}
          <span className="font-bold">{selectedData.length}</span> data ?
        </span>
      </Modals>

      <Modals
        showModal={deleteModal}
        headerName="Hapus data"
        closeModal={() => setDeleteModal(false)}
        buttonName="Confirm"
        onConfirm={handleDeleteLogs}
      >
        <span className="text-lg">
          Apakah anda ingin Menghapus{" "}
          <span className="font-bold">{selectedData.length}</span> data ?
        </span>
      </Modals>
      <ModalData
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        doneProgres={GetDataUserLog}
      />
    </div>
  );
};

export default LogFaceReg;
