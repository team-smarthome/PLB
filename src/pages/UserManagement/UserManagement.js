import React, { useEffect, useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import Modals from '../../components/Modal/Modal'
import './usermanagement.style.css'
import { DeletePetugas, getAllPetugas, InsertPetugas, UpdatePetugas } from '../../services/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toast } from '../../components/Toast/Toast'
import Cookies from 'js-cookie';

const UserManagement = () => {
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
        nip: "",
        role: "",
        nama_petugas: "",
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
    const getAllPetugasData = async (page = 1) => {
        try {
            setIsLoading(true)
            const response = await getAllPetugas(search, page)
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
        getAllPetugasData()
    }, [])

    const handleAddPetugas = async () => {
        try {
            setIsLoading(true)
            const res = await InsertPetugas(formData);
            if (res.status == 201) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil ditambahkan.",
                });
                setIsLoading(false)
                getAllPetugasData();
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
            const res = await DeletePetugas(formData.id);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil dihapus.",
                });
                setIsLoading(false)
                getAllPetugasData();
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
            const res = await UpdatePetugas(formData.id, formData);
            if (res.status == 200) {
                Toast.fire({
                    icon: "success",
                    title: "Petugas berhasil diperbarui.",
                });
                setIsLoading(false)
                getAllPetugasData();
                setIsShowModal(false);
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
            nama_petugas: data?.petugas?.nama_petugas,
            role: data?.role,
            nip: data?.nip,
            gender: data?.petugas?.gender,
            tanggal_lahir: data?.petugas?.tanggal_lahir,
            nama_jabatan: data?.jabatan?.nama_jabatan
        }
        setFormData(editData)
        setIsShowModal(true)
    }
    const deleteModal = (data) => {
        setFormData(data)
        setIsShowModalDelete(true)
    }

    const addModalContent = () => {

        const handleChange = (e) => {
            setFormData({
                ...formData,
                role: parseInt(e.target.value)
            });
        };

        const handleChangeJabatan = (e) => {
            setFormData({
                ...formData,
                nama_jabatan: e.target.value
            });
        };

        const handleChangeGender = (e) => {
            setFormData({
                ...formData,
                gender: e.target.value
            });
        };

        const handleDateChange = (e) => {
            setFormData({
                ...formData,
                tanggal_lahir: e.target.value
            });
        }

        const toggleShowPassword = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="edit-container">
                <div>
                    <span>Nama :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nama"
                        value={formData.nama_petugas}
                        onChange={(e) => setFormData({ ...formData, nama_petugas: e.target.value })}
                    />
                </div>
                <div>
                    <span>Password :</span>
                    <div style={{ position: 'relative', width: "67%" }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <span
                            onClick={toggleShowPassword}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div>
                    <span>NIP :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nip"
                        value={formData.nip}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    />
                </div>
                <div>
                    <span>Gender :</span>
                    <select value={formData.gender} onChange={handleChangeGender}>
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="M">Laki-laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div>
                    <span>Tanggal Lahir :</span>
                    <input
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <span>Jabatan :</span>
                    <select value={formData.nama_jabatan} onChange={handleChangeJabatan}>
                        <option value="">Pilih Jabatan</option>
                        <option value="kanim">kanim</option>
                        <option value="wkanim">wakil kanim</option>
                    </select>
                </div>
                <div>
                    <span>Role :</span>
                    <select value={formData.role} onChange={handleChange}>
                        <option value="">Pilih Role</option>
                        <option value={0}>Super Admin</option>
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                    </select>
                </div>
            </div>
        );
    };

    const editModalContent = () => {
        const handleChange = (e) => {
            setFormData({
                ...formData,
                role: parseInt(e.target.value)
            });
        };

        const handleChangeJabatan = (e) => {
            console.log(e.target.value, "sini")
            setFormData({
                ...formData,
                nama_jabatan: e.target.value
            });
        };

        const handleChangeGender = (e) => {
            setFormData({
                ...formData,
                gender: e.target.value
            });
        };

        const handleDateChange = (e) => {
            setFormData({
                ...formData,
                tanggal_lahir: e.target.value
            });
        }

        return (
            <div className="edit-container">
                <div>
                    <span>Nama :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nama"
                        value={formData.nama_petugas}
                        onChange={(e) => setFormData({ ...formData, nama_petugas: e.target.value })}
                    />
                </div>
                <div>
                    <span>NIP :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nip"
                        value={formData.nip || ''}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    />
                </div>
                <div>
                    <span>Gender :</span>
                    <select value={formData.gender || ''} onChange={handleChangeGender}>
                        <option value="M">Laki-laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div>
                    <span>Tanggal Lahir :</span>
                    <input
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <span>Jabatan :</span>
                    <select value={formData.nama_jabatan || ''} onChange={handleChangeJabatan}>
                        <option value="">Pilih Jabatan</option>
                        <option value="kanim">kanim</option>
                        <option value="wkanim">wakil kanim</option>
                    </select>
                </div>
                <div>
                    <span>Role :</span>
                    <select value={formData.role || ''} onChange={handleChange}>
                        <option value={0}>Super Admin</option>
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                    </select>
                </div>
            </div>
        );
    };

    const deleteModalContent = () => {
        return (
            <div className="delete-container">
                <h3>Are You Sure Want Delete {formData?.petugas?.nama_petugas} ?</h3>
            </div>
        )
    }

    const customRowRenderer = (row) => {
        return (
            <>
                <td>{row?.petugas?.nama_petugas}</td>
                <td>{row?.nip}</td>
                <td>{row?.petugas?.gender == "M" ? "Laki-laki" : "Perempuan"}</td>
                <td>{row?.petugas?.tanggal_lahir}</td>
                <td>{row?.jabatan?.nama_jabatan}</td>
                <td>{row?.role === 0 ? "Super Admin" : row?.role === 1 ? "admin" : "user"}</td>
                {userInfo.role == 0 && <td className='button-action'><button onClick={() => editModal(row)}>Edit</button><button onClick={() => deleteModal(row)}>Delete</button></td>}
            </>
        )
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Out of bounds check
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
            <div className="userManagement-header ">
                <div className='face-reg-filter-name'>
                    <div className='label-filter-name' style={{ width: "15%", paddingTop: '2.5%' }} >
                        <p>Input Name</p>
                    </div>
                    <div className='value-filter-name'>
                        <input type="text"
                            placeholder='Inser Name'
                            onChange={(e) => setSearch({ ...search, nama_petugas: e.target.value })}
                            value={search.nama_petugas}

                        />
                    </div>
                </div>
                <div className='face-reg-filter-kamera'>
                    <div className='label-filter-name' style={{
                        alignItems: 'flex-end',
                        paddingRight: "3%"
                    }}>
                        <p>Input Nip</p>
                    </div>
                    <div className='value-filter-name'>
                        <input
                            type="text"
                            placeholder='Input nip'
                            onChange={(e) => setSearch({ ...search, nip: e.target.value })}
                            value={search.nip}
                            style={{
                                width: "88%",
                                marginTop: '0%',
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='submit-buttons'>
                {userInfo.role == 0 && <button
                    onClick={openModalAdd}
                    className='add-data'
                >Add
                </button>}
                <button
                    onClick={getAllPetugasData}
                    className='search-data'
                >Search
                </button>

            </div>
            {isLoading ?
                (
                    <div className="loading">
                        <span className="loader-loading-table"></span>
                    </div>
                ) : (
                    <>
                        <TableLog
                            tHeader={userInfo.role == 0 ? ['no', 'nama', 'NIP', 'gender', 'Tanggal Lahir', 'jabatan', 'role', 'action'] : ['no', 'nama', 'NIP', 'gender', 'Tanggal Lahir', 'jabatan', 'role']}
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
                headerName="Add User"
                buttonName="Confirm"
                onConfirm={handleAddPetugas}
            >
                {addModalContent()}
            </Modals>
            <Modals
                showModal={isShowModal}
                closeModal={closeModal}
                headerName="Edit User"
                buttonName="Confirm"
                onConfirm={handleEditPetugas}
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
    )
}

export default UserManagement