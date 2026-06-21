document.addEventListener('DOMContentLoaded', () => {
    const form      = document.querySelector('form');
    const inputEmail = document.getElementById('email');
    const inputNome  = document.getElementById('nome');
    const inputSenha = document.getElementById('novaSenha');
    const inputConf  = document.getElementById('confirmarSenha');

    const params   = new URLSearchParams(window.location.search);
    const token    = params.get('token')  || '';
    const emailUrl = params.get('email')  || '';
    const perfilUrl = params.get('perfil') || 'Usuário';

    let usuarios = obterUsuarios();
    let usuario  = usuarios.find(u => u.token === token && !u.senhaDefinida);

    if (!usuario && token && emailUrl) {
        usuario = {
            id: Date.now(), nome: '', email: emailUrl, senha: '',
            perfil: perfilUrl, token, senhaDefinida: false,
            dataCriacao: new Date().toISOString(), foto: ''
        };
        usuarios.push(usuario);
        salvarUsuarios(usuarios);
    }

    if (!token || !usuario) { exibirEstadoInvalido(); return; }

    if (inputEmail) {
        inputEmail.value    = usuario.email;
        inputEmail.readOnly = true;
        inputEmail.style.background = '#F3F4F6';
        inputEmail.style.cursor     = 'not-allowed';
    }

    adicionarToggleSenha(inputSenha);
    adicionarToggleSenha(inputConf);

    // Indicador de força de senha
    const indicadorWrapper = document.createElement('div');
    indicadorWrapper.style.cssText = 'margin-top:6px;';
    indicadorWrapper.innerHTML = `
        <div style="display:flex;gap:4px;margin-bottom:4px;">
            <span class="barra-forca" style="flex:1;height:4px;border-radius:2px;background:#E5E7EB;"></span>
            <span class="barra-forca" style="flex:1;height:4px;border-radius:2px;background:#E5E7EB;"></span>
            <span class="barra-forca" style="flex:1;height:4px;border-radius:2px;background:#E5E7EB;"></span>
            <span class="barra-forca" style="flex:1;height:4px;border-radius:2px;background:#E5E7EB;"></span>
        </div>
        <span id="forca-texto" style="font-size:0.75rem;color:#6B7280;"></span>`;
    inputSenha.parentElement.appendChild(indicadorWrapper);

    const barras     = indicadorWrapper.querySelectorAll('.barra-forca');
    const forcaTexto = indicadorWrapper.querySelector('#forca-texto');

    function avaliarForca(senha) {
        let p = 0;
        if (senha.length >= 8)          p++;
        if (senha.length >= 12)         p++;
        if (/[A-Z]/.test(senha))        p++;
        if (/[0-9]/.test(senha))        p++;
        if (/[^A-Za-z0-9]/.test(senha)) p++;
        if (p <= 1) return { nivel: 1, label: 'Muito fraca', cor: '#EF4444' };
        if (p === 2) return { nivel: 2, label: 'Fraca',       cor: '#F97316' };
        if (p === 3) return { nivel: 3, label: 'Média',       cor: '#EAB308' };
        return                { nivel: 4, label: 'Forte',       cor: '#22C55E' };
    }

    inputSenha.addEventListener('input', () => {
        const senha = inputSenha.value;
        if (!senha) {
            barras.forEach(b => b.style.background = '#E5E7EB');
            forcaTexto.textContent = '';
            return;
        }
        const { nivel, label, cor } = avaliarForca(senha);
        barras.forEach((b, i) => { b.style.background = i < nivel ? cor : '#E5E7EB'; });
        forcaTexto.textContent = label;
        forcaTexto.style.color = cor;
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nome     = inputNome.value.trim();
        const senha    = inputSenha.value;
        const confirmar = inputConf.value;
        limparErros();
        let valido = true;

        if (!nome) { exibirErro(inputNome, 'Informe seu nome completo.'); valido = false; }

        if (senha.length < 8) {
            exibirErro(inputSenha, 'A senha deve ter pelo menos 8 caracteres.'); valido = false;
        } else if (!/[A-Z]/.test(senha)) {
            exibirErro(inputSenha, 'A senha deve conter pelo menos uma letra maiúscula.'); valido = false;
        } else if (!/[0-9]/.test(senha)) {
            exibirErro(inputSenha, 'A senha deve conter pelo menos um número.'); valido = false;
        } else if (!/[^A-Za-z0-9]/.test(senha)) {
            exibirErro(inputSenha, 'A senha deve conter pelo menos um caractere especial.'); valido = false;
        }

        if (senha !== confirmar) { exibirErro(inputConf, 'As senhas não coincidem.'); valido = false; }
        if (!valido) return;

        const lista = obterUsuarios();
        const idx   = lista.findIndex(u => u.token === token);
        if (idx === -1) { exibirEstadoInvalido(); return; }

        lista[idx].nome         = nome;
        lista[idx].senha        = senha;
        lista[idx].senhaDefinida = true;
        lista[idx].token        = null;
        salvarUsuarios(lista);

        window.location.href = 'login.html?ativado=1';
    });
});

function exibirEstadoInvalido() {
    const formEl = document.querySelector('form');
    const h2     = document.querySelector('h2');
    if (h2) h2.textContent = 'Link inválido';
    if (formEl) {
        formEl.innerHTML = `
            <div style="text-align:center;padding:8px 0 24px;">
                <p style="color:#6B7280;font-size:0.9rem;line-height:1.6;margin-bottom:24px;">
                    Este link de ativação não é válido ou já foi utilizado.<br>
                    Solicite um novo convite ao administrador.
                </p>
                <a href="login.html" class="primeiroacesso-button" style="display:block;text-decoration:none;text-align:center;">
                    Ir para o login
                </a>
            </div>`;
    }
}

function exibirErro(input, mensagem) {
    input.style.borderColor = '#EF4444';
    let span = input.parentElement.querySelector('.erro-msg');
    if (!span) {
        span = document.createElement('span');
        span.className = 'erro-msg';
        span.style.cssText = 'color:#EF4444;font-size:0.78rem;margin-top:4px;display:block;';
        input.parentElement.appendChild(span);
    }
    span.textContent = mensagem;
}

function limparErros() {
    document.querySelectorAll('.erro-msg').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(el => el.style.borderColor = '');
}
