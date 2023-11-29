import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import HomePage from "../pages/Home/Home";
import ScanPassport from "../pages/ScanPassport/ScanPassport";
import TakePhoto from "../pages/TakePhoto/TakePhoto";
import InputEmail from "../pages/InputEmail/InputEmail";
import Payment from "../pages/Payment/Payment";
import TakePhotos from "../components/WebcamComponent/WebcamComponent";


const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scanpassport" element={<ScanPassport />} />
      <Route path="/takephoto" element={<TakePhoto />} />
      <Route path="/inputemail" element={<InputEmail />} />
      <Route path="/payment" element={<Payment />} />
      {/* <Route path="/takephoto" element={<TakePhoto />} /> */}
      {/* <Route path="takephotos" element={<TakePhotos />} /> */}
    </ReactRoutes>
  );
};

export default Routes;
