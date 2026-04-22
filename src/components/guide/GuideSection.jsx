import React, { useState } from "react";
import { C } from "../../design-system/tokens";

export default function GuideSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: 10,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${C.beigeBorder}`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          backgroundColor: open ? C.forest : C.white,
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: open ? C.white : C.inkMid,
            textAlign: "left",
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 12, color: open ? C.mint : C.gold, fontWeight: 700 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && <div style={{ backgroundColor: C.beigeCard, padding: "14px 16px" }}>{children}</div>}
    </div>
  );
}
