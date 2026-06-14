document.addEventListener('DOMContentLoaded', () => {

  const form     = document.getElementById('formLogin');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('password');
  const checkLembrar = document.getElementById('lembrar');
  const emailSalvo = localStorage.getItem('lembrar_email');

  if (emailSalvo) {
    inputEmail.value      = emailSalvo;
    checkLembrar.checked  = true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario  = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
      alert('E-mail ou senha inválidos.');
      return;
    }

    if (checkLembrar.checked) {
      localStorage.setItem('lembrar_email', email);
    } else {
      localStorage.removeItem('lembrar_email');
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    window.location.href = 'dashboard.html';
  });

});