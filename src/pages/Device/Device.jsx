import React, { useEffect, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import Modals from "../../components/Modal/Modal";
import Select from "react-select";
import "./device.style.css";
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
      <div className="edit-container">
        <div>
          <span>Nama Device :</span>
          <input
            type="text"
            placeholder="Masukkan nama device"
            value={formData.name}
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
        <div>
          <span>Ip Address :</span>
          <input
            type="text"
            placeholder="Masukkan ip address device"
            value={formData.ip_address}
            onChange={(e) =>
              setFormData({
                ...formData,
                ip_address: e.target.value.replace(/[^0-9.]/g, ""),
              })
            }
          />
        </div>
        <div>
          <span>Mac Address :</span>
          <input
            type="text"
            placeholder="Masukkan mac address"
            value={formData.mac_address}
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
        <div>
          <span>Tipe Device :</span>
          <select
            className="custom-select"
            value={formData.device_type_id}
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
        <div>
          <span>Status Device :</span>
          <select
            className="custom-select"
            value={formData.device_status}
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
        <div>
          <span>Device Number :</span>
          <input
            type="text"
            placeholder="Masukkan device number"
            value={formData.device_number}
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
        <div>
          <span>Product Key :</span>
          <input
            type="text"
            placeholder="Masukkan product key"
            value={formData.product_key}
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
        <div>
          <span>Tgl. Instalasi :</span>
          <input
            type="datetime-local"
            placeholder="Masukkan tgl instalasi"
            value={formData.tgl_dipasang}
            onChange={(e) =>
              setFormData({ ...formData, tgl_dipasang: e.target.value })
            }
          />
        </div>
        <div>
          <span>Lokasi TPI :</span>
          <input
            type="text"
            placeholder="Masukkan lokasi tpi"
            value={formData.tpi_id}
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
      <div className="edit-container">
        <div>
          <span>Nama Device :</span>
          <input
            type="text"
            placeholder="Masukkan nama device"
            value={formData.name}
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
        <div>
          <span>Ip Address :</span>
          <input
            type="text"
            placeholder="Masukkan ip address device"
            value={formData.ip_address}
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
        <div>
          <span>Mac Address :</span>
          <input
            type="text"
            placeholder="Masukkan mac address"
            value={formData.mac_address}
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
        <div>
          <span>Tipe Device :</span>
          <select
            className="custom-select"
            value={formData.device_type_id}
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
        <div>
          <span>Status Device :</span>
          <select
            className="custom-select"
            value={formData.device_status}
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
        <div>
          <span>Device Number :</span>
          <input
            type="text"
            placeholder="Masukkan device number"
            value={formData.device_number}
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
        <div>
          <span>Product Key :</span>
          <input
            type="text"
            placeholder="Masukkan product key"
            value={formData.product_key}
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
        <div>
          <span>Tgl. Instalasi :</span>
          <input
            type="text"
            placeholder="Masukkan tgl instalasi"
            value={formData.tgl_dipasang}
            onChange={(e) =>
              setFormData({ ...formData, tgl_dipasang: e.target.value })
            }
          />
        </div>
        <div>
          <span>Lokasi TPI :</span>
          <input
            type="text"
            placeholder="Masukkan lokasi tpi"
            value={formData.tpi_id}
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
      <div className="delete-container">
        <h3>
          Are You Sure Want Delete{" "}
          <span style={{ fontWeight: "bold" }}>{formData?.name}</span> ?
        </h3>
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
        <td>{row?.name}</td>
        <td>{row?.ip_address}</td>
        <td>{row?.mac_address}</td>
        <td>{row?.device_type?.name}</td>
        <td>{row?.device_status}</td>
        <td>{row?.device_number}</td>
        <td>{row?.product_key}</td>
        <td>{row?.tgl_dipasang}</td>
        <td>{row?.tpi_id}</td>

        {userInfo.role == 0 && (
          <td className="button-action">
            <button onClick={() => editModal(row)}>Edit</button>
            <button onClick={() => deleteModal(row)}>Delete</button>
          </td>
        )}
      </>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Out of bounds check
    setCurrentPage(newPage);
    getAllDevice(newPage);
  };

  useEffect(() => {
    getAllDevice();
    getDeviceType();
  }, []);

  useEffect(() => {
    getAllDevice();
  }, [currentPage, search, perPage]);

  const renderPaginationControls = () => {
    return (
      <div className="table-footer">
        <>
          Show {totalDataFilter} of {pagination?.total} entries
        </>
        <div className="table-footer-controls">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
            }}
            className="table-footer-controls-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <Pagination
            pageCount={pagination?.last_page}
            onPageChange={(selectedPage) => setPage(selectedPage)}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#eeeeee", height: "100%" }}>
      <div
        className="input-search-container search-country"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div className="search-table-list" style={{ alignItems: "center" }}>
          <div className="search-table">
            {/* <span>Negara : </span> */}
            <div className="input-icon-wrapper-country">
              <FaSearch className="input-icon" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
          </div>
          <button
            // onClick={getAllDevice}
            style={{
              backgroundColor: "#4F70AB",
            }}
          >
            Search
          </button>
        </div>
        {userInfo.role == 0 && (
          <button
            style={{
              marginRight: 10,
              marginLeft: 10,
            }}
            onClick={openModalAdd}
          >
            Add
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="loading">
          <span className="loader-loading-table"></span>
        </div>
      ) : (
        <>
          <TableLog
            tHeader={tHeader}
            tBody={dataDevice}
            onEdit={editModal}
            onDelete={deleteModal}
            rowRenderer={customRowRenderer}
          />
          {renderPaginationControls()}
        </>
      )}
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
