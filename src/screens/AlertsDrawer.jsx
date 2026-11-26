import React from 'react';
import Sx from '../components/Sx.jsx';

export default function AlertsDrawer(v) {
  return (
    <div style={{ display: v.alertsDisplay, position: "fixed", inset: "0", zIndex: "1200" }}>
      <div onClick={v.closeAlerts} aria-hidden="true" style={{ position: "absolute", inset: "0", background: "rgba(20,30,50,.42)", backdropFilter: "blur(2px)" }} />
      <div role="dialog" data-trap="alerts" aria-modal="true" aria-labelledby="ap-h" aria-describedby="ap-d" style={{ position: "absolute", top: "0", bottom: "0", insetInlineEnd: "0", width: "clamp(560px,56%,820px)", maxWidth: "100%", background: "#FFFFFF", boxShadow: "0 12px 32px -12px rgba(16,42,84,.35)", display: "flex", flexDirection: "column", animation: v.panelAnim }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", padding: "20px 20px 14px", borderBottom: "1px solid #E4E9F0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h3 id="ap-h" style={{ margin: "0", fontSize: "19px", fontWeight: "600" }}>Alerts</h3>
            <p id="ap-d" style={{ margin: "0", fontSize: "13px", color: "#5A6675" }}>{v.panelSub}</p>
          </div>
          <Sx as="button" hover={{ transform: "rotate(90deg)" }} ref={v.closeRef} onClick={v.closeAlerts} aria-label="Close" style={{ width: "36px", height: "36px", border: "0", borderRadius: "8px", background: "#EEF2F7", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Sx>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 20px", borderBottom: "1px solid #E4E9F0" }}>
          <div role="tablist" aria-label="Alert severity" style={{ position: "relative", display: "flex", width: "100%", padding: "4px", borderRadius: "12px", background: "#F5F7FA", boxShadow: "inset 0 0 0 1px #E4E9F0" }}>
            <span aria-hidden="true" style={{ position: "absolute", top: "4px", bottom: "4px", left: "4px", width: "calc((100% - 8px) / 4)", borderRadius: "9px", background: "#FFFFFF", boxShadow: "0 1px 4px rgba(16,42,84,.14),0 0 0 1px #E4E9F0", transform: v.tabPillX, transition: "transform .2s cubic-bezier(.22,1,.36,1)" }} />
            {(v.panelTabs ?? []).map((t, $index) => (
              <React.Fragment key={$index}>
                <Sx as="button" hover={{ color: "#1A1E26" }} role="tab" aria-selected={t?.sel} tabIndex={t?.tab} onClick={t?.pick} onKeyDown={t?.key} style={{ position: "relative", flex: "1", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0", borderRadius: "9px", background: "transparent", color: t?.fg, fontSize: "14px", fontWeight: t?.weight, cursor: "pointer", whiteSpace: "nowrap", transition: "color .2s" }}>
                  <span>{t?.label}</span>
                  <span style={{ minWidth: "24px", height: "22px", padding: "0 7px", borderRadius: "999px", background: t?.countBg, color: t?.countFg, fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>{t?.count}</span>
                </Sx>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", flex: "2 1 0", minWidth: "0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "12px", pointerEvents: "none" }}>
                <path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3" />
              </svg>
              <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} type="search" aria-label="Search alerts by device, customer or alert type" placeholder="Search device, customer or alert type" value={v.alertQ} onChange={v.onAlertQ} style={{ width: "100%", height: "40px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF" }} />
            </div>
            <div style={{ flex: "1 1 0", minWidth: "200px" }}>{v.dateRange}</div>
          </div>
        </div>
        <div style={{ flex: "1", overflow: "auto", padding: "0 16px", background: "#F5F7FA" }}>
          <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "6px 0 10px" }}>
            {(v.panelGroups ?? []).map((g, $index) => (
              <React.Fragment key={$index}>
                <section aria-label={g?.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ position: "sticky", top: "0", zIndex: "1", display: "flex", alignItems: "center", gap: "8px", padding: "8px 4px 6px", background: "#F5F7FA" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" }}>{g?.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#005BB8", background: "#E1E9F4", borderRadius: "999px", padding: "1px 8px", fontVariantNumeric: "tabular-nums" }}>{g?.count}</span>
                    <span aria-hidden="true" style={{ flex: "1", height: "1px", background: "#E1E6EF" }} />
                  </div>
                  <ul role="list" style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(g?.items ?? []).map((a, $index) => (
                      <React.Fragment key={$index}>
                        <Sx as="li" hover={{ borderColor: "#C9D6E8", boxShadow: "0 6px 16px -10px rgba(16,42,84,.25)" }} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px 14px", borderRadius: "12px", borderWidth: "1px", borderStyle: "solid", borderColor: a?.cardBorder, background: a?.cardBg, boxShadow: "0 2px 8px -6px rgba(16,42,84,.18)", transition: "border-color .15s,box-shadow .15s" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span aria-hidden="true" style={{ width: "36px", height: "36px", borderRadius: "10px", background: a?.bg, color: a?.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={a?.icon} />
                              </svg>
                            </span>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1E26" }}>{a?.title}</span>
                                <span style={{ display: "inline-flex", alignItems: "center", height: "20px", padding: "0 8px", borderRadius: "999px", background: a?.bg, color: a?.fg, fontSize: "11.5px", fontWeight: "600" }}>{a?.sev}</span>
                                <span style={{ display: a?.ackDisplay, alignItems: "center", gap: "4px", height: "20px", padding: "0 8px", borderRadius: "999px", background: a?.badgeBg, color: a?.badgeFg, fontSize: "11.5px", fontWeight: "600" }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                  <span>{a?.badgeText}</span>
                                </span>
                              </div>
                              <span style={{ fontSize: "13px", color: "#5A6675", lineHeight: "1.45" }}>{a?.detail}</span>
                            </div>
                            <span title={a?.abs} style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", flexShrink: "0", paddingTop: "2px" }}>{a?.rel}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", paddingTop: "10px", borderTop: "1px dashed #E1E6EF" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "26px", padding: "0 9px 0 7px", borderRadius: "8px", background: "#F5F7FA", border: "1px solid #E4E9F0", fontSize: "12px", fontWeight: "500", color: "#1A1E26", whiteSpace: "nowrap" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 4h16v12H4zM8 20h8M12 16v4" />
                              </svg>
                              <span>{a?.device}</span>
                            </span>
                            <span title={a?.customer} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "26px", padding: "0 9px 0 7px", borderRadius: "8px", background: "#F5F7FA", border: "1px solid #E4E9F0", fontSize: "12px", color: "#1A1E26", minWidth: "0", maxWidth: "180px" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0" }}>
                                <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
                              </svg>
                              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a?.customer}</span>
                            </span>
                            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                              <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={a?.view} aria-label={a?.aria} style={{ height: "32px", display: "flex", alignItems: "center", gap: "4px", padding: "0 10px", border: "0", borderRadius: "8px", background: "transparent", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                                <span>View device</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </Sx>
                              <Sx as="button" hover={{ background: "#F6F8FB", borderColor: "#C9D6E8" }} onClick={a?.ack} aria-label={a?.ackAria} style={{ display: a?.ackBtnDisplay, height: "32px", alignItems: "center", gap: "6px", padding: "0 12px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#1A1E26", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                                <span>Acknowledge</span>
                              </Sx>
                            </span>
                          </div>
                        </Sx>
                      </React.Fragment>
                    ))}
                  </ul>
                </section>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: v.panelEmptyDisplay, padding: "12px 20px 20px", flexDirection: "column", alignItems: "center" }}>{v.panelEmpty}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", padding: "12px 20px", borderTop: "1px solid #E4E9F0", background: "#FBFCFD" }}>
          <span style={{ fontSize: "12.5px", color: "#5A6675", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v.panelRange}</span>
          <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={v.loadMore} disabled={v.noMore} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: v.loadMoreFg, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", cursor: v.loadMoreCursor }}>Load more</Sx>
        </div>
      </div>
    </div>
  );
}
