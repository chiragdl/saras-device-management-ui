import React from 'react';
import Sx from '../components/Sx.jsx';

// Shown once after a box is registered, re-keyed or given a new enrolment code: its device ID, then the one-time
// enrolment code (a box registered by MAC) or the box key (neither can be shown again), and the install command.
// With an agent uploaded (Settings → Agent releases) it also offers the latest agent: a Download button and the
// commands that download, unpack and install it on the box. Mode "agent" (the device page's Install / update agent):
// only the agent and the upgrade commands, nothing secret.
export default function BoxKeyDialog(v) {
  const k = v.boxKey;
  if (!k) return null;
  const mac = k.mode === "mac", agentOnly = k.mode === "agent", ag = k.agent;
  const what = mac ? "enrolment code" : "box key";
  const mono = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
  const canClose = agentOnly || v.boxKeyAck;
  const copyBtn = (label, onClick, done) => (
    <Sx as="button" hover={{ borderColor: "#0070E0", background: "#F6F9FE" }} type="button" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 12px", border: "1px solid #C9D6E8", borderRadius: "9px", background: "#FFFFFF", color: done ? "#0E7A36" : "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: "0" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={done ? "M20 6 9 17l-5-5" : "M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"} />
      </svg>
      <span>{done ? "Copied" : label}</span>
    </Sx>
  );
  return (
    <div style={{ display: "flex", position: "fixed", inset: "0", zIndex: "1350", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "rgba(20,30,50,.42)", backdropFilter: "blur(2px)" }} />
      <div role="dialog" data-trap="boxkey" aria-modal="true" aria-labelledby="bk-h" aria-describedby="bk-d" style={{ position: "relative", width: "min(640px,100%)", maxHeight: "92vh", overflow: "auto", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.35)", display: "flex", flexDirection: "column", gap: "18px", padding: "22px 24px 24px", animation: "popIn .2s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <span aria-hidden="true" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#E7F6EC", color: "#0E7A36", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 7a4 4 0 1 1-3.9 4.9L3 20v-3l2-2v-2h2l2.1-2.1A4 4 0 0 1 15 7zM16 10h.01" />
            </svg>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
            <h3 id="bk-h" style={{ margin: "0", fontSize: "19px", fontWeight: "600" }}>{k.title}</h3>
            <p id="bk-d" style={{ margin: "0", fontSize: "13.5px", color: "#5A6675" }}>{k.subtitle}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span id="bk-id-l" style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>Device ID</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 6px 6px 14px", borderRadius: "10px", background: "#F6F8FB", border: "1px solid #E4E9F0" }}>
            <input type="text" readOnly={true} aria-readonly="true" aria-labelledby="bk-id-l" value={k.deviceId || ""} onFocus={e => e.target.select()} style={{ flex: "1", minWidth: "0", height: "32px", border: "0", padding: "0", background: "transparent", color: "#1A1E26", fontFamily: mono, fontSize: "14px", fontWeight: "600", outline: "none" }} />
            {copyBtn("Copy", v.copyBoxDeviceId, v.boxKeyCopied === "id")}
          </div>
          <span style={{ fontSize: "12px", color: "#5A6675" }}>Made by the server. Support staff find the box by it.</span>
        </div>
        {agentOnly ? null : (<>
        <div role="alert" style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "11px 13px", borderRadius: "10px", background: "#FEF3E2", border: "1px solid #F4DDB8", color: "#8A5200", fontSize: "13px", fontWeight: "500", lineHeight: "1.5" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", marginTop: "1px" }}>
            <path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" />
          </svg>
          <span>{mac ? "Copy the enrolment code now and give it to the person installing the box. It is shown only once and works once" + (k.codeUntil ? ", until " + k.codeUntil : "") + "; if it is lost or runs out, create a new one on the device's page."
            : "Copy the box key now and keep it somewhere safe until it is on the box. It is shown only once; if it is lost, re-key the box from its page."}</span>
        </div>
        {mac ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>Enrolment code</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 10px 10px 14px", borderRadius: "10px", background: "#10233F" }}>
              <code style={{ flex: "1", minWidth: "0", color: "#E6EEF8", fontFamily: mono, fontSize: "16px", fontWeight: "600", letterSpacing: "1px", overflowWrap: "anywhere" }}>{k.code}</code>
              {copyBtn("Copy code", v.copyBoxCode, v.boxKeyCopied === "code")}
            </div>
            <span style={{ fontSize: "12px", color: "#5A6675" }}>Shown only now{k.codeUntil ? " · valid until " + k.codeUntil : ""}</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>Box key</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 10px 10px 14px", borderRadius: "10px", background: "#10233F" }}>
              <code style={{ flex: "1", minWidth: "0", color: "#E6EEF8", fontFamily: mono, fontSize: "13px", overflowWrap: "anywhere" }}>{k.key}</code>
              {copyBtn("Copy key", v.copyBoxKey, v.boxKeyCopied === "key")}
            </div>
          </div>
        )}
        </>)}
        {ag ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "12px", border: "1px solid #CFE0F5", background: "#F6F9FE" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1E26" }}>{"Device agent " + ag.version}</span>
                <span style={{ fontSize: "12px", color: "#5A6675", overflowWrap: "anywhere" }}>{ag.fileName + " · " + ag.sizeText + (ag.until ? " · link valid until " + ag.until : "")}</span>
              </div>
              <Sx as="a" hover={{ filter: "brightness(1.06)" }} href={ag.url} id="bk-agent-dl" aria-label={"Download device agent " + ag.version} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", borderRadius: "9px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", textDecoration: "none", whiteSpace: "nowrap" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>
                <span>Download agent</span>
              </Sx>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <span id="bk-agent-l" style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>{ag.upgrade ? "Commands on the box (update the agent), in this order" : "Commands on the box, in this order"}</span>
              {copyBtn("Copy all", v.copyBoxAgent, v.boxKeyCopied === "agent")}
            </div>
            <ol aria-labelledby="bk-agent-l" style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(ag.steps ?? []).map((st, i) => (
                <li key={i} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: "600", color: "#3B4552" }}>
                    <span aria-hidden="true" style={{ width: "20px", height: "20px", borderRadius: "999px", background: "#0070E0", color: "#FFFFFF", fontSize: "11.5px", fontWeight: "700", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>{i + 1}</span>
                    <span>{st.label}</span>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 8px 8px 12px", borderRadius: "10px", background: "#10233F" }}>
                    <code style={{ flex: "1", minWidth: "0", color: "#7FD1A8", fontFamily: mono, fontSize: "12px", lineHeight: "1.55", overflowWrap: "anywhere" }}>{st.cmd}</code>
                    {copyBtn("Copy", () => v.copyAgentStep(i), v.boxKeyCopied === "agent" + i)}
                  </div>
                </li>
              ))}
            </ol>
            <span style={{ fontSize: "12px", color: "#5A6675", lineHeight: "1.5" }}>{ag.upgrade
              ? "They download the agent, unpack it and replace the agent code; the box keeps its key and settings."
              : "They download the agent, unpack it with python3 and run the setup in its agent folder."} No network access to the portal from the box? Use Download agent, copy the zip to the box (e.g. with scp), and run steps 2 to 4 in the folder you copied it to.</span>
          </div>
        ) : agentOnly ? (
          <p role="status" style={{ margin: "0", padding: "11px 13px", borderRadius: "10px", background: "#FEF3E2", border: "1px solid #F4DDB8", color: "#8A5200", fontSize: "13px", lineHeight: "1.5" }}>
            No agent has been uploaded yet. A portal administrator uploads it in Settings → Agent releases.</p>
        ) : k.command ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>On the box, in the agent folder</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 10px 10px 14px", borderRadius: "10px", background: "#10233F" }}>
              <code style={{ flex: "1", minWidth: "0", color: "#7FD1A8", fontFamily: mono, fontSize: "12.5px", overflowWrap: "anywhere" }}>{k.command}</code>
              {copyBtn("Copy", v.copyBoxCommand, v.boxKeyCopied === "command")}
            </div>
            <span style={{ fontSize: "12px", color: "#5A6675" }}>No agent has been uploaded to the portal yet (Settings → Agent releases), so copy the agent folder to the box by hand.</span>
          </div>
        ) : null}
        <ol style={{ margin: "0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#3B4552", lineHeight: "1.5" }}>
          {(k.steps ?? []).map((s, i) => <li key={i}>{s}</li>)}
        </ol>
        {agentOnly ? null : (
        <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "11px 13px", borderRadius: "10px", border: `1px solid ${v.boxKeyAck ? "#9FD8B4" : "#D5DBE4"}`, background: v.boxKeyAck ? "#F0FAF3" : "#F6F8FB", fontSize: "13px", color: "#1A1E26", lineHeight: "1.5", cursor: "pointer" }}>
          <input type="checkbox" checked={v.boxKeyAck} onChange={v.toggleBoxKeyAck} aria-describedby="bk-ack-d" style={{ margin: "2px 0 0", width: "17px", height: "17px", accentColor: "#16A34A", flexShrink: "0" }} />
          <span><strong>{"I have copied the " + what + " and saved it somewhere safe."}</strong>{' '}
            <span id="bk-ack-d" style={{ color: "#5A6675" }}>{mac ? "It cannot be shown again. If it is lost or runs out, create a new enrolment code on the device's page." : "It cannot be shown again. If it is lost, a new key must be created (re-key) and the box set up with it."}</span>
          </span>
        </label>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <Sx as="button" hover={canClose ? { filter: "brightness(1.06)" } : {}} type="button" onClick={v.closeBoxKey} disabled={!canClose} aria-disabled={!canClose} title={canClose ? "" : "Tick the box above first"} style={{ height: "42px", padding: "0 18px", border: "0", borderRadius: "10px", background: canClose ? "linear-gradient(180deg,#1a86f0,#0070E0)" : "#AEB6C2", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: canClose ? "pointer" : "not-allowed" }}>Close</Sx>
        </div>
      </div>
    </div>
  );
}
