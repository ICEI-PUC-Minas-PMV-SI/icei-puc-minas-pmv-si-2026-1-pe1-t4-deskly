function obterSessao() {
    return JSON.parse(sessionStorage.getItem('usuarioLogado'))
        || JSON.parse(localStorage.getItem('usuarioLogado'))
        || null;
}

function chaveUsuario(sessao) {
    return `foto_${sessao.id ?? sessao.email ?? 'anonimo'}`;
}

const inputNome         = document.getElementById('nome');
const inputEmail        = document.getElementById('email');
const inputDepartamento = document.getElementById('departamento');
const inputTelefone     = document.getElementById('telefone');
const inputSenhaAtual   = document.getElementById('senha-atual');
const inputNovaSenha    = document.getElementById('nova-senha');
const nomeExibido       = document.querySelector('.card-perfil-resumo h2');
const roleExibido       = document.querySelector('.card-perfil-resumo .user-role');
const badgePerfil       = document.querySelector('.card-perfil-resumo .badge');
const btnSalvar         = document.querySelector('.btn-reservar[type="submit"]');
const btnDescartar      = document.querySelector('.btn-detalhes');
const btnLogout         = document.getElementById('btn-logout');
const avatarEl          = document.getElementById('perfil-avatar');
const avatarOverlay     = document.getElementById('avatar-overlay');
const inputFoto         = document.getElementById('campo-foto');

if (inputTelefone) {
    inputTelefone.addEventListener('input', () => {
        let v = inputTelefone.value.replace(/\D/g, '').slice(0, 11);
        v = v.length <= 10
            ? v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
            : v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        inputTelefone.value = v;
    });
}

function aplicarFoto(blob) {
    if (!avatarEl) return;
    const url = URL.createObjectURL(blob);
    avatarEl.innerHTML = `<img src="${url}" alt="Foto de perfil" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
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
                const usuario = obterUsuarios().find(u => u.id === sessao.id || u.email === sessao.email) || sessao;
                if (usuario && usuario.foto) {
                    const img = document.createElement('img');
                    img.src = usuario.foto;
                    img.alt = 'Foto de perfil';
                    img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;';
                    img.onerror = () => substituirPorAvatarPadrao(img, usuario.nome || 'Deskly');
                    avatarEl.innerHTML = '';
                    avatarEl.appendChild(img);
                } else {
                    avatarEl.innerHTML = `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome || 'Deskly')}&background=6B7280&color=fff" alt="Foto de perfil" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                }
            }
        })
        .catch(() => {});
}

if (avatarOverlay && inputFoto) avatarOverlay.addEventListener('click', () => inputFoto.click());
if (avatarEl && inputFoto)      avatarEl.addEventListener('click', () => inputFoto.click());

if (inputFoto) {
    inputFoto.addEventListener('change', () => {
        const arquivo = inputFoto.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            mostrarToast('Arquivo inválido', 'Selecione uma imagem (JPG, PNG, etc.).', 'erro');
            return;
        }

        const sessao = obterSessao();
        if (!sessao) return;

        salvarFotoDB(chaveUsuario(sessao), arquivo)
            .then(() => {
                aplicarFoto(arquivo);
                mostrarToast('Foto atualizada', 'Sua foto de perfil foi salva.', 'sucesso');

                const reader = new FileReader();
                reader.onloadend = () => {
                    const lista  = obterUsuarios();
                    const index  = lista.findIndex(u => u.id === sessao.id || u.email === sessao.email);
                    if (index !== -1) {
                        lista[index].foto = reader.result;
                        salvarUsuarios(lista);
                    }
                };
                reader.readAsDataURL(arquivo);
            })
            .catch(() => mostrarToast('Erro', 'Não foi possível salvar a foto.', 'erro'));

        inputFoto.value = '';
    });
}

function carregarPerfil() {
    const sessao = obterSessao();
    if (!sessao) {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const usuario = obterUsuarios().find(u => u.id === sessao.id || u.email === sessao.email) || sessao;

    if (inputNome)         inputNome.value         = usuario.nome         || '';
    if (inputEmail)        inputEmail.value         = usuario.email        || '';
    if (inputDepartamento) inputDepartamento.value  = usuario.departamento || '';
    if (inputTelefone)     inputTelefone.value      = usuario.telefone     || '';

    if (nomeExibido) nomeExibido.textContent = usuario.nome || '—';
    if (roleExibido) roleExibido.textContent = usuario.departamento || 'Colaborador';

    if (badgePerfil) {
        badgePerfil.textContent = usuario.perfil || 'Usuário';
        badgePerfil.className   = 'badge ' + (usuario.perfil === 'Admin' ? 'disponivel' : 'ocupado');
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
    btnSalvar.addEventListener('click', e => {
        e.preventDefault();
        const sessao = obterSessao();
        if (!sessao) return;

        const lista = obterUsuarios();
        let index   = lista.findIndex(u => u.id === sessao.id || u.email === sessao.email);
        if (index === -1) {
            lista.push({ ...sessao, telefone: '', departamento: '', senha: '' });
            index = lista.length - 1;
        }

        const novoNome        = inputNome.value.trim();
        const novoDepartamento = inputDepartamento.value.trim();
        const novoTelefone    = inputTelefone.value.trim();
        const senhaAtual      = inputSenhaAtual.value;
        const novaSenha       = inputNovaSenha.value;

        if (!novoNome) {
            marcarCampoInvalido(inputNome);
            mostrarToast('Campo obrigatório', 'O nome não pode ficar vazio.', 'erro');
            return;
        }

        const telefoneLimpo = novoTelefone.replace(/\D/g, '');
        if (novoTelefone && (telefoneLimpo.length < 10 || telefoneLimpo.length > 11)) {
            marcarCampoInvalido(inputTelefone);
            mostrarToast('Telefone inválido', 'Informe um telefone válido: (00) 00000-0000.', 'erro');
            return;
        }

        if (senhaAtual || novaSenha) {
            if (!senhaAtual || !novaSenha) {
                if (!senhaAtual) marcarCampoInvalido(inputSenhaAtual);
                if (!novaSenha)  marcarCampoInvalido(inputNovaSenha);
                mostrarToast('Campos de senha', 'Preencha a senha atual e a nova senha.', 'erro');
                return;
            }
            if (lista[index].senha && lista[index].senha !== senhaAtual) {
                mostrarToast('Senha incorreta', 'A senha atual informada está incorreta.', 'erro');
                return;
            }
            if (novaSenha.length < 8) {
                mostrarToast('Senha fraca', 'A nova senha deve ter pelo menos 8 caracteres.', 'erro');
                return;
            }
            if (!/[A-Z]/.test(novaSenha)) {
                mostrarToast('Senha fraca', 'A nova senha deve conter pelo menos uma letra maiúscula.', 'erro');
                return;
            }
            if (!/[0-9]/.test(novaSenha)) {
                mostrarToast('Senha fraca', 'A nova senha deve conter pelo menos um número.', 'erro');
                return;
            }
            if (!/[^A-Za-z0-9]/.test(novaSenha)) {
                mostrarToast('Senha fraca', 'A nova senha deve conter pelo menos um caractere especial (ex: !@#$).', 'erro');
                return;
            }
            lista[index].senha = novaSenha;
        }

        lista[index].nome         = novoNome;
        lista[index].departamento = novoDepartamento;
        lista[index].telefone     = novoTelefone;
        salvarUsuarios(lista);

        const novaSessao = { ...sessao, nome: novoNome, departamento: novoDepartamento, telefone: novoTelefone };
        if (sessionStorage.getItem('usuarioLogado')) sessionStorage.setItem('usuarioLogado', JSON.stringify(novaSessao));
        if (localStorage.getItem('usuarioLogado'))   localStorage.setItem('usuarioLogado',   JSON.stringify(novaSessao));

        if (nomeExibido) nomeExibido.textContent = novoNome;
        if (roleExibido) roleExibido.textContent = novoDepartamento || 'Colaborador';
        if (inputSenhaAtual) inputSenhaAtual.value = '';
        if (inputNovaSenha)  inputNovaSenha.value  = '';

        mostrarToast('Salvo', 'Suas alterações foram salvas com sucesso!', 'sucesso');
    });
}

if (btnDescartar) {
    btnDescartar.addEventListener('click', () => {
        carregarPerfil();
        if (inputSenhaAtual) inputSenhaAtual.value = '';
        if (inputNovaSenha)  inputNovaSenha.value  = '';
        mostrarToast('Descartado', 'As alterações foram descartadas.', 'aviso');
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('usuarioLogado');
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    garantirAdminDeskly();
    if (inputNome || inputEmail) carregarPerfil();
});
