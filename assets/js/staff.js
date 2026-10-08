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

  function paintOf(code) {
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

  /* ---------- the cards ---------- */

  function field(label, value) {
    return '<div class="st__field">' +
      '<dt class="st__label">' + esc(label) + '</dt>' +
      '<dd class="st__value' + (value ? '' : ' st__value--blank') + '">' + esc(value || "") + '</dd>' +
      '</div>';
  }

  function card(person) {
    var extra = EXTRA[person.key] || {};

    /* every module they teach on: the ones they convene (from the
       handbooks' lists, so always known) plus any listed by hand in
       staff.js — the handbooks name convenors, not the other lecturers */
    var codes = person.modules.slice();
    (extra.teaches || []).forEach(function (c) { if (codes.indexOf(c) === -1) { codes.push(c); } });
    codes.sort();

    return '' +
      '<article class="st">' +
        '<h2 class="st__name">' + esc((person.title ? person.title + " " : "") + person.name) + '</h2>' +
        '<div class="st__top">' +
          '<div class="st__photo">' +
            (extra.photo ? '<img src="' + esc(extra.photo) + '" alt="' + esc(person.name) + '">' : '') +
          '</div>' +
          '<div class="st__mods">' +
            (extra.roles || []).map(function (r) { return '<p class="st__role">' + esc(r) + '</p>'; }).join("") +
            '<ul class="st__codes">' + codes.map(function (code) {
              var paint = paintOf(code);
              return '<li class="st__code' + (paint.dark ? ' st__code--dark' : '') + '" style="--mc:' + paint.colour +
                '" title="' + esc(titleOf[code] || "") + '">' + esc(code) +
                (person.modules.indexOf(code) !== -1 ? ' <span class="st__conv">Convenor</span>' : '') + '</li>';
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

  root.innerHTML = '<div class="st__grid">' + people.map(card).join("") + '</div>';
})();
