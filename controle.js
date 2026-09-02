const SUPABASE_URL='https://lnzcrdyqqumvrlgbcofd.supabase.co';
const SUPABASE_KEY='sb_publishable_Fc3j2jCiD5FN8l1t6dI4Rg_9WqeVLWP';

const notes=[
  {
    title:'Abertura',
    text:'Pra começar, eu queria mostrar uma solução que a gente montou pensando no dia a dia do SENAI Lab. A ideia foi pegar as solicitações que antes podiam chegar de vários jeitos e colocar tudo em um fluxo mais simples, tanto para quem pede quanto para quem vai atender.',
    points:['Centralizar as solicitações','Facilitar para o solicitante','Dar mais organização para a equipe']
  },
  {
    title:'Por que criar a plataforma?',
    text:'Hoje um pedido pode chegar numa conversa, por mensagem, por e-mail ou pessoalmente. Quando isso acontece, a informação fica espalhada e é fácil perder contexto. Então a plataforma entra justamente para reunir tudo em um lugar só, sem transformar o processo em algo burocrático.',
    points:['Informação espalhada dificulta o controle','Um único canal deixa o processo mais claro','A ideia é organizar, não complicar']
  },
  {
    title:'Como funciona no geral',
    text:'O fluxo é bem direto. A pessoa registra o que precisa, o sistema gera um protocolo e a equipe recebe essa demanda. Depois a gente analisa, define responsável, equipamento e andamento, até chegar na produção e na conclusão do atendimento.',
    points:['Solicitação','Protocolo automático','Análise da equipe','Produção e conclusão']
  },
  {
    title:'Como o solicitante usa',
    text:'Para quem vai solicitar, eu procurei deixar o processo bem simples. Não precisa criar conta. A pessoa informa os dados principais, explica o que precisa, coloca quantidade e data e, se tiver algum arquivo do projeto, já consegue anexar junto.',
    points:['Sem criação de conta','Formulário curto e objetivo','Arquivos podem ir junto com o pedido']
  },
  {
    title:'Como acompanhar',
    text:'Depois de enviar, a pessoa recebe um protocolo. Com esse protocolo e o mesmo e-mail usado na solicitação, ela consegue consultar o andamento. Isso evita aquela necessidade de ficar perguntando toda hora se já foi analisado ou se já entrou em produção.',
    points:['Consulta por protocolo + e-mail','Não precisa login','Mais autonomia para quem solicitou']
  },
  {
    title:'Área da equipe',
    text:'Na parte interna a lógica muda um pouco, porque aqui o acesso é individual e só entra quem está autorizado. O painel dá uma visão rápida do que está aberto, do que está em análise, do que está em produção e do que já foi finalizado.',
    points:['Acesso individual','Somente equipe autorizada','Visão rápida das demandas']
  },
  {
    title:'Gestão de cada demanda',
    text:'Dentro de cada pedido, a equipe consegue atualizar o que realmente importa para a operação. A gente define o status, a prioridade, quem vai ficar responsável e qual equipamento será usado. Assim essas informações não ficam dependendo de conversa ou da memória de alguém.',
    points:['Status','Prioridade','Responsável','Equipamento']
  },
  {
    title:'Fila de produção',
    text:'Também tem uma lógica simples para organizar a fila. Quando duas demandas usam o mesmo equipamento e estão previstas para a mesma data, quem solicitou primeiro fica na frente. É um critério objetivo e fácil de explicar para todo mundo.',
    points:['Mesmo equipamento','Mesma data','Ordem de criação define a fila']
  },
  {
    title:'Comunicação e histórico',
    text:'Outra coisa importante é não perder o contexto do atendimento. As mudanças ficam registradas no histórico e algumas atualizações são enviadas por e-mail. Também existe o cuidado com privacidade, porque a pessoa recebe o aviso antes de enviar os dados.',
    points:['Notificações por e-mail','Histórico das alterações','Aviso de privacidade']
  },
  {
    title:'Fechamento',
    text:'No fim, a proposta é bem simples: facilitar para quem solicita e dar mais clareza para quem gerencia. Em vez de ter informação espalhada, a gente passa a ter demanda, responsável, andamento e histórico reunidos no mesmo lugar.',
    points:['Mais organização','Acompanhamento mais claro','Menos controle paralelo']
  },
  {
    title:'Acesso ao sistema',
    text:'E para fechar, aqui está o acesso direto. Quem quiser usar a plataforma pode apontar a câmera para o QR Code e entrar no sistema. A partir dali já consegue abrir uma nova solicitação ou acompanhar uma que já foi enviada.',
    points:['Escanear o QR Code','Abrir uma solicitação','Acompanhar uma demanda existente']
  }
];

const joinView=document.getElementById('joinView');
const presenterView=document.getElementById('presenterView');
const mobileControls=document.getElementById('mobileControls');
const sessionInput=document.getElementById('sessionInput');
const connectBtn=document.getElementById('connectBtn');
const connectionBadge=document.getElementById('connectionBadge');
const slidePosition=document.getElementById('slidePosition');
const mobileProgress=document.getElementById('mobileProgress');
const speakerTitle=document.getElementById('speakerTitle');
const speakerText=document.getElementById('speakerText');
const speakerPoints=document.getElementById('speakerPoints');
const sessionLabel=document.getElementById('sessionLabel');
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const homeBtn=document.getElementById('homeBtn');
const disconnectBtn=document.getElementById('disconnectBtn');
const timer=document.getElementById('timer');

let client=null;
let channel=null;
let session='';
let currentIndex=0;
let total=notes.length;
let connectedToScreen=false;
let startedAt=null;
let timerId=null;

async function createRealtimeClient(){
  if(client)return client;
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  client=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  return client;
}

function normalizeSession(value){
  return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
}

function setBadge(text,online=false){
  connectionBadge.textContent=text;
  connectionBadge.classList.toggle('online',online);
}

function render(){
  currentIndex=Math.max(0,Math.min(total-1,currentIndex));
  const note=notes[currentIndex]||notes[notes.length-1];
  slidePosition.textContent=`Slide ${currentIndex+1} de ${total}`;
  mobileProgress.style.width=`${((currentIndex+1)/total)*100}%`;
  speakerTitle.textContent=note.title;
  speakerText.textContent=note.text;
  speakerPoints.innerHTML=note.points.map(point=>`<li>${point}</li>`).join('');
  prevBtn.disabled=currentIndex===0;
  homeBtn.disabled=currentIndex===0;
  nextBtn.disabled=currentIndex>=total-1;
}

function startTimer(){
  if(startedAt)return;
  startedAt=Date.now();
  timerId=setInterval(()=>{
    const seconds=Math.floor((Date.now()-startedAt)/1000);
    const min=String(Math.floor(seconds/60)).padStart(2,'0');
    const sec=String(seconds%60).padStart(2,'0');
    timer.textContent=`${min}:${sec}`;
  },1000);
}

async function connect(sessionCode){
  const code=normalizeSession(sessionCode);
  if(code.length<4){
    sessionInput.focus();
    return;
  }
  session=code;
  sessionInput.value=code;
  connectBtn.disabled=true;
  connectBtn.textContent='Conectando...';
  setBadge('Conectando');

  try{
    const realtime=await createRealtimeClient();
    if(channel)await realtime.removeChannel(channel);

    channel=realtime.channel(`senai-apresentacao:${session}`);
    channel
      .on('broadcast',{event:'state'},({payload})=>{
        if(Number.isInteger(payload?.index))currentIndex=payload.index;
        if(Number.isInteger(payload?.total))total=payload.total;
        connectedToScreen=true;
        setBadge('Conectado',true);
        startTimer();
        render();
      })
      .on('broadcast',{event:'presentation-online'},()=>{
        connectedToScreen=true;
        setBadge('Conectado',true);
      });

    await new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(new Error('timeout')),10000);
      channel.subscribe(status=>{
        if(status==='SUBSCRIBED'){
          clearTimeout(timeout);
          resolve();
        }
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
          clearTimeout(timeout);
          reject(new Error(status));
        }
      });
    });

    joinView.hidden=true;
    presenterView.hidden=false;
    mobileControls.hidden=false;
    sessionLabel.textContent=session;
    history.replaceState(null,'',`${location.pathname}?session=${encodeURIComponent(session)}`);
    setBadge('Aguardando tela');
    render();

    await channel.send({type:'broadcast',event:'controller-online',payload:{at:Date.now()}});
    await channel.send({type:'broadcast',event:'request-state',payload:{at:Date.now()}});
  }catch(error){
    console.error('Falha ao conectar controle:',error);
    setBadge('Falha ao conectar');
    connectBtn.disabled=false;
    connectBtn.textContent='Conectar à apresentação';
  }
}

async function sendSlide(index){
  if(!channel)return;
  const target=Math.max(0,Math.min(total-1,index));
  currentIndex=target;
  render();
  await channel.send({type:'broadcast',event:'control',payload:{action:'goto',index:target,at:Date.now()}});
}

async function disconnect(){
  if(client&&channel)await client.removeChannel(channel);
  channel=null;
  session='';
  connectedToScreen=false;
  if(timerId)clearInterval(timerId);
  timerId=null;
  startedAt=null;
  timer.textContent='00:00';
  presenterView.hidden=true;
  mobileControls.hidden=true;
  joinView.hidden=false;
  connectBtn.disabled=false;
  connectBtn.textContent='Conectar à apresentação';
  setBadge('Desconectado');
  history.replaceState(null,'',location.pathname);
}

sessionInput.addEventListener('input',()=>{sessionInput.value=normalizeSession(sessionInput.value)});
sessionInput.addEventListener('keydown',event=>{if(event.key==='Enter')connect(sessionInput.value)});
connectBtn.addEventListener('click',()=>connect(sessionInput.value));
prevBtn.addEventListener('click',()=>sendSlide(currentIndex-1));
nextBtn.addEventListener('click',()=>sendSlide(currentIndex+1));
homeBtn.addEventListener('click',()=>sendSlide(0));
disconnectBtn.addEventListener('click',disconnect);

const initialSession=normalizeSession(new URLSearchParams(location.search).get('session'));
if(initialSession){sessionInput.value=initialSession;connect(initialSession)}
