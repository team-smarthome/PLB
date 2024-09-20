import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { Route, Routes as ReactRoutes, useNavigate, Navigate } from 'react-router-dom';
import LogRegister from '../LogRegister/LogRegister';
import LogFaceReg from '../LogFaceReg/LogFaceReg';
import { RiMenu3Fill } from "react-icons/ri";
import Cookies from 'js-cookie';
import './cpanel.style.css'
import ario from '../../assets/images/ario.jpeg'
import UserManagement from '../UserManagement/UserManagement';
import SettingIp from '../../components/SettingIp/SettingIp';
import Country from '../Country/Country';
import SettingServer from '../../components/SettingServer/SettingServer';
const Cpanel = () => {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userData, setUserData] = useState({})
    const [showUserButton, setShowUserButton] = useState(false)
    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const getUserData = async () => {
        const user = await Cookies.get('userdata')
        setUserData(JSON.parse(user))
    }

    useEffect(() => {
        getUserData()
    }, [])
    function handleSplitName(name) {
        if (name) {
            const splitName = name.split(' ')
                .slice(0, 3)
                .map(word => word[0])
                .join('')
            return splitName
        }
    }

    const handleLogout = () => {
        Cookies.remove('token')
        Cookies.remove('userdata')
        navigate('/')
    }
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
                    <div className="user-profile" onClick={() => setShowUserButton(!showUserButton)}>
                        {/* <img src={ario} alt="" width={55} height={55} /> */}
                        <div className="circle-container">
                            <span className="circle">{handleSplitName(userData?.petugas?.nama_petugas)}</span>
                        </div>

                        <h4>{userData?.petugas?.nama_petugas ?? ""}</h4>
                    </div>
                    {showUserButton && <div className="user-button-list">
                        <button onClick={handleLogout}>Logout</button>
                    </div>}
                </div>
                <ReactRoutes >
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Navigate to="/cpanel/user-management" />} />
                    <Route path="/log-register" element={<LogRegister />} />
                    <Route path="/log-facereg" element={<LogFaceReg />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/setting-server" element={<SettingServer />} />
                    <Route path="/setting-camera" element={<SettingIp />} />
                    <Route path="/destination-location" element={<Country />} />
                </ReactRoutes>
            </div>
        </div>
    );
};


const NotFound = () => {
    return (
        <div style={{ width: '100%', height: "100vh", display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <h1>404 | Not Found</h1>
        </div>
    )
}
export default Cpanel;
