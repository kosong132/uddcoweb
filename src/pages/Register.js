import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("https://uddco.onrender.com/auth/register", {
        username,
        email,
        phoneNumber,
        password,
      });
      console.log({ username, email, phoneNumber, password });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4 text-center">Register Page</h2>

      <div className="mb-4">
        <label className="block text-sm">Username</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaUser className="text-gray-300 mr-2" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="w-full bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaEnvelope className="text-gray-300 mr-2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Phone Number</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaPhone className="text-gray-300 mr-2" />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded shadow-md mt-4 hover:bg-gray-200"
      >
        Register
      </button>

      <div className="text-center mt-4">
        <Link to="/login" className="text-white text-sm underline">
          Already have an account? Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
