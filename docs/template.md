# Template padrão do site

O Deskly utiliza um layout padrão definido em HTML e CSS que é aplicado em todas as telas do sistema, garantindo consistência visual, organização e facilidade de uso.

A identidade visual foi construída com base em uma paleta de cores neutra e profissional, tipografia moderna e componentes reutilizáveis. O sistema também foi desenvolvido com foco em responsividade, permitindo uso em diferentes dispositivos.

---

## Design

O layout do sistema segue uma estrutura padrão composta por:

- **Menu lateral fixo (nav):** à esquerda com acesso às principais funcionalidades (Logo, Dashboard, Calendário, Salas, Estações, Reservas, Painel Admin e Ajuda);
- **Barra superior (header):** contendo informações do usuário e notificações;
- **Área central dinâmica (main):**, onde são exibidos os conteúdos principais de cada tela;

![Layout Geral](img/layout-geral.png)

---

## Cores

A paleta de cores do sistema foi definida utilizando tons neutros e cores de apoio para indicar estados (sucesso, erro, ações).

### Cores principais

![Layout Geral](img/CoresPrincipais.png)

### Cores de status

![Layout Geral](img/CoresStatus.png)

## Tipografia

A tipografia utilizada no sistema é a **Poppins**, importada do Google Fonts, garantindo boa legibilidade e aparência moderna.

![Layout Geral](img/Tipografia.png)

## Iconografia

O sistema utiliza ícones simples e intuitivos para facilitar a compreensão das ações pelo usuário. Os ícones são utilizados principalmente em botões e ações rápidas, reforçando a usabilidade e reduzindo a necessidade de leitura.

![Layout Geral](img/Iconografia.png)

## Estilo CSS Base - Padrão para todas as Telas

:root {

    /* ===== CORES ===== */
    --color-btn-primary: #394B67;
    --color-heading: #212A3E;
    --color-text-md: #5E6679;
    --color-text-sm: rgba(94, 102, 121, 0.75);
    --color-border-card: rgba(94, 102, 121, 0.15);
    --color-background: #EEEEEE;
    --color-badge-green: #D4EDDA;
    --color-text-green: #2D6A3F;
    --color-text-red: #721C24;
    --color-btn-red: #F8D7DA;

    /* ===== TIPOGRAFIA ===== */
    --main-font: "Poppins", sans-serif;
    --heading-1: 600 clamp(1.5rem, 2.5vw, 2rem)/1.25 var(--main-font);
    --heading-2: 600 clamp(1.25rem, 2vw, 1.75rem)/1.25 var(--main-font);
    --heading-3: 600 clamp(1rem, 1.5vw, 1.25rem)/1.25 var(--main-font);
    --heading-4: 500 clamp(0.875rem, 1.2vw, 1.125rem)/1.25 var(--main-font);
    --text-md: 500 clamp(0.875rem, 1vw, 1rem)/1.0 var(--main-font);
    --text-sm: 400 clamp(0.7rem, 0.8vw, 0.75rem)/1.0 var(--main-font);

    /* ===== ESPAÇAMENTOS ===== */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;

    /* ===== BORDAS ===== */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;

}
