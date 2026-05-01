---
title: تعريف النهاية — ε-δ الحدس الكامل
tags:
  - رياضيات
  - تحليل_رياضي
  - فلسفة
  - نهايات
  - ε-δ
author: حامد الخطيب
description: تجربة لمحاولة شرح النهايات بشكل حدسي؛ وتغيير المفاهيم الخاطئة حول التفاضل
---

  

> تحليل رياضي · فلسفة الدقة

  

## تعريف النهاية من الحدس إلى الصرامة

كيف حوّل فايرشتراس "الاقتراب" إلى اختبار منطقي محصّن — وما الثمن الذي دفعته الرياضيات

  

---

  

## التناقض المدفون في dt

نيوتن وليبنتز حسبا المشتقات وحصلا على نتائج صحيحة تجريبياً. لكنهما بنيا الأساس على جملة فيها تناقض منطقي صريح: "نقسم على التغيير في الزمن، ثم نجعل هذا التغيير يقترب من الصفر."

  

> **صيغة نيوتن — القول الأصلي**

> $$\dfrac{ds}{dt} = \lim_{dt \to 0} \dfrac{s(t + dt) - s(t)}{dt}$$

  

التناقض ظاهر في حالتين ولا مخرج منهما:

  

- **الحالة الأولى — dt يساوي صفر:**

  لو جعلنا dt مساوياً للصفر فعلاً، القسمة تنهار.

  `s(t+0) - s(t) / 0  →  undefined (0/0)`

  

- **الحالة الثانية — dt لا يساوي صفر:**

  لو أبقينا dt صغيراً لكن غير صفري، النتيجة تقريبية. الخطأ موجود مهما صغُر.

  `result = exact + error(dt)  →  not exact`

  

- **المخرج المستخدم — الكميات المتلاشية:**

  نيوتن سمّاها كميات في حالة وسيطة بين الصفر وغير الصفر. الرياضيون في القرن الثامن عشر هاجموا هذا المفهوم بشدة، وكان الهجوم مُحقاً.

  

> هل هذه الكميات المتلاشية شيء أم لا شيء؟ لو كانت شيئاً فكيف نجعلها صفراً؟ ولو كانت لا شيء فكيف نقسم عليها؟
> — بيركلي، ١٧٣٤

  

---

  

## استبدال الحركة بالاختبار

كوشي ثم فايرشتراس فعلا شيئاً بسيطاً في ظاهره وعميقاً في جوهره: **غيّرا السؤال.**

  

- **السؤال القديم:**

  "ما القيمة التي تقترب منها الدالة؟" يفترض حركة، اقتراب، تحوّل ديناميكي.

- **السؤال الجديد:**

  "هل يمكنني ضبط المدخل بدقة كافية لضمان أي دقة أريدها في المخرج؟" لا حركة — فقط ضمان.

  

الفرق ليس صياغياً. الفرق *فلسفي*: الأول يصف، والثاني يضمن. النهاية لم تعد "نتيجة رحلة" — صارت "اجتياز اختبار."

  

> **المنطق المعكوس**

> الاتجاه الطبيعي: أتحكم في المدخل وأرى ما يخرج.

> الاتجاه الجديد معكوس تماماً: تبدأ من المخرج — تحدد هامش خطأ حول النتيجة، ثم تُثبت أن هناك نطاقاً في المدخل يضمن أن كل نواتجه تقع داخل هامشك.

  

---

  

## ما معنى كل جزء في تعريف ε–δ؟

  

> **التعريف الكامل — فايرشتراس**

> $$\lim_{x \to c} f(x) = L \iff \forall\,\varepsilon > 0,\;\exists\,\delta > 0 \;\text{ s.t. }\; 0 < |x - c| < \delta \Rightarrow |f(x) - L| < \varepsilon$$

  

1. **∀ε > 0 — "لأي هامش خطأ تختاره"**

   الرمز ∀ يعني "لكل". $\varepsilon$ (إيبسيلون) عدد حقيقي موجب — هامش الخطأ المسموح به في المخرج. يجب أن يعمل التعريف مهما كان $\varepsilon$ صغيراً.

2. **∃δ > 0 — "يوجد نطاق يُثبَت وجوده"**

   الرمز ∃ يعني "يوجد". $\delta$ (دلتا) عدد حقيقي موجب — النطاق حول $c$ في المدخل. بعد أن يختار "الخصم" قيمة $\varepsilon$، يجب إثبات وجود $\delta$ مناسب. غالباً $\delta$ يعتمد على $\varepsilon$ المختارة.

3. **الجوار المفرغ — 0 < |x − c| < δ**

   الجزء $0 < |x-c|$ يمنع $x$ من مساواة $c$. يُقيَّم الاختبار فقط في النقاط المحيطة بـ $c$، لا في $c$ ذاتها. ما يحدث عند $c$ لا علاقة له بالنهاية.

4. **ضمان المخرج — |f(x) − L| < ε**

   إذا كانت $x$ داخل النطاق بـ $\delta$، فنتيجة الدالة يجب أن تقع داخل هامش $\varepsilon$ من $L$. ليست وصفاً للاقتراب — هي *مطالبة جبرية قابلة للتحقق*.

  

---

  

## لعبة الخصم — أسهل طريقة لفهم ∀∃

  

- **الخصم — يختار ε:**

  يختار هامش خطأ $\varepsilon$ موجباً مهما كان صغيراً. مهمته إثبات أن النهاية خاطئة. يمكنه اختيار 10⁻¹⁰⁰.

- **أنت — تجد δ:**

  بعد اختيار الخصم لـ $\varepsilon$، تجد $\delta$ يعتمد على $\varepsilon$ يجعل الشرط محققاً. إذا نجحت دائماً فالنهاية موجودة.

  

> **لماذا الترتيب $\forall\varepsilon$ ثم $\exists\delta$ مهم**

> لو كان الترتيب معكوساً $\exists\delta\;\forall\varepsilon$ لعنى: "يوجد $\delta$ واحد يعمل لكل $\varepsilon$" — شرط أقوى وخاطئ في الغالب.

> الترتيب الصحيح: لكل $\varepsilon$ تختاره يمكنني إيجاد $\delta$ يناسبه — وقد يتغير $\delta$ مع كل اختيار لـ $\varepsilon$.

  

---

  

## الجوار المفرغ — لماذا يُستبعد c من الاختبار؟

  

$$0 < |x - c| < \delta$$

  

> الجزء الذي يُستبعد فيه **x = c** هو الشرط الأول: **0 < |x − c|**

  

1. **النهاية تتعلق بالسلوك القريب لا بالقيمة في النقطة**

   النهاية $\lim_{x\to c}f(x)$ سؤال عن ما يحدث *قرب* $c$ — ليس *في* $c$. الدالة قد تكون غير معرّفة عند $c$ ومع ذلك تكون لها نهاية.

2. **المثال الكلاسيكي**

   الدالة $\frac{\sin x}{x}$ غير معرّفة عند $x = 0$ (قسمة على صفر). لكن نهايتها موجودة وتساوي $1$:

   $$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$$

   > الدالة غير معرّفة عند $x = 0$، والنهاية موجودة رغم ذلك

3. **الجوار المفرغ — Punctured Neighborhood**

   النطاق $(c-\delta,\,c+\delta)$ بعد استبعاد $c$ ذاتها يُسمى الجوار المفرغ. $c$ معلّقة في الهواء — لا تؤثر في النهاية ولا يؤثر فيها.

  

<div class="nlw">

  <div style="font-family:'Cairo',sans-serif;font-size:12px;color:var(--muted);margin-bottom:12px;">الجوار المفرغ حول c = 2 مع δ = 0.8</div>

  <canvas id="nlC" width="760" height="86" class="dc" style="cursor:default;"></canvas>

</div>

  

---

  

## أمثلة

  

### مثال ١ — دالة مستمرة تماماً

  

$$f(x) = x^2, \quad c = 2, \quad L = 4$$

إثبات: $\delta = \min\!\left(1,\,\tfrac{\varepsilon}{5}\right)$ تنجح لكل $\varepsilon$ صغير.

  

<div class="dw">

  <div class="dtit">الشريط الأصفر = هامش ε في المحور الصادي · الشريط الأخضر = نطاق δ في المحور السيني</div>

  <canvas id="ex1C" width="760" height="350" class="dc"></canvas>

  <div class="cr"><span class="cl">الهامش ε</span><input type="range" id="ex1S" min="0.05" max="4" step="0.05" value="2"><span class="cn" id="ex1V">2.00</span></div>

  <div class="ir">

    <div class="ic"><div class="icl">هامش الخطأ في المخرج ε</div><div class="icv" style="color:var(--amber)" id="ex1E">2.0000</div></div>

    <div class="ic"><div class="icl">النطاق المناسب في المدخل δ</div><div class="icv" style="color:var(--teal)" id="ex1D">0.7321</div></div>

  </div>

</div>

  

### مثال ٢ — ثقب في الدالة

  

$$f(x) = \dfrac{x^2 - 4}{x - 2},\quad c = 2,\quad L = 4$$

$$\dfrac{x^2-4}{x-2} = \dfrac{(x-2)(x+2)}{x-2} = x+2 \qquad (x \neq 2)$$

الدالة هي $x+2$ مع ثقب عند $x = 2$. النهاية = $4$ رغم عدم وجود قيمة للدالة هناك.

  

<div class="dw">

  <div class="dtit">الدائرة البيضاء عند c = 2 — الدالة غير معرّفة هناك، لكن النهاية موجودة</div>

  <canvas id="ex2C" width="760" height="310" class="dc"></canvas>

  <div class="cr"><span class="cl">الهامش ε</span><input type="range" id="ex2S" min="0.05" max="3" step="0.05" value="1.5"><span class="cn" id="ex2V">1.50</span></div>

  <div class="ir">

    <div class="ic"><div class="icl">هامش الخطأ في المخرج ε</div><div class="icv" style="color:var(--amber)" id="ex2E">1.5000</div></div>

    <div class="ic"><div class="icl">النطاق المناسب في المدخل δ</div><div class="icv" style="color:var(--teal)" id="ex2D">1.5000</div></div>

  </div>

</div>

  

### مثال ٣ — النهاية الكلاسيكية sin(x)/x

  

$$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$$

$$\cos x \leq \dfrac{\sin x}{x} \leq 1 \qquad \forall\, x \neq 0$$

وبما أن $\cos x \to 1$ فإن النهاية $1$ بالضرورة.

  

<div class="dw">

  <div class="dtit">الدائرة المفرغة عند الأصل — الدالة غير معرّفة عند 0 لكن النهاية = 1</div>

  <canvas id="ex3C" width="760" height="310" class="dc"></canvas>

  <div class="cr"><span class="cl">الهامش ε</span><input type="range" id="ex3S" min="0.02" max="0.9" step="0.02" value="0.4"><span class="cn" id="ex3V">0.40</span></div>

  <div class="ir">

    <div class="ic"><div class="icl">هامش الخطأ في المخرج ε</div><div class="icv" style="color:var(--amber)" id="ex3E">0.4000</div></div>

    <div class="ic"><div class="icl">النطاق المناسب في المدخل δ</div><div class="icv" style="color:var(--teal)" id="ex3D">—</div></div>

  </div>

</div>

  

### مثال ٤ — نهاية غير موجودة

  

$$\lim_{x \to 0} \dfrac{|x|}{x}$$

الدالة $\dfrac{|x|}{x}$ تساوي $+1$ عندما $x > 0$، وتساوي $-1$ عندما $x < 0$. ليس لها قيمة عند $x = 0$.

اختر $\varepsilon = \tfrac{1}{2}$. لأي $L$ مقترح ولأي $\delta > 0$ مهما صغُر، يوجد $x > 0$ داخل النطاق يعطي $f(x) = +1$، وآخر $x < 0$ يعطي $f(x) = -1$.

$$|L - 1| < \tfrac{1}{2} \quad \text{and} \quad |L - (-1)| < \tfrac{1}{2} \Rightarrow 2 = |1-(-1)| < 1$$

الشرطان معاً يستلزمان $2 < 1$ — تناقض، إذن النهاية غير موجودة.

  

<div class="dw">

  <div class="dtit">حرّك L — ستظل إحدى القيمتين (+1 أو −1) تخرج من الشريط الأصفر دائماً</div>

  <canvas id="ex4C" width="760" height="290" class="dc"></canvas>

  <div class="cr"><span class="cl">القيمة المقترحة L</span><input type="range" id="ex4S" min="-1.5" max="1.5" step="0.05" value="0"><span class="cn" id="ex4V">0.00</span></div>

  <div class="ir">

    <div class="ic"><div class="icl">الهامش الثابت ε = 0.5</div><div class="icv" style="color:var(--amber);">0.5000</div></div>

    <div class="ic"><div class="icl">حالة الاختبار</div><div class="icv" id="ex4St">فاشل ✗</div></div>

  </div>

</div>

  

---

  

## مقارنة

  

| الجانب | نيوتن / ليبنتز | فايرشتراس |

|--------|----------------|------------|

| الأساس | كميات متلاشية تقترب من الصفر | أعداد حقيقية ثابتة ومتباينات |

| الطبيعة | ديناميكية — حركة واقتراب | ثابتة — اختبار في لحظة واحدة |

| التناقض | dt = 0 أو dt ≠ 0؟ لا مخرج | لا وجود لـ dt في التعريف أصلاً |

| عدم التعريف عند النقطة | إشكالية مفاهيمية | طبيعية — الجوار المفرغ يحلّها |

| إثبات عدم وجود النهاية | لا إطار رسمي | إثبات بالتناقض عبر المتباينات |

| الحدس البصري | قوي ومباشر | أقل مباشرة — يحتاج تدريباً |

| الصرامة المنطقية | ضعيفة — قابلة للهجوم | محصّنة تماماً |

  

---

  

## الثمن المدفوع

  

هذا التصويب لم يكن مجانياً. الرياضيات ربحت الصرامة التامة، وفي المقابل:

  

> **الخسارة**

> **الصورة الذهنية الحركية اختفت من التعريف.**

> "السرعة اللحظية" لم تعد تعني حرفياً تقسيم مسافة على زمن.

> النتائج العددية لم تتغير — مشتقة $x^2$ لا تزال $2x$.

> لكن الطريق تغيّر: لم يعد رسم صورة وحساب ميل — صار إثبات وجود $\delta$ مناسب لكل $\varepsilon$ ممكن.

  

لهذا السبب يبدو التعريف معقداً في أول وهلة: هو مُصمَّم لمنع أي خداع ذهني ممكن، وليس لتسهيل الفهم. الدقة المطلقة والحدس المباشر نادراً ما يجتمعان.

  

> **الحل الحديث — التحليل غير القياسي**

> أبراهام روبنسون عام 1960 أعاد الأعداد المتناهية الصغر (Infinitesimals) إلى الرياضيات بصرامة تامة — داخل بنية تسمى حقل الأعداد الهايبررياضية.

> أثبت روبنسون أن حدس نيوتن كان صحيحاً في جوهره، لكنه كان يحتاج إطاراً رياضياً أكثر ثراءً مما كان موجوداً في القرن السابع عشر.

  

> الرياضيات الحديثة فنٌّ من فنون الاشتقاق الصارم — تعريف دقيق يليه دقيق يليه دقيق، حتى لا يتسرب وهمٌ واحد.

>

> — بول هالموس

  

---

  

كوشي 1821 · فايرشتراس 1861 · روبنسون 1960

  

تعريف ε–δ — التحليل الرياضي الحديث

  

<!-- INTERACTIVE SCRIPTS AND STYLES -->

<style>

/* Scoped vars for the diagrams to ensure they look good on any theme */

#epsilon-diagrams {

  --bg:#f5f2ec;--bg2:#edeae2;--bg3:#e3dfd5;--bg4:#d4cfc3;

  --text:#1c1a16;--muted:#857f72;--soft:#4a4640;

  --amber:#8a6818;--amberd:#6a5010;--amberbg:rgba(138,104,24,.09);--amberb:rgba(138,104,24,.22);

  --teal:#1a6e5c;--tealbg:rgba(26,110,92,.09);--tealb:rgba(26,110,92,.22);

  --red:#8a2e20;--redbg:rgba(138,46,32,.09);--redb:rgba(138,46,32,.22);

  --blue:#2a5a9a;--bluebg:rgba(42,90,154,.09);--blueb:rgba(42,90,154,.22);

  --border:rgba(0,0,0,.08);--border2:rgba(0,0,0,.14);

  --shadow:0 1px 3px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.04);

}

.dw{background:var(--bg);border:1px solid var(--border2);border-radius:10px;padding:22px;margin:26px 0;box-shadow:var(--shadow);}

.dtit{font-family:'Cairo',sans-serif;font-size:12px;color:var(--muted);margin-bottom:14px;text-align:center;direction:rtl;}

.dc{display:block;width:100%;border-radius:5px;}

.cr{display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap;direction:rtl;}

.cl{font-size:12px;color:var(--muted);font-family:'Cairo',sans-serif;min-width:80px;}

.dw input[type=range]{flex:1;min-width:100px;-webkit-appearance:none;height:3px;background:var(--bg3);border-radius:2px;outline:none;border:none;}

.dw input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--amber);cursor:pointer;border:2px solid var(--bg3);box-shadow:0 1px 3px rgba(0,0,0,.2);}

.cn{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--amberd);min-width:48px;text-align:left;direction:ltr;font-weight:500;}

.ir{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;direction:rtl;}

@media(max-width:480px){.ir{grid-template-columns:1fr;}}

.ic{background:var(--bg2);border-radius:7px;padding:11px 14px;border:1px solid var(--border2);}

.icl{font-size:11px;color:var(--muted);font-family:'Cairo',sans-serif;margin-bottom:3px;}

.icv{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;}

.nlw{margin:22px 0;padding:18px 20px;background:var(--bg);border-radius:8px;border:1px solid var(--border2);box-shadow:var(--shadow);}

</style>

<div id="epsilon-diagrams"></div>

<script>

setTimeout(() => {

  const P = {

    bg:'#f5f2ec', white:'#ffffff', text:'#1c1a16', muted:'#857f72',

    amber:'#8a6818', amberF:'rgba(138,104,24,.11)', amberS:'rgba(138,104,24,.6)',

    teal:'#1a6e5c',  tealF:'rgba(26,110,92,.11)',   tealS:'rgba(26,110,92,.6)',

    red:'#8a2e20',   redF:'rgba(138,46,32,.1)',      redS:'rgba(138,46,32,.55)',

    grid:'rgba(0,0,0,.055)', axis:'rgba(28,26,22,.45)', curve:'#1c1a16'

  };

  function tp(M, xMin, xMax, yMin, yMax, W, H) {

    return (x, y) => ({

      x: M.l + (x - xMin) / (xMax - xMin) * (W - M.l - M.r),

      y: M.t + (H - M.t - M.b) * (1 - (y - yMin) / (yMax - yMin))

    });

  }

  function axes(ctx, T, M, W, H, xMn, xMx, yMn, yMx, xs, ys) {

    ctx.strokeStyle = P.grid; ctx.lineWidth = .5;

    for (let x = Math.ceil(xMn); x <= xMx; x += xs) {

      const p = T(x, yMn);

      ctx.beginPath(); ctx.moveTo(p.x, M.t); ctx.lineTo(p.x, H - M.b); ctx.stroke();

    }

    for (let y = Math.ceil(yMn / ys) * ys; y <= yMx; y += ys) {

      const p = T(xMn, y);

      ctx.beginPath(); ctx.moveTo(M.l, p.y); ctx.lineTo(W - M.r, p.y); ctx.stroke();

    }

    ctx.strokeStyle = P.axis; ctx.lineWidth = 1;

    const axY = Math.max(M.t, Math.min(H - M.b, T(0, 0).y));

    const axX = Math.max(M.l, Math.min(W - M.r, T(0, 0).x));

    ctx.beginPath(); ctx.moveTo(M.l, axY); ctx.lineTo(W - M.r + 8, axY); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(axX, M.t - 8); ctx.lineTo(axX, H - M.b); ctx.stroke();

    ctx.fillStyle = P.muted; ctx.font = '11px monospace';

    ctx.textAlign = 'center';

    for (let x = Math.ceil(xMn); x <= xMx; x += xs) {

      if (Math.abs(x) < 1e-9) continue;

      const p = T(x, 0);

      if (p.y + 14 < H) ctx.fillText(x, p.x, Math.min(axY + 14, H - M.b + 14));

    }

    ctx.textAlign = 'right';

    for (let y = Math.ceil(yMn / ys) * ys; y <= yMx; y += ys) {

      if (Math.abs(y) < 1e-9) continue;

      const p = T(xMn, y);

      ctx.fillText(y % 1 === 0 ? y : y.toFixed(1), M.l - 4, p.y + 4);

    }

  }

  function bands(ctx, T, M, W, H, c, L, eps, delta, yMn, yMx, xMn, xMx) {

    const yT = T(0, Math.min(L + eps, yMx + 2)).y;

    const yB = T(0, Math.max(L - eps, yMn - 2)).y;

    const xL = T(Math.max(c - delta, xMn - 0.5), 0).x;

    const xR2 = T(Math.min(c + delta, xMx + 0.5), 0).x;

    ctx.fillStyle = P.amberF; ctx.fillRect(M.l, yT, W - M.r - M.l, yB - yT);

    ctx.strokeStyle = P.amberS; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);

    ctx.beginPath(); ctx.moveTo(M.l, yT); ctx.lineTo(W - M.r, yT); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(M.l, yB); ctx.lineTo(W - M.r, yB); ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = P.tealF; ctx.fillRect(xL, M.t, xR2 - xL, H - M.t - M.b);

    ctx.strokeStyle = P.tealS; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);

    ctx.beginPath(); ctx.moveTo(xL, M.t); ctx.lineTo(xL, H - M.b); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(xR2, M.t); ctx.lineTo(xR2, H - M.b); ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = P.amber; ctx.font = 'italic 11px serif'; ctx.textAlign = 'left';

    ctx.fillText('L+ε', M.l + 3, yT - 3); ctx.fillText('L−ε', M.l + 3, yB + 11);

    ctx.fillStyle = P.teal; ctx.textAlign = 'center';

    ctx.fillText('c−δ', xL, H - M.b + 13); ctx.fillText('c+δ', xR2, H - M.b + 13);

  }

  function curve(ctx, T, fn, x0, x1, step, skipNear) {

    ctx.lineWidth = 2; ctx.strokeStyle = P.curve; ctx.beginPath();

    let go = false;

    for (let x = x0; x <= x1 + step * .5; x += step) {

      const xc = Math.min(x, x1);

      if (skipNear !== undefined && Math.abs(xc - skipNear) < step * 1.5) { go = false; continue; }

      const y = fn(xc);

      if (!isFinite(y)) { go = false; continue; }

      const p = T(xc, y);

      go ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); go = true;

    }

    ctx.stroke();

  }

  function dot(ctx, T, x, y, fill, r, col) {

    const p = T(x, y);

    ctx.beginPath(); ctx.arc(p.x, p.y, r || 5, 0, Math.PI * 2);

    if (fill) { ctx.fillStyle = col || P.amber; ctx.fill(); }

    else { ctx.strokeStyle = col || P.amber; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.white; ctx.fill(); }

  }

  function guide(ctx, T, x, y, M, H) {

    ctx.setLineDash([4, 3]); ctx.strokeStyle = 'rgba(138,104,24,.3)'; ctx.lineWidth = 1;

    const p = T(x, y);

    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(M.l, p.y); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, H - M.b); ctx.stroke();

    ctx.setLineDash([]);

  }

  

  if(document.getElementById('nlC')) {

    const cv = document.getElementById('nlC');

    const ctx = cv.getContext('2d');

    const W = cv.width, H = cv.height;

    const c = 2, d = 0.8, xMn = 0, xMx = 4;

    const M = {l:70, r:70, t:28, b:18};

    function lp(x) { return M.l + (x - xMn) / (xMx - xMn) * (W - M.l - M.r); }

    const y = H / 2 + 6;

    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);

    const lx = lp(c - d), rx = lp(c + d);

    ctx.fillStyle = P.tealF; ctx.fillRect(lx, y - 13, rx - lx, 26);

    ctx.strokeStyle = P.tealS; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);

    ctx.beginPath(); ctx.moveTo(lx, y - 17); ctx.lineTo(lx, y + 17); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(rx, y - 17); ctx.lineTo(rx, y + 17); ctx.stroke();

    ctx.setLineDash([]);

    ctx.strokeStyle = P.axis; ctx.lineWidth = 1.5;

    ctx.beginPath(); ctx.moveTo(M.l - 12, y); ctx.lineTo(W - M.r + 12, y); ctx.stroke();

    for (let x = 0; x <= 4; x += .5) {

      const px = lp(x), ii = Number.isInteger(x);

      ctx.strokeStyle = ii ? P.axis : 'rgba(28,26,22,.25)'; ctx.lineWidth = ii ? 1 : .5;

      ctx.beginPath(); ctx.moveTo(px, y - (ii ? 7 : 4)); ctx.lineTo(px, y + (ii ? 7 : 4)); ctx.stroke();

      if (ii) { ctx.fillStyle = P.muted; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(x, px, y + 17); }

    }

    ctx.fillStyle = P.teal; ctx.font = 'italic 12px serif'; ctx.textAlign = 'center';

    ctx.fillText('c−δ = 1.2', lx, y - 21); ctx.fillText('c+δ = 2.8', rx, y - 21);

    const cx_ = lp(c);

    ctx.beginPath(); ctx.arc(cx_, y, 7, 0, Math.PI * 2);

    ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.white; ctx.fill();

    ctx.fillStyle = P.amber; ctx.font = 'italic 13px serif'; ctx.textAlign = 'center';

    ctx.fillText('c = 2', cx_, y - 21);

    ctx.fillStyle = 'rgba(138,104,24,.55)'; ctx.font = '10px sans-serif';

    ctx.fillText('(مستبعدة)', cx_, y - 11);

  }

  

  if(document.getElementById('ex1C')) {

    const cv = document.getElementById('ex1C');

    const ctx = cv.getContext('2d');

    const sl = document.getElementById('ex1S');

    const C = 2, L = 4, xMn = 0, xMx = 4.4, yMn = 0, yMx = 20;

    const M = {l: 50, r: 16, t: 16, b: 40};

    function dlt(e) { const dr = Math.sqrt(4+e)-2, dl = e<4?2-Math.sqrt(4-e):2; return Math.min(dl,dr); }

    function draw(eps) {

      const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);

      ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);

      bands(ctx,T,M,W,H,C,L,eps,dlt(eps),yMn,yMx,xMn,xMx);

      axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,5);

      curve(ctx,T,x=>x*x,xMn,xMx,.015);

      guide(ctx,T,C,L,M,H);

      dot(ctx,T,C,L,true);

      const pCL=T(C,L);

      ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=4',M.l-3,pCL.y+4);

      ctx.textAlign='center';ctx.fillText('c=2',pCL.x,H-M.b+13);

      ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = x²',W-M.r-4,M.t+13);

    }

    function upd() {

      const e=+sl.value, d=dlt(e);

      document.getElementById('ex1V').textContent=e.toFixed(2);

      document.getElementById('ex1E').textContent=e.toFixed(4);

      document.getElementById('ex1D').textContent=d.toFixed(4);

      draw(e);

    }

    sl.addEventListener('input',upd); upd();

  }

  

  if(document.getElementById('ex2C')) {

    const cv=document.getElementById('ex2C');

    const ctx=cv.getContext('2d');

    const sl=document.getElementById('ex2S');

    const C=2,L=4,xMn=-0.5,xMx=4.5,yMn=-1,yMx=8;

    const M={l:44,r:16,t:16,b:38};

    function draw(eps) {

      const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);

      ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);

      bands(ctx,T,M,W,H,C,L,eps,eps,yMn,yMx,xMn,xMx);

      axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,2);

      curve(ctx,T,x=>x+2,xMn,xMx,.015,C);

      dot(ctx,T,C,L,false);

      guide(ctx,T,C,L,M,H);

      const pCL=T(C,L);

      ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=4',M.l-3,pCL.y+4);

      ctx.textAlign='center';ctx.fillText('c=2',pCL.x,H-M.b+13);

      ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.fillText('ثقب — غير معرّف',pCL.x,pCL.y-15);

      ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = (x²−4)/(x−2)',W-M.r-2,M.t+13);

    }

    function upd() {

      const e=+sl.value;

      document.getElementById('ex2V').textContent=e.toFixed(2);

      document.getElementById('ex2E').textContent=e.toFixed(4);

      document.getElementById('ex2D').textContent=e.toFixed(4);

      draw(e);

    }

    sl.addEventListener('input',upd); upd();

  }

  

  if(document.getElementById('ex3C')) {

    const cv=document.getElementById('ex3C');

    const ctx=cv.getContext('2d');

    const sl=document.getElementById('ex3S');

    const C=0,L=1,xMn=-4,xMx=4,yMn=-.3,yMx=1.4;

    const M={l:44,r:16,t:16,b:38};

    function cmpDelta(eps) {

      let lo=.001,hi=3;

      for(let i=0;i<50;i++){const m=(lo+hi)/2; Math.abs(Math.sin(m)/m-1)<eps?lo=m:hi=m;}

      return (lo+hi)/2;

    }

    function draw(eps) {

      const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);

      const d=cmpDelta(eps);

      ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);

      bands(ctx,T,M,W,H,C,L,eps,d,yMn,yMx,xMn,xMx);

      axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,.5);

      curve(ctx,T,x=>Math.sin(x)/x,xMn,xMx,.015,C);

      dot(ctx,T,C,L,false);

      const pCL=T(C,L);

      ctx.setLineDash([4,3]);ctx.strokeStyle='rgba(138,104,24,.3)';ctx.lineWidth=1;

      ctx.beginPath();ctx.moveTo(pCL.x,pCL.y);ctx.lineTo(M.l,pCL.y);ctx.stroke();ctx.setLineDash([]);

      ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=1',M.l-3,pCL.y+4);

      ctx.textAlign='center';ctx.fillText('c=0',pCL.x,H-M.b+13);

      ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = sin(x)/x',W-M.r-2,M.t+13);

      document.getElementById('ex3D').textContent=d.toFixed(4);

    }

    function upd() {

      const e=+sl.value;

      document.getElementById('ex3V').textContent=e.toFixed(2);

      document.getElementById('ex3E').textContent=e.toFixed(4);

      draw(e);

    }

    sl.addEventListener('input',upd); upd();

  }

  

  if(document.getElementById('ex4C')) {

    const cv=document.getElementById('ex4C');

    const ctx=cv.getContext('2d');

    const sl=document.getElementById('ex4S');

    const C=0,EPS=.5,xMn=-2,xMx=2,yMn=-1.8,yMx=1.8;

    const M={l:44,r:16,t:16,b:36};

    function draw(L) {

      const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);

      ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);

      const yT=T(0,Math.min(L+EPS,yMx)).y, yB=T(0,Math.max(L-EPS,yMn)).y;

      ctx.fillStyle=P.amberF; ctx.fillRect(M.l,yT,W-M.r-M.l,yB-yT);

      ctx.strokeStyle=P.amberS;ctx.lineWidth=1.2;ctx.setLineDash([5,3]);

      ctx.beginPath();ctx.moveTo(M.l,yT);ctx.lineTo(W-M.r,yT);ctx.stroke();

      ctx.beginPath();ctx.moveTo(M.l,yB);ctx.lineTo(W-M.r,yB);ctx.stroke();

      ctx.setLineDash([]);

      axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,.5,.5);

      ctx.strokeStyle=P.curve;ctx.lineWidth=2.5;

      const pa=T(.01,1),pb=T(xMx,1);

      ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();

      const pc=T(xMn,-1),pd=T(-.01,-1);

      ctx.beginPath();ctx.moveTo(pc.x,pc.y);ctx.lineTo(pd.x,pd.y);ctx.stroke();

      dot(ctx,T,0,1,false,5,P.curve); dot(ctx,T,0,-1,false,5,P.curve);

      ctx.fillStyle=P.soft;ctx.font='italic 12px serif';ctx.textAlign='right';

      ctx.fillText('+1',T(xMx,1).x-4,T(xMx,1).y-7);

      ctx.fillText('−1',T(xMx,-1).x-4,T(xMx,-1).y+14);

      const pL=T(0,L);

      ctx.beginPath();ctx.arc(pL.x,pL.y,6,0,Math.PI*2);ctx.fillStyle=P.amber;ctx.fill();

      ctx.fillStyle=P.amber;ctx.font='italic 13px serif';ctx.textAlign='left';

      ctx.fillText('L = '+L.toFixed(2),pL.x+10,pL.y+4);

      const plusIn=Math.abs(1-L)<EPS, minusIn=Math.abs(-1-L)<EPS;

      if(!plusIn) {

        ctx.strokeStyle=P.red;ctx.lineWidth=2;

        const pp=T(.8,1);ctx.beginPath();ctx.arc(pp.x,pp.y,11,0,Math.PI*2);ctx.stroke();

        ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('خارج',pp.x,pp.y-15);

      }

      if(!minusIn) {

        ctx.strokeStyle=P.red;ctx.lineWidth=2;

        const pm=T(-.8,-1);ctx.beginPath();ctx.arc(pm.x,pm.y,11,0,Math.PI*2);ctx.stroke();

        ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('خارج',pm.x,pm.y+18);

      }

      const ok=plusIn&&minusIn;

      const st=document.getElementById('ex4St');

      st.textContent=ok?'ناجح ✓':'فاشل ✗';

      st.style.color=ok?'var(--teal)':'var(--red)';

      ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';

      ctx.fillText('f(x) = |x|/x',W-M.r-2,M.t+13);

    }

    function upd() {

      const L=+sl.value;

      document.getElementById('ex4V').textContent=L.toFixed(2);

      draw(L);

    }

    sl.addEventListener('input',upd); upd();

  }

}, 500);

</script>