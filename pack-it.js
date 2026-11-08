/* ==========================================================
   MOTION STUDIO · ПАК «IT»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-it.js"></script>
   (после основного <script>, рядом с другими паками).
   Все изображения нарисованы кодом; логотипы брендов не используются.
   ========================================================== */
(function () {
  "use strict";
  if (window.__packIT) return;

  const need = ["BG", "ICO", "ICN", "N", "SHP", "TH3", "LIB", "BUSY", "drawBg", "drawShape", "thBuild", "clamp", "eo", "ob", "rnd"];
  const missing = need.filter(n => { try { return typeof (0, eval)(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «IT» не подключён, нет:", missing.join(", ")); return; }
  window.__packIT = true;

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
  const CYAN = "#22d3ee", GREEN = "#19d37a", RED = "#ff3b57", VIOLET = "#8a6bff", AMBER = "#ffb020", PINK = "#ff5c8a";

  /* облако (контур собирается из кругов и основания; заливку делает вызывающий код) */
  function cloudPath(c, x, y, s) {
    c.beginPath();
    [[-0.48, 0.08, 0.3], [-0.1, -0.16, 0.44], [0.38, 0, 0.34], [-0.62, 0.26, 0.17], [0.6, 0.25, 0.17]].forEach(q => { c.moveTo(x + (q[0] + q[2]) * s, y + q[1] * s); c.arc(x + q[0] * s, y + q[1] * s, q[2] * s, 0, TAU); });
    c.rect(x - 0.62 * s, y + 0.1 * s, 1.22 * s, 0.33 * s);
  }
  /* щит */
  function shieldPath(c, S) {
    c.beginPath(); c.moveTo(0, -S); c.lineTo(S * 0.85, -S * 0.68); c.lineTo(S * 0.85, S * 0.1);
    c.bezierCurveTo(S * 0.85, S * 0.62, S * 0.42, S * 0.92, 0, S * 1.08); c.bezierCurveTo(-S * 0.42, S * 0.92, -S * 0.85, S * 0.62, -S * 0.85, S * 0.1);
    c.lineTo(-S * 0.85, -S * 0.68); c.closePath();
  }
  /* частично дорисованная ломаная (галочки) */
  function polyPartial(c, pts, f) {
    let tot = 0; const L = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
    let d = tot * f; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) { const l = L[i - 1]; if (d >= l) { c.lineTo(pts[i][0], pts[i][1]); d -= l; } else { const k = d / l; c.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k); break; } }
    c.stroke();
  }
  const glowBg = (c, R, col, a) => { const g = c.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 1.5); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-R * 1.6, -R * 1.6, R * 3.2, R * 3.2); };

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */
  function bgCode(c, w, h, t, pal) {
    const rows = 20, rh = h / rows, s = t * rh * 1.5, base = Math.floor(s / rh), off = s % rh, px = rh * 0.4, gut = w * 0.11, cols = [pal[1], VIOLET, CYAN, AMBER, GREEN, PINK];
    c.fillStyle = rgba(pal[1], 0.05); c.fillRect(0, 0, gut, h); c.fillStyle = rgba(pal[1], 0.07); c.fillRect(gut, h / 2 - rh / 2, w - gut, rh);
    let ex = gut, bd = 1e9;
    for (let r = -1; r <= rows; r++) {
      const idx = base + r, y = r * rh - off + rh / 2, f = clamp(y / h), a = 0.2 + 0.7 * clamp(1 - Math.abs(f - 0.5) * 1.5);
      txt(c, String(Math.abs(idx) + 1), gut * 0.8, y, px, rgba(pal[1], a * 0.5), 700, "right", MONO);
      let x = gut + w * 0.03 + Math.floor(rnd(idx * 3.7) * 4) * w * 0.035; const n = rnd(idx * 9.3) < 0.15 ? 0 : 2 + Math.floor(rnd(idx * 5.1) * 4);
      for (let k = 0; k < n; k++) { const tw = w * (0.035 + 0.1 * rnd(idx * 13 + k * 2.3)); c.fillStyle = rgba(cols[Math.floor(rnd(idx * 7 + k * 1.9) * cols.length)], a * 0.8); rrect(c, x, y - px * 0.4, tw, px * 0.8, px * 0.25); c.fill(); x += tw + w * 0.016; }
      if (Math.abs(y - h / 2) < bd) { bd = Math.abs(y - h / 2); ex = x; }
    }
    if (sin(t * 6) > 0) { c.fillStyle = "#fff"; c.fillRect(ex, h / 2 - rh * 0.35, Math.max(2, w * 0.005), rh * 0.7); }
  }

  function bgBinary(c, w, h, t, pal) {
    const cols = 22, cw = w / cols, px = cw * 0.9, rh = px * 1.3, rows = h / rh, L = 18, col = pal[1], hi = mixc(col, "#ffffff", 0.5);
    c.font = "700 " + px + "px " + MONO; c.textAlign = "center"; c.textBaseline = "middle";
    for (let i = 0; i < cols; i++) {
      const sp = 5 + 9 * rnd(i + 2), head = (rnd(i) * 60 + t * sp) % (rows + L + 6), x = (i + 0.5) * cw, hf = Math.floor(head);
      for (let k = 0; k < L; k++) {
        const r = head - k; if (r < -1 || r > rows + 1) continue;
        c.fillStyle = k === 0 ? "#ffffff" : rgba(k < 3 ? hi : col, (1 - k / L) * 0.85);
        c.fillText(rnd(i * 31 + (hf - k) * 1.7 + Math.floor(t * 3)) > 0.5 ? "1" : "0", x, r * rh);
      }
    }
  }

  function bgCircuit(c, w, h, t, pal) {
    const col = pal[1], g = Math.min(w, h) * 0.07, N = 26; c.lineCap = "round"; c.lineJoin = "round";
    for (let i = 0; i < N; i++) {
      let x = Math.floor(rnd(i) * (w / g)) * g, y = Math.floor(rnd(i + 9) * (h / g)) * g, d = Math.floor(rnd(i + 3) * 8);
      const P = [[x, y]], S = []; let L = 0;
      for (let k = 0; k < 5; k++) { const len = (1 + Math.floor(rnd(i * 5 + k) * 3)) * g, a = d * PI / 4; x += cos(a) * len; y += sin(a) * len; P.push([x, y]); S.push(len); L += len; d = (d + (rnd(i * 7 + k * 1.3) > 0.5 ? 1 : 7)) % 8; }
      c.strokeStyle = rgba(col, 0.28); c.lineWidth = Math.max(1.5, w * 0.004); c.beginPath(); P.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      [P[0], P[5]].forEach((p, e) => { c.strokeStyle = rgba(col, 0.7); c.lineWidth = Math.max(1.5, w * 0.003); c.beginPath(); c.arc(p[0], p[1], g * (e ? 0.12 : 0.16), 0, TAU); c.stroke(); if (!e) { c.fillStyle = rgba(col, 0.5); c.beginPath(); c.arc(p[0], p[1], g * 0.06, 0, TAU); c.fill(); } });
      let rem = ((t * 0.18 + rnd(i + 20)) % 1) * L, qx = P[0][0], qy = P[0][1];
      for (let k = 0; k < 5; k++) { if (rem <= S[k]) { const f = rem / S[k]; qx = P[k][0] + (P[k + 1][0] - P[k][0]) * f; qy = P[k][1] + (P[k + 1][1] - P[k][1]) * f; break; } rem -= S[k]; qx = P[k + 1][0]; qy = P[k + 1][1]; }
      c.save(); c.shadowColor = col; c.shadowBlur = w * 0.025; c.fillStyle = "#fff"; c.beginPath(); c.arc(qx, qy, w * 0.0065, 0, TAU); c.fill(); c.restore();
    }
    const s = Math.min(w, h) * 0.13, cx = w / 2, cy = h / 2, pu = 0.5 + 0.5 * sin(t * 2);
    c.fillStyle = pal[0]; rrect(c, cx - s, cy - s, s * 2, s * 2, s * 0.14); c.fill(); c.fillStyle = rgba(col, 0.1 + 0.08 * pu); c.fill(); c.strokeStyle = rgba(col, 0.8); c.lineWidth = Math.max(2, w * 0.005); c.stroke();
    c.lineWidth = Math.max(1.5, w * 0.004); c.strokeStyle = rgba(col, 0.7);
    for (let i = 0; i < 8; i++) { const q = -s + (i + 0.5) * s * 0.25; c.beginPath(); c.moveTo(cx + q, cy - s); c.lineTo(cx + q, cy - s * 1.18); c.moveTo(cx + q, cy + s); c.lineTo(cx + q, cy + s * 1.18); c.moveTo(cx - s, cy + q); c.lineTo(cx - s * 1.18, cy + q); c.moveTo(cx + s, cy + q); c.lineTo(cx + s * 1.18, cy + q); c.stroke(); }
    c.strokeStyle = rgba(col, 0.4 + 0.4 * pu); rrect(c, cx - s * 0.5, cy - s * 0.5, s, s, s * 0.08); c.stroke(); txt(c, "IT", cx, cy, s * 0.5, rgba("#ffffff", 0.7 + 0.3 * pu), 900, "center", MONO);
  }

  function bgServer(c, w, h, t, pal) {
    const col = pal[1], rw = w * 0.3, pitch = rw * 1.25, units = 16, y0 = h * 0.05, uh = h * 0.9 / units, sp = w * 0.035, off = (t * sp) % pitch, k0 = Math.floor(t * sp / pitch);
    c.lineWidth = Math.max(1, w * 0.002);
    for (let i = -1; i < w / pitch + 2; i++) {
      const x = i * pitch - off + pitch * 0.1, k = i + k0;
      c.fillStyle = rgba(col, 0.05); c.strokeStyle = rgba(col, 0.35); rrect(c, x, y0 - uh * 0.3, rw, h * 0.9 + uh * 0.6, rw * 0.04); c.fill(); c.stroke();
      for (let u = 0; u < units; u++) {
        const uy = y0 + u * uh; c.fillStyle = rgba(col, 0.09); c.strokeStyle = rgba(col, 0.22); rrect(c, x + rw * 0.05, uy + uh * 0.1, rw * 0.9, uh * 0.8, uh * 0.1); c.fill(); c.stroke();
        c.strokeStyle = rgba(col, 0.3); c.beginPath(); for (let v = 0; v < 6; v++) { c.moveTo(x + rw * (0.1 + v * 0.035), uy + uh * 0.3); c.lineTo(x + rw * (0.1 + v * 0.035), uy + uh * 0.7); } c.stroke();
        for (let l = 0; l < 3; l++) {
          const s = rnd(k * 53 + u * 7 + l * 1.3), on = sin(t * (1.5 + 4 * s) + s * 20) > (l === 0 ? -0.6 : 0.3), cl = l === 0 ? GREEN : (s > 0.9 ? RED : s > 0.7 ? AMBER : col), lx = x + rw * (0.62 + l * 0.1), ly = uy + uh * 0.5;
          if (on) { c.fillStyle = rgba(cl, 0.25); c.beginPath(); c.arc(lx, ly, uh * 0.22, 0, TAU); c.fill(); }
          c.fillStyle = rgba(cl, on ? 0.95 : 0.15); c.beginPath(); c.arc(lx, ly, uh * 0.1, 0, TAU); c.fill();
        }
      }
    }
    const sy = (t * h * 0.25) % h, gr = c.createLinearGradient(0, sy - h * 0.04, 0, sy + h * 0.04); gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(0.5, rgba(col, 0.2)); gr.addColorStop(1, rgba(col, 0)); c.fillStyle = gr; c.fillRect(0, sy - h * 0.04, w, h * 0.08);
  }

  function bgCloud(c, w, h, t, pal) {
    const col = pal[1];
    for (let i = 0; i < 9; i++) {
      const x = w * (0.06 + i * 0.11), top = h * (0.4 + 0.1 * rnd(i)), up = i % 2 === 0;
      c.strokeStyle = rgba(col, 0.22); c.lineWidth = Math.max(1, w * 0.003); c.setLineDash([w * 0.012, w * 0.012]); c.beginPath(); c.moveTo(x, h * 0.97); c.lineTo(x, top); c.stroke(); c.setLineDash([]);
      c.fillStyle = rgba(col, 0.35); rrect(c, x - w * 0.025, h * 0.965, w * 0.05, h * 0.03, w * 0.006); c.fill();
      for (let j = 0; j < 3; j++) { const u = (t * 0.28 * (0.6 + rnd(i + 3)) + j / 3) % 1, y = h * 0.96 + (top - h * 0.96) * (up ? u : 1 - u), a = clamp(Math.min(u, 1 - u) * 6); c.fillStyle = rgba(up ? col : "#ffffff", 0.9 * a); rrect(c, x - w * 0.009, y - w * 0.013, w * 0.018, w * 0.026, w * 0.004); c.fill(); }
    }
    for (let i = 0; i < 6; i++) {
      const d = rnd(i + 3), s = w * (0.18 + 0.22 * d), x = ((rnd(i) * w * 1.5 + t * w * 0.025 * (0.4 + d)) % (w * 1.5)) - w * 0.25, y = h * (0.1 + 0.32 * rnd(i + 6));
      cloudPath(c, x, y, s); const g = c.createLinearGradient(0, y - s * 0.5, 0, y + s * 0.45); g.addColorStop(0, rgba("#ffffff", 0.1 + 0.2 * d)); g.addColorStop(1, rgba(col, 0.06 + 0.12 * d)); c.fillStyle = g; c.fill();
      if (d > 0.5) { const q = s * 0.12, by = y + s * 0.12 + sin(t * 2 + i) * q * 0.3; c.strokeStyle = rgba("#ffffff", 0.55); c.lineWidth = Math.max(2, s * 0.025); c.lineCap = "round"; c.beginPath(); c.moveTo(x, by + q); c.lineTo(x, by - q); c.moveTo(x - q * 0.7, by - q * 0.3); c.lineTo(x, by - q); c.lineTo(x + q * 0.7, by - q * 0.3); c.stroke(); }
    }
  }

  const TERM = ["$ git pull origin main", "Already up to date.", "$ npm install", "added 1284 packages in 12s", "$ npm run build", "[ OK ] compiled 214 modules", "[WARN] chunk size exceeds 500 kB", "$ docker build -t app .", "[ OK ] image built: app:latest", "$ kubectl rollout restart web", "deployment.apps/web restarted", "$ pytest -q", "[ OK ] 128 passed in 4.2s", "$ ssh deploy@prod", "[ERR] connection timed out", "[ OK ] retry succeeded"];
  function bgTerminal(c, w, h, t, pal) {
    const col = pal[1], px = Math.min(h * 0.028, w * 0.042), rh = px * 1.9, bar = rh * 1.3, rows = Math.max(1, Math.floor((h - bar) / rh)), per = 0.85, n = Math.floor(t / per), fr = (t / per) % 1, pad = w * 0.04;
    c.fillStyle = rgba(col, 0.1); c.fillRect(0, 0, w, bar);
    [RED, AMBER, GREEN].forEach((cl, i) => { c.fillStyle = rgba(cl, 0.85); c.beginPath(); c.arc(pad + i * bar * 0.5 + bar * 0.2, bar / 2, bar * 0.15, 0, TAU); c.fill(); });
    txt(c, "bash — deploy@prod", w / 2, bar / 2, px * 0.8, rgba(col, 0.6), 700, "center", MONO);
    for (let j = 0; j < rows; j++) {
      const idx = n - (rows - 1) + j; if (idx < 0) continue;
      const full = TERM[idx % TERM.length], cur = idx === n, s = cur ? full.slice(0, Math.floor(full.length * clamp(fr * 1.6))) : full, y = bar + j * rh + rh / 2;
      const cl = full[0] === "$" ? col : full.startsWith("[ OK") ? GREEN : full.startsWith("[WARN") ? AMBER : full.startsWith("[ERR") ? RED : "#aab6c4";
      txt(c, s, pad, y, px, rgba(cl, cur ? 1 : 0.35 + 0.5 * (j / rows)), 700, "left", MONO);
      if (cur && sin(t * 8) > -0.3) { c.fillStyle = rgba(col, 0.9); c.fillRect(pad + px * 0.6 * s.length + px * 0.1, y - px * 0.55, px * 0.55, px * 1.1); }
    }
  }

  function bgGlobe(c, w, h, t, pal) {
    const col = pal[1], cx = w / 2, cy = h * 0.5, R = Math.min(w, h) * 0.38, a = t * 0.35, tl = 0.4, ct = cos(tl), st = sin(tl);
    const sph = (la, lo) => [cos(la) * sin(lo), sin(la), cos(la) * cos(lo)];
    const rot = v => { const x = v[0] * cos(a) + v[2] * sin(a), z = -v[0] * sin(a) + v[2] * cos(a), y = v[1]; return [x, y * ct - z * st, y * st + z * ct]; };
    const pr = v => [cx + v[0] * R, cy - v[1] * R];
    const hg = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.45); hg.addColorStop(0, rgba(col, 0.25)); hg.addColorStop(1, rgba(col, 0)); c.fillStyle = hg; c.fillRect(0, 0, w, h);
    const dg = c.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); dg.addColorStop(0, rgba(col, 0.18)); dg.addColorStop(1, rgba(col, 0.03)); c.fillStyle = dg; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
    const fr = [], bk = [], addLine = pts => { for (let i = 0; i < pts.length - 1; i++) { const p = pts[i], q = pts[i + 1]; (p[2] + q[2] > 0 ? fr : bk).push([pr(p), pr(q)]); } };
    for (let la = -60; la <= 60; la += 30) { const pts = []; for (let k = 0; k <= 48; k++) pts.push(rot(sph(la * PI / 180, k / 48 * TAU))); addLine(pts); }
    for (let lo = 0; lo < 360; lo += 30) { const pts = []; for (let k = 0; k <= 18; k++) pts.push(rot(sph((-90 + k * 10) * PI / 180, lo * PI / 180))); addLine(pts); }
    const drawSegs = (arr, al) => { c.strokeStyle = rgba(col, al); c.lineWidth = Math.max(1, w * 0.0025); c.beginPath(); arr.forEach(s => { c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); }); c.stroke(); };
    drawSegs(bk, 0.07); drawSegs(fr, 0.4);
    const CN = 16, city = []; for (let i = 0; i < CN; i++) city.push([(rnd(i) * 2 - 1) * 1.1, rnd(i + 9) * TAU]);
    for (let i = 0; i < 8; i++) {
      const A = sph(city[i][0], city[i][1]), B = sph(city[(i * 5 + 3) % CN][0], city[(i * 5 + 3) % CN][1]);
      const at = u => { let x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u, z = A[2] + (B[2] - A[2]) * u; const l = Math.hypot(x, y, z) || 1, k = (1 + 0.22 * sin(PI * u)) / l; return rot([x * k, y * k, z * k]); };
      c.strokeStyle = rgba(col, 0.6); c.lineWidth = Math.max(1.5, w * 0.003); c.beginPath(); let pen = false;
      for (let k = 0; k <= 24; k++) { const p = at(k / 24); if (p[2] > 0) { const q = pr(p); pen ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); pen = true; } else pen = false; }
      c.stroke();
      const pk = at((t * 0.35 + rnd(i) * 3) % 1); if (pk[2] > 0) { const q = pr(pk); c.fillStyle = "#fff"; c.beginPath(); c.arc(q[0], q[1], w * 0.006, 0, TAU); c.fill(); }
    }
    for (let i = 0; i < CN; i++) { const p = rot(sph(city[i][0], city[i][1])); if (p[2] > 0) { const q = pr(p), pu = (t * 0.5 + rnd(i)) % 1; c.fillStyle = "#fff"; c.beginPath(); c.arc(q[0], q[1], w * 0.0065, 0, TAU); c.fill(); c.strokeStyle = rgba(col, (1 - pu) * 0.6); c.beginPath(); c.arc(q[0], q[1], w * (0.008 + 0.02 * pu), 0, TAU); c.stroke(); } }
  }

  function bgShield(c, w, h, t, pal) {
    const col = pal[1], cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.075, hw = s * 1.5, hh = s * Math.sqrt(3), sw = t * 1.1, S = Math.min(w, h) * 0.2, Rm = Math.hypot(w, h) / 2;
    c.lineWidth = Math.max(1, w * 0.002);
    for (let i = -1; i < w / hw + 2; i++) for (let j = -1; j < h / hh + 2; j++) {
      const x = i * hw, y = j * hh + (Math.abs(i) % 2 ? hh / 2 : 0), ang = Math.atan2(y - cy, x - cx), d = (((sw - ang) % TAU) + TAU) % TAU;
      c.strokeStyle = rgba(col, 0.05 + 0.4 * Math.exp(-d * 1.3)); c.beginPath();
      for (let k = 0; k < 6; k++) { const q = k * PI / 3; k ? c.lineTo(x + cos(q) * s * 0.95, y + sin(q) * s * 0.95) : c.moveTo(x + cos(q) * s * 0.95, y + sin(q) * s * 0.95); }
      c.closePath(); c.stroke();
    }
    for (let k = 0; k < 22; k++) { c.fillStyle = rgba(col, 0.13 * (1 - k / 22)); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, Rm, sw - k * 0.06 - 0.06, sw - k * 0.06); c.closePath(); c.fill(); }
    for (let i = 0; i < 8; i++) {
      const per = 3, ph = (t / per + i / 8) % 1, seed = Math.floor(t / per + i / 8), ang = rnd(i * 7.7 + seed) * TAU, ca = cos(ang), sa = sin(ang), rb = S * 1.1;
      if (ph < 0.75) { const r = rb + (Rm * 0.9 - rb) * (1 - ease(ph / 0.75)), x = cx + ca * r, y = cy + sa * r, q = w * 0.014; c.strokeStyle = rgba(RED, 0.35); c.lineWidth = Math.max(1.5, w * 0.003); c.beginPath(); c.moveTo(x, y); c.lineTo(x + ca * q * 4, y + sa * q * 4); c.stroke(); c.save(); c.shadowColor = RED; c.shadowBlur = w * 0.02; c.fillStyle = RED; c.beginPath(); c.moveTo(x, y - q); c.lineTo(x + q, y + q * 0.8); c.lineTo(x - q, y + q * 0.8); c.closePath(); c.fill(); c.restore(); }
      else { const v = (ph - 0.75) / 0.25, x = cx + ca * rb, y = cy + sa * rb; c.strokeStyle = rgba(GREEN, 1 - v); c.lineWidth = Math.max(1.5, w * 0.004); c.beginPath(); c.arc(x, y, S * (0.1 + 0.4 * v), 0, TAU); c.stroke(); if (v < 0.8) txt(c, "BLOCKED", x + ca * S * 0.5, y + sa * S * 0.5, S * 0.12, rgba(GREEN, 1 - v), 800, "center", MONO); }
    }
    c.save(); c.translate(cx, cy); const gg = c.createRadialGradient(0, 0, S * 0.2, 0, 0, S * 1.5); gg.addColorStop(0, rgba(col, 0.3)); gg.addColorStop(1, rgba(col, 0)); c.fillStyle = gg; c.fillRect(-S * 1.6, -S * 1.6, S * 3.2, S * 3.2);
    shieldPath(c, S); c.fillStyle = rgba(pal[0], 0.85); c.fill(); c.fillStyle = rgba(col, 0.18); c.fill(); c.save(); c.shadowColor = col; c.shadowBlur = S * 0.3; c.strokeStyle = col; c.lineWidth = Math.max(2, S * 0.06); c.stroke(); c.restore();
    c.strokeStyle = GREEN; c.lineWidth = S * 0.12; c.lineCap = "round"; c.lineJoin = "round"; polyPartial(c, [[-S * 0.3, 0], [-S * 0.07, S * 0.25], [S * 0.34, -S * 0.22]], 1); c.restore();
  }

  function bgGit(c, w, h, t, pal) {
    const sp = w * 0.11, off = t * w * 0.06, k0 = Math.floor(off / sp) - 2, k1 = k0 + Math.ceil(w / sp) + 5, ys = [0.5, 0.3, 0.7, 0.14, 0.86], lc = [pal[1], VIOLET, CYAN, AMBER, PINK], X = k => k * sp - off, y0 = h * 0.5, lw = Math.max(2, w * 0.006), r = w * 0.018;
    c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = rgba(pal[1], 0.5); c.lineWidth = lw; c.beginPath(); c.moveTo(0, y0); c.lineTo(w, y0); c.stroke();
    const com = []; for (let k = k0; k <= k1; k++) com.push([X(k), y0, pal[1], k]);
    for (let g = Math.floor(k0 / 10) - 1; g <= Math.floor(k1 / 10) + 1; g++) {
      const ln = 1 + Math.floor(rnd(g * 3.1) * 4), st = g * 10 + Math.floor(rnd(g * 3.1 + 1) * 3), en = st + 3 + Math.floor(rnd(g * 3.1 + 2) * 4), y = h * ys[ln], cl = lc[ln];
      if (X(en + 1) < -sp || X(st) > w + sp) continue;
      c.strokeStyle = rgba(cl, 0.65); c.lineWidth = lw; c.beginPath(); c.moveTo(X(st), y0); c.bezierCurveTo(X(st) + sp * 0.6, y0, X(st + 1) - sp * 0.6, y, X(st + 1), y); c.lineTo(X(en), y); c.bezierCurveTo(X(en) + sp * 0.6, y, X(en + 1) - sp * 0.6, y0, X(en + 1), y0); c.stroke();
      for (let k = st + 1; k <= en; k++) com.push([X(k), y, cl, k * 7 + ln]);
    }
    com.forEach(([x, y, cl, k]) => {
      const hot = Math.floor(t * 1.5) % 6 === ((k % 6) + 6) % 6;
      c.fillStyle = pal[0]; c.strokeStyle = cl; c.lineWidth = lw * 0.9; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = rgba(cl, hot ? 0.95 : 0.5); c.beginPath(); c.arc(x, y, r * (hot ? 0.55 : 0.4), 0, TAU); c.fill();
      if (rnd(k * 1.7 + y) > 0.6) txt(c, hexs(k, 7).toLowerCase(), x, y - r * 2.1, w * 0.016, rgba(cl, 0.6), 700, "center", MONO);
    });
    txt(c, "main", w * 0.06, y0 - h * 0.035, w * 0.03, rgba(pal[1], 0.9), 800, "center", MONO);
  }

  function bgNeural(c, w, h, t, pal) {
    const col = pal[1], LY = [4, 6, 7, 6, 3], nl = LY.length, X = l => w * (0.12 + 0.76 * l / (nl - 1)), sy = h * 0.095, Y = (l, j) => h * 0.5 + (j - (LY[l] - 1) / 2) * sy + sin(t * 0.6 + l * 1.7 + j) * h * 0.008, wave = (t * 0.5) % 1.5 - 0.25;
    c.lineWidth = Math.max(1, w * 0.0025);
    for (let l = 0; l < nl - 1; l++) {
      const act = clamp(1 - Math.abs((l + 0.5) / (nl - 1) - wave) * 3), u = clamp((wave - l / (nl - 1)) * (nl - 1));
      for (let i = 0; i < LY[l]; i++) for (let j = 0; j < LY[l + 1]; j++) {
        const wt = rnd(l * 100 + i * 10 + j), neg = wt < 0.35, x0 = X(l), y0 = Y(l, i), x1 = X(l + 1), y1 = Y(l + 1, j);
        c.strokeStyle = rgba(neg ? PINK : col, 0.06 + 0.14 * wt + 0.45 * act * wt); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        if (u > 0 && u < 1 && wt > 0.6) { c.fillStyle = "#fff"; c.beginPath(); c.arc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, w * 0.0045, 0, TAU); c.fill(); }
      }
    }
    for (let l = 0; l < nl; l++) for (let j = 0; j < LY[l]; j++) {
      const act = clamp(1 - Math.abs(l / (nl - 1) - wave) * 4); c.save(); if (act > 0.2) { c.shadowColor = col; c.shadowBlur = w * 0.03 * act; }
      c.fillStyle = act > 0.6 ? "#fff" : rgba(col, 0.25 + 0.6 * act); c.strokeStyle = rgba(col, 0.85); c.lineWidth = Math.max(1.5, w * 0.003); c.beginPath(); c.arc(X(l), Y(l, j), w * 0.018, 0, TAU); c.fill(); c.stroke(); c.restore();
    }
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр (0,0)
     ========================================================== */
  function aLaptop(c, R, lt, pal) {
    const col = pal[1], W = R * 1.7, H = R * 1.08, cy = -R * 0.12, top = cy - H / 2, fl = sin(lt * 2) * R * 0.03;
    glowBg(c, R, col, 0.3); c.save(); c.translate(0, fl);
    c.fillStyle = "#2b3340"; rrect(c, -W / 2, top, W, H, R * 0.1); c.fill(); c.fillStyle = "#070d1c"; rrect(c, -W / 2 + R * 0.07, top + R * 0.07, W - R * 0.14, H - R * 0.14, R * 0.05); c.fill();
    c.fillStyle = "#3a4452"; c.beginPath(); c.arc(0, top + R * 0.035, R * 0.012, 0, TAU); c.fill();
    const by = cy + H / 2, bg = c.createLinearGradient(0, by, 0, by + R * 0.14); bg.addColorStop(0, "#c9d3dc"); bg.addColorStop(1, "#7a8696"); c.fillStyle = bg;
    c.beginPath(); c.moveTo(-W / 2 - R * 0.12, by); c.lineTo(W / 2 + R * 0.12, by); c.lineTo(W / 2 + R * 0.2, by + R * 0.13); c.quadraticCurveTo(0, by + R * 0.2, -W / 2 - R * 0.2, by + R * 0.13); c.closePath(); c.fill();
    c.fillStyle = "#5a6676"; rrect(c, -R * 0.14, by, R * 0.28, R * 0.04, R * 0.02); c.fill();
    const x0 = -W / 2 + R * 0.2, lh = H * 0.105, y0 = top + R * 0.2, cyc = 7 * 0.55 + 2.2, loc = lt % cyc, cl = [col, VIOLET, CYAN, AMBER, GREEN, PINK], ind = [0, 1, 1, 2, 2, 1, 0];
    c.save(); c.globalAlpha *= loc > cyc - 0.5 ? clamp((cyc - loc) / 0.5) : 1; let cx = 0, cyy = 0, any = false;
    for (let l = 0; l < 7; l++) {
      const p = clamp((loc - l * 0.55) / 0.8); if (p <= 0) continue;
      const n = 2 + Math.floor(rnd(l * 5.3) * 3), tw = []; let tot = 0; for (let k = 0; k < n; k++) { tw[k] = R * (0.14 + 0.24 * rnd(l * 7 + k * 1.7)); tot += tw[k] + R * 0.06; }
      const sx = x0 + ind[l] * R * 0.18, vis = tot * p; c.save(); c.beginPath(); c.rect(sx - 2, y0 + l * lh - lh, vis + 2, lh * 2); c.clip();
      let x = sx; for (let k = 0; k < n; k++) { c.fillStyle = cl[Math.floor(rnd(l * 3 + k * 2.9) * cl.length)]; rrect(c, x, y0 + l * lh, tw[k], lh * 0.5, lh * 0.2); c.fill(); x += tw[k] + R * 0.06; }
      c.restore(); cx = sx + vis; cyy = y0 + l * lh; any = true;
    }
    if (any && sin(lt * 9) > 0) { c.fillStyle = "#fff"; c.fillRect(cx + R * 0.03, cyy - lh * 0.15, R * 0.04, lh * 0.8); }
    c.restore(); c.restore();
    txt(c, "</>", R * 0.88, -R * 0.95 + sin(lt * 2.4) * R * 0.04, R * 0.28, col, 900, "center", MONO);
    txt(c, "{ }", -R * 0.98, -R * 0.78 + sin(lt * 2.1 + 1) * R * 0.04, R * 0.24, AMBER, 900, "center", MONO);
  }

  function aCloud(c, R, lt, pal) {
    const col = pal[1], S = R * 1.15, cy0 = -R * 0.28, per = 3, pr = (lt % per) / per;
    glowBg(c, R, col, 0.3);
    [-0.55, 0, 0.55].forEach((px, i) => {
      c.strokeStyle = rgba(col, 0.25); c.lineWidth = R * 0.025; c.setLineDash([R * 0.06, R * 0.06]); c.beginPath(); c.moveTo(px * R, R * 0.95); c.lineTo(px * R, cy0 + S * 0.45); c.stroke(); c.setLineDash([]);
      const u = (lt / 1.6 + i / 3) % 1, y = R * 0.95 + (cy0 + S * 0.45 - R * 0.95) * u, a = u < 0.85 ? 1 : (1 - u) / 0.15;
      c.fillStyle = i % 2 ? rgba("#ffffff", a) : rgba(col, a); rrect(c, px * R - R * 0.07, y - R * 0.07, R * 0.14, R * 0.14, R * 0.03); c.fill();
    });
    c.save(); c.shadowColor = col; c.shadowBlur = R * 0.2; const g = c.createLinearGradient(0, cy0 - S * 0.5, 0, cy0 + S * 0.45); g.addColorStop(0, "#ffffff"); g.addColorStop(1, mixc(col, "#ffffff", 0.55)); c.fillStyle = g; cloudPath(c, 0, cy0, S); c.fill(); c.restore();
    const by = cy0 + S * 0.1 + sin(lt * 4) * R * 0.04; c.strokeStyle = col; c.lineWidth = R * 0.1; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(0, by + R * 0.2); c.lineTo(0, by - R * 0.2); c.moveTo(-R * 0.17, by - R * 0.03); c.lineTo(0, by - R * 0.2); c.lineTo(R * 0.17, by - R * 0.03); c.stroke();
    c.fillStyle = "rgba(255,255,255,.15)"; rrect(c, -R * 0.8, R * 1.05, R * 1.6, R * 0.1, R * 0.05); c.fill(); c.fillStyle = col; rrect(c, -R * 0.8, R * 1.05, Math.max(R * 0.1, R * 1.6 * pr), R * 0.1, R * 0.05); c.fill();
    txt(c, Math.round(pr * 100) + "%", 0, R * 1.3, R * 0.2, "#fff", 900, "center", MONO);
  }

  function aChip(c, R, lt, pal) {
    const col = pal[1], s = R * 0.62, pl = R * 0.28;
    glowBg(c, R, col, 0.3);
    for (let side = 0; side < 4; side++) {
      c.save(); c.rotate(side * PI / 2);
      for (let i = 0; i < 6; i++) {
        const x = (i - 2.5) * s * 0.3; c.strokeStyle = "#c9d3dc"; c.lineWidth = R * 0.06; c.lineCap = "round"; c.beginPath(); c.moveTo(x, -s); c.lineTo(x, -s - pl); c.stroke();
        const u = (lt * 0.9 + rnd(side * 10 + i)) % 1, y = -(s + R * 0.55) + u * (R * 0.55 + s * 0.25); c.fillStyle = rgba("#ffffff", sin(PI * u)); c.beginPath(); c.arc(x, y, R * 0.035, 0, TAU); c.fill();
      }
      c.restore();
    }
    const g = c.createLinearGradient(-s, -s, s, s); g.addColorStop(0, "#27354f"); g.addColorStop(1, "#0b1424"); c.fillStyle = g; rrect(c, -s, -s, s * 2, s * 2, R * 0.12); c.fill(); c.strokeStyle = col; c.lineWidth = R * 0.04; c.stroke();
    c.save(); rrect(c, -s, -s, s * 2, s * 2, R * 0.12); c.clip();
    for (let k = 0; k < 2; k++) { const age = (lt * 0.8 + k / 2) % 1, q = s * 0.3 * (1 + age * 2.2); c.strokeStyle = rgba(col, (1 - age) * 0.6); c.lineWidth = R * 0.03; rrect(c, -q, -q, q * 2, q * 2, R * 0.05); c.stroke(); }
    c.restore();
    c.fillStyle = rgba(col, 0.25 + 0.2 * sin(lt * 3)); rrect(c, -s * 0.55, -s * 0.55, s * 1.1, s * 1.1, R * 0.06); c.fill(); c.strokeStyle = col; c.lineWidth = R * 0.03; c.stroke();
    c.fillStyle = "#c9d3dc"; c.beginPath(); c.arc(-s * 0.8, -s * 0.8, R * 0.03, 0, TAU); c.fill();
    txt(c, "CPU", 0, 0, R * 0.3, "#fff", 900, "center", MONO); txt(c, (3.2 + 0.6 * sin(lt * 1.5)).toFixed(1) + " GHz", 0, s + R * 0.6, R * 0.18, col, 800, "center", MONO);
  }

  function gearPath(c, r, n, hole) {
    const st = TAU / n; c.beginPath();
    for (let i = 0; i < n; i++) { const a = i * st; [[a, 0.86], [a + st * 0.16, 1.14], [a + st * 0.4, 1.14], [a + st * 0.56, 0.86]].forEach((p, j) => { const x = cos(p[0]) * r * p[1], y = sin(p[0]) * r * p[1]; (i || j) ? c.lineTo(x, y) : c.moveTo(x, y); }); }
    c.closePath(); c.moveTo(hole, 0); c.arc(0, 0, hole, 0, TAU, true);
  }
  function drawGear(c, x, y, r, n, rot, col) {
    c.save(); c.translate(x, y); c.rotate(rot); const g = c.createLinearGradient(-r, -r, r, r); g.addColorStop(0, mixc(col, "#ffffff", 0.45)); g.addColorStop(1, mixc(col, "#000000", 0.45)); c.fillStyle = g;
    gearPath(c, r, n, r * 0.32); c.fill("evenodd"); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = r * 0.03; c.stroke();
    c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = r * 0.05; c.beginPath(); c.arc(0, 0, r * 0.62, 0, TAU); c.stroke(); c.restore();
  }
  function aGear(c, R, lt, pal) {
    const r1 = R * 0.55, n1 = 12, n2 = 8, n3 = 9, r2 = r1 * n2 / n1, r3 = r1 * n3 / n1, th = lt * 0.7, f2 = 0.55, f3 = -0.9, p1 = [-R * 0.38 + R * 0.1, -R * 0.05];
    glowBg(c, R, pal[1], 0.28);
    const p2 = [p1[0] + cos(f2) * (r1 + r2), p1[1] + sin(f2) * (r1 + r2)], p3 = [p1[0] + cos(f3) * (r1 + r3), p1[1] + sin(f3) * (r1 + r3)];
    const t2 = f2 + PI - PI / n2 + (f2 - th) * n1 / n2, t3 = f3 + PI - PI / n3 + (f3 - th) * n1 / n3;
    drawGear(c, p1[0], p1[1], r1, n1, th, pal[1]); drawGear(c, p2[0], p2[1], r2, n2, t2, AMBER); drawGear(c, p3[0], p3[1], r3, n3, t3, VIOLET);
    for (let i = 0; i < 4; i++) { const a = lt * 0.6 + i * 1.6; spark(c, p1[0] + cos(a) * R * 1.15, p1[1] + sin(a) * R * 0.95, R * (0.05 + 0.04 * sin(lt * 4 + i)), 0.4 + 0.5 * Math.abs(sin(lt * 3 + i)), "#ffffff"); }
  }
  function spark(c, x, y, r, a, col) { c.save(); c.translate(x, y); c.fillStyle = rgba(col || "#ffffff", a); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.fill(); c.restore(); }

  function drawBug(c, s, ph) {
    c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "#6b0f22"; c.lineWidth = s * 0.075;
    for (let i = 0; i < 3; i++) [-1, 1].forEach(sg => { const y = (i - 1) * s * 0.3 + s * 0.1, sw = sin(ph + i * 2.1 + (sg > 0 ? PI : 0)) * s * 0.12; c.beginPath(); c.moveTo(sg * s * 0.24, y); c.lineTo(sg * s * 0.52, y - s * 0.1 + sw); c.lineTo(sg * s * 0.74, y + s * 0.12 + sw); c.stroke(); });
    c.beginPath(); c.moveTo(-s * 0.08, -s * 0.5); c.quadraticCurveTo(-s * 0.2, -s * 0.8, -s * 0.42, -s * 0.82); c.moveTo(s * 0.08, -s * 0.5); c.quadraticCurveTo(s * 0.2, -s * 0.8, s * 0.42, -s * 0.82); c.stroke();
    const g = c.createRadialGradient(-s * 0.1, 0, s * 0.05, 0, s * 0.1, s * 0.55); g.addColorStop(0, "#ff7a8c"); g.addColorStop(1, "#a3112a"); c.fillStyle = g; c.beginPath(); c.ellipse(0, s * 0.1, s * 0.36, s * 0.52, 0, 0, TAU); c.fill();
    c.fillStyle = "#5a0c1a"; c.beginPath(); c.arc(0, -s * 0.44, s * 0.2, 0, TAU); c.fill(); c.fillStyle = "#fff"; [-1, 1].forEach(sg => { c.beginPath(); c.arc(sg * s * 0.08, -s * 0.48, s * 0.05, 0, TAU); c.fill(); });
    c.strokeStyle = "rgba(0,0,0,.4)"; c.lineWidth = s * 0.04; c.beginPath(); c.moveTo(0, -s * 0.3); c.lineTo(0, s * 0.62); c.stroke();
    c.fillStyle = "#2a0710"; [[-0.17, 0], [0.17, 0], [-0.15, 0.3], [0.15, 0.3]].forEach(p => { c.beginPath(); c.arc(p[0] * s, p[1] * s + s * 0.05, s * 0.07, 0, TAU); c.fill(); });
  }
  function aBug(c, R, lt) {
    const per = 4.2, u = (lt % per) / per, s = R * 0.5, hit = 0.5, ok = u > hit, fade = u > 0.93 ? (1 - u) / 0.07 : 1, P = k => [-R * 0.95 * (1 - k), sin(k * 14) * R * 0.28 * (1 - k)];
    c.save(); c.globalAlpha *= fade; glowBg(c, R, ok ? GREEN : RED, 0.25);
    txt(c, ok ? "FIXED" : "ERROR 500", 0, -R * 0.95, R * 0.2, ok ? GREEN : RED, 900, "center", MONO);
    const k = clamp(u / hit), p0 = P(k), p1 = P(Math.min(1, k + 0.01)), ang = u < hit ? Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) : 0.2, sq = ok ? 1 - 0.75 * ease(clamp((u - hit) / 0.1)) : 1, al = u > 0.62 ? clamp(1 - (u - 0.62) / 0.12) : 1;
    if (al > 0) { c.save(); c.globalAlpha *= al; c.translate(p0[0], p0[1]); c.rotate(ang + PI / 2); c.scale(1 + (1 - sq) * 0.6, sq); drawBug(c, s, u < hit ? lt * 16 : 0); c.restore(); }
    if (ok && u < hit + 0.2) { const f = (u - hit) / 0.2; c.lineWidth = R * 0.04; c.lineCap = "round"; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; c.strokeStyle = rgba(AMBER, 1 - f); c.beginPath(); c.moveTo(cos(a) * R * (0.2 + 0.3 * f), sin(a) * R * (0.2 + 0.3 * f)); c.lineTo(cos(a) * R * (0.35 + 0.6 * f), sin(a) * R * (0.35 + 0.6 * f)); c.stroke(); } }
    if (u > 0.36) { const pu = clamp((u - 0.36) / 0.14), y = -R * 1.3 * (1 - pu * pu), rr = R * 0.3 * (1 + (ok ? 0.12 * sin(clamp((u - hit) / 0.2) * PI) : 0)); c.save(); c.translate(0, y); c.shadowColor = GREEN; c.shadowBlur = R * 0.25; c.fillStyle = GREEN; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.fill(); c.restore(); c.strokeStyle = "#fff"; c.lineWidth = R * 0.07; c.lineCap = "round"; c.lineJoin = "round"; c.save(); c.translate(0, y); polyPartial(c, [[-R * 0.14, 0], [-R * 0.04, R * 0.1], [R * 0.16, -R * 0.12]], 1); c.restore(); }
    c.restore();
  }

  function aShield(c, R, lt, pal) {
    const col = pal[1], per = 4.5, u = (lt % per) / per, S = R * 0.85, scan = clamp(u / 0.55), ck = ease(clamp((u - 0.5) / 0.2)), good = ck > 0.99;
    glowBg(c, R, good ? GREEN : col, 0.3);
    for (let k = 0; k < 3; k++) { const age = (lt * 0.6 + k / 3) % 1; c.strokeStyle = rgba(good ? GREEN : col, (1 - age) * 0.4); c.lineWidth = R * 0.03; c.beginPath(); c.arc(0, 0, R * (0.9 + age * 0.5), 0, TAU); c.stroke(); }
    for (let i = 0; i < 4; i++) { const ph = (lt * 0.7 + i / 4) % 1, ang = i * 1.7 + 0.5 + Math.floor(lt * 0.7 + i / 4) * 0.9, d = ph < 0.6 ? R * 0.95 + R * 0.6 * (1 - ph / 0.6) : R * 0.95 + (ph - 0.6) / 0.4 * R * 0.45, a = ph < 0.6 ? 1 : 1 - (ph - 0.6) / 0.4; c.fillStyle = rgba(RED, a); c.beginPath(); c.arc(cos(ang) * d, sin(ang) * d, R * 0.06, 0, TAU); c.fill(); }
    const g = c.createLinearGradient(-S, -S, S, S); g.addColorStop(0, mixc(col, "#ffffff", 0.35)); g.addColorStop(1, mixc(col, "#000000", 0.45)); shieldPath(c, S); c.save(); c.shadowColor = good ? GREEN : col; c.shadowBlur = R * 0.25; c.fillStyle = g; c.fill(); c.restore();
    c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = R * 0.04; c.stroke(); shieldPath(c, S * 0.8); c.fillStyle = "rgba(0,0,0,.22)"; c.fill();
    if (u < 0.6) { c.save(); shieldPath(c, S); c.clip(); const y = -S + scan * S * 2.2, sg = c.createLinearGradient(0, y - S * 0.3, 0, y + S * 0.3); sg.addColorStop(0, rgba(GREEN, 0)); sg.addColorStop(0.5, rgba(GREEN, 0.6)); sg.addColorStop(1, rgba(GREEN, 0)); c.fillStyle = sg; c.fillRect(-S, y - S * 0.3, S * 2, S * 0.6); c.restore(); }
    if (ck > 0) { c.save(); c.shadowColor = GREEN; c.shadowBlur = R * 0.2; c.strokeStyle = "#fff"; c.lineWidth = R * 0.14; c.lineCap = "round"; c.lineJoin = "round"; polyPartial(c, [[-S * 0.32, S * 0.05], [-S * 0.08, S * 0.3], [S * 0.38, -S * 0.25]], ck); c.restore(); }
  }

  function aServer(c, R, lt, pal) {
    const col = pal[1], W = R * 1.5, H = R * 0.42, gap = R * 0.1, y0 = -(H * 3 + gap * 2) / 2;
    glowBg(c, R, col, 0.28); c.fillStyle = "rgba(0,0,0,.28)"; c.beginPath(); c.ellipse(0, R * 0.95, W * 0.55, R * 0.08, 0, 0, TAU); c.fill();
    for (let i = 0; i < 3; i++) {
      const y = y0 + i * (H + gap), g = c.createLinearGradient(0, y, 0, y + H); g.addColorStop(0, "#2f4166"); g.addColorStop(1, "#101a30");
      c.fillStyle = g; rrect(c, -W / 2, y, W, H, R * 0.07); c.fill(); c.strokeStyle = rgba(col, 0.6); c.lineWidth = R * 0.02; c.stroke();
      c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = R * 0.02; c.beginPath(); for (let v = 0; v < 6; v++) { c.moveTo(-W / 2 + R * 0.14 + v * R * 0.06, y + H * 0.25); c.lineTo(-W / 2 + R * 0.14 + v * R * 0.06, y + H * 0.75); } c.stroke();
      c.fillStyle = "rgba(255,255,255,.12)"; rrect(c, -W * 0.1, y + H * 0.4, W * 0.35, H * 0.2, R * 0.03); c.fill(); c.fillStyle = col; rrect(c, -W * 0.1, y + H * 0.4, W * 0.35 * (0.5 + 0.5 * sin(lt * 1.7 + i * 2)), H * 0.2, R * 0.03); c.fill();
      [GREEN, AMBER, col].forEach((cl, l) => { const on = sin(lt * (3 + i * 0.7 + l * 1.3) + i * 2) > (l === 0 ? -0.7 : 0.1); c.fillStyle = rgba(cl, on ? 1 : 0.18); c.beginPath(); c.arc(W / 2 - R * 0.14 - l * R * 0.12, y + H / 2, R * 0.035, 0, TAU); c.fill(); });
      [-1, 1].forEach(sg => { const x0 = sg * W / 2, x1 = sg * R * 1.3, yy = y + H / 2; c.strokeStyle = rgba(col, 0.35); c.lineWidth = R * 0.025; c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy); c.stroke(); const u = (lt * 0.6 + i / 3 + (sg > 0 ? 0.5 : 0)) % 1; c.fillStyle = "#fff"; c.beginPath(); c.arc(sg > 0 ? x0 + (x1 - x0) * u : x1 + (x0 - x1) * u, yy, R * 0.035, 0, TAU); c.fill(); });
    }
    txt(c, "UP 99.9%", 0, y0 - R * 0.22, R * 0.17, GREEN, 900, "center", MONO);
  }

  function aDeploy(c, R, lt, pal) {
    const col = pal[1], per = 5.5, u = (lt % per) / per, N = 4, lb = ["BUILD", "TEST", "DEPLOY", "LIVE"], X = i => (i - 1.5) * R * 0.62, p = clamp(u / 0.8) * N, rn = R * 0.2;
    glowBg(c, R, p >= N ? GREEN : col, 0.25);
    c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "rgba(255,255,255,.15)"; c.lineWidth = R * 0.07; c.beginPath(); c.moveTo(X(0), 0); c.lineTo(X(N - 1), 0); c.stroke();
    const fill = clamp((p - 0.5) / (N - 1)); if (fill > 0) { c.strokeStyle = GREEN; c.beginPath(); c.moveTo(X(0), 0); c.lineTo(X(0) + (X(N - 1) - X(0)) * fill, 0); c.stroke(); }
    for (let i = 0; i < N; i++) {
      const done = p >= i + 1, act = p >= i && p < i + 1, x = X(i);
      c.save(); if (done) { c.shadowColor = GREEN; c.shadowBlur = R * 0.2; } c.fillStyle = done ? GREEN : "#0b1424"; c.strokeStyle = done ? GREEN : act ? AMBER : "rgba(255,255,255,.3)"; c.lineWidth = R * 0.05; c.beginPath(); c.arc(x, 0, rn, 0, TAU); c.fill(); c.stroke(); c.restore();
      if (act) { c.strokeStyle = AMBER; c.lineWidth = R * 0.06; c.beginPath(); c.arc(x, 0, rn * 1.35, lt * 6, lt * 6 + 4.2); c.stroke(); }
      if (done) { c.strokeStyle = "#04210f"; c.lineWidth = R * 0.07; c.save(); c.translate(x, 0); polyPartial(c, [[-rn * 0.45, 0], [-rn * 0.1, rn * 0.35], [rn * 0.5, -rn * 0.35]], 1); c.restore(); }
      txt(c, lb[i], x, R * 0.55, R * 0.14, done ? GREEN : "rgba(255,255,255,.55)", 800, "center", MONO);
    }
    if (p >= N) { const age = (lt * 0.8) % 1; c.strokeStyle = rgba(GREEN, (1 - age) * 0.6); c.lineWidth = R * 0.04; c.beginPath(); c.arc(X(N - 1), 0, rn * (1.2 + age), 0, TAU); c.stroke(); txt(c, "v2.4.1 deployed", 0, -R * 0.62, R * 0.2, GREEN, 900, "center", MONO); }
    txt(c, "#" + (128 + Math.floor(lt / per)) + " main", 0, -R * 1.0, R * 0.16, rgba(col, 0.9), 800, "center", MONO);
  }

  function aRobot(c, R, lt, pal) {
    const col = pal[1], bob = sin(lt * 2) * R * 0.04, bl = (lt % 3.2) > 3.05 ? 0.12 : 1, lk = sin(lt * 0.9) * R * 0.06;
    glowBg(c, R, col, 0.28); c.save(); c.translate(0, bob);
    c.strokeStyle = "#aab6c4"; c.lineWidth = R * 0.05; c.lineCap = "round"; c.beginPath(); c.moveTo(0, -R * 0.62); c.lineTo(0, -R * 0.9); c.stroke();
    c.save(); const on = sin(lt * 6) > 0; c.shadowColor = RED; c.shadowBlur = on ? R * 0.2 : 0; c.fillStyle = on ? RED : "#ff8a99"; c.beginPath(); c.arc(0, -R * 0.95, R * 0.07, 0, TAU); c.fill(); c.restore();
    c.fillStyle = "#8a96a8"; rrect(c, -R * 0.84, -R * 0.12, R * 0.16, R * 0.34, R * 0.05); c.fill(); rrect(c, R * 0.68, -R * 0.12, R * 0.16, R * 0.34, R * 0.05); c.fill();
    const bg = c.createLinearGradient(0, R * 0.55, 0, R * 0.98); bg.addColorStop(0, "#e6ecf2"); bg.addColorStop(1, "#8a96a8"); c.fillStyle = bg; rrect(c, -R * 0.5, R * 0.52, R * 1.0, R * 0.44, R * 0.15); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(0, R * 0.74, R * 0.07 * (1 + 0.2 * sin(lt * 4)), 0, TAU); c.fill();
    const hg = c.createLinearGradient(0, -R * 0.62, 0, R * 0.48); hg.addColorStop(0, "#ffffff"); hg.addColorStop(1, "#a9b6c6"); c.fillStyle = hg; rrect(c, -R * 0.7, -R * 0.62, R * 1.4, R * 1.1, R * 0.28); c.fill();
    c.fillStyle = "#07101f"; rrect(c, -R * 0.56, -R * 0.46, R * 1.12, R * 0.7, R * 0.18); c.fill(); c.strokeStyle = rgba(col, 0.5); c.lineWidth = R * 0.02; c.stroke();
    c.save(); c.shadowColor = col; c.shadowBlur = R * 0.15; c.fillStyle = col; [-1, 1].forEach(sg => { c.beginPath(); c.ellipse(sg * R * 0.24 + lk, -R * 0.14, R * 0.1, R * 0.14 * bl, 0, 0, TAU); c.fill(); }); c.restore();
    c.fillStyle = col; for (let i = 0; i < 7; i++) { const hh = R * (0.04 + 0.1 * Math.abs(sin(lt * 7 + i * 1.3))); c.fillRect(-R * 0.3 + i * R * 0.1 - R * 0.025, R * 0.1 - hh / 2, R * 0.05, hh); }
    c.restore();
    for (let i = 0; i < 6; i++) { const a = lt * 0.8 + i / 6 * TAU; txt(c, i % 2 ? "1" : "0", cos(a) * R * 1.1, sin(a) * R * 0.9, R * 0.16, rgba(col, 0.4 + 0.5 * Math.abs(sin(lt * 2 + i))), 800, "center", MONO); }
  }

  function aDb(c, R, lt, pal) {
    const col = pal[1], W = R * 1.0, ry = R * 0.2, H = R * 0.42, n = 3, y0 = -R * 0.55, step = H * 1.05, rows = 128 + Math.floor(lt * 0.6) * 3;
    glowBg(c, R, col, 0.28);
    for (let i = n - 1; i >= 0; i--) {
      const yt = y0 + i * step, g = c.createLinearGradient(-W, 0, W, 0); g.addColorStop(0, mixc(col, "#000000", 0.55)); g.addColorStop(0.35, mixc(col, "#ffffff", 0.2)); g.addColorStop(1, mixc(col, "#000000", 0.6));
      c.fillStyle = g; c.beginPath(); c.rect(-W, yt, W * 2, H); c.fill(); c.beginPath(); c.ellipse(0, yt + H, W, ry, 0, 0, TAU); c.fill();
      c.fillStyle = mixc(col, "#ffffff", 0.45); c.beginPath(); c.ellipse(0, yt, W, ry, 0, 0, TAU); c.fill(); c.strokeStyle = "rgba(255,255,255,.3)"; c.lineWidth = R * 0.02; c.beginPath(); c.ellipse(0, yt + H * 0.5, W, ry, 0, 0, PI); c.stroke();
      c.fillStyle = rgba(sin(lt * 4 + i * 2) > 0 ? GREEN : "#ffffff", 0.9); c.beginPath(); c.arc(W * 0.68, yt + H * 0.65, R * 0.03, 0, TAU); c.fill();
    }
    const yq = y0 - R * 0.15 + ((lt * 0.6) % 1) * (n * step + R * 0.15); c.save(); c.shadowColor = col; c.shadowBlur = R * 0.2; c.strokeStyle = rgba("#ffffff", 0.9); c.lineWidth = R * 0.05; c.beginPath(); c.ellipse(0, yq, W * 1.06, ry * 1.06, 0, 0, TAU); c.stroke(); c.restore();
    for (let k = 0; k < 3; k++) { const u = (lt * 0.6 + k * 0.33) % 1; c.fillStyle = rgba("#ffffff", (1 - u) * 0.9); rrect(c, W + R * 0.1 + u * R * 0.3, y0 + k * step + H * 0.4, R * 0.3, R * 0.1, R * 0.03); c.fill(); }
    txt(c, "SELECT * FROM users", 0, -R * 0.95, R * 0.14, col, 800, "center", MONO); txt(c, "rows: " + rows, 0, R * 1.05, R * 0.17, GREEN, 800, "center", MONO);
  }

  /* ==========================================================
     3. ИКОНКИ (10): контуры 24×24
     ========================================================== */
  const ICONS = {
    i_code: ["Код", "m16 18 6-6-6-6 M8 6l-6 6 6 6"],
    i_terminal: ["Терминал", "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M7 11l2-2-2-2 M11 13h4"],
    i_cpu: ["Процессор", "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 9h6v6H9z M15 2v2 M15 20v2 M2 15h2 M2 9h2 M20 15h2 M20 9h2 M9 2v2 M9 20v2"],
    i_server: ["Сервер", "M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z M6 6h.01 M6 18h.01"],
    i_database: ["База данных", "M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0 M3 5v14a9 3 0 0 0 18 0V5 M3 12a9 3 0 0 0 18 0"],
    i_cloud: ["Облако", "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"],
    i_shield: ["Защита", "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z M9 12l2 2 4-4"],
    i_bug: ["Баг", "M8 2l1.88 1.88 M14.12 3.88L16 2 M9 7.13v-1a3.003 3.003 0 1 1 6 0v1 M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6 M12 20v-9 M6.53 9C4.6 8.8 3 7.1 3 5 M6 13H2 M3 21c0-2.1 1.7-3.9 3.8-4 M20.97 5c0 2.1-1.6 3.8-3.5 4 M22 13h-4 M17.2 17c2.1.1 3.8 1.9 3.8 4"],
    i_branch: ["Git-ветка", "M6 3v12 M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 9a9 9 0 0 1-9 9"],
    i_bot: ["ИИ-бот", "M12 8V4H8 M4 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z M2 14h2 M20 14h2 M15 13v2 M9 13v2"]
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
  function canvasTex(w, h, fn) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const x = cv.getContext("2d"); fn(x, w, h); const tex = new THREE.CanvasTexture(cv); return { tex, cv, x }; }

  /* экран ноутбука с печатающимся кодом */
  function codeScreen(x, w, h, lt, pal) {
    x.fillStyle = "#070d1c"; x.fillRect(0, 0, w, h); x.fillStyle = "#101a33"; x.fillRect(0, 0, w, 26);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((cl, i) => { x.fillStyle = cl; x.beginPath(); x.arc(16 + i * 18, 13, 5, 0, TAU); x.fill(); });
    const cl = [pal[1], VIOLET, CYAN, AMBER, GREEN, PINK], ind = [0, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0], cyc = 12 * 0.5 + 2, loc = lt % cyc; let cx = 0, cy = 0, any = false;
    for (let l = 0; l < 12; l++) {
      const p = clamp((loc - l * 0.5) / 0.7); if (p <= 0) continue;
      x.fillStyle = "rgba(255,255,255,.25)"; x.font = "600 14px " + MONO; x.textAlign = "right"; x.textBaseline = "middle"; x.fillText(String(l + 1), 34, 52 + l * 22);
      const n = 2 + Math.floor(rnd(l * 5.3) * 3), tw = []; let tot = 0; for (let k = 0; k < n; k++) { tw[k] = 30 + 70 * rnd(l * 7 + k * 1.7); tot += tw[k] + 10; }
      const sx = 50 + ind[l] * 22, vis = tot * p; x.save(); x.beginPath(); x.rect(sx - 1, 40 + l * 22, vis + 2, 24); x.clip();
      let px = sx; for (let k = 0; k < n; k++) { x.fillStyle = cl[Math.floor(rnd(l * 3 + k * 2.9) * cl.length)]; x.fillRect(px, 46 + l * 22, tw[k], 12); px += tw[k] + 10; }
      x.restore(); cx = sx + vis; cy = 52 + l * 22; any = true;
    }
    if (any && sin(lt * 9) > 0) { x.fillStyle = "#fff"; x.fillRect(cx + 3, cy - 9, 3, 18); }
  }
  function phoneScreen(x, w, h, lt, pal) {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#0e1a3a"); g.addColorStop(1, "#2a1a5a"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = "#000"; x.beginPath(); x.moveTo(98, 14); x.arcTo(158, 14, 158, 38, 12); x.arcTo(158, 38, 98, 38, 12); x.arcTo(98, 38, 98, 14, 12); x.arcTo(98, 14, 158, 14, 12); x.fill();
    x.fillStyle = "#fff"; x.font = "700 18px " + MONO; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("09:41", 18, 26); x.strokeStyle = "#fff"; x.lineWidth = 2; x.strokeRect(210, 19, 26, 14); x.fillRect(212, 21, 18, 10);
    const cl = [pal[1], VIOLET, CYAN, AMBER, GREEN, PINK, "#3b82f6", "#ff7a1a"];
    for (let i = 0; i < 20; i++) {
      const gx = i % 4, gy = Math.floor(i / 4), cx = 38 + gx * 60, cy = 100 + gy * 76, s = 1 + 0.06 * sin(lt * 3 + i), q = 44 * s;
      x.fillStyle = cl[i % cl.length]; x.beginPath(); x.moveTo(cx - q / 2 + 10, cy - q / 2); x.arcTo(cx + q / 2, cy - q / 2, cx + q / 2, cy + q / 2, 10); x.arcTo(cx + q / 2, cy + q / 2, cx - q / 2, cy + q / 2, 10); x.arcTo(cx - q / 2, cy + q / 2, cx - q / 2, cy - q / 2, 10); x.arcTo(cx - q / 2, cy - q / 2, cx + q / 2, cy - q / 2, 10); x.fill();
      x.fillStyle = "rgba(255,255,255,.55)"; x.fillRect(cx - 9, cy - 3, 18, 6); x.fillRect(cx - 3, cy - 9, 6, 18);
      if (i % 7 === 3) { x.fillStyle = "#ff3b57"; x.beginPath(); x.arc(cx + 18, cy - 18, 8, 0, TAU); x.fill(); }
    }
    x.fillStyle = "rgba(255,255,255,.18)"; x.fillRect(14, 440, w - 28, 62);
    for (let i = 0; i < 4; i++) { x.fillStyle = cl[(i + 3) % cl.length]; x.beginPath(); x.arc(38 + i * 60, 471, 20, 0, TAU); x.fill(); }
  }
  function robotFace(x, w, h, lt, pal) {
    x.fillStyle = "#07101f"; x.fillRect(0, 0, w, h); const bl = (lt % 3.2) > 3.05 ? 0.12 : 1, lk = sin(lt * 0.9) * 8;
    [-1, 1].forEach(sg => { x.save(); x.shadowColor = pal[1]; x.shadowBlur = 20; x.fillStyle = pal[1]; x.beginPath(); x.ellipse(w / 2 + sg * w * 0.22 + lk, h * 0.38, w * 0.08, h * 0.17 * bl, 0, 0, TAU); x.fill(); x.restore(); });
    x.fillStyle = pal[1]; for (let i = 0; i < 9; i++) { const hh = h * (0.03 + 0.09 * Math.abs(sin(lt * 7 + i * 1.3))); x.fillRect(w * 0.3 + i * w * 0.049, h * 0.72 - hh / 2, w * 0.03, hh); }
  }

  const M3 = {};
  M3.i3_laptop = pal => {
    const R = rig(pal), T = R.T, body = MC("#aab6c4", { gloss: 0.9, hi: "#ffffff", dark: "#2a3340" }), dark = MC("#1b2029", { gloss: 0.5, dark: "#000000" }), scr = canvasTex(512, 320, (x, w, h) => codeScreen(x, w, h, 0, pal));
    const base = rbox(3.2, 2.2, 0.12, 0.14, body, 0.04); base.rotation.x = -PI / 2; R.model.add(base);
    for (let r = 0; r < 5; r++) for (let k = 0; k < 12; k++) { const key = new T.Mesh(new T.BoxGeometry(0.2, 0.03, 0.2), dark); key.position.set(-1.25 + k * 0.227, 0.12, -0.9 + r * 0.24); R.model.add(key); }
    const tp = rbox(1.0, 0.6, 0.02, 0.06, MC("#8a96a8", { gloss: 0.8 }), 0.01); tp.rotation.x = -PI / 2; tp.position.set(0, 0.095, 0.75); R.model.add(tp);
    const lid = new T.Group(); lid.position.set(0, 0.1, -1.1); R.model.add(lid);
    const lb = rbox(3.2, 2.2, 0.1, 0.14, body, 0.04); lb.position.y = 1.1; lid.add(lb);
    const bz = new T.Mesh(new T.PlaneGeometry(3.1, 1.98), new T.MeshBasicMaterial({ color: 0x000000 })); bz.position.set(0, 1.1, 0.095); lid.add(bz);
    const sm = new T.Mesh(new T.PlaneGeometry(3.0, 1.875), new T.MeshBasicMaterial({ map: scr.tex })); sm.position.set(0, 1.1, 0.1); lid.add(sm);
    const hg = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 2.2, 14), body); hg.rotation.z = PI / 2; hg.position.set(0, 0.1, 0); lid.add(hg);
    lid.rotation.x = -0.28; R.fit(4.0);
    return { sc: R.sc, up: lt => { codeScreen(scr.x, 512, 320, lt, pal); scr.tex.needsUpdate = true; R.root.rotation.y = -0.2 + sin(lt * 0.6) * 0.6; R.root.rotation.x = 0.25; lid.rotation.x = -0.28 + sin(lt * 0.8) * 0.03; R.pv.position.y = sin(lt * 1.6) * 0.05; } };
  };

  M3.i3_server = pal => {
    const R = rig(pal), T = R.T, frame = MC("#2a3340", { gloss: 0.7, dark: "#000000" }), unit = MC("#3a4a6a", { gloss: 0.8, hi: "#9ab4ff", dark: "#000000" }), steel = MC("#c9d3dc", { gloss: 0.9, dark: "#222c36" }), vent = new T.MeshBasicMaterial({ color: 0x0b1424 }), leds = [];
    [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8]].forEach(p => { const m = new T.Mesh(new T.BoxGeometry(0.1, 4.0, 0.1), frame); m.position.set(p[0], 0, p[1]); R.model.add(m); });
    [-2.0, 2.0].forEach(y => { const m = new T.Mesh(new T.BoxGeometry(2.6, 0.1, 1.8), frame); m.position.y = y; R.model.add(m); });
    for (let i = 0; i < 7; i++) {
      const y = -1.65 + i * 0.55, u = rbox(2.3, 0.46, 1.5, 0.05, unit, 0.03); u.position.y = y; R.model.add(u);
      for (let v = 0; v < 8; v++) { const m = new T.Mesh(new T.BoxGeometry(0.03, 0.28, 0.02), vent); m.position.set(-1.0 + v * 0.1, y, 0.79); R.model.add(m); }
      [0.1, 0.55].forEach(x => { const m = new T.Mesh(new T.BoxGeometry(0.4, 0.22, 0.02), steel); m.position.set(x, y, 0.79); R.model.add(m); });
      for (let l = 0; l < 3; l++) { const m = new T.Mesh(new T.BoxGeometry(0.06, 0.06, 0.03), new T.MeshBasicMaterial({ color: 0x19d37a })); m.position.set(0.9 + l * 0.11, y, 0.8); R.model.add(m); leds.push({ m, l, ph: rnd(i * 5 + l) * 6, sp: 2 + rnd(i * 3 + l * 7) * 4 }); }
    }
    R.fit(4.2);
    const ON = [0x19d37a, 0xffb020, 0x22d3ee];
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.3 + sin(lt * 0.6) * 0.7; R.root.rotation.x = 0.12; leds.forEach(o => o.m.material.color.setHex(sin(lt * o.sp + o.ph) > 0 ? ON[o.l] : 0x0a2a1a)); } };
  };

  M3.i3_chip = pal => {
    const R = rig(pal), T = R.T, pcb = MC("#1c6b4a", { gloss: 0.5, hi: "#7affc0", dark: "#001a0c" }), pin = MC("#e2b94a", { gloss: 1, hi: "#fff3c0", dark: "#4a2a00" }), body = MC("#1b2538", { gloss: 0.7, hi: "#6a8cff", dark: "#00020a" }), trace = new T.MeshBasicMaterial({ color: new T.Color(pal[1]), transparent: true, opacity: 0.35 });
    const board = rbox(4.6, 4.6, 0.12, 0.2, pcb, 0.03); board.rotation.x = -PI / 2; board.position.y = -0.3; R.model.add(board);
    const cb = rbox(2.4, 2.4, 0.34, 0.1, body, 0.03); cb.rotation.x = -PI / 2; cb.position.y = -0.02; R.model.add(cb);
    const tt = canvasTex(512, 512, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#e8edf2"); g.addColorStop(1, "#8a96a8"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = "#1b2538"; x.fillRect(70, 70, w - 140, h - 140); x.strokeStyle = pal[1]; x.lineWidth = 6; x.strokeRect(70, 70, w - 140, h - 140);
      x.fillStyle = pal[1]; x.font = "900 130px " + MONO; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("CPU", w / 2, h / 2 - 20); x.fillStyle = "#fff"; x.font = "700 34px " + MONO; x.fillText("IT-X9  3.8GHz", w / 2, h / 2 + 80); x.beginPath(); x.arc(112, 112, 14, 0, TAU); x.fill();
    });
    const top = new T.Mesh(new T.PlaneGeometry(2.2, 2.2), new T.MeshBasicMaterial({ map: tt.tex })); top.rotation.x = -PI / 2; top.position.y = 0.205; R.model.add(top);
    const hl = canvasTex(256, 256, (x, w, h) => { const g = x.createRadialGradient(128, 128, 20, 128, 128, 128); g.addColorStop(0, rgba(pal[1], 0.9)); g.addColorStop(1, rgba(pal[1], 0)); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const halo = new T.Mesh(new T.PlaneGeometry(4.2, 4.2), new T.MeshBasicMaterial({ map: hl.tex, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false })); halo.rotation.x = -PI / 2; halo.position.y = -0.2; R.model.add(halo);
    const pulses = [];
    for (let s = 0; s < 4; s++) {
      const g = new T.Group(); g.rotation.y = s * PI / 2; R.model.add(g);
      for (let i = 0; i < 12; i++) {
        const x = -1.0 + i * 0.18, p = new T.Mesh(new T.BoxGeometry(0.08, 0.05, 0.3), pin); p.position.set(x, -0.1, -1.35); g.add(p);
        const tr = new T.Mesh(new T.BoxGeometry(0.04, 0.01, 1.0), trace); tr.position.set(x, -0.22, -2.0); g.add(tr);
        if (i % 2 === 0) { const q = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff })); q.position.set(x, -0.18, -1.5); g.add(q); pulses.push({ q, k: s * 12 + i }); }
      }
    }
    R.fit(4.2);
    return { sc: R.sc, up: lt => { R.root.rotation.x = 0.6; R.root.rotation.y = lt * 0.4; halo.material.opacity = 0.5 + 0.3 * sin(lt * 3); pulses.forEach(o => { o.q.position.z = -(1.5 + ((lt * 0.8 + rnd(o.k)) % 1) * 0.8); }); } };
  };

  M3.i3_cloud = pal => {
    const R = rig(pal), T = R.T, wm = MC("#eaf4ff", { gloss: 0.7, hi: "#ffffff", dark: "#5a7aaa" }), g = new T.Group(); R.model.add(g);
    [[-1.05, 0, 0, 0.62], [-0.4, 0.45, 0, 0.9], [0.55, 0.3, 0, 0.8], [1.2, -0.05, 0, 0.58], [0, 0, 0.45, 0.7], [0.7, 0, 0.45, 0.55], [-0.7, -0.05, 0.4, 0.55]].forEach(q => { const s = new T.Mesh(new T.SphereGeometry(q[3], 32, 24), wm); s.position.set(q[0], q[1], q[2]); g.add(s); });
    const bar = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 2.3, 32), wm); bar.rotation.z = PI / 2; bar.position.set(0.1, -0.45, 0); g.add(bar);
    const am = MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#001030" }), arrow = new T.Group();
    const sh = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.7, 20), am); sh.position.y = -0.2; const hd = new T.Mesh(new T.ConeGeometry(0.3, 0.5, 24), am); hd.position.y = 0.3; arrow.add(sh, hd); arrow.position.set(0.1, 0.0, 1.35); g.add(arrow);
    const cubes = []; for (let i = 0; i < 8; i++) { const m = new T.Mesh(new T.BoxGeometry(0.22, 0.22, 0.22), i % 2 ? am : MC("#ffffff", { gloss: 1 })); m.position.set((i % 4 - 1.5) * 0.7, -2.0, i < 4 ? 0.6 : -0.3); g.add(m); cubes.push(m); }
    R.fit(4.0);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.6) * 0.6; R.root.rotation.x = 0.15; g.position.y = sin(lt * 1.5) * 0.06; arrow.position.y = sin(lt * 3) * 0.1; cubes.forEach((m, i) => { const u = (lt * 0.5 + i / 8) % 1; m.position.y = -2.0 + u * 1.6; m.scale.setScalar(Math.max(0.01, sin(PI * u))); m.rotation.y = lt * 2 + i; }); } };
  };

  M3.i3_shield = pal => {
    const R = rig(pal), T = R.T, sh = () => { const s = new T.Shape(); s.moveTo(0, 1.5); s.lineTo(1.2, 1.05); s.lineTo(1.2, 0.1); s.bezierCurveTo(1.2, -0.8, 0.6, -1.3, 0, -1.6); s.bezierCurveTo(-0.6, -1.3, -1.2, -0.8, -1.2, 0.1); s.lineTo(-1.2, 1.05); s.closePath(); return s; };
    const opt = d => ({ depth: d, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 16 });
    const outer = new T.Mesh(new T.ExtrudeGeometry(sh(), opt(0.3)), MC("#dfe6ee", { gloss: 1, hi: "#ffffff", dark: "#2a3340" })); R.model.add(outer);
    const inner = new T.Mesh(new T.ExtrudeGeometry(sh(), opt(0.3)), MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#00061a" })); inner.scale.set(0.84, 0.84, 1); inner.position.z = 0.1; R.model.add(inner);
    const gm = MC("#19d37a", { gloss: 1, hi: "#c8ffe0", dark: "#001a0c" }), ck = new T.Group();
    const b1 = new T.Mesh(new T.BoxGeometry(0.28, 0.8, 0.22), gm); b1.position.set(-0.32, -0.05, 0); b1.rotation.z = 0.78; const b2 = new T.Mesh(new T.BoxGeometry(0.28, 1.4, 0.22), gm); b2.position.set(0.3, 0.18, 0); b2.rotation.z = -0.78; ck.add(b1, b2); ck.position.set(0, 0.1, 0.62); R.model.add(ck);
    const orb = []; for (let i = 0; i < 6; i++) { const m = new T.Mesh(new T.SphereGeometry(0.08, 12, 10), new T.MeshBasicMaterial({ color: i % 2 ? 0x19d37a : 0xffffff })); R.model.add(m); orb.push(m); }
    R.fit(3.8);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.7; R.pv.position.y = sin(lt * 1.8) * 0.06; const s = 1 + 0.05 * sin(lt * 4); ck.scale.set(s, s, 1); orb.forEach((m, i) => { const a = lt * 1.2 + i / 6 * TAU; m.position.set(cos(a) * 2.0, sin(lt * 1.5 + i) * 0.8, sin(a) * 2.0 + 0.15); }); } };
  };

  M3.i3_db = pal => {
    const R = rig(pal), T = R.T, cm = MC("#3b5bdb", { gloss: 0.9, hi: "#bcd0ff", dark: "#00061a" }), lm = MC("#8fb0ff", { gloss: 1, hi: "#ffffff", dark: "#1a2a5a" }), rings = [], leds = [], bits = [];
    for (let i = 0; i < 3; i++) {
      const y = -1.05 + i * 1.05; const c = new T.Mesh(new T.CylinderGeometry(1.3, 1.3, 0.75, 48), cm); c.position.y = y; R.model.add(c);
      const top = new T.Mesh(new T.CircleGeometry(1.29, 48), lm); top.rotation.x = -PI / 2; top.position.y = y + 0.376; R.model.add(top);
      for (let l = 0; l < 3; l++) { const a = 0.2 + l * 0.16, m = new T.Mesh(new T.BoxGeometry(0.08, 0.08, 0.04), new T.MeshBasicMaterial({ color: 0x19d37a })); m.position.set(Math.sin(a) * 1.3, y, Math.cos(a) * 1.3); m.rotation.y = a; R.model.add(m); leds.push({ m, ph: i * 2 + l }); }
      if (i < 2) { const r = new T.Mesh(new T.TorusGeometry(1.32, 0.04, 10, 56), new T.MeshBasicMaterial({ color: new T.Color(pal[1]) })); r.rotation.x = PI / 2; r.position.y = y + 0.525; R.model.add(r); rings.push(r); }
    }
    for (let i = 0; i < 6; i++) { const m = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff })); R.model.add(m); bits.push(m); }
    R.fit(3.8);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.7; R.root.rotation.x = 0.18; rings.forEach((r, i) => { const s = 1 + 0.05 * Math.max(0, sin(lt * 3 - i * 1.2)); r.scale.set(s, s, 1); }); leds.forEach(o => o.m.material.color.setHex(sin(lt * 4 + o.ph) > 0 ? 0x19d37a : 0x0a2a1a)); bits.forEach((m, i) => { const u = (lt * 0.5 + i / 6) % 1, a = i * 1.05 + lt * 0.5; m.position.set(cos(a) * 1.9, -1.6 + u * 3.6, sin(a) * 1.9); m.scale.setScalar(Math.max(0.01, sin(PI * u))); }); } };
  };

  const gearGeo = (r, n, depth) => {
    const s = new THREE.Shape(), st = TAU / n;
    for (let i = 0; i < n; i++) { const a = i * st;[[a, 0.86], [a + st * 0.16, 1.1], [a + st * 0.4, 1.1], [a + st * 0.56, 0.86]].forEach((p, j) => { const x = cos(p[0]) * r * p[1], y = sin(p[0]) * r * p[1]; (i || j) ? s.lineTo(x, y) : s.moveTo(x, y); }); }
    s.closePath(); const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.3, 0, TAU, true); s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 }); g.translate(0, 0, -depth / 2); return g;
  };
  M3.i3_gear = pal => {
    const R = rig(pal), T = R.T, hub = MC("#2b3340", { gloss: 0.8, hi: "#8a96a8", dark: "#000000" });
    const mk = (r, n, col) => { const g = new T.Group(); g.add(new T.Mesh(gearGeo(r, n, 0.5), MC(col, { gloss: 0.95, hi: "#ffffff", dark: "#05050a" }))); const h = new T.Mesh(new T.CylinderGeometry(r * 0.2, r * 0.2, 0.7, 24), hub); h.rotation.x = PI / 2; g.add(h); R.model.add(g); return g; };
    const nA = 14, nB = 8, nC = 10, rA = 1.4, rB = 0.8, rC = 1.0, fB = -0.5, fC = 2.4, A = mk(rA, nA, pal[1]), B = mk(rB, nB, "#ffb020"), C = mk(rC, nC, "#8a6bff");
    B.position.set(cos(fB) * (rA + rB), sin(fB) * (rA + rB), 0); C.position.set(cos(fC) * (rA + rC), sin(fC) * (rA + rC), 0);
    R.fit(4.2);
    return { sc: R.sc, up: lt => { const th = lt * 0.6; A.rotation.z = th; B.rotation.z = fB + PI - PI / nB + (fB - th) * nA / nB; C.rotation.z = fC + PI - PI / nC + (fC - th) * nA / nC; R.root.rotation.y = sin(lt * 0.5) * 0.4; R.root.rotation.x = 0.15; } };
  };

  M3.i3_robot = pal => {
    const R = rig(pal), T = R.T, white = MC("#f1f5f9", { gloss: 0.9, hi: "#ffffff", dark: "#2a3340" }), acc = MC(pal[1], { gloss: 1, hi: "#ffffff", dark: "#00061a" }), steel = MC("#aab6c4", { gloss: 0.9, dark: "#222c36" }), face = canvasTex(256, 192, (x, w, h) => robotFace(x, w, h, 0, pal));
    const hd = new T.Group(); R.model.add(hd);
    const head = rbox(2.3, 1.9, 1.7, 0.4, white, 0.05); head.position.y = 0.6; hd.add(head);
    const bz = new T.Mesh(new T.PlaneGeometry(2.0, 1.5), new T.MeshBasicMaterial({ color: 0x000000 })); bz.position.set(0, 0.6, 0.91); hd.add(bz);
    const fm = new T.Mesh(new T.PlaneGeometry(1.9, 1.425), new T.MeshBasicMaterial({ map: face.tex })); fm.position.set(0, 0.6, 0.915); hd.add(fm);
    [-1, 1].forEach(sg => { const e = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.25, 28), acc); e.rotation.z = PI / 2; e.position.set(sg * 1.28, 0.6, 0); hd.add(e); });
    const st = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.5, 10), steel); st.position.y = 1.8; hd.add(st);
    const ball = new T.Mesh(new T.SphereGeometry(0.12, 16, 12), new T.MeshBasicMaterial({ color: 0xff3b57 })); ball.position.y = 2.1; hd.add(ball);
    const neck = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.3, 20), steel); neck.position.y = -0.2; R.model.add(neck);
    const body = rbox(1.7, 1.2, 1.2, 0.3, white, 0.05); body.position.y = -0.9; R.model.add(body);
    const chest = new T.Mesh(new T.SphereGeometry(0.14, 16, 12), new T.MeshBasicMaterial({ color: new T.Color(pal[1]) })); chest.position.set(0, -0.85, 0.66); R.model.add(chest);
    [-1, 1].forEach(sg => { const a = new T.Mesh(new T.CylinderGeometry(0.17, 0.17, 1.0, 18), steel); a.position.set(sg * 1.15, -0.9, 0); R.model.add(a); const h = new T.Mesh(new T.SphereGeometry(0.22, 16, 12), acc); h.position.set(sg * 1.15, -1.5, 0); R.model.add(h); });
    R.fit(4.2);
    return { sc: R.sc, up: lt => { robotFace(face.x, 256, 192, lt, pal); face.tex.needsUpdate = true; hd.rotation.y = sin(lt * 0.8) * 0.25; ball.material.color.setHex(sin(lt * 6) > 0 ? 0xff3b57 : 0x7a1a28); chest.scale.setScalar(1 + 0.2 * sin(lt * 4)); R.root.rotation.y = sin(lt * 0.5) * 0.4; R.pv.position.y = sin(lt * 2) * 0.06; } };
  };

  M3.i3_phone = pal => {
    const R = rig(pal), T = R.T, frame = MC("#2b3340", { gloss: 0.9, hi: "#8a96a8", dark: "#000000" }), scr = canvasTex(256, 512, (x, w, h) => phoneScreen(x, w, h, 0, pal));
    R.model.add(rbox(1.6, 3.2, 0.16, 0.3, frame, 0.04));
    const sm = new T.Mesh(new T.PlaneGeometry(1.45, 2.9), new T.MeshBasicMaterial({ map: scr.tex })); sm.position.z = 0.125; R.model.add(sm);
    const cam = rbox(0.66, 0.66, 0.05, 0.16, MC("#1b2029", { gloss: 0.9, hi: "#8a96a8" }), 0.02); cam.position.set(-0.42, 1.12, -0.11); R.model.add(cam);
    [[-0.58, 1.3], [-0.26, 1.3], [-0.42, 0.98]].forEach(p => { const l = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, 0.06, 20), MC("#0b1424", { gloss: 1, hi: "#6a8cff" })); l.rotation.x = PI / 2; l.position.set(p[0], p[1], -0.15); R.model.add(l); });
    [[0.5, 0.4], [0.5, 0.0]].forEach(p => { const b = new T.Mesh(new T.BoxGeometry(0.04, 0.3, 0.05), frame); b.position.set(0.82, p[0] * 0 + p[1] + 0.4, 0); R.model.add(b); });
    R.fit(3.8);
    return { sc: R.sc, up: lt => { phoneScreen(scr.x, 256, 512, lt, pal); scr.tex.needsUpdate = true; R.root.rotation.y = sin(lt * 0.8) * 0.8; R.root.rotation.z = 0.1; R.pv.position.y = sin(lt * 1.6) * 0.06; } };
  };

  M3.i3_code = pal => {
    const R = rig(pal), T = R.T, cy = MC("#22d3ee", { gloss: 1, hi: "#e0fbff", dark: "#00203a" }), wh = MC("#f1f5f9", { gloss: 1, hi: "#ffffff", dark: "#3a4452" }), vi = MC("#8a6bff", { gloss: 1, hi: "#e0d8ff", dark: "#0a0030" });
    const bar = (L, mat, x, y, rz) => { const b = rbox(L, 0.34, 0.4, 0.12, mat, 0.04); b.position.set(x, y, 0); b.rotation.z = rz; R.model.add(b); return b; };
    const a = 0.8, L = 1.6;
    bar(L, cy, -2.1 + cos(a) * L / 2, sin(a) * L / 2, a); bar(L, cy, -2.1 + cos(a) * L / 2, -sin(a) * L / 2, -a);
    bar(2.8, wh, 0, 0, 1.2);
    bar(L, vi, 2.1 - cos(a) * L / 2, sin(a) * L / 2, PI - a); bar(L, vi, 2.1 - cos(a) * L / 2, -sin(a) * L / 2, PI + a);
    const cur = new T.Mesh(new T.BoxGeometry(0.7, 0.14, 0.3), MC(pal[1], { gloss: 1, hi: "#ffffff" })); cur.position.set(3.0, -1.2, 0); R.model.add(cur);
    const cubes = []; for (let i = 0; i < 8; i++) { const m = new T.Mesh(new T.BoxGeometry(0.2, 0.2, 0.2), i % 2 ? cy : vi); R.model.add(m); cubes.push(m); }
    R.fit(4.4);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.7) * 0.7; R.root.rotation.x = 0.15; R.pv.position.y = sin(lt * 1.8) * 0.06; cur.visible = sin(lt * 6) > 0; cubes.forEach((m, i) => { const q = lt * 0.9 + i / 8 * TAU; m.position.set(cos(q) * 3.4, sin(q * 1.3) * 0.9, sin(q) * 1.4); m.rotation.set(lt + i, lt * 1.3, 0); }); } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ
     ========================================================== */
  const bgFns = { it_code: bgCode, it_binary: bgBinary, it_circuit: bgCircuit, it_server: bgServer, it_cloud: bgCloud, it_terminal: bgTerminal, it_globe: bgGlobe, it_shield: bgShield, it_git: bgGit, it_neural: bgNeural };
  const shapeFns = { is_laptop: aLaptop, is_cloud: aCloud, is_chip: aChip, is_gear: aGear, is_bug: aBug, is_shield: aShield, is_server: aServer, is_deploy: aDeploy, is_robot: aRobot, is_db: aDb };
  const names = {
    it_code: "Редактор кода", it_binary: "Бинарный дождь", it_circuit: "Печатная плата", it_server: "Серверная стойка", it_cloud: "Облака и данные", it_terminal: "Терминал", it_globe: "Глобальная сеть", it_shield: "Кибербезопасность", it_git: "Ветки Git", it_neural: "Нейросеть",
    is_laptop: "Ноутбук и код", is_cloud: "Загрузка в облако", is_chip: "Процессор", is_gear: "Шестерни DevOps", is_bug: "Исправление бага", is_shield: "Защита от угроз", is_server: "Сервер онлайн", is_deploy: "Деплой-пайплайн", is_robot: "ИИ-ассистент", is_db: "База данных",
    i3_laptop: "Ноутбук с кодом 3D", i3_server: "Серверная стойка 3D", i3_chip: "Процессор 3D", i3_cloud: "Облако 3D", i3_shield: "Щит безопасности 3D", i3_db: "База данных 3D", i3_gear: "Шестерни DevOps 3D", i3_robot: "ИИ-робот 3D", i3_phone: "Смартфон с приложениями 3D", i3_code: "Скобки кода 3D"
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

  const DOMAIN = "IT";
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
    addCard({ id, cat: "Фон", name: "IT: " + names[id], tags: "it айти программирование разработка технологии фон " + names[id], mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "whoosh" }], layers: [{ type: "text", fx: "words", text: "Технологии *будущего*", y: 0.5, size: 0.09 }] }) });
  });
  Object.keys(ICONS).forEach(id => {
    ICO[id] = ICONS[id][1]; ICN.push([id, ICONS[id][0]]);
    addCard({ id: "ico_" + id, cat: "Иконка", name: "IT: " + ICONS[id][0], tags: "it айти программирование иконка " + id + " " + ICONS[id][0], mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: 0.5, size: 0.4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "icon", name: id, y: 0.45, size: 0.4 }] }) });
  });
  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_" + id, cat: "Анимация", name: "IT: " + names[id], tags: "it айти программирование анимация " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: 0.5, y: 0.5, size: 0.48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "shape", shape: id, x: 0.5, y: 0.42, size: 0.8 }] }) });
  });
  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_" + id, cat: "3D", name: "IT: " + names[id], tags: "it айти программирование 3d три д " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: 0.5, y: 0.5, size: 0.52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: 0.1, id: "pop" }], layers: [{ type: "three", model: id, x: 0.5, y: 0.42, size: 0.85 }] }) });
  });
  try { if (typeof filt === "function") filt(); } catch (e) {}
  try { const sel = document.getElementById("catfilter"); if (sel && !Array.from(sel.options).some(o => o.value === DOMAIN)) { const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o); } } catch (e) {}

  const HINT = "ПАК IT (используй для программирования, IT-компаний, облаков, DevOps, кибербезопасности, ИИ, серверов, баз данных, железа и гаджетов): фоны it_code (код, разработка), it_binary (бинарный дождь, данные), it_circuit (электроника, железо), it_server (серверы, хостинг), it_cloud (облака, SaaS), it_terminal (командная строка, DevOps), it_globe (интернет, глобальные сервисы), it_shield (кибербезопасность), it_git (версии, командная разработка), it_neural (нейросети, ИИ). Анимации shape: is_laptop, is_cloud, is_chip, is_gear, is_bug, is_shield, is_server, is_deploy, is_robot, is_db. Иконки icon: i_code, i_terminal, i_cpu, i_server, i_database, i_cloud, i_shield, i_bug, i_branch, i_bot. 3D three.model: i3_laptop, i3_server, i3_chip, i3_cloud, i3_shield, i3_db, i3_gear, i3_robot, i3_phone, i3_code. Не называй конкретные бренды и не давай гарантий по безопасности или скорости.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u, o) { try { if (o && typeof o.body === "string" && /\/director$/.test(String(u))) { const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n") + "\n" + (b.hint || ""); o.body = JSON.stringify(b); } } catch (e) {} return _f.apply(this, arguments); };
  }
  window.__hintPatch.push(HINT);
})();