const openButtons = document.querySelectorAll('.open-modal')

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal')
        const modal = document.getElementById(modalId)
        modal.show()
        
    })
})

const closeButtons = document.querySelectorAll('.close-modal')

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal')
        const modal = document.getElementById(modalId)
        modal.close()
    })
})

const usuarios = [
  { nome: "Ana Lima", email: "ana@empresa.com" },
  { nome: "Bruno Costa", email: "bruno@empresa.com" },
  // ... buscar do backend com fetch("/api/usuarios")
];

function atualizarConvidados() {
  const espaco = document.getElementById("espaco");
  const wrapper = document.getElementById("convidados-wrapper");
  const select = document.getElementById("convidados");
  const aviso = document.getElementById("aviso");
  const limiteLabel = document.getElementById("limite-label");

  const capacidade = parseInt(espaco.value);

  if (!capacidade) {
    wrapper.style.display = "none";
    return;
  }

  const limite = capacidade - 1; // -1 para o organizador

  limiteLabel.textContent = `(máx. ${limite})`;
  aviso.textContent = `Segure Ctrl ou Cmd para selecionar mais de um. Limite: ${limite}.`;

  select.innerHTML = usuarios.map(u =>
    `<option value="${u.email}">${u.nome} — ${u.email}</option>`
  ).join("");

  select.onchange = function () {
    const selecionados = [...this.selectedOptions];
    if (selecionados.length > limite) {
      selecionados[selecionados.length - 1].selected = false;
      aviso.textContent = `Limite de ${limite} convidados atingido.`;
    }
  };

  wrapper.style.display = "block";
}

function confirmar() {
  const espaco = document.getElementById("espaco");
  const data = document.getElementById("date").value;
  const inicio = document.getElementById("start-time").value;
  const termino = document.getElementById("ending-time").value;
  const convidados = [...document.getElementById("convidados").selectedOptions]
    .map(o => o.value);

  if (!espaco.value || !data || !inicio || !termino) {
    alert("Preencha todos os campos.");
    return;
  }

  console.log({ espaco: espaco.value, data, inicio, termino, convidados });
  // enviar para o backend...
}