/* =============================================================
   Connect — staff cards.

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

  var titleOf = {};
  CUR.modules.forEach(function (m) { titleOf[m.code] = m.title; });

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
    return '' +
      '<article class="st">' +
        '<h2 class="st__name">' + esc((person.title ? person.title + " " : "") + person.name) + '</h2>' +
        '<div class="st__top">' +
          '<div class="st__photo">' +
            (extra.photo ? '<img src="' + esc(extra.photo) + '" alt="' + esc(person.name) + '">' : '') +
          '</div>' +
          '<div class="st__mods">' +
            '<span class="st__label">Modules</span>' +
            '<ul class="st__codes">' + person.modules.map(function (code) {
              return '<li title="' + esc(titleOf[code] || "") + '">' + esc(code) + '</li>';
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
