import React from 'react';
import Sx from '../components/Sx.jsx';

export default function Toast(v) {
  return (
    <div role={v.toastRole} aria-live="polite" style={{ position: "fixed", top: "76px", right: "20px", zIndex: "1400", display: v.toastDisplay, alignItems: "flex-start", gap: "12px", width: "min(360px,calc(100vw - 40px))", padding: "14px 14px 14px 16px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E1E6EF", boxShadow: "0 12px 32px -12px rgba(16,42,84,.3)", animation: "popIn .2s cubic-bezier(.22,1,.36,1)", overflow: "hidden" }}>
      <span aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "4px", background: v.toastBar }} />
      <span aria-hidden="true" style={{ width: "30px", height: "30px", borderRadius: "8px", background: v.toastIconBg, color: v.toastIconFg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={v.toastIcon} />
        </svg>
      </span>
      <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600" }}>{v.toastTitle}</span>
        <span style={{ fontSize: "12.5px", color: "#5A6675" }}>{v.toastBody}</span>
      </span>
      <Sx as="button" hover={{ background: "#F5F7FA" }} onClick={v.closeToast} aria-label="Close notification" style={{ width: "28px", height: "28px", border: "0", borderRadius: "7px", background: "transparent", color: "#5A6675", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </Sx>
    </div>
  );
}
