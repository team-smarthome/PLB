import React, { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import io from "socket.io-client";
import { url_dev } from "../../services/env";
import Cookies from 'js-cookie';

function Report() {
  const socket_IO = io("http://localhost:4000");
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const currentDate = new Date(Date.now()).toISOString().split("T")[0];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [mulaiDate, setMulaiDate] = useState(new Date());
  const [selesaiDate, setSelesaiDate] = useState(new Date());
  const [petugas, setPetugas] = useState("");
  const [nomorPassport, setNomorPassport] = useState("");
  const [pages, setPages] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    value: ["KICASH", "KIOSK"],
    label: "ALL",
  });
  const perPage = 10;
  const options = [
    { value: "KICASH", label: "CASH" },
    { value: "KIOSK", label: "CC" },
    { value: ["KICASH", "KIOSK"], label: "ALL" },
  ];

  const [petugasOptions, setPetugasOptions] = useState([]);
  const [nomorPassportOptions, setNomorPassportOptions] = useState([]);

  let payloadTempt = {};

  useEffect(() => {
    const FaceToken = Cookies.get('Face-Token');
    const FaceUsername = Cookies.get('face-username');
    const RoleID = Cookies.get('roleId');
    const SideBarStatus = Cookies.get('sidebarStatus');
    const Token = Cookies.get('token');

    const CookieSend = `Face-Token=${FaceToken}; face-username=${FaceUsername}; roleId=${RoleID}; sidebarStatus=${SideBarStatus}; token=${Token}`
    socket_IO.emit("startFilterUser", { CookieSend });
    socket_IO.on("responseGetDataUserFilter", (data) => {
      const dataUser = data.map((item) => ({
        label: item.name,
        value: item.name
      }));
      setPetugasOptions(dataUser);
      const dataPassport = data.map((item) => ({
        label: item.personNum,
        value: item.personNum
      }));
      console.log("dataPassport:", dataPassport);
      setNomorPassportOptions(dataPassport);
      console.log("responseGetDataUserFilter:", data);
      // setData(data);
    });
  }, []);

  // useEffect(() => {
  //   const FaceToken = Cookies.get('Face-Token');
  //   const FaceUsername = Cookies.get('face-username');
  //   const RoleID = Cookies.get('roleId');
  //   const SideBarStatus = Cookies.get('sidebarStatus');
  //   const Token = Cookies.get('token');

  //   const CookieSend = `Face-Token=${FaceToken}; face-username=${FaceUsername}; roleId=${RoleID}; sidebarStatus=${SideBarStatus}; token=${Token}`
  //   const bodyParamsSendKamera = {
  //     name: "",
  //     beginTime: "-25200",
  //     endTime: "1724086799",
  //     type: "all",
  //     gender: "all",
  //     beginPosition: 0,
  //     endPosition: 19,
  //     limit: 20,
  //     page: 1,
  //     status: "all",
  //     passState: 0,
  //     passStatus: -1,
  //     personCode: "",
  //     minAge: 0,
  //     maxAge: 100
  //   }
  //   socket_IO.emit("historyLog", { bodyParamsSendKamera, CookieSend });
  // }, [])


  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, petugas]);


  useEffect(() => {
    const city = JSON.parse(localStorage.getItem("user"));
    const officeCity = city?.organization?.officeCity;
    const jwtToken = localStorage.getItem("JwtToken");
    console.log("Bearer Token:", jwtToken);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url_dev}Petugas.php`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        let dataPetugas = [];

        console.log("Data_Petugas:", response.data);

        console.log("officeCity:", officeCity);
        console.log("response:", response);

        if (officeCity === "DENPASAR") {
          dataPetugas = response.data.dataPetugasDenpasar.petugas;
          console.log("dataPetugas:", dataPetugas);
        } else if (officeCity === "JAKARTA") {
          dataPetugas = response.data.dataPetugasJakarta.petugas;
        }

        const options = dataPetugas.map((petugas) => ({
          value: petugas.id,
          label: petugas.username,
        }));
        setPetugasOptions(options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const generatePDF = () => {
    const pdf = new jsPDF();

    const fontSize = 10;

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString(
      "en-GB"
    )} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;

    pdf.setFontSize(fontSize);

    pdf.text(`Reconciliation Date: ${startDate} - ${endDate}`, 16, 20);

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
      startY: 30,
      styles: {
        fontSize: 5,
      },
    });

    pdf.save(`${formattedDate}.pdf`);
  };

  const generateExcel = () => {
    const Excel = require("exceljs");
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Payment Report");

    // Add column headers
    const headers = [
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
    worksheet.addRow(headers);

    // Add data rows
    data.forEach((item, index) => {
      const row = [
        index + 1,
        item.timestamp,
        item.register_number,
        item.full_name,
        item.passport_number,
        item.citizenship,
        item.visa_number,
        item.receipt,
        item.payment_method,
        item.billed_price.split(".")[0],
      ];
      worksheet.addRow(row);
    });



    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const filename = `Payment_Report_${startDate}_${endDate}.xlsx`;
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // For other browsers
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    });
  };

  const storage = JSON.parse(localStorage.getItem("user"));
  const name = storage?.fullName;

  const handleLogout = async () => {
    // Menampilkan konfirmasi alert ketika tombol logout diklik menggunakan SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3D5889",
      cancelButtonColor: "#d33",
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
      localStorage.removeItem("price");
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    setStartDate(Math.floor(new Date(startDate).getTime() / 1000).toString());
    setEndDate(Math.floor(new Date(endDate).getTime() / 1000).toString());
  }, []);

  console.log("startDate:", startDate);

  const handleChangeStartDate = (date) => {
    setMulaiDate(date);
    const formattedDate = formatDate(date);
    const epochDate = Math.floor(new Date(formattedDate).getTime() / 1000).toString();
    console.log("Tanggal_dipilih:", epochDate);
    setStartDate(epochDate);
  };

  const handleChangeEndDate = (date) => {
    setSelesaiDate(date);
    const formattedDate = formatDate(date);
    const epochDateEnd = Math.floor(new Date(formattedDate).getTime() / 1000).toString();
    console.log("Tanggal_dipilih:", epochDateEnd);
    setEndDate(epochDateEnd);
  };

  const handleSubmitFilter = async () => {
    console.log("SubmitstartDate:", startDate);
    console.log("SubmitendDate:", endDate);
    console.log("Submitpetugas:", petugas);
    console.log("SubmitnomorPassport:", nomorPassport);
    const FaceToken = Cookies.get('Face-Token');
    const FaceUsername = Cookies.get('face-username');
    const RoleID = Cookies.get('roleId');
    const SideBarStatus = Cookies.get('sidebarStatus');
    const Token = Cookies.get('token');

    const CookieSend = `Face-Token=${FaceToken}; face-username=${FaceUsername}; roleId=${RoleID}; sidebarStatus=${SideBarStatus}; token=${Token}`
    const bodyParamsSendFilter = {
      name: petugas,
      beginTime: startDate,
      endTime: endDate,
      type: "all",
      gender: "all",
      beginPosition: 0,
      endPosition: 19,
      limit: 20,
      page: 1,
      status: "all",
      passState: 0,
      passStatus: -1,
      personCode: nomorPassport,
      minAge: 0,
      maxAge: 100
    }
    socket_IO.emit("historyLog", { bodyParamsSendFilter, CookieSend });
    socket_IO.on("responseGetDataUser", (data) => {
      console.log("responseGetDataUser:", data);
      setData(data.matchList);
    });
  }

  return (
    <div className="body">
      <h1>History Log</h1>
      <div className="header-combo">
        <form action="#" method="POST" className="form-filter">
          <label htmlFor="tanggalAwal">Tanggal Awal</label>
          <DatePicker
            selected={mulaiDate}
            onChange={handleChangeStartDate}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            className="date-picker"
            timeIntervals={1}
          />

          <label htmlFor="tanggalAkhir">Tanggal Akhir</label>
          <DatePicker
            selected={selesaiDate}
            onChange={handleChangeEndDate}
            showTimeSelect
            timeIntervals={1}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            className="date-picker"
          />
          <label htmlFor="petugas">Nama</label>
          <div className="select-petugas">
            <Select
              id="petugas"
              value={petugas ? petugasOptions.find((option) => option.value === petugas) : null}
              onChange={(selectedOption) => setPetugas(selectedOption.value)}
              options={petugasOptions}
              className="basic-single"
              styles={{
                container: (provided) => ({
                  ...provided,
                  flex: 1,
                  borderRadius: "10px",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                  fontFamily: "Roboto, Arial, sans-serif",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                }),
              }}
            />
          </div>

          <label htmlFor="petugas">Nomor PLB</label>
          <div className="select-petugas">
            <Select
              id="petugas"
              value={
                petugas
                  ? nomorPassportOptions.find((option) => option.value === nomorPassport)
                  : ""
              }
              onChange={(selectedOption) => setNomorPassport(selectedOption.label)}
              options={nomorPassportOptions}
              className="basic-single"
              styles={{
                container: (provided) => ({
                  ...provided,
                  flex: 1,
                  borderRadius: "10px",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                  fontFamily: "Roboto, Arial, sans-serif",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                }),
                control: (provided) => ({
                  ...provided,
                  flex: 1,
                  width: "100%",
                  backgroundColor: "rgba(217, 217, 217, 0.75)",
                }),
              }}
            />
          </div>
          <button
            type="button"
            className="handle-sumbit-bg"
            onClick={handleSubmitFilter}
          >
            Submit
          </button>
        </form>
      </div>
      <div className="content">
        <div className="table-header">
          <div className="combo">
            <button className="menu" onClick={() => navigate("/home")}>
              Home
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "2vh",
              flexDirection: "row-reverse",
            }}
          >
            <button
              className="print-pdf"
              disabled={data.length === 0 ? true : false}
              onClick={() => generatePDF()}
            >
              Cetak PDF
            </button>
            <button
              className="print-excel"
              disabled={data.length === 0 ? true : false}
              onClick={() => generateExcel()}
            >
              Cetak Excel
            </button>
          </div>
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
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
