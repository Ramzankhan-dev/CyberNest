import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Signup       from './pages/Signup';
import Login        from './pages/cybernest-login';
import Dashboard    from './pages/cybernest-dashboard';
import Devices      from './pages/Devices-v2';
import DeviceDetail from './pages/DeviceDetail-v2';
import Commands     from './pages/Commands';
import Policies     from './pages/Policies';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* "/" pe aao toh login pe bhejo */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/cybernest-dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }/>
        <Route path="/devices" element={
          <ProtectedRoute><Devices /></ProtectedRoute>
        }/>
        <Route path="/devices/:id" element={
          <ProtectedRoute><DeviceDetail /></ProtectedRoute>
        }/>
        <Route path="/commands" element={
          <ProtectedRoute><Commands /></ProtectedRoute>
        }/>
        <Route path="/policies" element={
          <ProtectedRoute><Policies /></ProtectedRoute>
        }/>

        {/* Koi bhi unknown route — login pe bhejo */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;