/* ============================================================================
   TIMELINE.JS — Scene 5: Our Story So Far. A vertical timeline that reveals
   each milestone as you scroll past it.
   Text comes from CONFIG.timeline — see js/config.js.
============================================================================ */
const SceneTimeline = (function () {
  let observing = false;

  function init() {
    $("#timeline-heading").textContent = CONFIG.timeline.heading;
    $("#timeline-subheading").textContent = CONFIG.timeline.subheading;

    const continueBtn = $("#timeline-continue-btn");
    continueBtn.textContent = CONFIG.timeline.continueText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    buildTimeline();

    AppEvents.on("scene:enter", (name) => {
      // IntersectionObserver needs the scene to actually be laid out and
      // visible to measure correctly, so it's wired up the first time we
      // arrive here rather than at page load (see replayAnimation() in
      // utils.js for the same underlying issue on other scenes).
      if (name === "timeline" && !observing) {
        observeReveal($$(".timeline-item"));
        observing = true;
      }
    });
  }

  function buildTimeline() {
    const list = $("#timeline-list");
    list.innerHTML = "";

    CONFIG.timeline.milestones.forEach((milestone) => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML =
        '<span class="timeline-icon" aria-hidden="true"></span>' +
        '<div class="timeline-card">' +
          '<p class="timeline-date"></p>' +
          '<h3 class="timeline-title"></h3>' +
          '<p class="timeline-desc"></p>' +
        "</div>";

      $(".timeline-icon", item).textContent = milestone.icon;
      $(".timeline-date", item).textContent = milestone.date;
      $(".timeline-title", item).textContent = milestone.title;
      $(".timeline-desc", item).textContent = milestone.description;

      list.appendChild(item);
    });
  }

  return { init };
})();
