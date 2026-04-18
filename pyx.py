import re

path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('para.appendChild(icon)', 'wrapper.appendChild(icon)')

text = text.replace('para.classList.remove(\"is-bookmarked\")', 'wrapper.classList.remove(\"is-bookmarked\")')
text = text.replace('para.classList.add(\"is-bookmarked\")', 'wrapper.classList.add(\"is-bookmarked\")')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)