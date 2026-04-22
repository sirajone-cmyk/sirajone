import React from "react";
import { C } from "../../design-system/tokens";

export default function MakhrajPanel({ data }) {
  const bdr = C.tealBorder;
  const bg = C.tealLight;
  return (
    <div>
      <p style={{ fontSize: 14, color: C.inkMid, lineHeight: 1.7, marginBottom: 16 }}>{data.desc}</p>
      <div style={{ backgroundColor: bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${bdr}`, marginBottom: 14 }}>
        <p style={{ fontSize: 10, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10, margin: "0 0 10px" }}>It is made by:</p>
        {data.how.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ color: C.teal, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>•</span>
            <span style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.55 }}>{h}</span>
          </div>
        ))}
      </div>
      {data.notes.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 8, backgroundColor: "#f0f7ff", borderRadius: 10, padding: "10px 12px", border: "1px solid #c7d9f0", marginBottom: 8, alignItems: "flex-start" }}>
          <span style={{ color: "#3b7fc4", fontSize: 14, flexShrink: 0, marginTop: 1 }}>➤</span>
          <p style={{ fontSize: 12, color: "#2a5f8f", fontStyle: "italic", lineHeight: 1.55, margin: 0 }}>{n}</p>
        </div>
      ))}
    </div>
  );
}
