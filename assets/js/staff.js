/* =============================================================
   Connect — staff cards.

   Each card lists the modules a person teaches on, coloured as they
   are in Customise Your Degree, with "Convenor" after the code of any
   they convene; a role (Head Tutor, Careers Lead…) goes above the
   codes. The convenor lists are the only teaching data the project has,
   so only convened modules appear until others are added by hand in
   assets/data/staff.js (`teaches`).

   One card per person who convenes a module, built from the convenor
   lists in assets/data/curriculum.js (the module handbooks' own
   transcription), plus anything assets/data/staff.js adds. Each card:
   the name, a photo (blank until there is one), the codes of the
   modules they convene, "My research area:", "I am passionate about:"
   and their email.

   The convenor lists are transcribed as written, slips and all, so the
   same person turns up more than once under different spellings or
   emails. People are therefore joined up before drawing: two entries
   are one person if they share a name (ignoring title and capital
   letters) or an email address (ignoring capital letters). The name
   shown is the spelling used most often (then the longest), with the
   highest title any entry gave ("Professor" over "Dr"). An email that
   is not a plausible address is left out; every distinct valid one is
   shown. Nothing is fetched and nothing runs on a timer.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("staff");
  var CUR = window.BIOSOC_CURRICULUM;
  if (!root || !CUR) { return; }
  var EXTRA = (window.BIOSOC_STAFF && window.BIOSOC_STAFF.profiles) || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var TITLE = /^(Dr|Prof|Professor)\.?\s+/i;
  var EMAIL = /^[^@\s.][^@\s]*@[^@\s.][^@\s]*\.[^@\s]+$/;

  function parse(entry) {
    var m = entry.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    var raw = (m ? m[1] : entry).replace(/\s+/g, " ").trim();
    var email = m ? m[2].trim().toLowerCase() : "";
    var t = raw.match(TITLE);
    var name = raw.replace(TITLE, "");
    var shown = name.split(" ").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
    return {
      title: t ? (/^prof/i.test(t[1]) ? "Professor" : "Dr") : "",
      shown: shown,
      key: shown.toLowerCase(),
      email: EMAIL.test(email) ? email : ""
    };
  }

  /* ---------- join up the entries that are one person ---------- */

  var people = [];          // each: { keys, emails, titles, forms, modules }
  var byKey = {};           // name key or "@email" -> person

  function personFor(p) {
    return byKey[p.key] || (p.email && byKey["@" + p.email]) || null;
  }

  CUR.modules.forEach(function (mod) {
    (mod.convenors || []).forEach(function (entry) {
      var p = parse(entry);
      var person = personFor(p);
      if (!person) {
        person = { emails: [], titles: [], forms: {}, modules: [] };
        people.push(person);
      }
      byKey[p.key] = person;
      if (p.email) {
        byKey["@" + p.email] = person;
        if (person.emails.indexOf(p.email) === -1) { person.emails.push(p.email); }
      }
      if (p.title) { person.titles.push(p.title); }
      person.forms[p.shown] = (person.forms[p.shown] || 0) + 1;
      if (person.modules.indexOf(mod.code) === -1) { person.modules.push(mod.code); }
    });
  });

  var titleOf = {}, byCode = {};
  CUR.modules.forEach(function (m) { titleOf[m.code] = m.title; byCode[m.code] = m; });

  /* ---------- module colours, the same as Customise Your Degree ----------
     A copy of streamOf()/paintOf() in assets/js/modulemap.js, which keeps
     them private: a module's own `stream` if it has one, else the first
     stream (in precedence order) whose degrees list it as core; the dark
     green for a module every degree takes; neutral grey otherwise. If
     one changes, change the other. */
  var STREAMS = (CUR.meta && CUR.meta.streams) || [];
  var NEUTRAL = (CUR.meta && CUR.meta.neutral) || { core: "#bfbfbf", school: "#1b6b3a" };
  var UNCOLOURED = (CUR.meta && CUR.meta.uncoloured) || [];

  function isCoreFor(d, code) {
    return Object.keys(d.core).some(function (s) { return d.core[s].indexOf(code) !== -1; }) ||
      Object.keys(d.coreOneOf || {}).some(function (s) {
        return (d.coreOneOf[s] || []).some(function (g) { return g.indexOf(code) !== -1; });
      });
  }

  function streamFound(code) {
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
    return found;
  }

  function paintOf(code) {
    var m = byCode[code], found = streamFound(code);
    if (found) { return { colour: found.colour, dark: false }; }
    if (m && m.schoolCore) { return { colour: NEUTRAL.school, dark: true }; }
    return { colour: NEUTRAL.core, dark: false };
  }

  people.forEach(function (person) {
    var forms = Object.keys(person.forms).sort(function (a, b) {
      return (person.forms[b] - person.forms[a]) || (b.length - a.length);
    });
    person.name = forms[0];
    person.key = person.name.toLowerCase();
    person.title = person.titles.indexOf("Professor") !== -1 ? "Professor" : (person.titles[0] || "");
    person.modules.sort();
  });

  people.sort(function (a, b) {
    var sa = a.name.split(" ").pop(), sb = b.name.split(" ").pop();
    return sa.localeCompare(sb) || a.name.localeCompare(b.name);
  });

  /* the carousel shows people in a different random order each visit */
  for (var k = people.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1)), t = people[k];
    people[k] = people[r]; people[r] = t;
  }

  /* ---------- the cards ---------- */

  function field(label, value) {
    return '<div class="st__field">' +
      '<dt class="st__label">' + esc(label) + '</dt>' +
      '<dd class="st__value' + (value ? '' : ' st__value--blank') + '">' + esc(value || "") + '</dd>' +
      '</div>';
  }

  /* modules that are alternatives to each other, shown as one chip */
  var JOINED = [["BS2032", "BS2033"]];

  /* the filter a role belongs to: every kind of tutor is a "Tutor" */
  function roleGroup(r) {
    return /tutor/i.test(r) ? "Tutor" : /careers/i.test(r) ? "Careers" : /biosedi/i.test(r) ? "BIOsEDI" : r;
  }
  var ROLE_FILTERS = ["Tutor", "Careers", "BIOsEDI"];
  var YEAR_FILTERS = [["1", "Year 1"], ["2", "Year 2"], ["3", "Year 3"], ["FY", "Foundation Year"], ["MSc", "MSc"], ["PhD", "PhD"], ["4", "MBiolSci/Year 4"]];

  function card(person) {
    var extra = EXTRA[person.key] || {};

    /* every module they teach on: the ones they convene (from the
       handbooks' lists, so always known) plus any listed by hand in
       staff.js — the handbooks name convenors, not the other lecturers */
    var codes = person.modules.slice();
    (extra.teaches || []).forEach(function (c) { if (codes.indexOf(c) === -1) { codes.push(c); } });
    codes.sort();

    var years = (extra.years || []).map(String);
    var streams = [];
    codes.forEach(function (c) {
      var y = byCode[c] && String(byCode[c].year);
      if (y && years.indexOf(y) === -1) { years.push(y); }
      var f = streamFound(c);
      if (f && streams.indexOf(f.id) === -1) { streams.push(f.id); }
    });
    var groups = [];
    (extra.roles || []).forEach(function (r) {
      var g = roleGroup(r);
      if (groups.indexOf(g) === -1) { groups.push(g); }
    });

    /* join alternatives into one chip: [codes shown, codes it stands for] */
    var chips = [];
    codes.forEach(function (c) {
      var j = JOINED.filter(function (set) { return set.indexOf(c) !== -1; })[0];
      if (j && chips.some(function (x) { return x.joined === j; })) { return; }
      chips.push({ joined: j, codes: j ? j.filter(function (x) { return codes.indexOf(x) !== -1; }) : [c] });
    });

    return '' +
      '<article class="st" data-tags="' + esc(years.map(function (y) { return "year:" + y; })
        .concat(streams.map(function (x) { return "stream:" + x; }), groups.map(function (g) { return "role:" + g; })).join("|")) + '">' +
        '<h2 class="st__name">' + esc((person.title ? person.title + " " : "") + person.name) + '</h2>' +
        '<div class="st__top">' +
          '<div class="st__photo">' +
            (extra.photo ? '<img src="' + esc(extra.photo) + '" alt="' + esc(person.name) + '">' : '') +
          '</div>' +
          '<div class="st__mods">' +
            '<ul class="st__codes">' +
            (extra.roles || []).map(function (r) { return '<li class="st__code st__code--role">' + esc(r) + '</li>'; }).join("") +
            chips.map(function (chip) {
              var paint = paintOf(chip.codes[0]);
              var conv = chip.codes.some(function (c) { return person.modules.indexOf(c) !== -1; });
              return '<li class="st__code' + (paint.dark ? ' st__code--dark' : '') + '" style="--mc:' + paint.colour +
                '" title="' + esc(chip.codes.map(function (c) { return titleOf[c] || ""; }).join(" / ")) + '">' +
                esc(chip.codes.join("/")) + (conv ? ' Convenor' : '') + '</li>';
            }).join("") + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="st__bottom">' +
          '<dl class="st__fields">' +
            field("My research area:", extra.research) +
            field("I am passionate about:", extra.passion) +
          '</dl>' +
          '<p class="st__mail">' + person.emails.map(function (e) {
            return '<a href="mailto:' + esc(e) + '">' + esc(e) + '</a>';
          }).join("<br>") + '</p>' +
        '</div>' +
      '</article>';
  }

  /* ---------- the filter: ONE row, ONE choice at a time ----------
     (no "All" button: pressing the chosen one again shows everyone)
     Picking a button shows everyone carrying that tag; picking another
     replaces it. Nothing narrows, nothing combines. */

  var opts = []
    .concat(YEAR_FILTERS.map(function (o) { return ["year:" + o[0], o[1]]; }))
    .concat(STREAMS.map(function (st) { return ["stream:" + st.id, st.label || st.id, st.colour]; }))
    .concat(ROLE_FILTERS.map(function (r) { return ["role:" + r, r]; }));

  /* a two-row (staggered) carousel of cards on top, the filter buttons below it */
  root.innerHTML =
    '<div class="st__carousel">' +
      '<button type="button" class="st__nav" data-dir="-1" aria-label="Previous staff">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<div class="st__grid" tabindex="0" role="region" aria-label="Staff cards">' + people.map(card).join("") +
        '<div class="st__clones" aria-hidden="true">' + people.map(card).join("") + '</div></div>' +
      '<button type="button" class="st__nav" data-dir="1" aria-label="Next staff">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
    '</div>' +
    '<div class="st__filters" role="group" aria-label="Filter staff">' + opts.map(function (o) {
      return '<button type="button" class="st__f" data-val="' + esc(o[0]) + '" aria-pressed="false"' +
        (o[2] ? ' style="--fc:' + o[2] + '"' : '') + '>' + esc(o[1]) + '</button>';
    }).join("") + '</div>' +
    '<p class="st__count" aria-live="polite"></p>';

  var clonesBox = root.querySelector(".st__clones");
  [].forEach.call(clonesBox.querySelectorAll(".st"), function (c) {
    c.classList.add("st--clone");
    [].forEach.call(c.querySelectorAll("a, button"), function (x) { x.tabIndex = -1; });
  });
  var cards = [].slice.call(root.querySelectorAll(".st:not(.st--clone)"));
  var clones = [].slice.call(clonesBox.children);
  var count = root.querySelector(".st__count");
  var track = root.querySelector(".st__grid");

  var shownCount = cards.length, pos = 0;

  /* ---------- two rows, staggered ----------
     The track is a two-row grid filled column by column, so the cards
     alternate top, bottom, top, bottom… and every bottom card is pulled half a
     card to the left (.st--low, staff.css), which puts it under the gap between
     two top cards and makes the bottom row start flush with the left edge — its
     first card is half cut off there. Which cards are "low" is worked out here
     from what is actually showing, because a filter hides some. For the loop to
     be seamless the count in one copy must be even (otherwise the second copy
     would start on the other row), so an odd count gets an invisible pad. */
  var pad = document.createElement("div");
  pad.className = "st__pad";
  pad.setAttribute("aria-hidden", "true");
  clonesBox.parentNode.insertBefore(pad, clonesBox);
  /* ---------- few enough to see at once: no loop, no drift ----------
     A card step is one card plus the gap; the track shows perRow of them. A
     filter that leaves perRow x 2 - 1 cards or fewer (7 when four fit) puts
     every card on screen at once, so the second copy, the invisible pad, the
     drift and the arrows are all switched off (.st--static) and the cards are
     laid out by hand: the top row first, then the bottom row — pushed half a
     card to the RIGHT here, since nothing scrolls and a half card cut off at
     the left edge would just look broken. */
  var GAP_PX = 17.6;
  function stepPx() {
    var c = cards.filter(function (x) { return !x.hidden; })[0] || cards[0];
    var gap = parseFloat(getComputedStyle(track).columnGap) || GAP_PX;
    return c.getBoundingClientRect().width + gap;
  }
  function perRow() { return Math.max(1, Math.floor((track.clientWidth + (parseFloat(getComputedStyle(track).columnGap) || GAP_PX)) / stepPx())); }
  var isStatic = false;
  function layout() {
    var vis = cards.filter(function (c) { return !c.hidden; });
    var n = perRow();
    isStatic = vis.length > 0 && vis.length <= 2 * n - 1;
    track.classList.toggle("st__grid--static", isStatic);
    root.querySelector(".st__carousel").classList.toggle("st__carousel--static", isStatic);
    cards.concat(clones).forEach(function (c) { c.classList.remove("st--low"); c.style.gridRow = ""; c.style.gridColumn = ""; });
    if (isStatic) {
      pad.hidden = true;
      vis.forEach(function (c, i) {
        c.style.gridRow = i < n ? "1" : "2";
        c.style.gridColumn = String(i % n + 1);
        if (i >= n) { c.classList.add("st--low"); }
      });
      return;
    }
    var odd = vis.length % 2 === 1;
    pad.hidden = !odd;
    var run = vis.slice();
    if (odd) { run.push(pad); }
    clones.forEach(function (c) { if (!c.hidden) { run.push(c); } });
    run.forEach(function (c, i) { c.classList.toggle("st--low", i % 2 === 1); });
  }
  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { layout(); track.scrollLeft = 0; pos = 0; kick(); }, 120);
  });
  layout();

  /* ---------- the arrows: two card lengths, smooth but quick ----------
     Done by script (not scrollBy's own smooth scroll, whose speed the browser
     picks) so it takes the same 280ms everywhere. The drift stands still while
     it runs and picks up from wherever the track ended. A left press at the
     very start first jumps to the identical spot in the second copy. */
  var SLIDE_MS = 280, sliding = 0;
  function slide(dir) {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w = loopWidth(), delta = dir * 2 * stepPx();
    if (sliding) { window.cancelAnimationFrame(sliding); sliding = 0; }
    if (w && track.scrollLeft + delta < 0) { track.scrollLeft += w; }
    var from = track.scrollLeft, t0 = 0;
    if (reduce) { track.scrollLeft = from + delta; pos = track.scrollLeft; setTo = pos; sliding = 0; kick(); return; }
    function step(now) {
      if (!t0) { t0 = now; }
      var k = Math.min(1, (now - t0) / SLIDE_MS), e = 1 - Math.pow(1 - k, 3);     // ease-out
      track.scrollLeft = from + delta * e;
      if (k < 1) { sliding = window.requestAnimationFrame(step); }
      else { sliding = 0; pos = track.scrollLeft; setTo = pos; kick(); }
    }
    sliding = window.requestAnimationFrame(step);
  }
  root.querySelector(".st__carousel").addEventListener("click", function (e) {
    var b = e.target.closest(".st__nav");
    if (!b || isStatic) { return; }
    slide(+b.getAttribute("data-dir"));
  });

  root.querySelector(".st__filters").addEventListener("click", function (e) {
    var b = e.target.closest(".st__f");
    if (!b) { return; }
    /* pressing the chosen button again lets go of it: everyone is shown */
    var off = b.getAttribute("aria-pressed") === "true";
    var val = off ? "" : b.getAttribute("data-val"), shown = 0;
    [].forEach.call(root.querySelectorAll(".st__f"), function (x) { x.setAttribute("aria-pressed", x === b && !off ? "true" : "false"); });
    cards.forEach(function (c, i) {
      var ok = !val || (c.getAttribute("data-tags") || "").split("|").indexOf(val) !== -1;
      c.hidden = !ok;
      clones[i].hidden = !ok;
      if (ok) { shown++; }
    });
    shownCount = shown;
    layout();
    pos = 0;
    track.scrollLeft = 0;
    count.textContent = !val ? "" :
      (shown ? "Showing " + shown + " of " + cards.length + " staff." : "No staff under this tag yet — more are being added.");
  });

  /* ---------- the slow drift, right to left ----------
     The track is moved by script, not CSS, so a hand on it (arrows, swipe,
     wheel) simply takes over. A second copy of the cards sits after the
     first (.st__clones); when the drift reaches it, the position jumps back
     by exactly one copy's width, which looks the same, so the loop has no
     seam. It runs only while Connect is open, stops under the pointer or
     keyboard focus, and not at all for reduced motion or when every card
     already fits. */
  var SPEED = 28;                       // px per second
  var open = false, held = false, last = 0, raf = 0, setTo = 0;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");

  function loopWidth() {
    var first = cards.filter(function (c) { return !c.hidden; })[0];
    var firstClone = clones.filter(function (c) { return !c.hidden; })[0];
    return first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0;
  }

  function fits() { return loopWidth() <= track.clientWidth + 1; }
  function wanted() { return open && !held && !sliding && !isStatic && !(still && still.matches) && !fits(); }

  function frame(now) {
    raf = 0;
    if (!wanted()) { last = 0; return; }
    var dt = last ? Math.min(now - last, 100) : 0;
    last = now;
    if (Math.abs(track.scrollLeft - setTo) > 2) { pos = track.scrollLeft; }   // someone moved it
    var w = loopWidth();
    pos += SPEED * dt / 1000;
    if (w > 0 && pos >= w) { pos -= w; }
    track.scrollLeft = pos;
    setTo = track.scrollLeft;
    raf = requestAnimationFrame(frame);
  }

  function kick() { if (!raf && wanted()) { last = 0; raf = requestAnimationFrame(frame); } }

  function hold(v) { return function () { held = v; if (!v) { pos = track.scrollLeft; kick(); } }; }
  track.addEventListener("pointerenter", hold(true));
  track.addEventListener("pointerleave", hold(false));
  track.addEventListener("focusin", hold(true));
  track.addEventListener("focusout", hold(false));

  /* a user who scrolls past either end wraps round instead of hitting a wall */
  track.addEventListener("scroll", function () {
    var w = loopWidth();
    if (!w) { return; }
    if (track.scrollLeft >= w) { track.scrollLeft -= w; setTo = track.scrollLeft; pos = setTo; }
  });

  document.addEventListener("biosoc:page", function (event) {
    open = event.detail.id === "connect";
    if (open) { kick(); }
  });
})();
