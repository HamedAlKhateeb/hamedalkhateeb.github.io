document.addEventListener("nav", async () => {
  const container = document.querySelector(".firebase-comments") as HTMLElement
  if (!container) return

  // Prevent re-initialization on SPA navigation
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
        <button id="fc-login-btn" class="fc-login-btn">تسجيل الدخول باستخدام Google</button>
      </div>
    </div>
    <div id="fc-compose-section" class="fc-compose" style="display: none;">
      <textarea id="fc-textarea" class="fc-textarea" placeholder="اكتب تعليقك هنا..."></textarea>
      <button id="fc-submit-btn" class="fc-submit-btn">إرسال التعليق</button>
    </div>
    <div id="fc-list" class="fc-list">
      <div class="fc-loading">جاري تحميل التعليقات...</div>
    </div>
  `

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js")
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js")
    const { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")

    // @ts-ignore
    const app = window.firebaseApp || initializeApp(config)
    // @ts-ignore
    window.firebaseApp = app

    const auth = getAuth(app)
    const db = getFirestore(app)
    let currentUser: any = null

    const authSection = document.getElementById("fc-auth-section")!
    const composeSection = document.getElementById("fc-compose-section")!
    const loginBtn = document.getElementById("fc-login-btn")!
    const textarea = document.getElementById("fc-textarea") as HTMLTextAreaElement
    const submitBtn = document.getElementById("fc-submit-btn") as HTMLButtonElement
    const listContainer = document.getElementById("fc-list")!

    // Auth Handlers
    loginBtn.addEventListener("click", () => {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider).catch(err => {
        console.error("Login failed", err)
        alert("حدث خطأ أثناء تسجيل الدخول")
      })
    })

    const handleLogout = () => {
      signOut(auth).catch(console.error)
    }

    onAuthStateChanged(auth, (user) => {
      currentUser = user
      if (user) {
        authSection.innerHTML = `
          <div class="fc-user-info">
            <img src="${user.photoURL}" alt="${user.displayName}" class="fc-user-avatar" referrerpolicy="no-referrer" />
            <span style="font-size: 0.9rem; color: var(--dark);">${user.displayName}</span>
            <button id="fc-logout-btn" class="fc-logout-btn">تسجيل الخروج</button>
          </div>
        `
        document.getElementById("fc-logout-btn")?.addEventListener("click", handleLogout)
        composeSection.style.display = "flex"
      } else {
        authSection.innerHTML = `<button id="fc-login-btn" class="fc-login-btn">تسجيل الدخول باستخدام Google</button>`
        document.getElementById("fc-login-btn")?.addEventListener("click", () => {
          const provider = new GoogleAuthProvider()
          signInWithPopup(auth, provider).catch(console.error)
        })
        composeSection.style.display = "none"
      }
    })

    // Submit Comment Handler
    submitBtn.addEventListener("click", async () => {
      const text = textarea.value.trim()
      if (!text || !currentUser) return

      submitBtn.disabled = true
      try {
        await addDoc(collection(db, "comments"), {
          slug: slug,
          text: text,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL,
          createdAt: serverTimestamp()
        })
        textarea.value = ""
      } catch (err) {
        console.error("Error adding comment", err)
        alert("حدث خطأ أثناء إرسال التعليق. تأكد من تفعيل Firestore واعداد قواعد الحماية (Rules).")
      }
      submitBtn.disabled = false
    })

    // Fetch and Display Comments
    const q = query(
      collection(db, "comments"),
      where("slug", "==", slug),
      orderBy("createdAt", "desc")
    )

    onSnapshot(q, (snapshot) => {
      listContainer.innerHTML = ""
      if (snapshot.empty) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--gray); padding: 1rem 0;">لا توجد تعليقات حتى الآن. كُن أول من يعلق!</div>`
        return
      }

      snapshot.forEach((commentDoc) => {
        const data = commentDoc.data()
        const date = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "الآن"
        
        const commentEl = document.createElement("div")
        commentEl.className = "fc-comment"
        
        const isOwner = currentUser && currentUser.uid === data.userId
        const deleteHtml = isOwner ? `<button class="fc-delete-btn" data-id="${commentDoc.id}">حذف التعليق</button>` : ""

        commentEl.innerHTML = `
          <img src="${data.userPhoto || 'https://www.gravatar.com/avatar/0?d=mp'}" alt="${data.userName}" class="fc-comment-avatar" referrerpolicy="no-referrer" />
          <div class="fc-comment-content">
            <div class="fc-comment-header">
              <span class="fc-comment-author">${data.userName || 'زائر'}</span>
              <span class="fc-comment-date">${date}</span>
            </div>
            <div class="fc-comment-text">${data.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            ${deleteHtml}
          </div>
        `

        if (isOwner) {
          const deleteBtn = commentEl.querySelector(".fc-delete-btn")
          deleteBtn?.addEventListener("click", async () => {
            if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
              try {
                await deleteDoc(doc(db, "comments", commentDoc.id))
              } catch (err) {
                console.error("Error deleting comment", err)
                alert("لم يتم الحذف، تأكد من صلاحياتك.")
              }
            }
          })
        }

        listContainer.appendChild(commentEl)
      })
    }, (error) => {
      console.error("Error fetching comments:", error)
      listContainer.innerHTML = `<div style="text-align: center; color: #e53935; padding: 1rem 0;">حدث خطأ في تحميل التعليقات. (${error.code})<br>تأكد من إعداد قواعد Firestore الصحيحة وإنشاء الـ Index.</div>`
    })

  } catch (error) {
    console.error("Firebase initialization failed:", error)
    container.innerHTML = `<div style="text-align: center; color: #e53935;">تعذر تحميل نظام التعليقات. تأكد من اتصالك بالإنترنت.</div>`
  }
})
