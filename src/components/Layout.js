
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import NavBar from "../components/Navbar";

// const Layout = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       <div className="flex flex-col flex-grow">
//         {/* Navbar */}
//         <NavBar />

//         {/* Main Content Area */}
//         <main className="p-6 flex-grow bg-white shadow-md rounded-lg m-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="p-4 mt-16 ml-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;