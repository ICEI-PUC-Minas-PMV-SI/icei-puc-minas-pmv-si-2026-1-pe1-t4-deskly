const modalConfirmacao = document.getElementById("modal-confirmacao");

document.addEventListener("click", event => {
    const btn = event.target.closest("[data-modal]");

    if (!btn) return;

    const modal = document.getElementById(btn.dataset.modal);

    if (!modal) return;

    if (btn.dataset.modal === "modal-desativar-espaco" && btn.dataset.nome) {
        const nome = document.querySelector(".modal-desativar-nome");
        if (nome) nome.textContent = btn.dataset.nome;
    }

    if (btn.dataset.modal === "modal-ativar-espaco" && btn.dataset.nome) {
        const nome = document.querySelector(".modal-ativar-nome");
        if (nome) nome.textContent = btn.dataset.nome;
    }

    if (btn.dataset.modal === "modal-remover-usuario" && btn.dataset.nome) {
        const nome = document.querySelector(".modal-remover-nome");
        if (nome) nome.textContent = btn.dataset.nome;
    }

    if (modal.open) {
        modal.close();
    } else {
        modal.showModal();
    }
});

const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");
const btnConfirmarDesativar = document.getElementById("btn-confirmar-desativar");
const btnConfirmarAtivar = document.getElementById("btn-confirmar-ativar");
const btnConfirmarRemover = document.getElementById("btn-confirmar-remover");
const btnConfirmarConvidar = document.getElementById("btn-confirmar-convidar");

if (btnConfirmarExclusao && modalConfirmacao) {
    btnConfirmarExclusao.addEventListener("click", () => {
        modalConfirmacao.close();
    });
}

if (btnConfirmarDesativar) {
    btnConfirmarDesativar.addEventListener("click", () => {
        const modal = document.getElementById("modal-desativar-espaco");
        if (modal) modal.close();
    });
}

if (btnConfirmarAtivar) {
    btnConfirmarAtivar.addEventListener("click", () => {
        const modal = document.getElementById("modal-ativar-espaco");
        if (modal) modal.close();
    });
}

if (btnConfirmarRemover) {
    btnConfirmarRemover.addEventListener("click", () => {
        const modal = document.getElementById("modal-remover-usuario");
        if (modal) modal.close();
    });
}

