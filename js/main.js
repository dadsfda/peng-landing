// ===== Particle Background =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x -= (dx / dist) * force * 0.5;
        this.y -= (dy / dist) * force * 0.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const opacity = (1 - dist / 120) * 0.15;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== Terminal Typing Animation =====
const terminalBody = document.getElementById('terminalBody');
const terminalCmd = document.getElementById('terminalCmd');

const terminalSequence = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: '小鹏 — AI 编程探索者 · Wuhan, China', class: 'highlight' },
  { type: 'command', text: 'cat skills.txt' },
  { type: 'output', text: 'TypeScript · Astro · Python · Prompt Engineering · Multi-Agent', class: 'info' },
  { type: 'command', text: 'ls src/content/blog/' },
  { type: 'output', text: 'AI 智能体构建总结.md', class: '' },
  { type: 'output', text: 'Harness Engineering.md', class: '' },
  { type: 'output', text: 'Karpathy Claude Code Guidelines.md', class: '' },
  { type: 'output', text: 'Agent Skills 知识检索.md', class: '' },
  { type: 'output', text: '... 共 7 篇文章', class: 'info' },
  { type: 'command', text: 'cat philosophy.md' },
  { type: 'output', text: '好的博客不一定要让人惊叹，', class: '' },
  { type: 'output', text: '但应该让人愿意停留。', class: 'highlight' },
  { type: 'command', text: 'echo $MISSION' },
  { type: 'output', text: '记录 AI 学习 · 智能体构建 · 编程实践', class: 'success' },
  { type: 'command', text: 'npm run dev' },
  { type: 'output', text: '🚀 Server running at peng-journal.vercel.app', class: 'success' },
];

let seqIndex = 0;
let charIndex = 0;
let currentLine = null;

function typeNextStep() {
  if (seqIndex >= terminalSequence.length) {
    // Restart after a delay
    setTimeout(() => {
      terminalBody.innerHTML = '';
      seqIndex = 0;
      charIndex = 0;
      currentLine = null;
      typeNextStep();
    }, 4000);
    return;
  }

  const step = terminalSequence[seqIndex];

  if (step.type === 'command') {
    if (!currentLine) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-command"></span><span class="terminal-cursor">|</span>`;
      terminalBody.appendChild(line);
      currentLine = line.querySelector('.terminal-command');
      charIndex = 0;
    }

    if (charIndex < step.text.length) {
      currentLine.textContent += step.text.charAt(charIndex);
      charIndex++;
      setTimeout(typeNextStep, 40 + Math.random() * 30);
    } else {
      // Remove cursor from command line
      const cursor = currentLine.parentElement.querySelector('.terminal-cursor');
      if (cursor) cursor.remove();
      currentLine = null;
      seqIndex++;
      setTimeout(typeNextStep, 300);
    }
  } else if (step.type === 'output') {
    const output = document.createElement('div');
    output.className = `terminal-output ${step.class || ''}`;
    output.textContent = step.text;
    terminalBody.appendChild(output);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    seqIndex++;
    setTimeout(typeNextStep, 150);
  }
}

// Start terminal animation when visible
const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(typeNextStep, 800);
      terminalObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroTerminal = document.querySelector('.hero-terminal');
if (heroTerminal) terminalObserver.observe(heroTerminal);

// ===== Hero Badge Typing =====
const badge = document.getElementById('heroBadge');
const badgeText = 'AI · 智能体 · 编程实践';
let badgeIndex = 0;

function typeBadge() {
  if (badgeIndex < badgeText.length) {
    badge.textContent += badgeText.charAt(badgeIndex);
    badgeIndex++;
    setTimeout(typeBadge, 50);
  } else {
    // Remove cursor after typing
    setTimeout(() => {
      badge.style.borderRight = 'none';
    }, 1000);
  }
}

if (badge) {
  badge.style.borderRight = '2px solid var(--accent-cyan)';
  setTimeout(typeBadge, 500);
}

// ===== Counter Animation =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// ===== Skill Bar Animation =====
function animateSkillBars(container) {
  const bars = container.querySelectorAll('.skill-bar-fill');
  bars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    }, index * 100);
  });
}

// ===== Scroll Reveal =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger counter animation
      const counters = entry.target.querySelectorAll('.stat-number[data-target]');
      counters.forEach(counter => animateCounter(counter));

      // Trigger skill bar animation
      if (entry.target.classList.contains('skills-grid') || entry.target.querySelector('.skill-bar-fill')) {
        animateSkillBars(entry.target);
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class and observe elements
document.querySelectorAll('.section-header, .about-grid, .focus-card, .article-card, .contact-card, .hero-stats, .timeline-item, .skill-category, .quote').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Stagger animation for cards
document.querySelectorAll('.focus-card, .article-card, .contact-card, .timeline-item, .skill-category').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Active nav link highlight =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        link.style.color = 'var(--accent-cyan)';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ===== Parallax on scroll =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector('.hero-content');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.15}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }
});

console.log('%c小鹏 AI 编程之旅', 'color: #22d3ee; font-size: 24px; font-weight: bold;');
console.log('%c欢迎访问！🚀', 'color: #a78bfa; font-size: 14px;');
