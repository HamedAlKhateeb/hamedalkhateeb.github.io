document.addEventListener("nav", async () => {
  const container = document.querySelector(".firebase-comments") as HTMLElement
  if (!container) return
  if (container.dataset.initialized) return
  container.dataset.initialized = "true"

  const configStr = container.dataset.firebaseConfig
  if (!configStr) return
  const config = JSON.parse(configStr)
  const slug = container.dataset.slug || "unknown"
  // لغة الواجهة من الخادم (data-lang) مع بديل تلقائي من اتجاه الصفحة
  const lang: "ar" | "en" =
    container.dataset.lang === "en" ||
    (container.dataset.lang !== "ar" && document.documentElement.lang === "en")
      ? "en"
      : "ar"

  const STRINGS = {
    ar: {
      bold: "عريض (Bold)",
      italic: "مائل (Italic)",
      strike: "شطب (Strikethrough)",
      heading: "عنوان (Heading)",
      code: "كود (Code)",
      link: "رابط (Link)",
      linkText: "النص هنا",
      linkUrl: "الرابط_هنا",
      shareTitle: "شارك المقال",
      commentsTitle: "التعليقات",
      tabGuest: "✍️ كزائر",
      notifyText: "🔔 فعّل الإشعارات لتُنبَّه بالتعليقات الجديدة",
      notifyBtn: "تفعيل",
      loginGoogle: "تسجيل الدخول بـ Google",
      logout: "تسجيل الخروج",
      loginFail: "تعذّر تسجيل الدخول: ",
      commentPh: "اكتب تعليقك هنا...",
      submitComment: "إرسال التعليق",
      replyPh: "اكتب ردك هنا...",
      replySubmit: "إرسال الرد",
      replyEmpty: "يرجى كتابة ردك أولاً.",
      commentEmpty: "يرجى كتابة تعليقك.",
      guestName: "الاسم *",
      guestEmail: "البريد الإلكتروني *",
      guestEmailInvalid: "البريد الإلكتروني غير صحيح.",
      guestWebsite: "الموقع الإلكتروني (اختياري)",
      saveInfo: "حفظ بياناتي للمرة القادمة",
      nameRequired: "الاسم مطلوب.",
      emailRequired: "البريد الإلكتروني مطلوب.",
      loading: "جاري تحميل التعليقات...",
      emptyList: "لا توجد تعليقات حتى الآن. كُن أول من يعلق!",
      preview: "معاينة:",
      reactionsTitle: "ما رأيك؟",
      reactLogin: "عذراً، يجب تسجيل الدخول بـ Google للتفاعل مع المقال.",
      likeLogin: "عذراً، يجب تسجيل الدخول للإعجاب بالتعليقات.",
      likeTitle: "إعجاب",
      replyBtn: "رد",
      editBtn: "✏️ تعديل",
      deleteBtn: "🗑️ حذف",
      banBtn: "🚫 حظر",
      unbanBtn: "✅ رفع الحظر",
      banBtnTitle: "حظر هذا المستخدم",
      unbanBtnTitle: "رفع الحظر عن هذا المستخدم",
      save: "حفظ",
      cancel: "إلغاء",
      saving: "جاري الحفظ...",
      sending: "جاري الإرسال...",
      sendFail: "خطأ في الإرسال: ",
      editFail: "فشل التعديل: ",
      deleteConfirm: "هل أنت متأكد من حذف هذا التعليق؟",
      deleteFail: "فشل الحذف: ",
      banConfirm: (n: string) => `هل أنت متأكد من حظر "${n}"؟ لن يتمكن من التعليق بعد الآن.`,
      bannedOk: (n: string) => `تم حظر "${n}" بنجاح.`,
      banFail: "فشل الحظر: ",
      unbanConfirm: (n: string) => `هل تريد رفع الحظر عن "${n}"؟`,
      unbannedOk: (n: string) => `تم رفع الحظر عن "${n}".`,
      unbanFail: "فشل رفع الحظر: ",
      bannedMsg: "عذراً، لقد تم حظرك من التعليق على هذه المدونة.",
      now: "الآن",
      edited: "• تم التعديل",
      visitor: "زائر",
      anonymous: "مجهول",
      guestBadge: "زائر",
      loadFail: (c: string) => `خطأ في تحميل التعليقات (${c})`,
      initFail: "تعذر تحميل نظام التعليقات.",
      notifTitle: (t: string) => `💬 تعليق جديد على "${t}"`,
      notifBody: "اضغط للاطلاع على التعليقات الجديدة",
      dateLocale: "ar-SA",
    },
    en: {
      bold: "Bold",
      italic: "Italic",
      strike: "Strikethrough",
      heading: "Heading",
      code: "Code",
      link: "Link",
      linkText: "text here",
      linkUrl: "url_here",
      shareTitle: "Share this article",
      commentsTitle: "Comments",
      tabGuest: "✍️ As guest",
      notifyText: "🔔 Enable notifications for new comments",
      notifyBtn: "Enable",
      loginGoogle: "Sign in with Google",
      logout: "Sign out",
      loginFail: "Sign-in failed: ",
      commentPh: "Write your comment...",
      submitComment: "Post comment",
      replyPh: "Write your reply...",
      replySubmit: "Post reply",
      replyEmpty: "Please write your reply first.",
      commentEmpty: "Please write your comment.",
      guestName: "Name *",
      guestEmail: "Email *",
      guestEmailInvalid: "Invalid email address.",
      guestWebsite: "Website (optional)",
      saveInfo: "Remember me next time",
      nameRequired: "Name is required.",
      emailRequired: "Email is required.",
      loading: "Loading comments...",
      emptyList: "No comments yet. Be the first to comment!",
      preview: "Preview:",
      reactionsTitle: "What do you think?",
      reactLogin: "Please sign in with Google to react to the article.",
      likeLogin: "Please sign in to like comments.",
      likeTitle: "Like",
      replyBtn: "Reply",
      editBtn: "✏️ Edit",
      deleteBtn: "🗑️ Delete",
      banBtn: "🚫 Ban",
      unbanBtn: "✅ Unban",
      banBtnTitle: "Ban this user",
      unbanBtnTitle: "Unban this user",
      save: "Save",
      cancel: "Cancel",
      saving: "Saving...",
      sending: "Sending...",
      sendFail: "Send failed: ",
      editFail: "Edit failed: ",
      deleteConfirm: "Are you sure you want to delete this comment?",
      deleteFail: "Delete failed: ",
      banConfirm: (n: string) => `Are you sure you want to ban "${n}"? They won't be able to comment anymore.`,
      bannedOk: (n: string) => `"${n}" has been banned.`,
      banFail: "Ban failed: ",
      unbanConfirm: (n: string) => `Unban "${n}"?`,
      unbannedOk: (n: string) => `"${n}" has been unbanned.`,
      unbanFail: "Unban failed: ",
      bannedMsg: "Sorry, you have been banned from commenting on this blog.",
      now: "Just now",
      edited: "• Edited",
      visitor: "Guest",
      anonymous: "Anonymous",
      guestBadge: "Guest",
      loadFail: (c: string) => `Failed to load comments (${c})`,
      initFail: "Could not load the comments system.",
      notifTitle: (t: string) => `💬 New comment on "${t}"`,
      notifBody: "Click to view the new comments",
      dateLocale: "en-US",
    },
  } as const
  const T = STRINGS[lang]

  const EMOJIS = ["👍", "❤️", "🎉", "😄", "🤔", "😢"]
  const GUEST_STORAGE_KEY = "fc-guest-info"
  const NOTIF_COUNT_KEY = "fc-notif-count-" + slug
  const ADMIN_EMAIL = "hsmefh@gmail.com"

  // ── Gravatar (SHA-256 via Web Crypto) ──────────────────────────────────
  const gravatarUrl = async (email: string): Promise<string> => {
    try {
      const clean = email.trim().toLowerCase()
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clean))
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      return `https://www.gravatar.com/avatar/${hash}?d=mp&s=80`
    } catch {
      return "https://www.gravatar.com/avatar/0?d=mp"
    }
  }

  // ── Anon ID ────────────────────────────────────────────────────────────
  const getAnonId = (): string => {
    let id = localStorage.getItem("fc-anon-id")
    if (!id) {
      id = "anon_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
      localStorage.setItem("fc-anon-id", id)
    }
    return id
  }

  // ── Guest info persistence ─────────────────────────────────────────────
  const loadGuestInfo = (): { name: string; email: string; website: string } | null => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || "null")
    } catch {
      return null
    }
  }
  const saveGuestInfo = (name: string, email: string, website: string) => {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ name, email, website }))
  }

  // ── SVG / HTML constants ───────────────────────────────────────────────
  const loginSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;flex-shrink:0;"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`

  const toolbarHTML = `
    <div class="fc-toolbar">
      <button type="button" data-md="**" title="${T.bold}"><b>B</b></button>
      <button type="button" data-md="*" title="${T.italic}"><i>I</i></button>
      <button type="button" data-md="~~" title="${T.strike}"><strike>S</strike></button>
      <button type="button" data-md="## " title="${T.heading}"><b>H</b></button>
      <button type="button" data-md="\`" title="${T.code}"><code>&lt;/&gt;</code></button>
      <button type="button" data-md="[]()" title="${T.link}">🔗</button>
    </div>
  `

  // ── Main HTML ──────────────────────────────────────────────────────────
  container.innerHTML = `
    <div id="fc-article-reactions" class="fc-article-reactions"></div>

    <div class="fc-share-wrapper">
      <div class="fc-share-title">${T.shareTitle}</div>
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
      <div class="fc-title">${T.commentsTitle}</div>
      <div class="fc-auth-tabs" id="fc-auth-tabs">
        <button type="button" id="fc-tab-google-btn" class="fc-tab-btn fc-tab-active">${loginSVG}&nbsp;Google</button>
        <button type="button" id="fc-tab-guest-btn" class="fc-tab-btn">${T.tabGuest}</button>
      </div>
    </div>

    <div id="fc-notify-bar" class="fc-notify-bar" style="display:none;">
      <span class="fc-notify-text">${T.notifyText}</span>
      <button type="button" id="fc-notify-btn" class="fc-notify-btn">${T.notifyBtn}</button>
    </div>

    <!-- Google: login area / user info -->
    <div id="fc-google-login-area" class="fc-google-login-area">
      <button type="button" id="fc-login-btn" class="fc-login-btn">${loginSVG} ${T.loginGoogle}</button>
    </div>

    <!-- Google compose -->
    <div id="fc-compose-section" class="fc-compose" style="display:none;">
      <div class="fc-editor-wrap">
        ${toolbarHTML}
        <textarea id="fc-textarea" class="fc-textarea" placeholder="${T.commentPh}"></textarea>
      </div>
      <div id="fc-preview" class="fc-comment-text" style="display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"></div>
      <button type="button" id="fc-submit-btn" class="fc-submit-btn">${T.submitComment}</button>
    </div>

    <!-- Guest compose -->
    <div id="fc-guest-compose" class="fc-compose" style="display:none;">
      <div class="fc-guest-form">
        <div class="fc-guest-row">
          <input id="fc-guest-name"    type="text"  class="fc-guest-input" placeholder="${T.guestName}"                      autocomplete="name"  />
          <input id="fc-guest-email"   type="email" class="fc-guest-input" placeholder="${T.guestEmail}"           autocomplete="email" />
        </div>
        <input id="fc-guest-website" type="url"   class="fc-guest-input fc-guest-input-full" placeholder="${T.guestWebsite}" autocomplete="url" />
        <label class="fc-save-label">
          <input type="checkbox" id="fc-save-info" class="fc-save-checkbox" />
          <span>${T.saveInfo}</span>
        </label>
      </div>
      <div class="fc-editor-wrap">
        ${toolbarHTML}
        <textarea id="fc-guest-textarea" class="fc-textarea" placeholder="${T.commentPh}"></textarea>
      </div>
      <div id="fc-guest-preview" class="fc-comment-text" style="display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"></div>
      <button type="button" id="fc-guest-submit-btn" class="fc-submit-btn">${T.submitComment}</button>
    </div>

    <div id="fc-list" class="fc-list"><div class="fc-loading">${T.loading}</div></div>
  `

  // ── DOM references ─────────────────────────────────────────────────────
  const tabGoogleBtn = document.getElementById("fc-tab-google-btn") as HTMLButtonElement
  const tabGuestBtn = document.getElementById("fc-tab-guest-btn") as HTMLButtonElement
  const googleLoginArea = document.getElementById("fc-google-login-area")!
  const composeSection = document.getElementById("fc-compose-section")!
  const guestCompose = document.getElementById("fc-guest-compose")!
  const textarea = document.getElementById("fc-textarea") as HTMLTextAreaElement
  const submitBtn = document.getElementById("fc-submit-btn") as HTMLButtonElement
  const guestTextarea = document.getElementById("fc-guest-textarea") as HTMLTextAreaElement
  const guestSubmitBtn = document.getElementById("fc-guest-submit-btn") as HTMLButtonElement
  const guestNameInput = document.getElementById("fc-guest-name") as HTMLInputElement
  const guestEmailInput = document.getElementById("fc-guest-email") as HTMLInputElement
  const guestWebInput = document.getElementById("fc-guest-website") as HTMLInputElement
  const saveCheckbox = document.getElementById("fc-save-info") as HTMLInputElement
  const listEl = document.getElementById("fc-list")!
  const reactionsEl = document.getElementById("fc-article-reactions")!
  const previewEl = document.getElementById("fc-preview")!
  const guestPreviewEl = document.getElementById("fc-guest-preview")!
  const notifyBar = document.getElementById("fc-notify-bar")!
  const notifyBtn = document.getElementById("fc-notify-btn")

  // ── Restore saved guest info ───────────────────────────────────────────
  const savedGuest = loadGuestInfo()
  if (savedGuest) {
    guestNameInput.value = savedGuest.name || ""
    guestEmailInput.value = savedGuest.email || ""
    guestWebInput.value = savedGuest.website || ""
    saveCheckbox.checked = true
  }

  // ── Notification bar ───────────────────────────────────────────────────
  if ("Notification" in window && Notification.permission === "default") {
    notifyBar.style.display = "flex"
  }
  notifyBtn?.addEventListener("click", async () => {
    const perm = await Notification.requestPermission()
    if (perm !== "default") notifyBar.style.display = "none"
  })

  // ── Tab state ──────────────────────────────────────────────────────────
  let activeTab: "google" | "guest" = "google"

  const applyGoogleTab = () => {
    activeTab = "google"
    tabGoogleBtn.classList.add("fc-tab-active")
    tabGuestBtn.classList.remove("fc-tab-active")
    googleLoginArea.style.display = "block"
    guestCompose.style.display = "none"
    // composeSection shown by auth state handler
  }

  const applyGuestTab = () => {
    activeTab = "guest"
    tabGuestBtn.classList.add("fc-tab-active")
    tabGoogleBtn.classList.remove("fc-tab-active")
    googleLoginArea.style.display = "none"
    composeSection.style.display = "none"
    guestCompose.style.display = "flex"
  }

  tabGuestBtn.addEventListener("click", applyGuestTab)
  // tabGoogleBtn click is bound inside Firebase block (needs signInWithPopup)

  // ── Helpers ────────────────────────────────────────────────────────────
  const bindToolbar = (wrap: HTMLElement, ta: HTMLTextAreaElement) => {
    wrap.querySelectorAll(".fc-toolbar button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const md = (btn as HTMLElement).dataset.md!
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const text = ta.value

        if (md === "[]()") {
          ta.value = text.substring(0, start) + `[${T.linkText}](${T.linkUrl})` + text.substring(end)
          ta.focus()
          ta.setSelectionRange(start + 1, start + 9)
        } else if (md === "## ") {
          const before = text.substring(0, start)
          const prefix = before.length > 0 && !before.endsWith("\n") ? "\n## " : "## "
          ta.value =
            text.substring(0, start) + prefix + text.substring(start, end) + text.substring(end)
          ta.focus()
          ta.setSelectionRange(start + prefix.length, start + prefix.length + (end - start))
        } else {
          ta.value =
            text.substring(0, start) + md + text.substring(start, end) + md + text.substring(end)
          ta.focus()
          if (start === end) {
            ta.setSelectionRange(start + md.length, start + md.length)
          } else {
            ta.setSelectionRange(start + md.length, end + md.length)
          }
        }
        ta.dispatchEvent(new Event("input"))
      })
    })
  }

  const ensureAbsoluteUrl = (url: string) => {
    url = url.trim()
    if (
      url.startsWith("/") ||
      url.startsWith(".") ||
      url.startsWith("#") ||
      /^[a-z0-9+.-]+:/i.test(url) ||
      url.startsWith("//")
    ) {
      return url
    }
    return `https://${url}`
  }

  const parseMarkdown = (text: string) => {
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>")
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        return `<a href="${ensureAbsoluteUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`
      },
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
        `<div style="font-size:0.85em;opacity:0.7;margin-bottom:0.4rem;border-bottom:1px solid var(--lightgray);padding-bottom:0.2rem;">${T.preview}</div>` +
        parseMarkdown(text)
    } else {
      preview.style.display = "none"
      preview.innerHTML = ""
    }
  }

  textarea.addEventListener("input", () => updatePreview(textarea, previewEl))
  guestTextarea.addEventListener("input", () => updatePreview(guestTextarea, guestPreviewEl))
  bindToolbar(composeSection, textarea)
  bindToolbar(guestCompose, guestTextarea)

  // ── Firebase ───────────────────────────────────────────────────────────
  try {
    // prettier-ignore
    // @ts-ignore
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js")
    // prettier-ignore
    // @ts-ignore
    const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js")
    // prettier-ignore
    // @ts-ignore
    const { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, getDoc, arrayUnion, arrayRemove } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")

    const app = getApps().length === 0 ? initializeApp(config) : getApp()
    const auth = getAuth(app)
    const db = getFirestore(app)
    let currentUser: any = null

    // ── Ban helpers ──────────────────────────────────────────────────────
    const bannedUsersCache = new Map<string, boolean>()

    const getBanDocId = (identifier: string): string => {
      // Firestore doc IDs can't contain '/' so we replace dots/@ for safety
      return identifier.replace(/[\/.]/g, "_")
    }

    const isUserBanned = async (identifier: string): Promise<boolean> => {
      if (!identifier) return false
      if (bannedUsersCache.has(identifier)) return bannedUsersCache.get(identifier)!
      try {
        const snap = await getDoc(doc(db, "bannedUsers", getBanDocId(identifier)))
        const banned = snap.exists() && snap.data().banned === true
        bannedUsersCache.set(identifier, banned)
        return banned
      } catch {
        return false
      }
    }

    const banUser = async (identifier: string, userName: string) => {
      if (!identifier) return
      await setDoc(doc(db, "bannedUsers", getBanDocId(identifier)), {
        originalId: identifier,
        userName,
        banned: true,
        bannedAt: serverTimestamp(),
        bannedBy: currentUser?.email || "admin",
      })
      bannedUsersCache.set(identifier, true)
    }

    const unbanUser = async (identifier: string) => {
      if (!identifier) return
      await deleteDoc(doc(db, "bannedUsers", getBanDocId(identifier)))
      bannedUsersCache.set(identifier, false)
    }

    const doLogin = (e?: Event) => {
      e?.preventDefault()
      signInWithPopup(auth, new GoogleAuthProvider()).catch((err: any) =>
        alert(T.loginFail + err.code),
      )
    }

    // ── Tab Google button ──────────────────────────────────────────────
    tabGoogleBtn.addEventListener("click", () => {
      if (!currentUser) {
        doLogin()
      } else {
        applyGoogleTab()
        composeSection.style.display = "flex"
      }
    })

    // ── Telegram helper ────────────────────────────────────────────────
    const notifyTelegram = (payload: Record<string, string>) => {
      fetch("https://telegram-notify.hsmefh.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }

    let onAuthUpdateForReactions: () => void = () => {}

    // ── Auth state ─────────────────────────────────────────────────────
    const unsubAuth = onAuthStateChanged(auth, (user: any) => {
      currentUser = user

      if (user) {
        googleLoginArea.innerHTML = `
          <div class="fc-user-info">
            <img src="${user.photoURL || ""}" alt="${user.displayName}" class="fc-user-avatar" referrerpolicy="no-referrer"/>
            <span style="font-size:0.9rem;color:var(--dark);">${user.displayName}</span>
            <button type="button" id="fc-logout-btn" class="fc-logout-btn">${T.logout}</button>
          </div>`
        document.getElementById("fc-logout-btn")?.addEventListener("click", (e) => {
          e.preventDefault()
          signOut(auth).catch(console.error)
        })
        if (activeTab === "google") {
          composeSection.style.display = "flex"
        }
      } else {
        googleLoginArea.innerHTML = `<button type="button" id="fc-login-btn" class="fc-login-btn">${loginSVG} ${T.loginGoogle}</button>`
        document.getElementById("fc-login-btn")?.addEventListener("click", doLogin)
        composeSection.style.display = "none"
      }
      onAuthUpdateForReactions()
    })
    window.addCleanup?.(() => unsubAuth())

    // ── Article Reactions ──────────────────────────────────────────────
    const safeSlug = slug.replace(/\//g, "___")
    const articleReactionsRef = doc(db, "articleReactions", safeSlug)
    setDoc(articleReactionsRef, { init: true }, { merge: true }).catch(() => {})

    let latestReactionData: any = null
    let latestCommentsSnapshot: any = null
    let renderCommentsList: () => void = () => {}

    const renderReactions = () => {
      const data = latestReactionData
      if (!data) return
      const currentReactor = currentUser ? currentUser.uid : getAnonId()

      const reactionsHTML = EMOJIS.map((emoji) => {
        const reactors: string[] = data[emoji] || []
        const reacted = reactors.includes(currentReactor)
        return `<button type="button" class="fc-reaction-btn${reacted ? " reacted" : ""}" data-emoji="${emoji}" title="${emoji}">${emoji}${reactors.length > 0 ? `<span class="fc-reaction-count">${reactors.length}</span>` : ""}</button>`
      }).join("")

      reactionsEl.innerHTML = `<div class="fc-reactions-title">${T.reactionsTitle}</div><div class="fc-reactions">${reactionsHTML}</div>`

      reactionsEl.querySelectorAll<HTMLButtonElement>(".fc-reaction-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!currentUser) {
            alert(T.reactLogin)
            return
          }
          const activeReactor = currentUser.uid
          const clickedEmoji = btn.dataset.emoji!
          const currentReactors: string[] = latestReactionData[clickedEmoji] || []
          try {
            const isAlreadyReacted = currentReactors.includes(activeReactor)
            const updates: any = {}
            EMOJIS.forEach((e) => {
              if ((latestReactionData[e] || []).includes(activeReactor)) {
                updates[e] = arrayRemove(activeReactor)
              }
            })
            if (!isAlreadyReacted) updates[clickedEmoji] = arrayUnion(activeReactor)
            if (Object.keys(updates).length > 0) {
              await setDoc(articleReactionsRef, updates, { merge: true })
              if (!isAlreadyReacted) {
                notifyTelegram({
                  actionType: "reaction",
                  emoji: clickedEmoji,
                  author: currentUser.displayName || T.anonymous,
                  articleTitle: document.title,
                  articleUrl: window.location.href,
                })
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

    // ── Toggle like ────────────────────────────────────────────────────
    const toggleLike = async (commentId: string, snap: any) => {
      if (!currentUser) {
        alert(T.likeLogin)
        return
      }
      const activeReactor = currentUser.uid
      const ref = doc(db, "comments", commentId)
      const current = snap.likes || []
      if (current.includes(activeReactor)) {
        await updateDoc(ref, { likes: arrayRemove(activeReactor) })
      } else {
        await updateDoc(ref, { likes: arrayUnion(activeReactor) })
        notifyTelegram({
          actionType: "like",
          author: currentUser?.displayName || T.visitor,
          content: snap.text,
          articleTitle: document.title,
          articleUrl: window.location.href,
        })
      }
    }

    // ── Start edit (Google users only) ─────────────────────────────────
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
      saveBtn.textContent = T.save

      const cancelBtn = document.createElement("button")
      cancelBtn.type = "button"
      cancelBtn.className = "fc-logout-btn"
      cancelBtn.textContent = T.cancel

      editActions.append(saveBtn, cancelBtn)
      wrap.append(editTA)

      const fullWrap = document.createElement("div")
      fullWrap.style.cssText = "display:flex;flex-direction:column;gap:0.5rem;"
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
        saveBtn.textContent = T.saving
        try {
          await updateDoc(doc(db, "comments", commentId), {
            text: newText,
            editedAt: serverTimestamp(),
          })
        } catch (err: any) {
          alert(T.editFail + err.message)
          saveBtn.disabled = false
          saveBtn.textContent = T.save
        }
      })
    }

    // ── Reply form (supports both Google & Guest) ──────────────────────
    const showReplyForm = (replyArea: HTMLElement, parentId: string) => {
      const existing = replyArea.querySelector(".fc-reply-form")
      if (existing) {
        existing.remove()
        return
      }

      const isGoogleUser = !!currentUser
      const savedG = loadGuestInfo()

      const guestFieldsHTML = !isGoogleUser
        ? `
        <div class="fc-guest-form fc-reply-guest-form">
          <div class="fc-guest-row">
            <input type="text"  class="fc-guest-input fc-reply-name"    placeholder="${T.guestName}"                 autocomplete="name"  value="${savedG?.name || ""}" />
            <input type="email" class="fc-guest-input fc-reply-email"   placeholder="${T.guestEmail}"     autocomplete="email" value="${savedG?.email || ""}" />
          </div>
          <input type="url" class="fc-guest-input fc-guest-input-full fc-reply-website" placeholder="${T.guestWebsite}" autocomplete="url" value="${savedG?.website || ""}" />
        </div>
      `
        : ""

      const form = document.createElement("div")
      form.className = "fc-reply-form"
      form.innerHTML = `
        ${guestFieldsHTML}
        <div class="fc-editor-wrap">
          ${toolbarHTML}
          <textarea class="fc-reply-textarea" placeholder="${T.replyPh}"></textarea>
        </div>
        <div class="fc-reply-preview fc-comment-text" style="display:none; padding:0.8rem; margin:0.5rem 0; border:1px solid var(--lightgray); border-radius:5px; background:var(--light);"></div>
        <div class="fc-reply-actions">
          <button type="button" class="fc-submit-btn fc-reply-submit-btn">${T.replySubmit}</button>
          <button type="button" class="fc-logout-btn fc-reply-cancel-btn">${T.cancel}</button>
        </div>`
      replyArea.appendChild(form)

      const ta = form.querySelector(".fc-reply-textarea") as HTMLTextAreaElement
      const rpPreview = form.querySelector(".fc-reply-preview") as HTMLElement
      ta.addEventListener("input", () => updatePreview(ta, rpPreview))
      ta.focus()
      bindToolbar(form.querySelector(".fc-editor-wrap") as HTMLElement, ta)

      form.querySelector(".fc-reply-cancel-btn")?.addEventListener("click", () => form.remove())
      form.querySelector(".fc-reply-submit-btn")?.addEventListener("click", async () => {
        const text = ta.value.trim()
        const btn = form.querySelector(".fc-reply-submit-btn") as HTMLButtonElement

        if (!text) {
          alert(T.replyEmpty)
          return
        }

        // Check if user is banned before replying
        if (isGoogleUser && currentUser) {
          if (await isUserBanned(currentUser.uid)) {
            alert(T.bannedMsg)
            btn.disabled = false
            btn.textContent = T.replySubmit
            return
          }
        }

        btn.disabled = true
        btn.textContent = T.sending

        try {
          let userName: string, userPhoto: string, userId: string | null
          let userGravatar = "",
            userWebsite = "",
            userEmail = ""

          if (isGoogleUser) {
            userName = currentUser.displayName
            userPhoto = currentUser.photoURL || ""
            userId = currentUser.uid
          } else {
            const gName =
              (form.querySelector(".fc-reply-name") as HTMLInputElement)?.value.trim() || ""
            const gEmail =
              (form.querySelector(".fc-reply-email") as HTMLInputElement)?.value.trim() || ""
            const gWeb =
              (form.querySelector(".fc-reply-website") as HTMLInputElement)?.value.trim() || ""

            if (!gName) {
              alert(T.nameRequired)
              btn.disabled = false
              btn.textContent = T.replySubmit
              return
            }
            if (!gEmail) {
              alert(T.emailRequired)
              btn.disabled = false
              btn.textContent = T.replySubmit
              return
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) {
              alert(T.guestEmailInvalid)
              btn.disabled = false
              btn.textContent = T.replySubmit
              return
            }
            // Check if guest email is banned
            if (await isUserBanned(gEmail)) {
              alert(T.bannedMsg)
              btn.disabled = false
              btn.textContent = T.replySubmit
              return
            }

            userName = gName
            userPhoto = ""
            userGravatar = await gravatarUrl(gEmail)
            userWebsite = gWeb
            userEmail = gEmail
            userId = null
            saveGuestInfo(gName, gEmail, gWeb)
          }

          await addDoc(collection(db, "comments"), {
            slug,
            text,
            parentId,
            userId,
            userName,
            userPhoto,
            userGravatar,
            userWebsite,
            userEmail,
            isGuest: !isGoogleUser,
            createdAt: serverTimestamp(),
            likes: [],
          })

          notifyTelegram({
            actionType: "reply",
            author: userName,
            ...(userEmail ? { authorEmail: userEmail } : {}),
            ...(userWebsite ? { authorWebsite: userWebsite } : {}),
            content: text,
            articleTitle: document.title,
            articleUrl: window.location.href,
          })

          form.remove()
        } catch (err: any) {
          alert(T.sendFail + err.message)
          btn.disabled = false
          btn.textContent = T.replySubmit
        }
      })
    }

    // ── Render single comment ──────────────────────────────────────────
    const renderComment = (
      cdoc: any,
      currentReactor: string,
      isReply = false,
      depth = 0,
    ): HTMLElement => {
      const d = cdoc.data()
      const date = d.createdAt
        ? new Date(d.createdAt.toDate()).toLocaleDateString(T.dateLocale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : T.now

      const isAdmin = !!(currentUser && currentUser.email === ADMIN_EMAIL)
      const isOwner = currentUser && currentUser.uid === d.userId
      const canDelete = isOwner || isAdmin
      const canEdit = isOwner
      const canBan = isAdmin && !isOwner
      // Identifier for banning: Google uid for authenticated users, guest email for guests
      const banIdentifier = d.userId || d.userEmail || ""
      const editedBadge = d.editedAt ? `<span class="fc-edited-badge">${T.edited}</span>` : ""

      const likes: string[] = d.likes || []
      const liked = likes.includes(currentReactor)
      const likeCount = likes.length

      // Avatar: Google photo → Gravatar → default silhouette
      const avatarSrc = d.userPhoto || d.userGravatar || "https://www.gravatar.com/avatar/0?d=mp"

      // Name: clickable if guest provided website
      const nameHtml = d.userWebsite
        ? `<a href="${ensureAbsoluteUrl(d.userWebsite)}" target="_blank" rel="nofollow noopener" class="fc-comment-author fc-author-link">${d.userName || T.visitor}</a>`
        : `<span class="fc-comment-author">${d.userName || T.visitor}</span>`

      // Guest badge
      const guestBadge = d.isGuest ? `<span class="fc-guest-badge">${T.guestBadge}</span>` : ""

      const el = document.createElement("div")
      const replyClass = isReply
        ? depth > 3
          ? "fc-comment fc-reply fc-reply-max-depth"
          : "fc-comment fc-reply"
        : "fc-comment"
      el.className = replyClass
      el.dataset.commentId = cdoc.id

      el.innerHTML = `
        <img src="${avatarSrc}" alt="${d.userName}" class="fc-comment-avatar${isReply ? " fc-reply-avatar" : ""}" referrerpolicy="no-referrer"/>
        <div class="fc-comment-body">
          <div class="fc-comment-content">
            <div class="fc-comment-header">
              <div class="fc-author-row">${nameHtml}${guestBadge}</div>
              <div class="fc-comment-meta">${editedBadge}<span class="fc-comment-date">${date}</span></div>
            </div>
            <div class="fc-comment-text">${parseMarkdown(d.text)}</div>
            <div class="fc-comment-actions" style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
              <button type="button" class="fc-like-btn${liked ? " liked" : ""}" data-id="${cdoc.id}" title="${T.likeTitle}">
                ${liked ? "👍" : "👍🏻"}<span class="fc-like-count">${likeCount > 0 ? " " + likeCount : ""}</span>
              </button>
              <button type="button" class="fc-reply-btn" data-id="${cdoc.id}">💬 <span>${T.replyBtn}</span></button>
              ${canEdit ? `<button type="button" class="fc-edit-btn"   data-id="${cdoc.id}">${T.editBtn}</button>` : ""}
              ${canDelete ? `<button type="button" class="fc-delete-btn" data-id="${cdoc.id}">${T.deleteBtn}</button>` : ""}
              ${canBan && banIdentifier ? `<button type="button" class="fc-ban-btn" data-id="${cdoc.id}" data-ban-id="${banIdentifier}" data-ban-name="${d.userName || T.anonymous}">${T.banBtn}</button>` : ""}
            </div>
          </div>
          <div class="fc-replies-area"></div>
        </div>`

      el.querySelector(".fc-like-btn")?.addEventListener("click", async () => {
        await toggleLike(cdoc.id, cdoc.data())
      })

      el.querySelector(".fc-reply-btn")?.addEventListener("click", () => {
        const area = el.querySelector(".fc-replies-area") as HTMLElement
        showReplyForm(area, cdoc.id)
      })

      if (canEdit) {
        el.querySelector(".fc-edit-btn")?.addEventListener("click", () => {
          startEdit(el.querySelector(".fc-comment-content") as HTMLElement, cdoc.id, d.text)
        })
      }

      if (canDelete) {
        el.querySelector(".fc-delete-btn")?.addEventListener("click", async () => {
          if (confirm(T.deleteConfirm)) {
            try {
              await deleteDoc(doc(db, "comments", cdoc.id))
              notifyTelegram({
                actionType: "delete",
                author: d.userName || T.anonymous,
                content: d.text,
                articleTitle: document.title,
                articleUrl: window.location.href,
              })
            } catch (err: any) {
              alert(T.deleteFail + err.message)
            }
          }
        })
      }

      if (canBan && banIdentifier) {
        const banBtn = el.querySelector(".fc-ban-btn") as HTMLButtonElement
        banBtn?.addEventListener("click", async () => {
          const banId = banBtn.dataset.banId!
          const banName = banBtn.dataset.banName!
          const isBanned = await isUserBanned(banId)
          if (isBanned) {
            if (confirm(T.unbanConfirm(banName))) {
              try {
                await unbanUser(banId)
                banBtn.textContent = T.banBtn
                banBtn.title = T.banBtnTitle
                alert(T.unbannedOk(banName))
              } catch (err: any) {
                alert(T.unbanFail + err.message)
              }
            }
          } else {
            if (confirm(T.banConfirm(banName))) {
              try {
                await banUser(banId, banName)
                banBtn.textContent = T.unbanBtn
                banBtn.title = T.unbanBtnTitle
                alert(T.bannedOk(banName))
              } catch (err: any) {
                alert(T.banFail + err.message)
              }
            }
          }
        })
        // Check initial ban state and update button
        isUserBanned(banIdentifier).then((isBanned) => {
          if (isBanned) {
            banBtn.textContent = T.unbanBtn
            banBtn.title = T.unbanBtnTitle
          }
        })
      }

      return el
    }

    // ── Submit: Google comment ─────────────────────────────────────────
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      const text = textarea.value.trim()
      if (!text || !currentUser) return

      // Check if user is banned
      if (await isUserBanned(currentUser.uid)) {
        alert(T.bannedMsg)
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = T.sending
      try {
        await addDoc(collection(db, "comments"), {
          slug,
          text,
          parentId: null,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL || "",
          userGravatar: "",
          userWebsite: "",
          isGuest: false,
          createdAt: serverTimestamp(),
          likes: [],
        })
        notifyTelegram({
          author: currentUser.displayName || T.visitor,
          content: text,
          articleTitle: document.title,
          articleUrl: window.location.href,
        })
        textarea.value = ""
        updatePreview(textarea, previewEl)
      } catch (err: any) {
        alert(T.sendFail + err.message)
      }
      submitBtn.disabled = false
      submitBtn.textContent = T.submitComment
    })

    // ── Submit: Guest comment ──────────────────────────────────────────
    guestSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      const text = guestTextarea.value.trim()
      const gName = guestNameInput.value.trim()
      const gEmail = guestEmailInput.value.trim()
      const gWeb = guestWebInput.value.trim()

      if (!gName) {
        guestNameInput.focus()
        alert(T.nameRequired)
        return
      }
      if (!gEmail) {
        guestEmailInput.focus()
        alert(T.emailRequired)
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail)) {
        guestEmailInput.focus()
        alert(T.guestEmailInvalid)
        return
      }
      if (!text) {
        guestTextarea.focus()
        alert(T.commentEmpty)
        return
      }

      // Check if guest email is banned
      if (await isUserBanned(gEmail)) {
        alert(T.bannedMsg)
        return
      }

      guestSubmitBtn.disabled = true
      guestSubmitBtn.textContent = T.sending

      try {
        const avatar = await gravatarUrl(gEmail)

        await addDoc(collection(db, "comments"), {
          slug,
          text,
          parentId: null,
          userId: null,
          userName: gName,
          userPhoto: "",
          userGravatar: avatar,
          userWebsite: gWeb,
          userEmail: gEmail,
          isGuest: true,
          createdAt: serverTimestamp(),
          likes: [],
        })

        if (saveCheckbox.checked) {
          saveGuestInfo(gName, gEmail, gWeb)
        } else {
          localStorage.removeItem(GUEST_STORAGE_KEY)
        }

        notifyTelegram({
          author: gName,
          authorEmail: gEmail,
          ...(gWeb ? { authorWebsite: gWeb } : {}),
          content: text,
          articleTitle: document.title,
          articleUrl: window.location.href,
        })

        guestTextarea.value = ""
        updatePreview(guestTextarea, guestPreviewEl)
      } catch (err: any) {
        alert(T.sendFail + err.message)
      }
      guestSubmitBtn.disabled = false
      guestSubmitBtn.textContent = T.submitComment
    })

    // ── Firestore snapshot + browser notifications ─────────────────────
    const q = query(
      collection(db, "comments"),
      where("slug", "==", slug),
      orderBy("createdAt", "asc"),
    )

    let isFirstLoad = true

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
        listEl.innerHTML = `<div style="text-align:center;color:var(--gray);padding:1rem 0;">${T.emptyList}</div>`
        localStorage.setItem(NOTIF_COUNT_KEY, "0")
        return
      }

      const renderTree = (docs: any[], isNested: boolean, depth: number) => {
        const frag = document.createDocumentFragment()
        docs.forEach((d) => {
          const el = renderComment(d, currentReactor, isNested, depth)
          const area = el.querySelector(".fc-replies-area")
          const children = repliesMap.get(d.id)
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
        const newCount = snapshot.docs.length
        const prevCount = parseInt(localStorage.getItem(NOTIF_COUNT_KEY) || "0")

        // Browser notification when new comment arrives while page is hidden
        if (!isFirstLoad && newCount > prevCount && document.hidden) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(T.notifTitle(document.title), {
              body: T.notifBody,
              icon: "/static/thumbnails/icon.png",
            })
          }
        }

        localStorage.setItem(NOTIF_COUNT_KEY, String(newCount))
        isFirstLoad = false

        latestCommentsSnapshot = snapshot
        renderCommentsList()
      },
      (err: any) => {
        console.error("Firestore error:", err)
        listEl.innerHTML = `<div style="text-align:center;color:#e53935;padding:1rem 0;">${T.loadFail(err.code)}</div>`
      },
    )

    window.addCleanup?.(() => unsubSnap())
  } catch (err: any) {
    console.error("Firebase init error:", err)
    container.innerHTML = `<div style="text-align:center;color:#e53935;">${T.initFail}</div>`
  }
})
