import React from "react";
import "./ContentStyle.css";
import Input from "../input/Input";
// import List from "../TabList/TabList";
import CardStatus from "../CardStatus1/CardStatus";
import CardList from "../CardList/CardList";

const Content = () => {
  return (
    <div className="hero">
      <div className="container-hero">
        <div className="list">
          <CardList />
        </div>
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

export default Content;
