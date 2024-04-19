import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";
import { DataProvider } from "./context/DataContext";

const App = () => {
  return (
    <DataProvider>
      <Router basename="/molina-lte-v2">
        <Routes />
      </Router>
    </DataProvider>
  );
};

export default App;
