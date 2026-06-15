# Programação de Funcionalidades

O Deskly é uma aplicação web de gerenciamento de reservas de espaços corporativos desenvolvida inteiramente com tecnologias client-side: HTML5, CSS3 e JavaScript puro. A persistência de dados é realizada via `localStorage` do navegador para usuários, espaços, reservas e notificações, e via `IndexedDB` para armazenamento de fotos de perfil. A integração com o serviço externo EmailJS viabiliza o envio de convites por e-mail aos novos usuários.

> **Links Úteis**:
>
> - [Trabalhando com HTML5 Local Storage e JSON](https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045)
> - [JSON Tutorial](https://www.w3resource.com/JSON)
> - [JSON Data Set Sample](https://opensource.adobe.com/Spry/samples/data_region/JSONDataSetSample.html)
> - [JSON - Introduction (W3Schools)](https://www.w3schools.com/js/js_json_intro.asp)
> - [JSON Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/json/index.htm)

---

## Requisitos Atendidos

### Requisitos Funcionais

| ID | Descrição do Requisito | Responsável | Artefato Criado |
|----|------------------------|-------------|-----------------|
| RF-01 | O sistema deve permitir ao administrador cadastrar salas de reunião e estações de trabalho, editar, excluí-las ou desativá-las | Emanuel | `painelAdmin.html`, `painelAdminEspacos.js` |
| RF-02 | O sistema deve permitir ao administrador cadastrar usuários no ambiente | Emanuel | `painelAdmin.html`, `painelAdminUsuarios.js` |
| RF-03 | O sistema deve permitir autenticação (login) | Isabela | `login.html`, `login.js`, `primeiro-acesso.html`, `primeiro-acesso.js` |
| RF-04 | O sistema deve permitir o usuário visualizar e agendar salas de reunião e estações de trabalho disponíveis por data e horário | Isabela / Letícia | `salas-reuniao.html`, `salas-reuniao.js`, `estacoes.html`, `estacoes.js` |
| RF-05 | O sistema deve permitir ao usuário visualizar, editar e cancelar suas reservas | Vitória | `minhas-reservas.html`, `minhas-reservas.js`, `calendario.html`, `calendario.js` |
| RF-06 | O sistema deve permitir ao administrador visualizar, editar e cancelar todas as reservas | Emanuel | `painelAdmin.html`, `painelAdminReservas.js` |
| RF-07 | O sistema deve exibir ao usuário detalhes das salas (capacidade, recursos e status) | Isabela | `salas-reuniao.html`, `salas-reuniao.js`, `modal.js`, `modal.css` |
| RF-08 | O sistema deve permitir o usuário adicionar convidados a uma reserva de sala de reunião | Vitória | `salas-reuniao.js`, `minhas-reservas.js`, `notificacoes.js` |
| RF-09 | O sistema deve permitir o usuário visualizar a lista de convidados de uma reserva de sala de reunião | Vitória | `minhas-reservas.html`, `minhas-reservas.js`, `notificacoes.js` |
| RF-10 | O sistema pode permitir visualização das reservas em calendário | Maria Luiza | `calendario.html`, `calendario.js` |

### Requisitos Não Funcionais

| ID | Descrição do Requisito | Artefato Criado |
|----|------------------------|-----------------|
| RNF-01 | Autenticação segura com validação de senha | `login.js`, `primeiro-acesso.js` |
| RNF-02 | Controle de acesso por perfil (usuário/admin) | `menu.js`, `login.js`, `painelAdminUsuarios.js` |
| RNF-03 | Integridade dos dados de reservas (detecção de conflitos) | `salas-reuniao.js` (`horariosConflitam()`), `estacoes.js` |
| RNF-06 | Tempo de resposta rápido — operações client-side sem chamadas a servidor | Toda a aplicação (`localStorage`, `IndexedDB`) |
| RNF-07 | Interface responsiva (desktop, tablet e mobile) | `global.css`, `variables.css`, `menu.js` (`trocarLogo()`) |
| RNF-11 | Reserva concluída em poucos passos | `salas-reuniao.js`, `estacoes.js`, `modal.js` |
| RNF-14 | Integração com serviço externo via API (EmailJS) | `painelAdminUsuarios.js` |

---

## Descrição das Estruturas de Dados

Todas as entidades abaixo são serializadas em JSON e persistidas no `localStorage` do navegador, com exceção das fotos, que utilizam `IndexedDB`.

---

### Usuário
Chave no `localStorage`: `usuarios` (array de objetos)

| **Nome** | **Tipo** | **Descrição** | **Exemplo** |
|:---:|---|---|---|
| id | Número (Inteiro) | Identificador único gerado por timestamp | `1718400000000` |
| nome | Texto | Nome completo do usuário | `"Mariana Souza"` |
| email | Texto | Endereço de e-mail (usado como login) | `"mariana@empresa.com"` |
| senha | Texto | Senha do usuário | `"Senha@2026"` |
| perfil | Texto | Nível de acesso: `"Admin"` ou `"Usuário"` | `"Usuário"` |
| token | Texto / Nulo | Token de convite gerado para primeiro acesso | `"abc123def456"` |
| senhaDefinida | Booleano | Indica se o usuário já definiu sua senha | `true` |
| protegido | Booleano | Impede remoção do usuário administrador padrão | `false` |
| dataCriacao | Texto | Data e hora de criação no formato ISO 8601 | `"2026-06-15T10:30:00.000Z"` |
| foto | Texto | Caminho ou base64 da foto de perfil | `"assets/images/avatar.jpg"` |
| departamento | Texto | Departamento da empresa ao qual pertence | `"Tecnologia"` |
| telefone | Texto | Telefone de contato | `"(31) 99999-9999"` |

---

### Espaço
Chave no `localStorage`: `espacosSistema` (array de objetos)

| **Nome** | **Tipo** | **Descrição** | **Exemplo** |
|:---:|---|---|---|
| id | Número (Inteiro) | Identificador único gerado por timestamp | `1718400000001` |
| tipo | Texto | Categoria do espaço: `"Sala de Reunião"` ou `"Estação de Trabalho"` | `"Sala de Reunião"` |
| nome | Texto | Nome de identificação do espaço | `"Sala Inovação"` |
| capacidade | Número / Texto | Número máximo de pessoas; `"-"` para estações individuais | `10` |
| recursos | Texto | Lista de recursos disponíveis na sala | `"Projetor, Ar-condicionado, Whiteboard"` |
| area | Texto | Localização física do espaço | `"3º Andar"` |
| status | Texto | Disponibilidade do espaço: `"Ativo"` ou `"Inativo"` | `"Ativo"` |
| imagem | Texto | Imagem do espaço em formato base64 (comprimida via Canvas API) | `"data:image/jpeg;base64,..."` |

---

### Reserva
Chave no `localStorage`: `reservasSistema` (array de objetos)

| **Nome** | **Tipo** | **Descrição** | **Exemplo** |
|:---:|---|---|---|
| id | Número (Inteiro) | Identificador único gerado por timestamp | `1718400000002` |
| usuarioId | Número (Inteiro) | ID do usuário que realizou a reserva | `1718400000000` |
| usuario | Texto | Nome do usuário que realizou a reserva | `"Mariana Souza"` |
| espaco | Texto | Nome do espaço reservado | `"Sala Inovação"` |
| tipo | Texto | Tipo do espaço: `"Sala de Reunião"` ou `"Estação de Trabalho"` | `"Sala de Reunião"` |
| data | Texto | Data da reserva no formato `dd/mm/aaaa` | `"20/06/2026"` |
| inicio | Texto | Horário de início no formato `HH:MM` | `"14:00"` |
| fim | Texto | Horário de término no formato `HH:MM` | `"16:00"` |
| horario | Texto | Exibição formatada do intervalo de horário | `"14:00 – 16:00"` |
| status | Texto | Situação da reserva: `"Confirmada"` ou `"Cancelada"` | `"Confirmada"` |
| convidados | Texto | Lista de e-mails dos convidados separados por vírgula | `"lucas@emp.com, carlos@emp.com"` |
| convidadosStatus | Objeto | Mapeamento de e-mail para status do convite | `{"lucas@emp.com": "aceito", "carlos@emp.com": "pendente"}` |

---

### Notificação
Chave no `localStorage`: `notificacoes_${usuarioId}` (array de objetos, por usuário)

| **Nome** | **Tipo** | **Descrição** | **Exemplo** |
|:---:|---|---|---|
| id | Número (Inteiro) | Identificador único gerado por timestamp | `1718400000003` |
| mensagem | Texto | Texto descritivo da notificação ou convite | `"Mariana te convidou para Sala Inovação no dia 20/06/2026 das 14:00 às 16:00."` |
| tempo | Texto | Data e hora de criação formatada | `"20/06/2026 10:45:30"` |
| lida | Booleano | Indica se o usuário já visualizou a notificação | `false` |
| tipo | Texto | Categoria da notificação: `"convite"` ou notificação geral | `"convite"` |
| respondida | Booleano | Indica se o convite já foi respondido | `false` |
| resposta | Texto | Resposta ao convite: `"aceito"` ou `"recusado"` | `"aceito"` |
| reservaId | Número (Inteiro) | ID da reserva associada ao convite | `1718400000002` |
| emailConvidado | Texto | E-mail do destinatário do convite | `"lucas@empresa.com"` |

---

### Foto de Perfil
Banco de dados `IndexedDB`: nome `perfilDB`, store `fotos`

| **Nome** | **Tipo** | **Descrição** | **Exemplo** |
|:---:|---|---|---|
| chave | Texto | Identificador da foto no formato `foto_${id}` | `"foto_1718400000000"` |
| valor | Blob | Dados binários da imagem de perfil do usuário | *(arquivo de imagem)* |

---

## Instruções de Acesso e Verificação

### Executando localmente

1. Clone o repositório ou baixe os arquivos da pasta `src/`
2. Abra o arquivo `src/index.html` diretamente no navegador (Chrome, Edge ou Firefox recomendados)
3. Na tela de seleção de perfil, escolha **Usuário** ou **Admin**
4. O sistema inicializa automaticamente um usuário administrador padrão via `garantirAdminDeskly()` em `login.js`:
   - **E-mail:** `sistema.deskly@gmail.com`
   - **Senha:** `Deskly2026.`

### Fluxo de verificação por requisito

| Requisito | Caminho de verificação |
|-----------|------------------------|
| RF-03 – Login | `index.html` → selecionar perfil → `login.html` → inserir credenciais |
| RF-02 – Convidar usuário | Login como admin → `painelAdmin.html` → aba "Usuários" → "Convidar usuário" |
| RF-03 – Primeiro acesso | Acessar `primeiro-acesso.html?token=<token>` com token gerado no convite |
| RF-01 – Cadastrar espaço | Login como admin → `painelAdmin.html` → aba "Espaços" → preencher formulário |
| RF-04 – Reservar sala | Login como usuário → `salas-reuniao.html` → filtrar por data/horário → "Reservar" |
| RF-04 – Reservar estação | Login como usuário → `estacoes.html` → filtrar → "Reservar" |
| RF-07 – Detalhes da sala | Em `salas-reuniao.html` → clicar em "Ver detalhes" no card da sala |
| RF-08/09 – Convidados | Ao reservar sala → seção de convidados no modal → selecionar usuários |
| RF-05 – Minhas reservas | `minhas-reservas.html` → abas "Próximas" e "Histórico" |
| RF-05 – Calendário | `calendario.html` → navegar por meses → clicar em dias com reservas |
| RF-06 – Admin reservas | Login como admin → `painelAdmin.html` → aba "Reservas" |

### Observações técnicas

- Os dados são armazenados exclusivamente no navegador. Limpar os dados do site apaga todas as reservas e usuários (exceto o admin padrão, que é recriado automaticamente).
- O envio de e-mail de convite requer credenciais válidas do EmailJS configuradas em `painelAdminUsuarios.js`. Sem as credenciais, o token é gerado e salvo normalmente, mas o e-mail não é disparado.
- Fotos de perfil são armazenadas em `IndexedDB` (banco `perfilDB`, store `fotos`) com chave no formato `foto_${id}` e fallback automático para avatar com iniciais do nome.
