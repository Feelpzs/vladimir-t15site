/* ===== JINX: script base (menu, scroll, modal, logout) ===== */
"use strict";

// Menu mobile
(() => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }
})();

// Scroll suave
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

// Modal de imagem (runa/spell/item)
(() => {
  const modal = document.getElementById("modal");
  const imgAmpliada = document.getElementById("img-ampliada");
  const fechar = document.getElementById("fechar");

  const abrir = (src) => {
    if (!modal || !imgAmpliada) return;
    imgAmpliada.src = src;
    modal.style.display = "flex";
  };
  const fecharModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    if (imgAmpliada) imgAmpliada.src = "";
  };

  document.body.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.classList.contains("runa-img") || t.classList.contains("spell-img") || t.classList.contains("item-img")) {
      abrir(t.getAttribute("src"));
    }
  });

  if (fechar) fechar.addEventListener("click", fecharModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) fecharModal(); });
})();

// Logout (usa logout.js se existir; senão fallback seguro)
(() => {
  const logoutBtns = [document.getElementById("btnSairDesktop"), document.getElementById("btnSairMobile")];

  const fallbackLogout = async () => {
    try {
      // Firebase (opcional)
      if (window.firebase?.auth) {
        await window.firebase.auth().signOut();
      }
    } catch (_) {}
    localStorage.removeItem("logado");
    window.location.href = "login.html";
  };

  logoutBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", async () => {
      // Se existir window.appLogout do seu logout.js, usa; senão fallback
      if (typeof window.appLogout === "function") {
        try { await window.appLogout(); } catch (_) { await fallbackLogout(); }
      } else {
        await fallbackLogout();
      }
    });
  });
})();

// ===== RASTRO NEON JINX — mesma estética, mais suave =====
(() => {
  const canvas = document.getElementById('sangue');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ---- Parâmetros fáceis de ajustar ----
  const DPR          = Math.min(1.5, window.devicePixelRatio || 1); // capa resolução
  const SPEED        = 0.45;   // ↓ velocidade das partículas (antes ~1.0)
  const GRAVITY      = 0.035;  // ↓ queda mais leve
  const TRAIL_FADE   = 0.25;   // intensidade do rastro ao desaparecer (0.10–0.25)
  const SHADOW_BLUR  = 16;     // glow da partícula (10–20)
  const MOVE_THROTTLE_MS = 20; // ↓ frequência de spawn ao mover o mouse
  const MAX_PARTS    = 180;    // limite de partículas simultâneas
  const COLORS       = ['#ff3aa7', '#33e0ff', '#ffe26d'];

  let W, H;
  function resize(){
    W = canvas.width  = Math.floor(innerWidth  * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width  = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize);
  resize();

  const parts = [];
  function burst(x, y, power = 1){
    const n = 10 + ((power * 14) | 0); // ↓ menos partículas por explosão
    for (let i = 0; i < n; i++){
      const a = Math.random() * Math.PI * 2;
      const s = (0.6 + Math.random() * 2) * (power * 0.8 + 1) * SPEED; // ↓ velocidade
      parts.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 0.4 * power * SPEED,
        life: 58 + Math.random() * 28,
        size: (Math.random() * 2 + 1) * (power * 0.8 + 1),
        color: COLORS[(Math.random() * COLORS.length) | 0]
      });
    }
    // controla estouro
    while (parts.length > MAX_PARTS) parts.shift();
  }

  // spawn no movimento/clique (com throttle)
  let lastMove = 0;
  addEventListener('pointermove', (e) => {
    const t = performance.now();
    if (t - lastMove > MOVE_THROTTLE_MS){
      burst(e.clientX * DPR, e.clientY * DPR, 0.6);
      lastMove = t;
    }
  }, { passive: true });

  addEventListener('click', (e) => {
    burst(e.clientX * DPR, e.clientY * DPR, 1.6); // explosão maior mas ainda suave
  }, { passive: true });

  let raf;
  function loop(){
    raf = requestAnimationFrame(loop);

    // fade do rastro sem pintar o fundo
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
    ctx.fillRect(0, 0, W, H);

    // partículas com glow e blend bonito
    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--){
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += GRAVITY; p.life--;
      if (p.life <= 0){ parts.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = SHADOW_BLUR;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  // pausa quando a aba perde foco
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });

  loop();
})();