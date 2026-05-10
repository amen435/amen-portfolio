/**
 * debris.js — Floating antigravity debris particles
 */
export function initDebris() {
  const container = document.getElementById('debris-container');
  const COUNT = 40;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    const types = ['sq', 'line', 'dot', 'tri'];
    const type  = types[Math.floor(Math.random() * types.length)];
    el.className = `debris ${type}`;

    const x   = Math.random() * 100;
    const dur  = 8 + Math.random() * 20;
    const del  = Math.random() * -20;
    const size = 0.5 + Math.random() * 1.5;

    el.style.cssText = `
      left: ${x}%;
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      transform: scale(${size});
      opacity: ${0.15 + Math.random() * 0.3};
    `;
    container.appendChild(el);
  }

  // Scroll-based antigravity effect
  let lastScrollY = 0;
  let scrollVel   = 0;
  const pieces = container.querySelectorAll('.debris');

  window.addEventListener('scroll', () => {
    scrollVel = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
  }, { passive: true });

  let rafId;
  function updateDebris() {
    pieces.forEach((p, i) => {
      const factor = (i % 3 === 0) ? 0.08 : (i % 3 === 1) ? 0.04 : 0.12;
      const currentY = parseFloat(p.dataset.oy || 0);
      const newY     = currentY + scrollVel * factor;
      p.dataset.oy   = newY;
      p.style.transform = `translateY(${newY}px) scale(${0.5 + (i % 4) * 0.35})`;
    });
    scrollVel *= 0.9; // dampen
    rafId = requestAnimationFrame(updateDebris);
  }
  updateDebris();
}
