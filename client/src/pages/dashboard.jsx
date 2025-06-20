import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Nabvar from '@/components/dashboard/nabvar.jsx';

function Dashboard() {
  return (
    <>
      <header className="w-full h-12 flex items-center justify-between px-4 bg-gray-500 text-white">
        <h1 className=" font-bold">Daz Store</h1>
        <Nabvar />
      </header>
      <main>
      <Outlet />
      </main>
    </>
  );
}

export default Dashboard;