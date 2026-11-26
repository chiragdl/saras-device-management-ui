import React from 'react';
import Sx from '../components/Sx.jsx';

export default function Dashboard(v) {
  return (
    <div style={{ display: v.dashDisplay, flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 style={{ margin: "0", fontSize: "22px", fontWeight: "600" }}>Fleet overview</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Sx as="button" hover={{ background: "#F6F8FB", transform: "translateY(-1.5px)" }} onClick={v.refresh} disabled={v.refreshing} style={{ height: "44px", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#1A1E26", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "transform .16s,background .16s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0070E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: v.refreshAnim }}>
              <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
            </svg>
            <span>{v.refreshLabel}</span>
          </Sx>
          <Sx as="button" hover={{ transform: "translateY(-1.5px)", boxShadow: "0 6px 16px -6px rgba(0,112,224,.45)" }} active={{ transform: "scale(.97)" }} data-trigger="register" onClick={v.openRegister} aria-haspopup="dialog" style={{ height: "44px", display: v.registerDisplay, alignItems: "center", gap: "8px", padding: "0 18px", border: "0", borderRadius: "11px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "transform .16s cubic-bezier(.22,1,.36,1),box-shadow .16s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Register device</span>
          </Sx>
        </div>
      </div>
      <div style={{ display: v.catGridDisplay, gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "14px" }}>
        {(v.metrics ?? []).map((m, $index) => (
          <React.Fragment key={$index}>
            <button className="kpi-tile" onClick={m?.pick} aria-pressed={m?.pressed} aria-label={m?.aria} style={{ position: "relative", textAlign: "left", display: "flex", flexDirection: "column", padding: "20px", borderRadius: "24px", border: "1px solid rgba(228,231,236,.7)", background: m?.bg, boxShadow: m?.shadow, cursor: "pointer", color: m?.c, overflow: "hidden", animation: m?.anim }}>
              <span className="kpi-arrow" aria-hidden="true" style={{ position: "absolute", top: "16px", right: "16px", color: m?.c, display: m?.arrowDisplay }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
              <span aria-hidden="true" style={{ position: "absolute", top: "13px", right: "13px", display: m?.selDisplay, alignItems: "center", gap: "6px", height: "25px", padding: "0 12px 0 5px", borderRadius: "999px", background: `linear-gradient(160deg,${m?.pillHi} 0%,${m?.c} 45%,${m?.pillTo} 100%)`, color: "#FFFFFF", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".07em", textTransform: "uppercase", overflow: "hidden", boxShadow: `0 6px 16px -4px ${m?.pillGlow},0 1px 2px rgba(16,42,84,.2),inset 0 1px 0 rgba(255,255,255,.55),inset 0 -2px 4px ${m?.pillGlow}`, animation: "pillPop .26s cubic-bezier(.34,1.56,.64,1) both" }}>
                <span aria-hidden="true" style={{ position: "absolute", top: "0", left: "0", right: "0", height: "52%", borderRadius: "999px 999px 40% 40%/999px 999px 100% 100%", background: "linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,0))", pointerEvents: "none" }} />
                <span style={{ position: "relative", width: "16px", height: "16px", flexShrink: "0", borderRadius: "50%", background: "rgba(255,255,255,.28)", boxShadow: "inset 0 1px 1px rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span style={{ position: "relative" }}>Active</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "9px", paddingRight: m?.hdrPad }}>
                <span aria-hidden="true" style={{ width: "28px", height: "28px", flexShrink: "0", borderRadius: "50%", background: m?.circleBg, color: m?.circleC, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={m?.icon} />
                  </svg>
                </span>
                <span style={{ fontSize: "14px", fontWeight: "500", color: m?.c }}>{m?.label}</span>
              </span>
              <span style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "16px" }}>
                <span style={{ fontSize: "34px", fontWeight: "500", lineHeight: "1", fontVariantNumeric: "tabular-nums" }}>{m?.value}</span>
                <span style={{ display: m?.suffixDisplay, fontSize: "14px", color: m?.subC }}>{m?.suffix}</span>
              </span>
              <span style={{ marginTop: "6px", fontSize: "12.5px", color: m?.subC }}>{m?.sub}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
                <span style={{ position: "relative", flex: "1", height: "9px", borderRadius: "999px", background: m?.trackBg, boxShadow: "inset 0 1px 2px rgba(16,42,84,.08),0 0 0 1px rgba(0,0,0,.05)" }}>
                  <span style={{ position: "absolute", inset: "0", width: m?.pctW, borderRadius: "999px", background: m?.fillC }} />
                  <span aria-hidden="true" style={{ position: "absolute", top: "0", left: "0", width: m?.pctW, height: "50%", borderRadius: "999px 999px 0 0", background: "rgba(255,255,255,.35)" }} />
                  <span aria-hidden="true" style={{ position: "absolute", top: "50%", left: m?.pctW, width: "12px", height: "12px", borderRadius: "50%", background: "#FFFFFF", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 1px rgba(0,0,0,.06),0 2px 4px rgba(0,0,0,.12),0 0 10px 3px rgba(255,255,255,.95)" }} />
                </span>
                <span style={{ fontSize: "14px", fontWeight: "500", fontVariantNumeric: "tabular-nums" }}>{m?.pctLabel}</span>
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>
      <section aria-labelledby="al-h" style={{ display: v.catFlexDisplay, alignItems: "center", flexWrap: "wrap", gap: "10px 16px", padding: "10px 10px 10px 14px", background: "#FFFFFF", border: "1px solid #E4E9F0", borderRadius: "14px", boxShadow: "0 4px 16px -8px rgba(16,42,84,.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}>
          <span aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FEECEC", color: "#B21E1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </span>
          <h2 id="al-h" style={{ margin: "0", fontSize: "15px", fontWeight: "600", whiteSpace: "nowrap" }}>Active alerts</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(v.sevChips ?? []).map((c, $index) => (
            <React.Fragment key={$index}>
              <Sx as="button" hover={{ background: "#F6F8FB", borderColor: "#C9D6E8" }} onClick={c?.open} aria-label={c?.aria} style={{ height: "32px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px 0 8px", borderRadius: "999px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#1A1E26", fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}>
                <span aria-hidden="true" style={{ width: "20px", height: "20px", borderRadius: "6px", background: c?.bg, color: c?.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={c?.icon} />
                  </svg>
                </span>
                <span style={{ fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>{c?.count}</span>
                <span>{c?.label}</span>
              </Sx>
            </React.Fragment>
          ))}
        </div>
        <Sx as="button" hover={{ background: "#F6F8FB" }} onClick={v.latest?.view} aria-label={v.latest?.aria} title={v.latest?.detail} style={{ flex: "1 1 120px", minWidth: "0", height: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 10px", border: "0", borderRadius: "8px", background: "transparent", color: "#1A1E26", fontSize: "13px", cursor: "pointer", textAlign: "left" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675", flexShrink: "0" }}>Latest</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ fontWeight: "600", color: "#B21E1E" }}>{v.latest?.title}</strong>{' '}· {v.latest?.device} · {v.latest?.rel}
          </span>
        </Sx>
        <Sx as="button" hover={{ background: "#EEF2F7", borderColor: "#C9D6E8" }} data-trigger="alerts" onClick={v.openAlerts} aria-haspopup="dialog" style={{ height: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#005BB8", fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: "0" }}>
          <span>View all alerts</span>
          <span style={{ minWidth: "22px", height: "20px", padding: "0 6px", borderRadius: "999px", background: "#0070E0", color: "#FFFFFF", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>{v.activeCount}</span>
        </Sx>
      </section>
      <section aria-label="Device types" style={{ display: v.catDisplay, flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <h2 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>Device types</h2>
          <span style={{ fontSize: "12.5px", color: "#5A6675" }}>Select a device type to view and manage only those devices</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "20px", marginTop: "10px" }}>
          {(v.categories ?? []).map((ct, $index) => (
            <React.Fragment key={$index}>
              <div style={{ position: "relative" }}>
                <span aria-hidden="true" style={{ position: "absolute", top: "-13px", left: "11%", right: "11%", height: "34px", borderRadius: "16px 16px 0 0", background: "linear-gradient(180deg,#F7F9FC 0%,#FFFFFF 100%)", border: "1px solid #E4E9F0", borderBottom: "none", boxShadow: "0 -1px 2px rgba(16,42,84,.04)", zIndex: "0" }} />
                <span aria-hidden="true" style={{ position: "absolute", top: "-6px", left: "6.5%", right: "6.5%", height: "26px", borderRadius: "16px 16px 0 0", background: "linear-gradient(180deg,#FBFCFE 0%,#FFFFFF 100%)", border: "1px solid #E8EDF4", borderBottom: "none", boxShadow: "0 -1px 2px rgba(16,42,84,.03)", zIndex: "0" }} />
                <Sx as="button" hover={{ transform: "translateY(-4px)", boxShadow: "0 30px 56px -28px rgba(16,42,84,.5),0 3px 10px -4px rgba(16,42,84,.14)", borderColor: "#C3D5EE" }} active={{ transform: "translateY(-1px) scale(.994)" }} onClick={ct?.pick} aria-label={ct?.aria} className="ct-card" style={{ position: "relative", zIndex: "1", textAlign: "left", display: "flex", width: "100%", height: "100%", padding: "6px", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(16,42,84,.07)", background: "linear-gradient(162deg,#FFFFFF 0%,#EEF3FA 100%)", boxShadow: "0 20px 44px -26px rgba(16,42,84,.5),0 2px 5px -3px rgba(16,42,84,.14)", cursor: "pointer", color: "#1A1E26", transition: "transform .5s cubic-bezier(.32,.72,0,1),box-shadow .5s cubic-bezier(.32,.72,0,1),border-color .5s cubic-bezier(.32,.72,0,1)" }}>
                  <span aria-hidden="true" className="ct-aura" style={{ position: "absolute", top: "-56px", right: "-52px", width: "232px", height: "232px", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,112,224,.18),rgba(0,112,224,0))", pointerEvents: "none", transition: "transform .6s cubic-bezier(.32,.72,0,1),opacity .6s", opacity: ".9" }} />
                  <span aria-hidden="true" className="ct-illo" style={{ position: "absolute", top: "-4px", right: "-20px", width: "290px", height: "180px", opacity: ".78", pointerEvents: "none", filter: "drop-shadow(0 8px 10px rgba(16,42,84,.14))", transition: "transform .6s cubic-bezier(.32,.72,0,1),opacity .6s", transformOrigin: "78% 40%", WebkitMaskImage: "linear-gradient(214deg,#000 48%,transparent 82%)", maskImage: "linear-gradient(214deg,#000 48%,transparent 82%)" }}>
                    <svg role="presentation" aria-hidden="true" width="300" height="188" viewBox="0 0 200 120" style={{ display: ct?.dJON }}>
                      <ellipse cx="102" cy="112" rx="80" ry="15" fill="url(#jonShadowG)" />
                      <path d="M100,97 Q100,92 104.42,89.66 L163.58,58.34 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 100,113 Z" fill="url(#jonRightG)" />
                      <path d="M113.6,103.4 Q113.6,100.4 116.25,99 L153.11,79.48 Q155.76,78.08 155.76,81.08 L155.76,82.88 Q155.76,85.88 153.11,87.28 L116.25,106.8 Q113.6,108.2 113.6,105.2 Z" fill="url(#jonGrilleG)" />
                      <path d="M113.6,100.4 L155.76,78.08" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.6" />
                      <g fill="#16181D">
                        <circle cx="117" cy="100.16" r="0.9" />
                        <circle cx="120.94" cy="98.07" r="0.9" />
                        <circle cx="124.89" cy="95.98" r="0.9" />
                        <circle cx="128.83" cy="93.9" r="0.9" />
                        <circle cx="132.78" cy="91.81" r="0.9" />
                        <circle cx="136.72" cy="89.72" r="0.9" />
                        <circle cx="140.66" cy="87.63" r="0.9" />
                        <circle cx="144.61" cy="85.54" r="0.9" />
                        <circle cx="148.55" cy="83.46" r="0.9" />
                        <circle cx="152.5" cy="81.37" r="0.9" />
                        <circle cx="118.97" cy="100.68" r="0.9" />
                        <circle cx="122.92" cy="98.59" r="0.9" />
                        <circle cx="126.86" cy="96.5" r="0.9" />
                        <circle cx="130.8" cy="94.41" r="0.9" />
                        <circle cx="134.75" cy="92.32" r="0.9" />
                        <circle cx="138.69" cy="90.24" r="0.9" />
                        <circle cx="142.64" cy="88.15" r="0.9" />
                        <circle cx="146.58" cy="86.06" r="0.9" />
                        <circle cx="150.52" cy="83.97" r="0.9" />
                        <circle cx="117" cy="103.28" r="0.9" />
                        <circle cx="120.94" cy="101.19" r="0.9" />
                        <circle cx="124.89" cy="99.1" r="0.9" />
                        <circle cx="128.83" cy="97.02" r="0.9" />
                        <circle cx="132.78" cy="94.93" r="0.9" />
                        <circle cx="136.72" cy="92.84" r="0.9" />
                        <circle cx="140.66" cy="90.75" r="0.9" />
                        <circle cx="144.61" cy="88.66" r="0.9" />
                        <circle cx="148.55" cy="86.58" r="0.9" />
                        <circle cx="152.5" cy="84.49" r="0.9" />
                        <circle cx="118.97" cy="103.8" r="0.9" />
                        <circle cx="122.92" cy="101.71" r="0.9" />
                        <circle cx="126.86" cy="99.62" r="0.9" />
                        <circle cx="130.8" cy="97.53" r="0.9" />
                        <circle cx="134.75" cy="95.44" r="0.9" />
                        <circle cx="138.69" cy="93.36" r="0.9" />
                        <circle cx="142.64" cy="91.27" r="0.9" />
                        <circle cx="146.58" cy="89.18" r="0.9" />
                        <circle cx="150.52" cy="87.09" r="0.9" />
                      </g>
                      <g fontFamily="system-ui,-apple-system,sans-serif" fill="#D4E4FB" textAnchor="middle">
                        <text transform="matrix(0.8838,-0.4679,0,1,134,77.9)" fontSize="4.4" fontWeight="600" letterSpacing="0.6">PROCTORING</text>
                        <text transform="matrix(0.8838,-0.4679,0,1,134,82.58)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Anywhere · Anytime</text>
                        <text transform="matrix(0.8838,-0.4679,0,1,134,86.48)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Instantly</text>
                      </g>
                      <path d="M36.42,58.34 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 163.58,58.34 L104.42,89.66 Q100,92 95.58,89.66 Z" fill="url(#jonTopG)" />
                      <path d="M36,56 Q32,56 35.54,54.13 L96.46,21.87 Q100,20 100,24 L100,30 Q100,34 96.3,35.51 L49.7,54.49 Q46,56 42,56 Z" fill="#5F9BFF" opacity="0.28" />
                      <path d="M32,61 Q32,56 36.42,58.34 L95.58,89.66 Q100,92 100,97 L100,98.44 Q100,103.44 95.58,101.1 L36.42,69.78 Q32,67.44 32,62.44 Z" fill="url(#jonLeftG)" />
                      <path d="M32,72.44 Q32,67.44 36.42,69.78 L95.58,101.1 Q100,103.44 100,108.44 L100,113 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" fill="url(#jonBaseG)" />
                      <line x1="32" y1="67.9" x2="100" y2="103.9" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                      <g fill="#111319">
                        <polygon points="37.78,75.05 45.26,79.01 45.26,83.43 37.78,79.47" />
                        <polygon points="49.34,81.17 59.54,86.57 59.54,90.99 49.34,85.59" />
                        <polygon points="62.26,88.01 72.46,93.41 72.46,97.83 62.26,92.43" />
                        <polygon points="75.52,94.64 87.76,101.12 87.76,106.32 75.52,99.84" />
                      </g>
                      <g stroke="#9FB0C4" strokeWidth="0.7" opacity="0.7" fill="none" strokeLinecap="round">
                        <line x1="37.78" y1="75.05" x2="45.26" y2="79.01" />
                        <line x1="49.34" y1="81.17" x2="59.54" y2="86.57" />
                        <line x1="62.26" y1="88.01" x2="72.46" y2="93.41" />
                        <line x1="75.52" y1="94.64" x2="87.76" y2="101.12" />
                      </g>
                      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                        <polyline points="32,56 100,20 168,56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                        <polyline points="32,56 100,92 168,56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                        <line x1="100" y1="92" x2="100" y2="118" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                        <line x1="32" y1="56" x2="32" y2="82" stroke="#6E97DC" strokeWidth="0.8" opacity="0.6" />
                        <path d="M32,61 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                      </g>
                      <g transform="rotate(26,92,34)">
                        <path transform="translate(80.95,23.46) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.5" />
                        <path transform="translate(79.55,22.06) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                      </g>
                      <text transform="matrix(0.8838,0.4679,-0.8838,0.4679,101.5,58)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="1.1" fill="#EAF2FF">SARAS</text>
                    </svg>
                    <svg role="presentation" aria-hidden="true" width="300" height="188" viewBox="0 0 200 120" style={{ display: ct?.dRPI }}>
                      <ellipse cx="88" cy="114" rx="78" ry="13" fill="url(#jonShadowG)" />
                      <polygon points="73,79.82 139.6,43.56 139.6,73.56 73,109.82" fill="url(#jonRightG)" />
                      <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82" fill="url(#jonTopG)" />
                      <polygon points="33.4,58.26 100,22 88.01,28.53 40.53,62.14" fill="#5F9BFF" opacity="0.22" />
                      <polygon points="33.4,58.26 73,79.82 73,96.62 33.4,75.06" fill="url(#jonLeftG)" />
                      <polygon points="33.4,75.06 73,96.62 73,109.82 33.4,88.26" fill="url(#jonBaseG)" />
                      <line x1="33.4" y1="75.06" x2="73" y2="96.62" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                      <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="#D4D9E0" />
                      <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                      <polygon points="37.16,81.31 41.91,83.9 41.91,89.3 37.16,86.71" fill="#14161B" />
                      <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="#D4D9E0" />
                      <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                      <polygon points="46.47,85.17 51.22,87.76 51.22,90.76 46.47,88.17" fill="#2458A6" />
                      <polygon points="46.47,89.97 51.22,92.56 51.22,95.56 46.47,92.97" fill="#2458A6" />
                      <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="#D4D9E0" />
                      <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                      <polygon points="55.18,89.92 59.93,92.51 59.93,95.51 55.18,92.92" fill="#15171C" />
                      <polygon points="55.18,94.72 59.93,97.31 59.93,100.31 55.18,97.72" fill="#15171C" />
                      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                        <polyline points="33.4,58.26 100,22 139.6,43.56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                        <polyline points="33.4,58.26 73,79.82 139.6,43.56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                        <line x1="73" y1="79.82" x2="73" y2="109.82" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                        <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82 73,109.82 33.4,88.26" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                      </g>
                      <g transform="translate(80,35) rotate(14) scale(0.26,0.17) translate(-28,-34)">
                        <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.4" transform="translate(-1.5,4)" />
                        <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                      </g>
                      <text textAnchor="middle" transform="matrix(0.8838,0.4679,-0.8838,0.4679,84.5,55)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="6" fontWeight="700" letterSpacing="0.5" fill="#EAF2FF">SARAS</text>
                    </svg>
                    <svg role="presentation" aria-hidden="true" width="300" height="188" viewBox="0 0 200 120" style={{ display: ct?.dTHR }}>
                      <polygon points="74.9,42 77.3,43.4 77.3,41.8 74.9,40.4" fill="#08090a" />
                      <polygon points="79.7,42 77.3,43.4 77.3,41.8 79.7,40.4" fill="#060607" />
                      <polygon points="77.3,39 79.7,40.4 77.3,41.8 74.9,40.4" fill="#0d0e10" />
                      <polygon points="151.1,86 153.5,87.4 153.5,85.8 151.1,84.4" fill="#08090a" />
                      <polygon points="155.9,86 153.5,87.4 153.5,85.8 155.9,84.4" fill="#060607" />
                      <polygon points="153.5,83 155.9,84.4 153.5,85.8 151.1,84.4" fill="#0d0e10" />
                      <polygon points="119.9,104 122.3,105.4 122.3,103.8 119.9,102.4" fill="#08090a" />
                      <polygon points="124.8,104 122.3,105.4 122.3,103.8 124.8,102.4" fill="#060607" />
                      <polygon points="122.3,101 124.8,102.4 122.3,103.8 119.9,102.4" fill="#0d0e10" />
                      <polygon points="43.7,60 46.1,61.4 46.1,59.8 43.7,58.4" fill="#08090a" />
                      <polygon points="48.6,60 46.1,61.4 46.1,59.8 48.6,58.4" fill="#060607" />
                      <polygon points="46.1,57 48.6,58.4 46.1,59.8 43.7,58.4" fill="#0d0e10" />
                      <polygon points="38.5,58.2 122.7,106.8 122.7,85.6 38.5,37" fill="#1b1d21" />
                      <polygon points="161.5,84.4 122.7,106.8 122.7,85.6 161.5,63.2" fill="url(#tSide)" />
                      <polygon points="77.3,14.6 161.5,63.2 122.7,85.6 38.5,37" fill="url(#tTop)" />
                      <line x1="38.5" y1="37" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                      <line x1="161.5" y1="63.2" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                      <polygon points="77.3,18.6 154.6,63.2 122.7,81.6 45.4,37" fill="#24272c" />
                      <line x1="45.4" y1="37" x2="122.7" y2="81.6" stroke="#3b4048" strokeWidth=".6" strokeLinecap="round" />
                      <polygon points="53.1,36.6 70.4,46.6 68.3,47.8 51,37.8" fill="#76B900" />
                      <polygon points="40.6,57 107.8,95.8 107.8,79.4 40.6,40.6" fill="url(#tFin)" />
                      <line x1="41.3" y1="57" x2="41.3" y2="41.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="41.7" y1="57.3" x2="41.7" y2="41.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="42.7" y1="57.8" x2="42.7" y2="42.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="43.2" y1="58.1" x2="43.2" y2="43" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="44.2" y1="58.7" x2="44.2" y2="43.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="44.6" y1="58.9" x2="44.6" y2="44.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="45.6" y1="59.5" x2="45.6" y2="45" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="46.1" y1="59.8" x2="46.1" y2="45.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="47.1" y1="60.4" x2="47.1" y2="46.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="47.6" y1="60.6" x2="47.6" y2="46.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="48.6" y1="61.2" x2="48.6" y2="47.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="49" y1="61.5" x2="49" y2="47.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="50" y1="62" x2="50" y2="48.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="50.5" y1="62.3" x2="50.5" y2="48.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="51.5" y1="62.9" x2="51.5" y2="49.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="51.9" y1="63.1" x2="51.9" y2="49.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="52.9" y1="63.7" x2="52.9" y2="50.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="53.4" y1="64" x2="53.4" y2="50.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="54.4" y1="64.6" x2="54.4" y2="51" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="54.8" y1="64.8" x2="54.8" y2="51.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="55.8" y1="65.4" x2="55.8" y2="51.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="56.3" y1="65.7" x2="56.3" y2="52.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="57.3" y1="66.2" x2="57.3" y2="52.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="57.7" y1="66.5" x2="57.7" y2="52.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="58.7" y1="67.1" x2="58.7" y2="53.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="59.2" y1="67.3" x2="59.2" y2="53.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="60.2" y1="67.9" x2="60.2" y2="54.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="60.6" y1="68.2" x2="60.6" y2="54.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="61.7" y1="68.8" x2="61.7" y2="54.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="62.1" y1="69" x2="62.1" y2="55.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="63.1" y1="69.6" x2="63.1" y2="55.6" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="63.6" y1="69.9" x2="63.6" y2="55.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="64.6" y1="70.4" x2="64.6" y2="56.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="65" y1="70.7" x2="65" y2="56.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="66" y1="71.3" x2="66" y2="57" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="66.5" y1="71.5" x2="66.5" y2="57.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="67.5" y1="72.1" x2="67.5" y2="57.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="67.9" y1="72.4" x2="67.9" y2="57.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="68.9" y1="73" x2="68.9" y2="58.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="69.4" y1="73.2" x2="69.4" y2="58.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="70.4" y1="73.8" x2="70.4" y2="59.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="70.8" y1="74.1" x2="70.8" y2="59.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="71.8" y1="74.6" x2="71.8" y2="59.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="72.3" y1="74.9" x2="72.3" y2="60.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="73.3" y1="75.5" x2="73.3" y2="60.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="73.7" y1="75.7" x2="73.7" y2="61" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="74.7" y1="76.3" x2="74.7" y2="61.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="75.2" y1="76.6" x2="75.2" y2="61.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="76.2" y1="77.2" x2="76.2" y2="62.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="76.7" y1="77.4" x2="76.7" y2="62.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="77.7" y1="78" x2="77.7" y2="63.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="78.1" y1="78.3" x2="78.1" y2="63.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="79.1" y1="78.8" x2="79.1" y2="64.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="79.6" y1="79.1" x2="79.6" y2="64.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="80.6" y1="79.7" x2="80.6" y2="65.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="81" y1="79.9" x2="81" y2="65.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="82" y1="80.5" x2="82" y2="66.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="82.5" y1="80.8" x2="82.5" y2="66.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="83.5" y1="81.4" x2="83.5" y2="67.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="83.9" y1="81.6" x2="83.9" y2="67.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="84.9" y1="82.2" x2="84.9" y2="68.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="85.4" y1="82.5" x2="85.4" y2="68.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="86.4" y1="83" x2="86.4" y2="69.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="86.8" y1="83.3" x2="86.8" y2="69.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="87.8" y1="83.9" x2="87.8" y2="70" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="88.3" y1="84.1" x2="88.3" y2="70.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="89.3" y1="84.7" x2="89.3" y2="71" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="89.7" y1="85" x2="89.7" y2="71.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="90.8" y1="85.6" x2="90.8" y2="71.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="91.2" y1="85.8" x2="91.2" y2="72.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="92.2" y1="86.4" x2="92.2" y2="72.8" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="92.7" y1="86.7" x2="92.7" y2="73.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="93.7" y1="87.2" x2="93.7" y2="73.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="94.1" y1="87.5" x2="94.1" y2="74" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="95.1" y1="88.1" x2="95.1" y2="74.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="95.6" y1="88.3" x2="95.6" y2="74.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="96.6" y1="88.9" x2="96.6" y2="75.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="97" y1="89.2" x2="97" y2="75.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="98" y1="89.8" x2="98" y2="76" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="98.5" y1="90" x2="98.5" y2="76.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="99.5" y1="90.6" x2="99.5" y2="76.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="99.9" y1="90.9" x2="99.9" y2="77" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="100.9" y1="91.4" x2="100.9" y2="77.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="101.4" y1="91.7" x2="101.4" y2="77.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="102.4" y1="92.3" x2="102.4" y2="77.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="102.8" y1="92.5" x2="102.8" y2="78.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="103.8" y1="93.1" x2="103.8" y2="78.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="104.3" y1="93.4" x2="104.3" y2="78.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="105.3" y1="94" x2="105.3" y2="79" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="105.8" y1="94.2" x2="105.8" y2="79.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <line x1="106.8" y1="94.8" x2="106.8" y2="79.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                      <line x1="107.2" y1="95.1" x2="107.2" y2="79.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                      <polygon points="111.1,87.5 112.9,88.6 112.9,86.5 111.1,85.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                      <polygon points="114.5,89.5 116.3,90.6 116.3,88.5 114.5,87.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                      <polygon points="118,91.5 119.8,92.6 119.8,90.5 118,89.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                      <polygon points="111.6,92.4 113,93.2 113,92.2 111.6,91.4" fill="#34D058" />
                      <polygon points="114.7,94.2 116.1,95 116.1,94 114.7,93.2" fill="#F59E0B" />
                      <polygon points="158.7,74 153.9,76.8 153.9,74.4 158.7,71.6" fill="#B9C0C8" />
                      <polygon points="158.3,72.9 154.3,75.2 154.3,74.8 158.3,72.4" fill="#2B5DA8" />
                      <polygon points="158.7,77.6 153.9,80.4 153.9,78 158.7,75.2" fill="#B9C0C8" />
                      <polygon points="158.3,76.5 154.3,78.8 154.3,78.4 158.3,76" fill="#2B5DA8" />
                      <polygon points="152.5,81.2 146.9,84.4 146.9,78.8 152.5,75.6" fill="#A7AEB6" />
                      <polygon points="152.1,78.4 147.4,81.1 147.4,80 152.1,77.2" fill="#15171a" />
                      <polygon points="145.6,82.4 140.4,85.4 140.4,83 145.6,80" fill="#0a0b0c" />
                      <polygon points="145.6,85.6 141,88.2 141,85.8 145.6,83.2" fill="#0a0b0c" />
                      <polygon points="139,85.4 135.9,87.2 135.9,85.6 139,83.8" fill="#B9C0C8" />
                      <polygon points="139,88.2 135.9,90 135.9,88.4 139,86.6" fill="#B9C0C8" />
                      <polygon points="134.5,92.4 126.2,97.2 126.2,90.4 134.5,85.6" fill="#C9CED4" />
                      <polygon points="134.1,88.9 126.6,93.2 126.6,91.9 134.1,87.5" fill="#2a2d32" />
                      <polygon points="130.3,86.4 128.2,87.6 128.2,86.4 130.3,85.2" fill="#0a0b0c" />
                    </svg>
                    <svg role="presentation" aria-hidden="true" width="300" height="188" viewBox="0 0 200 120" style={{ display: ct?.dDGX }}>
                      <ellipse cx="100" cy="113" rx="73" ry="10" fill="#8A8F96" opacity="0.3" />
                      <polygon points="100,9.8 165,47.3 100,84.8 35.1,47.3" fill="url(#sTop)" />
                      <polygon points="35.1,47.3 100,84.8 100,110 35.1,72.5" fill="url(#sSide)" />
                      <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoam)" />
                      <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoamShade)" />
                      <g>
                        <rect x="45" y="73.5" width="17" height="8" rx="2.5" fill="#F3F1EB" />
                        <circle cx="49.5" cy="77.5" r="2" fill="#76B900" />
                        <circle cx="49.3" cy="77.3" r="0.8" fill="#E2F2C6" />
                      </g>
                      <polygon points="165,47.3 100,84.8 100,110 165,72.5" fill="url(#sFront)" />
                      <g transform="matrix(64.9,-37.5,64.9,37.5,35.1,47.3)">
                        <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" fill="url(#dgxBlue)" />
                        <g clipPath="url(#dgxClip2)">
                          <ellipse cx="0.35" cy="0.12" rx="0.32" ry="0.09" fill="#FFFFFF" opacity="0.07" />
                          <rect x="0.11" y="0.1" width="0.075" height="0.075" rx="0.014" fill="#F5901E" />
                          <path d="M0.125,0.118 L0.17,0.118 L0.147,0.137 L0.17,0.137 L0.122,0.162 L0.142,0.137 L0.117,0.137 Z" fill="#FFFFFF" />
                          <rect x="0.205" y="0.112" width="0.28" height="0.026" rx="0.013" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.205" y="0.148" width="0.1" height="0.018" rx="0.009" fill="#CFE0F5" opacity="0.75" />
                          <rect x="0.58" y="0.1" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                          <rect x="0.66" y="0.104" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.66" y="0.132" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                          <rect x="0.58" y="0.19" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                          <rect x="0.66" y="0.194" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.66" y="0.222" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                          <rect x="0.58" y="0.28" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                          <rect x="0.66" y="0.284" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.66" y="0.312" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                          <rect x="0.58" y="0.37" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                          <rect x="0.66" y="0.374" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.66" y="0.402" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                          <rect x="0.58" y="0.46" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                          <rect x="0.66" y="0.464" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                          <rect x="0.66" y="0.492" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                          <rect x="0.11" y="0.55" width="0.14" height="0.14" rx="0.02" fill="none" stroke="#FFFFFF" strokeWidth="0.012" />
                          <line x1="0.18" y1="0.555" x2="0.18" y2="0.685" stroke="#FFFFFF" strokeWidth="0.01" />
                          <path d="M0.125,0.59 Q0.18,0.565 0.235,0.59" fill="none" stroke="#CFE0F5" strokeWidth="0.008" />
                          <path d="M0.275,0.465 L0.2926,0.5024 L0.33,0.52 L0.2926,0.5376 L0.275,0.575 L0.2574,0.5376 L0.22,0.52 L0.2574,0.5024 Z" fill="#F5901E" />
                          <path d="M0.325,0.568 L0.3352,0.5898 L0.357,0.6 L0.3352,0.6102 L0.325,0.632 L0.3148,0.6102 L0.293,0.6 L0.3148,0.5898 Z" fill="#F5901E" />
                          <image href="/assets/saras-schoolai-panel.png" x="0.3" y="0.5" width="0.54" height="0.24" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
                          <rect x="0.11" y="0.76" width="0.78" height="0.022" rx="0.011" fill="#BFD3EE" opacity="0.8" />
                          <path d="M0.05,0.82 C0.25,0.78 0.45,0.86 0.6,0.81 C0.75,0.77 0.85,0.83 0.95,0.8 L0.95,0.95 L0.05,0.95 Z" fill="#4A97E5" />
                          <path d="M0.05,0.86 C0.25,0.82 0.45,0.9 0.6,0.85 C0.75,0.81 0.85,0.87 0.95,0.84 L0.95,0.95 L0.05,0.95 Z" fill="#EE8020" />
                          <path d="M0.05,0.895 C0.27,0.86 0.47,0.93 0.62,0.89 C0.77,0.855 0.85,0.91 0.95,0.89 L0.95,0.95 L0.05,0.95 Z" fill="#F3F5F8" />
                        </g>
                      </g>
                      <line x1="100" y1="9.8" x2="165" y2="47.3" stroke="#F3ECDD" strokeWidth="0.7" strokeLinecap="round" />
                      <line x1="100" y1="9.8" x2="35.1" y2="47.3" stroke="#F7F0E2" strokeWidth="0.7" strokeLinecap="round" />
                      <line x1="165" y1="47.3" x2="100" y2="84.8" stroke="#E7DCCB" strokeWidth="0.6" strokeLinecap="round" />
                      <line x1="100" y1="84.8" x2="100" y2="110" stroke="#8E8075" strokeWidth="0.5" />
                    </svg>
                  </span>
                  <span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "24px", background: "linear-gradient(104deg,rgba(243,247,252,.96) 0%,rgba(243,247,252,.88) 38%,rgba(243,247,252,.5) 64%,rgba(243,247,252,.12) 100%)", pointerEvents: "none" }} />
                  <span aria-hidden="true" style={{ position: "absolute", inset: "42% 0 0 0", borderRadius: "0 0 24px 24px", background: "linear-gradient(180deg,rgba(243,247,252,0) 0%,rgba(243,247,252,.7) 48%,rgba(243,247,252,.95) 100%)", pointerEvents: "none" }} />
                  <span style={{ position: "relative", flex: "1", display: "flex", flexDirection: "column", gap: "16px", padding: "20px", borderRadius: "18px", background: "transparent", border: "0", boxShadow: "none" }}>
                    <span style={{ display: "flex", alignItems: "flex-start", gap: "13px" }}>
                      <span aria-hidden="true" style={{ width: "4px", alignSelf: "stretch", flexShrink: "0", borderRadius: "999px", background: "linear-gradient(180deg,#0070E0 0%,#38A0FF 100%)", boxShadow: "0 1px 4px rgba(0,112,224,.4)" }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0", flex: "1" }}>
                        <span className="ct-title" style={{ fontSize: "15.5px", fontWeight: "600", letterSpacing: "-.01em", transition: "color .3s cubic-bezier(.32,.72,0,1)" }}>{ct?.product}</span>
                        <span style={{ fontSize: "12px", color: "#5A6675", lineHeight: "1.35" }}>{ct?.name}</span>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "baseline", gap: "9px" }}>
                      <span style={{ fontSize: "38px", fontWeight: "500", lineHeight: ".9", letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{ct?.count}</span>
                      <span style={{ fontSize: "12.5px", color: "#5A6675" }}>{ct?.unitText}</span>
                    </span>
                    <span aria-hidden="true" style={{ display: "flex", height: "9px", borderRadius: "999px", overflow: "hidden", background: "#EEF2F7", gap: "2px", boxShadow: "inset 0 1px 2px rgba(16,42,84,.14)" }}>
                      {ct?.healthy ? <span style={{ width: ct?.healthy_w, background: "linear-gradient(180deg,#34C56A,#16A34A)" }} /> : null}
                      {ct?.warning ? <span style={{ width: ct?.warning_w, background: "linear-gradient(180deg,#FBBF24,#F59E0B)" }} /> : null}
                      {ct?.critical ? <span style={{ width: ct?.critical_w, background: "linear-gradient(180deg,#EF4444,#DC2626)" }} /> : null}
                      {ct?.offline ? <span style={{ width: ct?.offline_w, background: "linear-gradient(180deg,#A3ACB9,#8A93A2)" }} /> : null}
                    </span>
                    <span style={{ display: "flex", flexWrap: "wrap", gap: "9px 14px", fontSize: "12px", color: "#5A6675" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", color: "#1A1E26" }}>
                        <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16A34A" }} />{ct?.healthy} healthy
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", color: "#1A1E26" }}>
                        <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />{ct?.warning} warning
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", color: "#1A1E26" }}>
                        <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#DC2626" }} />{ct?.critical} critical
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", color: "#1A1E26" }}>
                        <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8A93A2" }} />{ct?.offline} offline
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #EEF2F7" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "600", color: ct?.healthFg }}>
                        <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "currentColor", boxShadow: "0 0 0 3px color-mix(in srgb,currentColor 18%,transparent)" }} />{ct?.healthText}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "34px", padding: "0 6px 0 14px", borderRadius: "999px", background: "#005BB8", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", boxShadow: "0 6px 14px -6px rgba(0,112,224,.6),inset 0 1px 0 rgba(255,255,255,.25)" }}>View
                        <span aria-hidden="true" style={{ width: "22px", height: "22px", borderRadius: "999px", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </span>
                </Sx>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
      <nav aria-label="Breadcrumb" className="drill-crumb" style={{ display: v.catBackDisplay, alignItems: "center", gap: "6px" }}>
        <ol style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", minWidth: "0", flexWrap: "wrap" }}>
          <li>
            <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={v.backToCats} style={{ height: "36px", display: "flex", alignItems: "center", gap: "6px", padding: "0 10px 0 6px", marginLeft: "-6px", border: "0", borderRadius: "8px", background: "transparent", color: "#005BB8", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Device types</span>
            </Sx>
          </li>
          <li aria-hidden="true" style={{ color: "#8A93A2" }}>/</li>
          <li aria-current="page" style={{ fontWeight: "600", color: "#1A1E26", whiteSpace: "nowrap" }}>{v.drillTitle}</li>
        </ol>
      </nav>
      <section aria-label="Device-level overview" className="drill-view" style={{ position: "relative", display: v.devWrapDisplay, flexDirection: "column", gap: "18px", padding: "7px", borderRadius: "24px", border: "1px solid rgba(16,42,84,.07)", background: "linear-gradient(162deg,#FFFFFF 0%,#EAF1FB 60%,#E2ECF9 100%)", boxShadow: "0 20px 44px -26px rgba(16,42,84,.5),0 2px 5px -3px rgba(16,42,84,.14)", overflow: "hidden" }}>
        <span aria-hidden="true" className="drill-aura" style={{ position: "absolute", top: "-120px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,112,224,.22),rgba(0,112,224,0) 72%)", pointerEvents: "none", zIndex: "0" }} />
        <span aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(16,42,84,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,42,84,.04) 1px,transparent 1px)", backgroundSize: "26px 26px", WebkitMaskImage: "radial-gradient(120% 90% at 85% 0%,#000 0%,transparent 60%)", maskImage: "radial-gradient(120% 90% at 85% 0%,#000 0%,transparent 60%)", pointerEvents: "none", zIndex: "0" }} />
        <span aria-hidden="true" className="drill-sheen" style={{ position: "absolute", top: "0", bottom: "0", left: "0", width: "45%", background: "linear-gradient(100deg,transparent,rgba(255,255,255,.65),transparent)", pointerEvents: "none", zIndex: "1" }} />
        <div style={{ position: "relative", zIndex: "2", display: "flex", alignItems: "center", gap: "18px", padding: "20px 22px 4px" }}>
          <span aria-hidden="true" style={{ position: "relative", flexShrink: "0", width: "112px", height: "112px", borderRadius: "24px", overflow: "hidden", background: "radial-gradient(125% 125% at 32% 20%,#F4F8FF 0%,#E3EEFB 52%,#D2E3F6 100%)", border: "1px solid rgba(16,42,84,.08)", boxShadow: "inset 0 1px 2px rgba(255,255,255,.95),inset 0 -8px 16px rgba(0,80,180,.07),0 8px 18px -10px rgba(16,42,84,.35)" }}>
            <span aria-hidden="true" style={{ position: "absolute", top: "10px", left: "14px", right: "14px", height: "34px", borderRadius: "999px", background: "linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,0))", pointerEvents: "none" }} />
            <span style={{ display: v.drillOneDisplay, position: "absolute", inset: "0" }}>
              <svg role="presentation" aria-hidden="true" width="156" height="98" viewBox="2 14 200 120" style={{ display: v.drillJON, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <ellipse cx="102" cy="112" rx="80" ry="15" fill="url(#jonShadowG)" />
                <path d="M100,97 Q100,92 104.42,89.66 L163.58,58.34 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 100,113 Z" fill="url(#jonRightG)" />
                <path d="M113.6,103.4 Q113.6,100.4 116.25,99 L153.11,79.48 Q155.76,78.08 155.76,81.08 L155.76,82.88 Q155.76,85.88 153.11,87.28 L116.25,106.8 Q113.6,108.2 113.6,105.2 Z" fill="url(#jonGrilleG)" />
                <path d="M113.6,100.4 L155.76,78.08" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.6" />
                <g fill="#16181D">
                  <circle cx="117" cy="100.16" r="0.9" />
                  <circle cx="120.94" cy="98.07" r="0.9" />
                  <circle cx="124.89" cy="95.98" r="0.9" />
                  <circle cx="128.83" cy="93.9" r="0.9" />
                  <circle cx="132.78" cy="91.81" r="0.9" />
                  <circle cx="136.72" cy="89.72" r="0.9" />
                  <circle cx="140.66" cy="87.63" r="0.9" />
                  <circle cx="144.61" cy="85.54" r="0.9" />
                  <circle cx="148.55" cy="83.46" r="0.9" />
                  <circle cx="152.5" cy="81.37" r="0.9" />
                  <circle cx="118.97" cy="100.68" r="0.9" />
                  <circle cx="122.92" cy="98.59" r="0.9" />
                  <circle cx="126.86" cy="96.5" r="0.9" />
                  <circle cx="130.8" cy="94.41" r="0.9" />
                  <circle cx="134.75" cy="92.32" r="0.9" />
                  <circle cx="138.69" cy="90.24" r="0.9" />
                  <circle cx="142.64" cy="88.15" r="0.9" />
                  <circle cx="146.58" cy="86.06" r="0.9" />
                  <circle cx="150.52" cy="83.97" r="0.9" />
                  <circle cx="117" cy="103.28" r="0.9" />
                  <circle cx="120.94" cy="101.19" r="0.9" />
                  <circle cx="124.89" cy="99.1" r="0.9" />
                  <circle cx="128.83" cy="97.02" r="0.9" />
                  <circle cx="132.78" cy="94.93" r="0.9" />
                  <circle cx="136.72" cy="92.84" r="0.9" />
                  <circle cx="140.66" cy="90.75" r="0.9" />
                  <circle cx="144.61" cy="88.66" r="0.9" />
                  <circle cx="148.55" cy="86.58" r="0.9" />
                  <circle cx="152.5" cy="84.49" r="0.9" />
                  <circle cx="118.97" cy="103.8" r="0.9" />
                  <circle cx="122.92" cy="101.71" r="0.9" />
                  <circle cx="126.86" cy="99.62" r="0.9" />
                  <circle cx="130.8" cy="97.53" r="0.9" />
                  <circle cx="134.75" cy="95.44" r="0.9" />
                  <circle cx="138.69" cy="93.36" r="0.9" />
                  <circle cx="142.64" cy="91.27" r="0.9" />
                  <circle cx="146.58" cy="89.18" r="0.9" />
                  <circle cx="150.52" cy="87.09" r="0.9" />
                </g>
                <g fontFamily="system-ui,-apple-system,sans-serif" fill="#D4E4FB" textAnchor="middle">
                  <text transform="matrix(0.8838,-0.4679,0,1,134,77.9)" fontSize="4.4" fontWeight="600" letterSpacing="0.6">PROCTORING</text>
                  <text transform="matrix(0.8838,-0.4679,0,1,134,82.58)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Anywhere · Anytime</text>
                  <text transform="matrix(0.8838,-0.4679,0,1,134,86.48)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Instantly</text>
                </g>
                <path d="M36.42,58.34 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 163.58,58.34 L104.42,89.66 Q100,92 95.58,89.66 Z" fill="url(#jonTopG)" />
                <path d="M36,56 Q32,56 35.54,54.13 L96.46,21.87 Q100,20 100,24 L100,30 Q100,34 96.3,35.51 L49.7,54.49 Q46,56 42,56 Z" fill="#5F9BFF" opacity="0.28" />
                <path d="M32,61 Q32,56 36.42,58.34 L95.58,89.66 Q100,92 100,97 L100,98.44 Q100,103.44 95.58,101.1 L36.42,69.78 Q32,67.44 32,62.44 Z" fill="url(#jonLeftG)" />
                <path d="M32,72.44 Q32,67.44 36.42,69.78 L95.58,101.1 Q100,103.44 100,108.44 L100,113 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" fill="url(#jonBaseG)" />
                <line x1="32" y1="67.9" x2="100" y2="103.9" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                <g fill="#111319">
                  <polygon points="37.78,75.05 45.26,79.01 45.26,83.43 37.78,79.47" />
                  <polygon points="49.34,81.17 59.54,86.57 59.54,90.99 49.34,85.59" />
                  <polygon points="62.26,88.01 72.46,93.41 72.46,97.83 62.26,92.43" />
                  <polygon points="75.52,94.64 87.76,101.12 87.76,106.32 75.52,99.84" />
                </g>
                <g stroke="#9FB0C4" strokeWidth="0.7" opacity="0.7" fill="none" strokeLinecap="round">
                  <line x1="37.78" y1="75.05" x2="45.26" y2="79.01" />
                  <line x1="49.34" y1="81.17" x2="59.54" y2="86.57" />
                  <line x1="62.26" y1="88.01" x2="72.46" y2="93.41" />
                  <line x1="75.52" y1="94.64" x2="87.76" y2="101.12" />
                </g>
                <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                  <polyline points="32,56 100,20 168,56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                  <polyline points="32,56 100,92 168,56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                  <line x1="100" y1="92" x2="100" y2="118" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                  <line x1="32" y1="56" x2="32" y2="82" stroke="#6E97DC" strokeWidth="0.8" opacity="0.6" />
                  <path d="M32,61 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                </g>
                <g transform="rotate(26,92,34)">
                  <path transform="translate(80.95,23.46) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.5" />
                  <path transform="translate(79.55,22.06) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                </g>
                <text transform="matrix(0.8838,0.4679,-0.8838,0.4679,101.5,58)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="1.1" fill="#EAF2FF">SARAS</text>
              </svg>
              <svg role="presentation" aria-hidden="true" width="156" height="98" viewBox="-12 15 200 120" style={{ display: v.drillRPI, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <ellipse cx="88" cy="114" rx="78" ry="13" fill="url(#jonShadowG)" />
                <polygon points="73,79.82 139.6,43.56 139.6,73.56 73,109.82" fill="url(#jonRightG)" />
                <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82" fill="url(#jonTopG)" />
                <polygon points="33.4,58.26 100,22 88.01,28.53 40.53,62.14" fill="#5F9BFF" opacity="0.22" />
                <polygon points="33.4,58.26 73,79.82 73,96.62 33.4,75.06" fill="url(#jonLeftG)" />
                <polygon points="33.4,75.06 73,96.62 73,109.82 33.4,88.26" fill="url(#jonBaseG)" />
                <line x1="33.4" y1="75.06" x2="73" y2="96.62" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="#D4D9E0" />
                <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                <polygon points="37.16,81.31 41.91,83.9 41.91,89.3 37.16,86.71" fill="#14161B" />
                <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="#D4D9E0" />
                <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                <polygon points="46.47,85.17 51.22,87.76 51.22,90.76 46.47,88.17" fill="#2458A6" />
                <polygon points="46.47,89.97 51.22,92.56 51.22,95.56 46.47,92.97" fill="#2458A6" />
                <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="#D4D9E0" />
                <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                <polygon points="55.18,89.92 59.93,92.51 59.93,95.51 55.18,92.92" fill="#15171C" />
                <polygon points="55.18,94.72 59.93,97.31 59.93,100.31 55.18,97.72" fill="#15171C" />
                <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                  <polyline points="33.4,58.26 100,22 139.6,43.56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                  <polyline points="33.4,58.26 73,79.82 139.6,43.56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                  <line x1="73" y1="79.82" x2="73" y2="109.82" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                  <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82 73,109.82 33.4,88.26" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                </g>
                <g transform="translate(80,35) rotate(14) scale(0.26,0.17) translate(-28,-34)">
                  <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.4" transform="translate(-1.5,4)" />
                  <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                </g>
                <text textAnchor="middle" transform="matrix(0.8838,0.4679,-0.8838,0.4679,84.5,55)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="6" fontWeight="700" letterSpacing="0.5" fill="#EAF2FF">SARAS</text>
              </svg>
              <svg role="presentation" aria-hidden="true" width="156" height="98" viewBox="0 1 200 120" style={{ display: v.drillTHR, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <polygon points="74.9,42 77.3,43.4 77.3,41.8 74.9,40.4" fill="#08090a" />
                <polygon points="79.7,42 77.3,43.4 77.3,41.8 79.7,40.4" fill="#060607" />
                <polygon points="77.3,39 79.7,40.4 77.3,41.8 74.9,40.4" fill="#0d0e10" />
                <polygon points="151.1,86 153.5,87.4 153.5,85.8 151.1,84.4" fill="#08090a" />
                <polygon points="155.9,86 153.5,87.4 153.5,85.8 155.9,84.4" fill="#060607" />
                <polygon points="153.5,83 155.9,84.4 153.5,85.8 151.1,84.4" fill="#0d0e10" />
                <polygon points="119.9,104 122.3,105.4 122.3,103.8 119.9,102.4" fill="#08090a" />
                <polygon points="124.8,104 122.3,105.4 122.3,103.8 124.8,102.4" fill="#060607" />
                <polygon points="122.3,101 124.8,102.4 122.3,103.8 119.9,102.4" fill="#0d0e10" />
                <polygon points="43.7,60 46.1,61.4 46.1,59.8 43.7,58.4" fill="#08090a" />
                <polygon points="48.6,60 46.1,61.4 46.1,59.8 48.6,58.4" fill="#060607" />
                <polygon points="46.1,57 48.6,58.4 46.1,59.8 43.7,58.4" fill="#0d0e10" />
                <polygon points="38.5,58.2 122.7,106.8 122.7,85.6 38.5,37" fill="#1b1d21" />
                <polygon points="161.5,84.4 122.7,106.8 122.7,85.6 161.5,63.2" fill="url(#tSide)" />
                <polygon points="77.3,14.6 161.5,63.2 122.7,85.6 38.5,37" fill="url(#tTop)" />
                <line x1="38.5" y1="37" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                <line x1="161.5" y1="63.2" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                <polygon points="77.3,18.6 154.6,63.2 122.7,81.6 45.4,37" fill="#24272c" />
                <line x1="45.4" y1="37" x2="122.7" y2="81.6" stroke="#3b4048" strokeWidth=".6" strokeLinecap="round" />
                <polygon points="53.1,36.6 70.4,46.6 68.3,47.8 51,37.8" fill="#76B900" />
                <polygon points="40.6,57 107.8,95.8 107.8,79.4 40.6,40.6" fill="url(#tFin)" />
                <line x1="41.3" y1="57" x2="41.3" y2="41.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="41.7" y1="57.3" x2="41.7" y2="41.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="42.7" y1="57.8" x2="42.7" y2="42.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="43.2" y1="58.1" x2="43.2" y2="43" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="44.2" y1="58.7" x2="44.2" y2="43.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="44.6" y1="58.9" x2="44.6" y2="44.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="45.6" y1="59.5" x2="45.6" y2="45" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="46.1" y1="59.8" x2="46.1" y2="45.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="47.1" y1="60.4" x2="47.1" y2="46.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="47.6" y1="60.6" x2="47.6" y2="46.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="48.6" y1="61.2" x2="48.6" y2="47.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="49" y1="61.5" x2="49" y2="47.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="50" y1="62" x2="50" y2="48.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="50.5" y1="62.3" x2="50.5" y2="48.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="51.5" y1="62.9" x2="51.5" y2="49.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="51.9" y1="63.1" x2="51.9" y2="49.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="52.9" y1="63.7" x2="52.9" y2="50.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="53.4" y1="64" x2="53.4" y2="50.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="54.4" y1="64.6" x2="54.4" y2="51" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="54.8" y1="64.8" x2="54.8" y2="51.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="55.8" y1="65.4" x2="55.8" y2="51.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="56.3" y1="65.7" x2="56.3" y2="52.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="57.3" y1="66.2" x2="57.3" y2="52.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="57.7" y1="66.5" x2="57.7" y2="52.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="58.7" y1="67.1" x2="58.7" y2="53.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="59.2" y1="67.3" x2="59.2" y2="53.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="60.2" y1="67.9" x2="60.2" y2="54.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="60.6" y1="68.2" x2="60.6" y2="54.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="61.7" y1="68.8" x2="61.7" y2="54.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="62.1" y1="69" x2="62.1" y2="55.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="63.1" y1="69.6" x2="63.1" y2="55.6" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="63.6" y1="69.9" x2="63.6" y2="55.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="64.6" y1="70.4" x2="64.6" y2="56.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="65" y1="70.7" x2="65" y2="56.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="66" y1="71.3" x2="66" y2="57" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="66.5" y1="71.5" x2="66.5" y2="57.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="67.5" y1="72.1" x2="67.5" y2="57.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="67.9" y1="72.4" x2="67.9" y2="57.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="68.9" y1="73" x2="68.9" y2="58.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="69.4" y1="73.2" x2="69.4" y2="58.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="70.4" y1="73.8" x2="70.4" y2="59.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="70.8" y1="74.1" x2="70.8" y2="59.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="71.8" y1="74.6" x2="71.8" y2="59.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="72.3" y1="74.9" x2="72.3" y2="60.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="73.3" y1="75.5" x2="73.3" y2="60.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="73.7" y1="75.7" x2="73.7" y2="61" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="74.7" y1="76.3" x2="74.7" y2="61.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="75.2" y1="76.6" x2="75.2" y2="61.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="76.2" y1="77.2" x2="76.2" y2="62.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="76.7" y1="77.4" x2="76.7" y2="62.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="77.7" y1="78" x2="77.7" y2="63.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="78.1" y1="78.3" x2="78.1" y2="63.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="79.1" y1="78.8" x2="79.1" y2="64.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="79.6" y1="79.1" x2="79.6" y2="64.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="80.6" y1="79.7" x2="80.6" y2="65.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="81" y1="79.9" x2="81" y2="65.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="82" y1="80.5" x2="82" y2="66.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="82.5" y1="80.8" x2="82.5" y2="66.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="83.5" y1="81.4" x2="83.5" y2="67.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="83.9" y1="81.6" x2="83.9" y2="67.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="84.9" y1="82.2" x2="84.9" y2="68.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="85.4" y1="82.5" x2="85.4" y2="68.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="86.4" y1="83" x2="86.4" y2="69.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="86.8" y1="83.3" x2="86.8" y2="69.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="87.8" y1="83.9" x2="87.8" y2="70" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="88.3" y1="84.1" x2="88.3" y2="70.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="89.3" y1="84.7" x2="89.3" y2="71" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="89.7" y1="85" x2="89.7" y2="71.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="90.8" y1="85.6" x2="90.8" y2="71.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="91.2" y1="85.8" x2="91.2" y2="72.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="92.2" y1="86.4" x2="92.2" y2="72.8" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="92.7" y1="86.7" x2="92.7" y2="73.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="93.7" y1="87.2" x2="93.7" y2="73.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="94.1" y1="87.5" x2="94.1" y2="74" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="95.1" y1="88.1" x2="95.1" y2="74.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="95.6" y1="88.3" x2="95.6" y2="74.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="96.6" y1="88.9" x2="96.6" y2="75.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="97" y1="89.2" x2="97" y2="75.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="98" y1="89.8" x2="98" y2="76" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="98.5" y1="90" x2="98.5" y2="76.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="99.5" y1="90.6" x2="99.5" y2="76.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="99.9" y1="90.9" x2="99.9" y2="77" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="100.9" y1="91.4" x2="100.9" y2="77.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="101.4" y1="91.7" x2="101.4" y2="77.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="102.4" y1="92.3" x2="102.4" y2="77.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="102.8" y1="92.5" x2="102.8" y2="78.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="103.8" y1="93.1" x2="103.8" y2="78.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="104.3" y1="93.4" x2="104.3" y2="78.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="105.3" y1="94" x2="105.3" y2="79" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="105.8" y1="94.2" x2="105.8" y2="79.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <line x1="106.8" y1="94.8" x2="106.8" y2="79.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="107.2" y1="95.1" x2="107.2" y2="79.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                <polygon points="111.1,87.5 112.9,88.6 112.9,86.5 111.1,85.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                <polygon points="114.5,89.5 116.3,90.6 116.3,88.5 114.5,87.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                <polygon points="118,91.5 119.8,92.6 119.8,90.5 118,89.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                <polygon points="111.6,92.4 113,93.2 113,92.2 111.6,91.4" fill="#34D058" />
                <polygon points="114.7,94.2 116.1,95 116.1,94 114.7,93.2" fill="#F59E0B" />
                <polygon points="158.7,74 153.9,76.8 153.9,74.4 158.7,71.6" fill="#B9C0C8" />
                <polygon points="158.3,72.9 154.3,75.2 154.3,74.8 158.3,72.4" fill="#2B5DA8" />
                <polygon points="158.7,77.6 153.9,80.4 153.9,78 158.7,75.2" fill="#B9C0C8" />
                <polygon points="158.3,76.5 154.3,78.8 154.3,78.4 158.3,76" fill="#2B5DA8" />
                <polygon points="152.5,81.2 146.9,84.4 146.9,78.8 152.5,75.6" fill="#A7AEB6" />
                <polygon points="152.1,78.4 147.4,81.1 147.4,80 152.1,77.2" fill="#15171a" />
                <polygon points="145.6,82.4 140.4,85.4 140.4,83 145.6,80" fill="#0a0b0c" />
                <polygon points="145.6,85.6 141,88.2 141,85.8 145.6,83.2" fill="#0a0b0c" />
                <polygon points="139,85.4 135.9,87.2 135.9,85.6 139,83.8" fill="#B9C0C8" />
                <polygon points="139,88.2 135.9,90 135.9,88.4 139,86.6" fill="#B9C0C8" />
                <polygon points="134.5,92.4 126.2,97.2 126.2,90.4 134.5,85.6" fill="#C9CED4" />
                <polygon points="134.1,88.9 126.6,93.2 126.6,91.9 134.1,87.5" fill="#2a2d32" />
                <polygon points="130.3,86.4 128.2,87.6 128.2,86.4 130.3,85.2" fill="#0a0b0c" />
              </svg>
              <svg role="presentation" aria-hidden="true" width="156" height="98" viewBox="0 6 200 120" style={{ display: v.drillDGX, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <ellipse cx="100" cy="113" rx="73" ry="10" fill="#8A8F96" opacity="0.3" />
                <polygon points="100,9.8 165,47.3 100,84.8 35.1,47.3" fill="url(#sTop)" />
                <polygon points="35.1,47.3 100,84.8 100,110 35.1,72.5" fill="url(#sSide)" />
                <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoam)" />
                <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoamShade)" />
                <g>
                  <rect x="45" y="73.5" width="17" height="8" rx="2.5" fill="#F3F1EB" />
                  <circle cx="49.5" cy="77.5" r="2" fill="#76B900" />
                  <circle cx="49.3" cy="77.3" r="0.8" fill="#E2F2C6" />
                </g>
                <polygon points="165,47.3 100,84.8 100,110 165,72.5" fill="url(#sFront)" />
                <g transform="matrix(64.9,-37.5,64.9,37.5,35.1,47.3)">
                  <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" fill="url(#dgxBlue)" />
                  <g clipPath="url(#dgxClip2)">
                    <ellipse cx="0.35" cy="0.12" rx="0.32" ry="0.09" fill="#FFFFFF" opacity="0.07" />
                    <rect x="0.11" y="0.1" width="0.075" height="0.075" rx="0.014" fill="#F5901E" />
                    <path d="M0.125,0.118 L0.17,0.118 L0.147,0.137 L0.17,0.137 L0.122,0.162 L0.142,0.137 L0.117,0.137 Z" fill="#FFFFFF" />
                    <rect x="0.205" y="0.112" width="0.28" height="0.026" rx="0.013" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.205" y="0.148" width="0.1" height="0.018" rx="0.009" fill="#CFE0F5" opacity="0.75" />
                    <rect x="0.58" y="0.1" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                    <rect x="0.66" y="0.104" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.66" y="0.132" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                    <rect x="0.58" y="0.19" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                    <rect x="0.66" y="0.194" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.66" y="0.222" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                    <rect x="0.58" y="0.28" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                    <rect x="0.66" y="0.284" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.66" y="0.312" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                    <rect x="0.58" y="0.37" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                    <rect x="0.66" y="0.374" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.66" y="0.402" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                    <rect x="0.58" y="0.46" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                    <rect x="0.66" y="0.464" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                    <rect x="0.66" y="0.492" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                    <rect x="0.11" y="0.55" width="0.14" height="0.14" rx="0.02" fill="none" stroke="#FFFFFF" strokeWidth="0.012" />
                    <line x1="0.18" y1="0.555" x2="0.18" y2="0.685" stroke="#FFFFFF" strokeWidth="0.01" />
                    <path d="M0.125,0.59 Q0.18,0.565 0.235,0.59" fill="none" stroke="#CFE0F5" strokeWidth="0.008" />
                    <path d="M0.275,0.465 L0.2926,0.5024 L0.33,0.52 L0.2926,0.5376 L0.275,0.575 L0.2574,0.5376 L0.22,0.52 L0.2574,0.5024 Z" fill="#F5901E" />
                    <path d="M0.325,0.568 L0.3352,0.5898 L0.357,0.6 L0.3352,0.6102 L0.325,0.632 L0.3148,0.6102 L0.293,0.6 L0.3148,0.5898 Z" fill="#F5901E" />
                    <image href="/assets/saras-schoolai-panel.png" x="0.3" y="0.5" width="0.54" height="0.24" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
                    <rect x="0.11" y="0.76" width="0.78" height="0.022" rx="0.011" fill="#BFD3EE" opacity="0.8" />
                    <path d="M0.05,0.82 C0.25,0.78 0.45,0.86 0.6,0.81 C0.75,0.77 0.85,0.83 0.95,0.8 L0.95,0.95 L0.05,0.95 Z" fill="#4A97E5" />
                    <path d="M0.05,0.86 C0.25,0.82 0.45,0.9 0.6,0.85 C0.75,0.81 0.85,0.87 0.95,0.84 L0.95,0.95 L0.05,0.95 Z" fill="#EE8020" />
                    <path d="M0.05,0.895 C0.27,0.86 0.47,0.93 0.62,0.89 C0.77,0.855 0.85,0.91 0.95,0.89 L0.95,0.95 L0.05,0.95 Z" fill="#F3F5F8" />
                  </g>
                </g>
                <line x1="100" y1="9.8" x2="165" y2="47.3" stroke="#F3ECDD" strokeWidth="0.7" strokeLinecap="round" />
                <line x1="100" y1="9.8" x2="35.1" y2="47.3" stroke="#F7F0E2" strokeWidth="0.7" strokeLinecap="round" />
                <line x1="165" y1="47.3" x2="100" y2="84.8" stroke="#E7DCCB" strokeWidth="0.6" strokeLinecap="round" />
                <line x1="100" y1="84.8" x2="100" y2="110" stroke="#8E8075" strokeWidth="0.5" />
              </svg>
            </span>
            <span aria-hidden="true" style={{ display: v.drillAllDisplay, position: "absolute", inset: "0", alignItems: "center", justifyContent: "center", color: "#0070E0" }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" />
              </svg>
            </span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0", flex: "1" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#0070E0" }}>Device-level overview</span>
            <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-.02em", lineHeight: "1.1" }}>{v.drillTitle}</h2>
            <span style={{ fontSize: "13px", color: "#5A6675" }}>{v.drillBlurb} · live performance across {v.drillSub}</span>
          </div>
        </div>
        <div className="drill-grid" style={{ position: "relative", zIndex: "2", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(188px,1fr))", gap: "12px", margin: "0 7px 7px", padding: "14px", borderRadius: "20px", background: "#FBFCFE", border: "1px solid #E7ECF3", boxShadow: "inset 0 1px 0 rgba(255,255,255,.9)" }}>
          {(v.drillStats ?? []).map((st, $index) => (
            <React.Fragment key={$index}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "12px", padding: "16px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #E7ECF3", boxShadow: "0 1px 2px rgba(16,42,84,.05),0 10px 20px -16px rgba(16,42,84,.3)", overflow: "hidden", minHeight: "150px" }}>
                <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", fontWeight: "500", letterSpacing: ".01em", color: "#5A6675" }}>
                  <span aria-hidden="true" style={{ width: "28px", height: "28px", borderRadius: "9px", background: `color-mix(in srgb,${st?.fg} 12%,#FFFFFF)`, color: st?.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0", boxShadow: `inset 0 0 0 1px color-mix(in srgb,${st?.fg} 22%,transparent)` }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={st?.icon} />
                    </svg>
                  </span>{st?.label}
                </span>
                <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "7px", minWidth: "0" }}>
                    <span style={{ fontSize: "30px", fontWeight: "700", lineHeight: "1", letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", color: "#1A1E26" }}>{st?.value}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "999px", background: "#F2F5F9", border: "1px solid #E7ECF3", fontSize: "12px", fontWeight: "500", color: "#44505F", whiteSpace: "nowrap" }}>
                      <span aria-hidden="true" style={{ width: "6px", height: "6px", flexShrink: "0", borderRadius: "50%", background: st?.fg }} />{st?.sub}
                    </span>
                  </span>
                  <span aria-hidden="true" style={{ display: st?.vizRightDisplay, flexShrink: "0" }}>{st?.vizR}</span>
                </span>
                <span aria-hidden="true" style={{ position: "relative", display: st?.vizBottomDisplay, marginTop: "auto" }}>{st?.vizB}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
      <div className="drill-view" style={{ display: v.devWrapDisplay, flexWrap: "wrap", gap: "20px", alignItems: "flex-start", animationDelay: ".12s" }}>
        <section aria-labelledby="dev-h" style={{ flex: "999 1 640px", minWidth: "0", background: "#FFFFFF", border: "1px solid #E4E9F0", borderRadius: "14px", boxShadow: "0 4px 16px -8px rgba(16,42,84,.12)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "18px 20px 14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <h2 id="dev-h" style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>Devices</h2>
              <span style={{ fontSize: "12.5px", color: "#5A6675" }}>Registered edge devices and their latest reading</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <Sx as="button" hover={{ borderColor: "#0070E0", background: "#F6F8FB" }} onClick={v.exportDevicesCSV} title="Export the current device list as Excel" aria-label="Export device list as Excel" style={{ display: "flex", alignItems: "center", gap: "6px", height: "38px", padding: "0 13px", border: "1px solid #D5DBE4", borderRadius: "10px", background: "#FFFFFF", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                </svg>
                <span>Export Excel</span>
              </Sx>
              <Sx as="button" hover={{ borderColor: "#0070E0", background: "#F6F8FB" }} onClick={v.printReport} title="Print or save as PDF" aria-label="Print or save as PDF" style={{ display: "flex", alignItems: "center", gap: "6px", height: "38px", padding: "0 13px", border: "1px solid #D5DBE4", borderRadius: "10px", background: "#FFFFFF", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
                </svg>
                <span>Print</span>
              </Sx>
              <div role="tablist" aria-label="Device view" style={{ position: "relative", display: "flex", width: "200px", flexShrink: "0", padding: "3px", borderRadius: "10px", background: "#F5F7FA", boxShadow: "inset 0 0 0 1px #E4E9F0" }}>
                <span aria-hidden="true" style={{ position: "absolute", top: "3px", bottom: "3px", left: "3px", width: "calc(50% - 3px)", borderRadius: "8px", background: "#FFFFFF", boxShadow: "0 1px 4px rgba(16,42,84,.14)", transform: v.pillX, transition: "transform .2s cubic-bezier(.22,1,.36,1)" }} />
                {(v.views ?? []).map((v, $index) => (
                  <React.Fragment key={$index}>
                    <Sx as="button" hover={{ color: "#1A1E26" }} role="tab" aria-selected={v?.sel} tabIndex={v?.tab} onClick={v?.pick} onKeyDown={v?.key} style={{ position: "relative", flex: "1", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "38px", border: "0", background: "transparent", color: v?.fg, fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={v?.icon} />
                      </svg>
                      <span>{v?.label}</span>
                    </Sx>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <Sx as="button" hover={{ borderColor: "#0070E0", background: "#F6F8FB" }} onClick={v.toggleFilters} aria-expanded={v.filtersExpanded} aria-controls="dev-filter-panel" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", height: "44px", padding: "0 14px", borderRadius: "10px", border: "1px solid #E1E6EF", background: "#FBFCFD", color: "#1A1E26", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <span aria-hidden="true" style={{ display: "flex", color: "#0070E0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16l-6 8v6l-4 2v-8z" />
                </svg>
              </span>
              <span>Search & filters</span>
              <span style={{ display: v.filterCountDisplay, alignItems: "center", justifyContent: "center", minWidth: "20px", height: "20px", padding: "0 6px", borderRadius: "999px", background: "#EEF2F7", color: "#005BB8", fontSize: "12px", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>{v.filterCount}</span>
              <span aria-hidden="true" style={{ flex: "1" }} />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: v.filtersChev, transition: "transform .2s cubic-bezier(.22,1,.36,1)", flexShrink: "0" }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Sx>
            <div id="dev-filter-panel" style={{ display: v.filtersPanelDisplay, flexWrap: "wrap", alignItems: "flex-end", gap: "12px", marginTop: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "2 1 220px", minWidth: "180px" }}>
                <label htmlFor="dev-search" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" }}>Search</label>
                <div style={{ position: "relative" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                    <path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3" />
                  </svg>
                  <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="dev-search" type="search" aria-label="Search devices by ID, serial or customer" placeholder="Search ID, serial or customer" value={v.q} onChange={v.onSearch} style={{ width: "100%", height: "44px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF" }} />
                </div>
              </div>
              {(v.filters ?? []).map((flt, $index) => (
                <React.Fragment key={$index}>
                  <div data-dd={flt?.key} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px", minWidth: "140px" }}>
                    <span id={flt?.labelId} style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" }}>{flt?.label}</span>
                    <Sx as="button" hover={{ borderColor: "#0070E0" }} data-trigger={flt?.key} onClick={flt?.toggle} aria-haspopup="listbox" aria-expanded={flt?.expanded} aria-labelledby={flt?.ariaIds} style={{ height: "44px", width: "100%", minWidth: "0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "0 10px 0 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: flt?.border, background: flt?.bg, color: flt?.fg, fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                      <span id={flt?.valueId} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: "0" }}>{flt?.display}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: flt?.chev, transition: "transform .2s cubic-bezier(.22,1,.36,1)", flexShrink: "0" }}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Sx>
                    <div role="listbox" aria-labelledby={flt?.labelId} style={{ display: flt?.menuDisplay, position: "absolute", top: "calc(100% + 6px)", left: "0", zIndex: "40", minWidth: "100%", width: "max-content", maxWidth: "300px", background: "#FFFFFF", border: "1px solid #E1E6EF", borderRadius: "12px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.25)", padding: "6px", flexDirection: "column", gap: "2px", animation: "popIn .14s cubic-bezier(.22,1,.36,1)" }}>
                      {(flt?.options ?? []).map((o, $index) => (
                        <React.Fragment key={$index}>
                          <Sx as="button" hover={{ background: "#EEF2F7" }} role="option" aria-selected={o?.sel} onClick={o?.pick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "10px 11px", border: "0", borderRadius: "8px", background: o?.bg, color: o?.fg, fontSize: "14px", fontWeight: o?.weight, cursor: "pointer", textAlign: "left", whiteSpace: "nowrap" }}>
                            <span>{o?.label}</span>
                            {(o?.selected) ? (
                              <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              </>
                            ) : null}
                          </Sx>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px", minWidth: "180px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" }}>Last seen</span>{v.devDateRange}
              </div>
            </div>
          </div>
          {(v.hasChips) ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "0 20px 14px" }}>
                {(v.chips ?? []).map((c, $index) => (
                  <React.Fragment key={$index}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", height: "32px", padding: "0 4px 0 12px", borderRadius: "999px", background: "#EEF2F7", color: "#005BB8", fontSize: "13px", fontWeight: "500" }}>
                      <span>{c?.text}</span>
                      <Sx as="button" hover={{ background: "#DCE6F2" }} onClick={c?.remove} aria-label={c?.aria} style={{ width: "24px", height: "24px", border: "0", borderRadius: "50%", background: "transparent", color: "#005BB8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </Sx>
                    </span>
                  </React.Fragment>
                ))}
                {(v.multiChips) ? (
                  <>
                    <button onClick={v.clearAll} style={{ height: "32px", padding: "0 10px", border: "0", background: "transparent", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}>Clear all</button>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          <div style={{ overflowX: "auto", borderTop: "1px solid #E4E9F0" }}>
            <table aria-labelledby="dev-h" style={{ display: v.tableDisplay, width: "100%", borderCollapse: "collapse", minWidth: "1180px" }}>
              <thead>
                <tr style={{ background: "#F6F8FB" }}>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Device</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Product</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Customer</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Status · Health</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Resources</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>App version</th>
                  <th scope="col" style={{ textAlign: "left", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>Last synced</th>
                  <th scope="col" style={{ textAlign: "right", padding: "11px 16px", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>
                    <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(v.rows ?? []).map((r, $index) => (
                  <React.Fragment key={$index}>
                    <Sx as="tr" hover={{ background: "#F6F8FB" }} style={{ borderTop: "1px solid #E4E9F0", verticalAlign: "middle" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ width: "72px", height: "48px", flexShrink: "0", borderRadius: "10px", border: "1px solid #E4E9F0", background: "radial-gradient(120% 95% at 50% 15%,#FFFFFF 0%,#F2F5F9 62%,#E4EAF2 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <svg role="img" aria-label={r?.illoAlt} width="60" height="36" viewBox="0 0 200 120" style={{ display: r?.dJON }}>
                              <ellipse cx="102" cy="112" rx="80" ry="15" fill="url(#jonShadowG)" />
                              <path d="M100,97 Q100,92 104.42,89.66 L163.58,58.34 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 100,113 Z" fill="url(#jonRightG)" />
                              <path d="M113.6,103.4 Q113.6,100.4 116.25,99 L153.11,79.48 Q155.76,78.08 155.76,81.08 L155.76,82.88 Q155.76,85.88 153.11,87.28 L116.25,106.8 Q113.6,108.2 113.6,105.2 Z" fill="url(#jonGrilleG)" />
                              <path d="M113.6,100.4 L155.76,78.08" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.6" />
                              <g fill="#16181D">
                                <circle cx="117" cy="100.16" r="0.9" />
                                <circle cx="120.94" cy="98.07" r="0.9" />
                                <circle cx="124.89" cy="95.98" r="0.9" />
                                <circle cx="128.83" cy="93.9" r="0.9" />
                                <circle cx="132.78" cy="91.81" r="0.9" />
                                <circle cx="136.72" cy="89.72" r="0.9" />
                                <circle cx="140.66" cy="87.63" r="0.9" />
                                <circle cx="144.61" cy="85.54" r="0.9" />
                                <circle cx="148.55" cy="83.46" r="0.9" />
                                <circle cx="152.5" cy="81.37" r="0.9" />
                                <circle cx="118.97" cy="100.68" r="0.9" />
                                <circle cx="122.92" cy="98.59" r="0.9" />
                                <circle cx="126.86" cy="96.5" r="0.9" />
                                <circle cx="130.8" cy="94.41" r="0.9" />
                                <circle cx="134.75" cy="92.32" r="0.9" />
                                <circle cx="138.69" cy="90.24" r="0.9" />
                                <circle cx="142.64" cy="88.15" r="0.9" />
                                <circle cx="146.58" cy="86.06" r="0.9" />
                                <circle cx="150.52" cy="83.97" r="0.9" />
                                <circle cx="117" cy="103.28" r="0.9" />
                                <circle cx="120.94" cy="101.19" r="0.9" />
                                <circle cx="124.89" cy="99.1" r="0.9" />
                                <circle cx="128.83" cy="97.02" r="0.9" />
                                <circle cx="132.78" cy="94.93" r="0.9" />
                                <circle cx="136.72" cy="92.84" r="0.9" />
                                <circle cx="140.66" cy="90.75" r="0.9" />
                                <circle cx="144.61" cy="88.66" r="0.9" />
                                <circle cx="148.55" cy="86.58" r="0.9" />
                                <circle cx="152.5" cy="84.49" r="0.9" />
                                <circle cx="118.97" cy="103.8" r="0.9" />
                                <circle cx="122.92" cy="101.71" r="0.9" />
                                <circle cx="126.86" cy="99.62" r="0.9" />
                                <circle cx="130.8" cy="97.53" r="0.9" />
                                <circle cx="134.75" cy="95.44" r="0.9" />
                                <circle cx="138.69" cy="93.36" r="0.9" />
                                <circle cx="142.64" cy="91.27" r="0.9" />
                                <circle cx="146.58" cy="89.18" r="0.9" />
                                <circle cx="150.52" cy="87.09" r="0.9" />
                              </g>
                              <g fontFamily="system-ui,-apple-system,sans-serif" fill="#D4E4FB" textAnchor="middle">
                                <text transform="matrix(0.8838,-0.4679,0,1,134,77.9)" fontSize="4.4" fontWeight="600" letterSpacing="0.6">PROCTORING</text>
                                <text transform="matrix(0.8838,-0.4679,0,1,134,82.58)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Anywhere · Anytime</text>
                                <text transform="matrix(0.8838,-0.4679,0,1,134,86.48)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Instantly</text>
                              </g>
                              <path d="M36.42,58.34 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 163.58,58.34 L104.42,89.66 Q100,92 95.58,89.66 Z" fill="url(#jonTopG)" />
                              <path d="M36,56 Q32,56 35.54,54.13 L96.46,21.87 Q100,20 100,24 L100,30 Q100,34 96.3,35.51 L49.7,54.49 Q46,56 42,56 Z" fill="#5F9BFF" opacity="0.28" />
                              <path d="M32,61 Q32,56 36.42,58.34 L95.58,89.66 Q100,92 100,97 L100,98.44 Q100,103.44 95.58,101.1 L36.42,69.78 Q32,67.44 32,62.44 Z" fill="url(#jonLeftG)" />
                              <path d="M32,72.44 Q32,67.44 36.42,69.78 L95.58,101.1 Q100,103.44 100,108.44 L100,113 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" fill="url(#jonBaseG)" />
                              <line x1="32" y1="67.9" x2="100" y2="103.9" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                              <g fill="#111319">
                                <polygon points="37.78,75.05 45.26,79.01 45.26,83.43 37.78,79.47" />
                                <polygon points="49.34,81.17 59.54,86.57 59.54,90.99 49.34,85.59" />
                                <polygon points="62.26,88.01 72.46,93.41 72.46,97.83 62.26,92.43" />
                                <polygon points="75.52,94.64 87.76,101.12 87.76,106.32 75.52,99.84" />
                              </g>
                              <g stroke="#9FB0C4" strokeWidth="0.7" opacity="0.7" fill="none" strokeLinecap="round">
                                <line x1="37.78" y1="75.05" x2="45.26" y2="79.01" />
                                <line x1="49.34" y1="81.17" x2="59.54" y2="86.57" />
                                <line x1="62.26" y1="88.01" x2="72.46" y2="93.41" />
                                <line x1="75.52" y1="94.64" x2="87.76" y2="101.12" />
                              </g>
                              <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                                <polyline points="32,56 100,20 168,56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                                <polyline points="32,56 100,92 168,56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                                <line x1="100" y1="92" x2="100" y2="118" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                                <line x1="32" y1="56" x2="32" y2="82" stroke="#6E97DC" strokeWidth="0.8" opacity="0.6" />
                                <path d="M32,61 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                              </g>
                              <g transform="rotate(26,92,34)">
                                <path transform="translate(80.95,23.46) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.5" />
                                <path transform="translate(79.55,22.06) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                              </g>
                              <text transform="matrix(0.8838,0.4679,-0.8838,0.4679,101.5,58)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="1.1" fill="#EAF2FF">SARAS</text>
                            </svg>
                            <svg role="img" aria-label={r?.illoAlt} width="60" height="36" viewBox="0 0 200 120" style={{ display: r?.dRPI }}>
                              <ellipse cx="88" cy="114" rx="78" ry="13" fill="url(#jonShadowG)" />
                              <polygon points="73,79.82 139.6,43.56 139.6,73.56 73,109.82" fill="url(#jonRightG)" />
                              <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82" fill="url(#jonTopG)" />
                              <polygon points="33.4,58.26 100,22 88.01,28.53 40.53,62.14" fill="#5F9BFF" opacity="0.22" />
                              <polygon points="33.4,58.26 73,79.82 73,96.62 33.4,75.06" fill="url(#jonLeftG)" />
                              <polygon points="33.4,75.06 73,96.62 73,109.82 33.4,88.26" fill="url(#jonBaseG)" />
                              <line x1="33.4" y1="75.06" x2="73" y2="96.62" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                              <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="#D4D9E0" />
                              <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                              <polygon points="37.16,81.31 41.91,83.9 41.91,89.3 37.16,86.71" fill="#14161B" />
                              <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="#D4D9E0" />
                              <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                              <polygon points="46.47,85.17 51.22,87.76 51.22,90.76 46.47,88.17" fill="#2458A6" />
                              <polygon points="46.47,89.97 51.22,92.56 51.22,95.56 46.47,92.97" fill="#2458A6" />
                              <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="#D4D9E0" />
                              <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                              <polygon points="55.18,89.92 59.93,92.51 59.93,95.51 55.18,92.92" fill="#15171C" />
                              <polygon points="55.18,94.72 59.93,97.31 59.93,100.31 55.18,97.72" fill="#15171C" />
                              <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                                <polyline points="33.4,58.26 100,22 139.6,43.56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                                <polyline points="33.4,58.26 73,79.82 139.6,43.56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                                <line x1="73" y1="79.82" x2="73" y2="109.82" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                                <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82 73,109.82 33.4,88.26" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                              </g>
                              <g transform="translate(80,35) rotate(14) scale(0.26,0.17) translate(-28,-34)">
                                <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.4" transform="translate(-1.5,4)" />
                                <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                              </g>
                              <text textAnchor="middle" transform="matrix(0.8838,0.4679,-0.8838,0.4679,84.5,55)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="6" fontWeight="700" letterSpacing="0.5" fill="#EAF2FF">SARAS</text>
                            </svg>
                            <svg role="img" aria-label={r?.illoAlt} width="60" height="36" viewBox="0 0 200 120" style={{ display: r?.dTHR }}>
                              <polygon points="74.9,42 77.3,43.4 77.3,41.8 74.9,40.4" fill="#08090a" />
                              <polygon points="79.7,42 77.3,43.4 77.3,41.8 79.7,40.4" fill="#060607" />
                              <polygon points="77.3,39 79.7,40.4 77.3,41.8 74.9,40.4" fill="#0d0e10" />
                              <polygon points="151.1,86 153.5,87.4 153.5,85.8 151.1,84.4" fill="#08090a" />
                              <polygon points="155.9,86 153.5,87.4 153.5,85.8 155.9,84.4" fill="#060607" />
                              <polygon points="153.5,83 155.9,84.4 153.5,85.8 151.1,84.4" fill="#0d0e10" />
                              <polygon points="119.9,104 122.3,105.4 122.3,103.8 119.9,102.4" fill="#08090a" />
                              <polygon points="124.8,104 122.3,105.4 122.3,103.8 124.8,102.4" fill="#060607" />
                              <polygon points="122.3,101 124.8,102.4 122.3,103.8 119.9,102.4" fill="#0d0e10" />
                              <polygon points="43.7,60 46.1,61.4 46.1,59.8 43.7,58.4" fill="#08090a" />
                              <polygon points="48.6,60 46.1,61.4 46.1,59.8 48.6,58.4" fill="#060607" />
                              <polygon points="46.1,57 48.6,58.4 46.1,59.8 43.7,58.4" fill="#0d0e10" />
                              <polygon points="38.5,58.2 122.7,106.8 122.7,85.6 38.5,37" fill="#1b1d21" />
                              <polygon points="161.5,84.4 122.7,106.8 122.7,85.6 161.5,63.2" fill="url(#tSide)" />
                              <polygon points="77.3,14.6 161.5,63.2 122.7,85.6 38.5,37" fill="url(#tTop)" />
                              <line x1="38.5" y1="37" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                              <line x1="161.5" y1="63.2" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                              <polygon points="77.3,18.6 154.6,63.2 122.7,81.6 45.4,37" fill="#24272c" />
                              <line x1="45.4" y1="37" x2="122.7" y2="81.6" stroke="#3b4048" strokeWidth=".6" strokeLinecap="round" />
                              <polygon points="53.1,36.6 70.4,46.6 68.3,47.8 51,37.8" fill="#76B900" />
                              <polygon points="40.6,57 107.8,95.8 107.8,79.4 40.6,40.6" fill="url(#tFin)" />
                              <line x1="41.3" y1="57" x2="41.3" y2="41.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="41.7" y1="57.3" x2="41.7" y2="41.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="42.7" y1="57.8" x2="42.7" y2="42.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="43.2" y1="58.1" x2="43.2" y2="43" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="44.2" y1="58.7" x2="44.2" y2="43.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="44.6" y1="58.9" x2="44.6" y2="44.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="45.6" y1="59.5" x2="45.6" y2="45" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="46.1" y1="59.8" x2="46.1" y2="45.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="47.1" y1="60.4" x2="47.1" y2="46.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="47.6" y1="60.6" x2="47.6" y2="46.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="48.6" y1="61.2" x2="48.6" y2="47.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="49" y1="61.5" x2="49" y2="47.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="50" y1="62" x2="50" y2="48.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="50.5" y1="62.3" x2="50.5" y2="48.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="51.5" y1="62.9" x2="51.5" y2="49.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="51.9" y1="63.1" x2="51.9" y2="49.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="52.9" y1="63.7" x2="52.9" y2="50.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="53.4" y1="64" x2="53.4" y2="50.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="54.4" y1="64.6" x2="54.4" y2="51" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="54.8" y1="64.8" x2="54.8" y2="51.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="55.8" y1="65.4" x2="55.8" y2="51.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="56.3" y1="65.7" x2="56.3" y2="52.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="57.3" y1="66.2" x2="57.3" y2="52.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="57.7" y1="66.5" x2="57.7" y2="52.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="58.7" y1="67.1" x2="58.7" y2="53.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="59.2" y1="67.3" x2="59.2" y2="53.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="60.2" y1="67.9" x2="60.2" y2="54.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="60.6" y1="68.2" x2="60.6" y2="54.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="61.7" y1="68.8" x2="61.7" y2="54.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="62.1" y1="69" x2="62.1" y2="55.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="63.1" y1="69.6" x2="63.1" y2="55.6" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="63.6" y1="69.9" x2="63.6" y2="55.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="64.6" y1="70.4" x2="64.6" y2="56.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="65" y1="70.7" x2="65" y2="56.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="66" y1="71.3" x2="66" y2="57" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="66.5" y1="71.5" x2="66.5" y2="57.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="67.5" y1="72.1" x2="67.5" y2="57.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="67.9" y1="72.4" x2="67.9" y2="57.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="68.9" y1="73" x2="68.9" y2="58.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="69.4" y1="73.2" x2="69.4" y2="58.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="70.4" y1="73.8" x2="70.4" y2="59.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="70.8" y1="74.1" x2="70.8" y2="59.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="71.8" y1="74.6" x2="71.8" y2="59.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="72.3" y1="74.9" x2="72.3" y2="60.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="73.3" y1="75.5" x2="73.3" y2="60.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="73.7" y1="75.7" x2="73.7" y2="61" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="74.7" y1="76.3" x2="74.7" y2="61.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="75.2" y1="76.6" x2="75.2" y2="61.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="76.2" y1="77.2" x2="76.2" y2="62.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="76.7" y1="77.4" x2="76.7" y2="62.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="77.7" y1="78" x2="77.7" y2="63.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="78.1" y1="78.3" x2="78.1" y2="63.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="79.1" y1="78.8" x2="79.1" y2="64.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="79.6" y1="79.1" x2="79.6" y2="64.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="80.6" y1="79.7" x2="80.6" y2="65.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="81" y1="79.9" x2="81" y2="65.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="82" y1="80.5" x2="82" y2="66.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="82.5" y1="80.8" x2="82.5" y2="66.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="83.5" y1="81.4" x2="83.5" y2="67.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="83.9" y1="81.6" x2="83.9" y2="67.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="84.9" y1="82.2" x2="84.9" y2="68.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="85.4" y1="82.5" x2="85.4" y2="68.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="86.4" y1="83" x2="86.4" y2="69.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="86.8" y1="83.3" x2="86.8" y2="69.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="87.8" y1="83.9" x2="87.8" y2="70" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="88.3" y1="84.1" x2="88.3" y2="70.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="89.3" y1="84.7" x2="89.3" y2="71" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="89.7" y1="85" x2="89.7" y2="71.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="90.8" y1="85.6" x2="90.8" y2="71.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="91.2" y1="85.8" x2="91.2" y2="72.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="92.2" y1="86.4" x2="92.2" y2="72.8" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="92.7" y1="86.7" x2="92.7" y2="73.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="93.7" y1="87.2" x2="93.7" y2="73.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="94.1" y1="87.5" x2="94.1" y2="74" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="95.1" y1="88.1" x2="95.1" y2="74.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="95.6" y1="88.3" x2="95.6" y2="74.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="96.6" y1="88.9" x2="96.6" y2="75.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="97" y1="89.2" x2="97" y2="75.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="98" y1="89.8" x2="98" y2="76" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="98.5" y1="90" x2="98.5" y2="76.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="99.5" y1="90.6" x2="99.5" y2="76.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="99.9" y1="90.9" x2="99.9" y2="77" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="100.9" y1="91.4" x2="100.9" y2="77.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="101.4" y1="91.7" x2="101.4" y2="77.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="102.4" y1="92.3" x2="102.4" y2="77.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="102.8" y1="92.5" x2="102.8" y2="78.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="103.8" y1="93.1" x2="103.8" y2="78.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="104.3" y1="93.4" x2="104.3" y2="78.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="105.3" y1="94" x2="105.3" y2="79" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="105.8" y1="94.2" x2="105.8" y2="79.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <line x1="106.8" y1="94.8" x2="106.8" y2="79.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                              <line x1="107.2" y1="95.1" x2="107.2" y2="79.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                              <polygon points="111.1,87.5 112.9,88.6 112.9,86.5 111.1,85.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                              <polygon points="114.5,89.5 116.3,90.6 116.3,88.5 114.5,87.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                              <polygon points="118,91.5 119.8,92.6 119.8,90.5 118,89.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                              <polygon points="111.6,92.4 113,93.2 113,92.2 111.6,91.4" fill="#34D058" />
                              <polygon points="114.7,94.2 116.1,95 116.1,94 114.7,93.2" fill="#F59E0B" />
                              <polygon points="158.7,74 153.9,76.8 153.9,74.4 158.7,71.6" fill="#B9C0C8" />
                              <polygon points="158.3,72.9 154.3,75.2 154.3,74.8 158.3,72.4" fill="#2B5DA8" />
                              <polygon points="158.7,77.6 153.9,80.4 153.9,78 158.7,75.2" fill="#B9C0C8" />
                              <polygon points="158.3,76.5 154.3,78.8 154.3,78.4 158.3,76" fill="#2B5DA8" />
                              <polygon points="152.5,81.2 146.9,84.4 146.9,78.8 152.5,75.6" fill="#A7AEB6" />
                              <polygon points="152.1,78.4 147.4,81.1 147.4,80 152.1,77.2" fill="#15171a" />
                              <polygon points="145.6,82.4 140.4,85.4 140.4,83 145.6,80" fill="#0a0b0c" />
                              <polygon points="145.6,85.6 141,88.2 141,85.8 145.6,83.2" fill="#0a0b0c" />
                              <polygon points="139,85.4 135.9,87.2 135.9,85.6 139,83.8" fill="#B9C0C8" />
                              <polygon points="139,88.2 135.9,90 135.9,88.4 139,86.6" fill="#B9C0C8" />
                              <polygon points="134.5,92.4 126.2,97.2 126.2,90.4 134.5,85.6" fill="#C9CED4" />
                              <polygon points="134.1,88.9 126.6,93.2 126.6,91.9 134.1,87.5" fill="#2a2d32" />
                              <polygon points="130.3,86.4 128.2,87.6 128.2,86.4 130.3,85.2" fill="#0a0b0c" />
                            </svg>
                            <svg role="img" aria-label={r?.illoAlt} width="60" height="36" viewBox="0 0 200 120" style={{ display: r?.dDGX }}>
                              <ellipse cx="100" cy="113" rx="73" ry="10" fill="#8A8F96" opacity="0.3" />
                              <polygon points="100,9.8 165,47.3 100,84.8 35.1,47.3" fill="url(#sTop)" />
                              <polygon points="35.1,47.3 100,84.8 100,110 35.1,72.5" fill="url(#sSide)" />
                              <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoam)" />
                              <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoamShade)" />
                              <g>
                                <rect x="45" y="73.5" width="17" height="8" rx="2.5" fill="#F3F1EB" />
                                <circle cx="49.5" cy="77.5" r="2" fill="#76B900" />
                                <circle cx="49.3" cy="77.3" r="0.8" fill="#E2F2C6" />
                              </g>
                              <polygon points="165,47.3 100,84.8 100,110 165,72.5" fill="url(#sFront)" />
                              <g transform="matrix(64.9,-37.5,64.9,37.5,35.1,47.3)">
                                <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" fill="url(#dgxBlue)" />
                                <g clipPath="url(#dgxClip2)">
                                  <ellipse cx="0.35" cy="0.12" rx="0.32" ry="0.09" fill="#FFFFFF" opacity="0.07" />
                                  <rect x="0.11" y="0.1" width="0.075" height="0.075" rx="0.014" fill="#F5901E" />
                                  <path d="M0.125,0.118 L0.17,0.118 L0.147,0.137 L0.17,0.137 L0.122,0.162 L0.142,0.137 L0.117,0.137 Z" fill="#FFFFFF" />
                                  <rect x="0.205" y="0.112" width="0.28" height="0.026" rx="0.013" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.205" y="0.148" width="0.1" height="0.018" rx="0.009" fill="#CFE0F5" opacity="0.75" />
                                  <rect x="0.58" y="0.1" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                                  <rect x="0.66" y="0.104" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.66" y="0.132" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                                  <rect x="0.58" y="0.19" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                                  <rect x="0.66" y="0.194" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.66" y="0.222" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                                  <rect x="0.58" y="0.28" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                                  <rect x="0.66" y="0.284" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.66" y="0.312" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                                  <rect x="0.58" y="0.37" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                                  <rect x="0.66" y="0.374" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.66" y="0.402" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                                  <rect x="0.58" y="0.46" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                                  <rect x="0.66" y="0.464" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                                  <rect x="0.66" y="0.492" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                                  <rect x="0.11" y="0.55" width="0.14" height="0.14" rx="0.02" fill="none" stroke="#FFFFFF" strokeWidth="0.012" />
                                  <line x1="0.18" y1="0.555" x2="0.18" y2="0.685" stroke="#FFFFFF" strokeWidth="0.01" />
                                  <path d="M0.125,0.59 Q0.18,0.565 0.235,0.59" fill="none" stroke="#CFE0F5" strokeWidth="0.008" />
                                  <path d="M0.275,0.465 L0.2926,0.5024 L0.33,0.52 L0.2926,0.5376 L0.275,0.575 L0.2574,0.5376 L0.22,0.52 L0.2574,0.5024 Z" fill="#F5901E" />
                                  <path d="M0.325,0.568 L0.3352,0.5898 L0.357,0.6 L0.3352,0.6102 L0.325,0.632 L0.3148,0.6102 L0.293,0.6 L0.3148,0.5898 Z" fill="#F5901E" />
                                  <image href="/assets/saras-schoolai-panel.png" x="0.3" y="0.5" width="0.54" height="0.24" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
                                  <rect x="0.11" y="0.76" width="0.78" height="0.022" rx="0.011" fill="#BFD3EE" opacity="0.8" />
                                  <path d="M0.05,0.82 C0.25,0.78 0.45,0.86 0.6,0.81 C0.75,0.77 0.85,0.83 0.95,0.8 L0.95,0.95 L0.05,0.95 Z" fill="#4A97E5" />
                                  <path d="M0.05,0.86 C0.25,0.82 0.45,0.9 0.6,0.85 C0.75,0.81 0.85,0.87 0.95,0.84 L0.95,0.95 L0.05,0.95 Z" fill="#EE8020" />
                                  <path d="M0.05,0.895 C0.27,0.86 0.47,0.93 0.62,0.89 C0.77,0.855 0.85,0.91 0.95,0.89 L0.95,0.95 L0.05,0.95 Z" fill="#F3F5F8" />
                                </g>
                              </g>
                              <line x1="100" y1="9.8" x2="165" y2="47.3" stroke="#F3ECDD" strokeWidth="0.7" strokeLinecap="round" />
                              <line x1="100" y1="9.8" x2="35.1" y2="47.3" stroke="#F7F0E2" strokeWidth="0.7" strokeLinecap="round" />
                              <line x1="165" y1="47.3" x2="100" y2="84.8" stroke="#E7DCCB" strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="100" y1="84.8" x2="100" y2="110" stroke="#8E8075" strokeWidth="0.5" />
                            </svg>
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px", whiteSpace: "nowrap" }}>
                            <Sx as="button" hover={{ textDecoration: "underline" }} data-dev={r?.id} onClick={r?.openDetail} aria-label={r?.detailAria} style={{ padding: "0", border: "0", background: "transparent", fontSize: "13.5px", fontWeight: "600", color: "#005BB8", cursor: "pointer", textAlign: "left" }}>{r?.title}</Sx>
                            <span style={{ fontSize: "12px", color: "#5A6675" }}>{r?.brand}{r?.type}</span>
                            {r?.idSub ? <span style={{ fontSize: "12px", color: "#5A6675", fontVariantNumeric: "tabular-nums" }}>{r?.idSub}</span> : null}
                            <span style={{ fontSize: "12px", color: "#5A6675", fontVariantNumeric: "tabular-nums" }}>SN {r?.serial}</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span title={r?.product} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "28px", padding: "0 10px 0 6px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #E1E6EF", color: "#005BB8", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                          <span aria-hidden="true" style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={r?.productIcon} />
                            </svg>
                          </span>
                          <span>{r?.productShort}</span>
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13.5px", maxWidth: "200px" }}>{r?.customer}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "26px", padding: "0 10px 0 8px", borderRadius: "999px", background: r?.sBg, color: r?.sFg, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d={r?.sIcon} />
                            </svg>
                            <span>{r?.status}</span>
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", color: r?.healthFg, whiteSpace: "nowrap" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d={r?.healthIcon} />
                            </svg>
                            <span>{r?.healthText}</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "62px 58px 64px", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>CPU</span>
                            <span title={r?.cpuTitle} style={{ fontSize: "13px", textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.cpuFg, fontWeight: "600" }}>{r?.cpu}</span>
                            <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                              <span style={{ display: "block", height: "100%", width: r?.cpuBar, borderRadius: "999px", background: r?.cpuBarC }} />
                            </span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "62px 58px 64px", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>GPU temp</span>
                            <span title={r?.gpuTitle} style={{ fontSize: "13px", textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.gpuFg, fontWeight: "600" }}>{r?.gpu}</span>
                            <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                              <span style={{ display: "block", height: "100%", width: r?.gpuBar, borderRadius: "999px", background: r?.gpuBarC }} />
                            </span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "62px 58px 64px", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>Storage</span>
                            <span title={r?.stTitle} style={{ fontSize: "13px", textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.stFg, fontWeight: "600" }}>{r?.st}</span>
                            <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                              <span style={{ display: "block", height: "100%", width: r?.stBar, borderRadius: "999px", background: r?.stBarC }} />
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13.5px", whiteSpace: "nowrap" }}>{r?.app}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12.5px", color: "#5A6675", whiteSpace: "nowrap" }} title={r?.seenAbs}>
                        <span aria-live="polite">{r?.hcNote}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
                          <Sx as="button" hover={{ background: "#EEF2F7", borderColor: "#C9D6E8" }} onClick={r?.hcRun} disabled={r?.hcDisabled} aria-label={r?.hcAria} style={{ marginLeft: "auto", height: "36px", display: r?.hcDisplay || "inline-flex", alignItems: "center", gap: "6px", padding: "0 12px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: r?.hcFg, fontSize: "13px", fontWeight: "600", cursor: r?.hcCursor, whiteSpace: "nowrap" }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: r?.hcAnim }}>
                              <path d={r?.hcIcon} />
                            </svg>
                            <span>{r?.hcLabel}</span>
                          </Sx>
                          <Sx as="button" hover={{ background: "#EEF2F7", borderColor: "#C9D6E8" }} onClick={r?.openDetail} aria-label={r?.detailAria} title="View details" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #E1E6EF", background: "#FFFFFF", color: "#005BB8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Sx>
                        </div>
                      </td>
                    </Sx>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div role="list" aria-label="Devices" style={{ display: v.cardsDisplay, gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px", padding: "18px 20px 20px", background: "#EEF2F7", borderTop: "1px solid #E4E9F0" }}>
              {(v.rows ?? []).map((r, $index) => (
                <React.Fragment key={$index}>
                  <Sx as="article" hover={{ boxShadow: "0 8px 24px -10px rgba(16,42,84,.18)", transform: "translateY(-1.5px)", borderColor: "#C9D6E8" }} role="listitem" aria-labelledby={r?.cardId} style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", borderWidth: "1px", borderStyle: "solid", borderColor: "#E4E9F0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 16px -8px rgba(16,42,84,.12)", transition: "box-shadow .16s,transform .16s,border-color .16s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", padding: "14px 16px 12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                        <h3 id={r?.cardId} title={r?.idSub ? r?.title + ' · ' + r?.idSub : r?.title} style={{ margin: "0", fontSize: "15px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          <Sx as="button" hover={{ color: "#005BB8", textDecoration: "underline" }} data-dev={r?.id} onClick={r?.openDetail} aria-label={r?.detailAria} style={{ padding: "0", border: "0", background: "transparent", font: "inherit", color: "#1A1E26", cursor: "pointer", borderRadius: "4px" }}>{r?.title}</Sx>
                        </h3>
                        <span style={{ fontSize: "12.5px", color: "#5A6675", whiteSpace: "nowrap" }}>{r?.brand}{r?.type}</span>
                        {r?.idSub ? <span style={{ fontSize: "12px", color: "#8591A1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontVariantNumeric: "tabular-nums" }}>{r?.idSub}</span> : null}
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "26px", padding: "0 10px 0 8px", borderRadius: "999px", background: r?.sBg, color: r?.sFg, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: "0" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={r?.sIcon} />
                        </svg>
                        <span>{r?.status}</span>
                      </span>
                    </div>
                    <Sx as="div" hover={{ borderColor: "#0070E0" }} onClick={r?.openDetail} title="View device details" style={{ position: "relative", margin: "0 12px", height: "150px", borderRadius: "12px", border: "1px solid #E4E9F0", background: "radial-gradient(120% 95% at 50% 15%,#FFFFFF 0%,#F2F5F9 62%,#E4EAF2 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", transition: "border-color .15s" }}>
                      <svg role="img" aria-label={r?.illoAlt} width="206" height="124" viewBox="0 0 200 120" style={{ display: r?.dJON }}>
                        <ellipse cx="102" cy="112" rx="80" ry="15" fill="url(#jonShadowG)" />
                        <path d="M100,97 Q100,92 104.42,89.66 L163.58,58.34 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 100,113 Z" fill="url(#jonRightG)" />
                        <path d="M113.6,103.4 Q113.6,100.4 116.25,99 L153.11,79.48 Q155.76,78.08 155.76,81.08 L155.76,82.88 Q155.76,85.88 153.11,87.28 L116.25,106.8 Q113.6,108.2 113.6,105.2 Z" fill="url(#jonGrilleG)" />
                        <path d="M113.6,100.4 L155.76,78.08" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.6" />
                        <g fill="#16181D">
                          <circle cx="117" cy="100.16" r="0.9" />
                          <circle cx="120.94" cy="98.07" r="0.9" />
                          <circle cx="124.89" cy="95.98" r="0.9" />
                          <circle cx="128.83" cy="93.9" r="0.9" />
                          <circle cx="132.78" cy="91.81" r="0.9" />
                          <circle cx="136.72" cy="89.72" r="0.9" />
                          <circle cx="140.66" cy="87.63" r="0.9" />
                          <circle cx="144.61" cy="85.54" r="0.9" />
                          <circle cx="148.55" cy="83.46" r="0.9" />
                          <circle cx="152.5" cy="81.37" r="0.9" />
                          <circle cx="118.97" cy="100.68" r="0.9" />
                          <circle cx="122.92" cy="98.59" r="0.9" />
                          <circle cx="126.86" cy="96.5" r="0.9" />
                          <circle cx="130.8" cy="94.41" r="0.9" />
                          <circle cx="134.75" cy="92.32" r="0.9" />
                          <circle cx="138.69" cy="90.24" r="0.9" />
                          <circle cx="142.64" cy="88.15" r="0.9" />
                          <circle cx="146.58" cy="86.06" r="0.9" />
                          <circle cx="150.52" cy="83.97" r="0.9" />
                          <circle cx="117" cy="103.28" r="0.9" />
                          <circle cx="120.94" cy="101.19" r="0.9" />
                          <circle cx="124.89" cy="99.1" r="0.9" />
                          <circle cx="128.83" cy="97.02" r="0.9" />
                          <circle cx="132.78" cy="94.93" r="0.9" />
                          <circle cx="136.72" cy="92.84" r="0.9" />
                          <circle cx="140.66" cy="90.75" r="0.9" />
                          <circle cx="144.61" cy="88.66" r="0.9" />
                          <circle cx="148.55" cy="86.58" r="0.9" />
                          <circle cx="152.5" cy="84.49" r="0.9" />
                          <circle cx="118.97" cy="103.8" r="0.9" />
                          <circle cx="122.92" cy="101.71" r="0.9" />
                          <circle cx="126.86" cy="99.62" r="0.9" />
                          <circle cx="130.8" cy="97.53" r="0.9" />
                          <circle cx="134.75" cy="95.44" r="0.9" />
                          <circle cx="138.69" cy="93.36" r="0.9" />
                          <circle cx="142.64" cy="91.27" r="0.9" />
                          <circle cx="146.58" cy="89.18" r="0.9" />
                          <circle cx="150.52" cy="87.09" r="0.9" />
                        </g>
                        <g fontFamily="system-ui,-apple-system,sans-serif" fill="#D4E4FB" textAnchor="middle">
                          <text transform="matrix(0.8838,-0.4679,0,1,134,77.9)" fontSize="4.4" fontWeight="600" letterSpacing="0.6">PROCTORING</text>
                          <text transform="matrix(0.8838,-0.4679,0,1,134,82.58)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Anywhere · Anytime</text>
                          <text transform="matrix(0.8838,-0.4679,0,1,134,86.48)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Instantly</text>
                        </g>
                        <path d="M36.42,58.34 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 163.58,58.34 L104.42,89.66 Q100,92 95.58,89.66 Z" fill="url(#jonTopG)" />
                        <path d="M36,56 Q32,56 35.54,54.13 L96.46,21.87 Q100,20 100,24 L100,30 Q100,34 96.3,35.51 L49.7,54.49 Q46,56 42,56 Z" fill="#5F9BFF" opacity="0.28" />
                        <path d="M32,61 Q32,56 36.42,58.34 L95.58,89.66 Q100,92 100,97 L100,98.44 Q100,103.44 95.58,101.1 L36.42,69.78 Q32,67.44 32,62.44 Z" fill="url(#jonLeftG)" />
                        <path d="M32,72.44 Q32,67.44 36.42,69.78 L95.58,101.1 Q100,103.44 100,108.44 L100,113 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" fill="url(#jonBaseG)" />
                        <line x1="32" y1="67.9" x2="100" y2="103.9" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                        <g fill="#111319">
                          <polygon points="37.78,75.05 45.26,79.01 45.26,83.43 37.78,79.47" />
                          <polygon points="49.34,81.17 59.54,86.57 59.54,90.99 49.34,85.59" />
                          <polygon points="62.26,88.01 72.46,93.41 72.46,97.83 62.26,92.43" />
                          <polygon points="75.52,94.64 87.76,101.12 87.76,106.32 75.52,99.84" />
                        </g>
                        <g stroke="#9FB0C4" strokeWidth="0.7" opacity="0.7" fill="none" strokeLinecap="round">
                          <line x1="37.78" y1="75.05" x2="45.26" y2="79.01" />
                          <line x1="49.34" y1="81.17" x2="59.54" y2="86.57" />
                          <line x1="62.26" y1="88.01" x2="72.46" y2="93.41" />
                          <line x1="75.52" y1="94.64" x2="87.76" y2="101.12" />
                        </g>
                        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                          <polyline points="32,56 100,20 168,56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                          <polyline points="32,56 100,92 168,56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                          <line x1="100" y1="92" x2="100" y2="118" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                          <line x1="32" y1="56" x2="32" y2="82" stroke="#6E97DC" strokeWidth="0.8" opacity="0.6" />
                          <path d="M32,61 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                        </g>
                        <g transform="rotate(26,92,34)">
                          <path transform="translate(80.95,23.46) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.5" />
                          <path transform="translate(79.55,22.06) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                        </g>
                        <text transform="matrix(0.8838,0.4679,-0.8838,0.4679,101.5,58)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="1.1" fill="#EAF2FF">SARAS</text>
                      </svg>
                      <svg role="img" aria-label={r?.illoAlt} width="206" height="124" viewBox="0 0 200 120" style={{ display: r?.dRPI }}>
                        <ellipse cx="88" cy="114" rx="78" ry="13" fill="url(#jonShadowG)" />
                        <polygon points="73,79.82 139.6,43.56 139.6,73.56 73,109.82" fill="url(#jonRightG)" />
                        <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82" fill="url(#jonTopG)" />
                        <polygon points="33.4,58.26 100,22 88.01,28.53 40.53,62.14" fill="#5F9BFF" opacity="0.22" />
                        <polygon points="33.4,58.26 73,79.82 73,96.62 33.4,75.06" fill="url(#jonLeftG)" />
                        <polygon points="33.4,75.06 73,96.62 73,109.82 33.4,88.26" fill="url(#jonBaseG)" />
                        <line x1="33.4" y1="75.06" x2="73" y2="96.62" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
                        <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="#D4D9E0" />
                        <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                        <polygon points="37.16,81.31 41.91,83.9 41.91,89.3 37.16,86.71" fill="#14161B" />
                        <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="#D4D9E0" />
                        <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                        <polygon points="46.47,85.17 51.22,87.76 51.22,90.76 46.47,88.17" fill="#2458A6" />
                        <polygon points="46.47,89.97 51.22,92.56 51.22,95.56 46.47,92.97" fill="#2458A6" />
                        <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="#D4D9E0" />
                        <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
                        <polygon points="55.18,89.92 59.93,92.51 59.93,95.51 55.18,92.92" fill="#15171C" />
                        <polygon points="55.18,94.72 59.93,97.31 59.93,100.31 55.18,97.72" fill="#15171C" />
                        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                          <polyline points="33.4,58.26 100,22 139.6,43.56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                          <polyline points="33.4,58.26 73,79.82 139.6,43.56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                          <line x1="73" y1="79.82" x2="73" y2="109.82" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                          <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82 73,109.82 33.4,88.26" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
                        </g>
                        <g transform="translate(80,35) rotate(14) scale(0.26,0.17) translate(-28,-34)">
                          <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.4" transform="translate(-1.5,4)" />
                          <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
                        </g>
                        <text textAnchor="middle" transform="matrix(0.8838,0.4679,-0.8838,0.4679,84.5,55)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="6" fontWeight="700" letterSpacing="0.5" fill="#EAF2FF">SARAS</text>
                      </svg>
                      <svg role="img" aria-label={r?.illoAlt} width="206" height="124" viewBox="0 0 200 120" style={{ display: r?.dTHR }}>
                        <polygon points="74.9,42 77.3,43.4 77.3,41.8 74.9,40.4" fill="#08090a" />
                        <polygon points="79.7,42 77.3,43.4 77.3,41.8 79.7,40.4" fill="#060607" />
                        <polygon points="77.3,39 79.7,40.4 77.3,41.8 74.9,40.4" fill="#0d0e10" />
                        <polygon points="151.1,86 153.5,87.4 153.5,85.8 151.1,84.4" fill="#08090a" />
                        <polygon points="155.9,86 153.5,87.4 153.5,85.8 155.9,84.4" fill="#060607" />
                        <polygon points="153.5,83 155.9,84.4 153.5,85.8 151.1,84.4" fill="#0d0e10" />
                        <polygon points="119.9,104 122.3,105.4 122.3,103.8 119.9,102.4" fill="#08090a" />
                        <polygon points="124.8,104 122.3,105.4 122.3,103.8 124.8,102.4" fill="#060607" />
                        <polygon points="122.3,101 124.8,102.4 122.3,103.8 119.9,102.4" fill="#0d0e10" />
                        <polygon points="43.7,60 46.1,61.4 46.1,59.8 43.7,58.4" fill="#08090a" />
                        <polygon points="48.6,60 46.1,61.4 46.1,59.8 48.6,58.4" fill="#060607" />
                        <polygon points="46.1,57 48.6,58.4 46.1,59.8 43.7,58.4" fill="#0d0e10" />
                        <polygon points="38.5,58.2 122.7,106.8 122.7,85.6 38.5,37" fill="#1b1d21" />
                        <polygon points="161.5,84.4 122.7,106.8 122.7,85.6 161.5,63.2" fill="url(#tSide)" />
                        <polygon points="77.3,14.6 161.5,63.2 122.7,85.6 38.5,37" fill="url(#tTop)" />
                        <line x1="38.5" y1="37" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                        <line x1="161.5" y1="63.2" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
                        <polygon points="77.3,18.6 154.6,63.2 122.7,81.6 45.4,37" fill="#24272c" />
                        <line x1="45.4" y1="37" x2="122.7" y2="81.6" stroke="#3b4048" strokeWidth=".6" strokeLinecap="round" />
                        <polygon points="53.1,36.6 70.4,46.6 68.3,47.8 51,37.8" fill="#76B900" />
                        <polygon points="40.6,57 107.8,95.8 107.8,79.4 40.6,40.6" fill="url(#tFin)" />
                        <line x1="41.3" y1="57" x2="41.3" y2="41.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="41.7" y1="57.3" x2="41.7" y2="41.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="42.7" y1="57.8" x2="42.7" y2="42.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="43.2" y1="58.1" x2="43.2" y2="43" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="44.2" y1="58.7" x2="44.2" y2="43.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="44.6" y1="58.9" x2="44.6" y2="44.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="45.6" y1="59.5" x2="45.6" y2="45" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="46.1" y1="59.8" x2="46.1" y2="45.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="47.1" y1="60.4" x2="47.1" y2="46.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="47.6" y1="60.6" x2="47.6" y2="46.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="48.6" y1="61.2" x2="48.6" y2="47.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="49" y1="61.5" x2="49" y2="47.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="50" y1="62" x2="50" y2="48.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="50.5" y1="62.3" x2="50.5" y2="48.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="51.5" y1="62.9" x2="51.5" y2="49.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="51.9" y1="63.1" x2="51.9" y2="49.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="52.9" y1="63.7" x2="52.9" y2="50.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="53.4" y1="64" x2="53.4" y2="50.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="54.4" y1="64.6" x2="54.4" y2="51" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="54.8" y1="64.8" x2="54.8" y2="51.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="55.8" y1="65.4" x2="55.8" y2="51.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="56.3" y1="65.7" x2="56.3" y2="52.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="57.3" y1="66.2" x2="57.3" y2="52.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="57.7" y1="66.5" x2="57.7" y2="52.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="58.7" y1="67.1" x2="58.7" y2="53.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="59.2" y1="67.3" x2="59.2" y2="53.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="60.2" y1="67.9" x2="60.2" y2="54.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="60.6" y1="68.2" x2="60.6" y2="54.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="61.7" y1="68.8" x2="61.7" y2="54.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="62.1" y1="69" x2="62.1" y2="55.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="63.1" y1="69.6" x2="63.1" y2="55.6" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="63.6" y1="69.9" x2="63.6" y2="55.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="64.6" y1="70.4" x2="64.6" y2="56.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="65" y1="70.7" x2="65" y2="56.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="66" y1="71.3" x2="66" y2="57" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="66.5" y1="71.5" x2="66.5" y2="57.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="67.5" y1="72.1" x2="67.5" y2="57.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="67.9" y1="72.4" x2="67.9" y2="57.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="68.9" y1="73" x2="68.9" y2="58.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="69.4" y1="73.2" x2="69.4" y2="58.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="70.4" y1="73.8" x2="70.4" y2="59.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="70.8" y1="74.1" x2="70.8" y2="59.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="71.8" y1="74.6" x2="71.8" y2="59.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="72.3" y1="74.9" x2="72.3" y2="60.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="73.3" y1="75.5" x2="73.3" y2="60.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="73.7" y1="75.7" x2="73.7" y2="61" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="74.7" y1="76.3" x2="74.7" y2="61.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="75.2" y1="76.6" x2="75.2" y2="61.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="76.2" y1="77.2" x2="76.2" y2="62.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="76.7" y1="77.4" x2="76.7" y2="62.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="77.7" y1="78" x2="77.7" y2="63.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="78.1" y1="78.3" x2="78.1" y2="63.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="79.1" y1="78.8" x2="79.1" y2="64.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="79.6" y1="79.1" x2="79.6" y2="64.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="80.6" y1="79.7" x2="80.6" y2="65.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="81" y1="79.9" x2="81" y2="65.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="82" y1="80.5" x2="82" y2="66.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="82.5" y1="80.8" x2="82.5" y2="66.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="83.5" y1="81.4" x2="83.5" y2="67.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="83.9" y1="81.6" x2="83.9" y2="67.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="84.9" y1="82.2" x2="84.9" y2="68.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="85.4" y1="82.5" x2="85.4" y2="68.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="86.4" y1="83" x2="86.4" y2="69.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="86.8" y1="83.3" x2="86.8" y2="69.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="87.8" y1="83.9" x2="87.8" y2="70" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="88.3" y1="84.1" x2="88.3" y2="70.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="89.3" y1="84.7" x2="89.3" y2="71" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="89.7" y1="85" x2="89.7" y2="71.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="90.8" y1="85.6" x2="90.8" y2="71.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="91.2" y1="85.8" x2="91.2" y2="72.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="92.2" y1="86.4" x2="92.2" y2="72.8" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="92.7" y1="86.7" x2="92.7" y2="73.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="93.7" y1="87.2" x2="93.7" y2="73.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="94.1" y1="87.5" x2="94.1" y2="74" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="95.1" y1="88.1" x2="95.1" y2="74.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="95.6" y1="88.3" x2="95.6" y2="74.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="96.6" y1="88.9" x2="96.6" y2="75.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="97" y1="89.2" x2="97" y2="75.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="98" y1="89.8" x2="98" y2="76" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="98.5" y1="90" x2="98.5" y2="76.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="99.5" y1="90.6" x2="99.5" y2="76.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="99.9" y1="90.9" x2="99.9" y2="77" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="100.9" y1="91.4" x2="100.9" y2="77.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="101.4" y1="91.7" x2="101.4" y2="77.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="102.4" y1="92.3" x2="102.4" y2="77.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="102.8" y1="92.5" x2="102.8" y2="78.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="103.8" y1="93.1" x2="103.8" y2="78.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="104.3" y1="93.4" x2="104.3" y2="78.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="105.3" y1="94" x2="105.3" y2="79" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="105.8" y1="94.2" x2="105.8" y2="79.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <line x1="106.8" y1="94.8" x2="106.8" y2="79.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
                        <line x1="107.2" y1="95.1" x2="107.2" y2="79.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
                        <polygon points="111.1,87.5 112.9,88.6 112.9,86.5 111.1,85.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                        <polygon points="114.5,89.5 116.3,90.6 116.3,88.5 114.5,87.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                        <polygon points="118,91.5 119.8,92.6 119.8,90.5 118,89.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
                        <polygon points="111.6,92.4 113,93.2 113,92.2 111.6,91.4" fill="#34D058" />
                        <polygon points="114.7,94.2 116.1,95 116.1,94 114.7,93.2" fill="#F59E0B" />
                        <polygon points="158.7,74 153.9,76.8 153.9,74.4 158.7,71.6" fill="#B9C0C8" />
                        <polygon points="158.3,72.9 154.3,75.2 154.3,74.8 158.3,72.4" fill="#2B5DA8" />
                        <polygon points="158.7,77.6 153.9,80.4 153.9,78 158.7,75.2" fill="#B9C0C8" />
                        <polygon points="158.3,76.5 154.3,78.8 154.3,78.4 158.3,76" fill="#2B5DA8" />
                        <polygon points="152.5,81.2 146.9,84.4 146.9,78.8 152.5,75.6" fill="#A7AEB6" />
                        <polygon points="152.1,78.4 147.4,81.1 147.4,80 152.1,77.2" fill="#15171a" />
                        <polygon points="145.6,82.4 140.4,85.4 140.4,83 145.6,80" fill="#0a0b0c" />
                        <polygon points="145.6,85.6 141,88.2 141,85.8 145.6,83.2" fill="#0a0b0c" />
                        <polygon points="139,85.4 135.9,87.2 135.9,85.6 139,83.8" fill="#B9C0C8" />
                        <polygon points="139,88.2 135.9,90 135.9,88.4 139,86.6" fill="#B9C0C8" />
                        <polygon points="134.5,92.4 126.2,97.2 126.2,90.4 134.5,85.6" fill="#C9CED4" />
                        <polygon points="134.1,88.9 126.6,93.2 126.6,91.9 134.1,87.5" fill="#2a2d32" />
                        <polygon points="130.3,86.4 128.2,87.6 128.2,86.4 130.3,85.2" fill="#0a0b0c" />
                      </svg>
                      <svg role="img" aria-label={r?.illoAlt} width="206" height="124" viewBox="0 0 200 120" style={{ display: r?.dDGX }}>
                        <ellipse cx="100" cy="113" rx="73" ry="10" fill="#8A8F96" opacity="0.3" />
                        <polygon points="100,9.8 165,47.3 100,84.8 35.1,47.3" fill="url(#sTop)" />
                        <polygon points="35.1,47.3 100,84.8 100,110 35.1,72.5" fill="url(#sSide)" />
                        <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoam)" />
                        <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoamShade)" />
                        <g>
                          <rect x="45" y="73.5" width="17" height="8" rx="2.5" fill="#F3F1EB" />
                          <circle cx="49.5" cy="77.5" r="2" fill="#76B900" />
                          <circle cx="49.3" cy="77.3" r="0.8" fill="#E2F2C6" />
                        </g>
                        <polygon points="165,47.3 100,84.8 100,110 165,72.5" fill="url(#sFront)" />
                        <g transform="matrix(64.9,-37.5,64.9,37.5,35.1,47.3)">
                          <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" fill="url(#dgxBlue)" />
                          <g clipPath="url(#dgxClip2)">
                            <ellipse cx="0.35" cy="0.12" rx="0.32" ry="0.09" fill="#FFFFFF" opacity="0.07" />
                            <rect x="0.11" y="0.1" width="0.075" height="0.075" rx="0.014" fill="#F5901E" />
                            <path d="M0.125,0.118 L0.17,0.118 L0.147,0.137 L0.17,0.137 L0.122,0.162 L0.142,0.137 L0.117,0.137 Z" fill="#FFFFFF" />
                            <rect x="0.205" y="0.112" width="0.28" height="0.026" rx="0.013" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.205" y="0.148" width="0.1" height="0.018" rx="0.009" fill="#CFE0F5" opacity="0.75" />
                            <rect x="0.58" y="0.1" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                            <rect x="0.66" y="0.104" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.66" y="0.132" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                            <rect x="0.58" y="0.19" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                            <rect x="0.66" y="0.194" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.66" y="0.222" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                            <rect x="0.58" y="0.28" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                            <rect x="0.66" y="0.284" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.66" y="0.312" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                            <rect x="0.58" y="0.37" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                            <rect x="0.66" y="0.374" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.66" y="0.402" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                            <rect x="0.58" y="0.46" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                            <rect x="0.66" y="0.464" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                            <rect x="0.66" y="0.492" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                            <rect x="0.11" y="0.55" width="0.14" height="0.14" rx="0.02" fill="none" stroke="#FFFFFF" strokeWidth="0.012" />
                            <line x1="0.18" y1="0.555" x2="0.18" y2="0.685" stroke="#FFFFFF" strokeWidth="0.01" />
                            <path d="M0.125,0.59 Q0.18,0.565 0.235,0.59" fill="none" stroke="#CFE0F5" strokeWidth="0.008" />
                            <path d="M0.275,0.465 L0.2926,0.5024 L0.33,0.52 L0.2926,0.5376 L0.275,0.575 L0.2574,0.5376 L0.22,0.52 L0.2574,0.5024 Z" fill="#F5901E" />
                            <path d="M0.325,0.568 L0.3352,0.5898 L0.357,0.6 L0.3352,0.6102 L0.325,0.632 L0.3148,0.6102 L0.293,0.6 L0.3148,0.5898 Z" fill="#F5901E" />
                            <image href="/assets/saras-schoolai-panel.png" x="0.3" y="0.5" width="0.54" height="0.24" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
                            <rect x="0.11" y="0.76" width="0.78" height="0.022" rx="0.011" fill="#BFD3EE" opacity="0.8" />
                            <path d="M0.05,0.82 C0.25,0.78 0.45,0.86 0.6,0.81 C0.75,0.77 0.85,0.83 0.95,0.8 L0.95,0.95 L0.05,0.95 Z" fill="#4A97E5" />
                            <path d="M0.05,0.86 C0.25,0.82 0.45,0.9 0.6,0.85 C0.75,0.81 0.85,0.87 0.95,0.84 L0.95,0.95 L0.05,0.95 Z" fill="#EE8020" />
                            <path d="M0.05,0.895 C0.27,0.86 0.47,0.93 0.62,0.89 C0.77,0.855 0.85,0.91 0.95,0.89 L0.95,0.95 L0.05,0.95 Z" fill="#F3F5F8" />
                          </g>
                        </g>
                        <line x1="100" y1="9.8" x2="165" y2="47.3" stroke="#F3ECDD" strokeWidth="0.7" strokeLinecap="round" />
                        <line x1="100" y1="9.8" x2="35.1" y2="47.3" stroke="#F7F0E2" strokeWidth="0.7" strokeLinecap="round" />
                        <line x1="165" y1="47.3" x2="100" y2="84.8" stroke="#E7DCCB" strokeWidth="0.6" strokeLinecap="round" />
                        <line x1="100" y1="84.8" x2="100" y2="110" stroke="#8E8075" strokeWidth="0.5" />
                      </svg>
                      <span title={r?.product} style={{ position: "absolute", left: "8px", bottom: "8px", display: "flex", alignItems: "center", gap: "6px", height: "28px", padding: "0 10px 0 6px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #E1E6EF", color: "#005BB8", fontSize: "12px", fontWeight: "600", boxShadow: "0 2px 6px -3px rgba(16,42,84,.2)" }}>
                        <span aria-hidden="true" style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={r?.productIcon} />
                          </svg>
                        </span>
                        <span>{r?.productShort}</span>
                      </span>
                    </Sx>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" }}>Health</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", color: r?.healthFg }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={r?.healthIcon} />
                          </svg>
                          <span>{r?.healthText}</span>
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "8px", padding: "8px", borderRadius: "12px", background: "#F6F8FB" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "9px 10px", borderRadius: "10px", border: "1px solid #E4E9F0", background: "#FFFFFF", minWidth: "0" }}>
                          <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>CPU</span>
                          <span title={r?.cpuTitle} style={{ fontSize: "15px", lineHeight: "1.1", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.cpuFg, fontWeight: "600" }}>{r?.cpu}</span>
                          <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                            <span style={{ display: "block", height: "100%", width: r?.cpuBar, borderRadius: "999px", background: r?.cpuBarC }} />
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "9px 10px", borderRadius: "10px", border: "1px solid #E4E9F0", background: "#FFFFFF", minWidth: "0" }}>
                          <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>GPU temp</span>
                          <span title={r?.gpuTitle} style={{ fontSize: "15px", lineHeight: "1.1", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.gpuFg, fontWeight: "600" }}>{r?.gpu}</span>
                          <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                            <span style={{ display: "block", height: "100%", width: r?.gpuBar, borderRadius: "999px", background: r?.gpuBarC }} />
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "9px 10px", borderRadius: "10px", border: "1px solid #E4E9F0", background: "#FFFFFF", minWidth: "0" }}>
                          <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap" }}>Storage</span>
                          <span title={r?.stTitle} style={{ fontSize: "15px", lineHeight: "1.1", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: r?.stFg, fontWeight: "600" }}>{r?.st}</span>
                          <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                            <span style={{ display: "block", height: "100%", width: r?.stBar, borderRadius: "999px", background: r?.stBarC }} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <dl style={{ margin: "0", padding: "2px 16px 14px", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "7px 12px", fontSize: "12.5px" }}>
                      <dt style={{ color: "#5A6675" }}>Customer</dt>
                      <dd title={r?.customer} style={{ margin: "0", textAlign: "right", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r?.customer}</dd>
                      <dt style={{ color: "#5A6675" }}>Serial</dt>
                      <dd style={{ margin: "0", textAlign: "right", fontWeight: "500", fontVariantNumeric: "tabular-nums" }}>{r?.serial}</dd>
                      <dt style={{ color: "#5A6675" }}>App version</dt>
                      <dd style={{ margin: "0", textAlign: "right", fontWeight: "500" }}>{r?.app}</dd>
                    </dl>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "8px 8px 8px 16px", borderTop: "1px solid #E4E9F0", background: "#FBFCFD" }}>
                      <span aria-live="polite" title={r?.seenAbs} style={{ fontSize: "12px", color: "#5A6675" }}>{r?.hcNote}</span>
                      <Sx as="button" hover={{ background: "#EEF2F7", borderColor: "#C9D6E8" }} onClick={r?.hcRun} disabled={r?.hcDisabled} aria-label={r?.hcAria} style={{ height: "36px", display: r?.hcDisplay || "flex", alignItems: "center", gap: "6px", padding: "0 12px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: r?.hcFg, fontSize: "13px", fontWeight: "600", cursor: r?.hcCursor, whiteSpace: "nowrap" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: r?.hcAnim }}>
                          <path d={r?.hcIcon} />
                        </svg>
                        <span>{r?.hcLabel}</span>
                      </Sx>
                    </div>
                  </Sx>
                </React.Fragment>
              ))}
            </div>
            {(v.isEmpty) ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textAlign: "center" }}>{v.gridEmpty}
                  <button onClick={v.clearAll} style={{ margin: "0 0 20px", height: "40px", padding: "0 16px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#1A1E26", fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flex: "0 0 auto" }}>Clear filters</button>
                </div>
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 20px", borderTop: "1px solid #E4E9F0" }}>
            <span aria-live="polite" style={{ fontSize: "12.5px", color: "#5A6675", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v.rangeLabel}</span>
            <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sx as="button" hover={{ borderColor: "#BCD8FB" }} onClick={v.prev} disabled={v.prevDisabled} aria-label="Previous" style={{ width: "32px", height: "32px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: v.prevCursor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Sx>
              {(v.pages ?? []).map((p, $index) => (
                <React.Fragment key={$index}>
                  <Sx as="button" hover={{ borderColor: "#BCD8FB" }} onClick={p?.go} aria-label={p?.aria} aria-current={p?.current} style={{ minWidth: "32px", height: "32px", padding: "0 8px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: p?.border, background: p?.bg, color: p?.fg, fontSize: "13px", fontWeight: "600", fontVariantNumeric: "tabular-nums", cursor: "pointer" }}>{p?.n}</Sx>
                </React.Fragment>
              ))}
              <Sx as="button" hover={{ borderColor: "#BCD8FB" }} onClick={v.next} disabled={v.nextDisabled} aria-label="Next" style={{ width: "32px", height: "32px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: v.nextCursor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Sx>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
