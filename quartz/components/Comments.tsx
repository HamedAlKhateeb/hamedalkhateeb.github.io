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

    const slug = fileData.slug
    const isContentPage = slug && slug !== "index" && !slug.startsWith("tags/") && !slug.endsWith("/index")

    if (disableComment || !isContentPage) return <></>

    return (
      <div
        class={classNames(displayClass, "firebase-comments")}
        data-firebase-config={JSON.stringify(opts.options)}
        data-slug={slug}
      ></div>
    )
  }

  Comments.afterDOMLoaded = script
  Comments.css = `
    /* ── Wrapper ── */
    .firebase-comments {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--lightgray);
    }

    /* ── Header ── */
    .fc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .fc-title { font-size: 1.4rem; font-weight: bold; color: var(--dark); }

    /* ── Auth ── */
    .fc-login-btn {
      background-color: var(--tertiary);
      color: var(--light);
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.88rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }
    .fc-login-btn:hover { opacity: 0.82; }
    .fc-user-info { display: flex; align-items: center; gap: 0.5rem; }
    .fc-user-avatar { width: 30px; height: 30px; border-radius: 50%; }
    .fc-logout-btn {
      background: none; border: none;
      color: var(--gray); cursor: pointer;
      font-size: 0.78rem; text-decoration: underline;
    }

    /* ── Compose ── */
    .fc-compose { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem; }
    .fc-textarea {
      width: 100%; min-height: 80px; padding: 0.75rem;
      border: 1px solid var(--lightgray); border-radius: 6px;
      background: var(--light); color: var(--dark);
      font-family: inherit; resize: vertical; box-sizing: border-box;
    }
    .fc-textarea:focus { outline: none; border-color: var(--tertiary); }
    .fc-submit-btn {
      align-self: flex-end;
      background: var(--secondary); color: var(--light);
      border: none; padding: 0.45rem 1.4rem;
      border-radius: 6px; cursor: pointer; transition: opacity 0.2s;
      font-size: 0.88rem;
    }
    .fc-submit-btn:hover { opacity: 0.82; }
    .fc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Comment list ── */
    .fc-list { display: flex; flex-direction: column; gap: 1.4rem; }
    .fc-loading { text-align: center; color: var(--gray); padding: 2rem 0; }

    /* ── Single comment ── */
    .fc-comment {
      display: flex;
      gap: 0.75rem;
    }
    .fc-comment-avatar {
      width: 38px; height: 38px;
      border-radius: 50%; flex-shrink: 0;
    }
    .fc-comment-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0;
      min-width: 0;
    }
    .fc-comment-content {
      background: var(--lightgray);
      padding: 0.85rem 1rem;
      border-radius: 10px;
    }
    .fc-comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
      font-size: 0.88rem;
      flex-wrap: wrap;
      gap: 4px;
    }
    .fc-comment-author { font-weight: 700; color: var(--dark); }
    .fc-comment-meta { display: flex; align-items: center; gap: 0.35rem; }
    .fc-comment-date { color: var(--gray); font-size: 0.8rem; }
    .fc-edited-badge { font-size: 0.7rem; color: var(--gray); font-style: italic; }
    .fc-comment-text {
      color: var(--darkgray); line-height: 1.6;
      white-space: pre-wrap; margin-bottom: 0.4rem;
      word-break: break-word;
    }

    /* ── Reactions (top-level only) ── */
    .fc-reactions { display: flex; flex-wrap: wrap; gap: 4px; margin: 0.35rem 0; }
    .fc-reaction-btn {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 2px 9px;
      border: 1px solid var(--lightgray); border-radius: 20px;
      background: var(--light); cursor: pointer; font-size: 0.85rem;
      transition: border-color 0.15s, background 0.15s, transform 0.1s;
      user-select: none;
    }
    .fc-reaction-btn:hover {
      border-color: var(--tertiary);
      background: var(--highlight);
      transform: scale(1.08);
    }
    .fc-reaction-btn.reacted { border-color: #8a252c; background: rgba(138,37,44,0.08); }
    :root[saved-theme="dark"] .fc-reaction-btn.reacted { border-color: #d1565e; background: rgba(209,86,94,0.1); }
    .fc-reaction-count { font-size: 0.72rem; color: var(--darkgray); font-weight: 600; }

    /* ── Action bar ── */
    .fc-comment-actions {
      display: flex; align-items: center;
      gap: 0.5rem; flex-wrap: wrap;
      margin-top: 0.3rem;
    }

    /* Like button */
    .fc-like-btn {
      display: inline-flex; align-items: center; gap: 3px;
      background: none; border: 1px solid var(--lightgray);
      border-radius: 20px; padding: 2px 10px;
      cursor: pointer; font-size: 0.88rem;
      transition: border-color 0.15s, background 0.15s, transform 0.1s;
      color: var(--darkgray);
    }
    .fc-like-btn:hover { border-color: #e53935; background: rgba(229,57,53,0.06); transform: scale(1.06); }
    .fc-like-btn.liked { border-color: #e53935; background: rgba(229,57,53,0.08); }
    .fc-like-count { font-size: 0.78rem; font-weight: 600; }

    /* Reply button */
    .fc-reply-btn {
      display: inline-flex; align-items: center; gap: 3px;
      background: none; border: 1px solid var(--lightgray);
      border-radius: 20px; padding: 2px 10px;
      cursor: pointer; font-size: 0.82rem; color: var(--gray);
      transition: border-color 0.15s, color 0.15s;
    }
    .fc-reply-btn:hover { border-color: var(--secondary); color: var(--secondary); }

    /* Edit / Delete */
    .fc-edit-btn, .fc-delete-btn {
      background: none; border: none;
      cursor: pointer; font-size: 0.78rem; padding: 0;
    }
    .fc-edit-btn { color: var(--gray); }
    .fc-edit-btn:hover { color: var(--secondary); text-decoration: underline; }
    .fc-delete-btn { color: #e53935; }
    .fc-delete-btn:hover { text-decoration: underline; }

    /* ── Inline edit ── */
    .fc-edit-wrap { display: flex; flex-direction: column; gap: 0.35rem; }
    .fc-edit-textarea {
      width: 100%; min-height: 65px; padding: 0.45rem 0.7rem;
      border: 1px solid var(--lightgray); border-radius: 6px;
      background: var(--light); color: var(--dark);
      font-family: inherit; font-size: inherit;
      resize: vertical; box-sizing: border-box;
    }
    .fc-edit-textarea:focus { outline: none; border-color: var(--tertiary); }
    .fc-edit-actions { display: flex; gap: 0.5rem; align-items: center; }

    /* ── Reply form (inline) ── */
    .fc-replies-area {
      margin-top: 0.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .fc-reply-form {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.6rem 0.75rem;
      background: var(--highlight);
      border-radius: 8px;
      border: 1px solid var(--lightgray);
    }
    .fc-reply-textarea {
      width: 100%; min-height: 60px; padding: 0.45rem 0.7rem;
      border: 1px solid var(--lightgray); border-radius: 6px;
      background: var(--light); color: var(--dark);
      font-family: inherit; font-size: 0.9rem;
      resize: vertical; box-sizing: border-box;
    }
    .fc-reply-textarea:focus { outline: none; border-color: var(--tertiary); }
    .fc-reply-actions { display: flex; gap: 0.5rem; align-items: center; }
    .fc-reply-submit-btn { padding: 0.3rem 1rem; font-size: 0.82rem; }

    /* ── Nested replies ── */
    .fc-reply {
      padding-right: 0;
    }
    .fc-reply-avatar {
      width: 30px !important;
      height: 30px !important;
    }
    .fc-reply .fc-comment-content {
      background: var(--light);
      border: 1px solid var(--lightgray);
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
    }
    .fc-reply .fc-comment-text { font-size: 0.92rem; }
    .fc-reply .fc-comment-author { font-size: 0.85rem; }
    .fc-reply .fc-comment-date { font-size: 0.75rem; }
  `

  return Comments
}) satisfies QuartzComponentConstructor<Options>
