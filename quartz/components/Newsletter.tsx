import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Newsletter: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  // Only render on the homepage or tag/list pages.
  if (fileData.slug !== "index" && !fileData.slug?.endsWith("/index") && !fileData.slug?.startsWith("tags/")) {
    return null
  }

  return (
    <div class={classNames(displayClass, "newsletter-section")}>
      {/* 2. Separator */}
      <div class="footer-separator top-sep">
         <span class="separator-diamond">✧</span>
      </div>
      
      <h3>ابق على اطلاع</h3>
      <p>مقالات في الرياضيات والهندسة وأشياء من هذا القبيل</p>
      <form 
        action="https://buttondown.email/api/emails/embed-subscribe/al-khateeb" 
        method="POST" 
        class="newsletter-form"
        target="popupwindow"
        onSubmit="window.open('https://buttondown.email/al-khateeb', 'popupwindow')"
      >
        <button type="submit">اشتراك</button>
        <input type="email" name="email" placeholder="بريدك الإلكتروني" required />
      </form>
      <small>لا رسائل مزعجة، إلغاء الاشتراك في أي وقت.</small>

      {/* 4. Separator */}
      <div class="footer-separator bottom-sep">
        <span>◇ ~ (x) ~ ◇</span>
      </div>
    </div>
  )
}

Newsletter.css = `
.newsletter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  margin-top: 3rem;
  padding: 3rem 0;
}
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
`

export default (() => Newsletter) satisfies QuartzComponentConstructor
