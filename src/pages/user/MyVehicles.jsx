import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { Car, Bike, Plus, Pencil, Trash2, X } from 'lucide-react';
import { useMyVehicles } from '../../hooks/useApi';
import { vehicleService } from '../../api/index';
import '../../styles/pages/user/MyVehicles.css';

export default function MyVehicles() {
  const { vehicles, loading, error, setVehicles } = useMyVehicles();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vehicleType: 'CAR', plateNumber: '', color: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await vehicleService.addVehicle(form);
      const vehicle = res.data?.vehicle;
      if (vehicle) {
        setVehicles((prev) => [...prev, vehicle]);
      }
      setShowModal(false);
      setForm({ vehicleType: 'CAR', plateNumber: '', color: '' });
    } catch (err) {
      setFormError(err?.message || 'Failed to add vehicle.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
    } catch (err) {
      alert(err?.message || 'Failed to delete vehicle.');
    }
  };

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
        {loading && <p>Loading vehicles...</p>}
        {error && <p style={{ color: 'var(--color-occupied)' }}>Error: {error}</p>}

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
                <button className="btn-icon" title="Delete" style={{ color: 'var(--color-occupied)' }} onClick={() => handleDelete(v.id)}>
                  <Trash2 size={16} />
                </button>
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
            <form className="modal-body" onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                  <option value="CAR">Car</option>
                  <option value="MOTORBIKE">Motorbike</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Plate Number</label>
                <input className="form-input" name="plateNumber" placeholder="e.g. 29A-12345" value={form.plateNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Color (optional)</label>
                <input className="form-input" name="color" placeholder="e.g. White, Black" value={form.color} onChange={handleChange} />
              </div>
              {formError && <p style={{ color: 'var(--color-occupied)', fontSize: '13px' }}>{formError}</p>}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
