document.addEventListener('DOMContentLoaded', () => {

    function parsearData(str) {
        if (!str) return null;
        const [d, m, y] = str.split('/');
        return new Date(Number(y), Number(m) - 1, Number(d));
    }

    function ehHoje(r) {
        if (!r.data || r.status !== 'Confirmada') return false;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const data = parsearData(r.data);
        data.setHours(0, 0, 0, 0);

        return data.getTime() === hoje.getTime();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    const espacos = JSON.parse(localStorage.getItem('espacosSistema') || '[]');
    const reservas = JSON.parse(localStorage.getItem('reservasSistema') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    const elNome = document.getElementById('dashboard-saudacao');
    if (elNome) elNome.textContent = `Olá, ${usuario.nome}`;

    const elData = document.getElementById('dashboard-data');
    if (elData) {
        elData.textContent = capitalize(
            new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        );
    }

    const salas = espacos.filter(e => e.tipo === 'Sala de Reunião');
    const estacoes = espacos.filter(e => e.tipo === 'Estação de Trabalho');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const salasOcupadas = new Set(
        reservas
            .filter(r =>
                r.status === 'Confirmada' &&
                r.tipo === 'Sala de Reunião' &&
                r.data &&
                parsearData(r.data).setHours(0, 0, 0, 0) === hoje.getTime()
            )
            .map(r => r.espaco)
    );

    const estOcupadas = new Set(
        reservas
            .filter(r =>
                r.status === 'Confirmada' &&
                r.tipo === 'Estação de Trabalho' &&
                r.data &&
                parsearData(r.data).setHours(0, 0, 0, 0) === hoje.getTime()
            )
            .map(r => r.espaco)
    );

    const salasDisponiveis = salas.filter(
        e => e.status === 'Ativo' && !salasOcupadas.has(e.nome)
    ).length;

    const estLivres = estacoes.filter(
        e => e.status === 'Ativo' && !estOcupadas.has(e.nome)
    ).length;

    const minhasHoje = reservas
        .filter(r =>
            String(r.usuarioId) === String(usuario.id) &&
            r.status === 'Confirmada'
        )
        .sort((a, b) => {
            const da = parsearData(a.data);
            const db = parsearData(b.data);

            if (da - db !== 0) return da - db;

            return (a.inicio || '').localeCompare(b.inicio || '');
        });

    const proxima = minhasHoje.length ? minhasHoje[0] : null;

    const totalMembros = usuarios.filter(u => u.senhaDefinida).length;

    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setEl('stat-salas-disp', salasDisponiveis);
    setEl('stat-salas-sub', `de ${salas.length} cadastradas`);

    setEl('stat-estacoes-disp', estLivres);
    setEl('stat-estacoes-sub', `de ${estacoes.length} cadastradas`);

    setEl('stat-reservas-qtd', minhasHoje.length);

    setEl(
        'stat-reservas-sub',
        proxima
            ? `próxima em ${proxima.data} às ${proxima.inicio}`
            : 'nenhuma confirmada'
    );

    setEl('stat-membros', totalMembros);

    const wrap = document.getElementById('reservation-card-wrap');

    if (!wrap) return;

    if (!minhasHoje.length) {
        wrap.innerHTML =
            '<p class="subtitle" style="padding:1rem 0">Você não tem reservas confirmadas.</p>';
        return;
    }

    wrap.innerHTML = minhasHoje
        .slice(0, 3) // Limita para 3 reservas
        .map(r => {

            const ehMesa = r.tipo === 'Estação de Trabalho';

            const qtdConv =
                (!ehMesa && r.convidados && r.convidados !== '-')
                    ? r.convidados.split(',').filter(Boolean).length
                    : 0;

            const sub = ehMesa
                ? `${r.data} • ${r.horario} · estação individual`
                : qtdConv > 0
                    ? `${r.data} • ${r.horario} · ${qtdConv} convidado(s)`
                    : `${r.data} • ${r.horario}`;

            return `
                <div class="reservation-card">
                    <div>
                        <img
                            src="assets/images/${r.espaco}.png"
                            alt="${r.espaco}"
                            onerror="this.style.display='none'"
                        >
                        <div>
                            <h4>${r.espaco}</h4>
                            <span class="subtitle">${sub}</span>
                        </div>
                    </div>

                    <div class="confirmed-badge">
                        <span>Confirmado</span>
                    </div>
                </div>
            `;
        })
        .join('');
});