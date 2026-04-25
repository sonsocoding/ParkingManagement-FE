import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { Car, Bike, Plus, Pencil, Trash2, X } from 'lucide-react';
import { vehicles } from '../../data/sampleData';
import '../../styles/pages/user/MyVehicles.css';

export default function MyVehicles() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TopBar
        title="My Vehicles"
        subtitle="Manage your registered vehicles"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Vehicle
          </button>
        }
      />
      <div className="page-content">
        <div className="vehicles-grid">
          {vehicles.map((v) => (
            <div key={v.id} className="vehicle-card card">
              <div className="vehicle-card-icon-wrap">
                <div className={`vehicle-card-icon ${v.vehicleType === 'CAR' ? 'vehicle-car' : 'vehicle-bike'}`}>
                  {v.vehicleType === 'CAR' ? <Car size={28} /> : <Bike size={28} />}
                </div>
              </div>
              <div className="vehicle-card-body">
                <div className="vehicle-plate">{v.plateNumber}</div>
                <div className="vehicle-meta">
                  <span className={`badge badge-${v.vehicleType.toLowerCase()}`}>{v.vehicleType}</span>
                  {v.color && <span className="vehicle-color">{v.color}</span>}
                </div>
              </div>
              <div className="vehicle-card-actions">
                <button className="btn-icon" title="Edit"><Pencil size={16} /></button>
                <button className="btn-icon" title="Delete" style={{ color: 'var(--color-occupied)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}

          {/* Add Vehicle Card */}
          <div className="vehicle-card vehicle-add-card" onClick={() => setShowModal(true)}>
            <Plus size={32} />
            <span>Add new vehicle</span>
          </div>
        </div>

      </div>
      
      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="headline-sm">Add Vehicle</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className="modal-body">
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select">
                  <option value="CAR">Car</option>
                  <option value="MOTORBIKE">Motorbike</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Plate Number</label>
                <input className="form-input" placeholder="e.g. 29A-12345" />
              </div>
              <div className="form-group">
                <label className="form-label">Color (optional)</label>
                <input className="form-input" placeholder="e.g. White, Black" />
              </div>
            </form>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Add Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
