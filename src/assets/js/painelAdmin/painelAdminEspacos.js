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

    toast.innerHTML = `
        <strong>${titulo}</strong>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function criarEspacosPadrao() {
    if (localStorage.getItem("espacosSistema")) return;

    const espacosPadrao = [
        { id: 1, tipo: "Sala de Reunião", nome: "Sala Alfa", capacidade: 8, recursos: "TV, Videoconferência, Lousa", area: "-", status: "Ativo" },
        { id: 2, tipo: "Sala de Reunião", nome: "Sala Beta", capacidade: 4, recursos: "TV, Videoconferência", area: "-", status: "Ativo" },
        { id: 3, tipo: "Sala de Reunião", nome: "Sala Gama", capacidade: 12, recursos: "TV, Videoconferência, Lousa, Ar-condicionado", area: "-", status: "Ativo" },
        { id: 4, tipo: "Sala de Reunião", nome: "Sala Delta", capacidade: 6, recursos: "Lousa", area: "-", status: "Inativo" },

        { id: 5, tipo: "Estação de Trabalho", nome: "Mesa 01", capacidade: "-", recursos: "-", area: "Andar 1 - Ala A", status: "Ativo" },
        { id: 6, tipo: "Estação de Trabalho", nome: "Mesa 02", capacidade: "-", recursos: "-", area: "Andar 2 - Ala B", status: "Ativo" },
        { id: 7, tipo: "Estação de Trabalho", nome: "Mesa 03", capacidade: "-", recursos: "-", area: "Andar 3 - Ala C", status: "Inativo" },
        { id: 8, tipo: "Estação de Trabalho", nome: "Mesa 04", capacidade: "-", recursos: "-", area: "Andar 4 - Ala D", status: "Ativo" }
    ];

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
                    <td data-label="Capacidade">${espaco.capacidade}</td>
                    <td data-label="Recursos">${espaco.recursos}</td>
                    <td data-label="Status">
                        <span class="status ${classeStatus(espaco.status)}">${espaco.status}</span>
                    </td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">
                            Editar
                        </button>

                        <button type="button" class="btn-action ${classeBotao} btn-toggle-espaco" data-id="${espaco.id}">
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
                    <td data-label="Área">${espaco.area}</td>
                    <td data-label="Status">
                        <span class="status ${classeStatus(espaco.status)}">${espaco.status}</span>
                    </td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">
                            Editar
                        </button>

                        <button type="button" class="btn-action ${classeBotao} btn-toggle-espaco" data-id="${espaco.id}">
                            ${botaoStatus}
                        </button>
                    </td>
                </tr>
            `;
        }
    });
}

function criarModalEditarEspaco() {
    if (document.getElementById("modal-editar-admin")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <dialog id="modal-editar-admin">
            <div class="modal-header">
                <h3 class="modal-title">Editar Espaço</h3>
                <button type="button" class="close-modal" id="fecharModalEditarAdmin">×</button>
            </div>

            <div class="modal-body">
                <input type="hidden" id="editarEspacoId">

                <div class="input-group">
                    <label>Nome do espaço</label>
                    <input type="text" id="editarEspacoNome">
                </div>

                <div class="input-group" id="grupoEditarCapacidade">
                    <label>Capacidade</label>
                    <input type="number" id="editarEspacoCapacidade" min="1">
                </div>

                <div class="input-group" id="grupoEditarRecursos">
                    <label>Recursos</label>
                    <input type="text" id="editarEspacoRecursos">
                </div>

                <div class="input-group" id="grupoEditarArea">
                    <label>Área / Localização</label>
                    <input type="text" id="editarEspacoArea">
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" id="cancelarEditarAdmin">Cancelar</button>
                <button type="button" class="btn-action" id="salvarEditarAdmin">Salvar</button>
            </div>
        </dialog>
    `);
}

function abrirModalEditarEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    const modal = document.getElementById("modal-editar-admin");

    document.getElementById("editarEspacoId").value = espaco.id;
    document.getElementById("editarEspacoNome").value = espaco.nome;

    const grupoCapacidade = document.getElementById("grupoEditarCapacidade");
    const grupoRecursos = document.getElementById("grupoEditarRecursos");
    const grupoArea = document.getElementById("grupoEditarArea");

    if (espaco.tipo === "Sala de Reunião") {
        grupoCapacidade.style.display = "flex";
        grupoRecursos.style.display = "flex";
        grupoArea.style.display = "none";

        document.getElementById("editarEspacoCapacidade").value = espaco.capacidade;
        document.getElementById("editarEspacoRecursos").value = espaco.recursos;
    }

    if (espaco.tipo === "Estação de Trabalho") {
        grupoCapacidade.style.display = "none";
        grupoRecursos.style.display = "none";
        grupoArea.style.display = "flex";

        document.getElementById("editarEspacoArea").value = espaco.area;
    }

    modal.showModal();
}

function salvarEdicaoEspaco() {
    const id = Number(document.getElementById("editarEspacoId").value);
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === id);

    if (!espaco) return;

    espaco.nome = document.getElementById("editarEspacoNome").value.trim();

    if (espaco.tipo === "Sala de Reunião") {
        espaco.capacidade = document.getElementById("editarEspacoCapacidade").value.trim();
        espaco.recursos = document.getElementById("editarEspacoRecursos").value.trim();
    }

    if (espaco.tipo === "Estação de Trabalho") {
        espaco.area = document.getElementById("editarEspacoArea").value.trim();
    }

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();

    document.getElementById("modal-editar-admin").close();
}

function alternarStatusEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    espaco.status = espaco.status === "Ativo" ? "Inativo" : "Ativo";

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    criarEspacosPadrao();
    criarModalEditarEspaco();
    carregarEspacosAdmin();

    document.getElementById("fecharModalEditarAdmin").addEventListener("click", () => {
        document.getElementById("modal-editar-admin").close();
    });

    document.getElementById("cancelarEditarAdmin").addEventListener("click", () => {
        document.getElementById("modal-editar-admin").close();
    });

    document.getElementById("salvarEditarAdmin").addEventListener("click", salvarEdicaoEspaco);
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

document.addEventListener("DOMContentLoaded", () => {

    const tipoCadastro = document.getElementById("cadastroTipoEspaco");
    const grupoSalaCadastro = document.getElementById("grupoSalaCadastro");
    const grupoEstacaoCadastro = document.getElementById("grupoEstacaoCadastro");

    const btnConfirmarCadastroEspaco =
        document.getElementById("btn-confirmar-cadastro-espaco");

    if (!tipoCadastro || !btnConfirmarCadastroEspaco) return;

const inputImagem = document.getElementById("cadastroImagemEspaco");
const nomeImagem = document.getElementById("nomeImagemEspaco");

if (inputImagem && nomeImagem) {
    inputImagem.addEventListener("change", () => {
        nomeImagem.textContent =
            inputImagem.files.length > 0
                ? inputImagem.files[0].name
                : "Escolher imagem";
    });
}

function atualizarCamposCadastro() {
    const camposCadastroEspaco = document.getElementById("camposCadastroEspaco");

    if (tipoCadastro.value === "Sala de Reunião") {
        camposCadastroEspaco.style.display = "flex";
        grupoSalaCadastro.style.display = "flex";
        grupoEstacaoCadastro.style.display = "none";
    } 
    
    else if (tipoCadastro.value === "Estação de Trabalho") {
        camposCadastroEspaco.style.display = "flex";
        grupoSalaCadastro.style.setProperty("display", "none", "important");
        grupoEstacaoCadastro.style.display = "block";
    } 
    
    else {
        camposCadastroEspaco.style.display = "none";
        grupoSalaCadastro.style.setProperty("display", "none", "important");
        grupoEstacaoCadastro.style.display = "none";
    }
}

    tipoCadastro.addEventListener("change", atualizarCamposCadastro);

    atualizarCamposCadastro();

    btnConfirmarCadastroEspaco.addEventListener("click", () => {

        const tipo = document.getElementById("cadastroTipoEspaco").value;

        const nome =
            document.getElementById("cadastroNomeEspaco")
                .value
                .trim();

        const capacidade =
            document.getElementById("cadastroCapacidadeEspaco")
                .value
                .trim();

        const recursos =
            document.getElementById("cadastroRecursosEspaco")
                .value
                .trim();

        const area =
            document.getElementById("cadastroAreaEspaco")
                .value
                .trim();

        const status =
            document.getElementById("cadastroStatusEspaco")
                .value;

        const imagemInput =
            document.getElementById("cadastroImagemEspaco");

        if (!tipo || !nome) {

            alert("Preencha os campos obrigatórios.");

            return;
        }

        function salvarNovoEspaco(imagemBase64 = "") {

            const espacos = buscarEspacosSistema();

            const novoEspaco = {

                id: Date.now(),

                tipo: tipo,

                nome: nome,

                capacidade:
                    tipo === "Sala de Reunião"
                        ? capacidade
                        : "-",

                recursos:
                    tipo === "Sala de Reunião"
                        ? recursos
                        : "-",

                area:
                    tipo === "Estação de Trabalho"
                        ? area
                        : "-",

                status: status,

                imagem: imagemBase64
            };

            espacos.push(novoEspaco);

            salvarEspacosSistema(espacos);

            carregarEspacosAdmin();

            espacos.push(novoEspaco);

salvarEspacosSistema(espacos);

carregarEspacosAdmin();

mostrarToast(
    "Espaço cadastrado",
    `${nome} foi cadastrado com sucesso.`,
    "sucesso"
);

document
    .getElementById("modal-cadastrar-espaco")
    .close();

            document
                .getElementById("modal-cadastrar-espaco")
                .close();

           document.getElementById("cadastroTipoEspaco").value = "";

document.getElementById("cadastroNomeEspaco").value = "";

document.getElementById("cadastroCapacidadeEspaco").value = "";

document.getElementById("cadastroRecursosEspaco").value = "";

document.getElementById("cadastroAreaEspaco").value = "";

document.getElementById("cadastroStatusEspaco").value = "Ativo";

document.getElementById("cadastroImagemEspaco").value = "";

document.getElementById("nomeImagemEspaco").textContent =
    "Escolher imagem";

atualizarCamposCadastro();

        }

        if (imagemInput.files.length > 0) {

            const reader = new FileReader();

            reader.onload = function () {

                salvarNovoEspaco(reader.result);

            };

            reader.readAsDataURL(imagemInput.files[0]);

        }

        else {

            salvarNovoEspaco();

        }

    });

});