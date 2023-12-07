import React, { useEffect, useState } from "react";
import PrintIcon from "../../assets/images/image-9.svg";
import InsertCard from "../../assets/images/image-8.svg";
import Success from "../../assets/images/image-2.svg";
import Failed from "../../assets/images/image-3.svg";
import "./CardPaymentStyle.css";

const CardPayment = ({ isConfirm, isFailed, isPrinted, isSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [seconds, setSeconds] = useState(5);

  const [number, setNumber] = useState("234732641340112311");
  const [receipt, setReceipt] = useState("234732641340112311");

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleExpiryChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setExpiry(
        input
          .replace(/(\d{2})(\d{0,2})/, "$1/$2")
          .replace(/(\/\d{2})\d+?$/, "$1")
      );
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
    console.log(
      `Payment confirmed for card ending in ${cardNumber} with expiry ${expiry} and CVV ${cvv}`
    );
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
                  className="card-number-input" // Add the class name here
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>
              <div className="form-group-payment-cc">
                <label>Expired</label>
                <input
                  type="text"
                  className="expiry-input" // Add the class name here
                  value={expiry}
                  onChange={handleExpiryChange}
                />
              </div>
              <div className="form-group-payment-cc">
                <label>CVV</label>
                <input
                  type="text"
                  maxLength="3"
                  className="cvv-input" // Add the class name here
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
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
