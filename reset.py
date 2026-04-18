path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. remove button handler
text = re.sub(r'const wrapper = para\.closest\(\".bookmark-container\"\); if \(wrapper\) wrapper\.classList\.remove\(\"is-bookmarked\"\)', 'para.classList.remove("is-bookmarked")', text)

# 2. inject
text = re.sub(r'    allParagraphs\.forEach\(\(para, index\) => \{\s+// Wrap paragraph safely with parent container\s+const wrapper = document\.createElement\(\"div\"\)\s+wrapper\.className = \"bookmark-container\"\s+para\.parentNode\?\.insertBefore\(wrapper, para\)\s+wrapper\.appendChild\(para\)\s+const isBookmarked = bookmarks\.some\(b => b\.slug === pageSlug && b\.index === index\)\s+if \(isBookmarked\) \{\s+wrapper\.classList\.add\(\"is-bookmarked\"\)\s+\}\s+injectBookmarkIcon\(para, wrapper, index, isBookmarked\)\s+\}\)', 
'''    allParagraphs.forEach((para, index) => {
      para.style.position = "relative"
      const isBookmarked = bookmarks.some(b => b.slug === pageSlug && b.index === index)
      if (isBookmarked) {
        para.classList.add("is-bookmarked")
      }
      injectBookmarkIcon(para, index, isBookmarked)
    })''', text)

text = re.sub(r'function injectBookmarkIcon\(para: HTMLElement, wrapper: HTMLElement, index: number, active: boolean\) \{[^{}]*const existing = wrapper\.querySelector\(\".bookmark-icon\"\)[^{}]*if \(existing\) \{', 
'''function injectBookmarkIcon(para: HTMLElement, index: number, active: boolean) {
      const existing = para.querySelector(".bookmark-icon")
      if (existing) {''', text)

text = re.sub(r'wrapper\.classList\.remove\(\"is-bookmarked\"\)', 'para.classList.remove("is-bookmarked")', text)
text = re.sub(r'wrapper\.classList\.add\(\"is-bookmarked\"\)', 'para.classList.add("is-bookmarked")', text)

text = text.replace('wrapper.appendChild(icon)', 'para.appendChild(icon)')

# clear button
text = re.sub(r'        allParagraphs\.forEach\(para => \{\s+const wrapper = para\.closest\(\".bookmark-container\"\)\s+if \(wrapper\) \{\s+para\.classList\.remove\(\"is-bookmarked\"\)\s+const icon = wrapper\.querySelector\(\".bookmark-icon\"\) as HTMLElement \| null\s+if \(icon\) \{\s+icon\.classList\.remove\(\"bookmark-active\"\)',
'''        allParagraphs.forEach(para => {
          para.classList.remove("is-bookmarked")
          const icon = para.querySelector(".bookmark-icon") as HTMLElement | null
          if (icon) {
            icon.classList.remove("bookmark-active")''', text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)