const btnNovaReserva = document.querySelector(".botao-add-sala");
const btnConfirmar = document.getElementById("btn-confirmar-reserva");
const btnFiltrar = document.querySelector(".btn-filtrar-simples");
const btnReservarDosDetalhes = document.getElementById("btn-reservar-dos-detalhes");

const modalReserva = document.getElementById("modal-reserva");
const modalDetalhes = document.getElementById("modal-detalhes");

const selectEspaco = document.getElementById("espaco");
const inputDataModal = document.querySelector(".modal-date-input");
const inputFiltroData = document.querySelector(".date-input");
const inputFiltroInicio = document.querySelector(".filtro-inicio");
const inputFiltroFim = document.querySelector(".filtro-fim");
const inputInicio = document.getElementById("start-time");
const inputFim = document.getElementById("ending-time");

let convidadosReserva = [];
let capacidadeReserva = Infinity;

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <strong>${titulo}</strong>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function buscarEspacosSistema() {
    return JSON.parse(localStorage.getItem("espacosSistema")) || [];
}

function salvarEspacosSistema(espacos) {
    localStorage.setItem("espacosSistema", JSON.stringify(espacos));
}

function criarEspacosPadraoSalas() {
    if (localStorage.getItem("espacosSistema")) return;

    const espacosPadrao = [
        { id: 1, tipo: "Sala de Reunião", nome: "Sala Alfa", capacidade: 8, recursos: "TV, Videoconferência, Lousa", area: "-", status: "Ativo", imagem: "" },
        { id: 2, tipo: "Sala de Reunião", nome: "Sala Beta", capacidade: 4, recursos: "TV, Videoconferência", area: "-", status: "Ativo", imagem: "" },
        { id: 3, tipo: "Sala de Reunião", nome: "Sala Gama", capacidade: 12, recursos: "TV, Videoconferência, Lousa, Ar-condicionado", area: "-", status: "Ativo", imagem: "" },
        { id: 4, tipo: "Sala de Reunião", nome: "Sala Delta", capacidade: 6, recursos: "Lousa", area: "-", status: "Inativo", imagem: "" },

        { id: 5, tipo: "Estação de Trabalho", nome: "Mesa 01", capacidade: "-", recursos: "-", area: "Andar 1 - Ala A", status: "Ativo", imagem: "" },
        { id: 6, tipo: "Estação de Trabalho", nome: "Mesa 02", capacidade: "-", recursos: "-", area: "Andar 2 - Ala B", status: "Ativo", imagem: "" },
        { id: 7, tipo: "Estação de Trabalho", nome: "Mesa 03", capacidade: "-", recursos: "-", area: "Andar 3 - Ala C", status: "Inativo", imagem: "" },
        { id: 8, tipo: "Estação de Trabalho", nome: "Mesa 04", capacidade: "-", recursos: "-", area: "Andar 4 - Ala D", status: "Ativo", imagem: "" }
    ];

    salvarEspacosSistema(espacosPadrao);
}

function imagemPadraoSala(nomeSala) {
    const imagens = {
        "Sala Alfa": "assets/images/Sala1.png",
        "Sala Beta": "assets/images/Sala2.png",
        "Sala Gama": "assets/images/Sala3.png",
        "Sala Delta": "assets/images/Sala4.png"
    };

    return imagens[nomeSala] || "assets/images/Sala1.png";
}

function buscarReservas() {
    return JSON.parse(localStorage.getItem("reservasSalas")) || [];
}

function salvarReservas(reservas) {
    localStorage.setItem("reservasSalas", JSON.stringify(reservas));
}

function buscarReservasSistema() {
    return JSON.parse(localStorage.getItem("reservasSistema")) || [];
}

function salvarReservasSistema(reservas) {
    localStorage.setItem("reservasSistema", JSON.stringify(reservas));
}

function obterUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function renderizarConvidadosReserva() {
    const contador = document.getElementById("reserva-contador-convidados");
    if (contador) {
        contador.textContent = capacidadeReserva !== Infinity
            ? `${convidadosReserva.length} / ${capacidadeReserva}`
            : (convidadosReserva.length > 0 ? convidadosReserva.length : '');
    }
    const lista = document.getElementById("reserva-lista-convidados");
    if (!lista) return;
    lista.classList.toggle("oculto", convidadosReserva.length === 0);
    lista.innerHTML = convidadosReserva.map((email, i) => `
        <div class="modal-convidados-item">
            <span>${email}</span>
            <button type="button" class="btn-remover-convidado" data-index="${i}" title="Remover">×</button>
        </div>
    `).join('');
    lista.querySelectorAll('.btn-remover-convidado').forEach(btn => {
        btn.addEventListener('click', () => {
            convidadosReserva.splice(Number(btn.dataset.index), 1);
            renderizarConvidadosReserva();
        });
    });
    popularSelectConvidadosReserva();
}

function popularSelectConvidadosReserva() {
    const select = document.getElementById("reserva-novo-convidado");
    if (!select) return;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const logado = obterUsuarioLogado();
    const disponiveis = usuarios.filter(u =>
        u.senhaDefinida === true &&
        (!logado || u.email !== logado.email) &&
        !convidadosReserva.includes(u.email)
    );
    select.innerHTML = '<option value="">Selecionar usuário...</option>' +
        disponiveis.map(u => `<option value="${u.email}">${u.email}</option>`).join('');
}

function converterHorarioParaMinutos(horario) {
    const [horas, minutos] = horario.split(":").map(Number);
    return horas * 60 + minutos;
}

function horariosConflitam(inicio1, fim1, inicio2, fim2) {
    const i1 = converterHorarioParaMinutos(inicio1);
    const f1 = converterHorarioParaMinutos(fim1);
    const i2 = converterHorarioParaMinutos(inicio2);
    const f2 = converterHorarioParaMinutos(fim2);

    return i1 < f2 && f1 > i2;
}

function obterContainerSalas() {
    return document.querySelector(".lista-salas");
}

function gerarCardsSalasDoSistema() {
    criarEspacosPadraoSalas();

    const container = obterContainerSalas();
    if (!container) return;

    const salas = buscarEspacosSistema().filter(espaco =>
        espaco.tipo === "Sala de Reunião"
    );

    container.innerHTML = "";

    salas.forEach(sala => {
        const classeBadge = sala.status === "Inativo" ? "inativa" : "disponivel";
        const textoBadge = sala.status === "Inativo" ? "Inativa" : "Disponível";
        const disabled = sala.status === "Inativo" ? "disabled" : "";
        const imagem = sala.imagem || imagemPadraoSala(sala.nome);

        container.innerHTML += `
            <article class="card-sala"
                     data-sala="${sala.nome}"
                     data-capacidade="${sala.capacidade}"
                     data-inativa="${sala.status === "Inativo"}">

                <div class="sala-info-principal">
                    <img src="${imagem}"
                         alt="Foto da ${sala.nome}"
                         class="sala-img">

                    <div class="sala-textos">
                        <h3>${sala.nome}</h3>
                        <p>Capacidade: ${sala.capacidade} pessoas · ${sala.recursos}${sala.area && sala.area !== "-" ? ` · ${sala.area}` : ""}</p>
                    </div>
                </div>
    
                <div class="sala-acoes">
                    <span class="badge ${classeBadge}">${textoBadge}</span>

                    <button type="button"
                            class="btn-detalhes"
                            ${disabled}>
                        Detalhes
                    </button>

                    <button type="button"
                            class="btn-reservar"
                            ${disabled}>
                        Reservar
                    </button>
                </div>
            </article>
        `;
    });

    atualizarSelectSalas();
}

function atualizarSelectSalas() {
    const salas = buscarEspacosSistema().filter(espaco =>
        espaco.tipo === "Sala de Reunião" && espaco.status === "Ativo"
    );

    selectEspaco.innerHTML = `<option value="">Selecione o local</option>`;

    salas.forEach(sala => {
        const option = document.createElement("option");
        option.value = sala.nome;
        option.textContent = `${sala.nome} – cap. ${sala.capacidade}`;
        selectEspaco.appendChild(option);
    });
}

function salvarReservaNoSistema(reserva) {
    const reservasSistema = buscarReservasSistema();
    const usuarioLogado = obterUsuarioLogado();

    if (!usuarioLogado) {
        mostrarToast("Usuário não encontrado", "Faça login novamente para realizar a reserva.", "erro");
        return;
    }

    const reservaSistema = {
        id: reserva.id,
        usuarioId: usuarioLogado.id,
        usuario: usuarioLogado.nome,
        tipo: "Sala de Reunião",
        espaco: reserva.sala,
        data: reserva.data,
        inicio: reserva.inicio,
        fim: reserva.fim,
        horario: `${reserva.inicio} – ${reserva.fim}`,
        convidados: reserva.convidados || "-",
        status: "Confirmada"
    };

    reservasSistema.unshift(reservaSistema);
    salvarReservasSistema(reservasSistema);
}

document.addEventListener("click", event => {
    const botaoReservar = event.target.closest(".btn-reservar");
    const botaoDetalhes = event.target.closest(".btn-detalhes");

    if (botaoReservar) {
        if (botaoReservar.disabled) return;

        const card = botaoReservar.closest(".card-sala");
        if (!card || card.dataset.inativa === "true") return;

        preencherSelectComSala(card.dataset.sala);

        if (!modalReserva.open) {
            modalReserva.showModal();
        }
    }

    if (botaoDetalhes) {
        if (botaoDetalhes.disabled) return;

        const card = botaoDetalhes.closest(".card-sala");
        if (!card) return;

        abrirModalDetalhes(card);
    }
});

btnNovaReserva.addEventListener("click", () => {
    restaurarSelectCompleto();
});

selectEspaco.addEventListener("change", verificarCapacidade);

document.getElementById("reserva-btn-adicionar").addEventListener("click", () => {
    const select = document.getElementById("reserva-novo-convidado");
    const email  = select.value;
    if (!email) return;
    if (capacidadeReserva !== Infinity && convidadosReserva.length >= capacidadeReserva) {
        mostrarToast("Capacidade máxima", `Limite de ${capacidadeReserva} convidados atingido.`, "erro");
        return;
    }
    convidadosReserva.push(email);
    select.value = '';
    renderizarConvidadosReserva();
});

function verificarCapacidade() {
    const limiteMsg = document.getElementById("limite-msg");
    const salas = buscarEspacosSistema();

    const sala = salas.find(espaco =>
        espaco.tipo === "Sala de Reunião" &&
        espaco.nome === selectEspaco.value
    );

    if (sala) {
        capacidadeReserva = Number(sala.capacidade) >= 1 ? Number(sala.capacidade) : Infinity;
        limiteMsg.textContent = `Limite de ${sala.capacidade} convidados para este espaço.`;
    } else {
        capacidadeReserva = Infinity;
        limiteMsg.textContent = "Selecione uma sala para ver o limite de convidados.";
    }
    renderizarConvidadosReserva();
}

btnConfirmar.addEventListener("click", () => {
    const sala = selectEspaco.value;
    const data = inputDataModal.value;
    const inicio = inputInicio.value;
    const fim = inputFim.value;

    if (!sala || !data || !inicio || !fim) {
        mostrarToast("Campos obrigatórios", "Preencha todos os campos da reserva.", "erro");
        return;
    }

    if (inicio >= fim) {
        mostrarToast("Horário inválido", "O horário de início precisa ser menor que o horário de fim.", "erro");
        return;
    }

    const usuarioLogado = obterUsuarioLogado();

    if (!usuarioLogado) {
        mostrarToast("Usuário não encontrado", "Faça login novamente para realizar a reserva.", "erro");
        return;
    }

    const reservas = buscarReservas();

    const horarioIndisponivel = reservas.some(reserva =>
        reserva.sala === sala &&
        reserva.data === data &&
        horariosConflitam(inicio, fim, reserva.inicio, reserva.fim)
    );

    if (horarioIndisponivel) {
        mostrarToast("Horário indisponível", "Essa sala já está reservada nesse horário.", "erro");
        return;
    }

    const novaReserva = {
        id: Date.now(),
        usuarioId: usuarioLogado.id,
        usuario: usuarioLogado.nome,
        sala,
        data,
        inicio,
        fim,
        convidados: convidadosReserva.join(', ') || '-'
    };

    reservas.push(novaReserva);

    salvarReservas(reservas);
    salvarReservaNoSistema(novaReserva);

    if (typeof adicionarNotificacao === "function") {
        adicionarNotificacao(
            `Reserva confirmada para ${sala} no dia ${data}, das ${inicio} às ${fim}.`
        );
    }

    mostrarToast("Reserva confirmada", "Sua reserva foi realizada com sucesso!", "sucesso");

    inputDataModal.value = "";
    inputInicio.value = "";
    inputFim.value = "";
    convidadosReserva = [];
    capacidadeReserva = Infinity;
    selectEspaco.value = "";
    renderizarConvidadosReserva();

    verificarCapacidade();
    modalReserva.close();
});

btnFiltrar.addEventListener("click", () => {
    const dataFiltro = inputFiltroData.value;
    const inicioFiltro = inputFiltroInicio.value;
    const fimFiltro = inputFiltroFim.value;

    if (!dataFiltro || !inicioFiltro || !fimFiltro) {
        mostrarToast("Filtro incompleto", "Preencha a data, horário inicial e horário final.", "erro");
        return;
    }

    if (inicioFiltro >= fimFiltro) {
        mostrarToast("Horário inválido", "O horário inicial precisa ser menor que o horário final.", "erro");
        return;
    }

    aplicarFiltro(dataFiltro, inicioFiltro, fimFiltro);
});

function aplicarFiltro(dataFiltro, inicioFiltro, fimFiltro) {
    const reservas = buscarReservas();

    document.querySelectorAll(".card-sala").forEach(card => {
        const badge = card.querySelector(".badge");
        const btnReservar = card.querySelector(".btn-reservar");

        if (card.dataset.inativa === "true") {
            badge.textContent = "Inativa";
            badge.className = "badge inativa";
            btnReservar.disabled = true;
            return;
        }

        const nomeSala = card.dataset.sala;

        const reservadaNoPeriodo = reservas.some(reserva =>
            reserva.sala === nomeSala &&
            reserva.data === dataFiltro &&
            horariosConflitam(inicioFiltro, fimFiltro, reserva.inicio, reserva.fim)
        );

        if (reservadaNoPeriodo) {
            badge.textContent = "Ocupada";
            badge.className = "badge ocupada";
            btnReservar.disabled = true;
        } else {
            badge.textContent = "Disponível";
            badge.className = "badge disponivel";
            btnReservar.disabled = false;
        }
    });

    aplicarStatusEspacosSalas();
}

function abrirModalDetalhes(card) {
    const nomeSala = card.dataset.sala;
    const badge = card.querySelector(".badge");

    const espacos = buscarEspacosSistema();
    const salaDados = espacos.find(espaco => espaco.tipo === "Sala de Reunião" && espaco.nome === nomeSala);

    if (!salaDados) return;

    // Alimenta o cabeçalho e as linhas de detalhes mapeadas no HTML
    document.getElementById("detalhes-titulo").textContent = salaDados.nome;
    document.getElementById("detalhes-tipo").textContent = salaDados.tipo;
    document.getElementById("detalhes-nome").textContent = salaDados.nome;
    document.getElementById("detalhes-recursos").textContent = salaDados.recursos;
    
    // Tratamento para a capacidade (garante exibição elegante de números/traços)
    document.getElementById("detalhes-capacidade").textContent = 
        salaDados.capacidade !== "-" ? `${salaDados.capacidade} pessoas` : "—";
        
    // Captura e renderização do campo de Área / Local vindo do Admin
    document.getElementById("detalhes-area").textContent = 
        salaDados.area && salaDados.area !== "-" ? salaDados.area : "Não informada";

    const statusEl = document.getElementById("detalhes-status");
    statusEl.textContent = badge.textContent.trim();
    statusEl.className = "detail-value";

    if (badge.classList.contains("disponivel")) {
        statusEl.classList.add("status-disponivel");
    } else if (badge.classList.contains("ocupada")) {
        statusEl.classList.add("status-ocupada");
    } else {
        statusEl.classList.add("status-inativa");
    }

    const hoje = new Date().toLocaleDateString("pt-BR");
    const reservas = buscarReservas();
    const reservasHoje = reservas.filter(r => r.sala === nomeSala && r.data === hoje);

    const container = document.getElementById("detalhes-horarios");
    container.innerHTML = "";

    if (reservasHoje.length === 0) {
        container.innerHTML = `
            <p style="color: var(--color-text-md); font-size: 14px;">
                Nenhuma reserva para hoje.
            </p>
        `;
    } else {
        reservasHoje.forEach(r => {
            const item = document.createElement("div");
            item.className = "horario-item";

            item.innerHTML = `
                <span class="horario-time">${r.inicio} – ${r.fim}</span>
                ${r.convidados ? `<span class="horario-pessoa">· ${r.convidados}</span>` : ""}
            `;

            container.appendChild(item);
        });
    }

    btnReservarDosDetalhes.dataset.sala = nomeSala;

    if (!modalDetalhes.open) {
        modalDetalhes.showModal();
    }
}

btnReservarDosDetalhes.addEventListener("click", () => {
    const nomeSala = btnReservarDosDetalhes.dataset.sala;

    modalDetalhes.close();

    preencherSelectComSala(nomeSala);

    if (!modalReserva.open) {
        modalReserva.showModal();
    }
});

function preencherSelectComSala(nomeSala) {
    selectEspaco.value = nomeSala;
    convidadosReserva = [];
    capacidadeReserva = Infinity;
    renderizarConvidadosReserva();
    verificarCapacidade();
}

function restaurarSelectCompleto() {
    selectEspaco.value = "";
    atualizarSelectSalas();
    convidadosReserva = [];
    capacidadeReserva = Infinity;
    renderizarConvidadosReserva();
    verificarCapacidade();
}

function aplicarStatusEspacosSalas() {
    const espacos = buscarEspacosSistema();

    document.querySelectorAll(".card-sala").forEach(card => {
        const nomeSala = card.dataset.sala;

        const espaco = espacos.find(item =>
            item.tipo === "Sala de Reunião" &&
            item.nome === nomeSala
        );

        if (!espaco) return;

        const badge = card.querySelector(".badge");
        const btnReservar = card.querySelector(".btn-reservar");
        const btnDetalhes = card.querySelector(".btn-detalhes");

        if (espaco.status === "Inativo") {
            card.dataset.inativa = "true";

            badge.textContent = "Inativa";
            badge.className = "badge inativa";

            btnReservar.disabled = true;
            btnDetalhes.disabled = true;
        } else {
            card.dataset.inativa = "false";

            badge.textContent = "Disponível";
            badge.className = "badge disponivel";

            btnReservar.disabled = false;
            btnDetalhes.disabled = false;
        }
    });
}

gerarCardsSalasDoSistema();
aplicarStatusEspacosSalas();