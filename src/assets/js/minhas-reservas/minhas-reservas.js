const statusClasse        = { pendente: 'badge-concluida', aceito: 'badge-confirmada', recusado: 'badge-cancelada' };
const statusLabel         = { pendente: 'Pendente',        aceito: 'Aceito',            recusado: 'Recusado' };
const classeStatusReserva = { 'Confirmada': 'badge-confirmada', 'Cancelada': 'badge-cancelada', 'Concluída': 'badge-concluida' };

function ehProxima(r) {
    return r.status === 'Confirmada' && !dataHoraNoPassado(r.data, r.fim);
}

function parseConvidados(str, statusMap) {
    if (!str || str === '-') return [];
    return str.split(',').map(e => e.trim()).filter(Boolean).map(email => ({
        email,
        status: (statusMap && statusMap[email]) || 'pendente'
    }));
}

function renderProximas(reservas) {
    const tbody = document.getElementById('tbody-proximas');
    if (!reservas.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="tabela-vazia">Nenhuma reserva próxima.</td></tr>`;
        return;
    }
    const espacosSistema = obterEspacosSistema();
    tbody.innerHTML = reservas.map(r => {
        const ehMesa     = r.tipo === 'Estação de Trabalho';
        const convArr    = parseConvidados(r.convidados, r.convidadosStatus);
        const espaco     = espacosSistema.find(e => e.nome === r.espaco);
        const capacidade = (espaco && Number(espaco.capacidade) >= 1) ? espaco.capacidade : null;
        const limiteConv = capacidade !== null ? capacidade - 1 : null;
        const convCol    = (!ehMesa && convArr.length)
            ? `<button class="btn-convidados" data-id="${r.id}">${convArr.length}${limiteConv !== null ? ' / ' + limiteConv : ''}</button>`
            : '—';
        return `
        <tr data-id="${r.id}">
            <td data-label="Espaço">${r.espaco}</td>
            <td data-label="Data">${r.data}</td>
            <td class="col-nowrap" data-label="Horário">${r.horario}</td>
            <td data-label="Convidados">${convCol}</td>
            <td data-label="Status"><span class="badge badge-confirmada">Confirmada</span></td>
            <td class="col-nowrap col-acoes">
                <button class="btn-editar" data-id="${r.id}">Editar</button>
                <button class="btn-cancelar"
                    data-id="${r.id}"
                    data-espaco="${r.espaco}"
                    data-data="${r.data}"
                    data-horario="${r.horario}">Cancelar</button>
            </td>
        </tr>`;
    }).join('');
}

function renderHistorico(reservas) {
    const tbody = document.getElementById('tbody-historico');
    if (!reservas.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="tabela-vazia">Nenhum histórico encontrado.</td></tr>`;
        return;
    }
    tbody.innerHTML = reservas.map(r => {
        const statusExibido = r.status === 'Confirmada' ? 'Concluída' : r.status;
        return `
        <tr>
            <td data-label="Espaço">${r.espaco}</td>
            <td data-label="Data">${r.data}</td>
            <td class="col-nowrap" data-label="Horário">${r.horario}</td>
            <td data-label="Status"><span class="badge ${classeStatusReserva[statusExibido] || 'badge-concluida'}">${statusExibido}</span></td>
        </tr>`;
    }).join('');
}

function carregarMinhasReservas() {
    const logado = obterUsuarioLogado();
    if (!logado) return;
    const proximas = [], historico = [];
    obterReservasSistema()
        .filter(r => r.usuarioId === logado.id)
        .forEach(r => (ehProxima(r) ? proximas : historico).push(r));
    renderProximas(proximas.sort((a, b) => parsearData(a.data) - parsearData(b.data)));
    renderHistorico(historico.sort((a, b) => parsearData(b.data) - parsearData(a.data)));
}


const modalEditar     = document.getElementById('modal-editar');
const modalCancelar   = document.getElementById('modal-cancelar-reserva');
const modalConvidados = document.getElementById('modal-convidados');

let idParaEditar       = null;
let idParaCancelar     = null;
let convidadosEditando = [];
let capacidadeEditando = Infinity;

function renderizarConvidadosEdicao() {
    const contador = document.getElementById('editar-contador-convidados');
    if (contador) {
        contador.textContent = capacidadeEditando !== Infinity
            ? `${convidadosEditando.length} / ${capacidadeEditando}`
            : convidadosEditando.length;
    }
    const lista = document.getElementById('editar-lista');
    lista.innerHTML = convidadosEditando.map((c, i) => `
        <div class="modal-convidados-item">
            <span>${c.email}</span>
            <div class="convidado-acoes">
                <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
                <button type="button" class="btn-remover-convidado" data-index="${i}" title="Remover convidado">×</button>
            </div>
        </div>
    `).join('');
    lista.querySelectorAll('.btn-remover-convidado').forEach(btn => {
        btn.addEventListener('click', () => {
            convidadosEditando.splice(Number(btn.dataset.index), 1);
            renderizarConvidadosEdicao();
        });
    });
    popularSelectConvidados();
}

function popularSelectConvidados() {
    const select = document.getElementById('editar-novo-convidado');
    if (!select) return;
    const logado = obterUsuarioLogado();
    const disponiveis = obterUsuarios().filter(u =>
        u.senhaDefinida === true &&
        (!logado || u.email !== logado.email) &&
        !convidadosEditando.some(c => c.email === u.email)
    );
    select.innerHTML = '<option value="">Selecionar usuário...</option>' +
        disponiveis.map(u => `<option value="${u.email}">${u.email}</option>`).join('');
}

function popularSelectEspaco(espacoAtual, tipo) {
    const opcoes = obterEspacosSistema().filter(e => e.tipo === tipo && e.status === 'Ativo');
    const select = document.getElementById('editar-espaco');
    select.innerHTML = opcoes.length
        ? opcoes.map(e => `<option value="${e.nome}" ${e.nome === espacoAtual ? 'selected' : ''}>${e.nome}</option>`).join('')
        : `<option value="${espacoAtual}">${espacoAtual}</option>`;
    const encontrado = obterEspacosSistema().find(e => e.nome === select.value);
    capacidadeEditando = (encontrado && Number(encontrado.capacidade) >= 1)
        ? Number(encontrado.capacidade) - 1
        : Infinity;
}


document.getElementById('tbody-proximas').addEventListener('click', e => {
    const btnEditar   = e.target.closest('.btn-editar');
    const btnCancelar = e.target.closest('.btn-cancelar');
    const btnConv     = e.target.closest('.btn-convidados');

    if (btnEditar) {
        const reserva = obterReservasSistema().find(r => r.id === Number(btnEditar.dataset.id));
        if (!reserva) return;
        idParaEditar       = reserva.id;
        convidadosEditando = parseConvidados(reserva.convidados, reserva.convidadosStatus);
        const ehMesa       = reserva.tipo === 'Estação de Trabalho';
        popularSelectEspaco(reserva.espaco, reserva.tipo);
        document.getElementById('editar-data').value   = reserva.data;
        document.getElementById('editar-inicio').value = reserva.inicio || '';
        document.getElementById('editar-fim').value    = reserva.fim || '';
        document.getElementById('editar-grupo-convidados').classList.toggle('oculto', ehMesa);
        document.getElementById('editar-grupo-adicionar').classList.toggle('oculto', ehMesa);
        renderizarConvidadosEdicao();
        modalEditar.showModal();
    }

    if (btnCancelar) {
        document.getElementById('modal-cancelar-espaco').textContent  = btnCancelar.dataset.espaco;
        document.getElementById('modal-cancelar-data').textContent    = btnCancelar.dataset.data;
        document.getElementById('modal-cancelar-horario').textContent = btnCancelar.dataset.horario;
        idParaCancelar = Number(btnCancelar.dataset.id);
        modalCancelar.showModal();
    }

    if (btnConv) {
        const reserva = obterReservasSistema().find(r => r.id === Number(btnConv.dataset.id));
        if (!reserva) return;
        const convidados  = parseConvidados(reserva.convidados, reserva.convidadosStatus);
        const espacoAdmin = obterEspacosSistema().find(e => e.nome === reserva.espaco);
        const capacidade  = (espacoAdmin && Number(espacoAdmin.capacidade) >= 1) ? espacoAdmin.capacidade : null;
        document.getElementById('conv-titulo').textContent    = `Convidados - ${reserva.espaco}`;
        document.getElementById('conv-subtitulo').textContent = `${reserva.data} · ${reserva.horario}${capacidade ? ` · Capacidade: ${capacidade}` : ''}`;
        document.getElementById('conv-lista').innerHTML = convidados.length
            ? convidados.map(c => `
                <div class="modal-convidados-item">
                    <span>${c.email}</span>
                    <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
                </div>`).join('')
            : '<p class="sem-convidados">Nenhum convidado.</p>';
        document.getElementById('conv-rodape').textContent = capacidade
            ? `${convidados.length} / ${capacidade - 1} convidados · ${Math.max(0, (capacidade - 1) - convidados.length)} vaga(s) restante(s)`
            : `${convidados.length} convidado(s)`;
        modalConvidados.showModal();
    }
});

document.getElementById('editar-espaco').addEventListener('change', () => {
    const sel = obterEspacosSistema().find(e => e.nome === document.getElementById('editar-espaco').value);
    capacidadeEditando = (sel && Number(sel.capacidade) >= 1) ? Number(sel.capacidade) - 1 : Infinity;
    renderizarConvidadosEdicao();
});

document.querySelector('.conv-adicionar-btn').addEventListener('click', () => {
    const select = document.getElementById('editar-novo-convidado');
    const email  = select.value;
    if (!email) return;
    if (capacidadeEditando !== Infinity && convidadosEditando.length >= capacidadeEditando) {
        mostrarToast('Capacidade máxima', `Limite de ${capacidadeEditando} convidados atingido.`, 'erro');
        return;
    }
    convidadosEditando.push({ email, status: 'pendente' });
    select.value = '';
    renderizarConvidadosEdicao();
});

document.querySelector('#modal-editar .btn-confirmar').addEventListener('click', () => {
    if (!idParaEditar) return;
    const espaco = document.getElementById('editar-espaco').value.trim();
    const data   = document.getElementById('editar-data').value.trim();
    const inicio = document.getElementById('editar-inicio').value.trim();
    const fim    = document.getElementById('editar-fim').value.trim();

    if (dataHoraNoPassado(data, inicio)) {
        marcarCampoInvalido(document.getElementById('editar-data'));
        marcarCampoInvalido(document.getElementById('editar-inicio'));
        mostrarToast('Horário inválido', 'Não é possível reservar em uma data/horário que já passou.', 'erro');
        return;
    }

    if (inicio && fim && inicio >= fim) {
        marcarCampoInvalido(document.getElementById('editar-inicio'));
        marcarCampoInvalido(document.getElementById('editar-fim'));
        mostrarToast('Horário inválido', 'O início precisa ser menor que o fim.', 'erro');
        return;
    }

    const salaSelecionada  = obterEspacosSistema().find(e => e.nome === espaco);
    const limiteConvidados = (salaSelecionada && Number(salaSelecionada.capacidade) >= 1)
        ? Number(salaSelecionada.capacidade) - 1
        : Infinity;

    if (convidadosEditando.length > limiteConvidados) {
        marcarCampoInvalido(document.getElementById('editar-espaco'));
        mostrarToast(
            'Capacidade excedida',
            `Esta sala comporta no máximo ${limiteConvidados} convidado(s). Remova ${convidadosEditando.length - limiteConvidados}.`,
            'erro'
        );
        return;
    }

    const novoStatus    = {};
    const convidadosStr = convidadosEditando.map(c => c.email).join(', ') || '-';
    convidadosEditando.forEach(c => { novoStatus[c.email] = c.status; });

    const reservas = obterReservasSistema();
    const idx      = reservas.findIndex(r => r.id === idParaEditar);

    const conflito = data && inicio && fim && reservas.some(r =>
        r.id !== idParaEditar &&
        r.espaco === espaco &&
        r.data === data &&
        r.status !== 'Cancelada' &&
        inicio < r.fim && r.inicio < fim
    );

    if (conflito) {
        marcarCampoInvalido(document.getElementById('editar-inicio'));
        marcarCampoInvalido(document.getElementById('editar-fim'));
        mostrarToast('Horário indisponível', 'Já existe uma reserva para este espaço nesse horário.', 'erro');
        return;
    }

    const emailsAntigos = idx !== -1
        ? parseConvidados(reservas[idx].convidados, reservas[idx].convidadosStatus).map(c => c.email)
        : [];

    if (idx !== -1) {
        reservas[idx].espaco           = espaco;
        reservas[idx].data             = data;
        reservas[idx].inicio           = inicio;
        reservas[idx].fim              = fim;
        reservas[idx].horario          = `${inicio} – ${fim}`;
        reservas[idx].convidados       = convidadosStr;
        reservas[idx].convidadosStatus = novoStatus;
        salvarReservasSistema(reservas);
    }

    const reservasSalas = JSON.parse(localStorage.getItem('reservasSalas') || '[]');
    const idxSalas = reservasSalas.findIndex(r => r.id === idParaEditar);
    if (idxSalas !== -1) {
        reservasSalas[idxSalas].sala             = espaco;
        reservasSalas[idxSalas].data             = data;
        reservasSalas[idxSalas].inicio           = inicio;
        reservasSalas[idxSalas].fim              = fim;
        reservasSalas[idxSalas].convidados       = convidadosStr;
        reservasSalas[idxSalas].convidadosStatus = novoStatus;
        localStorage.setItem('reservasSalas', JSON.stringify(reservasSalas));
    }

    const novosConvidados = convidadosEditando.filter(c => !emailsAntigos.includes(c.email));
    if (novosConvidados.length && typeof adicionarNotificacaoParaUsuario === 'function') {
        const logado     = obterUsuarioLogado();
        const nomeLogado = logado ? logado.nome : 'Alguém';
        novosConvidados.forEach(c => {
            const usuario = obterUsuarios().find(u => u.email === c.email);
            if (!usuario) return;
            adicionarNotificacaoParaUsuario(
                usuario.id,
                `${nomeLogado} convidou você para ${espaco} em ${data} das ${inicio} às ${fim}.`,
                { tipo: 'convite', reservaId: idParaEditar, emailConvidado: c.email, respondida: false }
            );
        });
    }

    idParaEditar = null;
    modalEditar.close();
    carregarMinhasReservas();
    mostrarToast('Reserva atualizada', 'As alterações foram salvas com sucesso!', 'sucesso');
});

document.querySelector('.modal-detalhe-btn-confirmar-cancelamento').addEventListener('click', () => {
    if (!idParaCancelar) return;
    const reservas = obterReservasSistema();
    const idx = reservas.findIndex(r => r.id === idParaCancelar);
    if (idx !== -1) {
        if (typeof adicionarNotificacao === 'function') {
            adicionarNotificacao(`Reserva cancelada: ${reservas[idx].espaco} no dia ${reservas[idx].data}, das ${reservas[idx].horario}.`);
        }
        reservas[idx].status = 'Cancelada';
        salvarReservasSistema(reservas);
    }
    idParaCancelar = null;
    modalCancelar.close();
    carregarMinhasReservas();
    mostrarToast('Reserva cancelada', 'Sua reserva foi cancelada com sucesso.', 'aviso');
});

document.querySelector('.btn-filtrar-simples').addEventListener('click', () => {
    const tipoSelecionado   = document.getElementById('filtro-tipo')?.dataset.valorSelecionado   || 'todos';
    const statusSelecionado = document.getElementById('filtro-status')?.dataset.valorSelecionado || 'todos';
    document.querySelectorAll('.reservas-table tbody tr').forEach(linha => {
        const espacoEl = linha.querySelector('td[data-label="Espaço"]');
        const badge    = linha.querySelector('.badge');
        if (!espacoEl || !badge) return;
        const espaco      = espacoEl.textContent.trim().toLowerCase();
        const classeBadge = badge.className;
        const tipoOk =
            tipoSelecionado === 'todos' ||
            (tipoSelecionado === 'salas'    && espaco.includes('sala')) ||
            (tipoSelecionado === 'estacoes' && espaco.includes('mesa'));
        const statusOk =
            statusSelecionado === 'todos' ||
            (statusSelecionado === 'confirmadas' && classeBadge.includes('badge-confirmada')) ||
            (statusSelecionado === 'canceladas'  && classeBadge.includes('badge-cancelada'))  ||
            (statusSelecionado === 'concluidas'  && classeBadge.includes('badge-concluida'));
        linha.style.display = (tipoOk && statusOk) ? '' : 'none';
    });
});

flatpickr('.modal-date-input', {
    locale: 'pt',
    dateFormat: 'd/m/Y',
    minDate: 'today',
    disableMobile: true,
    placeholder: 'dd/mm/aaaa',
    monthSelectorType: 'static',
    static: true
});

carregarMinhasReservas();
