import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/shared/StatCard';
import {
  ParkingSquare, Car, TrendingUp, Users, CalendarCheck,
  CreditCard, Ticket, ArrowUpRight, ArrowDownRight, Clock, MapPin
} from 'lucide-react';
import { useAllLots } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/formatters';
import { recordService } from '../../api/index';
import '../../styles/pages/admin/AdminDashboard.css';

// Revenue sparkline uses static data until BE provides a /admin/stats endpoint
const revenueByDay = [
  { date: '04/19', amount: 380000 },
  { date: '04/20', amount: 420000 },
  { date: '04/21', amount: 310000 },
  { date: '04/22', amount: 550000 },
  { date: '04/23', amount: 480000 },
  { date: '04/24', amount: 331000 },
  { date: '04/25', amount: 270000 },
];

export default function AdminDashboard() {
  const { lots, loading: lotsLoading } = useAllLots();
  const [activeRecords, setActiveRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  useEffect(() => {
    recordService.getAllRecords()
      .then((res) => {
        const parkingRecords = Array.isArray(res.data?.parkingRecords) ? res.data.parkingRecords : [];
        setActiveRecords(parkingRecords.filter((parkingRecord) => parkingRecord.status === 'CHECKED_IN'));
      })
      .catch(() => {})
      .finally(() => setRecordsLoading(false));
  }, []);

  const maxRevenue = Math.max(...revenueByDay.map(d => d.amount));

  // Aggregate stats from lots
  const totalSlots = lots.reduce((s, l) => s + (l.totalSlots || 0), 0);
  const occupiedSlots = lots.reduce((s, l) => s + (l.occupiedSlots || 0), 0);
  const availableSlots = lots.reduce((s, l) => s + (l.availableSlots || 0), 0);
  const occupancyRate = totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0;

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard icon={ParkingSquare} label="Total Slots" value={totalSlots} color="primary" subtitle={`${lots.length} parking lots`} />
          <StatCard icon={Car} label="Occupied" value={occupiedSlots} color="red" subtitle={`${occupancyRate}% occupancy`} />
          <StatCard icon={TrendingUp} label="Today's Revenue" value={formatCurrency(revenueByDay.at(-1)?.amount || 0)} color="green" trend={12.5} />
          <StatCard icon={CalendarCheck} label="Active Check-ins" value={activeRecords.length} color="blue" subtitle="Right now" />
          <StatCard icon={Users} label="Available Slots" value={availableSlots} color="primary" />
        </div>

        <div className="dashboard-grid">
          {/* Revenue Chart */}
          <div className="card dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h3 className="headline-sm">Revenue Overview</h3>
                <p className="body-sm">Last 7 days</p>
              </div>
              <div className="dashboard-card-total">
                <span className="display-lg">{formatCurrency(revenueByDay.reduce((s, d) => s + d.amount, 0))}</span>
                <span className="body-sm" style={{ color: 'var(--color-available)' }}>
                  <ArrowUpRight size={14} /> +12.5% vs last month
                </span>
              </div>
            </div>
            <div className="chart-bars">
              {revenueByDay.map((day, i) => (
                <div key={i} className="chart-bar-group">
                  <div className="chart-bar-wrap">
                    <div
                      className="chart-bar"
                      style={{ height: `${(day.amount / maxRevenue) * 100}%` }}
                    >
                      <span className="chart-bar-tooltip">{formatCurrency(day.amount)}</span>
                    </div>
                  </div>
                  <span className="chart-bar-label">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parking Lots Overview */}
          <div className="card dashboard-lots-card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Parking Lots</h3>
            </div>
            {lotsLoading ? <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>Loading...</p> : (
              <div className="lots-list">
                {lots.map((lot) => {
                  const occ = Math.round(((lot.occupiedSlots || 0) + (lot.reservedSlots || 0)) / Math.max(lot.totalSlots, 1) * 100);
                  return (
                    <div key={lot.id} className="lot-item">
                      <div className="lot-item-info">
                        <div className="lot-item-icon"><MapPin size={18} /></div>
                        <div>
                          <div className="lot-item-name">{lot.name}</div>
                          <div className="lot-item-meta">
                            <span className="badge badge-available">{lot.availableSlots ?? '—'} free</span>
                            <span className="lot-item-total">{lot.totalSlots} total</span>
                          </div>
                        </div>
                      </div>
                      <div className="lot-item-bar-wrap">
                        <div className="lot-item-bar">
                          <div className="lot-item-bar-fill" style={{ width: `${occ}%` }} />
                        </div>
                        <span className="lot-item-percent">{occ}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Check-ins */}
          <div className="card dashboard-checkins-card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Active Check-ins</h3>
              <span className="badge badge-active">{activeRecords.length} active</span>
            </div>
            <div className="checkins-list">
              {recordsLoading && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>Loading...</p>}
              {activeRecords.map((record) => (
                <div key={record.id} className="checkin-item">
                  <div className="checkin-vehicle">
                    <Car size={18} />
                    <div>
                      <div className="title-md">{record.vehicle?.plateNumber}</div>
                      <div className="body-sm">{record.parkingLot?.name} • {record.slot?.slotNumber}</div>
                    </div>
                  </div>
                  <div className="checkin-time">
                    <Clock size={14} />
                    <span>{new Date(record.checkInTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              {!recordsLoading && activeRecords.length === 0 && (
                <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px' }}>No active check-ins.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
