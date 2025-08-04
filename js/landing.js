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


const canvas = document.getElementById('sangue');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rastros = [];

function criarRastro(x, y) {
  return {
    x: x,
    y: y,
    tamanho: Math.random() * 8 + 4,
    alpha: 1,
    velX: (Math.random() - 0.5) * 2,
    velY: (Math.random() - 0.5) * 2,
    cor: `rgba(150, 0, 0,`
  };
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rastros.forEach((gota, i) => {
    ctx.beginPath();
    ctx.fillStyle = `${gota.cor} ${gota.alpha})`;
    ctx.shadowColor = "#990000";
    ctx.shadowBlur = 8;
    ctx.arc(gota.x, gota.y, gota.tamanho, 0, Math.PI * 2);
    ctx.fill();

    // Movimento viscoso
    gota.x += gota.velX * 0.5;
    gota.y += gota.velY * 0.5;
    gota.alpha -= 0.015;
    gota.tamanho *= 0.98; // encolhe lentamente

    if (gota.alpha <= 0.05) {
      rastros.splice(i, 1);
    }
  });

  requestAnimationFrame(animar);
}

window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 6; i++) { // mais partículas para parecer puxado
    rastros.push(criarRastro(e.clientX, e.clientY));
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animar();

document.getElementById("btnComprar").addEventListener("click", async () => {
  const botao = document.getElementById("btnComprar");
  botao.textContent = "Redirecionando...";
  botao.disabled = true;
  botao.style.opacity = "0.6";

  try {
    // Envia a requisição para o backend criar a sessão do Stripe
    const response = await fetch("https://novousuariowebhook-h4oginleiq-uc.a.run.app/criar-checkout", {
      method: "POST",
    });

    const data = await response.json();

    if (data.url) {
      // Pequeno delay antes do redirecionamento
      setTimeout(() => {
        window.location.href = data.url;
      }, 1000);
    } else {
      throw new Error("Erro ao obter link de pagamento.");
    }
  } catch (error) {
    console.error("Erro ao redirecionar para o Stripe:", error);
    botao.textContent = "Tente novamente";
    botao.disabled = false;
    botao.style.opacity = "1";
  }
});

// Quando a página recarrega, reativa o botão
window.addEventListener("load", () => {
  const botao = document.getElementById("btnComprar");
  if (botao) {
    botao.textContent = "Comprar Agora";
    botao.disabled = false;
    botao.style.opacity = "1";
  }
});
