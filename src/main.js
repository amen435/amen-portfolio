/**
 * main.js — AMEN Portfolio Entry Point
 */
import './style.css';
import Lenis from 'lenis';
import { initLoader }          from './loader.js';
import { initCursor }          from './cursor.js';
import { initGrain }           from './grain.js';
import { initDebris }          from './debris.js';
import { initSound }           from './sound.js';
import { initEasterEgg }       from './easter.js';
import { initHeroScene }       from './heroScene.js';
import { initHeroAnimations }  from './heroAnimations.js';
import { initInteractiveScene } from './webglScene.js';
import { initScrollAnimations } from './scrollAnimations.js';
import { initContactForm } from './contact.js';

// ── Global effects that can start immediately ──────────────
initCursor();
initGrain();
initDebris();
initSound();
initEasterEgg();

// ── Nav hamburger ──────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
// Close on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Lenis smooth scroll (init after loader) ────────────────
let lenis;

// ── Boot sequence ──────────────────────────────────────────
initLoader().then(() => {
  // Smooth scroll
  lenis = new Lenis({
    duration:   1.4,
    easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation:'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ── Three.js Scenes ──────────────────────────────────────
  initHeroScene();
  initInteractiveScene();

  // ── GSAP Animations ──────────────────────────────────────
  initHeroAnimations();
  initScrollAnimations();
  initContactForm();

  // ── Nav scroll effect ─────────────────────────────────────
  const nav = document.getElementById('main-nav');
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
      nav.style.background = 'rgba(5,10,14,0.96)';
      nav.style.boxShadow  = '0 1px 0 rgba(0,255,231,0.1)';
    } else {
      nav.style.background = 'linear-gradient(180deg,rgba(5,10,14,0.95) 0%,transparent 100%)';
      nav.style.boxShadow  = 'none';
    }
  });
});
