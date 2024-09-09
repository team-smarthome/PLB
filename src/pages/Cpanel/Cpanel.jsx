import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import LogRegister from '../LogRegister/LogRegister';
import LogFaceReg from '../LogFaceReg/LogFaceReg';
import { RiMenu3Fill } from "react-icons/ri";
import './cpanel.style.css'
import ario from '../../assets/images/ario.jpeg'
import UserManagement from '../UserManagement/UserManagement';
const Cpanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div style={{
            display: isSidebarOpen ? 'flex' : "",
            height: '100vh'
        }}>
            {/* Sidebar with fixed width */}
            <div
                style={{ width: '280px' }}
            >
                <Sidebar isOpen={isSidebarOpen} />
            </div>
            {/* Content taking the remaining space */}
            <div
                style={{ flexGrow: 1 }}
                className='cpanel-content'>
                <div className="header-body">
                    <RiMenu3Fill
                        size={30}
                        style={{ cursor: 'pointer' }}
                        onClick={handleSidebarToggle}
                    />
                    <div className="user-profile">
                        <img src={ario} alt="" width={55} height={55} />
                        <h4>Ario Prima</h4>
                    </div>
                </div>
                <ReactRoutes>
                    <Route path="/log-register" element={<LogRegister />} />
                    <Route path="/log-facereg" element={<LogFaceReg />} />
                    <Route path="/user-management" element={<UserManagement />} />
                </ReactRoutes>
            </div>
        </div>
    );
};

export default Cpanel;
