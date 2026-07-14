/* ============================================================================
   CONFIG.JS — YOUR ONE-STOP EDITING FILE
   ----------------------------------------------------------------------------
   Every word, date, photo path, and name you'll want to personalize lives
   in this single file. Look for "✏️ EDIT" comments — those mark the lines
   to change. You should not need to open any other .js or .css file just
   to make this feel personal.

   After editing, save the file and refresh the page (or hard-refresh with
   Cmd+Shift+R / Ctrl+Shift+R if your browser is caching the old version).

   See README.md → "Personalization Checklist" for the full replacement list.
============================================================================ */

const CONFIG = {

  // ── SITE META ─────────────────────────────────────────────────────────
  meta: {
    // ✏️ EDIT: shows in the browser tab
    pageTitle: "Happy Birthday, My Love",
    // ✏️ EDIT: her name — used in a few places around the site
    herName: "[Her Name]",
    // ✏️ EDIT: your name — used as the signature on the letter
    yourName: "[Your Name]",
  },

  // ── LOADING SCREEN ────────────────────────────────────────────────────
  loading: {
    // ✏️ EDIT: short message shown while the page "wraps the gift"
    message: "Wrapping something special…",
  },

  // ── COUNTDOWN (optional scene shown before Welcome) ──────────────────
  countdown: {
    // ✏️ EDIT: set to false to skip straight to the Welcome screen always
    enabled: true,
    // ✏️ EDIT: her birthday as "YYYY-MM-DDTHH:mm:ss" (24h clock, local time)
    // If this moment has already passed when the page loads, the countdown
    // is skipped automatically and Welcome shows right away — so it's safe
    // to leave enabled: true even if you're sending this on the day itself.
    targetDate: "2026-08-01T00:00:00",
    heading: "Something is on its way…",
    subheading: "Counting down to your day",
    // ✏️ EDIT: shown once the countdown hits zero, just before it transforms
    arrivedMessage: "It's here! 🎉",
  },

  // ── BACKGROUND MUSIC ──────────────────────────────────────────────────
  music: {
    // ✏️ EDIT: put an mp3 at this path — see assets/audio/README.txt
    src: "assets/audio/song.mp3",
    // ✏️ EDIT: shown in the music button's tooltip
    label: "Our Song — Artist Name",
  },

  // ── 1. WELCOME ────────────────────────────────────────────────────────
  welcome: {
    // ✏️ EDIT: the big first line she sees
    title: "Happy Birthday, My Love ❤️",
    subtitle: "I made something special just for you.",
    buttonText: "Open Your Surprise",
  },

  // ── 2. LOVE LETTER ────────────────────────────────────────────────────
  letter: {
    heading: "A Little Letter For You",
    // ✏️ EDIT: each entry is one paragraph, typed out in order.
    // Add or remove paragraphs freely — the typewriter effect handles any length.
    paragraphs: [
      /* ✏️ EDIT paragraph 1 */
      "My love, before anything else today, I need you to stop scrolling and just read this slowly.",
      /* ✏️ EDIT paragraph 2 — how you met, or the moment you knew */
      "[Placeholder — replace with a memory of how you two met, or what you were feeling the first time you knew she was special.]",
      /* ✏️ EDIT paragraph 3 — something specific you admire about her */
      "[Placeholder — replace with something you admire about her. Be specific and real, not generic — the small things count more than the big ones.]",
      /* ✏️ EDIT paragraph 4 — hopes for the year ahead */
      "[Placeholder — replace with what you're hoping for in the year ahead, together.]",
      /* ✏️ EDIT paragraph 5 — closing line */
      "Happy birthday. I love you more than this little website could ever hold.",
    ],
    signOff: "Forever yours,",
    buttonText: "Keep Going",
  },

  // ── 3. OUR MEMORIES (photo gallery) ──────────────────────────────────
  gallery: {
    heading: "Our Memories",
    subheading: "Click a photo to flip it over",
    continueText: "Continue the Journey",
    // ✏️ EDIT: replace `image` with your own photo at the same path
    // (or change the path entirely), and edit title/caption/alt for each.
    // Add or remove entries freely — the gallery grid adjusts automatically.
    memories: [
      {
        id: "memory-1",
        title: "The Day We Met",
        image: "assets/images/memory-1.svg",
        alt: "Placeholder photo — replace with a real photo of the day you met",
        caption: "[Placeholder caption — where were we, what were we doing?]",
      },
      {
        id: "memory-2",
        title: "Our First Date",
        image: "assets/images/memory-2.svg",
        alt: "Placeholder photo — replace with a real photo from your first date",
        caption: "[Placeholder caption — add a detail only the two of you would remember]",
      },
      {
        id: "memory-3",
        title: "That Road Trip",
        image: "assets/images/memory-3.svg",
        alt: "Placeholder photo — replace with a real travel photo",
        caption: "[Placeholder caption]",
      },
      {
        id: "memory-4",
        title: "Silly Faces",
        image: "assets/images/memory-4.svg",
        alt: "Placeholder photo — replace with a goofy candid photo",
        caption: "[Placeholder caption]",
      },
      {
        id: "memory-5",
        title: "A Quiet Night In",
        image: "assets/images/memory-5.svg",
        alt: "Placeholder photo — replace with a cozy, everyday photo",
        caption: "[Placeholder caption]",
      },
      {
        id: "memory-6",
        title: "Just Us",
        image: "assets/images/memory-6.svg",
        alt: "Placeholder photo — replace with your favorite photo of the two of you",
        caption: "[Placeholder caption]",
      },
    ],
  },

  // ── 4. REASONS I LOVE YOU (20 cards) ─────────────────────────────────
  reasons: {
    heading: "20 Reasons I Love You",
    subheading: "Tap a card to reveal it",
    continueText: "Keep Going",
    // ✏️ EDIT: swap any/all of these 20 — keep it at 20 or change the
    // number freely, the grid and shuffle both adapt to the array length.
    list: [
      "The way you laugh at your own jokes before you even finish telling them.",
      "How you remember tiny details I mentioned once and never thought about again.",
      "Your ridiculous morning hair that you refuse to let me photograph.",
      "The way you say my name right before you tell me something exciting.",
      "How fiercely you show up for the people you love.",
      "[Placeholder — an inside joke only the two of you would get.]",
      "The way you dance in the kitchen when you think no one's watching.",
      "How you make even an ordinary Tuesday feel like an adventure.",
      "Your endless curiosity — you ask \"why\" about absolutely everything.",
      "The way you hum without realizing it when you're happy.",
      "How you always know exactly what to say when I'm having a bad day.",
      "Your stubbornness — even when it drives me a little crazy.",
      "The way you save the last bite for me without even being asked.",
      "How your whole face changes when you talk about something you love.",
      "The way you make friends with literally everyone, everywhere, always.",
      "How safe it feels to just sit next to you in silence.",
      "Your handwriting — messy and perfect at the same time.",
      "The way you say \"we\" instead of \"I\" when you talk about the future.",
      "How you turn my bad days into inside jokes instead of arguments.",
      "Simply put — you. All of you, every version I've met so far.",
    ],
  },

  // ── 5. TIMELINE ───────────────────────────────────────────────────────
  timeline: {
    heading: "Our Story So Far",
    subheading: "Every chapter, so far",
    continueText: "Continue",
    // ✏️ EDIT: dates, titles, descriptions, and icons (any emoji works).
    // Add or remove milestones freely.
    milestones: [
      {
        date: "[Month Year]",
        icon: "✨",
        title: "The Day We Met",
        description: "[Placeholder — where were you, what happened, how did it feel?]",
      },
      {
        date: "[Month Year]",
        icon: "☕",
        title: "Our First Date",
        description: "[Placeholder — set the scene. What did you talk about?]",
      },
      {
        date: "[Month Year]",
        icon: "💌",
        title: "First \"I Love You\"",
        description: "[Placeholder — where were you when it was said?]",
      },
      {
        date: "[Month Year]",
        icon: "✈️",
        title: "First Trip Together",
        description: "[Placeholder — where did you go, what do you remember most?]",
      },
      {
        date: "[Month Year]",
        icon: "🏡",
        title: "A Big Step",
        description: "[Placeholder — moving in together, meeting family, anything that mattered.]",
      },
      {
        date: "Today",
        icon: "❤️",
        title: "Right Now",
        description: "[Placeholder — where you are now, and where you're headed together.]",
      },
    ],
  },

  // ── 6. LITTLE LOVE NOTES ("Open when...") ────────────────────────────
  notes: {
    heading: "Little Love Notes",
    subheading: "Ten envelopes. Open whichever one calls to you.",
    continueText: "Continue",
    // ✏️ EDIT: swap any label/message. Keep it at 10 or change the count —
    // the envelopes lay out automatically either way.
    letters: [
      {
        label: "Open when you're missing me",
        message: "[Placeholder] Wherever you are right now, some part of me is thinking about you. That's not poetic exaggeration — it's just true.",
      },
      {
        label: "Open when you need a smile",
        message: "[Placeholder] Remember the time we [inside joke placeholder]? I still laugh thinking about it. You're welcome.",
      },
      {
        label: "Open when you're stressed",
        message: "[Placeholder] Breathe. Whatever it is, it's smaller than it feels right now, and you've gotten through harder. I've got you.",
      },
      {
        label: "Open when you can't sleep",
        message: "[Placeholder] Count sheep, or count the reasons I love you — either list should do the trick eventually.",
      },
      {
        label: "Open when you doubt yourself",
        message: "[Placeholder] You are so much more capable than the voice in your head gives you credit for. I've watched you prove it, over and over.",
      },
      {
        label: "Open when you want a reminder you're loved",
        message: "[Placeholder] This is your reminder. Fully, completely, on your good days and your bad ones.",
      },
      {
        label: "Open when you've had a hard day",
        message: "[Placeholder] Come here. Let the day end. Tomorrow gets a clean slate.",
      },
      {
        label: "Open when you feel like celebrating",
        message: "[Placeholder] Then celebrate! I'll be right here cheering, probably embarrassingly loud.",
      },
      {
        label: "Open on a random Tuesday",
        message: "[Placeholder] No reason. Just wanted today to have a little more you in it.",
      },
      {
        label: "Open whenever — no reason needed",
        message: "[Placeholder] Some things don't need an occasion. I love you is one of them.",
      },
    ],
  },

  // ── 7. BIRTHDAY WISHES ────────────────────────────────────────────────
  wishes: {
    heading: "Happy Birthday!",
    subheading: "[Placeholder — one more sentence of birthday wishes before the finale]",
    buttonText: "One Last Thing…",
  },

  // ── 8. FINAL SURPRISE (gift box) ─────────────────────────────────────
  finale: {
    prompt: "Tap the ribbon to untie it",
    // ✏️ EDIT: how many taps it takes to untie the ribbon before the lid opens
    untieClicksRequired: 3,
    messageInside: "I love you more than words can ever say.",
    messageUnder: "Happy Birthday ❤️",
    replayButtonText: "Replay the Journey",
    secretsButtonText: "✨ One More Secret…",
  },

  // ── SECRET STARS (hidden across the site — bonus easter egg) ────────
  secretStars: {
    // ✏️ EDIT: one tiny message per star. Add/remove freely — extra stars
    // beyond this list just won't be shown.
    messages: [
      "You found a secret ✨ I love your curiosity.",
      "Psst — I love you.",
      "This one's just for smiling at nothing, like you're doing now.",
      "You have very good taste in birthday websites.",
      "Okay but seriously, happy birthday.",
      "Last star! You're worth searching for. Always.",
    ],
  },

  // ── BONUS: SCRATCH CARD ───────────────────────────────────────────────
  scratchCard: {
    label: "Scratch here",
    // ✏️ EDIT: the message revealed underneath the scratch coating
    hiddenMessage: "[Placeholder — a message just for her eyes, revealed by scratching]",
  },

  // ── BONUS: SWAP PUZZLE ────────────────────────────────────────────────
  puzzle: {
    instructions: "Tap two tiles to swap them. Put the words in order.",
    // ✏️ EDIT: the solved order reads left-to-right, top-to-bottom as a
    // short sentence. Keep it short — 6 words fits the grid best.
    solvedOrder: ["I", "LOVE", "YOU", "MORE", "EVERY", "DAY"],
    solvedMessage: "You solved it. And yes — I mean every word.",
  },

  // ── EASTER EGGS ────────────────────────────────────────────────────────
  easterEggs: {
    // ✏️ EDIT: shown when the Konami code is entered
    // (↑ ↑ ↓ ↓ ← → ← → B A)
    konamiMessage: "You found the secret code! Here's a little extra love. ❤️",
  },
};
