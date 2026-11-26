import React from 'react';
import Sx from '../components/Sx.jsx';

// The patches of one device (the device page's Patches tab and the "Update patch" dialog; docs/TD-ROLES.md section 10).
// The rows come ready to show from AppLogic.patchRow, for the signed-in role:
//   every role   the patch as "DGX Spark 01 v1.4.2", its status on this box (pending, installing, installed, failed,
//                problem reported), the guide listed first, the files with size and SHA-256, the standard steps
//   support      Upload patch, Resend e-mail, Delete, Copy download link, Add boxes, the e-mails, the boxes and the history
//   admin        the same information as support, without any of the buttons
//   client       Download, Download all, Report a problem; no addresses, mail state or download counts

const FONT = 'Poppins,sans-serif';
const COPY = 'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1';
const CHECK = 'M20 6 9 17l-5-5';
const LINK = 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71';
const DOWN = 'M12 3v12M7 10l5 5 5-5M5 21h14';
const DOC = 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h6';
const smallBtn = { height: "32px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "0 11px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#005BB8", fontFamily: FONT, fontSize: "12.5px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" };
const primaryBtn = { ...smallBtn, border: "0", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF" };
const linkBtn = { height: "28px", padding: "0 8px", border: "0", borderRadius: "7px", background: "transparent", color: "#005BB8", fontFamily: FONT, fontSize: "12.5px", fontWeight: "600", cursor: "pointer" };
const pill = (fg, bg) => ({ display: "inline-flex", alignItems: "center", height: "22px", padding: "0 9px", borderRadius: "999px", background: bg, color: fg, fontSize: "11.5px", fontWeight: "600", whiteSpace: "nowrap" });
const section = { display: "flex", flexDirection: "column", gap: "8px", padding: "10px 12px", borderRadius: "10px", background: "#F6F8FB", border: "1px solid #EDF1F6" };

function Icon({ d, size }) {
  return (
    <svg width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Toggle({ open, onClick, label, controls }) {
  return (
    <Sx as="button" type="button" hover={{ background: "#EEF2F7" }} onClick={onClick} aria-expanded={open ? 'true' : 'false'} aria-controls={controls} style={linkBtn}>
      {label}
    </Sx>
  );
}

/** One patch. `expanded`: the e-mail list is shown without the Show/Hide toggle (the dialog's result). */
export function PatchCard({ p, expanded }) {
  const recipOpen = expanded || p.recipOpen;
  return (
    <li style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px 16px", borderRadius: "12px", border: "1px solid #E4E9F0", background: "#FFFFFF", boxShadow: "0 2px 8px -6px rgba(16,42,84,.18)", fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1A1E26", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{p.title || p.version}</span>
            {p.statusShow !== false ? <span style={pill(p.statusFg, p.statusBg)}>{p.statusLabel}</span> : null}
            {p.boxLabel ? <span style={pill(p.boxFg, p.boxBg)} title={p.boxNote || undefined}>{p.boxLabel}</span> : null}
          </span>
          <span style={{ fontSize: "12px", color: "#5A6675" }}>{p.meta}</span>
          {p.targetNote ? <span style={{ fontSize: "12px", color: "#5A6675" }}>{p.targetNote}</span> : null}
          {p.boxNote ? <span style={{ fontSize: "12px", color: p.boxNoteFg || "#5A6675", overflowWrap: "anywhere" }}>{p.boxNote}</span> : null}
        </div>
        {p.resendShow || p.delShow ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {p.resendShow ? (
              <Sx as="button" type="button" hover={{ borderColor: "#0070E0", background: "#F6F8FB" }} onClick={p.resend} disabled={p.resendBusy} aria-label={'Resend e-mail for ' + (p.title || p.version)} style={{ ...smallBtn, cursor: p.resendBusy ? "wait" : "pointer" }}>
                <Icon d="M4 4h16v16H4zM4 6l8 7 8-7" />
                <span>{p.resendBusy ? 'Sending…' : 'Resend e-mail'}</span>
              </Sx>
            ) : null}
            {p.delShow ? (
              <Sx as="button" type="button" hover={{ borderColor: "#DC2626", background: "#FEECEC" }} onClick={p.del} disabled={p.delBusy || p.delAsk} aria-label={'Delete patch ' + (p.title || p.version)} style={{ ...smallBtn, color: "#B21E1E" }}>
                <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                <span>Delete</span>
              </Sx>
            ) : null}
          </div>
        ) : null}
      </div>
      {p.delAsk ? (
        <div role="alert" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "10px 12px", borderRadius: "10px", background: "#FEECEC", border: "1px solid #F5C2C2", color: "#B21E1E", fontSize: "13px", fontWeight: "500" }}>
          <span style={{ flex: "1 1 220px" }}>Delete patch {p.version} and its files? Its download links stop working; the version is not used again on its boxes.</span>
          <Sx as="button" type="button" hover={{ filter: "brightness(1.06)" }} onClick={p.delConfirm} disabled={p.delBusy} style={{ ...smallBtn, border: "0", background: "#DC2626", color: "#FFFFFF", cursor: p.delBusy ? "wait" : "pointer" }}>{p.delBusy ? 'Deleting…' : 'Delete'}</Sx>
          <Sx as="button" type="button" hover={{ background: "#F6F8FB" }} onClick={p.delCancel} disabled={p.delBusy} data-del-keep={p.key} style={{ ...smallBtn, color: "#1A1E26" }}>Keep</Sx>
        </div>
      ) : null}
      {p.notes ? <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#1A1E26", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{p.notes}</p> : null}
      {p.err ? <span role="status" style={{ fontSize: "12.5px", fontWeight: "500", color: "#B21E1E" }}>{p.err}</span> : null}
      {p.noGuide ? <span style={{ fontSize: "12.5px", color: "#8A5200" }}>{p.noGuide}</span> : null}
      <ul role="list" aria-label={'Files of ' + (p.title || p.version)} style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
        {(p.files ?? []).map(f => (
          <li key={f.key} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px 12px", borderRadius: "10px", background: f.guide ? "#F2F7FE" : "#F6F8FB", border: "1px solid " + (f.guide ? "#D6E6FA" : "#EDF1F6") }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ flex: "1 1 200px", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "0" }}>
                  {f.guide ? <span style={{ ...pill("#005BB8", "#E3EEFC"), gap: "5px" }}><Icon d={DOC} size={12} />Guide</span> : null}
                  <span title={f.name} style={{ fontSize: "13.5px", fontWeight: "500", color: "#1A1E26", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#5A6675", fontVariantNumeric: "tabular-nums" }}>
                  <span>{f.size}</span>
                  <span aria-hidden="true">·</span>
                  <span title={f.sha || undefined}>SHA-256 {f.shaShort}</span>
                  {f.sha ? (
                    <Sx as="button" type="button" hover={{ background: "#EEF2F7", color: "#005BB8" }} onClick={f.copySha} aria-label={'Copy the full SHA-256 of ' + f.name} title="Copy full SHA-256" style={{ width: "24px", height: "24px", border: "0", borderRadius: "6px", background: "transparent", color: f.shaCopied ? "#0E7A36" : "#5A6675", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Icon d={f.shaCopied ? CHECK : COPY} size={13} />
                    </Sx>
                  ) : null}
                  {f.shaCopied ? <span role="status" style={{ color: "#0E7A36", fontWeight: "600" }}>Copied</span> : null}
                </span>
              </span>
              {f.linkShow ? (
                <Sx as="button" type="button" hover={{ borderColor: "#0070E0", background: "#FFFFFF" }} onClick={f.copyLink} disabled={f.linkBusy} aria-label={'Copy download link for ' + f.name} style={{ ...smallBtn, cursor: f.linkBusy ? "wait" : "pointer", color: f.linkCopied ? "#0E7A36" : "#005BB8" }}>
                  <Icon d={f.linkCopied ? CHECK : LINK} />
                  <span>{f.linkBusy ? 'Making link…' : f.linkCopied ? 'Link copied' : 'Copy download link'}</span>
                </Sx>
              ) : null}
              {f.dlShow ? (
                <Sx as="button" type="button" hover={{ borderColor: "#0070E0", background: "#FFFFFF" }} onClick={f.download} disabled={f.dlBusy} aria-label={'Download ' + f.name} style={{ ...smallBtn, cursor: f.dlBusy ? "wait" : "pointer" }}>
                  <Icon d={DOWN} />
                  <span>{f.dlBusy ? 'Starting…' : f.guide ? 'Download guide' : 'Download'}</span>
                </Sx>
              ) : null}
            </div>
            {f.linkUrl ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <input readOnly={true} value={f.linkUrl} aria-label={'Download link for ' + f.name} onFocus={e => e.target.select()} style={{ height: "32px", borderRadius: "8px", border: "1px solid #D5DBE4", padding: "0 10px", fontFamily: "ui-monospace,SFMono-Regular,Consolas,monospace", fontSize: "12px", color: "#1A1E26", background: "#FFFFFF", minWidth: "0" }} />
                <span style={{ fontSize: "11.5px", color: "#5A6675" }}>{f.linkExp ? f.linkExp + ' · ' : ''}anyone with this link can download the file.</span>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {p.dlAllShow || p.problemShow || p.stepsShow ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {p.dlAllShow ? (
            <Sx as="button" type="button" hover={{ filter: "brightness(1.06)" }} onClick={p.downloadAll} disabled={p.dlAllBusy} aria-label={'Download all files of ' + (p.title || p.version)} style={{ ...primaryBtn, cursor: p.dlAllBusy ? "wait" : "pointer" }}>
              <Icon d={DOWN} />
              <span>{p.dlAllBusy ? 'Downloading…' : 'Download all'}</span>
            </Sx>
          ) : null}
          {p.stepsShow ? <Toggle open={p.stepsOpen} onClick={p.stepsToggle} label={(p.stepsOpen ? 'Hide' : 'Show') + ' the standard steps'} controls={'pt-steps-' + p.key} /> : null}
          {p.problemShow ? (
            <Sx as="button" type="button" hover={{ borderColor: "#DC2626", background: "#FEECEC" }} onClick={p.problemToggle} aria-expanded={p.problemOpen ? 'true' : 'false'} style={{ ...smallBtn, marginLeft: "auto", color: "#B21E1E" }}>
              <Icon d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <span>Report a problem</span>
            </Sx>
          ) : null}
        </div>
      ) : null}
      {p.stepsShow && p.stepsOpen ? (
        <ol id={'pt-steps-' + p.key} style={{ ...section, margin: "0", paddingLeft: "32px", fontSize: "13px", lineHeight: "1.55", color: "#1A1E26" }}>
          {(p.steps ?? []).map((t, i) => <li key={i} style={{ overflowWrap: "anywhere" }}>{t}</li>)}
        </ol>
      ) : null}
      {p.problemShow && p.problemOpen ? (
        <div style={section}>
          <label htmlFor={'pt-prob-' + p.key} style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>What went wrong with {p.title || p.version}?</label>
          <textarea id={'pt-prob-' + p.key} value={p.problemText} onChange={p.problemSet} maxLength={1000} rows={3} aria-invalid={p.problemErr ? 'true' : 'false'}
            placeholder="E.g. the install script stopped with an error, or the app does not start after the update."
            style={{ width: "100%", boxSizing: "border-box", borderRadius: "8px", border: "1px solid " + (p.problemErr ? "#DC2626" : "#D5DBE4"), padding: "8px 10px", fontFamily: FONT, fontSize: "13px", color: "#1A1E26", resize: "vertical" }} />
          {p.problemErr ? <span role="alert" style={{ fontSize: "12.5px", color: "#B21E1E" }}>{p.problemErr}</span> : null}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <Sx as="button" type="button" hover={{ filter: "brightness(1.06)" }} onClick={p.problemSend} disabled={p.problemBusy} style={{ ...primaryBtn, background: "#DC2626", cursor: p.problemBusy ? "wait" : "pointer" }}>{p.problemBusy ? 'Sending…' : 'Send to Excelsoft support'}</Sx>
            <Sx as="button" type="button" hover={{ background: "#F6F8FB" }} onClick={p.problemToggle} style={{ ...smallBtn, color: "#1A1E26" }}>Cancel</Sx>
            <span style={{ fontSize: "12px", color: "#5A6675" }}>Support is notified at once.</span>
          </div>
        </div>
      ) : null}
      {p.boxesShow ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "12.5px", color: "#5A6675" }}>
            <Icon d="M3 7h18v13H3zM8 7V4h8v3" size={13} />
            <span>{p.boxesLabel}</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
              <Toggle open={p.boxesOpen} onClick={p.boxesToggle} label={(p.boxesOpen ? 'Hide' : 'Show') + ' boxes'} controls={'pt-boxes-' + p.key} />
              {p.addShow ? <Toggle open={p.addOpen} onClick={p.addToggle} label="Add boxes" controls={'pt-add-' + p.key} /> : null}
            </span>
          </div>
          {p.boxesOpen ? (
            <ul id={'pt-boxes-' + p.key} role="list" aria-label={'Boxes of ' + p.version} style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", borderTop: "1px solid #F0F3F7" }}>
              {(p.boxes ?? []).map(b => (
                <li key={b.key} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "7px 0", borderBottom: "1px solid #F0F3F7" }}>
                  <span style={{ flex: "1 1 200px", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26", overflowWrap: "anywhere" }}>{b.name}</span>
                    {b.note ? <span style={{ fontSize: "11.5px", color: b.noteFg || "#5A6675", overflowWrap: "anywhere" }}>{b.note}</span> : null}
                  </span>
                  <span style={pill(b.fg, b.bg)}>{b.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {p.addShow && p.addOpen ? (
            <div id={'pt-add-' + p.key} style={section}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#1A1E26" }}>Add boxes of this customer to {p.version}</span>
              {(p.addCands ?? []).length ? (
                <div role="group" aria-label="Boxes to add" style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "200px", overflow: "auto" }}>
                  {p.addCands.map(c => (
                    <label key={c.key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1A1E26", minHeight: "28px", cursor: "pointer" }}>
                      <input type="checkbox" checked={c.checked} onChange={c.toggle} style={{ width: "16px", height: "16px", margin: "0", accentColor: "#0070E0" }} />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              ) : <span style={{ fontSize: "12.5px", color: "#5A6675" }}>{p.addNone}</span>}
              {p.addErr ? <span role="alert" style={{ fontSize: "12.5px", color: "#B21E1E" }}>{p.addErr}</span> : null}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <Sx as="button" type="button" hover={{ filter: "brightness(1.06)" }} onClick={p.addSend} disabled={p.addBusy || !(p.addCands ?? []).length} style={{ ...primaryBtn, cursor: p.addBusy ? "wait" : "pointer" }}>{p.addBusy ? 'Adding…' : 'Add and e-mail'}</Sx>
                <Sx as="button" type="button" hover={{ background: "#F6F8FB" }} onClick={p.addToggle} style={{ ...smallBtn, color: "#1A1E26" }}>Cancel</Sx>
                <span style={{ fontSize: "12px", color: "#5A6675" }}>They show the patch as pending, and their contacts get the e-mail.</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {p.mailShow ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px 14px", flexWrap: "wrap", fontSize: "12.5px", color: "#5A6675" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon d="M4 4h16v16H4zM4 6l8 7 8-7" size={13} /><span>{p.mailSummary}</span></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontVariantNumeric: "tabular-nums" }}><Icon d={DOWN} size={13} /><span>{p.downloads}</span></span>
          <span style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            {p.recipToggleShow && !expanded ? <Toggle open={p.recipOpen} onClick={p.recipToggle} label={p.recipToggleLabel} /> : null}
            {p.histShow ? <Toggle open={p.histOpen} onClick={p.histToggle} label={(p.histOpen ? 'Hide' : 'Show') + ' history'} controls={'pt-hist-' + p.key} /> : null}
          </span>
        </div>
      ) : null}
      {p.mailShow && p.mailNote ? <span style={{ fontSize: "12px", color: "#8A5200" }}>{p.mailNote}</span> : null}
      {p.mailShow && recipOpen && (p.recipients ?? []).length ? (
        <ul role="list" aria-label={'E-mails for ' + p.version} style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", borderTop: "1px solid #F0F3F7" }}>
          {p.recipients.map(r => (
            <li key={r.key} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "8px 0", borderBottom: "1px solid #F0F3F7" }}>
              <span style={{ flex: "1 1 200px", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#1A1E26", overflowWrap: "anywhere" }}>{r.email}</span>
                {r.sub ? <span style={{ fontSize: "11.5px", color: "#5A6675" }}>{r.sub}</span> : null}
                {r.err ? <span style={{ fontSize: "11.5px", color: "#B21E1E" }}>{r.err}</span> : null}
              </span>
              <span style={pill(r.fg, r.bg)}>{r.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {p.histShow && p.histOpen ? (
        <ol id={'pt-hist-' + p.key} aria-label={'History of ' + p.version} style={{ ...section, margin: "0", paddingLeft: "12px", listStyle: "none", gap: "4px" }}>
          {(p.history ?? []).map(h => (
            <li key={h.key} style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "12.5px", color: "#1A1E26" }}>
              <span style={{ color: "#5A6675", fontVariantNumeric: "tabular-nums", minWidth: "150px" }}>{h.at}</span>
              <span style={{ flex: "1 1 220px", overflowWrap: "anywhere" }}>{h.text}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </li>
  );
}

/** A list of patches, newest version first. */
export function PatchRows({ rows, label }) {
  return (
    <ul role="list" aria-label={label} style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
      {(rows ?? []).map(p => <React.Fragment key={p.key}><PatchCard p={p} /></React.Fragment>)}
    </ul>
  );
}

/** The patch list of the Patches tab. `canUpload`: a support engineer (the only role that sends patches). */
export default function PatchPanel(v) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ flex: "1 1 260px", fontSize: "13px", color: "#5A6675", lineHeight: "1.5" }}>
          {v.note || 'Patches for this device. Install one by hand, following its guide; the box then reports it here.'}
        </span>
        {v.canUpload ? (
          <Sx as="button" type="button" hover={{ transform: "translateY(-1px)", boxShadow: "0 6px 16px -6px rgba(0,112,224,.45)" }} data-pt-open={v.openKey} onClick={v.onUpload} disabled={v.uploadDisabled} aria-disabled={v.uploadDisabled ? 'true' : 'false'} title={v.uploadTitle || undefined}
            style={{ height: "38px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 16px", border: "0", borderRadius: "10px", background: v.uploadDisabled ? "#B9C4D4" : "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontFamily: FONT, fontSize: "13.5px", fontWeight: "600", cursor: v.uploadDisabled ? "not-allowed" : "pointer", transition: "transform .16s,box-shadow .16s", whiteSpace: "nowrap" }}>
            <Icon d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" size={16} />
            <span>Upload patch</span>
          </Sx>
        ) : null}
      </div>
      {v.canUpload && v.uploadDisabled && v.uploadTitle ? <span role="status" style={{ fontSize: "12.5px", color: "#B21E1E" }}>{v.uploadTitle}</span> : null}
      {v.loading ? <span role="status" style={{ fontSize: "13.5px", color: "#5A6675" }}>Loading patches…</span> : null}
      {v.err ? (
        <div role="alert" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13.5px", color: "#B21E1E" }}>{v.err}</span>
          {v.retry ? <Sx as="button" type="button" hover={{ background: "#F6F8FB" }} onClick={v.retry} style={{ ...smallBtn, height: "36px" }}>Try again</Sx> : null}
        </div>
      ) : null}
      {!v.loading && !v.err && !(v.rows ?? []).length ? (
        <span style={{ fontSize: "13.5px", color: "#5A6675" }}>{v.emptyText || 'No patches for this box yet.'}</span>
      ) : null}
      {(v.rows ?? []).length ? <PatchRows rows={v.rows} label="Patches of this device" /> : null}
    </div>
  );
}
