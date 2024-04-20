import React, { useRef, useState } from "react";
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
  // console.log("dataNumberPermohonanPropsVisa", dataNumberPermohonanPropsVisa);
  // console.log(
  //   "dataNumberPermohonanPropsReceipt",
  //   dataNumberPermohonanPropsReceipt
  // );
  const tanggal = new Date();

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
  // const combinedValue = `Visa Number: ${dataNumberPermohonanPropsVisa}, Visa Receipt: ${dataNumberPermohonanPropsReceipt}, Price: ${dataPrice},
  // Date: ${displayDate}, Time: ${displayTime}, Lokasi: ${dataLokasi}, Passport Number: ${passportumber}, Name: ${passportName},
  // For extend visit: ${passportUrl}
  // `;
  const combinedValue = `${passportUrl}`;


  return (
    <div className="container-print" ref={printRefProps}>
      <div className="wrappper-container">
        <h2>Date : {displayDate}</h2>
        <h2>Time : {displayTime}</h2>
      </div>
      <div className="wrappper-container">
        <h2>IDR {dataPrice}</h2>

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
            <h2>Visa Receipt </h2>
          </div>
          <div className="header-h2">
            <h2>{dataNumberPermohonanPropsReceipt}</h2>
          </div>
          <div>
            <h2>{dataLokasi}</h2>
          </div>
          <div className="header-h2">
            <h2>Passport Number</h2>
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
