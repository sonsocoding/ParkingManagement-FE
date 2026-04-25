import { useState, useEffect, useCallback } from 'react';
import {
  userService,
  vehicleService,
  lotService,
  bookingService,
  recordService,
  paymentService,
  passService,
} from '../api/index';

// Generic data fetching hook
export function useFetchData(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiCall) return;
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await apiCall();
        if (isMounted) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, setData };
}

export function useParkingLots() {
  const { data, loading, error } = useFetchData(lotService.getAllLots, []);
  return { parkingLots: data?.parkingLots || [], loading, error };
}

export function useParkingLot(id) {
  const { data, loading, error } = useFetchData(
    id ? () => lotService.getLotById(id) : null,
    [id]
  );
  return { lot: data?.parkingLot || null, loading, error };
}

export function useLotSlots(lotId) {
  const { data, loading, error } = useFetchData(
    lotId ? () => lotService.getSlotsByLotId(lotId) : null,
    [lotId]
  );
  return { slots: data?.parkingSlots || [], loading, error };
}

export function useMyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    vehicleService.getMyVehicles()
      .then(res => { if (isMounted) setVehicles(res.data?.vehicles || []); })
      .catch(err => { if (isMounted) setError(err.message || 'Error'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return { vehicles, setVehicles, loading, error };
}

export function useMyBookings() {
  const { data, loading, error } = useFetchData(bookingService.getMyBookings, []);
  return { bookings: data?.bookings || [], loading, error };
}

export function useMyPayments() {
  const { data, loading, error } = useFetchData(paymentService.getMyPayments, []);
  return { payments: data?.payments || [], loading, error };
}

export function useMyRecords() {
  const { data, loading, error } = useFetchData(recordService.getMyRecords, []);
  return { records: data?.records || [], loading, error };
}

export function useMyPasses() {
  const { data, loading, error } = useFetchData(passService.getMyPasses, []);
  return { passes: data?.monthlyPasses || [], loading, error };
}

export function useAllUsers() {
  const { data, loading, error } = useFetchData(userService.getAllUsers, []);
  return { users: data?.users || [], loading, error };
}

export function useAllLots() {
  const { data, loading, error } = useFetchData(lotService.getAllLots, []);
  return { lots: data?.parkingLots || [], loading, error };
}

export function useAllBookings() {
  const { data, loading, error } = useFetchData(bookingService.getAllBookings, []);
  return { bookings: data?.bookings || [], loading, error };
}

export function useAllPayments() {
  const { data, loading, error } = useFetchData(paymentService.getAllPayments, []);
  return { payments: data?.payments || [], loading, error };
}

export function useAllRecords() {
  const { data, loading, error } = useFetchData(recordService.getAllRecords, []);
  return { records: data?.records || [], loading, error };
}

export function useAllPasses() {
  const { data, loading, error } = useFetchData(passService.getAllPasses, []);
  return { passes: data?.monthlyPasses || [], loading, error };
}
