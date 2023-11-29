// CardStatus.js
import React from "react";
import Ceklist from '../../assets/images/image-1.png';
import './CardStatusStyle.css'; // Impor file CSS

const CardStatus = () => {
    return (
        <div className="card-status">
        <div className="card-container">
            <div className="inner-card">
                <h1 className="card-title">
                    Please input your passport
                    <br />
                     photo page into the reader
                </h1>
                <img src={Ceklist} alt=""
                    className="card-image"
                />
            </div>
        </div>
        </div>
    );
};

export default CardStatus;
