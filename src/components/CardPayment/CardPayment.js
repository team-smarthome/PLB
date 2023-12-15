import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrintIcon from "../../assets/images/image-9.svg";
import InsertCard from "../../assets/images/image-8.svg";
import Success from "../../assets/images/image-2.svg";
import Failed from "../../assets/images/image-3.svg";
import "./CardPaymentStyle.css";
import Printer from "../Printer/Printer";
import { useReactToPrint } from "react-to-print";
import Credit from "../../assets/images/credit.png";
import Cash from "../../assets/images/cash.png";

const CardPayment = ({
  onStatusChange,
  isCreditCard,
  isPaymentCredit,
  isPaymentCash,
  isFailed,
  isPrinted,
  isWaiting,
  isSuccess,
  cardNumberPetugas,
  sendDataUpdatePayment,
  dataUser,
  dataNumberPermohonan,
  statusPaymentCredit,
}) => {
  const navigate = useNavigate();
  const printRef = useRef();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberWarning, setCardNumberWarning] = useState(false);

  const [expiry, setExpiry] = useState("");
  const [expiryWarning, setExpiryWarning] = useState(false);

  const [cvv, setCvv] = useState("");
  const [cvvWarning, setCvvWarning] = useState(false);

  const [seconds, setSeconds] = useState(8);
  const [dataPasporUser, setDataPasporUser] = useState(null);
  const [dataPermohonanUser, setDataPermohonanUser] = useState(null);

  const [number, setNumber] = useState("");
  const [receipt, setReceipt] = useState("");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  console.table({
    isCreditCard,
    isPaymentCredit,
    isPaymentCash,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    paymentMethod,
    cardNumber,
    expiry,
    cvv,
  });

  useEffect(() => {
    // ini jika semua false
    const timer = setTimeout(() => {
      if (
        !isFailed &&
        !isWaiting &&
        !isPrinted &&
        !isSuccess &&
        !isPaymentCredit &&
        !isPaymentCash &&
        isCreditCard
      ) {
        sendDataUpdatePayment({
          isCreditCard: false,
          isWaiting: false,
          isFailed: false,
          isPrinted: false,
          isSuccess: false,
          isPaymentCredit: true,
          isPaymentCash: false,
          paymentMethod: paymentMethod,
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
    paymentMethod,
    cardNumber,
    cvv,
    dataNumberPermohonan,
    dataUser,
    expiry,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isCreditCard,
    sendDataUpdatePayment,
  ]);

  

  useEffect(() => {
    // ini jika isPrinted true
    setDataPasporUser(dataUser);
        setDataPermohonanUser(dataNumberPermohonan);
    if (
      isPrinted &&
      !isFailed &&
      !isSuccess &&
      !isWaiting &&
      !isPaymentCredit &&
      !isPaymentCash &&
      !isCreditCard
    ) {
      console.log("dataPermohonanUser: ", dataPermohonanUser);
      setNumber(dataPermohonanUser?.visa_number ?? "");
      setReceipt(dataPermohonanUser?.visa_receipt ?? "");
      handlePrint();
      const timerPrintOut = setTimeout(() => {
        sendDataUpdatePayment({
          isCreditCard: false,
          isWaiting: false,
          isFailed: false,
          isPrinted: false,
          isSuccess: true,
          isPaymentCredit: false,
          paymentMethod: paymentMethod,
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
        });
      }, 3000);

      return () => clearTimeout(timerPrintOut);
    }
  }, [
    paymentMethod,
    cardNumber,
    cvv,
    dataPermohonanUser,
    expiry,
    isWaiting,
    isFailed,
    isPrinted,
    isSuccess,
    isCreditCard,
    isPaymentCredit,
    sendDataUpdatePayment,
    handlePrint,
  ]);

  useEffect(() => {
    // ini jika isSuccess true
    if (
      !isPrinted &&
      !isFailed &&
      isSuccess &&
      !isWaiting &&
      !isPaymentCredit &&
      !isPaymentCash &&
      !isCreditCard
    ) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    isFailed,
    isPrinted,
    isWaiting,
    isSuccess,
    isPaymentCredit,
    isPaymentCash,
    isCreditCard,
  ]);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/home");
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

  const handlePaymentCredit = () => {
    setPaymentMethod("KIOSK");
    console.log("berhasil");
    sendDataUpdatePayment({
      isWaiting: false,
      isFailed: false,
      isPrinted: false,
      isSuccess: false,
      isCreditCard: true,
      isPaymentCredit: false,
      paymentMethod: paymentMethod,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
    });
  };

  const handlePaymentCash = () => {
    setPaymentMethod("KICASH");
    setExpiry("12/25");
    setCvv("123");
       setDataPasporUser(dataUser);
    console.log("berhasil");
    setCardNumber(cardNumberPetugas)
    sendDataUpdatePayment({
      isWaiting: false,
      isFailed: false,
      isPrinted: false,
      isSuccess: false,
      isCreditCard: false,
      isPaymentCredit: false,
      isPaymentCash: true,
      paymentMethod: paymentMethod,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
    });
  };

  const handleBackHome = () => {
    navigate("/home");
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
        isWaiting: false,
        isConfirm: false,
        isFailed: false,
        isPrinted: false,
        isSuccess: false,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
      });
      const newStatusPaymentCreditCard = !statusPaymentCredit;
      onStatusChange(newStatusPaymentCreditCard);
    }
  };

  
  const handleSubmitCash = (e) => {
    console.log("dataPasporUser1: ", dataPasporUser);
    e.preventDefault();
    console.log("dataPasporUser2: ", dataPasporUser);
    setCardNumber(cardNumberPetugas)
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

      console.log("dataPasporUser: ", dataPasporUser);

      const dataParam = {
        card_data: { ...card_data },
        bill_data: { ...bill_data },
        user_data: { ...user_data },
      };

      console.log("dataParam: ", dataParam);
      sendDataUpdatePayment({
        isWaiting: false,
        isConfirm: false,
        isFailed: false,
        isPrinted: false,
        isSuccess: false,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
      });
      const newStatusPaymentCreditCard = !statusPaymentCredit;
      onStatusChange(newStatusPaymentCreditCard);
    }
  };



  return (
    <div className="card-status">
      <div className="card-container">
        <div className="inner-card">
          <h1 className="card-title">
            {isPrinted ? (
              "Payment Success"
            ) : isSuccess ? (
              <>
                Your VOA has been issued
                <br />
                Please Check Your email
              </>
            ) : isFailed ? (
              "Payment Failed"
            ) : isCreditCard ? (
              "Please input your credit card"
            ) : isPaymentCredit ? (
              "Confirmation Payment -CC"
            ) : isPaymentCash ? (
              "Confirmation Payment - Cash"
            ) : isWaiting ? ("")
             : (
              "Chose payment method"
            )}
          </h1>
          {isPrinted ? (
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

              <button onClick={handlePrint}>
                <h2 onClick={handleBackHome}>OK</h2>
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
          ) : isCreditCard ? (
            <div className="card-container-image">
              <img src={InsertCard} alt="" className="card-image1" />
            </div>
          ) : isPaymentCredit ? (
            <form className="payment-credit-cardCC" onSubmit={handleSubmit}>
              <div>
                <div className="credit-card-payment1">
                  <div className="amount">
                    <p>Amunt</p>
                    <p>Transaction Fee</p>
                    <p>Total Amount</p>
                  </div>
                  <div className="amount-price">
                    <div className="amount-box1">
                      <input type="text" value="Rp. 500.000" />
                    </div>
                    <div className="amount-box2">
                      <input type="text" value="Rp. 19.500" />
                    </div>
                    <div className="amount-box3">
                      <input type="text" value="Rp. 519.500" />
                    </div>
                  </div>
                </div>
                <div className="credit-card-payment2">
                  <div className="credit-card-payment3">
                    <p>Card Number</p>
                    <p>Expired</p>
                    <p>CVV</p>
                  </div>
                  <div className="credit-card-payment4">
                    <div className="credit-card-value1">
                      <input
                        type="text"
                        // value="12312 123123 1231321"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                    <div className="credit-card-value2">
                      <input
                        type="text"
                        // value="12/25"
                        value={expiry}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    <div className="credit-card-value3">
                      <input
                        type="text"
                        // value="asddsa"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="confirm-payment-credit">
                  <div className="confirm-payment-credit2">
                    <div className="form-group-payment-submit2">
                      <button type="submit">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : isPaymentCash ? (
            <form className="payment-credit-cardCC" onSubmit={handleSubmitCash}>
              <div>
                <div className="credit-card-payment1">
                  <div className="amount">
                    <p>Amunt</p>
                    <p>Transaction Fee</p>
                    <p>Total Amount</p>
                  </div>
                  <div className="amount-price">
                    <div className="amount-box1">
                      <input type="text" value="Rp. 500.000" />
                    </div>
                    <div className="amount-box2">
                      <input type="text" value="Rp. 19.500" />
                    </div>
                    <div className="amount-box3">
                      <input type="text" value="Rp. 519.500" />
                    </div>
                  </div>
                </div>
                <div className="credit-card-payment2">
                  <div className="credit-card-payment3">
                    <p>Card Number</p>
                  </div>
                  <div className="credit-card-payment4">
                    <div className="credit-card-value1">
                      <input type="text" value={cardNumberPetugas} />
                    </div>
                    {cardNumberWarning && (
                      <div className="warning">
                        Please enter your card number!
                      </div>
                    )}
                  </div>
                </div>
                <div className="confirm-payment-credit">
                  <div className="confirm-payment-credit2">
                    <div className="form-group-payment-submit3">
                      <button type="submit">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : isWaiting ? (
            <div style={{color: "#3d5889"}}>
              <h1>Please wait...</h1>
            </div>

          )
          : (
            <div className="payment-method">
              <div className="payment-credit" onClick={handlePaymentCredit}>
                <img src={Credit} alt="" />
                <p>Credit Card</p>
              </div>
              <div className="payment-cash" onClick={handlePaymentCash}>
                <img src={Cash} alt="" />
                <p>Cash</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Printer
        dataNumberPermohonanPropsVisa={number}
        dataNumberPermohonanPropsReceipt={receipt}
        printRefProps={printRef}
      />
    </div>
  );
};

export default CardPayment;
