/* ============================================================================
   UTILS.JS — small shared helpers used across the whole site.
   Nothing in here is specific to one scene — see js/sections/*.js for that.
============================================================================ */

// ── Shared runtime state ─────────────────────────────────────────────────
const AppState = {
  soundEnabled: true,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  isTouch: window.matchMedia("(pointer: coarse)").matches,
};

// Keep reducedMotion in sync if the OS-level setting changes mid-session.
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
  AppState.reducedMotion = e.matches;
});

// ── DOM shortcuts ────────────────────────────────────────────────────────
function $(selector, scope) {
  return (scope || document).querySelector(selector);
}
function $$(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

// ── Math / randomness ───────────────────────────────────────────────────
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}
function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

// ── Timing ───────────────────────────────────────────────────────────────
function debounce(fn, wait) {
  let timer;
  const delay = wait || 150;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Focus trapping for modals / overlays ────────────────────────────────
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(container) {
  const focusable = $$(FOCUSABLE_SELECTOR, container);
  const previouslyFocused = document.activeElement;
  if (!focusable.length) return () => {};

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeydown(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKeydown);
  first.focus();

  // Returns a cleanup function that removes the listener and restores focus.
  return function releaseFocus() {
    container.removeEventListener("keydown", handleKeydown);
    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
  };
}

// ── Scroll-reveal via IntersectionObserver ──────────────────────────────
// Adds `.is-visible` to any element passed in once it enters the viewport.
// Used by the Timeline, Reasons, and Notes sections for staggered entrances.
function observeReveal(elements, options) {
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    Object.assign({ threshold: 0.2 }, options)
  );
  elements.forEach((el) => observer.observe(el));
}

// ── Gentle synthesized sound effects (no audio files needed) ───────────
// Tiny WebAudio "chimes" for interactions — card flips, envelopes opening,
// buttons, etc — kept deliberately soft. Respects the sound toggle in the
// top corner of the site (see audio.js), so nothing plays once muted.
let _audioCtx = null;
function getAudioContext() {
  if (!_audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    _audioCtx = new AudioContextClass();
  }
  return _audioCtx;
}

const CHIME_PRESETS = {
  click: { freq: 660, duration: 0.09, gain: 0.05 },
  open: { freq: 523.25, duration: 0.22, gain: 0.06 },
  flip: { freq: 740, duration: 0.14, gain: 0.05 },
  chime: { freq: 880, duration: 0.35, gain: 0.05 },
  success: { freq: 988, duration: 0.4, gain: 0.06 },
};

function playChime(type) {
  if (!AppState.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const preset = CHIME_PRESETS[type] || CHIME_PRESETS.click;
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(preset.freq, now);
  oscillator.frequency.exponentialRampToValueAtTime(preset.freq * 1.15, now + preset.duration);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(preset.gain, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + preset.duration + 0.02);
}

// ── Restart a CSS entrance animation on demand ──────────────────────────
// Scenes are hidden (opacity:0/visibility:hidden) rather than removed from
// the DOM, so any CSS animation applied unconditionally to an element would
// silently play out while nobody can see it, the moment that element is
// created — long before the user actually reaches that scene. Entrance
// animations are therefore written in the CSS to require a trigger class
// (e.g. ".play-intro"), and this helper adds that class fresh each time,
// forcing a reflow in between so the browser treats it as a brand-new
// animation even if the class was already present (this is also what makes
// "Replay the Journey" genuinely replay the animations, not just the text).
function replayAnimation(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth; // eslint-disable-line no-unused-expressions -- forces reflow
  el.classList.add(className);
}

// ── Generic modal open/close (used by gallery, notes, and bonus modals) ──
let _activeModalCleanup = null;

function openModal(modal) {
  if (!modal) return;
  closeAllModals();
  modal.hidden = false;
  _activeModalCleanup = trapFocus(modal);
  document.addEventListener("keydown", _handleModalKeydown);
  AppEvents.emit("modal:open", modal.id);
}

function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.removeEventListener("keydown", _handleModalKeydown);
  if (_activeModalCleanup) {
    _activeModalCleanup();
    _activeModalCleanup = null;
  }
  AppEvents.emit("modal:close", modal.id);
}

function closeAllModals() {
  $$(".modal").forEach((modal) => {
    if (!modal.hidden) closeModal(modal);
  });
}

function _handleModalKeydown(e) {
  if (e.key === "Escape") {
    const openModalEl = $$(".modal").find((m) => !m.hidden);
    if (openModalEl) closeModal(openModalEl);
  }
}

function wireModalCloseTargets() {
  $$("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal(el.closest(".modal")));
  });
}

// ── Minimal event bus, decouples scene modules from the journey controller ──
const AppEvents = (function () {
  const listeners = {};
  return {
    on: function (event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    emit: function (event, payload) {
      (listeners[event] || []).forEach((handler) => handler(payload));
    },
  };
})();
