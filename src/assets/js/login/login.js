document.addEventListener('DOMContentLoaded', () => {

    garantirAdminDeskly();

    const form = document.getElementById('formLogin');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('password');
    const checkLembrar = document.getElementById('lembrar');
    const emailSalvo = localStorage.getItem('lembrar_email');

    if (emailSalvo) {
        inputEmail.value = emailSalvo;
        checkLembrar.checked = true;
    }

    function mostrarToast(titulo, mensagem, tipo = "aviso") {
        const container = document.getElementById("toast-container");

        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${tipo}`;

        toast.innerHTML = `
            <strong>${titulo}</strong>
            <span>${mensagem}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (!usuario) {
            mostrarToast(
                "Login inválido",
                "E-mail ou senha estão incorretos.",
                "erro"
            );
            return;
        }

        if (checkLembrar.checked) {
            localStorage.setItem('lembrar_email', email);
        } else {
            localStorage.removeItem('lembrar_email');
        }

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        mostrarToast(
            "Login realizado",
            `Bem-vindo(a), ${usuario.nome}!`,
            "sucesso"
        );

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 900);
    });

});

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
            departamento: 'Tecnologia da Informação',
            telefone: '(00) 00000-0000'
        });
        salvarUsuarios(usuarios);
        return;
    }

    let mudou = false;

    if (!admin.protegido) {
        admin.protegido = true;
        mudou = true;
    }
    if (admin.departamento === undefined || admin.departamento === '') {
        admin.departamento = 'Sistema';
        mudou = true;
    }
    if (admin.telefone === undefined || admin.telefone === '') {
        admin.telefone = '(99) 99999-9999';
        mudou = true;
    }
    if (!admin.foto || admin.foto.includes('foto_padrao')) {
        admin.foto = caminhoFotoCorreto;
        mudou = true;
    }

    if (mudou) {
        salvarUsuarios(usuarios);
    }
}

function obterUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function salvarUsuarios(lista) {
    localStorage.setItem('usuarios', JSON.stringify(lista));
}