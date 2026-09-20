/* =============================================================
   The regression run. Everything here has broken at least once.

       python3 -m http.server 8123 &
       node tools/check.mjs

   Exits non-zero on the first failure. It needs Playwright, which is
   installed globally in the container rather than in this repo — the
   path is below, and the site has no dependencies of its own.
   ============================================================= */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const SITE = process.env.SITE || "http://localhost:8123/index.html";
const SECTIONS = ["essential-links", "study-resources", "customise-your-degree",
                  "opportunities", "connect", "events", "join-biosoc"];

let failures = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { failures++; }
  console.log((ok ? "  ok   " : "  FAIL ") + name +
              (ok ? "" : "\n         got " + JSON.stringify(got) +
                         "\n         want " + JSON.stringify(want)));
}

const browser = await chromium.launch();
const noise = [];
const page = await browser.newPage({ viewport: { width: 1600, height: 950 }, colorScheme: "dark" });
page.on("console", m => { if (m.type() === "error") noise.push(m.text()); });
page.on("pageerror", e => noise.push("pageerror: " + e.message));
page.on("response", r => { if (r.status() >= 400) noise.push("HTTP " + r.status() + " " + r.url()); });

await page.goto(SITE);
await page.waitForTimeout(800);

console.log("the wheel");
check("seven slices", await page.locator("a.slice").count(), 7);
/* every slice must carry the same weight of light, or the dark labels
   stop reading on some of them — see the note in assets/js/app.js */
const lum = await page.evaluate(() => {
  const chan = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return [...document.querySelectorAll(".slice__path")].map(p => {
    const [r, g, b] = getComputedStyle(p).fill.match(/\d+/g).map(Number);
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  });
});
check("slices within 0.01 luminance of each other",
      Math.max(...lum) - Math.min(...lum) < 0.01, true);
check("every label is the same colour, whatever that colour currently is",
      await page.evaluate(() => [...new Set([...document.querySelectorAll(".slice-label")]
        .map(l => getComputedStyle(l).color))]).then(c => c.length), 1);

console.log("\nopening and closing every section");
for (const id of SECTIONS) {
  await page.evaluate(i => { location.hash = "#" + i; }, id);
  await page.waitForTimeout(650);
  const st = await page.evaluate(i => {
    const el = document.getElementById("page-" + i);
    return { open: el.classList.contains("is-open"),
             scrolled: el.querySelector(".page__scroll").scrollTop };
  }, id);
  /* a container id that matches a section id makes the browser scroll
     to it on open, hiding everything above — hence #calendar, not #events */
  check(id + " opens at the top", st, { open: true, scrolled: 0 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

console.log("\ncontent that has gone missing before");
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(700);
check("assessment rows", await page.locator(".assessment-table tbody tr").count(), 30);
check("essential links in the no-arc fallback", await page.locator(".links-fallback a").count(), 13);
check("arc sections", await page.locator("#links-arc .seg").count(), 9);
check("bento tiles", await page.locator(".bento__tile").count(), 8);
check("advice pieces", await page.evaluate(() => window.BIOSOC_ADVICE.items.length), 27);

console.log("\nthe Opportunities veil");
await page.evaluate(() => { location.hash = "#opportunities"; });
await page.waitForTimeout(700);
check("veil says Coming soon!",
      await page.evaluate(() => document.querySelector(".bento-veil__text").textContent), "Coming soon!");
/* app.js has to re-assert this: taking inert off the panel clears it
   from descendants that declared their own */
check("covered tiles are not focusable", await page.evaluate(() => {
  const t = document.querySelector(".bento__tile");
  document.activeElement.blur(); t.focus();
  return document.activeElement === t;
}), false);

console.log("\nthe module map");
await page.evaluate(() => { location.hash = "#customise-your-degree"; });
await page.waitForTimeout(1600);
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(2200);   // let the opening reveal finish before touching anything

const degrees = await page.locator("#module-map .dbtn").count();
check("eleven degrees", degrees, 11);

/*
 * Boxes MOVE between degrees now, on purpose (core to the top, unavailable
 * hidden) — see docs/HANDOVER.md on why this reverses the project's
 * earlier "boxes never move" rule. What must hold instead, on every one
 * of the eleven degrees:
 *   - nothing marked unavailable is on the board while "show all" is off
 *   - every box in the top tier is core or chosen, never plain optional
 *   - the board settles (no leftover inline transform once FLIP is done)
 */
let sawUnavailableHidden = 0, badTopTier = 0, stuckTransform = 0;
for (let i = 0; i < degrees; i++) {
  await page.locator("#module-map .dbtn").nth(i).click();
  await page.waitForTimeout(520);   // clear of the 420ms FLIP slide
  const state = await page.evaluate(() => ({
    unavailableShown: document.querySelectorAll("#module-map .box--unavailable").length,
    topTierBad: [...document.querySelectorAll("#module-map .col__top .box")]
      .filter(b => !b.classList.contains("box--core") && !b.classList.contains("box--selected")).length,
    stuck: [...document.querySelectorAll("#module-map .box")]
      .filter(b => b.style.transform && b.style.transform !== "none").length,
  }));
  if (state.unavailableShown === 0) { sawUnavailableHidden++; }
  badTopTier += state.topTierBad;
  stuckTransform += state.stuck;
}
check("unavailable modules stay hidden by default, on every degree", sawUnavailableHidden, degrees);
check("only core/chosen modules sit in the top tier, across all degrees", badTopTier, 0);
check("no box left mid-slide after settling, across all degrees", stuckTransform, 0);

/* a specialised degree, not whichever one the loop above happened to
   leave selected, so this does not depend on iteration order */
await page.locator("#module-map .dbtn", { hasText: "Zoology" }).click();
await page.waitForTimeout(520);

/* the show-all switch is the one way back to seeing them */
await page.locator(".mm__toggle").click();
await page.waitForTimeout(520);
check("show all reveals at least one unavailable module",
  (await page.locator("#module-map .box--unavailable").count()) > 0, true);
await page.locator(".mm__toggle").click();
await page.waitForTimeout(520);
check("switching it back off hides them again",
  await page.locator("#module-map .box--unavailable").count(), 0);

/* Year 1 is fully core on every degree — 120 credits with no picks
   needed — so its outline is on from the first render. Year 2 and
   Year 3 are not: nobody starts with 120 credits of picks already
   made, so their outline is something to earn. */
check("only Year 1 starts with the 120-credit outline on",
  await page.evaluate(() => [...document.querySelectorAll("#module-map .col__top--done")]
    .map(el => el.closest(".col").dataset.col).sort()),
  ["y1s1", "y1s2"]);

console.log("\nnothing broken in the console");
check("no errors or bad responses", noise, []);

await browser.close();
console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
