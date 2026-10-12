/* =============================================================
   The noticeboard, right of the wheel: a cork board with a poster
   (a link to its Instagram post), the next deadline of one module
   and a note linking to the Union's Course Reps page. Content is
   assets/data/board.js; the module's deadline comes from
   assets/data/assessments.js and is APPROXIMATE like the rest of
   that calendar. No timers, no fetching: nothing here needs the
   biosoc:page gate. Hidden below 1360px wide (board.css) — there is
   not room beside the wheel.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("board");
  var B = window.BIOSOC_BOARD, A = window.BIOSOC_ASSESS;
  if (!root || !B) { return; }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function ms(iso) { var p = iso.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }

  var now = new Date(), today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  var next = null;
  if (A && B.deadlineModule) {
    A.events.forEach(function (e) {
      if (e.mod !== B.deadlineModule || e.kind === "lab" || /lab practical/i.test(e.title) || ms(e.date) < today) { return; }
      if (!next || ms(e.date) < ms(next.date)) { next = e; }
    });
  }

  function pin(i) { return '<i class="bd__pin bd__pin--' + (i % 3) + '"></i>'; }

  var html = '';
  if (B.poster) {
    html += '<a class="bd__poster" href="' + esc(B.poster.href) + '" target="_blank" rel="noopener noreferrer">' + pin(0) +
      '<img src="' + esc(B.poster.img) + '" alt="' + esc(B.poster.alt) + '" loading="lazy"></a>';
  }
  html += '<div class="bd__notes">';
  if (next) {
    var d = new Date(ms(next.date));
    var when = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    html += '<div class="bd__note bd__note--yellow">' + pin(1) + '<b>' + esc(next.mod) + ' deadline</b><br>' + esc(next.title.replace(next.mod + " ", "")) +
      '<small>' + esc(when) + ' · approximate</small></div>';
  }
  if (B.reps) {
    html += '<a class="bd__note bd__note--pink" href="' + esc(B.reps.href) + '" target="_blank" rel="noopener noreferrer">' + pin(2) + esc(B.reps.text) + '</a>';
  }
  html += '</div>';
  root.innerHTML = html;
})();
