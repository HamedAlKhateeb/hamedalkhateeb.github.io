function escapeHtml(text) {
  if (!text) return ""
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

async function sendEmailViaScript(scriptUrl, { to, subject, htmlBody }) {
  if (!scriptUrl || !to || !subject || !htmlBody) return null
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, htmlBody }),
      redirect: "follow",
    })
    return res.ok
  } catch (err) {
    console.error("Email send error:", err)
    return false
  }
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders })
    }

    try {
      const data = await request.json()
      const adminEmail = env.ADMIN_EMAIL || "hsmefh@gmail.com"
      const scriptUrl = env.GOOGLE_SCRIPT_URL || ""

      const authorName = data.author || "مجهول"
      const authorEmail = data.authorEmail || ""
      const authorWebsite = data.authorWebsite || ""
      const articleTitle = data.articleTitle || "بدون عنوان"
      const articleUrl = data.articleUrl || "#"
      const content = data.content || ""

      let telegramMsg = ""
      let adminEmailSubject = ""
      let adminEmailHtml = ""
      let commenterEmail = null

      const baseEmailStyle = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        direction: rtl;
        text-align: right;
        max-width: 620px;
        margin: 0 auto;
        padding: 24px;
        background-color: #faf8f5;
        border: 2px solid #000;
        border-radius: 8px;
        box-shadow: 4px 4px 0 #000;
        color: #1c1917;
      `

      if (data.actionType === "reaction") {
        const emoji = data.emoji || "🎭"
        telegramMsg = `تفاعل جديد ${emoji} 🎭\nبواسطة: ${authorName}${authorEmail ? ` (${authorEmail})` : ""}\nالمقال: ${articleTitle}\nالرابط: ${articleUrl}`

        adminEmailSubject = `${emoji} [مدونة حامد] تفاعل جديد من ${authorName}`
        adminEmailHtml = `
          <div style="${baseEmailStyle}">
            <h2 style="margin-top:0; color:#b45309; border-bottom:2px dashed #000; padding-bottom:10px;">🎭 تفاعل جديد مع المقال</h2>
            <p><strong>المتفاعل:</strong> ${escapeHtml(authorName)} ${authorEmail ? `(&lt;${escapeHtml(authorEmail)}&gt;)` : ""}</p>
            <p><strong>التفاعل:</strong> <span style="font-size:1.8em;">${emoji}</span></p>
            <p><strong>المقال:</strong> <a href="${escapeHtml(articleUrl)}" style="color:#b45309; font-weight:bold; text-decoration:underline;">${escapeHtml(articleTitle)}</a></p>
            <div style="margin-top:20px; text-align:center;">
              <a href="${escapeHtml(articleUrl)}" style="background:#f6c445; color:#000; font-weight:bold; padding:10px 20px; text-decoration:none; border:1.5px solid #000; border-radius:4px; display:inline-block;">الانتقال للمقال</a>
            </div>
          </div>
        `
      } else if (data.actionType === "like") {
        telegramMsg = `إعجاب جديد 👍\nبواسطة: ${authorName}${authorEmail ? ` (${authorEmail})` : ""}\nالمقال: ${articleTitle}\nالرابط: ${articleUrl}\n\nالتعليق المُعجب به:\n${content}`

        adminEmailSubject = `👍 [مدونة حامد] إعجاب جديد من ${authorName}`
        adminEmailHtml = `
          <div style="${baseEmailStyle}">
            <h2 style="margin-top:0; color:#b45309; border-bottom:2px dashed #000; padding-bottom:10px;">👍 إعجاب جديد بتعليق</h2>
            <p><strong>المُعجَب:</strong> ${escapeHtml(authorName)} ${authorEmail ? `(&lt;${escapeHtml(authorEmail)}&gt;)` : ""}</p>
            <p><strong>المقال:</strong> <a href="${escapeHtml(articleUrl)}" style="color:#b45309; font-weight:bold; text-decoration:underline;">${escapeHtml(articleTitle)}</a></p>
            <div style="background:#ffffff; border-right:4px solid #f6c445; padding:12px 16px; margin:15px 0; border:1.5px solid #000; border-radius:4px;">
              <div style="font-size:0.85em; color:#78716c; font-weight:bold; margin-bottom:5px;">التعليق المُعجب به:</div>
              <div style="color:#1c1917; line-height:1.6;">${escapeHtml(content)}</div>
            </div>
            <div style="margin-top:20px; text-align:center;">
              <a href="${escapeHtml(articleUrl)}" style="background:#f6c445; color:#000; font-weight:bold; padding:10px 20px; text-decoration:none; border:1.5px solid #000; border-radius:4px; display:inline-block;">الانتقال للمقال</a>
            </div>
          </div>
        `
      } else if (data.actionType === "delete") {
        telegramMsg = `تم حذف تعليق 🗑️\nبواسطة: ${authorName}\nالمقال: ${articleTitle}\nالرابط: ${articleUrl}\n\nالتعليق المحذوف:\n${content}`

        adminEmailSubject = `🗑️ [مدونة حامد] تم حذف تعليق بواسطة ${authorName}`
        adminEmailHtml = `
          <div style="${baseEmailStyle}">
            <h2 style="margin-top:0; color:#e53935; border-bottom:2px dashed #000; padding-bottom:10px;">🗑️ تم حذف تعليق</h2>
            <p><strong>بواسطة:</strong> ${escapeHtml(authorName)}</p>
            <p><strong>المقال:</strong> <a href="${escapeHtml(articleUrl)}" style="color:#b45309; font-weight:bold;">${escapeHtml(articleTitle)}</a></p>
            <div style="background:#ffffff; border-right:4px solid #e53935; padding:12px 16px; margin:15px 0; border:1.5px solid #000; border-radius:4px;">
              <div style="color:#1c1917; line-height:1.6;">${escapeHtml(content)}</div>
            </div>
          </div>
        `
      } else if (data.actionType === "reply") {
        if (!content || content.length < 2) {
          return new Response("Content too short", { status: 400, headers: corsHeaders })
        }

        const parentAuthor = data.parentAuthor || "تعليق سابق"
        const parentEmail = data.parentEmail || ""
        const parentContent = data.parentContent || ""

        telegramMsg = `رد جديد 💬:\nالاسم: ${authorName}${authorEmail ? ` (${authorEmail})` : ""}${authorWebsite ? `\nالموقع: ${authorWebsite}` : ""}\nرداً على: ${parentAuthor}${parentEmail ? ` (${parentEmail})` : ""}\nالمقال: ${articleTitle}\nالرابط: ${articleUrl}\n\nالمحتوى:\n${content}`

        adminEmailSubject = `💬 [مدونة حامد] رد جديد من ${authorName} على ${parentAuthor}`
        adminEmailHtml = `
          <div style="${baseEmailStyle}">
            <h2 style="margin-top:0; color:#b45309; border-bottom:2px dashed #000; padding-bottom:10px;">💬 رد جديد في المدونة</h2>
            <p><strong>صاحب الرد:</strong> ${escapeHtml(authorName)} ${authorEmail ? `(&lt;${escapeHtml(authorEmail)}&gt;)` : ""}</p>
            ${authorWebsite ? `<p><strong>الموقع:</strong> <a href="${escapeHtml(authorWebsite)}">${escapeHtml(authorWebsite)}</a></p>` : ""}
            <p><strong>رداً على:</strong> ${escapeHtml(parentAuthor)} ${parentEmail ? `(&lt;${escapeHtml(parentEmail)}&gt;)` : ""}</p>
            <p><strong>المقال:</strong> <a href="${escapeHtml(articleUrl)}" style="color:#b45309; font-weight:bold; text-decoration:underline;">${escapeHtml(articleTitle)}</a></p>
            
            ${
              parentContent
                ? `
            <div style="background:#f5f0e8; border-right:4px solid #78716c; padding:10px 14px; margin:12px 0; border-radius:4px;">
              <div style="font-size:0.85em; color:#78716c; font-weight:bold;">التعليق الأصلي (${escapeHtml(parentAuthor)}):</div>
              <div style="color:#57534e; font-style:italic; margin-top:4px;">${escapeHtml(parentContent)}</div>
            </div>`
                : ""
            }

            <div style="background:#ffffff; border-right:4px solid #b45309; padding:12px 16px; margin:15px 0; border:1.5px solid #000; border-radius:4px;">
              <div style="font-size:0.85em; color:#b45309; font-weight:bold; margin-bottom:5px;">نص الرد:</div>
              <div style="color:#1c1917; line-height:1.6; font-size:1.05em;">${escapeHtml(content)}</div>
            </div>

            <div style="margin-top:20px; text-align:center;">
              <a href="${escapeHtml(articleUrl)}" style="background:#f6c445; color:#000; font-weight:bold; padding:10px 24px; text-decoration:none; border:1.5px solid #000; border-radius:4px; box-shadow:2px 2px 0 #000; display:inline-block;">عرض الرد في المدونة</a>
            </div>
          </div>
        `

        // تجهيز إيميل تنبيه لصاحب التعليق الأصلي
        const isValidParentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)
        const isSelfReply = authorEmail && parentEmail && authorEmail.toLowerCase() === parentEmail.toLowerCase()

        if (isValidParentEmail && !isSelfReply) {
          commenterEmail = {
            to: parentEmail,
            subject: `💬 رد جديد على تعليقك في مدونة حامد الخطيب: ${articleTitle}`,
            htmlBody: `
              <div style="${baseEmailStyle}">
                <div style="text-align:center; margin-bottom:20px;">
                  <h2 style="color:#b45309; margin:0; font-size:1.5em;">مدونة حامد الخطيب</h2>
                  <div style="font-size:0.88em; color:#78716c; margin-top:4px;">hamedalkhateeb.pages.dev</div>
                </div>

                <p style="font-size:1.05em;">مرحباً <strong>${escapeHtml(parentAuthor)}</strong>،</p>
                <p>قام <strong>${escapeHtml(authorName)}</strong> بالرد على تعليقك في مقال: <strong><a href="${escapeHtml(articleUrl)}" style="color:#b45309; text-decoration:underline;">${escapeHtml(articleTitle)}</a></strong></p>

                ${
                  parentContent
                    ? `
                <div style="background:#f5f0e8; border-right:4px solid #a8a29e; padding:12px 16px; margin:16px 0; border-radius:6px; border:1px solid #e7e0d3;">
                  <div style="font-size:0.85em; color:#78716c; font-weight:bold; margin-bottom:4px;">تعليقك السابق:</div>
                  <div style="color:#57534e; font-style:italic; line-height:1.5;">"${escapeHtml(parentContent)}"</div>
                </div>`
                    : ""
                }

                <div style="background:#ffffff; border-right:4px solid #f6c445; padding:14px 18px; margin:18px 0; border-radius:6px; border:1.5px solid #000; box-shadow:2.5px 2.5px 0 #000;">
                  <div style="font-size:0.85em; color:#b45309; font-weight:bold; margin-bottom:6px;">نص الرد:</div>
                  <div style="color:#1c1917; font-size:1.05em; line-height:1.65;">${escapeHtml(content)}</div>
                </div>

                <div style="margin:28px 0 20px 0; text-align:center;">
                  <a href="${escapeHtml(articleUrl)}" style="background:#f6c445; color:#000; padding:12px 28px; text-decoration:none; border-radius:6px; font-weight:800; border:2px solid #000; box-shadow:3px 3px 0 #000; display:inline-block; font-size:1.02em;">
                    الانتقال للمقال وقراءة الرد 💬
                  </a>
                </div>

                <hr style="border:none; border-top:1.5px dashed #d6d3d1; margin:25px 0 15px 0;" />
                <p style="font-size:0.8em; color:#78716c; text-align:center; margin:0;">
                  تصلك هذه الرسالة لأنك علّقت على هذه التدوينة وسجّلت بريدك الإلكتروني لتلقي الإشعارات.
                </p>
              </div>
            `,
          }
        }
      } else {
        // تعليق جديد (Comment)
        if (!content || content.length < 2) {
          return new Response("Content too short", { status: 400, headers: corsHeaders })
        }

        telegramMsg = `تعليق جديد 📝:\nالاسم: ${authorName}${authorEmail ? `\nالبريد: ${authorEmail}` : ""}${authorWebsite ? `\nالموقع: ${authorWebsite}` : ""}\nالمقال: ${articleTitle}\nالرابط: ${articleUrl}\n\nالمحتوى:\n${content}`

        adminEmailSubject = `📝 [مدونة حامد] تعليق جديد من ${authorName}`
        adminEmailHtml = `
          <div style="${baseEmailStyle}">
            <h2 style="margin-top:0; color:#b45309; border-bottom:2px dashed #000; padding-bottom:10px;">📝 تعليق جديد في المدونة</h2>
            <p><strong>الكاتب:</strong> ${escapeHtml(authorName)} ${authorEmail ? `(&lt;${escapeHtml(authorEmail)}&gt;)` : ""}</p>
            ${authorWebsite ? `<p><strong>الموقع:</strong> <a href="${escapeHtml(authorWebsite)}">${escapeHtml(authorWebsite)}</a></p>` : ""}
            <p><strong>المقال:</strong> <a href="${escapeHtml(articleUrl)}" style="color:#b45309; font-weight:bold; text-decoration:underline;">${escapeHtml(articleTitle)}</a></p>

            <div style="background:#ffffff; border-right:4px solid #f6c445; padding:12px 16px; margin:15px 0; border:1.5px solid #000; border-radius:4px;">
              <div style="font-size:0.85em; color:#78716c; font-weight:bold; margin-bottom:5px;">نص التعليق:</div>
              <div style="color:#1c1917; line-height:1.6; font-size:1.05em;">${escapeHtml(content)}</div>
            </div>

            <div style="margin-top:20px; text-align:center;">
              <a href="${escapeHtml(articleUrl)}" style="background:#f6c445; color:#000; font-weight:bold; padding:10px 24px; text-decoration:none; border:1.5px solid #000; border-radius:4px; box-shadow:2px 2px 0 #000; display:inline-block;">الانتقال للمقال للرد عليه</a>
            </div>
          </div>
        `
      }

      // ── 1. إرسال إلى تيليجرام ──────────────────────────────────────────
      const token = "8545535543:AAEBfap1FHrHtSVDHk-ndS0RyKiMqvrICb0"
      const chatId = "1335342932"

      const telegramPromise = fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMsg,
        }),
      }).catch((e) => console.error("Telegram error:", e))

      // ── 2. إرسال البريد الإلكتروني (إن توفر رابط Google Apps Script) ───
      const emailPromises = []
      if (scriptUrl) {
        // إشعار صاحب المدونة
        if (adminEmail && adminEmailSubject && adminEmailHtml) {
          // إذا كان الرد مرسلاً من صاحب المدونة نفسه، فلا داعي لتنبيهه برده
          const isReplyByAdmin =
            data.actionType === "reply" &&
            authorEmail &&
            authorEmail.toLowerCase() === adminEmail.toLowerCase()

          if (!isReplyByAdmin) {
            emailPromises.push(
              sendEmailViaScript(scriptUrl, {
                to: adminEmail,
                subject: adminEmailSubject,
                htmlBody: adminEmailHtml,
              }),
            )
          }
        }

        // إشعار المعلق صاحب التعليق الأصلي عند الرد عليه
        if (commenterEmail) {
          emailPromises.push(
            sendEmailViaScript(scriptUrl, {
              to: commenterEmail.to,
              subject: commenterEmail.subject,
              htmlBody: commenterEmail.htmlBody,
            }),
          )
        }
      }

      await Promise.all([telegramPromise, ...emailPromises])

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Worker error:", error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
  },
}
