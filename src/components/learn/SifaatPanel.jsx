import React from "react";
import { C } from "../../design-system/tokens";

export default function SifaatPanel({ sifaat }) {
  return (
    <div>
      {sifaat.map((s, i) => (
        <div key={i} style={{ border: `1px solid ${C.goldBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", backgroundColor: C.white, borderBottom: `1px solid ${C.goldBorder}` }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.amber, width: 22, textAlign: "center" }}>{i + 1}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.ink, direction: "rtl" }}>{s.arabic}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.inkMid, flex: 1 }}>{s.name}</span>
          </div>
          <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, padding: "8px 14px", backgroundColor: C.amberLight, margin: 0 }}>{s.exp}</p>
        </div>
      ))}
    </div>
  );
}
