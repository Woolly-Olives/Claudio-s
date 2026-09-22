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

  var state = { degree: DATA.degrees[0].id, picks: {}, open: null, showAll: false };
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

  /* ---------- subject-stream colours ---------- */

  var STREAMS = (DATA.meta && DATA.meta.streams) || [];
  var NEUTRAL = (DATA.meta && DATA.meta.neutral) || { core: "#bfbfbf", plain: "#f2f2f2" };
  var UNCOLOURED = (DATA.meta && DATA.meta.uncoloured) || [];

  function isCoreFor(d, code) {
    return Object.keys(d.core).some(function (s) { return d.core[s].indexOf(code) !== -1; }) ||
      Object.keys(d.coreOneOf || {}).some(function (s) {
        return (d.coreOneOf[s] || []).some(function (g) { return g.indexOf(code) !== -1; });
      });
  }

  /**
   * The stream a module belongs to, by the School's own colour key. Where a
   * module is core for several streams the first match wins, and STREAMS is
   * held in the agreed precedence order. Modules core for every degree carry
   * no stream: colouring them would say nothing about specialisation.
   */
  var streamCache = {};
  function streamOf(code) {
    if (streamCache.hasOwnProperty(code)) { return streamCache[code]; }
    var m = byCode[code], found = null;
    if (m && m.stream) {
      /* named outright in the data — Year 1, where every module is core for
         every degree and so has no stream to derive */
      found = STREAMS.filter(function (st) { return st.id === m.stream; })[0] || null;
      streamCache[code] = found;
      return found;
    }
    if (m && m.year !== 1 && UNCOLOURED.indexOf(code) === -1) {
      for (var i = 0; i < STREAMS.length && !found; i++) {
        if (STREAMS[i].degrees.some(function (id) {
          var d = DATA.degrees.filter(function (x) { return x.id === id; })[0];
          return d && isCoreFor(d, code);
        })) { found = STREAMS[i]; }
      }
    }
    streamCache[code] = found;
    return found;
  }

  /** The fill/outline colour for a module, and whether it needs light ink. */
  function paintOf(code) {
    var st = streamOf(code);
    if (st) { return { colour: st.colour, dark: false }; }
    var m = byCode[code];
    if (m && m.schoolCore) { return { colour: NEUTRAL.school, dark: true }; }
    return { colour: NEUTRAL.core, dark: false };
  }

  function streamForDegree(id) {
    return STREAMS.filter(function (st) { return st.degrees.indexOf(id) !== -1; })[0] || null;
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
    if (state.showAll) { params.set("all", "1"); any = true; }
    var qs = (state.degree === DATA.degrees[0].id && !any) ? "" : "?" + params.toString();
    history.replaceState(null, "", location.pathname + qs + location.hash);
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    var d = params.get("degree");
    if (d && DATA.degrees.some(function (x) { return x.id === d; })) { state.degree = d; }
    state.showAll = params.get("all") === "1";
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

  /** Every pick is the previous degree's plan, not necessarily this one's
      — so a degree switch drops all of them rather than keeping whichever
      happen to also be valid under the new degree. */
  function clearPicks() {
    COLUMNS.forEach(function (c) { state.picks[c.id] = []; });
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
        var st = streamForDegree(d.id);
        /* the unspecialised degree draws on every stream, so its outline does too */
        var rainbow = st ? "" : " dbtn--rainbow";
        return '<button class="dbtn' + (on ? " is-on" : "") + span + rainbow + '" type="button" role="tab"' +
               ' aria-selected="' + on + '" data-degree="' + d.id + '"' +
               ' style="--sc:' + (st ? st.colour : NEUTRAL.core) + '">' +
               esc(d.name) + '</button>';
      }).join("") + '</div>';
    }).join("");
  }

  /** The groups this module belongs to, on the degree being shown. */
  function groupsFor(code) {
    return (degree().groups || []).filter(function (g) { return g.members.indexOf(code) !== -1; });
  }

  /** How many of a group's modules are currently taken. */
  function takenIn(g) {
    return g.members.filter(function (c) {
      var m = byCode[c];
      return m && state.picks[slotOf(m)].indexOf(c) !== -1;
    }).length;
  }

  /**
   * Could the degree still reach every grouped-choice minimum if `extra` were
   * taken as well? A student who fills a semester with free options can strand
   * a choice the handbook requires, so that selection is refused outright.
   */
  function groupStaysReachable(extra) {
    return (degree().groups || []).every(function (g) {
      var need = g.min - takenIn(g) - (g.members.indexOf(extra) !== -1 ? 1 : 0);
      if (need <= 0) { return true; }
      var fits = 0;
      COLUMNS.forEach(function (col) {
        var room = CAP - creditsIn(col.id);
        if (extra && slotOf(byCode[extra]) === col.id) { room -= byCode[extra].credits; }
        var open = g.members.filter(function (code) {
          var m = byCode[code];
          if (!m || slotOf(m) !== col.id) { return false; }
          if (code === extra) { return false; }
          if (state.picks[col.id].indexOf(code) !== -1) { return false; }
          if (extra && clashesWith(code).indexOf(extra) !== -1) { return false; }
          return statusOf(m) === "optional";
        });
        fits += Math.min(open.length, Math.floor(Math.max(0, room) / 15));
      });
      return fits >= need;
    });
  }

  /** Taking this module would put a group past the maximum the handbook allows. */
  function groupOverfull(code) {
    return (degree().groups || []).some(function (g) {
      return g.members.indexOf(code) !== -1 && takenIn(g) >= g.max;
    });
  }

  /** What the corner of the box says about this module, for this degree. */
  function statusText(m, st) {
    if (st === "core") { return m.schoolCore ? "Core" : "Core"; }
    if (st === "selected") { return "Chosen"; }
    if (st === "blocked") { return "Clash"; }
    if (st === "unavailable") {
      var d = degree(), slot = slotOf(m);
      var hard = (d.core[slot] || []).some(function (c) { return clashesWith(m.code).indexOf(c) !== -1; });
      return hard ? "Clash" : "Not offered";
    }
    return "";
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

    var link = linkClass(m);
    var shown = m.display || m.code;
    var grouped = groupsFor(m.code).length ? " box--grouped" : "";
    var paint = paintOf(m.code);
    var corner = statusText(m, st);

    return '<li class="cell' + (link ? " cell--linked" : "") +
      (link === " box--link-end" ? " cell--link-end" : "") +
      '" style="--units:' + units + ';--clamp:' + (units === 2 ? 5 : 2) +
      ';--sc:' + paint.colour + '">' +
      '<button class="box box--' + st + (paint.dark ? " box--dark" : "") +
        (wouldOverflow ? " box--tight" : "") + grouped + link +
        '" type="button" data-code="' + m.code + '" data-toggle="' + m.code + '"' +
        (interactive ? ' aria-pressed="' + (st === "selected") + '"' : ' disabled') +
        ' title="' + esc(shown + " — " + titleOf(m) + " · " + m.credits + " credits · " + label) + '">' +
        '<span class="box__head">' +
          '<span class="box__code">' + esc(shown) + '</span>' +
          '<span class="box__cr">' + m.credits + '</span>' +
        '</span>' +
        '<span class="box__title' + (m.title ? "" : " box__title--missing") + '">' +
          esc(titleOf(m)) + '</span>' +
        '<span class="box__state"' + (corner ? '' : ' hidden') + '>' + esc(corner) + '</span>' +
        '<span class="visually-hidden">' + label + '</span>' +
      '</button>' +
      '<button class="box__info" type="button" data-info="' + m.code + '"' +
        ' aria-label="About ' + esc(m.code) + ' ' + esc(m.title) + '">i</button>' +
    '</li>';
  }

  /*
   * core/selected first (0/1), everything else after, in the order the
   * board shows it: available options, then whatever your own picks have
   * blocked, then — only with "show all" on — what the degree simply
   * does not offer. Taking an optional module moves it from tier 2 to
   * tier 1, which is the whole of "slide it up to below the core
   * modules"; the rest is exactly how far down the column it lands.
   */
  function tierOf(st) {
    return { core: 0, selected: 1, optional: 2, blocked: 3, unavailable: 4 }[st];
  }

  /** Both semesters of a year together — a full year is 120 credits. */
  function yearCredits(year) {
    return creditsIn("y" + year + "s1") + creditsIn("y" + year + "s2");
  }

  /*
   * Year 1 is fully core on every degree — 120 credits with no picks
   * needed — so it would always be "done" and the outline would say
   * nothing. Years 2 and 3 are where it means something: it lights up
   * only once your own picks have filled both of that year's semesters.
   */
  function yearDone(year) {
    return year !== 1 && yearCredits(year) >= 120;
  }

  function column(col) {
    var used = creditsIn(col.id);
    var status = used === CAP ? "full" : (used > CAP ? "over" : "under");
    var mods = modulesIn(col).slice().sort(function (a, b) {
      /* a linked module leads its column, so the two halves of a year-long
         module sit at the same height and read as one shape; everything else
         runs in code order, as the School's own module lists do */
      return (b.linked ? 1 : 0) - (a.linked ? 1 : 0) ||
             (b.schoolCore ? 1 : 0) - (a.schoolCore ? 1 : 0) ||
             a.code.localeCompare(b.code);
    });

    var rows = mods.map(function (m) { return { m: m, st: statusOf(m) }; });
    if (!state.showAll) {
      rows = rows.filter(function (r) { return r.st !== "unavailable"; });
    }
    /* Array#sort is stable in every engine this runs on, so within a tier
       the code-order pass above survives untouched — this only ever moves
       a row to a different tier, never reorders two rows in the same one. */
    rows.sort(function (a, b) { return tierOf(a.st) - tierOf(b.st); });

    var split = 0;
    while (split < rows.length && tierOf(rows[split].st) <= 1) { split++; }
    var top = rows.slice(0, split), rest = rows.slice(split);

    var pct = Math.max(0, Math.min(100, Math.round(used / CAP * 100)));

    return '<section class="col" data-col="' + col.id + '">' +
             '<header class="col__head">' +
               '<h3 class="col__name"><span class="visually-hidden">Year ' + col.year + ' </span>' +
                 'Semester ' + col.semester + '</h3>' +
               '<p class="col__cr col__cr--' + status + '"><strong>' + used + '</strong>/' + CAP + '</p>' +
             '</header>' +
             '<div class="col__bar" style="--pct:' + pct + '%">' +
               '<span class="col__bar__fill col__bar__fill--' + status + '"></span>' +
             '</div>' +
             '<ul class="col__top">' +
               top.map(function (r) { return box(r.m); }).join("") +
             '</ul>' +
             '<ul class="col__list">' + rest.map(function (r) { return box(r.m); }).join("") + '</ul>' +
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
        '<p class="sheet__about"><strong>Timetable clashes:</strong> ' +
          (clashesWith(m.code).length
            ? clashesWith(m.code).slice().sort().map(function (c) {
                return esc(c) + (byCode[c] && byCode[c].title ? " (" + esc(byCode[c].title) + ")" : "");
              }).join("; ")
            : "none \u2014 it can be taken alongside any module in its semester") + '</p>' +
        (split ? '<p class="sheet__about"><strong>Year-long module</strong> &mdash; ' +
                 esc(split) + '.</p>' : "") +
        (m.about ? '<p class="sheet__about">' + esc(m.about) + '</p>' : "") +
        (m.title ? "" : '<p class="sheet__about">The title for this module is not recorded here yet.</p>') +
        '<p class="sheet__req"><strong>Required by:</strong> ' +
          (needs.length ? needs.map(function (d) { return esc(d.name); }).join(", ")
                        : "no degree — it is optional throughout") + '</p>' +
        '<p class="sheet__req"><strong>About the module:</strong>' +
          (m.overview ? "" : " N/A") + '</p>' +
        (m.overview ? overviewList(m.overview) : "") +
        '<p class="sheet__req"><strong>Module Convenors:</strong>' +
          (m.convenors ? " " + m.convenors.map(esc).join(", ") : " N/A") + '</p>' +
        '<p class="sheet__req"><strong>Aims:</strong>' +
          (m.aims ? "" : " N/A") + '</p>' +
        (m.aims ? blockList(m.aims) : "") +
        '<p class="sheet__req"><strong>Learning Outcomes:</strong>' +
          (m.learningOutcomes ? "" : " N/A") + '</p>' +
        (m.learningOutcomes ? blockList(m.learningOutcomes) : "") +
        '<p class="sheet__req"><strong>Method of Assessment:</strong>' +
          (m.assessment ? "" : " N/A") + '</p>' +
        (m.assessment ? blockList(m.assessment) : "") +
      '</div>' +
    '</div>';
  }

  /** Renders one list item for `overview`/a block list's "ul"/"ol" — a
      plain string is a bullet, {text, items} is a bullet with its own
      sub-bullets (one level). See the SCHEMA note in curriculum.js. */
  function listItemHtml(item) {
    if (typeof item === "string") { return '<li>' + esc(item) + '</li>'; }
    return '<li>' + esc(item.text) +
      '<ul>' + item.items.map(function (sub) { return '<li>' + esc(sub) + '</li>'; }).join("") + '</ul>' +
    '</li>';
  }

  /** Renders `overview` — see listItemHtml. */
  function overviewList(items) {
    return '<ul class="sheet__overview">' + items.map(listItemHtml).join("") + '</ul>';
  }

  /** Renders `aims`/`learningOutcomes`/`assessment` — each a list of blocks
      transcribed verbatim from the module description PDFs: {type: "p",
      text} is a paragraph, {type: "ul"|"ol", items} is a bulleted or
      numbered list (list items follow the same schema as listItemHtml).
      See the SCHEMA note in curriculum.js. */
  function blockList(blocks) {
    return blocks.map(function (b) {
      if (b.type === "p") { return '<p class="sheet__prose">' + esc(b.text) + '</p>'; }
      var tag = b.type === "ol" ? "ol" : "ul";
      return '<' + tag + ' class="sheet__prose-list">' + b.items.map(listItemHtml).join("") + '</' + tag + '>';
    }).join("");
  }

  function render() {
    var d = degree();
    root.innerHTML =
      (DATA.meta.sampleData
        ? '<p class="mm__sample"><strong>Sample data</strong> &mdash; placeholder modules, not the ' +
          'School’s real catalogue. Replace <code>assets/data/curriculum.js</code>.</p>'
        : "") +
      /* nothing here may vary in height between degrees, or the board
         shifts under the pointer when you switch */
      '<div class="mm__degrees" role="tablist" aria-label="Degree">' + degreeButtons() + '</div>' +
      '<div class="mm__streams"><b>Stream colours</b>' +
        STREAMS.map(function (st) {
          return '<span class="skey" style="--sc:' + st.colour + '">' + esc(st.label) + '</span>';
        }).join("") +
        '<span class="skey" style="--sc:' + NEUTRAL.core + '">Core for every degree</span>' +
        '<label class="mm__toggle">' +
          '<input type="checkbox" data-show-all' + (state.showAll ? " checked" : "") + '>' +
          '<span class="mm__toggle__track" aria-hidden="true"><span class="mm__toggle__thumb"></span></span>' +
          '<span class="mm__toggle__label">Show modules this degree does not offer</span>' +
        '</label>' +
      '</div>' +
      '<div class="mm__board">' +
        '<div class="mm__year-outline" data-year="2" hidden></div>' +
        '<div class="mm__year-outline" data-year="3" hidden></div>' +
        /* decorative only, not a heading — each column's own <h3> below still
           carries "Year N" for assistive tech (visually-hidden there), so the
           heading outline stays one self-contained "Year N Semester N" per
           column rather than three Years announced before any Semester */
        [1, 2, 3].map(function (y) { return '<div class="mm__year-head" aria-hidden="true">Year ' + y + '</div>'; }).join("") +
        COLUMNS.map(column).join("") +
        '<svg class="mm__links" aria-hidden="true"></svg>' +
        '<div class="mm__hub" hidden></div>' +
      '</div>' +
      details() +
      '<p class="mm__live" role="status" aria-live="polite">' + esc(root.dataset.say || "") + '</p>';

    if (state.open) {
      var h = root.querySelector(".sheet__title");
      if (h) { h.focus({ preventScroll: true }); }
    }
    scheduleLinks();
  }

  /*
   * render() always rebuilds the board from scratch, so a module that
   * moves tier — taken, dropped, or the degree switched under it — is a
   * brand new element at its new spot, not the old one relocated. FLIP
   * (First, Last, Invert, Play) fakes the slide anyway: measure every
   * box before the rebuild, measure the same codes again after, and for
   * anything that landed somewhere else, start its new element exactly
   * where the old one was (a transform, no transition) and release it
   * on the next frame. The eye reads it as one box sliding to its new
   * row; underneath, one element was swapped for another.
   */
  var FLIP_MS = 420;

  function snapshotRects() {
    var out = {};
    root.querySelectorAll(".box[data-code]").forEach(function (el) {
      out[el.dataset.code] = el.getBoundingClientRect();
    });
    return out;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function playFlip(before) {
    /* the CSS reduced-motion rule sets a 1ms transition-duration on
       .box, but this function sets its own transition inline right
       below — an inline style always wins over a stylesheet rule, so
       without this the slide would ignore that preference outright */
    if (reduceMotion.matches) { scheduleLinks(); return; }
    var moved = [];
    root.querySelectorAll(".box[data-code]").forEach(function (el) {
      var prev = before[el.dataset.code];
      if (!prev) {
        /* no "before" position — this module was not on the board at all
           (hidden as unavailable, or off a different degree entirely), so
           it rises into place instead of sliding from somewhere specific */
        el.classList.add("box--enter");
        moved.push(el);
        return;
      }
      var now = el.getBoundingClientRect();
      var dx = prev.left - now.left, dy = prev.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) { return; }
      el.style.transition = "none";
      el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      moved.push(el);
    });

    if (!moved.length) { scheduleLinks(); return; }
    void root.offsetWidth;   // commit the starting point before animating away from it

    requestAnimationFrame(function () {
      moved.forEach(function (el) {
        el.classList.remove("box--enter");
        el.style.transition = "transform " + FLIP_MS + "ms cubic-bezier(0.22, 1, 0.36, 1), " +
                               "opacity " + FLIP_MS + "ms ease";
        el.style.transform = "";
      });
      window.setTimeout(function () {
        moved.forEach(function (el) { el.style.transition = ""; el.style.transform = ""; });
        scheduleLinks();   // final positions only, not mid-slide
      }, FLIP_MS + 40);
    });
  }

  /** Every click that can reshuffle the board goes through here, not render(). */
  function rerender() {
    var before = snapshotRects();
    render();
    playFlip(before);
  }

  /**
   * Draw the grouped choice as lines from each member module converging on a
   * single hub, which states how many of them must be taken. Members sit in
   * both Year 3 columns, so the hub goes in the widened gap between them.
   * Purely decorative: the SVG takes no pointer events.
   */
  function drawLinks() {
    var board = root.querySelector(".mm__board");
    var svg = root.querySelector(".mm__links");
    var hub = root.querySelector(".mm__hub");
    if (!board || !svg || !hub) { return; }

    svg.innerHTML = "";
    hub.hidden = true;

    var groups = degree().groups || [];
    if (!groups.length) { return; }
    var g = groups[0];

    var c1 = board.querySelector('[data-col="y3s1"]');
    var c2 = board.querySelector('[data-col="y3s2"]');
    if (!c1 || !c2) { return; }

    var br = board.getBoundingClientRect();
    var ox = board.scrollLeft - br.left;
    var r1 = c1.getBoundingClientRect(), r2 = c2.getBoundingClientRect();
    var cx = (r1.right + r2.left) / 2 + ox;

    var pts = [];
    g.members.forEach(function (code) {
      var box = board.querySelector('.box[data-code="' + code + '"]');
      if (!box) { return; }
      var rb = box.getBoundingClientRect();
      var onLeft = (rb.right + ox) < cx;
      pts.push({
        code: code,
        x: (onLeft ? rb.right : rb.left) + ox,
        y: rb.top + rb.height / 2 - br.top,
        dir: onLeft ? 1 : -1
      });
    });
    if (!pts.length) { return; }

    var W = board.scrollWidth, H = board.scrollHeight;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);

    var cy = pts.reduce(function (a, q) { return a + q.y; }, 0) / pts.length;
    cy = Math.max(46, Math.min(H - 46, cy));

    var NS = "http://www.w3.org/2000/svg";
    pts.forEach(function (q) {
      var path = document.createElementNS(NS, "path");
      /* leave the box horizontally, then bend in to the hub */
      var midx = q.x + q.dir * Math.max(14, Math.abs(cx - q.x) * 0.45);
      path.setAttribute("d", "M " + q.x + " " + q.y +
        " C " + midx + " " + q.y + ", " + (cx - q.dir * 26) + " " + cy + ", " + cx + " " + cy);
      path.setAttribute("class", "mm__link" +
        (statusOf(byCode[q.code]) === "selected" ? " is-taken" : ""));
      svg.appendChild(path);

      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", q.x); dot.setAttribute("cy", q.y); dot.setAttribute("r", 3);
      dot.setAttribute("class", "mm__linkdot");
      svg.appendChild(dot);
    });

    var n = takenIn(g);
    var range = g.min === g.max ? String(g.min) : g.min + "\u2013" + g.max;
    var fit = n < g.min ? "under" : (n > g.max ? "over" : "met");
    hub.className = "mm__hub mm__hub--" + fit;
    hub.innerHTML = '<span class="mm__hub__take">take</span>' +
                    '<span class="mm__hub__n">' + range + '</span>' +
                    '<span class="mm__hub__of">' + n + ' chosen</span>';
    hub.style.left = cx + "px";
    hub.style.top = cy + "px";
    hub.hidden = false;
  }

  /*
   * One golden outline per year (not per semester), spanning both of that
   * year's columns — so 120 credits in Year 2 draws a single frame around
   * y2s1 and y2s2 together, not two separate ones either side of the gap.
   * yearOutlineShown remembers which years were already lit, across
   * renders: a year that is already done just gets repositioned (a
   * degree switch, say), no re-fade; a year that has just become done
   * gets the two-phase reveal — positioned first, then faded in on the
   * next frame — because a class baked straight into fresh innerHTML has
   * no "before" state to transition from.
   */
  var yearOutlineShown = { 2: false, 3: false };

  function drawYearOutlines() {
    var board = root.querySelector(".mm__board");
    if (!board) { return; }
    var br = board.getBoundingClientRect();
    var ox = board.scrollLeft - br.left;
    var PAD = 6;

    [2, 3].forEach(function (year) {
      var el = board.querySelector('.mm__year-outline[data-year="' + year + '"]');
      if (!el) { return; }
      var c1 = board.querySelector('[data-col="y' + year + 's1"] .col__top');
      var c2 = board.querySelector('[data-col="y' + year + 's2"] .col__top');
      if (!yearDone(year) || !c1 || !c2 || !c1.children.length || !c2.children.length) {
        el.hidden = true;
        el.classList.remove("is-shown");
        yearOutlineShown[year] = false;
        return;
      }

      var r1 = c1.getBoundingClientRect(), r2 = c2.getBoundingClientRect();
      var left = Math.min(r1.left, r2.left) + ox - PAD;
      var right = Math.max(r1.right, r2.right) + ox + PAD;
      var top = Math.min(r1.top, r2.top) - br.top - PAD;
      var bottom = Math.max(r1.bottom, r2.bottom) - br.top + PAD;

      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.width = (right - left) + "px";
      el.style.height = (bottom - top) + "px";

      var freshlyDone = !yearOutlineShown[year];
      el.hidden = false;
      if (freshlyDone) {
        el.classList.remove("is-shown");
        void el.offsetWidth;   // commit the invisible state before fading it in
        requestAnimationFrame(function () { el.classList.add("is-shown"); });
      } else {
        el.classList.add("is-shown");
      }
      yearOutlineShown[year] = true;
    });
  }

  var linkFrame = null;
  function scheduleLinks() {
    if (linkFrame) { cancelAnimationFrame(linkFrame); }
    linkFrame = requestAnimationFrame(function () { linkFrame = null; drawLinks(); drawYearOutlines(); });
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
      /* clicking the already-selected degree again resets to the default
         (Biological Sciences) rather than doing nothing */
      var wasAlreadyOn = t.dataset.degree === state.degree;
      state.degree = wasAlreadyOn ? DATA.degrees[0].id : t.dataset.degree;
      clearPicks();
      writeUrl();
      rerender();
      say(wasAlreadyOn
        ? "Reset to " + degree().name + ", your picks were cleared"
        : t.textContent + " selected, your picks were cleared");
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
        if (groupOverfull(m.code)) {
          say(name + " would take more than this degree's grouped choice allows");
          return;
        }
        if (!groupStaysReachable(m.code)) {
          say(name + " would leave no room for the modules this degree must take from its grouped choice");
          return;
        }
        group.forEach(function (x) {
          if (state.picks[slotOf(x)].indexOf(x.code) === -1) { state.picks[slotOf(x)].push(x.code); }
        });
        say(name + " taken");
      }
      writeUrl();
      rerender();
      return;
    }
    /* a click on the backdrop, outside the card, closes the details */
    if (state.open && event.target.classList.contains("sheet")) { closeSheet(); }
  });

  root.addEventListener("change", function (event) {
    var t = event.target;
    if (!t || !t.matches("[data-show-all]")) { return; }
    state.showAll = t.checked;
    writeUrl();
    rerender();
    say(state.showAll ? "Showing modules this degree does not offer too" : "Hiding modules this degree does not offer");
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

  if (window.ResizeObserver) {
    var ro = new ResizeObserver(scheduleLinks);
    ro.observe(root);
  } else {
    window.addEventListener("resize", scheduleLinks);
  }

  /*
   * The entrance runs in two full passes over the six columns, not one
   * interleaved sequence:
   *
   *   Phase A — float in, still veiled. Each column — a giant arrow, a
   *   "Year N / Semester N" label below it, and the modules underneath,
   *   all still hidden by the veil sitting on top — floats down into
   *   place, Year 1 Semester 1 first, one column after another. The
   *   veil is an absolutely-positioned child of `.col`, so transforming
   *   the whole column carries the veil down with it: what is actually
   *   seen sliding into place is the veil, arrow and label included, the
   *   modules obscured underneath exactly as asked.
   *
   *   Phase B — reveal, only once every column has finished floating
   *   in. Starting again from Year 1 Semester 1, each veil fades away in
   *   turn to uncover that column's modules (its header and credit bar
   *   were under the veil too, and need no opacity rule of their own —
   *   they simply appear as the veil above them goes).
   *
   * Every board is already fully rendered before this starts — the plan
   * you left it in, same as always — this only delays when it becomes
   * visible. Runs every time the section is opened (the biosoc:page
   * event, which app.js fires whether that is the wheel's bubble or a
   * direct link), not on every click inside it — degree switches and
   * module picks use rerender()'s FLIP slide instead, and would be a
   * poor place for a multi-second cover-and-reveal to keep replaying.
   */
  var STEP_MS = 260, VEIL_MS = 420, FLOAT_MS = 1000;

  function runIntro() {
    if (reduceMotion.matches) { return; }
    var board = root.querySelector(".mm__board");
    var cols = board && Array.prototype.slice.call(board.querySelectorAll(".col"));
    var yearHeads = board && Array.prototype.slice.call(board.querySelectorAll(".mm__year-head"));
    if (!board || !cols || !cols.length) { return; }

    /*
     * .is-floated and .is-revealed, once a column has either, are never
     * removed mid-sequence — only the veil goes, when its own column is
     * revealed. They have to stay for as long as .mm__board--intro sits
     * on the board (which is until the very last column of Phase B, not
     * whenever this column's own part finishes), because that
     * board-level class is what holds every column off-position and
     * every box at opacity 0 by default; dropping a per-column class
     * early would let that column fall straight back under the default
     * and vanish or jump again before the others have caught up. Both
     * are reset to nothing at the top of every run, so a second opening
     * starts clean rather than inheriting classes render() has no
     * reason to have removed.
     */
    cols.forEach(function (colEl) {
      colEl.classList.remove("is-floated");
      colEl.classList.remove("is-revealed");
    });
    yearHeads.forEach(function (el) { el.classList.remove("is-revealed"); });
    board.classList.add("mm__board--intro");
    cols.forEach(function (colEl, i) {
      var meta = COLUMNS[i];
      if (!meta) { return; }
      var veil = document.createElement("div");
      veil.className = "mm__veil";
      veil.innerHTML =
        '<div class="mm__veil__inner">' +
          '<svg class="mm__veil__arrow" viewBox="0 0 48 48" aria-hidden="true">' +
            '<path d="M6 24h30M23 12l13 12-13 12" fill="none" stroke="currentColor" ' +
              'stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          '<span class="mm__veil__label">Year ' + meta.year + '<br>Semester ' + meta.semester + '</span>' +
        '</div>';
      colEl.appendChild(veil);
    });

    /*
     * Every arrow lines up level with Year 1 Semester 1's, whatever that
     * column's own module count happens to make its height, rather than
     * each one centring in its own (taller or shorter) column — since
     * columns are grid-top-aligned, the same pixel offset from each
     * veil's own top lands at the same height on the page for all of
     * them. Measured off the column itself (not the veil, which does not
     * exist until the loop above has run), half its rendered height is
     * where Year 1 Semester 1's own arrow naturally centres.
     */
    var levelPx = cols[0].getBoundingClientRect().height / 2;
    cols.forEach(function (colEl) {
      var inner = colEl.querySelector(".mm__veil__inner");
      if (inner) { inner.style.top = levelPx + "px"; }
    });

    /*
     * Column 0 has nothing to wait for, so without a head start its
     * float timer fires on the very next macrotask — before the browser
     * has ever painted the "hidden, off-position" state just set above.
     * With no painted "before" to transition away from, the style
     * change reads as old-equals-new and the column snaps straight into
     * place instead of floating like every other column. START_MS
     * guarantees at least one real paint of the hidden state first, so
     * every column — the first included — gets the same float.
     */
    var START_MS = 60;

    /* Phase A: float every column into place, in sequence. */
    cols.forEach(function (colEl, i) {
      window.setTimeout(function () {
        colEl.classList.add("is-floated");
      }, START_MS + i * STEP_MS);
    });

    /*
     * Phase B does not begin until the last column's own float
     * transition has actually finished — not just started — so nothing
     * is revealed while a column is still sliding in.
     */
    var lastFloatEnds = START_MS + (cols.length - 1) * STEP_MS + FLOAT_MS;
    var REVEAL_PAUSE_MS = 150;

    window.setTimeout(function () {
      /* the "Year N" bars have no veil of their own to lift — they simply
         fade in together, once, as the first veil starts lifting, rather
         than trying to time each one to its own pair of columns */
      yearHeads.forEach(function (el) { el.classList.add("is-revealed"); });
      cols.forEach(function (colEl, i) {
        window.setTimeout(function () {
          var veil = colEl.querySelector(".mm__veil");
          colEl.classList.add("is-revealed");
          if (veil) { veil.classList.add("is-gone"); }
          window.setTimeout(function () {
            if (veil) { veil.remove(); }
            if (i === cols.length - 1) {
              board.classList.remove("mm__board--intro");
              cols.forEach(function (c) {
                c.classList.remove("is-floated");
                c.classList.remove("is-revealed");
              });
              yearHeads.forEach(function (el) { el.classList.remove("is-revealed"); });
            }
          }, VEIL_MS + 200);
        }, i * STEP_MS);
      });
    }, lastFloatEnds + REVEAL_PAUSE_MS);
  }

  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id === "customise-your-degree") { runIntro(); }
  });

  readUrl();
  if (location.search) { writeUrl(); }   // normalise anything the link got wrong
  render();
})();
