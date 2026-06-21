const btnNovaReserva  = document.querySelector('.btn-primary.open-modal');
const btnConfirmar    = document.getElementById('btn-confirmar-estacao');
const btnFiltrar      = document.querySelector('.btn-filtrar');
const modal           = document.getElementById('modal-reserva-estacao');
const selectEstacao   = document.getElementById('select-estacao');
const inputDataModal  = document.querySelector('.modal-date-input');
const inputFiltroData = document.querySelector('.date-input');
const inputFiltroInicio = document.querySelector('.filtro-inicio');
const inputFiltroFim    = document.querySelector('.filtro-fim');
const inputInicio     = document.getElementById('estacao-horario-inicio');
const inputFim        = document.getElementById('estacao-horario-fim');

function obterReservasEstacoes() {
    return JSON.parse(localStorage.getItem('reservasEstacoes') || '[]');
}

function salvarReservasEstacoes(reservas) {
    localStorage.setItem('reservasEstacoes', JSON.stringify(reservas));
}

function _nomeEstacaoPeloCard(card) {
    const nome = card.querySelector('h4').textContent.trim();
    const area  = card.querySelector('.subtitle').textContent.replace('Área: ', '').trim();
    return `${nome} — ${area}`;
}

function _salvarNoSistema(reserva) {
    const usuario = obterUsuarioLogado();
    if (!usuario) {
        mostrarToast('Usuário não encontrado', 'Faça login novamente para realizar a reserva.', 'erro');
        return;
    }
    const lista = obterReservasSistema();
    lista.unshift({
        id:        reserva.id,
        usuarioId: usuario.id,
        usuario:   usuario.nome,
        tipo:      'Estação de Trabalho',
        espaco:    reserva.estacao,
        data:      reserva.data,
        inicio:    reserva.inicio,
        fim:       reserva.fim,
        horario:   `${reserva.inicio} – ${reserva.fim}`,
        convidados: '-',
        status:    'Confirmada'
    });
    salvarReservasSistema(lista);
}

function gerarCardsEstacoes() {
    const lista    = document.querySelector('.estacoes-lista');
    const estacoes = obterEspacosSistema().filter(e => e.tipo === 'Estação de Trabalho');
    if (!lista) return;

    lista.innerHTML = '';
    estacoes.forEach(espaco => {
        const imagem     = espaco.imagem || `assets/images/${espaco.nome}.png`;
        const classeBadge = espaco.status === 'Inativo' ? 'inativa' : 'disponivel';
        const textoBadge  = espaco.status === 'Inativo' ? 'Inativa' : 'Disponível';
        const disabled    = espaco.status === 'Inativo' ? 'disabled' : '';

        lista.innerHTML += `
            <div class="estacao-card" data-inativa="${espaco.status === 'Inativo'}">
                <div class="estacao-info">
                    <img class="estacao-icon" src="${imagem}" alt="${espaco.nome}">
                    <div>
                        <h4>${espaco.nome}</h4>
                        <span class="subtitle">Área: ${espaco.area}</span>
                    </div>
                </div>
                <div class="estacao-acoes">
                    <span class="badge ${classeBadge}">${textoBadge}</span>
                    <button class="fast-action-btn open-modal" data-modal="modal-reserva-estacao" ${disabled}>Reservar</button>
                </div>
            </div>`;
    });

    atualizarSelectTodasEstacoes();
}

function atualizarSelectTodasEstacoes() {
    const estacoes = obterEspacosSistema().filter(e =>
        e.tipo === 'Estação de Trabalho' && e.status !== 'Inativo'
    );
    selectEstacao.innerHTML = '';
    estacoes.forEach(e => {
        const opt = document.createElement('option');
        opt.textContent = `${e.nome} — ${e.area}`;
        opt.value       = `${e.nome} — ${e.area}`;
        selectEstacao.appendChild(opt);
    });
}

function atualizarSelectUmaEstacao(estacao) {
    selectEstacao.innerHTML = '';
    const opt = document.createElement('option');
    opt.textContent = estacao;
    opt.value       = estacao;
    selectEstacao.appendChild(opt);
}

// Abre modal ao clicar em "Reservar" em um card específico
document.addEventListener('click', e => {
    const botao = e.target.closest('.fast-action-btn');
    if (!botao || botao.disabled) return;
    const card = botao.closest('.estacao-card');
    if (!card || card.dataset.inativa === 'true') return;
    atualizarSelectUmaEstacao(_nomeEstacaoPeloCard(card));
    if (!modal.open) modal.showModal();
});

// Botão "Nova Reserva" (abre o modal via modal.js; aqui só popula o select)
if (btnNovaReserva) {
    btnNovaReserva.addEventListener('click', atualizarSelectTodasEstacoes);
}

if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        const estacao = selectEstacao.value;
        const data    = inputDataModal.value;
        const inicio  = inputInicio.value;
        const fim     = inputFim.value;

        if (!estacao || !data || !inicio || !fim) {
            if (!estacao) marcarCampoInvalido(selectEstacao);
            if (!data)    marcarCampoInvalido(inputDataModal);
            if (!inicio)  marcarCampoInvalido(inputInicio);
            if (!fim)     marcarCampoInvalido(inputFim);
            mostrarToast('Campos obrigatórios', 'Preencha todos os campos da reserva.', 'erro');
            return;
        }

        if (dataHoraNoPassado(data, inicio)) {
            marcarCampoInvalido(inputDataModal);
            marcarCampoInvalido(inputInicio);
            mostrarToast('Horário inválido', 'Não é possível reservar em uma data/horário que já passou.', 'erro');
            return;
        }

        if (inicio >= fim) {
            marcarCampoInvalido(inputInicio);
            marcarCampoInvalido(inputFim);
            mostrarToast('Horário inválido', 'O horário de início precisa ser menor que o horário de fim.', 'erro');
            return;
        }

        const reservas = obterReservasEstacoes();
        const ocupado  = reservas.some(r =>
            r.estacao === estacao && r.data === data && horariosConflitam(inicio, fim, r.inicio, r.fim)
        );
        if (ocupado) {
            mostrarToast('Horário indisponível', 'Essa estação já está reservada nesse horário.', 'erro');
            return;
        }

        const novaReserva = { id: Date.now(), estacao, data, inicio, fim };
        reservas.push(novaReserva);
        salvarReservasEstacoes(reservas);
        _salvarNoSistema(novaReserva);

        if (typeof adicionarNotificacao === 'function') {
            adicionarNotificacao(`Reserva confirmada para ${estacao} no dia ${data}, das ${inicio} às ${fim}.`);
        }

        mostrarToast('Reserva confirmada', 'Sua reserva foi realizada com sucesso!', 'sucesso');
        inputDataModal.value = '';
        inputInicio.value    = '';
        inputFim.value       = '';
        modal.close();
    });
}

if (btnFiltrar) {
    btnFiltrar.addEventListener('click', () => {
        const dataFiltro   = inputFiltroData.value;
        const inicioFiltro = inputFiltroInicio.value;
        const fimFiltro    = inputFiltroFim.value;

        if (!dataFiltro || !inicioFiltro || !fimFiltro) {
            mostrarToast('Filtro incompleto', 'Preencha a data, horário inicial e horário final.', 'erro');
            return;
        }
        if (inicioFiltro >= fimFiltro) {
            mostrarToast('Horário inválido', 'O horário inicial do filtro precisa ser menor que o horário final.', 'erro');
            return;
        }

        const reservas = obterReservasEstacoes();
        document.querySelectorAll('.estacao-card').forEach(card => {
            const badge  = card.querySelector('.badge');
            const botao  = card.querySelector('.fast-action-btn');

            if (card.dataset.inativa === 'true') {
                badge.textContent = 'Inativa';
                badge.className   = 'badge inativa';
                botao.disabled    = true;
                return;
            }

            const estacao  = _nomeEstacaoPeloCard(card);
            const ocupada  = reservas.some(r =>
                r.estacao === estacao && r.data === dataFiltro &&
                horariosConflitam(inicioFiltro, fimFiltro, r.inicio, r.fim)
            );

            if (ocupada) {
                badge.textContent = 'Ocupada';
                badge.className   = 'badge ocupado';
                botao.disabled    = true;
            } else {
                badge.textContent = 'Disponível';
                badge.className   = 'badge disponivel';
                botao.disabled    = false;
            }
        });
    });
}

function _aplicarStatusEspacos() {
    const espacos = obterEspacosSistema();
    document.querySelectorAll('.estacao-card').forEach(card => {
        const nomeMesa = card.querySelector('h4').textContent.trim();
        const espaco   = espacos.find(e => e.tipo === 'Estação de Trabalho' && e.nome === nomeMesa);
        if (!espaco) return;

        const badge  = card.querySelector('.badge');
        const botao  = card.querySelector('.fast-action-btn');

        if (espaco.status === 'Inativo') {
            card.dataset.inativa = 'true';
            badge.textContent = 'Inativa';
            badge.className   = 'badge inativa';
            botao.disabled    = true;
        } else {
            card.dataset.inativa = 'false';
            badge.textContent = 'Disponível';
            badge.className   = 'badge disponivel';
            botao.disabled    = false;
        }
    });
}

gerarCardsEstacoes();
_aplicarStatusEspacos();
