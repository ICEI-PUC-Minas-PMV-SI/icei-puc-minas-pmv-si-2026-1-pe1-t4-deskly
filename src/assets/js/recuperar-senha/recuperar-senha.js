document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('novaSenha');
  const inputConf = document.getElementById('confirmarSenha');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim().toLowerCase();
    const senha = inputSenha.value;
    const confirmar = inputConf.value;

    limparErros();

    let valido = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      exibirErro(inputEmail, 'Informe um e-mail válido.');
      valido = false;
    }

    if (senha.length < 8) {
      exibirErro(inputSenha, 'A senha deve ter pelo menos 8 caracteres.');
      valido = false;
    }

    if (senha !== confirmar) {
      exibirErro(inputConf, 'As senhas não coincidem.');
      valido = false;
    }

    if (!valido) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const idx = usuarios.findIndex(u => u.email === email);

    if (idx === -1) {
      exibirErro(inputEmail, 'Nenhuma conta encontrada com este e-mail.');
      return;
    }

    if (!usuarios[idx].senhaDefinida) {
      exibirErro(inputEmail, 'Esta conta ainda não foi ativada. Use o link do convite.');
      return;
    }

    usuarios[idx].senha = btoa(senha);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    window.location.href = 'login.html?senha_redefinida=1';
  });

});

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