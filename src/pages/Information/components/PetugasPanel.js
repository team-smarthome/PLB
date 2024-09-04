import React from 'react'
import './PetugasPanel.css'

const PetugasPanel = () => {
    const dataPetugas = [
        { id: 1, name: 'Ahmad', role: 'Administrator' },
        { id: 2, name: 'Budi', role: 'Supervisor' },
        { id: 3, name: 'Citra', role: 'Operator' },
        { id: 4, name: 'Dewi', role: 'Technician' },
        { id: 5, name: 'Eko', role: 'Manager' },
    ];
    return (
        <div className=''>
            <table className="">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataPetugas.map((petugas, index) => (
                        <tr key={petugas.id}>
                            <td>{index + 1}</td>
                            <td>{petugas.name}</td>
                            <td>{petugas.role}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PetugasPanel