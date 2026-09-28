/* =============================================================
   Year 2 timetable preview — a variant of timetable.js for
   assets/data/timetable-year2.js. NOT WIRED IN: nothing in
   index.html includes this file or gives it a mount point; see that
   data file's own header for why.

   Same layout engine as timetable.js (the calendar-column overlap
   algorithm in layoutDay(), the same colour-borrowing from
   curriculum.js's meta.streams/meta.neutral), but the card face
   itself is different, at explicit instruction:
     - only the code, title and room show — no "type · room" line,
       no staff line (both still ride along in the tooltip);
     - a session with `labPractical: true` gets a small "Lab
       Practical" badge instead of a type label;
     - `.tt__room` (assets/css/timetable-year2.css) wraps a long room
       onto a second line rather than truncating it, and the card's
       fill/border is the same brighter recipe Customise Your Degree
       gives a chosen module, not timetable.css's fainter one.

   If this ever becomes the live Year 3 renderer too, these two files
   should replace timetable.js/timetable.css rather than live
   alongside them forever — see that decision written up wherever
   this gets wired in.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("timetable-year2-grid");
  var DATA = window.BIOSOC_TIMETABLE_YEAR2;
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
        /* card face is code / title / room only — type and staff ride
           along in the tooltip instead, per explicit instruction */
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

    root.innerHTML = html;
  }

  var built = false;
  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "timetable-year2" || built) { return; }
    built = true;
    build();
  });
})();
