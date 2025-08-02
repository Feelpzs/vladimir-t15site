// Captura email da URL e exibe
const params = new URLSearchParams(window.location.search);
const email = params.get("email");

if (email) {
  document.getElementById("emailDisplay").textContent = email;
} else {
  document.getElementById("emailDisplay").textContent = "E-mail não identificado";
}

// Envio manual do email
document.getElementById("emailForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const emailInput = document.getElementById("emailInput").value;
  const status = document.getElementById("statusMsg");
  status.textContent = "Enviando...";

  try {
    const res = await fetch("https://novousuariowebhook-h4oginleiq-uc.a.run.app/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
    });

    if (res.ok) {
      status.textContent = "✅ E-mail enviado com sucesso! Verifique sua caixa de entrada.";
    } else {
      status.textContent = "❌ Ocorreu um erro. Tente novamente.";
    }
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Erro de conexão. Tente novamente.";
  }
});
