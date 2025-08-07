
  document.querySelectorAll(".bandeira-lol").forEach((card) => {
    card.addEventListener("click", () => {
      const champ = card.getAttribute("data-champ");

      // Toca som ao clicar
      const som = document.getElementById("efeitoAudio");
      som.currentTime = 0;
      som.play();

      // Adiciona classe de animação e desativa outros cliques
      card.classList.add("selecionado");
      card.style.pointerEvents = "none";

      // Aplica efeito escurecido nos demais cards
      document.querySelectorAll(".bandeira-lol").forEach((el) => {
        if (el !== card) {
          el.style.opacity = "0.2";
        }
      });

      // Adiciona fade no body
      document.body.classList.add("fadeout");

      // Redireciona após delay
      setTimeout(() => {
        window.location.href = `campeoes/${champ}.html`;
      }, 1500);
    });
  });


  document.querySelectorAll(".bandeira-lol").forEach((card) => {
  const hoverSound = document.getElementById("hoverAudio");
  const clickSound = document.getElementById("efeitoAudio");

  card.addEventListener("mouseenter", () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
  });

  card.addEventListener("click", () => {
    const url = card.getAttribute("data-url");

    // Toca som de clique
    clickSound.currentTime = 0;
    clickSound.play();

    // Adiciona classe de transição
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  });
});
