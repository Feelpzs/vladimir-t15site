// Seleciona todos os campeões do carrossel
const champs = document.querySelectorAll(".champ");
const painel = document.getElementById("painel-matchup");
const nomeCampeao = document.getElementById("nome-campeao");

// Objeto que armazena os dados de cada campeão (você preenche para cada um)
fetch("matchups_completo.json")
  .then(response => response.json())
  .then(data => {
      matchups = data;
      console.log("Matchups carregados com sucesso!", matchups);
  })
  .catch(err => console.error("Erro ao carregar o JSON:", err));



// Evento de clique nos campeões
champs.forEach(champ => {
    champ.addEventListener("click", () => {
        const champName = champ.dataset.campeao;
        const data = matchups[champName];

        if (!data) return alert("Matchup ainda não configurado!");

        // Atualiza título
        nomeCampeao.textContent = champ.alt;

        // Atualiza texto do matchup
        const textoMatchup = document.getElementById("texto-matchup");
        textoMatchup.innerHTML = "";
        data.matchupTexto.forEach(line => {
            const li = document.createElement("li");
            li.textContent = line;
            textoMatchup.appendChild(li);
        });

        // Atualiza spells
        const spellsContainer = document.getElementById("spells-container");
        spellsContainer.innerHTML = "";
        data.spells.forEach(spell => {
            const img = document.createElement("img");
            img.src = spell;
            img.classList.add("spell-img");
            spellsContainer.appendChild(img);
        });

        // Atualiza build
        const buildContainer = document.getElementById("build-container");
        buildContainer.innerHTML = "";
        data.build.forEach(item => {
            const img = document.createElement("img");
            img.src = item;
            img.classList.add("item-img");
            buildContainer.appendChild(img);
        });

        // Atualiza runas
        const runasPrimaria = document.getElementById("runas-primaria");
        runasPrimaria.innerHTML = "";
        data.runasPrimaria.forEach(runa => {
            const img = document.createElement("img");
            img.src = runa;
            img.classList.add("runa-img");
            runasPrimaria.appendChild(img);
        });

        const runasSecundaria = document.getElementById("runas-secundaria");
        runasSecundaria.innerHTML = "";
        data.runasSecundaria.forEach(runa => {
            const img = document.createElement("img");
            img.src = runa;
            img.classList.add("runa-img");
            runasSecundaria.appendChild(img);
        });

        const runasStats = document.getElementById("runas-stats");
        runasStats.innerHTML = "";
        data.runasStats.forEach(stat => {
            const img = document.createElement("img");
            img.src = stat;
            img.classList.add("runa-img");
            runasStats.appendChild(img);
        });

        // Atualiza cooldowns
        document.getElementById("cooldowns").textContent = data.cooldowns;

        // Atualiza vídeo
       const videoMatchup = document.getElementById("video-matchup");
        videoMatchup.src = data.video;

        // Exibe o painel
        painel.style.display = "block";
        painel.scrollIntoView({ behavior: "smooth" });
    });
});
// localizar champ
const searchInput = document.querySelector("#search-champ");
const champ = document.querySelectorAll(".champ");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    champs.forEach(champ => {
        const champName = champ.dataset.campeao.toLowerCase();
        champ.style.display = champName.includes(searchTerm) ? "inline-block" : "none";
    });
});
