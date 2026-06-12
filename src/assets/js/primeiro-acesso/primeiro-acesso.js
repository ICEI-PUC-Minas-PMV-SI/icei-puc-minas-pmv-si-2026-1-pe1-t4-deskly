document.addEventListener('DOMContentLoaded', () => {

  const form        = document.querySelector('form');
  const inputEmail  = document.getElementById('email');
  const inputSenha  = document.getElementById('novaSenha');
  const inputConf   = document.getElementById('confirmarSenha');
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token') || '';
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario  = usuarios.find(u => u.token === token && !u.senhaDefinida);

  if (!token || !usuario) {
    exibirEstadoInvalido();
    return;
  }

  if (inputEmail) {
    inputEmail.value    = usuario.email;
    inputEmail.readOnly = true;
    inputEmail.style.background = '#F3F4F6';
    inputEmail.style.cursor     = 'not-allowed';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const senha     = inputSenha.value;
    const confirmar = inputConf.value;

    limparErros();

    let valido = true;

    if (senha.length < 8) {
      exibirErro(inputSenha, 'A senha deve ter pelo menos 8 caracteres.');
      valido = false;
    }

    if (senha !== confirmar) {
      exibirErro(inputConf, 'As senhas não coincidem.');
      valido = false;
    }

    if (!valido) return;

    const idx = usuarios.findIndex(u => u.token === token);
    if (idx === -1) return;

    usuarios[idx].senha         = btoa(senha);   
    usuarios[idx].senhaDefinida = true;
    usuarios[idx].token         = null;          

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    window.location.href = 'login.html?ativado=1';
  });

});


function exibirEstadoInvalido() {
  const formEl = document.querySelector('form');
  const h2     = document.querySelector('h2');

  if (h2) h2.textContent = 'Link inválido';

  if (formEl) {
    formEl.innerHTML = `
      <div style="text-align:center; padding: 8px 0 24px;">
        <p style="color:#6B7280; font-size:0.9rem; line-height:1.6; margin-bottom:24px;">
          Este link de ativação não é válido ou já foi utilizado.<br>
          Solicite um novo convite ao administrador.
        </p>
        <a href="login.html"
           style="display:inline-block; padding:10px 28px; background:var(--color-primary,#2563EB);
                  color:#fff; border-radius:8px; text-decoration:none; font-weight:600;">
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