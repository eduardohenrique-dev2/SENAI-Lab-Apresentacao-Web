(function(){
  'use strict';

  const updatedNotes=[
    {
      title:'Abertura — ecossistema atual',
      text:'Hoje a proposta já vai além do Gestão de Demandas. O que temos é um ecossistema digital do Afonso Greco: o Portal organiza a entrada e a comunicação, enquanto os módulos do SENAI Lab continuam especializados em demandas, supervisão operacional e inventário.',
      points:['Portal como porta de entrada','Módulos especializados','Acesso organizado por perfil']
    },
    {
      title:'Da ferramenta isolada para a plataforma',
      text:'No início, cada solução era acessada separadamente. A evolução foi criar um Portal que conecta essas ferramentas sem transformar tudo em um sistema monolítico. Cada módulo continua independente, mas a experiência para o usuário passa a ser muito mais organizada.',
      points:['Menos acessos espalhados','Portal centraliza a experiência','Módulos continuam independentes']
    },
    {
      title:'Portal Afonso Greco',
      text:'O Portal possui uma Home pública para informação e notícias da unidade e uma Área Interna para quem precisa trabalhar nos sistemas. Na Área Interna, o menu é montado de acordo com os acessos liberados para o usuário.',
      points:['Home institucional','Notícias','Área Interna','Menu modular e responsivo']
    },
    {
      title:'Autenticação e permissões',
      text:'A autorização central define quais módulos cada pessoa pode visualizar ou administrar. Isso não é apenas esconder botão: os módulos internos também consultam a permissão antes de manter o acesso. Além do padrão por perfil, é possível criar exceções por usuário.',
      points:['Permissão por perfil','Exceção por usuário','Proteção além da interface','Módulos mantêm suas próprias sessões quando necessário']
    },
    {
      title:'Gestão de Demandas',
      text:'O Gestão de Demandas continua sendo um dos módulos principais. O colaborador abre uma solicitação, recebe protocolo e acompanha o andamento. A Administração faz a triagem e somente as demandas autorizadas chegam à operação da equipe do SENAI Lab.',
      points:['Solicitação pública','Protocolo LAB-XXXX','Triagem administrativa','Equipe e área do Proprietário']
    },
    {
      title:'SENAI Lab Vision',
      text:'O Vision leva o fluxo operacional para uma tela de acompanhamento no laboratório. A TV é somente leitura, recebe atualizações em tempo real e possui fallback automático. A edição fica separada em uma área protegida do Proprietário.',
      points:['Painel TV somente leitura','Tempo real + fallback','Status e categorias','Gestão protegida']
    },
    {
      title:'Inventário',
      text:'O Inventário amplia a rastreabilidade do laboratório. Ele reúne patrimônio, localização, movimentações, empréstimos, manutenção, QR Code, relatórios e inventário físico. Também existe importação de planilhas e PDFs com prévia antes da confirmação.',
      points:['Patrimônio e estoque','Empréstimos e manutenção','QR Code','Importação e auditoria']
    },
    {
      title:'Central do Proprietário',
      text:'Para o perfil Proprietário foi criada uma central exclusiva. Em vez de procurar cada área administrativa separadamente, essa página reúne os atalhos para Demandas, Vision, Inventário, notícias e permissões. Outros perfis não enxergam nem acessam essa rota.',
      points:['Exclusiva para Proprietário','Atalhos de gestão','Demandas, Vision e Inventário','Portal e permissões']
    },
    {
      title:'Comunicação e governança',
      text:'O Portal também virou uma camada de comunicação e governança. A Administração de Notícias publica conteúdo da Home, enquanto Usuários e Permissões controla quais módulos cada conta pode visualizar ou administrar.',
      points:['Notícias e destaques','Rascunhos e agendamento','Permissões por módulo','Controle individual por usuário']
    },
    {
      title:'Resultado atual',
      text:'O resultado é uma plataforma modular: o Portal centraliza a experiência, mas cada sistema continua fazendo bem o seu papel. Isso permite crescer por módulos, preservar segurança e evitar misturar responsabilidades diferentes em um único código.',
      points:['Portal central','Demandas','Vision','Inventário','Central do Proprietário','Administração modular']
    },
    {
      title:'Acesso ao Portal',
      text:'Para fechar, o QR Code agora aponta para o Portal Afonso Greco, que é a porta de entrada atual. Na Home ficam as informações e notícias. Na Área Interna, cada usuário entra e visualiza somente os módulos liberados para o seu perfil.',
      points:['Acessar o Portal','Consultar notícias','Entrar na Área Interna','Abrir somente os módulos autorizados']
    }
  ];

  const position=document.getElementById('slidePosition');
  const title=document.getElementById('speakerTitle');
  const text=document.getElementById('speakerText');
  const points=document.getElementById('speakerPoints');
  if(!position||!title||!text||!points)return;

  function currentSlideIndex(){
    const match=position.textContent.match(/Slide\s+(\d+)/i);
    const number=match?Number(match[1]):1;
    return Math.max(0,Math.min(updatedNotes.length-1,number-1));
  }

  function applyUpdatedNote(){
    const note=updatedNotes[currentSlideIndex()];
    if(!note)return;
    title.textContent=note.title;
    text.textContent=note.text;
    points.replaceChildren(...note.points.map(point=>{
      const li=document.createElement('li');
      li.textContent=point;
      return li;
    }));
  }

  const observer=new MutationObserver(applyUpdatedNote);
  observer.observe(position,{childList:true,characterData:true,subtree:true});
  applyUpdatedNote();
})();