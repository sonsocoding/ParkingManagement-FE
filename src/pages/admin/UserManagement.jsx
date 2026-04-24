import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { users, formatDateTime } from '../../data/sampleData';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TopBar 
        title="User Management" 
        subtitle="Manage system users, roles, and access"
        actions={<button className="btn btn-primary btn-sm"><Plus size={16} /> Add User</button>}
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
                      <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                      <button className="btn-icon" title="Delete" style={{ color: 'var(--color-occupied)' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
