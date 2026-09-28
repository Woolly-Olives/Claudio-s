/* =============================================================
   Year 2 timetable — one real week, transcribed by hand from a
   screenshot of the University's own online timetable (week
   commencing Monday 28 September), the same way
   assets/data/timetable-year3.js was built for Year 3.

   Wired into the Timetable page's year switcher (2026-09-28,
   assets/js/timetable.js) — before that it sat here unused while the
   data and a one-off preview render were reviewed. See
   docs/HANDOVER.md.

   Hand-edited, like timetable-year3.js — not generated, and not a
   live feed (see CLAUDE.md: the University's timetable system cannot
   be reached from a browser here). It will drift from the real thing
   every week it isn't updated by hand.

   Titles are the modules' full names from curriculum.js, not the
   screenshot's own truncated card text ("Introduction to Pyt…").
   Room text is the user's own hand-supplied replacement wherever one
   was given — verbatim, abbreviation and all ("MSB 115", "SBB 1.03",
   "Henry Wellcome FKM LT") — rather than the fuller name the
   screenshot itself showed for the same room in some other session.
   "Bennett" briefly went through a "Bennet" (one t) spelling and back
   — corrected here to "Bennett" throughout, the real spelling, the
   one every untouched instance already carried.

   `stream` is derived by hand the same way the five overridden Year
   3 modules in curriculum.js are: which degree(s) this module is
   literally core for, walked in streamOf()'s own precedence order
   (physiology, neuroscience, biochemistry, genetics, microbiology,
   zoology) — not guessed, and not the same as the screenshot's own
   colour (this calendar UI's colours mean something else). BS2200 is
   core for every degree, so — like Customise Your Degree's own
   "school core" legend entry — it carries no subject stream at all
   ("cohort", the same dark green as a school-core module there);
   BS2094 is not core for any degree, so it takes the neutral "no
   single stream" grey ("core").

   The two MB2020 Practicals on Tuesday carry `labPractical: true`,
   at explicit instruction, for a small on-card indicator distinct
   from the plain `type` label other sessions carry.

   The Wednesday 9–12 entry is not from the screenshot at all — the
   screenshot's own Wednesday content is an unreadable cluster of
   collapsed icons at 12:00 (three narrow chips, "W"/"S" and two
   "L"/"A"s) that this file does NOT attempt to transcribe beyond the
   three module codes and rooms the user separately supplied for that
   slot. The tutorial block was added whole, at explicit instruction,
   with its own second line standing in for a room that varies by
   group and start time — the wording was later revised (2026-09-28)
   to say plainly that some tutorial groups meet outside this block.

   The shared renderer (assets/js/timetable.js, assets/css/
   timetable.css — the same ones Year 3 uses, not a separate copy any
   more) shows only code, title and room on the card face — no type or
   staff line — with `labPractical` drawn as a small badge instead,
   and wraps a long room onto a second line rather than truncating it.

   Friday's 09:00 BS2093 room was given a second time as "Henry
   Wellcome Frank & Kathrine May Lecture Theatre" (missing the 'e' in
   Katherine); spelled "Katherine" here, matching every other instance
   of the same room in this file, as a typo rather than a respelling —
   unlike "Bennett" above, this one was never given twice running.

   Friday's Careers Hour (11:00, code ADBS2S1) mirrors
   timetable-year3.js's own Careers session in kind — `type:
   "Careers"`, `stream: "cohort"` for the same whole-cohort dark green
   — but keeps the exact code the user gave rather than Year 3's own
   "ADBS3S1_Y".

   A worked example of the shape a real week takes, not a promise
   that this is *this* week's real timetable — see
   timetable-year3.js's own header for the fuller version of that
   caveat. */
window.BIOSOC_TIMETABLE_YEAR2 = {
  week: "Mon 28 Sep – Fri 2 Oct",
  note: "Year 2, Semester 1 — modules from across every degree stream shown together (this is not one student's real calendar: no single degree takes all eleven of these), kept as a worked example. Check Blackboard for the current one.",
  days: ["Mon\n28", "Tue\n29", "Wed\n30", "Thu\n1", "Fri\n2"],
  startHour: 9,
  endHour: 18,

  sessions: [
    /* ---------- Monday 28 ---------- */
    { day: 0, start: "09:00", end: "10:00", code: "BS2009",
      title: "Genomes", type: "Lecture", room: "Attenborough Film Theatre", stream: "genetics" },
    { day: 0, start: "10:00", end: "11:00", code: "BS2094",
      title: "Introduction to Python Programming for Bioscientists", type: "Lecture", room: "Maurice Shock G62", stream: "core" },
    { day: 0, start: "10:00", end: "11:00", code: "MB2050",
      title: "Biochemical Approaches to Therapeutic Development", type: "Lecture", room: "SBB 2.02", stream: "biochemistry" },
    { day: 0, start: "11:00", end: "12:00", code: "BS2200",
      title: "Research Skills 1", type: "Lecture", room: "Maurice Shock Lecture Theatre 1", stream: "cohort" },
    { day: 0, start: "12:00", end: "13:00", code: "BS2015",
      title: "Physiology of Excitable Cells", type: "Lecture", room: "Attenborough Lecture Theatre 1", stream: "physiology" },
    { day: 0, start: "13:00", end: "14:00", code: "BS2013",
      title: "Physiology and Pharmacology", type: "Lecture", room: "George Davies Chetwode Lecture Theatre 1", stream: "physiology" },
    { day: 0, start: "15:00", end: "16:00", code: "BS2200",
      title: "Research Skills 1", type: "Lecture", room: "Maurice Shock Lecture Theatre 1", stream: "cohort" },
    { day: 0, start: "16:00", end: "17:00", code: "BS2093",
      title: "Protein Structure and Function", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "biochemistry" },
    { day: 0, start: "16:00", end: "17:00", code: "MB2020",
      title: "Medical Microbiology", type: "Lecture", room: "MSB LT1", stream: "microbiology" },

    /* ---------- Tuesday 29 ---------- */
    { day: 1, start: "09:00", end: "10:00", code: "BS2093",
      title: "Protein Structure and Function", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "biochemistry" },
    { day: 1, start: "09:00", end: "11:00", code: "MB2020",
      title: "Medical Microbiology", type: "Practical", room: "MSB 115", staff: "Purves J Dr, Mukamol…", stream: "microbiology", labPractical: true },
    { day: 1, start: "10:00", end: "11:00", code: "BS2009",
      title: "Genomes", type: "Lecture", room: "Bennett Lecture Theatre 8", stream: "genetics" },
    { day: 1, start: "12:00", end: "13:00", code: "BS2013",
      title: "Physiology and Pharmacology", type: "Lecture", room: "Engineering Lecture Theatre 2", stream: "physiology" },
    { day: 1, start: "13:00", end: "15:00", code: "MB2020",
      title: "Medical Microbiology", type: "Practical", room: "MSB 115", staff: "Purves J Dr, Mukamol…", stream: "microbiology", labPractical: true },
    { day: 1, start: "14:00", end: "15:00", code: "BS2013",
      title: "Physiology and Pharmacology", type: "Lecture", room: "Engineering Lecture Theatre 2", stream: "physiology" },
    { day: 1, start: "17:00", end: "18:00", code: "BS2015",
      title: "Physiology of Excitable Cells", type: "Lecture", room: "Bennett Lecture Theatre 1", stream: "physiology" },
    { day: 1, start: "17:00", end: "18:00", code: "BS2030",
      title: "Principles of Microbiology", type: "Lecture", room: "Bennett Lecture Theatre 10", stream: "microbiology" },

    /* ---------- Wednesday 30 ---------- */
    { day: 2, start: "09:00", end: "12:00", code: "BS2200",
      title: "Tutorials for BS2200: Research Skills 1", type: "Tutorial",
      room: "Check your calendar for your tutorial's room and start time. Some tutorial groups may be scheduled outside of this Wednesday block.", stream: "cohort" },
    { day: 2, start: "12:00", end: "13:00", code: "BS2059",
      title: "Global Change Biology and Conservation", type: "Workshop", room: "SBB 1.03", stream: "zoology" },
    { day: 2, start: "12:00", end: "13:00", code: "MB2050",
      title: "Biochemical Approaches to Therapeutic Development", type: "Lecture", room: "Attenborough LT3", stream: "biochemistry" },
    { day: 2, start: "12:00", end: "13:00", code: "MB2051",
      title: "Current Issues in Medical Genetics", type: "Lecture", room: "Attenborough LT3", stream: "genetics" },

    /* ---------- Thursday 1 ---------- */
    { day: 3, start: "09:00", end: "10:00", code: "BS2015",
      title: "Physiology of Excitable Cells", type: "Lecture", room: "MSB LT1", stream: "physiology" },
    { day: 3, start: "09:00", end: "10:00", code: "BS2030",
      title: "Principles of Microbiology", type: "Lecture", room: "Bennett LT10", stream: "microbiology" },
    { day: 3, start: "10:00", end: "11:00", code: "MB2051",
      title: "Current Issues in Medical Genetics", type: "Lecture", room: "Maurice Shock 207", stream: "genetics" },
    { day: 3, start: "12:00", end: "13:00", code: "BS2059",
      title: "Global Change Biology and Conservation", type: "Workshop", room: "SBB 1.03", stream: "zoology" },
    { day: 3, start: "12:00", end: "13:00", code: "BS2200",
      title: "Research Skills 1", type: "Lecture", room: "MSB LT1", stream: "cohort" },
    { day: 3, start: "15:00", end: "16:00", code: "BS2009",
      title: "Genomes", type: "Lecture", room: "Attenborough Lecture Theatre 3", stream: "genetics" },
    { day: 3, start: "16:00", end: "17:00", code: "BS2200",
      title: "Research Skills 1", type: "Lecture", room: "Maurice Shock Lecture Theatre 1", stream: "cohort" },
    { day: 3, start: "17:00", end: "18:00", code: "BS2015",
      title: "Physiology of Excitable Cells", type: "Lecture", room: "Bennett Lecture Theatre 1", stream: "physiology" },

    /* ---------- Friday 2 ---------- */
    { day: 4, start: "09:00", end: "10:00", code: "BS2093",
      title: "Protein Structure and Function", type: "Lecture", room: "Henry Wellcome Frank & Katherine May Lecture Theatre", stream: "biochemistry" },
    { day: 4, start: "10:00", end: "11:00", code: "BS2013",
      title: "Physiology and Pharmacology", type: "Lecture", room: "George Davies Chetwode Lecture Theatre 1", stream: "physiology" },
    { day: 4, start: "11:00", end: "12:00", code: "ADBS2S1",
      title: "Careers Hour", type: "Careers", room: "George Davies Ground Floor Chetwode Lecture Theatre 1", stream: "cohort" },
    { day: 4, start: "13:00", end: "14:00", code: "BS2013",
      title: "Physiology and Pharmacology", type: "Lecture", room: "George Davies Chetwode Lecture Theatre 1", stream: "physiology" }
  ]
};
