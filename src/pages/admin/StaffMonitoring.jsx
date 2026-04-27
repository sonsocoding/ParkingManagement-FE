import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllLots } from '../../hooks/useApi';
import { useFetchData } from '../../hooks/useApi';
import { lotService, slotService } from '../../api/index';
import { Monitor, Wrench } from 'lucide-react';
import '../../styles/pages/admin/StaffMonitoring.css';
import { getZoneKey, normalizeZones } from '../../utils/parkingZones';

export default function StaffMonitoring() {
  const { lots, loading: lotsLoading } = useAllLots();
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Derive selected lot (default to first when lots load)
  const currentLotId = selectedLotId ?? (lots[0]?.id || null);
  const currentLot = lots.find(l => l.id === currentLotId);

  const { data: slotsData, loading: slotsLoading } = useFetchData(
    currentLotId ? () => lotService.getSlotsByLotId(currentLotId) : null,
    [currentLotId, refreshKey]
  );

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const timer = setInterval(handleRefresh, 30000);
    return () => clearInterval(timer);
  }, []);

  const parkingSlots = slotsData?.parkingSlots || [];

  const zones = currentLot?.zones
    ? normalizeZones(currentLot.zones)
    : normalizeZones(parkingSlots.map((slot) => slot.zoneId));

  return (
    <>
      <TopBar
        title="Staff Monitoring"
        subtitle="Real-time operational view of parking slots"
        actions={
          <button className="btn btn-secondary btn-sm" onClick={handleRefresh} disabled={slotsLoading}>
            <Monitor size={16} /> {slotsLoading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        }
      />
      <div className="page-content">
        <div className="monitoring-header card">
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label className="form-label">Select Facility</label>
            {lotsLoading ? (
              <select className="form-select" disabled><option>Loading...</option></select>
            ) : (
              <select
                className="form-select"
                value={currentLotId || ''}
                onChange={(e) => setSelectedLotId(e.target.value)}
              >
                {lots.map(lot => (
                  <option key={lot.id} value={lot.id}>{lot.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="monitoring-stats">
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-available">{currentLot?.availableSlots ?? '—'}</span>
              <span className="monitoring-stat-label">Available</span>
            </div>
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-occupied">{currentLot?.occupiedSlots ?? '—'}</span>
              <span className="monitoring-stat-label">Occupied</span>
            </div>
            <div className="monitoring-stat">
              <span className="monitoring-stat-val text-reserved">{currentLot?.reservedSlots ?? '—'}</span>
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

          {slotsLoading && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '40px' }}>Loading slots...</p>}

          <div className="monitoring-zones">
            {zones.map((zone) => (
              <div key={zone.key} className="monitoring-zone">
                <h3 className="zone-title">Zone {zone.label}</h3>
                <div className="monitoring-slot-grid">
                  {parkingSlots.filter((slot) => getZoneKey(slot.zoneId) === zone.key).map((slot) => (
                    <div
                      key={slot.id}
                      className={`monitoring-slot monitoring-${slot.status.toLowerCase()}`}
                      title={`${slot.slotNumber} - ${slot.status}`}
                    >
                      {slot.status === 'MAINTENANCE' && <Wrench size={14} className="maintenance-icon" />}
                      <span className="monitoring-slot-number">{slot.slotNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!slotsLoading && parkingSlots.length === 0 && (
              <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '40px' }}>No slot data for this lot.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
