/**
 * easter.js — Typing "AMEN" triggers glitch explosion
 */
export function initEasterEgg() {
  const overlay = document.getElementById('easter-overlay');
  const target  = 'AMEN';
  let typed     = '';

  document.addEventListener('keydown', (e) => {
    typed += e.key.toUpperCase();
    if (typed.length > target.length) {
      typed = typed.slice(-target.length);
    }
    if (typed === target) {
      triggerGlitchExplosion();
      typed = '';
    }
  });

  function triggerGlitchExplosion() {
    const colors   = ['#00ffe7', '#ff00c8', '#ffe600', '#ffffff'];
    let   step     = 0;
    const steps    = 16;
    const interval = setInterval(() => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      overlay.style.opacity    = step % 2 === 0 ? '0.85' : '0';
      overlay.style.background = color;
      overlay.style.mixBlendMode = 'screen';
      document.body.style.filter = step % 2 === 0
        ? `hue-rotate(${Math.random()*360}deg) contrast(1.5) brightness(1.4)`
        : 'none';
      step++;
      if (step >= steps) {
        clearInterval(interval);
        overlay.style.opacity    = '0';
        document.body.style.filter = 'none';
        // Console easter egg
        console.log('%c[ AMEN.EXE ACTIVATED ]', 'color:#00ffe7;font-family:"Share Tech Mono";font-size:18px;text-shadow:0 0 10px #00ffe7');
        console.log('%cYou found the easter egg 👾', 'color:#ff00c8;font-family:"Share Tech Mono"');
      }
    }, 55);
  }
}
