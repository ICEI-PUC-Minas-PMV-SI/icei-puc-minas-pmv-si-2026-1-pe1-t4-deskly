const calendar = document.getElementById("calendar");
const mesLabel = document.getElementById("mesLabel");

let reservas = {};
let diaSelecionado = null;
let indexSelecionado = null;

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
const hoje = new Date();

function buscarReservasSistema() {
    return JSON.parse(localStorage.getItem("reservasSistema")) || [];
}

function converterDataParaChave(data) {
    const partes = data.split("/");

    if (partes.length !== 3) return null;

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    return `${ano}-${mes}-${dia}`;
}

function chave(dia) {
    return `${anoAtual}-${mesAtual}-${dia}`;
}

function separarNomeEArea(espaco, tipo) {
    if (tipo !== "Estação de Trabalho") {
        return {
            nome: espaco,
            area: ""
        };
    }

    if (espaco.includes(" — ")) {
        const partes = espaco.split(" — ");

        return {
            nome: partes[0],
            area: partes.slice(1).join(" — ")
        };
    }

    return {
        nome: espaco,
        area: ""
    };
}

function carregarReservasDoSistema() {
    const reservasSistema = buscarReservasSistema();

    reservas = {};

    reservasSistema.forEach(reserva => {
        const key = converterDataParaChave(reserva.data);

        if (!key) return;

        if (!reservas[key]) {
            reservas[key] = [];
        }

        reservas[key].push({
            id: reserva.id,
            espaco: reserva.espaco,
            tipo: reserva.tipo,
            responsavel: reserva.usuario,
            inicio: reserva.inicio,
            fim: reserva.fim,
            emails: reserva.convidados || "",
            status: reserva.status || "Confirmada",
            key: key
        });
    });
}

function renderCalendar() {
    carregarReservasDoSistema();

    calendar.innerHTML = "";

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const d = document.createElement("div");
        d.className = "day";
        d.innerText = dia;

        if (
            dia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            d.classList.add("today");
        }

        const key = chave(dia);

        if (reservas[key] && reservas[key].length > 0) {
            d.classList.add("has-event");

            reservas[key].forEach((reserva, index) => {
                const dadosEspaco = separarNomeEArea(reserva.espaco, reserva.tipo);

                const ev = document.createElement("div");
                ev.className = "event";

                ev.innerHTML = `
                    <strong>${dadosEspaco.nome}</strong>
                    <span class="small">${reserva.inicio} - ${reserva.fim}</span>
                    <span class="small">${reserva.tipo}</span>
                `;

                ev.onclick = event => {
                    event.stopPropagation();
                    abrirView(dia, index);
                };

                d.appendChild(ev);
            });
        }

        calendar.appendChild(d);
    }

    mesLabel.innerText = new Date(anoAtual, mesAtual).toLocaleString("pt-BR", {
        month: "long",
        year: "numeric"
    });
}

function mudarMes(dir) {
    mesAtual += dir;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    renderCalendar();
}

function abrirView(dia, index) {
    const reserva = reservas[chave(dia)][index];
    const dadosEspaco = separarNomeEArea(reserva.espaco, reserva.tipo);

    diaSelecionado = dia;
    indexSelecionado = index;

    document.getElementById("titulo").innerHTML = `
        ${dadosEspaco.nome}
        ${
            dadosEspaco.area
                ? `<br><small style="color: var(--color-text-md); font-size: 13px; font-weight: normal;">${dadosEspaco.area}</small>`
                : ""
        }
    `;

    document.getElementById("horario").innerText =
        `${reserva.inicio} - ${reserva.fim}`;

    document.getElementById("respView").innerText =
        `Responsável: ${reserva.responsavel || "-"}`;

    document.getElementById("statusView").innerText =
        `Status: ${reserva.status}`;

    const listaEmails = document.getElementById("listaEmails");

    listaEmails.innerHTML = "";

    if (reserva.emails && reserva.emails !== "-") {
        reserva.emails.split(",").forEach(email => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.innerText = email.trim();
            listaEmails.appendChild(tag);
        });
    }

    document.getElementById("viewModal").showModal();
}

function fecharView() {
    document.getElementById("viewModal").close();
}

function excluir() {
    alert("Para excluir uma reserva, use a página Minhas Reservas ou o Painel Admin.");
}

function editar() {
    alert("Para editar uma reserva, use a página onde ela foi criada.");
}

renderCalendar();