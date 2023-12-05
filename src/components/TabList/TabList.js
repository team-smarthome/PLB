import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TabListStyle.css";

const TabList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listData = ["Scan Passport", "Take Photo", "Input Email"];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listCondition = ["scanpassport", "takephoto", "inputemail"];
  const pathCondition = location.pathname.split("/").pop();
  const indexCondition = listCondition.indexOf(pathCondition);
  console.log(indexCondition);
  // "abc/def/ghi" [ "abc", "def", "ghi" ]

  useEffect(() => {
    // Ambil path terakhir dari URL untuk menentukan indeks terpilih
    const path = location.pathname.split("/").pop();
    const index = listCondition.indexOf(path);
    console.log(index);

    // Setel indeks terpilih berdasarkan path
    if (index !== -1) {
      setSelected(index);
    }
  }, [location.pathname, listData, listCondition]);

  const handleItemClick = (index) => {
    if (indexCondition >= index) {
      // Mengubah URL berdasarkan elemen yang dipilih
      const selectedPath = listData[index].toLowerCase().replace(" ", "");
      navigate(`/${selectedPath}`);

      // Setel indeks terpilih
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

export default TabList;
