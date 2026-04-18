      container.innerHTML = pageBookmarks.map((bm, i) => 
        <div class="bookmark-item" data-index="${bm.index}">
          <div class="bookmark-content">
            <span class="bookmark-title">?????</span>
            <p class="bookmark-text">${bm.text.substring(0, 80)}${bm.text.length > 80 ? "…" : ""}</p>
          </div>
          <button class="bookmark-remove" data-bm-index="${bm.index}" title="???">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ).join("")

      // Click to scroll to paragraph
      container.querySelectorAll<HTMLElement>(".bookmark-item").forEach(item => {
        item.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).classList.contains("bookmark-remove") || (e.target as HTMLElement).closest(".bookmark-remove")) return
          const idx = parseInt(item.dataset.index ?? "0")
