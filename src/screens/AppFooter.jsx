import React from 'react';
import Sx from '../components/Sx.jsx';

// Excelsoft's pages, opened in a new tab. "Terms of use" is hidden for now (23 Nov 2026): add it back here when its page is ready.
const FOOTER_LINKS = [
  { label: 'Privacy policy', href: 'https://www.excelsoftcorp.com/privacy-policy/' },
  { label: 'Cookie preferences', href: 'https://www.excelsoftcorp.com/cookie-policy/' },
  { label: 'Help', href: 'https://www.excelsoftcorp.com/contact-us-es/' },
];

export default function AppFooter(v) {
  return (
    <footer style={{ marginTop: "auto", background: "#0C1B2E", color: "#C4CEDB" }}>
      <div style={{ height: "3px", background: "linear-gradient(90deg,#0070E0 0%,#3aa0ff 30%,#0070E0 60%,transparent 100%)" }} />
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "38px 48px 26px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "40px 56px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ display: "inline-flex", alignSelf: "flex-start", background: "#FFFFFF", borderRadius: "11px", padding: "9px 15px", boxShadow: "0 6px 18px -8px rgba(0,0,0,.5)" }}>
            <img src="/assets/excelsoft-logo.png" alt="Excelsoft — SARAS Device Management" style={{ height: "34px", width: "auto", display: "block" }} />
          </span>
          <p style={{ margin: "0", fontSize: "13px", color: "#8FA0B4", lineHeight: "1.65", maxWidth: "300px" }}>Central health monitoring for SARAS edge boxes: readings every minute, kept on the box while offline and uploaded when it reconnects.</p>
          <span role="status" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: v.footConnFg, background: v.footConnBg, border: `1px solid ${v.footConnBorder}`, borderRadius: "999px", padding: "6px 13px", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
            <span style={{ width: "7px", height: "7px", flexShrink: "0", borderRadius: "50%", background: v.footConnDot, boxShadow: "0 0 0 3px rgba(74,222,128,.25)", animation: "epHalo 2.4s ease-out infinite" }} />{v.footConnText}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".8px", textTransform: "uppercase", color: "#6E8299" }}>Support</span>
          <nav aria-label="Footer" style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {FOOTER_LINKS.map(l => (
              <Sx key={l.label} as="a" hover={{ color: "#5AA9F5" }} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#C4CEDB", fontWeight: "500", textDecoration: "none", transition: "color .15s ease" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0070E0", flexShrink: "0" }} />{l.label}
                <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}> (opens in a new tab)</span>
              </Sx>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".8px", textTransform: "uppercase", color: "#6E8299" }}>Session details</span>
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", borderRadius: "14px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "9px", background: "rgba(0,112,224,.16)", display: "grid", placeItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="#5AA9F5" strokeWidth="1.6" />
                  <path d="M12 7v5.2l3.4 2" stroke="#5AA9F5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span id="ep-clock" style={{ fontSize: "15px", fontWeight: "600", color: "#F0F5FA", fontVariantNumeric: "tabular-nums", letterSpacing: ".2px" }}>--</span>
                <span style={{ fontSize: "11.5px", color: "#7E90A5" }}>Local device time</span>
              </div>
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,.08)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: "12.5px" }}>
              <span style={{ color: "#7E90A5" }}>Timezone</span>
              <span style={{ color: "#DDE6EF", fontWeight: "500", textAlign: "right" }}>India Standard Time</span>
              <span style={{ color: "#7E90A5" }}>Country</span>
              <span style={{ color: "#DDE6EF", fontWeight: "500", textAlign: "right" }}>Asia/Calcutta</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px 48px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 20px" }}>
          <span style={{ fontSize: "12px", color: "#6E8299" }}>Copyright © 2026 Excelsoft Technologies. All Rights Reserved.</span>
          <span style={{ fontSize: "12px", color: "#6E8299" }}>Powered by SARAS · Device Management</span>
        </div>
      </div>
    </footer>
  );
}
