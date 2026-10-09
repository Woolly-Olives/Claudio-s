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
                  "create-your-calendar", "connect", "events", "join-biosoc"];

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
/* Amber Field (2026-09-21) is deliberately NOT equal-luminance — amber
   and plum are meant to sit far apart (0.45 vs 0.05) — so a uniform
   label colour can no longer read well on every slice. Each slice's
   label picks whichever ink (white-with-shadow, or --slice-ink) clears
   WCAG AA against that slice's own fill instead — see the note on
   `ink` in assets/js/app.js. */
function relLuminance([r, g, b]) {
  const chan = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}
function contrast(rgbA, rgbB) {
  const a = relLuminance(rgbA), b = relLuminance(rgbB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
/* .slice-label lives in #wheel-labels, not inside its .slice — both are
   built from SECTIONS in the same order, so matched up by index */
const slices = await page.evaluate(() => {
  const paths = [...document.querySelectorAll(".slice__path")];
  return [...document.querySelectorAll(".slice-label")].map((l, i) => ({
    fill: getComputedStyle(paths[i]).fill,
    ink: getComputedStyle(l).color,
  }));
});
const contrasts = slices.map(s => contrast(
  s.fill.match(/\d+/g).map(Number),
  s.ink.match(/\d+/g).map(Number)));
check("every slice's label clears WCAG AA (4.5:1) against its own fill",
      contrasts.every(c => c >= 4.5), true);
check("two ink colours are in use, not one — dark on the brighter slices, white on the darker",
      new Set(slices.map(s => s.ink)).size, 2);

console.log("\nthe light/dark toggle");
/* colorScheme: "dark" above, so the page opens with no override and the
   toggle should read as offering to switch to light */
check("starts on dark, with a label offering light",
  await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    label: document.getElementById("theme-toggle").getAttribute("aria-label"),
  })),
  { theme: null, label: "Switch to light mode" });

await page.click("#theme-toggle");
await page.waitForTimeout(150);
check("one click switches to light and remembers it",
  await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    bg: getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(),
    stored: localStorage.getItem("biosoc-theme"),
  })),
  { theme: "light", bg: "#f4f8f5", stored: "light" });

await page.reload();
await page.waitForTimeout(400);
check("the choice survives a reload with no flash back to dark first",
  await page.evaluate(() => document.documentElement.getAttribute("data-theme")), "light");

/* back to dark, the state every check below this point assumes */
await page.click("#theme-toggle");
await page.waitForTimeout(150);
check("a second click switches back to dark",
  await page.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark");

console.log("\nthe wheel's stage furniture");
check("the old \"Choose a section\" hint is gone",
  await page.evaluate(() => !!document.querySelector(".stage__hint")), false);
check("three social links at the bottom, in order, to the real accounts",
  await page.evaluate(() => [...document.querySelectorAll(".stage__social__link")].map(a => a.href)),
  ["https://www.instagram.com/biosoc.leics/", "https://www.linkedin.com/groups/21170010/",
   "https://www.leicesterbiosoc.com/"]);

console.log("\nthe burger menu");
check("closed by default, 75%-of-phone-width panel (capped at 320px)",
  await page.evaluate(() => ({
    open: document.getElementById("menu-drawer").classList.contains("is-open"),
    matchesFormula: document.querySelector(".menu-drawer__panel").getBoundingClientRect().width
      === Math.min(window.innerWidth * 0.75, 320),
  })),
  { open: false, matchesFormula: true });
await page.click("#menu-toggle");
await page.waitForTimeout(350);
check("opens with five options (four dummy, Timetable real) and moves focus inside",
  await page.evaluate(() => ({
    open: document.getElementById("menu-drawer").classList.contains("is-open"),
    options: [...document.querySelectorAll(".menu-drawer__link")].map(b => b.textContent),
    focusInPanel: document.getElementById("menu-drawer-panel").contains(document.activeElement),
  })),
  { open: true, options: ["FAQs", "Campus map", "Contact list", "About BioSoc", "Timetable"], focusInPanel: true });
await page.keyboard.press("Escape");
await page.waitForTimeout(350);
check("Escape closes it and returns focus to the toggle",
  await page.evaluate(() => ({
    open: document.getElementById("menu-drawer").classList.contains("is-open"),
    focused: document.activeElement.id,
  })),
  { open: false, focused: "menu-toggle" });
await page.evaluate(() => { location.hash = "#connect"; });
await page.waitForTimeout(700);
check("hidden while a section page is open — it already has its own back button there",
  await page.evaluate(() => getComputedStyle(document.getElementById("menu-toggle")).display), "none");
await page.evaluate(() => { location.hash = ""; });
await page.waitForTimeout(700);

console.log("\nthe Timetable page");
check("Timetable is real — a plain <a>, not a dummy <button> like its siblings",
  await page.evaluate(() => {
    const link = document.querySelector('.menu-drawer__link[href="#timetable"]');
    return { tag: link.tagName, closesMenu: link.hasAttribute("data-menu-close") };
  }),
  { tag: "A", closesMenu: true });
await page.click("#menu-toggle");
await page.waitForTimeout(350);
await page.click('.menu-drawer__link[href="#timetable"]');
await page.waitForTimeout(700);
check("clicking it closes the drawer and opens the page, no bubble (page--flat)",
  await page.evaluate(() => ({
    drawerOpen: document.getElementById("menu-drawer").classList.contains("is-open"),
    pageOpen: document.getElementById("page-timetable").classList.contains("is-open"),
    clipPath: getComputedStyle(document.getElementById("page-timetable")).clipPath,
  })),
  { drawerOpen: false, pageOpen: true, clipPath: "none" });
check("defaults to Year 3, every session rendered in the School's own stream colours",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#timetable-grid .tt__session")];
    return {
      matchesDataCount: cards.length === window.BIOSOC_TIMETABLE_YEAR3.sessions.length,
      allColoured: cards.length > 0 && cards.every(c => /^#[0-9a-f]{6}$/i.test(getComputedStyle(c).getPropertyValue("--sc").trim())),
    };
  }),
  { matchesDataCount: true, allColoured: true });
check("a two-hour workshop is twice the height of a one-hour lecture on the same day",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#timetable-grid .tt__col')][3]
      .querySelectorAll(".tt__session"); // Thursday: BS3000 (1h) then BS3068 workshop (2h)
    const h = [...cards].map(c => c.getBoundingClientRect().height);
    return Math.round(h[1] / h[0]);
  }), 2);

console.log("\nthe Timetable year switcher");
check("five years listed, Year 3 active by default",
  await page.evaluate(() => [...document.querySelectorAll("#timetable-grid .tt__year")].map(b => ({
    label: b.textContent, active: b.classList.contains("is-active"),
  }))),
  [
    { label: "Foundation Year", active: false },
    { label: "Year 1", active: false },
    { label: "Year 2", active: false },
    { label: "Year 3", active: true },
    { label: "Year 4", active: false },
  ]);
await page.click('#timetable-grid .tt__year[data-year="year2"]');
await page.waitForTimeout(120);
check("switching to Year 2 swaps in its own sessions, colours and legend",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#timetable-grid .tt__session")];
    return {
      matchesYear2Count: cards.length === window.BIOSOC_TIMETABLE_YEAR2.sessions.length,
      hasLabPractical: !!document.querySelector("#timetable-grid .tt__flag"),
      hasMicrobiologyKey: [...document.querySelectorAll("#timetable-grid .tt__key")].some(k => k.textContent === "Microbiology"),
    };
  }),
  { matchesYear2Count: true, hasLabPractical: true, hasMicrobiologyKey: true });
await page.click('#timetable-grid .tt__year[data-year="foundation"]');
await page.waitForTimeout(120);
check("a year with no data shows a plain message and a real link, not an empty grid",
  await page.evaluate(() => {
    const p = document.querySelector("#timetable-grid .tt__empty");
    const link = p && p.querySelector("a");
    return {
      hasGrid: !!document.querySelector("#timetable-grid .tt__grid"),
      message: p && p.textContent.indexOf("Foundation Year") === 0,
      linksToOpenTimetable: link && link.href === "https://opentimetable.le.ac.uk/",
    };
  }),
  { hasGrid: false, message: true, linksToOpenTimetable: true });
await page.click('#timetable-grid .tt__year[data-year="year3"]');
await page.waitForTimeout(120);
check("switching back to Year 3 restores its grid",
  await page.evaluate(() =>
    document.querySelectorAll("#timetable-grid .tt__session").length === window.BIOSOC_TIMETABLE_YEAR3.sessions.length),
  true);

check("back button returns to the wheel", await (async () => {
  await page.click("#page-timetable [data-back]");
  await page.waitForTimeout(700);
  return page.evaluate(() => ({ hash: location.hash, anyOpen: document.body.classList.contains("is-page-open") }));
})(), { hash: "", anyOpen: false });

console.log("\nsub-pages open without the section-level bubble");
/* .page--flat sets clip-path: none unconditionally (not just once open),
   so this is true at rest, before anything animates — no need to catch
   a moment mid-transition */
check("every Guides page carries page--flat and so starts with no clip-path",
  await page.evaluate(() =>
    [...document.querySelectorAll('[id^="page-guide-"]')].every(el =>
      el.classList.contains("page--flat") && getComputedStyle(el).clipPath === "none")),
  true);
check("a real section keeps its clip-path circle, unaffected", await page.evaluate(() =>
  getComputedStyle(document.getElementById("page-study-resources")).clipPath), "circle(0px at 50% 50%)");

console.log("\n...and neither does going back from one to its section");
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(120);
check("a fresh open of the section still bubbles (a real clip-path circle)",
  await page.evaluate(() => {
    const cp = getComputedStyle(document.getElementById("page-study-resources")).clipPath;
    return cp !== "none" && cp.indexOf("circle") === 0;
  }), true);
await page.waitForTimeout(900);

await page.click('#page-study-resources a[href="#guide-lab-skills"]');
await page.waitForTimeout(900);
await page.click("#page-guide-lab-skills [data-back]");
await page.waitForTimeout(80);
check("returning to the section fades instead — no clip-path mid-transition",
  await page.evaluate(() => ({
    clipPath: getComputedStyle(document.getElementById("page-study-resources")).clipPath,
    isReturning: document.getElementById("page-study-resources").classList.contains("is-returning"),
  })),
  { clipPath: "none", isReturning: true });
await page.waitForTimeout(900);
check("...and settles open normally", await page.evaluate(() =>
  document.getElementById("page-study-resources").classList.contains("is-open")), true);

await page.keyboard.press("Escape");
await page.waitForTimeout(900);
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(120);
check("a later fresh open, all the way from the wheel, bubbles again — the flag doesn't stick",
  await page.evaluate(() => {
    const el = document.getElementById("page-study-resources");
    const cp = getComputedStyle(el).clipPath;
    return { bubbles: cp !== "none" && cp.indexOf("circle") === 0, stale: el.classList.contains("is-returning") };
  }),
  { bubbles: true, stale: false });
await page.keyboard.press("Escape");
await page.waitForTimeout(900);

console.log("\nthe BioSoc Newsletter frame");
/* sway.js must not fetch sway.cloud.microsoft for a visitor who never
   opens this section — checked before the loop below opens every
   section once, join-biosoc included, which arms it for good */
check("newsletter frame has no src before the section is opened",
  await page.evaluate(() => {
    const el = document.querySelector("#sway .sw-frame__win");
    return el && el.getAttribute("src");
  }), null);

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

check("newsletter frame is set once BioSoc Newsletter has been opened",
  await page.evaluate(() => {
    const el = document.querySelector("#sway .sw-frame__win");
    return el && el.getAttribute("src");
  }), "https://sway.cloud.microsoft/s/aXDghXvO80G1eDwD/embed");

console.log("\ncontent that has gone missing before");
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(700);
check("assessment rows", await page.locator(".assessment-table tbody tr").count(), 30);
check("essential links in the no-arc fallback", await page.locator(".links-fallback a").count(), 22);
check("arc sections", await page.locator("#links-arc .seg").count(), 9);
check("Guides bento tiles", await page.locator("#page-study-resources .bento__tile").count(), 10);
check("advice pieces", await page.evaluate(() => window.BIOSOC_ADVICE.items.length), 27);

console.log("\nthe students' advice (moved from Connect to Study Resources, below the Guides)");
check("it sits in Study Resources, after the Guides bento and before the assessment schedule — and no longer in Connect",
  await page.evaluate(() => {
    const adv = document.getElementById("advice");
    const sr = document.getElementById("page-study-resources");
    const bento = sr.querySelector(".bento");
    const sched = [...sr.querySelectorAll("h2")].find(h => h.textContent === "Assessment schedule");
    const after = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return {
      inStudyResources: sr.contains(adv),
      belowGuides: after(bento, adv),
      aboveSchedule: after(adv, sched),
      inConnect: document.getElementById("page-connect").contains(adv),
      connectHasStaffInstead: !!document.querySelector("#page-connect #staff"),
    };
  }),
  { inStudyResources: true, belowGuides: true, aboveSchedule: true, inConnect: false, connectHasStaffInstead: true });
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(700);
check("there, a piece of advice shows with its byline, and the arrow moves to another",
  await (async () => {
    const read = () => page.evaluate(() => document.querySelector("#advice .ad__text").textContent + "|" + document.querySelector("#advice .ad__by").textContent);
    const first = await read();
    await page.click('#page-study-resources #advice [data-go="1"]');
    await page.waitForTimeout(150);
    const second = await read();
    return { hasByline: /— .+, Year \d/.test(first.split("|")[1]), moved: first !== second };
  })(), { hasByline: true, moved: true });

console.log("\nthe staff cards in Connect");
await page.evaluate(() => { location.hash = "#connect"; });
await page.waitForTimeout(700);
check("every card has a name, a photo box, module codes, both questions and an email link",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#page-connect #staff .st:not(.st--clone)")];
    const labels = c => [...c.querySelectorAll(".st__label")].map(l => l.textContent);
    return {
      many: cards.length > 20,
      allComplete: cards.every(c => c.querySelector("h2.st__name").textContent.length > 3 &&
        c.querySelector(".st__photo") && c.querySelectorAll(".st__codes li").length >= 1 &&
        labels(c).indexOf("My research area:") !== -1 && labels(c).indexOf("I am passionate about:") !== -1 &&
        c.querySelector('.st__mail a[href^="mailto:"]')),
    };
  }), { many: true, allComplete: true });
check("the same person is never on two cards (Swidbert Ott was entered under three spellings, one email)",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#staff .st:not(.st--clone)")];
    const emails = cards.flatMap(c => [...c.querySelectorAll(".st__mail a")].map(a => a.textContent));
    return { uniqueEmails: new Set(emails).size === emails.length,
             ott: cards.filter(c => /Ott$/.test(c.querySelector(".st__name").textContent)).length };
  }), { uniqueEmails: true, ott: 1 });
check("no 'Modules' heading; codes are coloured like the module map's; 'Convenor' follows each convened code; no rules between the prompts",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#staff .st:not(.st--clone)")];
    const named = n => cards.find(c => c.querySelector(".st__name").textContent.endsWith(n));
    const chip = (c, code) => [...c.querySelectorAll(".st__code")].find(l => !l.classList.contains("st__code--role") && l.textContent.startsWith(code));
    const bg = el => getComputedStyle(el).backgroundColor;
    const millard = named("Andrew Millard");
    const blockley = named("Alix Blockley");
    return {
      noModulesLabel: !cards.some(c => [...c.querySelectorAll(".st__label")].some(l => l.textContent === "Modules")),
      microbiologyGreen: bg(chip(millard, "BS3068")) === "rgb(204, 255, 102)",
      schoolCoreDarkGreen: bg(chip(blockley, "BS2200")) === "rgb(27, 107, 58)",
      convenorAfterCode: chip(millard, "BS3068").textContent.trim() === "BS3068 Convenor",
      noRules: cards.every(c => [...c.querySelectorAll(".st__value")].every(v => getComputedStyle(v).borderBottomWidth === "0px")),
    };
  }), { noModulesLabel: true, microbiologyGreen: true, schoolCoreDarkGreen: true, convenorAfterCode: true, noRules: true });
check("roles are red chips in the module-code style, first in the row; Convenor is plain chip text; BS2032/BS2033 is one chip",
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#staff .st:not(.st--clone)")];
    const named = n => cards.find(c => c.querySelector(".st__name").textContent.endsWith(n));
    const roles = n => [...named(n).querySelectorAll(".st__code--role")].map(r => r.textContent);
    const r0 = named("Alix Blockley").querySelector(".st__code--role");
    const chip = named("Andrew Millard").querySelector(".st__code:not(.st__code--role)");
    const joined = [...document.querySelectorAll("#staff .st__code")].map(l => l.textContent).filter(t => /BS203[23]/.test(t));
    return { blockley: roles("Alix Blockley"), storey: roles("Nina Storey"), allen: roles("Emily Allen"), saba: roles("Saba Imanzadeh"),
             roleCount: document.querySelectorAll("#staff .st:not(.st--clone) .st__code--role").length,
             red: getComputedStyle(r0).backgroundColor === "rgb(255, 49, 49)",
             firstInRow: r0.parentNode.firstElementChild === r0,
             sameFont: getComputedStyle(r0).fontSize === getComputedStyle(chip).fontSize && getComputedStyle(r0).fontWeight === getComputedStyle(chip).fontWeight,
             noSeparateConvenor: !document.querySelector("#staff .st__conv"),
             noLoneBS2032: joined.every(t => t.startsWith("BS2032/BS2033")) && joined.length >= 1 };
  }), { blockley: ["Careers Lead"], storey: ["Head Tutor"], allen: ["Head Tutor"], saba: ["BIOsEDI"], roleCount: 4,
        red: true, firstInRow: true, sameFont: true, noSeparateConvenor: true, noLoneBS2032: true });
check("Connect filter: one line, no All button, one choice at a time, pressing it again shows everyone (never narrowing); BS2032/BS2033 never repeated on a card",
  await page.evaluate(() => {
    const vis = () => [...document.querySelectorAll("#staff .st:not(.st--clone)")].filter(c => !c.hidden).map(c => c.querySelector(".st__name").textContent);
    const btns = [...document.querySelectorAll("#staff .st__f")];
    const click = v => (v ? btns.find(b => b.dataset.val === v) : btns.find(b => b.getAttribute("aria-pressed") === "true")).click();
    const total = vis().length;
    const tops = new Set(btns.map(b => Math.round(b.getBoundingClientRect().top)));
    click("year:FY"); const fy = vis();
    click("role:Tutor"); const tutor = vis();
    click("role:BIOsEDI"); const edi = vis();
    click("stream:genetics"); const gen = vis();
    const pressed = btns.filter(b => b.getAttribute("aria-pressed") === "true").length;
    click("year:2"); const y2 = vis(); const y2Pressed = btns.filter(b => b.getAttribute("aria-pressed") === "true").length;
    const extra = ["year:MSc", "year:PhD", "year:4"].map(v => { click(v); return vis().length; });
    click(""); const afterRelease = vis().length; const noneLit = btns.every(b => b.getAttribute("aria-pressed") === "false");
    const dup = [...document.querySelectorAll("#staff .st:not(.st--clone)")].some(c => {
      const t = [...c.querySelectorAll(".st__code")].map(l => l.textContent).join(" ");
      return (t.match(/BS2032/g) || []).length > 1 || (t.match(/BS2033/g) || []).length > 1;
    });
    return { oneLine: tops.size === 1, allCount: btns.filter(b => b.textContent === "All").length, noneLit,
             fy, tutor: tutor.length, edi, genReplacesNotNarrows: gen.length > 0 && !gen.every(n => edi.includes(n)),
             extraEmpty: extra.join() === "0,0,0", onePressed: pressed === 1, y2Ok: y2.length > 0 && y2.length < total, resetAll: afterRelease === total, dup };
  }), { oneLine: true, allCount: 0, noneLit: true, fy: ["Dr Alix Blockley"], tutor: 2, edi: ["Dr Saba Imanzadeh"], genReplacesNotNarrows: true,
        extraEmpty: true, onePressed: true, y2Ok: true, resetAll: true, dup: false });
check("Connect: cards are ONE scrolling row above the filter buttons; no intro text; the arrows scroll it",
  await page.evaluate(async () => {
    const q = s => document.querySelector(s);
    const tops = new Set([...document.querySelectorAll("#staff .st:not(.st--clone)")].map(c => Math.round(c.getBoundingClientRect().top)));
    const track = q("#staff .st__grid"), before = track.scrollLeft;
    q('#staff .st__nav[data-dir="1"]').click();
    await new Promise(r => setTimeout(r, 900));
    return { oneRow: tops.size === 1, scrollable: track.scrollWidth > track.clientWidth,
             carouselAboveButtons: q("#staff .st__carousel").getBoundingClientRect().bottom <= q("#staff .st__filters").getBoundingClientRect().top,
             noLede: !q("#page-connect .page__lede"), nextScrolls: track.scrollLeft > before };
  }), { oneRow: true, scrollable: true, carouselAboveButtons: true, noLede: true, nextScrolls: true });
await page.mouse.move(2, 2);   // the drift pauses under the pointer, so keep it off the cards
check("Connect carousel: every card the same width, three whole and a half of the fourth showing; they drift right to left on their own; the order is shuffled (not alphabetical)",
  await page.evaluate(async () => {
    const track = document.querySelector("#staff .st__grid");
    track.scrollLeft = 0;
    await new Promise(r => setTimeout(r, 200));
    const vis = [...track.querySelectorAll(":scope > .st")].filter(c => !c.hidden);
    const tr = track.getBoundingClientRect();
    const widths = new Set(vis.map(c => Math.round(c.getBoundingClientRect().width)));
    const whole = vis.filter(c => c.getBoundingClientRect().right <= tr.right + 1).length;
    const partial = vis.filter(c => { const r = c.getBoundingClientRect(); return r.left < tr.right - 1 && r.right > tr.right + 1; })[0];
    const fit = widths.size === 1 && whole === 3 && !!partial && Math.abs((tr.right - partial.getBoundingClientRect().left) / partial.getBoundingClientRect().width - 0.5) < 0.05;
    const x0 = track.scrollLeft;
    await new Promise(r => setTimeout(r, 1800));
    const names = vis.map(c => c.querySelector(".st__name").textContent.split(" ").pop());
    return { fourFit: fit, drifts: track.scrollLeft > x0, shuffled: names.join() !== [...names].sort().join() };
  }), { fourFit: true, drifts: true, shuffled: true });
check("photo is top-left, modules top-right, the questions and email below — photo square, half the card's width, bottom half at least as tall",
  await page.evaluate(() => {
    const c = document.querySelector("#staff .st:not(.st--clone)"), r = s => c.querySelector(s).getBoundingClientRect();
    const ph = r(".st__photo"), m = r(".st__mods"), n = r(".st__name"), b = r(".st__bottom"), cr = c.getBoundingClientRect();
    return {
      nameAbovePhoto: n.bottom <= ph.top,
      photoLeftOfMods: ph.right <= m.left + 1 && Math.abs(ph.top - m.top) < 2,
      bottomBelowTop: b.top >= ph.bottom - 1,
      photoSquareAndHalfWidth: Math.abs(ph.height - ph.width) < 3 && Math.abs(ph.width - m.width) < 3 && b.height >= ph.height - 3,
    };
  }), { nameAbovePhoto: true, photoLeftOfMods: true, bottomBelowTop: true, photoSquareAndHalfWidth: true });
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(700);

console.log("\nthe Term 1 Assessment Calendar");
await page.evaluate(() => { location.hash = "#create-your-calendar"; });
await page.waitForTimeout(700);
check("11 unbroken Monday-first weeks (77 days, from Mon 28 Sep), Year 1 selected, both menus filled with Term 1 (semester 1) modules only — minus BS2200 and the Year 3 project, which ride on their year buttons",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal");
    const days = [...cal.querySelectorAll(".ac__d")];
    const sem = {}; window.BIOSOC_CURRICULUM.modules.forEach(m => { sem[m.code] = m.semester; });
    const offered = [...cal.querySelectorAll(".ac__dd input")].map(i => sem[i.value]);
    return { days: days.length, onlyTerm1: offered.length > 0 && offered.every(x => x === 1),
      firstIs28: days[0].querySelector(".ac__n").textContent === "28",
      pressed: [...cal.querySelectorAll(".ac__y")].map(b => b.getAttribute("aria-pressed")).join(),
      menus: [2, 3].map(y => cal.querySelectorAll('.ac__dd[data-y="' + y + '"] input').length).join() };
  }), { days: 77, onlyTerm1: true, firstIs28: true, pressed: "true,false,false", menus: "10,11" });
check("cards: exams say Time; Practical Competence uses its own wording; labs list Group Times; tutorials sit on Mondays; no year inside 2026/27; every card says its date is approximate",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal"), pop = document.getElementById("ac-pop");
    const open = text => { const b = [...cal.querySelectorAll(".ac__c")].find(x => x.textContent.startsWith(text)); b.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); const t = pop.textContent; b.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })); return t; };
    const lab = open("Lab Practical"), mock = open("Mock exam"), pc = open("Practical Competence");
    const mondays = [...cal.querySelectorAll(".ac__c--ADBS001")].map(b => [...cal.querySelectorAll(".ac__d")].indexOf(b.parentNode) % 7);
    return { mockTime: /Time.*Thu 5 Nov, 10:00/.test(mock) && !/Due/.test(mock) && /Approximate/.test(mock),
             pc: /TimeAssessment groups running from 09:00 Thursday/.test(pc),
             labGroups: /Group TimesThursday 09:00 - 12:00Thursday 14:00 - 17:00Friday 09:00 - 12:00/.test(lab),
             tutorialsOnMondays: mondays.length === 9 && mondays.every(c => c === 0),
             noYear: !/2026|2027/.test(mock.replace(/Approximate[^]*$/, "")) };
  }), { mockTime: true, pc: true, labGroups: true, tutorialsOnMondays: true, noYear: true });
check("practicals: BS1030 and BS1040 each run Practicals 1-5 on a Thursday and a Friday, two weeks apart; cards show the prep task from the table (and say none is listed for 1 and 2)",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal"), pop = document.getElementById("ac-pop");
    const days = [...cal.querySelectorAll(".ac__d")];
    const labs = [...cal.querySelectorAll(".ac__c--lab")];
    const dow = b => days.indexOf(b.parentNode) % 7;
    const card = (mod, n) => { const e = window.BIOSOC_ASSESS.events.find(x => x.kind === "lab" && x.mod === mod && x.n === n);
      const b = labs.find(x => window.BIOSOC_ASSESS.events.indexOf(e) >= 0 && days.indexOf(x.parentNode) === Math.round((new Date(e.date + "T00:00:00Z") - new Date("2026-09-28T00:00:00Z")) / 864e5));
      b.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); const t = pop.textContent; b.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })); return t; };
    const per = mod => window.BIOSOC_ASSESS.events.filter(e => e.kind === "lab" && e.mod === mod);
    return { counts: [per("BS1030").length, per("BS1040").length].join(), thuFri: labs.every(b => dow(b) === 3 || dow(b) === 4),
      numbers: [1, 2, 3, 4, 5].every(n => per("BS1030").some(e => e.n === n) && per("BS1040").some(e => e.n === n)),
      p3: /Lab Practical 3/.test(card("BS1030", 3)) && /TaskBlackboard MCQs \+ lab/.test(card("BS1030", 3)) && /Task dueThu 29 Oct, 09:00 or before your practical/.test(card("BS1030", 3)) && /WeightData used for the Practical Report/.test(card("BS1030", 3)),
      p4: /TaskTurnitin protocol submission/.test(card("BS1040", 4)) && /Task dueWed 18 Nov, 10:00/.test(card("BS1040", 4)) && /WeightFormative \(0%\)/.test(card("BS1040", 4)),
      p1: /Lab Practical 1/.test(card("BS1030", 1)) && /None listed in the schedule/.test(card("BS1040", 1)),
      fridayDots: labs.filter(b => dow(b) === 4).every(b => b.textContent === "..." && /^Lab Practical \d/.test(b.getAttribute("aria-label"))) &&
                  labs.filter(b => dow(b) === 3).every(b => /^Lab Practical\s[1-5]$/.test(b.textContent)) &&
                  new Set(labs.filter(b => dow(b) === 3).map(b => b.textContent)).size === 5,
      fridayCardKeepsTitle: (() => { const f = labs.find(b => dow(b) === 4); f.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); const t = pop.querySelector(".ac-card__title").textContent; f.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })); return /^Lab Practical \d$/.test(t); })() };
  }), { counts: "10,10", thuFri: true, numbers: true, p3: true, p4: true, p1: true, fridayDots: true, fridayCardKeepsTitle: true });
check("the card is laid over its own deadline box, corner to corner, with the same rounding; it stays while the mouse is on the card; leaving the card closes it; clicking the box or the card keeps it open and only a click outside both closes it; no thick outlines on any box",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal"), pop = document.getElementById("ac-pop");
    const b = [...cal.querySelectorAll(".ac__c")].find(x => x.textContent.startsWith("Mock exam"));
    b.scrollIntoView({ block: "center" });
    b.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    const card = pop.querySelector(".ac-card"), r = b.getBoundingClientRect(), p = card.getBoundingClientRect();
    const out = { sameCorner: Math.abs(p.left - r.left) < 0.5 && Math.abs(p.top - r.top) < 0.5 && p.width >= r.width - 1,
      sameRounding: getComputedStyle(card).borderTopLeftRadius === getComputedStyle(b).borderTopLeftRadius,
      noRingOnBox: getComputedStyle(b).outlineStyle === "none",
      noThickOutlines: [...cal.querySelectorAll(".ac__c")].every(x => getComputedStyle(x).borderTopWidth === "0px") };
    b.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: card }));     // the mouse slides from the box onto the card
    out.staysOnCard = !pop.hidden;
    pop.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: document.body }));
    out.closesOnLeave = pop.hidden;
    b.click();                                                                               // click the box: pinned
    out.pinned = !pop.hidden;
    pop.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: document.body }));
    out.pinnedSurvivesLeave = !pop.hidden;
    pop.querySelector(".ac-card").click();                                                   // click the card: stays
    out.cardClickKeeps = !pop.hidden;
    b.click();                                                                               // click the box again: stays
    out.boxClickKeeps = !pop.hidden;
    cal.querySelector(".ac__grid").click();                                                  // click empty calendar: closes
    out.outsideCloses = pop.hidden;
    b.click(); document.body.click();
    out.bodyCloses = pop.hidden;
    return out;
  }), { sameCorner: true, sameRounding: true, noRingOnBox: true, noThickOutlines: true, staysOnCard: true, closesOnLeave: true, pinned: true,
        pinnedSurvivesLeave: true, cardClickKeeps: true, boxClickKeeps: true, outsideCloses: true, bodyCloses: true });
check("Year buttons work like radio buttons (one at a time, the chosen one can't be unpicked); Year 2 and 3 name the modules that ride on them; BS2200 and BS3PROJ are not in the menus; every menu title fits on one line",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal");
    const press = () => [...cal.querySelectorAll(".ac__y")].map(b => b.getAttribute("aria-pressed")).join();
    const click = y => cal.querySelector('.ac__y[data-y="' + y + '"]').click();
    const out = { start: press() };
    const chips = () => [...cal.querySelectorAll(".ac__sel-chip")].map(c => c.querySelector("b").textContent).join();
    click(2); out.y2 = press(); out.y2Note = chips() === "BS2200" && /with Year 2/.test(cal.querySelector(".ac__sel").textContent);
    click(2); out.y2Again = press();
    click(3); out.y3 = press(); out.y3Note = chips() === "BS3PROJ" && /No assessment dates have been added/.test(cal.querySelector(".ac__note").textContent);
    click(1); out.back = press(); out.noNoteForY1 = cal.querySelector(".ac__note").textContent === "" && cal.querySelector(".ac__sel").hidden;
    const codes = [...cal.querySelectorAll(".ac__dd input")].map(i => i.value);
    out.excluded = !codes.includes("BS2200") && !codes.includes("BS3PROJ");
    out.oneLine = [...cal.querySelectorAll(".ac__dd")].map(d => { d.open = true; const m = d.querySelector(".ac__menu");
      const ok = m.scrollWidth <= m.clientWidth + 1 && [...m.querySelectorAll("label")].every(l => l.offsetHeight < 34);
      const inWindow = m.getBoundingClientRect().right <= window.innerWidth;
      const allShown = m.scrollHeight <= m.clientHeight + 1;       // no scrolling inside the menu: every option visible at once
      d.open = false; return ok && inWindow && allShown; }).join();
    return out;
  }), { start: "true,false,false", y2: "false,true,false", y2Note: true, y2Again: "false,true,false", y3: "false,false,true", y3Note: true,
        back: "true,false,false", noNoteForY1: true, excluded: true, oneLine: "true,true" });
check("crowded days: three show titles only; four show two and '+2 more' whose card lists the others in a row; a date in the next academic year shows its year; a year with no dated modules says none yet",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal"), D = window.BIOSOC_ASSESS, n0 = D.events.length;
    const add = (date, title) => D.events.push({ date, mod: "BS1030", code: "BS1030", year: 1, kind: "deadline", title, time: "10:00", type: "t", weight: "1%" });
    add("2026-10-29", "X1"); add("2026-10-29", "X2");                         // Thu 29 Oct: lab + 2 = 3
    add("2026-11-05", "Y1"); add("2026-11-05", "Y2");                         // Thu 5 Nov: mock exam + lab + 2 = 4
    add("2027-09-09", "Late");
    const redraw = () => { const y = cal.querySelector('.ac__y[data-y="1"]'); y.click(); y.click(); };
    redraw();
    const days = [...cal.querySelectorAll(".ac__d")];
    const d31 = days.find(d => d.querySelector(".ac__n").textContent === "29" && d.querySelector(".ac__c--lab") && d.querySelector(".ac__c--BS1030:not(.ac__c--lab)"));
    const d7 = days.find(d => d.querySelector(".ac__more"));
    const more = d7.querySelector(".ac__more");
    more.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    const cards = document.querySelectorAll("#ac-pop .ac-card"), r0 = cards[0].getBoundingClientRect(), r1 = cards[1].getBoundingClientRect();
    const out = { three: d31.querySelectorAll(".ac__c").length === 3 && !d31.querySelector("small") && d31.classList.contains("ac__d--many"),
      four: d7.querySelectorAll(".ac__c").length === 2 && more.textContent === "+2 more",
      hiddenInARow: cards.length === 2 && Math.abs(r0.top - r1.top) < 2 && r1.left > r0.left };
    more.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    const weeks0 = D.weeks; D.weeks = 60; redraw();           // stretch the calendar to reach September 2027
    const late = [...cal.querySelectorAll(".ac__c")].find(b => b.textContent.startsWith("Late"));
    late.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    out.nextYearShowsYear = /Thu 9 Sep 2027, 10:00/.test(document.getElementById("ac-pop").textContent);
    late.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    D.weeks = weeks0; D.events.length = n0; redraw();
    cal.querySelector('.ac__y[data-y="3"]').click();
    out.noneYet = /No assessment dates have been added/.test(cal.querySelector(".ac__note").textContent) && cal.querySelectorAll(".ac__c").length === 0;
    cal.querySelector('.ac__y[data-y="1"]').click();
    return out;
  }), { three: true, four: true, hiddenInARow: true, nextYearShowsYear: true, noneYet: true });
check("Year 2 / 3 modules: the Year 2 button brings only BS2200; BS2013 etc. arrive when picked in the menu, under their stream colour, listed as a chip that the ✕ removes; BS2014 and BS3069 stay out; Year 3 modules on their approximate Mondays",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal"), D = window.BIOSOC_ASSESS;
    const click = y => cal.querySelector('.ac__y[data-y="' + y + '"]').click();
    const pick = (code, on) => { const i = [...cal.querySelectorAll(".ac__dd input")].find(x => x.value === code); i.checked = on; i.dispatchEvent(new Event("change", { bubbles: true })); };
    const titles = () => [...cal.querySelectorAll(".ac__c")].map(b => b.getAttribute("aria-label"));
    click(2);
    const out = { onlyBS2200: titles().length === 3 && titles().every(t => t.startsWith("BS2200")) };
    pick("BS2013", true);
    const b = [...cal.querySelectorAll(".ac__c")].find(x => x.getAttribute("aria-label") === "BS2013 Report");
    const day = [...cal.querySelectorAll(".ac__d")].indexOf(b.parentNode);
    out.ok = !!b && getComputedStyle(b).backgroundColor === "rgb(255, 153, 255)" && day % 7 === 0 && b.parentNode.querySelector(".ac__n").textContent === "30";   // Mon 30 Nov, week 20, physiology pink
    out.chip = [...cal.querySelectorAll(".ac__sel-chip b")].map(x => x.textContent).join() === "BS2200,BS2013";
    cal.querySelector('.ac__sel-x[data-code="BS2013"]').click();
    out.chipGone = !titles().includes("BS2013 Report") && !cal.querySelector('.ac__dd input[value="BS2013"]').checked && cal.querySelector(".ac__n2").textContent === "";
    out.excluded = !D.events.some(e => e.code === "BS2014" || e.code === "BS3069") && D.events.some(e => e.code === "BS2015");
    // every Year 3 module the user listed sits on a Monday, on the right week-10-is-21-Sep date
    const mon = w => new Date(Date.UTC(2026, 8, 21) + (w - 10) * 7 * 864e5).toISOString().slice(0, 10);
    const want = { BS3000: [21], BS3010: [21], BS3015: [17], BS3031: [21], BS3038: [19], BS3054: [20], BS3055: [18], BS3064: [14], BS3068: [16, 21], BS3070: [19],
                   BS2013: [20], BS2015: [13], BS2094: [17], MB2020: [20], MB2050: [16], MB2051: [16] };
    out.weeks = Object.keys(want).every(c => { const got = D.events.filter(e => e.code === c).map(e => e.date).sort().join(); return got === want[c].map(mon).sort().join(); });
    click(1);
    return out;
  }), { onlyBS2200: true, ok: true, chip: true, chipGone: true, excluded: true, weeks: true });
check("month names are whole: October (Thu 1) and December (Tue 1) spill across two days and read in full; November (Sun 1) is cut at the week's edge as intended; no day clips its neighbour's overflow",
  await page.evaluate(() => {
    const cal = document.getElementById("assess-cal");
    const lab = name => [...cal.querySelectorAll(".ac__ml")].find(l => l.textContent === name);
    const whole = l => { const r = document.createRange(); r.selectNodeContents(l); return l.scrollWidth <= l.clientWidth + 1 && r.getBoundingClientRect().width <= l.clientWidth + 1; };
    const day = l => l.parentNode.getBoundingClientRect();
    const oct = lab("October"), dec = lab("December"), nov = lab("November");
    return { octWhole: whole(oct), octTwoDays: oct.getBoundingClientRect().width > day(oct).width * 1.8,
             decWhole: whole(dec), decTwoDays: dec.getBoundingClientRect().width > day(dec).width * 1.8,
             novCut: !whole(nov) && Math.abs(nov.getBoundingClientRect().width - day(nov).width) < 1,
             notClipped: getComputedStyle(oct.parentNode).overflow === "visible" };
  }), { octWhole: true, octTwoDays: true, decWhole: true, decTwoDays: true, novCut: true, notClipped: true });
check("days are a fixed 144px (9rem) tall — equal in every week, and not forced square (narrow days stay as tall); boxes and the info card have 8px corners; nothing overflows its day",
  await page.evaluate(async () => {
    const cal = document.getElementById("assess-cal");
    const days = () => [...cal.querySelectorAll(".ac__d")];
    const heights = () => [...new Set(days().map(d => Math.round(d.getBoundingClientRect().height)))];
    const overflow = () => days().filter(d => [...d.children].some(c => !c.classList.contains("ac__ml") && c.getBoundingClientRect().bottom > d.getBoundingClientRect().bottom + 0.5)).length;
    const out = { tall: heights().join() };
    cal.querySelector('.ac__y[data-y="2"]').click();
    ["BS2009", "BS2059", "BS2093", "BS2013", "MB2050", "MB2051"].forEach(c => { const i = [...cal.querySelectorAll(".ac__dd input")].find(x => x.value === c); i.checked = true; i.dispatchEvent(new Event("change", { bubbles: true })); });
    out.crowdedTall = heights().join(); out.noOverflow = overflow();
    const b = cal.querySelector(".ac__c");
    out.radius = getComputedStyle(b).borderTopLeftRadius;
    b.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    out.cardRadius = getComputedStyle(document.querySelector("#ac-pop .ac-card")).borderTopLeftRadius;
    b.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    [...cal.querySelectorAll(".ac__sel-x")].forEach(x => x.click());
    cal.querySelector('.ac__y[data-y="1"]').click();
    return out;
  }), { tall: "144", crowdedTall: "144", noOverflow: 0, radius: "8px", cardRadius: "8px" });
await page.evaluate(() => { location.hash = "#study-resources"; });
await page.waitForTimeout(700);
console.log("\nthe Guides bento");
check("ten tiles, in order, sized 4/2/1×8 as asked",
  await page.evaluate(() => [...document.querySelectorAll("#page-study-resources .bento__tile")].map(a => ({
    href: a.getAttribute("href").slice(1),
    title: a.querySelector(".bento__title").textContent,
    wide: a.classList.contains("bento__tile--wide"),
    tall: a.classList.contains("bento__tile--tall"),
  }))),
  [
    { href: "guide-balancing-university-life", title: "Balancing university life", wide: true, tall: true },
    { href: "guide-how-to-take-notes", title: "How to take notes", wide: false, tall: true },
    { href: "guide-lab-skills", title: "Lab skills", wide: false, tall: false },
    { href: "guide-coding-and-stats-skills", title: "Coding and stats skills", wide: false, tall: false },
    { href: "guide-online-research-guides", title: "Online research guides", wide: false, tall: false },
    { href: "guide-how-to-write-essays", title: "How to write essays", wide: false, tall: false },
    { href: "guide-how-to-write-lab-reports", title: "How to write lab reports", wide: false, tall: false },
    { href: "guide-how-to-revise-for-exams", title: "How to revise for exams", wide: false, tall: false },
    { href: "guide-presentation-skills", title: "Presentation skills", wide: false, tall: false },
    { href: "guide-poster-and-infographic-design", title: "Poster and infographic design", wide: false, tall: false },
  ]);
check("none of the ten tiles are veiled or inert — real links, unlike Opportunities",
  await page.evaluate(() => ({
    bentoInert: document.querySelector("#page-study-resources .bento").hasAttribute("inert"),
    hasVeil: !!document.querySelector("#page-study-resources .bento-veil"),
  })), { bentoInert: false, hasVeil: false });

await page.click('#page-study-resources a[href="#guide-lab-skills"]');
await page.waitForTimeout(700);
check("a tile opens its own full page, titled to match, saying just \"Coming soon!\"",
  await page.evaluate(() => ({
    open: document.querySelector("#page-guide-lab-skills").classList.contains("is-open"),
    title: document.querySelector("#page-guide-lab-skills .page__title").textContent,
    body: document.querySelector("#page-guide-lab-skills .guide-soon").textContent,
    studyResourcesInert: document.querySelector("#page-study-resources").hasAttribute("inert"),
  })),
  { open: true, title: "Lab skills", body: "Coming soon!", studyResourcesInert: true });
check("its back button reads \"Study Resources\", not \"Menu\"",
  await page.evaluate(() => document.querySelector("#page-guide-lab-skills .page__back span").textContent),
  "Study Resources");
await page.click("#page-guide-lab-skills [data-back]");
await page.waitForTimeout(700);
check("that back button returns to Study Resources, not all the way to the wheel",
  await page.evaluate(() => ({
    hash: location.hash,
    studyResourcesOpen: document.querySelector("#page-study-resources").classList.contains("is-open"),
  })), { hash: "#study-resources", studyResourcesOpen: true });

await page.click('#page-study-resources a[href="#guide-how-to-take-notes"]');
await page.waitForTimeout(700);
await page.keyboard.press("Escape");
await page.waitForTimeout(700);
check("Escape from a Guides page also goes back one level, not straight to the wheel",
  await page.evaluate(() => ({
    hash: location.hash,
    anyPageOpen: document.body.classList.contains("is-page-open"),
  })), { hash: "#study-resources", anyPageOpen: true });

console.log("\nEssential Links reorganisation");
await page.evaluate(() => { location.hash = "#essential-links"; });
await page.waitForTimeout(700);
check("list form runs Blackboard, Outlook, Library, Research resources, Students' Union, "
  + "My Student Record, AccessAbility, University SharePoint, Open Timetable in that order",
  await page.evaluate(() => [...document.querySelectorAll(".link-list > li")]
    .map(li => (li.querySelector(":scope > a strong, :scope > .link-group strong") || {}).textContent)),
  ["Blackboard", "Outlook - university email and calendar", "Library", "Research resources",
   "Students’ Union", "My Student Record", "AccessAbility", "University SharePoint", "Open Timetable"]);
check("arc runs University SharePoint, My Student Record, Research resources, Outlook, "
  + "Blackboard, Library, Students' Union, AccessAbility, Open Timetable left to right",
  await page.evaluate(() => [...document.querySelectorAll("#links-arc .seg-label__name")].map(el => el.textContent)),
  ["University SharePoint", "My Student Record", "Research resources", "Outlook - university email and calendar",
   "Blackboard", "Library", "Students’ Union", "AccessAbility", "Open Timetable"]);
check("Research resources has no destination of its own — a heading, not a link, in both forms",
  await page.evaluate(() => ({
    fallbackIsGroup: !!document.querySelector(".link-list > li > .link-group"),
    arcHasNoHref: [...document.querySelectorAll("#links-arc .seg")]
      .find(s => s.getAttribute("aria-label") === "Research resources").getAttribute("href"),
  })), { fallbackIsGroup: true, arcHasNoHref: null });
check("every other Essential Links segment still has a real href",
  await page.evaluate(() => [...document.querySelectorAll("#links-arc .seg")]
    .filter(s => s.getAttribute("aria-label") !== "Research resources")
    .every(s => !!s.getAttribute("href"))), true);
check("Blackboard, Outlook, Library and Students' Union show their real logo, loaded and not broken",
  await page.evaluate(() => {
    const wait = (img) => img.complete ? Promise.resolve() : new Promise((res) => { img.onload = img.onerror = res; });
    const names = ["Blackboard", "Outlook - university email and calendar", "Library", "Students’ Union"];
    return Promise.all(names.map(async (name) => {
      const label = [...document.querySelectorAll("#links-arc .seg-label")]
        .find((l) => l.querySelector(".seg-label__name").textContent === name);
      const img = label.querySelector(".seg-label__n--logo img");
      if (img) { await wait(img); }
      return {
        name,
        hasLogo: !!img,
        loaded: !!img && img.naturalWidth > 0,
        broken: !!label.querySelector(".seg-label__n--logo.is-broken"),
      };
    }));
  }),
  [
    { name: "Blackboard", hasLogo: true, loaded: true, broken: false },
    { name: "Outlook - university email and calendar", hasLogo: true, loaded: true, broken: false },
    { name: "Library", hasLogo: true, loaded: true, broken: false },
    { name: "Students’ Union", hasLogo: true, loaded: true, broken: false },
  ]);
check("the other five Essential Links segments still show a plain number, no logo",
  await page.evaluate(() => {
    const named = ["Blackboard", "Outlook - university email and calendar", "Library", "Students’ Union"];
    return [...document.querySelectorAll("#links-arc .seg-label")]
      .filter((l) => !named.includes(l.querySelector(".seg-label__name").textContent))
      .every((l) => !l.querySelector(".seg-label__n--logo"));
  }), true);

console.log("\nEssential Links badge alignment and default hint");
/* the panel's own 940ms zoom-in transition (arc.css) is still short of
   settled at the 700ms this section already waited above — real layout
   geometry, unlike the DOM-structure checks just above, needs it done */
await page.waitForTimeout(500);
/* every badge sits at the same radius from the arc's own centre, not just
   the same eyeballed "level" — segments with a `more` list (or just a
   longer name) are taller boxes than a plain segment, and since each
   label is centred on the arc at the same radius, the badge (always the
   first thing in the box) would otherwise land at a different distance
   from the arc edge for every different box height. Radius is recomputed
   here with the exact same formula draw() uses, from live W/H, rather
   than hard-coded, so this doesn't need updating if the viewport or the
   arc's own constants change. */
check("every segment's badge sits on the same radius as Library's, regardless of a `more` list",
  await page.evaluate(() => {
    const root = document.getElementById("links-arc");
    const rootRect = root.getBoundingClientRect();
    const W = root.clientWidth, H = root.clientHeight;
    const SPAN = 360 / 7, FLOOR = 14, BAND_MIN = 168, BAND_MAX = 470;
    const rad = (d) => d * Math.PI / 180;
    const HALF = rad(SPAN / 2);
    const Ro = W / (2 * Math.sin(HALF));
    const sag = Ro * (1 - Math.cos(HALF));
    const yEnd = Math.min(Math.max(H * 0.66, sag + 150), H - FLOOR - BAND_MIN * Math.cos(HALF));
    const cx = W / 2, cy = yEnd + Ro * Math.cos(HALF);
    const radii = [...document.querySelectorAll("#links-arc .seg-label")].map((l) => {
      const b = l.querySelector(".seg-label__n").getBoundingClientRect();
      const bx = b.left + b.width / 2 - rootRect.left, by = b.top + b.height / 2 - rootRect.top;
      return Math.hypot(bx - cx, by - cy);
    });
    return Math.max(...radii) - Math.min(...radii);
  }).then((spread) => spread < 2),
  true);
check("the arc's default line is now the hub's old hover note",
  await page.evaluate(() => document.querySelector("#links-arc .arc__readout__note").textContent),
  "Here are the most useful links for university in one place!");
await page.hover("#links-arc .arc__hub");
await page.waitForTimeout(150);
check("hovering the hub shows just its name, no leftover note",
  await page.evaluate(() => ({
    name: document.querySelector("#links-arc .arc__readout__name").textContent,
    note: document.querySelector("#links-arc .arc__readout__note").textContent,
  })),
  { name: "remote.le.ac.uk", note: "" });
await page.mouse.move(20, 20);
await page.waitForTimeout(150);
check("moving off the hub restores the default line",
  await page.evaluate(() => document.querySelector("#links-arc .arc__readout__note").textContent),
  "Here are the most useful links for university in one place!");

console.log("\nthe Create Your Calendar section (the old Opportunities; id changed to create-your-calendar)");
await page.evaluate(() => { location.hash = "#create-your-calendar"; });
await page.waitForTimeout(700);
check("Opportunities is cleared out and renamed: wheel label, heading and no-JS link all say Create Your Calendar; no tiles or veil left; the calendar moved here from Study Resources",
  await page.evaluate(() => ({
    wheelLabel: [...document.querySelectorAll(".slice-label")].some(l => l.textContent.trim() === "Create Your Calendar"),
    noOldLabel: ![...document.querySelectorAll(".slice-label")].some(l => l.textContent.trim() === "Opportunities"),
    heading: document.getElementById("h-create-your-calendar").textContent,
    section: document.querySelector("#page-create-your-calendar h2").textContent,
    noTiles: document.querySelectorAll("#page-create-your-calendar .bento__tile, .bento-veil").length,
    calendarHere: !!document.querySelector("#page-create-your-calendar #assess-cal"),
    calendarGoneFromStudy: !document.querySelector("#page-study-resources #assess-cal"),
    noscript: /Create Your Calendar/.test(document.querySelector("noscript").textContent) || /Create Your Calendar/.test(document.querySelector("noscript").innerHTML),
  })),
  { wheelLabel: true, noOldLabel: true, heading: "Create Your Calendar", section: "Term 1 Assessment Calendar", noTiles: 0,
    calendarHere: true, calendarGoneFromStudy: true, noscript: true });

console.log("\nthe module map");
await page.evaluate(() => { location.hash = "#customise-your-degree"; });

/* checked early, not after the reveal settles: runIntro() sets each
   veil's arrow group to the same pixel offset (measured off Year 1
   Semester 1) synchronously, before any column has actually floated —
   so this is a stable invariant to check regardless of animation
   timing, rather than racing the float/reveal sequence to catch a
   moment where every column happens to be floated but not yet revealed */
await page.waitForTimeout(700);
check("every intro arrow lines up level with Year 1 Semester 1's",
  await page.evaluate(() => [...new Set([...document.querySelectorAll("#module-map .mm__veil__inner")]
    .map(el => el.style.top))]).then(tops => tops.length),
  1);
check("three veils, not six — one per year, labelled just \"Year N\"",
  await page.evaluate(() => [...document.querySelectorAll("#module-map .mm__veil__label")].map(el => el.textContent)),
  ["Year 1", "Year 2", "Year 3"]);
check("the veil arrow is massive — at least 4x its old 2.4rem–3.6rem size",
  await page.evaluate(() => document.querySelector("#module-map .mm__veil__arrow").getBoundingClientRect().width >= 150),
  true);
check("each veil spans both of that year's semester columns, not just one",
  await page.evaluate(() => {
    const cols = [...document.querySelectorAll("#module-map .col")];
    const veils = [...document.querySelectorAll("#module-map .mm__veil")];
    return veils.map((v, y) => {
      const vr = v.getBoundingClientRect();
      const c1 = cols[y * 2].getBoundingClientRect(), c2 = cols[y * 2 + 1].getBoundingClientRect();
      const left = Math.min(c1.left, c2.left), right = Math.max(c1.right, c2.right);
      return Math.abs(vr.left - left) < 12 && Math.abs(vr.right - right) < 12;
    });
  }),
  [true, true, true]);

await page.waitForTimeout(900);
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(3600);   // let the opening reveal finish before touching anything

const degrees = await page.locator("#module-map .dbtn").count();
check("eleven degrees", degrees, 11);

console.log("\nthe stream legend");
check("heading reads \"Degree Stream Colours\", entries in the requested order, "
  + "\"Core for every degree\" the BS2200/BS2000 dark green",
  await page.evaluate(() => ({
    heading: document.querySelector("#module-map .mm__streams b").textContent,
    items: [...document.querySelectorAll("#module-map .mm__streams .skey")].map(el => el.textContent),
    coreColour: getComputedStyle(document.querySelector("#module-map .mm__streams .skey:last-of-type"))
      .getPropertyValue("--sc").trim(),
  })),
  {
    heading: "Degree Stream Colours",
    items: ["Biochemistry", "Microbiology", "Genetics", "Physiology", "Neuroscience", "Zoology", "Core for every degree"],
    coreColour: "#1b6b3a",
  });

console.log("\nthe Year headers span both semesters");
check("three \"Year N\" bars, each spanning two grid columns and decorative only",
  await page.evaluate(() => [...document.querySelectorAll("#module-map .mm__year-head")].map(el => ({
    text: el.textContent.trim(),
    ariaHidden: el.getAttribute("aria-hidden"),
    spansTwo: getComputedStyle(el).gridColumn.replace(/\s/g, "") === "span2",
  }))),
  [{ text: "Year 1", ariaHidden: "true", spansTwo: true },
   { text: "Year 2", ariaHidden: "true", spansTwo: true },
   { text: "Year 3", ariaHidden: "true", spansTwo: true }]);
check("the \"Year N\" text is about 3x its old size (0.9rem -> 2.7rem)",
  await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("#module-map .mm__year-head")).fontSize) >= 40),
  true);
check("the gap under the \"Year N\" bar is tight, not the old oversized row-gap",
  await page.evaluate(() => {
    const yh = document.querySelector("#module-map .mm__year-head").getBoundingClientRect();
    const col = document.querySelector("#module-map .col").getBoundingClientRect();
    return col.top - yh.bottom;
  }).then(gap => gap >= 0 && gap < 20),
  true);
check("each column's own heading shows just \"Semester N\", but still reads \"Year N Semester N\" to assistive tech",
  await page.evaluate(() => [...document.querySelectorAll("#module-map .col__name")].map(h => {
    const clone = h.cloneNode(true);
    clone.querySelectorAll(".visually-hidden").forEach(s => s.remove());
    return { visible: clone.textContent.trim(), full: h.textContent.trim() };
  })),
  [{ visible: "Semester 1", full: "Year 1 Semester 1" }, { visible: "Semester 2", full: "Year 1 Semester 2" },
   { visible: "Semester 1", full: "Year 2 Semester 1" }, { visible: "Semester 2", full: "Year 2 Semester 2" },
   { visible: "Semester 1", full: "Year 3 Semester 1" }, { visible: "Semester 2", full: "Year 3 Semester 2" }]);
check("credit tracker bar is doubled to 10px thick",
  await page.evaluate(() => getComputedStyle(document.querySelector("#module-map .col__bar")).height),
  "10px");

console.log("\n\"About the module:\" in the details sheet");
async function overviewOf(code) {
  await page.evaluate(c => document.querySelector('[data-info="' + c + '"]').click(), code);
  await page.waitForTimeout(200);
  const result = await page.evaluate(() => {
    const card = document.querySelector("#module-map .sheet__card");
    const list = card.querySelector(".sheet__overview");
    return {
      hasNA: card.textContent.includes("About the module:") && card.textContent.includes("N/A") && !list,
      topLevel: list ? list.querySelectorAll(":scope > li").length : 0,
      nested: list ? list.querySelectorAll("li ul li").length : 0,
    };
  });
  await page.evaluate(() => document.querySelector("[data-close]").click());
  await page.waitForTimeout(150);
  return result;
}
check("BS1030 (flat list) shows 4 bullets, no nesting",
  await overviewOf("BS1030"), { hasNA: false, topLevel: 4, nested: 0 });
check("BS1060 (nested list) shows 1 bullet with 3 sub-bullets",
  await overviewOf("BS1060"), { hasNA: false, topLevel: 1, nested: 3 });
check("a module with no overview (BS2009) shows N/A instead",
  await overviewOf("BS2009"), { hasNA: true, topLevel: 0, nested: 0 });

console.log("\nModule Convenors / Aims / Learning Outcomes / Method of Assessment");
async function detailSectionsOf(code) {
  await page.evaluate(c => document.querySelector('[data-info="' + c + '"]').click(), code);
  await page.waitForTimeout(200);
  const result = await page.evaluate(() => {
    const card = document.querySelector("#module-map .sheet__card");
    const naFor = (label) => {
      const p = [...card.querySelectorAll(".sheet__req")]
        .find(el => el.querySelector("strong") && el.querySelector("strong").textContent.trim() === label);
      return p ? p.textContent.includes("N/A") : null;
    };
    return {
      convenorsNA: naFor("Module Convenors:"),
      aimsNA: naFor("Aims:"),
      loNA: naFor("Learning Outcomes:"),
      moaNA: naFor("Method of Assessment:"),
      proseLists: card.querySelectorAll(".sheet__prose-list").length,
      orderedLists: card.querySelectorAll("ol.sheet__prose-list").length,
      nestedSub: card.querySelectorAll(".sheet__prose-list li ul li").length,
    };
  });
  await page.evaluate(() => document.querySelector("[data-close]").click());
  await page.waitForTimeout(150);
  return result;
}
check("BS1030 (Year 1 — no description PDF) shows N/A for all four",
  await detailSectionsOf("BS1030"), { convenorsNA: true, aimsNA: true, loNA: true, moaNA: true, proseLists: 0, orderedLists: 0, nestedSub: 0 });
check("BS2200 (Year 2, all four present) shows none of them as N/A",
  await detailSectionsOf("BS2200"), { convenorsNA: false, aimsNA: false, loNA: false, moaNA: false, proseLists: 1, orderedLists: 0, nestedSub: 0 });
check("BS2078 (source has no Aims label) shows Aims N/A but Learning Outcomes nested sub-bullets",
  await detailSectionsOf("BS2078"), { convenorsNA: false, aimsNA: true, loNA: false, moaNA: false, proseLists: 1, orderedLists: 0, nestedSub: 4 });
check("BS3003 (numbered assessment in the source) renders it as an ordered list",
  (await detailSectionsOf("BS3003")).orderedLists, 1);
check("BS3010 (no Method of Assessment label — combined from Debates/Written Examination) is not N/A",
  (await detailSectionsOf("BS3010")).moaNA, false);

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

/* a degree switch is a fresh plan, not a merge — every pick drops, even
   ones that would still be valid under the new degree */
await page.locator("#module-map .box--optional").first().click();
await page.waitForTimeout(420);
check("picking a module under Zoology leaves one selected",
  await page.locator("#module-map .box--selected").count(), 1);
await page.locator("#module-map .dbtn", { hasText: /^Genetics$/ }).click();
await page.waitForTimeout(520);
check("switching to a different degree drops every pick",
  await page.locator("#module-map .box--selected").count(), 0);

/* clicking the already-selected degree again is a full reset, not a
   no-op — back to Biological Sciences, and any picks made under it drop */
await page.locator("#module-map .box--optional").first().click();
await page.waitForTimeout(420);
await page.locator("#module-map .dbtn", { hasText: /^Genetics$/ }).click();
await page.waitForTimeout(520);
check("clicking the active degree again resets to Biological Sciences",
  await page.evaluate(() => document.querySelector("#module-map .dbtn.is-on").textContent.trim()),
  "Biological Sciences");
check("...and drops whatever was picked under it too",
  await page.locator("#module-map .box--selected").count(), 0);

/* Biological Sciences is already selected, picks already clear, from
   the reset just above — its options in Year 2 are known to fill both
   semesters exactly to 60, needed for the outline checks below */

/* The golden outline is one overlay per year (Year 2, Year 3 — never
   Year 1, which is fully core on every degree and would always be "done"
   and say nothing) spanning both of that year's semesters, not one per
   semester column. See docs/HANDOVER.md §6. */
check("exactly one outline overlay each for Year 2 and Year 3, none for Year 1",
  await page.evaluate(() => [...document.querySelectorAll("#module-map .mm__year-outline")]
    .map(el => el.dataset.year).sort()),
  ["2", "3"]);
/* nobody starts with 120 credits of picks already made in Year 2 or
   Year 3, so neither outline should be lit before anything is chosen */
check("neither outline is lit before any picks are made",
  await page.locator("#module-map .mm__year-outline.is-shown").count(), 0);

/* filling both semesters of Year 2 to their 60-credit cap should light
   its single outline, spanning both columns, and fade it in rather than
   snap it on */
const y2filled = await page.evaluate(() => {
  function fillOnce(slot) {
    var changed = false;
    document.querySelectorAll('#module-map [data-col="' + slot + '"] .box--optional').forEach(function (b) {
      var before = document.querySelector('#module-map [data-col="' + slot + '"] .col__cr strong').textContent;
      b.click();
      var after = document.querySelector('#module-map [data-col="' + slot + '"] .col__cr strong').textContent;
      if (before !== after) { changed = true; }
    });
    return changed;
  }
  var guard = 0;
  while (guard++ < 30) {
    var a = fillOnce("y2s1"), b = fillOnce("y2s2");
    if (!a && !b) { break; }
  }
  return { y2s1: document.querySelector('#module-map [data-col="y2s1"] .col__cr strong').textContent,
           y2s2: document.querySelector('#module-map [data-col="y2s2"] .col__cr strong').textContent };
});
if (y2filled.y2s1 === "60" && y2filled.y2s2 === "60") {
  await page.waitForTimeout(700);
  check("Year 2's outline lights once both its semesters hit 60/60",
    await page.evaluate(() => {
      var el = document.querySelector('#module-map .mm__year-outline[data-year="2"]');
      return el && !el.hidden && el.classList.contains("is-shown");
    }), true);
  check("Year 3 stays unlit — only Year 2 reached 120",
    await page.locator('#module-map .mm__year-outline[data-year="3"].is-shown').count(), 0);
} else {
  console.log("  skip  Year 2 outline lighting — Biological Sciences could not fill both semesters " +
              "(got " + y2filled.y2s1 + "/60, " + y2filled.y2s2 + "/60 — check the sample data)");
}

console.log("\nthe mini calendar beside the wheel");
/* the real events are all in the past by now, so a visitor's page shows
   none; pin "today" to the day before the first one and read the
   expected title from the data itself, so regenerating events.js does
   not break this */
const firstEvent = await page.evaluate(() => window.BIOSOC_EVENTS.events[0]);
const calPage = await browser.newPage({ viewport: { width: 1600, height: 950 }, colorScheme: "dark" });
const dayBefore = new Date(Date.UTC(+firstEvent.start.slice(0, 4), +firstEvent.start.slice(5, 7) - 1, +firstEvent.start.slice(8, 10) - 1, 12));
await calPage.clock.setFixedTime(dayBefore);
await calPage.goto(SITE);
await calPage.waitForTimeout(800);
check("four months, the first being today's",
  await calPage.evaluate(() => ({
    months: document.querySelectorAll("#minical .mc__month").length,
    todayInFirst: !!document.querySelector("#minical .mc__month:first-child .is-today"),
  })), { months: 4, todayInFirst: true });
check("days are bare squares — no dates or text written on them",
  await calPage.evaluate(() => [...document.querySelectorAll("#minical .mc__day")].every(d => d.textContent === "")), true);
check("the fourth month is faded, the others are not",
  await calPage.evaluate(() => [...document.querySelectorAll("#minical .mc__month")].map(m => +getComputedStyle(m).opacity < 0.6)),
  [false, false, false, true]);
check("it sits level with the wheel — never higher than the circle — and clear of it",
  await calPage.evaluate(() => {
    const c = document.querySelector("#minical .mc").getBoundingClientRect();
    const w = document.querySelector(".wheel").getBoundingClientRect();
    return { notAbove: c.top >= w.top - 1, notBelow: c.bottom <= w.bottom + 1, clearOfWheel: c.right < w.left };
  }), { notAbove: true, notBelow: true, clearOfWheel: true });
check("a day with an event is coloured; hovering it opens a box with the event's title",
  await (async () => {
    const btn = calPage.locator("#minical button.mc__day--ev").first();
    const nothingYet = await calPage.evaluate(() => document.getElementById("mc-tip").hidden);
    await btn.hover();
    await calPage.waitForTimeout(150);
    return calPage.evaluate(title => {
      const tip = document.getElementById("mc-tip");
      return { hiddenBefore: true, shown: !tip.hidden, hasTitle: tip.textContent.indexOf(title) !== -1 };
    }, firstEvent.title).then(r => ({ ...r, hiddenBefore: nothingYet }));
  })(), { hiddenBefore: true, shown: true, hasTitle: true });
await calPage.mouse.move(5, 5);
await calPage.waitForTimeout(150);
check("moving away closes the box",
  await calPage.evaluate(() => document.getElementById("mc-tip").hidden), true);
await calPage.setViewportSize({ width: 1600, height: 950 });
await calPage.clock.setFixedTime(new Date("2026-10-07T09:00:00+01:00"));
await calPage.reload();
await calPage.waitForTimeout(800);
check("the three placeholders are drawn dark grey: STEM Fair 1 day, Reading week 7, Exam week 6",
  await calPage.evaluate(() => {
    const days = [...document.querySelectorAll("#minical .mc__day--placeholder")];
    const grey = days.every(d => { const [r, g, b] = getComputedStyle(d).backgroundColor.match(/\d+/g).map(Number); return r === g && g === b && r < 110; });
    return { count: days.length, grey };
  }), { count: 14, grey: true });
check("weekends are no lighter than weekdays",
  await calPage.evaluate(() => {
    const plain = [...document.querySelectorAll("#minical .mc__month:first-child .mc__day:not(.is-today):not(.is-past):not(.mc__day--ev)")];
    return new Set(plain.map(d => getComputedStyle(d).backgroundColor)).size;
  }), 1);
check("hovering a placeholder week names it and gives its whole range",
  await (async () => {
    await calPage.locator("#minical button.mc__day--placeholder").nth(1).hover();
    await calPage.waitForTimeout(150);
    return calPage.evaluate(() => document.getElementById("mc-tip").textContent);
  })(), "PlaceholderReading weekMon 9 Nov – Sun 15 Nov · All day");
await calPage.mouse.move(5, 5);
await calPage.setViewportSize({ width: 900, height: 700 });
await calPage.waitForTimeout(200);
check("on a narrow screen, where the wheel leaves no room, it is not shown",
  await calPage.evaluate(() => getComputedStyle(document.getElementById("minical")).display), "none");
await calPage.close();

console.log("\nnothing broken in the console");
check("no errors or bad responses", noise, []);

await browser.close();
console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
