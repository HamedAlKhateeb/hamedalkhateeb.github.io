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
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
      
    const slug = fileData.slug
    const isContentPage = slug && slug !== "index" && !slug.startsWith("tags/") && !slug.endsWith("/index")

    if (disableComment || !isContentPage) {
      return <></>
    }

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
    .firebase-comments {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--lightgray);
    }
    .fc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .fc-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--dark);
    }
    .fc-login-btn {
      background-color: var(--tertiary);
      color: var(--light);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .fc-login-btn:hover {
      opacity: 0.8;
    }
    .fc-user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .fc-user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .fc-logout-btn {
      background: none;
      border: none;
      color: var(--gray);
      cursor: pointer;
      font-size: 0.8rem;
      text-decoration: underline;
    }
    .fc-compose {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .fc-textarea {
      width: 100%;
      min-height: 80px;
      padding: 0.75rem;
      border: 1px solid var(--lightgray);
      border-radius: 5px;
      background-color: var(--light);
      color: var(--dark);
      font-family: inherit;
      resize: vertical;
    }
    .fc-textarea:focus {
      outline: none;
      border-color: var(--tertiary);
    }
    .fc-submit-btn {
      align-self: flex-end;
      background-color: var(--secondary);
      color: var(--light);
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .fc-submit-btn:hover {
      opacity: 0.8;
    }
    .fc-submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .fc-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .fc-comment {
      display: flex;
      gap: 1rem;
    }
    .fc-comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .fc-comment-content {
      flex-grow: 1;
      background-color: var(--lightgray);
      padding: 1rem;
      border-radius: 8px;
    }
    .fc-comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .fc-comment-author {
      font-weight: bold;
      color: var(--dark);
    }
    .fc-comment-date {
      color: var(--gray);
    }
    .fc-comment-text {
      color: var(--darkgray);
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .fc-delete-btn {
      background: none;
      border: none;
      color: #e53935;
      cursor: pointer;
      font-size: 0.8rem;
      margin-top: 0.5rem;
      padding: 0;
    }
    .fc-delete-btn:hover {
      text-decoration: underline;
    }
    .fc-loading {
      text-align: center;
      color: var(--gray);
      padding: 2rem 0;
    }
  `

  return Comments
}) satisfies QuartzComponentConstructor<Options>
