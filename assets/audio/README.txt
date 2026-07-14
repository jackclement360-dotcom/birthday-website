HOW TO ADD BACKGROUND MUSIC
============================

1. Find (or export) an mp3 of "your song" — something that means something
   to the two of you.
2. Rename the file to:  song.mp3
3. Drop it into this folder, so the path is:
      assets/audio/song.mp3
4. Open js/config.js and check the `music` section — the default `src`
   already points here, so you usually don't need to change anything.
   If you use a different filename, update `music.src` to match.
5. Refresh the page. The music button in the top-right corner will now
   play/pause it. Browsers block audio from autoplaying with sound before
   the visitor interacts with the page, so the site never tries to force
   it — the button is the intended way to start it, and it also makes a
   best-effort attempt to start automatically on her very first tap/click.

A ~2–4 minute mp3 works best. Keep the file reasonably small (a few MB)
so it loads quickly — most exported/streamed mp3s at 128–192kbps are fine.

If you skip this step entirely, the site still works perfectly — the
music button just won't have anything to play.
