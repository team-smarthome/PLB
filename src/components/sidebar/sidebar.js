import React, { useState } from "react";
import "./sidebarstyle.css"; // import the CSS file
import logo from '../../assets/images/Kemenkumham_Imigrasi.png';
import { FaChevronDown, FaUsers, FaRegAddressCard, FaUserCircle, FaNetworkWired, FaFlag } from "react-icons/fa";
import { TbLogs } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import Cookies from 'js-cookie';


const Sidebar = ({ isOpen }) => {
    const userCookie = Cookies.get('userdata')
    const userInfo = JSON.parse(userCookie)
    const location = useLocation()
    // console.log(location, "location")
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
                {userInfo.role == 0 && <li>
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
                </li>}
                {userInfo.role == 0 && menuSetting.setting && (
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
                <li>
                    <Link to='/cpanel/country' className="link">
                        <FaFlag
                            size={30}
                            style={{ marginRight: '10px' }}
                        />
                        <span className="link_name">Country Master</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
