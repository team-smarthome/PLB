import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrintIcon from "../../assets/images/image-9.svg";
import InsertCard from "../../assets/images/image-8.svg";
import Success from "../../assets/images/image-2.svg";
import Failed from "../../assets/images/image-3.svg";
import "./CardPaymentStyle.css";

const CardPayment = ({
  isConfirm,
  isFailed,
  isPrinted,
  isSuccess,
  sendDataUpdatePayment,
  dataUser,
  dataNumberPermohonan,
}) => {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberWarning, setCardNumberWarning] = useState(false);

  const [expiry, setExpiry] = useState("");
  const [expiryWarning, setExpiryWarning] = useState(false);

  const [cvv, setCvv] = useState("");
  const [cvvWarning, setCvvWarning] = useState(false);

  const [seconds, setSeconds] = useState(5);
  const [dataPasporUser, setDataPasporUser] = useState(null);
  const [dataPermohonanUser, setDataPermohonanUser] = useState(null);

  const [number, setNumber] = useState("");
  const [receipt, setReceipt] = useState("");

  // console.log("dataPermohonanUser: ", dataPermohonanUser);
  console.table({
    isConfirm,
    isFailed,
    isPrinted,
    isSuccess,
    cardNumber,
    expiry,
    cvv,
  });

  useEffect(() => {
    // ini jika semua false
    const timer = setTimeout(() => {
      if (!isConfirm && !isFailed && !isPrinted && !isSuccess) {
        sendDataUpdatePayment({
          isConfirm: true,
          isFailed: false,
          isPrinted: false,
          isSuccess: false,
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
        });

        setDataPasporUser(dataUser);
        setDataPermohonanUser(dataNumberPermohonan);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    cardNumber,
    cvv,
    dataNumberPermohonan,
    dataUser,
    expiry,
    isConfirm,
    isFailed,
    isPrinted,
    isSuccess,
    sendDataUpdatePayment,
  ]);

  useEffect(() => {
    // ini jika isPrinted true
    if (isPrinted && !isConfirm && !isFailed && !isSuccess) {
      console.log("cahyooo");
      console.log("dataPermohonanUser: ", dataPermohonanUser);

      setNumber(dataPermohonanUser?.application.registerNumber ?? "");
      setReceipt("000000000011");
      

      const timerPrintOut = setTimeout(() => {
        sendDataUpdatePayment({
          isConfirm: false,
          isFailed: false,
          isPrinted: false,
          isSuccess: true,
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
        });
      }, 3000);

      return () => clearTimeout(timerPrintOut);
    }
  }, [
    cardNumber,
    cvv,
    dataPermohonanUser,
    expiry,
    isConfirm,
    isFailed,
    isPrinted,
    isSuccess,
    sendDataUpdatePayment,
  ]);

  useEffect(() => {
    // ini jika isSuccess true
    if (!isPrinted && !isConfirm && !isFailed && isSuccess) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConfirm, isFailed, isPrinted, isSuccess]);

  useEffect(() => {
    if (seconds === 0) {
      // navigate("/");
    }
  }, [navigate, seconds]);

  const handleExpiryChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setExpiry((prevExpiry) => {
        const formattedInput = input
          .replace(/(\d{2})(\d{0,2})/, "$1/$2")
          .replace(/(\/\d{2})\d+?$/, "$1");

        if (/^\d{0,2}\/?\d{0,2}$/.test(formattedInput)) {
          return formattedInput;
        } else {
          return prevExpiry;
        }
      });
    }
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 16) {
      setCardNumber(
        input
          .match(/.{1,4}/g)
          ?.join(" ")
          .substring(0, 19)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cardNumber === "") {
      setCardNumberWarning(true);
    } else if (expiry === "") {
      setExpiryWarning(true);
    } else if (cvv === "") {
      setCvvWarning(true);
    } else if (cardNumber !== "" && cvv !== "" && expiry !== "") {
      setCardNumberWarning(false);
      setExpiryWarning(false);
      setCvvWarning(false);

      const card_data = {
        cc_no: cardNumber,
        cc_exp: expiry,
        cvv: cvv,
      };

      const bill_data = {
        billing_id: "",
        amount: "",
        currency: "",
      };

      const user_data = {
        pass_no: dataPasporUser.passportData.docNumber,
        pass_name: dataPasporUser.passportData.fullName,
        country: dataPasporUser.passportData.nationality,
      };

      const dataParam = {
        card_data: { ...card_data },
        bill_data: { ...bill_data },
        user_data: { ...user_data },
      };

      console.log("dataParam: ", dataParam);

      sendDataUpdatePayment({
        isConfirm: false,
        isFailed: false,
        isPrinted: true,
        isSuccess: false,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
      });
    }
  };

  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">
          <h1 className="card-title">
            {isConfirm ? (
              "Confirmation Payment"
            ) : isPrinted ? (
              "Payment Success"
            ) : isSuccess ? (
              <>
                Your VOA has been issued
                <br />
                Please Check Your email
              </>
            ) : isFailed ? (
              "Payment Failed"
            ) : (
              "Please input your credit card"
            )}
          </h1>
          {isConfirm ? (
            <form className="card-payment-form" onSubmit={handleSubmit}>
              <div className="form-group-payment-cc">
                <label>Card Number</label>
                <input
                  type="text"
                  className="card-number-input"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>
              {cardNumberWarning && (
                <div className="warning">Please enter your card number!</div>
              )}
              <div className="form-group-payment-cc">
                <label>Expired</label>
                <input
                  type="text"
                  className="expiry-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                />
              </div>
              {expiryWarning && (
                <div className="warning">Please enter expired!</div>
              )}
              <div className="form-group-payment-cc">
                <label>CVV</label>
                <input
                  type="text"
                  maxLength="3"
                  className="cvv-input"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
              {cvvWarning && <div className="warning">Please enter cvv!</div>}
              <div className="form-group-payment-submit-cc">
                <button type="submit">Confirm</button>
              </div>
            </form>
          ) : isPrinted ? (
            <div className="isPrint-container1">
              <img src={Success} alt="" className="card-image-success1" />
              <div className="print-container1">
                <h2>
                  Please wait until receipt has been
                  <br />
                  printed
                </h2>
                <img className="card-image-print1" src={PrintIcon} />
              </div>
            </div>
          ) : isSuccess ? (
            <div className="issusccess-container1">
              <img src={Success} alt="" className="card-image-issuccess1" />
              <div className="issusccess-register1">
                <div className="issusccess-register2">
                  <h3>Register Number: </h3>
                  <h3>Payment Receipt: </h3>
                </div>
                <div className="issusccess-register2">
                  <h3>{number}</h3>
                  <h3>{receipt}</h3>
                </div>
              </div>
              <h4>Please capture this page when receipt not printed out</h4>

              <button>
                <h2>OK</h2>
                <span>({seconds})</span>
              </button>
            </div>
          ) : isFailed ? (
            <div className="isfailed-payment">
              <div className="isfailed-payment2">
                <h3>Reason Failed : Network / Card error / declined dll</h3>
              </div>
              <img src={Failed} alt="" className="card-image-issuccess1" />
              <div className="form-group-payment-submit1">
                <button type="submit">Confirm</button>
              </div>
            </div>
          ) : (
            <div className="card-container-image">
              <img src={InsertCard} alt="" className="card-image1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPayment;
