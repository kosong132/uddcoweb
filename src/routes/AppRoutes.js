import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ForgotPassword";
// import BaseLayout from "../layouts/BaseLayout"; // Ensure correct path
import Dashboard from "../pages/Dashboard"; 
import Product from "../pages/Product"; 
import Order from "../pages/Order"; 
import Chat from "../pages/Chat"; 
import Profile from "../pages/Profile"; 
import Layout from "../components/Layout";
import Delivery from "../pages/Delivery";
import ResetNewPassword from "../pages/ResetNewPassword";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route: Redirect to Login Page */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-new-password" element={<ResetNewPassword />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="product" element={<Product />} />
        <Route path="order" element={<Order />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        {/* <Route path="delivery" element={<Delivery />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
