/* ══════════════════════════════════
   CONFIGURACIÓN DE TEXTOS
   ══════════════════════════════════ */
const TEXTS = {
  kicker:  "solo quería decirte",
  title:   "Disfruto cada momento contigo.",
  note:    "En la ciudad o en el pueblito."
};

/* Palabras de dedicatoria que el 11:11 deja en su camino al subir.
   Cada una aparece donde el 11:11 estuvo, como susurros. */
const TRAIL_WORDS = [
  "siempre",
  "estaré",
  "para ti",
  "en todo momento",
  "♡"
];

/* ── Referencias al DOM ── */
const intro        = document.getElementById("intro");
const wrap         = document.getElementById("wrap");
const kicker       = document.getElementById("kicker");
const msg          = document.getElementById("msg");
const note         = document.getElementById("note");
const actions      = document.getElementById("actions");
const heartSection = document.getElementById("heartSection");
const btnReveal    = document.getElementById("btnReveal");
const canvas       = document.getElementById("stars");
const elevenEl     = document.getElementById("elevenTraveler");

/* ══════════════════════════════════
   TYPEWRITER — Escribe texto como trazos a mano
   Cada letra aparece con un micro-delay variable
   que simula el ritmo natural de escribir a mano.
   Las pausas son más largas en comas y puntos.
   ══════════════════════════════════ */
function typewrite(el, text, speed = 55) {
  return new Promise(resolve => {
    const cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    el.textContent = "";
    el.appendChild(cursorSpan);

    let i = 0;
    function tick() {
      if (i < text.length) {
        const charSpan = document.createElement("span");
        charSpan.textContent = text[i];
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        charSpan.style.transform = "translateY(6px)";
        charSpan.style.transition = "opacity 0.25s ease, transform 0.3s ease";
        if (text[i] === " ") {
          charSpan.style.display = "inline";
          charSpan.style.transform = "none";
          charSpan.style.opacity = "1";
        }
        el.insertBefore(charSpan, cursorSpan);

        requestAnimationFrame(() => {
          charSpan.style.opacity = "1";
          charSpan.style.transform = "translateY(0)";
        });

        const char = text[i];
        i++;

        let delay = speed + (Math.random() * 25 - 12);
        if (char === "," || char === ";") delay += 120;
        if (char === "." || char === "!" || char === "?") delay += 180;

        setTimeout(tick, delay);
      } else {
        setTimeout(() => {
          cursorSpan.classList.add("hidden");
          resolve();
        }, 700);
      }
    }
    tick();
  });
}

/* ══════════════════════════════════
   SECUENCIA PRINCIPAL
   Intro → Avión vuela → Card aparece → Typewriter
   ══════════════════════════════════ */
document.getElementById("btnStart").addEventListener("click", async () => {
  // 1. El avioncito sale volando
  const plane = document.getElementById("paperPlane");
  plane.classList.add("fly-away");

  // 2. Ocultar intro
  await sleep(300);
  intro.classList.add("hidden");

  // 3. Mostrar card
  await sleep(400);
  wrap.classList.add("visible");
  canvas.classList.add("bright");

  // 4. Escribir kicker
  await sleep(500);
  await typewrite(kicker, TEXTS.kicker, 35);

  // 5. Escribir título
  await sleep(300);
  await typewrite(msg, TEXTS.title, 55);
  msg.classList.add("alive");

  // 6. Escribir nota
  await sleep(400);
  await typewrite(note, TEXTS.note, 40);

  // 7. Mostrar botón
  await sleep(500);
  actions.classList.add("visible");
});

/* ══════════════════════════════════
   SORPRESA — Secuencia armonizada:
   1. El corazón grande aparece con "matatita y pollito"
   2. El 11:11 aparece en el corazón y se desvanece
   3. El 11:11 empieza su viaje subiendo
   4. En cada salto deja una palabra de dedicatoria
   5. Al llegar arriba brilla y aparece "te quiero"
   ══════════════════════════════════ */
let sorpresaTriggered = false;

btnReveal.addEventListener("click", () => {
  if (sorpresaTriggered) return; // Solo se puede activar una vez
  sorpresaTriggered = true;
  btnReveal.textContent = "♡";
  btnReveal.style.pointerEvents = "none";
  btnReveal.style.opacity = "0.5";

  // Paso 1: Mostrar corazón grande
  setTimeout(() => {
    heartSection.classList.add("visible");
  }, 200);

  // Paso 2-5: Después de que el corazón está dibujado y el 11:11
  // del corazón se desvanece (~5s), iniciar el viaje
  setTimeout(startElevenJourney, 5500);
});

/* ══════════════════════════════════
   11:11 JOURNEY — Sube dejando palabras de dedicatoria
   En cada salto:
     - El 11:11 aparece en una posición
     - Una palabra de TRAIL_WORDS se queda donde estaba
     - Al llegar arriba, se asienta y aparece "te quiero"
   ══════════════════════════════════ */
function startElevenJourney() {
  const steps = TRAIL_WORDS.length + 1; // 5 palabras + 1 final
  const startY = 72;
  const endY = 4;
  let step = 0;

  function hop() {
    const t = step / (steps - 1);
    const yPercent = startY - (startY - endY) * t;
    const xPercent = 35 + Math.random() * 30;
    const size = 17 + t * 7;

    elevenEl.style.top = yPercent + "vh";
    elevenEl.style.left = xPercent + "%";
    elevenEl.style.fontSize = size + "px";
    elevenEl.style.transform = "translateX(-50%)";

    // Fade in
    elevenEl.style.transition = "opacity 0.5s ease";
    elevenEl.style.opacity = "0";
    requestAnimationFrame(() => {
      elevenEl.style.opacity = String(0.5 + t * 0.5);
    });

    if (step < steps - 1) {
      // Guardar posición para la palabra que dejará
      const wordX = xPercent;
      const wordY = yPercent;
      const wordIndex = step;
      const wordSize = 15 + t * 4;

      setTimeout(() => {
        // Dejar una palabra de dedicatoria donde estaba el 11:11
        spawnTrailWord(TRAIL_WORDS[wordIndex], wordX, wordY, wordSize);

        // Desvanecer 11:11
        elevenEl.style.transition = "opacity 0.5s ease";
        elevenEl.style.opacity = "0";
        step++;
        setTimeout(hop, 900);
      }, 1200);
    } else {
      // Última iteración: centrar arriba y quedarse brillando
      setTimeout(() => {
        elevenEl.style.transition = "all 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
        elevenEl.style.left = "50%";
        elevenEl.style.top = "20px";
        elevenEl.style.opacity = "1";
        setTimeout(() => {
          elevenEl.classList.add("settled");
          // "te quiero" aparece suavemente debajo
          setTimeout(() => {
            document.getElementById("teQuiero").classList.add("visible");
          }, 600);
        }, 1200);
      }, 600);
    }
  }

  hop();
}

/* ── Crea una palabra flotante en la posición indicada ── */
function spawnTrailWord(text, xPercent, yVh, fontSize) {
  const el = document.createElement("span");
  el.className = "trail-word";
  el.textContent = text;
  el.style.left = xPercent + "%";
  el.style.top = yVh + "vh";
  el.style.fontSize = fontSize + "px";
  document.body.appendChild(el);

  // Activar animación
  requestAnimationFrame(() => {
    el.classList.add("show");
  });

  // Limpiar del DOM cuando termine la animación
  el.addEventListener("animationend", () => el.remove());
}

/* ── Utilidad ── */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ══════════════════════════════════
   CANVAS — Constelaciones animadas
   ══════════════════════════════════ */
const ctx = canvas.getContext("2d");
let W, H, dots;

// Menos partículas en mobile para mejor rendimiento
const isMobile = window.innerWidth <= 768;
const DOT_COUNT = isMobile ? 40 : 70;
const MAX_DIST_BASE = isMobile ? 110 : 140;

function resize() {
  W = canvas.width  = window.innerWidth  * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  dots = Array.from({ length: DOT_COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  (Math.random() * 1.2 + 0.4) * devicePixelRatio,
    vx: (Math.random() * 0.18 - 0.09) * devicePixelRatio,
    vy: (Math.random() * 0.18 - 0.09) * devicePixelRatio
  }));
}
window.addEventListener("resize", resize);
resize();

function loop() {
  ctx.clearRect(0, 0, W, H);

  for (const p of dots) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(31,41,55,0.22)";
    ctx.fill();
  }

  const maxDist = MAX_DIST_BASE * devicePixelRatio;
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i], b = dots[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.10;
        ctx.strokeStyle = `rgba(199,162,124,${alpha})`;
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(loop);
}
loop();
