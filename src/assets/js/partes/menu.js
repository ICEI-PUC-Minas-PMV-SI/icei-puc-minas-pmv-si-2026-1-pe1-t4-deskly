const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const linkPainelAdmin = usuarioLogado?.perfil === "Admin"
    ? `<li><a href="painelAdmin.html">Painel Admin</a></li>`
    : "";

const headerHTML = `
<a href="dashboard.html">
    <img class="logo" src="assets/icons/logo.svg" alt="Logo Deskly">
</a>

<div class="header-icons">

    <div class="notification-container">

        <button class="notification-btn">
            <img class="header-icon" src="assets/icons/bell.svg" alt="Notificações">
            <span class="notification-badge"></span>
        </button>

        <div class="notification-menu">

            <div class="notification-header">
                <h3>Notificações</h3>
                <span class="notification-clear">Limpar todas</span>
            </div>

            <div class="notification-list">

            </div>

            <div class="notification-footer ver-todas-notificacoes">
                <span>Ver todas as notificações</span>
                <span class="notification-arrow"></span>
            </div>

        </div>

    </div>

    <a href="perfil.html" class="header-profile-link">
        <img class="header-icon"
             src="assets/icons/user-circle.svg"
             alt="Perfil">
    </a>

    <button type="button"
            id="btn-hamburguer"
            class="hamburguer">
        <img src="assets/icons/menu.svg"
             alt="Botão">
    </button>

</div>

<div class="modal-notificacoes-overlay" id="modalNotificacoes">

    <div class="modal-notificacoes">

        <div class="modal-notificacoes-header">
            <h3>Todas as notificações</h3>

            <button type="button"
                    id="fecharModalNotificacoes">
                ×
            </button>
        </div>

        <div class="modal-notificacoes-lista"
             id="listaTodasNotificacoes">

        </div>

    </div>

</div>
`;

const asideHTML = `
<nav>
    <ul>
        <li><a href="dashboard.html">Dashboard</a></li>
        <li><a href="calendario.html">Calendário</a></li>
        <li><a href="salas-reuniao.html">Salas de Reunião</a></li>
        <li><a href="estacoes.html">Estações de Trabalho</a></li>
        <li><a href="minhas-reservas.html">Minhas Reservas</a></li>
    </ul>

    <ul>
        ${linkPainelAdmin}
        <li><a href="ajuda.html">Ajuda</a></li>
    </ul>
</nav>
`;

document.querySelector('#header').innerHTML = headerHTML;
document.querySelector('#aside').innerHTML = asideHTML;

const btnHamburguer = document.getElementById('btn-hamburguer');
const aside = document.querySelector('aside');

btnHamburguer.addEventListener('click', function () {
    aside.classList.toggle('aberto');

    if (aside.classList.contains('aberto')) {
        btnHamburguer.innerHTML =
            '<img src="assets/icons/close-menu.svg" alt="Fechar menu">';
    } else {
        btnHamburguer.innerHTML =
            '<img src="assets/icons/menu.svg" alt="Abrir menu">';
    }
});

const logo = document.querySelector('.logo');

function trocarLogo() {
    if (window.innerWidth <= 768) {
        logo.src = 'assets/icons/logo-mobile.svg';
    } else {
        logo.src = 'assets/icons/logo.svg';
    }
}

trocarLogo();
window.addEventListener('resize', trocarLogo);

const notificationBtn = document.querySelector(".notification-btn");
const notificationMenu = document.querySelector(".notification-menu");

notificationBtn.addEventListener("click", () => {
    notificationMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (
        !notificationMenu.contains(e.target) &&
        !notificationBtn.contains(e.target)
    ) {
        notificationMenu.classList.remove("active");
    }
});