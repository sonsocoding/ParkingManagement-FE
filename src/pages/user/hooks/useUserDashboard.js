import { bookings, parkingRecords, parkingLots } from '../../../data/sampleData';

export function useUserDashboard() {
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const activeRecords = parkingRecords.filter(r => r.status === 'CHECKED_IN');
  // Mock total spent, this should normally come from an API endpoint
  const totalSpentThisMonth = 331000; 

  return {
    activeBookings,
    activeRecords,
    parkingLots,
    totalSpentThisMonth
  };
}
