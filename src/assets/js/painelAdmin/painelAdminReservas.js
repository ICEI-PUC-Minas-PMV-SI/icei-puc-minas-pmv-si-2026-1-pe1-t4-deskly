function classeStatusReserva(status) {
    const mapa = { 'Confirmada': 'badge-confirmada', 'Cancelada': 'badge-cancelada', 'Concluída': 'badge-concluida' };
    return mapa[status] || 'badge-concluida';
}

function carregarReservasAdmin() {
    const tabela = document.getElementById('tabelaReservasAdmin');
    if (!tabela) return;

    const reservas = obterReservasSistema()
        .slice()
        .sort((a, b) => parsearData(b.data) - parsearData(a.data));

    tabela.innerHTML = '';

    if (reservas.length === 0) {
        tabela.innerHTML = `<tr><td data-label="Reservas" colspan="6">Nenhuma reserva cadastrada.</td></tr>`;
        return;
    }

    reservas.forEach(reserva => {
        const estaCancelada = reserva.status === 'Cancelada';
        const botaoAcao = estaCancelada
            ? `<button class="btn-action btn-reativar-reserva-admin" data-id="${reserva.id}">Reativar</button>`
            : `<button class="btn-action btn-excluir-reserva-admin" data-id="${reserva.id}">Cancelar</button>`;

        tabela.innerHTML += `
            <tr>
                <td data-label="Usuário">${reserva.usuario || 'Usuário não identificado'}</td>
                <td data-label="Espaço">${reserva.espaco}</td>
                <td data-label="Data">${reserva.data}</td>
                <td data-label="Horário">${reserva.horario}</td>
                <td data-label="Status"><span class="badge ${classeStatusReserva(reserva.status)}">${reserva.status}</span></td>
                <td data-label="Ações">${botaoAcao}</td>
            </tr>`;
    });
}

function excluirReservaAdmin(id) {
    const reservas = obterReservasSistema();
    const idx = reservas.findIndex(r => r.id === Number(id));
    if (idx === -1) return;
    reservas[idx].status = 'Cancelada';
    salvarReservasSistema(reservas);
    carregarReservasAdmin();
    mostrarToast('Reserva cancelada', 'A reserva foi marcada como cancelada.', 'sucesso');
}

function reservaJaPassou(reserva) {
    const agora = new Date();
    const [dia, mes, ano] = (reserva.data || '').split('/').map(Number);
    let hora = 23, minuto = 59;
    if (reserva.horario && reserva.horario.includes('-')) {
        const fim = reserva.horario.split('-')[1].trim();
        if (fim.includes(':')) [hora, minuto] = fim.split(':').map(Number);
    }
    return new Date(ano, mes - 1, dia, hora || 23, minuto || 59) < agora;
}

function espacoReservaExiste(reserva) {
    const espaco = obterEspacosSistema().find(e => {
        const id = e.tipo === 'Sala de Reunião' ? e.nome : `${e.nome} — ${e.area}`;
        return id === reserva.espaco;
    });
    if (!espaco) return false;
    return !(espaco.ativo === false || String(espaco.status).toLowerCase() === 'inativo');
}

function reativarReservaAdmin(id) {
    const reservas = obterReservasSistema();
    const idx = reservas.findIndex(r => r.id === Number(id));
    if (idx === -1) return;

    const reserva = reservas[idx];

    if (reservaJaPassou(reserva)) {
        mostrarToast('Reativação bloqueada', 'Não é possível reativar reservas de datas já encerradas.', 'erro');
        return;
    }

    if (!espacoReservaExiste(reserva)) {
        mostrarToast('Reativação bloqueada', 'O espaço está desativado ou não existe mais.', 'erro');
        return;
    }

    reserva.status = 'Confirmada';
    salvarReservasSistema(reservas);
    carregarReservasAdmin();
    mostrarToast('Reserva reativada', 'A reserva foi marcada como confirmada novamente.', 'sucesso');
}

let idReservaParaCancelar = null;

function capacidadeEspaco(nomeEspaco) {
    const espaco = obterEspacosSistema().find(e => e.nome === nomeEspaco);
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

document.addEventListener('DOMContentLoaded', () => {
    carregarReservasAdmin();

    document.getElementById('btn-filtrar-reservas')?.addEventListener('click', () => {
        const data  = document.getElementById('filtro-data-reservas')?.value.trim();
        const faixa = document.getElementById('select-capacidade')?.dataset.valorSelecionado || 'todos';
        const tabela = document.getElementById('tabelaReservasAdmin');
        if (!tabela) return;
        tabela.querySelectorAll('tr').forEach(tr => {
            const tdEspaco = tr.querySelector("td[data-label='Espaço']");
            const tdData   = tr.querySelector("td[data-label='Data']");
            if (!tdEspaco || !tdData) return;
            const dataOk = !data || tdData.textContent.trim() === data;
            const capOk  = capacidadeOk(tdEspaco.textContent.trim(), faixa);
            tr.style.display = (dataOk && capOk) ? '' : 'none';
        });
    });

    document.getElementById('btn-confirmar-exclusao')?.addEventListener('click', () => {
        if (idReservaParaCancelar === null) return;
        excluirReservaAdmin(idReservaParaCancelar);
        idReservaParaCancelar = null;
        document.getElementById('modal-confirmacao')?.close();
    });
});

document.addEventListener('click', event => {
    const botaoExcluir  = event.target.closest('.btn-excluir-reserva-admin');
    const botaoReativar = event.target.closest('.btn-reativar-reserva-admin');

    if (botaoReativar) {
        reativarReservaAdmin(botaoReativar.dataset.id);
        return;
    }

    if (!botaoExcluir) return;

    idReservaParaCancelar = botaoExcluir.dataset.id;
    const reserva = obterReservasSistema().find(r => r.id === Number(idReservaParaCancelar));
    if (reserva) {
        document.getElementById('modal-cancelar-espaco').textContent  = reserva.espaco  || '—';
        document.getElementById('modal-cancelar-data').textContent    = reserva.data    || '—';
        document.getElementById('modal-cancelar-horario').textContent = reserva.horario || '—';
    }
    document.getElementById('modal-confirmacao')?.showModal();
});
