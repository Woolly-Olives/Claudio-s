/* =============================================================
   Customise Your Degree — whole-degree module map.

   Every module in the School sits on one screen. Six columns run left
   to right, Year 1 Semester 1 through Year 3 Semester 2; within a
   column the modules stack top to bottom, each box as tall as it is
   heavy (a 30-credit module is drawn double a 15-credit one).

   Three clicks, and no more, do everything:
     1  a degree button  — recolours the whole board for that degree
     2  a module box     — takes or drops an optional module
     3  a module's "i"   — opens its details

   Everything comes from assets/data/curriculum.js. Nothing here needs
   editing to add a module or a degree.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_CURRICULUM;
  var root = document.getElementById("module-map");
  if (!root || !DATA) { return; }

  var CAP = DATA.meta.creditsPerSemester || 60;
  var COLUMNS = [
    { id: "y1s1", year: 1, semester: 1 }, { id: "y1s2", year: 1, semester: 2 },
    { id: "y2s1", year: 2, semester: 1 }, { id: "y2s2", year: 2, semester: 2 },
    { id: "y3s1", year: 3, semester: 1 }, { id: "y3s2", year: 3, semester: 2 }
  ];

  var byCode = {};
  DATA.modules.forEach(function (m) { byCode[m.code] = m; });
  var themeLabel = {};
  DATA.themes.forEach(function (t) { themeLabel[t.id] = t.label; });

  var state = { degree: DATA.degrees[0].id, picks: {}, open: null };
  COLUMNS.forEach(function (c) { state.picks[c.id] = []; });

  /* ---------- model ---------- */

  function degree() {
    return DATA.degrees.filter(function (d) { return d.id === state.degree; })[0] || DATA.degrees[0];
  }

  function slotOf(m) { return "y" + m.year + "s" + m.semester; }

  function modulesIn(col) {
    return DATA.modules.filter(function (m) {
      return m.year === col.year && m.semester === col.semester;
    });
  }

  /** Modules with no recorded title say so, rather than showing a gap. */
  function titleOf(m) { return m.title || "Title to be added"; }

  /** Members of a linked group, in column order. */
  function linkGroup(m) {
    if (!m.linked) { return [m]; }
    return DATA.modules.filter(function (x) { return x.linked === m.linked; })
      .sort(function (a, b) { return (a.year - b.year) || (a.semester - b.semester); });
  }

  /** Which end of a linked shape this box is, if any. */
  function linkClass(m) {
    if (!m.linked) { return ""; }
    var group = linkGroup(m);
    if (group.length < 2) { return ""; }
    if (group[0].code === m.code) { return " box--link-start"; }
    if (group[group.length - 1].code === m.code) { return " box--link-end"; }
    return " box--link-mid";
  }

  /* pairs the handbooks' clash grids mark as impossible to timetable together */
  var CLASH = {};
  (DATA.clashes || []).forEach(function (pair) {
    (CLASH[pair[0]] = CLASH[pair[0]] || []).push(pair[1]);
    (CLASH[pair[1]] = CLASH[pair[1]] || []).push(pair[0]);
  });
  function clashesWith(code) { return CLASH[code] || []; }

  /** Alternatives of which exactly one is compulsory (e.g. BS2032 or BS2033). */
  function altGroups(d, slot) { return (d.coreOneOf && d.coreOneOf[slot]) || []; }

  function isCoreAlt(d, slot, code) {
    return altGroups(d, slot).some(function (g) { return g.indexOf(code) !== -1; });
  }

  /** Every module the degree is certain to be taking in this slot. */
  function fixedIn(d, slot) {
    return (d.core[slot] || []).slice();
  }

  /**
   * core | selected | optional | blocked | unavailable, for the degree on
   * screen. "unavailable" is structural — the handbook does not offer it, or
   * it clashes with something compulsory. "blocked" depends on your own
   * choices so far, and clears when you drop the module causing it.
   */
  function statusOf(m) {
    var d = degree();
    var slot = slotOf(m);
    if ((d.core[slot] || []).indexOf(m.code) !== -1) { return "core"; }
    if (isCoreAlt(d, slot, m.code)) { return "core"; }
    var opts = (d.options && d.options[slot]) || [];
    if (opts.indexOf(m.code) === -1) { return "unavailable"; }
    if (state.picks[slot].indexOf(m.code) !== -1) { return "selected"; }
    if (fixedIn(d, slot).some(function (c) { return clashesWith(m.code).indexOf(c) !== -1; })) {
      return "unavailable";
    }
    if (state.picks[slot].some(function (c) { return clashesWith(m.code).indexOf(c) !== -1; })) {
      return "blocked";
    }
    return "optional";
  }

  /** Plain-English reason a module is not open, for the details panel. */
  function reasonFor(m) {
    var d = degree();
    var slot = slotOf(m);
    var opts = (d.options && d.options[slot]) || [];
    if (opts.indexOf(m.code) === -1 && (d.core[slot] || []).indexOf(m.code) === -1
        && !isCoreAlt(d, slot, m.code)) {
      return "This degree\u2019s handbook does not list it for this semester.";
    }
    var hardClash = fixedIn(d, slot).filter(function (c) { return clashesWith(m.code).indexOf(c) !== -1; });
    if (hardClash.length) {
      return "It clashes with " + hardClash.join(", ") + ", which is compulsory for this degree.";
    }
    var soft = state.picks[slot].filter(function (c) { return clashesWith(m.code).indexOf(c) !== -1; });
    if (soft.length) { return "It clashes with " + soft.join(", ") + ", which you have taken."; }
    return "";
  }

  function creditsIn(slot) {
    var d = degree();
    var sum = (d.core[slot] || []).reduce(function (a, c) {
      return a + (byCode[c] ? byCode[c].credits : 0);
    }, 0);
    /* exactly one of each alternatives group is taken, so count it once */
    altGroups(d, slot).forEach(function (g) {
      if (g.length && byCode[g[0]]) { sum += byCode[g[0]].credits; }
    });
    return state.picks[slot].reduce(function (a, c) {
      return a + (byCode[c] ? byCode[c].credits : 0);
    }, sum);
  }

  /** Degrees that require this module — shown in the details panel. */
  function requiredBy(code) {
    return DATA.degrees.filter(function (d) {
      return Object.keys(d.core).some(function (k) { return d.core[k].indexOf(code) !== -1; });
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- URL state ---------- */

  function writeUrl() {
    var params = new URLSearchParams();
    params.set("degree", state.degree);
    var any = false;
    COLUMNS.forEach(function (c) {
      if (state.picks[c.id].length) { params.set(c.id, state.picks[c.id].join(".")); any = true; }
    });
    var qs = (state.degree === DATA.degrees[0].id && !any) ? "" : "?" + params.toString();
    history.replaceState(null, "", location.pathname + qs + location.hash);
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    var d = params.get("degree");
    if (d && DATA.degrees.some(function (x) { return x.id === d; })) { state.degree = d; }
    COLUMNS.forEach(function (c) {
      var raw = params.get(c.id);
      if (!raw) { return; }
      state.picks[c.id] = raw.split(".").filter(function (code) {
        var m = byCode[code];
        if (!m || slotOf(m) !== c.id) { return false; }
        var deg = degree();
        var opts = (deg.options && deg.options[c.id]) || [];
        return opts.indexOf(code) !== -1 &&
               !fixedIn(deg, c.id).some(function (x) { return clashesWith(code).indexOf(x) !== -1; });
      });
    });
  }

  /** Drop picks that the newly chosen degree cannot take. */
  function prunePicks() {
    COLUMNS.forEach(function (c) {
      state.picks[c.id] = state.picks[c.id].filter(function (code) {
        var d = degree();
        var opts = (d.options && d.options[c.id]) || [];
        if (opts.indexOf(code) === -1) { return false; }
        return !fixedIn(d, c.id).some(function (x) { return clashesWith(code).indexOf(x) !== -1; });
      });
    });
  }

  /* ---------- rendering ---------- */

  function degreeById(id) {
    return DATA.degrees.filter(function (d) { return d.id === id; })[0];
  }

  /**
   * Buttons sit in the columns meta.degreeLayout asks for, each column
   * pairing a subject with its Medical counterpart. A column holding one
   * degree spans both rows rather than leaving a hole. Anything the layout
   * forgets is appended, so a new degree never vanishes from the page.
   */
  function degreeButtons() {
    var layout = (DATA.meta.degreeLayout || []).map(function (col) {
      return col.filter(degreeById);
    }).filter(function (col) { return col.length; });

    var placed = {};
    layout.forEach(function (col) { col.forEach(function (id) { placed[id] = true; }); });
    var missed = DATA.degrees.filter(function (d) { return !placed[d.id]; });
    if (missed.length) {
      missed.forEach(function (d) { layout.push([d.id]); });
    }

    var rows = layout.reduce(function (n, col) { return Math.max(n, col.length); }, 1);

    return layout.map(function (col) {
      return '<div class="dcol">' + col.map(function (id) {
        var d = degreeById(id);
        var on = d.id === state.degree;
        var span = (col.length === 1 && rows > 1) ? ' dbtn--tall' : '';
        return '<button class="dbtn' + (on ? " is-on" : "") + span + '" type="button" role="tab"' +
               ' aria-selected="' + on + '" data-degree="' + d.id + '" style="--dh:' + d.hue + '">' +
               esc(d.name) + '</button>';
      }).join("") + '</div>';
    }).join("");
  }

  function box(m) {
    var st = statusOf(m);
    var units = m.credits / 15;
    var interactive = st === "optional" || st === "selected";
    var wouldOverflow = st === "optional" && creditsIn(slotOf(m)) + m.credits > CAP;
    var alt = st === "core" && isCoreAlt(degree(), slotOf(m), m.code);
    var label = alt ? "Core \u2014 one of" : {
      core: "Core", selected: "Chosen", optional: "Optional",
      blocked: "Clashes", unavailable: "Not available"
    }[st];

    /* ● core, ✓ chosen, ✕ not available — so the state reads without colour */
    var glyph = { core: "\u25CF", selected: "\u2713", unavailable: "\u2715",
                  blocked: "\u2298", optional: "" }[st];

    var link = linkClass(m);
    var shown = m.display || m.code;

    return '<li class="cell' + (link ? " cell--linked" : "") +
      '" style="--units:' + units + ';--clamp:' + (units === 2 ? 5 : 2) + '">' +
      '<button class="box box--' + st + (wouldOverflow ? " box--tight" : "") + link + '" type="button"' +
        ' data-toggle="' + m.code + '"' +
        (interactive ? ' aria-pressed="' + (st === "selected") + '"' : ' disabled') +
        ' title="' + esc(shown + " — " + titleOf(m) + " · " + m.credits + " credits · " + label) + '">' +
        '<span class="box__head">' +
          '<span class="box__code">' + esc(shown) + '</span>' +
          '<span class="box__cr">' + m.credits + '</span>' +
        '</span>' +
        '<span class="box__title' + (m.title ? "" : " box__title--missing") + '">' +
          esc(titleOf(m)) + '</span>' +
        '<span class="box__state"' + (glyph ? '' : ' hidden') + ' aria-hidden="true">' + glyph + '</span>' +
        '<span class="visually-hidden">' + label + '</span>' +
      '</button>' +
      '<button class="box__info" type="button" data-info="' + m.code + '"' +
        ' aria-label="About ' + esc(m.code) + ' ' + esc(m.title) + '">i</button>' +
    '</li>';
  }

  function column(col) {
    var used = creditsIn(col.id);
    var status = used === CAP ? "full" : (used > CAP ? "over" : "under");
    var mods = modulesIn(col).slice().sort(function (a, b) {
      /* a linked module leads its column, so the two halves of a year-long
         module sit at the same height and read as one shape */
      return (b.linked ? 1 : 0) - (a.linked ? 1 : 0) ||
             b.credits - a.credits || a.code.localeCompare(b.code);
    });
    return '<section class="col" data-col="' + col.id + '">' +
             '<header class="col__head">' +
               '<h3 class="col__name">Year ' + col.year + '<span>Semester ' + col.semester + '</span></h3>' +
               '<p class="col__cr col__cr--' + status + '"><strong>' + used + '</strong>/' + CAP + '</p>' +
             '</header>' +
             '<ul class="col__list">' + mods.map(box).join("") + '</ul>' +
           '</section>';
  }

  function details() {
    if (!state.open) { return ""; }
    var m = byCode[state.open];
    if (!m) { return ""; }
    var st = statusOf(m);
    var needs = requiredBy(m.code);
    var altPair = isCoreAlt(degree(), slotOf(m), m.code)
      ? altGroups(degree(), slotOf(m)).filter(function (g) { return g.indexOf(m.code) !== -1; })[0]
      : null;
    var label = altPair ? "Core \u2014 one of these" : { core: "Core for this degree", selected: "Chosen",
                  optional: "Optional for this degree", blocked: "Clashes with a module you have taken",
                  unavailable: "Not available on this degree" }[st];
    var reason = (st === "unavailable" || st === "blocked") ? reasonFor(m) : "";
    var inGroups = (degree().groups || []).filter(function (g) {
      return g.members.indexOf(m.code) !== -1;
    });
    var group = linkGroup(m);
    var whole = group.reduce(function (a, x) { return a + x.credits; }, 0);
    var split = group.length > 1
      ? group.map(function (x) { return x.credits + " in Semester " + x.semester; }).join(", ")
      : "";

    return '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">' +
      '<div class="sheet__card">' +
        '<button class="sheet__close" type="button" data-close aria-label="Close">&times;</button>' +
        '<p class="sheet__eyebrow">' + esc(m.display || m.code) +
          ' &middot; Year ' + m.year + ', Semester ' + m.semester + '</p>' +
        '<h3 class="sheet__title" id="sheet-title" tabindex="-1">' + esc(titleOf(m)) + '</h3>' +
        '<p class="sheet__tags">' +
          '<span class="tag tag--' + st + '">' + label + '</span>' +
          '<span class="tag">' + (group.length > 1 ? whole + ' credits over the year' : m.credits + ' credits') + '</span>' +
          '<span class="tag">' + esc(themeLabel[m.theme] || "") + '</span>' +
        '</p>' +
        (altPair ? '<p class="sheet__about"><strong>One of ' + esc(altPair.join(" or ")) +
                   '</strong> is compulsory for this degree \u2014 you take one, not both.</p>' : "") +
        (reason ? '<p class="sheet__about sheet__why">' + esc(reason) + '</p>' : "") +
        (inGroups.length ? '<p class="sheet__about"><strong>' + esc(inGroups[0].label) + ':</strong> ' +
                 esc(inGroups[0].members.join(", ")) + '.</p>' : "") +
        (m.field ? '<p class="sheet__about">Includes a field course &mdash; check the handbook for dates and costs.</p>' : "") +
        (split ? '<p class="sheet__about"><strong>Year-long module</strong> &mdash; ' +
                 esc(split) + '.</p>' : "") +
        (m.about ? '<p class="sheet__about">' + esc(m.about) + '</p>' : "") +
        (m.title ? "" : '<p class="sheet__about">The title for this module is not recorded here yet.</p>') +
        '<p class="sheet__req"><strong>Required by:</strong> ' +
          (needs.length ? needs.map(function (d) { return esc(d.name); }).join(", ")
                        : "no degree — it is optional throughout") + '</p>' +
      '</div>' +
    '</div>';
  }

  function render() {
    var d = degree();
    root.style.setProperty("--dh", d.hue);
    root.innerHTML =
      (DATA.meta.sampleData
        ? '<p class="mm__sample"><strong>Sample data</strong> &mdash; placeholder modules, not the ' +
          'School’s real catalogue. Replace <code>assets/data/curriculum.js</code>.</p>'
        : "") +
      /* nothing here may vary in height between degrees, or the board
         shifts under the pointer when you switch */
      '<div class="mm__degrees" role="tablist" aria-label="Degree">' + degreeButtons() + '</div>' +
      '<div class="mm__legend">' +
        '<span class="key key--core">Core</span>' +
        '<span class="key key--selected">Chosen</span>' +
        '<span class="key key--optional">Optional</span>' +
        '<span class="key key--blocked">Clashes with a choice</span>' +
        '<span class="key key--unavailable">Not available</span>' +
        '<span class="mm__hint">Click a module to take it &middot; “i” for details</span>' +
      '</div>' +
      '<div class="mm__board">' + COLUMNS.map(column).join("") + '</div>' +
      details() +
      '<p class="mm__live" role="status" aria-live="polite">' + esc(root.dataset.say || "") + '</p>';

    if (state.open) {
      var h = root.querySelector(".sheet__title");
      if (h) { h.focus({ preventScroll: true }); }
    }
  }

  function say(msg) {
    root.dataset.say = msg;
    var live = root.querySelector(".mm__live");
    if (live) { live.textContent = msg; }
  }

  /* ---------- interaction ---------- */

  root.addEventListener("click", function (event) {
    var t = event.target.closest("button");
    if (t && t.dataset.degree) {
      state.degree = t.dataset.degree;
      prunePicks();
      writeUrl();
      render();
      say(t.textContent + " selected");
      return;
    }
    if (t && t.dataset.info) { state.open = t.dataset.info; render(); return; }
    if (t && (t.hasAttribute("data-close"))) { closeSheet(); return; }
    if (t && t.dataset.toggle) {
      var m = byCode[t.dataset.toggle];
      /* a year-long module is one decision, not two */
      var group = linkGroup(m);
      var name = m.display || m.code;

      if (state.picks[slotOf(m)].indexOf(m.code) !== -1) {
        group.forEach(function (x) {
          var list = state.picks[slotOf(x)];
          var at = list.indexOf(x.code);
          if (at !== -1) { list.splice(at, 1); }
        });
        say(name + " dropped");
      } else {
        var noRoom = group.filter(function (x) { return creditsIn(slotOf(x)) + x.credits > CAP; });
        if (noRoom.length) {
          say(name + " would take " + slotOf(noRoom[0]).toUpperCase() + " over " + CAP + " credits");
          return;
        }
        var bad = group.filter(function (x) { return statusOf(x) === "blocked" || statusOf(x) === "unavailable"; });
        if (bad.length) { say(name + " \u2014 " + reasonFor(bad[0])); return; }
        group.forEach(function (x) {
          if (state.picks[slotOf(x)].indexOf(x.code) === -1) { state.picks[slotOf(x)].push(x.code); }
        });
        say(name + " taken");
      }
      writeUrl();
      render();
      return;
    }
    /* a click on the backdrop, outside the card, closes the details */
    if (state.open && event.target.classList.contains("sheet")) { closeSheet(); }
  });

  function closeSheet() {
    var code = state.open;
    state.open = null;
    render();
    var back = root.querySelector('[data-info="' + code + '"]');
    if (back) { back.focus({ preventScroll: true }); }
  }

  /*
   * app.js closes the whole section on Escape. When the details panel is
   * open, Escape should close only the panel — capture the key first and
   * stop it reaching that handler.
   */
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !state.open) { return; }
    event.stopPropagation();
    event.preventDefault();
    closeSheet();
  }, true);

  /* the plan survives leaving the section and coming back */
  function reassert() {
    if (location.hash.replace(/^#\/?/, "") !== "customise-your-degree") { return; }
    var any = COLUMNS.some(function (c) { return state.picks[c.id].length; });
    if (any || state.degree !== DATA.degrees[0].id) { writeUrl(); }
  }
  window.addEventListener("hashchange", reassert);
  window.addEventListener("popstate", reassert);

  readUrl();
  if (location.search) { writeUrl(); }   // normalise anything the link got wrong
  render();
})();
