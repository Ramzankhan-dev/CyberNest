import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";

// PAGES - Exact matching with your folder structure
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import DeviceDetail from "./pages/DeviceDetail";
import Policies from "./pages/Policies";
import Commands from "./pages/Commands";
import Admins from "./pages/Admins";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex h-screen w-full bg-slate-950 text-slate-50 font-sans overflow-hidden">
                {/* GLOBAL BACKGROUND GRID */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent),
                                        linear-gradient(90deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent)`,
                      backgroundSize: '60px 60px',
                    }}
                  />
                </div>

                {/* LEFT SIDEBAR (File ka naam Navbar.jsx hai) */}
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* MAIN CONTENT AREA */}
                <main className={`flex-1 flex flex-col relative z-10 h-screen overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-20'}`}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/device/:id" element={<DeviceDetail />} />
                    <Route path="/policies" element={<Policies />} />
                    <Route path="/commands" element={<Commands />} />
                    <Route path="/admins" element={<Admins />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}