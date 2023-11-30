import React from "react";
import './HeroStyle.css'
import Input from "../input/Input";
import List from "../list/List";
import CardStatus from "../CardStatus/CardStatus";

const Hero = () => {
  return (
    <div className="hero">
      <div className="container-hero">
        <div className="list"><List /></div>
        <div className="card">
          <CardStatus />
        </div>
      </div>
      <div className="form">
        <Input />
      </div>
    </div>
  );
};

export default Hero;
