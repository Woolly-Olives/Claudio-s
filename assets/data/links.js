/* =============================================================
   Essential Links — the data behind the arc.

   The arc is the wheel's own Essential Links slice, zoomed until the
   two ends of its outer edge sit on the left and right edges of the
   screen. It keeps the wheel's exact angle (360/7 = 51.43 degrees),
   and is divided into one section per link below.

   `rank` is what decides where a link sits on the arc: 1 is placed in
   the middle, which is the most prominent spot, and the rest fan out
   from there alternately left and right. `n` is only the number shown
   on the segment, and follows the order the committee listed them in.
   Change a `rank` to move a link along the arc; nothing else needs
   touching.

   LOGOS: give a link a `logo` (a path to an image file, e.g.
   "assets/img/logos/blackboard.jpg") and it replaces the numbered
   circle with that image. Leave `logo` out and the number shows, same
   as always — nothing breaks either way. If an image fails to load
   (missing file, bad path) the number reappears automatically.

   Four are filled in (2026-09-22) — Blackboard, Outlook, Library,
   Students' Union — files the user supplied directly, not fetched or
   hand-drawn here (this environment's network policy blocks every one
   of these services' own domains, including le.ac.uk itself, so
   nothing here could be fetched and checked against the real thing,
   and a trademark hand-drawn from memory, unverified, risks getting it
   visibly wrong — worse than the plain number it would replace). The
   remaining five have none yet. Add real ones the same way — from the
   service's own site, or exported from the committee's own files — as
   `assets/img/logos/<name>.<ext>` and point `logo` at them.

   GROUPS: a top-level link can leave `href` out entirely (see "Research
   resources" below) — its wedge then has no destination of its own and
   is not a real link (arc.js gives it `seg--group` and no `href`
   attribute), just a heading for the `more` list under it. Every other
   top-level link keeps a real `href` and stays clickable even when it
   also carries `more`.

   `more` sub-links only need `name`/`href`, `note` is optional — leave
   it out and the readout stays blank for that one when it's focused,
   same as a plain "" would.

   Below the curve sits the hub — remote.le.ac.uk — which every other
   link fans out of.
   ============================================================= */
window.BIOSOC_LINKS = {
  hub: {
    href: "https://remote.le.ac.uk/",
    name: "remote.le.ac.uk"
    /* no note: its old text ("Here are the most useful links for
       university in one place!") is now the arc's default HINT in
       arc.js instead — moved, not copied, at explicit instruction
       (2026-09-22). Hovering the hub itself now shows just its name. */
  },

  links: [
    { n: 1, rank: 1, name: "Blackboard",
      href: "https://blackboard.le.ac.uk/ultra/course",
      logo: "assets/img/logos/blackboard.jpg",
      note: "Try both the website and the app to see which one works better for you." },

    { n: 2, rank: 2, name: "Outlook - university email and calendar",
      href: "https://outlook.office.com/mail/",
      logo: "assets/img/logos/outlook.webp",
      note: "Download the app on your phone, and we highly recommend adding the calendar widget." },

    { n: 3, rank: 3, name: "Library",
      href: "https://le.ac.uk/library",
      logo: "assets/img/logos/library.jpg",
      note: "Search the library database, both physical and online books.",
      more: [
        { name: "Book rooms", href: "https://connect2.le.ac.uk/",
          note: "You can book group study rooms in the library, Freemen's Cottages and Charles Wilson." },
        { name: "Centre for Academic Achievement", href: "https://le.ac.uk/library/academic-achievement",
          note: "Guidance on essays, maths, research, etc. and skills workshops." }
      ] },

    { n: 4, rank: 4, name: "Research resources",
      note: "The most useful websites for your online research.",
      more: [
        { name: "PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/?otool=iukuleicestlib",
          note: "Subscribed databases." },
        { name: "Scopus", href: "https://www-scopus-com.ezproxy.lib.le.ac.uk/pages/home",
          note: "Subscribed databases." },
        { name: "Google Scholar", href: "https://scholar.google.com/" },
        { name: "How to do research", href: "https://uniofleicester.sharepoint.com/sites/academic-skills-online/SitePages/Research.aspx",
          note: "Very useful resource that teaches you how to properly do research." }
      ] },

    { n: 5, rank: 5, name: "Students’ Union",
      href: "https://www.leicesterunion.com/",
      logo: "assets/img/logos/students-union.jpg",
      note: "Union news, student elections, Advice Service.",
      more: [
        { name: "Societies", href: "https://www.leicesterunion.com/opportunities/societies/findasociety/",
          note: "List of every single society and sports club." },
        { name: "Sports", href: "https://www.leicesterunion.com/opportunities/sports/findaclub/",
          note: "List of just the sports clubs." },
        { name: "Advice", href: "https://www.leicesterunion.com/advice/" }
      ] },

    { n: 6, rank: 6, name: "My Student Record",
      href: "https://mystudentrecord.le.ac.uk/",
      note: "Mitigating circumstances, exam results, documents, OLMS." },

    { n: 7, rank: 7, name: "AccessAbility",
      href: "https://le.ac.uk/accessability",
      note: "AccessAbility offers support and advice for students with dyslexia or other specific learning difficulties as well as working with students who have sensory disabilities, mobility difficulties; mental health conditions and autism." },

    { n: 8, rank: 8, name: "University SharePoint",
      href: "https://uniofleicester.sharepoint.com/sites/student",
      note: "The University SharePoint site — interesting news and events.",
      more: [
        { name: "UoL Citizen app (Google Play)",
          href: "https://play.google.com/store/apps/details?id=com.mydaycloud.app.leicester&hl=en_GB&gl=US",
          note: "Useful to check attendance." },
        { name: "UoL Citizen app (App Store)",
          href: "https://apps.apple.com/gb/app/myuol/id1138842974",
          note: "Useful to check attendance." },
        { name: "SafeZone app (Google Play)",
          href: "https://play.google.com/store/apps/details?id=com.criticalarc.safezoneapp" },
        { name: "SafeZone app (App Store)",
          href: "https://apps.apple.com/au/app/safezone/id533054756" }
      ] },

    { n: 9, rank: 9, name: "Open Timetable",
      href: "https://opentimetable.le.ac.uk/",
      note: "Timetables for all rooms, modules and courses across the university." }
  ]
};
