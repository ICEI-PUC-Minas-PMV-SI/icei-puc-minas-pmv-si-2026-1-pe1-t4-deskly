// notificacoes.js — Sistema de notificações por usuário.
// Depende de: utils.js (obterUsuarioLogado)
// Expõe globalmente: adicionarNotificacao, adicionarNotificacaoParaUsuario

function _notifChave() {
    const u = obterUsuarioLogado();
    return `notificacoes_${u ? u.id : 'anonimo'}`;
}

function obterNotificacoes() {
    return JSON.parse(localStorage.getItem(_notifChave()) || '[]');
}

function salvarNotificacoes(notificacoes) {
    localStorage.setItem(_notifChave(), JSON.stringify(notificacoes));
}

function adicionarNotificacao(mensagem) {
    const lista = obterNotificacoes();
    lista.unshift({ id: Date.now(), mensagem, tempo: new Date().toLocaleString('pt-BR'), lida: false });
    salvarNotificacoes(lista);
    carregarNotificacoes();
}

function adicionarNotificacaoParaUsuario(userId, mensagem, extras) {
    const chave = `notificacoes_${userId}`;
    const lista = JSON.parse(localStorage.getItem(chave) || '[]');
    lista.unshift({
        id: Date.now(), mensagem,
        tempo: new Date().toLocaleString('pt-BR'),
        lida: false,
        ...(extras || {})
    });
    localStorage.setItem(chave, JSON.stringify(lista));
    const u = obterUsuarioLogado();
    if (u && String(userId) === String(u.id)) carregarNotificacoes();
}

function _renderItem(n, contexto) {
    const isModal = contexto === 'modal';
    const c = {
        item: isModal ? 'modal-notificacao-item'    : 'notification-item',
        dot:  isModal ? 'modal-notificacao-dot'     : 'notification-dot',
        cont: isModal ? 'modal-notificacao-conteudo': 'notification-content',
        txt:  isModal ? 'modal-notificacao-texto'   : 'notification-text',
        tme:  isModal ? 'modal-notificacao-tempo'   : 'notification-time',
    };

    let extra = '';
    if (n.tipo === 'convite') {
        extra = n.respondida
            ? `<span class="convite-respondida">${n.resposta === 'aceito' ? '✓ Aceito' : '✗ Recusado'}</span>`
            : `<div class="convite-acoes">
                   <button class="btn-aceitar-convite" data-notif-id="${n.id}" data-reserva-id="${n.reservaId}" data-email="${n.emailConvidado}">Aceitar</button>
                   <button class="btn-recusar-convite" data-notif-id="${n.id}" data-reserva-id="${n.reservaId}" data-email="${n.emailConvidado}">Recusar</button>
               </div>`;
    }

    return `
        <div class="${c.item}">
            <div class="${c.dot}"></div>
            <div class="${c.cont}">
                <span class="${c.txt}">${n.mensagem}</span>
                <span class="${c.tme}">${n.tempo}</span>
                ${extra}
            </div>
        </div>`;
}

function _ordenar(lista) {
    const pendentes = lista.filter(n => n.tipo === 'convite' && !n.respondida);
    const restantes = lista.filter(n => !(n.tipo === 'convite' && !n.respondida));
    return [...pendentes, ...restantes];
}

function carregarNotificacoes() {
    const lista  = document.querySelector('.notification-list');
    const badge  = document.querySelector('.notification-badge');
    if (!lista || !badge) return;

    const notifs = _ordenar(obterNotificacoes());
    lista.innerHTML = notifs.slice(0, 5).map(n => _renderItem(n, 'menu')).join('');

    const count = notifs.filter(n => !(n.tipo === 'convite' && n.respondida)).length;
    badge.textContent    = count;
    badge.style.display  = count > 0 ? 'flex' : 'none';
}

function abrirModalNotificacoes() {
    const modal = document.getElementById('modalNotificacoes');
    const lista = document.getElementById('listaTodasNotificacoes');
    if (!modal || !lista) return;

    const notifs = _ordenar(obterNotificacoes());
    lista.innerHTML = notifs.length
        ? notifs.map(n => _renderItem(n, 'modal')).join('')
        : `<div class="modal-notificacao-item">
               <div class="modal-notificacao-dot"></div>
               <div class="modal-notificacao-conteudo">
                   <span class="modal-notificacao-texto">Nenhuma notificação encontrada.</span>
                   <span class="modal-notificacao-tempo">Quando houver reservas, elas aparecerão aqui.</span>
               </div>
           </div>`;

    modal.classList.add('ativo');
}

function fecharModalNotificacoes() {
    const modal = document.getElementById('modalNotificacoes');
    if (modal) modal.classList.remove('ativo');
}

function limparNotificacoes() {
    const pendentes = obterNotificacoes().filter(n => n.tipo === 'convite' && !n.respondida);
    salvarNotificacoes(pendentes);
    carregarNotificacoes();

    const lista = document.getElementById('listaTodasNotificacoes');
    if (lista) {
        lista.innerHTML = `
            <div class="modal-notificacao-item">
                <div class="modal-notificacao-dot"></div>
                <div class="modal-notificacao-conteudo">
                    <span class="modal-notificacao-texto">Nenhuma notificação encontrada.</span>
                    <span class="modal-notificacao-tempo">Quando houver reservas, elas aparecerão aqui.</span>
                </div>
            </div>`;
    }
}

function responderConvite(notifId, reservaId, emailConvidado, resposta) {
    const notifs = obterNotificacoes();
    const notif  = notifs.find(n => n.id === Number(notifId));
    if (notif) { notif.respondida = true; notif.resposta = resposta; }
    salvarNotificacoes(notifs);

    ['reservasSistema', 'reservasSalas'].forEach(chave => {
        const lista = JSON.parse(localStorage.getItem(chave) || '[]');
        const reserva = lista.find(r => r.id === Number(reservaId));
        if (reserva) {
            if (!reserva.convidadosStatus) reserva.convidadosStatus = {};
            reserva.convidadosStatus[emailConvidado] = resposta;
            localStorage.setItem(chave, JSON.stringify(lista));
        }
    });

    const reservasSistema = JSON.parse(localStorage.getItem('reservasSistema') || '[]');
    const reserva = reservasSistema.find(r => r.id === Number(reservaId));
    if (reserva) {
        const usuarios = obterUsuarios();
        const convidado = usuarios.find(u => u.email === emailConvidado);
        const nome = convidado ? convidado.nome : emailConvidado;
        const acao = resposta === 'aceito' ? 'aceitou' : 'recusou';
        adicionarNotificacaoParaUsuario(
            reserva.usuarioId,
            `${nome} ${acao} o convite para ${reserva.espaco} em ${reserva.data}.`
        );
    }

    carregarNotificacoes();
    const modal = document.getElementById('modalNotificacoes');
    if (modal && modal.classList.contains('ativo')) abrirModalNotificacoes();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNotificacoes();

    const btnLimpar      = document.querySelector('.notification-clear');
    const btnFecharModal = document.getElementById('fecharModalNotificacoes');
    const modal          = document.getElementById('modalNotificacoes');

    if (btnLimpar)      btnLimpar.addEventListener('click', limparNotificacoes);
    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModalNotificacoes);
    if (modal)          modal.addEventListener('click', e => { if (e.target === modal) fecharModalNotificacoes(); });
});

document.addEventListener('click', e => {
    if (e.target.closest('.ver-todas-notificacoes')) {
        abrirModalNotificacoes();
        return;
    }
    const btnAceitar = e.target.closest('.btn-aceitar-convite');
    const btnRecusar = e.target.closest('.btn-recusar-convite');
    if (btnAceitar) responderConvite(btnAceitar.dataset.notifId, btnAceitar.dataset.reservaId, btnAceitar.dataset.email, 'aceito');
    if (btnRecusar) responderConvite(btnRecusar.dataset.notifId, btnRecusar.dataset.reservaId, btnRecusar.dataset.email, 'recusado');
});
