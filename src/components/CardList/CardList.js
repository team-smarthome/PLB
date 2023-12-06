import React from "react";
import "./CardListStyle.css";

const CardList = ({ status }) => {
  const listData = ["Scan Passport", "Take Photo", "Input Email"];

  return (
    <ul className="card-list-container">
      {listData.map((list, index) => (
        <li
          className={`card-list-item ${index < status ? "isActived" : ""}`}
          key={index}
        >
          <div className={`number-badge ${status === index ? "selected" : ""}`}>
            {index}
          </div>
          <div className={`list-content ${status === index ? "selected" : ""}`}>
            {list}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CardList;
