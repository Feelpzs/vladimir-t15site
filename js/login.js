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
