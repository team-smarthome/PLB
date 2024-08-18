import React, { useRef, useState, useEffect } from "react";
import "./Table.css";
import { IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import Printer from "../Printer/Printer";

const Table = ({ data, page, response }) => {
  const { value } = JSON.parse(localStorage.getItem("price")) ?? {
    fee: "0",
    fee_cash: "0",
    value: "0.0000",
  };
  const [printLokasi, setPrintLokasi] = useState("");
  const printRef = useRef();
  const [printData, setPrintData] = useState(null);
  const formattedNumber = (num) =>
    parseInt(num).toLocaleString("id-ID", { minimumFractionDigits: 0 });

  const numericValue = parseFloat(value);

  const formattedValue = formattedNumber(numericValue);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  useEffect(() => {
    const city = JSON.parse(localStorage.getItem("user"));
    const officeCity = city?.organization?.officeCity;

    if (officeCity === "DENPASAR") {
      setPrintLokasi("DPS");
    } else if (officeCity === "JAKARTA") {
      setPrintLokasi("CGK");
    }
  }, []);

  // Check if data is not an array or is empty
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>;
  }

  // Calculate the start and end indices based on the page parameter
  const startIndex = (page - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);

  // Display only the data within the calculated indices
  const slicedData = data.slice(startIndex, endIndex);
  const isLastPage = endIndex === data.length;

  // Function to handle print icon click
  const handlePrintClick = (item) => {
    setPrintData(item);
  };

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>PLB Number</th>
            <th>Nama</th>
            <th>Panoramic Capture</th>
            <th>Similarity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((item, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{item.timestamp}</td>
              <td>{item.register_number}</td>
              <td>{item.full_name}</td>
              <td>{item.passport_number}</td>
              <td>{item.citizenship}</td>
              <td>{item.visa_number}</td>
              <td>{item.receipt}</td>
              <td>{item.payment_method}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.billed_price)}
              </td>
              <td>
                <IoMdPrint onClick={() => handlePrintClick(item)} />
              </td>
            </tr>
          ))}
        </tbody>
        {/* Total row */}
        {isLastPage && (
          <tfoot>
            <tr>
              <td colSpan="9">Total Payment</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(response[0].payment_summary.total)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      <Printer
        printRefProps={printRef}
        dataNumberPermohonanPropsVisa={printData ? printData.visa_number : ""}
        dataNumberPermohonanPropsReceipt={printData ? printData.receipt : ""}
        dataPrice={formattedValue}
        dataLokasi={printLokasi}
        passportumber={printData ? printData.passport_number : ""}
        passportName={printData ? printData.full_name : ""}
        dataDate={printData ? printData.timestamp.split(" ")[0] : ""}
        dataTime={printData ? printData.timestamp.split(" ")[1] : ""}
      />
    </div>
  );
};

export default Table;
