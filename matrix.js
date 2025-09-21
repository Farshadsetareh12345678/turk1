// Matrix rain background
(function () {
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height, columns, drops;
  const glyphs = 'アィゥエォカキクケコサシスセソタチツテトナニヌネノ01十冫水山口田ABCDEFGHIJKLmnopqrstuvwxyz<>[]{}+=-*/'.split('');
  const bgAlpha = 0.08;
  const color = '#00ff95';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 16);
    drops = new Array(columns).fill(0).map(() => Math.random() * height);
  }

  function draw() {
    ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
    ctx.fillRect(0, 0, width, height);

    ctx.font = '16px ui-monospace, monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * 16;
      const y = drops[i] * 16;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;

      if (y > height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1 + Math.random() * 0.5;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  // toggle button
  const toggle = document.getElementById('toggle-rain');
  let visible = true;
  toggle?.addEventListener('click', () => {
    visible = !visible;
    canvas.style.display = visible ? 'block' : 'none';
  });
})();
