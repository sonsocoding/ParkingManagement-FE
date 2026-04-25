import TopBar from '../../components/layout/TopBar';
import { Clock, Car, MapPin, ArrowRight } from 'lucide-react';
import { parkingRecords, formatDateTime, formatCurrency } from '../../data/sampleData';
import '../../styles/pages/user/ParkingHistory.css';

export default function ParkingHistory() {
  return (
    <>
      <TopBar title="Parking History" subtitle="Your check-in and check-out records" />
      <div className="page-content">
        <div className="history-timeline">
          {parkingRecords.map((r) => (
            <div key={r.id} className="history-item card">
              <div className={`history-status-dot ${r.status === 'CHECKED_IN' ? 'active' : 'done'}`} />
              <div className="history-item-content">
                <div className="history-item-header">
                  <h3>{r.parkingLot.name}</h3>
                  <span className={`badge ${r.status === 'CHECKED_IN' ? 'badge-active' : 'badge-completed'}`}>
                    {r.status === 'CHECKED_IN' ? '● Checked In' : 'Checked Out'}
                  </span>
                </div>
                <div className="history-details">
                  <span><Car size={14} /> {r.vehicle.plateNumber}</span>
                  <span><MapPin size={14} /> Slot {r.slot.slotNumber}</span>
                </div>
                <div className="history-times">
                  <div className="history-time">
                    <span className="history-time-label">Check In</span>
                    <span>{formatDateTime(r.checkInTime)}</span>
                  </div>
                  {r.checkOutTime && (
                    <>
                      <ArrowRight size={14} className="history-arrow" />
                      <div className="history-time">
                        <span className="history-time-label">Check Out</span>
                        <span>{formatDateTime(r.checkOutTime)}</span>
                      </div>
                    </>
                  )}
                </div>
                {r.actualCost && (
                  <div className="history-cost">
                    Cost: <strong>{formatCurrency(r.actualCost)}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
