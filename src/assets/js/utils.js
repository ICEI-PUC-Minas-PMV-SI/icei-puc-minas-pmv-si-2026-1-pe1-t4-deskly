// ============================================================
// utils.js — Utilitários globais compartilhados
// Carregue este arquivo antes de qualquer script de página.
// ============================================================

// --- STORAGE: USUÁRIOS ---

function obterUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function salvarUsuarios(lista) {
    localStorage.setItem('usuarios', JSON.stringify(lista));
}

function obterUsuarioLogado() {
    return JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
}

// --- STORAGE: ESPAÇOS ---

function obterEspacosSistema() {
    return JSON.parse(localStorage.getItem('espacosSistema') || '[]');
}

function salvarEspacosSistema(espacos) {
    localStorage.setItem('espacosSistema', JSON.stringify(espacos));
}

// --- STORAGE: RESERVAS ---

function obterReservasSistema() {
    return JSON.parse(localStorage.getItem('reservasSistema') || '[]');
}

function salvarReservasSistema(reservas) {
    localStorage.setItem('reservasSistema', JSON.stringify(reservas));
}

// --- TOAST ---

function mostrarToast(titulo, mensagem, tipo = 'aviso') {
    const container = document.getElementById('container-avisos');
    if (!container) return;
    if (!container.hasAttribute('popover')) container.setAttribute('popover', 'manual');
    try {
        if (container.matches(':popover-open')) container.hidePopover();
        container.showPopover();
    } catch (_) {}
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    const strong = document.createElement('strong');
    strong.textContent = titulo;
    const span = document.createElement('span');
    span.textContent = mensagem;
    toast.append(strong, span);
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('saindo'), 3600);
    setTimeout(() => toast.remove(), 4000);
}

// --- FORMULÁRIO ---

function marcarCampoInvalido(campo) {
    if (!campo) return;
    campo.classList.add('campo-invalido');
    const limpar = () => {
        campo.classList.remove('campo-invalido');
        campo.removeEventListener('input', limpar);
        campo.removeEventListener('change', limpar);
    };
    campo.addEventListener('input', limpar);
    campo.addEventListener('change', limpar);
}

// --- DATA E HORA ---

function parsearData(str) {
    if (!str) return null;
    const [d, m, y] = str.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d));
}

function dataHoraNoPassado(dataStr, inicioStr) {
    if (!dataStr) return false;
    const [d, m, y] = dataStr.split('/').map(Number);
    if (!d || !m || !y) return false;
    const [h, min] = (inicioStr || '00:00').split(':').map(Number);
    return new Date(y, m - 1, d, h || 0, min || 0) < new Date();
}

function converterHorarioParaMinutos(horario) {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 60 + minutos;
}

function horariosConflitam(inicio1, fim1, inicio2, fim2) {
    return converterHorarioParaMinutos(inicio1) < converterHorarioParaMinutos(fim2) &&
           converterHorarioParaMinutos(fim1)   > converterHorarioParaMinutos(inicio2);
}

// --- AUTH ---

function garantirAdminDeskly() {
    const usuarios = obterUsuarios();
    const admin = usuarios.find(u => u.email === 'sistema.deskly@gmail.com');
    const foto = 'assets/images/Perfil-deskly.jpg';

    if (!admin) {
        usuarios.push({
            id: 1, nome: 'Deskly', email: 'sistema.deskly@gmail.com',
            senha: 'Deskly2026.', perfil: 'Admin', token: null,
            senhaDefinida: true, protegido: true,
            dataCriacao: new Date().toISOString(), foto,
            departamento: 'Sistema', telefone: '(99) 99999-9999'
        });
        salvarUsuarios(usuarios);
        return;
    }

    let mudou = false;
    if (!admin.protegido)    { admin.protegido = true;             mudou = true; }
    if (!admin.departamento) { admin.departamento = 'Sistema';     mudou = true; }
    if (!admin.telefone)     { admin.telefone = '(99) 99999-9999'; mudou = true; }
    if (!admin.foto || admin.foto.includes('foto_padrao')) { admin.foto = foto; mudou = true; }
    if (mudou) salvarUsuarios(usuarios);
}

// --- UI: TOGGLE SENHA ---

const _SVG_OLHO_ABERTO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const _SVG_OLHO_FECHADO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function adicionarToggleSenha(input) {
    if (!input) return;
    const wrapper = input.parentElement;
    if (!wrapper) return;
    wrapper.style.position = 'relative';
    input.style.paddingRight = '40px';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = _SVG_OLHO_ABERTO;
    btn.style.cssText = `position:absolute;right:10px;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9CA3AF;padding:0;display:flex;align-items:center;width:18px;height:18px;`;

    const atualizarPosicao = () => {
        const r  = input.getBoundingClientRect();
        const wr = wrapper.getBoundingClientRect();
        btn.style.top = `${r.top - wr.top + r.height / 2}px`;
    };

    btn.addEventListener('click', () => {
        const visivel = input.type === 'text';
        input.type = visivel ? 'password' : 'text';
        btn.innerHTML = visivel ? _SVG_OLHO_ABERTO : _SVG_OLHO_FECHADO;
        btn.style.color = visivel ? '#9CA3AF' : '#6B7280';
    });

    wrapper.appendChild(btn);
    requestAnimationFrame(atualizarPosicao);
}

// --- INDEXEDDB ---

const _DB = { nome: 'perfilDB', versao: 1, store: 'fotos' };

function abrirDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(_DB.nome, _DB.versao);
        req.onupgradeneeded = e => e.target.result.createObjectStore(_DB.store);
        req.onsuccess = e => resolve(e.target.result);
        req.onerror  = e => reject(e.target.error);
    });
}

function salvarFotoDB(chave, blob) {
    return abrirDB().then(db => new Promise((resolve, reject) => {
        const req = db.transaction(_DB.store, 'readwrite').objectStore(_DB.store).put(blob, chave);
        req.onsuccess = () => resolve();
        req.onerror  = e => reject(e.target.error);
    }));
}

function carregarFotoDB(chave) {
    return abrirDB().then(db => new Promise((resolve, reject) => {
        const req = db.transaction(_DB.store, 'readonly').objectStore(_DB.store).get(chave);
        req.onsuccess = e => resolve(e.target.result || null);
        req.onerror  = e => reject(e.target.error);
    }));
}

// --- IMAGEM ---

function comprimirImagem(file, callback) {
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            const MAX = 800;
            let w = img.width, h = img.height;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// --- CUSTOM SELECT ---
// Inicializa automaticamente todos os .custom-select do documento.

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.custom-select').forEach(select => {
        const trigger = select.querySelector('.custom-select-trigger');
        const label   = select.querySelector('.custom-select-label');
        const options = select.querySelectorAll('.custom-select-option');
        if (!trigger || !label) return;

        trigger.addEventListener('click', () => {
            const aberto = select.classList.contains('open');
            document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
            if (!aberto) select.classList.add('open');
        });

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                label.textContent = opt.textContent;
                select.dataset.valorSelecionado = opt.dataset.value;
                select.classList.remove('open');
            });
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
        }
    });
});
