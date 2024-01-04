import React from "react";
import "./Table.css";
// ...

const Table = ({ data, page }) => {
  // Check if data is not an array or is empty
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>;
  }

  // Calculate the start and end indices based on the page parameter
  const startIndex = (page - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);

  // Display only the data within the calculated indices
  const slicedData = data.slice(startIndex, endIndex);

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
        {slicedData.map((item, index) => (
          <tr key={index}>
            <td>{startIndex + index + 1}</td>
            <td>{item.register_number}</td>
            <td>{item.full_name}</td>
            <td>{item.passport_number}</td>
            <td>{item.citizenship}</td>
            <td>{item.visa_number}</td>
            <td>{item.receipt}</td>
            <td>{item.payment_method}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(item.billed_price)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
