/* ══════════════════════════════════
   CONFIGURACIÓN DE TEXTOS
   ══════════════════════════════════ */
const TEXTS = {
  kicker:  "solo quería decirte",
  title:   "Me gusta compartir la vida contigo.",
  note:    "Siempre estaré para ti en todo momento."
};

/* ── Referencias al DOM ── */
const intro        = document.getElementById("intro");
const wrap         = document.getElementById("wrap");
const kicker       = document.getElementById("kicker");
const msg          = document.getElementById("msg");
const note         = document.getElementById("note");
const actions      = document.getElementById("actions");
const heartSection = document.getElementById("heartSection");
const btnReveal    = document.getElementById("btnReveal");
const reveal       = document.getElementById("reveal");
const canvas       = document.getElementById("stars");

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
        // Crear un span por cada letra para poder animarla individualmente
        const charSpan = document.createElement("span");
        charSpan.textContent = text[i];
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        charSpan.style.transform = "translateY(6px)";
        charSpan.style.transition = "opacity 0.25s ease, transform 0.3s ease";
        // Espacios no necesitan inline-block (rompe el wrap)
        if (text[i] === " ") {
          charSpan.style.display = "inline";
          charSpan.style.transform = "none";
          charSpan.style.opacity = "1";
        }
        el.insertBefore(charSpan, cursorSpan);

        // Trigger reflow y animar entrada
        requestAnimationFrame(() => {
          charSpan.style.opacity = "1";
          charSpan.style.transform = "translateY(0)";
        });

        const char = text[i];
        i++;

        // Pausas variables: más lenta en puntuación, jitter humano
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
   ══════════════════════════════════ */
document.getElementById("btnStart").addEventListener("click", async () => {
  // 1. El avioncito sale volando
  const plane = document.getElementById("paperPlane");
  plane.classList.add("fly-away");

  // 2. Ocultar intro (después de que el avión empiece a volar)
  await sleep(300);
  intro.classList.add("hidden");

  // 2. Mostrar card
  await sleep(400);
  wrap.classList.add("visible");
  canvas.classList.add("bright");

  // 3. Escribir kicker
  await sleep(500);
  await typewrite(kicker, TEXTS.kicker, 35);

  // 4. Escribir título (más lento, protagonista)
  await sleep(300);
  await typewrite(msg, TEXTS.title, 55);
  msg.classList.add("alive");

  // 5. Escribir nota
  await sleep(400);
  await typewrite(note, TEXTS.note, 40);

  // 7. Mostrar botón
  await sleep(500);
  actions.classList.add("visible");
});

/* ── Reveal: muestra el corazón con "matatita y pollito" ── */
const elevenEl = document.getElementById("elevenTraveler");

btnReveal.addEventListener("click", () => {
  const isOpen = reveal.classList.toggle("show");
  if (isOpen) {
    setTimeout(() => {
      heartSection.classList.add("visible");
    }, 200);

    // Después de que el 11:11 del corazón se desvanece (~5s),
    // iniciar la secuencia de apariciones que suben
    setTimeout(startElevenJourney, 5500);
  }
  btnReveal.textContent = isOpen ? "♡" : "Sorpresa mia";
});

/* ══════════════════════════════════
   11:11 JOURNEY — Aparece y desaparece subiendo
   Cada iteración aparece más arriba en la pantalla,
   con posición horizontal aleatoria. En la última
   iteración se queda fijo arriba brillando.
   ══════════════════════════════════ */
function startElevenJourney() {
  const steps = 6;           // Cantidad de apariciones antes de llegar al top
  const startY = 75;         // Empieza al 75% de la pantalla (abajo)
  const endY = 3;            // Termina al 3% (arriba)
  let step = 0;

  function hop() {
    // Progreso de 0 a 1
    const t = step / (steps - 1);
    // Posición vertical: de startY% a endY% (sube)
    const yPercent = startY - (startY - endY) * t;
    // Posición horizontal: aleatoria pero centrada (30%-70%)
    const xPercent = 30 + Math.random() * 40;
    // Tamaño crece ligeramente conforme sube
    const size = 17 + t * 7;

    elevenEl.style.top = yPercent + "vh";
    elevenEl.style.left = xPercent + "%";
    elevenEl.style.fontSize = size + "px";
    elevenEl.style.transform = "translateX(-50%)";

    // Fade in
    elevenEl.style.transition = "opacity 0.5s ease";
    elevenEl.style.opacity = "0";
    requestAnimationFrame(() => {
      elevenEl.style.opacity = String(0.55 + t * 0.45); // Cada vez más visible
    });

    if (step < steps - 1) {
      // Desaparecer después de un momento, luego saltar al siguiente
      setTimeout(() => {
        elevenEl.style.transition = "opacity 0.6s ease";
        elevenEl.style.opacity = "0";
        step++;
        setTimeout(hop, 800); // Pausa antes de la siguiente aparición
      }, 1400);
    } else {
      // Última iteración: centrar arriba y quedarse brillando
      setTimeout(() => {
        elevenEl.style.transition = "all 1s ease";
        elevenEl.style.left = "50%";
        elevenEl.style.top = "20px";
        elevenEl.style.opacity = "1";
        setTimeout(() => {
          elevenEl.classList.add("settled");
          // Mostrar "te quiero" justo después de que el 11:11 brilla
          setTimeout(() => {
            document.getElementById("teQuiero").classList.add("visible");
          }, 800);
        }, 1000);
      }, 600);
    }
  }

  hop();
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

function resize() {
  W = canvas.width  = window.innerWidth  * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  dots = Array.from({ length: 70 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  (Math.random() * 1.2 + 0.4) * devicePixelRatio,
    vx: (Math.random() * 0.22 - 0.11) * devicePixelRatio,
    vy: (Math.random() * 0.22 - 0.11) * devicePixelRatio
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

  const maxDist = 140 * devicePixelRatio;
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