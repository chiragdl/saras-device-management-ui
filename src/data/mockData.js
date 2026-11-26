// Fleet data + formatters. DEVICES, ALERTS and NOTIFS are live lists that AppLogic fills from the portal API
// (src/services/portalApi.js) through setLive(), so every screen keeps reading them as before.
// The file keeps its original name so the design's imports stay unchanged.
export const TYPES = [['Jetson Orin Nano', 'JON'], ['AGX Thor', 'THR'], ['DGX Spark', 'DGX'], ['Raspberry Pi 5', 'RPI']];
export const PRODUCTS = ['Assessment in a Box', 'Proctor in a Box', 'SchoolAI in a Box'];
export const CUSTOMERS = [];          // filled from the fleet
export const VERSIONS = [];           // filled from the fleet
export const TYPE_OPTS = TYPES.map(t => t[0]);   // plus any other type a box reports
export const STATUS = {
  Online: { bg: '#E7F6EC', fg: '#0E7A36', icon: 'M20 6 9 17l-5-5' },
  Warning: { bg: '#FEF3E2', fg: '#8A5200', icon: 'M12 3 2 20h20L12 3zM12 10v4M12 17h.01' },
  Critical: { bg: '#FEECEC', fg: '#B21E1E', icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM15 9l-6 6M9 9l6 6' },
  Offline: { bg: '#EEF1F4', fg: '#5A6675', icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM8 12h8' },
  'Never seen': { bg: '#F4F6F9', fg: '#5A6675', icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 7v5l3 2' },
  Revoked: { bg: '#F4F6F9', fg: '#8A93A2', icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM5 5l14 14' }
};
export const STATUS_DOT = { Online: '#16A34A', Warning: '#F59E0B', Critical: '#DC2626', Offline: '#8A93A2', 'Never seen': '#C4CBD6', Revoked: '#C4CBD6' };
export const TZ = 'Asia/Kolkata';
export const fmtT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: TZ, timeZoneName: 'short' });
export const fmtFull = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: TZ, timeZoneName: 'short' });
export const rel = (ms) => { if (ms == null || Number.isNaN(ms)) return '—'; const s = Math.max(0, Math.round(ms / 1000)); if (s < 60) return s + ' s ago'; const m = Math.round(s / 60); if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 24) return h + ' hr ago'; const dy = Math.round(h / 24); return dy + (dy === 1 ? ' day ago' : ' days ago'); };

/** Live lists, filled from the portal API. */
export const DEVICES = [];
export const ALERTS = [];
export const NOTIFS = [];

export const SEV = {
  Critical: { bg: '#FEECEC', fg: '#B21E1E', icon: STATUS.Critical.icon },
  Warning: { bg: '#FEF3E2', fg: '#8A5200', icon: STATUS.Warning.icon },
  Success: { bg: '#E7F6EC', fg: '#0E7A36', icon: 'M20 6 9 17l-5-5' },
  Info: { bg: '#EEF2F7', fg: '#005BB8', icon: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01' }
};
export const FILTER_DEFS = [
  { key: 'status', label: 'Status', opts: ['Online', 'Warning', 'Critical', 'Offline', 'Never seen'] },
  { key: 'type', label: 'Device type', opts: TYPE_OPTS },
  { key: 'product', label: 'Product', opts: PRODUCTS },
  { key: 'customer', label: 'Customer', opts: CUSTOMERS },
  { key: 'app', label: 'App version', opts: VERSIONS }
];
export const EMPTY_F = { status: 'All', type: 'All', product: 'All', customer: 'All', app: 'All' };
export const PRODUCT_META = {
  'Assessment in a Box': { short: 'Assessment', icon: 'M9 3h6v4H9zM9 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3M9 14l2 2 4-4' },
  'Proctor in a Box': { short: 'Proctor', icon: 'M15 10l5-3v10l-5-3M3 7h12v10H3z' },
  'SchoolAI in a Box': { short: 'SchoolAI', icon: 'M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5' }
};
export const productMeta = p => PRODUCT_META[p] || { short: p && p !== '—' ? p : 'No product', icon: 'M4 4h16v16H4z' };
/** The design's pictures exist for these four; other Jetson Orin boxes use the Orin Nano picture. */
export const pictureCode = code => (code === 'JOR' ? 'JON' : code);
/** Device-type names as the box agent reports them (registration sends these). */
export const AGENT_TYPE = { 'Jetson Orin Nano': 'Orin Nano', 'AGX Thor': 'AGX Thor', 'DGX Spark': 'DGX Spark', 'Raspberry Pi 5': 'Raspberry Pi 5' };

function replace(arr, items) { arr.length = 0; items.forEach(x => arr.push(x)); }

/** Puts fresh data from the API into the live lists (and the customer, version and type filter options). */
/** The live data. `ownTypesOnly`: a client (docs/TD-ROLES.md) is offered only the device types of its own boxes. */
export function setLive(devices, alerts, notifs, ownTypesOnly) {
  if (devices) replace(DEVICES, devices);
  if (alerts) replace(ALERTS, alerts);
  if (notifs) replace(NOTIFS, notifs);
  replace(CUSTOMERS, [...new Set(DEVICES.map(d => d.customer).filter(c => c && c !== '—'))].sort());
  replace(VERSIONS, [...new Set(DEVICES.map(d => d.app).filter(v => v && v !== '—'))].sort().reverse());
  replace(TYPE_OPTS, ownTypesOnly ? [...new Set(DEVICES.map(d => d.type).filter(Boolean))].sort()
    : [...TYPES.map(t => t[0]), ...new Set(DEVICES.map(d => d.type).filter(t => t && !TYPES.some(x => x[0] === t)))]);
}
