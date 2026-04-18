path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re
old1 = '''          const para = paragraphs[idx] as HTMLElement | undefined
          if (para) {
            wrapper.classList.remove(\"is-bookmarked\")
            const icon = para.querySelector(\".bookmark-icon\")
            if (icon) icon.remove()
          }'''
new1 = '''          const para = paragraphs[idx] as HTMLElement | undefined
          if (para) {
            const wrapper = para.closest(\".bookmark-container\")
            if (wrapper) {
                wrapper.classList.remove(\"is-bookmarked\")
                const icon = wrapper.querySelector(\".bookmark-icon\")
                if (icon) {
                    icon.classList.remove(\"bookmark-active\")
                    icon.title = \"حفظ كعلامة مرجعية\"
                    icon.innerHTML = \<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path></svg>\
                }
            }
          }'''
text = text.replace(old1, new1)

old2 = '''      allParagraphs.forEach(para => {
        wrapper.classList.remove(\"is-bookmarked\")
        const icon = para.querySelector(\".bookmark-icon\")
        if (icon) icon.remove()
      })'''
new2 = '''      allParagraphs.forEach(para => {
        const wrapper = para.closest(\".bookmark-container\")
        if (wrapper) {
            wrapper.classList.remove(\"is-bookmarked\")
            const icon = wrapper.querySelector(\".bookmark-icon\")
            if (icon) {
                icon.classList.remove(\"bookmark-active\")
                icon.title = \"حفظ كعلامة مرجعية\"
                icon.innerHTML = \<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path></svg>\
            }
        }
      })'''
text = text.replace(old2, new2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)