# The Money Mirror

A live, anonymous audience-voting web app for a conference talk. Nothing about a
voter is stored — just honest counts on a screen. Backed by Supabase.

## Live site

**https://mirror.zenca.global**

| Page | Link | For |
|------|------|-----|
| Present | https://mirror.zenca.global/present/ | Presenter — sign in, open a room, run the slides |
| Vote | https://mirror.zenca.global/vote/ | Audience — join on a phone and answer |
| Results | https://mirror.zenca.global/results/ | Browse the counts from a session afterwards |

Direct GitHub Pages URL (redirects to the custom domain once DNS is live):
https://kamalgaur82.github.io/zencaglobal-website-moneymirror/

## What's in here

Static site deployed via GitHub Pages, built from the `v3` deck content:

```
index.html            landing page
present/index.html    presenter view
vote/index.html       audience voting view
results/index.html    results browser
assets/               shared scripts: zenca-config.js, zenca-sync.js
CNAME                 mirror.zenca.global
.nojekyll             serve files as-is (no Jekyll processing)
```

The pages load `../assets/zenca-config.js?v=4` and `../assets/zenca-sync.js?v=4`.
`zenca-config.js` holds the Supabase project URL and the **anon** public key only —
safe to publish; row-level security restricts writes. No service-role key is in this repo.
