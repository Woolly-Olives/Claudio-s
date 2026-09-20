/* =============================================================
   Events — the BioSoc calendar.

   Draws the subscribe card and the list of what is coming up, from
   assets/data/events.js (generated from the published Outlook
   calendar) and assets/data/calendar.js (the live calendar's links).

   Each event also offers its own .ics download, written here rather
   than fetched: the times are emitted in UTC, which every calendar
   program reads the same way, so an event added this way lands at the
   right hour whatever the source calendar's timezone is set to.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_EVENTS;
  var CAL = window.BIOSOC_CALENDAR;
  var root = document.getElementById("calendar");
  if (!root || !DATA || !CAL) { return; }

  var all = (DATA.events || []).map(function (e) {
    return {
      uid: e.uid, title: e.title, tag: e.tag, tagLabel: e.tagLabel,
      start: new Date(e.start), end: new Date(e.end),
      allDay: e.allDay, where: e.where, note: e.note, url: e.url
    };
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- what a visitor reads ---------- */

  var DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  /** "Today", "Tomorrow", or nothing — only worth saying when it is soon. */
  function nearness(start, now) {
    var days = Math.round((midnight(start) - midnight(now)) / 86400000);
    if (days === 0) { return "Today"; }
    if (days === 1) { return "Tomorrow"; }
    if (days > 1 && days < 7) { return "This week"; }
    return "";
  }

  function clock(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }

  function when(event) {
    if (event.allDay) { return "All day"; }
    return clock(event.start) + " – " + clock(event.end);
  }

  /* ---------- the per-event download ---------- */

  function stamp(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
           pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
  }

  function dayStamp(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  function icsEscape(s) {
    return String(s == null ? "" : s)
      .replace(/\\/g, "\\\\").replace(/;/g, "\;")
      .replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }

  /**
   * RFC 5545 folds lines at 75 OCTETS, continued with a space — octets,
   * not characters, so one curly apostrophe in a title is enough to
   * make a 74-character line too long. Count the bytes.
   */
  function octets(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) { n += 1; }
      else if (c < 0x800) { n += 2; }
      else if (c >= 0xD800 && c < 0xDC00) { n += 4; i++; }   // surrogate pair
      else { n += 3; }
    }
    return n;
  }

  function fold(line) {
    if (octets(line) <= 75) { return line; }
    var out = [], piece = "", limit = 75;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      /* never split a surrogate pair down the middle */
      if (ch.charCodeAt(0) >= 0xD800 && ch.charCodeAt(0) < 0xDC00) { ch += line[++i]; }
      if (octets(piece + ch) > limit) {
        out.push(piece);
        piece = " ";
        limit = 75;
      }
      piece += ch;
    }
    if (piece) { out.push(piece); }
    return out.join("\r\n");
  }

  function icsFor(event) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BioSoc//Student Hub//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + (event.uid || (stamp(event.start) + "-biosoc")),
      "DTSTAMP:" + stamp(new Date()),
      event.allDay
        ? "DTSTART;VALUE=DATE:" + dayStamp(event.start)
        : "DTSTART:" + stamp(event.start),
      event.allDay
        ? "DTEND;VALUE=DATE:" + dayStamp(event.end)
        : "DTEND:" + stamp(event.end),
      "SUMMARY:" + icsEscape(event.title),
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE"
    ];
    if (event.where) { lines.push("LOCATION:" + icsEscape(event.where)); }
    if (event.note) { lines.push("DESCRIPTION:" + icsEscape(event.note)); }
    if (event.url) { lines.push("URL:" + icsEscape(event.url)); }
    lines.push("END:VEVENT", "END:VCALENDAR");
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 48) || "event";
  }

  function download(event) {
    var blob = new Blob([icsFor(event)], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "biosoc-" + slug(event.title) + ".ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------- four weeks, starting with the one we are in ---------- */

  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /** Monday of the week containing `d`, at midnight. */
  function weekStart(d) {
    var m = midnight(d);
    var back = (m.getDay() + 6) % 7;          // Sunday is 0, and we start Monday
    m.setDate(m.getDate() - back);
    return m;
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  /**
   * Outlook's own published calendar cannot be shown here: Microsoft
   * serves it with X-Frame-Options SAMEORIGIN, so a browser refuses to
   * draw it inside another site. This is the plainest four-week grid
   * that does the same job, off the same events as the list below.
   */
  function fourWeeks(now) {
    var first = weekStart(now);
    var last = new Date(first);
    last.setDate(last.getDate() + 27);        // the last day shown, not the day after

    var cells = [];
    for (var i = 0; i < 28; i++) {
      var day = new Date(first);
      day.setDate(day.getDate() + i);
      var on = all.filter(function (e) { return sameDay(e.start, day); });
      var first_of_month = day.getDate() === 1 || i === 0;

      /*
       * Up to four events share the cell's height between them, so one
       * event fills the day and four still fit. Past that, three are
       * shown and the fourth slot says how many are left rather than
       * quietly dropping them.
       */
      var CAP = 4;
      var over = on.length > CAP ? on.length - (CAP - 1) : 0;
      var shown = over ? on.slice(0, CAP - 1) : on;

      cells.push('' +
        '<div class="cal4__day' +
          (sameDay(day, now) ? ' is-today' : '') +
          (day < midnight(now) ? ' is-past' : '') + '"' +
          ' data-n="' + (shown.length + (over ? 1 : 0)) + '">' +
          '<span class="cal4__n">' + day.getDate() +
            (first_of_month ? ' <span class="cal4__mon">' + MON[day.getMonth()] + '</span>' : '') +
          '</span>' +
          (on.length
            ? '<div class="cal4__evs">' +
                shown.map(function (e) {
                  return '<span class="cal4__ev cal4__ev--' + esc(e.tag) + '" title="' +
                         esc(e.title + (e.allDay ? "" : " \u00b7 " + when(e)) +
                             (e.where ? " \u00b7 " + e.where : "")) + '">' +
                         (e.allDay ? "" : '<b class="cal4__at">' + clock(e.start) + '</b>') +
                         '<span class="cal4__what">' + esc(e.title) + '</span>' +
                         '</span>';
                }).join("") +
                (over ? '<span class="cal4__ev cal4__ev--more">+' + over + ' more</span>' : '') +
              '</div>'
            : '') +
        '</div>');
    }

    var span = first.getMonth() === last.getMonth()
      ? MON[first.getMonth()] + " " + first.getFullYear()
      : MON[first.getMonth()] +
        (first.getFullYear() === last.getFullYear() ? "" : " " + first.getFullYear()) +
        " \u2013 " + MON[last.getMonth()] + " " + last.getFullYear();

    return '' +
      '<div class="cal4">' +
        '<div class="cal4__head">' +
          '<h2 class="ev-h">Next four weeks</h2>' +
          '<span class="cal4__span">' + span + '</span>' +
        '</div>' +
        '<div class="cal4__grid">' +
          DOW.map(function (d) { return '<span class="cal4__dow">' + d + '</span>'; }).join("") +
          cells.join("") +
        '</div>' +
      '</div>';
  }

  /** Outlook's own page, for anyone who wants to try their luck. */
  function outlookFrame() {
    return '' +
      '<div class="cal4">' +
        '<div class="cal4__head"><h2 class="ev-h">Next four weeks</h2></div>' +
        '<div class="cal4__frame" style="height:' + esc(CAL.frameHeight || "60vh") + '">' +
          '<iframe title="BioSoc calendar" src="' + esc(CAL.view) + '"' +
            ' loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '</div>' +
        '<p class="cal-small">Shown from Outlook. If that panel is empty, Microsoft ' +
          'has refused to let the calendar be drawn inside another site &mdash; set ' +
          'mode back to "grid" in assets/data/calendar.js.</p>' +
      '</div>';
  }

  /* ---------- drawing ---------- */

  function webcal(href) { return String(href).replace(/^https?:/i, "webcal:"); }

  function row(event, i, now) {
    var soon = nearness(event.start, now);
    return '' +
      '<li class="ev" data-tag="' + esc(event.tag) + '">' +
        '<div class="ev__date" aria-hidden="true">' +
          '<span class="ev__dow">' + DAY[event.start.getDay()] + '</span>' +
          '<span class="ev__day">' + event.start.getDate() + '</span>' +
          '<span class="ev__mon">' + MON[event.start.getMonth()] + '</span>' +
        '</div>' +
        '<div class="ev__body">' +
          '<p class="ev__title">' + esc(event.title) +
            (soon ? ' <span class="ev__soon">' + soon + '</span>' : '') +
          '</p>' +
          '<p class="ev__meta">' +
            '<span class="ev__tag ev__tag--' + esc(event.tag) + '">' + esc(event.tagLabel) + '</span>' +
            '<span class="ev__when">' +
              DAY[event.start.getDay()] + ' ' + event.start.getDate() + ' ' +
              MON[event.start.getMonth()] + ', ' + when(event) +
            '</span>' +
            (event.where ? '<span class="ev__where">' + esc(event.where) + '</span>' : '') +
          '</p>' +
          (event.note ? '<p class="ev__note">' + esc(event.note) + '</p>' : '') +
        '</div>' +
        '<button class="ev__add" type="button" data-add="' + i + '">Add to calendar</button>' +
      '</li>';
  }

  function tagsIn(list) {
    var seen = {}, out = [];
    list.forEach(function (e) {
      if (!seen[e.tag]) { seen[e.tag] = true; out.push({ tag: e.tag, label: e.tagLabel }); }
    });
    return out;
  }

  function render() {
    var now = new Date();
    /* an event stays up until it has actually finished */
    var upcoming = all.filter(function (e) { return e.end >= now; });
    var tags = tagsIn(upcoming);

    root.innerHTML =
      '<a class="cal-sub" href="' + esc(webcal(CAL.subscribe)) + '">' +
        '<span class="cal-sub__text">' +
          '<strong class="cal-sub__head">' + esc(CAL.heading) + '</strong>' +
          '<span class="cal-sub__blurb">' + esc(CAL.blurb) + '</span>' +
        '</span>' +
        '<span class="cal-sub__go">' + esc(CAL.action) + '</span>' +
      '</a>' +
      '<p class="cal-small">' + esc(CAL.smallprint) +
        ' <a href="' + esc(CAL.view) + '" target="_blank" rel="noopener">' +
        'Open the calendar in Outlook</a>.</p>' +

      (CAL.mode === "outlook" ? outlookFrame() : fourWeeks(now)) +

      (upcoming.length
        ? '<div class="ev-head">' +
            '<h2 class="ev-h">Coming up</h2>' +
            (tags.length > 1
              ? '<div class="ev-filter" role="group" aria-label="Filter events">' +
                  '<button class="ev-filter__b is-on" type="button" data-filter="all">All</button>' +
                  tags.map(function (t) {
                    return '<button class="ev-filter__b" type="button" data-filter="' +
                           esc(t.tag) + '">' + esc(t.label) + '</button>';
                  }).join("") +
                '</div>'
              : '') +
          '</div>' +
          '<ul class="ev-list">' +
            upcoming.map(function (e) { return row(e, all.indexOf(e), now); }).join("") +
          '</ul>'
        : '<p class="ev-empty">Nothing in the calendar just now. Subscribe above and ' +
          'the next one will find you.</p>');

  }

  /* one listener on the container, so redrawing never doubles it up */
  function wire() {
    root.addEventListener("click", function (event) {
      var add = event.target.closest("[data-add]");
      if (add) { download(all[+add.dataset.add]); return; }

      var filter = event.target.closest("[data-filter]");
      if (!filter) { return; }
      var want = filter.dataset.filter;
      Array.prototype.forEach.call(root.querySelectorAll(".ev-filter__b"), function (b) {
        b.classList.toggle("is-on", b === filter);
      });
      Array.prototype.forEach.call(root.querySelectorAll(".ev"), function (li) {
        li.hidden = (want !== "all" && li.dataset.tag !== want);
      });
    });
  }

  render();
  wire();
})();
