const statusClasse = { pendente: 'badge-concluida', aceito: 'badge-confirmada', recusado: 'badge-cancelada' };
const statusLabel  = { pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' };

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

// --- Modal: Editar Reserva ---

const modalEditar = document.getElementById('modal-editar');
let linhaParaEditar = null;
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
}

function popularSelectEspaco(espacoAtual, tipoFiltro, fallbackCapacidade) {
    const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
    const opcoes = espacosSistema.filter(e => e.tipo === tipoFiltro && e.status === 'Ativo');
    const select = document.getElementById('editar-espaco');

    if (opcoes.length > 0) {
        select.innerHTML = opcoes.map(e =>
            `<option value="${e.nome}" ${e.nome === espacoAtual ? 'selected' : ''}>${e.nome}</option>`
        ).join('');
    } else {
        select.innerHTML = `<option value="${espacoAtual}">${espacoAtual}</option>`;
    }

    const encontrado = espacosSistema.find(e => e.nome === select.value);
    capacidadeEditando = (encontrado && typeof encontrado.capacidade === 'number')
        ? encontrado.capacidade
        : fallbackCapacidade;
}

document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
        convidadosEditando = JSON.parse(btn.dataset.convidados);
        linhaParaEditar    = btn.closest('tr');

        const espacoAtual = btn.dataset.espaco;
        const ehMesa      = espacoAtual.toLowerCase().includes('mesa');
        const tipoFiltro  = ehMesa ? 'Estação de Trabalho' : 'Sala de Reunião';

        const btnConv          = linhaParaEditar.querySelector('.btn-convidados');
        const fallbackCapacidade = btnConv ? Number(btnConv.dataset.capacidade) : Infinity;
        popularSelectEspaco(espacoAtual, tipoFiltro, fallbackCapacidade);

        document.getElementById('editar-data').value   = btn.dataset.data;
        document.getElementById('editar-inicio').value = btn.dataset.inicio;
        document.getElementById('editar-fim').value    = btn.dataset.fim;

        document.getElementById('editar-grupo-convidados').style.display = ehMesa ? 'none' : '';
        document.getElementById('editar-grupo-adicionar').style.display  = ehMesa ? 'none' : '';

        renderizarConvidadosEdicao();
        modalEditar.showModal();
    });
});

document.getElementById('editar-espaco').addEventListener('change', () => {
    const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
    const selecionado = espacosSistema.find(e => e.nome === document.getElementById('editar-espaco').value);
    if (selecionado && typeof selecionado.capacidade === 'number') {
        capacidadeEditando = selecionado.capacidade;
        renderizarConvidadosEdicao();
    }
});

document.querySelector('.conv-adicionar-btn').addEventListener('click', () => {
    const input = document.getElementById('editar-novo-convidado');
    const email = input.value.trim();

    if (!email) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarToast('E-mail inválido', 'Digite um e-mail válido antes de adicionar.', 'erro');
        return;
    }

    if (convidadosEditando.some(c => c.email === email)) {
        mostrarToast('E-mail repetido', 'Verifique novamente.', 'erro');
        return;
    }

    if (capacidadeEditando !== Infinity && convidadosEditando.length >= capacidadeEditando) {
        mostrarToast('Capacidade máxima', `Capacidade máxima da sala atingida (${capacidadeEditando}).`, 'erro');
        return;
    }

    convidadosEditando.push({ email, status: 'pendente' });
    input.value = '';
    renderizarConvidadosEdicao();
});

document.querySelector('#modal-editar .btn-confirmar').addEventListener('click', () => {
    if (!linhaParaEditar) return;

    const espaco = document.getElementById('editar-espaco').value.trim();
    const data   = document.getElementById('editar-data').value.trim();
    const inicio = document.getElementById('editar-inicio').value.trim();
    const fim    = document.getElementById('editar-fim').value.trim();

    if (inicio && fim && inicio >= fim) {
        mostrarToast('Horário inválido', 'O horário de início precisa ser menor que o horário de fim.', 'erro');
        return;
    }

    const horario = `${inicio} – ${fim}`;

    linhaParaEditar.querySelector('td[data-label="Espaço"]').textContent              = espaco;
    linhaParaEditar.querySelector('td[data-label="Data"]').textContent                = data;
    linhaParaEditar.querySelector('.col-nowrap[data-label="Horário"]').textContent    = horario;

    const btnConv = linhaParaEditar.querySelector('.btn-convidados');
    if (btnConv) {
        btnConv.textContent          = `${convidadosEditando.length} / ${capacidadeEditando} →`;
        btnConv.dataset.convidados   = JSON.stringify(convidadosEditando);
        btnConv.dataset.espaco       = espaco;
        btnConv.dataset.data         = data;
        btnConv.dataset.horario      = horario;
    }

    const btnEdit = linhaParaEditar.querySelector('.btn-editar');
    btnEdit.dataset.espaco     = espaco;
    btnEdit.dataset.data       = data;
    btnEdit.dataset.inicio     = inicio;
    btnEdit.dataset.fim        = fim;
    btnEdit.dataset.convidados = JSON.stringify(convidadosEditando);

    const btnCancel = linhaParaEditar.querySelector('.btn-cancelar');
    if (btnCancel) {
        btnCancel.dataset.espaco  = espaco;
        btnCancel.dataset.data    = data;
        btnCancel.dataset.horario = horario;
    }

    linhaParaEditar = null;
    modalEditar.close();
    mostrarToast('Reserva atualizada', 'As alterações foram salvas com sucesso!', 'sucesso');
});

// --- Modal: Convidados ---

const modalConv = document.getElementById('modal-convidados');

document.querySelectorAll('.btn-convidados').forEach(btn => {
    btn.addEventListener('click', () => {
        const convidados = JSON.parse(btn.dataset.convidados);

        const espacosSistema = JSON.parse(localStorage.getItem('espacosSistema')) || [];
        const espacoAdmin    = espacosSistema.find(e => e.nome === btn.dataset.espaco);
        const capacidade     = (espacoAdmin && typeof espacoAdmin.capacidade === 'number')
            ? espacoAdmin.capacidade
            : Number(btn.dataset.capacidade);

        document.getElementById('conv-titulo').textContent = `Convidados - ${btn.dataset.espaco}`;
        document.getElementById('conv-subtitulo').textContent =
            `${btn.dataset.data} · ${btn.dataset.horario} · Capacidade: ${capacidade}`;

        document.getElementById('conv-lista').innerHTML = convidados.map(c => `
            <div class="modal-convidados-item">
                <span>${c.email}</span>
                <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
            </div>
        `).join('');

        const vagas = capacidade - convidados.length;
        document.getElementById('conv-rodape').textContent =
            `${convidados.length} / ${capacidade} convidados · ${vagas} vaga${vagas !== 1 ? 's' : ''} restante${vagas !== 1 ? 's' : ''}`;

        modalConv.showModal();
    });
});

// --- Modal: Cancelar Reserva ---

const modalCancelar = document.getElementById('modal-cancelar-reserva');
let linhaParaCancelar = null;

document.querySelectorAll('.btn-cancelar').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('modal-cancelar-espaco').textContent  = btn.dataset.espaco;
        document.getElementById('modal-cancelar-data').textContent    = btn.dataset.data;
        document.getElementById('modal-cancelar-horario').textContent = btn.dataset.horario;
        linhaParaCancelar = btn.closest('tr');
        modalCancelar.showModal();
    });
});

document.querySelector('.modal-detalhe-btn-confirmar-cancelamento').addEventListener('click', () => {
    if (!linhaParaCancelar) return;

    const espaco  = document.getElementById('modal-cancelar-espaco').textContent;
    const data    = document.getElementById('modal-cancelar-data').textContent;
    const horario = document.getElementById('modal-cancelar-horario').textContent;

    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td data-label="Espaço">${espaco}</td>
        <td data-label="Data">${data}</td>
        <td class="col-nowrap" data-label="Horário">${horario}</td>
        <td data-label="Status"><span class="badge badge-cancelada">Cancelada</span></td>
    `;

    document.getElementById('tbody-historico').appendChild(novaLinha);
    linhaParaCancelar.remove();
    linhaParaCancelar = null;

    if (typeof adicionarNotificacao === 'function') {
        adicionarNotificacao(
            `Reserva cancelada: ${espaco} no dia ${data}, das ${horario}.`
        );
    }

    modalCancelar.close();
    mostrarToast('Reserva cancelada', 'Sua reserva foi cancelada com sucesso.', 'erro');
});

// --- Filtros (custom select) ---

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

// --- Botão Filtrar ---

document.querySelector('.btn-filtrar-simples').addEventListener('click', () => {
    const selects = document.querySelectorAll('.custom-select');
    const tipoSelecionado   = selects[0].dataset.valorSelecionado || 'todos';
    const statusSelecionado = selects[1].dataset.valorSelecionado || 'todos';

    document.querySelectorAll('.reservas-table tbody tr').forEach(linha => {
        const espaco = linha.querySelector('td[data-label="Espaço"]').textContent.trim().toLowerCase();
        const badge  = linha.querySelector('.badge');
        const classeBadge = badge ? badge.className : '';

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

// --- Calendário (flatpickr) ---

flatpickr('.modal-date-input', {
    locale: 'pt',
    dateFormat: 'd/m/Y',
    disableMobile: true,
    placeholder: 'dd/mm/aaaa',
    monthSelectorType: 'static',
    static: true
});
