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

  // === Epsilon-Delta Animations ===
  // Wait a tiny bit for the DOM to render the canvases
  setTimeout(() => {
    const P = {
      bg:'#f5f2ec', white:'#ffffff', text:'#1c1a16', muted:'#857f72',
      amber:'#8a6818', amberF:'rgba(138,104,24,.11)', amberS:'rgba(138,104,24,.6)',
      teal:'#1a6e5c',  tealF:'rgba(26,110,92,.11)',   tealS:'rgba(26,110,92,.6)',
      red:'#8a2e20',   redF:'rgba(138,46,32,.1)',      redS:'rgba(138,46,32,.55)',
      grid:'rgba(0,0,0,.055)', axis:'rgba(28,26,22,.45)', curve:'#1c1a16'
    };
    function tp(M, xMin, xMax, yMin, yMax, W, H) {
      return (x, y) => ({
        x: M.l + (x - xMin) / (xMax - xMin) * (W - M.l - M.r),
        y: M.t + (H - M.t - M.b) * (1 - (y - yMin) / (yMax - yMin))
      });
    }
    function axes(ctx, T, M, W, H, xMn, xMx, yMn, yMx, xs, ys) {
      ctx.strokeStyle = P.grid; ctx.lineWidth = .5;
      for (let x = Math.ceil(xMn); x <= xMx; x += xs) {
        const p = T(x, yMn);
        ctx.beginPath(); ctx.moveTo(p.x, M.t); ctx.lineTo(p.x, H - M.b); ctx.stroke();
      }
      for (let y = Math.ceil(yMn / ys) * ys; y <= yMx; y += ys) {
        const p = T(xMn, y);
        ctx.beginPath(); ctx.moveTo(M.l, p.y); ctx.lineTo(W - M.r, p.y); ctx.stroke();
      }
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1;
      const axY = Math.max(M.t, Math.min(H - M.b, T(0, 0).y));
      const axX = Math.max(M.l, Math.min(W - M.r, T(0, 0).x));
      ctx.beginPath(); ctx.moveTo(M.l, axY); ctx.lineTo(W - M.r + 8, axY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(axX, M.t - 8); ctx.lineTo(axX, H - M.b); ctx.stroke();
      ctx.fillStyle = P.muted; ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      for (let x = Math.ceil(xMn); x <= xMx; x += xs) {
        if (Math.abs(x) < 1e-9) continue;
        const p = T(x, 0);
        if (p.y + 14 < H) ctx.fillText(x, p.x, Math.min(axY + 14, H - M.b + 14));
      }
      ctx.textAlign = 'right';
      for (let y = Math.ceil(yMn / ys) * ys; y <= yMx; y += ys) {
        if (Math.abs(y) < 1e-9) continue;
        const p = T(xMn, y);
        ctx.fillText(y % 1 === 0 ? y : y.toFixed(1), M.l - 4, p.y + 4);
      }
    }
    function bands(ctx, T, M, W, H, c, L, eps, delta, yMn, yMx, xMn, xMx) {
      const yT = T(0, Math.min(L + eps, yMx + 2)).y;
      const yB = T(0, Math.max(L - eps, yMn - 2)).y;
      const xL = T(Math.max(c - delta, xMn - 0.5), 0).x;
      const xR2 = T(Math.min(c + delta, xMx + 0.5), 0).x;
      ctx.fillStyle = P.amberF; ctx.fillRect(M.l, yT, W - M.r - M.l, yB - yT);
      ctx.strokeStyle = P.amberS; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(M.l, yT); ctx.lineTo(W - M.r, yT); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(M.l, yB); ctx.lineTo(W - M.r, yB); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = P.tealF; ctx.fillRect(xL, M.t, xR2 - xL, H - M.t - M.b);
      ctx.strokeStyle = P.tealS; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(xL, M.t); ctx.lineTo(xL, H - M.b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xR2, M.t); ctx.lineTo(xR2, H - M.b); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = P.amber; ctx.font = 'italic 11px serif'; ctx.textAlign = 'left';
      ctx.fillText('L+ε', M.l + 3, yT - 3); ctx.fillText('L−ε', M.l + 3, yB + 11);
      ctx.fillStyle = P.teal; ctx.textAlign = 'center';
      ctx.fillText('c−δ', xL, H - M.b + 13); ctx.fillText('c+δ', xR2, H - M.b + 13);
    }
    function curve(ctx, T, fn, x0, x1, step, skipNear) {
      ctx.lineWidth = 2; ctx.strokeStyle = P.curve; ctx.beginPath();
      let go = false;
      for (let x = x0; x <= x1 + step * .5; x += step) {
        const xc = Math.min(x, x1);
        if (skipNear !== undefined && Math.abs(xc - skipNear) < step * 1.5) { go = false; continue; }
        const y = fn(xc);
        if (!isFinite(y)) { go = false; continue; }
        const p = T(xc, y);
        go ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); go = true;
      }
      ctx.stroke();
    }
    function dot(ctx, T, x, y, fill, r, col) {
      const p = T(x, y);
      ctx.beginPath(); ctx.arc(p.x, p.y, r || 5, 0, Math.PI * 2);
      if (fill) { ctx.fillStyle = col || P.amber; ctx.fill(); }
      else { ctx.strokeStyle = col || P.amber; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.white; ctx.fill(); }
    }
    function guide(ctx, T, x, y, M, H) {
      ctx.setLineDash([4, 3]); ctx.strokeStyle = 'rgba(138,104,24,.3)'; ctx.lineWidth = 1;
      const p = T(x, y);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(M.l, p.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, H - M.b); ctx.stroke();
      ctx.setLineDash([]);
    }
  
    if(document.getElementById('nlC')) {
      const cv = document.getElementById('nlC');
      const ctx = cv.getContext('2d');
      const W = cv.width, H = cv.height;
      const c = 2, d = 0.8, xMn = 0, xMx = 4;
      const M = {l:70, r:70, t:28, b:18};
      function lp(x) { return M.l + (x - xMn) / (xMx - xMn) * (W - M.l - M.r); }
      const y = H / 2 + 6;
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const lx = lp(c - d), rx = lp(c + d);
      ctx.fillStyle = P.tealF; ctx.fillRect(lx, y - 13, rx - lx, 26);
      ctx.strokeStyle = P.tealS; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lx, y - 17); ctx.lineTo(lx, y + 17); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx, y - 17); ctx.lineTo(rx, y + 17); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(M.l - 12, y); ctx.lineTo(W - M.r + 12, y); ctx.stroke();
      for (let x = 0; x <= 4; x += .5) {
        const px = lp(x), ii = Number.isInteger(x);
        ctx.strokeStyle = ii ? P.axis : 'rgba(28,26,22,.25)'; ctx.lineWidth = ii ? 1 : .5;
        ctx.beginPath(); ctx.moveTo(px, y - (ii ? 7 : 4)); ctx.lineTo(px, y + (ii ? 7 : 4)); ctx.stroke();
        if (ii) { ctx.fillStyle = P.muted; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(x, px, y + 17); }
      }
      ctx.fillStyle = P.teal; ctx.font = 'italic 12px serif'; ctx.textAlign = 'center';
      ctx.fillText('c−δ = 1.2', lx, y - 21); ctx.fillText('c+δ = 2.8', rx, y - 21);
      const cx_ = lp(c);
      ctx.beginPath(); ctx.arc(cx_, y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.white; ctx.fill();
      ctx.fillStyle = P.amber; ctx.font = 'italic 13px serif'; ctx.textAlign = 'center';
      ctx.fillText('c = 2', cx_, y - 21);
      ctx.fillStyle = 'rgba(138,104,24,.55)'; ctx.font = '10px sans-serif';
      ctx.fillText('(مستبعدة)', cx_, y - 11);
    }
  
    if(document.getElementById('ex1C')) {
      const cv = document.getElementById('ex1C');
      const ctx = cv.getContext('2d');
      const sl = document.getElementById('ex1S');
      const C = 2, L = 4, xMn = 0, xMx = 4.4, yMn = 0, yMx = 20;
      const M = {l: 50, r: 16, t: 16, b: 40};
      function dlt(e) { const dr = Math.sqrt(4+e)-2, dl = e<4?2-Math.sqrt(4-e):2; return Math.min(dl,dr); }
      function draw(eps) {
        const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);
        ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
        bands(ctx,T,M,W,H,C,L,eps,dlt(eps),yMn,yMx,xMn,xMx);
        axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,5);
        curve(ctx,T,x=>x*x,xMn,xMx,.015);
        guide(ctx,T,C,L,M,H);
        dot(ctx,T,C,L,true);
        const pCL=T(C,L);
        ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=4',M.l-3,pCL.y+4);
        ctx.textAlign='center';ctx.fillText('c=2',pCL.x,H-M.b+13);
        ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = x²',W-M.r-4,M.t+13);
      }
      function upd() {
        const e=+sl.value, d=dlt(e);
        document.getElementById('ex1V').textContent=e.toFixed(2);
        document.getElementById('ex1E').textContent=e.toFixed(4);
        document.getElementById('ex1D').textContent=d.toFixed(4);
        draw(e);
      }
      sl.addEventListener('input',upd); upd();
    }
  
    if(document.getElementById('ex2C')) {
      const cv=document.getElementById('ex2C');
      const ctx=cv.getContext('2d');
      const sl=document.getElementById('ex2S');
      const C=2,L=4,xMn=-0.5,xMx=4.5,yMn=-1,yMx=8;
      const M={l:44,r:16,t:16,b:38};
      function draw(eps) {
        const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);
        ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
        bands(ctx,T,M,W,H,C,L,eps,eps,yMn,yMx,xMn,xMx);
        axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,2);
        curve(ctx,T,x=>x+2,xMn,xMx,.015,C);
        dot(ctx,T,C,L,false);
        guide(ctx,T,C,L,M,H);
        const pCL=T(C,L);
        ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=4',M.l-3,pCL.y+4);
        ctx.textAlign='center';ctx.fillText('c=2',pCL.x,H-M.b+13);
        ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.fillText('ثقب — غير معرّف',pCL.x,pCL.y-15);
        ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = (x²−4)/(x−2)',W-M.r-2,M.t+13);
      }
      function upd() {
        const e=+sl.value;
        document.getElementById('ex2V').textContent=e.toFixed(2);
        document.getElementById('ex2E').textContent=e.toFixed(4);
        document.getElementById('ex2D').textContent=e.toFixed(4);
        draw(e);
      }
      sl.addEventListener('input',upd); upd();
    }
  
    if(document.getElementById('ex3C')) {
      const cv=document.getElementById('ex3C');
      const ctx=cv.getContext('2d');
      const sl=document.getElementById('ex3S');
      const C=0,L=1,xMn=-4,xMx=4,yMn=-.3,yMx=1.4;
      const M={l:44,r:16,t:16,b:38};
      function cmpDelta(eps) {
        let lo=.001,hi=3;
        for(let i=0;i<50;i++){const m=(lo+hi)/2; Math.abs(Math.sin(m)/m-1)<eps?lo=m:hi=m;}
        return (lo+hi)/2;
      }
      function draw(eps) {
        const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);
        const d=cmpDelta(eps);
        ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
        bands(ctx,T,M,W,H,C,L,eps,d,yMn,yMx,xMn,xMx);
        axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,1,.5);
        curve(ctx,T,x=>Math.sin(x)/x,xMn,xMx,.015,C);
        dot(ctx,T,C,L,false);
        const pCL=T(C,L);
        ctx.setLineDash([4,3]);ctx.strokeStyle='rgba(138,104,24,.3)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(pCL.x,pCL.y);ctx.lineTo(M.l,pCL.y);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=P.amber;ctx.font='italic 12px serif';ctx.textAlign='right';ctx.fillText('L=1',M.l-3,pCL.y+4);
        ctx.textAlign='center';ctx.fillText('c=0',pCL.x,H-M.b+13);
        ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('f(x) = sin(x)/x',W-M.r-2,M.t+13);
        document.getElementById('ex3D').textContent=d.toFixed(4);
      }
      function upd() {
        const e=+sl.value;
        document.getElementById('ex3V').textContent=e.toFixed(2);
        document.getElementById('ex3E').textContent=e.toFixed(4);
        draw(e);
      }
      sl.addEventListener('input',upd); upd();
    }
  
    if(document.getElementById('ex4C')) {
      const cv=document.getElementById('ex4C');
      const ctx=cv.getContext('2d');
      const sl=document.getElementById('ex4S');
      const C=0,EPS=.5,xMn=-2,xMx=2,yMn=-1.8,yMx=1.8;
      const M={l:44,r:16,t:16,b:36};
      function draw(L) {
        const W=cv.width,H=cv.height, T=tp(M,xMn,xMx,yMn,yMx,W,H);
        ctx.clearRect(0,0,W,H); ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
        const yT=T(0,Math.min(L+EPS,yMx)).y, yB=T(0,Math.max(L-EPS,yMn)).y;
        ctx.fillStyle=P.amberF; ctx.fillRect(M.l,yT,W-M.r-M.l,yB-yT);
        ctx.strokeStyle=P.amberS;ctx.lineWidth=1.2;ctx.setLineDash([5,3]);
        ctx.beginPath();ctx.moveTo(M.l,yT);ctx.lineTo(W-M.r,yT);ctx.stroke();
        ctx.beginPath();ctx.moveTo(M.l,yB);ctx.lineTo(W-M.r,yB);ctx.stroke();
        ctx.setLineDash([]);
        axes(ctx,T,M,W,H,xMn,xMx,yMn,yMx,.5,.5);
        ctx.strokeStyle=P.curve;ctx.lineWidth=2.5;
        const pa=T(.01,1),pb=T(xMx,1);
        ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();
        const pc=T(xMn,-1),pd=T(-.01,-1);
        ctx.beginPath();ctx.moveTo(pc.x,pc.y);ctx.lineTo(pd.x,pd.y);ctx.stroke();
        dot(ctx,T,0,1,false,5,P.curve); dot(ctx,T,0,-1,false,5,P.curve);
        ctx.fillStyle=P.soft;ctx.font='italic 12px serif';ctx.textAlign='right';
        ctx.fillText('+1',T(xMx,1).x-4,T(xMx,1).y-7);
        ctx.fillText('−1',T(xMx,-1).x-4,T(xMx,-1).y+14);
        const pL=T(0,L);
        ctx.beginPath();ctx.arc(pL.x,pL.y,6,0,Math.PI*2);ctx.fillStyle=P.amber;ctx.fill();
        ctx.fillStyle=P.amber;ctx.font='italic 13px serif';ctx.textAlign='left';
        ctx.fillText('L = '+L.toFixed(2),pL.x+10,pL.y+4);
        const plusIn=Math.abs(1-L)<EPS, minusIn=Math.abs(-1-L)<EPS;
        if(!plusIn) {
          ctx.strokeStyle=P.red;ctx.lineWidth=2;
          const pp=T(.8,1);ctx.beginPath();ctx.arc(pp.x,pp.y,11,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('خارج',pp.x,pp.y-15);
        }
        if(!minusIn) {
          ctx.strokeStyle=P.red;ctx.lineWidth=2;
          const pm=T(-.8,-1);ctx.beginPath();ctx.arc(pm.x,pm.y,11,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle=P.red;ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('خارج',pm.x,pm.y+18);
        }
        const ok=plusIn&&minusIn;
        const st=document.getElementById('ex4St');
        st.textContent=ok?'ناجح ✓':'فاشل ✗';
        st.style.color=ok?'var(--teal)':'var(--red)';
        ctx.fillStyle=P.muted;ctx.font='11px sans-serif';ctx.textAlign='right';
        ctx.fillText('f(x) = |x|/x',W-M.r-2,M.t+13);
      }
      function upd() {
        const L=+sl.value;
        document.getElementById('ex4V').textContent=L.toFixed(2);
        draw(L);
      }
      sl.addEventListener('input',upd); upd();
    }
  }, 100);
});
