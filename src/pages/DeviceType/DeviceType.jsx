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
      <div className="edit-container">
        <div>
          <span>Nama Device Type :</span>
          <input
            type="text"
            placeholder="Masukkan device type"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        <td>{row?.name}</td>

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
    getAllDeviceType(newPage);
  };

  useEffect(() => {
    getAllDeviceType();
  }, [search, currentPage, perPage]);

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
            {/* <input
                            type="text"
                            placeholder="Masukkan nama negara"
                            onChange={(e) => setSearch({ ...search, nama_negara: e.target.value })}
                            value={search.nama_petugas}
                        /> */}
          </div>
          <button
            onClick={getAllDeviceType}
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
            tBody={dataDeviceType}
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
