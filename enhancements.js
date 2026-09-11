(function(){
  'use strict';

  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(typeof goToSlide==='function'){
    goToSlide=function(index){
      const target=Math.max(0,Math.min(slides.length-1,index));
      slides[target].scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
    };
  }

  if(typeof generateSession==='function'&&window.crypto?.getRandomValues){
    generateSession=function(){
      const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const values=new Uint32Array(6);
      crypto.getRandomValues(values);
      return [...values].map(value=>chars[value%chars.length]).join('');
    };
  }

  if(typeof createRealtimeClient==='function'){
    createRealtimeClient=async function(){
      if(realtimeClient)return realtimeClient;
      const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.115.0');
      realtimeClient=createClient(SUPABASE_URL,SUPABASE_KEY,{
        auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
      });
      return realtimeClient;
    };
  }

  if(typeof updateUI==='function'){
    const originalUpdateUI=updateUI;
    updateUI=function(index){
      originalUpdateUI(index);
      dots.forEach((dot,i)=>{
        if(i===index)dot.setAttribute('aria-current','true');
        else dot.removeAttribute('aria-current');
      });
    };
  }

  dots.forEach((dot,index)=>{
    dot.addEventListener('click',event=>{
      event.preventDefault();
      goToSlide(index);
    });
  });

  const fullscreenButton=document.getElementById('fullscreenBtn');
  document.addEventListener('fullscreenchange',()=>{
    const active=Boolean(document.fullscreenElement);
    fullscreenButton?.setAttribute('aria-pressed',String(active));
    fullscreenButton?.setAttribute('aria-label',active?'Sair da tela cheia':'Entrar em tela cheia');
    if(fullscreenButton)fullscreenButton.title=active?'Sair da tela cheia (F)':'Tela cheia (F)';
  });

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const backdrop=document.getElementById('remoteModalBackdrop');
    if(!backdrop?.classList.contains('open'))return;
    event.preventDefault();
    closeRemoteModal();
  });

  const observeRemoteModal=()=>{
    const backdrop=document.getElementById('remoteModalBackdrop');
    if(!backdrop)return;
    backdrop.setAttribute('aria-hidden',backdrop.classList.contains('open')?'false':'true');
    const observer=new MutationObserver(()=>{
      const open=backdrop.classList.contains('open');
      backdrop.setAttribute('aria-hidden',open?'false':'true');
      document.body.classList.toggle('modal-open',open);
      if(open)setTimeout(()=>document.getElementById('remoteCloseBtn')?.focus(),0);
    });
    observer.observe(backdrop,{attributes:true,attributeFilter:['class']});
  };

  observeRemoteModal();

  const initialIndex=slides.findIndex(slide=>`#${slide.id}`===location.hash);
  if(initialIndex>=0){
    updateUI(initialIndex);
    requestAnimationFrame(()=>slides[initialIndex].scrollIntoView({behavior:'auto',block:'start'}));
  }
})();
