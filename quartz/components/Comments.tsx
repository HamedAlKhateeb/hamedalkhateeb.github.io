import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/comments.inline"

type Options = {
  provider: "firebase"
  options: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId?: string
  }
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")

    const slug = (fileData.slug ?? "").toLowerCase()

    // التعليقات مسموحة فقط في: التدوينات العربية، التدوينات الإنجليزية، الشذرات، والقصائد
    const isArabicArticle = slug.startsWith("ar/articles/") && !slug.endsWith("/index")
    const isMicro =
      (slug.startsWith("ar/micro/") || slug.startsWith("en/micro/")) && !slug.endsWith("/index")
    const isPoetry = slug.startsWith("ar/poetry/") && !slug.endsWith("/index")
    const isEnglishArticle =
      !slug.startsWith("ar/") &&
      (slug.startsWith("experiences/") ||
        slug.startsWith("engineering/") ||
        slug.startsWith("math/") ||
        slug.startsWith("culture/") ||
        slug.startsWith("en/")) &&
      !slug.endsWith("/index") &&
      slug !== "en"

    const isAllowed = isArabicArticle || isMicro || isPoetry || isEnglishArticle

    if (disableComment || !isAllowed) return <></>

    // لغة واجهة التعليقات تتبع لغة الصفحة (العربية للعربي والإنجليزية لغيره)
    const lang = slug.startsWith("ar/") || slug === "ar" ? "ar" : "en"

    return (
      <div
        class={classNames(displayClass, "firebase-comments")}
        data-firebase-config={JSON.stringify(opts.options)}
        data-slug={slug}
        data-lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
      ></div>
    )
  }

  Comments.afterDOMLoaded = script
  Comments.css = `
    /* ════════════════════════════════════════════════════════════
       Neo-brutalist Retro Comments System
       Matches Blog Theme (Amiri / IBM Plex, Borders, Yellow Accent)
       ════════════════════════════════════════════════════════════ */

    .firebase-comments {
      margin: 3.5rem auto 2rem auto;
      padding-top: 2rem;
      border-top: 2px dashed var(--nb-line, #000);
      width: 100%;
      max-width: var(--reading-width, 950px);
      box-sizing: border-box;
      color: var(--color-ink, #000);
    }

    /* ── LTR & RTL Enforcements ── */
    .firebase-comments[dir="ltr"],
    .firebase-comments[data-lang="en"] {
      direction: ltr !important;
      text-align: left !important;
      font-family: var(--font-english);

      .fc-header, .fc-title, .fc-share-title, .fc-reactions-title,
      .fc-textarea, .fc-guest-input, .fc-edit-textarea, .fc-reply-textarea,
      .fc-comment-content, .fc-comment-text, .fc-author-row, .fc-comment-meta,
      .fc-live-preview {
        direction: ltr !important;
        text-align: left !important;
      }

      .fc-reply {
        border-inline-start: 2.5px solid var(--nb-line, #000);
        margin-inline-start: 1.5rem;
        padding-inline-start: 0.85rem;
        border-inline-end: none;
        padding-inline-end: 0;
      }

      .fc-save-label, .fc-save-label span {
        direction: ltr;
        justify-content: flex-start;
      }
    }

    .firebase-comments[dir="rtl"],
    .firebase-comments[data-lang="ar"] {
      direction: rtl !important;
      text-align: right !important;
      font-family: var(--font-arabic);

      .fc-header, .fc-title, .fc-share-title, .fc-reactions-title {
        font-family: var(--font-arabic-display) !important;
      }

      .fc-header, .fc-title, .fc-share-title, .fc-reactions-title,
      .fc-textarea, .fc-guest-input, .fc-edit-textarea, .fc-reply-textarea,
      .fc-comment-content, .fc-comment-text, .fc-author-row, .fc-comment-meta,
      .fc-live-preview {
        direction: rtl !important;
        text-align: right !important;
      }

      .fc-reply {
        border-inline-start: 2.5px solid var(--nb-line, #000);
        margin-inline-start: 1.5rem;
        padding-inline-start: 0.85rem;
        border-inline-end: none;
        padding-inline-end: 0;
      }

      .fc-save-label, .fc-save-label span {
        direction: rtl;
        justify-content: flex-start;
      }
    }

    /* ── Article Reactions Card ── */
    .fc-article-reactions {
      margin-bottom: 2rem;
      padding: 1.25rem 1.5rem;
      background: var(--color-surface-elevated, #fff);
      border: 2px solid var(--nb-line, #000);
      box-shadow: 3.5px 3.5px 0 0 var(--nb-line, #000);
      border-radius: 6px;
      text-align: center;
    }
    .fc-reactions-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--color-ink, #000);
      margin-bottom: 0.9rem;
    }
    .fc-reactions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }
    .fc-reaction-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
      border-radius: 20px;
      background: var(--color-field, #fdfbf7);
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      user-select: none;
    }
    .fc-reaction-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 0 var(--nb-line, #000);
      background: var(--nb-main, #f6c445);
    }
    .fc-reaction-btn.reacted {
      background: var(--nb-main, #f6c445);
      border-color: var(--nb-line, #000);
    }
    .fc-reaction-count {
      font-size: 0.82rem;
      color: var(--color-ink, #000);
      font-weight: 700;
    }

    /* ── Social Share Card ── */
    .fc-share-wrapper {
      text-align: center;
      margin-top: 1.5rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.75rem;
      border-bottom: 1.5px dashed var(--nb-line, #000);
    }
    .fc-share-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--color-ink, #000);
      margin-bottom: 1rem;
    }
    .fc-share-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .fc-share-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--color-surface-elevated, #fff);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
      color: var(--color-ink, #000);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease;
      text-decoration: none;
    }
    .fc-share-btn svg {
      width: 19px;
      height: 19px;
    }
    .fc-share-btn:hover {
      transform: translate(-1.5px, -1.5px);
      box-shadow: 3.5px 3.5px 0 0 var(--nb-line, #000);
    }
    .fc-share-btn.fb:hover { background-color: #1877F2; color: #fff; }
    .fc-share-btn.li:hover { background-color: #0A66C2; color: #fff; }
    .fc-share-btn.tg:hover { background-color: #26A5E4; color: #fff; }
    .fc-share-btn.wa:hover { background-color: #25D366; color: #fff; }
    .fc-share-btn.x:hover { background-color: #000; color: #fff; }

    /* ── Comments Header & Tabs ── */
    .fc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 10px;
    }
    .fc-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--color-ink, #000);
      margin: 0;
    }
    .fc-auth-tabs {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .fc-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.35rem 0.85rem;
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 1.5px 1.5px 0 0 var(--nb-line, #000);
      border-radius: 4px;
      background: var(--color-surface-elevated, #fff);
      color: var(--color-ink, #000);
      font-size: 0.82rem;
      font-family: inherit;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      white-space: nowrap;
    }
    .fc-tab-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 2.5px 2.5px 0 0 var(--nb-line, #000);
    }
    .fc-tab-active {
      background: var(--nb-main, #f6c445) !important;
      color: #000 !important;
      transform: translate(-1px, -1px);
      box-shadow: 2.5px 2.5px 0 0 var(--nb-line, #000);
    }

    /* ── Auth Area ── */
    .fc-google-login-area {
      margin-bottom: 1.25rem;
    }
    .fc-login-btn {
      background: var(--color-surface-elevated, #fff);
      color: var(--color-ink, #000);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2.5px 2.5px 0 0 var(--nb-line, #000);
      padding: 0.45rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.88rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .fc-login-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3.5px 3.5px 0 0 var(--nb-line, #000);
      background: var(--color-field, #fdfbf7);
    }
    .fc-user-info {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      background: var(--color-field, #fdfbf7);
      border: 1.5px solid var(--nb-line, #000);
      border-radius: 4px;
      box-shadow: 1.5px 1.5px 0 0 var(--nb-line, #000);
      width: fit-content;
      margin-bottom: 0.75rem;
    }
    .fc-user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--nb-line, #000);
    }
    .fc-logout-btn {
      background: none;
      border: none;
      color: var(--color-ink-muted, #666);
      cursor: pointer;
      font-size: 0.8rem;
      text-decoration: underline;
      font-family: inherit;
    }
    .fc-logout-btn:hover {
      color: #e53935;
    }

    /* ── Compose & Obsidian-style Editor Wrap ── */
    .fc-compose {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }
    .fc-editor-wrap {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--nb-line, #000);
      box-shadow: 3.5px 3.5px 0 0 var(--nb-line, #000);
      border-radius: 6px;
      background: var(--color-surface-elevated, #fff);
      overflow: hidden;
      transition: box-shadow 0.15s ease;
    }
    .fc-editor-wrap:focus-within {
      box-shadow: 4.5px 4.5px 0 0 var(--nb-line, #000);
    }

    /* Obsidian Toolbar */
    .fc-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      background: var(--color-field, #fdfbf7);
      border-bottom: 1.5px solid var(--nb-line, #000);
      flex-wrap: wrap;
      gap: 6px;
    }
    .fc-toolbar-tools {
      display: flex;
      gap: 3px;
      align-items: center;
    }
    .fc-toolbar-tools button {
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      color: var(--color-ink, #000);
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s, border 0.1s;
    }
    .fc-toolbar-tools button:hover {
      background: var(--color-surface-elevated, #fff);
      border: 1px solid var(--nb-line, #000);
    }
    .fc-toolbar-modes {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .fc-mode-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 0.2rem 0.6rem;
      border: 1.5px solid var(--nb-line, #000) !important;
      border-radius: 4px;
      background: var(--color-surface-elevated, #fff);
      color: var(--color-ink, #000);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, transform 0.1s;
    }
    .fc-mode-btn.active {
      background: var(--nb-main, #f6c445) !important;
      color: #000 !important;
    }

    /* Editor Body (Textarea + In-place Live Preview) */
    .fc-editor-body {
      position: relative;
      width: 100%;
      min-height: 95px;
    }
    .fc-textarea {
      width: 100%;
      min-height: 95px;
      padding: 0.85rem 1rem;
      border: none;
      background: transparent;
      color: var(--color-ink, #000);
      font-family: inherit;
      font-size: 0.95rem;
      line-height: 1.6;
      resize: vertical;
      box-sizing: border-box;
      display: block;
    }
    .fc-textarea:focus {
      outline: none;
    }
    .fc-live-preview {
      min-height: 95px;
      padding: 0.85rem 1rem;
      background: var(--color-surface-elevated, #fff);
      color: var(--color-ink, #000);
      line-height: 1.6;
      font-size: 0.95rem;
      box-sizing: border-box;
      cursor: text;
    }

    /* Submit Button */
    .fc-submit-btn {
      align-self: flex-end;
      background: var(--nb-main, #f6c445);
      color: #000;
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2.5px 2.5px 0 0 var(--nb-line, #000);
      padding: 0.45rem 1.4rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 800;
      font-size: 0.9rem;
      font-family: inherit;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }
    .fc-submit-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3.5px 3.5px 0 0 var(--nb-line, #000);
      background: var(--nb-main-hover, #e5a822);
    }
    .fc-submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 1.5px 1.5px 0 0 var(--nb-line, #000);
    }

    /* ── Guest Form ── */
    .fc-guest-form {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      background: var(--color-field, #fdfbf7);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
      border-radius: 6px;
    }
    .fc-guest-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
    }
    @media (max-width: 520px) {
      .fc-guest-row { grid-template-columns: 1fr; }
    }
    .fc-guest-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1.5px solid var(--nb-line, #000);
      border-radius: 4px;
      background: var(--color-surface-elevated, #fff);
      color: var(--color-ink, #000);
      font-family: inherit;
      font-size: 0.88rem;
      box-sizing: border-box;
      transition: box-shadow 0.15s;
    }
    .fc-guest-input:focus {
      outline: none;
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
    }
    .fc-guest-input::placeholder {
      color: var(--color-ink-muted, #78716c);
    }
    .fc-guest-input-full {
      width: 100%;
    }
    .fc-save-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: var(--color-ink-muted, #78716c);
      cursor: pointer;
      user-select: none;
      margin: 0.2rem 0;
    }
    .fc-save-checkbox {
      width: 15px;
      height: 15px;
      accent-color: var(--nb-main, #f6c445);
      cursor: pointer;
      margin: 0;
    }

    /* ── Comment List ── */
    .fc-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .fc-loading {
      text-align: center;
      color: var(--color-ink-muted, #6b665f);
      padding: 2rem 0;
      font-style: italic;
    }

    /* ── Single Comment ── */
    .fc-comment {
      display: flex;
      gap: 0.85rem;
    }
    .fc-comment-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid var(--nb-line, #000);
      flex-shrink: 0;
      background: var(--color-field, #fdfbf7);
    }
    .fc-comment-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .fc-comment-content {
      background: var(--color-field, #fdfbf7);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2.5px 2.5px 0 0 var(--nb-line, #000);
      padding: 0.85rem 1.15rem;
      border-radius: 6px;
    }
    .fc-comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.88rem;
      flex-wrap: wrap;
      gap: 6px;
    }
    .fc-author-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
    }
    .fc-comment-author {
      font-weight: 800;
      color: var(--color-ink, #000);
    }
    .fc-author-link {
      font-weight: 800;
      color: var(--color-ink, #000) !important;
      text-decoration: underline;
    }
    .fc-guest-badge {
      display: inline-block;
      font-size: 0.65rem;
      padding: 1px 6px;
      border-radius: 10px;
      background: var(--color-surface-elevated, #fff);
      border: 1px solid var(--nb-line, #000);
      color: var(--color-ink, #000);
      font-weight: 700;
      vertical-align: middle;
    }
    .fc-comment-meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .fc-comment-date {
      color: var(--color-ink-muted, #78716c);
      font-size: 0.8rem;
    }
    .fc-edited-badge {
      font-size: 0.72rem;
      color: var(--color-ink-muted, #78716c);
      font-style: italic;
    }

    /* Markdown Text Inside Comments */
    .fc-comment-text {
      color: var(--color-ink, #000);
      line-height: 1.65;
      word-break: break-word;
    }
    .fc-comment-text p {
      margin: 0 0 0.5rem 0;
    }
    .fc-comment-text p:last-child {
      margin-bottom: 0;
    }
    .fc-comment-text h3 {
      margin: 0.5rem 0 0.3rem;
      font-size: 1.1rem;
      color: var(--color-ink, #000);
    }
    .fc-comment-text code {
      background: rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
      font-size: 0.85em;
      font-family: var(--font-code, monospace);
    }
    [saved-theme="dark"] .fc-comment-text code {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .fc-comment-text a {
      color: var(--color-ink, #000);
      text-decoration: underline;
      font-weight: 600;
    }

    /* Action Bar (Like, Reply, Edit, Delete) */
    .fc-comment-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }
    .fc-like-btn, .fc-reply-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--color-surface-elevated, #fff);
      border: 1.2px solid var(--nb-line, #000);
      box-shadow: 1px 1px 0 0 var(--nb-line, #000);
      border-radius: 14px;
      padding: 2px 10px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-ink, #000);
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .fc-like-btn:hover, .fc-reply-btn:hover {
      transform: translate(-0.5px, -0.5px);
      box-shadow: 1.5px 1.5px 0 0 var(--nb-line, #000);
      background: var(--color-field, #fdfbf7);
    }
    .fc-like-btn.liked {
      background: var(--nb-main, #f6c445);
    }
    .fc-like-count {
      font-size: 0.78rem;
      font-weight: 700;
    }
    .fc-edit-btn, .fc-delete-btn, .fc-ban-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.78rem;
      padding: 0;
      font-family: inherit;
    }
    .fc-edit-btn { color: var(--color-ink-muted, #78716c); }
    .fc-edit-btn:hover { color: var(--color-ink, #000); text-decoration: underline; }
    .fc-delete-btn { color: #e53935; }
    .fc-delete-btn:hover { text-decoration: underline; }
    .fc-ban-btn { color: #e65100; }
    .fc-ban-btn:hover { text-decoration: underline; }

    /* Nested Replies */
    .fc-replies-area {
      margin-top: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .fc-reply-avatar {
      width: 28px !important;
      height: 28px !important;
    }
    .fc-reply-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--color-field, #fdfbf7);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
      border-radius: 6px;
    }
    .fc-reply-textarea {
      width: 100%;
      min-height: 70px;
      padding: 0.6rem 0.8rem;
      border: none;
      background: transparent;
      color: var(--color-ink, #000);
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
      box-sizing: border-box;
    }
    .fc-reply-textarea:focus { outline: none; }
    .fc-reply-actions {
      display: flex;
      gap: 0.6rem;
      align-items: center;
      margin-top: 0.4rem;
    }
    .fc-reply-submit-btn {
      padding: 0.35rem 1rem;
      font-size: 0.82rem;
    }

    /* Inline Edit */
    .fc-edit-textarea {
      width: 100%;
      min-height: 75px;
      padding: 0.6rem 0.8rem;
      border: none;
      background: transparent;
      color: var(--color-ink, #000);
      font-family: inherit;
      font-size: inherit;
      resize: vertical;
      box-sizing: border-box;
    }
    .fc-edit-textarea:focus { outline: none; }
    .fc-edit-actions {
      display: flex;
      gap: 0.6rem;
      align-items: center;
      margin-top: 0.5rem;
    }

    /* Notification Bar */
    .fc-notify-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      margin-bottom: 1.25rem;
      background: var(--color-field, #fdfbf7);
      border: 1.5px solid var(--nb-line, #000);
      box-shadow: 2px 2px 0 0 var(--nb-line, #000);
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--color-ink, #000);
    }
    .fc-notify-text { flex: 1; }
    .fc-notify-btn {
      padding: 0.3rem 0.85rem;
      border: 1.5px solid var(--nb-line, #000);
      border-radius: 4px;
      background: var(--nb-main, #f6c445);
      color: #000;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 1px 1px 0 0 var(--nb-line, #000);
    }
  `

  return Comments
}) satisfies QuartzComponentConstructor<Options>
