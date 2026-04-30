import { useEffect, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/shared/StatCard';
import {
  ParkingSquare, Car, TrendingUp, Users, CalendarCheck, Clock, MapPin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAllLots } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/formatters';
import { paymentService, recordService } from '../../api/index';
import '../../styles/pages/admin/AdminDashboard.css';

const buildDefaultRevenueOverview = () => ({
  todayRevenue: 0,
  totalRevenue: 0,
  weekOffset: 0,
  dateRangeLabel: '',
  dailyRevenue: Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));

    return {
      date: new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
      }).format(day),
      amount: 0,
    };
  }),
});

export default function AdminDashboard() {
  const { lots, loading: lotsLoading } = useAllLots();
  const [activeRecords, setActiveRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [revenueOverview, setRevenueOverview] = useState(buildDefaultRevenueOverview);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    recordService.getAllRecords()
      .then((res) => {
        const parkingRecords = Array.isArray(res.data?.parkingRecords) ? res.data.parkingRecords : [];
        setActiveRecords(parkingRecords.filter((parkingRecord) => parkingRecord.status === 'CHECKED_IN'));
      })
      .catch(() => {})
      .finally(() => setRecordsLoading(false));
  }, []);

  useEffect(() => {
    paymentService.getRevenueOverview(7, 0)
      .then((res) => {
        const overview = res.data?.revenueOverview;
        setTodayRevenue(Number(overview?.todayRevenue) || 0);
      })
      .catch(() => {
        setTodayRevenue(0);
      });
  }, []);

  useEffect(() => {
    setRevenueLoading(true);
    paymentService.getRevenueOverview(7, weekOffset)
      .then((res) => {
        const overview = res.data?.revenueOverview;
        if (!overview || !Array.isArray(overview.dailyRevenue)) {
          throw new Error('Invalid revenue overview payload');
        }

        setRevenueOverview({
          todayRevenue: Number(overview.todayRevenue) || 0,
          totalRevenue: Number(overview.totalRevenue) || 0,
          weekOffset: Number(overview.weekOffset) || 0,
          dateRangeLabel: overview.dateRangeLabel || '',
          dailyRevenue: overview.dailyRevenue.map((day) => ({
            date: day.date,
            amount: Number(day.amount) || 0,
          })),
        });
        setRevenueError('');
      })
      .catch(() => {
        setRevenueOverview(buildDefaultRevenueOverview());
        setRevenueError('Unable to load revenue right now.');
      })
      .finally(() => setRevenueLoading(false));
  }, [weekOffset]);

  const maxRevenue = Math.max(...revenueOverview.dailyRevenue.map((day) => day.amount), 0);
  const revenueWindowLabel = revenueOverview.dateRangeLabel || 'Last 7 days';

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
        <div className="stats-grid">
          <StatCard icon={ParkingSquare} label="Total Slots" value={totalSlots} color="primary" />
          <StatCard icon={Car} label="Occupied" value={occupiedSlots} color="red" />
          <StatCard
            icon={TrendingUp}
            label="Today's Revenue"
            value={formatCurrency(todayRevenue)}
            color="green"
          />
          <StatCard icon={CalendarCheck} label="Active Check-ins" value={activeRecords.length} color="blue" />
          <StatCard icon={Users} label="Available Slots" value={availableSlots} color="primary" />
        </div>

        <div className="dashboard-grid">
          <div className="card dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h3 className="headline-sm">Revenue Overview</h3>
                <div className="revenue-toolbar">
                  <p className="body-sm">{revenueWindowLabel}</p>
                  <div className="revenue-nav">
                    <button
                      type="button"
                      className="revenue-nav-button"
                      onClick={() => setWeekOffset((current) => current + 1)}
                      aria-label="Show previous week"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      className="revenue-nav-button"
                      onClick={() => setWeekOffset((current) => Math.max(current - 1, 0))}
                      disabled={weekOffset === 0}
                      aria-label="Show next week"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="dashboard-card-total">
                <span className="display-lg">{formatCurrency(revenueOverview.totalRevenue)}</span>
                <span className="body-sm revenue-card-caption">Successful payments only</span>
              </div>
            </div>
            {revenueError && <p className="revenue-card-error">{revenueError}</p>}
            <div className="chart-bars">
              {revenueOverview.dailyRevenue.map((day) => (
                <div key={day.date} className="chart-bar-group">
                  <div className="chart-bar-wrap">
                    <div
                      className="chart-bar"
                      style={{ height: `${maxRevenue > 0 ? (day.amount / maxRevenue) * 100 : 0}%` }}
                    >
                      <span className="chart-bar-tooltip">{formatCurrency(day.amount)}</span>
                    </div>
                  </div>
                  <span className="chart-bar-label">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

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
