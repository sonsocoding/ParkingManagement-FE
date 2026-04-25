import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Car, MapPin, CalendarCheck, History, CreditCard,
  Ticket, Users, Building2, ParkingSquare, ClipboardList, Monitor,
  LogOut, ChevronLeft, ChevronRight, ParkingCircle, Plus
} from 'lucide-react';
import '../../styles/components/layout/Sidebar.css';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/parking-lots', icon: MapPin, label: 'Browse Lots' },
  { to: '/my-bookings', icon: CalendarCheck, label: 'My Bookings' },
  { to: '/my-vehicles', icon: Car, label: 'My Vehicles' },
  { to: '/parking-history', icon: History, label: 'Parking History' },
  { to: '/my-payments', icon: CreditCard, label: 'My Payments' },
  { to: '/monthly-passes', icon: Ticket, label: 'Monthly Passes' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/lots', icon: Building2, label: 'Lot Management' },
  { to: '/admin/bookings', icon: CalendarCheck, label: 'All Bookings' },
  { to: '/admin/payments', icon: CreditCard, label: 'All Payments' },
  { to: '/admin/monitoring', icon: Monitor, label: 'Staff Monitoring' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'ADMIN' ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ParkingCircle size={28} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">Smart Parking</span>
          </div>
        )}
      </div>



      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">
          {!collapsed && (user?.role === 'USER' ? 'Menu' : 'Administration')}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        {!collapsed ? (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.fullName}</span>
              <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
            </div>
          </div>
        ) : (
          <div className="sidebar-user-avatar" title={user?.fullName}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        )}
        <button className="sidebar-logout" onClick={handleLogout} title="Log out">
          <LogOut size={18} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
