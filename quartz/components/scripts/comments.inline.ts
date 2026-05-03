document.addEventListener("nav", async () => {
  const container = document.querySelector(".firebase-comments") as HTMLElement
  if (!container) return
  if (container.dataset.initialized) return
  container.dataset.initialized = "true"

  const configStr = container.dataset.firebaseConfig
  if (!configStr) return
  const config = JSON.parse(configStr)
  const slug = container.dataset.slug || "unknown"

  container.innerHTML = `
    <div class="fc-header">
      <div class="fc-title">التعليقات</div>
      <div id="fc-auth-section">
        <button type="button" id="fc-login-btn" class="fc-login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-left:6px;flex-shrink:0;">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          تسجيل الدخول بـ Google
        </button>
      </div>
    </div>
    <div id="fc-compose-section" class="fc-compose" style="display:none;">
      <textarea id="fc-textarea" class="fc-textarea" placeholder="اكتب تعليقك هنا..."></textarea>
      <button type="button" id="fc-submit-btn" class="fc-submit-btn">إرسال التعليق</button>
    </div>
    <div id="fc-list" class="fc-list">
      <div class="fc-loading">جاري تحميل التعليقات...</div>
    </div>
  `

  const authSection    = document.getElementById("fc-auth-section")!
  const composeSection = document.getElementById("fc-compose-section")!
  const textarea       = document.getElementById("fc-textarea") as HTMLTextAreaElement
  const submitBtn      = document.getElementById("fc-submit-btn") as HTMLButtonElement
  const listEl         = document.getElementById("fc-list")!

  try {
    // @ts-ignore
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js")
    // @ts-ignore
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js")
    // @ts-ignore
    const { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")

    const app  = getApps().length === 0 ? initializeApp(config) : getApp()
    const auth = getAuth(app)
    const db   = getFirestore(app)
    let currentUser: any = null

    const loginSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-left:6px;flex-shrink:0;"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`

    const doLogin = (e: Event) => {
      e.preventDefault()
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider).catch((err: any) => {
        console.error("Login error:", err.code, err.message)
        alert("تعذّر تسجيل الدخول: " + err.code)
      })
    }

    // Wire up the initial login button
    document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      currentUser = user
      if (user) {
        authSection.innerHTML = `
          <div class="fc-user-info">
            <img src="${user.photoURL || ''}" alt="${user.displayName}" class="fc-user-avatar" referrerpolicy="no-referrer" />
            <span style="font-size:0.9rem;color:var(--dark);">${user.displayName}</span>
            <button type="button" id="fc-logout-btn" class="fc-logout-btn">تسجيل الخروج</button>
          </div>
        `
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
    })

    window.addCleanup?.(() => unsubscribeAuth())

    // Submit handler
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
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL || "",
          createdAt: serverTimestamp(),
        })
        textarea.value = ""
      } catch (err: any) {
        console.error("addDoc error:", err)
        alert("خطأ في الإرسال: " + err.message)
      }
      submitBtn.disabled = false
      submitBtn.textContent = "إرسال التعليق"
    })

    // Comments listener
    const q = query(
      collection(db, "comments"),
      where("slug", "==", slug),
      orderBy("createdAt", "desc"),
    )

    const unsubSnap = onSnapshot(
      q,
      (snapshot: any) => {
        listEl.innerHTML = ""
        if (snapshot.empty) {
          listEl.innerHTML = `<div style="text-align:center;color:var(--gray);padding:1rem 0;">لا توجد تعليقات حتى الآن. كُن أول من يعلق!</div>`
          return
        }
        snapshot.forEach((cdoc: any) => {
          const d    = cdoc.data()
          const date = d.createdAt
            ? new Date(d.createdAt.toDate()).toLocaleDateString("ar-SA", {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })
            : "الآن"
          const isOwner  = currentUser && currentUser.uid === d.userId
          const delBtn   = isOwner ? `<button type="button" class="fc-delete-btn" data-id="${cdoc.id}">حذف التعليق</button>` : ""
          const el       = document.createElement("div")
          el.className   = "fc-comment"
          el.innerHTML   = `
            <img src="${d.userPhoto || "https://www.gravatar.com/avatar/0?d=mp"}" alt="${d.userName}" class="fc-comment-avatar" referrerpolicy="no-referrer"/>
            <div class="fc-comment-content">
              <div class="fc-comment-header">
                <span class="fc-comment-author">${d.userName || "زائر"}</span>
                <span class="fc-comment-date">${date}</span>
              </div>
              <div class="fc-comment-text">${d.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
              ${delBtn}
            </div>
          `
          if (isOwner) {
            el.querySelector(".fc-delete-btn")?.addEventListener("click", async (e) => {
              e.preventDefault()
              if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
                try { await deleteDoc(doc(db, "comments", cdoc.id)) }
                catch (err: any) { alert("فشل الحذف: " + err.message) }
              }
            })
          }
          listEl.appendChild(el)
        })
      },
      (err: any) => {
        console.error("Firestore snapshot error:", err)
        listEl.innerHTML = `<div style="text-align:center;color:#e53935;padding:1rem 0;">خطأ في تحميل التعليقات (${err.code})</div>`
      },
    )

    window.addCleanup?.(() => unsubSnap())

  } catch (err: any) {
    console.error("Firebase init error:", err)
    container.innerHTML = `<div style="text-align:center;color:#e53935;">تعذر تحميل نظام التعليقات.</div>`
  }
})
