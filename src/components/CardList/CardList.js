import React, { useContext, useState, useEffect } from "react";
import "./CardListStyle.css";
import DataContext from "../../context/DataContext";

const CardList = ({ status }) => {
  const { data } = useContext(DataContext);
  const [listData, setListData] = useState(["Scan Passport", "Take Photo", "Input Email", "Postal Code"]);

  useEffect(() => {
    if (data) {
      setListData([]);
    } else {
      const dataCheck = localStorage.getItem("dataStatus");
      if (dataCheck === "true") {
        console.log("DataCheck", dataCheck);
        setListData([]);
      } else {
        setListData(["Scan Passport", "Take Photo", "Input Email", "Postal Code"]);
      }
    }
  }, [status]);

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
