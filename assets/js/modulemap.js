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

  /** core | selected | optional | unavailable, for the degree on screen. */
  function statusOf(m) {
    var d = degree();
    if ((d.core[slotOf(m)] || []).indexOf(m.code) !== -1) { return "core"; }
    if ((d.excluded || []).indexOf(m.code) !== -1) { return "unavailable"; }
    return state.picks[slotOf(m)].indexOf(m.code) !== -1 ? "selected" : "optional";
  }

  function creditsIn(slot) {
    return DATA.modules.reduce(function (sum, m) {
      if (slotOf(m) !== slot) { return sum; }
      var st = statusOf(m);
      return (st === "core" || st === "selected") ? sum + m.credits : sum;
    }, 0);
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
        return (deg.core[c.id] || []).indexOf(code) === -1 &&
               (deg.excluded || []).indexOf(code) === -1;
      });
    });
  }

  /** Drop picks that the newly chosen degree cannot take. */
  function prunePicks() {
    COLUMNS.forEach(function (c) {
      state.picks[c.id] = state.picks[c.id].filter(function (code) {
        var st = statusOf(byCode[code]);
        return st === "selected" || st === "optional";
      });
    });
  }

  /* ---------- rendering ---------- */

  function degreeButtons() {
    return DATA.degrees.map(function (d) {
      var on = d.id === state.degree;
      return '<button class="dbtn' + (on ? " is-on" : "") + '" type="button" role="tab"' +
             ' aria-selected="' + on + '" data-degree="' + d.id + '" style="--dh:' + d.hue + '">' +
             esc(d.name) + '</button>';
    }).join("");
  }

  function box(m) {
    var st = statusOf(m);
    var units = m.credits / 15;
    var interactive = st === "optional" || st === "selected";
    var full = creditsIn(slotOf(m)) >= CAP;
    var wouldOverflow = st === "optional" && creditsIn(slotOf(m)) + m.credits > CAP;
    var label = {
      core: "Core", selected: "Chosen", optional: "Optional", unavailable: "Not available"
    }[st];

    /* ● core, ✓ chosen, ✕ not available — so the state reads without colour */
    var glyph = { core: "\u25CF", selected: "\u2713", unavailable: "\u2715", optional: "" }[st];

    return '<li class="cell" style="--units:' + units + ';--clamp:' + (units === 2 ? 5 : 2) + '">' +
      '<button class="box box--' + st + (wouldOverflow ? " box--tight" : "") + '" type="button"' +
        ' data-toggle="' + m.code + '"' +
        (interactive ? ' aria-pressed="' + (st === "selected") + '"' : ' disabled') +
        ' title="' + esc(m.code + " — " + m.title + " · " + m.credits + " credits · " + label) + '">' +
        '<span class="box__head">' +
          '<span class="box__code">' + esc(m.code) + '</span>' +
          '<span class="box__cr">' + m.credits + '</span>' +
        '</span>' +
        '<span class="box__title">' + esc(m.title) + '</span>' +
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
      return b.credits - a.credits || a.code.localeCompare(b.code);
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
    var label = { core: "Core for this degree", selected: "Chosen",
                  optional: "Optional for this degree", unavailable: "Not available on this degree" }[st];

    return '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">' +
      '<div class="sheet__card">' +
        '<button class="sheet__close" type="button" data-close aria-label="Close">&times;</button>' +
        '<p class="sheet__eyebrow">' + esc(m.code) + ' &middot; Year ' + m.year + ', Semester ' + m.semester + '</p>' +
        '<h3 class="sheet__title" id="sheet-title" tabindex="-1">' + esc(m.title) + '</h3>' +
        '<p class="sheet__tags">' +
          '<span class="tag tag--' + st + '">' + label + '</span>' +
          '<span class="tag">' + m.credits + ' credits</span>' +
          '<span class="tag">' + esc(themeLabel[m.theme] || "") + '</span>' +
        '</p>' +
        (m.about ? '<p class="sheet__about">' + esc(m.about) + '</p>' : "") +
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
      '<div class="mm__degrees" role="tablist" aria-label="Degree">' + degreeButtons() + '</div>' +
      (d.note ? '<p class="mm__note">' + esc(d.note) + '</p>' : "") +
      '<div class="mm__legend">' +
        '<span class="key key--core">Core</span>' +
        '<span class="key key--selected">Chosen</span>' +
        '<span class="key key--optional">Optional</span>' +
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
      var slot = slotOf(m);
      var at = state.picks[slot].indexOf(m.code);
      if (at !== -1) {
        state.picks[slot].splice(at, 1);
        say(m.code + " dropped");
      } else if (creditsIn(slot) + m.credits > CAP) {
        say(m.code + " would take " + slot.toUpperCase() + " over " + CAP + " credits");
        return;
      } else {
        state.picks[slot].push(m.code);
        say(m.code + " taken");
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
