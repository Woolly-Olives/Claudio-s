/* =============================================================
   Connect — advice from students, one at a time.

   Shows one piece of advice from assets/data/advice.js, in a random
   order, moving on by itself every DWELL seconds. Anyone can step
   through by hand, and stop it.

   The clock is the progress bar's own CSS animation rather than a
   timer in script: its animationend is what moves things on. That
   means pausing is a single CSS property, holding while someone is
   reading (hover or keyboard focus) costs no script at all, and there
   is only one duration to keep in step — the bar and the wait can
   never drift apart because they are the same thing.

   Nothing runs until the Connect section is open, and it stops again
   when it closes; assets/js/app.js says when, through biosoc:page.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_ADVICE;
  var root = document.getElementById("advice");
  if (!root || !DATA || !DATA.items || !DATA.items.length) { return; }

  /*
   * Seconds each piece is left up, as asked for.
   *
   * Worth knowing: the longest of these is 113 words, which takes over
   * half a minute to read, so a slow reader will not finish it before
   * it moves. The bar shows the time going, the card holds while the
   * pointer is on it or anything in it has focus, and the pause button
   * stops it outright — but if that still feels rushed, raise this.
   */
  var DWELL = 30;

  var items = DATA.items;
  var order = [];
  var at = 0;
  var open = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /** Fisher-Yates, so every piece is seen once before any is repeated. */
  function shuffle(n, notFirst) {
    var a = [], i, j, t;
    for (i = 0; i < n; i++) { a.push(i); }
    for (i = n - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    /* a reshuffle must not repeat the piece still on screen */
    if (n > 1 && notFirst != null && a[0] === notFirst) { a[0] = a[1]; a[1] = notFirst; }
    return a;
  }

  root.innerHTML =
    '<h2 class="ad__h">What students tell first years</h2>' +
    '<p class="ad__from">Collected from students further along the same degrees. ' +
      'Their words, as they wrote them.</p>' +
    '<figure class="ad">' +
      '<blockquote class="ad__card">' +
        '<p class="ad__text"></p>' +
      '</blockquote>' +
      '<div class="ad__bar" aria-hidden="true"><span class="ad__fill"></span></div>' +
      '<figcaption class="ad__foot">' +
        '<span class="ad__count"></span>' +
        '<span class="ad__btns">' +
          '<button class="ad__b" type="button" data-go="-1" aria-label="Previous piece of advice">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
          '</button>' +
          '<button class="ad__b ad__b--hold" type="button" data-hold>Pause</button>' +
          '<button class="ad__b ad__b--next" type="button" data-go="1">Another one' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
          '</button>' +
        '</span>' +
      '</figcaption>' +
    '</figure>';

  var fig   = root.querySelector(".ad");
  var text  = root.querySelector(".ad__text");
  var fill  = root.querySelector(".ad__fill");
  var count = root.querySelector(".ad__count");
  var hold  = root.querySelector("[data-hold]");

  fig.style.setProperty("--dwell", DWELL + "s");

  /** Restart the bar, which is also restarting the wait. */
  function rewind() {
    fill.classList.remove("is-running");
    void fill.offsetWidth;                     // let the reset land first
    if (open && !fig.classList.contains("is-paused")) { fill.classList.add("is-running"); }
  }

  /*
   * Announce only what someone asked for. A live region that speaks
   * every thirty seconds unbidden is worse than one that says nothing,
   * so the attribute goes on for a manual change and straight back off.
   */
  function show(i, spoken) {
    var item = items[order[i]];
    if (spoken) { text.setAttribute("aria-live", "polite"); }
    text.textContent = item.text;
    count.textContent = (i + 1) + " of " + items.length;
    fig.classList.remove("is-fresh");
    void fig.offsetWidth;
    fig.classList.add("is-fresh");
    if (spoken) {
      window.setTimeout(function () { text.removeAttribute("aria-live"); }, 1200);
    }
  }

  function go(step, spoken) {
    at += step;
    if (at >= order.length) { order = shuffle(items.length, order[order.length - 1]); at = 0; }
    if (at < 0) { at = order.length - 1; }
    show(at, spoken);
    rewind();
  }

  order = shuffle(items.length);
  show(0, false);

  /* the bar finishing its run is what moves things on */
  fill.addEventListener("animationend", function () { go(1, false); });

  root.addEventListener("click", function (event) {
    var step = event.target.closest("[data-go]");
    if (step) { go(+step.dataset.go, true); return; }
    if (!event.target.closest("[data-hold]")) { return; }
    var paused = fig.classList.toggle("is-paused");
    hold.textContent = paused ? "Play" : "Pause";
    hold.setAttribute("aria-label", paused
      ? "Start moving through the advice again"
      : "Stop moving through the advice");
    if (!paused) { rewind(); }
  });

  /* run only while anyone can actually see it */
  document.addEventListener("biosoc:page", function (event) {
    var now = event.detail.id === "connect";
    if (now === open) { return; }
    open = now;
    if (open) { rewind(); } else { fill.classList.remove("is-running"); }
  });
})();
