const fs = require('fs');
let content = fs.readFileSync('e:/quartz/quartz/content/دليل_كتابة_المقالات_العلمية.md', 'utf8');

// Replace "build\nP = \\frac{1}{4}\nbuild" with "$$\nP = \\frac{1}{4}\n$$"
content = content.replace(/build\s+P = \\frac\{1\}\{4\}\s+build/g, "$$\nP = \\frac{1}{4}\n$$");

// Replace "\\\" with "```"
content = content.replace(/\\\\\\/g, "```");

// Replace "buildCURSORbuild" with "$$CURSOR$$"
content = content.replace(/buildCURSORbuild/g, "$$CURSOR$$");

fs.writeFileSync('e:/quartz/quartz/content/دليل_كتابة_المقالات_العلمية.md', content, 'utf8');
