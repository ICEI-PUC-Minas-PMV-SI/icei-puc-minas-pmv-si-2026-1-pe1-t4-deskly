
# Projeto de Interface

A interface do Deskly foi projetada com foco na organização e facilidade de uso, atendendo tanto colaboradores quanto administradores. A navegação permite que os usuários realizem tarefas como visualizar salas, fazer reservas e gerenciar convidados de forma ágil.

As telas foram desenvolvidas com base nas histórias de usuário, garantindo um fluxo eficiente para ações como o agendamento de salas. O sistema também é responsivo, apresenta bom desempenho e organiza as informações de forma clara, facilitando a tomada de decisão.

## User Flow

O fluxo de usuário do Deskly representa os caminhos desde o login até a execução das principais ações do sistema, como consultas, reservas e gerenciamento.

Após o acesso, o usuário navega entre as funcionalidades disponíveis de forma direta. Já os administradores possuem acessos adicionais para controle de salas, usuários e reservas. O fluxo foi estruturado para evitar etapas desnecessárias e tornar a navegação mais objetiva.

![User Flow Deskly](img/UserFlow-Deskly.png)

## Wireframes

Os wireframes do Deskly apresentam a estrutura das telas e a disposição dos elementos da interface, como menus, botões e campos de informação.

Eles foram utilizados para definir o layout e a relação entre as páginas, garantindo que cada funcionalidade do sistema esteja bem posicionada e alinhada aos requisitos do projeto.

## Tela de Login

(Resumo sobre a tela)

![Wire Frame Login](img/WireFrame-Login.png)

## Tela Inicial (Dashboard)

A tela inicial apresenta um menu lateral com acesso às principais funcionalidades do sistema, como calendário, salas de reunião, estações de trabalho e reservas. No topo, há uma barra de navegação com informações do usuário e notificações. A área central organiza os conteúdos de forma clara para navegação. Nesta tela, são atendidos os requisitos de acesso rápido às funcionalidades e organização do sistema.

![Wire Frame Inicial](img/WireFrame-Inicial.png)

### Modal - Tela Inicial (Dashboard)

O modal permite ao usuário realizar uma nova reserva de forma rápida, informando dados como tipo de espaço, data e horário.

![Wire Frame Modal - Inicial](img/ModalInicial.png)

## Tela de Calendário

A tela de calendário permite ao usuário visualizar a disponibilidade dos espaços ao longo dos dias e horários. A interface apresenta um calendário interativo, facilitando a identificação de períodos livres e ocupados. Nesta tela, são atendidos os requisitos de visualização de disponibilidade e apoio ao planejamento de reservas.

![Wire Frame Calendário](img/WireFrame-Calendário.png)

### Modais - Tela de Calendário

Os modais do calendário permitem visualizar detalhes de reservas em horários específicos e iniciar novas reservas diretamente pela visualização do calendário. Eles facilitam o acesso às informações sem interromper a navegação.

<p align="center">
  <img src="img/ModalCalendario1.png" width="45%">
  <img src="img/ModalCalendario2.png" width="45%">
</p>

## Tela de Salas de Reunião

A tela de salas de reunião apresenta um menu lateral para navegação e filtros por data, horário e capacidade no topo. A área central exibe a lista de salas com informações como nome, capacidade, recursos e status.

![Wire Frame Salas de Reunião](img/WireFrame-SalasReuniao.png)

### Modais - Tela de Salas de Reunião

Por meio de modais, o usuário pode visualizar detalhes da sala, incluindo horários ocupados, e realizar reservas informando data, horário e convidados, respeitando o limite de capacidade. Nesta tela, são atendidos os requisitos de visualização, detalhamento e reserva de salas.

<p align="center">
  <img src="img/ModalSalasReuniao1.png" width="45%">
  <img src="img/ModalSalasReuniao2.png" width="45%">
</p>

## Tela de Estações de Trabalho

A tela de estações de trabalho permite ao usuário visualizar e reservar espaços individuais disponíveis. A interface apresenta uma lista organizada com status dos espaços e opções de ação.

![Wire Frame Estações de Trabalho](img/WireFrame-Estacoes.png)

### Modal - Tela de Estações de Trabalho

O modal permite visualizar detalhes do espaço selecionado e realizar reservas informando data e horário. Ele também exibe o status do espaço, facilitando a tomada de decisão do usuário.

![Wire Frame Modal - Estações de Trabalho](img/ModalEstações.png)

## Tela de Minhas Reservas

A tela de minhas reservas apresenta ao usuário a lista de reservas realizadas, permitindo visualizar, editar ou cancelar agendamentos. A interface organiza as informações de forma clara, facilitando o gerenciamento das reservas. Nesta tela, são atendidos os requisitos de controle e gerenciamento de reservas pelo usuário.

![Wire Frame Minhas Reservas](img/WireFrame-Reservas.png)

### Modais - Tela de Minhas Reservas

Os modais permitem visualizar detalhes da reserva, editar informações como data e horário, e confirmar o cancelamento. Também são utilizados para confirmar ações realizadas pelo usuário.

<p align="center">
  <img src="img/ModalMinhasReservas1.png" width="45%">
  <img src="img/ModalMinhasReservas2.png" width="45%">
</p>
<p align="center">
  <img src="img/ModalMinhasReservas3.png" width="50%">
</p>

## Tela Painel Admin (Todas as Reservas)

A tela de todas as reservas apresenta uma visão geral dos agendamentos realizados no sistema. A interface organiza as reservas em formato de lista ou tabela, permitindo ao administrador acompanhar e controlar o uso dos espaços.

![Wire Frame Painel Admin - Todas as Reservas](img/WireFrame-PainelAdmin1.png)


### Modal - Tela Painel Admin (Todas as Reservas)

O modal permite visualizar detalhes da reserva selecionada e realizar ações como edição ou exclusão, auxiliando no controle administrativo.

![Wire Frame Modal - Painel Admin (Todas as Reservas)](img/ModalPainelAdmin1.png)

## Tela Painel Admin (Espaços)

A tela de espaços permite ao administrador visualizar, cadastrar e gerenciar salas e estações de trabalho. As informações são apresentadas de forma organizada, facilitando o controle dos ambientes disponíveis.

![Wire Frame Painel Admin - Espaços](img/WireFrame-PainelAdmin2.png)

### Modais - Tela Painel Admin (Espaços)

Os modais permitem cadastrar novos espaços, editar informações como capacidade e recursos, e confirmar exclusões ou alterações. Também possibilitam ativar ou desativar espaços conforme necessário.

<p align="center">
  <img src="img/ModalPainelAdmin2.png" width="45%">
  <img src="img/ModalPainelAdmin3.png" width="45%">
</p>
<p align="center">
  <img src="img/ModalPainelAdmin4.png" width="45%">
  <img src="img/ModalPainelAdmin5.png" width="45%">
</p>

## Tela Painel Admin (Usuários)

A tela de usuários permite ao administrador visualizar e gerenciar os usuários do sistema, controlando o acesso e organização da equipe.

![Wire Frame Painel Admin - Usuários](img/WireFrame-PainelAdmin3.png)

### Modais - Tela Painel Admin (Usuários)

Os modais permitem cadastrar novos usuários, editar informações e remover usuários do sistema. Também são utilizados para confirmação de ações, garantindo maior controle e segurança.

<p align="center">
  <img src="img/ModalPainelAdmin6.png" width="45%">
  <img src="img/ModalPainelAdmin7.png" width="45%">
</p>

