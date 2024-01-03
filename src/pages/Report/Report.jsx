import React from "react";
import "./Report.css";
import Table from "../../components/Table/Table";

function Report() {
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
      </div>
    </div>
  );
}

export default Report;
