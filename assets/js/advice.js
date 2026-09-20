/* =============================================================
   Connect — advice from students, one at a time.

   Shows one piece of advice from assets/data/advice.js, in a random
   order, moving on by itself every DWELL seconds. Back and forward
   step through it by hand.

   Nothing runs until the Connect section is open, and it stops again
   when it closes; assets/js/app.js says when, through biosoc:page.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_ADVICE;
  var root = document.getElementById("advice");
  if (!root || !DATA || !DATA.items || !DATA.items.length) { return; }

  /* seconds each piece is left up */
  var DWELL = 40;

  var items = DATA.items;
  var order = [];
  var at = 0;
  var open = false;
  var timer = null;

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
    '<h2 class="ad__h">Advice from current students:</h2>' +
    '<figure class="ad">' +
      '<blockquote class="ad__card">' +
        '<p class="ad__text"></p>' +
      '</blockquote>' +
      '<figcaption class="ad__foot">' +
        '<button class="ad__b" type="button" data-go="-1" aria-label="Previous piece of advice">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
        '</button>' +
        '<button class="ad__b" type="button" data-go="1" aria-label="Another piece of advice">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
        '</button>' +
      '</figcaption>' +
    '</figure>';

  var fig  = root.querySelector(".ad");
  var card = root.querySelector(".ad__card");
  var text = root.querySelector(".ad__text");

  /*
   * Hold the card at the height of its tallest piece, so it does not
   * resize under whoever is reading — and take the buttons with it.
   * A figure in the stylesheet cannot do this: how tall the longest
   * piece runs depends on how wide the column happens to be, so it has
   * to be measured, and measured again when that width changes.
   */
  var fitting = null;
  function fit() {
    var keep = text.textContent;
    var tallest = 0;
    card.style.minHeight = "0px";
    items.forEach(function (item) {
      text.textContent = item.text;
      if (card.offsetHeight > tallest) { tallest = card.offsetHeight; }
    });
    text.textContent = keep;
    card.style.minHeight = tallest + "px";
  }

  window.addEventListener("resize", function () {
    window.clearTimeout(fitting);
    fitting = window.setTimeout(fit, 150);
  });

  /** Start the wait over. Only ever runs while the section is open. */
  function rewind() {
    window.clearTimeout(timer);
    timer = null;
    if (open) {
      timer = window.setTimeout(function () { go(1, false); }, DWELL * 1000);
    }
  }

  /*
   * Announce only what someone asked for. A live region that speaks
   * every forty seconds unbidden is worse than one that says nothing,
   * so the attribute goes on for a manual change and straight back off.
   */
  function show(i, spoken) {
    if (spoken) { text.setAttribute("aria-live", "polite"); }
    text.textContent = items[order[i]].text;
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
  fit();

  root.addEventListener("click", function (event) {
    var step = event.target.closest("[data-go]");
    if (step) { go(+step.dataset.go, true); }
  });

  /* run only while anyone can actually see it */
  document.addEventListener("biosoc:page", function (event) {
    var now = event.detail.id === "connect";
    if (now === open) { return; }
    open = now;
    rewind();
  });
})();
