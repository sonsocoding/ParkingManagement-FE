import { useNavigate } from 'react-router-dom';
import { Car, CalendarCheck, MapPin, ArrowRight } from 'lucide-react';

export default function QuickActions({ activeBookingsCount }) {
  const navigate = useNavigate();
  return (
    <div className="quick-actions">
      <button className="quick-action-card" onClick={() => navigate('/parking-lots')}>
        <div className="quick-action-icon quick-action-icon-primary">
          <MapPin size={24} />
        </div>
        <div>
          <h3>Find Parking</h3>
          <p>Browse available lots</p>
        </div>
        <ArrowRight size={20} className="quick-action-arrow" />
      </button>
      <button className="quick-action-card" onClick={() => navigate('/my-bookings')}>
        <div className="quick-action-icon quick-action-icon-available">
          <CalendarCheck size={24} />
        </div>
        <div>
          <h3>My Bookings</h3>
          <p>{activeBookingsCount} active</p>
        </div>
        <ArrowRight size={20} className="quick-action-arrow" />
      </button>
      <button className="quick-action-card" onClick={() => navigate('/my-vehicles')}>
        <div className="quick-action-icon quick-action-icon-vehicle">
          <Car size={24} />
        </div>
        <div>
          <h3>My Vehicles</h3>
          <p>Manage vehicles</p>
        </div>
        <ArrowRight size={20} className="quick-action-arrow" />
      </button>
    </div>
  );
}
