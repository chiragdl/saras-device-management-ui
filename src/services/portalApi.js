// Client for the SARAS Device Management Portal API (/api/v1). The API is a separate site; its address comes from
// public/config.json ("apiBaseUrl"; empty = same address as this page, which is what the dev server proxies).
// The session is an HttpOnly cookie set by the API; this code never sees a key or a token.

let base = '';

export async function loadConfig() {
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) {
      const cfg = await res.json();
      base = String(cfg.apiBaseUrl || '').replace(/\/+$/, '');
    }
  } catch (e) { /* no config file: same origin */ }
}

export class ApiError extends Error {
  // field: the form field a refusal is about (the "field" member of the problem details), or null
  constructor(message, status, field) { super(message); this.status = status; this.field = field || null; }
}

async function call(method, path, body) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  // every change carries this header; the API refuses changes without it (protection against forged requests)
  if (method !== 'GET') headers['X-Portal-Request'] = '1';
  let res;
  try {
    res = await fetch(base + '/api/v1' + path, { method, headers, credentials: 'include', body: body === undefined ? undefined : JSON.stringify(body) });
  } catch (e) {
    throw new ApiError('The portal server cannot be reached.', 0);
  }
  if (res.status === 204) return null;
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty or not JSON */ }
  if (!res.ok) throw new ApiError((data && (data.title || data.detail)) || 'The server answered ' + res.status + '.', res.status, data && typeof data.field === 'string' ? data.field : null);
  return data;
}

/** Sends raw bytes (one chunk of a patch file) as application/octet-stream; same session, header and errors as call().
 *  `signal` (an AbortSignal) stops the request; an aborted request throws an ApiError with `aborted` set. */
async function bytes(method, path, blob, signal) {
  let res;
  try {
    res = await fetch(base + '/api/v1' + path, { method, headers: { Accept: 'application/json', 'Content-Type': 'application/octet-stream', 'X-Portal-Request': '1' }, credentials: 'include', body: blob, signal });
  } catch (e) {
    const err = new ApiError(e && e.name === 'AbortError' ? 'The upload was stopped.' : 'The portal server cannot be reached.', 0);
    err.aborted = !!(e && e.name === 'AbortError');
    throw err;
  }
  if (res.ok) return null;
  let data = null;
  try { data = await res.json(); } catch { /* empty or not JSON */ }
  throw new ApiError((data && (data.title || data.detail)) || 'The server answered ' + res.status + '.', res.status, data && typeof data.field === 'string' ? data.field : null);
}

const k = key => encodeURIComponent(key);
// query string of the set filters ("all" and empty ones left out)
const qs = o => Object.entries(o).filter(([, v]) => v != null && v !== '' && v !== 'all').map(([n, v]) => n + '=' + encodeURIComponent(v)).join('&');

/** A file the API makes (e.g. a CSV export), as a Blob; errors as in call(). */
async function file(path) {
  let res;
  try {
    res = await fetch(base + '/api/v1' + path, { headers: { Accept: 'text/csv,application/json' }, credentials: 'include' });
  } catch (e) {
    throw new ApiError('The portal server cannot be reached.', 0);
  }
  if (!res.ok) {
    let data = null;
    try { data = await res.json(); } catch (e) { /* not JSON */ }
    throw new ApiError((data && (data.title || data.detail)) || 'The server answered ' + res.status + '.', res.status);
  }
  return res.blob();
}

export const api = {
  login: (email, password, keepSignedIn) => call('POST', '/auth/login', { email, password, keepSignedIn }),
  logout: () => call('POST', '/auth/logout', {}),
  me: () => call('GET', '/auth/me'),
  changePassword: (current, next) => call('POST', '/auth/change-password', { current, next }),

  fleetSummary: () => call('GET', '/fleet/summary'),
  fleetDevices: () => call('GET', '/fleet/devices'),

  device: key => call('GET', '/devices/' + k(key)),
  history: (key, metrics, hours) => call('GET', '/devices/' + k(key) + '/history?metrics=' + encodeURIComponent(metrics.join(',')) + '&hours=' + hours),
  daily: (key, days) => call('GET', '/devices/' + k(key) + '/daily?days=' + (days || 31)),
  offline: (key) => call('GET', '/devices/' + k(key) + '/offline'),
  fullReadings: (key, q) => call('GET', '/devices/' + k(key) + '/readings/full?' + qs(q)),
  logs: (key, q) => call('GET', '/devices/' + k(key) + '/logs?' + qs(q)),
  exportLogs: (key, q) => file('/devices/' + k(key) + '/logs/export?' + qs(q)),
  register: device => call('POST', '/devices', device),
  patchDevice: (key, changes) => call('PATCH', '/devices/' + k(key), changes),
  rekey: key => call('POST', '/devices/' + k(key) + '/rekey', {}),
  // a fresh one-time enrolment code for a box registered by MAC that has not enrolled yet (or must enrol again)
  enrolCode: key => call('POST', '/devices/' + k(key) + '/enrol-code', {}),
  revoke: key => call('POST', '/devices/' + k(key) + '/revoke', {}),
  watchService: (key, service, monitored, note) => call('PUT', '/devices/' + k(key) + '/service-watch', { service, monitored, note }),

  alerts: (opts = {}) => call('GET', '/alerts?limit=' + (opts.limit || 400) + (opts.key ? '&key=' + k(opts.key) : '') + (opts.open ? '&state=open' : '')),
  ack: (id, note) => call('POST', '/alerts/' + id + '/ack', { note: note || null }),
  notifications: () => call('GET', '/notifications'),
  parameters: () => call('GET', '/parameters'),

  // the Settings page (admins): values per fleet, device type or device; rules; users and what they see; e-mail
  deviceTypes: () => call('GET', '/device-types'),
  settingsCatalog: () => call('GET', '/settings/catalog'),
  saveSettingValues: (level, target, values) => call('PUT', '/settings/values', { level, target, values }),
  effectiveSettings: q => call('GET', '/settings/effective?' + qs(q)),
  settingOverrides: key => call('GET', '/settings/overrides?' + qs({ key })),
  effectiveRules: q => call('GET', '/alert-rules/effective?' + qs(q)),
  saveRule: rule => call('PUT', '/alert-rules', rule),
  resetRule: q => call('DELETE', '/alert-rules?' + qs(q)),
  monitoringSettings: () => call('GET', '/settings'),
  saveMonitoringSettings: values => call('PUT', '/settings', values),
  users: () => call('GET', '/users'),
  addUser: user => call('POST', '/users', user),
  editUser: (id, changes) => call('PATCH', '/users/' + k(id), changes),
  setUserScopes: (id, scopes) => call('PUT', '/users/' + k(id) + '/scopes', { scopes }),
  // the customers of the registered boxes (customer, sites, device types and contacts given at registration), for client accounts
  customers: () => call('GET', '/customers'),
  // device agent packages (admins, TD-AGENT-DOWNLOAD): the zip as the body, its name and notes in the query
  agents: () => call('GET', '/agents'),
  uploadAgent: (file, notes) => bytes('POST', '/agents?' + qs({ fileName: file.name, notes }), file),
  deleteAgent: id => call('DELETE', '/agents/' + k(id)),
  // the latest agent for a box, with a new download link and the upgrade commands (the device page)
  deviceAgent: key => call('POST', '/devices/' + k(key) + '/agent', {}),
  audit: limit => call('GET', '/audit?limit=' + (limit || 200)),
  sentMail: limit => call('GET', '/notifications/sent?limit=' + (limit || 50)),
  testMail: to => call('POST', '/notifications/test', { to }),

  // software patches (docs/TD-ROLES.md): support engineers upload them for one box or every box of a customer, in
  // chunks, to the storage the server is set up with (Azure Blob or Amazon S3), with a guide file; when they are checked,
  // the software contacts and the customer's client accounts are e-mailed. Everyone who sees a box sees its patches.
  patches: key => call('GET', '/devices/' + k(key) + '/patches'),
  createPatch: (key, patch) => call('POST', '/devices/' + k(key) + '/patches', patch),
  putPatchChunk: (id, fileId, index, blob, signal) => bytes('PUT', '/patches/' + k(id) + '/files/' + k(fileId) + '/chunks/' + index, blob, signal),
  completePatch: id => call('POST', '/patches/' + k(id) + '/complete', {}),
  resendPatch: id => call('POST', '/patches/' + k(id) + '/resend', {}),
  patchLink: (id, fileId) => call('POST', '/patches/' + k(id) + '/files/' + k(fileId) + '/link', {}),
  addPatchBoxes: (id, devices) => call('POST', '/patches/' + k(id) + '/boxes', { devices }),
  deletePatch: id => call('DELETE', '/patches/' + k(id)),
  // the Download button (support engineers and clients): a fresh link of the user's own, used at once
  patchDownload: (id, fileId) => call('POST', '/patches/' + k(id) + '/files/' + k(fileId) + '/download', {}),
  // a client reports a problem with a patch on one of its boxes; Support is notified
  patchProblem: (id, device, note) => call('POST', '/patches/' + k(id) + '/problem', { device, note })
};
