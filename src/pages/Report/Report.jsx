import { useEffect, useState } from "react";
import "./Report.css";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDataUserAPI } from "../../services/api";
import { format } from 'date-fns';
import jsPDF from "jspdf";
import "jspdf-autotable";

function Report() {
  const navigate = useNavigate();
  const [loading, setIsloading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [noPassport, setNoPassport] = useState("");
  const [noRegister, setNoRegister] = useState("");
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });
  const [totalDataFilter, setTotalDataFilter] = useState(0);

  const getDataUser = async (params) => {
    try {
      const response = await getDataUserAPI(params);
      setIsloading(false);
      setDataUser(response.data.data);
      setPagination(response.data.pagination);
      setTotalDataFilter(response.data.data.length);
    } catch (error) {
      setIsloading(false);
      console.error("Error:", error);
    }
  };

  const handleApplyFilter = () => {
    const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;
    const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;

    const filterParams = {
      page: page,
      no_passport: noPassport,
      name: name,
      // no_register: noRegister,
      ...(formattedStartDate && { startDate: formattedStartDate }),
      ...(formattedEndDate && { endDate: formattedEndDate }),
    };

    console.log("filterParams", filterParams);
    setIsloading(true);
    getDataUser(filterParams);
  };

  useEffect(() => {
    const fetchData = async () => {
      const filterParams = {
        page: page,
        no_passport: noPassport,
        name: name,
        // no_register: noRegister,
      };
      await getDataUser(filterParams);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePDF = () => {
    const pdf = new jsPDF();

    const fontSize = 10;

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString(
      "en-GB"
    )} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;

    pdf.setFontSize(fontSize);
    pdf.text(`Laporan Data User`, 10, 10);

    const itemHeaders = [
      "No",
      "No. PLB",
      // "No. Register",
      "Nama",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Nationality",
      "Arrival Time",
      "Expired Date",
      "Destination Location",
    ];
    const itemRows = dataUser.map((item, index) => [
      index + 1,
      `${item.no_passport}`,
      // `${item.no_register}`,
      `${item.name}`,
      `${item.date_of_birth}`,
      `${item.gender}`,
      `${item.nationality}`,
      `${item.arrival_time}`,
      `${item.expired_date}`,
      `${item.destination_location}`,
    ]);

    pdf.autoTable({
      head: [itemHeaders],
      body: itemRows,
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
      "No. PLB",
      // "No. Register",
      "Nama",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Nationality",
      "Arrival Time",
      "Expired Date",
      "Destination Location",
    ];
    worksheet.addRow(headers);

    // Add data rows
    dataUser.forEach((item, index) => {
      const row = [
        index + 1,
        `${item.no_passport}`,
        // `${item.no_register}`,
        `${item.name}`,
        `${item.date_of_birth}`,
        `${item.gender}`,
        `${item.nationality}`,
        `${item.arrival_time}`,
        `${item.expired_date}`,
        `${item.destination_location}`,
      ];
      worksheet.addRow(row);
    });



    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const filename = "History Register Report.xlsx";
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

  const resetFilter = () => {
    setNoPassport("");
    setName("");
    // setNoRegister("");
    setStartDate(null);
    setPage(1);
    setPagination({
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
    });
    setIsloading(true);
    const fetchData = async () => {
      const filterParams = {
        page: 1,
        no_passport: "",
        name: "",
        no_register: null,
      };
      await getDataUser(filterParams);
    };
    fetchData();
  }

  return (
    <div className="body">
      <h1>History Register</h1>
      <div className="container-filter">
        <div className="filter-top">
          <div className="filter-rigth">
            <div className="input-filter-top">
              <p>No. PLB</p>
              <input
                type="text"
                placeholder="Nomor PLB"
                value={noPassport}
                onChange={(e) => setNoPassport(e.target.value)}
              />
            </div>
            <div className="input-filter-bottom">
              <p>Nama Lengkap</p>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* <div className="input-filter-bottom">
              <p>No. Register</p>
              <input
                type="text"
                placeholder="Nomor Register"
                value={noRegister}
                onChange={(e) => setNoRegister(e.target.value)}
              />
            </div> */}
          </div>
          <div className="filter-left">
            <div className="input-filter-bottom2">
              <p>Tanggal Mulai</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="dd/MM/yyyy HH:mm"
                className="date-picker"
                timeIntervals={1}
                placeholderText="Tanggal/Bulan/Tahun HH:mm"
              />
            </div>
            <div className="input-filter-bottom2">
              <p>Tanggal Terakhir</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="dd/MM/yyyy HH:mm"
                className="date-picker"
                timeIntervals={1}
                placeholderText="Tanggal/Bulan/Tahun HH:mm"
              />
            </div>
          </div>
        </div>
        <div className="filter-bottom">
          <div className="button-filter-first">
            <button onClick={() => { navigate("/home") }}>Home</button>
            <button className="" disabled={dataUser.length === 0 ? true : false} onClick={() => generatePDF()}>Cetak PDF</button>
            <button className="" disabled={dataUser.length === 0 ? true : false} onClick={() => generateExcel()} >Cetak Excel</button>
          </div>
          <div className="button-filter-second">
            <button onClick={resetFilter}>Reset</button>
            <button onClick={handleApplyFilter}>Terapkan</button>
          </div>
        </div>
      </div>
      <div className="content">
        {loading ? (
          <div className={"content-loading"}>
            <div className="loader-report-spin">
              {loading && <span className="loader-loading-report"></span>}
            </div>
          </div>
        ) : (
          <>
            <Table data={dataUser} page={pagination.current_page} perPage={pagination.per_page} />
            <div className="table-footer">
              <p>Menampilkan {totalDataFilter} data dari Total Data{pagination.total}</p>
              <Pagination
                pageCount={pagination.last_page}
                onPageChange={(selectedPage) => setPage(selectedPage)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
