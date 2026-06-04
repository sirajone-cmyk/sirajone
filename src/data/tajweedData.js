// Tajweed curriculum data
export const LETTERS = [
  {
    num: 1, arabic: "أ", name: "Hamzah",
    makhraj: {
      desc: "Hamzah (ء) is a strong sound that comes from the deepest part of the throat.",
      how: ["Closing the throat completely", "Then opening it suddenly to release the sound"],
      notes: [
        "It feels like a small “stop and release” in your throat.",
        "Alif (ا), when it comes after Hamzah, does not have its own sound.",
        "It only makes the Hamzah sound longer."
      ]
    },
    sifaat: [
      { arabic: "جَهْرٌ",      name: "Jahr",    exp: "Voiced — the vocal cords vibrate when making this sound" },
      { arabic: "شِدَّةٌ",     name: "Shiddah", exp: "The sound stops completely — full blockage before release" },
      { arabic: "اِسْتِفَالٌ", name: "Istifāl", exp: "The tongue stays low — this is a light (non-heavy) letter" },
      { arabic: "اِنْفِتَاحٌ", name: "Infitāḥ", exp: "The palate and tongue do not seal — the mouth is open" },
      { arabic: "إِصْمَاتٌ",   name: "Iṣmāt",   exp: "These letters are not usually used on their own at the beginning of root Arabic words, and are normally found with other letters" }
    ],
    steps: [
      { label: "Step 1 — Placement", desc: "The throat tightens at its very lowest point — no tongue or lip movement is needed. The sound stops completely in the throat, then bursts out." },
      { label: "Step 2 — Airflow", desc: "Air is completely blocked at the glottis (voice box opening), then suddenly released." },
      { label: "Step 3 — Teaching Note", desc: "Imagine squeezing a tube completely shut, then letting it pop open. That is Hamzah — a full throat squeeze, then release. No tongue needed." }
    ],
    extra: {
      title: "Diagram Area",
      image: "/hamzah-diagram.png",
      lines: []
    }
  },
  {
    num: 2, arabic: "ب", name: "Bāʼ",
    makhraj: {
      desc: "Bāʼ (ب) is pronounced from the two lips.",
      how: ["Bringing both lips together firmly", "Then releasing them to let the sound come out"],
      notes: ["The sound is formed at the meeting point of the lips (the wet part where they touch)"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",              exp: "The vocal cords vibrate when pronouncing Bāʼ." },
      { arabic: "شِدَّة",     name: "Shiddah — Complete Stoppage", exp: "The sound is completely stopped, then released." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",      exp: "The tongue remains low — no heaviness in the sound." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",             exp: "There is no sealing between the tongue and the palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                      exp: "Bāʼ is from the lighter letters in Arabic structure." }
    ],
    steps: [
      { label: "Placement",     desc: "Close both lips firmly." },
      { label: "Airflow",       desc: "Air is completely stopped behind the lips." },
      { label: "Release",       desc: "Open the lips suddenly to release the sound.", note: 'No air should leak before opening — it must be a clean "pop" sound.' },
      { label: "Teaching Note", desc: "Think of it as a full stop at the lips, then release." }
    ]
  },
  {
    num: 3, arabic: "ت", name: "Tāʼ",
    makhraj: {
      desc: "Tāʼ (ت) is pronounced from the tip of the tongue touching the gums of the upper front teeth.",
      how: ["Placing the tip of the tongue on the gumline just above the top front teeth", "Then releasing the sound"],
      notes: ["It is the same area as Nūn and Dāl, but the sound quality is different"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",        exp: 'Air flows clearly when pronouncing Tāʼ. You can hear a soft "h" sound with it.' },
      { arabic: "شِدَّة",     name: "Shiddah — Complete Stoppage", exp: "The sound is stopped completely, then released." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",      exp: "The tongue remains low — no heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",             exp: "The tongue does not press against the palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                      exp: "Tāʼ is from the lighter letters in Arabic structure." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip of the tongue on the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Stop the airflow completely." },
      { label: "Release",       desc: "Release the tongue quickly while letting air flow out clearly.", note: "You must hear the breath (Hams)." },
      { label: "Teaching Note", desc: 'Think of it as a dry, airy "t" sound — light with clear airflow.' }
    ]
  },
  {
    num: 4, arabic: "ث", name: "Thāʼ",
    makhraj: {
      desc: "Thāʼ (ث) is pronounced from the tip of the tongue touching the edges of the upper front teeth.",
      how: ["Placing the tip of the tongue lightly between the upper and lower front teeth", "Allowing air to flow out as the sound is produced"],
      notes: ["The tongue slightly comes out, not fully — just enough for the sound"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows clearly when pronouncing Thāʼ." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows — it is not stopped." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "The tongue remains low — no heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "There is no sealing between the tongue and the palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                  exp: "Thāʼ is from the lighter letters in Arabic structure." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip of the tongue lightly between the front teeth." },
      { label: "Airflow",       desc: "Allow air to flow continuously." },
      { label: "Sound",         desc: "Produce a soft, airy sound while the tongue remains in position." },
      { label: "Teaching Note", desc: 'Think of it as a gentle "th" sound (like in "think"), with continuous airflow.' }
    ]
  },
  {
    num: 5, arabic: "ج", name: "Jīm",
    makhraj: {
      desc: "Jīm (ج) is pronounced from the middle of the tongue touching the middle of the roof of the mouth (hard palate).",
      how: ["Raising the middle of the tongue to the middle of the palate", "Pressing slightly, then releasing the sound"],
      notes: ["The sound comes from the center of the mouth, not the throat or lips"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",              exp: "The vocal cords vibrate when pronouncing Jīm." },
      { arabic: "شِدَّة",     name: "Shiddah — Complete Stoppage", exp: "The sound is stopped, then released." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",      exp: "The tongue remains low — no heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",             exp: "No sealing between the tongue and the palate." },
      { arabic: "قَلْقَلَة",  name: "Qalqalah",                    exp: "When in a state of sukūn, Jīm produces a slight echo/bounce sound." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                      exp: "Jīm is from the lighter letters in Arabic structure." }
    ],
    steps: [
      { label: "Placement",     desc: "Raise the middle of the tongue to touch the middle of the palate." },
      { label: "Airflow",       desc: "Stop the airflow completely." },
      { label: "Release",       desc: "Release the sound clearly from the middle of the mouth." },
      { label: "Teaching Note", desc: "Think of it as a firm stop in the middle of the mouth, then release." }
    ]
  },
  {
    num: 6, arabic: "ح", name: "Ḥāʼ",
    makhraj: {
      desc: "Ḥāʼ (ح) is pronounced from the middle part of the throat.",
      how: ["Opening the throat", "Allowing air to flow out freely without any vibration"],
      notes: ["The sound is a pure breath from the middle of the throat"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows clearly — no voice is used." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound continues and flows — it is not stopped." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "The tongue remains low — no heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "There is no sealing between the tongue and the palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                  exp: "Ḥāʼ is from the lighter letters in Arabic structure." }
    ],
    steps: [
      { label: "Placement",     desc: "Open the middle part of the throat." },
      { label: "Airflow",       desc: "Allow air to flow freely from the throat." },
      { label: "Sound",         desc: "Produce a soft, breathy sound with no voice." },
      { label: "Teaching Note", desc: "Think of it as a warm breath coming from the throat." }
    ]
  },
  {
    num: 7, arabic: "خ", name: "Khāʼ",
    makhraj: {
      desc: "Khāʼ (خ) is pronounced from the upper part of the throat (closest to the mouth).",
      how: ["Narrowing the upper throat", "Allowing air to pass with friction"],
      notes: ["The sound is a rough, breathy sound from the top of the throat"]
    },
    sifaat: [
      { arabic: "هَمْس",        name: "Hams — Breath Sound",    exp: "Air flows — no voice is used." },
      { arabic: "رِخْوَة",      name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",  exp: "The tongue rises — the sound is heavy." },
      { arabic: "اِنْفِتَاح",   name: "Infitāḥ — Open",          exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",     name: "Iṣmāt",                   exp: "Khāʼ is from the letters of Iṣmāt." }
    ],
    steps: [
      { label: "Placement",     desc: "Use the upper throat, close to the mouth." },
      { label: "Airflow",       desc: "Allow air to pass with friction." },
      { label: "Sound",         desc: "Produce a heavy, rough breath sound." },
      { label: "Teaching Note", desc: "Think of it as a strong, scratchy breath from the throat." }
    ]
  },
  {
    num: 8, arabic: "د", name: "Dāl",
    makhraj: {
      desc: "Dāl (د) is pronounced from the tip of the tongue touching the gums of the upper front teeth.",
      how: ["Placing the tip of the tongue on the gumline", "Then releasing the sound"],
      notes: ["Same position as Tāʼ (ت), but without breath"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",              exp: "The vocal cords vibrate." },
      { arabic: "شِدَّة",     name: "Shiddah — Complete Stoppage", exp: "The sound is stopped, then released." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",      exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",             exp: "No sealing between tongue and palate." },
      { arabic: "قَلْقَلَة",  name: "Qalqalah",                    exp: "When in sukūn, it produces a slight bounce/echo." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip of the tongue on the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Stop the airflow completely." },
      { label: "Release",       desc: "Release the sound with voice, not breath." },
      { label: "Teaching Note", desc: 'Think of it as a firm "d" sound — no airflow.' }
    ]
  },
  {
    num: 9, arabic: "ذ", name: "Dhāl",
    makhraj: {
      desc: "Dhāl (ذ) is pronounced from the tip of the tongue touching the edges of the upper front teeth.",
      how: ["Placing the tongue lightly between the teeth", "Allowing sound to flow out"],
      notes: ["Same area as Thāʼ (ث), but voiced"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",          exp: "The vocal cords vibrate." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                  exp: "Dhāl is from the lighter letters." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tongue lightly between the front teeth." },
      { label: "Airflow",       desc: "Allow the sound to flow." },
      { label: "Sound",         desc: 'Produce a soft voiced "th" sound (like in "this").' },
      { label: "Teaching Note", desc: 'Think of it as a smooth, voiced "th" sound.' }
    ]
  },
  {
    num: 10, arabic: "ر", name: "Rāʼ",
    makhraj: {
      desc: "Rāʼ (ر) is pronounced from the tip of the tongue together with its sides touching the gums of the front four teeth.",
      how: ["Placing the tip and slight sides of the tongue against the gumline", "Allowing a light movement (tap) when pronouncing"],
      notes: ["The tongue knocks lightly against the palate"]
    },
    sifaat: [
      { arabic: "جَهْر",                  name: "Jahr — Voiced",                     exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",               name: "Tawassuṭ — Moderate",               exp: "The sound is between stoppage and flow." },
      { arabic: "تَكْرِيْر",              name: "Takrīr",                             exp: "The tongue naturally repeats or taps — must be controlled (not excessive)." },
      { arabic: "اِنْحِرَاف",             name: "Inḥirāf",                           exp: "The sound slightly leans or shifts along the tongue." },
      { arabic: "اِسْتِعْلَاء/اِسْتِفَال", name: "Istiʿlā / Istifāl (situational)", exp: "Rāʼ can be heavy or light depending on the surrounding vowels and letters." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip and sides of the tongue on the gumline of the front teeth." },
      { label: "Airflow",       desc: "Allow moderate flow — not fully stopped, not fully flowing." },
      { label: "Movement",      desc: "Let the tongue tap lightly once." },
      { label: "Teaching Note", desc: "Think of it as a controlled single tap of the tongue." }
    ]
  },
  {
    num: 11, arabic: "ز", name: "Zāy",
    makhraj: {
      desc: "Zāy (ز) is pronounced from the tip of the tongue touching the gums of the upper front teeth.",
      how: ["Placing the tongue in the same position as Sīn (س)", "Allowing sound to flow with voice"],
      notes: ["Same place as Sīn, but voiced"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",          exp: "The vocal cords vibrate." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "صَفِيْر",    name: "Ṣafīr",                  exp: "Produces a whistling sound." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tongue near the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Allow air to flow along the tongue." },
      { label: "Sound",         desc: "Produce a voiced, flowing sound with a slight whistle." },
      { label: "Teaching Note", desc: 'Think of it as a buzzing "z" sound.' }
    ]
  },
  {
    num: 12, arabic: "س", name: "Sīn",
    makhraj: {
      desc: "Sīn (س) is pronounced from the tip of the tongue near the gums of the upper front teeth.",
      how: ["Positioning the tongue close to the gumline", "Allowing air to pass with a narrow channel"],
      notes: ["The sound flows along the center of the tongue"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows clearly — no voice." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "صَفِيْر",    name: "Ṣafīr",                  exp: "Produces a clear whistling sound." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tongue near the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Allow air to flow through a narrow space." },
      { label: "Sound",         desc: "Produce a sharp, clear hissing sound." },
      { label: "Teaching Note", desc: 'Think of it as a sharp "sss" sound with a whistle.' }
    ]
  },
  {
    num: 13, arabic: "ش", name: "Shīn",
    makhraj: {
      desc: "Shīn (ش) is pronounced from the middle of the tongue touching the middle of the roof of the mouth (hard palate).",
      how: ["Raising the middle of the tongue toward the palate", "Allowing air to flow over it"],
      notes: ["Same area as Jīm (ج), but with flowing air"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows clearly — no voice." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "تَفَشِّي",   name: "Tafashshī",               exp: "The sound spreads in the mouth." }
    ],
    steps: [
      { label: "Placement",     desc: "Raise the middle of the tongue toward the palate." },
      { label: "Airflow",       desc: "Allow air to flow and spread." },
      { label: "Sound",         desc: 'Produce a soft "sh" sound that spreads in the mouth.' },
      { label: "Teaching Note", desc: 'Think of it as a wide, spreading "shhh" sound.' }
    ]
  },
  {
    num: 14, arabic: "ص", name: "Ṣād",
    makhraj: {
      desc: "Ṣād (ص) is pronounced from the tip of the tongue near the gums of the upper front teeth.",
      how: ["Positioning the tongue like Sīn", "Raising the back of the tongue to create heaviness"],
      notes: ["Same place as Sīn, but heavy"]
    },
    sifaat: [
      { arabic: "هَمْس",        name: "Hams — Breath Sound",    exp: "Air flows — no voice." },
      { arabic: "رِخْوَة",      name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",  exp: "The tongue rises — sound is heavy." },
      { arabic: "إِطْبَاق",     name: "Iṭbāq — Compression",    exp: "The tongue presses toward the palate." },
      { arabic: "صَفِيْر",      name: "Ṣafīr",                   exp: "A strong whistling sound is present." }
    ],
    steps: [
      { label: "Placement",       desc: "Place the tongue near the gumline of the upper front teeth." },
      { label: "Tongue Position", desc: "Raise the back of the tongue." },
      { label: "Airflow",         desc: "Allow air to flow with strength." },
      { label: "Teaching Note",   desc: 'Think of it as a heavy, deep "sss" sound.' }
    ]
  },
  {
    num: 15, arabic: "ض", name: "Ḍād",
    makhraj: {
      desc: "Ḍād (ض) is pronounced from the side of the tongue (usually left) touching the upper molars.",
      how: ["Pressing one side of the tongue against the upper back teeth", "Allowing sound to flow with heaviness"],
      notes: ["This is a unique and special articulation"]
    },
    sifaat: [
      { arabic: "جَهْر",        name: "Jahr — Voiced",          exp: "The vocal cords vibrate." },
      { arabic: "رِخْوَة",      name: "Rikhwah — Flowing Sound", exp: "The sound flows." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",  exp: "The tongue rises — sound is heavy." },
      { arabic: "إِطْبَاق",     name: "Iṭbāq — Compression",    exp: "Strong pressure toward the palate." },
      { arabic: "اِسْتِطَالَة", name: "Istiṭālah",               exp: "The sound stretches along the side of the tongue." }
    ],
    steps: [
      { label: "Placement",     desc: "Press the side of the tongue against the upper molars." },
      { label: "Airflow",       desc: "Allow sound to flow along the side." },
      { label: "Sound",         desc: "Produce a heavy, stretched sound." },
      { label: "Teaching Note", desc: "Think of it as a deep sound that spreads along the side of the tongue." }
    ]
  },
  {
    num: 16, arabic: "ط", name: "Ṭāʼ",
    makhraj: {
      desc: "Ṭāʼ (ط) is pronounced from the tip of the tongue touching the gums of the upper front teeth.",
      how: ["Placing the tip of the tongue on the gumline", "Raising the back of the tongue to create heaviness", "Then releasing the sound"],
      notes: ["Same place as Tāʼ (ت), but heavy and stronger"]
    },
    sifaat: [
      { arabic: "جَهْر",        name: "Jahr — Voiced",              exp: "The vocal cords vibrate." },
      { arabic: "شِدَّة",       name: "Shiddah — Complete Stoppage", exp: "The sound is stopped, then released." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",      exp: "The tongue rises — sound is heavy." },
      { arabic: "إِطْبَاق",     name: "Iṭbāq — Compression",        exp: "The tongue presses toward the palate." },
      { arabic: "قَلْقَلَة",    name: "Qalqalah",                    exp: "When in sukūn, it produces a strong bounce/echo." }
    ],
    steps: [
      { label: "Placement",       desc: "Place the tip of the tongue on the gumline of the upper front teeth." },
      { label: "Tongue Position", desc: "Raise the back of the tongue." },
      { label: "Airflow",         desc: "Stop the airflow completely." },
      { label: "Release",         desc: "Release with a strong, heavy sound." },
      { label: "Teaching Note",   desc: 'Think of it as a heavy, powerful "t" sound.' }
    ]
  },
  {
    num: 17, arabic: "ظ", name: "Ẓāʼ",
    makhraj: {
      desc: "Ẓāʼ (ظ) is pronounced from the tip of the tongue touching the edges of the upper front teeth.",
      how: ["Placing the tongue slightly between the teeth", "Raising the back of the tongue", "Allowing sound to flow"],
      notes: ["Same place as Dhāl (ذ), but heavy"]
    },
    sifaat: [
      { arabic: "جَهْر",        name: "Jahr — Voiced",          exp: "The vocal cords vibrate." },
      { arabic: "رِخْوَة",      name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",  exp: "The tongue rises — sound is heavy." },
      { arabic: "إِطْبَاق",     name: "Iṭbāq — Compression",    exp: "The tongue presses toward the palate." },
      { arabic: "إِصْمَات",     name: "Iṣmāt",                   exp: "Ẓāʼ is from the letters of Iṣmāt." }
    ],
    steps: [
      { label: "Placement",       desc: "Place the tongue lightly between the front teeth." },
      { label: "Tongue Position", desc: "Raise the back of the tongue." },
      { label: "Airflow",         desc: "Allow sound to flow with heaviness." },
      { label: "Teaching Note",   desc: 'Think of it as a heavy, deep "th" sound.' }
    ]
  },
  {
    num: 18, arabic: "ع", name: "ʿAyn",
    makhraj: {
      desc: "ʿAyn (ع) is pronounced from the middle of the throat.",
      how: ["Tightening the middle of the throat", "Producing a deep, voiced sound"],
      notes: ["The sound comes from inside the throat, not from the mouth"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",         exp: "The vocal cords vibrate strongly." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",   exp: "The sound is between stoppage and flow." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter", exp: "No heaviness like the heavy letters." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",        exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                 exp: "ʿAyn is from the letters of Iṣmāt." }
    ],
    steps: [
      { label: "Placement",     desc: "Use the middle part of the throat." },
      { label: "Airflow",       desc: "Allow controlled airflow with voice." },
      { label: "Sound",         desc: "Produce a deep, throaty sound." },
      { label: "Teaching Note", desc: "Think of it as a deep sound from inside the throat." }
    ]
  },
  {
    num: 19, arabic: "غ", name: "Ghayn",
    makhraj: {
      desc: "Ghayn (غ) is pronounced from the upper part of the throat (closest to the mouth).",
      how: ["Narrowing the upper throat", "Producing a voiced sound with friction"],
      notes: ["Same area as Khāʼ (خ), but with voice"]
    },
    sifaat: [
      { arabic: "جَهْر",        name: "Jahr — Voiced",          exp: "The vocal cords vibrate." },
      { arabic: "رِخْوَة",      name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",  exp: "The tongue rises — sound is heavy." },
      { arabic: "اِنْفِتَاح",   name: "Infitāḥ — Open",          exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",     name: "Iṣmāt",                   exp: "Ghayn is from the letters of Iṣmāt." }
    ],
    steps: [
      { label: "Placement",     desc: "Use the upper part of the throat." },
      { label: "Airflow",       desc: "Allow airflow with friction." },
      { label: "Sound",         desc: "Produce a heavy, voiced throat sound." },
      { label: "Teaching Note", desc: "Think of it as a deep, vibrating throat sound." }
    ]
  },
  {
    num: 20, arabic: "ف", name: "Fāʼ",
    makhraj: {
      desc: "Fāʼ (ف) is pronounced from the lower lip touching the edges of the upper front teeth.",
      how: ["Lightly placing the bottom lip against the top front teeth", "Allowing air to pass through"],
      notes: ["The contact is light, not tight"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows — no voice." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                  exp: "Fāʼ is from the lighter letters." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the lower lip lightly against the upper front teeth." },
      { label: "Airflow",       desc: "Allow air to flow through the gap." },
      { label: "Sound",         desc: 'Produce a soft "f" sound.' },
      { label: "Teaching Note", desc: "Think of it as a gentle airflow between lip and teeth." }
    ]
  },
  {
    num: 21, arabic: "ق", name: "Qāf",
    makhraj: {
      desc: "Qāf (ق) is pronounced from the back of the tongue touching the soft palate (back roof of the mouth).",
      how: ["Raising the back of the tongue", "Pressing against the soft palate", "Then releasing the sound"],
      notes: ["The sound comes from the deep back of the mouth"]
    },
    sifaat: [
      { arabic: "جَهْر",        name: "Jahr — Voiced",              exp: "The vocal cords vibrate." },
      { arabic: "شِدَّة",       name: "Shiddah — Complete Stoppage", exp: "The sound is stopped, then released." },
      { arabic: "اِسْتِعْلَاء", name: "Istiʿlā — Heavy Letter",      exp: "The tongue rises — sound is heavy." },
      { arabic: "اِنْفِتَاح",   name: "Infitāḥ — Open",             exp: "No sealing between tongue and palate." },
      { arabic: "قَلْقَلَة",    name: "Qalqalah",                    exp: "When in sukūn, it produces a strong echo/bounce." }
    ],
    steps: [
      { label: "Placement",     desc: "Raise the back of the tongue to the soft palate." },
      { label: "Airflow",       desc: "Stop the airflow completely." },
      { label: "Release",       desc: "Release with a strong, deep sound." },
      { label: "Teaching Note", desc: 'Think of it as a deep, powerful "q" sound from the back.' }
    ]
  },
  {
    num: 22, arabic: "ك", name: "Kāf",
    makhraj: {
      desc: "Kāf (ك) is pronounced from the back of the tongue touching the soft palate, slightly forward of Qāf (ق).",
      how: ["Raising the back of the tongue", "Touching the soft palate", "Then releasing the sound"],
      notes: ["Same area as Qāf, but slightly forward and lighter"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",        exp: "Air flows — no voice." },
      { arabic: "شِدَّة",     name: "Shiddah — Complete Stoppage", exp: "The sound is stopped, then released." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",      exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",             exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                      exp: "Kāf is from the lighter letters." }
    ],
    steps: [
      { label: "Placement",     desc: "Raise the back of the tongue slightly forward of Qāf." },
      { label: "Airflow",       desc: "Stop the airflow completely." },
      { label: "Release",       desc: "Release with a light, airy sound." },
      { label: "Teaching Note", desc: 'Think of it as a lighter "k" sound compared to Qāf.' }
    ]
  },
  {
    num: 23, arabic: "ل", name: "Lām",
    makhraj: {
      desc: "Lām (ل) is pronounced from the tip of the tongue touching the gums of the upper front teeth, with the sides of the tongue slightly open.",
      how: ["Placing the tip of the tongue on the gumline", "Allowing the sound to flow along the sides"],
      notes: ["The sound flows from the sides of the tongue"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",         exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",   exp: "The sound is between stoppage and flow." },
      { arabic: "اِنْحِرَاف", name: "Inḥirāf",               exp: "The sound leans and flows along the sides of the tongue." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter", exp: 'No heaviness (except in certain cases like "Allāh").' },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",        exp: "No sealing between tongue and palate." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip of the tongue on the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Allow sound to flow along the sides of the tongue." },
      { label: "Sound",         desc: "Produce a smooth, flowing sound." },
      { label: "Teaching Note", desc: "Think of it as a sound that slides along the sides of the tongue." }
    ]
  },
  {
    num: 24, arabic: "م", name: "Mīm",
    makhraj: {
      desc: "Mīm (م) is pronounced from the two lips closing together.",
      how: ["Closing both lips", "Allowing sound to resonate through the nose"],
      notes: ["The sound comes from the lips with nasal resonance"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",         exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",   exp: "The sound is between stoppage and flow." },
      { arabic: "غُنَّة",     name: "Ghunnah",               exp: "A nasal sound is present." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter", exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",        exp: "No sealing between tongue and palate." }
    ],
    steps: [
      { label: "Placement",     desc: "Close both lips." },
      { label: "Airflow",       desc: "Allow sound to pass through the nose." },
      { label: "Sound",         desc: "Produce a soft, nasal sound." },
      { label: "Teaching Note", desc: "Think of it as a closed-lip sound with a hum." }
    ]
  },
  {
    num: 25, arabic: "ن", name: "Nūn",
    makhraj: {
      desc: "Nūn (ن) is pronounced from the tip of the tongue touching the gums of the upper front teeth, slightly forward from Lām (ل).",
      how: ["Placing the tip of the tongue on the gumline", "Allowing sound to resonate through the nose"],
      notes: ["Same area as Lām, but with nasal sound (ghunnah)"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",         exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",   exp: "The sound is between stoppage and flow." },
      { arabic: "غُنَّة",     name: "Ghunnah",               exp: "A nasal sound is present." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter", exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",        exp: "No sealing between tongue and palate." }
    ],
    steps: [
      { label: "Placement",     desc: "Place the tip of the tongue on the gumline of the upper front teeth." },
      { label: "Airflow",       desc: "Allow sound to pass through the nose." },
      { label: "Sound",         desc: "Produce a clear nasal sound." },
      { label: "Teaching Note", desc: "Think of it as a tongue contact sound with a nasal hum." }
    ]
  },
  {
    num: 26, arabic: "هـ", name: "Hāʼ",
    makhraj: {
      desc: "Hāʼ (هـ) is pronounced from the deepest part of the throat.",
      how: ["Opening the throat", "Allowing pure breath to come out"],
      notes: ["It is the softest breath sound from the throat"]
    },
    sifaat: [
      { arabic: "هَمْس",      name: "Hams — Breath Sound",    exp: "Air flows — no voice." },
      { arabic: "رِخْوَة",    name: "Rikhwah — Flowing Sound", exp: "The sound flows continuously." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",  exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",         exp: "No sealing between tongue and palate." },
      { arabic: "إِصْمَات",   name: "Iṣmāt",                  exp: "Hāʼ is from the lighter letters." }
    ],
    steps: [
      { label: "Placement",     desc: "Open the deepest part of the throat." },
      { label: "Airflow",       desc: "Allow air to flow freely." },
      { label: "Sound",         desc: "Produce a very soft breath sound." },
      { label: "Teaching Note", desc: "Think of it as a gentle breath from deep in the throat." }
    ]
  },
  {
    num: 27, arabic: "و", name: "Wāw",
    makhraj: {
      desc: "Wāw (و) is pronounced from the two lips rounding and coming close together without fully closing.",
      how: ["Rounding the lips", "Allowing voiced air to pass through"],
      notes: ['The lips form an "O" shape — not closed']
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",                exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",          exp: "The sound is between stoppage and flow." },
      { arabic: "لِين",       name: "Līn — Soft (in certain cases)", exp: "A soft, smooth sound when in sukūn after fatḥah." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",        exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",               exp: "No sealing between tongue and palate." }
    ],
    steps: [
      { label: "Placement",     desc: 'Round the lips into an "O" shape.' },
      { label: "Airflow",       desc: "Allow voiced air to flow through." },
      { label: "Sound",         desc: "Produce a smooth, rounded sound." },
      { label: "Teaching Note", desc: 'Think of it as a rounded "oo" sound.' }
    ]
  },
  {
    num: 28, arabic: "ي", name: "Yāʼ",
    makhraj: {
      desc: "Yāʼ (ي) is pronounced from the middle of the tongue rising toward the middle of the roof of the mouth (hard palate).",
      how: ["Raising the middle of the tongue toward the palate", "Allowing the sound to flow smoothly"],
      notes: ["Same area as Jīm (ج) and Shīn (ش), but smooth and flowing"]
    },
    sifaat: [
      { arabic: "جَهْر",      name: "Jahr — Voiced",                exp: "The vocal cords vibrate." },
      { arabic: "تَوَسُّط",   name: "Tawassuṭ — Moderate",          exp: "The sound is between stoppage and flow." },
      { arabic: "لِين",       name: "Līn — Soft (in certain cases)", exp: "A soft sound when in sukūn after fatḥah." },
      { arabic: "اِسْتِفَال", name: "Istifāl — Light Letter",        exp: "No heaviness." },
      { arabic: "اِنْفِتَاح", name: "Infitāḥ — Open",               exp: "No sealing between tongue and palate." }
    ],
    steps: [
      { label: "Placement",     desc: "Raise the middle of the tongue toward the palate." },
      { label: "Airflow",       desc: "Allow sound to flow smoothly." },
      { label: "Sound",         desc: 'Produce a soft, smooth "y" sound.' },
      { label: "Teaching Note", desc: 'Think of it as a gentle "ee" glide sound.' }
    ]
  },
  {
    num: 29, arabic: "لا", name: "Lām-Alif",
    makhraj: {
      desc: "Lām-Alif (لا) is a combination of two letters: Lām (ل) + Alif (ا)",
      how: ["Pronouncing Lām from the tip of the tongue touching the gums of the upper front teeth", "Then flowing into Alif, which extends the sound"],
      notes: ["It is not a separate makhraj — it is a joined sound"]
    },
    sifaat: [
      { arabic: "ل", name: "Lām qualities", exp: 'Jahr (Voiced), Tawassuṭ (Moderate), Inḥirāf (sound flows along sides), Istifāl (Light — except in "Allāh"), Infitāḥ (Open).' },
      { arabic: "ا", name: "Alif qualities", exp: "No independent sound. Only lengthens the sound. Comes after a fatḥah." }
    ],
    steps: [
      { label: "Lām",           desc: "Place the tip of the tongue on the gumline." },
      { label: "Flow",          desc: "Allow the sound to flow smoothly." },
      { label: "Alif",          desc: "Stretch the sound for two counts." },
      { label: "Teaching Note", desc: 'Think of it as a flowing "laa" sound — tongue then stretch.' }
    ]
  }
];

// ════════════════════════════════════════════════════════════════════════════
// GUIDE REFERENCE DATA
// ════════════════════════════════════════════════════════════════════════════

export const MAKHAARIJ_GROUPS = [
  {
    ar: "الجَوْف", en: "Al-Jawf — The Cavity",
    letters: "Long vowels: ا  و  ي",
    desc: "These sounds come from the empty space deep in the throat. They only exist when a vowel is stretched."
  },
  {
    ar: "الحَلْق", en: "Al-Ḥalq — The Throat",
    letters: "أ هـ  |  ع ح  |  غ خ",
    desc: "Three points inside the throat: deepest (Hamzah, Hāʼ), middle (ʿAyn, Ḥāʼ), upper (Ghayn, Khāʼ)."
  },
  {
    ar: "اللِّسَان", en: "Al-Lisān — The Tongue",
    letters: "ق ك  /  ج ش ي  /  ض  /  ل ن ر  /  ط د ت  /  ث ذ ظ  /  ص ز س",
    desc: "The most detailed makhraj. Different parts of the tongue — from back to tip — produce 18 letters."
  },
  {
    ar: "الشَّفَتَان", en: "Ash-Shafatān — The Lips",
    letters: "ف  |  ب م و",
    desc: "Fāʼ uses lower lip + upper teeth. Bāʼ, Mīm, and Wāw use both lips (Wāw rounds without closing)."
  },
  {
    ar: "الخَيْشُوم", en: "Al-Khayshūm — The Nasal Passage",
    letters: "Ghunnah of نّ  and  مّ",
    desc: "Not a letter makhraj — it is the source of nasal resonance (Ghunnah) for Nūn and Mīm."
  },
];

export const SIFAAT_LAZIMAH_PAIRS = [
  {
    s1: { ar: "جَهْر", en: "Jahr", meaning: "Voiced", exp: "Vocal cords vibrate. A full, resonant sound." },
    s2: { ar: "هَمْس", en: "Hams", meaning: "Whispered", exp: "Vocal cords do not vibrate. Air flows freely." },
    l1: "ع ظ م و ز ج د ذ غ ب ر ق ي ن ل ض أ",
    l2: "ف ح ث هـ ش خ ص ت س ك"
  },
  {
    s1: { ar: "شِدَّة", en: "Shiddah", meaning: "Complete Stoppage", exp: "Sound stops fully at the articulation point, then releases." },
    s2: { ar: "رِخْوَة", en: "Rikhwah", meaning: "Flowing", exp: "Sound flows continuously without stopping." },
    between: { ar: "تَوَسُّط", en: "Tawassuṭ", exp: "Between stoppage and flow. Letters: ل ن ع م ر" },
    l1: "أ ج د ق ط ب ك ت",
    l2: "ح خ ذ ز ث ظ ف غ هـ ش ص ض و ي س"
  },
  {
    s1: { ar: "اِسْتِعْلَاء", en: "Istiʿlā", meaning: "Heavy/Elevated", exp: "Back of tongue rises toward palate. Creates a full, heavy sound." },
    s2: { ar: "اِسْتِفَال", en: "Istifāl", meaning: "Light/Lowered", exp: "Tongue stays low. Sound is thin and clear." },
    l1: "خ ص ض ط ظ غ ق  (7 letters)",
    l2: "All other letters"
  },
  {
    s1: { ar: "إِطْبَاق", en: "Iṭbāq", meaning: "Compression", exp: "Tongue presses upward toward palate. Creates a deep, compressed sound." },
    s2: { ar: "اِنْفِتَاح", en: "Infitāḥ", meaning: "Open", exp: "Tongue does not press toward palate. Sound is open and clear." },
    l1: "ص ض ط ظ  (4 letters)",
    l2: "All other letters"
  },
  {
    s1: { ar: "إِذْلَاق", en: "Idhālāq", meaning: "Easy Flow", exp: "Flows effortlessly from tongue tip or lips. Light articulation." },
    s2: { ar: "إِصْمَات", en: "Iṣmāt", meaning: "Restricted", exp: "Does not begin Arabic root words on its own. Heavier to articulate." },
    l1: "ف ر م ن ل ب  (6 letters)",
    l2: "All other letters"
  },
];

export const SIFAAT_LAZIMAH_SINGLE = [
  { ar: "صَفِيْر",    en: "Ṣafīr",      meaning: "Whistling",          exp: "A hissing/whistling sound is produced.",            letters: "س  ز  ص" },
  { ar: "قَلْقَلَة",  en: "Qalqalah",   meaning: "Echo-Bounce",        exp: "A slight bounce or echo when the letter has sukūn.", letters: "ق  ط  ب  ج  د" },
  { ar: "لِين",       en: "Līn",         meaning: "Softness",           exp: "Wāw or Yāʼ in sukūn after a fatḥah — smooth glide.", letters: "و  ي" },
  { ar: "اِنْحِرَاف", en: "Inḥirāf",    meaning: "Leaning",            exp: "Sound leans and slides along the tongue.",           letters: "ل  ر" },
  { ar: "تَكْرِيْر",  en: "Takrīr",     meaning: "Repetition",         exp: "Tongue tip vibrates naturally. Must be controlled.",  letters: "ر" },
  { ar: "تَفَشِّي",   en: "Tafashshī",  meaning: "Spreading",          exp: "Sound spreads widely across the mouth.",             letters: "ش" },
  { ar: "اِسْتِطَالَة",en: "Istiṭālah", meaning: "Lengthening",        exp: "Sound stretches along the full side of the tongue.", letters: "ض" },
  { ar: "غُنَّة",     en: "Ghunnah",    meaning: "Nasality",           exp: "Nasal resonance through the nose.",                  letters: "ن  م" },
];

export const SIFAAT_ARIDA = [
  { ar: "إِدْغَام",   en: "Idghām",   exp: "Merging one letter fully into the one that follows.", example: "مِن رَّبِّهِمْ  →  Nūn merges into Rāʼ" },
  { ar: "إِخْفَاء",   en: "Ikhfāʼ",  exp: "Hiding the Nūn or Mīm — nasalized without full merging.", example: "مِنْ قَبْلِ  →  Nūn hidden before Qāf" },
  { ar: "إِظْهَار",   en: "Iẓhār",   exp: "Pronouncing Nūn or Mīm clearly without nasality.", example: "مِنْ عَمَلٍ  →  Nūn clear before ʿAyn" },
  { ar: "إِقْلَاب",   en: "Iqlab",   exp: "Changing Nūn to a Mīm sound when followed by Bāʼ.", example: "مِنْ بَعْدِ  →  Nūn becomes Mīm sound" },
  { ar: "مَدّ",       en: "Madd",    exp: "Lengthening a vowel sound. The rules depend on the surrounding letters.", example: "Natural (2 beats) | Connected/Detached (4–6 beats)" },
  { ar: "تَفْخِيم",   en: "Tafkhīm", exp: "Making a sound heavy due to context (e.g., Rāʼ with fatḥah/ḍammah).", example: "رَبّ  →  Rāʼ is heavy" },
  { ar: "تَرْقِيق",   en: "Tarqīq",  exp: "Making a sound light due to context (e.g., Rāʼ with kasrah).", example: "رِبَا  →  Rāʼ is light" },
];

// ════════════════════════════════════════════════════════════════════════════
// CONTENT PANELS (Learn Page)
// ════════════════════════════════════════════════════════════════════════════



