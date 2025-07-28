document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Senha fixa temporária
  const senhaCorreta = "vladpro";

  if (password === senhaCorreta) {
    // Armazenar sessão simples no navegador
    localStorage.setItem("logado", "true");
    window.location.href = "painel.html";
  } else {
    alert("Senha incorreta! Tente novamente.");
  }
});

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
