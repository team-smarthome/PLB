import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { formData } from "../../utils/atomStates";
import "./PrinterStyle.css";
import QRCode from "qrcode.react";

const Printer = ({
  dataNumberPermohonanPropsVisa,
  dataNumberPermohonanPropsReceipt,
  printRefProps,
  dataPrice,
  dataDate,
  dataTime,
  dataLokasi,
  passportumber,
  passportName,
  passportUrl
}) => {
  const [datafromAtom] = useAtom(formData);
  const tanggal = new Date();

  console.log(datafromAtom, "datatoPrinter");



  const day = String(tanggal.getDate()).padStart(2, "0");
  const month = String(tanggal.getMonth() + 1).padStart(2, "0");
  const year = tanggal.getFullYear();

  const hour = String(tanggal.getHours()).padStart(2, "0");
  const minute = String(tanggal.getMinutes()).padStart(2, "0");
  const second = String(tanggal.getSeconds()).padStart(2, "0");

  const formattedTime = `${hour}:${minute}:${second}`;
  const formattedDate = `${day}/${month}/${year}`;
  const displayDate = dataDate || formattedDate;
  const displayTime = dataTime || formattedTime;
  const qrData = {
    fullname: datafromAtom?.passportData?.noRegister,
    // noRegister: datafromAtom?.passportData?.noRegister,
    passportNumber: datafromAtom?.passportData?.passportNumber,

    // Tambahkan data lain sesuai kebutuhan
  };
  const combinedValue = JSON.stringify(qrData);


  return (
    <div className="container-print" ref={printRefProps}>
      <div className="wrappper-container">
        <h2>Date : {displayDate}</h2>
        <h2>Time : {displayTime}</h2>
      </div>
      <h2>{dataNumberPermohonanPropsVisa}</h2>
      <div className="wrappper-container">
        <div className="qrcode">
          <QRCode className="qrcode-image" value={combinedValue} />
        </div>
      </div>
      <div className="wrappper-container">
        <div className="h2-dua">
          <div className="header-h2">
            <h2>PLB Number</h2>
          </div>
          <div className="header-h2">
            <h2>{passportumber}</h2>
          </div>
          <div className="header-h2">
            <h2 style={{ fontSize: "1em" }}>{passportName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Printer;
