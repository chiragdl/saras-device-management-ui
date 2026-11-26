import React from 'react';
import ReactDOM from 'react-dom';
import AppView from '../views/AppView.jsx';
import { TYPES, PRODUCTS, CUSTOMERS, STATUS, STATUS_DOT, TZ, fmtT, fmtFull, rel, DEVICES, ALERTS, NOTIFS, SEV, FILTER_DEFS, EMPTY_F, PRODUCT_META, productMeta, pictureCode, AGENT_TYPE, setLive } from '../data/mockData.js';
import { api } from '../services/portalApi.js';
import { readingView, readingText, readingSummary } from './readingView.js';
import PatchPanel from '../screens/PatchList.jsx';

// Used until the first fleet summary arrives; the server then sends the configured thresholds and settings.
const DEFAULT_TH = { cpu: { warn: 80, crit: 95 }, gpuTemp: { warn: 75, crit: 90 }, gpu: { warn: 90, crit: null }, ram: { warn: 85, crit: 95 }, disk: { warn: 85, crit: 95 } };
const DEFAULT_MON = { offlineAfterMinutes: 30, lateAfterExtraMinutes: 5, offlineAlertWorkingMinutes: 120, offlineAlertAnyTimeMinutes: 1440, dataLossRiskDays: 12, timeZone: TZ };
// a box that is reporting on time is online, whatever its health (warning and critical boxes included)
const REPORTING = d => d.status === 'Online' || d.status === 'Warning' || d.status === 'Critical';
// 'Offline' is not shown as such: a box that said it was shutting down (agent 0.2.6) is Switched off, any other is No contact
// (it may be running without internet, or be off; its readings arrive when it reconnects)
const OFF_LABEL = 'Not reporting';
const stText = d => d.status === 'Offline' ? (d.switchedOff ? (d.switchedOff.kind === 'reboot' ? 'Restarting' : 'Switched off') : 'No contact') : d.status;
const SESSION_ENDED = 'Your session has ended. Sign in again.';
// each product runs on one kind of box (review, 6 Nov 2026): the registration form asks only for the product
const PRODUCT_TYPE = { 'Assessment in a Box': 'Raspberry Pi 5', 'Proctor in a Box': 'Jetson Orin Nano', 'SchoolAI in a Box': 'DGX Spark' };
/** A MAC address as typed on the label (2C:CF:67:12:34:56, 2c-cf-67-12-34-56, 2ccf.6712.3456, 2CCF67123456) in the
 *  form the portal keeps (2c:cf:67:12:34:56), or null when it is not 12 hex digits. */
const normMac = s => { const x = String(s || '').trim().replace(/[:.-]/g, '').toLowerCase(); return /^[0-9a-f]{12}$/.test(x) ? x.match(/../g).join(':') : null; };
/** Why a typed MAC cannot be a box's own address (the same rules as the portal API and the Sync API), or '' when it can. */
const macErr = s => {
  const m = normMac(s);
  if (!m) return 'A MAC address has 12 hex digits, e.g. 2C:CF:67:12:34:56.';
  if (m === '00:00:00:00:00:00' || m === 'ff:ff:ff:ff:ff:ff') return 'This is not a device\'s MAC address.';
  const b0 = parseInt(m.slice(0, 2), 16);
  if (b0 & 1) return 'This is a group (multicast) address, not a device\'s MAC.';
  if (b0 & 2) return 'This looks like a randomised address. Enter the one printed on the label.';
  return '';
};
// the registration form's inputs, and the form field a server refusal names (the request's names map to the form's)
const REG_IDS = { deviceId: 'rg-devid', lanMac: 'rg-lanmac', wifiMac: 'rg-wifimac', serial: 'rg-serial', name: 'rg-name', customer: 'rg-cust', date: 'rg-date', site: 'rg-site', location: 'rg-loc', contact: 'rg-contact', email: 'rg-email', phone: 'rg-phone' };
const REG_FIELDS = { deviceId: 'deviceId', lanMac: 'lanMac', wifiMac: 'wifiMac', serial: 'serial', name: 'name', displayName: 'name', product: 'product', customer: 'customer', site: 'site', siteCode: 'site',
  location: 'location', date: 'date', installedOn: 'date', contact: 'contact', supportContact: 'contact', email: 'email', supportEmail: 'email', phone: 'phone', supportPhone: 'phone' };
const regField = f => (typeof f === 'string' && Object.prototype.hasOwnProperty.call(REG_FIELDS, f) ? REG_FIELDS[f] : null);
const isoLocal = (t = new Date()) => t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
// software patches: a size as people read it, and the words and colours of a patch's state and of each e-mail's state
const sizeText = n => n >= 1073741824 ? (n / 1073741824).toFixed(2).replace(/\.?0+$/, '') + ' GB' : n >= 1048576 ? (n / 1048576).toFixed(1).replace(/\.0$/, '') + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B';
const PT_TONE = { ok: ['#0E7A36', '#E7F6EC'], warn: ['#8A5200', '#FEF3E2'], crit: ['#B21E1E', '#FEECEC'], muted: ['#5A6675', '#EEF1F4'], info: ['#005BB8', '#EEF2F7'] };
const PT_STATUS = { uploading: ['Uploading', 'info'], verifying: ['Verifying', 'info'], ready: ['Ready', 'ok'], failed: ['Failed', 'crit'] };
const PT_MAIL = { sent: ['Sent', 'ok'], queued: ['Queued', 'info'], waiting_mail_server: ['Waiting for mail server', 'warn'], failed: ['Failed', 'crit'], expired: ['Link expired', 'muted'], not_sent: ['Not sent', 'muted'] };
// a patch's deployment on a box (docs/TD-ROLES.md 9.2): what the box's agent reported (saras-patch), or a client's problem report
// No agent uploaded to the portal: the agent folder is copied to the box by hand (from Windows it loses the scripts'
// executable bit and gets Windows line ends), so the first step makes the scripts runnable (25 Nov 2026)
const PREP_BY_HAND = "Copy the device agent zip (saras-device-agent-….zip) to the box, unpack it and open its folder, then make the scripts runnable: python3 -m zipfile -e saras-device-agent-*.zip saras-device-agent && cd saras-device-agent/agent && sed -i 's/\\r$//' *.sh *.py && chmod +x *.sh *.py";
// The device page's Enrolment card (Install / update agent, New enrolment code, Use the box's MACs): hidden for now
// (25 Nov 2026, asked); set to true to show it again. Registration, Re-key and New code still show the agent.
const SHOW_ENROLMENT = false;
// Send to: the boxes each group target goes to, as the patch data lists them (TD-ROLES 8.1, 16.3)
const PT_GROUP = { product: 'productBoxes' };   // "customer" is no longer offered for new patches (25 Nov 2026)
const PT_BOX = { pending: ['Pending', 'warn'], installing: ['Installing', 'info'], installed: ['Installed', 'ok'], failed: ['Failed', 'crit'], problem: ['Problem reported', 'crit'], not_reported: ['Not reported', 'muted'] };
// the standard steps shown under every patch's guide (TD-ROLES 7)
const PATCH_GUIDE_STANDARD = v => [
  'Download every file of the patch and the guide.',
  'Check each file: sha256sum <file> must print the SHA-256 shown here. Do not use a file that differs.',
  'Copy the files to the box into an empty folder.',
  'Follow the guide.',
  'At the end, the install script (or you, as the guide says) runs: sudo saras-patch completed ' + v + '   (if it did not work: sudo saras-patch failed ' + v + ' "what went wrong"). The box then reports the result here.',
  'If something is wrong that the box cannot report, press Report a problem: Excelsoft support is notified.'];
// one line of a patch's history (TD-ROLES 6)
const PT_EVENT = {
  created: (e, x) => 'Uploaded by ' + (e.by || 'unknown') + (x.boxes > 1 ? ' for ' + x.boxes + ' boxes' : ''),
  checked: () => 'Files checked (size and SHA-256) and stored',
  emailed: (e, x) => x.recipients ? 'E-mailed to ' + x.recipients + (x.recipients === 1 ? ' contact' : ' contacts') : 'No contacts to e-mail',
  downloaded: (e, x) => 'Downloaded' + (x.file ? ': ' + x.file : '') + (e.by ? ' by ' + e.by : '') + (x.link === 'portal' ? ' (Download button)' : x.link === 'mail' ? ' (e-mail link)' : x.link === 'copy' ? ' (copied link)' : ''),
  started: e => 'Installing started on ' + (e.device || 'the box'),
  completed: e => 'Installed on ' + (e.device || 'the box') + ' (reported by the box)',
  failed: (e, x) => 'Failed on ' + (e.device || 'the box') + (x.reason ? ': ' + x.reason : ''),
  problem: (e, x) => 'Problem reported by ' + (e.by || 'a client') + ' on ' + (e.device || 'a box') + (x.note ? ': ' + x.note : ''),
  boxes_added: (e, x) => 'Boxes added by ' + (e.by || 'unknown') + (x.boxes && x.boxes.length ? ': ' + x.boxes.join(', ') : ''),
  deleted: e => 'Deleted by ' + (e.by || 'unknown'),
  deleted_in_storage: (e, x) => 'Deleted: ' + (x.missing && x.missing.length ? x.missing.join(', ') : 'a file') + ' no longer in the storage'
};

export default class AppLogic extends React.Component {
  render() { return React.createElement(AppView, this.renderVals()); }
  state = { screen: 'boot', email: '', pw: '', showPw: false, authErr: '', signing: false, open: null, f: { ...EMPTY_F }, q: '', page: 1, read: {}, w: typeof window !== 'undefined' ? window.innerWidth : 1280, now: Date.now(), refreshing: false,
    me: null, thresholds: DEFAULT_TH, monitoring: DEFAULT_MON, lastFetch: null, detailData: {}, hist: {}, offline: {}, fullRd: {}, boxLogs: {} };

  startClock() {
    const fmt = () => {
      const el = document.getElementById('ep-clock'); if (!el) return;
      const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(new Date());
      const g = t => (p.find(x => x.type === t) || {}).value;
      el.textContent = g('month') + '-' + g('day') + '-' + g('year') + ' ' + g('hour') + ':' + g('minute') + ':' + g('second') + ' ' + g('dayPeriod').toUpperCase();
    };
    fmt(); this._clk = setInterval(fmt, 1000);
  }
  componentDidMount() {
    this.startClock();
    this.onResize = () => this.setState({ w: window.innerWidth });
    this.onKey = (e) => {
      if (e.key === 'Tab') {
        const which = this.state.boxKey ? 'boxkey' : this.state.pwdOpen ? 'password' : this.state.patchFor ? 'patch' : this.state.regOpen ? 'register' : this.state.alertsOpen ? 'alerts' : null;
        const dlg = which && document.querySelector('[data-trap="' + which + '"]');
        if (dlg) {
          const f = [...dlg.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
          if (f.length) { const first = f[0], last = f[f.length - 1];
            if (!dlg.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
            else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
        }
      }
      if (this.state.boxKey) return;   // the box-key dialog closes only with its button, so the key is not lost by accident
      if (e.key === 'Escape' && this.state.pwdOpen) { this.closePassword(); return; }
      if (e.key === 'Escape' && this.state.patchFor) { this.closePatch(); return; }
      if (e.key === 'Escape' && this.state.regOpen) { this.closeRegister(); return; }
      if (e.key === 'Escape' && this.state.alertsOpen && !this.state.open) { this.closeAlerts(); return; }
      if (e.key === 'Escape' && this.state.open) {
        const k = this.state.open; this.setState({ open: null });
        const t = document.querySelector('[data-trigger="' + k + '"]'); t && t.focus();
      }
    };
    this.onDown = (e) => { if (this.state.open && !e.target.closest('[data-dd="' + this.state.open + '"]')) this.setState({ open: null }); };
    // coming back to the tab refreshes at once instead of waiting for the next poll
    this.onVisible = () => { if (!document.hidden && this.state.screen === 'dash' && Date.now() - (this.state.lastFetch || 0) > 20000) this.refreshData(true); };
    window.addEventListener('resize', this.onResize);
    this.clock = setInterval(() => this.setState({ tick: Date.now() }), 30000);
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('mousedown', this.onDown);
    document.addEventListener('visibilitychange', this.onVisible);
    this.restoreSession();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.clock);
    clearInterval(this.poll);
    if (this._clk) clearInterval(this._clk);
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('mousedown', this.onDown);
    document.removeEventListener('visibilitychange', this.onVisible);
  }

  openSettings = () => { this.settingsProps = null; this.setState({ settingsOpen: Date.now(), detail: null, open: null, alertsOpen: false }); window.scrollTo({ top: 0 }); };
  closeSettings = () => { this.settingsProps = null; this.setState({ settingsOpen: null }); window.scrollTo({ top: 0 }); };
  closeAlerts = () => { this.setState({ alertsOpen: false }); setTimeout(() => { const t = document.querySelector('[data-trigger="alerts"]'); t && t.focus(); }, 0); };
  openAlerts = (tab) => { this.setState({ alertsOpen: true, alertTab: tab || 'All', alertShown: 12, open: null }); setTimeout(() => { const sc = [...document.querySelectorAll('[data-trap] div')].filter(el => /(auto|scroll)/.test(getComputedStyle(el).overflowY)); sc.forEach(el => { el.scrollTop = 0; }); this.closeRef.current && this.closeRef.current.focus(); }, 30); };
  toggle(k) { this.setState(s => ({ open: s.open === k ? null : k })); }
  setF(k, v) { this.setState(s => ({ f: { ...s.f, [k]: v }, page: 1, open: null })); }

  // ---- session: the API keeps it in an HttpOnly cookie; this code never sees a token ----
  restoreSession = async () => {
    try { this.startSession(await api.me()); }
    catch (e) { this.setState({ screen: 'login', authErr: e.status === 401 ? '' : e.message }); }
  };
  startSession(me) {
    this.setState({ me, screen: 'dash', detail: null, pw: '', authErr: '', signing: false });
    this.refreshData(false);
    clearInterval(this.poll);
    this.poll = setInterval(() => { if (!document.hidden) this.refreshData(true); }, 60000);
  }
  endSession(message) {
    clearInterval(this.poll);
    if (this._ptAbort) this._ptAbort.abort();
    this._ptPlan = null; this.stopPatchPoll();
    setLive([], [], []);
    this.settingsProps = null;
    this.setState({ screen: 'login', me: null, detail: null, settingsOpen: null, detailData: {}, hist: {}, offline: {}, fullRd: {}, boxLogs: {}, summary: null, open: null, alertsOpen: false,
      regOpen: false, patchFor: null, ptPhase: 'form', ptId: null, upFiles: [], patches: {}, ptLinks: {}, boxKey: null, catType: null, f: { ...EMPTY_F }, q: '', page: 1, signing: false, authErr: message || '' });
  }
  signIn = async (e) => {
    e.preventDefault();
    const { email, pw } = this.state;
    if (!email.trim() || !pw) { this.setState({ authErr: 'Enter your username or email and password to sign in.' }); return; }
    this.setState({ signing: true, authErr: '' });
    try { this.startSession(await api.login(email.trim(), pw, !!this.state.remember)); }
    catch (err) { this.setState({ signing: false, pw: '', authErr: err.status === 429 ? 'Too many sign-in attempts from this network. Wait a minute and try again.' : err.message }); }
  };
  signOut = async () => {
    try { await api.logout(); } catch { /* the session ends on this page either way */ }
    this.endSession('');
  };

  // ---- data from the portal API ----
  refreshData = async quiet => {
    if (this._loading) return;
    this._loading = true;
    if (!quiet) this.setState({ refreshing: true });
    try {
      const [sum, fleet, al, nt] = await Promise.all([api.fleetSummary(), api.fleetDevices(), api.alerts({ limit: 500 }), api.notifications()]);
      setLive(fleet.devices, al.alerts, nt.items, !!(this.state.me && this.state.me.can && this.state.me.can.readOnly));
      const bad = (sum.sources || []).find(x => !x.ok);
      this.setState({ summary: sum, thresholds: sum.thresholds || DEFAULT_TH, monitoring: sum.monitoring || DEFAULT_MON, now: Date.parse(fleet.generatedAt) || Date.now(), lastFetch: Date.now(),
        serverDown: !!sum.serverDown, apiDown: false, downSource: bad || null, serverSince: bad && bad.lastPollOkAt ? fmtT.format(new Date(bad.lastPollOkAt)) : 'never',
        refreshing: false, reconnecting: false, acked: {} });
      if (this.state.detail) this.loadDevice(this.state.detail, true);
    } catch (e) {
      if (e.status === 401) this.endSession(SESSION_ENDED);
      else this.setState({ refreshing: false, reconnecting: false, apiDown: true, serverDown: true, apiError: e.message, serverSince: this.state.lastFetch ? fmtT.format(new Date(this.state.lastFetch)) : 'never' });
    } finally { this._loading = false; }
  };
  loadDevice = async (id, quiet) => {
    const d = DEVICES.find(x => x.id === id);
    if (!d) return;
    try {
      const [view, daily] = await Promise.all([api.device(d.key), api.daily(d.key, 31)]);
      this.setState(st => ({ detailData: { ...st.detailData, [id]: { view, daily: daily.days, at: Date.now() } }, detailErr: null }));
      // keep the open tab's extra data current too
      if (this.state.detail === id && this.state.dTab === 'hardware') this.loadHistory(id, this.state.trendRange || '24h');
    } catch (e) {
      if (e.status === 401) this.endSession(SESSION_ENDED);
      else if (!quiet) this.setState({ detailErr: e.message });
    }
  };
  loadHistory = async (id, rk) => {
    const d = DEVICES.find(x => x.id === id);
    if (!d) return false;
    const hours = { '1h': 1, '6h': 6, '12h': 12, '24h': 24, '7d': 168 }[rk] || 24;
    try { const h = await api.history(d.key, ['cpu', 'gpu_temp', 'ram'], hours); this.setState(st => ({ hist: { ...st.hist, [id + '@' + rk]: h } })); return true; }
    catch (e) { if (e.status === 401) this.endSession(SESSION_ENDED); return false; }
  };
  loadOffline = async (id, mark) => {
    const d = DEVICES.find(x => x.id === id);
    if (!d) return false;
    try { const o = await api.offline(d.key); this.setState(st => ({ offline: { ...st.offline, [id]: { ...o, mark } } })); return true; }
    catch (e) { if (e.status === 401) this.endSession(SESSION_ENDED); return false; }
  };
  // ---- full readings (Diagnostics): whole readings exactly as the box sent them, for a period, newest first ----
  rdOf(d) { return { range: '1h', from: '', to: '', open: {}, view: 'readable', ...((this.state.fullRd || {})[d.id] || {}) }; }
  setRd(d, x) { this.setState(st => ({ fullRd: { ...(st.fullRd || {}), [d.id]: { ...((st.fullRd || {})[d.id] || {}), ...x } } })); }
  /** Loads the first page for the period (with `patch` applied), or the next page when `more`. */
  loadReadings = async (d, patch = {}, more = false) => {
    const cur = { ...this.rdOf(d), ...patch }, seq = (this._rdSeq = (this._rdSeq || 0) + 1);
    const shown = cur.entries || [], last = shown[shown.length - 1];
    this.setRd(d, { ...patch, busy: true, err: null, ...(more ? {} : { entries: null, total: null, more: false, open: {} }) });
    const { from, to } = this.logRange(cur);
    try {
      const res = await api.fullReadings(d.key, { from, to, limit: 20, before: more && last ? last.sentAt : null });
      if (seq !== this._rdSeq) return;                       // a newer request is on its way
      this.setRd(d, { busy: false, entries: more ? [...shown, ...res.entries] : res.entries, more: res.more, ...(more ? {} : { total: res.total }) });
    } catch (e) {
      if (e.status === 401) this.endSession(SESSION_ENDED);
      else if (seq === this._rdSeq) this.setRd(d, { busy: false, err: e.message });
    }
  };
  // ---- device logs (Diagnostics; agent 0.2.3+): warnings and errors of the system, the kernel and the containers ----
  logsOf(d) { return { range: '24h', from: '', to: '', source: 'all', level: 'all', q: '', ...((this.state.boxLogs || {})[d.id] || {}) }; }
  setLogs(d, x) { this.setState(st => ({ boxLogs: { ...(st.boxLogs || {}), [d.id]: { ...((st.boxLogs || {})[d.id] || {}), ...x } } })); }
  /** The period of a range choice as ISO times; a custom range covers whole local days. */
  logRange(f) {
    const now = Date.now(), H = 3600e3, today = new Date(); today.setHours(0, 0, 0, 0);
    const span = { '1h': H, '24h': 24 * H, '7d': 7 * 24 * H, '30d': 30 * 24 * H, '90d': 90 * 24 * H }[f.range];
    let from = span ? now - span : today.getTime(), to = now + 60e3;
    if (f.range === 'custom') {
      to = f.to ? new Date(f.to + 'T00:00:00').getTime() + 24 * H : now + 60e3;
      from = Math.min(f.from ? new Date(f.from + 'T00:00:00').getTime() : to - 24 * H, to - 60e3);
    }
    return { from: new Date(from).toISOString(), to: new Date(to).toISOString() };
  }
  /** Loads the first page for the filters (with `patch` applied), or the next page when `more`. */
  loadLogs = async (d, patch = {}, more = false) => {
    const cur = { ...this.logsOf(d), ...patch }, seq = (this._logSeq = (this._logSeq || 0) + 1);
    this.setLogs(d, { ...patch, busy: true, err: null, ...(more ? {} : { entries: null, total: null }) });
    const { from, to } = this.logRange(cur);
    try {
      const res = await api.logs(d.key, { from, to, source: cur.source, level: cur.level, q: cur.q.trim(), limit: 200, offset: more ? (cur.entries || []).length : 0 });
      if (seq !== this._logSeq) return;                      // a newer request is on its way
      this.setLogs(d, { busy: false, entries: more ? [...(cur.entries || []), ...res.entries] : res.entries, total: res.total, keptDays: res.keptDays });
    } catch (e) {
      if (e.status === 401) this.endSession(SESSION_ENDED);
      else if (seq === this._logSeq) this.setLogs(d, { busy: false, err: e.message });
    }
  };
  exportLogs = async (d) => {
    const f = this.logsOf(d), { from, to } = this.logRange(f);
    this.setLogs(d, { exporting: true });
    try {
      const blob = await api.exportLogs(d.key, { from, to, source: f.source, level: f.level, q: f.q.trim() });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = d.id + '-logs-' + from.slice(0, 10) + '-to-' + to.slice(0, 10) + '.csv'; a.style.display = 'none';
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      this.setLogs(d, { exporting: false });
    } catch (e) {
      if (e.status === 401) { this.endSession(SESSION_ENDED); return; }
      this.setLogs(d, { exporting: false });
      this.toast('Logs not exported', e.message, 'error');
    }
  };
  /** Runs a load once (after the current render), and not again for a minute if it failed. */
  once(key, fn) {
    this._pend = this._pend || {}; this._fail = this._fail || {};
    if (this._pend[key] || (this._fail[key] && Date.now() - this._fail[key] < 60000)) return;
    this._pend[key] = true;
    setTimeout(() => Promise.resolve(fn()).then(ok => { if (ok === false) this._fail[key] = Date.now(); }).finally(() => { delete this._pend[key]; }), 0);
  }
  ackAlert = async (a) => {
    this.setState(st => ({ acked: { ...(st.acked || {}), [a.id]: true } }));
    try {
      await api.ack(a.id);
      this.toast('Alert acknowledged', a.title + ' on ' + a.device + '.');
      this.refreshData(true);
      if (this.state.detail) this.loadDevice(this.state.detail, true);
    } catch (e) {
      this.setState(st => { const x = { ...(st.acked || {}) }; delete x[a.id]; return { acked: x }; });
      this.apiError(e, 'Could not acknowledge the alert');
    }
  };
  setWatch = async (d, svc, monitored, xKey) => {
    this.setState(st => ({ watchBusy: { ...(st.watchBusy || {}), [xKey]: true } }));
    try {
      await api.watchService(d.key, svc.name, monitored, null);
      this.toast(monitored ? 'Watching ' + svc.label : 'Stopped watching ' + svc.label, monitored ? 'It raises alerts again when it is down.' : 'It no longer raises alerts on ' + d.id + '.');
      await this.loadDevice(d.id, true);
      this.refreshData(true);
    } catch (e) { this.apiError(e, 'Could not change watching'); }
    finally { this.setState(st => { const w = { ...(st.watchBusy || {}) }; delete w[xKey]; return { watchBusy: w }; }); }
  };
  /** The agent offer of a registration, re-key, new code or the device page, for the dialog (null: none uploaded). */
  agentInfo(a, fmt) {
    if (!a || !a.url) return null;
    const size = a.size >= 1048576 ? (a.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(a.size / 1024)) + ' KB';
    // the commands one by one, each with what it does (download, unpack, open the folder, set up or update)
    const cmds = String(a.commands || '').split(/\r?\n/).filter(Boolean);
    const what = ['Download the agent', 'Unpack it (with python3, so unzip is not needed)', 'Open the agent folder and make its scripts runnable',
      a.upgrade ? 'Update the agent (the box keeps its key and settings)' : 'Run the setup: it asks for the box key or enrolment code'];
    const steps = cmds.map((c, i) => ({ label: cmds.length === what.length ? what[i] : 'Command ' + (i + 1), cmd: c }));
    return { version: a.version, fileName: a.fileName, sizeText: size, url: a.url, until: fmt(a.expiresAt), commands: a.commands, steps, upgrade: !!a.upgrade };
  }
  /** The device page's Install / update agent (admins): the latest agent, a new download link and the upgrade commands. */
  agentFor = async (d, back) => {
    if (this.state.idBusy) return;
    this.setState({ idBusy: 'agent' });
    try {
      const res = await api.deviceAgent(d.key);
      const fmt = x => x ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(x)) : '';
      const agent = this.agentInfo(res.agent, fmt);
      this.setState({ boxKey: { title: 'Install / update agent', subtitle: d.type + ' · ' + d.customer, deviceId: res.deviceId || d.id, mode: 'agent', agent, back,
        // a box that never sent a reading gets the first-time setup (it needs its key or code); one that has, the upgrade
        steps: !agent ? [] : res.firstSetup ? ['This box has not sent a reading yet, so the commands set it up for the first time with agent ' + agent.version + '. Paste them on the box (they need its sudo password).',
          res.enrolment === 'mac' ? 'Type the enrolment code when the setup asks for it (lost or expired: New enrolment code).' : 'Paste the box key shown at registration when the setup asks for it (lost: Re-key the box).',
          'The box shows as Online after its first reading, within a few minutes.']
          : ['Paste the commands on the box (they need its sudo password). The box keeps its key and settings.',
            'The box reports agent ' + agent.version + ' with its next reading (Software tab).',
            'To set the box up from scratch instead (a new box key or enrolment code), use Re-key or New enrolment code.'] }, boxKeyAck: false, boxKeyCopied: null });
    } catch (e) { this.apiError(e, 'Could not get the agent'); }
    finally { this.setState({ idBusy: null }); }
  };
  /** A fresh one-time enrolment code for a box registered by MAC (admins): shown once, in the "Device registered" dialog. */
  newEnrolCode = async (d, back) => {
    if (this.state.idBusy) return;
    this.setState({ idBusy: 'code' });
    try {
      const res = await api.enrolCode(d.key);
      this.setState({ boxKey: this.boxKeyInfo({ ...res, enrolment: 'mac' }, 'New enrolment code', d.type + ' · ' + d.customer, back), boxKeyAck: false, boxKeyCopied: null });
      this.loadDevice(d.id, true);
    } catch (e) {
      if (e.status === 409) this.toast('No new enrolment code', e.message, 'error');
      else this.apiError(e, 'Could not create an enrolment code');
    } finally { this.setState({ idBusy: null }); }
  };
  /** Registers the MACs the box itself reports, for a box registered without any (admins). */
  useBoxMacs = async (d, detected) => {
    if (this.state.idBusy) return;
    this.setState({ idBusy: 'macs' });
    try {
      await api.patchDevice(d.key, { lanMac: detected.lan || null, wifiMac: detected.wifi || null });
      this.toast('MACs registered', 'The MACs ' + d.id + ' reports are now its registered LAN and Wi-Fi MAC.');
      await this.loadDevice(d.id, true);
      this.refreshData(true);
    } catch (e) { this.apiError(e, e && e.field ? 'The MACs were not registered' : 'Could not register the MACs'); }
    finally { this.setState({ idBusy: null }); }
  };
  toast(title, body, tone) {
    this.setState({ toast: { title, body, tone: tone || 'ok' } });
    clearTimeout(this._toast); this._toast = setTimeout(() => this.setState({ toast: null }), tone === 'error' ? 8000 : 5000);
  }
  apiError(e, what) {
    if (e && e.status === 401) { this.endSession(SESSION_ENDED); return; }
    this.toast(what, (e && e.message) || 'Something went wrong.', 'error');
  }
  saveJson(name, data) { this.saveText(name, JSON.stringify(data, null, 2), 'application/json'); }
  saveText(name, text, type) {
    const blob = new Blob([type ? text : '\ufeff' + text], { type: type || 'text/plain;charset=utf-8' });   // BOM: Notepad reads it as UTF-8
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.style.display = 'none';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  openPassword = () => {
    this.setState({ open: null, pwdOpen: true, pwdCur: '', pwdNew: '', pwdNew2: '', pwdErr: '', pwdBusy: false });
    setTimeout(() => { const el = document.getElementById('pwd-cur'); el && el.focus(); }, 30);
  };
  closePassword = () => { this.setState({ pwdOpen: false, pwdCur: '', pwdNew: '', pwdNew2: '' }); setTimeout(() => { const t = document.querySelector('[data-trigger="profile"]'); t && t.focus(); }, 0); };
  submitPassword = async (e) => {
    e.preventDefault();
    const { pwdCur, pwdNew, pwdNew2 } = this.state;
    const err = !pwdCur ? 'Enter your current password.' : pwdNew.length < 12 ? 'The new password needs at least 12 characters.'
      : pwdNew !== pwdNew2 ? 'The two new passwords are not the same.' : pwdNew === pwdCur ? 'Choose a password different from the current one.' : '';
    if (err) { this.setState({ pwdErr: err }); return; }
    this.setState({ pwdBusy: true, pwdErr: '' });
    try {
      await api.changePassword(pwdCur, pwdNew);
      this.setState({ pwdOpen: false, pwdBusy: false, pwdCur: '', pwdNew: '', pwdNew2: '' });
      this.toast('Password changed', 'Use the new password the next time you sign in.');
    } catch (ex) {
      if (ex.status === 401) { this.endSession(SESSION_ENDED); return; }
      this.setState({ pwdBusy: false, pwdErr: ex.status === 429 ? 'Too many attempts. Wait a minute and try again.' : ex.message });
    }
  };
  passwordVals(s) {
    return { pwdOpen: !!s.pwdOpen, pwdCur: s.pwdCur || '', pwdNew: s.pwdNew || '', pwdNew2: s.pwdNew2 || '', pwdErr: s.pwdErr || '', pwdBusy: !!s.pwdBusy,
      onPwdCur: e => this.setState({ pwdCur: e.target.value }), onPwdNew: e => this.setState({ pwdNew: e.target.value }), onPwdNew2: e => this.setState({ pwdNew2: e.target.value }),
      pwdClose: this.closePassword, pwdSubmit: this.submitPassword };
  }
  copyText(text, which, mark = 'boxKeyCopied') {
    const failed = () => this.toast('Could not copy', 'Select the text and copy it by hand.', 'error');
    if (!text) return;
    try {
      navigator.clipboard.writeText(text).then(() => { this.setState({ [mark]: which }); clearTimeout(this._cp); this._cp = setTimeout(() => this.setState({ [mark]: null }), 2000); }, failed);
    } catch { failed(); }
  }

  // ---- software patches (docs/TD-ROLES.md): support engineers upload them for one box or every box of a customer, with
  // a guide file; the files go to the storage the server is set up with (Azure Blob, Amazon S3 or a local folder), in
  // chunks; once the server has checked them, the software contacts and the customer's client accounts get an e-mail.
  // Installing is done by hand on the box; the box's agent reports it (Patches tab). Remote install: planned (TD-OTA).
  patchesOf(d) { return ((this.state.patches || {})[d.id]) || {}; }
  setPatches(d, x) { this.setState(st => ({ patches: { ...(st.patches || {}), [d.id]: { ...((st.patches || {})[d.id] || {}), ...x } } })); }
  /** The device's patches, recipients, mail and storage state; the data, or false when it could not be loaded. */
  loadPatches = async (d, quiet) => {
    if (!quiet) this.setPatches(d, { busy: true, err: null });
    try {
      const data = await api.patches(d.key);
      this.setPatches(d, { data, busy: false, err: null, denied: false, at: Date.now() });
      return data;
    } catch (e) {
      if (e.status === 401) { this.endSession(SESSION_ENDED); return false; }
      this.setPatches(d, { busy: false, err: e.status === 403 ? 'You do not have access to the patches of this device.' : e.message, denied: e.status === 403 });
      return false;
    }
  };
  /** A clean "Update patch" form (the files picked, the version and the notes are cleared). */
  resetPatchForm(extra) {
    this._ptPlan = null;
    this.stopPatchPoll();
    this.setState({ upFiles: [], dz: false, patchVer: '', verTouched: false, ptNotes: '', ptTried: false, ptPhase: 'form', ptId: null, ptErr: null, ptErrField: null, ptFileErr: '', ptStopAsk: false, ptSlow: false,
      ptTarget: 'device', ptType: '', ptGuideErr: '', ...extra });
  }
  openPatch = (d, back) => {
    this._ptBack = back || '[aria-label^="Update patch on ' + d.id + '"]';
    this.resetPatchForm({ patchFor: d.id, open: null });
    this.loadPatches(d);
    setTimeout(() => { const sc = [...document.querySelectorAll('[data-trap] div')].filter(el => /(auto|scroll)/.test(getComputedStyle(el).overflowY)); sc.forEach(el => { el.scrollTop = 0; }); this.patchCloseRef && this.patchCloseRef.current && this.patchCloseRef.current.focus(); }, 30);
  };
  /** Close, Escape and the backdrop: during an upload it asks first (in the dialog: window.confirm is not available here). */
  closePatch = () => {
    const ph = this.state.ptPhase;
    if (ph === 'starting' || ph === 'uploading') {
      this.setState({ ptStopAsk: true });
      setTimeout(() => { const b = document.getElementById('pt-keep'); b && b.focus(); }, 0);
      return;
    }
    this.finishClosePatch();
  };
  finishClosePatch() {
    const s = this.state, id = s.patchFor, d = DEVICES.find(x => x.id === id), back = this._ptBack;
    // an upload that stopped half-way can only be finished from this dialog (the files are only in this page): drop it
    if (s.ptPhase === 'failed' && s.ptId) api.deletePatch(s.ptId).catch(() => { /* it stays listed as not uploaded; it can be deleted on the Patches tab */ });
    this.resetPatchForm({ patchFor: null });
    if (d) this.loadPatches(d, true);
    setTimeout(() => { const t = back && document.querySelector(back); t && t.focus(); }, 0);
  }
  onPtUnload = e => { e.preventDefault(); e.returnValue = ''; };
  ptSetFile(key, x) { this.setState(st => ({ upFiles: (st.upFiles || []).map(f => f.key === key ? { ...f, ...x } : f) })); }
  /** Waits `ms`, or stops at once when the upload is stopped. */
  ptWait(ms, signal) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => { clearTimeout(t); reject(Object.assign(new Error('The upload was stopped.'), { aborted: true })); }, { once: true });
    });
  }
  /** Sends one chunk; a network failure or a passing server error is tried again 3 times, after 1 s, 3 s and 9 s. */
  async ptPutChunk(plan, f, index, signal) {
    const blob = f.file.slice(index * plan.chunk, Math.min(f.size, (index + 1) * plan.chunk));
    for (let attempt = 0; ; attempt++) {
      try {
        await api.putPatchChunk(plan.id, f.fileId, index, blob, signal);
        if (attempt) this.ptSetFile(f.key, { retry: '' });
        return;
      } catch (e) {
        if (e.aborted || signal.aborted) throw Object.assign(e, { aborted: true });
        const passing = e.status === 0 || e.status === 408 || e.status === 429 || e.status >= 500;
        if (!passing || attempt >= 3) throw e;
        const delay = [1000, 3000, 9000][attempt];
        this.ptSetFile(f.key, { retry: 'Connection problem · trying again in ' + delay / 1000 + ' s (' + (attempt + 1) + ' of 3)' });
        await this.ptWait(delay, signal);
      }
    }
  }
  /** Upload (or Try again after a failure: carries on from the chunk that failed). */
  uploadPatch = async () => {
    const s = this.state, d = DEVICES.find(x => x.id === s.patchFor);
    if (!d || !(s.me && s.me.can && s.me.can.patch) || s.ptPhase === 'starting' || s.ptPhase === 'uploading') return;
    const chk = this.ptCheck(s, d);
    if (chk.block) {
      this.setState({ verTouched: true, ptTried: true });
      const el = document.getElementById(chk.focus); el && el.focus();
      return;
    }
    const ac = new AbortController(); this._ptAbort = ac;
    let plan = this._ptPlan && this._ptPlan.id === s.ptId ? this._ptPlan : null, list = s.upFiles || [];
    this.setState({ ptPhase: plan ? 'uploading' : 'starting', ptErr: null, ptErrField: null, ptStopAsk: false, upFiles: list.map(f => ({ ...f, err: '', retry: '' })) });
    window.addEventListener('beforeunload', this.onPtUnload);
    try {
      if (!plan) {
        const pd = this.patchesOf(d).data;
        // the guide file is first in the list (setGuide), as the server lists it: the files are matched by position
        const res = await api.createPatch(d.key, { version: chk.label, notes: (s.ptNotes || '').trim() || null, files: list.map(f => ({ name: f.name, size: f.size, guide: !!f.guide })),
          target: PT_GROUP[s.ptTarget] ? s.ptTarget : 'device', deviceType: PT_GROUP[s.ptTarget] && s.ptType ? s.ptType : null });
        if (ac.signal.aborted) { api.deletePatch(res.id).catch(() => { /* listed as not uploaded */ }); return; }
        plan = this._ptPlan = { id: res.id, chunk: res.chunkSize || (pd && pd.chunkSize) || 4194304 };
        const sf = res.files || [];
        list = list.map((f, i) => {
          // the server numbers the files 1..n in the order sent and may clean up their names, so match by position
          const x = sf[i] || sf.find(y => y.name === f.name) || {};
          return { ...f, fileId: x.id, chunks: x.chunks != null ? x.chunks : Math.max(1, Math.ceil(f.size / plan.chunk)), next: 0, sent: 0, done: false };
        });
        this.setState({ ptId: res.id, ptPhase: 'uploading', upFiles: list });
      }
      for (const f of list) {
        if (f.done) continue;
        this.ptSetFile(f.key, { active: true, err: '' });
        for (let c = f.next || 0; c < f.chunks; c++) {
          await this.ptPutChunk(plan, f, c, ac.signal);
          this.ptSetFile(f.key, { next: c + 1, sent: Math.min(f.size, (c + 1) * plan.chunk) });
        }
        this.ptSetFile(f.key, { done: true, active: false, sent: f.size });
      }
      await api.completePatch(plan.id);
      if (ac.signal.aborted) return;
      this.setState({ ptPhase: 'verifying', ptSlow: false });
      this.pollPatch(d, plan.id);
    } catch (e) {
      if (e.aborted || ac.signal.aborted) return;
      if (e.status === 401) { this.endSession(SESSION_ENDED); return; }
      if (!plan) { this.setState({ ptPhase: 'form', ptErr: e.message, ptErrField: e.field || null }); return; }
      this.setState(st => ({ ptPhase: 'failed', ptErr: e.message, ptErrField: null, upFiles: (st.upFiles || []).map(f => f.active ? { ...f, active: false, err: e.message, retry: '' } : f) }));
    } finally {
      window.removeEventListener('beforeunload', this.onPtUnload);
      if (this._ptAbort === ac) this._ptAbort = null;
    }
  };
  /** Cancel during an upload, and Start over after a failure: stops the upload and deletes the patch on the server. */
  cancelUpload = async (quiet) => {
    const id = this.state.ptId, d = DEVICES.find(x => x.id === this.state.patchFor);
    if (this._ptAbort) this._ptAbort.abort();
    this._ptPlan = null;
    this.stopPatchPoll();
    this.setState(st => ({ ptPhase: 'form', ptId: null, ptStopAsk: false, ptErr: null, ptErrField: null, ptSlow: false,
      upFiles: (st.upFiles || []).map(f => ({ ...f, fileId: null, chunks: 0, next: 0, sent: 0, done: false, active: false, err: '', retry: '' })) }));
    if (id) {
      try { await api.deletePatch(id); }
      catch (e) { if (e.status === 401) { this.endSession(SESSION_ENDED); return; } }
      if (d) this.loadPatches(d, true);
    }
    if (quiet !== true) this.toast('Upload stopped', id ? 'The incomplete patch was deleted. Nothing was e-mailed.' : 'Nothing was uploaded.');
  };
  stopUploadAndClose = () => { this.cancelUpload(); this.setState({ ptPhase: 'form' }, () => this.finishClosePatch()); };
  /** After "complete": asks every 3 s whether the server has checked the files, while the dialog stays open. */
  pollPatch(d, id) {
    this.stopPatchPoll();
    let n = 0;
    const tick = async () => {
      this._ptPoll = null;
      const open = () => this.state.patchFor === d.id && this.state.ptId === id && this.state.ptPhase === 'verifying';
      if (!open()) return;
      const data = await this.loadPatches(d, true);
      if (!open()) return;
      const p = data && (data.patches || []).find(x => x.id === id);
      if (p && p.status === 'ready') {
        const n2 = (p.links || []).length || (data.recipients || []).length, mail = data.mail || {}, kind = (data.storage && data.storage.kind) || 'storage';
        this.setState({ ptPhase: 'ready' });
        this.toast('Patch uploaded', (p.name || p.version) + ' is stored in ' + kind + '. ' + (!n2 ? 'No contacts to e-mail: copy the download link to share it.'
          : mail.configured && mail.enabled ? 'E-mailed to ' + n2 + (n2 === 1 ? ' contact.' : ' contacts.') : 'E-mails wait for a mail server.'));
        return;
      }
      if (p && p.status === 'failed') { this.setState({ ptPhase: 'vfailed', ptErr: p.error || 'The server could not check the uploaded files.' }); return; }
      if (++n >= 200) { this.setState({ ptSlow: true }); return; }   // 10 minutes: the result shows on the Patches tab
      this._ptPoll = setTimeout(tick, 3000);
    };
    this._ptPoll = setTimeout(tick, 3000);
  }
  stopPatchPoll() { clearTimeout(this._ptPoll); this._ptPoll = null; }
  /** Copies a fresh download link for one file of a patch; the link also shows on the page, to copy by hand. */
  patchLinkCopy = async (p, f) => {
    const set = x => this.setState(st => ({ ptLinks: { ...(st.ptLinks || {}), [f.id]: { ...((st.ptLinks || {})[f.id] || {}), ...x } } }));
    set({ busy: true });
    try {
      const r = await api.patchLink(p.id, f.id);
      set({ busy: false, url: r.url, expiresAt: r.expiresAt });
      this.copyText(r.url, 'link:' + f.id, 'ptCopied');
    } catch (e) { set({ busy: false }); this.apiError(e, 'Could not make a download link'); }
  };
  resendPatch = async (d, p) => {
    this.setState({ ptBusy: p.id + ':resend' });
    try {
      const r = await api.resendPatch(p.id), n = (r && r.links) || 0, mail = (this.patchesOf(d).data || {}).mail || {};
      this.toast(n ? 'E-mail sent again' : 'Nothing to send', !n ? 'This patch has no contacts to e-mail.'
        : mail.configured && mail.enabled ? 'Queued for ' + n + (n === 1 ? ' contact.' : ' contacts.') : n + (n === 1 ? ' e-mail waits' : ' e-mails wait') + ' for a mail server.');
      await this.loadPatches(d, true);
    } catch (e) { this.apiError(e, 'Could not send the e-mail again'); }
    finally { this.setState({ ptBusy: null }); }
  };
  deletePatch = async (d, p) => {
    this.setState({ ptBusy: p.id + ':delete' });
    try {
      await api.deletePatch(p.id);
      this.setState({ ptDel: null });
      this.toast('Patch deleted', p.version + ' was deleted.');
      await this.loadPatches(d, true);
    } catch (e) { this.apiError(e, 'Could not delete the patch'); }
    finally { this.setState({ ptBusy: null }); }
  };
  /** The checks before an upload: version (vMAJOR.MINOR.PATCH, newer than the box's, new on it), notes, the guide, files. */
  ptCheck(s, d) {
    const pd = this.patchesOf(d).data;
    const ver = (s.patchVer || '').trim();
    const parse = v => { const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim()); return m ? m.slice(1).map(Number) : null; };
    const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    const pv = parse(ver);
    // the first patch of a box sets its version; every later one must be newer than the last version entered for it,
    // for a customer or product patch on every chosen box (24 and 25 Nov 2026; the server checks it again)
    const cb = (PT_GROUP[s.ptTarget] && pd && pd[PT_GROUP[s.ptTarget]]) || [], ptType = s.ptType || '';
    const targets = PT_GROUP[s.ptTarget] ? cb.filter(b => !ptType || String(b.deviceType || '').toLowerCase() === ptType.toLowerCase())
      : [{ name: d.name || d.id, lastVersion: pd && pd.lastVersion }];
    const top = targets.map(b => ({ name: b.name, last: parse(b.lastVersion) })).filter(x => x.last).reduce((m, x) => !m || cmp(x.last, m.last) > 0 ? x : m, null);
    const cur = top ? 'v' + top.last.join('.') : '';
    const srv = f => s.ptErrField === f && s.ptErr ? s.ptErr : '';
    const verErr = (!ver ? 'Enter the patch version.' : !pv ? 'Use the format vMAJOR.MINOR.PATCH, e.g. v1.0.0.'
      : top && cmp(pv, top.last) <= 0 ? 'Patch version must be newer than ' + cur + ', the last patch ' + (targets.length > 1 ? 'of ' + top.name : 'for this box') + '.' : '') || srv('version');
    const notesErr = ((s.ptNotes || '').length > 2000 ? 'Release notes can have at most 2000 characters.' : '') || srv('notes');
    const files = s.upFiles || [];
    const guideErr = (!files.some(f => f.guide) ? 'Add the guide file (PDF, DOCX, TXT or MD): every patch needs one.' : '') || srv('guide');
    const filesErr = (!files.some(f => !f.guide) ? 'Add at least one patch file.' : '') || srv('files');
    const targetErr = srv('target') || srv('deviceType');
    return { cur, first: !top, many: targets.length > 1, verErr, notesErr, guideErr, filesErr, targetErr, label: pv ? 'v' + pv.join('.') : '', block: !!(verErr || notesErr || guideErr || filesErr),
      focus: verErr ? 'pt-ver' : notesErr ? 'pt-notes' : guideErr ? 'pt-guide' : 'pt-file' };
  }
  addFiles(list) {
    const s = this.state, d = DEVICES.find(x => x.id === s.patchFor);
    if (!d || (s.ptPhase || 'form') !== 'form') { this.setState({ dz: false }); return; }
    const pd = this.patchesOf(d).data, max = (pd && pd.maxFileBytes) || 2147483648;
    const have = [...(s.upFiles || [])], skipped = [];
    [...(list || [])].forEach((f, i) => {
      if (have.filter(x => !x.guide).length >= 10) skipped.push(f.name + ' (10 files at most)');
      else if (!f.size) skipped.push(f.name + ' (empty)');
      else if (f.size > max) skipped.push(f.name + ' (larger than ' + sizeText(max) + ')');
      else if (have.some(x => x.name === f.name)) skipped.push(f.name + ' (already added)');
      else have.push({ key: Date.now() + '-' + i + '-' + f.name, file: f, name: f.name, size: f.size, sent: 0, next: 0, done: false, err: '', retry: '' });
    });
    this.setState({ upFiles: have, dz: false, ptFileErr: skipped.length ? 'Not added: ' + skipped.join(', ') + '.' : '', ...(s.ptErrField === 'files' ? { ptErr: null, ptErrField: null } : {}) });
  }
  /** The patch's guide file (TD-ROLES 7): one PDF, DOCX, TXT or MD document of up to 7 MB; always first in the upload. */
  setGuide(list) {
    const s = this.state, f = list && list[0], d = DEVICES.find(x => x.id === s.patchFor);
    if (!f || !d || (s.ptPhase || 'form') !== 'form') return;
    const pd = this.patchesOf(d).data, max = (pd && pd.maxGuideBytes) || 7340032;
    const err = !/\.(pdf|docx|txt|md)$/i.test(f.name) ? f.name + ': the guide must be a PDF, DOCX, TXT or MD document.'
      : !f.size ? f.name + ' is empty.'
      : f.size > max ? f.name + ' is larger than ' + sizeText(max) + ' (the guide is attached to the e-mail).'
      : (s.upFiles || []).some(x => !x.guide && x.name === f.name) ? f.name + ' is already one of the patch files.' : '';
    if (err) { this.setState({ ptGuideErr: err }); return; }
    const item = { key: 'guide-' + Date.now(), file: f, name: f.name, size: f.size, sent: 0, next: 0, done: false, err: '', retry: '', guide: true };
    this.setState(st => ({ upFiles: [item, ...(st.upFiles || []).filter(x => !x.guide)], ptGuideErr: '', ...(st.ptErrField === 'guide' ? { ptErr: null, ptErrField: null } : {}) }));
  }
  /** Starts a download: a link to the portal's one-use URL, which sends the browser on to the file (a 5-minute storage link,
   *  served as an attachment, so the page stays). A link, not a hidden frame: the site's CSP (default-src 'self') blocks
   *  frames from the API's address when the API is on another host. */
  startDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  /** Download (TD-ROLES 10.2): a fresh link of the user's own, used at once; so it works for as long as the patch exists. */
  downloadPatchFile = async (p, f) => {
    const k = p.id + ':' + f.id, mark = v => this.setState(st => ({ ptDl: { ...(st.ptDl || {}), [k]: v } }));
    mark(true);
    try {
      const r = await api.patchDownload(p.id, f.id);
      this.startDownload(r.url);
      return true;
    } catch (e) {
      if (e.status === 401) { this.endSession(SESSION_ENDED); return false; }
      this.apiError(e, 'Could not download ' + f.name);
      return false;
    } finally { mark(false); }
  };
  /** Download all: the files one after another (the guide first). */
  downloadAllPatch = async (p) => {
    const mark = v => this.setState(st => ({ ptDlAll: { ...(st.ptDlAll || {}), [p.id]: v } }));
    mark(true);
    try {
      for (const f of (p.files || [])) {
        if (!await this.downloadPatchFile(p, f)) break;
        await new Promise(r => setTimeout(r, 900));
      }
    } finally { mark(false); }
  };
  /** A client's problem report for a patch on this box; Support is notified (TD-ROLES 5.3). */
  reportPatchProblem = async (d, p) => {
    const note = (((this.state.ptProb || {})[p.id]) || '').trim();
    const setErr = t => this.setState(st => ({ ptProbErr: { ...(st.ptProbErr || {}), [p.id]: t } }));
    if (note.length < 3) { setErr('Describe the problem in a few words.'); return; }
    this.setState({ ptBusy: p.id + ':problem' });
    try {
      await api.patchProblem(p.id, d.key, note);
      this.setState(st => ({ ptProbOpen: { ...(st.ptProbOpen || {}), [p.id]: false }, ptProb: { ...(st.ptProb || {}), [p.id]: '' } }));
      this.toast('Problem reported', 'Excelsoft support is notified about ' + (p.name || p.version) + '.');
      await this.loadPatches(d, true);
    } catch (e) {
      if (e.status === 401) { this.endSession(SESSION_ENDED); return; }
      if (e.field) setErr(e.message); else this.apiError(e, 'Could not report the problem');
    } finally { this.setState({ ptBusy: null }); }
  };
  /** Add boxes of the customer to a released patch (TD-ROLES 8.1, Q3); they get the e-mail and show it as pending. */
  addBoxesToPatch = async (d, p) => {
    const sel = ((this.state.ptAdd || {})[p.id]) || {}, keys = Object.keys(sel).filter(k => sel[k]);
    const setErr = t => this.setState(st => ({ ptAddErr: { ...(st.ptAddErr || {}), [p.id]: t } }));
    if (!keys.length) { setErr('Choose at least one box.'); return; }
    this.setState({ ptBusy: p.id + ':add' });
    try {
      const r = await api.addPatchBoxes(p.id, keys), n = (r && r.added) || keys.length;
      this.setState(st => ({ ptAddOpen: { ...(st.ptAddOpen || {}), [p.id]: false }, ptAdd: { ...(st.ptAdd || {}), [p.id]: {} } }));
      this.toast('Boxes added', n + (n === 1 ? ' box now has ' : ' boxes now have ') + p.version + ' as pending; their contacts are e-mailed.');
      await this.loadPatches(d, true);
    } catch (e) {
      if (e.status === 401) { this.endSession(SESSION_ENDED); return; }
      if (e.field) setErr(e.message); else this.apiError(e, 'Could not add the boxes');
    } finally { this.setState({ ptBusy: null }); }
  };
  /** One patch as the Patches tab and the dialog list it (see PatchList.jsx), for the signed-in role (TD-ROLES 10). */
  patchRow(d, p, s, mailOk, pd) {
    const can = (s.me && s.me.can) || {}, support = !!can.patch, client = !!can.readOnly, staff = !client;
    const at = iso => iso ? fmtFull.format(new Date(iso)) : '—';
    const links = p.links || [], open = !!(s.ptOpen || {})[p.id], busy = s.ptBusy || '';
    const counts = {}; links.forEach(l => { counts[l.mail] = (counts[l.mail] || 0) + 1; });
    const downloads = p.downloads != null ? p.downloads : links.reduce((t, l) => t + (l.downloads || 0), 0);
    const lastDl = links.map(l => l.lastDownloadAt).filter(Boolean).sort().pop();
    const [stLabel, stTone] = PT_STATUS[p.status] || [p.status || 'Unknown', 'muted'];
    const ready = p.status === 'ready';
    const box = p.box || {}, [bLabel, bTone] = PT_BOX[box.status] || PT_BOX.pending;
    const bad = box.status === 'failed' || box.status === 'problem';
    const boxNote = !ready ? ''
      : box.status === 'installed' ? 'Installed on this box · ' + at(box.at) + ' (reported by the box)'
      : box.status === 'installing' ? 'Installing since ' + at(box.at) + ' (reported by the box)'
      : box.status === 'failed' ? 'Failed on this box · ' + at(box.at) + (box.reason ? ': ' + box.reason : '')
      : box.status === 'problem' ? 'Problem reported · ' + at(box.at) + (box.reason ? ': ' + box.reason : '')
      : box.status === 'not_reported' ? 'This box runs an agent older than 0.3.1, which cannot report the deployment: update it (sudo bash ./setup-device.sh --upgrade).'
      : 'Released for this box, not installed yet. Install it by hand, following the guide.';
    const files = p.files || [], boxes = p.boxes || [], customer = p.target === 'customer', product = p.target === 'product';
    const dl = s.ptDl || {};
    const probOpen = !!(s.ptProbOpen || {})[p.id];
    const addOpen = !!(s.ptAddOpen || {})[p.id], addSel = (s.ptAdd || {})[p.id] || {};
    const inPatch = new Set(boxes.map(b => b.key));
    const group = pd && pd[product ? 'productBoxes' : 'customerBoxes'];
    const cands = support && ready && group ? group.filter(b => !inPatch.has(b.key)) : [];
    const stepsOpen = !!(s.ptSteps || {})[p.id], histOpen = !!(s.ptHist || {})[p.id], boxesOpen = !!(s.ptBoxes || {})[p.id];
    const flip = (k, v) => this.setState(st => ({ [k]: { ...(st[k] || {}), [p.id]: v } }));
    const total = p.boxCount != null ? p.boxCount : boxes.length;
    return {
      key: p.id, version: p.version, title: p.name || p.version,
      statusShow: staff && !ready, statusLabel: stLabel, statusFg: PT_TONE[stTone][0], statusBg: PT_TONE[stTone][1],
      boxLabel: ready ? bLabel : '', boxFg: PT_TONE[bTone][0], boxBg: PT_TONE[bTone][1], boxNote, boxNoteFg: bad ? '#B21E1E' : box.status === 'not_reported' ? '#8A5200' : '#5A6675',
      meta: client ? 'Released ' + at(p.readyAt || p.createdAt) + ' by Excelsoft'
        : 'Uploaded by ' + (p.createdBy || 'unknown') + ' · ' + at(p.createdAt) + (p.readyAt && ready ? ' · checked ' + at(p.readyAt) : ''),
      targetNote: customer ? 'For every ' + (p.targetDeviceType ? p.targetDeviceType + ' ' : '') + 'box of ' + (p.targetCustomer || 'this customer') + (staff ? ' (' + total + (total === 1 ? ' box)' : ' boxes)') : '')
        : product ? 'For every ' + (p.product || 'box of this product') + (p.targetDeviceType ? ' (' + p.targetDeviceType + ')' : '') + (staff ? ' · ' + total + (total === 1 ? ' box' : ' boxes') : '') : '',
      notes: p.notes || '', err: p.status === 'failed' && p.error ? p.error : '',
      noGuide: ready && !files.some(f => f.guide) ? 'No guide file (uploaded before guides were required): follow the standard steps.' : '',
      files: files.map(f => {
        const ln = (s.ptLinks || {})[f.id] || {};
        return { key: f.id, name: f.name, guide: !!f.guide, size: sizeText(f.size || 0), sha: f.sha256 || '', shaShort: f.sha256 ? f.sha256.slice(0, 12) + '…' : ready ? 'Not reported' : 'Checked after upload',
          shaCopied: s.ptCopied === 'sha:' + f.id, copySha: () => this.copyText(f.sha256, 'sha:' + f.id, 'ptCopied'),
          linkShow: support && ready, linkBusy: !!ln.busy, linkUrl: ln.url || '', linkExp: ln.expiresAt ? 'Valid until ' + at(ln.expiresAt) : '',
          linkCopied: s.ptCopied === 'link:' + f.id, copyLink: () => this.patchLinkCopy(p, f),
          dlShow: !!can.patchDownload && ready, dlBusy: !!dl[p.id + ':' + f.id], download: () => this.downloadPatchFile(p, f) };
      }),
      dlAllShow: !!can.patchDownload && ready && files.length > 1, dlAllBusy: !!(s.ptDlAll || {})[p.id], downloadAll: () => this.downloadAllPatch(p),
      stepsShow: ready, stepsOpen, stepsToggle: () => flip('ptSteps', !stepsOpen), steps: PATCH_GUIDE_STANDARD(p.version),
      problemShow: !!can.patchReport && ready, problemOpen: probOpen, problemToggle: () => flip('ptProbOpen', !probOpen),
      problemText: (s.ptProb || {})[p.id] || '',
      problemSet: e => { const v = e.target.value; this.setState(st => ({ ptProb: { ...(st.ptProb || {}), [p.id]: v }, ptProbErr: { ...(st.ptProbErr || {}), [p.id]: '' } })); },
      problemSend: () => this.reportPatchProblem(d, p), problemBusy: busy === p.id + ':problem', problemErr: (s.ptProbErr || {})[p.id] || '',
      boxesShow: staff && ready && (customer || boxes.length > 1), boxesOpen, boxesToggle: () => flip('ptBoxes', !boxesOpen),
      boxesLabel: (p.installedCount || 0) + ' of ' + total + (total === 1 ? ' box' : ' boxes') + ' installed',
      boxes: boxes.map(b => {
        const [lb, tn] = PT_BOX[b.status] || PT_BOX.pending, sad = b.status === 'failed' || b.status === 'problem';
        return { key: b.key, name: b.name, label: lb, fg: PT_TONE[tn][0], bg: PT_TONE[tn][1],
          note: (sad && b.reason ? b.reason + ' · ' : '') + (b.at ? at(b.at) : ''), noteFg: sad ? '#B21E1E' : '#5A6675' };
      }),
      addShow: support && ready && customer, addOpen, addToggle: () => flip('ptAddOpen', !addOpen),
      addCands: cands.map(b => ({ key: b.key, name: b.name + (b.deviceType ? ' · ' + b.deviceType : ''), checked: !!addSel[b.key],
        toggle: () => this.setState(st => ({ ptAdd: { ...(st.ptAdd || {}), [p.id]: { ...(((st.ptAdd || {})[p.id]) || {}), [b.key]: !addSel[b.key] } }, ptAddErr: { ...(st.ptAddErr || {}), [p.id]: '' } })) })),
      addNone: 'Every box of this customer already has this patch.', addSend: () => this.addBoxesToPatch(d, p), addBusy: busy === p.id + ':add', addErr: (s.ptAddErr || {})[p.id] || '',
      mailShow: staff,
      mailSummary: links.length ? Object.keys(PT_MAIL).filter(k => counts[k]).map(k => counts[k] + ' ' + PT_MAIL[k][0].toLowerCase()).join(' · ')
        : ready ? 'No contacts e-mailed' : 'E-mailed when the files are checked',
      mailNote: links.some(l => l.mail === 'waiting_mail_server') && !mailOk ? 'They go out as soon as a mail server is configured.' : '',
      downloads: downloads + (downloads === 1 ? ' download' : ' downloads') + (lastDl ? ' · last ' + at(lastDl) : ''),
      recipients: links.map((l, i) => {
        const [lb, tn] = PT_MAIL[l.mail] || [l.mail || 'Unknown', 'muted'];
        return { key: i, email: l.recipient, label: lb, fg: PT_TONE[tn][0], bg: PT_TONE[tn][1], err: l.mail === 'failed' && l.mailError ? l.mailError : '',
          sub: (l.kind === 'copy' ? 'Copied link · ' : '') + (l.expiresAt ? (l.mail === 'expired' ? 'Link expired ' : 'Link valid until ') + at(l.expiresAt) : '') + (l.downloads ? ' · ' + l.downloads + (l.downloads === 1 ? ' download' : ' downloads') : '') };
      }),
      recipOpen: open, recipToggle: () => this.setState(st => ({ ptOpen: { ...(st.ptOpen || {}), [p.id]: !open } })),
      recipToggleLabel: (open ? 'Hide' : 'Show') + ' e-mails (' + links.length + ')', recipToggleShow: links.length > 0,
      histShow: staff && (p.history || []).length > 0, histOpen, histToggle: () => flip('ptHist', !histOpen),
      // the history names boxes as the page does (its name), not by their key
      history: (p.history || []).map((e, i) => {
        const nameOf = k => { const b = boxes.find(x => x.key === k); return !b ? k : b.name.endsWith(' ' + p.version) ? b.name.slice(0, -(p.version.length + 1)) : b.name; };
        const x = e.detail || {}, detail = Array.isArray(x.boxes) ? { ...x, boxes: x.boxes.map(nameOf) } : x;
        return { key: i, at: at(e.at), text: (PT_EVENT[e.event] || (() => e.event))({ ...e, device: e.device ? nameOf(e.device) : e.device }, detail) };
      }),
      resendShow: support && ready && links.length > 0, resendBusy: busy === p.id + ':resend', resend: () => this.resendPatch(d, p),
      delShow: support, delBusy: busy === p.id + ':delete', delAsk: s.ptDel === p.id,
      del: () => { this.setState({ ptDel: p.id }); setTimeout(() => { const b = document.querySelector((this.state.patchFor ? '[data-trap="patch"] ' : '') + '[data-del-keep="' + p.id + '"]'); b && b.focus(); }, 0); },
      delCancel: () => this.setState({ ptDel: null }), delConfirm: () => this.deletePatch(d, p)
    };
  }
  /** The "Update patch" dialog. */
  patchVals(s) {
    const d = DEVICES.find(x => x.id === s.patchFor);
    if (!d) return { patchDisplay: 'none', pv: {}, ptCards: [], ptButtons: [], upFiles: [], ptHistory: [], ptRecips: [], closePatch: this.closePatch };
    // only the support engineer sends patches (TD-ROLES 4); everyone else sees the list read-only
    const canPatch = !!(s.me && s.me.can && s.me.can.patch);
    const P = this.patchesOf(d), pd = P.data || null;
    const phase = s.ptPhase || 'form', moving = phase === 'starting' || phase === 'uploading', locked = phase !== 'form';
    const chk = this.ptCheck(s, d), tried = !!s.ptTried;
    const storage = pd && pd.storage, mail = (pd && pd.mail) || {}, recips = (pd && pd.recipients) || [], mailOk = !!(mail.configured && mail.enabled);
    const storeOk = !!(storage && storage.ready);
    const files = s.upFiles || [], dz = !!s.dz;
    // the guide has its own place in the form; once the upload starts it is listed with the files, first
    const shown = locked ? files : files.filter(f => !f.guide), patchFiles = files.filter(f => !f.guide), guideF = files.find(f => f.guide);
    // Send to (TD-ROLES 16.3, 25 Nov 2026): two choices, this box or every box of its solution (product, e.g. every
    // Proctor in a Box of every customer), the latter optionally of one device type
    const prod = pd && pd.product, target = PT_GROUP[s.ptTarget] ? s.ptTarget : 'device';
    const pbAll = (pd && pd.productBoxes) || [], cb = pbAll;
    const types = [...new Set(cb.map(b => b.deviceType).filter(Boolean))].sort(), ptType = s.ptType || '';
    const chosen = target !== 'device' ? cb.filter(b => !ptType || String(b.deviceType || '').toLowerCase() === ptType.toLowerCase()) : [];
    const pickTarget = t => () => this.setState({ ptTarget: t, ptType: '', ...(['target', 'deviceType'].includes(s.ptErrField) ? { ptErr: null, ptErrField: null } : {}) });
    const names = l => l.length <= 5 ? l.map(b => b.name).join(', ') : l.slice(0, 5).map(b => b.name).join(', ') + ' and ' + (l.length - 5) + ' more';
    const total = files.reduce((t, f) => t + f.size, 0), sent = files.reduce((t, f) => t + (f.done ? f.size : f.sent || 0), 0);
    const pct = total ? Math.floor(sent / total * 100) : 0, fileNo = Math.min(files.length, files.filter(f => f.done).length + 1);
    const tone = ext => /^(zip|tar|gz|tgz|7z|rar|deb|run|img|iso|bin)$/.test(ext) ? ['#EEF2F7', '#005BB8'] : /^(json|yaml|yml|xml|conf|cfg|ini|env|sh|py|js)$/.test(ext) ? ['#F2EDFC', '#5A3AA6'] : /^(onnx|engine|plan|pt|pth|trt|tflite|h5)$/.test(ext) ? ['#E7F6EC', '#0E7A36'] : ['#FEF3E2', '#8A5200'];
    const stop = e => { e.preventDefault(); e.stopPropagation(); };
    const showVer = (s.verTouched || tried || s.ptErrField === 'version') && !!chk.verErr;
    const showNotes = !!chk.notesErr, showFiles = (tried || s.ptErrField === 'files') && !!chk.filesErr;
    const max = (pd && pd.maxFileBytes) || 2147483648;
    const result = (phase === 'ready' || phase === 'vfailed') && pd ? (pd.patches || []).find(p => p.id === s.ptId) : null;
    const kind = (storage && storage.kind) || 'storage';
    // why Upload is not available yet (the form's own mistakes show when it is pressed)
    const why = !pd ? (P.busy ? 'Loading…' : 'The patch details could not be loaded') : !storeOk ? 'The patch storage is not ready' : '';
    const btn = (label, kind2, fn, extra) => ({ label, kind: kind2, fn, disabled: false, title: '', id: undefined, icon: null, ...extra });
    const upIcon = 'M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3';
    const buttons = !canPatch ? [btn('Close', 'secondary', this.closePatch)]
      : phase === 'form' ? [btn('Close', 'secondary', this.closePatch), btn('Upload patch', 'primary', this.uploadPatch, { disabled: !!why, title: why, icon: upIcon, id: 'pt-go' })]
      : moving ? [btn('Cancel upload', 'danger', () => this.cancelUpload()), btn(phase === 'starting' ? 'Starting…' : 'Uploading… ' + pct + '%', 'primary', () => {}, { disabled: true, icon: upIcon })]
      : phase === 'failed' ? [btn('Start over', 'secondary', () => this.cancelUpload(true)), btn('Try again', 'primary', this.uploadPatch, { icon: 'M3 12a9 9 0 1 0 2.64-6.36M3 3v6h6', id: 'pt-go' })]
      : phase === 'verifying' ? [btn('Close', 'secondary', this.closePatch)]
      : phase === 'ready' ? [btn('Upload another', 'secondary', () => this.resetPatchForm()), btn('Done', 'primary', this.closePatch)]
      : [btn('Close', 'secondary', this.closePatch), btn('Start over', 'primary', () => this.resetPatchForm({ upFiles: files.map(f => ({ ...f, fileId: null, chunks: 0, next: 0, sent: 0, done: false, active: false, err: '', retry: '' })), patchVer: s.patchVer, ptNotes: s.ptNotes }))];
    return {
      patchDisplay: 'flex', closePatch: this.closePatch,
      pv: { title: d.name || d.id, sub: [d.name && d.name !== d.id ? d.id : null, d.type, d.customer].filter(x => x && x !== '—').join(' · ') },
      ptCards: [
        { label: 'Last patch version', value: !pd ? (P.busy ? 'Loading…' : '—') : chk.cur || 'None yet', sub: !pd ? '' : chk.cur ? 'The next patch must be newer' : 'The first patch sets the version', tone: 'blue', icon: 'M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14' },
        { label: 'Storage', value: storage ? storage.kind || 'Not set up' : P.busy ? 'Loading…' : '—', sub: !storage ? '' : storeOk ? 'Ready for uploads' : 'Not ready', subFg: storage && !storeOk ? '#B21E1E' : '#5A6675', tone: 'grey', icon: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
        { label: 'E-mail recipients', value: pd ? recips.length + (recips.length === 1 ? ' contact' : ' contacts') : P.busy ? 'Loading…' : '—', sub: !pd ? '' : mailOk ? 'Mail server ready' : 'No mail server yet', tone: 'amber', icon: 'M4 4h16v16H4zM4 6l8 7 8-7' }
      ],
      ptLoadShow: !pd && (P.busy || !!P.err), ptLoadText: P.busy ? 'Loading the patches of this device…' : P.err || '', ptLoadErr: !P.busy && !!P.err, ptLoadRetryShow: !P.busy && !!P.err && !P.denied, ptLoadRetry: () => this.loadPatches(d),
      ptReadOnly: !canPatch && !P.denied,
      ptDetailsShow: canPatch && !!pd && ['form', 'starting', 'uploading', 'failed'].includes(phase),
      ptFilesShow: canPatch && !!pd && ['form', 'starting', 'uploading', 'failed', 'verifying'].includes(phase),
      ptRecipShow: canPatch && !!pd && ['form', 'starting', 'uploading', 'failed'].includes(phase),
      ptLocked: locked,
      ptReadOnlyText: s.me && s.me.can && s.me.can.readOnly ? 'Patches are sent by Excelsoft support. Download them, with their guide, on the device\'s Patches tab.'
        : 'Only support engineers upload patches. The patches of this device are listed below.',
      ptTargetShow: canPatch && !!pd && ['form', 'starting', 'uploading', 'failed'].includes(phase),
      ptTargets: [
        { value: 'device', label: 'This box', on: target === 'device', disabled: false, pick: pickTarget('device') },
        { value: 'product', label: prod ? 'Every ' + prod : 'Every box of its solution',
          on: target === 'product', disabled: !prod || !pbAll.length, pick: pickTarget('product') }
      ],
      ptTypeShow: target !== 'device' && types.length > 1, ptType, onPtType: e => this.setState({ ptType: e.target.value, ...(s.ptErrField === 'deviceType' ? { ptErr: null, ptErrField: null } : {}) }),
      ptTypes: [{ value: '', label: 'All device types' }, ...types.map(t => ({ value: t, label: t }))],
      ptTargetNote: chk.targetErr || (target === 'device'
        ? 'The patch goes to ' + (d.name || d.id) + ' only.' + (prod ? '' : ' This box has no product (solution) in its registration, so a patch for every box of a solution cannot be made from it.')
        : !chosen.length ? 'No box of this solution is of that device type.'
        : 'Goes to ' + chosen.length + (chosen.length === 1 ? ' box: ' : ' boxes: ') + names(chosen) + '.'
          + ' Each customer is e-mailed about its own boxes only, and sees only those. A box registered later gets it only with Add boxes.'),
      ptTargetNoteFg: chk.targetErr || (target !== 'device' && !chosen.length) ? '#B21E1E' : '#5A6675',
      ptGuideShow: canPatch && !!pd && phase === 'form',
      ptGuide: guideF ? { name: guideF.name, size: sizeText(guideF.size) } : null,
      ptGuideHint: 'Required · PDF, DOCX, TXT or MD · up to ' + sizeText((pd && pd.maxGuideBytes) || 7340032),
      ptGuidePick: e => { this.setGuide(e.target.files); e.target.value = ''; },
      ptGuideRemove: () => this.setState(st => ({ upFiles: (st.upFiles || []).filter(x => !x.guide) })),
      ptGuideErr: s.ptGuideErr || ((tried || s.ptErrField === 'guide') ? chk.guideErr : ''),
      ptGuideBorder: (tried || s.ptErrField === 'guide') && chk.guideErr ? '#DC2626' : '#C9D2DE',
      ptGuideVersion: chk.label,
      verRef: this.verRef || (this.verRef = React.createRef()),
      patchVer: s.patchVer || '', onPatchVer: e => this.setState({ patchVer: e.target.value, verTouched: true, ...(s.ptErrField === 'version' ? { ptErr: null, ptErrField: null } : {}) }),
      verInvalid: showVer ? 'true' : 'false', verBorder: showVer ? '#DC2626' : '#D5DBE4', verErrDisplay: showVer ? 'block' : 'none', verErr: chk.verErr,
      verHint: chk.first ? 'Use the format vMAJOR.MINOR.PATCH, e.g. v1.0.0. This is the first patch for ' + (chk.many ? 'these boxes' : 'this box') + ': it sets the version; every next patch must be newer.'
        : 'Use the format vMAJOR.MINOR.PATCH. It must be newer than ' + chk.cur + ', the last patch ' + (chk.many ? 'of these boxes' : 'for this box') + '.',
      ptNotes: s.ptNotes || '', onPtNotes: e => this.setState({ ptNotes: e.target.value, ...(s.ptErrField === 'notes' ? { ptErr: null, ptErrField: null } : {}) }),
      ptNotesCount: (s.ptNotes || '').length + ' / 2000', ptNotesCountFg: (s.ptNotes || '').length > 2000 ? '#B21E1E' : '#5A6675',
      ptNotesInvalid: showNotes ? 'true' : 'false', ptNotesBorder: showNotes ? '#DC2626' : '#D5DBE4', ptNotesErr: showNotes ? chk.notesErr : '',
      ptFilesHint: 'Any format · up to ' + sizeText(max) + ' per file · up to 10 files',
      ptFilesErr: showFiles ? chk.filesErr : s.ptFileErr || '', ptFilesErrFg: showFiles ? '#B21E1E' : '#8A5200',
      dzShow: !locked,
      dzBorder: dz ? '#0070E0' : showFiles ? '#DC2626' : '#C9D2DE', dzBg: dz ? '#EEF2F7' : '#FFFFFF', dzStyle: dz ? 'solid' : 'dashed',
      dzShadow: dz ? '0 0 0 4px rgba(0,112,224,.12)' : 'none', dzPad: files.length ? '14px 16px' : '22px 20px',
      dzTileBg: dz ? '#0070E0' : '#EEF2F7', dzTileFg: dz ? '#FFFFFF' : '#0070E0', dzTileBorder: dz ? '#0070E0' : '#E1E6EF',
      dzSub: dz ? 'Release to add these files to the patch.' : patchFiles.length ? 'Add more files. They upload when you press Upload patch.' : 'Application builds, AI models, Docker images or config files. Any format, up to ' + sizeText(max) + ' each.',
      dzTitle: dz ? 'Drop to add' : patchFiles.length ? 'Drop more files here' : 'Drag and drop patch files here',
      dzEnter: e => { stop(e); if (!this.state.dz && !locked) this.setState({ dz: true }); },
      dzOver: e => { stop(e); if (!this.state.dz && !locked) this.setState({ dz: true }); },
      dzLeave: e => { stop(e); if (!e.currentTarget.contains(e.relatedTarget)) this.setState({ dz: false }); },
      dzDrop: e => { stop(e); this.addFiles(e.dataTransfer && e.dataTransfer.files); },
      dzPick: e => { this.addFiles(e.target.files); e.target.value = ''; },
      upListDisplay: shown.length ? 'flex' : 'none',
      upFiles: shown.map(f => {
        const ext = (f.name.includes('.') ? f.name.split('.').pop() : 'file').toLowerCase().slice(0, 4), [bg, fg] = tone(ext);
        const fp = f.done ? 100 : f.size ? Math.floor((f.sent || 0) / f.size * 100) : 0, started = locked;
        return { key: f.key, name: (f.guide ? 'Guide · ' : '') + f.name, ext: ext.toUpperCase(), tileBg: bg, tileFg: fg, pctW: fp + '%', barShow: started,
          state: f.done ? '✓ Uploaded' : f.err ? 'Failed' : f.active ? fp + '%' : started ? (f.sent ? fp + '%' : 'Waiting') : sizeText(f.size),
          stateFg: f.done ? '#0E7A36' : f.err ? '#B21E1E' : f.retry ? '#8A5200' : started ? '#005BB8' : '#5A6675',
          barBg: f.done ? '#16A34A' : f.err ? '#DC2626' : '#0070E0',
          meta: f.err ? f.err : f.retry ? f.retry : f.done ? sizeText(f.size) : started ? sizeText(f.sent || 0) + ' of ' + sizeText(f.size) : 'Ready to upload',
          metaFg: f.err ? '#B21E1E' : f.retry ? '#8A5200' : '#5A6675',
          removeShow: !locked, removeAria: 'Remove ' + f.name, remove: () => this.setState(st => ({ upFiles: st.upFiles.filter(x => x.key !== f.key), ptFileErr: '' })) };
      }),
      ptRecips: recips, ptRecipNone: !recips.length, ptMailNote: pd && !mailOk ? 'No mail server is set yet. The e-mails wait in the queue and go out as soon as one is configured. You can copy the download link now.' : '',
      ptStorageErr: pd && !storeOk ? (storage && storage.error) || 'The patch storage is not set up on the portal server, so patches cannot be uploaded yet.' : '',
      ptErrShow: !!s.ptErr && !s.ptErrField && (phase === 'form' || phase === 'failed'), ptErr: s.ptErr || '',
      ptPanel: phase === 'verifying' ? { kind: 'busy', title: 'Verifying…', text: s.ptSlow ? 'The server is still checking the files. You can close this dialog: the result shows on the device\'s Patches tab.' : 'All files are uploaded. The server is checking them (SHA-256) and storing them in ' + kind + '. You can close this dialog; it carries on.' }
        : phase === 'ready' ? { kind: 'ok', title: 'Patch ' + ((result && result.version) || chk.label) + ' uploaded · stored in ' + kind, text: !recips.length ? 'No contacts are set for these boxes: copy the download link below to share it.' : mailOk ? 'The software contacts and the customer\'s client accounts are e-mailed a download link, with the guide attached.' : 'The e-mails wait for a mail server. Copy the download link below to share it now.' }
        : phase === 'vfailed' ? { kind: 'err', title: 'The patch was not accepted', text: s.ptErr || 'The server could not check the uploaded files.' }
        : null,
      ptResult: result ? this.patchRow(d, result, s, mailOk, pd) : null,
      ptHistory: [],   // the list of patches is the client's only (24 Nov 2026): the dialog shows the upload and its result
      ptProgShow: moving || phase === 'failed', ptProgW: pct + '%', ptProgBg: phase === 'failed' ? '#DC2626' : '#0070E0',
      ptStatus: phase === 'starting' ? 'Creating the patch on the server…' : phase === 'uploading' ? 'Uploading file ' + fileNo + ' of ' + files.length + ' · ' + pct + '% · ' + sizeText(sent) + ' of ' + sizeText(total)
        : phase === 'failed' ? 'Upload stopped at ' + pct + '%. Try again carries on from where it stopped.' : phase === 'verifying' ? 'Verifying…' : '',
      ptStopAsk: !!s.ptStopAsk, ptStop: this.stopUploadAndClose, ptKeep: () => { this.setState({ ptStopAsk: false }); setTimeout(() => { const b = this.patchCloseRef && this.patchCloseRef.current; b && b.focus(); }, 0); },
      ptButtons: buttons
    };
  }
  /** A blank registration. The product decides the device type (review, 6 Nov 2026); opened from a device-type page, its product is chosen. */
  regInit(cat) {
    const product = Object.keys(PRODUCT_TYPE).find(pn => PRODUCT_TYPE[pn] === cat) || '';
    return { product, type: PRODUCT_TYPE[product] || '', deviceId: '', lanMac: '', wifiMac: '', serial: '', name: '', customer: '', site: '', location: '', date: isoLocal(), contact: '', email: '', phone: '', serverErr: null };
  }
  openRegister = () => {
    if (!(this.state.me && this.state.me.can && this.state.me.can.register)) { this.toast('Only admins can register devices', 'Ask a portal admin to register this box.', 'error'); return; }
    this.setState({ regOpen: true, reg: this.regInit(this.state.catType), regSubmit: false, regBusy: false, regServerErr: null, open: null });
    setTimeout(() => { const sc = [...document.querySelectorAll('[data-trap] div')].filter(el => /(auto|scroll)/.test(getComputedStyle(el).overflowY)); sc.forEach(el => { el.scrollTop = 0; }); this.regCloseRef && this.regCloseRef.current && this.regCloseRef.current.focus(); }, 30);
  };
  closeRegister = () => { this.setState({ regOpen: false, open: null }); setTimeout(() => { const t = document.querySelector('[data-trigger="register"]'); t && t.focus(); }, 0); };
  /** A form field's value as the server saw it: what a refusal from the server is compared with. */
  regVal(r, k) { return String(r[k] || '').trim(); }
  regErrors(r) {
    const e = {};
    // the device ID is typed by the admin (25 Nov 2026: no generated IDs): 3-64 lowercase letters, digits, '.', '_' or '-',
    // starting with a letter or digit, not already registered
    const devId = (r.deviceId || '').trim();
    if (!devId) e.deviceId = 'Enter the device ID, e.g. proctor-003.';
    else if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(devId)) e.deviceId = 'Use 3–64 lowercase letters, digits, dots, dashes or underscores, starting with a letter or digit.';
    else if (DEVICES.some(d => String(d.id || '').toLowerCase() === devId.toLowerCase())) e.deviceId = 'A device with this ID is already registered.';
    const name = r.name.trim(), serial = (r.serial || '').trim(), lan = (r.lanMac || '').trim(), wifi = (r.wifiMac || '').trim();
    // both MACs are required (13 Nov 2026), each checked on its own field
    if (!lan) e.lanMac = 'Enter the LAN MAC, as printed on the device label.';
    else if (macErr(lan)) e.lanMac = macErr(lan);
    if (!wifi) e.wifiMac = 'Enter the Wi‑Fi MAC, as printed on the device label.';
    else if (macErr(wifi)) e.wifiMac = macErr(wifi);
    if (!e.lanMac && !e.wifiMac && normMac(lan) === normMac(wifi)) e.wifiMac = 'LAN and Wi‑Fi MAC must be different.';
    if (serial && !/^[A-Za-z0-9:.-]{4,40}$/.test(serial)) e.serial = 'Use 4–40 letters, digits, dashes or colons, as printed on the device label.';
    if (name.length > 100) e.name = 'Use at most 100 characters.';
    else if (DEVICES.some(d => (d.name || '').toLowerCase() === name.toLowerCase())) e.name = 'Another device already uses this name.';
    if (!r.product) e.product = 'Select a product assignment.';
    if (!r.customer.trim()) e.customer = 'Enter the customer or institution.';
    else if (r.customer.trim().length > 200) e.customer = 'Use at most 200 characters.';
    if (r.site.trim() && !/^[A-Za-z0-9_-]{1,64}$/.test(r.site.trim())) e.site = 'Use letters, digits, dash or underscore.';
    if (r.location.trim().length > 200) e.location = 'Use at most 200 characters.';
    if (!r.date) e.date = 'Installation date is required.';
    else if (r.date > isoLocal()) e.date = 'Installation date cannot be in the future.';
    if (!r.contact.trim()) e.contact = 'Contact name is required.';
    if (!r.email.trim()) e.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(r.email.trim())) e.email = 'Enter a valid email address.';
    if (r.phone.trim() && !/^[+\d][\d\s()+-]{5,39}$/.test(r.phone.trim())) e.phone = 'Enter a valid phone number.';
    // a refusal from the server stays on its field until that field changes
    const se = r.serverErr;
    if (se && !e[se.field] && this.regVal(r, se.field) === se.value) e[se.field] = se.msg;
    return e;
  }
  submitRegister = async (ev) => {
    ev.preventDefault();
    const r = this.state.reg, e = this.regErrors(r);
    if (Object.keys(e).length) {
      this.setState({ regSubmit: true, regServerErr: null });
      const order = ['product', 'customer', 'date', 'site', 'location', 'deviceId', 'lanMac', 'wifiMac', 'serial', 'name', 'contact', 'email', 'phone'];
      const first = order.find(k => e[k]);
      setTimeout(() => { const el = REG_IDS[first] ? document.getElementById(REG_IDS[first]) : document.querySelector('input[name="rgProducts"]'); el && el.focus(); }, 0);
      return;
    }
    if (this.state.regBusy) return;
    this.setState({ regBusy: true, regServerErr: null });
    // no device ID: the Sync API makes it; the display name, left empty, defaults to it on the server
    const body = { deviceId: (r.deviceId || '').trim(), lanMac: normMac(r.lanMac) || '', wifiMac: normMac(r.wifiMac) || '', serial: r.serial.trim(), deviceType: AGENT_TYPE[r.type] || r.type, displayName: r.name.trim(), product: r.product,
      customer: r.customer.trim(), siteCode: r.site.trim(), location: r.location.trim(), installedOn: r.date,
      supportContact: r.contact.trim(), supportEmail: r.email.trim(), supportPhone: r.phone.trim() };
    Object.keys(body).forEach(k => { if (body[k] === '') delete body[k]; });
    try {
      const res = await api.register(body);
      this.setState({ regOpen: false, regBusy: false, open: null, f: { ...EMPTY_F }, q: '', page: 1,
        boxKey: this.boxKeyInfo(res, 'Device registered', r.type + ' · ' + r.customer.trim(), '[data-trigger="register"]') });
      this.refreshData(true);
    } catch (err) {
      if (err.status === 401) { this.endSession(SESSION_ENDED); return; }
      // a refusal about one field (the "field" of the problem details, e.g. a MAC already registered to another box) goes
      // on that field; an older server only says "name" in its message
      const field = (err.status === 400 || err.status === 409) && (regField(err.field) || (err.status === 409 && !err.field && /name/i.test(err.message) ? 'name' : null));
      if (field) {
        this.setState(st => ({ regBusy: false, regSubmit: true, reg: { ...st.reg, serverErr: { field, msg: err.message, value: this.regVal(st.reg, field) } } }));
        setTimeout(() => { const el = REG_IDS[field] ? document.getElementById(REG_IDS[field]) : document.querySelector('input[name="rgProducts"]'); if (el) { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); } }, 0);
      } else this.setState({ regBusy: false, regServerErr: err.message });
    }
  };
  /** What the "Device registered" dialog shows for a registration or a new enrolment code: the device ID, then either the
   *  one-time enrolment code (registered by MAC) or the one-time box key, with the install command and the steps. */
  boxKeyInfo(res, title, subtitle, back) {
    const mac = res.enrolment === 'mac' || (!!res.enrolCode && !res.boxKey);
    const fmt = x => x ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(x)) : '';
    const until = fmt(res.enrolCodeExpiresAt), agent = this.agentInfo(res.agent, fmt);
    // with an agent uploaded (TD-AGENT-DOWNLOAD) the box downloads it itself: the commands in the dialog do every step
    if (agent) return { title, deviceId: res.deviceId, subtitle, mode: mac ? 'mac' : 'key', key: mac ? null : res.boxKey, code: mac ? res.enrolCode : null, codeUntil: until, command: res.installCommand, back, agent,
      steps: ["Paste the commands on the box (in a terminal there; they need the box's sudo password): they download agent " + agent.version + ', unpack it and start the setup.',
        mac ? 'Type the enrolment code when the setup asks for it.' : 'Paste the box key when the setup asks for it.',
        'The box shows as Online after its first reading, within a few minutes. Readings taken without internet stay on the box and are uploaded when it reconnects.'] };
    return { title, deviceId: res.deviceId, subtitle, mode: mac ? 'mac' : 'key', key: mac ? null : res.boxKey, code: mac ? res.enrolCode : null, codeUntil: until, command: res.installCommand, back,
      // portal 0.2.3: the command already carries the box's public central address, device ID, product, customer and site
      steps: mac ? [PREP_BY_HAND,
        "Run the command above there (it needs the box's sudo password) and type the enrolment code when it asks for it.",
        'The box shows as Online after its first reading, within a few minutes.']
        : [PREP_BY_HAND,
          "Run the command above there (it needs the box's sudo password) and paste the box key when it asks for it.",
          'The box shows as Online after its first reading, within a few minutes. Readings taken without internet stay on the box and are uploaded when it reconnects.'] };
  }
  registerVals(s) {
    const r = s.reg || this.regInit(), e = this.regErrors(r), sub = !!s.regSubmit;
    const setR = (k, v) => this.setState(st => { const cur = st.reg || this.regInit(); const next = { ...cur, [k]: v };
      if (k === 'product') next.type = PRODUCT_TYPE[v] || '';
      return { reg: next }; });
    // the device ID is lowercase only (the central server tells cases apart): typed capitals become lowercase at once
    const field = k => { const show = sub && e[k]; return { value: r[k] || '', set: ev => setR(k, k === 'deviceId' ? ev.target.value.toLowerCase() : ev.target.value), err: e[k] || '', errDisplay: show ? 'flex' : 'none', invalid: show ? 'true' : 'false', border: show ? '#DC2626' : '#D5DBE4' }; };
    const tileOpt = (checked, pick, label, sub2, icon) => ({ label, sub: sub2, icon, checked, pick, border: checked ? '#0070E0' : '#D5DBE4', bg: checked ? '#F6F8FB' : '#FFFFFF', shadow: checked ? '0 0 0 3px rgba(0,112,224,.12)' : 'none', tileBg: checked ? '#0070E0' : '#EEF2F7', tileFg: checked ? '#FFFFFF' : '#0070E0' });
    // both MACs are required, so they count as two of the required details
    const REQ = ['product', 'customer', 'date', 'deviceId', 'lanMac', 'wifiMac', 'contact', 'email'];
    const done = REQ.filter(k => !e[k]).length;
    const stepDone = ks => ks.every(k => !e[k]);
    const stepErr = ks => sub && ks.some(k => e[k]);
    const stepV = (n, ks) => { const ok = stepDone(ks), bad = stepErr(ks); return { mark: ok ? '✓' : String(n), bg: ok ? '#16A34A' : bad ? '#FEECEC' : '#FFFFFF', fg: ok ? '#FFFFFF' : bad ? '#B21E1E' : '#005BB8', border: ok ? '#16A34A' : bad ? '#DC2626' : '#0070E0' }; };
    const code = pictureCode((TYPES.find(t => t[0] === (r.type || 'DGX Spark')) || TYPES[0])[1]);
    const schoolBox = !r.product || r.product === 'SchoolAI in a Box';
    const fmtD = v => { if (!v) return '—'; const d = new Date(v + 'T00:00:00'); return isNaN(d) ? '—' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); };
    const mon = s.monitoring || DEFAULT_MON;
    const t = s.toast;
    return {
      regDisplay: s.regOpen ? 'block' : 'none', regCloseRef: this.regCloseRef || (this.regCloseRef = React.createRef()),
      openRegister: this.openRegister, closeRegister: this.closeRegister, submitRegister: this.submitRegister,
      resetRegister: () => this.setState({ reg: this.regInit(s.catType), regSubmit: false, regServerErr: null }),
      regBannerDisplay: s.regServerErr || (sub && Object.keys(e).length) ? 'flex' : 'none',
      regBannerText: s.regServerErr ? 'The server did not register the device: ' + s.regServerErr : 'Please complete the fields highlighted below.',
      regBusy: !!s.regBusy, regSubmitLabel: s.regBusy ? 'Registering…' : 'Register device',
      rg: { deviceId: field('deviceId'), lanMac: field('lanMac'), wifiMac: field('wifiMac'), serial: field('serial'), name: field('name'), date: field('date'), contact: field('contact'), email: field('email'), phone: field('phone'),
        customer: field('customer'), site: field('site'), location: field('location'), type: field('type'), product: field('product') },
      rgPrevName: r.name.trim() || (r.deviceId || '').trim() || 'New device', rgPrevNameFg: r.name.trim() ? '#1A1E26' : '#8591A1',
      rgCustPh: schoolBox ? 'e.g. Greenfield Public School' : 'e.g. Metro Testing Centre', rgNamePh: 'e.g. Lab Pi 01',
      rgCustHint: schoolBox ? 'The school or institution this box is installed for.' : 'The customer or institution this box is installed for.',
      rgSiteHint: schoolBox ? 'Short code for the school; viewers are given access by it.' : 'Short code for the site; viewers are given access by it.',
      rgProducts: PRODUCTS.map(pn => tileOpt(r.product === pn, () => setR('product', pn), pn.replace(' in a Box', ''), { 'Assessment in a Box': 'Exam delivery · Raspberry Pi 5', 'Proctor in a Box': 'Proctoring · Jetson Orin Nano', 'SchoolAI in a Box': 'On-prem LLM · DGX Spark' }[pn], PRODUCT_META[pn].icon)),
      rgMonitorNotes: [
        'The box agent takes a reading every minute: hardware, storage, services, sync and AI use.',
        'A box that misses one reading shows No contact (it may be running without internet, or be off): after about 2 minutes when it reads every minute, never later than ' + mon.offlineAfterMinutes + ' minutes. A box that is shut down normally says so first and shows Switched off at once. The "No contact" alert follows after ' + Math.round(mon.offlineAlertWorkingMinutes / 60) + ' h of school hours or ' + Math.round(mon.offlineAlertAnyTimeMinutes / 60) + ' h in all.',
        'Without internet the box keeps its readings (up to 15 days or 200 MB) and uploads them when the internet returns, so the history shows it was running.',
        'Alert thresholds, e-mail alerts and who sees the box are set by portal admins on the Settings page, for every box, a device type or this box.'
      ],
      rgStep2: stepV(1, ['product', 'customer', 'date', 'site', 'location']), rgStep1: stepV(2, ['deviceId', 'lanMac', 'wifiMac', 'serial', 'name']), rgStep3: stepV(3, ['contact', 'email', 'phone']), rgStep4: { mark: '4', bg: '#FFFFFF', fg: '#005BB8', border: '#0070E0' },
      rgTypeText: r.type || 'Choose the product first',
      rgCols: s.w >= 1100 ? 'minmax(0,1fr) 300px' : 'minmax(0,1fr)',
      // the Device step in pairs: LAN MAC | Wi-Fi MAC, then serial | display name (one column on a narrow screen)
      rgPairCols: s.w >= 720 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      rgPrevJON: code === 'JON' ? 'block' : 'none', rgPrevTHR: code === 'THR' ? 'block' : 'none', rgPrevDGX: code === 'DGX' ? 'block' : 'none', rgPrevRPI: code === 'RPI' ? 'block' : 'none', rgPrevBrand: code === 'RPI' ? '' : 'NVIDIA ', rgPrevAlt: (code === 'RPI' ? 'Raspberry Pi 5' : 'NVIDIA ' + r.type) + ' illustration', rgPrevType: r.type,
      // the MACs as the portal will keep them (as typed while they are not valid yet)
      rgPrevLan: normMac(r.lanMac) || (r.lanMac || '').trim() || 'Not entered', rgPrevLanFg: (r.lanMac || '').trim() ? '#1A1E26' : '#5A6675',
      rgPrevWifi: normMac(r.wifiMac) || (r.wifiMac || '').trim() || 'Not entered', rgPrevWifiFg: (r.wifiMac || '').trim() ? '#1A1E26' : '#5A6675',
      rgPrevSerial: (r.serial || '').trim() || 'Not entered', rgPrevSerialFg: (r.serial || '').trim() ? '#1A1E26' : '#5A6675',
      rgPrevProduct: r.product || 'Not selected', rgPrevProductFg: r.product ? '#1A1E26' : '#5A6675',
      rgPrevCustomer: r.customer.trim() || 'Not entered', rgPrevCustomerFg: r.customer.trim() ? '#1A1E26' : '#5A6675',
      rgPrevDate: fmtD(r.date), rgPrevBeat: '1 min',
      rgProgText: done + ' of ' + REQ.length, rgProgW: Math.round(done / REQ.length * 100) + '%', rgProgBar: done === REQ.length ? '#16A34A' : '#0070E0', rgProgFg: done === REQ.length ? '#0E7A36' : '#005BB8',
      toastDisplay: t ? 'flex' : 'none', toastTitle: t ? t.title : '', toastBody: t ? t.body : '', closeToast: () => this.setState({ toast: null }),
      toastBar: t && t.tone === 'error' ? '#DC2626' : '#16A34A', toastIconBg: t && t.tone === 'error' ? '#FEECEC' : '#E7F6EC', toastIconFg: t && t.tone === 'error' ? '#B21E1E' : '#0E7A36',
      toastIcon: t && t.tone === 'error' ? 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01' : 'M20 6 9 17l-5-5', toastRole: t && t.tone === 'error' ? 'alert' : 'status'
    };
  }
  csvCell(v) { v = v == null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  xlsCell(v) { v = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(v) && !/^[-+]?\d+(\.\d+)?$/.test(v)) v = "'" + v; return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  downloadCSV(filename, headers, rows) {
    filename = filename.replace(/\.csv$/i, '.xls');
    const th = '<tr>' + headers.map(h => '<th style="background:#0070E0;color:#fff;font-weight:bold;text-align:left">' + this.xlsCell(h) + '</th>').join('') + '</tr>';
    const tr = rows.map(r => '<tr>' + r.map(c => '<td>' + this.xlsCell(c) + '</td>').join('') + '</tr>').join('');
    const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1" cellspacing="0">' + th + tr + '</table></body></html>';
    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  printReport() { if (typeof window !== 'undefined' && window.print) window.print(); }
  voiceToggle() {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    if (this.state.listening) { try { this._rec && this._rec.stop(); } catch { /* already stopped */ } this.setState({ listening: false }); return; }
    try {
      const rec = new SR(); this._rec = rec; rec.lang = 'en-IN'; rec.interimResults = true; rec.continuous = false;
      rec.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; this.setState({ gq: t, open: 'gsearch' }); };
      rec.onerror = () => this.setState({ listening: false });
      rec.onend = () => this.setState({ listening: false });
      rec.start(); this.setState({ listening: true, open: 'gsearch' });
    } catch { this.setState({ listening: false }); }
  }

  openDevice(id, tab) {
    this.settingsProps = null;
    this.setState({ detail: id, dTab: tab || 'overview', open: null, alertsOpen: false, detailErr: null, trendHover: null, settingsOpen: null });
    window.scrollTo({ top: 0 });
    setTimeout(() => { const h = document.getElementById('dt-title'); h && h.focus({ preventScroll: true }); }, 40);
    this.loadDevice(id);
  }
  closeDevice = () => { const id = this.state.detail; this.setState({ detail: null }); setTimeout(() => { const t = document.querySelector('[data-dev="' + id + '"]'); t && t.focus(); }, 40); };
  alertFilterEl(p) {
    const h = React.createElement;
    const seg = (label, opts, val, on) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, [
      h('span', { key: 'l', style: { fontSize: 11, fontWeight: 600, letterSpacing: '.02em', color: '#8591A1', textTransform: 'uppercase' } }, label),
      h('div', { key: 's', style: { display: 'inline-flex', padding: 4, borderRadius: 10, background: '#F5F7FA', boxShadow: 'inset 0 0 0 1px #E4E9F0', gap: 2 } }, opts.map(o => {
        const on_ = val === o.k;
        return h('button', { key: o.k, type: 'button', onClick: () => on(o.k), style: { display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: 0, borderRadius: 7, background: on_ ? '#FFFFFF' : 'transparent', color: on_ ? '#005BB8' : '#5A6675', fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: on_ ? 600 : 500, cursor: 'pointer', boxShadow: on_ ? '0 1px 3px rgba(16,42,84,.14)' : 'none' } }, [
          h('span', { key: 't' }, o.label),
          o.count != null ? h('span', { key: 'c', style: { minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: on_ ? '#E6F0FC' : '#E9EDF3', color: on_ ? '#005BB8' : '#8591A1', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontVariantNumeric: 'tabular-nums' } }, String(o.count)) : null
        ]);
      }))
    ]);
    return h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'flex-end', fontFamily: 'Poppins,sans-serif' } }, [
      h('div', { key: 'sev' }, seg('Severity', p.sevOpts, p.sev, p.onSev)),
      h('div', { key: 'st' }, seg('State', p.stateOpts, p.state, p.onState))
    ]);
  }
  empty(title, sub, size) {
    const h = React.createElement;
    const URL = '/assets/empty-state.lottie';
    const sz = size || 180;
    const Lottie = () => {
      const ref = React.useRef(null);
      React.useEffect(() => {
        const el = ref.current; if (!el) return;
        el.setAttribute('autoplay', ''); el.setAttribute('loop', 'true'); el.setAttribute('speed', '1'); el.setAttribute('src', URL);
      }, []);
      return h('dotlottie-player', { ref, 'aria-hidden': 'true', style: { width: sz, height: sz, marginBottom: 2 } });
    };
    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '26px 20px 36px', fontFamily: 'Poppins,sans-serif' } }, [
      h(Lottie, { key: 'l' }),
      h('div', { key: 't', style: { fontSize: 15, fontWeight: 500, color: '#1A1E26' } }, title || 'Nothing here yet'),
      sub ? h('div', { key: 's', style: { fontSize: 13, color: '#6A7280', marginTop: 4, maxWidth: 320 } }, sub) : null
    ]);
  }
  drp() {
    if (this._DRP) return this._DRP;
    const h = React.createElement;
    const RD = ReactDOM;
    const BLUE = '#0070E0', WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const parse = s => { if (!s) return null; const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
    const toISO = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
    const t0 = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const fmtDMY = dt => dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
    const fmtMDY = dt => String(dt.getMonth() + 1).padStart(2, '0') + '/' + String(dt.getDate()).padStart(2, '0') + '/' + dt.getFullYear();
    function CustomDateRange(props) {
      const { value, onChange, max } = props;
      const [open, setOpen] = React.useState(false);
      const [start, setStart] = React.useState(parse(value.from));
      const [end, setEnd] = React.useState(parse(value.to));
      const [hover, setHover] = React.useState(null);
      const [view, setView] = React.useState(parse(value.from) || new Date());
      const [pos, setPos] = React.useState(null);
      const [narrow, setNarrow] = React.useState(false);
      const trigRef = React.useRef(null), popRef = React.useRef(null);
      const maxT = max ? t0(parse(max)) : null;
      const openIt = () => {
        const s = parse(value.from), e = parse(value.to);
        setStart(s); setEnd(e); setHover(null);
        setView(new Date((s || new Date()).getFullYear(), (s || new Date()).getMonth(), 1));
        setPos(null); setOpen(true);
      };
      React.useLayoutEffect(() => {
        if (!open) return;
        const place = () => {
          const t = trigRef.current, p = popRef.current; if (!t || !p) return;
          const r = t.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight, M = 12;
          setNarrow(window.innerWidth <= 720);
          let left = Math.max(M, Math.min(r.right - pw, window.innerWidth - pw - M));
          const below = window.innerHeight - r.bottom, above = r.top;
          let top = (below >= ph + 8 || below >= above) ? r.bottom + 8 : r.top - ph - 8;
          top = Math.max(M, Math.min(top, window.innerHeight - ph - M));
          setPos({ left, top });
        };
        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
      }, [open, view, narrow]);
      React.useEffect(() => {
        if (!open) return;
        const onDown = e => { if (popRef.current && !popRef.current.contains(e.target) && trigRef.current && !trigRef.current.contains(e.target)) setOpen(false); };
        const onKey = e => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
      }, [open]);
      const pickDay = dt => {
        if (!start || (start && end)) { setStart(dt); setEnd(null); setHover(null); }
        else if (t0(dt) < t0(start)) { setEnd(start); setStart(dt); }
        else setEnd(dt);
      };
      const apply = () => { if (start && !end) onChange(toISO(start), toISO(start)); else if (start && end) onChange(toISO(start), toISO(end)); setOpen(false); };
      const label = value.from ? fmtDMY(parse(value.from)) + ' - ' + fmtDMY(parse(value.to || value.from)) : 'Select date range';
      const sT = start ? t0(start) : null;
      const previewEnd = end || (start && hover ? hover : null);
      let loT = null, hiT = null;
      if (sT != null && previewEnd) { const eT = t0(previewEnd); loT = Math.min(sT, eT); hiT = Math.max(sT, eT); }
      const monthCal = (base, canPrev, canNext) => {
        const y = base.getFullYear(), m = base.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const gridStart = new Date(y, m, 1 - firstDay);
        const title = base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const cells = [];
        for (let i = 0; i < 42; i++) {
          const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
          const inMonth = d.getMonth() === m, dT = t0(d);
          const disabled = maxT != null && dT > maxT;
          const isLo = loT != null && dT === loT, isHi = hiT != null && dT === hiT;
          const isEnd = isLo || isHi, between = loT != null && dT > loT && dT < hiT;
          cells.push(h('button', { key: i, type: 'button', disabled,
            onClick: () => !disabled && pickDay(d),
            onMouseEnter: () => { if (start && !end) setHover(d); },
            style: { width: 34, height: 34, border: 0, padding: 0, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 13,
              fontWeight: isEnd ? 700 : 500, color: disabled ? '#C6CCD6' : isEnd ? '#FFFFFF' : inMonth ? '#1A1E26' : '#C6CCD6',
              background: isEnd ? BLUE : between ? '#EAF3FF' : 'transparent',
              borderRadius: isEnd ? 9 : between ? 0 : 9, opacity: disabled ? .55 : 1, transition: 'background .1s' } }, inMonth ? d.getDate() : d.getDate()));
        }
        return h('div', { style: { flex: '0 0 auto' } }, [
          h('div', { key: 'hd', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 30, marginBottom: 6 } }, [
            h('button', { key: 'p', type: 'button', onClick: () => canPrev && setView(new Date(view.getFullYear(), view.getMonth() - 1, 1)), style: { visibility: canPrev ? 'visible' : 'hidden', width: 28, height: 28, border: '1px solid #E4E7EC', borderRadius: 8, background: '#FFFFFF', color: '#5A6675', cursor: 'pointer', fontSize: 15, lineHeight: '1' } }, '‹'),
            h('span', { key: 't', style: { fontSize: 13.5, fontWeight: 600, color: '#1A1E26' } }, title),
            h('button', { key: 'n', type: 'button', onClick: () => canNext && setView(new Date(view.getFullYear(), view.getMonth() + 1, 1)), style: { visibility: canNext ? 'visible' : 'hidden', width: 28, height: 28, border: '1px solid #E4E7EC', borderRadius: 8, background: '#FFFFFF', color: '#5A6675', cursor: 'pointer', fontSize: 15, lineHeight: '1' } }, '›')
          ]),
          h('div', { key: 'wd', style: { display: 'grid', gridTemplateColumns: 'repeat(7,34px)' } }, WD.map((w, i) => h('span', { key: i, style: { width: 34, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#8591A1' } }, w))),
          h('div', { key: 'gr', style: { display: 'grid', gridTemplateColumns: 'repeat(7,34px)' } }, cells)
        ]);
      };
      const field = (lbl, dt) => h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 } }, [
        h('span', { key: 'l', style: { fontSize: 11, fontWeight: 600, color: '#8591A1' } }, lbl),
        h('div', { key: 'v', style: { height: 42, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 9, border: '1px solid #E4E7EC', background: '#F7F9FC', fontSize: 13.5, color: dt ? '#1A1E26' : '#B4BCC7', fontVariantNumeric: 'tabular-nums' } }, dt ? fmtMDY(dt) : 'MM/DD/YYYY')
      ]);
      const next = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      const popover = open ? RD.createPortal(h('div', { ref: popRef, style: {
        position: 'fixed', left: pos ? pos.left : -9999, top: pos ? pos.top : -9999, zIndex: 9000,
        background: '#FFFFFF', borderRadius: 16, border: '1px solid #E4E7EC', boxShadow: '0 24px 60px -16px rgba(16,40,90,.4)', padding: 16,
        fontFamily: 'Poppins,sans-serif', opacity: pos ? 1 : 0, pointerEvents: pos ? 'auto' : 'none' } }, [
        h('div', { key: 'f', style: { display: 'flex', gap: 10, marginBottom: 14 } }, [field('Start date', start), field('End date', end)]),
        h('div', { key: 'c', style: { display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: 20 } }, [
          monthCal(view, true, false), monthCal(next, false, true)
        ]),
        h('div', { key: 'a', style: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid #EEF1F4' } }, [
          h('button', { key: 'x', type: 'button', onClick: () => setOpen(false), style: { height: 38, padding: '0 16px', borderRadius: 9, border: '1px solid #D5DBE4', background: '#FFFFFF', color: '#5A6675', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' } }, 'Cancel'),
          h('button', { key: 'ok', type: 'button', disabled: !start, onClick: apply, style: { height: 38, padding: '0 18px', borderRadius: 9, border: 0, background: start ? BLUE : '#AFC9EA', color: '#FFFFFF', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: start ? 'pointer' : 'not-allowed' } }, 'Apply')
        ])
      ]), document.body) : null;
      return h('div', { style: { position: 'relative', width: '100%' } }, [
        h('button', { key: 'tr', ref: trigRef, type: 'button', onClick: () => open ? setOpen(false) : openIt(), style: {
          width: '100%', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 14px',
          borderRadius: 11, border: '1.5px solid ' + (open ? BLUE : '#D5DBE4'), background: '#FFFFFF', cursor: 'pointer',
          fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 500, color: value.from ? '#1A1E26' : '#8591A1',
          boxShadow: open ? '0 0 0 3px rgba(0,112,224,.14)' : 'none', transition: 'border-color .15s,box-shadow .15s' } }, [
          h('span', { key: 'l', style: { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, label),
          value.from ? h('span', { key: 'x', role: 'button', tabIndex: 0, 'aria-label': 'Clear date range', title: 'Clear date range',
            onClick: e => { e.stopPropagation(); setStart(null); setEnd(null); setHover(null); setOpen(false); onChange('', ''); },
            onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setStart(null); setEnd(null); setHover(null); setOpen(false); onChange('', ''); } },
            style: { flexShrink: 0, width: 22, height: 22, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6675', cursor: 'pointer' } },
            h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M18 6 6 18M6 6l12 12' })))
          : h('svg', { key: 'i', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: BLUE, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { flexShrink: 0 } }, [
            h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 17, rx: 2 }), h('path', { key: 'p', d: 'M3 9h18M8 2v4M16 2v4' })
          ])
        ]),
        popover
      ]);
    }
    this._DRP = CustomDateRange;
    return this._DRP;
  }
  tcb() {
    if (this._TCB) return this._TCB;
    const h = React.createElement;
    const SLOTS = [];
    for (let i = 0; i < 48; i++) { const hh = String(Math.floor(i / 2)).padStart(2, '0'), mm = i % 2 ? '30' : '00'; SLOTS.push(hh + ':' + mm); }
    const label12 = t => { if (!t) return ''; const [H, M] = t.split(':').map(Number); const ap = H < 12 ? 'AM' : 'PM'; const h12 = H % 12 || 12; return h12 + ':' + String(M).padStart(2, '0') + ' ' + ap; };
    const norm = raw => { let v = (raw || '').trim().toLowerCase(); if (!v) return ''; const ap = /p/.test(v) ? 'p' : /a/.test(v) ? 'a' : ''; v = v.replace(/[^0-9:]/g, ''); if (!v) return null; let H, M = 0; if (v.includes(':')) { const [a, b] = v.split(':'); H = parseInt(a, 10); M = parseInt(b || '0', 10); } else { if (v.length <= 2) { H = parseInt(v, 10); } else { H = parseInt(v.slice(0, v.length - 2), 10); M = parseInt(v.slice(-2), 10); } } if (isNaN(H)) return null; if (ap === 'p' && H < 12) H += 12; if (ap === 'a' && H === 12) H = 0; if (H > 23 || M > 59) return null; return String(H).padStart(2, '0') + ':' + String(M).padStart(2, '0'); };
    function TimeCombo(props) {
      const [open, setOpen] = React.useState(false);
      const [text, setText] = React.useState('');
      const [focused, setFocused] = React.useState(false);
      const wrap = React.useRef(null), listRef = React.useRef(null);
      React.useEffect(() => { if (!focused) setText(props.value ? label12(props.value) : ''); }, [props.value, focused]);
      React.useEffect(() => {
        if (!open) return;
        const away = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', away); return () => document.removeEventListener('mousedown', away);
      }, [open]);
      React.useEffect(() => { if (open && listRef.current) { const sel = listRef.current.querySelector('[data-sel="1"]'); if (sel) sel.scrollIntoView({ block: 'center' }); } }, [open]);
      const commit = raw => { const n = norm(raw); if (n === null) return; props.onChange(n); };
      const base = { height: 44, width: '100%', boxSizing: 'border-box', padding: '0 38px 0 38px', borderRadius: 11, border: '1.5px solid ' + (open || focused ? '#0070E0' : '#D5DBE4'), background: '#FFFFFF', fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#1A1E26', outline: 'none', boxShadow: open || focused ? '0 0 0 3px rgba(0,112,224,.14)' : 'none', transition: 'border-color .15s,box-shadow .15s' };
      return h('div', { ref: wrap, style: { position: 'relative', width: '100%' } }, [
        h('svg', { key: 'i', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#5A6675', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { position: 'absolute', left: 13, top: 14, pointerEvents: 'none' } }, [h('circle', { key: 'c', cx: 12, cy: 12, r: 9 }), h('path', { key: 'p', d: 'M12 7v5l3 2' })]),
        h('input', { key: 'in', type: 'text', inputMode: 'numeric', placeholder: 'e.g. 2:30 PM', 'aria-label': 'Time, type or pick', value: focused ? text : (props.value ? label12(props.value) : ''),
          onFocus: () => { setFocused(true); setText(props.value ? label12(props.value) : ''); setOpen(true); },
          onChange: e => { setText(e.target.value); if (!open) setOpen(true); },
          onBlur: () => { setFocused(false); commit(text); },
          onKeyDown: e => { if (e.key === 'Enter') { commit(text); setOpen(false); e.currentTarget.blur(); } else if (e.key === 'Escape') { setOpen(false); e.currentTarget.blur(); } },
          style: base }),
        props.value ? h('button', { key: 'x', type: 'button', 'aria-label': 'Clear time', onMouseDown: e => { e.preventDefault(); props.onChange(''); setText(''); }, style: { position: 'absolute', right: 8, top: 10, width: 24, height: 24, border: 0, borderRadius: 999, background: 'transparent', color: '#8591A1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M18 6 6 18M6 6l12 12' })))
          : h('svg', { key: 'chev', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#8591A1', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { position: 'absolute', right: 12, top: 14, pointerEvents: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' } }, h('path', { d: 'm6 9 6 6 6-6' })),
        open ? h('div', { key: 'pop', ref: listRef, role: 'listbox', style: { position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 400, maxHeight: 220, overflowY: 'auto', background: '#FFFFFF', border: '1px solid #E1E6EF', borderRadius: 12, boxShadow: '0 12px 32px -12px rgba(16,42,84,.3)', padding: 6 } },
          SLOTS.map(t => { const sel = props.value === t; return h('button', { key: t, type: 'button', role: 'option', 'aria-selected': sel, 'data-sel': sel ? '1' : '0',
            onMouseDown: e => { e.preventDefault(); props.onChange(t); setOpen(false); },
            style: { display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', border: 0, borderRadius: 8, background: sel ? '#EAF3FF' : 'transparent', color: sel ? '#005BB8' : '#1A1E26', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: sel ? 600 : 400, cursor: 'pointer' },
            onMouseEnter: e => { if (!sel) e.currentTarget.style.background = '#F6F8FB'; }, onMouseLeave: e => { if (!sel) e.currentTarget.style.background = 'transparent'; } }, label12(t)); })) : null
      ]);
    }
    this._TCB = TimeCombo;
    return this._TCB;
  }
  detailVals(s, mkRow, list) {
    const d = s.detail && DEVICES.find(x => x.id === s.detail);
    if (!d) return { isDetail: false, dashDisplay: 'flex', dtBack: this.closeDevice, dt: {} };
    const dd = (s.detailData || {})[d.id], dv = dd ? dd.view : null;
    const r = mkRow(d), off = d.status === 'Offline', never = d.status === 'Never seen', NA = '—';
    const TH = s.thresholds || DEFAULT_TH, MON = s.monitoring || DEFAULT_MON, can = (s.me && s.me.can) || {};
    const nowMs = Date.now();
    const TONE = { ok: ['#0E7A36', '#E7F6EC', '#16A34A'], warn: ['#8A5200', '#FEF3E2', '#F59E0B'], crit: ['#B21E1E', '#FEECEC', '#DC2626'], muted: ['#5A6675', '#EEF1F4', '#C4CCD6'], info: ['#005BB8', '#EEF2F7', '#0070E0'], none: ['#1A1E26', '#F6F8FB', '#0070E0'] };
    // colour a value with the configured alert thresholds
    const tone = (x, band) => x == null ? 'muted' : band && band.crit != null && x >= band.crit ? 'crit' : band && band.warn != null && x >= band.warn ? 'warn' : 'none';
    const bandTxt = (b, u) => [b && b.warn != null ? 'Warning ' + b.warn + u : null, b && b.crit != null ? 'Critical ' + b.crit + u : null].filter(Boolean).join(' · ') || 'Not set';
    const fmtD = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ });
    const fmtDay = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
    const fmtWdU = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    const n0 = x => x == null ? null : Math.round(x);
    const n1 = x => x == null ? null : Math.round(x * 10) / 10;
    const pc = x => x == null ? null : (Math.abs(x) < 10 ? n1(x) : n0(x)) + '%';
    const times = (n, one, many) => n + ' ' + (n === 1 ? one : many);
    // a day's restarts: the box itself and its services are told apart (older days only have the total)
    const restartText = t => t.service_restarts == null ? times(t.restarts || 0, 'restart', 'restarts')
      : [times(t.service_restarts, 'service restart', 'service restarts')].concat(t.box_restarts ? ['box restarted ' + (t.box_restarts === 1 ? 'once' : t.box_restarts + ' times')] : []).join(' · ');
    const gbT = x => x == null ? null : x >= 1000 ? (x / 1000).toFixed(2) + ' TB' : (x >= 100 ? n0(x) : n1(x)) + ' GB';
    const mbT = x => x == null ? null : x >= 1024 ? gbT(x / 1024) : x >= 1 ? n0(x) + ' MB' : Math.max(1, Math.round(x * 1024)) + ' KB';
    const at = iso => iso ? fmtFull.format(new Date(iso)) : null;
    const atS = iso => iso ? fmtD.format(new Date(iso)) : null;
    const ago = iso => iso ? rel(nowMs - Date.parse(iso)) : null;
    const durS = sec => { if (sec == null) return null; const m = Math.floor(sec / 60), h = Math.floor(m / 60), dy = Math.floor(h / 24); return dy ? dy + ' d' + (h % 24 ? ' ' + (h % 24) + ' h' : '') : h ? h + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min'; };
    const mins = m => m == null ? null : durS(Math.round(m) * 60);
    const yes = b => b == null ? null : b ? 'Yes' : 'No';
    // the box's own reading interval (interval_s of its newest reading, 60 s by default in the agent); unknown until the
    // first reading, so not guessed (25 Nov 2026: a new box showed "Every 10 min" while its agent sends every minute)
    const ivKnown = dv && dv.intervalS > 0 ? dv.intervalS : null;
    const everyText = ivKnown == null ? '— (from the first reading)' : ivKnown < 60 ? 'Every ' + Math.round(ivKnown) + ' s'
      : 'Every ' + (Math.round(ivKnown / 6) / 10).toString().replace(/\.0$/, '') + ' min';
    // the short form for "one every …" (a box with readings always has its interval)
    const every = ivKnown == null ? '10 min' : ivKnown < 60 ? Math.round(ivKnown) + ' s' : (Math.round(ivKnown / 6) / 10).toString().replace(/\.0$/, '') + ' min';
    // Offline after one missed reading at this box's own pace (its interval plus half, at least a minute), never later
    // than the portal setting: the same rule as the server (DeviceStatus.OfflineAfter)
    const ivS = (dv && dv.intervalS) || 600, offMin = Math.round(Math.min(MON.offlineAfterMinutes, (ivS + Math.max(60, ivS / 2)) / 60));
    const I = {
      info: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01', pulse: 'M22 12h-4l-3 9L9 3l-3 9H2', cpu: 'M9 9h6v6H9zM4 4h16v16H4zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3',
      gpu: 'M2 7h20v10H2zM6 17v3M10 17v3M14 17v3M18 17v3M7 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM15 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4z', mem: 'M3 7h18v10H3zM7 7v10M11 7v10M15 7v10M3 20h18',
      power: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z', disk: 'M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0', trend: 'M3 3v18h18M7 15l4-4 3 3 5-6',
      svc: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01', sw: 'M16 18l6-6-6-6M8 6l-6 6 6 6', ota: 'M12 3v12M7 10l5 5 5-5M5 21h14', sync: 'M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 3 0 0 1 0 0M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5',
      ai: 'M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4zM19 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1z', cam: 'M15 10l5-3v10l-5-3M3 7h12v10H3z', alert: 'M12 3 2 20h20L12 3zM12 10v4M12 17h.01',
      tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z', net: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 20h.01',
      clock: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 6v6l4 2', lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', user: 'M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21a8 8 0 0 1 16 0', log: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',
      thermo: 'M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z', check: 'M20 6 9 17l-5-5', restart: 'M3 12a9 9 0 1 0 2.64-6.36M3 3v6h6', dl: 'M12 3v12M7 10l5 5 5-5M5 21h14', bug: 'M8 6a4 4 0 0 1 8 0v2H8zM6 10h12v4a6 6 0 0 1-12 0zM2 13h4M18 13h4M4 7l3 2M20 7l-3 2M4 20l3-3M20 20l-3-3',
      gear: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
      filter: 'M3 4h18l-7 8v7l-4 2v-9z', cal: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', up: 'M12 21V7M5 12l7-7 7 7M5 3h14'
    };
    let gid = 0;
    const G = (kind, title, icon, extra) => ({ kind, title, icon, order: (extra && extra.order) || 0, hid: 'dg-' + (gid++), col: 'auto', isStats: kind === 'stats', isKv: kind === 'kv', isMeters: kind === 'meters', isStack: kind === 'stack', isTrend: kind === 'trend', isTable: kind === 'table', isActions: kind === 'actions', isLogs: kind === 'logs', isCustom: kind === 'custom', asideDisplay: 'none', aside: '', asideFg: '#005BB8', asideBg: '#EEF2F7', linkDisplay: 'none', linkLabel: '', link: () => {}, coresDisplay: 'none', cores: [], emptyDisplay: 'none', empty: '', emptyEl: null, minW: '560px', secOverflow: kind === 'stats' || kind === 'stack' ? 'visible' : 'hidden', csvDisplay: 'none', csvFn: () => {}, rowCountDisplay: 'none', rowCountText: '', ...extra });
    const wide = { col: '1 / -1' };
    const aside = (t, tn) => ({ asideDisplay: 'inline-block', aside: t, asideFg: TONE[tn || 'info'][0], asideBg: TONE[tn || 'info'][1] });
    const kvI = (k, v, tn) => ({ k, v: v == null || v === '' ? NA : String(v), fg: tn ? TONE[tn][0] : '#1A1E26' });
    const st = (label, value, sub, icon, tn, tip, beat) => ({ label, value: value == null ? NA : String(value), sub: sub || '', icon, fg: TONE[tn || 'none'][0], iconFg: tn && tn !== 'none' ? TONE[tn][2] : '#0070E0', tip: tip || '', tipDisp: tip ? 'block' : 'none', subDisp: sub ? 'block' : 'none', tipValFg: tn && tn !== 'none' ? TONE[tn][2] : '#FFFFFF', beatAnim: beat ? 'heartbeat 1.6s ease-in-out infinite' : 'none', beatDisp: beat ? 'block' : 'none' });
    const mt = (label, value, pct, tn, title) => ({ label, value: value == null ? NA : String(value), pct: pct == null || pct === false ? '0%' : Math.max(0, Math.min(100, pct)) + '%', barDisplay: pct === false ? 'none' : 'block', barC: TONE[tn || 'none'][2], fg: TONE[tn || 'none'][0], title: title || '' });
    const cellT = (t, o) => ({ t: t == null ? NA : String(t), sub: (o && o.sub) || '', subDisplay: o && o.sub ? 'block' : 'none', fg: o && o.tn ? TONE[o.tn][0] : '#1A1E26', weight: (o && o.w) || 400, align: (o && o.align) || 'left', textDisplay: 'flex', pillDisplay: 'none', pillBg: '', actDisplay: 'none', discDisplay: 'none' });
    const cellDisc = (t, tn, open, hint, fn) => ({ t, sub: '', subDisplay: 'none', fg: TONE[tn][0], weight: 600, align: 'left', textDisplay: 'none', pillDisplay: 'none', pillBg: '', actDisplay: 'none',
      discDisplay: 'inline-flex', discFn: fn, discOpen: open ? 'true' : 'false', discAria: (open ? 'Hide' : 'Show') + ' details for ' + t, discHint: hint, discRot: open ? 'rotate(180deg)' : 'none',
      triBg: TONE[tn][1], triFg: TONE[tn][0], triAnim: tn === 'crit' && !open ? 'triPulse 1.6s ease-out infinite' : 'none' });
    const cellP = (t, tn) => ({ t, sub: '', subDisplay: 'none', fg: TONE[tn][0], weight: 600, align: 'left', textDisplay: 'none', pillDisplay: 'inline-flex', pillBg: TONE[tn][1], actDisplay: 'none', discDisplay: 'none' });
    const acked = s.acked || {};
    const isAcked = a => a.acked || !!acked[a.id];
    const cellAck = a => { const isAck = isAcked(a), closed = !isAck && a.state === 'Resolved', locked = !isAck && !closed && !can.ack, dis = isAck || closed || locked;
      return { t: '', sub: '', subDisplay: 'none', fg: '#1A1E26', weight: 600, align: 'right', textDisplay: 'none', pillDisplay: 'none', pillBg: '', discDisplay: 'none',
        actDisplay: 'inline-flex', actLabel: isAck ? 'Acknowledged' : closed ? (a.oneShot ? 'Event' : 'Resolved') : 'Acknowledge',
        actIconDisplay: isAck || closed ? 'inline-flex' : 'none', actDisabled: dis,
        actAria: isAck ? 'Acknowledged: ' + a.title : closed ? 'Resolved: ' + a.title : locked ? 'Your role cannot acknowledge alerts' : 'Acknowledge alert: ' + a.title, actCursor: dis ? 'default' : 'pointer',
        actBg: isAck ? '#E7F6EC' : closed || locked ? '#EEF2F7' : '#FFFFFF', actFg: isAck ? '#0E7A36' : closed || locked ? '#5A6675' : '#005BB8', actBorder: isAck ? '#BFE6CC' : closed || locked ? '#E1E6EF' : '#B9D3F0',
        actFn: dis ? () => {} : () => this.ackAlert(a) }; };
    const tbl = (title, icon, cols, rows, extra) => {
      const ncols = cols.map(c => typeof c === 'string' ? { t: c, align: 'left' } : { ...c });
      const sortable = !(extra && extra.sortable === false);
      const cur = (s.tsort || {})[title];
      let srows = rows.slice();
      if (sortable && cur && rows.length) {
        const sv = cell => { const t = cell && cell.t != null ? String(cell.t) : ''; const num = parseFloat(t.replace(/[^0-9.-]/g, '')); return { num: /\d/.test(t) && !isNaN(num) ? num : null, str: t.toLowerCase() }; };
        srows.sort((a, b) => { const A = sv(a[cur.col]), B = sv(b[cur.col]); let r2; if (A.num != null && B.num != null) r2 = A.num - B.num; else r2 = A.str < B.str ? -1 : A.str > B.str ? 1 : 0; return cur.dir === 'desc' ? -r2 : r2; });
      }
      ncols.forEach((c, i) => {
        c.sortable = sortable; c.minW = c.w || '0';
        c.thJustify = c.align === 'right' ? 'flex-end' : c.align === 'center' ? 'center' : 'flex-start';
        const active = !!(cur && cur.col === i);
        c.ariaSort = active ? (cur.dir === 'asc' ? 'ascending' : 'descending') : 'none';
        c.caretDisplay = active ? 'inline-flex' : 'none';
        c.caret = active && cur.dir === 'desc' ? 'm6 9 6 6 6-6' : 'm18 15-6-6-6 6';
        c.thCursor = sortable ? 'pointer' : 'default';
        c.sortFn = sortable ? () => { const dir = active && cur.dir === 'asc' ? 'desc' : 'asc'; this.setState(st2 => ({ tsort: { ...(st2.tsort || {}), [title]: { col: i, dir } } })); } : () => {};
      });
      const csvHeaders = ncols.map(c => c.t);
      const csvRows = srows.map(cells => cells.map(c => c && c.sub ? (c.t + ' (' + c.sub + ')') : (c && c.t != null ? c.t : '')));
      const span = ncols.length;
      return G('table', title, icon, { cols: ncols, rows: srows.map(cells => { const x = cells._x; return { cells, span, rowBg: x ? (x.open ? x.bg : 'transparent') : 'transparent', rowHoverBg: x && x.open ? x.bg : '#F6F8FB', railBg: x ? x.rail : 'transparent', xDisplay: x && x.open ? 'table-row' : 'none', xBg: x ? x.bg : '', xBorder: x ? x.border : '', xFg: x ? x.fg : '', xTitle: x ? x.title : '', xSub: x ? x.sub : '', xLines: x ? x.lines : [], xRestart: x ? x.restart : () => {}, xRestartLabel: x ? x.restartLabel : '', xRestartDisabled: !!(x && x.restartDisabled), xOpen: x ? x.openLogs : () => {}, xOpenLabel: x ? x.openLabel || 'Open full logs' : '' }; }), emptyDisplay: rows.length ? 'none' : 'block',
        emptyEl: rows.length ? null : this.empty((extra && extra.empty) || 'No records', (extra && extra.emptyText) || 'There is nothing to show here yet.'),
        rowCount: rows.length, rowCountText: rows.length + (rows.length === 1 ? ' row' : ' rows'), rowCountDisplay: rows.length ? 'inline-flex' : 'none',
        csvDisplay: rows.length ? 'inline-flex' : 'none', csvFn: () => this.downloadCSV(d.id + '-' + title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.xls', csvHeaders, csvRows),
        ...extra });
    };

    // ---------- from the device view (GET /devices/{key}) ----------
    const g = (dv && dv.glance) || {}, reg = (dv && dv.registry) || {}, clk = (dv && dv.clock) || {}, netw = (dv && dv.network) || {};
    const hwTone = [tone(g.cpuPct, TH.cpu), tone(g.gpuTempC, TH.gpuTemp), tone(g.diskPct, TH.disk), tone(g.ramPct, TH.ram)];
    const live = t => off ? 'muted' : t;                         // offline: last known values in grey
    const lk = x => off ? (x ? 'Last known · ' + x : 'Last known') : x;
    const netTone = g.lossPct == null && g.rttMs == null ? 'none' : g.lossPct >= 5 || g.rttMs >= 300 ? 'crit' : g.lossPct >= 1 || g.rttMs >= 100 ? 'warn' : 'none';
    const seenMs = d.seenAgo == null ? null : d.seenAgo + Math.max(0, nowMs - (s.lastFetch || nowMs));
    const devAlerts = dv ? dv.alerts : ALERTS.filter(a => a.device === d.id);
    const openAlerts = devAlerts.filter(a => a.state === 'Active' && !isAcked(a) && a.sev !== 'Info');
    const sevT = sv => sv === 'Critical' ? 'crit' : sv === 'Warning' ? 'warn' : 'info';
    const stateOf = a => isAcked(a) ? ['Acknowledged', 'info'] : a.state === 'Resolved' ? (a.oneShot ? ['Event', 'info'] : ['Resolved', 'ok']) : ['Active', sevT(a.sev)];
    const alertCells = a => { const stt = stateOf(a); return [cellP(a.sev, sevT(a.sev)), cellT(a.title, { w: 600, sub: a.detail }), cellT(rel(nowMs - Date.parse(a.startedAt)), { sub: fmtD.format(new Date(a.startedAt)) + (a.reportedLate ? ' · reported late' : '') }), cellP(stt[0], stt[1])]; };

    // ---------- groups per tab ----------
    const tabKey = s.dTab || 'overview';
    const go = k => () => { this.setState({ dTab: k, diagFrom: null }); const el = document.getElementById('dt-panel'); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 130; if (window.scrollY > y) window.scrollTo({ top: y }); } };
    // what the installer types at the box: the enrolment code for a box registered by MAC, else the box key
    const secret = dv && dv.identity && dv.identity.enrolment === 'mac' ? 'enrolment code' : 'box key';
    const glance = G('stats', 'At a glance', I.pulse, { ...wide, items: never ? [
      st('Status', 'Waiting for first reading', reg.createdAt ? 'Registered ' + atS(reg.createdAt) : '', I.clock, 'muted', 'The box is registered but no reading has arrived yet. Install the agent with the command and ' + secret + ' shown at registration; the first reading arrives a minute or two after the setup on the box finishes.'),
      st('Open alerts', d.openAlerts || 0, '', I.alert, 'none', 'Active Warning and Critical alerts for this box.')
    ] : [
      st('Uptime', off ? stText(d) : durS(g.uptimeS), off ? (d.switchedOff ? 'Since ' + atS(d.switchedOff.at) : 'No contact for ' + (durS(Math.round((seenMs || 0) / 1000)) || NA)) : g.bootedAt ? 'Since ' + atS(g.bootedAt) : '', I.clock, off ? 'muted' : 'none', 'Time since the box last started, from its newest reading.'),
      st('Last reading', rel(seenMs), 'One every ' + every + '', I.pulse, off ? 'crit' : 'none', 'When the central server last received a reading from this box. After ' + offMin + ' minutes without one (one missed reading) the box shows No contact; a box shut down normally shows Switched off at once. Readings taken without internet stay on the box and are uploaded when it reconnects.', !off),
      st('Network', g.rttMs == null ? null : n0(g.rttMs) + ' ms', lk([g.lossPct != null ? n1(g.lossPct) + '% loss' : null, g.wifiDbm != null ? 'Wi-Fi ' + g.wifiDbm + ' dBm' : null, (g.interruptions24h || 0) + ((g.interruptions24h || 0) === 1 ? ' gap' : ' gaps') + ' (24 h)'].filter(Boolean).join(' · ')), I.net, live(netTone), 'Round-trip time and packet loss from the box to its gateway, the Wi-Fi signal if it uses Wi-Fi, and how many gaps or late uploads there were in the last 24 hours.'),
      st('CPU', pc(g.cpuPct), lk(g.cpuTempC == null ? '' : n0(g.cpuTempC) + ' °C'), I.cpu, live(hwTone[0]), 'CPU use across all cores, with the CPU temperature. ' + bandTxt(TH.cpu, '%') + '.'),
      st('GPU temperature', g.gpuTempC == null ? null : n0(g.gpuTempC) + ' °C', lk(g.gpuUtilPct == null ? 'No GPU data' : n0(g.gpuUtilPct) + '% utilization'), I.thermo, live(hwTone[1]), 'GPU temperature with GPU use. ' + bandTxt(TH.gpuTemp, ' °C') + '.'),
      st('Storage used', pc(g.diskPct), lk(g.diskFreeGb == null ? '' : gbT(g.diskFreeGb) + ' free'), I.disk, live(hwTone[2]), 'Share of the system disk in use and the free space left. ' + bandTxt(TH.disk, '%') + '.'),
      st('Open alerts', g.openAlerts == null ? d.openAlerts : g.openAlerts, (g.openCritical || 0) + ' critical', I.alert, g.openCritical ? 'crit' : (g.openAlerts || d.openAlerts) ? 'warn' : 'none', 'Active Warning and Critical alerts for this box that nobody has acknowledged yet.')
    ] });

    const build = {};
    build.overview = () => {
      const regSerial = dv && dv.expected && dv.expected.serial;
      const norm = x => String(x || '').toLowerCase().replace(/[^0-9a-z]/g, '');
      const seen = [dv && dv.serial, ...((netw.ports || []).map(p => p.mac))].filter(Boolean).map(norm);
      const idCheck = !regSerial ? null : !dv || !dv.hasReading ? [regSerial + ' · checked at the first reading', null]
        : seen.includes(norm(regSerial)) ? [regSerial + ' · matches the box', 'ok']
        : seen.length ? [regSerial + ' · the box reports a different serial or MAC', 'warn'] : [regSerial, null];
      // the LAN and Wi-Fi MAC typed at registration, each checked against the ports the box reports (an older API sends
      // no identity: then only the serial check above is shown)
      const idn = dv && dv.identity, det = (idn && idn.detected) || {}, cv = idn && idn.connectedVia;
      const MAC_STATE = { verified: [' · verified', 'ok'], not_seen: [' · not seen on the box', 'none'], different: [' · the box reports a different MAC', 'warn'], unknown: [' · checked at the first reading', 'none'] };
      const macRow = (label, x, seenMac) => {
        if (!x || !x.registered || x.state === 'not_registered') return kvI(label, 'Not registered' + (seenMac ? ' · box reports ' + seenMac : ''), 'muted');
        const m = MAC_STATE[x.state];
        return kvI(label, x.registered + (m ? m[0] : ''), m ? m[1] : null);
      };
      const idRows = !idn ? (idCheck ? [kvI('Registered serial / MAC', idCheck[0], idCheck[1])] : []) : [
        macRow('LAN MAC', idn.lanMac, det.lan), macRow('Wi-Fi MAC', idn.wifiMac, det.wifi),
        kvI('Connected via', cv ? (cv.kind === 'wifi' ? 'Wi-Fi' : 'LAN') + (cv.port ? ' (' + cv.port + ')' : '') : null),
        kvI('Enrolled', idn.enrolledAt ? fmtDay.format(new Date(idn.enrolledAt)) : 'Waiting for the box' + (idn.enrolCodeExpiresAt ? ' · code valid until ' + atS(idn.enrolCodeExpiresAt) : ''), idn.enrolledAt ? null : 'muted')
      ];
      // admins: a new enrolment code for a box registered by MAC that has not enrolled, and the box's own MACs for one
      // registered without any
      const noMacs = idn && !(idn.lanMac && idn.lanMac.registered) && !(idn.wifiMac && idn.wifiMac.registered);
      const codeAria = 'New enrolment code for ' + d.id, macsAria = 'Use the MACs ' + d.id + ' reports';
      const act = (label, sub, icon, cta, busy, aria, run) => ({ label, sub, icon: busy ? I.restart : icon, cta, aria, run: busy ? () => {} : run, disabled: !!s.idBusy,
        border: '#E1E6EF', bg: '#FFFFFF', hoverBorder: '#0070E0', hoverBg: '#F6F9FE', shadow: 'none', cursor: s.idBusy ? 'wait' : 'pointer', tileBg: '#EEF2F7', tileFg: '#0070E0',
        anim: busy ? 'spin 1s linear infinite' : 'none', fg: '#1A1E26', subFg: '#5A6675', ctaDisplay: 'inline-flex', ctaBg: '#EEF2F7', ctaFg: '#005BB8' });
      const agentAria = 'Install or update the agent on ' + d.id;
      const idActs = !idn || !can.admin ? [] : [
        act('Install / update agent', s.idBusy === 'agent' ? 'Getting the agent…' : 'The latest uploaded agent, with the commands for the box.', I.dl, 'Open', s.idBusy === 'agent', agentAria,
          () => this.agentFor(d, '[aria-label="' + agentAria + '"]')),
        ...(idn.enrolment === 'mac' && !idn.enrolledAt ? [act('New enrolment code', s.idBusy === 'code' ? 'Creating…' : 'For a lost or expired code. The old code stops working.', I.lock, 'Create', s.idBusy === 'code', codeAria,
          () => this.newEnrolCode(d, '[aria-label="' + codeAria + '"]'))] : []),
        // both MACs are required, so only offered when the box reports both
        ...(noMacs && det.lan && det.wifi ? [act('Use the box\'s MACs', s.idBusy === 'macs' ? 'Saving…' : 'LAN ' + det.lan + ' · Wi-Fi ' + det.wifi, I.net, 'Use', s.idBusy === 'macs', macsAria,
          () => this.useBoxMacs(d, det))] : [])
      ];
      const td = dv && dv.today, tm = (td && td.metrics) || {};
      // offline periods: reloaded whenever the box sends something new
      const mark = d.lastSeenAt || 'never', offHist = (s.offline || {})[d.id];
      if (!offHist || offHist.mark !== mark) this.once('off:' + d.id + '@' + mark, () => this.loadOffline(d.id, mark));
      const ps = (offHist && offHist.periods) || [], nowOff = ps.find(p => p.ongoing);
      const recorded = ps.reduce((n, p) => n + (p.recordedOffline || 0), 0), offTime = ps.reduce((n, p) => n + (p.durationS || 0), 0);
      const tm2 = (offHist && offHist.time) || {};
      // what happened in one period: running without internet (router reachable or not), switched off / power cut, agent not running
      const why = p => {
        if (p.ongoing) return p.shutdown ? [p.shutdown === 'reboot' ? 'Restarting' : 'Switched off', 'The box said it was shutting down'] : ['No contact now', 'Running without internet, or off: its readings tell when it reconnects'];
        const parts = [];
        if (p.recordedOffline) parts.push('Running without internet' + (p.routerReachable === true ? ': router reachable (site internet or server down)' : p.routerReachable === false ? ': router not reachable (box cable or Wi-Fi)' : ''));
        if (p.offS) parts.push((p.shutdown ? (p.shutdown === 'reboot' ? 'Restarted' : 'Switched off') : p.unclean ? 'Power cut or crash' : 'Switched off or restarted') + ' ' + durS(p.offS));
        if (p.noDataS) parts.push('Agent not running ' + durS(p.noDataS));
        return [parts[0] || 'Could not reach the server', parts.slice(1).join(' · ')];
      };
      const offlineBlocks = !offHist ? [] : [
        G('stats', 'Offline summary', I.net, { ...wide, ...aside('Since ' + atS(offHist.from), 'info'), items: [
          st('Running', pc(tm2.runningPct), tm2.offMin ? mins(tm2.offMin) + ' off' + (tm2.noDataMin ? ' · ' + mins(tm2.noDataMin) + ' agent not running' : '') : 'Never off', I.power, tm2.runningPct != null && tm2.runningPct < 90 ? 'warn' : 'none', 'Share of the time the box was on and taking readings, with or without internet. Time with no contact now is left out until its readings arrive.'),
          st('Connected', pc(tm2.connectedPct), tm2.offlineRunningMin ? mins(tm2.offlineRunningMin) + ' running without internet' : 'Always reachable while on', I.net, tm2.connectedPct != null && tm2.connectedPct < 90 ? 'warn' : 'none', 'Share of the time the box reached the central server on time.'),
          st('Offline periods', ps.length, ps.length ? durS(offTime) + ' in all' : 'Always reachable', I.net, nowOff ? 'warn' : 'none', 'Times the box could not reach the central server: from the last reading heard on time until it was heard again.'),
          st('Recorded offline', recorded, nowOff ? 'More waiting on the box' : recorded ? 'All uploaded later' : 'None needed', I.up, 'none', 'Readings the box took while offline and uploaded when it reconnected. Each is shown at the time it was taken.'),
          st('Readings received', offHist.readings, offHist.late + ' arrived late', I.pulse, 'none', 'Every reading the portal holds for this period, including those uploaded late.'),
          st('Missing readings', offHist.missing, offHist.missing ? 'Gaps in the box\'s reading numbers' : 'None lost', I.alert, offHist.missing ? 'crit' : 'ok', 'Readings the box numbered but the portal never received. Each agent run numbers its readings 1, 2, 3, …')
        ] }),
        tbl('Offline history', I.cal, ['Offline from', 'Back online', 'How long', 'What happened', { t: 'Recorded offline', align: 'right' }, 'Uploaded', { t: 'Missing', align: 'right' }],
          ps.map(p => [
            cellT(at(p.from)),
            p.ongoing ? cellP(p.shutdown ? 'Not back yet' : 'No contact', p.shutdown ? 'muted' : 'warn') : cellT(at(p.backAt)),
            cellT(durS(p.durationS)),
            cellT(why(p)[0], { w: 600, sub: why(p)[1] }),
            cellT(p.ongoing ? 'Kept on box' : p.recordedOffline, { align: 'right' }),
            cellT(p.uploadedFirstAt ? atS(p.uploadedFirstAt) : p.ongoing ? 'When it reconnects' : '—', { sub: p.uploadedLastAt && atS(p.uploadedLastAt) !== atS(p.uploadedFirstAt) ? 'to ' + atS(p.uploadedLastAt) : '' }),
            cellT(p.missing, { align: 'right', tn: p.missing ? 'crit' : null })
          ]),
          { ...wide, empty: 'Never offline', emptyText: 'The box reached the central server on time for every reading in this period.', minW: '0' })
      ];
      return [
        G('kv', 'Device information', I.info, { items: [
          kvI('Device ID', dv ? dv.deviceId : d.deviceId), kvI('Name', reg.displayName || d.name), kvI('Serial number', (dv && dv.serial) || (d.serial !== '—' ? d.serial : null)),
          ...idRows,
          kvI('Device type', (dv && dv.model ? String(dv.model).replace(/_/g, ' ') : null) || d.type), kvI('Product assignment', reg.product), kvI('Customer / institution', reg.customer),
          kvI('Site code', reg.siteCode), kvI('Location', reg.location), ...(reg.address ? [kvI('Address', reg.address)] : []),
          kvI('Installation date', reg.installedOn ? fmtDay.format(new Date(reg.installedOn + 'T12:00:00Z')) : null), ...(reg.group ? [kvI('Group', reg.group)] : []),
          kvI('Support contact', reg.supportContact), kvI('Email', reg.supportEmail, reg.supportEmail ? 'info' : null), kvI('Phone', reg.supportPhone),
          kvI('Hostname', dv && dv.hostname), kvI('LAN address', dv && dv.lanIp), kvI('Agent version', dv && dv.agentVersion), kvI('First reading', atS(reg.firstSeenAt))
        ] }),
        G('kv', 'Connectivity & readings', I.net, { ...aside(never ? 'Never seen' : off ? stText(d) : 'Online', never ? 'muted' : off ? (d.switchedOff ? 'muted' : 'crit') : 'ok'), items: [
          kvI('Last reading received', at(d.lastSeenAt)), kvI('Readings up to', at(d.dataUpTo)), kvI('Reading interval', everyText), kvI('Status since', at(d.statusSince)),
          kvI('Last start', at(g.bootedAt)), kvI('Uptime', off ? null : durS(g.uptimeS)),
          kvI('Network interface', netw.iface ? netw.iface + (netw.link ? ' · link ' + netw.link : '') : null),
          // the MAC of every wired and Wi-Fi port (agent 0.2.7+), as the box reports it: shown, never edited
          ...(netw.ports || []).map(p => kvI((p.kind === 'wifi' ? 'Wi-Fi MAC' : 'LAN MAC') + ' (' + p.name + ')',
            p.mac + (p.in_use ? ' · in use' : p.link === 'up' ? ' · connected' : ' · not connected') + (p.randomized ? ' · randomised' : ''), p.in_use ? 'ok' : null)),
          ...(netw.wifiDbm != null ? [kvI('Wi-Fi signal', netw.wifiDbm + ' dBm' + (netw.wifiMbps ? ' · ' + n0(netw.wifiMbps) + ' Mbit/s' : ''), netw.wifiDbm <= -75 ? 'warn' : null)] : []),
          kvI('Gateway latency', netw.rttMs == null ? null : n1(netw.rttMs) + ' ms', netw.rttMs >= 100 ? 'warn' : null), kvI('Packet loss', netw.lossPct == null ? null : n1(netw.lossPct) + '%', netw.lossPct >= 1 ? 'warn' : null),
          kvI('Gaps and late uploads (24 h)', g.interruptions24h, g.interruptions24h > 2 ? 'warn' : null),
          kvI('Box clock', clk.ntpSynced == null ? null : clk.ntpSynced ? 'Synchronised (NTP)' : 'Not synchronised', clk.ntpSynced === false ? 'warn' : 'ok')
        ] }),
        ...(SHOW_ENROLMENT && idActs.length ? [G('actions', 'Enrolment', I.lock, { ...wide, ...aside(idn.enrolledAt ? 'Enrolled' : 'Waiting for the box', idn.enrolledAt ? 'ok' : 'muted'), items: idActs })] : []),
        ...(td ? [G('stats', 'Today', I.cal, { ...wide, ...aside(td.computedAt ? 'Updated ' + ago(td.computedAt) : 'Today', 'info'), items: [
          st('Readings', td.readings, 'Received today', I.pulse, 'none', 'Readings received for today (the box takes one every ' + every + ' while it is on).'),
          st('Uploaded late', td.late, td.late ? mins(td.offlineRecordedMin) + ' recorded offline' : 'All on time', I.up, td.late ? 'info' : 'none', 'Readings recorded while the box was offline and delivered later. They are kept and shown at the time they were taken.'),
          st('Box off', mins(td.offMin), 'No readings: ' + mins(td.noDataMin), I.power, td.offMin || td.noDataMin ? 'warn' : 'none', 'Time today when the box was off or restarting, and time without readings while it was on.'),
          st('CPU', tm.cpu_avg == null ? null : pc(tm.cpu_avg) + ' avg', tm.cpu_max == null ? '' : 'Peak ' + pc(tm.cpu_max), I.cpu, tone(tm.cpu_max, TH.cpu), 'Average and peak CPU use today.'),
          st('GPU temperature', tm.gpu_temp_max == null ? null : n0(tm.gpu_temp_max) + ' °C', 'Hottest today', I.thermo, tone(tm.gpu_temp_max, TH.gpuTemp), 'Highest GPU temperature today.'),
          st('Services up', pc(tm.services_pct), restartText(tm), I.svc, tm.services_pct != null && tm.services_pct < 100 ? 'warn' : 'none', 'Share of today\'s service checks that found the watched services running.')
        ] })] : []),
        ...offlineBlocks,
        tbl('Recent alerts', I.alert, ['Severity', 'Alert', 'Raised', 'State'], devAlerts.slice(0, 5).map(alertCells), { ...wide, sortable: false, linkDisplay: devAlerts.length ? 'flex' : 'none', linkLabel: 'All alerts', link: go('alerts'), empty: 'No alerts', emptyText: 'No alerts for this device in the last 30 days.', minW: '0' })
      ];
    };
    build.hardware = () => {
      const hw = (dv && dv.hardware) || {}, cpu = hw.cpu || {}, gpu = hw.gpu || {}, mem = hw.memory || {}, pw = hw.power || {};
      const cores = (cpu.perCore || []).map((x, i) => { const t = tone(x, TH.cpu); return { h: Math.max(3, Math.min(100, x)) + '%', c: TONE[t === 'muted' ? 'none' : t][2], title: 'Core ' + i + ': ' + n0(x) + '%' }; });
      const memGb = mb => mb == null ? null : n1(mb / 1024) + ' GB';
      const thr = pw.throttling;
      const thrText = thr == null ? null : typeof thr === 'object' ? (Object.entries(thr).filter(([, x]) => x).map(([k]) => k.replace(/_/g, ' ')).join(', ') || 'None') : String(thr);
      const throttled = !!thrText && thrText !== 'None' && thrText !== 'false';
      const ZONE = { tj: 'Junction (Tj)', cpu: 'CPU', gpu: 'GPU', soc: 'SoC', nvme: 'NVMe SSD', uncore: 'Uncore', board: 'Board', pmic: 'Power IC' };
      const zoneName = z => ZONE[z] || z.replace(/^cpu(\d)_e$/, 'CPU cluster $1 (efficiency)').replace(/^cpu(\d)_p$/, 'CPU cluster $1 (performance)').replace(/^soc(\d)(\d)(\d)$/, 'SoC $1–$3').replace(/_/g, ' ');
      // performance chart from the readings kept by the portal (GET /devices/{key}/history); gaps mean no reading
      const rk = s.trendRange || '24h';
      const H = (s.hist || {})[d.id + '@' + rk];
      if (!H) this.once('h:' + d.id + '@' + rk, () => this.loadHistory(d.id, rk));
      const RANGES = [{ k: '1h', label: '1H', hrs: 1 }, { k: '6h', label: '6H', hrs: 6 }, { k: '12h', label: '12H', hrs: 12 }, { k: '24h', label: '24H', hrs: 24 }, { k: '7d', label: '7D', hrs: 168 }];
      const rg = RANGES.find(x => x.k === rk) || RANGES[3];
      const DEF = [['cpu', 'CPU utilization', '#0070E0', '%'], ['gpu_temp', 'GPU temperature', '#F59E0B', ' °C'], ['ram', 'Memory utilization', '#7C3AED', '%']];
      const pts = m => ((H && H.series.find(x => x.metric === m)) || { points: [] }).points;
      const base = pts('cpu'), N = Math.max(1, base.length - 1);
      const X = i => i * 300 / N, Y = val => 100 - (Math.max(0, Math.min(100, val)) / 100) * 92 - 4;
      const runs = arr => { const out = []; let cur = null; arr.forEach((p, i) => { if (p[1] == null) { cur = null; return; } if (!cur) out.push(cur = []); cur.push([X(i), Y(p[1])]); }); return out; };
      const line = rs => rs.map(q => q.length === 1 ? 'M' + q[0][0].toFixed(1) + ' ' + q[0][1].toFixed(1) + ' h0.01' : q.map((p, j) => (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')).join(' ');
      const area = rs => rs.filter(q => q.length > 1).map(q => 'M' + q[0][0].toFixed(1) + ' 100 ' + q.map(p => 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' L' + q[q.length - 1][0].toFixed(1) + ' 100 Z').join(' ');
      const lastVal = arr => { for (let i = arr.length - 1; i >= 0; i--) if (arr[i][1] != null) return arr[i][1]; return null; };
      const hi = s.trendHover, onH = !!H && hi != null && hi >= 0 && hi <= N, i2 = onH ? hi : N;
      const fmtH = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ });
      const tAt = base[i2] ? Date.parse(base[i2][0]) : nowMs, lateHere = !!(base[i2] && base[i2][2] > 0);
      const setH = val => { if (this.state.trendHover !== val) this.setState({ trendHover: val }); };
      const agoLbl = frac => { const m = Math.round(rg.hrs * 60 * frac); if (m <= 0) return 'Now'; if (m < 60) return m + ' m ago'; const h = m / 60; if (h < 24) return Math.round(h) + ' h ago'; return Math.round(h / 24) + ' d ago'; };
      const gaps = base.filter(p => p[1] == null).length;
      const trend = G('trend', 'Performance', I.trend, { ...wide, order: -1, ...aside(!H ? 'Loading…' : gaps ? 'Gaps mean no reading' : 'One point per ' + Math.round(H.bucketS / 60) + ' min', !H ? 'muted' : 'info'),
        ranges: RANGES.map(x => ({ label: x.label, pressed: x.k === rk ? 'true' : 'false', bg: x.k === rk ? '#0070E0' : 'transparent', fg: x.k === rk ? '#FFFFFF' : '#5A6675', shadow: x.k === rk ? '0 1px 3px rgba(0,112,224,.4)' : 'none',
          go: () => { this.setState({ trendRange: x.k, trendHover: null }); if (!(this.state.hist || {})[d.id + '@' + x.k]) this.loadHistory(d.id, x.k); } })),
        axL: agoLbl(1), axM: agoLbl(.5), axR: 'Now',
        series: DEF.map(([m, label, color, u]) => { const rs = runs(pts(m)), lv = lastVal(pts(m)); return { label, color, now: lv == null ? NA : n0(lv) + u, path: line(rs), area: area(rs) }; }),
        hx: (i2 / N * 100) + '%', hOp: onH ? 1 : 0, tipX: i2 / N > .62 ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)',
        hTime: fmtH.format(new Date(tAt)) + (lateHere ? ' · uploaded late' : ''),
        hDots: DEF.map(([m, label, color, u]) => { const p = pts(m)[i2], val = p ? p[1] : null; return { label, color, y: (val == null ? 0 : Y(val)) + '%', v: val == null ? 'no reading' : n0(val) + u, hide: val == null }; }),
        hMove: e => { if (!H) return; const r0 = e.currentTarget.getBoundingClientRect(); setH(Math.max(0, Math.min(N, Math.round((e.clientX - r0.left) / r0.width * N)))); },
        hLeave: () => setH(null),
        hKey: e => { if (!H) return; const c = this.state.trendHover == null ? N : this.state.trendHover; if (e.key === 'ArrowLeft') { e.preventDefault(); setH(Math.max(0, c - 1)); } else if (e.key === 'ArrowRight') { e.preventDefault(); setH(Math.min(N, c + 1)); } else if (e.key === 'Escape') setH(null); },
        hFocus: () => { if (H) setH(N); },
        trendAria: 'Line chart of CPU utilization, GPU temperature and memory utilization over the last ' + rg.label + '. Gaps mean no reading. Use the left and right arrow keys to read values.' });
      return [
        G('meters', 'CPU', I.cpu, { ...aside(cpu.cores ? cpu.cores + ' cores' : 'CPU'), items: [
          mt('Utilization', pc(cpu.pct), cpu.pct, live(tone(cpu.pct, TH.cpu))),
          mt('Temperature', cpu.tempC == null ? null : n0(cpu.tempC) + ' °C', cpu.tempC, live(tone(cpu.tempC, TH.gpuTemp))),
          mt('Frequency', cpu.freqMhz == null ? null : (cpu.freqMhz / 1000).toFixed(2) + ' GHz', false),
          mt('Load average (1 / 5 / 15 min)', cpu.load1 == null ? null : [cpu.load1, cpu.load5, cpu.load15].map(x => x == null ? NA : x.toFixed(2)).join(' / '), false)
        ], coresDisplay: cores.length ? 'flex' : 'none', cores, coresAria: 'Per-core utilization: ' + cores.map(c => c.title).join(', ') }),
        G('meters', 'GPU', I.gpu, { ...aside(gpu.name || 'GPU'), items: [
          mt('Utilization', pc(gpu.utilPct), gpu.utilPct, live(tone(gpu.utilPct, TH.gpu))),
          mt('Temperature', gpu.tempC == null ? null : n0(gpu.tempC) + ' °C', gpu.tempC, live(tone(gpu.tempC, TH.gpuTemp))),
          mt('Clock', gpu.clockMhz == null ? null : n0(gpu.clockMhz) + (gpu.maxClockMhz ? ' of ' + n0(gpu.maxClockMhz) : '') + ' MHz', gpu.clockMhz != null && gpu.maxClockMhz ? Math.round(gpu.clockMhz / gpu.maxClockMhz * 100) : false, 'none'),
          mt('Power', gpu.powerW == null ? null : n1(gpu.powerW) + ' W', false),
          mt('Memory', gpu.memoryNote === 'unified' ? 'Shared with system memory' : gpu.memoryNote || null, false)
        ] }),
        G('meters', 'Memory', I.mem, { items: [
          mt('Memory utilization', pc(mem.pct), mem.pct, live(tone(mem.pct, TH.ram))),
          mt('Total RAM', memGb(mem.totalMb), false), mt('Used RAM', memGb(mem.usedMb), false), mt('Available RAM', memGb(mem.availableMb), false), mt('Swap used', pc(mem.swapPct), false)
        ] }),
        (() => {
          // only what this kind of box reports (a DGX Spark reports no power mode or fan, a Jetson does)
          const items = [pw.mode != null && kvI('Power mode', pw.mode), pw.totalW != null && kvI('Power draw', n1(pw.totalW) + ' W'), gpu.powerW != null && kvI('GPU power', n1(gpu.powerW) + ' W'),
            ...(pw.rails || []).filter(x => x.w != null).map(x => kvI(x.rail + ' rail', n1(x.w) + ' W')), pw.fanRpm != null && kvI('Fan speed', n0(pw.fanRpm) + ' rpm'),
            thrText != null && kvI('Throttling', thrText, throttled ? 'crit' : null)].filter(Boolean);
          return G('kv', 'Power', I.power, { ...aside(throttled ? 'Throttling' : off ? 'Last known' : items.length ? 'Normal' : 'Not reported', throttled ? 'crit' : off || !items.length ? 'muted' : 'ok'),
            items: items.length ? items : [kvI('Power readings', 'Not reported by this kind of box')] });
        })(),
        G('kv', 'Temperatures', I.thermo, { items: (hw.thermal || []).length ? hw.thermal.map(z => { const t = tone(z.c, TH.gpuTemp); return kvI(zoneName(z.zone), z.c == null ? null : n1(z.c) + ' °C', t === 'warn' || t === 'crit' ? t : null); }) : [kvI('Sensors', 'Not reported')] }),
        trend
      ];
    };
    build.storage = () => {
      const stg = (dv && dv.storage) || {}, disks = stg.disks || [];
      const root = disks.find(x => x.mount === '/') || disks[0] || {};
      const total = root.total_gb, sT = tone(root.pct, TH.disk), b = stg.breakdown || null;
      const PAL = ['#0070E0', '#7C3AED', '#0EA5E9', '#14B8A6', '#F59E0B', '#EC4899', '#A855F7', '#6366F1'];
      const freeC = sT === 'crit' ? '#DC2626' : sT === 'warn' ? '#F59E0B' : '#22C55E';   // free space: green, amber when low, red when critical
      const parts = [];
      if (b) {
        [['Docker images', b.docker_images_gb, 'Application and AI container images.'], ['Docker volumes', b.docker_volumes_gb, 'Database and model data kept in Docker volumes.'],
          ['Docker build cache', b.docker_build_cache_gb, 'Left over from image builds; safe to clean up.'], ['Containers', b.docker_containers_gb, 'Files written inside running containers.'], ['Logs', b.logs_gb, 'System journal and log files.']]
          .forEach(([label, gb, tip]) => { if (gb) parts.push({ label, gb, tip }); });
        Object.entries(b.paths_gb || {}).forEach(([p, gb]) => { if (gb) parts.push({ label: p, gb, tip: 'Folder measured by the agent: ' + p }); });
      }
      parts.forEach((p, i) => { p.c = PAL[i % PAL.length]; });
      const known = parts.reduce((a, p) => a + p.gb, 0);
      const items = total ? [...parts, { label: 'System & other', gb: Math.max(0, (root.used_gb || 0) - known), c: '#94A3B8', tip: 'Operating system, programs and everything not listed above.' }, { label: 'Available', gb: root.free_gb || 0, c: freeC, tip: 'Free space on the system disk.' }]
        .map(x => ({ label: x.label, value: gbT(x.gb), w: (x.gb / total * 100).toFixed(2) + '%', pct: (x.gb / total * 100).toFixed(1) + '%', c: x.c, tip: x.tip, bar: 'linear-gradient(180deg,rgba(255,255,255,.45),rgba(255,255,255,.08) 48%,rgba(0,0,0,.1)), ' + x.c })) : [];
      return [
        G('meters', 'Disk capacity', I.disk, { ...aside(root.pct == null ? 'No data' : sT === 'crit' ? 'Critical' : sT === 'warn' ? 'Low storage' : 'Healthy', root.pct == null ? 'muted' : sT === 'none' ? 'ok' : sT), items: [
          mt('Storage utilization', pc(root.pct), root.pct, sT), mt('Total disk capacity', gbT(total), false), mt('Used storage', gbT(root.used_gb), false), mt('Available storage', gbT(root.free_gb), false)] }),
        G('stack', 'Storage consumption', I.disk, { ...(s.w < 1100 ? wide : {}), ...aside(b ? 'Measured ' + (ago(stg.breakdownAt) || '') : 'Not measured yet', b ? 'info' : 'muted'), items, stackAria: 'Storage breakdown: ' + items.map(i => i.label + ' ' + i.value).join(', ') }),
        ...(disks.length > 1 ? [tbl('Disks', I.disk, ['Mount', 'Size', 'Used', 'Free', 'Used %'], disks.map(x => { const t = tone(x.pct, TH.disk); return [cellT(x.mount, { w: 600 }), cellT(gbT(x.total_gb)), cellT(gbT(x.used_gb)), cellT(gbT(x.free_gb)), cellT(pc(x.pct), { tn: t === 'warn' || t === 'crit' ? t : null })]; }), { ...wide, minW: '520px' })] : []),
        G('kv', 'Logs on the box', I.log, { items: [kvI('System journal', mbT(stg.journalMb)), kvI('/var/log folder', mbT(stg.varLogMb)), kvI('Storage measured', at(stg.breakdownAt))] })
      ];
    };
    build.services = () => {
      // only what this box really runs: a service it does not have (not_configured, e.g. no PostgreSQL on an Orin Nano) or
      // a container that never ran or finished as a one-off job (unknown) is left out
      const svcs = ((dv && dv.services) || []).filter(x => x.status !== 'not_configured' && x.status !== 'unknown');
      // the agent's statuses: only down and degraded are problems; not_configured (e.g. no LLM on this box) and unknown
      // (a container that never started or a finished one-off job) are not outages
      const STATE = { up: ['Running', 'ok'], down: ['Down', 'crit'], degraded: ['Degraded', 'warn'], not_configured: ['Not set up', 'muted'], unknown: ['Unknown', 'muted'] };
      const isBad = x => x.watched && (x.status === 'down' || x.status === 'degraded');
      const rows = svcs.map(x => {
        const stt = !x.watched ? ['Not watched', 'muted'] : STATE[x.status] || [x.status || 'Unknown', 'muted'];
        const bad = isBad(x), expandable = bad || !x.watched;
        const xKey = d.id + ':svc:' + x.name, open = !!(s.svcOpen || {})[xKey], busy = !!(s.watchBusy || {})[xKey];
        const toggle = () => this.setState(st2 => ({ svcOpen: { ...(st2.svcOpen || {}), [xKey]: !(st2.svcOpen || {})[xKey] } }));
        const lines = [[x.status === 'up' ? 'INFO' : 'ERROR', (x.status || 'unknown').toUpperCase() + ' · ' + (x.detail || 'no detail reported'), d.dataUpTo],
          ...(x.since ? [['INFO', 'In this state since ' + at(x.since), x.since]] : []),
          ['WARN', (x.failedChecks7d || 0) + ' failed checks in the last 7 days · available ' + (pc(x.availability30d) || NA) + ' over 30 days', null]]
          .map(l => ({ t: l[2] ? fmtD.format(new Date(l[2])) : '7 days', lvl: l[0], msg: l[1], fg: l[0] === 'ERROR' ? '#FF8A8A' : l[0] === 'WARN' ? '#FFC266' : '#7FD1A8' }));
        const xx = expandable ? { open, rail: TONE[stt[1]][0], bg: bad ? '#FFF7F7' : '#F6F8FB', border: bad ? '#F3C7C7' : '#E1E6EF', fg: TONE[stt[1]][0],
          title: !x.watched ? x.label + ' is not watched on this box' : x.label + ' is ' + (x.status === 'degraded' ? 'degraded' : 'down'),
          sub: !x.watched ? 'Its state is still shown, but it raises no alerts and does not count against the box. Watch it again if it should run here.'
            : 'Remote restart is not available yet (it needs a secure command channel to the box), so restart it on site. If this service is meant to be off on this box, stop watching it so it no longer raises alerts.',
          lines, restartLabel: !can.admin ? 'Admins can change watching' : busy ? 'Saving…' : x.watched ? 'Stop watching' : 'Watch again', restartDisabled: !can.admin || busy,
          restart: () => this.setWatch(d, x, !x.watched, xKey), openLogs: go('alerts'), openLabel: 'View alerts' } : null;
        const cells = [expandable ? cellDisc(x.label, stt[1], open, open ? 'Hide details' : 'View details', toggle) : cellT(x.label, { w: 600, sub: x.name }),
          cellP(stt[0], stt[1]), cellT(pc(x.availability24h), { tn: x.availability24h != null && x.availability24h < 99 ? 'warn' : null }), cellT(pc(x.availability30d)),
          cellT(x.latencyMs == null ? null : n1(x.latencyMs) + ' ms'), cellT(x.since ? ago(x.since) : null, { sub: x.since ? atS(x.since) : '' }),
          cellT(x.restarts24h == null ? x.restarts : x.restarts24h, { tn: x.restarts24h ? 'warn' : null }), cellT(x.failedChecks7d, { tn: x.failedChecks7d ? 'crit' : null })];
        if (xx) cells._x = xx;
        return cells;
      });
      const checked = svcs.filter(x => x.watched && ['up', 'down', 'degraded'].includes(x.status)), up = checked.filter(x => x.status === 'up').length;
      const svcTone = !svcs.length ? 'muted' : checked.some(x => x.status === 'down') ? 'crit' : checked.some(x => x.status === 'degraded') ? 'warn' : 'ok';
      return [tbl('Application & service health', I.svc, [{ t: 'Service', align: 'left', w: '220px' }, 'Status', 'Available (24 h)', 'Available (30 d)', 'Response time', 'In state since', 'Restarts (24 h)', 'Failed checks (7 d)'], rows,
        { ...wide, ...aside(!svcs.length ? 'No data' : up + ' of ' + checked.length + ' running', svcTone), minW: '980px', empty: 'No services reported', emptyText: 'This box has not reported its services yet.' })];
    };
    build.software = () => {
      const sw = (dv && dv.software) || {}, ver = sw.versions || {};
      const ROWS = [['Operating system', 'os'], ['Kernel', 'kernel'], ['JetPack', 'jetpack'], ['Jetson Linux (L4T)', 'l4t'], ['Bootloader', 'bootloader'], ['NVIDIA driver', 'nvidia_driver'], ['CUDA (driver)', 'cuda_driver'], ['cuDNN', 'cudnn'], ['TensorRT', 'tensorrt'],
        ['Docker', 'docker'], ['NVIDIA Container Toolkit', 'nvidia_container_toolkit'], ['Python', 'python'], ['jetson-stats', 'jetson_stats'], ['Raspberry Pi firmware', 'rpi_firmware'], ['Raspberry Pi EEPROM', 'rpi_eeprom'],
        ['vLLM', 'vllm_version'], ['LLM model', 'llm_model'], ['Application version', 'app_version'], ['Application image', 'app_image']];
      const always = ['os', 'kernel', 'app_version'];
      const items = ROWS.filter(([, k]) => ver[k] != null || always.includes(k)).map(([l, k]) => kvI(l, ver[k]));
      Object.keys(ver).filter(k => !ROWS.some(x => x[1] === k) && ver[k] != null).forEach(k => items.push(kvI(k.replace(/_/g, ' '), ver[k])));
      const hist = sw.history || [];
      // hourly, agent 0.2.2+: OS updates waiting, auto-updates, last update, firmware, settings changed
      const up = dv && dv.updates, sec = up && up.os_security_updates_pending, fw = up && up.firmware_update;
      const updates = G('stats', 'Updates', I.dl, { ...wide, ...aside(!up ? 'Needs agent 0.2.2 or later' : 'Checked ' + ago(dv.hourlyAt), !up ? 'muted' : sec ? 'warn' : 'ok'),
        items: !up
          ? [st('Updates', 'Not reported', 'This box runs an older agent', I.dl, 'muted', 'Update the box agent to 0.2.2 (setup-device.sh --upgrade) to see its updates here.')]
          : [st('OS updates waiting', up.os_updates_pending, sec != null ? sec + ' security' : '', I.dl, sec ? 'warn' : 'none',
              'Operating-system packages with a newer version in the box\'s package lists; security updates are counted separately.'),
            st('Automatic updates', up.auto_updates == null ? null : up.auto_updates ? 'On' : 'Off', up.auto_updates ? 'Unattended upgrades' : up.auto_updates === false ? 'Installed by hand' : '', I.clock, 'none',
              'Whether the box installs operating-system updates by itself (unattended upgrades).'),
            st('Last OS update', ago(up.last_os_update_at) || 'None recorded', atS(up.last_os_update_at), I.check, 'none', 'When packages were last installed or upgraded on the box.'),
            st('Firmware', fw ? fw.charAt(0).toUpperCase() + fw.slice(1) : null, fw ? 'Raspberry Pi bootloader' : 'Not reported for this device', I.ota, fw && fw !== 'up to date' ? 'warn' : 'none',
              'Raspberry Pi: whether a newer bootloader (EEPROM) is ready to install.'),
            st('Settings changed', ago(up.config_changed_at), atS(up.config_changed_at), I.gear, 'none', 'When the agent\'s settings on the box were last changed.')] });
      return [
        G('kv', 'Software & versions', I.sw, { ...aside(sw.at ? 'Checked ' + ago(sw.at) : 'Not reported yet', sw.at ? 'info' : 'muted'), items }),
        G('kv', 'Remote updates (OTA)', I.ota, { ...aside('Install on box: by hand', 'info'), items: [
          ...(can.patchList ? [kvI('Patches for this box', 'See the Patches tab: installed or pending, guide and download')] : can.patch ? [kvI('Sending a patch', 'Update patch, on the box\'s card in the fleet list')] : []),
          kvI('Installing a patch', 'By hand on the box, following the patch\'s guide'), kvI('Deployment status', 'Reported by the box (agent 0.3.1, saras-patch)'),
          kvI('Installing remotely', 'Planned (TD-OTA)'), kvI('Version changes', 'Recorded as alerts and listed below')] }),
        updates,
        tbl('Version history', I.ota, ['Date', 'Change'], hist.map(x => [cellT(atS(x.at), { w: 600 }), cellT(x.detail)]), { ...wide, sortable: false, minW: '520px', empty: 'No version changes', emptyText: 'No version changes in the last 30 days.' })
      ];
    };
    build.sync = () => {
      const sy = (dv && dv.sync) || {}, e = sy.edge, u = sy.upload, bl = sy.backlogs || [];
      const oldestH = e && e.oldest_pending_at ? (nowMs - Date.parse(e.oldest_pending_at)) / 3600000 : 0;
      const eT = !e ? 'muted' : !e.enabled ? 'warn' : e.failed_batches || e.quarantined ? 'crit' : oldestH > 2 ? 'warn' : 'ok';
      const noSchoolSync = ['JON', 'RPI'].includes(d.typeCode) && !e;
      const groups = [
        // the school-data sync runs on SchoolAI boxes only: Proctor (Orin Nano) and Assessment (Raspberry Pi) boxes do not show it
        ...(noSchoolSync ? [] : [
        G('stats', 'School data sync', I.sync, { ...wide, ...aside(!e ? 'Not reported' : off ? 'Last known · ' + ago(d.lastSeenAt) : !e.enabled ? 'Switched off' : eT === 'ok' ? 'Healthy' : eT === 'crit' ? 'Failing' : 'Behind', off ? 'muted' : eT), items: !e
          ? [st('Sync status', 'Not reported', 'This box does not report the school-data sync', I.sync, 'muted', '')]
          : [st('Last pull from central', ago(e.last_pull_at), atS(e.last_pull_at), I.dl, 'none', 'When the box last fetched changes from the central server.'),
            st('Last push confirmed', ago(e.last_push_acked_at), atS(e.last_push_acked_at), I.up, 'none', 'When the central server last confirmed changes sent by this box.'),
            st('Changes waiting to send', e.pending_events, e.oldest_pending_at ? 'Oldest ' + ago(e.oldest_pending_at) : 'Nothing waiting', I.clock, oldestH > 2 ? 'warn' : 'none', 'Changes made at the school that the central server has not confirmed yet. They are sent automatically when the connection allows.'),
            st('Failed batches', e.failed_batches, (e.open_batches || 0) + ' in progress', I.alert, e.failed_batches ? 'crit' : 'none', 'Batches of changes the central server refused; they need attention.'),
            st('Conflicts (24 h)', e.conflicts_24h, (e.quarantined || 0) + ' quarantined', I.filter, e.conflicts_24h || e.quarantined ? 'warn' : 'none', 'The same record changed at the school and centrally; the sync rules decided which change wins. Quarantined records need a person to look at them.'),
            st('Sync node', e.node, e.enabled ? 'Enabled' : 'Disabled', I.info, 'none', 'Name this box uses in the school-data sync.')] })]),
        G('stats', 'Health reading uploads', I.up, { ...wide, ...aside(!u ? 'Not reported' : u.last_upload_error ? 'Retrying' : off ? 'Waiting for reconnect' : 'Up to date', !u ? 'muted' : u.last_upload_error || off ? 'warn' : 'ok'), items: !u
          ? [st('Uploads', 'Not reported', '', I.up, 'muted', '')]
          : [st('Last upload', ago(u.last_upload_ok), atS(u.last_upload_ok), I.check, 'none', 'When the box last delivered readings to the central server.'),
            off ? st('Waiting on the box', '≈ ' + Math.floor((seenMs || 0) / (every * 60000)).toLocaleString('en-IN') + ' readings', 'Estimate: taken since it went offline', I.clock, d.dataLossRisk ? 'crit' : 'warn', 'The box keeps taking readings while it is offline and stores them (up to 15 days or 200 MB). They are uploaded when it reconnects, and the history fills in.')
              : st('Waiting on the box', (u.outbox_files || 0) + (u.outbox_files === 1 ? ' file' : ' files'), mbT(u.outbox_mb) || '', I.clock, u.outbox_files > 1 ? 'warn' : 'none', 'Readings saved on the box and not uploaded yet. While the box is offline they wait here (up to 15 days or 200 MB) and are sent when it reconnects.'),
            off ? st('Oldest waiting', ago(d.lastSeenAt), 'Since ' + atS(d.lastSeenAt), I.clock, d.dataLossRisk ? 'crit' : 'warn', 'Readings from this time on are still on the box.')
              : st('Oldest waiting', u.oldest_waiting ? ago(u.oldest_waiting) : 'Nothing waiting', u.oldest_waiting ? atS(u.oldest_waiting) : '', I.clock, u.oldest_waiting ? 'warn' : 'none', 'The oldest reading still waiting on the box.'),
            st('Dropped', u.dropped_total || 0, 'Lost on the box', I.alert, u.dropped_total ? 'crit' : 'none', 'Readings deleted on the box because they were older than 15 days or the buffer was full.'),
            st('Last error', u.last_upload_error || 'None', '', I.bug, u.last_upload_error ? 'warn' : 'none', 'The most recent upload error the box reported.')] }),
        tbl('Offline periods recovered', I.up, ['Uploaded at', 'Readings', 'Recorded from', 'Recorded to', 'Arrived late'], bl.map(x => [cellT(atS(x.receivedAt), { w: 600, sub: ago(x.receivedAt) }), cellT(x.readings), cellT(atS(x.firstSentAt)), cellT(atS(x.lastSentAt)), cellT(x.late, { tn: x.late ? 'info' : null })]),
          { ...wide, sortable: false, ...aside(bl.length ? bl.length + ' recovered' : 'None', bl.length ? 'info' : 'ok'), minW: '640px',
            empty: off ? 'Offline now' : 'No offline periods',
            emptyText: off ? 'The readings this box takes while offline will be listed here once it reconnects and uploads them.' : 'Every reading arrived on time. When a box is offline it keeps taking readings and uploads them all when it reconnects; each such upload is listed here.' })
      ];
      if (sy.legacy) groups.splice(1, 0, G('kv', 'Full database sync (old)', I.sync, { items: Object.entries(sy.legacy).map(([k, x]) => kvI(k.replace(/_/g, ' '), x != null && typeof x === 'object' ? JSON.stringify(x) : x)) }));
      return groups;
    };
    build.ai = () => {
      const ai = dv && dv.ai, vl = (ai && ai.vllm) || {};
      if (!ai) return [G('custom', 'AI workload', I.ai, { ...wide, el: this.empty('No AI service on this box', 'This box does not report an LLM service.') })];
      const n = x => x == null ? null : Math.round(x).toLocaleString('en-IN');
      const sec = x => x == null ? null : x < 1 ? Math.round(x * 1000) + ' ms' : x.toFixed(2) + ' s';
      const days = ((dd && dd.daily) || []).slice(0, 7);
      return [
        G('stats', 'LLM usage today', I.user, { ...wide, ...aside(off ? 'Last known' : 'Since midnight', off ? 'muted' : 'info'), items: [
          st('Requests', n(ai.requestsToday), (n(ai.abortedToday) || 0) + ' aborted', I.trend, 'none', 'Chat and API requests the model finished today.'),
          st('Prompt tokens', n(ai.promptTokensToday), 'Read by the model', I.pulse, 'none', 'Tokens sent to the model today.'),
          st('Generated tokens', n(ai.generatedTokensToday), 'Written by the model', I.ai, 'none', 'Tokens the model generated today.'),
          st('Running now', n(vl.running), (n(vl.waiting) || 0) + ' waiting', I.clock, vl.waiting > 0 ? 'warn' : 'none', 'Requests the model is working on right now, and requests waiting in the queue.')
        ] }),
        G('meters', 'Performance', I.clock, { items: [
          mt('Time to first token (average)', sec(vl.avg_ttft_s), vl.avg_ttft_s == null ? null : vl.avg_ttft_s / 5 * 100, vl.avg_ttft_s >= 3 ? 'warn' : 'none', 'How long users wait before the answer starts'),
          mt('Full response time (average)', sec(vl.avg_e2e_latency_s), vl.avg_e2e_latency_s == null ? null : vl.avg_e2e_latency_s / 30 * 100, vl.avg_e2e_latency_s >= 20 ? 'warn' : 'none'),
          mt('KV cache in use', pc(vl.kv_cache_pct), vl.kv_cache_pct, vl.kv_cache_pct >= 90 ? 'crit' : vl.kv_cache_pct >= 75 ? 'warn' : 'none', 'Memory for active conversations; when it is full new requests wait'),
          mt('GPU utilization', pc(ai.gpuUtilPct), ai.gpuUtilPct, tone(ai.gpuUtilPct, TH.gpu))
        ] }),
        G('kv', 'Model', I.ai, { ...aside(vl.status === 'up' ? 'Available' : vl.status ? 'Unavailable' : 'Unknown', vl.status === 'up' ? 'ok' : vl.status ? 'crit' : 'muted'), items: [
          kvI('Model', vl.model), kvI('Service', vl.status === 'up' ? 'Running' : vl.status, vl.status === 'up' ? 'ok' : vl.status ? 'crit' : null),
          kvI('Requests since start', n(vl.requests_success_total)), kvI('Aborted since start', n(vl.requests_aborted_total)),
          kvI('Prompt tokens since start', n(vl.prompt_tokens_total)), kvI('Generated tokens since start', n(vl.generation_tokens_total))
        ] }),
        tbl('Last 7 days', I.cal, ['Date', 'Requests', 'Aborted', 'Prompt tokens', 'Generated tokens'], days.map(x => { const m = x.metrics || {}; return [cellT(fmtWdU.format(new Date(x.day + 'T00:00:00Z')), { w: 600 }), cellT(n(m.llm_requests)), cellT(n(m.llm_aborted)), cellT(n(m.llm_prompt_tokens)), cellT(n(m.llm_gen_tokens))]; }),
          { ...wide, sortable: false, minW: '560px', empty: 'No usage yet', emptyText: 'Daily LLM usage appears here after the first full day.' })
      ];
    };
    build.cameras = () => {
      const cam = dv && dv.cameras, devs = (cam && cam.devices) || [], svc = cam && cam.service;
      const count = cam && cam.count;
      const connected = cam && cam.connected;
      const cTone = !cam ? 'muted' : connected ? 'ok' : 'warn';
      const svcRunning = svc && svc.running;
      const sTone = !svc ? 'muted' : svcRunning ? 'ok' : svc.status === 'exited' ? 'warn' : 'crit';

      const summaryStats = G('stats', 'Cameras & proctoring status', I.cam, {
        ...wide, ...aside(!cam ? 'Needs agent with camera support' : connected ? count + (count === 1 ? ' camera connected' : ' cameras connected') : 'No cameras connected', cTone),
        items: !cam ? [
          st('Cameras', 'Not reported', 'This box has not reported camera status', I.cam, 'muted', 'Update the box agent to see camera status here.')
        ] : [
          st('Connected cameras', count ?? 0, connected ? 'Video capture ready' : 'Connect a USB/CSI camera', I.cam, connected ? 'ok' : 'warn', 'Hardware video capture devices discovered in /dev/video* and V4L2.'),
          st('Proctoring service', svc ? (svcRunning ? 'Running' : svc.status) : 'Not found', svc ? 'exam-monitor container' : 'No proctor container on box', I.svc, sTone, 'Health of the exam-monitor / proctoring container.'),
          st('Capture status', connected && svcRunning ? 'Active' : connected ? 'Service stopped' : 'No camera', svc && svc.last_error ? 'Last error in logs' : 'Normal', I.pulse, connected && svcRunning ? 'ok' : 'crit', 'Combined hardware and service readiness for exam proctoring.')
        ]
      });

      const cameraTable = tbl('Connected camera devices', I.cam, ['Device node', 'Camera model / name', 'Driver', 'Bus / Interface', 'Status'],
        devs.map(cd => [
          cellT(cd.node, { w: 600 }),
          cellT(cd.name || 'Generic Camera'),
          cellT(cd.driver || 'v4l2'),
          cellT((cd.bus || 'usb').toUpperCase()),
          cellP(cd.available ? 'Ready' : 'Unavailable', cd.available ? 'ok' : 'warn')
        ]),
        { ...wide, empty: 'No camera devices detected', emptyText: 'No video capture devices were found in /dev/video*. Connect a USB or CSI camera to the box.', minW: '640px' }
      );

      const proctorDetails = G('kv', 'Proctor service details', I.svc, {
        ...aside(svc ? (svcRunning ? 'Service healthy' : 'Service ' + svc.status) : 'Not configured', sTone),
        items: !svc ? [
          kvI('Proctor service', 'exam-monitor container not installed')
        ] : [
          kvI('Container name', svc.name),
          kvI('Status', svc.status, svcRunning ? 'ok' : 'crit'),
          kvI('Restart count', String(svc.restart_count ?? 0), (svc.restart_count || 0) > 3 ? 'warn' : null),
          kvI('Started at', svc.started_at ? atS(svc.started_at) : 'Not started'),
          kvI('Recent log note', svc.last_error || 'No camera or frame errors reported in container logs', svc.last_error ? 'warn' : 'ok')
        ]
      });

      return [summaryStats, cameraTable, proctorDetails];
    };
    // Patches (docs/TD-ROLES.md 10): every patch released for this box, its status here, the guide and the files
    build.patches = () => {
      const P = this.patchesOf(d), pd = P.data, pl = (pd && pd.patches) || [];
      if (!pd && !P.busy && !P.denied) this.once('patches:' + d.id, () => this.loadPatches(d));
      const pMail = (pd && pd.mail) || {}, pMailOk = !!(pMail.configured && pMail.enabled), pStoreOk = !!(pd && pd.storage && pd.storage.ready);
      const cnt = (pd && pd.counts) || {}, latest = pl.find(p => p.status === 'ready') || null;
      const lb = latest ? (PT_BOX[(latest.box || {}).status] || PT_BOX.pending) : null;
      const glance = G('stats', 'Patches at a glance', I.up, { ...wide, ...aside(!pd ? (P.busy ? 'Loading' : 'Not loaded') : pd.agentReports ? 'The box reports deployments' : 'Agent older than 0.3.1', !pd ? 'muted' : pd.agentReports ? 'ok' : 'warn'), items: [
        st('Latest patch', latest ? latest.name : pd ? 'None yet' : null, latest ? lb[0] + ' · released ' + atS(latest.readyAt || latest.createdAt) : 'No patch released for this box', I.up, lb ? (lb[1] === 'muted' ? 'none' : lb[1]) : 'none',
          'The newest patch for this box, named after the box and its version.'),
        st('Pending', pd ? cnt.pending || 0 : null, 'Released, not installed yet', I.clock, cnt.pending ? 'warn' : 'none', 'Install a pending patch by hand on the box, following its guide; the box then reports it.'),
        st('Installed', pd ? cnt.installed || 0 : null, 'Reported by the box', I.check, cnt.installed ? 'ok' : 'none', 'Patches the box reported as completed (sudo saras-patch completed VERSION).'),
        st('Failed / problems', pd ? cnt.failed || 0 : null, 'Failed on the box or reported', I.alert, cnt.failed ? 'crit' : 'none', 'Patches the box reported as failed, or with a problem a client reported.'),
        st('Agent', pd ? pd.agentVersion || 'Unknown' : null, pd ? (pd.agentReports ? 'Reports each deployment' : 'Update to 0.3.1 to report') : '', I.cpu, pd && !pd.agentReports ? 'warn' : 'none',
          'Agents 0.3.1 and later report each patch\'s deployment. Update an older agent on the box: sudo bash ./setup-device.sh --upgrade.')
      ] });
      const patchEl = React.createElement(PatchPanel, {
        loading: !pd && !!P.busy, err: !pd ? P.err || '' : '', retry: P.denied ? null : () => this.loadPatches(d),
        canUpload: !!can.patch && !!pd, onUpload: () => this.openPatch(d, '[data-pt-open="' + d.id + '"]'), openKey: d.id,
        uploadDisabled: !pStoreOk || d.status === 'Revoked', uploadTitle: d.status === 'Revoked' ? 'This device is revoked' : !pStoreOk ? ((pd && pd.storage && pd.storage.error) || 'The patch storage is not ready') : '',
        note: !pd ? '' : can.readOnly ? 'Patches Excelsoft released for this box. Download the files and the guide at any time, install by hand on the box, and the box reports the result here.'
          : [pd.storage && pd.storage.kind ? 'Stored in ' + pd.storage.kind : 'No patch storage set up', pd.recipients && pd.recipients.length ? 'e-mailed to ' + pd.recipients.length + (pd.recipients.length === 1 ? ' contact' : ' contacts') : 'no contacts set', pMailOk ? null : 'no mail server yet'].filter(Boolean).join(' · '),
        emptyText: can.patch ? 'No patches for this box yet. Upload one to send it.' : 'No patches for this box yet.',
        rows: pl.map(p => this.patchRow(d, p, s, pMailOk, pd)) });
      return [glance, G('custom', 'Patches', I.up, { ...wide, ...aside(!pd ? (P.busy ? 'Loading' : 'Not loaded') : pl.length + (pl.length === 1 ? ' patch' : ' patches'), pd ? 'info' : 'muted'), el: patchEl })];
    };
    build.alerts = () => {
      const rank = { Critical: 0, Warning: 1, Info: 2 };
      const sevF = s.detSev || 'All', stF = s.detState || 'All';
      const stOf = a => isAcked(a) ? 'Acknowledged' : a.state;
      const c = k => k === 'All' ? devAlerts.length : devAlerts.filter(a => a.sev === k).length;
      const sorted = devAlerts.slice().sort((a, b) => ((stOf(a) === 'Active' ? 0 : 1) - (stOf(b) === 'Active' ? 0 : 1)) || (rank[a.sev] - rank[b.sev]) || (Date.parse(b.startedAt) - Date.parse(a.startedAt)));
      const filtered = sorted.filter(a => (sevF === 'All' || a.sev === sevF) && (stF === 'All' || stOf(a) === stF));
      const filterEl = this.alertFilterEl({
        sev: sevF, state: stF,
        sevOpts: [{ k: 'All', label: 'All', count: c('All') }, { k: 'Critical', label: 'Critical', count: c('Critical') }, { k: 'Warning', label: 'Warning', count: c('Warning') }, { k: 'Info', label: 'Info', count: c('Info') }],
        stateOpts: [{ k: 'All', label: 'All' }, ...['Active', 'Acknowledged', 'Resolved'].map(k => ({ k, label: k, count: devAlerts.filter(a => stOf(a) === k).length }))],
        onSev: k => this.setState({ detSev: k }), onState: k => this.setState({ detState: k })
      });
      const ended = a => a.oneShot ? cellT('Event', { tn: 'muted' }) : a.endedAt ? cellT('After ' + durS(Math.round((Date.parse(a.endedAt) - Date.parse(a.startedAt)) / 1000)), { sub: atS(a.endedAt) }) : cellT('Ongoing', { tn: 'warn', w: 600 });
      return [
        G('custom', 'Filter alerts', I.filter, { ...wide, el: filterEl }),
        tbl('Alerts & alert history', I.alert, ['Severity', 'Alert', 'Raised', 'Ended', 'State', { t: 'Action', align: 'right' }], filtered.map(a => { const cells = alertCells(a); return [...cells.slice(0, 3), ended(a), cells[3], cellAck(a)]; }),
          { ...wide, ...aside(openAlerts.length + ' open', openAlerts.length ? (openAlerts.some(a => a.sev === 'Critical') ? 'crit' : 'warn') : 'ok'), empty: 'No alerts match', emptyText: 'Try a different severity or state filter.', minW: '860px' })
      ];
    };
    build.diagnostics = () => {
      const ce = (dv && dv.collectorErrors) || {}, notes = Object.entries(ce);
      const h = React.createElement;
      // device logs, agent 0.2.3+: new warning and error lines of the system journal, the kernel and the containers,
      // masked on the box (passwords, keys, tokens, email addresses, phone numbers); filters, search, paging and CSV export
      const lg = this.logsOf(d);
      const verNum = v => String(v || '0').split('.').map(x => parseInt(x, 10) || 0);
      const logsReady = (() => { const a = verNum(dv && dv.agentVersion), b = [0, 2, 3]; for (let i = 0; i < 3; i++) if ((a[i] || 0) !== b[i]) return (a[i] || 0) > b[i]; return true; })();
      if (can.fullReading && !lg.entries && !lg.busy && !lg.err) this.once('logs:' + d.id, () => this.loadLogs(d));
      const LOG_RANGES = [['1h', 'Last hour'], ['24h', 'Last 24 hours'], ['today', 'Today'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['custom', 'Custom dates']];
      const LVL = { critical: ['Critical', '#FF7A7A'], error: ['Error', '#FF9F7A'], warning: ['Warning', '#FFC266'] };
      const SRC = { system: 'System', kernel: 'Kernel', app: 'Application' };
      const fmtLog = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
      const ctl = { height: 36, borderRadius: 9, border: '1px solid #D5DBE4', background: '#FFFFFF', color: '#1A1E26', fontFamily: 'Poppins,sans-serif', fontSize: 13, padding: '0 10px' };
      const dayIso = t => { const x = new Date(t); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
      const minDay = dayIso(Date.now() - 89 * 864e5), maxDay = dayIso(Date.now());
      const logSel = (key, label, opts) => h('select', { key, 'aria-label': label, value: lg[key], onChange: e => this.loadLogs(d, { [key]: e.target.value }), style: { ...ctl, cursor: 'pointer' } },
        opts.map(([v, t]) => h('option', { key: v, value: v }, t)));
      /** The period buttons (and the custom days) of a card: `set` changes the filters, `load` reloads with a change. */
      const periodEl = (cur, set, load) => [
        h('div', { key: 'r', role: 'group', 'aria-label': 'Period', style: { display: 'flex', flexWrap: 'wrap', gap: 4, padding: 4, borderRadius: 10, background: '#F5F7FA', boxShadow: 'inset 0 0 0 1px #E4E9F0', alignSelf: 'flex-start' } },
          LOG_RANGES.map(([k, label]) => h('button', { key: k, type: 'button', 'aria-pressed': cur.range === k ? 'true' : 'false',
            onClick: () => k === 'custom' ? set({ range: 'custom', from: cur.from || dayIso(Date.now() - 6 * 864e5), to: cur.to || maxDay }) : load({ range: k }),
            style: { height: 32, padding: '0 12px', border: 0, borderRadius: 8, background: cur.range === k ? '#FFFFFF' : 'transparent', boxShadow: cur.range === k ? '0 1px 3px rgba(16,42,84,.16)' : 'none',
              color: cur.range === k ? '#005BB8' : '#3B4552', fontFamily: 'Poppins,sans-serif', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' } }, label))),
        cur.range === 'custom' ? h('div', { key: 'c', style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 13, color: '#3B4552' } }, [
          h('label', { key: 'f', style: { display: 'flex', gap: 6, alignItems: 'center' } }, ['From', h('input', { key: 'i', type: 'date', value: cur.from, min: minDay, max: maxDay, onChange: e => set({ from: e.target.value }), style: ctl })]),
          h('label', { key: 't', style: { display: 'flex', gap: 6, alignItems: 'center' } }, ['To', h('input', { key: 'i', type: 'date', value: cur.to, min: minDay, max: maxDay, onChange: e => set({ to: e.target.value }), style: ctl })]),
          h('button', { key: 'g', type: 'button', onClick: () => load({}), style: { ...ctl, color: '#005BB8', fontWeight: 600, cursor: 'pointer', border: '1px solid #C9D6E8' } }, 'Show')
        ]) : null
      ];
      const entries = lg.entries || [];
      const logBtn = (key, label, onClick) => h('button', { key, type: 'button', onClick, disabled: !!lg.busy, style: { height: 38, padding: '0 16px', borderRadius: 10, border: '1px solid #C9D6E8',
        background: '#FFFFFF', color: '#005BB8', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: lg.busy ? 'progress' : 'pointer' } }, label);
      const logsEl = !can.fullReading
        ? h('span', { style: { fontSize: 13, color: '#5A6675', fontFamily: 'Poppins,sans-serif' } }, 'Only support and admin users can view device logs.')
        : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Poppins,sans-serif' } }, [
          ...periodEl(lg, x => this.setLogs(d, x), p => this.loadLogs(d, p)),
          h('div', { key: 'f', style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' } }, [
            logSel('source', 'Source', [['all', 'All sources'], ['system', 'System'], ['kernel', 'Kernel'], ['app', 'Applications']]),
            logSel('level', 'Level', [['all', 'All levels'], ['critical', 'Critical'], ['error', 'Error'], ['warning', 'Warning']]),
            h('input', { key: 'q', type: 'search', 'aria-label': 'Search the log lines', placeholder: 'Search text or service', value: lg.q, maxLength: 200,
              onChange: e => { const v = e.target.value; this.setLogs(d, { q: v }); clearTimeout(this._logQ); this._logQ = setTimeout(() => this.loadLogs(d, { q: v }), 450); },
              style: { ...ctl, flex: '1 1 220px', minWidth: 0 } }),
            logBtn('rl', lg.busy ? 'Loading…' : 'Refresh', () => this.loadLogs(d, {})),
            can.logExport && h('button', { key: 'x', type: 'button', onClick: () => this.exportLogs(d), disabled: !!lg.exporting || !lg.total,
              style: { height: 38, padding: '0 16px', borderRadius: 10, border: 0, background: !lg.total ? '#AEB6C2' : 'linear-gradient(180deg,#1a86f0,#0070E0)', color: '#FFFFFF',
                fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: lg.exporting ? 'progress' : !lg.total ? 'not-allowed' : 'pointer' } }, lg.exporting ? 'Exporting…' : 'Export CSV')
          ]),
          h('span', { key: 's', role: 'status', style: { fontSize: 12.5, color: lg.err ? '#B21E1E' : '#5A6675' } },
            lg.err ? lg.err : lg.busy && !entries.length ? 'Loading…' : lg.total == null ? '' : 'Showing ' + entries.length.toLocaleString('en-IN') + ' of ' + lg.total.toLocaleString('en-IN') +
              ' · newest first · times in your time zone · warnings and errors only; passwords, keys, email addresses and phone numbers are masked on the box · kept ' + (lg.keptDays || 90) + ' days'),
          h('div', { key: 'l', role: 'log', 'aria-label': 'Device log lines', style: { maxHeight: 460, overflow: 'auto', borderRadius: 12, background: '#0C1B2E', padding: '10px 14px',
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace', fontSize: 12.5, lineHeight: 1.65 } },
            entries.length ? entries.map((x, i) => h('div', { key: i, style: { display: 'grid', gridTemplateColumns: s.w < 760 ? '1fr' : '128px 70px 190px minmax(0,1fr)', columnGap: 12, padding: '3px 0',
              borderBottom: '1px solid rgba(255,255,255,.06)' } }, [
              h('span', { key: 't', style: { color: '#8FA3BF', whiteSpace: 'nowrap' } }, fmtLog.format(new Date(x.at))),
              h('span', { key: 'v', style: { color: (LVL[x.level] || [x.level, '#E6ECF3'])[1], fontWeight: 600 } }, (LVL[x.level] || [x.level])[0]),
              h('span', { key: 'u', title: (SRC[x.source] || x.source) + ' · ' + x.unit, style: { color: '#9CC3F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, x.unit || SRC[x.source] || x.source),
              h('span', { key: 'm', style: { color: '#E6ECF3', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' } }, x.message)
            ]))
              : h('div', { style: { color: '#8FA3BF', fontFamily: 'Poppins,sans-serif', fontSize: 13, padding: '18px 4px' } },
                lg.busy ? 'Loading…' : lg.err ? 'The log lines could not be loaded.' : !logsReady
                  ? 'This box runs agent ' + ((dv && dv.agentVersion) || 'older than 0.2.3') + '. Device logs need agent 0.2.3 or later: on the box run sudo bash ./setup-device.sh --upgrade in the agent folder.'
                  : 'No warnings or errors in this period.')),
          entries.length && lg.total > entries.length
            ? h('div', { key: 'm', style: { display: 'flex', justifyContent: 'center' } }, logBtn('more', lg.busy ? 'Loading…' : 'Load 200 more', () => this.loadLogs(d, {}, true))) : null
        ]);
      // full readings: whole readings as the box sent them, for any period of the last 90 days, newest first, 20 per page;
      // each one readable (labelled sections, every field the box sent: readingView.js) or as JSON, and downloadable as either
      const rd = this.rdOf(d), rdEntries = rd.entries || [], asJson = rd.view === 'json';
      if (can.fullReading && !rd.entries && !rd.busy && !rd.err) this.once('rd:' + d.id, () => this.loadReadings(d));
      const fmtRd = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
      const rdOpen = (x, i) => rd.open[x.sentAt] ?? i === 0;           // the newest is open until closed
      const allOpen = rdEntries.length > 0 && rdEntries.every(rdOpen);
      const stamp = iso => String(iso).slice(0, 19).replace(/[:T]/g, '-');
      const rdTitle = d.name && d.name !== d.id ? d.name + ' (' + d.id + ')' : d.id;
      const rdName = (one, ext) => d.id + (one ? '-reading-' + stamp(one.sentAt) : '-readings-' + stamp(rdEntries[rdEntries.length - 1].sentAt) + '-to-' + stamp(rdEntries[0].sentAt)) + ext;
      const saveRdText = list => this.saveText(rdName(list.length === 1 && list, '.txt'), readingText(list, { title: rdTitle, th: TH }));
      const smallBtn = (key, label, onClick, extra) => h('button', { key, type: 'button', onClick, ...extra, style: { height: 30, padding: '0 12px', borderRadius: 8, border: '1px solid #C9D6E8',
        background: '#FFFFFF', color: '#005BB8', fontFamily: 'Poppins,sans-serif', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' } }, label);
      const dlBtn = (key, label, onClick, primary) => h('button', { key, type: 'button', disabled: !rdEntries.length, onClick,
        style: { height: 38, padding: '0 16px', borderRadius: 10, border: primary ? 0 : '1px solid #C9D6E8', background: !rdEntries.length ? (primary ? '#AEB6C2' : '#FFFFFF') : primary ? 'linear-gradient(180deg,#1a86f0,#0070E0)' : '#FFFFFF',
          color: primary ? '#FFFFFF' : !rdEntries.length ? '#AEB6C2' : '#005BB8', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: !rdEntries.length ? 'not-allowed' : 'pointer' } }, label);
      const fgOf = tn => tn && TONE[tn] ? TONE[tn][0] : '#1A1E26';
      // one reading in a few short lines (review, 6 Nov 2026); every value is in the JSON view and the downloads
      const summaryEl = lines => h('dl', { key: 'v', style: { margin: 0, padding: '10px 14px 12px', background: '#FFFFFF', display: 'grid', gridTemplateColumns: 'minmax(0, 110px) minmax(0, 1fr)',
        columnGap: 14, rowGap: 6, fontSize: 13, lineHeight: 1.45 } },
        lines.flatMap((x, i) => [
          h('dt', { key: 'k' + i, style: { color: '#5A6675' } }, x.label),
          h('dd', { key: 'v' + i, style: { margin: 0, color: x.tone === 'muted' ? '#5A6675' : fgOf(x.tone), fontWeight: x.tone === 'warn' || x.tone === 'crit' ? 600 : 400, overflowWrap: 'anywhere' } }, x.text)]));
      const readingEl = !can.fullReading
        ? h('span', { style: { fontSize: 13, color: '#5A6675', fontFamily: 'Poppins,sans-serif' } }, 'Only support and admin users can view the full readings.')
        : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Poppins,sans-serif' } }, [
          ...periodEl(rd, x => this.setRd(d, x), p => this.loadReadings(d, p)),
          h('div', { key: 'f', style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' } }, [
            h('div', { key: 'vw', role: 'group', 'aria-label': 'Show readings as', style: { display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: '#F5F7FA', boxShadow: 'inset 0 0 0 1px #E4E9F0' } },
              [['readable', 'Readable'], ['json', 'JSON']].map(([k, label]) => h('button', { key: k, type: 'button', 'aria-pressed': rd.view === k ? 'true' : 'false', onClick: () => this.setRd(d, { view: k }),
                style: { height: 30, padding: '0 14px', border: 0, borderRadius: 8, background: rd.view === k ? '#FFFFFF' : 'transparent', boxShadow: rd.view === k ? '0 1px 3px rgba(16,42,84,.16)' : 'none',
                  color: rd.view === k ? '#005BB8' : '#3B4552', fontFamily: 'Poppins,sans-serif', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' } }, label))),
            logBtn('rl', rd.busy ? 'Loading…' : 'Refresh', () => this.loadReadings(d, {})),
            logBtn('ex', allOpen ? 'Collapse all' : 'Expand all', () => this.setRd(d, { open: Object.fromEntries(rdEntries.map(x => [x.sentAt, !allOpen])) })),
            dlBtn('dt', 'Download full details (.txt)', () => saveRdText(rdEntries), true),
            dlBtn('dj', 'Download shown (JSON)', () => this.saveJson(rdName(null, '.json'), rdEntries))
          ]),
          h('span', { key: 's', role: 'status', style: { fontSize: 12.5, color: rd.err ? '#B21E1E' : '#5A6675' } },
            rd.err ? rd.err : rd.busy && !rdEntries.length ? 'Loading…' : rd.total == null ? '' : 'Showing ' + rdEntries.length.toLocaleString('en-IN') + ' of ' + rd.total.toLocaleString('en-IN') +
              ' · newest first · times in your time zone · ' + (asJson ? 'exactly as the box sent it' : 'a short summary of each reading; the JSON view and the downloads have every value')),
          h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 8 } },
            rdEntries.length ? rdEntries.map((x, i) => {
              const open = rdOpen(x, i), v = readingView(x.reading, { receivedAt: x.receivedAt, th: TH });
              return h('div', { key: x.sentAt, style: { borderRadius: 12, boxShadow: 'inset 0 0 0 1px #E4E9F0', overflow: 'hidden' } }, [
                h('div', { key: 'h', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F5F7FA' } }, [
                  h('span', { key: 't', style: { fontSize: 13.5, fontWeight: 600, color: '#1A1E26' } }, fmtRd.format(new Date(x.sentAt))),
                  h('span', { key: 'r', style: { flex: '1 1 200px', fontSize: 12.5, color: '#5A6675' } },
                    'received ' + fmtRd.format(new Date(x.receivedAt)) + ' · ' + (JSON.stringify(x.reading).length / 1024).toFixed(1) + ' KB'),
                  smallBtn('o', open ? 'Hide' : 'Show', () => this.setRd(d, { open: { ...rd.open, [x.sentAt]: !open } }), { 'aria-expanded': open ? 'true' : 'false' }),
                  smallBtn('st', 'Download .txt', () => saveRdText([x]), { 'aria-label': 'Download this reading as readable text' }),
                  smallBtn('sj', 'Download .json', () => this.saveJson(rdName(x, '.json'), x.reading), { 'aria-label': 'Download this reading as JSON' }),
                  v.glance.length ? h('div', { key: 'g', style: { flexBasis: '100%', display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12.5, color: '#3B4552' } },
                    v.glance.map((g, j) => h('span', { key: j }, [g.label + ' ', h('b', { key: 'b', style: { fontWeight: 600, color: g.tone && g.tone !== 'ok' ? fgOf(g.tone) : '#1A1E26' } }, g.value)]))) : null
                ]),
                !open ? null : asJson
                  ? h('pre', { key: 'p', style: { margin: 0, padding: '12px 14px', background: '#0C1B2E', color: '#E6ECF3', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
                    fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } }, JSON.stringify(x.reading, null, 2))
                  : summaryEl(readingSummary(x.reading, { th: TH }))
              ]);
            })
              : h('div', { style: { color: '#5A6675', fontSize: 13, padding: '12px 4px' } }, rd.busy ? 'Loading…' : rd.err ? 'The readings could not be loaded.' : 'No readings in this period.')),
          rdEntries.length && rd.more
            ? h('div', { key: 'm', style: { display: 'flex', justifyContent: 'center' } }, logBtn('more', rd.busy ? 'Loading…' : 'Load 20 more', () => this.loadReadings(d, {}, true))) : null
        ]);
      // hourly, agent 0.2.2+: failed services, kernel faults, memory kills, crash dumps, unclean shutdown (counts only)
      const fl = dv && dv.faults, kc = (fl && fl.kernel_error_counts) || {}, units = (fl && fl.failed_units) || [];
      const fmtShut = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ });
      const KIND = { io_error: 'disk I/O', fs_error: 'file system', hardware_error: 'hardware', nvme_error: 'NVMe', mmc_error: 'SD/eMMC', under_voltage: 'under-voltage', thermal: 'overheating' };
      const fTone = !fl ? 'muted' : fl.unclean_shutdown || fl.kernel_errors_24h ? 'crit' : fl.failed_units_count || fl.oom_kills_24h || fl.coredumps_24h ? 'warn' : 'ok';
      const faults = G('stats', 'Failures & crash signs', I.alert, { ...wide,
        ...aside(!fl ? 'Needs agent 0.2.2 or later' : (fTone === 'ok' ? 'None · checked ' : 'Checked ') + ago(dv.hourlyAt), fTone),
        items: !fl
          ? [st('Failures', 'Not reported', 'This box runs an older agent', I.alert, 'muted', 'Update the box agent to 0.2.2 (setup-device.sh --upgrade) to see failures and crash signs here.')]
          : [st('Failed services', fl.failed_units_count, units.slice(0, 3).join(', ') + (units.length > 3 ? ' …' : ''), I.svc, fl.failed_units_count ? 'warn' : 'none',
              'System services in the failed state on the box' + (units.length ? ': ' + units.join(', ') : '.')),
            st('Kernel faults (24 h)', fl.kernel_errors_24h, Object.entries(kc).filter(([k]) => k !== 'oom_kill').map(([k, v]) => (KIND[k] || k) + ' ' + v).join(', ') || 'None',
              I.bug, fl.kernel_errors_24h ? 'crit' : 'none',
              'Disk, file-system, hardware, NVMe, SD/eMMC, under-voltage and overheating messages in the kernel log of the last 24 hours. Only the counts leave the box, never the log text.'),
            st('Out-of-memory kills (24 h)', fl.oom_kills_24h, fl.oom_kills_24h ? 'A program was stopped: memory ran out' : '', I.mem, fl.oom_kills_24h ? 'warn' : 'none',
              'Programs the kernel stopped because the box ran out of memory.'),
            st('Crash dumps (24 h)', fl.coredumps_24h, '', I.bug, fl.coredumps_24h ? 'warn' : 'none', 'Programs that crashed and left a core dump.'),
            st('Last shutdown', fl.last_shutdown_at ? fmtShut.format(new Date(fl.last_shutdown_at)) : null,
              fl.unclean_shutdown ? 'Not shut down properly' : fl.last_shutdown_at || fl.unclean_shutdown == null ? '' : 'Needs agent 0.2.5', I.power,
              fl.unclean_shutdown ? 'crit' : 'none', 'When the box last went down (switched off, restarted or lost power), from its own log. Marked when it was not shut down properly, e.g. a power cut or a crash.')] });
      return [
        faults,
        G('kv', 'Clock', I.clock, { ...aside(clk.ntpSynced === false ? 'Not synchronised' : clk.corrected ? 'Corrected' : 'OK', clk.ntpSynced === false || clk.corrected ? 'warn' : 'ok'), items: [
          kvI('Synchronised with a time server', yes(clk.ntpSynced), clk.ntpSynced === false ? 'warn' : null),
          kvI('Box clock against the server', clk.offsetS == null ? null : Math.abs(clk.offsetS) < 60 ? 'Within a minute' : (clk.offsetS > 0 ? 'Behind by ' : 'Ahead by ') + durS(Math.abs(Math.round(clk.offsetS)))),
          kvI('Reading times', clk.corrected ? 'Placed using the server clock' : 'As recorded by the box'),
          kvI('Reading interval', everyText), kvI('Agent version', dv && dv.agentVersion)
        ] }),
        G('kv', 'Collector notes', I.bug, { ...aside(notes.length ? notes.length + (notes.length === 1 ? ' note' : ' notes') : 'All collectors OK', notes.length ? 'warn' : 'ok'),
          items: notes.length ? notes.map(([k, x]) => kvI(k.replace(/_/g, ' '), x != null && typeof x === 'object' ? JSON.stringify(x) : x)) : [kvI('Status', 'Every collector reported normally')] }),
        G('custom', 'Full readings', I.log, { ...wide, ...aside(rd.total == null ? (rd.err ? 'Not loaded' : 'Loading') : rd.total.toLocaleString('en-IN') + (rd.total === 1 ? ' reading' : ' readings'), rd.err ? 'warn' : 'info'), el: readingEl }),
        G('custom', 'Device logs', I.log, { ...wide, ...aside(!logsReady ? 'Needs agent 0.2.3 or later' : lg.total == null ? 'Loading' : lg.total.toLocaleString('en-IN') + (lg.total === 1 ? ' line' : ' lines'),
          !logsReady ? 'muted' : (lg.entries || []).some(x => x.level === 'critical') ? 'crit' : (lg.entries || []).some(x => x.level === 'error') ? 'warn' : 'info'), el: logsEl })
      ];
    };
    const svcBad = ((dv && dv.services) || []).filter(x => x.watched && (x.status === 'down' || x.status === 'degraded')).length;
    const hwFlags = off || !dv ? 0 : hwTone.filter(t => t === 'warn' || t === 'crit').length;
    // the Patches tab (clients only, 24 Nov 2026) and its badge: patches not installed on this box (warning), failed or with a problem (critical)
    if (can.patchList && !this.patchesOf(d).data && !this.patchesOf(d).busy && !this.patchesOf(d).denied) this.once('patches:' + d.id, () => this.loadPatches(d));
    const ptCnt = ((this.patchesOf(d).data || {}).counts) || {}, ptBadge = (ptCnt.pending || 0) + (ptCnt.failed || 0);
    const TABS = [['overview', 'Overview', I.info], ['hardware', 'Hardware health', I.cpu, hwFlags, hwTone.includes('crit') ? 'crit' : 'warn'], ['storage', 'Storage', I.disk], ['services', 'Services', I.svc, svcBad, 'crit'], ['software', 'Software', I.sw], ['sync', 'Synchronization', I.sync], ...(dv && dv.ai ? [['ai', 'AI workload', I.ai]] : []), ...(d.product === 'Proctor in a Box' || (dv && dv.cameras) ? [['cameras', 'Cameras', I.cam]] : []), ['alerts', 'Alerts', I.alert, openAlerts.length, openAlerts.some(a => a.sev === 'Critical') ? 'crit' : 'warn'], ['diagnostics', 'Diagnostics', I.tool], ...(can.patchList ? [['patches', 'Patches', I.up, ptBadge, ptCnt.failed ? 'crit' : 'warn']] : [])];
    const cur = TABS.some(t => t[0] === tabKey) ? tabKey : 'overview';
    const hh = React.createElement;
    const groups = dv ? build[cur]()
      : s.detailErr ? [G('custom', 'Could not load this device', I.alert, { ...wide, el: hh('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontFamily: 'Poppins,sans-serif' } }, [
        hh('span', { key: 't', style: { fontSize: 13.5, color: '#B21E1E' } }, s.detailErr),
        hh('button', { key: 'b', type: 'button', onClick: () => this.loadDevice(d.id), style: { height: 38, padding: '0 16px', borderRadius: 10, border: '1px solid #C9D6E8', background: '#FFFFFF', color: '#005BB8', fontFamily: 'Poppins,sans-serif', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' } }, 'Try again')]) })]
      : [G('custom', 'Loading', I.clock, { ...wide, el: hh('span', { style: { fontSize: 13.5, color: '#5A6675', fontFamily: 'Poppins,sans-serif' } }, 'Loading device data…') })];
    const tabs = TABS.map(([k, label, icon, badge, bt], i) => { const sel = k === cur; return { tid: 'dtab-' + k, label, icon, sel: sel ? 'true' : 'false', tab: sel ? 0 : -1, fg: sel ? '#005BB8' : '#5A6675', line: sel ? '#0070E0' : 'transparent', pick: go(k),
      badge: badge || '', badgeDisplay: badge ? 'inline-flex' : 'none', soonDisplay: 'none', badgeBg: TONE[bt || 'info'][1], badgeFg: TONE[bt || 'info'][0],
      key: e => { const n = TABS.length; let j = null; if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1; if (j == null) return; e.preventDefault(); this.setState({ dTab: TABS[j][0], diagFrom: null }); setTimeout(() => { const el = document.getElementById('dtab-' + TABS[j][0]); el && el.focus(); }, 0); } }; });

    const nav = list.some(x => x.id === d.id) ? list : DEVICES, ni = nav.findIndex(x => x.id === d.id);
    const firstCrit = devAlerts.find(a => a.state === 'Active' && a.sev === 'Critical' && !isAcked(a));
    const offDays = Math.floor((seenMs || 0) / 86400000);
    const banner = never ? ['Registered and waiting for the first reading. Install the agent on the box with the command and ' + secret + ' shown at registration.', 'info', I.info]
      : off && d.switchedOff ? [(d.switchedOff.kind === 'reboot' ? 'Restarting since ' : 'Switched off at ') + at(d.switchedOff.at) + ' (a normal shutdown; the box said so). It shows Online again with its first reading after it starts; this page shows the last data received.', 'info', I.power]
      : off ? [d.dataLossRisk ? 'No contact for ' + offDays + ' days. The box keeps unsent readings for about 15 days, so the oldest ones will soon be deleted on the box. Reconnect it as soon as possible.'
        : 'No contact since ' + at(d.lastSeenAt) + '. The box may still be running without internet (its readings stay on it and are uploaded when it reconnects) or be off; this page shows the last data received.', 'crit', I.net]
      : firstCrit ? ['Critical: ' + firstCrit.title + (firstCrit.detail ? ' (' + firstCrit.detail + ')' : '') + '. Review the Alerts and Services tabs.', 'crit', I.alert]
      : clk.corrected ? ['This box\'s clock is off by about ' + durS(Math.abs(Math.round(clk.offsetS))) + '. Reading times are placed using the server clock.', 'info', I.clock] : null;
    return {
      isDetail: true, dashDisplay: 'none', dtBack: () => { this.setState({ detail: null, catType: null, f: { ...EMPTY_F }, q: '', page: 1, open: null }); window.scrollTo({ top: 0 }); },
      dt: { id: d.id, title: d.name || d.id, idSub: d.name && d.name !== d.id ? 'Device ID ' + d.id : '', r, groups, glance, tabs, tabId: 'dtab-' + cur, offline: off,
        crumbTypeDisplay: s.catType ? 'flex' : 'none',
        crumbTypeLabel: s.catType === '__all' ? 'All devices' : (s.catType || ''),
        crumbTypeBack: () => { this.setState({ detail: null, open: null }); window.scrollTo({ top: 0 }); },
        heroCols: s.w >= 1000 ? '200px minmax(0,1fr) auto' : s.w >= 640 ? '180px minmax(0,1fr)' : 'minmax(0,1fr)',
        pos: (ni + 1) + ' of ' + nav.length, prev: () => this.openDevice(nav[(ni - 1 + nav.length) % nav.length].id, cur), next: () => this.openDevice(nav[(ni + 1) % nav.length].id, cur),
        patchBg: r.hcDisabled ? '#EEF1F4' : 'linear-gradient(180deg,#1a86f0,#0070E0)', patchFg: r.hcDisabled ? '#5A6675' : '#FFFFFF',
        bannerDisplay: banner ? 'flex' : 'none', banner: banner ? banner[0] : '', bannerFg: banner ? TONE[banner[1]][0] : '', bannerBg: banner ? TONE[banner[1]][1] : '', bannerBorder: banner ? (banner[1] === 'crit' ? '#F5C2C2' : '#CFE0F5') : '', bannerIcon: banner ? banner[2] : '' }
    };
  }
  alertVals(s, now) {
    const acked = s.acked || {}, can = (s.me && s.me.can) || {};
    const isAcked = a => a.acked || !!acked[a.id];
    const active = ALERTS.filter(a => a.state === 'Active' && !isAcked(a));
    const cnt = k => active.filter(a => a.sev === k).length;
    const started = a => Date.parse(a.startedAt);
    const deco = a => { const v = SEV[a.sev]; const done = isAcked(a), closed = !done && a.state === 'Resolved';
      return { ...a, bg: v.bg, fg: v.fg, icon: v.icon, rel: rel(Date.now() - started(a)), abs: fmtFull.format(new Date(started(a))),
        aria: 'View details for ' + a.device, view: () => this.openDevice(a.device, 'alerts'),
        acked: done, ackDisplay: done || closed ? 'inline-flex' : 'none', ackBtnDisplay: done || closed || !can.ack ? 'none' : 'flex',
        badgeText: done ? 'Acknowledged' : a.oneShot ? 'Event' : 'Resolved', badgeBg: done ? '#E7F6EC' : '#EEF2F7', badgeFg: done ? '#0E7A36' : '#5A6675',
        cardBg: done || closed ? '#FBFCFD' : '#FFFFFF', cardBorder: done || closed ? '#E4E9F0' : (a.sev === 'Critical' ? '#F3C7C7' : '#E4E9F0'), ackLabel: done ? 'Acknowledged' : 'Acknowledge', ackFg: done ? '#0E7A36' : '#1A1E26', ackCursor: done ? 'default' : 'pointer',
        ackAria: done ? a.title + ' on ' + a.device + ' acknowledged' : 'Acknowledge ' + a.title + ' on ' + a.device,
        ack: () => { if (!done && !closed) this.ackAlert(a); } }; };
    const tab = s.alertTab || 'All', aq = (s.alertQ || '').trim().toLowerCase();
    const dFrom = s.alertFrom || '', dTo = s.alertTo || '';
    const fromMs = dFrom ? new Date(dFrom + 'T00:00:00').getTime() : null;
    const toMs = dTo ? new Date(dTo + 'T23:59:59.999').getTime() : null;
    const inRange = a => { const t = started(a); return (fromMs == null || t >= fromMs) && (toMs == null || t <= toMs); };
    const filtered = ALERTS.filter(a => (tab === 'All' || a.sev === tab) && (!aq || (a.title + ' ' + a.device + ' ' + (a.deviceName || '') + ' ' + a.customer + ' ' + (a.detail || '')).toLowerCase().includes(aq)) && inRange(a));
    const shown = s.alertShown || 12;
    const top = active.find(a => a.sev === 'Critical') || active[0];
    const latest = top ? deco(top) : { title: 'No active alerts', device: 'all clear', rel: rel(Date.now() - (s.lastFetch || Date.now())), detail: '', aria: 'No active alerts', view: () => this.openAlerts('All') };
    const tone = { Critical: ['#FEECEC', '#B21E1E'], Warning: ['#FEF3E2', '#8A5200'], Info: ['#EEF2F7', '#005BB8'], All: ['#EEF2F7', '#005BB8'] };
    return {
      activeCount: active.length,
      sevChips: ['Critical', 'Warning', 'Info'].map(k => ({ label: k, count: cnt(k), bg: tone[k][0], fg: tone[k][1], icon: SEV[k].icon, aria: 'View ' + cnt(k) + ' ' + k.toLowerCase() + ' alerts', open: () => this.openAlerts(k) })),
      latest,
      openAlerts: () => this.openAlerts('All'), closeAlerts: this.closeAlerts,
      alertsDisplay: s.alertsOpen ? 'block' : 'none', panelAnim: s.alertsOpen ? 'slideIn .28s cubic-bezier(.22,1,.36,1)' : 'none',
      panelSub: active.length + ' active · ' + cnt('Critical') + ' critical · newest first',
      tabPillX: 'translateX(' + (['All', 'Critical', 'Warning', 'Info'].indexOf(tab) * 100) + '%)',
      panelTabs: ['All', 'Critical', 'Warning', 'Info'].map((k, i, arr) => { const on = tab === k; return { label: k, count: k === 'All' ? active.length : cnt(k), sel: on ? 'true' : 'false', tab: on ? 0 : -1,
        fg: on ? '#0070E0' : '#5A6675', weight: on ? 600 : 500, countBg: tone[k][0], countFg: tone[k][1],
        pick: () => this.setState({ alertTab: k, alertShown: 12 }),
        key: e => { const m = { ArrowRight: (i + 1) % 4, ArrowLeft: (i + 3) % 4, Home: 0, End: 3 }[e.key]; if (m === undefined) return; e.preventDefault(); this.setState({ alertTab: arr[m], alertShown: 12 }); setTimeout(() => { const t = document.querySelectorAll('[aria-label="Alert severity"] [role=tab]')[m]; t && t.focus(); }, 0); } }; }),
      alertQ: s.alertQ || '', onAlertQ: e => this.setState({ alertQ: e.target.value, alertShown: 12 }),
      dateFrom: dFrom, dateTo: dTo, dateMax: isoLocal(),
      dateRange: React.createElement(this.drp(), { value: { from: dFrom, to: dTo }, max: isoLocal(), onChange: (f, t) => this.setState({ alertFrom: f, alertTo: t, alertShown: 12 }) }),
      onDateFrom: e => this.setState({ alertFrom: e.target.value, alertShown: 12 }),
      onDateTo: e => this.setState({ alertTo: e.target.value, alertShown: 12 }),
      clearDates: () => this.setState({ alertFrom: '', alertTo: '', alertShown: 12 }),
      clearDatesDisplay: (dFrom || dTo) ? 'inline-flex' : 'none',
      datePresets: (() => {
        const today = isoLocal();
        const defs = [['Today', 0], ['Last 7 days', 6], ['Last 30 days', 29]];
        return defs.map(([label, back]) => {
          const from = isoLocal(new Date(Date.now() - back * 86400000));
          const on = dFrom === from && dTo === today;
          return { label, on: on ? 'true' : 'false',
            bg: on ? '#E6F0FC' : '#FFFFFF', fg: on ? '#005BB8' : '#5A6675', border: on ? '#0070E0' : '#D5DBE4',
            pick: () => this.setState({ alertFrom: from, alertTo: today, alertShown: 12 }) };
        });
      })(),
      panelGroups: (() => { const vis = filtered.slice(0, shown).map(deco);
        const DAY = 86400000, startOf = t => { const x = new Date(t); x.setHours(0, 0, 0, 0); return x.getTime(); };
        const today0 = startOf(Date.now());
        const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const order = [], map = {};
        vis.forEach(a => { const t = started(a), d0 = startOf(t);
          const label = d0 === today0 ? 'Today' : d0 === today0 - DAY ? 'Yesterday' : fmt.format(t);
          if (!map[label]) { map[label] = { label, key: d0, items: [] }; order.push(map[label]); }
          map[label].items.push(a); });
        return order.sort((a, b) => b.key - a.key).map(g => ({ label: g.label, count: g.items.length, items: g.items })); })(),
      panelEmptyDisplay: filtered.length ? 'none' : 'flex',
      panelEmpty: filtered.length ? null : this.empty(aq || dFrom || dTo ? 'No alerts match' : 'No alerts', aq || dFrom || dTo ? 'Try another severity, search term or date range.' : 'Alerts from the last 30 days appear here.'),
      panelRange: 'Showing ' + Math.min(shown, filtered.length) + ' of ' + filtered.length + ' alerts',
      noMore: shown >= filtered.length, loadMoreFg: shown >= filtered.length ? '#8A93A2' : '#005BB8', loadMoreCursor: shown >= filtered.length ? 'not-allowed' : 'pointer',
      loadMore: () => this.setState({ alertShown: shown + 12 })
    };
  }
  renderVals() {
    const s = this.state;
    const isDash = s.screen === 'dash';
    const now = s.now;
    const trig = (open) => ({ bg: open ? 'rgba(255,255,255,.26)' : 'rgba(255,255,255,.08)', ring: open ? '0 0 0 3px rgba(255,255,255,.35)' : 'none' });

    const unread = NOTIFS.filter(n => !s.read[n.id]).length;
    const nt = trig(s.open === 'notif'), pt = trig(s.open === 'profile');

    const q = s.q.trim().toLowerCase();
    const devFrom = s.devFrom ? new Date(s.devFrom + 'T00:00:00').getTime() : null;
    const devTo = s.devTo ? new Date(s.devTo + 'T23:59:59').getTime() : null;
    const list = DEVICES.filter(d => FILTER_DEFS.every(fd => s.f[fd.key] === 'All' || (fd.key === 'status' && s.f.status === 'Online' ? REPORTING(d) : d[fd.key] === s.f[fd.key]))
      && (!q || [d.id, d.name, d.serial, d.customer, d.site, d.location, d.os, ...(d.macs || [])].join(' ').toLowerCase().includes(q))
      && (devFrom == null || (d.seenAgo != null && (now - d.seenAgo) >= devFrom))
      && (devTo == null || (d.seenAgo != null && (now - d.seenAgo) <= devTo)));
    const cardsView = (s.view || 'cards') === 'cards';
    const PAGE = cardsView ? 12 : 10;
    const pageCount = Math.max(1, Math.ceil(list.length / PAGE));
    const page = Math.min(s.page, pageCount);
    const slice = list.slice((page - 1) * PAGE, page * PAGE);

    const TH = s.thresholds || DEFAULT_TH;
    const cell = (v, warn, crit, unit, name) => {
      if (v == null) return { t: '—', fg: '#5A6675', w: 400, title: 'No current reading' };
      if (crit != null && v >= crit) return { t: v + unit + ' ▲▲', fg: '#B21E1E', w: 600, title: name + ' above critical threshold (' + crit + unit + ')' };
      if (warn != null && v >= warn) return { t: v + unit + ' ▲', fg: '#8A5200', w: 600, title: name + ' above warning threshold (' + warn + unit + ')' };
      return { t: v + unit, fg: '#1A1E26', w: 400, title: '' };
    };
    const mkRow = d => {
      const st = STATUS[d.status] || STATUS.Offline, c = cell(d.cpu, TH.cpu.warn, TH.cpu.crit, '%', 'CPU'), g = cell(d.gpu, TH.gpuTemp.warn, TH.gpuTemp.crit, ' °C', 'GPU temperature'), so = cell(d.st, TH.disk.warn, TH.disk.crit, '%', 'Storage');
      const bar = (v, c2) => ({ w: v == null ? '0%' : Math.min(100, v) + '%', c: c2.fg === '#1A1E26' ? '#0070E0' : c2.fg === '#8A5200' ? '#F59E0B' : '#DC2626' });
      const cb = bar(d.cpu, c), gb = bar(d.gpu, g), sb = bar(d.st, so), code = pictureCode(d.typeCode);
      const pm = productMeta(d.product);
      const flags = [c, g, so].filter(t => t.fg === '#8A5200' || t.fg === '#B21E1E');
      const anyCrit = flags.some(t => t.fg === '#B21E1E');
      const offline = d.status === 'Offline', never = d.status === 'Never seen', locked = d.status === 'Revoked';   // a patch is uploaded and e-mailed, so an offline box can get one
      const age = d.seenAgo == null ? null : d.seenAgo + Math.max(0, Date.now() - (s.lastFetch || Date.now()));
      const health = never ? { t: 'Waiting for first reading', fg: '#5A6675', i: STATUS['Never seen'].icon }
        : offline && d.switchedOff ? { t: (d.switchedOff.kind === 'reboot' ? 'Restarting · since ' : 'Switched off · ') + fmtT.format(new Date(d.switchedOff.at)), fg: '#5A6675', i: STATUS.Offline.icon }
        : offline ? { t: d.dataLossRisk ? 'No contact · readings at risk' : 'No contact · readings kept on box', fg: d.dataLossRisk ? '#B21E1E' : '#5A6675', i: STATUS.Offline.icon }
        : d.cpu == null ? { t: 'No current reading', fg: '#5A6675', i: STATUS.Offline.icon }
        : flags.length ? { t: flags.length + ' above threshold', fg: anyCrit ? '#B21E1E' : '#8A5200', i: STATUS.Warning.icon }
        : d.openAlerts ? { t: 'Online · ' + d.openAlerts + ' open alert' + (d.openAlerts > 1 ? 's' : ''), fg: d.status === 'Critical' ? '#B21E1E' : '#8A5200', i: STATUS.Warning.icon }
        : { t: 'Online · all within limits', fg: '#0E7A36', i: 'M20 6 9 17l-5-5' };
      // the support engineer opens the upload; a client the box's Patches tab, with its patches pending; an admin has no patch button
      const canPatchCard = !!(s.me && s.me.can && s.me.can.patch), listCard = !!(s.me && s.me.can && s.me.can.patchList);
      const pend = listCard ? d.patchesPending || 0 : 0, ptLocked = canPatchCard && locked;
      const ptLabel = canPatchCard ? 'Update patch' : pend ? pend + (pend === 1 ? ' patch pending' : ' patches pending') : 'Patches';
      return { ...d, status: stText(d), cardId: 'card-' + d.id,
        dot: STATUS_DOT[d.status] || '#8A93A2',
        healthText: health.t, healthFg: health.fg, healthIcon: health.i,
        hcLabel: ptLabel, hcIcon: 'M12 3v12M7 10l5 5 5-5M5 21h14', hcAnim: 'none', hcDisabled: ptLocked, hcDisplay: canPatchCard || listCard ? undefined : 'none',
        hcFg: ptLocked ? '#5A6675' : pend ? '#8A5200' : '#005BB8', hcCursor: ptLocked ? 'not-allowed' : 'pointer',
        hcAria: ptLocked ? 'Update patch unavailable for ' + d.id : (canPatchCard ? 'Update patch on ' : 'Patches of ') + d.id + (pend ? ' (' + pend + ' pending)' : ''),
        hcNote: never ? 'No reading yet' : 'Last reading · ' + rel(age),
        hcRun: () => { if (ptLocked) return; if (canPatchCard) this.openPatch(d); else this.openDevice(d.id, 'patches'); },
        app: d.app, dJON: code === 'JON' ? 'block' : 'none', dTHR: code === 'THR' ? 'block' : 'none', dDGX: code === 'DGX' ? 'block' : 'none', dRPI: code === 'RPI' ? 'block' : 'none', brand: code === 'RPI' || code === 'UNK' ? '' : 'NVIDIA ',
        illoAlt: (code === 'RPI' ? 'Raspberry Pi 5' : code === 'UNK' ? 'Edge device' : 'NVIDIA ' + d.type) + ' illustration', productIcon: pm.icon, productShort: pm.short,
        cpuBar: cb.w, cpuBarC: cb.c, gpuBar: gb.w, gpuBarC: gb.c, stBar: sb.w, stBarC: sb.c,
        sBg: st.bg, sFg: st.fg, sIcon: st.icon, seen: never ? 'Never' : rel(age), seenAbs: d.lastSeenAt ? fmtFull.format(new Date(d.lastSeenAt)) : 'No reading yet',
        cpu: c.t, cpuFg: c.fg, cpuW: c.w, cpuTitle: c.title, gpu: g.t, gpuFg: g.fg, gpuW: g.w, gpuTitle: g.title, st: so.t, stFg: so.fg, stW: so.w, stTitle: so.title,
        title: d.name || d.id, idSub: d.name && d.name !== d.id ? 'ID ' + d.id : '',   // the display name is the device's name; its ID is a detail
        openDetail: () => this.openDevice(d.id), detailAria: 'View details for ' + (d.name || d.id) };
    };
    const rows = slice.map(mkRow);

    const counts = { Online: 0, Warning: 0, Critical: 0, Offline: 0, 'Never seen': 0 };
    DEVICES.forEach(d => { if (d.status in counts) counts[d.status]++; });
    counts.Online = DEVICES.filter(REPORTING).length;     // online = reporting; warning and critical boxes are online too
    const total = DEVICES.filter(d => d.status !== 'Revoked').length;
    const pctN = (n) => total ? Math.round(n / total * 100) : 0;
    const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
    const pct = (n) => pctN(n) + '% of fleet';
    const KPAL = { All: ['#E8F1FB', '#123C5A'], Online: ['#E4F4E9', '#136A2B'], Warning: ['#FBEFD7', '#7A4E06'], Critical: ['#FBE6E6', '#8F221C'], Offline: ['#EDF0F3', '#3E4B59'] };
    const mdef = [
      { key: 'All', label: 'Total devices', value: total, sub: plural(new Set(DEVICES.map(d => d.type)).size, 'device type') + ' · ' + plural(CUSTOMERS.length, 'customer') + (counts['Never seen'] ? ' · ' + counts['Never seen'] + ' awaiting first reading' : ''), pctN: 100, icon: 'M4 4h16v12H4zM8 20h8M12 16v4' },
      { key: 'Online', label: 'Online', value: counts.Online, sub: pct(counts.Online), pctN: pctN(counts.Online), suffix: '/ ' + total },
      { key: 'Warning', label: 'Warning', value: counts.Warning, sub: pct(counts.Warning), pctN: pctN(counts.Warning), suffix: '/ ' + total },
      { key: 'Critical', label: 'Critical', value: counts.Critical, sub: pct(counts.Critical), pctN: pctN(counts.Critical), suffix: '/ ' + total },
      { key: 'Offline', label: OFF_LABEL, value: counts.Offline, sub: pct(counts.Offline), pctN: pctN(counts.Offline), suffix: '/ ' + total }
    ];
    const metrics = mdef.map((m, i) => {
      const on = s.f.status === m.key && (m.key !== 'All' || Object.values(s.f).every(v => v === 'All'));
      const sm = STATUS[m.key], pal = KPAL[m.key] || KPAL.All, pv = Math.max(0, Math.min(100, m.pctN));
      return { ...m, icon: m.icon || sm.icon, bg: pal[0], c: pal[1],
        border: on ? pal[1] : 'rgba(228,231,236,.7)',
        selDisplay: on ? 'flex' : 'none', arrowDisplay: on ? 'none' : 'flex',
        circleBg: 'rgba(255,255,255,.85)', circleC: pal[1], hdrPad: on ? '72px' : '0', subC: pal[1],
        pillTo: pal[1] + 'CC', pillGlow: pal[1] + '66', pillHi: pal[1] + 'E6',
        trackBg: 'rgba(255,255,255,.6)', fillC: pal[1],
        pctW: pv + '%', pctLabel: pv + '%', suffix: m.suffix || '', suffixDisplay: m.suffix ? 'inline' : 'none',
        shadow: on ? '0 0 0 3px ' + pal[1] + '26, 0 10px 24px -10px ' + pal[1] + '66, 0 2px 6px -2px rgba(33,46,75,.06)' : '0 1px 2px rgba(33,46,75,.04), 0 2px 6px -2px rgba(33,46,75,.05)',
        anim: 'fadeUp .4s cubic-bezier(.22,1,.36,1) ' + (i * 0.06).toFixed(2) + 's both',
        pressed: on ? 'true' : 'false',
        aria: m.label + ', ' + m.value + ' devices. Show ' + (m.key === 'All' ? 'all devices' : m.label.toLowerCase() + ' devices'),
        pick: () => m.key === 'All' ? this.setState({ catType: '__all', f: { ...EMPTY_F }, page: 1 }) : this.setState({ catType: '__all', f: { ...EMPTY_F, status: m.key }, page: 1 }) };
    });

    const lockedType = s.catType && s.catType !== '__all' ? s.catType : null;   // on a device-type page only its own type is offered
    const filters = FILTER_DEFS.map(fd => {
      const val = s.f[fd.key], open = s.open === fd.key, active = val !== 'All';
      const opts = fd.key === 'type' && lockedType ? [lockedType] : ['All', ...fd.opts];
      return { key: fd.key, label: fd.label, open, menuDisplay: open ? 'flex' : 'none', labelId: 'fl-' + fd.key, valueId: 'fv-' + fd.key, ariaIds: 'fl-' + fd.key + ' fv-' + fd.key,
        display: active ? (val === 'Offline' ? OFF_LABEL : val) : 'All', expanded: open ? 'true' : 'false', chev: open ? 'rotate(180deg)' : 'none',
        border: open || active ? '#0070E0' : '#D5DBE4', bg: active ? '#EEF2F7' : '#FFFFFF', fg: active ? '#005BB8' : '#1A1E26',
        toggle: () => this.toggle(fd.key),
        options: opts.map(o => ({ label: o === 'All' ? 'All ' + fd.label.toLowerCase() + (fd.key === 'status' ? 'es' : 's') : o === 'Offline' ? OFF_LABEL : o, selected: o === val, sel: o === val ? 'true' : 'false',
          bg: o === val ? '#EEF2F7' : 'transparent', fg: o === val ? '#005BB8' : '#1A1E26', weight: o === val ? 600 : 400, pick: () => this.setF(fd.key, o) })) };
    });
    const chips = FILTER_DEFS.filter(fd => s.f[fd.key] !== 'All' && !(fd.key === 'type' && lockedType)).map(fd => ({ text: fd.label + ': ' + (s.f[fd.key] === 'Offline' ? OFF_LABEL : s.f[fd.key]), aria: 'Remove filter: ' + fd.label + ' ' + s.f[fd.key], remove: () => this.setF(fd.key, 'All') }));

    const CAT_META = { 'Jetson Orin Nano': 'Compact AI edge · 67 TOPS', 'AGX Thor': 'High-performance AI · Blackwell', 'DGX Spark': 'Desktop AI supercomputer', 'Raspberry Pi 5': 'ARM Cortex-A76 · lightweight' };
    const CAT_ICON = { JON: 'M4 7h16v10H4zM8 7V4h8v3M9 17v3M15 17v3', THR: 'M3 6h18v12H3zM7 18v2M17 18v2M7 10h4M7 13h7', DGX: 'M4 4h16v16H4zM4 9h16M9 4v16', RPI: 'M4 5h16v14H4zM8 9h.01M12 9h.01M16 9h.01M8 13h8' };
    const CAT_PRODUCT = { JON: 'Proctor in a Box', THR: 'SchoolAI in a Box', DGX: 'SchoolAI in a Box', RPI: 'Assessment in a Box' };
    const ackedCat = s.acked || {};
    const isOpen = a => a.state === 'Active' && !a.acked && !ackedCat[a.id];
    const topProduct = ds => { const n = {}; ds.forEach(d => { if (d.product && d.product !== '—') n[d.product] = (n[d.product] || 0) + 1; }); return Object.keys(n).sort((a, b) => n[b] - n[a])[0]; };
    const catTypes = [...TYPES, ...[...new Set(DEVICES.map(d => d.type))].filter(t => !TYPES.some(x => x[0] === t)).map(t => [t, pictureCode((DEVICES.find(d => d.type === t) || {}).typeCode || 'UNK')])];
    const categories = catTypes.map(([name, code]) => {
      const ds = DEVICES.filter(d => d.type === name);
      const c = { Online: 0, Warning: 0, Critical: 0, Offline: 0 };
      ds.forEach(d => { if (d.status in c) c[d.status]++; });
      c.Offline = ds.length - ds.filter(REPORTING).length;   // healthy + warning + critical + offline = devices
      const t2 = ds.length || 1, seg = k => (c[k] / t2 * 100).toFixed(2) + '%';
      const openA = ALERTS.filter(a => isOpen(a) && a.sev !== 'Info' && ds.some(d => d.id === a.device)).length;
      const nCust = new Set(ds.map(d => d.customer).filter(x => x && x !== '—')).size;
      return { name, code, product: topProduct(ds) || CAT_PRODUCT[code] || '—', blurb: CAT_META[name] || 'Other edge devices', icon: CAT_ICON[code] || CAT_ICON.JON, count: ds.length, customers: nCust,
        unitText: (ds.length === 1 ? 'device' : 'devices') + ' · ' + nCust + (nCust === 1 ? ' customer' : ' customers'),
        healthy: c.Online, warning: c.Warning, critical: c.Critical, offline: c.Offline,
        healthy_w: seg('Online'), warning_w: seg('Warning'), critical_w: seg('Critical'), offline_w: seg('Offline'),
        healthFg: c.Critical ? '#B21E1E' : c.Warning ? '#8A5200' : c.Offline || !ds.length ? '#5A6675' : '#0E7A36',
        healthText: c.Critical ? c.Critical + ' critical' : c.Warning ? c.Warning + ' need attention' : c.Offline ? c.Offline + ' not reporting' : !ds.length ? 'No devices yet' : 'All healthy',
        alertsText: openA ? openA + ' open alert' + (openA > 1 ? 's' : '') : 'No open alerts', alertsFg: openA ? '#B21E1E' : '#5A6675',
        aria: 'View ' + ds.length + ' ' + name + ' devices', dJON: code === 'JON' ? 'block' : 'none', dTHR: code === 'THR' ? 'block' : 'none', dDGX: code === 'DGX' ? 'block' : 'none', dRPI: code === 'RPI' ? 'block' : 'none',
        pick: () => this.setState({ catType: name, f: { ...EMPTY_F, type: name }, q: '', page: 1 }) };
    });

    const drillCode = s.catType === '__all' ? 'ALL' : ({ 'Jetson Orin Nano': 'JON', 'AGX Thor': 'THR', 'DGX Spark': 'DGX', 'Raspberry Pi 5': 'RPI' }[s.catType] || '');
    const drillBlurb = { JON: 'Compact AI edge · 67 TOPS', THR: 'High-performance AI · Blackwell', DGX: 'Desktop AI supercomputer', RPI: 'ARM Cortex-A76 · lightweight', ALL: 'All device types combined' }[drillCode] || '';
    let pages = [];
    const drillSet = s.catType === '__all' ? DEVICES.slice() : s.catType ? DEVICES.filter(d => d.type === s.catType) : [];
    const dOn = drillSet.filter(REPORTING).length, dWarn = drillSet.filter(d => d.status === 'Warning').length, dCrit = drillSet.filter(d => d.status === 'Critical').length, dOff = drillSet.filter(d => d.status === 'Offline').length;
    const liveSet = drillSet.filter(d => d.cpu != null);
    const avg = (arr, k) => arr.length ? Math.round(arr.reduce((s2, d) => s2 + d[k], 0) / arr.length) : null;
    const dOpenAlerts = ALERTS.filter(a => isOpen(a) && a.sev !== 'Info' && drillSet.some(d => d.id === a.device)).length;
    const openCrit = ALERTS.filter(a => isOpen(a) && a.sev === 'Critical' && drillSet.some(d => d.id === a.device)).length;
    const openWarn = ALERTS.filter(a => isOpen(a) && a.sev === 'Warning' && drillSet.some(d => d.id === a.device)).length;
    // reachable = reporting on time; a critical box (e.g. one service stopped) is still reachable
    const dReach = drillSet.filter(d => !['Offline', 'Never seen', 'Revoked'].includes(d.status)).length;
    const availPct = drillSet.length ? Math.round(dReach / drillSet.length * 100) : 0;
    const perfTone = c => c >= 90 ? '#C7342B' : c >= 80 ? '#B4690E' : '#15933D';
    const RC = React, hv = RC.createElement;
    let gc = 0;
    const PAIR = { green: ['#2FB457', '#16A34A'], amber: ['#FBB04C', '#F59E0B'], red: ['#F2564B', '#DC2626'], blue: ['#1A86F0', '#0070E0'], grey: ['#C4CBD6', '#AEB6C2'] };
    const toneKey = c => c >= 90 ? 'red' : c >= 80 ? 'amber' : 'green';
    const sBar = (segs, unit) => {
      if (segs.every(s => s.n === 0)) return hv('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 62, borderBottom: '1.5px solid #E4E9F0', color: '#0E7A36', fontSize: 12, fontWeight: 600, width: '100%' } }, 'All clear');
      const mx = Math.max(1, ...segs.map(s => s.n));
      return hv('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' } }, [
        hv('div', { key: 'bars', style: { display: 'flex', alignItems: 'flex-end', gap: 10, height: 50, borderBottom: '1.5px solid #E4E9F0' } },
          segs.map((s, i) => { const p = PAIR[s.tk] || PAIR.blue; const h0 = s.n > 0 ? Math.max(16, s.n / mx * 100) : 3;
            return hv('div', { key: i, className: 'sdc-bar', style: { flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' } }, [
              hv('div', { key: 'f', className: 'sdc-fill', style: { width: '100%', height: h0 + '%', borderRadius: '5px 5px 0 0', background: 'linear-gradient(180deg,' + p[0] + ',' + p[1] + ')', boxShadow: '0 -1px 7px -1px ' + p[1] + '66, inset 0 1px 0 rgba(255,255,255,.5)' } }),
              hv('div', { key: 't', className: 'sdc-tip', style: { background: '#1A2740', color: '#FFFFFF', borderRadius: 8, padding: '5px 9px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 10px 22px -8px rgba(16,42,84,.55)' } }, s.label + ': ' + s.n + (unit || ''))
            ]);
          })),
        hv('div', { key: 'labels', style: { display: 'flex', gap: 10 } },
          segs.map((s, i) => hv('span', { key: i, style: { flex: 1, minWidth: 0, textAlign: 'center', fontSize: 9.5, fontWeight: 500, letterSpacing: '.02em', color: '#5A6675', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, s.label)))
      ]);
    };
    const sMeter = (pct, tk, leftCap, rightCap) => {
      const p = PAIR[tk] || PAIR.blue; const v = Math.max(0, Math.min(100, Math.round(pct)));
      return hv('div', { className: 'sdc-bar', style: { position: 'relative', display: 'flex', flexDirection: 'column', gap: 7, width: '100%', marginTop: 6 } }, [
        hv('div', { key: 'track', style: { position: 'relative', height: 14, borderRadius: 999, background: '#EEF1F5', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(16,42,84,.09)' } },
          hv('div', { key: 'fill', className: 'sdc-meter-fill', style: { height: '100%', width: Math.max(5, v) + '%', borderRadius: 999, background: 'linear-gradient(90deg,' + p[0] + ',' + p[1] + ')', boxShadow: '0 1px 7px -1px ' + p[1] + '99, inset 0 1px 0 rgba(255,255,255,.45)' } })),
        hv('div', { key: 'cap', style: { display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#8591A1', fontVariantNumeric: 'tabular-nums' } }, [hv('span', { key: 0 }, leftCap || 'Used'), hv('span', { key: 1 }, rightCap || ((100 - v) + '% free'))]),
        hv('div', { key: 't', className: 'sdc-tip', style: { left: v + '%', background: '#1A2740', color: '#FFFFFF', borderRadius: 8, padding: '5px 9px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 10px 22px -8px rgba(16,42,84,.55)' } }, v + '%')
      ]);
    };
    const sStack = (segs) => {
      const tot = Math.max(1, segs.reduce((a, s) => a + s.n, 0));
      const live = segs.filter(s => s.n > 0);
      return hv('div', { style: { display: 'flex', flexDirection: 'column', gap: 7, width: '100%' } }, [
        hv('div', { style: { position: 'relative', display: 'flex', height: 9, borderRadius: 999, background: '#EEF1F5', boxShadow: 'inset 0 1px 2px rgba(16,42,84,.09)', overflow: 'hidden' }, key: 'bar' },
          live.map((s, i) => { const p = PAIR[s.tk] || PAIR.blue;
            return hv('div', { key: i, className: 'sdc-bar sdc-meter-fill', style: { width: (s.n / tot * 100) + '%', height: '100%', background: 'linear-gradient(90deg,' + p[0] + ',' + p[1] + ')', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)', borderRight: i < live.length - 1 ? '1.5px solid #FFFFFF' : 'none' } },
              hv('div', { className: 'sdc-tip', style: { background: '#1A2740', color: '#FFFFFF', borderRadius: 8, padding: '5px 9px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 10px 22px -8px rgba(16,42,84,.55)' } }, s.label + ': ' + s.n));
          })),
        hv('div', { key: 'lg', style: { display: 'flex', flexWrap: 'wrap', gap: '4px 12px' } },
          segs.map((s, i) => { const p = PAIR[s.tk] || PAIR.blue;
            return hv('span', { key: i, style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: '#5A6675', fontVariantNumeric: 'tabular-nums' } }, [
              hv('span', { key: 'd', style: { width: 7, height: 7, borderRadius: 2, background: p[1] } }),
              hv('span', { key: 't' }, s.label + ' ' + s.n)
            ]);
          }))
      ]);
    };
    const spark = null;
    const totSegs = [{ n: dOn, c: '#34C759', label: 'online' }, { n: dWarn, c: '#FF9F0A', label: 'warning' }, { n: dCrit, c: '#FF3B30', label: 'critical' }, { n: dOff, c: '#C4CBD6', label: 'offline' }];
    const tt = drillSet.length || 1;
    totSegs.forEach(s => s.w = (s.n / tt * 100) + '%');
    const cpuV = avg(liveSet, 'cpu'), stV = avg(liveSet, 'st');
    const oTot = Math.max(1, openCrit + openWarn);
    const openSegs = [{ n: openCrit, c: '#FF3B30', label: 'critical' }, { n: openWarn, c: '#FF9F0A', label: 'warning' }];
    openSegs.forEach(s => s.w = (s.n / oTot * 100) + '%');
    const drillStats = [
      { label: 'Total devices', value: String(drillSet.length), sub: dOn + ' online · ' + dOff + ' not reporting', fg: '#0070E0', icon: 'M4 4h16v12H4zM8 20h8M12 16v4', viz: sBar([{ label: 'Online', n: dOn, tk: 'green' }, { label: 'Warning', n: dWarn, tk: 'amber' }, { label: 'Critical', n: dCrit, tk: 'red' }, { label: 'Offline', n: dOff, tk: 'grey' }]) },
      { label: 'Availability', value: availPct + '%', sub: dReach + ' of ' + drillSet.length + ' reporting', fg: perfTone(100 - availPct), icon: 'M22 12h-4l-3 9L9 3l-3 9H2', viz: sMeter(availPct, toneKey(100 - availPct), 'Reachable', (drillSet.length - dReach) + ' not reporting') },
      { label: 'Needs attention', value: String(dCrit + dWarn), sub: dCrit ? dCrit + ' critical now' : dWarn ? 'warnings only' : 'all clear', fg: dCrit ? '#C7342B' : dWarn ? '#B4690E' : '#15933D', icon: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01', viz: sBar([{ label: 'Critical', n: dCrit, tk: 'red' }, { label: 'Warning', n: dWarn, tk: 'amber' }]) },
      { label: 'Open alerts', value: String(dOpenAlerts), sub: dOpenAlerts ? openCrit + ' critical · ' + openWarn + ' warning' : 'All clear', fg: dOpenAlerts ? '#C7342B' : '#15933D', icon: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0', viz: dOpenAlerts ? sBar([{ label: 'Critical', n: openCrit, tk: 'red' }, { label: 'Warning', n: openWarn, tk: 'amber' }]) : sMeter(100, 'green', 'Resolved', '0 open') }
    ];
    drillStats.forEach(st => { const r = !!st.vizRight; st.vizR = r ? st.viz : null; st.vizB = r ? null : st.viz; st.vizRightDisplay = r ? 'flex' : 'none'; st.vizBottomDisplay = r ? 'none' : 'block'; });
    for (let n = 1; n <= pageCount; n++) pages.push({ n, aria: 'Page ' + n, current: n === page ? 'page' : undefined, bg: n === page ? '#0070E0' : '#FFFFFF', fg: n === page ? '#FFFFFF' : '#1A1E26', border: n === page ? '#0070E0' : '#D5DBE4', go: () => this.setState({ page: n }) });

    const updated = fmtT.format(new Date(now));
    const gq2 = (s.gq || '').trim().toLowerCase();
    const voiceOK = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const gResults = gq2 ? DEVICES.filter(d => [d.id, d.name, d.serial, d.customer, d.type, d.site, d.location, ...(d.macs || [])].join(' ').toLowerCase().includes(gq2)).slice(0, 8).map(d => ({
      id: d.id, meta: (d.name && d.name !== d.id ? d.name + ' · ' : '') + d.type + ' · ' + d.customer, dot: STATUS_DOT[d.status] || '#8A93A2',
      pick: () => { this.setState({ gq: '', open: null }); this.openDevice(d.id); }
    })) : [];
    return {
      isLogin: s.screen === 'login', isDash,
      ...this.detailVals(s, mkRow, list),
      // the Settings page (admins) takes the place of the dashboard and the device page while it is open
      ...(s.settingsOpen ? { isDetail: false, dashDisplay: 'none' } : {}),
      isSettings: !!s.settingsOpen,
      settings: s.settingsOpen ? this.settingsProps || (this.settingsProps = { me: s.me, close: this.closeSettings, openedAt: s.settingsOpen,
        toast: (title, body, tone) => this.toast(title, body, tone), changed: () => this.refreshData(true), openDevice: id => this.openDevice(id) }) : null,
      email: s.email, pw: s.pw, authErr: s.authErr, signing: s.signing, signInLabel: s.signing ? 'Signing in…' : 'Sign in',
      onEmail: e => this.setState({ email: e.target.value }), onPw: e => this.setState({ pw: e.target.value }),
      pwType: s.showPw ? 'text' : 'password', pwToggleLabel: s.showPw ? 'Hide password' : 'Show password',
      pwIcon: s.showPw ? 'M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.3 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6' : 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
      togglePw: () => this.setState({ showPw: !s.showPw }), signIn: this.signIn,
      loginCols: s.w >= 960 ? 'minmax(0,1.1fr) minmax(0,1fr)' : 'minmax(0,1fr)', loginHeroDisplay: s.w >= 960 ? 'flex' : 'none', loginLogoDisplay: s.w >= 960 ? 'none' : 'block',
      loginBorder: s.authErr ? '#DC2626' : '#D5DBE4', loginInvalid: s.authErr ? 'true' : 'false',
      remember: !!s.remember, toggleRemember: () => this.setState({ remember: !s.remember }),
      loginSecureDisplay: typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'flex' : 'none',

      goHome: e => { e.preventDefault(); this.setState({ detail: null, settingsOpen: null, f: { ...EMPTY_F }, q: '', page: 1, open: null }); window.scrollTo({ top: 0 }); },
      fleetBarDisplay: (!s.detail && !s.catType && !s.settingsOpen) ? 'flex' : 'none',
      mainPadTop: (!s.detail && !s.catType && !s.settingsOpen) ? '112px' : '88px',
      productDisplay: s.w >= 600 ? 'inline' : 'none', namesDisplay: s.w >= 900 ? 'flex' : 'none',
      toggleNotif: () => this.toggle('notif'), notifOpen: s.open === 'notif', notifExpanded: s.open === 'notif' ? 'true' : 'false',
      notifBg: nt.bg, notifRing: nt.ring, notifLabel: unread ? 'Notifications, ' + unread + ' unread' : 'Notifications',
      hasUnread: unread > 0, unreadBadge: unread > 9 ? '9+' : String(unread), unreadText: unread + ' unread', noUnread: unread === 0,
      markAllColor: unread ? '#005BB8' : '#8A93A2', markAllCursor: unread ? 'pointer' : 'not-allowed',
      markAll: () => { const r = {}; NOTIFS.forEach(n => r[n.id] = true); this.setState({ read: r }); },
      notifs: NOTIFS.map(n => { const v = SEV[n.sev], u = !s.read[n.id]; return { ...n, tileBg: n.sev === 'Info' ? '#EEF2F7' : v.bg, tileFg: v.fg, icon: v.icon, unread: u, weight: u ? 600 : 400, rel: rel(n.ago * 60000), abs: fmtFull.format(new Date(now - n.ago * 60000)), open: () => { this.setState(st => ({ read: { ...st.read, [n.id]: true } })); const dev = DEVICES.find(x => x.key === n.key); if (dev) this.openDevice(dev.id, 'alerts'); } }; }),
      toggleProfile: () => this.toggle('profile'), profileOpen: s.open === 'profile', profileExpanded: s.open === 'profile' ? 'true' : 'false',
      profileBg: pt.bg, profileRing: pt.ring, profileChevron: s.open === 'profile' ? 'rotate(180deg)' : 'none',
      profileItems: [
        ...(s.me && s.me.can && s.me.can.settings ? [{ label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6a3 3 0 1 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z', run: this.openSettings }] : []),
        { label: 'Change password', icon: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', run: this.openPassword }
      ],
      ...this.passwordVals(s),
      closeAll: () => this.setState({ open: null }),
      signOut: this.signOut,
      userName: (s.me && s.me.name) || '', userEmail: (s.me && s.me.email) || '',
      userRole: s.me && s.me.role === 'client' ? 'View only · ' + (s.me.customer || 'Client') : ({ admin: 'Portal administrator', support: 'Support engineer' })[s.me && s.me.role] || '',
      userInitials: ((s.me && s.me.name) || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join(''),
      registerDisplay: s.me && s.me.can && s.me.can.register ? 'flex' : 'none',

      fleetMeta: total + ' registered edge devices · Data updated ' + updated,
      fleetCount: String(total), fleetUpdated: updated,
      serverDown: !!s.serverDown && isDash, serverLastContact: s.serverSince || 'never', reconnecting: !!s.reconnecting,
      outageTitle: s.apiDown ? 'Portal server unreachable' : 'Central server not answering',
      outageText: s.apiDown ? 'This page cannot reach the portal server' + (s.apiError ? ' (' + s.apiError + ')' : '') + '. The data below was last updated ' + (s.serverSince || 'never') + ' and may be out of date.'
        : 'The portal cannot reach the central sync server' + (s.downSource && s.downSource.error ? ' (' + s.downSource.error + ')' : '') + '. The data below was last updated ' + (s.serverSince || 'never') + '. Boxes keep their readings and upload them once it is back.',
      retryLabel: s.reconnecting ? 'Reconnecting…' : 'Retry connection', retryAnim: s.reconnecting ? 'spin .8s linear infinite' : 'none', retryCursor: s.reconnecting ? 'default' : 'pointer',
      retryConnection: () => { if (this.state.reconnecting) return; this.setState({ reconnecting: true }); this.refreshData(true); },
      gq: s.gq || '', onGSearch: e => this.setState({ gq: e.target.value, open: 'gsearch' }), gFocus: () => this.setState({ open: 'gsearch' }),
      gKeyDown: e => { if (e.key === 'Escape') this.setState({ gq: '', open: null }); else if (e.key === 'Enter' && gResults.length) gResults[0].pick(); },
      gSearchDisplay: s.w >= 680 ? 'flex' : 'none', gResults, gExpanded: (s.open === 'gsearch' && gResults.length) ? 'true' : 'false',
      gResultsOpen: !!(s.open === 'gsearch' && gq2), gEmptyDisplay: gResults.length ? 'none' : 'flex', gQueryEcho: s.gq || '',
      gHintDisplay: gResults.length ? 'block' : 'none', gResultCount: gResults.length >= 8 ? '8+ matches' : (gResults.length + (gResults.length === 1 ? ' match' : ' matches')),
      gPlaceholder: s.listening ? 'Listening…' : 'Search all devices…',
      voiceDisabled: !voiceOK, voiceCursor: voiceOK ? 'pointer' : 'not-allowed', voicePressed: s.listening ? 'true' : 'false',
      voiceBg: s.listening ? '#DC2626' : '#EEF2F7', voiceFg: s.listening ? '#FFFFFF' : (voiceOK ? '#5A6675' : '#B4BDC9'),
      voicePingDisplay: s.listening ? 'block' : 'none', voiceToggle: () => this.voiceToggle(),
      voiceLabel: voiceOK ? (s.listening ? 'Stop voice search' : 'Search by voice') : 'Voice search unavailable in this browser',
      voiceTitle: voiceOK ? (s.listening ? 'Stop listening' : 'Search by voice') : 'Voice search is not supported by this browser',
      refreshing: s.refreshing, refreshLabel: s.refreshing ? 'Refreshing…' : 'Refresh', refreshAnim: s.refreshing ? 'spin .8s linear infinite' : 'none',
      refresh: () => this.refreshData(false),
      metrics, filters, chips, hasChips: chips.length > 0, multiChips: chips.length > 1,
      filtersExpanded: s.filtersOpen ? 'true' : 'false', filtersPanelDisplay: s.filtersOpen ? 'flex' : 'none', filtersChev: s.filtersOpen ? 'rotate(180deg)' : 'none',
      toggleFilters: () => this.setState(st => ({ filtersOpen: !st.filtersOpen, open: null })),
      filterCount: String(chips.length + (s.q ? 1 : 0) + ((s.devFrom || s.devTo) ? 1 : 0)), filterCountDisplay: (chips.length + (s.q ? 1 : 0) + ((s.devFrom || s.devTo) ? 1 : 0)) ? 'inline-flex' : 'none',
      devDateRange: React.createElement(this.drp(), { value: { from: s.devFrom || '', to: s.devTo || '' }, max: isoLocal(), onChange: (fr, t) => this.setState({ devFrom: fr, devTo: t, page: 1 }) }),
      // a client sees only the device types its boxes were registered with (24 Nov 2026); everyone else every type
      categories: s.me && s.me.can && s.me.can.readOnly ? categories.filter(c => c.count > 0) : categories, catDisplay: s.catType ? 'none' : 'flex',
      catGridDisplay: s.catType ? 'none' : 'grid', catFlexDisplay: s.catType ? 'none' : 'flex',
      devWrapDisplay: s.catType ? 'flex' : 'none', catBackDisplay: s.catType ? 'inline-flex' : 'none',
      drillTitle: s.catType === '__all' ? 'All devices' : (s.catType || ''),
      drillSub: s.catType === '__all' ? 'every registered device' : 'all ' + (s.catType || '') + ' devices',
      drillStats, drillBlurb,
      drillJON: drillCode === 'JON' ? 'block' : 'none', drillTHR: drillCode === 'THR' ? 'block' : 'none',
      drillDGX: drillCode === 'DGX' ? 'block' : 'none', drillRPI: drillCode === 'RPI' ? 'block' : 'none',
      drillAllDisplay: drillCode === 'ALL' ? 'flex' : 'none', drillOneDisplay: drillCode === 'ALL' ? 'none' : 'flex',
      backToCats: () => this.setState({ catType: null, f: { ...EMPTY_F }, q: '', page: 1 }),
      clearAll: () => this.setState({ f: { ...EMPTY_F, ...(s.catType && s.catType !== '__all' ? { type: s.catType } : {}) }, q: '', devFrom: null, devTo: null, page: 1 }),
      q: s.q, onSearch: e => this.setState({ q: e.target.value, page: 1 }),
      rows: s.detail ? [] : rows, isEmpty: !s.detail && list.length === 0,
      gridEmpty: list.length ? null : DEVICES.length ? this.empty('No devices match', 'Try a different search or remove a filter.') : this.empty('No devices yet', s.me && s.me.can && s.me.can.register ? 'Register the first box with "Register device".' : 'Devices appear here once a portal admin registers them.'),
      tableDisplay: cardsView ? 'none' : 'table', cardsDisplay: cardsView ? 'grid' : 'none', pillX: cardsView ? 'none' : 'translateX(100%)',
      views: [['cards', 'Cards', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'], ['table', 'Table', 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14']].map(([k, label, icon], i, arr) => {
        const sel = (s.view || 'cards') === k;
        return { label, icon, sel: sel ? 'true' : 'false', tab: sel ? 0 : -1, fg: sel ? '#0070E0' : '#5A6675',
          pick: () => this.setState({ view: k, page: 1 }),
          key: e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const nk = e.key === 'Home' ? 'cards' : e.key === 'End' ? 'table' : arr[1 - i][0]; this.setState({ view: nk, page: 1 }); setTimeout(() => { const t = document.querySelectorAll('[role=tab]'); t[nk === 'table' ? 0 : 1] && t[nk === 'table' ? 0 : 1].focus(); }, 0); } } };
      }),
      rangeLabel: list.length ? ((page - 1) * PAGE + 1) + '–' + Math.min(page * PAGE, list.length) + ' of ' + list.length + ' devices' : '0 of 0',
      pages, prev: () => this.setState({ page: Math.max(1, page - 1) }), next: () => this.setState({ page: Math.min(pageCount, page + 1) }),
      printReport: () => this.printReport(),
      exportDevicesCSV: () => this.downloadCSV('saras-devices.xls',
        ['Device ID', 'Name', 'Serial', 'MAC IDs', 'Type', 'OS', 'Status', 'Customer', 'Site', 'Location', 'Product', 'CPU %', 'GPU °C', 'Storage %', 'Open alerts', 'App version', 'Last reading'],
        list.map(d => [d.id, d.name, d.serial, (d.macs || []).join(', '), d.type, d.os || '', d.status, d.customer, d.site || '', d.location || '', d.product, d.cpu == null ? '' : d.cpu, d.gpu == null ? '' : d.gpu, d.st == null ? '' : d.st, d.openAlerts || 0, d.app, d.lastSeenAt ? fmtFull.format(new Date(d.lastSeenAt)) : 'Never'])),
      prevDisabled: page === 1, nextDisabled: page === pageCount, prevCursor: page === 1 ? 'not-allowed' : 'pointer', nextCursor: page === pageCount ? 'not-allowed' : 'pointer',
      footTz: 'IST · UTC+05:30 (Asia/Kolkata)',
      footClock: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ, timeZoneName: 'short' }).format(new Date(s.tick || now)),
      footSync: s.lastFetch ? rel(Date.now() - s.lastFetch) : '—',
      footConnText: !s.lastFetch ? 'Connecting…' : s.serverDown ? (s.apiDown ? 'Portal server unreachable' : 'Central server not answering') : 'Monitoring server connected',
      footConnFg: s.serverDown ? '#FF9B9B' : '#5FD08A', footConnBg: s.serverDown ? 'rgba(255,120,120,.1)' : 'rgba(95,208,138,.1)', footConnBorder: s.serverDown ? 'rgba(255,120,120,.3)' : 'rgba(95,208,138,.25)', footConnDot: s.serverDown ? '#F87171' : '#4ADE80',
      closeRef: this.closeRef || (this.closeRef = React.createRef()),
      ...this.alertVals(s),
      ...this.patchVals(s),
      ...this.registerVals(s),
      patchCloseRef: this.patchCloseRef || (this.patchCloseRef = React.createRef()),
      boxKey: s.boxKey || null, boxKeyCopied: s.boxKeyCopied || null, boxKeyAck: !!s.boxKeyAck,
      toggleBoxKeyAck: e => this.setState({ boxKeyAck: e.target.checked }),
      copyBoxKey: () => this.copyText(s.boxKey && s.boxKey.key, 'key'), copyBoxCommand: () => this.copyText(s.boxKey && s.boxKey.command, 'command'),
      copyBoxCode: () => this.copyText(s.boxKey && s.boxKey.code, 'code'), copyBoxDeviceId: () => this.copyText(s.boxKey && s.boxKey.deviceId, 'id'),
      copyBoxAgent: () => this.copyText(s.boxKey && s.boxKey.agent && s.boxKey.agent.commands, 'agent'),
      copyAgentStep: i => this.copyText(s.boxKey && s.boxKey.agent && s.boxKey.agent.steps && s.boxKey.agent.steps[i] && s.boxKey.agent.steps[i].cmd, 'agent' + i),
      closeBoxKey: () => { if (!this.state.boxKeyAck && !(this.state.boxKey && this.state.boxKey.mode === 'agent')) return; const back = (this.state.boxKey && this.state.boxKey.back) || '[data-trigger="register"]'; this.setState({ boxKey: null, boxKeyCopied: null, boxKeyAck: false }); setTimeout(() => { const t = document.querySelector(back); t && t.focus(); }, 0); },
    };
  }
}