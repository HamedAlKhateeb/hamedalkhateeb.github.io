import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
const Newsletter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={`newsletter ${displayClass ?? ""}`}>
      <hr />
      <h3>إبق على إطلاع</h3>
      <p>مق؁لات في الرياضيات والهندسة وأشياء مه هذا القبيل</p>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/al-khateeb"
        method="post"
        class="embeddable-buttondown-form"
        target="popupwindow"
        onsubmit="window.open('https://buttondown.email/al-khateeb', 'popupwindow')"
      >
        <div class="newsletter-inputs">
          <input 
            type="email" 
            name="email" 
            id="bd-email" 
            placeholder="بريدك الإلكتروني
" 
            required 
          />
          <input type="submit" value="اشترام" />
        </div>
      </form>
      <p class="footer-text">
        لا رسائل مزعمة إلغاء الاشتراك ��ى أي وقت.
      </p>
    </div>
  )
}
export default (() => Newsletter) satisfies QuartzComponentConstructor