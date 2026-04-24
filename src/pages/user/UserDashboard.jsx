import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/shared/StatCard';
import { Car, CalendarCheck, CreditCard, Clock, MapPin, ArrowRight, ParkingSquare } from 'lucide-react';
import { bookings, parkingRecords, formatCurrency, formatDateTime, parkingLots } from '../../data/sampleData';
import './UserDashboard.css';

export default function UserDashboard() {
  const navigate = useNavigate();
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const activeRecords = parkingRecords.filter(r => r.status === 'CHECKED_IN');

  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of your parking activity" />
      <div className="page-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-card" onClick={() => navigate('/parking-lots')}>
            <div className="quick-action-icon" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3>Find Parking</h3>
              <p>Browse available lots</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </button>
          <button className="quick-action-card" onClick={() => navigate('/my-bookings')}>
            <div className="quick-action-icon" style={{ background: 'var(--color-available-bg)', color: 'var(--color-available)' }}>
              <CalendarCheck size={24} />
            </div>
            <div>
              <h3>My Bookings</h3>
              <p>{activeBookings.length} active</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </button>
          <button className="quick-action-card" onClick={() => navigate('/my-vehicles')}>
            <div className="quick-action-icon" style={{ background: '#E3F2FD', color: '#1565C0' }}>
              <Car size={24} />
            </div>
            <div>
              <h3>My Vehicles</h3>
              <p>Manage vehicles</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <StatCard icon={CalendarCheck} label="Active Bookings" value={activeBookings.length} color="green" />
          <StatCard icon={ParkingSquare} label="Checked In" value={activeRecords.length} color="blue" />
          <StatCard icon={CreditCard} label="Total Spent" value={formatCurrency('331000')} color="primary" subtitle="This month" />
        </div>

        <div className="dashboard-grid">
          {/* Active Bookings */}
          <div className="card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Active Bookings</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-bookings')}>View all</button>
            </div>
            {activeBookings.length === 0 ? (
              <div className="empty-state">
                <CalendarCheck size={48} />
                <h3>No active bookings</h3>
                <p>Find a parking lot and book a spot</p>
              </div>
            ) : (
              <div className="user-booking-list">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="user-booking-item">
                    <div className="user-booking-left">
                      <div className="user-booking-lot">{booking.parkingLot.name}</div>
                      <div className="user-booking-meta">
                        <span><Car size={14} /> {booking.vehicle.plateNumber}</span>
                        <span><ParkingSquare size={14} /> Slot {booking.slot.slotNumber}</span>
                      </div>
                      <div className="user-booking-time">
                        <Clock size={14} />
                        {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                      </div>
                    </div>
                    <div className="user-booking-right">
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span>
                      <span className="user-booking-cost">{formatCurrency(booking.estimatedCost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Lots */}
          <div className="card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Available Lots</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/parking-lots')}>Browse</button>
            </div>
            <div className="lots-list">
              {parkingLots.map((lot) => (
                <div key={lot.id} className="lot-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/parking-lots/${lot.id}`)}>
                  <div className="lot-item-info">
                    <div className="lot-item-icon">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="lot-item-name">{lot.name}</div>
                      <div className="lot-item-meta">
                        <span className="badge badge-available">{lot.availableSlots} free</span>
                        <span className="lot-item-total">{formatCurrency(lot.carHourlyRate)}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
