import React, { useEffect, useState } from "react";
import PrintIcon from '../../assets/images/image-9.svg';
import InsertCard from '../../assets/images/image-8.svg';
import Success from '../../assets/images/image-2.svg';
import './CardPaymentStyle.css'; // Impor file CSS

const CardPayment = ({isConfirm, isPrinted, isSuccess}) => {
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
    return(
        <div className="card-status1">
        <div className="card-container1">
            <div className="inner-card1">
                <h1 className="card-title1">
                    {isConfirm ? "Confimation Payment" : isPrinted ? "Payment Success" :  isSuccess ? "Your VOA has been issued Please Check Your email" : "Please input your credit card" }
                </h1>
                {isConfirm ?
                (<form>
                    <div className="form-group-payment1">
                    <label>Card Number</label>
                    <input type="text"/>
                    </div>
                    <div className="form-group-payment1">
                    <label>Expired</label>
                    <input type="text"/>
                    </div>
                    <div className="form-group-payment1">
                    <label>CVV</label>
                    <input type="text" maxLength="3" />
                    </div>
                    <div className="form-group-payment-submit1">
                    <button type="submit">Confirm</button>
                    </div>
                </form>) :
                isPrinted ? 
                <div className="isPrint-container1">
                <img src={Success} alt=""
                    className="card-image-success1"
                />
                <div className="print-container1">
                    <h2>
                    Please wait until receipt has been 
                    <br/>
                    printed
                    </h2>
                    <img  className="card-image-print1" src={PrintIcon}/>
                </div>
                </div>
                :          isSuccess ? <div className="issusccess-container1">
                  <img src={Success} alt=""
                    className="card-image-issuccess1"
                />  
                <button>
                    <h2>OK</h2>
                    <span>({seconds})</span>
                </button>
                </div>
                :
                <img src={InsertCard} alt=""
                    className="card-image1"
                />}
            </div>
        </div>
        </div>
    )
}

export default CardPayment