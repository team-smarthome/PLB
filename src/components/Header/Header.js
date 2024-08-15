import React from "react";
import "./HeaderStyle.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/home")
  }
  return (
    <header className="header-container">
      <h1 className="header-title" onClick={handleClick}>{title}</h1>
    </header>
  );
};

export default Header;
