import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { apiPaymentHistory } from "../../services/api";

function Report() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;

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

  return (
    <div className="body">
      <h1>Laporan Petugas</h1>
      <div className="header-combo">
        <form action="#" method="POST" className="form-filter">
          <label htmlFor="tanggal">Tanggal</label>
          <input type="date" name="tanggal" id="tanggal" />

          <label htmlFor="petugas">Petugas</label>
          <input type="text" name="petugas" id="petugas" />

          <label htmlFor="payment">Tipe</label>
          <input
            type="text"
            name="payment"
            id="payment"
            placeholder="CASH/CC/ALL"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="content">
        <div className="table-header">
          <button className="print-pdf">Cetak PDF</button>
        </div>
        <Table data={currentPageData} />
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
