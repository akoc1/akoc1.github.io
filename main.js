/* =========================================================
   akoc1 // portfolio — indie arcade interactions
   ========================================================= */

(() => {
  // ============ BOOT SEQUENCE ============
  const boot     = document.getElementById('boot');
  const bootLog  = document.getElementById('bootLog');
  const bootLines = [
    '* a small studio of one.',
    '* loading determination..........[ok]',
    '* sharpening pixels..............[ok]',
    '* tying climbing shoes...........[ok]',
    '* compiling godot bindings.......[ok]',
    '* waking developer...............[ok]',
    '',
    '* welcome. press start.',
  ];

  let bi = 0, bj = 0;
  function typeBoot() {
    if (bi >= bootLines.length) {
      setTimeout(closeBoot, 600);
      return;
    }
    const line = bootLines[bi];
    if (bj <= line.length) {
      bootLog.textContent =
        bootLines.slice(0, bi).join('\n') +
        (bi > 0 ? '\n' : '') +
        line.slice(0, bj);
      bj++;
      setTimeout(typeBoot, line.length ? 16 : 60);
    } else {
      bi++; bj = 0;
      setTimeout(typeBoot, 110);
    }
  }
  function closeBoot() {
    boot.classList.add('hidden');
    document.body.style.overflow = '';
    startTypewriter();
    startFloaters();
  }
  document.body.style.overflow = 'hidden';
  typeBoot();

  // skip boot
  ['click','keydown','touchstart'].forEach(ev => {
    boot.addEventListener(ev, () => {
      bi = bootLines.length;
      bootLog.textContent = bootLines.join('\n');
      closeBoot();
    }, { once: true });
  });

  // ============ TYPEWRITER (asterisk dialog) ============
  const tw = document.getElementById('typewriter');
  const twLines = [
    'godot · c# · gdscript — indie game developer.',
    'computer engineering student, professional bug-summoner.',
    'shipped on play store, itch.io and the open web.',
    'the mountain is steep. i keep climbing.',
    'filled with determination.',
    'despite everything, it\'s still you. arif. building.',
  ];
  let tli = 0, tci = 0, deleting = false;
  function startTypewriter() {
    if (!tw) return;
    function step() {
      const line = twLines[tli];
      if (!deleting) {
        tw.textContent = line.slice(0, tci++);
        if (tci > line.length) {
          deleting = true;
          return setTimeout(step, 5500);
        }
        setTimeout(step, 55);
      } else {
        tw.textContent = line.slice(0, tci--);
        if (tci < 0) {
          deleting = false;
          tli = (tli + 1) % twLines.length;
          tci = 0;
          return setTimeout(step, 500);
        }
        setTimeout(step, 28);
      }
    }
    step();
  }

  // ============ CLOCK ============
  const clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  tick();
  setInterval(tick, 1000);

  // ============ SOUL CURSOR ============
  const soul = document.getElementById('cursorSoul');
  const spot = document.getElementById('spotlight');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let sx = mx, sy = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (spot) {
      spot.style.setProperty('--mx', `${mx}px`);
      spot.style.setProperty('--my', `${my}px`);
    }
  });

  function raf() {
    sx += (mx - sx) * 0.35;
    sy += (my - sy) * 0.35;
    if (soul) soul.style.transform = `translate(${sx}px, ${sy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  // hover state
  document.querySelectorAll('a, button, [data-cursor="pointer"], .work, .stack-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // ============ 3D TILT ============
  document.querySelectorAll('[data-tilt]').forEach(card => {
    let rect;
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top)  / rect.height;
      const rX = (py - 0.5) * -5;
      const rY = (px - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translate(-2px,-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      rect = null;
    });
  });

  // ============ SCROLL REVEAL ============
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section, .stack-card, .work, .quest, .stats-card, .dialog-big').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  // ============ STRAWBERRY COLLECTION ============
  // Hovering or clicking a work card "collects" its strawberry (Celeste vibe).
  const berryCountEl = document.getElementById('berryCount');
  const collected = new Set();
  const totalBerries = document.querySelectorAll('[data-berry]').length;

  function collectBerry(work) {
    if (!work || collected.has(work)) return;
    collected.add(work);
    work.classList.add('collected');
    berryCountEl.textContent = collected.size;

    // sparkle pop
    spawnBerryPop(work);

    if (collected.size === totalBerries) {
      showToast('* ALL BERRIES COLLECTED — RED HEART <3');
      const hud = document.querySelector('.hud');
      if (hud) {
        hud.style.borderColor = 'var(--accent-2)';
        hud.style.color = 'var(--accent-2)';
        hud.style.background = 'rgba(255,210,63,0.12)';
      }
    } else if (collected.size === totalBerries - 1) {
      showToast('* ONE STRAWBERRY LEFT...');
      const remaining = [...document.querySelectorAll('[data-berry]')]
        .find(w => !collected.has(w));
      if (remaining) {
        remaining.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          remaining.classList.add('hint');
          setTimeout(() => remaining.classList.remove('hint'), 2200);
        }, 600);
      }
    } else {
      showToast(`* GOT A STRAWBERRY (${collected.size}/${totalBerries})`);
    }
  }

  document.querySelectorAll('[data-berry]').forEach(work => {
    // collect on first hover OR click
    const handler = () => collectBerry(work);
    work.addEventListener('mouseenter', handler, { once: true });
    work.addEventListener('click', handler);
  });

  function spawnBerryPop(work) {
    const rect = work.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'berry-pop';
    pop.style.cssText = `
      position: fixed;
      left: ${rect.right - 20}px;
      top: ${rect.top + 14}px;
      z-index: 999;
      pointer-events: none;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      color: #ffd23f;
      text-shadow: 0 0 8px #ffd23f;
      animation: berryPopAnim 1s ease-out forwards;
    `;
    pop.textContent = '+1';
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  }

  // inject pop keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes berryPopAnim {
      0%   { opacity: 0; transform: translateY(0) scale(0.5); }
      30%  { opacity: 1; transform: translateY(-12px) scale(1.2); }
      100% { opacity: 0; transform: translateY(-40px) scale(1); }
    }
  `;
  document.head.appendChild(style);

  // ============ TOAST ============
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ============ SAVE POINT ============
  const savePoint = document.getElementById('savePoint');
  const saveSfx = new Audio('resources/sfx/save-sfx.mp3');
  saveSfx.preload = 'auto';
  saveSfx.volume = 0.7;
  if (savePoint) {
    savePoint.addEventListener('click', () => {
      savePoint.classList.add('saved');
      showToast('* FILE SAVED. STAY DETERMINED.');
      try { saveSfx.currentTime = 0; saveSfx.play(); } catch (_) {}
      // brief flash
      document.body.style.transition = 'filter 0.15s';
      document.body.style.filter = 'brightness(1.4)';
      setTimeout(() => { document.body.style.filter = ''; }, 150);
    });
  }

  // ============ ACTIVE BATTLE-MENU ON SCROLL ============
  const sections = ['stack','works','stats','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const bmLinks = document.querySelectorAll('.battle-menu .bm');

  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        bmLinks.forEach(d => {
          d.classList.toggle('active', d.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => navIO.observe(s));

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ KEYBOARD SHORTCUTS (Z / X) ============
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const k = e.key.toLowerCase();
    if (k === 'z') {
      // Z = primary action: scroll to works
      e.preventDefault();
      document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
      showToast('* [Z] SEE THE WORKS');
    } else if (k === 'x') {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      showToast('* [X] SAY HELLO');
    } else if (k === 's') {
      e.preventDefault();
      savePoint?.click();
    }
  });

  // ============ KONAMI CODE ============
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  window.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[kIdx]) {
      kIdx++;
      if (kIdx === konami.length) {
        triggerEaster();
        kIdx = 0;
      }
    } else {
      kIdx = (key === konami[0]) ? 1 : 0;
    }
  });

  function triggerEaster() {
    document.body.classList.toggle('konami');
    const e = document.getElementById('easter');
    e.classList.remove('show');
    void e.offsetWidth;
    e.classList.add('show');
    setTimeout(() => e.classList.remove('show'), 2600);
  }

  // ============ FLOATING BERRIES / HEARTS ============
  const floatersBox = document.getElementById('floaters');
  function startFloaters() {
    if (!floatersBox) return;
    setInterval(() => {
      if (document.hidden) return;
      const isBerry = Math.random() > 0.5;
      let node;
      if (isBerry) {
        node = document.createElement('img');
        node.src = 'images/Strawberry.webp';
        node.alt = '';
        node.width = 18;
        node.height = 20;
        node.className = 'berry-img';
      } else {
        const svgNS = 'http://www.w3.org/2000/svg';
        node = document.createElementNS(svgNS, 'svg');
        node.setAttribute('width', '12');
        node.setAttribute('height', '11');
        const use = document.createElementNS(svgNS, 'use');
        use.setAttribute('href', '#i-heart');
        use.setAttribute('fill', '#ff2d2d');
        node.appendChild(use);
      }
      const x = Math.random() * 100;
      const dur = 14 + Math.random() * 10;
      node.style.left = `${x}%`;
      node.style.bottom = '-40px';
      node.style.animationDuration = `${dur}s`;
      floatersBox.appendChild(node);
      setTimeout(() => node.remove(), dur * 1000 + 200);
    }, 1800);
  }

  // ============ GLITCH RESTART ON HOVER ============
  document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  });

})();
