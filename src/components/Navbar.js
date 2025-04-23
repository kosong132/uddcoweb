import React from 'react';
import { LogOut } from 'lucide-react';
import "../assets/NavBar.css";
import logo from '../assets/img/logo.png';

// Then use:
<img src={logo} alt="Logo" className="w-full h-full object-cover" />
const NavBar = () => {
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Clear any session/token data if needed
      localStorage.clear(); // or remove specific keys like: localStorage.removeItem('token')
      
      // Redirect to login page or home
      window.location.href = "/login"; // Adjust this to your login route
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16 flex items-center px-4">
      {/* Left Side (Logo Placeholder) */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
        { <img src={logo} alt="Logo" className="w-full h-full object-cover" />}
      </div>

      {/* Center Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-lg font-bold text-gray-800">UDD.Co</h1>
        <p className="text-xs text-gray-500">E-Commerced Customize Clothing System</p>
      </div>

      {/* Right Side (Logout Button) */}
      <div className="ml-auto">
        <button className="bg-orange-600 text-white px-2 py-1 text-xs rounded-md flex items-center hover:bg-orange-700 transition-colors" onClick={handleLogout} >
          <LogOut className="mr-1" size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;