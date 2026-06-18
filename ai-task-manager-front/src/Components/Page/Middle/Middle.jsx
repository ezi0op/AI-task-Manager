import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashBoard from '../DashBoard/DashBoard';
import MyTask from '../Tasks/MyTask';
import AddTask from '../Tasks/AddTask';
import TaskOverView from '../Tasks/TaskOverView';
import AiGenTask from '../AI-Auto/AiGenTask';
import AiSSUG from '../AI-Auto/AiSSUG';
import AiSmart from '../AI-Auto/AiSmart';
import AdminUser from '../../Admin/AdminDashBoard/AdminUser';
import AdminTask from '../../Admin/AdminDashBoard/AdminTask';
import AdminAuditTrail from '../../Admin/AdminDashBoard/AdminAuditTrail';
import AdminAnalytics from '../../Admin/AdminDashBoard/AdminAnalytics';
import Profile from '../Login/Profile';
import ChangePass from '../Login/ChangePass';
import { isGuestUser } from '../../../App';

const ProtectedRoute = ({ children }) => {
  if (isGuestUser()) {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('isGuest');
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('workspaceMode');
    // Hard reload to reset all React state fully
    window.location.href = '/';
  }, []);
  return null;
};

const Middle = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashBoard />} />

        {/* Protected User Routes */}
        <Route path="/tasks" element={<ProtectedRoute><MyTask /></ProtectedRoute>} />
        <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskOverView /></ProtectedRoute>} />
        <Route path="/ai-generate" element={<ProtectedRoute><AiGenTask /></ProtectedRoute>} />
        <Route path="/ai-suggestions" element={<ProtectedRoute><AiSSUG /></ProtectedRoute>} />
        <Route path="/ai-smart" element={<ProtectedRoute><AiSmart /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePass /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin Routes */}
        <Route path="/admin/users" element={<AdminRoute><AdminUser /></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><AdminTask /></AdminRoute>} />
        <Route path="/admin/audit-trail" element={<AdminRoute><AdminAuditTrail /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      </Routes>
    </div>
  );
};

export default Middle;