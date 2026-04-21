<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>من ديوان المتنبي</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&family=Amiri+Quran&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0e0d0b;
    --bg-mid:    #141210;
    --gold:      #c9a96e;
    --gold-dim:  #7a6340;
    --text:      #e8e0d0;
    --text-dim:  #8a7f6e;
    --line:      rgba(201,169,110,0.15);
    --btn-bg:    rgba(201,169,110,0.06);
    --btn-hover: rgba(201,169,110,0.12);
    --font-poem: 'Amiri', 'Amiri Quran', serif;
  }

  html, body {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-poem);
    -webkit-font-smoothing: antialiased;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 3rem 1.5rem;
  }

  .wrapper {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    animation: fadeIn 1s ease forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  /* ── ornament ── */
  .ornament {
    font-size: 22px;
    color: var(--gold-dim);
    letter-spacing: 0.3em;
    margin-bottom: 2rem;
    opacity: 0.7;
  }

  /* ── header ── */
  .poem-title {
    font-size: 13px;
    letter-spacing: 0.18em;
    color: var(--gold);
    text-align: center;
    font-style: italic;
    margin-bottom: 0.4rem;
  }

  .poem-author {
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--text-dim);
    text-align: center;
    margin-bottom: 2.8rem;
  }

  /* ── rule ── */
  .rule {
    width: 60px;
    height: 1px;
    background: var(--line);
    margin-bottom: 3rem;
  }

  /* ── verses ── */
  .verses {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.2rem;
    width: 100%;
    margin-bottom: 3rem;
  }

  .bayt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    width: 100%;
  }

  .shatr {
    font-size: clamp(19px, 4vw, 23px);
    line-height: 1.75;
    text-align: center;
    color: var(--text);
    direction: rtl;
  }

  .shatr:first-child {
    position: relative;
    padding-bottom: 0.6rem;
  }

  .shatr:first-child::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 1px;
    background: var(--line);
  }

  /* ── bottom rule ── */
  .rule-bottom {
    width: 60px;
    height: 1px;
    background: var(--line);
    margin-bottom: 2.8rem;
  }

  /* ── navigation ── */
  .nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0;
    width: 100%;
    direction: ltr;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    width: 100%;
    border: 1px solid rgba(201,169,110,0.18);
    border-radius: 2px;
    background: var(--btn-bg);
    color: var(--text-dim);
    font-family: var(--font-poem);
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .nav-btn:hover {
    background: var(--btn-hover);
    color: var(--gold);
    border-color: rgba(201,169,110,0.35);
  }

  .nav-btn.prev {
    justify-content: flex-start;
  }

  .nav-btn.next {
    justify-content: flex-end;
  }

  .nav-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1.2rem;
  }

  .nav-index-btn {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(201,169,110,0.18);
    border-radius: 50%;
    background: var(--btn-bg);
    color: var(--text-dim);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .nav-index-btn:hover {
    background: var(--btn-hover);
    color: var(--gold);
    border-color: rgba(201,169,110,0.35);
  }

  .nav-index-btn svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .nav-counter {
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    margin-top: 6px;
    direction: ltr;
  }

  /* ── footer ── */
  .footer-ornament {
    font-size: 16px;
    color: var(--gold-dim);
    margin-top: 3rem;
    opacity: 0.4;
  }

  /* ── scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
</style>
</head>
<body>

<div class="wrapper">

  <div class="ornament">⸻  ❧  ⸻</div>

  <p class="poem-title">من ديوان المتنبي</p>
  <p class="poem-author">أبو الطيب أحمد بن الحسين المتنبي</p>

  <div class="rule"></div>

  <div class="verses">

    <div class="bayt">
      <span class="shatr">على قدرِ أهلِ العزمِ تأتي العزائمُ</span>
      <span class="shatr">وتأتي على قدرِ الكرامِ المكارمُ</span>
    </div>

    <div class="bayt">
      <span class="shatr">السيفُ أصدقُ إنباءً من الكتبِ</span>
      <span class="shatr">في حدِّهِ الحدُّ بينَ الجِدِّ واللعبِ</span>
    </div>

    <div class="bayt">
      <span class="shatr">أنا الذي نظرَ الأعمى إلى أدبي</span>
      <span class="shatr">وأسمعتْ كلماتي مَن بهِ صَمَمُ</span>
    </div>

  </div>

  <div class="rule-bottom"></div>

  <nav class="nav">
    <a href="#" class="nav-btn prev">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="flex-shrink:0">
        <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
      السابقة
    </a>

    <div class="nav-center">
      <a href="فهرس القصائد.html" class="nav-index-btn" title="الفهرس">
        <svg viewBox="0 0 16 16">
          <rect x="2" y="3" width="12" height="1.5" rx="0.5"/>
          <rect x="2" y="7" width="8" height="1.5" rx="0.5"/>
          <rect x="2" y="11" width="10" height="1.5" rx="0.5"/>
        </svg>
      </a>
      <span class="nav-counter">١ / ١٢</span>
    </div>

    <a href="#" class="nav-btn next">
      التالية
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="flex-shrink:0">
        <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
    </a>
  </nav>

  <div class="footer-ornament">٭</div>

</div>

</body>
</html>