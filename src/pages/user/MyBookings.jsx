import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { CalendarCheck, Clock, Car, ParkingSquare, X } from 'lucide-react';
import { useMyBookings } from '../../hooks/useApi';
import { bookingService, recordService } from '../../api/index';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import '../../styles/pages/user/MyBookings.css';

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { bookings, loading, error } = useMyBookings();
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = statusFilter === 'ALL' ? bookings : bookings.filter(b => b.status === statusFilter);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      window.location.reload(); // Refresh to get updated status
    } catch (err) {
      alert(err?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (booking) => {
    setActionLoading(booking.id);
    try {
      await recordService.checkIn({
        vehicleId: booking.vehicleId,
        parkingSlotId: booking.parkingSlotId,
        parkingLotId: booking.parkingLotId,
        bookingId: booking.id,
      });
      alert('Checked in successfully!');
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Check-in failed.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <TopBar title="My Bookings" subtitle="View and manage your parking reservations" />
      <div className="page-content">
        <div className="bookings-filters">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} className={`btn ${statusFilter === s ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`} onClick={() => setStatusFilter(s)}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading && <div className="empty-state"><p>Loading bookings...</p></div>}
        {error && <div className="empty-state"><p style={{ color: 'var(--color-occupied)' }}>Error: {error}</p></div>}

        <div className="bookings-list">
          {filtered.map((b) => (
            <div key={b.id} className="booking-card card">
              <div className="booking-card-top">
                <div className="booking-card-lot">
                  <h3>{b.parkingLot?.name || 'Unknown Lot'}</h3>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div className="booking-card-cost">
                  <span className="booking-cost-label">Est. Cost</span>
                  <span className="booking-cost-value">{formatCurrency(b.estimatedCost)}</span>
                </div>
              </div>

              <div className="booking-card-details">
                <div className="booking-detail">
                  <Car size={16} />
                  <span>{b.vehicle?.plateNumber}</span>
                  <span className={`badge badge-${b.vehicle?.vehicleType?.toLowerCase()}`}>{b.vehicle?.vehicleType}</span>
                </div>
                <div className="booking-detail">
                  <ParkingSquare size={16} />
                  <span>Slot {b.slot?.slotNumber || b.parkingSlotId}</span>
                </div>
                <div className="booking-detail">
                  <Clock size={16} />
                  <span>{formatDateTime(b.startTime)} → {formatDateTime(b.endTime)}</span>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="booking-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCheckIn(b)}
                    disabled={actionLoading === b.id}
                  >
                    {actionLoading === b.id ? '...' : 'Check In'}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-occupied)' }}
                    onClick={() => handleCancel(b.id)}
                    disabled={actionLoading === b.id}
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <CalendarCheck size={48} />
              <h3>No bookings found</h3>
              <p>Your {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} bookings will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
