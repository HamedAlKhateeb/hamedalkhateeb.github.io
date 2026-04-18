const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme")
const effectiveTheme = currentTheme ?? userPref
document.documentElement.setAttribute("saved-theme", effectiveTheme)

const emitThemeChangeEvent = (theme: "light" | "dark" | "sepia") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme: theme as any },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const themeOrder = ["light", "dark", "sepia", "auto"] as const

  const switchTheme = () => {
    // Current saved theme, using 'auto' if none is stored
    const currentSaved = localStorage.getItem("theme") ?? "auto"
    const currentIndex = themeOrder.indexOf(currentSaved as (typeof themeOrder)[number])
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const newTheme = themeOrder[nextIndex]
    
    if (newTheme === "auto") {
      localStorage.removeItem("theme")
      const autoTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      document.documentElement.setAttribute("saved-theme", autoTheme)
      emitThemeChangeEvent(autoTheme as "light" | "dark")
    } else {
      localStorage.setItem("theme", newTheme)
      document.documentElement.setAttribute("saved-theme", newTheme)
      emitThemeChangeEvent(newTheme as "light" | "dark" | "sepia")
    }
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const savedTheme = localStorage.getItem("theme")
    // Only apply system changes if in auto mode (no saved theme)
    if (savedTheme === null) {
      const newTheme = e.matches ? "dark" : "light"
      document.documentElement.setAttribute("saved-theme", newTheme)
      emitThemeChangeEvent(newTheme)
    }
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
