import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/portfolio';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : mon portfolio */}
        <Route path="/" element={<Portfolio />} />

        {/* Routes privées : L'espace d'administration */}
        <Route path="/Admin" element={<AdminLogin />} />
        <Route path="/Admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}