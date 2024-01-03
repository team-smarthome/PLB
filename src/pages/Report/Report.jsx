// Report.js
import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { apiPaymentHistory } from "../../services/api";
import Select from "react-select";

function Report() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("2024-01-03");
  const [endDate, setEndDate] = useState("2024-01-03");
  const [petugas, setPetugas] = useState("1907411008");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    value: ["KICASH", "KIOSK"],
    label: "ALL",
  });
  const perPage = 6;
  const options = [
    { value: "KICASH", label: "CASH" },
    { value: "KIOSK", label: "CC" },
    { value: ["KICASH", "KIOSK"], label: "ALL" },
  ];

  useEffect(() => {
    doPaymentHistory();
  }, [currentPage, startDate, endDate, petugas, selectedPaymentMethod]);

  const doPaymentHistory = async () => {
    const bearerToken = localStorage.getItem("JwtToken");
    const header = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };

    const bodyParams = {
      startDate: startDate,
      endDate: endDate,
      paymentMethod: selectedPaymentMethod.value,
      username: petugas,
      limit: perPage,
      page: currentPage,
    };

    try {
      const res = await apiPaymentHistory(header, bodyParams);
      const dataRes = res.data && res.data[0];
      console.log("Data received from server:", dataRes);
      setData(dataRes && dataRes.status === "success" ? dataRes.data : []);
      console.log("Updated data state:", data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, data.length);
  console.log("current page", currentPage);
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);

  console.log("All data from API:", data);

  return (
    <div className="body">
      <h1>Laporan Petugas</h1>
      <div className="header-combo">
        <form action="#" method="POST" className="form-filter">
          <label htmlFor="tanggalAwal">Tanggal Awal</label>
          <input
            type="date"
            name="tanggalAwal"
            id="tanggalAwal"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="tanggalAkhir">Tanggal Akhir</label>
          <input
            type="date"
            name="tanggalAkhir"
            id="tanggalAkhir"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <label htmlFor="petugas">Petugas</label>
          <input
            type="text"
            name="petugas"
            id="petugas"
            value={petugas}
            onChange={(e) => setPetugas(e.target.value)}
          />

          <label htmlFor="payment">Tipe</label>
          <Select
            id="payment"
            options={options}
            value={selectedPaymentMethod} 
            onChange={(selectedOption) =>
              setSelectedPaymentMethod(selectedOption)
            }
          />
          <button type="button" onClick={() => doPaymentHistory()}>
            Submit
          </button>
        </form>
      </div>
      <div className="content">
        <div className="table-header">
          <button className="print-pdf">Cetak PDF</button>
        </div>
        <Table data={data} startIndex={startIndex} />

        <div className="table-footer">
          <Pagination
            onPageChange={handlePageClick}
            pageCount={10}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Report;
