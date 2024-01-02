import React from "react";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import Apply from "../pages/Apply/Apply";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import StatusPayment from "../pages/StatusPayment/StatusPayment";
import Information from "../pages/Information/Information";

const isAuthenticated = () => {
  const jwtToken = localStorage.getItem("JwtToken");

  if (!jwtToken) {
    // Token is not present, consider the user as not authenticated
    return false;
  }

  const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
  const expirationTime = decodedToken.exp * 1000;
  const now = Date.now();
  const isExpired = now > expirationTime;
  const date = new Date(expirationTime);
  console.log(date.toString());

  if (isExpired) {
    // Clear localStorage if token is expired
    localStorage.removeItem("user");
    localStorage.removeItem("JwtToken");
    localStorage.removeItem("cardNumberPetugas");
    localStorage.removeItem("key");
    localStorage.removeItem("token");
  }

  return !isExpired;
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
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/apply" element={<ProtectedRoute element={<Apply />} />} />
      <Route
        path="/information"
        element={<ProtectedRoute element={<Information />} />}
      />
      <Route
        path="/status-payment"
        element={<ProtectedRoute element={<StatusPayment />} />}
      />
    </ReactRoutes>
  );
};

export default Routes;
