// =============================================================================
// PART TWO WORKBOOK DATA
// Source: The Guided Reciter — Part Two (Madrassatu Taḥsīnil Qurʾān)
// Audio: https://p2.trq.itvarsity.org/audio/page{XX}/{cellId}.mp3
// Lesson→Page map sourced from: https://p2.trq.itvarsity.org (index)
// =============================================================================
//
// ARABIC GRID STATUS:
//   Lesson 1  → ✅ Real Arabic (sourced from page04.html)
//   Lessons 2–23 → ⚠️  Skeleton placeholder (Arabic grid content is in the
//                       separate physical "Towards Reading the Quran Part 2"
//                       book by Lenasia Muslim Association — not the theory
//                       document. Replace each lesson's gridItems.arabicText
//                       values once the reading-book pages are available.)
// =============================================================================

const CELL_IDS = [
  'a1', 'a2', 'a3', 'a4',
  'b1', 'b2', 'b3', 'b4',
  'c1', 'c2', 'c3', 'c4',
  'd1', 'd2', 'd3', 'd4',
  'e1', 'e2', 'e3', 'e4',
  'f1', 'f2', 'f3', 'f4',
  'g1', 'g2', 'g3', 'g4',
];

// Maps lesson number → zero-padded page folder used in the audio path.
// Source: https://p2.trq.itvarsity.org (index page)
const LESSON_PAGE_MAP = {
  1:  '04',
  2:  '06',
  3:  '07',
  4:  '08',
  5:  '10',
  6:  '12',
  7:  '15',
  8:  '18',
  9:  '21',
  10: '24',
  11: '26',
  12: '28',
  13: '29',
  14: '30',
  15: '31',
  16: '32',
  17: '39',
  18: '40',
  19: '41',
  20: '42',
  21: '45',
  22: '46',
  23: '47',
};


// ---------------------------------------------------------------------------
// LESSON SUBTITLES — English topic name shown under the lesson header.
// ---------------------------------------------------------------------------
const LESSON_SUBTITLES = {
  2:  'Kasratain — The Double Kasrah',
  3:  'Fat-ḥatain — The Double Fatḥah',
  4:  'Revision — Murājaʿah (All Tanwīn & Sukūn)',
  5:  'Tashdīd — The Doubling Sign',
  6:  'Revision — Murājaʿah (Tanwīn & Tashdīd)',
  7:  'Alif Maddiyyah — The Long Ālif',
  8:  'Wāw Maddiyyah — The Long Wāw',
  9:  'Yāʼ Maddiyyah — The Long Yāʼ',
  10: 'Revision — Murājaʿah (All Three Madd Letters)',
  11: 'Lām in the Word Allāh',
  12: 'Alif Muqaddarah — The Hidden Alif',
  13: 'Yāʼ Muqaddarah — The Hidden Yāʼ',
  14: 'Wāw Muqaddarah — The Six Madd Letters',
  15: 'Revision — Murājaʿah (All Madd Rules)',
  16: 'Madd ul Muttaṣil & Madd ul Munfaṣil',
  17: 'Madd ul Lāzim — Mukhaffāf & Muthaqqal',
  18: 'Muqaṭṭaʿāt — Detached Opening Letters',
  19: 'Muqaṭṭaʿāt — Practice & Application',
  20: 'Rules of Waqf — Stopping',
  21: 'Madd ul ʿĀriḍ & Letter of Līn',
  22: 'Madd ul Līn Lāzim',
  23: 'Nūn Sākinah & Tanwīn — Five Rules',
};

// ---------------------------------------------------------------------------
// RULE TITLES — Short title displayed in the rule box.
// ---------------------------------------------------------------------------
const RULE_TITLES = {
  2:  'The Rule — Kasratain (◌ٍ)',
  3:  'The Rule — Fat-ḥatain (◌ً)',
  4:  'Revision — All Tanwīn & Sukūn Rules',
  5:  'The Rule — Tashdīd (◌ّ)',
  6:  'Revision — Tanwīn & Tashdīd',
  7:  'The Rule — Alif Maddiyyah',
  8:  'The Rule — Wāw Maddiyyah',
  9:  'The Rule — Yāʼ Maddiyyah',
  10: 'Revision — All Three Primary Madd Letters',
  11: 'The Rule — Lām in the Word Allāh (الله)',
  12: 'The Rule — Alif Muqaddarah (◌ٰ)',
  13: 'The Rule — Yāʼ Muqaddarah & Wāw Muqaddarah',
  14: 'Summary — The Six Madd Letters',
  15: 'Revision — All Madd, Lām Allāh & Tajwīd Rules',
  16: 'Madd ul Muttaṣil (Connected) & Madd ul Munfaṣil (Separated)',
  17: 'Madd ul Lāzim Mukhaffāf & Madd ul Lāzim Muthaqqal',
  18: 'The Rule — Muqaṭṭaʿāt (الحُرُوفُ المُقَطَّعَات)',
  19: 'Muqaṭṭaʿāt — Continued Practice',
  20: 'Rules of Waqf — Four Stopping Rules',
  21: 'Madd ul ʿĀriḍ lis-Sukūn & Letter of Līn',
  22: 'Madd ul Līn Lāzim — Compulsory Lĭn Madd',
  23: 'Nūn Sākinah & Tanwīn — Five Rules (Iẓhār, Idghām, Iqlāb, Ikfāʼ)',
};

// ---------------------------------------------------------------------------
// RULE EXPLANATIONS — Full instructional text extracted from the document.
// ---------------------------------------------------------------------------
const RULE_EXPLANATIONS = {
  2: `Kasratain is the second type of Tanwīn. It appears as two Kasrahs below a letter. Like Ḍammatain, it contains a hidden Nūn Sākinah — read the sound of the Kasrah, then add a clear "n" sound at the end. All three types of Tanwīn (Ḍammatain, Kasratain, Fat-ḥatain) carry a hidden Nūn Sākinah. The only difference is the vowel sound that comes before the "n". Examples: بِخَيْرٍ (Bikhayrin) | قَوْمٍ (Qawmin). Teacher's Tip: Revise Ḍammatain before introducing Kasratain. Emphasise that the hidden Nūn is the same in all three types — only the vowel changes.`,

  3: `Fat-ḥatain is the third type of Tanwīn. It appears as two Fatḥahs above a letter. It also contains a hidden Nūn Sākinah — read the Fatḥah sound, then add a clear "n" sound. Special rule: when stopping (Waqf) on a word with Fat-ḥatain, the "n" sound drops and the Alif sound extends. Fat-ḥatain is the ONLY Tanwīn that changes when you stop — this will be studied in detail in the Waqf lesson. Examples: قَلَمًا (Qalaman — when joining) | كَتَابًا → stop: Kitābā (Alif is sounded when stopping).`,

  4: `Revision of all rules covered so far: (1) Sukūn — cuts off the sound of a letter; it joins two letters together when reading. (2) Ḍammatain — double Ḍammah, hidden Nūn, "un" sound. (3) Kasratain — double Kasrah, hidden Nūn, "in" sound. (4) Fat-ḥatain — double Fatḥah, hidden Nūn, "an" sound; when stopping, the "n" drops and the Alif is sounded. Revise each rule carefully before reading. Read slowly, applying every rule correctly.`,

  5: `The Tashdīd doubles the letter — it is read twice. The first letter has a Sukūn (it is cut off, not sounded with a vowel). The second letter has a Ḥarakah (vowel) and is sounded fully. The two letters are joined together with strength — there is a noticeable emphasis. Special Rule: when Nūn (ن) or Mīm (م) carries a Tashdīd, it is read with Ghunnah (a nasal sound held for 2 ḥarakāt). Examples: إِنَّ (Inna — Nūn with Tashdīd + Ghunnah) | كُلٌّ (Kullun — Lām doubled) | رَبِّ (Rabbi — Bāʼ doubled).`,

  6: `Revision of all rules covered so far: (1) All three types of Tanwīn — Ḍammatain (◌ٌ), Kasratain (◌ٍ), Fat-ḥatain (◌ً) — and the Sukūn (Units 1–3). (2) Tashdīd — doubles a letter; the first is cut off (Sukūn), the second carries the vowel. When Nūn (ن) or Mīm (م) carries a Tashdīd, always add the Ghunnah (nasal hum for 2 counts). Revise each rule carefully before reading. Read slowly, applying every rule correctly.`,

  7: `When an Alif (ا) comes after a letter with a Fatḥah, it is called Alif Maddiyyah. No Hamzah or Sukūn follows it immediately. Stretch (pull) the sound for 2 ḥarakāt. The Alif itself carries no vowel — it is the letter of elongation. The three letters of Primary Madd are: Alif (ا) after Fatḥah, Wāw (و) after Ḍammah, Yāʼ (ي) after Kasrah. None of them carries a vowel of its own — they are pure elongation letters. Examples: مَا (Mā — 2 ḥarakāt) | نَار (Nār — fire) | صَلَاةٌ (Salāh — prayers).`,

  8: `When a Wāw (و) without a vowel comes after a letter with a Ḍammah, it is called Wāw Maddiyyah. No Hamzah or Sukūn follows it immediately. Stretch the sound for 2 ḥarakāt. Do not confuse it with a Wāw that carries its own vowel (وُ — a short "u" sound with no stretch). The distinction is visual — look for the absence of a vowel on the Wāw. Examples: نُوحٌ (Nūḥun — stretch the Wāw) | دُونَ (Dūna — below, besides) | يُؤْمِنُونَ (Yuʼminūna — they believe).`,

  9: `When a Yāʼ (ي) without a vowel comes after a letter with a Kasrah, it is called Yāʼ Maddiyyah. No Hamzah or Sukūn follows it immediately. Stretch the sound for 2 ḥarakāt. The three Madd letters are now complete: Alif (ا) after Fatḥah, Wāw (و) after Ḍammah, Yāʼ (ي) after Kasrah. None carries its own vowel. All are stretched for 2 ḥarakāt in Primary Madd. Examples: إِلَيْهِ (Ilayhi — stretch the Yāʼ) | فِيهِ (Fīhi — in it) | عَلَيْهِمْ (ʿAlayhim — upon them).`,

  10: `Revision of all three Primary Madd letters: (1) Alif Maddiyyah — ا after Fatḥah, stretch 2 ḥarakāt. (2) Wāw Maddiyyah — و after Ḍammah, stretch 2 ḥarakāt. (3) Yāʼ Maddiyyah — ي after Kasrah, stretch 2 ḥarakāt. None of the three Madd letters carries its own vowel sign. All are pure elongation letters. Revise each rule carefully before reading. Read slowly, applying every rule correctly.`,

  11: `The Lām in the Noble Name of Allāh changes according to the vowel that comes before it. If a Fatḥah (◌َ) or Ḍammah (◌ُ) comes before the Lām — read with a FULL MOUTH (Tafkhīm). The Lām sounds deep and full. If a Kasrah (◌ِ) comes before the Lām — read with an EMPTY MOUTH (Tarqīq). The Lām sounds light and thin. This rule applies ONLY to the word Allāh (الله). Examples: نَصْرُ اللَّهِ (Full mouth — Fatḥah before) | بِسْمِ اللَّهِ (Empty mouth — Kasrah before) | لِلَّهِ (Empty mouth — Kasrah before).`,

  12: `Alif Muqaddarah is a small superscript Alif (ٰ) — also called the dagger-Alif — written above a letter. It represents a hidden Alif that is not visibly written in full. It follows the same rules as Alif Maddiyyah — stretch for 2 ḥarakāt. No Hamzah or Sukūn follows it immediately. It is common in words like رَحْمُٰن and هُوٰ. Teacher's Tip: Students initially miss it because it is small. Have them circle or highlight every dagger-Alif they can find in a practice passage before reading — this builds the visual habit of spotting it.`,

  13: `Yāʼ Muqaddarah is a hidden Yāʼ Sākinah not visibly written. Wāw Muqaddarah is a hidden Wāw Sākinah not visibly written. Both follow the same rules as their visible counterparts — stretch for 2 ḥarakāt. They are identified by context and knowledge of the Qurʾānic text. In ALL six cases (written or hidden), the rule is the same: stretch for 2 ḥarakāt, as long as no Hamzah or Sukūn immediately follows. Teacher's Tip: Introduce Units 13–14 together as a pair. The six-letter summary table makes an excellent reference card.`,

  14: `Summary of all six Madd letters: (1) Alif Maddiyyah (ا) — after Fatḥah, stretch 2 ḥarakāt. (2) Wāw Maddiyyah (و) — after Ḍammah, stretch 2 ḥarakāt. (3) Yāʼ Maddiyyah (ي) — after Kasrah, stretch 2 ḥarakāt. (4) Alif Muqaddarah (ٰ) — dagger-Alif, same as Alif Maddiyyah. (5) Yāʼ Muqaddarah (hidden ي) — same as Yāʼ Maddiyyah. (6) Wāw Muqaddarah (hidden و) — same as Wāw Maddiyyah. In all six cases — written or hidden — the rule is the same: stretch for 2 ḥarakāt, as long as no Hamzah or Sukūn immediately follows.`,

  15: `Revision of all rules covered so far: (1) All six Madd letters — written and hidden: Alif, Wāw, Yāʼ, Alif Muqaddarah, Yāʼ Muqaddarah, Wāw Muqaddarah. (2) Lām in the word Allāh — full mouth (Fatḥah or Ḍammah before) or empty mouth (Kasrah before). (3) All Tanwīn rules — Ḍammatain, Kasratain, Fat-ḥatain — and Sukūn and Tashdīd. Revise each rule carefully before reading. Read slowly, applying every rule correctly.`,

  16: `Before studying Secondary Madd: if a Hamzah (ء) appears on top of another letter, read only the Hamzah — the letter beneath it is silent. RULE 1 — Madd ul Muttaṣil (Connected Madd): if a Hamzah appears AFTER a Madd letter IN THE SAME WORD — stretch for 4 ḥarakāt. "Muttaṣil" means connected. Examples: سَوَاءٌ | جَآءَ | يَشَآءُ. RULE 2 — Madd ul Munfaṣil (Separated Madd): if a Hamzah appears at the beginning of the NEXT WORD after a Madd letter — stretch for 4 ḥarakāt. "Munfaṣil" means separated. Examples: إِنَّا أَعْطَيْنَاكَ | بِمَا أَنْزَلَ.`,

  17: `RULE 1 — Madd ul Lāzim Mukhaffāf (Light Compulsory Madd): when a PERMANENT Sukūn appears DIRECTLY after a Madd letter — stretch for 6 ḥarakāt. "Lāzim" means compulsory — the stretch is fixed and cannot be shortened. "Mukhaffāf" means light — no Tashdīd follows. Example: آلْآنَ (ʾĀl-ʼāna). RULE 2 — Madd ul Lāzim Muthaqqal (Heavy Compulsory Madd): when a letter with Tashdīd appears DIRECTLY after a Madd letter — stretch for 6 ḥarakāt. "Muthaqqal" means heavy — a Tashdīd (doubled letter) follows. Example: وَلَا الضَّآلِّينَ (from Sūrah al-Fātiḥah). Both = 6 counts without exception.`,

  18: `Muqaṭṭaʿāt are the detached letters that appear at the beginning of certain Sūrahs. They are read letter by letter, pronouncing the full name of each letter. Many carry Madd ul Lāzim within the letter name — stretch for 6 ḥarakāt where applicable. Their meanings are known only to Allāh — we read them as they are without interpretation. Examples: صآد (Ṣād — 6 ḥarakāt, Sūrah 38) | قآف (Qāf — 6 ḥarakāt, Sūrah 50) | نون (Nūn — 6 ḥarakāt, Sūrah 68) | يس (Yā-Sīn — 2+6 ḥarakāt, Sūrah 36) | كهيعص (Kāf-Hā-Yā-ʿAin-Ṣād — Sūrah Maryam 19). Note: Madd ul Līn Lāzim occurs in only TWO places: كهيعص (19:1) and سق (42:2).`,

  19: `Continuation of Muqaṭṭaʿāt practice. Practise reading the detached opening letters from common Sūrahs, applying the correct Madd length for each. When a letter name contains a Madd letter followed by a permanent Sukūn or Tashdīd, Madd ul Lāzim applies — 6 ḥarakāt. Teacher's Tip: Students should know: (1) which letters are Muqaṭṭaʿāt, (2) how to spell out the letter name fully, (3) which ones carry Madd. Sūrah al-Baqarah opens with الم — an excellent daily practice.`,

  20: `When stopping (Waqf), four rules apply: (1) If the last letter has a ḥarakah (Fatḥah, Kasrah, or Ḍammah) — change it to Sukūn (silence). Example: لِلْعَالَمِينَ → final Nūn becomes Sukūn. (2) If the last letter has Fat-ḥatain (◌ً) — do not say the Nūn; sound the Alif instead. Example: كَتَابًا → stop: Kitābā. (3) If the last letter is a round Tāʼ (ة — Tāʼ Marbūṭah) — read it as Hāʼ (ه). Example: رَحْمَةٌ → stop: Raḥmah. (4) If stopping on a letter with Tashdīd — read only one letter (the doubled letter collapses). Example: الْحَقُّ → stop: al-Ḥaqq (single Qāf). Stopping signs: م (compulsory stop) | ط (normal stop) | ج (allowed) | لا (do not stop).`,

  21: `Madd ul ʿĀriḍ lis-Sukūn (Variable Madd): if a TEMPORARY Sukūn appears after a Madd letter when you STOP at the end of a word — this is Madd ul ʿĀriḍ. "ʿĀriḍ" means temporary — the Sukūn only occurs because you chose to stop. Three lengths are acceptable: Qaṣr (2), Tawassuṭ (4), or Ṭūl (6) ḥarakāt. Example: نَسْتَعِينُ → stop: 2/4/6 ḥarakāt on the Yāʼ. Letter of Līn: a Wāw (و) or Yāʼ (ي) without a vowel, coming after a Fatḥah. Examples: خَوْف | بَيْت. It is NOT stretched during normal reading. Madd Līn ʿĀriḍ: if you STOP on a word containing a Letter of Līn — the Madd activates: 2, 4, or 6 ḥarakāt.`,

  22: `Madd ul Līn Lāzim: if a PERMANENT Sukūn appears DIRECTLY after a Letter of Līn WITHIN THE SAME LETTER (in the Muqaṭṭaʿāt) — stretch for 6 ḥarakāt. This is the compulsory (Lāzim) form of Madd Līn. IMPORTANT: This rule occurs in only TWO places in the entire Qurʾān: (1) كهيعص — Kāf-Hā-Yā-ʿAin-Ṣād (Sūrah Maryam, 19:1) — 6 ḥarakāt on the ʿAin. (2) سق — Ṣād-Qāf (Sūrah al-Shūrā, 42:2) — 6 ḥarakāt on the ʿAin. Since this rule occurs only twice, students can memorise these two locations directly.`,

  23: `When Nūn Sākinah (نْ) or any Tanwīn (◌ً ◌ٍ ◌ٌ) is followed by another letter, one of five rules applies: (1) Iẓhār إِظْهَار — followed by a throat letter (ء هـ ع ح غ خ): read CLEARLY, no Ghunnah. Example: مَنْ عَمِلَ. (2) Idghām with Ghunnah إِدْغَام — followed by (و م ن ي): MERGE into the following letter + Ghunnah 2 ḥarakāt. Example: مِنْ وَلَدٍ. (3) Idghām without Ghunnah — followed by (ل or ر): MERGE completely, no nasal sound. Example: مِنْ رَبِّكَ. (4) Iqlāb إِقْلَاب — followed by (ب): CONVERT the Nūn/Tanwīn into a hidden Mīm + Ghunnah 2 ḥarakāt. Example: مِنْ بَعْدِ. (5) Ikfāʼ إِخْفَاء — followed by any of 15 letters (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك): CONCEAL the Nūn/Tanwīn + Ghunnah 2 ḥarakāt. Quick guide: Throat = clear. ينمو = merge. ل ر = merge no nasal. ب = convert. 15 letters = conceal.`,
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

// Produces: https://p2.trq.itvarsity.org/audio/page{XX}/{cellId}.mp3
const buildAudioUrl = (lessonNumber, cellId) => {
  const page = LESSON_PAGE_MAP[lessonNumber];
  return `https://p2.trq.itvarsity.org/audio/page${page}/${cellId}.mp3`;
};

// Builds gridItems for lessons 2–23.
// arabicText is '' — drop the real Arabic from the reading book into each cell.
const createGridItemsForLesson = (lessonNumber) =>
  CELL_IDS.map((cellId, index) => ({
    id: cellId,
    arabicText: '',
    isHighlighted: index % 4 === 3 && lessonNumber <= 6,
    audioUrl: buildAudioUrl(lessonNumber, cellId),
  }));

const createUnitLesson = (number) => ({
  id: `unit-${number}-lesson-${number}`,
  unitNumber: number,
  lessonNumber: number,
  title: `UNIT ${number} / LESSON ${number}`,
  subtitle: LESSON_SUBTITLES[number] || 'Part Two Reading Practice',
  rule: {
    title: RULE_TITLES[number] || 'Reading Practice',
    explanation: RULE_EXPLANATIONS[number] || 'Rule explanation will be added here.',
  },
  gridItems: createGridItemsForLesson(number),
});

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

export const partTwoWorkbookLessons = [

  // =========================================================================
  // LESSON 1 — UNIT 1: Sukūn & Ḍammatain
  // Arabic: ✅ Real content sourced from page04.html
  // =========================================================================
  {
    id: 'unit-1-lesson-1',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'UNIT 1 / LESSON 1',
    subtitle: 'THE TANWĪN — Ḍammatain (5 days)',
    rule: {
      title: 'The Rules of Sukūn (◌ۡ) & Ḍammatain (◌ٌ)',
      explanation:
        'SUKŪN: The Sukūn is a small oval that sits above a letter. It has two roles: (1) It cuts off the sound of the letter — the letter is read short and closed, with no vowel following it. (2) It joins two letters together when reading. Example: قُرْآن — the Rāʼ has a Sukūn; its sound closes cleanly. ḌAMMATAIN: Ḍammatain is the first type of Tanwīn (double vowel). It appears as two Ḍammahs stacked above a letter. It contains a hidden Nūn Sākinah — you hear the "n" sound, but do not see the letter Nūn written. Read the sound of the Ḍammah, then add a clear "n" sound at the end. Key Reminder: You can hear the Nūn sound in Tanwīn, but you do not see it written as a separate letter — it is hidden within the double vowel sign. Examples: قَلَمٌ (Qalamun — a pen) | كِتَابٌ (Kitābun — a book).',
    },
    gridItems: [
      // Row 1 — letter + Ḍammatain drill; all 4 cells share a1.mp3 (per HTML onclick)
      { id: 'a1', arabicText: 'دٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/a1.mp3' },
      { id: 'a2', arabicText: 'دُنْ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/a1.mp3' },
      { id: 'a3', arabicText: 'دٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/a1.mp3' },
      { id: 'a4', arabicText: 'دُ نْ', isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/a1.mp3' },

      // Row 2 — all 4 cells share b1.mp3
      { id: 'b1', arabicText: 'ةٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/b1.mp3' },
      { id: 'b2', arabicText: 'ةُ نْ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/b1.mp3' },
      { id: 'b3', arabicText: 'ةٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/b1.mp3' },
      { id: 'b4', arabicText: 'ةُ نْ', isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/b1.mp3' },

      // Row 3 — all 4 cells share c1.mp3
      { id: 'c1', arabicText: 'لٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/c1.mp3' },
      { id: 'c2', arabicText: 'لُنْ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/c1.mp3' },
      { id: 'c3', arabicText: 'لٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/c1.mp3' },
      { id: 'c4', arabicText: 'لُـنْ', isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/c1.mp3' },

      // Row 4 — all 4 cells share d1.mp3
      { id: 'd1', arabicText: 'مٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/d1.mp3' },
      { id: 'd2', arabicText: 'مُنْ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/d1.mp3' },
      { id: 'd3', arabicText: 'مٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/d1.mp3' },
      { id: 'd4', arabicText: 'مُنْ',  isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/d1.mp3' },

      // Row 5 — words, individual audio; HTML columns run RTL (e4 leftmost → e1 rightmost)
      { id: 'e1', arabicText: 'حَـدٌ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/e1.mp3' },
      { id: 'e2', arabicText: 'عِـلٌ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/e2.mp3' },
      { id: 'e3', arabicText: 'وَةٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/e3.mp3' },
      { id: 'e4', arabicText: 'ثِمٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/e4.mp3' },

      // Row 6 — words, individual audio
      { id: 'f1', arabicText: 'فِرٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/f1.mp3' },
      { id: 'f2', arabicText: 'رِضٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/f2.mp3' },
      { id: 'f3', arabicText: 'تِبٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/f3.mp3' },
      { id: 'f4', arabicText: 'ﺳِـﻊٌ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/f4.mp3' },

      // Row 7 — words, individual audio
      { id: 'g1', arabicText: 'رِ جٌ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/g1.mp3' },
      { id: 'g2', arabicText: 'نَنٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/g2.mp3' },
      { id: 'g3', arabicText: 'اَخٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/g3.mp3' },
      { id: 'g4', arabicText: 'رُءٌ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page04/g4.mp3' },
    ],
  },

  // =========================================================================
  // LESSON 2 — UNIT 2: Kasratain
  // Arabic: ✅ Real content sourced from page06.html
  // Audio note: rows a & b share a1.mp3 / b1.mp3 (per HTML onclick pattern)
  //             rows c–g have individual audio files
  // =========================================================================
  {
    id: 'unit-2-lesson-2',
    unitNumber: 2,
    lessonNumber: 2,
    title: 'UNIT 2 / LESSON 2',
    subtitle: LESSON_SUBTITLES[2],
    rule: {
      title: RULE_TITLES[2],
      explanation: RULE_EXPLANATIONS[2],
    },
    gridItems: [
      // Row 1 — letter + Kasratain drill; all 4 cells share a1.mp3
      { id: 'a1', arabicText: 'بٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/a1.mp3' },
      { id: 'a2', arabicText: 'بِنْ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/a1.mp3' },
      { id: 'a3', arabicText: 'بٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/a1.mp3' },
      { id: 'a4', arabicText: 'بِ نْ', isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/a1.mp3' },

      // Row 2 — all 4 cells share b1.mp3
      { id: 'b1', arabicText: 'رٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/b1.mp3' },
      { id: 'b2', arabicText: 'رِنْ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/b1.mp3' },
      { id: 'b3', arabicText: 'رٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/b1.mp3' },
      { id: 'b4', arabicText: 'رِ نْ', isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/b1.mp3' },

      // Row 3 — words, individual audio; HTML columns RTL (c4 leftmost → c1 rightmost)
      { id: 'c1', arabicText: 'سِقٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/c1.mp3' },
      { id: 'c2', arabicText: 'سِدٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/c2.mp3' },
      { id: 'c3', arabicText: 'رَ ةٍ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/c3.mp3' },
      { id: 'c4', arabicText: 'فِرٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/c4.mp3' },

      // Row 4
      { id: 'd1', arabicText: 'لَهَبٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/d1.mp3' },
      { id: 'd2', arabicText: 'شَىْءٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/d2.mp3' },
      { id: 'd3', arabicText: 'نَفْسٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/d3.mp3' },
      { id: 'd4', arabicText: 'بَعْضٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/d4.mp3' },

      // Row 5
      { id: 'e1', arabicText: 'قَوْمٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/e1.mp3' },
      { id: 'e2', arabicText: 'نَقْصٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/e2.mp3' },
      { id: 'e3', arabicText: 'نُسُكٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/e3.mp3' },
      { id: 'e4', arabicText: 'ظُلَلٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/e4.mp3' },

      // Row 6
      { id: 'f1', arabicText: 'دَيْنٍ',       isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/f1.mp3' },
      { id: 'f2', arabicText: 'يَوْمَىِٕـذٍ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/f2.mp3' },
      { id: 'f3', arabicText: 'زَوْجٍ',       isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/f3.mp3' },
      { id: 'f4', arabicText: 'مُسْمَـعٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/f4.mp3' },

      // Row 7
      { id: 'g1', arabicText: 'اَنْفٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/g1.mp3' },
      { id: 'g2', arabicText: 'وَسَطٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/g2.mp3' },
      { id: 'g3', arabicText: 'نَبَاٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/g3.mp3' },
      { id: 'g4', arabicText: 'بِهٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page06/g4.mp3' },
    ],
  },

  // =========================================================================
  // LESSON 3 — UNIT 3: Fat-hatain
  // Arabic: ✅ Real content sourced from page07.html
  // Audio note: rows a & b share a1.mp3 / b1.mp3 (per HTML onclick pattern)
  //             rows c–g have individual audio files
  // =========================================================================
  {
    id: 'unit-3-lesson-3',
    unitNumber: 3,
    lessonNumber: 3,
    title: 'UNIT 3 / LESSON 3',
    subtitle: LESSON_SUBTITLES[3],
    rule: {
      title: RULE_TITLES[3],
      explanation: RULE_EXPLANATIONS[3],
    },
    gridItems: [
      // Row 1 — all 4 cells share a1.mp3
      { id: 'a1', arabicText: 'وًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/a1.mp3' },
      { id: 'a2', arabicText: 'وَنْ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/a1.mp3' },
      { id: 'a3', arabicText: 'وًا',    isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/a1.mp3' },
      { id: 'a4', arabicText: 'وَ نْ',  isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/a1.mp3' },

      // Row 2 — all 4 cells share b1.mp3
      { id: 'b1', arabicText: 'قًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/b1.mp3' },
      { id: 'b2', arabicText: 'قَنْ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/b1.mp3' },
      { id: 'b3', arabicText: 'قًا',    isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/b1.mp3' },
      { id: 'b4', arabicText: 'قَنْ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/b1.mp3' },

      // Row 3 — mapped by clickable audio IDs from the HTML
      { id: 'c1', arabicText: 'كُفُوًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/c1.mp3' },
      { id: 'c2', arabicText: 'طَيْرًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/c2.mp3' },
      { id: 'c3', arabicText: 'مَرَضًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/c3.mp3' },
      { id: 'c4', arabicText: 'رِزْقًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/c4.mp3' },

      // Row 4
      { id: 'd1', arabicText: 'مَثَلًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/d1.mp3' },
      { id: 'd2', arabicText: 'رَغَدًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/d2.mp3' },
      { id: 'd3', arabicText: 'ثَمَنًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/d3.mp3' },
      { id: 'd4', arabicText: 'يَوْمًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/d4.mp3' },

      // Row 5
      { id: 'e1', arabicText: 'شَيْئًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/e1.mp3' },
      { id: 'e2', arabicText: 'رِجْزًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/e2.mp3' },
      { id: 'e3', arabicText: 'لَمْحًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/e3.mp3' },
      { id: 'e4', arabicText: 'نَفْسًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/e4.mp3' },

      // Row 6
      { id: 'f1', arabicText: 'بَغْيًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/f1.mp3' },
      { id: 'f2', arabicText: 'زَوْجَةً', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/f2.mp3' },
      { id: 'f3', arabicText: 'وَسَطًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/f3.mp3' },
      { id: 'f4', arabicText: 'جَنَفًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/f4.mp3' },

      // Row 7
      { id: 'g1', arabicText: 'مَلِكًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/g1.mp3' },
      { id: 'g2', arabicText: 'زَوْجًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/g2.mp3' },
      { id: 'g3', arabicText: 'لَعِبًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/g3.mp3' },
      { id: 'g4', arabicText: 'عِوَجًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page07/g4.mp3' },
    ],
  },

  // =========================================================================
  // LESSON 4 — UNIT 4: Revision (Murājaʿah — all Tanwīn & Sukūn)
  // Arabic: ✅ Real content sourced from page08.html
  // Audio: all 28 cells have individual audio files (pure revision, no shared rows)
  // =========================================================================
  {
    id: 'unit-4-lesson-4',
    unitNumber: 4,
    lessonNumber: 4,
    title: 'UNIT 4 / LESSON 4',
    subtitle: LESSON_SUBTITLES[4],
    rule: {
      title: RULE_TITLES[4],
      explanation: RULE_EXPLANATIONS[4],
    },
    gridItems: [
      // Row 1
      { id: 'a1', arabicText: 'ثَمَرَةٍ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/a1.mp3' },
      { id: 'a2', arabicText: 'رِجْسٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/a2.mp3' },
      { id: 'a3', arabicText: 'نَكِدًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/a3.mp3' },
      { id: 'a4', arabicText: 'وَلَدٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/a4.mp3' },

      // Row 2
      { id: 'b1', arabicText: 'خَطَأً',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/b1.mp3' },
      { id: 'b2', arabicText: 'سَفَرٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/b2.mp3' },
      { id: 'b3', arabicText: 'فِسْقٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/b3.mp3' },
      { id: 'b4', arabicText: 'ذَكَرٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/b4.mp3' },

      // Row 3
      { id: 'c1', arabicText: 'مَلَكٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/c1.mp3' },
      { id: 'c2', arabicText: 'عَيْنًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/c2.mp3' },
      { id: 'c3', arabicText: 'كَعَصْفٍ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/c3.mp3' },
      { id: 'c4', arabicText: 'قَوْلًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/c4.mp3' },

      // Row 4
      { id: 'd1', arabicText: 'رَيْبٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/d1.mp3' },
      { id: 'd2', arabicText: 'مِصْرًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/d2.mp3' },
      { id: 'd3', arabicText: 'عُمْىٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/d3.mp3' },
      { id: 'd4', arabicText: 'هُزُوًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/d4.mp3' },

      // Row 5
      { id: 'e1', arabicText: 'بُكْمٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/e1.mp3' },
      { id: 'e2', arabicText: 'بَعْضٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/e2.mp3' },
      { id: 'e3', arabicText: 'ذِكْرًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/e3.mp3' },
      { id: 'e4', arabicText: 'نَقْصٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/e4.mp3' },

      // Row 6
      { id: 'f1', arabicText: 'ضَرْ بًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/f1.mp3' },
      { id: 'f2', arabicText: 'نَفْسٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/f2.mp3' },
      { id: 'f3', arabicText: 'فِئَةٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/f3.mp3' },
      { id: 'f4', arabicText: 'عَدْلٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/f4.mp3' },

      // Row 7
      { id: 'g1', arabicText: 'قُرَيْشٍ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/g1.mp3' },
      { id: 'g2', arabicText: 'سَعْيًا',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/g2.mp3' },
      { id: 'g3', arabicText: 'سُنَنٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/g3.mp3' },
      { id: 'g4', arabicText: 'مَلِكًا',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page08/g4.mp3' },

      // ── Page 09 continuation (IDs prefixed p9 to avoid duplicates within lesson) ──
      // Row 1
      { id: 'p9a1', arabicText: 'اُخْتٌ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/a1.mp3' },
      { id: 'p9a2', arabicText: 'بَغَضَبٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/a2.mp3' },
      { id: 'p9a3', arabicText: 'عَهْدًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/a3.mp3' },
      { id: 'p9a4', arabicText: 'بَخَيْرٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/a4.mp3' },

      // Row 2
      { id: 'p9b1', arabicText: 'لَيْلَةً',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/b1.mp3' },
      { id: 'p9b2', arabicText: 'كُرْهٌ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/b2.mp3' },
      { id: 'p9b3', arabicText: 'بَيْـعٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/b3.mp3' },
      { id: 'p9b4', arabicText: 'يَوْمٌ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/b4.mp3' },

      // Row 3
      { id: 'p9c1', arabicText: 'خَيْرًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/c1.mp3' },
      { id: 'p9c2', arabicText: 'فَضْلٍ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/c2.mp3' },
      { id: 'p9c3', arabicText: 'فِدْيَةٌ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/c3.mp3' },
      { id: 'p9c4', arabicText: 'بِبَعْضٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/c4.mp3' },

      // Row 4
      { id: 'p9d1', arabicText: 'لِقَوْمٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/d1.mp3' },
      { id: 'p9d2', arabicText: 'جُزْءًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/d2.mp3' },
      { id: 'p9d3', arabicText: 'بَشَرٌ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/d3.mp3' },
      { id: 'p9d4', arabicText: 'اَذًى',      isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/d4.mp3' },

      // Row 5
      { id: 'p9e1', arabicText: 'بَسَخَطٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/e1.mp3' },
      { id: 'p9e2', arabicText: 'كَذِبًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/e2.mp3' },
      { id: 'p9e3', arabicText: 'هُدًى',      isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/e3.mp3' },
      { id: 'p9e4', arabicText: 'ضُحًى',      isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/e4.mp3' },

      // Row 6
      { id: 'p9f1', arabicText: 'زَيْـغٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/f1.mp3' },
      { id: 'p9f2', arabicText: 'اُمَمٍ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/f2.mp3' },
      { id: 'p9f3', arabicText: 'تَوْبَةً',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/f3.mp3' },
      { id: 'p9f4', arabicText: 'رَطْبٍ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/f4.mp3' },

      // Row 7
      { id: 'p9g1', arabicText: 'مُـخْرِ جٌ', isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/g1.mp3' },
      { id: 'p9g2', arabicText: 'شُعَيْبًا',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/g2.mp3' },
      { id: 'p9g3', arabicText: 'نَبَاٍ',     isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/g3.mp3' },
      { id: 'p9g4', arabicText: 'خَوْفًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/g4.mp3' },

      // Row 8
      { id: 'p9h1', arabicText: 'مَثَلًا',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/h1.mp3' },
      { id: 'p9h2', arabicText: 'لِبَلَدٍ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/h2.mp3' },
      { id: 'p9h3', arabicText: 'فَرْ حٌ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/h3.mp3' },
      { id: 'p9h4', arabicText: 'حَرَ جٍ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page09/h4.mp3' },
    ],
  },

  // =========================================================================
  // LESSON 5 — UNIT 5: Tashdīd
  // Arabic: ✅ Real content sourced from page10.html
  // Audio: only one file per row (a1–g1). All 4 cells in each row share it.
  //        col4 of every row is highlighted (red sukun span in HTML).
  // =========================================================================
  {
    id: 'unit-5-lesson-5',
    unitNumber: 5,
    lessonNumber: 5,
    title: 'UNIT 5 / LESSON 5',
    subtitle: LESSON_SUBTITLES[5],
    rule: {
      title: RULE_TITLES[5],
      explanation: RULE_EXPLANATIONS[5],
    },
    gridItems: [
      // Row 1 — all 4 cells share a1.mp3
      { id: 'a1', arabicText: 'رَبِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/a1.mp3' },
      { id: 'a2', arabicText: 'رَ بْبِ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/a1.mp3' },
      { id: 'a3', arabicText: 'رَبِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/a1.mp3' },
      { id: 'a4', arabicText: 'رَ بْبِ',  isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/a1.mp3' },

      // Row 2 — all 4 cells share b1.mp3
      { id: 'b1', arabicText: 'اِنَّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/b1.mp3' },
      { id: 'b2', arabicText: 'اِنْنَ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/b1.mp3' },
      { id: 'b3', arabicText: 'اِنَّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/b1.mp3' },
      { id: 'b4', arabicText: 'اِنْنَ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/b1.mp3' },

      // Row 3 — all 4 cells share c1.mp3
      { id: 'c1', arabicText: 'ﺛُـﻢَّ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/c1.mp3' },
      { id: 'c2', arabicText: 'ثُمْمَ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/c1.mp3' },
      { id: 'c3', arabicText: 'ثُمَّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/c1.mp3' },
      { id: 'c4', arabicText: 'ثُمْمَ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/c1.mp3' },

      // Row 4 — all 4 cells share d1.mp3
      { id: 'd1', arabicText: 'كُلُّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/d1.mp3' },
      { id: 'd2', arabicText: 'كُلْلُ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/d1.mp3' },
      { id: 'd3', arabicText: 'كُلُّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/d1.mp3' },
      { id: 'd4', arabicText: 'كُلْلُ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/d1.mp3' },

      // Row 5 — all 4 cells share e1.mp3
      { id: 'e1', arabicText: 'قَدِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/e1.mp3' },
      { id: 'e2', arabicText: 'قَدْدِ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/e1.mp3' },
      { id: 'e3', arabicText: 'قَدِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/e1.mp3' },
      { id: 'e4', arabicText: 'قَدْدِ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/e1.mp3' },

      // Row 6 — all 4 cells share f1.mp3
      { id: 'f1', arabicText: 'خَفَّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/f1.mp3' },
      { id: 'f2', arabicText: 'خَفْفَ',   isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/f1.mp3' },
      { id: 'f3', arabicText: 'خَفَّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/f1.mp3' },
      { id: 'f4', arabicText: 'خَفْفَ',   isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/f1.mp3' },

      // Row 7 — all 4 cells share g1.mp3
      { id: 'g1', arabicText: 'بِرِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/g1.mp3' },
      { id: 'g2', arabicText: 'بِرْ رِ',  isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/g1.mp3' },
      { id: 'g3', arabicText: 'بِرِّ',    isHighlighted: false, audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/g1.mp3' },
      { id: 'g4', arabicText: 'بِرْ رِ',  isHighlighted: true,  audioUrl: 'https://p2.trq.itvarsity.org/audio/page10/g1.mp3' },
    ],
  },

  // =========================================================================
  // LESSONS 6–23 — generated with real rules; arabicText = '' (awaiting HTML)
  // =========================================================================
  ...Array.from({ length: 18 }, (_, index) => createUnitLesson(index + 6)),
];
