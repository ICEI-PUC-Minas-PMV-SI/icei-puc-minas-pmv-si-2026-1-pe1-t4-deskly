const modalConfirmacao = document.getElementById("modal-confirmacao")

document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = document.getElementById(btn.dataset.modal)
        if (modal.open) {
            modal.close()
        } else {
            modal.showModal()
        }
    })
})

document.getElementById("btn-confirmar-exclusao").addEventListener("click", () => {
    /* Adicionar lógica para apagar a reserva */
    modalConfirmacao.close()
})