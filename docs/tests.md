# Testes

Neste projeto serão realizados dois tipos de testes:

 - O **Teste de Software**, que utiliza uma abordagem de caixa preta, e tem por objetivo verificar a conformidade do software com os requisitos funcionais e não funcionais do sistema.
 - O **Teste de Usabilidade**, que busca avaliar a qualidade do uso do sistema por um usuário do público alvo.

Se quiser conhecer um pouco mais sobre os tipos de teste de software, leia o documento [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/).

A documentação dos testes é dividida nas seguintes seções:

 - [Plano de Testes de Software](#plano-de-testes-de-software)
 - [Registro dos Testes de Software](#registro-dos-testes-de-software)
 - [Avaliação dos Testes de Software](#avaliação-dos-testes-de-software)
 - [Cenários de Teste de Usabilidade](#cenários-de-teste-de-usabilidade)
 - [Registro dos Testes de Usabilidade](#registro-dos-testes-de-usabilidade)
 - [Avaliação dos Testes de Usabilidade](#avaliação-dos-testes-de-usabilidade)

# Teste de Software

Os testes de software do Deskly adotam a abordagem de **caixa preta**, na qual o comportamento do sistema é verificado a partir das entradas fornecidas e das saídas observadas, sem necessidade de conhecimento da estrutura interna do código. Cada caso de teste é associado a um ou mais requisitos funcionais (RF) ou não funcionais (RNF) levantados na especificação do projeto.

## Plano de Testes de Software

---

**Caso de Teste** | **CT01 – Autenticação de usuário cadastrado**
 :--------------: | ------------
**Procedimento**  | 1) Acesse a página `login.html` <br> 2) Informe um e-mail e senha previamente cadastrados no sistema <br> 3) Clique no botão "Entrar"
**Requisitos associados** | RF-03, RNF-01, RNF-02
**Resultado esperado** | Redirecionamento para o `dashboard.html` com sessão iniciada no `localStorage` e acesso concedido conforme o perfil (usuário ou admin)
**Dados de entrada** | E-mail e senha válidos de um usuário existente
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT02 – Bloqueio de login com credenciais inválidas**
 :--------------: | ------------
**Procedimento**  | 1) Acesse a página `login.html` <br> 2) Informe um e-mail inexistente ou uma senha incorreta <br> 3) Clique no botão "Entrar"
**Requisitos associados** | RF-03, RNF-01
**Resultado esperado** | Exibição de mensagem de erro (toast) informando credenciais inválidas, sem redirecionamento
**Dados de entrada** | E-mail inexistente ou senha incorreta
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT03 – Primeiro acesso via convite**
 :--------------: | ------------
**Procedimento**  | 1) Acesse `primeiro-acesso.html?token=<token_valido>` <br> 2) Verifique que o campo de e-mail aparece preenchido automaticamente <br> 3) Defina uma senha respeitando os critérios de força exibidos pelo indicador <br> 4) Clique em "Confirmar"
**Requisitos associados** | RF-02, RF-03, RNF-01
**Resultado esperado** | Conta ativada, senha salva com hash no `localStorage` e redirecionamento para `login.html`
**Dados de entrada** | Token de convite válido, senha com força mínima satisfeita
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT04 – Cadastro de espaço pelo administrador**
 :--------------: | ------------
**Procedimento**  | 1) Faça login como administrador <br> 2) Acesse `painelAdmin.html` e vá para a aba "Espaços" <br> 3) Preencha o formulário de novo espaço (nome, tipo, capacidade, localização, recursos e imagem) <br> 4) Clique em "Salvar"
**Requisitos associados** | RF-01
**Resultado esperado** | Novo espaço listado na tabela de espaços, com status "Ativo" e imagem comprimida armazenada no `localStorage`
**Dados de entrada** | Dados válidos do espaço e arquivo de imagem
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT05 – Edição e desativação de espaço**
 :--------------: | ------------
**Procedimento**  | 1) No painel admin, aba "Espaços", clique no ícone de edição de um espaço existente <br> 2) Altere o campo de capacidade e clique em "Salvar" <br> 3) Em seguida, clique no botão de alternância de status para desativar o espaço
**Requisitos associados** | RF-01
**Resultado esperado** | Capacidade atualizada na listagem; espaço passa a exibir status "Inativo" e não aparece como disponível para reservas
**Dados de entrada** | Novo valor de capacidade; ação de desativação
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT06 – Convite de usuário por e-mail**
 :--------------: | ------------
**Procedimento**  | 1) No painel admin, aba "Usuários", clique em "Convidar usuário" <br> 2) Informe o e-mail do convidado <br> 3) Clique em "Enviar convite"
**Requisitos associados** | RF-02, RNF-14
**Resultado esperado** | Token gerado e armazenado no `localStorage`; e-mail disparado via API do EmailJS com link de primeiro acesso
**Dados de entrada** | E-mail válido de um novo usuário
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT07 – Visualização e filtragem de salas disponíveis**
 :--------------: | ------------
**Procedimento**  | 1) Faça login como usuário <br> 2) Acesse `salas-reuniao.html` <br> 3) Selecione uma data, horário de início, horário de fim e capacidade mínima <br> 4) Clique em "Filtrar"
**Requisitos associados** | RF-04, RF-07
**Resultado esperado** | Exibição apenas das salas ativas que possuem capacidade suficiente e sem conflito de horário no período selecionado
**Dados de entrada** | Data futura, intervalo de horário válido, capacidade desejada
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT08 – Reserva de sala de reunião**
 :--------------: | ------------
**Procedimento**  | 1) Em `salas-reuniao.html`, após filtrar as salas, clique em "Reservar" em um card disponível <br> 2) Revise os dados no modal de confirmação <br> 3) Clique em "Confirmar reserva"
**Requisitos associados** | RF-04, RNF-03, RNF-11
**Resultado esperado** | Reserva criada com status "Ativo" no `localStorage`; sala removida dos resultados disponíveis para o mesmo período; notificação de confirmação exibida
**Dados de entrada** | Sala disponível, data e horário sem conflito
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT09 – Detecção de conflito de horário**
 :--------------: | ------------
**Procedimento**  | 1) Tente reservar a mesma sala no mesmo dia e horário em que já existe uma reserva ativa <br> 2) Confirme a reserva no modal
**Requisitos associados** | RF-04, RNF-03
**Resultado esperado** | Sistema exibe mensagem de conflito e impede a criação da reserva duplicada; a função `horariosConflitam()` em `salas-reuniao.js` retorna verdadeiro e bloqueia o salvamento
**Dados de entrada** | Sala, data e intervalo de horário já ocupados por outra reserva
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT10 – Reserva de estação de trabalho**
 :--------------: | ------------
**Procedimento**  | 1) Acesse `estacoes.html` <br> 2) Selecione data e horário <br> 3) Clique em "Reservar" em uma estação disponível e confirme
**Requisitos associados** | RF-04, RNF-03
**Resultado esperado** | Reserva de estação criada com sucesso; estação passa a exibir status "Ocupada" para o período selecionado
**Dados de entrada** | Data futura, intervalo de horário válido, estação ativa
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT11 – Adição de convidados a uma reserva**
 :--------------: | ------------
**Procedimento**  | 1) Ao criar ou editar uma reserva de sala de reunião, acesse a seção de convidados no modal <br> 2) Selecione usuários da lista gerada por `popularSelectConvidadosReserva()` <br> 3) Confirme a reserva
**Requisitos associados** | RF-08, RF-09
**Resultado esperado** | Convidados salvos na reserva; limite máximo de convidados respeitado automaticamente com base na capacidade da sala (função `verificarCapacidade()`); notificação de convite gerada para cada convidado
**Dados de entrada** | Seleção de usuários dentro do limite de capacidade
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT12 – Visualização do status de convidados**
 :--------------: | ------------
**Procedimento**  | 1) Acesse `minhas-reservas.html` <br> 2) Clique em "Ver convidados" em uma reserva de sala de reunião que possui convidados
**Requisitos associados** | RF-09
**Resultado esperado** | Modal exibe lista de convidados com status individualizado: "Pendente", "Aceito" ou "Recusado", renderizado pela função `renderizarConvidadosReserva()`
**Dados de entrada** | Reserva com ao menos um convidado cadastrado
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT13 – Edição de reserva pelo usuário**
 :--------------: | ------------
**Procedimento**  | 1) Acesse `minhas-reservas.html` <br> 2) Clique em "Editar" em uma reserva futura <br> 3) Altere o horário de fim <br> 4) Clique em "Salvar alterações"
**Requisitos associados** | RF-05, RNF-03
**Resultado esperado** | Reserva atualizada no `localStorage` sem conflito; nova informação refletida imediatamente na listagem
**Dados de entrada** | Novo horário de fim que não gere conflito com outra reserva
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT14 – Cancelamento de reserva pelo usuário**
 :--------------: | ------------
**Procedimento**  | 1) Em `minhas-reservas.html`, clique em "Cancelar" em uma reserva ativa <br> 2) Confirme a ação no modal de confirmação
**Requisitos associados** | RF-05
**Resultado esperado** | Reserva muda de status para "Cancelada"; espaço fica disponível para o mesmo período; reserva movida para a aba de histórico
**Dados de entrada** | Reserva ativa do usuário logado
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT15 – Gerenciamento de reservas pelo administrador**
 :--------------: | ------------
**Procedimento**  | 1) Faça login como administrador <br> 2) Acesse `painelAdmin.html`, aba "Reservas" <br> 3) Localize uma reserva de outro usuário e clique em "Excluir" <br> 4) Confirme a exclusão
**Requisitos associados** | RF-06
**Resultado esperado** | Reserva removida da listagem do painel admin; espaço liberado para o período correspondente
**Dados de entrada** | Reserva ativa de qualquer usuário do sistema
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT16 – Visualização do calendário de reservas**
 :--------------: | ------------
**Procedimento**  | 1) Acesse `calendario.html` <br> 2) Navegue entre os meses usando os botões de anterior e próximo <br> 3) Clique em um dia que possua reservas
**Requisitos associados** | RF-04, RF-05
**Resultado esperado** | Calendário renderizado pela função `renderCalendar()` exibe marcadores nos dias com reservas; ao clicar em um dia, são exibidos os detalhes das reservas daquela data
**Dados de entrada** | Mês com ao menos uma reserva registrada
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT17 – Responsividade da interface**
 :--------------: | ------------
**Procedimento**  | 1) Acesse as páginas `dashboard.html`, `salas-reuniao.html` e `painelAdmin.html` em um dispositivo móvel (ou com largura de tela abaixo de 768px) <br> 2) Verifique o menu hambúrguer e a reorganização dos elementos
**Requisitos associados** | RNF-07
**Resultado esperado** | Menu hambúrguer exibido e funcional; cards e tabelas se adaptam à tela sem quebra de layout; logo alternada pela função `trocarLogo()` de `menu.js`
**Dados de entrada** | Viewport de 375px (mobile) e 768px (tablet)
**Resultado obtido** | Sucesso

---

**Caso de Teste** | **CT18 – Controle de acesso por perfil**
 :--------------: | ------------
**Procedimento**  | 1) Faça login como usuário comum <br> 2) Tente acessar diretamente `painelAdmin.html` pela barra de endereços
**Requisitos associados** | RNF-02
**Resultado esperado** | Redirecionamento para `dashboard.html` ou `login.html`; menu lateral não exibe o link "Painel Admin" para perfis não-administradores
**Dados de entrada** | Sessão de usuário com perfil "usuario"
**Resultado obtido** | Sucesso

---

## Registro dos Testes de Software

| *Gravação* | *GR01 – Login, bloqueio de acesso e primeiro acesso via convite* |
|---|---|
| Casos de Teste cobertos | CT01, CT02, CT03 |
| Requisitos Associados | RF-02, RF-03, RNF-01, RNF-02 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1-IZsF-UaXEiQRn4CSp9IdO-6dt7CCYcb/view?usp=drive_link |

| *Gravação* | *GR02 – Cadastro, edição, desativação de espaço e convite de usuário* |
|---|---|
| Casos de Teste cobertos | CT04, CT05, CT06 |
| Requisitos Associados | RF-01, RF-02, RNF-14 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1qt1qQPs7UiYn9RAh03un9IEf6K10qJpV/view?usp=drive_link |

| *Gravação* | *GR03 – Filtragem de salas, reserva de sala e detecção de conflito de horário* |
|---|---|
| Casos de Teste cobertos | CT07, CT08, CT09 |
| Requisitos Associados | RF-04, RF-07, RNF-03, RNF-11 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1S67uJYAu12DdnEGwZt_BKWXdubN7-0SK/view?usp=drive_link |

| *Gravação* | *GR04 – Reserva de estação de trabalho, adição e visualização de convidados* |
|---|---|
| Casos de Teste cobertos | CT10, CT11, CT12 |
| Requisitos Associados | RF-04, RF-08, RF-09, RNF-03 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1M3z-M8aRPU30TuOqzykdEu9c8aLkHZQM/view?usp=drive_link |

| *Gravação* | *GR05 – Edição e cancelamento de reserva e visualização no calendário* |
|---|---|
| Casos de Teste cobertos | CT13, CT14, CT16 |
| Requisitos Associados | RF-04, RF-05, RNF-03 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1Gt2M_TAv3To-fWRTFEvPKqfqWKQke0_q/view?usp=drive_link |

| *Gravação* | *GR06 – Gerenciamento de todas as reservas pelo administrador* |
|---|---|
| Casos de Teste cobertos | CT15 |
| Requisitos Associados | RF-06 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/1tNYBid-oi9jkiKR1jJNJZ6jlo75z5XLl/view?usp=drive_link |

| *Gravação* | *GR07 – Responsividade da interface e controle de acesso por perfil* |
|---|---|
| Casos de Teste cobertos | CT17, CT18 |
| Requisitos Associados | RNF-02, RNF-07 |
| Link do vídeo do teste realizado: https://drive.google.com/file/d/181tmhlges5LAk51bbK2Mul6wz3PWcwEN/view?usp=drive_link |

---

## Avaliação dos Testes de Software

A execução dos casos de teste revelou que o Deskly atende de forma consistente aos requisitos funcionais prioritários. Os fluxos de autenticação (CT01, CT02), criação de reservas (CT08, CT10) e cancelamento (CT14) se mostraram robustos, sem comportamentos inesperados durante a validação manual. O mecanismo de detecção de conflito de horário, implementado na função `horariosConflitam()` em `salas-reuniao.js`, funcionou corretamente em todos os cenários testados, impedindo sobreposições de reservas para o mesmo espaço.

**Pontos fortes identificados:**
- Fluxo de convite por token (CT03 e CT06) garante que somente usuários convidados pelo administrador consigam ativar suas contas, fortalecendo o controle de acesso.
- A gestão de convidados com limite automático baseado na capacidade da sala (CT11) elimina a necessidade de validação manual pelo usuário.
- A interface responsiva (CT17) funcionou corretamente nas principais larguras de tela testadas, com o menu hambúrguer e a alternância de logo operando conforme esperado.
- O controle de perfil (CT18) impediu efetivamente o acesso de usuários comuns ao painel administrativo.

**Oportunidades de evolução identificadas:**
- Para versões futuras, recomenda-se adicionar uma mensagem de feedback visual mais explícita no fluxo de convite por e-mail, orientando o administrador sobre o status do envio.
- A implementação de exportação/importação de dados em JSON pode ser considerada como mecanismo de backup complementar nas próximas iterações do sistema.

---

## Testes de Unidade Automatizados (Opcional)

O Deskly expõe diversas funções JavaScript passíveis de teste unitário automatizado, como `horariosConflitam()` (detecção de conflitos de horário em `salas-reuniao.js`), `avaliarForca()` (validação de força de senha em `primeiro-acesso.js`), `parsearData()` e `ehHoje()` (manipulação de datas em `dashboard.js`), além de `comprimirImagem()` (redução de imagens em `painelAdminEspacos.js`). Frameworks como **Jest** ou **Vitest** podem ser integrados ao projeto para validar essas funções de forma isolada e repetível. Para mais informações, consulte o documento [Ferramentas de Teste para JavaScript](https://geekflare.com/javascript-unit-testing/).

---

# Testes de Usabilidade

O objetivo do Plano de Testes de Usabilidade é obter informações quanto à expectativa dos usuários em relação à funcionalidade da aplicação de forma geral.

Para tanto, foram elaborados quatro cenários, cada um baseado nas histórias de usuário definidas na especificação do projeto (personas Mariana Souza, Lucas Ferreira e Carlos Mendes). Foram convidadas quatro pessoas cujos perfis se encaixam nas definições das personas documentadas, visando averiguar os seguintes indicadores:

**Taxa de sucesso:** responde se o usuário conseguiu ou não executar a tarefa proposta.

**Satisfação subjetiva:** responde como o usuário avalia o sistema com relação à execução da tarefa proposta, conforme a seguinte escala:

1. Péssimo;
2. Ruim;
3. Regular;
4. Bom;
5. Ótimo.

**Tempo para conclusão da tarefa:** em segundos, e em comparação com o tempo utilizado quando um especialista (desenvolvedor) realiza a mesma tarefa.

Objetivando respeitar as diretrizes da Lei Geral de Proteção de Dados, as informações pessoais dos usuários que participaram do teste não foram coletadas, tendo em vista a ausência de Termo de Consentimento Livre e Esclarecido.

As sessões de teste foram realizadas com auxílio de ferramentas de gravação de tela para registro das interações, e os usuários receberam apenas a descrição do cenário, sem orientações sobre como navegar pelo sistema. A ferramenta [Maze](https://maze.design/) e o protocolo de observação presencial foram utilizados como apoio à coleta de métricas.

> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)

---

## Cenários de Teste de Usabilidade

| Nº do Cenário | Descrição do cenário |
|---------------|----------------------|
| 1 | Você acabou de receber um convite para acessar o Deskly pela primeira vez. Acesse o link do convite, defina sua senha e faça login no sistema. |
| 2 | Você precisa reservar uma sala de reunião para amanhã, das 14h às 16h, com capacidade para pelo menos 5 pessoas. Encontre uma sala disponível e conclua a reserva. |
| 3 | Você quer convidar dois colegas para participar de uma reunião que já reservou. Adicione-os como convidados na reserva existente. |
| 4 | Você é o administrador do sistema e precisa cadastrar uma nova sala de reunião chamada "Sala Inovação", com capacidade para 10 pessoas, localizada no 3º andar. |

---

## Registro de Testes de Usabilidade

**Cenário 1:** Você acabou de receber um convite para acessar o Deskly pela primeira vez. Acesse o link do convite, defina sua senha e faça login no sistema.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 42.30 segundos                  |
| 2       | SIM             | 4                    | 55.18 segundos                  |
| 3       | SIM             | 5                    | 38.74 segundos                  |
| 4       | SIM             | 4                    | 61.02 segundos                  |
|         |                 |                      |                                 |
| **Média** | 100% | 4.5 | 49.31 segundos |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 14.20 segundos |

> Comentários dos usuários: O indicador de força de senha ajudou bastante a entender o que era esperado. Um usuário sentiu falta de um botão "reenviar convite" caso o link expirasse.

---

**Cenário 2:** Você precisa reservar uma sala de reunião para amanhã, das 14h às 16h, com capacidade para pelo menos 5 pessoas. Encontre uma sala disponível e conclua a reserva.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 34.56 segundos                  |
| 2       | SIM             | 5                    | 28.41 segundos                  |
| 3       | SIM             | 4                    | 47.83 segundos                  |
| 4       | SIM             | 4                    | 52.10 segundos                  |
|         |                 |                      |                                 |
| **Média** | 100% | 4.5 | 40.73 segundos |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 11.40 segundos |

> Comentários dos usuários: Os filtros de data e horário foram considerados intuitivos e fáceis de usar. Os usuários destacaram que o fluxo de reserva é direto e rápido.

---

**Cenário 3:** Você quer convidar dois colegas para participar de uma reunião que já reservou. Adicione-os como convidados na reserva existente.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 4                    | 58.22 segundos                  |
| 2       | SIM             | 4                    | 72.10 segundos                  |
| 3       | SIM             | 4                    | 80.35 segundos                  |
| 4       | SIM             | 4                    | 65.47 segundos                  |
|         |                 |                      |                                 |
| **Média** | 100% | 4 | 69.04 segundos |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 18.30 segundos |

> Comentários dos usuários: Os usuários conseguiram localizar a funcionalidade de convidados pela tela "Minhas Reservas". Sugeriram que um atalho direto para gerenciamento de convidados tornaria o fluxo ainda mais ágil.

---

**Cenário 4:** Você é o administrador do sistema e precisa cadastrar uma nova sala de reunião chamada "Sala Inovação", com capacidade para 10 pessoas, localizada no 3º andar.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 39.14 segundos                  |
| 2       | SIM             | 5                    | 44.60 segundos                  |
| 3       | SIM             | 4                    | 51.33 segundos                  |
| 4       | SIM             | 5                    | 36.88 segundos                  |
|         |                 |                      |                                 |
| **Média** | 100% | 4.75 | 42.99 segundos |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 16.50 segundos |

> Comentários dos usuários: O formulário de cadastro de espaço foi considerado claro e bem organizado. Um usuário sugeriu a adição de uma pré-visualização da imagem antes de salvar o espaço.

---

## Avaliação dos Testes de Usabilidade

Tomando como base os resultados obtidos, foi possível verificar que o Deskly apresenta bons resultados de usabilidade nos fluxos centrais da aplicação. Os cenários de primeiro acesso (Cenário 1) e cadastro de espaço pelo administrador (Cenário 4) atingiram taxa de sucesso de 100%, com satisfação subjetiva média de 4,5 e 4,75, respectivamente — indicando que esses fluxos estão bem estruturados e alinhados com a expectativa dos usuários.

Os quatro cenários atingiram taxa de sucesso de 100%, confirmando que os fluxos principais da aplicação estão bem estruturados e acessíveis para usuários com perfis variados.

Com relação ao tempo de conclusão, a discrepância entre usuários comuns e o especialista é esperada — o desenvolvedor conhece de antemão a arquitetura de navegação e a localização dos elementos. Essa diferença não compromete a usabilidade, sendo natural em qualquer sistema de gestão corporativa.

**Melhorias planejadas para as próximas iterações:**
- Adicionar um atalho direto para gerenciamento de convidados a partir do dashboard, tornando o fluxo ainda mais ágil.
- Adicionar pré-visualização de imagem no formulário de cadastro de espaço no painel admin.
- Implementar mensagem orientativa no fluxo de primeiro acesso caso o token seja inválido ou expirado, com opção de solicitar novo convite ao administrador.
