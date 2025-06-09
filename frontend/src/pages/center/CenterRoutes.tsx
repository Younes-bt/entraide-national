import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CenterDashboard from './CenterDashboard';
import CenterInfoPage from './CenterInfoPage';
import CenterRoomsPage from './CenterRoomsPage';
import CenterAddRoomPage from './CenterAddRoomPage';
import CenterRoomDetailsPage from './CenterRoomDetailsPage';
import CenterEditRoomPage from './CenterEditRoomPage';
import CenterEquipmentPage from './CenterEquipmentPage';
import CenterAddEquipmentPage from './CenterAddEquipmentPage';
import CenterGroupsPage from './CenterGroupsPage';
import CenterAddGroupPage from './CenterAddGroupPage';
import CenterStudentsPage from './CenterStudentsPage';
import CenterAddNewStudent from './components/CenterAddNewStudent';
import CenterUpdateStudent from './components/CenterUpdateStudent';
import CenterStudentDetailsPage from './CenterStudentDetailsPage';
import CenterTrainersPage from './CenterTrainersPage';
import CenterAddNewTrainer from './CenterAddNewTrainer';
import CenterEditTrainer from './components/CenterEditTrainer';
import CenterSchedulesPage from './CenterSchedulesPage';

const CenterRoutes = () => {
  return (
    <Routes>
      <Route index element={<CenterDashboard />} />
      <Route path="dashboard" element={<CenterDashboard />} />
      <Route path="info" element={<CenterInfoPage />} />
      <Route path="rooms" element={<CenterRoomsPage />} />
      <Route path="rooms/add" element={<CenterAddRoomPage />} />
      <Route path="rooms/:roomId" element={<CenterRoomDetailsPage />} />
      <Route path="rooms/:roomId/edit" element={<CenterEditRoomPage />} />
      <Route path="equipment" element={<CenterEquipmentPage />} />
      <Route path="equipment/add" element={<CenterAddEquipmentPage />} />
      <Route path="groups" element={<CenterGroupsPage />} />
      <Route path="groups/add" element={<CenterAddGroupPage />} />
      <Route path="students" element={<CenterStudentsPage />} />
      <Route path="students/add" element={<CenterAddNewStudent />} />
      <Route path="students/:studentId/edit" element={<CenterUpdateStudent />} />
      <Route path="students/:studentId" element={<CenterStudentDetailsPage />} />
      <Route path="trainers" element={<CenterTrainersPage />} />
      <Route path="trainers/add" element={<CenterAddNewTrainer />} />
      <Route path="trainers/:trainerId/edit" element={<CenterEditTrainer />} />
      <Route path="schedules" element={<CenterSchedulesPage />} />
      <Route path="*" element={<div>Center Page Not Found</div>} />
    </Routes>
  );
};

export default CenterRoutes;