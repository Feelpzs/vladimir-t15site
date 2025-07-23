const canvas = document.getElementById("sangue");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gotas = [];

class Gota {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tamanho = Math.random() * 10 + 5;
        this.velocidadeY = Math.random() * 2 + 1;
        this.transparencia = 1;
    }

    desenhar() {
        ctx.fillStyle = `rgba(139,0,0,${this.transparencia})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fill();
    }

    atualizar() {
        this.y += this.velocidadeY;
        this.transparencia -= 0.02;
    }
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gotas.length; i++) {
        gotas[i].desenhar();
        gotas[i].atualizar();
        if (gotas[i].transparencia <= 0) {
            gotas.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animar);
}

window.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 5; i++) {
        gotas.push(new Gota(e.x, e.y));
    }
});

animar();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/* Fade ao rolar */
function revelarScroll() {
    const elements = document.querySelectorAll('.fade');
    const scrollTop = window.scrollY + window.innerHeight;

    elements.forEach(el => {
        if (el.offsetTop < scrollTop - 50) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revelarScroll);
revelarScroll();

/* Scroll suave ao clicar menu */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Modal de imagem em tamanho real
const modal = document.getElementById("modal");
const modalImg = document.getElementById("img-ampliada");
const fechar = document.getElementById("fechar");

document.querySelectorAll(".runa-img").forEach(img => {
    img.addEventListener("click", function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.alt = this.alt;
    });
});

fechar.addEventListener("click", function() {
    modal.style.display = "none";
});

modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});
