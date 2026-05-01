document.addEventListener("nav", function() {
  var ITEMS = 8;
  var grid = document.getElementById("article-cards-grid");
  var pgEl = document.getElementById("article-pagination-controls");
  if (!grid || !pgEl) { return; }

  var cards = Array.from(grid.querySelectorAll("li.page-card"));
  if (cards.length <= ITEMS) { return; }

  var total = Math.ceil(cards.length / ITEMS);
  var cur = 1;
  pgEl.style.display = "flex";

  var mkBtn = function(lbl: string, tip: string, dis: boolean, act: boolean, fn: (() => void) | null) {
    var b = document.createElement("button");
    b.textContent = lbl;
    b.title = tip;
    b.disabled = !!dis;
    if (act) { b.classList.add("active"); }
    if (!dis && fn) { b.addEventListener("click", fn); }
    return b;
  };

  var render = function() {
    pgEl!.innerHTML = "";
    var mv = 5;
    var sp = Math.max(1, cur - 2);
    var ep = Math.min(total, sp + mv - 1);
    if ((ep - sp) < (mv - 1)) { sp = Math.max(1, ep - mv + 1); }

    pgEl!.appendChild(mkBtn("«", "الصفحة الأولى", (cur === 1), false, function() { go(1); }));
    pgEl!.appendChild(mkBtn("‹", "السابقة", (cur === 1), false, function() { go(cur - 1); }));

    if (sp > 1) {
      pgEl!.appendChild(mkBtn("1", "الصفحة 1", false, false, function() { go(1); }));
      if (sp > 2) {
        var d1 = document.createElement("span");
        d1.className = "page-info";
        d1.textContent = "…";
        pgEl!.appendChild(d1);
      }
    }

    for (var i = sp; i <= ep; i++) {
      (function(n: number) {
        pgEl!.appendChild(mkBtn(String(n), "صفحة " + n, false, (n === cur), function() { go(n); }));
      })(i);
    }

    if (ep < total) {
      if (ep < (total - 1)) {
        var d2 = document.createElement("span");
        d2.className = "page-info";
        d2.textContent = "…";
        pgEl!.appendChild(d2);
      }
      pgEl!.appendChild(mkBtn(String(total), "الصفحة الأخيرة", false, false, function() { go(total); }));
    }

    pgEl!.appendChild(mkBtn("›", "التالية", (cur === total), false, function() { go(cur + 1); }));
    pgEl!.appendChild(mkBtn("»", "الصفحة الأخيرة", (cur === total), false, function() { go(total); }));

    var inf = document.createElement("span");
    inf.className = "page-info";
    inf.textContent = "(" + cur + " / " + total + ")";
    pgEl!.appendChild(inf);
  };

  var go = function(n: number) {
    cur = n;
    var s = (n - 1) * ITEMS;
    var e = s + ITEMS;
    cards.forEach(function(c, i) {
      (c as HTMLElement).style.display = ((i >= s) && (i < e)) ? "" : "none";
    });
    render();
    var scrollTarget = (grid as HTMLElement).closest(".page-container") || grid;
    (scrollTarget as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  go(1);
});
