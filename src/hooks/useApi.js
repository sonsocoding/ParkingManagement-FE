import { useState, useEffect } from 'react';
import {
  userService,
  vehicleService,
  lotService,
  bookingService,
  recordService,
  paymentService,
  passService,
} from '../api/index';
import {
  normalizeBookingsPayload,
  normalizeLotPayload,
  normalizeLotsPayload,
  normalizePassesPayload,
  normalizePaymentsPayload,
  normalizeRecordsPayload,
  normalizeSlotsPayload,
  normalizeUsersPayload,
  normalizeVehiclesPayload,
} from '../utils/apiNormalizers';

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
  return { parkingLots: normalizeLotsPayload(data), loading, error };
}

export function useParkingLot(id) {
  const { data, loading, error } = useFetchData(
    id ? () => lotService.getLotById(id) : null,
    [id]
  );
  return { parkingLot: normalizeLotPayload(data), loading, error };
}

export function useLotSlots(lotId) {
  const { data, loading, error } = useFetchData(
    lotId ? () => lotService.getSlotsByLotId(lotId) : null,
    [lotId]
  );
  return { parkingSlots: normalizeSlotsPayload(data), loading, error };
}

export function useMyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    vehicleService.getMyVehicles()
      .then((res) => { if (isMounted) setVehicles(normalizeVehiclesPayload(res.data)); })
      .catch(err => { if (isMounted) setError(err.message || 'Error'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return { vehicles, setVehicles, loading, error };
}

export function useMyBookings() {
  const { data, loading, error } = useFetchData(bookingService.getMyBookings, []);
  return { bookings: normalizeBookingsPayload(data), loading, error };
}

export function useMyPayments() {
  const { data, loading, error } = useFetchData(paymentService.getMyPayments, []);
  return { payments: normalizePaymentsPayload(data), loading, error };
}

export function useMyRecords() {
  const { data, loading, error } = useFetchData(recordService.getMyRecords, []);
  return { parkingRecords: normalizeRecordsPayload(data), loading, error };
}

export function useMyPasses() {
  const { data, loading, error } = useFetchData(passService.getMyPasses, []);
  return { monthlyPasses: normalizePassesPayload(data), loading, error };
}

export function useAllUsers() {
  const { data, loading, error } = useFetchData(userService.getAllUsers, []);
  return { users: normalizeUsersPayload(data), loading, error };
}

export function useAllLots() {
  const { data, loading, error } = useFetchData(lotService.getAllLots, []);
  return { lots: normalizeLotsPayload(data), loading, error };
}

export function useAllBookings() {
  const { data, loading, error } = useFetchData(bookingService.getAllBookings, []);
  return { bookings: normalizeBookingsPayload(data), loading, error };
}

export function useAllPayments() {
  const { data, loading, error } = useFetchData(paymentService.getAllPayments, []);
  return { payments: normalizePaymentsPayload(data), loading, error };
}

export function useAllRecords() {
  const { data, loading, error } = useFetchData(recordService.getAllRecords, []);
  return { parkingRecords: normalizeRecordsPayload(data), loading, error };
}

export function useAllPasses() {
  const { data, loading, error } = useFetchData(passService.getAllPasses, []);
  return { monthlyPasses: normalizePassesPayload(data), loading, error };
}
