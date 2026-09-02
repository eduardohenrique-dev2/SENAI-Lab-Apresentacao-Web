const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.dots a')];
const progressBar=document.getElementById('progressBar');
const slideCounter=document.getElementById('slideCounter');
const prevBtn=document.getElementById('prevSlide');
const nextBtn=document.getElementById('nextSlide');
const fullscreenBtn=document.getElementById('fullscreenBtn');
let currentIndex=0;

function goToSlide(index){
  const target=Math.max(0,Math.min(slides.length-1,index));
  slides[target].scrollIntoView({behavior:'smooth',block:'start'});
}

function updateUI(index){
  currentIndex=index;
  slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
  slideCounter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  progressBar.style.width=`${((index+1)/slides.length)*100}%`;
  prevBtn.disabled=index===0;
  nextBtn.disabled=index===slides.length-1;
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
updateUI(0);
