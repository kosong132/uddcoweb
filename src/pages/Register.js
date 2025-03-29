import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4 text-center">Register Page</h2>

      <div className="mb-4">
        <label className="block text-sm">Username</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaUser className="text-gray-300 mr-2" />
          <input type="text" placeholder="Choose a username" className="w-full bg-transparent focus:outline-none placeholder-gray-300" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaEnvelope className="text-gray-300 mr-2" />
          <input type="email" placeholder="Enter your email" className="w-full bg-transparent focus:outline-none placeholder-gray-300" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Password</label>
        <div className="flex items-center border-b border-gray-300 py-2">
          <FaLock className="text-gray-300 mr-2" />
          <input type="password" placeholder="Create a password" className="w-full bg-transparent focus:outline-none placeholder-gray-300" />
        </div>
      </div>

      <button className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded shadow-md mt-4 hover:bg-gray-200">
        Register
      </button>

      <div className="text-center mt-4">
        <Link to="/login" className="text-white text-sm underline">Already have an account? Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
