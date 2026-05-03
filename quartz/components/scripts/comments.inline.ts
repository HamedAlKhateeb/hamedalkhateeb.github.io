document.addEventListener("nav", async () => {
  const container = document.querySelector(".firebase-comments") as HTMLElement
  if (!container) return
  if (container.dataset.initialized) return
  container.dataset.initialized = "true"

  const configStr = container.dataset.firebaseConfig
  if (!configStr) return
  const config = JSON.parse(configStr)
  const slug = container.dataset.slug || "unknown"

  const EMOJIS = ["👍", "❤️", "🎉", "😄", "🤔"]

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
      <button type="button" id="fc-submit-btn" class="fc-submit-btn">إرسال التعليق</button>
    </div>
    <div id="fc-list" class="fc-list"><div class="fc-loading">جاري تحميل التعليقات...</div></div>
  `

  const authSection    = document.getElementById("fc-auth-section")!
  const composeSection = document.getElementById("fc-compose-section")!
  const textarea       = document.getElementById("fc-textarea") as HTMLTextAreaElement
  const submitBtn      = document.getElementById("fc-submit-btn") as HTMLButtonElement
  const listEl         = document.getElementById("fc-list")!
  const reactionsEl    = document.getElementById("fc-article-reactions")!

  // Helper to insert markdown at cursor
  const bindToolbar = (wrap: HTMLElement, ta: HTMLTextAreaElement) => {
    wrap.querySelectorAll(".fc-toolbar button").forEach(btn => {
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
          const needsNewline = before.length > 0 && !before.endsWith("n")
          const prefix = needsNewline ? "n## " : "## "
          ta.value = text.substring(0, start) + prefix + text.substring(start, end) + text.substring(end)
          ta.focus()
          ta.setSelectionRange(start + prefix.length, start + prefix.length + (end - start))
        } else {
          // Wrapping formatting like **, *, ~~, \`
          ta.value = text.substring(0, start) + md + text.substring(start, end) + md + text.substring(end)
          ta.focus()
          if (start === end) {
            ta.setSelectionRange(start + md.length, start + md.length)
          } else {
            ta.setSelectionRange(start + md.length, end + md.length)
          }
        }
      })
    })
  }

  bindToolbar(composeSection, textarea)

  const parseMarkdown = (text: string) => {
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    html = html.replace(/**(.*?)**/g, '<strong>$1</strong>')
    html = html.replace(/*(.*?)*/g, '<em>$1</em>')
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
    html = html.replace(/\`([^`]+)\`/g, '<code>$1</code>')
    html = html.replace(/[(.*?)]((.*?))/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>')
    html = html.replace(/n/g, '<br>')
    return html
  }

  try {
    // @ts-ignore
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js")
    // @ts-ignore
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js")
    // @ts-ignore
    const { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, arrayUnion, arrayRemove } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")

    const app  = getApps().length === 0 ? initializeApp(config) : getApp()
    const auth = getAuth(app)
    const db   = getFirestore(app)
    let currentUser: any = null

    const reactorId = getAnonId() // Default to anon, override with uid if logged in

    const doLogin = (e: Event) => {
      e.preventDefault()
      signInWithPopup(auth, new GoogleAuthProvider()).catch((err: any) => alert("تعذّر تسجيل الدخول: " + err.code))
    }

    document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)

    const unsubAuth = onAuthStateChanged(auth, (user: any) => {
      currentUser = user
      if (user) {
        authSection.innerHTML = `
          <div class="fc-user-info">
            <img src="${user.photoURL || ""}" alt="${user.displayName}" class="fc-user-avatar" referrerpolicy="no-referrer"/>
            <span style="font-size:0.9rem;color:var(--dark);">${user.displayName}</span>
            <button type="button" id="fc-logout-btn" class="fc-logout-btn">تسجيل الخروج</button>
          </div>`
        document.getElementById("fc-logout-btn")?.addEventListener("click", (e) => { e.preventDefault(); signOut(auth).catch(console.error) })
        composeSection.style.display = "flex"
      } else {
        authSection.innerHTML = `<button type="button" id="fc-login-btn" class="fc-login-btn">${loginSVG} تسجيل الدخول بـ Google</button>`
        document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)
        composeSection.style.display = "none"
      }
    })
    window.addCleanup?.(() => unsubAuth())

    // ── Article Reactions ──────────────────────────────────────────────────

    const safeSlug = slug.replace(/\//g, "___")
    const articleReactionsRef = doc(db, "articleReactions", safeSlug)
    
    // Ensure document exists
    setDoc(articleReactionsRef, { init: true }, { merge: true }).catch(() => {})

    const unsubReactions = onSnapshot(articleReactionsRef, (snap: any) => {
      const data = snap.exists() ? snap.data() : {}
      const currentReactor = currentUser ? currentUser.uid : getAnonId()
      
      const reactionsHTML = EMOJIS.map((emoji) => {
        const reactors: string[] = data[emoji] || []
        const reacted = reactors.includes(currentReactor)
        return `<button type="button" class="fc-reaction-btn${reacted ? " reacted" : ""}" data-emoji="${emoji}" title="${emoji}">${emoji}${reactors.length > 0 ? `<span class="fc-reaction-count">${reactors.length}</span>` : ""}</button>`
      }).join("")

      reactionsEl.innerHTML = `<div class="fc-reactions-title">ما رأيك في هذا المقال؟</div><div class="fc-reactions">${reactionsHTML}</div>`
      
      reactionsEl.querySelectorAll<HTMLButtonElement>(".fc-reaction-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const clickedEmoji = btn.dataset.emoji!
          const currentReactors: string[] = data[clickedEmoji] || []
          
          try {
            const isAlreadyReacted = currentReactors.includes(currentReactor)
            const updates: any = {}
            
            // Remove user from ALL emojis to ensure only one reaction at a time
            EMOJIS.forEach(e => {
              if ((data[e] || []).includes(currentReactor)) {
                updates[e] = arrayRemove(currentReactor)
              }
            })
            
            // If they clicked a new emoji, add it
            if (!isAlreadyReacted) {
              updates[clickedEmoji] = arrayUnion(currentReactor)
            }
            
            if (Object.keys(updates).length > 0) {
              await setDoc(articleReactionsRef, updates, { merge: true })
            }
          } catch (err: any) {
            console.error("Reaction error:", err)
          }
        })
      })
    })
    window.addCleanup?.(() => unsubReactions())

    // ── Helpers ────────────────────────────────────────────────────────────

    const toggleLike = async (commentId: string, currentReactor: string, current: string[]) => {
      const ref = doc(db, "comments", commentId)
      if (current.includes(currentReactor)) await updateDoc(ref, { likes: arrayRemove(currentReactor) })
      else await updateDoc(ref, { likes: arrayUnion(currentReactor) })
    }

    const startEdit = (commentContent: HTMLElement, commentId: string, originalText: string) => {
      const textDiv    = commentContent.querySelector(".fc-comment-text") as HTMLElement
      const actionsDiv = commentContent.querySelector(".fc-comment-actions") as HTMLElement
      if (!textDiv) return
      if (actionsDiv) actionsDiv.style.display = "none"

      const wrap = document.createElement("div")
      wrap.className = "fc-edit-wrap fc-editor-wrap"
      wrap.innerHTML = toolbarHTML

      const editTA = document.createElement("textarea")
      editTA.className = "fc-edit-textarea"
      editTA.value = originalText

      const editActions = document.createElement("div")
      editActions.className = "fc-edit-actions"

      const saveBtn = document.createElement("button")
      saveBtn.type = "button"; saveBtn.className = "fc-submit-btn fc-save-edit-btn"; saveBtn.textContent = "حفظ"

      const cancelBtn = document.createElement("button")
      cancelBtn.type = "button"; cancelBtn.className = "fc-logout-btn"; cancelBtn.textContent = "إلغاء"

      editActions.append(saveBtn, cancelBtn)
      wrap.append(editTA)
      
      const fullWrap = document.createElement("div")
      fullWrap.style.display = "flex"
      fullWrap.style.flexDirection = "column"
      fullWrap.style.gap = "0.5rem"
      fullWrap.append(wrap, editActions)

      textDiv.innerHTML = ""
      textDiv.appendChild(fullWrap)
      editTA.focus()
      
      bindToolbar(wrap, editTA)

      cancelBtn.addEventListener("click", () => {
        textDiv.innerHTML = parseMarkdown(originalText)
        if (actionsDiv) actionsDiv.style.display = "flex"
      })
      saveBtn.addEventListener("click", async () => {
        const newText = editTA.value.trim()
        if (!newText) return
        saveBtn.disabled = true; saveBtn.textContent = "جاري الحفظ..."
        try {
          await updateDoc(doc(db, "comments", commentId), { text: newText, editedAt: serverTimestamp() })
        } catch (err: any) {
          alert("فشل التعديل: " + err.message)
          saveBtn.disabled = false; saveBtn.textContent = "حفظ"
        }
      })
    }

    const showReplyForm = (container: HTMLElement, parentId: string) => {
      const existing = container.querySelector(".fc-reply-form")
      if (existing) { existing.remove(); return }

      const form = document.createElement("div")
      form.className = "fc-reply-form"
      form.innerHTML = `
        <div class="fc-editor-wrap">
          ${toolbarHTML}
          <textarea class="fc-reply-textarea" placeholder="اكتب ردك هنا..."></textarea>
        </div>
        <div class="fc-reply-actions">
          <button type="button" class="fc-submit-btn fc-reply-submit-btn">إرسال الرد</button>
          <button type="button" class="fc-logout-btn fc-reply-cancel-btn">إلغاء</button>
        </div>`
      container.appendChild(form)
      
      const ta = form.querySelector(".fc-reply-textarea") as HTMLTextAreaElement
      ta.focus()
      bindToolbar(form.querySelector(".fc-editor-wrap") as HTMLElement, ta)

      form.querySelector(".fc-reply-cancel-btn")?.addEventListener("click", () => form.remove())
      form.querySelector(".fc-reply-submit-btn")?.addEventListener("click", async () => {
        const text = ta.value.trim()
        if (!text) return
        const btn = form.querySelector(".fc-reply-submit-btn") as HTMLButtonElement
        btn.disabled = true; btn.textContent = "جاري الإرسال..."
        try {
          await addDoc(collection(db, "comments"), {
            slug,
            text,
            parentId,
            userId:    currentUser?.uid    || null,
            userName:  currentUser?.displayName || "زائر",
            userPhoto: currentUser?.photoURL    || "",
            createdAt: serverTimestamp(),
            likes:     []
          })
          form.remove()
        } catch (err: any) {
          alert("خطأ في الإرسال: " + err.message)
          btn.disabled = false; btn.textContent = "إرسال الرد"
        }
      })
    }

    const renderComment = (cdoc: any, currentReactor: string, isReply = false): HTMLElement => {
      const d = cdoc.data()
      const date = d.createdAt
        ? new Date(d.createdAt.toDate()).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : "الآن"

      const isOwner     = currentUser && currentUser.uid === d.userId
      const editedBadge = d.editedAt ? `<span class="fc-edited-badge">• تم التعديل</span>` : ""

      // Likes (thumbs up)
      const likes: string[] = d.likes || []
      const liked     = likes.includes(currentReactor)
      const likeCount = likes.length

      const el = document.createElement("div")
      el.className = isReply ? "fc-comment fc-reply" : "fc-comment"
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
              ${!isReply ? `<button type="button" class="fc-reply-btn" data-id="${cdoc.id}">💬 <span>رد</span></button>` : ""}
              ${isOwner ? `<button type="button" class="fc-edit-btn" data-id="${cdoc.id}">✏️ تعديل</button>` : ""}
              ${isOwner ? `<button type="button" class="fc-delete-btn" data-id="${cdoc.id}">🗑️ حذف</button>` : ""}
            </div>
          </div>
          ${!isReply ? `<div class="fc-replies-area"></div>` : ""}
        </div>`

      // Wire like
      el.querySelector(".fc-like-btn")?.addEventListener("click", async () => {
        const snap = cdoc.data()
        await toggleLike(cdoc.id, currentReactor, snap.likes || [])
      })

      // Wire reply
      if (!isReply) {
        el.querySelector(".fc-reply-btn")?.addEventListener("click", () => {
          const area = el.querySelector(".fc-replies-area") as HTMLElement
          showReplyForm(area, cdoc.id)
        })
      }

      // Wire edit / delete
      if (isOwner) {
        el.querySelector(".fc-edit-btn")?.addEventListener("click", () => {
          startEdit(el.querySelector(".fc-comment-content") as HTMLElement, cdoc.id, d.text)
        })
        el.querySelector(".fc-delete-btn")?.addEventListener("click", async () => {
          if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
            try { await deleteDoc(doc(db, "comments", cdoc.id)) }
            catch (err: any) { alert("فشل الحذف: " + err.message) }
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
      submitBtn.disabled = true; submitBtn.textContent = "جاري الإرسال..."
      try {
        await addDoc(collection(db, "comments"), {
          slug, text,
          parentId:  null,
          userId:    currentUser.uid,
          userName:  currentUser.displayName,
          userPhoto: currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          likes:     []
        })
        textarea.value = ""
      } catch (err: any) {
        alert("خطأ في الإرسال: " + err.message)
      }
      submitBtn.disabled = false; submitBtn.textContent = "إرسال التعليق"
    })

    // ── Real-time snapshot (all docs for this slug) ───────────────────────

    const q = query(
      collection(db, "comments"),
      where("slug", "==", slug),
      orderBy("createdAt", "asc"),
    )

    const unsubSnap = onSnapshot(q,
      (snapshot: any) => {
        const currentReactor = currentUser ? currentUser.uid : getAnonId()

        const topLevel: any[] = []
        const repliesMap = new Map<string, any[]>()

        snapshot.forEach((cdoc: any) => {
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

        ;[...topLevel].reverse().forEach((cdoc: any) => {
          const el = renderComment(cdoc, currentReactor, false)
          const repliesContainer = el.querySelector(".fc-replies-area") as HTMLElement
          const replies = repliesMap.get(cdoc.id) || []
          replies.forEach((replyDoc: any) => {
            repliesContainer.appendChild(renderComment(replyDoc, currentReactor, true))
          })
          listEl.appendChild(el)
        })
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
