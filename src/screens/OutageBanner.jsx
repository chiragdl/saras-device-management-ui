import React from 'react';
import Sx from '../components/Sx.jsx';

export default function OutageBanner(v) {
  return (
    ((v.serverDown) ? (
      <>
        <div role="alert" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 16px", padding: "15px 18px", borderRadius: "14px", background: "#FEF2F2", border: "1px solid #F3C6C6", boxShadow: "0 6px 18px -12px rgba(176,30,30,.4)" }}>
          <span aria-hidden="true" style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "11px", background: "#FCE2E2", color: "#B21E1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0", flex: "1 1 320px" }}>
            <span style={{ fontSize: "14.5px", fontWeight: "600", color: "#8A1414" }}>{v.outageTitle}</span>
            <span style={{ fontSize: "13px", color: "#9A3B3B" }}>{v.outageText}</span>
          </div>
          <Sx as="button" hover={{ filter: "brightness(1.06)" }} onClick={v.retryConnection} disabled={v.reconnecting} style={{ display: "flex", alignItems: "center", gap: "7px", height: "40px", padding: "0 16px", border: "0", borderRadius: "10px", background: "#B21E1E", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "600", cursor: v.retryCursor, whiteSpace: "nowrap" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: v.retryAnim }}>
              <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
            </svg>
            <span>{v.retryLabel}</span>
          </Sx>
        </div>
      </>
    ) : null)
  );
}
