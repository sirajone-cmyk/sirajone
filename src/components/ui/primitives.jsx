import React from "react";
import { C, UI } from "../../design-system/tokens";

const S = {
  card: {
    border: UI.cardBorder,
    borderRadius: 12,
    backgroundColor: C.white,
    boxShadow: UI.cardShadow,
  },
};

export function PageWrap({ children, maxWidth = UI.contentMax, padding = "14px 14px 90px" }) {
  return <div style={{ padding, maxWidth, margin: "0 auto" }}>{children}</div>;
}

export function HeroBlock({ title, subtitle, icon = "◉" }) {
  return (
    <div style={{ backgroundColor: C.forest, borderRadius: 14, padding: "16px 16px", marginBottom: 12, boxShadow: "0 10px 22px rgba(27,67,50,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", color: C.white, fontSize: 20 }}>{title}</h2>
          <p style={{ margin: 0, color: C.mint, fontSize: 12, lineHeight: 1.6 }}>{subtitle}</p>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center", color: C.white, fontSize: 13 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function SoftCard({ children, style = {} }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>;
}

export function PrimaryButton({ children, onClick, style = {}, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 12,
        padding: "13px 14px",
        color: C.white,
        fontWeight: 800,
        background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`,
        boxShadow: "0 8px 22px rgba(27,67,50,0.24)",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${C.goldBorder}`,
        cursor: "pointer",
        borderRadius: 12,
        padding: "13px 14px",
        color: C.goldDark,
        fontWeight: 800,
        backgroundColor: C.goldLight,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
