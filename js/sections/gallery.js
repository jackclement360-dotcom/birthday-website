/* ============================================================================
   GALLERY.JS — Scene 3: Our Memories. Polaroid-style cards that flip on
   click, plus a "view larger" button that opens the full-size modal.
   Photos/titles/captions come from CONFIG.gallery — see js/config.js.
============================================================================ */
const SceneGallery = (function () {
  function init() {
    $("#gallery-heading").textContent = CONFIG.gallery.heading;
    $("#gallery-subheading").textContent = CONFIG.gallery.subheading;

    const continueBtn = $("#gallery-continue-btn");
    continueBtn.textContent = CONFIG.gallery.continueText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    buildGrid();

    AppEvents.on("scene:enter", (name) => {
      if (name === "gallery") replayAnimation($("#gallery-grid"), "play-intro");
    });
  }

  function buildGrid() {
    const grid = $("#gallery-grid");
    grid.innerHTML = "";

    CONFIG.gallery.memories.forEach((memory, i) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.style.setProperty("--i", i);

      // Two SIBLING buttons (flip + view-larger) — never nest a <button>
      // inside another <button>, browsers will mangle the markup.
      card.innerHTML =
        '<button type="button" class="memory-card-flip-btn">' +
          '<span class="memory-card-inner">' +
            '<span class="memory-card-face memory-card-front">' +
              '<img class="memory-img" alt="" loading="lazy">' +
              '<span class="memory-title"></span>' +
            "</span>" +
            '<span class="memory-card-face memory-card-back">' +
              '<span class="memory-caption"></span>' +
              '<span class="memory-view-hint">Tap 🔍 to view larger</span>' +
            "</span>" +
          "</span>" +
        "</button>" +
        '<button type="button" class="memory-view-btn">🔍</button>';

      const flipBtn = $(".memory-card-flip-btn", card);
      flipBtn.setAttribute("aria-label", memory.title + " — tap to flip and read the caption");
      $(".memory-img", card).src = memory.image;
      $(".memory-title", card).textContent = memory.title;
      $(".memory-caption", card).textContent = memory.caption;

      const viewBtn = $(".memory-view-btn", card);
      viewBtn.setAttribute("aria-label", "View " + memory.title + " larger");

      flipBtn.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
        playChime("flip");
      });
      viewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openMemoryModal(memory);
      });

      grid.appendChild(card);
    });
  }

  function openMemoryModal(memory) {
    const img = $("#memory-modal-image");
    img.src = memory.image;
    img.alt = memory.alt || memory.title;
    $("#memory-modal-title").textContent = memory.title;
    $("#memory-modal-caption").textContent = memory.caption;
    playChime("open");
    openModal($("#memory-modal"));
  }

  return { init };
})();
