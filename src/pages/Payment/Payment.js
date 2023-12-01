import React from "react";
import "./PaymentStyle.css";
import Input from "../../components/input/Input";
import Header from "../../components/Header/Header";
import CardPayment from "../../components/CardPayment/CardPayment";
const Payment = () => {
  return (
    <div className="payment-container">
      <Header title="Payment" />
      <div className="payment-body">
        {/* <CardPayment /> */}
        {/* <CardPayment isConfirm/> */}
        {/* <CardPayment isPrinted/> */}
        <CardPayment isSuccess/>    

        <div className="payment-input">
        <Input />
      </div>
      </div>
   
    </div>
  );
};

export default Payment;
