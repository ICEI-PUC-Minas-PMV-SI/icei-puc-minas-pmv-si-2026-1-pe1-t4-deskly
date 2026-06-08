const botoesReservar = document.querySelectorAll(".fast-action-btn:not(:disabled)");
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

let cardSelecionado = null;

const opcoesOriginais = Array.from(selectEstacao.options).map(option => option.textContent);

function buscarReservas() {
    return JSON.parse(localStorage.getItem("reservasEstacoes")) || [];
}

function salvarReservas(reservas) {
    localStorage.setItem("reservasEstacoes", JSON.stringify(reservas));
}

function horariosConflitam(inicio1, fim1, inicio2, fim2) {
    return inicio1 < fim2 && fim1 > inicio2;
}

function atualizarSelectTodasEstacoes() {
    selectEstacao.innerHTML = "";

    opcoesOriginais.forEach(opcao => {
        const option = document.createElement("option");
        option.textContent = opcao;
        selectEstacao.appendChild(option);
    });
}

function atualizarSelectUmaEstacao(estacao) {
    selectEstacao.innerHTML = "";

    const option = document.createElement("option");
    option.textContent = estacao;
    selectEstacao.appendChild(option);
}

botoesReservar.forEach(botao => {
    botao.addEventListener("click", () => {
        cardSelecionado = botao.closest(".estacao-card");

        const nomeMesa = cardSelecionado.querySelector("h4").textContent;
        const area = cardSelecionado.querySelector(".subtitle").textContent.replace("Área: ", "");
        const estacao = `${nomeMesa} — ${area}`;

        atualizarSelectUmaEstacao(estacao);
    });
});

btnNovaReserva.addEventListener("click", () => {
    cardSelecionado = null;
    atualizarSelectTodasEstacoes();
});

btnConfirmar.addEventListener("click", () => {
    const estacao = selectEstacao.value;
    const data = inputDataModal.value;
    const inicio = inputInicio.value;
    const fim = inputFim.value;

    if (!estacao || !data || !inicio || !fim) {
        alert("Preencha todos os campos.");
        return;
    }

    if (inicio >= fim) {
        alert("O horário de início precisa ser menor que o horário de fim.");
        return;
    }

    const reservas = buscarReservas();

    const horarioIndisponivel = reservas.some(reserva => {
        return reserva.estacao === estacao &&
            reserva.data === data &&
            horariosConflitam(inicio, fim, reserva.inicio, reserva.fim);
    });

    if (horarioIndisponivel) {
        alert("Essa estação já está reservada nesse horário.");
        return;
    }

    const novaReserva = {
        id: Date.now(),
        estacao: estacao,
        data: data,
        inicio: inicio,
        fim: fim
    };

    reservas.push(novaReserva);
    salvarReservas(reservas);

    adicionarNotificacao(
        `Reserva confirmada para ${estacao} no dia ${data}, das ${inicio} às ${fim}.`
    );

    alert("Reserva realizada com sucesso!");

    inputDataModal.value = "";
    inputInicio.value = "";
    inputFim.value = "";

    modal.close();

    aplicarFiltro();
});

function aplicarFiltro() {
    const dataFiltro = inputFiltroData.value;
    const inicioFiltro = inputFiltroInicio.value;
    const fimFiltro = inputFiltroFim.value;
    const reservas = buscarReservas();

    document.querySelectorAll(".estacao-card").forEach(card => {
        const nomeMesa = card.querySelector("h4").textContent;
        const area = card.querySelector(".subtitle").textContent.replace("Área: ", "");
        const estacao = `${nomeMesa} — ${area}`;

        const badge = card.querySelector(".badge");
        const botao = card.querySelector(".fast-action-btn");

        if (badge.classList.contains("inativa")) {
            return;
        }

        const reservadaNoPeriodo = reservas.some(reserva => {
            if (reserva.estacao !== estacao) return false;
            if (reserva.data !== dataFiltro) return false;

            if (inicioFiltro && fimFiltro) {
                return horariosConflitam(inicioFiltro, fimFiltro, reserva.inicio, reserva.fim);
            }

            return true;
        });

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
}

btnFiltrar.addEventListener("click", () => {
    const inicioFiltro = inputFiltroInicio.value;
    const fimFiltro = inputFiltroFim.value;

    if (inicioFiltro && fimFiltro && inicioFiltro >= fimFiltro) {
        alert("O horário inicial do filtro precisa ser menor que o horário final.");
        return;
    }

    aplicarFiltro();
});