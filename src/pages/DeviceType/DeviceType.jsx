import React, { useEffect, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import Modals from "../../components/Modal/Modal";
import {
  DeleteDeviceType,
  getAllDeviceTypeData,
  InsertDeviceType,
  UpdateDeviceType,
} from "../../services/api";
import { Toast } from "../../components/Toast/Toast";
import Pagination from "../../components/Pagination/Pagination";

const DeviceType = () => {
  const userCookie = Cookies.get("userdata");
  const userInfo = JSON.parse(userCookie);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataDeviceType, setdataDeviceType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({
    name: "",
  });
  const [totalDataFilter, setTotalDataFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const tHeader = ["nama jenis device", "action"];
  const tBody = [
    {
      name: "device 1",
    },
    {
      name: "device 2",
    },
  ];

  const addModalContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Nama Device Type
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan device type"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
    );
  };

  const editModalContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Nama Device Type
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan nama device"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
    );
  };

  const deleteModalContent = () => {
    return (
      <div className="py-4 text-center">
        <span className="text-lg text-gray-700">
          Are You Sure Want Delete{" "}
          <span className="font-bold text-navy-900">{formData?.name}</span>?
        </span>
      </div>
    );
  };

  const openModalAdd = () => {
    setFormData({});
    setIsShowModalAdd(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const closeModalAdd = () => {
    setIsShowModalAdd(false);
  };

  const closeModalDelete = () => {
    setIsShowModalDelete(false);
  };

  const editModal = (data) => {
    const editData = {
      id: data?.id,
      name: data?.name,
    };
    setFormData(editData);
    setIsShowModal(true);
  };

  const deleteModal = (data) => {
    setFormData(data);
    setIsShowModalDelete(true);
  };

  const getAllDeviceType = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await getAllDeviceTypeData({
        ...search,
        page,
        per_page: perPage,
      });
      if (response.status === 200) {
        setdataDeviceType(response?.data?.data);
        setTotalPages(response.data.pagination.last_page);
        setPagination(response?.data?.pagination);
        setCurrentPage(response.data.pagination.current_page);
        setTotalDataFilter(response?.data?.data?.length);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const handleAddDeviceType = async () => {
    try {
      setIsLoading(true);
      const res = await InsertDeviceType(formData);
      if (res.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Destinasi lokasi berhasil ditambahkan.",
        });
        setIsLoading(false);
        getAllDeviceType();
        setIsShowModalAdd(false);
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal menambahkan destinasi lokasi. Silakan coba lagi.",
      });
    }
  };

  const handleEditDeviceType = async () => {
    try {
      setIsLoading(true);
      const res = await UpdateDeviceType(formData.id, formData);
      if (res.status == 200) {
        Toast.fire({
          icon: "success",
          title: "Device type berhasil diperbarui.",
        });
        setIsLoading(false);
        setIsShowModal(false);
        getAllDeviceType();
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal memperbarui device type. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteDeviceType = async () => {
    try {
      setIsLoading(true);
      const res = await DeleteDeviceType(formData.id);
      if (res?.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Device Type berhasil dihapus.",
        });
        setIsLoading(false);
        getAllDeviceType();
        setIsShowModalDelete(false);
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal menghapus destinasi lokasi. Silakan coba lagi.",
      });
    }
  };

  const customRowRenderer = (row) => {
    return (
      <>
        <td className="text-center">{row?.name}</td>

        {userInfo.role == 0 && (
          <td className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => editModal(row)}
                className="w-16 py-2 bg-[#fbaf17] text-base border-none text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => deleteModal(row)}
                className="w-16 py-2 text-base bg-red-500 border-none text-white rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </td>
        )}
      </>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    getAllDeviceType(newPage);
  };

  useEffect(() => {
    getAllDeviceType();
  }, [search, currentPage, perPage]);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Device Type Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola jenis-jenis device yang didukung oleh sistem.
          </p>
        </div>

        {userInfo.role == 0 && (
          <button
            onClick={openModalAdd}
            className="px-6 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
            </svg>
            Add Device Type
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-4 w-full mt-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Device Type"
                className="pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-100 border border-gray-200 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <button
              onClick={getAllDeviceType}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white p-6 pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span
                className="w-10 h-10 rounded-full animate-spin"
                style={{
                  border: "4px solid #172951",
                  borderTopColor: "transparent",
                }}
              ></span>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
                <TableLog
                  tHeader={tHeader}
                  tBody={dataDeviceType}
                  onEdit={editModal}
                  onDelete={deleteModal}
                  rowRenderer={customRowRenderer}
                />
              </div>

              <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-medium text-gray-900">
                    {totalDataFilter}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-gray-900">
                    {pagination?.total || 0}
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
                    onPageChange={(selectedPage) => setPage(selectedPage)}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modals
        showModal={isShowModalAdd}
        closeModal={closeModalAdd}
        headerName="Tambah Device"
        buttonName="Confirm"
        onConfirm={handleAddDeviceType}
      >
        {addModalContent()}
      </Modals>
      <Modals
        showModal={isShowModal}
        closeModal={closeModal}
        headerName="Edit Device"
        buttonName="Confirm"
        onConfirm={handleEditDeviceType}
      >
        {editModalContent()}
      </Modals>
      <Modals
        showModal={isShowModalDelete}
        closeModal={closeModalDelete}
        headerName="Hapus Device"
        buttonName="delete"
        onConfirm={handleDeleteDeviceType}
      >
        {deleteModalContent()}
      </Modals>
    </div>
  );
};

export default DeviceType;
