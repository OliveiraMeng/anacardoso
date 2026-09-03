# Google Tag Manager & Analytics (GA4)

Documentação de como o rastreamento de acessos e cliques do site foi configurado.

## IDs de referência

| Item | ID |
|---|---|
| Container do GTM | `GTM-TGN4Q9VS` |
| Propriedade GA4 (Measurement ID) | `G-V3PLB2BMLP` |
| Número de WhatsApp usado nos CTAs | `5547933892937` (definido em `src/script.js`) |

- GTM: https://tagmanager.google.com
- GA4: https://analytics.google.com

## Arquitetura geral

1. **GTM** está instalado direto no `<head>`/`<body>` de `index.html` e `src/index.html` (snippet padrão do Google Tag Manager).
2. Dentro do GTM existe uma tag do tipo **"Tag do Google"** apontando pro Measurement ID do GA4 — ela é a base que conecta o site à propriedade GA4 e já envia `page_view` automaticamente (acessos ao site).
3. Cliques nos botões de WhatsApp disparam um evento customizado no `dataLayer` via JavaScript (`src/script.js`), que o GTM escuta através de um acionador de evento personalizado e repassa como evento pro GA4.

Ou seja: **acessos ao site** = a tag "Tag do Google" sozinha já resolve. **Cliques nos CTAs** = dependem do evento `whatsapp_click` disparado pelo código do site.

## Código-fonte (src/script.js)

Cada botão de WhatsApp tem um identificador de localização, e ao ser clicado dispara um evento no `dataLayer`:

```js
const ctaButtonLocations = {
    'whatsapp-float': 'flutuante',
    'cta-hero': 'hero',
    'cta-laser-mid': 'laserterapia',
    'cta-footer': 'cta_final'
};

const ctaButtons = Object.keys(ctaButtonLocations)
    .map(id => document.getElementById(id))
    .filter(Boolean);

window.dataLayer = window.dataLayer || [];

ctaButtons.forEach(button => {
    button.setAttribute('href', whatsappLink);
    button.setAttribute('target', '_blank');

    button.addEventListener('click', function() {
        window.dataLayer.push({
            event: 'whatsapp_click',
            button_location: ctaButtonLocations[button.id]
        });
    });
});
```

Os 4 botões rastreados:

| `id` no HTML | `button_location` | Onde fica |
|---|---|---|
| `whatsapp-float` | `flutuante` | Botão flutuante "Agende Rápido" |
| `cta-hero` | `hero` | "Quero Agendar Minha Avaliação" (topo) |
| `cta-laser-mid` | `laserterapia` | "Saiba Mais sobre a Laserterapia" |
| `cta-footer` | `cta_final` | "Agendar e Tirar Minhas Dúvidas" (rodapé) |

## Configuração no GTM

### Tags

1. **Tag do Google G-V3PLB2BMLP**
   - Tipo: `Tag do Google`
   - ID da tag: `G-V3PLB2BMLP`
   - Acionador: `Initialization - All Pages` (system trigger, não mexer)
   - Função: conecta o site à propriedade GA4 e envia pageviews.

2. **Configuração do GA4**
   - Tipo: `Google Analytics: evento do GA4`
   - ID da métrica: `G-V3PLB2BMLP` (usa a config da tag acima)
   - Nome do evento: `whatsapp_click`
   - Acionador: `EV - WhatsApp Click`
   - Função: registra no GA4 todo clique em botão de WhatsApp.

### Acionadores

- **EV - WhatsApp Click**
  - Tipo: Evento personalizado
  - Nome do evento: `whatsapp_click`
  - Dispara em: todos os eventos personalizados que casam com esse nome

### Variáveis (pendente/opcional)

Para quebrar os cliques por botão (`button_location`) nos relatórios do GA4, falta criar:

- Variável de camada de dados `DLV - button_location` → Nome da variável na camada de dados: `button_location`
- Adicionar essa variável como parâmetro de evento na tag "Configuração do GA4" (campo "Parâmetros de evento" → `button_location` = `{{DLV - button_location}}`)

Sem isso, o evento `whatsapp_click` já é contado normalmente, só não vem separado por botão.

## Como testar

1. No GTM, clique em **Visualizar** (Preview) e informe a URL do site.
2. No painel de debug que abre, clique nos botões de WhatsApp do site.
3. Confira na lista de eventos (canto esquerdo) se aparece `whatsapp_click`.
4. Clique nele e veja em **"Tags disparadas"** se a tag "Configuração do GA4" aparece como disparada.
5. Se estiver tudo certo, publique o container (**Enviar → Publicar**).

⚠️ O evento só aparece se o `src/script.js` **em produção** já tiver o código de `dataLayer.push` acima — sempre confirme que o deploy mais recente do site foi publicado antes de testar.

## Onde ver os dados

No GA4 (https://analytics.google.com):

- **Relatórios → Tempo real**: acessos e cliques acontecendo agora (bom pra validar depois de publicar).
- **Relatórios → Engajamento → Eventos**: histórico de `page_view` e `whatsapp_click` ao longo do tempo.

## Como adicionar rastreamento de um novo botão/ação no futuro

1. No `src/script.js`, dar um `id` único ao elemento e adicionar um `addEventListener('click', ...)` que faça `window.dataLayer.push({ event: 'nome_do_evento', ...parametros })`.
2. No GTM, criar um acionador de **Evento personalizado** com esse `event` (ou reaproveitar um existente).
3. Criar uma tag **Google Analytics: evento do GA4** usando a config da "Tag do Google G-V3PLB2BMLP", com o mesmo nome de evento e o acionador criado.
4. Testar no modo Preview antes de publicar.
