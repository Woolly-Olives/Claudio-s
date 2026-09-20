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
check("labels use the slice ink",
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
const snap = () => page.evaluate(() => [...document.querySelectorAll("#module-map .box")]
  .map(b => { const r = b.getBoundingClientRect();
    return [r.x, r.y, r.width, r.height].map(Math.round).join(","); }));
const before = await snap();
const degrees = await page.locator("#module-map .dbtn").count();
check("eleven degrees", degrees, 11);
let moved = 0;
for (let i = 0; i < degrees; i++) {
  await page.locator("#module-map .dbtn").nth(i).click();
  await page.waitForTimeout(90);
  const now = await snap();
  if (now.length !== before.length || now.some((v, j) => v !== before[j])) { moved++; }
}
/* the boxes must sit still when you switch degree — it is the whole
   point of the fixed layout */
check("no box moves between degrees", moved, 0);

console.log("\nnothing broken in the console");
check("no errors or bad responses", noise, []);

await browser.close();
console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
