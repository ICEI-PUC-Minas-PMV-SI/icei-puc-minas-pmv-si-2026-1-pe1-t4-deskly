function buscarReservasSistema() {
    return JSON.parse(localStorage.getItem("reservasSistema")) || [];
}

function salvarReservasSistema(reservas) {
    localStorage.setItem("reservasSistema", JSON.stringify(reservas));
}

function carregarReservasAdmin() {
    const tabela = document.getElementById("tabelaReservasAdmin");

    if (!tabela) return;

    const reservas = buscarReservasSistema();

    tabela.innerHTML = "";

    if (reservas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td data-label="Reservas" colspan="6">
                    Nenhuma reserva cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    reservas.forEach(reserva => {
        tabela.innerHTML += `
            <tr>
                <td data-label="Usuário">${reserva.usuario}</td>
                <td data-label="Espaço">${reserva.espaco}</td>
                <td data-label="Data">${reserva.data}</td>
                <td data-label="Horário">${reserva.horario}</td>
                <td data-label="Status">
                    <span class="status confirmado">${reserva.status}</span>
                </td>
                <td data-label="Ações">
                    <button class="btn-action btn-excluir-reserva-admin" data-id="${reserva.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

function excluirReservaAdmin(id) {
    let reservasSistema = buscarReservasSistema();

    reservasSistema = reservasSistema.filter(reserva => reserva.id !== Number(id));

    salvarReservasSistema(reservasSistema);
    carregarReservasAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    carregarReservasAdmin();
});

document.addEventListener("click", event => {
    const botaoExcluir = event.target.closest(".btn-excluir-reserva-admin");

    if (!botaoExcluir) return;

    const id = botaoExcluir.dataset.id;

    excluirReservaAdmin(id);
});