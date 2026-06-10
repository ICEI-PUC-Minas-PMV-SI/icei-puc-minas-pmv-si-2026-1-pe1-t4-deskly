function obterNotificacoes() {
    return JSON.parse(localStorage.getItem("notificacoes")) || [];
}

function salvarNotificacoes(notificacoes) {
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
}

function adicionarNotificacao(mensagem) {
    const notificacoes = obterNotificacoes();

    notificacoes.unshift({
        id: Date.now(),
        mensagem: mensagem,
        tempo: new Date().toLocaleString("pt-BR"),
        lida: false
    });

    salvarNotificacoes(notificacoes);
    carregarNotificacoes();
}

function carregarNotificacoes() {
    const lista = document.querySelector(".notification-list");
    const badge = document.querySelector(".notification-badge");

    if (!lista || !badge) return;

    const notificacoes = obterNotificacoes();

    lista.innerHTML = "";

    notificacoes.slice(0, 5).forEach(notificacao => {
        lista.innerHTML += `
            <div class="notification-item">
                <div class="notification-dot"></div>

                <div class="notification-content">
                    <span class="notification-text">${notificacao.mensagem}</span>
                    <span class="notification-time">${notificacao.tempo}</span>
                </div>
            </div>
        `;
    });

    badge.textContent = notificacoes.length;
    badge.style.display = notificacoes.length > 0 ? "flex" : "none";
}

function abrirModalNotificacoes() {
    const modal = document.getElementById("modalNotificacoes");
    const lista = document.getElementById("listaTodasNotificacoes");

    if (!modal || !lista) return;

    const notificacoes = obterNotificacoes();

    lista.innerHTML = "";

    if (notificacoes.length === 0) {
        lista.innerHTML = `
            <div class="modal-notificacao-item">
                <div class="modal-notificacao-dot"></div>

                <div class="modal-notificacao-conteudo">
                    <span class="modal-notificacao-texto">Nenhuma notificação encontrada.</span>
                    <span class="modal-notificacao-tempo">Quando houver reservas, elas aparecerão aqui.</span>
                </div>
            </div>
        `;
    } else {
        notificacoes.forEach(notificacao => {
            lista.innerHTML += `
                <div class="modal-notificacao-item">
                    <div class="modal-notificacao-dot"></div>

                    <div class="modal-notificacao-conteudo">
                        <span class="modal-notificacao-texto">${notificacao.mensagem}</span>
                        <span class="modal-notificacao-tempo">${notificacao.tempo}</span>
                    </div>
                </div>
            `;
        });
    }

    modal.classList.add("ativo");
}

function fecharModalNotificacoes() {
    const modal = document.getElementById("modalNotificacoes");

    if (modal) {
        modal.classList.remove("ativo");
    }
}

function limparNotificacoes() {
    localStorage.removeItem("notificacoes");

    carregarNotificacoes();

    const listaModal = document.getElementById("listaTodasNotificacoes");

    if (listaModal) {
        listaModal.innerHTML = `
            <div class="modal-notificacao-item">
                <div class="modal-notificacao-dot"></div>

                <div class="modal-notificacao-conteudo">
                    <span class="modal-notificacao-texto">Nenhuma notificação encontrada.</span>
                    <span class="modal-notificacao-tempo">Quando houver reservas, elas aparecerão aqui.</span>
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarNotificacoes();

    const btnLimpar = document.querySelector(".notification-clear");
    const btnFecharModal = document.getElementById("fecharModalNotificacoes");
    const modal = document.getElementById("modalNotificacoes");

    if (btnLimpar) {
        btnLimpar.addEventListener("click", limparNotificacoes);
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener("click", fecharModalNotificacoes);
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                fecharModalNotificacoes();
            }
        });
    }
});

document.addEventListener("click", event => {
    const btnVerTodas = event.target.closest(".ver-todas-notificacoes");

    if (!btnVerTodas) return;

    abrirModalNotificacoes();
});