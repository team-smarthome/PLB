import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";

const App = () => {
  return (
    <Router basename="/molina-lte-testing-lagi">
      <Routes />
    </Router>
  );
};

export default App;
