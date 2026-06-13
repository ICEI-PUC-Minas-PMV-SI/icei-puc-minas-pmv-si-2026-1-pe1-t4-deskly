function buscarEspacosSistema() {
    return JSON.parse(localStorage.getItem("espacosSistema")) || [];
}

function salvarEspacosSistema(espacos) {
    localStorage.setItem("espacosSistema", JSON.stringify(espacos));
}

function mostrarToast(titulo, mensagem, tipo = "aviso") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<strong>${titulo}</strong><span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}

function comprimirImagem(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX = 800;
            let w = img.width, h = img.height;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            callback(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ✅ MODIFICADO: Deixado completamente vazio para o painel iniciar limpo e dinâmico
function criarEspacosPadrao() {
    if (localStorage.getItem("espacosSistema")) return;
    salvarEspacosSistema([]); 
}

function classeStatus(status) {
    return status === "Ativo" ? "confirmado" : "inativo";
}

// ✅ ATUALIZADO: Renderização dinâmica das colunas de tabelas limpas
function carregarEspacosAdmin() {
    const tabelaSalas = document.getElementById("tabelaEspacosSalas");
    const tabelaEstacoes = document.getElementById("tabelaEspacosEstacoes");

    if (!tabelaSalas || !tabelaEstacoes) return;

    const espacos = buscarEspacosSistema();

    tabelaSalas.innerHTML = "";
    tabelaEstacoes.innerHTML = "";

    espacos.forEach(espaco => {
        const botaoStatus = espaco.status === "Ativo" ? "Desativar" : "Ativar";

        if (espaco.tipo === "Sala de Reunião") {
            tabelaSalas.innerHTML += `
                <tr>
                    <td data-label="Espaço">${espaco.nome}</td>
                    <td data-label="Localização">${espaco.area || "-"}</td>
                    <td data-label="Capacidade">${espaco.capacidade}</td>
                    <td data-label="Recursos">${espaco.recursos}</td>
                    <td data-label="Status">
                        <span class="status ${classeStatus(espaco.status)}">${espaco.status}</span>
                    </td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">Editar</button>
                        <button type="button" class="btn-action btn-toggle-espaco" data-id="${espaco.id}">${botaoStatus}</button>
                    </td>
                </tr>
            `;
        }

        if (espaco.tipo === "Estação de Trabalho") {
            tabelaEstacoes.innerHTML += `
                <tr>
                    <td data-label="Espaço">${espaco.nome}</td>
                    <td data-label="Localização / Área">${espaco.area || "-"}</td>
                    <td data-label="Status">
                        <span class="status ${classeStatus(espaco.status)}">${espaco.status}</span>
                    </td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">Editar</button>
                        <button type="button" class="btn-action btn-toggle-espaco" data-id="${espaco.id}">${botaoStatus}</button>
                    </td>
                </tr>
            `;
        }
    });
}

function abrirModalEditarEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    const modal = document.getElementById("modal-editar-admin");

    document.getElementById("editarEspacoId").value = espaco.id;
    document.getElementById("editarEspacoNome").value = espaco.nome;
    document.getElementById("editarEspacoArea").value = espaco.area || "";

    const grupoCapacidade = document.getElementById("grupoEditarCapacidade");
    const grupoRecursos   = document.getElementById("grupoEditarRecursos");

    if (espaco.tipo === "Sala de Reunião") {
        grupoCapacidade.style.display = "block";
        grupoRecursos.style.display   = "block";
        document.getElementById("editarEspacoCapacidade").value = espaco.capacidade;
        document.getElementById("editarEspacoRecursos").value   = espaco.recursos;
    } else {
        grupoCapacidade.style.display = "none";
        grupoRecursos.style.display   = "none";
    }

    modal.showModal();
}

function salvarEdicaoEspaco() {
    const id      = Number(document.getElementById("editarEspacoId").value);
    const espacos = buscarEspacosSistema();
    const espaco  = espacos.find(item => item.id === id);

    if (!espaco) return;

    espaco.nome = document.getElementById("editarEspacoNome").value.trim();
    espaco.area = document.getElementById("editarEspacoArea").value.trim();

    if (espaco.tipo === "Sala de Reunião") {
        const capVal = Number(document.getElementById("editarEspacoCapacidade").value);
        if (!capVal || capVal < 1) {
            mostrarToast("Capacidade inválida", "A capacidade deve ser igual ou maior que 1.", "erro");
            return;
        }
        espaco.capacidade = capVal;
        espaco.recursos   = document.getElementById("editarEspacoRecursos").value.trim();
    } else {
        espaco.capacidade = "-";
        espaco.recursos   = "-";
    }

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();
    mostrarToast("Espaço atualizado", `${espaco.nome} foi atualizado com sucesso.`, "sucesso");
    document.getElementById("modal-editar-admin").close();
}

function alternarStatusEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco  = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    const ativando = espaco.status === "Inativo";
    espaco.status  = ativando ? "Ativo" : "Inativo";

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();
    mostrarToast(
        ativando ? "Espaço ativado" : "Espaço desativado",
        `${espaco.nome} foi ${ativando ? "ativado" : "desativado"} com sucesso.`,
        "sucesso"
    );
}

function limparFormularioCadastro() {
    document.getElementById("cadastroTipoEspaco").value      = "";
    document.getElementById("cadastroNomeEspaco").value      = "";
    document.getElementById("cadastroCapacidadeEspaco").value = "";
    document.getElementById("cadastroRecursosEspaco").value  = "";
    document.getElementById("cadastroAreaEspaco").value      = "";
    document.getElementById("cadastroStatusEspaco").value    = "Ativo";
    document.getElementById("cadastroImagemEspaco").value    = "";
    document.getElementById("nomeImagemEspaco").textContent  = "Escolher imagem";
}

document.addEventListener("DOMContentLoaded", () => {
    criarEspacosPadrao();
    carregarEspacosAdmin();

    document.getElementById("fecharModalEditarAdmin")
        .addEventListener("click", () => document.getElementById("modal-editar-admin").close());

    document.getElementById("cancelarEditarAdmin")
        .addEventListener("click", () => document.getElementById("modal-editar-admin").close());

    document.getElementById("salvarEditarAdmin")
        .addEventListener("click", salvarEdicaoEspaco);

    const inputImagem = document.getElementById("cadastroImagemEspaco");
    const nomeImagem  = document.getElementById("nomeImagemEspaco");

    if (inputImagem && nomeImagem) {
        inputImagem.addEventListener("change", () => {
            nomeImagem.textContent = inputImagem.files.length > 0
                ? inputImagem.files[0].name
                : "Escolher imagem";
        });
    }

    // Controle de campos dinâmicos no cadastro
    const tipoCadastro         = document.getElementById("cadastroTipoEspaco");
    const grupoSalaCadastro    = document.getElementById("grupoSalaCadastro");
    const camposCadastroEspaco = document.getElementById("camposCadastroEspaco");

    function atualizarCamposCadastro() {
        if (tipoCadastro.value === "Sala de Reunião") {
            camposCadastroEspaco.style.display = "block";
            grupoSalaCadastro.style.display    = "flex";
        } else if (tipoCadastro.value === "Estação de Trabalho") {
            camposCadastroEspaco.style.display = "block";
            grupoSalaCadastro.style.setProperty("display", "none", "important");
        } else {
            camposCadastroEspaco.style.display = "none";
        }
    }

    tipoCadastro.addEventListener("change", atualizarCamposCadastro);
    atualizarCamposCadastro();

    // Confirmar novos cadastros capturando todas as propriedades sem perda
    document.getElementById("btn-confirmar-cadastro-espaco")
        .addEventListener("click", () => {
            const tipo       = tipoCadastro.value;
            const nome       = document.getElementById("cadastroNomeEspaco").value.trim();
            const capacidade = document.getElementById("cadastroCapacidadeEspaco").value.trim();
            const recursos   = document.getElementById("cadastroRecursosEspaco").value.trim();
            const area       = document.getElementById("cadastroAreaEspaco").value.trim();
            const status     = document.getElementById("cadastroStatusEspaco").value;
            const imagemInput = document.getElementById("cadastroImagemEspaco");

            if (!tipo || !nome) {
                mostrarToast("Campos obrigatórios", "Preencha o tipo e o nome do espaço.", "erro");
                return;
            }

            function salvarNovoEspaco(imagemBase64 = "") {
                const espacos = buscarEspacosSistema();

                const novoEspaco = {
                    id:         Date.now(),
                    tipo:       tipo,
                    nome:       nome,
                    capacidade: tipo === "Sala de Reunião" ? capacidade : "-",
                    recursos:   tipo === "Sala de Reunião" ? recursos : "-",
                    area:       area || "-", // ✅ Salva a localização para ambos os tipos agora!
                    status:     status,
                    imagem:     imagemBase64
                };

                espacos.push(novoEspaco);
                salvarEspacosSistema(espacos);
                carregarEspacosAdmin();

                mostrarToast("Espaço cadastrado", `${nome} foi cadastrado com sucesso.`, "sucesso");

                document.getElementById("modal-cadastrar-espaco").close();
                limparFormularioCadastro();
                atualizarCamposCadastro();
            }

            if (imagemInput.files.length > 0) {
                comprimirImagem(imagemInput.files[0], salvarNovoEspaco);
            } else {
                salvarNovoEspaco();
            }
        });
});

document.addEventListener("click", event => {
    const botaoToggle = event.target.closest(".btn-toggle-espaco");
    const botaoEditar = event.target.closest(".btn-editar-espaco");

    if (botaoToggle) {
        event.preventDefault();
        alternarStatusEspaco(botaoToggle.dataset.id);
        return;
    }

    if (botaoEditar) {
        event.preventDefault();
        abrirModalEditarEspaco(botaoEditar.dataset.id);
        return;
    }
});