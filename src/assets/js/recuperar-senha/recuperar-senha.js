const form = document.querySelector("form");
const inputEmail = document.getElementById("email");
const inputNovaSenha = document.getElementById("novaSenha");
const inputConfirmar = document.getElementById("confirmarSenha");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email       = inputEmail.value.trim();
    const novaSenha   = inputNovaSenha.value.trim();
    const confirmacao = inputConfirmar.value.trim();

    if (!email || !novaSenha || !confirmacao) {
        alert("Preencha todos os campos.");
        return;
    }

    if (novaSenha !== confirmacao) {
        alert("As senhas não coincidem.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex(u => u.email === email);

    if (index === -1) {
        alert("Nenhum usuário encontrado com esse e-mail.");
        return;
    }

    usuarios[index].senha = novaSenha;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Senha atualizada com sucesso!");
    window.location.href = "login.html";
});