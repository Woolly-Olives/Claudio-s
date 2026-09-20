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
  every slice on the same luminance (0.418–0.421 at 92% saturation), which is
  what keeps the dark label ink at 8:1 on all seven. Change a hue and the
  lightness must be re-solved numerically, or a label quietly stops reading.
- **`inert` on a descendant does not survive the panel's `inert` being
  removed.** `app.js` re-asserts it on open. Without that the veiled
  Opportunities tiles are tabbable through their veil.
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
Outlook `.ics` directly — no CORS.

**Embedding Instagram or Outlook is off the table by explicit instruction
(2026-09-21), separate from the technical findings above.** Both were tried as
switches (`profileEmbed` in `instagram.js`, `mode: "outlook"` in
`calendar.js`) and then removed completely, not just turned off — see
`docs/HANDOVER.md` §10 items 4–5. Do not rebuild either without being asked
again. The Union's `embed: true` in `union.js` is unrelated and stays as it
is — that one was asked for specifically and this instruction does not touch
it. Also: nothing from the Gemini-built HTML file the user supplied
(2026-09-21) is to be implemented — not the profile-embed URL, not the staff
contact directory, not the £5 membership figure, not anything else in it —
unless separately and explicitly asked for.

This container's egress proxy blocks `instagram.com`, `leicesterunion.com` and
every `outlook.*` host, so anything touching them **cannot be tested here** and
should be shipped saying so. `WebSearch` works even when fetching does not;
treat what it returns as unverified.

## How the user works

They give short numbered instructions and expect all of them done. When
something cannot be done as written, say so plainly in a sentence or two and
build the nearest working thing anyway, behind a switch where possible — that
has been right every time. Send screenshots. Give real links and never invent
one. No flattery; be objective and critical where it is warranted.
