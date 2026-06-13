const statusClasse = { pendente: 'badge-concluida', aceito: 'badge-confirmada', recusado: 'badge-cancelada' };
const statusLabel  = { pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' };

// --- localStorage ---

function obterUsuarioLogado() {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
}
function obterReservasSistema() {
    return JSON.parse(localStorage.getItem('reservasSistema') || '[]');
}
function salvarReservasSistema(reservas) {
    localStorage.setItem('reservasSistema', JSON.stringify(reservas));
}

// --- Utilitários ---

function parsearData(str) {
    const [d, m, y] = str.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
}
function ehProxima(r) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return parsearData(r.data) >= hoje && r.status === 'Confirmada';
}
function classeStatusReserva(status) {
    const mapa = { 'Confirmada': 'badge-confirmada', 'Cancelada': 'badge-cancelada', 'Concluída': 'badge-concluida' };
    return mapa[status] || 'badge-concluida';
}
function parseConvidados(str) {
    if (!str || str === '-') return [];
    return str.split(',').map(e => e.trim()).filter(Boolean).map(email => ({ email, status: 'pendente' }));
}

// --- Toast ---

function mostrarToast(titulo, mensagem, tipo = 'aviso') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// --- Render ---

function renderProximas(reservas) {
    const tbody        = document.getElementById('tbody-proximas');
    const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema') || '[]');

    if (!reservas.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#6B7280;padding:32px;">Nenhuma reserva próxima.</td></tr>`;
        return;
    }
    tbody.innerHTML = reservas.map(r => {
        const ehMesa    = r.tipo === 'Estação de Trabalho';
        const convArr   = parseConvidados(r.convidados);
        const espaco    = espacosSistema.find(e => e.nome === r.espaco);
        const capacidade = (espaco && Number(espaco.capacidade) >= 1) ? espaco.capacidade : null;
        const convCol   = (!ehMesa && convArr.length)
            ? `<button class="btn-convidados" data-id="${r.id}">${convArr.length}${capacidade !== null ? ' / ' + capacidade : ''}</button>`
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
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#6B7280;padding:32px;">Nenhum histórico encontrado.</td></tr>`;
        return;
    }
    tbody.innerHTML = reservas.map(r => `
        <tr>
            <td data-label="Espaço">${r.espaco}</td>
            <td data-label="Data">${r.data}</td>
            <td class="col-nowrap" data-label="Horário">${r.horario}</td>
            <td data-label="Status"><span class="badge ${classeStatusReserva(r.status)}">${r.status}</span></td>
        </tr>
    `).join('');
}

function carregarMinhasReservas() {
    const logado = obterUsuarioLogado();
    if (!logado) return;
    const minhas = obterReservasSistema().filter(r => r.usuarioId === logado.id);
    renderProximas(minhas.filter(ehProxima));
    renderHistorico(minhas.filter(r => !ehProxima(r)));
}

// --- Modal: Editar Reserva ---

const modalEditar = document.getElementById('modal-editar');
let idParaEditar       = null;
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
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const disponiveis = usuarios.filter(u =>
        u.senhaDefinida === true &&
        !convidadosEditando.some(c => c.email === u.email)
    );
    select.innerHTML = '<option value="">Selecionar usuário...</option>' +
        disponiveis.map(u => `<option value="${u.email}">${u.email}</option>`).join('');
}

function popularSelectEspaco(espacoAtual, tipo) {
    const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
    const opcoes = espacosSistema.filter(e => e.tipo === tipo && e.status === 'Ativo');
    const select = document.getElementById('editar-espaco');
    select.innerHTML = opcoes.length
        ? opcoes.map(e => `<option value="${e.nome}" ${e.nome === espacoAtual ? 'selected' : ''}>${e.nome}</option>`).join('')
        : `<option value="${espacoAtual}">${espacoAtual}</option>`;
    const encontrado = espacosSistema.find(e => e.nome === select.value);
    capacidadeEditando = (encontrado && Number(encontrado.capacidade) >= 1)
        ? encontrado.capacidade
        : Infinity;
}

// Event delegation — próximas
document.getElementById('tbody-proximas').addEventListener('click', e => {
    const btnEditar   = e.target.closest('.btn-editar');
    const btnCancelar = e.target.closest('.btn-cancelar');
    const btnConv     = e.target.closest('.btn-convidados');

    if (btnEditar) {
        const reserva = obterReservasSistema().find(r => r.id === Number(btnEditar.dataset.id));
        if (!reserva) return;
        idParaEditar       = reserva.id;
        convidadosEditando = parseConvidados(reserva.convidados);
        const ehMesa       = reserva.tipo === 'Estação de Trabalho';
        popularSelectEspaco(reserva.espaco, reserva.tipo);
        document.getElementById('editar-data').value   = reserva.data;
        document.getElementById('editar-inicio').value = reserva.inicio || '';
        document.getElementById('editar-fim').value    = reserva.fim || '';
        document.getElementById('editar-grupo-convidados').style.display = ehMesa ? 'none' : '';
        document.getElementById('editar-grupo-adicionar').style.display  = ehMesa ? 'none' : '';
        renderizarConvidadosEdicao();
        modalEditar.showModal();
    }

    if (btnCancelar) {
        document.getElementById('modal-cancelar-espaco').textContent  = btnCancelar.dataset.espaco;
        document.getElementById('modal-cancelar-data').textContent    = btnCancelar.dataset.data;
        document.getElementById('modal-cancelar-horario').textContent = btnCancelar.dataset.horario;
        idParaCancelar = Number(btnCancelar.dataset.id);
        document.getElementById('modal-cancelar-reserva').showModal();
    }

    if (btnConv) {
        const reserva = obterReservasSistema().find(r => r.id === Number(btnConv.dataset.id));
        if (!reserva) return;
        const convidados    = parseConvidados(reserva.convidados);
        const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
        const espacoAdmin   = espacosSistema.find(e => e.nome === reserva.espaco);
        const capacidade    = (espacoAdmin && Number(espacoAdmin.capacidade) >= 1) ? espacoAdmin.capacidade : null;
        document.getElementById('conv-titulo').textContent    = `Convidados - ${reserva.espaco}`;
        document.getElementById('conv-subtitulo').textContent = `${reserva.data} · ${reserva.horario}${capacidade ? ` · Capacidade: ${capacidade}` : ''}`;
        document.getElementById('conv-lista').innerHTML = convidados.length
            ? convidados.map(c => `
                <div class="modal-convidados-item">
                    <span>${c.email}</span>
                    <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
                </div>`).join('')
            : '<p style="color:#6B7280">Nenhum convidado.</p>';
        document.getElementById('conv-rodape').textContent = capacidade
            ? `${convidados.length} / ${capacidade} convidados · ${capacidade - convidados.length} vaga(s) restante(s)`
            : `${convidados.length} convidado(s)`;
        document.getElementById('modal-convidados').showModal();
    }
});

document.getElementById('editar-espaco').addEventListener('change', () => {
    const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
    const sel = espacosSistema.find(e => e.nome === document.getElementById('editar-espaco').value);
    if (sel && Number(sel.capacidade) >= 1) {
        capacidadeEditando = sel.capacidade;
        renderizarConvidadosEdicao();
    }
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
    if (inicio && fim && inicio >= fim) {
        mostrarToast('Horário inválido', 'O início precisa ser menor que o fim.', 'erro');
        return;
    }
    const reservas = obterReservasSistema();
    const idx = reservas.findIndex(r => r.id === idParaEditar);
    if (idx !== -1) {
        reservas[idx].espaco     = espaco;
        reservas[idx].data       = data;
        reservas[idx].inicio     = inicio;
        reservas[idx].fim        = fim;
        reservas[idx].horario    = `${inicio} – ${fim}`;
        reservas[idx].convidados = convidadosEditando.map(c => c.email).join(', ') || '-';
        salvarReservasSistema(reservas);
    }

    const reservasSalas = JSON.parse(localStorage.getItem('reservasSalas') || '[]');
    const idxSalas = reservasSalas.findIndex(r => r.id === idParaEditar);
    if (idxSalas !== -1) {
        reservasSalas[idxSalas].sala       = espaco;
        reservasSalas[idxSalas].data       = data;
        reservasSalas[idxSalas].inicio     = inicio;
        reservasSalas[idxSalas].fim        = fim;
        reservasSalas[idxSalas].convidados = convidadosEditando.map(c => c.email).join(', ') || '-';
        localStorage.setItem('reservasSalas', JSON.stringify(reservasSalas));
    }
    idParaEditar = null;
    modalEditar.close();
    carregarMinhasReservas();
    mostrarToast('Reserva atualizada', 'As alterações foram salvas com sucesso!', 'sucesso');
});

// --- Modal: Cancelar Reserva ---

const modalCancelar = document.getElementById('modal-cancelar-reserva');
let idParaCancelar = null;

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
    mostrarToast('Reserva cancelada', 'Sua reserva foi cancelada com sucesso.', 'erro');
});

// --- Filtros ---

document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const label   = select.querySelector('.custom-select-label');
    const options = select.querySelectorAll('.custom-select-option');
    trigger.addEventListener('click', () => {
        const isOpen = select.classList.contains('open');
        document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
        if (!isOpen) select.classList.add('open');
    });
    options.forEach(option => {
        option.addEventListener('click', () => {
            label.textContent = option.textContent;
            select.dataset.valorSelecionado = option.dataset.value;
            select.classList.remove('open');
        });
    });
});

document.addEventListener('click', e => {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    }
});

document.querySelector('.btn-filtrar-simples').addEventListener('click', () => {
    const selects         = document.querySelectorAll('.custom-select');
    const tipoSelecionado   = selects[0].dataset.valorSelecionado || 'todos';
    const statusSelecionado = selects[1].dataset.valorSelecionado || 'todos';
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
    disableMobile: true,
    placeholder: 'dd/mm/aaaa',
    monthSelectorType: 'static',
    static: true
});



carregarMinhasReservas();
