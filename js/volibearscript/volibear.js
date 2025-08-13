// volibear.js (substitua tudo do efeito anterior por isso)
(() => {
  const canvas = document.getElementById('raio');
  if (!canvas) { console.error('Canvas #raio não encontrado!'); return; }
  const ctx = canvas.getContext('2d');
  let flashes = [];

  // full-screen
  function resize() {
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // classe de flash de raio
  class Flash {
    constructor(x, y) {
      this.life    = 0;
      this.maxLife = 10 + Math.random()*5;
      // cria pontos em zig-zag a partir do mouse
      const segs = 6 + Math.floor(Math.random()*4);
      const step = 20 + Math.random()*10;
      this.pts = [[x, y]];
      for (let i = 1; i <= segs; i++) {
        const prev = this.pts[i-1];
        const angle = (Math.PI/2) + (Math.random()*Math.PI/3 - Math.PI/6);
        const nx = prev[0] + Math.cos(angle)*step;
        const ny = prev[1] + Math.sin(angle)*step;
        this.pts.push([nx + (Math.random()*10-5), ny + (Math.random()*10-5)]);
      }
    }
    draw() {
      const a = 1 - this.life/this.maxLife;
      ctx.lineWidth    = 2 + a*2;
      ctx.strokeStyle  = `rgba(255,255,224,${a})`;      // azul metálico forte
      ctx.shadowBlur   = 13;
      ctx.shadowColor  = `rgba(0,0,205,${a})`;
      ctx.beginPath();
      ctx.moveTo(...this.pts[0]);
      for (let i = 1; i < this.pts.length; i++) {
        ctx.lineTo(...this.pts[i]);
      }
      ctx.stroke();
      this.life++;
    }
    isDead() {
      return this.life >= this.maxLife;
    }
  }

  // cria flashes no mousemove
  window.addEventListener('mousemove', e => {
    // 1 ou 2 flashes por movimento
    const count = 1 + Math.floor(Math.random()*1.5);
    for (let i = 0; i < count; i++) {
      flashes.push(new Flash(e.clientX, e.clientY));
    }
  });

  // loop de animação
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = flashes.length - 1; i >= 0; i--) {
      flashes[i].draw();
      if (flashes[i].isDead()) flashes.splice(i, 1);
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



