import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { MapPin, Car, Bike, Info, ArrowLeft } from 'lucide-react';
import { parkingLots, parkingSlots, formatCurrency } from '../../data/sampleData';
import '../../styles/pages/user/LotDetail.css';

export default function LotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lot = parkingLots.find(l => l.id === id) || parkingLots[0];
  const slots = parkingSlots[lot.id] || [];
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');

  // Group slots by zone
  const zones = lot.zones.map(zoneName => ({
    name: zoneName,
    slots: slots.filter(s => s.zoneId === zoneName && (vehicleTypeFilter === 'ALL' || s.vehicleType === vehicleTypeFilter))
  }));

  const handleSlotClick = (slot) => {
    if (slot.status === 'AVAILABLE') {
      setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
    }
  };

  return (
    <>
      <TopBar 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            {lot.name}
          </div>
        } 
        subtitle={lot.address} 
      />
      <div className="page-content lot-detail-content">
        <div className="lot-detail-main">
          {/* Legend and Filters */}
          <div className="slot-map-header card">
            <div className="slot-legend">
              <div className="legend-item"><span className="slot-dot available" /> Available</div>
              <div className="legend-item"><span className="slot-dot occupied" /> Occupied</div>
              <div className="legend-item"><span className="slot-dot reserved" /> Reserved</div>
              <div className="legend-item"><span className="slot-dot maintenance" /> Maintenance</div>
            </div>
            {lot.lotType === 'BOTH' && (
              <div className="slot-filters">
                {['ALL', 'CAR', 'MOTORBIKE'].map(type => (
                  <button 
                    key={type} 
                    className={`btn btn-sm ${vehicleTypeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setVehicleTypeFilter(type)}
                  >
                    {type === 'ALL' ? 'All Vehicles' : type === 'CAR' ? '🚗 Cars' : '🏍️ Bikes'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Slot Map */}
          <div className="slot-map-container card">
            {zones.map(zone => (
              <div key={zone.name} className="slot-zone">
                <h3 className="zone-title">Zone {zone.name}</h3>
                <div className="slot-grid">
                  {zone.slots.map(slot => (
                    <button
                      key={slot.id}
                      className={`slot-item slot-${slot.status.toLowerCase()} ${selectedSlot === slot.id ? 'slot-selected' : ''}`}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== 'AVAILABLE'}
                    >
                      <span className="slot-number">{slot.slotNumber}</span>
                      <span className="slot-type">
                        {slot.vehicleType === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lot-detail-sidebar">
          <div className="card sticky-booking-card">
            <h3 className="headline-sm" style={{ marginBottom: '16px' }}>Booking Summary</h3>
            
            <div className="lot-rates">
              {parseFloat(lot.carHourlyRate) > 0 && (
                <div className="rate-item">
                  <span className="rate-label"><Car size={16} /> Car Rate</span>
                  <span className="rate-value">{formatCurrency(lot.carHourlyRate)}/hr</span>
                </div>
              )}
              {parseFloat(lot.motorbikeHourlyRate) > 0 && (
                <div className="rate-item">
                  <span className="rate-label"><Bike size={16} /> Bike Rate</span>
                  <span className="rate-value">{formatCurrency(lot.motorbikeHourlyRate)}/hr</span>
                </div>
              )}
            </div>

            {selectedSlot ? (
              <div className="booking-form">
                <div className="selected-slot-info">
                  <div className="selected-slot-label">Selected Slot</div>
                  <div className="selected-slot-val">{slots.find(s => s.id === selectedSlot)?.slotNumber}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Duration (Hours)</label>
                  <select className="form-select">
                    {[1, 2, 3, 4, 8, 12, 24].map(h => (
                      <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Vehicle</label>
                  <select className="form-select">
                    <option value="">Select a vehicle...</option>
                    <option value="1">29A-12345 (Car)</option>
                  </select>
                </div>

                <div className="booking-total">
                  <span>Estimated Total</span>
                  <span className="total-amount">{formatCurrency(lot.carHourlyRate)}</span>
                </div>

                <button className="btn btn-primary w-full btn-lg">Confirm Booking</button>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <MapPin size={32} />
                <h4 style={{ margin: '12px 0 4px', fontSize: '15px' }}>No Slot Selected</h4>
                <p style={{ fontSize: '13px' }}>Please select an available slot from the map to proceed with booking.</p>
              </div>
            )}
            
            <div className="booking-notice">
              <Info size={14} />
              <span>Payments are currently collected in cash upon arrival.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
