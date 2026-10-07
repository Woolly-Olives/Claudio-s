/* =============================================================
   Mini calendar — beside the wheel on the main page.

   This month and the next three, one small square per day with no
   dates printed on it, so the only things that catch the eye are today
   and the days that have something on. Hovering (or focusing, or
   tapping) a day with an event opens a small box about it. Built from
   assets/data/events.js, the same generated file the Events section
   reads; nothing is fetched and nothing runs on a timer, so it needs
   no biosoc:page gate.

   Dates are read straight off the ISO strings ("2026-09-22T10:00:00
   +01:00"), not through Date, so a visitor in another timezone sees the
   day and the clock time the committee typed in Outlook — Leicester
   time — rather than a shifted one. "Today" is the visitor's own.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("minical");
  if (!root) { return; }

  var DATA = window.BIOSOC_EVENTS;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function key(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }

  /** A calendar day as a UTC-midnight timestamp, for day arithmetic only. */
  function dayNumber(iso) {
    return Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000;
  }

  function keyOfDayNumber(n) {
    var d = new Date(n * 86400000);
    return key(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  /* ---------- events, indexed by the day they fall on ---------- */

  /*
   * PLACEHOLDERS — hand-written stand-ins for dates the committee has
   * not put in the Outlook calendar yet, drawn dark grey (tag
   * "placeholder"). Not generated, unlike events.js: edit them here, and
   * delete one once the real event is in events.js. Same shape as an
   * event there; an all-day event's end is the day AFTER its last day.
   */
  var PLACEHOLDERS = [
    { title: "STEM Fair", start: "2026-10-15T00:00:00+01:00", end: "2026-10-16T00:00:00+01:00" },
    { title: "Reading week", start: "2026-11-09T00:00:00+00:00", end: "2026-11-16T00:00:00+00:00" },
    { title: "Exam week", start: "2027-01-04T00:00:00+00:00", end: "2027-01-10T00:00:00+00:00" }
  ].map(function (e) {
    e.tag = "placeholder";
    e.tagLabel = "Placeholder";
    e.allDay = true;
    return e;
  });

  var byDay = {};

  (((DATA && DATA.events) || []).concat(PLACEHOLDERS)).forEach(function (e) {
    var first = dayNumber(e.start);
    var last = dayNumber(e.end);
    /* an event that ends exactly at midnight (every all-day event does,
       the end being exclusive) does not touch the day it ends on */
    if (last > first && e.end.slice(11, 16) === "00:00") { last -= 1; }
    if (last < first) { last = first; }
    e.firstDay = first;
    e.lastDay = last;
    for (var n = first; n <= last; n++) {
      var k = keyOfDayNumber(n);
      (byDay[k] = byDay[k] || []).push(e);
    }
  });

  /* ---------- what the box says ---------- */

  function shortDate(n) {
    var d = new Date(n * 86400000);
    return DAYS[d.getUTCDay()] + " " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()].slice(0, 3);
  }

  function dateLine(e) {
    var line = shortDate(e.firstDay) + (e.lastDay > e.firstDay ? " – " + shortDate(e.lastDay) : "");
    if (e.allDay) { return line + " · All day"; }
    return line + " · " + e.start.slice(11, 16) + " – " + e.end.slice(11, 16);
  }

  function spokenDate(y, m, d) {
    return d + " " + MONTHS[m];
  }

  function boxHtml(events) {
    return events.map(function (e) {
      return '' +
        '<div class="mc-tip__ev">' +
          '<span class="mc-tip__tag mc-tip__tag--' + esc(e.tag) + '">' + esc(e.tagLabel) + '</span>' +
          '<strong class="mc-tip__title">' + esc(e.title) + '</strong>' +
          '<span class="mc-tip__when">' + esc(dateLine(e)) + '</span>' +
          (e.where ? '<span class="mc-tip__where">' + esc(e.where) + '</span>' : '') +
          (e.note ? '<span class="mc-tip__note">' + esc(e.note) + '</span>' : '') +
        '</div>';
    }).join("");
  }

  /* ---------- the four months ---------- */

  var now = new Date();
  var todayKey = key(now.getFullYear(), now.getMonth(), now.getDate());

  function month(offset) {
    var first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    var y = first.getFullYear(), m = first.getMonth();
    var length = new Date(y, m + 1, 0).getDate();
    var lead = (first.getDay() + 6) % 7;          // Monday first
    var html = '';

    for (var i = 0; i < lead; i++) { html += '<span class="mc__gap"></span>'; }

    for (var d = 1; d <= length; d++) {
      var k = key(y, m, d);
      var on = byDay[k];
      var cls = "mc__day" +
        (k === todayKey ? " is-today" : "") +
        (k < todayKey ? " is-past" : "");

      if (on) {
        cls += " mc__day--ev mc__day--" + esc(on[0].tag);
        html += '<button type="button" class="' + cls + '" data-k="' + k + '" ' +
          'aria-label="' + esc(spokenDate(y, m, d) + ": " +
            on.map(function (e) { return e.title; }).join("; ")) + '"></button>';
      } else {
        html += '<span class="' + cls + '"></span>';
      }
    }

    return '' +
      '<section class="mc__month">' +
        '<h2 class="mc__name">' + MONTHS[m].slice(0, 3) +
          (y !== now.getFullYear() ? ' <span>' + y + '</span>' : '') + '</h2>' +
        '<div class="mc__grid">' + html + '</div>' +
      '</section>';
  }

  root.innerHTML = '<div class="mc">' + [0, 1, 2, 3].map(month).join("") + '</div>';

  /* ---------- the box ---------- */

  var tip = document.createElement("div");
  tip.className = "mc-tip";
  tip.id = "mc-tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.appendChild(tip);

  var current = null;

  function show(btn) {
    current = btn;
    tip.innerHTML = boxHtml(byDay[btn.dataset.k]);
    tip.hidden = false;
    btn.setAttribute("aria-describedby", "mc-tip");

    var r = btn.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = r.right + 12;
    if (left + w > window.innerWidth - 8) { left = Math.max(8, r.left - 12 - w); }
    var top = r.top + r.height / 2 - h / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  function hide() {
    if (current) { current.removeAttribute("aria-describedby"); }
    current = null;
    tip.hidden = true;
  }

  function dayAt(event) {
    return event.target.closest ? event.target.closest("button.mc__day--ev") : null;
  }

  root.addEventListener("mouseover", function (event) {
    var b = dayAt(event);
    if (b && b !== current) { show(b); }
  });
  root.addEventListener("mouseout", function (event) {
    if (dayAt(event) && !(event.relatedTarget && event.relatedTarget === current)) { hide(); }
  });
  root.addEventListener("focusin", function (event) {
    var b = dayAt(event);
    if (b) { show(b); }
  });
  root.addEventListener("focusout", hide);
  root.addEventListener("click", function (event) {
    var b = dayAt(event);
    if (!b) { return; }
    if (b === current && !tip.hidden) { hide(); } else { show(b); }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !tip.hidden) { hide(); }
  });
  document.addEventListener("click", function (event) {
    if (!tip.hidden && !root.contains(event.target)) { hide(); }
  });
})();
