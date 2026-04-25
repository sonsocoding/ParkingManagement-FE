import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllUsers } from '../../hooks/useApi';
import { userService } from '../../api/index';
import { formatDateTime } from '../../utils/formatters';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const { users, loading, error } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await userService.deleteUser(id);
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to delete user.');
    }
  };

  return (
    <>
      <TopBar
        title="User Management"
        subtitle="Manage system users, roles, and access"
      />
      <div className="page-content">
        <div className="card">
          <div className="dashboard-card-header" style={{ marginBottom: '16px' }}>
            <div className="lots-search" style={{ margin: 0, width: '300px' }}>
              <Search size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <button className="btn btn-secondary btn-sm"><Filter size={16} /> Filter</button>
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading users...</p>}
          {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="sidebar-user-avatar">{u.fullName.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{u.phone}</div>
                    </td>
                    <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>{formatDateTime(u.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" title="Delete" style={{ color: 'var(--color-occupied)' }} onClick={() => handleDelete(u.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredUsers.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
