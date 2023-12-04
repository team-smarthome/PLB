import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CardListStyle.css";

const CardList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const listData = ["Scan Passport", "Take Photo", "Input Email"];

  return (
    <ul className="card-list-container">
      {listData.map((list, index) => (
        <li
          className={`card-list-item ${index < selected ? "isActived" : ""}`}
          key={index}
        >
          <div
            className={`number-badge ${selected === index ? "selected" : ""}`}
          >
            {index}
          </div>
          <div
            className={`list-content ${selected === index ? "selected" : ""}`}
          >
            {list}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CardList;
