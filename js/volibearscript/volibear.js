// efeito fractal de raios que seguem o mouse
(() => {
  const canvas = document.getElementById('raio');
  if (!canvas) { console.error('Canvas #raio não encontrado!'); return; }
  const ctx = canvas.getContext('2d');
  let bolts = [];

  // redimensiona full-screen
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // fractal recursivo
  /**
 * Desenha um relâmpago fractal entre (x1,y1) e (x2,y2)
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} [depth=0] nível atual de recursão
 */
function drawBolt(x1, y1, x2, y2, depth = 0) {
  const dx   = x2 - x1;
  const dy   = y2 - y1;
  const dist = Math.hypot(dx, dy);

  // Base case: ou distância pequena OU atingiu profundidade máx.
  if (dist < 16 || depth > 4) {
    ctx.lineTo(x2, y2);
    return;
  }

  // Quanto maior o segmento, maior pode ser o desvio
  const offset = dist * 0.3;
  const midX   = (x1 + x2) / 2 + (Math.random() * offset - offset/2);
  const midY   = (y1 + y2) / 2 + (Math.random() * offset - offset/2);

  // Dois sub-segmentos, incrementando a profundidade
  drawBolt(x1, y1, midX, midY, depth + 1);
  drawBolt(midX, midY, x2, y2, depth + 1);
}


  class Bolt {
    constructor(x, y) {
      this.x0 = x; this.y0 = y;
      this.x1 = x + (Math.random()*200 - 100);
      this.y1 = y + (Math.random()*200 - 100);
      this.life    = 0;
      this.maxLife = 12 + Math.random()*8;
    }
    draw() {
      const alpha = 1 - this.life/this.maxLife;
      ctx.strokeStyle = `rgba(70,130,180,${alpha})`;  
      ctx.lineWidth   = 2;
      ctx.shadowBlur  = 20;
      ctx.shadowColor = `rgba(70,130,180,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(this.x0, this.y0);
      drawBolt(this.x0, this.y0, this.x1, this.y1);
      ctx.stroke();
      this.life++;
    }
    isDead() {
      return this.life >= this.maxLife;
    }
  }

  // gera sempre que o mouse se move
  window.addEventListener('mousemove', e => {
    const count = 1 + Math.floor(Math.random()*2);
    for (let i = 0; i < count; i++) {
      bolts.push(new Bolt(e.clientX, e.clientY));
    }
  });

  // loop de desenho
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = bolts.length - 1; i >= 0; i--) {
      bolts[i].draw();
      if (bolts[i].isDead()) bolts.splice(i, 1);
    }
    requestAnimationFrame(animate);
  })();
})();


// --- FADE AO SCROLL ---
function revelarScroll() {
  document.querySelectorAll('.fade').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revelarScroll);
revelarScroll();


// --- SCROLL SUAVE ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});


// --- MODAL DE IMAGEM ---
const modal    = document.getElementById("modal");
const modalImg = document.getElementById("img-ampliada");
const fechar   = document.getElementById("fechar");

document.querySelectorAll(".runa-img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src        = img.src;
    modalImg.alt        = img.alt;
  });
});

fechar.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// --- MENU MOBILE ---
const menuToggle = document.getElementById("menu-toggle");
const menu       = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});

menu.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});

document.addEventListener("click", event => {
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    menu.classList.remove("show");
  }
});
