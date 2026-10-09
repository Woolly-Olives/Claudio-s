/* =============================================================
   Term 1 Assessment Calendar (the "Create Your Calendar" section, id `create-your-calendar`).

   Twelve unbroken weeks of day boxes, Monday first; each deadline is a
   coloured box in its day (data: assets/data/assessments.js). Hover,
   focus or click a box for its card, which is laid directly over the box
   (the hover holds while the mouse is over the box or the card; a clicked
   card stays until you click away or press Escape). A day with one or two events draws
   them full size; three draw all three, compact and centred; four or more
   draw the first two (exams first, then deadlines, labs, tutorials) and a
   "+N more" button whose card shows the rest side by side.

   The Year 1 / 2 / 3 buttons pick one year at a time, and the two
   menus add single Term 1 Year 2 and Year 3 modules. Only Year 1 has dates —
   see the data file — so asking for Year 2 or 3 says "none added yet"
   instead of drawing anything. Nothing here fetches or runs on a timer.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("assess-cal");
  var D = window.BIOSOC_ASSESS;
  var CUR = window.BIOSOC_CURRICULUM;
  if (!root || !D) { return; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var FULL = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
  var RANK = { exam: 0, deadline: 1, lab: 2, tutorial: 3 };

  function parse(iso) {
    var p = iso.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }
  function iso(d) { return d.toISOString().slice(0, 10); }

  /* ---------- module colours for the menus (a copy of streamOf()/paintOf()
     in modulemap.js and staff.js; if one changes, change all) ---------- */
  var STREAMS = (CUR && CUR.meta && CUR.meta.streams) || [];
  var NEUTRAL = (CUR && CUR.meta && CUR.meta.neutral) || { core: "#bfbfbf", school: "#1b6b3a" };
  var UNCOLOURED = (CUR && CUR.meta && CUR.meta.uncoloured) || [];
  var byCode = {};
  if (CUR) { CUR.modules.forEach(function (m) { byCode[m.code] = m; }); }

  function isCoreFor(d, code) {
    return Object.keys(d.core).some(function (s) { return d.core[s].indexOf(code) !== -1; }) ||
      Object.keys(d.coreOneOf || {}).some(function (s) {
        return (d.coreOneOf[s] || []).some(function (g) { return g.indexOf(code) !== -1; });
      });
  }
  function swatch(code) {
    var m = byCode[code], found = null;
    if (m && m.stream) {
      found = STREAMS.filter(function (st) { return st.id === m.stream; })[0] || null;
    } else if (m && m.year !== 1 && UNCOLOURED.indexOf(code) === -1) {
      for (var i = 0; i < STREAMS.length && !found; i++) {
        if (STREAMS[i].degrees.some(function (id) {
          var d = CUR.degrees.filter(function (x) { return x.id === id; })[0];
          return d && isCoreFor(d, code);
        })) { found = STREAMS[i]; }
      }
    }
    if (found) { return found.colour; }
    return m && m.schoolCore ? NEUTRAL.school : NEUTRAL.core;
  }

  /* Modules every student in a year takes ride on that year's button rather than
     being pickable in its menu: select Year 2 and BS2200's dates (when there are
     any) draw with the rest of Year 2; likewise the Year 3 project. */
  var WITH_YEAR = { 2: ["BS2200"], 3: ["BS3PROJ"] };

  /* the menus offer Term 1 (semester 1) modules only, to match "Term 1 Assessment
     Calendar", minus the ones that ride on the year button */
  function modulesOf(year) {
    return CUR ? CUR.modules.filter(function (m) {
      return m.year === year && m.semester === 1 && (WITH_YEAR[year] || []).indexOf(m.code) === -1;
    }) : [];
  }

  /* ---------- state ---------- */

  var year = 1;                            // one Year button at a time, like radio buttons
  var picked = {};                         // module code -> true (single modules from the menus)

  function wanted() {
    return D.events.filter(function (e) {
      return e.year === year || picked[e.code];
    });
  }

  /* ---------- drawing ---------- */

  var NEXT = parse(D.nextYearFrom);

  function dayText(isoDate, time) {
    var d = parse(isoDate);
    return DOW[d.getUTCDay()] + " " + d.getUTCDate() + " " + MON[d.getUTCMonth()] +
      (d >= NEXT ? " " + d.getUTCFullYear() : "") + (time ? ", " + time : "");
  }
  function dateLine(e) { return e.when || dayText(e.date, e.time); }

  function card(e) {
    var rows;
    if (e.kind === "lab") {
      var t = e.prep;
      rows = '<dt>Group Times</dt><dd class="ac-card__times">' + D.groupTimes.map(esc).join("<br>") + '</dd>' +
        (t ? '<dt>Task</dt><dd>' + esc(t.task) + '</dd>' +
             '<dt>Task due</dt><dd>' + esc(dayText(t.due, t.time)) + '</dd>' +
             (t.weight ? '<dt>Weight</dt><dd>' + esc(t.weight) + '</dd>' : "")
           : '<dt>Task</dt><dd>None listed in the schedule</dd>');
    } else {
      rows = '<dt>' + (e.kind === "exam" ? "Time" : "Due") + '</dt><dd>' + esc(dateLine(e)) + '</dd>' +
        '<dt>Type</dt><dd>' + esc(e.type || "—") + '</dd>' +
        '<dt>Weight</dt><dd>' + esc(e.weight || "—") + '</dd>';
    }
    return '<div class="ac-card" style="--ec:' + esc(D.colours[e.mod] || "#999") + '">' +
      '<div class="ac-card__strip"></div>' +
      '<div class="ac-card__in"><strong class="ac-card__title">' + esc(e.title + (e.n ? " " + e.n : "")) + '</strong>' +
      '<span class="ac-card__mod">' + esc(e.code) + '</span><dl>' + rows + '</dl></div></div>';
  }

  var shown = [];                           // events drawn this time; data-k indexes it

  function chip(e, compact) {
    shown.push(e);
    return '<button type="button" class="ac__c ac__c--' + esc(e.mod) + ' ac__c--' + esc(e.kind) +
      (e.big ? ' ac__c--big' : '') + (!compact && e.half ? ' ac__c--half' : '') + '" data-k="' + (shown.length - 1) + '" aria-label="' + esc(e.title + (e.n ? " " + e.n : "")) + '">' +
      '<span class="ac__t">' + esc(e.short ? "..." : e.title) + '</span>' +
      (!compact && e.weight && e.kind !== "lab" && e.kind !== "tutorial" ? '<small>' + esc(e.weight.split(" together")[0]) + '</small>' : '') +
      '</button>';
  }

  function dayHtml(d, col, evs) {
    var day = d.getUTCDate(), m = d.getUTCMonth();
    evs = evs.slice().sort(function (a, b) { return RANK[a.kind] - RANK[b.kind]; });
    var many = evs.length >= 3;
    var vis = evs.length >= 4 ? evs.slice(0, 2) : evs;
    var rest = evs.slice(vis.length);
    var more = "";
    if (rest.length) {
      var ks = rest.map(function (e) { shown.push(e); return shown.length - 1; });
      more = '<button type="button" class="ac__more" data-ks="' + ks.join(",") + '">+' + rest.length + ' more</button>';
    }
    return '<div class="ac__d' + (many ? ' ac__d--many' : '') + (m % 2 ? ' ac__d--alt' : '') + '">' +
      '<b class="ac__n">' + day + '</b>' +
      (day === 1 ? '<span class="ac__ml' + (col === 6 ? ' ac__ml--one' : '') + '" aria-hidden="true">' + FULL[m] + '</span>' : '') +
      vis.map(function (e) { return chip(e, many); }).join("") + more + '</div>';
  }

  function draw() {
    shown = [];
    var evs = wanted(), byDay = {};
    evs.forEach(function (e) { (byDay[e.date] = byDay[e.date] || []).push(e); });
    var d = parse(D.start), h = "";
    for (var w = 0; w < D.weeks; w++) {
      for (var c = 0; c < 7; c++) {
        h += dayHtml(d, c, byDay[iso(d)] || []);
        d.setUTCDate(d.getUTCDate() + 1);
      }
    }
    grid.innerHTML = h;
    hide();

    var inc = (WITH_YEAR[year] || []).map(function (c) { return c + (byCode[c] ? " " + byCode[c].title : ""); });
    var asked = (year > 1 || Object.keys(picked).length) && !evs.some(function (e) { return e.year > 1; });
    note.textContent = (inc.length ? "Year " + year + " includes " + inc.join(", ") + ". " : "") +
      (asked ? "No assessment dates have been added for Year 2 or Year 3 modules yet — only Year 1's schedule is on the site." : "");
    [].forEach.call(root.querySelectorAll(".ac__y"), function (b) {
      b.setAttribute("aria-pressed", +b.getAttribute("data-y") === year ? "true" : "false");
    });
    [2, 3].forEach(function (y) {
      var n = modulesOf(y).filter(function (m) { return picked[m.code]; }).length;
      root.querySelector('.ac__n' + y).textContent = n ? String(n) : "";
    });
  }

  /* ---------- the controls ---------- */

  function menu(y) {
    return '<details class="ac__dd" data-y="' + y + '"><summary>Year ' + y + ' modules <span class="ac__count ac__n' + y + '"></span></summary>' +
      '<div class="ac__menu">' + modulesOf(y).map(function (m) {
        return '<label><input type="checkbox" value="' + esc(m.code) + '"><i style="background:' + esc(swatch(m.code)) + '"></i>' +
          '<b>' + esc(m.code) + '</b><span>' + esc(m.title) + '</span></label>';
      }).join("") + '</div></details>';
  }

  root.innerHTML =
    '<div class="ac__bar">' +
      [1, 2, 3].map(function (y) {
        return '<button type="button" class="ac__y" data-y="' + y + '" aria-pressed="' + (y === year ? "true" : "false") + '">Year ' + y + '</button>';
      }).join("") + menu(2) + menu(3) +
    '</div>' +
    '<p class="ac__note" aria-live="polite"></p>' +
    '<div class="ac__scroll"><div class="ac__wrap">' +
      '<div class="ac__dow" aria-hidden="true">' + ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (n) { return '<span>' + n + '</span>'; }).join("") + '</div>' +
      '<div class="ac__grid"></div></div></div>';

  var grid = root.querySelector(".ac__grid");
  var note = root.querySelector(".ac__note");

  root.querySelector(".ac__bar").addEventListener("click", function (event) {
    var b = event.target.closest(".ac__y");
    if (!b) { return; }
    year = +b.getAttribute("data-y");
    draw();
  });
  root.querySelector(".ac__bar").addEventListener("change", function (event) {
    var cb = event.target;
    if (cb.type !== "checkbox") { return; }
    if (cb.checked) { picked[cb.value] = true; } else { delete picked[cb.value]; }
    draw();
  });
  [].forEach.call(root.querySelectorAll(".ac__dd"), function (d) {   // a wide menu slides left rather than off-screen
    d.addEventListener("toggle", function () {
      var m = d.querySelector(".ac__menu");
      m.style.left = "0px";
      if (!d.open) { return; }
      var over = m.getBoundingClientRect().right - (window.innerWidth - 8);
      if (over > 0) { m.style.left = -over + "px"; }
    });
  });
  document.addEventListener("click", function (event) {      // a menu closes when you click away
    [].forEach.call(root.querySelectorAll(".ac__dd[open]"), function (d) {
      if (!d.contains(event.target)) { d.removeAttribute("open"); }
    });
  });

  /* ---------- the card ---------- */

  var pop = document.createElement("div");
  pop.className = "ac-pop";
  pop.id = "ac-pop";
  pop.setAttribute("role", "tooltip");
  pop.hidden = true;
  document.body.appendChild(pop);

  var current = null, pinned = false;

  function show(btn) {
    var html, head = "";
    if (btn.hasAttribute("data-ks")) {
      var evs = btn.getAttribute("data-ks").split(",").map(function (k) { return shown[+k]; });
      head = '<span class="ac-pop__head">' + evs.length + ' more on this day</span>';
      html = evs.map(card).join("");
    } else {
      html = card(shown[+btn.getAttribute("data-k")]);
    }
    current = btn;
    pop.innerHTML = head + html;
    pop.hidden = false;
    btn.setAttribute("aria-describedby", "ac-pop");

    /* the card is laid directly over the box it describes, its top-left corner on the
       box's own, and slid back into the window if that would push it off an edge */
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight, lift = head ? 24 : 0;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    var top = Math.max(8 + lift, Math.min(r.top, window.innerHeight - h - 8));
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  function hide() {
    if (current) { current.removeAttribute("aria-describedby"); }
    current = null;
    pinned = false;
    pop.hidden = true;
  }

  function boxOf(event) {
    return event.target.closest ? event.target.closest(".ac__c, .ac__more") : null;
  }

  grid.addEventListener("mouseover", function (event) {
    var b = boxOf(event);
    if (b && !pinned && b !== current) { show(b); }
  });
  /* the card covers its box, so the mouse ends up on the card: that must not count as
     leaving. The hover lasts while the mouse is over the box OR the card. */
  grid.addEventListener("mouseout", function (event) {
    if (!boxOf(event) || pinned) { return; }
    if (event.relatedTarget && pop.contains(event.relatedTarget)) { return; }
    hide();
  });
  pop.addEventListener("mouseleave", function () { if (!pinned) { hide(); } });
  grid.addEventListener("focusin", function (event) {
    var b = boxOf(event);
    if (b) { show(b); }
  });
  grid.addEventListener("focusout", function () { if (!pinned) { hide(); } });
  grid.addEventListener("click", function (event) {
    var b = boxOf(event);
    if (!b) { return; }
    event.stopPropagation();
    if (b === current && pinned) { hide(); } else { show(b); pinned = true; }
  });
  document.addEventListener("click", function (event) {
    if (!pop.hidden && !grid.contains(event.target)) { hide(); }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !pop.hidden) { hide(); }
  });
  /* the card is placed in the viewport, so scrolling the page would leave it behind */
  document.addEventListener("scroll", function () { if (!pop.hidden) { hide(); } }, true);
  document.addEventListener("biosoc:page", hide);

  draw();
})();
