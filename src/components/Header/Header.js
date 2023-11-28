import React from "react";
import "./HeaderStyle.css";

const Header = ({ title }) => {
  return (
    <header className="header-container">
      <h1 className="header-title">{title}</h1>
    </header>
  );
};

export default Header;
