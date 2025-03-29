// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';
import Sidebar from '../components/Sidebar.tsx';

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