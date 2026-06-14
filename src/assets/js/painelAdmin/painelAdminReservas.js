function classeStatusReserva(status) {
    const mapa = { 'Confirmada': 'badge-confirmada', 'Cancelada': 'badge-cancelada', 'Concluída': 'badge-concluida' };
    return mapa[status] || 'badge-concluida';
}

function buscarReservasSistema() {
    return JSON.parse(localStorage.getItem("reservasSistema")) || [];
}

function salvarReservasSistema(reservas) {
    localStorage.setItem("reservasSistema", JSON.stringify(reservas));
}

function parsearData(str) {
    const [d, m, y] = str.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
}

function carregarReservasAdmin() {
    const tabela = document.getElementById("tabelaReservasAdmin");

    if (!tabela) return;

    const reservas = buscarReservasSistema()
        .slice()
        .sort((a, b) => parsearData(b.data) - parsearData(a.data));

    tabela.innerHTML = "";

    if (reservas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td data-label="Reservas" colspan="6">
                    Nenhuma reserva cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    reservas.forEach(reserva => {
        tabela.innerHTML += `
            <tr>
                <td data-label="Usuário">${reserva.usuario || "Usuário não identificado"}</td>
                <td data-label="Espaço">${reserva.espaco}</td>
                <td data-label="Data">${reserva.data}</td>
                <td data-label="Horário">${reserva.horario}</td>
                <td data-label="Status">
                    <span class="badge ${classeStatusReserva(reserva.status)}">${reserva.status}</span>
                </td>
                <td data-label="Ações">
                    <button class="btn-action btn-excluir-reserva-admin" data-id="${reserva.id}">
                        Cancelar
                    </button>
                </td>
            </tr>
        `;
    });
}

function excluirReservaAdmin(id) {
    const reservasSistema = buscarReservasSistema();
    const idx = reservasSistema.findIndex(r => r.id === Number(id));

    if (idx === -1) return;

    reservasSistema[idx].status = 'Cancelada';

    salvarReservasSistema(reservasSistema);
    carregarReservasAdmin();
    exibirToast('Reserva cancelada', 'A reserva foi marcada como cancelada.', 'sucesso');
}

let idReservaParaCancelar = null;

function capacidadeEspaco(nomeEspaco) {
    const espacos = JSON.parse(localStorage.getItem('espacosSistema') || '[]');
    const espaco  = espacos.find(e => e.nome === nomeEspaco);
    return espaco ? Number(espaco.capacidade) : null;
}

function capacidadeOk(nomeEspaco, faixa) {
    if (faixa === 'todos' || !faixa) return true;
    const cap = capacidadeEspaco(nomeEspaco);
    if (cap === null) return false;
    if (faixa === '4')  return cap <= 4;
    if (faixa === '8')  return cap > 4 && cap <= 8;
    if (faixa === '8+') return cap > 8;
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarReservasAdmin();

    document.getElementById("btn-filtrar-reservas")?.addEventListener("click", () => {
        const data     = document.getElementById("filtro-data-reservas")?.value.trim();
        const faixa    = document.getElementById("select-capacidade")?.dataset.valorSelecionado || 'todos';
        const tabela   = document.getElementById("tabelaReservasAdmin");
        if (!tabela) return;

        tabela.querySelectorAll("tr").forEach(tr => {
            const tdEspaco = tr.querySelector("td[data-label='Espaço']");
            const tdData   = tr.querySelector("td[data-label='Data']");
            if (!tdEspaco || !tdData) return;

            const dataOk  = !data || tdData.textContent.trim() === data;
            const capOk   = capacidadeOk(tdEspaco.textContent.trim(), faixa);
            tr.style.display = (dataOk && capOk) ? '' : 'none';
        });
    });

    document.getElementById("btn-confirmar-exclusao")?.addEventListener("click", () => {
        if (idReservaParaCancelar === null) return;
        excluirReservaAdmin(idReservaParaCancelar);
        idReservaParaCancelar = null;
        document.getElementById("modal-confirmacao")?.close();
    });
});

document.addEventListener("click", event => {
    const botaoExcluir = event.target.closest(".btn-excluir-reserva-admin");

    if (!botaoExcluir) return;

    idReservaParaCancelar = botaoExcluir.dataset.id;

    const reserva = buscarReservasSistema().find(r => r.id === Number(idReservaParaCancelar));
    if (reserva) {
        document.getElementById("modal-cancelar-espaco").textContent  = reserva.espaco  || '—';
        document.getElementById("modal-cancelar-data").textContent    = reserva.data    || '—';
        document.getElementById("modal-cancelar-horario").textContent = reserva.horario || '—';
    }

    document.getElementById("modal-confirmacao")?.showModal();
});