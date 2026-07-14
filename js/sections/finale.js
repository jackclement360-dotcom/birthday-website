/* ============================================================================
   FINALE.JS — Scene 8: The Final Surprise. Tap the ribbon a few times to
   untie it, the lid pops open, and a constellation of stars flies in to
   form a large glowing heart. Fully resets every time this scene is
   (re)entered, so "Replay the Journey" genuinely replays it.
   Text comes from CONFIG.finale — see js/config.js.
============================================================================ */
const SceneFinale = (function () {
  let clicksRemaining = 0;
  let opened = false;
  let finaleParticles = null;
  let constellation = null;

  function init() {
    $("#gift-message-inside").textContent = CONFIG.finale.messageInside;
    $("#gift-message-under").textContent = CONFIG.finale.messageUnder;

    const secretsBtn = $("#finale-secrets-btn");
    secretsBtn.textContent = CONFIG.finale.secretsButtonText;
    secretsBtn.addEventListener("click", () => {
      playChime("click");
      openModal($("#secrets-modal"));
    });

    const replayBtn = $("#finale-replay-btn");
    replayBtn.textContent = CONFIG.finale.replayButtonText;
    replayBtn.addEventListener("click", () => {
      playChime("click");
      Journey.restart();
    });

    $("#gift-ribbon-btn").addEventListener("click", handleGiftClick);

    AppEvents.on("scene:enter", (name) => {
      if (name === "finale") resetGift();
    });
  }

  function resetGift() {
    clicksRemaining = CONFIG.finale.untieClicksRequired;
    opened = false;

    $("#gift-box-wrap").hidden = false;
    $("#gift-reveal").hidden = true;
    $("#gift-prompt").textContent = CONFIG.finale.prompt;

    $("#gift-ribbon-bow").classList.remove("is-wiggle", "is-untied");
    $("#gift-lid").classList.remove("is-open");

    replayAnimation($("#gift-box-wrap"), "play-intro");

    if (constellation) {
      constellation.stop();
      constellation = null;
    }
  }

  function handleGiftClick() {
    if (opened) return;
    clicksRemaining -= 1;
    playChime("click");

    const ribbon = $("#gift-ribbon-bow");

    if (clicksRemaining > 0) {
      replayAnimation(ribbon, "is-wiggle");
      const times = clicksRemaining === 1 ? "1 more time" : clicksRemaining + " more times";
      $("#gift-prompt").textContent = "Tap " + times + "…";
    } else {
      ribbon.classList.remove("is-wiggle");
      ribbon.classList.add("is-untied");
      $("#gift-prompt").textContent = "";
      setTimeout(openLid, 550);
    }
  }

  function openLid() {
    $("#gift-lid").classList.add("is-open");
    playChime("success");

    const btnRect = $("#gift-ribbon-btn").getBoundingClientRect();
    const sceneRect = $("#scene-finale").getBoundingClientRect();
    if (!finaleParticles) finaleParticles = createParticleSystem($("#finale-canvas"));
    else finaleParticles.resize();
    finaleParticles.burstAt(
      btnRect.left - sceneRect.left + btnRect.width / 2,
      btnRect.top - sceneRect.top + btnRect.height / 2
    );

    setTimeout(revealGift, 650);
  }

  function revealGift() {
    opened = true;
    $("#gift-box-wrap").hidden = true;
    $("#gift-reveal").hidden = false;
    constellation = buildConstellationHeart($("#constellation-canvas"));
    constellation.start();
  }

  // ── A ring of stars that flies in from scattered positions and settles
  //    into a glowing heart-shaped constellation. Keeps gently twinkling. ──
  function buildConstellationHeart(canvas) {
    const ctx = canvas.getContext("2d");
    const POINT_COUNT = 46;
    const SETTLE_MS = 1800;
    let width = 0, height = 0, dpr = 1;
    let stars = [];
    let rafId = null;
    let startTime = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function heartPoint(t, scale) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { x: width / 2 + x * scale, y: height / 2 - y * scale + height * 0.04 };
    }

    function buildStars() {
      resize();
      const scale = Math.min(width, height) / 38;
      stars = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        const t = (Math.PI * 2 * i) / POINT_COUNT;
        const target = heartPoint(t, scale);
        stars.push({
          startX: randomBetween(0, width),
          startY: randomBetween(0, height),
          targetX: target.x,
          targetY: target.y,
          twinklePhase: randomBetween(0, Math.PI * 2),
          x: target.x,
          y: target.y,
        });
      }
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function drawSettled(now) {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = "#d9af6a";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#eeaecb";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      stars.forEach((s, i) => (i === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y)));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      stars.forEach((s) => {
        const twinkle = now ? 0.6 + 0.4 * Math.sin(now / 300 + s.twinklePhase) : 1;
        ctx.save();
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff8ec";
        ctx.shadowColor = "#eeaecb";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });
    }

    function tick(now) {
      if (!startTime) startTime = now;
      const progress = clamp((now - startTime) / SETTLE_MS, 0, 1);
      const eased = easeOutCubic(progress);

      stars.forEach((s) => {
        s.x = s.startX + (s.targetX - s.startX) * eased;
        s.y = s.startY + (s.targetY - s.startY) * eased;
      });

      ctx.clearRect(0, 0, width, height);
      if (progress > 0.5) {
        ctx.save();
        ctx.globalAlpha = (progress - 0.5) / 0.5;
        ctx.strokeStyle = "#d9af6a";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#eeaecb";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        stars.forEach((s, i) => (i === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y)));
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      stars.forEach((s) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff8ec";
        ctx.shadowColor = "#eeaecb";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      rafId = requestAnimationFrame(tick);
    }

    function start() {
      buildStars();
      startTime = 0;
      if (AppState.reducedMotion) {
        drawSettled(0);
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    return { start, stop };
  }

  return { init };
})();
