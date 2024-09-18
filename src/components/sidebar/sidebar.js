import React, { useState } from "react";
import "./sidebarstyle.css"; // import the CSS file
import logo from '../../assets/images/Kemenkumham_Imigrasi.png';
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


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
                        <span className="link_name">User Management</span>
                    </Link>
                </li>
                <li>
                    <div
                        className="iocn-link"
                        onClick={() => handleMenuToggle("category")}
                    >
                        <a >

                            <span className="link_name">Log</span>
                        </a>
                        <FaChevronDown

                            color="#fff"
                            size={25}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </li>
                <li>
                    <div
                        className="iocn-link"
                        onClick={() => handleSettingToggle("setting")}
                    >
                        <a >

                            <span className="link_name">Setting</span>
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
                            <a >Log Register</a>
                        </Link>
                        <Link to='/cpanel/log-facereg' className="link">
                            <a >Log Facereg</a>
                        </Link>
                    </ul>
                )}

                {menuSetting.setting && (
                    <ul
                        className="sub-menu-link"
                    >
                        <Link to='/cpanel/setting-ip' className="link">
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
