/* ==========================================================
   MOTION STUDIO · ПАК «КРИПТОВАЛЮТА»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-crypto.js"></script>
   (после основного <script>, рядом с другими паками).
   Все изображения нарисованы кодом; логотипы брендов не используются.
   ========================================================== */
(function () {
  "use strict";
  if (window.__packCrypto) return;

  const need = ["BG", "ICO", "ICN", "N", "SHP", "TH3", "LIB", "BUSY", "drawBg", "drawShape", "thBuild", "clamp", "eo", "ob", "rnd"];
  const missing = need.filter(n => { try { return typeof (0, eval)(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «Криптовалюта» не подключён, нет:", missing.join(", ")); return; }
  window.__packCrypto = true;

  /* ---------- общие помощники ---------- */
  const TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const FNT = () => (typeof FONT !== "undefined" ? FONT : "Arial, sans-serif");
  const MONO = "Menlo, Consolas, 'Courier New', monospace";
  const hx = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mixc = (a, b, t) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };
  const ease = x => x * x * (3 - 2 * x);
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const txt = (c, s, x, y, px, col, wt, al, fam) => { c.font = (wt || 800) + " " + px + "px " + (fam || FNT()); c.textAlign = al || "center"; c.textBaseline = "middle"; c.fillStyle = col; c.fillText(s, x, y); };
  const HEX = "0123456789ABCDEF", hexs = (k, n) => { let s = ""; for (let i = 0; i < n; i++) s += HEX[Math.floor(rnd(k * 17 + i * 3.1) * 16)]; return s; };
  const GOLD = "#f7931a", GREEN = "#19d37a", RED = "#ff3b57", VIOLET = "#8a6bff";

  /* монета с символом ₿ (рисуется буквой B и двумя штрихами: работает на любом устройстве) */
  function btcSym(c, s) { c.fillStyle = "#7a4a05"; c.font = "900 " + s * 1.55 + "px Arial, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("B", 0, s * 0.04); c.fillRect(-s * 0.26, -s * 0.98, s * 0.09, s * 0.3); c.fillRect(s * 0.1, -s * 0.98, s * 0.09, s * 0.3); c.fillRect(-s * 0.26, s * 0.68, s * 0.09, s * 0.3); c.fillRect(s * 0.1, s * 0.68, s * 0.09, s * 0.3); }
  function coin(c, x, y, r, flip, sym, col) {
    const f = Math.max(0.08, Math.abs(flip)); col = col || GOLD; c.save(); c.translate(x, y); c.scale(f, 1);
    const g = c.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r); g.addColorStop(0, mixc(col, "#ffffff", 0.65)); g.addColorStop(0.55, col); g.addColorStop(1, mixc(col, "#000000", 0.4));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = mixc(col, "#000000", 0.35); c.lineWidth = r * 0.07; c.beginPath(); c.arc(0, 0, r * 0.78, 0, TAU); c.stroke();
    c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = r * 0.04; c.beginPath(); c.arc(0, 0, r * 0.94, PI * 1.05, PI * 1.6); c.stroke(); if (f > 0.25 && sym) sym(c, r * 0.5); c.restore();
  }
  const spark = (c, x, y, r, a, col) => { c.save(); c.translate(x, y); c.fillStyle = rgba(col || "#ffffff", a); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.fill(); c.restore(); };

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */
  function bgChain(c, w, h, t, pal) {
    const col = pal[1]; c.save(); c.translate(w / 2, h / 2); c.rotate(-0.12); c.translate(-w / 2, -h / 2);
    [[0.55, 0.2], [0.8, 0.5], [1, 0.8]].forEach(([d, fy], li) => {
      const S = w * 0.22 * d, sp = S * 1.55, off = (t * 34 * d) % sp, y = h * fy;
      for (let i = -2; i < w / sp + 2; i++) {
        const x = i * sp - off, k = i + Math.floor(t * 34 * d / sp), mine = Math.floor(t * 0.8 + li * 3) % 7 === ((k % 7) + 7) % 7;
        c.strokeStyle = rgba(col, 0.55 * d); c.lineWidth = Math.max(1.5, w * 0.004 * d); c.beginPath(); c.moveTo(x + S, y + S / 2); c.lineTo(x + sp, y + S / 2); c.stroke();
        c.fillStyle = rgba(col, 0.1 * d + (mine ? 0.25 * (sin(t * 8) * 0.5 + 0.5) : 0)); c.strokeStyle = rgba(col, 0.5 * d + (mine ? 0.4 : 0)); rrect(c, x, y, S, S, S * 0.12); c.fill(); c.stroke();
        c.fillStyle = rgba(col, 0.45 * d); for (let l = 0; l < 3; l++) rrect(c, x + S * 0.14, y + S * (0.22 + l * 0.17), S * (0.72 - l * 0.18), S * 0.06, S * 0.03), c.fill();
        c.fillStyle = rgba(col, 0.7 * d); c.beginPath(); c.arc(x + S * 0.8, y + S * 0.78, S * 0.06, 0, TAU); c.fill();
      }
    });
    c.restore();
  }

  function bgHash(c, w, h, t, pal) {
    const rows = 22, rh = h / rows, px = rh * 0.62, cw = px * 0.62, cols = Math.ceil(w / cw), col = pal[1], tr = Math.floor((t * 0.8) % rows), ph = (t * 0.8) % 1;
    c.font = "700 " + px + "px " + MONO; c.textAlign = "left"; c.textBaseline = "middle";
    for (let r = 0; r < rows; r++) {
      const hot = r === tr; let s = ""; for (let i = 0; i < cols; i++) s += HEX[Math.floor(rnd(r * 91 + i * 1.7 + Math.floor(t * 5 + r * 0.7)) * 16)];
      c.fillStyle = hot ? rgba(ph < 0.25 ? GREEN : col, 0.9) : rgba(col, 0.1 + 0.12 * rnd(r + 5)); c.fillText(hot && ph < 0.25 ? "0000000" + s.slice(7) : s, 0, r * rh + rh / 2);
    }
    if (ph < 0.25) { c.fillStyle = rgba(GREEN, 0.14 * (1 - ph * 4)); c.fillRect(0, tr * rh, w, rh); txt(c, "NONCE FOUND", w * 0.5, tr * rh + rh / 2, rh * 0.8, "#fff", 900, "center", MONO); }
  }

  function bgPrice(c, w, h, t, pal) {
    const col = pal[1], N = 64, step = w / (N - 4), sp = 1.4, k0 = Math.floor(t * sp), fr = (t * sp) % 1, pr = k => sin(k * 0.21) * 0.9 + sin(k * 0.07 + 1) * 1.4 + sin(k * 0.63) * 0.25 + (((k % 53) > 47) ? 1.1 : 0), sc = h * 0.1, Y = v => h * 0.45 - v * sc;
    c.lineWidth = 1; for (let j = 1; j < 8; j++) { c.strokeStyle = rgba(col, 0.07); c.beginPath(); c.moveTo(0, j * h / 8); c.lineTo(w, j * h / 8); c.stroke(); }
    const pts = []; for (let i = 0; i <= N; i++) pts.push([(i - fr) * step, Y(pr(k0 + i))]);
    const ag = c.createLinearGradient(0, h * 0.2, 0, h * 0.85); ag.addColorStop(0, rgba(col, 0.32)); ag.addColorStop(1, rgba(col, 0)); c.fillStyle = ag; c.beginPath(); c.moveTo(pts[0][0], h * 0.85); pts.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(pts[N][0], h * 0.85); c.closePath(); c.fill();
    c.save(); c.shadowColor = col; c.shadowBlur = w * 0.03; c.strokeStyle = col; c.lineWidth = Math.max(2, w * 0.007); c.lineJoin = "round"; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
    for (let i = 0; i < N; i++) { const up = pr(k0 + i + 1) >= pr(k0 + i), v = 0.3 + 0.7 * rnd(k0 + i + 7); c.fillStyle = rgba(up ? GREEN : RED, 0.35); c.fillRect(pts[i][0] + step * 0.15, h - h * 0.14 * v, step * 0.7, h * 0.14 * v); }
    const cx = w * (0.5 + 0.3 * sin(t * 0.4)), idx = clamp(cx / step + fr, 0, N - 1), i0 = Math.floor(idx), cy = pts[i0][1] + (pts[Math.min(N, i0 + 1)][1] - pts[i0][1]) * (idx - i0);
    c.strokeStyle = "rgba(255,255,255,.3)"; c.setLineDash([w * 0.015, w * 0.012]); c.beginPath(); c.moveTo(cx, 0); c.lineTo(cx, h); c.moveTo(0, cy); c.lineTo(w, cy); c.stroke(); c.setLineDash([]);
    c.fillStyle = "#fff"; c.beginPath(); c.arc(cx, cy, w * 0.012, 0, TAU); c.fill(); c.fillStyle = rgba(col, 0.9); rrect(c, w - w * 0.22, cy - h * 0.016, w * 0.22, h * 0.032, h * 0.008); c.fill(); txt(c, (60000 + Math.round(-cy * 3 + h * 0.45 * 3)).toString(), w - w * 0.11, cy, h * 0.018, "#000", 800);
    c.strokeStyle = rgba(GOLD, 0.6); c.setLineDash([w * 0.03, w * 0.02]); c.beginPath(); c.moveTo(0, h * 0.14); c.lineTo(w, h * 0.14); c.stroke(); c.setLineDash([]); txt(c, "ATH", w * 0.06, h * 0.12, h * 0.016, GOLD, 900);
  }

  function bgNet(c, w, h, t, pal) {
    const col = pal[1], N = 26, P = []; for (let i = 0; i < N; i++) P.push([rnd(i) * w + sin(t * 0.3 + i) * w * 0.03, rnd(i + 9) * h + cos(t * 0.25 + i * 1.3) * h * 0.02]);
    const E = []; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (d < w * 0.33) E.push([i, j, d]); }
    E.forEach(([a, b, d], k) => { c.strokeStyle = rgba(col, 0.25 * (1 - d / (w * 0.33)) + 0.04); c.lineWidth = Math.max(1, w * 0.003); c.beginPath(); c.moveTo(P[a][0], P[a][1]); c.lineTo(P[b][0], P[b][1]); c.stroke(); const u = (t * 0.35 + rnd(k) * 3) % 1; if (rnd(k + 4) > 0.5) { c.fillStyle = "#fff"; c.beginPath(); c.arc(P[a][0] + (P[b][0] - P[a][0]) * u, P[a][1] + (P[b][1] - P[a][1]) * u, w * 0.005, 0, TAU); c.fill(); } });
    P.forEach((p, i) => { const big = i % 5 === 0, r = w * (big ? 0.016 : 0.009), age = (t * 0.5 + rnd(i) * 2) % 1; c.strokeStyle = rgba(col, (1 - age) * 0.6); c.lineWidth = Math.max(1, w * 0.003); c.beginPath(); c.arc(p[0], p[1], r * (1.5 + age * 3), 0, TAU); c.stroke(); c.fillStyle = big ? "#fff" : col; c.shadowColor = col; c.shadowBlur = w * 0.02; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); c.shadowBlur = 0; });
  }

  function bgCoins(c, w, h, t) {
    const it = []; for (let i = 0; i < 28; i++) it.push({ i, d: rnd(i + 3) });
    it.sort((a, b) => a.d - b.d).forEach(({ i, d }) => {
      const r = w * (0.025 + 0.05 * d), x = rnd(i) * w + sin(t * 0.8 + i) * w * 0.02, y = ((rnd(i + 9) * h * 1.3 + t * h * (0.12 + 0.2 * d)) % (h * 1.3)) - h * 0.15;
      c.globalAlpha = 0.35 + 0.6 * d; coin(c, x, y, r, cos(t * 3 + i * 1.7), btcSym, i % 4 === 0 ? "#c9d3dc" : GOLD);
      if (d > 0.7) spark(c, x + r, y - r, r * 0.5, 0.5 + 0.5 * sin(t * 5 + i), "#ffffff");
    });
    c.globalAlpha = 1;
  }

  function bgVault(c, w, h, t, pal) {
    const cx = w / 2, cy = h * 0.5, R = Math.min(w, h) * 0.46, col = pal[1];
    const g = c.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.2); g.addColorStop(0, rgba(col, 0.14)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, w, h);
    [1.0, 0.82, 0.64, 0.48, 0.32].forEach((k, i) => {
      c.save(); c.translate(cx, cy); c.rotate(t * 0.25 * (i % 2 ? 1 : -1) * (1 + i * 0.2)); c.strokeStyle = rgba(col, 0.55 - i * 0.07); c.lineWidth = R * (0.045 - i * 0.004); c.lineCap = "round";
      const segs = 6 + i * 2; for (let s = 0; s < segs; s++) { const a0 = s / segs * TAU, a1 = a0 + TAU / segs * 0.7; c.beginPath(); c.arc(0, 0, R * k, a0, a1); c.stroke(); }
      if (i === 0) for (let s = 0; s < 24; s++) { const a = s / 24 * TAU; c.fillStyle = rgba(col, 0.8); c.beginPath(); c.arc(cos(a) * R * 1.1, sin(a) * R * 1.1, R * 0.018, 0, TAU); c.fill(); }
      if (i === 2) for (let s = 0; s < 60; s++) { const a = s / 60 * TAU, l = s % 5 === 0 ? 0.06 : 0.03; c.beginPath(); c.moveTo(cos(a) * R * k * 1.12, sin(a) * R * k * 1.12); c.lineTo(cos(a) * R * (k * 1.12 + l), sin(a) * R * (k * 1.12 + l)); c.stroke(); }
      c.restore();
    });
    c.save(); c.translate(cx, cy); c.rotate(t * 0.9); c.strokeStyle = rgba(GOLD, 0.9); c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(0, 0); c.lineTo(R * 0.3, 0); c.stroke(); c.fillStyle = GOLD; c.beginPath(); c.arc(R * 0.3, 0, R * 0.035, 0, TAU); c.fill(); c.restore();
    const ang = t * 1.4; for (let k = 0; k < 24; k++) { c.fillStyle = rgba("#ffffff", 0.16 * (1 - k / 24)); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R * 1.12, ang - k * 0.05 - 0.05, ang - k * 0.05); c.closePath(); c.fill(); }
  }

  function bgLedger(c, w, h, t, pal) {
    const rows = 17, rh = h / (rows - 1), s = t * h * 0.08, base = Math.floor(s / rh), px = rh * 0.34, col = pal[1];
    for (let r = 0; r < rows + 1; r++) {
      const idx = base + r, y = h - (r * rh - (s % rh)) + rh * 0.0, f = clamp(y / h), up = rnd(idx * 3.3) > 0.45, a = 0.12 + 0.55 * (1 - Math.abs(f - 0.5) * 1.6);
      c.fillStyle = rgba(col, 0.04 + 0.04 * (idx % 2)); c.fillRect(0, y - rh / 2, w, rh);
      txt(c, "0x" + hexs(idx, 6) + "…" + hexs(idx + 7, 4), w * 0.04, y, px, rgba(col, a), 700, "left", MONO);
      txt(c, up ? "▲" : "▼", w * 0.52, y, px, rgba(up ? GREEN : RED, a + 0.2), 900, "center", "Arial, sans-serif");
      txt(c, (up ? "+" : "-") + (rnd(idx + 11) * 3).toFixed(2) + (rnd(idx + 13) > 0.5 ? " BTC" : " ETH"), w * 0.96, y, px, rgba(up ? GREEN : RED, a + 0.2), 800, "right", MONO);
    }
  }

  function bgMoon(c, w, h, t, pal) {
    const col = pal[1];
    for (let i = 0; i < 70; i++) { c.fillStyle = rgba("#ffffff", 0.2 + 0.7 * Math.abs(sin(t * 1.5 + i))); const q = w * (0.002 + rnd(i + 4) * 0.004); c.fillRect(rnd(i) * w, rnd(i + 9) * h, q, q); }
    const mx = w * 0.74, my = h * 0.2, mr = Math.min(w, h) * 0.17, mg = c.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 2.4); mg.addColorStop(0, "rgba(255,240,200,.35)"); mg.addColorStop(1, "rgba(255,240,200,0)"); c.fillStyle = mg; c.fillRect(0, 0, w, h * 0.6);
    const mb = c.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr); mb.addColorStop(0, "#fffbe8"); mb.addColorStop(1, "#d8cfae"); c.fillStyle = mb; c.beginPath(); c.arc(mx, my, mr, 0, TAU); c.fill(); c.fillStyle = "rgba(150,140,110,.35)"; [[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [-0.1, 0.35, 0.12]].forEach(q => { c.beginPath(); c.arc(mx + q[0] * mr, my + q[1] * mr, q[2] * mr, 0, TAU); c.fill(); });
    const per = 7, u = (t % per) / per, p = clamp(u / 0.8), curve = k => ({ x: w * (0.06 + 0.7 * k), y: h * (0.95 - 0.75 * Math.pow(k, 2.2)) });
    c.save(); c.lineCap = "round"; c.shadowColor = GREEN; c.shadowBlur = w * 0.03; c.strokeStyle = GREEN; c.lineWidth = Math.max(2, w * 0.008); c.beginPath(); for (let k = 0; k <= p; k += 0.01) { const q = curve(k); k ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); } c.stroke(); c.restore();
    const hd = curve(p); for (let k = 0; k < 18; k++) { const a = ((t * 2 + k / 18) % 1); c.fillStyle = rgba(k % 2 ? "#ffd27a" : "#ff7a1a", (1 - a) * 0.8); c.beginPath(); c.arc(hd.x - a * w * 0.07 + (rnd(k) - 0.5) * 6, hd.y + a * h * 0.06 + (rnd(k + 3) - 0.5) * 6, w * 0.01 * (1 - a), 0, TAU); c.fill(); }
    c.fillStyle = "#fff"; c.beginPath(); c.arc(hd.x, hd.y, w * 0.012, 0, TAU); c.fill();
    for (let i = 0; i < 16; i++) { const x = rnd(i + 20) * w, y = h - ((rnd(i + 30) * h + t * h * (0.2 + 0.3 * rnd(i + 40))) % h); c.strokeStyle = rgba(col, 0.25); c.lineWidth = Math.max(1, w * 0.003); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h * 0.05); c.stroke(); }
  }

  function bgQr(c, w, h, t, pal) {
    const col = pal[1], n = 21, g = Math.min(w, h) * 0.8 / n, ox = (w - g * n) / 2, oy = (h - g * n) / 2, st = Math.floor(t * 4);
    const fin = (i, j) => (i < 7 && j < 7) || (i >= n - 7 && j < 7) || (i < 7 && j >= n - 7);
    const gl = c.createRadialGradient(w / 2, h / 2, g * 3, w / 2, h / 2, g * n * 0.8); gl.addColorStop(0, rgba(col, 0.16)); gl.addColorStop(1, rgba(col, 0)); c.fillStyle = gl; c.fillRect(0, 0, w, h);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      let on; if (fin(i, j)) { const a = i < 7 ? i : i - (n - 7), b = j < 7 ? j : j - (n - 7); on = a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4); } else on = rnd(i * 31 + j * 17 + st * 3.7) > 0.5;
      if (on) { c.fillStyle = rgba(col, 0.55 + 0.3 * rnd(i + j)); c.fillRect(ox + i * g + g * 0.08, oy + j * g + g * 0.08, g * 0.84, g * 0.84); }
    }
    const sy = oy + ((t * 0.5) % 1) * g * n; c.save(); c.shadowColor = GREEN; c.shadowBlur = g; c.fillStyle = rgba(GREEN, 0.85); c.fillRect(ox - g, sy, g * (n + 2), g * 0.18); c.restore();
    c.strokeStyle = rgba(col, 0.6); c.lineWidth = g * 0.15; const L = g * 2.2; [[ox, oy, 1, 1], [ox + g * n, oy, -1, 1], [ox, oy + g * n, 1, -1], [ox + g * n, oy + g * n, -1, -1]].forEach(([x, y, a, b]) => { c.beginPath(); c.moveTo(x - a * g * 0.5 + a * L, y - b * g * 0.5); c.lineTo(x - a * g * 0.5, y - b * g * 0.5); c.lineTo(x - a * g * 0.5, y - b * g * 0.5 + b * L); c.stroke(); });
  }

  function bgFlow(c, w, h, t, pal) {
    const cols = [pal[1], VIOLET, "#4cc9f0", GOLD, "#ff5c8a", GREEN];
    cols.forEach((cl, k) => {
      const y0 = h * (0.12 + k * 0.15), amp = h * (0.05 + 0.02 * (k % 3)), ph = k * 1.3, fy = x => y0 + sin(x / w * 5 + t * (0.8 + k * 0.1) + ph) * amp + sin(x / w * 11 - t * 1.3 + ph) * amp * 0.35;
      c.save(); c.lineCap = "round"; c.shadowColor = cl; c.shadowBlur = w * 0.025; c.strokeStyle = rgba(cl, 0.5); c.lineWidth = Math.max(2, w * 0.012); c.beginPath(); for (let x = -10; x <= w + 10; x += 10) x < 0 ? c.moveTo(x, fy(x)) : c.lineTo(x, fy(x)); c.stroke(); c.restore();
      for (let i = 0; i < 3; i++) { const u = (t * 0.12 * (1 + k * 0.1) + i / 3 + k * 0.17) % 1, x = u * w, y = fy(x); c.fillStyle = cl; c.beginPath(); c.arc(x, y, w * 0.016, 0, TAU); c.fill(); c.fillStyle = "rgba(255,255,255,.85)"; c.beginPath(); c.arc(x - w * 0.004, y - w * 0.004, w * 0.006, 0, TAU); c.fill(); }
    });
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр (0,0)
     ========================================================== */
  function aCoin(c, R, lt) {
    const g = c.createRadialGradient(0, 0, R * 0.5, 0, 0, R * 1.5); g.addColorStop(0, rgba(GOLD, 0.35)); g.addColorStop(1, rgba(GOLD, 0)); c.fillStyle = g; c.fillRect(-R * 1.6, -R * 1.6, R * 3.2, R * 3.2);
    c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.ellipse(0, R * 1.05, R * 0.6 * (0.6 + 0.4 * Math.abs(cos(lt * 2.2))), R * 0.1, 0, 0, TAU); c.fill();
    c.save(); c.translate(0, sin(lt * 2) * R * 0.06); coin(c, 0, 0, R * 0.85, cos(lt * 2.2), btcSym, GOLD); c.restore();
    for (let i = 0; i < 6; i++) { const a = lt * 0.8 + i / 6 * TAU; spark(c, cos(a) * R * 1.12, sin(a) * R * 1.0, R * (0.06 + 0.05 * sin(lt * 4 + i)), 0.4 + 0.6 * Math.abs(sin(lt * 3 + i)), "#fff6c8"); }
  }

  function aChart(c, R, lt, pal) {
    const W = R * 2.3, H = R * 1.4, p = ease(clamp((lt % 6) / 3.8)), col = pal[1], N = 24, f = i => i / (N - 1) * 0.85 + 0.1 * sin(i * 1.3) + 0.05 * sin(i * 3.1), X = i => -W / 2 + i / (N - 1) * W, Y = v => H / 2 - (v + 0.08) * H * 0.95;
    c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = 1; for (let k = 0; k <= 4; k++) { c.beginPath(); c.moveTo(-W / 2, -H / 2 + k * H / 4); c.lineTo(W / 2, -H / 2 + k * H / 4); c.stroke(); }
    const n = p * (N - 1); let ex = X(0), ey = Y(f(0));
    const ag = c.createLinearGradient(0, -H / 2, 0, H / 2); ag.addColorStop(0, rgba(col, 0.35)); ag.addColorStop(1, rgba(col, 0)); c.fillStyle = ag; c.beginPath(); c.moveTo(X(0), H / 2);
    for (let i = 0; i <= Math.floor(n); i++) c.lineTo(X(i), Y(f(i))); const fi = Math.floor(n), fr = n - fi; if (fi < N - 1) { ex = X(fi) + (X(fi + 1) - X(fi)) * fr; ey = Y(f(fi)) + (Y(f(fi + 1)) - Y(f(fi))) * fr; c.lineTo(ex, ey); } else { ex = X(N - 1); ey = Y(f(N - 1)); } c.lineTo(ex, H / 2); c.closePath(); c.fill();
    c.save(); c.shadowColor = col; c.shadowBlur = R * 0.15; c.strokeStyle = col; c.lineWidth = R * 0.055; c.lineCap = c.lineJoin = "round"; c.beginPath(); for (let i = 0; i <= fi; i++) i ? c.lineTo(X(i), Y(f(i))) : c.moveTo(X(i), Y(f(i))); if (fi < N - 1) c.lineTo(ex, ey); c.stroke(); c.restore();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(ex, ey, R * 0.07 * (1 + 0.2 * sin(lt * 8)), 0, TAU); c.fill();
    c.fillStyle = GREEN; rrect(c, -W / 2, -H / 2 - R * 0.42, R * 0.95, R * 0.3, R * 0.07); c.fill(); txt(c, "+" + Math.round(p * 128) + "%", -W / 2 + R * 0.475, -H / 2 - R * 0.27, R * 0.2, "#04210f", 900);
    if (p > 0.15) { c.fillStyle = GREEN; c.beginPath(); c.moveTo(ex + R * 0.14, ey - R * 0.16); c.lineTo(ex - R * 0.1, ey - R * 0.2); c.lineTo(ex + R * 0.02, ey - R * 0.02); c.closePath(); c.fill(); }
  }

  function cblock(c, x, y, S, col, tag, glow) {
    c.save(); if (glow) { c.shadowColor = col; c.shadowBlur = S * 0.5; }
    const g = c.createLinearGradient(0, y, 0, y + S); g.addColorStop(0, "#1c2f66"); g.addColorStop(1, "#0b1636"); c.fillStyle = g; rrect(c, x, y, S, S, S * 0.12); c.fill(); c.shadowBlur = 0; c.strokeStyle = col; c.lineWidth = S * 0.04; c.stroke();
    c.fillStyle = rgba(col, 0.6); for (let l = 0; l < 3; l++) rrect(c, x + S * 0.12, y + S * (0.2 + l * 0.17), S * (0.76 - l * 0.2), S * 0.06, S * 0.03), c.fill(); txt(c, tag, x + S / 2, y + S * 0.82, S * 0.13, rgba("#ffffff", 0.8), 700, "center", MONO); c.restore();
  }
  function aChain(c, R, lt, pal) {
    const S = R * 0.5, sp = R * 0.7, col = pal[1], per = 3.2, u = (lt % per) / per, n = 4, x0 = -sp * (n) / 2;
    for (let i = 0; i < n; i++) { const x = x0 + i * sp - S / 2 + sp * 0.5; if (i < n - 1) { c.strokeStyle = col; c.lineWidth = R * 0.05; c.beginPath(); c.moveTo(x + S, -S * 0.0); c.lineTo(x + sp, 0); c.stroke(); } cblock(c, x, -S / 2, S, col, "#" + hexs(i + Math.floor(lt / per) * 5, 3), false); }
    const fly = ease(clamp(u / 0.5)), tx = x0 + n * sp - S / 2 + sp * 0.5, sx = tx + R * 1.6, nx = sx + (tx - sx) * fly, ny = -R * 0.9 * (1 - fly);
    if (u > 0.45) { c.strokeStyle = rgba(GREEN, clamp((u - 0.45) * 4)); c.lineWidth = R * 0.06; c.beginPath(); c.moveTo(x0 + (n - 1) * sp - S / 2 + sp * 0.5 + S, 0); c.lineTo(tx, 0); c.stroke(); }
    cblock(c, nx, ny - S / 2, S, u > 0.5 ? GREEN : GOLD, "#" + hexs(77 + Math.floor(lt / per), 3), true);
    if (u > 0.55) { c.strokeStyle = GREEN; c.lineWidth = R * 0.07; c.lineCap = "round"; c.beginPath(); c.moveTo(tx + S * 0.28, -S * 0.1); c.lineTo(tx + S * 0.44, S * 0.06); c.lineTo(tx + S * 0.75, -S * 0.3); c.stroke(); }
  }

  function aMining(c, R, lt) {
    const per = 1.2, u = (lt % per) / per, hit = Math.floor(lt / per), cx = 0, cy = R * 0.35;
    const g = c.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 0.8); g.addColorStop(0, rgba(GOLD, 0.45)); g.addColorStop(1, rgba(GOLD, 0)); c.fillStyle = g; c.fillRect(-R, -R * 0.5, R * 2, R * 1.7);
    c.save(); c.translate(cx, cy); const sq = u > 0.65 && u < 0.8 ? 1 - 0.06 * sin((u - 0.65) / 0.15 * PI) : 1; c.scale(1 / sq, sq);
    const gg = c.createLinearGradient(-R * 0.5, -R * 0.5, R * 0.5, R * 0.5); gg.addColorStop(0, "#ffe9a0"); gg.addColorStop(0.5, GOLD); gg.addColorStop(1, "#8a4f08"); c.fillStyle = gg; c.beginPath(); c.moveTo(-R * 0.55, R * 0.3); c.lineTo(-R * 0.4, -R * 0.25); c.lineTo(-R * 0.05, -R * 0.5); c.lineTo(R * 0.35, -R * 0.3); c.lineTo(R * 0.55, R * 0.1); c.lineTo(R * 0.4, R * 0.4); c.lineTo(-R * 0.2, R * 0.45); c.closePath(); c.fill(); c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = R * 0.02; c.beginPath(); c.moveTo(-R * 0.4, -R * 0.25); c.lineTo(R * 0.1, R * 0.05); c.lineTo(R * 0.35, -R * 0.3); c.moveTo(R * 0.1, R * 0.05); c.lineTo(-R * 0.2, R * 0.45); c.stroke(); c.save(); c.translate(0, 0); btcSym(c, R * 0.2); c.restore(); c.restore();
    const swing = u < 0.65 ? -1.25 + 0.18 * sin(u / 0.65 * PI) * 0 + (u / 0.65) * 0.0 : -1.25; let a = -1.25; if (u < 0.5) a = -1.25 - 0.35 * ease(u / 0.5); else if (u < 0.68) a = -1.6 + 1.55 * ease((u - 0.5) / 0.18); else a = -0.05 - 0.0 + 0; if (u >= 0.68) a = -0.05 + (-1.25 + 0.05) * ease((u - 0.68) / 0.32);
    c.save(); c.translate(R * 0.75, -R * 0.6); c.rotate(a + 0.2); c.lineCap = "round"; c.strokeStyle = "#7a4a22"; c.lineWidth = R * 0.12; c.beginPath(); c.moveTo(0, 0); c.lineTo(-R * 1.05, R * 0.95); c.stroke(); c.save(); c.translate(-R * 1.05, R * 0.95); c.rotate(-0.78);
    const sg = c.createLinearGradient(0, -R * 0.3, 0, R * 0.1); sg.addColorStop(0, "#eef2f6"); sg.addColorStop(1, "#6a7686"); c.fillStyle = sg; c.beginPath(); c.moveTo(-R * 0.55, R * 0.05); c.quadraticCurveTo(0, -R * 0.55, R * 0.55, R * 0.05); c.quadraticCurveTo(0, -R * 0.2, -R * 0.55, R * 0.05); c.closePath(); c.fill(); c.restore(); c.restore();
    if (u > 0.66 && u < 1) { const f = (u - 0.66) / 0.34; for (let k = 0; k < 10; k++) { const an = -PI * 0.9 + k * 0.2, v = R * (0.5 + 0.5 * rnd(k + hit)); c.strokeStyle = rgba(k % 2 ? "#ffe9a0" : "#fff", 1 - f); c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(cx - R * 0.35 + cos(an) * v * f * 0.4, cy - R * 0.1 + sin(an) * v * f * 0.4 + f * f * R * 0.3); c.lineTo(cx - R * 0.35 + cos(an) * v * f, cy - R * 0.1 + sin(an) * v * f + f * f * R * 0.6); c.stroke(); } if (f < 0.8) txt(c, "0x" + hexs(hit, 3), cx - R * 0.3, cy - R * 0.5 - f * R * 0.6, R * 0.14, rgba("#ffffff", 1 - f), 800, "center", MONO); }
    c.strokeStyle = "rgba(255,255,255,.15)"; c.lineWidth = R * 0.05; c.beginPath(); c.arc(0, R * 1.0, R * 0.2, 0, TAU); c.stroke(); c.strokeStyle = GREEN; c.beginPath(); c.arc(0, R * 1.0, R * 0.2, -PI / 2, -PI / 2 + TAU * (((hit % 5) + u) / 5)); c.stroke();
  }

  function aWallet(c, R, lt) {
    const W = R * 1.9, H = R * 1.0, per = 2.4, bal = (Math.floor(lt / per) * 3 + (lt % per) / per * 3) * 0.0137;
    c.fillStyle = "rgba(0,0,0,.25)"; c.beginPath(); c.ellipse(0, R * 0.78, W * 0.5, R * 0.1, 0, 0, TAU); c.fill();
    const bg = c.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, "#6b4528"); bg.addColorStop(1, "#3a2414"); c.fillStyle = bg; rrect(c, -W / 2, -H / 2 + R * 0.12, W, H, R * 0.14); c.fill();
    for (let k = 0; k < 3; k++) { const uu = ((lt + k * 0.8) % per) / per, y = -R * 1.5 + uu * R * 1.35, a = uu < 0.85 ? 1 : 0; if (a) coin(c, (k - 1) * R * 0.38, y, R * 0.24, cos(lt * 5 + k), btcSym, GOLD); }
    const fg = c.createLinearGradient(0, -H / 2 + R * 0.1, 0, H / 2); fg.addColorStop(0, "#8a5a32"); fg.addColorStop(1, "#4a2e18"); c.fillStyle = fg; rrect(c, -W / 2, -H * 0.18 + R * 0.12, W, H * 0.68, R * 0.14); c.fill();
    c.strokeStyle = "rgba(255,230,180,.5)"; c.lineWidth = R * 0.025; c.setLineDash([R * 0.07, R * 0.05]); rrect(c, -W / 2 + R * 0.1, -H * 0.18 + R * 0.22, W - R * 0.2, H * 0.68 - R * 0.2, R * 0.08); c.stroke(); c.setLineDash([]);
    c.fillStyle = "#f2c94c"; c.beginPath(); c.arc(W / 2 - R * 0.05, R * 0.22, R * 0.15, 0, TAU); c.fill(); c.fillStyle = "#8a5a0a"; c.beginPath(); c.arc(W / 2 - R * 0.05, R * 0.22, R * 0.07, 0, TAU); c.fill();
    txt(c, "+" + bal.toFixed(3) + " BTC", 0, -R * 1.05 - R * 0.28, R * 0.24, GREEN, 900);
  }

  function aLock(c, R, lt, pal) {
    const per = 4, u = (lt % per) / per, close = ease(clamp(u / 0.35)) * (u < 0.85 ? 1 : 1 - ease((u - 0.85) / 0.15)), col = pal[1], ok = u > 0.4 && u < 0.85;
    for (let k = 0; k < 3; k++) { const age = (lt * 0.5 + k / 3) % 1; c.strokeStyle = rgba(ok ? GREEN : col, (1 - age) * 0.45); c.lineWidth = R * 0.03; c.beginPath(); c.arc(0, 0, R * (0.85 + age * 0.6), 0, TAU); c.stroke(); }
    c.save(); c.rotate(lt * 0.4); c.strokeStyle = rgba(col, 0.5); c.lineWidth = R * 0.03; for (let s = 0; s < 12; s++) { c.beginPath(); c.arc(0, 0, R * 1.05, s / 12 * TAU, s / 12 * TAU + 0.35); c.stroke(); } c.restore();
    const bw = R * 1.0, bh = R * 0.8, by = R * 0.1, lift = (1 - close) * R * 0.32;
    c.lineCap = "round"; c.strokeStyle = "#c9d3dc"; c.lineWidth = R * 0.16; c.beginPath(); c.moveTo(-bw * 0.32, by); c.lineTo(-bw * 0.32, by - R * 0.3 - lift); c.arc(0, by - R * 0.3 - lift, bw * 0.32, PI, 0); c.lineTo(bw * 0.32, by - R * 0.3 - lift + (close < 1 ? 0 : 0)); c.lineTo(bw * 0.32, by - lift * 0.6 * (1 - close)); c.stroke();
    c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = R * 0.04; c.beginPath(); c.arc(0, by - R * 0.3 - lift, bw * 0.32, PI * 1.1, PI * 1.5); c.stroke();
    const g = c.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, "#ffd966"); g.addColorStop(1, "#b8860b"); c.save(); c.shadowColor = ok ? GREEN : GOLD; c.shadowBlur = R * (ok ? 0.4 : 0.15); c.fillStyle = g; rrect(c, -bw / 2, by, bw, bh, R * 0.14); c.fill(); c.restore();
    c.fillStyle = "#4a3004"; c.beginPath(); c.arc(0, by + bh * 0.4, R * 0.1, 0, TAU); c.fill(); c.fillRect(-R * 0.035, by + bh * 0.4, R * 0.07, R * 0.22);
    if (ok) { c.strokeStyle = GREEN; c.lineWidth = R * 0.09; c.beginPath(); c.moveTo(-R * 0.18, by + bh * 0.4 + 0.0); c.lineTo(-R * 0.04, by + bh * 0.4 + R * 0.12); c.lineTo(R * 0.2, by + bh * 0.4 - R * 0.12); c.stroke(); }
  }

  function aSwap(c, R, lt) {
    const a = lt * 1.4, rx = R * 0.75, ry = R * 0.3;
    c.save(); c.lineCap = "round"; c.lineWidth = R * 0.07;
    [0, 1].forEach(k => { const s = k * PI + lt * 1.4 * 0.5; c.strokeStyle = rgba(k ? VIOLET : GOLD, 0.8); c.beginPath(); c.arc(0, 0, R * 1.0, s, s + 1.1); c.stroke(); const e = s + 1.1; c.fillStyle = rgba(k ? VIOLET : GOLD, 0.9); c.beginPath(); c.moveTo(cos(e) * R * 1.0 + cos(e + PI / 2) * R * 0.14, sin(e) * R * 1.0 + sin(e + PI / 2) * R * 0.14); c.lineTo(cos(e + 0.25) * R * 1.0 + cos(e + PI / 2) * R * 0.04, sin(e + 0.25) * R * 1.0 + sin(e + PI / 2) * R * 0.04); c.lineTo(cos(e) * R * 1.0 - cos(e + PI / 2) * R * 0.14, sin(e) * R * 1.0 - sin(e + PI / 2) * R * 0.14); c.closePath(); c.fill(); }); c.restore();
    const A = { x: cos(a) * rx, y: sin(a) * ry, z: sin(a) }, B = { x: -A.x, y: -A.y, z: -A.z }, arr = [[A, GOLD, btcSym], [B, VIOLET, (cc, s) => { cc.fillStyle = "#fff"; cc.beginPath(); cc.moveTo(0, -s); cc.lineTo(s * 0.7, 0); cc.lineTo(0, s); cc.lineTo(-s * 0.7, 0); cc.closePath(); cc.fill(); }]].sort((p, q) => p[0].z - q[0].z);
    arr.forEach(([P, col, sym]) => { const sc = 0.85 + 0.2 * P.z; coin(c, P.x, P.y, R * 0.4 * sc, 1, sym, col); });
  }

  function aRocket(c, R, lt) {
    for (let i = 0; i < 22; i++) { const x = (rnd(i) - 0.5) * R * 2.4, y = ((rnd(i + 5) * 2.4 + lt * (0.7 + rnd(i + 9))) % 2.4 - 1.2) * R; c.strokeStyle = rgba("#ffffff", 0.2 + 0.4 * rnd(i + 2)); c.lineWidth = R * 0.02; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + R * 0.18); c.stroke(); }
    c.fillStyle = "#fffbe8"; c.shadowColor = "#fff6c8"; c.shadowBlur = R * 0.3; c.beginPath(); c.arc(R * 0.75, -R * 0.85, R * 0.22, 0, TAU); c.fill(); c.shadowBlur = 0;
    c.save(); c.translate(sin(lt * 1.5) * R * 0.05, sin(lt * 2.4) * R * 0.04); c.rotate(0.35);
    const fl = 1 + 0.25 * sin(lt * 30) + 0.15 * sin(lt * 17), fg = c.createLinearGradient(0, R * 0.5, 0, R * 1.5 * fl); fg.addColorStop(0, "#ffffff"); fg.addColorStop(0.3, "#ffd27a"); fg.addColorStop(0.7, "#ff7a1a"); fg.addColorStop(1, "rgba(255,60,0,0)"); c.fillStyle = fg; c.beginPath(); c.moveTo(-R * 0.22, R * 0.5); c.quadraticCurveTo(0, R * 1.7 * fl, R * 0.22, R * 0.5); c.closePath(); c.fill();
    c.fillStyle = "#e6192d"; [-1, 1].forEach(sg => { c.beginPath(); c.moveTo(sg * R * 0.28, R * 0.1); c.lineTo(sg * R * 0.6, R * 0.55); c.lineTo(sg * R * 0.28, R * 0.45); c.closePath(); c.fill(); });
    const bg = c.createLinearGradient(-R * 0.3, 0, R * 0.3, 0); bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#aab6c4"); c.fillStyle = bg; c.beginPath(); c.moveTo(0, -R * 0.95); c.bezierCurveTo(R * 0.4, -R * 0.5, R * 0.34, R * 0.2, R * 0.28, R * 0.5); c.lineTo(-R * 0.28, R * 0.5); c.bezierCurveTo(-R * 0.34, R * 0.2, -R * 0.4, -R * 0.5, 0, -R * 0.95); c.closePath(); c.fill();
    c.fillStyle = "#e6192d"; c.beginPath(); c.moveTo(0, -R * 0.95); c.bezierCurveTo(R * 0.22, -R * 0.75, R * 0.3, -R * 0.55, R * 0.31, -R * 0.45); c.lineTo(-R * 0.31, -R * 0.45); c.bezierCurveTo(-R * 0.3, -R * 0.55, -R * 0.22, -R * 0.75, 0, -R * 0.95); c.closePath(); c.fill();
    c.fillStyle = "#3aa0ff"; c.beginPath(); c.arc(0, -R * 0.15, R * 0.14, 0, TAU); c.fill(); c.strokeStyle = GOLD; c.lineWidth = R * 0.04; c.stroke(); c.fillStyle = "rgba(255,255,255,.6)"; c.beginPath(); c.arc(-R * 0.04, -R * 0.2, R * 0.04, 0, TAU); c.fill(); coin(c, 0, R * 0.25, R * 0.1, 1, btcSym, GOLD); c.restore();
  }

  function aNodes(c, R, lt, pal) {
    const col = pal[1], n = 8, rr = R * 0.85, P = []; for (let i = 0; i < n; i++) { const a = i / n * TAU + lt * 0.2; P.push([cos(a) * rr, sin(a) * rr]); }
    c.lineWidth = R * 0.025; for (let i = 0; i < n; i++) { c.strokeStyle = rgba(col, 0.4); c.beginPath(); c.moveTo(0, 0); c.lineTo(P[i][0], P[i][1]); c.stroke(); const j = (i + 1) % n; c.strokeStyle = rgba(col, 0.2); c.beginPath(); c.moveTo(P[i][0], P[i][1]); c.lineTo(P[j][0], P[j][1]); c.stroke(); const u = (lt * 0.6 + i / n) % 1; c.fillStyle = "#fff"; c.beginPath(); c.arc(P[i][0] * u, P[i][1] * u, R * 0.035, 0, TAU); c.fill(); const u2 = (lt * 0.6 + i / n + 0.5) % 1; c.fillStyle = rgba(GOLD, 0.9); c.beginPath(); c.arc(P[i][0] * (1 - u2), P[i][1] * (1 - u2), R * 0.03, 0, TAU); c.fill(); }
    for (let i = 0; i < n; i++) { const ok = ((lt * 0.6 + i / n) % 1) > 0.85; c.save(); c.shadowColor = ok ? GREEN : col; c.shadowBlur = R * 0.2; c.fillStyle = ok ? GREEN : col; c.beginPath(); c.arc(P[i][0], P[i][1], R * 0.12, 0, TAU); c.fill(); c.restore(); c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.arc(P[i][0] - R * 0.03, P[i][1] - R * 0.03, R * 0.035, 0, TAU); c.fill(); }
    for (let k = 0; k < 3; k++) { const age = (lt * 0.7 + k / 3) % 1; c.strokeStyle = rgba(GOLD, (1 - age) * 0.6); c.lineWidth = R * 0.03; c.beginPath(); c.arc(0, 0, R * (0.2 + age * 0.6), 0, TAU); c.stroke(); }
    coin(c, 0, 0, R * 0.26, cos(lt * 2), btcSym, GOLD);
  }

  function aGem(c, R, lt) {
    for (let i = 0; i < 12; i++) { const a = lt * 0.3 + i / 12 * TAU; c.fillStyle = rgba("#9fe8ff", 0.08 + 0.05 * sin(lt * 2 + i)); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R * 1.5, a, a + 0.12); c.closePath(); c.fill(); }
    const V = { T1: [-0.42, -0.78], T2: [0.42, -0.78], L: [-0.98, -0.3], M1: [-0.5, -0.3], M2: [0.5, -0.3], Rr: [0.98, -0.3], P: [0, 0.95] };
    const F = [["T1", "T2", "M2", "M1"], ["L", "T1", "M1"], ["T2", "Rr", "M2"], ["L", "M1", "P"], ["M1", "M2", "P"], ["M2", "Rr", "P"]], base = ["#bff3ff", "#7ad4ff", "#7ad4ff", "#3aa0ff", "#8fe0ff", "#2a78d8"];
    c.save(); c.scale(R * 0.9, R * 0.9); c.shadowColor = "#4cc9f0"; c.shadowBlur = R * 0.3;
    F.forEach((f, i) => { const sh = 0.5 + 0.5 * sin(lt * 2 + i * 1.1), col = mixc(base[i], "#ffffff", 0.45 * sh); c.fillStyle = col; c.beginPath(); f.forEach((k, j) => j ? c.lineTo(V[k][0], V[k][1]) : c.moveTo(V[k][0], V[k][1])); c.closePath(); c.fill(); }); c.shadowBlur = 0;
    c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 0.02; F.forEach(f => { c.beginPath(); f.forEach((k, j) => j ? c.lineTo(V[k][0], V[k][1]) : c.moveTo(V[k][0], V[k][1])); c.closePath(); c.stroke(); });
    const sx = ((lt * 0.8) % 2 - 0.5) * 2.2, sg = c.createLinearGradient(sx - 0.3, 0, sx + 0.3, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,.55)"); sg.addColorStop(1, "rgba(255,255,255,0)"); c.save(); c.beginPath(); F.forEach(f => f.forEach((k, j) => j ? c.lineTo(V[k][0], V[k][1]) : c.moveTo(V[k][0], V[k][1]))); c.clip(); c.fillStyle = sg; c.fillRect(sx - 0.3, -1, 0.6, 2); c.restore(); c.restore();
    [[-0.98, -0.3], [0.98, -0.3], [0, -0.78], [0, 0.95]].forEach((p, i) => spark(c, p[0] * R * 0.9, p[1] * R * 0.9, R * 0.16 * Math.abs(sin(lt * 3 + i * 1.4)), 0.9, "#ffffff"));
  }

  /* ==========================================================
     3. ИКОНКИ (10): контуры 24×24
     ========================================================== */
  const ICONS = {
    bitcoin: ["Биткоин", "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"],
    coins: ["Монеты", "M14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0z M18.09 10.37A6 6 0 1 1 10.34 18 M7 6h1v4 m16.71 13.88.7.71-2.82 2.82"],
    chain: ["Цепочка блоков", "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
    block: ["Блок", "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z m3.3 7 8.7 5 8.7-5 M12 22V12"],
    candlestick: ["Свечи", "M9 5v4 M9 15v4 M7 9h4v6H7z M17 3v3 M17 12v5 M15 6h4v6h-4z"],
    hash: ["Хеш", "M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18"],
    pickaxe: ["Майнинг", "M4 20 14 10 M14 10l-1.5-1.5 M6 6c3-3 11-3 14 4 M6 6 5 8 M20 10l-2 1"],
    qrcode: ["QR-код", "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3h-3z M20 14v.01 M14 20h3 M20 17v4 M17 17h.01"],
    swap: ["Обмен", "M17 3l4 4-4 4 M3 7h18 M7 21l-4-4 4-4 M21 17H3"],
    vault: ["Сейф", "M3 4h18v16H3z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 10v4 M10 12h4 M6 20v1 M18 20v1"]
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
  const GOLDM = (mo) => MC("#f2b134", { gloss: 1, hi: "#fff3c0", dark: "#4a2a00" }, mo);
  function rig(pal) {
    const T = THREE, sc = new T.Scene(), root = new T.Group(), pv = new T.Group(), model = new T.Group();
    sc.add(root); root.add(pv); pv.add(model); sc.add(new T.AmbientLight(0xffffff, 0.9));
    const k = new T.DirectionalLight(0xffffff, 0.8); k.position.set(3, 4, 5); sc.add(k);
    const p = new T.PointLight(new T.Color(pal[1]), 1.4, 30); p.position.set(-4, -1, 3); sc.add(p);
    return { T, sc, root, pv, model, fit(target) { const b = new T.Box3().setFromObject(model), s = b.getSize(new T.Vector3()), cc = b.getCenter(new T.Vector3()); model.position.sub(cc); root.scale.setScalar(target / Math.max(s.x, s.y, s.z)); } };
  }
  const lathe = (pts, seg) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg || 48);
  function roundedRect(w, h, r) { const T = THREE, s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const rbox = (w, h, d, r, mat, bev) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev || 0.05, bevelSize: bev || 0.05, bevelSegments: 4, curveSegments: 10 }), mat); m.geometry.center(); return m; };
  function canvasTex(w, h, fn) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const x = cv.getContext("2d"); fn(x, w, h); const tex = new THREE.CanvasTexture(cv); return { tex, cv, x }; }

  const M3 = {};
  M3.c3_btc = pal => {
    const R = rig(pal), T = R.T, face = canvasTex(512, 512, (x, w, h) => {
      x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.strokeStyle = "#7a4a05"; x.lineWidth = 16; x.beginPath(); x.arc(256, 256, 214, 0, TAU); x.stroke(); x.lineWidth = 5; x.beginPath(); x.arc(256, 256, 190, 0, TAU); x.stroke();
      x.fillStyle = "#7a4a05"; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU; x.beginPath(); x.arc(256 + cos(a) * 168, 256 + sin(a) * 168, 5, 0, TAU); x.fill(); }
      x.translate(256, 262); x.scale(1.9, 1.9); btcSym(x, 70);
    });
    const gm = MC("#f2b134", { gloss: 1, hi: "#fff3c0", dark: "#4a2a00" }), fm = MC("#f2b134", { gloss: 1, hi: "#fff3c0", dark: "#4a2a00" }, { map: face.tex });
    const mk = (s) => { const g = new T.Group(); g.add(new T.Mesh(lathe([[0, -0.14], [1.15, -0.14], [1.22, -0.1], [1.25, -0.04], [1.25, 0.04], [1.22, 0.1], [1.15, 0.14], [0, 0.14]], 64), gm)); [1, -1].forEach(sg => { const f = new T.Mesh(new T.CircleGeometry(1.14, 64), fm); f.rotation.x = -sg * PI / 2; f.position.y = sg * 0.142; g.add(f); }); g.scale.setScalar(s); return g; };
    const big = mk(1); big.rotation.x = PI / 2; big.position.y = 0.75; R.model.add(big);
    for (let i = 0; i < 5; i++) { const s = mk(0.8); s.position.set(0, -1.1 + i * 0.3, 0); s.rotation.y = i * 0.5; R.model.add(s); }
    R.fit(3.5);
    return { sc: R.sc, up: lt => { big.rotation.z = lt * 1.2; big.position.y = 0.75 + sin(lt * 2) * 0.06; R.root.rotation.y = sin(lt * 0.5) * 0.4; R.root.rotation.x = 0.15; } };
  };

  M3.c3_eth = pal => {
    const R = rig(pal), T = R.T, mat = MC("#7a5cff", { gloss: 1, hi: "#d9ceff", dark: "#0a0030" }, { flatShading: true }), mat2 = MC("#4cc9f0", { gloss: 1, hi: "#e0fbff", dark: "#00203a" }, { flatShading: true });
    const top = new T.Mesh(new T.ConeGeometry(1, 1.9, 4, 1), mat); top.rotation.y = PI / 4; top.position.y = 1.05; R.model.add(top);
    const bot = new T.Mesh(new T.ConeGeometry(1, 1.4, 4, 1), mat2); bot.rotation.set(PI, PI / 4, 0); bot.position.y = -0.8; R.model.add(bot);
    const core = new T.Mesh(new T.OctahedronGeometry(0.42), new T.MeshBasicMaterial({ color: 0xffffff })); core.position.y = 0.1; R.model.add(core);
    [top, bot].forEach(m => { const e = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })); e.rotation.copy(m.rotation); e.position.copy(m.position); R.model.add(e); });
    const orb = []; for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.SphereGeometry(0.07, 12, 10), new T.MeshBasicMaterial({ color: i % 2 ? 0x4cc9f0 : 0xffd27a })); R.model.add(s); orb.push(s); }
    R.fit(3.5);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.8; top.position.y = 1.05 + sin(lt * 1.6) * 0.05; bot.position.y = -0.8 - sin(lt * 1.6) * 0.05; core.rotation.y = lt * 2; orb.forEach((s, i) => { const a = lt * 1.2 + i / 6 * TAU; s.position.set(cos(a) * 1.7, sin(lt + i) * 0.5 + 0.1, sin(a) * 1.7); }); } };
  };

  M3.c3_chain = pal => {
    const R = rig(pal), T = R.T, blocks = [], n = 5;
    const tex = (k) => canvasTex(256, 256, (x, w, h) => { x.fillStyle = "#0b1636"; x.fillRect(0, 0, w, h); x.strokeStyle = pal[1]; x.lineWidth = 8; x.strokeRect(10, 10, w - 20, h - 20); x.fillStyle = pal[1]; for (let l = 0; l < 4; l++) x.fillRect(34, 48 + l * 38, 188 - l * 36, 14); x.font = "700 28px " + MONO; x.fillText("#" + hexs(k, 4), 34, 220); }).tex;
    const body = MC("#1c2f66", { gloss: 0.9, hi: "#6a8cff", dark: "#00020a" });
    for (let i = 0; i < n; i++) {
      const b = new T.Group(), m = rbox(1.0, 1.0, 0.8, 0.16, body, 0.05); b.add(m); const e = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.1, 1.1, 0.9)), new T.LineBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.8 })); b.add(e);
      const f = new T.Mesh(new T.PlaneGeometry(0.8, 0.8), new T.MeshBasicMaterial({ map: tex(i + 3) })); f.position.z = 0.46; b.add(f);
      b.position.set(i * 1.45 - 2.9, sin(i * 0.9) * 0.3, cos(i * 0.7) * 0.3); R.model.add(b); blocks.push(b);
      if (i < n - 1) { const l = new T.Mesh(new T.TorusGeometry(0.2, 0.05, 12, 28), GOLDM()); l.position.set(i * 1.45 - 2.9 + 0.72, (sin(i * 0.9) + sin((i + 1) * 0.9)) * 0.15, (cos(i * 0.7) + cos((i + 1) * 0.7)) * 0.15); l.rotation.y = i % 2 ? 0 : PI / 2; R.model.add(l); }
    }
    R.fit(4.3);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.5 + sin(lt * 0.5) * 0.35; R.root.rotation.x = 0.2; blocks.forEach((b, i) => { b.position.y = sin(i * 0.9 + lt * 1.4) * 0.3; b.rotation.y = sin(lt + i) * 0.1; const s = i === Math.floor(lt) % n ? 1.1 : 1; b.scale.setScalar(s); }); } };
  };

  M3.c3_wallet = pal => {
    const R = rig(pal), T = R.T, leather = MC("#6b4528", { gloss: 0.4, hi: "#c89a6a", dark: "#1a0c04" }), leather2 = MC("#8a5a32", { gloss: 0.4, hi: "#d8aa7a", dark: "#1a0c04" });
    const body = rbox(2.8, 1.9, 0.5, 0.2, leather, 0.06); R.model.add(body);
    for (let i = 0; i < 4; i++) { const c = new THREE_COIN(); c.position.set(-0.75 + i * 0.5, 1.35 + (i % 2) * 0.1, 0.1); c.rotation.set(PI / 2, 0, (i - 1.5) * 0.25); R.model.add(c); }
    function THREE_COIN() { const g = new T.Group(); g.add(new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.07, 40), GOLDM())); const r = new T.Mesh(new T.TorusGeometry(0.34, 0.015, 8, 36), MC("#b8700a", { gloss: 0.5 })); r.rotation.x = PI / 2; r.position.y = 0.04; g.add(r); return g; }
    const flap = rbox(2.8, 1.15, 0.08, 0.2, leather2, 0.05); flap.position.set(0, -0.3, 0.35); R.model.add(flap);
    for (let i = 0; i < 22; i++) { const a = i / 21; const s = new T.Mesh(new T.BoxGeometry(0.1, 0.02, 0.02), MC("#f2e2c0", { gloss: 0.2 })); s.position.set(-1.25 + 2.5 * a, -0.82, 0.41); R.model.add(s); const s2 = s.clone(); s2.position.set(-1.25 + 2.5 * a, 0.2, 0.41); R.model.add(s2); }
    const cl = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.08, 32), GOLDM()); cl.rotation.x = PI / 2; cl.position.set(0, 0.2, 0.43); R.model.add(cl); const cl2 = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.09, 24), MC("#8a5a0a", { gloss: 0.6 })); cl2.rotation.x = PI / 2; cl2.position.set(0, 0.2, 0.44); R.model.add(cl2);
    R.fit(3.6);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.7) * 0.6; R.root.rotation.x = 0.25; R.pv.position.y = sin(lt * 1.8) * 0.05; } };
  };

  function ledgerScreen(x, w, h, lt) { x.fillStyle = "#050a08"; x.fillRect(0, 0, w, h); x.fillStyle = "#19d37a"; x.font = "800 26px " + MONO; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("BTC  " + (0.4 + (lt % 5) * 0.01).toFixed(3), 14, 28); x.font = "600 16px " + MONO; x.fillStyle = "#7af0b4"; x.fillText("bc1q" + hexs(Math.floor(lt * 2), 8).toLowerCase() + "…", 14, 64); x.fillStyle = "#19d37a"; x.fillRect(14, 96, (w - 28) * ((lt % 3) / 3), 10); x.strokeStyle = "#19d37a"; x.strokeRect(14, 96, w - 28, 10); }
  M3.c3_ledger = pal => {
    const R = rig(pal), T = R.T, scr = canvasTex(256, 144, (x, w, h) => ledgerScreen(x, w, h, 0));
    R.model.add(rbox(1.0, 2.6, 0.22, 0.18, MC("#2a2f38", { gloss: 0.9, hi: "#8a96a8", dark: "#000" }), 0.05));
    const sm = new T.Mesh(new T.PlaneGeometry(0.8, 0.45), new T.MeshBasicMaterial({ map: scr.tex })); sm.position.set(0, 0.55, 0.17); R.model.add(sm);
    const fr = new T.Mesh(new T.PlaneGeometry(0.86, 0.51), new T.MeshBasicMaterial({ color: 0x000000 })); fr.position.set(0, 0.55, 0.165); R.model.add(fr);
    [-0.2, 0.2].forEach(x => { const b = rbox(0.28, 0.14, 0.06, 0.05, MC("#c9d3dc", { gloss: 1 }), 0.02); b.position.set(x, -0.1, 0.16); R.model.add(b); });
    const usb = new T.Mesh(new T.BoxGeometry(0.5, 0.5, 0.2), MC("#d5dde6", { gloss: 1, dark: "#222c36" })); usb.position.set(0, 1.55, 0); R.model.add(usb); const hole = new T.Mesh(new T.BoxGeometry(0.34, 0.06, 0.1), new T.MeshBasicMaterial({ color: 0x000000 })); hole.position.set(0, 1.82, 0); R.model.add(hole);
    const ring = new T.Mesh(new T.TorusGeometry(0.16, 0.03, 10, 28), MC("#c9d3dc", { gloss: 1 })); ring.position.set(0, -1.15, 0); R.model.add(ring);
    const led = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), new T.MeshBasicMaterial({ color: 0x19d37a })); led.position.set(0.35, 0.92, 0.17); R.model.add(led);
    R.fit(3.6);
    return { sc: R.sc, up: lt => { ledgerScreen(scr.x, 256, 144, lt); scr.tex.needsUpdate = true; R.root.rotation.y = sin(lt * 0.8) * 0.7; R.root.rotation.z = 0.25; R.pv.position.y = sin(lt * 1.6) * 0.05; } };
  };

  M3.c3_rig = pal => {
    const R = rig(pal), T = R.T, steel = MC("#c9d3dc", { gloss: 0.9, dark: "#222c36" }), dark = MC("#1b2029", { gloss: 0.5 }), pcb = MC("#1c6b4a", { gloss: 0.5, hi: "#7affc0", dark: "#001a0c" }), fans = [];
    const board = new T.Mesh(new T.BoxGeometry(4.2, 0.08, 1.7), pcb); board.position.y = -0.3; R.model.add(board);
    [[-2.1, -0.85], [2.1, -0.85], [-2.1, 0.85], [2.1, 0.85]].forEach(([x, z]) => { const p = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1.6, 10), steel); p.position.set(x, 0.5, z); R.model.add(p); });
    [-0.85, 0.85].forEach(z => { const r = new T.Mesh(new T.BoxGeometry(4.4, 0.08, 0.08), steel); r.position.set(0, 1.3, z); R.model.add(r); });
    for (let i = 0; i < 6; i++) {
      const g = new T.Group(), body = new T.Mesh(new T.BoxGeometry(0.5, 0.26, 1.4), dark); g.add(body);
      const led = new T.Mesh(new T.BoxGeometry(0.46, 0.02, 0.06), new T.MeshBasicMaterial({ color: i % 2 ? 0x4cc9f0 : 0x8a6bff })); led.position.set(0, 0.14, 0.62); g.add(led);
      const fan = new T.Group(); for (let k = 0; k < 7; k++) { const bl = new T.Mesh(new T.BoxGeometry(0.17, 0.012, 0.05), MC("#aab6c4", { gloss: 0.6 })); bl.position.x = 0.1; const bp = new T.Group(); bp.add(bl); bp.rotation.y = k / 7 * TAU; fan.add(bp); } const hub = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.03, 16), steel); fan.add(hub);
      fan.position.set(0, 0.14, -0.15); g.add(fan); fans.push(fan); const ring = new T.Mesh(new T.TorusGeometry(0.2, 0.012, 8, 28), steel); ring.rotation.x = PI / 2; ring.position.set(0, 0.14, -0.15); g.add(ring);
      g.position.set(-1.75 + i * 0.7, 0.0, 0); R.model.add(g);
      const rs = new T.Mesh(new T.BoxGeometry(0.1, 0.35, 0.25), pcb); rs.position.set(-1.75 + i * 0.7, -0.15, -0.5); R.model.add(rs);
    }
    const psu = new T.Mesh(new T.BoxGeometry(1.2, 0.6, 0.8), MC("#aab6c4", { gloss: 0.8, dark: "#222c36" })); psu.position.set(1.4, 0.85, -0.2); R.model.add(psu);
    R.fit(4.0);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.6 + sin(lt * 0.5) * 0.5; R.root.rotation.x = 0.55; fans.forEach(f => { f.rotation.y = lt * 14; }); } };
  };

  M3.c3_vault = pal => {
    const R = rig(pal), T = R.T, steel = MC("#aab6c4", { gloss: 0.9, hi: "#ffffff", dark: "#10161e" }), dsteel = MC("#6a7686", { gloss: 0.6, dark: "#050810" }), gold = GOLDM();
    R.model.add(rbox(4.2, 4.2, 0.5, 0.25, MC("#3a4352", { gloss: 0.5, dark: "#000" }), 0.08));
    const door = new T.Group(); door.position.z = 0.35; R.model.add(door);
    const disc = new T.Mesh(new T.CylinderGeometry(1.75, 1.75, 0.45, 72), steel); disc.rotation.x = PI / 2; door.add(disc);
    const rim = new T.Mesh(new T.TorusGeometry(1.75, 0.11, 16, 72), gold); rim.position.z = 0.22; door.add(rim);
    const rec = new T.Mesh(new T.CylinderGeometry(1.25, 1.25, 0.12, 64), dsteel); rec.rotation.x = PI / 2; rec.position.z = 0.24; door.add(rec);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, b = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.3, 14), gold); b.rotation.x = PI / 2; b.position.set(cos(a) * 1.5, sin(a) * 1.5, 0.3); door.add(b); }
    const dial = new T.Group(); dial.position.z = 0.4; door.add(dial);
    const tor = new T.Mesh(new T.TorusGeometry(0.7, 0.07, 14, 56), gold); dial.add(tor);
    for (let i = 0; i < 4; i++) { const sp = new T.Mesh(new T.BoxGeometry(1.5, 0.1, 0.1), gold); sp.rotation.z = i * PI / 4; dial.add(sp); [-1, 1].forEach(sg => { const k = new T.Mesh(new T.SphereGeometry(0.13, 16, 12), gold); k.position.set(cos(i * PI / 4) * 0.75 * sg, sin(i * PI / 4) * 0.75 * sg, 0); dial.add(k); }); }
    const hub = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.14, 28), MC("#c0182a", { gloss: 0.9 })); hub.rotation.x = PI / 2; hub.position.z = 0.08; dial.add(hub);
    [1.0, -1.0].forEach(y => { const h = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.7, 16), dsteel); h.position.set(-1.95, y, 0.3); R.model.add(h); });
    R.fit(3.6);
    return { sc: R.sc, up: lt => { dial.rotation.z = lt * 0.8; R.root.rotation.y = sin(lt * 0.6) * 0.5; R.root.rotation.x = 0.1; } };
  };

  M3.c3_rocket = pal => {
    const R = rig(pal), T = R.T, white = MC("#f4f7fa", { gloss: 0.9, dark: "#222c36" }), red = MC("#e6192d", { gloss: 0.95, hi: "#ff9aa8", dark: "#3a0008" }), g = new T.Group(); R.model.add(g);
    g.add(new T.Mesh(lathe([[0, -1.5], [0.45, -1.5], [0.55, -1.2], [0.6, -0.4], [0.58, 0.6], [0.52, 1.0]], 48), white));
    g.add(new T.Mesh(lathe([[0.52, 1.0], [0.45, 1.3], [0.22, 1.9], [0, 2.2]], 48), red));
    [-0.2, 0.2].forEach(y => { const r = new T.Mesh(new T.TorusGeometry(0.595, 0.03, 10, 48), red); r.rotation.x = PI / 2; r.position.y = y; g.add(r); });
    const win = new T.Mesh(new T.SphereGeometry(0.22, 24, 18), MC("#3aa0ff", { gloss: 1, hi: "#d0ecff", dark: "#001a3a" })); win.position.set(0, 0.55, 0.5); win.scale.z = 0.6; g.add(win); const wr = new T.Mesh(new T.TorusGeometry(0.24, 0.04, 10, 32), GOLDM()); wr.position.set(0, 0.55, 0.56); g.add(wr);
    for (let i = 0; i < 3; i++) { const sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(0.75, -0.5); sh.lineTo(0.75, -1.1); sh.lineTo(0, -0.7); sh.closePath(); const f = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: false }), red), p = new T.Group(); f.position.set(0.5, -0.4, -0.04); p.add(f); p.rotation.y = i / 3 * TAU; g.add(p); }
    const noz = new T.Mesh(new T.CylinderGeometry(0.32, 0.4, 0.3, 32), MC("#2b3340", { gloss: 0.6 })); noz.position.y = -1.65; g.add(noz);
    const fl = new T.Mesh(new T.ConeGeometry(0.34, 1.5, 24), new T.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0.9 })); fl.rotation.x = PI; fl.position.y = -2.5; g.add(fl); const fl2 = new T.Mesh(new T.ConeGeometry(0.18, 1.0, 20), new T.MeshBasicMaterial({ color: 0xffe9a0 })); fl2.rotation.x = PI; fl2.position.y = -2.25; g.add(fl2);
    const puffs = []; for (let i = 0; i < 6; i++) { const p = new T.Mesh(new T.SphereGeometry(0.28, 14, 10), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })); g.add(p); puffs.push(p); }
    g.rotation.z = -0.5; R.fit(4.0);
    return { sc: R.sc, up: lt => { g.position.y = sin(lt * 2.4) * 0.08; g.rotation.y = lt * 0.6; const f = 1 + 0.2 * sin(lt * 30) + 0.1 * sin(lt * 17); fl.scale.set(1, f, 1); fl2.scale.set(1, f * 1.1, 1); puffs.forEach((p, i) => { const a = (lt * 0.7 + i / 6) % 1; p.position.set(sin(i * 2) * 0.3 * a, -2.2 - a * 1.8, cos(i * 2) * 0.3 * a); p.scale.setScalar(0.4 + a * 1.1); p.material.opacity = (1 - a) * 0.5; }); } };
  };

  M3.c3_candles = pal => {
    const R = rig(pal), T = R.T, floor = canvasTex(512, 512, (x, w, h) => { x.fillStyle = "#0a1226"; x.fillRect(0, 0, w, h); x.strokeStyle = "rgba(76,201,240,.35)"; x.lineWidth = 2; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); } });
    const fm = new T.Mesh(new T.BoxGeometry(6.2, 0.12, 3.0), [0, 1, 2, 3, 4, 5].map(i => i === 2 ? new T.MeshStandardMaterial({ map: floor.tex, roughness: 0.8 }) : new T.MeshStandardMaterial({ color: "#0a1226" }))); fm.position.y = -0.06; R.model.add(fm);
    const O = [0.2, 0.6, 0.45, 0.9, 0.75, 1.3, 1.1, 1.8], C = [0.6, 0.45, 0.9, 0.75, 1.3, 1.1, 1.8, 2.5], bodies = [];
    O.forEach((o, i) => { const up = C[i] >= o, col = up ? "#19d37a" : "#ff3b57", mat = MC(col, { gloss: 1, hi: "#ffffff", dark: "#001a0c" }), h = Math.max(0.15, Math.abs(C[i] - o)), g = new T.Group(); const b = new T.Mesh(new T.BoxGeometry(0.5, h, 0.5), mat); b.position.y = Math.min(o, C[i]) + h / 2; const wk = new T.Mesh(new T.BoxGeometry(0.06, h + 0.5, 0.06), mat); wk.position.y = b.position.y; g.add(wk, b); g.position.x = (i - 3.5) * 0.75; R.model.add(g); bodies.push(g); });
    const arrow = new T.Group(), am = MC("#19d37a", { gloss: 1, hi: "#c8ffe0", dark: "#001a0c" }); const sh = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 2.6, 16), am); sh.rotation.z = -PI / 2.8; const hd = new T.Mesh(new T.ConeGeometry(0.3, 0.7, 20), am); hd.position.set(1.15, 1.0, 0); hd.rotation.z = -PI / 2.8; arrow.add(sh, hd); arrow.position.set(-0.4, 2.4, 0.2); R.model.add(arrow);
    R.fit(4.2);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.4 + sin(lt * 0.5) * 0.4; R.root.rotation.x = 0.25; bodies.forEach((b, i) => { b.scale.y = 1 + 0.08 * sin(lt * 2 + i); }); arrow.position.y = 2.4 + sin(lt * 2) * 0.12; } };
  };

  M3.c3_card = pal => {
    const R = rig(pal), T = R.T, ft = canvasTex(1024, 646, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#1a1050"); g.addColorStop(0.5, "#3a1c8a"); g.addColorStop(1, "#0e5aa8"); x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = "rgba(255,255,255,.12)"; x.lineWidth = 3; for (let i = 0; i < 9; i++) { x.beginPath(); for (let k = 0; k <= 40; k++) { const px = k / 40 * w, py = h * 0.55 + i * 22 + sin(k * 0.35 + i * 0.6) * 38; k ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
      x.fillStyle = "#f2c94c"; x.beginPath(); x.moveTo(80, 190); x.lineTo(210, 190); x.quadraticCurveTo(230, 190, 230, 210); x.lineTo(230, 290); x.quadraticCurveTo(230, 310, 210, 310); x.lineTo(100, 310); x.quadraticCurveTo(80, 310, 80, 290); x.closePath(); x.fill(); x.strokeStyle = "#8a5a0a"; x.lineWidth = 3; x.beginPath(); x.moveTo(80, 250); x.lineTo(230, 250); x.moveTo(155, 190); x.lineTo(155, 310); x.stroke();
      x.strokeStyle = "rgba(255,255,255,.8)"; x.lineWidth = 6; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(290, 250, 26 + i * 20, -0.7, 0.7); x.stroke(); }
      x.fillStyle = "#fff"; x.font = "700 62px " + MONO; x.textAlign = "left"; x.fillText("•••• •••• •••• 4242", 70, 440); x.font = "700 30px " + MONO; x.fillStyle = "rgba(255,255,255,.75)"; x.fillText("CRYPTO CARD", 70, 100); x.fillText("VALID 12/30", 70, 560);
      x.fillStyle = "#f7931a"; x.beginPath(); x.arc(850, 130, 62, 0, TAU); x.fill(); x.save(); x.translate(850, 134); btcSym(x, 36); x.restore();
    });
    const body = rbox(3.4, 2.15, 0.06, 0.18, MC("#14102e", { gloss: 0.9, dark: "#000" }), 0.02); R.model.add(body);
    const fm = new T.Mesh(new T.PlaneGeometry(3.3, 2.05), new T.MeshBasicMaterial({ map: ft.tex })); fm.position.z = 0.056; R.model.add(fm);
    const bm = new T.Mesh(new T.PlaneGeometry(3.3, 2.05), new T.MeshBasicMaterial({ color: 0x0b0820 })); bm.position.z = -0.056; bm.rotation.y = PI; R.model.add(bm); const stripe = new T.Mesh(new T.PlaneGeometry(3.3, 0.4), new T.MeshBasicMaterial({ color: 0x000000 })); stripe.position.set(0, 0.5, -0.057); stripe.rotation.y = PI; R.model.add(stripe);
    const shine = new T.Mesh(new T.PlaneGeometry(0.5, 2.2), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })); shine.position.z = 0.06; shine.rotation.z = 0.4; R.model.add(shine);
    R.fit(3.7);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.7) * 0.8; R.root.rotation.x = -0.15 + sin(lt * 0.9) * 0.1; R.pv.position.y = sin(lt * 1.6) * 0.06; shine.position.x = ((lt * 0.5) % 1 - 0.5) * 4; } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ
     ========================================================== */
  const bgFns = { c_chain: bgChain, c_hash: bgHash, c_price: bgPrice, c_net: bgNet, c_coins: bgCoins, c_vault: bgVault, c_ledger: bgLedger, c_moon: bgMoon, c_qr: bgQr, c_flow: bgFlow };
  const shapeFns = { cs_coin: aCoin, cs_chart: aChart, cs_chain: aChain, cs_mining: aMining, cs_wallet: aWallet, cs_lock: aLock, cs_swap: aSwap, cs_rocket: aRocket, cs_nodes: aNodes, cs_gem: aGem };
  const names = {
    c_chain: "Блокчейн", c_hash: "Хеш-дождь", c_price: "График цены", c_net: "Децентрализованная сеть", c_coins: "Дождь из монет", c_vault: "Цифровое хранилище", c_ledger: "Лента транзакций", c_moon: "К луне", c_qr: "QR-матрица", c_flow: "Потоки ликвидности",
    cs_coin: "Вращающаяся монета", cs_chart: "Рост графика", cs_chain: "Добавление блока", cs_mining: "Майнинг", cs_wallet: "Кошелёк и монеты", cs_lock: "Защита ключей", cs_swap: "Обмен токенов", cs_rocket: "Ракета к луне", cs_nodes: "Сеть узлов", cs_gem: "Цифровой кристалл",
    c3_btc: "Золотая монета 3D", c3_eth: "Кристалл токена 3D", c3_chain: "Цепочка блоков 3D", c3_wallet: "Кошелёк 3D", c3_ledger: "Аппаратный кошелёк 3D", c3_rig: "Майнинг-ферма 3D", c3_vault: "Сейф 3D", c3_rocket: "Ракета 3D", c3_candles: "Свечи и стрелка 3D", c3_card: "Крипто-карта 3D"
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

  const DOMAIN = "Криптовалюта";
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
    addCard({ id, cat: "Фон", name: "Крипто: " + names[id], tags: "криптовалюта биткоин блокчейн фон " + names[id], mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "whoosh" }], layers: [{ type: "text", fx: "words", text: "Криптовалюта *будущего*", y: 0.5, size: 0.09 }] }) });
  });
  Object.keys(ICONS).forEach(id => {
    ICO[id] = ICONS[id][1]; ICN.push([id, ICONS[id][0]]);
    addCard({ id: "ico_" + id, cat: "Иконка", name: "Крипто: " + ICONS[id][0], tags: "криптовалюта биткоин иконка " + id + " " + ICONS[id][0], mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: 0.5, size: 0.4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "coin" }], layers: [{ type: "icon", name: id, y: 0.45, size: 0.4 }] }) });
  });
  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_" + id, cat: "Анимация", name: "Крипто: " + names[id], tags: "криптовалюта биткоин анимация " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: 0.5, y: 0.5, size: 0.48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "shape", shape: id, x: 0.5, y: 0.42, size: 0.8 }] }) });
  });
  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_" + id, cat: "3D", name: "Крипто: " + names[id], tags: "криптовалюта биткоин 3d три д " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: 0.5, y: 0.5, size: 0.52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: 0.1, id: "coin" }], layers: [{ type: "three", model: id, x: 0.5, y: 0.42, size: 0.85 }] }) });
  });
  try { if (typeof filt === "function") filt(); } catch (e) {}
  try { const sel = document.getElementById("catfilter"); if (sel && !Array.from(sel.options).some(o => o.value === DOMAIN)) { const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o); } } catch (e) {}

  const HINT = "ПАК КРИПТОВАЛЮТА (используй для криптовалют, блокчейна, трейдинга, майнинга, финтеха, безопасности активов): фоны c_chain (блокчейн), c_hash (хеши, майнинг), c_price (график цены, трейдинг), c_net (децентрализация), c_coins (монеты, богатство), c_vault (хранение, безопасность), c_ledger (транзакции), c_moon (рост, «к луне»), c_qr (платежи, адреса), c_flow (DeFi, ликвидность). Анимации shape: cs_coin, cs_chart, cs_chain, cs_mining, cs_wallet, cs_lock, cs_swap, cs_rocket, cs_nodes, cs_gem. Иконки icon: bitcoin, coins, chain, block, candlestick, hash, pickaxe, qrcode, swap, vault. 3D three.model: c3_btc, c3_eth, c3_chain, c3_wallet, c3_ledger, c3_rig, c3_vault, c3_rocket, c3_candles, c3_card. Не обещай доходность и не называй гарантированную прибыль: криптовалюты рискованны.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u, o) { try { if (o && typeof o.body === "string" && /\/director$/.test(String(u))) { const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n") + "\n" + (b.hint || ""); o.body = JSON.stringify(b); } } catch (e) {} return _f.apply(this, arguments); };
  }
  window.__hintPatch.push(HINT);
})();