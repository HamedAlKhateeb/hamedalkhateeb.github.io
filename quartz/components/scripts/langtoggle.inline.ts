document.addEventListener("nav", () => {
  const STORAGE_KEY = "quartz-lang"
  const ASKED_KEY = "quartz-lang-asked"
  const TRANSLATE_CACHE_PREFIX = "quartz-tr-"

  // Determine language from URL > localStorage > default
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get("lang")
  let currentLang = urlLang || localStorage.getItem(STORAGE_KEY) || "ar"

  if (urlLang) {
    localStorage.setItem(STORAGE_KEY, urlLang)
    localStorage.setItem(ASKED_KEY, "true")
  }

  // Auto-detection banner for first-time non-Arabic visitors
  if (!localStorage.getItem(ASKED_KEY) && !urlLang) {
    const browserLang = navigator.language || (navigator as any).languages?.[0] || "ar"
    if (!browserLang.startsWith("ar")) {
      showLanguageBanner()
    } else {
      localStorage.setItem(ASKED_KEY, "true")
    }
  }

  // Apply current language
  applyLanguage(currentLang)

  // Toggle button
  const toggleBtn = document.getElementById("lang-toggle-btn")
  if (toggleBtn) {
    const handler = () => {
      currentLang = currentLang === "ar" ? "en" : "ar"
      localStorage.setItem(STORAGE_KEY, currentLang)
      localStorage.setItem(ASKED_KEY, "true")
      // Remove banner if present
      document.querySelector(".lang-detect-banner")?.remove()
      applyLanguage(currentLang)
    }
    toggleBtn.addEventListener("click", handler)
    window.addCleanup(() => toggleBtn.removeEventListener("click", handler))
  }

  function applyLanguage(lang: string) {
    const html = document.documentElement

    if (lang === "en") {
      html.setAttribute("dir", "ltr")
      html.setAttribute("lang", "en")
      html.classList.add("lang-en")
      html.classList.remove("lang-ar")

      // Save original Arabic text and swap to English
      document.querySelectorAll("[data-lang-en]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar")) {
          el.setAttribute("data-lang-ar", el.textContent || "")
        }
        el.textContent = el.getAttribute("data-lang-en") || ""
      })

      // Swap titles
      document.querySelectorAll("[data-lang-en-title]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar-title")) {
          el.setAttribute("data-lang-ar-title", el.getAttribute("title") || "")
        }
        el.setAttribute("title", el.getAttribute("data-lang-en-title") || "")
      })

      // Swap placeholders
      document.querySelectorAll("[data-lang-en-placeholder]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar-placeholder")) {
          el.setAttribute("data-lang-ar-placeholder", el.getAttribute("placeholder") || "")
        }
        el.setAttribute("placeholder", el.getAttribute("data-lang-en-placeholder") || "")
      })

      // Update toggle button label
      const label = document.getElementById("lang-label-show")
      if (label) label.textContent = "ع"

      // Handle page content
      handleEnglishContent()
    } else {
      html.setAttribute("dir", "rtl")
      html.setAttribute("lang", "ar")
      html.classList.add("lang-ar")
      html.classList.remove("lang-en")

      // Restore Arabic text
      document.querySelectorAll("[data-lang-ar]").forEach((el) => {
        el.textContent = el.getAttribute("data-lang-ar") || ""
      })

      // Restore titles
      document.querySelectorAll("[data-lang-ar-title]").forEach((el) => {
        el.setAttribute("title", el.getAttribute("data-lang-ar-title") || "")
      })

      // Restore placeholders
      document.querySelectorAll("[data-lang-ar-placeholder]").forEach((el) => {
        el.setAttribute("placeholder", el.getAttribute("data-lang-ar-placeholder") || "")
      })

      // Update toggle button label
      const label = document.getElementById("lang-label-show")
      if (label) label.textContent = "EN"

      // Remove translation notices and restore content
      document.querySelectorAll(".translation-notice").forEach((el) => el.remove())
      restoreOriginalContent()
    }
  }

  function handleEnglishContent() {
    const slug = document.body.dataset.slug || ""
    const isPoetry =
      slug.toLowerCase().startsWith("poetry/") &&
      slug !== "poetry/" &&
      !slug.endsWith("/index")

    if (isPoetry) {
      autoTranslatePoetry(slug)
    } else if (slug && slug !== "index" && !slug.endsWith("/index") && !slug.startsWith("tags/")) {
      loadEnglishArticle(slug)
    }
  }

  // ── Poetry auto-translation via MyMemory API ──
  async function autoTranslatePoetry(slug: string) {
    const articleEl = document.querySelector("article") as HTMLElement
    if (!articleEl) return

    // Store original HTML
    if (!articleEl.getAttribute("data-original-html")) {
      articleEl.setAttribute("data-original-html", articleEl.innerHTML)
    }

    // Show disclaimer banner
    addTranslationNotice(
      "🤖 This is a machine translation of the original Arabic poetry. The beauty of the original may not be fully captured.",
    )

    // Check cache
    const cacheKey = TRANSLATE_CACHE_PREFIX + slug
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const translated = JSON.parse(cached) as Record<string, string>
        applyPoetryTranslation(articleEl, translated)
        return
      } catch {
        localStorage.removeItem(cacheKey)
      }
    }

    // Collect paragraphs to translate
    const paragraphs = articleEl.querySelectorAll("p, h2, h3, h4, h5, h6, li, blockquote")
    const textsToTranslate: { el: Element; text: string }[] = []

    paragraphs.forEach((p) => {
      const text = (p.textContent || "").trim()
      if (text && text.length > 1 && /[\u0600-\u06FF]/.test(text)) {
        textsToTranslate.push({ el: p, text })
      }
    })

    if (textsToTranslate.length === 0) return

    // Translate individually to avoid translation engine breaking separators
    const translations: Record<string, string> = {}

    for (const item of textsToTranslate) {
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.text)}&langpair=ar|en&de=hsmefh@gmail.com`,
        )
        if (!response.ok) continue

        const data = await response.json()
        const translatedText = data?.responseData?.translatedText
        if (translatedText) {
          translations[item.text] = translatedText
        }
      } catch {
        continue
      }
    }

    // Cache and apply
    if (Object.keys(translations).length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(translations))
      } catch {
        // localStorage full, ignore
      }
      applyPoetryTranslation(articleEl, translations)
    }
  }

  function applyPoetryTranslation(articleEl: HTMLElement, translations: Record<string, string>) {
    const elements = articleEl.querySelectorAll("p, h2, h3, h4, h5, h6, li, blockquote")
    elements.forEach((el) => {
      const text = (el.textContent || "").trim()
      if (translations[text]) {
        // preserve <br> tags if they exist by replacing the text but keeping inner HTML structure if possible
        // Since it's complex to map translated text to <br> separated lines, we'll just set textContent
        // For poetry, we can try to restore line breaks by replacing newlines with <br>
        const translated = translations[text]
        el.innerHTML = translated.replace(/\n/g, "<br>")
      }
    })
  }

  // ── Article English content loading ──
  async function loadEnglishArticle(slug: string) {
    // Try to fetch companion .en page
    const enUrl = `/${slug}.en`
    try {
      const response = await fetch(enUrl)
      if (!response.ok) {
        addTranslationNotice("English translation is not available for this article yet.")
        return
      }

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      const enArticle = doc.querySelector("article")
      const enTitle = doc.querySelector(".article-title")
      const currentArticle = document.querySelector("article")
      const currentTitle = document.querySelector(".article-title")

      if (enArticle && currentArticle) {
        if (!currentArticle.getAttribute("data-original-html")) {
          currentArticle.setAttribute("data-original-html", currentArticle.innerHTML)
        }
        currentArticle.innerHTML = enArticle.innerHTML
      }

      if (enTitle && currentTitle) {
        if (!currentTitle.getAttribute("data-original-text")) {
          currentTitle.setAttribute("data-original-text", currentTitle.textContent || "")
        }
        currentTitle.textContent = enTitle.textContent
      }
    } catch {
      addTranslationNotice("English translation is not available for this article yet.")
    }
  }

  function restoreOriginalContent() {
    const article = document.querySelector("article") as HTMLElement
    if (article) {
      const original = article.getAttribute("data-original-html")
      if (original) {
        article.innerHTML = original
        article.removeAttribute("data-original-html")
      }
    }

    const title = document.querySelector(".article-title") as HTMLElement
    if (title) {
      const original = title.getAttribute("data-original-text")
      if (original) {
        title.textContent = original
        title.removeAttribute("data-original-text")
      }
    }
  }

  function addTranslationNotice(message: string) {
    // Remove existing notices
    document.querySelectorAll(".translation-notice").forEach((el) => el.remove())

    const notice = document.createElement("div")
    notice.className = "translation-notice"
    notice.innerHTML = `<span>${message}</span>`

    const titleContainer = document.querySelector(".article-title-container")
    const beforeBody = document.querySelector(".popover-hint")
    const target = titleContainer || beforeBody
    if (target) {
      target.parentNode?.insertBefore(notice, target.nextSibling)
    }
  }

  function showLanguageBanner() {
    // Don't show if already exists
    if (document.querySelector(".lang-detect-banner")) return

    const banner = document.createElement("div")
    banner.className = "lang-detect-banner"
    banner.innerHTML = `
      <div class="lang-detect-inner">
        <span class="lang-detect-text">This site is available in English. Would you like to switch?</span>
        <div class="lang-detect-actions">
          <button class="lang-detect-btn lang-detect-switch">Switch to English</button>
          <button class="lang-detect-btn lang-detect-keep">Keep Arabic</button>
        </div>
      </div>
    `

    document.body.prepend(banner)
    requestAnimationFrame(() => banner.classList.add("banner-visible"))

    const switchBtn = banner.querySelector(".lang-detect-switch")
    const keepBtn = banner.querySelector(".lang-detect-keep")

    const handleSwitch = () => {
      localStorage.setItem(STORAGE_KEY, "en")
      localStorage.setItem(ASKED_KEY, "true")
      currentLang = "en"
      banner.classList.remove("banner-visible")
      setTimeout(() => banner.remove(), 400)
      applyLanguage("en")
    }

    const handleKeep = () => {
      localStorage.setItem(STORAGE_KEY, "ar")
      localStorage.setItem(ASKED_KEY, "true")
      banner.classList.remove("banner-visible")
      setTimeout(() => banner.remove(), 400)
    }

    switchBtn?.addEventListener("click", handleSwitch)
    keepBtn?.addEventListener("click", handleKeep)

    window.addCleanup(() => {
      switchBtn?.removeEventListener("click", handleSwitch)
      keepBtn?.removeEventListener("click", handleKeep)
      banner.remove()
    })
  }
})
