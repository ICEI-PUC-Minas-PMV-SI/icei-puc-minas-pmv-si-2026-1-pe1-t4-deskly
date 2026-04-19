# Especificações do Projeto

A especificação do projeto Deskly tem como objetivo definir o problema identificado e a solução proposta sob a perspectiva do usuário. Para isso, foram utilizadas técnicas como definição de personas, criação de histórias de usuário e levantamento de requisitos funcionais e não funcionais.

Essas etapas permitem compreender as necessidades dos usuários e garantir que o sistema atenda aos objetivos propostos, oferecendo uma solução eficiente para o gerenciamento de reservas de espaços corporativos.

---

## Personas

### Persona 1 – Usuário comum

Mariana Souza tem 29 anos, é analista administrativa em uma empresa de médio porte e utiliza frequentemente salas de reunião para encontros com sua equipe. Ela possui uma rotina dinâmica e precisa organizar seus compromissos com rapidez. Mariana busca uma ferramenta prática que permita visualizar horários disponíveis e realizar reservas sem complicações, evitando conflitos de agenda.

---

### Persona 2 – Colaborador híbrido

Lucas Ferreira tem 34 anos, trabalha no modelo híbrido e utiliza estações de trabalho apenas nos dias em que vai presencialmente à empresa. Ele precisa garantir um espaço disponível antes de se deslocar até o escritório. Lucas valoriza uma plataforma que permita reservar mesas com antecedência e visualizar a disponibilidade de forma clara.

---

### Persona 3 – Administrador do sistema

Carlos Mendes tem 40 anos e é gerente administrativo responsável pela organização dos espaços da empresa. Ele precisa controlar o uso das salas e estações, gerenciar usuários e garantir o funcionamento adequado do sistema.

---

## Histórias de Usuários

Com base nas personas identificadas, foram definidas as seguintes histórias de usuários:

| EU COMO... | QUERO/PRECISO... | PARA... |
|------------|------------------|--------|
| Usuário do sistema | Visualizar disponibilidade de espaços | Planejar meus compromissos |
| Usuário do sistema | Realizar reservas | Garantir um espaço disponível |
| Usuário do sistema | Editar ou cancelar reservas | Ajustar minha agenda |
| Usuário do sistema | Adicionar convidados | Organizar reuniões |
| Usuário do sistema | Visualizar minhas reservas | Acompanhar meus agendamentos |
| Administrador | Gerenciar espaços | Controlar ambientes disponíveis |
| Administrador | Gerenciar usuários | Controlar o acesso ao sistema |
| Administrador | Visualizar todas as reservas | Garantir organização |

---

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais do sistema Deskly.

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RF-01 | O sistema deve permitir ao administrador cadastrar, editar, excluir e desativar espaços | ALTA |
| RF-02 | O sistema deve permitir ao administrador cadastrar e remover usuários | ALTA |
| RF-03 | O sistema deve permitir autenticação de usuários (login) | ALTA |
| RF-04 | O sistema deve permitir visualizar e agendar espaços por data e horário | ALTA |
| RF-05 | O sistema deve permitir visualizar, editar e cancelar reservas | ALTA |
| RF-06 | O sistema deve permitir ao administrador visualizar e controlar todas as reservas | ALTA |
| RF-07 | O sistema deve exibir detalhes dos espaços | MÉDIA |
| RF-08 | O sistema deve permitir adicionar convidados | MÉDIA |
| RF-09 | O sistema deve permitir visualizar convidados | MÉDIA |
| RF-10 | O sistema pode permitir favoritar espaços | BAIXA |

---

### Requisitos Não Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RNF-01 | O sistema deve garantir autenticação segura com criptografia de senhas | ALTA |
| RNF-02 | O sistema deve possuir controle de acesso por tipo de usuário | ALTA |
| RNF-03 | O sistema deve garantir a integridade dos dados | ALTA |
| RNF-06 | O sistema deve responder às requisições com agilidade | MÉDIA |
| RNF-07 | O sistema deve ser responsivo | ALTA |
| RNF-08 | O sistema deve suportar múltiplos usuários | MÉDIA |
| RNF-10 | O sistema deve ser compatível com navegadores modernos | ALTA |
| RNF-11 | O sistema deve permitir realizar reservas em no máximo 5 passos | ALTA |
| RNF-13 | O sistema deve possuir código modular | MÉDIA |

---

## Restrições

O projeto Deskly está sujeito às seguintes restrições:

| ID | Restrição |
|----|-----------|
| 01 | O projeto deve ser entregue dentro do prazo definido pela disciplina |
| 02 | O sistema deve ser desenvolvido utilizando HTML, CSS, PHP e MySQL |
| 03 | O escopo do sistema está limitado aos requisitos definidos no projeto |

---