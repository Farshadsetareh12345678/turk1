const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = 'アァイィウヴエェオカガキギクグケゲコゴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const chars = letters.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array.from({length: columns}, () => 1);

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  drops.forEach((y,i)=>{
    const text = chars[Math.floor(Math.random()*chars.length)];
    ctx.fillText(text,i*fontSize,y*fontSize);
    if(y*fontSize>canvas.height && Math.random()>0.975) drops[i]=0;
    drops[i]++;
  });
}
setInterval(draw,33);
window.addEventListener('resize',()=>{
  canvas.height=window.innerHeight;
  canvas.width=window.innerWidth;
});
