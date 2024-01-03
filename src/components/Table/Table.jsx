import React from "react";
import "./Table.css";

const Table = ({ data }) => {
  // Check if data is not an array or is empty
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Register Number</th>
          <th>Nama</th>
          <th>No Passport</th>
          <th>Kewarganegaraan</th>
          <th>No VOA</th>
          <th>No Receipt</th>
          <th>Tipe Transaksi</th>
          <th>Nominal</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.register_number}</td>
            <td>{item.full_name}</td>
            <td>{item.passport_number}</td>
            <td>{item.citizenship}</td>
            <td>{item.visa_number}</td>
            <td>{item.receipt}</td>
            <td>{item.payment_method}</td>
            <td>{item.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
