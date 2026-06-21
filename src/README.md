# Deskly
 
Gestão inteligente de espaços. Solução completa para empresas que valorizam eficiência e experiência, voltada à organização, reserva e controle de salas de reunião e estações de trabalho em ambientes corporativos que adotam o modelo de trabalho híbrido.
 
# Instruções de utilização
 
## Instalação do Site
 
O site em HTML/CSS/JS é um projeto estático, logo pode ser utilizado tanto em servidores locais quanto em hospedagem estática (como GitHub Pages), sem necessidade de build ou instalação de dependências de backend.
 
### Pré-requisitos
 
- Um navegador web atualizado (Chrome, Firefox, Edge ou similar);
- (Opcional) um servidor local simples, como a extensão *Live Server* do VS Code ou o módulo `http.server` do Python, para evitar restrições de CORS ao carregar recursos externos (ex: dados de clima via API).
### Passo a passo
 
1. Clone o repositório:
```bash
   git clone <https://github.com/ICEI-PUC-Minas-PMV-SI/icei-puc-minas-pmv-si-2026-1-pe1-t4-deskly.git>
```
2. Acesse a pasta do projeto:
```bash
   cd deskly
```
3. Abra o arquivo `index.html` diretamente no navegador, ou inicie um servidor local:
```bash
   # Usando Python
   python -m http.server 8000
```
4. Acesse `http://localhost:8000` no navegador.
### Acesso online
 
O projeto também está publicado via GitHub Pages, podendo ser acessado diretamente pelo link: `<https://icei-puc-minas-pmv-si.github.io/icei-puc-minas-pmv-si-2026-1-pe1-t4-deskly/src/>`
 
### Dados e armazenamento
 
O sistema utiliza o `localStorage` do navegador para persistir reservas, usuários e configurações. Isso significa que os dados ficam salvos apenas localmente, no navegador utilizado — não há banco de dados ou backend compartilhado entre diferentes usuários ou dispositivos.
 
## Histórico de versões
 
O histórico abaixo está organizado de acordo com as 5 etapas do projeto definidas pela disciplina, com base no histórico de commits do repositório.
 
### [0.1.0] - Etapa 1: Análise e especificação do problema (09/04/2026 a 19/04/2026)
 
> [Análise e especificação do problema](https://pucminas.instructure.com/courses/274687/pages/etapa-1-analise-e-especificacao-do-problema)
 
#### Adicionado
- Configuração inicial do ambiente de desenvolvimento (IDE online da turma);
- Documento de contexto do problema (`context.md`);
- Levantamento de referências (`references.md`);
- Especificação do problema e dos requisitos (`especification.md`);
- Estrutura inicial do README do projeto.
### [0.2.0] - Etapa 2: Projeto dos requisitos e de artefatos do sistema (17/04/2026 a 27/04/2026)
 
> [Projeto dos requisitos e de artefatos do sistema](https://pucminas.instructure.com/courses/274687/pages/etapa-2-projeto-dos-requisitos-e-de-artefatos-do-sistema)
 
#### Adicionado
- Documento de interface (`interface.md`) com as telas planejadas do sistema;
- Documento de template (`template.md`) com o guia visual do projeto;
- Diagrama de fluxo do usuário (user flow);
- Arquivo de citação do projeto (`CITATION.cff`);
- Estrutura inicial do Painel Administrativo (HTML/CSS).
> As Etapas 1 e 2 tiveram parte do desenvolvimento em paralelo, já que os documentos de especificação e os de interface/template foram revisados de forma simultânea pelo time.
 
### [0.3.0] - Etapa 3: Desenvolvimento da estrutura estática da solução (14/04/2026 a 21/05/2026)
 
> [Desenvolvimento da estrutura estática da solução](https://pucminas.instructure.com/courses/274687/pages/etapa-3-desenvolvimento-da-solucao)
 
#### Adicionado
- Arquitetura de pastas do projeto e variáveis globais de CSS (cores, tipografia);
- Página de Login e tela de Dashboard, com seções de reservas do dia e ações rápidas;
- Páginas de Estações de Trabalho e Salas de Reunião, com responsividade mobile;
- Painel Administrativo com sistema de abas, tabelas (salas, estações, usuários) e modais (criar/editar/excluir reserva, convidados);
- Telas de Minhas Reservas, Calendário, Ajuda, Perfil e Recuperar Senha;
- Componente de menu lateral e header compartilhado (`menu.js`), centralizando a navegação em todas as páginas;
- Integração visual do calendário Flatpickr, com tema customizado;
- Sistema de notificações no header, com badge e dropdown;
- Menu hambúrguer e adaptações de layout para mobile em todas as telas.
#### Corrigido
- Overflow horizontal em tabelas e cards no tablet/mobile;
- Posicionamento do botão de perfil e estilos de hover nos botões de ação.
### [0.4.0] - Etapa 4: Desenvolvimento da estrutura dinâmica da solução e Plano de Testes (23/05/2026 a 14/06/2026)
 
> [Desenvolvimento da estrutura dinâmica da solução e Plano de Testes](https://pucminas.instructure.com/courses/274687/pages/etapa-4-desenvolvimento-da-estrutura-dinamica-da-solucao-e-plano-de-testes)
 
#### Adicionado
- Lógica dinâmica de Minhas Reservas (`minhas-reservas.js`), renderizando as reservas do usuário logado a partir do `localStorage`;
- Fluxo de Primeiro Acesso e padronização dos labels de papel de usuário (colaborador/administrador);
- Componente de select customizado para filtros (capacidade, status);
- Carregamento dinâmico de reservas confirmadas e dashboard alimentado por dados do `localStorage`;
- Gerenciamento de convidados e status de convidados nas reservas de salas;
- Ordenação de reservas por data nas telas de Minhas Reservas e Painel Admin;
- Confirmação de cancelamento de reserva e conversão de modais estáticos em dinâmicos;
- Exibição de mensagens de erro nos campos dos modais;
- Plano de testes (`tests.md`) e documento de desenvolvimento (`development.md`).
#### Corrigido
- Escopo do Flatpickr restrito ao filtro de reservas;
- Caminho do componente `menu.js` após reorganização de pastas;
- Remoção de dados de teste (seed) antes da etapa final.
### [0.5.0] - Etapa 5: Testes, implantação e apresentação da solução (16/06/2026 a 21/06/2026)
 
> [Testes, implantação e apresentação da solução](https://pucminas.instructure.com/courses/274687/pages/etapa-5-testes-implantacao-e-apresentacao-da-solucao)
 
#### Adicionado
- Validação de campos obrigatórios com destaque visual nos formulários;
- Validação de nomes duplicados ao criar/editar espaços;
- Detecção de conflito de horários em reservas sobrepostas;
- Validação de capacidade (entre 1 e 15) e de datas/horários passados;
- Overlay e funcionalidade de menu mobile;
- Modal de confirmação para exclusão de espaços;
- Imagem padrão para estações de trabalho sem foto cadastrada.
#### Corrigido
- Mensagem de boas-vindas exibida com hífen incorreto;
- Toast de notificação exibido na camada correta (top layer), evitando aberturas duplicadas;
- Ajustes finais em `tests.md` para fechamento do plano de testes.