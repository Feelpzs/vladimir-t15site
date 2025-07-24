// Seleciona todos os campeões do carrossel
const champs = document.querySelectorAll(".champ");
const painel = document.getElementById("painel-matchup");
const nomeCampeao = document.getElementById("nome-campeao");

// Objeto que armazena os dados de cada campeão (você preenche para cada um)
const matchups = {
    aatrox: {
        matchupTexto: [
            "O Q do Aatrox é previsível, desvie com a Poça.",
            "Evite trocas longas no early game, ele é mais forte.",
            "Abuse do sustain com seu Q para trocar dano aos poucos."
        ],
        spells: [
            "imglobby/spells/ghost.webp",
            "imglobby/spells/flash.png"
        ],
        build: [
            "imglobby/itens/cinturao hextec.webp",
            "imglobby/itens/foco do horizonte.webp",
            "imglobby/itens/rabadon.webp",
            "imglobby/itens/cajado do vazio.webp",
            "imglobby/itens/chama sombria.webp",
        ],
        runasPrimaria: [
            "imglobby/runas/aery.webp",
            "imglobby/runas/manto.webp",
            "imglobby/runas/chamuscar.png",
            "imglobby/runas/transcedencia.webp",
            

        ],
        runasSecundaria: [
            "imglobby/runas/lenda.webp",
            "imglobby/runas/ate a morte.webp"
        ],
        runasStats: [
            "imglobby/runas/cdr.png",
            "imglobby/runas/forca adaptativa.png",
            "imglobby/runas/vida escalavel.png"
            
        ],
        cooldowns: "Q – 14/12/10 | W – 20/18/16 | E – 9/8/7 | R – 120/100/80",
        video: "https://www.youtube.com/watch?v=v853NtnESYo"
    }
    // Adicione os outros campeões aqui...
};


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

