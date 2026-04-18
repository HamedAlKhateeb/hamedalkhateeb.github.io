const fs = require('fs');
const path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts';
let text = fs.readFileSync(path, 'utf8');

text = text.replace(
\  allParagraphs.forEach((para, index) => {
      para.style.position = "relative"
      const isBookmarked = bookmarks.some(b => b.slug === pageSlug && b.index === index)
      if (isBookmarked) {
        para.classList.add("is-bookmarked")
      }
      injectBookmarkIcon(para, index, isBookmarked)
    })

    function injectBookmarkIcon(para: HTMLElement, index: number, active: boolean) {
    const existing = para.querySelector(".bookmark-icon")\,
\  allParagraphs.forEach((para, index) => {
      const wrapper = document.createElement("div")
      wrapper.className = "bookmark-container"
      para.parentNode?.insertBefore(wrapper, para)
      wrapper.appendChild(para)

      const isBookmarked = bookmarks.some(b => b.slug === pageSlug && b.index === index)
      if (isBookmarked) {
        wrapper.classList.add("is-bookmarked")
      }
      injectBookmarkIcon(para, wrapper, index, isBookmarked)
    })

    function injectBookmarkIcon(para: HTMLElement, wrapper: HTMLElement, index: number, active: boolean) {
    const existing = wrapper.querySelector(".bookmark-icon")\
);

text = text.replace(\para.appendChild(icon)\, \wrapper.appendChild(icon)\);

text = text.replace(
\        const paragraphs = articleContent.querySelectorAll("p, blockquote, li")
        const para = paragraphs[idx] as HTMLElement | undefined
        if (para) {
          para.classList.remove("is-bookmarked")
          const icon = para.querySelector(".bookmark-icon")
          if (icon) icon.remove()
        }\,
\        const paragraphs = articleContent.querySelectorAll("p, blockquote, li")
        const para = paragraphs[idx] as HTMLElement | undefined
        if (para) {
          const wrapper = para.closest(".bookmark-container")
          if (wrapper) {
            wrapper.classList.remove("is-bookmarked")
            const icon = wrapper.querySelector(".bookmark-icon")
            if (icon) icon.remove()
          }
        }\
);

text = text.replace(
\      allParagraphs.forEach(para => {
        para.classList.remove("is-bookmarked")
        const icon = para.querySelector(".bookmark-icon")
        if (icon) icon.remove()
      })\,
\      allParagraphs.forEach(para => {
        const wrapper = para.closest(".bookmark-container")
        if (wrapper) {
          wrapper.classList.remove("is-bookmarked")
          const icon = wrapper.querySelector(".bookmark-icon")
          if (icon) icon.remove()
        }
      })\
);

// Oh wait, in injectBookmarkIcon event listener, 'para.classList.add' and 'para.classList.remove'
text = text.replaceAll(\para.classList.remove("is-bookmarked")\, \wrapper.classList.remove("is-bookmarked")\);
text = text.replaceAll(\para.classList.add("is-bookmarked")\, \wrapper.classList.add("is-bookmarked")\);

fs.writeFileSync(path, text);
console.log("Done");