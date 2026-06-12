function buscarEspacosSistema() {
    return JSON.parse(localStorage.getItem("espacosSistema")) || [];
}

function salvarEspacosSistema(espacos) {
    localStorage.setItem("espacosSistema", JSON.stringify(espacos));
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

function alternarStatusEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    espaco.status = espaco.status === "Ativo" ? "Inativo" : "Ativo";

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();
}

function editarEspaco(id) {
    const espacos = buscarEspacosSistema();
    const espaco = espacos.find(item => item.id === Number(id));

    if (!espaco) return;

    const novoNome = prompt("Nome do espaço:", espaco.nome);
    if (!novoNome) return;

    espaco.nome = novoNome.trim();

    if (espaco.tipo === "Sala de Reunião") {
        const novaCapacidade = prompt("Capacidade:", espaco.capacidade);
        const novosRecursos = prompt("Recursos:", espaco.recursos);

        if (novaCapacidade) espaco.capacidade = novaCapacidade.trim();
        if (novosRecursos) espaco.recursos = novosRecursos.trim();
    }

    if (espaco.tipo === "Estação de Trabalho") {
        const novaArea = prompt("Área / Localização:", espaco.area);
        if (novaArea) espaco.area = novaArea.trim();
    }

    salvarEspacosSistema(espacos);
    carregarEspacosAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    criarEspacosPadrao();
    carregarEspacosAdmin();
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
        editarEspaco(botaoEditar.dataset.id);
    }
});