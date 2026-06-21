const calendar  = document.getElementById('calendar');
const mesLabel   = document.getElementById('mesLabel');

let reservas = {};
let mesAtual  = new Date().getMonth();
let anoAtual  = new Date().getFullYear();
const hoje    = new Date();

function _chave(dia) {
    return `${anoAtual}-${mesAtual}-${dia}`;
}

function _dataParaChave(dataStr) {
    const [d, m, y] = dataStr.split('/');
    const dia = Number(d), mes = Number(m) - 1, ano = Number(y);
    if (!dia || isNaN(mes) || !ano) return null;
    return `${ano}-${mes}-${dia}`;
}

function _separarNomeArea(espaco, tipo) {
    if (tipo !== 'Estação de Trabalho') return { nome: espaco, area: '' };
    if (espaco.includes(' — ')) {
        const partes = espaco.split(' — ');
        return { nome: partes[0], area: partes.slice(1).join(' — ') };
    }
    return { nome: espaco, area: '' };
}

function carregarReservas() {
    const lista   = obterReservasSistema();
    const espacos = obterEspacosSistema();
    reservas = {};

    lista.forEach(reserva => {
        if (reserva.status === 'Cancelada') return;

        const dadosEspaco    = _separarNomeArea(reserva.espaco, reserva.tipo);
        const espacoOriginal = espacos.find(e =>
            e.nome === reserva.espaco || e.nome === dadosEspaco.nome
        );
        if (espacoOriginal && espacoOriginal.status === 'Inativo') return;

        const key = _dataParaChave(reserva.data);
        if (!key) return;

        if (!reservas[key]) reservas[key] = [];
        reservas[key].push({
            id:          reserva.id,
            espaco:      reserva.espaco,
            tipo:        reserva.tipo,
            responsavel: reserva.usuario,
            inicio:      reserva.inicio,
            fim:         reserva.fim,
            emails:      reserva.convidados || '',
            status:      reserva.status || 'Confirmada',
            key
        });
    });
}

function renderCalendar() {
    carregarReservas();
    calendar.innerHTML = '';

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias   = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) calendar.appendChild(document.createElement('div'));

    for (let dia = 1; dia <= totalDias; dia++) {
        const d = document.createElement('div');
        d.className = 'day';
        d.innerText = dia;

        if (dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()) {
            d.classList.add('today');
        }

        const key = _chave(dia);
        if (reservas[key] && reservas[key].length > 0) {
            d.classList.add('has-event');
            reservas[key].forEach((reserva, index) => {
                const dados = _separarNomeArea(reserva.espaco, reserva.tipo);
                const ev    = document.createElement('div');
                ev.className = 'event';
                ev.innerHTML = `
                    <strong>${dados.nome}</strong>
                    <span class="small">${reserva.inicio} - ${reserva.fim}</span>
                    <span class="small">${reserva.tipo}</span>`;
                ev.onclick = e => { e.stopPropagation(); abrirView(dia, index); };
                d.appendChild(ev);
            });
        }

        calendar.appendChild(d);
    }

    mesLabel.innerText = new Date(anoAtual, mesAtual).toLocaleString('pt-BR', {
        month: 'long', year: 'numeric'
    });
}

function mudarMes(dir) {
    mesAtual += dir;
    if (mesAtual < 0)  { mesAtual = 11; anoAtual--; }
    if (mesAtual > 11) { mesAtual = 0;  anoAtual++; }
    renderCalendar();
}

function abrirView(dia, index) {
    const reserva = reservas[_chave(dia)][index];
    const dados   = _separarNomeArea(reserva.espaco, reserva.tipo);

    const espacos    = obterEspacosSistema();
    const infoOriginal = espacos.find(e => e.nome === dados.nome || e.nome === reserva.espaco);
    const capacidade = infoOriginal ? infoOriginal.capacidade : '-';
    const area       = (infoOriginal && infoOriginal.area) || dados.area || '-';

    document.getElementById('titulo').innerHTML = `
        ${dados.nome}
        ${dados.area ? `<br><small style="color:var(--color-text-md);font-size:13px;font-weight:normal;">${dados.area}</small>` : ''}`;

    document.getElementById('horario').innerText       = `${reserva.inicio} - ${reserva.fim}`;
    document.getElementById('respView').innerText      = reserva.responsavel || '-';
    document.getElementById('capacidadeView').innerText = `${capacidade} pessoas`;
    document.getElementById('areaView').innerText      = area;
    document.getElementById('statusView').innerText    = reserva.status;

    const listaEmails = document.getElementById('listaEmails');
    listaEmails.innerHTML = '';
    if (reserva.emails && reserva.emails !== '-') {
        reserva.emails.split(',').forEach(email => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerText = email.trim();
            listaEmails.appendChild(tag);
        });
    }

    document.getElementById('viewModal').showModal();
}

function fecharView() {
    document.getElementById('viewModal').close();
}

window.addEventListener('storage', renderCalendar);
renderCalendar();
