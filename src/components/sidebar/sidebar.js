import React, { useState } from "react";
import "./sidebarstyle.css"; // import the CSS file
import logo from '../../assets/images/Kemenkumham_Imigrasi.png';
import { FaChevronDown, FaUsers, FaRegAddressCard, FaUserCircle, FaNetworkWired } from "react-icons/fa";
import { TbLogs } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";



const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate()
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
    }

    return (
        <div className={`sidebar ${isOpen ? "" : "close"}`}>
            {isOpen &&
                <div
                    className="logo-details"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/home')}
                >
                    <img src={logo} alt="plb" />
                </div>
            }
            <ul className="nav-links">
                <li>
                    <Link to='/cpanel/user-management' className="link">
                        <FaUsers
                            size={30}
                            style={{ marginRight: '10px' }}
                        />
                        <span className="link_name">User Management</span>
                    </Link>
                </li>
                <li>
                    <div
                        className="icon-link"
                        onClick={() => handleMenuToggle("category")}
                    >
                        <a >
                            <TbLogs
                                size={30}
                                color="#fff"
                                style={{ marginRight: '10px' }}
                            />
                            <span className="link_name">Log</span>
                        </a>
                        <FaChevronDown

                            color="#fff"
                            size={25}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </li>
                {menuOpen.category && (
                    <ul
                        className="sub-menu-link"
                    >
                        <Link to='/cpanel/log-register' className="link">
                            <a>
                                <FaRegAddressCard
                                    size={25}
                                    style={{ marginRight: '10px' }}
                                />
                                Log Register
                            </a>
                        </Link>
                        <Link to='/cpanel/log-facereg' className="link">
                            <a>
                                <FaUserCircle
                                    size={25}
                                    style={{ marginRight: '10px' }}
                                />
                                Log Facereg
                            </a>
                        </Link>
                    </ul>
                )}
                <li>
                    <div
                        className="icon-link"
                        onClick={() => handleSettingToggle("setting")}
                    >
                        <a >
                            <
                                IoSettingsSharp
                                size={30}
                                color="#fff"
                                style={{ marginRight: '10px' }}
                            />
                            <span className="link_name">Setting</span>
                        </a>
                        <FaChevronDown

                            color="#fff"
                            size={25}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </li>
                {menuSetting.setting && (
                    <ul
                        className="sub-menu-link"
                    >
                        <Link to='/cpanel/setting-ip' className="link">
                            <FaNetworkWired
                                size={25}
                                style={{ marginRight: '10px' }}
                            />
                            <a >Setting IP</a>
                        </Link>
                        {/* <Link to='/cpanel/setting-facereg' className="link">
                            <a >Setting Facereg</a>
                        </Link> */}
                    </ul>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
