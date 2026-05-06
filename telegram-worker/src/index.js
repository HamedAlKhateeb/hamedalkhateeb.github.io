export default {
  async fetch(request, env, ctx) {
    // إعدادات CORS للسماح لموقعك بالاتصال بهذا الرابط
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // الرد على طلبات الفحص المبدئي (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();

      let message = "";

      if (data.actionType === "reaction") {
        message = `تفاعل جديد ${data.emoji} 🎭\nبواسطة: ${data.author || "مجهول"}\nالمقال: ${data.articleTitle || "غير معروف"}\nالرابط: ${data.articleUrl || "غير معروف"}`;
      } else if (data.actionType === "like") {
        message = `إعجاب جديد 👍\nبواسطة: ${data.author || "مجهول"}\nالمقال: ${data.articleTitle || "غير معروف"}\nالرابط: ${data.articleUrl || "غير معروف"}\n\nالتعليق المُعجب به:\n${data.content}`;
      } else if (data.actionType === "delete") {
        message = `تم حذف تعليق 🗑️\nالمقال: ${data.articleTitle || "غير معروف"}\nالرابط: ${data.articleUrl || "غير معروف"}`;
      } else {
        // منع السبام في التعليقات
        if (!data.content || data.content.length < 3) {
          return new Response("Content too short", { status: 400, headers: corsHeaders });
        }
        message = `تعليق جديد 📝:\nالاسم: ${data.author || "مجهول"}\nالمقال: ${data.articleTitle || "غير معروف"}\nالرابط: ${data.articleUrl || "غير معروف"}\n\nالمحتوى:\n${data.content}`;
      }

      const token = "8545535543:AAEBfap1FHrHtSVDHk-ndS0RyKiMqvrICb0";
      const chatId = "1335342932";

      // إرسال الطلب إلى تيليجرام
      const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (!telegramResponse.ok) {
        return new Response("Telegram API Error", { status: 500, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
    }
  },
};