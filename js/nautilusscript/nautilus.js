/* =====================================================
   GUIA NAUTILUS – JS (CONSOLIDADO & CORRIGIDO)
   - Canvas 1 (fundo): bolhas subaquáticas (loop contínuo)
   - Canvas 2 (overlay): rastro do mouse com “jato de água”
   - Fade on scroll (IntersectionObserver)
   - Smooth scroll para âncoras
   - Modal de imagens (.runa-img)
   - Menu mobile (toggle/fechar fora)
   ===================================================== */

/* ---------- Canvas 1: Bolhas Subaquáticas (fundo) ---------- */
// Garante o canvas e o coloca ACIMA do fundo e abaixo do overlay
const bCanvas = document.getElementById("sangue") || (() => {
  const c = document.createElement("canvas");
  c.id = "sangue";
  document.body.prepend(c);
  return c;
})();
Object.assign(bCanvas.style, {
  position: "fixed",
  inset: "0",
  zIndex: "1",          // antes estava -1 -> ficava escondido
  pointerEvents: "none" // não bloqueia cliques
});

const bCtx = bCanvas.getContext("2d", { alpha: true });

function resizeBubblesCanvas() {
  bCanvas.width = window.innerWidth;
  bCanvas.height = window.innerHeight;
}
resizeBubblesCanvas();
window.addEventListener("resize", resizeBubblesCanvas);

// Paleta náutica
const COLOR_BUBBLE = "rgba(34, 211, 238,";   // --accent
const COLOR_BUBBLE_2 = "rgba(14, 165, 233,"; // --primary

const bubbles = [];
const MAX_BUBBLES = 180;

class Bubble {
  constructor(x, y) { this.reset(x, y); }
  reset(x = Math.random() * bCanvas.width, y = bCanvas.height + Math.random() * 80) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 6 + 2;            // tamanho
    this.vy = -(Math.random() * 1.5 + 0.4);    // sobe (negativo)
    this.vx = (Math.random() - 0.5) * 0.3;     // leve deriva
    this.alpha = Math.random() * 0.6 + 0.25;   // transparência
    this.life = Math.random() * 600 + 400;     // vida em frames
    this.colorAlt = Math.random() < 0.45;      // alterna cor
    this.wobble = Math.random() * Math.PI * 2; // oscilação
    this.wobbleSpeed = Math.random() * 0.03 + 0.01;
  }
  draw() {
    const grad = bCtx.createRadialGradient(this.x, this.y, this.r * 0.2, this.x, this.y, this.r);
    const base = (this.colorAlt ? COLOR_BUBBLE_2 : COLOR_BUBBLE);
    grad.addColorStop(0, `${base}${this.alpha})`);
    grad.addColorStop(1, `${base}${Math.max(this.alpha - 0.2, 0)})`);
    bCtx.beginPath();
    bCtx.fillStyle = grad;
    bCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bCtx.fill();
    // brilho
    bCtx.beginPath();
    bCtx.fillStyle = `rgba(255,255,255,${Math.min(this.alpha, 0.35)})`;
    bCtx.arc(this.x - this.r * 0.35, this.y - this.r * 0.35, this.r * 0.25, 0, Math.PI * 2);
    bCtx.fill();
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * 0.1;
    this.y += this.vy;
    this.alpha *= 0.999; // leve fade
    this.life--;
    if (this.y + this.r < -10 || this.life <= 0) this.reset();
  }
}

function seedBubbles(n = 120) {
  for (let i = 0; i < n; i++) {
    bubbles.push(new Bubble(Math.random() * bCanvas.width, Math.random() * bCanvas.height));
  }
}
seedBubbles(120);

function spawnBurst(x, y, n = 12) {
  for (let i = 0; i < n; i++) {
    if (bubbles.length < MAX_BUBBLES) bubbles.push(new Bubble(x, y));
  }
}

let bubbleRAF;
function animateBubbles() {
  bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].draw();
    bubbles[i].update();
  }
  bubbleRAF = requestAnimationFrame(animateBubbles);
}
animateBubbles();

// Interações que criam “surtos” de bolhas
let lastMove = 0;
window.addEventListener("mousemove", (e) => {
  const now = performance.now();
  if (now - lastMove > 16) { // ~60fps throttle
    spawnBurst(e.clientX, e.clientY, 6);
    lastMove = now;
  }
}, { passive: true });
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0]; if (!t) return;
  spawnBurst(t.clientX, t.clientY, 5);
}, { passive: true });

/* ---------- Fade on Scroll (IntersectionObserver) ---------- */
(function injectFadeCSS(){
  const style = document.createElement('style');
  style.textContent = `
    .fade{ opacity: 0; transform: translateY(6px); }
    .fade.visible{ opacity: 1; transform: translateY(0); transition: opacity .5s ease, transform .5s ease; }
  `;
  document.head.appendChild(style);
})();

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade').forEach(el => io.observe(el));

/* ---------- Smooth Scroll para âncoras internas ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetSel = this.getAttribute('href');
    const target = document.querySelector(targetSel);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- Modal de Imagem ---------- */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("img-ampliada");
const fechar = document.getElementById("fechar");

if (modal && modalImg && fechar) {
  document.querySelectorAll(".runa-img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function(){
      modal.style.display = "block";
      modalImg.src = this.src;
      modalImg.alt = this.alt;
    });
  });
  fechar.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
}

/* ---------- Menu Mobile + Fechar ao clicar fora ---------- */
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => { menu.classList.toggle("open"); });
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => { menu.classList.remove("open"); });
  });
  document.addEventListener("click", (event) => {
    const inside = menu.contains(event.target) || menuToggle.contains(event.target);
    if (!inside) menu.classList.remove("open");
  });
}

/* ---------- Canvas 2: Rastro do Mouse – Jato d’Água (overlay) ---------- */
(function () {
  'use strict';

  const CFG = {
    maxPoints: 28,
    maxDrops: 420,
    dropsPerMove: 8,
    fade: 0.08,
    widthMin: 2,
    widthMax: 8,
    blur: 22,
    colorA: 'rgba(34,211,238,', // ciano água
    colorB: 'rgba(14,165,233,', // azul oceano
  };

  // Canvas overlay acima de tudo
  const wCanvas = document.createElement('canvas');
  const wCtx = wCanvas.getContext('2d', { alpha: true });
  Object.assign(wCanvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '9999',
    pointerEvents: 'none',
  });
  document.body.appendChild(wCanvas);

  function resizeTrail() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    wCanvas.width  = Math.floor(window.innerWidth  * dpr);
    wCanvas.height = Math.floor(window.innerHeight * dpr);
    wCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  let points = []; // pontos do traço
  let drops  = []; // gotículas
  let last = { x: 0, y: 0, t: 0 };

  class Drop {
    constructor(x, y, vx, vy, r, life) {
      this.x = x; this.y = y;
      this.vx = vx; this.vy = vy;
      this.r = r; this.life = life;
      this.alpha = 1;
      this.spin = Math.random() * Math.PI * 2;
      this.spinV = (Math.random() - 0.5) * 0.16;
      this.colorAlt = Math.random() < 0.45;
    }
    step() {
      this.spin += this.spinV;
      this.x += this.vx + Math.sin(this.spin) * 0.1;
      this.y += this.vy + Math.cos(this.spin) * 0.07;
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.life--;
      this.alpha = Math.max(this.alpha - 0.015, 0);
      return this.life > 0 && this.alpha > 0;
    }
    draw(ctx) {
      const base = this.colorAlt ? CFG.colorB : CFG.colorA;
      const g = ctx.createRadialGradient(this.x, this.y, this.r * 0.2, this.x, this.y, this.r);
      g.addColorStop(0, `${base}${this.alpha})`);
      g.addColorStop(1, `${base}${Math.max(this.alpha - 0.25, 0)})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      // brilho
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.min(this.alpha, 0.35)})`;
      ctx.arc(this.x - this.r * 0.35, this.y - this.r * 0.35, this.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function addPoint(x, y) {
    points.push({ x, y, t: performance.now() });
    if (points.length > CFG.maxPoints) points.shift();
  }

  function spawnDrops(x, y, dx, dy) {
    const speed = Math.hypot(dx, dy) || 1;
    const nx = dx / speed, ny = dy / speed;
    const n = Math.min(CFG.dropsPerMove + Math.floor(speed * 0.05), 18);
    for (let i = 0; i < n; i++) {
      const ang = (Math.random() - 0.5) * 0.9;
      const spd = Math.min(speed * 0.25, 20) + Math.random() * 1.5;
      const vx = nx * spd * Math.cos(ang) - ny * spd * Math.sin(ang);
      const vy = ny * spd * Math.cos(ang) + nx * spd * Math.sin(ang);
      const r = Math.random() * 2.2 + 0.8;
      const life = Math.floor(30 + Math.random() * 25);
      drops.push(new Drop(x, y, vx, vy, r, life));
      if (drops.length > CFG.maxDrops) drops.splice(0, drops.length - CFG.maxDrops);
    }
  }

  function onMove(x, y) {
    const now = performance.now();
    const dx = x - last.x;
    const dy = y - last.y;
    addPoint(x, y);
    if (last.t !== 0) spawnDrops(x, y, dx, dy);
    last = { x, y, t: now };
  }

  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    const t = e.touches[0]; if (!t) return;
    onMove(t.clientX, t.clientY);
  }, { passive: true });

  let trailRAF;
  function tick() {
    // fade com destination-out (apaga só o overlay)
    wCtx.globalCompositeOperation = 'destination-out';
    wCtx.fillStyle = `rgba(0,0,0,${CFG.fade})`;
    wCtx.fillRect(0, 0, wCanvas.width, wCanvas.height);

    // rastro
    if (points.length > 1) {
      wCtx.globalCompositeOperation = 'lighter';
      const a = points[0];
      const b = points[points.length - 1];
      const grad = wCtx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, 'rgba(34,211,238,.75)');
      grad.addColorStop(1, 'rgba(14,165,233,.25)');
      wCtx.strokeStyle = grad;

      const last2 = points[points.length - 2];
      const speed = last2 ? Math.hypot(b.x - last2.x, b.y - last2.y) : 0;
      const lw = Math.max(CFG.widthMin, Math.min(CFG.widthMax, speed * 0.12 + CFG.widthMin));
      wCtx.lineWidth = lw;
      wCtx.lineCap = 'round';
      wCtx.lineJoin = 'round';
      wCtx.shadowBlur = CFG.blur;
      wCtx.shadowColor = 'rgba(34,211,238,.6)';

      wCtx.beginPath();
      wCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const p = points[i];
        const n = points[i + 1];
        const cx = (p.x + n.x) / 2;
        const cy = (p.y + n.y) / 2;
        wCtx.quadraticCurveTo(p.x, p.y, cx, cy);
      }
      wCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      wCtx.stroke();
      wCtx.shadowBlur = 0;
    }

    // gotículas
    wCtx.globalCompositeOperation = 'lighter';
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      if (d.step()) d.draw(wCtx);
      else drops.splice(i, 1);
    }

    trailRAF = requestAnimationFrame(tick);
  }
  tick();

  // Pausa/retoma o overlay
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(trailRAF);
    else tick();
  });
})();

/* ---------- Pausa/retoma ambos ao trocar de aba ---------- */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(bubbleRAF);
  } else {
    animateBubbles();
  }
});

// ===== Menu ativo por seção visível (IntersectionObserver) =====
(() => {
  const navLinks = Array.from(document.querySelectorAll('#menu a[href^="#"]'));
  if (!navLinks.length) return;

  // Mapeia seções a partir dos hrefs
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => {
      const isMatch = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', isMatch);
      a.setAttribute('aria-current', isMatch ? 'true' : 'false');
    });
  };

  // Observa a seção "no meio" da viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    root: null,
    threshold: 0.5,               // ~metade visível
    rootMargin: '-15% 0px -15% 0' // ajusta sensibilidade
  });

  sections.forEach(sec => io.observe(sec));

  // Ao clicar, já marca ativo imediatamente
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const id = (a.getAttribute('href') || '').slice(1);
      if (id) setActive(id);
    });
  });
})();
