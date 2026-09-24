/* =============================================================
   Timetable — one real week, transcribed by hand from a screenshot
   of the University's own online timetable (Year 3, Biological
   Sciences, week commencing Monday 28 September).

   Hand-edited, like calendar.js and sway.js — not generated, and not
   a live feed (the University's timetable system is not reachable
   from a browser here any more than Outlook's calendar is; see
   CLAUDE.md). It will drift from the real thing every week it isn't
   updated by hand. Treat it as a worked example of the shape a real
   week takes, not a promise that this is *this* week's timetable.

   A few fields in the source screenshot were cut off mid-word by its
   own layout, not by this transcription — `room` ends "…" exactly
   where the screenshot's own text did, rather than guessing the rest.

   `stream` is one of the same ids Customise Your Degree uses
   (assets/data/curriculum.js's `meta.streams`) so timetable.js can
   borrow its colours outright instead of inventing a second palette;
   "core" is the neutral grey Customise Your Degree gives a module
   with no single stream, and "cohort" (dark green, the same ink as
   Customise Your Degree's "core for every degree") is for the two
   sessions here that are not a subject module at all.
   ============================================================= */
window.BIOSOC_TIMETABLE = {
  week: "Mon 28 Sep – Fri 2 Oct",
  note: "Year 3, Biological Sciences — one real week, kept as a worked example. Check Blackboard for the current one.",
  days: ["Mon\n28", "Tue\n29", "Wed\n30", "Thu\n1", "Fri\n2"],
  startHour: 9,
  endHour: 18,

  sessions: [
    /* ---------- Monday 28 ---------- */
    { day: 0, start: "10:00", end: "11:00", code: "BS3000", also: "NT4003_SEM1, NT4016_SEM1",
      title: "Evolutionary Genetics", type: "Lecture", room: "Attenborough 002", stream: "genetics" },
    { day: 0, start: "12:00", end: "13:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Henry Wellcome Frank & Katherine May Lecture Theatre", stream: "genetics" },
    { day: 0, start: "12:00", end: "13:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 208", stream: "core" },
    { day: 0, start: "13:00", end: "14:00", code: "BS3010", also: "NT4003_SEM1",
      title: "Gene Expression: Molecular Basis and Medical Relevance", type: "Lecture", room: "Attenborough Lecture The…", stream: "biochemistry" },
    { day: 0, start: "13:00", end: "14:00", code: "BS3015",
      title: "Molecular and Cellular Immunology", type: "Lecture", room: "Henry Wellcome Frank & Katherine May Lecture Theatre", stream: "core" },
    { day: 0, start: "14:00", end: "16:00", code: "BS3038",
      title: "Biodiversity in Practice", type: "Lecture", room: "Maurice Shock 206", staff: "Desjardins S D Dr", stream: "core" },
    { day: 0, start: "15:00", end: "16:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "Henry Wellcome Frank & Katherine May Lecture Theatre", stream: "physiology" },
    { day: 0, start: "16:00", end: "17:00", code: "BS3070",
      title: "Structural Biology", type: "Lecture", room: "George Davies 1.20", stream: "biochemistry" },
    { day: 0, start: "17:00", end: "18:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Engineering Lecture Theatre 2", stream: "neuroscience" },

    /* ---------- Tuesday 29 ---------- */
    { day: 1, start: "10:00", end: "11:00", code: "ADBS3S1_Y",
      title: "Welcome Back", type: "Induction", room: "George Davies Chetwode Lecture Theatre 1", stream: "cohort" },

    /* ---------- Wednesday 30 ---------- */
    { day: 2, start: "09:00", end: "10:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "Henry Wellcome Frank & Katherine May Lecture Theatre", stream: "physiology" },
    { day: 2, start: "11:00", end: "12:00", code: "BS3010", also: "NT4003_SEM1",
      title: "Gene Expression: Molecular Basis and Medical Relevance", type: "Lecture", room: "Bennett Lecture Theatre 3", stream: "biochemistry" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Bennett Lecture The…", stream: "genetics" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 1…", stream: "core" },
    { day: 2, start: "12:00", end: "13:00", code: "BS3070",
      title: "Structural Biology", type: "Lecture", room: "Bennett Lecture The…", stream: "biochemistry" },

    /* ---------- Thursday 1 ---------- */
    { day: 3, start: "09:00", end: "10:00", code: "BS3000", also: "NT4003_SEM1, NT4016_SEM1",
      title: "Evolutionary Genetics", type: "Lecture", room: "George Davies 0.37", stream: "genetics" },
    { day: 3, start: "10:00", end: "12:00", code: "BS3068", also: "NT4016_SEM1",
      title: "Microbial Biotechnology", type: "Workshop", room: "Maurice Shock 257",
      staff: "Millard A D Dr, Jenul C W Dr, Freestone P P E Dr", stream: "core" },
    { day: 3, start: "13:00", end: "14:00", code: "BS3031",
      title: "Human Genetics", type: "Lecture", room: "Bennett Lecture Theatre 4", stream: "genetics" },
    { day: 3, start: "15:00", end: "16:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Bennett Lecture Theatre 1", stream: "neuroscience" },

    /* ---------- Friday 2 ---------- */
    { day: 4, start: "09:00", end: "10:00", code: "ADBS3S1_Y",
      title: "Student Support and Development – Careers Hour", type: "Careers", room: "Bennett Lecture Theatre 1", stream: "cohort" },
    { day: 4, start: "10:00", end: "11:00", code: "BS3000", also: "NT4003_SEM1, NT4016_SEM1",
      title: "Evolutionary Genetics", type: "Lecture", room: "Sir Bob Burgess 1.04", stream: "genetics" },
    { day: 4, start: "11:00", end: "12:00", code: "BS3064",
      title: "Comparative Neurobiology", type: "Lecture", room: "Attenborough 111", stream: "core" },
    { day: 4, start: "12:00", end: "13:00", code: "BS3054",
      title: "Molecular and Cellular Pharmacology", type: "Lecture", room: "Maurice Shock Lecture The…", stream: "physiology" },
    { day: 4, start: "12:00", end: "13:00", code: "BS3068", also: "NT4016_SEM1",
      title: "Microbial Biotechnology", type: "Lecture", room: "Sir Bob Burgess 0.03", stream: "core" },
    { day: 4, start: "13:00", end: "16:00", code: "BS3038",
      title: "Biodiversity in Practice", type: "Practical", room: "Maurice Shock 225", staff: "Desjardins S D Dr", stream: "core" },
    { day: 4, start: "16:00", end: "17:00", code: "BS3055",
      title: "Molecular and Cellular Neuroscience", type: "Lecture", room: "Maurice Shock Lecture Theatre 1", stream: "neuroscience" }
  ]
};
