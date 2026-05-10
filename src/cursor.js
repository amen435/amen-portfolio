/**
 * cursor.js — Custom glowing crosshair cursor
 */
export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hovering state
  const hoverTargets = 'a, button, .btn, .nav-link, .hero-name';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // Delegate for dynamic elements
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches('a, button, .btn, [data-hover]')) {
      document.body.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, .btn, [data-hover]')) {
      document.body.classList.remove('hovering');
    }
  });
}
