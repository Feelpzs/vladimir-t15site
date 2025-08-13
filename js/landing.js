(() => {
  // ===== Helpers =====
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // ===== Rolagem suave =====
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });

  // ===== Accordion de benefícios =====
  const toggles = $$(".benefit-toggle");
  toggles.forEach((toggle) => {
    on(toggle, "click", () => {
      const item = toggle.closest(".benefit-item");
      const content = toggle.nextElementSibling;
      if (!item || !content) return;

      const isOpen = item.classList.contains("open");
      if (!isOpen) {
        item.classList.add("open");
        content.style.display = "block";
        const h = content.scrollHeight;
        content.style.maxHeight = h + "px";
        content.style.padding = "10px 18px 18px";
      } else {
        const h = content.scrollHeight;
        content.style.maxHeight = h + "px";
        requestAnimationFrame(() => {
          content.style.maxHeight = "0px";
          content.style.padding = "0 18px";
        });
        item.classList.remove("open");
        setTimeout(() => { content.style.display = "none"; }, 250);
      }
    });
  });

  // ===== Timer 15:00 com persistência =====
  const timerDisplay = $("#timer");
  let end = null;
  function ensureEndTime() {
    const saved = localStorage.getItem("promoEnd");
    const now = Date.now();
    if (!saved || Number(saved) <= now) {
      end = now + 15 * 60 * 1000;
      localStorage.setItem("promoEnd", String(end));
    } else {
      end = Number(saved);
    }
  }
  function startTimer() {
    if (!timerDisplay) return;
    ensureEndTime();
    const tick = () => {
      const now = Date.now();
      let remaining = Math.max(0, Math.floor((end - now) / 1000));
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerDisplay.textContent = `${m < 10 ? "0"+m : m}:${s < 10 ? "0"+s : s}`;
      if (remaining <= 0) {
        const buy = $("#btnComprar");
        if (buy) { buy.disabled = true; buy.textContent = "Promoção encerrada"; }
        if (!localStorage.getItem("promoEndedAlert")) {
          alert("A promoção acabou! 😱");
          localStorage.setItem("promoEndedAlert", "1");
        }
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ===== Canvas sangue performático =====
  const canvas = $("#sangue");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let rastros = [];
  let animando = false;
  let lastEmit = 0;
  const MAX_PARTS = 800;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function criarRastro(x, y) {
    return {
      x, y,
      tamanho: Math.random() * 8 + 4,
      alpha: 1,
      velX: (Math.random() - 0.5) * 2,
      velY: (Math.random() - 0.5) * 2,
      cor: "rgba(150, 0, 0,"
    };
  }
  function animar() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = rastros.length - 1; i >= 0; i--) {
      const gota = rastros[i];
      ctx.beginPath();
      ctx.fillStyle = `${gota.cor}${gota.alpha})`;
      ctx.shadowColor = "#dbbb06ff";
      ctx.shadowBlur = 8;
      ctx.arc(gota.x, gota.y, gota.tamanho, 0, Math.PI * 2);
      ctx.fill();
      gota.x += gota.velX * 0.5;
      gota.y += gota.velY * 0.5;
      gota.alpha -= 0.015;
      gota.tamanho *= 0.98;
      if (gota.alpha <= 0.05) rastros.splice(i, 1);
    }
    if (animando) requestAnimationFrame(animar);
  }
  function startBloodOnce() {
    if (animando || !canvas) return;
    animando = true; resizeCanvas(); animar();
  }
  function emitAt(x, y, count = 6) {
    if (!canvas) return;
    if (rastros.length > MAX_PARTS) rastros.splice(0, rastros.length - MAX_PARTS);
    for (let i = 0; i < count; i++) rastros.push(criarRastro(x, y));
  }
  on(window, "resize", resizeCanvas);
  on(window, "mousemove", (e) => {
    startBloodOnce();
    const now = performance.now();
    if (now - lastEmit > 16) { emitAt(e.clientX, e.clientY, 6); lastEmit = now; }
  });
  on(window, "touchmove", (e) => {
    startBloodOnce();
    const t = e.touches[0];
    if (t) emitAt(t.clientX, t.clientY, 6);
  });

  // ===== Modal Pagamento (acessível) =====
  const modal = $("#modalPagamento");
  const btnComprar = $("#btnComprar");
  const btnFechar = $("#fecharModal");
  const btnCartao = $("#btnCartao");
  const btnPix = $("#btnPix");

  const focusableSel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.remove("hidden");

    const firstFocusable = modal.querySelector(focusableSel);
    firstFocusable && firstFocusable.focus();

    const onBackdrop = (e) => { if (e.target === modal) closeModal(); };
    modal.addEventListener("click", onBackdrop, { once: true });

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeModal(); }
      else if (e.key === "Tab") trapFocus(e);
    };
    document.addEventListener("keydown", onKey, { capture: true });
    modal._cleanup = () => document.removeEventListener("keydown", onKey, { capture: true });
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    if (modal._cleanup) modal._cleanup();
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  function trapFocus(e) {
    if (!modal) return;
    const focusables = Array.from(modal.querySelectorAll(focusableSel)).filter(el => !el.disabled && el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  on(btnComprar, "click", (e) => { e.preventDefault(); openModal(); });
  on(btnFechar, "click", closeModal);

  // ===== Pagamentos =====
  on(btnCartao, "click", async () => {
    if (!btnCartao) return;
    btnCartao.textContent = "Redirecionando...";
    btnCartao.disabled = true;
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(
        "https://novousuariowebhook-h4oginleiq-uc.a.run.app/criar-checkout",
        { method: "POST", signal: controller.signal }
      );
      clearTimeout(t);
      const data = await response.json().catch(() => ({}));
      if (data && data.url) setTimeout(() => { window.location.href = data.url; }, 600);
      else throw new Error("Erro ao obter link de pagamento.");
    } catch (err) {
      console.error("Erro ao redirecionar para o Stripe:", err);
      btnCartao.textContent = "Tente novamente";
      btnCartao.disabled = false;
    }
  });
  on(btnPix, "click", () => { window.location.href = "pix.html"; });

  // ===== Chips de Campeões =====
  const chips = $$(".champions-strip .chip");
  const hero = $(".hero-4x");
  const heroTitle = $(".hero-title");
  let navigating = false;
  const originalTitle = heroTitle ? heroTitle.textContent : "";

  function highlightChampion(name) {
    if (!hero || !heroTitle) return;
    hero.style.transition = "transform .2s ease";
    hero.style.transform = "scale(1.01)";
    heroTitle.textContent = `${originalTitle} → ${name}`;
    setTimeout(() => {
      hero.style.transform = "scale(1)";
      setTimeout(() => { heroTitle.textContent = originalTitle; }, 1200);
    }, 180);
  }
  function selectChip(chip) {
    chips.forEach(c => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
  }
  chips.forEach((chip) => {
    const go = (e) => {
      e.preventDefault();
      if (navigating) return;
      navigating = true;
      const name = chip.textContent.trim();
      selectChip(chip);
      highlightChampion(name);
      localStorage.setItem("selectedChampion", name.toLowerCase());
      setTimeout(() => { window.location.href = chip.getAttribute("href"); }, 650);
    };
    on(chip, "click", go);
    on(chip, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") go(e); });
    on(chip, "mouseenter", () => {
      chip.classList.add("chip--hover");
      if (heroTitle) heroTitle.textContent = `${originalTitle} → ${chip.textContent.trim()}`;
    });
    on(chip, "mouseleave", () => {
      chip.classList.remove("chip--hover");
      if (heroTitle) heroTitle.textContent = originalTitle;
    });
  });

  // ===== Hero rail: cria wrapper (se faltar) + duplica para loop perfeito =====
  function setupHeroRail(){
    const container = $(".hero-rail");
    if (!container) return;

    // Garante a .rail-track mesmo que o HTML não tenha
    let track = container.querySelector(".rail-track");
    if (!track) {
      track = document.createElement("div");
      track.className = "rail-track";
      // move filhos existentes (imgs) para dentro do track
      const kids = Array.from(container.children);
      kids.forEach(k => track.appendChild(k));
      container.appendChild(track);
    }

    const imgs = Array.from(track.children).filter(n => n.tagName === "IMG");
    if (imgs.length === 0) return;

    // evita duplicar mais de uma vez
    if (track.dataset.cloned === "1") return;
    imgs.forEach(img => {
      const clone = img.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
    track.dataset.cloned = "1";
  }

  // ===== Init =====
  document.addEventListener("DOMContentLoaded", () => {
    startTimer();
    setupHeroRail();

    if (canvas) {
      resizeCanvas();
      emitAt(window.innerWidth * 0.5, window.innerHeight * 0.35, 40);
      if (!animando) {
        animando = true; animar();
        setTimeout(() => { animando = false; }, 600);
      }
    }
  });
})();
