# BioSoc Student Hub

A one-page hub for the BioSoc student society. The landing page is a circular
menu divided evenly into seven sections; choosing one reveals a full-screen page
with a circle that grows outward from that slice's own outer tip, so the bubble
always radiates at the slice's angle. Essential Links is the exception: it zooms
into its slice instead (see below).

The seven sections are **Essential Links**, **Study Resources**,
**Customise Your Degree**, **Opportunities**, **Connect** and **Events**, plus
**BioSoc Newsletter**. All seven now have content.

## For whoever works on this next

`CLAUDE.md` is the short operating brief and loads itself; **`docs/HANDOVER.md`
is the full record** — every instruction, decision, limit and open item, with
the reasons attached. Read that before changing anything, and run
`node tools/check.mjs` before pushing.

## Running it

It is a plain static site — no build step, no dependencies.

```sh
npx http-server -p 8080     # or: python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080>. Opening `index.html` straight off disk works
too, though a local server matches how it will behave when deployed.

To publish on GitHub Pages: **Settings → Pages → Source: Deploy from a branch**,
pick the branch and the `/ (root)` folder.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The wheel container and the seven section panels. **Your content goes here.** |
| `assets/css/styles.css` | All styling, including the reveal animation and the content helper classes below. |
| `assets/js/app.js` | Builds the wheel, handles the reveals, and routes `#section-id` URLs. |
| `assets/js/theme.js` | The light/dark toggle, top right. Styling is in `styles.css`. |
| `assets/data/links.js` | The Essential Links content. |
| `assets/js/arc.js`, `assets/css/arc.css` | The Essential Links arc and its zoom. |
| `assets/data/instagram.js` | The Instagram account and the posts pinned to Events. |
| `assets/js/instagram.js`, `assets/css/instagram.css` | The Events profile card and post grid. |
| `assets/data/calendar.js` | The Outlook calendar's links, edited by hand. |
| `assets/data/instagram-posts.js` | The most recent posts. **Generated** — see below. |
| `tools/fetch-instagram.py` | Fetches them from Instagram's API. |
| `assets/data/events.js` | The events themselves. **Generated** — see below. |
| `tools/ics-to-events.py` | Turns the published .ics into that file. |
| `assets/data/advice.js` | Students' advice on Connect. **Generated** — see below. |
| `tools/advice-to-js.py` | Turns the collected text file into it. |
| `assets/data/sway.js` | The Sway newsletter embed on BioSoc Newsletter. |
| `assets/js/sway.js`, `assets/css/sway.css` | How that page is built. |

## The light/dark toggle

A circular button, fixed top right of every page — the wheel and any open
section — built by `assets/js/theme.js`. Dark is the site's default and
always was; the toggle adds a way to override it, either direction,
regardless of what the visitor's system prefers. The choice is written to
`localStorage` and read back out **before the page paints**, in a small
inline `<script>` in `index.html`'s own `<head>` (the same one that clears
the `no-js` class) — reading it later, once `theme.js` itself runs at the
bottom of the page, would show the wrong theme first and then snap to the
right one.

Every colour lives as a token in `assets/css/styles.css`'s `:root` block, in
three layers: the bare values (dark, the default), a
`@media (prefers-color-scheme: light)` block guarded with
`:not([data-theme="dark"])`, and an unguarded `:root[data-theme="light"]`
block for an explicit override that beats the system either way. Forced dark
needs no block of its own — with nothing overriding the bare tokens, dark is
just what happens. **A component that hardcodes a colour instead of
`var(--token)` will be wrong in two of these three states.**

## The burger menu

A circular button, fixed top left, mirroring the theme toggle's own shape —
built by `assets/js/menu.js`, styled right after the toggle in
`assets/css/styles.css`. It opens a slide-in drawer, `min(75vw, 320px)` wide,
with four dummy options (`.menu-drawer__link`, plain `<button>`s — not
`<a>`s, so tapping one does nothing rather than writing a stray `#` into the
URL) until there is somewhere real for them to go. Escape, the backdrop or
its own close button all dismiss it and return focus to the toggle; `#stage`
gets `inert` while it's open, the same device the Opportunities veil and
every section page already use.

**Only shows on the wheel.** An open section page already has its own
"Menu" back button in that same top-left corner, so the burger hides itself
whenever `body` carries `.is-page-open` — two controls in one corner would
be one too many.

## The wheel's bottom row

Three social links — Instagram, the LinkedIn group, the Society's own
website — sit where a "Choose a section" hint used to. **The icons are
generic pictograms, not the platforms' own marks**, for the same reason
some of the Essential Links logos aren't real logos yet either (see that
section below): this environment can't reach any of the three domains to
check a redrawn logo against, and a wrong reconstruction is worse than an
honest generic one. Swap in real assets the same way Essential Links' were,
if they're supplied directly.

## Guides pages open without a bubble

The ten Guides pages under Study Resources (below) are one level deeper
than a wheel section, and no longer use the circular "bubble" reveal the
seven sections still use — a bubble growing out of the tile just tapped,
arriving right on top of the section's own bubble a moment earlier, read as
one too many. Each one carries `page--flat` alongside its usual `page`
class; that's a CSS-only variant (`clip-path: none` plus a plain opacity
fade, in `assets/css/styles.css`) — `assets/js/app.js` needed no changes,
since it only ever adds/removes an `is-open` class and lets CSS decide what
that means.

**Going back the other way doesn't bubble either.** Closing a Guides page
back into its section reopens that section (its own close, moments
earlier, was already instant, so it needs reopening) — and since that
reopen normally looks identical to a fresh click on the wheel, `app.js`
marks it with one more state, `is-returning`, applied in `openPage()` only
when the page just closing is a Guides page and the page opening is the
section it belongs to. `styles.css` gives `.page.is-returning` the exact
same fade `.page--flat` gets. A later *fresh* open of that same section
(from the wheel) clears the flag again on its own — `openPage()` always
sets it with `classList.toggle(...)`, never just adds it, so there's
nothing to separately clean up.

## Adding your content

Everything you add goes inside the `<div class="page__body">` of the relevant
`<section class="page">` in `index.html`. Each one is marked with a comment, e.g.

```html
<div class="page__body">
  <!-- CONTENT: Study Resources — add resources here -->
  <p class="page__empty">Content coming soon.</p>
</div>
```

Delete the `page__empty` paragraph once you have real content in.

Headings (`<h2>`, `<h3>`), paragraphs and links are styled already. There are
also four ready-made blocks, each of which picks up that section's colour:

**Card grid** — for a set of links with a line of description each.

```html
<ul class="resource-grid">
  <li>
    <a class="resource-card" href="https://example.ac.uk/thing">
      <strong>Name of the resource</strong>
      <span>One line saying what it is.</span>
    </a>
  </li>
</ul>
```

**Compact list** — for longer runs of links, with an optional label on the right.

```html
<ul class="resource-list">
  <li>
    <a href="https://example.ac.uk/thing">
      <span>Name of the resource</span>
      <small>Where it comes from</small>
    </a>
  </li>
</ul>
```

**Note** — a highlighted aside, e.g. a deadline or a caveat.

```html
<div class="note">
  <p>Applications usually close in early March — check the date yourself.</p>
</div>
```

**Sub-headings** — use `<h2>` to group a page into topics and `<h3>` beneath it.

**Numbered link tree** — used on Essential Links. `.link-hero` is the single
prominent link at the top; `.link-list` is an `<ol>` whose items get numbered
badges, and any item can carry a nested `.link-sublist`.

**Assessment table** — used on Study Resources. A normal `<table
class="assessment-table">`, with two requirements: wrap each `<td>`'s contents in
a `<div class="cell">`, and give every `<td>` a `data-label` matching its column
heading. Below 900px the table reflows into one card per row and those labels
become the field names, so a missing one leaves a blank label on mobile. Module
chips are `<span class="mod mod--bs1030">` (also `mod--bs1040`, `mod--adbs`), and
`<span class="deadline deadline--fixed">` marks a hard submission deadline with a
dotted underline.

The table currently on that page was transcribed from the 2024/25 schedule.
Re-check it against Blackboard each year — see the caution note at the top of the
page, and keep it there while any date is unverified.

### A note on the links themselves

Anything you add here is what students will act on, so link to the primary
source (the university, the students' union, the funder) rather than a summary
of it, and re-check dates and deadlines each year — a stale hub is worse than no
hub. Consider adding a "last checked" line to pages that carry deadlines.

## The Essential Links arc

That page shows the menu wheel's own Essential Links slice, made huge: the two
ends of its outer edge sit on the left and right edges of the screen, about two
thirds of the way down, and the curve arches between them. The angle (360/7) and
the curvature are the wheel's exactly, which is what makes the zoom possible.

**It opens by zooming, not by bubbling.** `app.js` hands `arc.js` the wheel's
measurements; `arc.js` works out the transform that lays the arc exactly over the
wheel's Essential Links slice, and the page animates from there to full size. The
curve is drawn from the first frame — it is the thing being zoomed — and the
dividers, labels, hub and sentence fade in from the centre outwards as the zoom
lands.

The band below the curve is cut into one section per link, separated by plain
radial lines that fade out towards the bottom. **The whole of a section is its
link**, not just the label, and pointing at one washes it in and puts a sentence
about where it leads above the curve's top edge.

Content lives in **`assets/data/links.js`**, not in `index.html`:

- `hub` is remote.le.ac.uk, drawn as a pill below the curve, which every other
  link fans out of. It takes no `note`: hovering it shows just its name. (It
  used to carry one — "Here are the most useful links for university in one
  place!" — that text is now `arc.js`'s own default line, below.)
- each entry in `links` has an `n` (the number shown, following the order the
  committee listed them in) and a `rank`. **`rank` is what places a link on the
  arc**: rank 1 goes in the middle, which is the most prominent spot, and the
  rest fan out alternately left and right. Change a `rank` to move a link.
- `more` holds nested links, drawn as small pills inside a section — Library,
  Students' Union and University SharePoint all carry one. Each `more` item
  needs `name` and `href`; `note` on a `more` item is optional (leave it out
  and the readout stays blank for that pill).
- **A top-level entry can leave `href` out entirely** — "Research resources"
  does, since it exists only to hold its four `more` links, not to go
  anywhere itself. Its wedge then gets no `href` attribute at all (not just
  a styled-inert one — a real link needs `href`, so without it there is
  nothing to navigate to or tab into) and no pointer cursor; only its `more`
  pills are clickable. Every other top-level entry, `more` or not, still
  keeps its own real destination.
- `note` is the sentence shown above the curve when you point at a section.
- `logo` (optional) is the path to an image — `"assets/img/logos/blackboard.jpg"`
  — shown in place of the numbered circle. Leave it out and the number shows,
  same as always; if the path 404s the number reappears automatically, so a
  typo never leaves a blank badge. Four of the nine have one — Blackboard,
  Outlook, Library, Students' Union — supplied as real image files by the
  user directly, not fetched or drawn here: every one of these services'
  domains is unreachable from the environment that built this, `le.ac.uk`
  included, so nothing could ever have been fetched and checked against the
  real thing, and nothing was hand-drawn from memory instead (a wrong
  reconstruction of a company's mark is worse than the plain number) — a
  supplied file sidesteps both problems. The other five still have none. Add
  real ones the same way, from a normal network or the committee's own
  files.

**The sentence above the curve when nothing is pointed at** ("Here are the most
useful links for university in one place!") is `HINT` in `arc.js`, not in the
data file — it is the arc's own default line, shown whenever nothing is
hovered/focused and restored the moment focus leaves a section.

**Every badge sits on the same radius, regardless of a `more` list.** A
section is drawn centred on a single shared radius (`Rlab`), but Library,
Research resources, Students' Union and University SharePoint are taller
boxes than a plain section (their `more` pills add rows below the badge),
so centring alone would put their badges further out than the others'.
`draw()` fixes this with a second pass: once every label has actually laid
out (font, text wrap and the `more` list all affect its height, so this
can't be worked out ahead of render), it measures where each badge really
ended up relative to its own label, then nudges every label so its badge
lands on the same radius Library's does.

**Below 821px wide or 621px tall, and with JavaScript off, the arc is hidden, the
plain list in `index.html` takes over, and the page opens with the same bubble as
every other section.** The arc and the list hold the same links, so they have to
be kept in step — if you add a link to the data file, add it to that list too.

## Bento tiles (Opportunities)

A grid of differently sized tiles, for a section that is a launchpad rather than
a document. Plain HTML in `index.html`: an `.bento` wrapper of `.bento__tile`
links, each with an eyebrow, a title, an optional note, and a
`.bento__tag` marking it a placeholder — delete that tag as each tile is filled
in.

**The tiles are currently behind a veil** that blurs them out and says *Coming
soon!*, because they are still placeholders. The grid carries `inert` in
`index.html`, which is what actually stops the links underneath being clicked or
tabbed into — CSS alone would leave them reachable by keyboard. When the tiles
are real, remove `.bento-veil` and that `inert` **together**.

One trap if you ever nest `inert` elsewhere: taking `inert` off the page panel,
which `app.js` does whenever a section opens, also clears it from anything
inside that declared its own. `app.js` re-asserts it for that reason. Without
that, the covered tiles are tabbable straight through the veil.

Size comes from `.bento__tile--wide` (two columns) and `.bento__tile--tall` (two
rows). **Keep the spans tiling the four-column grid exactly**, or the layout
leaves holes; the current eight tiles fill four rows with nothing left over. The
grid drops to two columns below 900px and one below 560px, where all spans are
ignored.

## Bento tiles, the other kind (Study Resources' Guides)

Ten more `.bento__tile` links, under a "Guides" heading at the top of Study
Resources — same grid, same `--wide`/`--tall` sizing, but **not** veiled
or `inert`: every tile is a real, working link, unlike Opportunities'.
What's a placeholder here is each tile's *destination* — a `<p
class="guide-soon">Coming soon!</p>` — not the tile itself. Replace that
paragraph with the real guide as each one gets written; nothing else
about its page needs to change.

Ten one-off tile-units don't divide evenly into a 4-wide grid (14 across
4 columns), so the last row is legitimately shorter than the rest —
that's not the "holes" warning above, which is about a gap opening up
*mid*-grid from careless ordering, not a shorter final row.

**Each tile opens its own full page, one level deeper than the wheel's
seven sections** — `#guide-lab-skills` and the other nine, each with a
`<section class="page" id="page-guide-…">` in `index.html`, styled and
animated exactly like the seven (same bubble-reveal, same `.page__head`/
`.page__body`), but never added to `app.js`'s `SECTIONS` — doing that
would make each one an eighth-through-seventeenth wheel slice instead of
a Study Resources sub-page. They're routed through a second id list,
`GUIDE_IDS` in `app.js`, and the reveal bubbles from whichever tile was
actually clicked rather than a slice's fixed position. Their back button
carries `data-back="study-resources"` (the seven's own back buttons
carry plain `data-back`, no value) so it — and Escape — return to Study
Resources, not the wheel; see the GUIDE_IDS comment in `app.js` before
adding, renaming or removing one.

## The calendar (Events)

Events come from a calendar published out of Outlook. The page leads with a
**Subscribe in Outlook** button, because that is the whole point: a student does
it once and every future event lands in their own calendar next to their
lectures, with the reminders and the clash warnings they already get for free.
Underneath is what is coming up, filterable by whose event it is, each with its
own **Add to calendar** download.

### The four-week view

Above the list is a plain four-week grid, starting from the Monday of the
current week, off the same events.

Up to four events share a day's height between them, so a single event fills its
day and four still fit; the more there are, the less room each has to say it in,
which is what the `[data-n]` rules in `assets/css/events.css` do. Past four, three
are shown and the last slot reads **+N more** rather than quietly dropping them.
Below 720px the cells are too small for any of that, so events become dots and
the list underneath does the work.

It is drawn here rather than shown from Outlook. Microsoft serves published
calendars with `X-Frame-Options: SAMEORIGIN`, which tells a browser to refuse
to draw the page inside another site; their own support answers say so
repeatedly and their advice is to link to the calendar instead. A working
frame was tried and then deliberately dropped (2026-09-21) — embedding either
Outlook or Instagram is off the table for now, by decision rather than
because a fix was found — so there is no switch left in the code to flip. See
`docs/HANDOVER.md` before reopening this.

### Updating it

`assets/data/events.js` is **generated**. Never hand-edit it:

```sh
python3 tools/ics-to-events.py calendar.ics
```

Save the published `.ics` again after changing anything in Outlook, re-run that,
and commit. `tools/refresh-events.yml` does the same thing on a schedule, but it
is **parked and not running** — a workflow only takes effect once it is moved
into `.github/workflows/`, which is a decision for whoever owns the repo. It
exists because the browser cannot fetch the calendar directly: Outlook does not
send the CORS headers a page would need, so the fetching has to happen somewhere
else.

Titles prefixed `[SU]` or `[School]` become the tags on the page, and anything
unprefixed counts as BioSoc's own. That convention is the committee's, read
straight out of the event titles — keep using it and the filters keep working.

### The timezone, which matters

**The calendar this was built from is set to the wrong timezone.** It is written
in "W. Europe Standard Time", which is Microsoft's name for Central European
Time — the file says so itself, declaring `+0100` standard and `+0200` daylight.
Leicester is `+0000` / `+0100`. An event typed as 18:00 is stored as 16:00 UTC
and reaches a student in Leicester as **17:00**.

The generator works around it for this website by re-reading each event's wall
clock in London, which restores the hour the committee meant. **That plaster
does not cover the subscribe feed**, which students get straight from Outlook.

So fix it at source: in Outlook, set the calendar's timezone to
*(UTC+00:00) Dublin, Edinburgh, Lisbon, London*, then check every existing event
still reads the hour you meant — changing the setting changes what the stored
times display as, so they may need moving. Then save the `.ics`, set
`REINTERPRET = None` at the top of `tools/ics-to-events.py`, and re-run it.

### Where the calendar lives

It is published from a **personal Microsoft account** (`outlook.live.com`, with
a consumer `cid-` address), so both links stop working the day that account
does, and every student who subscribed silently loses the feed. Moving it to an
account the society keeps is worth doing before many people subscribe. The
published address is also effectively public — anyone holding it can read the
calendar — so nothing private should ever go in it.

## Instagram (Events)

Instagram leads the Events page, because it is where things are announced first.
It carries **[@biosoc.leics](https://www.instagram.com/biosoc.leics/)** two
ways: a card that links straight to the account, and whichever posts the
committee pins, embedded.

**There is no way to embed a whole profile.** Instagram's only supported embed
is one post at a time — the blockquote and script you get from the **Embed**
item on a post. A live grid of the latest posts needs the Instagram Graph API
and an access token, which a static site on GitHub Pages has nowhere safe to
keep and which expires anyway. (See Meta's
[Instagram Platform documentation](https://developers.facebook.com/docs/instagram-platform/)
if you ever want to go that way: it would mean a token, somewhere to keep it,
and a scheduled job to refresh it — a GitHub Action committing a JSON file
would do it.) What is here needs none of that and cannot break on a token
expiry.

### Showing the most recent posts automatically

`assets/data/instagram-posts.js` is **generated** by `tools/fetch-instagram.py`,
which asks Instagram's API for the latest few posts. When it holds anything, the
page shows those and calls the block *Latest from Instagram*; when it is empty,
the page falls back to whatever is pinned by hand below and calls the block *On
Instagram*. It ships empty, so nothing depends on the setup below being done.

**It stores permalinks and dates only, never image addresses.** The `media_url`
the API returns is signed and expires within days, so caching it would leave a
grid of broken pictures by the end of the week. The pictures come from
Instagram's own embed at the moment someone looks, which also keeps them right
when a post is edited or deleted.

Getting it running is a real errand, and only you can do it:

1. the account must be a **Business or Creator** account, not personal;
2. a Meta app, with Instagram Business Login added;
3. run that login once for a short-lived token, then exchange it for a
   long-lived one (60 days);
4. put that in the repository's secrets as `IG_TOKEN`;
5. run `IG_TOKEN=... python3 tools/fetch-instagram.py` **by hand first** and read
   what comes back, then move `tools/refresh-instagram.yml` into
   `.github/workflows/` to have it run twice a day.

Meta's documentation is at
[developers.facebook.com/docs/instagram-platform](https://developers.facebook.com/docs/instagram-platform/)
— the pages that matter are *Instagram API with Instagram Login*, *Business
Login for Instagram* and *Access Token*.

**The script is untested.** It was written where `instagram.com` and
`graph.instagram.com` are both unreachable, so its requests follow Meta's
documentation rather than a run that worked. Run it by hand before trusting it
to a schedule.

**Watch the token.** A long-lived token lasts 60 days. The script renews it on
every run and prints the new one, but it cannot write it back into the
repository's secrets, so if the workflow is ever paused for two months the token
dies and the feed stops. It fails loudly rather than publishing an empty list,
so that shows up as a red cross rather than a page that quietly went stale.

### Pinning a post

Open the post on Instagram, copy its address, and add it to `posts` in
**`assets/data/instagram.js`**, newest first:

```js
{ permalink: "https://www.instagram.com/p/CyAbC1dEfGh/",
  title: "Freshers' social",
  date:  "2026-10-02",
  note:  "Tuesday 7pm, The Font. Everyone welcome." }
```

Only a post, reel or video address works (`/p/…`, `/reel/…`, `/tv/…`); a profile
address cannot be embedded, and the console says so if one is used by mistake.
Any query string on the end is stripped, so pasting the sharing link is fine.

`title`, `date` and `note` are shown until Instagram's script has drawn the post
— **and for good if it never does**, because Instagram is blocked, down, or the
visitor's browser refuses it. So write them as if they were the whole card,
because sometimes they are. Leave `posts` empty and the page simply points at
the account; nothing looks broken.

### Two settings, both in the same file

- `consent: true` puts a **Show the posts** button in front of the embeds, so
  nothing is fetched from Instagram — and no Instagram cookie is set — until the
  visitor asks. Worth considering: it is their cookies, not ours, and a society
  page has no particular need to hand Meta a record of everyone who reads it.
  `false` (the default) loads the posts when the section is opened.
- `captions: true` includes each post's own Instagram caption in its embed. Off
  by default, because caption lengths vary wildly and pull the grid about.

Either way **nothing is fetched from Instagram until someone opens Events** —
the landing page and the other six sections never touch it. `app.js` fires a
`biosoc:page` event when a section opens, and `assets/js/instagram.js` waits for
it.

A whole-profile frame — `instagram.com/<handle>/embed/`, an address Meta does
not document anywhere — was tried and deliberately dropped (2026-09-21).
Embedding either Instagram or Outlook is off the table for now; see
`docs/HANDOVER.md` before reopening it. The card-and-posts design above is the
part known to work and is unaffected.

## Advice from students (Connect)

One piece of advice at a time, in a random order, moving on by itself every 40
seconds. Back and forward step through it by hand.

### Adding to it

`assets/data/advice.js` is **generated**. Add to the collected text file and
re-run:

```sh
python3 tools/advice-to-js.py Advice_from_students_02.txt
```

One entry per paragraph: an initial, then the advice in double quotes —

```
E "Pay attention the most in this semester..."
```

The initial is shown on the page, right after the closing quotation mark:
**"— E, Year 3"**. `YEAR` at the top of `tools/advice-to-js.py` is what
supplies "Year 3" — it applies to every entry in the file, since the source
only carries an initial, not a year per line; change it there if a future
cohort's advice needs a different one. The generator says how many entries it
read and flags any block it could not parse.

**The wording is the students' own and is transcribed as given**, including the
odd slip. Correcting it here would put words in their mouths, and would be
undone the next time the generator runs. If something needs changing, change the
text file.

**The line above the card is fixed, exact text**, not something to
paraphrase: *"Real students in our course were asked to give advice to first
year students: 'Is there any advice you would want to pass onto current first
year students, or advice you would give yourself ago? How does Year 2 compare
to Year 1?'"* — reproduced character for character in `assets/js/advice.js`,
including the "give yourself ago" wording.

### The timing, and the thing to keep an eye on

`DWELL` at the top of `assets/js/advice.js` is the only number: 40 seconds. The
wait is a plain timer, started fresh whenever the advice changes for any reason,
and it only runs while Connect is open — `assets/js/app.js` says when, through
the `biosoc:page` event.

Nothing pauses it: not hovering, and there is no pause control. That is what was
asked for, and it is worth knowing what it costs. The longest piece is 113 words,
which is around 35 seconds of reading at an average pace, so a slower reader will
lose it mid-sentence with no way to stop the clock — and auto-updating text with
no means of pausing is the one thing WCAG asks you not to do (2.2.2). Forward
then back returns to a piece that got away. If it ever reads as too quick,
raising `DWELL` is a one-line change.

### The card's height

`assets/js/advice.js` measures every piece at the current column width and holds
the card at the tallest, so it does not resize under whoever is reading — and it
re-measures when the window changes. The `min-height` in the stylesheet is only
a floor for before that runs: how tall the longest piece runs depends on how
wide the card is, so it cannot be a fixed figure.

## The newsletter (BioSoc Newsletter)

This page used to hand off to the Students' Union's own signup page instead of
pretending to take a signup itself. That hand-off was removed on 2026-09-21,
at explicit instruction, and replaced with an embed of BioSoc's newsletter,
hosted on Microsoft Sway: one action card that always opens the newsletter
directly, and a best-effort frame of it below. **The page no longer tells a
visitor how to actually join the Society or what it costs** — that lived only
in the removed hand-off. Everything is in **`assets/data/sway.js`**.

### Framing the newsletter

Most services that host a page like this refuse to let another domain frame
it — the browser then shows an empty box, and says why only in its console,
where no student will look. Nothing on our side can detect that: a
cross-origin frame that the other site refuses is silent to script.

**Whether Sway allows it has never been tested on a real network** —
`sway.cloud.microsoft` is blocked at this container's egress proxy, so nothing
run inside it proves either way. Confirmed instead: the browser's own request
to it fails outright here (`net::ERR_TUNNEL_CONNECTION_FAILED`), which only
shows that this particular network blocks it, not that Sway itself would. The
action card above the frame always opens the newsletter directly regardless,
and a line beneath the frame tells anyone staring at an empty panel what to
do — most likely, an organisation's own network is what is stopping it, the
same as here.

The frame's address is not set until someone opens BioSoc Newsletter, so Sway is
not fetched for visitors who never go there — the same `biosoc:page` event the
Instagram embeds wait for.

## The module map (Customise Your Degree)

That page is an app rather than prose, so its content lives in one data file:
**`assets/data/curriculum.js`**. Nothing in `index.html` needs touching.

Every module in the School sits on one screen. Six columns run left to right,
Year 1 Semester 1 through Year 3 Semester 2; within a column the modules stack
top to bottom, and each box is as tall as it is heavy — a 30-credit module is
drawn exactly double a 15-credit one, the gap between boxes included. A "Year
N" heading spans each pair of semester columns; the column itself is headed
just "Semester N" underneath.

Three clicks do everything, and nothing needs more:

| One click on | Does |
| --- | --- |
| a degree button | recolours the whole board for that degree, and clears every pick |
| the already-selected degree button | resets to Biological Sciences, and clears every pick |
| a module box | takes or drops an optional module |
| a module's **i** | opens its details |

States are shown by fill *and* shape, not colour alone: **core** is solid,
**chosen** has a heavy border and a tick, **optional** is a dashed outline, and
**not available** is hatched and struck through. Each column counts its credits
against the 60-credit cap and refuses anything that would breach it, and shows
the running total as a fill bar under the column heading, not just as the
`used/60` figure.

### The degree buttons

`meta.degreeLayout` sets how they are arranged — one inner array per column,
listed top to bottom. It currently pairs each subject with its Medical
counterpart, with Biological Sciences alone in the first column, spanning both
rows. A degree missing from the layout is appended rather than dropped.

### Core to the top, unavailable out of sight

**Switching degree moves boxes now.** Each column is two lists: core and
chosen modules at the top, inside a rounded frame; everything else — optional,
clashing, and (only with the switch below turned on) not-offered-at-all —
underneath. Take an optional module and it slides up into the top group;
switch degree and the whole board can reshuffle, since what counts as core,
chosen or unavailable is worked out fresh each time. This is a deliberate
reversal of how the board first worked, where nothing ever moved between
degrees — see `docs/HANDOVER.md` if the history matters to you.

A module the current degree simply does not offer is hidden outright, not
just dimmed — the **"Show modules this degree does not offer"** switch above
the board brings them back, drawn exactly as they always were (hatched,
struck through).

Once a whole year — both semesters together — reaches 120 credits, a single
soft gold outline fades in around both of that year's columns, as one frame
rather than two. Year 1 is 120 credits of core on every degree, so an outline
on it would say nothing and it never gets one; Year 2 and Year 3 earn theirs
as you pick, so at most two outlines can ever be on screen at once.

**Every pick drops on any degree click** (`clearPicks()` in
`assets/js/modulemap.js`, added 2026-09-21) — including a pick that would
still be valid under the new degree. Picks are the previous degree's plan,
not necessarily the new one's, so nothing carries over silently. Clicking
the degree that is *already* selected is a second, distinct action: it
resets back to Biological Sciences (`DATA.degrees[0]`) rather than doing
nothing, on top of clearing picks the same as any other degree click.

### About the module

Every module's details panel ends with an **"About the module:"** line,
styled exactly like the "Required by:" line above it. Its content is
`overview` in `assets/data/curriculum.js` (**generated** — edit the six
entries near the top of `tools/build-curriculum.py` and re-run it, never
the output directly): a list where a plain string is one bullet and
`{text, items}` is a bullet with its own sub-bullets. A module with no
`overview` shows **N/A**. From the society, not the handbooks — unlike
`about`, the short caveat line above it, which is.

The move itself is animated as a slide, not a jump or a re-fade — a box
between board rebuilds; if it just appeared (newly available, or revealed by
the switch above) it rises into place instead, since there is nowhere for it
to slide from. Anyone with reduced motion set skips both.

### Module Convenors, Aims, Learning Outcomes, Method of Assessment

Below "About the module:", every Year 2 and Year 3 module's details panel
carries four more sections, styled the same way: **Module Convenors**,
**Aims**, **Learning Outcomes** and **Method of Assessment**, transcribed
**verbatim** from the School's own module description PDFs (not the
handbooks used for §Where the data comes from below) — nothing paraphrased,
nothing added beyond what those four headings cover in the source. Year 1
and the Research Project have no such PDF and show **N/A** for all four, the
same as any Year 2/3 module missing one specific section in its own source.

The data lives in the same fields as `overview` — `convenors`, `aims`,
`learningOutcomes`, `assessment` in `assets/data/curriculum.js`
(**generated** — edit `tools/build-curriculum.py` and re-run it, never the
output directly). `convenors` is a plain list of `"Name (email)"` strings.
The other three are each a list of blocks: `{type: "p", text}` for a
paragraph, `{type: "ul"|"ol", items}` for a bulleted or numbered list — a
list item can itself be `{text, items}` for one level of sub-bullets, the
same shape `overview` uses. A module missing one of the four shows **N/A**
for that section only.

A handful of modules needed a judgement call rather than a mechanical
copy-paste, where the source itself doesn't cleanly separate these four
headings from surrounding text — see `docs/HANDOVER.md` §6 and §10 item 11
for exactly which modules and what was decided before changing any of this.

### Opening the page

The first time you open this section — from the wheel or a direct link — it
plays in two passes, one year at a time rather than one column at a time.
First, each year's two semester columns float slowly down into place
together from well above, Year 1 first, one year after another, all still
covered by one veil spanning both columns — a giant right-pointing arrow
over a "Year N" label, on a translucent backdrop — so what you see arriving
is the veil, not the modules underneath: three panels obscuring the board,
not six. Every arrow lines up level with Year 1 Semester 1's, whatever that
column's own module count makes each veil's height. Only once every year
has floated into place does the second pass begin: the veils fade away,
again Year 1 first, uncovering each year's two columns together. It plays
once per opening, not on every click inside the page, and is skipped
entirely under reduced motion.

### Year-long modules

A module split across two semesters is two entries sharing a `linked` group id.
They are drawn as one connected shape: both lead their columns so they start at
the same height, and a bridge spans the gap between the columns. Taking or
dropping one takes or drops the whole group, and the details panel reports the
combined credits.

The Research Project is the example — 45 credits, 30 in Semester 1 and 15 in
Semester 2, drawn as a single step-shaped form.

### Where the data comes from

Years 2 and 3 are transcribed from the School's four 2026-27 handbooks (Year 2
and Year 3, Biological Sciences and Medical Sciences). For each degree the data
records three things per semester slot:

- `core` — compulsory modules,
- `options` — exactly what that degree's handbook table lists as choosable,
- `coreOneOf` — alternatives of which one is compulsory (BS2032 *or* BS2033).

Anything neither core nor listed as an option is **not available** to that
degree. `clashes` holds every pair the handbooks' clash grids mark as
untimetableable together, which produces two further states: a module that
clashes with something *compulsory* is permanently unavailable, and one that
clashes with a module **you** have taken shows as *clashes with a choice* and
clears if you drop that module.

Where the two sets of handbooks disagree, the Year 3 booklets were taken as
authoritative for Year 3 — the Year 2 booklets label their third-year tables
"provisional". The differences, and the errors found in the handbooks
themselves, are listed in `docs/handbook-issues.md`.

Year 1 codes, credits and titles came from the society. Year 1 is core for every
degree, so there is no stream to derive from the degree tables — each Year 1
module instead names its colour outright with a `stream` field. MB1080 has none
yet, and shows in the neutral grey.

### Colour

Colour means **subject stream**, and nothing else. The palette is sampled from
the School's own module key:

| Stream | | Degrees |
| --- | --- | --- |
| Physiology | `#ff99ff` | Physiology with Pharmacology, Medical Physiology |
| Neuroscience | `#9999ff` | Neuroscience |
| Biochemistry | `#66ffcc` | Biochemistry, Medical Biochemistry |
| Genetics | `#ff9966` | Genetics, Medical Genetics |
| Microbiology | `#ccff66` | Microbiology, Medical Microbiology |
| Zoology | `#33cc33` | Zoology |
| — | `#1b6b3a` | core for **every** degree (dark green) |
| — | `#bfbfbf` | core for none, or no colour agreed yet |

A degree and its Medical counterpart share a colour. Where a module is core for
more than one stream the first match in `meta.streams` wins, and that array is
held in the agreed precedence order: physiology, neuroscience, biochemistry,
genetics, microbiology, zoology.

**The on-page legend ("Degree Stream Colours", above the board) reads in a
different order** — biochemistry, microbiology, genetics, physiology,
neuroscience, zoology, then "Core for every degree" in the dark green —
set by `LEGEND_ORDER` in `modulemap.js`, entirely separate from
`meta.streams`'s own order. Reordering `meta.streams` itself to match
would silently change which colour wins for a module core under more
than one stream, so the legend's display order and the data's precedence
order are two different things on purpose; change `LEGEND_ORDER` for the
one, `meta.streams` for the other.

`meta.uncoloured` lists modules that take no stream colour despite being core —
BS2200, BS2000, both halves of the Research Project, plus BS2004 and BS2094.
Colouring them by stream would say nothing about specialisation. Those of them
that every degree must take are marked `schoolCore` by the generator and drawn
in the dark green instead; the rest stay neutral. MB1080 has no colour agreed
yet and so stays neutral too.

Every box states its standing in words in its lower-right corner — **Core**,
**Chosen**, **Clash** or **Not offered** — so there is no status legend to
cross-reference. A module's `i` panel always lists the modules it clashes with,
or says it has none.

Degree buttons carry a thin outline in their own stream colour and fill with it
when selected. Biological Sciences, which specialises in nothing, takes a
rainbow.

**Selecting a degree no longer recolours anything.** A module's outline is a
fixed property of the module, so you can see that BS2014 belongs to Physiology
while looking at Zoology. What the selected degree changes is the *fill*: solid
for core, tinted for chosen, empty for optional, hatched for unavailable.

### Grouped Year 3 choices

Seven of the eleven degrees carry a handbook rule of the form "choose three or
four from …", and five of those groups straddle both Year 3 semesters — which is
why the rule cannot live inside a column. It gets its own bar above the board,
showing the requirement, every member module with the semester it falls in, and
a live tally that reads amber below the minimum, green inside the range and red
above the maximum. Members are marked on the board with an amber edge; hovering
a chip in the bar lights up the matching box, and clicking one takes or drops it
like clicking the box itself.

Modules in a grouped choice are ringed in amber on the board. The rule itself is
drawn as lines from each member module converging on a
hub that states how many must be taken and how many are chosen. Lines to modules
already taken are solid, the rest dashed. The hub sits in the gap between the
Year 3 columns and overlaps them slightly; it is an overlay and takes no pointer
events, so it can never come between a click and a module.

**The rules are enforced, not just reported.** A module is refused if taking it
would push a group past its maximum, or leave too little room for the minimum —
so you cannot fill a semester with free options and strand a choice the degree
requires. What is *not* enforced is finishing: a plan may sit below the minimum
while you are still building it, and the hub says so.

Each group is `{label, min, max, members}` in the degree's `groups` array.

### Regenerating the data

`assets/data/curriculum.js` is generated, so the site cannot drift from the
transcription. Edit the rules at the top of the generator and re-run it rather
than hand-editing the output.

## Renaming, reordering or changing the number of sections

1. Edit the `SECTIONS` array at the top of `assets/js/app.js` — each entry has an
   `id` (used in the URL), a `label` (shown on the wheel), a `hue` (0–360), a
   `sat` (saturation, %) and a `light` (lightness, %). Essential Links also
   carries `reveal: "zoom"`, which is what makes it open by zooming; leave it
   off and a section gets the ordinary bubble.
2. Add, rename or remove the matching `<section class="page">` in `index.html`.
   Its `id` must be `page-` followed by the section `id`, and its `--hue` should
   match.

The wheel divides itself evenly however many sections there are, and each slice's
reveal origin is recalculated from its own angle, so nothing else needs changing.

**The current palette ("Amber Field") is not equal-luminance, and `sat` and
`light` are not free choices even so.** An earlier palette here solved every
slice's lightness at one fixed saturation so all seven landed on the same
relative luminance — a green at a blue's lightness is far brighter, so picking
by eye came out uneven. Amber Field replaced it: built from a real reference
(two screenshots the user supplied — see `docs/HANDOVER.md` §10 item 10), with
amber and magenta deliberately more saturated than the rest, and luminance
deliberately uneven (amber's fill is *far* brighter than plum's) because
equalising it would wash the dark hues out to pale lavender. Change a hue,
`sat` or `light` and there's no shared target to re-solve against any more —
what has to be re-checked instead is that slice's `ink`.

**`ink` (`"dark"` or `"light"`) is what makes an uneven-luminance wheel still
readable.** One label colour can't clear WCAG AA (4.5:1) on every slice when
the slices themselves aren't equally bright, so each section picks whichever
ink wins against its own fill — `"dark"` switches the label to `--slice-ink`
via a `.slice-label--dark` class and drops the shadow; `"light"` keeps the
original white-with-a-dark-shadow treatment (the shadow stands in for
contrast the white colour alone doesn't provide on its own). All seven clear
4.5:1 in whichever ink they got — `tools/check.mjs` checks this against the
rendered page, not just the arithmetic. Change any of `hue`/`sat`/`light` and
re-verify `ink` for that slice before trusting it.

The seam between slices is also lighter-touch than it was: the stroke sits
close to its own slice's lightness (-4% at rest, -9% on hover) rather than
cutting hard away from it, on request for something "less contrasting."

`GAP_DEG` is 0, so the slices meet and their strokes do the dividing. It is worth
leaving there: a gap held at a constant *angle* grows with the radius, so any
value above zero is invisible at the hub and a wedge at the rim. If a gap is ever
wanted back, it needs to be a constant arc length rather than a constant angle,
which means insetting each slice's edges by a fixed distance rather than by
degrees.

## Behaviour worth knowing

- Every section has its own URL (`…/#study-resources`), so pages can be linked to
  and shared directly. A deep link opens that page immediately, without the
  animation.
- Browser back, the **Menu** button and the <kbd>Esc</kbd> key all return to the
  wheel.
- The wheel is keyboard-navigable: <kbd>Tab</kbd> to a slice, arrow keys to move
  around the ring, <kbd>Enter</kbd> to open. Focus moves to the page heading on
  open and back to the slice on close.
- Light and dark colour schemes both follow the device setting.
- `prefers-reduced-motion` replaces the expanding bubble with a plain fade.
- Without JavaScript, the seven pages render as a plain stacked list of sections
  so the content is still reachable.
