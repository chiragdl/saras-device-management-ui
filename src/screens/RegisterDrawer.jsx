import React from 'react';
import Sx from '../components/Sx.jsx';

export default function RegisterDrawer(v) {
  return (
    <div style={{ display: v.regDisplay, position: "fixed", inset: "0", zIndex: "1250" }}>
      <div onClick={v.closeRegister} aria-hidden="true" style={{ position: "absolute", inset: "0", background: "rgba(20,30,50,.42)", backdropFilter: "blur(2px)" }} />
      <form role="dialog" data-trap="register" aria-modal="true" aria-labelledby="rg-h" aria-describedby="rg-d" onSubmit={v.submitRegister} noValidate={true} style={{ position: "absolute", top: "0", bottom: "0", insetInlineEnd: "0", width: "clamp(420px,72%,1080px)", maxWidth: "100%", margin: "0", background: "#FFFFFF", boxShadow: "0 12px 32px -12px rgba(16,42,84,.35)", display: "flex", flexDirection: "column", animation: "slideIn .28s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "20px 22px 16px", background: "#FFFFFF", borderBottom: "1px solid #E4E9F0" }}>
          <span aria-hidden="true" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(160deg,#1a86f0,#0070E0)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0", boxShadow: "0 6px 14px -6px rgba(0,112,224,.6)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v12H4zM8 20h8M12 16v4M12 7v6M9 10h6" />
            </svg>
          </span>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
            <h3 id="rg-h" style={{ margin: "0", fontSize: "19px", fontWeight: "600" }}>Register a new device</h3>
            <p id="rg-d" style={{ margin: "0", fontSize: "13px", color: "#5A6675" }}>Add a box to the fleet with its device ID. You get a one-time key or code to install the monitoring agent on it.</p>
          </div>
          <Sx as="button" hover={{ transform: "rotate(90deg)" }} type="button" ref={v.regCloseRef} onClick={v.closeRegister} aria-label="Close" style={{ width: "36px", height: "36px", border: "0", borderRadius: "8px", background: "#EEF2F7", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s", flexShrink: "0" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Sx>
        </div>
        <div style={{ flex: "1", overflow: "auto", padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div role="alert" style={{ display: v.regBannerDisplay, gap: "10px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "10px", background: "rgba(229,80,58,.08)", border: "1px solid rgba(229,80,58,.25)", color: "#C13D2B", fontSize: "13px", fontWeight: "500" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0" }}>
              <path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" />
            </svg>
            <span>{v.regBannerText}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: v.rgCols, gap: "28px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
              <section aria-labelledby="rg-s2" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr)", columnGap: "14px" }}>
                <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.rgStep2?.bg, color: v.rgStep2?.fg, border: `1.5px solid ${v.rgStep2?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: "600", fontVariantNumeric: "tabular-nums", flexShrink: "0", transition: "background-color .2s,border-color .2s" }}>{v.rgStep2?.mark}</span>
                  <span style={{ flex: "1", width: "1.5px", margin: "6px 0 -6px", background: "#E1E6EF" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "26px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "3px" }}>
                    <h4 id="rg-s2" style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>Assignment</h4>
                    <span style={{ fontSize: "12.5px", color: "#5A6675" }}>Which product and customer this device serves</span>
                  </div>
                  <fieldset style={{ margin: "0", padding: "0", border: "0", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                    <legend style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26", padding: "0", marginBottom: "6px" }}>Product assignment{' '}
                      <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                    </legend>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px" }}>
                      {(v.rgProducts ?? []).map((o, $index) => (
                        <React.Fragment key={$index}>
                          <Sx as="label" hover={{ borderColor: "#0070E0" }} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px", padding: "12px 12px 12px 14px", borderRadius: "12px", borderWidth: "1px", borderStyle: "solid", borderColor: o?.border, background: o?.bg, boxShadow: o?.shadow, cursor: "pointer", transition: "border-color .15s,background-color .15s,box-shadow .15s" }}>
                            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                              <span aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "9px", background: o?.tileBg, color: o?.tileFg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color .15s" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d={o?.icon} />
                                </svg>
                              </span>
                              <input type="radio" name="rgProducts" checked={o?.checked} onChange={o?.pick} style={{ margin: "0", width: "17px", height: "17px", accentColor: "#0070E0" }} />
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "2px", lineHeight: "1.35" }}>
                              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1A1E26" }}>{o?.label}</span>
                              <span style={{ fontSize: "12px", color: "#5A6675" }}>{o?.sub}</span>
                            </span>
                          </Sx>
                        </React.Fragment>
                      ))}
                    </div>
                    <span id="rg-product-err" role="alert" style={{ display: v.rg?.product?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                      </svg>
                      <span>{v.rg?.product?.err}</span>
                    </span>
                  </fieldset>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "14px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-cust" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Customer / institution{' '}
                        <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-cust" type="text" value={v.rg?.customer?.value} onChange={v.rg?.customer?.set} required={true} aria-invalid={v.rg?.customer?.invalid} aria-describedby="rg-cust-hint rg-customer-err" autoComplete="off" placeholder={v.rgCustPh} style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.customer?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-cust-hint" style={{ fontSize: "12px", color: "#5A6675" }}>{v.rgCustHint}</span>
                      <span id="rg-customer-err" role="alert" style={{ display: v.rg?.customer?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.customer?.err}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-date" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Installation date{' '}
                        <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-date" type="date" value={v.rg?.date?.value} onChange={v.rg?.date?.set} required={true} aria-invalid={v.rg?.date?.invalid} aria-describedby="rg-date-err" placeholder="" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.date?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-date-err" role="alert" style={{ display: v.rg?.date?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.date?.err}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-site" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Site code{' '}
                        <span style={{ fontWeight: "400", color: "#5A6675" }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4z" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-site" type="text" value={v.rg?.site?.value} onChange={v.rg?.site?.set} aria-invalid={v.rg?.site?.invalid} aria-describedby="rg-site-hint rg-site-err" autoComplete="off" placeholder="e.g. eps_koorgalli" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.site?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-site-hint" style={{ fontSize: "12px", color: "#5A6675" }}>{v.rgSiteHint}</span>
                      <span id="rg-site-err" role="alert" style={{ display: v.rg?.site?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.site?.err}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-loc" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Location{' '}
                        <span style={{ fontWeight: "400", color: "#5A6675" }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-loc" type="text" value={v.rg?.location?.value} onChange={v.rg?.location?.set} aria-invalid={v.rg?.location?.invalid} aria-describedby="rg-location-err" autoComplete="off" placeholder="e.g. Koorgalli, Mysuru" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.location?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-location-err" role="alert" style={{ display: v.rg?.location?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.location?.err}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section aria-labelledby="rg-s1" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr)", columnGap: "14px" }}>
                <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.rgStep1?.bg, color: v.rgStep1?.fg, border: `1.5px solid ${v.rgStep1?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: "600", fontVariantNumeric: "tabular-nums", flexShrink: "0", transition: "background-color .2s,border-color .2s" }}>{v.rgStep1?.mark}</span>
                  <span style={{ flex: "1", width: "1.5px", margin: "6px 0 -6px", background: "#E1E6EF" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "26px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "3px" }}>
                    <h4 id="rg-s1" style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>Device</h4>
                    <span style={{ fontSize: "12.5px", color: "#5A6675" }}>Its device ID, and the MACs as printed on the label on the box.</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", padding: "10px 14px", borderRadius: "12px", background: "#F6F8FB", border: "1px solid #E4E9F0", fontSize: "13px" }}>
                    <span style={{ color: "#5A6675" }}>Device type</span>
                    <span style={{ fontWeight: "600", color: "#1A1E26" }}>{v.rgTypeText}</span>
                    <span style={{ fontSize: "12px", color: "#5A6675" }}>Set by the product above.</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                    <label htmlFor="rg-devid" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Device ID{' '}
                      <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                        <path d="M4 7h16M4 12h16M4 17h10" />
                      </svg>
                      <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-devid" type="text" required={true} value={v.rg?.deviceId?.value} onChange={v.rg?.deviceId?.set} aria-invalid={v.rg?.deviceId?.invalid} aria-describedby="rg-devid-hint rg-devid-err" autoComplete="off" spellCheck={false} placeholder="e.g. proctor-003" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.deviceId?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                    </div>
                    <span id="rg-devid-hint" style={{ fontSize: "12px", color: "#5A6675" }}>How the box is known everywhere (support, logs, the agent). Lowercase: 3–64 letters, digits, dots, dashes or underscores; it cannot be changed later. Copy it from the portal when setting up the box.</span>
                    <span id="rg-devid-err" role="alert" style={{ display: v.rg?.deviceId?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                      </svg>
                      <span>{v.rg?.deviceId?.err}</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                    <span id="rg-mac-note" style={{ fontSize: "12.5px", color: "#3B4552", lineHeight: "1.5" }}>Enter both. The agent reads both from the box when it is installed and checks them against what you enter here.</span>
                    <div style={{ display: "grid", gridTemplateColumns: v.rgPairCols, gap: "14px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <label htmlFor="rg-lanmac" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>LAN MAC{' '}
                          <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                            <path d="M3 6h18v10H3zM7 16v3h10v-3M7 10h.01M10 10h.01M14 10h.01M17 10h.01" />
                          </svg>
                          <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-lanmac" type="text" value={v.rg?.lanMac?.value} onChange={v.rg?.lanMac?.set} aria-invalid={v.rg?.lanMac?.invalid} aria-describedby="rg-mac-note rg-lanmac-hint rg-lanMac-err" autoComplete="off" spellCheck={false} autoCapitalize="characters" placeholder="e.g. 2C:CF:67:12:34:56" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.lanMac?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                        </div>
                        <span id="rg-lanmac-hint" style={{ fontSize: "12px", color: "#5A6675" }}>Ethernet port, as printed on the device label.</span>
                        <span id="rg-lanMac-err" role="alert" style={{ display: v.rg?.lanMac?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                          </svg>
                          <span>{v.rg?.lanMac?.err}</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <label htmlFor="rg-wifimac" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Wi-Fi MAC{' '}
                          <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                            <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 20h.01" />
                          </svg>
                          <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-wifimac" type="text" value={v.rg?.wifiMac?.value} onChange={v.rg?.wifiMac?.set} aria-invalid={v.rg?.wifiMac?.invalid} aria-describedby="rg-mac-note rg-wifimac-hint rg-wifiMac-err" autoComplete="off" spellCheck={false} autoCapitalize="characters" placeholder="e.g. 2C:CF:67:12:34:56" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.wifiMac?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                        </div>
                        <span id="rg-wifimac-hint" style={{ fontSize: "12px", color: "#5A6675" }}>Wi-Fi module, as printed on the device label.</span>
                        <span id="rg-wifiMac-err" role="alert" style={{ display: v.rg?.wifiMac?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                          </svg>
                          <span>{v.rg?.wifiMac?.err}</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <label htmlFor="rg-serial" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Serial number{' '}
                          <span style={{ fontWeight: "400", color: "#5A6675" }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                            <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14" />
                          </svg>
                          <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-serial" type="text" value={v.rg?.serial?.value} onChange={v.rg?.serial?.set} aria-invalid={v.rg?.serial?.invalid} aria-describedby="rg-serial-hint rg-serial-err" autoComplete="off" spellCheck={false} placeholder="e.g. 1423847650" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.serial?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                        </div>
                        <span id="rg-serial-hint" style={{ fontSize: "12px", color: "#5A6675" }}>As printed on the device label.</span>
                        <span id="rg-serial-err" role="alert" style={{ display: v.rg?.serial?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                          </svg>
                          <span>{v.rg?.serial?.err}</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <label htmlFor="rg-name" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Display name{' '}
                          <span style={{ fontWeight: "400", color: "#5A6675" }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                            <path d="M4 6h16M4 12h10M4 18h7" />
                          </svg>
                          <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-name" type="text" value={v.rg?.name?.value} onChange={v.rg?.name?.set} aria-invalid={v.rg?.name?.invalid} aria-describedby="rg-name-hint rg-name-err" autoComplete="off" placeholder={v.rgNamePh} style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.name?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                        </div>
                        <span id="rg-name-hint" style={{ fontSize: "12px", color: "#5A6675" }}>Shown on the dashboard and in the device list. Left empty, the device ID is used.</span>
                        <span id="rg-name-err" role="alert" style={{ display: v.rg?.name?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                          </svg>
                          <span>{v.rg?.name?.err}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section aria-labelledby="rg-s3" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr)", columnGap: "14px" }}>
                <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.rgStep3?.bg, color: v.rgStep3?.fg, border: `1.5px solid ${v.rgStep3?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: "600", fontVariantNumeric: "tabular-nums", flexShrink: "0", transition: "background-color .2s,border-color .2s" }}>{v.rgStep3?.mark}</span>
                  <span style={{ flex: "1", width: "1.5px", margin: "6px 0 -6px", background: "#E1E6EF" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "26px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "3px" }}>
                    <h4 id="rg-s3" style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>Support contact</h4>
                    <span style={{ fontSize: "12.5px", color: "#5A6675" }}>Who we reach when this device needs attention</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "14px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0", gridColumn: "1 / -1" }}>
                      <label htmlFor="rg-contact" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Contact name{' '}
                        <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21a8 8 0 0 1 16 0" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-contact" type="text" value={v.rg?.contact?.value} onChange={v.rg?.contact?.set} required={true} aria-invalid={v.rg?.contact?.invalid} aria-describedby="rg-contact-err" placeholder="e.g. Rahul Menon" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.contact?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-contact-err" role="alert" style={{ display: v.rg?.contact?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.contact?.err}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-email" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Email{' '}
                        <span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M4 4h16v16H4zM22 6l-10 7L2 6" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-email" type="email" value={v.rg?.email?.value} onChange={v.rg?.email?.set} required={true} aria-invalid={v.rg?.email?.invalid} aria-describedby="rg-email-err" placeholder="name@institution.edu" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.email?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-email-err" role="alert" style={{ display: v.rg?.email?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.email?.err}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <label htmlFor="rg-phone" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Phone{' '}
                        <span style={{ fontWeight: "400", color: "#5A6675" }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4l2.7.7a2 2 0 0 1 1.7 2z" />
                        </svg>
                        <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="rg-phone" type="tel" value={v.rg?.phone?.value} onChange={v.rg?.phone?.set} aria-invalid={v.rg?.phone?.invalid} aria-describedby="rg-phone-err" placeholder="+91 98450 12345" style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.rg?.phone?.border, padding: "0 14px 0 40px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0", transition: "border-color .15s,box-shadow .15s" }} />
                      </div>
                      <span id="rg-phone-err" role="alert" style={{ display: v.rg?.phone?.errDisplay, alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                        </svg>
                        <span>{v.rg?.phone?.err}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section aria-labelledby="rg-s4" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr)", columnGap: "14px" }}>
                <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: v.rgStep4?.bg, color: v.rgStep4?.fg, border: `1.5px solid ${v.rgStep4?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12.5px", fontWeight: "600", fontVariantNumeric: "tabular-nums", flexShrink: "0", transition: "background-color .2s,border-color .2s" }}>{v.rgStep4?.mark}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "4px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "3px" }}>
                    <h4 id="rg-s4" style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>Monitoring</h4>
                    <span style={{ fontSize: "12.5px", color: "#5A6675" }}>What the box reports, and what happens when it is offline</span>
                  </div>
                  <ul style={{ margin: "0", padding: "12px 14px 12px 32px", borderRadius: "12px", background: "#F6F8FB", border: "1px solid #E4E9F0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#3B4552", lineHeight: "1.5" }}>
                    {(v.rgMonitorNotes ?? []).map((t, $index) => <li key={$index}>{t}</li>)}
                  </ul>
                </div>
              </section>
            </div>
            <aside aria-label="Registration preview" style={{ position: "sticky", top: "0", alignSelf: "start", display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" }}>
              <div style={{ borderRadius: "16px", border: "1px solid #E4E9F0", background: "#FFFFFF", boxShadow: "0 8px 24px -16px rgba(16,42,84,.25)", overflow: "hidden" }}>
                <div style={{ position: "relative", height: "150px", background: "radial-gradient(120% 95% at 50% 15%,#FFFFFF 0%,#EEF2F7 70%,#E1E8F2 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #E4E9F0" }}>
                  <svg role="img" aria-label={v.rgPrevAlt} width="236" height="142" viewBox="0 0 200 120" style={{ display: v.rgPrevJON }}>
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
                  <svg role="img" aria-label={v.rgPrevAlt} width="236" height="142" viewBox="0 0 200 120" style={{ display: v.rgPrevRPI }}>
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
                  <svg role="img" aria-label={v.rgPrevAlt} width="236" height="142" viewBox="0 0 200 120" style={{ display: v.rgPrevTHR }}>
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
                  <svg role="img" aria-label={v.rgPrevAlt} width="236" height="142" viewBox="0 0 200 120" style={{ display: v.rgPrevDGX }}>
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
                  <span style={{ position: "absolute", top: "10px", left: "10px", height: "24px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "0 9px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #E1E6EF", fontSize: "11.5px", fontWeight: "600", color: "#5A6675" }}>
                    <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8A93A2" }} />Awaiting first reading
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px 16px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span title={v.rgPrevName} style={{ fontSize: "16px", fontWeight: "600", color: v.rgPrevNameFg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.rgPrevName}</span>
                    <span style={{ fontSize: "12.5px", color: "#5A6675" }}>{v.rgPrevBrand}{v.rgPrevType}</span>
                  </div>
                  <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "8px 12px", fontSize: "12.5px" }}>
                    <dt style={{ color: "#5A6675" }}>LAN MAC</dt>
                    <dd title={v.rgPrevLan} style={{ margin: "0", textAlign: "right", fontWeight: "500", color: v.rgPrevLanFg, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.rgPrevLan}</dd>
                    <dt style={{ color: "#5A6675" }}>Wi-Fi MAC</dt>
                    <dd title={v.rgPrevWifi} style={{ margin: "0", textAlign: "right", fontWeight: "500", color: v.rgPrevWifiFg, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.rgPrevWifi}</dd>
                    <dt style={{ color: "#5A6675" }}>Serial</dt>
                    <dd title={v.rgPrevSerial} style={{ margin: "0", textAlign: "right", fontWeight: "500", color: v.rgPrevSerialFg, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.rgPrevSerial}</dd>
                    <dt style={{ color: "#5A6675" }}>Product</dt>
                    <dd style={{ margin: "0", textAlign: "right", fontWeight: "500", color: v.rgPrevProductFg }}>{v.rgPrevProduct}</dd>
                    <dt style={{ color: "#5A6675" }}>Customer</dt>
                    <dd title={v.rgPrevCustomer} style={{ margin: "0", textAlign: "right", fontWeight: "500", color: v.rgPrevCustomerFg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.rgPrevCustomer}</dd>
                    <dt style={{ color: "#5A6675" }}>Installed</dt>
                    <dd style={{ margin: "0", textAlign: "right", fontWeight: "500" }}>{v.rgPrevDate}</dd>
                    <dt style={{ color: "#5A6675" }}>Readings</dt>
                    <dd style={{ margin: "0", textAlign: "right", fontWeight: "500" }}>Every {v.rgPrevBeat}</dd>
                  </dl>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid #E4E9F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>Required details</span>
                  <span style={{ fontSize: "12.5px", fontWeight: "600", color: v.rgProgFg, fontVariantNumeric: "tabular-nums" }}>{v.rgProgText}</span>
                </div>
                <span aria-hidden="true" style={{ height: "6px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: v.rgProgW, borderRadius: "999px", background: v.rgProgBar, transition: "width .28s cubic-bezier(.22,1,.36,1)" }} />
                </span>
              </div>
            </aside>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", padding: "14px 22px", borderTop: "1px solid #E4E9F0", background: "#FFFFFF" }}>
          <Sx as="button" hover={{ background: "#F5F7FA", color: "#1A1E26" }} type="button" onClick={v.resetRegister} style={{ height: "44px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", border: "0", borderRadius: "10px", background: "transparent", color: "#5A6675", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 2.64-6.36M3 3v6h6" />
            </svg>
            <span>Reset form</span>
          </Sx>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Sx as="button" hover={{ background: "#F6F8FB" }} type="button" onClick={v.closeRegister} style={{ height: "46px", padding: "0 20px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#1A1E26", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Cancel</Sx>
            <Sx as="button" hover={{ transform: "translateY(-1.5px)", boxShadow: "0 6px 16px -6px rgba(0,112,224,.45)" }} type="submit" disabled={v.regBusy} style={{ height: "46px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", border: "0", borderRadius: "11px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "transform .16s,box-shadow .16s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{v.regSubmitLabel}</span>
            </Sx>
          </div>
        </div>
      </form>
    </div>
  );
}
