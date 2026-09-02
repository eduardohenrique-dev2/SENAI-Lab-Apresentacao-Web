# SENAI Lab — Apresentação Web

Apresentação web institucional do **Sistema de Gestão de Demandas do SENAI Lab — SENAI Afonso Greco**.

## Objetivo

Explicar de forma simples:

- o que é a plataforma;
- como o solicitante abre e acompanha uma demanda;
- como a equipe acessa e gerencia o atendimento;
- como funciona a fila de produção;
- como o sistema organiza comunicação, histórico e privacidade.

## Recursos

- 11 seções em formato de slides;
- HTML + CSS + JavaScript;
- identidade visual SENAI em azul, branco e laranja;
- tela real do sistema na abertura;
- cartaz com QR Code no slide final;
- teclas de seta, PageUp/PageDown, Home e End;
- tecla **F** para tela cheia;
- tecla **C** para abrir o controle pelo celular;
- contador de slides e barra de progresso;
- layout responsivo;
- link direto para o sistema oficial.

## Modo apresentador pelo celular

A apresentação possui um controle remoto em `controle.html`.

1. Abra `index.html` no notebook/projetor.
2. Clique no botão **📱** no topo ou pressione **C**.
3. A apresentação cria um código de sessão e mostra um QR Code.
4. No celular, escaneie o QR Code ou abra `controle.html` e informe o código.
5. O celular passa a mostrar a fala do slide atual e os botões **Voltar** e **Próximo**.
6. Ao mudar o slide pelo celular, o notebook/projetor acompanha em tempo real.

A sincronização usa **Supabase Realtime** e não altera as demandas do sistema.

## Como executar

Basta abrir `index.html` em um navegador moderno. Para controlar de outro dispositivo, publique o projeto na Vercel ou em outro host HTTPS e abra os dois dispositivos pela mesma versão publicada.

## Sistema oficial

https://senai-lab-afonso-greco.vercel.app/

## Estrutura

- `index.html` — conteúdo dos slides;
- `styles.css` — estilos principais;
- `presenter.css` — cartaz final e interface de conexão do celular;
- `script.js` — navegação, tela cheia e sincronização da apresentação;
- `controle.html` — tela do apresentador no celular;
- `controle.css` — visual mobile do controle;
- `controle.js` — falas e comandos em tempo real;
- `assets/capa-sistema.jpg` — tela real usada na abertura;
- `assets/cartaz-acesso.jpg` — cartaz com QR Code usado no encerramento.

> SENAI Lab — Conectando pessoas, ideias e fabricação.
