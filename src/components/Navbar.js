import React from 'react';
import { LogOut } from 'lucide-react';
import "../assets/NavBar.css";

const NavBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16 flex items-center px-4">
      {/* Left Side (Logo Placeholder) */}
      <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-blue-200 rounded-full flex items-center justify-center">
        {/* Logo SVG or Icon */}
      </div>

      {/* Center Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-lg font-bold text-gray-800">UDD.Co</h1>
        <p className="text-xs text-gray-500">E-Commerced Customize Clothing System</p>
      </div>

      {/* Right Side (Logout Button) */}
      <div className="ml-auto">
        <button className="bg-orange-600 text-white px-2 py-1 text-xs rounded-md flex items-center hover:bg-orange-700 transition-colors">
          <LogOut className="mr-1" size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;