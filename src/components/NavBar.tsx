import React from 'react';
import { LogOut } from 'lucide-react';

const NavBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-16 flex items-center">
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-blue-200 rounded-full flex items-center justify-center mr-3">
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white">
              <path d="M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2z" />
              <line x1="4" y1="4" x2="4" y2="4" />
            </svg> */}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">UDD.Co</h1>
            <p className="text-xs text-gray-500">E-Commerced Customize Clothing System</p>
          </div>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-orange-700 transition-colors">
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;