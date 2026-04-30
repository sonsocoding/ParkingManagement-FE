import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { MapPin, Car, Bike, Info, ArrowLeft, Wrench } from 'lucide-react';
import { useParkingLot, useLotSlots, useMyPasses, useMyVehicles } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/formatters';
import { bookingService } from '../../api/index';
import { getZoneKey, normalizeZones, sortParkingSlotsByNumber } from '../../utils/parkingZones';
import '../../styles/pages/user/LotDetail.css';

export default function LotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { parkingLot, loading: lotLoading } = useParkingLot(id);
  const { parkingSlots, loading: slotsLoading } = useLotSlots(id);
  const { vehicles } = useMyVehicles();
  const { monthlyPasses } = useMyPasses();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');
  const [duration, setDuration] = useState(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState(null);

  const redirectToVnpay = (paymentUrl) => {
    if (!paymentUrl) {
      throw new Error('VNPay link was not returned by the server.');
    }
    window.location.assign(paymentUrl);
  };

  if (lotLoading || slotsLoading) {
    return (
      <>
        <TopBar title="Loading..." subtitle="" />
        <div className="page-content"><p>Loading lot details...</p></div>
      </>
    );
  }

  if (!parkingLot) {
    return (
      <>
        <TopBar title="Not Found" subtitle="" />
        <div className="page-content"><p>Parking lot not found.</p></div>
      </>
    );
  }

  const zones = normalizeZones(parkingLot.zones).map((zone) => ({
    ...zone,
    slots: sortParkingSlotsByNumber(
      parkingSlots.filter(
        (slot) => getZoneKey(slot.zoneId) === zone.key
          && (vehicleTypeFilter === 'ALL' || slot.vehicleType === vehicleTypeFilter)
      )
    )
  }));

  const handleSlotClick = (slot) => {
    if (slot.status === 'AVAILABLE') {
      setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
      setBookError(null);
    }
  };

  const selectedSlotObj = parkingSlots.find(s => s.id === selectedSlot);
  const rate = selectedSlotObj?.vehicleType === 'MOTORBIKE'
    ? parseFloat(parkingLot.motorbikeHourlyRate)
    : parseFloat(parkingLot.carHourlyRate);
  const estimatedCost = rate * duration;

  const eligiblePass = monthlyPasses.find((pass) => (
    pass.status === 'ACTIVE'
    && pass.payment?.status === 'SUCCESS'
    && pass.vehicleType === selectedSlotObj?.vehicleType
  )) || null;
  const effectivePaymentMethod = paymentMethod === 'MONTHLY_PASS' && !eligiblePass ? 'CASH' : paymentMethod;
  const totalDue = effectivePaymentMethod === 'MONTHLY_PASS' ? 0 : estimatedCost;

  const handleConfirmBooking = async () => {
    if (!selectedVehicleId) { setBookError('Please select a vehicle.'); return; }
    if (!selectedSlot) { setBookError('Please select a slot.'); return; }
    setBooking(true);
    setBookError(null);
    try {
      const startTime = new Date();
      startTime.setMinutes(startTime.getMinutes() + 1);
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
      const res = await bookingService.createBooking({
        parkingSlotId: selectedSlot,
        parkingLotId: id,
        vehicleId: selectedVehicleId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        paymentMethod: effectivePaymentMethod,
      });
      if (effectivePaymentMethod === 'VNPAY') {
        redirectToVnpay(res?.data?.paymentUrl);
        return;
      }
      navigate('/my-bookings');
    } catch (err) {
      setBookError(err?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <TopBar
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            {parkingLot.name}
          </div>
        }
        subtitle={parkingLot.address}
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
            {parkingLot.lotType === 'BOTH' && (
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
            {zones.length === 0 && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>No slot data available.</p>}
            {zones.map((zone) => (
              <div key={zone.key} className="slot-zone">
                <h3 className="zone-title">Zone {zone.label}</h3>
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
                        {slot.status === 'MAINTENANCE' ? (
                          <Wrench size={16} />
                        ) : slot.vehicleType === 'CAR' ? (
                          <Car size={16} />
                        ) : (
                          <Bike size={16} />
                        )}
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
              {parseFloat(parkingLot.carHourlyRate) > 0 && (
                <div className="rate-item">
                  <span className="rate-label"><Car size={16} /> Car Rate</span>
                  <span className="rate-value">{formatCurrency(parkingLot.carHourlyRate)}/hr</span>
                </div>
              )}
              {parseFloat(parkingLot.motorbikeHourlyRate) > 0 && (
                <div className="rate-item">
                  <span className="rate-label"><Bike size={16} /> Bike Rate</span>
                  <span className="rate-value">{formatCurrency(parkingLot.motorbikeHourlyRate)}/hr</span>
                </div>
              )}
            </div>

            {selectedSlot ? (
              <div className="booking-form">
                <div className="selected-slot-info">
                  <div className="selected-slot-label">Selected Slot</div>
                  <div className="selected-slot-val">{selectedSlotObj?.slotNumber}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Hours)</label>
                  <select className="form-select" value={duration} onChange={e => setDuration(Number(e.target.value))}>
                    {[1, 2, 3, 4, 8, 12, 24].map(h => (
                      <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle</label>
                  <select className="form-select" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)}>
                    <option value="" disabled hidden>Select a vehicle...</option>
                    {vehicles
                      .filter(v => v.vehicleType === selectedSlotObj?.vehicleType)
                      .map(v => (
                        <option key={v.id} value={v.id}>{v.plateNumber} ({v.vehicleType})</option>
                      ))}
                  </select>
                  {vehicles.filter(v => v.vehicleType === selectedSlotObj?.vehicleType).length === 0 && (
                    <p style={{ color: 'var(--color-occupied)', fontSize: '11px', marginTop: '4px' }}>
                      No {selectedSlotObj?.vehicleType?.toLowerCase()}s registered.
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={effectivePaymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="CASH">Cash on exit</option>
                    <option value="VNPAY">VNPay</option>
                    {eligiblePass && <option value="MONTHLY_PASS">Monthly Pass</option>}
                  </select>
                  {!eligiblePass && selectedSlotObj && (
                    <p style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                      No active {selectedSlotObj.vehicleType.toLowerCase()} monthly pass covers this booking window.
                    </p>
                  )}
                  {eligiblePass && effectivePaymentMethod === 'MONTHLY_PASS' && (
                    <p style={{ fontSize: '11px', marginTop: '4px', color: 'var(--color-available)' }}>
                      Covered by your active {eligiblePass.vehicleType.toLowerCase()} monthly pass.
                    </p>
                  )}
                </div>

                <div className="booking-total">
                  <span>Estimated Total</span>
                  <span className="total-amount">{formatCurrency(totalDue)}</span>
                </div>

                {bookError && <p style={{ color: 'var(--color-occupied)', fontSize: '13px', marginBottom: '8px' }}>{bookError}</p>}

                <button
                  className="btn btn-primary w-full btn-lg"
                  onClick={handleConfirmBooking}
                  disabled={booking}
                >
                  {booking
                    ? 'Booking...'
                    : effectivePaymentMethod === 'VNPAY'
                      ? 'Create VNPay Booking'
                      : effectivePaymentMethod === 'MONTHLY_PASS'
                        ? 'Confirm Monthly Pass Booking'
                        : 'Confirm Cash Booking'}
                </button>
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
                  <span>
                    {effectivePaymentMethod === 'VNPAY'
                      ? 'VNPay bookings open the sandbox checkout immediately. Your booking stays pending until VNPay confirms it.'
                      : effectivePaymentMethod === 'MONTHLY_PASS'
                        ? 'This booking is covered by your active monthly pass, so no checkout payment is required.'
                        : 'Cash bookings are reserved now and paid when you check out.'}
                  </span>
                </div>
          </div>
        </div>
      </div>
    </>
  );
}
