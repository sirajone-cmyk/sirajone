import React from "react";
import { C } from "../design-system/tokens";
import {
  MAKHAARIJ_GROUPS,
  SIFAAT_LAZIMAH_PAIRS,
  SIFAAT_LAZIMAH_SINGLE,
  SIFAAT_ARIDA,
} from "../data/tajweedData";
import GuideSection from "../components/guide/GuideSection";

export default function GuidePage() {
  return (
    <div style={{ padding: "14px 14px 8px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ backgroundColor: C.forest, borderRadius: 16, padding: "18px 20px", marginBottom: 16, textAlign: "center" }}>
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: C.mintDark, textTransform: "uppercase", margin: "0 0 6px" }}>Tajweed Reference</p>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: "0 0 4px" }}>Tajweed Guide</h2>
        <p style={{ fontSize: 12, color: C.mint, margin: 0 }}>Makharij · Sifaat Lazimah · Sifaat Aridah</p>
      </div>

      <GuideSection title="What is a Makhraj?">
        <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.75, margin: "0 0 14px" }}>
          A <strong>Makhraj</strong> is the precise point of articulation, the exact location in your mouth, throat, or lips from which a specific Arabic letter is produced. The plural is <strong>Makharij</strong>.
        </p>
        <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.75, margin: "0 0 14px" }}>
          Every Arabic letter has its own unique makhraj. Learning the correct makhraj is the foundation of Tajweed. If the origin point is wrong, the letter changes and meaning may be distorted.
        </p>
        <p style={{ fontSize: 11, fontWeight: 800, color: C.inkMuted, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 10px" }}>The 5 Makharij Groups</p>
        {MAKHAARIJ_GROUPS.map((g, i) => (
          <div key={i} style={{ border: `1px solid ${C.beigeBorder}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", backgroundColor: C.goldLight, borderBottom: `1px solid ${C.goldBorder}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.forest, margin: "0 0 2px", direction: "rtl", textAlign: "right" }}>{g.ar}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, margin: 0 }}>{g.en}</p>
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: C.white }}>
              <p style={{ fontSize: 12, color: C.forest, fontWeight: 700, margin: "0 0 6px", direction: "rtl", textAlign: "right", letterSpacing: 2 }}>{g.letters}</p>
              <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, margin: 0 }}>{g.desc}</p>
            </div>
          </div>
        ))}
      </GuideSection>

      <GuideSection title="What are Sifaat?">
        <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.75, margin: "0 0 12px" }}>
          <strong>Sifaat</strong> are the sound qualities of a letter, its characteristics beyond where it comes from. Two letters may share a makhraj but differ in sifaat, which changes how they sound.
        </p>
        <div style={{ backgroundColor: C.mint, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.mintDark}` }}>
          <p style={{ fontSize: 12, color: C.forest, lineHeight: 1.7, margin: 0 }}>
            <strong>Lazimah</strong> - Permanent qualities always present in the letter.<br />
            <strong>Aridah</strong> - Temporary qualities that appear based on context.
          </p>
        </div>
      </GuideSection>

      <GuideSection title="Sifaat Lazimah - Paired Qualities">
        <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.65, marginBottom: 14, margin: "0 0 14px" }}>
          These 5 pairs are opposites. Every Arabic letter has one quality from each pair. Knowing which side a letter belongs to defines its sound.
        </p>
        {SIFAAT_LAZIMAH_PAIRS.map((pair, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              {[pair.s1, pair.s2].map((s, j) => (
                <div key={j} style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: `1px solid ${j === 0 ? C.forest : C.beigeBorder}`, backgroundColor: j === 0 ? C.forest : C.white }}>
                  <div style={{ padding: "8px 12px" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: j === 0 ? C.gold : C.ink, margin: "0 0 2px", direction: "rtl" }}>{s.ar}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: j === 0 ? C.white : C.inkMid, margin: "0 0 4px" }}>{s.en} · {s.meaning}</p>
                    <p style={{ fontSize: 11, color: j === 0 ? C.mint : C.inkLight, lineHeight: 1.5, margin: 0 }}>{s.exp}</p>
                  </div>
                  <div style={{ padding: "6px 12px 8px", backgroundColor: j === 0 ? "rgba(0,0,0,0.15)" : C.beigeCard, borderTop: `1px solid ${j === 0 ? "rgba(255,255,255,0.1)" : C.beigeBorder}` }}>
                    <p style={{ fontSize: 10, color: j === 0 ? C.mintDark : C.inkMuted, margin: 0, direction: "rtl", letterSpacing: 1.5, fontWeight: 600 }}>{j === 0 ? pair.l1 : pair.l2}</p>
                  </div>
                </div>
              ))}
            </div>
            {pair.between && (
              <div style={{ backgroundColor: C.goldLight, borderRadius: 10, padding: "8px 12px", border: `1px solid ${C.goldBorder}`, fontSize: 11, color: C.goldDark }}>
                <strong>{pair.between.en}</strong> - {pair.between.exp}
              </div>
            )}
          </div>
        ))}
      </GuideSection>

      <GuideSection title="Sifaat Lazimah - Unique Qualities">
        <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.65, marginBottom: 14, margin: "0 0 14px" }}>
          These 8 qualities have no opposite. Only specific letters carry them.
        </p>
        {SIFAAT_LAZIMAH_SINGLE.map((s, i) => (
          <div key={i} style={{ border: `1px solid ${C.beigeBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", backgroundColor: C.white, borderBottom: `1px solid ${C.beigeBorder}` }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.forest, direction: "rtl", width: 40, textAlign: "center" }}>{s.ar}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.inkMid, margin: "0 0 1px" }}>{s.en} - {s.meaning}</p>
                <p style={{ fontSize: 11, color: C.gold, fontWeight: 700, margin: 0, direction: "rtl", letterSpacing: 2 }}>{s.letters}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6, padding: "8px 14px", backgroundColor: C.beigeCard, margin: 0 }}>{s.exp}</p>
          </div>
        ))}
      </GuideSection>

      <GuideSection title="Sifaat Aridah - Contextual Qualities">
        <p style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.65, marginBottom: 14, margin: "0 0 14px" }}>
          These qualities are not fixed to a letter. They appear based on what comes before or after the letter in recitation.
        </p>
        {SIFAAT_ARIDA.map((s, i) => (
          <div key={i} style={{ border: `1px solid ${C.beigeBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ padding: "9px 14px", backgroundColor: C.white, borderBottom: `1px solid ${C.beigeBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.teal, direction: "rtl" }}>{s.ar}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.inkMid }}>{s.en}</span>
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: C.beigeCard }}>
              <p style={{ fontSize: 12, color: C.inkMid, lineHeight: 1.6, margin: "0 0 6px" }}>{s.exp}</p>
              <p style={{ fontSize: 11, color: C.teal, fontStyle: "italic", margin: 0 }}>e.g. {s.example}</p>
            </div>
          </div>
        ))}
      </GuideSection>

      <div style={{ height: 8 }} />
    </div>
  );
}
