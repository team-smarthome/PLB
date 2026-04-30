import React, { useEffect, useRef, useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import Modals from "../../components/Modal/Modal";
import {
  DeletePetugas,
  getAllJabatanData,
  getAllPetugas,
  getAllTpiData,
  InsertPetugas,
  UpdatePetugas,
} from "../../services/api";
import { FaEye, FaEyeSlash, FaSearch } from "react-icons/fa";
import { Toast } from "../../components/Toast/Toast";
import Cookies from "js-cookie";
import Pagination from "../../components/Pagination/Pagination";

const UserManagement = () => {
  const userCookie = Cookies.get("userdata");
  const userInfo = userCookie ? JSON.parse(userCookie) : { role: null };

  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataPetugas, setDataPetugas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataTpi, setDataTpi] = useState([]);
  const [dataJabatan, setDataJabatan] = useState([]);
  const [search, setSearch] = useState({
    nip: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });
  const [totalDataFilter, setTotalDataFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const pageRef = useRef(page);
  const getAllPetugasData = async () => {
    try {
      setIsLoading(true);
      const { data: getPetugas } = await getAllPetugas({
        ...search,
        page: pageRef.current,
        per_page: perPage,
      });
      if (getPetugas.status === 200) {
        setDataPetugas(getPetugas?.data);
        setPagination(getPetugas?.pagination);
        setTotalDataFilter(getPetugas?.data?.length);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleGetallDataJabatan = async () => {
    try {
      const res = await getAllJabatanData();
      if (res.status == 200) {
        setDataJabatan(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllTpiData = async (page = 1) => {
    try {
      const response = await getAllTpiData();
      if (response.status === 200) {
        console.log(response.data.data, "ada gk");
        setDataTpi(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    pageRef.current = 1;
    setPage(1);
    getAllPetugasData();
  };

  useEffect(() => {
    pageRef.current = page;
    getAllPetugasData();
  }, [page, perPage]);

  useEffect(() => {
    getAllPetugasData();
    handleGetAllTpiData();
    handleGetallDataJabatan();
  }, []);

  const handleAddPetugas = async () => {
    try {
      setIsLoading(true);
      const res = await InsertPetugas(formData);
      if (res.status == 201) {
        Toast.fire({
          icon: "success",
          title: "Petugas berhasil ditambahkan.",
        });
        setIsLoading(false);
        getAllPetugasData();
        setIsShowModalAdd(false);
        setFormData({});
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal menambahkan petugas. Silakan coba lagi.",
      });
    }
  };

  const handleDeletePetugas = async () => {
    try {
      setIsLoading(true);
      const res = await DeletePetugas(formData.id);
      if (res.status === 200) {
        Toast.fire({
          icon: "success",
          title: "Petugas berhasil dihapus.",
        });
        setIsLoading(false);
        getAllPetugasData();
        setIsShowModalDelete(false);
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal menghapus petugas. Silakan coba lagi.",
      });
    }
  };

  const handleEditPetugas = async () => {
    try {
      setIsLoading(true);
      const res = await UpdatePetugas(formData.id, formData);
      if (res.status == 200) {
        Toast.fire({
          icon: "success",
          title: "Petugas berhasil diperbarui.",
        });
        setIsLoading(false);
        getAllPetugasData();
        setIsShowModal(false);
        setFormData({});
      }
    } catch (error) {
      setIsLoading(false);
      Toast.fire({
        icon: "error",
        title: "Gagal memperbarui petugas. Silakan coba lagi.",
      });
    }
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
    console.log(data?.jabatan?.nama_jabatan, "tan");
    const editData = {
      id: data?.id,
      nama_petugas: data?.petugas?.nama_petugas,
      role: data?.role,
      nip: data?.nip,
      gender: data?.petugas?.gender,
      tanggal_lahir: data?.petugas?.tanggal_lahir,
      nama_jabatan: data?.jabatan?.nama_jabatan,
      tpi_id: data?.tpi_id,
      nama_tpi: data?.nama_tpi,
    };
    setFormData(editData);
    setIsShowModal(true);
  };
  const deleteModal = (data) => {
    setFormData(data);
    setIsShowModalDelete(true);
  };

  const addModalContent = () => {
    const handleChange = (e) => {
      setFormData({
        ...formData,
        role: parseInt(e.target.value),
      });
    };

    const handleChangeJabatan = (e) => {
      setFormData({
        ...formData,
        nama_jabatan: e.target.value,
      });
    };

    const handleChangeGender = (e) => {
      setFormData({
        ...formData,
        gender: e.target.value,
      });
    };

    const handleDateChange = (e) => {
      setFormData({
        ...formData,
        tanggal_lahir: e.target.value,
      });
    };

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const handleTpiChange = (e) => {
      const value = e.target.value;
      const findTpi = dataTpi.find((tpi) => tpi.id_tpi == value);
      setFormData({
        ...formData,
        tpi_id: findTpi.id_tpi,
        nama_tpi: findTpi.nama_tpi,
      });
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama :</label>
          <input
            type="text"
            placeholder="Masukkan nama"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.nama_petugas || ""}
            onChange={(e) =>
              setFormData({ ...formData, nama_petugas: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Password :
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">NIP :</label>
          <input
            type="text"
            placeholder="Masukkan nip"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.nip || ""}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Gender :
          </label>
          <select
            value={formData.gender || ""}
            onChange={handleChangeGender}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="M">Laki-laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Tanggal Lahir :
          </label>
          <input
            type="date"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.tanggal_lahir || ""}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Jabatan :
          </label>
          <select
            value={formData.nama_jabatan || ""}
            onChange={handleChangeJabatan}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Jabatan</option>
            {dataJabatan?.map((item, index) => {
              return (
                <option key={index} value={item.nama_jabatan}>
                  {item.nama_jabatan}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Role :</label>
          <select
            value={formData.role !== undefined ? formData.role : ""}
            onChange={handleChange}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Role</option>
            <option value={0}>Admin</option>
            <option value={1}>Pelintas</option>
            <option value={2}>Register</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">TPI :</label>
          <select
            value={formData.tpi_id || formData.id_tpi || ""}
            onChange={handleTpiChange}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Tpi</option>
            {dataTpi.map((tpi, index) => {
              return (
                <option key={index} value={tpi.id_tpi}>
                  {tpi.nama_tpi}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  };

  const editModalContent = () => {
    const handleChange = (e) => {
      setFormData({
        ...formData,
        role: parseInt(e.target.value),
      });
    };

    const handleChangeJabatan = (e) => {
      console.log(e.target.value, "sini");
      setFormData({
        ...formData,
        nama_jabatan: e.target.value,
      });
    };

    const handleChangeGender = (e) => {
      setFormData({
        ...formData,
        gender: e.target.value,
      });
    };

    const handleDateChange = (e) => {
      setFormData({
        ...formData,
        tanggal_lahir: e.target.value,
      });
    };

    const handleTpiChange = (e) => {
      const value = e.target.value;
      // console.log(object)
      const findTpi = dataTpi.find((tpi) => tpi.id_tpi == value);
      // console.log(findTpi, "sini")
      setFormData({
        ...formData,
        tpi_id: findTpi.id_tpi,
        nama_tpi: findTpi.nama_tpi,
      });
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama :</label>
          <input
            type="text"
            placeholder="Masukkan nama"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.nama_petugas || ""}
            onChange={(e) =>
              setFormData({ ...formData, nama_petugas: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">NIP :</label>
          <input
            type="text"
            placeholder="Masukkan nip"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.nip || ""}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Gender :
          </label>
          <select
            value={formData.gender || ""}
            onChange={handleChangeGender}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="M">Laki-laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Tanggal Lahir :
          </label>
          <input
            type="date"
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            value={formData.tanggal_lahir || ""}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Jabatan :
          </label>
          <select
            value={formData.nama_jabatan || ""}
            onChange={handleChangeJabatan}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Jabatan</option>
            {dataJabatan?.map((item, index) => {
              return (
                <option key={index} value={item.nama_jabatan}>
                  {item.nama_jabatan}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Role :</label>
          <select
            value={formData.role !== undefined ? formData.role : ""}
            onChange={handleChange}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value={0}>Admin</option>
            <option value={1}>Pelintas</option>
            <option value={2}>Register</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">TPI :</label>
          <select
            value={formData.tpi_id || ""}
            onChange={handleTpiChange}
            className="w-90 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Pilih Tpi</option>
            {dataTpi.map((tpi, index) => {
              return (
                <option key={index} value={tpi.id_tpi}>
                  {tpi.nama_tpi}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  };

  const deleteModalContent = () => {
    return (
      <div className="py-4">
        <p className="text-gray-800 text-lg text-center">
          Are You Sure Want Delete{" "}
          <span className="font-bold text-navy-900">
            {formData?.petugas?.nama_petugas}
          </span>{" "}
          ?
        </p>
      </div>
    );
  };

  const customRowRenderer = (row) => {
    return (
      <>
        <td className="text-center">{row?.petugas?.nama_petugas}</td>
        <td className="text-center">{row?.nip}</td>
        <td className="text-center">
          {row?.petugas?.gender == "M" ? "Laki-laki" : "Perempuan"}
        </td>
        <td className="text-center">{row?.petugas?.tanggal_lahir}</td>
        <td className="text-center">{row?.jabatan?.nama_jabatan}</td>
        <td className="text-center">
          {row?.role === 0
            ? "Admin"
            : row?.role === 1
              ? "Pelintas"
              : "Register"}
        </td>
        {userInfo.role == 0 && (
          <td className="flex items-center justify-center gap-2">
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
          </td>
        )}
      </>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    getAllPetugasData(newPage);
  };

  const renderPaginationControls = () => {
    return (
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data petugas, hak akses, dan manajemen akun pengguna.
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
            Add User
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
                placeholder="Search by NIP"
                className="pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-100 border border-gray-200 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
                onChange={(e) => setSearch({ ...search, nip: e.target.value })}
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
                  tHeader={
                    userInfo.role == 0
                      ? [
                          "nama",
                          "NIP",
                          "gender",
                          "Tanggal Lahir",
                          "jabatan",
                          "role",
                          "action",
                        ]
                      : [
                          "nama",
                          "NIP",
                          "gender",
                          "Tanggal Lahir",
                          "jabatan",
                          "role",
                        ]
                  }
                  tBody={dataPetugas}
                  onEdit={editModal}
                  onDelete={deleteModal}
                  showIndex={true}
                  rowRenderer={customRowRenderer}
                  page={page}
                  perPage={pagination?.per_page}
                />
              </div>

              <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-medium text-gray-900">
                    {dataPetugas?.length || 0}
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
                    currentPage={page}
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
        headerName="Add User"
        buttonName="Confirm"
        onConfirm={handleAddPetugas}
        width={700}
      >
        {addModalContent()}
      </Modals>
      <Modals
        showModal={isShowModal}
        closeModal={closeModal}
        headerName="Edit User"
        buttonName="Confirm"
        onConfirm={handleEditPetugas}
        width="500px"
      >
        {editModalContent()}
      </Modals>
      <Modals
        showModal={isShowModalDelete}
        closeModal={closeModalDelete}
        headerName="Delete User"
        buttonName="delete"
        onConfirm={handleDeletePetugas}
      >
        {deleteModalContent()}
      </Modals>
    </div>
  );
};

export default UserManagement;
