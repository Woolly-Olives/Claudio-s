/* =============================================================
   Events — the BioSoc Outlook calendar's own links.

   assets/data/events.js holds the events themselves and is generated
   from the published .ics; this file holds the links to the live
   calendar and the words around them, and is edited by hand.

   `subscribe` is the published .ics address, turned into a webcal://
   link so that clicking it opens the visitor's own calendar app rather
   than downloading a file. Subscribing is the point: the events then
   keep arriving without anyone coming back here.

   BEFORE PUBLICISING THE SUBSCRIBE LINK, read the timezone note at the
   top of tools/ics-to-events.py. The feed carries the calendar's own
   timezone, which this site cannot correct.

   The calendar is published from a personal Microsoft account, so
   these addresses stop working the day that account does. Moving it to
   an account the society keeps is worth doing before many students
   subscribe.
   ============================================================= */
window.BIOSOC_CALENDAR = {
  subscribe: "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/f2dbaf2a-a698-4ede-9634-58961996864e/cid-46F7C715CCBCD3DD/calendar.ics",
  view: "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/f2dbaf2a-a698-4ede-9634-58961996864e/cid-46F7C715CCBCD3DD/index.html",

  heading: "Put BioSoc in your timetable",
  blurb: "Subscribe once and every BioSoc, School and Union event turns up in " +
         "your Outlook calendar next to your lectures — including the ones " +
         "added after today.",
  action: "Subscribe in Outlook",

  /* Outlook refreshes a subscribed calendar on its own schedule, so a
     change made this morning may not reach a phone until this evening.
     Anything last-minute belongs on Instagram as well. */
  smallprint: "Outlook checks for changes every few hours, so anything last " +
              "minute goes on Instagram too."
};
