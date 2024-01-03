import React from "react";
import "./Table.css";

const data = [
  {
    id: 1,
    registerNumber: 2022019201123,
    name: "IRFAN BACHDIM",
    passportNumber: "X01292382",
    nationality: "Inggris",
    voaNumber: "Z2A777770",
    receiptNumber: "Z2A777770",
    transactionType: "CASH",
    amount: "519.500",
  },
  // ... other data items
];
const Table = () => {
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
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.registerNumber}</td>
            <td>{item.name}</td>
            <td>{item.passportNumber}</td>
            <td>{item.nationality}</td>
            <td>{item.voaNumber}</td>
            <td>{item.receiptNumber}</td>
            <td>{item.transactionType}</td>
            <td>{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
