// Gerencia abertura/fechamento de modais via delegação de eventos.
// Botões com .open-modal[data-modal] abrem; .close-modal[data-modal] fecham.

document.addEventListener('click', e => {
    const openBtn = e.target.closest('.open-modal[data-modal]');
    if (openBtn && !openBtn.disabled) {
        const modal = document.getElementById(openBtn.dataset.modal);
        if (modal && !modal.open) modal.showModal();
        return;
    }
    const closeBtn = e.target.closest('.close-modal[data-modal]');
    if (closeBtn) {
        const modal = document.getElementById(closeBtn.dataset.modal);
        if (modal) modal.close();
    }
});
