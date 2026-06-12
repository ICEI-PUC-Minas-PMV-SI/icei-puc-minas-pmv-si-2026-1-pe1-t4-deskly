const statusClasse = { pendente: 'badge-concluida', aceito: 'badge-confirmada', recusado: 'badge-cancelada' };
const statusLabel  = { pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' };

// --- Modal: Editar Reserva ---

const modalEditar = document.getElementById('modal-editar');

document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
        const convidados = JSON.parse(btn.dataset.convidados);

        document.getElementById('editar-espaco').value = btn.dataset.espaco;
        document.getElementById('editar-data').value   = btn.dataset.data;
        document.getElementById('editar-inicio').value = btn.dataset.inicio;
        document.getElementById('editar-fim').value    = btn.dataset.fim;

        document.getElementById('editar-lista').innerHTML = convidados.map(c => `
            <div class="modal-convidados-item">
                <span>${c.email}</span>
                <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
            </div>
        `).join('');

        modalEditar.showModal();
    });
});

// --- Modal: Convidados ---

const modalConv = document.getElementById('modal-convidados');

document.querySelectorAll('.btn-convidados').forEach(btn => {
    btn.addEventListener('click', () => {
        const convidados = JSON.parse(btn.dataset.convidados);
        const capacidade = Number(btn.dataset.capacidade);

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

    modalCancelar.close();
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
