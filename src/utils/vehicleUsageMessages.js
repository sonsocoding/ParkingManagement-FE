const VEHICLE_USAGE_MESSAGES = {
  bookingConflict:
    'This vehicle already has an active booking. Cancel or complete that booking before using this vehicle again.',
  checkedInConflict:
    'This vehicle is already checked in at a parking lot. Check it out before creating another booking or parking session.',
  activeUsageConflict:
    'This vehicle already has another active booking or parking session.',
};

export function getVehicleUsageMessage(message, fallback) {
  if (message === 'Vehicle already has an active booking') {
    return VEHICLE_USAGE_MESSAGES.bookingConflict;
  }
  if (message === 'Vehicle is already checked in') {
    return VEHICLE_USAGE_MESSAGES.checkedInConflict;
  }
  if (message === 'Vehicle already has another active usage') {
    return VEHICLE_USAGE_MESSAGES.activeUsageConflict;
  }

  return message || fallback;
}
