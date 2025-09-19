<?php
  // نسخه برای جلوگیری از کش — در دیپلوی روی پروDUCTION بهتره با filemtime ست بشه
  $ver = time();
  // عنوان داینامیک ساده
  $title = "MATRIX//SYS";
  // امنیت حداقلی هدرها
  header("X-Content-Type-Options: nosniff");
  header("X-Frame-Options: DENY");
  header("Referrer-Policy: no-referrer");
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
  <title><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="theme-color" content="#00ff88" />
  <meta name="description" content="A cinematic Matrix-inspired experience with canvas rain, CRT glow, and glitch interactions." />
  <link rel="preload" as="style" href="assets/style.css?v=<?php echo $ver; ?>">
  <link rel="stylesheet" href="assets/style.css?v=<?php echo $ver; ?>">
</head>
<body>
  <!-- لایه CRT/اسکن‌لاین -->
  <div class="crt-overlay"></div>

  <!-- کانواس بارش ماتریکس -->
  <canvas id="matrix"></canvas>

  <!-- محتوای روی کانواس -->
  <header class="hud">
    <div class="brand">
      <span id="glitch" data-text="MATRIX//SYS">MATRIX//SYS</span>
      <small>follow the signal</small>
    </div>
    <nav class="nav">
      <a href="#about" class="btn ghost">/about</a>
      <a href="#nodes" class="btn ghost">/nodes</a>
      <a href="#contact" class="btn primary">/enter</a>
    </nav>
  </header>

  <main class="hero">
    <h1 class="type" id="typewriter"></h1>
    <p class="subtitle">
      واقعیت را هک نکن؛ فقط آن را واضح‌تر ببین.
    </p>
    <div class="actions">
      <button id="jackIn" class="btn primary">JACK IN</button>
      <button id="toggleFX" class="btn ghost">TOGGLE FX</button>
    </div>
  </main>

  <section id="about" class="section">
    <h2>/about</h2>
    <p>
      این یک تجربه‌ی ماتریکس-الهام است: افکت بارش کاراکترها، گلیچ تایپوگرافی، درخشش نئون و حس CRT.
      همه‌چیز با JS خام، بدون وابستگی خارجی.
    </p>
  </section>

  <section id="nodes" class="section grid">
    <div class="card">
      <h3>Node_01</h3>
      <p>کانال دیتا پایدار. پینگ پایین، نویز کنترل‌شده.</p>
    </div>
    <div class="card">
      <h3>Node_02</h3>
      <p>نویز بالا، اما کشف الگوها سریع‌تر.</p>
    </div>
    <div class="card">
      <h3>Node_03</h3>
      <p>کانال امن. مناسب برای جَک-این طولانی.</p>
    </div>
  </section>

  <section id="contact" class="section">
    <h2>/enter</h2>
    <form class="form" method="post" action="#">
      <label>
        <span>handle</span>
        <input type="text" name="handle" autocomplete="off" maxlength="32" required />
      </label>
      <label>
        <span>message</span>
        <textarea name="message" rows="4" maxlength="500" required></textarea>
      </label>
      <button type="submit" class="btn primary">SEND PULSE</button>
    </form>
  </section>

  <!-- خرگوش سفید؛ با ایستراگ نمایش/مخفی می‌شود -->
  <img src="assets/white-rabbit.svg" alt="white rabbit" id="rabbit" />

  <script src="assets/matrix.js?v=<?php echo $ver; ?>" defer></script>
</body>
</html>
