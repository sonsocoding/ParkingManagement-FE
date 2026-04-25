import { useState, useEffect } from 'react';
import { bookingService, recordService, lotService, paymentService } from '../../../api/index';

export function useUserDashboard() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [activeRecords, setActiveRecords] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [totalSpentThisMonth, setTotalSpentThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [bookingsRes, recordsRes, lotsRes, paymentsRes] = await Promise.all([
          bookingService.getMyBookings(),
          recordService.getMyRecords(),
          lotService.getAllLots(),
          paymentService.getMyPayments()
        ]);
        
        if (!isMounted) return;

        const myBookings = bookingsRes.data?.bookings || [];
        setActiveBookings(myBookings.filter(b => b.status === 'CONFIRMED'));
        
        const myRecords = recordsRes.data?.records || [];
        setActiveRecords(myRecords.filter(r => r.status === 'CHECKED_IN'));
        
        setParkingLots(lotsRes.data?.parkingLots || []);
        
        // Calculate total spent this month
        const myPayments = paymentsRes.data?.payments || [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const spent = myPayments.reduce((acc, p) => {
          const payDate = new Date(p.createdAt);
          if (p.status === 'SUCCESS' && payDate >= startOfMonth) {
            return acc + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount);
          }
          return acc;
        }, 0);
        
        setTotalSpentThisMonth(spent);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return {
    activeBookings,
    activeRecords,
    parkingLots,
    totalSpentThisMonth,
    loading
  };
}
