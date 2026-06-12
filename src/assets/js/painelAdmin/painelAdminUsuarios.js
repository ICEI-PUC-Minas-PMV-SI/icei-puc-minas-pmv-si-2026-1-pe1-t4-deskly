const EMAILJS_SERVICE_ID  = 'service_u5f1c5k';
const EMAILJS_TEMPLATE_ID = 'template_gejyh7t';
const EMAILJS_PUBLIC_KEY  = '2kT0EfswhdPo4tzq7';

document.addEventListener('DOMContentLoaded', () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  carregarUsuarios();
  inicializarConvite();
  inicializarBuscaUsuario();
  inicializarFechamentoModais();
});

function carregarUsuarios(filtro = '') {
  const tbody = document.getElementById('tabelaUsuariosAdmin');
  if (!tbody) return;

  const usuarios    = obterUsuarios();
  const filtroLower = filtro.toLowerCase();

  const visiveis = usuarios.filter(u =>
    (u.nome  || '').toLowerCase().includes(filtroLower) ||
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

    const badgePerfil = usuario.perfil === 'admin'
      ? `<span style="background:#EFF6FF;color:#1D4ED8;border-radius:4px;padding:2px 8px;font-size:0.78rem;font-weight:600;">Admin</span>`
      : `<span style="background:#F0FDF4;color:#15803D;border-radius:4px;padding:2px 8px;font-size:0.78rem;font-weight:600;">Usuário</span>`;

    const btnReenviar = !usuario.senhaDefinida
      ? `<button class="btn-reenviar" data-email="${usuario.email}"
            style="background:none;border:1px solid #D1D5DB;border-radius:6px;padding:4px 10px;
                   cursor:pointer;font-size:0.78rem;color:#374151;margin-right:4px;">
            Reenviar
          </button>`
      : '';

    tr.innerHTML = `
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:50%;background:var(--color-primary,#2563EB);
                      color:#fff;display:flex;align-items:center;justify-content:center;
                      font-size:0.8rem;font-weight:700;flex-shrink:0;">
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
        <div style="display:flex;align-items:center;gap:4px;">
          ${btnReenviar}
          <button class="btn-remover-usuario"
            data-email="${usuario.email}" data-nome="${usuario.nome || usuario.email}"
            style="background:none;border:1px solid #FECACA;border-radius:6px;padding:4px 10px;
                   cursor:pointer;font-size:0.78rem;color:#DC2626;">
            Remover
          </button>
        </div>
      </td>`;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-remover-usuario').forEach(btn =>
    btn.addEventListener('click', () => abrirModalRemover(btn.dataset.email, btn.dataset.nome))
  );

  tbody.querySelectorAll('.btn-reenviar').forEach(btn =>
    btn.addEventListener('click', () => enviarConvitePorEmail(btn.dataset.email, true))
  );
}

function inicializarBuscaUsuario() {
  const inputBusca = document.querySelector('.input-busca');
  const btnBusca   = document.querySelector('.usuarios-busca .btn-action');

  inputBusca?.addEventListener('keydown', e => {
    if (e.key === 'Enter') carregarUsuarios(inputBusca.value.trim());
  });
  btnBusca?.addEventListener('click', () => carregarUsuarios(inputBusca?.value.trim() || ''));
}

function inicializarConvite() {
  const btnConfirmar = document.getElementById('btn-confirmar-convidar');
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener('click', async () => {
    const modal       = document.getElementById('modal-convidar-usuario');
    const emailInput  = document.getElementById('convidar-email')  || modal.querySelectorAll('input')[0];
    const perfilInput = document.getElementById('convidar-perfil') || modal.querySelectorAll('select')[0] || modal.querySelectorAll('input')[1];

    const email  = emailInput?.value.trim().toLowerCase();
    const perfil = perfilInput?.value.trim().toLowerCase();

    let valido = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { marcarErro(emailInput, true);  valido = false; } else { marcarErro(emailInput, false); }
    if (!['admin', 'usuario'].includes(perfil))                { marcarErro(perfilInput, true); valido = false; } else { marcarErro(perfilInput, false); }
    if (!valido) { exibirToast('Preencha todos os campos corretamente.', 'erro'); return; }

    const usuarios = obterUsuarios();
    if (usuarios.find(u => u.email === email)) {
      exibirToast('Este e-mail já está cadastrado no sistema.', 'erro');
      return;
    }

    const token = gerarToken();
    usuarios.push({ email, perfil, token, senhaDefinida: false, dataCriacao: new Date().toISOString() });
    salvarUsuarios(usuarios);
    document.getElementById('modal-convidar-usuario')?.close();
    if (emailInput)  emailInput.value  = '';
    if (perfilInput) perfilInput.value = '';
    carregarUsuarios();
    await enviarConvitePorEmail(email, false);
  });
}

async function enviarConvitePorEmail(email, reenvio = false) {
  const usuarios = obterUsuarios();
  const usuario  = usuarios.find(u => u.email === email);
  if (!usuario) return;

  if (reenvio) {
    usuario.token = gerarToken();
    salvarUsuarios(usuarios);
  }

  const link = `${window.location.origin}/src/primeiro-acesso.html?token=${usuario.token}`;

  const perfilLabel = usuario.perfil === 'admin'
    ? 'Administrador — acesso total ao sistema'
    : 'Usuário — pode fazer e gerenciar suas reservas';

  const templateParams = {
    para_email:   email,
    link_acesso:  link,
    perfil_label: perfilLabel,
  };

  try {
    exibirToast('Enviando convite por e-mail...', 'info');

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    exibirToast(
      reenvio
        ? `Convite reenviado para ${email}!`
        : `Convite enviado para ${email}!`,
      'sucesso'
    );

    console.log(`%c📧 Email enviado com sucesso para ${email}`, 'color:#22C55E;font-weight:bold');

  } catch (erro) {
    console.error('Erro ao enviar email via EmailJS:', erro);
    exibirToast(`Erro ao enviar o e-mail. Verifique o console para detalhes.`, 'erro');
  }
}

function abrirModalRemover(email, nome) {
  const modal  = document.getElementById('modal-remover-usuario');
  const nomeEl = modal?.querySelector('.modal-remover-nome');
  if (nomeEl) nomeEl.textContent = nome;
  modal?.showModal();

  const btnAntigo = document.getElementById('btn-confirmar-remover');
  const btnNovo   = btnAntigo.cloneNode(true);
  btnAntigo.parentNode.replaceChild(btnNovo, btnAntigo);

  btnNovo.addEventListener('click', () => {
    let usuarios = obterUsuarios();
    usuarios = usuarios.filter(u => u.email !== email);
    salvarUsuarios(usuarios);
    modal.close();
    carregarUsuarios();
    exibirToast('Usuário removido com sucesso.', 'sucesso');
  });
}

function inicializarFechamentoModais() {
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.modal)?.close();
    });
  });
}

function obterUsuarios()       { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
function salvarUsuarios(lista) { localStorage.setItem('usuarios', JSON.stringify(lista)); }
function gerarToken()          { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function iniciais(texto) {
  if (!texto) return '?';
  const p = texto.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : texto.slice(0, 2).toUpperCase();
}

function marcarErro(el, estado) {
  if (!el) return;
  el.style.borderColor = estado ? '#EF4444' : '';
}

function exibirToast(mensagem, tipo = 'sucesso') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `<span>${mensagem}</span>
    <button onclick="this.parentElement.remove()"
      style="background:none;border:none;cursor:pointer;color:#6B7280;margin-left:8px;">✕</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}