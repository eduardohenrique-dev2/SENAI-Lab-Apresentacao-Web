const SUPABASE_URL='https://lnzcrdyqqumvrlgbcofd.supabase.co';
const SUPABASE_KEY='sb_publishable_Fc3j2jCiD5FN8l1t6dI4Rg_9WqeVLWP';

const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.dots a')];
const progressBar=document.getElementById('progressBar');
const slideCounter=document.getElementById('slideCounter');
const prevBtn=document.getElementById('prevSlide');
const nextBtn=document.getElementById('nextSlide');
const fullscreenBtn=document.getElementById('fullscreenBtn');
let currentIndex=0;

let realtimeClient=null;
let remoteChannel=null;
let remoteSession=sessionStorage.getItem('senai-presenter-session')||'';
let remoteReady=false;
let controllerOnline=false;

function goToSlide(index){
  const target=Math.max(0,Math.min(slides.length-1,index));
  slides[target].scrollIntoView({behavior:'smooth',block:'start'});
}

async function broadcastState(){
  if(!remoteChannel||!remoteReady)return;
  try{
    await remoteChannel.send({
      type:'broadcast',
      event:'state',
      payload:{index:currentIndex,total:slides.length,at:Date.now()}
    });
  }catch(error){console.warn('Não foi possível sincronizar o slide.',error)}
}

function updateUI(index){
  currentIndex=index;
  slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
  slideCounter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  progressBar.style.width=`${((index+1)/slides.length)*100}%`;
  prevBtn.disabled=index===0;
  nextBtn.disabled=index===slides.length-1;
  broadcastState();
}

const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  const index=slides.indexOf(visible.target);
  if(index>=0)updateUI(index);
},{threshold:[.45,.6,.75]});

slides.forEach(slide=>observer.observe(slide));
prevBtn.addEventListener('click',()=>goToSlide(currentIndex-1));
nextBtn.addEventListener('click',()=>goToSlide(currentIndex+1));

document.addEventListener('keydown',event=>{
  const tag=document.activeElement?.tagName?.toLowerCase();
  if(['input','textarea','select'].includes(tag))return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)){event.preventDefault();goToSlide(currentIndex+1)}
  if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();goToSlide(currentIndex-1)}
  if(event.key==='Home'){event.preventDefault();goToSlide(0)}
  if(event.key==='End'){event.preventDefault();goToSlide(slides.length-1)}
  if(event.key.toLowerCase()==='f')fullscreenBtn.click();
  if(event.key.toLowerCase()==='c')openRemoteModal();
});

fullscreenBtn.addEventListener('click',async()=>{
  try{
    if(!document.fullscreenElement)await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(error){console.warn('Tela cheia indisponível.',error)}
});

document.addEventListener('fullscreenchange',()=>{
  fullscreenBtn.textContent=document.fullscreenElement?'✕':'⛶';
});

dots.forEach((dot,index)=>dot.addEventListener('click',()=>{currentIndex=index}));

function generateSession(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code='';
  for(let i=0;i<6;i++)code+=chars[Math.floor(Math.random()*chars.length)];
  return code;
}

async function createRealtimeClient(){
  if(realtimeClient)return realtimeClient;
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  realtimeClient=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  return realtimeClient;
}

function buildRemoteUi(){
  const topActions=document.querySelector('.top-actions');
  const remoteBtn=document.createElement('button');
  remoteBtn.id='remotePresenterBtn';
  remoteBtn.className='remote-control-btn';
  remoteBtn.type='button';
  remoteBtn.title='Controle pelo celular (C)';
  remoteBtn.setAttribute('aria-label','Abrir modo apresentador pelo celular');
  remoteBtn.textContent='📱';
  topActions.insertBefore(remoteBtn,fullscreenBtn);

  const backdrop=document.createElement('div');
  backdrop.id='remoteModalBackdrop';
  backdrop.className='remote-modal-backdrop';
  backdrop.innerHTML=`
    <div class="remote-modal" role="dialog" aria-modal="true" aria-labelledby="remoteModalTitle">
      <div class="remote-modal-head">
        <div><small>Modo apresentador</small><h3 id="remoteModalTitle">Controle pelo celular</h3></div>
        <button class="remote-close" id="remoteCloseBtn" aria-label="Fechar">✕</button>
      </div>
      <div class="remote-grid">
        <div>
          <div class="remote-code-box">
            <p>Código desta apresentação</p>
            <div id="remoteSessionCode" class="remote-session-code">------</div>
            <div id="remoteStatus" class="remote-status">Preparando sessão</div>
          </div>
          <div id="remoteLink" class="remote-link"></div>
          <div class="remote-actions">
            <button class="primary" id="copyRemoteLink">Copiar link</button>
            <a class="secondary" id="openRemoteLink" target="_blank" rel="noopener">Abrir controle</a>
            <button class="secondary" id="newRemoteSession">Nova sessão</button>
          </div>
        </div>
        <div class="remote-qr"><img id="remoteQr" alt="QR Code para abrir o controle no celular"></div>
      </div>
      <p class="remote-help">No celular, escaneie o QR Code. Sua tela mostrará as falas do slide atual e os botões <strong>Voltar</strong> e <strong>Próximo</strong>. O público continua vendo somente a apresentação.</p>
    </div>`;
  document.body.appendChild(backdrop);

  remoteBtn.addEventListener('click',openRemoteModal);
  document.getElementById('remoteCloseBtn').addEventListener('click',closeRemoteModal);
  backdrop.addEventListener('click',event=>{if(event.target===backdrop)closeRemoteModal()});
  document.getElementById('copyRemoteLink').addEventListener('click',copyRemoteLink);
  document.getElementById('newRemoteSession').addEventListener('click',startNewRemoteSession);
}

function getControllerUrl(){
  const url=new URL('controle.html',location.href);
  url.hash='';
  url.search='';
  url.searchParams.set('session',remoteSession);
  return url.href;
}

function refreshRemoteModal(){
  if(!remoteSession)return;
  const url=getControllerUrl();
  const code=document.getElementById('remoteSessionCode');
  const link=document.getElementById('remoteLink');
  const openLink=document.getElementById('openRemoteLink');
  const qr=document.getElementById('remoteQr');
  if(code)code.textContent=remoteSession;
  if(link)link.textContent=url;
  if(openLink)openLink.href=url;
  if(qr)qr.src=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(url)}`;
  updateRemoteStatus();
}

function updateRemoteStatus(){
  const status=document.getElementById('remoteStatus');
  const btn=document.getElementById('remotePresenterBtn');
  if(!status||!btn)return;
  if(controllerOnline){
    status.textContent='Celular conectado';
    status.classList.add('online');
    btn.classList.add('connected');
  }else if(remoteReady){
    status.textContent='Aguardando o celular';
    status.classList.remove('online');
    btn.classList.remove('connected');
  }else{
    status.textContent='Preparando sessão';
    status.classList.remove('online');
    btn.classList.remove('connected');
  }
}

async function connectRemoteSession(code){
  remoteSession=code||remoteSession||generateSession();
  sessionStorage.setItem('senai-presenter-session',remoteSession);
  controllerOnline=false;
  remoteReady=false;
  updateRemoteStatus();
  refreshRemoteModal();

  try{
    const client=await createRealtimeClient();
    if(remoteChannel)await client.removeChannel(remoteChannel);

    remoteChannel=client.channel(`senai-apresentacao:${remoteSession}`);
    remoteChannel
      .on('broadcast',{event:'control'},({payload})=>{
        if(payload?.action==='goto'&&Number.isInteger(payload.index)){
          goToSlide(payload.index);
          setTimeout(broadcastState,180);
        }
      })
      .on('broadcast',{event:'request-state'},()=>broadcastState())
      .on('broadcast',{event:'controller-online'},async()=>{
        controllerOnline=true;
        updateRemoteStatus();
        await remoteChannel.send({type:'broadcast',event:'presentation-online',payload:{at:Date.now()}});
        await broadcastState();
      });

    remoteChannel.subscribe(async status=>{
      if(status==='SUBSCRIBED'){
        remoteReady=true;
        updateRemoteStatus();
        await broadcastState();
      }
      if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'){
        remoteReady=false;
        updateRemoteStatus();
      }
    });
  }catch(error){
    console.error('Falha ao iniciar modo apresentador:',error);
    remoteReady=false;
    updateRemoteStatus();
  }
}

async function openRemoteModal(){
  const backdrop=document.getElementById('remoteModalBackdrop');
  backdrop.classList.add('open');
  if(!remoteSession)remoteSession=generateSession();
  refreshRemoteModal();
  await connectRemoteSession(remoteSession);
}

function closeRemoteModal(){
  document.getElementById('remoteModalBackdrop')?.classList.remove('open');
}

async function copyRemoteLink(){
  const button=document.getElementById('copyRemoteLink');
  const url=getControllerUrl();
  try{
    await navigator.clipboard.writeText(url);
    button.textContent='Link copiado ✓';
    setTimeout(()=>button.textContent='Copiar link',1600);
  }catch{
    window.prompt('Copie este link:',url);
  }
}

async function startNewRemoteSession(){
  remoteSession=generateSession();
  sessionStorage.setItem('senai-presenter-session',remoteSession);
  refreshRemoteModal();
  await connectRemoteSession(remoteSession);
}

buildRemoteUi();
updateUI(0);
