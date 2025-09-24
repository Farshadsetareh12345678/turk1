<?php
// ذخیره سیگنال‌ها در یک فایل JSON ساده
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['city'])) {
    $file = __DIR__ . '/signals.json';
    $payload = [
        'city' => $_POST['city'],
        'timestamp' => time()
    ];
    $data = [];
    if (file_exists($file)) {
        $json = file_get_contents($file);
        $data = json_decode($json, true) ?: [];
    }
    $data[] = $payload;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    header('Content-Type: application/json');
    echo json_encode(['ok' => true]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Matrix World — نسخه تک‌فایلی</title>
  <style>
    body {
      margin:0; padding:0;
      background:#000;
      color:#0f0;
      font-family: monospace;
      overflow:hidden;
    }
    #matrixCanvas {
      position:fixed; inset:0;
      z-index:0;
    }
    #world {
      position:relative;
      z-index:1;
      width:100%;
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    svg {
      width:80%; height:auto;
      filter: drop-shadow(0 0 10px #0f0);
    }
    circle {
      fill:#0f0; cursor:pointer;
      transition:0.3s;
    }
    circle:hover {
      fill:#fff;
    }
    #signals {
      position:fixed;
      top:10px; left:10px;
      background:rgba(0,0,0,0.6);
      padding:10px;
      border:1px solid #0f0;
      max-height:200px;
      overflow:auto;
      z-index:2;
    }
  </style>
</head>
<body>
<canvas id="matrixCanvas"></canvas>

<div id="signals"><b>سیگنال‌ها:</b><ul id="list"></ul></div>

<div id="world">
  <!-- نقشه ساده با چند شهر -->
  <svg viewBox="0 0 1200 600">
    <circle cx="300" cy="300" r="6" data-city="Berlin"/>
    <circle cx="400" cy="320" r="6" data-city="Paris"/>
    <circle cx="500" cy="340" r="6" data-city="Rome"/>
    <circle cx="800" cy="300" r="6" data-city="Tehran"/>
    <circle cx="1000" cy="280" r="6" data-city="Tokyo"/>
  </svg>
</div>

<script>
// بارش ماتریکس
const canvas=document.getElementById("matrixCanvas");
const ctx=canvas.getContext("2d");
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
const letters="01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
const fontSize=14;
const columns=canvas.width/fontSize;
const drops=Array(Math.floor(columns)).fill(1);
function draw(){
  ctx.fillStyle="rgba(0,0,0,0.05)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#0f0";
  ctx.font=fontSize+"px monospace";
  for(let i=0;i<drops.length;i++){
    const text=letters.charAt(Math.floor(Math.random()*letters.length));
    ctx.fillText(text,i*fontSize,drops[i]*fontSize);
    if(drops[i]*fontSize>canvas.height&&Math.random()>0.975){drops[i]=0;}
    drops[i]++;
  }
}
setInterval(draw,33);

// تعامل با شهرها
const circles=document.querySelectorAll("circle");
const list=document.getElementById("list");
circles.forEach(c=>{
  c.addEventListener("click",async()=>{
    const city=c.getAttribute("data-city");
    const li=document.createElement("li");
    li.textContent="سیگنال از "+city;
    list.prepend(li);
    try{
      await fetch(location.pathname,{
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body:"city="+encodeURIComponent(city)
      });
    }catch(e){}
  });
});
</script>
</body>
</html>
