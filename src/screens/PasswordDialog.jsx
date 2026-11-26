import React from 'react';
import Sx from '../components/Sx.jsx';

// Change your own password (POST /auth/change-password). The API checks the current password and the new one's strength.
export default function PasswordDialog(v) {
  if (!v.pwdOpen) return null;
  const field = (id, label, value, onChange, autoComplete, hint) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26" }}>{label}</label>
      <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id={id} type="password" value={value} onChange={onChange} autoComplete={autoComplete} required={true}
        style={{ height: "44px", width: "100%", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", padding: "0 14px", fontSize: "14px", color: "#1A1E26", background: "#FFFFFF", boxSizing: "border-box" }} />
      {hint ? <span style={{ fontSize: "12px", color: "#5A6675" }}>{hint}</span> : null}
    </div>
  );
  return (
    <div style={{ display: "flex", position: "fixed", inset: "0", zIndex: "1350", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={v.pwdClose} aria-hidden="true" style={{ position: "absolute", inset: "0", background: "rgba(20,30,50,.42)", backdropFilter: "blur(2px)" }} />
      <form role="dialog" data-trap="password" aria-modal="true" aria-labelledby="pwd-h" onSubmit={v.pwdSubmit} noValidate={true} style={{ position: "relative", width: "min(460px,100%)", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.35)", display: "flex", flexDirection: "column", gap: "16px", padding: "22px 24px 24px", animation: "popIn .2s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span aria-hidden="true" style={{ width: "40px", height: "40px", borderRadius: "11px", background: "#EEF2F7", color: "#0070E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
          </span>
          <h3 id="pwd-h" style={{ margin: "0", fontSize: "18px", fontWeight: "600", flex: "1" }}>Change password</h3>
          <Sx as="button" hover={{ transform: "rotate(90deg)" }} type="button" onClick={v.pwdClose} aria-label="Close" style={{ width: "34px", height: "34px", border: "0", borderRadius: "8px", background: "#EEF2F7", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </Sx>
        </div>
        {v.pwdErr ? (
          <div role="alert" style={{ display: "flex", gap: "8px", padding: "10px 12px", borderRadius: "10px", background: "#FEECEC", border: "1px solid #F5C2C2", color: "#B21E1E", fontSize: "13px", fontWeight: "500" }}>{v.pwdErr}</div>
        ) : null}
        {field("pwd-cur", "Current password", v.pwdCur, v.onPwdCur, "current-password")}
        {field("pwd-new", "New password", v.pwdNew, v.onPwdNew, "new-password", "At least 12 characters; avoid names and common words.")}
        {field("pwd-new2", "New password again", v.pwdNew2, v.onPwdNew2, "new-password")}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <Sx as="button" hover={{ background: "#F6F8FB" }} type="button" onClick={v.pwdClose} style={{ height: "42px", padding: "0 18px", borderRadius: "10px", border: "1px solid #E1E6EF", background: "#FFFFFF", color: "#1A1E26", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Cancel</Sx>
          <Sx as="button" hover={{ filter: "brightness(1.06)" }} type="submit" disabled={v.pwdBusy} style={{ height: "42px", padding: "0 18px", border: "0", borderRadius: "10px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: v.pwdBusy ? "progress" : "pointer" }}>{v.pwdBusy ? "Saving…" : "Change password"}</Sx>
        </div>
      </form>
    </div>
  );
}
