# BioSoc Student Hub — working notes

A static site for the BioSoc student society at the University of Leicester.
Plain HTML, CSS and JavaScript: **no build step, no dependencies, no
framework.** Destined for GitHub Pages.

**Read `docs/HANDOVER.md` before changing anything.** It holds the full record:
what was asked for, what was decided and why, what is known versus merely
believed, and what is still owed. This file is only the part needed to avoid
breaking something on the first move.

## Before you push

```sh
python3 -m http.server 8123 &
node tools/check.mjs
```

Everything in `tools/check.mjs` has broken at least once. Add a case whenever
something breaks that it would not have caught. Work on branch
`claude/biosoc-student-hub-2k2f32`; do not open a pull request unless asked.

## Traps, with their reasons

- **A container id must never match a section id.** The section ids double as
  URL hashes, so a `<div id="events">` makes the browser scroll to it whenever
  `#events` opens. Hence `#calendar`.
- **The wheel's lightnesses are solved, not chosen.** Each hue's lightness puts
  every slice on the same luminance (0.418–0.421 at 92% saturation) — change a
  hue and re-solve it numerically, or the slices stop being evenly bright. The
  label colour on top is white with a dark text-shadow (2.2:1 on its own,
  under WCAG AA — the shadow is a stand-in, not a fix), not the 8:1 dark ink
  this used to be; see `docs/HANDOVER.md` §7 before changing either.
- **`inert` on a descendant does not survive the panel's `inert` being
  removed.** `app.js` re-asserts it on open. Without that the veiled
  Opportunities tiles are tabbable through their veil.
- **Module map boxes move now, on purpose** — core to the top, unavailable
  hidden by default, an optional module sliding up once picked. This reverses
  the project's own earlier "boxes never move" rule; see `docs/HANDOVER.md` §6
  Customise Your Degree before touching `column()`, `rerender()`, or
  `runIntro()` in `modulemap.js`. The FLIP animation in `rerender()` and the
  reduced-motion checks in both `playFlip()` and `runIntro()` are load-bearing
  — a naive "just call render()" loses the slide, and a naive intro rewrite
  can reintroduce the flash-then-hide bug documented there.
- **`biosoc:page` is the contract**: `app.js` fires it on open with `{ id }` and
  on close with `{ id: null }`. Section-scoped work — anything that runs a
  timer or fetches from a third party — waits for it, so nothing happens before
  someone has asked to see that section.
- **Generated data files are never hand-edited**: `curriculum.js`, `events.js`,
  `advice.js`, `instagram-posts.js`. Change the source and re-run the generator
  in `tools/`.
- **The advice is quoted verbatim**, students' slips included. Do not tidy it.
- **The workflows in `tools/*.yml` are parked deliberately.** A workflow only
  runs from `.github/workflows/`; moving one there starts it committing to the
  repository, which is the user's decision, not ours.

## What cannot be done

Do not re-attempt these without new information — each was established the hard
way, and `docs/HANDOVER.md` §8 has the detail. Instagram has no profile embed.
Outlook's published calendar refuses to be framed (`X-Frame-Options`), and the
Students' Union's pages almost certainly do too. A browser cannot fetch the
Outlook `.ics` directly — no CORS. Whether Microsoft Sway allows itself to be
framed is unknown for the same reason as the other two — see below.

**Embedding Instagram or Outlook is off the table by explicit instruction
(2026-09-21), separate from the technical findings above.** Both were tried as
switches (`profileEmbed` in `instagram.js`, `mode: "outlook"` in
`calendar.js`) and then removed completely, not just turned off — see
`docs/HANDOVER.md` §10 items 4–5. Do not rebuild either without being asked
again. Also: nothing from the Gemini-built HTML file the user supplied
(2026-09-21) is to be implemented — not the profile-embed URL, not the staff
contact directory, not the £5 membership figure, not anything else in it —
unless separately and explicitly asked for.

**The Union hand-off (`union.js`) was removed on 2026-09-21, at explicit
instruction, and replaced by the Join BioSoc section's current content: an
embed of BioSoc's newsletter on Microsoft Sway** (`assets/js/sway.js`,
`assets/data/sway.js`, `assets/css/sway.css`). This means the site no longer
tells visitors how to actually join the Society — see `docs/HANDOVER.md` §6
Join BioSoc before restoring a membership hand-off or removing the newsletter
embed.

This container's egress proxy blocks `instagram.com`, `leicesterunion.com`,
`sway.cloud.microsoft` and every `outlook.*` host, so anything touching them
**cannot be tested here** and should be shipped saying so. `WebSearch` works
even when fetching does not; treat what it returns as unverified.

## How the user works

They give short numbered instructions and expect all of them done. When
something cannot be done as written, say so plainly in a sentence or two and
build the nearest working thing anyway, behind a switch where possible — that
has been right every time. Send screenshots. Give real links and never invent
one. No flattery; be objective and critical where it is warranted.
