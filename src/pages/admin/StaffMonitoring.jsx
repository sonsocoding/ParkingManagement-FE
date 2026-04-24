import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { parkingLots, parkingSlots } from '../../data/sampleData';
import { Monitor, AlertTriangle } from 'lucide-react';
import './StaffMonitoring.css';

export default function StaffMonitoring() {
  const [selectedLot, setSelectedLot] = useState(parkingLots[0]?.id);
  
  const currentLot = parkingLots.find(l => l.id === selectedLot);
  const slots = parkingSlots[selectedLot] || [];

  return (
    <>
      <TopBar 
        title="Staff Monitoring" 
        subtitle="Real-time operational view of parking slots"
      />
      <div className="page-content">
        <div className="monitoring-header card">
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label className="form-label">Select Facility</label>
            <select 
              className="form-select" 
              value={selectedLot} 
              onChange={(e) => setSelectedLot(e.target.value)}
            >
              {parkingLots.map(lot => (
                <option key={lot.id} value={lot.id}>{lot.name}</option>
              ))}
            </select>
          </div>
          <div className="monitoring-stats">
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-available">{currentLot?.availableSlots}</span>
              <span className="monitoring-stat-label">Available</span>
            </div>
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-occupied">{currentLot?.occupiedSlots}</span>
              <span className="monitoring-stat-label">Occupied</span>
            </div>
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-reserved">{currentLot?.reservedSlots}</span>
              <span className="monitoring-stat-label">Reserved</span>
            </div>
          </div>
        </div>

        <div className="monitoring-grid-container card">
          <div className="monitoring-legend">
            <div className="legend-item"><span className="slot-dot available" /> Available</div>
            <div className="legend-item"><span className="slot-dot occupied" /> Occupied</div>
            <div className="legend-item"><span className="slot-dot reserved" /> Reserved</div>
            <div className="legend-item"><span className="slot-dot maintenance" /> Maintenance</div>
          </div>
          
          <div className="monitoring-zones">
            {currentLot?.zones.map(zone => (
              <div key={zone} className="monitoring-zone">
                <h3 className="zone-title">Zone {zone}</h3>
                <div className="monitoring-slot-grid">
                  {slots.filter(s => s.zoneId === zone).map(slot => (
                    <div 
                      key={slot.id} 
                      className={`monitoring-slot monitoring-${slot.status.toLowerCase()}`}
                      title={`${slot.slotNumber} - ${slot.status}`}
                    >
                      {slot.status === 'MAINTENANCE' && <AlertTriangle size={14} className="maintenance-icon" />}
                      <span className="monitoring-slot-number">{slot.slotNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
