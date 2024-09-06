import React, { useState } from 'react';
import './PetugasPanel.css';
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

const PetugasPanel = ({ dataUser = [], onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onFilter(searchTerm);
    };

    return (
        <>
            <div className='title-container'>
                <h2>Panel Petugas</h2>
            </div>
            <div className='container-petugas-panel-component'>
                <div className='header-search'>
                    <div className='search-username'>
                        <input
                            type="text"
                            placeholder="Find Username"
                            style={{ border: "2px solid #000000" }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="search-button"
                            style={{ borderRadius: "7%", border: 'none' }}
                            onClick={handleSearch} // Menjalankan fungsi handleSearch saat tombol diklik
                        >
                            Cari
                            <CiSearch />
                        </button>
                    </div>
                    <div className='button-style'>
                        <button className="print-pdf">Cetak PDF</button>
                        <button className="print-excel">Cetak Excel</button>
                    </div>
                </div>
                {dataUser.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUser.map((petugas, index) => (
                                <tr key={petugas.id}>
                                    <td>{index + 1}</td>
                                    <td>{petugas.name}</td>
                                    <td>{petugas.role === 1 ? "Admin" : "User"}</td>
                                    <td>
                                        <div className='button-style-petugas'>
                                            <button className='edit-style' style={{ borderRadius: "7%", color: 'white' }}>
                                                Edit
                                                <MdOutlineEdit />
                                            </button>
                                            <button className='delete-style' style={{ borderRadius: "7%", color: 'white' }}>
                                                Delete
                                                <MdOutlineDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No Data Available</p>
                )}
            </div>
        </>
    );
};

export default PetugasPanel;
