import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

const ResetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState(""); // Declare token state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");

    if (tokenParam) {
      setToken(tokenParam); // Set the token from the URL
    } else {
      alert("Invalid or missing token!");
      navigate("/login");
    }
  }, [location, navigate]);

  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/reset-password", null, {
        params: {
          token,
          newPassword,
        },
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch (error) {
      alert("Failed to reset password. Try again.");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4 text-center">Set New Password</h2>

      <div className="mb-4">
        <label className="block text-sm">New Password</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaLock className="text-gray-300 mr-2" />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>

      <button
        onClick={handleResetPassword}
        className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded shadow-md mt-4 hover:bg-gray-200"
      >
        Reset Password
      </button>
    </AuthLayout>
  );
};

export default ResetNewPassword;
