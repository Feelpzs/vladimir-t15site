/* =====================================================
   LOBBY – GUIA NAUTILUS
   - Carrega JSON de matchups
   - Atualiza painel (texto, spells, build, runas, stats, cooldowns, vídeo)
   - Pesquisa de campeões e destaque de seleção
   - Pequenos aprimoramentos de acessibilidade
   Compatível com o HTML que contém:
     #painel-matchup, #nome-campeao, #texto-matchup, #spells-container,
     #build-container, #runas-primaria, #runas-secundaria, #runas-stats,
     #cooldowns, #video-matchup, .champ, #search-champ
   ===================================================== */

(() => {
  "use strict";

  /* ---------- Seletores principais ---------- */
  const champs = Array.from(document.querySelectorAll(".champ"));
  const painel = document.getElementById("painel-matchup");
  const nomeCampeao = document.getElementById("nome-campeao");
  const textoMatchup = document.getElementById("texto-matchup");
  const spellsContainer = document.getElementById("spells-container");
  const buildContainer = document.getElementById("build-container");
  const runasPrimaria = document.getElementById("runas-primaria");
  const runasSecundaria = document.getElementById("runas-secundaria");
  const runasStats = document.getElementById("runas-stats");
  const cooldownsEl = document.getElementById("cooldowns");
  const videoMatchup = document.getElementById("video-matchup");
  const searchInput = document.getElementById("search-champ");

  if (!painel) return; // HTML não tem lobby

  /* ---------- Estado ---------- */
  let matchups = {};
  let activeKey = null;

  /* ---------- Utils ---------- */
  const clearNode = (el) => { if (el) el.innerHTML = ""; };

  const createImg = (src, cls = "", alt = "") => {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = alt || src.split("/").pop()?.split(".")[0] || "img";
    if (cls) img.className = cls;
    return img;
  };

  const toYouTubeEmbed = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      return url;
    } catch {
      // já pode ser um embed válido
      return url;
    }
  };

  const setActiveChamp = (el) => {
    champs.forEach(c => c.classList.remove("is-active", "selected"));
    if (el) el.classList.add("is-active");
  };

  const renderList = (parent, items) => {
    const frag = document.createDocumentFragment();
    items.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      frag.appendChild(li);
    });
    parent.appendChild(frag);
  };

  const renderImgs = (parent, list, cls) => {
    const frag = document.createDocumentFragment();
    list.forEach(src => frag.appendChild(createImg(src, cls)));
    parent.appendChild(frag);
  };

  /* ---------- Render principal ---------- */
  function renderMatchup(key) {
    const data = matchups[key];
    if (!data) {
      alert("Matchup ainda não configurado!");
      return;
    }
    activeKey = key;

    // Título
    const champEl = champs.find(c => c.dataset.campeao === key);
    const titulo = champEl?.getAttribute("alt") || key;
    nomeCampeao.textContent = titulo;

    // Texto
    clearNode(textoMatchup);
    if (Array.isArray(data.matchupTexto)) {
      renderList(textoMatchup, data.matchupTexto);
    }

    // Spells
    clearNode(spellsContainer);
    if (Array.isArray(data.spells)) {
      renderImgs(spellsContainer, data.spells, "spell-img");
    }

    // Build
    clearNode(buildContainer);
    if (Array.isArray(data.build)) {
      renderImgs(buildContainer, data.build, "item-img");
    }

    // Runas
    clearNode(runasPrimaria);
    clearNode(runasSecundaria);
    clearNode(runasStats);
    if (Array.isArray(data.runasPrimaria)) {
      renderImgs(runasPrimaria, data.runasPrimaria, "runa-img");
    }
    if (Array.isArray(data.runasSecundaria)) {
      renderImgs(runasSecundaria, data.runasSecundaria, "runa-img");
    }
    if (Array.isArray(data.runasStats)) {
      renderImgs(runasStats, data.runasStats, "runa-img");
    }

    // Cooldowns
    cooldownsEl.textContent = data.cooldowns || "";

    // Vídeo (aceita watch URL, youtu.be ou embed)
    videoMatchup.src = toYouTubeEmbed(data.video);

    // Exibe painel e rola
    painel.style.display = "block";
    setTimeout(() => painel.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  /* ---------- Carregamento do JSON ---------- */
  fetch("../json/matchups_completo.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      matchups = data || {};
      // Habilita clique após dados prontos
      attachChampHandlers();
      // Autoabrir via hash (#campeao) se existir
      const hash = (location.hash || "").replace("#", "").toLowerCase();
      if (hash && matchups[hash]) {
        const el = champs.find(c => c.dataset.campeao.toLowerCase() === hash);
        if (el) {
          setActiveChamp(el);
          renderMatchup(hash);
        }
      }
    })
    .catch(err => {
      console.error("Erro ao carregar o JSON:", err);
      // Feedback visual simples
      cooldownsEl.textContent = "Não foi possível carregar matchups no momento.";
    });

  /* ---------- Eventos dos campeões ---------- */
  function attachChampHandlers() {
    champs.forEach(champ => {
      champ.tabIndex = 0; // acessível via teclado
      champ.addEventListener("click", () => {
        setActiveChamp(champ);
        renderMatchup(champ.dataset.campeao);
      });
      champ.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          champ.click();
        }
      });
    });
  }

  /* ---------- Pesquisa ---------- */
  if (searchInput) {
    const filter = () => {
      const term = searchInput.value.trim().toLowerCase();
      champs.forEach(el => {
        const key = el.dataset.campeao.toLowerCase();
        const alt = (el.getAttribute("alt") || "").toLowerCase();
        el.style.display = (key.includes(term) || alt.includes(term)) ? "block" : "none";
      });
    };
    // debounce simples
    let t;
    searchInput.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(filter, 80);
    });
  }

  /* ---------- Expor função global opcional (para debug) ---------- */
  window.__renderMatchup = renderMatchup;

})();

