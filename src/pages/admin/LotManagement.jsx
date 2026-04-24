import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { parkingLots } from '../../data/sampleData';
import { Plus, Edit2, Trash2, Settings, MapPin } from 'lucide-react';

export default function LotManagement() {
  return (
    <>
      <TopBar 
        title="Lot Management" 
        subtitle="Manage parking locations, capacity, and rates"
        actions={<button className="btn btn-primary btn-sm"><Plus size={16} /> Add Lot</button>}
      />
      <div className="page-content">
        <div className="lots-grid">
          {parkingLots.map((lot) => {
            const occupancy = Math.round(((lot.occupiedSlots + lot.reservedSlots) / lot.totalSlots) * 100);
            return (
              <div key={lot.id} className="lot-card card" style={{ cursor: 'default' }}>
                <div className="lot-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="lot-card-name">{lot.name}</h3>
                    <div className="vehicle-card-actions">
                      <button className="btn-icon" title="Configure Slots"><Settings size={16} /></button>
                      <button className="btn-icon" title="Edit Lot"><Edit2 size={16} /></button>
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
                      <span className="text-secondary">Lot Type:</span>
                      <span className={`badge ${lot.lotType === 'CAR_ONLY' ? 'badge-car' : lot.lotType === 'MOTORBIKE_ONLY' ? 'badge-motorbike' : 'badge-completed'}`}>
                        {lot.lotType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span className="text-secondary">Zones:</span>
                      <span>{lot.zones.join(', ')}</span>
                    </div>
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
        </div>
      </div>
    </>
  );
}
