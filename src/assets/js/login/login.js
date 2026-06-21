document.addEventListener('DOMContentLoaded', () => {
    garantirAdminDeskly();

    const form        = document.getElementById('formulario-login');
    const inputEmail  = document.getElementById('email');
    const inputSenha  = document.getElementById('senha');
    const checkLembrar = document.getElementById('lembrar');

    const emailSalvo = localStorage.getItem('lembrar_email');
    if (emailSalvo) {
        inputEmail.value   = emailSalvo;
        checkLembrar.checked = true;
    }

    adicionarToggleSenha(inputSenha);

    const params = new URLSearchParams(window.location.search);
    if (params.get('ativado') === '1') {
        mostrarToast('Conta ativada', 'Sua conta foi ativada. Faça login para entrar.', 'sucesso');
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email   = inputEmail.value.trim();
        const senha   = inputSenha.value.trim();
        const usuario = obterUsuarios().find(u => u.email === email && u.senha === senha);

        if (!usuario) {
            mostrarToast('Login inválido', 'E-mail ou senha incorretos.', 'erro');
            return;
        }

        if (checkLembrar.checked) {
            localStorage.setItem('lembrar_email', email);
        } else {
            localStorage.removeItem('lembrar_email');
        }

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        mostrarToast('Login realizado', `Bem-vindo(a), ${usuario.nome}!`, 'sucesso');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    });
});
