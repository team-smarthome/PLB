import React from "react";
import "./CardListStyle.css";

const CardList = ({ status }) => {
  const listData = ["Scan Passport", "Take Photo", "Input Email"];

  return (
    <ul className="card-list-container">
      {listData.map((list, index) => (
        <li
          className={`card-list-item ${index + 1 < status ? "isActived" : ""}`}
          key={index}
        >
          <div className={`number-badge ${status === index + 1 ? "selected" : ""}`}>
            {index + 1}
          </div>
          <div className={`list-content ${status === index + 1 ? "selected" : ""}`}>
            {list}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CardList;
