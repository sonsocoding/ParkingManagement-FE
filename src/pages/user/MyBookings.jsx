import { useEffect, useMemo, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { CalendarCheck, Clock, Car, Bike, ParkingSquare, X } from 'lucide-react';
import { useMyBookings, useMyRecords } from '../../hooks/useApi';
import { bookingService, recordService } from '../../api/index';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { getVehicleUsageMessage } from '../../utils/vehicleUsageMessages';
import '../../styles/pages/user/MyBookings.css';

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { bookings, loading, error } = useMyBookings();
  const { parkingRecords } = useMyRecords();
  const [actionLoading, setActionLoading] = useState(null);
  const [bookingItems, setBookingItems] = useState([]);
  const [actionMessageByBookingId, setActionMessageByBookingId] = useState({});
  const [recentlyCheckedInBookingIds, setRecentlyCheckedInBookingIds] = useState([]);

  useEffect(() => {
    setBookingItems(bookings);
  }, [bookings]);

  const activeBookingRecordIds = useMemo(
    () =>
      new Set(
        parkingRecords
          .filter((record) => record.status === 'CHECKED_IN' && record.bookingId)
          .map((record) => record.bookingId)
      ),
    [parkingRecords]
  );

  const checkedInBookingIds = useMemo(
    () => new Set([...activeBookingRecordIds, ...recentlyCheckedInBookingIds]),
    [activeBookingRecordIds, recentlyCheckedInBookingIds]
  );

  const filtered = statusFilter === 'ALL'
    ? bookingItems
    : bookingItems.filter(b => b.status === statusFilter);
  const formatStatusLabel = (status) => {
    if (status === 'PENDING_PAYMENT') return 'Pending Payment';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatPaymentMethodLabel = (method) => {
    if (method === 'VNPAY') return 'VNPay';
    if (method === 'MONTHLY_PASS') return 'Monthly Pass';
    return 'Cash on exit';
  };

  const VehicleIcon = ({ vehicleType }) =>
    vehicleType === 'MOTORBIKE' ? <Bike size={16} /> : <Car size={16} />;

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(bookingId);
    setActionMessageByBookingId((current) => ({ ...current, [bookingId]: null }));
    try {
      await bookingService.cancelBooking(bookingId);
      setBookingItems((current) =>
        current.map((booking) => (
          booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
        ))
      );
      setActionMessageByBookingId((current) => ({
        ...current,
        [bookingId]: { type: 'success', text: 'Booking cancelled successfully.' },
      }));
    } catch (err) {
      setActionMessageByBookingId((current) => ({
        ...current,
        [bookingId]: {
          type: 'error',
          text: getVehicleUsageMessage(err?.message, 'Failed to cancel booking.'),
        },
      }));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (booking) => {
    setActionLoading(booking.id);
    setActionMessageByBookingId((current) => ({ ...current, [booking.id]: null }));
    try {
      await recordService.checkIn({
        vehicleId: booking.vehicleId,
        parkingSlotId: booking.parkingSlotId,
        parkingLotId: booking.parkingLotId,
        bookingId: booking.id,
      });
      setActionMessageByBookingId((current) => ({
        ...current,
        [booking.id]: {
          type: 'success',
          text: 'Checked in successfully. This vehicle is now in an active parking session.',
        },
      }));
      setRecentlyCheckedInBookingIds((current) => (
        current.includes(booking.id) ? current : [...current, booking.id]
      ));
    } catch (err) {
      setActionMessageByBookingId((current) => ({
        ...current,
        [booking.id]: {
          type: 'error',
          text: getVehicleUsageMessage(err?.message, 'Check-in failed.'),
        },
      }));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <TopBar title="My Bookings" subtitle="View and manage your parking reservations" />
      <div className="page-content">
        <div className="bookings-filters">
          {['ALL', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} className={`btn ${statusFilter === s ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`} onClick={() => setStatusFilter(s)}>
              {s === 'ALL' ? 'All' : formatStatusLabel(s)}
            </button>
          ))}
        </div>

        {loading && <div className="empty-state"><p>Loading bookings...</p></div>}
        {error && <div className="empty-state"><p style={{ color: 'var(--color-occupied)' }}>Error: {error}</p></div>}

        <div className="bookings-list">
          {filtered.map((b) => (
            <div key={b.id} className="booking-card card">
              {actionMessageByBookingId[b.id] && (
                <div
                  className={`booking-inline-message booking-inline-message-${actionMessageByBookingId[b.id].type}`}
                >
                  {actionMessageByBookingId[b.id].text}
                </div>
              )}
              <div className="booking-card-top">
                <div className="booking-card-lot">
                  <h3>{b.parkingLot?.name || 'Unknown Lot'}</h3>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{formatStatusLabel(b.status)}</span>
                </div>
                <div className="booking-card-cost">
                  <span className="booking-cost-label">Est. Cost</span>
                  <span className="booking-cost-value">{formatCurrency(b.estimatedCost)}</span>
                </div>
              </div>

                <div className="booking-card-details">
                <div className="booking-detail">
                  <VehicleIcon vehicleType={b.vehicle?.vehicleType} />
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
                <div className="booking-detail">
                  <span>Payment: {formatPaymentMethodLabel(b.paymentMethod)}</span>
                </div>
              </div>

              {b.status === 'PENDING_PAYMENT' && (
                <div className="booking-card-actions">
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                    Waiting for VNPay confirmation before check-in. If you closed the VNPay tab before paying, cancel this booking and create a new one to generate a fresh payment link.
                  </div>
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

              {b.status === 'CONFIRMED' && (
                <div className="booking-card-actions">
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                    {checkedInBookingIds.has(b.id)
                      ? 'This booking has already been checked in. Use Parking History when you are ready to check out.'
                      : b.paymentMethod === 'MONTHLY_PASS'
                      ? 'This booking is covered by your monthly pass, so no payment will be collected at checkout.'
                      : 'Your slot is reserved and ready for check-in.'}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCheckIn(b)}
                    disabled={actionLoading === b.id || checkedInBookingIds.has(b.id)}
                  >
                    {actionLoading === b.id ? '...' : checkedInBookingIds.has(b.id) ? 'Checked In' : 'Check In'}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-occupied)' }}
                    onClick={() => handleCancel(b.id)}
                    disabled={actionLoading === b.id || checkedInBookingIds.has(b.id)}
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}

              {b.status === 'COMPLETED' && (
                <div className="booking-card-actions">
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {b.paymentMethod === 'MONTHLY_PASS'
                      ? 'Parking session finished under your monthly pass. No separate parking payment was created.'
                      : 'Parking session finished. Any cash payment appears in My Payments after checkout.'}
                  </div>
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
