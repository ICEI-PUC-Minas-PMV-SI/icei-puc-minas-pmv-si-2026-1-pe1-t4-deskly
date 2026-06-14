const DB_NOME = "perfilDB";
const DB_VERSAO = 1;
const STORE_NOME = "fotos";

function abrirDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NOME, DB_VERSAO);
        req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NOME);
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

function salvarFotoDB(chave, blob) {
    return abrirDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NOME, "readwrite");
        const req = tx.objectStore(STORE_NOME).put(blob, chave);
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
    }));
}

function carregarFotoDB(chave) {
    return abrirDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NOME, "readonly");
        const req = tx.objectStore(STORE_NOME).get(chave);
        req.onsuccess = (e) => resolve(e.target.result || null);
        req.onerror = (e) => reject(e.target.error);
    }));
}

function obterSessao() {
    return JSON.parse(sessionStorage.getItem("usuarioLogado"))
        || JSON.parse(localStorage.getItem("usuarioLogado"))
        || null;
}

function buscarUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function chaveUsuario(sessao) {
    return `foto_${sessao.id ?? sessao.email ?? "anonimo"}`;
}

const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputDepartamento = document.getElementById("departamento");
const inputTelefone = document.getElementById("telefone");
const inputSenhaAtual = document.getElementById("senha-atual");
const inputNovaSenha = document.getElementById("nova-senha");
const nomeExibido = document.querySelector(".card-perfil-resumo h2");
const roleExibido = document.querySelector(".card-perfil-resumo .user-role");
const badgePerfil = document.querySelector(".card-perfil-resumo .badge");
const btnSalvar = document.querySelector(".btn-reservar[type='submit']");
const btnDescartar = document.querySelector(".btn-detalhes");
const btnLogout = document.getElementById("btn-logout");
const avatarEl = document.getElementById("perfil-avatar");
const avatarOverlay = document.getElementById("avatar-overlay");
const inputFoto = document.getElementById("input-foto");

inputTelefone.addEventListener('input', () => {
    let v = inputTelefone.value.replace(/\D/g, '').slice(0, 11);

    if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    inputTelefone.value = v;
});

function aplicarFoto(blob) {
    const url = URL.createObjectURL(blob);
    avatarEl.innerHTML = `<img src="${url}" alt="Foto de perfil" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
}

function carregarFoto() {
    const sessao = obterSessao();
    if (!sessao) return;
    carregarFotoDB(chaveUsuario(sessao))
        .then(blob => { if (blob) aplicarFoto(blob); })
        .catch(() => { });
}

avatarOverlay.addEventListener("click", () => inputFoto.click());
avatarEl.addEventListener("click", () => inputFoto.click());

inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        mostrarToast("Arquivo inválido", "Selecione uma imagem (JPG, PNG, etc.).", "erro");
        return;
    }

    const sessao = obterSessao();
    if (!sessao) return;

    salvarFotoDB(chaveUsuario(sessao), arquivo)
        .then(() => {
            aplicarFoto(arquivo);
            mostrarToast("Foto atualizada", "Sua foto de perfil foi salva.", "sucesso");

            const reader = new FileReader();
            reader.onloadend = function () {
                const usuarios = buscarUsuarios();
                let index = usuarios.findIndex(u => u.id === sessao.id || u.email === sessao.email);
                if (index !== -1) {
                    usuarios[index].foto = reader.result;
                    salvarUsuarios(usuarios);
                }
            }
            reader.readAsDataURL(arquivo);
        })
        .catch(() => mostrarToast("Erro", "Não foi possível salvar a foto.", "erro"));

    inputFoto.value = "";
});

function carregarPerfil() {
    const sessao = obterSessao();
    if (!sessao) {
        window.location.href = "login.html";
        return;
    }

    const usuarios = buscarUsuarios();
    const usuario = usuarios.find(u => u.id === sessao.id || u.email === sessao.email) || sessao;

    inputNome.value = usuario.nome || "";
    inputEmail.value = usuario.email || "";
    inputDepartamento.value = usuario.departamento || "";
    inputTelefone.value = usuario.telefone || "";

    nomeExibido.textContent = usuario.nome || "—";
    roleExibido.textContent = usuario.departamento || "Colaborador";

    if (badgePerfil) {
        badgePerfil.textContent = usuario.perfil || "Usuário";
        badgePerfil.className = "badge " + (usuario.perfil === "Admin" ? "disponivel" : "ocupado");
    }

    carregarFoto();
}

btnSalvar.addEventListener("click", (e) => {
    e.preventDefault();

    const sessao = obterSessao();
    if (!sessao) return;

    const usuarios = buscarUsuarios();
    let index = usuarios.findIndex(u => u.id === sessao.id || u.email === sessao.email);

    if (index === -1) {
        usuarios.push({ ...sessao, telefone: "", departamento: "", senha: "" });
        index = usuarios.length - 1;
    }

    const novoNome = inputNome.value.trim();
    const novoDepartamento = inputDepartamento.value.trim();
    const novoTelefone = inputTelefone.value.trim();
    const senhaAtual = inputSenhaAtual.value;
    const novaSenha = inputNovaSenha.value;

    if (!novoNome) {
        mostrarToast("Campo obrigatório", "O nome não pode ficar vazio.", "erro");
        return;
    }

    const telefoneLimpo = novoTelefone.replace(/\D/g, '');
    if (novoTelefone && (telefoneLimpo.length < 10 || telefoneLimpo.length > 11)) {
        mostrarToast("Telefone inválido", "Informe um telefone válido: (00) 00000-0000.", "erro");
        return;
    }

    if (senhaAtual || novaSenha) {
        if (!senhaAtual || !novaSenha) {
            mostrarToast("Campos de senha", "Preencha a senha atual e a nova senha.", "erro");
            return;
        }
        if (usuarios[index].senha && usuarios[index].senha !== senhaAtual) {
            mostrarToast("Senha incorreta", "A senha atual informada está incorreta.", "erro");
            return;
        }
        if (novaSenha.length < 6) {
            mostrarToast("Senha fraca", "A nova senha precisa ter pelo menos 6 caracteres.", "erro");
            return;
        }
        usuarios[index].senha = novaSenha;
    }

    usuarios[index].nome = novoNome;
    usuarios[index].departamento = novoDepartamento;
    usuarios[index].telefone = novoTelefone;

    salvarUsuarios(usuarios);

    const novaSessao = {
        ...sessao,
        nome: novoNome,
        departamento: novoDepartamento,
        telefone: novoTelefone
    };

    if (sessionStorage.getItem("usuarioLogado")) sessionStorage.setItem("usuarioLogado", JSON.stringify(novaSessao));
    if (localStorage.getItem("usuarioLogado")) localStorage.setItem("usuarioLogado", JSON.stringify(novaSessao));

    nomeExibido.textContent = novoNome;
    roleExibido.textContent = novoDepartamento || "Colaborador";
    inputSenhaAtual.value = "";
    inputNovaSenha.value = "";

    mostrarToast("Salvo", "Suas alterações foram salvas com sucesso!", "sucesso");
});

btnDescartar.addEventListener("click", () => {
    carregarPerfil();
    inputSenhaAtual.value = "";
    inputNovaSenha.value = "";
    mostrarToast("Descartado", "As alterações foram descartadas.", "aviso");
});

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioLogado");
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("saindo"), 3600);
    setTimeout(() => toast.remove(), 4000);
}

document.addEventListener("DOMContentLoaded", carregarPerfil);