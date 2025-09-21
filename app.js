// Matrix-styled live BTC candlestick chart (Canvas + Toobit API)
(function(){
  const canvas = document.getElementById('chart-canvas');
  const ctx = canvas.getContext('2d');

  // HUD elements
  const lastPriceEl = document.getElementById('last-price');
  const oEl = document.getElementById('o');
  const hEl = document.getElementById('h');
  const lEl = document.getElementById('l');
  const cEl = document.getElementById('c');

  // Theme
  const colors = {
    bg: 'transparent',
    grid: 'rgba(0,255,149,0.12)',
    axis: 'rgba(230,255,245,0.5)',
    upBody: '#00ff95',
    dnBody: '#0bbf7a',
    wick: '#b3ffe2',
    lastLine: 'rgba(0,255,149,0.45)',
    lastLabelBg: 'rgba(0,0,0,0.6)',
    lastLabelText: '#00ff95'
  };

  // Chart state
  const candles = []; // {t, o, h, l, c}
  const maxCandles = 180;
  let pxW = 0, pxH = 0;
  let padding = { top: 14, right: 56, bottom: 20, left: 8 };
  let minPrice = Infinity, maxPrice = -Infinity;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    pxW = canvas.clientWidth;
    pxH = canvas.clientHeight;
    canvas.width = Math.floor(pxW * dpr);
    canvas.height = Math.floor(pxH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  window.addEventListener('resize', resize);

  function fmt(n){ return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }); }

  function computeScale(){
    minPrice = Infinity; maxPrice = -Infinity;
    for(const k of candles){
      if(k.h > maxPrice) maxPrice = k.h;
      if(k.l < minPrice) minPrice = k.l;
    }
    if (!isFinite(minPrice) || !isFinite(maxPrice)) return;
    const range = (maxPrice - minPrice) || 1;
    const pad = range * 0.05;
    minPrice -= pad; maxPrice += pad;
  }

  function yScale(price){
    const h = pxH - padding.top - padding.bottom;
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    return pxH - padding.bottom - ratio * h;
  }

  function xScale(index){
    const plotW = pxW - padding.left - padding.right;
    const step = plotW / Math.max(1, candles.length);
    return padding.left + (index + 0.5) * step;
  }

  function drawGrid(){
    ctx.save();
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    const rows = 6;
    for(let i=0;i<=rows;i++){
      const y = padding.top + (i * (pxH - padding.top - padding.bottom) / rows);
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(pxW - padding.right, y); ctx.stroke();
      const value = maxPrice - (i * (maxPrice - minPrice) / rows);
      ctx.fillStyle = 'rgba(230,255,245,0.6)';
      ctx.font = '11px ui-monospace, monospace';
      ctx.fillText(fmt(value), pxW - padding.right + 6, y + 3);
    }
    const cols = 12;
    for(let i=0;i<=cols;i++){
      const x = padding.left + (i * (pxW - padding.left - padding.right) / cols);
      ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, pxH - padding.bottom); ctx.stroke();
    }
    ctx.restore();
  }

  function drawCandles(){
    if(candles.length === 0) return;
    const plotW = pxW - padding.left - padding.right;
    const step = plotW / Math.max(1, candles.length);
    const bodyW = Math.max(2, Math.min(18, step * 0.6));

    candles.forEach((k, i) => {
      const x = xScale(i);
      const yO = yScale(k.o), yC = yScale(k.c);
      const yH = yScale(k.h), yL = yScale(k.l);
      const up = k.c >= k.o;

      ctx.strokeStyle = colors.wick;
      ctx.lineWidth = Math.max(1, bodyW * 0.12);
      ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, yL); ctx.stroke();

      const top = Math.min(yO, yC);
      const bottom = Math.max(yO, yC);
      const h = Math.max(1, bottom - top);
      ctx.fillStyle = up ? colors.upBody : colors.dnBody;
      roundRect(ctx, x - bodyW/2, top, bodyW, h, Math.min(6, bodyW/3));
      ctx.fill();
    });
  }

  function drawLastPrice(){
    if(candles.length === 0) return;
    const last = candles[candles.length - 1];
    const y = yScale(last.c);

    ctx.save();
    ctx.strokeStyle = colors.lastLine;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(pxW - padding.right, y); ctx.stroke();
    ctx.restore();

    const txt = fmt(last.c);
    ctx.font = '12px ui-monospace, monospace';
    const textW = ctx.measureText(txt).width;
    const padX = 6;
    const bx = pxW - padding.right + 4;
    const by = y - 10;
    ctx.fillStyle = colors.lastLabelBg;
    ctx.strokeStyle = 'rgba(0,255,149,0.35)';
    ctx.lineWidth = 1;
    roundRect(ctx, bx, by, textW + padX*2, 18, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = colors.lastLabelText;
    ctx.fillText(txt, bx + padX, by + 13);

    lastPriceEl.textContent = txt;
    oEl.textContent = fmt(last.o);
    hEl.textContent = fmt(last.h);
    lEl.textContent = fmt(last.l);
    cEl.textContent = fmt(last.c);
  }

  function draw(){
    if(pxW === 0 || pxH === 0) return;
    ctx.clearRect(0,0,pxW,pxH);
    if(candles.length === 0) return;
    computeScale();
    drawGrid();
    drawCandles();
    drawLastPrice();
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  // --- تغییر به API توبیت ---
  async function loadInitial(){
    try{
      const url = 'https://api.toobit.com/api/v1/market/kline?symbol=BTC-USDT&interval=1m&limit=200';
      const res = await fetch(url);
      const json = await res.json();
      const data = json.data;
      candles.length = 0;
      for(const k of data){
        candles.push({
          t: k[0],
          o: +k[1],
          h: +k[2],
          l: +k[3],
          c: +k[4]
        });
      }
      trim();
      draw();
    }catch(e){
      console.warn('Failed to load initial klines', e);
    }
  }

  function trim(){
    while(candles.length > maxCandles) candles.shift();
  }

  function connectWS(){
    const wsUrl = 'wss://stream.toobit.com/market/kline?symbol=BTC-USDT&interval=1m';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (ev) => {
      try{
        const msg = JSON.parse(ev.data);
        if
