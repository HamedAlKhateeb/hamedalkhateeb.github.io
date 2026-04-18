document.addEventListener("nav", () => {
  // Only run on article/content pages (not home/index or tags)
  const articleContent = document.querySelector(".center.article") as HTMLElement | null
  if (!articleContent) return

  const pageSlug = document.body.dataset.slug ?? ""
  if (pageSlug === "index" || pageSlug.endsWith("/index") || pageSlug.startsWith("tags/")) return

  // =====================
  // Reading Progress & Time
  // =====================
  const topProgressBar = document.getElementById("reading-progress-bar") as HTMLElement | null
  const progressRingCircle = document.querySelector(".progress-ring__circle") as SVGCircleElement | null
  const readingTimeInfo = document.getElementById("reading-time-info") as HTMLElement | null
  const readingTimeRemaining = document.getElementById("reading-time-remaining") as HTMLElement | null

  // Calculate total read time from word count
  const text = articleContent.innerText || ""
  const wordCount = text.trim().split(/\s+/).length
  const wordsPerMinute = 200
  const totalMinutes = Math.ceil(wordCount / wordsPerMinute)

  // SVG ring circumference: 2*pi*r = 2*pi*23 ≈ 144.5
  const RING_CIRCUMFERENCE = 144.5

  const updateReadingProgress = () => {
    const docEl = document.documentElement
    const scrollTop = window.scrollY
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight

    if (scrollHeight <= 0) return

    const progress = Math.min(scrollTop / scrollHeight, 1)
    const progressPercent = Math.round(progress * 100)

    // Update top progress bar
    if (topProgressBar) {
      topProgressBar.style.width = `${progressPercent}%`
    }

    // Update circular ring on gear button
    if (progressRingCircle) {
      const offset = RING_CIRCUMFERENCE - progress * RING_CIRCUMFERENCE
      progressRingCircle.style.strokeDashoffset = String(offset)
    }

    // Update reading time remaining
    if (readingTimeInfo && readingTimeRemaining) {
      const minutesRead = Math.round(progress * totalMinutes)
      const minutesLeft = Math.max(totalMinutes - minutesRead, 0)

      if (scrollTop > 100) {
        readingTimeInfo.style.display = "flex"
        if (minutesLeft <= 0) {
          readingTimeRemaining.textContent = "انتهيت ✓"
        } else if (minutesLeft === 1) {
          readingTimeRemaining.textContent = "دقيقة"
        } else {
          readingTimeRemaining.textContent = `${minutesLeft} د`
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
  // Paragraph Hover Bookmarks
  // =====================
  const BOOKMARK_KEY = "reader-bookmarks"

  type Bookmark = {
    slug: string
    text: string
    index: number
  }

  const getBookmarks = (): Bookmark[] => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]")
    } catch {
      return []
    }
  }

  const saveBookmarks = (bms: Bookmark[]) => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bms))
  }

  const renderBookmarkPanel = () => {
    const container = document.getElementById("bookmarks-container")
    if (!container) return

    const all = getBookmarks()
    const pageBookmarks = all.filter(b => b.slug === pageSlug)

    if (pageBookmarks.length === 0) {
      container.innerHTML = `<div class="empty-bookmarks">لا توجد علامات مرجعية بعد. يمكنك حفظ أي فقرة عند القراءة.</div>`
      return
    }

    container.innerHTML = pageBookmarks.map((bm, i) => `
      <div class="bookmark-item" data-index="${bm.index}">
        <span class="bookmark-text">${bm.text.substring(0, 80)}${bm.text.length > 80 ? "…" : ""}</span>
        <button class="bookmark-remove" data-bm-index="${bm.index}" title="حذف">×</button>
      </div>
    `).join("")

    // Click to scroll to paragraph
    container.querySelectorAll<HTMLElement>(".bookmark-item").forEach(item => {
      item.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).classList.contains("bookmark-remove")) return
        const idx = parseInt(item.dataset.index ?? "0")
        const paragraphs = articleContent.querySelectorAll("p, blockquote, li")
        const target = paragraphs[idx] as HTMLElement | undefined
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" })
          target.classList.add("bookmark-flash")
          setTimeout(() => target.classList.remove("bookmark-flash"), 1200)
        }
      })
    })

    // Remove bookmark button
    container.querySelectorAll<HTMLElement>(".bookmark-remove").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const idx = parseInt(btn.dataset.bmIndex ?? "0")
        const all = getBookmarks()
        const updated = all.filter(b => !(b.slug === pageSlug && b.index === idx))
        saveBookmarks(updated)
        renderBookmarkPanel()
        // Also remove icon from paragraph
        const paragraphs = articleContent.querySelectorAll("p, blockquote, li")
        const para = paragraphs[idx] as HTMLElement | undefined
        if (para) {
          para.classList.remove("is-bookmarked")
          const icon = para.querySelector(".bookmark-icon")
          if (icon) icon.remove()
        }
      })
    })
  }

  // Inject bookmark icons into paragraphs on hover
  const allParagraphs = articleContent.querySelectorAll<HTMLElement>("p, blockquote, li")
  const bookmarks = getBookmarks()

  allParagraphs.forEach((para, index) => {
    // Set position relative for absolute icon placement
    para.style.position = "relative"

    // Check if already bookmarked
    const isBookmarked = bookmarks.some(b => b.slug === pageSlug && b.index === index)
    if (isBookmarked) {
      para.classList.add("is-bookmarked")
      injectBookmarkIcon(para, index, true)
    }

    const showIcon = () => {
      if (!para.querySelector(".bookmark-icon")) {
        injectBookmarkIcon(para, index, para.classList.contains("is-bookmarked"))
      }
    }

    const hideIcon = () => {
      if (!para.classList.contains("is-bookmarked")) {
        const icon = para.querySelector(".bookmark-icon")
        if (icon) icon.remove()
      }
    }

    para.addEventListener("mouseenter", showIcon)
    para.addEventListener("mouseleave", hideIcon)

    window.addCleanup(() => {
      para.removeEventListener("mouseenter", showIcon)
      para.removeEventListener("mouseleave", hideIcon)
    })
  })

  function injectBookmarkIcon(para: HTMLElement, index: number, active: boolean) {
    const existing = para.querySelector(".bookmark-icon")
    if (existing) {
      existing.classList.toggle("bookmark-active", active)
      return
    }

    const icon = document.createElement("button")
    icon.className = `bookmark-icon${active ? " bookmark-active" : ""}`
    icon.title = active ? "إزالة العلامة المرجعية" : "حفظ كعلامة مرجعية"
    icon.setAttribute("aria-label", "bookmark")
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${active ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`

    icon.addEventListener("click", (e) => {
      e.stopPropagation()
      const all = getBookmarks()
      const exists = all.find(b => b.slug === pageSlug && b.index === index)

      if (exists) {
        // Remove
        const updated = all.filter(b => !(b.slug === pageSlug && b.index === index))
        saveBookmarks(updated)
        para.classList.remove("is-bookmarked")
        icon.classList.remove("bookmark-active")
        icon.title = "حفظ كعلامة مرجعية"
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
      } else {
        // Add
        const text = para.innerText || ""
        all.push({ slug: pageSlug, text, index })
        saveBookmarks(all)
        para.classList.add("is-bookmarked")
        icon.classList.add("bookmark-active")
        icon.title = "إزالة العلامة المرجعية"
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
      }
      renderBookmarkPanel()
    })

    para.appendChild(icon)
  }

  // Clear all bookmarks for this page
  const clearBtn = document.getElementById("btn-clear-bookmarks") as HTMLButtonElement | null
  if (clearBtn) {
    const clearHandler = () => {
      const all = getBookmarks()
      const updated = all.filter(b => b.slug !== pageSlug)
      saveBookmarks(updated)
      // Remove all bookmark classes and icons
      allParagraphs.forEach(para => {
        para.classList.remove("is-bookmarked")
        const icon = para.querySelector(".bookmark-icon")
        if (icon) icon.remove()
      })
      renderBookmarkPanel()
    }
    clearBtn.addEventListener("click", clearHandler)
    window.addCleanup(() => clearBtn.removeEventListener("click", clearHandler))
  }

  // Initial render of bookmarks panel
  renderBookmarkPanel()

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
      if (span) { span.textContent = "تم!"; setTimeout(() => { span.textContent = "نسخ" }, 1500) }
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
