import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Newsletter: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "newsletter-section")}>
      <div class="newsletter-content">
        <h3>ابق على اطلاع</h3>
        <p>حديثٌ ذو شجون، وأنيسٌ لا يخون</p>
        <form action="#" method="POST" class="newsletter-form">
          <button type="submit">اشتراك</button>
          <input type="email" placeholder="بريدك الإلكتروني" required />
        </form>
        <small>لا رسائل مزعجة، إلغاء الاشتراك في أي وقت.</small>
      </div>
    </div>
  )
}

Newsletter.css = `
.newsletter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  padding: 3rem 0;
  border-top: 1px dashed var(--gray);
  width: 100%;
}

.newsletter-content {
  text-align: right;
  max-width: 600px;
  width: 100%;
}

.newsletter-content h3 {
  font-family: var(--titleFont);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.newsletter-content p {
  color: var(--darkgray);
  margin-bottom: 2rem;
}

.newsletter-form {
  display: flex;
  gap: 0;
  width: 100%;
  margin-bottom: 1rem;
}

.newsletter-form input {
  flex-grow: 1;
  padding: 1rem;
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 0 8px 8px 0;
  font-family: inherit;
  font-size: 1rem;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--gray);
}

.newsletter-form button {
  padding: 1rem 2rem;
  background-color: #8c8375;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.newsletter-form button:hover {
  background-color: #726a5e;
}

.newsletter-content small {
  color: var(--gray);
  font-size: 0.85rem;
}
`

export default (() => Newsletter) satisfies QuartzComponentConstructor