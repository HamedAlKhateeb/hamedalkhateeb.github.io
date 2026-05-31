document.addEventListener("nav", () => {
  const pageSlug = document.body.dataset.slug ?? ""

  if (pageSlug === "index" || pageSlug === "" || window.location.pathname === "/") {
    // Clean up any previously injected elements to prevent duplicates after SPA navigation
    document.querySelectorAll(".continue-reading-banner").forEach((el) => el.remove())
    document.querySelectorAll(".home-bookmarks-section").forEach((el) => el.remove())

    // Show Continue Reading
    const lastReadData = localStorage.getItem("quartz-last-read")
    if (lastReadData) {
      try {
        const lastRead = JSON.parse(lastReadData)
        if (lastRead && lastRead.title && lastRead.path && lastRead.progress < 100) {
          const cardsGrid = document.querySelector(".cards-grid")
          if (cardsGrid) {
            // Use an <a> tag so the SPA router handles navigation properly
            const continueReadingEl = document.createElement("a")
            continueReadingEl.className = "continue-reading-banner"
            continueReadingEl.href = lastRead.path
            continueReadingEl.dataset.routerNoscroll = ""
            continueReadingEl.innerHTML = `
              <span data-lang-en="Continue reading " data-lang-ar="أكمل قراءة ">أكمل قراءة </span><strong>${lastRead.title}</strong><span> (${lastRead.progress}%)</span>
            `
            cardsGrid.parentNode?.insertBefore(continueReadingEl, cardsGrid)
          }
        }
      } catch (e) {}
    }

    return
  }

  // Only run on article/content pages
  const articleContent = document.querySelector(".center article") as HTMLElement | null
  if (!articleContent) return

  // Check if navigating from a resume flag
  const urlParams = new URLSearchParams(window.location.search)
  const isResume = urlParams.get("resume") === "true"

  if (isResume) {
    const lastReadData = localStorage.getItem("quartz-last-read")
    if (lastReadData) {
      try {
        const lastRead = JSON.parse(lastReadData)
        if (lastRead && lastRead.slug === pageSlug && lastRead.scrollTop) {
          setTimeout(() => {
            window.scrollTo({ top: lastRead.scrollTop, behavior: "smooth" })
          }, 500)
        }
      } catch (e) {}
    }
  }

  // =====================
  // Reading Progress & Time
  // =====================
  const topProgressBar = document.getElementById("reading-progress-bar") as HTMLElement | null
  const readingTimeInfo = document.getElementById("reading-time-info") as HTMLElement | null
  const readingTimeRemaining = document.getElementById(
    "reading-time-remaining",
  ) as HTMLElement | null

  // Calculate total read time from word count
  const text = articleContent.innerText || ""
  const wordCount = text.trim().split(/\s+/).length
  const wordsPerMinute = 200
  const totalMinutes = Math.ceil(wordCount / wordsPerMinute)

  const updateReadingProgress = () => {
    const docEl = document.documentElement
    const scrollTop = window.scrollY
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight

    if (scrollHeight <= 0) return

    const progress = Math.min(scrollTop / scrollHeight, 1)
    const progressPercent = Math.round(progress * 100)

    // Save reading progress to localStorage
    const articleTitle = document.querySelector(".article-title")?.textContent || ""
    if (articleTitle && progressPercent > 0 && progressPercent < 100) {
      localStorage.setItem(
        "quartz-last-read",
        JSON.stringify({
          title: articleTitle,
          slug: pageSlug,
          progress: progressPercent,
          path: window.location.pathname,
          scrollTop: scrollTop,
        }),
      )
    } else if (progressPercent >= 100) {
      localStorage.removeItem("quartz-last-read")
    }

    // Update top progress bar
    if (topProgressBar) {
      topProgressBar.style.width = `${progressPercent}%`
    }

    // Update reading time remaining
    if (readingTimeInfo && readingTimeRemaining) {
      const minutesRead = Math.round(progress * totalMinutes)
      const minutesLeft = Math.max(totalMinutes - minutesRead, 0)

      if (scrollTop > 100) {
        readingTimeInfo.style.display = "flex"
        const isEn = document.documentElement.classList.contains("lang-en")
        if (minutesLeft <= 0) {
          readingTimeRemaining.textContent = isEn ? "Done ✓" : "انتهيت ✓"
        } else if (minutesLeft === 1) {
          readingTimeRemaining.textContent = isEn ? "1 min" : "دقيقة"
        } else {
          readingTimeRemaining.textContent = isEn ? `${minutesLeft} m` : `${minutesLeft} د`
        }
      } else {
        readingTimeInfo.style.display = "none"
      }
    }
  }

  // Initial update
  updateReadingProgress()

  window.addEventListener("scroll", updateReadingProgress, { passive: true })
  window.addCleanup(() => window.removeEventListener("scroll", updateReadingProgress))


  // =====================
  // Text Selection Popover
  // =====================
  let selectionPopover = document.getElementById("selection-popover") as HTMLElement | null
  if (!selectionPopover) {
    selectionPopover = document.createElement("div")
    selectionPopover.id = "selection-popover"
    selectionPopover.className = "selection-popover"
    selectionPopover.innerHTML = `
      <button id="sel-copy" class="sel-btn" title="نسخ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>نسخ</span>
      </button>
      <button id="sel-share-x" class="sel-btn sel-btn-x" title="مشاركة على X">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span>مشاركة</span>
      </button>
    `
    document.body.appendChild(selectionPopover)
  }

  const hidePopover = () => {
    if (selectionPopover) selectionPopover.style.display = "none"
  }

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      hidePopover()
      return
    }

    // Only show if selection is inside the article
    const range = selection.getRangeAt(0)
    if (!articleContent.contains(range.commonAncestorContainer)) {
      hidePopover()
      return
    }

    const rect = range.getBoundingClientRect()
    if (!rect) return

    const popoverWidth = 160
    const x = rect.left + rect.width / 2 - popoverWidth / 2 + window.scrollX
    const y = rect.top + window.scrollY - 48

    if (selectionPopover) {
      selectionPopover.style.display = "flex"
      selectionPopover.style.left = `${Math.max(8, x)}px`
      selectionPopover.style.top = `${Math.max(8, y)}px`
    }
  }

  document.addEventListener("selectionchange", handleSelectionChange)
  window.addCleanup(() => document.removeEventListener("selectionchange", handleSelectionChange))

  // Copy button
  const copyBtn = document.getElementById("sel-copy") as HTMLButtonElement | null
  if (copyBtn) {
    const copyHandler = async () => {
      const text = window.getSelection()?.toString() ?? ""
      await navigator.clipboard.writeText(text).catch(() => {})
      const span = copyBtn.querySelector("span")
      if (span) {
        span.textContent = "تم!"
        setTimeout(() => {
          span.textContent = "نسخ"
        }, 1500)
      }
      hidePopover()
      window.getSelection()?.removeAllRanges()
    }
    copyBtn.addEventListener("click", copyHandler)
    window.addCleanup(() => copyBtn.removeEventListener("click", copyHandler))
  }

  // Share to X button
  const shareBtn = document.getElementById("sel-share-x") as HTMLButtonElement | null
  if (shareBtn) {
    const shareHandler = () => {
      const text = window.getSelection()?.toString() ?? ""
      const pageUrl = encodeURIComponent(window.location.href)
      const quote = encodeURIComponent(`"${text}"`)
      const xUrl = `https://x.com/intent/tweet?text=${quote}&url=${pageUrl}`
      window.open(xUrl, "_blank", "noopener,noreferrer")
      hidePopover()
      window.getSelection()?.removeAllRanges()
    }
    shareBtn.addEventListener("click", shareHandler)
    window.addCleanup(() => shareBtn.removeEventListener("click", shareHandler))
  }

  // Hide popover on outside click
  const hideOnClick = (e: MouseEvent) => {
    if (selectionPopover && !selectionPopover.contains(e.target as Node)) {
      setTimeout(() => {
        const sel = window.getSelection()
        if (!sel || sel.isCollapsed) hidePopover()
      }, 100)
    }
  }
  document.addEventListener("mousedown", hideOnClick)
  window.addCleanup(() => document.removeEventListener("mousedown", hideOnClick))
})
