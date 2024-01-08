import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { apiPaymentHistory } from "../../services/api";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Report() {
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const currentDate = new Date(Date.now()).toISOString().split("T")[0];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [petugas, setPetugas] = useState("");
  const [pages, setPages] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    value: ["KICASH", "KIOSK"],
    label: "ALL",
  });
  const perPage = 20;
  const options = [
    { value: "KICASH", label: "CASH" },
    { value: "KIOSK", label: "CC" },
    { value: ["KICASH", "KIOSK"], label: "ALL" },
  ];




  let payloadTempt = {}; 

  const doPaymentHistory = async (page) => {
    isLoading(true);
  
    const bearerToken = localStorage.getItem("JwtToken");
    const header = {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    };
  
    let paymentMethodValue = [selectedPaymentMethod.value];
  
    if (Array.isArray(selectedPaymentMethod.value)) {
      paymentMethodValue = selectedPaymentMethod.value;
    }
  
    const bodyParams = {
      startDate: startDate,
      endDate: endDate,
      paymentMethod: paymentMethodValue,
      username: [petugas],
      limit: perPage,
      page,
    };
  
    // Menambahkan kondisi untuk memeriksa perubahan parameter
    if (
      startDate !== payloadTempt.startDate ||
      endDate !== payloadTempt.endDate ||
      JSON.stringify(paymentMethodValue) !== JSON.stringify(payloadTempt.paymentMethod) ||
      JSON.stringify([petugas]) !== JSON.stringify(payloadTempt.username) ||
      perPage !== payloadTempt.limit
    ) {
      setPages(1);
      setData([]);
      setCurrentPage(1);
      payloadTempt = { ...bodyParams };
    }
  
    try {
      const res = await apiPaymentHistory(header, bodyParams);
  
      if (res.data.message === "Invalid JWT Token") {
        isLoading(false);
        Swal.fire({
          icon: "error",
          text: "Invalid JWT Token",
          confirmButtonColor: "#3d5889",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("user");
            localStorage.removeItem("JwtToken");
            localStorage.removeItem("cardNumberPetugas");
            localStorage.removeItem("key");
            localStorage.removeItem("token");
            navigate("/");
          }
        });
      } else {
        if (
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          res.data[0].status === "success" &&
          res.data[0].data.length > 0
        ) {
          isLoading(false);
          const dataRes = res.data && res.data[0];
          setData((prevData) => [
            ...prevData,
            ...(dataRes && dataRes.status === "success" ? dataRes.data : []),
          ]);
          setPages((prevPages) => prevPages + 1);
          await doPaymentHistory(page + 1);
        } else {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      isLoading(false);
    }
  };

    
  useEffect(() => {
    // Reset page to 1 when startDate, endDate, or petugas changes
    setCurrentPage(1);
  }, [startDate, endDate, petugas]);

  console.log("nilai currentPage:", currentPage);
  


  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const startIndex = (currentPage - 1) * perPage;

  const pageCount = data.length / 10;

  const generatePDF = () => {
    const pdf = new jsPDF();

    const fontSize = 10;


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

    const filename = `${formattedDate}`.replace(/\s+/g, "_");

    pdf.save(`${filename}.pdf`);
  };
  const storage = JSON.parse(localStorage.getItem("user"));
  const name = storage.fullName;

  const handleLogout = async () => {
    // Menampilkan konfirmasi alert ketika tombol logout diklik menggunakan SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3D5889",
    });

    if (result.isConfirmed) {
      // Proses logout di sini (hapus localStorage, dll.)
      navigate("/");
      localStorage.removeItem("user");
      localStorage.removeItem("JwtToken");
      localStorage.removeItem("cardNumberPetugas");
      localStorage.removeItem("key");
      localStorage.removeItem("token");
      localStorage.removeItem("jenisDeviceId");
      localStorage.removeItem("deviceId");
      localStorage.removeItem("airportId");
    }
  };

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
          <button type="button" onClick={() => doPaymentHistory(1)}>
            Submit
          </button>
        </form>
      </div>
      <div className="content">
        <div className="table-header">
          <div className="combo">
            <button className="report-logout" onClick={handleLogout}>
              Logout
            </button>
            <button className="menu" onClick={() => navigate("/home")}>
              Home
            </button>
          </div>
          <button
            className="print-pdf"
            disabled={data.length === 0 ? true : false}
            onClick={() => generatePDF()}
          >
            Cetak PDF
          </button>
        </div>
        {loading ? (
          <div className={"content-loading"}>
            <div className="loader-report-spin">
              {loading && <span className="loader-loading-report"></span>}
            </div>
          </div>
        ) : (
          <>
            <Table data={data} page={currentPage} />
            <div className="table-footer">
              <Pagination
                onPageChange={handlePageClick}
                pageCount={pageCount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
