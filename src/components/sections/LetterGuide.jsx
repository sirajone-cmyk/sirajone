import React, { useMemo, useState } from "react";
import { BookOpen, Mic, Play, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { usePlatform } from "../../state/PlatformContext";
import { Section } from "../layout/Section";
import { PageWrapper } from "../layout/PageWrapper";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { AudioPlayer } from "../platform/AudioPlayer";
import { Recorder } from "../platform/Recorder";

const TABS = [
  { key: "makhraj", label: "Makhraj" },
  { key: "sifaat", label: "Sifaat" },
  { key: "steps", label: "Steps" },
  { key: "diagram", label: "Diagram" },
  { key: "practice", label: "Practice" }
];

const LETTERS = [
  {
    id: "hamzah",
    audioKey: "1",
    letter: "أ",
    lessonTitle: "Hamzah Lesson",
    focusLabel: "Focus lesson: ء / أ",
    openLabel: "Open Hamzah Lesson",
    modalTitle: "Hamzah Lesson Workspace",
    lessonOf: "Letter 1 of 28",
    englishName: "Alif / Hamzah",
    arabicName: "الأَلِفُ / الهَمْزَةُ",
    makhrajTitle: "Makhraj — Articulation Point",
    makhraj: {
      lead: "Hamzah (ء) is a strong sound that comes from the deepest part of the throat.",
      madeBy: ["Closing the throat completely", "Then opening it suddenly to release the sound"],
      notes: [
        "It feels like a small “stop and release” in your throat.",
        "Alif (ا), when it comes after Hamzah, does not have its own sound.",
        "It only makes the Hamzah sound longer."
      ]
    },
    sifaatTitle: "Ṣifāt — Qualities of this Letter",
    sifaat: [
      { heading: "1. Jahr — جَهْرٌ", simple: "Voiced — the vocal cords vibrate when making this sound" },
      { heading: "2. Shiddah — شِدَّةٌ", simple: "The sound stops completely — full blockage before release" },
      { heading: "3. Istifāl — اِسْتِفَالٌ", simple: "The tongue stays low — this is a light (non-heavy) letter" },
      { heading: "4. Infitāḥ — اِنْفِتَاحٌ", simple: "The palate and tongue do not seal — the mouth is open" },
      {
        heading: "5. Iṣmāt — إِصْمَاتٌ",
        simple:
          "These letters are not usually used on their own at the beginning of root Arabic words, and are normally found with other letters"
      }
    ],
    stepsTitle: "Step-by-Step Placement Guide",
    steps: [
      {
        title: "Step 1 — Placement",
        text:
          "The throat tightens at its very lowest point — no tongue or lip movement is needed. The sound stops completely in the throat, then bursts out."
      },
      {
        title: "Step 2 — Airflow",
        text: "Air is completely blocked at the glottis (voice box opening), then suddenly released."
      },
      {
        title: "Step 3 — Teaching Note",
        text:
          "Imagine squeezing a tube completely shut, then letting it pop open. That is Hamzah — a full throat squeeze, then release. No tongue needed."
      }
    ],
    diagramLabel: "Makhraj Diagram — Alif / Hamzah أ",
    diagramSrc: "/hamzah-diagram.png",
    diagramAlt: "Hamzah makhraj diagram",
    audioLabel: "Hamzah - Official Audio"
  },
  {
    id: "ba",
    audioKey: "2",
    letter: "ب",
    lessonTitle: "Bā’ Lesson",
    focusLabel: "Focus lesson: ب",
    openLabel: "Open Bā’ Lesson",
    modalTitle: "Bā’ Lesson Workspace",
    lessonOf: "Letter 2 of 28",
    englishName: "Bā’",
    arabicName: "البَاء",
    makhrajTitle: "Makhraj — Articulation Point",
    makhraj: {
      lead: "Bā (ب)",
      detail: "Bā is a sound made by closing both lips completely, then opening them to release the sound.",
      madeBy: [
        "Bring both lips together tightly",
        "Stop the air inside",
        "Then open the lips quickly",
        "A clear “b” sound pops out"
      ],
      notes: ["It feels like a small pop from the lips."]
    },
    sifaatTitle: "Ṣifāt — Qualities of this Letter",
    sifaat: [
      { heading: "Jahr — جَهْرٌ", simple: "Voiced — the vocal cords vibrate when making this sound" },
      { heading: "Shiddah — شِدَّةٌ", simple: "Full blockage — sound stops completely at the lips then releases" },
      { heading: "Istifāl — اِسْتِفَالٌ", simple: "Tongue stays low — this is a light letter" },
      { heading: "Infitāḥ — اِنْفِتَاحٌ", simple: "Palate and tongue do not seal — mouth opens normally" },
      { heading: "Iṣmāt — إِصْمَاتٌ", simple: "Does not easily form Arabic root words by itself" },
      { heading: "Qalqalah — قَلْقَلَةٌ", simple: "When Bā has sukūn, it echoes/bounces as it is released" }
    ],
    stepsTitle: "Step-by-Step Placement Guide",
    steps: [
      {
        title: "Step 1 — Placement",
        text:
          "Both the upper and lower lip close completely and firmly. The tip of the tongue rests naturally — it does not move. The back of the throat stays open."
      },
      {
        title: "Step 2 — Airflow",
        text: "Air builds up behind the closed lips. When the lips open, the blocked air bursts out making the 'b' sound."
      },
      {
        title: "Step 3 — Teaching Note",
        text:
          "Press your two lips tightly together. Feel the air build up. Now pop them open — that 'b' pop is Bā. Try it gently: 'ba, ba, ba.'"
      }
    ],
    diagramLabel: "Makhraj Diagram — Bā ب",
    diagramSrc: "/ba-diagram.png",
    diagramAlt: "Bā makhraj diagram",
    audioLabel: "Bā - Official Audio"
  }
];

function LessonViewport({ tab, state, letter }) {
  if (tab === "makhraj") {
    return (
      <div className="hamzah-scroll-view">
        <h3 className="hamzah-view-title">{letter.makhrajTitle}</h3>
        <div className="hamzah-info-panel">
          <p>{letter.makhraj.lead}</p>
          {letter.makhraj.detail ? <p>{letter.makhraj.detail}</p> : null}
          {letter.makhraj.madeBy?.length ? (
            <>
              <p>{letter.id === "hamzah" ? "It is made by:" : null}</p>
              <ol>
                {letter.makhraj.madeBy.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </>
          ) : null}
          {letter.makhraj.notes?.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "sifaat") {
    return (
      <div className="hamzah-scroll-view">
        <h3 className="hamzah-view-title">{letter.sifaatTitle}</h3>
        <div className="hamzah-sifaat-grid">
          {letter.sifaat.map((item) => (
            <article key={item.heading} className="hamzah-sifah-card">
              <h4>{item.heading}</h4>
              <p>Simple meaning:</p>
              <p>{item.simple}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "steps") {
    return (
      <div className="hamzah-scroll-view">
        <h3 className="hamzah-view-title">{letter.stepsTitle}</h3>
        <div className="hamzah-steps-flow">
          {letter.steps.map((step) => (
            <article key={step.title} className="hamzah-step-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "diagram") {
    return (
      <div className="hamzah-scroll-view">
        <h3 className="hamzah-view-title">Diagram Area</h3>
        <div className="hamzah-diagram-panel">
          <p className="hamzah-diagram-label">{letter.diagramLabel}</p>
          <div className="hamzah-diagram-stage">
            <img src={letter.diagramSrc} alt={letter.diagramAlt} className="hamzah-diagram-cropped" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hamzah-scroll-view">
      <h3 className="hamzah-view-title">Practice</h3>
      <div className="hamzah-practice-panel">
        <p>Listen to the model pronunciation first, then record your own recitation and review it.</p>
        <p>This is a manual self-awareness practice loop.</p>
        <div className="hamzah-practice-grid">
          <AudioPlayer src={state.audioByLetter[letter.audioKey] || ""} label={letter.audioLabel} />
          <Recorder />
        </div>
      </div>
    </div>
  );
}

export function LetterGuideSection() {
  const { state } = usePlatform();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("makhraj");
  const [activeLetterId, setActiveLetterId] = useState("hamzah");

  const activeTab = useMemo(() => TABS.find((t) => t.key === tab) || TABS[0], [tab]);
  const activeLetterIndex = useMemo(() => LETTERS.findIndex((item) => item.id === activeLetterId), [activeLetterId]);
  const activeLetter = LETTERS[Math.max(activeLetterIndex, 0)] || LETTERS[0];

  const openLetter = (letterId) => {
    setActiveLetterId(letterId);
    setTab("makhraj");
    setOpen(true);
  };

  const goToLetter = (direction) => {
    const nextIndex = activeLetterIndex + direction;
    if (nextIndex < 0 || nextIndex >= LETTERS.length) return;
    setActiveLetterId(LETTERS[nextIndex].id);
    setTab("makhraj");
  };

  return (
    <Section id="letters" variant="pattern">
      <PageWrapper>
        <div className="hamzah-landing">
          <p className="section-eyebrow">Interactive Guide</p>
          <h2 className="section-title">Letter Lessons</h2>
          <p className="section-subtitle">Hamzah and Bā’ are now both available.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {LETTERS.map((letter) => (
            <Card className="hamzah-launcher" key={letter.id}>
              <div className="hamzah-launcher-main">
                <span className="hamzah-launcher-letter">{letter.letter}</span>
                <div>
                  <p className="hamzah-launcher-title">{letter.lessonOf}</p>
                  <p className="hamzah-launcher-sub">
                    {letter.englishName} | <span dir="rtl" lang="ar">{letter.arabicName}</span>
                  </p>
                </div>
              </div>
              <button type="button" className="hamzah-open-btn focus-ring" onClick={() => openLetter(letter.id)}>
                <BookOpen size={18} /> {letter.openLabel}
              </button>
            </Card>
          ))}
        </div>

        <Modal open={open} onClose={() => setOpen(false)} title={activeLetter.modalTitle} className="hamzah-workspace-modal">
          <div className="hamzah-workspace-shell">
            <header className="hamzah-workspace-hero">
              <span className="hamzah-hero-letter">{activeLetter.letter}</span>
              <p className="hamzah-hero-meta">{activeLetter.lessonOf}</p>
              <h3>{activeLetter.englishName}</h3>
              <p className="hamzah-hero-arabic" dir="rtl" lang="ar">
                {activeLetter.arabicName}
              </p>
            </header>

            <nav className="hamzah-tab-nav" aria-label={`${activeLetter.englishName} lesson navigation`}>
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`hamzah-tab-btn focus-ring ${item.key === activeTab.key ? "active" : ""}`}
                >
                  {item.key === "practice" ? (
                    <Mic size={14} />
                  ) : item.key === "diagram" ? (
                    <Waves size={14} />
                  ) : item.key === "makhraj" ? (
                    <Play size={14} />
                  ) : (
                    <span />
                  )}
                  {item.label}
                </button>
              ))}
            </nav>

            <section className="hamzah-workspace-content">
              <LessonViewport tab={activeTab.key} state={state} letter={activeLetter} />
            </section>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="hamzah-tab-btn focus-ring"
                onClick={() => goToLetter(-1)}
                disabled={activeLetterIndex <= 0}
                style={{ opacity: activeLetterIndex <= 0 ? 0.45 : 1 }}
              >
                <ChevronLeft size={14} /> Previous Letter
              </button>
              <button
                type="button"
                className="hamzah-tab-btn focus-ring"
                onClick={() => goToLetter(1)}
                disabled={activeLetterIndex >= LETTERS.length - 1}
                style={{ opacity: activeLetterIndex >= LETTERS.length - 1 ? 0.45 : 1 }}
              >
                Next Letter <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Modal>
      </PageWrapper>
    </Section>
  );
}
