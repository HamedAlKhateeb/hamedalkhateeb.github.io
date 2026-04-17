import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import readingTime from "reading-time"
import { getDate } from "./Date"
import { resolveRelative } from "../util/path"

const ArticleFooter: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, allFiles, displayClass, cfg } = props
  const text = fileData.text
  
  // Only render on actual articles
  if (!text || fileData.slug === "index" || fileData.slug?.endsWith("/index") || fileData.slug?.startsWith("tags/")) {
    return null
  }
  
  const { minutes } = readingTime(text)
  const time = i18n(cfg.locale).components.contentMeta.readingTime({ minutes: Math.ceil(minutes) })
  const date = getDate(cfg, fileData)
  
  // Get 2 recommended articles (simple logic: get 2 next/prev or fallback)
  const currentIdx = allFiles.findIndex(f => f.slug === fileData.slug)
  const recommendations = []
  if (currentIdx !== -1 && allFiles.length > 2) {
    let nextIdx = (currentIdx + 1) % allFiles.length
    let prevIdx = (currentIdx - 1 + allFiles.length) % allFiles.length
    if (allFiles[nextIdx].slug === fileData.slug) nextIdx = (nextIdx + 1) % allFiles.length
    if (allFiles[prevIdx].slug === fileData.slug || allFiles[prevIdx].slug === allFiles[nextIdx].slug) prevIdx = (prevIdx - 1 + allFiles.length) % allFiles.length
    
    recommendations.push(allFiles[prevIdx])
    recommendations.push(allFiles[nextIdx])
  } else {
     recommendations.push(...allFiles.filter(f => f.slug !== fileData.slug).slice(0, 2))
  }

  return (
    <div class={classNames(displayClass, "article-footer-wrapper")}>
      
      {/* 1. Recommendations */}
      {recommendations.length > 0 && (
        <div class="recommendations-section">
          <h3 class="recommendations-title">إقرأ أيضاً</h3>
          <div class="recommendations-grid">
            {recommendations.map((page, idx) => (
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="recommendation-card internal" key={idx}>
                <span class="rec-category">{page.frontmatter?.tags?.[0] || 'مقال'}</span>
                <h4>{page.frontmatter?.title}</h4>
                <p>{page.frontmatter?.description || 'اضغط لقراءة المزيد...'}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 2. Separator */}
      <div class="footer-separator top-sep">
         <span class="separator-diamond">✧</span>
      </div>

      {/* 3. Newsletter */}
      <div class="newsletter-section">
        <h3>ابق على اطلاع</h3>
        <p>مقالات في الرياضيات والهندسة وأشياء من هذا القبيل</p>
        <form action="#" method="POST" class="newsletter-form">
          <button type="submit">اشتراك</button>
          <input type="email" placeholder="بريدك الإلكتروني" required />
        </form>
        <small>لا رسائل مزعجة، إلغاء الاشتراك في أي وقت.</small>
      </div>

      {/* 4. Separator */}
      <div class="footer-separator bottom-sep">
        <span>◇ ~ (x) ~ ◇</span>
      </div>

      {/* 5. Meta Block */}
      <div class="article-end-meta">
        <h2 class="footer-article-title">{fileData.frontmatter?.title}</h2>
        <p class="footer-category">من المقالات في نفس التصنيف</p>
        
        <div class="footer-info">
          <a href="/" class="internal author-link">مدونة حامد الخطيب</a>
          <span class="dot">|</span>
          <span>{date ? date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }) : ""}</span>
          <span class="dot">|</span>
          <span>{time}</span>
        </div>
        
        <button class="back-to-start" id="btn-footer-top">
          ↑ العودة للبداية
        </button>

        <a href="/" class="all-articles-link">-- جميع المقالات --</a>
      </div>
    </div>
  )
}

ArticleFooter.css = `
.article-footer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px dashed var(--lightgray);
  width: 100%;
}

/* Recommendations */
.recommendations-title {
  text-align: center;
  font-family: var(--headerFont);
  color: #8a252c;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}
.recommendations-grid {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}
.recommendation-card {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.2s ease;
  background: transparent;
}
.recommendation-card:hover {
  border-color: var(--gray);
  transform: translateY(-2px);
}
.rec-category {
  display: block;
  font-size: 0.8rem;
  color: var(--gray);
  margin-bottom: 0.5rem;
}
.recommendation-card h4 {
  font-family: var(--headerFont);
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  color: var(--dark);
}
.recommendation-card p {
  font-size: 0.9rem;
  color: var(--darkgray);
  margin: 0;
  opacity: 0.8;
}

/* Separators */
.footer-separator {
  margin: 3rem 0;
  color: #c9a7ab;
  text-align: center;
  font-size: 1.2rem;
  user-select: none;
}
.separator-diamond {
  color: #8a252c;
  font-size: 1.5rem;
}

/* Newsletter Block */
.newsletter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}
.newsletter-section h3 {
  font-family: var(--headerFont);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #8a252c !important;
}
.newsletter-section p {
  color: var(--gray);
  margin-bottom: 1.5rem;
}
.newsletter-form {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  flex-direction: row-reverse;
}
.newsletter-form input {
  padding: 0.8rem;
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 0 6px 6px 0;
  border-left: none;
  font-family: inherit;
  font-size: 0.95rem;
  flex: 1;
}
.newsletter-form input:focus {
  outline: none;
  border-color: var(--gray);
}
.newsletter-form button {
  padding: 0.8rem 1.5rem;
  background-color: #8a252c;
  color: white;
  border: none;
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}
.newsletter-form button:hover {
  background-color: #6d1c22;
}
.newsletter-section small {
  color: var(--gray);
  font-size: 0.85rem;
}



/* End Meta Block */
.article-end-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding-bottom: 3rem;
}
.footer-article-title {
  font-family: var(--headerFont);
  font-size: 1.8rem;
  color: var(--dark);
  margin: 0 0 0.5rem 0;
}
.footer-category {
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.footer-info {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--gray);
  margin-bottom: 2rem;
}
.footer-info .dot {
  color: var(--lightgray);
}
.author-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
.author-link:hover {
  text-decoration: underline;
}
.back-to-start {
  background-color: var(--light);
  color: var(--darkgray);
  border: 1px solid var(--lightgray);
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  margin-bottom: 3rem;
}
.back-to-start:hover {
  background-color: var(--lightgray);
}
.all-articles-link {
  color: var(--gray);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.all-articles-link:hover {
  color: var(--darkgray);
}
`

ArticleFooter.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const btn = document.getElementById("btn-footer-top")
  if (btn) {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
    btn.addEventListener("click", scrollToTop)
    window.addCleanup(() => btn.removeEventListener("click", scrollToTop))
  }
})
`

export default (() => ArticleFooter) satisfies QuartzComponentConstructor
