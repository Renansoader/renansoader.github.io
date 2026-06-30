/* =========================================================
   Renan Henry Portfolio — script.js
   ========================================================= */

// ---- SPLASH SCREEN ----
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Mostra só uma vez por sessão
  if (sessionStorage.getItem('splashSeen')) {
    splash.remove();
    return;
  }

  document.body.style.overflow = 'hidden';

  const text = 'Olá, amigo.';
  const typedEl = document.getElementById('splashTyped');
  const fadeEl  = document.getElementById('splashFade');
  const cursor  = '<span class="splash__cursor">|</span>';
  let i = 0;

  function typeChar() {
    typedEl.innerHTML = text.slice(0, i) + cursor;
    if (i < text.length) {
      i++;
      setTimeout(typeChar, 85);
    } else {
      // Digitação concluída → fade in da segunda linha
      setTimeout(() => fadeEl.classList.add('splash__line--visible'), 450);
    }
  }

  // Inicia digitação após pequeno delay inicial
  setTimeout(typeChar, 350);

  // Após 3 s totais → fade out
  setTimeout(() => {
    splash.classList.add('splash--out');
    setTimeout(() => {
      splash.remove();
      document.body.style.overflow = '';
      sessionStorage.setItem('splashSeen', '1');
    }, 700);
  }, 5000);
})();

// ---- NAV scroll state ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- Mobile burger ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Typed effect ----
const roles = [
  'Desenvolvedor Back-end',
  'Apaixonado por código limpo',
  'Construtor de produtos digitais',
  'Open source enthusiast',
];

const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;

function tick() {
  const current = roles[roleIdx];
  typedEl.textContent = deleting
    ? current.slice(0, charIdx--)
    : current.slice(0, charIdx++);

  if (!deleting && charIdx > current.length) {
    deleting = true;
    setTimeout(tick, 1800);
    return;
  }
  if (deleting && charIdx < 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(tick, 400);
    return;
  }

  setTimeout(tick, deleting ? 45 : 80);
}

setTimeout(tick, 600);

// ---- AOS (Animate on Scroll) ----
const aosEls = document.querySelectorAll('[data-aos]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('aos-visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

aosEls.forEach(el => observer.observe(el));

// ---- Skill bars animate on scroll ----
const skillBars = document.querySelectorAll('.skill-bar__fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

skillBars.forEach(bar => barObserver.observe(bar));

// ---- Contact form ----
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Preencha todos os campos.';
    feedback.className = 'form__feedback error';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = 'Informe um e-mail válido.';
    feedback.className = 'form__feedback error';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      feedback.textContent = 'Mensagem enviada! Responderei em breve.';
      feedback.className = 'form__feedback success';
      form.reset();
    } else {
      feedback.textContent = 'Erro ao enviar. Tente novamente.';
      feedback.className = 'form__feedback error';
    }
  } catch {
    feedback.textContent = 'Erro de conexão. Tente novamente.';
    feedback.className = 'form__feedback error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 5000);
  }
});

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
  });
}, { passive: true });
