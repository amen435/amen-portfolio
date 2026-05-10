import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  
  // ── 1. ABOUT SECTION ANIMATIONS ─────────────────────────────
  
  // Staggered reveal for About Left text
  const aboutLeftTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
    }
  });

  aboutLeftTL.fromTo('#about-label',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
  )
  .fromTo('#about-heading',
    { opacity: 0, y: 30, rotateX: 45 },
    { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'back.out(1.5)' },
    '-=0.3'
  )
  .fromTo('#about-bio',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    '-=0.5'
  )
  .to('#about-line',
    { width: '100%', duration: 1, ease: 'power3.inOut' },
    '-=0.4'
  );

  // Staggered flip-in for Stats Cards
  gsap.fromTo('.stat-card',
    { opacity: 0, y: 60, rotateX: -60 },
    {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 85%',
      }
    }
  );


  // ── 2. WEBGL SCENE TRANSITIONS & TEXT ───────────────────────

  // Setup Splitting.js for scene heading if available
  if (window.Splitting) {
    Splitting({ target: '#scene-heading', by: 'chars' });
  }

  // Text overlay reveal
  const sceneTextTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#webgl-scene',
      start: 'top 50%',
      end: 'bottom 50%',
      toggleActions: 'play reverse play reverse'
    }
  });

  sceneTextTL.fromTo('#scene-heading .char',
    { opacity: 0, y: 50, scale: 0.5, rotateZ: 15 },
    {
      opacity: 1, y: 0, scale: 1, rotateZ: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'back.out(2)'
    }
  )
  .fromTo('#scene-sub',
    { opacity: 0, y: 30, letterSpacing: '0.1em' },
    { opacity: 1, y: 0, letterSpacing: '0.4em', duration: 1, ease: 'power3.out' },
    '-=0.4'
  );

  // Glitch entry/exit sweeps
  ScrollTrigger.create({
    trigger: '#webgl-scene',
    start: 'top bottom',
    onEnter: () => glitchSweep('#scene-glitch-enter'),
    onLeaveBack: () => glitchSweep('#scene-glitch-enter')
  });

  ScrollTrigger.create({
    trigger: '#webgl-scene',
    start: 'bottom top',
    onEnter: () => glitchSweep('#scene-glitch-leave'),
    onLeaveBack: () => glitchSweep('#scene-glitch-leave')
  });

  function glitchSweep(selector) {
    const el = document.querySelector(selector);
    if(!el) return;
    
    gsap.timeline()
      .set(el, { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 5%, 0 5%)' })
      .to(el, { clipPath: 'polygon(0 40%, 100% 40%, 100% 45%, 0 45%)', duration: 0.1, ease: 'none' })
      .to(el, { clipPath: 'polygon(0 80%, 100% 80%, 100% 85%, 0 85%)', duration: 0.1, ease: 'none' })
      .to(el, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', duration: 0.1, ease: 'none' })
      .set(el, { opacity: 0 });
  }

  // ── 3. SKILLS SECTION ANIMATIONS ────────────────────────────
  gsap.fromTo('#skills-label',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '#skills', start: 'top 75%' }
    }
  );

  gsap.fromTo('#skills-heading',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '#skills', start: 'top 75%' }
    }
  );

  // Skill bars intersection observer
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.getAttribute('data-width');
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));

  // Staggered cards
  gsap.fromTo('.skill-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%'
      }
    }
  );

  // ── 4. PROJECTS SECTION ANIMATIONS ──────────────────────────
  gsap.fromTo('#projects-label',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '#projects', start: 'top 75%' }
    }
  );

  gsap.fromTo('#projects-heading',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '#projects', start: 'top 75%' }
    }
  );

  gsap.fromTo('.project-card',
    { opacity: 0, z: -100, rotateX: 30 },
    {
      opacity: 1, z: 0, rotateX: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%'
      }
    }
  );

  // ── 5. CONTACT SECTION ANIMATIONS ──────────────────────────
  gsap.fromTo('#contact-left',
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 75%' }
    }
  );

  gsap.fromTo('.field-anim',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)',
      scrollTrigger: { trigger: '.contact-form', start: 'top 80%' }
    }
  );

}
