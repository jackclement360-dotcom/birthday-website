/* ============================================================================
   WELCOME.JS — Scene 1: the animated entrance.
   Text comes from CONFIG.welcome — see js/config.js to edit it.
============================================================================ */
const SceneWelcome = (function () {
  function init() {
    $("#welcome-title").textContent = CONFIG.welcome.title;
    $("#welcome-subtitle").textContent = CONFIG.welcome.subtitle;

    const btn = $("#welcome-btn");
    btn.textContent = CONFIG.welcome.buttonText;
    btn.addEventListener("click", () => {
      playChime("open");
      Journey.next();
    });

    // Replays the entrance animation every time this scene is (re)entered,
    // including on "Replay the Journey" — see replayAnimation() in utils.js.
    AppEvents.on("scene:enter", (name) => {
      if (name === "welcome") replayAnimation($("#scene-welcome"), "play-intro");
    });
  }

  return { init };
})();
