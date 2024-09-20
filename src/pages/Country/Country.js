import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import Modals from '../../components/Modal/Modal'
import './country.style.css'
import { DeleteNegara, DeletePetugas, getAllNegaraData, getAllPetugas, InsertNegara, InsertPetugas, UpdateNegara, UpdatePetugas } from '../../services/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toast } from '../../components/Toast/Toast'
import Cookies from 'js-cookie';

const Country = () => {
    const userCookie = Cookies.get('userdata')
    const userInfo = JSON.parse(userCookie)
    const [isShowModalAdd, setIsShowModalAdd] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({})
    const [dataPetugas, setDataPetugas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState({
        nama_negara: "",
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const dummyUser = [
        {
            nama: "bagas",
            nip: "34234242",
            gender: "M",
            tanggalLahir: "2024-09-01",
            jabatan: "kanim",
            role: "admin"
        }
    ]
    const getAllNegara = async (page = 1) => {
        try {
            setIsLoading(true)
            const response = await getAllNegaraData(search, page)
            if (response.status === 200) {
                console.log(response.data.data)
                setDataPetugas(response?.data?.data)
                setTotalPages(response.data.pagination.last_page);
                setCurrentPage(response.data.pagination.current_page);
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }


    useEffect(() => {
        getAllNegara()
    }, [])

    const handleAddNegara = async () => {
        try {
            setIsLoading(true)
            const res = await InsertNegara(formData);
            if (res.status == 201) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil ditambahkan.",
                });
                setIsLoading(false)
                getAllNegara();
                setIsShowModalAdd(false);
                setFormData({});
            }
        } catch (error) {
            setIsLoading(false)
            Toast.fire({
                icon: "error",
                title: "Gagal menambahkan petugas. Silakan coba lagi.",
            });
        }
    };

    const handleDeletePetugas = async () => {
        try {
            setIsLoading(true)
            const res = await DeleteNegara(formData.id);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil dihapus.",
                });
                setIsLoading(false)
                getAllNegara();
                setIsShowModalDelete(false);
                setFormData({});
            }
        } catch (error) {
            setIsLoading(false)
            Toast.fire({
                icon: "error",
                title: "Gagal menghapus petugas. Silakan coba lagi.",
            });
        }
    };

    const handleEditPetugas = async () => {
        try {
            setIsLoading(true)
            const res = await UpdateNegara(formData.id, { nama_negara: formData.nama_negara });
            if (res.status == 201) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil diperbarui.",
                });
                setIsLoading(false)
                setIsShowModal(false);
                getAllNegara();
                setFormData({});
            }
        } catch (error) {
            setIsLoading(false)
            Toast.fire({
                icon: "error",
                title: "Gagal memperbarui petugas. Silakan coba lagi.",
            });
        }
    };

    const openModalAdd = () => {
        setFormData({})
        setIsShowModalAdd(true)
    }
    const closeModal = () => {
        setIsShowModal(false)
    }
    const closeModalAdd = () => {
        setIsShowModalAdd(false)
    }
    const closeModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const editModal = (data) => {
        const editData = {
            id: data?.id,
            nama_negara: data?.nama_negara,
        }
        setFormData(editData)
        setIsShowModal(true)
    }
    const deleteModal = (data) => {
        setFormData(data)
        setIsShowModalDelete(true)
    }

    const addModalContent = () => {
        return (
            <div className="edit-container">
                <div>
                    <span>Nama Negara :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nama negara"
                        value={formData.nama_negara}
                        onChange={(e) => setFormData({ ...formData, nama_negara: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, nama_negara: e.target.value })}
                    />
                </div>

            </div>
        );
    };

    const deleteModalContent = () => {
        return (
            <div className="delete-container">
                <h3>Are You Sure Want Delete <span style={{ fontWeight: 'bold' }}>{formData?.nama_negara}</span> ?</h3>
            </div>
        )
    }

    const customRowRenderer = (row) => {
        return (
            <>
                <td>{row?.nama_negara}</td>

                {userInfo.role == 0 && <td className='button-action'>
                    <button onClick={() => editModal(row)}>Edit</button>
                    <button onClick={() => deleteModal(row)}>Delete</button>
                </td>}
            </>
        )
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Out of bounds check
        setCurrentPage(newPage);
        getAllNegara(newPage);
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
                <span>Page {currentPage} of {totalPages}</span>
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
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container">
                <div className="search-table-list" style={{ alignItems: 'center' }}>
                    <div className="search-table">
                        <span>Negara : </span>
                        <input
                            type="text"
                            placeholder="Masukkan nama negara"
                            onChange={(e) => setSearch({ ...search, nama_negara: e.target.value })}
                            value={search.nama_petugas}
                        />
                    </div>
                    <button onClick={getAllNegara}>Search</button>
                </div>
                {userInfo.role == 0 && <button onClick={openModalAdd}>Tambah</button>}
            </div>
            {isLoading ?
                (
                    <div className="loading">
                        <span className="loader-loading-table"></span>
                    </div>
                ) : (
                    <>
                        <TableLog
                            tHeader={userInfo.role == 0 ? ['no', 'nama', 'action'] : ['no', 'nama']}
                            tBody={dataPetugas}
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
            </Modals>

        </div>
    )
}

export default Country