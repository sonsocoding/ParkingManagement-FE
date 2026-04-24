// Sample data mirroring the backend models for UI development

export const currentUser = {
  id: 'cluser001',
  email: 'nguyen.van.a@example.com',
  fullName: 'Nguyen Van A',
  phone: '0901234567',
  role: 'ADMIN', // Change to 'USER' or 'MANAGER' to test different views
  createdAt: '2025-01-15T08:00:00Z',
};

export const users = [
  { id: 'cluser001', email: 'nguyen.van.a@example.com', fullName: 'Nguyen Van A', phone: '0901234567', role: 'ADMIN', createdAt: '2025-01-15T08:00:00Z' },
  { id: 'cluser002', email: 'tran.thi.b@example.com', fullName: 'Tran Thi B', phone: '0912345678', role: 'MANAGER', createdAt: '2025-02-20T10:30:00Z' },
  { id: 'cluser003', email: 'le.van.c@example.com', fullName: 'Le Van C', phone: '0923456789', role: 'USER', createdAt: '2025-03-10T14:00:00Z' },
  { id: 'cluser004', email: 'pham.thi.d@example.com', fullName: 'Pham Thi D', phone: '0934567890', role: 'USER', createdAt: '2025-03-25T09:15:00Z' },
  { id: 'cluser005', email: 'hoang.van.e@example.com', fullName: 'Hoang Van E', phone: '0945678901', role: 'USER', createdAt: '2025-04-01T16:45:00Z' },
];

export const vehicles = [
  { id: 'clveh001', userId: 'cluser003', plateNumber: '29A-12345', vehicleType: 'CAR', color: 'White' },
  { id: 'clveh002', userId: 'cluser003', plateNumber: '30F-67890', vehicleType: 'MOTORBIKE', color: 'Red' },
  { id: 'clveh003', userId: 'cluser004', plateNumber: '51G-11111', vehicleType: 'CAR', color: 'Black' },
  { id: 'clveh004', userId: 'cluser005', plateNumber: '43H-22222', vehicleType: 'MOTORBIKE', color: 'Blue' },
  { id: 'clveh005', userId: 'cluser004', plateNumber: '29B-33333', vehicleType: 'CAR', color: 'Silver' },
];

export const parkingLots = [
  {
    id: 'cllot001',
    name: 'Central Plaza Parking',
    address: '123 Le Loi Street, District 1, HCMC',
    totalSlots: 120,
    lotType: 'BOTH',
    carHourlyRate: '15000',
    motorbikeHourlyRate: '5000',
    zones: ['A', 'B', 'C'],
    availableSlots: 45,
    occupiedSlots: 55,
    reservedSlots: 12,
    maintenanceSlots: 8,
  },
  {
    id: 'cllot002',
    name: 'Vincom Tower Garage',
    address: '72 Le Thanh Ton, District 1, HCMC',
    totalSlots: 80,
    lotType: 'CAR_ONLY',
    carHourlyRate: '20000',
    motorbikeHourlyRate: '0',
    zones: ['P1', 'P2'],
    availableSlots: 28,
    occupiedSlots: 42,
    reservedSlots: 6,
    maintenanceSlots: 4,
  },
  {
    id: 'cllot003',
    name: 'University Campus Lot',
    address: '268 Ly Thuong Kiet, District 10, HCMC',
    totalSlots: 200,
    lotType: 'MOTORBIKE_ONLY',
    carHourlyRate: '0',
    motorbikeHourlyRate: '3000',
    zones: ['M1', 'M2', 'M3', 'M4'],
    availableSlots: 95,
    occupiedSlots: 80,
    reservedSlots: 15,
    maintenanceSlots: 10,
  },
];

const slotStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'];

function generateSlots(lotId, zones, count, vehicleType) {
  const slots = [];
  let slotIdx = 0;
  const perZone = Math.ceil(count / zones.length);
  zones.forEach((zone) => {
    for (let i = 1; i <= perZone && slotIdx < count; i++, slotIdx++) {
      const rand = Math.random();
      let status;
      if (rand < 0.4) status = 'AVAILABLE';
      else if (rand < 0.75) status = 'OCCUPIED';
      else if (rand < 0.9) status = 'RESERVED';
      else status = 'MAINTENANCE';
      slots.push({
        id: `clslot-${lotId}-${slotIdx}`,
        parkingLotId: lotId,
        zoneId: zone,
        slotNumber: `${zone}${String(i).padStart(2, '0')}`,
        vehicleType: vehicleType === 'BOTH' ? (i % 3 === 0 ? 'MOTORBIKE' : 'CAR') : vehicleType,
        status,
      });
    }
  });
  return slots;
}

export const parkingSlots = {
  cllot001: generateSlots('cllot001', ['A', 'B', 'C'], 120, 'BOTH'),
  cllot002: generateSlots('cllot002', ['P1', 'P2'], 80, 'CAR'),
  cllot003: generateSlots('cllot003', ['M1', 'M2', 'M3', 'M4'], 200, 'MOTORBIKE'),
};

export const bookings = [
  {
    id: 'clbook001',
    userId: 'cluser003',
    vehicleId: 'clveh001',
    parkingSlotId: 'clslot-cllot001-5',
    parkingLotId: 'cllot001',
    startTime: '2025-04-24T08:00:00Z',
    endTime: '2025-04-24T12:00:00Z',
    estimatedCost: '60000',
    status: 'CONFIRMED',
    vehicle: { plateNumber: '29A-12345', vehicleType: 'CAR' },
    parkingLot: { name: 'Central Plaza Parking' },
    slot: { slotNumber: 'A06' },
    user: { fullName: 'Le Van C' },
  },
  {
    id: 'clbook002',
    userId: 'cluser004',
    vehicleId: 'clveh003',
    parkingSlotId: 'clslot-cllot002-2',
    parkingLotId: 'cllot002',
    startTime: '2025-04-24T09:00:00Z',
    endTime: '2025-04-24T17:00:00Z',
    estimatedCost: '160000',
    status: 'CONFIRMED',
    vehicle: { plateNumber: '51G-11111', vehicleType: 'CAR' },
    parkingLot: { name: 'Vincom Tower Garage' },
    slot: { slotNumber: 'P102' },
    user: { fullName: 'Pham Thi D' },
  },
  {
    id: 'clbook003',
    userId: 'cluser005',
    vehicleId: 'clveh004',
    parkingSlotId: 'clslot-cllot003-10',
    parkingLotId: 'cllot003',
    startTime: '2025-04-23T07:00:00Z',
    endTime: '2025-04-23T18:00:00Z',
    estimatedCost: '33000',
    status: 'COMPLETED',
    vehicle: { plateNumber: '43H-22222', vehicleType: 'MOTORBIKE' },
    parkingLot: { name: 'University Campus Lot' },
    slot: { slotNumber: 'M108' },
    user: { fullName: 'Hoang Van E' },
  },
  {
    id: 'clbook004',
    userId: 'cluser003',
    vehicleId: 'clveh002',
    parkingSlotId: 'clslot-cllot003-15',
    parkingLotId: 'cllot003',
    startTime: '2025-04-22T10:00:00Z',
    endTime: '2025-04-22T16:00:00Z',
    estimatedCost: '18000',
    status: 'CANCELLED',
    vehicle: { plateNumber: '30F-67890', vehicleType: 'MOTORBIKE' },
    parkingLot: { name: 'University Campus Lot' },
    slot: { slotNumber: 'M215' },
    user: { fullName: 'Le Van C' },
  },
  {
    id: 'clbook005',
    userId: 'cluser004',
    vehicleId: 'clveh005',
    parkingSlotId: 'clslot-cllot001-20',
    parkingLotId: 'cllot001',
    startTime: '2025-04-25T14:00:00Z',
    endTime: '2025-04-25T18:00:00Z',
    estimatedCost: '60000',
    status: 'CONFIRMED',
    vehicle: { plateNumber: '29B-33333', vehicleType: 'CAR' },
    parkingLot: { name: 'Central Plaza Parking' },
    slot: { slotNumber: 'B08' },
    user: { fullName: 'Pham Thi D' },
  },
];

export const payments = [
  { id: 'clpay001', userId: 'cluser003', bookingId: 'clbook001', amount: '60000', method: 'CASH', status: 'PENDING', createdAt: '2025-04-24T08:00:00Z', user: { fullName: 'Le Van C' } },
  { id: 'clpay002', userId: 'cluser004', bookingId: 'clbook002', amount: '160000', method: 'CASH', status: 'PENDING', createdAt: '2025-04-24T09:00:00Z', user: { fullName: 'Pham Thi D' } },
  { id: 'clpay003', userId: 'cluser005', bookingId: 'clbook003', amount: '33000', method: 'CASH', status: 'SUCCESS', createdAt: '2025-04-23T07:00:00Z', user: { fullName: 'Hoang Van E' } },
  { id: 'clpay004', userId: 'cluser003', bookingId: 'clbook004', amount: '18000', method: 'CASH', status: 'FAILED', createdAt: '2025-04-22T10:00:00Z', user: { fullName: 'Le Van C' } },
  { id: 'clpay005', userId: 'cluser004', bookingId: 'clbook005', amount: '60000', method: 'CASH', status: 'PENDING', createdAt: '2025-04-25T14:00:00Z', user: { fullName: 'Pham Thi D' } },
  { id: 'clpay006', userId: 'cluser003', monthlyPassId: 'clpass001', amount: '300000', method: 'CASH', status: 'SUCCESS', createdAt: '2025-04-01T08:00:00Z', user: { fullName: 'Le Van C' } },
];

export const parkingRecords = [
  {
    id: 'clrec001', userId: 'cluser003', vehicleId: 'clveh001', parkingLotId: 'cllot001', parkingSlotId: 'clslot-cllot001-5',
    bookingId: 'clbook001', checkInTime: '2025-04-24T08:05:00Z', checkOutTime: null, actualCost: null,
    paymentStatus: 'PENDING', status: 'CHECKED_IN',
    vehicle: { plateNumber: '29A-12345', vehicleType: 'CAR' },
    parkingLot: { name: 'Central Plaza Parking' },
    slot: { slotNumber: 'A06' },
  },
  {
    id: 'clrec002', userId: 'cluser005', vehicleId: 'clveh004', parkingLotId: 'cllot003', parkingSlotId: 'clslot-cllot003-10',
    bookingId: 'clbook003', checkInTime: '2025-04-23T07:10:00Z', checkOutTime: '2025-04-23T17:45:00Z', actualCost: '31500',
    paymentStatus: 'SUCCESS', status: 'CHECKED_OUT',
    vehicle: { plateNumber: '43H-22222', vehicleType: 'MOTORBIKE' },
    parkingLot: { name: 'University Campus Lot' },
    slot: { slotNumber: 'M108' },
  },
  {
    id: 'clrec003', userId: 'cluser004', vehicleId: 'clveh003', parkingLotId: 'cllot002', parkingSlotId: 'clslot-cllot002-2',
    checkInTime: '2025-04-24T09:15:00Z', checkOutTime: null, actualCost: null,
    paymentStatus: 'PENDING', status: 'CHECKED_IN',
    vehicle: { plateNumber: '51G-11111', vehicleType: 'CAR' },
    parkingLot: { name: 'Vincom Tower Garage' },
    slot: { slotNumber: 'P102' },
  },
];

export const monthlyPasses = [
  {
    id: 'clpass001', userId: 'cluser003', vehicleType: 'MOTORBIKE',
    startDate: '2025-04-01T00:00:00Z', endDate: '2025-04-30T23:59:59Z',
    price: '300000', status: 'ACTIVE',
    user: { fullName: 'Le Van C' },
  },
  {
    id: 'clpass002', userId: 'cluser004', vehicleType: 'CAR',
    startDate: '2025-03-01T00:00:00Z', endDate: '2025-03-31T23:59:59Z',
    price: '1200000', status: 'EXPIRED',
    user: { fullName: 'Pham Thi D' },
  },
];

// Dashboard stats
export const dashboardStats = {
  totalLots: 3,
  totalSlots: 400,
  occupiedSlots: 177,
  availableSlots: 168,
  reservedSlots: 33,
  maintenanceSlots: 22,
  totalBookingsToday: 5,
  totalRevenueToday: '331000',
  totalRevenueMonth: '8750000',
  totalUsers: 5,
  activeMonthlyPasses: 1,
  occupancyRate: 44.25,
};

// Revenue data for charts
export const revenueByDay = [
  { date: '04/18', amount: 250000 },
  { date: '04/19', amount: 380000 },
  { date: '04/20', amount: 420000 },
  { date: '04/21', amount: 310000 },
  { date: '04/22', amount: 550000 },
  { date: '04/23', amount: 480000 },
  { date: '04/24', amount: 331000 },
];

// Format helpers
export function formatCurrency(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
}

export function getRelativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatDate(dateStr);
}
