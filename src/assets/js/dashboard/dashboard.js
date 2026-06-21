document.addEventListener('DOMContentLoaded', () => {
    const usuario = obterUsuarioLogado();
    if (!usuario) { window.location.href = 'index.html'; return; }

    const espacos = obterEspacosSistema();
    const reservas = obterReservasSistema();
    const usuarios = obterUsuarios();

    const elNome = document.getElementById('dashboard-saudacao');
    if (elNome) elNome.textContent = `Olá, ${usuario.nome}`;

    const elData = document.getElementById('dashboard-data');
    if (elData) {
        const raw = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        elData.textContent = raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    const salas    = espacos.filter(e => e.tipo === 'Sala de Reunião');
    const estacoes = espacos.filter(e => e.tipo === 'Estação de Trabalho');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const reservasHoje = r =>
        r.status === 'Confirmada' &&
        r.data &&
        parsearData(r.data).setHours(0, 0, 0, 0) === hoje.getTime();

    const salasOcupadas = new Set(
        reservas.filter(r => reservasHoje(r) && r.tipo === 'Sala de Reunião').map(r => r.espaco)
    );
    const estOcupadas = new Set(
        reservas.filter(r => reservasHoje(r) && r.tipo === 'Estação de Trabalho').map(r => r.espaco)
    );

    const salasDisponiveis = salas.filter(e => e.status === 'Ativo' && !salasOcupadas.has(e.nome)).length;
    const estLivres        = estacoes.filter(e => e.status === 'Ativo' && !estOcupadas.has(e.nome)).length;

    const minhasReservas = reservas
        .filter(r => String(r.usuarioId) === String(usuario.id) && r.status === 'Confirmada')
        .sort((a, b) => {
            const da = parsearData(a.data), db = parsearData(b.data);
            if (da - db !== 0) return da - db;
            return (a.inicio || '').localeCompare(b.inicio || '');
        });

    const proxima = minhasReservas.length ? minhasReservas[0] : null;
    const totalMembros = usuarios.filter(u => u.senhaDefinida).length;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('indicador-salas-disp',  salasDisponiveis);
    setEl('indicador-salas-sub',   `de ${salas.length} cadastradas`);
    setEl('indicador-estacoes-disp', estLivres);
    setEl('indicador-estacoes-sub',  `de ${estacoes.length} cadastradas`);
    setEl('indicador-reservas-qtd', minhasReservas.length);
    setEl('indicador-reservas-sub', proxima
        ? `próxima em ${proxima.data} às ${proxima.inicio}`
        : 'nenhuma confirmada');
    setEl('indicador-membros', totalMembros);

    const wrap = document.getElementById('grade-reservas');
    if (!wrap) return;

    if (!minhasReservas.length) {
        wrap.innerHTML = '<p class="subtitle" style="padding:1rem 0">Você não tem reservas confirmadas.</p>';
        return;
    }

    wrap.innerHTML = minhasReservas.slice(0, 3).map(r => {
        const ehMesa  = r.tipo === 'Estação de Trabalho';
        const qtdConv = (!ehMesa && r.convidados && r.convidados !== '-')
            ? r.convidados.split(',').filter(Boolean).length : 0;
        const sub = ehMesa
            ? `${r.data} • ${r.horario} · estação individual`
            : qtdConv > 0
                ? `${r.data} • ${r.horario} · ${qtdConv} convidado(s)`
                : `${r.data} • ${r.horario}`;
        return `
            <div class="reservation-card">
                <div>
                    <img src="assets/images/${r.espaco}.png" alt="${r.espaco}" onerror="this.style.display='none'">
                    <div>
                        <h4>${r.espaco}</h4>
                        <span class="subtitle">${sub}</span>
                    </div>
                </div>
                <div class="confirmed-badge"><span>Confirmado</span></div>
            </div>`;
    }).join('');
});
