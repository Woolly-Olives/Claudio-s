/* =============================================================
   Customise Your Degree — module combination planner.

   Two views over the same catalogue (assets/data/curriculum.js):

     Plan    pick a degree, then fill each semester up to 60 credits.
             Core modules are locked in; everything else is yours to
             choose from the School pool. Shows how many valid
             combinations each semester still has.

     Compare a matrix of every module against every degree, so you can
             see at a glance what each degree fixes and what it leaves
             open.

   The chosen plan lives in the URL's query string, so a plan can be
   copied and shared. The section's #hash is untouched, which keeps the
   wheel's routing in app.js working unchanged.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_CURRICULUM;
  var root = document.getElementById("planner");
  if (!root || !DATA) { return; }

  var CAP = DATA.meta.creditsPerSemester || 60;
  var SLOTS = [
    { id: "y2s1", year: 2, semester: 1, label: "Year 2", sub: "Semester 1" },
    { id: "y2s2", year: 2, semester: 2, label: "Year 2", sub: "Semester 2" },
    { id: "y3s1", year: 3, semester: 1, label: "Year 3", sub: "Semester 1" },
    { id: "y3s2", year: 3, semester: 2, label: "Year 3", sub: "Semester 2" }
  ];
  /* above this many options, counting every subset is not worth the work */
  var COMBO_LIMIT = 24;

  var byCode = {};
  DATA.modules.forEach(function (m) { byCode[m.code] = m; });
  var themeLabel = {};
  DATA.themes.forEach(function (t) { themeLabel[t.id] = t.label; });

  var state = {
    view: "plan",
    degree: DATA.degrees[0].id,
    slot: "y2s1",
    theme: "all",
    query: "",
    picks: { y2s1: [], y2s2: [], y3s1: [], y3s2: [] }
  };

  /* ---------- helpers ---------- */

  function degree() {
    return DATA.degrees.filter(function (d) { return d.id === state.degree; })[0] || DATA.degrees[0];
  }

  function coreFor(slot) {
    return (degree().core[slot] || []).map(function (c) { return byCode[c]; }).filter(Boolean);
  }

  function credits(list) {
    return list.reduce(function (sum, m) { return sum + m.credits; }, 0);
  }

  function picked(slot) {
    return state.picks[slot].map(function (c) { return byCode[c]; }).filter(Boolean);
  }

  function usedIn(slot) { return credits(coreFor(slot)) + credits(picked(slot)); }

  /** Modules a degree may still choose for a slot (core excluded). */
  function optionsFor(slot) {
    var d = degree();
    var s = SLOTS.filter(function (x) { return x.id === slot; })[0];
    var core = (d.core[slot] || []);
    return DATA.modules.filter(function (m) {
      if (m.year !== s.year || m.semester !== s.semester) { return false; }
      if (core.indexOf(m.code) !== -1) { return false; }
      if (d.restrictTo && d.restrictTo.indexOf(m.code) === -1) { return false; }
      return true;
    });
  }

  /**
   * How many distinct sets of optional modules fill this slot exactly.
   * Returns null when there are too many options to count cheaply.
   */
  function combinationsFor(slot) {
    var target = CAP - credits(coreFor(slot));
    if (target < 0) { return 0; }
    if (target === 0) { return 1; }
    var opts = optionsFor(slot);
    if (opts.length > COMBO_LIMIT) { return null; }
    var counts = {};
    counts[0] = 1;
    opts.forEach(function (m) {
      var next = {};
      Object.keys(counts).forEach(function (sum) {
        var s = Number(sum);
        next[s] = (next[s] || 0) + counts[sum];
        var withM = s + m.credits;
        if (withM <= target) { next[withM] = (next[withM] || 0) + counts[sum]; }
      });
      counts = next;
    });
    return counts[target] || 0;
  }

  function totalCombinations() {
    var total = 1;
    var exact = true;
    SLOTS.forEach(function (s) {
      var n = combinationsFor(s.id);
      if (n === null) { exact = false; return; }
      total *= n;
    });
    return { total: total, exact: exact };
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  function fmt(n) { return n.toLocaleString("en-GB"); }

  /* ---------- URL state ---------- */

  function writeUrl() {
    var params = new URLSearchParams();
    params.set("degree", state.degree);
    var any = false;
    SLOTS.forEach(function (s) {
      if (state.picks[s.id].length) { params.set(s.id, state.picks[s.id].join(".")); any = true; }
    });
    var qs = (state.degree === DATA.degrees[0].id && !any) ? "" : "?" + params.toString();
    history.replaceState(null, "", location.pathname + qs + location.hash);
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    var d = params.get("degree");
    if (d && DATA.degrees.some(function (x) { return x.id === d; })) { state.degree = d; }
    SLOTS.forEach(function (s) {
      var raw = params.get(s.id);
      if (!raw) { return; }
      state.picks[s.id] = raw.split(".").filter(function (code) {
        return optionsFor(s.id).some(function (m) { return m.code === code; });
      });
    });
  }

  /* ---------- rendering ---------- */

  function meter(slot) {
    var used = usedIn(slot);
    var pct = Math.min(100, Math.round((used / CAP) * 100));
    var status = used === CAP ? "full" : (used > CAP ? "over" : "under");
    return '<div class="meter meter--' + status + '">' +
             '<div class="meter__track"><div class="meter__fill" style="width:' + pct + '%"></div></div>' +
             '<p class="meter__label"><strong>' + used + '</strong> / ' + CAP + ' credits</p>' +
           '</div>';
  }

  function moduleRow(m, kind, slot) {
    var locked = kind === "core";
    return '<li class="mrow mrow--' + kind + '" data-theme="' + m.theme + '">' +
             '<span class="mrow__code">' + esc(m.code) + '</span>' +
             '<span class="mrow__title">' + esc(m.title) + '</span>' +
             '<span class="mrow__credits">' + m.credits + '</span>' +
             (locked
               ? '<span class="mrow__lock" title="Required for this degree" aria-label="Required">&#9679;</span>'
               : '<button class="mrow__remove" type="button" data-remove="' + m.code + '" data-slot="' + slot +
                 '" aria-label="Remove ' + esc(m.code) + ' ' + esc(m.title) + '">&times;</button>') +
           '</li>';
  }

  function slotCard(s) {
    var core = coreFor(s.id);
    var chosen = picked(s.id);
    var used = usedIn(s.id);
    var left = CAP - used;
    var combos = combinationsFor(s.id);
    var rows = core.map(function (m) { return moduleRow(m, "core", s.id); })
      .concat(chosen.map(function (m) { return moduleRow(m, "pick", s.id); })).join("");

    var footer;
    if (left > 0) {
      footer = '<p class="slot__gap">' + left + ' credits still to choose' +
        (combos === null ? "" :
          combos === 0 ? ' &middot; no combination fits exactly'
                       : ' &middot; ' + fmt(combos) + ' ' + plural(combos, "way", "ways") + ' to fill it') +
        '</p>';
    } else if (left === 0) {
      footer = '<p class="slot__gap slot__gap--done">Semester complete</p>';
    } else {
      footer = '<p class="slot__gap slot__gap--over">' + Math.abs(left) + ' credits over the limit</p>';
    }

    return '<section class="slot' + (state.slot === s.id ? " is-active" : "") + '" data-slot-card="' + s.id + '">' +
             '<header class="slot__head">' +
               '<h3 class="slot__title">' + s.label + '<span>' + s.sub + '</span></h3>' +
               meter(s.id) +
             '</header>' +
             (rows ? '<ul class="slot__list">' + rows + '</ul>'
                   : '<p class="slot__empty">Nothing chosen yet.</p>') +
             footer +
             '<button class="slot__add" type="button" data-pick-slot="' + s.id + '"' +
               (left <= 0 ? " disabled" : "") + '>' +
               (left <= 0 ? "Full" : "Choose modules") + '</button>' +
           '</section>';
  }

  function poolPanel() {
    var s = SLOTS.filter(function (x) { return x.id === state.slot; })[0];
    var left = CAP - usedIn(state.slot);
    var q = state.query.trim().toLowerCase();

    var opts = optionsFor(state.slot).filter(function (m) {
      if (state.theme !== "all" && m.theme !== state.theme) { return false; }
      if (!q) { return true; }
      return (m.code + " " + m.title).toLowerCase().indexOf(q) !== -1;
    });

    var themes = DATA.themes.filter(function (t) {
      return optionsFor(state.slot).some(function (m) { return m.theme === t.id; });
    });

    var chips = '<button class="tchip' + (state.theme === "all" ? " is-on" : "") +
                '" type="button" data-theme-filter="all">All</button>' +
      themes.map(function (t) {
        return '<button class="tchip' + (state.theme === t.id ? " is-on" : "") +
               '" type="button" data-theme-filter="' + t.id + '">' + esc(t.label) + '</button>';
      }).join("");

    var cards = opts.map(function (m) {
      var on = state.picks[state.slot].indexOf(m.code) !== -1;
      var blocked = !on && m.credits > left;
      return '<button class="opt' + (on ? " is-on" : "") + (blocked ? " is-blocked" : "") + '" type="button"' +
               ' data-toggle="' + m.code + '" aria-pressed="' + on + '"' + (blocked ? " disabled" : "") + '>' +
               '<span class="opt__code">' + esc(m.code) + '</span>' +
               '<span class="opt__title">' + esc(m.title) + '</span>' +
               '<span class="opt__meta"><span class="opt__theme">' + esc(themeLabel[m.theme] || "") + '</span>' +
               '<span class="opt__credits">' + m.credits + ' cr</span></span>' +
               (blocked ? '<span class="opt__note">Would exceed ' + CAP + '</span>' : "") +
             '</button>';
    }).join("");

    return '<section class="pool" id="pool">' +
             '<header class="pool__head">' +
               '<h3>Choose modules &mdash; <span>' + s.label + ', ' + s.sub + '</span></h3>' +
               '<p class="pool__room">' + (left > 0 ? left + " credits of room left" : "No room left") + '</p>' +
             '</header>' +
             '<div class="pool__tabs" role="tablist">' +
               SLOTS.map(function (x) {
                 return '<button class="ptab' + (x.id === state.slot ? " is-on" : "") + '" type="button"' +
                        ' role="tab" aria-selected="' + (x.id === state.slot) + '"' +
                        ' data-pick-slot="' + x.id + '">' + x.label + ' &middot; ' + x.sub + '</button>';
               }).join("") +
             '</div>' +
             '<div class="pool__filters">' +
               '<input class="pool__search" type="search" placeholder="Search modules" ' +
                 'aria-label="Search modules" value="' + esc(state.query) + '" data-search>' +
               '<div class="pool__themes">' + chips + '</div>' +
             '</div>' +
             (opts.length ? '<div class="pool__grid">' + cards + '</div>'
                          : '<p class="pool__none">No modules match that filter.</p>') +
           '</section>';
  }

  function summaryBar() {
    var d = degree();
    var used = SLOTS.reduce(function (a, s) { return a + usedIn(s.id); }, 0);
    var totalCap = CAP * SLOTS.length;
    var combos = totalCombinations();
    var coreCredits = SLOTS.reduce(function (a, s) { return a + credits(coreFor(s.id)); }, 0);

    return '<div class="summary">' +
             '<div class="summary__stat"><span class="summary__num">' + (totalCap - coreCredits) + '</span>' +
               '<span class="summary__cap">credits you choose</span></div>' +
             '<div class="summary__stat"><span class="summary__num">' + coreCredits + '</span>' +
               '<span class="summary__cap">credits fixed by the degree</span></div>' +
             '<div class="summary__stat"><span class="summary__num">' +
               (combos.exact ? fmt(combos.total) : "many") + '</span>' +
               '<span class="summary__cap">valid ' + plural(combos.total, "combination", "combinations") +
               ' across both years</span></div>' +
             '<div class="summary__stat"><span class="summary__num">' + used + ' / ' + totalCap + '</span>' +
               '<span class="summary__cap">credits placed so far</span></div>' +
             (d.note ? '<p class="summary__note">' + esc(d.note) + '</p>' : "") +
           '</div>';
  }

  function comparePanel() {
    var slotRows = SLOTS.map(function (s) {
      var mods = DATA.modules.filter(function (m) {
        return m.year === s.year && m.semester === s.semester;
      });
      var body = mods.map(function (m) {
        var cells = DATA.degrees.map(function (d) {
          var isCore = (d.core[s.id] || []).indexOf(m.code) !== -1;
          var allowed = !d.restrictTo || d.restrictTo.indexOf(m.code) !== -1;
          var cls = isCore ? "cell--core" : (allowed ? "cell--option" : "cell--no");
          var label = isCore ? "Required" : (allowed ? "Optional" : "Not available");
          var glyph = isCore ? "&#9679;" : (allowed ? "&#9675;" : "&middot;");
          return '<td class="' + cls + '"><span class="visually-hidden">' + label + '</span>' +
                 '<span aria-hidden="true" title="' + label + '">' + glyph + '</span></td>';
        }).join("");
        return '<tr><th scope="row"><span class="cmp__code">' + esc(m.code) + '</span>' +
               '<span class="cmp__title">' + esc(m.title) + '</span>' +
               '<span class="cmp__cr">' + m.credits + '</span></th>' + cells + '</tr>';
      }).join("");
      return '<tr class="cmp__band"><th scope="rowgroup" colspan="' + (DATA.degrees.length + 1) + '">' +
             s.label + ' &middot; ' + s.sub + '</th></tr>' + body;
    }).join("");

    var head = DATA.degrees.map(function (d) {
      return '<th scope="col" style="--dh:' + d.hue + '"><span>' + esc(d.name) + '</span></th>';
    }).join("");

    var flex = DATA.degrees.map(function (d) {
      var core = SLOTS.reduce(function (a, s) {
        return a + (d.core[s.id] || []).reduce(function (b, c) {
          return b + (byCode[c] ? byCode[c].credits : 0);
        }, 0);
      }, 0);
      return '<td class="cmp__flex">' + (CAP * SLOTS.length - core) + '</td>';
    }).join("");

    return '<div class="compare">' +
             '<p class="compare__legend">' +
               '<span class="key key--core">&#9679;</span> required by the degree' +
               '<span class="key key--option">&#9675;</span> open to choose' +
               '<span class="compare__scroll-hint">Scroll sideways to see every degree.</span>' +
             '</p>' +
             '<div class="compare__scroll">' +
               '<table class="cmp">' +
                 '<thead><tr><th scope="col" class="cmp__corner">Module</th>' + head + '</tr></thead>' +
                 '<tbody>' + slotRows + '</tbody>' +
                 '<tfoot><tr><th scope="row">Credits left free</th>' + flex + '</tr></tfoot>' +
               '</table>' +
             '</div>' +
           '</div>';
  }

  function render() {
    var d = degree();
    var banner = DATA.meta.sampleData
      ? '<div class="note note--warn"><p><strong>Sample data.</strong> The modules and degrees below are ' +
        'placeholders so the planner can be seen working &mdash; they are <em>not</em> the School’s real ' +
        'catalogue. Replace <code>assets/data/curriculum.js</code> and set <code>sampleData: false</code>.</p></div>'
      : "";

    var degreeOptions = DATA.degrees.map(function (x) {
      return '<option value="' + x.id + '"' + (x.id === state.degree ? " selected" : "") + '>' +
             esc(x.name) + '</option>';
    }).join("");

    root.style.setProperty("--dh", d.hue);
    root.innerHTML =
      banner +
      '<div class="planner__bar">' +
        '<label class="planner__pick"><span>Degree</span>' +
          '<select data-degree>' + degreeOptions + '</select></label>' +
        '<div class="planner__views" role="tablist">' +
          '<button class="vtab' + (state.view === "plan" ? " is-on" : "") + '" type="button" role="tab"' +
            ' aria-selected="' + (state.view === "plan") + '" data-view="plan">Build a plan</button>' +
          '<button class="vtab' + (state.view === "compare" ? " is-on" : "") + '" type="button" role="tab"' +
            ' aria-selected="' + (state.view === "compare") + '" data-view="compare">Compare degrees</button>' +
        '</div>' +
        '<div class="planner__actions">' +
          '<button class="btn" type="button" data-copy>Copy link to this plan</button>' +
          '<button class="btn btn--quiet" type="button" data-reset>Clear choices</button>' +
        '</div>' +
      '</div>' +
      (state.view === "plan"
        ? summaryBar() +
          '<div class="slots">' + SLOTS.map(slotCard).join("") + '</div>' +
          poolPanel()
        : comparePanel()) +
      '<p class="planner__live" role="status" aria-live="polite">' + esc(root.dataset.say || "") + '</p>';
  }

  function say(msg) {
    root.dataset.say = msg;
    var live = root.querySelector(".planner__live");
    if (live) { live.textContent = msg; }
  }

  /* ---------- events ---------- */

  root.addEventListener("click", function (event) {
    var t = event.target.closest("button");
    if (!t) { return; }

    if (t.dataset.view) {
      state.view = t.dataset.view;
      render();
    } else if (t.dataset.pickSlot) {
      state.slot = t.dataset.pickSlot;
      state.query = "";
      render();
      var pool = document.getElementById("pool");
      if (pool) { pool.scrollIntoView({ behavior: "smooth", block: "start" }); }
    } else if (t.dataset.toggle) {
      var code = t.dataset.toggle;
      var list = state.picks[state.slot];
      var at = list.indexOf(code);
      if (at === -1) { list.push(code); say(code + " added"); }
      else { list.splice(at, 1); say(code + " removed"); }
      writeUrl();
      render();
    } else if (t.dataset.remove) {
      var slot = t.dataset.slot;
      var i = state.picks[slot].indexOf(t.dataset.remove);
      if (i !== -1) { state.picks[slot].splice(i, 1); }
      say(t.dataset.remove + " removed");
      writeUrl();
      render();
    } else if (t.dataset.themeFilter) {
      state.theme = t.dataset.themeFilter;
      render();
    } else if (t.hasAttribute("data-reset")) {
      SLOTS.forEach(function (s) { state.picks[s.id] = []; });
      say("Choices cleared");
      writeUrl();
      render();
    } else if (t.hasAttribute("data-copy")) {
      var url = location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { say("Link copied to the clipboard"); },
          function () { say("Could not copy — the link is in the address bar"); }
        );
      } else {
        say("Copy the link from the address bar");
      }
    }
  });

  root.addEventListener("change", function (event) {
    if (event.target.matches("[data-degree]")) {
      state.degree = event.target.value;
      SLOTS.forEach(function (s) {
        state.picks[s.id] = state.picks[s.id].filter(function (code) {
          return optionsFor(s.id).some(function (m) { return m.code === code; });
        });
      });
      writeUrl();
      render();
    }
  });

  root.addEventListener("input", function (event) {
    if (!event.target.matches("[data-search]")) { return; }
    state.query = event.target.value;
    var at = event.target.selectionStart;
    render();
    var field = root.querySelector("[data-search]");
    if (field) { field.focus(); field.setSelectionRange(at, at); }
  });

  /*
   * Leaving the section and coming back rewinds the URL past the plan, while
   * `state` still holds it. Re-assert the plan on the way back in so the
   * address bar keeps matching what is on screen and stays shareable.
   */
  function reassertUrl() {
    if (location.hash.replace(/^#\/?/, "") !== "customise-your-degree") { return; }
    var has = SLOTS.some(function (s) { return state.picks[s.id].length; });
    if (has || state.degree !== DATA.degrees[0].id) { writeUrl(); }
  }

  window.addEventListener("hashchange", reassertUrl);
  window.addEventListener("popstate", reassertUrl);

  readUrl();
  /*
   * A shared link can name a module that this degree already requires, or that
   * belongs to another semester. readUrl() drops those, so rewrite the query
   * string to what was actually accepted rather than leaving the address bar
   * describing a plan that is not on screen.
   */
  if (SLOTS.some(function (s) { return new URLSearchParams(location.search).has(s.id); }) ||
      new URLSearchParams(location.search).has("degree")) {
    writeUrl();
  }
  render();
})();
