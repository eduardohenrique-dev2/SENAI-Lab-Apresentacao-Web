(function(){
  'use strict';

  const updatedNotes=[
    {
      title:'Abertura',
      text:'Pra começar, eu queria mostrar uma solução pensada para organizar o dia a dia do SENAI Lab. A ideia é centralizar as solicitações em um único fluxo, desde o pedido do colaborador até a autorização, a operação da equipe e a conclusão.',
      points:['Centralizar as solicitações','Organizar autorização e operação','Facilitar o acompanhamento']
    },
    {
      title:'Por que criar a plataforma?',
      text:'Quando um pedido chega por mensagem, e-mail, conversa ou de forma presencial, a informação pode ficar espalhada e perder contexto. A plataforma reúne tudo em um único processo, sem deixar o atendimento burocrático.',
      points:['Menos informação espalhada','Um único canal de entrada','Mais clareza durante o atendimento']
    },
    {
      title:'Como funciona no geral',
      text:'O fluxo final ficou bem definido. O colaborador registra a necessidade e recebe um protocolo. A nova demanda vai primeiro para a Administração, que autoriza ou recusa. Somente depois da autorização ela entra na área operacional da equipe do Lab, onde segue para análise, produção e conclusão.',
      points:['Solicitação e protocolo','Triagem da Administração','Equipe recebe somente o que foi autorizado','Produção e conclusão']
    },
    {
      title:'Como o solicitante usa',
      text:'Para quem vai solicitar, o processo continua simples. Não precisa criar conta, mas novas demandas são exclusivas para colaboradores FIEMG e exigem um e-mail terminado em @fiemg.com.br. A pessoa informa o serviço, explica o que precisa e pode anexar os arquivos do projeto.',
      points:['Sem criação de conta','Somente @fiemg.com.br','Formulário objetivo','Possibilidade de anexar arquivos']
    },
    {
      title:'Como acompanhar',
      text:'Depois do envio, o solicitante recebe um protocolo. Com esse protocolo e o mesmo e-mail corporativo, consegue consultar o andamento. Enquanto a demanda ainda não foi liberada para a operação, o sistema deixa claro que ela está aguardando autorização.',
      points:['Consulta por protocolo + e-mail','Status de autorização visível','Mais autonomia para o solicitante']
    },
    {
      title:'Acesso interno por perfil',
      text:'Na área interna, cada pessoa entra com seu próprio acesso e é direcionada para o que precisa fazer. A Administração fica responsável pela triagem das solicitações novas. A equipe do Lab trabalha somente com as demandas que já foram autorizadas.',
      points:['Acesso individual e autenticado','Administração faz a triagem','Equipe trabalha com demandas autorizadas']
    },
    {
      title:'Gestão de cada demanda',
      text:'Depois de autorizada, a demanda entra na operação. A equipe pode atualizar status, prioridade e equipamento. Não existe a necessidade de um responsável fixo, porque o histórico identifica quem realizou cada alteração e quando ela aconteceu.',
      points:['Status','Prioridade','Equipamento','Histórico identifica cada ação']
    },
    {
      title:'Fila de produção',
      text:'Também existe uma regra objetiva para organizar a produção. Quando duas demandas usam o mesmo equipamento e estão previstas para a mesma data, quem solicitou primeiro fica na frente da fila.',
      points:['Mesmo equipamento','Mesma data','Ordem de criação define a fila']
    },
    {
      title:'Comunicação, histórico e controle',
      text:'O sistema mantém o contexto do atendimento. Decisões e mudanças ficam registradas, atualizações importantes podem ser enviadas por e-mail e as áreas internas seguem níveis diferentes de acesso. Isso ajuda a separar triagem, operação e consulta pública.',
      points:['Notificações por e-mail','Histórico por ação e usuário','Permissões separadas por perfil']
    },
    {
      title:'Fechamento',
      text:'No final, a plataforma cria um fluxo mais claro: o colaborador solicita, a Administração autoriza e a equipe executa. Isso reduz controles paralelos e deixa protocolo, andamento, produção e histórico reunidos no mesmo lugar.',
      points:['Uso interno FIEMG','Triagem antes da operação','Demandas centralizadas','Acompanhamento claro']
    },
    {
      title:'Acesso ao sistema',
      text:'E para fechar, aqui está o acesso direto ao sistema. O colaborador FIEMG pode usar o QR Code para entrar. Para abrir uma nova solicitação, utiliza o e-mail corporativo @fiemg.com.br e depois acompanha usando esse mesmo e-mail junto com o protocolo.',
      points:['Escanear o QR Code','Usar e-mail @fiemg.com.br','Abrir uma solicitação','Acompanhar pelo protocolo']
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
