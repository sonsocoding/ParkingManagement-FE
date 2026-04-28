import { useNavigate } from 'react-router-dom';
import { Car, CalendarCheck, Clock, ParkingSquare } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

export default function ActiveBookingsList({ bookings }) {
  const navigate = useNavigate();
  const formatStatusLabel = (status) => (status === 'PENDING_PAYMENT' ? 'Pending Payment' : status);
  
  return (
    <div className="card">
      <div className="dashboard-card-header">
        <h3 className="headline-sm">Active Bookings</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-bookings')}>View all</button>
      </div>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <CalendarCheck size={48} />
          <h3>No active bookings</h3>
          <p>Find a parking lot and book a spot</p>
        </div>
      ) : (
        <div className="user-booking-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="user-booking-item">
              <div className="user-booking-left">
                <div className="user-booking-lot">{booking.parkingLot?.name || 'Unknown Lot'}</div>
                <div className="user-booking-meta">
                  <span><Car size={14} /> {booking.vehicle?.plateNumber}</span>
                  <span><ParkingSquare size={14} /> Slot {booking.slot?.slotNumber || booking.parkingSlotId}</span>
                </div>
                <div className="user-booking-time">
                  <Clock size={14} />
                  {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                </div>
              </div>
              <div className="user-booking-right">
                <span className={`badge badge-${booking.status.toLowerCase()}`}>{formatStatusLabel(booking.status)}</span>
                <span className="user-booking-cost">{formatCurrency(booking.estimatedCost)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
