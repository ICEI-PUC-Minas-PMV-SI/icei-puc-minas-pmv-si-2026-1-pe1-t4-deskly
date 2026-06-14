// assets/js/pages/dashboard/dashboard.js
// Coloque no dashboard.html: <script src="assets/js/pages/dashboard/dashboard.js"></script>

document.addEventListener('DOMContentLoaded', () => {

    // ── Helpers ───────────────────────────────────────────────────────────────
    function parsearData(str) {
        const [d, m, y] = str.split('/');
        return new Date(Number(y), Number(m) - 1, Number(d));
    }

    function ehHoje(r) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const data = parsearData(r.data);
        data.setHours(0, 0, 0, 0);
        return data.getTime() === hoje.getTime() && r.status === 'Confirmada';
    }

    function proximaHoje(reservasHoje) {
        // Retorna a mais cedo (por inicio)
        if (!reservasHoje.length) return null;
        return reservasHoje.slice().sort((a, b) => a.inicio.localeCompare(b.inicio))[0];
    }

    function dataExtenso() {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Capitaliza primeira letra
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ── Dados do localStorage ─────────────────────────────────────────────────
    const usuario      = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    const espacos      = JSON.parse(localStorage.getItem('espacosSistema') || '[]');
    const reservas     = JSON.parse(localStorage.getItem('reservasSistema') || '[]');

    if (!usuario) {
        // Se não há usuário logado, redireciona para login
        window.location.href = 'index.html';
        return;
    }

    // ── 1. Saudação e data ────────────────────────────────────────────────────
    const elNome = document.querySelector('.dashboard-title h1');
    if (elNome) elNome.textContent = `Olá, ${usuario.nome}`;

    const elData = document.querySelector('.dashboard-title .subtitle');
    if (elData) elData.textContent = capitalize(dataExtenso());

    // ── 2. Stats ──────────────────────────────────────────────────────────────
    const salas    = espacos.filter(e => e.tipo === 'Sala de Reunião');
    const estacoes = espacos.filter(e => e.tipo === 'Estação de Trabalho');

    // Espaços ocupados HOJE (reservas confirmadas de qualquer usuário)
    const hojeStr = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('/'); // yyyy não, mantém dd/mm/yyyy
    // Reusa parsearData para comparar
    const hoje = new Date(); hoje.setHours(0,0,0,0);

    const salasOcupadasHoje = new Set(
        reservas
            .filter(r => r.status === 'Confirmada' && r.tipo === 'Sala de Reunião' && parsearData(r.data).getTime() === hoje.getTime())
            .map(r => r.espaco)
    );
    const estOcupadasHoje = new Set(
        reservas
            .filter(r => r.status === 'Confirmada' && r.tipo === 'Estação de Trabalho' && parsearData(r.data).getTime() === hoje.getTime())
            .map(r => r.espaco)
    );

    const salasDisponiveis  = salas.filter(e => e.status === 'Ativo' && !salasOcupadasHoje.has(e.nome)).length;
    const estLivres         = estacoes.filter(e => e.status === 'Ativo' && !estOcupadasHoje.has(e.nome)).length;

    // Reservas do usuário logado hoje
    const minhasReservasHoje = reservas.filter(r => r.usuarioId === usuario.id && ehHoje(r));
    const proximaReserva     = proximaHoje(minhasReservasHoje);

    // Total de membros (usuários com senhaDefinida)
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const totalMembros = usuarios.filter(u => u.senhaDefinida).length;

    // Preenche os cards de stats
    const statsCards = document.querySelectorAll('.stats-card');
    const statsData = [
        {
            titulo: 'SALAS DISPONÍVEIS',
            valor: salasDisponiveis,
            sub: `de ${salas.length} cadastradas`
        },
        {
            titulo: 'ESTAÇÕES LIVRES',
            valor: estLivres,
            sub: `de ${estacoes.length} cadastradas`
        },
        {
            titulo: 'SUAS RESERVAS',
            valor: minhasReservasHoje.length,
            sub: proximaReserva ? `próxima às ${proximaReserva.inicio}` : 'nenhuma hoje'
        },
        {
            titulo: 'MEMBROS NA EMPRESA',
            valor: totalMembros,
            sub: 'colaboradores'
        },
    ];

    statsCards.forEach((card, i) => {
        if (!statsData[i]) return;
        const titleEl = card.querySelector('.stats-title');
        const h2      = card.querySelector('h2');
        const subEl   = card.querySelector('.subtitle');
        if (titleEl) titleEl.textContent = statsData[i].titulo;
        if (h2)      h2.textContent      = statsData[i].valor;
        if (subEl)   subEl.textContent   = statsData[i].sub;
    });

    // ── 3. Reservas de hoje ───────────────────────────────────────────────────
    const wrap = document.querySelector('.reservation-card-wrap');
    if (wrap) {
        if (!minhasReservasHoje.length) {
            wrap.innerHTML = '<p class="subtitle" style="padding:1rem 0">Você não tem reservas para hoje.</p>';
        } else {
            wrap.innerHTML = minhasReservasHoje
                .sort((a, b) => a.inicio.localeCompare(b.inicio))
                .map(r => {
                    const ehMesa = r.tipo === 'Estação de Trabalho';
                    const convidadosInfo = (!ehMesa && r.convidados && r.convidados !== '-')
                        ? `· ${r.convidados.split(',').length} convidado(s)`
                        : ehMesa ? '· estação individual' : '';
                    return `
                    <div class="reservation-card">
                        <div>
                            <img src="assets/images/${r.espaco}.png" alt="Imagem do espaço"
                                 onerror="this.style.display='none'">
                            <div>
                                <h4>${r.espaco}</h4>
                                <span class="subtitle">${r.horario} ${convidadosInfo}</span>
                            </div>
                        </div>
                        <div class="confirmed-badge">
                            <span>Confirmado</span>
                        </div>
                    </div>`;
                }).join('');
        }
    }
});
