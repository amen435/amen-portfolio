/**
 * grain.js — Film grain noise canvas overlay
 */
export function initGrain() {
  const canvas = document.getElementById('grain-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    const { width, height } = canvas;
    const imageData = ctx.createImageData(width, height);
    const data      = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 30 + (Math.random() * 30) | 0;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawGrain);
  }
  drawGrain();
}
