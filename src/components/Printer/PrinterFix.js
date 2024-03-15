import React, { useRef, useState } from "react";
import "./PrinterStyle.css";
import QRCode from "qrcode.react";
import Garuda from '../../assets/images/garuda.png'

const Printer = ({
  dataNumberPermohonanPropsVisa,
  dataNumberPermohonanPropsReceipt,
  printRefProps,
  dataPrice,
  dataLokasi,
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
  const combinedValue = `Visa Number: ${dataNumberPermohonanPropsVisa}, Visa Receipt: ${dataNumberPermohonanPropsReceipt}, Price: ${dataPrice}, Lokasi: ${dataLokasi}, Date: ${formattedDate}, Time: ${formattedTime}`;

  return (
    <div className="container-print" ref={printRefProps}>
      <div className="wrappper-container">
        <h2>Date : {formattedDate}</h2>
        <h2>Time : {formattedTime}</h2>
      </div>
      <div className="wrappper-container">
        <h2>IDR {dataPrice}</h2>

      </div>

      <div className="wrappper-container" style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div className="h2-nol" style={{textAlign:"center"}}>
          <h2>Visa Number</h2>
        </div>
        <div className="h2-satu" style={{textAlign:"center", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <h2>Z1A012002</h2>
        </div>
      </div>


      <div className="wrappper-container">
        <div className="qrcode">
          <QRCode className="qrcode-image" value={combinedValue} />
        </div>
      </div>
      {/* <div className="wrappper-container">
        <div className="h2-dua">
          <div className="header-h2">
            <h2>Visa Receipt </h2>
          </div>
          <div className="header-h2">
            <h2>{dataNumberPermohonanPropsReceipt}</h2>
          </div>
        </div>
      </div> */}
            <div className="wrappper-container">
        <div className="h2-dua">
          <div className="header-h2">
            <h2>Visa Receipt </h2>
          </div>
          <div className="header-h2">
            <h2>XA0188090</h2>
          </div>
          <div>
          <h2>{dataLokasi}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Printer;
