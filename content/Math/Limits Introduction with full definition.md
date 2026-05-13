---
title: تعريف النهاية — ε-δ الحدس الكامل
title_en: Limit Definition — The ε-δ Intuition
tags:
  - رياضيات
  - تحليل_رياضي
  - فلسفة
  - نهايات
  - ε-δ
author: حامد الخطيب
description: تجربة لمحاولة شرح النهايات بشكل حدسي؛ وتغيير المفاهيم الخاطئة حول التفاضل
image: /static/thumbnails/a635e4c0-562c-4115-8202-adc420dbc695.png
---

<div lang="ar" dir="rtl">




## تعريف النهاية من الحدس إلى الصرامة

كيف حوّل فايرشتراس "الاقتراب" إلى اختبار منطقي محصّن — وما الثمن الذي دفعته الرياضيات

  

---

  

## التناقض المدفون في dt

نيوتن وليبنتز حسبا المشتقات وحصلا على نتائج صحيحة تجريبياً. لكنهما بنيا الأساس على جملة فيها تناقض منطقي صريح: "نقسم على التغيير في الزمن، ثم نجعل هذا التغيير يقترب من الصفر."

  

> [!example] صيغة نيوتن — القول الأصلي
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

  

<div class="epq">
  <p>هل هذه الكميات المتلاشية شيء أم لا شيء؟ لو كانت شيئاً فكيف نجعلها صفراً؟ ولو كانت لا شيء فكيف نقسم عليها؟</p>
  <div class="att">— بيركلي، ١٧٣٤</div>
</div>

  

---

  

## استبدال الحركة بالاختبار

كوشي ثم فايرشتراس فعلا شيئاً بسيطاً في ظاهره وعميقاً في جوهره: **غيّرا السؤال.**

  

- **السؤال القديم:**

  "ما القيمة التي تقترب منها الدالة؟" يفترض حركة، اقتراب، تحوّل ديناميكي.

- **السؤال الجديد:**

  "هل يمكنني ضبط المدخل بدقة كافية لضمان أي دقة أريدها في المخرج؟" لا حركة — فقط ضمان.

  

الفرق ليس صياغياً. الفرق *فلسفي*: الأول يصف، والثاني يضمن. النهاية لم تعد "نتيجة رحلة" — صارت "اجتياز اختبار."

  

> [!info] المنطق المعكوس
> الاتجاه الطبيعي: أتحكم في المدخل وأرى ما يخرج.
> الاتجاه الجديد معكوس تماماً: تبدأ من المخرج — تحدد هامش خطأ حول النتيجة، ثم تُثبت أن هناك نطاقاً في المدخل يضمن أن كل نواتجه تقع داخل هامشك.

  

---

  

## ما معنى كل جزء في تعريف ε–δ؟

  

> [!example] التعريف الكامل — فايرشتراس
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

  

> [!warning] لماذا الترتيب $\forall\varepsilon$ ثم $\exists\delta$ مهم
> لو كان الترتيب معكوساً $\exists\delta\;\forall\varepsilon$ لعنى: "يوجد $\delta$ واحد يعمل لكل $\varepsilon$" — شرط أقوى وخاطئ في الغالب.
> الترتيب الصحيح: لكل $\varepsilon$ تختاره يمكنني إيجاد $\delta$ يناسبه — وقد يتغير $\delta$ مع كل اختيار لـ $\varepsilon$.

  

---

  

## الجوار المفرغ — لماذا يُستبعد c من الاختبار؟

  

$$0 < |x - c| < \delta$$

  

> [!note]
> الجزء الذي يُستبعد فيه **x = c** هو الشرط الأول: **0 < |x − c|**

  

1. **النهاية تتعلق بالسلوك القريب لا بالقيمة في النقطة**

   النهاية $\lim_{x\to c}f(x)$ سؤال عن ما يحدث *قرب* $c$ — ليس *في* $c$. الدالة قد تكون غير معرّفة عند $c$ ومع ذلك تكون لها نهاية.

2. **المثال الكلاسيكي**

   الدالة $\frac{\sin x}{x}$ غير معرّفة عند $x = 0$ (قسمة على صفر). لكن نهايتها موجودة وتساوي $1$:

   $$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$$

> [!note]
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

  

<table class="ctbl">
  <tr><th>الجانب</th><th>نيوتن / ليبنتز</th><th>فايرشتراس</th></tr>
  <tr><td>الأساس</td><td>كميات متلاشية تقترب من الصفر</td><td>أعداد حقيقية ثابتة ومتباينات</td></tr>
  <tr><td>الطبيعة</td><td>ديناميكية — حركة واقتراب</td><td>ثابتة — اختبار في لحظة واحدة</td></tr>
  <tr><td>التناقض</td><td>dt = 0 أو dt ≠ 0؟ لا مخرج</td><td>لا وجود لـ dt في التعريف أصلاً</td></tr>
  <tr><td>عدم التعريف عند النقطة</td><td>إشكالية مفاهيمية</td><td>طبيعية — الجوار المفرغ يحلّها</td></tr>
  <tr><td>إثبات عدم وجود النهاية</td><td>لا إطار رسمي</td><td>إثبات بالتناقض عبر المتباينات</td></tr>
  <tr><td>الحدس البصري</td><td>قوي ومباشر</td><td>أقل مباشرة — يحتاج تدريباً</td></tr>
  <tr><td>الصرامة المنطقية</td><td>ضعيفة — قابلة للهجوم</td><td>محصّنة تماماً</td></tr>
</table>

  

---

  

## الثمن المدفوع

  

هذا التصويب لم يكن مجانياً. الرياضيات ربحت الصرامة التامة، وفي المقابل:

  

> [!danger] الخسارة
> **الصورة الذهنية الحركية اختفت من التعريف.**
> "السرعة اللحظية" لم تعد تعني حرفياً تقسيم مسافة على زمن.
> النتائج العددية لم تتغير — مشتقة $x^2$ لا تزال $2x$.
> لكن الطريق تغيّر: لم يعد رسم صورة وحساب ميل — صار إثبات وجود $\delta$ مناسب لكل $\varepsilon$ ممكن.

  

لهذا السبب يبدو التعريف معقداً في أول وهلة: هو مُصمَّم لمنع أي خداع ذهني ممكن، وليس لتسهيل الفهم. الدقة المطلقة والحدس المباشر نادراً ما يجتمعان.

  

> [!success] الحل الحديث — التحليل غير القياسي
> أبراهام روبنسون عام 1960 أعاد الأعداد المتناهية الصغر (Infinitesimals) إلى الرياضيات بصرامة تامة — داخل بنية تسمى حقل الأعداد الهايبررياضية.
> أثبت روبنسون أن حدس نيوتن كان صحيحاً في جوهره، لكنه كان يحتاج إطاراً رياضياً أكثر ثراءً مما كان موجوداً في القرن السابع عشر.

  

<div class="epq">
  <p>الرياضيات الحديثة فنٌّ من فنون الاشتقاق الصارم — تعريف دقيق يليه دقيق يليه دقيق، حتى لا يتسرب وهمٌ واحد.</p>
  <div class="att">— بول هالموس</div>
</div>

  

---

  

كوشي 1821 · فايرشتراس 1861 · روبنسون 1960

  

تعريف ε–δ — التحليل الرياضي الحديث

</div>

<div lang="en" dir="ltr">

## Limit Definition: From Intuition to Rigor

How Weierstrass transformed "approaching" into an impenetrable logical test — and the price mathematics had to pay.

---

## The Contradiction Buried in dt

Newton and Leibniz calculated derivatives and obtained empirically correct results. But they built the foundation on a statement that contains a clear logical contradiction: "We divide by the change in time, then let this change approach zero."

> [!example] Newton's Formula — The Original Statement
> $$\dfrac{ds}{dt} = \lim_{dt \to 0} \dfrac{s(t + dt) - s(t)}{dt}$$

The contradiction is evident in two cases, and there is no escape from them:

- **Case 1 — dt is exactly zero:**
  If we actually set dt to zero, the division collapses.
  `s(t+0) - s(t) / 0  →  undefined (0/0)`

- **Case 2 — dt is not zero:**
  If we keep dt small but non-zero, the result is approximate. An error exists no matter how small dt is.
  `result = exact + error(dt)  →  not exact`

- **The Used Loophole — Evanescent Quantities:**
  Newton called them quantities in an intermediate state between zero and non-zero. Mathematicians in the 18th century fiercely attacked this concept, and the attack was justified.

<div class="epq">
  <p>Are these evanescent quantities something or nothing? If they are something, how can we make them zero? And if they are nothing, how can we divide by them?</p>
  <div class="att">— George Berkeley, 1734</div>
</div>

---

## Replacing Movement with a Test

Cauchy and then Weierstrass did something seemingly simple but fundamentally profound: **They changed the question.**

- **The Old Question:**
  "What value is the function approaching?" assumes movement, approaching, a dynamic transformation.

- **The New Question:**
  "Can I control the input with enough precision to guarantee any desired precision in the output?" No movement — just a guarantee.

The difference is not merely syntactic. The difference is *philosophical*: the former describes, the latter guarantees. The limit is no longer "the result of a journey" — it has become "passing a test."

> [!info] Reversed Logic
> Natural direction: I control the input and see what comes out.
> The new direction is completely reversed: You start from the output — you specify an error margin around the result, then you prove that there is a range in the input guaranteeing all its outputs fall within your margin.

---

## What Does Every Part of the ε–δ Definition Mean?

> [!example] The Full Definition — Weierstrass
> $$\lim_{x \to c} f(x) = L \iff \forall\,\varepsilon > 0,\;\exists\,\delta > 0 \;\text{ s.t. }\; 0 < |x - c| < \delta \Rightarrow |f(x) - L| < \varepsilon$$

1. **∀ε > 0 — "For any error margin you choose"**
   The symbol ∀ means "for all". $\varepsilon$ (epsilon) is a positive real number — the allowed error margin in the output. The definition must work no matter how small $\varepsilon$ is.

2. **∃δ > 0 — "There exists a range to be proven"**
   The symbol ∃ means "there exists". $\delta$ (delta) is a positive real number — the range around $c$ in the input. After the "adversary" chooses an $\varepsilon$, one must prove the existence of a suitable $\delta$. Usually, $\delta$ depends on the chosen $\varepsilon$.

3. **Punctured Neighborhood — 0 < |x − c| < δ**
   The part $0 < |x-c|$ prevents $x$ from equaling $c$. The test is only evaluated at points surrounding $c$, not at $c$ itself. What happens at $c$ is irrelevant to the limit.

4. **Output Guarantee — |f(x) − L| < ε**
   If $x$ is within the $\delta$ range, then the function's result must fall within the $\varepsilon$ margin of $L$. This isn't a description of approaching — it's an *algebraic demand that can be verified*.

---

## The Adversary Game — The Easiest Way to Understand ∀∃

- **The Adversary — Chooses ε:**
  Chooses a positive error margin $\varepsilon$ no matter how small. His task is to prove the limit is false. He can choose 10⁻¹⁰⁰.

- **You — Find δ:**
  After the adversary chooses $\varepsilon$, you find a $\delta$ dependent on $\varepsilon$ that makes the condition hold. If you always succeed, the limit exists.

> [!warning] Why the order $\forall\varepsilon$ then $\exists\delta$ is critical
> If the order were reversed $\exists\delta\;\forall\varepsilon$, it would mean: "There is one single $\delta$ that works for every $\varepsilon$" — a much stronger condition that is mostly false.
> The correct order: For every $\varepsilon$ you choose, I can find a $\delta$ that suits it — and $\delta$ may change with every choice of $\varepsilon$.

---

## Punctured Neighborhood — Why is c excluded from the test?

$$0 < |x - c| < \delta$$

> [!note]
> The part where **x = c** is excluded is the first condition: **0 < |x − c|**

1. **The limit relates to the nearby behavior, not the value at the point**
   The limit $\lim_{x\to c}f(x)$ is a question about what happens *near* $c$ — not *at* $c$. The function might be undefined at $c$ and yet still have a limit.

2. **The Classic Example**
   The function $\frac{\sin x}{x}$ is undefined at $x = 0$ (division by zero). But its limit exists and equals $1$:
   $$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$$

> [!note]
> The function is undefined at $x = 0$, yet the limit exists

3. **Punctured Neighborhood**
   The range $(c-\delta,\,c+\delta)$ after excluding $c$ itself is called the punctured neighborhood. $c$ is suspended in the air — it doesn't affect the limit and isn't affected by it.

<div class="nlw">
  <div style="font-family:'Inter',sans-serif;font-size:12px;color:var(--muted);margin-bottom:12px;">Punctured neighborhood around c = 2 with δ = 0.8</div>
  <canvas id="nlC" width="760" height="86" class="dc" style="cursor:default;"></canvas>
</div>

---

## Examples

### Example 1 — A Perfectly Continuous Function

$$f(x) = x^2, \quad c = 2, \quad L = 4$$

Proof: $\delta = \min\!\left(1,\,\tfrac{\varepsilon}{5}\right)$ works for any small $\varepsilon$.

<div class="dw">
  <div class="dtit">Yellow bar = Margin ε on Y-axis · Green bar = Range δ on X-axis</div>
  <canvas id="ex1C" width="760" height="350" class="dc"></canvas>
  <div class="cr"><span class="cl">Margin ε</span><input type="range" id="ex1S" min="0.05" max="4" step="0.05" value="2"><span class="cn" id="ex1V">2.00</span></div>
  <div class="ir">
    <div class="ic"><div class="icl">Output error margin ε</div><div class="icv" style="color:var(--amber)" id="ex1E">2.0000</div></div>
    <div class="ic"><div class="icl">Suitable input range δ</div><div class="icv" style="color:var(--teal)" id="ex1D">0.7321</div></div>
  </div>
</div>

### Example 2 — A Hole in the Function

$$f(x) = \dfrac{x^2 - 4}{x - 2},\quad c = 2,\quad L = 4$$

$$\dfrac{x^2-4}{x-2} = \dfrac{(x-2)(x+2)}{x-2} = x+2 \qquad (x \neq 2)$$

The function is $x+2$ with a hole at $x = 2$. The limit = $4$ despite the absence of a function value there.

<div class="dw">
  <div class="dtit">White circle at c = 2 — The function is undefined there, but the limit exists</div>
  <canvas id="ex2C" width="760" height="310" class="dc"></canvas>
  <div class="cr"><span class="cl">Margin ε</span><input type="range" id="ex2S" min="0.05" max="3" step="0.05" value="1.5"><span class="cn" id="ex2V">1.50</span></div>
  <div class="ir">
    <div class="ic"><div class="icl">Output error margin ε</div><div class="icv" style="color:var(--amber)" id="ex2E">1.5000</div></div>
    <div class="ic"><div class="icl">Suitable input range δ</div><div class="icv" style="color:var(--teal)" id="ex2D">1.5000</div></div>
  </div>
</div>

### Example 3 — The Classic Limit sin(x)/x

$$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$$

$$\cos x \leq \dfrac{\sin x}{x} \leq 1 \qquad \forall\, x \neq 0$$

And since $\cos x \to 1$, the limit is necessarily $1$.

<div class="dw">
  <div class="dtit">Empty circle at the origin — The function is undefined at 0 but the limit = 1</div>
  <canvas id="ex3C" width="760" height="310" class="dc"></canvas>
  <div class="cr"><span class="cl">Margin ε</span><input type="range" id="ex3S" min="0.02" max="0.9" step="0.02" value="0.4"><span class="cn" id="ex3V">0.40</span></div>
  <div class="ir">
    <div class="ic"><div class="icl">Output error margin ε</div><div class="icv" style="color:var(--amber)" id="ex3E">0.4000</div></div>
    <div class="ic"><div class="icl">Suitable input range δ</div><div class="icv" style="color:var(--teal)" id="ex3D">—</div></div>
  </div>
</div>

### Example 4 — Limit Does Not Exist

$$\lim_{x \to 0} \dfrac{|x|}{x}$$

The function $\dfrac{|x|}{x}$ equals $+1$ when $x > 0$, and $-1$ when $x < 0$. It has no value at $x = 0$.

Choose $\varepsilon = \tfrac{1}{2}$. For any proposed $L$ and any $\delta > 0$ no matter how small, there is an $x > 0$ within the range that gives $f(x) = +1$, and another $x < 0$ that gives $f(x) = -1$.

$$|L - 1| < \tfrac{1}{2} \quad \text{and} \quad |L - (-1)| < \tfrac{1}{2} \Rightarrow 2 = |1-(-1)| < 1$$

Both conditions together imply $2 < 1$ — a contradiction, thus the limit does not exist.

<div class="dw">
  <div class="dtit">Move L — One of the two values (+1 or −1) will always fall outside the yellow bar</div>
  <canvas id="ex4C" width="760" height="290" class="dc"></canvas>
  <div class="cr"><span class="cl">Proposed Value L</span><input type="range" id="ex4S" min="-1.5" max="1.5" step="0.05" value="0"><span class="cn" id="ex4V">0.00</span></div>
  <div class="ir">
    <div class="ic"><div class="icl">Fixed Margin ε = 0.5</div><div class="icv" style="color:var(--amber);">0.5000</div></div>
    <div class="ic"><div class="icl">Test Status</div><div class="icv" id="ex4St">Failed ✗</div></div>
  </div>
</div>

---

## Comparison

<table class="ctbl">
  <tr><th>Aspect</th><th>Newton / Leibniz</th><th>Weierstrass</th></tr>
  <tr><td>Foundation</td><td>Evanescent quantities approaching zero</td><td>Fixed real numbers and inequalities</td></tr>
  <tr><td>Nature</td><td>Dynamic — movement and approach</td><td>Static — a test in a single moment</td></tr>
  <tr><td>Contradiction</td><td>dt = 0 or dt ≠ 0? No escape</td><td>No dt in the definition at all</td></tr>
  <tr><td>Undefined at point</td><td>Conceptual dilemma</td><td>Natural — Punctured neighborhood solves it</td></tr>
  <tr><td>Proving limit doesn't exist</td><td>No formal framework</td><td>Proof by contradiction via inequalities</td></tr>
  <tr><td>Visual intuition</td><td>Strong and direct</td><td>Less direct — requires training</td></tr>
  <tr><td>Logical rigor</td><td>Weak — vulnerable to attack</td><td>Completely impenetrable</td></tr>
</table>

---

## The Price Paid

This correction was not free. Mathematics gained absolute rigor, but in return:

> [!danger] The Loss
> **The dynamic mental image disappeared from the definition.**
> "Instantaneous velocity" no longer literally meant dividing distance by time.
> Numerical results didn't change — the derivative of $x^2$ is still $2x$.
> But the path changed: it's no longer drawing a picture and calculating a slope — it became proving the existence of a suitable $\delta$ for every possible $\varepsilon$.

For this reason, the definition seems complex at first glance: it is designed to prevent any possible mental deception, not to facilitate understanding. Absolute precision and direct intuition rarely meet.

> [!success] The Modern Solution — Non-standard Analysis
> Abraham Robinson in 1960 returned Infinitesimals to mathematics with complete rigor — within a structure called the field of hyperreal numbers.
> Robinson proved that Newton's intuition was fundamentally correct, but it needed a richer mathematical framework than existed in the 17th century.

<div class="epq">
  <p>Modern mathematics is the art of rigorous deduction — an exact definition followed by another exact definition followed by another, so that not a single illusion slips through.</p>
  <div class="att">— Paul Halmos</div>
</div>

---

Cauchy 1821 · Weierstrass 1861 · Robinson 1960

ε–δ Definition — Modern Real Analysis

</div>