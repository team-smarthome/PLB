import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { apiPaymentHistory } from "../../services/api";
import generatePDF from "../../components/ConvertPDF/ConvertPDF";
import Select from "react-select";

function Report() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;
  const options = [
    { value: "CASH", label: "CASH" },
    { value: "CC", label: "CC" },
    { value: "ALL", label: "ALL" },
  ];

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
      startDate: "2024-01-03",
      endDate: "2024-01-03",
      paymentMethod: ["KICASH"],
      username: "1907411008",
      limit: 5,
      page: 1,
    };

    try {
      const res = await apiPaymentHistory(header, bodyParams);
      const dataRes = res.data && res.data[0]; // Ambil elemen pertama dari array
      console.log(dataRes);
      setData(dataRes && dataRes.status === "success" ? dataRes.data : []);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const startIndex = currentPage * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = data.slice(startIndex, endIndex);

  const exportToPDF = () => {
    console.log("exportToPDF");
    generatePDF(currentPageData);
  };

  return (
    <div className="body">
      <h1>Laporan Petugas</h1>
      <div className="header-combo">
        <form action="#" method="POST" className="form-filter">
          <label htmlFor="tanggal">Tanggal Awal</label>
          <input type="date" name="tanggal" id="tanggal" />

          <label htmlFor="tanggal">Tanggal Akhir</label>
          <input type="date" name="tanggal" id="tanggal" />

          <label htmlFor="petugas">Petugas</label>
          <input type="text" name="petugas" id="petugas" />

          <label htmlFor="payment">Tipe</label>
          <Select id="payment" options={options} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="content">
        <div className="table-header">
          <button className="print-pdf" onClick={exportToPDF}>
            Cetak PDF
          </button>
        </div>
        <Table id="table-to-export" data={currentPageData} />
        <div className="table-footer">
          <Pagination
            pageCount={Math.ceil(data.length / perPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Report;
