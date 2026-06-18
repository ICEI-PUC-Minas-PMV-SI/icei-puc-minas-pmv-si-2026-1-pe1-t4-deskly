const DB_NOME = "perfilDB";
const DB_VERSAO = 1;
const STORE_NOME = "fotos";

function obterUsuarios() { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
function salvarUsuarios(usuarios) { localStorage.setItem("usuarios", JSON.stringify(usuarios)); }

function garantirAdminDeskly() {
    const usuarios = obterUsuarios();
    const admin = usuarios.find(u => u.email === 'sistema.deskly@gmail.com');
    const caminhoFotoCorreto = 'assets/images/Perfil-deskly.jpg';

    if (!admin) {
        usuarios.push({
            id: 1,
            nome: 'Deskly',
            email: 'sistema.deskly@gmail.com',
            senha: 'Deskly2026.',
            perfil: 'Admin',
            token: null,
            senhaDefinida: true,
            protegido: true,
            dataCriacao: new Date().toISOString(),
            foto: caminhoFotoCorreto,
            departamento: 'Sistema',
            telefone: '(99) 99999-9999'
        });
        salvarUsuarios(usuarios);
        return;
    }

    let mudou = false;
    if (!admin.protegido) { admin.protegido = true; mudou = true; }
    if (!admin.departamento) { admin.departamento = 'Sistema'; mudou = true; }
    if (!admin.telefone) { admin.telefone = '(99) 99999-9999'; mudou = true; }
    if (!admin.foto || admin.foto.includes('foto_padrao')) { admin.foto = caminhoFotoCorreto; mudou = true; }
    if (mudou) salvarUsuarios(usuarios);
}

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

function buscarUsuarios() { return obterUsuarios(); }
function chaveUsuario(sessao) { return `foto_${sessao.id ?? sessao.email ?? "anonimo"}`; }

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

// Máscara de Telefone
if (inputTelefone) {
    inputTelefone.addEventListener('input', () => {
        let v = inputTelefone.value.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 10) {
            v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        inputTelefone.value = v;
    });
}

function aplicarFoto(blob) {
    if (!avatarEl) return;
    const url = URL.createObjectURL(blob);
    avatarEl.innerHTML = `<img src="${url}" alt="Foto de perfil" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
}

function substituirPorAvatarPadrao(imgElement, nome) {
    imgElement.onerror = null;
    imgElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=6B7280&color=fff`;
}

function carregarFoto() {
    const sessao = obterSessao();
    if (!sessao || !avatarEl) return;

    carregarFotoDB(chaveUsuario(sessao))
        .then(blob => {
            if (blob) {
                aplicarFoto(blob);
            } else {
                const usuarios = buscarUsuarios();
                const usuario = usuarios.find(u => u.id === sessao.id || u.email === sessao.email) || sessao;

                if (usuario && usuario.foto) {
                    avatarEl.innerHTML = `<img src="${usuario.foto}" alt="Foto de perfil" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="substituirPorAvatarPadrao(this, '${usuario.nome || 'Deskly'}')">`;
                } else {
                    avatarEl.innerHTML = `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome || 'Deskly')}&background=6B7280&color=fff" alt="Foto de perfil" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                }
            }
        })
        .catch(() => { });
}

if (avatarOverlay && inputFoto) avatarOverlay.addEventListener("click", () => inputFoto.click());
if (avatarEl && inputFoto) avatarEl.addEventListener("click", () => inputFoto.click());

if (inputFoto) {
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
}

function carregarPerfil() {
    const sessao = obterSessao();
    if (!sessao) {
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    const usuarios = buscarUsuarios();
    const usuario = usuarios.find(u => u.id === sessao.id || u.email === sessao.email) || sessao;

    if (inputNome) inputNome.value = usuario.nome || "";
    if (inputEmail) inputEmail.value = usuario.email || "";
    if (inputDepartamento) inputDepartamento.value = usuario.departamento || "";
    if (inputTelefone) inputTelefone.value = usuario.telefone || "";

    if (nomeExibido) nomeExibido.textContent = usuario.nome || "—";
    if (roleExibido) roleExibido.textContent = usuario.departamento || "Colaborador";

    if (badgePerfil) {
        badgePerfil.textContent = usuario.perfil || "Usuário";
        badgePerfil.className = "badge " + (usuario.perfil === "Admin" ? "disponivel" : "ocupado");
    }

    carregarFoto();
    corrigirCaminhosImagensQuebradas();
}

function corrigirCaminhosImagensQuebradas() {
    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => {
            const src = img.getAttribute('src');
            if (src && src.includes('camera.svg')) {
                img.onerror = null;
                img.src = 'assets/icons/camera.svg';
            }
        };
    });
}

if (btnSalvar) {
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
            if (novaSenha.length < 8) {
                mostrarToast("Senha fraca", "A nova senha deve ter pelo menos 8 caracteres.", "erro");
                return;
            }
            if (!/[A-Z]/.test(novaSenha)) {
                mostrarToast("Senha fraca", "A nova senha deve conter pelo menos uma letra maiúscula.", "erro");
                return;
            }
            if (!/[0-9]/.test(novaSenha)) {
                mostrarToast("Senha fraca", "A nova senha deve conter pelo menos um número.", "erro");
                return;
            }
            if (!/[^A-Za-z0-9]/.test(novaSenha)) {
                mostrarToast("Senha fraca", "A nova senha deve conter pelo menos um caractere especial (ex: !@#$).", "erro");
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

        if (nomeExibido) nomeExibido.textContent = novoNome;
        if (roleExibido) roleExibido.textContent = novoDepartamento || "Colaborador";
        if (inputSenhaAtual) inputSenhaAtual.value = "";
        if (inputNovaSenha) inputNovaSenha.value = "";

        mostrarToast("Salvo", "Suas alterações foram salvas com sucesso!", "sucesso");
    });
}

if (btnDescartar) {
    btnDescartar.addEventListener("click", () => {
        carregarPerfil();
        if (inputSenhaAtual) inputSenhaAtual.value = "";
        if (inputNovaSenha) inputNovaSenha.value = "";
        mostrarToast("Descartado", "As alterações foram descartadas.", "aviso");
    });
}

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

    if (!container.hasAttribute("popover")) container.setAttribute("popover", "manual");
    try { container.showPopover(); } catch (_) {}

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("saindo"), 3600);
    setTimeout(() => toast.remove(), 4000);
}

document.addEventListener("DOMContentLoaded", () => {

    garantirAdminDeskly();

    if (inputNome || inputEmail) {
        carregarPerfil();
    }

    const formLogin = document.getElementById('formLogin');
    const inputEmailLogin = document.getElementById('email');
    const inputSenhaLogin = document.getElementById('password');
    const checkLembrar = document.getElementById('lembrar');

    if (checkLembrar && inputEmailLogin) {
        const emailSalvo = localStorage.getItem('lembrar_email');
        if (emailSalvo) {
            inputEmailLogin.value = emailSalvo;
            checkLembrar.checked = true; 
        }
    }

    const SVG_OLHO_ABERTO = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`;

    const SVG_OLHO_FECHADO = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;

    function adicionarToggleSenha(input) {
        const wrapper = input.parentElement;
        if (!wrapper) return;
        wrapper.style.position = 'relative';
        input.style.paddingRight = '40px';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = SVG_OLHO_ABERTO;

        const atualizarPosicao = () => {
            const inputRect = input.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            const topRelativo = inputRect.top - wrapperRect.top + (inputRect.height / 2);
            btn.style.top = `${topRelativo}px`;
        };

        btn.style.cssText = `
            position: absolute;
            right: 10px;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #9CA3AF;
            padding: 0;
            display: flex;
            align-items: center;
            width: 18px;
            height: 18px;
        `;

        btn.addEventListener('click', () => {
            const visivel = input.type === 'text';
            input.type = visivel ? 'password' : 'text';
            btn.innerHTML = visivel ? SVG_OLHO_ABERTO : SVG_OLHO_FECHADO;
            btn.style.color = visivel ? '#9CA3AF' : '#6B7280';
        });

        wrapper.appendChild(btn);
        requestAnimationFrame(atualizarPosicao);
    }

    if (inputSenhaLogin) {
        adicionarToggleSenha(inputSenhaLogin);
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = inputEmailLogin.value.trim();
            const senha = inputSenhaLogin.value.trim();

            const usuarios = obterUsuarios();
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);

            if (!usuario) {
                alert('E-mail ou senha inválidos.');
                return;
            }

            if (checkLembrar && checkLembrar.checked) {
                localStorage.setItem('lembrar_email', email);
            } else {
                localStorage.removeItem('lembrar_email');
            }

            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            window.location.href = 'dashboard.html';
        });
    }
});