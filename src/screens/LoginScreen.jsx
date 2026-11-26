import React from 'react';
import Sx from '../components/Sx.jsx';

export default function LoginScreen(v) {
  return (
    <main id="main" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: v.loginCols, background: "#F5F7FA" }}>
      <section aria-label="About SARAS Device Management" style={{ display: v.loginHeroDisplay, position: "relative", overflow: "hidden", padding: "40px 48px", background: "#0B2A5C", color: "#FFFFFF", flexDirection: "column", justifyContent: "space-between", gap: "36px", minHeight: "100vh" }}>
        {/* server racks, blue-tinted (design export login-background-overlay); a plain blue shows while it loads */}
        <img src="/assets/login-background-overlay.jpg" alt="" aria-hidden="true" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", display: "block" }} />
        <span aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "linear-gradient(180deg,rgba(8,36,84,.15) 0%,rgba(8,36,84,.05) 45%,rgba(6,30,72,.85) 100%)" }} />
        <span style={{ position: "relative", display: "inline-flex", alignSelf: "flex-start", background: "#FFFFFF", borderRadius: "11px", padding: "8px 14px", boxShadow: "0 10px 24px -12px rgba(4,24,60,.6)", pointerEvents: "none" }}>
          <img src="/assets/excelsoft-logo.png" alt="Excelsoft" style={{ height: "30px", width: "auto", display: "block" }} />
        </span>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "14px", maxWidth: "520px", pointerEvents: "none" }}>
          <p style={{ margin: "0", fontSize: "36px", lineHeight: "1.16", fontWeight: "600", letterSpacing: "-.01em", color: "#FFFFFF", textWrap: "balance", textShadow: "0 2px 18px rgba(4,24,60,.45)" }}>Every edge device in your fleet, monitored from one place.</p>
          <span style={{ fontSize: "12px", color: "#FFFFFF" }}>© 2026 Excelsoft Technologies · SARAS Device Management</span>
        </div>
      </section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "min(420px,100%)", display: "flex", flexDirection: "column", gap: "22px" }}>
          <span style={{ display: v.loginLogoDisplay, alignSelf: "flex-start" }}>
            <img src="/assets/excelsoft-logo.png" alt="Excelsoft" style={{ height: "36px", width: "auto", display: "block" }} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 style={{ margin: "0", fontSize: "26px", fontWeight: "600", letterSpacing: "-.01em" }}>Welcome back</h1>
            <p style={{ margin: "0", fontSize: "14px", color: "#5A6675" }}>Sign in to SARAS Device Management to continue.</p>
          </div>
          <div style={{ position: "relative" }}>
            <span aria-hidden="true" style={{ position: "absolute", top: "-13px", left: "11%", right: "11%", height: "34px", borderRadius: "16px 16px 0 0", background: "linear-gradient(180deg,#F7F9FC 0%,#FFFFFF 100%)", border: "1px solid #E4E9F0", borderBottom: "none", boxShadow: "0 -1px 2px rgba(16,42,84,.04)", zIndex: "0" }} />
            <span aria-hidden="true" style={{ position: "absolute", top: "-6px", left: "6.5%", right: "6.5%", height: "26px", borderRadius: "16px 16px 0 0", background: "linear-gradient(180deg,#FBFCFE 0%,#FFFFFF 100%)", border: "1px solid #E8EDF4", borderBottom: "none", boxShadow: "0 -1px 2px rgba(16,42,84,.03)", zIndex: "0" }} />
            <form onSubmit={v.signIn} noValidate={true} style={{ position: "relative", zIndex: "1", overflow: "hidden", display: "flex", flexDirection: "column", gap: "18px", padding: "28px 26px", borderRadius: "20px", background: "#FFFFFF", border: "1px solid #E4E9F0", boxShadow: "inset 0 1px 0 rgba(255,255,255,.7),0 16px 34px -22px rgba(16,42,84,.30)" }}>
              {(v.authErr) ? (
                <>
                  <div role="alert" style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "10px", background: "#FEECEC", border: "1px solid #F5C2C2", color: "#B21E1E", fontSize: "13px", fontWeight: "500" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", marginTop: "1px" }}>
                      <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v5M12 16h.01" />
                    </svg>
                    <span>{v.authErr}</span>
                  </div>
                </>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="email" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Username or email</label>
                <div style={{ position: "relative" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                    <path d="M4 4h16v16H4zM22 6l-10 7L2 6" />
                  </svg>
                  <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="email" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Username or email" required={true} aria-invalid={v.loginInvalid} value={v.email} onChange={v.onEmail} style={{ width: "100%", height: "46px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.loginBorder, padding: "0 14px 0 42px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", transition: "border-color .15s,box-shadow .15s" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <label htmlFor="pw" style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>Password</label>
                  <span style={{ fontSize: "12.5px", color: "#5A6675", whiteSpace: "nowrap", flexShrink: "0" }}>Forgot it? Ask a portal admin</span>
                </div>
                <div style={{ position: "relative" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5A6675" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "14px", pointerEvents: "none" }}>
                    <path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="pw" type={v.pwType} autoComplete="current-password" placeholder="Enter your password" required={true} aria-invalid={v.loginInvalid} value={v.pw} onChange={v.onPw} style={{ width: "100%", height: "46px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.loginBorder, padding: "0 48px 0 42px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", transition: "border-color .15s,box-shadow .15s" }} />
                  <Sx as="button" hover={{ background: "#EEF2F7" }} type="button" onClick={v.togglePw} aria-label={v.pwToggleLabel} style={{ position: "absolute", right: "5px", top: "5px", width: "36px", height: "36px", border: "0", borderRadius: "8px", background: "transparent", color: "#5A6675", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={v.pwIcon} />
                    </svg>
                  </Sx>
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "32px", fontSize: "13.5px", color: "#1A1E26", cursor: "pointer" }}>
                <input type="checkbox" checked={v.remember} onChange={v.toggleRemember} style={{ width: "18px", height: "18px", margin: "0", accentColor: "#0070E0" }} />
                <span style={{ flex: "1" }}>Keep me signed in on this device</span>
              </label>
              <Sx as="button" hover={{ transform: "translateY(-1.5px)", boxShadow: "0 6px 16px -6px rgba(0,112,224,.45)" }} active={{ transform: "scale(.98)" }} type="submit" disabled={v.signing} style={{ height: "48px", border: "0", borderRadius: "11px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "transform .16s cubic-bezier(.22,1,.36,1),box-shadow .16s" }}>
                {(v.signing) ? (
                  <>
                    <span aria-hidden="true" style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#FFFFFF", animation: "spin .8s linear infinite" }} />
                  </>
                ) : null}
                <span>{v.signInLabel}</span>
              </Sx>
            </form>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px", fontSize: "13px", color: "#5A6675" }}>
            <span>Trouble signing in? Contact your portal administrator.</span>
            <span style={{ display: v.loginSecureDisplay, alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
              </svg>Encrypted connection
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
