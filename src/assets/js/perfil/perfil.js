// ─── Sessão ──────────────────────────────────────────────────────

function obterSessao() {
    return JSON.parse(sessionStorage.getItem("usuarioLogado"))
        || JSON.parse(localStorage.getItem("usuarioLogado"))
        || null;
}

// ─── Usuários ────────────────────────────────────────────────────

function buscarUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ─── Elementos ───────────────────────────────────────────────────

const inputNome       = document.getElementById("nome");
const inputEmail      = document.getElementById("email");
const inputTelefone   = document.getElementById("telefone");
const inputSenhaAtual = document.getElementById("senha-atual");
const inputNovaSenha  = document.getElementById("nova-senha");

const nomeExibido     = document.querySelector(".card-perfil-resumo h2");
const roleExibido     = document.querySelector(".card-perfil-resumo .user-role");
const badgePerfil     = document.querySelector(".card-perfil-resumo .badge");

const btnSalvar       = document.querySelector(".btn-reservar[type='submit']");
const btnDescartar    = document.querySelector(".btn-detalhes");

// ─── Carregar perfil ─────────────────────────────────────────────

function carregarPerfil() {
    const sessao = obterSessao();
    if (!sessao) return;

    const usuarios = buscarUsuarios();
    const usuario  = usuarios.find(u => u.id === sessao.id) || sessao;

    inputNome.value     = usuario.nome || "";
    inputEmail.value    = usuario.email || "";
    inputTelefone.value = usuario.telefone || "";

    nomeExibido.textContent = usuario.nome || "";
    roleExibido.textContent = usuario.departamento || "";

    badgePerfil.textContent = usuario.perfil || "";
    badgePerfil.className   = "badge " + (usuario.perfil === "Admin" ? "disponivel" : "ocupado");
}

// ─── Salvar alterações ───────────────────────────────────────────

btnSalvar.addEventListener("click", (e) => {
    e.preventDefault();

    const sessao   = obterSessao();
    if (!sessao) return;

    const usuarios = buscarUsuarios();
    let index      = usuarios.findIndex(u => u.id === sessao.id);

    // Se não estiver no array ainda, cria o registro com base na sessão
    if (index === -1) {
        usuarios.push({ ...sessao, telefone: "", senha: "" });
        index = usuarios.length - 1;
    }

    const novoNome     = inputNome.value.trim();
    const novoTelefone = inputTelefone.value.trim();
    const senhaAtual   = inputSenhaAtual.value;
    const novaSenha    = inputNovaSenha.value;

    if (!novoNome) {
        mostrarToast("Campo obrigatório", "O nome não pode ficar vazio.", "erro");
        return;
    }

    // ── Alteração de senha (opcional) ────────────────────────────
    if (senhaAtual || novaSenha) {
        if (!senhaAtual || !novaSenha) {
            mostrarToast("Campos de senha", "Preencha a senha atual e a nova senha.", "erro");
            return;
        }

        if (usuarios[index].senha !== senhaAtual) {
            mostrarToast("Senha incorreta", "A senha atual informada está incorreta.", "erro");
            return;
        }

        if (novaSenha.length < 6) {
            mostrarToast("Senha fraca", "A nova senha precisa ter pelo menos 6 caracteres.", "erro");
            return;
        }

        usuarios[index].senha = novaSenha;
    }

    usuarios[index].nome     = novoNome;
    usuarios[index].telefone = novoTelefone;

    salvarUsuarios(usuarios);

    // Atualiza sessão com novo nome
    const novaSessao = { ...sessao, nome: novoNome };
    if (sessionStorage.getItem("usuarioLogado")) sessionStorage.setItem("usuarioLogado", JSON.stringify(novaSessao));
    if (localStorage.getItem("usuarioLogado"))   localStorage.setItem("usuarioLogado",   JSON.stringify(novaSessao));

    nomeExibido.textContent = novoNome;
    inputSenhaAtual.value   = "";
    inputNovaSenha.value    = "";

    mostrarToast("Salvo", "Suas alterações foram salvas com sucesso!", "sucesso");
});

// ─── Descartar alterações ────────────────────────────────────────

btnDescartar.addEventListener("click", () => {
    carregarPerfil();
    inputSenhaAtual.value = "";
    inputNovaSenha.value  = "";
    mostrarToast("Descartado", "As alterações foram descartadas.", "aviso");
});

// ─── Toast ───────────────────────────────────────────────────────

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}

// ─── Inicializar ─────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", carregarPerfil);