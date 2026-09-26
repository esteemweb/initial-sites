@AGENTS.md

## TRAAG deployment notes

- `LIST_SECRET` **must** be set in Vercel (Project → Settings → Environment Variables, for
  Production and Preview), then redeploy. The site has no built-in fallback: without it the list
  (join, sign in, the private area) refuses to work. Everything else on the site still runs.
- Generate a random value (at least 32 characters) with:
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
- Use a different value from the local one in `.env.local`. Never commit `.env.local`
  (`.gitignore` excludes every `.env*` file).
- Changing `LIST_SECRET` signs every list member out at once. That is the emergency switch if
  it ever leaks.
- `allaboutartist/` and `generated/` are kept out of git on purpose. The site builds without them.
