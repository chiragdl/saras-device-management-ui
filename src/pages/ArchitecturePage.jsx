import React from 'react';

/** Device sync architecture reference page. connection: 'Online' | 'Offline'. */
export default function ArchitecturePage({ connection = 'Online' }) {
  const v = useArchitectureVals(connection);
  return (
    <main style={{ maxWidth: "1480px", margin: "0 auto", padding: "40px 32px 64px", display: "flex", flexDirection: "column", gap: "44px" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "780px" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#005BB8" }}>SARAS Device Management · Architecture</span>
          <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600", letterSpacing: "-.01em" }}>Device sync: offline first, store and forward</h1>
          <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.6", color: "#5A6675", textWrap: "pretty" }}>Each box records and checks itself with no internet. Everything it produces is written to an outbox table in the Postgres the box already runs. When the internet returns, the sync worker sends the outbox to the central server, and the server confirms what it stored.</p>
        </div>
        {(v.isOnline) ? (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", flexShrink: "0", padding: "8px 14px", borderRadius: "999px", background: "#E7F6EC", border: "1px solid #B5E2C3", color: "#14713A", fontSize: "13px", fontWeight: "600" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16A34A" }} />Showing: internet connected
            </span>
          </>
        ) : null}
        {(v.isOffline) ? (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", flexShrink: "0", padding: "8px 14px", borderRadius: "999px", background: "#FEECEC", border: "1px solid #F5C2C2", color: "#B21E1E", fontSize: "13px", fontWeight: "600" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#DC2626" }} />Showing: no internet
            </span>
          </>
        ) : null}
      </header>
      <section data-screen-label="Sync architecture diagram" style={{ overflowX: "auto", paddingBottom: "4px" }}>
        <div style={{ minWidth: "1180px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 250px minmax(0,1fr)", alignItems: "stretch" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "22px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #E4E9F0", boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>Edge box</h2>
              <span style={{ fontSize: "12px", color: "#5A6675" }}>Same stack on all four ·{' '}
                <code>linux/arm64</code>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "9px 10px", borderRadius: "10px", background: "#F5F7FA", border: "1px solid #E4E9F0" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600" }}>DGX Spark</span>
                <span style={{ fontSize: "11.5px", color: "#5A6675" }}>GB10 · vLLM</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "9px 10px", borderRadius: "10px", background: "#F5F7FA", border: "1px solid #E4E9F0" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600" }}>Jetson AGX Thor</span>
                <span style={{ fontSize: "11.5px", color: "#5A6675" }}>JetPack 7</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "9px 10px", borderRadius: "10px", background: "#F5F7FA", border: "1px solid #E4E9F0" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600" }}>Jetson Orin Nano</span>
                <span style={{ fontSize: "11.5px", color: "#5A6675" }}>JetPack 6</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "9px 10px", borderRadius: "10px", background: "#F5F7FA", border: "1px solid #E4E9F0" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600" }}>Raspberry Pi 5</span>
                <span style={{ fontSize: "11.5px", color: "#5A6675" }}>Pi OS · no GPU</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "12px", background: "#F5F7FA" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A6675" }}>Host · systemd</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  <code>saras-agent</code>
                </span>
                <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Reads CPU, GPU, temperatures, power, disk, network and services every 60 s and posts one heartbeat (about 3 KB).</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#EEF2F7", fontSize: "11.5px", color: "#3A4656" }}>NVML</span>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#EEF2F7", fontSize: "11.5px", color: "#3A4656" }}>jtop</span>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#EEF2F7", fontSize: "11.5px", color: "#3A4656" }}>nvpmodel</span>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#EEF2F7", fontSize: "11.5px", color: "#3A4656" }}>vcgencmd (Pi)</span>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#EEF2F7", fontSize: "11.5px", color: "#3A4656" }}>/proc · /sys · Docker</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "2px", height: "18px", background: "#8A97A8" }} />
                <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
              </div>
              <span style={{ fontSize: "12px", color: "#5A6675" }}>
                <code>POST 127.0.0.1:8090/api/heartbeat</code>{' '}· works offline
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", borderRadius: "12px", border: "1.5px dashed #9DB4D1", background: "#FAFCFF" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#005BB8" }}>Docker Compose · /opt/saras</span>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    <code>fleet</code>{' '}:8090
                  </span>
                  <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Takes heartbeats, checks alert rules, serves the local dashboard.</span>
                  <span style={{ fontSize: "11.5px", color: "#3A4656" }}>
                    <code>device-management/fleet</code>
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>SARAS app :8000</span>
                  <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Saves results to its own tables and adds an extract row to the outbox in the same transaction.</span>
                  <span style={{ fontSize: "11.5px", color: "#3A4656" }}>vLLM on the Spark only</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "2px", height: "14px", background: "#8A97A8" }} />
                    <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#5A6675" }}>heartbeats, alerts</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "2px", height: "14px", background: "#8A97A8" }} />
                    <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#5A6675" }}>data extracts</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "10px", background: "#FFFFFF", border: "2px solid #0070E0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Postgres ·{' '}
                    <code>fleet.outbox</code>{' '}+{' '}
                    <code>sync</code>{' '}worker
                  </span>
                  <span style={{ padding: "2px 8px", borderRadius: "999px", background: "#E6F0FC", color: "#005BB8", fontSize: "11px", fontWeight: "600" }}>New</span>
                </div>
                <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>The existing Postgres container, with one new schema. No extra database. A row is marked synced only after the server confirms it.</span>
                <div style={{ display: "flex", flexDirection: "column", borderRadius: "8px", border: "1px solid #E4E9F0", overflow: "hidden", fontSize: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "56px 96px minmax(0,1fr) 80px", gap: "8px", padding: "6px 10px", background: "#F5F7FA", color: "#5A6675", fontWeight: "500" }}>
                    <span>seq</span>
                    <span>type</span>
                    <span>measured_at</span>
                    <span>state</span>
                  </div>
                  {(v.queue ?? []).map((r, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: "grid", gridTemplateColumns: "56px 96px minmax(0,1fr) 80px", gap: "8px", padding: "6px 10px", borderTop: "1px solid #EEF2F7", alignItems: "center" }}>
                        <code>{r?.seq}</code>
                        <span>{r?.type}</span>
                        <code style={{ color: "#5A6675" }}>{r?.at}</code>
                        <span style={{ fontWeight: "600", color: r?.color }}>{r?.state}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#3A4656" }}>{v.queueNote}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "26px", padding: "0 14px" }}>
            {(v.isOnline) ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>1 · Check link</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ flex: "1", height: "2px", background: "#0070E0" }} />
                    <span style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid #0070E0" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>
                    <code>GET /healthz</code>{' '}every 30 s
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>2 · Send batch</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ flex: "1", height: "3px", background: "#0070E0" }} />
                    <span style={{ width: "0", height: "0", borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "10px solid #0070E0" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>
                    <code>POST /api/ingest</code>{' '}· up to 500 rows, HTTPS, each with its own{' '}
                    <code>id</code>
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>3 · Confirm</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "9px solid #16A34A" }} />
                    <span style={{ flex: "1", height: "2px", background: "#16A34A" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>Reply{' '}
                    <code>stored_ids</code>. The box sets{' '}
                    <code>synced_at</code>{' '}on those rows.
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>4 · Pull commands (phase 2)</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "9px solid #8A97A8" }} />
                    <span style={{ flex: "1", height: "0", borderTop: "2px dashed #8A97A8" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>
                    <code>GET /api/commands</code>{' '}· patches and settings
                  </span>
                </div>
              </>
            ) : null}
            {(v.isOffline) ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>1 · Check link</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ flex: "1", height: "0", borderTop: "2px dashed #C9D1DC" }} />
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "#DC2626", padding: "0 6px" }}>×</span>
                    <span style={{ flex: "1", height: "0", borderTop: "2px dashed #C9D1DC" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>
                    <code>GET /healthz</code>{' '}fails. The worker waits 60 s and tries again.
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px", borderRadius: "10px", background: "#FEECEC", border: "1px solid #F5C2C2" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#B21E1E" }}>Nothing is sent</span>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#7A1F1F" }}>Recording, alerts and the local dashboard carry on. New rows wait in the outbox.</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A1E26" }}>Central server</span>
                  <span style={{ fontSize: "11.5px", lineHeight: "1.45", color: "#5A6675" }}>No batch for 3 min, so the box is marked Offline.</span>
                </div>
              </>
            ) : null}
            <span style={{ paddingTop: "10px", borderTop: "1px solid #E4E9F0", fontSize: "11.5px", lineHeight: "1.5", color: "#5A6675" }}>The box opens every connection. It works behind NAT and firewalls with no inbound ports.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "22px", borderRadius: "16px", background: "#F0F5FC", border: "1px solid #CFDDF0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>Central server</h2>
              <span style={{ fontSize: "12px", color: "#5A6675" }}>Cloud or data centre</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>nginx · HTTPS</span>
              <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Public entry point. Add one client certificate per box (mTLS) before going live.</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "2px", height: "14px", background: "#8A97A8" }} />
                <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                <code>central-api</code>{' '}:9000
              </span>
              <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Updates{' '}
                <code>boxes.last_seen</code>, inserts rows with{' '}
                <code>ON CONFLICT DO NOTHING</code>, keeps{' '}
                <code>measured_at</code>{' '}and{' '}
                <code>received_at</code>, replies with{' '}
                <code>stored_ids</code>.
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "2px", height: "14px", background: "#8A97A8" }} />
                <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>PostgreSQL + TimescaleDB</span>
                <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Tables{' '}
                  <code>boxes</code>{' '}and{' '}
                  <code>records</code>{' '}(a hypertable by{' '}
                  <code>measured_at</code>).
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #D5DBE4" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>Status rule</span>
                <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#5A6675" }}>Online if{' '}
                  <code>last_seen</code>{' '}is within 3 min. Late if{' '}
                  <code>received_at</code>{' '}is over 2 min after{' '}
                  <code>measured_at</code>.
                </span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "2px", height: "14px", background: "#8A97A8" }} />
                <span style={{ width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #8A97A8" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: "#0A4FA0", color: "#FFFFFF" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>SARAS Device Management (this website)</span>
              <span style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#FFFFFF" }}>Fleet and device pages for every box. Reads from the central Postgres. Late readings are shaded.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function useArchitectureVals(connection) {
  return React.useMemo(() => {
    const off = connection === 'Offline';
    const G = '#14713A', M = '#5A6675', B = '#005BB8';
    const queue = off ? [
      { seq: 1041, type: 'heartbeat', at: '09:41:00', state: 'waiting', color: M },
      { seq: 1042, type: 'alert', at: '09:41:00', state: 'waiting', color: M },
      { seq: 1043, type: 'extract', at: '09:41:12', state: 'waiting', color: M },
      { seq: 1044, type: 'heartbeat', at: '09:42:00', state: 'waiting', color: M }
    ] : [
      { seq: 1041, type: 'heartbeat', at: '09:41:00', state: 'synced', color: G },
      { seq: 1042, type: 'alert', at: '09:41:00', state: 'synced', color: G },
      { seq: 1043, type: 'extract', at: '09:41:12', state: 'synced', color: G },
      { seq: 1044, type: 'heartbeat', at: '09:42:00', state: 'sending', color: B }
    ];
        return { isOnline: !off, isOffline: off, queue,
      queueNote: off ? '4 rows waiting · nothing lost' : 'Synced up to seq 1043 · 1 sending' };
  }, [connection]);
}
