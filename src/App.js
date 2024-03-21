import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";

const App = () => {
  return (
    <Router basename="/molina-lte-v2">
      <Routes />
    </Router>
  );
};

export default App;
