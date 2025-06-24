import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSendResetLink = async () => {
    try {
      const response = await axios.post("https://uddco.onrender.com/auth/request-reset-password", null, {
        params: { email },
      });

      alert(response.data); // Show success message
    } catch (error) {
      console.error("Failed to send reset link:", error.response?.data || error.message);
      alert("Failed to send reset link. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>

      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaEnvelope className="text-gray-300 mr-2" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>

      <button
        onClick={handleSendResetLink}
        className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded shadow-md mt-4 hover:bg-gray-200"
      >
        Send Reset Link
      </button>

      <div className="text-center mt-4">
        <Link to="/login" className="text-white text-sm underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
