document.addEventListener('DOMContentLoaded', () => {
    if (!exigirAdmin()) return;
});

function nomeEspacoDuplicado(nome, ignorarId = null) {
    const alvo = nome.trim().toLowerCase();
    return obterEspacosSistema().some(e =>
        Number(e.id) !== Number(ignorarId) &&
        (e.nome || '').trim().toLowerCase() === alvo
    );
}

function contarConvidados(convidados) {
    if (!convidados || convidados === '-') return 0;
    return convidados.split(',').map(i => i.trim()).filter(Boolean).length;
}

function maiorConvidadosReservasAtivas(identificador) {
    const agora = new Date();
    let maximo = 0;
    obterReservasSistema().forEach(reserva => {
        if (reserva.espaco !== identificador || reserva.status !== 'Confirmada') return;
        const [d, m, y] = (reserva.data || '').split('/').map(Number);
        if (!d || !m || !y) return;
        const [h, min] = (reserva.fim || '23:59').split(':').map(Number);
        const termino = new Date(y, m - 1, d, h || 0, min || 0);
        if (termino < agora) return;
        maximo = Math.max(maximo, contarConvidados(reserva.convidados));
    });
    return maximo;
}

const LIMITE_NOME_ESPACO = 15;

function aplicarLimiteNomeEspaco(campo) {
    if (!campo) return;
    let avisoRecente = false;
    function avisar() {
        if (avisoRecente) return;
        mostrarToast('Limite atingido', `O nome do espaço deve ter no máximo ${LIMITE_NOME_ESPACO} caracteres.`, 'erro');
        avisoRecente = true;
        setTimeout(() => { avisoRecente = false; }, 2000);
    }
    campo.addEventListener('keydown', event => {
        const teclaImprimivel = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
        const semSelecao = campo.selectionStart === campo.selectionEnd;
        if (campo.value.length >= LIMITE_NOME_ESPACO && teclaImprimivel && semSelecao) avisar();
    });
    campo.addEventListener('paste', event => {
        const colado = (event.clipboardData || window.clipboardData).getData('text');
        const selecionados = campo.selectionEnd - campo.selectionStart;
        if (campo.value.length - selecionados + colado.length > LIMITE_NOME_ESPACO) avisar();
    });
}

function criarEspacosPadrao() {
    if (!localStorage.getItem('espacosSistema')) salvarEspacosSistema([]);
}

function classeStatus(status) {
    return status === 'Ativo' ? 'confirmado' : 'inativo';
}

function carregarEspacosAdmin() {
    const tabelaSalas = document.getElementById('tabelaEspacosSalas');
    const tabelaEstacoes = document.getElementById('tabelaEspacosEstacoes');
    if (!tabelaSalas || !tabelaEstacoes) return;

    tabelaSalas.innerHTML = '';
    tabelaEstacoes.innerHTML = '';

    obterEspacosSistema().forEach(espaco => {
        const botaoStatus = espaco.status === 'Ativo' ? 'Desativar' : 'Ativar';
        const classeBotao = espaco.status === 'Inativo' ? 'btn-outline' : '';

        if (espaco.tipo === 'Sala de Reunião') {
            tabelaSalas.innerHTML += `
                <tr>
                    <td data-label="Espaço">${espaco.nome}</td>
                    <td data-label="Localização">${espaco.area || '-'}</td>
                    <td data-label="Capacidade">${espaco.capacidade}</td>
                    <td data-label="Recursos">${espaco.recursos}</td>
                    <td data-label="Status"><span class="status ${classeStatus(espaco.status)}">${espaco.status}</span></td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">Editar</button>
                        <button type="button" class="btn-action ${classeBotao} btn-toggle-espaco" data-id="${espaco.id}">${botaoStatus}</button>
                    </td>
                </tr>`;
        }

        if (espaco.tipo === 'Estação de Trabalho') {
            tabelaEstacoes.innerHTML += `
                <tr>
                    <td data-label="Espaço">${espaco.nome}</td>
                    <td data-label="Localização / Área">${espaco.area || '-'}</td>
                    <td data-label="Status"><span class="status ${classeStatus(espaco.status)}">${espaco.status}</span></td>
                    <td data-label="Ações">
                        <button type="button" class="btn-action btn-editar-espaco" data-id="${espaco.id}">Editar</button>
                        <button type="button" class="btn-action ${classeBotao} btn-toggle-espaco" data-id="${espaco.id}">${botaoStatus}</button>
                    </td>
                </tr>`;
        }
    });
}

function abrirModalEditarEspaco(id) {
    const espaco = obterEspacosSistema().find(e => Number(e.id) === Number(id));
    if (!espaco) { mostrarToast('Erro', 'Espaço não encontrado.', 'erro'); return; }

    const modal = document.getElementById('modal-editar-admin');
    if (!modal) { mostrarToast('Erro', 'Modal de edição não encontrado.', 'erro'); return; }

    document.getElementById('editar-espaco-id').value = espaco.id;
    document.getElementById('editar-espaco-nome').value = espaco.nome || '';
    document.getElementById('editar-espaco-area').value = espaco.area === '-' ? '' : espaco.area || '';

    const grupoCapacidade = document.getElementById('grupo-editar-capacidade');
    const grupoRecursos = document.getElementById('grupo-editar-recursos');
    const inputCapacidade = document.getElementById('editar-espaco-capacidade');
    const inputRecursos = document.getElementById('editar-espaco-recursos');

    if (espaco.tipo === 'Sala de Reunião') {
        grupoCapacidade.style.display = 'flex';
        grupoRecursos.style.display = 'flex';
        inputCapacidade.value = espaco.capacidade || '';
        inputRecursos.value = espaco.recursos === '-' ? '' : espaco.recursos || '';
    } else {
        grupoCapacidade.style.display = 'none';
        grupoRecursos.style.display = 'none';
        inputCapacidade.value = '';
        inputRecursos.value = '';
    }

    const container = document.getElementById('previa-editar');
    const image = document.getElementById('previa-editar-imagem');
    const label = document.getElementById('nome-imagem-espaco-editar');

    if (label) label.textContent = 'Alterar imagem...';
    if (espaco.imagem && container && image) {
        image.src = espaco.imagem;
        container.style.display = 'block';
    } else if (container) {
        container.style.display = 'none';
    }

    modal.showModal();
}

document.getElementById('cadastro-imagem-espaco')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const container = document.getElementById('previa-cadastro');
    const image = document.getElementById('previa-cadastro-imagem');
    const label = document.getElementById('nome-imagem-espaco');

    if (file) {
        label.textContent = file.name;
        const reader = new FileReader();
        reader.onload = event => { image.src = event.target.result; container.style.display = 'block'; };
        reader.readAsDataURL(file);
    } else {
        label.textContent = 'Escolher imagem...';
        container.style.display = 'none';
        image.src = '';
    }
});

document.getElementById('editar-imagem-espaco')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const container = document.getElementById('previa-editar');
    const image = document.getElementById('previa-editar-imagem');
    const label = document.getElementById('nome-imagem-espaco-editar');

    if (file) {
        label.textContent = file.name;
        const reader = new FileReader();
        reader.onload = event => { image.src = event.target.result; container.style.display = 'block'; };
        reader.readAsDataURL(file);
    } else {
        label.textContent = 'Alterar imagem...';
        container.style.display = 'none';
        image.src = '';
    }
});

function salvarEdicaoEspaco() {
    const id = Number(document.getElementById('editar-espaco-id').value);
    const espacos = obterEspacosSistema();
    const espaco = espacos.find(e => Number(e.id) === id);
    if (!espaco) { mostrarToast('Erro', 'Espaço não encontrado.', 'erro'); return; }

    const nome = document.getElementById('editar-espaco-nome').value.trim();
    const area = document.getElementById('editar-espaco-area').value.trim();
    const ehSala = espaco.tipo === 'Sala de Reunião';
    const capacidadeTexto = ehSala ? document.getElementById('editar-espaco-capacidade').value.trim() : '';

    const faltando = [];
    if (!nome) faltando.push(document.getElementById('editar-espaco-nome'));
    if (ehSala && !capacidadeTexto) faltando.push(document.getElementById('editar-espaco-capacidade'));

    if (faltando.length) {
        faltando.forEach(marcarCampoInvalido);
        mostrarToast('Campos obrigatórios', 'Preencha todos os campos destacados.', 'erro');
        return;
    }

    if (nomeEspacoDuplicado(nome, espaco.id)) {
        marcarCampoInvalido(document.getElementById('editar-espaco-nome'));
        mostrarToast('Nome já existe', 'Já existe um espaço com esse nome.', 'erro');
        return;
    }

    const idReservaAntigo = identificadorReservaEspaco(espaco);

    if (ehSala) {
        const capacidaded = Number(capacidadeTexto);
        if (!capacidaded || capacidaded < 1 || capacidaded > 15) {
            marcarCampoInvalido(document.getElementById('editar-espaco-capacidade'));
            mostrarToast('Capacidade inválida', 'A capacidade deve ser entre 1 e 15.', 'erro');
            return;
        }
        const maxConvidados = maiorConvidadosReservasAtivas(idReservaAntigo);
        if (capacidaded < maxConvidados + 1) {
            marcarCampoInvalido(document.getElementById('editar-espaco-capacidade'));
            mostrarToast(
                'Capacidade insuficiente',
                `Há uma reserva ativa com ${maxConvidados} convidado(s) (precisa de ${maxConvidados + 1} lugares). Exclua a reserva ou aguarde a reunião ser feita antes de reduzir a capacidade.`,
                'erro'
            );
            return;
        }
        espaco.capacidade = capacidaded;
        espaco.recursos = document.getElementById('editar-espaco-recursos').value.trim() || '-';
    } else {
        espaco.capacidade = '-';
        espaco.recursos = '-';
    }

    const idNovoAntigo = identificadorReservaEspaco({ ...espaco, nome, area: area || '-' });

    function executarSalvamento(novaImagemBase64 = null) {
        espaco.nome = nome;
        espaco.area = area || '-';
        if (novaImagemBase64) espaco.imagem = novaImagemBase64;

        salvarEspacosSistema(espacos);
        atualizarIdentificadorReservas(idReservaAntigo, idNovoAntigo, espaco.tipo);
        carregarEspacosAdmin();
        mostrarToast('Espaço atualizado', `${espaco.nome} foi atualizado com sucesso.`, 'sucesso');
        document.getElementById('modal-editar-admin').close();

        const inputImagemEditar = document.getElementById('editar-imagem-espaco');
        if (inputImagemEditar) inputImagemEditar.value = '';
    }

    const imagemInput = document.getElementById('editar-imagem-espaco');
    if (imagemInput && imagemInput.files.length > 0) {
        comprimirImagem(imagemInput.files[0], executarSalvamento);
    } else {
        executarSalvamento();
    }
}

function identificadorReservaEspaco(espaco) {
    return espaco.tipo === 'Sala de Reunião'
        ? espaco.nome
        : `${espaco.nome} — ${espaco.area}`;
}

function atualizarIdentificadorReservas(idAntigo, idNovo, tipo) {
    if (idAntigo === idNovo) return;

    const reservasSistema = obterReservasSistema();
    let mudouSistema = false;
    reservasSistema.forEach(r => {
        if (r.espaco === idAntigo) { r.espaco = idNovo; mudouSistema = true; }
    });
    if (mudouSistema) salvarReservasSistema(reservasSistema);

    const ehSala = tipo === 'Sala de Reunião';
    const chave = ehSala ? 'reservasSalas' : 'reservasEstacoes';
    const campo = ehSala ? 'sala' : 'estacao';
    const especificas = JSON.parse(localStorage.getItem(chave) || '[]');
    let mudouEspecificas = false;
    especificas.forEach(r => {
        if (r[campo] === idAntigo) { r[campo] = idNovo; mudouEspecificas = true; }
    });
    if (mudouEspecificas) localStorage.setItem(chave, JSON.stringify(especificas));
}

function cancelarReservasDoEspaco(espaco, espacoFoiExcluido = false) {
    const identificador = identificadorReservaEspaco(espaco);
    const reservasSistema = obterReservasSistema();
    const afetadas = reservasSistema.filter(r => r.espaco === identificador && r.status === 'Confirmada');
    if (!afetadas.length) return 0;

    afetadas.forEach(r => {
        r.status = 'Cancelada';
        if (espacoFoiExcluido) {
            r.espacoExcluido = true;
            r.espacoIdExcluido = espaco.id;
            r.nomeEspacoExcluido = identificador;
        }
    });

    salvarReservasSistema(reservasSistema);
    return afetadas.length;
}

function alternarStatusEspaco(id) {
    const espacos = obterEspacosSistema();
    const espaco = espacos.find(e => Number(e.id) === Number(id));
    if (!espaco) { mostrarToast('Erro', 'Espaço não encontrado.', 'erro'); return; }

    const ativando = espaco.status === 'Inativo';
    espaco.status = ativando ? 'Ativo' : 'Inativo';
    salvarEspacosSistema(espacos);

    const canceladas = ativando ? 0 : cancelarReservasDoEspaco(espaco);
    carregarEspacosAdmin();

    mostrarToast(
        ativando ? 'Espaço ativado' : 'Espaço desativado',
        ativando
            ? `${espaco.nome} foi ativado com sucesso.`
            : `${espaco.nome} foi desativado.${canceladas ? ` ${canceladas} reserva(s) cancelada(s).` : ''}`,
        'sucesso'
    );
}

let idParaExcluir = null;

function abrirModalExcluirEspaco(id) {
    const espaco = obterEspacosSistema().find(e => Number(e.id) === Number(id));
    if (!espaco) { mostrarToast('Erro', 'Espaço não encontrado.', 'erro'); return; }

    idParaExcluir = Number(id);
    const nomeEl = document.getElementById('modal-excluir-espaco-nome');
    if (nomeEl) nomeEl.textContent = espaco.nome;
    document.getElementById('modal-excluir-espaco')?.showModal();
}

function excluirEspaco() {
    const espacos = obterEspacosSistema();
    const espaco = espacos.find(e => Number(e.id) === idParaExcluir);
    if (!espaco) { mostrarToast('Erro', 'Espaço não encontrado.', 'erro'); return; }

    const canceladas = cancelarReservasDoEspaco(espaco, true);
    salvarEspacosSistema(espacos.filter(e => Number(e.id) !== idParaExcluir));
    carregarEspacosAdmin();

    document.getElementById('modal-excluir-espaco')?.close();
    const modalEditar = document.getElementById('modal-editar-admin');
    if (modalEditar && modalEditar.open) modalEditar.close();

    idParaExcluir = null;
    mostrarToast(
        'Espaço excluído',
        `${espaco.nome} foi excluído.${canceladas ? ` ${canceladas} reserva(s) cancelada(s).` : ''}`,
        'sucesso'
    );
}

function limparFormularioCadastro() {
    ['cadastro-tipo-espaco', 'cadastro-nome-espaco', 'cadastro-capacidade-espaco',
        'cadastro-recursos-espaco', 'cadastro-area-espaco', 'cadastro-imagem-espaco']
        .forEach(id => { const c = document.getElementById(id); if (c) c.value = ''; });

    const status = document.getElementById('cadastro-status-espaco');
    if (status) status.value = 'Ativo';

    const nomeImagem = document.getElementById('nome-imagem-espaco');
    if (nomeImagem) nomeImagem.textContent = 'Escolher imagem...';

    const container = document.getElementById('previa-cadastro');
    const image = document.getElementById('previa-cadastro-imagem');
    if (container) container.style.display = 'none';
    if (image) image.src = '';
}

document.addEventListener('DOMContentLoaded', () => {
    criarEspacosPadrao();
    carregarEspacosAdmin();

    aplicarLimiteNomeEspaco(document.getElementById('cadastro-nome-espaco'));
    aplicarLimiteNomeEspaco(document.getElementById('editar-espaco-nome'));

    document.getElementById('btn-confirmar-excluir-espaco')?.addEventListener('click', excluirEspaco);

    const btnExcluirEditar = document.getElementById('btn-excluir-espaco-editar');
    if (btnExcluirEditar) {
        btnExcluirEditar.addEventListener('click', () => {
            const id = document.getElementById('editar-espaco-id').value;
            const modalEditar = document.getElementById('modal-editar-admin');
            if (modalEditar && modalEditar.open) modalEditar.close();
            setTimeout(() => abrirModalExcluirEspaco(id), 100);
        });
    }

    const modalEditar = document.getElementById('modal-editar-admin');
    const btnFecharEditar = document.getElementById('btn-fechar-editar-admin');
    const btnCancelarEditar = document.getElementById('btn-cancelar-editar-admin');
    const btnSalvarEditar = document.getElementById('btn-salvar-editar-admin');

    if (btnFecharEditar && modalEditar) btnFecharEditar.addEventListener('click', () => modalEditar.close());
    if (btnCancelarEditar && modalEditar) btnCancelarEditar.addEventListener('click', () => modalEditar.close());
    if (btnSalvarEditar) btnSalvarEditar.addEventListener('click', salvarEdicaoEspaco);

    const tipoCadastro = document.getElementById('cadastro-tipo-espaco');
    const grupoSalaCadastro = document.getElementById('grupo-sala-cadastro');
    const camposCadastro = document.getElementById('campos-cadastro-espaco');

    function atualizarCamposCadastro() {
        if (!tipoCadastro || !camposCadastro || !grupoSalaCadastro) return;
        if (tipoCadastro.value === 'Sala de Reunião') {
            camposCadastro.style.display = 'block';
            grupoSalaCadastro.style.display = 'flex';
        } else if (tipoCadastro.value === 'Estação de Trabalho') {
            camposCadastro.style.display = 'block';
            grupoSalaCadastro.style.setProperty('display', 'none', 'important');
        } else {
            camposCadastro.style.display = 'none';
            grupoSalaCadastro.style.setProperty('display', 'none', 'important');
        }
    }

    if (tipoCadastro) {
        tipoCadastro.addEventListener('change', atualizarCamposCadastro);
        atualizarCamposCadastro();
    }

    const btnConfirmarCadastro = document.getElementById('btn-confirmar-cadastro-espaco');
    if (btnConfirmarCadastro) {
        btnConfirmarCadastro.addEventListener('click', () => {
            const tipo = tipoCadastro.value;
            const nome = document.getElementById('cadastro-nome-espaco').value.trim();
            const capacidade = document.getElementById('cadastro-capacidade-espaco').value.trim();
            const recursos = document.getElementById('cadastro-recursos-espaco').value.trim();
            const area = document.getElementById('cadastro-area-espaco').value.trim();
            const status = document.getElementById('cadastro-status-espaco').value;
            const imagemInput = document.getElementById('cadastro-imagem-espaco');

            const faltando = [];
            if (!tipo) faltando.push(tipoCadastro);
            if (!nome) faltando.push(document.getElementById('cadastro-nome-espaco'));
            if (tipo === 'Sala de Reunião' && !capacidade) faltando.push(document.getElementById('cadastro-capacidade-espaco'));

            if (faltando.length) {
                faltando.forEach(marcarCampoInvalido);
                mostrarToast('Campos obrigatórios', 'Preencha todos os campos destacados.', 'erro');
                return;
            }

            if (tipo === 'Sala de Reunião') {
                const cap = Number(capacidade);
                if (!cap || cap < 1 || cap > 15) {
                    marcarCampoInvalido(document.getElementById('cadastro-capacidade-espaco'));
                    mostrarToast('Capacidade inválida', 'A capacidade deve ser entre 1 e 15.', 'erro');
                    return;
                }
            }

            if (nomeEspacoDuplicado(nome)) {
                marcarCampoInvalido(document.getElementById('cadastro-nome-espaco'));
                mostrarToast('Nome já existe', 'Já existe um espaço com esse nome.', 'erro');
                return;
            }

            function salvarNovoEspaco(imagemBase64 = '') {
                const espacos = obterEspacosSistema();
                const imagemFinal = imagemBase64 || (tipo === 'Sala de Reunião' ? 'assets/images/sala1.png' : 'assets/images/Mesa 01.png');
                espacos.push({
                    id: Date.now(),
                    tipo,
                    nome,
                    capacidade: tipo === 'Sala de Reunião' ? Number(capacidade) : '-',
                    recursos: tipo === 'Sala de Reunião' ? recursos || '-' : '-',
                    area: area || '-',
                    status,
                    imagem: imagemFinal
                });
                salvarEspacosSistema(espacos);
                carregarEspacosAdmin();
                mostrarToast('Espaço cadastrado', `${nome} foi cadastrado com sucesso.`, 'sucesso');
                document.getElementById('modal-cadastrar-espaco')?.close();
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

document.addEventListener('click', event => {
    const botaoToggle = event.target.closest('.btn-toggle-espaco');
    const botaoEditar = event.target.closest('.btn-editar-espaco');

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
    }
});