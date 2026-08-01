/* ================================
   🚀 THEOS COUNTDOWN - ENGINE
   Premium Pre-Launch Countdown
================================ */

(function() {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────
  const LAUNCH_DATE = new Date('2026-08-15T00:00:00-03:00'); // 10 de Agosto 2026, 00h, Brasília
  const PARTICLE_COUNT = 35;
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── STATE ────────────────────────────────────────────────
  let prevValues = { days: null, hours: null, minutes: null, seconds: null };
  let particles = [];
  let animFrame = null;
  let particleCanvas = null;
  let particleCtx = null;

  // ─── INIT ─────────────────────────────────────────────────
  function init() {
    if (Date.now() >= LAUNCH_DATE.getTime()) return; // Already launched

    document.body.classList.add('countdown-active');
    createOverlayDOM();
    
    if (!REDUCED_MOTION) {
      initParticles();
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── CREATE DOM ───────────────────────────────────────────
  function createOverlayDOM() {
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    overlay.id = 'countdownOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Contagem regressiva para o lançamento da plataforma THEOS');

    overlay.innerHTML = `
      <div class="countdown-bg"></div>
      <div class="countdown-vignette"></div>
      <div class="countdown-volumetric"></div>
      <canvas class="countdown-particles" id="countdownParticles"></canvas>

      <div class="countdown-content">
        <img
          src="./assets/images/logos/logo-nobg.png"
          alt="THEOS"
          class="countdown-logo"
          loading="eager"
        />

        <p class="countdown-tagline">
          Algo extraordinário está prestes a acontecer.
        </p>

        <span class="countdown-label">Lançamento oficial</span>

        <div class="countdown-timer" id="countdownTimer">
          <div class="countdown-block">
            <div class="countdown-card">
              <div class="countdown-card-inner">
                <span class="countdown-number" id="cd-days" aria-label="Dias">--</span>
                <div class="countdown-card-glow"></div>
              </div>
            </div>
            <span class="countdown-unit">Dias</span>
          </div>

          <span class="countdown-separator">:</span>

          <div class="countdown-block">
            <div class="countdown-card">
              <div class="countdown-card-inner">
                <span class="countdown-number" id="cd-hours" aria-label="Horas">--</span>
                <div class="countdown-card-glow"></div>
              </div>
            </div>
            <span class="countdown-unit">Horas</span>
          </div>

          <span class="countdown-separator">:</span>

          <div class="countdown-block">
            <div class="countdown-card">
              <div class="countdown-card-inner">
                <span class="countdown-number" id="cd-minutes" aria-label="Minutos">--</span>
                <div class="countdown-card-glow"></div>
              </div>
            </div>
            <span class="countdown-unit">Minutos</span>
          </div>

          <span class="countdown-separator">:</span>

          <div class="countdown-block">
            <div class="countdown-card">
              <div class="countdown-card-inner">
                <span class="countdown-number" id="cd-seconds" aria-label="Segundos">--</span>
                <div class="countdown-card-glow"></div>
              </div>
            </div>
            <span class="countdown-unit">Segundos</span>
          </div>
        </div>

        <div class="countdown-accent-line"></div>
      </div>
    `;

    // Insert as FIRST child of body so it layers on top
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  // ─── UPDATE COUNTDOWN ─────────────────────────────────────
  function updateCountdown() {
    const now = Date.now();
    const diff = LAUNCH_DATE.getTime() - now;

    if (diff <= 0) {
      triggerLaunch();
      return;
    }

    const days   = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setDigit('cd-days', pad(days), 'days');
    setDigit('cd-hours', pad(hours), 'hours');
    setDigit('cd-minutes', pad(minutes), 'minutes');
    setDigit('cd-seconds', pad(seconds), 'seconds');
  }

  function setDigit(elId, value, key) {
    const el = document.getElementById(elId);
    if (!el) return;

    if (prevValues[key] !== value) {
      el.textContent = value;

      if (prevValues[key] !== null && !REDUCED_MOTION) {
        el.classList.remove('countdown-flip');
        // Force reflow
        void el.offsetWidth;
        el.classList.add('countdown-flip');
      }

      prevValues[key] = value;
    }
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // ─── LAUNCH TRANSITION ────────────────────────────────────
  function triggerLaunch() {
    const overlay = document.getElementById('countdownOverlay');
    if (!overlay) return;

    overlay.classList.add('countdown-fade-out');
    document.body.classList.remove('countdown-active');
    document.body.classList.add('countdown-unlocked');

    // Cleanup after animation
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('countdown-unlocked');
      if (animFrame) cancelAnimationFrame(animFrame);
    }, 2000);
  }

  // ─── PARTICLES ────────────────────────────────────────────
  function initParticles() {
    particleCanvas = document.getElementById('countdownParticles');
    if (!particleCanvas) return;

    particleCtx = particleCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    animateParticles();
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1 - 0.05,
      opacity: Math.random() * 0.25 + 0.03,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.003 + 0.001,
    };
  }

  function animateParticles() {
    if (!particleCtx || !particleCanvas) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(p => {
      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Breathe opacity
      p.opacity += p.opacityDir * p.opacitySpeed;
      if (p.opacity >= 0.28) { p.opacity = 0.28; p.opacityDir = -1; }
      if (p.opacity <= 0.02) { p.opacity = 0.02; p.opacityDir = 1; }

      // Wrap around edges
      if (p.x < -10) p.x = particleCanvas.width + 10;
      if (p.x > particleCanvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = particleCanvas.height + 10;
      if (p.y > particleCanvas.height + 10) p.y = -10;

      // Draw
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      particleCtx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      particleCtx.fill();
    });

    animFrame = requestAnimationFrame(animateParticles);
  }

  // ─── BLOCK INTERACTIONS ───────────────────────────────────
  // Block keyboard escape and any close attempt
  document.addEventListener('keydown', function(e) {
    if (document.body.classList.contains('countdown-active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, true);

  // ─── BOOT ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
