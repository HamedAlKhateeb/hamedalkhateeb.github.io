document.addEventListener("nav", async () => {
  const container = document.querySelector(".firebase-comments") as HTMLElement
  if (!container) return
  if (container.dataset.initialized) return
  container.dataset.initialized = "true"

  const configStr = container.dataset.firebaseConfig
  if (!configStr) return
  const config = JSON.parse(configStr)
  const slug = container.dataset.slug || "unknown"

  const EMOJIS = ["👍", "❤️", "🎉", "😄", "🤔", "😢"]

  const getAnonId = (): string => {
    let id = localStorage.getItem("fc-anon-id")
    if (!id) {
      id = "anon_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
      localStorage.setItem("fc-anon-id", id)
    }
    return id
  }

  const loginSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-left:6px;flex-shrink:0;"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`

  const toolbarHTML = `
    <div class="fc-toolbar">
      <button type="button" data-md="**" title="عريض (Bold)"><b>B</b></button>
      <button type="button" data-md="*" title="مائل (Italic)"><i>I</i></button>
      <button type="button" data-md="~~" title="شطب (Strikethrough)"><strike>S</strike></button>
      <button type="button" data-md="## " title="عنوان (Heading)"><b>H</b></button>
      <button type="button" data-md="\`" title="كود (Code)"><code>&lt;/&gt;</code></button>
      <button type="button" data-md="[]()" title="رابط (Link)">🔗</button>
    </div>
  `

  container.innerHTML = `
    <div id="fc-article-reactions" class="fc-article-reactions"></div>
    
    <div class="fc-share-wrapper">
      <div class="fc-share-title">شارك المقال</div>
      <div id="fc-share-buttons" class="fc-share-buttons">
        <a class="fc-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" title="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a class="fc-share-btn li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a class="fc-share-btn tg" href="https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}" target="_blank" rel="noopener noreferrer" title="Telegram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>
        </a>
        <a class="fc-share-btn wa" href="https://api.whatsapp.com/send?text=${encodeURIComponent(document.title)}%20${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
        <a class="fc-share-btn x" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}" target="_blank" rel="noopener noreferrer" title="X">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
    </div>

    <div class="fc-header">
      <div class="fc-title">التعليقات</div>
      <div id="fc-auth-section">
        <button type="button" id="fc-login-btn" class="fc-login-btn">${loginSVG} تسجيل الدخول بـ Google</button>
      </div>
    </div>
    <div id="fc-compose-section" class="fc-compose" style="display:none;">
      <div class="fc-editor-wrap">
        ${toolbarHTML}
        <textarea id="fc-textarea" class="fc-textarea" placeholder="اكتب تعليقك هنا..."></textarea>
      </div>
      <div id="fc-preview" class="fc-comment-text" style="display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"></div>
      <button type="button" id="fc-submit-btn" class="fc-submit-btn">إرسال التعليق</button>
    </div>
    <div id="fc-list" class="fc-list"><div class="fc-loading">جاري تحميل التعليقات...</div></div>
  `

  const authSection = document.getElementById("fc-auth-section")!
  const composeSection = document.getElementById("fc-compose-section")!
  const textarea = document.getElementById("fc-textarea") as HTMLTextAreaElement
  const submitBtn = document.getElementById("fc-submit-btn") as HTMLButtonElement
  const listEl = document.getElementById("fc-list")!
  const reactionsEl = document.getElementById("fc-article-reactions")!
  const previewEl = document.getElementById("fc-preview")!

  // Helper to insert markdown at cursor
  const bindToolbar = (wrap: HTMLElement, ta: HTMLTextAreaElement) => {
    wrap.querySelectorAll(".fc-toolbar button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const md = (btn as HTMLElement).dataset.md!
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const text = ta.value

        if (md === "[]()") {
          ta.value = text.substring(0, start) + "[النص هنا](الرابط_هنا)" + text.substring(end)
          ta.focus()
          ta.setSelectionRange(start + 1, start + 9)
        } else if (md === "## ") {
          const before = text.substring(0, start)
          const needsNewline = before.length > 0 && !before.endsWith("\n")
          const prefix = needsNewline ? "\n## " : "## "
          ta.value =
            text.substring(0, start) + prefix + text.substring(start, end) + text.substring(end)
          ta.focus()
          ta.setSelectionRange(start + prefix.length, start + prefix.length + (end - start))
        } else {
          // Wrapping formatting like **, *, ~~, \`
          ta.value =
            text.substring(0, start) + md + text.substring(start, end) + md + text.substring(end)
          ta.focus()
          if (start === end) {
            ta.setSelectionRange(start + md.length, start + md.length)
          } else {
            ta.setSelectionRange(start + md.length, end + md.length)
          }
        }
        ta.dispatchEvent(new Event("input")) // Trigger update preview
      })
    })
  }

  bindToolbar(composeSection, textarea)

  const parseMarkdown = (text: string) => {
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>")
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    html = html.replace(/^## (.*?)$/gm, "<h3>$1</h3>")
    html = html.replace(/\n/g, "<br>")
    return html
  }

  const updatePreview = (ta: HTMLTextAreaElement, preview: HTMLElement) => {
    const text = ta.value.trim()
    if (text) {
      preview.style.display = "block"
      preview.innerHTML =
        `<div style="font-size:0.85em;opacity:0.7;margin-bottom:0.4rem;border-bottom:1px solid var(--lightgray);padding-bottom:0.2rem;">معاينة:</div>` +
        parseMarkdown(text)
    } else {
      preview.style.display = "none"
      preview.innerHTML = ""
    }
  }

  textarea.addEventListener("input", () => updatePreview(textarea, previewEl))

  try {
    // prettier-ignore
    // @ts-ignore
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js")
    // prettier-ignore
    // @ts-ignore
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js")
    // prettier-ignore
    // @ts-ignore
    const { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, arrayUnion, arrayRemove } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")

    const app = getApps().length === 0 ? initializeApp(config) : getApp()
    const auth = getAuth(app)
    const db = getFirestore(app)
    let currentUser: any = null

    const doLogin = (e: Event) => {
      e.preventDefault()
      signInWithPopup(auth, new GoogleAuthProvider()).catch((err: any) =>
        alert("تعذّر تسجيل الدخول: " + err.code),
      )
    }

    document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)

    let onAuthUpdateForReactions: () => void = () => {}

    const unsubAuth = onAuthStateChanged(auth, (user: any) => {
      currentUser = user
      if (user) {
        authSection.innerHTML = `
          <div class="fc-user-info">
            <img src="${user.photoURL || ""}" alt="${user.displayName}" class="fc-user-avatar" referrerpolicy="no-referrer"/>
            <span style="font-size:0.9rem;color:var(--dark);">${user.displayName}</span>
            <button type="button" id="fc-logout-btn" class="fc-logout-btn">تسجيل الخروج</button>
          </div>`
        document.getElementById("fc-logout-btn")?.addEventListener("click", (e) => {
          e.preventDefault()
          signOut(auth).catch(console.error)
        })
        composeSection.style.display = "flex"
      } else {
        authSection.innerHTML = `<button type="button" id="fc-login-btn" class="fc-login-btn">${loginSVG} تسجيل الدخول بـ Google</button>`
        document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)
        composeSection.style.display = "none"
      }
      onAuthUpdateForReactions()
    })
    window.addCleanup?.(() => unsubAuth())

    // ── Article Reactions ──────────────────────────────────────────────────

    const safeSlug = slug.replace(/\//g, "___")
    const articleReactionsRef = doc(db, "articleReactions", safeSlug)

    // Ensure document exists
    setDoc(articleReactionsRef, { init: true }, { merge: true }).catch(() => {})

    let latestReactionData: any = null
    let latestCommentsSnapshot: any = null

    // forward declarations
    let renderCommentsList: () => void = () => {}

    const renderReactions = () => {
      const data = latestReactionData
      if (!data) return // Not initialized yet
      const currentReactor = currentUser ? currentUser.uid : getAnonId()

      const reactionsHTML = EMOJIS.map((emoji) => {
        const reactors: string[] = data[emoji] || []
        const reacted = reactors.includes(currentReactor)
        return `<button type="button" class="fc-reaction-btn${reacted ? " reacted" : ""}" data-emoji="${emoji}" title="${emoji}">${emoji}${reactors.length > 0 ? `<span class="fc-reaction-count">${reactors.length}</span>` : ""}</button>`
      }).join("")

      reactionsEl.innerHTML = `<div class="fc-reactions-title">ما رأيك؟</div><div class="fc-reactions">${reactionsHTML}</div>`

      reactionsEl.querySelectorAll<HTMLButtonElement>(".fc-reaction-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!currentUser) {
            alert("عذراً، يجب تسجيل الدخول أولاً للتفاعل مع المقال.")
            return
          }
          const activeReactor = currentUser.uid
          const clickedEmoji = btn.dataset.emoji!
          const currentReactors: string[] = latestReactionData[clickedEmoji] || []

          try {
            const isAlreadyReacted = currentReactors.includes(activeReactor)
            const updates: any = {}

            // Remove user from ALL emojis to ensure only one reaction at a time
            EMOJIS.forEach((e) => {
              if ((latestReactionData[e] || []).includes(activeReactor)) {
                updates[e] = arrayRemove(activeReactor)
              }
            })

            // If they clicked a new emoji, add it
            if (!isAlreadyReacted) {
              updates[clickedEmoji] = arrayUnion(activeReactor)
            }

            if (Object.keys(updates).length > 0) {
              await setDoc(articleReactionsRef, updates, { merge: true })

              if (!isAlreadyReacted) {
                fetch("https://telegram-notify.hsmefh.workers.dev", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    actionType: "reaction",
                    emoji: clickedEmoji,
                    author: currentUser.displayName || "مجهول",
                    articleTitle: document.title,
                    articleUrl: window.location.href,
                  }),
                }).catch(() => {})
              }
            }
          } catch (err: any) {
            console.error("Reaction error:", err)
          }
        })
      })
    }

    const unsubReactions = onSnapshot(articleReactionsRef, (snap: any) => {
      latestReactionData = snap.exists() ? snap.data() : {}
      renderReactions()
    })

    onAuthUpdateForReactions = () => {
      renderReactions()
      renderCommentsList()
    }
    window.addCleanup?.(() => unsubReactions())

    // ── Helpers ────────────────────────────────────────────────────────────

    const toggleLike = async (commentId: string, snap: any) => {
      if (!currentUser) {
        alert("عذراً، يجب تسجيل الدخول للإعجاب بالتعليقات.")
        return
      }

      const activeReactor = currentUser.uid
      const ref = doc(db, "comments", commentId)
      const current = snap.likes || []
      if (current.includes(activeReactor)) {
        await updateDoc(ref, { likes: arrayRemove(activeReactor) })
      } else {
        await updateDoc(ref, { likes: arrayUnion(activeReactor) })

        fetch("https://telegram-notify.hsmefh.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "like",
            author: currentUser?.displayName || "زائر",
            content: snap.text,
            articleTitle: document.title,
            articleUrl: window.location.href,
          }),
        }).catch(() => {})
      }
    }

    const startEdit = (commentContent: HTMLElement, commentId: string, originalText: string) => {
      const textDiv = commentContent.querySelector(".fc-comment-text") as HTMLElement
      const actionsDiv = commentContent.querySelector(".fc-comment-actions") as HTMLElement
      if (!textDiv) return
      if (actionsDiv) actionsDiv.style.display = "none"

      const wrap = document.createElement("div")
      wrap.className = "fc-edit-wrap fc-editor-wrap"
      wrap.innerHTML = toolbarHTML

      const editTA = document.createElement("textarea")
      editTA.className = "fc-edit-textarea"
      editTA.value = originalText

      const editPreview = document.createElement("div")
      editPreview.className = "fc-comment-text"
      editPreview.style.cssText =
        "display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"

      editTA.addEventListener("input", () => updatePreview(editTA, editPreview))

      const editActions = document.createElement("div")
      editActions.className = "fc-edit-actions"

      const saveBtn = document.createElement("button")
      saveBtn.type = "button"
      saveBtn.className = "fc-submit-btn fc-save-edit-btn"
      saveBtn.textContent = "حفظ"

      const cancelBtn = document.createElement("button")
      cancelBtn.type = "button"
      cancelBtn.className = "fc-logout-btn"
      cancelBtn.textContent = "إلغاء"

      editActions.append(saveBtn, cancelBtn)
      wrap.append(editTA)

      const fullWrap = document.createElement("div")
      fullWrap.style.display = "flex"
      fullWrap.style.flexDirection = "column"
      fullWrap.style.gap = "0.5rem"
      fullWrap.append(wrap, editPreview, editActions)

      textDiv.innerHTML = ""
      textDiv.appendChild(fullWrap)
      editTA.focus()
      updatePreview(editTA, editPreview)

      bindToolbar(wrap, editTA)

      cancelBtn.addEventListener("click", () => {
        textDiv.innerHTML = parseMarkdown(originalText)
        if (actionsDiv) actionsDiv.style.display = "flex"
      })
      saveBtn.addEventListener("click", async () => {
        const newText = editTA.value.trim()
        if (!newText) return
        saveBtn.disabled = true
        saveBtn.textContent = "جاري الحفظ..."
        try {
          await updateDoc(doc(db, "comments", commentId), {
            text: newText,
            editedAt: serverTimestamp(),
          })
        } catch (err: any) {
          alert("فشل التعديل: " + err.message)
          saveBtn.disabled = false
          saveBtn.textContent = "حفظ"
        }
      })
    }

    const showReplyForm = (container: HTMLElement, parentId: string) => {
      const existing = container.querySelector(".fc-reply-form")
      if (existing) {
        existing.remove()
        return
      }

      const form = document.createElement("div")
      form.className = "fc-reply-form"
      form.innerHTML = `
        <div class="fc-editor-wrap">
          ${toolbarHTML}
          <textarea class="fc-reply-textarea" placeholder="اكتب ردك هنا..."></textarea>
        </div>
        <div class="fc-reply-preview fc-comment-text" style="display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"></div>
        <div class="fc-reply-actions">
          <button type="button" class="fc-submit-btn fc-reply-submit-btn">إرسال الرد</button>
          <button type="button" class="fc-logout-btn fc-reply-cancel-btn">إلغاء</button>
        </div>`
      container.appendChild(form)

      const ta = form.querySelector(".fc-reply-textarea") as HTMLTextAreaElement
      const rpPreview = form.querySelector(".fc-reply-preview") as HTMLElement
      ta.addEventListener("input", () => updatePreview(ta, rpPreview))

      ta.focus()
      bindToolbar(form.querySelector(".fc-editor-wrap") as HTMLElement, ta)

      form.querySelector(".fc-reply-cancel-btn")?.addEventListener("click", () => form.remove())
      form.querySelector(".fc-reply-submit-btn")?.addEventListener("click", async () => {
        const text = ta.value.trim()
        if (!text) return
        const btn = form.querySelector(".fc-reply-submit-btn") as HTMLButtonElement
        btn.disabled = true
        btn.textContent = "جاري الإرسال..."
        try {
          await addDoc(collection(db, "comments"), {
            slug,
            text,
            parentId,
            userId: currentUser?.uid || null,
            userName: currentUser?.displayName || "زائر",
            userPhoto: currentUser?.photoURL || "",
            createdAt: serverTimestamp(),
            likes: [],
          })

          // إشعار تيليجرام للردود
          fetch("https://telegram-notify.hsmefh.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              author: currentUser?.displayName || "زائر (رد)",
              content: text,
              articleTitle: document.title,
              articleUrl: window.location.href,
            }),
          }).catch((err) => console.error("Telegram notification failed", err))

          form.remove()
        } catch (err: any) {
          alert("خطأ في الإرسال: " + err.message)
          btn.disabled = false
          btn.textContent = "إرسال الرد"
        }
      })
    }

    const renderComment = (
      cdoc: any,
      currentReactor: string,
      isReply = false,
      depth = 0,
    ): HTMLElement => {
      const d = cdoc.data()
      const date = d.createdAt
        ? new Date(d.createdAt.toDate()).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "الآن"

      const isOwner = currentUser && currentUser.uid === d.userId
      const editedBadge = d.editedAt ? `<span class="fc-edited-badge">• تم التعديل</span>` : ""

      // Likes (thumbs up)
      const likes: string[] = d.likes || []
      const liked = likes.includes(currentReactor)
      const likeCount = likes.length

      const el = document.createElement("div")
      // Limit the reply indentation to avoid shrinking too much on deep levels
      const replyClass = isReply
        ? depth > 3
          ? "fc-comment fc-reply fc-reply-max-depth"
          : "fc-comment fc-reply"
        : "fc-comment"
      el.className = replyClass
      el.dataset.commentId = cdoc.id

      el.innerHTML = `
        <img src="${d.userPhoto || "https://www.gravatar.com/avatar/0?d=mp"}" alt="${d.userName}" class="fc-comment-avatar${isReply ? " fc-reply-avatar" : ""}" referrerpolicy="no-referrer"/>
        <div class="fc-comment-body">
          <div class="fc-comment-content">
            <div class="fc-comment-header">
              <span class="fc-comment-author">${d.userName || "زائر"}</span>
              <div class="fc-comment-meta">${editedBadge}<span class="fc-comment-date">${date}</span></div>
            </div>
            <div class="fc-comment-text">${parseMarkdown(d.text)}</div>
            <div class="fc-comment-actions" style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
              <button type="button" class="fc-like-btn${liked ? " liked" : ""}" data-id="${cdoc.id}" title="إعجاب">
                ${liked ? "👍" : "👍🏻"}<span class="fc-like-count">${likeCount > 0 ? " " + likeCount : ""}</span>
              </button>
              <button type="button" class="fc-reply-btn" data-id="${cdoc.id}">💬 <span>رد</span></button>
              ${isOwner ? `<button type="button" class="fc-edit-btn" data-id="${cdoc.id}">✏️ تعديل</button>` : ""}
              ${isOwner ? `<button type="button" class="fc-delete-btn" data-id="${cdoc.id}">🗑️ حذف</button>` : ""}
            </div>
          </div>
          <div class="fc-replies-area"></div>
        </div>`

      // Wire like
      el.querySelector(".fc-like-btn")?.addEventListener("click", async () => {
        const snap = cdoc.data()
        await toggleLike(cdoc.id, snap)
      })

      // Wire reply
      el.querySelector(".fc-reply-btn")?.addEventListener("click", () => {
        if (!currentUser) {
          alert("عذراً، يجب تسجيل الدخول للرد على التعليقات.")
          return
        }
        const area = el.querySelector(".fc-replies-area") as HTMLElement
        showReplyForm(area, cdoc.id)
      })

      // Wire edit / delete
      if (isOwner) {
        el.querySelector(".fc-edit-btn")?.addEventListener("click", () => {
          startEdit(el.querySelector(".fc-comment-content") as HTMLElement, cdoc.id, d.text)
        })
        el.querySelector(".fc-delete-btn")?.addEventListener("click", async () => {
          if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
            try {
              await deleteDoc(doc(db, "comments", cdoc.id))

              fetch("https://telegram-notify.hsmefh.workers.dev", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  actionType: "delete",
                  articleTitle: document.title,
                  articleUrl: window.location.href,
                }),
              }).catch(() => {})
            } catch (err: any) {
              alert("فشل الحذف: " + err.message)
            }
          }
        })
      }

      return el
    }

    // ── Submit top-level comment ──────────────────────────────────────────

    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      const text = textarea.value.trim()
      if (!text || !currentUser) return
      submitBtn.disabled = true
      submitBtn.textContent = "جاري الإرسال..."
      try {
        await addDoc(collection(db, "comments"), {
          slug,
          text,
          parentId: null,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          likes: [],
        })

        // إشعار تيليجرام
        fetch("https://telegram-notify.hsmefh.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author: currentUser.displayName || "زائر",
            content: text,
            articleTitle: document.title,
            articleUrl: window.location.href,
          }),
        }).catch((err) => console.error("Telegram notification failed", err))

        textarea.value = ""
        updatePreview(textarea, previewEl)
      } catch (err: any) {
        alert("خطأ في الإرسال: " + err.message)
      }
      submitBtn.disabled = false
      submitBtn.textContent = "إرسال التعليق"
    })

    // ── Real-time snapshot (all docs for this slug) ───────────────────────

    const q = query(
      collection(db, "comments"),
      where("slug", "==", slug),
      orderBy("createdAt", "asc"),
    )

    renderCommentsList = () => {
      if (!latestCommentsSnapshot) return
      const currentReactor = currentUser ? currentUser.uid : getAnonId()

      const topLevel: any[] = []
      const repliesMap = new Map<string, any[]>()

      latestCommentsSnapshot.forEach((cdoc: any) => {
        const d = cdoc.data()
        if (!d.parentId) topLevel.push(cdoc)
        else {
          if (!repliesMap.has(d.parentId)) repliesMap.set(d.parentId, [])
          repliesMap.get(d.parentId)!.push(cdoc)
        }
      })

      listEl.innerHTML = ""

      if (topLevel.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;color:var(--gray);padding:1rem 0;">لا توجد تعليقات حتى الآن. كُن أول من يعلق!</div>`
        return
      }

      const renderTree = (docs: any[], isNested: boolean, depth: number) => {
        const frag = document.createDocumentFragment()
        docs.forEach((doc) => {
          const el = renderComment(doc, currentReactor, isNested, depth)
          const area = el.querySelector(".fc-replies-area")
          const children = repliesMap.get(doc.id)
          if (children && children.length > 0 && area) {
            area.appendChild(renderTree(children, true, depth + 1))
          }
          frag.appendChild(el)
        })
        return frag
      }

      listEl.appendChild(renderTree([...topLevel].reverse(), false, 0))
    }

    const unsubSnap = onSnapshot(
      q,
      (snapshot: any) => {
        latestCommentsSnapshot = snapshot
        renderCommentsList()
      },
      (err: any) => {
        console.error("Firestore error:", err)
        listEl.innerHTML = `<div style="text-align:center;color:#e53935;padding:1rem 0;">خطأ في تحميل التعليقات (${err.code})</div>`
      },
    )

    window.addCleanup?.(() => unsubSnap())
  } catch (err: any) {
    console.error("Firebase init error:", err)
    container.innerHTML = `<div style="text-align:center;color:#e53935;">تعذر تحميل نظام التعليقات.</div>`
  }
})
