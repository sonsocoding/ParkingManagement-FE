function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeLotsPayload(data) {
  return ensureArray(data?.parkingLots);
}

export function normalizeLotPayload(data) {
  return data?.parkingLot ?? null;
}

export function normalizeSlotsPayload(data) {
  return ensureArray(data?.parkingSlots);
}

export function normalizeUsersPayload(data) {
  return ensureArray(data?.users);
}

export function normalizeVehiclesPayload(data) {
  return ensureArray(data?.vehicles);
}

export function normalizeBookingsPayload(data) {
  return ensureArray(data?.bookings);
}

export function normalizeRecordsPayload(data) {
  return ensureArray(data?.parkingRecords);
}

export function normalizePassesPayload(data) {
  return ensureArray(data?.monthlyPasses);
}

export function normalizePaymentsPayload(data) {
  return ensureArray(data?.payments);
}
