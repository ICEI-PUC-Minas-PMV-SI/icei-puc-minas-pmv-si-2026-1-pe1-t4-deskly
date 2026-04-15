const btnHamburguer = document.getElementById('btn-hamburguer')
const aside = document.querySelector('aside')

btnHamburguer.addEventListener('click', function() {
    aside.classList.toggle('aberto')
    
    if (aside.classList.contains('aberto')) {
        btnHamburguer.innerHTML = '<img src="assets/icons/close-menu.svg" alt="Fechar menu">';
    } else {
        btnHamburguer.innerHTML = '<img src="assets/icons/menu.svg" alt="Abrir menu">';
    }
})

const logo = document.querySelector('.logo')

function trocarLogo() {
    if (window.innerWidth <= 768) {
        logo.src = 'assets/icons/logo-mobile.svg'
    } else {
        logo.src = 'assets/icons/logo.svg'
    }
}

// roda ao carregar e ao redimensionar
trocarLogo()
window.addEventListener('resize', trocarLogo)