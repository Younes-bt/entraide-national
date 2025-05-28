import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CenterDashboard from './CenterDashboard';
import CenterStudentsPage from './CenterStudentsPage';
import CenterAddNewStudent from './components/CenterAddNewStudent';
import CenterUpdateStudent from './components/CenterUpdateStudent';
import CenterStudentDetailsPage from './CenterStudentDetailsPage';
import CenterInfoPage from './CenterInfoPage';
import CenterRoomsPage from './CenterRoomsPage';
import CenterAddRoomPage from './CenterAddRoomPage';
import CenterRoomDetailsPage from './CenterRoomDetailsPage';
import CenterEditRoomPage from './CenterEditRoomPage';
import CenterEquipmentPage from './CenterEquipmentPage';
import CenterAddEquipmentPage from './CenterAddEquipmentPage';
import CenterGroupsPage from './CenterGroupsPage';
import CenterAddGroupPage from './CenterAddGroupPage';
import CenterTrainersPage from './CenterTrainersPage';
import CenterAddNewTrainer from './CenterAddNewTrainer';

const CenterRoutes = () => {
  return (
    <Routes>
      <Route index element={<CenterDashboard />} />
      <Route path="dashboard" element={<CenterDashboard />} />
      <Route path="students" element={<CenterStudentsPage />} />
      <Route path="students/new" element={<CenterAddNewStudent />} />
      <Route path="students/edit/:studentId" element={<CenterUpdateStudent />} />
      <Route path="students/:studentId" element={<CenterStudentDetailsPage />} />
      <Route path="info" element={<CenterInfoPage />} />
      <Route path="rooms/add" element={<CenterAddRoomPage />} />
      <Route path="rooms/:roomId/edit" element={<CenterEditRoomPage />} />
      <Route path="rooms/:roomId" element={<CenterRoomDetailsPage />} />
      <Route path="rooms" element={<CenterRoomsPage />} />
      <Route path="equipment/add" element={<CenterAddEquipmentPage />} />
      <Route path="equipment" element={<CenterEquipmentPage />} />
      <Route path="groups/add" element={<CenterAddGroupPage />} />
      <Route path="groups" element={<CenterGroupsPage />} />
      <Route path="trainers" element={<CenterTrainersPage />} />
      <Route path="trainers/new" element={<CenterAddNewTrainer />} />
      {/* Add other center-specific routes here later */}
      <Route path="*" element={<div>Center Page Not Found</div>} />
    </Routes>
  );
};

export default CenterRoutes;