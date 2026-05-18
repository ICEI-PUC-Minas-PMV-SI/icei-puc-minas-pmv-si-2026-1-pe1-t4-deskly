const modalConfirmacao = document.getElementById("modal-confirmacao")

document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = document.getElementById(btn.dataset.modal)
        if (modal.open) {
            modal.close()
        } else {
            if (btn.dataset.modal === "modal-desativar-espaco" && btn.dataset.nome) {
                document.querySelector(".modal-desativar-nome").textContent = btn.dataset.nome
            }
            if (btn.dataset.modal === "modal-ativar-espaco" && btn.dataset.nome) {
                document.querySelector(".modal-ativar-nome").textContent = btn.dataset.nome
            }
            if (btn.dataset.modal === "modal-remover-usuario" && btn.dataset.nome) {
                document.querySelector(".modal-remover-nome").textContent = btn.dataset.nome
            }
            modal.showModal()
        }
    })
})

document.getElementById("btn-confirmar-exclusao").addEventListener("click", () => {
    modalConfirmacao.close()
})

document.getElementById("btn-confirmar-desativar").addEventListener("click", () => {
    document.getElementById("modal-desativar-espaco").close()
})

document.getElementById("btn-confirmar-ativar").addEventListener("click", () => {
    document.getElementById("modal-ativar-espaco").close()
})

document.getElementById("btn-confirmar-remover").addEventListener("click", () => {
    document.getElementById("modal-remover-usuario").close()
})

document.getElementById("btn-confirmar-convidar").addEventListener("click", () => {
    document.getElementById("modal-convidar-usuario").close()
})