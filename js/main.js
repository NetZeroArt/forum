/* =========================================================
   新媒體藝術 × 淨零未來｜Main Interaction Script
   - Lenis smooth scroll
   - Hero video + SVG overlay entrance
   - GSAP + ScrollTrigger reveal animations
   - Counter animation
   - Custom cursor, scroll progress, nav scroll state
   ========================================================= */

(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* -------------------- Lenis smooth scroll -------------------- */
  const lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60, duration: 1.4 });
        }
      }
    });
  });

  /* -------------------- Custom cursor -------------------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function cursorLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll('a, button, .session-card, .speaker-card, .news-card, .stat-card, .info-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
    });

  /* -------------------- Scroll progress bar -------------------- */
  const progress = document.getElementById('scrollProgress');
  lenis.on('scroll', ({ scroll, limit }) => {
    if (progress) progress.style.width = (scroll / limit) * 100 + '%';
  });

  /* -------------------- Nav scroll state -------------------- */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const heroHeight = () => hero.offsetHeight - 80;

  function updateNav(scroll) {
    if (scroll < heroHeight()) {
      nav.classList.add('hero-mode');
      nav.classList.remove('scrolled');
    } else {
      nav.classList.remove('hero-mode');
      nav.classList.add('scrolled');
    }
  }
  updateNav(0);
  lenis.on('scroll', ({ scroll }) => updateNav(scroll));

  /* -------------------- Hero banner video intro -------------------- */
  const videos = document.querySelectorAll('.hero-video');
  const videoWrap = document.querySelector('.hero-video-wrap');

  videos.forEach(v => {
    const onReady = () => v.classList.add('loaded');
    if (v.readyState >= 2) onReady();
    else v.addEventListener('loadeddata', onReady, { once: true });
    const playPromise = v.play();
    if (playPromise) playPromise.catch(() => {});
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-video-wrap', {
      scale: 0.88, opacity: 0, y: 18,
      duration: 1.8, ease: 'power3.out',
    }, 0)
    .from('.hero-date, .hero-meta, .hero-actions', {
      opacity: 0, y: 20,
      duration: 0.9, ease: 'power3.out',
      stagger: 0.12,
    }, 1.0);

  /* Gentle continuous float on the banner */
  if (videoWrap) {
    gsap.to(videoWrap, {
      y: -10,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /* Mouse parallax - subtle drift on the banner */
  if (hero && videoWrap) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(videoWrap, {
        xPercent: x * 3,
        yPercent: y * 2.2,
        duration: 1.2, ease: 'power3.out',
      });
    });
    /* Scroll parallax: gentle drift only (no opacity fade — hero leaves viewport naturally) */
    gsap.to(videoWrap, {
      yPercent: 8,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* -------------------- Reveal animations (non-hero) -------------------- */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    if (el.closest('.hero')) return;
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* -------------------- Counter animation -------------------- */
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || 0);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      },
    });
  });

  /* -------------------- Session card magnetic hover -------------------- */
  document.querySelectorAll('.session-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
