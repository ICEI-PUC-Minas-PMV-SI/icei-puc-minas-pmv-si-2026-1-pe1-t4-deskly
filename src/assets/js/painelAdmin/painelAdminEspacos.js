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

    reader.onload = event => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX = 800;

            let largura = img.width;
            let altura = img.height;

            if (largura > MAX) {
                altura = Math.round(altura * MAX / largura);
                largura = MAX;
            }

            canvas.width = largura;
            canvas.height = altura;

            canvas
                .getContext("2d")
                .drawImage(img, 0, 0, largura, altura);

            callback(canvas.toDataURL("image/jpeg", 0.7));
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

// Modificado: Agora inicia o sistema com um array vazio se não houver dados
function criarEspacosPadrao() {
    if (localStorage.getItem("espacosSistema")) return;

    // Removemos todos os objetos que vinham por padrão
    const espacosPadrao = [];

    salvarEspacosSistema(espacosPadrao);
}

function classeStatus(status) {
    return status === "Ativo" ? "confirmado" : "inativo";
}

function carregarEspacosAdmin() {
    const tabelaSalas = document.getElementById("tabelaEspacosSalas");
    const tabelaEstacoes = document.getElementById("tabelaEspacosEstacoes");

    if (!tabelaSalas || !tabelaEstacoes) return;

    const espacos = buscarEspacosSistema();

    tabelaSalas.innerHTML = "";
    tabelaEstacoes.innerHTML = "";

    espacos.forEach(espaco => {
        const botaoStatus = espaco.status === "Ativo" ? "Desativar" : "Ativar";
        const classeBotao = espaco.status === "Inativo" ? "btn-outline" : "";

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
                        <button type="button"
                                class="btn-action btn-editar-espaco"
                                data-id="${espaco.id}">
                            Editar
                        </button>

                        <button type="button"
                                class="btn-action ${classeBotao} btn-toggle-espaco"
                                data-id="${espaco.id}">
                            ${botaoStatus}
                        </button>
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
                        <button type="button"
                                class="btn-action btn-editar-espaco"
                                data-id="${espaco.id}">
                            Editar
                        </button>

                        <button type="button"
                                class="btn-action ${classeBotao} btn-toggle-espaco"
                                data-id="${espaco.id}">
                            ${botaoStatus}
                        </button>
                    </td>
                </tr>
            `;
        }
    });
}

function abrirModalEditarEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => Number(item.id) === Number(id));

    if (!espaco) {
        mostrarToast("Erro", "Espaço não encontrado.", "erro");
        return;
    }

    const modal = document.getElementById("modal-editar-admin");

    if (!modal) {
        mostrarToast("Erro", "Modal de edição não encontrado.", "erro");
        return;
    }

    document.getElementById("editarEspacoId").value = espaco.id;
    document.getElementById("editarEspacoNome").value = espaco.nome || "";
    document.getElementById("editarEspacoArea").value = espaco.area === "-" ? "" : espaco.area || "";

    const grupoCapacidade = document.getElementById("grupoEditarCapacidade");
    const grupoRecursos = document.getElementById("grupoEditarRecursos");
    const inputCapacidade = document.getElementById("editarEspacoCapacidade");
    const inputRecursos = document.getElementById("editarEspacoRecursos");

    if (espaco.tipo === "Sala de Reunião") {
        grupoCapacidade.style.display = "flex";
        grupoRecursos.style.display = "flex";
        inputCapacidade.value = espaco.capacidade || "";
        inputRecursos.value = espaco.recursos === "-" ? "" : espaco.recursos || "";
    } else {
        grupoCapacidade.style.display = "none";
        grupoRecursos.style.display = "none";
        inputCapacidade.value = "";
        inputRecursos.value = "";
    }

    modal.showModal();
}

function salvarEdicaoEspaco() {
    const id = Number(document.getElementById("editarEspacoId").value);
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => Number(item.id) === id);

    if (!espaco) {
        mostrarToast("Erro", "Espaço não encontrado.", "erro");
        return;
    }

    const nome = document.getElementById("editarEspacoNome").value.trim();
    const area = document.getElementById("editarEspacoArea").value.trim();

    if (!nome) {
        mostrarToast("Campo obrigatório", "Informe o nome do espaço.", "erro");
        return;
    }

    espaco.nome = nome;
    espaco.area = area || "-";

    if (espaco.tipo === "Sala de Reunião") {
        const capacidade = Number(document.getElementById("editarEspacoCapacidade").value);
        const recursos = document.getElementById("editarEspacoRecursos").value.trim();

        if (!capacidade || capacidade < 1) {
            mostrarToast("Capacidade inválida", "A capacidade deve ser igual ou maior que 1.", "erro");
            return;
        }

        espaco.capacidade = capacidade;
        espaco.recursos = recursos || "-";
    } else {
        espaco.capacidade = "-";
        espaco.recursos = "-";
    }

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();

    mostrarToast(
        "Espaço updated",
        `${espaco.nome} foi atualizado com sucesso.`,
        "sucesso"
    );

    document.getElementById("modal-editar-admin").close();
}

function alternarStatusEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => Number(item.id) === Number(id));

    if (!espaco) {
        mostrarToast("Erro", "Espaço não encontrado.", "erro");
        return;
    }

    const ativando = espaco.status === "Inativo";
    espaco.status = ativando ? "Ativo" : "Inativo";

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();

    mostrarToast(
        ativando ? "Espaço ativado" : "Espaço desativado",
        `${espaco.nome} foi ${ativando ? "ativado" : "desativado"} com sucesso.`,
        "sucesso"
    );
}

function limparFormularioCadastro() {
    const campos = [
        "cadastroTipoEspaco",
        "cadastroNomeEspaco",
        "cadastroCapacidadeEspaco",
        "cadastroRecursosEspaco",
        "cadastroAreaEspaco",
        "cadastroImagemEspaco"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = "";
    });

    const status = document.getElementById("cadastroStatusEspaco");
    if (status) status.value = "Ativo";

    const nomeImagem = document.getElementById("nomeImagemEspaco");
    if (nomeImagem) nomeImagem.textContent = "Escolher imagem...";
}

document.addEventListener("DOMContentLoaded", () => {
    criarEspacosPadrao();
    carregarEspacosAdmin();

    const modalEditar = document.getElementById("modal-editar-admin");
    const btnFecharEditar = document.getElementById("fecharModalEditarAdmin");
    const btnCancelarEditar = document.getElementById("cancelarEditarAdmin");
    const btnSalvarEditar = document.getElementById("salvarEditarAdmin");

    if (btnFecharEditar && modalEditar) {
        btnFecharEditar.addEventListener("click", () => modalEditar.close());
    }

    if (btnCancelarEditar && modalEditar) {
        btnCancelarEditar.addEventListener("click", () => modalEditar.close());
    }

    if (btnSalvarEditar) {
        btnSalvarEditar.addEventListener("click", salvarEdicaoEspaco);
    }

    const inputImagem = document.getElementById("cadastroImagemEspaco");
    const nomeImagem = document.getElementById("nomeImagemEspaco");

    if (inputImagem && nomeImagem) {
        inputImagem.addEventListener("change", () => {
            nomeImagem.textContent = inputImagem.files.length > 0
                ? inputImagem.files[0].name
                : "Escolher imagem...";
        });
    }

    const tipoCadastro = document.getElementById("cadastroTipoEspaco");
    const grupoSalaCadastro = document.getElementById("grupoSalaCadastro");
    const camposCadastroEspaco = document.getElementById("camposCadastroEspaco");

    function atualizarCamposCadastro() {
        if (!tipoCadastro || !camposCadastroEspaco || !grupoSalaCadastro) return;

        if (tipoCadastro.value === "Sala de Reunião") {
            camposCadastroEspaco.style.display = "block";
            grupoSalaCadastro.style.display = "flex";
        } else if (tipoCadastro.value === "Estação de Trabalho") {
            camposCadastroEspaco.style.display = "block";
            grupoSalaCadastro.style.setProperty("display", "none", "important");
        } else {
            camposCadastroEspaco.style.display = "none";
            grupoSalaCadastro.style.setProperty("display", "none", "important");
        }
    }

    if (tipoCadastro) {
        tipoCadastro.addEventListener("change", atualizarCamposCadastro);
        atualizarCamposCadastro();
    }

    const btnConfirmarCadastro = document.getElementById("btn-confirmar-cadastro-espaco");

    if (btnConfirmarCadastro) {
        btnConfirmarCadastro.addEventListener("click", () => {
            const tipo = tipoCadastro.value;
            const nome = document.getElementById("cadastroNomeEspaco").value.trim();
            const capacidade = document.getElementById("cadastroCapacidadeEspaco").value.trim();
            const recursos = document.getElementById("cadastroRecursosEspaco").value.trim();
            const area = document.getElementById("cadastroAreaEspaco").value.trim();
            const status = document.getElementById("cadastroStatusEspaco").value;
            const imagemInput = document.getElementById("cadastroImagemEspaco");

            if (!tipo || !nome) {
                mostrarToast("Campos obrigatórios", "Preencha o tipo e o nome do espaço.", "erro");
                return;
            }

            if (tipo === "Sala de Reunião") {
                const capacidadeNumero = Number(capacidade);

                if (!capacidadeNumero || capacidadeNumero < 1) {
                    mostrarToast("Capacidade inválida", "A capacidade deve ser igual ou maior que 1.", "erro");
                    return;
                }
            }

            function salvarNovoEspaco(imagemBase64 = "") {
                const espacos = buscarEspacosSistema();

                const novoEspaco = {
                    id: Date.now(),
                    tipo: tipo,
                    nome: nome,
                    capacidade: tipo === "Sala de Reunião" ? Number(capacidade) : "-",
                    recursos: tipo === "Sala de Reunião" ? recursos || "-" : "-",
                    area: area || "-",
                    status: status,
                    imagem: imagemBase64
                };

                espacos.push(novoEspaco);
                salvarEspacosSistema(espacos);
                carregarEspacosAdmin();

                mostrarToast(
                    "Espaço cadastrado",
                    `${nome} foi cadastrado com sucesso.`,
                    "sucesso"
                );

                const modalCadastro = document.getElementById("modal-cadastrar-espaco");
                if (modalCadastro) modalCadastro.close();

                limparFormularioCadastro();
                atualizarCamposCadastro();
            }

            if (imagemInput && imagemInput.files.length > 0) {
                comprimirImagem(imagemInput.files[0], salvarNovoEspaco);
            } else {
                salvarNovoEspaco();
            }
        });
    }
});

document.addEventListener("click", event => {
    const botaoToggle = event.target.closest(".btn-toggle-espaco");
    const botaoEditar = event.target.closest(".btn-editar-espaco");

    if (botaoToggle) {
        event.preventDefault();
        event.stopPropagation();
        alternarStatusEspaco(botaoToggle.dataset.id);
        return;
    }

    if (botaoEditar) {
        event.preventDefault();
        event.stopPropagation();
        abrirModalEditarEspaco(botaoEditar.dataset.id);
        return;
    }
});