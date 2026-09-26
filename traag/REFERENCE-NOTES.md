# TRAAG — reference notes

Two sites, studied 25 September 2026. Decisions, not styles.
Reference A is for the hero only. Reference B is for the information architecture only.
We copy neither.

---

## Reference A — alvamaice.com (hero, nav, live marker)

### What it worked out

**The hero is one face pushed through escalating treatments.**
Watched frame by frame: it is a 16.7 second looping video, pre-rendered. Several portraits,
not one. Each portrait goes plain and dark → hard two-colour threshold → solarised edge
outline with heavy grain → inverted → hard cut to black → next portrait. The face never
moves; only the print process does. That is the idea. It reads as a showreel because the
subject changes, and as a brand because the treatment does not.

**Nothing in the hero competes with the face.** No copy, no button, no logos over the image.
Everything else is pinned to the edges.

**The live marker is a working document, not a headline.** Top right, small, bracketed date,
venue, city, a green dot, an outward arrow. It reads as a status line. It is the same element
on every page. It tells you the site is alive before you read anything.

**The fixed left nav is five words in a column.** Small, uppercase, nothing else. Because it is
pinned and tiny, the hero stays full-bleed and the nav never becomes a bar.

**The partner logos are stacked vertically on the right edge.** They sit in the margin, not in a
row across a section. The site does not have a sponsors section. It has a margin.

**The footer lives inside the hero.** Wordmark, legal line, cookie accept: all at the bottom of
the first viewport, pinned. There is no separate footer section below the page. Scrolling
reveals content over the pinned hero, and the footer is already there when you reach the end.

**Dates section: one giant word, dates in a row, sold out stays listed.** Rows are date /
venue / city. SOLD OUT is a state on the row, not a removal.

**A members area exists and it is gated.** "El after" redirects straight to a login. Nothing
leaks. That is the right instinct for the list.

### What does not transfer

- **The video itself.** The escalation is baked into an MP4. That means one treatment, one
  set of portraits, no reduced-motion fallback, and it stalled for over 30 seconds on load
  here. We do the treatment live in CSS and SVG on one image, so it is cheap, honours
  reduced motion, and swaps to the real video later without changing the page.
- **The palette.** Cyan-on-navy is that brand, literally called Ice. Ours is one hot orange on
  near-black, printed on paper. Same technique, different ink.
- **The hand-drawn, dripping wordmark.** It belongs to a reggaeton personality. Ours is set in
  the display face, blunt, too large.
- **The preloader.** A logo animation that held the page for 20 seconds. Nothing on our site
  waits for anything.
- **The custom cursor.** It followed onto the login page and sat across the form field. We use
  the system cursor.
- **Horizontal scrolling and pinned sections.** The dates ride sideways over a pinned word.
  Brief says native scroll only, and a dates list should be read top to bottom.
- **The tenor.** Shop drops, "SOLD OUT" tickers, "explicit content" marquees, five social
  icons in the header. This is a merch business with a DJ attached. Ours has one shirt and
  does not mention it.
- **Social icons in the header.** She has one deliberately bad Instagram. That is a text link,
  once, in the footer.

### What we do instead

- **Hero:** full-viewport, a video element expecting hero.mp4 with a poster. Until it exists,
  the fallback cycles several portraits through four live states on a single loaded image:
  plain, posterised with grain, threshold, inverted. Hard holds, short crossfades. It reads
  as a showreel because the portrait changes and the treatment does not.
- **Nothing on the hero but the wordmark, the live marker, and a scroll cue.** Same rule as
  Alvama, held harder.
- **Live marker:** top right, monospace, reads from the dates data and always shows the
  genuinely next show. Same element on every page.
- **Nav:** fixed left column, five words, lowercase where it is natural.
- **Partner logos:** none. There are no partners. The right margin stays empty, which is a
  decision, not an omission.
- **Footer inside the hero:** kept. Wordmark and one line of small monospace at the bottom of
  the first viewport. Scrolling content rises over it.
- **Members area:** a gate that holds, with a magic-link pattern instead of a password. The
  private area is unreachable by direct URL.

---

## Reference B — nikisadeki.com (information architecture only)

### What it worked out

**The route list is correct for a DJ.** Home, bio, music, video, booking, plus a newsletter
block. That is everything a promoter, a fan, and a journalist need, and nothing else. We use
a version of it: home, dates, releases, about, booking, the list.

**Booking is split by territory and purpose.** Four addresses: North America, Europe and rest
of world, promos, everything else. Nothing to fill in, nothing to wait for. The clarity is
right even if the execution is a plain email list.

**The music page links out.** Beatport, Spotify, SoundCloud, Apple. It does not try to be a
store.

**Sitewide colour discipline.** One red, one near-black, one white. Every page keeps to it.

### What does not transfer

- **The design.** It is a Wix template. Blurred red duotone hero photographs, rounded cards
  with drop shadows, a three-column embed grid, a "Never miss a thing" newsletter block with
  two rounded inputs and a filled button. Every DJ site built this way looks like this one.
- **The type.** A rounded futuristic display face that says "electronic music" the way a
  stock photo says "business". Ours is a heavy condensed grotesque, the flyer type.
- **The blur.** Every hero image is blurred to a haze so text can sit on it. The photography
  is the only good thing on the site and it is thrown away on every page. Ours is sharp,
  grainy, and nothing sits on top of it.
- **The bio.** Nine paragraphs of press release: "emotionally charged", "genre-defying",
  "immersive and cinematic", a list of every club and festival. Ours is four paragraphs, in
  her voice, about warm-up slots, and says she is 22.
- **The home page.** Hero, about teaser, three video cards, three music cards, three fact
  bullets, newsletter. It is a story. Ours is an index.
- **The headings.** "NIKI SADEKI" and "ABOUT" are set as one heading element per letter, so a
  screen reader announces N, I, K, I. Ours are words.
- **Embeds.** Music and video pages are iframes. Brief says no player, no embeds, no audio.
  Releases are listed as objects with links out.
- **Video as a route.** She does not have a video page to fill. Her forty-minute kick drum
  videos live on Instagram; the site links there once and does not host them. So the route
  is dropped, and "the list" takes its slot.
- **Booking as a list of emails.** Clear, but it sends the promoter away. Ours is a form
  with real validation, a reference number, and a stated response time, because that is the
  capability we are demonstrating.
- **Newsletter as a footer block.** Name and email at the bottom of every page. Ours is the
  list: a route of its own with a login, because members get something a footer form cannot
  give them.

### What we do instead

- **Six routes:** home, dates, releases, about, booking, the list. Plus 404 and styleguide.
- **Home is an index:** hero, next four dates, two releases, one room photograph, list
  signup. Nothing else.
- **Dates replaces "video"** as the second item in the nav. A DJ's dates are the proof.
- **Releases replaces "music":** two EPs listed as objects with catalogue number, format,
  pressing, tracklist, and links out. No embeds.
- **About replaces "bio":** paper, not black. Four paragraphs. Two photographs.
- **Booking is a form**, one line above it in her voice about what she will and will not play.
- **The list replaces "newsletter":** its own route, a gate, a private area with unpublished
  announcements and a presale code, and a way to leave.

---

## What we are actually building

Alvama's ideas: one face, escalating print process, a status line that proves the site is
live, a nav that stays out of the way, a footer that does not need its own section, a gate
that holds.

Niki's clarity: a short route list, booking that is easy to find, music that links out.

Neither one's execution. No video hero that stalls, no preloader, no custom cursor, no
sideways scroll. No template blocks, no blur, no cards, no press-release bio, no embeds.

The photography and the type do the work. Black ground, paper where reading happens,
orange once per screen and only when it means something, monospace for anything that is
a fact. Clean, smooth, unhurried.
