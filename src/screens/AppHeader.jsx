import React from 'react';
import Sx from '../components/Sx.jsx';

export default function AppHeader(v) {
  return (
    <header style={{ position: "fixed", top: "0", left: "0", right: "0", height: "64px", zIndex: "60", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "0 20px 0 16px", background: "linear-gradient(180deg,#1877D6,#0F66C4)", boxShadow: "0 4px 14px -6px rgba(10,40,90,.45)", color: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "0" }}>
        <span style={{ display: "flex" }}>
          <a href="#" onClick={v.goHome} aria-label="Excelsoft, go to Dashboard" style={{ display: "flex", alignItems: "center", background: "#FFFFFF", borderRadius: "10px", padding: "8px 14px" }}>
            <img src="/assets/excelsoft-logo.png" alt="" style={{ height: "28px", width: "auto", display: "block" }} />
          </a>
        </span>
        <span aria-hidden="true" style={{ width: "1px", height: "26px", background: "rgba(255,255,255,.4)", display: v.productDisplay }} />
        <span style={{ fontSize: "15px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: v.productDisplay }}>SARAS Device Management</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div data-dd="gsearch" style={{ position: "relative", flex: "0 1 300px", width: "300px", maxWidth: "min(340px,32vw)", minWidth: "170px", display: v.gSearchDisplay }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "15px", top: "50%", marginTop: "-9px", pointerEvents: "none", zIndex: "1" }}>
            <path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3" />
          </svg>
          <Sx as="input" focus={{ borderColor: "#0070E0", background: "#FFFFFF", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="global-search" type="search" role="combobox" aria-expanded={v.gExpanded} aria-controls="gsearch-results" aria-label="Search all devices by ID, serial, customer or type" placeholder={v.gPlaceholder} value={v.gq} onChange={v.onGSearch} onFocus={v.gFocus} onKeyDown={v.gKeyDown} style={{ width: "100%", height: "42px", borderRadius: "999px", border: "1.5px solid rgba(255,255,255,.55)", padding: "0 16px 0 40px", fontSize: "13.5px", color: "#1A1E26", background: "#FBFCFD", transition: "border-color .16s,box-shadow .16s,background .16s" }} />
          {(v.gResultsOpen) ? (
            <>
              <div id="gsearch-results" role="listbox" aria-label="Device search results" style={{ position: "absolute", top: "calc(100% + 8px)", left: "0", right: "0", zIndex: "70", background: "#FFFFFF", color: "#1A1E26", border: "1px solid #E1E6EF", borderRadius: "14px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.25)", padding: "6px", display: "flex", flexDirection: "column", gap: "2px", maxHeight: "400px", overflow: "auto", animation: "popIn .14s cubic-bezier(.22,1,.36,1)" }}>
                <span style={{ display: v.gHintDisplay, padding: "7px 11px 4px", fontSize: "11px", fontWeight: "600", letterSpacing: ".04em", textTransform: "uppercase", color: "#8A93A2" }}>Devices · {v.gResultCount}</span>
                {(v.gResults ?? []).map((gr, $index) => (
                  <React.Fragment key={$index}>
                    <Sx as="button" hover={{ background: "#F6F8FB" }} role="option" onClick={gr?.pick} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "9px 11px", border: "0", borderRadius: "10px", background: "transparent", color: "#1A1E26", fontSize: "13.5px", cursor: "pointer", textAlign: "left", width: "100%" }}>
                      <span aria-hidden="true" style={{ width: "30px", height: "30px", flexShrink: "0", borderRadius: "8px", background: "#EEF2F7", color: "#005BB8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16v12H4zM8 20h8M12 16v4" />
                        </svg>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: "0", flex: "1" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <span aria-hidden="true" style={{ width: "7px", height: "7px", flexShrink: "0", borderRadius: "50%", background: gr?.dot }} />
                          <span style={{ fontWeight: "600", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gr?.id}</span>
                        </span>
                        <span style={{ fontSize: "12px", color: "#5A6675", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gr?.meta}</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4BDC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0" }}>
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Sx>
                  </React.Fragment>
                ))}
                <div style={{ display: v.gEmptyDisplay, flexDirection: "column", alignItems: "center", gap: "4px", padding: "18px 12px", color: "#5A6675", textAlign: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B4BDC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3" />
                  </svg>
                  <span style={{ fontSize: "13px" }}>No devices match “{v.gQueryEcho}”</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <span aria-hidden="true" style={{ width: "1px", height: "26px", background: "rgba(255,255,255,.4)", flexShrink: "0", display: v.gSearchDisplay }} />
        <div data-dd="notif" style={{ position: "relative" }}>
          <Sx as="button" hover={{ background: "rgba(255,255,255,.18)" }} data-trigger="notif" onClick={v.toggleNotif} aria-haspopup="true" aria-expanded={v.notifExpanded} aria-label={v.notifLabel} style={{ position: "relative", width: "44px", height: "44px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.28)", background: v.notifBg, boxShadow: v.notifRing, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background .15s,box-shadow .15s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {(v.hasUnread) ? (
              <>
                <span aria-hidden="true" style={{ position: "absolute", top: "-3px", right: "-3px", minWidth: "17px", height: "17px", padding: "0 4px", borderRadius: "999px", background: "#DC2626", color: "#FFFFFF", fontSize: "10px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px #1877D6" }}>{v.unreadBadge}</span>
              </>
            ) : null}
          </Sx>
          {(v.notifOpen) ? (
            <>
              <div role="dialog" aria-label="Notifications" style={{ position: "absolute", top: "calc(100% + 8px)", right: "0", width: "min(340px,calc(100vw - 32px))", background: "#FFFFFF", color: "#1A1E26", border: "1px solid #E1E6EF", borderRadius: "12px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.25)", padding: "6px", animation: "popIn .14s cubic-bezier(.22,1,.36,1)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px 10px" }}>
                  <h2 style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>Notifications</h2>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#005BB8", background: "#EEF2F7", borderRadius: "999px", padding: "2px 10px" }}>{v.unreadText}</span>
                </div>
                <ul role="list" style={{ listStyle: "none", margin: "0", padding: "0", maxHeight: "340px", overflow: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(v.notifs ?? []).map((n, $index) => (
                    <React.Fragment key={$index}>
                      <li>
                        <Sx as="button" hover={{ background: "#F6F8FB" }} onClick={n?.open} title={n?.abs} style={{ width: "100%", display: "flex", gap: "10px", alignItems: "flex-start", textAlign: "left", padding: "10px", border: "0", borderRadius: "8px", background: "transparent", cursor: "pointer", color: "#1A1E26" }}>
                          <span aria-hidden="true" style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: n?.tileBg, color: n?.tileFg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={n?.icon} />
                            </svg>
                          </span>
                          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontSize: "13.5px", fontWeight: n?.weight }}>{n?.title}</span>
                            <span style={{ fontSize: "12.5px", color: "#5A6675", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n?.body}</span>
                            <span style={{ fontSize: "12px", color: "#5A6675" }}>{n?.rel}</span>
                          </span>
                          {(n?.unread) ? (
                            <>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0070E0", marginTop: "6px", flexShrink: "0" }} />
                              <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Unread</span>
                            </>
                          ) : null}
                        </Sx>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
                <div style={{ borderTop: "1px solid #E4E9F0", marginTop: "4px", padding: "6px 4px 0" }}>
                  <Sx as="button" hover={{ background: "#F6F8FB" }} onClick={v.markAll} disabled={v.noUnread} style={{ width: "100%", height: "40px", border: "0", borderRadius: "8px", background: "transparent", color: v.markAllColor, fontSize: "13px", fontWeight: "600", cursor: v.markAllCursor }}>Mark all as read</Sx>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div data-dd="profile" style={{ position: "relative" }}>
          <Sx as="button" hover={{ background: "rgba(255,255,255,.18)" }} data-trigger="profile" onClick={v.toggleProfile} aria-haspopup="menu" aria-expanded={v.profileExpanded} aria-label={`${v.userName}, ${v.userRole}`} style={{ height: "44px", display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 5px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.28)", background: v.profileBg, boxShadow: v.profileRing, color: "#FFFFFF", cursor: "pointer", transition: "background .15s,box-shadow .15s" }}>
            <span aria-hidden="true" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#FFFFFF", color: "#005BB8", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>{v.userInitials}</span>
            <span style={{ display: v.namesDisplay, flexDirection: "column", alignItems: "flex-start", lineHeight: "1.25", maxWidth: "180px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{v.userName}</span>
              <span style={{ fontSize: "12px", fontWeight: "400", whiteSpace: "nowrap" }}>{v.userRole}</span>
            </span>
            <span aria-hidden="true" style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: v.profileChevron, transition: "transform .2s cubic-bezier(.22,1,.36,1)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </Sx>
          {(v.profileOpen) ? (
            <>
              <div role="menu" aria-label="Account" style={{ position: "absolute", top: "calc(100% + 8px)", right: "0", width: "264px", background: "#FFFFFF", color: "#1A1E26", border: "1px solid #E1E6EF", borderRadius: "12px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.25)", padding: "6px", animation: "popIn .14s cubic-bezier(.22,1,.36,1)" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 10px 12px", borderBottom: "1px solid #E4E9F0", marginBottom: "4px" }}>
                  <span aria-hidden="true" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(145deg,#1877D6,#0F66C4)", color: "#FFFFFF", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>{v.userInitials}</span>
                  <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>{v.userName}</span>
                    <span style={{ fontSize: "12px", color: "#5A6675" }}>{v.userRole}</span>
                    <span style={{ fontSize: "12px", color: "#5A6675", overflow: "hidden", textOverflow: "ellipsis" }}>{v.userEmail}</span>
                  </span>
                </div>
                {(v.profileItems ?? []).map((it, $index) => (
                  <React.Fragment key={$index}>
                    <Sx as="button" hover={{ background: "#F6F8FB" }} role="menuitem" onClick={it?.run} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "0", borderRadius: "8px", background: "transparent", color: "#1A1E26", fontSize: "14px", fontWeight: "500", cursor: "pointer", textAlign: "left" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={it?.icon} />
                      </svg>
                      <span>{it?.label}</span>
                    </Sx>
                  </React.Fragment>
                ))}
                <div role="separator" style={{ height: "1px", background: "#E4E9F0", margin: "4px 0" }} />
                <Sx as="button" hover={{ background: "#FEECEC" }} role="menuitem" onClick={v.signOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px", border: "0", borderRadius: "8px", background: "transparent", color: "#B21E1E", fontSize: "14px", fontWeight: "500", cursor: "pointer", textAlign: "left" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span>Sign out</span>
                </Sx>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
