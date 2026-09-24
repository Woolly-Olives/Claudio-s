/* =============================================================
   Timetable — a weekly grid built from assets/data/timetable.js,
   in the same visual language as the module map (Customise Your
   Degree): flat colour blocks in the School's own subject-stream
   colours, borrowed outright from assets/data/curriculum.js's
   meta.streams/meta.neutral rather than a second hardcoded palette.

   Built once, on the first biosoc:page event naming this section —
   same contract every other section-scoped script here waits for,
   so nothing runs before someone has actually opened Timetable.

   Overlapping sessions on the same day (two lectures at once) are
   laid out with the classic calendar-column algorithm: sort by
   start time, greedily pack each into the first column whose last
   session has already finished, then give every session a share of
   however many columns are active during its own time span. Simple
   on purpose — this data never has more than three things clashing
   at once.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("timetable-grid");
  var DATA = window.BIOSOC_TIMETABLE;
  if (!root || !DATA) { return; }

  var CURRICULUM = window.BIOSOC_CURRICULUM;
  var STREAMS = (CURRICULUM && CURRICULUM.meta && CURRICULUM.meta.streams) || [];
  var NEUTRAL = (CURRICULUM && CURRICULUM.meta && CURRICULUM.meta.neutral) || { core: "#bfbfbf", school: "#1b6b3a", schoolInk: "#eaf5ee" };

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

  function build() {
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
        /* the full "also" cross-listing and the session type sit in the
           tooltip only — on the card face itself they cost more room
           than a 1-hour-tall block has to give, and were overflowing
           and clipping mid-word before this */
        var codeLine = esc(ev.code) + (ev.also ? ", " + esc(ev.also) : "");
        return '<article class="tt__session' + (paint.dark ? " tt__session--dark" : "") + '" ' +
          'style="--sc:' + paint.colour + '; top:' + top.toFixed(2) + '%; height:' + height.toFixed(2) + '%; ' +
          'left:calc(' + left.toFixed(2) + '% + 2px); width:calc(' + width.toFixed(2) + '% - 4px);" ' +
          'title="' + esc(codeLine + " — " + ev.title + " (" + ev.type + "), " + ev.room + (ev.staff ? ", " + ev.staff : "")) + '">' +
          '<span class="tt__code">' + esc(ev.code) + (ev.also ? '<span class="tt__also">+' + (ev.also.split(",").length) + '</span>' : '') + '</span>' +
          '<span class="tt__title">' + esc(ev.title) + '</span>' +
          '<span class="tt__room">' + esc(ev.type) + ' · ' + esc(ev.room) + '</span>' +
          (ev.staff ? '<span class="tt__staff">' + esc(ev.staff) + '</span>' : '') +
          '</article>';
      }).join("");
      html += '</div>';
    });
    html += '</div>';

    root.innerHTML = html;
  }

  var built = false;
  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "timetable" || built) { return; }
    built = true;
    build();
  });
})();
