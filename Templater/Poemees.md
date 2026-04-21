<%*
const rawText = await tp.system.prompt("أدخل الأبيات (شطر = شطر ,):", "", true);
if (rawText) {
    let output = '<div class="poem-wrapper">\n';
    const verses = rawText.split(/[,،\n]/).filter(v => v.trim() !== '');
    
    verses.forEach(verse => {
        const shatrs = verse.split('=');
        if (shatrs.length === 2) {
            output += `  <div class="bayt">\n    <div class="shatr">${shatrs[0].trim()}</div>\n    <div class="shatr">${shatrs[1].trim()}</div>\n  </div>\n`;
        } else {
            output += `  <div class="bayt">\n    <div class="shatr center-shatr">${verse.trim()}</div>\n  </div>\n`;
        }
    });
    
    output += '</div>';
    tR += output;
}
%>