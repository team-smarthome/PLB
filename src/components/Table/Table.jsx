import React, { useState, useEffect } from "react";
import "./Table.css";
import { apiPaymentHistory } from "../../services/api";

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Call the payment history function when the component mounts
    doPaymentHistory();
  }, []);

  const doPaymentHistory = async () => {
    const bearerToken = localStorage.getItem("JwtToken");
    const header = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };

    const bodyParams = {
      startDate: "2023-11-11",
      endDate: "2023-12-21",
      paymentMethod: ["KICASH"],
      username: ["leamida", "admin"],
      limit: 10,
      page: 1,
    };

    try {
      const res = await apiPaymentHistory(header, bodyParams);
      const dataRes = res.data && res.data[0]; // Ambil elemen pertama dari array
      setData(dataRes && dataRes.status === "success" ? dataRes.data : []);
    } catch (error) {
      console.error("error:", error);
    }
  };

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
