/* ============================================================================
   AUDIO.JS — background music + the master sound toggle.
   Browsers block autoplay of audio with sound until the user interacts with
   the page, so this never tries to play on load. Instead: the very first tap
   anywhere on the page attempts a graceful auto-start (which will usually
   land right on the "Open Your Surprise" click), and the button in the top
   corner is always available as an explicit play/pause control.
============================================================================ */

const AudioController = (function () {
  let musicEl;
  let toggleBtn;
  let hasAttemptedAutoStart = false;

  function init() {
    musicEl = $("#bg-music");
    toggleBtn = $("#sound-toggle");
    if (!musicEl || !toggleBtn) return;

    if (CONFIG.music && CONFIG.music.src) {
      musicEl.src = CONFIG.music.src;
      musicEl.volume = 0.55;
    }
    toggleBtn.title = "Music: " + ((CONFIG.music && CONFIG.music.label) || "toggle sound");

    // If there's no music file yet, fail quietly rather than looking broken.
    musicEl.addEventListener("error", () => {
      toggleBtn.title = "Add a song at assets/audio/ — see config.js";
    });

    toggleBtn.addEventListener("click", handleToggleClick);
    document.addEventListener("pointerdown", attemptAutoStartOnce, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) musicEl.pause();
      else if (AppState.soundEnabled) startMusic();
    });
  }

  function attemptAutoStartOnce() {
    if (hasAttemptedAutoStart || !AppState.soundEnabled) return;
    hasAttemptedAutoStart = true;
    startMusic();
  }

  function startMusic() {
    if (!musicEl || !musicEl.getAttribute("src")) return;
    const playPromise = musicEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked, or the file isn't there yet — the toggle button
        // still works as an explicit play control, so this is not fatal.
      });
    }
  }

  function stopMusic() {
    if (musicEl) musicEl.pause();
  }

  function handleToggleClick() {
    AppState.soundEnabled = !AppState.soundEnabled;
    toggleBtn.setAttribute("aria-pressed", String(AppState.soundEnabled));
    if (AppState.soundEnabled) {
      hasAttemptedAutoStart = true;
      startMusic();
      playChime("click");
    } else {
      stopMusic();
    }
  }

  return { init };
})();
