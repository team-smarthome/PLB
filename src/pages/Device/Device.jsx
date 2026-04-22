import React, { useState } from "react";
import TableLog from "../../components/TableLog/TableLog";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";

const Device = () => {
  const userCookie = Cookies.get("userdata");
  const userInfo = JSON.parse(userCookie);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataPetugas, setDataPetugas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({
    nama_negara: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("userInfo: ");
  const tHeader = [
    "nama device",
    "ip address",
    "lokasi tpi",
    "status",
    "tanggal dipasang",
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
          <span>Nama Negara :</span>
          <input
            type="text"
            placeholder="Masukkan nama negara"
            value={formData.nama_negara}
            onChange={(e) =>
              setFormData({ ...formData, nama_negara: e.target.value })
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
          <span>Nama :</span>
          <input
            type="text"
            placeholder="Masukkan nama negara"
            value={formData.nama_negara}
            onChange={(e) =>
              setFormData({ ...formData, nama_negara: e.target.value })
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
          <span style={{ fontWeight: "bold" }}>{formData?.nama_negara}</span> ?
        </h3>
      </div>
    );
  };

  const customRowRenderer = (row) => {
    return (
      <>
        <td>{row?.nama_negara}</td>

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
    // getAllNegara(newPage);
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
                // onChange={(e) =>
                //   setSearch({ ...search, nama_negara: e.target.value })
                // }
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
            // onClick={getAllNegara}
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
            // onClick={openModalAdd}
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
            tBody={tBody}
            // onEdit={editModal}
            // onDelete={deleteModal}
            // rowRenderer={customRowRenderer}
          />
          {renderPaginationControls()}
        </>
      )}
      {/* <Modals
        showModal={isShowModalAdd}
        closeModal={closeModalAdd}
        headerName="Tambah Negara"
        buttonName="Confirm"
        onConfirm={handleAddNegara}
      >
        {addModalContent()}
      </Modals>
      <Modals
        showModal={isShowModal}
        closeModal={closeModal}
        headerName="Edit Negara"
        buttonName="Confirm"
        onConfirm={handleEditPetugas}
      >
        {editModalContent()}
      </Modals>
      <Modals
        showModal={isShowModalDelete}
        closeModal={closeModalDelete}
        headerName="Hapus Negara"
        buttonName="delete"
        onConfirm={handleDeletePetugas}
      >
        {deleteModalContent()}
      </Modals> */}
    </div>
  );
};

export default Device;
