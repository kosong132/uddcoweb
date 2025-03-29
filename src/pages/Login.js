import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    // Perform authentication logic here (e.g., checking credentials)
    // After successful login, navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4 text-center">Login Page</h2>

      <div className="mb-4">
        <label className="block text-sm">Username</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaUser className="text-gray-300 mr-2" />
          <input 
            type="text" 
            placeholder="Type your username" 
            className="w-full bg-transparent focus:outline-none placeholder-gray-300" 
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Password</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaLock className="text-gray-300 mr-2" />
          <input 
            type="password" 
            placeholder="Type your password" 
            className="w-full bg-transparent focus:outline-none placeholder-gray-300" 
          />
        </div>
      </div>

      <button 
        onClick={handleLogin} // Call handleLogin on click
        className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded shadow-md mt-4 hover:bg-gray-200"
      >
        Login
      </button>

      <div className="text-center mt-4">
        <Link to="/reset-password" className="text-white text-sm underline">Forgot Password?</Link>
      </div>
      <div className="text-center mt-4">
        <Link to="/register" className="text-white text-sm underline">Register Account</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
