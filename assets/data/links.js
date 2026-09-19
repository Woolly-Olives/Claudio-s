/* =============================================================
   Essential Links — the data behind the arc.

   The arc is the wheel's own Essential Links slice, zoomed until its
   outer edge spans the page. It keeps the wheel's exact angle
   (360/7 = 51.43 degrees) and its inner/outer radius ratio, and is
   divided into one segment per link below.

   `rank` is what decides where a link sits on the arc: 1 is placed in
   the middle, which is the most prominent spot, and the rest fan out
   from there alternately left and right. `n` is only the number shown
   on the segment, and follows the order the committee listed them in.
   Change a `rank` to move a link along the arc; nothing else needs
   touching.

   Below the arc's narrow end sits the hub — remote.le.ac.uk — which
   every other link fans out of.
   ============================================================= */
window.BIOSOC_LINKS = {
  hub: {
    href: "https://remote.le.ac.uk/",
    name: "remote.le.ac.uk",
    note: "Most of the useful links all in one place. The ones worth knowing fan out above."
  },

  links: [
    { n: 1, rank: 1, name: "Blackboard",
      href: "https://blackboard.le.ac.uk/ultra/course",
      note: "I find the website works better than the app." },

    { n: 2, rank: 2, name: "Outlook",
      href: "https://outlook.office.com/mail/",
      note: "University email. Download the app on your phone, and I highly recommend adding the calendar widget to your home screen." },

    { n: 3, rank: 3, name: "My Student Record",
      href: "https://mystudentrecord.le.ac.uk/",
      note: "Mitigating circumstances, exam results, documents, OLMS." },

    { n: 4, rank: 9, name: "MyWorkspace",
      href: "https://uniofleicester.sharepoint.com/sites/student",
      note: "The MyWorkspace SharePoint site — interesting news and events." },

    { n: 5, rank: 4, name: "Library",
      href: "https://le.ac.uk/library",
      note: "Search the library database, both physical and online books." },

    { n: 6, rank: 8, name: "Connect2",
      href: "https://connect2.le.ac.uk/",
      note: "David Wilson Library group study room bookings." },

    { n: 7, rank: 6, name: "MyUoL",
      href: "https://myuol.le.ac.uk/dashboard/home",
      note: "The MyUoL app website — useful to check attendance." },

    { n: 8, rank: 7, name: "Students’ Union",
      href: "https://www.leicesterunion.com/",
      note: "Union news, student elections, Advice Service.",
      more: [
        { name: "Support", href: "https://www.leicesterunion.com/support/",
          note: "Useful signposting." },
        { name: "Find a society", href: "https://www.leicesterunion.com/opportunities/societies/findasociety/",
          note: "List of every single society and sports club." },
        { name: "Find a club", href: "https://www.leicesterunion.com/opportunities/sports/findaclub/",
          note: "List of just the sports clubs." }
      ] },

    { n: 9, rank: 5, name: "Open Timetable",
      href: "https://opentimetable.le.ac.uk/",
      note: "Timetables for all rooms, modules and courses across the university." }
  ]
};
