import React from "react";
import "./PaymentStyle.css";
import Input from "../../components/input/Input";
import Header from "../../components/Header/Header";
import CardPayment from "../../components/CardPayment/CardPayment";

const Payment = () => {
  // Ganti nilai properti ini sesuai kebutuhan
  const cardPaymentProps = {
    isConfirm: false,
    isPrinted: false,
    isSuccess: false,
    isFailed: false,
  };

  return (
    <div className="payment-container">
      <Header title="Payment" />
      <div className="payment-body">
        <CardPayment {...cardPaymentProps} />

        <div className="payment-input">
          <Input />
        </div>
      </div>
    </div>
  );
};

export default Payment;
