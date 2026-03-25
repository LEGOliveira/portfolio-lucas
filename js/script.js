/* ═══════════════════════════════════════
   PORTFOLIO — script.js
   Vanilla JS: Canvas BG, Cursor, Typed,
   Scroll Reveal, Counter, Form, Nav
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // INICIALIZAÇÃO CORRETA - Usando a sua Public Key
  emailjs.init("KeZ7Wc9Hbhpe55wX5");

  // ─────────────────────────────────────
  // 1. ANIMATED + INTERACTIVE CANVAS BACKGROUND
  // ─────────────────────────────────────
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], ripples = [];

  let mouseX = 0, mouseY = 0;
  let smoothX = 0, smoothY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  canvas.addEventListener('click', e => {
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.6, maxR: 180 });
  });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.ox = Math.random() * W; 
      this.oy = initial ? Math.random() * H : H + 5;
      this.x  = this.ox;
      this.y  = this.oy;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.35 + 0.08);
      this.r  = Math.random() * 1.3 + 0.3;
      this.alpha = 0;
      this.life  = 0;
      this.maxLife = Math.random() * 320 + 180;
    }
    update() {
      this.ox += this.vx;
      this.oy += this.vy;

      const dx   = this.ox - smoothX;
      const dy   = this.oy - smoothY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 120;
      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        this.x = this.ox + (dx / dist) * force * 55;
        this.y = this.oy + (dy / dist) * force * 55;
      } else {
        this.x += (this.ox - this.x) * 0.08;
        this.y += (this.oy - this.y) * 0.08;
      }

      this.life++;
      const t = this.life / this.maxLife;
      this.alpha = t < 0.1 ? t * 6 : t > 0.8 ? (1 - t) * 5 * 0.55 : 0.55;
      if (this.oy < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * 0.55;
      ctx.fillStyle = '#00f5c4';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 90 }, () => new Particle());
    ripples = [];
  }
  initParticles();

  function drawParallaxGrid() {
    const nx = (smoothX / W - 0.5) * 2;
    const ny = (smoothY / H - 0.5) * 2;

    ctx.save();
    ctx.lineWidth = 0.5;
    const step = 80;

    const ox1 = nx * 12;
    const oy1 = ny * 12;
    ctx.strokeStyle = 'rgba(0,245,196,0.028)';
    for (let x = -step + ((ox1 % step + step) % step); x < W + step; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -step + ((oy1 % step + step) % step); y < H + step; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const ox2 = nx * 28;
    const oy2 = ny * 28;
    const step2 = 240;
    ctx.strokeStyle = 'rgba(0,245,196,0.055)';
    ctx.lineWidth = 0.8;
    for (let x = -step2 + ((ox2 % step2 + step2) % step2); x < W + step2; x += step2) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -step2 + ((oy2 % step2 + step2) % step2); y < H + step2; y += step2) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const ox3 = nx * 48;
    const oy3 = ny * 48;
    ctx.fillStyle = 'rgba(0,245,196,0.12)';
    for (let x = -step2 + ((ox3 % step2 + step2) % step2); x < W + step2; x += step2) {
      for (let y = -step2 + ((oy3 % step2 + step2) % step2); y < H + step2; y += step2) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawCursorGlow() {
    const grd = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, 200);
    grd.addColorStop(0,   'rgba(0,245,196,0.055)');
    grd.addColorStop(0.5, 'rgba(0,245,196,0.015)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  function updateRipples() {
    ripples = ripples.filter(r => r.alpha > 0.01);
    ripples.forEach(r => {
      r.r     += 3.5;
      r.alpha *= 0.93;

      ctx.save();
      ctx.globalAlpha = r.alpha * 0.5;
      ctx.strokeStyle = '#00f5c4';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = r.alpha * 0.2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawAmbientGlow() {
    const grd = ctx.createRadialGradient(W * 0.1, H * 0.85, 0, W * 0.1, H * 0.85, H * 0.55);
    grd.addColorStop(0, 'rgba(0,245,196,0.04)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  function animateBG() {
    smoothX += (mouseX - smoothX) * 0.04;
    smoothY += (mouseY - smoothY) * 0.04;

    ctx.clearRect(0, 0, W, H);

    drawParallaxGrid();
    drawCursorGlow();
    drawAmbientGlow();
    updateRipples();
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(animateBG);
  }
  animateBG();

  // ─────────────────────────────────────
  // 2. CUSTOM CURSOR
  // ─────────────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';

    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .skill-tag, .stat-card, .project-card, .social-icon, input, textarea')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });

  // ─────────────────────────────────────
  // 3. TYPED TEXT EFFECT
  // ─────────────────────────────────────
  const roles = [
    'Full Stack Developer',
    'Amante de código limpo',
    'Entusiasta de IA',
    'Solucionador de problemas',
    'Open Source contributor',
  ];
  const typedEl = document.getElementById('typedText');
  let roleIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 45 : 90);
  }
  type();

  // ─────────────────────────────────────
  // 4. SCROLL REVEAL
  // ─────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = (idx * 0.08) + 's';
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObs.observe(el));

  // ─────────────────────────────────────
  // 5. COUNTER ANIMATION
  // ─────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));

  // ─────────────────────────────────────
  // 6. ACTIVE NAV LINK ON SCROLL
  // ─────────────────────────────────────
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // ─────────────────────────────────────
  // 7. MOBILE NAV TOGGLE
  // ─────────────────────────────────────
  const toggle   = document.getElementById('navToggle');
  const navList  = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = navList.style.display === 'flex';
    navList.style.display = open ? 'none' : 'flex';
    navList.style.flexDirection = 'column';
    navList.style.position = 'absolute';
    navList.style.top = '70px';
    navList.style.left = '0';
    navList.style.right = '0';
    navList.style.background = 'rgba(5,5,8,0.97)';
    navList.style.padding = '2rem 3rem';
    navList.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
    navList.style.backdropFilter = 'blur(24px)';
    navList.style.gap = '1.5rem';
  });

  navLinks.forEach(a => a.addEventListener('click', () => {
    navList.style.display = 'none';
  }));

  // ─────────────────────────────────────
  // HIRE TABS
  // ─────────────────────────────────────
  const hireTabs   = document.querySelectorAll('.hire-tab');
  const hireOffers = document.querySelectorAll('.hire-offer');
  const hireTypeInput = document.getElementById('hireType');
  const budgetLabel   = document.getElementById('budgetLabel');
  const deadlineLabel = document.getElementById('deadlineLabel');
  const hireBudget    = document.getElementById('hireBudget');
  const hireDeadline  = document.getElementById('hireDeadline');

  const tabConfig = {
    freelance: {
      offerId: 'offerFreelance',
      budget: 'Orçamento estimado',
      deadline: 'Prazo desejado',
      budgetOpts: ['Até R$ 2.000','R$ 2.000 — R$ 5.000','R$ 5.000 — R$ 15.000','R$ 15.000 — R$ 30.000','Acima de R$ 30.000','A combinar'],
    },
    clt: {
      offerId: 'offerClt',
      budget: 'Pretensão salarial',
      deadline: 'Início disponível',
      budgetOpts: ['Até R$ 4.000','R$ 4.000 — R$ 7.000','R$ 7.000 — R$ 12.000','R$ 12.000 — R$ 20.000','Acima de R$ 20.000','A combinar'],
    },
    pj: {
      offerId: 'offerPj',
      budget: 'Faixa mensal PJ',
      deadline: 'Duração do contrato',
      budgetOpts: ['Até R$ 5.000/mês','R$ 5.000 — R$ 10.000/mês','R$ 10.000 — R$ 20.000/mês','Acima de R$ 20.000/mês','A combinar'],
    },
    mentoria: {
      offerId: 'offerMentoria',
      budget: 'Formato preferido',
      deadline: 'Frequência',
      budgetOpts: ['Sessão avulsa','Pacote mensal (4 sessões)','Pacote trimestral','A combinar'],
    },
  };

  hireTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.tab;
      const cfg  = tabConfig[type];

      hireTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      hireOffers.forEach(o => o.classList.add('hidden'));
      const active = document.getElementById(cfg.offerId);
      active.classList.remove('hidden');
      active.classList.remove('fade-in');
      void active.offsetWidth; 
      active.classList.add('fade-in');

      if (hireTypeInput) hireTypeInput.value = type;

      if (budgetLabel)  budgetLabel.textContent  = cfg.budget;
      if (deadlineLabel) deadlineLabel.textContent = cfg.deadline;

      if (hireBudget) {
        hireBudget.innerHTML = '<option value="">Selecione...</option>';
        cfg.budgetOpts.forEach(opt => {
          const o = document.createElement('option');
          o.textContent = opt;
          hireBudget.appendChild(o);
        });
      }

      if (hireDeadline && type === 'clt') {
        hireDeadline.innerHTML = `
          <option value="">Selecione...</option>
          <option>Imediato</option>
          <option>Dentro de 1 mês</option>
          <option>1 a 3 meses</option>
          <option>Mais de 3 meses</option>
          <option>A combinar</option>`;
      } else if (hireDeadline && type === 'mentoria') {
        hireDeadline.innerHTML = `
          <option value="">Selecione...</option>
          <option>Semanal</option>
          <option>Quinzenal</option>
          <option>Mensal</option>
          <option>Sob demanda</option>`;
      } else if (hireDeadline) {
        hireDeadline.innerHTML = `
          <option value="">Selecione...</option>
          <option>Urgente (menos de 2 semanas)</option>
          <option>Curto prazo (1 mês)</option>
          <option>Médio prazo (2–3 meses)</option>
          <option>Longo prazo (3+ meses)</option>
          <option>Sem prazo definido</option>`;
      }
    });
  });

  // ── Hire Form Submit ──
  const hireForm = document.getElementById('hireForm');
  if (hireForm) {
    hireForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = hireForm.querySelector('.btn-hire');
      const text = btn.querySelector('.btn-hire-text');
      const succ = btn.querySelector('.btn-hire-success');

      text.classList.add('hide');
      succ.style.display = 'inline';
      succ.classList.add('show');
      btn.style.background = 'rgba(0,245,196,0.1)';
      btn.style.borderColor = 'var(--accent)';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        text.classList.remove('hide');
        succ.style.display = 'none';
        succ.classList.remove('show');
        btn.style.background = '';
        btn.style.pointerEvents = '';
        hireForm.reset();
      }, 3500);
    });
  }

  // ─────────────────────────────────────
  // 8. CONTACT FORM FEEDBACK
  // ─────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = 'Enviando...';
      btn.style.pointerEvents = 'none';

      // IMPORTANTE: Insira o ID do seu template no lugar de SEU_TEMPLATE_ID_AQUI
      emailjs.sendForm('service_lkm9r7t', 'template_zmmn7os', form)
        .then(() => {
          btn.textContent = 'Mensagem enviada ✓';
          btn.style.background = 'rgba(0,245,196,0.15)';
          btn.style.color = 'var(--accent)';

          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.pointerEvents = '';
            form.reset();
          }, 3000);
        }, (error) => {
          console.error('Erro ao enviar:', error);
          btn.textContent = 'Erro ao enviar ❌';
          btn.style.background = 'rgba(255, 0, 0, 0.1)';
          
          setTimeout(() => {
            btn.textContent = original;
            btn.style.pointerEvents = '';
          }, 3000);
        });
    });
  }

  // ─────────────────────────────────────
  // 9. SMOOTH PARALLAX ON HERO NAME
  // ─────────────────────────────────────
  const heroName = document.querySelector('.hero-name');
  window.addEventListener('scroll', () => {
    if (!heroName) return;
    const scrolled = window.scrollY;
    heroName.style.transform = `translateY(${scrolled * 0.18}px)`;
    heroName.style.opacity = Math.max(0, 1 - scrolled / 500);
  });

  // ─────────────────────────────────────
  // 10. HOVER TILT ON PROJECT CARDS
  // ─────────────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${-y}deg)`;
      card.style.perspective = '800px';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─────────────────────────────────────
  // 11. SKILL TAG RIPPLE
  // ─────────────────────────────────────
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:60px; height:60px;
        background:rgba(0,245,196,0.2);
        transform:translate(-50%,-50%) scale(0);
        animation: rippleAnim 0.5s linear;
        pointer-events:none;
        left:${e.offsetX}px; top:${e.offsetY}px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim { to { transform: translate(-50%,-50%) scale(3); opacity:0; } }`;
  document.head.appendChild(style);

});