import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ListStyle.css";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const listData = ["Scan Passport", "Take Photo", "Input Email"];

  const listCondition = ["scanpassport", "takephoto", "inputemail"];
  const pathCondition = location.pathname.split("/").pop();
  const indexCondition = listCondition.indexOf(pathCondition);
  console.log(indexCondition);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const index = listCondition.indexOf(path);
    console.log(index);

    if (index !== -1) {
      setSelected(index);
    }
  }, [location.pathname, listData]);

  const handleItemClick = (index) => {
    if (indexCondition >= index) {
      const selectedPath = listData[index].toLowerCase().replace(" ", "");
      navigate(`/${selectedPath}`);

      setSelected(index);
    }
  };

  return (
    <ul className="list-container">
      {listData.map((list, index) => (
        <li
          className={`list-item ${index < selected ? "isActived" : ""}`}
          key={index}
          onClick={() => handleItemClick(index)}
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

export default List;
