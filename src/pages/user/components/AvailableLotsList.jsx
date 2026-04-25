import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '../../../data/sampleData';

export default function AvailableLotsList({ lots }) {
  const navigate = useNavigate();
  
  return (
    <div className="card">
      <div className="dashboard-card-header">
        <h3 className="headline-sm">Available Lots</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/parking-lots')}>Browse</button>
      </div>
      <div className="lots-list">
        {lots.map((lot) => (
          <div key={lot.id} className="lot-item lot-item-clickable" onClick={() => navigate(`/parking-lots/${lot.id}`)}>
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
  );
}
