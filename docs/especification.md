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

Com base na análise das personas, foram identificadas as seguintes histórias de usuários:

| EU COMO... | QUERO/DESEJO... | PARA... |
|------------|-----------------|--------|
| Usuário | Visualizar todas as salas disponíveis em determinado dia e horário | Escolher qual posso reservar |
| Usuário | Visualizar detalhes das salas (capacidade, recursos) | Escolher a mais adequada |
| Usuário | Reservar uma sala informando data e horário e receber confirmação | Garantir meu uso do espaço |
| Usuário | Cancelar uma reserva | Liberar a sala caso eu não vá utilizá-la |
| Usuário | Visualizar minhas reservas | Gerenciá-las |
| Usuário | Gerenciar convidados da reserva (adicionar e remover) | Organizar a reunião |
| Usuário | Visualizar a lista de convidados e seu status (aceito/recusado) | Planejar melhor a reunião |
| Usuário | Ter limite automático de convidados conforme a capacidade da sala | Evitar superlotação |
| Usuário | Criar uma conta no sistema | Acessar a plataforma |
| Usuário | Fazer login no sistema | Acessar minhas funcionalidades |
| Usuário | Visualizar os membros da empresa | Saber com quem posso interagir |
| Administrador | Convidar usuários para a empresa | Formar o time |
| Administrador | Remover usuários da empresa | Manter controle de acesso |
| Administrador | Visualizar membros da empresa | Gerenciar o time |
| Administrador | Cadastrar salas e mesas | Disponibilizar espaços no sistema |
| Administrador | Editar informações dos espaços | Manter dados atualizados |
| Administrador | Desativar espaços temporariamente | Manutenção ou indisponibilidade |
| Administrador | Visualizar todas as reservas | Ter controle do uso dos espaços |
| Administrador | Excluir reservas de usuários | Liberar salas quando necessário |

---

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais do sistema Deskly.

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RF-01 | O sistema deve permitir ao administrador cadastrar salas de reunião e estações de trabalho, editar, excluí-las ou desativá-las | Alta |
| RF-02 | O sistema deve permitir ao administrador cadastrar usuários no ambiente | Alta |
| RF-03 | O sistema deve permitir autenticação (login) | Alta |
| RF-04 | O sistema deve permitir o usuário visualizar e agendar salas de reunião e estações de trabalho disponíveis por data e horário | Alta |
| RF-05 | O sistema deve permitir ao usuário visualizar, editar e cancelar suas reservas | Alta |
| RF-06 | O sistema deve permitir ao administrador visualizar, editar e cancelar todas as reservas | Alta |
| RF-07 | O sistema deve exibir ao usuário detalhes das salas (capacidade, recursos e status) | Média |
| RF-08 | O sistema deve permitir o usuário adicionar convidados a uma reserva de sala de reunião | Média |
| RF-09 | O sistema deve permitir o usuário visualizar a lista de convidados de uma reserva de sala de reunião | Média |
| RF-10 | O sistema pode permitir favoritar salas | Baixa |

---

### Requisitos Não Funcionais

| ID | Descrição do Requisito | Prioridade |
|----|------------------------|------------|
| RNF-01 | O sistema deve possuir autenticação segura com criptografia de senhas | Alta |
| RNF-02 | O sistema deve implementar controle de acesso por perfil (usuário/admin) | Alta |
| RNF-03 | O sistema deve garantir a integridade dos dados de reservas | Alta |
| RNF-04 | O sistema deve realizar backup automático dos dados | Alta |
| RNF-05 | O sistema deve permitir recuperação de dados em caso de falha | Alta |
| RNF-06 | O sistema deve ter um tempo de resposta rápido e ágil. | Alta |
| RNF-07 | O sistema deve ser responsivo (desktop, tablet e mobile) | Média |
| RNF-08 | O sistema deve suportar pelo menos 5 usuários simultâneos sem degradação de performance | Média |
| RNF-09 | O sistema deve registrar logs de autenticação, criação, edição e exclusão de reservas | Média |
| RNF-10 | O sistema deve ser compatível com os principais navegadores | Média |
| RNF-11 | A interface deve permitir que o usuário realize uma reserva em poucos passos | Média |
| RNF-12 | O sistema deve permitir escalabilidade (aumento de usuários e reservas sem degradação significativa de performance) | Baixa |
| RNF-13 | O sistema deve possuir código modular e documentação para facilitar manutenção e evolução | Baixa |
| RNF-14 | O sistema deve permitir integração com serviços externos via API | Baixa |

---

## Restrições

O projeto Deskly está sujeito às seguintes restrições:

| ID | Restrição |
|----|-----------|
| 01 | O projeto deve ser entregue dentro do prazo definido pela disciplina |
| 02 | O sistema deve ser desenvolvido utilizando HTML, CSS, PHP e MySQL |
| 03 | O escopo do sistema está limitado aos requisitos definidos no projeto |

---