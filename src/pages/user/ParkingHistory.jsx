import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { Clock, Car, MapPin, ArrowRight, Wallet, Timer } from 'lucide-react';
import { recordService } from '../../api/index';
import { useMyRecords } from '../../hooks/useApi';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import '../../styles/pages/user/ParkingHistory.css';

export default function ParkingHistory() {
  const { parkingRecords, loading, error } = useMyRecords();
  const [actionLoading, setActionLoading] = useState(null);

  const activeRecords = parkingRecords.filter((record) => record.status === 'CHECKED_IN').length;
  const completedRecords = parkingRecords.length - activeRecords;
  const settledTotal = parkingRecords.reduce((sum, record) => sum + (Number(record.actualCost) || 0), 0);

  const formatDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime) return 'Pending';

    const start = new Date(checkInTime);
    const end = checkOutTime ? new Date(checkOutTime) : new Date();
    const diffMs = Math.max(end - start, 0);
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  const handleCheckOut = async (recordId) => {
    setActionLoading(recordId);
    try {
      await recordService.checkOut(recordId);
      alert('Checked out successfully. Payment has been settled according to your parking method.');
      window.location.reload();
    } catch (err) {
      alert(err?.message || 'Check-out failed.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <TopBar title="Parking History" subtitle="Your check-in and check-out records" />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading history...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        {!loading && parkingRecords.length > 0 && (
          <div className="history-summary-grid">
            <div className="history-summary-card card">
              <span className="history-summary-label">Total visits</span>
              <strong>{parkingRecords.length}</strong>
            </div>
            <div className="history-summary-card card">
              <span className="history-summary-label">Currently parked</span>
              <strong>{activeRecords}</strong>
            </div>
            <div className="history-summary-card card">
              <span className="history-summary-label">Completed sessions</span>
              <strong>{completedRecords}</strong>
            </div>
            <div className="history-summary-card card">
              <span className="history-summary-label">Total spent</span>
              <strong>{formatCurrency(settledTotal)}</strong>
            </div>
          </div>
        )}

        <div className="history-timeline">
          {parkingRecords.map((r) => {
            const hasCost = r.actualCost !== null && r.actualCost !== undefined;

            return (
              <div key={r.id} className="history-item card">
                <div className="history-item-header">
                  <div className="history-item-heading">
                    <div className={`history-status-dot ${r.status === 'CHECKED_IN' ? 'active' : 'done'}`} />
                    <div>
                      <h3>{r.parkingLot?.name || 'Unknown Lot'}</h3>
                      <p className="history-item-subtitle">{formatDateTime(r.checkInTime)}</p>
                    </div>
                  </div>
                  <div className="history-badge-group">
                    <span className={`badge ${r.status === 'CHECKED_IN' ? 'badge-active' : 'badge-completed'}`}>
                      {r.status === 'CHECKED_IN' ? 'Checked In' : 'Checked Out'}
                    </span>
                  </div>
                </div>

                <div className="history-details-grid">
                  <div className="history-detail-chip">
                    <Car size={14} />
                    <span>{r.vehicle?.plateNumber || 'Unknown vehicle'}</span>
                  </div>
                  <div className="history-detail-chip">
                    <MapPin size={14} />
                    <span>Slot {r.slot?.slotNumber || r.parkingSlotId || 'N/A'}</span>
                  </div>
                  <div className="history-detail-chip">
                    <Timer size={14} />
                    <span>{formatDuration(r.checkInTime, r.checkOutTime)}</span>
                  </div>
                  <div className="history-detail-chip">
                    <Wallet size={14} />
                    <span>{hasCost ? formatCurrency(r.actualCost) : 'Not settled yet'}</span>
                  </div>
                </div>

                <div className="history-times-panel">
                  <div className="history-time-block">
                    <span className="history-time-label">Check In</span>
                    <span className="history-time-value">{formatDateTime(r.checkInTime)}</span>
                  </div>
                  <ArrowRight size={14} className="history-arrow" />
                  <div className="history-time-block">
                    <span className="history-time-label">Check Out</span>
                    <span className="history-time-value">
                      {r.checkOutTime ? formatDateTime(r.checkOutTime) : 'Still parked'}
                    </span>
                  </div>
                </div>

                <div className="history-meta-row">
                  {hasCost && (
                    <div className="history-cost">
                      Cost: <strong>{formatCurrency(r.actualCost)}</strong>
                    </div>
                  )}
                  {r.status === 'CHECKED_IN' && (
                    <button
                      className="btn btn-primary history-checkout-button"
                      onClick={() => handleCheckOut(r.id)}
                      disabled={actionLoading === r.id}
                    >
                      {actionLoading === r.id ? 'Checking out...' : 'Checkout'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!loading && parkingRecords.length === 0 && (
            <div className="empty-state">
              <Clock size={48} />
              <h3>No parking history</h3>
              <p>Your check-in records will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
