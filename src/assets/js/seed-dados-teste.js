(function () {

    // Gera token igual ao sistema real
    function gerarToken() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    function dataStr(diasOffset) {
        const d = new Date();
        d.setDate(d.getDate() + diasOffset);
        return [
            String(d.getDate()).padStart(2, '0'),
            String(d.getMonth() + 1).padStart(2, '0'),
            d.getFullYear()
        ].join('/');
    }

    // ── Usuários no formato exato do sistema ──────────────────
    const usuarios = [
        {
            id: Date.now(),
            nome: 'Kauã Gomes',
            email: 'kaua@empresa.com',
            senha: '123456',
            perfil: 'Admin',
            token: gerarToken(),
            senhaDefinida: true,
            dataCriacao: new Date().toISOString(),
            foto: '',
            departamento: 'TI',
            telefone: '(35) 99999-0001',
            protegido: false
        },
        {
            id: Date.now() + 1,
            nome: 'Ana Lima',
            email: 'ana@empresa.com',
            senha: '123456',
            perfil: 'Usuário',
            token: gerarToken(),
            senhaDefinida: true,
            dataCriacao: new Date().toISOString(),
            foto: '',
            departamento: 'RH',
            telefone: '(35) 99999-0002',
            protegido: false
        },
        {
            id: Date.now() + 2,
            nome: 'Bruno Silva',
            email: 'bruno@empresa.com',
            senha: '123456',
            perfil: 'Usuário',
            token: gerarToken(),
            senhaDefinida: true,
            dataCriacao: new Date().toISOString(),
            foto: '',
            departamento: 'Financeiro',
            telefone: '(35) 99999-0003',
            protegido: false
        },
        {
            id: Date.now() + 3,
            nome: 'Carla Souza',
            email: 'carla@empresa.com',
            senha: '123456',
            perfil: 'Usuário',
            token: gerarToken(),
            senhaDefinida: true,
            dataCriacao: new Date().toISOString(),
            foto: '',
            departamento: 'Comercial',
            telefone: '(35) 99999-0004',
            protegido: false
        },
    ];

    // Usuário logado é o primeiro (Kauã)
    const usuarioLogado = usuarios[0];

    // ── Espaços ───────────────────────────────────────────────
    const espacosSistema = [
        { nome: 'Sala Alfa',  tipo: 'Sala de Reunião',     capacidade: 4,  status: 'Ativo' },
        { nome: 'Sala Beta',  tipo: 'Sala de Reunião',     capacidade: 8,  status: 'Ativo' },
        { nome: 'Sala Delta', tipo: 'Sala de Reunião',     capacidade: 12, status: 'Ativo' },
        { nome: 'Mesa 04',    tipo: 'Estação de Trabalho', capacidade: 1,  status: 'Ativo' },
        { nome: 'Mesa 07',    tipo: 'Estação de Trabalho', capacidade: 1,  status: 'Ativo' },
    ];

    // ── Reservas ──────────────────────────────────────────────
    const reservasSistema = [
        {
            id: 101,
            usuarioId: usuarioLogado.id,
            espaco: 'Sala Alfa',
            tipo: 'Sala de Reunião',
            data: dataStr(0),
            inicio: '10:00',
            fim: '11:30',
            horario: '10:00 – 11:30',
            convidados: 'ana@empresa.com, bruno@empresa.com',
            convidadosStatus: { 'ana@empresa.com': 'aceito', 'bruno@empresa.com': 'pendente' },
            status: 'Confirmada'
        },
        {
            id: 102,
            usuarioId: usuarioLogado.id,
            espaco: 'Mesa 04',
            tipo: 'Estação de Trabalho',
            data: dataStr(0),
            inicio: '14:00',
            fim: '18:00',
            horario: '14:00 – 18:00',
            convidados: '-',
            convidadosStatus: {},
            status: 'Confirmada'
        },
        {
            id: 103,
            usuarioId: usuarioLogado.id,
            espaco: 'Sala Delta',
            tipo: 'Sala de Reunião',
            data: dataStr(2),
            inicio: '09:00',
            fim: '10:30',
            horario: '09:00 – 10:30',
            convidados: 'carla@empresa.com, bruno@empresa.com',
            convidadosStatus: { 'carla@empresa.com': 'aceito', 'bruno@empresa.com': 'recusado' },
            status: 'Confirmada'
        },
        {
            id: 201,
            usuarioId: usuarioLogado.id,
            espaco: 'Sala Beta',
            tipo: 'Sala de Reunião',
            data: dataStr(-7),
            inicio: '13:00',
            fim: '14:00',
            horario: '13:00 – 14:00',
            convidados: 'ana@empresa.com',
            convidadosStatus: { 'ana@empresa.com': 'aceito' },
            status: 'Concluída'
        },
        {
            id: 202,
            usuarioId: usuarioLogado.id,
            espaco: 'Mesa 07',
            tipo: 'Estação de Trabalho',
            data: dataStr(-3),
            inicio: '08:00',
            fim: '12:00',
            horario: '08:00 – 12:00',
            convidados: '-',
            convidadosStatus: {},
            status: 'Cancelada'
        },
    ];

    localStorage.setItem('usuarioLogado',   JSON.stringify(usuarioLogado));
    localStorage.setItem('usuarios',        JSON.stringify(usuarios));
    localStorage.setItem('espacosSistema',  JSON.stringify(espacosSistema));
    localStorage.setItem('reservasSistema', JSON.stringify(reservasSistema));

    console.log('[seed] localStorage populado!', usuarioLogado);

})();
