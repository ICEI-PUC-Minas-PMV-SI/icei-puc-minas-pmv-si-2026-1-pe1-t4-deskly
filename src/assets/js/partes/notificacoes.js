function obterUsuarioLogadoId() {
    const u = JSON.parse(localStorage.getItem("usuarioLogado"));
    return u ? u.id : 'anonimo';
}

function obterNotificacoes() {
    return JSON.parse(localStorage.getItem(`notificacoes_${obterUsuarioLogadoId()}`) || '[]');
}

function salvarNotificacoes(notificacoes) {
    localStorage.setItem(`notificacoes_${obterUsuarioLogadoId()}`, JSON.stringify(notificacoes));
}

function adicionarNotificacao(mensagem) {
    const notificacoes = obterNotificacoes();
    notificacoes.unshift({ id: Date.now(), mensagem, tempo: new Date().toLocaleString("pt-BR"), lida: false });
    salvarNotificacoes(notificacoes);
    carregarNotificacoes();
}

function adicionarNotificacaoParaUsuario(userId, mensagem, extras) {
    const chave = `notificacoes_${userId}`;
    const notificacoes = JSON.parse(localStorage.getItem(chave) || '[]');
    notificacoes.unshift({
        id: Date.now(),
        mensagem,
        tempo: new Date().toLocaleString("pt-BR"),
        lida: false,
        ...(extras || {})
    });
    localStorage.setItem(chave, JSON.stringify(notificacoes));
    if (String(userId) === String(obterUsuarioLogadoId())) carregarNotificacoes();
}

function renderItemNotificacao(n, contexto) {
    const isModal   = contexto === 'modal';
    const itemClass = isModal ? 'modal-notificacao-item' : 'notification-item';
    const dotClass  = isModal ? 'modal-notificacao-dot'  : 'notification-dot';
    const contClass = isModal ? 'modal-notificacao-conteudo' : 'notification-content';
    const txtClass  = isModal ? 'modal-notificacao-texto' : 'notification-text';
    const tmeClass  = isModal ? 'modal-notificacao-tempo' : 'notification-time';

    let extra = '';
    if (n.tipo === 'convite') {
        extra = n.respondida
            ? `<span class="convite-respondida">${n.resposta === 'aceito' ? '✓ Aceito' : '✗ Recusado'}</span>`
            : `<div class="convite-acoes">
                   <button class="btn-aceitar-convite"
                       data-notif-id="${n.id}"
                       data-reserva-id="${n.reservaId}"
                       data-email="${n.emailConvidado}">Aceitar</button>
                   <button class="btn-recusar-convite"
                       data-notif-id="${n.id}"
                       data-reserva-id="${n.reservaId}"
                       data-email="${n.emailConvidado}">Recusar</button>
               </div>`;
    }

    return `
        <div class="${itemClass}">
            <div class="${dotClass}"></div>
            <div class="${contClass}">
                <span class="${txtClass}">${n.mensagem}</span>
                <span class="${tmeClass}">${n.tempo}</span>
                ${extra}
            </div>
        </div>`;
}

function ordenarNotificacoes(notificacoes) {
    const pendentes = notificacoes.filter(n => n.tipo === 'convite' && !n.respondida);
    const restantes = notificacoes.filter(n => !(n.tipo === 'convite' && !n.respondida));
    return [...pendentes, ...restantes];
}

function carregarNotificacoes() {
    const lista = document.querySelector(".notification-list");
    const badge = document.querySelector(".notification-badge");
    if (!lista || !badge) return;

    const notificacoes = ordenarNotificacoes(obterNotificacoes());
    lista.innerHTML = notificacoes.slice(0, 5).map(n => renderItemNotificacao(n, 'menu')).join('');

    const count = notificacoes.filter(n => !(n.tipo === 'convite' && n.respondida)).length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

function abrirModalNotificacoes() {
    const modal = document.getElementById("modalNotificacoes");
    const lista = document.getElementById("listaTodasNotificacoes");
    if (!modal || !lista) return;

    const notificacoes = ordenarNotificacoes(obterNotificacoes());
    lista.innerHTML = notificacoes.length
        ? notificacoes.map(n => renderItemNotificacao(n, 'modal')).join('')
        : `<div class="modal-notificacao-item">
               <div class="modal-notificacao-dot"></div>
               <div class="modal-notificacao-conteudo">
                   <span class="modal-notificacao-texto">Nenhuma notificação encontrada.</span>
                   <span class="modal-notificacao-tempo">Quando houver reservas, elas aparecerão aqui.</span>
               </div>
           </div>`;

    modal.classList.add("ativo");
}

function responderConvite(notifId, reservaId, emailConvidado, resposta) {
    const notificacoes = obterNotificacoes();
    const notif = notificacoes.find(n => n.id === Number(notifId));
    if (notif) { notif.respondida = true; notif.resposta = resposta; }
    salvarNotificacoes(notificacoes);

    const reservasSistema = JSON.parse(localStorage.getItem('reservasSistema') || '[]');
    const reserva = reservasSistema.find(r => r.id === Number(reservaId));
    if (reserva) {
        if (!reserva.convidadosStatus) reserva.convidadosStatus = {};
        reserva.convidadosStatus[emailConvidado] = resposta;
        localStorage.setItem('reservasSistema', JSON.stringify(reservasSistema));
    }

    const reservasSalas = JSON.parse(localStorage.getItem('reservasSalas') || '[]');
    const reservaSala = reservasSalas.find(r => r.id === Number(reservaId));
    if (reservaSala) {
        if (!reservaSala.convidadosStatus) reservaSala.convidadosStatus = {};
        reservaSala.convidadosStatus[emailConvidado] = resposta;
        localStorage.setItem('reservasSalas', JSON.stringify(reservasSalas));
    }

    if (reserva) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const convidado = usuarios.find(u => u.email === emailConvidado);
        const nomeConvidado = convidado ? convidado.nome : emailConvidado;
        const acao = resposta === 'aceito' ? 'aceitou' : 'recusou';
        adicionarNotificacaoParaUsuario(
            reserva.usuarioId,
            `${nomeConvidado} ${acao} o convite para ${reserva.espaco} em ${reserva.data}.`
        );
    }

    carregarNotificacoes();
    const modal = document.getElementById("modalNotificacoes");
    if (modal && modal.classList.contains("ativo")) abrirModalNotificacoes();
}

function fecharModalNotificacoes() {
    const modal = document.getElementById("modalNotificacoes");
    if (modal) modal.classList.remove("ativo");
}

function limparNotificacoes() {
    const pendentes = obterNotificacoes().filter(n => n.tipo === 'convite' && !n.respondida);
    salvarNotificacoes(pendentes);
    carregarNotificacoes();
    const lista = document.getElementById("listaTodasNotificacoes");
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

document.addEventListener("DOMContentLoaded", () => {
    carregarNotificacoes();

    const btnLimpar     = document.querySelector(".notification-clear");
    const btnFecharModal = document.getElementById("fecharModalNotificacoes");
    const modal          = document.getElementById("modalNotificacoes");

    if (btnLimpar)      btnLimpar.addEventListener("click", limparNotificacoes);
    if (btnFecharModal) btnFecharModal.addEventListener("click", fecharModalNotificacoes);
    if (modal) {
        modal.addEventListener("click", e => { if (e.target === modal) fecharModalNotificacoes(); });
    }
});

document.addEventListener("click", e => {
    if (e.target.closest(".ver-todas-notificacoes")) {
        abrirModalNotificacoes();
        return;
    }

    const btnAceitar = e.target.closest(".btn-aceitar-convite");
    const btnRecusar = e.target.closest(".btn-recusar-convite");

    if (btnAceitar) {
        responderConvite(btnAceitar.dataset.notifId, btnAceitar.dataset.reservaId, btnAceitar.dataset.email, 'aceito');
    }
    if (btnRecusar) {
        responderConvite(btnRecusar.dataset.notifId, btnRecusar.dataset.reservaId, btnRecusar.dataset.email, 'recusado');
    }
});
