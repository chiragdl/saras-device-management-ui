// Full readings (Diagnostics): one reading as the box sent it (heartbeat saras.heartbeat/1, CONTRACT.md section 3) as
// labelled sections people can read, and the same as plain text for download. Every field is shown: a field this file
// does not know (a newer agent) appears under its own name, so nothing the box sent is hidden. The JSON stays one
// click away. A view is { glance: [{ label, value, tone }], sections: [{ key, title, rows?, table?, note? }], hourly }:
// rows are [label, value, tone], a table is { cols, rows, wrap } with cells as text or { v, tone } (wrap: the column of
// long text); tone is warn, crit, ok, muted or undefined.

const NUM = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const AT = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const n = (x, u) => x == null || typeof x !== 'number' ? (x == null ? null : String(x)) : NUM.format(x) + (u ? ' ' + u : '');
export const at = x => { if (!x) return null; const t = new Date(x); return isNaN(t) ? String(x) : AT.format(t); };
const dur = s => {
  if (s == null) return null;
  s = Math.round(s);
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
  return s < 60 ? s + ' s' : s < 3600 ? m + ' min' : s < 86400 ? h + ' h' + (m ? ' ' + m + ' min' : '') : d + ' d' + (h ? ' ' + h + ' h' : '');
};
const yes = b => b == null ? null : b ? 'Yes' : 'No';
const size = mb => mb == null ? null : mb >= 1024 ? NUM.format(Math.round(mb / 102.4) / 10) + ' GB' : n(mb, 'MB');
const band = (x, b) => x == null || !b ? undefined : b.crit != null && x >= b.crit ? 'crit' : b.warn != null && x >= b.warn ? 'warn' : undefined;
const over0 = tn => x => x ? tn : undefined;

// a field this file does not know: its name, and its value with the unit its name ends in
const UNIT = [[/_pct$/, '%'], [/_mb$/, 'MB'], [/_gb$/, 'GB'], [/_c$/, '°C'], [/_w$/, 'W'], [/_ms$/, 'ms'], [/_mhz$/, 'MHz'],
  [/_dbm$/, 'dBm'], [/_mbps$/, 'Mbps'], [/_rpm$/, 'rpm'], [/_h$/, 'h']];
export const label = k => {
  const t = String(k).replace(/_(pct|mb|gb|c|w|ms|s|mhz|dbm|mbps|rpm|h)$/, '').replace(/[_:]+/g, ' ').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const flat = o => Object.entries(o).map(([k, x]) => label(k) + ' ' + (val(k, x) ?? '—')).join(', ') || 'None';
export function val(key, v) {
  if (v == null || v === '') return null;
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') {
    if (/_s$/.test(key)) return v < 60 && !Number.isInteger(v) ? n(v, 's') : dur(v);
    const u = UNIT.find(([re]) => re.test(key));
    return n(v, u && u[1]);
  }
  if (typeof v === 'string') return ISO.test(v) ? at(v) : v;
  if (Array.isArray(v)) return v.length ? v.map(x => x != null && typeof x === 'object' ? flat(x) : String(x)).join(', ') : 'None';
  return flat(v);
}

/** Rows of one block: the known fields in `spec` order ([key, label, format(value, block), tone(value, block)]),
 *  then every other field under its own name. Empty fields are left out. */
function rows(obj, spec, skip = []) {
  const out = [], seen = new Set(skip);
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, lab, fmt, tn] of spec) {
    seen.add(k);
    if (!(k in obj)) continue;
    const v = fmt ? fmt(obj[k], obj) : val(k, obj[k]);
    if (v != null && v !== '') out.push([lab, v, typeof tn === 'function' ? tn(obj[k], obj) : tn]);
  }
  for (const [k, x] of Object.entries(obj)) {
    if (seen.has(k)) continue;
    const v = val(k, x);
    if (v != null) out.push([label(k), v]);
  }
  return out;
}

const SVC = { up: ['Up', 'ok'], down: ['Down', 'crit'], degraded: ['Degraded', 'warn'], unknown: ['Unknown', 'muted'], not_configured: ['Not set up', 'muted'] };
const svcStatus = s => (SVC[s] || [s || '—'])[0];
const svcName = name => {
  const s = String(name || '');
  if (s.startsWith('container:')) return s.slice(10) + ' (container)';
  if (s.startsWith('systemd:')) return s.slice(8).replace(/\.service$/, '') + ' (system service)';
  return { 'app-live': 'App: live check', 'app-ready': 'App: ready check', postgres: 'Database (PostgreSQL)', vllm: 'AI model server (vLLM)' }[s] || s;
};
const ZONE = { tj: 'Chip junction (Tj)', cpu: 'CPU', gpu: 'GPU', soc: 'SoC', nvme: 'NVMe disk', uncore: 'Uncore',
  cpu0_e: 'CPU cluster 0, efficiency cores', cpu0_p: 'CPU cluster 0, performance cores',
  cpu1_e: 'CPU cluster 1, efficiency cores', cpu1_p: 'CPU cluster 1, performance cores' };
const KERNEL = { io_error: 'disk I/O', fs_error: 'file system', hardware_error: 'hardware', nvme_error: 'NVMe', mmc_error: 'SD/eMMC',
  under_voltage: 'under-voltage', thermal: 'overheating', oom_kill: 'out of memory' };
const LEVEL = { critical: ['Critical', 'crit'], error: ['Error', 'crit'], warning: ['Warning', 'warn'] };
const SOURCE = { system: 'System', kernel: 'Kernel', app: 'Application' };
const SHUTDOWN = { poweroff: 'Switching off', reboot: 'Restarting', halt: 'Halting', shutdown: 'Shutting down' };
const HOURLY = { software: 'Software', updates: 'Updates', faults: 'Failures & crash signs', storage: 'Disk space by use' };

/** The readable view of one reading. `receivedAt` is when the server got it; `th` the alert thresholds (cpu, ram, disk,
 *  gpu, gpuTemp: { warn, crit }) used to mark values. */
export function readingView(r, { receivedAt, th } = {}) {
  r = r && typeof r === 'object' ? r : {};
  th = th || {};
  const sys = r.system || {}, sections = [], glance = [];
  const add = (key, title, x) => { if (x && ((x.rows && x.rows.length) || (x.table && x.table.rows.length))) sections.push({ key, title, ...x }); };

  // at a glance
  const disks = Array.isArray(sys.disks) ? sys.disks : [];
  const temps = Object.values(r.thermal_c || {}).filter(x => typeof x === 'number');
  const svcs = Array.isArray(r.services) ? r.services : [];
  const counted = svcs.filter(x => x && (x.status === 'up' || x.status === 'down' || x.status === 'degraded'));
  const logLines = (r.logs && Array.isArray(r.logs.entries)) ? r.logs.entries : [];
  if (r.shutdown) glance.push({ label: 'Shutdown notice', value: SHUTDOWN[r.shutdown.kind] || r.shutdown.kind || 'Yes', tone: 'muted' });
  if (sys.cpu_pct != null) glance.push({ label: 'CPU', value: n(sys.cpu_pct, '%'), tone: band(sys.cpu_pct, th.cpu) });
  if (sys.ram_pct != null) glance.push({ label: 'Memory', value: n(sys.ram_pct, '%'), tone: band(sys.ram_pct, th.ram) });
  if (disks[0] && disks[0].pct != null) glance.push({ label: 'Disk ' + (disks[0].mount || ''), value: n(disks[0].pct, '%'), tone: band(disks[0].pct, th.disk) });
  if (temps.length) glance.push({ label: 'Hottest', value: n(Math.max(...temps), '°C'), tone: band(Math.max(...temps), th.gpuTemp) });
  if (r.power && r.power.total_w != null) glance.push({ label: 'Power', value: n(r.power.total_w, 'W') });
  if (counted.length) {
    const up = counted.filter(x => x.status === 'up').length;
    glance.push({ label: 'Services', value: up + ' of ' + counted.length + ' up',
      tone: counted.some(x => x.status === 'down') ? 'crit' : counted.some(x => x.status === 'degraded') ? 'warn' : 'ok' });
  }
  if (r.logs) glance.push({ label: 'Warnings & errors', value: String(logLines.length),
    tone: logLines.some(x => x.level === 'critical' || x.level === 'error') ? 'crit' : logLines.length ? 'warn' : 'ok' });
  if (r.buffered) glance.push({ label: 'Arrived', value: 'Uploaded later', tone: 'muted' });

  // the reading and the box
  const top = rows(r, [
    ['sent_at', 'Taken at (box clock)'],
    ['buffered', 'How it arrived', v => v == null ? null : v ? 'Taken while offline, uploaded later' : 'Sent at once'],
    ['seq', 'Reading number', v => v == null ? null : n(v) + ' since the agent started'],
    ['interval_s', 'Reading every', v => dur(v)],
    ['agent_version', 'Agent version'],
    ['device_id', 'Device ID'],
    ['boot_id', 'Boot ID'],
    ['schema', 'Format'],
  ], Object.keys(r).filter(k => r[k] != null && typeof r[k] === 'object'));
  if (receivedAt) top.splice(1, 0, ['Received by the server', at(receivedAt)]);
  add('box', 'Reading & box', { rows: [...top,
    ...rows(r.identity, [['serial', 'Serial number'], ['model', 'Model'], ['device_type', 'Box type'], ['hostname', 'Host name'], ['lan_ip', 'LAN IP address']]),
    ...rows(r.claimed, [['product', 'Product'], ['site_code', 'Site code'], ['customer', 'Customer']])] });

  // system
  const cores = Array.isArray(sys.cpu_per_core_pct) ? sys.cpu_per_core_pct : null;
  add('system', 'System', { rows: rows(sys, [
    ['booted_at', 'Started at'],
    ['uptime_s', 'Running for', v => dur(v)],
    ['ntp_synced', 'Clock synchronised', yes, v => v === false ? 'warn' : undefined],
    ['cpu_pct', 'CPU use', v => n(v, '%'), v => band(v, th.cpu)],
    ['cpu_per_core_pct', 'CPU cores', () => cores && cores.length ? cores.length + ' cores, busiest ' + n(Math.max(...cores), '%') + ' · each: ' + cores.map(x => n(x)).join(' · ') + ' %' : null],
    ['cpu_freq_mhz', 'CPU speed', v => n(v, 'MHz')],
    ['load_1m', 'Load (1 / 5 / 15 min)', (v, o) => [o.load_1m, o.load_5m, o.load_15m].some(x => x != null) ? [o.load_1m, o.load_5m, o.load_15m].map(x => x == null ? '—' : n(x)).join(' / ') : null],
    ['ram_used_mb', 'Memory used', (v, o) => v == null ? null : size(v) + (o.ram_total_mb != null ? ' of ' + size(o.ram_total_mb) : '') + (o.ram_pct != null ? ' (' + n(o.ram_pct, '%') + ')' : ''), (v, o) => band(o.ram_pct, th.ram)],
    ['swap_pct', 'Swap used', v => n(v, '%')],
    ['journal_mb', 'System journal size', size],
    ['var_log_mb', 'Log folder size (/var/log)', size],
  ], ['load_5m', 'load_15m', 'ram_total_mb', 'ram_pct', 'disks']) });
  add('disks', 'Disks', { table: { cols: ['Disk', 'Used', 'Free', 'Size', 'Used %'], rows: disks.map(x => [x.mount || '—', n(x.used_gb, 'GB') || '—', n(x.free_gb, 'GB') || '—', n(x.total_gb, 'GB') || '—',
    { v: n(x.pct, '%') || '—', tone: band(x.pct, th.disk) }]) } });

  // GPU, temperatures, power, network
  add('gpu', 'GPU', { rows: rows(r.gpu, [
    ['name', 'Name'],
    ['util_pct', 'Use', v => n(v, '%'), v => band(v, th.gpu)],
    ['temp_c', 'Temperature', v => n(v, '°C'), v => band(v, th.gpuTemp)],
    ['clock_mhz', 'Clock', (v, o) => v == null ? null : n(v) + (o.max_clock_mhz != null ? ' of ' + n(o.max_clock_mhz) : '') + ' MHz'],
    ['power_w', 'Power', v => n(v, 'W')],
    ['memory_note', 'Memory', v => v === 'unified' ? 'Shared with the CPU (unified memory)' : v],
    ['source', 'Read with', v => ({ nvml: 'NVIDIA driver (NVML)', jtop: 'jetson-stats (jtop)', sysfs: 'Linux sysfs' })[v] || v],
  ], ['max_clock_mhz']) });
  add('thermal', 'Temperatures', { rows: Object.entries(r.thermal_c || {}).filter(([, v]) => v != null)
    .map(([k, v]) => [ZONE[k] || k.replace(/_/g, ' ').toUpperCase(), n(v, '°C'), typeof v === 'number' ? band(v, th.gpuTemp) : undefined]) });
  const p = r.power || {}, rails = p.rails_w && typeof p.rails_w === 'object' ? p.rails_w : {}, thr = p.throttling;
  add('power', 'Power', { rows: [...rows(p, [
    ['mode', 'Power mode'],
    ['total_w', 'Total power', v => n(v, 'W')],
    ['fan_rpm', 'Fan speed', v => n(v, 'rpm')],
  ], ['rails_w', 'throttling']),
  ...Object.entries(rails).filter(([, v]) => v != null).map(([k, v]) => ['Rail ' + k, n(v, 'W')]),
  ...(thr && typeof thr === 'object' ? [
    ['Throttled now', (thr.now || []).length ? thr.now.join(', ') : 'No', (thr.now || []).length ? 'warn' : undefined],
    ['Throttled since start', (thr.since_boot || []).length ? thr.since_boot.join(', ') : 'No']] : [])] });
  add('network', 'Network', { rows: rows(r.network, [
    ['iface', 'Interface'],
    ['link', 'Link', v => v === 'up' ? 'Up' : v === 'down' ? 'Down' : v, v => v === 'down' ? 'crit' : undefined],
    ['wifi_signal_dbm', 'Wi-Fi signal', v => n(v, 'dBm')],
    ['wifi_bitrate_mbps', 'Wi-Fi speed', v => n(v, 'Mbps')],
    ['gateway_rtt_ms', 'Router ping', v => n(v, 'ms')],
    ['gateway_loss_pct', 'Router packet loss', v => n(v, '%'), over0('warn')],
    ['last_server_rtt_ms', 'Central server round trip', v => n(v, 'ms')],
  ]) });

  // services and the AI model server
  add('services', 'Services' + (counted.length ? ' (' + counted.filter(x => x.status === 'up').length + ' of ' + counted.length + ' up)' : ''), { table: {
    cols: ['Service', 'Status', 'Detail', 'Response', 'Restarts', 'Up since'], wrap: 2,
    rows: svcs.filter(Boolean).map(x => [svcName(x.name), { v: svcStatus(x.status), tone: (SVC[x.status] || [])[1] }, x.detail || '—', n(x.latency_ms, 'ms') || '—',
      x.restarts == null ? '—' : { v: n(x.restarts), tone: x.restarts ? 'warn' : undefined }, at(x.since) || '—']) } });
  Object.entries(r.ai && typeof r.ai === 'object' ? r.ai : {}).forEach(([k, x]) => add('ai-' + k, 'AI model server' + (k === 'vllm' ? ' (vLLM)' : ': ' + k), { rows: rows(x, [
    ['status', 'Status', svcStatus, v => (SVC[v] || [])[1]],
    ['model', 'Model'],
    ['running', 'Requests being answered', v => n(v)],
    ['waiting', 'Requests waiting', v => n(v), over0('warn')],
    ['kv_cache_pct', 'KV cache in use', v => n(v, '%')],
    ['avg_e2e_latency_s', 'Average answer time', v => n(v, 's')],
    ['avg_ttft_s', 'Average time to first token', v => n(v, 's')],
    ['requests_success_total', 'Requests finished (since start)', v => n(v)],
    ['requests_aborted_total', 'Requests stopped early (since start)', v => n(v)],
    ['prompt_tokens_total', 'Prompt tokens (since start)', v => n(v)],
    ['generation_tokens_total', 'Tokens generated (since start)', v => n(v)],
  ]) }));

  // sync
  add('edge_sync', 'Edge sync agent', { rows: rows(r.edge_sync, [
    ['node', 'Node'],
    ['enabled', 'Sync on', yes, v => v === false ? 'warn' : undefined],
    ['pending_events', 'Changes waiting to send', v => n(v)],
    ['oldest_pending_at', 'Oldest waiting since'],
    ['open_batches', 'Open batches', v => n(v)],
    ['failed_batches', 'Failed batches', v => n(v), over0('crit')],
    ['quarantined', 'Quarantined changes', v => n(v), over0('warn')],
    ['conflicts_24h', 'Conflicts (24 h)', v => n(v)],
    ['last_push_acked_at', 'Last send confirmed'],
    ['last_pull_at', 'Last download from central'],
  ]) });
  add('sync', 'Data sync (saras-sync)', { rows: rows(r.sync, [
    ['last_success', 'Last successful sync'],
    ['last_attempt', 'Last attempt'],
    ['unit_result', 'Last result', v => v === 'success' ? 'Success' : v, v => v && v !== 'success' ? 'warn' : undefined],
    ['age_h', 'Since the last success', v => n(v, 'h')],
    ['offline_count', 'Offline attempts', v => n(v)],
    ['source_tables', 'Tables', v => n(v)],
    ['source_rows', 'Rows on the box', v => n(v)],
    ['target_rows', 'Rows on the server', v => n(v)],
    ['mismatched_tables', 'Tables that differ', v => n(v), over0('warn')],
  ]) });

  // hourly blocks
  const fl = r.faults || {};
  add('faults', 'Failures & crash signs', { rows: rows(r.faults, [
    ['failed_units_count', 'Failed services', v => v == null ? null : n(v) + ((fl.failed_units || []).length ? ': ' + fl.failed_units.join(', ') : ''), over0('warn')],
    ['kernel_errors_24h', 'Kernel faults (24 h)', v => n(v), over0('crit')],
    ['kernel_error_counts', 'Kernel faults by kind', v => v && typeof v === 'object' ? Object.entries(v).map(([k, c]) => (KERNEL[k] || k) + ' ' + c).join(', ') || 'None' : null],
    ['oom_kills_24h', 'Out-of-memory kills (24 h)', v => n(v), over0('warn')],
    ['coredumps_24h', 'Crash dumps (24 h)', v => n(v), over0('warn')],
    ['unclean_shutdown', 'Last shutdown was clean', v => v == null ? null : v ? 'No: power cut or crash' : 'Yes', v => v ? 'crit' : undefined],
    ['last_shutdown_at', 'Last shutdown'],
  ], ['failed_units']) });
  const sto = r.storage || {}, paths = sto.paths_gb && typeof sto.paths_gb === 'object' ? sto.paths_gb : {};
  add('storage', 'Disk space by use', { rows: [...rows(r.storage, [
    ['docker_images_gb', 'Docker images', v => n(v, 'GB')],
    ['docker_containers_gb', 'Docker containers', v => n(v, 'GB')],
    ['docker_volumes_gb', 'Docker volumes', v => n(v, 'GB')],
    ['docker_build_cache_gb', 'Docker build cache', v => n(v, 'GB')],
    ['logs_gb', 'Logs', v => n(v, 'GB')],
  ], ['paths_gb']), ...Object.entries(paths).filter(([, v]) => v != null).map(([k, v]) => ['Folder: ' + k, n(v, 'GB')])] });
  add('software', 'Software', { rows: rows(r.software, [
    ['os', 'Operating system'], ['kernel', 'Kernel'], ['l4t', 'Jetson Linux (L4T)'], ['jetpack', 'JetPack'], ['nvidia_driver', 'NVIDIA driver'],
    ['cuda_driver', 'CUDA (driver)'], ['cuda_toolkit', 'CUDA toolkit'], ['cudnn', 'cuDNN'], ['tensorrt', 'TensorRT'], ['docker', 'Docker'],
    ['nvidia_container_toolkit', 'NVIDIA container toolkit'], ['jetson_stats', 'jetson-stats'], ['bootloader', 'Bootloader'], ['python', 'Python'],
    ['app_version', 'App version'], ['app_image', 'App image'], ['vllm_version', 'vLLM version'], ['llm_model', 'AI model'],
    ['rpi_firmware', 'Raspberry Pi firmware'], ['rpi_eeprom', 'Raspberry Pi EEPROM'],
  ]) });
  add('updates', 'Updates', { rows: rows(r.updates, [
    ['os_updates_pending', 'OS updates waiting', v => n(v)],
    ['os_security_updates_pending', 'Of them security updates', v => n(v), over0('warn')],
    ['auto_updates', 'Automatic updates', v => v == null ? null : v ? 'On' : 'Off'],
    ['last_os_update_at', 'Last OS update'],
    ['firmware_update', 'Firmware'],
    ['config_changed_at', 'Agent settings last changed'],
  ]) });

  // cameras
  const cam = r.cameras || {}, csv = cam.service && typeof cam.service === 'object' ? cam.service : null;
  add('cameras', 'Cameras', { rows: [...rows(r.cameras, [
    ['count', 'Cameras', v => n(v)],
    ['total_nodes', 'Video devices', v => n(v)],
    ['connected', 'Connected', yes, v => v === false ? 'warn' : undefined],
  ], ['devices', 'service']), ...(csv ? rows(csv, [
    ['name', 'Proctoring service'],
    ['status', 'Service state'],
    ['running', 'Service running', yes, v => v === false ? 'crit' : undefined],
    ['started_at', 'Service started at'],
    ['restart_count', 'Service restarts', v => n(v), over0('warn')],
    ['last_error', 'Last service error', null, v => v ? 'warn' : undefined],
  ]) : [])] });
  add('camera-devices', 'Camera devices', { table: { cols: ['Device', 'Name', 'Driver', 'Bus', 'Captures video', 'Available'],
    rows: (Array.isArray(cam.devices) ? cam.devices : []).filter(Boolean).map(x => [x.node || '—', x.name || '—', x.driver || '—', x.bus || '—', yes(x.capture) || '—', yes(x.available) || '—']) } });

  // the warning and error lines of this reading
  if (r.logs) {
    const t = { cols: ['Time', 'Level', 'Source', 'Service', 'Message'], wrap: 4, rows: logLines.filter(Boolean).map(x => [at(x.at) || '—',
      { v: (LEVEL[x.level] || [x.level || '—'])[0], tone: (LEVEL[x.level] || [])[1] }, SOURCE[x.source] || x.source || '—', x.unit || '—', x.message || ''] ) };
    sections.push({ key: 'logs', title: 'Warnings & errors in this reading (' + logLines.length + ')', table: t, levelled: true,
      note: logLines.length ? (r.logs.more ? 'More lines were written: the box sent the most severe and newest ones.' : null) : 'No new warning or error lines since the previous reading.' });
  }

  // the box's own upload queue, the shutdown notice, collector notes
  add('telemetry', 'Upload queue on the box', { rows: rows(r.telemetry, [
    ['outbox_files', 'Files waiting to upload', v => n(v), v => v > 1 ? 'warn' : undefined],
    ['outbox_mb', 'Waiting size', v => n(v, 'MB')],
    ['oldest_waiting', 'Oldest waiting'],
    ['dropped_total', 'Readings dropped on the box', v => n(v), over0('crit')],
    ['last_upload_ok', 'Last successful upload'],
    ['last_upload_error', 'Last upload error', null, v => v ? 'warn' : undefined],
  ]) });
  add('shutdown', 'Shutdown notice', { rows: rows(r.shutdown, [['kind', 'The box was', v => SHUTDOWN[v] || v], ['at', 'At']]) });
  const ce = r.collector_errors && typeof r.collector_errors === 'object' ? Object.entries(r.collector_errors) : null;
  if (ce) sections.push({ key: 'collector_errors', title: 'Collector notes',
    rows: ce.length ? ce.map(([k, v]) => [label(k), String(v), 'warn']) : [['All collectors', 'Reported normally', 'ok']] });

  // anything newer than this file
  const KNOWN = new Set(['schema', 'agent_version', 'device_id', 'boot_id', 'seq', 'sent_at', 'interval_s', 'buffered', 'claimed', 'identity', 'system', 'gpu',
    'thermal_c', 'power', 'network', 'services', 'sync', 'software', 'updates', 'faults', 'ai', 'storage', 'edge_sync', 'cameras', 'logs', 'telemetry',
    'shutdown', 'collector_errors']);
  Object.entries(r).filter(([k, v]) => !KNOWN.has(k) && v != null && typeof v === 'object').forEach(([k, v]) =>
    add('x-' + k, label(k), Array.isArray(v) ? { rows: [[label(k), val(k, v)]] } : { rows: rows(v, []) }));

  const hourly = r.shutdown ? [] : Object.keys(HOURLY).filter(k => r[k] == null).map(k => HOURLY[k]);
  return { glance, sections, hourly };
}

/** One line for a closed reading: the glance values. */
export const readingGlance = (r, th) => readingView(r, { th }).glance.map(g => g.label + ' ' + g.value).join(' · ');

const worst = tones => tones.includes('crit') ? 'crit' : tones.includes('warn') ? 'warn' : undefined;

/**
 * A reading in at most six short lines (review, 6 Nov 2026: the full readable view was too long): health, power,
 * network, services, problems and how it arrived. [{ label, text, tone }]; the full detail stays in JSON and the downloads.
 */
export function readingSummary(r, { th } = {}) {
  r = r && typeof r === 'object' ? r : {};
  th = th || {};
  const sys = r.system || {}, out = [];
  const line = (lbl, parts, tone) => { const p = parts.filter(Boolean); if (p.length) out.push({ label: lbl, text: p.join(' · '), tone }); };

  const disk = (Array.isArray(sys.disks) ? sys.disks : []).find(x => x && x.mount === '/') || (sys.disks || [])[0];
  const temps = Object.values(r.thermal_c || {}).filter(x => typeof x === 'number');
  const hot = temps.length ? Math.max(...temps) : null;
  line('Health', [
    sys.cpu_pct != null && 'CPU ' + n(sys.cpu_pct, '%'), sys.ram_pct != null && 'memory ' + n(sys.ram_pct, '%'),
    disk && disk.pct != null && 'disk ' + n(disk.pct, '%'), hot != null && 'hottest ' + n(hot, '°C')],
  worst([band(sys.cpu_pct, th.cpu), band(sys.ram_pct, th.ram), band(disk && disk.pct, th.disk), band(hot, th.gpuTemp)]));

  const pw = r.power || {};
  line('Power', [pw.mode && pw.mode + ' mode', pw.total_w != null && n(pw.total_w, 'W'), pw.fan_rpm != null && 'fan ' + n(pw.fan_rpm, 'rpm')]);

  const net = r.network || {};
  const port = (Array.isArray(net.interfaces) ? net.interfaces : []).find(p => p && p.in_use);
  line('Network', [
    net.iface ? (port ? (port.kind === 'wifi' ? 'Wi-Fi ' : 'LAN ') : '') + net.iface + (net.link ? ' ' + net.link : '') : 'no network',
    net.wifi_signal_dbm != null && 'signal ' + n(net.wifi_signal_dbm, 'dBm'), net.gateway_rtt_ms != null && 'router ' + n(net.gateway_rtt_ms, 'ms'),
    net.gateway_loss_pct ? n(net.gateway_loss_pct, '%') + ' loss' : null],
  !net.iface || net.link === 'down' ? 'crit' : net.gateway_loss_pct ? 'warn' : undefined);

  const svcs = (Array.isArray(r.services) ? r.services : []).filter(x => x && ['up', 'down', 'degraded'].includes(x.status));
  if (svcs.length) {
    const bad = svcs.filter(x => x.status !== 'up');
    line('Services', [svcs.length - bad.length + ' of ' + svcs.length + ' up', bad.length && 'not up: ' + bad.slice(0, 3).map(x => svcName(x.name)).join(', ') + (bad.length > 3 ? ' and ' + (bad.length - 3) + ' more' : '')],
      bad.some(x => x.status === 'down') ? 'crit' : bad.length ? 'warn' : 'ok');
  }

  const logs = r.logs && Array.isArray(r.logs.entries) ? r.logs.entries : [];
  const errs = logs.filter(x => x.level === 'critical' || x.level === 'error').length;
  const f = r.faults || {};
  const sensors = Object.keys(r.collector_errors || {}).length;
  line('Problems', [
    errs && errs + (errs === 1 ? ' error' : ' errors') + ' in the logs', logs.length - errs && (logs.length - errs) + ' log warnings',
    f.failed_units_count && f.failed_units_count + ' failed system services', f.oom_kills_24h && 'out of memory ' + f.oom_kills_24h + '× (24 h)',
    sensors && sensors + (sensors === 1 ? ' reading' : ' readings') + ' could not be taken'],
  errs || f.failed_units_count || f.oom_kills_24h ? 'crit' : logs.length || sensors ? 'warn' : undefined);
  if (!out.length || out[out.length - 1].label !== 'Problems') out.push({ label: 'Problems', text: 'None', tone: 'ok' });

  line('Arrived', [r.shutdown && (SHUTDOWN[r.shutdown.kind] || 'Shutting down'), r.buffered && 'taken offline, uploaded later'], 'muted');
  return out;
}

const cellV = c => c != null && typeof c === 'object' ? c.v : c;
const mark = tn => tn === 'crit' ? '  [critical]' : tn === 'warn' ? '  [warning]' : '';

/** Plain text of readings ({ sentAt, receivedAt, reading }, newest first) for download: a header, then each reading
 *  with its glance line and its sections as aligned label/value lines and tables. */
export function readingText(entries, { title, th } = {}) {
  const zone = (new Intl.DateTimeFormat('en-IN', { timeZoneName: 'long' }).formatToParts(new Date()).find(x => x.type === 'timeZoneName') || {}).value
    || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const out = ['SARAS device ' + (entries.length === 1 ? 'reading' : 'readings') + (title ? ' - ' + title : ''),
    entries.length + (entries.length === 1 ? ' reading' : ' readings') + ', newest first. Times in ' + zone + '. Saved ' + at(new Date()) + '.',
    '[warning] and [critical] mark values at the portal\'s alert levels.', ''];
  entries.forEach(e => {
    const v = readingView(e.reading, { receivedAt: e.receivedAt, th });
    out.push('='.repeat(100), 'Reading taken ' + (at(e.sentAt) || '—') + (e.receivedAt ? ' · received ' + at(e.receivedAt) : ''));
    if (v.glance.length) out.push('At a glance: ' + v.glance.map(g => g.label + ' ' + g.value).join(' · '));
    v.sections.forEach(s => {
      out.push('', s.title.toUpperCase());
      if (s.rows) {
        const w = Math.min(40, Math.max(...s.rows.map(x => x[0].length)));
        s.rows.forEach(([k, val, tn]) => out.push('  ' + k.padEnd(w) + '  ' + val + mark(tn)));
      }
      if (s.table && s.table.rows.length) {
        const cols = s.table.cols, last = cols.length - 1;
        const w = cols.map((c, i) => i === last ? 0 : Math.min(40, Math.max(c.length, ...s.table.rows.map(x => String(cellV(x[i]) ?? '').length))));
        const line = cells => '  ' + cells.map((c, i) => i === last ? c : String(c).padEnd(w[i])).join('  ').trimEnd();
        out.push(line(cols), line(cols.map((c, i) => '-'.repeat(i === last ? c.length : w[i]))));
        s.table.rows.forEach(x => {
          const tones = x.map(c => c && c.tone);             // the log table's Level column already says it
          out.push(line(x.map(c => String(cellV(c) ?? ''))) + (s.levelled ? '' : mark(tones.find(t => t === 'crit') || tones.find(t => t === 'warn'))));
        });
      }
      if (s.note) out.push('  ' + s.note);
    });
    if (v.hourly.length) out.push('', 'Sent once an hour, not in this reading: ' + v.hourly.join(', ') + '.');
    out.push('');
  });
  return out.join('\r\n');
}
