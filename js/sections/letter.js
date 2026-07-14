/* ============================================================================
   LETTER.JS — Scene 2: the love letter, with a paper-unfold entrance and a
   typewriter effect. Text comes from CONFIG.letter — see js/config.js.
============================================================================ */
const SceneLetter = (function () {
  let typingTimer = null;
  let isTyping = false;

  function init() {
    $("#letter-heading").textContent = CONFIG.letter.heading;
    $("#letter-signoff").textContent = CONFIG.letter.signOff + " " + CONFIG.meta.yourName;

    const continueBtn = $("#letter-continue-btn");
    continueBtn.textContent = CONFIG.letter.buttonText;
    continueBtn.addEventListener("click", () => {
      playChime("click");
      Journey.next();
    });

    $("#letter-skip-btn").addEventListener("click", skipTyping);

    AppEvents.on("scene:enter", (name) => {
      if (name === "letter") {
        startLetter();
      } else if (typingTimer) {
        clearTimeout(typingTimer);
        isTyping = false;
      }
    });
  }

  function startLetter() {
    replayAnimation($("#letter-paper"), "play-intro");

    $("#letter-continue-btn").hidden = true;
    $("#letter-signoff").hidden = true;
    $("#letter-skip-btn").hidden = false;

    if (typingTimer) clearTimeout(typingTimer);
    isTyping = true;

    const fullText = CONFIG.letter.paragraphs.join("\n\n");
    const textEl = $("#letter-text");
    textEl.textContent = "";
    typeNextChar(textEl, fullText, 0);
  }

  function typeNextChar(el, fullText, index) {
    if (!isTyping) return; // typing was skipped or the scene changed

    if (index >= fullText.length) {
      finishTyping(el, fullText);
      return;
    }

    const revealed = fullText.slice(0, index + 1);
    el.textContent = revealed;
    el.appendChild(makeCursor());

    const nextChar = fullText.charAt(index);
    let delay = randomBetween(14, 34);
    if (".!?".indexOf(nextChar) !== -1) delay += 260;
    else if (nextChar === ",") delay += 120;
    else if (nextChar === "\n") delay += 180;

    typingTimer = setTimeout(() => typeNextChar(el, fullText, index + 1), delay);
  }

  function makeCursor() {
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.setAttribute("aria-hidden", "true");
    return cursor;
  }

  function finishTyping(el, fullText) {
    isTyping = false;
    el.textContent = fullText;
    $("#letter-signoff").hidden = false;
    $("#letter-continue-btn").hidden = false;
    $("#letter-skip-btn").hidden = true;
    playChime("chime");
  }

  function skipTyping() {
    if (!isTyping) return;
    if (typingTimer) clearTimeout(typingTimer);
    finishTyping($("#letter-text"), CONFIG.letter.paragraphs.join("\n\n"));
  }

  return { init };
})();
