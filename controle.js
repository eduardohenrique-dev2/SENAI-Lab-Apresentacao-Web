const SUPABASE_URL='https://lnzcrdyqqumvrlgbcofd.supabase.co';
const SUPABASE_KEY='sb_publishable_Fc3j2jCiD5FN8l1t6dI4Rg_9WqeVLWP';

const notes=window.SENAI_PRESENTER_NOTES||[];
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
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.115.0');
  client=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  return client;
}

function normalizeSession(value){
  return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,26);
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
  speakerPoints.replaceChildren(...note.points.map(point=>{
    const li=document.createElement('li');
    li.textContent=point;
    return li;
  }));
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
  if(code.length<20){
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
