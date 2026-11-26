import Sx from '../components/Sx.jsx';
import { PatchCard, PatchRows } from './PatchList.jsx';

// The three summary cards: blue (installed version), grey (storage), amber (e-mail recipients)
const CARD = {
  blue: { border: "#CFE0F5", bg: "linear-gradient(160deg,#FFFFFF 0%,#EEF4FC 100%)", bar: "#0070E0", tile: "linear-gradient(160deg,#1a86f0,#0070E0)", glow: "0 6px 12px -6px rgba(0,112,224,.6)" },
  grey: { border: "#DCE2EA", bg: "linear-gradient(160deg,#FFFFFF 0%,#F1F3F7 100%)", bar: "#5A6675", tile: "linear-gradient(160deg,#6B7686,#4A5563)", glow: "0 6px 12px -6px rgba(26,30,38,.5)" },
  amber: { border: "#F4DDB8", bg: "linear-gradient(160deg,#FFFFFF 0%,#FEF6EA 100%)", bar: "#F59E0B", tile: "linear-gradient(160deg,#F8B544,#E08A00)", glow: "0 6px 12px -6px rgba(224,138,0,.6)" }
};
const BTN = {
  primary: { border: "0", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF" },
  secondary: { borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#1A1E26" },
  danger: { borderWidth: "1px", borderStyle: "solid", borderColor: "#F5C2C2", background: "#FFFFFF", color: "#B21E1E" }
};
const PANEL = {
  busy: { fg: "#005BB8", bg: "#EEF4FC", border: "#CFE0F5" },
  ok: { fg: "#0E7A36", bg: "#E7F6EC", border: "#BFE5CB" },
  err: { fg: "#B21E1E", bg: "#FEECEC", border: "#F5C2C2" }
};
const label = { fontSize: "12px", fontWeight: "600", letterSpacing: ".48px", textTransform: "uppercase", color: "#5A6675" };
const note = (fg, bg, border) => ({ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 14px", borderRadius: "12px", background: bg, border: `1px solid ${border}`, color: fg, fontSize: "13px", lineHeight: "1.5", fontWeight: "500" });
const INFO = 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01';
const WARN = 'M12 3 2 20h20L12 3zM12 10v4M12 17h.01';
const DOC = 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h6';

function Icon({ d, size, sw }) {
  return (
    <svg width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw || "2"} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0" }}>
      <path d={d} />
    </svg>
  );
}

export default function PatchDialog(v) {
  const panel = v.ptPanel ? PANEL[v.ptPanel.kind] : null;
  return (
    <div style={{ display: v.patchDisplay, position: "fixed", inset: "0", zIndex: "1300", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div onClick={v.closePatch} aria-hidden="true" style={{ position: "absolute", inset: "0", background: "rgba(20,30,50,.42)", backdropFilter: "blur(2px)" }} />
      <div role="dialog" data-trap="patch" aria-modal="true" aria-labelledby="pt-h" aria-describedby="pt-d" style={{ position: "relative", width: "min(940px,100%)", maxHeight: "92vh", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 12px 32px -12px rgba(16,42,84,.35)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "popIn .2s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "22px 24px 16px", borderBottom: "1px solid #E4E9F0" }}>
          <span aria-hidden="true" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#EEF2F7", color: "#0070E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
            <Icon d="M12 3v12M7 10l5 5 5-5M5 21h14" size={22} />
          </span>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
            <h3 id="pt-h" style={{ margin: "0", fontSize: "19px", fontWeight: "600" }}>Update patch · {v.pv?.title}</h3>
            <p id="pt-d" style={{ margin: "0", fontSize: "13.5px", color: "#5A6675" }}>{v.pv?.sub}</p>
          </div>
          <Sx as="button" hover={{ transform: "rotate(90deg)" }} ref={v.patchCloseRef} onClick={v.closePatch} aria-label="Close" style={{ width: "36px", height: "36px", border: "0", borderRadius: "8px", background: "#EEF2F7", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s", flexShrink: "0" }}>
            <Icon d="M18 6 6 18M6 6l12 12" sw="2.4" />
          </Sx>
        </div>
        <div style={{ flex: "1", minHeight: "0", overflow: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ flexShrink: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "12px" }}>
            {(v.ptCards ?? []).map(c => {
              const t = CARD[c.tone] || CARD.blue;
              return (
                <div key={c.label} style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "12px", padding: "17px 16px 14px", minWidth: "0", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.bg, boxShadow: "0 4px 14px -10px rgba(16,42,84,.22)", overflow: "hidden" }}>
                  <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "3px", background: t.bar }} />
                  <span aria-hidden="true" style={{ width: "38px", height: "38px", borderRadius: "10px", background: t.tile, color: "#FFFFFF", boxShadow: t.glow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                    <Icon d={c.icon} size={17} />
                  </span>
                  <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ ...label, whiteSpace: "nowrap" }}>{c.label}</span>
                    <span style={{ fontSize: "17px", fontWeight: "600", color: "#1A1E26", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{c.value}</span>
                    <span style={{ fontSize: "12px", color: c.subFg || "#5A6675" }}>{c.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {v.ptLoadShow ? (
            <div role={v.ptLoadErr ? 'alert' : 'status'} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "13.5px", color: v.ptLoadErr ? "#B21E1E" : "#5A6675" }}>
              <span>{v.ptLoadText}</span>
              {v.ptLoadRetryShow ? <Sx as="button" type="button" hover={{ background: "#F6F8FB" }} onClick={v.ptLoadRetry} style={{ height: "36px", padding: "0 14px", borderRadius: "10px", border: "1px solid #C9D6E8", background: "#FFFFFF", color: "#005BB8", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}>Try again</Sx> : null}
            </div>
          ) : null}

          {v.ptReadOnly ? (
            <div role="note" style={note("#005BB8", "#EEF4FC", "#CFE0F5")}>
              <Icon d={INFO} />
              <span>{v.ptReadOnlyText || 'Only support engineers upload patches. The patches of this device are listed below.'}</span>
            </div>
          ) : null}

          {v.ptDetailsShow ? (
            <section aria-labelledby="pt-det" style={{ flexShrink: "0", display: "flex", flexDirection: "column", gap: "12px", padding: "14px 16px", borderRadius: "12px", border: "1px solid #E4E9F0", background: "#F6F8FB" }}>
              <h4 id="pt-det" style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Patch details</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="pt-ver" style={label}>Patch version{' '}<span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span></label>
                <Sx as="input" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="pt-ver" ref={v.verRef} type="text" required={true} aria-required="true" aria-invalid={v.verInvalid} aria-describedby="pt-ver-hint pt-ver-err" placeholder="e.g. v2.4.2" value={v.patchVer} onChange={v.onPatchVer} disabled={v.ptLocked} autoComplete="off" spellCheck={false} style={{ height: "44px", maxWidth: "320px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.verBorder, padding: "0 14px", fontSize: "14px", fontWeight: "500", color: "#1A1E26", background: v.ptLocked ? "#F1F3F7" : "#FFFFFF", fontVariantNumeric: "tabular-nums" }} />
                <span id="pt-ver-hint" style={{ fontSize: "12px", color: "#5A6675" }}>{v.verHint}</span>
                <span id="pt-ver-err" role="alert" style={{ display: v.verErrDisplay, fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>{v.verErr}</span>
              </div>
              {v.ptTargetShow ? (
                <fieldset style={{ margin: "0", padding: "0", border: "0", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <legend style={{ ...label, padding: "0", marginBottom: "6px" }}>Send to</legend>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(v.ptTargets ?? []).map(t => (
                      <label key={t.value} style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "40px", padding: "0 14px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: t.on ? "#0070E0" : "#D5DBE4", background: t.on ? "#EEF4FC" : "#FFFFFF", color: "#1A1E26", fontSize: "13.5px", fontWeight: "500", cursor: t.disabled || v.ptLocked ? "not-allowed" : "pointer", opacity: t.disabled ? "0.6" : "1" }}>
                        <input type="radio" name="pt-target" value={t.value} checked={t.on} disabled={t.disabled || v.ptLocked} onChange={t.pick} style={{ margin: "0", accentColor: "#0070E0" }} />
                        <span>{t.label}</span>
                      </label>
                    ))}
                  </div>
                  {v.ptTypeShow ? (
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "320px" }}>
                      <span style={label}>Device type</span>
                      <select value={v.ptType} onChange={v.onPtType} disabled={v.ptLocked} style={{ height: "40px", borderRadius: "10px", border: "1px solid #D5DBE4", padding: "0 10px", fontFamily: "Poppins,sans-serif", fontSize: "13.5px", color: "#1A1E26", background: v.ptLocked ? "#F1F3F7" : "#FFFFFF" }}>
                        {(v.ptTypes ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                  ) : null}
                  <span role="status" style={{ fontSize: "12px", color: v.ptTargetNoteFg || "#5A6675", lineHeight: "1.5", overflowWrap: "anywhere" }}>{v.ptTargetNote}</span>
                </fieldset>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
                  <label htmlFor="pt-notes" style={label}>Release notes <span style={{ textTransform: "none", letterSpacing: "0", fontWeight: "500" }}>(optional)</span></label>
                  <span aria-live="polite" style={{ fontSize: "12px", color: v.ptNotesCountFg, fontVariantNumeric: "tabular-nums" }}>{v.ptNotesCount}</span>
                </span>
                <Sx as="textarea" focus={{ borderColor: "#0070E0", boxShadow: "0 0 0 3px rgba(0,112,224,.14)", outline: "none" }} id="pt-notes" rows={3} aria-invalid={v.ptNotesInvalid} aria-describedby="pt-notes-hint pt-notes-err" placeholder="What changed in this patch. Sent in the e-mail to the customer." value={v.ptNotes} onChange={v.onPtNotes} disabled={v.ptLocked} style={{ minHeight: "76px", resize: "vertical", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: v.ptNotesBorder, padding: "10px 14px", fontFamily: "Poppins,sans-serif", fontSize: "13.5px", lineHeight: "1.5", color: "#1A1E26", background: v.ptLocked ? "#F1F3F7" : "#FFFFFF" }} />
                <span id="pt-notes-hint" style={{ fontSize: "12px", color: "#5A6675" }}>Up to 2000 characters.</span>
                <span id="pt-notes-err" role="alert" style={{ display: v.ptNotesErr ? "block" : "none", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>{v.ptNotesErr}</span>
              </div>
            </section>
          ) : null}

          {v.ptGuideShow ? (
            <section aria-labelledby="pt-guide-h" style={{ flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <h4 id="pt-guide-h" style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Guide file{' '}<span aria-hidden="true" style={{ color: "#B21E1E" }}>*</span></h4>
                <span id="pt-guide-hint" style={{ fontSize: "12px", color: "#5A6675" }}>{v.ptGuideHint}</span>
              </div>
              {v.ptGuide ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderRadius: "12px", border: "1px solid #D6E6FA", background: "#F2F7FE" }}>
                  <span aria-hidden="true" style={{ color: "#005BB8", display: "flex" }}><Icon d={DOC} size={22} /></span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span title={v.ptGuide.name} style={{ fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.ptGuide.name}</span>
                    <span style={{ fontSize: "12px", color: "#5A6675" }}>{v.ptGuide.size} · attached to the e-mail and listed first on the Patches tab</span>
                  </span>
                  <Sx as="button" type="button" hover={{ background: "#FEECEC", color: "#B21E1E" }} onClick={v.ptGuideRemove} aria-label={'Remove the guide ' + v.ptGuide.name} style={{ width: "32px", height: "32px", border: "0", borderRadius: "8px", background: "transparent", color: "#5A6675", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: "0" }}>
                    <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" size={15} sw="2.2" />
                  </Sx>
                </div>
              ) : (
                <Sx as="label" hover={{ borderColor: "#0070E0", backgroundColor: "#F6F8FB" }} htmlFor="pt-guide" style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", padding: "14px 16px", borderRadius: "12px", borderWidth: "1.5px", borderStyle: "dashed", borderColor: v.ptGuideBorder || "#C9D2DE", background: "#FFFFFF", cursor: "pointer" }}>
                  <span aria-hidden="true" style={{ color: "#0070E0", display: "flex" }}><Icon d={DOC} size={22} /></span>
                  <span style={{ flex: "1 1 220px", fontSize: "13px", color: "#5A6675", lineHeight: "1.5" }}>How to install this patch on the box, by hand. Its last step should run <code style={{ fontSize: "12px" }}>sudo saras-patch completed {v.ptGuideVersion || 'VERSION'}</code>, so the box reports it.</span>
                  <span aria-hidden="true" style={{ height: "36px", display: "inline-flex", alignItems: "center", padding: "0 14px", borderRadius: "10px", border: "1px solid #D5DBE4", background: "#FFFFFF", color: "#1A1E26", fontSize: "13.5px", fontWeight: "600", whiteSpace: "nowrap" }}>Choose guide</span>
                  <input id="pt-guide" type="file" accept=".pdf,.docx,.txt,.md" aria-label="Choose the guide file" aria-describedby="pt-guide-hint pt-guide-err" onChange={v.ptGuidePick} style={{ position: "absolute", width: "1px", height: "1px", opacity: "0", overflow: "hidden", pointerEvents: "none" }} />
                </Sx>
              )}
              <span id="pt-guide-err" role="alert" style={{ display: v.ptGuideErr ? "block" : "none", fontSize: "12px", fontWeight: "500", color: "#B21E1E" }}>{v.ptGuideErr}</span>
            </section>
          ) : null}

          {v.ptFilesShow ? (
            <section aria-labelledby="pt-up" style={{ flexShrink: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <h4 id="pt-up" style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Patch files</h4>
                <span id="pt-up-hint" style={{ fontSize: "12px", color: "#5A6675" }}>{v.ptFilesHint}</span>
              </div>
              {v.dzShow ? (
                <Sx as="label" hover={{ borderColor: "#0070E0", backgroundColor: "#F6F8FB" }} active={{ backgroundColor: "#EEF2F7" }} htmlFor="pt-file" data-dropzone="1" onDragEnter={v.dzEnter} onDragOver={v.dzOver} onDragLeave={v.dzLeave} onDrop={v.dzDrop} style={{ position: "relative", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: v.dzPad, borderRadius: "14px", borderWidth: "1.5px", borderStyle: v.dzStyle, borderColor: v.dzBorder, background: v.dzBg, boxShadow: v.dzShadow, cursor: "pointer", transition: "border-color .16s,background-color .16s,box-shadow .16s" }}>
                  <span aria-hidden="true" style={{ width: "52px", height: "52px", borderRadius: "14px", background: v.dzTileBg, color: v.dzTileFg, border: `1px solid ${v.dzTileBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0", transition: "background-color .16s,color .16s" }}>
                    <Icon d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" size={24} />
                  </span>
                  <span style={{ flex: "1 1 220px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "#1A1E26" }}>{v.dzTitle}</span>
                    <span style={{ fontSize: "13px", color: "#5A6675", lineHeight: "1.5" }}>{v.dzSub}</span>
                  </span>
                  <span aria-hidden="true" style={{ height: "40px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 16px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#D5DBE4", background: "#FFFFFF", color: "#1A1E26", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: "0" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0070E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <span>Browse files</span>
                  </span>
                  <input id="pt-file" type="file" multiple={true} aria-label="Add patch files" aria-describedby="pt-up-hint pt-file-err" onChange={v.dzPick} style={{ position: "absolute", width: "1px", height: "1px", opacity: "0", overflow: "hidden", pointerEvents: "none" }} />
                </Sx>
              ) : null}
              <span id="pt-file-err" role="alert" style={{ display: v.ptFilesErr ? "block" : "none", fontSize: "12px", fontWeight: "500", color: v.ptFilesErrFg }}>{v.ptFilesErr}</span>
              <ul role="list" aria-label="Patch files" style={{ listStyle: "none", margin: "0", padding: "0", display: v.upListDisplay, flexDirection: "column", gap: "8px" }}>
                {(v.upFiles ?? []).map(u => (
                  <li key={u.key} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderRadius: "12px", border: "1px solid #E4E9F0", background: "#FFFFFF", boxShadow: "0 2px 8px -6px rgba(16,42,84,.18)" }}>
                    <span aria-hidden="true" style={{ position: "relative", width: "36px", height: "42px", borderRadius: "6px 12px 6px 6px", background: u.tileBg, color: u.tileFg, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "7px", flexShrink: "0", fontSize: "10px", fontWeight: "600", letterSpacing: ".3px" }}>{u.ext}</span>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <span title={u.name} style={{ fontSize: "13.5px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</span>
                        <span style={{ fontSize: "12px", color: u.stateFg, fontWeight: "600", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{u.state}</span>
                      </div>
                      {u.barShow ? (
                        <span role="progressbar" aria-label={'Upload of ' + u.name} aria-valuemin="0" aria-valuemax="100" aria-valuenow={parseInt(u.pctW, 10)} style={{ height: "6px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                          <span style={{ display: "block", height: "100%", width: u.pctW, borderRadius: "999px", background: u.barBg, transition: "width .2s" }} />
                        </span>
                      ) : null}
                      <span style={{ fontSize: "12px", color: u.metaFg, fontVariantNumeric: "tabular-nums" }}>{u.meta}</span>
                    </div>
                    {u.removeShow ? (
                      <Sx as="button" type="button" hover={{ background: "#FEECEC", color: "#B21E1E" }} onClick={u.remove} aria-label={u.removeAria} style={{ width: "32px", height: "32px", border: "0", borderRadius: "8px", background: "transparent", color: "#5A6675", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: "0" }}>
                        <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" size={15} sw="2.2" />
                      </Sx>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {v.ptRecipShow ? (
            <section aria-labelledby="pt-who" style={{ flexShrink: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 id="pt-who" style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Who will be e-mailed</h4>
              {v.ptRecipNone ? (
                <div role="note" style={note("#8A5200", "#FEF6EA", "#F4DDB8")}>
                  <Icon d={WARN} />
                  <span>No software contacts or client contact e-mails are set for these boxes. Add them in Settings (E-mail alerts, Users); you can still copy the download link.</span>
                </div>
              ) : (
                <ul role="list" aria-label="Contacts to e-mail" style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(v.ptRecips ?? []).map(r => (
                    <li key={r} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "#EEF2F7", color: "#1A1E26", fontSize: "13px", fontWeight: "500", maxWidth: "100%", overflowWrap: "anywhere" }}>
                      <span style={{ color: "#0070E0", display: "flex" }}><Icon d="M4 4h16v16H4zM4 6l8 7 8-7" size={13} /></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
              {v.ptMailNote ? (
                <div role="note" style={note("#005BB8", "#EEF4FC", "#CFE0F5")}>
                  <Icon d={INFO} />
                  <span>{v.ptMailNote}</span>
                </div>
              ) : null}
              {v.ptStorageErr ? (
                <div role="alert" style={note("#B21E1E", "#FEECEC", "#F5C2C2")}>
                  <Icon d={WARN} />
                  <span>{v.ptStorageErr}</span>
                </div>
              ) : null}
            </section>
          ) : null}

          {panel ? (
            <div role={v.ptPanel.kind === 'err' ? 'alert' : 'status'} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", borderRadius: "12px", background: panel.bg, border: `1px solid ${panel.border}`, color: panel.fg }}>
              {v.ptPanel.kind === 'busy' ? (
                <span aria-hidden="true" style={{ width: "18px", height: "18px", marginTop: "2px", borderRadius: "50%", border: "2.5px solid rgba(0,112,224,.25)", borderTopColor: "#0070E0", animation: "spin .8s linear infinite", flexShrink: "0" }} />
              ) : (
                <span style={{ marginTop: "1px", display: "flex" }}><Icon d={v.ptPanel.kind === 'ok' ? 'M20 6 9 17l-5-5' : WARN} size={18} sw="2.4" /></span>
              )}
              <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                <span style={{ fontSize: "14.5px", fontWeight: "600", overflowWrap: "anywhere" }}>{v.ptPanel.title}</span>
                <span style={{ fontSize: "13px", lineHeight: "1.5", color: "#1A1E26" }}>{v.ptPanel.text}</span>
              </span>
            </div>
          ) : null}

          {v.ptResult ? (
            <ul role="list" aria-label="Uploaded patch" style={{ listStyle: "none", margin: "0", padding: "0" }}>
              <PatchCard p={v.ptResult} expanded={true} />
            </ul>
          ) : null}

          {(v.ptHistory ?? []).length ? (
            <section aria-labelledby="pt-hist" style={{ flexShrink: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 id="pt-hist" style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Earlier patches</h4>
              <PatchRows rows={v.ptHistory} label="Earlier patches" />
            </section>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 24px", borderTop: "1px solid #E4E9F0", background: "#FBFCFD" }}>
          {v.ptErrShow ? (
            <div role="alert" style={note("#B21E1E", "#FEECEC", "#F5C2C2")}>
              <Icon d={WARN} />
              <span>{v.ptErr}</span>
            </div>
          ) : null}
          {v.ptStopAsk ? (
            <div role="alertdialog" aria-labelledby="pt-stop-q" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "10px 14px", borderRadius: "12px", background: "#FEF6EA", border: "1px solid #F4DDB8" }}>
              <span id="pt-stop-q" style={{ flex: "1 1 240px", fontSize: "13.5px", fontWeight: "600", color: "#8A5200" }}>Upload in progress — Stop upload?</span>
              <Sx as="button" type="button" hover={{ filter: "brightness(1.06)" }} onClick={v.ptStop} style={{ height: "40px", padding: "0 16px", border: "0", borderRadius: "10px", background: "#DC2626", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}>Stop</Sx>
              <Sx as="button" type="button" id="pt-keep" hover={{ background: "#F6F8FB" }} onClick={v.ptKeep} style={{ height: "40px", padding: "0 16px", borderRadius: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: "#E1E6EF", background: "#FFFFFF", color: "#1A1E26", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}>Keep uploading</Sx>
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "10px" }}>
            <div aria-live="polite" style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
              {v.ptStatus ? <span style={{ fontSize: "12.5px", color: "#5A6675", fontVariantNumeric: "tabular-nums" }}>{v.ptStatus}</span> : null}
              {v.ptProgShow ? (
                <span aria-hidden="true" style={{ height: "6px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: v.ptProgW, borderRadius: "999px", background: v.ptProgBg, transition: "width .2s" }} />
                </span>
              ) : null}
            </div>
            {(v.ptButtons ?? []).map((b, i) => (
              <Sx as="button" type="button" key={i} id={b.id} hover={b.disabled ? {} : b.kind === 'primary' ? { transform: "translateY(-1.5px)", boxShadow: "0 6px 16px -6px rgba(0,112,224,.45)" } : { background: b.kind === 'danger' ? "#FEECEC" : "#F6F8FB" }} onClick={b.fn} disabled={b.disabled} aria-disabled={b.disabled ? 'true' : 'false'} title={b.title || undefined}
                style={{ height: "46px", display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", borderRadius: "11px", fontSize: "14px", fontWeight: "600", cursor: b.disabled ? "not-allowed" : "pointer", transition: "transform .16s,box-shadow .16s", ...BTN[b.kind], ...(b.disabled && b.kind === 'primary' ? { background: "#B9C4D4" } : null) }}>
                {b.icon ? <Icon d={b.icon} sw="2.2" /> : null}
                <span>{b.label}</span>
              </Sx>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
