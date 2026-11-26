import React from 'react';
import { api } from '../services/portalApi.js';

// The Settings page (admins; review items 4-10, 6 Nov 2026). Since 0.2.1 parameters, alert thresholds and e-mail contacts
// are set for each device: the Devices list opens one device at a time; a customer or a product only shows its devices'
// values, read-only. Every edit waits as an unsaved change until the one Save all button stores them together.

const C = { blue: '#0070E0', dark: '#005BB8', ink: '#1A1E26', mute: '#5A6675', line: '#E4E9F0', soft: '#F5F7FA', bad: '#B21E1E', ok: '#0E7A36' };
const FONT = 'Poppins,sans-serif';
const card = { background: '#FFFFFF', borderRadius: 14, boxShadow: 'inset 0 0 0 1px #E4E9F0', padding: 18, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 };
const btn = (primary, off) => ({ height: 36, padding: '0 14px', borderRadius: 9, border: primary || off ? 0 : '1px solid #D5DBE4', background: off ? '#EEF2F7' : primary ? C.blue : '#FFFFFF',
  color: off ? '#AEB6C2' : primary ? '#FFFFFF' : C.dark, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' });
const field = { height: 36, padding: '0 10px', borderRadius: 9, border: '1px solid #D5DBE4', fontFamily: FONT, fontSize: 13, color: C.ink, background: '#FFFFFF', minWidth: 0, boxSizing: 'border-box' };
const th = { textAlign: 'left', padding: '8px 12px 8px 0', color: C.mute, fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap', borderBottom: '1px solid ' + C.line };
const td = { padding: '8px 12px 8px 0', verticalAlign: 'middle', borderBottom: '1px solid #F0F3F7', fontSize: 13 };
const h2 = { margin: 0, fontSize: 16, fontWeight: 600, color: C.ink };
const note = { margin: 0, fontSize: 12.5, color: C.mute, lineHeight: 1.5 };

// the order of the work: see the boxes, choose what is monitored, when it alerts and who is told, who sees what
const TABS = [['devices', 'Registered devices'], ['params', 'Parameters'], ['rules', 'Alert thresholds'], ['email', 'E-mail alerts'], ['users', 'Users & access'], ['monitoring', 'Monitoring'], ['agents', 'Agent releases'], ['audit', 'Audit log']];
const FROM = { device: ['This device', '#E7F1FB', C.dark], customer: ['Customer', '#E5F4E4', '#1D6B2F'], type: ['Product', '#EFEDFF', '#5B3FC4'], fleet: ['Default', '#EEF2F7', '#3B4552'], default: ['Default', '#F5F7FA', C.mute] };
// each product runs on one kind of box; the portal stores product settings under that device type
const PRODUCTS = [['SchoolAI in a Box', 'DGX Spark'], ['Proctor in a Box', 'Orin Nano'], ['Assessment in a Box', 'Raspberry Pi 5']];
const CODE_TYPE = { DGX: 'DGX Spark', THR: 'AGX Thor', JON: 'Orin Nano', JOR: 'Orin', RPI: 'Raspberry Pi 5' };
const productOf = d => (PRODUCTS.find(([p]) => p === d.product) || [])[0] || 'Other devices';
const byProduct = devices => [...PRODUCTS.map(([p]) => p), 'Other devices'].map(p => [p, devices.filter(d => productOf(d) === p)]).filter(([, l]) => l.length);
// the roles (docs/TD-ROLES.md): admins run the portal and create every account; support engineers see every box and push the
// patches; a client sees its customer's boxes only, view only, and downloads their patches
const ROLES = [['admin', 'Portal administrator'], ['support', 'Support engineer'], ['client', 'Client']];
const ROLE_HINT = {
  admin: 'Sees every box and runs the portal (devices, settings, users). Does not send patches.',
  support: 'Sees every box and pushes the patches (upload, e-mail, resend, delete).',
  client: 'Sees only the boxes of one customer, view only: monitoring, logs, patches (download, guide, report a problem).'
};
// a sign-in name: an e-mail address, or a username (3–40 lower-case letters, digits, dots, dashes, underscores)
const LOGIN = /^[a-z0-9._-]{3,40}$/;
// a customer as compared by the portal: trimmed, inner spaces as one, case ignored
const normCustomer = c => String(c || '').trim().replace(/\s+/g, ' ').toLowerCase();
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtAt = x => x ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(x)) : '—';
const scopeQuery = sc => sc.level === 'type' ? { type: sc.target } : sc.level === 'customer' ? { customer: sc.target } : sc.level === 'device' ? { device: sc.target } : {};
const customersOf = devices => [...new Set(devices.map(d => d.customer).filter(c => c && c !== '—'))].sort();
const newPassword = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), b => 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 56]).join('') + '-' + (100 + (crypto.getRandomValues(new Uint8Array(1))[0] % 900));

const WORK_DEFAULT = { days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '18:00' };

// ---- unsaved changes (11 Nov 2026): every edit waits in one list and a single "Save all" stores them -------------
// kinds: value (a setting or the parameters, for one scope), rule (one measure's thresholds, for one scope), monitoring
// and user. reset = remove this level's value, so the level above applies again.
const sk = sc => sc.level + ':' + (sc.target || '');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const emailsOf = text => String(text || '').split(/[\s,;]+/).filter(Boolean);
const EMAIL = /^[^@\s,;<>"]{1,64}@[^@\s,;<>"]+\.[^@\s,;<>"]{2,}$/;
const ruleForm = v => ({ warn: v.warn === '' ? '' : Number(v.warn), crit: v.crit === '' ? '' : Number(v.crit), times: Number(v.times), on: !!v.on });
const monitoringBody = v => {
  const wh = v.working_hours || WORK_DEFAULT, oa = v.offline_alert || {};
  return { offline_after_minutes: Number(v.offline_after_minutes), late_after_extra_minutes: Number(v.late_after_extra_minutes), data_loss_risk_days: Number(v.data_loss_risk_days),
    offline_alert: { working_hours_minutes: Number(oa.working_hours_minutes), any_time_minutes: Number(oa.any_time_minutes) },
    working_hours: { days: wh.days, from: wh.from, to: wh.to }, time_zone: v.time_zone };
};
const userForm = v => ({ ...v, name: String(v.name || '').trim(), customer: String(v.customer || '').trim(), contactEmail: String(v.contactEmail || '').trim().toLowerCase() });
const FORM = { rule: ruleForm, monitoring: monitoringBody, user: userForm };
const formOfKind = e => FORM[e.kind] || (x => x);
const isChanged = e => !!e && (!!e.reset || (e.isNew ? !!String(e.next.email || '').trim() : !same(formOfKind(e)(e.next), formOfKind(e)(e.orig))));
const TAB_OF = e => e.kind === 'value' ? (e.key === 'parameters.off' ? 'params' : 'email') : ({ rule: 'rules', user: 'users', monitoring: 'monitoring' })[e.kind];

function Badge({ from }) {
  const [label, bg, fg] = FROM[from] || FROM.default;
  return <span title={'This value comes from: ' + label} style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999, background: bg, color: fg, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>;
}

function Unsaved({ text }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999, background: '#FEF3E2', color: '#8A5200', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{text || 'Unsaved'}</span>;
}

function Switch({ on, set, label, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={on ? 'true' : 'false'} aria-label={label} disabled={disabled} onClick={() => set(!on)}
      style={{ width: 40, height: 22, borderRadius: 999, border: 0, padding: 2, background: on ? C.blue : '#C9D1DC', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', flexShrink: 0 }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,.25)' }} />
    </button>
  );
}

// ---- devices one by one (0.2.1): every value is set for one device; a customer or a product is a read-only view --------

const VIEWED = ['params', 'rules', 'email'];
const devName = d => d.name || d.id;
const devMeta = d => [d.type, productOf(d) === 'Other devices' ? null : productOf(d), d.customer && d.customer !== '—' ? d.customer : null, d.site || null].filter(Boolean).join(' · ');
const devicesIn = (view, devices) => view.mode === 'customer' ? devices.filter(d => d.customer === view.target)
  : view.mode === 'product' ? devices.filter(d => productOf(d) === view.target) : devices;
const rowId = key => 'device-row-' + String(key).replace(/[^A-Za-z0-9_-]/g, '_');
// unsaved changes of one device on one tab
const unsavedFor = (pd, key, tab) => Object.values(pd.drafts)
  .filter(e => isChanged(e) && e.scope && e.scope.level === 'device' && e.scope.target === key && TAB_OF(e) === tab).length;

function ViewBar({ view, setView, devices }) {
  const customers = customersOf(devices);
  const products = byProduct(devices).map(([p]) => p);
  const pick = mode => setView({ mode, target: mode === 'customer' ? customers[0] || null : mode === 'product' ? products[0] || null : null });
  return (
    <div style={{ ...card, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Show</span>
      <div role="radiogroup" aria-label="Show" style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 10, background: C.soft, boxShadow: 'inset 0 0 0 1px ' + C.line }}>
        {[['devices', 'Devices'], ['customer', 'By customer'], ['product', 'By product']].map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={view.mode === k ? 'true' : 'false'} onClick={() => pick(k)}
            style={{ height: 30, padding: '0 14px', border: 0, borderRadius: 8, background: view.mode === k ? '#FFFFFF' : 'transparent', boxShadow: view.mode === k ? '0 1px 3px rgba(16,42,84,.16)' : 'none',
              color: view.mode === k ? C.dark : '#3B4552', fontFamily: FONT, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>{label}</button>
        ))}
      </div>
      {view.mode === 'customer' ? (customers.length ? (
        <select aria-label="Customer" value={view.target || ''} onChange={e => setView({ mode: 'customer', target: e.target.value })} style={{ ...field, minWidth: 240 }}>
          {customers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : <span style={{ fontSize: 13, color: C.mute }}>No registered device has a customer yet.</span>) : null}
      {view.mode === 'product' ? (
        <select aria-label="Product" value={view.target || ''} onChange={e => setView({ mode: 'product', target: e.target.value })} style={{ ...field, minWidth: 220 }}>
          {products.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      ) : null}
      <span style={{ ...note, flex: '1 1 260px' }}>{view.mode === 'devices'
        ? 'Every value is set for one device. Open a device to see and change its values.'
        : 'Read only: the values of each device of this ' + (view.mode === 'customer' ? 'customer' : 'product') + '. To change one, choose Edit on that device.'}</span>
    </div>
  );
}

// an expandable list of devices; focus = { key } opens that device and scrolls to it
function DeviceRows({ list, focus, mark, body }) {
  const [open, setOpen] = React.useState(() => new Set(focus ? [focus.key] : []));
  React.useEffect(() => {
    if (!focus) return undefined;
    setOpen(o => new Set([...o, focus.key]));
    const t = setTimeout(() => { const el = document.getElementById(rowId(focus.key)); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 80);
    return () => clearTimeout(t);
  }, [focus]);
  if (!list.length) return <p style={note}>No registered devices here.</p>;
  const sorted = [...list].sort((a, b) => devName(a).localeCompare(devName(b), undefined, { numeric: true, sensitivity: 'base' }));
  const toggle = k => setOpen(o => { const n = new Set(o); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const all = sorted.every(d => open.has(d.key));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12.5, color: C.mute }}>{sorted.length} {sorted.length === 1 ? 'device' : 'devices'}</span>
        <button type="button" onClick={() => setOpen(all ? new Set() : new Set(sorted.map(d => d.key)))} style={{ ...btn(false), height: 30, fontSize: 12.5 }}>{all ? 'Close all' : 'Open all'}</button>
      </div>
      {sorted.map(d => {
        const isOpen = open.has(d.key);
        return (
          <div key={d.key} id={rowId(d.key)} style={{ borderRadius: 12, boxShadow: 'inset 0 0 0 1px ' + (isOpen ? '#C9D7EA' : C.line), background: '#FFFFFF', scrollMarginTop: 12 }}>
            <button type="button" aria-expanded={isOpen ? 'true' : 'false'} onClick={() => toggle(d.key)}
              style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px', padding: '10px 14px', border: 0, borderRadius: 12, background: 'transparent', cursor: 'pointer', fontFamily: FONT, textAlign: 'left' }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 12, color: C.mute, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>▸</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{devName(d)}</span>
              <span style={{ fontSize: 12.5, color: C.mute, minWidth: 0 }}>{devMeta(d)}</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>{mark(d)}</span>
            </button>
            {isOpen ? <div style={{ padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #F0F3F7' }}>{body(d)}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

function Chip({ text, own }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999, background: own ? '#E7F1FB' : '#F1F4F8', color: own ? C.dark : '#3B4552', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>;
}

// the heading of the Parameters, Alert thresholds and E-mail alerts tabs, with Save all in its right corner
function PanelHead({ title, text, pd }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 360px', minWidth: 0 }}>
        <h2 style={h2}>{title}</h2>
        <p style={note}>{text}</p>
      </div>
      {pd.actions}
    </div>
  );
}

function EditLink({ d, onEdit }) {
  return <div><button type="button" onClick={() => onEdit(d)} style={btn(false)}>Edit {devName(d)}</button></div>;
}

// ---- alert thresholds (0.2.1): for each device, hardware alerts and software alerts (patches), a warning and a critical level each

const MEASURES = [
  { kind: 'hardware', name: 'CPU usage', unit: '%', warn: 'CPU_HIGH', crit: 'CPU_CRITICAL' },
  { kind: 'hardware', name: 'Memory (RAM)', unit: '%', warn: 'RAM_HIGH', crit: 'RAM_CRITICAL' },
  { kind: 'hardware', name: 'Disk space used', unit: '%', warn: 'DISK_LOW', crit: 'DISK_CRITICAL' },
  { kind: 'hardware', name: 'GPU temperature', unit: '°C', warn: 'GPU_TEMP_HIGH', crit: 'GPU_OVERHEAT' },
  { kind: 'hardware', name: 'GPU usage', unit: '%', warn: 'GPU_HIGH' },
  { kind: 'software', name: 'Security patches pending', unit: 'patches', warn: 'PATCH_SECURITY', crit: 'PATCH_SECURITY_CRITICAL' },
  { kind: 'software', name: 'OS updates pending', unit: 'updates', warn: 'OS_UPDATES', crit: 'OS_UPDATES_CRITICAL' },
  { kind: 'software', name: 'Days since the last OS update', unit: 'days', warn: 'OS_UPDATE_AGE', crit: 'OS_UPDATE_AGE_CRITICAL' },
  { kind: 'software', name: 'App data sync failing', crit: 'SYNC_FAILED', fixed: true },
];
const KINDS = [
  ['hardware', 'Hardware alerts', 'Load, memory, storage and temperature. Critical ones are e-mailed to this device’s hardware contacts.'],
  ['software', 'Software alerts', 'Patches waiting and the app’s data sync. Critical ones are e-mailed to this device’s software contacts.'],
];
const ONE = { patches: 'patch', updates: 'update', days: 'day' };
const withUnit = (x, unit) => x === '' || x === null || x === undefined ? '—'
  : x + (unit === '%' || unit === '°C' ? '' : ' ') + (Number(x) === 1 && ONE[unit] ? ONE[unit] : unit || '');

function RulesPanel({ view, sp, pd, devices, focus, onEdit }) {
  const readOnly = view.mode !== 'devices';
  return (
    <div style={card}>
      <PanelHead pd={pd} title="Alert thresholds" text="When a value reaches a level for the readings in a row, the box shows Warning or Critical and an alert opens. It clears by itself when the value drops back. Critical hardware alerts are e-mailed to the device's hardware contacts, critical software alerts to its software contacts." />
      <DeviceRows list={devicesIn(view, devices)} focus={focus}
        mark={d => { const n = unsavedFor(pd, d.key, 'rules'); return n ? <Unsaved text={n + ' unsaved'} /> : null; }}
        body={d => <DeviceRules d={d} sp={sp} pd={pd} readOnly={readOnly} onEdit={onEdit} />} />
    </div>
  );
}

function DeviceRules({ d, sp, pd, readOnly, onEdit }) {
  const key = d.key, name = devName(d);
  const [rules, setRules] = React.useState(null);   // rule code -> this device's effective rule
  React.useEffect(() => {
    let live = true;
    api.effectiveRules({ device: key }).then(r => { if (live) setRules(Object.fromEntries(r.rules.map(x => [x.rule, x]))); })
      .catch(e => sp.toast('Could not load the thresholds of ' + name, e.message, 'error'));
    return () => { live = false; };
  }, [key, name, sp, pd.version]);
  if (!rules) return <p style={note}>Loading…</p>;
  const scope = { level: 'device', target: key };
  const idOf = m => 'rule:' + sk(scope) + ':' + m.name;
  const base = m => { const w = rules[m.warn], c = rules[m.crit]; return { warn: w ? w.raise : '', crit: c ? c.raise : '', times: (w || c).consecutive, on: (w || c).enabled }; };
  const codes = m => Object.fromEntries([m.warn, m.crit].filter(c => c && rules[c]).map(c => [c, rules[c]]));
  // a read-only view shows what is stored; the Devices view shows the unsaved change too
  const cur = m => { const e = pd.drafts[idOf(m)]; return !readOnly && e && !e.reset ? e.next : base(m); };
  const entry = (m, next, reset) => ({ kind: 'rule', scope, name: m.name, label: m.name + ' threshold for ' + name, base: codes(m), orig: base(m), next, reset });
  const change = (m, k, x) => pd.put(idOf(m), entry(m, { ...cur(m), [k]: x }, false));
  const LV = ['device', 'customer', 'type', 'fleet'];
  const from = m => [rules[m.warn], rules[m.crit]].filter(Boolean).map(r => r.from).sort((a, b) => LV.indexOf(a) - LV.indexOf(b))[0];
  const level = (m, k, tone, off) => m.fixed || !m[k] ? <span style={{ color: C.mute }}>{m.fixed && k === 'crit' ? 'Any failed batch' : '—'}</span>
    : readOnly ? <span>{withUnit(cur(m)[k], m.unit)}</span> : (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        <input type="number" aria-label={m.name + (k === 'warn' ? ' warning level' : ' critical level') + ' for ' + name} value={cur(m)[k]} disabled={off}
          onChange={e => change(m, k, e.target.value)} style={{ ...field, width: 80, borderColor: tone }} />{m.unit}
      </span>
    );
  const table = ([kind, title, help]) => {
    const rows = MEASURES.filter(m => m.kind === kind && rules[m.crit || m.warn]);
    if (!rows.length) return null;
    return (
      <div key={kind} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</h3>
        <span style={note}>{help}</span>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead><tr>{['Measure', 'Warning at', 'Critical at', 'Readings in a row', 'Alerts', 'Comes from', ''].map(x => <th key={x} scope="col" style={th}>{x}</th>)}</tr></thead>
            <tbody>
              {rows.map(m => {
                const v = cur(m), e = pd.drafts[idOf(m)], changed = !readOnly && isChanged(e), resetting = !!(e && e.reset);
                const mine = [m.warn, m.crit].some(c => c && rules[c] && rules[c].from === 'device');
                return (
                  <tr key={m.name} style={changed ? { background: '#FFFBF2' } : undefined}>
                    <td style={{ ...td, fontWeight: 600, color: C.ink }}>{m.name}</td>
                    <td style={td}>{level(m, 'warn', '#E9B44C', resetting)}</td>
                    <td style={td}>{level(m, 'crit', '#E58C8C', resetting)}</td>
                    <td style={td}>{m.fixed ? <span style={{ color: C.mute }}>—</span> : readOnly ? v.times
                      : <input type="number" aria-label={m.name + ' readings in a row for ' + name} value={v.times} disabled={resetting} onChange={x => change(m, 'times', x.target.value)} style={{ ...field, width: 64 }} />}</td>
                    <td style={td}>{readOnly ? (v.on ? 'On' : <span style={{ color: C.mute }}>Off</span>)
                      : <Switch on={!!v.on} set={x => change(m, 'on', x)} label={m.name + ' alerts on for ' + name} disabled={resetting} />}</td>
                    <td style={td}><Badge from={from(m)} /></td>
                    <td style={{ ...td, whiteSpace: 'nowrap', textAlign: 'right' }}>
                      {readOnly ? null : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          {changed ? <Unsaved text={resetting ? 'Resets on Save all' : 'Unsaved'} /> : null}
                          {changed ? <button type="button" onClick={() => pd.drop(idOf(m))} style={btn(false)}>Undo</button>
                            : mine ? <button type="button" onClick={() => pd.put(idOf(m), entry(m, base(m), true))} style={btn(false)} title="Remove this device's own values: the default applies again">Reset</button> : null}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return <>{KINDS.map(table)}{readOnly ? <EditLink d={d} onEdit={onEdit} /> : null}</>;
}

// ---- registered devices, by product ---------------------------------------------------------------------

function DevicesPanel({ devices }) {
  const ST = { Online: C.ok, Warning: '#8A5200', Critical: C.bad, Offline: C.mute, 'Never seen': C.mute, Revoked: C.mute };
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 style={h2}>Registered devices</h2>
        <p style={note}>Every box registered in the portal, by product.</p></div>
      {!devices.length ? <p style={note}>No devices are registered yet. Use Register device on the dashboard.</p> : byProduct(devices).map(([p, list]) => (
        <div key={p} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h3 style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: C.ink }}>{p} <span style={{ fontWeight: 400, color: C.mute }}>· {list.length} {list.length === 1 ? 'device' : 'devices'}</span></h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
              <thead><tr>{['Device', 'Device ID', 'Type', 'Customer · site', 'MAC IDs', 'Status', 'Last reading'].map(x => <th key={x} scope="col" style={th}>{x}</th>)}</tr></thead>
              <tbody>
                {list.map(d => (
                  <tr key={d.key}>
                    <td style={{ ...td, fontWeight: 600 }}>{d.name || d.id}</td>
                    <td style={td}>{d.deviceId}</td>
                    <td style={td}>{d.type}</td>
                    <td style={td}>{[d.customer, d.site].filter(x => x && x !== '—').join(' · ') || '—'}</td>
                    <td style={{ ...td, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{(d.macs || []).length ? d.macs.join(', ') : <span style={{ color: C.mute }}>Not reported yet</span>}</td>
                    <td style={{ ...td, color: ST[d.status] || C.ink, fontWeight: 600 }}>{d.status}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtAt(d.lastSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- parameters (0.2.1): which parameters each device needs ----------------------------------------------

function ParamsPanel({ view, catalog, sp, devices, pd, focus, onEdit }) {
  const [own, setOwn] = React.useState(null);   // device key -> its own list of parameters not needed, as stored
  React.useEffect(() => {
    api.settingOverrides('parameters.off')
      .then(list => setOwn(Object.fromEntries(list.filter(o => o.level === 'device').map(o => [o.target, Array.isArray(o.value) ? o.value : []]))))
      .catch(e => sp.toast('Could not load the parameters', e.message, 'error'));
  }, [sp, pd.version]);
  if (!own) return <div style={card}><p style={note}>Loading…</p></div>;
  const readOnly = view.mode !== 'devices';
  const def = ((catalog.settings || []).find(s => s.key === 'parameters.off') || {}).default || [];
  return (
    <div style={card}>
      <PanelHead pd={pd} title="Parameters" text="Switch off what a device does not need. It is then left out of the fleet list, the device page, charts, readings and downloads, and raises no alert. Firmware is off unless switched on." />
      <DeviceRows list={devicesIn(view, devices)} focus={focus}
        mark={d => <>{unsavedFor(pd, d.key, 'params') ? <Unsaved /> : null}<Chip text={own[d.key] ? 'Own settings' : 'Default'} own={!!own[d.key]} /></>}
        body={d => <DeviceParams d={d} catalog={catalog} pd={pd} stored={own[d.key]} def={def} readOnly={readOnly} onEdit={onEdit} />} />
    </div>
  );
}

function DeviceParams({ d, catalog, pd, stored, def, readOnly, onEdit }) {
  const scope = { level: 'device', target: d.key };
  const id = 'value:' + sk(scope) + ':parameters.off', e = pd.drafts[id], changed = !readOnly && isChanged(e), resetting = !!(e && e.reset);
  const orig = [...(stored || def)].sort((a, b) => a - b);
  const off = new Set(!readOnly && e && !e.reset ? e.next : orig);
  const entry = (next, reset) => ({ kind: 'value', scope, key: 'parameters.off', label: 'Parameters for ' + devName(d), orig, next, reset });
  const toggle = pid => { const n = new Set(off); if (n.has(pid)) n.delete(pid); else n.add(pid); pd.put(id, entry([...n].sort((a, b) => a - b), false)); };
  const type = CODE_TYPE[d.typeCode];
  const available = p => !type || !p.availability || !['na', 'rnd'].includes(p.availability[type]);
  const shown = catalog.parameters.filter(available);
  const groupsOf = list => [...new Set(list.map(p => p.group))].map(g => [g, list.filter(p => p.group === g)]);
  const box = ([g, list]) => (
    <div key={g} style={{ borderRadius: 12, boxShadow: 'inset 0 0 0 1px ' + C.line, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <h4 style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#3B4552', letterSpacing: '.04em', textTransform: 'uppercase' }}>{g}</h4>
      {list.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '7px 0', borderTop: '1px solid #F0F3F7' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: off.has(p.id) ? C.mute : C.ink }}>{p.name}</span>
            <span style={{ fontSize: 12, color: C.mute }}>{p.shows}{p.alerts ? ' · alerts' : ''}</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: off.has(p.id) ? C.mute : C.ok, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {off.has(p.id) ? 'Not needed' : 'Needed'}
            {readOnly ? null : <Switch on={!off.has(p.id)} set={() => toggle(p.id)} label={p.name + ' needed on ' + devName(d)} disabled={resetting} />}
          </span>
        </div>
      ))}
    </div>
  );
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 12 };
  const sub = { margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: C.ink };
  if (readOnly) {
    const otherOff = shown.filter(p => !p.main && off.has(p.id));
    return (
      <>
        <h3 style={sub}>Main parameters <span style={{ fontWeight: 400, color: C.mute }}>· {stored ? 'own settings' : 'default'}</span></h3>
        <div style={grid}>{groupsOf(shown.filter(p => p.main)).map(box)}</div>
        <p style={note}><strong style={{ color: C.ink }}>Other parameters not needed:</strong> {otherOff.length ? otherOff.map(p => p.name).join(', ') : 'none'}.</p>
        <EditLink d={d} onEdit={onEdit} />
      </>
    );
  }
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.mute }}>Comes from <Badge from={stored ? 'device' : 'default'} /></span>
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          {resetting ? <Unsaved text="Resets on Save all" /> : changed ? <Unsaved /> : null}
          {changed ? <button type="button" onClick={() => pd.drop(id)} style={btn(false)}>Undo</button>
            : stored ? <button type="button" onClick={() => pd.put(id, entry(orig, true))} style={btn(false)} title="Remove this device's own list: the default applies again">Reset</button> : null}
        </span>
      </div>
      <h3 style={sub}>Main parameters</h3>
      <div style={grid}>{groupsOf(shown.filter(p => p.main)).map(box)}</div>
      <h3 style={sub}>All parameters for {devName(d)} <span style={{ fontWeight: 400, color: C.mute }}>· {shown.filter(p => !p.main).length} more</span></h3>
      <p style={{ ...note, marginTop: -8 }}>Each one on its own, only what this kind of box can report. A main parameter switched off also hides these details.</p>
      <div style={grid}>{groupsOf(shown.filter(p => !p.main)).map(box)}</div>
    </>
  );
}

// ---- e-mail alerts (0.2.1): for each device, who hears about its hardware alerts and who about its software alerts ------

const CONTACT_KEYS = [
  ['notify.hardware_contacts', 'Hardware alerts go to', 'Hardware alert contacts', 'Load, memory, storage, temperature, network, no contact.'],
  ['notify.software_contacts', 'Software alerts go to', 'Software alert contacts', 'Patches waiting, app data sync, services down.'],
];

// ---- the mail server (26 Nov 2026): set per environment (Notifier__… in web.config / the server's environment, or user
// secrets in development), shown and tested here ----------------------------------------------------------------------

function MailServerCard({ mail }) {
  const [to, setTo] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [test, setTest] = React.useState(null);   // { id, status, error, sentAt }
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const m = mail || {};
  const state = !m.configured ? ['No mail server is set for this environment. E-mails (alerts, patch links) wait in the outbox and go out once one is set.', C.bad]
    : !m.enabled ? ['A mail server is set, but sending is switched off (Notifier__Enabled is not true). E-mails wait in the outbox.', '#8A5200']
    : !m.serviceRunning ? ['Sending is on, but the sending service has not reported in recently. Check the API log.', '#8A5200']
    : ['Sending is on.', C.ok];
  const follow = (id, tries) => {
    api.sentMail(30).then(list => {
      const n = (list || []).find(x => x.id === id);
      if (n) setTest({ id, status: n.status, error: n.error, sentAt: n.sentAt, attempts: n.attempts });
      if ((!n || !['sent', 'failed', 'expired'].includes(n.status)) && tries > 0) timer.current = setTimeout(() => follow(id, tries - 1), 3000);
    }).catch(() => { if (tries > 0) timer.current = setTimeout(() => follow(id, tries - 1), 3000); });
  };
  const send = async () => {
    if (busy) return;
    if (!EMAIL.test(to.trim())) { setTest({ status: 'invalid', error: 'Enter one e-mail address.' }); return; }
    setBusy(true); clearTimeout(timer.current);
    try {
      const r = await api.testMail(to.trim());
      setTest({ id: r.id, status: 'pending' });
      follow(r.id, 30);
    } catch (e) { setTest({ status: 'invalid', error: e.message }); }
    finally { setBusy(false); }
  };
  const tLabel = !test ? '' : test.status === 'sent' ? 'Sent' + (test.sentAt ? ' at ' + fmtAt(test.sentAt) : '') + ': check the inbox (and the spam folder).'
    : test.status === 'failed' ? 'Failed after ' + (test.attempts || 0) + ' attempt(s).'
    : test.status === 'invalid' ? '' : (m.configured && m.enabled ? 'Queued: the sending service picks it up within about 30 seconds…' : 'Queued, but it waits until a mail server is set and sending is on.');
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 style={h2}>Mail server</h2>
        <p style={note}>Set for each environment on the server (web.config or environment variables), not here: change it there and restart the API.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '8px 18px', fontSize: 13 }}>
        <span><span style={{ color: C.mute }}>Status: </span><span style={{ color: state[1], fontWeight: 600 }}>{state[0]}</span></span>
        <span><span style={{ color: C.mute }}>Server: </span>{m.server || '—'}</span>
        <span><span style={{ color: C.mute }}>Sends as: </span>{m.from || '—'}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <input type="email" aria-label="Send a test e-mail to" placeholder="Send a test e-mail to…" value={to} onChange={e => setTo(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }} style={{ ...field, flex: '1 1 260px', maxWidth: 360 }} />
        <button type="button" id="mail-test" onClick={send} disabled={busy} style={btn(true, busy)}>{busy ? 'Sending…' : 'Send test e-mail'}</button>
      </div>
      {test ? <p role="status" style={{ ...note, color: test.status === 'sent' ? C.ok : test.status === 'failed' || test.status === 'invalid' ? C.bad : C.mute }}>
        {tLabel}{test.error ? (tLabel ? ' ' : '') + 'Reason: ' + test.error : ''}</p> : null}
    </div>
  );
}

function EmailPanel({ view, sp, pd, devices, focus, onEdit }) {
  const [got, setGot] = React.useState(null);   // as stored: setting key -> { device key: [...] }
  React.useEffect(() => {
    Promise.all(CONTACT_KEYS.map(([k]) => api.settingOverrides(k)))
      .then(lists => setGot(Object.fromEntries(CONTACT_KEYS.map(([k], i) =>
        [k, Object.fromEntries(lists[i].filter(o => o.level === 'device').map(o => [o.target, Array.isArray(o.value) ? o.value : []]))]))))
      .catch(e => sp.toast('Could not load the e-mail settings', e.message, 'error'));
  }, [sp, pd.version]);
  if (!got) return <div style={card}><p style={note}>Loading…</p></div>;
  const readOnly = view.mode !== 'devices';
  const counts = d => CONTACT_KEYS.map(([k]) => (got[k][d.key] || []).length);
  return (
    <div style={card}>
      <PanelHead pd={pd} title="Who gets alert e-mails" text="Critical alerts are e-mailed when they start and again when they clear: hardware alerts to the device's hardware contacts, software alerts such as patches to its software contacts. Warnings show in the portal only." />
      <DeviceRows list={devicesIn(view, devices)} focus={focus}
        mark={d => { const [h, s] = counts(d); return <>{unsavedFor(pd, d.key, 'email') ? <Unsaved /> : null}<Chip text={h + ' hardware · ' + s + ' software'} own={h + s > 0} /></>; }}
        body={d => <DeviceContacts d={d} got={got} pd={pd} readOnly={readOnly} onEdit={onEdit} />} />
    </div>
  );
}

function DeviceContacts({ d, got, pd, readOnly, onEdit }) {
  const scope = { level: 'device', target: d.key };
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 14, paddingTop: 8 }}>
        {CONTACT_KEYS.map(([key, label, short, help]) => {
          const id = 'value:' + sk(scope) + ':' + key, e = pd.drafts[id], stored = got[key][d.key] || [];
          const fid = rowId(d.key) + '-' + key.replace(/\W/g, '_');
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor={readOnly ? undefined : fid} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.ink }}>
                {label} {!readOnly && isChanged(e) ? <Unsaved /> : null}
              </label>
              <span style={note}>{help}</span>
              {readOnly ? <span style={{ fontSize: 13, color: stored.length ? C.ink : C.mute }}>{stored.length ? stored.join(', ') : 'No one'}</span>
                : <input id={fid} type="text" inputMode="email" value={e ? e.text : stored.join(', ')} placeholder="name@school.org, it@excelindia.com"
                    onChange={x => pd.put(id, { kind: 'value', scope, key, label: short + ' for ' + devName(d), emails: true, dropEmpty: true, orig: stored, text: x.target.value, next: emailsOf(x.target.value) })}
                    style={{ ...field, width: '100%' }} />}
            </div>
          );
        })}
      </div>
      {readOnly ? <EditLink d={d} onEdit={onEdit} /> : <span style={note}>Separate more than one address with commas; leave empty for none.</span>}
    </>
  );
}

// ---- users and what they see (review item 9) ---------------------------------------------------------

function UsersPanel({ sp, devices, pd }) {
  const [users, setUsers] = React.useState(null);
  const [open, setOpen] = React.useState(null);        // the user whose form is open
  const load = React.useCallback(() => { api.users().then(setUsers).catch(e => sp.toast('Could not load users', e.message, 'error')); }, [sp]);
  React.useEffect(load, [load, pd.version]);
  React.useEffect(() => setOpen(null), [pd.version]);
  const idOf = u => 'user:' + (u ? u.id : 'new');
  const baseOf = u => ({ name: u.name || '', role: u.role, active: u.active, customer: u.customer || '', contactEmail: u.contactEmail || '', password: '' });
  const formOf = u => { const e = pd.drafts[idOf(u)]; return e ? e.next : baseOf(u); };
  const FM = (u, patch) => {
    const e = pd.drafts[idOf(u)];
    if (e) pd.put(idOf(u), { ...e, next: { ...e.next, ...patch } });
    else if (u) pd.put(idOf(u), { kind: 'user', id: u.id, email: u.email, label: 'User ' + u.email, orig: baseOf(u), next: { ...baseOf(u), ...patch } });
  };
  const F = (u, k, x) => FM(u, { [k]: x });
  // the customers of the registered boxes, with what was entered at registration (sites, device types, contacts)
  const [customers, setCustomers] = React.useState(null);
  React.useEffect(() => { api.customers().then(setCustomers).catch(() => setCustomers([])); }, [pd.version]);
  const infoOf = c => (customers || []).find(x => normCustomer(x.name) === normCustomer(c));
  // choosing the customer fills in the client's name and contact e-mail from the registration, when they are still empty
  const pickCustomer = (u, c) => {
    const form = formOf(u), contact = ((infoOf(c) || {}).contacts || [])[0] || {};
    FM(u, { customer: c, ...(!String(form.name || '').trim() && contact.name ? { name: contact.name } : {}),
      ...(!String(form.contactEmail || '').trim() && contact.email ? { contactEmail: contact.email } : {}) });
  };
  const addNew = () => pd.put('user:new', { kind: 'user', isNew: true, id: 'new', orig: null, next: { email: '', name: '', role: 'client', customer: '', contactEmail: '', password: newPassword() } });
  const boxesOf = c => devices.filter(d => normCustomer(d.customer) === normCustomer(c) && normCustomer(c));
  // what the user sees: every box (admin, support), or the boxes of the client's customer ("No boxes match": a renamed customer)
  const access = u => u.role === 'admin' ? 'Every box (admin)' : u.role === 'support' ? 'Every box (support)'
    : !u.customer ? { warn: true, text: 'No customer: sees nothing' }
    : boxesOf(u.customer).length ? 'Customer ' + u.customer + ' · ' + boxesOf(u.customer).length + (boxesOf(u.customer).length === 1 ? ' box' : ' boxes')
    : { warn: true, text: 'Customer ' + u.customer + ' · No boxes match' };
  const formEl = u => {
    const form = formOf(u);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14, borderRadius: 12, background: C.soft, boxShadow: 'inset 0 0 0 1px ' + C.line }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {!u ? <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>Sign-in name (e-mail or username)<input type="text" value={form.email} onChange={e => F(u, 'email', e.target.value)} autoCapitalize="none" spellCheck={false} placeholder={form.role === 'client' ? 'e.g. eps.koorgalli' : 'e.g. name@excelsoftcorp.com'} style={field} /></label> : null}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>Name<input value={form.name} onChange={e => F(u, 'name', e.target.value)} style={field} /></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>Role
            <select value={form.role} onChange={e => F(u, 'role', e.target.value)} style={field}>{ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>{u ? 'New password (leave empty to keep)' : 'Temporary password (note it before Save all)'}
            <span style={{ display: 'flex', gap: 6 }}><input value={form.password} onChange={e => F(u, 'password', e.target.value)} style={{ ...field, flex: 1 }} autoComplete="new-password" />
              <button type="button" onClick={() => F(u, 'password', newPassword())} style={btn(false)}>New</button></span></label>
        </div>
        {u ? <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}><Switch on={!!form.active} set={x => F(u, 'active', x)} label="Account active" />Account active</label> : null}
        <p style={note}>{ROLE_HINT[form.role] || ''}</p>
        {form.role === 'client' ? (() => {
          const list = customers && customers.length ? customers.map(c => c.name) : customersOf(devices), seen = form.customer ? boxesOf(form.customer) : [];
          const info = form.customer ? infoOf(form.customer) : null, contact = info && (info.contacts || [])[0];
          const names = seen.length <= 5 ? seen.map(d => d.name || d.id).join(', ') : seen.slice(0, 5).map(d => d.name || d.id).join(', ') + ' and ' + (seen.length - 5) + ' more';
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>Customer (required)
                <select value={form.customer} onChange={e => pickCustomer(u, e.target.value)} aria-required="true" style={field}>
                  <option value="">Choose the customer…</option>
                  {form.customer && !list.some(c => normCustomer(c) === normCustomer(form.customer)) ? <option value={form.customer}>{form.customer} (no boxes now)</option> : null}
                  {list.map(c => { const i = infoOf(c); return <option key={c} value={c}>{c}{i ? ' · ' + i.boxes + (i.boxes === 1 ? ' box' : ' boxes') : ''}</option>; })}
                </select>
                <span style={{ fontSize: 12, color: form.customer && !seen.length ? '#8A5200' : C.mute }}>{!form.customer ? 'The customers of the registered boxes. A client sees nothing until its customer is chosen.' : seen.length ? 'Sees ' + seen.length + (seen.length === 1 ? ' box: ' : ' boxes: ') + names : 'No box has this customer now.'}</span>
                {info ? <span style={{ fontSize: 12, color: C.mute }}>{'Registered: ' + [(info.deviceTypes || []).join(', '), (info.sites || []).length ? 'site ' + info.sites.join(', ') : null,
                  contact ? 'contact ' + [contact.name, contact.email, contact.phone].filter(Boolean).join(' · ') : 'no contact given'].filter(Boolean).join(' · ')}</span> : null}
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: C.mute }}>Contact e-mail (optional, for patch e-mails)
                <input type="email" value={form.contactEmail} onChange={e => F(u, 'contactEmail', e.target.value)} placeholder="e.g. it@school.org" style={field} />
                <span style={{ fontSize: 12, color: C.mute }}>Gets the e-mail with the download links and the guide when Excelsoft releases a patch for these boxes.</span>
              </label>
            </div>
          );
        })() : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <button type="button" onClick={() => { pd.drop(idOf(u)); setOpen(null); }} style={btn(false)}>Cancel</button>
          <span style={note}>{u ? 'Changes are stored when you press Save all.' : 'The user is added when you press Save all.'}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 360px', minWidth: 0 }}><h2 style={h2}>Users & access</h2>
          <p style={note}>Each person signs in with their own account. Portal administrators and support engineers see every box; a client sees only its customer&apos;s boxes, view only. Changes apply from their next click.</p></div>
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          {!pd.drafts['user:new'] ? <button type="button" onClick={addNew} style={btn(false)}>Add user</button> : null}
          {pd.actions}
        </span>
      </div>
      {pd.drafts['user:new'] ? formEl(null) : null}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
          <thead><tr>{['Name', 'Sign-in name', 'Role', 'Boxes they see', 'Status', 'Last sign-in', ''].map(x => <th key={x} scope="col" style={th}>{x}</th>)}</tr></thead>
          <tbody>
            {(users || []).map(u => (
              <React.Fragment key={u.id}>
                <tr style={isChanged(pd.drafts[idOf(u)]) ? { background: '#FFFBF2' } : undefined}>
                  <td style={{ ...td, fontWeight: 600 }}>{u.name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{(ROLES.find(r => r[0] === u.role) || [0, u.role])[1]}</td>
                  <td style={{ ...td, maxWidth: 320, color: access(u).warn ? '#8A5200' : undefined, fontWeight: access(u).warn ? 600 : undefined }}>{access(u).warn ? access(u).text : access(u)}</td>
                  <td style={{ ...td, color: !u.active ? C.bad : u.locked ? '#8A5200' : C.ok, fontWeight: 600 }}>{!u.active ? 'Disabled' : u.locked ? 'Locked' : 'Active'}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtAt(u.lastLoginAt)}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {isChanged(pd.drafts[idOf(u)]) ? <Unsaved /> : null}
                      <button type="button" onClick={() => setOpen(open === u.id ? null : u.id)} style={btn(false)}>{open === u.id ? 'Close' : 'Edit'}</button>
                    </span>
                  </td>
                </tr>
                {open === u.id ? <tr><td colSpan={7} style={{ padding: '6px 0 12px' }}>{formEl(u)}</td></tr> : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- fleet-wide monitoring values (moved here from the device page) ---------------------------------------

// The latest value of a prop, for effects that must not re-run when it changes: `sp` is a new object on every render of
// the Settings page and a toast re-renders it, so an effect depending on `sp` that toasts on an error loads again and
// again (25 Nov 2026: GET /agents ran many times a second while the API answered 404).
function useLatest(v) {
  const r = React.useRef(v);
  r.current = v;
  return r;
}

function MonitoringPanel({ sp, pd }) {
  const [stored, setStored] = React.useState(null);
  const spr = useLatest(sp);
  React.useEffect(() => { api.monitoringSettings().then(setStored).catch(e => spr.current.toast('Could not load', e.message, 'error')); }, [spr, pd.version]);
  if (!stored) return <div style={card}><p style={note}>Loading…</p></div>;
  const e = pd.drafts.monitoring, v = e ? e.next : stored;
  const S = (k, x) => pd.put('monitoring', { kind: 'monitoring', label: 'Monitoring', orig: stored, next: { ...v, [k]: x } });
  const num = (label, val, set, unit, hint) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: C.ink }}>{label}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 400 }}><input type="number" value={val} onChange={x => set(x.target.value)} style={{ ...field, width: 110 }} />{unit}</span>
      <span style={{ ...note, fontWeight: 400 }}>{hint}</span></label>
  );
  const wh = v.working_hours || WORK_DEFAULT, oa = v.offline_alert || {};
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 360px', minWidth: 0 }}><h2 style={h2}>Monitoring</h2>
          <p style={note}>How the portal judges every box. These used to show on each device page; they are set here and apply to all devices.</p></div>
        {pd.actions}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        {num('Longest wait before "No contact"', v.offline_after_minutes, x => S('offline_after_minutes', x), 'min', 'A box is shown as No contact after one missed reading, never later than this.')}
        {num('"No contact" alert in working hours', oa.working_hours_minutes, x => S('offline_alert', { ...oa, working_hours_minutes: x }), 'min', 'Counted only inside the working hours below.')}
        {num('"No contact" alert at any time', oa.any_time_minutes, x => S('offline_alert', { ...oa, any_time_minutes: x }), 'min', 'Counted day and night.')}
        {num('Late reading after', v.late_after_extra_minutes, x => S('late_after_extra_minutes', x), 'min extra', 'A reading that arrives this much later than its interval counts as late.')}
        {num('Data at risk after', v.data_loss_risk_days, x => S('data_loss_risk_days', x), 'days offline', 'Boxes keep readings for 15 days without internet; warn this many days in.')}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: C.ink }}>Time zone
          <input value={v.time_zone || ''} onChange={x => S('time_zone', x.target.value)} style={{ ...field, width: 200 }} />
          <span style={{ ...note, fontWeight: 400 }}>For days, working hours and e-mail times, e.g. Asia/Kolkata.</span></label>
      </div>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <legend style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Working hours</legend>
        {DAYS.map((d, i) => (
          <label key={d} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
            <input type="checkbox" checked={wh.days.includes(i)} onChange={() => S('working_hours', { ...wh, days: wh.days.includes(i) ? wh.days.filter(x => x !== i) : [...wh.days, i].sort() })} />{d}</label>
        ))}
        <input type="time" aria-label="From" value={wh.from} onChange={x => S('working_hours', { ...wh, from: x.target.value })} style={field} />
        <span>to</span>
        <input type="time" aria-label="To" value={wh.to} onChange={x => S('working_hours', { ...wh, to: x.target.value })} style={field} />
      </fieldset>
    </div>
  );
}

// ---- Agent releases (TD-AGENT-DOWNLOAD): the device agent packages; registration offers the latest one ------------------------

const kb = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

function AgentsPanel({ sp }) {
  const [data, setData] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [notes, setNotes] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirm, setConfirm] = React.useState(null);
  const pick = React.useRef(null);
  const [loadErr, setLoadErr] = React.useState('');
  // loads once (and after an upload or delete); a failure shows here, with Try again, and is not retried by itself
  const load = React.useCallback(() => api.agents().then(d => { setData(d); setLoadErr(''); }).catch(e => setLoadErr(e.message)), []);
  React.useEffect(() => { load(); }, [load]);
  const max = (data && data.maxBytes) || 26214400, storage = data && data.storage;
  const choose = e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setErr(!/\.zip$/i.test(f.name) ? 'Choose the agent package, a .zip file (saras-device-agent-X.Y.Z.zip).' : f.size > max ? 'The package is larger than ' + kb(max) + '.' : '');
    setFile(f);
  };
  const upload = async () => {
    if (!file || err || busy) return;
    setBusy(true);
    try {
      await api.uploadAgent(file, notes.trim() || null);
      sp.toast('Agent uploaded', file.name + ' is now the agent new boxes get.');
      setFile(null); setNotes(''); setErr('');
      await load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };
  const remove = async a => {
    setBusy(true);
    try { await api.deleteAgent(a.id); sp.toast('Agent deleted', a.version + ' is no longer offered.'); setConfirm(null); await load(); }
    catch (e) { sp.toast('Could not delete the agent', e.message, 'error'); }
    finally { setBusy(false); }
  };
  const list = (data && data.agents) || [];
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 style={h2}>Agent releases</h2>
        <p style={note}>The device agent packages. Registering a box, re-keying it or making a new enrolment code offers the latest one, with the commands that download and install it on the box; a device&apos;s page offers it to update the box.</p></div>
      {storage && !storage.ready ? <p role="alert" style={{ ...note, color: C.bad }}>The storage is not ready: {storage.error}</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 12, background: C.soft }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Upload a new agent</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <input ref={pick} type="file" accept=".zip,application/zip" onChange={choose} style={{ display: 'none' }} aria-label="Agent package" />
          <button type="button" onClick={() => pick.current && pick.current.click()} disabled={busy} style={btn(false)}>{file ? 'Choose another' : 'Choose the package (.zip)'}</button>
          <span style={{ fontSize: 13, color: file ? C.ink : C.mute, overflowWrap: 'anywhere' }}>{file ? file.name + ' · ' + kb(file.size) : 'saras-device-agent-X.Y.Z.zip, up to ' + kb(max)}</span>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: C.ink }}>Release notes (optional)
          <input value={notes} maxLength={2000} onChange={e => setNotes(e.target.value)} placeholder="What changed in this agent" style={{ ...field, width: '100%' }} /></label>
        <p style={{ ...note, fontWeight: 400 }}>The version is read from the package (AGENT_VERSION in saras_agent.py) and must be newer than the latest; the package must have agent/setup-device.sh and agent/install-agent.sh.</p>
        {err ? <p role="alert" style={{ ...note, color: C.bad }}>{err}</p> : null}
        <div><button type="button" id="ag-go" onClick={upload} disabled={!file || !!err || busy || (storage && !storage.ready)} style={btn(true, !file || !!err || busy)}>{busy && file ? 'Uploading…' : 'Upload agent'}</button></div>
      </div>
      {loadErr && !data ? (
        <p role="alert" style={{ ...note, color: C.bad }}>Could not load the agent releases: {loadErr}{' '}
          <button type="button" onClick={load} style={{ ...btn(false), height: 30, marginLeft: 6 }}>Try again</button></p>
      ) : !data ? <p style={note}>Loading…</p> : !list.length ? <p style={note}>No agent uploaded yet. Until one is, registration shows only the setup command, and the agent folder must be copied to the box by hand.</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead><tr>{['Version', 'Package', 'Uploaded', 'Downloads', 'Notes', ''].map(x => <th key={x} scope="col" style={th}>{x}</th>)}</tr></thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id}>
                  <td style={{ ...td, whiteSpace: 'nowrap', fontWeight: 600 }}>{a.version}{a.latest ? <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: '#E7F6EC', color: C.ok, fontSize: 11.5, fontWeight: 600 }}>Latest · offered</span> : null}</td>
                  <td style={td}><span style={{ overflowWrap: 'anywhere' }}>{a.fileName}</span><br /><span style={{ color: C.mute, fontSize: 12 }}>{kb(a.size)} · SHA-256 {String(a.sha256).slice(0, 12)}…</span></td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtAt(a.uploadedAt)}<br /><span style={{ color: C.mute, fontSize: 12 }}>{a.uploadedBy}</span></td>
                  <td style={td}>{a.downloads}</td>
                  <td style={{ ...td, color: C.mute, fontSize: 12 }}>{a.notes || ''}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {confirm === a.id ? (
                      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: C.bad }}>Delete {a.version}?</span>
                        <button type="button" onClick={() => remove(a)} disabled={busy} style={{ ...btn(false), color: C.bad, borderColor: '#F1C4C4' }}>Delete</button>
                        <button type="button" onClick={() => setConfirm(null)} style={btn(false)}>Keep</button>
                      </span>
                    ) : <button type="button" aria-label={'Delete agent ' + a.version} onClick={() => setConfirm(a.id)} disabled={busy} style={btn(false)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AuditPanel({ sp }) {
  const [rows, setRows] = React.useState(null);
  const spr = useLatest(sp);
  React.useEffect(() => { api.audit(200).then(setRows).catch(e => spr.current.toast('Could not load the audit log', e.message, 'error')); }, [spr]);
  const brief = d => d ? JSON.stringify(d).replace(/[{}"]/g, '').replace(/,/g, ', ').replace(/:/g, ': ').slice(0, 180) : '';
  return (
    <div style={card}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h2 style={h2}>Audit log</h2><p style={note}>Who changed what, newest first (the last 200).</p></div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
          <thead><tr>{['When', 'Who', 'What', 'On', 'Details', 'Result'].map(x => <th key={x} scope="col" style={th}>{x}</th>)}</tr></thead>
          <tbody>
            {(rows || []).map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtAt(r.at)}</td><td style={td}>{r.user || '—'}</td><td style={td}>{r.action}</td>
                <td style={td}>{r.target || ''}</td><td style={{ ...td, color: C.mute, fontSize: 12 }}>{brief(r.details)}</td>
                <td style={{ ...td, color: r.outcome === 'ok' ? C.ok : C.bad }}>{r.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Save all ---------------------------------------------------------------------------------------

// a change that cannot be stored as typed; every change is checked before anything is sent
const problem = e => {
  if (!isChanged(e) || e.reset) return null;
  if (e.kind === 'value' && e.emails) {
    const bad = e.next.find(x => !EMAIL.test(x));
    if (bad) return e.label + ': "' + bad + '" is not an e-mail address.';
    if (e.next.length > 20) return e.label + ': at most 20 addresses.';
  }
  if (e.kind === 'rule') {
    const m = MEASURES.find(x => x.name === e.name), v = e.next;
    const lv = m.fixed ? [] : ['warn', 'crit'].filter(k => m[k] && e.base[m[k]]);
    if (lv.some(k => String(v[k]).trim() === '' || !isFinite(Number(v[k])))) return m.name + ': the levels must be numbers.';
    if (!m.fixed && (!Number.isInteger(Number(v.times)) || Number(v.times) < 1 || Number(v.times) > 100)) return m.name + ': readings in a row is 1 to 100.';
    if (lv.length === 2 && Number(v.warn) >= Number(v.crit)) return m.name + ': the warning level must be below the critical level.';
  }
  if (e.kind === 'monitoring') {
    const v = e.next, oa = v.offline_alert || {};
    if ([v.offline_after_minutes, v.late_after_extra_minutes, v.data_loss_risk_days, oa.working_hours_minutes, oa.any_time_minutes]
      .some(x => String(x ?? '').trim() === '' || !isFinite(Number(x)))) return 'Monitoring: every time must be a number.';
  }
  if (e.kind === 'user' && e.isNew) {
    const login = String(e.next.email).trim();
    if (!EMAIL.test(login) && !LOGIN.test(login.toLowerCase())) return 'New user: enter their e-mail address or a username (3–40 letters, digits, dots, dashes).';
    if (!e.next.password) return 'New user: set a temporary password.';
  }
  if (e.kind === 'user' && e.next.role === 'client') {
    if (!String(e.next.customer || '').trim()) return (e.isNew ? 'New user' : e.label) + ': choose the client\'s customer.';
    if (String(e.next.contactEmail || '').trim() && !EMAIL.test(String(e.next.contactEmail).trim())) return (e.isNew ? 'New user' : e.label) + ': the contact e-mail is not valid.';
  }
  return null;
};

const describe = e => e.isNew ? 'new user ' + (String(e.next.email).trim() || '(no e-mail yet)') : e.label + (e.reset ? ' (reset)' : '');

async function saveRuleChange(e) {
  const m = MEASURES.find(x => x.name === e.name);
  if (e.reset) {
    for (const code of Object.keys(e.base).filter(c => e.base[c].from === e.scope.level)) await api.resetRule({ rule: code, ...scopeQuery(e.scope) });
    return;
  }
  const v = e.next, times = Number(v.times);
  for (const [code, r] of Object.entries(e.base)) {
    const raise = Number(code === m.warn ? v.warn : v.crit), gap = r.raise - r.clear;   // the clear level keeps its distance below the alert level
    await api.saveRule({ rule: code, type: e.scope.level === 'type' ? e.scope.target : null, device: e.scope.level === 'device' ? e.scope.target : null,
      customer: e.scope.level === 'customer' ? e.scope.target : null, title: r.title, severity: r.severity, metric: r.metric, op: r.op,
      raise: m.fixed ? r.raise : raise, clear: m.fixed ? r.clear : raise - gap, consecutive: m.fixed ? r.consecutive : times, enabled: !!v.on, notify: !!r.notify });
  }
}

async function saveUserChange(e) {
  const n = e.next, name = String(n.name || '').trim(), client = n.role === 'client';
  const customer = client ? String(n.customer || '').trim() : null, contact = client ? String(n.contactEmail || '').trim().toLowerCase() : null;
  if (e.isNew) {
    await api.addUser({ email: String(n.email).trim().toLowerCase(), name, role: n.role, password: n.password, customer, contactEmail: contact || null });
    return;
  }
  const o = e.orig, oCustomer = o.role === 'client' ? String(o.customer || '').trim() : null;
  if (name !== String(o.name || '').trim() || n.role !== o.role || n.active !== o.active || n.password || customer !== oCustomer
      || (client && contact !== String(o.contactEmail || '').trim().toLowerCase()))
    await api.editUser(e.id, { name, role: n.role, active: n.active, password: n.password || null, customer, contactEmail: client ? contact : null });
}

// ---- the page ---------------------------------------------------------------------------------------

export default function SettingsPage(v) {
  const sp = v.settings;
  const [tab, setTab] = React.useState('devices');
  // what the Parameters, Alert thresholds and E-mail alerts tabs list: every device (to change), or one customer's or product's devices (read-only)
  const [view, setView] = React.useState({ mode: 'devices', target: null });
  const [focus, setFocus] = React.useState(null);   // { key, at }: open this device in the Devices list and scroll to it
  const [devices, setDevices] = React.useState([]);
  const [catalog, setCatalog] = React.useState(null);
  const [drafts, setDrafts] = React.useState({});   // id -> unsaved change: nothing is stored until Save all
  const [version, setVersion] = React.useState(0);  // goes up after Save all, so every tab loads the stored values again
  const [saving, setSaving] = React.useState(false);
  const put = React.useCallback((id, e) => setDrafts(d => ({ ...d, [id]: e })), []);
  const drop = React.useCallback(id => setDrafts(d => { if (!(id in d)) return d; const n = { ...d }; delete n[id]; return n; }), []);
  const pending = Object.entries(drafts).filter(([, e]) => isChanged(e));
  const dirty = pending.length > 0;
  React.useEffect(() => {
    if (!dirty) return undefined;
    const ask = ev => { ev.preventDefault(); ev.returnValue = ''; };   // the browser asks before a reload or a closed tab loses them
    window.addEventListener('beforeunload', ask);
    return () => window.removeEventListener('beforeunload', ask);
  }, [dirty]);
  React.useEffect(() => {
    if (!sp) return;
    // registered devices only: a box exists in the portal once it is registered (revoked ones are left out)
    api.fleetDevices().then(f => setDevices(f.devices.filter(d => d.statusCode !== 'revoked'))).catch(() => setDevices([]));
    api.settingsCatalog().then(setCatalog).catch(e => sp.toast('Could not load the settings', e.message, 'error'));
  }, [sp && sp.openedAt]);   // eslint-disable-line react-hooks/exhaustive-deps
  // opened from a device's page: its thresholds, open in the Devices list
  React.useEffect(() => {
    if (!sp || !sp.scope) return;
    setView({ mode: 'devices', target: null });
    if (sp.scope.level === 'device' && sp.scope.target) setFocus({ key: sp.scope.target, at: Date.now() });
    setTab('rules');
  }, [sp && sp.scope && sp.scope.target]);   // eslint-disable-line react-hooks/exhaustive-deps
  if (!v.isSettings || !sp) return null;
  const onEdit = d => { setView({ mode: 'devices', target: null }); setFocus({ key: d.key, at: Date.now() }); };
  const sp2 = { ...sp, deviceName: key => { const d = devices.find(x => x.key === key); return d ? d.name || d.id : null; } };
  const pd = { drafts, put, drop, version };
  const count = n => n + (n === 1 ? ' change' : ' changes');

  const saveAll = async () => {
    const list = Object.entries(drafts).filter(([, e]) => isChanged(e));
    if (!list.length || saving) return;
    const bad = list.map(([, e]) => problem(e)).filter(Boolean);
    if (bad.length) { sp.toast('Nothing saved yet', bad.join(' '), 'error'); return; }
    setSaving(true);
    const done = [], failed = [];
    const attempt = async (items, f) => {
      try { await f(); done.push(...items); } catch (err) { failed.push(items.map(([, e]) => describe(e)).join(', ') + ': ' + err.message); }
    };
    try {
      // settings and parameters: one call for each scope (all devices, a product, a customer, one device)
      const byScope = new Map();
      for (const it of list.filter(([, e]) => e.kind === 'value')) byScope.set(sk(it[1].scope), [...(byScope.get(sk(it[1].scope)) || []), it]);
      for (const items of byScope.values()) {
        const sc = items[0][1].scope;
        await attempt(items, () => api.saveSettingValues(sc.level, sc.target,
          Object.fromEntries(items.map(([, e]) => [e.key, e.reset || (e.dropEmpty && !e.next.length) ? null : e.next]))));
      }
      for (const it of list.filter(([, e]) => e.kind === 'rule')) await attempt([it], () => saveRuleChange(it[1]));
      for (const it of list.filter(([, e]) => e.kind === 'monitoring')) await attempt([it], () => api.saveMonitoringSettings(monitoringBody(it[1].next)));
      for (const it of list.filter(([, e]) => e.kind === 'user')) await attempt([it], () => saveUserChange(it[1]));
    } finally {
      // what was stored leaves the list, unless it was changed again while saving
      setDrafts(d => { const n = { ...d }; for (const [id, e] of done) if (n[id] === e) delete n[id]; return n; });
      setVersion(x => x + 1);
      setSaving(false);
    }
    if (done.length) sp.changed();
    const added = done.filter(([, e]) => e.isNew).map(([, e]) => String(e.next.email).trim());
    if (!failed.length) sp.toast('Saved', count(done.length) + ' saved. Boxes use them within a minute.' + (added.length ? ' Give ' + added.join(', ') + ' the temporary password.' : ''));
    else sp.toast(done.length ? 'Some changes not saved' : 'Not saved', (done.length ? count(done.length) + ' saved. ' : '') + 'Not saved: ' + failed.join('; ') + '. Fix them and press Save all again.', 'error');
  };
  const discard = () => { if (window.confirm('Discard ' + count(pending.length) + '? Nothing has been stored yet.')) setDrafts({}); };
  const leave = () => {
    if (dirty && !window.confirm('You have ' + count(pending.length) + ' not saved. Leave without saving them?')) return;
    setDrafts({}); sp.close();
  };
  const changedTabs = new Set(pending.map(([, e]) => TAB_OF(e)));
  // one Save all for every change on every tab, shown in the right corner of each section's heading
  pd.actions = (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
      {dirty ? <span title={pending.map(([, e]) => describe(e)).join('\n')} style={{ fontSize: 13, fontWeight: 600, color: '#8A5200', background: '#FEF3E2', padding: '8px 12px', borderRadius: 9, whiteSpace: 'nowrap' }}>{count(pending.length)} not saved</span> : null}
      {dirty ? <button type="button" disabled={saving} onClick={discard} style={btn(false, saving)}>Discard</button> : null}
      <button type="button" disabled={saving || !dirty} onClick={saveAll} style={btn(true, saving || !dirty)}>{saving ? 'Saving…' : 'Save all'}</button>
    </span>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT, color: C.ink }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 420px', minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Settings</h1>
          <span style={{ fontSize: 13, color: C.mute }}>Registered devices, what is monitored, when it alerts, who is e-mailed and who sees which box. Change what you need, then press Save all once. Every change is in the audit log.</span>
        </div>
        <button type="button" onClick={leave} style={btn(false)}>Back to the dashboard</button>
      </div>
      <div role="tablist" aria-label="Settings" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k ? 'true' : 'false'} onClick={() => setTab(k)}
            style={{ height: 38, padding: '0 16px', borderRadius: 10, border: 0, background: tab === k ? C.blue : '#FFFFFF', color: tab === k ? '#FFFFFF' : '#3B4552',
              boxShadow: tab === k ? 'none' : 'inset 0 0 0 1px ' + C.line, fontFamily: FONT, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {label}{changedTabs.has(k) ? <span title="Unsaved changes" style={{ width: 7, height: 7, borderRadius: '50%', background: tab === k ? '#FFFFFF' : '#E09A1A' }} /> : null}
          </button>
        ))}
      </div>
      {VIEWED.includes(tab) ? <ViewBar view={view} setView={setView} devices={devices} /> : null}
      {tab === 'devices' ? <DevicesPanel devices={devices} /> : null}
      {tab === 'params' && catalog ? <ParamsPanel view={view} catalog={catalog} sp={sp2} devices={devices} pd={pd} focus={focus} onEdit={onEdit} /> : null}
      {tab === 'rules' ? <RulesPanel view={view} sp={sp2} pd={pd} devices={devices} focus={focus} onEdit={onEdit} /> : null}
      {tab === 'email' ? <MailServerCard mail={catalog && catalog.mail} /> : null}
      {tab === 'email' ? <EmailPanel view={view} sp={sp2} pd={pd} devices={devices} focus={focus} onEdit={onEdit} /> : null}
      {tab === 'users' ? <UsersPanel sp={sp2} devices={devices} pd={pd} /> : null}
      {tab === 'monitoring' ? <MonitoringPanel sp={sp2} pd={pd} /> : null}
      {tab === 'agents' ? <AgentsPanel sp={sp2} /> : null}
      {tab === 'audit' ? <AuditPanel sp={sp2} /> : null}
    </div>
  );
}
