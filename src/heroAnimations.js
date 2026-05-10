/**
 * heroAnimations.js — GSAP entry animations for hero section
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroAnimations() {
  // Elements
  const label    = document.getElementById('hero-label');
  const name     = document.getElementById('hero-name');
  const subtitle = document.getElementById('hero-subtitle');
  const bio      = document.getElementById('hero-bio');
  const buttons  = document.getElementById('hero-buttons');
  const photoWrap = document.getElementById('hero-photo-wrap');

  // ── Splitting.js letter animation on name ─────────────────
  if (window.Splitting) {
    Splitting({ target: '#hero-name', by: 'chars' });
  }

  // ── ENTRY TIMELINE ────────────────────────────────────────
  const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'back.out(1.7)' } });

  // Photo — rotates in from right
  tl.fromTo(photoWrap,
    { opacity: 0, x: 80, rotateY: 30, rotateZ: -15, scale: 0.7 },
    { opacity: 1, x: 0,  rotateY: 0,  rotateZ: 0,   scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
    0
  );

  // Label drops from above
  tl.fromTo(label,
    { opacity: 0, y: -40 },
    { opacity: 1, y: 0, duration: 0.7 },
    0.3
  );

  // Name letters stagger in
  tl.fromTo('#hero-name .char',
    { opacity: 0, y: -80, rotateX: 90 },
    {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'back.out(2)',
    },
    0.6
  );

  // Subtitle
  tl.fromTo(subtitle,
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.65 },
    1.2
  );

  // Bio
  tl.fromTo(bio,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6 },
    1.5
  );

  // Buttons
  tl.fromTo(buttons,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6 },
    1.75
  );

  // ── SCROLL: photo shrinks to nav avatar ───────────────────
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;
      if (p > 0.3) {
        const t = (p - 0.3) / 0.7;
        gsap.set(photoWrap, {
          scale:  1 - t * 0.75,
          x: -window.innerWidth * t * 0.3,
          y: -window.innerHeight * t * 0.35,
          opacity: Math.max(0.5, 1 - t * 0.5),
        });
      } else {
        gsap.set(photoWrap, { scale: 1, x: 0, y: 0, opacity: 1 });
      }
    }
  });

  // ── Mouse parallax on hero text ───────────────────────────
  const heroText = document.getElementById('hero-text');
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to(heroText, { x: nx * 12, y: ny * 8, duration: 1.2, ease: 'power2.out' });
  });

  // ── Hover glitch on name ──────────────────────────────────
  name.addEventListener('mouseenter', () => {
    const chars = name.querySelectorAll('.char');
    chars.forEach((ch, i) => {
      gsap.to(ch, {
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        color: i % 2 === 0 ? '#ff00c8' : '#00ffe7',
        duration: 0.1,
        delay: i * 0.03,
        yoyo: true,
        repeat: 3,
      });
    });
  });
}
