# BioSoc Student Hub

A one-page hub for the BioSoc student society. The landing page is a circular
menu divided evenly into seven sections; choosing one reveals a full-screen page
with a circle that grows outward from that slice's own outer tip, so the bubble
always radiates at the slice's angle.

The seven sections are **Essential Links**, **Study Resources**,
**Customise Your Degree**, **Opportunities**, **Connect** and **Events**, plus
**Join BioSoc**. All seven pages are currently empty, ready for content.

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
| `assets/js/app.js` | Builds the wheel, handles the reveal, and routes `#section-id` URLs. |

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
| — | `#bfbfbf` | core for every degree, or core for none |

A degree and its Medical counterpart share a colour. Where a module is core for
more than one stream the first match in `meta.streams` wins, and that array is
held in the agreed precedence order: physiology, neuroscience, biochemistry,
genetics, microbiology, zoology.

`meta.uncoloured` lists modules that take no stream colour despite being core —
BS2200, BS2000, both halves of the Research Project, plus BS2004 and BS2094.
Year 1 is excluded wholesale. These are core for everyone, so colouring them
would say nothing about specialisation.

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

The rule is drawn on the board as lines from each member module converging on a
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
2. Add, rename or remove the matching `<section class="page">` in `index.html`.
   Its `id` must be `page-` followed by the section `id`, and its `--hue` should
   match.

The wheel divides itself evenly however many sections there are, and each slice's
reveal origin is recalculated from its own angle, so nothing else needs changing.

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
