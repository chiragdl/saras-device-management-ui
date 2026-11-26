import React from 'react';

export default function FleetBar(v) {
  return (
    <div aria-label="Fleet summary" style={{ position: "fixed", top: "64px", left: "0", right: "0", zIndex: "55", display: v.fleetBarDisplay, justifyContent: "center", padding: "0 16px", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center", maxWidth: "100%", padding: "9px 22px", background: "linear-gradient(180deg,#0C3D7A,#0A3366)", color: "#EAF2FF", borderRadius: "0 0 18px 18px", boxShadow: "0 10px 24px -14px rgba(8,28,64,.65)", border: "1px solid rgba(255,255,255,.08)", borderTop: "0" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
          <span aria-hidden="true" style={{ display: "flex", color: "#7FB4FF" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v12H4zM8 20h8M12 16v4" />
            </svg>
          </span>
          <span>
            <span style={{ fontWeight: "700", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{v.fleetCount}</span>{' '}registered edge devices
          </span>
        </span>
        <span aria-hidden="true" style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,.35)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "500", color: "#C6DBF7", whiteSpace: "nowrap" }}>
          <span aria-hidden="true" style={{ position: "relative", display: "inline-flex", width: "14px", height: "14px", alignItems: "center", justifyContent: "center" }}>
            <span className="hb-ping" style={{ position: "absolute", inset: "0", borderRadius: "50%", background: "#4ADE80", animation: "hbPing 1.6s ease-out infinite" }} />
            <span className="hb-icon" style={{ position: "relative", width: "7px", height: "7px", borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80", animation: "heartbeat 1.6s ease-in-out infinite" }} />
          </span>Data updated {v.fleetUpdated}
        </span>
      </div>
    </div>
  );
}
