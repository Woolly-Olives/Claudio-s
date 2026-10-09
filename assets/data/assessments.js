/* =============================================================
   Term 1 Assessment Calendar (Create Your Calendar) — the dates it draws.
   Hand-edited.

   ALL OF THESE DATES ARE APPROXIMATE, and the calendar says so on every card
   (approxNote below). Where they come from:
     - Year 1 (BS1030, BS1040, ADBS001): the "Assessment schedule" table in
       index.html, which is the 2024/25 schedule, MOVED ON BY 104 WHOLE WEEKS
       (728 days) to 2026/27 so every weekday is unchanged (so each date is two
       days earlier in the month). Not an official 2026/27 schedule.
     - Year 2 / Year 3 first batch (BS2009, BS2059, BS2093, BS2200): the user's
       own last-year deadlines, moved on the same 104 weeks.
     - Year 2 / Year 3 second batch (BS2013, BS2015, BS2094, MB2020, MB2050,
       MB2051, BS3000 ... BS3070): the user's approximate week numbers, placed on
       the MONDAY of the week. University week 10 starts Mon 21 Sep 2026, so
       week N starts 21 Sep + (N - 10) x 7 days.
   CHECK EVERY DATE AGAINST BLACKBOARD, and replace them when the real 2026/27
   schedule is available.

   Why hand-edited rather than read out of the table: the table's deadlines are
   prose ("Before your tutorial, 7th-11th October"), and the calendar needs a
   day to put each on. Keep the table and this file in step by hand.

   An event:
       date    "YYYY-MM-DD"  the day it is drawn on
       mod     "BS1030" | "BS1040" | "both" | "ADBS001" | a module code (Year 2/3;
               its colour is then the module's stream colour, as in the module map)
       code    module code(s) shown on the card ("BS1030 + BS1040")
       year    1, 2 or 3 — Year 1 events show with the Year 1 button. In Years 2 and
               3 only the modules that ride on the button (BS2200, BS3PROJ) show with
               it; every other module is added with the menus, by its `code`
       title   the box's label
       kind    "exam" | "deadline" | "lab" | "tutorial"
               (exam rows say "Time" on the card, the rest say "Due";
               kind also orders a crowded day: exam, deadline, lab, tutorial)
       time    "10:00"
       when    overrides the date-and-time line on the card
       type    "Blackboard MCQs", ...
       weight  "10%", ...
       approx  overrides approxNote on this event's card
       half    true  -> half-height box on a day with one event
       short   true  -> the box shows just "..." (the card keeps the title); used
               on the Friday lab boxes
       n, prep lab practicals only: the practical's number, and its prep task
               { task, due, time, weight } (see labs() at the foot of this file)

   Do NOT invent dates. The Year 2/3 modules not listed here have none yet.
   ============================================================= */
window.BIOSOC_ASSESS = {
  academicYear: "2026/27",
  approxNote: "Approximate: last year's date moved on to 2026/27 — check Blackboard.",
  start: "2026-09-28",          // a Monday: the first week drawn
  weeks: 11,                    // up to Sunday 13 December 2026
  nextYearFrom: "2027-08-01",   // a date from here on shows its year

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
    { date: "2026-10-05", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 2 task",
      when: "Before your tutorial, 5th–9th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 1/9)" },
    { date: "2026-10-12", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 3 task",
      when: "Before your tutorial, 12th–16th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 2/9)" },
    { date: "2026-10-19", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 4 task",
      when: "Before your tutorial, 19th–23rd Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 4/9)" },
    { date: "2026-10-26", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 5",
      when: "Before your tutorial, 26th – 30th Oct", type: "TopHat questions", weight: "Part of engagement, 5% (task 5/9)" },
    { date: "2026-11-02", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 6 task",
      when: "Before your tutorial, 2nd–6th Nov", type: "TopHat questions", weight: "Part of engagement, 5% (task 6/9)" },
    { date: "2026-11-09", mod: "ADBS001", code: "ADBS001", year: 1, kind: "tutorial", half: true, title: "Tutorial 7 (1-to-1)",
      when: "9th–13th Nov", type: "1-to-1 meeting to discuss your marked essay", weight: "—" },
    { date: "2026-11-16", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 8 task",
      when: "Before your tutorial, 16th–20th Nov", type: "TopHat questions", weight: "Part of engagement, 5% (task 8/9)" },
    { date: "2026-11-23", mod: "ADBS001", code: "ADBS001", year: 1, kind: "tutorial", half: true, title: "Tutorial 9 (prep)",
      when: "23rd–27th Nov", type: "Preparing for the oral presentation", weight: "—" },
    { date: "2026-11-30", mod: "ADBS001", code: "ADBS001 (assessed for BS1040)", year: 1, kind: "tutorial", half: true, title: "Tutorial 10 · presentation",
      when: "30th Nov – 4th Dec", type: "Oral presentation during Tutorial 10", weight: "Part of engagement, 5% (task 9/9)" },

    { date: "2026-10-14", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 1", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2026-10-21", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", title: "Scientific Summary", time: "10:00",
      type: "Essay", weight: "10%" },
    { date: "2026-10-28", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 2", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2026-11-11", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", title: "Practical Report", time: "10:00",
      type: "Report submission via Turnitin", weight: "20%" },
    { date: "2026-11-11", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 3", time: "10:00",
      type: "Blackboard MCQ", weight: "10% together with all 4 stats MCQs" },
    { date: "2026-11-25", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", title: "Essay", time: "10:00",
      type: "Essay submitted via Turnitin", weight: "20%" },
    { date: "2026-11-25", mod: "BS1040", code: "BS1040", year: 1, kind: "deadline", half: true, title: "Stats 4", time: "10:00",
      type: "Blackboard MCQs", weight: "10% together with all 4 stats MCQs" },
    { date: "2027-01-04", mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", title: "Reflective Skills Portfolio", time: "10:00",
      type: "Document submission", weight: "10%" },

    { date: "2026-11-05", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "Mock exam", time: "10:00",
      type: "Closed book, 40 questions, 60 minutes", weight: "Formative (0%)" },
    { date: "2026-12-10", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "Practical Competence",
      when: "Assessment groups running from 09:00 Thursday", type: "In-person lab assessment, 45 minutes", weight: "10% of BS1030, 15% of BS1040" },
    { date: "2027-01-05", mod: "both", code: "BS1030 + BS1040", year: 1, kind: "exam", title: "End of Module Exam", time: "09:00",
      type: "In-person exam, 60 questions, 90 minutes (joint module exam)", weight: "50% of BS1030, 50% of BS1040" },

    /* ---- Year 2 / Year 3 (approximate; see the header) ---- */
    { date: "2026-11-22", mod: "BS2009", code: "BS2009", year: 2, kind: "deadline", title: "BS2009 Practical Portfolio", type: "Practical portfolio", weight: "40%" },
    { date: "2026-11-02", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", title: "BS2059 Field Report", type: "Field course report", weight: "46%" },
    { date: "2026-10-09", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-10-16", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-10-23", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-10-30", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-11-06", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-11-13", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-11-20", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-11-27", mod: "BS2059", code: "BS2059", year: 2, kind: "deadline", half: true, title: "BS2059 Engagement", time: "17:00", type: "Weekly engagement task (teaching weeks 2–9)", weight: "Part of engagement (4% in total)" },
    { date: "2026-11-24", mod: "BS2093", code: "BS2093", year: 2, kind: "deadline", title: "BS2093 Presentation", type: "Recorded presentation", weight: "35%" },
    { date: "2026-10-11", mod: "BS2093", code: "BS2093", year: 2, kind: "deadline", half: true, title: "BS2093 MCQ test", time: "12:00", type: "MCQ test (four in the term)", weight: "5% in total" },
    { date: "2026-10-21", mod: "BS2093", code: "BS2093", year: 2, kind: "deadline", half: true, title: "BS2093 MCQ test", time: "12:00", type: "MCQ test (four in the term)", weight: "5% in total" },
    { date: "2026-11-11", mod: "BS2093", code: "BS2093", year: 2, kind: "deadline", half: true, title: "BS2093 MCQ test", time: "12:00", type: "MCQ test (four in the term)", weight: "5% in total" },
    { date: "2026-12-09", mod: "BS2093", code: "BS2093", year: 2, kind: "deadline", half: true, title: "BS2093 MCQ test", time: "12:00", type: "MCQ test (four in the term)", weight: "5% in total" },
    { date: "2026-11-26", mod: "BS2200", code: "BS2200", year: 2, kind: "deadline", title: "BS2200 Individual Article", type: "Individual article", weight: "65%" },
    { date: "2026-11-17", mod: "BS2200", code: "BS2200", year: 2, kind: "exam", title: "BS2200 Ethics & Exp. Design Test", type: "Ethics and experimental design test", weight: "30%" },
    { date: "2026-12-09", mod: "BS2200", code: "BS2200", year: 2, kind: "deadline", title: "BS2200 Skills Portfolio", type: "Skills portfolio", weight: "5%" },
    { date: "2026-11-30", mod: "BS2013", code: "BS2013", year: 2, kind: "deadline", title: "BS2013 Report", type: "Report", approx: "Approximate: week 20 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-10-12", mod: "BS2015", code: "BS2015", year: 2, kind: "deadline", title: "BS2015 Essay", type: "Essay", approx: "Approximate: week 13 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-09", mod: "BS2094", code: "BS2094", year: 2, kind: "deadline", title: "BS2094 Essay", type: "Essay", approx: "Approximate: week 17 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-30", mod: "MB2020", code: "MB2020", year: 2, kind: "deadline", title: "MB2020 Report", type: "Report", approx: "Approximate: week 20 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-02", mod: "MB2050", code: "MB2050", year: 2, kind: "deadline", title: "MB2050 Presentation", type: "Presentation", approx: "Approximate: week 16 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-02", mod: "MB2051", code: "MB2051", year: 2, kind: "deadline", title: "MB2051 Presentation", type: "Presentation", approx: "Approximate: week 16 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-12-07", mod: "BS3000", code: "BS3000", year: 3, kind: "deadline", title: "BS3000 Essay", type: "Essay", approx: "Approximate: week 21 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-12-07", mod: "BS3010", code: "BS3010", year: 3, kind: "deadline", title: "BS3010 Presentation", type: "Presentation", approx: "Approximate: week 21 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-09", mod: "BS3015", code: "BS3015", year: 3, kind: "deadline", title: "BS3015 Report", type: "Report", approx: "Approximate: week 17 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-12-07", mod: "BS3031", code: "BS3031", year: 3, kind: "deadline", title: "BS3031 Report", type: "Report", approx: "Approximate: week 21 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-23", mod: "BS3038", code: "BS3038", year: 3, kind: "deadline", title: "BS3038 Report", type: "Report", approx: "Approximate: week 19 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-30", mod: "BS3054", code: "BS3054", year: 3, kind: "deadline", title: "BS3054 Report", type: "Report", approx: "Approximate: week 20 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-16", mod: "BS3055", code: "BS3055", year: 3, kind: "deadline", title: "BS3055 Report", type: "Report", approx: "Approximate: week 18 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-10-19", mod: "BS3064", code: "BS3064", year: 3, kind: "deadline", title: "BS3064 Report", type: "Report", approx: "Approximate: week 14 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-02", mod: "BS3068", code: "BS3068", year: 3, kind: "deadline", title: "BS3068 Report", type: "Report", approx: "Approximate: week 16 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-12-07", mod: "BS3068", code: "BS3068", year: 3, kind: "deadline", title: "BS3068 Essay", type: "Essay", approx: "Approximate: week 21 (university numbering), placed on its Monday — check Blackboard." },
    { date: "2026-11-23", mod: "BS3070", code: "BS3070", year: 3, kind: "deadline", title: "BS3070 Essay", type: "Essay", approx: "Approximate: week 19 (university numbering), placed on its Monday — check Blackboard." }
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
      ["2026-10-01", 1],
      ["2026-10-15", 2],
      ["2026-10-29", 3, { task: "Blackboard MCQs + lab", due: "2026-10-29", time: PREP, weight: "Data used for the Practical Report" }],
      ["2026-11-12", 4, { task: "Answer the questions in the practical booklet", due: "2026-11-12", time: PREP }],
      ["2026-11-26", 5, { task: "Watch the video and read through the booklet", due: "2026-11-26", time: PREP }]
    ],
    BS1040: [
      ["2026-10-08", 1],
      ["2026-10-22", 2],
      ["2026-11-05", 3, { task: "Blackboard MCQs + lab", due: "2026-11-05", time: PREP }],
      ["2026-11-19", 4, { task: "Turnitin protocol submission, and bring a printed copy to the practical", due: "2026-11-18", time: "10:00", weight: "Formative (0%)" }],
      ["2026-12-03", 5, { task: "Blackboard MCQs", due: "2026-12-03", time: PREP }]
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
