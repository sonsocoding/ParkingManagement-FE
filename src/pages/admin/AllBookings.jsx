import { useMemo, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllBookings } from '../../hooks/useApi';
import { bookingService } from '../../api/index';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { Search, ShieldAlert } from 'lucide-react';
import '../../styles/pages/user/MyPayments.css';

const ALLOWED_TRANSITIONS = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AllBookings() {
  const { bookings, loading, error } = useAllBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'timeFrame', direction: 'desc' });

  const filteredBookings = bookings.filter((booking) =>
    (booking.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    || (booking.vehicle?.plateNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortValue = (booking, key) => {
    switch (key) {
      case 'userVehicle':
        return `${booking.user?.fullName || ''} ${booking.vehicle?.plateNumber || ''} ${booking.vehicle?.vehicleType || ''}`.toLowerCase();
      case 'location':
        return `${booking.parkingLot?.name || ''} ${booking.slot?.slotNumber || booking.parkingSlotId || ''}`.toLowerCase();
      case 'timeFrame':
        return booking.startTime ? new Date(booking.startTime).getTime() : 0;
      case 'cost':
        return Number(booking.estimatedCost) || 0;
      case 'status':
        return (booking.status || '').toLowerCase();
      default:
        return 0;
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      const valueA = getSortValue(a, sortConfig.key);
      const valueB = getSortValue(b, sortConfig.key);
      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = valueA - valueB;
      }

      if (comparison !== 0) {
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const fallbackA = a.startTime ? new Date(a.startTime).getTime() : 0;
      const fallbackB = b.startTime ? new Date(b.startTime).getTime() : 0;
      if (fallbackB !== fallbackA) return fallbackB - fallbackA;

      return (b.id || '').localeCompare(a.id || '');
    });
  }, [filteredBookings, sortConfig]);

  const renderSortButton = (label, key) => {
    const isActive = sortConfig.key === key;
    const arrow = isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕';

    return (
      <button
        type="button"
        className={`payments-sort-button ${isActive ? 'active' : ''}`}
        onClick={() => handleSort(key)}
      >
        <span>{label}</span>
        <span className="payments-sort-arrow" aria-hidden="true">{arrow}</span>
      </button>
    );
  };

  const handleStatusChange = async (bookingId, next) => {
    if (!window.confirm(`Change status to ${next}?`)) return;
    setUpdatingId(bookingId);
    try {
      await bookingService.adminUpdateBookingStatus(bookingId, next);
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to update booking.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatStatusLabel = (status) => status === 'PENDING_PAYMENT' ? 'Pending Payment' : status;

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
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading bookings...</p>}
          {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{renderSortButton('User & Vehicle', 'userVehicle')}</th>
                  <th>{renderSortButton('Location', 'location')}</th>
                  <th>{renderSortButton('Time Frame', 'timeFrame')}</th>
                  <th>{renderSortButton('Cost', 'cost')}</th>
                  <th>{renderSortButton('Status', 'status')}</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map(b => (
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
                    <td><span className={`badge badge-${b.status.toLowerCase()}`}>{formatStatusLabel(b.status)}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {ALLOWED_TRANSITIONS[b.status].length === 0 && (
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>No actions</span>
                        )}
                        {ALLOWED_TRANSITIONS[b.status].map((nextStatus) => (
                          <button
                            key={nextStatus}
                            className="btn-icon"
                            title={`Set ${nextStatus}`}
                            disabled={updatingId === b.id}
                            onClick={() => handleStatusChange(b.id, nextStatus)}
                          >
                            <ShieldAlert size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && sortedBookings.length === 0 && (
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
