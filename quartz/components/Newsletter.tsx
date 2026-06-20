import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Newsletter: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  // Only render on the homepage or tag/list pages — not on poetry pages.
  if (
    slug !== "index" &&
    slug !== "ar/index" &&
    !slug.endsWith("/index") &&
    !slug.startsWith("tags/")
  ) {
    return null
  }
  if (slug.toLowerCase().startsWith("ar/poetry/") || slug.toLowerCase().startsWith("poetry/")) {
    return null
  }

  const isArabic = slug.toLowerCase().startsWith("ar/") || slug.toLowerCase() === "ar"

  const title = isArabic ? "ابق على اطلاع" : "Stay Informed"
  const description = isArabic
    ? "مقالات في الرياضيات والهندسة وأشياء من هذا القبيل"
    : "Articles on math, engineering, and similar topics"
  const buttonText = isArabic ? "اشتراك" : "Subscribe"
  const inputPlaceholder = isArabic ? "بريدك الإلكتروني" : "Your Email"
  const smallText = isArabic
    ? "لا رسائل مزعجة، إلغاء الاشتراك في أي وقت."
    : "No spam, unsubscribe at any time."

  return (
    <div class={classNames(displayClass, "newsletter-section")}>
      {/* 2. Separator */}
      <div class="footer-separator top-sep">
        <span class="separator-diamond">✧</span>
      </div>

      {isArabic ? (
        <>
          <h3>{title}</h3>
          <p>{description}</p>
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/al-khateeb"
            method="POST"
            class="newsletter-form"
            target="popupwindow"
          >
            <button type="submit">{buttonText}</button>
            <input type="email" name="email" placeholder={inputPlaceholder} required />
          </form>
          <small>{smallText}</small>
        </>
      ) : (
        <iframe
          src="https://pragmaticreader.substack.com/embed"
          width="100%"
          height="320"
          style={{ border: "1px solid #EEE", background: "white", maxWidth: "480px" }}
          frameBorder={0}
          scrolling="no"
        ></iframe>
      )}

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
  max-width: 320px;
  margin-bottom: 1rem;
  flex-direction: row-reverse;
}
.newsletter-form input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 0 6px 6px 0;
  border-left: none;
  font-family: inherit;
  font-size: 0.9rem;
  flex: 1;
  min-width: 0;
}
@media (max-width: 480px) {
  .newsletter-form {
    max-width: 280px;
  }
}
.newsletter-form input:focus {
  outline: none;
  border-color: var(--gray);
}
.newsletter-form button {
  padding: 0.6rem 1.2rem;
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
