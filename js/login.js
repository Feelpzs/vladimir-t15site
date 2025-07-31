// Firebase Auth
const auth = firebase.auth();
auth.useDeviceLanguage();

// Inicializa o reCAPTCHA invisível
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: (response) => {
    console.log("✅ reCAPTCHA resolvido");
  }
});

recaptchaVerifier.render().then((widgetId) => {
  window.recaptchaWidgetId = widgetId;
});

// Lógica unificada de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const senhaCorreta = "vladpro";

  // Login local com senha fixa
  if (password === senhaCorreta) {
    localStorage.setItem("logado", "true");
    window.location.href = "painel.html";
    return;
  }

  // Login com Firebase
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("logado", "true");
      window.location.href = "painel.html";
    })
    .catch((error) => {
      alert("Erro ao logar: " + traduzirErro(error.code));
    });
});

// Tradução dos erros Firebase
function traduzirErro(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    default:
      return 'Erro desconhecido: ' + code;
  }
}

// Canvas de sangue
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
    ctx.fillStyle = `${gota.cor}${gota.alpha})`;
    ctx.shadowColor = "#990000";
    ctx.shadowBlur = 8;
    ctx.arc(gota.x, gota.y, gota.tamanho, 0, Math.PI * 2);
    ctx.fill();

    gota.x += gota.velX * 0.5;
    gota.y += gota.velY * 0.5;
    gota.alpha -= 0.015;
    gota.tamanho *= 0.98;

    if (gota.alpha <= 0.05) {
      rastros.splice(i, 1);
    }
  });

  requestAnimationFrame(animar);
}

window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 6; i++) {
    rastros.push(criarRastro(e.clientX, e.clientY));
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animar();
