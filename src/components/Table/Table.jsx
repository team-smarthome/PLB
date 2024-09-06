import React from "react";
import "./Table.css";

const Table = ({ data, page, perPage }) => {


  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No PLB</th>
            <th>No Register</th>
            <th>Nama</th>
            <th>Nationality</th>
            <th>Arrival Time</th>
            <th>Foto Profile</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{(page - 1) * perPage + index + 1}</td>
              <td>{item.no_passport}</td>
              <td>{item.no_register}</td>
              <td>{item.name}</td>
              <td>{item.nationality}</td>
              <td>{item.arrival_time}</td>
              <td>
                <img
                  src={`http://192.168.2.143:8000/storage/${item.profile_image}`}
                  alt="Foto Profile"
                  width="80"
                  height="80"
                  style={{ borderRadius: "100%" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
