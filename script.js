const slides = [...document.querySelectorAll('.slide')];
const navLinks = [...document.querySelectorAll('.dot-nav a')];
const progressBar = document.getElementById('progressBar');
const slideCounter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentIndex = 0;

function goToSlide(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateUI(index) {
  currentIndex = index;
  const id = slides[index].id;

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });

  slideCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });

  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  const index = slides.indexOf(visible.target);
  if (index >= 0) updateUI(index);
}, { threshold: [0.35, 0.55, 0.75] });

slides.forEach(slide => observer.observe(slide));
slides[0]?.classList.add('is-visible');

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

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

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.textContent = document.fullscreenElement ? '✕' : '⛶';
  fullscreenBtn.title = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
});

document.addEventListener('keydown', event => {
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (['input', 'textarea', 'select', 'button'].includes(tag)) return;

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

  if (event.key.toLowerCase() === 'f') {
    event.preventDefault();
    fullscreenBtn.click();
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const index = slides.findIndex(slide => slide.id === id);
    if (index >= 0) goToSlide(index);
  });
});

updateUI(0);