/* ==========================================================
   MOTION STUDIO · ПАК «КРИПТОВАЛЮТА»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-crypto.js"><\/script>
   (после основного <script>).
   ========================================================== */
(function () {
  "use strict";
  if (window.__packCrypto) return;

  const need = ["BG","ICO","ICN","N","SHP","TH3","LIB","BUSY","drawBg","drawShape","thBuild","clamp","eo","ob","rnd"];
  const missing = need.filter(n => { try { return typeof (0, eval)(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «Крипто» не подключён, нет:", missing.join(", ")); return; }
  window.__packCrypto = true;

  /* ---------- общие помощники ---------- */
  const TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const FNT = () => (typeof FONT !== "undefined" ? FONT : "Arial, sans-serif");
  const hx = h => { h = h.replace("#",""); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; };
  const mixc = (a,b,t) => { const A=hx(a),B=hx(b); return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join(""); };
  const rgba = (h,a) => { const [r,g,b]=hx(h); return `rgba(${r},${g},${b},${a})`; };
  const ease = x => x*x*(3-2*x);
  const rrect = (c,x,y,w,h,r) => { c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); };
  const txt = (c,s,x,y,px,col,wt,al) => { c.font=(wt||800)+" "+px+"px "+FNT(); c.textAlign=al||"center"; c.textBaseline="middle"; c.fillStyle=col; c.fillText(s,x,y); };

  const GOLD="#f7931a", ETHC="#627eea", GREEN="#00d4aa", RED="#ff3b57", BLUE="#4cc9f0";
  const BTC_SYM = "₿";

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */

  /* 1.1 Торговый график */
  function bgChart(c,w,h,t,pal) {
    const col = pal[1];
    const N = 26, step = w/N, sp = 1.6, k0 = Math.floor(t*sp), frac = (t*sp)%1;
    const price = k => sin(k*0.35)*0.8 + sin(k*0.13+2)*1.2 + sin(k*0.7)*0.3;
    const sc = h*0.18, Y = v => h*0.5 - v*sc;
    c.lineWidth = 1;
    for (let j=0;j<=8;j++){ c.strokeStyle=rgba(col,.07); c.beginPath(); c.moveTo(0,j*h/8); c.lineTo(w,j*h/8); c.stroke(); }
    for (let i=0;i<=12;i++){ c.strokeStyle=rgba(col,.05); c.beginPath(); c.moveTo(i*w/12,0); c.lineTo(i*w/12,h); c.stroke(); }
    for (let i=-1;i<=N+1;i++){
      const k=k0+i, x=(i-frac)*step, o=price(k), cl=price(k+1);
      const hi=Math.max(o,cl)+0.3*rnd(k), lo=Math.min(o,cl)-0.3*rnd(k+99);
      const up=cl>=o, cc=up?GREEN:RED;
      c.globalAlpha=0.8; c.strokeStyle=cc; c.fillStyle=cc; c.lineWidth=Math.max(1,step*.08);
      c.beginPath(); c.moveTo(x+step/2,Y(hi)); c.lineTo(x+step/2,Y(lo)); c.stroke();
      c.fillRect(x+step*.2, Math.min(Y(o),Y(cl)), step*.6, Math.max(2,Math.abs(Y(o)-Y(cl))));
    }
    c.globalAlpha=1;
    c.strokeStyle=col; c.lineWidth=Math.max(2,w*.005); c.beginPath();
    for (let i=-1;i<=N+1;i++){ const k=k0+i, m=(price(k)+price(k+1)+price(k+2))/3, x=(i-frac)*step+step/2; i===-1?c.moveTo(x,Y(m)):c.lineTo(x,Y(m)); } c.stroke();
    const last=price(k0+N), ly=Y(last);
    c.setLineDash([w*.02,w*.015]); c.strokeStyle=rgba("#fff",.35); c.beginPath(); c.moveTo(0,ly); c.lineTo(w,ly); c.stroke(); c.setLineDash([]);
    c.fillStyle=rgba(col,.85+.15*sin(t*4)); rrect(c,w*.7,ly-h*.016,w*.28,h*.032,h*.01); c.fill();
    txt(c,"$"+(45000+Math.round(last*3000)), w*.84, ly, h*.022, "#000", 800);
  }

  /* 1.2 Матрица / хеши */
  function bgMatrix(c,w,h,t,pal) {
    const cols = 22, cw = w/cols;
    const hex = "0123456789abcdef".split("");
    for (let i=0;i<cols;i++){
      const sp = 40 + rnd(i)*120, len = 5 + Math.floor(rnd(i+5)*10);
      for (let j=0;j<len;j++){
        const y = ((t*sp + j*26 + rnd(i+j)*30) % (h+340)) - 170;
        const a = 1 - j/len;
        c.fillStyle = rgba(GREEN, a*.95);
        c.font = "700 "+(12+rnd(i+j)*6)+"px monospace";
        c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(hex[Math.floor(rnd(i*31+j*7+Math.floor(t*3+j))*16)], i*cw+cw/2, y);
      }
    }
  }

  /* 1.3 Блокчейн */
  function bgBlocks(c,w,h,t,pal) {
    const col = pal[1], bs = Math.min(w,h)*.13, gap = bs*.6, speed = (t*30)%(bs+gap);
    const lim = Math.ceil(w/(bs+gap))+2;
    for (let i=-1;i<=lim;i++){
      const x = i*(bs+gap) - speed + gap/2;
      const y = h*.5 + sin(i*.7 + t*.5)*h*.15;
      const active = (Math.floor(t*0.7+i) % 3 === 0);
      c.save(); c.translate(x,y); c.rotate(sin(t+i)*.08);
      c.fillStyle = rgba(col, active?.3:.1); rrect(c,-bs/2,-bs/2,bs,bs,bs*.1); c.fill();
      c.strokeStyle = rgba(col, active?.85:.35); c.lineWidth = bs*.04; c.stroke();
      c.fillStyle = rgba(col, active?.7:.3);
      for (let k=0;k<3;k++) for (let l=0;l<3;l++) c.fillRect(-bs*.2+k*bs*.22, -bs*.2+l*bs*.22, bs*.09, bs*.09);
      c.restore();
      if (i<lim){
        c.strokeStyle = rgba(col,.4); c.lineWidth = 2; c.setLineDash([4,4]);
        c.beginPath(); c.moveTo(x+bs/2,y); c.lineTo(x+bs/2+gap, h*.5+sin((i+1)*.7+t*.5)*h*.15); c.stroke(); c.setLineDash([]);
      }
    }
  }

  /* 1.4 Табло обмена */
  function bgTicker(c,w,h,t,pal) {
    const pairs = ["BTC/USDT","ETH/USDT","SOL/USDT","BNB/USDT","XRP/USDT","ADA/USDT","DOGE/USDT","AVAX/USDT"];
    const rows = 8, rh = h/rows;
    for (let r=0;r<rows;r++){
      const y = r*rh, pair = pairs[r%pairs.length];
      const basePrice = 100 + rnd(r)*60000;
      const chg = (rnd(r+3)-0.5)*14;
      const up = chg>=0, cc = up?GREEN:RED;
      c.fillStyle = r%2 ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.05)";
      c.fillRect(0,y,w,rh);
      txt(c,pair, w*.02, y+rh/2, rh*.3, "rgba(255,255,255,.9)", 800, "left");
      txt(c,"$"+(basePrice*(1+Math.sin(t*.5+r)*.02)).toFixed(2), w*.38, y+rh/2, rh*.3, "rgba(255,255,255,.95)", 800);
      txt(c,(up?"+":"")+chg.toFixed(2)+"%", w*.68, y+rh/2, rh*.3, cc, 800);
      const cw2 = w*.22, cx2 = w*.74;
      c.strokeStyle = cc; c.lineWidth = rh*.04; c.beginPath();
      for (let k=0;k<15;k++){
        const px = cx2 + k/14*cw2;
        const py = y + rh/2 - Math.sin(k*.8 + r + t*.5)*rh*.2;
        k?c.lineTo(px,py):c.moveTo(px,py);
      }
      c.stroke();
    }
  }

  /* 1.5 Сеть узлов */
  function bgNetwork(c,w,h,t,pal) {
    const col = pal[1], nodes = [];
    for (let i=0;i<22;i++) nodes.push({
      x: (rnd(i)*.8+.1)*w, y: (rnd(i+20)*.8+.1)*h,
      vx: (rnd(i+40)-.5)*20, vy: (rnd(i+60)-.5)*20, ph: rnd(i+80)*TAU
    });
    nodes.forEach(n=>{
      n.x += sin(t+n.ph)*n.vx*.03; n.y += cos(t+n.ph)*n.vy*.03;
      n.x = clamp(n.x,20,w-20); n.y = clamp(n.y,20,h-20);
    });
    c.lineWidth = 1;
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++){
      const d = Math.hypot(nodes[i].x-nodes[j].x, nodes[i].y-nodes[j].y);
      if (d < w*.18){ c.strokeStyle = rgba(col, (1-d/(w*.18))*.45); c.beginPath(); c.moveTo(nodes[i].x,nodes[i].y); c.lineTo(nodes[j].x,nodes[j].y); c.stroke(); }
    }
    nodes.forEach(n=>{
      const p = .5+.5*sin(t*2+n.ph);
      c.fillStyle = rgba(col, .5+.5*p); c.beginPath(); c.arc(n.x,n.y,3+p*3,0,TAU); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(n.x,n.y,1.5,0,TAU); c.fill();
    });
  }

  /* 1.6 Волны волатильности */
  function bgWaves(c,w,h,t,pal) {
    const col = pal[1];
    for (let k=0;k<5;k++){
      c.beginPath();
      for (let x=0;x<=w;x+=5){
        const nx = x/w;
        const y = h*.5 + sin(nx*8 + t*(1+k*.3) + k)*h*.15 + sin(nx*20 + t*2 + k*2)*h*.05;
        x?c.lineTo(x,y):c.moveTo(x,y);
      }
      const g = c.createLinearGradient(0,0,w,0);
      g.addColorStop(0, rgba(col,0));
      g.addColorStop(.5, rgba(k%2?GREEN:col, .6-k*.1));
      g.addColorStop(1, rgba(col,0));
      c.strokeStyle = g; c.lineWidth = 2; c.stroke();
    }
  }

  /* 1.7 Майнинг */
  function bgMining(c,w,h,t,pal) {
    const col = pal[1];
    for (let i=0;i<15;i++){
      const x0 = rnd(i)*w, y0 = rnd(i+15)*h;
      let x = x0, y = y0;
      c.strokeStyle = rgba(col,.3); c.lineWidth = 2;
      c.beginPath(); c.moveTo(x,y);
      for (let k=0;k<5;k++){
        const dir = rnd(i*5+k);
        if (dir<.5) x += (rnd(i+k+5)-.5)*100;
        else y += (rnd(i+k+10)-.5)*100;
        c.lineTo(x,y);
      }
      c.stroke();
      const pulse = (t+i*.3)%2;
      if (pulse<1){ c.fillStyle = rgba(GREEN,1-pulse); c.beginPath(); c.arc(x,y,4*(1-pulse),0,TAU); c.fill(); }
    }
    for (let i=0;i<6;i++){
      const y = (i/6)*h + (t*30)%(h/6);
      c.font = "600 "+(h*.016)+"px monospace";
      c.fillStyle = rgba(GREEN,.5);
      c.textAlign = "left"; c.textBaseline = "middle";
      let hash = "0x";
      for (let k=0;k<40;k++) hash += "0123456789abcdef"[Math.floor(rnd(i*40+k)*16)];
      c.fillText(hash, w*.02, y);
    }
  }

  /* 1.8 Луна / to the moon */
  function bgMoon(c,w,h,t,pal) {
    const cx = w*.72, cy = h*.32, r = Math.min(w,h)*.22;
    for (let i=0;i<120;i++){
      const x = rnd(i)*w, y = rnd(i+100)*h*.75;
      const a = .3+.7*Math.abs(sin(t*.5+i));
      c.fillStyle = rgba("#ffffff", a*.7);
      c.beginPath(); c.arc(x,y,rnd(i+200)*2+.5,0,TAU); c.fill();
    }
    const g = c.createRadialGradient(cx,cy,r*.8,cx,cy,r*2);
    g.addColorStop(0, rgba("#ffffff",.25)); g.addColorStop(1, rgba("#ffffff",0));
    c.fillStyle = g; c.beginPath(); c.arc(cx,cy,r*2,0,TAU); c.fill();
    const mg = c.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);
    mg.addColorStop(0,"#f0f0f0"); mg.addColorStop(.7,"#c0c0c0"); mg.addColorStop(1,"#808080");
    c.fillStyle = mg; c.beginPath(); c.arc(cx,cy,r,0,TAU); c.fill();
    for (let i=0;i<8;i++){
      const a = rnd(i+300)*TAU, d = rnd(i+400)*r*.7;
      c.fillStyle = "rgba(100,100,100,.4)";
      c.beginPath(); c.arc(cx+cos(a)*d, cy+sin(a)*d, r*(.03+rnd(i+500)*.07),0,TAU); c.fill();
    }
    const rx = w*.2 + sin(t*.3)*w*.05, ry = h*.65 + cos(t*.5)*h*.05;
    c.save(); c.translate(rx,ry); c.rotate(-.4);
    c.fillStyle = "#ffffff";
    c.beginPath(); c.moveTo(0,-18); c.lineTo(9,9); c.lineTo(0,5); c.lineTo(-9,9); c.closePath(); c.fill();
    c.restore();
    const fl = 8+sin(t*10)*4;
    c.fillStyle = rgba(GOLD,.7);
    c.beginPath(); c.moveTo(rx-10,ry+8); c.lineTo(rx+10,ry+8); c.lineTo(rx+26,ry+8+fl*3); c.closePath(); c.fill();
  }

  /* 1.9 Падающие монеты */
  function bgCoins(c,w,h,t,pal) {
    for (let i=0;i<16;i++){
      const x0 = rnd(i)*w;
      const y0 = h - ((t*(20+rnd(i+20)*60) + rnd(i+40)*h) % (h+100));
      const x = x0 + sin(t*.8+i)*30;
      const r = 15 + rnd(i+60)*25;
      const rot = t*(.5+rnd(i+80))*(i%2?1:-1);
      c.save(); c.translate(x,y0); c.rotate(rot);
      c.scale(Math.cos(t*2+i)*.5+.5, 1);
      const g = c.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);
      g.addColorStop(0,"#ffd28a"); g.addColorStop(.5,GOLD); g.addColorStop(1,"#a15c00");
      c.fillStyle = g; c.beginPath(); c.arc(0,0,r,0,TAU); c.fill();
      c.strokeStyle = "#5a2800"; c.lineWidth = r*.05; c.stroke();
      c.fillStyle = "#5a2800";
      c.font = "900 "+(r*1.4)+"px Arial";
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(BTC_SYM,0,0);
      c.restore();
    }
  }

  /* 1.10 Перспективная сетка */
  function bgGrid(c,w,h,t,pal) {
    const col = pal[1], horizon = h*.42;
    c.strokeStyle = rgba(col,.5); c.lineWidth = 2;
    c.beginPath(); c.moveTo(0,horizon); c.lineTo(w,horizon); c.stroke();
    for (let i=0;i<=20;i++){
      const x = i/20*w;
      c.strokeStyle = rgba(col,.15);
      c.beginPath(); c.moveTo(w/2+(x-w/2)*.1,horizon); c.lineTo(x,h); c.stroke();
    }
    for (let j=0;j<15;j++){
      const f = ((j + (t*.5)%1)/15), y = horizon + (h-horizon)*f*f;
      c.strokeStyle = rgba(col,.15+f*.4);
      c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke();
    }
    for (let i=0;i<40;i++){
      const x = rnd(i)*w, y = rnd(i+40)*horizon;
      const a = .3+.7*Math.abs(sin(t*2+i));
      c.fillStyle = rgba("#fff",a); c.beginPath(); c.arc(x,y,1.5,0,TAU); c.fill();
    }
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр (0,0)
     ========================================================== */

  /* 2.1 Ракета */
  function csRocket(c,R,lt) {
    const prog = clamp((lt%4)/3);
    const y = -R*1.4 + prog*R*2.2;
    const scale = 1 - prog*.35;
    for (let i=0;i<25;i++){
      const sx = (rnd(i)-.5)*R*4;
      const sy = -R*2 + (rnd(i+20)*4 + lt*3)%(R*4) - R*.5;
      c.fillStyle = rgba("#fff",.8); c.beginPath(); c.arc(sx,sy,R*.015,0,TAU); c.fill();
    }
    c.save(); c.translate(0,y); c.scale(scale,scale);
    const fl = R*(.6+sin(lt*15)*.15);
    const fg = c.createLinearGradient(0,R*.3,0,R*1.2);
    fg.addColorStop(0,"#ffaa33"); fg.addColorStop(1,"rgba(255,68,34,0)");
    c.fillStyle = fg;
    c.beginPath(); c.moveTo(-R*.2,R*.3); c.quadraticCurveTo(-R*.3,R*.8,0,fl); c.quadraticCurveTo(R*.3,R*.8,R*.2,R*.3); c.closePath(); c.fill();
    const bg = c.createLinearGradient(-R*.3,0,R*.3,0);
    bg.addColorStop(0,"#e8edf3"); bg.addColorStop(.5,"#fff"); bg.addColorStop(1,"#c0c8d0");
    c.fillStyle = bg;
    c.beginPath(); c.moveTo(0,-R*1.2); c.lineTo(-R*.3,-R*.6); c.lineTo(-R*.3,R*.3); c.lineTo(R*.3,R*.3); c.lineTo(R*.3,-R*.6); c.closePath(); c.fill();
    c.fillStyle = RED;
    c.beginPath(); c.moveTo(0,-R*1.2); c.lineTo(-R*.15,-R*.85); c.lineTo(R*.15,-R*.85); c.closePath(); c.fill();
    [-1,1].forEach(s=>{ c.beginPath(); c.moveTo(s*R*.3,-R*.3); c.lineTo(s*R*.5,R*.2); c.lineTo(s*R*.3,R*.3); c.closePath(); c.fill(); });
    c.fillStyle = BLUE; c.beginPath(); c.arc(0,-R*.3,R*.1,0,TAU); c.fill();
    c.fillStyle = rgba("#fff",.5); c.beginPath(); c.arc(-R*.03,-R*.33,R*.03,0,TAU); c.fill();
    c.restore();
  }

  /* 2.2 Вращающаяся биткоин-монета */
  function csCoin(c,R,lt) {
    const flip = cos(lt*2);
    const r = R*.75;
    c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.ellipse(0,r*1.15,r*.7,r*.15,0,0,TAU); c.fill();
    c.save(); c.scale(Math.max(.05,Math.abs(flip)),1);
    if (flip>0){
      const g = c.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);
      g.addColorStop(0,"#ffd28a"); g.addColorStop(.5,GOLD); g.addColorStop(1,"#a15c00");
      c.fillStyle = g; c.beginPath(); c.arc(0,0,r,0,TAU); c.fill();
      c.strokeStyle = "#5a2800"; c.lineWidth = r*.05; c.stroke();
      c.fillStyle = "#5a2800"; c.font = "900 "+(r*1.3)+"px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(BTC_SYM,0,0);
    } else {
      const g = c.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);
      g.addColorStop(0,"#b0b0b0"); g.addColorStop(.5,"#808080"); g.addColorStop(1,"#404040");
      c.fillStyle = g; c.beginPath(); c.arc(0,0,r,0,TAU); c.fill();
      c.strokeStyle = "#202020"; c.lineWidth = r*.05; c.stroke();
      c.fillStyle = "#202020"; c.font = "900 "+(r*1.3)+"px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(BTC_SYM,0,0);
    }
    c.restore();
    if (Math.abs(flip)>.6){ c.fillStyle = rgba("#fff",.35); c.beginPath(); c.ellipse(-r*.4,-r*.5,r*.2,r*.35,-.5,0,TAU); c.fill(); }
  }

  /* 2.3 Растущий график */
  function csChart(c,R,lt) {
    const prog = ease(clamp((lt%3)/2));
    const W = R*1.8, H = R*1.4;
    c.strokeStyle = rgba("#fff",.4); c.lineWidth = R*.02;
    c.beginPath(); c.moveTo(-W/2,H/2); c.lineTo(-W/2,-H/2); c.lineTo(W/2,H/2); c.stroke();
    c.strokeStyle = rgba("#fff",.15);
    for (let i=1;i<5;i++){ c.beginPath(); c.moveTo(-W/2,H/2-i*H/5); c.lineTo(W/2,H/2-i*H/5); c.stroke(); }
    const points = [];
    for (let i=0;i<=8;i++){
      const f = i/8, x = -W/2+f*W, y = H/2-(f*f*.7+sin(f*8)*.1+f*.3)*H;
      points.push([x,y]);
    }
    c.strokeStyle = GREEN; c.lineWidth = R*.05; c.shadowColor = GREEN; c.shadowBlur = R*.15;
    c.beginPath(); const n = Math.floor(prog*points.length);
    for (let i=0;i<=n;i++){ const [x,y]=points[i]; i?c.lineTo(x,y):c.moveTo(x,y); }
    c.stroke(); c.shadowBlur = 0;
    if (prog>.9){
      const [ex,ey] = points[points.length-1], f = (prog-.9)/.1;
      c.fillStyle = GREEN; c.save(); c.translate(ex,ey); c.rotate(-PI/4); c.scale(f,f);
      c.beginPath(); c.moveTo(0,-R*.12); c.lineTo(R*.08,0); c.lineTo(-R*.08,0); c.closePath(); c.fill(); c.restore();
    }
  }

  /* 2.4 Кошелёк с монетами */
  function csWallet(c,R,lt) {
    const open = ease(clamp((sin(lt*1.5)+1)/2));
    c.fillStyle = "#2a1810"; rrect(c,-R*.7,-R*.5,R*1.4,R*.9,R*.1); c.fill();
    for (let i=0;i<5;i++){
      const a = (lt*1.5+i*.5)%TAU, rise = sin(a)*.5+.5;
      const cx2 = cos(a+PI/2)*R*.3, cy2 = -R*.3 - rise*R*.5;
      const g = c.createRadialGradient(cx2-R*.05,cy2-R*.05,1,cx2,cy2,R*.12);
      g.addColorStop(0,"#ffd28a"); g.addColorStop(1,"#a15c00");
      c.fillStyle = g; c.beginPath(); c.arc(cx2,cy2,R*.12,0,TAU); c.fill();
      c.fillStyle = "#5a2800"; c.font = "900 "+(R*.18)+"px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(BTC_SYM,cx2,cy2);
    }
    c.save(); c.translate(-R*.7,-R*.5); c.rotate(-open*.4);
    c.fillStyle = "#3a2515"; rrect(c,0,0,R*1.4,R*.5,R*.1); c.fill();
    c.strokeStyle = "#5a3a20"; c.lineWidth = R*.02; c.beginPath(); c.moveTo(0,R*.4); c.lineTo(R*1.4,R*.4); c.stroke();
    c.restore();
    c.fillStyle = GOLD; c.beginPath(); c.arc(0,R*.05,R*.15,0,TAU); c.fill();
    c.fillStyle = "#fff"; c.font = "900 "+(R*.22)+"px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(BTC_SYM,0,R*.07);
  }

  /* 2.5 Звенья цепи */
  function csChain(c,R,lt) {
    const prog = clamp((lt%3)/2);
    const lw = R*.15, lr = R*.32;
    const links = [{x:-R*.5,y:0},{x:0,y:0},{x:R*.5,y:0}];
    links.forEach((link,i)=>{
      const appear = clamp(prog*3-i);
      if (appear<=0) return;
      c.save(); c.translate(link.x,link.y); c.scale(appear,appear);
      const sx = i%2===1 ? .3 : 1;
      c.scale(sx,1);
      c.strokeStyle = GOLD; c.lineWidth = lw; c.lineCap = "round";
      c.beginPath(); c.arc(0,0,lr,0,TAU); c.stroke();
      c.strokeStyle = "#ffd28a"; c.lineWidth = lw*.3;
      c.beginPath(); c.arc(-lr*.2,-lr*.2,lr*.85,PI*1.2,PI*1.5); c.stroke();
      c.restore();
    });
  }

  /* 2.6 Замок */
  function csLock(c,R,lt) {
    const lockP = ease(clamp((sin(lt*1.2)+1)/2));
    const shackleY = -R*.35 - lockP*R*.15;
    c.strokeStyle = "#d5dde6"; c.lineWidth = R*.11; c.lineCap = "round";
    c.beginPath(); c.arc(0,shackleY,R*.35,PI,0); c.stroke();
    c.beginPath(); c.moveTo(-R*.35,shackleY); c.lineTo(-R*.35,0); c.moveTo(R*.35,shackleY); c.lineTo(R*.35,0); c.stroke();
    const bg = c.createLinearGradient(0,0,0,R);
    bg.addColorStop(0,"#ffd28a"); bg.addColorStop(1,"#a15c00");
    c.fillStyle = bg; rrect(c,-R*.5,0,R*1.0,R*.8,R*.08); c.fill();
    c.strokeStyle = "#5a2800"; c.lineWidth = R*.02; c.stroke();
    c.fillStyle = "#1a0a00"; c.beginPath(); c.arc(0,R*.32,R*.07,0,TAU); c.fill();
    c.fillRect(-R*.03,R*.32,R*.06,R*.18);
    c.fillStyle = rgba("#fff",.3); c.beginPath(); c.ellipse(-R*.3,R*.15,R*.1,R*.2,-.5,0,TAU); c.fill();
  }

  /* 2.7 Майнинг */
  function csMine(c,R,lt) {
    const swing = sin(lt*4), angle = -.5+swing*.7;
    c.fillStyle = "rgba(100,100,100,.3)"; c.beginPath(); c.ellipse(0,R*.7,R*.9,R*.15,0,0,TAU); c.fill();
    const gem = c.createLinearGradient(-R*.15,R*.5,R*.15,R*.7);
    gem.addColorStop(0,BLUE); gem.addColorStop(1,"#1a5a80");
    c.fillStyle = gem; c.beginPath(); c.moveTo(0,R*.3); c.lineTo(-R*.15,R*.55); c.lineTo(0,R*.7); c.lineTo(R*.15,R*.55); c.closePath(); c.fill();
    c.strokeStyle = "#bff3ff"; c.lineWidth = R*.02; c.stroke();
    c.save(); c.translate(R*.5,-R*.2); c.rotate(angle);
    c.strokeStyle = "#8b5a2b"; c.lineWidth = R*.08; c.lineCap = "round";
    c.beginPath(); c.moveTo(0,-R*.4); c.lineTo(0,R*.5); c.stroke();
    c.strokeStyle = "#c0c8d0"; c.lineWidth = R*.12;
    c.beginPath(); c.moveTo(-R*.25,-R*.5); c.quadraticCurveTo(0,-R*.4,R*.25,-R*.5); c.stroke();
    c.restore();
    if (Math.abs(swing)>.9){
      for (let i=0;i<5;i++){
        const a = rnd(i+Math.floor(lt*10)*10)*TAU, d = R*(.2+rnd(i+100)*.3);
        c.fillStyle = "#ffff00"; c.beginPath(); c.arc(cos(a)*d,R*.5+sin(a)*d,R*.02,0,TAU); c.fill();
      }
    }
  }

  /* 2.8 Обмен */
  function csSwap(c,R,lt) {
    c.strokeStyle = GREEN; c.lineWidth = R*.06; c.lineCap = "round";
    c.beginPath(); c.arc(0,0,R*.5,PI*.9,PI*.1); c.stroke();
    c.fillStyle = GREEN; c.beginPath(); c.moveTo(R*.6,-R*.35); c.lineTo(R*.35,-R*.2); c.lineTo(R*.35,-R*.5); c.closePath(); c.fill();
    c.strokeStyle = RED; c.beginPath(); c.arc(0,0,R*.5,PI*1.9,PI*1.1); c.stroke();
    c.fillStyle = RED; c.beginPath(); c.moveTo(-R*.6,R*.35); c.lineTo(-R*.35,R*.2); c.lineTo(-R*.35,R*.5); c.closePath(); c.fill();
    const coinR = R*.25;
    const lx = -R*.9, ly = -R*.2+sin(lt*2)*R*.1, rx = R*.9, ry = R*.2-sin(lt*2)*R*.1;
    [[lx,ly,BTC_SYM,GOLD],[rx,ry,"Ξ",ETHC]].forEach(([x,y,sym,col])=>{
      const g = c.createRadialGradient(x-coinR*.3,y-coinR*.3,1,x,y,coinR);
      g.addColorStop(0,mixc(col,"#fff",.4)); g.addColorStop(1,mixc(col,"#000",.3));
      c.fillStyle = g; c.beginPath(); c.arc(x,y,coinR,0,TAU); c.fill();
      c.fillStyle = "#000"; c.font = "900 "+(coinR*1.3)+"px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(sym,x,y);
    });
  }

  /* 2.9 Свечи */
  function csCandles(c,R,lt) {
    const prog = clamp((lt%3)/2.5), n = 6;
    const bw = R*.22, gap = R*.1, total = n*bw+(n-1)*gap, x0 = -total/2;
    const heights = [.2,.35,.3,.55,.7,.9], kinds = [1,-1,1,1,-1,1];
    for (let i=0;i<n;i++){
      const appear = clamp(prog*n-i);
      if (appear<=0) continue;
      const x = x0+i*(bw+gap)+bw/2, h2 = heights[i]*R*appear, y = R*.6-h2;
      const up = kinds[i]>0, cc = up?GREEN:RED;
      c.strokeStyle = cc; c.lineWidth = R*.03;
      c.beginPath(); c.moveTo(x,y-R*.15*appear); c.lineTo(x,y+h2+R*.15*appear); c.stroke();
      c.fillStyle = cc; c.fillRect(x-bw/2,y,bw,h2);
      c.fillStyle = rgba("#fff",.3); c.fillRect(x-bw/2,y,bw*.2,h2);
    }
  }

  /* 2.10 Луна и ракета */
  function csMoon(c,R,lt) {
    const mx = -R*.3+sin(lt*.3)*R*.05, my = R*.2, mr = R*.6;
    const g = c.createRadialGradient(mx,my,mr*.8,mx,my,mr*2);
    g.addColorStop(0,rgba("#f0f0f0",.35)); g.addColorStop(1,rgba("#f0f0f0",0));
    c.fillStyle = g; c.beginPath(); c.arc(mx,my,mr*2,0,TAU); c.fill();
    const mg = c.createRadialGradient(mx-mr*.3,my-mr*.3,mr*.1,mx,my,mr);
    mg.addColorStop(0,"#f0f0f0"); mg.addColorStop(.7,"#c0c0c0"); mg.addColorStop(1,"#808080");
    c.fillStyle = mg; c.beginPath(); c.arc(mx,my,mr,0,TAU); c.fill();
    for (let i=0;i<6;i++){
      const a = rnd(i+10)*TAU, d = rnd(i+20)*mr*.7;
      c.fillStyle = "rgba(100,100,100,.5)";
      c.beginPath(); c.arc(mx+cos(a)*d,my+sin(a)*d,mr*(.05+rnd(i+30)*.1),0,TAU); c.fill();
    }
    const prog = clamp((sin(lt*.5)+1)/2);
    const rx = mx+R*.7, ry = my+R*.3-prog*R*.3;
    c.save(); c.translate(rx,ry); c.rotate(-.4);
    const fl = R*(.3+sin(lt*15)*.1);
    c.fillStyle = rgba("#ffaa33",.8);
    c.beginPath(); c.moveTo(-R*.1,R*.15); c.lineTo(R*.1,R*.15); c.lineTo(0,R*.15+fl); c.closePath(); c.fill();
    c.fillStyle = "#e8edf3";
    c.beginPath(); c.moveTo(0,-R*.35); c.lineTo(-R*.12,-R*.1); c.lineTo(-R*.12,R*.15); c.lineTo(R*.12,R*.15); c.lineTo(R*.12,-R*.1); c.closePath(); c.fill();
    c.fillStyle = RED;
    c.beginPath(); c.moveTo(0,-R*.35); c.lineTo(-R*.06,-R*.2); c.lineTo(R*.06,-R*.2); c.closePath(); c.fill();
    [-1,1].forEach(s=>{ c.beginPath(); c.moveTo(s*R*.12,-R*.05); c.lineTo(s*R*.22,R*.1); c.lineTo(s*R*.12,R*.15); c.closePath(); c.fill(); });
    c.fillStyle = BLUE; c.beginPath(); c.arc(0,-R*.05,R*.04,0,TAU); c.fill();
    c.restore();
  }

  /* ==========================================================
     3. ИКОНКИ (10): контуры 24×24
     ========================================================== */
  const ICONS = {
    bitcoin: ["Биткоин", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.8 13.2c-.5.9-1.5 1.4-2.7 1.6V19h-1v-2.2h-.6V19h-1v-2.2H6.5v-1.6h.9V8.8H6.5V7.2h2.9V5h1v2.2h.6V5h1v2.2h.5c1.4 0 2.4.6 2.4 2 0 .9-.5 1.4-1.1 1.6.8.2 1.4.8 1.4 1.8 0 .8-.4 1.4-1.4 1.6zM10.6 8.8v2.1h1c.8 0 1.3-.3 1.3-1s-.5-1.1-1.3-1.1h-1zm1.2 5.5c.9 0 1.5-.3 1.5-1.2s-.6-1.2-1.5-1.2h-1.2v2.4h1.2z"],
    ethereum: ["Эфириум", "M12 2L5 12.2l7 4.1 7-4.1L12 2zM5 13.5l7 8.5 7-8.5-7 4.1-7-4.1z"],
    wallet: ["Кошелёк", "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM17 14h.01M2 7V5a2 2 0 0 1 2-2h14"],
    chart: ["График", "M3 3v18h18M7 16l4-6 4 4 5-8"],
    rocket: ["Ракета", "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"],
    lock: ["Замок", "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4"],
    swap: ["Обмен", "M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4"],
    cpu: ["Майнинг", "M4 4h16v16H4zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"],
    coin: ["Монета", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8"],
    candle: ["Свечи", "M9 3v4M9 17v4M15 6v3M15 15v3M6 7h6v10H6zM12 9h6v6h-6z"]
  };

  /* ==========================================================
     4. 3D-МОДЕЛИ (10), Three.js r128
     ========================================================== */
  const MCC = {};
  function mcap(base, o) {
    const key = base+JSON.stringify(o||{}); if (MCC[key]) return MCC[key]; o = o||{};
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const x = cv.getContext("2d"), dark = o.dark||"#000000", hi = o.hi||"#ffffff";
    const g = x.createRadialGradient(110,95,8,128,128,150);
    g.addColorStop(0,mixc(base,hi,.45)); g.addColorStop(.3,base); g.addColorStop(.75,mixc(base,dark,.5)); g.addColorStop(1,mixc(base,dark,.78));
    x.fillStyle = g; x.fillRect(0,0,256,256);
    const r = x.createRadialGradient(205,205,5,205,205,95);
    r.addColorStop(0,rgba(mixc(base,"#fff",.6),.35)); r.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle = r; x.fillRect(0,0,256,256);
    const sp = o.gloss == null ? .85 : o.gloss;
    const s = x.createRadialGradient(88,72,0,88,72,42);
    s.addColorStop(0,"rgba(255,255,255,"+sp+")"); s.addColorStop(.45,"rgba(255,255,255,"+sp*.22+")"); s.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle = s; x.fillRect(0,0,256,256);
    return (MCC[key] = new THREE.CanvasTexture(cv));
  }
  const MC = (base,o,mo) => new THREE.MeshMatcapMaterial(Object.assign({ matcap: mcap(base,o) }, mo||{}));
  function rig(pal) {
    const T = THREE, sc = new T.Scene(), root = new T.Group(), pv = new T.Group(), model = new T.Group();
    sc.add(root); root.add(pv); pv.add(model); sc.add(new T.AmbientLight(0xffffff,.9));
    const k = new T.DirectionalLight(0xffffff,.8); k.position.set(3,4,5); sc.add(k);
    const p = new T.PointLight(new T.Color(pal[1]),1.4,30); p.position.set(-4,-1,3); sc.add(p);
    return { T, sc, root, pv, model,
      fit(target){ const b = new T.Box3().setFromObject(model), s = b.getSize(new T.Vector3()), cc = b.getCenter(new T.Vector3()); model.position.sub(cc); root.scale.setScalar(target/Math.max(s.x,s.y,s.z)); }
    };
  }
  function roundedRect(w,h,r) {
    const T = THREE, s = new T.Shape(), x = -w/2, y = -h/2;
    s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); return s;
  }
  function canvasTex(w,h,fn) {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const x = cv.getContext("2d"); fn(x,w,h);
    const tex = new THREE.CanvasTexture(cv); return { tex, cv, x };
  }
  const V = (x,y,z) => new THREE.Vector3(x,y,z);

  const M3 = {};

  /* 4.1 Биткоин-монета */
  M3.c3_coin = pal => {
    const R = rig(pal), T = R.T;
    const gold = MC("#f7931a",{gloss:1,hi:"#ffd28a",dark:"#5a2800"});
    const dark = MC("#a15c00",{gloss:.7,dark:"#3a1a00"});
    const faceTex = canvasTex(512,512,(x,w,h)=>{
      x.fillStyle = "#f7931a"; x.fillRect(0,0,w,h);
      x.fillStyle = "#ffd28a"; x.beginPath(); x.arc(256,256,240,0,TAU); x.fill();
      x.fillStyle = "#a15c00"; x.beginPath(); x.arc(256,256,200,0,TAU); x.fill();
      x.fillStyle = "#f7931a"; x.font = "900 340px Arial,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(BTC_SYM,256,280);
    });
    const coin = new T.Mesh(new T.CylinderGeometry(1.3,1.3,.28,64), gold);
    coin.rotation.x = PI/2; R.model.add(coin);
    const rim = new T.Mesh(new T.TorusGeometry(1.3,.05,16,64), dark);
    R.model.add(rim);
    const faceMat = new T.MeshStandardMaterial({map:faceTex.tex,roughness:.3,metalness:.6});
    const faceF = new T.Mesh(new T.CircleGeometry(1.25,64), faceMat); faceF.position.z = .15; R.model.add(faceF);
    const faceB = new T.Mesh(new T.CircleGeometry(1.25,64), faceMat); faceB.position.z = -.15; faceB.rotation.y = PI; R.model.add(faceB);
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt*.6; R.root.rotation.x = .2; } };
  };

  /* 4.2 Ракета */
  M3.c3_rocket = pal => {
    const R = rig(pal), T = R.T;
    const white = MC("#e8edf3",{gloss:.9,dark:"#2a3038"});
    const red = MC("#e6192d",{gloss:.9});
    const blue = MC("#4cc9f0",{gloss:1,hi:"#bff3ff"});
    const fireMat = new T.MeshBasicMaterial({color:0xffaa33,transparent:true,opacity:.9});
    const fireMat2 = new T.MeshBasicMaterial({color:0xff4422,transparent:true,opacity:.8});
    const grp = new T.Group(); R.model.add(grp);
    const body = new T.Mesh(new T.CylinderGeometry(.5,.7,2.5,32), white); body.position.y = .5; grp.add(body);
    const nose = new T.Mesh(new T.ConeGeometry(.5,1.2,32), red); nose.position.y = 2.35; grp.add(nose);
    const win = new T.Mesh(new T.SphereGeometry(.28,24,16), blue); win.position.set(0,1.3,.42); grp.add(win);
    [0,1,2].forEach(i=>{
      const a = i/3*TAU;
      const fin = new T.Mesh(new T.BoxGeometry(.15,1.0,.7), red);
      fin.position.set(cos(a)*.65,.1,sin(a)*.65); fin.rotation.y = -a; grp.add(fin);
    });
    const flame = new T.Mesh(new T.ConeGeometry(.45,1.3,24), fireMat); flame.position.y = -1.4; flame.rotation.x = PI; grp.add(flame);
    const flame2 = new T.Mesh(new T.ConeGeometry(.25,.8,20), fireMat2); flame2.position.y = -1.7; flame2.rotation.x = PI; grp.add(flame2);
    grp.rotation.z = -.2; grp.position.y = .2;
    R.fit(4.2);
    return { sc: R.sc, up: lt => {
      R.root.rotation.y = sin(lt*.5)*.4;
      flame.scale.y = 1 + sin(lt*12)*.15;
      flame2.scale.y = 1 + sin(lt*15)*.2;
    }};
  };

  /* 4.3 Кошелёк */
  M3.c3_wallet = pal => {
    const R = rig(pal), T = R.T;
    const leather = MC("#2a1810",{gloss:.6,dark:"#0a0500"});
    const leatherLite = MC("#3a2515",{gloss:.7});
    const gold = MC("#f7931a",{gloss:1,hi:"#ffd28a"});
    const body = new T.Mesh(new T.BoxGeometry(2.4,1.6,.5), leather); R.model.add(body);
    const flap = new T.Mesh(new T.BoxGeometry(2.4,.9,.5), leatherLite); flap.position.y = .4; R.model.add(flap);
    const slot = new T.Mesh(new T.BoxGeometry(2.0,.05,.35), MC("#5a3a20",{gloss:.4})); slot.position.set(0,-.2,.05); R.model.add(slot);
    for (let i=0;i<20;i++){
      const z = new T.Mesh(new T.BoxGeometry(.06,.06,.06), gold);
      z.position.set(-1.1+i*.115,.85,0); R.model.add(z);
    }
    const emTex = canvasTex(256,256,(x,w,h)=>{
      x.fillStyle = "#2a1810"; x.fillRect(0,0,w,h);
      x.fillStyle = "#f7931a"; x.beginPath(); x.arc(128,128,100,0,TAU); x.fill();
      x.fillStyle = "#fff"; x.font = "900 140px Arial,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(BTC_SYM,128,145);
    });
    const em = new T.Mesh(new T.CircleGeometry(.35,32), new T.MeshStandardMaterial({map:emTex.tex,roughness:.4}));
    em.position.set(0,0,.26); R.model.add(em);
    const coin = new T.Mesh(new T.CylinderGeometry(.35,.35,.08,32), gold);
    coin.rotation.x = PI/2; coin.position.set(.8,.7,.1); R.model.add(coin);
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt*.5)*.5; R.root.rotation.x = .15+sin(lt*.4)*.05; } };
  };

  /* 4.4 Цепочка */
  M3.c3_chain = pal => {
    const R = rig(pal), T = R.T;
    const gold = MC("#f7931a",{gloss:1,hi:"#ffd28a",dark:"#5a2800"});
    [-.9,0,.9].forEach((y,i)=>{
      const link = new T.Mesh(new T.TorusGeometry(.5,.15,16,48), gold);
      link.position.y = y; link.rotation.x = PI/2;
      if (i%2===1) link.rotation.y = PI/2;
      R.model.add(link);
    });
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt*.5; R.root.rotation.x = .4+sin(lt*.6)*.1; } };
  };

  /* 4.5 Блокчейн-куб */
  M3.c3_cube = pal => {
    const R = rig(pal), T = R.T;
    const blue = MC("#4cc9f0",{gloss:.8,hi:"#d0f0ff",dark:"#0a2840"});
    const gold = MC("#f7931a",{gloss:.9,hi:"#ffd28a"});
    const nodes = [[-1,0,0],[1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    nodes.forEach(([x,y,z],i)=>{
      const cube = new T.Mesh(new T.BoxGeometry(.6,.6,.6), i===0 ? gold : blue);
      cube.position.set(x*1.4,y*1.4,z*1.4); R.model.add(cube);
    });
    nodes.slice(1).forEach(([x,y,z])=>{
      const line = new T.Mesh(new T.CylinderGeometry(.03,.03,1.4,8), MC("#fff",{gloss:.5}));
      line.position.set(x*.7,y*.7,z*.7);
      const dir = new T.Vector3(x,y,z).normalize();
      line.quaternion.setFromUnitVectors(new T.Vector3(0,1,0), dir);
      R.model.add(line);
    });
    R.fit(3.6);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt*.4; R.root.rotation.x = .3+sin(lt*.5)*.1; } };
  };

  /* 4.6 Эфириум-ромб */
  M3.c3_diamond = pal => {
    const R = rig(pal), T = R.T;
    const ethMat = MC("#627eea",{gloss:1,hi:"#b0c0ff",dark:"#101a50"});
    const ethLight = MC("#8ca0f0",{gloss:1,hi:"#e0e8ff",dark:"#1a2870"});
    const grp = new T.Group(); R.model.add(grp);
    const top = new T.Mesh(new T.ConeGeometry(1.2,1.4,4), ethLight);
    top.position.y = .7; top.rotation.y = PI/4; grp.add(top);
    const bot = new T.Mesh(new T.ConeGeometry(1.2,1.4,4), ethMat);
    bot.position.y = -.7; bot.rotation.y = PI/4; bot.rotation.x = PI; grp.add(bot);
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt*.5; R.root.rotation.x = .2; } };
  };

  /* 4.7 Сейф */
  M3.c3_vault = pal => {
    const R = rig(pal), T = R.T;
    const metal = MC("#4a525e",{gloss:.9,hi:"#c0c8d0",dark:"#0a0e14"});
    const dark = MC("#1a1e26",{gloss:.5});
    const gold = MC("#f7931a",{gloss:1,hi:"#ffd28a"});
    const body = new T.Mesh(new T.BoxGeometry(2.6,2.6,2.0), metal); R.model.add(body);
    const door = new T.Mesh(new T.CylinderGeometry(1.0,1.0,.3,48), dark);
    door.rotation.x = PI/2; door.position.z = 1.0; R.model.add(door);
    const wheel = new T.Mesh(new T.TorusGeometry(.5,.06,12,48), gold);
    wheel.position.z = 1.2; R.model.add(wheel);
    for (let i=0;i<3;i++){
      const spoke = new T.Mesh(new T.BoxGeometry(.08,1.0,.06), gold);
      spoke.position.z = 1.2; spoke.rotation.z = i/3*PI; R.model.add(spoke);
    }
    const knob = new T.Mesh(new T.SphereGeometry(.15,16,12), gold); knob.position.z = 1.28; R.model.add(knob);
    for (let i=0;i<8;i++){
      const a = i/8*TAU;
      const bolt = new T.Mesh(new T.SphereGeometry(.08,12,8), MC("#808890",{gloss:.8}));
      bolt.position.set(cos(a)*1.15, sin(a)*1.15, 1.02); R.model.add(bolt);
    }
    R.fit(3.6);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt*.4)*.5; R.root.rotation.x = .15; wheel.rotation.z = sin(lt*.8)*.2; } };
  };

  /* 4.8 3D-график */
  M3.c3_chart = pal => {
    const R = rig(pal), T = R.T;
    const green = MC("#00d4aa",{gloss:.9,hi:"#b0ffe8"});
    const greenDark = MC("#009c7e",{gloss:.9});
    const base = MC("#1a1f2e",{gloss:.6});
    const plate = new T.Mesh(new T.BoxGeometry(3.4,.15,1.6), base); plate.position.y = -1.4; R.model.add(plate);
    const heights = [.6,.9,1.2,1.6,2.0,2.4];
    heights.forEach((h,i)=>{
      const bar = new T.Mesh(new T.BoxGeometry(.4,h,.8), i%2 ? green : greenDark);
      bar.position.set(-1.4+i*.55, -1.3+h/2, 0); R.model.add(bar);
    });
    const arrowMat = MC("#f7931a",{gloss:1,hi:"#ffd28a"});
    const arrowGrp = new T.Group();
    const arrowBody = new T.Mesh(new T.CylinderGeometry(.06,.06,2.4,12), arrowMat);
    arrowBody.rotation.z = -PI/2; arrowGrp.add(arrowBody);
    const arrowHead = new T.Mesh(new T.ConeGeometry(.18,.4,16), arrowMat);
    arrowHead.rotation.z = -PI/2; arrowHead.position.x = 1.3; arrowGrp.add(arrowHead);
    arrowGrp.rotation.z = -.55; arrowGrp.position.set(-.5,1.0,0); R.model.add(arrowGrp);
    R.fit(3.8);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt*.5)*.6; R.root.rotation.x = .2; } };
  };

  /* 4.9 Замок */
  M3.c3_lock = pal => {
    const R = rig(pal), T = R.T;
    const gold = MC("#f7931a",{gloss:1,hi:"#ffd28a",dark:"#5a2800"});
    const chrome = MC("#d5dde6",{gloss:1,dark:"#222c36"});
    const body = new T.Mesh(new T.BoxGeometry(1.6,1.4,.8), gold); body.position.y = -.4; R.model.add(body);
    const kh = new T.Mesh(new T.CircleGeometry(.15,16), MC("#0a0800",{gloss:.3}));
    kh.position.set(0,-.4,.41); R.model.add(kh);
    const slot = new T.Mesh(new T.BoxGeometry(.12,.3,.02), MC("#0a0800",{gloss:.3}));
    slot.position.set(0,-.6,.41); R.model.add(slot);
    const shackle = new T.Mesh(new T.TorusGeometry(.55,.12,16,32,PI), chrome);
    shackle.position.y = .5; R.model.add(shackle);
    [-.55,.55].forEach(x=>{
      const ext = new T.Mesh(new T.CylinderGeometry(.12,.12,.4,16), chrome);
      ext.position.set(x,.3,0); R.model.add(ext);
    });
    R.fit(3.2);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt*.5)*.5; R.root.rotation.x = .15; } };
  };

  /* 4.10 Майнинг-ферма */
  M3.c3_mining = pal => {
    const R = rig(pal), T = R.T;
    const frame = MC("#1a1e26",{gloss:.6});
    const gpuM = MC("#2a3040",{gloss:.8,dark:"#050810"});
    const fanM = MC("#4cc9f0",{gloss:.9,hi:"#d0f0ff"});
    const ledM = new T.MeshBasicMaterial({color:0x00ff88});
    [-1.2,1.2].forEach(x=>[-1.4,1.4].forEach(z=>{
      const bar = new T.Mesh(new T.CylinderGeometry(.06,.06,2.8,12), frame);
      bar.position.set(x,0,z); R.model.add(bar);
    }));
    [-1.2,1.2].forEach(x=>{
      const bar = new T.Mesh(new T.CylinderGeometry(.05,.05,2.4,12), frame);
      bar.rotation.z = PI/2; bar.position.set(0,1.3,x); R.model.add(bar);
      const bar2 = bar.clone(); bar2.position.y = -1.3; R.model.add(bar2);
    });
    for (let i=0;i<3;i++){
      const g = new T.Mesh(new T.BoxGeometry(1.8,.5,.9), gpuM);
      g.position.set(0,-.6+i*.6,0); R.model.add(g);
      [.5,-.5].forEach(x=>{
        const f = new T.Mesh(new T.CylinderGeometry(.2,.2,.02,24), fanM);
        f.rotation.x = PI/2; f.position.set(x,-.6+i*.6,.47); R.model.add(f);
      });
      const l = new T.Mesh(new T.SphereGeometry(.04,8,6), ledM);
      l.position.set(.75,-.6+i*.6+.18,.46); R.model.add(l);
    }
    R.fit(3.6);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt*.4)*.5+.2; R.root.rotation.x = .15; } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ
     ========================================================== */
  const bgFns = {
    c_chart: bgChart, c_matrix: bgMatrix, c_blocks: bgBlocks, c_ticker: bgTicker, c_network: bgNetwork,
    c_waves: bgWaves, c_mining: bgMining, c_moon: bgMoon, c_coins: bgCoins, c_grid: bgGrid
  };
  const shapeFns = {
    cs_rocket: csRocket, cs_coin: csCoin, cs_chart: csChart, cs_wallet: csWallet, cs_chain: csChain,
    cs_lock: csLock, cs_mine: csMine, cs_swap: csSwap, cs_candles: csCandles, cs_moon: csMoon
  };
  const names = {
    c_chart: "Торговый график", c_matrix: "Матрица хешей", c_blocks: "Блокчейн", c_ticker: "Табло обмена",
    c_network: "Сеть узлов", c_waves: "Волатильность", c_mining: "Майнинг", c_moon: "Луна / to the moon",
    c_coins: "Дождь монет", c_grid: "Перспективная сетка",
    cs_rocket: "Ракета", cs_coin: "Биткоин-монета", cs_chart: "Рост графика", cs_wallet: "Кошелёк",
    cs_chain: "Звенья цепи", cs_lock: "Замок", cs_mine: "Майнинг-кирка", cs_swap: "Обмен",
    cs_candles: "Растущие свечи", cs_moon: "Луна и ракета",
    c3_coin: "Биткоин 3D", c3_rocket: "Ракета 3D", c3_wallet: "Кошелёк 3D", c3_chain: "Цепочка 3D",
    c3_cube: "Блокчейн-куб 3D", c3_diamond: "Эфириум 3D", c3_vault: "Сейф 3D",
    c3_chart: "3D-график", c3_lock: "Замок 3D", c3_mining: "Майнинг-ферма 3D"
  };

  if (!window.MSPack) {
    const _bg = drawBg, _sh = drawShape, _th = thBuild, B = {}, S = {}, M = {};
    drawBg = function (c,w,h,type,t,pal) { const f = B[type]; if (f) { c.fillStyle = pal[0]; c.fillRect(0,0,w,h); return f(c,w,h,t,pal); } return _bg(c,w,h,type,t,pal); };
    drawShape = function (c,w,h,L,lt,dur,pal) {
      const f = S[L.shape]; if (!f) return _sh(c,w,h,L,lt,dur,pal);
      const q = ob(clamp(lt/.5)), R = (L.size||.2)*w*q/2;
      c.save(); c.globalAlpha = clamp((dur-lt)/.3);
      c.translate((L.x||.5)*w, (L.y||.5)*h);
      f(c,R,lt,pal);
      c.restore();
    };
    thBuild = function (m,pal) { const f = M[m]; return f ? f(pal) : _th(m,pal); };
    window.MSPack = { B, S, M };
  }
  const P = window.MSPack;
  Object.assign(P.B, bgFns); Object.assign(P.S, shapeFns); Object.assign(P.M, M3);

  const DOMAIN = "Крипто";
  try { if (typeof LIB_DOMAINS !== "undefined" && !LIB_DOMAINS.includes(DOMAIN)) LIB_DOMAINS.push(DOMAIN); } catch (e) {}

  function addCard(it) {
    it.domain = DOMAIN; LIB.push(it);
    if (typeof grid === "undefined") return;
    const b = document.createElement("button"); b.className = "card";
    b.dataset.s = (it.cat+" "+it.name+" "+it.tags).toLowerCase();
    b.innerHTML = `<canvas width="320" height="180"></canvas><b>${it.name}</b><small>${it.domain}</small>`;
    it.cv = b.querySelector("canvas"); it.sc = it.mk(); it.el = b;
    b.onclick = () => it.act && it.act();
    grid.appendChild(b); if (typeof io !== "undefined") io.observe(b);
  }
  const scene = o => () => addScene(o);

  Object.keys(bgFns).forEach(id => {
    BG.push(id); BUSY.push(id); N[id] = names[id];
    addCard({ id, cat: "Фон", name: "Крипто: "+names[id], tags: "крипто блокчейн фон "+names[id],
      mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "whoosh" }],
        layers: [{ type: "text", fx: "words", text: "To the *moon*", y: .5, size: .09 }] }) });
  });

  Object.keys(ICONS).forEach(id => {
    ICO[id] = ICONS[id][1]; ICN.push([id, ICONS[id][0]]);
    addCard({ id: "ico_"+id, cat: "Иконка", name: "Крипто: "+ICONS[id][0], tags: "крипто иконка "+id+" "+ICONS[id][0],
      mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: .5, size: .4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "pop" }],
        layers: [{ type: "icon", name: id, y: .45, size: .4 }] }) });
  });

  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_"+id, cat: "Анимация", name: "Крипто: "+names[id], tags: "крипто анимация "+names[id],
      mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: .5, y: .5, size: .48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }],
        layers: [{ type: "shape", shape: id, x: .5, y: .42, size: .8 }] }) });
  });

  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_"+id, cat: "3D", name: "Крипто: "+names[id], tags: "крипто 3d три д "+names[id],
      mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: .5, y: .5, size: .52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: .1, id: "whoosh" }],
        layers: [{ type: "three", model: id, x: .5, y: .42, size: .85 }] }) });
  });

  try { if (typeof filt === "function") filt(); } catch (e) {}
  try {
    const sel = document.getElementById("catfilter");
    if (sel && !Array.from(sel.options).some(o=>o.value===DOMAIN)) {
      const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o);
    }
  } catch (e) {}

  const HINT = "ПАК КРИПТО (используй для криптовалют, блокчейна, трейдинга, DeFi, NFT, майнинга): фоны c_chart (торговый график), c_matrix (матрица хешей), c_blocks (блокчейн), c_ticker (табло обмена), c_network (сеть узлов), c_waves (волатильность), c_mining (майнинг), c_moon (луна), c_coins (монеты), c_grid (сетка). Анимации shape: cs_rocket, cs_coin, cs_chart, cs_wallet, cs_chain, cs_lock, cs_mine, cs_swap, cs_candles, cs_moon. Иконки icon: bitcoin, ethereum, wallet, chart, rocket, lock, swap, cpu, coin, candle. 3D three.model: c3_coin, c3_rocket, c3_wallet, c3_chain, c3_cube, c3_diamond, c3_vault, c3_chart, c3_lock, c3_mining.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u,o) {
      try {
        if (o && typeof o.body === "string" && /\/director$/.test(String(u))) {
          const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n")+"\n"+(b.hint||""); o.body = JSON.stringify(b);
        }
      } catch (e) {}
      return _f.apply(this, arguments);
    };
  }
  window.__hintPatch.push(HINT);
})();