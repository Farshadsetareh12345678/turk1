<?php
// ساده: ذخیره سیگنال‌های ارسالی در data/signals.json
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['city'])) {
    $file = __DIR__ . '/data/signals.json';
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    $payload = [
        'city' => $_POST['city'],
        'timestamp' => time(),
        'agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Matrix World — سیگنال‌های مخفی</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>
  <!-- نویز آنالوگ -->
  <div class="noise"></div>

  <!-- بوم بارش ماتریکس -->
  <canvas id="matrixCanvas"></canvas>

  <!-- هدر -->
  <header class="hud">
    <div class="brand">
      <span class="logo">MW</span>
      <span class="title">Matrix World</span>
    </div>
    <div class="controls">
      <button id="toggleTheme" class="btn">حالت نئون/تاریک</button>
      <button id="toggleRain" class="btn">بارش ماتریکس</button>
      <button id="pulseWorld" class="btn">پالس جهان</button>
    </div>
  </header>

  <!-- توضیحات/زیرتیتر -->
  <section class="intro">
    <p>روی نقاط شهرها کلیک کن تا «سیگنال‌های مخفی» را منتقل کنی. خطوط نئون مسیر داده را نشان می‌دهند. هر کلیک یک ثبت واقعی در سرور انجام می‌دهد.</p>
  </section>

  <!-- نقشه جهان -->
  <main class="world-wrap">
    <div class="world-panel">
      <object id="worldSVG" type="image/svg+xml" data="assets/world.svg"></object>
      <canvas id="linesCanvas"></canvas>
    </div>
    <aside class="sidebar">
      <h2>آخرین سیگنال‌ها</h2>
      <ul id="signalsList"></ul>
      <div class="legend">
        <div><span class="dot dot-green"></span><b>سیگنال فعال:</b> انتقال در حال انجام</div>
        <div><span class="dot dot-cyan"></span><b>گره مقصد:</b> دریافت موفق</div>
      </div>
    </aside>
  </main>

  <!-- فوتر -->
  <footer class="footer">
    <div class="credits">© 2025 — Matrix World • ساخته‌شده با HTML/CSS/JavaScript و لایه‌ی سبک PHP</div>
  </footer>

  <script src="assets/script.js"></script>
</body>
</html>
