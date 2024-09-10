import React, { useState } from "react";
import "./sidebarstyle.css"; // import the CSS file
import logo from '../../assets/images/Kemenkumham_Imigrasi.png';
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";


const Sidebar = ({ isOpen }) => {
    const [menuOpen, setMenuOpen] = useState({});


    const handleMenuToggle = (menuKey) => {
        setMenuOpen((prevState) => ({
            ...prevState,
            [menuKey]: !prevState[menuKey],
        }));
    };

    return (
        <div className={`sidebar ${isOpen ? "" : "close"}`}>
            {isOpen && <div className="logo-details">
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
            </ul>
        </div>
    );
};

export default Sidebar;
