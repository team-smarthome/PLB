// Report.js
import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { apiPaymentHistory } from "../../services/api";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const perPage = 1000;
  const options = [
    { value: "KICASH", label: "CASH" },
    { value: "KIOSK", label: "CC" },
    { value: ["KICASH", "KIOSK"], label: "ALL" },
  ];

  useEffect(() => {
    doPaymentHistory();
  }, [startDate, endDate, petugas, selectedPaymentMethod]);

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
      page: 1,
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

  const pageCount = endIndex / 10;

  const generatePDF = () => {
    const pdf = new jsPDF();

    const fontSize = 10;
    // const lineSpacing = 5;

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString(
      "en-GB"
    )} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;

    pdf.setFontSize(fontSize);

    pdf.text(`Reconsiliation Date: ${startDate} -  ${endDate} `, 16, 20);

    const itemHeaders = [
      "No",
      "Date",
      "Register No.",
      "Full Name",
      "Passport No.",
      "Nationality",
      "Visa Number",
      "Receipt",
      "Type",
      "Billed Price",
    ];
    const itemRows = data.map((item, index) => [
      index + 1,
      `${item.timestamp}`,
      `${item.register_number}`,
      `${item.full_name}`,
      `${item.passport_number}`,
      `${item.citizenship}`,
      `${item.visa_number}`,
      `${item.receipt}`,
      `${item.payment_method}`,
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(item.billed_price),
    ]);

    pdf.autoTable({
      head: [itemHeaders],
      body: itemRows,
      startY: 30,
      styles: {
        fontSize: 6,
      },
    });

    // const spaceBetweenTables = 10;
    // const startYForSummary = pdf.autoTable.previous.finalY + spaceBetweenTables;

    // const summaryHeaders = ["Summary", ""];
    // const summaryRows = [
    //   [
    //     `Total`,
    //     new Intl.NumberFormat("id-ID", {
    //       style: "currency",
    //       currency: "IDR",
    //     }).format(data.total),
    //   ],
    // ];

    // pdf.autoTable({
    //   head: [summaryHeaders],
    //   body: summaryRows,
    //   startY: startYForSummary,
    // });

    // pdf.text("", 20, pdf.autoTable.previous.finalY + spaceBetweenTables + 60);

    const filename = `${formattedDate}`.replace(/\s+/g, "_");

    pdf.save(`${filename}.pdf`);
  };
  const storage = JSON.parse(localStorage.getItem("user"));
  const name = storage.fullName;

  return (
    <div className="body">
      <h1 className="">Welcome SPV, {name}</h1>
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
          <button className="print-pdf" onClick={() => generatePDF()}>
            Cetak PDF
          </button>
        </div>
        <Table data={data} page={currentPage} />

        <div className="table-footer">
        <Pagination
            onPageChange={handlePageClick}
            pageCount={pageCount}
          />
        </div>
      </div>
    </div>
  );
}

export default Report;
