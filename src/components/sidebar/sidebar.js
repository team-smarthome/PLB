import React, { useState } from "react";
import "./sidebarstyle.css"; // import the CSS file
import logo from '../../assets/images/Kemenkumham_Imigrasi.png';
import { FaChevronDown, FaUsers, FaRegAddressCard, FaUserCircle, FaNetworkWired, FaDatabase, FaServer, FaMapMarkerAlt } from "react-icons/fa";
import { TbLogs } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import Cookies from 'js-cookie';

const Sidebar = ({ isOpen }) => {
    const userCookie = Cookies.get('userdata');
    const userInfo = JSON.parse(userCookie);
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState({});
    const [menuSetting, setMenuSetting] = useState({});

    const handleMenuToggle = (menuKey) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menuKey]: !prevState[menuKey],
        }));
    };

    const handleSettingToggle = (menuKey) => {
        setMenuSetting((prevState) => ({
            ...prevState,
            [menuKey]: !prevState[menuKey],
        }));
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`sidebar ${isOpen ? "" : "close"}`}>
            {isOpen && (
                <div
                    className="logo-details"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/home')}
                >
                    <img src={logo} alt="plb" />
                </div>
            )}
            <ul className="nav-links">
                <li>
                    <Link to='/cpanel/user-management' className={`link ${isActive('/cpanel/user-management') ? 'active' : ''}`}>
                        <FaUsers size={30} style={{ marginRight: '10px' }} />
                        <span className="link_name">User Management</span>
                    </Link>
                </li>
                <li>
                    <div className="icon-link" onClick={() => handleMenuToggle("category")}>
                        <a>
                            <TbLogs size={30} color="#fff" style={{ marginRight: '10px' }} />
                            <span className="link_name">Log</span>
                        </a>
                        <FaChevronDown color="#fff" size={25} style={{ cursor: 'pointer' }} />
                    </div>
                </li>
                {menuOpen.category && (
                    <ul className="sub-menu-link">
                        <Link to='/cpanel/log-register' className={`link ${isActive('/cpanel/log-register') ? 'active' : ''}`}>
                            <FaRegAddressCard size={25} style={{ marginRight: '10px' }} />
                            Log Register
                        </Link>
                        <Link to='/cpanel/log-facereg' className={`link ${isActive('/cpanel/log-facereg') ? 'active' : ''}`}>
                            <FaUserCircle size={25} style={{ marginRight: '10px' }} />
                            Log Facereg
                        </Link>
                    </ul>
                )}
                {userInfo.role === 0 && (
                    <li>
                        <div className="icon-link" onClick={() => handleSettingToggle("setting")}>
                            <a>
                                <IoSettingsSharp size={30} color="#fff" style={{ marginRight: '10px' }} />
                                <span className="link_name">Setting</span>
                            </a>
                            <FaChevronDown color="#fff" size={25} style={{ cursor: 'pointer' }} />
                        </div>
                    </li>
                )}
                {userInfo.role == 0 && menuSetting.setting && (
                    <ul
                        className="sub-menu-link"
                    >
                        <Link to='/cpanel/setting-server' className={`link ${isActive('/cpanel/setting-server') ? 'active' : ''}`}>
                            <FaServer
                                size={25}
                                style={{ marginRight: '10px' }}
                            />
                            <a >Server</a>
                        </Link>
                        <Link to='/cpanel/setting-camera' className={`link ${isActive('/cpanel/setting-camera') ? 'active' : ''}`}>
                            <FaNetworkWired
                                size={25}
                                style={{ marginRight: '10px' }}
                            />
                            <a >Camera</a>
                        </Link>
                    </ul>
                )}
                {userInfo.role === 0 && (
                    <li>
                        <div className="icon-link" onClick={() => handleSettingToggle("master")}>
                            <a>
                                <FaDatabase size={30} color="#fff" style={{ marginRight: '10px' }} />
                                <span className="link_name">Master Data</span>
                            </a>
                            <FaChevronDown color="#fff" size={25} style={{ cursor: 'pointer' }} />
                        </div>
                    </li>
                )}
                {userInfo.role == 0 && menuSetting.master && (
                    <ul
                        className="sub-menu-link"
                    >
                        <Link to='/cpanel/destination-location' className={`link ${isActive('/cpanel/destination-location') ? 'active' : ''}`}>
                            <FaMapMarkerAlt
                                size={25}
                                style={{ marginRight: '10px' }}
                            />
                            <a>Destination Location</a>
                        </Link>
                    </ul>
                )}
                {/* <li>
                    <Link to='/cpanel/country' className={`link ${isActive('/cpanel/country') ? 'active' : ''}`}>
                        <FaFlag size={30} style={{ marginRight: '10px' }} />
                        <span className="link_name">Country Master</span>
                    </Link>
                </li> */}
            </ul>
        </div>
    );
};

export default Sidebar;
