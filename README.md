# Happy Birthday, My Love 💌

A handcrafted, single-page interactive birthday website — a journey through
a love letter, a photo gallery, 20 reasons, a relationship timeline, little
notes, birthday wishes, and a final gift box, with hidden secrets scattered
throughout. Plain HTML/CSS/JavaScript, no build step, no frameworks.

---

## 1. Project structure

```
birthday-website/
├── index.html                   All markup for every scene + modals
├── README.md                    You are here
│
├── css/
│   ├── base.css                 Reset, design tokens (colors/fonts/spacing), base typography
│   ├── animations.css           Every @keyframes definition + reduced-motion override
│   ├── layout.css               Global chrome: loading screen, canvases, top controls,
│   │                            progress dots, scene crossfade system, buttons, modals
│   ├── sections.css             Visuals specific to each scene (letter paper, gallery
│   │                            cards, gift box, timeline, envelopes, etc.)
│   └── responsive.css           Mobile/tablet breakpoints
│
├── js/
│   ├── config.js                ★ EDIT THIS FILE — every name, date, message, photo
│   │                            path, and the music path, all in one object
│   ├── utils.js                 Shared helpers: DOM shortcuts, math, focus-trapping,
│   │                            scroll-reveal, the sound-effect synth, modal open/close
│   ├── audio.js                 Background music + the master sound toggle
│   ├── particles-ambient.js     Background floating hearts/petals/sparkles + cursor trail
│   ├── particles-celebration.js Reusable confetti/fireworks/hearts canvas engine
│   ├── easter-eggs.js           Konami code, secret stars, scratch card, swap puzzle
│   ├── main.js                  Boots the app: scene-switching ("Journey") controller,
│   │                            countdown gate, and startup sequence
│   └── sections/
│       ├── welcome.js           Scene 1 — Welcome
│       ├── letter.js            Scene 2 — Love Letter (typewriter effect)
│       ├── gallery.js           Scene 3 — Our Memories (flip cards + modal)
│       ├── reasons.js           Scene 4 — 20 Reasons I Love You
│       ├── timeline.js          Scene 5 — Our Story So Far
│       ├── notes.js             Scene 6 — Little Love Notes (envelopes)
│       ├── wishes.js            Scene 7 — Birthday Wishes (fireworks show)
│       └── finale.js            Scene 8 — Final Surprise (gift box + constellation heart)
│
└── assets/
    ├── images/
    │   ├── memory-1.svg … memory-6.svg   Placeholder photos (replace these)
    │   └── favicon.svg                   Browser tab icon
    └── audio/
        └── README.txt            How to add your song
```

**You will almost always only need to edit [`js/config.js`](js/config.js).**
Every other file is presentation/behavior; `config.js` is content.

---

## 2. Why no external libraries?

Every animation on this site — confetti, fireworks, floating hearts, the
typewriter effect, card flips, scroll reveals, the constellation heart — is
hand-built with vanilla CSS animations, the Canvas 2D API, and
`IntersectionObserver`. No GSAP, no Three.js, no canvas-confetti, no
framework, no `npm install`, no build step.

That was a deliberate choice, not an oversight:

- **It has to just work.** She should be able to open a file (or a link)
  and see it — no CDN to reach, nothing that silently breaks if a network
  blocks a third-party script on the day that matters.
- **It's light.** The effects here don't need a physics engine or a 3D
  renderer; a few hundred lines of Canvas 2D code does the whole job at a
  fraction of the download size.
- **It's yours to edit.** Everything is plain, commented JavaScript — no
  library API to learn if you want to tweak how the fireworks look.

If you *do* want to level it up later — e.g. swap in
[canvas-confetti](https://github.com/catdad/canvas-confetti) for even
richer bursts, or [GSAP](https://gsap.com/) for more elaborate sequencing —
the natural place to do that is `js/particles-celebration.js` (the
confetti/fireworks engine) and the individual files in `js/sections/`.

The one optional upgrade actually worth considering is **real fonts** — see
the note in `css/base.css` and the section below. The site ships with
elegant system-font fallbacks so it looks good with zero downloads, but a
proper serif + handwriting script font is a nice, still fully offline,
two-minute upgrade.

---

## 3. Run it locally

**Easiest option:** double-click `index.html`. Everything here is plain
scripts (no ES modules, no `fetch`), so it runs directly from disk in any
modern browser with no server needed.

**Recommended option** (avoids occasional browser quirks with local files,
and you'll want this eventually if you extend the site with anything that
does need a server): serve the folder locally.

```bash
# Option A — Python (already installed on most Macs/Linux)
cd birthday-website
python3 -m http.server 8000
# then open http://localhost:8000

# Option B — Node (if you have it)
cd birthday-website
npx serve .

# Option C — VS Code
# Install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

After editing `js/config.js`, just refresh the page (hard-refresh with
`Cmd+Shift+R` / `Ctrl+Shift+R` if your browser cached the old version).

---

## 4. Deploying it

All three options below are free and need zero configuration beyond
pointing the host at this folder — there's no build step.

### GitHub Pages
```bash
cd birthday-website
git init
git add .
git commit -m "Birthday website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source → Deploy from branch → `main` / `root`**.
Your site will be live at `https://<your-username>.github.io/<repo-name>/`
within a minute or two.

### Netlify
- **Drag-and-drop (fastest):** go to [app.netlify.com/drop](https://app.netlify.com/drop)
  and drag the `birthday-website` folder in. It deploys instantly and gives
  you a shareable URL.
- **Git-connected:** push to GitHub as above, then in Netlify choose
  *Add new site → Import an existing project*, pick the repo. Build command:
  leave blank. Publish directory: `/` (the repo root).

### Vercel
```bash
cd birthday-website
npx vercel
```
Follow the prompts (Framework Preset: **Other**, no build command, output
directory: `.`). Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new)
the same way as Netlify above.

---

## 5. Personalization checklist

Everything below lives in **[`js/config.js`](js/config.js)** unless noted
otherwise. Every editable line in that file has a `✏️ EDIT` comment above
it, so you can also just open the file and search for `✏️`.

### Names & meta
- [ ] `meta.herName`, `meta.yourName`
- [ ] `meta.pageTitle` (browser tab text)

### Countdown (optional)
- [ ] `countdown.targetDate` — set to her actual birthday/moment. If it's
      already in the past when the page loads, the countdown is skipped
      automatically, so it's safe to leave this alone if you're sending it
      same-day.
- [ ] `countdown.enabled` — set to `false` to always skip straight to Welcome.

### Music
- [ ] Drop an mp3 at `assets/audio/song.mp3` (see `assets/audio/README.txt`)
- [ ] `music.label` (shown in the button's tooltip)

### 1. Welcome
- [ ] `welcome.title`, `welcome.subtitle`, `welcome.buttonText`

### 2. Love Letter
- [ ] `letter.heading`
- [ ] `letter.paragraphs` — the actual letter. Placeholder paragraphs are
      marked `[Placeholder — ...]` telling you exactly what to write.
- [ ] `letter.signOff`

### 3. Our Memories (photo gallery)
- [ ] Replace the six files in `assets/images/` (`memory-1.svg` …
      `memory-6.svg`) with real photos — **keep the same filenames**, or
      change the `image` path for each entry in `gallery.memories`
- [ ] `gallery.memories[i].title`, `.caption`, `.alt` for each of the 6 photos
- [ ] Add/remove entries in the `memories` array if you want more or fewer
      than 6 — the grid adjusts automatically

### 4. Reasons I Love You
- [ ] `reasons.list` — 20 placeholder reasons are pre-written and usable
      as-is, but swap in the ones only the two of you would know. Look for
      the one literal `[Placeholder — an inside joke...]` entry especially.

### 5. Timeline
- [ ] `timeline.milestones` — 6 entries, each with `date`, `title`,
      `description`, `icon` (any emoji). All dates/descriptions are
      placeholders marked `[Month Year]` / `[Placeholder — ...]`.

### 6. Little Love Notes
- [ ] `notes.letters` — 10 "Open when…" envelopes. Placeholder messages are
      written and usable as-is, but personalizing them (especially the
      "open when you need a smile" inside joke) makes this section land
      much harder.

### 7. Birthday Wishes
- [ ] `wishes.subheading`

### 8. Final Surprise
- [ ] `finale.messageInside`, `finale.messageUnder` — the two lines
      revealed inside the gift box
- [ ] `finale.untieClicksRequired` — how many taps to untie the ribbon

### Bonus / hidden content
- [ ] `secretStars.messages` — 6 tiny messages for the hidden sparkles
      (one each in Welcome, Letter, Memories, Timeline, Notes, Wishes)
- [ ] `scratchCard.hiddenMessage` — revealed by scratching, from the
      "One More Secret…" button on the final scene
- [ ] `puzzle.solvedOrder` — the 6-word phrase for the little swap puzzle
      (also reachable from "One More Secret…")
- [ ] `easterEggs.konamiMessage` — shown when someone enters
      ↑ ↑ ↓ ↓ ← → ← → B A on the keyboard

### Optional: add real fonts
The site ships with elegant system-font fallbacks (Georgia for headings, a
cursive stack for handwritten notes) so it works perfectly with zero
downloads. If you want to upgrade to something like **Playfair Display**
(headings) and **Caveat** or **Dancing Script** (notes/signatures):
1. Download the font files (e.g. from [Google Fonts](https://fonts.google.com/) → "Download family") — this keeps the site offline/dependency-free rather than linking a CDN.
2. Put the `.woff2` files in a new `assets/fonts/` folder.
3. Add `@font-face` rules at the top of `css/base.css` pointing to them.
4. Update the `--font-heading` / `--font-script` variables in the same file.

---

## 6. A few notes on how it behaves

- **Accessibility:** every interactive element is a real, keyboard-focusable
  `<button>`; modals trap focus and close on `Escape`; `prefers-reduced-motion`
  is respected throughout (animations shorten to nearly instant, and the
  cursor sparkle trail / heavy particle loops are skipped entirely).
- **Replay:** the "Replay the Journey" button on the final scene resets and
  replays the entrance animations too, not just the content — including the
  gift box, which re-locks itself.
- **Performance:** ambient/cursor/celebration effects all pause automatically
  when the browser tab isn't visible, and particle counts scale down on
  touch devices.
- **No tracking, no external requests.** The whole thing is self-contained
  static files.

Happy birthday to her. 🎂
