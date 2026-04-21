```javascript
<%*
try {
    let title = await tp.system.prompt("عنوان القصيدة:");
    let author = await tp.system.prompt("اسم الشاعر (اتركه فارغاً وسيكتب اسمك تلقائياً):");
    let poemText = await tp.system.prompt("أدخل أبيات القصيدة (كل شطر في سطر مستقل):", "", true);

    if (title === null || poemText === null) {
        tR += "⚠️ تم إلغاء العملية ولم يتم توليد القصيدة.";
    } else {
        if (!author || author.trim() === "") author = "حامد";
        
        let rawPoem = poemText.trim().split('\n');
        let verses = '';
        for(let i = 0; i < rawPoem.length; i+=2) {
            let shatr1 = rawPoem[i] ? rawPoem[i].trim() : '';
            let shatr2 = rawPoem[i+1] ? rawPoem[i+1].trim() : '';
            if(shatr1 || shatr2) {
                verses += `\n    <div class="bayt">\n      <span class="shatr">${shatr1}</span>\n      <span class="shatr">${shatr2}</span>\n    </div>`;
            }
        }

        let folder = tp.file.folder(true);
        let files = app.vault.getMarkdownFiles()
            .filter(f => f.parent.path === folder)
            .sort((a, b) => a.basename.localeCompare(b.basename));

        let currentIndex = files.findIndex(f => f.basename === tp.file.title);

        let prevLink = currentIndex > 0 ? encodeURI(files[currentIndex - 1].basename) : "#";
        let nextLink = currentIndex < files.length - 1 ? encodeURI(files[currentIndex + 1].basename) : "#";
        let total = files.length > 0 ? files.length : 1;
        let currentNum = currentIndex !== -1 ? currentIndex + 1 : 1;
        let indexLink = encodeURI("فهرس القصائد");

        let finalHTML = `
<style>
  .wrapper { width: 100%; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 0; margin: 0 auto; }
  .ornament { font-size: 22px; color: var(--gold-dim, #7a6340); letter-spacing: 0.3em; margin-bottom: 2rem; opacity: 0.7; }
  .poem-title { font-family: 'Aref Ruqaa', serif; font-size: 18px; letter-spacing: 0.1em; color: var(--gold, #c9a96e); text-align: center; margin-bottom: 0.4rem; }
  .poem-author { font-size: 13px; letter-spacing: 0.1em; color: var(--text-dim, #8a7f6e); text-align: center; margin-bottom: 2.8rem; }
  .rule { width: 60px; height: 1px; background: rgba(201,169,110,0.15); margin-bottom: 3rem; }
  .verses { display: flex; flex-direction: column; align-items: center; gap: 2.2rem; width: 100%; margin-bottom: 3rem; }
  .bayt { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; width: 100%; }
  .shatr { font-family: 'Amiri', serif; font-size: clamp(19px, 4vw, 23px); line-height: 1.75; text-align: center; direction: rtl; }
  .shatr:first-child { position: relative; padding-bottom: 0.6rem; }
  .shatr:first-child::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 1px; background: rgba(201,169,110,0.15); }
  .rule-bottom { width: 60px; height: 1px; background: rgba(201,169,110,0.15); margin-bottom: 2.8rem; }
  .nav { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0; width: 100%; direction: ltr; }
  .nav-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; width: 100%; border: 1px solid rgba(201,169,110,0.18); border-radius: 2px; background: rgba(201,169,110,0.06); color: var(--text-dim, #8a7f6e); font-size: 13px; cursor: pointer; text-decoration: none; white-space: nowrap; font-family: inherit; }
  .nav-btn:hover { background: rgba(201,169,110,0.12); color: var(--gold, #c9a96e); border-color: rgba(201,169,110,0.35); }
  .nav-btn.prev { justify-content: flex-start; }
  .nav-btn.next { justify-content: flex-end; }
  .nav-center { display: flex; flex-direction: column; align-items: center; padding: 0 1.2rem; }
  .nav-index-btn { width: 36px; height: 36px; border: 1px solid rgba(201,169,110,0.18); border-radius: 50%; background: rgba(201,169,110,0.06); color: var(--text-dim, #8a7f6e); display: flex; align-items: center; justify-content: center; text-decoration: none; }
  .nav-index-btn:hover { background: rgba(201,169,110,0.12); color: var(--gold, #c9a96e); border-color: rgba(201,169,110,0.35); }
  .nav-counter { font-size: 10px; color: var(--text-dim, #8a7f6e); letter-spacing: 0.1em; margin-top: 6px; direction: ltr; }
  .footer-ornament { font-size: 16px; color: rgba(201,169,110,0.4); margin-top: 3rem; text-align: center; }
</style>

<div class="wrapper">
  <div class="ornament">⸻  ❧  ⸻</div>
  <p class="poem-title">${title}</p>
  <p class="poem-author">${author}</p>
  <div class="rule"></div>
  <div class="verses">${verses}
  </div>
  <div class="rule-bottom"></div>
  <nav class="nav">
    <a href="${prevLink}" class="nav-btn prev">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="flex-shrink:0"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      السابقة
    </a>
    <div class="nav-center">
      <a href="${indexLink}" class="nav-index-btn" title="الفهرس">
        <svg viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="1.5" rx="0.5"/><rect x="2" y="7" width="8" height="1.5" rx="0.5"/><rect x="2" y="11" width="10" height="1.5" rx="0.5"/></svg>
      </a>
      <span class="nav-counter">${currentNum} / ${total}</span>
    </div>
    <a href="${nextLink}" class="nav-btn next">
      التالية
      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="flex-shrink:0"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
    </a>
  </nav>
  <div class="footer-ornament">٭</div>
</div>
        `;
        tR += finalHTML;
    }
} catch (error) {
    tR += "⚠️ حدث خطأ في القالب. افتح الكونسول (Ctrl+Shift+I) لرؤية التفاصيل.";
}
%>
```


