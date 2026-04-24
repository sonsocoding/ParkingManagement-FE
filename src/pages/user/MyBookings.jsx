import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { CalendarCheck, Clock, Car, ParkingSquare, X, Filter } from 'lucide-react';
import { bookings, formatCurrency, formatDateTime } from '../../data/sampleData';
import './MyBookings.css';

export default function MyBookings() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const filtered = statusFilter === 'ALL' ? bookings : bookings.filter(b => b.status === statusFilter);

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

        <div className="bookings-list">
          {filtered.map((b) => (
            <div key={b.id} className="booking-card card">
              <div className="booking-card-top">
                <div className="booking-card-lot">
                  <h3>{b.parkingLot.name}</h3>
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
                  <span>{b.vehicle.plateNumber}</span>
                  <span className={`badge badge-${b.vehicle.vehicleType.toLowerCase()}`}>{b.vehicle.vehicleType}</span>
                </div>
                <div className="booking-detail">
                  <ParkingSquare size={16} />
                  <span>Slot {b.slot.slotNumber}</span>
                </div>
                <div className="booking-detail">
                  <Clock size={16} />
                  <span>{formatDateTime(b.startTime)} → {formatDateTime(b.endTime)}</span>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="booking-card-actions">
                  <button className="btn btn-primary btn-sm">Check In</button>
                  <button className="btn btn-secondary btn-sm">Edit</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-occupied)' }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
