const calendar = document.getElementById('calendar');
const mesLabel = document.getElementById('mesLabel');

let reservas = {};

let diaSelecionado = null;
let indexSelecionado = null;
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
const hoje = new Date();

function chave(dia) { return `${anoAtual}-${mesAtual}-${dia}`; }
function salvarLocal() { /* reservas já estão em memória */ }

function renderCalendar() {
    calendar.innerHTML = "";
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const d = document.createElement('div');
        d.className = 'day';
        d.innerText = dia;

        if (dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()) {
            d.classList.add('today');
        }

        const key = chave(dia);
        if (reservas[key] && reservas[key].length > 0) {
            d.classList.add('has-event');
            reservas[key].forEach((r, i) => {
                const ev = document.createElement('div');
                ev.className = 'event';
                ev.innerHTML = `
                    <strong>${r.espaco}</strong>
                    <span class='small'>${r.inicio} - ${r.fim}</span>
                    <span class='small'>👤 ${r.responsavel || '-'}</span>
                    <span class='small'>👥 ${r.emails ? r.emails.split(',').length + ' convidados' : '0 convidados'}</span>
                `;
                ev.onclick = (e) => { e.stopPropagation(); abrirView(dia, i); };
                d.appendChild(ev);
            });
        }

        d.onclick = () => abrir(dia);
        calendar.appendChild(d);
    }

    mesLabel.innerText = new Date(anoAtual, mesAtual).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

function mudarMes(dir) {
    mesAtual += dir;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    renderCalendar();
}

function abrir(dia) {
    diaSelecionado = dia;
    indexSelecionado = null;
    document.getElementById('modalTitle').innerText = 'Nova Reserva';

    const dataInput = document.getElementById('data');
    const data = new Date(anoAtual, mesAtual, dia);
    dataInput.value = data.toISOString().split('T')[0];

    document.getElementById('espaco').selectedIndex = 0;
    document.getElementById('inicio').value = '';
    document.getElementById('fim').value = '';
    document.getElementById('responsavel').value = '';
    document.getElementById('emails').value = '';
    document.getElementById('status').selectedIndex = 0;

    document.getElementById('modal').showModal();
}

function fechar() { document.getElementById('modal').close(); }

function salvar() {
    const emailsInput = document.getElementById('emails').value;
    const selected = emailsInput ? emailsInput.split(',').map(e => e.trim()).filter(e => e) : [];

    if (selected.length > 3) {
        alert('Máximo de 3 convidados');
        return;
    }

    const dataVal = document.getElementById('data').value;
    if (!dataVal) { alert('Selecione a data'); return; }

    const partes = dataVal.split('-');
    const ano = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    const key = `${ano}-${mes}-${dia}`;

    const nova = {
        espaco: document.getElementById('espaco').value,
        responsavel: document.getElementById('responsavel').value,
        inicio: document.getElementById('inicio').value,
        fim: document.getElementById('fim').value,
        emails: selected.join(','),
        status: document.getElementById('status').value,
        key: key
    };

    if (!reservas[key]) reservas[key] = [];

    if (indexSelecionado !== null) {
        const chaveAntiga = chave(diaSelecionado);
        if (chaveAntiga !== key) {
            reservas[chaveAntiga].splice(indexSelecionado, 1);
            if (reservas[chaveAntiga].length === 0) delete reservas[chaveAntiga];
            reservas[key].push(nova);
        } else {
            reservas[key][indexSelecionado] = nova;
        }
    } else {
        reservas[key].push(nova);
    }

    salvarLocal();
    renderCalendar();
    fechar();
}

function abrirView(dia, index) {
    const r = reservas[chave(dia)][index];
    diaSelecionado = dia;
    indexSelecionado = index;

    document.getElementById('titulo').innerText = r.espaco;
    document.getElementById('horario').innerText = r.inicio + ' - ' + r.fim;
    document.getElementById('respView').innerText = 'Responsável: ' + (r.responsavel || '-');
    document.getElementById('statusView').innerText = 'Status: ' + r.status;

    const listaEmails = document.getElementById('listaEmails');
    listaEmails.innerHTML = '';
    if (r.emails) {
        r.emails.split(',').forEach(e => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerText = e.trim();
            listaEmails.appendChild(tag);
        });
    }

    document.getElementById('viewModal').showModal();
}

function editar() {
    const r = reservas[chave(diaSelecionado)][indexSelecionado];

    document.getElementById('espaco').value = r.espaco;
    document.getElementById('responsavel').value = r.responsavel;
    document.getElementById('inicio').value = r.inicio;
    document.getElementById('fim').value = r.fim;
    document.getElementById('status').value = r.status;
    document.getElementById('emails').value = r.emails || '';

    if (r.key) {
        const partes = r.key.split('-');
        const dataFormatada = `${partes[0]}-${String(Number(partes[1]) + 1).padStart(2, '0')}-${String(partes[2]).padStart(2, '0')}`;
        document.getElementById('data').value = dataFormatada;
    }

    document.getElementById('modalTitle').innerText = 'Editar Reserva';
    document.getElementById('viewModal').close();
    document.getElementById('modal').showModal();
}

function excluir() {
    const key = chave(diaSelecionado);
    reservas[key].splice(indexSelecionado, 1);
    if (reservas[key].length === 0) delete reservas[key];
    salvarLocal();
    renderCalendar();
    fecharView();
}

function fecharView() { document.getElementById('viewModal').close(); }

renderCalendar();