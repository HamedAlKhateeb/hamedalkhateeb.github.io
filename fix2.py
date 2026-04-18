path = 'E:/quartz/quartz/quartz/components/scripts/readingenhancements.inline.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re
text = re.sub(r'\\\\<svg', '\<svg', text)
text = text.replace('</svg>\\\\', '</svg>\')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)