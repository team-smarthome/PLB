import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import HomePage from "../pages/Home/Home";
import ScanPassport from "../pages/ScanPassport/ScanPassport";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scanpassport" element={<ScanPassport />} />
    </ReactRoutes>
  );
};

export default Routes;
