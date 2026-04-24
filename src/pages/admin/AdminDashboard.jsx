import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/shared/StatCard';
import {
  ParkingSquare, Car, TrendingUp, Users, CalendarCheck,
  CreditCard, Ticket, ArrowUpRight, ArrowDownRight, Clock, MapPin
} from 'lucide-react';
import { dashboardStats, formatCurrency, bookings, parkingLots, revenueByDay, parkingRecords } from '../../data/sampleData';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const stats = dashboardStats;
  const maxRevenue = Math.max(...revenueByDay.map(d => d.amount));

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard icon={ParkingSquare} label="Total Slots" value={stats.totalSlots} color="primary" subtitle={`${stats.totalLots} parking lots`} />
          <StatCard icon={Car} label="Occupied" value={stats.occupiedSlots} color="red" trend={-3.2} subtitle={`${stats.occupancyRate}% occupancy`} />
          <StatCard icon={TrendingUp} label="Today's Revenue" value={formatCurrency(stats.totalRevenueToday)} color="green" trend={12.5} />
          <StatCard icon={CalendarCheck} label="Active Bookings" value={stats.totalBookingsToday} color="blue" subtitle="Today" />
          <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="primary" />
          <StatCard icon={Ticket} label="Active Passes" value={stats.activeMonthlyPasses} color="orange" />
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
                <span className="display-lg">{formatCurrency(stats.totalRevenueMonth)}</span>
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
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            <div className="lots-list">
              {parkingLots.map((lot) => {
                const occupancy = Math.round(((lot.occupiedSlots + lot.reservedSlots) / lot.totalSlots) * 100);
                return (
                  <div key={lot.id} className="lot-item">
                    <div className="lot-item-info">
                      <div className="lot-item-icon">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="lot-item-name">{lot.name}</div>
                        <div className="lot-item-meta">
                          <span className="badge badge-available">{lot.availableSlots} free</span>
                          <span className="lot-item-total">{lot.totalSlots} total</span>
                        </div>
                      </div>
                    </div>
                    <div className="lot-item-bar-wrap">
                      <div className="lot-item-bar">
                        <div className="lot-item-bar-fill" style={{ width: `${occupancy}%` }} />
                      </div>
                      <span className="lot-item-percent">{occupancy}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card dashboard-activity-card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Recent Activity</h3>
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            <div className="activity-list">
              {[
                { icon: CalendarCheck, text: 'New booking by Le Van C', sub: 'Central Plaza • A06', time: '5 min ago', color: 'green' },
                { icon: Car, text: 'Vehicle checked in', sub: '29A-12345 • Vincom Tower', time: '15 min ago', color: 'blue' },
                { icon: CreditCard, text: 'Payment received', sub: '₫160,000 • Cash', time: '1 hr ago', color: 'green' },
                { icon: ArrowDownRight, text: 'Booking cancelled', sub: 'Le Van C • University Lot', time: '2 hr ago', color: 'red' },
                { icon: Ticket, text: 'Monthly pass activated', sub: 'Le Van C • Motorbike', time: '3 hr ago', color: 'orange' },
                { icon: Car, text: 'Vehicle checked out', sub: '43H-22222 • University Lot', time: '5 hr ago', color: 'blue' },
              ].map((item, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-icon activity-icon-${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="activity-info">
                    <span className="activity-text">{item.text}</span>
                    <span className="activity-sub">{item.sub}</span>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Check-ins */}
          <div className="card dashboard-checkins-card">
            <div className="dashboard-card-header">
              <h3 className="headline-sm">Active Check-ins</h3>
              <span className="badge badge-active">{parkingRecords.filter(r => r.status === 'CHECKED_IN').length} active</span>
            </div>
            <div className="checkins-list">
              {parkingRecords.filter(r => r.status === 'CHECKED_IN').map((record) => (
                <div key={record.id} className="checkin-item">
                  <div className="checkin-vehicle">
                    <Car size={18} />
                    <div>
                      <div className="title-md">{record.vehicle.plateNumber}</div>
                      <div className="body-sm">{record.parkingLot.name} • {record.slot.slotNumber}</div>
                    </div>
                  </div>
                  <div className="checkin-time">
                    <Clock size={14} />
                    <span>{new Date(record.checkInTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
