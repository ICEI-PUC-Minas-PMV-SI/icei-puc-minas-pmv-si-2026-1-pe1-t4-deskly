function obterNotificacoes() {
    return JSON.parse(localStorage.getItem("notificacoes")) || [];
}

function salvarNotificacoes(notificacoes) {
    localStorage.setItem(
        "notificacoes",
        JSON.stringify(notificacoes)
    );
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

    const notificacoesVisiveis = notificacoes.slice(0, 5);

    notificacoesVisiveis.forEach(notificacao => {
        lista.innerHTML += `
            <div class="notification-item">
                <div class="notification-dot"></div>
                <div class="notification-content">
                    <span class="notification-text">
                        ${notificacao.mensagem}
                    </span>
                    <span class="notification-time">
                        ${notificacao.tempo}
                    </span>
                </div>
            </div>
        `;
    });

    badge.textContent = notificacoes.length;

    badge.style.display =
        notificacoes.length > 0 ? "flex" : "none";
}

document.addEventListener("DOMContentLoaded", () => {

    carregarNotificacoes();

    const btnLimpar = document.querySelector(".notification-clear");

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            localStorage.removeItem("notificacoes");
            carregarNotificacoes();
        });
    }
});

document.addEventListener("click", (event) => {

    const btnVerTodas = event.target.closest(".ver-todas-notificacoes");

    if (!btnVerTodas) return;

    const notificacoes = obterNotificacoes();

    if (notificacoes.length === 0) {
        alert("Nenhuma notificação encontrada.");
        return;
    }

    let mensagem = "TODAS AS NOTIFICAÇÕES\n\n";

    notificacoes.forEach((notificacao, index) => {
        mensagem += `${index + 1}. ${notificacao.mensagem}\n`;
        mensagem += `${notificacao.tempo}\n\n`;
    });

    alert(mensagem);
});