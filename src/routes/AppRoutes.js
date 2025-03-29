import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import BaseLayout from "../layouts/BaseLayout"; // Ensure correct path
import Dashboard from "../pages/Dashboard"; 
import Product from "../pages/Product"; 
import Order from "../pages/Order.tsx"; 
import Chat from "../pages/Chat"; 
import Profile from "../pages/Profile"; 
const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route: Redirect to Login Page */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<BaseLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="product" element={<Product />} />
        <Route path="order" element={<Order />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
