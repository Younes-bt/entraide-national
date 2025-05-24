import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CenterDashboard from './CenterDashboard';
import CenterStudentsPage from './CenterStudentsPage';
import CenterInfoPage from './CenterInfoPage';
import CenterRoomsPage from './CenterRoomsPage';
import CenterAddRoomPage from './CenterAddRoomPage';
import CenterRoomDetailsPage from './CenterRoomDetailsPage';
import CenterEditRoomPage from './CenterEditRoomPage';
import CenterEquipmentPage from './CenterEquipmentPage';
import CenterAddEquipmentPage from './CenterAddEquipmentPage';

const CenterRoutes = () => {
  return (
    <Routes>
      <Route index element={<CenterDashboard />} />
      <Route path="dashboard" element={<CenterDashboard />} />
      <Route path="students" element={<CenterStudentsPage />} />
      <Route path="info" element={<CenterInfoPage />} />
      <Route path="rooms/add" element={<CenterAddRoomPage />} />
      <Route path="rooms/:roomId/edit" element={<CenterEditRoomPage />} />
      <Route path="rooms/:roomId" element={<CenterRoomDetailsPage />} />
      <Route path="rooms" element={<CenterRoomsPage />} />
      <Route path="equipment/add" element={<CenterAddEquipmentPage />} />
      <Route path="equipment" element={<CenterEquipmentPage />} />
      {/* Add other center-specific routes here later */}
      <Route path="*" element={<div>Center Page Not Found</div>} />
    </Routes>
  );
};

export default CenterRoutes;