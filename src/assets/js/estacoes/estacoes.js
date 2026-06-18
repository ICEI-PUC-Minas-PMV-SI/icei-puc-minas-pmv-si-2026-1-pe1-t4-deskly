const btnNovaReserva = document.querySelector(".btn-primary.open-modal");
const btnConfirmar = document.querySelector(".modal-footer button:last-child");
const btnFiltrar = document.querySelector(".btn-filtrar");

const modal = document.getElementById("modal-1");
const selectEstacao = document.querySelector("#modal-1 select");
const inputDataModal = document.querySelector(".modal-date-input");
const inputFiltroData = document.querySelector(".date-input");
const inputFiltroInicio = document.querySelector(".filtro-inicio");
const inputFiltroFim = document.querySelector(".filtro-fim");

const horarios = document.querySelectorAll('#modal-1 input[type="time"]');
const inputInicio = horarios[0];
const inputFim = horarios[1];

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");

    if (!container) return;

    if (!container.hasAttribute("popover")) container.setAttribute("popover", "manual");
    try {
        if (container.matches(":popover-open")) container.hidePopover();
        container.showPopover();
    } catch (_) {}

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;

    toast.innerHTML = `
        <strong>${titulo}</strong>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function buscarEspacosSistema() {
    return JSON.parse(localStorage.getItem("espacosSistema")) || [];
}

function buscarReservas() {
    return JSON.parse(localStorage.getItem("reservasEstacoes")) || [];
}

function salvarReservas(reservas) {
    localStorage.setItem("reservasEstacoes", JSON.stringify(reservas));
}

function buscarReservasSistema() {
    return JSON.parse(localStorage.getItem("reservasSistema")) || [];
}

function salvarReservasSistema(reservas) {
    localStorage.setItem("reservasSistema", JSON.stringify(reservas));
}

function gerarCardsEstacoesDoSistema() {
    const lista = document.querySelector(".estacoes-lista");
    const espacos = buscarEspacosSistema();

    if (!lista) return;

    const estacoes = espacos.filter(espaco =>
        espaco.tipo === "Estação de Trabalho"
    );

    lista.innerHTML = "";

    estacoes.forEach(espaco => {
        const imagem = espaco.imagem || `assets/images/${espaco.nome}.png`;
        const classeBadge = espaco.status === "Inativo" ? "inativa" : "disponivel";
        const textoBadge = espaco.status === "Inativo" ? "Inativa" : "Disponível";
        const disabled = espaco.status === "Inativo" ? "disabled" : "";

        lista.innerHTML += `
            <div class="estacao-card" data-inativa="${espaco.status === "Inativo"}">
                <div class="estacao-info">
                    <img class="estacao-icon" src="${imagem}" alt="${espaco.nome}">
                    <div>
                        <h4>${espaco.nome}</h4>
                        <span class="subtitle">Área: ${espaco.area}</span>
                    </div>
                </div>

                <div class="estacao-acoes">
                    <span class="badge ${classeBadge}">${textoBadge}</span>
                    <button class="fast-action-btn open-modal"
                            data-modal="modal-1"
                            ${disabled}>
                        Reservar
                    </button>
                </div>
            </div>
        `;
    });

    atualizarSelectTodasEstacoes();
}

function atualizarSelectTodasEstacoes() {
    const espacos = buscarEspacosSistema();

    const estacoes = espacos.filter(espaco =>
        espaco.tipo === "Estação de Trabalho"
    );

    selectEstacao.innerHTML = "";

    estacoes.forEach(espaco => {
        const option = document.createElement("option");
        option.textContent = `${espaco.nome} — ${espaco.area}`;
        option.value = `${espaco.nome} — ${espaco.area}`;
        selectEstacao.appendChild(option);
    });
}

function atualizarSelectUmaEstacao(estacao) {
    selectEstacao.innerHTML = "";

    const option = document.createElement("option");
    option.textContent = estacao;
    option.value = estacao;
    selectEstacao.appendChild(option);
}

function obterNomeEstacaoPeloCard(card) {
    const nomeMesa = card.querySelector("h4").textContent.trim();
    const area = card.querySelector(".subtitle").textContent.replace("Área: ", "").trim();

    return `${nomeMesa} — ${area}`;
}

function salvarReservaNoSistema(reserva) {
    const reservasSistema = buscarReservasSistema();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        mostrarToast("Usuário não encontrado", "Faça login novamente para realizar a reserva.", "erro");
        return;
    }

    const reservaSistema = {
        id: reserva.id,
        usuarioId: usuarioLogado.id,
        usuario: usuarioLogado.nome,
        tipo: "Estação de Trabalho",
        espaco: reserva.estacao,
        data: reserva.data,
        inicio: reserva.inicio,
        fim: reserva.fim,
        horario: `${reserva.inicio} – ${reserva.fim}`,
        convidados: "-",
        status: "Confirmada"
    };

    reservasSistema.unshift(reservaSistema);
    salvarReservasSistema(reservasSistema);
}

function converterHorarioParaMinutos(horario) {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
}

function horariosConflitam(inicio1, fim1, inicio2, fim2) {
    const i1 = converterHorarioParaMinutos(inicio1);
    const f1 = converterHorarioParaMinutos(fim1);
    const i2 = converterHorarioParaMinutos(inicio2);
    const f2 = converterHorarioParaMinutos(fim2);

    return i1 < f2 && f1 > i2;
}

document.addEventListener("click", event => {
    const botao = event.target.closest(".fast-action-btn");

    if (!botao) return;
    if (botao.disabled) return;

    const card = botao.closest(".estacao-card");

    if (!card) return;
    if (card.dataset.inativa === "true") return;

    const estacao = obterNomeEstacaoPeloCard(card);

    atualizarSelectUmaEstacao(estacao);

    if (!modal.open) {
        modal.showModal();
    }
});

btnNovaReserva.addEventListener("click", () => {
    atualizarSelectTodasEstacoes();
});

btnConfirmar.addEventListener("click", () => {
    const estacao = selectEstacao.value;
    const data = inputDataModal.value;
    const inicio = inputInicio.value;
    const fim = inputFim.value;

    if (!estacao || !data || !inicio || !fim) {
        mostrarToast("Campos obrigatórios", "Preencha todos os campos da reserva.", "erro");
        return;
    }

    if (inicio >= fim) {
        mostrarToast("Horário inválido", "O horário de início precisa ser menor que o horário de fim.", "erro");
        return;
    }

    const reservas = buscarReservas();

    const horarioIndisponivel = reservas.some(reserva =>
        reserva.estacao === estacao &&
        reserva.data === data &&
        horariosConflitam(inicio, fim, reserva.inicio, reserva.fim)
    );

    if (horarioIndisponivel) {
        mostrarToast("Horário indisponível", "Essa estação já está reservada nesse horário.", "erro");
        return;
    }

    const novaReserva = {
        id: Date.now(),
        estacao,
        data,
        inicio,
        fim
    };

    reservas.push(novaReserva);
    salvarReservas(reservas);
    salvarReservaNoSistema(novaReserva);

    if (typeof adicionarNotificacao === "function") {
        adicionarNotificacao(
            `Reserva confirmada para ${estacao} no dia ${data}, das ${inicio} às ${fim}.`
        );
    }

    mostrarToast("Reserva confirmada", "Sua reserva foi realizada com sucesso!", "sucesso");

    inputDataModal.value = "";
    inputInicio.value = "";
    inputFim.value = "";

    modal.close();
});

function aplicarFiltro() {
    const dataFiltro = inputFiltroData.value;
    const inicioFiltro = inputFiltroInicio.value;
    const fimFiltro = inputFiltroFim.value;
    const reservas = buscarReservas();

    document.querySelectorAll(".estacao-card").forEach(card => {
        const badge = card.querySelector(".badge");
        const botao = card.querySelector(".fast-action-btn");

        if (card.dataset.inativa === "true") {
            badge.textContent = "Inativa";
            badge.className = "badge inativa";
            botao.disabled = true;
            return;
        }

        const estacao = obterNomeEstacaoPeloCard(card);

        const reservadaNoPeriodo = reservas.some(reserva =>
            reserva.estacao === estacao &&
            reserva.data === dataFiltro &&
            horariosConflitam(
                inicioFiltro,
                fimFiltro,
                reserva.inicio,
                reserva.fim
            )
        );

        if (reservadaNoPeriodo) {
            badge.textContent = "Ocupada";
            badge.className = "badge ocupado";
            botao.disabled = true;
        } else {
            badge.textContent = "Disponível";
            badge.className = "badge disponivel";
            botao.disabled = false;
        }
    });

    aplicarStatusEspacosEstacoes();
}

btnFiltrar.addEventListener("click", () => {
    const dataFiltro = inputFiltroData.value;
    const inicioFiltro = inputFiltroInicio.value;
    const fimFiltro = inputFiltroFim.value;

    if (!dataFiltro || !inicioFiltro || !fimFiltro) {
        mostrarToast("Filtro incompleto", "Preencha a data, horário inicial e horário final.", "erro");
        return;
    }

    if (inicioFiltro >= fimFiltro) {
        mostrarToast("Horário inválido", "O horário inicial do filtro precisa ser menor que o horário final.", "erro");
        return;
    }

    aplicarFiltro();
});

function aplicarStatusEspacosEstacoes() {
    const espacos = buscarEspacosSistema();

    document.querySelectorAll(".estacao-card").forEach(card => {
        const nomeMesa = card.querySelector("h4").textContent.trim();

        const espaco = espacos.find(item =>
            item.tipo === "Estação de Trabalho" &&
            item.nome === nomeMesa
        );

        if (!espaco) return;

        const badge = card.querySelector(".badge");
        const botao = card.querySelector(".fast-action-btn");

        if (espaco.status === "Inativo") {
            card.dataset.inativa = "true";

            badge.textContent = "Inativa";
            badge.className = "badge inativa";

            botao.disabled = true;
        } else {
            card.dataset.inativa = "false";

            badge.textContent = "Disponível";
            badge.className = "badge disponivel";

            botao.disabled = false;
        }
    });
}

gerarCardsEstacoesDoSistema();
aplicarStatusEspacosEstacoes();