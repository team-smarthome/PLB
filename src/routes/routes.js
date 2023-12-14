import React from "react";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import Apply from "../pages/Apply/Apply";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";

const isAuthenticated = () => {

  return localStorage.getItem('JwtToken') !== null;
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
      <Route path="/apply" element={<Apply />} />
    </ReactRoutes>
  );
};

export default Routes;
