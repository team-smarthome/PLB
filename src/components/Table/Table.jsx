import React from "react";
import "./Table.css";
import { useNavigate } from "react-router-dom";
import dataNegara from "../../utils/dataNegara";
import { url_devel } from "../../services/env";

const Table = ({ data, page, perPage }) => {
  const navigate = useNavigate();

  const handleRowClick = (item) => {
    // Kirim data yang diklik ke halaman detail
    navigate("/validation", { state: item });
  };

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
          {data.map((item, index) => {
            const findNationality = dataNegara.data.find(
              (dataNegaraItem) => dataNegaraItem.id_negara === item.nationality
            );

            return (
              <tr
                key={index}
                onClick={() => handleRowClick(item)}
                style={{ cursor: "pointer" }}
              >
                <td>{(page - 1) * perPage + index + 1}</td>
                <td>{item.no_passport}</td>
                <td>{item.no_register}</td>
                <td>{item.name}</td>
                <td>{findNationality ? `${findNationality.id_negara}-${findNationality.deskripsi_negara}` : "Unknown"}</td>
                <td>{item.arrival_time}</td>
                <td>
                  <img
                    src={`${url_devel}storage/${item.profile_image}`}
                    alt="Foto Profile"
                    width="80"
                    height="80"
                    style={{ borderRadius: "100%" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
