/* =============================================================
   Timetable — a weekly grid built from a family of per-year data
   files (assets/data/timetable-year2.js, timetable-year3.js, ...),
   in the same visual language as the module map (Customise Your
   Degree): flat colour blocks in the School's own subject-stream
   colours, borrowed outright from assets/data/curriculum.js's
   meta.streams/meta.neutral rather than a second hardcoded palette.

   Built once, on the first biosoc:page event naming this section —
   same contract every other section-scoped script here waits for, so
   nothing runs before someone has actually opened Timetable. A click
   on one of the year buttons re-renders in place after that; the
   biosoc:page gate only guards the first build.

   Five years are listed (2026-09-28, at explicit instruction) —
   Foundation Year, Year 1, Year 2, Year 3, Year 4 — but only Year 2
   and Year 3 have a real transcribed week (`data` below); the other
   three carry `data: null` and render a plain "not yet available"
   message with a link to the University's own Open Timetable instead
   of a fabricated grid. Don't invent placeholder sessions for them —
   add a real data file the same way timetable-year2.js was built,
   and give it a slot in YEARS, when one of those years is next asked
   for.

   Overlapping sessions on the same day (two lectures at once) are
   laid out with the classic calendar-column algorithm: sort by
   start time, greedily pack each into the first column whose last
   session has already finished, then give every session a share of
   however many columns are active during its own time span. Simple
   on purpose — this data never has more than three things clashing
   at once.

   Card face: only the code, title and room show — no visible type or
   staff line (both still ride the tooltip) — and a `labPractical`
   session gets a small badge instead.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("timetable-grid");
  if (!root) { return; }

  var CURRICULUM = window.BIOSOC_CURRICULUM;
  var STREAMS = (CURRICULUM && CURRICULUM.meta && CURRICULUM.meta.streams) || [];
  var NEUTRAL = (CURRICULUM && CURRICULUM.meta && CURRICULUM.meta.neutral) || { core: "#bfbfbf", school: "#1b6b3a", schoolInk: "#eaf5ee" };

  var YEARS = [
    { id: "foundation", label: "Foundation Year", data: null },
    { id: "year1", label: "Year 1", data: null },
    { id: "year2", label: "Year 2", data: window.BIOSOC_TIMETABLE_YEAR2 || null },
    { id: "year3", label: "Year 3", data: window.BIOSOC_TIMETABLE_YEAR3 || null },
    { id: "year4", label: "Year 4", data: null }
  ];
  if (!YEARS.some(function (y) { return y.data; })) { return; }

  var state = { year: YEARS.some(function (y) { return y.id === "year3" && y.data; }) ? "year3" : YEARS.filter(function (y) { return y.data; })[0].id };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /** "cohort" isn't a subject stream — it's the same dark green
      Customise Your Degree uses for a module every degree takes. */
  function paintOf(streamId) {
    if (streamId === "cohort") { return { colour: NEUTRAL.school, dark: true }; }
    if (streamId === "core") { return { colour: NEUTRAL.core, dark: false }; }
    var st = STREAMS.filter(function (s) { return s.id === streamId; })[0];
    return st ? { colour: st.colour, dark: false } : { colour: NEUTRAL.core, dark: false };
  }

  function toMinutes(hhmm) {
    var parts = hhmm.split(":");
    return (+parts[0]) * 60 + (+parts[1]);
  }

  /** Greedy column packing — see the file header. */
  function layoutDay(sessions) {
    var sorted = sessions.slice().sort(function (a, b) { return a._start - b._start; });
    var columns = [];
    sorted.forEach(function (ev) {
      var col = columns.filter(function (c) { return c[c.length - 1]._end <= ev._start; })[0];
      if (col) { col.push(ev); ev._col = columns.indexOf(col); }
      else { columns.push([ev]); ev._col = columns.length - 1; }
    });
    sorted.forEach(function (ev) {
      var maxCol = 0;
      sorted.forEach(function (other) {
        if (other._start < ev._end && other._end > ev._start) { maxCol = Math.max(maxCol, other._col); }
      });
      ev._cols = maxCol + 1;
    });
    return sorted;
  }

  function yearButtons() {
    return '<div class="tt__years" role="tablist" aria-label="Year">' +
      YEARS.map(function (y) {
        return '<button type="button" class="tt__year' + (y.id === state.year ? " is-active" : "") +
          (y.data ? "" : " tt__year--empty") +
          '" data-year="' + y.id + '" role="tab" aria-selected="' + (y.id === state.year) + '">' +
          esc(y.label) + '</button>';
      }).join("") +
      '</div>';
  }

  function emptyState(label) {
    return '<p class="tt__empty">' + esc(label) +
      ' hasn’t been transcribed yet. Check the University’s own ' +
      '<a href="https://opentimetable.le.ac.uk/">Open Timetable</a> instead.</p>';
  }

  function grid(DATA) {
    var baseMin = DATA.startHour * 60;
    var totalMin = (DATA.endHour - DATA.startHour) * 60;
    var hours = [];
    for (var h = DATA.startHour; h < DATA.endHour; h++) { hours.push(h); }

    var usedStreams = {};
    DATA.sessions.forEach(function (ev) { usedStreams[ev.stream] = true; });
    var legendOrder = ["genetics", "biochemistry", "physiology", "neuroscience", "microbiology", "zoology"];
    var legend = legendOrder
      .filter(function (id) { return usedStreams[id]; })
      .map(function (id) { return { id: id, label: (STREAMS.filter(function (s) { return s.id === id; })[0] || {}).label || id }; });
    if (usedStreams.core) { legend.push({ id: "core", label: "No single stream" }); }
    if (usedStreams.cohort) { legend.push({ id: "cohort", label: "Whole cohort" }); }

    var byDay = DATA.days.map(function () { return []; });
    DATA.sessions.forEach(function (ev) {
      ev._start = toMinutes(ev.start);
      ev._end = toMinutes(ev.end);
      byDay[ev.day].push(ev);
    });
    byDay = byDay.map(layoutDay);

    var html = '<div class="tt__head">';
    html += '<p class="tt__week">' + esc(DATA.week) + '</p>';
    if (DATA.note) { html += '<p class="tt__note">' + esc(DATA.note) + '</p>'; }
    html += '<div class="tt__legend">' + legend.map(function (l) {
      var paint = paintOf(l.id);
      return '<span class="tt__key" style="--sc:' + paint.colour + '">' + esc(l.label) + '</span>';
    }).join("") + '</div>';
    html += '</div>';

    html += '<div class="tt__grid" style="--hours:' + hours.length + '">';
    html += '<div class="tt__corner"></div>';
    DATA.days.forEach(function (label) {
      var lines = label.split("\n");
      html += '<div class="tt__day">' + lines.map(function (l) { return esc(l); }).join("<br>") + '</div>';
    });
    html += '<div class="tt__gutter">' + hours.map(function (h) {
      return '<span class="tt__hour">' + (h < 10 ? "0" + h : h) + ':00</span>';
    }).join("") + '</div>';

    byDay.forEach(function (sessions) {
      html += '<div class="tt__col">';
      html += sessions.map(function (ev) {
        var paint = paintOf(ev.stream);
        var top = ((ev._start - baseMin) / totalMin) * 100;
        var height = ((ev._end - ev._start) / totalMin) * 100;
        var left = (ev._col / ev._cols) * 100;
        var width = (1 / ev._cols) * 100;
        /* card face is code / title / room only — type and staff ride
           along in the tooltip instead */
        return '<article class="tt__session' + (paint.dark ? " tt__session--dark" : "") + '" ' +
          'style="--sc:' + paint.colour + '; top:' + top.toFixed(2) + '%; height:' + height.toFixed(2) + '%; ' +
          'left:calc(' + left.toFixed(2) + '% + 2px); width:calc(' + width.toFixed(2) + '% - 4px);" ' +
          'title="' + esc(ev.code + " — " + ev.title + " (" + ev.type + "), " + ev.room + (ev.staff ? ", " + ev.staff : "")) + '">' +
          '<span class="tt__code">' + esc(ev.code) + '</span>' +
          '<span class="tt__title">' + esc(ev.title) + '</span>' +
          '<span class="tt__room">' + esc(ev.room) + '</span>' +
          (ev.labPractical ? '<span class="tt__flag">Lab Practical</span>' : '') +
          '</article>';
      }).join("");
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function render() {
    var year = YEARS.filter(function (y) { return y.id === state.year; })[0];
    var html = yearButtons();
    html += year.data ? grid(year.data) : emptyState(year.label);
    root.innerHTML = html;
  }

  root.addEventListener("click", function (event) {
    var btn = event.target.closest("button[data-year]");
    if (!btn) { return; }
    state.year = btn.dataset.year;
    render();
  });

  var built = false;
  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "timetable" || built) { return; }
    built = true;
    render();
  });
})();
