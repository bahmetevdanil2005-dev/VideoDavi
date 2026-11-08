/* ==========================================================
   MOTION STUDIO · ПАК «НЕЙРОСЕТИ»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-ai.js"></script>
   (после основного <script>, рядом с другими паками).
   Все изображения нарисованы кодом; логотипы брендов не используются.
   ========================================================== */
(function () {
  "use strict";
  if (window.__packAI) return;

  const need = ["BG", "ICO", "ICN", "N", "SHP", "TH3", "LIB", "BUSY", "drawBg", "drawShape", "thBuild", "clamp", "eo", "ob", "rnd"];
  const missing = need.filter(n => { try { return typeof eval(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «Нейросети» не подключён, нет:", missing.join(", ")); return; }
  window.__packAI = true;

  /* ---------- общие помощники ---------- */
  const TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const FNT = () => (typeof FONT !== "undefined" ? FONT : "Arial, sans-serif");
  const MONO = "Menlo, Consolas, 'Courier New', monospace";
  const hx = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mixc = (a, b, t) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };
  const ease = x => x * x * (3 - 2 * x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const txt = (c, s, x, y, px, col, wt, al, fam) => { c.font = (wt || 800) + " " + px + "px " + (fam || FNT()); c.textAlign = al || "center"; c.textBaseline = "middle"; c.fillStyle = col; c.fillText(s, x, y); };
  const CYAN = "#22d3ee", GREEN = "#19d37a", RED = "#ff3b57", VIOLET = "#8a6bff", AMBER = "#ffb020", PINK = "#ff5c8a";

  const spark = (c, x, y, r, a, col) => { c.save(); c.translate(x, y); c.fillStyle = rgba(col || "#ffffff", a); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.fill(); c.restore(); };
  const glowBg = (c, R, col, a) => { const g = c.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 1.5); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-R * 1.6, -R * 1.6, R * 3.2, R * 3.2); };
  function polyPartial(c, pts, f) {
    let tot = 0; const L = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
    let d = tot * f; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) { const l = L[i - 1]; if (d >= l) { c.lineTo(pts[i][0], pts[i][1]); d -= l; } else { const k = d / l; c.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k); break; } }
    c.stroke();
  }
  /* «картинка», которую рисует нейросеть: закат в горах (u, v в долях ширины/высоты, asp = высота/ширина) */
  function sceneRGB(u, v, top, asp) {
    const sky = clamp(v / 0.6); let r = lerp(top[0], 255, sky * sky), g = lerp(top[1], 122, sky * sky), b = lerp(top[2], 89, sky * sky);
    const sd = Math.hypot(u - 0.5, (v - 0.46) * asp);
    if (sd < 0.13) { const k = 1 - sd / 0.13; r = lerp(r, 255, k); g = lerp(g, 232, k); b = lerp(b, 170, k); }
    if (v > 0.62 + 0.05 * sin(u * 7) + 0.04 * sin(u * 13 + 1)) { r = 34; g = 26; b = 72; }
    if (v > 0.76 + 0.04 * sin(u * 5 + 2) + 0.02 * sin(u * 17)) { r = 12; g = 10; b = 40; }
    return [r, g, b];
  }

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */
  function bgDeep(c, w, h, t, pal) {
    const col = pal[1], LY = [6, 9, 11, 12, 11, 9, 6], nl = LY.length, X = l => w * (0.07 + 0.86 * l / (nl - 1)), F = (l, i) => (i + 0.5) / LY[l], Y = (l, i) => h * (0.1 + 0.8 * F(l, i)), A = (l, i) => sin(t * 1.6 - l * 0.95 + i * 0.8 + rnd(l * 9 + i) * 6), q = (t * 0.55) % 1.3 - 0.15;
    c.lineWidth = Math.max(1, w * 0.002);
    for (let l = 0; l < nl - 1; l++) {
      const u = clamp((q - l / (nl - 1)) * (nl - 1));
      for (let i = 0; i < LY[l]; i++) {
        const a = A(l, i);
        for (let j = 0; j < LY[l + 1]; j++) {
          if (Math.abs(F(l, i) - F(l + 1, j)) > 0.17) continue;
          const x0 = X(l), y0 = Y(l, i), x1 = X(l + 1), y1 = Y(l + 1, j);
          c.strokeStyle = rgba(a > 0 ? col : PINK, 0.04 + 0.2 * Math.abs(a) * (a > 0 ? 1 : 0.5)); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          if (u > 0 && u < 1 && rnd(l * 131 + i * 17 + j) > 0.7) { c.fillStyle = "#fff"; c.beginPath(); c.arc(lerp(x0, x1, u), lerp(y0, y1, u), w * 0.004, 0, TAU); c.fill(); }
        }
      }
    }
    for (let l = 0; l < nl; l++) for (let i = 0; i < LY[l]; i++) {
      const a = A(l, i), r = w * 0.011 * (1 + 0.4 * Math.max(0, a));
      if (a > 0.75) { c.fillStyle = rgba(col, 0.15); c.beginPath(); c.arc(X(l), Y(l, i), r * 2.6, 0, TAU); c.fill(); }
      c.fillStyle = a > 0 ? rgba(col, 0.3 + 0.7 * a) : rgba(PINK, 0.2 - 0.5 * a); c.beginPath(); c.arc(X(l), Y(l, i), r, 0, TAU); c.fill();
    }
  }

  const TOK = ["The", "neur", "al", "net", "work", "learn", "s", "to", "pre", "dict", "the", "next", "token", "att", "ention", "is", "all", "you", "need", "0.12", "vec", "GPT", "prompt", "model", "train", "data", ",", "."];
  function bgTokens(c, w, h, t, pal) {
    const col = pal[1], rows = 15, rh = h / rows, px = Math.min(rh * 0.34, w * 0.034), ch = rh * 0.62, cw = px * 0.62;
    c.font = "700 " + px + "px " + MONO; c.textBaseline = "middle"; c.textAlign = "left"; c.lineWidth = Math.max(1, w * 0.002);
    for (let r = 0; r < rows; r++) {
      const dir = r % 2 ? 1 : -1, sp = (0.03 + 0.05 * rnd(r + 3)) * w, N = 22, seq = [], X0 = []; let tot = 0;
      for (let k = 0; k < N; k++) { const s = TOK[Math.floor(rnd(r * 53 + k * 1.3) * TOK.length)], wd = s.length * cw + px * 1.2; seq.push([s, wd]); X0.push(tot); tot += wd + px * 0.5; }
      const off = (((t * sp * dir) % tot) + tot) % tot, y = r * rh + rh / 2, a = 0.3 + 0.5 * rnd(r + 9);
      for (let m = -1; m <= Math.ceil(w / tot) + 1; m++) for (let k = 0; k < N; k++) {
        const x = X0[k] + m * tot - off; if (x > w || x + seq[k][1] < 0) continue;
        const hot = rnd(r * 91 + k * 7.7 + Math.floor(t * 0.7)) > 0.93;
        c.fillStyle = rgba(col, hot ? 0.5 : 0.07); c.strokeStyle = rgba(col, hot ? 1 : 0.28 * a); rrect(c, x, y - ch / 2, seq[k][1], ch, ch * 0.3); c.fill(); c.stroke();
        c.fillStyle = hot ? "#fff" : rgba(col, a); c.fillText(seq[k][0], x + px * 0.6, y);
      }
    }
  }

  function bgAttention(c, w, h, t, pal) {
    const col = pal[1], N = 12, m = Math.min(w * 0.82, h * 0.5), cell = m / N, x0 = (w - m) / 2, y0 = h * 0.4, q = Math.floor(t * 1.1) % N, ty = h * 0.3, tx = k => x0 + (k + 0.5) * cell;
    const W = (i, j) => Math.pow(0.5 + 0.5 * sin(t * 0.6 + i * 0.9 - j * 1.3 + rnd(i * 12 + j) * 6), 3) * 0.8 + (i === j ? 0.2 : 0) + (Math.abs(i - j) === 1 ? 0.08 : 0);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { c.fillStyle = rgba(col, 0.06 + 0.85 * Math.min(1, W(i, j))); c.fillRect(x0 + j * cell + 1, y0 + i * cell + 1, cell - 2, cell - 2); }
    c.strokeStyle = "#fff"; c.lineWidth = Math.max(2, w * 0.004); c.strokeRect(x0, y0 + q * cell, m, cell);
    for (let k = 0; k < N; k++) { c.fillStyle = k === q ? "#fff" : rgba(col, 0.6); c.beginPath(); c.arc(tx(k), ty, cell * (k === q ? 0.24 : 0.16), 0, TAU); c.fill(); c.fillStyle = rgba(col, 0.35); c.beginPath(); c.arc(x0 - cell * 0.4, y0 + (k + 0.5) * cell, cell * 0.1, 0, TAU); c.fill(); }
    for (let j = 0; j < N; j++) { if (j === q) continue; const a = W(q, j); c.strokeStyle = rgba(col, 0.2 + 0.7 * Math.min(1, a)); c.lineWidth = Math.max(1, w * 0.0015 + a * w * 0.012); c.lineCap = "round"; c.beginPath(); c.moveTo(tx(q), ty); c.quadraticCurveTo((tx(q) + tx(j)) / 2, ty - h * 0.2 * (0.2 + Math.abs(q - j) / N), tx(j), ty); c.stroke(); }
    txt(c, "softmax(Q·K / sqrt(d))", w / 2, y0 + m + cell * 0.9, Math.min(cell * 0.5, w * 0.03), rgba(col, 0.8), 700, "center", MONO);
  }

  function bgLatent(c, w, h, t, pal) {
    const col = pal[1], K = 5, per = 26, cl = [col, VIOLET, PINK, AMBER, GREEN];
    const C = k => [w * (0.2 + 0.6 * rnd(k * 3.1 + 1)) + sin(t * 0.3 + k * 2) * w * 0.04, h * (0.2 + 0.6 * rnd(k * 5.3 + 2)) + cos(t * 0.27 + k * 1.7) * h * 0.03];
    c.strokeStyle = rgba(col, 0.06); c.lineWidth = 1; c.beginPath(); for (let j = 1; j < 8; j++) { c.moveTo(j * w / 8, 0); c.lineTo(j * w / 8, h); c.moveTo(0, j * h / 8); c.lineTo(w, j * h / 8); } c.stroke();
    const cen = []; for (let k = 0; k < K; k++) cen.push(C(k));
    cen.forEach((p, k) => { const g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], w * 0.17); g.addColorStop(0, rgba(cl[k], 0.16)); g.addColorStop(1, rgba(cl[k], 0)); c.fillStyle = g; c.fillRect(p[0] - w * 0.17, p[1] - w * 0.17, w * 0.34, w * 0.34); });
    const seg = Math.floor(t / 2.5), ka = seg % K, kb = (ka + 1 + Math.floor(rnd(seg) * (K - 1))) % K, pts = [];
    for (let k = 0; k < K; k++) for (let p = 0; p < per; p++) {
      const a = rnd(k * 100 + p) * TAU + t * (rnd(k * 100 + p + 0.2) - 0.5) * 0.6, d = (rnd(k * 100 + p + 0.5) + rnd(k * 100 + p + 0.7)) * 0.5 * w * 0.13, x = cen[k][0] + cos(a) * d, y = cen[k][1] + sin(a) * d * 0.8;
      pts.push([x, y, k]); c.fillStyle = rgba(cl[k], 0.75); c.beginPath(); c.arc(x, y, w * 0.0055 * (0.6 + rnd(k * 100 + p + 0.9)), 0, TAU); c.fill();
    }
    c.strokeStyle = rgba(cl[ka], 0.25); c.lineWidth = Math.max(1, w * 0.002); c.beginPath(); const mine = pts.filter(p => p[2] === ka);
    for (let i = 0; i < mine.length; i++) for (let j = i + 1; j < mine.length; j++) if (Math.hypot(mine[i][0] - mine[j][0], mine[i][1] - mine[j][1]) < w * 0.05) { c.moveTo(mine[i][0], mine[i][1]); c.lineTo(mine[j][0], mine[j][1]); } c.stroke();
    const u = ease((t % 2.5) / 2.5);
    for (let s = 12; s >= 0; s--) { const uu = Math.max(0, u - s * 0.03), x = lerp(cen[ka][0], cen[kb][0], uu), y = lerp(cen[ka][1], cen[kb][1], uu); c.fillStyle = rgba("#ffffff", (1 - s / 13) * 0.7); c.beginPath(); c.arc(x, y, w * 0.009 * (1 - s / 16), 0, TAU); c.fill(); }
    const qx = lerp(cen[ka][0], cen[kb][0], u), qy = lerp(cen[ka][1], cen[kb][1], u); c.save(); c.shadowColor = "#fff"; c.shadowBlur = w * 0.03; c.fillStyle = "#fff"; c.beginPath(); c.arc(qx, qy, w * 0.011, 0, TAU); c.fill(); c.restore();
    txt(c, "latent space · 2D", w * 0.5, h * 0.96, w * 0.03, rgba(col, 0.7), 700, "center", MONO);
  }

  function bgGradient(c, w, h, t, pal) {
    const col = pal[1], cx = w * 0.5, cy = h * 0.4, Rc = Math.min(w * 0.46, h * 0.34), g = a => 1 + 0.12 * sin(3 * a + 0.5) + 0.08 * sin(5 * a + 1.3), P = (r, a) => [cx + cos(a) * r * g(a), cy + sin(a) * r * g(a) * 0.62];
    for (let k = 1; k <= 9; k++) { c.strokeStyle = rgba(col, 0.1 + 0.35 * (1 - k / 9)); c.lineWidth = Math.max(1, w * 0.0025); c.beginPath(); for (let s = 0; s <= 72; s++) { const p = P(Rc * k / 9, s / 72 * TAU); s ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.closePath(); c.stroke(); }
    c.strokeStyle = rgba(VIOLET, 0.3); c.setLineDash([w * 0.01, w * 0.01]); for (let k = 1; k <= 3; k++) { c.beginPath(); c.ellipse(cx + Rc * 0.75, cy - Rc * 0.4, Rc * 0.1 * k, Rc * 0.06 * k, 0, 0, TAU); c.stroke(); } c.setLineDash([]);
    const per = 7, u = clamp((t % per) / per / 0.85), rr = s => Rc * 0.95 * Math.pow(1 - s, 1.5), an = s => 0.6 + s * 4.2, loss = s => 0.03 + 0.97 * Math.pow(1 - s, 3);
    c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = Math.max(2, w * 0.004); c.lineCap = "round"; c.beginPath(); for (let s = 0; s <= 60; s++) { const p = P(rr(u * s / 60), an(u * s / 60)); s ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
    const bp = P(rr(u), an(u)); c.save(); c.shadowColor = col; c.shadowBlur = w * 0.04; c.fillStyle = "#fff"; c.beginPath(); c.arc(bp[0], bp[1], w * 0.014, 0, TAU); c.fill(); c.restore();
    const x0 = w * 0.1, x1 = w * 0.9, y0 = h * 0.76, y1 = h * 0.94;
    c.strokeStyle = "rgba(255,255,255,.3)"; c.lineWidth = Math.max(1, w * 0.002); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
    c.strokeStyle = col; c.lineWidth = Math.max(2, w * 0.005); c.beginPath(); for (let s = 0; s <= 60; s++) { const q = u * s / 60; const x = lerp(x0, x1, q), y = lerp(y1, y0, loss(q)); s ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    txt(c, "loss " + loss(u).toFixed(3), x1, y0 - h * 0.02, w * 0.035, col, 800, "right", MONO); txt(c, "step " + Math.round(u * 100), x0, y0 - h * 0.02, w * 0.035, "rgba(255,255,255,.7)", 800, "left", MONO);
  }

  function bgDiffusion(c, w, h, t, pal) {
    const cols = 18, cell = w / cols, rows = Math.ceil(h / cell), per = 8, ph = (t % per) / per, n = ph < 0.55 ? 1 - ease(ph / 0.55) : ph < 0.75 ? 0 : ease((ph - 0.75) / 0.25), top = hx(mixc(pal[0], pal[1], 0.3)), sk = Math.floor(t * 8), asp = rows / cols;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const tg = sceneRGB((i + 0.5) / cols, (j + 0.5) / rows, top, asp), r = lerp(tg[0], rnd(i * 17.3 + j * 31.7 + sk * 5.1) * 255, n) * 0.8, g = lerp(tg[1], rnd(i * 13.1 + j * 7.7 + sk * 3.3) * 255, n) * 0.8, b = lerp(tg[2], rnd(i * 5.9 + j * 23.3 + sk * 9.7) * 255, n) * 0.8;
      c.fillStyle = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")"; c.fillRect(i * cell + cell * 0.03, j * cell + cell * 0.03, cell * 0.94, cell * 0.94);
    }
    c.fillStyle = "rgba(0,0,0,.55)"; c.fillRect(0, h - w * 0.12, w, w * 0.12); txt(c, "denoising step " + Math.round((1 - n) * 50) + " / 50", w / 2, h - w * 0.06, w * 0.045, "#fff", 800, "center", MONO);
  }

  function bgMatrix(c, w, h, t, pal) {
    const col = pal[1], cols = 8, cw = w / cols, rows = Math.ceil(h / cw), px = cw * 0.3, r0 = Math.floor(t * 1.5) % rows, c0 = Math.floor(t * 1.1) % cols;
    c.fillStyle = rgba(col, 0.07); c.fillRect(0, r0 * cw, w, cw); c.fillRect(c0 * cw, 0, cw, h);
    c.font = "700 " + px + "px " + MONO; c.textAlign = "center"; c.textBaseline = "middle";
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const ep = Math.floor(t * 0.6 + rnd(i + j * 9) * 3), v = rnd(i * 7.3 + j * 3.1 + ep * 1.7) * 2 - 1, on = j === r0 || i === c0;
      c.fillStyle = rgba(v > 0 ? col : PINK, on ? 0.95 : 0.15 + 0.3 * Math.abs(v)); c.fillText(v.toFixed(2), (i + 0.5) * cw, (j + 0.5) * cw);
    }
    c.strokeStyle = "#fff"; c.lineWidth = Math.max(2, w * 0.004); c.strokeRect(c0 * cw + 2, r0 * cw + 2, cw - 4, cw - 4);
    c.strokeStyle = rgba(col, 0.5); c.lineWidth = Math.max(2, w * 0.005); c.beginPath(); c.moveTo(cw * 0.15, 0); c.lineTo(cw * 0.05, 0); c.lineTo(cw * 0.05, h); c.lineTo(cw * 0.15, h); c.moveTo(w - cw * 0.15, 0); c.lineTo(w - cw * 0.05, 0); c.lineTo(w - cw * 0.05, h); c.lineTo(w - cw * 0.15, h); c.stroke();
  }

  function bgDetect(c, w, h, t, pal) {
    const ts = w / 3, off = t * ts * 0.22, r0 = Math.floor(off / ts), rowsN = Math.ceil(h / ts) + 2, cl = [pal[1], VIOLET, PINK, AMBER], NM = ["ball", "cone", "box", "gem"], px = ts * 0.085;
    c.lineWidth = Math.max(1, w * 0.002);
    for (let rr = -1; rr < rowsN; rr++) for (let col = 0; col < 3; col++) {
      const idx = r0 + rr, seed = idx * 3 + col, x = col * ts, y = rr * ts - (off % ts), ty = Math.floor(rnd(seed) * 4), cc = cl[Math.floor(rnd(seed + 2) * 4)];
      c.fillStyle = rgba(cc, 0.05); c.strokeStyle = rgba(pal[1], 0.15); rrect(c, x + ts * 0.04, y + ts * 0.04, ts * 0.92, ts * 0.92, ts * 0.05); c.fill(); c.stroke();
      const cx = x + ts * (0.35 + 0.3 * rnd(seed + 4)), cy = y + ts * (0.42 + 0.2 * rnd(seed + 6)), r = ts * (0.13 + 0.06 * rnd(seed + 8));
      c.fillStyle = rgba(cc, 0.8); c.beginPath();
      if (ty === 0) c.arc(cx, cy, r, 0, TAU); else if (ty === 1) { c.moveTo(cx, cy - r); c.lineTo(cx + r, cy + r); c.lineTo(cx - r, cy + r); c.closePath(); } else if (ty === 2) c.rect(cx - r, cy - r, r * 2, r * 2); else { c.moveTo(cx, cy - r * 1.2); c.lineTo(cx + r, cy); c.lineTo(cx, cy + r * 1.2); c.lineTo(cx - r, cy); c.closePath(); }
      c.fill();
      const p = (t * 0.5 + rnd(seed + 3)) % 1, al = p < 0.3 ? 0 : p < 0.4 ? (p - 0.3) / 0.1 : p < 0.9 ? 1 : (1 - p) / 0.1;
      if (al > 0) {
        const bs = r * 1.45, L = bs * 0.5; c.strokeStyle = rgba(GREEN, al); c.lineWidth = Math.max(2, w * 0.004); c.lineCap = "round"; c.beginPath();
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => { c.moveTo(cx + q[0] * bs, cy + q[1] * bs - q[1] * L); c.lineTo(cx + q[0] * bs, cy + q[1] * bs); c.lineTo(cx + q[0] * bs - q[0] * L, cy + q[1] * bs); }); c.stroke();
        const lb = NM[ty] + " " + (0.82 + 0.17 * rnd(seed + 5)).toFixed(2); c.fillStyle = rgba(GREEN, al * 0.9); rrect(c, cx - bs, cy - bs - px * 1.5, px * 0.62 * lb.length + px * 0.8, px * 1.4, px * 0.3); c.fill(); txt(c, lb, cx - bs + px * 0.4, cy - bs - px * 0.8, px, rgba("#04210f", al), 800, "left", MONO);
      }
    }
  }

  function bgVoice(c, w, h, t, pal) {
    const col = pal[1], hi = mixc(col, "#ffffff", 0.6);
    for (let k = 0; k < 4; k++) {
      c.strokeStyle = rgba(k % 2 ? VIOLET : col, 0.5 - k * 0.09); c.lineWidth = Math.max(1.5, w * (0.007 - k * 0.0011)); c.lineJoin = "round"; c.beginPath();
      for (let x = 0; x <= w + 6; x += 6) { const u = x / w, env = 0.3 + 0.7 * Math.abs(sin(u * 3.2 - t * 0.8 + k)), y = h * 0.28 + sin(u * (7 + 3 * k) + t * (2.5 + k * 0.6)) * h * 0.09 * env * (1 - k * 0.15); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    }
    const bins = 26, cw = w * 0.026, cols = Math.ceil(w / cw) + 1, y0 = h * 0.55, ph = h * 0.42, bh = ph / bins, sp = 12, k0 = Math.floor(t * sp), fr = (t * sp) % 1;
    for (let i = 0; i < cols; i++) {
      const k = k0 + i, env = Math.abs(sin(k * 0.11)) * 0.7 + 0.3 * rnd(Math.floor(k / 6) * 3.7);
      for (let b = 0; b < bins; b++) { const v = env * (0.35 + 0.65 * rnd(k * 13 + b * 1.7)) * Math.exp(-b / 14) * 1.4; c.fillStyle = rgba(v > 0.55 ? hi : col, 0.1 + 0.8 * Math.min(1, v)); c.fillRect((i - fr) * cw + 1, y0 + ph - (b + 1) * bh + 1, cw - 2, bh - 1); }
    }
    c.strokeStyle = rgba(col, 0.4); c.lineWidth = 1; c.beginPath(); c.moveTo(0, h * 0.5); c.lineTo(w, h * 0.5); c.stroke(); txt(c, "MEL SPECTROGRAM", w * 0.5, h * 0.52, w * 0.03, rgba(col, 0.8), 700, "center", MONO);
  }

  function bgSynapse(c, w, h, t, pal) {
    const col = pal[1], N = 22, P = []; for (let i = 0; i < N; i++) P.push([rnd(i) * w * 0.9 + w * 0.05 + sin(t * 0.3 + i) * w * 0.02, rnd(i + 9) * h * 0.9 + h * 0.05 + cos(t * 0.25 + i * 1.3) * h * 0.015]);
    const E = []; for (let i = 0; i < N; i++) { const ds = []; for (let j = 0; j < N; j++) if (j !== i) ds.push([j, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])]); ds.sort((a, b) => a[1] - b[1]); for (let k = 0; k < 2; k++) E.push([i, ds[k][0], ds[k][1], k]); }
    const Q = (e, u) => { const a = P[e[0]], b = P[e[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1, off = e[2] * 0.25 * sin(e[0] * 3.1 + e[3]) / l, qx = mx + nx * off, qy = my + ny * off, v = 1 - u; return [v * v * a[0] + 2 * v * u * qx + u * u * b[0], v * v * a[1] + 2 * v * u * qy + u * u * b[1], qx, qy]; };
    c.lineCap = "round"; c.lineWidth = Math.max(1, w * 0.003);
    E.forEach(e => { const q = Q(e, 0.5); c.strokeStyle = rgba(col, 0.16); c.beginPath(); c.moveTo(P[e[0]][0], P[e[0]][1]); c.quadraticCurveTo(q[2], q[3], P[e[1]][0], P[e[1]][1]); c.stroke(); });
    c.lineWidth = Math.max(1, w * 0.002);
    P.forEach((p, i) => { c.strokeStyle = rgba(col, 0.3); c.beginPath(); for (let s = 0; s < 5; s++) { const a = rnd(i * 5 + s) * TAU, l = w * (0.025 + 0.02 * rnd(i * 5 + s + 3)), ex = p[0] + cos(a) * l, ey = p[1] + sin(a) * l; c.moveTo(p[0], p[1]); c.lineTo(ex, ey); c.moveTo(ex, ey); c.lineTo(ex + cos(a + 0.6) * l * 0.5, ey + sin(a + 0.6) * l * 0.5); c.moveTo(ex, ey); c.lineTo(ex + cos(a - 0.6) * l * 0.5, ey + sin(a - 0.6) * l * 0.5); } c.stroke(); });
    P.forEach((p, i) => {
      const f = (t * 0.45 + rnd(i + 4) * 3) % 1, g = Math.exp(-f * 5);
      c.fillStyle = rgba(col, 0.5 * g); c.beginPath(); c.arc(p[0], p[1], w * (0.012 + 0.03 * g), 0, TAU); c.fill(); c.fillStyle = rgba("#ffffff", 0.45 + 0.55 * g); c.beginPath(); c.arc(p[0], p[1], w * 0.009, 0, TAU); c.fill();
    });
    E.forEach(e => { const f = (t * 0.45 + rnd(e[0] + 4) * 3) % 1; if (f < 0.66) { const q = Q(e, f * 1.5); c.save(); c.shadowColor = col; c.shadowBlur = w * 0.02; c.fillStyle = "#fff"; c.beginPath(); c.arc(q[0], q[1], w * 0.0055, 0, TAU); c.fill(); c.restore(); } });
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр (0,0)
     ========================================================== */
  function aPercep(c, R, lt, pal) {
    const col = pal[1], Wt = [0.9, -0.5, 0.7].map((v, i) => v * (1 + 0.3 * sin(lt * 0.9 + i))), Xv = [0, 1, 2].map(i => 0.5 + 0.5 * sin(lt * 1.3 + i * 2)), z = Wt.reduce((s, v, i) => s + v * Xv[i], 0), out = 1 / (1 + Math.exp(-3 * z));
    const IX = -R * 0.95, SX = -R * 0.1, AX = R * 0.5, OX = R * 1.0, iy = i => (i - 1) * R * 0.62, rn = R * 0.17, u = (lt * 0.7) % 1;
    glowBg(c, R, col, 0.22); c.save(); c.translate(-R * 0.05, 0); c.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      c.strokeStyle = rgba(Wt[i] >= 0 ? col : PINK, 0.8); c.lineWidth = R * (0.02 + 0.07 * Math.abs(Wt[i])); c.beginPath(); c.moveTo(IX, iy(i)); c.lineTo(SX, 0); c.stroke();
      txt(c, "w=" + Wt[i].toFixed(1), lerp(IX, SX, 0.42), lerp(iy(i), 0, 0.42) - R * 0.12 * (i === 2 ? -1 : 1), R * 0.11, "rgba(255,255,255,.8)", 700, "center", MONO);
      if (u < 0.5) { const v = u / 0.5; c.fillStyle = "#fff"; c.beginPath(); c.arc(lerp(IX, SX, v), lerp(iy(i), 0, v), R * 0.035, 0, TAU); c.fill(); }
    }
    c.strokeStyle = rgba(col, 0.45); c.lineWidth = R * 0.04; c.beginPath(); c.moveTo(SX, 0); c.lineTo(OX, 0); c.stroke();
    if (u >= 0.5) { const v = (u - 0.5) / 0.5; c.fillStyle = "#fff"; c.beginPath(); c.arc(lerp(SX, OX, v), 0, R * 0.04, 0, TAU); c.fill(); }
    for (let i = 0; i < 3; i++) { c.fillStyle = rgba(col, 0.2 + 0.6 * Xv[i]); c.strokeStyle = col; c.lineWidth = R * 0.03; c.beginPath(); c.arc(IX, iy(i), rn, 0, TAU); c.fill(); c.stroke(); txt(c, "x" + (i + 1), IX, iy(i), R * 0.12, "#fff", 800, "center", MONO); }
    c.fillStyle = "#0b1424"; c.strokeStyle = "#fff"; c.lineWidth = R * 0.035; c.beginPath(); c.arc(SX, 0, R * 0.22, 0, TAU); c.fill(); c.stroke(); txt(c, "Σ", SX, 0, R * 0.26, "#fff", 800);
    c.fillStyle = "#0b1424"; c.strokeStyle = VIOLET; rrect(c, AX - R * 0.25, -R * 0.2, R * 0.5, R * 0.4, R * 0.06); c.fill(); c.stroke();
    c.strokeStyle = VIOLET; c.lineWidth = R * 0.03; c.beginPath(); for (let s = -10; s <= 10; s++) { const x = AX + s / 10 * R * 0.18, y = -(1 / (1 + Math.exp(-s / 2.2)) - 0.5) * R * 0.28; s > -10 ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    const zs = clamp(z / 1.2, -1, 1); c.fillStyle = "#fff"; c.beginPath(); c.arc(AX + zs * R * 0.18, -(1 / (1 + Math.exp(-zs * 4.5)) - 0.5) * R * 0.28, R * 0.03, 0, TAU); c.fill();
    c.fillStyle = rgba(GREEN, 0.25 + 0.7 * out); c.strokeStyle = GREEN; c.lineWidth = R * 0.035; c.beginPath(); c.arc(OX, 0, R * 0.2, 0, TAU); c.fill(); c.stroke(); txt(c, out.toFixed(2), OX, 0, R * 0.13, "#fff", 900, "center", MONO);
    c.restore();
  }

  function aNet(c, R, lt, pal) {
    const col = pal[1], LY = [3, 5, 4, 2], nl = 4, X = l => (l - 1.5) * R * 0.62, Y = (l, i) => (i - (LY[l] - 1) / 2) * R * 0.33, per = 5, u = (lt % per) / per, back = u >= 0.5, v = back ? (u - 0.5) / 0.5 : u / 0.5, pc = back ? PINK : col, pos = back ? (1 - v) * (nl - 1) : v * (nl - 1);
    glowBg(c, R, pc, 0.22); c.lineWidth = R * 0.02;
    for (let l = 0; l < nl - 1; l++) {
      const s = back ? clamp(l + 1 - pos) : clamp(pos - l);
      for (let i = 0; i < LY[l]; i++) for (let j = 0; j < LY[l + 1]; j++) {
        const x0 = X(l), y0 = Y(l, i), x1 = X(l + 1), y1 = Y(l + 1, j), on = s > 0 && s < 1;
        c.strokeStyle = rgba(on ? pc : col, on ? 0.6 : 0.2); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        if (on && rnd(l * 50 + i * 7 + j) > 0.4) { const k = back ? 1 - s : s; c.fillStyle = "#fff"; c.beginPath(); c.arc(lerp(x0, x1, k), lerp(y0, y1, k), R * 0.03, 0, TAU); c.fill(); }
      }
    }
    for (let l = 0; l < nl; l++) for (let i = 0; i < LY[l]; i++) { const act = clamp(1 - Math.abs(l - pos) * 1.6); c.fillStyle = rgba(pc, 0.2 + 0.75 * act); c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = R * 0.025; c.beginPath(); c.arc(X(l), Y(l, i), R * 0.09, 0, TAU); c.fill(); c.stroke(); }
    txt(c, back ? "backprop" : "forward", 0, -R * 1.0, R * 0.2, pc, 900, "center", MONO);
    txt(c, back ? "loss ↓" : "input → output", 0, R * 1.0, R * 0.14, "rgba(255,255,255,.7)", 700, "center", MONO);
  }

  function aBrain(c, R, lt, pal) {
    const col = pal[1], circ = [[-0.45, -0.1, 0.42], [-0.1, -0.35, 0.45], [0.35, -0.25, 0.42], [0.6, 0.1, 0.34], [-0.65, 0.2, 0.3], [0.2, 0.2, 0.4], [-0.2, 0.3, 0.4]];
    const path = () => { c.beginPath(); circ.forEach(q => { c.moveTo((q[0] + q[2]) * R, q[1] * R); c.arc(q[0] * R, q[1] * R, q[2] * R, 0, TAU); }); c.rect(-R * 0.05, R * 0.5, R * 0.22, R * 0.4); };
    glowBg(c, R, col, 0.3); c.save(); c.translate(0, -R * 0.05);
    const g = c.createLinearGradient(-R, -R, R, R); g.addColorStop(0, mixc(PINK, "#ffffff", 0.35)); g.addColorStop(1, mixc(VIOLET, "#000000", 0.15));
    c.save(); c.shadowColor = col; c.shadowBlur = R * 0.2; c.fillStyle = g; path(); c.fill(); c.restore();
    c.save(); path(); c.clip();
    c.strokeStyle = "rgba(60,10,70,.35)"; c.lineWidth = R * 0.03; c.lineCap = "round";
    [[-0.85, 0, -0.55, -0.25, -0.35, 0], [-0.4, 0.15, -0.1, 0.05, 0, 0.3], [0, -0.5, 0.15, -0.2, 0, 0.05], [0.2, -0.4, 0.45, -0.1, 0.7, -0.2], [0.35, 0.3, 0.55, 0.15, 0.8, 0.3], [-0.6, 0.4, -0.4, 0.25, -0.15, 0.5]].forEach(q => { c.beginPath(); c.moveTo(q[0] * R, q[1] * R); c.quadraticCurveTo(q[2] * R, q[3] * R, q[4] * R, q[5] * R); c.stroke(); });
    const NP = [[-0.6, -0.1], [-0.35, -0.45], [-0.1, 0.1], [0.1, -0.55], [0.3, -0.1], [0.55, -0.3], [0.7, 0.1], [0.4, 0.3], [0.1, 0.35], [-0.25, 0.4], [-0.6, 0.25], [-0.2, -0.2]], E = [[0, 1], [1, 11], [11, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 0], [2, 8], [4, 7], [11, 0], [1, 3]];
    c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = R * 0.02; c.beginPath(); E.forEach(e => { c.moveTo(NP[e[0]][0] * R, NP[e[0]][1] * R); c.lineTo(NP[e[1]][0] * R, NP[e[1]][1] * R); }); c.stroke();
    E.forEach((e, k) => { const u = (lt * 0.5 + k * 0.13) % 1; c.fillStyle = "#fff"; c.beginPath(); c.arc(lerp(NP[e[0]][0], NP[e[1]][0], u) * R, lerp(NP[e[0]][1], NP[e[1]][1], u) * R, R * 0.028, 0, TAU); c.fill(); });
    NP.forEach((p, i) => { c.fillStyle = rgba("#ffffff", 0.6 + 0.4 * sin(lt * 3 + i)); c.beginPath(); c.arc(p[0] * R, p[1] * R, R * 0.045, 0, TAU); c.fill(); });
    c.restore(); c.restore();
    [[-0.95, -0.7], [0.95, -0.6], [0.85, 0.7], [-0.9, 0.6]].forEach((p, i) => spark(c, p[0] * R, p[1] * R, R * 0.12 * Math.abs(sin(lt * 2.4 + i * 1.5)), 0.9, "#ffffff"));
  }

  function aChat(c, R, lt, pal) {
    const col = pal[1], per = 7, u = (lt % per) / per, fade = u > 0.92 ? (1 - u) / 0.08 : 1, p1 = ease(clamp(u / 0.1));
    glowBg(c, R, col, 0.22); c.save(); c.globalAlpha *= fade;
    c.save(); c.translate(R * 0.95, -R * 0.62); c.scale(p1, p1); c.fillStyle = col; rrect(c, -R * 1.2, -R * 0.24, R * 1.2, R * 0.48, R * 0.2); c.fill(); c.fillStyle = "rgba(255,255,255,.9)"; rrect(c, -R * 1.05, -R * 0.12, R * 0.9, R * 0.07, R * 0.035); c.fill(); rrect(c, -R * 1.05, R * 0.02, R * 0.6, R * 0.07, R * 0.035); c.fill(); c.restore();
    const grow = ease(clamp((u - 0.4) / 0.06)), bh = lerp(R * 0.34, R * 0.95, grow), bw = lerp(R * 0.6, R * 1.75, grow), by = -R * 0.2;
    if (u > 0.14) {
      c.fillStyle = "rgba(255,255,255,.12)"; rrect(c, -R * 0.95, by, bw, bh, R * 0.2); c.fill(); c.strokeStyle = rgba(col, 0.7); c.lineWidth = R * 0.025; c.stroke();
      if (u < 0.43) { for (let k = 0; k < 3; k++) { c.fillStyle = rgba("#ffffff", 0.9); c.beginPath(); c.arc(-R * 0.66 + k * R * 0.18, by + bh / 2 + sin(lt * 8 - k * 0.9) * R * 0.04, R * 0.05, 0, TAU); c.fill(); } }
      else { const wd = [1, 0.85, 0.95, 0.5]; for (let l = 0; l < 4; l++) { const r = clamp((u - 0.44 - l * 0.09) / 0.12); if (r <= 0) continue; c.fillStyle = "rgba(255,255,255,.88)"; rrect(c, -R * 0.78, by + R * 0.16 + l * R * 0.17, Math.max(R * 0.04, R * 1.4 * wd[l] * r), R * 0.075, R * 0.035); c.fill(); }
        if (u < 0.88 && sin(lt * 9) > 0) { c.fillStyle = col; c.fillRect(-R * 0.78 + R * 1.45 * 0.5 + R * 0.05, by + R * 0.78, R * 0.04, R * 0.1); } }
      spark(c, -R * 0.95 + bw - R * 0.1, by + R * 0.12, R * 0.08, 0.9, "#ffffff");
    }
    c.restore();
  }

  function aPrompt(c, R, lt, pal) {
    const col = pal[1], per = 7, u = (lt % per) / per, fade = u > 0.93 ? (1 - u) / 0.07 : 1, S = "a mountain at sunset", n = Math.floor(clamp(u / 0.28) * S.length), nz = u < 0.34 ? 1 : u < 0.82 ? 1 - ease((u - 0.34) / 0.48) : 0, top = hx(mixc(pal[0], pal[1], 0.3)), cols = 16, rows = 10, cs = R * 1.5 / cols, ix = -R * 0.75, iy = -R * 0.12, sk = Math.floor(lt * 10);
    glowBg(c, R, col, 0.22); c.save(); c.globalAlpha *= fade;
    c.fillStyle = "rgba(255,255,255,.1)"; rrect(c, -R * 0.95, -R * 0.95, R * 1.9, R * 0.5, R * 0.14); c.fill(); c.strokeStyle = rgba(col, 0.8); c.lineWidth = R * 0.025; c.stroke();
    txt(c, S.slice(0, n) + (sin(lt * 8) > 0 ? "|" : ""), -R * 0.82, -R * 0.7, R * 0.19, "#fff", 700, "left", MONO);
    const ay = -R * 0.34 + sin(lt * 4) * R * 0.02; c.strokeStyle = rgba(col, 0.9); c.lineWidth = R * 0.05; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(0, ay - R * 0.06); c.lineTo(0, ay + R * 0.1); c.moveTo(-R * 0.08, ay + R * 0.03); c.lineTo(0, ay + R * 0.11); c.lineTo(R * 0.08, ay + R * 0.03); c.stroke();
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const tg = sceneRGB((i + 0.5) / cols, (j + 0.5) / rows, top, rows / cols), r = lerp(tg[0], rnd(i * 17.3 + j * 31.7 + sk * 5.1) * 255, nz), g = lerp(tg[1], rnd(i * 13.1 + j * 7.7 + sk * 3.3) * 255, nz), b = lerp(tg[2], rnd(i * 5.9 + j * 23.3 + sk * 9.7) * 255, nz);
      c.fillStyle = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")"; c.fillRect(ix + i * cs, iy + j * cs, cs + 0.5, cs + 0.5);
    }
    c.strokeStyle = col; c.lineWidth = R * 0.035; rrect(c, ix, iy, cols * cs, rows * cs, R * 0.04); c.stroke();
    if (u > 0.82) { spark(c, ix + cols * cs, iy, R * 0.14 * Math.abs(sin(lt * 5)), 0.95, "#ffffff"); spark(c, ix, iy + rows * cs, R * 0.1 * Math.abs(sin(lt * 4 + 1)), 0.9, "#ffffff"); }
    c.restore();
  }

  function aTrain(c, R, lt, pal) {
    const col = pal[1], per = 6.5, u = (lt % per) / per, p = clamp(u / 0.82), fade = u > 0.93 ? (1 - u) / 0.07 : 1, W = R * 1.8, H = R * 1.0, x0 = -W / 2, y0 = -R * 0.55, N = 60, L = e => 0.08 + 0.9 * Math.exp(-e * 3.6) + 0.05 * sin(e * 60) * Math.exp(-e * 2.5), Yf = e => Math.max(y0, y0 + H - L(e) * H * 0.95);
    glowBg(c, R, col, 0.22); c.save(); c.globalAlpha *= fade;
    c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = R * 0.015; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x0, y0 + H * k / 4); c.lineTo(x0 + W, y0 + H * k / 4); c.stroke(); }
    c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 + H); c.lineTo(x0 + W, y0 + H); c.stroke();
    const ag = c.createLinearGradient(0, y0, 0, y0 + H); ag.addColorStop(0, rgba(col, 0.35)); ag.addColorStop(1, rgba(col, 0)); c.fillStyle = ag; c.beginPath(); c.moveTo(x0, y0 + H); for (let k = 0; k <= N; k++) { const e = p * k / N; c.lineTo(x0 + e * W, Yf(e)); } c.lineTo(x0 + p * W, y0 + H); c.closePath(); c.fill();
    c.save(); c.shadowColor = col; c.shadowBlur = R * 0.12; c.strokeStyle = col; c.lineWidth = R * 0.055; c.lineCap = c.lineJoin = "round"; c.beginPath(); for (let k = 0; k <= N; k++) { const e = p * k / N, x = x0 + e * W, y = Yf(e); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x0 + p * W, Yf(p), R * 0.07, 0, TAU); c.fill();
    txt(c, "epoch " + Math.round(p * 50) + "/50", x0, y0 - R * 0.2, R * 0.16, "#fff", 800, "left", MONO); txt(c, "loss " + L(p).toFixed(3), x0 + W, y0 - R * 0.2, R * 0.16, col, 800, "right", MONO);
    const by = y0 + H + R * 0.22, acc = clamp(1 - L(p) + 0.02, 0, 0.99); c.fillStyle = "rgba(255,255,255,.15)"; rrect(c, x0, by, W, R * 0.12, R * 0.06); c.fill(); c.fillStyle = GREEN; rrect(c, x0, by, Math.max(R * 0.12, W * acc), R * 0.12, R * 0.06); c.fill(); txt(c, "acc " + (acc * 100).toFixed(1) + "%", x0 + W, by + R * 0.3, R * 0.14, GREEN, 800, "right", MONO);
    c.restore();
  }

  function aTokens(c, R, lt, pal) {
    const col = pal[1], TK = ["The", "cat", "sat", "on", "the", "mat"], px = R * 0.17, wd = TK.map(s => s.length * px * 0.62 + px), gp = R * 0.1, tot = wd.reduce((a, b) => a + b, 0) + gp * 5, sc = Math.min(1, R * 1.95 / tot), step = Math.floor(lt * 0.9), q = step % 6, ty = R * 0.3, ch = px * 1.5;
    glowBg(c, R, col, 0.22); const cx = [], xs = []; let acc = -tot * sc / 2; for (let k = 0; k < 6; k++) { xs.push(acc); cx.push(acc + wd[k] * sc / 2); acc += (wd[k] + gp) * sc; }
    const ws = TK.map((s, j) => j === q ? 0 : Math.pow(rnd(q * 7.3 + j * 1.9 + 3), 2) + 0.05), mx = Math.max.apply(null, ws);
    c.lineCap = "round";
    for (let j = 0; j < 6; j++) { if (j === q) continue; const a = ws[j] / mx; c.strokeStyle = rgba(col, 0.2 + 0.7 * a); c.lineWidth = R * (0.015 + 0.07 * a); c.beginPath(); c.moveTo(cx[q], ty - ch / 2); c.quadraticCurveTo((cx[q] + cx[j]) / 2, ty - ch / 2 - R * (0.3 + 0.9 * Math.abs(q - j) / 5), cx[j], ty - ch / 2); c.stroke(); }
    for (let k = 0; k < 6; k++) {
      const w2 = wd[k] * sc; c.fillStyle = k === q ? col : "rgba(255,255,255,.12)"; c.strokeStyle = k === q ? "#fff" : rgba(col, 0.6); c.lineWidth = R * 0.025; rrect(c, xs[k], ty - ch / 2, w2, ch, ch * 0.3); c.fill(); c.stroke(); txt(c, TK[k], cx[k], ty, px * sc, k === q ? "#04122a" : "#fff", 800, "center", MONO);
      for (let b = 0; b < 5; b++) { const hh = R * (0.06 + 0.2 * Math.abs(sin(lt * 1.5 + k * 1.3 + b * 0.9))); c.fillStyle = rgba(k === q ? "#ffffff" : VIOLET, 0.85); c.fillRect(cx[k] + (b - 2) * px * 0.3 * sc - px * 0.09 * sc, ty + ch / 2 + R * 0.08, px * 0.18 * sc, hh); }
    }
    txt(c, "self-attention", 0, -R * 0.95, R * 0.2, col, 900, "center", MONO); txt(c, "embeddings", 0, ty + ch / 2 + R * 0.5, R * 0.14, "rgba(255,255,255,.65)", 700, "center", MONO);
  }

  function aVision(c, R, lt, pal) {
    const col = pal[1], W = R * 1.8, H = R * 1.35, x0 = -W / 2, y0 = -H / 2 - R * 0.05, per = 5, u = (lt % per) / per, sy = y0 + clamp(u / 0.8) * H;
    const O = [{ x: -0.55, y: -0.1, k: 0, r: 0.2, lb: "ball 0.98", cl: AMBER }, { x: 0.05, y: 0.22, k: 1, r: 0.2, lb: "box 0.94", cl: PINK }, { x: 0.55, y: -0.22, k: 2, r: 0.22, lb: "cone 0.91", cl: CYAN }];
    glowBg(c, R, col, 0.22); c.save(); rrect(c, x0, y0, W, H, R * 0.08); c.clip();
    const bg = c.createLinearGradient(0, y0, 0, y0 + H); bg.addColorStop(0, "#0b1430"); bg.addColorStop(1, "#1a2a5a"); c.fillStyle = bg; c.fillRect(x0, y0, W, H); c.fillStyle = "rgba(255,255,255,.06)"; c.fillRect(x0, y0 + H * 0.68, W, H * 0.32);
    O.forEach(o => { c.fillStyle = o.cl; c.beginPath(); const x = o.x * R, y = o.y * R, r = o.r * R; if (o.k === 0) c.arc(x, y, r, 0, TAU); else if (o.k === 1) c.rect(x - r, y - r, r * 2, r * 2); else { c.moveTo(x, y - r); c.lineTo(x + r, y + r); c.lineTo(x - r, y + r); c.closePath(); } c.fill(); });
    if (u < 0.85) { const sg = c.createLinearGradient(0, sy - R * 0.15, 0, sy + R * 0.15); sg.addColorStop(0, rgba(GREEN, 0)); sg.addColorStop(0.5, rgba(GREEN, 0.5)); sg.addColorStop(1, rgba(GREEN, 0)); c.fillStyle = sg; c.fillRect(x0, sy - R * 0.15, W, R * 0.3); }
    c.restore();
    O.forEach(o => {
      const a = clamp((sy - (o.y - o.r) * R) / (R * 0.2)); if (a <= 0) return; const x = o.x * R, y = o.y * R, b = o.r * R * 1.35, L = b * 0.5;
      c.strokeStyle = rgba(GREEN, a); c.lineWidth = R * 0.04; c.lineCap = "round"; c.beginPath(); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => { c.moveTo(x + q[0] * b, y + q[1] * b - q[1] * L); c.lineTo(x + q[0] * b, y + q[1] * b); c.lineTo(x + q[0] * b - q[0] * L, y + q[1] * b); }); c.stroke();
      const wd = o.lb.length * R * 0.075 + R * 0.12; c.fillStyle = rgba(GREEN, a); rrect(c, x - b, y - b - R * 0.2, wd, R * 0.17, R * 0.04); c.fill(); txt(c, o.lb, x - b + R * 0.06, y - b - R * 0.115, R * 0.12, rgba("#04210f", a), 800, "left", MONO);
    });
    c.strokeStyle = col; c.lineWidth = R * 0.035; rrect(c, x0, y0, W, H, R * 0.08); c.stroke();
    txt(c, u < 0.85 ? "scanning..." : "3 objects found", 0, y0 + H + R * 0.2, R * 0.16, u < 0.85 ? "rgba(255,255,255,.7)" : GREEN, 800, "center", MONO);
  }

  function aVoice(c, R, lt, pal) {
    const col = pal[1], per = 5.5, u = (lt % per) / per, fade = u > 0.94 ? (1 - u) / 0.06 : 1, r0 = R * 0.34, S = "Привет! Чем помочь?", n = Math.floor(S.length * clamp((u - 0.2) / 0.5));
    glowBg(c, R, col, 0.3); c.save(); c.globalAlpha *= fade;
    for (let k = 0; k < 3; k++) { const age = (lt * 0.7 + k / 3) % 1; c.strokeStyle = rgba(col, (1 - age) * 0.5); c.lineWidth = R * 0.03; c.beginPath(); c.arc(0, 0, r0 * (1.3 + age * 1.6), 0, TAU); c.stroke(); }
    c.lineCap = "round"; c.lineWidth = R * 0.05; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU - PI / 2, amp = 0.25 + 0.75 * Math.abs(sin(lt * 5 + i * 0.7) * sin(lt * 2.3 + i * 0.31)), r1 = R * 0.58, r2 = r1 + R * 0.35 * amp; c.strokeStyle = i % 2 ? col : VIOLET; c.beginPath(); c.moveTo(cos(a) * r1, sin(a) * r1); c.lineTo(cos(a) * r2, sin(a) * r2); c.stroke(); }
    const g = c.createLinearGradient(0, -r0, 0, r0); g.addColorStop(0, mixc(col, "#ffffff", 0.3)); g.addColorStop(1, mixc(VIOLET, "#000000", 0.2)); c.save(); c.shadowColor = col; c.shadowBlur = R * 0.25; c.fillStyle = g; c.beginPath(); c.arc(0, 0, r0, 0, TAU); c.fill(); c.restore();
    c.fillStyle = "#fff"; rrect(c, -R * 0.07, -R * 0.19, R * 0.14, R * 0.26, R * 0.07); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = R * 0.035; c.beginPath(); c.arc(0, -R * 0.02, R * 0.14, 0, PI); c.moveTo(0, R * 0.12); c.lineTo(0, R * 0.2); c.moveTo(-R * 0.07, R * 0.2); c.lineTo(R * 0.07, R * 0.2); c.stroke();
    txt(c, u < 0.2 ? "Слушаю" + ".".repeat(1 + Math.floor(lt * 3) % 3) : S.slice(0, n), 0, R * 1.18, R * 0.15, "#fff", 800);
    c.restore();
  }

  function aGpu(c, R, lt, pal) {
    const col = pal[1], W = R * 1.9, H = R * 0.95, x0 = -W / 2, y0 = -H / 2 - R * 0.05, util = 0.75 + 0.2 * sin(lt * 1.3);
    glowBg(c, R, col, 0.28);
    txt(c, "GPU " + Math.round(util * 100) + "%", x0, y0 - R * 0.3, R * 0.17, col, 900, "left", MONO); c.fillStyle = "rgba(255,255,255,.15)"; rrect(c, x0 + R * 0.62, y0 - R * 0.36, W - R * 0.62, R * 0.12, R * 0.06); c.fill(); c.fillStyle = col; rrect(c, x0 + R * 0.62, y0 - R * 0.36, (W - R * 0.62) * util, R * 0.12, R * 0.06); c.fill();
    c.fillStyle = "#e2b94a"; c.fillRect(x0 + W * 0.1, y0 + H, W * 0.52, R * 0.11); c.fillStyle = "#0b1424"; for (let k = 0; k < 14; k++) c.fillRect(x0 + W * 0.1 + R * 0.06 + k * W * 0.52 / 14, y0 + H, R * 0.02, R * 0.07);
    const g = c.createLinearGradient(0, y0, 0, y0 + H); g.addColorStop(0, "#2a3342"); g.addColorStop(1, "#0f1520"); c.fillStyle = g; rrect(c, x0, y0, W, H, R * 0.1); c.fill(); c.strokeStyle = rgba(col, 0.7); c.lineWidth = R * 0.025; c.stroke();
    [-1, 1].forEach(sg => {
      const fx = sg * R * 0.51, fy = y0 + H / 2 - R * 0.02, fr = R * 0.36; c.fillStyle = "#05080f"; c.beginPath(); c.arc(fx, fy, fr * 1.05, 0, TAU); c.fill(); c.strokeStyle = "#8a96a8"; c.lineWidth = R * 0.02; c.stroke();
      for (let k = 0; k < 9; k++) { c.save(); c.translate(fx, fy); c.rotate(lt * 12 * sg + k * TAU / 9); c.fillStyle = "rgba(170,182,196,.9)"; c.beginPath(); c.moveTo(fr * 0.12, 0); c.quadraticCurveTo(fr * 0.5, -fr * 0.45, fr * 0.88, -fr * 0.12); c.quadraticCurveTo(fr * 0.6, -fr * 0.02, fr * 0.12, fr * 0.08); c.closePath(); c.fill(); c.restore(); }
      c.fillStyle = col; c.beginPath(); c.arc(fx, fy, fr * 0.14, 0, TAU); c.fill();
    });
    txt(c, "AI", 0, y0 + H * 0.45, R * 0.2, "#fff", 900, "center", MONO);
    c.fillStyle = rgba(col, 0.6 + 0.4 * sin(lt * 3)); rrect(c, x0 + W * 0.05, y0 + H * 0.88, W * 0.9, H * 0.04, H * 0.02); c.fill();
  }

  /* ==========================================================
     3. ИКОНКИ (10): контуры 24×24
     ========================================================== */
  const ICONS = {
    n_network: ["Нейросеть", "M7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M7 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M21 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M7 5l3 3 M7 5l3 11 M7 12l3-4 M7 12l3 4 M7 19l3-11 M7 19l3-3 M14 8l3 4 M14 16l3-4"],
    n_brain: ["Мозг ИИ", "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18z M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4 M17.599 6.5a3 3 0 0 0 .399-1.375 M6.003 5.125A3 3 0 0 0 6.401 6.5 M3.477 10.896a4 4 0 0 1 .585-.396 M19.938 10.5a4 4 0 0 1 .585.396 M6 18a4 4 0 0 1-1.967-.516 M19.967 17.484A4 4 0 0 1 18 18"],
    n_chip: ["Нейрочип", "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M12 9.5v5 M9.5 12h5 M15 2v2 M15 20v2 M2 15h2 M2 9h2 M20 15h2 M20 9h2 M9 2v2 M9 20v2"],
    n_sparkles: ["Генерация", "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3"],
    n_chat: ["Чат-бот", "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 10h.01 M12 10h.01 M16 10h.01"],
    n_image: ["Генерация картинок", "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M11 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"],
    n_voice: ["Голосовой ИИ", "M2 10v3 M6 6v11 M10 3v18 M14 8v7 M18 5v13 M22 10v3"],
    n_eye: ["Компьютерное зрение", "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
    n_loss: ["Обучение модели", "M22 17l-8.5-8.5-5 5L2 7 M16 17h6v-6"],
    n_layers: ["Слои сети", "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"]
  };

  /* ==========================================================
     4. 3D-МОДЕЛИ (10), Three.js r128, без внешних файлов
     ========================================================== */
  const MCC = {};
  function mcap(base, o) {
    const key = base + JSON.stringify(o || {}); if (MCC[key]) return MCC[key]; o = o || {};
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
  function roundedRect(w, h, r) { const T = THREE, s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  const rbox = (w, h, d, r, mat, bev) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev || 0.05, bevelSize: bev || 0.05, bevelSegments: 4, curveSegments: 10 }), mat); m.geometry.center(); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function canvasTex(w, h, fn) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const x = cv.getContext("2d"); fn(x, w, h); const tex = new THREE.CanvasTexture(cv); return { tex, cv, x }; }
  const radialTex = (col) => canvasTex(256, 256, (x, w, h) => { const g = x.createRadialGradient(128, 128, 10, 128, 128, 128); g.addColorStop(0, rgba(col, 0.9)); g.addColorStop(1, rgba(col, 0)); x.fillStyle = g; x.fillRect(0, 0, w, h); });

  const M3 = {};
  M3.n3_brain = pal => {
    const R = rig(pal), T = R.T, bm = MC("#ff8fb8", { gloss: 0.5, hi: "#ffffff", dark: "#4a0a30" }), cm = MC("#b78bff", { gloss: 0.5, hi: "#ffffff", dark: "#20084a" });
    const fold = (x, y, z, s) => 1 + 0.07 * sin(6.5 * x + s) * sin(5.5 * y + 1.7 * s) * sin(6 * z - s) + 0.035 * sin(13 * x + 7 * z + s * 2);
    const hemi = sx => { const g = new T.SphereGeometry(1, 64, 48), p = g.attributes.position, v = new T.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); const f = fold(v.x * sx, v.y, v.z, 0.3); p.setXYZ(i, v.x * f * 0.78, v.y * f * 0.92, v.z * f * 1.28); } g.computeVertexNormals(); return g; };
    const L = new T.Mesh(hemi(-1), bm), Rm = new T.Mesh(hemi(1), bm); L.position.x = -0.74; Rm.position.x = 0.74; R.model.add(L, Rm);
    const cb = new T.Mesh(new T.SphereGeometry(0.55, 32, 24), cm); cb.scale.set(1.3, 0.8, 1); cb.position.set(0, -0.75, -0.95); R.model.add(cb);
    const st = new T.Mesh(new T.CylinderGeometry(0.2, 0.14, 0.9, 16), cm); st.position.set(0, -1.1, -0.2); st.rotation.x = 0.3; R.model.add(st);
    const nodes = [], nm = new T.MeshBasicMaterial({ color: new T.Color(pal[1]) });
    for (let i = 0; i < 26; i++) {
      const sx = i % 2 ? 1 : -1, th = rnd(i * 3.1) * TAU, ph = Math.acos(clamp(0.2 + rnd(i * 5.3 + 1) * 0.8)), d = V(sin(ph) * cos(th), cos(ph), sin(ph) * sin(th)), f = fold(d.x * sx, d.y, d.z, 0.3);
      const m = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), nm); m.position.set(d.x * f * 0.78 * 1.05 + sx * 0.74, d.y * f * 0.92 * 1.05, d.z * f * 1.28 * 1.05); R.model.add(m); nodes.push(m);
    }
    const curves = [], pulses = [], lm = new T.LineBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.5 });
    for (let k = 0; k < 14; k++) { const a = nodes[Math.floor(rnd(k * 7.7) * nodes.length)].position, b = nodes[Math.floor(rnd(k * 9.1 + 1) * nodes.length)].position, mid = a.clone().add(b).multiplyScalar(0.5); mid.multiplyScalar(1.3); const cu = new T.QuadraticBezierCurve3(a.clone(), mid, b.clone()); R.model.add(new T.Line(new T.BufferGeometry().setFromPoints(cu.getPoints(24)), lm)); curves.push(cu); const p = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff })); R.model.add(p); pulses.push(p); }
    R.fit(4.2);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.5; R.root.rotation.x = 0.2; nodes.forEach((m, i) => m.scale.setScalar(1 + 0.6 * Math.max(0, sin(lt * 3 + i)))); pulses.forEach((p, k) => p.position.copy(curves[k].getPoint((lt * 0.5 + k * 0.17) % 1))); } };
  };

  M3.n3_network = pal => {
    const R = rig(pal), T = R.T, LY = [3, 5, 5, 3], XS = [-3, -1, 1, 3], nm = MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#00061a" }), P = [], nodes = [], pos = [];
    LY.forEach((n, l) => { const arr = []; for (let i = 0; i < n; i++) { const m = new T.Mesh(new T.SphereGeometry(0.22, 20, 16), nm); m.position.set(XS[l], (i - (n - 1) / 2) * 0.95, (rnd(l * 9 + i) - 0.5) * 0.8); R.model.add(m); nodes.push({ m, l, i }); arr.push(m.position); } P.push(arr); });
    for (let l = 0; l < 3; l++) for (let i = 0; i < LY[l]; i++) for (let j = 0; j < LY[l + 1]; j++) { const a = P[l][i], b = P[l + 1][j]; pos.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); R.model.add(new T.LineSegments(g, new T.LineBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.28 })));
    const pulses = []; for (let l = 0; l < 3; l++) for (let k = 0; k < 8; k++) { const a = P[l][Math.floor(rnd(l * 40 + k) * LY[l])], b = P[l + 1][Math.floor(rnd(l * 40 + k + 0.5) * LY[l + 1])], m = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff })); R.model.add(m); pulses.push({ a, b, l, m, k }); }
    R.fit(5.5);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.5) * 0.6; R.root.rotation.x = 0.15; pulses.forEach(o => { const u = (((lt * 0.6 - o.l * 0.33 + o.k * 0.07) % 1) + 1) % 1; o.m.position.lerpVectors(o.a, o.b, u); o.m.scale.setScalar(Math.max(0.01, sin(PI * u))); }); nodes.forEach(o => o.m.scale.setScalar(1 + 0.4 * Math.max(0, sin(lt * 2 - o.l * 1.1 + o.i)))); } };
  };

  M3.n3_neuron = pal => {
    const R = rig(pal), T = R.T, sm = MC("#ff7aa8", { gloss: 0.8, hi: "#ffffff", dark: "#40081e" }), dm = MC("#b78bff", { gloss: 0.7, hi: "#ffffff", dark: "#10063a" }), am = MC("#ffd27a", { gloss: 0.9, hi: "#ffffff", dark: "#4a2a00" }), my = MC("#eaf4ff", { gloss: 0.8, hi: "#ffffff", dark: "#5a7aaa" });
    const seg = (a, b, r, mat) => { const d = b.clone().sub(a), L = d.length(), m = new T.Mesh(new T.CylinderGeometry(r * 0.7, r, L, 10), mat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); return m; };
    const soma = new T.Mesh(new T.SphereGeometry(0.7, 40, 30), sm); R.model.add(soma);
    const branch = (o, d, len, r, depth, seed) => { const e = o.clone().add(d.clone().multiplyScalar(len)); R.model.add(seg(o, e, r, dm)); const s = new T.Mesh(new T.SphereGeometry(r * 0.75, 8, 6), dm); s.position.copy(e); R.model.add(s); if (depth > 0) for (let k = 0; k < 2; k++) { const nd = d.clone().add(V((rnd(seed + k * 3.1) - 0.5) * 1.3, (rnd(seed + k * 5.7 + 1) - 0.5) * 1.3, (rnd(seed + k * 7.3 + 2) - 0.5) * 1.3)).normalize(); branch(e, nd, len * 0.7, r * 0.7, depth - 1, seed * 1.7 + k * 11); } };
    for (let i = 0; i < 7; i++) { const d = V(-1, (rnd(i * 3.3) - 0.5) * 1.6, (rnd(i * 5.1 + 1) - 0.5) * 1.6).normalize(); branch(d.clone().multiplyScalar(0.6), d, 1.0, 0.12, 2, i * 13.7 + 1); }
    R.model.add(seg(V(0.6, 0, 0), V(4.4, 0, 0), 0.06, am));
    for (let i = 0; i < 5; i++) { const m = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.5, 20), my); m.rotation.z = PI / 2; m.position.set(1.3 + i * 0.65, 0, 0); R.model.add(m); }
    for (let k = 0; k < 4; k++) { const d = V(1, (k - 1.5) * 0.45, (rnd(k + 4) - 0.5) * 0.6).normalize(), o = V(4.4, 0, 0); R.model.add(seg(o, o.clone().add(d.clone().multiplyScalar(0.7)), 0.05, am)); const b = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), sm); b.position.copy(o).add(d.multiplyScalar(0.72)); R.model.add(b); }
    const pulse = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), new T.MeshBasicMaterial({ color: 0xffffff })), halo = new T.Mesh(new T.SphereGeometry(0.32, 16, 12), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.3 })); R.model.add(pulse, halo);
    R.fit(5.8);
    return { sc: R.sc, up: lt => { const u = (lt * 0.5) % 1, x = 0.7 + u * 3.7; pulse.position.set(x, 0, 0); halo.position.set(x, 0, 0); soma.scale.setScalar(1 + (u < 0.12 ? 0.12 * sin(u / 0.12 * PI) : 0)); R.root.rotation.y = sin(lt * 0.5) * 0.6; R.root.rotation.x = 0.2; } };
  };

  M3.n3_gpu = pal => {
    const R = rig(pal), T = R.T, dk = MC("#1b2029", { gloss: 0.7, hi: "#8a96a8", dark: "#000000" }), steel = MC("#aab6c4", { gloss: 0.9, dark: "#222c36" }), gold = MC("#e2b94a", { gloss: 1, hi: "#fff3c0", dark: "#4a2a00" }), acc = MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#00061a" }), fans = [];
    R.model.add(rbox(4.4, 1.9, 0.5, 0.12, dk, 0.04));
    for (let i = 0; i < 46; i++) { const f = new T.Mesh(new T.BoxGeometry(0.03, 0.1, 0.44), steel); f.position.set(-2.1 + i * 0.092, 1.0, 0); R.model.add(f); }
    [-1.4, 0, 1.4].forEach(x => {
      const rec = new T.Mesh(new T.CircleGeometry(0.68, 40), new T.MeshBasicMaterial({ color: 0x05080f })); rec.position.set(x, 0, 0.292); R.model.add(rec);
      const ring = new T.Mesh(new T.TorusGeometry(0.68, 0.04, 8, 40), steel); ring.position.set(x, 0, 0.3); R.model.add(ring);
      const fan = new T.Group(); fan.position.set(x, 0, 0.31);
      for (let k = 0; k < 9; k++) { const bp = new T.Group(); bp.rotation.z = k / 9 * TAU; const bl = new T.Mesh(new T.BoxGeometry(0.42, 0.2, 0.02), steel); bl.position.x = 0.36; bl.rotation.x = 0.55; bp.add(bl); fan.add(bp); }
      const hub = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.05, 20), acc); hub.rotation.x = PI / 2; fan.add(hub); R.model.add(fan); fans.push(fan);
    });
    const led = new T.Mesh(new T.BoxGeometry(4.2, 0.05, 0.04), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true })); led.position.set(0, -0.8, 0.29); R.model.add(led);
    const pc = new T.Mesh(new T.BoxGeometry(2.4, 0.26, 0.1), gold); pc.position.set(-0.6, -1.08, 0); R.model.add(pc);
    const br = rbox(0.12, 2.1, 0.7, 0.04, steel, 0.02); br.position.x = -2.28; R.model.add(br);
    const lb = canvasTex(512, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = pal[1]; x.font = "900 44px " + MONO; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("NEURO-X  AI", 8, 34); });
    const lm = new T.Mesh(new T.PlaneGeometry(1.8, 0.225), new T.MeshBasicMaterial({ map: lb.tex, transparent: true })); lm.position.set(-1.2, 0.82, 0.292); R.model.add(lm);
    R.fit(4.6);
    return { sc: R.sc, up: lt => { fans.forEach(f => { f.rotation.z = lt * 12; }); led.material.opacity = 0.6 + 0.4 * sin(lt * 3); R.root.rotation.y = -0.35 + sin(lt * 0.6) * 0.35; R.root.rotation.x = 0.15; } };
  };

  M3.n3_cube = pal => {
    const R = rig(pal), T = R.T, n = 4, cubes = [], c1 = new T.Color("#16224a"), c2 = new T.Color(pal[1]), c3 = new T.Color("#ff5c8a"), geo = new T.BoxGeometry(0.38, 0.38, 0.38);
    for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) { const m = new T.Mesh(geo, new T.MeshStandardMaterial({ color: c1.clone(), metalness: 0.3, roughness: 0.35, emissive: c1.clone() })); m.position.set((x - 1.5) * 0.55, (y - 1.5) * 0.55, (z - 1.5) * 0.55); R.model.add(m); cubes.push({ m, d: x + y * 0.5 + z * 0.8 }); }
    R.model.add(new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.4, 2.4, 2.4)), new T.LineBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.45 })));
    const sl = new T.Mesh(new T.PlaneGeometry(2.4, 2.4), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.15, side: T.DoubleSide })); sl.rotation.y = PI / 2; R.model.add(sl);
    R.fit(3.8);
    return { sc: R.sc, up: lt => { cubes.forEach(o => { const v = 0.5 + 0.5 * sin(lt * 2.2 - o.d * 1.1); o.m.material.color.copy(c1).lerp(v > 0.8 ? c3 : c2, v); o.m.material.emissive.copy(o.m.material.color).multiplyScalar(0.45); o.m.scale.setScalar(0.65 + 0.35 * v); }); sl.position.x = sin(lt * 1.2) * 1.2; R.root.rotation.y = lt * 0.5; R.root.rotation.x = 0.5; } };
  };

  M3.n3_chat = pal => {
    const R = rig(pal), T = R.T, am = MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#00061a" }), vm = MC("#8a6bff", { gloss: 1, hi: "#e0d8ff", dark: "#0a0030" }), gm = MC("#ffd27a", { gloss: 1, hi: "#ffffff", dark: "#4a2a00" });
    R.model.add(rbox(3.2, 2.0, 0.5, 0.5, am, 0.08));
    const ts = new T.Shape(); ts.moveTo(-1.2, -0.9); ts.lineTo(-1.9, -1.8); ts.lineTo(-0.2, -0.9); ts.closePath(); const tm = new T.Mesh(new T.ExtrudeGeometry(ts, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3 }), am); tm.position.z = -0.2; R.model.add(tm);
    const dots = []; for (let k = 0; k < 3; k++) { const d = new T.Mesh(new T.SphereGeometry(0.2, 20, 16), new T.MeshBasicMaterial({ color: 0xffffff })); d.position.set((k - 1) * 0.7, 0, 0.34); R.model.add(d); dots.push(d); }
    const back = rbox(2.0, 1.2, 0.4, 0.35, vm, 0.06); back.position.set(1.7, -1.1, -0.8); R.model.add(back);
    const star = () => { const s = new T.Shape(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 0.28 : 1, a = i * PI / 4 + PI / 2, x = cos(a) * r, y = sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); } s.closePath(); const g = new T.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2 }); g.center(); return g; };
    const stars = [[1.9, 1.35, 0.2, 0.35], [2.4, 0.7, 0.1, 0.25], [-2.0, 1.5, 0, 0.22]].map(q => { const m = new T.Mesh(star(), gm); m.position.set(q[0], q[1], q[2]); m.scale.setScalar(q[3]); R.model.add(m); return { m, s: q[3] }; });
    R.fit(4.4);
    return { sc: R.sc, up: lt => { dots.forEach((d, k) => { d.position.y = sin(lt * 6 - k * 0.8) * 0.18; }); stars.forEach((o, i) => { o.m.rotation.y = lt * 2 + i; o.m.scale.setScalar(o.s * (1 + 0.2 * sin(lt * 4 + i))); }); R.root.rotation.y = sin(lt * 0.7) * 0.7; R.pv.position.y = sin(lt * 1.6) * 0.06; } };
  };

  M3.n3_orb = pal => {
    const R = rig(pal), T = R.T;
    const tex = canvasTex(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mixc(pal[1], "#ffffff", 0.4)); g.addColorStop(0.5, pal[1]); g.addColorStop(1, "#8a6bff"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.lineWidth = 8; for (let k = 0; k < 14; k++) { x.strokeStyle = "rgba(255,255,255," + (0.1 + 0.2 * rnd(k)) + ")"; x.beginPath(); for (let i = 0; i <= 64; i++) { const px = i / 64 * w, py = h * (k + 0.5) / 14 + sin(i * 0.4 + k * 1.7) * 14; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); } });
    tex.tex.wrapS = T.RepeatWrapping;
    const core = new T.Mesh(new T.SphereGeometry(1, 48, 36), new T.MeshBasicMaterial({ map: tex.tex })); R.model.add(core);
    const wire = new T.Mesh(new T.SphereGeometry(1.18, 24, 18), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), wireframe: true, transparent: true, opacity: 0.25 })); R.model.add(wire);
    const rings = [[1.6, 0.5, 0.2, 0.9], [2.0, 1.2, -0.4, -0.6], [2.4, -0.3, 0.9, 0.4]].map((q, i) => { const g = new T.Group(); g.rotation.set(q[1], q[2], 0); const r = new T.Mesh(new T.TorusGeometry(q[0], 0.02, 8, 80), new T.MeshBasicMaterial({ color: new T.Color(i === 1 ? "#ff5c8a" : pal[1]), transparent: true, opacity: 0.7 })); g.add(r); const p = new T.Mesh(new T.SphereGeometry(0.09, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff })); p.position.x = q[0]; g.add(p); R.model.add(g); return { g, sp: q[3] }; });
    R.fit(4.4);
    const ht = radialTex(pal[1]), halo = new T.Sprite(new T.SpriteMaterial({ map: ht.tex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.7 })); halo.scale.set(5, 5, 1); R.root.add(halo);
    return { sc: R.sc, up: lt => { tex.tex.offset.x = lt * 0.1; const s = 1 + 0.04 * sin(lt * 3); core.scale.setScalar(s); wire.rotation.y = lt * 0.4; wire.rotation.x = lt * 0.2; rings.forEach(o => { o.g.children[0].rotation.z = 0; o.g.rotation.z = lt * o.sp; }); R.root.rotation.y = lt * 0.2; halo.material.opacity = 0.55 + 0.2 * sin(lt * 2); } };
  };

  M3.n3_layers = pal => {
    const R = rig(pal), T = R.T, SZ = [3.4, 2.8, 2.2, 1.6], Z = [-1.8, -0.6, 0.6, 1.8], cl = [pal[1], "#8a6bff", "#ff5c8a", "#19d37a"];
    SZ.forEach((s, l) => {
      const tx = canvasTex(128, 128, (x, w, h) => { x.fillStyle = "#0a1226"; x.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const v = rnd(l * 300 + i * 17 + j * 5.3); x.fillStyle = rgba(cl[l], 0.08 + 0.7 * v * v); x.fillRect(i * 8 + 1, j * 8 + 1, 6, 6); } });
      tx.tex.magFilter = T.NearestFilter;
      const m = new T.Mesh(new T.PlaneGeometry(s, s), new T.MeshBasicMaterial({ map: tx.tex, transparent: true, opacity: 0.88, side: T.DoubleSide })); m.position.z = Z[l]; R.model.add(m);
      const e = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(s, s)), new T.LineBasicMaterial({ color: new T.Color(cl[l]) })); e.position.z = Z[l]; R.model.add(e);
    });
    const kern = new T.Mesh(new T.PlaneGeometry(0.5, 0.5), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, side: T.DoubleSide })); kern.position.z = Z[0] + 0.01; R.model.add(kern);
    const hl = [1, 2, 3].map(l => { const m = new T.Mesh(new T.PlaneGeometry(0.3 * SZ[l] / SZ[1], 0.3 * SZ[l] / SZ[1]), new T.MeshBasicMaterial({ color: new T.Color(cl[l]), transparent: true, opacity: 0.9, side: T.DoubleSide })); m.position.z = Z[l] + 0.01; R.model.add(m); return m; });
    const lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(24), 3)); const lines = new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })); lines.frustumCulled = false; R.model.add(lines);
    R.fit(4.6);
    return { sc: R.sc, up: lt => {
      const idx = Math.floor((lt * 3) % 25), kx = ((idx % 5) - 2) * 0.55, ky = (2 - Math.floor(idx / 5)) * 0.55, tx = kx * SZ[1] / SZ[0], ty = ky * SZ[1] / SZ[0], a = lines.geometry.attributes.position.array, cs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      kern.position.set(kx, ky, Z[0] + 0.01); cs.forEach((q, i) => { a.set([kx + q[0] * 0.25, ky + q[1] * 0.25, Z[0], tx, ty, Z[1]], i * 6); }); lines.geometry.attributes.position.needsUpdate = true;
      hl.forEach((m, i) => m.position.set(kx * SZ[i + 1] / SZ[0], ky * SZ[i + 1] / SZ[0], Z[i + 1] + 0.01));
      R.root.rotation.y = -0.8 + sin(lt * 0.5) * 0.2; R.root.rotation.x = 0.3; } };
  };

  M3.n3_eye = pal => {
    const R = rig(pal), T = R.T, eye = new T.Group(); R.model.add(eye);
    eye.add(new T.Mesh(new T.SphereGeometry(1.3, 48, 36), MC("#f4f7fb", { gloss: 0.9, hi: "#ffffff", dark: "#7a8aa8" })));
    const it = canvasTex(256, 256, (x, w, h) => {
      x.clearRect(0, 0, w, h); const g = x.createRadialGradient(128, 128, 20, 128, 128, 126); g.addColorStop(0, mixc(pal[1], "#ffffff", 0.45)); g.addColorStop(0.6, pal[1]); g.addColorStop(1, mixc(pal[1], "#000000", 0.7)); x.fillStyle = g; x.beginPath(); x.arc(128, 128, 126, 0, TAU); x.fill();
      x.lineWidth = 2; for (let k = 0; k < 70; k++) { const a = k / 70 * TAU; x.strokeStyle = "rgba(255,255,255," + (0.1 + 0.25 * rnd(k)) + ")"; x.beginPath(); x.moveTo(128 + cos(a) * 40, 128 + sin(a) * 40); x.lineTo(128 + cos(a + 0.05) * 118, 128 + sin(a + 0.05) * 118); x.stroke(); }
      x.fillStyle = "#02040a"; x.beginPath(); x.arc(128, 128, 38, 0, TAU); x.fill(); x.strokeStyle = "rgba(0,0,0,.8)"; x.lineWidth = 8; x.beginPath(); x.arc(128, 128, 122, 0, TAU); x.stroke();
    });
    const ig = new T.CircleGeometry(0.8, 64), ip = ig.attributes.position; for (let i = 0; i < ip.count; i++) { const x = ip.getX(i), y = ip.getY(i); ip.setZ(i, Math.sqrt(1.31 * 1.31 - x * x - y * y)); } ig.computeVertexNormals();
    eye.add(new T.Mesh(ig, new T.MeshBasicMaterial({ map: it.tex, transparent: true })));
    const sp = new T.Mesh(new T.SphereGeometry(0.1, 12, 10), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })); sp.position.set(0.35, 0.4, 1.25); eye.add(sp);
    const hud = new T.Group(), hm = new T.MeshBasicMaterial({ color: new T.Color(pal[1]) }); R.model.add(hud);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(q => { const a = new T.Mesh(new T.BoxGeometry(0.6, 0.06, 0.02), hm), b = new T.Mesh(new T.BoxGeometry(0.06, 0.6, 0.02), hm); a.position.set(q[0] * 1.9 - q[0] * 0.27, q[1] * 1.9, 1.5); b.position.set(q[0] * 1.9, q[1] * 1.9 - q[1] * 0.27, 1.5); hud.add(a, b); });
    const scan = new T.Mesh(new T.PlaneGeometry(3.8, 0.05), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.6 })); scan.position.z = 1.5; hud.add(scan);
    const ring = new T.Mesh(new T.TorusGeometry(1.65, 0.015, 8, 80), new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.6 })); ring.position.z = 1.4; hud.add(ring);
    R.fit(4.2);
    return { sc: R.sc, up: lt => { eye.rotation.y = sin(lt * 0.9) * 0.5; eye.rotation.x = sin(lt * 0.7 + 1) * 0.3; scan.position.y = sin(lt * 1.6) * 1.85; ring.rotation.z = lt * 0.5; R.root.rotation.y = sin(lt * 0.4) * 0.3; } };
  };

  M3.n3_wave = pal => {
    const R = rig(pal), T = R.T, n = 11, bars = [], c1 = new T.Color(pal[1]), c2 = new T.Color("#ff5c8a"), geo = new T.BoxGeometry(0.3, 1, 0.3);
    const base = rbox(4.4, 4.4, 0.12, 0.2, MC("#1b2029", { gloss: 0.7, dark: "#000000" }), 0.03); base.rotation.x = -PI / 2; base.position.y = -0.1; R.model.add(base);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const m = new T.Mesh(geo, new T.MeshStandardMaterial({ color: c1.clone(), metalness: 0.2, roughness: 0.35, emissive: c1.clone().multiplyScalar(0.3) })); m.position.set((i - 5) * 0.38, 0.5, (j - 5) * 0.38); R.model.add(m); bars.push({ m, d: Math.hypot(i - 5, j - 5) }); }
    R.fit(4.6);
    return { sc: R.sc, up: lt => { bars.forEach(o => { const v = 0.5 + 0.5 * sin(o.d * 1.1 - lt * 3.2), h = 0.15 + v * 2.2; o.m.scale.y = h; o.m.position.y = h / 2; o.m.material.color.copy(c1).lerp(c2, v); o.m.material.emissive.copy(o.m.material.color).multiplyScalar(0.35); }); R.root.rotation.y = lt * 0.4; R.root.rotation.x = 0.5; } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ
     ========================================================== */
  const bgFns = { nn_layers: bgDeep, nn_tokens: bgTokens, nn_attention: bgAttention, nn_latent: bgLatent, nn_gradient: bgGradient, nn_diffusion: bgDiffusion, nn_matrix: bgMatrix, nn_detect: bgDetect, nn_voice: bgVoice, nn_synapse: bgSynapse };
  const shapeFns = { ns_perceptron: aPercep, ns_network: aNet, ns_brain: aBrain, ns_chat: aChat, ns_prompt: aPrompt, ns_training: aTrain, ns_tokens: aTokens, ns_vision: aVision, ns_voice: aVoice, ns_gpu: aGpu };
  const names = {
    nn_layers: "Глубокая сеть", nn_tokens: "Поток токенов", nn_attention: "Карта внимания", nn_latent: "Латентное пространство", nn_gradient: "Градиентный спуск", nn_diffusion: "Диффузия из шума", nn_matrix: "Тензорные вычисления", nn_detect: "Распознавание объектов", nn_voice: "Голос и спектрограмма", nn_synapse: "Нейроны и синапсы",
    ns_perceptron: "Нейрон-перцептрон", ns_network: "Прямой и обратный проход", ns_brain: "Мозг ИИ", ns_chat: "Диалог с ИИ", ns_prompt: "Промпт в картинку", ns_training: "Обучение модели", ns_tokens: "Токены и внимание", ns_vision: "Компьютерное зрение", ns_voice: "Голосовой помощник", ns_gpu: "Видеокарта для ИИ",
    n3_brain: "Мозг 3D", n3_network: "Нейросеть 3D", n3_neuron: "Нейрон 3D", n3_gpu: "Видеокарта 3D", n3_cube: "Тензор 3D", n3_chat: "Чат-бот 3D", n3_orb: "ИИ-сфера 3D", n3_layers: "Свёрточные слои 3D", n3_eye: "Глаз ИИ 3D", n3_wave: "Звуковая волна 3D"
  };

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

  const DOMAIN = "Нейросети";
  try { if (typeof LIB_DOMAINS !== "undefined" && !LIB_DOMAINS.includes(DOMAIN)) LIB_DOMAINS.push(DOMAIN); } catch (e) {}
  function addCard(it) {
    it.domain = DOMAIN; LIB.push(it);
    if (typeof grid === "undefined") return;
    const b = document.createElement("button"); b.className = "card"; b.dataset.s = (it.cat + " " + it.name + " " + it.tags).toLowerCase();
    b.innerHTML = `<canvas width="320" height="180"></canvas><b>${it.name}</b><small>${it.domain}</small>`;
    it.cv = b.querySelector("canvas"); it.sc = it.mk(); it.el = b; b.onclick = () => it.act && it.act();
    grid.appendChild(b); if (typeof io !== "undefined") io.observe(b);
  }
  const scene = o => () => addScene(o);

  Object.keys(bgFns).forEach(id => {
    BG.push(id); BUSY.push(id); N[id] = names[id];
    addCard({ id, cat: "Фон", name: "Нейросети: " + names[id], tags: "нейросеть нейросети ии ai искусственный интеллект машинное обучение фон " + names[id], mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "whoosh" }], layers: [{ type: "text", fx: "words", text: "Искусственный *интеллект*", y: 0.5, size: 0.09 }] }) });
  });
  Object.keys(ICONS).forEach(id => {
    ICO[id] = ICONS[id][1]; ICN.push([id, ICONS[id][0]]);
    addCard({ id: "ico_" + id, cat: "Иконка", name: "Нейросети: " + ICONS[id][0], tags: "нейросеть нейросети ии ai иконка " + id + " " + ICONS[id][0], mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: 0.5, size: 0.4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "icon", name: id, y: 0.45, size: 0.4 }] }) });
  });
  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_" + id, cat: "Анимация", name: "Нейросети: " + names[id], tags: "нейросеть нейросети ии ai анимация " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: 0.5, y: 0.5, size: 0.48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "shape", shape: id, x: 0.5, y: 0.42, size: 0.8 }] }) });
  });
  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_" + id, cat: "3D", name: "Нейросети: " + names[id], tags: "нейросеть нейросети ии ai 3d три д " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: 0.5, y: 0.5, size: 0.52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: 0.1, id: "pop" }], layers: [{ type: "three", model: id, x: 0.5, y: 0.42, size: 0.85 }] }) });
  });
  try { if (typeof filt === "function") filt(); } catch (e) {}
  try { const sel = document.getElementById("catfilter"); if (sel && !Array.from(sel.options).some(o => o.value === DOMAIN)) { const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o); } } catch (e) {}

  const HINT = "ПАК НЕЙРОСЕТИ (используй для ИИ, нейросетей, машинного обучения, чат-ботов и ассистентов, генерации текста, картинок и голоса, компьютерного зрения, дата-центров и видеокарт): фоны nn_layers (глубокая сеть, ИИ вообще), nn_tokens (языковые модели, текст), nn_attention (трансформеры, внимание), nn_latent (эмбеддинги, данные), nn_gradient (обучение, оптимизация), nn_diffusion (генерация изображений), nn_matrix (вычисления, тензоры), nn_detect (распознавание, зрение), nn_voice (голос, аудио-ИИ), nn_synapse (мозг, нейроны). Анимации shape: ns_perceptron, ns_network, ns_brain, ns_chat, ns_prompt, ns_training, ns_tokens, ns_vision, ns_voice, ns_gpu. Иконки icon: n_network, n_brain, n_chip, n_sparkles, n_chat, n_image, n_voice, n_eye, n_loss, n_layers. 3D three.model: n3_brain, n3_network, n3_neuron, n3_gpu, n3_cube, n3_chat, n3_orb, n3_layers, n3_eye, n3_wave. Не называй конкретные бренды моделей, не обещай безошибочность ИИ и не утверждай, что ИИ заменит людей.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u, o) { try { if (o && typeof o.body === "string" && /\/director$/.test(String(u))) { const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n") + "\n" + (b.hint || ""); o.body = JSON.stringify(b); } } catch (e) {} return _f.apply(this, arguments); };
  }
  window.__hintPatch.push(HINT);
})();