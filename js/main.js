/* =========================================================
   新媒體藝術 × 淨零未來｜Main Interaction Script
   - Lenis smooth scroll
   - Three.js particle background (hero)
   - GSAP + ScrollTrigger reveal animations
   - Split-chars hero title animation
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
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function cursorLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll('a, button, .session-card, .speaker-card, .news-card, .stat-card, .info-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

  /* -------------------- Scroll progress bar -------------------- */
  const progress = document.getElementById('scrollProgress');
  lenis.on('scroll', ({ scroll, limit }) => {
    const pct = (scroll / limit) * 100;
    progress.style.width = pct + '%';
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

  /* -------------------- Split-chars hero title -------------------- */
  document.querySelectorAll('.split-chars').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      el.appendChild(span);
    });
  });

  /* -------------------- Hero intro animation -------------------- */
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-sphere', {
      opacity: 0.9, duration: 2.2, ease: 'power2.out',
    }, 0)
    .from('.hero-sphere', {
      scale: 0.6, rotate: -30, duration: 2.4, ease: 'power3.out',
    }, 0)
    .to('.title-zh .char', {
      opacity: 1, y: 0, rotate: 0,
      duration: 1.0, ease: 'power3.out',
      stagger: 0.05,
    }, 0.3)
    .to('.title-x', {
      opacity: 1, scale: 1, rotate: 0,
      duration: 0.9, ease: 'back.out(1.7)',
    }, '-=0.6');

  /* Gentle continuous float on the sphere (on inner img, never on wrapper) */
  gsap.to('.hero-sphere', {
    y: -16, scale: 1.02,
    duration: 4.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  /* Sphere mouse parallax (use wrapper so inner float is undisturbed) */
  const sphereWrap = document.getElementById('heroSphereWrap');
  if (sphereWrap) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(sphereWrap, {
        xPercent: x * 6,
        yPercent: y * 4,
        rotate: x * 4,
        duration: 1.2, ease: 'power3.out',
      });
    });
    // Scroll parallax on wrapper
    gsap.to(sphereWrap, {
      yPercent: 30,
      scale: 0.85,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Reveal-up items inside hero (immediate)
  gsap.utils.toArray('.hero .reveal-up').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) + 0.2;
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 1.0, ease: 'power3.out',
      delay,
    });
  });

  /* -------------------- Scroll reveal (ScrollTrigger) -------------------- */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    if (el.closest('.hero')) return;
    const delay = parseFloat(el.dataset.delay || 0);
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

  /* -------------------- Section titles subtle parallax -------------------- */
  gsap.utils.toArray('.section-title').forEach(t => {
    gsap.from(t, {
      backgroundPositionX: '100%',
      scrollTrigger: {
        trigger: t,
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
      },
    });
  });

  /* -------------------- Three.js particle background -------------------- */
  initParticles();

  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f0b, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      75, canvas.clientWidth / canvas.clientHeight, 1, 3000
    );
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // particle geometry
    const PCOUNT = 1400;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(PCOUNT * 3);
    const colors = new Float32Array(PCOUNT * 3);
    const sizes = new Float32Array(PCOUNT);

    const palette = [
      new THREE.Color('#a9d89a'),
      new THREE.Color('#4f7a4a'),
      new THREE.Color('#e76a3d'),
      new THREE.Color('#f3a779'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < PCOUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 2400;
      positions[i3 + 1] = (Math.random() - 0.5) * 1400;
      positions[i3 + 2] = (Math.random() - 0.5) * 1600;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = c.r; colors[i3+1] = c.g; colors[i3+2] = c.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    // soft circular sprite texture (generated on canvas)
    const tex = generateDotTexture();

    const material = new THREE.PointsMaterial({
      size: 4,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geom, material);
    scene.add(points);

    // second layer: far stars
    const starGeom = new THREE.BufferGeometry();
    const SCOUNT = 600;
    const spos = new Float32Array(SCOUNT * 3);
    for (let i = 0; i < SCOUNT; i++) {
      const i3 = i * 3;
      spos[i3]     = (Math.random() - 0.5) * 3000;
      spos[i3 + 1] = (Math.random() - 0.5) * 2000;
      spos[i3 + 2] = -800 - Math.random() * 800;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(spos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 1.5, transparent: true,
      opacity: 0.4, depthWrite: false, sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // mouse / scroll influence
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // resize
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', resize);

    // animate
    let t0 = 0;
    function animate() {
      t0 += 0.002;
      points.rotation.y = t0 * 0.5;
      points.rotation.x = Math.sin(t0 * 0.7) * 0.08;
      stars.rotation.y = -t0 * 0.2;

      // gentle camera parallax toward mouse
      camera.position.x += (mouse.x * 80 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 60 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  function generateDotTexture() {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  /* -------------------- Session card magnetic hover (subtle tilt) -------------------- */
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
