/* =============================================================
   Events — the Instagram feed.

   Builds the profile card and, from assets/data/instagram.js, one
   official Instagram embed per pinned post. Instagram's script is not
   fetched when the site loads: it is fetched the first time the Events
   section is opened, and only then (or after the visitor agrees, if
   `consent` is set). Until it arrives — and for good if it never does,
   because Instagram is blocked, offline or broken — each card stays a
   plain link with whatever the committee wrote about the post, so the
   page is never empty.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_INSTAGRAM;
  var root = document.getElementById("instagram");
  if (!root || !DATA) { return; }

  var SCRIPT = "https://www.instagram.com/embed.js";
  var PATIENCE = 8000;          // ms before we admit the script is not coming
  var posts = DATA.posts || [];
  var asked = false;
  var loading = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /** 2026-10-02 -> "Thursday 2 October 2026", and anything else as given. */
  function readableDate(iso) {
    if (!iso) { return ""; }
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!parts) { return iso; }
    var d = new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3]));
    if (isNaN(d.getTime())) { return iso; }
    return d.toLocaleDateString("en-GB",
      { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  /** Instagram wants the permalink with a trailing slash and no query. */
  function clean(url) {
    var cut = String(url).split(/[?#]/)[0];
    return /\/$/.test(cut) ? cut : cut + "/";
  }

  /*
   * Only a single post, reel or video can be embedded — a profile
   * address cannot. Getting that wrong leaves a card that never draws,
   * which is quiet enough to go unnoticed, so say so in the console.
   */
  function usable(href) {
    if (/^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[^/]+\/$/.test(href)) { return true; }
    if (window.console && console.warn) {
      console.warn("[BioSoc] Instagram can only embed one post at a time, and this is not a " +
                   "post address, so it will stay a plain link: " + href);
    }
    return false;
  }

  function card(post) {
    var href = clean(post.permalink);
    var when = readableDate(post.date);
    usable(href);
    return '' +
      '<li class="ig-card">' +
        '<blockquote class="instagram-media" data-instgrm-version="14"' +
          (DATA.captions ? ' data-instgrm-captioned' : '') +
          ' data-instgrm-permalink="' + esc(href) + '">' +
          '<div class="ig-card__stand-in">' +
            (post.title ? '<p class="ig-card__title">' + esc(post.title) + '</p>' : '') +
            (when ? '<p class="ig-card__when">' + esc(when) + '</p>' : '') +
            (post.note ? '<p class="ig-card__note">' + esc(post.note) + '</p>' : '') +
            '<a class="ig-card__link" href="' + esc(href) + '" target="_blank" rel="noopener">' +
              'View this post on Instagram' +
            '</a>' +
          '</div>' +
        '</blockquote>' +
      '</li>';
  }

  root.innerHTML =
    '<a class="ig-profile" href="' + esc(DATA.url) + '" target="_blank" rel="noopener me">' +
      '<span class="ig-profile__mark" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24">' +
          '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"></rect>' +
          '<circle cx="12" cy="12" r="4.6"></circle>' +
          '<circle class="ig-profile__dot" cx="17.6" cy="6.4" r="1.2"></circle>' +
        '</svg>' +
      '</span>' +
      '<strong class="ig-profile__handle">@' + esc(DATA.handle) + '</strong>' +
      '<span class="ig-profile__go">Follow</span>' +
      '<span class="ig-profile__blurb">' + esc(DATA.blurb) + '</span>' +
    '</a>' +
    (posts.length
      ? '<ul class="ig-grid">' + posts.map(card).join("") + '</ul>' +
        (DATA.consent
          ? '<p class="ig-consent"><button class="ig-consent__go" type="button">Show the posts</button></p>'
          : '') +
        '<p class="ig-foot">' +
          (DATA.consent
            ? 'The posts above are links until you ask for them: loading them fetches from Instagram, which sets its own cookies.'
            : 'Posts are loaded from Instagram when you open this page.') +
        '</p>'
      : '<p class="ig-empty">Nothing pinned here yet &mdash; everything we run is announced on ' +
        '<a href="' + esc(DATA.url) + '" target="_blank" rel="noopener">@' + esc(DATA.handle) + '</a>.</p>');

  var foot = root.querySelector(".ig-foot");
  var consent = root.querySelector(".ig-consent");

  /** Instagram's script rewrites each blockquote into an iframe. */
  function drawn() {
    return !!root.querySelector(".instagram-media iframe, .instagram-media-rendered");
  }

  function giveUp() {
    if (drawn()) { return; }
    root.classList.add("is-unreachable");
    if (foot) {
      foot.textContent = "Instagram could not be reached, so the posts are shown as links.";
    }
  }

  /* the embeds have arrived: the line about loading them has done its job */
  function settle() {
    if (!drawn()) { return false; }
    if (foot) { foot.remove(); foot = null; }
    return true;
  }

  function load() {
    if (loading || !posts.length) { return; }
    loading = true;
    if (consent) { consent.remove(); }

    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      var tag = document.createElement("script");
      tag.async = true;
      tag.src = SCRIPT;
      tag.onerror = giveUp;
      document.head.appendChild(tag);
    }

    /* the script gives no callback, so watch for the iframes it swaps in */
    var since = Date.now();
    var watch = window.setInterval(function () {
      if (settle()) { window.clearInterval(watch); return; }
      if (Date.now() - since > PATIENCE) { window.clearInterval(watch); giveUp(); }
    }, 250);
  }

  if (consent) {
    consent.querySelector(".ig-consent__go").addEventListener("click", load);
  }

  /* nothing reaches Instagram until someone opens Events */
  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "events" || asked) { return; }
    asked = true;
    if (!DATA.consent) { load(); }
  });
})();
