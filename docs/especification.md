# Especificações do Projeto

A especificação do projeto Deskly tem como objetivo definir o problema identificado e a solução proposta sob a perspectiva do usuário. Para isso, foram utilizadas técnicas como definição de personas, criação de histórias de usuário e levantamento de requisitos funcionais e não funcionais.

Essas etapas permitem compreender as necessidades dos usuários e garantir que o sistema atenda aos objetivos propostos, oferecendo uma solução eficiente para o gerenciamento de reservas de espaços corporativos.

---

## Personas

As personas foram definidas com base no público-alvo do sistema Deskly, considerando usuários que utilizam espaços corporativos e administradores responsáveis pelo gerenciamento desses ambientes.

---

| <img src="./img/persona1.png" width="30%"> | **Mariana Souza** |
|--------------------------------------|-------------------|
| **Idade** | **29 anos** |
| Ocupação | Analista Administrativa |
| Motivações | Organizar reuniões com facilidade e evitar conflitos de agenda no trabalho |
| Frustrações | Perder tempo procurando salas disponíveis ou enfrentar conflitos de horário |
| Hobbies | Assistir séries, organizar eventos corporativos, leitura |
| Aplicativos | Gmail, Google Agenda, Microsoft Teams, WhatsApp |

---

| <img src="./img/persona2.png" width="30%"> | **Lucas Ferreira** |
|--------------------------------------|-------------------|
| **Idade** | **34 anos** |
| Ocupação | Analista de Sistemas |
| Motivações | Garantir uma estação de trabalho disponível antes de ir ao escritório |
| Frustrações | Chegar ao trabalho e não encontrar espaço disponível |
| Hobbies | Tecnologia, jogos online, academia |
| Aplicativos | Slack, Notion, WhatsApp, Google Calendar |

---

| <img src="./img/persona3.png" width="30%"> | **Carlos Mendes** |
|--------------------------------------|-------------------|
| **Idade** | **40 anos** |
| Ocupação | Gerente Administrativo |
| Motivações | Controlar o uso dos espaços da empresa de forma eficiente |
| Frustrações | Falta de controle sobre reservas e uso indevido dos espaços |
| Hobbies | Futebol, leitura sobre gestão, viagens |
| Aplicativos | Excel, Outlook, WhatsApp, sistemas corporativos |

---

## Histórias de Usuários

Fundamentadas nas personas definidas para o projeto Deskly, foram identificadas as seguintes histórias de usuários:

| Eu como… | Quero/desejo… | Para… |
|----------|--------------|------|
| Mariana Souza | visualizar todas as salas disponíveis em determinado dia e horário | escolher qual posso reservar |
| Mariana Souza | visualizar detalhes das salas (capacidade, recursos) | escolher a mais adequada |
| Mariana Souza | reservar uma sala informando data e horário e receber confirmação | garantir meu uso do espaço |
| Mariana Souza | cancelar uma reserva | liberar a sala caso eu não vá utilizá-la |
| Mariana Souza | visualizar minhas reservas | gerenciá-las |
| Mariana Souza | gerenciar convidados da reserva (adicionar e remover) | organizar a reunião |
| Mariana Souza | visualizar a lista de convidados e seu status (aceito/recusado) | planejar melhor a reunião |
| Mariana Souza | ter limite automático de convidados conforme a capacidade da sala | evitar superlotação |
| Mariana Souza | fazer login no sistema | acessar minhas funcionalidades |
| Lucas Ferreira | visualizar todas as salas disponíveis em determinado dia e horário | escolher qual posso reservar |
| Lucas Ferreira | visualizar detalhes das salas (capacidade, recursos) | escolher a mais adequada |
| Lucas Ferreira | reservar uma sala informando data e horário e receber confirmação | garantir meu uso do espaço |
| Lucas Ferreira | cancelar uma reserva | liberar a sala caso eu não vá utilizá-la |
| Lucas Ferreira | visualizar minhas reservas | gerenciá-las |
| Lucas Ferreira | gerenciar convidados da reserva (adicionar e remover) | organizar a reunião |
| Lucas Ferreira | visualizar a lista de convidados e seu status (aceito/recusado) | planejar melhor a reunião |
| Lucas Ferreira | ter limite automático de convidados conforme a capacidade da sala | evitar superlotação |
| Lucas Ferreira | fazer login no sistema | acessar minhas funcionalidades |
| Carlos Mendes | convidar usuários para a empresa | formar o time |
| Carlos Mendes | remover usuários da empresa | manter controle de acesso |
| Carlos Mendes | visualizar membros da empresa | gerenciar o time |
| Carlos Mendes | cadastrar salas e mesas | disponibilizar espaços no sistema |
| Carlos Mendes | editar informações dos espaços | manter dados atualizados |
| Carlos Mendes | desativar espaços temporariamente | manutenção ou indisponibilidade |
| Carlos Mendes | visualizar todas as reservas | ter controle do uso dos espaços |
| Carlos Mendes | excluir reservas de usuários | liberar salas quando necessário |

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