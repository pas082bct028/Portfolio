/* =========================================
   MANISH KUMAR MANDAL — PORTFOLIO SCRIPTS
   ========================================= */

// ---- PARTICLES ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,212' : '123,47,247';
  }
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  };

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,212,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ---- ACTIVE NAV LINK ----
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    link.classList.toggle('active', scrollPos >= top && scrollPos < bot);
  });
}

// ---- TYPEWRITER ----
(function typewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'Full-Stack Developer',
    'Web Enthusiast',
    'C/C++ Programmer',
    'Problem Solver',
    'Open Source Contributor',
    'Passionate Builder'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    el.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);
    if (!deleting && ci > phrase.length) {
      deleting = true;
      return setTimeout(tick, 1500);
    }
    if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      pi = (pi + 1) % phrases.length;
      return setTimeout(tick, 400);
    }
    setTimeout(tick, deleting ? 50 : 100);
  }
  tick();
})();

// ---- SCROLL-TO-TOP ----
const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('visible', window.scrollY > 500);
});
scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- INTERSECTION OBSERVER (fade-in + skills + counters) ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Fade in
    if (entry.target.classList.contains('fade-in')) {
      entry.target.classList.add('visible');
    }

    // Skill bars
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      const target = bar.dataset.width;
      setTimeout(() => { bar.style.width = target + '%'; }, 200);
    });

    // Counters
    entry.target.querySelectorAll('.counter').forEach(el => {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + (target === 999 ? '+' : '');
        if (count >= target) clearInterval(interval);
      }, 25);
    });

    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

// Apply fade-in to all major elements and observe sections
document.querySelectorAll('.section, .glass-card, .timeline-item, .edu-card, .project-card, .skill-category, .stat-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Also observe sections that contain skills/counters
document.querySelectorAll('section').forEach(sec => observer.observe(sec));

// ---- CONTACT FORM ----
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const btn    = this.querySelector('button[type=submit]');
  const name   = document.getElementById('name').value;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate send (replace with real API/EmailJS)
  setTimeout(() => {
    status.className = 'form-status success';
    status.textContent = `✅ Thanks ${name}! Your message has been sent. I'll get back to you soon.`;
    this.reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
  }, 1800);
});
