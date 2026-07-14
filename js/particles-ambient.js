/* ============================================================================
   PARTICLES-AMBIENT.JS — the gentle background layer that runs the whole
   time: floating hearts/petals/sparkles on #ambient-canvas, and the cursor
   sparkle trail on #cursor-canvas. Both pause when the tab isn't visible,
   and both fall back to something calmer when reduced-motion is requested.
============================================================================ */

const AMBIENT_COLORS = ["#eeaecb", "#dcd0f5", "#f0d9a3", "#f7d9e3", "#d9789f"];

// ── Shared tiny shape-drawing helpers (also used by particles-celebration.js) ──
function drawHeartShape(ctx, size, color) {
  const s = size / 16;
  ctx.beginPath();
  ctx.moveTo(0, 4 * s);
  ctx.bezierCurveTo(0, 2 * s, -2 * s, 0, -6 * s, 0);
  ctx.bezierCurveTo(-11 * s, 0, -11 * s, 6 * s, -11 * s, 6 * s);
  ctx.bezierCurveTo(-11 * s, 10 * s, -7 * s, 13.5 * s, 0, 18 * s);
  ctx.bezierCurveTo(7 * s, 13.5 * s, 11 * s, 10 * s, 11 * s, 6 * s);
  ctx.bezierCurveTo(11 * s, 6 * s, 11 * s, 0, 6 * s, 0);
  ctx.bezierCurveTo(2 * s, 0, 0, 2 * s, 0, 4 * s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPetalShape(ctx, size, color) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.5, size * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSparkleShape(ctx, size, color) {
  const s = size * 0.6;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.15, -s * 0.15, s, 0);
  ctx.quadraticCurveTo(s * 0.15, s * 0.15, 0, s);
  ctx.quadraticCurveTo(-s * 0.15, s * 0.15, -s, 0);
  ctx.quadraticCurveTo(-s * 0.15, -s * 0.15, 0, -s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawShapeOfType(ctx, type, size, color) {
  if (type === "heart") drawHeartShape(ctx, size, color);
  else if (type === "petal") drawPetalShape(ctx, size, color);
  else drawSparkleShape(ctx, size, color);
}

// ── Ambient background particles (hearts / petals / sparkles, always on) ──
const AmbientParticles = (function () {
  let canvas, ctx, width, height, dpr;
  let particles = [];
  let rafId = null;
  let running = false;
  let lastTime = 0;
  const TYPES = ["heart", "petal", "sparkle"];

  function init() {
    canvas = $("#ambient-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", debounce(resize, 200));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (!AppState.reducedMotion) start();
    });

    if (AppState.reducedMotion) {
      seed(10);
      drawFrame();
    } else {
      seed(AppState.isTouch ? 14 : 24);
      start();
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed(count) {
    particles = Array.from({ length: count }, createParticle);
  }

  function createParticle() {
    return {
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      size: randomBetween(8, 18),
      vy: randomBetween(6, 16),
      sway: randomBetween(15, 45),
      swaySpeed: randomBetween(0.3, 0.9),
      phase: randomBetween(0, Math.PI * 2),
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-0.3, 0.3),
      opacity: randomBetween(0.16, 0.42),
      color: AMBIENT_COLORS[randomInt(0, AMBIENT_COLORS.length - 1)],
      type: TYPES[randomInt(0, TYPES.length - 1)],
    };
  }

  function start() {
    if (running || AppState.reducedMotion) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    particles.forEach((p) => {
      p.y -= p.vy * dt;
      p.phase += p.swaySpeed * dt;
      p.rotation += p.spin * dt;
      if (p.y < -30) {
        p.y = height + 30;
        p.x = randomBetween(0, width);
      }
    });

    drawFrame();
    rafId = requestAnimationFrame(tick);
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      const x = p.x + Math.sin(p.phase) * p.sway;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(x, p.y);
      ctx.rotate(p.rotation);
      drawShapeOfType(ctx, p.type, p.size, p.color);
      ctx.restore();
    });
  }

  return { init };
})();

// ── Cursor sparkle trail (desktop + reduced-motion-off only) ──────────────
const CursorSparkles = (function () {
  let canvas, ctx, width, height, dpr;
  let sparks = [];
  let rafId = null;
  let lastSpawn = 0;
  let lastTime = 0;

  function init() {
    if (AppState.isTouch || AppState.reducedMotion) return;
    canvas = $("#cursor-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", debounce(resize, 200));
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    });
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function handlePointerMove(e) {
    const now = performance.now();
    if (now - lastSpawn < 45) return;
    lastSpawn = now;
    sparks.push({
      x: e.clientX,
      y: e.clientY,
      size: randomBetween(3, 6),
      life: 0,
      maxLife: randomBetween(0.5, 0.85),
      vy: randomBetween(-34, -12),
      vx: randomBetween(-10, 10),
    });
    if (sparks.length > 40) sparks.shift();
  }

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    sparks.forEach((s) => {
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    });
    sparks = sparks.filter((s) => s.life < s.maxLife);

    ctx.clearRect(0, 0, width, height);
    sparks.forEach((s) => {
      const t = s.life / s.maxLife;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.translate(s.x, s.y);
      ctx.rotate(t * 2.4);
      drawSparkleShape(ctx, s.size * (1 - t * 0.4), "#d9af6a");
      ctx.restore();
    });

    rafId = requestAnimationFrame(tick);
  }

  return { init };
})();
