/* =============================================================
   Events — the BioSoc Instagram account.

   Instagram has no official way to embed a whole profile: the only
   supported embed is one post at a time, through the blockquote and
   script that the "Embed" item on a post gives you. A live grid of the
   latest posts needs the Instagram Graph API and an access token, which
   a static site on GitHub Pages has nowhere safe to keep and which
   expires anyway. So the account is presented two ways:

     - the profile itself, as a card that links straight to it, and
     - whichever posts the committee chooses to pin here, embedded.

   TO PIN A POST: open it on Instagram, use the ... menu, choose Embed,
   and copy the URL out of the snippet — or just copy the post's own
   address from the browser. It looks like

       https://www.instagram.com/p/CyAbC1dEfGh/          (a post)
       https://www.instagram.com/reel/CyAbC1dEfGh/       (a reel)

   Add it to `posts` below, newest first:

       { permalink: "https://www.instagram.com/p/CyAbC1dEfGh/",
         title: "Freshers' social",
         date:  "2026-10-02",
         note:  "Tuesday 7pm, The Font. Everyone welcome." }

   `title`, `date` and `note` are only shown before Instagram's script
   has drawn the post, and to anyone it never reaches — so write them
   as if they were the whole card, because sometimes they are.
   ============================================================= */
window.BIOSOC_INSTAGRAM = {
  handle: "biosoc.leics",
  url: "https://www.instagram.com/biosoc.leics/",
  blurb: "Socials, talks, trips and everything else we run — announced on Instagram first.",

  /* Ask before loading anything from Instagram. false loads the embeds
     as soon as this section is opened; true shows a button first, which
     is the safer setting if you would rather no third-party cookies are
     set without the visitor agreeing. Nothing loads from Instagram
     until this section is opened either way. */
  consent: false,

  /* true adds each post's own Instagram caption to its embed. Off by
     default: captions vary wildly in length and pull the grid about. */
  captions: false,

  /*
   * A whole-profile frame, as an extra block below the card and posts
   * above — off by default. Same shape of switch as `embed` in
   * assets/data/union.js: flip it, open Events, and look.
   *
   * This is NOT Meta's documented embed. There is no supported way to
   * frame a whole profile; the only documented mechanism is one post at
   * a time via the blockquote/embed.js above. This URL —
   * instagram.com/<handle>/embed/ — surfaced in a Gemini-built version
   * of this site (2026-09-20) that used it for exactly this purpose.
   * It is UNTESTED: instagram.com is blocked at this container's egress
   * proxy, so nothing run here proves it either way. Worth going in
   * with real skepticism rather than treating "an LLM wrote this URL"
   * as evidence it works — the same source file also stood in a public
   * Google holidays calendar for the real Outlook calendar it could not
   * embed, and shipped a client-side "membership login" whose valid
   * codes sit in plaintext in the page's own JavaScript. Ordinary
   * Instagram profile pages refuse to be framed and gate logged-out
   * viewers behind a login wall; whether the /embed/ suffix is a real,
   * still-supported exception to that is the open question.
   *
   * Turn it on and look. Blank panel, or a "log in to see photos and
   * videos" wall sitting inside the frame, means no — set it back to
   * false and keep the card-and-posts design above, which is the part
   * that is known to work.
   */
  profileEmbed: false,

  /* Newest first. Empty is fine — the page then simply points at the
     account. Do not invent addresses here: a wrong shortcode is a
     dead card. */
  posts: [
  ]
};
