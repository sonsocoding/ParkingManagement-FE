function toZoneList(zones) {
  if (!zones) return [];
  if (Array.isArray(zones)) return zones;
  if (typeof zones === 'object') {
    if ('carZones' in zones || 'motoZones' in zones) {
      return [...(zones.carZones || []), ...(zones.motoZones || [])];
    }
    return [zones];
  }
  return [zones];
}

export function getZoneKey(zone) {
  if (zone == null) return '';
  if (typeof zone === 'string' || typeof zone === 'number') return String(zone);
  if (typeof zone === 'object') {
    return String(zone.zoneId ?? zone.name ?? zone.id ?? '');
  }
  return String(zone);
}

export function getZoneLabel(zone) {
  if (zone == null) return '';
  if (typeof zone === 'string' || typeof zone === 'number') return String(zone);
  if (typeof zone === 'object') {
    return String(zone.name ?? zone.zoneId ?? zone.id ?? '');
  }
  return String(zone);
}

export function normalizeZones(zones) {
  const seen = new Set();

  return toZoneList(zones)
    .map((zone) => ({
      key: getZoneKey(zone),
      label: getZoneLabel(zone),
    }))
    .filter((zone) => {
      if (!zone.key || seen.has(zone.key)) return false;
      seen.add(zone.key);
      return true;
    });
}

const slotNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

export function sortParkingSlotsByNumber(slots) {
  return [...slots].sort((left, right) => {
    const slotNumberComparison = slotNumberCollator.compare(
      String(left?.slotNumber ?? ''),
      String(right?.slotNumber ?? '')
    );

    if (slotNumberComparison !== 0) return slotNumberComparison;

    return String(left?.id ?? '').localeCompare(String(right?.id ?? ''));
  });
}
