const modalConfirmacao = document.getElementById("modal-confirmacao")

document.querySelectorAll(".open-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal
        document.getElementById(modalId).showModal()
    })
})

document.getElementById("btn-confirmar-exclusao").addEventListener("click", () => {
    console.log("reserva excluída")
    modalConfirmacao.close()
})

document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const modalId = btn.dataset.modal
        document.getElementById(modalId).close()
    })
})