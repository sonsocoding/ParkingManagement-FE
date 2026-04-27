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
