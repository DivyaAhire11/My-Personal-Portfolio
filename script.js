'use strict';

// ─── UTILS ────────────────────────────────
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

// ─── 1. (typewriter removed — element no longer in hero) ───

// ─── 2. PARTICLE CANVAS (CYBER GREEN & TEAL GLIMS) ───
(function initParticles() {
  const canvas = qs('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['#10b981', '#06b6d4', '#34d399', '#38bdf8'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle(random) {
    return {
      x: Math.random() * (W || 800),
      y: random ? Math.random() * (H || 600) : (H || 600) + 10,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.15),
      a: Math.random() * 0.5 + 0.1,
      da: (Math.random() * 0.0015 + 0.0008) * (Math.random() > 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function spawn() {
    const n = Math.floor((W * H) / 9500);
    particles = Array.from({ length: n }, () => mkParticle(true));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a < 0.05 || p.a > 0.7) p.da *= -1;
      if (p.y < -10) particles[i] = mkParticle(false);

      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.fillStyle   = p.color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  resize(); spawn(); draw();
  window.addEventListener('resize', () => { resize(); spawn(); }, { passive: true });
})();

// ─── 3. SCROLL REVEAL ─────────────────────
(function scrollReveal() {
  document.documentElement.classList.add('js-ready');
  const els = qsa('.reveal');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  // Check elements already visible or observe
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      io.observe(el);
    }
  });

  // Stagger children within work-grid
  qsa('.work-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 120}ms`;
  });
})();


// ─── 4. (skill bar animation removed — bars replaced with chips) ───


// ─── 5. STICKY NAV & ACTIVE LINK ──────────
window.addEventListener('scroll', () => {
  const nav = qs('#nav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);

  // Active section link highlighting
  const sections = qsa('section[id]');
  let active = '';
  sections.forEach(s => {
    const top = s.offsetTop - 120;
    const height = s.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      active = s.id;
    }
  });

  qsa('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
  });
}, { passive: true });

// ─── 6. MOBILE NAVIGATION DRAWER ──────────
(function initMobileNav() {
  const toggle = qs('#nav-toggle');
  const menu = qs('#nav-menu');
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle('open', isOpen);
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    setOpen(!isOpen);
  });

  qsa('.nav-link', menu).forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('open')) {
      setOpen(false);
    }
  }, { passive: true });
})();

// ─── 7. COPY EMAIL TO CLIPBOARD ───────────
(function initCopyEmail() {
  const btn = qs('#btn-copy-email');
  const text = qs('#copy-email-text');
  if (!btn || !text) return;

  const email = btn.dataset.email || 'divyaahire246@gmail.com';
  let timer = null;

  btn.addEventListener('click', async () => {
    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        copied = true;
      } catch (e) {
        copied = false;
      }
      document.body.removeChild(ta);
    }

    if (copied) {
      btn.classList.add('copied');
      text.textContent = 'Copied! ✓';
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('copied');
        text.textContent = 'Copy Email';
      }, 2000);
    }
  });
})();

// ─── 8. KONAMI CODE EASTER EGG ────────────
(function() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let i = 0;
  document.addEventListener('keydown', e => {
    i = (e.keyCode === code[i]) ? i + 1 : 0;
    if (i === code.length) {
      i = 0;
      document.body.style.filter = 'hue-rotate(200deg)';
      setTimeout(() => document.body.style.filter = '', 2000);
    }
  });
})();
