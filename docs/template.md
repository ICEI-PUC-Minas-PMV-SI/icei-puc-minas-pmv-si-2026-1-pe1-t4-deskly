# Template padrão do site

O Deskly utiliza um layout padrão aplicado em todas as páginas, garantindo consistência visual, organização e facilidade de uso. A identidade visual foi definida com base em tipografia moderna, uso de ícones e uma paleta de cores padronizada.

---

## Design

O sistema segue um layout com menu lateral fixo, barra superior e área central para exibição das informações. O logotipo fica posicionado no topo do menu lateral.

A navegação permite acesso direto às funcionalidades principais, como calendário, salas, estações e reservas. Modais são utilizados para ações como criar, editar e excluir.

<div style="background:#0B0B0B; padding:20px; border-radius:16px;">

<br>

<img src="img/layout.png" width="100%">

</div>

---

## Cores

A paleta de cores define a identidade visual do sistema e mantém consistência entre os elementos.

<div style="background:#0B0B0B; padding:20px; border-radius:16px;">

### Produto
<img src="img/cor-primaria.png" width="120">

### Background / Superfícies
<img src="img/cores-background.png" width="300">

### Textos
<img src="img/cores-texto.png" width="200">

### Status
<img src="img/cores-status.png" width="200">

</div>

---

## Tipografia

A tipografia utilizada no sistema é a **Poppins**, garantindo legibilidade e padronização visual.

<div style="background:#0B0B0B; padding:20px; border-radius:16px;">

<p style="font-size:34px; font-weight:600; margin:0;">Título de Página (Heading 1)</p>
<p style="font-size:26px; font-weight:600; margin:0;">Título de Seção (Heading 2)</p>
<p style="font-size:20px; font-weight:600; margin:0;">Subtítulo (Heading 3)</p>
<p style="font-size:16px; font-weight:500; margin:0;">Rótulos (Heading 4)</p>

<br>

<p style="font-size:14px; margin:0;">Texto padrão do sistema (corpo)</p>
<p style="font-size:12px; color:#888; margin:0;">Texto auxiliar</p>

<br>

<img src="img/tipografia.png" width="100%">

</div>

---

## Iconografia

Os ícones são utilizados para representar ações e facilitar a navegação do usuário.

<div style="background:#0B0B0B; padding:20px; border-radius:16px;">

<div style="display:flex; gap:30px; flex-wrap:wrap; align-items:center;">

<div>
<img src="img/icon-calendario.png" width="40"><br>
<small>Calendário</small>
</div>

<div>
<img src="img/icon-notificacao.png" width="40"><br>
<small>Notificações</small>
</div>

<div>
<img src="img/icon-usuario.png" width="40"><br>
<small>Usuário</small>
</div>

<div>
<img src="img/icon-adicionar.png" width="40"><br>
<small>Criar</small>
</div>

<div>
<img src="img/icon-editar.png" width="40"><br>
<small>Editar</small>
</div>

<div>
<img src="img/icon-excluir.png" width="40"><br>
<small>Excluir</small>
</div>

</div>

<br>

</div>

---

## Estilos CSS

Os estilos foram definidos com variáveis para padronização e reutilização.

```css
:root {

    /* CORES */
    --color-btn-primary: #394B67;
    --color-heading: #212A3E;
    --color-text-md: #5E6679;
    --color-text-sm: rgba(94, 102, 121, 0.75);
    --color-border-card: rgba(94, 102, 121, 0.15);
    --color-background: #EEEEEE;
    --color-badge-green: #D4EDDA;
    --color-text-green: #2D6A3F;
    --color-text-red:#721C24;
    --color-btn-red: #F8D7DA;

    /* TIPOGRAFIA */
    --main-font: "Poppins", sans-serif;

    --heading-1: 600 clamp(1.5rem, 2.5vw, 2rem)/1.25 var(--main-font);
    --heading-2: 600 clamp(1.25rem, 2vw, 1.75rem)/1.25 var(--main-font);
    --heading-3: 600 clamp(1rem, 1.5vw, 1.25rem)/1.25 var(--main-font);
    --heading-4: 500 clamp(0.875rem, 1.2vw, 1.125rem)/1.25 var(--main-font);
    --text-md: 500 clamp(0.875rem, 1vw, 1rem)/1 var(--main-font);
    --text-sm: 400 clamp(0.7rem, 0.8vw, 0.75rem)/1 var(--main-font);

}