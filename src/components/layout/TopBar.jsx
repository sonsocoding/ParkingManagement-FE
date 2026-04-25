import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Settings } from 'lucide-react';
import '../../styles/components/layout/TopBar.css';

export default function TopBar({ title, subtitle, actions }) {
  const { user, switchRole } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        {/* Role Switcher (Dev Tool) */}
        <div className="topbar-role-switcher">
          <select
            className="form-select topbar-role-select"
            value={user?.role}
            onChange={(e) => switchRole(e.target.value)}
          >
            <option value="USER">👤 USER</option>
            <option value="ADMIN">🔑 ADMIN</option>
          </select>
        </div>

        {actions && <div className="topbar-actions">{actions}</div>}

        <button className="btn-icon" title="Notifications">
          <div className="topbar-notification">
            <Bell size={20} />
            <span className="topbar-notification-dot" />
          </div>
        </button>

        <div className="topbar-avatar">
          {user?.fullName?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
