// Carrega a camada visual institucional SENAI sem depender de imagens.
const senaiTheme = document.createElement('link');
senaiTheme.rel = 'stylesheet';
senaiTheme.href = 'senai-theme.css';
document.head.appendChild(senaiTheme);

const slides = [...document.querySelectorAll('.slide')];
const navLinks = [...document.querySelectorAll('.rail-nav a')];
const progressBar = document.getElementById('progressBar');
const slideCounter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentIndex = 0;

function senaiWordmark() {
  return `
    <span class="senai-wordmark" aria-label="SENAI Lab">
      <span class="senai-glyph" aria-hidden="true"></span>
      <span>SENAI<span class="lab-accent">Lab</span></span>
    </span>`;
}

function aplicarIdentidadeSenai() {
  // Ajusta a marca no menu lateral.
  const railBrand = document.querySelector('.rail .brand');
  if (railBrand) {
    railBrand.innerHTML = `
      ${senaiWordmark()}
      <span class="brand-unit"><small>Gestão de Demandas</small></span>`;
  }

  // Cabeçalho institucional em todos os slides.
  slides.forEach((slide) => {
    if (!slide.querySelector('.slide-brand')) {
      const brand = document.createElement('div');
      brand.className = 'slide-brand';
      brand.innerHTML = `
        ${senaiWordmark()}
        <span class="unit">SENAI Afonso Greco · Sistema de Gestão de Demandas</span>`;
      slide.prepend(brand);
    }

    // Selo contextual no conteúdo principal.
    const contentTarget = slide.querySelector('.hero-copy, .head, .half > .eyebrow, .two > div > .eyebrow, .dark-card > .eyebrow');
    if (contentTarget && !slide.querySelector('.senai-system-badge')) {
      const badge = document.createElement('span');
      badge.className = 'senai-system-badge';
      badge.textContent = 'SENAI Lab · Apresentação institucional';

      if (contentTarget.classList?.contains('eyebrow')) {
        contentTarget.parentElement.insertBefore(badge, contentTarget);
      } else {
        contentTarget.prepend(badge);
      }
    }
  });
}

function goToSlide(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateUI(index) {
  currentIndex = index;
  const current = slides[index];
  const id = current.id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));

  if (slideCounter) {
    slideCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  if (progressBar) {
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  }

  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === slides.length - 1;
}

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  const index = slides.indexOf(visible.target);
  if (index >= 0) updateUI(index);
}, { threshold: [0.45, 0.6, 0.75] });

slides.forEach(slide => observer.observe(slide));

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Tela cheia indisponível neste navegador.', error);
    }
  });
}

document.addEventListener('fullscreenchange', () => {
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = document.fullscreenElement ? '✕' : '⛶';
  fullscreenBtn.title = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
});

document.addEventListener('keydown', (event) => {
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  }

  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goToSlide(currentIndex - 1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    goToSlide(0);
  }

  if (event.key === 'End') {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }

  if (event.key.toLowerCase() === 'f' && fullscreenBtn) {
    fullscreenBtn.click();
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    const index = slides.findIndex(slide => slide.id === id);
    if (index >= 0) currentIndex = index;
  });
});

aplicarIdentidadeSenai();
updateUI(0);
