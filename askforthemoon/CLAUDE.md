@AGENTS.md

## Deployment (Vercel)

- The site is fully static: no backend, no secrets, nothing for Vercel to keep private.
- Set one environment variable in Vercel: `SITE_URL` = the site's public address, e.g.
  `https://askforthemoon.example.com` (no trailing slash). It is not a secret. Without it,
  social-media share previews point at `http://localhost:3007` and show no image.
- Security headers are set in `next.config.ts` (nosniff, referrer policy, permissions policy,
  no framing). Keep them if the config is edited.
- The parent repo at `E:\demo-sites` ignores every folder not on its guest list: add
  `!/askforthemoon/` to its `.gitignore` before the first push.
- Working folders (`scripts/cover-prompts/`, `scripts/assets/`, `audits/`) are git-ignored on
  purpose; the draft cover files carry the Higgsfield account ID. `node scripts/audit.mjs`
  recreates `audits/` locally.

## Known issues

**Phone buy bar is sometimes shown when it should be hidden, or the reverse (unconfirmed,
intermittent).** First reported as a colour problem. It isn't one: the phone bar (`.buy-bar`)
has no colour logic, it only shows or hides.

- **Symptom:** `node scripts/audit.mjs` section 8 (system light vs dark) intermittently fails on
  one frame. It failed once before the puppeteer-core upgrade and in 2 of 3 runs after it, and
  it always reads: `/ @390, frame 5: 21150 px over threshold`. That frame is near the bottom of
  the home page (the reading spread). The differing area (~21,150 px) matches the fixed phone
  buy bar (390 × ~56 px). Captured on its own, the same frame is byte-identical in light and
  dark every time. It only differs inside the full audit run, when the machine is busy.
- **Not the cause:** screenshot timing. Waiting for images and retaking until two frames match
  did not stop it, so the bar settles in a different state rather than being caught mid-change.
- **Best guess:** a race in `src/components/buy-rail.tsx`. The bar shows when
  `scrollY > 0.8 × viewport && !buyInView`. `buyInView` comes from an IntersectionObserver on
  `#buy` (threshold 0.15), and it only updates when that observer fires. The audit jumps
  straight between scroll positions, so the scroll handler (via rAF) and the observer can report
  in different orders. When the machine is busy, the bar may be left in whichever state won.
  Frame 5 at 390 wide sits close to the buy section, where this matters most. For a real
  visitor this would mean the bar occasionally showing over, or missing just before, the buy
  section.
- **Not the cause:** the cached section positions in `src/lib/worlds.ts`. Only the desktop
  rail's colour (`data-ground`) uses them; the phone bar's show/hide doesn't.
- **Where to start:** reproduce with the full audit at 390 wide. At frame 5, log `scrollY`,
  `buyInView`, `#buy`'s live `getBoundingClientRect()` and the bar's `data-show`, in both
  schemes.
