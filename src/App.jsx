import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import BrowseLots from './pages/user/BrowseLots';
import LotDetail from './pages/user/LotDetail';
import MyBookings from './pages/user/MyBookings';
import MyVehicles from './pages/user/MyVehicles';
import ParkingHistory from './pages/user/ParkingHistory';
import MyPayments from './pages/user/MyPayments';
import MonthlyPasses from './pages/user/MonthlyPasses';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

import UserManagement from './pages/admin/UserManagement';
import LotManagement from './pages/admin/LotManagement';
import AllBookings from './pages/admin/AllBookings';
import AllPayments from './pages/admin/AllPayments';
import StaffMonitoring from './pages/admin/StaffMonitoring';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}>
        {/* Redirect root based on role */}
        <Route index element={<Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} />} />
        
        {/* User Routes */}
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="parking-lots" element={<BrowseLots />} />
        <Route path="parking-lots/:id" element={<LotDetail />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="my-vehicles" element={<MyVehicles />} />
        <Route path="parking-history" element={<ParkingHistory />} />
        <Route path="my-payments" element={<MyPayments />} />
        <Route path="monthly-passes" element={<MonthlyPasses />} />

        {/* Admin Routes */}
        <Route path="admin">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="lots" element={<LotManagement />} />
          <Route path="bookings" element={<AllBookings />} />
          <Route path="payments" element={<AllPayments />} />
          <Route path="monitoring" element={<StaffMonitoring />} />
        </Route>
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
