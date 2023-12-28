import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Success from "../../assets/images/image-2.svg";
import Print from "../../assets/images/image-9.svg";
import Failed from "../../assets/images/image-3.svg";
import "./StatusPaymentStyle.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Printer from "../../components/Printer/Printer";

const StatusPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  console.log("searchParams", searchParams);
  const statusParams = searchParams.get("status");
  // console.log('test logging: ', searchParams.get("status"), searchParams.get("voa"), searchParams.get("receipt"))
  const voaParams =  searchParams.get("voa");
  const recieptParams = searchParams.get("receipt");
  const printRef = useRef();
  const [seconds, setSeconds] = useState(8);
  const [statusPaymentProps, setStatusPaymentProps] = useState({
    isPrinted: false,
    isSuccess: false,
    isFailed: false,
  });

  const [number, setNumber] = useState("");
  const [receipt, setReceipt] = useState("");

  const [title, setTitle] = useState("");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  useEffect(() => {
    if (statusParams === "200") {
      setStatusPaymentProps({
        isFailed: false,
        isSuccess: false,
        isPrinted: true,
      });
      setNumber(voaParams);
      setReceipt(recieptParams);
      console.log("voaParams", voaParams);
      console.log("recieptParams", recieptParams);
    } else if (statusParams === "500") {
      setStatusPaymentProps({
        isFailed: true,
        isSuccess: false,
        isPrinted: false,
      });
    } else {
      setStatusPaymentProps({
        isFailed: true,
        isSuccess: false,
        isPrinted: false,
      });
    }
  }, [statusParams]);

  useEffect(() => {
    if (statusPaymentProps.isFailed) {
      setTitle("Payment Failed");
    } else if (statusPaymentProps.isSuccess) {
      setTitle("Your VOA has been issued Please Check Your email");
    } else {
      setTitle("Payment Success");
    }
  }, [statusPaymentProps.isPrinted]);

  const handleConfirmStatusPayment = () => {
    navigate("/home");
  };


  useEffect(() => {
    if (statusPaymentProps.isPrinted) {
      handlePrint(); // Call handlePrint when isPrinted becomes true
    }
    const timerPrintOut = setTimeout(() => {
      if(statusParams == "200"){
        setStatusPaymentProps({
          isFailed: false,
          isSuccess: true,
          isPrinted: false,
        });
      }
      else if(statusParams == "500"){
        setStatusPaymentProps({
          isFailed: true,
          isSuccess: false,
          isPrinted: false,
        });
      }
    }, 5000);
    return () => clearTimeout(timerPrintOut);

  }, [statusPaymentProps.isPrinted,]);

  useEffect(() => {
    // Jika isSuccess true, mulai timer
    if (statusPaymentProps.isSuccess) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
  
      // Clear the timer when the component unmounts or when isSuccess becomes false
      return () => clearInterval(timer);
    }
  }, [statusPaymentProps.isSuccess]);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/home");
    }
  }, [navigate, seconds]);

  const handleStatusPayment = () => {
    navigate("/home");
  };


  return (
    <>
      <div className="card-statusX-container">
        <div className="title-status-payment">
          <h1>Payment</h1>
        </div>
        <div className="card-statusX">
          <div className="card-containerX">
            <div className="inner-cardX">
              <h1 className="card-titleX">{title}</h1>
              {statusPaymentProps.isFailed ? (
                <>
                  <div className="isfailed-payment">
                    <div className="isfailed-payment2">
                      <h3>Reason Failed : Network / Card error / declined dll</h3>
                    </div>
                    <img src={Failed} alt="" className="card-image-issuccess1" />
                    <div className="form-group-payment-submit1">
                      <button type="submit" onClick={handleStatusPayment}>
                        Confirm
                      </button>
                    </div>
                  </div>
                </>
              ) : statusPaymentProps.isSuccess ? (
                <>
                  <div className="issusccess-container1">
                    <img src={Success} alt="" className="card-image-issuccess1" />
                    <div className="issusccess-register1">
                      <div className="issusccess-register2">
                        <h3>Visa Number: </h3>
                        <h3>Visa Receipt: </h3>
                      </div>
                      <div className="issusccess-register2">
                      <h3>{voaParams}</h3>
                  <h3>{recieptParams}</h3>
                      </div>
                    </div>
                    <h4>Please capture this page when receipt not printed out</h4>
                    <button onClick={handleStatusPayment}>
                      <h2>OK</h2>
                      <span>({seconds})</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="isPrint-container1X">
                    <img src={Success} alt="" className="card-image-success1X" />
                    <div className="print-container1X">
                      <h2>
                        Please wait until receipt has been
                        <br />
                        printed
                      </h2>
                      <img src={Print} className="card-image-print1X" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Printer
        dataNumberPermohonanPropsVisa={voaParams}
        dataNumberPermohonanPropsReceipt={recieptParams}
        printRefProps={printRef}
      />
    </>
  );
};

export default StatusPayment;
