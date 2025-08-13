/* ===== JINX: Lobby (busca, seleção, preenchimento do painel) ===== */
"use strict";

(() => {
  const input = document.getElementById("search-champ");
  const carrossel = document.getElementById("carrossel");
  const painel = document.getElementById("painel-matchup");
  const nomeCamp = document.getElementById("nome-campeao");

  const ulMatch = document.getElementById("texto-matchup");
  const spellsBox = document.getElementById("spells-container");
  const buildBox  = document.getElementById("build-container");
  const runaPri   = document.getElementById("runas-primaria");
  const runaSec   = document.getElementById("runas-secundaria");
  const runaStats = document.getElementById("runas-stats");
  const cooldowns = document.getElementById("cooldowns");
  const video     = document.getElementById("video-matchup");

  if (!carrossel) return;

  // ===== Dados base (exemplos) — expanda à vontade =====
  const jinxMatchups = {
    "caitlyn": {
      tips: [
        "Abuse do alcance do foguete (Q), mas respeite o auto-ataque da Cait.",
        "Evite alinhar atrás da wave para não tomar armadilha + headshot.",
        "Troque após ela gastar Rede (E) ou se seu suporte iniciar."
      ],
      spells: ["flash","heal"],
      build: ["vendaval","canhao","ldom"],
      runasPrim: ["Ritmo Fatal","Presença de Espírito","Lenda: Linhagem","Golpe de Misericórdia"],
      runasSec: ["Biscoitos","Perspicácia Cósmica"],
      stats: ["Vel. de Ataque","Dano","Vida"],
      cds: "Rede (E): ~16–10s • Armadilha (W): ~30–16s • R: 90–60s.",
      video: "https://www.youtube.com/embed/bwU8o9f8k3k"
    },
    "lucian": {
      tips: [
        "Respeite o power spike de nível 2; jogue mais reativo.",
        "Kite com foguete; trocas curtas com W quando ele perder espaço.",
        "Congele próximo da sua torre para limitar dash do Lucian."
      ],
      spells: ["flash","heal"],
      build: ["vendaval","dancarina","canhao"],
      runasPrim: ["Pés Ligeiros","Presença de Espírito","Lenda: Linhagem","Cura Excessiva"],
      runasSec: ["Osso Revestido","Crescimento Excessivo"],
      stats: ["Vel. de Ataque","Dano","Armadura"],
      cds: "Q: 9–5s • E: 19–12s (reseta com passiva) • R: 110–70s.",
      video: "https://www.youtube.com/embed/bwU8o9f8k3k"
    },
    "draven": {
      tips: [
        "Evite trocar quando 2 machados ativos; poke quando ele for pegar o machado.",
        "Jogue por farm e controle de wave até 2 itens; peça peel.",
        "Use E nos pontos de entrada para travar engage previsível."
      ],
      spells: ["flash","heal"],
      build: ["arcoescudo","ldom","dancarina"],
      runasPrim: ["Pés Ligeiros","Presença de Espírito","Lenda: Linhagem","Golpe de Misericórdia"],
      runasSec: ["Biscoitos","Perspicácia Cósmica"],
      stats: ["Vel. de Ataque","Dano","Vida"],
      cds: "Perde muito DPS se não pegar machado; puna esse timing.",
      video: "https://www.youtube.com/embed/bwU8o9f8k3k"
    }
  };

  const DEFAULT_MU = {
    tips: [
      "Use Q (foguete) para controlar wave + poke.",
      "Guarde E para peelar ou travar rota de fuga do inimigo.",
      "Busque reset da passiva para finalizar a luta."
    ],
    spells: ["flash","heal"],
    build: ["vendaval","canhao","ldom"],
    runasPrim: ["Ritmo Fatal","Presença de Espírito","Lenda: Linhagem","Golpe de Misericórdia"],
    runasSec: ["Biscoitos","Perspicácia Cósmica"],
    stats: ["Vel. de Ataque","Dano","Vida"],
    cds: "Sem info específica — jogue pelo alcance e posição.",
    video: "https://www.youtube.com/embed/bwU8o9f8k3k"
  };

  // ===== Mapas de imagem (ajuste nomes conforme seus assets) =====
  const spellImg = {
    flash: "../assets/img/spells/flash.png",
    heal: "../assets/img/spells/heal.png",
    barrier: "../assets/img/spells/barrier.png",
    exhaust: "../assets/img/spells/exhaust.png",
    default1: "../assets/img/spells/default1.png",
    default2: "../assets/img/spells/default2.png",
  };

  const itemImg = {
    vendaval: "../assets/img/builds/vendaval.png",
    canhao: "../assets/img/builds/canhao.png",
    ldom: "../assets/img/builds/ldom.png",
    dancarina: "../assets/img/builds/dancarina.png",
    arcoescudo: "../assets/img/builds/arcoescudo.png",
    gume: "../assets/img/builds/gume.png"
  };

  // ===== Helpers =====
  function clear(el){ if (!el) return; while (el.firstChild) el.removeChild(el.firstChild); }
  function renderList(list, el){
    clear(el);
    (list||[]).forEach(t=>{
      const li = document.createElement("li");
      li.textContent = t;
      el.appendChild(li);
    });
  }
  function renderSpells(list){
    clear(spellsBox);
    (list && list.length ? list : ["default1","default2"]).forEach(k=>{
      const src = spellImg[k] || spellImg.default1;
      const img = document.createElement("img");
      img.className = "spell-img";
      img.src = src;
      img.alt = k;
      spellsBox.appendChild(img);
    });
  }
  function renderBuild(list){
    clear(buildBox);
    (list||[]).forEach(k=>{
      const src = itemImg[k] || itemImg.vendaval;
      const img = document.createElement("img");
      img.className = "runa-img item-img";
      img.src = src;
      img.alt = k;
      buildBox.appendChild(img);
    });
  }
  function badge(txt){
    const tag = document.createElement("span");
    tag.className = "habilidade";
    tag.style.marginRight = "8px";
    tag.textContent = txt;
    return tag;
  }
  function renderRunes(primary, secondary, stats){
    clear(runaPri); clear(runaSec); clear(runaStats);
    (primary||[]).forEach(t => runaPri.appendChild(badge(t)));
    (secondary||[]).forEach(t => runaSec.appendChild(badge(t)));
    (stats||[]).forEach(t => runaStats.appendChild(badge(t)));
  }

  function setSelected(imgEl){
    carrossel.querySelectorAll(".champ.selected").forEach(el => el.classList.remove("selected"));
    if (imgEl) imgEl.classList.add("selected");
  }

  function preencherPainel(chave, label, imgEl){
    const data = jinxMatchups[chave] || DEFAULT_MU;
    if (nomeCamp) nomeCamp.textContent = label || chave;

    renderList(data.tips, ulMatch);
    renderSpells(data.spells);
    renderBuild(data.build);
    renderRunes(data.runasPrim, data.runasSec, data.stats);

    if (cooldowns) cooldowns.textContent = data.cds || "";
    if (video) {
      // Para de tocar o vídeo anterior antes de trocar
      try { video.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*'); } catch(_){}
      video.src = data.video || "";
    }

    if (painel) {
      painel.style.display = "grid";
      painel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setSelected(imgEl);
    // opcional: persistir última escolha
    try { sessionStorage.setItem("jinx_last_mu", chave); } catch(_){}
  }

  // Clique nos campeões
  carrossel.querySelectorAll(".champ").forEach(img=>{
    img.addEventListener("click", ()=>{
      const key = img.dataset.campeao;
      const label = (img.getAttribute("alt") || key || "").trim();
      if (!key) return;
      preencherPainel(key.toLowerCase(), label, img);
    });
  });

  // Filtro de busca
  if (input){
    input.addEventListener("input", ()=>{
      const q = input.value.toLowerCase().trim();
      carrossel.querySelectorAll(".champ").forEach(img=>{
        const key = (img.dataset.campeao || "").toLowerCase();
        const alt = (img.getAttribute("alt") || "").toLowerCase();
        img.style.display = (key.includes(q) || alt.includes(q)) ? "" : "none";
      });
    });
  }

  // Restaura último matchup (se quiser)
  try {
    const last = sessionStorage.getItem("jinx_last_mu");
    if (last) {
      const el = Array.from(carrossel.querySelectorAll(".champ")).find(i => (i.dataset.campeao || "").toLowerCase() === last);
      preencherPainel(last, el?.getAttribute("alt") || last, el);
    }
  } catch(_){}
})();
