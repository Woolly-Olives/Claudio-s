#!/usr/bin/env python3
"""
Write assets/data/instagram-posts.js from Instagram's own API.

    IG_TOKEN=... python3 tools/fetch-instagram.py

NOT TESTED AGAINST INSTAGRAM. It was written where instagram.com and
graph.instagram.com are both unreachable, so the request shape comes
from Meta's documentation rather than from a run that worked. Run it
once by hand and read what comes back before trusting it to a schedule.

------------------------------------------------------------------
WHAT IT NEEDS, AND WHY IT IS NOT FREE
------------------------------------------------------------------
Instagram has no way to read a profile's posts without a token, and
getting one is a real errand:

  1. the account must be a Business or Creator account, not personal;
  2. a Meta app, with Instagram Business Login added to it;
  3. run that login once to get a short-lived token, then exchange it
     for a long-lived one, which lasts 60 days;
  4. put that token in the repository's secrets as IG_TOKEN.

Meta's documentation is at
https://developers.facebook.com/docs/instagram-platform/ — the pages
that matter are "Instagram API with Instagram Login", "Business Login
for Instagram", and "Access Token".

A long-lived token must be refreshed before it is 60 days old or it
dies, and the feed dies with it silently. refresh() below does that on
every run, which keeps it alive as long as this runs at least once
every two months; it prints the new token, because a token refreshed
here cannot write itself back into the repository's secrets.

------------------------------------------------------------------
WHAT IT STORES
------------------------------------------------------------------
Permalinks and dates only. The media_url the API hands back is signed
and expires within days, so storing it would leave a grid of broken
pictures within the week. The pictures come from Instagram's own embed
at the moment a visitor looks, which is also what keeps the posts
correct when one is edited or taken down.
"""
import os
import sys
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API = os.environ.get("IG_API", "https://graph.instagram.com")
VERSION = os.environ.get("IG_API_VERSION", "v23.0")
HOW_MANY = int(os.environ.get("IG_COUNT", "6"))
FIELDS = "id,permalink,caption,media_type,timestamp"


def call(path, **params):
    url = "%s/%s/%s?%s" % (API, VERSION, path.lstrip("/"), urllib.parse.urlencode(params))
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        raise SystemExit("Instagram said %s for /%s:\n%s" % (e.code, path.lstrip("/"), body))


def refresh(token):
    """
    Long-lived tokens last 60 days and can be renewed once they are 24
    hours old. Renewing on every run means the feed survives as long as
    this runs at all; skipping it means the feed dies, quietly, two
    months from now.
    """
    try:
        out = call("refresh_access_token", grant_type="ig_refresh_token", access_token=token)
    except SystemExit as e:
        print("Could not refresh the token (carrying on with the old one):\n  %s" % e,
              file=sys.stderr)
        return token
    days = int(out.get("expires_in", 0)) // 86400
    fresh = out.get("access_token", token)
    if fresh != token:
        print("Token refreshed, now good for %d days. Put this in IG_TOKEN:\n%s" % (days, fresh))
    else:
        print("Token good for %d more days." % days)
    return fresh


def first_line(caption):
    for line in (caption or "").splitlines():
        line = line.strip()
        if line:
            return line[:140]
    return ""


def main():
    token = os.environ.get("IG_TOKEN", "").strip()
    if not token:
        raise SystemExit("Set IG_TOKEN. See the note at the top of this file.")

    token = refresh(token)
    data = call("me/media", fields=FIELDS, limit=HOW_MANY, access_token=token)

    posts = []
    for item in data.get("data", [])[:HOW_MANY]:
        link = item.get("permalink", "")
        if not link:
            continue
        stamp = item.get("timestamp", "")
        posts.append({
            "permalink": link,
            "date": stamp[:10],
            "title": first_line(item.get("caption")),
            "kind": item.get("media_type", ""),
        })

    if not posts:
        raise SystemExit("The API returned no posts. Refusing to publish an empty feed.")

    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.join(here, "assets", "data", "instagram-posts.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write(HEADER)
        f.write("window.BIOSOC_INSTAGRAM_POSTS = ")
        f.write(json.dumps({
            "fetchedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            "posts": posts,
        }, indent=2, ensure_ascii=False))
        f.write(";\n")

    print("%d posts -> assets/data/instagram-posts.js" % len(posts))
    for p in posts:
        print("  %s  %s" % (p["date"], p["title"][:60] or p["permalink"]))


HEADER = """\
/* =============================================================
   Instagram — the most recent posts. GENERATED by
   tools/fetch-instagram.py. Do not hand-edit.

   Permalinks and dates only: the image addresses the API returns are
   signed and expire within days, so the pictures come from Instagram's
   own embed when someone looks.
   ============================================================= */
"""

if __name__ == "__main__":
    main()
