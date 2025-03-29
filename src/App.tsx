// src/App.js
import React from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;

// // App.js - Main App Component
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';
// import Settings from './pages/Settings';
// import './App.css';

// function App() {
//     return (
//         <Router>
//             <div className="flex h-screen">
//                 <Sidebar />
//                 <div className="flex-1 flex flex-col">
//                     <Navbar />
//                     <div className="p-6">
//                         <Routes>
//                             <Route path="/" element={<Dashboard />} />
//                             <Route path="/settings" element={<Settings />} />
//                         </Routes>
//                     </div>
//                 </div>
//             </div>
//         </Router>
//     );
// }

// export default App;
// //connect react to spring boot