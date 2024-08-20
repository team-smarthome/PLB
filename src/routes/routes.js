import React from "react";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Apply from "../pages/Apply/Apply";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import SpvLogin from "../pages/SpvLogin/SpvLogin";
import Report from "../pages/Report/Report";
import Swal from "sweetalert2";
import Information from "../pages/Information/Information";

const isAuthenticated = () => {
  const token = Cookies.get('token');
  return !!token;


};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: window.location.pathname }} />
  );
};

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<Login />} />
      <Route path="/menu" element={<ProtectedRoute element={<SpvLogin />} />} />
      <Route path="/history-log" element={<ProtectedRoute element={<Report />} />} />
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/apply" element={<ProtectedRoute element={<Apply />} />} />
      <Route path="/configuration" element={<ProtectedRoute element={<Information />} />} />
      {/* <Route path="/menu" element={<SpvLogin />} />
      <Route path="/history-log" element={<Report />} />
      <Route path="/home" element={<Home />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/configuration" element={<Information />} /> */}
    </ReactRoutes>
  );
};

export default Routes;
