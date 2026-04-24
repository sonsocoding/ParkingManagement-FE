import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { bookings, formatDateTime, formatCurrency } from '../../data/sampleData';
import { Search, Filter, Edit2, ShieldAlert } from 'lucide-react';

export default function AllBookings() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(b => 
    b.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TopBar title="All Bookings" subtitle="System-wide booking registry" />
      <div className="page-content">
        <div className="card">
          <div className="dashboard-card-header" style={{ marginBottom: '16px' }}>
            <div className="lots-search" style={{ margin: 0, width: '300px' }}>
              <Search size={16} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by user or plate..." 
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
                  <th>User & Vehicle</th>
                  <th>Location</th>
                  <th>Time Frame</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user.fullName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.vehicle.plateNumber} ({b.vehicle.vehicleType})</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.parkingLot.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Slot: {b.slot.slotNumber}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{formatDateTime(b.startTime)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>to {formatDateTime(b.endTime)}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(b.estimatedCost)}</td>
                    <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" title="Change Status"><ShieldAlert size={16} /></button>
                      <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
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
