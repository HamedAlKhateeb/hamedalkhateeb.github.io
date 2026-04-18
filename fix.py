import re

with open('e:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'allParagraphs\.forEach\(\(para, index\) => \{.*?function injectBookmarkIcon'
replacement = '''allParagraphs.forEach((para, index) => {
      para.style.position = "relative"
      const isBookmarked = bookmarks.some(b => b.slug === pageSlug && b.index === index)
      if (isBookmarked) {
        para.classList.add("is-bookmarked")
      }
      injectBookmarkIcon(para, index, isBookmarked)
    })

    function injectBookmarkIcon'''

text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('e:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts', 'w', encoding='utf-8') as f:
    f.write(text)
