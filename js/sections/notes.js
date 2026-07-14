/* ============================================================================
   NOTES.JS — Scene 6: Little Love Notes. Floating "Open when..." envelopes
   that open a handwritten-style note in a modal.
   Text comes from CONFIG.notes — see js/config.js.
============================================================================ */
const SceneNotes = (function () {
  function init() {
    $("#notes-heading").textContent = CONFIG.notes.heading;
    $("#notes-subheading").textContent = CONFIG.notes.subheading;

    const continueBtn = $("#notes-continue-btn");
    continueBtn.textContent = CONFIG.notes.continueText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    buildEnvelopes();
  }

  function buildEnvelopes() {
    const grid = $("#envelopes-grid");
    grid.innerHTML = "";

    CONFIG.notes.letters.forEach((letter, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "envelope-card";
      card.style.setProperty("--i", i);
      card.innerHTML = '<span class="envelope" aria-hidden="true"></span><span class="envelope-label"></span>';

      $(".envelope-label", card).textContent = letter.label;
      card.setAttribute("aria-label", "Open the note: " + letter.label);

      card.addEventListener("click", () => {
        card.classList.add("is-clicked");
        setTimeout(() => card.classList.remove("is-clicked"), 450);
        openNoteModal(letter);
      });

      grid.appendChild(card);
    });
  }

  function openNoteModal(letter) {
    $("#note-modal-label").textContent = letter.label;
    $("#note-modal-message").textContent = letter.message;
    playChime("open");
    openModal($("#note-modal"));
  }

  return { init };
})();
