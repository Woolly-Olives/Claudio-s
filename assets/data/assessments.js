/* =============================================================
   Assessment calendar (Study Resources) — the dates it draws.
   Hand-edited, transcribed from the "Assessment schedule" table in
   index.html (the 2024/25 schedule). CHECK EVERY DATE AGAINST BLACKBOARD
   before relying on it, as the table itself says.

   Why hand-edited rather than read out of the table: the table's
   deadlines are prose ("Before your tutorial, 7th-11th October"), and the
   calendar needs a day to put each on. Keep the two in step by hand.

   An event:
       date    "YYYY-MM-DD"  the day it is drawn on
       mod     "BS1030" | "BS1040" | "both" | "ADBS001"   (the colour)
       code    module code(s) shown on the card ("BS1030 + BS1040")
       year    1, 2 or 3 — which Year button / menu it belongs to
       title   the box's label
       kind    "exam" | "deadline" | "lab" | "tutorial"
               (exam rows say "Time" on the card, the rest say "Due";
               kind also orders a crowded day: exam, deadline, lab,
               tutorial)
       time    "10:00"
       when    overrides the date-and-time line on the card
       type    "Blackboard MCQs", ...
       weight  "10%", ...
       big     true  -> the thick outline (the written pieces)
       half    true  -> half-height box on a day with one or two events
       short   true  -> the box shows just "..." (the card keeps the title); used
               on the Friday lab boxes
       n, prep lab practicals only: the practical's number, and its prep task
               { task, due, time, weight } (see labs() at the foot of this file)

   Modules every student in a year takes (BS2200 in Year 2, BS3PROJ in Year 3) show
   with that year's button, not in its menu: give their events year 2 / 3.

   Year 2 and Year 3 have no assessment schedule in the project yet, so
   the Year 2 / Year 3 buttons and menus draw nothing and say so. Do NOT
   invent dates to fill them.
   ============================================================= */
window.BIOSOC_ASSESS = {
  academicYear: "2024/25",
  start: "2024-09-23",          // a Monday: the first week drawn
  weeks: 12,                    // up to Sunday 15 December 2024
  nextYearFrom: "2025-08-01",   // a date from here on shows its year

  colours: { BS1030: "#38bdf8", BS1040: "#4ade80", both: "#ff3131", ADBS001: "#c084fc" },

  /* the three lab-practical slots, shown on every Year 1 lab card */
  groupTimes: [
    "Thursday 09:00 - 12:00",
    "Thursday 14:00 - 17:00",
    "Friday 09:00 - 12:00"
  ],

  events: [
    /* tutorial tasks sit on the Monday their window opens — the earliest
       they can be due (Study Well sessions are left out) */
    { date: "2024-10-07", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 2 task",
      when: "Before your tutorial, 7th–11th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 1/9)" },
    { date: "2024-10-14", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 3 task",
      when: "Before your tutorial, 14th–18th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 2/9)" },
    { date: "2024-10-21", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 4 task",
      when: "Before your tutorial, 21st–25th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 4/9)" },
    { date: "2024-10-28", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 5",
      when: "Before your tutorial, 28th Oct – 1st Nov", type: "TopHat questions", weight: "Part of engagement, 5% (task 5/9)" },
    { date: "2024-11-04", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 6 task",
      when: "Before your tutorial, 4th–8th Nov", type: "TopHat questions", weight: "Part of engagement, 5% (task 6/9)" },
    { date: "2024-11-11", mod: "ADBS001", code: "ADBS001", year: 1, kind: "tutorial", half: true, title: "Tutorial 7 (1-to-1)",
      when: "11th–15th Nov", type: "1-to-1 meeting to discuss your marked essay", weight: "—" },
    { date: "2024-11-18", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 8 task",
      when: "Before your tutorial, 18th–22nd Nov", type: "TopHat questions", weight: "Part of engagement, 5% (task 8/9)" },
    { date: "2024-11-25", mod: "ADBS001", code: "ADBS001", year: 1, kind: "tutorial", half: true, title: "Tutorial 9 (prep)",
      when: "25th–29th Nov", type: "Preparing for the oral presentation", weight: "—" },
    { date: "2024-12-02", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 10 · presentation",
      when: "2nd–6th Dec", type: "Oral presentation during Tutorial 10", weight: "Part of engagement, 5% (task 9/9)" },

    { date: "2024-10-16", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 1", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2024-10-23", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", big: true, title: "Scientific Summary", time: "10:00",
      type: "Essay", weight: "10%" },
    { date: "2024-10-30", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 2", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2024-11-13", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", big: true, title: "Practical Report", time: "10:00",
      type: "Report submission via Turnitin", weight: "20%" },
    { date: "2024-11-13", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 3", time: "10:00",
      type: "Blackboard MCQ", weight: "10% together with all 4 stats MCQs" },
    { date: "2024-11-27", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", big: true, title: "Essay", time: "10:00",
      type: "Essay submitted via Turnitin", weight: "20%" },
    { date: "2024-11-27", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 4", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2025-01-06", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", title: "Reflective Skills Portfolio", time: "10:00",
      type: "Document submission", weight: "10%" },

    { date: "2024-11-07", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "Mock exam", time: "10:00",
      type: "Closed book, 40 questions, 60 minutes", weight: "Formative (0%)" },
    { date: "2024-12-12", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "Practical Competence",
      when: "Assessment groups running from 09:00 Thursday", type: "In-person lab assessment, 45 minutes", weight: "10% of BS1030, 15% of BS1040" },
    { date: "2025-01-07", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "End of Module Exam", time: "09:00",
      type: "In-person exam, 60 questions, 90 minutes (joint module exam)", weight: "50% of BS1030, 50% of BS1040" }
  ].concat(labs())
};

/* ---------------------------------------------------------------
   Lab practicals: BS1030 and BS1040 each run Practicals 1-5, two weeks
   apart and alternating weeks, each on the Thursday and the Friday of its
   week (the lab groups are on the card). The schedule table lists only
   the prep task for Practicals 3-5 (and they fix those dates), so:
     - Practicals 3-5 are the table's dates, with the task from the table;
     - Practicals 1 and 2 are the SAME two-week rhythm run backwards —
       an inference, not in the table — and have no task listed. */
function labs() {
  var PREP = "09:00 or before your practical";
  var runs = {
    BS1030: [
      ["2024-10-03", 1],
      ["2024-10-17", 2],
      ["2024-10-31", 3, { task: "Blackboard MCQs + lab", due: "2024-10-31", time: PREP, weight: "Data used for the Practical Report" }],
      ["2024-11-14", 4, { task: "Answer the questions in the practical booklet", due: "2024-11-14", time: PREP }],
      ["2024-11-28", 5, { task: "Watch the video and read through the booklet", due: "2024-11-28", time: PREP }]
    ],
    BS1040: [
      ["2024-10-10", 1],
      ["2024-10-24", 2],
      ["2024-11-07", 3, { task: "Blackboard MCQs + lab", due: "2024-11-07", time: PREP }],
      ["2024-11-21", 4, { task: "Turnitin protocol submission, and bring a printed copy to the practical", due: "2024-11-20", time: "10:00", weight: "Formative (0%)" }],
      ["2024-12-05", 5, { task: "Blackboard MCQs", due: "2024-12-05", time: PREP }]
    ]
  };
  var out = [];
  Object.keys(runs).forEach(function (mod) {
    runs[mod].forEach(function (r) {
      var thu = new Date(r[0] + "T00:00:00Z");
      [0, 1].forEach(function (add) {
        var d = new Date(thu.getTime() + add * 86400000);
        out.push({ date: d.toISOString().slice(0, 10), mod: mod, code: mod, year: 1, kind: "lab", half: true,
                   title: "Lab Practical", n: r[1], prep: r[2] || null, short: add === 1 });
      });
    });
  });
  return out;
}
