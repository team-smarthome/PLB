import React, { useRef, useState } from "react";
import "./PrinterStyle.css";
import QRCode from "qrcode.react";

const Printer = ({
  dataNumberPermohonanPropsVisa,
  dataNumberPermohonanPropsReceipt,
  printRefProps,
}) => {
  const tanggal = new Date();

  const day = String(tanggal.getDate()).padStart(2, "0");
  const month = String(tanggal.getMonth() + 1).padStart(2, "0");
  const year = tanggal.getFullYear();

  const hour = String(tanggal.getHours()).padStart(2, "0");
  const minute = String(tanggal.getMinutes()).padStart(2, "0");
  const second = String(tanggal.getSeconds()).padStart(2, "0");

  const formattedTime = `${hour}:${minute}:${second}`;
  const formattedDate = `${day}/${month}/${year}`;
  const combinedValue = `Nomor E-VOA: ${dataNumberPermohonanPropsVisa}, Registration No: ${dataNumberPermohonanPropsReceipt}`;

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
          <h2>{dataNumberPermohonanPropsVisa}</h2>
        </div>
      </div>
      <div className="wrappper-container">
        <div className="qrcode">
          <QRCode className="qrcode-image" value={combinedValue} />
        </div>
      </div>
      <div className="wrappper-container">
        <div className="h2-dua">
          <div className="header-h2">
            <h2>Registration No: </h2>
          </div>
          <div className="header-h2">
            <h2>{dataNumberPermohonanPropsReceipt}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Printer;
