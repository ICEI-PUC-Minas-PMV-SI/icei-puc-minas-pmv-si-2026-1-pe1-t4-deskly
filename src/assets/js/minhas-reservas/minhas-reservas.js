const statusClasse = { pendente: 'badge-concluida', aceito: 'badge-confirmada', recusado: 'badge-cancelada' };
const statusLabel  = { pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' };

const modalEditar = document.getElementById('modal-editar');

document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
        const convidados = JSON.parse(btn.dataset.convidados);

        document.getElementById('editar-espaco').value  = btn.dataset.espaco;
        document.getElementById('editar-data').value    = btn.dataset.data;
        document.getElementById('editar-inicio').value  = btn.dataset.inicio;
        document.getElementById('editar-fim').value     = btn.dataset.fim;

        document.getElementById('editar-lista').innerHTML = convidados.map(c => `
            <div class="modal-convidados-item">
                <span>${c.email}</span>
                <span class="badge ${statusClasse[c.status]}">${statusLabel[c.status]}</span>
            </div>
        `).join('');

        modalEditar.showModal();
    });
});

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

const modal = document.getElementById('modal-cancelar-reserva');

document.querySelectorAll('.btn-cancelar').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('modal-cancelar-espaco').textContent = btn.dataset.espaco;
        document.getElementById('modal-cancelar-data').textContent = btn.dataset.data;
        document.getElementById('modal-cancelar-horario').textContent = btn.dataset.horario;
        modal.showModal();
    });
});

document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const label = select.querySelector('.custom-select-label');
    const options = select.querySelectorAll('.custom-select-option');

    trigger.addEventListener('click', () => {
        const isOpen = select.classList.contains('open');
        document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
        if (!isOpen) select.classList.add('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            label.textContent = option.textContent;
            select.classList.remove('open');
        });
    });
});

document.addEventListener('click', e => {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    }
});
