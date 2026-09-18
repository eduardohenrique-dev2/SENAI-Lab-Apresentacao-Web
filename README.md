# Portal Afonso Greco + SENAI Lab — Apresentação Web

Apresentação web do **ecossistema digital Afonso Greco**, atualizada para refletir a estrutura atual em produção.

O projeto deixou de apresentar somente o **Sistema de Gestão de Demandas** e passou a mostrar a arquitetura completa:

**Portal Afonso Greco → Área Interna por perfil → módulos SENAI Lab → gestão centralizada.**

## O que a apresentação mostra

- Portal Afonso Greco como porta de entrada institucional;
- Home pública com notícias;
- Área Interna autenticada;
- menu modular por perfil e por usuário;
- Gestão de Demandas;
- SENAI Lab Vision;
- SENAI Lab Inventário;
- Central do Proprietário;
- Administração de Notícias;
- Usuários e Permissões;
- proteção das áreas internas por módulo;
- crescimento modular sem transformar todos os sistemas em um único código.

## Estrutura apresentada

### Portal Afonso Greco

Centraliza comunicação, descoberta dos módulos, autenticação da Área Interna, autorização central, notícias, permissões e a Central do Proprietário.

### Gestão de Demandas

Fluxo: **Solicitação → protocolo → triagem → autorização → operação → acompanhamento.**

A área pública continua simples para quem solicita, enquanto Administração, Equipe e Proprietário possuem áreas próprias.

### SENAI Lab Vision

Painel operacional para TV com atualização em tempo real, fallback automático, quadro por status e categoria, QR Code para acompanhamento e área de gestão separada. A TV permanece somente leitura.

### SENAI Lab Inventário

Rastreabilidade do patrimônio com equipamentos, materiais, componentes, consumíveis, localização física, movimentações, empréstimos, manutenção, QR Code, inventário físico, auditoria, relatórios e importação de planilhas/PDFs com prévia antes da confirmação.

### Central do Proprietário

Área exclusiva para o perfil **Proprietário**, reunindo acessos administrativos de Gestão de Demandas, Vision, Inventário, Notícias e Usuários/Permissões.

## Autenticação e permissões

A Área Interna do Portal monta os módulos disponíveis de acordo com o perfil do usuário e com exceções configuradas individualmente.

A autorização central organiza o acesso, mas os módulos continuam independentes e podem manter suas próprias sessões de autenticação quando necessário.

## Recursos da apresentação

- 11 slides responsivos;
- HTML + CSS + JavaScript puro;
- identidade visual SENAI Lab;
- navegação por teclado, botões e pontos laterais;
- tecla **F** para tela cheia;
- tecla **C** para controle pelo celular;
- contador e barra de progresso;
- modo apresentador;
- notas atualizadas para os 11 slides;
- sincronização do controle via Supabase Realtime;
- suporte a `prefers-reduced-motion`;
- modo de impressão;
- cabeçalhos de segurança para Vercel.

## Modo apresentador pelo celular

1. Abra a apresentação no notebook ou projetor.
2. Clique no botão **📱** ou pressione **C**.
3. A apresentação gera um código e um QR Code.
4. No celular, abra `controle.html` ou escaneie o QR Code.
5. O celular mostra a fala correspondente ao slide atual.
6. Use **Voltar** e **Próximo** para controlar a apresentação.

## Links atuais

**Portal Afonso Greco**  
https://portal-afonso-greco.vercel.app/

**Gestão de Demandas**  
https://senai-lab-afonso-greco.vercel.app/

**SENAI Lab Vision**  
https://senai-lab-vision.vercel.app/

**SENAI Lab Inventário**  
https://senai-lab-invent-rio.vercel.app/

**Apresentação**  
https://senai-lab-apresentacao-web.vercel.app/

> SENAI Afonso Greco — informação, serviços e inovação em um só lugar.
