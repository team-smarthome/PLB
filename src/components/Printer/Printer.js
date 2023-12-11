import React, { useRef, useState } from "react";
import "./PrinterStyle.css";
import QRCode from "qrcode.react";

const Printer = ({ dataNumberPermohonanProps, printRefProps }) => {
  const tanggal = new Date();

  const day = String(tanggal.getDate()).padStart(2, "0");
  const month = String(tanggal.getMonth() + 1).padStart(2, "0");
  const year = tanggal.getFullYear();

  const hour = String(tanggal.getHours()).padStart(2, "0");
  const minute = String(tanggal.getMinutes()).padStart(2, "0");
  const second = String(tanggal.getSeconds()).padStart(2, "0");

  const formattedTime = `${hour}:${minute}:${second}`;
  const formattedDate = `${day}/${month}/${year}`;
  const combinedValue = `Nomor E-VOA: AB9930006, Registration No: ${dataNumberPermohonanProps}`;

  return (
    <div className="container-print" ref={printRefProps}>
      <div className="wrappper-container">
        <h2>Date : {formattedDate}</h2>
        <h2>Time : {formattedTime}</h2>
      </div>

      <div className="wrappper-container">
        <div className="h2-nol">

        <h2>Visa Number</h2>
        </div>
        <div className="h2-satu">
          <h2>AB9930006</h2>
        </div>
      </div>
      <div className="wrappper-container">
        <div className="qrcode">
          <QRCode value={combinedValue} />
        </div>
    </div>
      <div className="wrappper-container">
        <div className="h2-dua">
          <h2>Registration No: </h2>
        </div>
        <h2>{dataNumberPermohonanProps}</h2>
      </div>
   
    </div>
  );
};

export default Printer;
