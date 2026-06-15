document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form');
  const inputEmail = document.getElementById('email');
  const inputNome = document.getElementById('nome');
  const inputSenha = document.getElementById('novaSenha');
  const inputConf = document.getElementById('confirmarSenha');

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  const emailUrl = params.get('email') || '';
  const perfilUrl = params.get('perfil') || 'Usuário';

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  let usuario = usuarios.find(u => u.token === token && !u.senhaDefinida);

  if (!usuario && token && emailUrl) {
    usuario = {
      id: Date.now(),
      nome: '',
      email: emailUrl,
      senha: '',
      perfil: perfilUrl,
      token: token,
      senhaDefinida: false,
      dataCriacao: new Date().toISOString(),
      foto: ''
    };

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  if (!token || !usuario) {
    exibirEstadoInvalido();
    return;
  }

  if (inputEmail) {
    inputEmail.value = usuario.email;
    inputEmail.readOnly = true;
    inputEmail.style.background = '#F3F4F6';
    inputEmail.style.cursor = 'not-allowed';
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
    if (!input) return;

    const wrapper = input.parentElement;
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

  adicionarToggleSenha(inputSenha);
  adicionarToggleSenha(inputConf);

  const indicadorWrapper = document.createElement('div');
  indicadorWrapper.style.cssText = 'margin-top: 6px;';
  indicadorWrapper.innerHTML = `
    <div id="forca-barras" style="display:flex; gap:4px; margin-bottom:4px;">
      <span class="barra-forca" style="flex:1; height:4px; border-radius:2px; background:#E5E7EB;"></span>
      <span class="barra-forca" style="flex:1; height:4px; border-radius:2px; background:#E5E7EB;"></span>
      <span class="barra-forca" style="flex:1; height:4px; border-radius:2px; background:#E5E7EB;"></span>
      <span class="barra-forca" style="flex:1; height:4px; border-radius:2px; background:#E5E7EB;"></span>
    </div>
    <span id="forca-texto" style="font-size:0.75rem; color:#6B7280;"></span>
  `;

  inputSenha.parentElement.appendChild(indicadorWrapper);

  const barras = indicadorWrapper.querySelectorAll('.barra-forca');
  const forcaTexto = indicadorWrapper.querySelector('#forca-texto');

  function avaliarForca(senha) {
    let pontos = 0;

    if (senha.length >= 8) pontos++;
    if (senha.length >= 12) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (/[^A-Za-z0-9]/.test(senha)) pontos++;

    if (pontos <= 1) return { nivel: 1, label: 'Muito fraca', cor: '#EF4444' };
    if (pontos === 2) return { nivel: 2, label: 'Fraca', cor: '#F97316' };
    if (pontos === 3) return { nivel: 3, label: 'Média', cor: '#EAB308' };

    return { nivel: 4, label: 'Forte', cor: '#22C55E' };
  }

  inputSenha.addEventListener('input', () => {
    const senha = inputSenha.value;

    if (!senha) {
      barras.forEach(b => b.style.background = '#E5E7EB');
      forcaTexto.textContent = '';
      return;
    }

    const { nivel, label, cor } = avaliarForca(senha);

    barras.forEach((b, i) => {
      b.style.background = i < nivel ? cor : '#E5E7EB';
    });

    forcaTexto.textContent = label;
    forcaTexto.style.color = cor;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const senha = inputSenha.value;
    const confirmar = inputConf.value;

    limparErros();

    let valido = true;

    if (!nome) {
      exibirErro(inputNome, 'Informe seu nome completo.');
      valido = false;
    }

    if (senha.length < 8) {
      exibirErro(inputSenha, 'A senha deve ter pelo menos 8 caracteres.');
      valido = false;
    } else if (!/[A-Z]/.test(senha)) {
      exibirErro(inputSenha, 'A senha deve conter pelo menos uma letra maiúscula.');
      valido = false;
    } else if (!/[0-9]/.test(senha)) {
      exibirErro(inputSenha, 'A senha deve conter pelo menos um número.');
      valido = false;
    } else if (!/[^A-Za-z0-9]/.test(senha)) {
      exibirErro(inputSenha, 'A senha deve conter pelo menos um caractere especial.');
      valido = false;
    }

    if (senha !== confirmar) {
      exibirErro(inputConf, 'As senhas não coincidem.');
      valido = false;
    }

    if (!valido) return;

    const idx = usuarios.findIndex(u => u.token === token);

    if (idx === -1) {
      exibirEstadoInvalido();
      return;
    }

    usuarios[idx].nome = nome;
    usuarios[idx].email = usuario.email;
    usuarios[idx].perfil = usuario.perfil;
    usuarios[idx].senha = senha;
    usuarios[idx].senhaDefinida = true;
    usuarios[idx].token = null;

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    window.location.href = 'login.html?ativado=1';
  });

});

function exibirEstadoInvalido() {
  const formEl = document.querySelector('form');
  const h2 = document.querySelector('h2');

  if (h2) h2.textContent = 'Link inválido';

  if (formEl) {
    formEl.innerHTML = `
      <div style="text-align:center; padding: 8px 0 24px;">
        <p style="color:#6B7280; font-size:0.9rem; line-height:1.6; margin-bottom:24px;">
          Este link de ativação não é válido ou já foi utilizado.<br>
          Solicite um novo convite ao administrador.
        </p>
        <a href="login.html" class="primeiroacesso-button" style="display:block; text-decoration:none; text-align:center;">
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
    span.style.cssText = 'color:#EF4444; font-size:0.78rem; margin-top:4px; display:block;';
    input.parentElement.appendChild(span);
  }

  span.textContent = mensagem;
}

function limparErros() {
  document.querySelectorAll('.erro-msg').forEach(el => el.remove());
  document.querySelectorAll('input').forEach(el => el.style.borderColor = '');
}