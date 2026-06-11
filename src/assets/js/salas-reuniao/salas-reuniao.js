const btnNovaReserva = document.querySelector(".botao-add-sala");
const btnConfirmar = document.getElementById("btn-confirmar-reserva");
const btnFiltrar = document.querySelector(".btn-filtrar-simples");
const btnReservarDosDetalhes = document.getElementById("btn-reservar-dos-detalhes");
const modalReserva = document.getElementById("modal-reserva");
const modalDetalhes = document.getElementById("modal-detalhes");
const selectEspaco = document.getElementById("espaco");
const inputDataModal = document.querySelector(".modal-date-input");
const inputFiltroData = document.querySelector(".date-input");
const inputFiltroInicio = document.querySelector(".filtro-inicio");
const inputFiltroFim = document.querySelector(".filtro-fim");
const inputInicio = document.getElementById("start-time");
const inputFim = document.getElementById("ending-time");
const inputConvidados = document.getElementById("convidados");

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
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

function buscarReservas() {
    return JSON.parse(localStorage.getItem("reservasSalas")) || [];
}

function salvarReservas(reservas) {
    localStorage.setItem("reservasSalas", JSON.stringify(reservas));
}

document.querySelectorAll(".btn-reservar").forEach(botao => {
    botao.addEventListener("click", () => {
        if (botao.disabled) return;

        const card = botao.closest(".card-sala");
        if (card.dataset.inativa === "true") return;

        const nomeSala = card.dataset.sala;
        preencherSelectComSala(nomeSala);

        if (!modalReserva.open) modalReserva.showModal();
    });
});

btnNovaReserva.addEventListener("click", () => {
    restaurarSelectCompleto();
});

selectEspaco.addEventListener("change", verificarCapacidade);

function verificarCapacidade() {
    const limiteMsg = document.getElementById("limite-msg");
    const capacidades = { "Sala Alfa": 8, "Sala Beta": 4, "Sala Gama": 12 };
    const cap = capacidades[selectEspaco.value];

    if (cap) {
        limiteMsg.textContent = `Limite de ${cap} convidados para este espaço.`;
    } else {
        limiteMsg.textContent = "Selecione uma sala para ver o limite de convidados.";
    }
}

btnConfirmar.addEventListener("click", () => {
    const sala = selectEspaco.value;
    const data = inputDataModal.value;
    const inicio = inputInicio.value;
    const fim = inputFim.value;

    if (!sala || !data || !inicio || !fim) {
        mostrarToast("Campos obrigatórios", "Preencha todos os campos da reserva.", "erro");
        return;
    }

    if (inicio >= fim) {
        mostrarToast("Horário inválido", "O horário de início precisa ser menor que o horário de fim.", "erro");
        return;
    }

    const reservas = buscarReservas();

    const horarioIndisponivel = reservas.some(reserva =>
        reserva.sala === sala &&
        reserva.data === data &&
        horariosConflitam(inicio, fim, reserva.inicio, reserva.fim)
    );

    if (horarioIndisponivel) {
        mostrarToast("Horário indisponível", "Essa sala já está reservada nesse horário.", "erro");
        return;
    }

    const novaReserva = {
        id: Date.now(),
        sala,
        data,
        inicio,
        fim,
        convidados: inputConvidados.value
    };

    reservas.push(novaReserva);
    salvarReservas(novaReserva.id ? reservas : reservas);
    salvarReservas(reservas);

    if (typeof adicionarNotificacao === "function") {
        adicionarNotificacao(
            `Reserva confirmada para ${sala} no dia ${data}, das ${inicio} às ${fim}.`
        );
    }

    mostrarToast("Reserva confirmada", "Sua reserva foi realizada com sucesso!", "sucesso");

    inputDataModal.value = "";
    inputInicio.value = "";
    inputFim.value = "";
    inputConvidados.value = "";
    selectEspaco.value = "";
    verificarCapacidade();

    modalReserva.close();
});

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

    aplicarFiltro(dataFiltro, inicioFiltro, fimFiltro);
});

function aplicarFiltro(dataFiltro, inicioFiltro, fimFiltro) {
    const reservas = buscarReservas();

    document.querySelectorAll(".card-sala").forEach(card => {
        const badge = card.querySelector(".badge");
        const btnReservar = card.querySelector(".btn-reservar");

        if (card.dataset.inativa === "true") {
            badge.textContent = "Inativa";
            badge.className = "badge inativa";
            btnReservar.disabled = true;
            return;
        }

        const nomeSala = card.dataset.sala;

        const reservadaNoPeriodo = reservas.some(reserva =>
            reserva.sala === nomeSala &&
            reserva.data === dataFiltro &&
            horariosConflitam(inicioFiltro, fimFiltro, reserva.inicio, reserva.fim)
        );

        if (reservadaNoPeriodo) {
            badge.textContent = "Ocupada";
            badge.className = "badge ocupada";
            btnReservar.disabled = true;
        } else {
            badge.textContent = "Disponível";
            badge.className = "badge disponivel";
            btnReservar.disabled = false;
        }
    });
}

document.querySelectorAll(".btn-detalhes").forEach(botao => {
    botao.addEventListener("click", () => {
        if (botao.disabled) return;

        const card = botao.closest(".card-sala");
        abrirModalDetalhes(card);
    });
});

function abrirModalDetalhes(card) {
    const nomeSala = card.dataset.sala;
    const badge = card.querySelector(".badge");
    const textos = card.querySelector(".sala-textos p").textContent;

    const capacidadeMatch = textos.match(/(\d+) pessoas/);
    const recursos = textos.replace(/Capacidade: \d+ pessoas · /, "");

    document.getElementById("detalhes-titulo").textContent = nomeSala;
    document.getElementById("detalhes-capacidade").textContent =
        capacidadeMatch ? `${capacidadeMatch[1]} pessoas` : "—";
    document.getElementById("detalhes-recursos").textContent = recursos;

    const statusEl = document.getElementById("detalhes-status");
    statusEl.textContent = badge.textContent.trim();
    statusEl.className = "detail-value";
    if (badge.classList.contains("disponivel")) statusEl.classList.add("status-disponivel");
    else if (badge.classList.contains("ocupada")) statusEl.classList.add("status-ocupada");
    else statusEl.classList.add("status-inativa");

    const hoje = new Date().toLocaleDateString("pt-BR");
    const reservas = buscarReservas();
    const reservasHoje = reservas.filter(r => r.sala === nomeSala && r.data === hoje);

    const container = document.getElementById("detalhes-horarios");
    container.innerHTML = "";

    if (reservasHoje.length === 0) {
        container.innerHTML = `<p style="color: var(--color-text-md); font-size: 14px;">Nenhuma reserva para hoje.</p>`;
    } else {
        reservasHoje.forEach(r => {
            const item = document.createElement("div");
            item.className = "horario-item";
            item.innerHTML = `
                <span class="horario-time">${r.inicio} – ${r.fim}</span>
                ${r.convidados ? `<span class="horario-pessoa">· ${r.convidados}</span>` : ""}
            `;
            container.appendChild(item);
        });
    }

    btnReservarDosDetalhes.dataset.sala = nomeSala;

    if (!modalDetalhes.open) modalDetalhes.showModal();
}

btnReservarDosDetalhes.addEventListener("click", () => {
    const nomeSala = btnReservarDosDetalhes.dataset.sala;
    modalDetalhes.close();
    preencherSelectComSala(nomeSala);
    if (!modalReserva.open) modalReserva.showModal();
});

function preencherSelectComSala(nomeSala) {
    selectEspaco.value = nomeSala;
    verificarCapacidade();
}

function restaurarSelectCompleto() {
    selectEspaco.value = "";
    verificarCapacidade();
}