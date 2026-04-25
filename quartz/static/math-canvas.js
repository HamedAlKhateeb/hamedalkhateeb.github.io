// Math Canvas Animations - Loaded globally, listens for Quartz SPA nav events
document.addEventListener("nav", () => {
  // === Limit Animation ===
  const canvas = document.getElementById("limitAnimation");
  const btn = document.getElementById("limitRestartBtn");

  if (!canvas || !btn) return;

  const ctx = canvas.getContext("2d");
  let animId = null;
  let x = 0;
  const targetX = 3;

  function f(val) { return (val * val) / 2; }
  function mapX(val) { return 50 + val * 100; }
  function mapY(val) { return 350 - val * 50; }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.moveTo(50, 0); ctx.lineTo(50, 400);
    ctx.moveTo(0, 350); ctx.lineTo(500, 350);
    ctx.stroke();

    // Function curve
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i += 0.05) {
      let cx = mapX(i);
      let cy = mapY(f(i));
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Moving point
    let currentX = mapX(x);
    let currentY = mapY(f(x));

    // Projections (dashed)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.moveTo(currentX, 350); ctx.lineTo(currentX, currentY);
    ctx.moveTo(50, currentY); ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Point
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Approach algorithm
    x += (targetX - x) * 0.03;

    if (Math.abs(targetX - x) > 0.005) {
      animId = requestAnimationFrame(draw);
    } else {
      // Hollow circle (punctured neighborhood)
      ctx.beginPath();
      ctx.arc(mapX(targetX), mapY(f(targetX)), 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fafafa";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.stroke();
      animId = null;
    }
  }

  function startAnimation() {
    if (animId) cancelAnimationFrame(animId);
    x = 0;
    draw();
  }

  // Clone button to remove old listeners
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener("click", startAnimation);

  startAnimation();
});
