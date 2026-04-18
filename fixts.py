path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('wrapper.classList.remove(\"is-bookmarked\")', 'const wrapper = para.closest(\".bookmark-container\"); if (wrapper) wrapper.classList.remove(\"is-bookmarked\")', 1)

text = text.replace('const icon = wrapper.querySelector(\".bookmark-icon\")', 'const icon = wrapper.querySelector(\".bookmark-icon\") as HTMLElement | null')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)