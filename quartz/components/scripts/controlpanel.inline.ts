document.addEventListener("nav", () => {
  // =====================
  // Font Size Control
  // =====================
  const fontSizes: Record<string, string> = {
    small: "16px",
    medium: "18px",
    large: "24px",
  }

  const fontButtons = {
    small: document.querySelector("#btn-font-small") as HTMLButtonElement | null,
    medium: document.querySelector("#btn-font-medium") as HTMLButtonElement | null,
    large: document.querySelector("#btn-font-large") as HTMLButtonElement | null,
  }

  const setFontSize = (size: string) => {
    document.documentElement.style.setProperty("--main-font-size", fontSizes[size])
    localStorage.setItem("reader-font-size", size)

    // Update active state
    Object.entries(fontButtons).forEach(([key, btn]) => {
      if (btn) btn.classList.toggle("active", key === size)
    })
  }

  // Restore saved font size
  const savedFontSize = localStorage.getItem("reader-font-size") ?? "medium"
  setFontSize(savedFontSize)

  Object.entries(fontButtons).forEach(([size, btn]) => {
    if (!btn) return
    const handler = () => setFontSize(size)
    btn.addEventListener("click", handler)
    window.addCleanup(() => btn.removeEventListener("click", handler))
  })

  // =====================
  // Content Width Control
  // =====================
  const widths: Record<string, string> = {
    narrow: "480px",
    medium: "580px",
    wide: "870px",
  }

  const widthButtons = {
    narrow: document.querySelector("#btn-width-narrow") as HTMLButtonElement | null,
    medium: document.querySelector("#btn-width-medium") as HTMLButtonElement | null,
    wide: document.querySelector("#btn-width-wide") as HTMLButtonElement | null,
  }

  const setContentWidth = (width: string) => {
    document.documentElement.style.setProperty("--content-width", widths[width])
    localStorage.setItem("reader-content-width", width)

    Object.entries(widthButtons).forEach(([key, btn]) => {
      if (btn) btn.classList.toggle("active", key === width)
    })
  }

  // Restore saved width
  const savedWidth = localStorage.getItem("reader-content-width") ?? "medium"
  setContentWidth(savedWidth)

  Object.entries(widthButtons).forEach(([width, btn]) => {
    if (!btn) return
    const handler = () => setContentWidth(width)
    btn.addEventListener("click", handler)
    window.addCleanup(() => btn.removeEventListener("click", handler))
  })

  // =====================
  // Color Theme Control
  // =====================
  const themeButtons = {
    light: document.querySelector("#btn-theme-light") as HTMLButtonElement | null,
    dark: document.querySelector("#btn-theme-dark") as HTMLButtonElement | null,
    sepia: document.querySelector("#btn-theme-sepia") as HTMLButtonElement | null,
  }

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute("saved-theme", theme)
    localStorage.setItem("theme", theme)

    Object.entries(themeButtons).forEach(([key, btn]) => {
      if (btn) btn.classList.toggle("active", key === theme)
    })

    // Sync with Quartz's darkmode system
    const event = new CustomEvent("themechange", {
      detail: { theme },
    })
    document.dispatchEvent(event)
  }

  // Restore saved theme for buttons active state
  const savedTheme = localStorage.getItem("theme") ?? "light"
  Object.entries(themeButtons).forEach(([key, btn]) => {
    if (btn) btn.classList.toggle("active", key === savedTheme)
  })

  Object.entries(themeButtons).forEach(([theme, btn]) => {
    if (!btn) return
    const handler = () => setTheme(theme)
    btn.addEventListener("click", handler)
    window.addCleanup(() => btn.removeEventListener("click", handler))
  })

  // =====================
  // TOC Toggle
  // =====================
  const tocToggle = document.querySelector("#btn-toggle-toc") as HTMLButtonElement | null
  if (tocToggle) {
    const toggleToc = () => {
      const rightSidebar = document.querySelector(".sidebar.right") as HTMLElement | null
      if (rightSidebar) {
        rightSidebar.classList.toggle("sidebar-hidden")
        const isHidden = rightSidebar.classList.contains("sidebar-hidden")
        tocToggle.classList.toggle("active", isHidden)
        localStorage.setItem("toc-visible", isHidden ? "false" : "true")

        const textSpan = tocToggle.querySelector("span")
        if (textSpan) textSpan.innerText = isHidden ? "إيقاف" : "تفعيل"
      }
    }

    // Restore saved TOC state
    const tocVisible = localStorage.getItem("toc-visible")
    if (tocVisible === "false") {
      const rightSidebar = document.querySelector(".sidebar.right") as HTMLElement | null
      if (rightSidebar) {
        rightSidebar.classList.add("sidebar-hidden")
        tocToggle.classList.add("active")
        const textSpan = tocToggle.querySelector("span")
        if (textSpan) textSpan.innerText = "إيقاف"
      }
    }

    tocToggle.addEventListener("click", toggleToc)
    window.addCleanup(() => tocToggle.removeEventListener("click", toggleToc))
  }

  // =====================
  // Audio Toggle
  // =====================
  const audioToggle = document.querySelector("#btn-toggle-audio") as HTMLButtonElement | null
  let bgAudio: HTMLAudioElement | null = null

  if (audioToggle) {
    const audioOnText = audioToggle.querySelector(".audio-on-text") as HTMLElement | null
    const audioOffText = audioToggle.querySelector(".audio-off-text") as HTMLElement | null
    let isPlaying = false

    const toggleAudio = () => {
      if (!bgAudio) {
        // Initialize audio on first click - update path to your audio file
        bgAudio = new Audio()
        bgAudio.loop = true
        bgAudio.volume = 0.3
      }

      if (isPlaying) {
        bgAudio.pause()
        if (audioOnText) audioOnText.style.display = "none"
        if (audioOffText) audioOffText.style.display = "inline"
      } else {
        bgAudio.play().catch(() => {
          // Audio play failed - likely no source or autoplay blocked
        })
        if (audioOnText) audioOnText.style.display = "inline"
        if (audioOffText) audioOffText.style.display = "none"
      }
      isPlaying = !isPlaying
      audioToggle.classList.toggle("active", isPlaying)
    }

    audioToggle.addEventListener("click", toggleAudio)
    window.addCleanup(() => {
      audioToggle.removeEventListener("click", toggleAudio)
      if (bgAudio) {
        bgAudio.pause()
        bgAudio = null
      }
    })
  }

  // =====================
  // Floating Actions
  // =====================
  const scrollTopBtn = document.querySelector("#btn-scroll-top") as HTMLButtonElement | null
  if (scrollTopBtn) {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
    scrollTopBtn.addEventListener("click", scrollToTop)
    window.addCleanup(() => scrollTopBtn.removeEventListener("click", scrollToTop))
  }

  const settingsToggle = document.querySelector("#btn-settings-toggle") as HTMLButtonElement | null
  const settingsPanel = document.querySelector("#settings-panel") as HTMLElement | null
  if (settingsToggle && settingsPanel) {
    const togglePanel = () => {
      settingsPanel.classList.toggle("panel-collapsed")
    }
    settingsToggle.addEventListener("click", togglePanel)
    window.addCleanup(() => settingsToggle.removeEventListener("click", togglePanel))

    // Close panel when clicking outside
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!settingsPanel.contains(e.target as Node) && !settingsToggle.contains(e.target as Node) && !settingsPanel.classList.contains("panel-collapsed")) {
        settingsPanel.classList.add("panel-collapsed")
      }
    }
    document.addEventListener("click", closeOnOutsideClick)
    window.addCleanup(() => document.removeEventListener("click", closeOnOutsideClick))
  }

  // =====================
  // Back Button
  // =====================
  const backBtn = document.querySelector("#btn-back") as HTMLButtonElement | null
  if (backBtn) {
    const goBack = () => window.history.back()
    backBtn.addEventListener("click", goBack)
    window.addCleanup(() => backBtn.removeEventListener("click", goBack))
  }
})
