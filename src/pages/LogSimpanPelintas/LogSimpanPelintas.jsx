import React, { useEffect, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import {
  apiGetAllIp,
  getAllNegaraData,
  getDataLogApi,
  getAllSimpanPelintasApi,
  getSimpanPelintas,
  apiDeleteSimpanPelintas,
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

const LogSimpanPelintas = () => {
  const socket = initiateSocket4010();
  const navigate = useNavigate();
  const [logData, setLogData] = useState([]);
  const [optionIp, setOptionIp] = useState([]);
  const [status, setStatus] = useState("loading");
  const [getPagination, setGetPagination] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("personId");
  const [exportStatus, setExportStatus] = useState("idle");
  const [totalDataFilter, setTotalDataFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [dataNationality, setDataNationality] = useState([]);
  const [actionPopup, setActionPopup] = useState(false);
  const [simpanModal, setSimpanModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [params, setParams] = useState({
    page: page,
    per_page: perPage,
    nama_petugas: "",
    no_passport: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const GetDataUserLog = async () => {
    setStatus("loading");
    const userCookie = Cookies.get("userdata");

    if (!userCookie) {
      console.error("No user cookie found");
      return;
    }

    const userInfo = JSON.parse(userCookie);
    console.log(userInfo, "userInfoSimpanPelintas");
    try {
      const { data } = await getAllSimpanPelintasApi({
        ...params,
        tpi_id: userInfo?.tpi_id,
      });
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
    setStatus("loading");
    const dataIpKamera = localStorage.getItem("cameraIp");
    const dataLog = {
      page: 1,
      per_page: perPage,
      name: "",
      personId: "",
      startDate: "",
      endDate: "",
      passStatus: "",
      ipCamera: dataIpKamera,
    };
    try {
      console.log(dataLog, "dataLog");
      const { data } = await getAllSimpanPelintasApi(dataLog);
      if (data.status === 200) {
        setStatus("success");
        setLogData(data?.data);
        setTotalDataFilter(data?.data?.length);
        setPagination(data?.pagination);
      }
    } catch (error) {
      setStatus("failed");
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
    console.log("running");
    const findData = logData.filter((data) => data.isSelected == true).length;
    if (findData > 0) {
      setActionPopup(true);
    } else {
      setActionPopup(false);
    }
  };

  const customRowRenderer = (row, index) => {
    return (
      <>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.no_passport}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.name || "Unkown"}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.gender === "M"
            ? "Laki-Laki"
            : row?.gender === "F"
              ? "Perempuan"
              : "Unkown"}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.tpi_id || "Unkown"}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.nationality || "Unkown"}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.user?.petugas?.nama_petugas}
        </td>
        <td className="text-center" onClick={() => handleOpenDetail(row)}>
          {row?.pass_status == "izinkan" ? "Izinkan" : "Tolak"}
        </td>
        <td className="text-center">
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
    });
  };

  const generateExcel = async () => {
    setExportStatus("loading");
    const res = await getAllSimpanPelintasApi({ paginate: false });
    const responseData = res?.data?.data;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Payment Report");

    const headers = [
      "no",
      "no plb",
      "name",
      "gender",
      "tpi id",
      "nationality",
      "nama petugas",
      "status",
    ];
    worksheet.addRow(headers);

    responseData.forEach((item, index) => {
      const row = [
        index + 1,
        item?.no_passport,
        item?.pelintas?.name,
        item?.pelintas?.gender === "M"
          ? "Laki-Laki"
          : item?.gender === "F"
            ? "Perempuan"
            : "Unkown",
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
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
        return `${baseFilename.replace(".xlsx", "")}_${date}_${time}.xlsx`;
      };
      const date = new Date();
      const formattedDate = date
        .toISOString()
        .slice(0, 19)
        .replace(/[-T:]/g, ""); // e.g., 20241119_123456
      const baseFilename = `Log_Simpan_Pelintas_${formattedDate}.xlsx`;
      const filename = getFilenameWithDateTime(baseFilename);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
        setExportStatus("success");
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

  const resultArray = logData.map((item) => ({
    src: `data:image/jpeg;base64,${item.image_base64}`,
  }));

  const handleOpenImage = (row, index) => {
    setIsOpenImage(true);
    setCurrentImage(index);
  };
  const nextImage = () => {
    setCurrentImage(currentImage + 1);
  };
  const prevImage = () => {
    setCurrentImage(currentImage - 1);
  };

  const handleCloseModalDetail = () => {
    setModalDetail(false);
    setDetailData({});
  };
  const handleOpenDetail = (row) => {
    setDetailData(row);
    setModalDetail(true);
    console.log(row);
  };

  const filterModalContent = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            No. PLB
          </label>
          <input
            type="text"
            placeholder="Enter PLB number"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={params.no_passport}
            onChange={(e) =>
              setParams({
                ...params,
                no_passport: e.target.value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Nama Petugas
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={params.nama_petugas}
            onChange={(e) =>
              setParams({
                ...params,
                nama_petugas: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z\s.-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Start Date
          </label>
          <input
            type="date"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
            value={params.startDate}
            onChange={(e) =>
              setParams({ ...params, startDate: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            End Date
          </label>
          <input
            type="date"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
            value={params.endDate}
            onChange={(e) => setParams({ ...params, endDate: e.target.value })}
          />
        </div>
      </div>
    );
  };

  const handleCloseModalFilter = () => {
    setShowModalFilter(false);
  };

  const handleSearchFilter = () => {
    handlePageChange(1);
    GetDataUserLog();
    setShowModalFilter(false);
  };

  const modalDetailRow = () => {
    const fields = [
      { label: "PLB / BCP Number", name: "no_passport", type: "text" },
      { label: "Full Name", name: "name", type: "text" },
      { label: "Date of Birth", name: "date_of_birth", type: "date" },
      { label: "Nationality", name: "nationality", type: "text" },
      { label: "Expired Date", name: "expired_date", type: "date" },
      {
        label: "Destination Location",
        name: "destination_location",
        type: "text",
      },
    ];

    const images = [
      { label: "Profile Image", key: "profile_image" },
      { label: "Photo Document", key: "photo_passport" },
      { label: "Photo FaceReg", key: "facreg_img" },
    ];

    return (
      <div className="flex flex-col gap-4 p-6">
        {/* Text Fields */}
        <div className="grid grid-cols-1 gap-3">
          {fields.map(({ label, name, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                {label}
              </label>
              {name === "gender" ? (
                <select
                  value={detailData.gender}
                  name="gender"
                  onChange={handleChange}
                  disabled
                  className="w-90 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
                >
                  <option value="">Pilih Gender</option>
                  <option value="M">Laki-Laki</option>
                  <option value="F">Perempuan</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={detailData[name] || ""}
                  onChange={handleChange}
                  disabled
                  className="w-90 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
                />
              )}
            </div>
          ))}

          {/* Gender — inserted after Date of Birth */}
          {/* (already handled above via fields array — add gender there if needed) */}
        </div>

        {/* Divider */}
        <hr className="border-gray-100 my-2" />

        {/* Image Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {images.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">{label}</span>
              <div className="flex items-center justify-center w-full h-44 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                {detailData[key] ? (
                  <img
                    src={`data:image/jpeg;base64,${detailData[key]}`}
                    alt={label}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDeleteLogs = async () => {
    const deletedData = selectedData.map((item) => {
      return item.id;
    });
    const data = {
      ids: deletedData,
    };
    try {
      const res = await apiDeleteSimpanPelintas(data);
      console.log("res?.status", res?.status);
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
      GetDataUserLogFilter();
    });

    return () => {
      socket.off("logDataUpdate");
    };
  }, []);

  useEffect(() => {
    handleActionPopup();
  }, [logData]);

  useEffect(() => {
    setParams((prevState) => ({
      ...prevState,
      page: page,
      per_page: perPage,
    }));
    setGetPagination(true);
  }, [page, perPage]);

  const selectedData = logData.filter((data) => data.isSelected == true);
  useEffect(() => {
    if (getPagination) {
      GetDataUserLog();
    }
    setGetPagination(false);
  }, [getPagination]);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Log Simpan Pelintas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola dan lihat daftar log pelintas batas yang telah disimpan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => navigate("/cpanel/synchronize-facereg")}
              className="px-6 py-2 border border-navy-900 text-navy-900 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Sinkronisasi Data
            </button>
            <button
              onClick={generateExcel}
              disabled={exportStatus === "loading"}
              className="px-6 py-2 border bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
            >
              {exportStatus === "loading" ? "Exporting..." : "Export"}
            </button>
            <button
              onClick={() => setShowModalFilter(true)}
              className="px-6 py-2 border bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2"
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
                    "gender",
                    "tpi id",
                    "nationality",
                    "nama petugas",
                    "status",
                    "action",
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
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
                      value={perPage}
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
        closeModal={handleCloseModalFilter}
        headerName="Filter Log"
        buttonName="Apply"
        width={800}
      >
        {filterModalContent()}
      </Modals>
      <Modals
        showModal={modalDetail}
        closeModal={handleCloseModalDetail}
        headerName="Detail Log"
        width={800}
        isDetail
      >
        {modalDetailRow()}
      </Modals>
      <Modals
        showModal={deleteModal}
        headerName="Hapus data"
        closeModal={() => setDeleteModal(false)}
        buttonName="Confirm"
        onConfirm={handleDeleteLogs}
        // onConfirm={() => {}}
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

export default LogSimpanPelintas;
