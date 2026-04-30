import React, { useEffect, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import Modals from "../../components/Modal/Modal";
import Select from "react-select";
import {
  DeleteDevice,
  getAllDeviceaData,
  getAllDeviceTypeData,
  InsertDevice,
  UpdateDevice,
} from "../../services/api";
import { Toast } from "../../components/Toast/Toast";
import Pagination from "../../components/Pagination/Pagination";

const Device = () => {
  const userCookie = Cookies.get("userdata");
  const userInfo = JSON.parse(userCookie);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataDevice, setDataDevice] = useState([]);
  const [deviceType, setDeviceType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });
  const [totalDataFilter, setTotalDataFilter] = useState(0);

  console.log("userInfo: ", search);
  const tHeader = [
    "nama device",
    "ip address",
    "mac address",
    "tipe device",
    "status device",
    "device number",
    "product key",
    "tanggal instalasi",
    "lokasi tpi",
    "action",
  ];
  const tBody = [
    {
      nama_device: "device 1",
      ip_address: "[IP_ADDRESS]",
      lokasi_tpi: "tpi1",
      status: "aktif",
      tanggal_dipasang: "2022-01-01",
    },
    {
      nama_device: "device 2",
      ip_address: "[IP_ADDRESS]",
      lokasi_tpi: "tpi2",
      status: "aktif",
      tanggal_dipasang: "2022-01-01",
    },
  ];

  const addModalContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Nama Device
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan nama device"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9- ]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Ip Address
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan ip address device"
            value={formData.ip_address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ip_address: e.target.value.replace(/[^0-9.]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Mac Address
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan mac address"
            value={formData.mac_address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                mac_address: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tipe Device
          </span>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={formData.device_type_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, device_type_id: e.target.value })
            }
          >
            <option value="" disabled>
              Select...
            </option>
            {deviceType.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Status Device
          </span>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={formData.device_status || ""}
            onChange={(e) =>
              setFormData({ ...formData, device_status: e.target.value })
            }
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="aktif">Aktif</option>
            <option value="non aktif">Non Aktif</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Device Number
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan device number"
            value={formData.device_number || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                device_number: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Product Key
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan product key"
            value={formData.product_key || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                product_key: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tgl. Instalasi
          </span>
          <input
            type="datetime-local"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
            value={formData.tgl_dipasang || ""}
            onChange={(e) =>
              setFormData({ ...formData, tgl_dipasang: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Lokasi TPI
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan lokasi tpi"
            value={formData.tpi_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tpi_id: e.target.value.toUpperCase().replace(/[^A-Za-z ]/g, ""),
              })
            }
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
            Nama Device
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan nama device"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9- ]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Ip Address
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan ip address device"
            value={formData.ip_address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ip_address: e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(.*\..*\..*)\./g, "$1"),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Mac Address
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan mac address"
            value={formData.mac_address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                mac_address: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tipe Device
          </span>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={formData.device_type_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, device_type_id: e.target.value })
            }
          >
            <option value="" disabled>
              Select...
            </option>
            {deviceType.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Status Device
          </span>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={formData.device_status || ""}
            onChange={(e) =>
              setFormData({ ...formData, device_status: e.target.value })
            }
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="aktif">Aktif</option>
            <option value="non aktif">Non Aktif</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Device Number
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan device number"
            value={formData.device_number || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                device_number: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Product Key
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan product key"
            value={formData.product_key || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                product_key: e.target.value
                  .toUpperCase()
                  .replace(/[^A-Za-z0-9-]/g, ""),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tgl. Instalasi
          </span>
          <input
            type="datetime-local"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
            value={formData.tgl_dipasang || ""}
            onChange={(e) =>
              setFormData({ ...formData, tgl_dipasang: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Lokasi TPI
          </span>
          <input
            type="text"
            className="w-90 px-4 h-11 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Masukkan lokasi tpi"
            value={formData.tpi_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tpi_id: e.target.value.toUpperCase().replace(/[^A-Za-z ]/g, ""),
              })
            }
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
      ip_address: data?.ip_address,
      mac_address: data?.mac_address,
      device_type_id: data?.device_type_id,
      device_status: data?.device_status,
      device_number: data?.device_number,
      product_key: data?.product_key,
      tgl_dipasang: data?.tgl_dipasang,
      tpi_id: data?.tpi_id,
    };
    setFormData(editData);
    setIsShowModal(true);
  };

  const deleteModal = (data) => {
    setFormData(data);
    setIsShowModalDelete(true);
  };

  const handleSearch = () => {
    console.warn("search init...");
    setCurrentPage(1);
    getAllDevice();
  };

  const getAllDevice = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await getAllDeviceaData({
        ...search,
        page,
        per_page: perPage,
      });
      if (response.status === 200) {
        console.log("response getAllDevice: ", response.data.data);
        setDataDevice(response?.data?.data);
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

  const getDeviceType = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDeviceTypeData();
      if (response.status === 200) {
        const dataDeviceType = response?.data?.data?.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setDeviceType(dataDeviceType);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleAddDevice = async () => {
    try {
      console.log("formData: ", formData);
      setIsLoading(true);
      const res = await InsertDevice(formData);
      if (res?.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Device berhasil ditambahkan.",
        });
        setIsLoading(false);
        getAllDevice();
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

  const handleEditDevice = async () => {
    try {
      setIsLoading(true);
      const res = await UpdateDevice(formData.id, formData);
      if (res.status == 200) {
        Toast.fire({
          icon: "success",
          title: "Device berhasil diperbarui.",
        });
        setIsLoading(false);
        setIsShowModal(false);
        getAllDevice();
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal memperbarui device. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteDevice = async () => {
    try {
      setIsLoading(true);
      const res = await DeleteDevice(formData.id);
      if (res.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Device berhasil dihapus.",
        });
        setIsLoading(false);
        getAllDevice();
        setIsShowModalDelete(false);
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal menghapus device. Silakan coba lagi.",
      });
    }
  };

  const customRowRenderer = (row) => {
    return (
      <>
        <td className="text-center">{row?.name}</td>
        <td className="text-center">{row?.ip_address}</td>
        <td className="text-center">{row?.mac_address}</td>
        <td className="text-center">{row?.device_type?.name}</td>
        <td className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${row?.device_status === "aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
          >
            {row?.device_status}
          </span>
        </td>
        <td className="text-center">{row?.device_number}</td>
        <td className="text-center">{row?.product_key}</td>
        <td className="text-center">{row?.tgl_dipasang}</td>
        <td className="text-center">{row?.tpi_id}</td>

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
    getAllDevice(newPage);
  };

  useEffect(() => {
    getAllDevice();
    getDeviceType();
  }, []);

  useEffect(() => {
    getAllDevice();
  }, [currentPage, perPage]);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Device Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data dan status device yang terdaftar dalam sistem.
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
            Add Device
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
                placeholder="Search Device"
                className="pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-100 border border-gray-200 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
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
                  tBody={dataDevice}
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
        onConfirm={handleAddDevice}
      >
        {addModalContent()}
      </Modals>
      <Modals
        showModal={isShowModal}
        closeModal={closeModal}
        headerName="Edit Device"
        buttonName="Confirm"
        onConfirm={handleEditDevice}
      >
        {editModalContent()}
      </Modals>
      <Modals
        showModal={isShowModalDelete}
        closeModal={closeModalDelete}
        headerName="Hapus Device"
        buttonName="delete"
        onConfirm={handleDeleteDevice}
      >
        {deleteModalContent()}
      </Modals>
    </div>
  );
};

export default Device;
