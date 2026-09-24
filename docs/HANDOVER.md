# Handover

Written for whoever picks this up next — most likely me, with no memory of any
of it. It records what was asked for, what was decided and why, what is known to
be true, what is only believed, and what is still owed. `CLAUDE.md` at the root
is the short version that loads automatically; this is the long one.

Last updated at commit `523f122`.

---

## 1. What this is

A one-page static hub for **BioSoc**, the student society of the University of
Leicester's School of Biological Sciences. Plain HTML, CSS and JavaScript — **no
build step, no dependencies, no framework**. It is meant to go on GitHub Pages.

Repository: <https://github.com/Woolly-Olives/Claudio-s>
Working branch: **`claude/biosoc-student-hub-2k2f32`**

The landing page is a circular menu of seven sections. Choosing one opens a
full-screen panel. Six open with a circle growing from that slice's outer tip;
Essential Links zooms into its own slice instead.

---

## 2. Rules of engagement

These came from the user or the task setup and hold unless they say otherwise.

**Git**
- Develop, commit and push on `claude/biosoc-student-hub-2k2f32`. Never push to
  another branch without explicit permission.
- `git push -u origin claude/biosoc-student-hub-2k2f32`. Retry network failures
  up to four times with backoff (2s, 4s, 8s, 16s).
- **Do not open a pull request unless asked.** None has been opened so far.
- Every commit ends with the `Co-Authored-By:` and `Claude-Session:` lines given
  in the session reminder.
- **Never put a model identifier in a commit message, code comment, or anything
  else pushed to the repository.** Chat replies only.

**How the user likes to be answered** (their stated preferences)
- Give reliable references with direct links. **Never invent a URL.** If a link
  cannot be verified, say so rather than guessing at it.
- No flattery. Be objective: supportive, but show other viewpoints and be
  critical where it is warranted.

**How they like to be worked with** (learned over the session, not stated)
- They give short, numbered instructions and expect all of them done.
- They want to be told when an instruction cannot be carried out as written, and
  they want the nearest achievable thing built anyway rather than being blocked.
  Every time this has happened, saying so plainly and shipping the alternative
  behind a one-line switch has been the right call.
- They read screenshots. Send them.
- They do not want silent corrections to other people's words. See §6 Connect.

---

## 3. The environment, and what it cannot reach

Work happens in a managed remote container. Outbound HTTPS goes through an
egress proxy.

**Revised finding (2026-09-21), broader than what this section used to say:**
the block is not a short named list. Trying to fetch favicons for the
Essential Links logo feature, `curl` to `blackboard.le.ac.uk`,
`mystudentrecord.le.ac.uk`, `uniofleicester.sharepoint.com`,
`connect2.le.ac.uk`, `myuol.le.ac.uk`, `opentimetable.le.ac.uk`,
`remote.le.ac.uk`, and even **`le.ac.uk` itself** all came back `connect_rejected`
at the proxy (`$HTTPS_PROXY/__agentproxy/status` showed each as a 403 policy
denial, not a DNS or timeout failure). None of these were on the original
blocked list below — the working assumption should now be **"blocked unless
shown otherwise,"** not "blocked if it's on this list":

| Host | Status |
| --- | --- |
| `instagram.com`, `graph.instagram.com` | blocked (403 at the proxy) |
| `leicesterunion.com` | blocked |
| `outlook.live.com`, `outlook.office.com`, `outlook.office365.com` | blocked |
| `sway.cloud.microsoft` | **blocked** (found 2026-09-21, same `connect_rejected` 403) |
| any `le.ac.uk` subdomain, and `le.ac.uk` itself | **blocked** (found 2026-09-21) |
| `github.com` | works (all pushes go through it) |
| npm, PyPI | bypass the proxy entirely |
| `WebSearch` | **works** — use it |
| `WebFetch` | same block list as curl |

Consequences to remember rather than rediscover:
- The Instagram fetcher and anything touching the Union, Outlook, Microsoft
  Sway, or **any University of Leicester system** **cannot be tested here**.
  Say so when shipping them.
- **Do not hand-reconstruct a trademark or brand mark from memory** to work
  around this (a company logo, an icon) — an unverified guess at someone else's
  mark risks being visibly wrong, which is worse than leaving the honest
  fallback in place. Ship the infrastructure to add the real asset later
  instead; see Essential Links in §6.
- `WebSearch` works even when fetching does not. Use it to ground factual claims
  — but treat what it returns as unverified (§9).
- Confirm a block before claiming one: `curl -sS -o /dev/null -w "%{http_code}\n"
  --max-time 12 https://host/`, and `$HTTPS_PROXY/__agentproxy/status` logs recent
  refusals. A `000`/connection-failure result from curl is this block, not a
  dead site — do not report a real site as down without saying it was only
  checked from here.

**Tooling**
- Playwright: `/opt/node22/lib/node_modules/playwright/index.mjs` (global, not a
  project dependency). Chromium is preinstalled — never run `playwright install`.
- Serve the site for testing: `python3 -m http.server 8123`.
- Put scratch files in the session scratchpad directory, never in the repo.

---

## 4. How to check the work

```sh
python3 -m http.server 8123 &
node tools/check.mjs
```

`tools/check.mjs` is the regression run. **Everything in it has broken at least
once.** It exits non-zero on failure. Run it before every push, and add a case
whenever something breaks that it would not have caught.

It currently covers: seven slices; every slice's label clearing WCAG AA
(4.5:1) against its own fill and exactly two ink colours being in use across
the seven (see §7 on Amber Field for why this isn't "all equal" any more);
the light/dark toggle starting on dark with the right label, switching to
light and remembering it, surviving a reload with no flash back to dark
first, and switching back on a second click; the Join BioSoc newsletter
frame having no `src` until the section is opened, and the right one once it
has been; all seven sections opening scrolled to the top; 30 assessment
rows; 13 fallback links; 9 arc sections; 8 bento tiles; 27 pieces of advice;
the veil's wording; the covered tiles being unfocusable; 11 degrees with
unavailable modules hidden and only core/chosen in the top tier on every one
of them, no box left mid-animation once settled, the show-all switch
actually showing and hiding them, every intro arrow level with Year 1
Semester 1's, exactly one golden outline overlay each for Year 2 and Year 3
(never Year 1) and each one only lighting once its year actually reaches 120
credits; and an empty console.

Beyond that, screenshot at 1400×950 dark, the same light, and 390×844 for the
phone. Two habits that have repeatedly paid off:

- **Measure, do not eyeball.** Contrast, luminance, geometry and element
  positions have all been wrong in ways that looked fine.
- **Suspect the test first.** Three "regressions" in this session were the test
  clicking faster than it read, snapshotting before fonts settled, and measuring
  the axis-aligned box of a rotated element. Reproduce deliberately before
  concluding the code is broken.

---

## 5. The shape of the code

| File | Holds |
| --- | --- |
| `index.html` | The wheel container and the seven panels. Content lives here unless a section has a data file. |
| `assets/css/styles.css` | Tokens, wheel, panels, shared content helpers, the bento and its veil. |
| `assets/js/app.js` | Builds the wheel, both reveals, hash routing, the `biosoc:page` event. |
| `assets/js/theme.js` | The light/dark toggle, top right. Styled in `styles.css`, not its own file — see below. |
| `assets/js/menu.js` | The burger menu and its drawer, top left. Also styled in `styles.css` — see below. |
| `assets/js/arc.js`, `assets/css/arc.css` | Essential Links' arc and its zoom. |
| `assets/js/modulemap.js`, `assets/css/modulemap.css` | Customise Your Degree. |
| `assets/js/events.js`, `assets/css/events.css` | The calendar: subscribe card, four-week grid, Coming up list. |
| `assets/js/instagram.js`, `assets/css/instagram.css` | The Instagram block on Events. |
| `assets/js/sway.js`, `assets/css/sway.css` | BioSoc Newsletter — the Sway newsletter embed. |
| `assets/js/timetable.js`, `assets/css/timetable.css` | Timetable — the weekly grid, reached from the burger menu. |
| `assets/js/advice.js`, `assets/css/advice.css` | Connect. |
| `tools/check.mjs` | The regression run. |

**Generated data files — never hand-edit.** Change the source and re-run:

| Generated | Generator | Source |
| --- | --- | --- |
| `assets/data/curriculum.js` | `tools/build-curriculum.py` | rules at the top of the generator |
| `assets/data/events.js` | `tools/ics-to-events.py` | the published `.ics` |
| `assets/data/advice.js` | `tools/advice-to-js.py` | the collected advice text file |
| `assets/data/instagram-posts.js` | `tools/fetch-instagram.py` | Instagram's API |

Hand-edited data files: `links.js`, `calendar.js`, `instagram.js`, `sway.js`,
`timetable.js`.

**Parked workflows.** `tools/refresh-events.yml` and
`tools/refresh-instagram.yml` are GitHub Actions that are deliberately **not**
in `.github/workflows/`, so nothing runs against the repository until someone
decides it should. Do not move them without being asked.

**The light/dark toggle** (added 2026-09-21) is site-wide chrome, not a
section, so it lives outside the per-section table above and outside §6
below. A circular button, fixed top right, everywhere — the wheel and every
open page — built by `assets/js/theme.js`, styled in `styles.css` right after
the token block it depends on.

- **Dark is the default** (the site's original, only palette, still the bare
  `:root` values). Light is the second palette, added the same way
  `prefers-color-scheme: light` already applied it before this toggle
  existed. The toggle adds a third state on top: forced, either direction,
  via `[data-theme="light"]` or `[data-theme="dark"]` on `<html>`.
- **The override shape matches the tokens exactly, because it has to.** The
  system-light block gained a `:not([data-theme="dark"])` guard, and one new
  unguarded `:root[data-theme="light"]` block was added for forced light —
  forced dark needs nothing of its own, since with nothing overriding the
  bare (dark) tokens, dark is just what happens. The toggle's own icon-swap
  CSS (which icon is visible) uses the identical three-rule shape, on
  purpose, so the two can never disagree about which theme is showing.
  **Anything that changes what counts as "light" must edit both places** —
  the token block and the icon-swap block — not one.
- **The choice is read back out before first paint**, in index.html's own
  inline `<script>` (the one that also strips the `no-js` class), not in
  `theme.js` at the bottom of the page. `theme.js` runs after the DOM and
  every other script; by the time it does, a returning visitor with a stored
  preference has already been rendering in the wrong theme for however long
  the rest of the page took to load and parse, and `theme.js` running would
  only correct it after the fact — a visible flash of the wrong theme
  followed by a snap to the right one. The inline script sets `[data-theme]`
  synchronously, before the stylesheet is even used to paint anything, so
  there is nothing to flash away from.
- **`localStorage` reads are wrapped in try/catch, twice** — once in the
  inline head script, once in `theme.js`'s own write — because a private
  window, or a visitor with storage blocked entirely, throws rather than
  returning `null`. Both places fail open: no stored value (or a throw)
  means no override, which means the system preference decides, exactly as
  it did before this toggle existed.
- **Hidden entirely under `.no-js`**, same as `.page__chrome`. A button that
  does nothing without `theme.js` is worse than no button.

**The burger menu, top left** (added 2026-09-22, at explicit instruction) is
also site-wide chrome, built the same way — a fixed circular button, this
time paired with a slide-in drawer, in `assets/js/menu.js` (its own file:
unlike the toggle, it owns a whole panel's worth of markup and state, not
just an icon swap) and styled in `styles.css` right after the theme toggle's
own rules, which it otherwise mirrors closely (fixed, `z-index: 30`, same
button size).

- **Five dummy options, on purpose.** There is nowhere real to send them yet
  — `menu-drawer__link` is a plain `<button>`, not an `<a>`, specifically so
  clicking one does nothing rather than writing a stray `#` into the URL
  and tripping `app.js`'s hash router. Wire them up once there is something
  real for them to open.
- **Unlike the theme toggle, hidden whenever a section page is open**
  (`body.is-page-open .menu-toggle { display: none; }`) rather than fixed
  everywhere — an open page already has its own "Menu" back button in that
  same corner (`.page__chrome`), and two controls stacked there is one too
  many. It only ever opens from the wheel.
- **The panel is `min(75vw, 320px)` wide**, per the "75% of a phone
  screen's width" ask — the cap keeps it from becoming an absurd fixed
  sidebar on a desktop-width viewport, where 75vw would be enormous; on an
  actual phone width the cap essentially never binds.
- **A minimal focus trap**, not a general-purpose one: the panel only ever
  holds the close button and the five dummy links, so `menu.js` just wraps
  Tab between the first and last of that fixed list rather than walking the
  DOM for every focusable element. If the drawer ever grows real, varied
  content, replace this with a proper walk.
- **`#stage` (the wheel) gets `inert` while the drawer is open**, the same
  device Opportunities' veil and every section page already use — without
  it, the wheel's seven slices stay tabbable straight through the backdrop.
- Escape closes it and returns focus to the toggle button; clicking the
  backdrop or the drawer's own close button does the same.

**The stage's bottom row** (also 2026-09-22, also at explicit instruction):
the old `<p class="stage__hint">Choose a section</p>` is gone outright — not
hidden, removed, CSS rule and all — and a row of three social links now sits
where it was, in `index.html` inside `.stage`, styled right after `.stage__hint`
used to be (now `.stage__social`). Instagram, the LinkedIn group and
leicesterbiosoc.com, in that order. **The icons are generic pictograms
(camera outline, two-figure "network" glyph, globe), not the platforms' own
marks** — the same reasoning as the Essential Links logos in §3/§10: none of
these three domains can be reached from this container to check a redrawn
logo against, and a wrong reconstruction of a real mark is worse than an
honest generic one. Swap in real assets the same way Blackboard's, Outlook's,
the Library's and the Union's were, if the user supplies them directly.

---

## 6. Section by section

### Essential Links
Nine university links plus the `remote.le.ac.uk` hub, all supplied by the user.
Drawn as the wheel's own slice made huge: the ends of the outer edge sit on the
left and right screen edges about two thirds down. `rank` in
`assets/data/links.js` places a link — rank 1 is the middle. **The data file and
the `.links-fallback` list in `index.html` hold the same links and must be kept
in step.** Below 821px wide or 621px tall the arc is hidden, the list shows, and
the page opens with the ordinary bubble.

**Logo infrastructure exists, and four of the nine now use it, 2026-09-22.**
A link can carry `logo: "assets/img/logos/<name>.<ext>"` in
`assets/data/links.js` and `arc.js` draws it in place of the numbered
circle, falling back to the number automatically if the image 404s
(`onerror` adds `.is-broken`, tested with both a working and a broken
path). **Every one of these services' domains is blocked from this
container** — see §3, and note the finding there that the block turned
out to be far broader than previously documented, covering even
`le.ac.uk` itself — so nothing here could ever have been fetched, and
none was hand-drawn from memory: a wrong reconstruction of a company's
mark is worse than the plain number it would replace. What changed the
situation was the user supplying the actual image files directly —
Blackboard, Outlook, Library and Students' Union — landed as
`assets/img/logos/{blackboard.jpg, outlook.webp, library.jpg,
students-union.jpg}`, real assets, not fetched or drawn here, so the
concern above never applied to them. The other five links still have
none. Outlook's own file arrived at 960×909 and ~185KB, absurd for a
badge that renders at 1.45rem — downsized to 256×256 (~9KB) with
`PIL.Image.resize`, still comfortably above the size it ever displays
at; the other three arrived at sensible sizes already and were used
as-is. Add the remaining five the same way when they turn up, from a
normal network or the committee's own files.

**Reorganised 2026-09-22, at explicit instruction, into three levels
instead of a flat nine.** Three of the nine now carry a `more` list of their
own (Library, Students' Union, University SharePoint), and a brand new
fourth top-level entry, "Research resources", is nothing but a `more` list —
see the GROUPS note in `links.js`. This needed one small extension `arc.js`
didn't have before: a top-level link can now leave `href` out entirely, and
its wedge stops being a real link (no `href` attribute at all — genuinely
not a link, not just styled to look inert, so it drops out of tab order the
same way any `<a>` without `href` does) while its `more` pills underneath
stay fully clickable; `.seg--group` in `arc.css` drops the pointer cursor
and hover wash to match. This is the only entry that works this way so far
— every other top-level link, `more` or not, keeps a real destination of
its own.

Two apps (UoL Citizen, replacing the old "MyUoL" website link; SafeZone,
new) each ship as **two separate `more` entries** — "\<app\> (Google Play)"
and "\<app\> (App Store)" — rather than teaching the schema a second href
per item. Simpler, and the existing single-href `more` shape didn't need
touching for it.

`more` items' `note` is now genuinely optional (Google Scholar, Advice, and
the SafeZone pair have none) — `arc.js` used to assume every `more` item
had one; `esc(m.note || "")` fixed the version-in-templates that would
otherwise have baked the literal string `"undefined"` into the arc's hover
readout for exactly these new entries. Two names' spelling was corrected
against what the user actually meant while implementing this, both flagged
back to them at the time: "Centre to Academic Achievement" → **for**, and
"most useful websites to for your online research" → **for** (dropping the
duplicated word) — neither is a content decision, just a typo fix during
transcription.

**Badges levelled and the default hint swapped, 2026-09-22, at explicit
instruction.** Every `.seg-label` sits centred (both axes) on the same
radius, `Rlab`, in `draw()` — but the badge is only the *first* thing in
that box, and Library, Research resources, Students' Union and University
SharePoint are taller boxes than a plain segment (their `more` list adds
rows below the badge+name), so centring put their badges further out
toward the arc edge than a segment with no `more` list. There's no `more`
count that makes all nine match by construction — text wrap affects box
height too, unpredictably ahead of render — so `draw()` now runs a second
pass after the labels are built: it measures each badge's real offset
from its own label's centre via `offsetTop`/`offsetHeight` (pre-transform
layout values, so the label's own rotation, `--tilt`, never has to be
undone to read them — the same reasoning as `runIntro()`'s `levelPx` in
`modulemap.js`), then nudges every label's anchor radius so its badge
lands on the radius Library's badge measured at. Regression check: `tools/
check.mjs` recomputes each badge's actual distance from the arc's own
centre (replaying `draw()`'s own W/H-derived geometry) and asserts the
spread across all nine is under 2px — needs an extra 500ms wait beyond
this section's usual settle time, since it depends on real layout
geometry rather than DOM structure, and the panel's 940ms zoom-in
transition (`arc.css`) hadn't finished at the 700ms the section already
waited.

Separately: the hub's old hover-only note ("Here are the most useful
links for university in one place!", `links.js`) is now `arc.js`'s
default/resting `HINT` text, replacing "Point at a section of the arc to
see where it leads." — moved, not copied, so `hub.note` was removed
outright rather than left duplicated; hovering the hub itself now shows
just its name, no second line. The identical sentence in the no-JS
`.links-fallback` hero card (`index.html`) is untouched — it's a separate,
statically-written element with no hover mechanic and no arc, so "move"
doesn't apply to it.

### Study Resources
A 30-row assessment table transcribed from the **2024/25** schedule the user
screenshotted. It carries a visible caution to check every date against
Blackboard. That caution stays until the dates are re-verified for the current
year.

**A "Guides" heading and ten bento tiles were added above it, 2026-09-22,
at explicit instruction — and these needed something Opportunities'
bento never did: each tile is a real, clickable link to its own full
page, not a veiled placeholder.** Opportunities' tiles sit under an
`inert` bento behind a `.bento-veil` that blurs the grid and says
"Coming soon!" over the top of it — nothing there is reachable. Here,
the instruction was the opposite: the *tiles* work normally, and it is
each one's *destination* that currently says "Coming soon!"
(`<p class="guide-soon">` — see the CONTENT comment on the Guides bento
in `index.html`), to be replaced with real content guide by guide later.
That ruled out reusing the veil pattern outright.

**This needed a second, shallower kind of page, not just more content**,
because `assets/js/app.js`'s entire routing was built assuming exactly
one level: the wheel, and the seven sections one hash away from it —
`currentHashId()` only recognised a hash that named a wheel slice, and
`openPage()` unconditionally called `originFor(id)`, which reads
`slices[id].mid` and would throw for anything that is not one.  Ten new
wheel slices was never on the table (`SECTIONS.length` divides the
wheel evenly — ten more would turn it into a 17-slice wheel, wrecking
every degree the seven currently occupy), so a **second, independent
id-space** was added instead: `GUIDE_IDS` in `app.js`, ten ids
(`guide-balancing-university-life`, …) each with a matching
`<section class="page" id="page-guide-…">` in `index.html`, exactly the
`page-` + id convention the seven sections already use, but never added
to `SECTIONS`.
- `currentHashId()` now accepts a hash in *either* set.
- `openPage()`/`hidePage()` branch on whether `slices[id]` exists: a
  wheel slice still bubbles from its own tip (`originFor()`,
  unchanged); a Guides page bubbles from whichever tile was actually
  clicked — a new `guideOrigin` variable, set by a click listener that
  reads the clicked `<a>`'s own `getBoundingClientRect()` (mirroring
  `originFor()`'s geometry, just off an arbitrary element instead of a
  wheel angle) — or, reached any other way (typed hash, forward/back),
  from the viewport centre. One-shot: read once by the very next
  `openPage()` call, then cleared, so a later reopen by hash alone
  doesn't reuse a stale tile position.
- **The back button and Escape needed to go one level up (to Study
  Resources), not two (straight to the wheel), and the existing
  `data-back`/`goToMenu()` pair only knew the second.** Fixed by giving
  a Guides page's back button `data-back="study-resources"` (a real
  value) instead of the seven pages' plain `data-back` (no value); the
  click handler now checks for one and calls a new `goToParent(target)`
  instead of `goToMenu()` when present. Escape does the same check
  against `GUIDE_IDS` before choosing which to call.
  `goToParent()` mirrors `goToMenu()`'s `history.back()`-when-possible
  logic (so the browser's own back button still works, and back-to-
  Study-Resources doesn't pile up a redundant history entry) but
  **never clears `pushedHistory`** the way `goToMenu()` does — a
  Guides page is two `history.back()` calls from the wheel
  (page → Study Resources → wheel), and `goToMenu()`'s own later call,
  from Study Resources, still needs to see `pushedHistory` as true to
  know a `history.back()` is safe rather than a raw hash clear.
- Every other slice-only code path — `wheelDisc()`, the `reveal: "zoom"`
  check, `slice.link`/`slice.label` active-state classes — is already
  guarded by `if (slice)` or was never reachable for a non-slice id in
  the first place, so none of it needed touching.

The ten bento tiles themselves needed their sizes worked out by hand for
CSS Grid's sparse auto-placement (`grid-auto-flow` is left at its default,
not `dense`, same as Opportunities): "Balancing university life"
(`bento__tile--wide bento__tile--tall`, 2×2) and "How to take notes"
(`bento__tile--tall`, 1×2) placed first, in that order, fill the left three
columns of a 2-row band with two 1×1 tiles ("Lab skills", "Coding and stats
skills") completing the fourth column beside them — 4+2+1+1 = 8 cells,
one full 4-wide, 2-tall block, so the next tile in source order starts
a fresh row rather than being pushed somewhere unexpected by the sparse
algorithm. The remaining six 1×1 tiles then run a full row of four
followed by a row of two — a legitimately **shorter** last row (not a
hole in the middle of the grid, which is what the "keep tiling exactly"
warning on Opportunities' own bento is actually about), since 14 tile-units
across 4 columns was never going to be a whole number of full rows.

**The ten Guides pages no longer bubble open, 2026-09-22, at explicit
instruction.** They're one level deeper than a section — a circular reveal
growing from the tile just tapped, arriving right on top of the section's
own bubble a moment before, read as one reveal too many. Each now carries a
second class, `page--flat` (`index.html`), alongside its existing `page`
class; `styles.css` gives that class `clip-path: none` unconditionally and
a plain opacity fade instead — the same shape `.page--zoom` already used
for Essential Links (in `arc.css`), for a different reason. Nothing in
`app.js` needed to change: `openPage()`/`hidePage()` already just add and
remove the `is-open` class and let CSS decide what that means, so a new
CSS-only reveal variant is free. **The seven wheel sections, Essential
Links' zoom included, keep their bubble — this only touches the ten pages
one level under Study Resources.**

**Going back the other way — a Guides page to its section — doesn't bubble
either, 2026-09-22, same instruction taken further.** The first pass above
only fixed the Guides page's *own* open/close; it didn't touch what
happens to Study Resources itself when a Guides page closes back into it.
That reopen goes through the exact same `openPage("study-resources", true)`
call a fresh click on the wheel would make — same `animate: true`, same
bubble CSS — because from `app.js`'s point of view it *is* a fresh open;
nothing before this recorded that the section was still standing behind
the Guides page the whole time (its own close, when the Guides page opened,
was already instant — see `hidePage(openId, false)` inside `openPage()`).
Fixed with one more state, `is-returning`, toggled onto the panel in
`openPage()` right before the bubble/fade branch: true exactly when the
page now closing (`openId`, still holding its old value at that point) is
a Guides id and the page now opening is a real wheel section. `styles.css`
gives `.page.is-returning` the identical treatment `.page--flat` gets —
same selector group, both listed together — so returning fades the same
way a Guides page itself opens, rather than bubbling. The class is
recomputed with `classList.toggle(...)` on every single `openPage()` call,
never just added, so a later **fresh** open of the same section (from the
wheel, `openId` not a Guides id) clears it back off on its own — no
separate cleanup needed, and no risk of a stale flag suppressing a bubble
that should still happen. Only this one specific transition is affected;
opening a section from the wheel, or from any other section, still bubbles
exactly as before.

### Customise Your Degree
The whole curriculum on one board: **57 modules, 11 degrees, 39 timetable clash
pairs**, six subject streams (physiology, neuroscience, biochemistry, genetics,
microbiology, zoology, in that precedence order). Transcribed from four School
handbooks for 2026-27 (Year 2 and Year 3, Biological and Medical Sciences).

- Colour means subject stream only; the values were sampled pixel-wise from the
  School's own key, not estimated.
- `meta.uncoloured` holds BS2200, BS2000, both halves of the project, BS2004 and
  BS2094.
- `docs/handbook-issues.md` (206 lines) records what the transcription turned
  up: every degree is completable, but 39 listed options can never be taken.
  **It has not been sent to the School.**

**"Boxes must not move when you switch degree" — the project's own original
rule, stated explicitly early on and guarded by a regression test — was
reversed on 2026-09-21, at explicit instruction, not by oversight.** Boxes now
move on purpose:

- **Two tiers per column.** `.col__top` holds core and chosen modules; `.col__list`
  holds everything else (optional, blocked, and — only with "show all" on —
  unavailable). Picking an optional module moves it from the second tier to the
  first; switching degree can move anything, since what counts as core, chosen,
  optional or unavailable is recomputed from scratch.
- **A degree click drops every pick, even a still-valid one — and clicking
  the active degree again is a reset, not a no-op.** Changed 2026-09-21,
  at explicit instruction; before this, `prunePicks()` kept whichever picks
  the new degree could also offer and only dropped the rest — a pick under
  Zoology that happened to also be optional under Genetics would survive a
  switch to Genetics. `clearPicks()` replaced it: unconditional, every
  time, on the reasoning that a pick is the *previous* degree's plan, not
  necessarily the new one's, so nothing should carry over silently. On top
  of that, clicking the degree button that is already selected is a second,
  distinct action — `state.degree` resets to `DATA.degrees[0].id`
  (Biological Sciences) rather than leaving the click a no-op, alongside
  the same unconditional pick-clear every other degree click gets. One
  consequence worth knowing: the "a year that stays done through a degree
  switch is only repositioned, never re-faded" behaviour on the golden
  outline (below) is now rarely reachable *for a degree switch specifically*
  — a fresh degree starts with zero picks, so a year is essentially never
  still at 120 credits right after one. `yearOutlineShown`'s cross-render
  persistence still matters for a plain pick/drop rerender within the same
  degree, which is unaffected by this change.
- **Strictly unavailable modules are hidden by default**, not just styled
  dim. A checkbox switch (`state.showAll`, persisted in the URL as `?all=1`,
  the label reading "Show modules this degree does not offer") brings them
  back, styled exactly as the old `.box--unavailable` convention already drew
  them.
- **"About the module:" in the details sheet** (added 2026-09-21), styled
  identically to "Required by:" above it (both are `.sheet__req`) — content
  is `overview` on the module, a new field in `curriculum.js`'s schema: a
  plain string is one bullet, `{text, items}` is a bullet with its own
  sub-bullets (`overviewList()` in `modulemap.js` renders either shape; the
  nesting only goes one level deep, since nothing has needed more). No
  `overview` shows **N/A**. Currently set for the six Year 1 modules only
  (BS1030, BS1040, BS1050, BS1060, BS1070, MB1080), straight from the
  society, not transcribed from any handbook — unlike `about`, the
  existing short caveat line a few paragraphs above it in the same sheet,
  which mostly is. `overview` is edited in `tools/build-curriculum.py`
  (the generator) and the site's own `assets/data/curriculum.js` is never
  hand-touched, same as every other generated field.
- **Module Convenors / Aims / Learning Outcomes / Method of Assessment**
  (added 2026-09-22), four more `.sheet__req`-styled sections below "About
  the module:", in that order, for every Year 2 and Year 3 module —
  transcribed **verbatim**, on explicit instruction, from the two module
  description PDFs the user supplied (`Y2_module_descriptions_2026-27.pdf`,
  `Y3_module_descriptions_2026-271.pdf`), not written or paraphrased by
  anyone here. Year 1 and the two project halves (BS3PROJ/BS3PROJB) have no
  such PDF and so carry none of these four fields — all show **N/A**, same
  as any Year 2/3 module missing one specific section in its own source
  (about a sixth of them are missing Aims and/or Learning Outcomes this
  way — the PDFs are genuinely inconsistent about which sections every
  module gets, not an extraction gap).
  - `convenors` is a plain list of `"Name (email)"` strings, pairing each
    name with the e-mail immediately below it in the source — the PDF's
    two-column layout otherwise scatters convenor names after the
    Semester/Credits values, not under "Module Convenors:" itself, which
    took a specific reconstruction pass in the extraction script (not kept
    in the repo — a scratch script, not a generator) to get right.
  - `aims`/`learningOutcomes`/`assessment` are each a list of blocks —
    `{type: "p", text}` for a paragraph, `{type: "ul"|"ol", items}` for a
    bulleted or numbered list, matching whichever the source actually used
    for that section. A list item can itself be `{text, items}` for one
    level of sub-bullets (the same shape `overview` uses), needed for two
    modules whose source nests a lowercase "o " sub-list under a "•"
    bullet (BS2078's Learning Outcomes, BS3069's Method of Assessment).
    `blockList()` in `modulemap.js` renders these; `listItemHtml()` is
    shared with `overviewList()` for the actual `<li>` markup.
  - Three modules needed a judgement call, not a mechanical transcription,
    to satisfy "copy the text exactly, and do not add text outside of the
    ones listed": BS3010 has no "Method of Assessment:" label at all —
    its assessment is two separate, purely-assessment-content sections
    ("Debates:" 30%, "Written Examination:" 70%) that are combined here
    under one heading, each keeping its own source sub-header as a lead-in
    paragraph, nothing paraphrased. BS3054, BS3055 and BS3068 have no such
    label either — instead a single combined "(Module|Course) Structure
    and Assessment:" section that mixes non-assessment teaching-delivery
    prose with the genuine assessment-weighting sentences in the same
    paragraph run; only the assessment-specific sentence(s) were kept
    (word for word) and the structure-only sentences left out, rather than
    including the whole section (which would have pulled in text outside
    the four requested headings) or leaving assessment blank (which would
    have dropped real content that does exist). If a stricter reading of
    "exactly" is wanted here, these four are the ones to revisit first.
  - One verified, deliberate non-fix: BS3069's Method of Assessment reads
    "…reporting results?conclusions from a single…" — checked pixel for
    pixel against a render of the source PDF page, and the "?" really is
    what the document shows (not a PyMuPDF decoding artefact), so it was
    kept as-is rather than "corrected" to what was presumably meant ("/").
  - Two page-layout artefacts the transcription had to strip, beyond the
    ones already known from `overview`'s handling: a page-footer "SCHOOL OF
    BIOLOGICAL SCIENCES" line (the Y3 PDF's own variant of the "…AND
    BIOMEDICAL…" line already stripped elsewhere) had leaked into BS3056's
    Method of Assessment; and MB3057's source has "RECOMMENDED MODULES"
    with no trailing colon (every other module's version of this label has
    one), which meant it wasn't recognised as a section boundary and the
    module list below it leaked into MB3057's Method of Assessment too.
    Both are fixed at the source-text level, not patched into the data by
    hand.
  - `convenors`/`aims`/`learningOutcomes`/`assessment` are edited in
    `tools/build-curriculum.py` the same way `overview` is — never by hand
    in `assets/data/curriculum.js`. The one-off PDF-extraction script that
    did the actual transcription (PyMuPDF-based; `pdftotext`/`pypdf` were
    both unavailable in this environment) was a scratch tool, not
    committed — re-extracting from the same two PDFs would need rebuilding
    it, not editing an existing file in `tools/`.
- **The move is animated with FLIP** (First-Last-Invert-Play), in
  `assets/js/modulemap.js`: `rerender()` measures every box's position before
  `render()` throws the DOM away and rebuilds it, then `playFlip()` starts each
  surviving box's new element back at its old position (a transform, no
  transition) and releases it next frame. `render()` itself never changed —
  it still rebuilds everything from scratch on every click, same as always;
  the animation is a layer on top that fakes continuity across that rebuild.
  A box with no "before" position (newly available, or just revealed by the
  toggle) rises into place instead of sliding from somewhere specific
  (`.box--enter`).
- **A golden outline marks a YEAR reaching 120 credits — both semesters
  together — not a semester.** Revised 2026-09-20: it used to be
  `.col__top--done`, one outline per semester column, on whenever that
  column's year hit 120; it is now `.mm__year-outline`, a single overlay
  per year spanning both of that year's `.col__top` columns as one frame,
  drawn by `drawYearOutlines()` (called from the same `scheduleLinks()`
  rAF pass as `drawLinks()`, so it repositions on every render and resize
  same as the grouped-choice hub does). Two of these elements exist in the
  DOM at all times, `data-year="2"` and `data-year="3"` — **never Year 1**,
  which is fully core on every degree and would always be "done" from the
  first render, saying nothing. At most two outlines can ever be on
  screen. It **fades in** rather than snapping on: the element is
  positioned and unhidden first, then `.is-shown` (which carries the
  actual outline colour and glow) is added a frame later via
  `requestAnimationFrame`, so there is always a painted "before" state to
  transition from — a class baked straight into fresh `innerHTML`, by
  contrast, has no such "before" and cannot transition, which is why this
  could not just live on `.col__top` the way the outline used to.
  `yearOutlineShown` remembers which years are already lit across renders,
  so a year that stays done through a degree switch is only repositioned,
  never re-faded.
- **A one-time entrance animation** plays whenever the section opens (the
  `biosoc:page` event, not on every click inside it). `runIntro()` in
  `modulemap.js`, bailed out entirely under `prefers-reduced-motion`, same
  as `playFlip()`.

  Revised 2026-09-20, twice. First: the arrow now points right
  (`mm-arrow-nudge` nudges `translateX`, not `translateY`) instead of down,
  with the "Year N / Semester N" label below it. Second, and more
  structurally, **the reveal is now two full passes over the six columns,
  not one interleaved sequence**:
  - **Phase A (float in, still veiled).** Each column — a veil (giant
    arrow, label, translucent background) sitting on top of that
    column's modules — floats down into place, Year 1 Semester 1 first,
    one column after another (`STEP_MS` apart). This is a `transform`
    on `.col` itself, never an `opacity`: the veil is an
    absolutely-positioned child of `.col`, so the transform carries it
    down too, but an opacity on `.col` would take the veil's own
    visibility down with it — a descendant cannot opt back out of an
    ancestor's `opacity`, whatever its own value says. The modules stay
    at `opacity: 0` throughout, by their own rule, regardless of where
    their column currently sits.
  - **Phase B (reveal), only once every column has floated in** — not
    when the last one merely starts, when it *finishes*
    (`lastFloatEnds` in `runIntro()`, plus a short `REVEAL_PAUSE_MS`
    pause). Starting again from Year 1 Semester 1, each veil fades away
    in turn (`STEP_MS` apart again) to uncover that column's modules —
    its header and credit bar too, which needed no opacity rule of
    their own since the veil was covering them the whole time.

  Before this, the float and the reveal were the same pass: a column
  floated its own modules into view and lost its veil in the same beat,
  so column 2 could already be revealing itself while column 5 had not
  even floated in yet. `FLOAT_MS` is the Phase A transition duration and
  must stay in step with the `transition` on `.col.is-floated` in
  `modulemap.css`; the earlier float direction/speed change (from
  `translateY(16px)→none` floating *up* over 380ms, to floating *down*
  and slowed) carried straight over into this structure, now applied to
  the whole column rather than to each box individually.

  Revised again 2026-09-21, twice more:
  - **The float is longer, slower and gentler**: `translateY(-40px)` →
    `translateY(-120px)`, `FLOAT_MS` 640ms → 1000ms, and the timing
    function `var(--ease)` (the site-wide `cubic-bezier(0.22, 1, 0.36,
    1)`, a snappy ease-out used for most of the site's other motion) →
    plain `ease-in-out`, chosen deliberately *unlike* the site-wide curve
    — `--ease` front-loads nearly all of its motion in the first third
    and spends the rest barely moving, which reads as a quick arrival
    rather than a float; `ease-in-out` accelerates through the middle and
    decelerates at both ends, closer to an actual falling-and-settling
    motion. Confirmed with Playwright by sampling the column's computed
    `transform` through the transition: barely moved in the first ~200ms,
    most of the distance covered in the middle third, tapering into place
    by the end — the ease-in-out shape, not a front-loaded one.
  - **Every arrow now lines up level with Year 1 Semester 1's**, instead
    of each one centring vertically in its own veil. The columns hold
    different numbers of modules, so each veil was a different height,
    and centring independently put every arrow at a different height
    across the row. The arrow and label moved into a new
    `.mm__veil__inner` wrapper, positioned with `top` set inline by
    `runIntro()` — not centred by flexbox on the veil itself any more.
    The value is `cols[0].getBoundingClientRect().height / 2`: half of
    Year 1 Semester 1's own rendered height, applied as the same pixel
    `top` to every column's inner wrapper. This works only because
    `.mm__board` already has `align-items: start`, so every column's top
    edge (and therefore every veil's top edge, `inset` from it) sits at
    the same board Y-coordinate — the same pixel offset from each
    veil's own top therefore lands at the same absolute height on the
    page for all six. Set once, synchronously, before any column has
    started floating, so it is stable to check regardless of animation
    timing — see the "every intro arrow lines up level" case in
    `tools/check.mjs`, which does exactly that rather than racing the
    float/reveal sequence.

  **Revised again 2026-09-22, at explicit instruction: six per-column
  veils became three per-year ones**, each spanning both of that year's
  semester columns (and the "Year N" bar above them — see below), with
  the label reading just "Year N" instead of "Year N / Semester N".
  - The veil is no longer a child of `.col` (it cannot be — it has to
    span two of them), it is now `.mm__board`'s own child, sized and
    positioned with an inline `left/top/width/height` computed in
    `runIntro()` from `getBoundingClientRect()` on that year's
    `.mm__year-head` and both semester columns — the same measure-then-position
    approach `drawYearOutlines()` already used for the golden outline,
    reused here rather than invented fresh. That measurement has to
    happen **before** `.mm__board--intro` goes on the board: that class
    is what pushes the columns off-position with a CSS `transform`, and
    `getBoundingClientRect()` reports the current painted position, not
    the underlying layout one — measuring after would bake the
    off-position offset straight into the veil's "rest" rectangle.
  - The columns underneath still float via their own existing CSS
    transform (`.mm__board--intro .col` / `.col.is-floated`, untouched).
    The veil now gets its **own** transform, driven inline rather than
    through a class, kept in lock-step by using the exact same delay,
    duration (`FLOAT_MS`) and easing as the two columns it covers: since
    both are animating the identical transform curve from the identical
    "rest" reference frame, they stay visually aligned at every instant
    without either one measuring the other mid-flight.
  - This is also why the veil's fade-and-shrink-out on reveal
    (`opacity`, `transform: scale(0.94)`) is set with an inline
    `element.style.transition` at the moment it is needed, rather than
    through an `.is-gone` class the way it worked before: the veil now
    needs the `transform` property to run two *different* transitions in
    sequence (the 1000ms float-in, then the 420ms shrink-out), and CSS
    classes competing for the same shorthand `transition` property don't
    hand off between each other mid-sequence — whichever class is more
    specific wins outright, for every property the shorthand lists, not
    just the one that changed. Inline styles sidestep this outright, the
    same reasoning `playFlip()` already uses elsewhere in this file for
    exactly this kind of one-off, dynamically-timed transform.
  - `.mm__year-head` needed no opacity/reveal handling of its own after
    this change (a short-lived addition from earlier the same day, since
    reverted) — once its bar sits *inside* the area the combined veil
    covers, it is hidden by the veil the same way a column's own header
    and credit bar always were: no opacity rule, just visually covered
    until the veil above it goes.

- **The "Year N" label now spans both of that year's semester columns,
  separated from the credit bar, added 2026-09-22.** Previously each
  column's own heading read "Year N" (bold) with "Semester N" underneath
  it (smaller, `.col__name span`); now three `.mm__year-head` elements
  (`grid-column: span 2`, `aria-hidden="true"`) sit above the six `.col`
  as siblings in `.mm__board`, one per year, and each column's own
  `<h3 class="col__name">` shows only "Semester N". Nothing is measured
  or positioned in JS for this — `.mm__year-head` relies entirely on grid
  auto-placement: the three of them, appearing first in source order, each
  consume two of the six `grid-template-columns` tracks and fill row 1;
  the six `.col` that follow auto-place into row 2, exactly as before.
  `drawYearOutlines()`, `runIntro()`'s `cols[0]` measurement and every
  other piece of column geometry code was untouched and needed no
  changes — they all query by `[data-col="…"]` or `.col`, which still
  resolve to the same six elements in the same order regardless of what
  else sits in the grid.

  **The "Year N" text moving out of each column's own `<h3>` would have
  broken the heading outline for screen readers** — three `<h2>`/`<h3>`
  "Year N" headings all announced up front, before any "Semester N", with
  no way to tell which pair of semesters belonged to which year. Avoided
  by keeping `.mm__year-head` purely decorative (`aria-hidden`, not a
  heading at all) and instead prefixing each column's own `<h3>` with a
  `.visually-hidden` "Year N " span — visually only "Semester N" shows,
  but the accessible name is still the full "Year N Semester N" it always
  was, one self-contained heading per column, same as before.

  **What the intro animation does with `.mm__year-head` changed again the
  same day, when the six per-column veils became three per-year ones —
  see "A one-time entrance animation" below for the current mechanism.**
- **The credit tracker bar is twice as thick, also 2026-09-22**: `.col__bar`
  `height: 5px` → `10px` in `modulemap.css`. Nothing else about it changed
  — `.col__bar__fill`'s `height: 100%` already tracks its parent.
- **The stream legend was renamed, reordered and its neutral swatch
  recoloured, also 2026-09-22.** "Stream colours" → "Degree Stream
  Colours"; the legend now reads biochemistry, microbiology, genetics,
  physiology, neuroscience, zoology, "Core for every degree" — a
  **different order from `meta.streams` itself**, which stays physiology,
  neuroscience, biochemistry, genetics, microbiology, zoology in
  `curriculum.js`, because that array's own order is load-bearing:
  `streamOf()` walks it in order and the first stream a module is core
  for wins, for any module core under more than one. Reordering
  `meta.streams` to match the legend would have silently changed which
  colour some modules show. Fixed instead with a separate `LEGEND_ORDER`
  array in `modulemap.js`, used only for the legend's own rendering — any
  stream id it leaves out still appears, appended at the end, so a stream
  added to `curriculum.js` later without updating `LEGEND_ORDER` is never
  silently dropped from the legend. The "Core for every degree" swatch
  changed from `NEUTRAL.core` (`#bfbfbf`, plain grey) to `NEUTRAL.school`
  (`#1b6b3a`, dark green) — the colour `schoolCore` modules like BS2200
  and BS2000 already render in on the board itself (see `paintOf()`), so
  this is a legend fix, not a new colour: the grey swatch had never
  actually matched what "core for every degree" modules look like.
- **The veil's arrow is four times its old size, also 2026-09-22**:
  `.mm__veil__arrow`'s `width: clamp(2.4rem, 30%, 3.6rem)` →
  `clamp(9.6rem, 120%, 14.4rem)` in `modulemap.css` — every bound in the
  `clamp()` scaled by the same factor 4, which keeps the result exactly
  4x whatever it would have been at any veil width, not just the ones
  checked by hand (`clamp` is linear in its arguments for a uniform
  positive scale). The nudge animation's own travel distance
  (`mm-arrow-nudge`) was scaled the same way, `translateX(6px)` →
  `translateX(24px)`, so the animation still reads as the same gesture at
  the new size rather than becoming imperceptible against it.
- **The "Year N" text is about 3x its old size, and the gap under it much
  tighter, 2026-09-22.** `.mm__year-head`'s `font-size: 0.9rem` →
  `2.7rem`; `margin-bottom`/`padding-bottom` trimmed `0.5rem`/`0.4rem` →
  `0.2rem`/`0.2rem`. The real cause of the "awkward gap" this was fixing
  wasn't either of those, though — it was `.mm__board`'s own `gap:
  var(--col-gap)`. That single-value `gap` shorthand sets *both*
  row-gap and column-gap to the same value, which was harmless while the
  grid was six columns and one row (there was no row-gap to see), but
  once the "Year N" row existed above the six columns (see the
  `.mm__year-head` entry above) it meant a full `--col-gap` (2.75rem,
  44px) of vertical space between the year row and the columns below —
  far more than the `margin-bottom` alone suggested, and the actual
  source of the complaint. Fixed by splitting `.mm__board`'s `gap` into
  explicit `column-gap: var(--col-gap)` (unchanged — this is also the
  width a linked module's bridge spans, see `column()`'s bridge-drawing
  code, so it stays tied to `--col-gap` rather than getting its own
  value) and a separate, much smaller `row-gap: 0.4rem`.

**A real bug worth knowing if this is ever touched again:** the first version
of the intro removed a column's `is-revealed` class as soon as that column's
own reveal finished, while the board-level `.mm__board--intro` (which holds
every box at `opacity:0` by default) stayed on until the *last* column
finished. The result was each earlier column flashing visible then snapping
back to invisible until the whole sequence ended, then all of them fading in
together at once — the opposite of a staggered reveal. Fix: `is-revealed`, once
added to a column, is never removed until the entire sequence ends (all
columns, at once, in the same tick `.mm__board--intro` also comes off) or a
fresh `runIntro()` call explicitly resets it first. If a similar "cover
something with a class, uncover it individually" pattern is added elsewhere,
check for exactly this shape of bug: a per-item class that stops applying
before the per-group default it was overriding has also gone.

**A second bug in the same function, found 2026-09-20 while slowing the float
down:** column 0 (Year 1 Semester 1) never animated at all — it snapped
straight into place while every other column floated in properly. Its timer
used to run on a bare `setTimeout(fn, 0)` (`i * STEP_MS` with `i === 0`), which
fires on the very next macrotask — before the browser had painted the
"hidden, off-position" state that `.mm__board--intro` had just set moments
earlier in the same synchronous block. With no painted "before" to compare
against, the style change reads as old-equals-new and there is nothing to
transition. Confirmed with Playwright by sampling `getComputedStyle` at short
intervals after opening the section: column 0 reached its final state within
the first ~60ms, far faster than the transition duration could produce, while
every later column showed a proper climbing value. Fix: `START_MS` (currently
60ms) is now added to every column's delay, including column 0's, guaranteeing
at least one real paint of the hidden state before anything starts to move
(this still applies now the animated property is `.col`'s `transform` rather
than `.box`'s `opacity` — same mechanism, same fix). Two `requestAnimationFrame`
calls were tried first and did
not reliably fix it in this headless environment — a real elapsed-time delay
did.

### Opportunities
Eight placeholder tiles behind a blurred veil reading **Coming soon!**. The grid
carries `inert` so the links underneath cannot be clicked or tabbed into. **When
the tiles become real, remove the veil and that `inert` together.** Keep the
tile spans tiling the four-column grid exactly or the layout leaves holes.

### Connect
27 pieces of advice from students, one at a time, shuffled so all are seen
before any repeats, moving on every **40 seconds** (`DWELL` in
`assets/js/advice.js` — the only number).

- **The wording is the students' own and is transcribed verbatim, slips and
  all.** Do not tidy it. Correcting it would misquote them and would be undone
  the next time the generator runs. If it must change, change the text file.
- There is no pause and hovering does not hold it. That was asked for
  explicitly. It is worth knowing the cost: the longest piece is 113 words, about
  35 seconds of reading, and auto-updating text with no way to stop it is the
  case [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  exists for. Raising `DWELL` is the one-line remedy. This has been flagged once;
  do not keep raising it.
- The card's height is measured from the tallest piece at the current width and
  re-measured on resize. A fixed height in CSS cannot work: how tall the longest
  piece runs depends on how wide the column is.
- **The heading above the card is fixed, exact text**, given by the user
  verbatim (2026-09-21) and reproduced character-for-character, including the
  "give yourself ago" phrasing that reads like a slip for "a year ago" — not
  corrected, on the same "the wording is not ours to fix" principle as the
  advice itself. If this is ever revisited, that is a question for the user,
  not a silent tidy-up.
- **Each quote now carries who said it**: `assets/data/advice.js` gained `by`
  (an initial) and `year` (currently `"Year 3"` for every entry, a constant in
  `tools/advice-to-js.py`, not read per-line from the source file — the
  update file only carries initials). Shown as `— <initial>, <year>` right
  after the closing quotation mark, via a `<cite class="ad__by">` sibling of
  `.ad__text`, not CSS content on the quote mark itself (that mark is
  `::after` on `.ad__text`, already spoken for). The generator now parses
  `assets/data/Advice_from_students_02.txt` — an initial, then the quote — in
  place of the original numbered format. Re-run it, don't hand-edit
  `advice.js`, exactly as before.

### Events
Instagram first, then the calendar.

- **Instagram** shows the most recent posts from `instagram-posts.js` when the
  fetcher has run, otherwise whatever is pinned by hand in `instagram.js`. It
  stores **permalinks and dates only** — the `media_url` the API returns is
  signed and expires within days, so caching it would leave a grid of broken
  pictures. Pictures come from Instagram's own embed at the moment someone looks.
  Nothing is fetched from Instagram until the section is opened.
- **The calendar** leads with Subscribe in Outlook, then a four-week grid, then
  Coming up. Up to four events share a day's height; past four, three show and
  the last slot reads *+N more*.

### BioSoc Newsletter
**Renamed from "Join BioSoc" to "BioSoc Newsletter," 2026-09-24, at explicit
instruction** — `label` in `SECTIONS` (`assets/js/app.js`) and the page's own
`<h1>` (`index.html`); the section's `id` (`join-biosoc`, so also `#join-biosoc`
in the URL and `page-join-biosoc` in `index.html`) was deliberately left alone,
since renaming it would break the deep link and touch routing code the user
didn't ask to change. `§6 Join BioSoc` elsewhere in this file, and the section
heading below, are updated to match; dated entries describing what happened
*at the time* keep the name it had then.

**Replaced 2026-09-21, at explicit instruction**: the Union membership
hand-off (steps, facts strip, related links, and its own try-it-and-look
frame — everything §6 used to describe here) was removed outright and the
section now embeds BioSoc's newsletter, hosted on Microsoft Sway, instead.
**The site no longer tells a visitor how to actually join the Society or
what it costs** — that information existed only in the removed hand-off
(`assets/data/union.js`, recoverable from git history if this is ever
revisited) and nowhere else in the site. If a join/membership pathway is
wanted back, it needs to be re-added, possibly alongside the newsletter
rather than instead of it.

`assets/js/sway.js` builds the same "action card, then a best-effort frame,
then a footnote for if the frame stays empty" shape `union.js` used, because
it is the right shape for any hand-off to a service that might refuse to be
framed, not because the code was reused verbatim — `union.js` is deleted,
not repurposed. Sway's own embed code supplied the frame's `sandbox`
attribute (`allow-forms allow-modals allow-orientation-lock allow-popups
allow-same-origin allow-scripts`), carried over unchanged rather than
loosened or tightened. **`sway.cloud.microsoft` is blocked at this
container's egress** (§3), so whether it actually allows framing has never
been observed — confirmed instead that the browser's own request fails
(`net::ERR_TUNNEL_CONNECTION_FAILED`, the same shape as the `curl`
`connect_rejected` from the CLI), which is enough to know the frame will be
empty on this network but nothing about any other one. The footnote says
"most likely, your organisation's network will not allow it to appear
here" for exactly that reason — it names the likely cause without claiming
Sway itself refuses framing, which was never actually confirmed.

### Timetable
**Added 2026-09-24, at explicit instruction, as a fifth item in the burger
drawer** (§5's "The burger menu" entry) — the first of that drawer's five
options to actually go anywhere; the other four are still the dummy
placeholders described there. `#page-timetable` is a `.page page--flat`
like a Guides page: no parent section (it's reached from the drawer, not
a wheel slice or a Guides tile), so its `id` (`timetable`) sits in
`app.js`'s new `EXTRA_IDS` array rather than `SECTIONS` or `GUIDE_IDS`,
and both Escape and its back button fall through to the wheel, same as
the seven sections.

**The container `app.js`/`timetable.js` build into is `#timetable-grid`,
not `#timetable`, on purpose.** The page's own hash is `#timetable`; an
element with that same id inside it is exactly the "a container id must
never match a section id" trap this file already warns about elsewhere
(§2) — hit it here first, by using the obvious name, before renaming it:
the browser silently scrolled straight to the grid on open, which looked
like `.page__inner`'s top padding had stopped applying (it hadn't;
`.page__scroll` just wasn't at `scrollTop: 0` any more). Caught by
actually inspecting `getBoundingClientRect().top` on the mounted
`.page__inner`, not by eye — the screenshot alone read as a vague "the
back button is overlapping the heading," which doesn't point at a hash
collision nearly as directly as a negative `top` does.

**Content is one real week, hand-transcribed from a screenshot of the
University's own timetable** (2026-09-24), not generated and not live —
the same reasoning as `calendar.js`: nothing here can reach a live
University timetable feed any more than it can reach Outlook's calendar
(§3). Several room numbers in the source screenshot were themselves cut
off mid-word by its own layout (three lectures clashing at once, e.g.
Wednesday noon); those are transcribed exactly as truncated (`"Bennett
Lecture The…"`) rather than guessed at — a wrong specific room number
would be worse than an honestly incomplete one. Session durations for
the two longer sessions (a Thursday workshop, a Friday practical) were
read off the screenshot's own block heights relative to its hourly
gridlines, not printed as text anywhere in the source; every other
session defaults to the standard one-hour slot the source consistently
used everywhere it wasn't visually taller.

**Colour is borrowed from `curriculum.js`'s `meta.streams`/`meta.neutral`
outright, not a second palette** — `timetable.js` reads
`window.BIOSOC_CURRICULUM` directly and maps each session's `stream`
field (the same stream ids the module map uses: `genetics`,
`biochemistry`, `physiology`, `neuroscience`, `microbiology`, `zoology`)
to the identical colour Customise Your Degree gives that stream, plus two
of its own: `"core"` (`meta.neutral.core`, the same grey a module with no
single stream gets there) and `"cohort"` (`meta.neutral.school`, the same
dark green a module every degree takes gets there) for the two sessions
that aren't a subject module at all (Welcome Back, Careers Hour). Every
`stream` value on every session in the data was derived from `curriculum.js`
itself — which degree's `y3s1c`/`y3s2c` actually lists that module as
core, in the module map's own precedence order — not guessed from the
module's subject-sounding name.

**Overlapping sessions are laid out with the standard calendar-column
algorithm**, not a fixed two/three-way split: sort a day's sessions by
start time, greedily pack each into the first column whose last-placed
session has already ended, then give every session a share of however
many columns are active during its own time span. Handles the data's
worst case (three lectures at once, Wednesday noon) correctly without
needing to special-case it.

---

## 7. Rules that must not be quietly broken

Each of these cost real debugging. The reason matters more than the rule.

**The wheel's colour is "Amber Field," replaced 2026-09-21 — read this
before touching a hue, a saturation, or the label ink.** The three palettes
this section describes, in order, are history, not options to pick between:
the original solved-equal-luminance one; the brief white-label-on-it revision
the same day; and Amber Field, which replaced both.

*Until 2026-09-21*, every slice's lightness was solved so all seven landed on
one shared relative luminance (0.418–0.421) at a single fixed saturation
(92%) — a green at that lightness is far brighter than a blue at it, so
picking lightness by eye came out uneven, and the fix was to solve for it
instead. The label was originally dark ink at a real 8:1 on every slice, then
briefly white-with-a-shadow at the user's explicit request (measured: a flat
2.2:1 against every fill, under WCAG AA, the shadow a stand-in for contrast
the colour no longer gave).

**Amber Field breaks the equal-luminance premise on purpose.** It was built
from two reference images the user supplied (see §10 for the full derivation)
whose amber and olive are pixel-identical, paired in one image with a bright
violet and periwinkle, in the other with a dark, muted navy and plum. The
user picked the dark pairing. Solving *that* palette's hues to one shared
luminance the way the old palette's were would force navy and plum up to a
pale lavender — losing exactly what makes them read as navy and plum, the
point of picking this one over its brighter sibling. So luminance here is
deliberately uneven (amber 0.45 down to plum 0.05), and saturation is no
longer one fixed value either — `--slice-sat` (92%) is now a fallback only;
every slice sets its own `--sat`, amber and magenta carrying more of it than
the rest, matching the reference's own warm-pops-forward character.

**That trade reopens the label question**, because one ink can no longer read
well on every slice. The fix: `ink` per section (`"dark"` or `"light"`) in
`assets/js/app.js`'s `SECTIONS`, applied as a `.slice-label--dark` class that
switches to `--slice-ink` and drops the shadow (`assets/css/styles.css`) —
dark ink where the slice is bright enough to carry it, the existing
white-with-shadow where it isn't. Each was chosen, not guessed: every one of
the seven clears WCAG AA (4.5:1) against its own fill, several well past it —
worth stating plainly since the two revisions before this one both left every
slice under that bar (8:1 was only true on the very first version, and only
because every slice matched every other in brightness; the ink itself was
never actually re-verified against variety). See the "every slice's label
clears WCAG AA" and "two ink colours are in use" cases in `tools/check.mjs`,
which check this directly against the rendered page rather than trusting the
numbers below.

**Change a hue, a saturation, or a lightness and the other two of that
slice's `ink` decision have to be re-checked, not assumed** — nothing here is
solved-once-for-all any more the way the old palette was. Current values:

| Section | Hue | Sat | Lightness | Ink | Result |
| --- | --- | --- | --- | --- | --- |
| Essential Links | 40 | 72.0% | 56.0% | dark | `#e0aa3e` |
| Study Resources | 89 | 43.0% | 43.0% | dark | `#6f9d3f` |
| Customise Your Degree | 130 | 41.2% | 41.2% | dark | `#3e944c` |
| Opportunities | 175 | 39.1% | 41.0% | dark | `#40918b` |
| Connect | 223 | 37.0% | 37.0% | light | `#3b4f81` |
| Events | 275 | 33.0% | 30.0% | light | `#513366` |
| BioSoc Newsletter | 330 | 50.2% | 41.4% | light | `#9f356a` |

Essential Links (amber) and Study Resources (olive) are the two hues lifted
directly from the user's reference images, pixel-identical to the source.
Connect (navy) and Events (plum) are the other two anchors, also lifted
directly. Customise Your Degree (teal), Opportunities (cyan-teal) and Join
BioSoc (magenta) fill the remaining three slices the wheel needs, interpolated
between the nearest two anchors in hue, saturation and lightness together —
not solved, matched to whichever anchors they sit between. Opportunities'
lightness (41.0%) is nudged 1.9 points above its raw interpolation (39.1%)
specifically to clear 4.5:1 in dark ink — interpolation got it to 4.46:1,
just short.

The outline between slices was softened on an earlier request ("less
contrasting"): the stroke's lightness offset from its own fill dropped from
-13%/-26% (base/hover) to -4%/-9%. It now reads as a seam, not a border — that
is deliberate, not a value picked and forgotten, and is unchanged by Amber
Field.

**A container id must never match a section id.** The section ids double as URL
hashes, so a `<div id="events">` made the browser scroll to it every time
`#events` opened, hiding the heading and everything above. Hence `#calendar`.

**`inert` on a descendant does not survive the panel's own `inert` being
removed.** Chromium recomputes the subtree and does not restore a descendant's
own. `app.js` re-asserts it on open. Without that, the veiled Opportunities
tiles were tabbable straight through the veil.

**`GAP_DEG` is 0.** A gap held at a constant *angle* grows with the radius, so
any value above zero is invisible at the hub and a wedge at the rim. If a gap is
ever wanted back it must be a constant arc length.

**A colour token only ever belongs in `:root` or a `[data-theme]`/media block
— never hand-picked for one component.** The light/dark toggle (§5) means
three states now decide colour (system dark, system light, and either forced
by `[data-theme]`), and every one of them has to agree. A component that sets
its own literal colour instead of a `var(--token)` is correct in whichever
state it was written in and wrong in the others.

**`biosoc:page` is the contract for section-scoped work.** `app.js` fires it on
open with `{ id }` and on close with `{ id: null }`. Instagram, the Sway
newsletter frame and the advice clock all wait for it, so nothing runs — and
nothing is fetched from a third party — before anyone has asked to see it.
Keep new work on it.

**Transitions must not start from the wrong place.** `arc.js` commits its zoom
start position with a forced reflow while the panel is unmounted; the CSS
disables the transition until `is-mounted`. Without both, the arc animates
towards its start instead of from it.

**Reduced motion needs delays zeroed, not just durations.** A previous bug left
the whole body invisible because only durations were set to 1ms.

---

## 8. Things that are impossible, not merely undone

Do not spend time re-attempting these without new information.

- **Instagram cannot embed a profile.** The only supported embed is one post at
  a time, via the blockquote and `embed.js` from a post's Embed menu. A live
  feed needs the Graph API and a token; see
  <https://developers.facebook.com/docs/instagram-platform/>. An unofficial
  `instagram.com/<handle>/embed/` frame was built, tried and removed again —
  see §10 item 5.
- **Outlook's published calendar cannot be framed.** Microsoft serves it with
  `X-Frame-Options: SAMEORIGIN` and their own support answers say to link to it
  instead. The four-week grid is drawn locally for that reason. A `mode:
  "outlook"` switch existed to try framing it anyway and was removed — see §10
  item 4.
- **Embedding Instagram and Outlook is off the table for now, by decision**
  (2026-09-21), separate from the technical findings above. Both switches were
  built, then deliberately taken back out rather than left dormant — see §10
  items 4 and 5 before rebuilding either.
- **The Union's pages are very likely unframeable too**, for the same reason —
  moot now, since the Union hand-off that tried it (`union.js`, `embed: true`)
  was removed on 2026-09-21; see §6 BioSoc Newsletter. Its replacement,
  `assets/js/sway.js`, is the same try-it-and-look shape, this time for
  Sway. Whether Sway allows framing has also never been tested, because
  `sway.cloud.microsoft` is blocked here too (§3) — the browser's own request
  fails with `net::ERR_TUNNEL_CONNECTION_FAILED`, confirmed with Playwright,
  which says nothing about what happens on a normal network.
- **A browser cannot fetch the Outlook `.ics` directly** — no CORS headers. That
  is why the fetching happens in a generator or an Action instead.

---

## 9. What is known, and what is only believed

**Verified** (from files the user supplied, or measured directly): every link in
Essential Links; the assessment table's contents; the curriculum; the 27 pieces
of advice; the four calendar events; the calendar's timezone fault; the wheel's
colour maths; the Union and Instagram URLs the user gave.

**Unverified — do not publish any of it as fact.** A `WebSearch` turned these up
and none could be fetched to confirm:

- A different canonical Union URL:
  `leicesterunion.com/opportunities/societies/findasociety/6321/`. The user gave
  `leicesterunion.com/sportsandsocs/societies/biosoc/`, which is what the site
  uses.
- A society description: *"run by students from the School of Biological
  Sciences who are passionate about their course…"*, mentioning bar crawls,
  pizza nights and industry ambassador talks.
- A contact address: `su-biosoc@leicester.ac.uk`.

The user was told about all three and has not confirmed them. **They are not in
the site.** The blurb currently on the Instagram card was written blind and the
user was asked to check it.

**Reference documents used, all real:**
- [Import or subscribe to a calendar in Outlook](https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web)
  — the ~3-hour refresh, "can take more than 24 hours".
- [Introduction to publishing Internet Calendars](https://support.microsoft.com/en-us/outlook/introduction-to-publishing-internet-calendars)
- [Meta's Instagram Platform docs](https://developers.facebook.com/docs/instagram-platform/)
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

---

## 10. Open items, owed to the user

Roughly in order of how much they matter. Items 1, 2, 6, 7, 8 and 9 were put to
the user on 2026-09-20 and answered; the answers are recorded here rather than
in §11, because none of them reversed a decision — they settled one that was
genuinely open.

1. **The website's own display of the calendar is correct, and confirmed as
   such.** `tools/ics-to-events.py` re-reads each event's wall clock as
   `Europe/London` (`REINTERPRET = "Europe/London"`), which is a real IANA zone
   and switches BST/GMT at the DST boundary on its own — it does not hardcode
   either. The user confirmed the three 10:00 events in the current
   `events.js` are correctly 10:00 BST. **What is still wrong is the Outlook
   subscribe feed itself** — students who subscribe get times straight from
   Outlook, still in the calendar's own mislabelled *W. Europe Standard Time*.
   That can only be fixed in Outlook (set the calendar's own timezone to
   *(UTC+00:00) Dublin, Edinburgh, Lisbon, London*, check every existing event
   still reads the intended hour, re-save the `.ics`), which cannot be done or
   tested from here — outlook.\* is blocked at this container's proxy. Once
   fixed at the source, set `REINTERPRET = None` and re-run the generator.
2. **The calendar stays on a personal Microsoft account, by policy.** The user
   confirmed a committee member's own account is acceptable, rotated each year
   as committees change. Not a defect — no action needed. The address is still
   effectively public, so nothing private should go in that calendar.
3. **Superseded, not just closed, on 2026-09-21**: Join BioSoc's two
   `check: true` steps and the facts strip's missing membership price were
   what remained of the Union hand-off, which has since been removed
   outright (see §6 BioSoc Newsletter) — there is no longer a hand-off for either
   to belong to. Restoring a join/membership pathway is a fresh task, not a
   matter of confirming these two old facts.
4. **`embed: true` in `union.js` is moot: `union.js` was deleted on
   2026-09-21**, at explicit instruction, along with the rest of the Union
   hand-off — see §6 BioSoc Newsletter and item 3 above. It was never verified,
   because leicesterunion.com is blocked at this container's egress proxy,
   so this is now unresolved rather than closed: if the Union hand-off is
   ever rebuilt, whether its pages can be framed is exactly as unknown as it
   always was. Its replacement, the Sway newsletter frame in
   `assets/js/sway.js`, is in the same unverified position for the same
   reason (`sway.cloud.microsoft` is also blocked here).

   The Outlook side of this item — a `mode: "outlook"` switch that tried
   framing Outlook's own published calendar page — was built, then removed
   entirely at the user's instruction (2026-09-21). See item 5 for why. The
   exact prior code, if ever wanted again, is in the commit history —
   `git log -p -S'outlookFrame' -- assets/js/events.js` finds it. Do not
   rebuild it without being asked; the hand-drawn four-week grid
   (`assets/js/events.js`, `fourWeeks()`) is now the only view and has no
   switch pointing away from it.

5. **Instagram and Outlook embedding: abandoned, for now, by explicit
   instruction (2026-09-21).** The full sequence, because it is easy to
   mis-remember as "still open":

   - The user supplied a second, Gemini-built version of this site as an HTML
     file, prompted by their earlier claim that Gemini had "embedded Instagram
     without issue." Its actual code: `<iframe
     src="https://www.instagram.com/biosoc.leics/embed/">` — a bare profile
     URL with `/embed/` appended, which is **not** Meta's documented mechanism
     (that remains one post at a time via the blockquote/`embed.js` already
     built). The same file also stood in a public Google *UK holidays*
     calendar in place of the Outlook calendar it could not embed, and shipped
     a client-side "membership login" whose valid codes sit in plaintext in
     its own JavaScript — real reasons for scepticism about the Instagram URL
     too, not just generic caution about AI-written code. None of this was
     ever confirmed rendering in a live browser.
   - A `profileEmbed: false` switch was built anyway (same shape as `union.js`'s
     `embed`), verified to wire up correctly, and shipped as commit `a6741fb`.
   - **The user then said: abandon trying to embed Instagram and Outlook, for
     now at least, and implement nothing from the Gemini file** — it was an
     earlier, more primitive test. Both switches (`profileEmbed` in
     `instagram.js`, `mode: "outlook"` in `calendar.js`) were removed
     completely, not just left off, in the commit after `a6741fb`. **None** of
     the Gemini file's other content — the staff contact directory, the
     candidate £5 membership price, the Harvard referencing guide text, the
     `woolly-olives.github.io/Modules/` iframe — was ever implemented, and per
     this instruction it stays that way unless separately asked for.

   **Where this leaves things:** Instagram is the card-plus-pinned-posts
   design only, exactly as documented in §6 Events. The calendar's four-week
   view is the hand-drawn grid only, no switch. Getting a documented, durable
   Instagram feed still needs a Business or Creator account, a Meta app with
   Instagram Business Login, a long-lived token in `IG_TOKEN`, and a hand-run
   of `tools/fetch-instagram.py` before its workflow moves into
   `.github/workflows/` — that path is independent of the embedding question
   above and was never in scope for this decision. Do not reopen either
   embedding attempt without the user raising it again.
6. **BS2033 and BS2059 are coloured by their own degree stream, confirmed
   correct.** The user confirmed field-trip modules should carry their stream
   colour like any other. Checked against `curriculum.js`: neither is in
   `meta.uncoloured`, and both already derive a stream (BS2059 core for
   Zoology; BS2033 core-one-of for Microbiology), so this was already the
   board's behaviour — no code change was needed. The same logic already
   applies to BS2078 and BS3080, the other two `field: true` modules.
7. `docs/handbook-issues.md` — the user will send this to the School
   themselves. No action needed from here.
8. **The Opportunities tiles stay as placeholders, by decision** (2026-09-20).
   Not a defect — no action needed.
9. **The assessment table stays the 2024/25 schedule until the user has the
   2026/27 one.** They will provide it when they have access. The caution note
   at the top of Study Resources stays until then.
10. **The wheel's colour is "Amber Field," implemented 2026-09-21 after
    three rounds of preview.** Full sequence, since the reasoning behind the
    final numbers lives across all three and is easy to lose:
    - Round one (an Artifact, not committed): the existing equal-luminance
      method applied to five different hue *families* — a full spectrum,
      a cool range, a warm range, a botanical range, and the existing hues
      desaturated to pastel. All still solved to one shared luminance, same
      as the palette live at the time.
    - Round two (another Artifact): six options that changed the
      *construction* instead — a golden-angle scatter, fluorescent
      microscopy hues, hand-picked "nameable" primaries, a three-hue
      repeating pattern, the existing hues muted and dimmed, and a
      single-hue saturation ombré. Still all equal-luminance.
    - Round three: the user supplied two screenshots — a four-colour block
      image and a small striped icon — asking for two palettes referencing
      them, explicitly not to be coded yet. Sampling both images pixel by
      pixel turned up that they share one identical amber (`#e0a93e`) and
      olive (`#6f9d3f`); they differ only in the cool half, which the block
      image pairs with a dark, muted navy and plum and the icon pairs with
      a brighter violet and periwinkle. Two options were built from this —
      "Amber Field" (the muted pairing) and "Amber Bloom" (the bright
      one) — each with the three additional hues the wheel needs
      (beyond the four in the references) interpolated between the nearest
      real anchors, in hue, saturation *and* lightness together, not
      solved. This was flagged plainly as a departure: forcing these hues
      to the wheel's usual shared luminance would wash the dark pairing out
      to pale lavender, so this round deliberately did not do that — shown
      un-equalised, with the label-contrast consequence spelled out rather
      than fixed quietly.
    - The user picked Amber Field and asked for it implemented. Since the
      luminance really is uneven, the label-ink question raised in round
      three needed an actual answer, not just a flagged concern: `ink` per
      section, dark or white, whichever clears WCAG AA against that
      slice's own fill (all seven now do; see §7). Opportunities' raw
      interpolated lightness (39.1%) was nudged to 41.0% for exactly this
      reason — 4.46:1 in dark ink, just under the bar.

    See §7 for the current hue/sat/lightness/ink table and §4 for the
    `tools/check.mjs` cases that verify the WCAG contrast claims above
    against the rendered page, rather than trusting the arithmetic alone.
11. **Module Convenors / Aims / Learning Outcomes / Method of Assessment,
    added 2026-09-22 — four modules' worth of judgement calls the user may
    want to check.** Full detail is in §6 Customise Your Degree; the short
    version, since these are the four places a mechanical "copy exactly"
    reading wasn't available:
    - **BS3010** has no "Method of Assessment:" label in the source at
      all — its two assessment-only subsections ("Debates:" 30%, "Written
      Examination:" 70%) were combined under that heading, each keeping
      its own source sub-header. Reasonable, but a combination the source
      itself doesn't make explicitly.
    - **BS3054, BS3055, BS3068** each have a single combined "Structure and
      Assessment:" section mixing non-assessment teaching-delivery prose
      with the real assessment-weighting sentences in the same paragraphs.
      Only the assessment-specific sentence(s) were kept, verbatim; the
      structure-only sentences were left out rather than included (which
      would have pulled in text outside the four requested headings).
    - Everything else transcribed cleanly, verified module-by-module
      against the raw PDF text, including two genuine source quirks kept
      as-is rather than corrected: BS3069's Method of Assessment has a
      literal "?" where "/" was presumably meant (confirmed against a
      render of the actual PDF page, not a PyMuPDF artefact), and BS2004's
      convenor "Dr Swidbert ott" has a lowercase surname in the source
      that is capitalised everywhere else he's listed.
    - Every other Year 2/3 module missing Aims and/or Learning Outcomes
      (about a sixth of them) was individually confirmed as a genuine
      source omission, not a missed label — see §6 for the full list.

---

## 11. Decisions that departed from what was asked

Each was flagged to the user at the time. Do not quietly reverse them, and do
not re-litigate them either.

- **A four-week grid was drawn by hand** although the instruction was "do not
  code your own calendar design, just show Outlook's". Outlook cannot be
  framed, so the alternative was delivering nothing. A `mode: "outlook"`
  switch was tried and then removed at the user's instruction (2026-09-21,
  see §10 item 5) — do not rebuild it unasked.
- **The advice card keeps a fixed height**, which leaves space under short
  pieces. Without it the card resizes under the reader every 40 seconds.
- **The page backgrounds were lifted** along with the wheel when "the colours"
  were called too dark. If only the wheel was meant, `--bg`, `--bg-deep` and
  `--surface` are a small revert.
- **Instagram ships without the thing that was literally asked for** — a
  whole-profile embed — because there is no documented way to do it. An
  unofficial one was tried and then removed at the user's instruction
  (2026-09-21, §10 item 5); the card-and-posts design is what remains, and is
  not to be replaced with an embedding attempt again unasked.
- **The Union's hand-off was, until 2026-09-21, different from the two above
  and not to be read as the same kind of "gave up"**: `embed: true` in
  `union.js` was live, asked for explicitly, and untouched by that day's
  earlier Instagram/Outlook decision. Later the same day the user gave a
  separate, explicit instruction to clear the section out and replace it
  with the Sway newsletter — `union.js` is now deleted; see §6 BioSoc Newsletter
  and §10 items 3–4.
