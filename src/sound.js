/**
 * sound.js — Cyberpunk ambient hum toggle using Web Audio API
 */
export function initSound() {
  const btn     = document.getElementById('sound-toggle');
  const iconOn  = document.getElementById('sound-icon-on');
  const iconOff = document.getElementById('sound-icon-off');

  let audioCtx = null;
  let nodes    = [];
  let enabled  = false;

  function buildAmbient() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Low drone
    const drone = audioCtx.createOscillator();
    drone.type  = 'sawtooth';
    drone.frequency.setValueAtTime(55, audioCtx.currentTime);
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(masterGain);
    drone.start();

    // High frequency shimmer
    const shimmer = audioCtx.createOscillator();
    shimmer.type  = 'sine';
    shimmer.frequency.setValueAtTime(880, audioCtx.currentTime);
    shimmer.frequency.setTargetAtTime(1100, audioCtx.currentTime, 4);
    const shimmerGain = audioCtx.createGain();
    shimmerGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmer.start();

    // White noise hiss
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer     = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data       = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop   = true;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type            = 'bandpass';
    noiseFilter.frequency.value = 200;
    noiseFilter.Q.value         = 0.5;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();

    nodes = [drone, shimmer, noiseSource];
    return masterGain;
  }

  let masterGain = null;

  btn.addEventListener('click', () => {
    enabled = !enabled;
    if (enabled) {
      masterGain = buildAmbient();
      iconOn.style.display  = 'block';
      iconOff.style.display = 'none';
      btn.style.borderColor = 'var(--cyan)';
      btn.style.color       = 'var(--cyan)';
    } else {
      if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          nodes.forEach(n => { try { n.stop(); } catch(e){} });
          audioCtx.close();
          audioCtx = null;
          nodes = [];
        }, 600);
      }
      iconOn.style.display  = 'none';
      iconOff.style.display = 'block';
      btn.style.borderColor = 'rgba(0,255,231,0.3)';
      btn.style.color       = 'rgba(0,255,231,0.3)';
    }
  });
}
