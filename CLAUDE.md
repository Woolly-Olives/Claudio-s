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
- **The wheel's palette is "Amber Field," and it is deliberately NOT
  equal-luminance.** Every earlier palette here solved each hue's lightness
  so all seven shared one luminance; this one doesn't (amber 0.45, plum
  0.05), because equalising it would wash the dark hues out to pale
  lavender — see `docs/HANDOVER.md` §7 and §10 item 10 before "fixing" this.
  Each slice picks its own `sat` too (`assets/js/app.js`), not one fixed
  value. Because luminance is uneven, one label colour can't read well on
  every slice any more: `ink` per section (`"dark"` or `"light"`) picks
  whichever clears WCAG AA (4.5:1) against that slice's own fill — change a
  hue, saturation or lightness and re-check `ink` for that slice, don't
  assume it still holds.
- **`inert` on a descendant does not survive the panel's `inert` being
  removed.** `app.js` re-asserts it on open. Without that the veiled
  Opportunities tiles are tabbable through their veil.
- **Colour is three-state now, not two**: system dark, system light, or
  forced by `[data-theme]` from the light/dark toggle (`assets/js/theme.js`,
  top right). A component that hardcodes a colour instead of `var(--token)`
  is only right in whichever state it was written in. See `docs/HANDOVER.md`
  §5 before touching the toggle or its CSS — the override structure and the
  icon-swap CSS deliberately mirror each other and must be edited together.
- **Module map boxes move now, on purpose** — core to the top, unavailable
  hidden by default, an optional module sliding up once picked. This reverses
  the project's own earlier "boxes never move" rule; see `docs/HANDOVER.md` §6
  Customise Your Degree before touching `column()`, `rerender()`, or
  `runIntro()` in `modulemap.js`. The FLIP animation in `rerender()` and the
  reduced-motion checks in both `playFlip()` and `runIntro()` are load-bearing
  — a naive "just call render()" loses the slide, and a naive intro rewrite
  can reintroduce the flash-then-hide bug documented there.
- **A degree click always clears every pick, including a still-valid one**
  (`clearPicks()`), and clicking the already-active degree resets to
  Biological Sciences rather than doing nothing. Don't reintroduce the old
  `prunePicks()` behaviour (keep whichever picks the new degree also
  allows) without being asked — see `docs/HANDOVER.md` §6.
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
instruction, and replaced by the BioSoc Newsletter section's current content
(renamed from "Join BioSoc" 2026-09-24 — same section, same `id`): an
embed of BioSoc's newsletter on Microsoft Sway** (`assets/js/sway.js`,
`assets/data/sway.js`, `assets/css/sway.css`). This means the site no longer
tells visitors how to actually join the Society — see `docs/HANDOVER.md` §6
BioSoc Newsletter before restoring a membership hand-off or removing the
newsletter embed.

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
