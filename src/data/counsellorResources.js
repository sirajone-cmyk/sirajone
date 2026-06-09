/**
 * counsellorResources.js
 * Static resource data for the Counsellor Resource Centre.
 * Four categories: Prophetic Counselling, Khulafa al-Rashidun,
 * Classical Scholars, Professional Counselling.
 */

export const COUNSELLOR_RESOURCE_CATEGORIES = [
  {
    id: 'prophetic',
    title: 'Prophetic Counselling',
    subtitle: 'Sunnah of the Prophet ﷺ',
    arabic: 'السنة النبوية',
    icon: 'Star',
    colour: 'amber',
    description:
      'The Prophet ﷺ was the greatest counsellor humanity has ever known. These lessons draw from his method of listening, advising, and guiding with compassion.',
    lessons: [
      {
        id: 'p1',
        title: 'Listening Before Advising',
        summary:
          'The Prophet ﷺ always listened fully before offering guidance. He never interrupted or rushed to conclusions. True listening is itself a form of healing.',
        body: `The Prophet ﷺ would give his full attention to the person speaking. He would turn his entire body towards them, maintain eye contact, and wait until they had finished before responding.

This teaches us that the act of being truly heard is itself a gift. Many people come not seeking solutions but needing to feel understood. Our role is to create that space first.

Key practice: Before every counselling session, set a clear intention to listen without forming a response. Let silence be your tool.`,
        reference: 'Shama\'il al-Muhammadiyyah; Imam al-Tirmidhi',
      },
      {
        id: 'p2',
        title: 'Mercy and Compassion',
        summary:
          'Allah said: "We have sent you only as a mercy to the worlds." The Prophet\'s ﷺ manner was rooted in genuine care for every soul.',
        body: `Compassion is not softness — it is strength channelled with wisdom. The Prophet ﷺ would show concern for people's pain without dismissing it or rushing past it.

He once said: "Whoever does not show mercy to people, Allah will not show mercy to him." (Bukhari)

For the counsellor, this means: the client sitting before you is an amanah. Their pain is real. Your response must carry genuine care, not professional detachment.

Key practice: Begin each session reminding yourself that this person is a guest, an amanah, and deserves your complete presence.`,
        reference: 'Qur\'an 21:107; Sahih al-Bukhari',
      },
      {
        id: 'p3',
        title: 'Gradual Guidance',
        summary:
          'The Quran was revealed gradually. The Prophet ﷺ never overwhelmed people with too much at once. Guidance must match the readiness of the heart.',
        body: `Aisha (may Allah be pleased with her) said: "The first thing to be revealed were the short surahs of the Mufassal, containing mention of Paradise and Hellfire. When people had fully embraced Islam, then the halal and haram were revealed." (Bukhari)

This is a profound lesson for counselling. We must not overload clients. Start where they are. Address the most pressing concern first. Build trust before offering deeper guidance.

Key practice: In each session, identify one key area of growth. Focus there. Do not attempt to resolve everything at once.`,
        reference: 'Sahih al-Bukhari; Al-Itqan fi Ulum al-Quran',
      },
      {
        id: 'p4',
        title: 'Giving Hope',
        summary:
          'The Prophet ﷺ never despaired and never allowed others to despair of Allah\'s mercy. Hope is a therapeutic obligation.',
        body: `"Say: O My servants who have transgressed against themselves — do not despair of the mercy of Allah. Indeed, Allah forgives all sins." (Quran 39:53)

The Prophet ﷺ said: "None of you should wish for death because of a calamity befalling him; but if he has to wish for death, he should say: 'O Allah! Keep me alive as long as life is better for me, and let me die if death is better for me.'" (Bukhari)

Despair is one of the most dangerous spiritual states. Our role as counsellors includes being carriers of hope — not false optimism, but grounded faith in Allah's mercy and the human capacity to heal.`,
        reference: 'Qur\'an 39:53; Sahih al-Bukhari',
      },
      {
        id: 'p5',
        title: 'Dealing with Mistakes',
        summary:
          'The Prophet ﷺ addressed mistakes with dignity and privately where possible. He never shamed, humiliated, or exposed people unnecessarily.',
        body: `When the young man came asking permission to commit zina, the Prophet ﷺ sat with him, listened, and asked him whether he would accept that for his own mother, sister, and daughter. The man said no. The Prophet ﷺ then made du\'a for him. He was cured of the desire.

This approach — engaging the person's own conscience, appealing to their fitrah, and making du\'a — is a masterclass in counselling. There was no lecture, no shaming, no judgment.

Key practice: When a client discloses something difficult, respond first with presence, then with curiosity, then with wisdom. Never lead with judgment.`,
        reference: 'Musnad Ahmad; Al-Tabarani',
      },
      {
        id: 'p6',
        title: 'Conflict Resolution',
        summary:
          'The Prophet ﷺ resolved conflicts by identifying common ground, restoring dignity, and seeking lasting reconciliation rather than temporary peace.',
        body: `The Prophet ﷺ said: "Shall I not tell you what is better than voluntary prayer, fasting, and charity? It is reconciling between people. Causing rift between people is the destroyer." (Abu Dawud)

In family and community conflicts, the goal is not to determine who is right but to restore relationship. The counsellor's role is often to be the bridge — neutral, compassionate, and patient.

Key practice: When both parties feel understood, resolution becomes possible. Begin by validating each person's experience separately before facilitating dialogue.`,
        reference: 'Sunan Abi Dawud; authenticated',
      },
      {
        id: 'p7',
        title: 'Supporting People in Hardship',
        summary:
          'The Prophet ﷺ visited the sick, consoled the grieving, and was present in people\'s times of difficulty. Physical and emotional presence is sunnah.',
        body: `Visiting the sick is a right of a Muslim upon their brother. The Prophet ﷺ visited the sick, sat with them, and made du\'a. He said: "When you visit a sick person, give them hope of a long life. That does not change qadar, but it comforts the heart of the patient." (Tirmidhi)

For counsellors, this means: your presence matters. Being consistent, reliable, and compassionate is itself part of the healing. Don't underestimate the power of simply showing up.`,
        reference: 'Sunan al-Tirmidhi; Jami\' al-Usul',
      },
      {
        id: 'p8',
        title: 'Maintaining Dignity',
        summary:
          'The Prophet ﷺ elevated the status of every person he spoke to. He made them feel valued, heard, and respected — regardless of their background.',
        body: `Every human carries the honour bestowed by Allah: "We have certainly honoured the children of Adam." (Quran 17:70)

The Prophet ﷺ stood to greet people, called them by their best names, and honoured them in their presence and absence. He never mocked, belittled, or spoke disparagingly about those who came to him.

Key practice: Ensure your language, tone, and demeanour always communicate: "You are worthy. You matter. This is a safe space."`,
        reference: 'Qur\'an 17:70; Shama\'il al-Muhammadiyyah',
      },
    ],
  },

  {
    id: 'khulafa',
    title: 'Khulafā al-Rāshidūn',
    subtitle: 'The Rightly-Guided Caliphs',
    arabic: 'الخلفاء الراشدون',
    icon: 'Crown',
    colour: 'emerald',
    description:
      'The companions who led the Muslim community after the Prophet ﷺ demonstrated extraordinary wisdom in leadership, justice, and care for those under their responsibility.',
    lessons: [
      {
        id: 'k1',
        title: 'Abu Bakr — Gentleness in Leadership',
        summary:
          'Abu Bakr (ra) combined decisive leadership with remarkable gentleness. His first address as Caliph remains one of the finest statements of accountable leadership.',
        body: `Abu Bakr (ra) said in his inaugural address: "O people, I have been appointed over you but I am not the best among you. If I do well, help me. If I do wrong, correct me..."

This humility is foundational to counselling. We are not experts above our clients. We are companions on a journey. Our role is to help, support, and correct — with gentleness and mutual accountability.

He also showed us that in times of community crisis, the leader must remain calm, clear, and reassuring. When the Prophet ﷺ passed away and people were in shock, Abu Bakr's steadiness held the community together.`,
        reference: 'Tarikh al-Tabari; Seerah Ibn Hisham',
      },
      {
        id: 'k2',
        title: 'Umar — Justice and Accountability',
        summary:
          'Umar (ra) established systems of accountability and was known for his directness, fairness, and concern for the vulnerable.',
        body: `Umar (ra) patrolled the streets of Madinah at night to check on the condition of his people. He once carried flour on his back to feed a woman in need, refusing to let his servant carry it because "the burden of leadership is mine to bear."

For counsellors, Umar teaches us: accountability to our clients is personal. We must check in, follow up, and not allow distance to develop. We carry the weight of amanah personally.

He also established the principle: "There is no position of authority for one who cannot control himself."`,
        reference: 'Tabaqat Ibn Sa\'d; Seerah works',
      },
      {
        id: 'k3',
        title: 'Uthman — Patience and Long-suffering',
        summary:
          'Uthman (ra) demonstrated extraordinary patience under immense pressure. His forbearance in the face of injustice is a model for those working in difficult circumstances.',
        body: `Uthman (ra) was known for his modesty, patience, and generosity. He purchased the Well of Rumah and made it free for all Muslims. He financed the entire Tabuk expedition.

When besieged unjustly, he chose patience over retaliation, citing the sanctity of Muslim blood. He said: "I will not be the first to shed the blood of this Ummah."

For counsellors, Uthman's example teaches: maintain your values under pressure. Do not compromise confidentiality, dignity, or ethics even when things are difficult. Some battles are won through patience, not response.`,
        reference: 'Tarikh al-Islam; Al-Bidaya wal-Nihaya',
      },
      {
        id: 'k4',
        title: 'Ali — Wisdom and Deep Insight',
        summary:
          'Ali (ra) was known for his profound wisdom, insight into human nature, and ability to see the deeper dimensions of problems.',
        body: `Ali (ra) said: "Do not be a slave to others when Allah has created you free." He also said: "The worth of every person is in their excellence."

His judgements as a Cadi (judge) were legendary for their insight and fairness. He could identify deception, resolve complex disputes, and penetrate to the heart of a matter.

For counsellors, Ali's wisdom teaches: look beneath the surface. What is presented is rarely the full picture. Ask deep questions. Reflect. Do not rush to diagnosis.

He also said: "Speak to people according to their understanding."`,
        reference: 'Nahjul Balagha; Tarikh works',
      },
    ],
  },

  {
    id: 'scholars',
    title: 'Classical Scholars',
    subtitle: 'Islamic Intellectual Tradition',
    arabic: 'العلماء الكلاسيكيون',
    icon: 'BookOpen',
    colour: 'sky',
    description:
      'The classical Islamic scholars developed rich frameworks for understanding the human soul, spiritual diseases, and pathways to healing and growth.',
    lessons: [
      {
        id: 's1',
        title: 'Imam al-Ghazali — Purification of the Heart',
        summary:
          'Ihya Ulum al-Din (The Revival of the Religious Sciences) provides the most comprehensive Islamic framework for understanding spiritual diseases and their cures.',
        body: `Imam al-Ghazali (d. 1111 CE) wrote: "The heart is the king of the limbs. If it is sound, the limbs are sound. If it is diseased, the limbs are diseased."

His Ihya identifies key spiritual diseases relevant to counselling:
- Pride (kibr) — believing oneself superior, resistant to advice
- Envy (hasad) — wishing the removal of another's blessing
- Anger (ghadab) — uncontrolled emotional response
- Love of the world (hubb al-dunya) — attachment that creates anxiety
- Riya (showing off) — performing for others rather than Allah

Each disease has a cure. The counsellor must understand these diseases not only in clients but in themselves. Self-purification is prerequisite to helping others.`,
        reference: 'Ihya Ulum al-Din; Imam al-Ghazali',
        status: 'available',
      },
      {
        id: 's2',
        title: 'Ibn al-Qayyim — Grief and Spiritual Healing',
        summary:
          'Ibn al-Qayyim\'s writings on the human heart, spiritual healing, and the cure for grief are foundational for Islamic counselling.',
        body: `Ibn al-Qayyim al-Jawziyya (d. 1350 CE) wrote extensively on the diseases of the heart and their cures. In "Madarij al-Salikin," he describes the stations of the spiritual journey.

On grief and hardship, he wrote: "Whoever reflects deeply on the Quran and gives it full attention will find in it a cure for every illness of the heart."

He identified that most human suffering comes from three sources:
1. Regret over the past
2. Anxiety about the future
3. Distraction from the present

His prescription: Anchor the heart in remembrance of Allah. What has passed is decreed. What is coming is in Allah's hands. What remains is this moment, and it belongs to Allah.`,
        reference: 'Madarij al-Salikin; Zad al-Ma\'ad',
        status: 'available',
      },
      {
        id: 's3',
        title: 'Imam al-Nawawi — Community and Responsibility',
        summary:
          'Imam al-Nawawi\'s works emphasise the collective responsibility of the Muslim community towards one another.',
        body: `Imam al-Nawawi (d. 1277 CE) compiled the famous Forty Hadith, which includes numerous prophetic statements on community care, sincerity, and responsibility.

Hadith 7: "Religion is sincerity (al-nasihah)." — Al-Nawawi comments that sincere advice, given privately and with genuine concern, is the foundation of community wellbeing.

Hadith 35: "Do not envy one another, do not artificially inflate prices, do not hate one another, do not turn away from one another, and do not undercut one another in trade, but be, O servants of Allah, brothers."

For counsellors: our work is part of the broader Islamic obligation to care for the community. We are ambassadors of the Islamic ethic of mutual care.`,
        reference: 'Al-Arba\'in al-Nawawiyya; Riyadh al-Salihin',
        status: 'available',
      },
      {
        id: 's4',
        title: 'Coming Soon — Imam al-Suyuti & Others',
        summary:
          'Future lessons will cover Imam al-Suyuti on emotional wellbeing, family guidance from classical fiqh, and more.',
        body: `This section will be expanded with additional lessons from:

- Imam al-Suyuti — on emotional and spiritual wellbeing
- Ibn Hazm — on love, attachment, and the heart
- Al-Muhasibi — on self-examination and accountability
- Al-Qushayri — on spiritual stations and states
- And other authentic classical scholars

These lessons are being carefully prepared and will be published progressively.`,
        reference: 'Coming soon',
        status: 'coming_soon',
      },
    ],
  },

  {
    id: 'professional',
    title: 'Professional Counselling',
    subtitle: 'Ethics, Procedures & Practice',
    arabic: 'الإرشاد المهني',
    icon: 'Shield',
    colour: 'rose',
    description:
      'Professional ethics, confidentiality, and best-practice procedures that every SirajOne counsellor must know and uphold.',
    lessons: [
      {
        id: 'pr1',
        title: 'Confidentiality — The Core of Trust',
        summary:
          'Confidentiality is both an Islamic obligation (amanah) and a professional requirement. Nothing shared in a counselling session leaves that session without explicit consent.',
        body: `Confidentiality means: what is shared with you in trust must remain with you. This is not merely a policy — it is an amanah from Allah.

The Prophet ﷺ said: "When a man tells you something in confidence, it becomes a trust." (Abu Dawud)

SirajOne Confidentiality Protocol:
- Never discuss client details outside supervised case discussion
- Never share identifying information without written consent
- Document securely — written notes are confidential
- Exceptions (mandatory breaking of confidentiality):
  * Imminent risk of harm to self or others
  * Safeguarding concerns involving children or vulnerable adults
  * Legal obligation (court order)

When breaking confidentiality: inform the client first if safe to do so. Document the reason. Involve senior supervision.`,
        reference: 'Sunan Abi Dawud; SirajOne Professional Policy',
      },
      {
        id: 'pr2',
        title: 'Professional Boundaries',
        summary:
          'Clear boundaries protect both client and counsellor. They are not cold — they are a form of care.',
        body: `Boundaries in Islamic counselling:

1. Gender boundaries — Mixed-gender counselling requires proper safeguards (third person present, door open, digital session, etc.)

2. Relationship boundaries — Do not become a friend, confidant, or adviser outside the counselling context

3. Communication boundaries — Sessions happen in designated time and space; avoid 24/7 availability

4. Emotional boundaries — Compassion without enmeshment; care without losing objectivity

5. Gift boundaries — Accepting gifts from clients creates obligation and compromises objectivity

The Prophet ﷺ said: "Avoid being alone with women." This principle of avoiding situations that could lead to harm applies broadly in professional relationships.

Boundaries are not rejection. They are the frame that makes the work safe and effective.`,
        reference: 'SirajOne Professional Standards; Islamic Ethics',
      },
      {
        id: 'pr3',
        title: 'Referral Procedures',
        summary:
          'Knowing when and how to refer a client is a sign of professional maturity, not weakness.',
        body: `When to refer:
- Issues beyond your training or expertise (psychiatric diagnosis, severe trauma, addictions)
- When therapeutic relationship has broken down irreparably
- When your own wellbeing is affected (seek supervision first)
- Client requires specialist support (legal, financial, medical)
- Cultural/language barriers you cannot adequately address

How to refer:
1. Discuss with the client openly — this is not rejection
2. Explain the reason clearly and kindly
3. Provide at least one specific referral option
4. Document the referral
5. Follow up to ensure they made contact (if appropriate)

A counsellor who knows their limits is more trustworthy than one who overstretches.`,
        reference: 'SirajOne Referral Policy',
      },
      {
        id: 'pr4',
        title: 'Safeguarding',
        summary:
          'Every counsellor has a duty to protect vulnerable individuals. Safeguarding is not optional.',
        body: `Safeguarding applies when:
- A child is at risk of harm, abuse, or neglect
- A vulnerable adult is being exploited or harmed
- There is domestic violence with children present
- A client discloses abuse of another person

SirajOne Safeguarding Steps:
1. Listen carefully and document accurately (do not promise confidentiality before they speak)
2. Do not investigate yourself — your role is to report, not interrogate
3. Contact the SirajOne safeguarding lead immediately
4. If immediate danger: contact emergency services (999 in SA/UK)
5. Document everything — dates, times, exact words used

You are not alone in this. Supervision is always available. Do not delay safeguarding concerns.`,
        reference: 'SirajOne Safeguarding Policy; Children\'s Act',
      },
      {
        id: 'pr5',
        title: 'Session Preparation',
        summary:
          'A well-prepared counsellor creates safety and structure that enables deep and productive sessions.',
        body: `Before every session:
- Review notes from the previous session
- Set a clear intention (niyyah) — you are serving Allah through serving this person
- Ensure the space is private, comfortable, and free from interruption
- Silence your phone
- Read a brief du\'a for guidance and sincerity

During the session:
- Begin with the client's current state — not where you left off
- Use open questions to create space
- Summarise and reflect what you hear
- End with a clear closing — what was achieved, what comes next

After the session:
- Write up notes immediately while fresh
- Identify any concerns or follow-up actions
- Seek supervision if needed
- Make du\'a for the client`,
        reference: 'SirajOne Practice Guidelines',
      },
      {
        id: 'pr6',
        title: 'Crisis Response',
        summary:
          'Every counsellor must know how to respond when a client is in acute crisis — suicidal ideation, self-harm, or immediate danger.',
        body: `If a client expresses thoughts of suicide or self-harm:

1. Take it seriously. Never dismiss or minimise.
2. Ask directly: "Are you having thoughts of ending your life?" — asking does not increase risk.
3. Assess the plan: Do they have a method? A time? A place?
4. Remove immediate means if possible (ask them to move away from the location, give the medication to someone else, etc.)
5. Do not leave them alone if there is immediate risk.
6. Contact emergency services or take them to a place of safety.
7. Inform your supervisor immediately.
8. Document everything.

After a crisis:
- Debrief with your supervisor
- Take care of your own wellbeing
- Follow up with the client at the earliest opportunity

You are not expected to handle this alone. Seek support.`,
        reference: 'SirajOne Crisis Protocol; SADAG (South Africa)',
      },
      {
        id: 'pr7',
        title: 'Documentation and Record Keeping',
        summary:
          'Accurate, confidential records protect the client, the counsellor, and the organisation.',
        body: `What to document:
- Date, time, and duration of session
- Key themes discussed (not verbatim)
- Client's emotional state and presenting concerns
- Any risk factors identified
- Actions agreed
- Next session plan

What NOT to document:
- Your personal opinions about the client
- Third-party information not directly relevant
- Speculation not grounded in observation

Storage:
- Records must be stored securely (digital: password-protected; physical: locked)
- Do not store on personal devices without encryption
- Retention period: minimum 7 years from last session (adults)

Access:
- Only the counsellor and senior supervision have access
- Clients have a right to request their records`,
        reference: 'POPIA (South Africa); SirajOne Data Policy',
      },
      {
        id: 'pr8',
        title: 'Professional Ethics',
        summary:
          'The ethical counsellor operates from integrity, not just compliance. Ethics is not about avoiding punishment — it is about being trustworthy.',
        body: `Core ethical principles for SirajOne counsellors:

1. Sincerity (Ikhlas) — work for Allah's pleasure, not recognition
2. Trustworthiness (Amanah) — honour every confidence
3. Justice (Adl) — treat every client with equal care and dignity
4. Beneficence — always act in the client's best interest
5. Non-maleficence — do no harm
6. Autonomy — respect the client's right to make their own choices
7. Accountability — remain open to supervision and correction

Self-care is ethical practice:
A counsellor who is burned out, resentful, or overwhelmed cannot serve clients well. Rest, supervision, and spiritual maintenance are professional obligations, not luxuries.

"Take care of yourself so that you may take care of others."`,
        reference: 'SirajOne Code of Ethics; Islamic Professional Standards',
      },
    ],
  },
];
