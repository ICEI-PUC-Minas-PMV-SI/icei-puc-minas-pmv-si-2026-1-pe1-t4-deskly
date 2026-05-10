const modalConfirmacao = document.getElementById("modal-confirmacao")

document.querySelectorAll(".open-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal
        document.getElementById(modalId).showModal()
    })
})

document.getElementById("btn-fechar-modal").addEventListener("click", () => {
    modalConfirmacao.close()
})

document.getElementById("btn-confirmar-exclusao").addEventListener("click", () => {
    /* Adicionar lógica para apgar oa reserva */
    modalConfirmacao.close()
})

document.getElementById("modal-confirmacao-btn-cancelar").addEventListener("click", () => {
    modalConfirmacao.close()
})

document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal
        document.getElementById(modalId).close()
    })
})