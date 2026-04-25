import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllLots } from '../../hooks/useApi';
import { lotService } from '../../api/index';
import { Plus, Edit2, Trash2, Settings, MapPin } from 'lucide-react';

export default function LotManagement() {
  const { lots, loading, error } = useAllLots();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (lotId) => {
    if (!window.confirm('Delete this parking lot? All its slots will also be removed.')) return;
    setDeletingId(lotId);
    try {
      await lotService.deleteLot(lotId);
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Failed to delete lot.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <TopBar
        title="Lot Management"
        subtitle="Manage parking locations, capacity, and rates"
      />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading lots...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        <div className="lots-grid">
          {lots.map((lot) => {
            const occupancy = Math.round(
              ((lot.occupiedSlots || 0) + (lot.reservedSlots || 0)) / Math.max(lot.totalSlots, 1) * 100
            );
            return (
              <div key={lot.id} className="lot-card card" style={{ cursor: 'default' }}>
                <div className="lot-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="lot-card-name">{lot.name}</h3>
                    <div className="vehicle-card-actions">
                      <button
                        className="btn-icon"
                        title="Delete Lot"
                        style={{ color: 'var(--color-occupied)' }}
                        disabled={deletingId === lot.id}
                        onClick={() => handleDelete(lot.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="lot-card-address" style={{ marginBottom: '12px' }}>
                    <MapPin size={14} /> {lot.address}
                  </p>

                  <div className="lot-card-stats" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span className="text-secondary">Total Capacity:</span>
                      <span style={{ fontWeight: 600 }}>{lot.totalSlots} Slots</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span className="text-secondary">Available:</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-available)' }}>{lot.availableSlots ?? '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span className="text-secondary">Lot Type:</span>
                      <span className={`badge ${lot.lotType === 'CAR_ONLY' ? 'badge-car' : lot.lotType === 'MOTORBIKE_ONLY' ? 'badge-motorbike' : 'badge-completed'}`}>
                        {lot.lotType}
                      </span>
                    </div>
                    {lot.zones && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span className="text-secondary">Zones:</span>
                        <span>
                          {Array.isArray(lot.zones) 
                            ? lot.zones.join(', ') 
                            : typeof lot.zones === 'object' 
                              ? [...(lot.zones.carZones || []), ...(lot.zones.motoZones || [])].join(', ')
                              : lot.zones}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Current Occupancy ({occupancy}%)</div>
                  <div className="lot-card-bar">
                    <div className="lot-card-bar-fill" style={{ width: `${occupancy}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && lots.length === 0 && (
            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>No parking lots found.</p>
          )}
        </div>
      </div>
    </>
  );
}
