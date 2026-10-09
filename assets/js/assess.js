/* =============================================================
   Term 1 Assessment Calendar (the "Create Your Calendar" section, id `create-your-calendar`).

   Unbroken weeks of day boxes (11, from Mon 28 Sep 2026), Monday first; each deadline is a
   coloured box in its day (data: assets/data/assessments.js). Hover,
   focus or click a box for its card, which is laid directly over the box
   (the hover holds while the mouse is over the box or the card; clicking the
   box or the card keeps it open, and it closes only on a click outside both,
   Escape, or scrolling). Every day is a fixed 9rem tall (about 144px, as wide as
   it is on a desktop; NOT forced square, so it stays legible on narrow screens),
   so the text scales with the calendar's width. A day with one event draws it
   full size, two share the day; three draw all three, compact and centred; four or more
   draw the first two (exams first, then deadlines, labs, tutorials) and a
   "+N more" button whose card shows the rest side by side.

   The Year 1 / 2 / 3 buttons pick one year at a time, and the two
   menus add single Term 1 Year 2 and Year 3 modules; the modules on show are
   listed as chips under the buttons. Year 1's events come with its button;
   Year 2 and 3 buttons bring only BS2200 / BS3PROJ, and the rest are picked in the
   menus. Every date is approximate — see assets/data/assessments.js. Nothing here fetches or runs on a timer.
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

  /* What is drawn: all of Year 1's events with the Year 1 button; with Year 2 or 3 only
     the modules that ride on the button; plus every module picked in a menu. */
  function wanted() {
    return D.events.filter(function (e) {
      var rides = year === 1 || (WITH_YEAR[year] || []).indexOf(e.code) !== -1;
      return (e.year === year && rides) || picked[e.code];
    });
  }

  function colourOf(e) { return D.colours[e.mod] || swatch(e.code); }

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
    return '<div class="ac-card" style="--ec:' + esc(colourOf(e)) + '">' +
      '<div class="ac-card__strip"></div>' +
      '<div class="ac-card__in"><strong class="ac-card__title">' + esc(e.title + (e.n ? " " + e.n : "")) + '</strong>' +
      '<span class="ac-card__mod">' + esc(e.code) + '</span><dl>' + rows + '</dl>' +
      '<p class="ac-card__approx">' + esc(e.approx || D.approxNote || "") + '</p></div></div>';
  }

  var shown = [];                           // events drawn this time; data-k indexes it

  /* the box carries the name only; the weighting (and everything else) is in the card */
  function chip(e, compact) {
    shown.push(e);
    var colour = colourOf(e);
    return '<button type="button" class="ac__c ac__c--' + esc(e.mod) + ' ac__c--' + esc(e.kind) +
      (colour === NEUTRAL.school ? ' ac__c--dark' : '') +
      (!compact && e.half ? ' ac__c--half' : '') + '" style="--bx:' + esc(colour) + '" data-k="' + (shown.length - 1) + '" aria-label="' + esc(e.title + (e.n ? " " + e.n : "")) + '">' +
      '<span class="ac__t">' + esc(e.short ? "..." : e.title + (e.n ? "\u00a0" + e.n : "")) + '</span>' +   /* non-breaking: the number never wraps alone */
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
    return '<div class="ac__d' + (many ? ' ac__d--many' : '') + (evs.length === 2 ? ' ac__d--two' : '') + (m % 2 ? ' ac__d--alt' : '') + '">' +
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

    /* the modules on show under the buttons: Year 1 shows BS1030, BS1040 and the ADBS001
       tutorials (in the colours of their boxes); Years 2 and 3 show the ones that ride on
       the Year button (no way to remove them) and every module ticked in a menu */
    var withYear = (WITH_YEAR[year] || []);
    var pickedCodes = Object.keys(picked).sort();
    function selChip(colour, code, label, tail) {
      return '<span class="ac__sel-chip"><i style="background:' + esc(colour) + '"></i><b>' + esc(code) + '</b>' +
        (label ? '<span>' + esc(label) + '</span>' : '') + tail + '</span>';
    }
    var chips = year === 1
      ? [selChip(D.colours.BS1030, "BS1030", byCode.BS1030 ? byCode.BS1030.title : "", ""),
         selChip(D.colours.BS1040, "BS1040", byCode.BS1040 ? byCode.BS1040.title : "", ""),
         selChip(D.colours.ADBS001, "Tutorials", "(ADBS001)", "")]
      : [];
    withYear.concat(pickedCodes).forEach(function (code) {
      var riding = withYear.indexOf(code) !== -1;
      chips.push(selChip(swatch(code), code, byCode[code] ? byCode[code].title : "",
        riding ? '<small>(with Year ' + year + ')</small>'
               : '<button type="button" class="ac__sel-x" data-code="' + esc(code) + '" aria-label="Remove ' + esc(code) + '">✕</button>'));
    });
    sel.innerHTML = chips.join("");
    sel.hidden = !sel.innerHTML;
    var drawnLater = evs.some(function (e) { return e.year > 1 || picked[e.code]; });
    note.textContent = (year > 1 || pickedCodes.length) && !drawnLater
      ? "No assessment dates have been added for this selection yet." : "";
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
    '<div class="ac__sel" hidden></div>' +
    '<p class="ac__note" aria-live="polite"></p>' +
    '<div class="ac__scroll"><div class="ac__wrap">' +
      '<div class="ac__dow" aria-hidden="true">' + ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (n) { return '<span>' + n + '</span>'; }).join("") + '</div>' +
      '<div class="ac__grid"></div></div></div>';

  var grid = root.querySelector(".ac__grid");
  var note = root.querySelector(".ac__note");
  var sel = root.querySelector(".ac__sel");

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
  sel.addEventListener("click", function (event) {              // the ✕ on a chip unticks that module
    var x = event.target.closest(".ac__sel-x");
    if (!x) { return; }
    var code = x.getAttribute("data-code");
    delete picked[code];
    [].forEach.call(root.querySelectorAll('.ac__dd input'), function (i) { if (i.value === code) { i.checked = false; } });
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
    /* a click on a box (or its open card) never closes the card — it pins it;
       only a click outside the box and card does that */
    if (b !== current) { show(b); }
    pinned = true;
  });
  document.addEventListener("click", function (event) {
    if (pop.hidden || pop.contains(event.target) || boxOf(event)) { return; }
    hide();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !pop.hidden) { hide(); }
  });
  /* the card is placed in the viewport, so scrolling the page would leave it behind */
  document.addEventListener("scroll", function () { if (!pop.hidden) { hide(); } }, true);
  document.addEventListener("biosoc:page", hide);

  draw();
})();
