import React, { useContext, useState, useEffect } from "react";
import "./CardListValidation.style.css";
import DataContext from "../../context/DataContext";

const CardListValidation = ({ status, setStatus }) => {
  console.log(status, "status")
  const [listData, setListData] = useState(["Data User"]);
  // console.log("DataStatus", data);

  return (
    <ul className="card-list-container">
      {listData.map((list, index) => (
        <li
          className={`card-list-item ${index + 1 < status ? "isActived" : ""}`}
          key={index}
        >
          <div className={`number-badge ${status === index ? "selected" : ""}`}>
            {index + 1}
          </div>
          <div className={`list-content ${status === index ? "selected" : ""}`}
            onClick={() => setStatus(index)}
          >
            {list}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CardListValidation;
