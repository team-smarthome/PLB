import React, { useState } from 'react'
import TableLog from '../../components/TableLog/TableLog'
import Modals from '../../components/Modal/Modal'
import './usermanagement.style.css'

const UserManagement = () => {
    const [isShowModal, setIsShowModal] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [detailUser, setDetailUser] = useState({})
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
    const closeModal = () => {
        setIsShowModal(false)
    }
    const closeModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const editModal = (data) => {
        setIsShowModal(true)
        setDetailUser(data)
    }
    const deleteModal = (data) => {
        setIsShowModalDelete(true)
    }

    const editModalContent = () => {
        const handleChange = (e) => {
            setDetailUser({
                ...detailUser,
                role: e.target.value
            });
        };
        const handleChangeJabatan = (e) => {
            setDetailUser({
                ...detailUser,
                jabatan: e.target.value
            });
        };
        const handleChangeGender = (e) => {
            setDetailUser({
                ...detailUser,
                gender: e.target.value
            });
        };
        const handleDateChange = (e) => {
            setDetailUser({
                ...detailUser,
                tanggalLahir: e.target.value
            });
        }


        return (
            <div className="edit-container">
                <div>
                    <span>Nama :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nama"
                        value={detailUser.nama || ''}
                        onChange={(e) => setDetailUser({ ...detailUser, nama: e.target.value })}
                    />
                </div>
                <div>
                    <span>NIP :</span>
                    <input
                        type="text"
                        placeholder="Masukkan nip"
                        value={detailUser.nip || ''}
                        onChange={(e) => setDetailUser({ ...detailUser, nip: e.target.value })}
                    />
                </div>
                <div>
                    <span>Gender :</span>
                    <select value={detailUser.gender || ''} onChange={handleChangeGender}>
                        <option value="M">Laki-laki</option>
                        <option value="F">Perempuan</option>
                    </select>
                </div>
                <div>
                    <span>Tanggal Lahir :</span>
                    <input
                        type="date"
                        value={detailUser.tanggalLahir}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <span>Jabatan :</span>
                    <select value={detailUser.jabatan || ''} onChange={handleChangeJabatan}>
                        <option value="kanim">kanim</option>
                        <option value="wkanim">wakil kanim</option>
                    </select>
                </div>
                <div>
                    <span>Role :</span>
                    <select value={detailUser.role || ''} onChange={handleChange}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="guest">Guest</option>
                    </select>
                </div>
            </div>
        );
    };


    const deleteModalContent = () => {
        return (
            <div className="delete-container">
                <h3>Are You Sure ?</h3>
            </div>
        )
    }
    const customRowRenderer = (row) => (
        <>
            <td>{row.nama}</td>
            <td>{row.nip}</td>
            <td>{row.gender == "M" ? "Laki-laki" : "Perempuan"}</td>
            <td>{row.tanggalLahir}</td>
            <td>{row.jabatan}</td>
            <td>{row.role}</td>
            <td className='button-action'><button onClick={() => editModal(row)}>Edit</button><button onClick={() => deleteModal(row)}>Delete</button></td>
        </>
    );

    return (
        <div style={{ padding: 20, backgroundColor: '#eeeeee', height: '100%' }}>
            <div className="input-search-container">
                <div className="search-table-list" style={{ alignItems: 'center' }}>
                    <div className="search-table">
                        <span>Nama : </span>
                        <input type="text" placeholder='Masukkan nama' />
                    </div>
                    <button>Search</button>
                </div>
            </div>
            <TableLog
                tHeader={['no', 'nama', 'nip', 'gender', 'Tanggal Lahir', 'jabatan', 'role', 'action']}
                tBody={dummyUser}
                onEdit={editModal}
                onDelete={deleteModal}
                rowRenderer={customRowRenderer}
            />
            <Modals
                showModal={isShowModal}
                closeModal={closeModal}
                headerName="Edit User"
                buttonName="Confirm"
            >
                {editModalContent()}
            </Modals>
            <Modals
                showModal={isShowModalDelete}
                closeModal={closeModalDelete}
                headerName="Delete User"
                buttonName="delete"
            >
                {deleteModalContent()}
            </Modals>
        </div>
    )
}

export default UserManagement