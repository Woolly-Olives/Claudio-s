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

## The module planner (Customise Your Degree)

That page is an app rather than prose, so its content lives in one data file:
**`assets/data/curriculum.js`**. Nothing in `index.html` needs touching.

It currently ships with **sample data** — placeholder modules and degrees with a
realistic shape, so the planner can be seen working. They are not the School's
real catalogue. To put real data in:

1. Replace the `modules` and `degrees` arrays (the schema is documented in
   comments at the top of the file).
2. Set `meta.sampleData` to `false`. The warning banner on the page disappears.

A module is `{ code, title, credits, year, semester, theme }`, where `year` is 2
or 3 and `semester` is 1 or 2. A degree lists its required modules per semester
slot (`y2s1`, `y2s2`, `y3s1`, `y3s2`); everything else in that slot is free to
choose from the School pool. Add an optional `restrictTo` array of codes to a
degree if it may only draw from part of the pool.

The planner derives everything else from that: credit meters, which modules are
locked, which would push a semester over 60 credits, the number of valid ways to
fill each semester, and the degree-comparison matrix. Adding a degree or a module
needs no code changes.

Plans are held in the URL's query string, so a student can send someone their
plan as a link. Codes that a shared link names but the chosen degree cannot take
are dropped, and the URL is rewritten to match.

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
