/* ==========================================================
   MOTION STUDIO · ПАК «ЗДОРОВЬЕ»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-health.js"></script>
   (после основного <script>). Файл лежит рядом со страницей.
   ========================================================== */
(function () {
  "use strict";
  if (window.__packHealth) return;

  /* ---------- проверка, что основная страница загружена ---------- */
  const need = ["BG", "ICO", "ICN", "N", "SHP", "TH3", "LIB", "BUSY", "drawBg", "drawShape", "thBuild", "clamp", "eo", "ob", "rnd"];
  const missing = need.filter(n => { try { return typeof (0, eval)(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «Здоровье» не подключён, нет:", missing.join(", ")); return; }
  window.__packHealth = true;

  /* ---------- общие помощники ---------- */
  const TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const hx = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mixc = (a, b, t) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };
  const gauss = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
  const beat = lt => { const p = (lt % 0.85) / 0.85; return gauss(p, 0.06, 0.07) + 0.65 * gauss(p, 0.34, 0.07); };
  const ecgW = p => 0.12 * gauss(p, 0.12, 0.03) - 0.14 * gauss(p, 0.27, 0.008) + gauss(p, 0.3, 0.009) - 0.28 * gauss(p, 0.335, 0.01) + 0.3 * gauss(p, 0.55, 0.04);
  const ease = x => x * x * (3 - 2 * x);
  const heartPath = (c, s) => {
    c.beginPath(); c.moveTo(0, 0.8 * s);
    c.bezierCurveTo(-1.6 * s, -0.2 * s, -0.7 * s, -1.2 * s, 0, -0.4 * s);
    c.bezierCurveTo(0.7 * s, -1.2 * s, 1.6 * s, -0.2 * s, 0, 0.8 * s); c.closePath();
  };
  const RED = "#ff3b57", TEAL = "#19d3c5";

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */
  function bgEcg(c, w, h, t, pal) {
    const col = pal[1], g = w / 12;
    c.save(); c.lineWidth = 1;
    for (let x = 0; x <= w; x += g) { c.strokeStyle = rgba(col, Math.round(x / g) % 5 === 0 ? 0.16 : 0.07); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y <= h; y += g) { c.strokeStyle = rgba(col, Math.round(y / g) % 5 === 0 ? 0.16 : 0.07); c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    [0.26, 0.5, 0.74].forEach((ly, k) => {
      const y0 = h * ly, amp = h * (k === 1 ? 0.11 : 0.08), xh = ((t * (0.22 + 0.04 * k) + k * 0.31) % 1) * w, sc = t * 0.12 * (1 + k * 0.2);
      c.lineCap = "round"; c.lineJoin = "round"; c.shadowColor = col; c.shadowBlur = w * 0.02;
      let prev = null;
      for (let x = 0; x <= w; x += 3) {
        const d = ((((xh - x) % w) + w) % w) / w;
        if (d > 0.9) { prev = null; continue; }
        const u = ((((x / w) * 2.2 - sc) % 1) + 1) % 1, y = y0 - ecgW(u) * amp;
        if (prev) { c.strokeStyle = rgba(col, Math.pow(Math.max(0, 1 - d / 0.9), 1.4)); c.lineWidth = Math.max(1.5, w * 0.006 * (1 - d * 0.6)); c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(x, y); c.stroke(); }
        prev = [x, y];
      }
      const uh = ((((xh / w) * 2.2 - sc) % 1) + 1) % 1;
      c.shadowBlur = w * 0.05; c.fillStyle = "#fff"; c.beginPath(); c.arc(xh, y0 - ecgW(uh) * amp, w * 0.011, 0, TAU); c.fill();
    });
    c.restore();
  }

  function bgDna(c, w, h, t, pal) {
    const n = 46, L = Math.hypot(w, h) * 1.15, A = Math.min(w, h) * 0.2, c1 = pal[1], c2 = "#ff5c8a";
    c.save(); c.translate(w / 2, h / 2); c.rotate(-0.5); c.lineCap = "round";
    const P = [];
    for (let i = 0; i < n; i++) { const s = (i / (n - 1) - 0.5) * L, ph = i * 0.42 + t * 1.3; P.push({ s, x1: sin(ph) * A, z1: cos(ph), i }); }
    P.forEach(p => { const g = c.createLinearGradient(p.s, p.x1, p.s, -p.x1); g.addColorStop(0, rgba(c1, 0.55)); g.addColorStop(1, rgba(c2, 0.55)); c.strokeStyle = g; c.lineWidth = Math.max(1.5, w * 0.005); c.beginPath(); c.moveTo(p.s, p.x1); c.lineTo(p.s, -p.x1); c.stroke(); });
    const segs = [];
    for (let i = 0; i < n - 1; i++) { const a = P[i], b = P[i + 1]; segs.push({ x0: a.s, y0: a.x1, x1: b.s, y1: b.x1, z: (a.z1 + b.z1) / 2, col: c1 }); segs.push({ x0: a.s, y0: -a.x1, x1: b.s, y1: -b.x1, z: -(a.z1 + b.z1) / 2, col: c2 }); }
    segs.sort((a, b) => a.z - b.z).forEach(s => { c.strokeStyle = rgba(s.col, 0.4 + 0.5 * (s.z * 0.5 + 0.5)); c.lineWidth = w * (0.006 + 0.005 * (s.z * 0.5 + 0.5)); c.beginPath(); c.moveTo(s.x0, s.y0); c.lineTo(s.x1, s.y1); c.stroke(); });
    const nodes = [];
    P.forEach(p => { nodes.push({ s: p.s, y: p.x1, z: p.z1, col: c1 }); nodes.push({ s: p.s, y: -p.x1, z: -p.z1, col: c2 }); });
    nodes.sort((a, b) => a.z - b.z).forEach(nd => {
      const r = w * (0.011 + 0.008 * (nd.z * 0.5 + 0.5)), g = c.createRadialGradient(nd.s - r * 0.3, nd.y - r * 0.3, r * 0.1, nd.s, nd.y, r);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, nd.col); g.addColorStop(1, mixc(nd.col, "#000000", 0.5));
      c.globalAlpha = 0.45 + 0.55 * (nd.z * 0.5 + 0.5); c.fillStyle = g; c.beginPath(); c.arc(nd.s, nd.y, r, 0, TAU); c.fill();
    });
    c.restore();
  }

  function bgCells(c, w, h, t) {
    const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.1, w / 2, h / 2, Math.hypot(w, h) * 0.6);
    g.addColorStop(0, "rgba(120,10,40,.45)"); g.addColorStop(1, "rgba(20,0,10,.85)"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const items = []; for (let i = 0; i < 30; i++) items.push({ i, d: rnd(i + 3) });
    items.sort((a, b) => a.d - b.d).forEach(({ i, d }) => {
      const R = w * (0.04 + 0.085 * d), sp = 0.012 + 0.03 * d, x = ((rnd(i) + t * sp) % 1) * (w + 4 * R) - 2 * R, y = rnd(i + 9) * h + sin(t * 0.5 + i) * h * 0.03;
      c.save(); c.translate(x, y); c.rotate(t * 0.3 + i); c.scale(1, 0.55 + 0.45 * Math.abs(sin(t * 0.6 + i * 1.7))); c.globalAlpha = 0.3 + 0.6 * d;
      const gr = c.createRadialGradient(-R * 0.25, -R * 0.25, R * 0.1, 0, 0, R); gr.addColorStop(0, "#ff7d93"); gr.addColorStop(0.7, "#d4193e"); gr.addColorStop(1, "#7d0b24");
      c.fillStyle = gr; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
      c.fillStyle = "rgba(90,0,20,.45)"; c.beginPath(); c.arc(0, 0, R * 0.48, 0, TAU); c.fill();
      c.strokeStyle = "rgba(255,180,195,.35)"; c.lineWidth = R * 0.06; c.beginPath(); c.arc(0, 0, R * 0.8, 3.6, 5.2); c.stroke(); c.restore();
    });
    for (let k = 0; k < 3; k++) {
      const R = w * 0.07, x = ((rnd(k + 50) + t * 0.01) % 1) * (w + 2 * R) - R, y = rnd(k + 60) * h + sin(t * 0.4 + k) * 12;
      c.save(); c.translate(x, y); c.globalAlpha = 0.85;
      const gr = c.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.7, "#cfe6ff"); gr.addColorStop(1, "#7aa6d8"); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
      c.fillStyle = "rgba(90,120,190,.5)"; for (let j = 0; j < 9; j++) { const a = rnd(j + k * 9) * TAU, d = R * 0.75 * Math.sqrt(rnd(j + 77 + k)); c.beginPath(); c.arc(cos(a) * d, sin(a) * d, R * 0.07, 0, TAU); c.fill(); }
      c.restore();
    }
  }

  function bgPulse(c, w, h, t, pal) {
    const cx = w / 2, cy = h * 0.5, R = Math.hypot(w, h) * 0.55, e = beat(t), col = pal[1];
    c.save(); c.translate(cx, cy); c.globalAlpha = 0.1 + 0.1 * e; c.fillStyle = RED; heartPath(c, Math.min(w, h) * 0.5 * (1 + 0.12 * e)); c.fill(); c.restore();
    for (let i = 0; i < 6; i++) { const age = (t * 0.6 + i / 6) % 1; c.strokeStyle = rgba(i % 2 ? "#ff5c7a" : col, (1 - age) * 0.55); c.lineWidth = w * 0.008 * (1 - age) + 1; c.beginPath(); c.arc(cx, cy, age * R, 0, TAU); c.stroke(); }
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * (0.2 + 0.08 * e)); g.addColorStop(0, rgba("#ff5c7a", 0.55 + 0.3 * e)); g.addColorStop(1, rgba("#ff3b57", 0)); c.fillStyle = g; c.fillRect(0, 0, w, h);
  }

  function bgMol(c, w, h, t, pal) {
    const N = 30, pts = [], ay = t * 0.18, ax = 0.5 + sin(t * 0.1) * 0.2;
    for (let i = 0; i < N; i++) {
      const x = (rnd(i) - 0.5) * 2, y = (rnd(i + 7) - 0.5) * 2, z = (rnd(i + 13) - 0.5) * 2;
      const x1 = x * cos(ay) + z * sin(ay), z1 = -x * sin(ay) + z * cos(ay), y1 = y * cos(ax) - z1 * sin(ax), z2 = y * sin(ax) + z1 * cos(ax), f = 1 / (1.6 - z2 * 0.5);
      pts.push({ x1, y1, z2, X: w / 2 + x1 * w * 0.55 * f, Y: h / 2 + y1 * h * 0.45 * f, f, i });
    }
    c.lineCap = "round";
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x1 - b.x1, a.y1 - b.y1, a.z2 - b.z2);
      if (d < 0.78) { c.strokeStyle = rgba(pal[1], (1 - d / 0.78) * 0.5 * (0.5 + 0.25 * (a.z2 + b.z2 + 2))); c.lineWidth = w * 0.004 * (a.f + b.f); c.beginPath(); c.moveTo(a.X, a.Y); c.lineTo(b.X, b.Y); c.stroke(); }
    }
    pts.sort((a, b) => a.z2 - b.z2).forEach(p => {
      const r = w * 0.022 * p.f * (1 + 0.4 * rnd(p.i + 3)), col = [pal[1], "#ff5c8a", "#4cc9f0", "#ffffff"][p.i % 4], g = c.createRadialGradient(p.X - r * 0.35, p.Y - r * 0.35, r * 0.1, p.X, p.Y, r);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, col); g.addColorStop(1, mixc(col, "#000000", 0.55));
      c.globalAlpha = 0.5 + 0.5 * (p.z2 * 0.5 + 0.5); c.fillStyle = g; c.beginPath(); c.arc(p.X, p.Y, r, 0, TAU); c.fill();
    });
    c.globalAlpha = 1;
  }

  function bgVessel(c, w, h, t) {
    const L = Math.hypot(w, h) * 1.2, H = Math.min(w, h) * 0.42, cl = x => sin(x / L * 5 + t * 0.25) * H * 0.25;
    c.save(); c.translate(w / 2, h / 2); c.rotate(-0.42);
    const tissue = c.createLinearGradient(0, -L / 2, 0, L / 2); tissue.addColorStop(0, "#2a0a14"); tissue.addColorStop(1, "#14040a"); c.fillStyle = tissue; c.fillRect(-L / 2, -L / 2, L, L);
    const wall = c.createLinearGradient(0, -H * 1.2, 0, H * 1.2); wall.addColorStop(0, "#5a0a1e"); wall.addColorStop(0.15, "#a3173a"); wall.addColorStop(0.5, "#e0526e"); wall.addColorStop(0.85, "#a3173a"); wall.addColorStop(1, "#5a0a1e");
    c.beginPath(); for (let x = -L / 2; x <= L / 2; x += 14) { const y = cl(x) - H; x === -L / 2 ? c.moveTo(x, y) : c.lineTo(x, y); }
    for (let x = L / 2; x >= -L / 2; x -= 14) c.lineTo(x, cl(x) + H); c.closePath(); c.fillStyle = wall; c.fill();
    c.lineWidth = H * 0.1; c.strokeStyle = "rgba(60,0,16,.85)"; [-1, 1].forEach(sg => { c.beginPath(); for (let x = -L / 2; x <= L / 2; x += 14) { const y = cl(x) + sg * H; x === -L / 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); });
    c.lineWidth = H * 0.025; c.strokeStyle = "rgba(255,170,190,.35)"; c.beginPath(); for (let x = -L / 2; x <= L / 2; x += 14) { const y = cl(x) - H * 0.88; x === -L / 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    for (let i = 0; i < 26; i++) {
      const u = (rnd(i) + t * 0.1 * (0.6 + rnd(i + 2))) % 1, x = (u - 0.5) * L, y = cl(x) + (rnd(i + 5) - 0.5) * H * 1.45, R = H * 0.17 * (0.8 + rnd(i + 8) * 0.5);
      c.save(); c.translate(x, y); c.rotate(sin(t + i) * 0.3); c.scale(1.15, 0.8 + 0.2 * sin(t * 2 + i));
      const gr = c.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R); gr.addColorStop(0, "#ff8da0"); gr.addColorStop(0.7, "#d4193e"); gr.addColorStop(1, "#7d0b24"); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
      c.fillStyle = "rgba(90,0,20,.4)"; c.beginPath(); c.arc(0, 0, R * 0.45, 0, TAU); c.fill(); c.restore();
    }
    const bx = ((t * 0.35) % 1 - 0.5) * L, pg = c.createLinearGradient(bx - H, 0, bx + H, 0); pg.addColorStop(0, "rgba(255,255,255,0)"); pg.addColorStop(0.5, "rgba(255,210,220,.22)"); pg.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = pg; c.fillRect(bx - H, -L / 2, H * 2, L); c.restore();
  }

  function bgCross(c, w, h, t, pal) {
    const g = w / 7;
    for (let j = -1; j < h / g + 1; j++) for (let i = -1; i < 8; i++) {
      const x = i * g + g / 2 + (j & 1 ? g * 0.5 : 0), y = j * g + g / 2, wv = sin(i * 0.8 + j * 0.6 - t * 2) * 0.5 + 0.5, s = g * 0.1 * (0.5 + 0.8 * wv);
      c.globalAlpha = 0.08 + 0.55 * wv; c.fillStyle = (i + j) % 3 === 0 ? RED : pal[1];
      if ((i + j + 70) % 7 === 0) { c.save(); c.translate(x, y); heartPath(c, s * 0.9); c.fill(); c.restore(); }
      else { c.fillRect(x - s, y - s * 0.33, s * 2, s * 0.66); c.fillRect(x - s * 0.33, y - s, s * 0.66, s * 2); }
    }
    c.globalAlpha = 1;
  }

  function bgBreath(c, w, h, t, pal) {
    const s = 0.5 - 0.5 * cos(t * TAU / 6), cx = w / 2, cy = h / 2, col = mixc(pal[1], TEAL, 0.5);
    for (let k = 0; k < 4; k++) { const r = Math.min(w, h) * (0.18 + 0.12 * k) * (0.75 + 0.5 * s), g = c.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, rgba(col, 0.18 - 0.03 * k)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, w, h); }
    for (let i = 0; i < 80; i++) {
      const a = rnd(i) * TAU + t * 0.08 * (rnd(i + 2) - 0.5), rr = Math.min(w, h) * (0.12 + 0.45 * rnd(i + 4)) * (0.8 + 0.35 * s) + sin(t + i) * 6;
      c.globalAlpha = 0.15 + 0.4 * s; c.fillStyle = col; c.beginPath(); c.arc(cx + cos(a) * rr, cy + sin(a) * rr * 1.3, w * (0.003 + 0.005 * rnd(i + 6)), 0, TAU); c.fill();
    }
    c.globalAlpha = 1; c.strokeStyle = rgba(col, 0.35); c.lineWidth = w * 0.004; c.beginPath(); c.arc(cx, cy, Math.min(w, h) * 0.22 * (0.8 + 0.4 * s), 0, TAU); c.stroke();
  }

  function bgHex(c, w, h, t, pal) {
    const R = w / 8, hh = R * Math.sqrt(3), col = pal[1];
    for (let q = -1; q < 12; q++) for (let row = -1; row < h / hh + 2; row++) {
      const x = q * R * 1.5, y = row * hh + (q & 1 ? hh / 2 : 0), wv = sin(x * 0.01 - y * 0.012 + t * 1.4);
      c.strokeStyle = rgba(col, 0.08 + 0.3 * Math.max(0, wv)); c.lineWidth = Math.max(1, w * 0.003);
      const hex = (rr) => { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * PI / 3; k ? c.lineTo(x + cos(a) * rr, y + sin(a) * rr) : c.moveTo(x + cos(a) * rr, y + sin(a) * rr); } c.closePath(); c.stroke(); };
      hex(R * 0.92);
      if (rnd(q * 31 + row * 7) > 0.78) { c.strokeStyle = rgba(col, 0.12 + 0.3 * Math.max(0, wv)); hex(R * 0.6); }
    }
    const ly = h * 0.72, lg = c.createLinearGradient(0, ly, 0, h); lg.addColorStop(0, rgba(TEAL, 0.28)); lg.addColorStop(1, rgba(TEAL, 0.05));
    c.fillStyle = lg; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 8) c.lineTo(x, ly + sin(x / w * 7 + t * 1.5) * h * 0.008); c.lineTo(w, h); c.closePath(); c.fill();
    for (let i = 0; i < 26; i++) {
      const r = w * (0.008 + 0.02 * rnd(i + 3)), x = rnd(i) * w + sin(t * 0.8 + i) * w * 0.02, y = h - ((rnd(i + 5) * h + t * h * (0.04 + 0.06 * rnd(i + 9))) % (h * 1.1)) + r;
      c.strokeStyle = rgba("#ffffff", 0.45); c.lineWidth = Math.max(1, r * 0.12); c.fillStyle = rgba(TEAL, 0.12); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
      c.strokeStyle = rgba("#ffffff", 0.7); c.beginPath(); c.arc(x, y, r * 0.65, 3.6, 4.6); c.stroke();
    }
  }

  function bgMri(c, w, h, t, pal) {
    const cx = w / 2, cy = h * 0.5, R = Math.min(w, h) * 0.42, col = pal[1];
    c.save(); c.translate(cx, cy);
    for (let i = 0; i < 42; i++) { const a = rnd(i) * TAU + sin(t * 0.3 + i) * 0.05, rr = R * 0.78 * Math.sqrt(rnd(i + 3)), s = R * (0.06 + 0.12 * rnd(i + 5)), g = c.createRadialGradient(cos(a) * rr, sin(a) * rr, 0, cos(a) * rr, sin(a) * rr, s); g.addColorStop(0, rgba(col, 0.18)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-R, -R, R * 2, R * 2); }
    c.strokeStyle = rgba(col, 0.55); c.lineWidth = R * 0.035; c.beginPath(); c.ellipse(0, 0, R * 0.92, R * 1.0, 0, 0, TAU); c.stroke();
    c.lineWidth = Math.max(1, w * 0.003);
    for (let k = 1; k <= 5; k++) { c.strokeStyle = rgba(col, 0.12 + 0.03 * k); c.beginPath(); c.arc(0, 0, R * k / 5 * 1.12, 0, TAU); c.stroke(); }
    for (let d = 0; d < 360; d += 6) { const a = d * PI / 180, l = d % 30 === 0 ? 0.08 : 0.04; c.strokeStyle = rgba(col, 0.4); c.beginPath(); c.moveTo(cos(a) * R * 1.12, sin(a) * R * 1.12); c.lineTo(cos(a) * R * (1.12 + l), sin(a) * R * (1.12 + l)); c.stroke(); }
    const ang = t * 1.5;
    for (let k = 0; k < 32; k++) { const a0 = ang - k * 0.045; c.fillStyle = rgba(col, 0.26 * (1 - k / 32)); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R * 1.12, a0 - 0.05, a0); c.closePath(); c.fill(); }
    c.strokeStyle = rgba("#ffffff", 0.8); c.lineWidth = w * 0.004; c.beginPath(); c.moveTo(0, 0); c.lineTo(cos(ang) * R * 1.12, sin(ang) * R * 1.12); c.stroke();
    c.strokeStyle = rgba(col, 0.25); c.beginPath(); c.moveTo(-R * 1.3, 0); c.lineTo(R * 1.3, 0); c.moveTo(0, -R * 1.3); c.lineTo(0, R * 1.3); c.stroke();
    c.restore();
    const by = ((t * 0.25) % 1) * h, bg = c.createLinearGradient(0, by - h * 0.05, 0, by + h * 0.05); bg.addColorStop(0, rgba(col, 0)); bg.addColorStop(0.5, rgba(col, 0.16)); bg.addColorStop(1, rgba(col, 0)); c.fillStyle = bg; c.fillRect(0, by - h * 0.05, w, h * 0.1);
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр в (0,0)
     ========================================================== */
  function aHeart(c, R, lt) {
    const e = beat(lt), s = R * 0.8 * (1 + 0.1 * e);
    for (let i = 0; i < 3; i++) { const age = (lt * 1.18 + i / 3) % 1; c.strokeStyle = rgba(RED, (1 - age) * 0.5); c.lineWidth = R * 0.04; c.beginPath(); c.arc(0, 0, R * (0.8 + age * 0.9), 0, TAU); c.stroke(); }
    c.save(); c.translate(0, s * 0.1); c.lineCap = "round";
    c.lineWidth = s * 0.17; c.strokeStyle = "#e8506a"; c.beginPath(); c.moveTo(s * 0.18, -s * 0.5); c.bezierCurveTo(s * 0.2, -s * 1.0, s * 0.55, -s * 1.25, s * 1.0, -s * 1.1); c.stroke();
    c.strokeStyle = "#3a8dff"; c.beginPath(); c.moveTo(-s * 0.25, -s * 0.5); c.bezierCurveTo(-s * 0.3, -s * 1.0, -s * 0.6, -s * 1.2, -s * 0.95, -s * 1.05); c.stroke();
    c.shadowColor = RED; c.shadowBlur = R * 0.35 * (0.6 + e * 0.7);
    const g = c.createLinearGradient(0, -s, 0, s); g.addColorStop(0, "#ff7d93"); g.addColorStop(0.5, "#ee2f52"); g.addColorStop(1, "#a50d2a"); c.fillStyle = g; heartPath(c, s); c.fill(); c.shadowBlur = 0;
    c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.ellipse(-s * 0.5, -s * 0.45, s * 0.22, s * 0.12, -0.6, 0, TAU); c.fill(); c.restore();
  }

  function aEcg(c, R, lt, pal) {
    const W = R * 2.4, amp = R * 0.8, col = pal[1], per = 3.2, xh = ((lt % per) / per) * W - W / 2;
    c.save(); c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = rgba(col, 0.12); c.lineWidth = 1; for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(k * W / 12, -R * 0.95); c.lineTo(k * W / 12, R * 0.95); c.stroke(); }
    for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(-W / 2, k * R * 0.3); c.lineTo(W / 2, k * R * 0.3); c.stroke(); }
    c.shadowColor = col; c.shadowBlur = R * 0.12; let prev = null;
    for (let k = 0; k <= 160; k++) {
      const x = -W / 2 + k / 160 * W, d = (xh - x) / W; if (d < 0 || d > 1.1) { prev = null; continue; }
      const y = -ecgW((((x + W / 2) / W * 2.2) % 1 + 1) % 1) * amp;
      if (prev) { c.strokeStyle = rgba(col, Math.max(0, 1 - d * 0.9)); c.lineWidth = R * 0.05; c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(x, y); c.stroke(); } prev = [x, y];
    }
    c.fillStyle = "#fff"; c.beginPath(); c.arc(xh, -ecgW((((xh + W / 2) / W * 2.2) % 1 + 1) % 1) * amp, R * 0.06, 0, TAU); c.fill();
    c.shadowBlur = 0; c.translate(0, -R * 1.05); c.fillStyle = RED; heartPath(c, R * 0.13 * (1 + 0.15 * beat(lt))); c.fill(); c.restore();
  }

  function aHelix(c, R, lt, pal) {
    const n = 20, Hh = R * 2.3, A = R * 0.55, c1 = "#ff5c8a", c2 = pal[1], P = [];
    for (let i = 0; i < n; i++) { const y = (i / (n - 1) - 0.5) * Hh, ph = i * 0.55 + lt * 1.6; P.push({ y, x: sin(ph) * A, z: cos(ph) }); }
    c.lineCap = "round";
    P.forEach(p => { const g = c.createLinearGradient(p.x, p.y, -p.x, p.y); g.addColorStop(0, rgba(c1, 0.7)); g.addColorStop(1, rgba(c2, 0.7)); c.strokeStyle = g; c.lineWidth = R * 0.045; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(-p.x, p.y); c.stroke(); });
    const segs = []; for (let i = 0; i < n - 1; i++) { segs.push({ a: P[i], b: P[i + 1], k: 1, z: (P[i].z + P[i + 1].z) / 2 }); segs.push({ a: P[i], b: P[i + 1], k: -1, z: -(P[i].z + P[i + 1].z) / 2 }); }
    segs.sort((a, b) => a.z - b.z).forEach(s => { c.strokeStyle = rgba(s.k > 0 ? c1 : c2, 0.45 + 0.5 * (s.z * 0.5 + 0.5)); c.lineWidth = R * (0.05 + 0.04 * (s.z * 0.5 + 0.5)); c.beginPath(); c.moveTo(s.a.x * s.k, s.a.y); c.lineTo(s.b.x * s.k, s.b.y); c.stroke(); });
    const nd = []; P.forEach(p => { nd.push({ x: p.x, y: p.y, z: p.z, col: c1 }); nd.push({ x: -p.x, y: p.y, z: -p.z, col: c2 }); });
    nd.sort((a, b) => a.z - b.z).forEach(p => { const r = R * (0.055 + 0.04 * (p.z * 0.5 + 0.5)), g = c.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.1, p.x, p.y, r); g.addColorStop(0, "#fff"); g.addColorStop(0.4, p.col); g.addColorStop(1, mixc(p.col, "#000000", 0.5)); c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, r, 0, TAU); c.fill(); });
  }

  function aMitosis(c, R, lt) {
    const per = 7, p = (lt % per) / per, r0 = R * 0.62, sep = p < 0.6 ? 0 : Math.min(1, (p - 0.6) / 0.4), d = R * 0.75 * ease(sep), rr = r0 * (1 - 0.12 * sep);
    const cyto = (x) => { const g = c.createRadialGradient(x - rr * 0.3, -rr * 0.3, rr * 0.1, x, 0, rr); g.addColorStop(0, "#7ef0dc"); g.addColorStop(0.7, "#22b8b0"); g.addColorStop(1, "#0a7f86"); return g; };
    c.lineCap = "round";
    if (sep > 0.05 && sep < 1) { c.strokeStyle = "#22b8b0"; c.lineWidth = rr * 2 * (1 - Math.min(1, Math.max(0, (sep - 0.45) / 0.55))) + 1; c.beginPath(); c.moveTo(-d, 0); c.lineTo(d, 0); c.stroke(); }
    [-1, 1].forEach(sg => { const x = sg * d; c.fillStyle = cyto(x); c.beginPath(); c.arc(x, 0, rr, 0, TAU); c.fill(); c.strokeStyle = "rgba(190,255,245,.8)"; c.lineWidth = R * 0.025; c.beginPath(); c.arc(x, 0, rr, 0, TAU); c.stroke(); });
    const nuc = p < 0.45 ? 1 - Math.min(1, Math.max(0, (p - 0.25) / 0.2)) : 0;
    if (nuc > 0) { c.globalAlpha = nuc; c.fillStyle = "#8a6bff"; c.beginPath(); c.arc(0, 0, rr * 0.45, 0, TAU); c.fill(); c.fillStyle = "#3a2a9a"; c.beginPath(); c.arc(rr * 0.1, -rr * 0.08, rr * 0.14, 0, TAU); c.fill(); c.globalAlpha = 1; }
    if (p > 0.22) {
      const form = Math.min(1, (p - 0.22) / 0.2), align = ease(Math.min(1, Math.max(0, (p - 0.4) / 0.2)));
      for (let i = 0; i < 6; i++) {
        const y = (i - 2.5) * rr * 0.22, sx = (rnd(i) - 0.5) * rr * 0.7, sy = (rnd(i + 9) - 0.5) * rr * 0.9, x0 = sx * (1 - align), y0 = sy * (1 - align) + y * align, ln = rr * 0.17 * form;
        c.lineWidth = R * 0.05; c.strokeStyle = i % 2 ? "#ff5c8a" : "#ffd166";
        if (sep === 0) { c.beginPath(); c.moveTo(x0 - ln, y0 - ln); c.lineTo(x0 + ln, y0 + ln); c.moveTo(x0 + ln, y0 - ln); c.lineTo(x0 - ln, y0 + ln); c.stroke(); }
        else { [-1, 1].forEach(sg => { const x = sg * d * 0.8; c.beginPath(); c.moveTo(x - sg * ln, y * (1 - 0.3 * sep) - ln); c.lineTo(x + sg * ln * 0.2, y * (1 - 0.3 * sep)); c.lineTo(x - sg * ln, y * (1 - 0.3 * sep) + ln); c.stroke(); }); }
      }
    }
  }

  function aVirus(c, R, lt, pal) {
    const rr = R * 0.55, n = 20, rot = lt * 0.5;
    c.lineCap = "round"; c.shadowColor = "#ff7a1a"; c.shadowBlur = R * 0.25;
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * TAU, len = R * 0.32 * (1 + 0.06 * sin(lt * 3 + i * 1.7)), x0 = cos(a) * rr, y0 = sin(a) * rr, x1 = cos(a) * (rr + len), y1 = sin(a) * (rr + len);
      c.strokeStyle = "#ffb347"; c.lineWidth = R * 0.05; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
      const g = c.createRadialGradient(x1 - R * 0.02, y1 - R * 0.02, 0, x1, y1, R * 0.08); g.addColorStop(0, "#fff0c0"); g.addColorStop(1, "#ff7a1a"); c.fillStyle = g; c.beginPath(); c.arc(x1, y1, R * 0.075, 0, TAU); c.fill();
    }
    const g = c.createRadialGradient(-rr * 0.35, -rr * 0.35, rr * 0.1, 0, 0, rr); g.addColorStop(0, "#ff8da6"); g.addColorStop(0.55, "#d9365a"); g.addColorStop(1, "#6d0a26"); c.fillStyle = g; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.fill(); c.shadowBlur = 0;
    c.fillStyle = "rgba(60,0,20,.35)"; for (let k = 0; k < 7; k++) { const a = rnd(k) * TAU + rot * 0.3, d = rr * 0.6 * Math.sqrt(rnd(k + 9)); c.beginPath(); c.arc(cos(a) * d, sin(a) * d, rr * (0.07 + 0.06 * rnd(k + 4)), 0, TAU); c.fill(); }
    c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.ellipse(-rr * 0.4, -rr * 0.45, rr * 0.22, rr * 0.11, -0.7, 0, TAU); c.fill();
  }

  function aLungs(c, R, lt) {
    const br = 0.5 - 0.5 * cos(lt * TAU / 5), sc = 0.9 + 0.12 * br, flow = sin(lt * TAU / 5);
    c.lineCap = "round"; c.lineJoin = "round";
    const lobe = () => {
      c.beginPath(); c.moveTo(-0.12 * R, -0.35 * R);
      c.bezierCurveTo(-0.3 * R, -0.55 * R, -0.95 * R * sc, -0.3 * R, -0.95 * R * sc, 0.35 * R);
      c.bezierCurveTo(-0.95 * R * sc, 0.85 * R * sc, -0.4 * R, 0.9 * R * sc, -0.12 * R, 0.65 * R);
      c.bezierCurveTo(-0.05 * R, 0.2 * R, -0.05 * R, -0.1 * R, -0.12 * R, -0.35 * R); c.closePath();
    };
    const branch = (x, y, a, l, dpt) => { if (dpt > 3) return; const x2 = x + cos(a) * l, y2 = y + sin(a) * l; c.lineWidth = R * 0.03 / (dpt + 1); c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke(); branch(x2, y2, a - 0.5, l * 0.68, dpt + 1); branch(x2, y2, a + 0.5, l * 0.68, dpt + 1); };
    [-1, 1].forEach(sg => {
      c.save(); c.scale(sg, 1);
      const g = c.createLinearGradient(-R, -R * 0.5, 0, R); g.addColorStop(0, "#ffb0c0"); g.addColorStop(1, "#e0506e"); c.fillStyle = g; lobe(); c.fill();
      c.strokeStyle = "#b8304f"; c.lineWidth = R * 0.03; lobe(); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.45)"; branch(-0.14 * R, -0.2 * R, 2.5, R * 0.34, 0); branch(-0.14 * R, -0.05 * R, 2.2, R * 0.3, 1);
      c.restore();
    });
    c.strokeStyle = "#f5c0c8"; c.lineWidth = R * 0.14; c.beginPath(); c.moveTo(0, -R * 1.05); c.lineTo(0, -R * 0.25); c.stroke();
    c.lineWidth = R * 0.07; c.beginPath(); c.moveTo(0, -R * 0.25); c.lineTo(-R * 0.22, -R * 0.05); c.moveTo(0, -R * 0.25); c.lineTo(R * 0.22, -R * 0.05); c.stroke();
    for (let i = 0; i < 6; i++) { const u = (lt * 0.5 * (flow >= 0 ? 1 : -1) + i / 6) % 1, uu = u < 0 ? u + 1 : u; c.fillStyle = rgba("#9fe9ff", 0.8); c.beginPath(); c.arc(0, -R * 1.05 + uu * R * 0.8, R * 0.025, 0, TAU); c.fill(); }
  }

  function capShape(c, L, r) { c.beginPath(); c.moveTo(-L / 2 + r, -r); c.lineTo(L / 2 - r, -r); c.arc(L / 2 - r, 0, r, -PI / 2, PI / 2); c.lineTo(-L / 2 + r, r); c.arc(-L / 2 + r, 0, r, PI / 2, PI * 1.5); c.closePath(); }
  function capDraw(c, L, r, a, b) {
    c.save(); capShape(c, L, r); c.clip();
    [[-L / 2, 0, a], [0, L / 2, b]].forEach(([x0, x1, col]) => { const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, mixc(col, "#ffffff", 0.45)); g.addColorStop(0.5, col); g.addColorStop(1, mixc(col, "#000000", 0.35)); c.fillStyle = g; c.fillRect(x0, -r, x1 - x0, r * 2); });
    c.fillStyle = "rgba(255,255,255,.45)"; c.fillRect(-L / 2 + r * 0.4, -r * 0.7, L - r * 0.8, r * 0.22); c.restore();
    c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = r * 0.06; capShape(c, L, r); c.stroke();
    c.strokeStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.moveTo(0, -r); c.lineTo(0, r); c.stroke();
  }
  function aCaps(c, R, lt) {
    const cols = ["#ff3b57", "#2f8bff", "#ffc933", "#19d3c5", "#ff7a1a"], floor = R * 0.95;
    c.fillStyle = "rgba(255,255,255,.12)"; c.fillRect(-R * 1.3, floor + R * 0.18, R * 2.6, R * 0.03);
    for (let i = 0; i < 5; i++) {
      const u = ((lt + i * 0.5) % 2.4) / 2.4, x = (i - 2) * R * 0.42, top = -R * 1.5, L = R * 0.5, r = R * 0.15, land = 0.45;
      let y, rot = i * 0.7, sq = 1;
      if (u < land) { const f = u / land; y = top + (floor - top) * f * f; rot = i * 0.7 + f * PI * 1.5; }
      else { const f = (u - land) / (1 - land); y = floor - R * 0.55 * Math.abs(sin(f * PI)) * (1 - f * 0.75); rot = i * 0.7 + PI * 1.5 + sin(f * 9) * 0.25 * (1 - f); sq = 1 - 0.16 * gauss(u, land, 0.02); }
      c.fillStyle = "rgba(0,0,0,.28)"; c.beginPath(); c.ellipse(x, floor + R * 0.2, r * (1.2 - 0.5 * Math.min(1, (floor - y) / R)), r * 0.25, 0, 0, TAU); c.fill();
      c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, sq); capDraw(c, L, r, cols[i], "#f4f7fa"); c.restore();
    }
  }

  function dropPath(c, s) { c.beginPath(); c.moveTo(0, -1.2 * s); c.bezierCurveTo(0.15 * s, -0.7 * s, 0.9 * s, -0.1 * s, 0.9 * s, 0.4 * s); c.bezierCurveTo(0.9 * s, 0.95 * s, 0.5 * s, 1.2 * s, 0, 1.2 * s); c.bezierCurveTo(-0.5 * s, 1.2 * s, -0.9 * s, 0.95 * s, -0.9 * s, 0.4 * s); c.bezierCurveTo(-0.9 * s, -0.1 * s, -0.15 * s, -0.7 * s, 0, -1.2 * s); c.closePath(); }
  function aDrop(c, R, lt) {
    const per = 3.4, u = (lt % per) / per, floor = R * 0.85, top = -R * 1.05;
    const pool = c.createLinearGradient(0, floor - R * 0.15, 0, floor + R * 0.2); pool.addColorStop(0, "#ff5c7a"); pool.addColorStop(1, "#8a0f2a");
    c.fillStyle = pool; c.beginPath(); c.ellipse(0, floor + R * 0.05, R * (0.85 + 0.03 * sin(lt * 3)), R * 0.16, 0, 0, TAU); c.fill();
    if (u > 0.62) { const f = (u - 0.62) / 0.38; for (let k = 0; k < 3; k++) { const a = Math.max(0, f - k * 0.12); if (a > 0) { c.strokeStyle = rgba("#ff8fa3", (1 - a) * 0.8); c.lineWidth = R * 0.03; c.beginPath(); c.ellipse(0, floor + R * 0.05, R * (0.15 + a * 1.0), R * (0.04 + a * 0.2), 0, 0, TAU); c.stroke(); } }
      for (let k = 0; k < 5; k++) { const a = -PI * 0.15 - k * PI * 0.14, v = R * (0.9 + 0.2 * k % 0.5), x = cos(a) * v * f * (k % 2 ? 1 : -1), y = floor + sin(a) * v * f + R * 1.6 * f * f; c.fillStyle = rgba("#ff3b57", 1 - f); c.beginPath(); c.arc(x, y, R * 0.04, 0, TAU); c.fill(); } }
    let y, s, st = 1;
    if (u < 0.35) { const f = u / 0.35; s = R * (0.25 + 0.4 * f); y = top; st = 1 + 0.35 * f; }
    else if (u < 0.62) { const f = (u - 0.35) / 0.27; s = R * 0.6; y = top + (floor - R * 0.2 - top) * f * f; st = 1.1 + 0.25 * f; }
    else return;
    c.save(); c.translate(0, y + s * 0.2); c.scale(1, st); c.shadowColor = RED; c.shadowBlur = R * 0.2;
    const g = c.createRadialGradient(-s * 0.3, -s * 0.1, s * 0.1, 0, s * 0.3, s * 1.3); g.addColorStop(0, "#ff7d93"); g.addColorStop(0.5, "#ee2f52"); g.addColorStop(1, "#8a0f2a"); c.fillStyle = g; dropPath(c, s); c.fill(); c.shadowBlur = 0;
    c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(-s * 0.35, s * 0.2, s * 0.12, s * 0.28, 0.25, 0, TAU); c.fill(); c.restore();
  }

  function aBrain(c, R, lt, pal) {
    const col = pal[1], hemi = sg => {
      c.beginPath(); for (let k = 0; k <= 80; k++) { const a = k / 80 * TAU, rr = 1 + 0.05 * sin(7 * a + sg) + 0.035 * sin(13 * a), x = sg * R * 0.52 + cos(a) * R * 0.5 * rr * (cos(a) * sg > 0 ? 1 : 0.8), y = sin(a) * R * 0.85 * rr; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath();
    };
    c.lineJoin = "round"; c.lineCap = "round"; c.shadowColor = rgba(col, 0.6); c.shadowBlur = R * 0.25;
    [-1, 1].forEach(sg => { const g = c.createRadialGradient(sg * R * 0.4, -R * 0.3, R * 0.1, sg * R * 0.5, 0, R); g.addColorStop(0, "#ffd0da"); g.addColorStop(1, "#e0708a"); c.fillStyle = g; hemi(sg); c.fill(); }); c.shadowBlur = 0;
    [-1, 1].forEach(sg => { c.strokeStyle = "#b84a66"; c.lineWidth = R * 0.025; hemi(sg); c.stroke(); });
    const fold = (sg, k) => v => ({ x: sg * R * 0.52 + sg * (k - 2.5) * R * 0.1 + sin(v * 9 + k * 1.3) * R * 0.07, y: -R * 0.72 + R * 1.44 * v });
    for (let sg of [-1, 1]) for (let k = 0; k < 6; k++) { const f = fold(sg, k); c.strokeStyle = "rgba(150,40,70,.5)"; c.lineWidth = R * 0.022; c.beginPath(); for (let i = 0; i <= 40; i++) { const p = f(i / 40); i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); } c.stroke(); }
    for (let sg of [-1, 1]) for (let k = 0; k < 6; k++) {
      const f = fold(sg, k);
      for (let j = 0; j < 2; j++) { const s = (lt * 0.45 + k * 0.17 + j * 0.5 + (sg > 0 ? 0.3 : 0)) % 1, p = f(s), g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, R * 0.09); g.addColorStop(0, "#ffffff"); g.addColorStop(0.3, rgba(col, 0.9)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, R * 0.09, 0, TAU); c.fill(); }
    }
    c.strokeStyle = "rgba(120,30,60,.7)"; c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(0, -R * 0.85); c.lineTo(0, R * 0.85); c.stroke();
  }

  function aImmune(c, R, lt, pal) {
    const s = R * 0.55; let hit = 0;
    const spikyVirus = (x, y, r, rot) => { c.strokeStyle = "#ffb347"; c.lineWidth = r * 0.28; c.lineCap = "round"; for (let k = 0; k < 8; k++) { const a = rot + k * TAU / 8; c.beginPath(); c.moveTo(x + cos(a) * r, y + sin(a) * r); c.lineTo(x + cos(a) * r * 1.6, y + sin(a) * r * 1.6); c.stroke(); } c.fillStyle = "#d9365a"; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
    for (let i = 0; i < 6; i++) {
      const per = 2.6, tt = lt + i * 0.43, cyc = Math.floor(tt / per), u = (tt % per) / per, a = rnd(i * 13 + cyc) * TAU;
      if (u < 0.8) { const f = u / 0.8, r = R * (1.6 - 0.82 * f * f); spikyVirus(cos(a) * r, sin(a) * r, R * 0.07, lt * 2 + i); }
      else { const f = (u - 0.8) / 0.2, r = R * 0.8; c.strokeStyle = rgba("#ffb347", 1 - f); c.lineWidth = R * 0.03; c.beginPath(); c.arc(cos(a) * r, sin(a) * r, R * (0.05 + 0.25 * f), 0, TAU); c.stroke(); for (let k = 0; k < 6; k++) { const b = k * TAU / 6 + a; c.beginPath(); c.moveTo(cos(a) * r + cos(b) * R * 0.1 * f, sin(a) * r + sin(b) * R * 0.1 * f); c.lineTo(cos(a) * r + cos(b) * R * (0.1 + 0.3 * f), sin(a) * r + sin(b) * R * (0.1 + 0.3 * f)); c.stroke(); } }
      hit = Math.max(hit, gauss(u, 0.82, 0.05));
    }
    c.save(); c.shadowColor = TEAL; c.shadowBlur = R * (0.2 + 0.5 * hit);
    const g = c.createLinearGradient(0, -s, 0, s * 1.2); g.addColorStop(0, "#5ef2e1"); g.addColorStop(1, "#1a7fb5"); c.fillStyle = g;
    c.beginPath(); c.moveTo(0, -s); c.bezierCurveTo(s * 0.4, -s * 0.8, s * 0.75, -s * 0.75, s * 0.95, -s * 0.8); c.lineTo(s * 0.95, s * 0.05); c.bezierCurveTo(s * 0.95, s * 0.6, s * 0.5, s * 0.95, 0, s * 1.15); c.bezierCurveTo(-s * 0.5, s * 0.95, -s * 0.95, s * 0.6, -s * 0.95, s * 0.05); c.lineTo(-s * 0.95, -s * 0.8); c.bezierCurveTo(-s * 0.75, -s * 0.75, -s * 0.4, -s * 0.8, 0, -s); c.closePath(); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = s * 0.07; c.stroke();
    c.fillStyle = "#fff"; c.fillRect(-s * 0.12, -s * 0.5, s * 0.24, s * 0.8); c.fillRect(-s * 0.4, -s * 0.22, s * 0.8, s * 0.24); c.restore();
  }

  /* ==========================================================
     3. ИКОНКИ (10): контурные пути в сетке 24×24
     ========================================================== */
  const ICONS = {
    syringe: ["Шприц", "m18 2 4 4 m17 7 3-3 M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5 m9 11 4 4 m5 19-3 3 m14 4 6 6"],
    pill: ["Таблетка", "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z m8.5 8.5 7 7"],
    dna: ["ДНК", "m10 16 1.5 1.5 m14 8-1.5-1.5 M15 2c-1.8 2-2.5 4-2.8 6 m16.5 10.5 1 1 m17 6-2.9-2.9 M2 15c6.7-6 13.3 0 20-6 m20 9 .9.9 M3.1 14.1 4 15 m6.5 12.5 1 1 m7 18 2.9 2.9 M9 22c1.8-2 2.5-4 2.8-6"],
    stethoscope: ["Стетоскоп", "M11 2v2 M5 2v2 M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1 M8 15a6 6 0 0 0 12 0v-3 M20 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
    medkit: ["Аптечка", "M12 11v4 M14 13h-4 M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2 M18 6v14 M6 6v14 M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"],
    thermometer: ["Термометр", "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"],
    microscope: ["Микроскоп", "M6 18h8 M3 22h18 M14 22a7 7 0 1 0 0-14h-1 M9 14h2 M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"],
    heartpulse: ["Пульс сердца", "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"],
    tooth: ["Зуб", "M12 5.5C10.5 4.3 8.8 3.7 7.2 4 4.7 4.5 3.5 6.5 4 9c.4 2 1 3 1.4 5 .4 2 .7 5 2 5.5 1.5.5 1.8-3 2.6-4.5.5-1 1.2-1.5 2-1.5s1.5.5 2 1.5c.8 1.5 1.1 5 2.6 4.5 1.3-.5 1.6-3.5 2-5.5.4-2 1-3 1.4-5 .5-2.5-.7-4.5-3.2-5-1.6-.3-3.3.3-4.8 1.5z"],
    flask: ["Колба", "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2 M8.5 2h7 M7 16h10"]
  };

  /* ==========================================================
     4. 3D-МОДЕЛИ (10), Three.js r128, без внешних файлов
     ========================================================== */
  const MCC = {};
  function mcap(base, o) {
    const key = base + JSON.stringify(o || {}); if (MCC[key]) return MCC[key];
    o = o || {};
    const cv = document.createElement("canvas"); cv.width = cv.height = 256; const x = cv.getContext("2d"), dark = o.dark || "#000000", hi = o.hi || "#ffffff";
    const g = x.createRadialGradient(110, 95, 8, 128, 128, 150); g.addColorStop(0, mixc(base, hi, 0.45)); g.addColorStop(0.3, base); g.addColorStop(0.75, mixc(base, dark, 0.5)); g.addColorStop(1, mixc(base, dark, 0.78));
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const r = x.createRadialGradient(205, 205, 5, 205, 205, 95); r.addColorStop(0, rgba(mixc(base, "#ffffff", 0.6), 0.35)); r.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = r; x.fillRect(0, 0, 256, 256);
    const sp = o.gloss == null ? 0.85 : o.gloss, s = x.createRadialGradient(88, 72, 0, 88, 72, 42); s.addColorStop(0, "rgba(255,255,255," + sp + ")"); s.addColorStop(0.45, "rgba(255,255,255," + sp * 0.22 + ")"); s.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = s; x.fillRect(0, 0, 256, 256);
    return (MCC[key] = new THREE.CanvasTexture(cv));
  }
  const MC = (base, o, mo) => new THREE.MeshMatcapMaterial(Object.assign({ matcap: mcap(base, o) }, mo || {}));

  function rig(pal) {
    const T = THREE, sc = new T.Scene(), root = new T.Group(), pv = new T.Group(), model = new T.Group();
    sc.add(root); root.add(pv); pv.add(model); sc.add(new T.AmbientLight(0xffffff, 0.9));
    const k = new T.DirectionalLight(0xffffff, 0.8); k.position.set(3, 4, 5); sc.add(k);
    const p = new T.PointLight(new T.Color(pal[1]), 1.4, 30); p.position.set(-4, -1, 3); sc.add(p);
    return { T, sc, root, pv, model, fit(target) { const b = new T.Box3().setFromObject(model), s = b.getSize(new T.Vector3()), cc = b.getCenter(new T.Vector3()); model.position.sub(cc); root.scale.setScalar(target / Math.max(s.x, s.y, s.z)); } };
  }
  const lathe = (pts, seg) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg || 48);
  function capsuleMesh(r, len, a, b, mo) {
    const T = THREE, g = new T.Group(), cl = len / 2, pts = [];
    for (let i = 0; i <= 14; i++) { const t = i / 14 * PI / 2; pts.push([sin(t) * r, cl + cos(t) * r]); }
    pts.push([r, 0]);
    const geo = lathe(pts, 40), A = new T.Mesh(geo, MC(a, { gloss: 0.95 }, mo)), B = new T.Mesh(geo, MC(b, { gloss: 0.95 }, mo)); B.scale.y = -1;
    const ring = new T.Mesh(new T.TorusGeometry(r + 0.006, 0.014, 8, 40), MC("#3a3f48", { gloss: 0.3 })); ring.rotation.x = PI / 2; g.add(A, B, ring); return g;
  }
  function roundedRect(w, h, r) { const T = THREE, s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function crossShape(a, t) { const T = THREE, s = new T.Shape(), h = t / 2; s.moveTo(-h, -a); s.lineTo(h, -a); s.lineTo(h, -h); s.lineTo(a, -h); s.lineTo(a, h); s.lineTo(h, h); s.lineTo(h, a); s.lineTo(-h, a); s.lineTo(-h, h); s.lineTo(-a, h); s.lineTo(-a, -h); s.lineTo(-h, -h); s.closePath(); return s; }
  function bar(a, b, r, mat) { const T = THREE, d = new T.Vector3().subVectors(b, a), len = d.length(), m = new T.Mesh(new T.CylinderGeometry(r, r, len, 12), mat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); return m; }
  const tubeOf = (pts, r, mat, seg) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2]))), seg || 48, r, 14, false), mat);

  const M3 = {};
  M3.h3_heart = pal => {
    const R = rig(pal), T = R.T, sh = new T.Shape();
    sh.moveTo(0, -1.1); sh.bezierCurveTo(-0.2, -0.9, -1.6, -0.2, -1.5, 0.6); sh.bezierCurveTo(-1.45, 1.3, -0.5, 1.5, 0, 0.8); sh.bezierCurveTo(0.5, 1.5, 1.45, 1.3, 1.5, 0.6); sh.bezierCurveTo(1.6, -0.2, 0.2, -0.9, 0, -1.1);
    const ge = new T.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.42, bevelSegments: 14, curveSegments: 48 }); ge.center();
    R.model.add(new T.Mesh(ge, MC("#e0223f", { gloss: 0.95, hi: "#ffb0bf", dark: "#3a0010" })));
    R.model.add(tubeOf([[0.15, 0.9, 0], [0.2, 1.5, 0.05], [0.65, 2.0, 0.05], [1.2, 1.9, 0]], 0.27, MC("#e8506a", { gloss: 0.8 })));
    R.model.add(tubeOf([[-0.3, 0.95, 0.1], [-0.35, 1.6, 0.1], [-0.8, 2.05, 0.1]], 0.2, MC("#3a8dff", { gloss: 0.8 })));
    R.model.add(tubeOf([[-0.05, 1.0, -0.2], [-0.1, 1.6, -0.25], [0.3, 2.1, -0.25]], 0.18, MC("#5aa8ff", { gloss: 0.8 })));
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.pv.scale.setScalar(1 + 0.07 * beat(lt)); R.root.rotation.y = sin(lt * 0.7) * 0.7; R.root.rotation.x = 0.12; } };
  };

  M3.h3_dna = pal => {
    const R = rig(pal), T = R.T, N = 28, H = 4.4, Rad = 0.85, turns = 2.3, pa = [], pb = [];
    for (let i = 0; i <= N * 3; i++) { const u = i / (N * 3), a = u * TAU * turns, y = (u - 0.5) * H; pa.push(new T.Vector3(cos(a) * Rad, y, sin(a) * Rad)); pb.push(new T.Vector3(-cos(a) * Rad, y, -sin(a) * Rad)); }
    const m1 = MC(pal[1], { gloss: 0.9 }), m2 = MC("#ff5c8a", { gloss: 0.9 });
    R.model.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pa), 240, 0.1, 14, false), m1));
    R.model.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pb), 240, 0.1, 14, false), m2));
    const pm = [["#ffd166", "#4cc9f0"], ["#7bf1a8", "#ff7a7a"]].map(p => p.map(c => MC(c, { gloss: 0.8 }))), sph = new T.SphereGeometry(0.15, 18, 14);
    for (let i = 0; i < N; i++) {
      const u = (i + 0.5) / N, a = u * TAU * turns, y = (u - 0.5) * H, A = new T.Vector3(cos(a) * Rad, y, sin(a) * Rad), B = new T.Vector3(-A.x, y, -A.z), Mid = new T.Vector3(0, y, 0), pr = pm[i % 2];
      R.model.add(bar(A, Mid, 0.055, pr[0]), bar(Mid, B, 0.055, pr[1]));
      [A, B].forEach((p, k) => { const s = new T.Mesh(sph, k ? m2 : m1); s.position.copy(p); R.model.add(s); });
    }
    R.fit(3.5);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.9; R.root.rotation.z = 0.28; } };
  };

  M3.h3_syringe = pal => {
    const R = rig(pal), T = R.T, g = R.model;
    const glass = MC("#bfe8ff", { gloss: 0.9, dark: "#2a5a7a" }, { transparent: true, opacity: 0.34, side: T.DoubleSide, depthWrite: false });
    const steel = MC("#c9d3dc", { gloss: 1, dark: "#26303a" }), dark = MC("#1b2430", { gloss: 0.5 }), rubber = MC("#2b3340", { gloss: 0.4 }), plastic = MC("#f2f6fa", { gloss: 0.85 });
    const liqMat = new T.MeshStandardMaterial({ color: new T.Color("#ff3b57"), emissive: new T.Color("#ff3b57"), emissiveIntensity: 0.35, roughness: 0.25, transparent: true, opacity: 0.92 });
    const liq = new T.Mesh(new T.CylinderGeometry(0.37, 0.37, 1, 40), liqMat); g.add(liq);
    const barrel = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 2.6, 48, 1, true), glass); barrel.renderOrder = 3; g.add(barrel);
    const fl = new T.Mesh(new T.CylinderGeometry(0.78, 0.78, 0.1, 48), plastic); fl.scale.z = 0.38; fl.position.y = 1.3; g.add(fl);
    const ring = new T.Mesh(new T.TorusGeometry(0.43, 0.04, 12, 48), plastic); ring.rotation.x = PI / 2; ring.position.y = 1.28; g.add(ring);
    const cone = new T.Mesh(new T.CylinderGeometry(0.14, 0.42, 0.4, 32), glass); cone.position.y = -1.5; cone.renderOrder = 3; g.add(cone);
    const hub = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.3, 32), plastic); hub.position.y = -1.85; g.add(hub);
    const needle = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 1.7, 16), steel); needle.position.y = -2.85; g.add(needle);
    const tipn = new T.Mesh(new T.ConeGeometry(0.045, 0.3, 16), steel); tipn.position.y = -3.85; tipn.rotation.x = PI; g.add(tipn);
    for (let i = 0; i < 9; i++) { const m = new T.Mesh(new T.BoxGeometry(i % 2 ? 0.14 : 0.26, 0.014, 0.01), dark); m.position.set(0, -1.0 + i * 0.25, 0.426); g.add(m); }
    const pl = new T.Group(); g.add(pl);
    pl.add(new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.22, 40), rubber));
    const r1 = new T.Mesh(new T.BoxGeometry(0.7, 2.4, 0.09), plastic), r2 = new T.Mesh(new T.BoxGeometry(0.09, 2.4, 0.7), plastic); r1.position.y = r2.position.y = 1.3; pl.add(r1, r2);
    const th = new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 0.1, 40), plastic); th.position.y = 2.55; pl.add(th);
    const setP = sY => { pl.position.y = sY; const hh = Math.max(0.02, sY + 1.3 - 0.11); liq.scale.y = hh; liq.position.y = -1.3 + hh / 2; };
    setP(-0.2); R.fit(3.7);
    return { sc: R.sc, up: lt => { setP(-1.0 + 1.9 * (0.5 - 0.5 * cos(lt * 1.1))); R.root.rotation.z = -0.65; R.root.rotation.y = sin(lt * 0.7) * 0.6; } };
  };

  M3.h3_pills = pal => {
    const R = rig(pal), T = R.T;
    const c1 = capsuleMesh(0.52, 1.9, "#ff3b57", "#f4f7fa"); c1.rotation.z = 0.7; R.model.add(c1);
    const c2 = capsuleMesh(0.3, 1.1, "#2f8bff", "#ffd23f"); c2.position.set(-1.7, 1.4, -0.2); c2.rotation.z = -0.5; R.model.add(c2);
    const tab = new T.Group(); const prof = [[0, 0.14], [0.55, 0.14], [0.66, 0.11], [0.7, 0.06], [0.7, -0.06], [0.66, -0.11], [0.55, -0.14], [0, -0.14]];
    tab.add(new T.Mesh(lathe(prof, 56), MC("#f4f7fa", { gloss: 0.9 }))); const sc = new T.Mesh(new T.BoxGeometry(1.2, 0.03, 0.05), MC("#aab4be", { gloss: 0.2 })); sc.position.y = 0.14; tab.add(sc);
    tab.position.set(1.6, -1.3, 0.5); tab.rotation.x = 0.9; R.model.add(tab);
    const c3 = capsuleMesh(0.22, 0.7, "#19d3c5", "#f4f7fa"); c3.position.set(-1.3, -1.5, 0.4); c3.rotation.z = 1.0; R.model.add(c3);
    R.fit(3.9);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.5; R.root.rotation.x = 0.25; c1.rotation.y = lt * 0.8; c2.rotation.y = -lt * 1.1; tab.rotation.z = lt * 0.9; c3.rotation.x = lt * 1.2; R.pv.position.y = sin(lt * 1.6) * 0.06; } };
  };

  M3.h3_medkit = pal => {
    const R = rig(pal), T = R.T;
    const body = new T.Mesh(new T.ExtrudeGeometry(roundedRect(3.2, 2.2, 0.3), { depth: 1.1, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 8, curveSegments: 16 }), MC("#e11d3c", { gloss: 0.9, hi: "#ff9aa8", dark: "#3a0010" })); body.geometry.center(); R.model.add(body);
    const seam = new T.Mesh(new T.BoxGeometry(3.5, 0.06, 1.4), MC("#5a0a1a", { gloss: 0.2 })); seam.position.y = 0.3; R.model.add(seam);
    const panel = new T.Mesh(new T.ExtrudeGeometry(roundedRect(1.5, 1.5, 0.22), { depth: 0.05, bevelEnabled: false }), MC("#ffffff", { gloss: 0.8 })); panel.position.set(0, -0.15, 0.68); R.model.add(panel);
    const crs = new T.Mesh(new T.ExtrudeGeometry(crossShape(0.55, 0.34), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }), MC("#e11d3c", { gloss: 0.9 })); crs.position.set(0, -0.15, 0.73); R.model.add(crs);
    const hd = new T.Mesh(new T.TorusGeometry(0.55, 0.08, 16, 40, PI), MC("#2b3340", { gloss: 0.6 })); hd.scale.y = 0.7; hd.position.set(0, 1.22, 0); R.model.add(hd);
    [-0.55, 0.55].forEach(x => { const p = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.16, 16), MC("#2b3340", { gloss: 0.6 })); p.position.set(x, 1.22, 0); R.model.add(p); });
    [-1.1, 1.1].forEach(x => { const l = new T.Mesh(new T.BoxGeometry(0.28, 0.3, 0.12), MC("#d5dde6", { gloss: 1 })); l.position.set(x, 0.3, 0.72); R.model.add(l); });
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.9) * 0.65; R.root.rotation.x = 0.18 + sin(lt * 0.6) * 0.05; R.pv.position.y = sin(lt * 2) * 0.05; } };
  };

  M3.h3_virus = pal => {
    const R = rig(pal), T = R.T;
    R.model.add(new T.Mesh(new T.SphereGeometry(1, 64, 48), MC("#d9365a", { gloss: 0.9, hi: "#ffb0c0", dark: "#3a0014" })));
    const ico = new T.IcosahedronGeometry(1, 2), pos = ico.attributes.position, seen = new Set(), dirs = [];
    for (let i = 0; i < pos.count; i++) { const v = new T.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize(), k = v.x.toFixed(3) + "," + v.y.toFixed(3) + "," + v.z.toFixed(3); if (!seen.has(k)) { seen.add(k); dirs.push(v); } }
    const n = dirs.length, im1 = new T.InstancedMesh(new T.CylinderGeometry(0.04, 0.065, 0.55, 12), MC("#ffb347", { gloss: 0.7 }), n), im2 = new T.InstancedMesh(new T.SphereGeometry(0.11, 16, 12), MC("#ffd27f", { gloss: 0.95 }), n);
    const m = new T.Matrix4(), q = new T.Quaternion(), up = new T.Vector3(0, 1, 0), sc = new T.Vector3(1, 1, 1), p = new T.Vector3();
    dirs.forEach((d, i) => { q.setFromUnitVectors(up, d); p.copy(d).multiplyScalar(1.25); m.compose(p, q, sc); im1.setMatrixAt(i, m); p.copy(d).multiplyScalar(1.55); m.compose(p, q, sc); im2.setMatrixAt(i, m); });
    R.model.add(im1, im2);
    R.model.add(new T.Mesh(new T.SphereGeometry(1.7, 8, 6), new T.MeshBasicMaterial({ visible: false })));
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.5; R.root.rotation.x = 0.3; R.pv.scale.setScalar(1 + 0.03 * sin(lt * 3)); } };
  };

  M3.h3_cell = pal => {
    const R = rig(pal), T = R.T, g = R.model;
    const nuc = new T.Mesh(new T.SphereGeometry(0.62, 48, 32), MC("#8a6bff", { gloss: 0.9 })); g.add(nuc);
    const env = new T.Mesh(new T.SphereGeometry(0.7, 48, 32), MC("#b9a7ff", { gloss: 0.6 }, { transparent: true, opacity: 0.25, depthWrite: false })); env.renderOrder = 2; g.add(env);
    const nl = new T.Mesh(new T.SphereGeometry(0.2, 24, 16), MC("#3a2a9a", { gloss: 0.7 })); nl.position.set(0.2, 0.15, 0.45); g.add(nl);
    const mit = [], up = new T.Vector3(0, 1, 0);
    for (let i = 0; i < 5; i++) { const d = new T.Vector3(rnd(i) - 0.5, rnd(i + 5) - 0.5, rnd(i + 9) - 0.5).normalize(), m = capsuleMesh(0.16, 0.42, "#ff8a3d", "#ff8a3d"); m.position.copy(d).multiplyScalar(1.0); m.quaternion.setFromUnitVectors(up, new T.Vector3(rnd(i + 20) - 0.5, rnd(i + 21) - 0.5, rnd(i + 22) - 0.5).normalize()); g.add(m); mit.push(m); }
    for (let k = 0; k < 4; k++) { const t = new T.Mesh(new T.TorusGeometry(0.38 - 0.04 * k, 0.055, 12, 36), MC("#ff9bd0", { gloss: 0.8 })); t.rotation.x = PI / 2; t.scale.set(1, 1, 0.5); t.position.set(-0.95, -0.35 + 0.15 * k, 0.35); g.add(t); }
    const rb = new T.InstancedMesh(new T.SphereGeometry(0.045, 8, 6), MC("#3aa0ff", { gloss: 0.8 }), 46), mm = new T.Matrix4();
    for (let i = 0; i < 46; i++) { const d = new T.Vector3(rnd(i + 40) - 0.5, rnd(i + 41) - 0.5, rnd(i + 42) - 0.5).normalize().multiplyScalar(0.9 + 0.35 * rnd(i + 43)); mm.makeTranslation(d.x, d.y, d.z); rb.setMatrixAt(i, mm); }
    g.add(rb);
    const er = new T.Mesh(new T.TorusKnotGeometry(0.85, 0.035, 160, 8, 3, 5), MC("#ffd166", { gloss: 0.7 })); g.add(er);
    const mem = new T.Mesh(new T.SphereGeometry(1.6, 64, 48), MC("#7ef0dc", { gloss: 0.9, dark: "#0a5f66" }, { transparent: true, opacity: 0.24, depthWrite: false, side: T.DoubleSide })); mem.renderOrder = 5; g.add(mem);
    R.fit(3.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.4; R.root.rotation.x = 0.25; mit.forEach((m, i) => { m.rotation.x = sin(lt * 1.3 + i) * 0.4; }); er.rotation.y = lt * 0.3; nuc.scale.setScalar(1 + 0.02 * sin(lt * 2)); } };
  };

  function brainMesh(freq, sx, sy, sz, sign, base, groove, flat) {
    const T = THREE, g = new T.SphereGeometry(1, 128, 96), pos = g.attributes.position, col = new Float32Array(pos.count * 3), cb = new T.Color(base), cg = new T.Color(groove);
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i), ny = pos.getY(i), nz = pos.getZ(i);
      const f = sin(nx * 6.1 * freq + sin(ny * 4.2 * freq + nz * 2)) * sin(ny * 5.3 * freq + sin(nz * 4.5 * freq + nx * 2)) * sin(nz * 5.7 * freq + sin(nx * 3.8 * freq + ny * 2.5)), ridge = 1 - Math.abs(f), disp = 1 + 0.075 * Math.pow(ridge, 0.8) - 0.02;
      let x = nx * disp * sx, y = ny * disp * sy, z = nz * disp * sz;
      if (flat && x * sign < 0) x *= 0.25;
      pos.setXYZ(i, x, y, z); const k = Math.pow(ridge, 1.2); col[i * 3] = cg.r + (cb.r - cg.r) * k; col[i * 3 + 1] = cg.g + (cb.g - cg.g) * k; col[i * 3 + 2] = cg.b + (cb.b - cg.b) * k;
    }
    g.setAttribute("color", new T.BufferAttribute(col, 3)); g.computeVertexNormals();
    return new T.Mesh(g, MC("#f2f2f2", { gloss: 0.5 }, { vertexColors: true }));
  }
  M3.h3_brain = pal => {
    const R = rig(pal), T = R.T;
    [-1, 1].forEach(sg => { const h = brainMesh(1, 0.64, 0.82, 1.1, sg, "#f3a0b4", "#b04a68", true); h.position.x = sg * 0.66; R.model.add(h); });
    const cb = brainMesh(2.3, 0.62, 0.38, 0.5, 1, "#e58aa2", "#a8405e", false); cb.position.set(0, -0.62, -0.95); R.model.add(cb);
    const st = new T.Mesh(new T.CylinderGeometry(0.17, 0.12, 0.9, 24), MC("#e8a1b0", { gloss: 0.5 })); st.position.set(0, -0.95, -0.4); st.rotation.x = -0.25; R.model.add(st);
    R.fit(3.5);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.9 + sin(lt * 0.5) * 0.55; R.root.rotation.x = 0.35; R.pv.position.y = sin(lt * 1.4) * 0.04; } };
  };

  M3.h3_steth = pal => {
    const R = rig(pal), T = R.T, metal = MC("#d5dde6", { gloss: 1, dark: "#222c36" }), black = MC("#18202b", { gloss: 0.5 });
    const chest = new T.Group(), disc = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.22, 56), metal), rim = new T.Mesh(new T.TorusGeometry(0.62, 0.05, 16, 56), metal), dia = new T.Mesh(new T.CylinderGeometry(0.54, 0.54, 0.06, 56), MC("#1c2430", { gloss: 0.4 }));
    rim.rotation.x = PI / 2; rim.position.y = 0.11; dia.position.y = 0.12; chest.add(disc, rim, dia); chest.rotation.x = PI / 2; chest.position.set(0, -1.8, 0); R.model.add(chest);
    const stem = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.34, 24), metal); stem.position.set(0, -1.0, 0); R.model.add(stem);
    R.model.add(tubeOf([[0, -0.85, 0], [0.15, -0.3, 0], [-0.1, 0.3, 0], [0, 0.85, 0]], 0.075, black, 60));
    const yj = new T.Mesh(new T.SphereGeometry(0.14, 20, 16), metal); yj.position.set(0, 1.0, 0); R.model.add(yj);
    [-1, 1].forEach(sg => {
      R.model.add(tubeOf([[0, 1.0, 0], [sg * 0.25, 1.35, 0], [sg * 0.85, 1.65, 0], [sg * 1.1, 2.25, 0], [sg * 0.75, 2.8, 0]], 0.055, metal, 60));
      const tip = new T.Mesh(new T.SphereGeometry(0.14, 18, 14), black); tip.position.set(sg * 0.7, 2.85, 0); R.model.add(tip);
    });
    R.fit(3.8);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.8) * 0.7; R.root.rotation.z = sin(lt * 1.4) * 0.06; } };
  };

  M3.h3_bottle = pal => {
    const R = rig(pal), T = R.T, g = R.model, pills = [];
    const glassPts = [[0, 0], [0.84, 0], [0.95, 0.07], [1, 0.22], [1, 1.9], [0.96, 2.05], [0.7, 2.3], [0.52, 2.5], [0.52, 2.75]];
    for (let i = 0; i < 7; i++) { const t = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.08, 24), MC(i % 2 ? "#f4f7fa" : "#ffe9a8", { gloss: 0.9 })); t.position.set((rnd(i) - 0.5) * 1.1, 0.25 + rnd(i + 4) * 0.7, (rnd(i + 8) - 0.5) * 1.1); t.rotation.set(rnd(i + 2) * 3, rnd(i + 3) * 3, 0); g.add(t); pills.push(t); }
    for (let i = 0; i < 3; i++) { const c = capsuleMesh(0.12, 0.3, "#ff3b57", "#f4f7fa"); c.position.set((rnd(i + 30) - 0.5) * 1.0, 0.3 + rnd(i + 31) * 0.5, (rnd(i + 32) - 0.5) * 1.0); c.rotation.set(rnd(i + 33) * 3, rnd(i + 34) * 3, 1); g.add(c); pills.push(c); }
    const glass = new T.Mesh(lathe(glassPts, 64), MC("#d98322", { gloss: 0.95, hi: "#ffd29a", dark: "#3a1a00" }, { transparent: true, opacity: 0.72, side: T.DoubleSide, depthWrite: false })); glass.renderOrder = 3; g.add(glass);
    const nr = new T.Mesh(new T.TorusGeometry(0.53, 0.05, 12, 40), MC("#c47315", { gloss: 0.8 })); nr.rotation.x = PI / 2; nr.position.y = 2.75; g.add(nr);
    const cap = new T.Mesh(new T.CylinderGeometry(0.63, 0.63, 0.62, 36, 1), MC("#f4f7fa", { gloss: 0.7 }, { flatShading: true })); cap.position.y = 2.98; g.add(cap);
    const top = new T.Mesh(new T.CylinderGeometry(0.58, 0.58, 0.04, 48), MC("#f4f7fa", { gloss: 0.9 })); top.position.y = 3.3; g.add(top);
    const label = new T.Mesh(new T.CylinderGeometry(1.012, 1.012, 1.1, 64, 1, true, -0.95, 1.9), MC("#ffffff", { gloss: 0.5 }, { side: T.DoubleSide })); label.position.y = 1.0; label.renderOrder = 4; g.add(label);
    const cx = new T.Mesh(new T.ExtrudeGeometry(crossShape(0.2, 0.11), { depth: 0.02, bevelEnabled: false }), MC("#e11d3c", { gloss: 0.8 })); cx.position.set(0, 1.18, 1.025); cx.renderOrder = 5; g.add(cx);
    [0.78, 0.68, 0.58].forEach((y, i) => { const l = new T.Mesh(new T.BoxGeometry(0.62 - i * 0.14, 0.035, 0.012), MC("#9aa6b2", { gloss: 0.2 })); l.position.set(0, y, 1.02); l.renderOrder = 5; g.add(l); });
    R.fit(3.6);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.7) * 0.8; R.root.rotation.x = 0.1; pills.forEach((p, i) => { p.rotation.x += 0.004 * (i % 3 + 1); }); } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ В ОСНОВНОЙ СТРАНИЦЕ
     ========================================================== */
  const bgFns = { h_ecg: bgEcg, h_dna: bgDna, h_cells: bgCells, h_pulse: bgPulse, h_mol: bgMol, h_vessel: bgVessel, h_cross: bgCross, h_breath: bgBreath, h_hex: bgHex, h_mri: bgMri };
  const shapeFns = { h_heart: aHeart, h_ecgline: aEcg, h_helix: aHelix, h_mitosis: aMitosis, h_virus: aVirus, h_lungs: aLungs, h_capsules: aCaps, h_drop: aDrop, h_brain: aBrain, h_immune: aImmune };
  const names = {
    h_ecg: "Кардиомонитор (ЭКГ)", h_dna: "ДНК-спираль", h_cells: "Клетки крови", h_pulse: "Пульс сердца", h_mol: "Молекулы", h_vessel: "Кровоток", h_cross: "Медицинские кресты", h_breath: "Дыхание", h_hex: "Лаборатория", h_mri: "МРТ-скан",
    h_heart: "Бьющееся сердце", h_ecgline: "Линия ЭКГ", h_helix: "Вращающаяся ДНК", h_mitosis: "Деление клетки", h_virus: "Вирус", h_lungs: "Дышащие лёгкие", h_capsules: "Падающие капсулы", h_drop: "Капля крови", h_brain: "Нейроны мозга", h_immune: "Иммунный щит",
    h3_heart: "Сердце 3D", h3_dna: "ДНК 3D", h3_syringe: "Шприц 3D", h3_pills: "Капсулы и таблетка 3D", h3_medkit: "Аптечка 3D", h3_virus: "Вирус 3D", h3_cell: "Клетка 3D", h3_brain: "Мозг 3D", h3_steth: "Стетоскоп 3D", h3_bottle: "Флакон с таблетками 3D"
  };

  /* общий реестр паков: следующие темы подключаются так же */
  if (!window.MSPack) {
    const _bg = drawBg, _sh = drawShape, _th = thBuild, B = {}, S = {}, M = {};
    drawBg = function (c, w, h, type, t, pal) { const f = B[type]; if (f) { c.fillStyle = pal[0]; c.fillRect(0, 0, w, h); return f(c, w, h, t, pal); } return _bg(c, w, h, type, t, pal); };
    drawShape = function (c, w, h, L, lt, dur, pal) {
      const f = S[L.shape]; if (!f) return _sh(c, w, h, L, lt, dur, pal);
      const q = ob(clamp(lt / 0.5)), R = (L.size || 0.2) * w * q / 2;
      c.save(); c.globalAlpha = clamp((dur - lt) / 0.3); c.translate((L.x || 0.5) * w, (L.y || 0.5) * h); f(c, R, lt, pal); c.restore();
    };
    thBuild = function (m, pal) { const f = M[m]; return f ? f(pal) : _th(m, pal); };
    window.MSPack = { B, S, M };
  }
  const P = window.MSPack;
  Object.assign(P.B, bgFns); Object.assign(P.S, shapeFns); Object.assign(P.M, M3);

  const DOMAIN = "Здоровье";
  try { if (typeof LIB_DOMAINS !== "undefined" && !LIB_DOMAINS.includes(DOMAIN)) LIB_DOMAINS.push(DOMAIN); } catch (e) {}

  function addCard(it) {
    it.domain = DOMAIN; LIB.push(it);
    if (typeof grid === "undefined") return;
    const b = document.createElement("button"); b.className = "card"; b.dataset.s = (it.cat + " " + it.name + " " + it.tags).toLowerCase();
    b.innerHTML = `<canvas width="320" height="180"></canvas><b>${it.name}</b><small>${it.domain}</small>`;
    it.cv = b.querySelector("canvas"); it.sc = it.mk(); it.el = b; b.onclick = () => it.act && it.act();
    grid.appendChild(b); if (typeof io !== "undefined") io.observe(b);
  }
  const scene = (o) => () => addScene(o);

  Object.keys(bgFns).forEach(id => {
    BG.push(id); BUSY.push(id); N[id] = names[id];
    addCard({ id, cat: "Фон", name: "Здоровье: " + names[id], tags: "здоровье медицина фон " + names[id], mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "text", fx: "words", text: "Здоровье *важнее* всего", y: 0.5, size: 0.09 }] }) });
  });
  Object.keys(ICONS).forEach(id => {
    ICO[id] = ICONS[id][1]; ICN.push([id, ICONS[id][0]]);
    addCard({ id: "ico_" + id, cat: "Иконка", name: "Здоровье: " + ICONS[id][0], tags: "здоровье медицина иконка " + id + " " + ICONS[id][0], mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: 0.5, size: 0.4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "icon", name: id, y: 0.45, size: 0.4 }] }) });
  });
  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_" + id, cat: "Анимация", name: "Здоровье: " + names[id], tags: "здоровье медицина анимация " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: 0.5, y: 0.5, size: 0.48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "shape", shape: id, x: 0.5, y: 0.42, size: 0.8 }] }) });
  });
  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_" + id, cat: "3D", name: "Здоровье: " + names[id], tags: "здоровье медицина 3d три д " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: 0.5, y: 0.5, size: 0.52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: 0.1, id: "whoosh" }], layers: [{ type: "three", model: id, x: 0.5, y: 0.42, size: 0.85 }] }) });
  });
  try { if (typeof filt === "function") filt(); } catch (e) {}
  try { const sel = document.getElementById("catfilter"); if (sel && !Array.from(sel.options).some(o => o.value === DOMAIN)) { const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o); } } catch (e) {}

  /* подсказка ИИ-режиссёру: когда использовать элементы пака */
  const HINT = "ПАК ЗДОРОВЬЕ (используй для медицины, здоровья, биологии, лекарств): фоны h_ecg (кардиомонитор), h_dna, h_cells (клетки крови), h_pulse, h_mol (молекулы), h_vessel (кровоток), h_cross, h_breath (дыхание, спокойствие), h_hex (лаборатория), h_mri (диагностика). Анимации shape: h_heart, h_ecgline, h_helix, h_mitosis, h_virus, h_lungs, h_capsules, h_drop, h_brain, h_immune. Иконки icon: syringe, pill, dna, stethoscope, medkit, thermometer, microscope, heartpulse, tooth, flask. 3D three.model: h3_heart, h3_dna, h3_syringe, h3_pills, h3_medkit, h3_virus, h3_cell, h3_brain, h3_steth, h3_bottle.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u, o) { try { if (o && typeof o.body === "string" && /\/director$/.test(String(u))) { const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n") + "\n" + (b.hint || ""); o.body = JSON.stringify(b); } } catch (e) {} return _f.apply(this, arguments); };
  }
  window.__hintPatch.push(HINT);
})();