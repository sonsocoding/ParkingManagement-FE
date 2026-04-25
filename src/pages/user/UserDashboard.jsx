import TopBar from '../../components/layout/TopBar';
import StatCard from '../../components/shared/StatCard';
import { CalendarCheck, CreditCard, ParkingSquare } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import QuickActions from './components/QuickActions';
import ActiveBookingsList from './components/ActiveBookingsList';
import AvailableLotsList from './components/AvailableLotsList';
import { useUserDashboard } from './hooks/useUserDashboard';
import '../../styles/pages/user/UserDashboard.css';

export default function UserDashboard() {
  const { 
    activeBookings, 
    activeRecords, 
    parkingLots, 
    totalSpentThisMonth,
    loading
  } = useUserDashboard();

  if (loading) {
    return (
      <>
        <TopBar title="Dashboard" subtitle="Overview of your parking activity" />
        <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of your parking activity" />
      <div className="page-content">
        <QuickActions activeBookingsCount={activeBookings.length} />

        {/* Stats */}
        <div className="stats-grid dashboard-stats-grid">
          <StatCard 
            icon={CalendarCheck} 
            label="Active Bookings" 
            value={activeBookings.length} 
            color="green" 
          />
          <StatCard 
            icon={ParkingSquare} 
            label="Checked In" 
            value={activeRecords.length} 
            color="blue" 
          />
          <StatCard 
            icon={CreditCard} 
            label="Total Spent" 
            value={formatCurrency(totalSpentThisMonth.toString())} 
            color="primary" 
            subtitle="This month" 
          />
        </div>

        <div className="dashboard-grid">
          <ActiveBookingsList bookings={activeBookings} />
          <AvailableLotsList lots={parkingLots} />
        </div>
      </div>
    </>
  );
}
