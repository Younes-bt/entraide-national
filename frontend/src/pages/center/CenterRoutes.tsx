import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CenterDashboard from './CenterDashboard';
import CenterStudentsPage from './CenterStudentsPage';

const CenterRoutes = () => {
  return (
    <Routes>
      <Route index element={<CenterDashboard />} />
      <Route path="dashboard" element={<CenterDashboard />} />
      <Route path="students" element={<CenterStudentsPage />} />
      {/* Add other center-specific routes here later */}
      <Route path="*" element={<div>Center Page Not Found</div>} />
    </Routes>
  );
};

export default CenterRoutes; 