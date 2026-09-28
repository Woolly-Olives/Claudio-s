/* =============================================================
   Year 3 timetable — one real week, transcribed by hand from a
   screenshot of the University's own online timetable (Biological
   Sciences, week commencing Monday 28 September).

   Renamed from assets/data/timetable.js (2026-09-28), when the
   Timetable page grew a Foundation Year / Year 1 / Year 2 / Year 3 /
   Year 4 switcher (assets/js/timetable.js) and this stopped being
   "the" timetable — see that file's header, and
   assets/data/timetable-year2.js for the sibling this now matches in
   name and shape. `window.BIOSOC_TIMETABLE` is `BIOSOC_TIMETABLE_YEAR3`
   below for the same reason.

   Hand-edited, like calendar.js and sway.js — not generated, and not
   a live feed (the University's timetable system is not reachable
   from a browser here any more than Outlook's calendar is; see
   CLAUDE.md). It will drift from the real thing every week it isn't
   updated by hand. Treat it as a worked example of the shape a real
   week takes, not a promise that this is *this* week's timetable.

   A few fields in the source screenshot were cut off mid-word by its
   own layout, not by this transcription — `room` ends "…" exactly
   where the screenshot's own text did, rather than guessing the rest.
   Those held until the user later supplied the real room for each one
   by hand (2026-09-28) — Attenborough LT3, Bennett LT8, Bennett LT4,
   MSB LT1 — at which point they stopped being a guess and were filled
   in; genuinely unresolved ones would still be left alone.

   `stream` is one of the same ids Customise Your Degree uses
   (assets/data/curriculum.js's `meta.streams`) so timetable.js can
   borrow its colours outright instead of inventing a second palette;
   "core" is the neutral grey Customise Your Degree gives a module
   with no single stream, and "cohort" (dark green, the same ink as
   Customise Your Degree's "core for every degree") is for sessions
   here that are not a subject module at all. BS3015 and BS3068
   (microbiology) and BS3038 and BS3064 (zoology) carry the same
   colour Customise Your Degree gives them under the `stream` override
   in tools/build-curriculum.py (see docs/HANDOVER.md) — not literally
   core for any degree, but coloured anyway at the user's own explicit
   instruction there; this file was brought into line with that
   2026-09-28, having been left grey ("core") when that override first
   went in.

   Brought in line with the Year 2 preview's format (2026-09-28, see
   assets/data/timetable-year2.js): every `also` cross-listing
   (NT4003_SEM1, NT4016_SEM1) has been dropped outright, at explicit
   instruction, because neither is an actual assets/data/curriculum.js
   module — they're the University's own Year 4 MSci Neuroscience
   course codes, in a different numbering scheme this School's own
   curriculum data doesn't track at all, not codes this data ever had
   a real match for. Every session now carries exactly one code.
   "Henry Wellcome Frank & Katherine May Lecture Theatre" is
   abbreviated to "Henry Wellcome FKM LT" throughout, matching the
   same room in timetable-year2.js; "Sir Bob Burgess 0.03" and
   "Maurice Shock Lecture Theatre 1" (Friday) later joined it as "SBB
   0.03" and "MSB LT1", at explicit instruction, the same building
   abbreviations Year 2 uses. Measured against the actual rendered
   card, not eyeballed — nothing else here overflows its box even at
   full length, so nothing else was shortened. BS3038's Friday
   Practical carries `labPractical: true` like the two Year 2 MB2020
   Practicals, for the same on-card badge.

   NT3100 ("Sustainability Enterprise Partnership Project") was added
   whole, at explicit instruction, for Monday 09:00 (SBB 1.01) and
   Thursday 17:00 (SBB 0.02) — corrected here from the "NT2100" first
   given: no such code exists, but NT3100 is a real Year 3 Semester 1
   module in curriculum.js under this exact title, so this reads as a
   typo, not a deliberate different module. It carries no single
   subject stream in curriculum.js either — the same "core" grey
   Customise Your Degree already gives it there, not a guess made here. */
window.BIOSOC_TIMETABLE_YEAR3 = {
  week: "Mon 28 Sep – Fri 2 Oct",
  note: "Year 3, Biological Sciences — one real week, kept as a worked example. Check Blackboard for the current one.",
  days: ["Mon\n28", "Tue\n29", "Wed\n30", "Thu\n1", "Fri\n2"],
  startHour: 9,
  endHour: 18,

  sessions: [
    /* ---------- Monday 28 ---------- */
    { day: 0, start: "09:00", end: "10:00", code: "NT3100",
      title: "Sustainability Enterprise Partnership Project", type: "Lecture", room: "SBB 1.01", stream: "core" },
    { day: 0, start: "10:00", end: "11:00", code: "BS3000",
      title: "Evolutionary Genetics", type: "Lecture", room: "Attenborough 002", stream: "genetics" },
    { day: 0, start: "12:00", end: "13:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "genetics" },
    { day: 0, start: "12:00", end: "13:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 208", stream: "zoology" },
    { day: 0, start: "13:00", end: "14:00", code: "BS3010",
      title: "Gene Expression: Molecular Basis and Medical Relevance", type: "Lecture", room: "Attenborough LT3", stream: "biochemistry" },
    { day: 0, start: "13:00", end: "14:00", code: "BS3015",
      title: "Molecular and Cellular Immunology", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "microbiology" },
    { day: 0, start: "14:00", end: "16:00", code: "BS3038",
      title: "Biodiversity in Practice", type: "Lecture", room: "Maurice Shock 206", staff: "Desjardins S D Dr", stream: "zoology" },
    { day: 0, start: "15:00", end: "16:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "physiology" },
    { day: 0, start: "16:00", end: "17:00", code: "BS3070",
      title: "Structural Biology", type: "Lecture", room: "George Davies 1.20", stream: "biochemistry" },
    { day: 0, start: "17:00", end: "18:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Engineering Lecture Theatre 2", stream: "neuroscience" },

    /* ---------- Tuesday 29 ---------- */
    { day: 1, start: "10:00", end: "11:00", code: "ADBS3S1_Y",
      title: "Welcome Back", type: "Induction", room: "George Davies Chetwode Lecture Theatre 1", stream: "cohort" },

    /* ---------- Wednesday 30 ---------- */
    { day: 2, start: "09:00", end: "10:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "Henry Wellcome FKM LT", stream: "physiology" },
    { day: 2, start: "11:00", end: "12:00", code: "BS3010",
      title: "Gene Expression: Molecular Basis and Medical Relevance", type: "Lecture", room: "Bennett Lecture Theatre 3", stream: "biochemistry" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Bennett LT8", stream: "genetics" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 111", stream: "zoology" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3070",
      title: "Structural Biology", type: "Lecture", room: "Bennett LT4", stream: "biochemistry" },

    /* ---------- Thursday 1 ---------- */
    { day: 3, start: "09:00", end: "10:00", code: "BS3000",
      title: "Evolutionary Genetics", type: "Lecture", room: "George Davies 0.37", stream: "genetics" },
    { day: 3, start: "10:00", end: "12:00", code: "BS3068",
      title: "Microbial Biotechnology", type: "Workshop", room: "Maurice Shock 257",
      staff: "Millard A D Dr, Jenul C W Dr, Freestone P P E Dr", stream: "microbiology" },
    { day: 3, start: "13:00", end: "14:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Bennett Lecture Theatre 4", stream: "genetics" },
    { day: 3, start: "15:00", end: "16:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Bennett Lecture Theatre 1", stream: "neuroscience" },
    { day: 3, start: "17:00", end: "18:00", code: "NT3100",
      title: "Sustainability Enterprise Partnership Project", type: "Lecture", room: "SBB 0.02", stream: "core" },

    /* ---------- Friday 2 ---------- */
    { day: 4, start: "09:00", end: "10:00", code: "ADBS3S1_Y",
      title: "Student Support and Development – Careers Hour", type: "Careers", room: "Bennett Lecture Theatre 1", stream: "cohort" },
    { day: 4, start: "10:00", end: "11:00", code: "BS3000",
      title: "Evolutionary Genetics", type: "Lecture", room: "Sir Bob Burgess 1.04", stream: "genetics" },
    { day: 4, start: "11:00", end: "12:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 111", stream: "zoology" },
    { day: 4, start: "12:00", end: "13:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "MSB LT1", stream: "physiology" },
    { day: 4, start: "12:00", end: "13:00", code: "BS3068",
      title: "Microbial Biotechnology", type: "Lecture", room: "SBB 0.03", stream: "microbiology" },
    { day: 4, start: "13:00", end: "16:00", code: "BS3038",
      title: "Biodiversity in Practice", type: "Practical", room: "Maurice Shock 225", staff: "Desjardins S D Dr", stream: "zoology", labPractical: true },
    { day: 4, start: "16:00", end: "17:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Maurice Shock Lecture Theatre 1", stream: "neuroscience" }
  ]
};
