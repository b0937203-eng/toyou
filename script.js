const RUNAWAY = "yes";          // "yes" or "no": which button runs away
const DODGE_SECONDS = 60;       // how long the button runs away

const BUBBLES_AT_START = 15;    // bubbles already on screen when the page opens
const NEW_BUBBLE_EVERY_MS = 500;// a new bubble every X milliseconds (smaller = MORE hearts)
const BUBBLE_MIN_SIZE = 30;     // smallest bubble, in pixels
const BUBBLE_MAX_SIZE = 80;     // biggest bubble, in pixels
const BUBBLE_MIN_SECONDS = 6;   // fastest rise time
const BUBBLE_MAX_SECONDS = 14;  // slowest rise time
const HEARTS = ["💙", "🤍", "🩵", "💙"];  // hearts used inside the bubbles
/* ========================================================== */

const yes  = document.getElementById("yes");
const no   = document.getElementById("no");
const line = document.getElementById("line");

const runner = RUNAWAY === "yes" ? yes : no;
let dodges = 0;
let startTime = null;

const taunts = [
  "Take your time, my love… 🤍", "Oops, too slow! 😜", "Almost! 😂", "Nice try! 🙈",
  "It’s shy today! 😳", "Catch it if you can! 💨", "Okay, okay… one more try 🥺,","Bas ho gaya 😒?"
];

/* ---------- Running-away button ---------- */
function dodge(e) {
  if (startTime === null) startTime = Date.now();

  // After DODGE_SECONDS the button stops running
  if (Date.now() - startTime >= DODGE_SECONDS * 1000) {
    line.textContent = "Okay, I give up… click me 🥰";
    return;
  }
  e.preventDefault();
  dodges++;

  const r = runner.getBoundingClientRect();

  // First time: leave an invisible spacer so the layout doesn't jump
  if (!runner.classList.contains("run")) {
    const spacer = document.createElement("span");
    spacer.style.cssText = "display:inline-block;width:" + r.width + "px;height:" + r.height + "px";
    runner.before(spacer);
    runner.classList.add("run");
    runner.style.left = r.left + "px";
    runner.style.top  = r.top + "px";
  }

  // Jump to a random place inside the screen
  const pad = 12;
  const maxX = window.innerWidth  - r.width  - pad;
  const maxY = window.innerHeight - r.height - pad;
  runner.style.left = Math.max(pad, Math.random() * maxX) + "px";
  runner.style.top  = Math.max(pad, Math.random() * maxY) + "px";

  line.textContent = taunts[Math.min(dodges, taunts.length - 1)];
}

runner.addEventListener("pointerenter", dodge);  // mouse comes near
runner.addEventListener("pointerdown", dodge);   // finger touches

/* ---------- Yes clicked ---------- */
yes.addEventListener("click", () => {
  document.body.classList.add("won");
  runner.classList.remove("run");
  for (let i = 0; i < 40; i++) {
    setTimeout(makeBubble, i * 60);   // burst of bubbles
  }
});

no.addEventListener("click", () => {
  line.textContent = "Wrong button! Try the other one 😏";
});

/* ---------- Heart bubbles ---------- */
function random(min, max) {
  return min + Math.random() * (max - min);
}

function makeBubble(startHigh) {
  const size = random(BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE);
  const seconds = random(BUBBLE_MIN_SECONDS, BUBBLE_MAX_SECONDS);

  const b = document.createElement("div");
  b.className = "bubble";
  b.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  b.style.width = size + "px";
  b.style.height = size + "px";
  b.style.fontSize = size * 0.5 + "px";
  b.style.left = random(0, 100) + "vw";
  b.style.setProperty("--drift", random(-60, 60) + "px");
  b.style.animationDuration = seconds + "s";

  // Bubbles at the start begin partway up the screen
  if (startHigh === true) b.style.animationDelay = "-" + random(0, seconds) + "s";

  document.body.appendChild(b);
  b.addEventListener("animationend", () => b.remove());  // clean up
}

for (let i = 0; i < BUBBLES_AT_START; i++) makeBubble(true);
setInterval(makeBubble, NEW_BUBBLE_EVERY_MS);

/* ---------- Heart under the finger (phones have no cursor) ---------- */
let lastTap = 0;
function tapHeart(e) {
  if (e.pointerType === "mouse") return;
  const now = Date.now();
  if (now - lastTap < 80) return;
  lastTap = now;

  const h = document.createElement("div");
  h.className = "tap";
  h.textContent = "💙";
  h.style.left = e.clientX + "px";
  h.style.top  = e.clientY + "px";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 900);
}
document.addEventListener("pointerdown", tapHeart);
document.addEventListener("pointermove", tapHeart);
