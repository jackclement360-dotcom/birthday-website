/* ============================================================================
   WISHES.JS — Scene 7: Birthday Wishes. Fireworks, confetti, rising hearts,
   and balloons/lanterns — a short celebratory show that starts the moment
   this scene is entered and stops cleanly the moment it's left.
   Text comes from CONFIG.wishes — see js/config.js.
============================================================================ */
const SceneWishes = (function () {
  let system = null;
  let fireworkInterval = null;
  let heartInterval = null;
  let floaterInterval = null;

  function init() {
    $("#wishes-heading").textContent = CONFIG.wishes.heading;
    $("#wishes-subheading").textContent = CONFIG.wishes.subheading;

    const continueBtn = $("#wishes-continue-btn");
    continueBtn.textContent = CONFIG.wishes.buttonText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    AppEvents.on("scene:enter", (name) => {
      if (name === "wishes") startShow();
      else stopShow();
    });
  }

  function startShow() {
    const canvas = $("#wishes-canvas");
    if (!system) system = createParticleSystem(canvas);
    else system.resize();

    system.clear();
    system.spawnConfettiBurst(AppState.reducedMotion ? 40 : 120);

    if (!AppState.reducedMotion) {
      // Open with a couple of immediate fireworks so the sky is never empty,
      // then keep launching on a loose rhythm.
      system.launchFirework();
      setTimeout(() => system.launchFirework(), 450);
      fireworkInterval = setInterval(() => system.launchFirework(), 1300);
      heartInterval = setInterval(() => system.spawnHeart(), 350);
      system.spawnFloater();
      floaterInterval = setInterval(() => system.spawnFloater(), 1400);
    }
  }

  function stopShow() {
    if (system) {
      system.stop();
      system.clear();
    }
    if (fireworkInterval) clearInterval(fireworkInterval);
    if (heartInterval) clearInterval(heartInterval);
    if (floaterInterval) clearInterval(floaterInterval);
    fireworkInterval = null;
    heartInterval = null;
    floaterInterval = null;
  }

  return { init };
})();
