document.addEventListener('DOMContentLoaded', () => {
    
    // --- Calendar & Date Widget ---
    const updateCalendar = () => {
        const today = new Date();
        
        // Gregorian Date
        const gregorianOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const gregorianDate = today.toLocaleDateString('ar-EG', gregorianOptions);
        
        // Hijri Date
        const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const hijriDate = today.toLocaleDateString('ar-SA-u-ca-islamic', hijriOptions);
        
        // Day Name
        const dayName = today.toLocaleDateString('ar-EG', { weekday: 'long' });
        
        // Season
        const month = today.getMonth() + 1; // 1-12
        let season = 'فصل الربيع';
        let seasonIcon = 'fa-leaf';
        if (month >= 3 && month <= 5) {
            season = 'فصل الربيع';
            seasonIcon = 'fa-leaf';
        } else if (month >= 6 && month <= 8) {
            season = 'فصل الصيف';
            seasonIcon = 'fa-sun';
        } else if (month >= 9 && month <= 11) {
            season = 'فصل الخريف';
            seasonIcon = 'fa-wind';
        } else {
            season = 'فصل الشتاء';
            seasonIcon = 'fa-snowflake';
        }

        document.getElementById('cal-day-name').textContent = dayName;
        document.getElementById('cal-gregorian').textContent = gregorianDate;
        document.getElementById('cal-hijri').textContent = hijriDate;
        
        const seasonEl = document.querySelector('.season');
        seasonEl.innerHTML = `<i class="fa-regular ${seasonIcon}"></i> ${season}`;
    };

    updateCalendar();

    // --- Quote of the Day ---
    const fallbackQuotes = [
        { quote: "الناس أعداء ما جهلوا", author: "علي بن أبي طالب" },
        { quote: "على قدر أهل العزم تأتي العزائم", author: "المتنبي" },
        { quote: "الأيام صحائف الأعمار، فخلدوها بأحسن الأعمال", author: "ابن الجوزي" },
        { quote: "إنما الأمم الأخلاق ما بقيت، فإن هم ذهبت أخلاقهم ذهبوا", author: "أحمد شوقي" }
    ];

    const fetchQuote = async () => {
        const quoteEl = document.getElementById('daily-quote-text');
        const authorEl = document.getElementById('daily-quote-author');
        const refreshBtn = document.getElementById('refresh-quote');
        
        // Spin icon
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('fa-spin');

        try {
            // Note: Since we don't have a real token, this fetch will likely fail.
            // We use the fallback if it fails.
            const response = await fetch('https://kalimatapi.com/api/v1/quotes/random', { // used random instead of today for the refresh
                headers: { 'Authorization': "Bearer YOUR_TOKEN" } // Dummy token as per instructions
            });
            
            if (response.ok) {
                const data = await response.json();
                // Assuming data structure based on typical APIs
                quoteEl.textContent = `"${data.quote || data.content}"`;
                authorEl.textContent = `- ${data.author || data.author_name}`;
            } else {
                throw new Error('API limit or no token');
            }
        } catch (error) {
            console.log("Using fallback quotes due to API error or missing token.");
            const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteEl.textContent = `"${random.quote}"`;
            authorEl.textContent = `- ${random.author}`;
        } finally {
            setTimeout(() => {
                icon.classList.remove('fa-spin');
            }, 500); // just to show animation
        }
    };

    // Initial dummy fetch trigger if you want, but html has default.
    // fetchQuote();

    document.getElementById('refresh-quote').addEventListener('click', fetchQuote);

});
