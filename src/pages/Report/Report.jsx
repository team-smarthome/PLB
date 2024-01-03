import React, { useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";

function Report() {
  const perPage = 5;
  const data = Array.from({ length: 50 }, (_, index) => `Item ${index + 1}`); // Dummy data array

  const [currentPageData, setCurrentPageData] = useState(
    data.slice(0, perPage)
  );

  const handlePageChange = (newPageData) => {
    setCurrentPageData(newPageData);
  };
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
        <Table />
        <div className="table-footer">
          <Pagination onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}

export default Report;
