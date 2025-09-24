// حالت‌ها
let rainOn = true;
let neonTheme = true;

// انتخاب‌ها
const matrixCanvas = document.getElementById('matrixCanvas');
const linesCanvas = document.getElementById('linesCanvas');
const worldObj = document.getElementById('worldSVG');
const signalsList = document.getElementById('signalsList');

// اندازه‌دهی
function fitCanvas(cnv) {
  cnv.width = cnv.clientWidth || window.innerWidth;
  cnv.height = cnv.clientHeight || window.innerHeight;
}
function resizeAll() {
  fitCanvas(matrixCanvas);
  fitCanvas(linesCanvas);
}
window.addEventListener('resize', resizeAll);
resizeAll();

/* ===== بارش ماتریکس ===== */
const mCtx = matrixCanvas.getContext('2d');
const columns = [];
const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#@!&*+';
function initRain() {
  columns.length = Math.floor(window.innerWidth / 14);
  for (let i = 0; i < columns.length; i++) {
    columns[i] = Math.random() * window.innerHeight;
  }
}
function drawRain() {
  if (!rainOn) return;
  mCtx.fillStyle = 'rgba(10,15,10,0.2)';
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  mCtx.fillStyle = '#00ff7f';
  mCtx.font = '14px JetBrains Mono';
  for (let i = 0; i < columns.length; i++) {
    const char = charset[Math.floor(Math.random() * charset.length)];
    mCtx.fillText(char, i * 14, columns[i]);
    columns[i] += 16 + Math.random() * 8;
    if (columns[i] > matrixCanvas.height) columns[i] = 0;
  }
}
initRain();

/* ===== خطوط انتقال داده ===== */
const lCtx = linesCanvas.getContext('2d');
function drawLine(a, b, color = 'rgba(0,255,127,0.8)') {
  lCtx.strokeStyle = color;
  lCtx.lineWidth = 2;
  lCtx.beginPath();
  lCtx.moveTo(a.x, a.y);
  lCtx.bezierCurveTo(
    (a.x + b.x) / 2, a.y - 80,
    (a.x + b.x) / 2, b.y + 80,
    b.x, b.y
  );
  lCtx.stroke();
}

/* ===== تعامل با نقشه ===== */
let svg;
let cities = []; // {name, x, y, el}
function mapPoint(el) {
  // تبدیل مختصات SVG به مختصات Canvas بر اساس اندازه‌ی object
  const objRect = worldObj.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  const scaleX = objRect.width / svg.viewBox.baseVal.width;
  const scaleY = objRect.height / svg.viewBox.baseVal.height;
  const cx = el.cx.baseVal.value * scaleX + objRect.left;
  const cy = el.cy.baseVal.value * scaleY + objRect.top;
  return { x: cx - linesCanvas.getBoundingClientRect().left, y: cy - linesCanvas.getBoundingClientRect().top };
}

function attachMapHandlers() {
  svg = worldObj.contentDocument.documentElement;
  const nodes = svg.querySelectorAll('circle[data-city]');
  cities = Array.from(nodes).map(el => ({
    name: el.getAttribute('data-city'),
    x: el.cx.baseVal.value,
    y: el.cy.baseVal.value,
    el
  }));

  nodes.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', () => el.classList.add('pulse'));
    el.addEventListener('mouseleave', () => el.classList.remove('pulse'));
    el.addEventListener('click', async () => {
      const src = el;
      // انتخاب مقصد تصادفی متفاوت
      const others = cities.filter(c => c.el !== src);
      const dst = others[Math.floor(Math.random() * others.length)];
      // رسم خط
      lCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      drawLine(mapPoint(src), mapPoint(dst.el));
      // ثبت سیگنال در سرور
      try {
        const res = await fetch(location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ city: src.getAttribute('data-city') }).toString()
        });
        const json = await res.json();
        if (json.ok) {
          addSignal(`${src.getAttribute('data-city')} → ${dst.name}`);
        }
      } catch (e) {
        addSignal(`خطا در ثبت سیگنال برای ${src.getAttribute('data-city')}`);
      }
    });
  });
}

worldObj.addEventListener('load', () => {
  attachMapHandlers();
});

/* ===== لیست سیگنال‌ها ===== */
function addSignal(text) {
  const li = document.createElement('li');
  const dot = document.createElement('span');
  dot.className = 'dot dot-green';
  const t = document.createElement('span');
  t.textContent = text;
  li.appendChild(dot);
  li.appendChild(t);
  signalsList.prepend(li);
}

/* ===== کنترل‌ها ===== */
document.getElementById('toggleTheme').addEventListener('click', () => {
  neonTheme = !neonTheme;
  document.documentElement.style.setProperty('--neon', neonTheme ? '#00ff7f' : '#25f4ee');
  document.documentElement.style.setProperty('--neon-soft', neonTheme ? '#37ffab' : '#7debf1');
});
document.getElementById('toggleRain').addEventListener('click', () => { rainOn = !rainOn; });
document.getElementById('pulseWorld').addEventListener('click', () => {
  // حالت پالس جهانی: تمام نقاط شهرها پالس می‌گیرند
  if (!svg) return;
  svg.querySelectorAll('circle[data-city]').forEach(el => el.classList.toggle('pulse'));
});

/* ===== حلقه رندر ===== */
function tick() {
  drawRain();
  requestAnimationFrame(tick);
}
tick();
