// Rolagem suave para os links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});


const toggles = document.querySelectorAll('.benefit-toggle');

toggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    const content = toggle.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.padding = "0 10px";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.padding = "10px";
    }
  });
});

// Contador de 15 minutos
let tempo = 15 * 60; // 15 minutos em segundos
const timerDisplay = document.getElementById("timer");

const intervalo = setInterval(() => {
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;

  timerDisplay.textContent = 
    `${minutos < 10 ? "0" + minutos : minutos}:${segundos < 10 ? "0" + segundos : segundos}`;

  if (tempo <= 0) {
    clearInterval(intervalo);
    timerDisplay.textContent = "00:00";
    alert("A promoção acabou! 😱");
  }

  tempo--;
}, 1000);
