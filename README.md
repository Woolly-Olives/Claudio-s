# BioSoc Student Hub

A one-page hub for the BioSoc student society. The landing page is a circular
menu divided evenly into seven sections; choosing one reveals a full-screen page
with a circle that grows outward from that slice's own outer tip, so the bubble
always radiates at the slice's angle. Essential Links is the exception: it zooms
into its slice instead (see below).

The seven sections are **Essential Links**, **Study Resources**,
**Customise Your Degree**, **Opportunities**, **Connect** and **Events**, plus
**Join BioSoc**. All seven now have content.

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
| `assets/data/union.js` | The Students' Union hand-off on Join BioSoc. |
| `assets/js/union.js`, `assets/css/union.css` | How that page is built. |

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
  link fans out of.
- each entry in `links` has an `n` (the number shown, following the order the
  committee listed them in) and a `rank`. **`rank` is what places a link on the
  arc**: rank 1 goes in the middle, which is the most prominent spot, and the
  rest fan out alternately left and right. Change a `rank` to move a link.
- `more` holds nested links — the Students' Union's three — drawn as small pills
  inside its section.
- `note` is the sentence shown above the curve when you point at a section.

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

It is drawn here rather than shown from Outlook, and **not by choice**.
Microsoft serves published calendars with `X-Frame-Options: SAMEORIGIN`, which
tells a browser to refuse to draw the page inside another site; their own
support answers say so repeatedly and their advice is to link to the calendar
instead. It could not be tested here, so `mode` in `assets/data/calendar.js`
still offers `"outlook"`: switch to it, open Events, and look. A blank panel
means Microsoft refused. If it draws, keep it — their calendar beats a copy of
it, and the grid is then dead code you can delete.

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

### An unofficial whole-profile frame

`profileEmbed: true` adds a frame for the whole account —
`instagram.com/<handle>/embed/` — below the card and posts above. It ships
**off**, and it is a different kind of unverified to the Union or Outlook
switches: this address is not one Meta documents anywhere, so there is no
official basis to expect it works at all, only a URL that turned up in a
Gemini-built version of this site. That file also faked its Outlook calendar
with a public Google holidays calendar and shipped a "membership login" whose
valid codes sit in plain text in its own JavaScript — reason for real
scepticism about anything else in it that could not be checked.

Turn it on, open Events, and look. A blank panel, or a login wall sitting
inside the frame, means it does not work here — set it back to `false`. The
card and pinned posts above are unaffected either way and are the part known
to work.

## Advice from students (Connect)

One piece of advice at a time, in a random order, moving on by itself every 40
seconds. Back and forward step through it by hand.

### Adding to it

`assets/data/advice.js` is **generated**. Add to the collected text file and
re-run:

```sh
python3 tools/advice-to-js.py Advice_from_students.txt
```

One entry per paragraph, numbered, advice in double quotes. The number is only
so an entry can be found again in the source — the page never shows it, and the
order is random anyway. The generator says how many it read and flags any block
it could not parse.

**The wording is the students' own and is transcribed as given**, including the
odd slip. Correcting it here would put words in their mouths, and would be
undone the next time the generator runs. If something needs changing, change the
text file.

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

## The Students' Union (Join BioSoc)

Membership is the Union's, not ours, so that page hands over to
[BioSoc on leicesterunion.com](https://www.leicesterunion.com/sportsandsocs/societies/biosoc/)
rather than pretending to take a signup itself: one large action card, the steps
in order, an optional strip of facts, and a couple of related Union pages.
Everything is in **`assets/data/union.js`**.

### The "confirm" tags

Lines marked `check: true` carry a small dashed **confirm** tag on the page.
They were written without sight of the Union's page, so they are plausible
rather than known — the tag is there so nothing unverified is put to students as
fact. **Read each one against the Union's page, correct it, and delete its
`check` flag**; the tag then disappears. The `facts` strip ships empty for the
same reason: add the membership price and the rest only once you have checked
them, and until then the page simply does not draw that strip.

### Framing the Union's page

`embed: true` puts the Union's page in a frame below the action card. Most
Students' Union sites refuse to be framed by another domain — the browser then
shows an empty box, and says why only in its console, where no student will
look. Nothing on our side can detect that: a cross-origin frame that the other
site refuses is silent to script.

**It is currently on**, at the user's request. It has still never been tested
on a real network — leicesterunion.com is blocked at this container's egress
proxy, so nothing run inside it proves the switch works. Open Join BioSoc on
an ordinary connection and look: if the Union's page appears, leave it on. If
the box is blank, the Union blocks framing, and `embed` should go back to
`false` — the hand-off is the honest version of the same thing either way.
The action card above the frame always opens the real page, and a line
beneath it tells anyone staring at an empty panel what to do.

The frame's address is not set until someone opens Join BioSoc, so the Union is
not fetched for visitors who never go there — the same `biosoc:page` event the
Instagram embeds wait for.

## The module map (Customise Your Degree)

That page is an app rather than prose, so its content lives in one data file:
**`assets/data/curriculum.js`**. Nothing in `index.html` needs touching.

Every module in the School sits on one screen. Six columns run left to right,
Year 1 Semester 1 through Year 3 Semester 2; within a column the modules stack
top to bottom, and each box is as tall as it is heavy — a 30-credit module is
drawn exactly double a 15-credit one, the gap between boxes included.

Three clicks do everything, and nothing needs more:

| One click on | Does |
| --- | --- |
| a degree button | recolours the whole board for that degree |
| a module box | takes or drops an optional module |
| a module's **i** | opens its details |

States are shown by fill *and* shape, not colour alone: **core** is solid,
**chosen** has a heavy border and a tick, **optional** is a dashed outline, and
**not available** is hatched and struck through. Each column counts its credits
against the 60-credit cap and refuses anything that would breach it.

### The degree buttons

`meta.degreeLayout` sets how they are arranged — one inner array per column,
listed top to bottom. It currently pairs each subject with its Medical
counterpart, with Biological Sciences alone in the first column, spanning both
rows. A degree missing from the layout is appended rather than dropped.

Nothing above the board changes height between degrees, so the boxes stay
exactly where they are when you switch. Keep it that way: anything that appears
for one degree and not another belongs in a module's details panel, not here.

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
   `id` (used in the URL), a `label` (shown on the wheel) and a `hue` (0–360).
   Essential Links also carries `reveal: "zoom"`, which is what makes it open by
   zooming; leave it off and a section gets the ordinary bubble.
2. Add, rename or remove the matching `<section class="page">` in `index.html`.
   Its `id` must be `page-` followed by the section `id`, and its `--hue` should
   match.

The wheel divides itself evenly however many sections there are, and each slice's
reveal origin is recalculated from its own angle, so nothing else needs changing.

Each entry also carries a **`light`**, and it is not a free choice. A green at
the same lightness as a blue is far brighter, so slices picked by eye come out
uneven and the labels stop reading on some of them. These lightnesses were
solved for: at 92% saturation every slice lands within a hair of the same
luminance (0.418 to 0.421), bright enough to be cheerful, with the dark label
ink at 8:1 on all seven. **Change a hue and its lightness has to be re-solved,
not guessed**, or a label will quietly stop being readable. The ink is
`--slice-ink`; the labels are deliberately dark, because nothing white reads on
colours this light.

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
