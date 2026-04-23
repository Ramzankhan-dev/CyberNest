// src/Layout.jsx

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 bg-slate-950">
        {children}
      </div>
    </div>
  );
}
