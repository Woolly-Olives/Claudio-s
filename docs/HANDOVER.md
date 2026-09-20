# Handover

Written for whoever picks this up next — most likely me, with no memory of any
of it. It records what was asked for, what was decided and why, what is known to
be true, what is only believed, and what is still owed. `CLAUDE.md` at the root
is the short version that loads automatically; this is the long one.

Last updated at commit `447a630`.

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
egress proxy, and **several hosts this project depends on are blocked by
policy**, not by those sites:

| Host | Status |
| --- | --- |
| `instagram.com`, `graph.instagram.com` | **blocked** (403 at the proxy) |
| `leicesterunion.com` | **blocked** |
| `outlook.live.com`, `outlook.office.com`, `outlook.office365.com` | **blocked** |
| `github.com` | works (all pushes go through it) |
| npm, PyPI | bypass the proxy entirely |
| `WebSearch` | **works** — use it |
| `WebFetch` | same block list as curl |

Consequences to remember rather than rediscover:
- The Instagram fetcher and anything touching the Union or Outlook **cannot be
  tested here**. Say so when shipping them.
- `WebSearch` works even when fetching does not. Use it to ground factual claims
  — but treat what it returns as unverified (§9).
- Confirm a block before claiming one: `curl -sS -o /dev/null -w "%{http_code}\n"
  --max-time 12 https://host/`, and `$HTTPS_PROXY/__agentproxy/status` logs recent
  refusals.

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

It currently covers: seven slices; all slices within 0.01 luminance of each
other; one label colour; all seven sections opening scrolled to the top; 30
assessment rows; 13 fallback links; 9 arc sections; 8 bento tiles; 27 pieces of
advice; the veil's wording; the covered tiles being unfocusable; 11 degrees with
no box moving between them; and an empty console.

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
| `assets/js/arc.js`, `assets/css/arc.css` | Essential Links' arc and its zoom. |
| `assets/js/modulemap.js`, `assets/css/modulemap.css` | Customise Your Degree. |
| `assets/js/events.js`, `assets/css/events.css` | The calendar: subscribe card, four-week grid, Coming up list. |
| `assets/js/instagram.js`, `assets/css/instagram.css` | The Instagram block on Events. |
| `assets/js/union.js`, `assets/css/union.css` | Join BioSoc. |
| `assets/js/advice.js`, `assets/css/advice.css` | Connect. |
| `tools/check.mjs` | The regression run. |

**Generated data files — never hand-edit.** Change the source and re-run:

| Generated | Generator | Source |
| --- | --- | --- |
| `assets/data/curriculum.js` | `tools/build-curriculum.py` | rules at the top of the generator |
| `assets/data/events.js` | `tools/ics-to-events.py` | the published `.ics` |
| `assets/data/advice.js` | `tools/advice-to-js.py` | the collected advice text file |
| `assets/data/instagram-posts.js` | `tools/fetch-instagram.py` | Instagram's API |

Hand-edited data files: `links.js`, `calendar.js`, `instagram.js`, `union.js`.

**Parked workflows.** `tools/refresh-events.yml` and
`tools/refresh-instagram.yml` are GitHub Actions that are deliberately **not**
in `.github/workflows/`, so nothing runs against the repository until someone
decides it should. Do not move them without being asked.

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

### Study Resources
A 30-row assessment table transcribed from the **2024/25** schedule the user
screenshotted. It carries a visible caution to check every date against
Blackboard. That caution stays until the dates are re-verified for the current
year.

### Customise Your Degree
The whole curriculum on one board: **57 modules, 11 degrees, 39 timetable clash
pairs**, six subject streams (physiology, neuroscience, biochemistry, genetics,
microbiology, zoology, in that precedence order). Transcribed from four School
handbooks for 2026-27 (Year 2 and Year 3, Biological and Medical Sciences).

- Boxes must not move when you switch degree. The regression checks this.
- Colour means subject stream only; the values were sampled pixel-wise from the
  School's own key, not estimated.
- `meta.uncoloured` holds BS2200, BS2000, both halves of the project, BS2004 and
  BS2094.
- `docs/handbook-issues.md` (206 lines) records what the transcription turned
  up: every degree is completable, but 39 listed options can never be taken.
  **It has not been sent to the School.**

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

### Join BioSoc
A hand-off to the Union's page rather than a signup of our own. Steps written
without sight of that page carry a dashed **confirm** tag, and the facts strip
ships empty rather than guessing at a membership price.

---

## 7. Rules that must not be quietly broken

Each of these cost real debugging. The reason matters more than the rule.

**The wheel's lightnesses are solved, not chosen.** A green at the same
lightness as a blue is far brighter, so slices picked by eye come out uneven and
the labels stop reading on some of them. At 92% saturation each hue's lightness
is set so every slice lands on the same luminance (0.418–0.421), which puts the
dark ink at 8:1 on all seven. **Change a hue and its lightness must be
re-solved numerically.** Current pairs:

| Section | Hue | Lightness | Result |
| --- | --- | --- | --- |
| Essential Links | 140 | 40.8% | `#08c848` |
| Study Resources | 166 | 40.0% | `#08c498` |
| Customise Your Degree | 192 | 47.5% | `#0abce9` |
| Opportunities | 218 | 74.6% | `#83aefa` |
| Connect | 254 | 80.5% | `#b5a0fb` |
| Events | 288 | 76.3% | `#e48bfa` |
| Join BioSoc | 330 | 75.8% | `#fa89c1` |

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

**`biosoc:page` is the contract for section-scoped work.** `app.js` fires it on
open with `{ id }` and on close with `{ id: null }`. Instagram, the Union frame
and the advice clock all wait for it, so nothing runs — and nothing is fetched
from a third party — before anyone has asked to see it. Keep new work on it.

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
- **The Union's pages are very likely unframeable too**, for the same reason.
  `embed: true` in `assets/data/union.js` is a try-it-and-look switch, **still
  in place** — the Instagram/Outlook decision above does not apply to it; the
  user asked for this one specifically and it has never been told to come out.
  It has never been tested, because the host is blocked here.
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
3. **Join BioSoc's two `check: true` steps** still need reading against the
   Union's page, and the facts strip still needs a membership price.
4. **`embed: true` stays set in `union.js`** — this is the Union embed, asked
   for explicitly (2026-09-20), and the 2026-09-21 decision to abandon
   Instagram/Outlook embedding (see item 5) **does not apply to it**. Still
   unverified here — leicesterunion.com is blocked at this container's egress
   proxy, so a failed load here proves nothing either way. Check on a normal
   network: a blank box under the action card means the Union refused the
   frame, and `embed` should go back to `false`.

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
- **The Union's hand-off is different from the two above and should not be
  read as the same kind of "gave up".** `embed: true` in `union.js` is live,
  asked for explicitly, and untouched by the 2026-09-21 decision — see §10
  item 4.
