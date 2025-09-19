(() => {
  // Canvas setup
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d', { alpha: true });
  let w, h, columns, drops, fontSize, density;
  let effectsEnabled = true;

  // Characters for rain
  const glyphs = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const glyphArray = glyphs.split('');

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    fontSize = Math.max(14, Math.floor(w / 80));
    density = Math.min(1.15, Math.max(0.85, w / 1600));
    columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  }

  // Mouse influence
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  // Draw loop
  function draw() {
    requestAnimationFrame(draw);

    // Fade the canvas to create trail
    ctx.fillStyle = effectsEnabled ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Lead glyph glow
      const dist = Math.hypot(mouse.x - x, mouse.y - y);
      const near = dist < 140 ? 1 : 0;

      // Color gradient for depth
      const glow = near ? 1 : Math.random() * 0.35 + 0.35;
      ctx.shadowColor = `rgba(0,255,136,${0.35 + glow * 0.25})`;
      ctx.shadowBlur = 14 * glow;

      const char = glyphArray[(Math.random() * glyphArray.length) | 0];
      ctx.fillStyle = `rgba(0,255,136,${0.72 + glow * 0.28})`;
      ctx.fillText(char, x, y);

      // trailing dim glyph
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(0,180,96,0.25)`;
      ctx.fillText(char, x, y - fontSize);

      // reset or move drop
      if (y > h && Math.random() > (0.985 - density * 0.05)) {
        drops[i] = Math.floor(Math.random() * -50);
      } else {
        drops[i]++;
      }
    }
  }

  // Typewriter headline
  const line = 'AWAKEN THE SIGNAL.';
  let ti = 0;
  function typewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    el.textContent = line.slice(0, ti) + (ti % 2 ? '▋' : ' ');
    ti++;
    if (ti <= line.length) {
      setTimeout(typewriter, 80);
    } else {
      el.textContent = line; // solid when done
    }
  }

  // Glitch on title
  const glitch = document.getElementById('glitch');
  if (glitch) {
    const trigger = () => {
      glitch.classList.remove('active');
      // force reflow
      void glitch.offsetWidth;
      glitch.classList.add('active');
    };
    glitch.addEventListener('mouseenter', trigger);
    setInterval(trigger, 4000);
  }

  // Easter egg: type "rabbit" to reveal
  const keyBuf = [];
  const code = 'rabbit';
  const rabbit = document.getElementById('rabbit');
  window.addEventListener('keydown', (e) => {
    keyBuf.push(e.key.toLowerCase());
    if (keyBuf.length > code.length) keyBuf.shift();
    if (keyBuf.join('') === code) {
      rabbit && rabbit.classList.toggle('show');
    }
  });

  // Controls
  const toggleFX = document.getElementById('toggleFX');
  if (toggleFX) {
    toggleFX.addEventListener('click', () => {
      effectsEnabled = !effectsEnabled;
      toggleFX.textContent = effectsEnabled ? 'TOGGLE FX' : 'FX OFF';
    });
  }
  const jackIn = document.getElementById('jackIn');
  if (jackIn) {
    jackIn.addEventListener('click', () => {
      window.scrollTo({ top: document.getElementById('contact').offsetTop - 64, behavior: 'smooth' });
    });
  }

  // Lifecycle
  window.addEventListener('resize', resize, { passive: true });
  resize();
  typewriter();
  draw();
})();
