import React, { useRef, useState, useEffect } from "react";
import "./Table.css";
import { IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import Printer from "../Printer/Printer";

const Table = ({ data, page }) => {
  console.log(data, "dataTable");

  const printRef = useRef();
  const [printData, setPrintData] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData, handlePrint]);


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

  const handleEpochToDate = (epoch) => {
    const date = new Date(epoch * 1000);

    // Format tanggal menjadi "dd-MM-yyyy HH:mm:ss"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-indexed month
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDate, "dataConvert");
    return formattedDate;
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
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((item, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{handleEpochToDate(item.time)}</td>
              <td>{item.personCode}</td>
              <td>{item.name}</td>
              <td>
                <img
                  src={`http://192.168.2.127/ofsimage/${item.images_info[0].img_path}`}
                  alt="Panoramic Capture"
                  width="80"
                  height="80"
                  style={{ borderRadius: "100%" }}
                />
              </td>
              <td>{item.images_info[0].similarity}</td>
              <td>{item.passStatus === 5 ? "Success" : "Failed"}</td>

              <td>
                <IoMdPrint onClick={() => handlePrintClick(item)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Printer
        printRefProps={printRef}
        dataNumberPermohonanPropsVisa={printData ? printData.visa_number : ""}
        dataNumberPermohonanPropsReceipt={printData ? printData.receipt : ""}
        passportumber={printData ? printData.passport_number : ""}
        passportName={printData ? printData.full_name : ""}
        dataDate={printData ? printData.timestamp.split(" ")[0] : ""}
        dataTime={printData ? printData.timestamp.split(" ")[1] : ""}
      />
    </div>
  );
};

export default Table;
