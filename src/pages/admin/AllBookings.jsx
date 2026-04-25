import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllBookings } from '../../hooks/useApi';
import { bookingService } from '../../api/index';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { Search, Filter, ShieldAlert } from 'lucide-react';

const STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AllBookings() {
  const { bookings, loading, error } = useAllBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredBookings = bookings.filter(b =>
    (b.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.vehicle?.plateNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (bookingId, currentStatus) => {
    const next = STATUSES[(STATUSES.indexOf(currentStatus) + 1) % STATUSES.length];
    if (!window.confirm(`Change status to ${next}?`)) return;
    setUpdatingId(bookingId);
    try {
      await bookingService.adminUpdateBooking(bookingId, { status: next });
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to update booking.');
    } finally {
      setUpdatingId(null);
    }
  };

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

          {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading bookings...</p>}
          {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

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
                      <div style={{ fontWeight: 600 }}>{b.user?.fullName || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {b.vehicle?.plateNumber} ({b.vehicle?.vehicleType})
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.parkingLot?.name || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Slot: {b.slot?.slotNumber || b.parkingSlotId}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{formatDateTime(b.startTime)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>to {formatDateTime(b.endTime)}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(b.estimatedCost)}</td>
                    <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="Cycle Status"
                        disabled={updatingId === b.id}
                        onClick={() => handleStatusChange(b.id, b.status)}
                      >
                        <ShieldAlert size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredBookings.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
