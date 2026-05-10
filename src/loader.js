/**
 * loader.js — Loading screen: matrix rain + progress bar + glitch fade
 */

export function initLoader() {
  return new Promise((resolve) => {
    const loader    = document.getElementById('loader');
    const canvas    = document.getElementById('matrix-canvas');
    const bar       = document.getElementById('progress-bar');
    const pct       = document.getElementById('pct');
    const bootText  = document.getElementById('boot-text');
    const ctx       = canvas.getContext('2d');

    // Resize canvas
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix rain setup
    const COLS   = Math.floor(canvas.width / 16);
    const drops  = Array.from({ length: COLS }, () => Math.random() * canvas.height / 20 * -1);
    const chars  = '0123456789ABCDEFアイウエオカキクケコSABCDEFGHIJKLMNOP!@#$%^&*()';

    let rafId;
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ffe7';
      ctx.font = '14px "Share Tech Mono", monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 16, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafId = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // Boot text glitch phrases
    const phrases = [
      'INITIALIZING AMEN.EXE...',
      'LOADING NEURAL MODULES...',
      'CONNECTING TO CYBERSPACE...',
      'COMPILING REALITY.JS...',
      'BYPASSING FIREWALL...',
      'SYSTEM ONLINE — WELCOME'
    ];
    let phraseIdx = 0;
    const phraseInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      bootText.textContent = phrases[phraseIdx];
    }, 600);

    // Progress
    let progress = 0;
    const target = 100;
    const duration = 2800; // ms
    const start = performance.now();

    function updateProgress(now) {
      const elapsed = now - start;
      progress = Math.min((elapsed / duration) * 100, 100);
      bar.style.width = progress + '%';
      pct.textContent  = Math.floor(progress);
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        finish();
      }
    }
    requestAnimationFrame(updateProgress);

    function finish() {
      clearInterval(phraseInterval);
      cancelAnimationFrame(rafId);
      bootText.textContent = '[ SYSTEM READY ]';

      // Glitch explosion exit
      loader.style.transition = 'none';
      let flashes = 0;
      const flashInterval = setInterval(() => {
        loader.style.opacity = (flashes % 2 === 0) ? '0' : '1';
        loader.style.filter  = `hue-rotate(${Math.random()*360}deg) brightness(2)`;
        flashes++;
        if (flashes > 8) {
          clearInterval(flashInterval);
          loader.style.transition = 'opacity 0.4s ease';
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            resolve();
          }, 450);
        }
      }, 60);
    }
  });
}
