/* ============================================================================
   REASONS.JS — Scene 4: 20 Reasons I Love You. Cards shuffle into a new
   order each visit and flip to reveal one reason at a time.
   Text comes from CONFIG.reasons — see js/config.js.
============================================================================ */
const SceneReasons = (function () {
  function init() {
    $("#reasons-heading").textContent = CONFIG.reasons.heading;
    $("#reasons-subheading").textContent = CONFIG.reasons.subheading;

    const continueBtn = $("#reasons-continue-btn");
    continueBtn.textContent = CONFIG.reasons.continueText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    buildGrid();

    AppEvents.on("scene:enter", (name) => {
      if (name === "reasons") replayAnimation($("#reasons-grid"), "play-intro");
    });
  }

  function buildGrid() {
    const grid = $("#reasons-grid");
    grid.innerHTML = "";
    const shuffled = shuffle(CONFIG.reasons.list);

    shuffled.forEach((reason, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "reason-card";
      card.style.setProperty("--i", i);
      card.setAttribute("aria-label", "Reason " + (i + 1) + " of " + shuffled.length + " — tap to reveal");

      card.innerHTML =
        '<span class="reason-card-inner">' +
          '<span class="reason-card-face reason-card-front">' +
            '<svg class="reason-heart-icon" viewBox="0 0 32 29" aria-hidden="true" width="26" height="24"><use href="#icon-heart"></use></svg>' +
            '<span class="reason-index"></span>' +
          "</span>" +
          '<span class="reason-card-face reason-card-back">' +
            '<span class="reason-text"></span>' +
          "</span>" +
        "</span>";

      $(".reason-index", card).textContent = "#" + (i + 1);
      $(".reason-text", card).textContent = reason;

      card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
        playChime("flip");
      });

      grid.appendChild(card);
    });
  }

  return { init };
})();
