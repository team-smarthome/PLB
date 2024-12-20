import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { formData } from "../../utils/atomStates";
import "./PrinterStyle.css";
import QRCode from "qrcode.react";
import Cookies from 'js-cookie';

const Printer = ({
  printRefProps,
  passportumber,
  passportName,
  birthDate = "01/01/2000",
  nationality = "Indonesia"
}) => {
  const [datafromAtom] = useAtom(formData);
  const tanggal = new Date();
  const userCookie = Cookies.get('userdata')
  const userInfo = JSON.parse(userCookie);
  console.log(userInfo, "dr printer")
  console.log(datafromAtom, "datatoPrinter");



  const day = String(tanggal.getDate()).padStart(2, "0");
  const month = String(tanggal.getMonth() + 1).padStart(2, "0");
  const year = tanggal.getFullYear();

  const hour = String(tanggal.getHours()).padStart(2, "0");
  const minute = String(tanggal.getMinutes()).padStart(2, "0");
  const second = String(tanggal.getSeconds()).padStart(2, "0");

  const formattedTime = `${hour}:${minute}:${second}`;
  const formattedDate = `${day}/${month}/${year}`;
  const displayDate = formattedDate;
  const displayTime = formattedTime;
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
        <h2>Imigrasi Indonesia</h2>
        <h4 className="text-center">{userInfo.nama_tpi}</h4>
      </div>
      <div className="wrappper-container">
        <h3>Nama : {passportName}</h3>
        <h3>Date Birth : {birthDate}</h3>
        <h3>No.PLB / TBC : {passportumber}</h3>
        <h3>Kebangsaan : {nationality}</h3>
      </div>
      <div className="wrappper-container">
        <div className="qrcode">
          <QRCode className="qrcode-image" value={combinedValue} />
        </div>
      </div>
      <div className="wrappper-container">
        <h2>{`${displayDate} ${displayTime}`}</h2>
      </div>
    </div>
  );
};

export default Printer;