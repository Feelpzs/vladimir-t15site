window.addEventListener("load", () => {
  const auth = firebase.auth();

  const sairMobile = document.getElementById("btnSairMobile");
  const sairDesktop = document.getElementById("btnSairDesktop");

  const deslogar = () => {
    localStorage.removeItem("logado");
    auth.signOut().finally(() => {
      window.location.href = "painel.html";
    });
  };

  if (sairMobile) sairMobile.addEventListener("click", deslogar);
  if (sairDesktop) sairDesktop.addEventListener("click", deslogar);
});
console.log("logout.js carregado com sucesso");
