document.addEventListener("nav", () => {
  // =====================
  // Floating Actions
  // =====================
  const scrollTopBtn = document.querySelector("#btn-scroll-top") as HTMLButtonElement | null
  if (scrollTopBtn) {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
    scrollTopBtn.addEventListener("click", scrollToTop)
    window.addCleanup(() => scrollTopBtn.removeEventListener("click", scrollToTop))
  }

  // =====================
  // Smart Scroll for Floating Actions
  // =====================
  const scrollTopDock = document.querySelector(".scroll-to-top-dock") as HTMLElement | null

  if (scrollTopDock) {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
              // Scrolling down - hide
              scrollTopDock.style.transform = "translateY(150%)"
              scrollTopDock.style.opacity = "0"
            } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
              // Scrolling up - show
              scrollTopDock.style.transform = "translateY(0)"
              scrollTopDock.style.opacity = "1"
            }
          } else {
            // At top - always show
            scrollTopDock.style.transform = "translateY(0)"
            scrollTopDock.style.opacity = "1"
          }
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    scrollTopDock.style.transition = "transform 0.4s ease, opacity 0.4s ease"

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addCleanup(() => window.removeEventListener("scroll", handleScroll))
  }
})
