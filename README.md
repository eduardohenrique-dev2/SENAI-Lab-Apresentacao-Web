# SENAI Lab — Apresentação Web

Apresentação web do **Sistema de Gestão de Demandas do SENAI Lab — SENAI Afonso Greco**.

A apresentação acompanha o fluxo atual do sistema em produção:

**Solicitação → protocolo → triagem da Administração → autorização → operação da equipe → conclusão.**

## O que a apresentação mostra

- abertura de demandas por colaboradores com e-mail `@fiemg.com.br`;
- protocolo para acompanhamento sem criação de conta;
- triagem administrativa antes da operação;
- equipe interna trabalhando somente com demandas autorizadas;
- status, prioridade, equipamento e histórico por ação;
- fila de produção;
- notificações, privacidade e separação de acessos;
- acesso direto ao sistema por link e QR Code.

A apresentação pública não expõe áreas exclusivas de gestão avançada do sistema.

## Recursos

- 11 slides responsivos;
- HTML + CSS + JavaScript puro;
- identidade visual SENAI Lab;
- navegação por teclado, botões e pontos laterais;
- teclas **F** para tela cheia e **C** para controle pelo celular;
- contador e barra de progresso;
- suporte a `prefers-reduced-motion`;
- modo de impressão;
- melhorias de acessibilidade por teclado e leitores de tela;
- controle remoto com falas do apresentador;
- sincronização em tempo real usando Supabase Realtime;
- cabeçalhos de segurança para deploy na Vercel;
- verificação automática de qualidade no GitHub Actions.

## Modo apresentador pelo celular

1. Abra `index.html` no notebook ou projetor.
2. Clique no botão **📱** ou pressione **C**.
3. A apresentação gera um código de sessão e um QR Code.
4. No celular, escaneie o QR Code ou abra `controle.html` e informe o código.
5. O celular mostra a fala correspondente ao slide atual e os controles **Voltar** e **Próximo**.
6. As mudanças feitas no celular são refletidas na apresentação em tempo real.

O controle remoto usa somente a configuração pública necessária ao Supabase Realtime e não acessa as demandas do sistema principal.

## Atalhos

- `→`, `↓`, `PageDown` ou `Espaço`: próximo slide;
- `←`, `↑` ou `PageUp`: slide anterior;
- `Home`: primeiro slide;
- `End`: último slide;
- `F`: entrar ou sair da tela cheia;
- `C`: abrir o controle pelo celular;
- `Esc`: fechar a janela do controle remoto.

## Estrutura

- `index.html` — conteúdo principal da apresentação;
- `styles.css` — estilos base dos slides;
- `presenter.css` — estilos do modo apresentador e acesso final;
- `enhancements.css` — acessibilidade, responsividade e refinamentos;
- `script.js` — navegação e sincronização original;
- `enhancements.js` — reforços de navegação, acessibilidade e sessão remota;
- `controle.html` — controle mobile;
- `controle.css` — estilos do controle;
- `controle-enhancements.css` — refinamentos do controle mobile;
- `controle.js` — conexão e comandos em tempo real;
- `presenter-notes.js` — falas atualizadas do apresentador;
- `vercel.json` — cabeçalhos de segurança do deploy;
- `.github/workflows/quality.yml` — verificações automáticas;
- `assets/` — logo, captura do sistema e cartaz de acesso.

## Executar localmente

Para visualizar somente os slides, um servidor estático simples é suficiente. Exemplo com Python:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

Para usar o controle remoto em dispositivos diferentes, publique a apresentação em um host HTTPS, como a Vercel.

## Sistema oficial

https://senai-lab-afonso-greco.vercel.app/

> SENAI Lab — Conectando pessoas, ideias e fabricação.
