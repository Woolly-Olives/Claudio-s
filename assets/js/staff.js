/* =============================================================
   Connect — staff cards.

   Each card lists the modules a person teaches on, coloured as they
   are in Customise Your Degree, with "Convenor" after the code of any
   they convene; a role (Senior Tutor, Careers Lead…) goes above the
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
    /* a profile can correct how an existing person's name is spelled (`name`) or their title (`title`); the key stays */
    var fix = EXTRA[person.key];
    if (fix && fix.name) { person.name = fix.name; }
    if (fix && fix.title) { person.title = fix.title; }
    /* modules a person convenes that the handbooks' lists do not carry (the Year 1 ones): `convenes` in staff.js */
    ((EXTRA[person.key] && EXTRA[person.key].convenes) || []).forEach(function (c) {
      if (person.modules.indexOf(c) === -1) { person.modules.push(c); }
    });
    person.modules.sort();
  });

  /* people who are in assets/data/staff.js but convene no module (the Head of School, say): a profile with a
     `name` (and `emails`) makes a card of its own, unless that person is already here under the same name */
  Object.keys(EXTRA).forEach(function (key) {
    var e = EXTRA[key];
    if (!e || !e.name || people.some(function (p) { return p.key === key; })) { return; }
    people.push({ name: e.name, key: key, title: e.title || "", titles: [], forms: {}, modules: (e.convenes || []).slice().sort(),
      emails: (e.emails || []).map(function (m) { return String(m).toLowerCase(); }).filter(function (m) { return EMAIL.test(m); }) });
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

  var FLIP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';

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
    return /tutor/i.test(r) ? "Tutor" : /careers/i.test(r) ? "Careers" : /biosedi/i.test(r) ? "BIOsEDI"
      : /^edi lead/i.test(r) ? "EDI Lead" : /programme director/i.test(r) ? "Programme Director"
      : /head of school|director of education|deputy head of school|head of division/i.test(r) ? "Leadership" : r;
  }
  var ROLE_FILTERS = ["Tutor", "Careers", "BIOsEDI", "EDI Lead", "Programme Director", "Leadership"];
  var YEAR_FILTERS = [["1", "Year 1"], ["2", "Year 2"], ["3", "Year 3"], ["FY", "Foundation Year"], ["MSc", "MSc"], ["PhD", "PhD"], ["4", "MBiolSci/Year 4"]];

  /* emails that differ only in the domain (le.ac.uk / leicester.ac.uk) are one address: show one, the le.ac.uk
     spelling if either is. Different mailboxes (ns140@ and nina.storey@) are all shown. */
  function canonMail(e) { return e.toLowerCase().replace(/@leicester\.ac\.uk$/, "@le.ac.uk"); }
  function allEmails(person, extra) {
    var out = [], seen = {};
    (person.emails || []).concat((extra.emails || []).map(function (m) { return String(m).toLowerCase(); }).filter(function (m) { return EMAIL.test(m); })).forEach(function (m) {
      var c = canonMail(m);
      if (seen[c] === undefined) { seen[c] = out.length; out.push(m); }
      else if (/@le\.ac\.uk$/.test(m)) { out[seen[c]] = m; }
    });
    return out;
  }

  function card(person) {
    var extra = EXTRA[person.key] || {};
    var tag = extra.prefix ? '<span class="st__tag">' + esc(extra.prefix) + '</span> ' : '';
    var emails = allEmails(person, extra);
    var chipsHtml = '';           // the module codes: on the front, or on the back when the front is too full (st--spill)

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

    chipsHtml = chips.map(function (chip) {
      var paint = paintOf(chip.codes[0]);
      var conv = chip.codes.some(function (c) { return person.modules.indexOf(c) !== -1; });
      return '<li class="st__code' + (paint.dark ? ' st__code--dark' : '') + '" style="--mc:' + paint.colour +
        '" title="' + esc(chip.codes.map(function (c) { return titleOf[c] || ""; }).join(" / ")) + '">' +
        esc(chip.codes.join("/")) + (conv ? ' Convenor' : '') + '</li>';
    }).join("");

    return '' +
      '<article class="st" data-tags="' + esc(years.map(function (y) { return "year:" + y; })
        .concat(streams.map(function (x) { return "stream:" + x; }), groups.map(function (g) { return "role:" + g; })).join("|")) + '">' +
        '<div class="st__inner">' +
        /* FRONT: name, photo, modules, research area */
        '<div class="st__face st__face--front">' +
          '<h2 class="st__name">' + tag + esc((person.title ? person.title + " " : "") + person.name) + '</h2>' +
          '<button type="button" class="st__flip" aria-label="Turn over ' + esc(person.name) + '\'s card" title="Turn over">' + FLIP_ICON + '</button>' +
          '<div class="st__top">' +
            '<div class="st__photo">' +
              (extra.photo ? '<img src="' + esc(extra.photo) + '" alt="' + esc(person.name) + '">' : '') +
            '</div>' +
            '<div class="st__mods">' +
              '<ul class="st__codes">' +
              (extra.roles || []).map(function (r) { return '<li class="st__code st__code--role">' + esc(r) + '</li>'; }).join("") +
              chipsHtml + '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="st__bottom">' +
            '<dl class="st__fields">' +
              field("My research area:", extra.research) +
            '</dl>' +
          '</div>' +
        '</div>' +
        /* BACK: passion, advice, email */
        '<div class="st__face st__face--back">' +
          '<div class="st__backname">' + tag + esc((person.title ? person.title + " " : "") + person.name) + '</div>' +
          '<button type="button" class="st__flip" aria-label="Turn ' + esc(person.name) + '\'s card back" title="Turn back">' + FLIP_ICON + '</button>' +
          '<div class="st__backmods">' +
            '<div class="st__label">Modules</div>' +
            '<ul class="st__codes"></ul>' +
          '</div>' +
          '<div class="st__bottom">' +
            '<dl class="st__fields">' +
              field("I am passionate about:", extra.passion) +
              field("My advice to students:", extra.advice) +
            '</dl>' +
            '<p class="st__mail">' + emails.map(function (e) {
              return '<a href="mailto:' + esc(e) + '">' + esc(e) + '</a>';
            }).join("<br>") + '</p>' +
          '</div>' +
        '</div>' +
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

  var shownCount = cards.length;

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
  function perRow() { return Math.max(1, Math.floor((track.clientWidth + (parseFloat(getComputedStyle(track).columnGap) || GAP_PX)) / stepPx() + 0.01)); }
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
  /* Every card is the same size, always: 1.343 x its width tall (359px at 267.5px wide), both rows alike, whatever is on
     it. A card whose FRONT would not fit that height gets class st--spill: its module codes leave the front and show
     on the back instead (roles, photo and research area stay). Measured with every card showing, so a filter never
     changes who spills. The card size is never changed to make room. */
  function setSpill(c, on) {
    var front = c.querySelector(".st__face--front .st__codes"), back = c.querySelector(".st__backmods .st__codes");
    if (!front || !back) { return; }
    if (on) {
      [].slice.call(front.querySelectorAll(".st__code:not(.st__code--role)")).forEach(function (li) { back.appendChild(li); });
    } else {
      [].slice.call(back.querySelectorAll(".st__code")).forEach(function (li) { front.appendChild(li); });
    }
    c.classList.toggle("st--spill", on);
  }
  function fitCards() {
    if (!track.clientWidth) { return; }                  // Connect is not laid out yet; it is run again when it opens
    var was = cards.map(function (c) { return c.hidden; });
    cards.forEach(function (c) { c.hidden = false; });
    cards.forEach(function (c, i) {
      setSpill(c, false); setSpill(clones[i], false);
      var f = c.querySelector(".st__face--front");
      if (f && f.scrollHeight > f.clientHeight + 1) { setSpill(c, true); setSpill(clones[i], true); }
    });
    cards.forEach(function (c, i) { c.hidden = was[i]; });
  }
  fitCards();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { fitCards(); }); }
  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { fitCards(); layout(); resetRows(); kick(); }, 120);
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
    if (reduce) { track.scrollLeft = from + delta; sliding = 0; absorb(); render(); kick(); return; }
    function step(now) {
      if (!t0) { t0 = now; }
      var k = Math.min(1, (now - t0) / SLIDE_MS), e = 1 - Math.pow(1 - k, 3);     // ease-out
      track.scrollLeft = from + delta * e;
      if (k < 1) { sliding = window.requestAnimationFrame(step); }
      else { sliding = 0; absorb(); render(); kick(); }
    }
    sliding = window.requestAnimationFrame(step);
  }
  root.querySelector(".st__carousel").addEventListener("click", function (e) {
    var b = e.target.closest(".st__nav");
    if (!b || isStatic) { return; }
    slide(+b.getAttribute("data-dir"));
  });

  /* ---------- turning a card over ----------
     A card has two faces (front: photo, modules, research; back: "I am
     passionate about:", "My advice to students:", email). The `is-flipped`
     class is the resting state (rotateY 180deg); the script plays the "lift
     and flip" keyframes on top of it: the card rises toward you with a growing
     shadow, tilts, overshoots and settles (900ms), and the reverse back. The
     face that is turned away is `inert`, so its links and button are out of the
     tab order and the reading order. Clicking anywhere on a card that is not a
     link turns it, and so does its corner button (the keyboard way); focus
     follows to the other face's button. With reduced motion it simply
     switches. The looping copy is kept in step, and a filter turns every card
     back to its front. */
  var FLIP_MS = 900;
  /* the lift-and-flip as a table: at each offset, how far the card has risen (z, px), its scale,
     its tilt (rx, deg) and the angle of the FRONT face going forward (a, deg; passes 90 at offset
     CROSS, which is when the face that was turned away appears and the other disappears) */
  var STEPS = [
    { o: 0,    z: 0,  s: 1,    rx: 0, a: 0 },
    { o: 0.35, z: 80, s: 1.1,  rx: 8, a: 80 },
    { o: 0.72, z: 40, s: 1.06, rx: 4, a: 194 },
    { o: 0.88, z: 0,  s: 1,    rx: 0, a: 176 },
    { o: 1,    z: 0,  s: 1,    rx: 0, a: 180 }
  ];
  var CROSS = 0.3825;
  function lerp(x, y, u) { return x + (y - x) * u; }
  var U = (CROSS - STEPS[1].o) / (STEPS[2].o - STEPS[1].o);
  var EDGE = { o: CROSS, z: lerp(STEPS[1].z, STEPS[2].z, U), s: lerp(STEPS[1].s, STEPS[2].s, U), rx: lerp(STEPS[1].rx, STEPS[2].rx, U), a: 90 };
  var TIMELINE = [STEPS[0], STEPS[1], EDGE, Object.assign({}, EDGE, { o: CROSS + 0.0001 }), STEPS[2], STEPS[3], STEPS[4]];
  /* keyframes for both faces. Going over (on = true) the front is visible until the edge-on moment and the back
     after it; coming back it is the other way round. The turn carries on in the SAME direction coming back (the front's angle goes 180 -> 360, so two presses are one full spin), not back the way it came. The back's angle is always the front's minus 180. */
  function frames(on) {
    var front = [], back = [];
    TIMELINE.forEach(function (st) {
      var first = st.o <= CROSS, fa = on ? st.a : 180 + st.a;
      var t = function (ang) { return "translateZ(" + st.z + "px) scale(" + st.s + ") rotateX(" + st.rx + "deg) rotateY(" + ang + "deg)"; };
      var frontVisible = on ? first : !first;
      front.push({ offset: st.o, transform: t(fa), visibility: frontVisible ? "visible" : "hidden" });
      back.push({ offset: st.o, transform: t(fa - 180), visibility: frontVisible ? "hidden" : "visible" });
    });
    return { front: front, back: back };
  }
  var SHADOW = [
    { filter: "drop-shadow(0 4px 6px rgba(0,0,0,0))", offset: 0 },
    { filter: "drop-shadow(0 34px 30px rgba(0,0,0,.32))", offset: 0.4 },
    { filter: "drop-shadow(0 4px 6px rgba(0,0,0,0))", offset: 1 }
  ];

  function setFlipped(card, on) {
    card.classList.toggle("is-flipped", on);
    var f = card.querySelector(".st__face--front"), b = card.querySelector(".st__face--back");
    if (f) { f.inert = on; }
    if (b) { b.inert = !on; }
  }
  setFlipped.init = function () { cards.concat(clones).forEach(function (c) { setFlipped(c, false); }); };
  setFlipped.init();

  function flip(card, on) {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var i = cards.indexOf(card), twin = i === -1 ? clones[clones.indexOf(card)] : clones[i];
    var hadFocus = card.contains(document.activeElement) && document.activeElement.classList.contains("st__flip");
    setFlipped(card, on);
    if (twin) { setFlipped(twin, on); }
    kick();
    // focus follows to the other face's button — once the turn is over, because while it runs the
    // face that is turning away is `visibility: hidden` and a focused element there loses focus
    function refocus() { if (hadFocus) { card.querySelector(on ? ".st__face--back .st__flip" : ".st__face--front .st__flip").focus({ preventScroll: true }); } }
    if (reduce || !card.animate) { refocus(); return; }
    card._flipping = true;
    kick();                    // (re)decide which rows may drift now that this card's row is being turned
    var kf = frames(on);
    var a = card.querySelector(".st__face--front").animate(kf.front, { duration: FLIP_MS, easing: "ease-out" });
    card.querySelector(".st__face--back").animate(kf.back, { duration: FLIP_MS, easing: "ease-out" });
    card.animate(SHADOW, { duration: FLIP_MS, easing: "linear" });
    a.onfinish = a.oncancel = function () { card._flipping = false; refocus(); kick(); };
  }

  track.addEventListener("click", function (e) {
    var card = e.target.closest(".st");
    if (!card || card._flipping || e.target.closest("a")) { return; }
    flip(card, !card.classList.contains("is-flipped"));
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
    setFlipped.init();
    layout();
    resetRows();
    count.textContent = !val ? "" :
      (shown ? "Showing " + shown + " of " + cards.length + " staff." : "No staff under this tag yet — more are being added.");
  });

  /* ---------- the slow drift, right to left — each row on its own ----------
     A second copy of the cards sits after the first (.st__clones); every position
     is taken modulo one copy's width (loopWidth), which looks the same, so the
     loop has no seam. The two rows have a position each (xTop, xLow). The track's
     scrollLeft carries the top row's; the bottom row is the top row plus a lag,
     applied as a transform (--rx-low, used by .st--low in staff.css). A row that
     is HELD stands still while the other carries on, so the lag between the rows
     builds up and the staggered pattern is not kept after one has been held.
     A row is held while the pointer is over it, while keyboard focus is in one of
     its cards, or while one of its cards is turned over or turning. Hover and
     focus are tracked separately: a button losing focus mid-turn must not release
     a row the pointer is still on (that let the drift run on for about a second
     after the flip button was pressed). Arrows, swipe and wheel move both rows
     (absorb). It runs only while Connect is open, and not at all for reduced
     motion, in the few-staff mode, or when every card already fits. */
  var SPEED = 28;                       // px per second
  var open = false, last = 0, raf = 0, setTo = 0, xTop = 0, xLow = 0;
  var hoverRow = null, focusRow = null;           // "top" | "low" | "both" | null
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");

  function loopWidth() {
    var first = cards.filter(function (c) { return !c.hidden; })[0];
    var firstClone = clones.filter(function (c) { return !c.hidden; })[0];
    return first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0;
  }
  function fits() { return loopWidth() <= track.clientWidth + 1; }

  function wrapW(x, w) { return w > 0 ? ((x % w) + w) % w : x; }
  function rowOf(el) { return el.classList.contains("st--low") ? "low" : "top"; }

  /* someone other than the drift moved the track (arrows, swipe, wheel): both rows go with it */
  function absorb() {
    if (Math.abs(track.scrollLeft - setTo) <= 1) { return; }      // our own write, give or take rounding
    var d = track.scrollLeft - wrapW(xTop, loopWidth());          // measured from the exact position, not the rounded read-back
    xTop += d; xLow += d;
  }
  function render() {
    var w = loopWidth();
    if (!w || isStatic) { track.style.setProperty("--rx-low", "0px"); return; }
    var s = wrapW(xTop, w);
    track.scrollLeft = s;
    setTo = track.scrollLeft;
    track.style.setProperty("--rx-low", (wrapW(xLow, w) - s) + "px");
  }
  function resetRows() {
    xTop = 0; xLow = 0; track.scrollLeft = 0; setTo = 0;
    track.style.setProperty("--rx-low", "0px");
  }

  function heldRows() {
    var h = { top: false, low: false };
    function mark(r) { if (r === "both") { h.top = true; h.low = true; } else if (r) { h[r] = true; } }
    mark(hoverRow); mark(focusRow);
    cards.concat(clones).forEach(function (c) {
      if (!c.hidden && (c.classList.contains("is-flipped") || c._flipping)) { mark(rowOf(c)); }
    });
    return h;
  }
  function wanted() {
    if (!open || sliding || isStatic || (still && still.matches) || fits()) { return false; }
    var h = heldRows();
    return !(h.top && h.low);
  }

  function frame(now) {
    raf = 0;
    if (!wanted()) { last = 0; return; }
    var dt = last ? Math.min(now - last, 100) : 0;
    last = now;
    absorb();
    var h = heldRows(), dx = SPEED * dt / 1000;
    if (!h.top) { xTop += dx; }
    if (!h.low) { xLow += dx; }
    render();
    raf = requestAnimationFrame(frame);
  }

  function kick() { if (!raf && wanted()) { last = 0; raf = requestAnimationFrame(frame); } }

  /* which row is the pointer on? above the line halfway between the rows = top */
  function rowAt(y) {
    var vis = cards.filter(function (c) { return !c.hidden; });
    var top = vis.filter(function (c) { return !c.classList.contains("st--low"); })[0];
    var low = vis.filter(function (c) { return c.classList.contains("st--low"); })[0];
    if (!top || !low) { return "top"; }
    return y < (top.getBoundingClientRect().bottom + low.getBoundingClientRect().top) / 2 ? "top" : "low";
  }
  function pointerOn(e) {
    // a real pointer event has coordinates; a bare synthetic "pointerenter" (used by tests and previews) holds both rows
    var r = typeof e.clientY === "number" ? rowAt(e.clientY) : "both";
    if (r !== hoverRow) { hoverRow = r; kick(); }      // moving from one row to the other frees the one left behind
  }
  track.addEventListener("pointerenter", pointerOn);
  track.addEventListener("pointermove", pointerOn);
  track.addEventListener("pointerleave", function () { hoverRow = null; kick(); });
  track.addEventListener("focusin", function (e) { var c = e.target.closest && e.target.closest(".st"); focusRow = c ? rowOf(c) : "both"; kick(); });
  track.addEventListener("focusout", function () { focusRow = null; kick(); });

  /* the track moved (arrows, swipe, wheel, or the drift itself): keep both rows' positions and the wrap in step */
  track.addEventListener("scroll", function () { absorb(); render(); });

  document.addEventListener("biosoc:page", function (event) {
    open = event.detail.id === "connect";
    if (open) { fitCards(); kick(); }
  });
})();
