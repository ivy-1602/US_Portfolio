/* ── script.js ── */

// ─── NAV ──────────────────────────────────
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobMenu.classList.toggle('open');
});

document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => {
  burger.classList.remove('open');
  mobMenu.classList.remove('open');
}));

document.addEventListener('click', e => {
  if (!burger.contains(e.target) && !mobMenu.contains(e.target)) {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
  }
});
(function () {
  var splash = document.getElementById('ww-splash');
  var form   = document.getElementById('ww-form');
  var input  = document.getElementById('ww-name');

  if (sessionStorage.getItem('ww-visitor-name')) {
    splash.classList.add('ww-hidden');
  } else {
    input.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = input.value.trim();
    if (!name) return;
    sessionStorage.setItem('ww-visitor-name', name);
    document.dispatchEvent(new CustomEvent('ww:entered', { detail: { name: name } }));

    if (window.__addVisitor) {
      window.__addVisitor(name).catch(function (err) {
        console.error('Could not log visitor:', err);
      });
    }

    splash.classList.add('ww-hidden');
    document.body.style.overflow = '';
  });
  if (!sessionStorage.getItem('ww-visitor-name')) {
    document.body.style.overflow = 'hidden';
  }
})();
function updateActiveNav() {
  const ids = ['s-about','s-projects','s-skills','s-honors','s-beyond'];
  const y = window.scrollY + 100;
  ids.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nl[href="#${id}"]`);
    if (!el || !link) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    link.classList.toggle('active', y >= top && y < top + el.offsetHeight + 500);
  });
}

// ─── SMOOTH SCROLL ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const top = t.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - 72, behavior: 'smooth' });
  });
});

// ─── SCROLL REVEAL ────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('in'), delay);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 6) * 70;
  revealObs.observe(el);
});

// ─── XP BAR ANIMATE ───────────────────────
const xpObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const w = fill.dataset.w || '100';
      fill.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fill.style.width = w + '%';
      }));
      xpObs.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.lb-xp-fill').forEach(f => xpObs.observe(f));

// ─── CANVAS PARTICLES ─────────────────────
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['rgba(139,124,240,', 'rgba(79,208,217,', 'rgba(240,200,102,', 'rgba(232,112,174,', 'rgba(90,174,34,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + .5,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      alpha: Math.random() * .5 + .1,
      color: c,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
}

// ─── BANNER STAGGER REVEAL ────────────────
const bannerObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      bannerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.legend-banner').forEach(b => {
  b.style.animationPlayState = 'paused';
  bannerObs.observe(b);
});

// --- SHOWCASE INTERACTION LAYER --------------------------------------------
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const showcaseCards = document.querySelectorAll('.pm-node, .mm-cluster, .hon-item, .cert-tile');

document.querySelectorAll('.pm-node').forEach((card, i) => {
  card.style.setProperty('--card-num', `"${String(i + 1).padStart(2, '0')}"`);
});

if (motionOK) {
  showcaseCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-y', `${x * 5}deg`);
      card.style.setProperty('--tilt-x', `${y * -5}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

const hotObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('is-hot', entry.isIntersecting && entry.intersectionRatio > 0.55);
  });
}, { threshold: [0, 0.55, 0.8] });

document.querySelectorAll('.pm-node, .mm-cluster, .hon-item').forEach(el => hotObs.observe(el));

// ─── MINDMAP LINES DYNAMIC ────────────────
// draw SVG connector lines from center to each cluster
function drawMindmapLines() {
  const svg = document.querySelector('.mm-lines');
  const center = document.querySelector('.mm-core');
  if (!svg || !center) return;

  const svgRect = svg.getBoundingClientRect();
  const centerRect = center.getBoundingClientRect();
  const cx = centerRect.left + centerRect.width / 2 - svgRect.left;
  const cy = centerRect.top + centerRect.height / 2 - svgRect.top;

  const clusters = document.querySelectorAll('.mm-cluster');
  // remove old lines
  svg.querySelectorAll('line').forEach(l => l.remove());

  clusters.forEach(cl => {
    const cr = cl.getBoundingClientRect();
    const ex = cr.left + cr.width / 2 - svgRect.left;
    const ey = cr.top + cr.height / 2 - svgRect.top;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', ex); line.setAttribute('y2', ey);
    line.setAttribute('stroke', 'rgba(255,255,255,.16)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-dasharray', '1,5');
    svg.appendChild(line);
  });
}

// run after layout
window.addEventListener('load', () => {
  setTimeout(drawMindmapLines, 200);
});
window.addEventListener('resize', drawMindmapLines);
