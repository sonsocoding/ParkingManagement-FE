import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { Ticket, Calendar, Plus, RotateCw, X } from 'lucide-react';
import { useMyPasses, useMyVehicles } from '../../hooks/useApi';
import { passService } from '../../api/index';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/pages/user/MonthlyPasses.css';

export default function MonthlyPasses() {
  const { passes, loading, error } = useMyPasses();
  const { vehicles } = useMyVehicles();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vehicleType: 'CAR', vehicleId: '', months: 1 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBuy = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await passService.createPass({
        vehicleType: form.vehicleType,
        vehicleId: form.vehicleId,
        months: parseInt(form.months),
      });
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setFormError(err?.message || 'Failed to create pass.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (passId) => {
    if (!window.confirm('Cancel this monthly pass?')) return;
    try {
      await passService.cancelPass(passId);
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to cancel pass.');
    }
  };

  const handleRenew = async (passId) => {
    try {
      await passService.renewPass(passId, { months: 1 });
      alert('Pass renewed for 1 month!');
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to renew pass.');
    }
  };

  return (
    <>
      <TopBar
        title="Monthly Passes"
        subtitle="Subscription parking for regular users"
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={16} /> Buy Pass</button>}
      />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading passes...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        <div className="passes-grid">
          {passes.map((pass) => (
            <div key={pass.id} className={`pass-card card ${pass.status === 'ACTIVE' ? 'pass-active' : ''}`}>
              <div className="pass-card-header">
                <div className="pass-card-icon"><Ticket size={24} /></div>
                <span className={`badge badge-${pass.status.toLowerCase()}`}>{pass.status}</span>
              </div>
              <div className="pass-card-type">{pass.vehicleType} Monthly Pass</div>
              <div className="pass-card-price">{formatCurrency(pass.price)}</div>
              <div className="pass-card-dates">
                <div className="pass-date">
                  <Calendar size={14} />
                  <span>{formatDate(pass.startDate)} — {formatDate(pass.endDate)}</span>
                </div>
              </div>
              {pass.status === 'ACTIVE' && (
                <div className="pass-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleRenew(pass.id)}><RotateCw size={14} /> Renew</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-occupied)' }} onClick={() => handleCancel(pass.id)}><X size={14} /> Cancel</button>
                </div>
              )}
            </div>
          ))}
          {!loading && passes.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Ticket size={48} />
              <h3>No monthly passes</h3>
              <p>Buy a pass to get unlimited access to all parking lots.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="headline-sm">Buy Monthly Pass</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className="modal-body" onSubmit={handleBuy}>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                  <option value="CAR">Car (1,500,000 VND/month)</option>
                  <option value="MOTORBIKE">Motorbike (300,000 VND/month)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle</label>
                <select className="form-select" name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
                  <option value="">Select vehicle...</option>
                  {vehicles
                    .filter(v => v.vehicleType === form.vehicleType)
                    .map(v => (
                      <option key={v.id} value={v.id}>{v.plateNumber}</option>
                    ))
                  }
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (Months)</label>
                <select className="form-select" name="months" value={form.months} onChange={handleChange}>
                  {[1, 2, 3, 6, 12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              {formError && <p style={{ color: 'var(--color-occupied)', fontSize: '13px' }}>{formError}</p>}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Processing...' : 'Buy Pass'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
