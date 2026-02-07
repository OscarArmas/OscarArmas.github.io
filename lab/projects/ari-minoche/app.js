/* ══════════════════════════════════
   CONFIGURACIÓN DE TEXTOS
   ══════════════════════════════════ */
const TEXTS = {
  kicker:  "solo quería decirte",
  title:   "En la ciudad o en el pueblito disfruto cada momento contigo.",
  note:    "Para mi novia, la más hermosa de todo el pueblito"
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
    el.innerHTML = "";
    const cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    
    // 1. Agrupar por palabras para evitar saltos de línea a mitad de palabra
    const words = text.split(" ");
    const spans = [];
    
    words.forEach((word, index) => {
      // Wrapper para la palabra: inline-block mantiene las letras juntas
      const wordWrapper = document.createElement("span");
      wordWrapper.style.display = "inline-block";
      wordWrapper.style.whiteSpace = "nowrap";
      
      for (let char of word) {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.transform = "translateY(6px)";
        span.style.transition = "opacity 0.25s ease, transform 0.3s ease";
        span.style.display = "inline-block";
        
        wordWrapper.appendChild(span);
        spans.push({ span, char });
      }
      
      el.appendChild(wordWrapper);

      // Agregar espacio después de la palabra (si no es la última)
      if (index < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.innerHTML = "&nbsp;";
        spaceSpan.style.display = "inline";
        spaceSpan.style.opacity = "0"; // También animamos el espacio para consistencia
        el.appendChild(spaceSpan);
        spans.push({ span: spaceSpan, char: " " });
      }
    });

    el.appendChild(cursorSpan);

    // 2. Revelarlos uno a uno
    let i = 0;
    function tick() {
      if (i < spans.length) {
        const { span, char } = spans[i];
        
        // Mover cursor: si es letra, va dentro del wordWrapper; si es espacio, en el root
        if (i < spans.length - 1) {
          const nextSpan = spans[i+1].span;
          // Insertar antes del siguiente span (sea hermano o primo)
          // Si nextSpan es hijo de wordWrapper, cursor va dentro de wordWrapper
          // Si nextSpan es espacio (hijo directo), cursor va al root
          nextSpan.parentNode.insertBefore(cursorSpan, nextSpan);
        } else {
          // Al final, cursor al final del root
          el.appendChild(cursorSpan);
        }

        // Animar entrada
        requestAnimationFrame(() => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0)";
        });

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
   CANVAS — Avioncitos y motas de luz
   Fondo orgánico: avioncitos de papel que
   flotan suavemente, estelas curvas detrás
   de ellos, y pequeñas motas cálidas.
   ══════════════════════════════════ */
const ctx = canvas.getContext("2d");
let W, H;

const isMobile = window.innerWidth <= 768;
const dpr = devicePixelRatio;

/* ── Motas de luz cálidas (reemplazan los puntos geométricos) ── */
const MOTE_COUNT = isMobile ? 25 : 45;
let motes = [];

/* ── Avioncitos de papel flotantes ── */
const PLANE_COUNT = isMobile ? 3 : 5;
let planes = [];

function createMote() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: (Math.random() * 1.5 + 0.5) * dpr,
    vx: (Math.random() * 0.12 - 0.06) * dpr,
    vy: (Math.random() * 0.12 - 0.06) * dpr,
    // Cada mota parpadea con su propia fase
    phase: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.012
  };
}

function createPlane() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    size: (10 + Math.random() * 7) * dpr,
    angle: -0.4 + Math.random() * 0.3,
    vx: (0.15 + Math.random() * 0.2) * dpr,
    vy: (-0.08 + Math.random() * 0.06) * dpr,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmp: (1.5 + Math.random() * 1.5) * dpr,
    wobbleSpeed: 0.015 + Math.random() * 0.01,
    alpha: 0.18 + Math.random() * 0.10,
    // Estela: guardar posiciones anteriores
    trail: []
  };
}

function resize() {
  W = canvas.width  = window.innerWidth * dpr;
  H = canvas.height = window.innerHeight * dpr;
  motes = Array.from({ length: MOTE_COUNT }, createMote);
  planes = Array.from({ length: PLANE_COUNT }, createPlane);
}
window.addEventListener("resize", resize);
resize();

/* ── Dibuja un avioncito de papel minimalista ── */
function drawPlane(x, y, size, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(199,162,124,1)";
  ctx.lineWidth = 1.2 * dpr;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Forma del avión: triángulo estilizado
  ctx.beginPath();
  ctx.moveTo(size, 0);                    // Punta
  ctx.lineTo(-size * 0.7, -size * 0.45);  // Ala arriba
  ctx.lineTo(-size * 0.3, 0);             // Centro trasero
  ctx.lineTo(-size * 0.7, size * 0.45);   // Ala abajo
  ctx.closePath();
  ctx.stroke();

  // Pliegue central
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.3, 0);
  ctx.globalAlpha = alpha * 0.5;
  ctx.stroke();

  ctx.restore();
}

/* ── Loop principal ── */
let time = 0;

function loop() {
  ctx.clearRect(0, 0, W, H);
  time++;

  // Dibujar motas de luz
  for (const m of motes) {
    m.x += m.vx;
    m.y += m.vy;
    if (m.x < 0) m.x = W;
    if (m.x > W) m.x = 0;
    if (m.y < 0) m.y = H;
    if (m.y > H) m.y = 0;

    // Parpadeo suave con seno
    const flicker = 0.12 + Math.sin(time * m.speed + m.phase) * 0.08;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(199,162,124,${flicker})`;
    ctx.fill();
  }

  // Dibujar avioncitos con estelas
  for (const p of planes) {
    // Movimiento con oscilación
    const wobble = Math.sin(time * p.wobbleSpeed + p.wobblePhase) * p.wobbleAmp;
    p.x += p.vx;
    p.y += p.vy + wobble * 0.04;
    p.angle = Math.atan2(p.vy + wobble * 0.02, p.vx);

    // Wrap alrededor de la pantalla
    if (p.x > W + p.size * 2) { p.x = -p.size * 2; p.trail = []; }
    if (p.x < -p.size * 2) { p.x = W + p.size * 2; p.trail = []; }
    if (p.y > H + p.size * 2) { p.y = -p.size * 2; p.trail = []; }
    if (p.y < -p.size * 2) { p.y = H + p.size * 2; p.trail = []; }

    // Guardar posición para la estela (cada 4 frames)
    if (time % 4 === 0) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 18) p.trail.shift();
    }

    // Dibujar estela punteada curva
    if (p.trail.length > 2) {
      for (let i = 1; i < p.trail.length; i++) {
        // Solo cada 2 puntos (efecto punteado)
        if (i % 2 === 0) {
          const t = p.trail[i];
          const fade = (i / p.trail.length) * p.alpha * 0.8;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(199,162,124,${fade})`;
          ctx.fill();
        }
      }
    }

    // Dibujar el avioncito
    drawPlane(p.x, p.y, p.size, p.angle, p.alpha);
  }

  requestAnimationFrame(loop);
}
loop();
