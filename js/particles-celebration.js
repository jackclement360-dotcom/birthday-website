/* ============================================================================
   PARTICLES-CELEBRATION.JS — reusable canvas particle engine: confetti,
   fireworks, and rising hearts. `createParticleSystem(canvas)` is a factory,
   not a singleton — the Birthday Wishes scene and the Final Surprise scene
   each create their OWN instance bound to their own <canvas>, so the two
   celebrations never share state or fight over the same animation loop.
   Balloons and paper lanterns are simple DOM/CSS elements instead of canvas
   particles (see sections.css .balloon/.lantern) — they're simple shapes
   that look better with real gradients and box-shadow glow than hand-drawn
   canvas paths, and there are never more than a couple on screen at once.
============================================================================ */

const CELEBRATION_COLORS = ["#eeaecb", "#d9789f", "#dcd0f5", "#d9af6a", "#f7d9e3", "#ffffff"];

function createParticleSystem(canvasEl) {
  const ctx = canvasEl.getContext("2d");
  let width = 0, height = 0, dpr = 1;
  let confetti = [], fireworkShells = [], sparks = [], hearts = [];
  let rafId = null, running = false, lastTime = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvasEl.clientWidth || window.innerWidth;
    height = canvasEl.clientHeight || window.innerHeight;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", debounce(resize, 200));

  function spawnConfettiBurst(count) {
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: randomBetween(0, width),
        y: -20 - randomBetween(0, height * 0.3),
        w: randomBetween(5, 9),
        h: randomBetween(8, 14),
        vy: randomBetween(60, 140),
        vx: randomBetween(-40, 40),
        rotation: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-4, 4),
        color: CELEBRATION_COLORS[randomInt(0, CELEBRATION_COLORS.length - 1)],
        life: 0,
        maxLife: randomBetween(3.5, 6),
      });
    }
    start();
  }

  function launchFirework() {
    fireworkShells.push({
      x: randomBetween(width * 0.15, width * 0.85),
      y: height,
      targetY: randomBetween(height * 0.2, height * 0.5),
      vy: -randomBetween(260, 340),
      color: CELEBRATION_COLORS[randomInt(0, CELEBRATION_COLORS.length - 1)],
    });
    playChime("chime");
    start();
  }

  function explode(shell) {
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = randomBetween(60, 160);
      sparks.push({
        x: shell.x,
        y: shell.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: shell.color,
        life: 0,
        maxLife: randomBetween(0.7, 1.2),
        size: randomBetween(2, 3.5),
      });
    }
  }

  function spawnHeart() {
    hearts.push({
      x: randomBetween(0, width),
      y: height + 20,
      size: randomBetween(10, 20),
      vy: randomBetween(30, 60),
      sway: randomBetween(15, 40),
      swaySpeed: randomBetween(0.4, 1),
      phase: randomBetween(0, Math.PI * 2),
      opacity: randomBetween(0.5, 0.9),
      life: 0,
      maxLife: randomBetween(4, 7),
      color: CELEBRATION_COLORS[randomInt(0, CELEBRATION_COLORS.length - 1)],
    });
    start();
  }

  // One quick radial burst at a point — used by the finale gift box.
  function burstAt(x, y) {
    const count = 26;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = randomBetween(50, 140);
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: CELEBRATION_COLORS[randomInt(0, CELEBRATION_COLORS.length - 1)],
        life: 0,
        maxLife: randomBetween(0.6, 1),
        size: randomBetween(2, 3.5),
      });
    }
    start();
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function clear() {
    confetti = [];
    fireworkShells = [];
    sparks = [];
    hearts = [];
    ctx.clearRect(0, 0, width, height);
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    confetti.forEach((c) => {
      c.life += dt;
      c.vy += 60 * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += c.spin * dt;
    });
    confetti = confetti.filter((c) => c.life < c.maxLife && c.y < height + 40);

    fireworkShells.forEach((s) => { s.y += s.vy * dt; });
    fireworkShells.filter((s) => s.y <= s.targetY).forEach(explode);
    fireworkShells = fireworkShells.filter((s) => s.y > s.targetY);

    sparks.forEach((p) => {
      p.life += dt;
      p.vy += 140 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    });
    sparks = sparks.filter((p) => p.life < p.maxLife);

    hearts.forEach((h) => {
      h.life += dt;
      h.phase += h.swaySpeed * dt;
      h.y -= h.vy * dt;
    });
    hearts = hearts.filter((h) => h.life < h.maxLife && h.y > -30);

    draw();

    // Self-managing: once every array drains and nothing new is being
    // spawned, the loop stops itself rather than running forever at idle.
    if (!confetti.length && !fireworkShells.length && !sparks.length && !hearts.length) {
      stop();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    confetti.forEach((c) => {
      ctx.save();
      ctx.globalAlpha = clamp(1 - c.life / c.maxLife, 0, 1);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    sparks.forEach((p) => {
      const t = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = clamp(1 - t, 0, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });

    fireworkShells.forEach((s) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.restore();
    });

    hearts.forEach((h) => {
      const x = h.x + Math.sin(h.phase) * h.sway;
      const t = h.life / h.maxLife;
      const fade = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
      ctx.save();
      ctx.globalAlpha = h.opacity * clamp(fade, 0, 1);
      ctx.translate(x, h.y);
      drawHeartShape(ctx, h.size, h.color);
      ctx.restore();
    });
  }

  return { start, stop, clear, resize, spawnConfettiBurst, launchFirework, spawnHeart, burstAt };
}
