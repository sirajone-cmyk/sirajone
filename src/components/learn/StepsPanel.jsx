import React from "react";
import { C } from "../../design-system/tokens";

export default function StepsPanel({ steps, extra }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ border: `1px solid ${C.mintDark}`, borderRadius: 12, overflow: "hidden", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", backgroundColor: C.forestMid }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", width: 20, textAlign: "center" }}>{i + 1}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{s.label}</span>
          </div>
          <div style={{ padding: "10px 14px", backgroundColor: C.white }}>
            <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            {s.note && (
              <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "flex-start" }}>
                <span style={{ color: C.forestLight, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 11, color: C.forestMid, fontStyle: "italic", lineHeight: 1.5 }}>{s.note}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      {extra && (
        <div style={{ border: `1px solid ${C.goldBorder}`, borderRadius: 12, overflow: "hidden", marginTop: 14 }}>
          <div style={{ padding: "9px 14px", backgroundColor: C.goldLight }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.goldDark, margin: 0 }}>{extra.title}</p>
          </div>
          <div style={{ padding: "10px 14px", backgroundColor: "#fffdf5" }}>
            {extra.lines.map((l, i) => (
              <p key={i} style={{ fontSize: 12, color: C.goldDark, lineHeight: 1.65, margin: 0, marginBottom: i < extra.lines.length - 1 ? 6 : 0 }}>{l}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
