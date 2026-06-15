const EMAILJS_SERVICE_ID = 'service_u5f1c5k';
const EMAILJS_TEMPLATE_ID = 'template_gejyh7t';
const EMAILJS_PUBLIC_KEY = '2kT0EfswhdPo4tzq7';
const DB_NOME = "perfilDB";
const DB_VERSAO = 1;
const STORE_NOME = "fotos";

function abrirDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NOME, DB_VERSAO);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NOME);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

function carregarFotoDB(chave) {
  return abrirDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOME, "readonly");
    const req = tx.objectStore(STORE_NOME).get(chave);
    req.onsuccess = (e) => resolve(e.target.result || null);
    req.onerror = (e) => reject(e.target.error);
  }));
}

function garantirAdminDeskly() {
    const usuarios = obterUsuarios();
    const admin = usuarios.find(u => u.email === 'sistema.deskly@gmail.com');

    const caminhoFotoCorreto = 'assets/images/Perfil-deskly.jpg'; 

    if (!admin) {
        usuarios.push({
            id: 1,
            nome: 'Deskly',
            email: 'sistema.deskly@gmail.com',
            senha: 'Deskly2026.',
            perfil: 'Admin',
            token: null,
            senhaDefinida: true,
            protegido: true,
            dataCriacao: new Date().toISOString(),
            foto: caminhoFotoCorreto,
            departamento: 'Sistema',
            telefone: '(99) 99999-9999'
        });
        salvarUsuarios(usuarios);
        return;
    }

    let mudou = false;

    if (!admin.protegido) {
        admin.protegido = true;
        mudou = true;
    }
    if (admin.departamento === undefined || admin.departamento === '') {
        admin.departamento = 'Sistema';
        mudou = true;
    }
    if (admin.telefone === undefined || admin.telefone === '') {
        admin.telefone = '(99) 99999-9999';
        mudou = true;
    }
    if (!admin.foto || admin.foto.includes('foto_padrao')) {
        admin.foto = caminhoFotoCorreto;
        mudou = true;
    }

    if (mudou) {
        salvarUsuarios(usuarios);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (_) { }

  garantirAdminDeskly();
  carregarUsuarios();
  inicializarConvite();
  inicializarBuscaUsuario();
  configurarModalDetalhes();
});

function carregarUsuarios(filtro = '') {
  const tbody = document.getElementById('tabelaUsuariosAdmin');
  if (!tbody) return;

  const usuarios = obterUsuarios();
  const filtroLower = filtro.toLowerCase().trim();

  const visiveis = filtroLower === ''
    ? usuarios
    : usuarios.filter(u =>
      (u.nome || '').toLowerCase().includes(filtroLower) ||
      (u.email || '').toLowerCase().includes(filtroLower)
    );

  tbody.innerHTML = '';

  if (visiveis.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:#6B7280;padding:32px;">
          Nenhum usuário encontrado.
        </td>
      </tr>`;
    return;
  }

  visiveis.forEach(usuario => {
    const tr = document.createElement('tr');

    const badgePendente = !usuario.senhaDefinida
      ? `<span style="display:inline-block;margin-left:6px;font-size:0.7rem;
            background:#FEF3C7;color:#92400E;border-radius:4px;
            padding:1px 6px;font-weight:600;vertical-align:middle;">Pendente</span>`
      : '';

    const badgePerfil = usuario.perfil === 'Admin'
      ? `<span class="badge badge-admin">Admin</span>`
      : `<span class="badge badge-usuario">Usuário</span>`;

    const btnReenviar = !usuario.senhaDefinida
      ? `<button class="btn-reenviar" data-email="${usuario.email}">Reenviar</button>`
      : '';

    const btnRemover = usuario.protegido ? '' : `
      <button class="btn-remover-usuario"
        data-email="${usuario.email}" data-nome="${usuario.nome || usuario.email}">
        Remover
      </button>`;

    const avatarId = `avatar-${usuario.id || usuario.email.replace(/[^a-z0-9]/gi, '')}`;

    tr.innerHTML = `
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div id="${avatarId}" style="width:34px;height:34px;border-radius:50%;background:var(--color-primary,#2563EB);
                      color:#fff;display:flex;align-items:center;justify-content:center;
                      font-size:0.8rem;font-weight:700;flex-shrink:0;overflow:hidden;">
            ${iniciais(usuario.nome || usuario.email)}
          </div>
          <div>
            <span style="font-weight:500;">${usuario.nome || '—'}</span>
            ${badgePendente}
          </div>
        </div>
      </td>
      <td>${usuario.email}</td>
      <td>${badgePerfil}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="btn-ver-detalhes btn-detalhes-usuario" title="Ver Detalhes"
            data-id="${usuario.id ?? ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          ${btnReenviar}
          ${btnRemover}
        </div>
      </td>`;

    tbody.appendChild(tr);

    const chave = `foto_${usuario.id ?? usuario.email ?? "anonimo"}`;
    carregarFotoDB(chave)
      .then(blob => {
        const avatarEl = document.getElementById(avatarId);
        if (!avatarEl) return;
        if (blob) {
          const url = URL.createObjectURL(blob);
          avatarEl.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;">`;
        } else if (usuario.foto) {
          avatarEl.innerHTML = `<img src="${usuario.foto}" style="width:100%;height:100%;object-fit:cover;">`;
        }
      })
      .catch(() => {
        if (usuario.foto) {
          const avatarEl = document.getElementById(avatarId);
          if (avatarEl) avatarEl.innerHTML = `<img src="${usuario.foto}" style="width:100%;height:100%;object-fit:cover;">`;
        }
      });
  });

  tbody.querySelectorAll('.btn-ver-detalhes').forEach(btn =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalDetalhes(btn);
    })
  );

  tbody.querySelectorAll('.btn-remover-usuario').forEach(btn =>
    btn.addEventListener('click', () => abrirModalRemover(btn.dataset.email, btn.dataset.nome))
  );

  tbody.querySelectorAll('.btn-reenviar').forEach(btn =>
    btn.addEventListener('click', () => enviarConvitePorEmail(btn.dataset.email, true))
  );
}

function inicializarBuscaUsuario() {
  const inputBusca = document.querySelector('.input-busca');
  const btnBusca = document.getElementById('btn-buscar-usuario');

  inputBusca?.addEventListener('keydown', e => {
    if (e.key === 'Enter') carregarUsuarios(inputBusca.value.trim());
  });

  inputBusca?.addEventListener('input', () => {
    if (inputBusca.value.trim() === '') carregarUsuarios('');
  });

  btnBusca?.addEventListener('click', () => {
    carregarUsuarios(inputBusca?.value.trim() || '');
  });
}

function inicializarConvite() {
  const btnConfirmar = document.getElementById('btn-confirmar-convidar');
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener('click', async () => {
    const modal = document.getElementById('modal-convidar-usuario');
    const emailInput = document.getElementById('convidar-email') || modal.querySelectorAll('input')[0];
    const perfilInput = document.getElementById('convidar-perfil') || modal.querySelectorAll('select')[0] || modal.querySelectorAll('input')[1];

    const email = emailInput?.value.trim().toLowerCase();
    const perfil = perfilInput?.value.trim();

    let valido = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { marcarErro(emailInput, true); valido = false; } else { marcarErro(emailInput, false); }
    if (!['Admin', 'Usuário'].includes(perfil)) { marcarErro(perfilInput, true); valido = false; } else { marcarErro(perfilInput, false); }
    if (!valido) { exibirToast('Campos inválidos', 'Preencha todos os campos corretamente.', 'erro'); return; }

    const usuarios = obterUsuarios();
    if (usuarios.find(u => u.email === email)) {
      exibirToast('E-mail já cadastrado', 'Este e-mail já está cadastrado no sistema.', 'erro');
      return;
    }

    const token = gerarToken();
    usuarios.push({ id: Date.now(), nome: '', email, senha: '', perfil, token, senhaDefinida: false, dataCriacao: new Date().toISOString(), foto: '' });
    salvarUsuarios(usuarios);
    document.getElementById('modal-convidar-usuario')?.close();
    if (emailInput) emailInput.value = '';
    if (perfilInput) perfilInput.value = '';
    carregarUsuarios();
    await enviarConvitePorEmail(email, false);
  });
}

async function enviarConvitePorEmail(email, reenvio = false) {
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return;

  if (reenvio) {
    usuario.token = gerarToken();
    salvarUsuarios(usuarios);
  }

  const pastaAtual = window.location.pathname.substring(
  0,
  window.location.pathname.lastIndexOf('/') + 1
);

const link = `${window.location.origin}${pastaAtual}primeiro-acesso.html?token=${usuario.token}`;

  const perfilLabel = usuario.perfil === 'Admin'
    ? 'Administrador — acesso total ao sistema'
    : 'Usuário — pode fazer e gerenciar suas reservas';

  const templateParams = {
    para_email: email,
    link_acesso: link,
    perfil_label: perfilLabel,
  };

  try {
    exibirToast('Enviando convite', 'Aguarde enquanto o e-mail é enviado...', 'info');
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    exibirToast(reenvio ? 'Convite reenviado' : 'Convite enviado', `E-mail ${reenvio ? 'reenviado' : 'enviado'} para ${email}.`, 'sucesso');
    console.log(`%c📧 Email enviado com sucesso para ${email}`, 'color:#22C55E;font-weight:bold');
  } catch (erro) {
    console.error('Erro ao enviar email via EmailJS:', erro);
    exibirToast('Erro ao enviar', 'Verifique o console para detalhes.', 'erro');
  }
}

function abrirModalDetalhes(btn) {
  const modal = document.getElementById("modal-detalhes-usuario");
  if (!modal) {
    console.error("Modal 'modal-detalhes-usuario' não foi encontrado no HTML.");
    return;
  }

  const id = btn.getAttribute("data-id") || '';
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => String(u.id) === String(id));
  if (!usuario) return;

  const inputNome = document.getElementById("detalhe-usuario-nome");
  const inputEmail = document.getElementById("detalhe-usuario-email");
  const inputDepto = document.getElementById("detalhe-usuario-departamento");
  const inputTel = document.getElementById("detalhe-usuario-telefone");

  if (inputNome) inputNome.value = usuario.nome || '—';
  if (inputEmail) inputEmail.value = usuario.email || '—';
  if (inputDepto) inputDepto.value = usuario.departamento || 'Não informado';
  if (inputTel) inputTel.value = usuario.telefone || 'Não informado';

  const badgeModal = document.getElementById("detalhe-usuario-perfil");
  if (badgeModal) {
    badgeModal.textContent = usuario.perfil || 'Usuário';
    badgeModal.className = "badge " + (usuario.perfil === "Admin" ? "disponivel" : "ocupado");
  }

  const avatarPlaceholder = document.getElementById("detalhe-usuario-avatar");

  function renderizarAvatar(src) {
    if (!avatarPlaceholder) return;
    if (src) {
      avatarPlaceholder.innerHTML = `<img src="${src}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
      avatarPlaceholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"
          style="color:#6B7280;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>`;
    }
  }

  const chave = `foto_${id || usuario.email || "anonimo"}`;

  carregarFotoDB(chave)
    .then(blob => {
      if (blob) {
        renderizarAvatar(URL.createObjectURL(blob));
      } else {
        renderizarAvatar(usuario.foto || '');
      }
    })
    .catch(() => renderizarAvatar(usuario.foto || ''));

  modal.showModal();
}

function configurarModalDetalhes() {
  document.addEventListener("click", (e) => {
    if (e.target.matches('[data-modal="modal-detalhes-usuario"]') || e.target.closest('[data-modal="modal-detalhes-usuario"]')) {
      const modal = document.getElementById("modal-detalhes-usuario");
      if (modal) modal.close();
    }
  });
}

function abrirModalRemover(email, nome) {
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (usuario?.protegido) {
    exibirToast('Ação não permitida', 'O administrador principal não pode ser removido.', 'erro');
    return;
  }

  const modal = document.getElementById('modal-remover-usuario');
  const nomeEl = modal?.querySelector('.modal-remover-nome');
  if (nomeEl) nomeEl.textContent = nome;
  modal?.showModal();

  const btnAntigo = document.getElementById('btn-confirmar-remover');
  const btnNovo = btnAntigo.cloneNode(true);
  btnAntigo.parentNode.replaceChild(btnNovo, btnAntigo);

  btnNovo.addEventListener('click', () => {
    let usuarios = obterUsuarios();
    usuarios = usuarios.filter(u => u.email !== email);
    salvarUsuarios(usuarios);
    modal.close();
    carregarUsuarios();
    exibirToast('Usuário removido', 'A operação foi concluída com sucesso.', 'sucesso');
  });
}

function obterUsuarios() { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
function salvarUsuarios(lista) { localStorage.setItem('usuarios', JSON.stringify(lista)); }
function gerarToken() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function iniciais(texto) {
  if (!texto) return '?';
  const p = texto.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : texto.slice(0, 2).toUpperCase();
}

function marcarErro(el, estado) {
  if (!el) return;
  el.style.borderColor = estado ? '#EF4444' : '';
  const span = el.id ? document.getElementById(`erro-${el.id}`) : null;
  if (span) span.style.display = estado ? 'block' : 'none';
}

function exibirToast(titulo, mensagem, tipo = 'sucesso') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}