/* ==========================================================
   MOTION STUDIO · ПАК «НОВОСТИ»
   10 фонов · 10 иконок · 10 векторных анимаций · 10 3D-моделей
   Подключение: перед </body> добавь строку
   <script src="pack-news.js"><\/script>
   (после основного <script> и после pack-health.js, если он есть).
   ========================================================== */
(function () {
  "use strict";
  if (window.__packNews) return;

  const need = ["BG", "ICO", "ICN", "N", "SHP", "TH3", "LIB", "BUSY", "drawBg", "drawShape", "thBuild", "clamp", "eo", "ob", "rnd"];
  const missing = need.filter(n => { try { return typeof (0, eval)(n) === "undefined"; } catch (e) { return true; } });
  if (missing.length) { console.warn("Пак «Новости» не подключён, нет:", missing.join(", ")); return; }
  window.__packNews = true;

  /* ---------- общие помощники ---------- */
  const TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const FNT = () => (typeof FONT !== "undefined" ? FONT : "Arial, sans-serif");
  const hx = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mixc = (a, b, t) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };
  const gauss = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
  const ease = x => x * x * (3 - 2 * x);
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const txt = (c, s, x, y, px, col, wt, al) => { c.font = (wt || 800) + " " + px + "px " + FNT(); c.textAlign = al || "center"; c.textBaseline = "middle"; c.fillStyle = col; c.fillText(s, x, y); };
  const heartP = (c, s) => { c.beginPath(); c.moveTo(0, 0.8 * s); c.bezierCurveTo(-1.6 * s, -0.2 * s, -0.7 * s, -1.2 * s, 0, -0.4 * s); c.bezierCurveTo(0.7 * s, -1.2 * s, 1.6 * s, -0.2 * s, 0, 0.8 * s); c.closePath(); };
  const NR = "#e6192d";
  const land = (lon, lat) => sin(lon * 2.1 + 1.3) * cos(lat * 3.1) + sin(lon * 3.7 + lat * 2.2) * 0.7 + sin(lat * 5.3 - lon * 1.7) * 0.4 > 0.35;
  const PINS = [[0.2, 0.7], [1.6, 0.55], [2.6, 0.2], [-1.6, 0.5], [-2.5, 0.1], [0.9, -0.4], [-0.4, -0.5]];
  const LINKS = [[0, 1], [1, 2], [0, 3], [3, 4], [0, 5], [5, 6]];

  /* глобус из точек: общий для фона и анимации */
  function globe(c, cx, cy, R, t, col) {
    const rot = t * 0.35, tilt = 0.35, ct = cos(tilt), st = sin(tilt);
    const pr = (lon, lat) => { const x = cos(lat) * sin(lon + rot), y = sin(lat), z = cos(lat) * cos(lon + rot); return { X: cx + x * R, Y: cy - (y * ct - z * st) * R, z: y * st + z * ct }; };
    const g = c.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.35); g.addColorStop(0, rgba(col, 0.22)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8);
    c.strokeStyle = rgba(col, 0.45); c.lineWidth = Math.max(1, R * 0.012); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    for (let lat = -1.45; lat <= 1.45; lat += 0.1) {
      const n = Math.max(6, Math.round(70 * cos(lat)));
      for (let i = 0; i < n; i++) { const lon = i / n * TAU - PI, p = pr(lon, lat); if (p.z < 0) continue; const L = land(lon, lat); c.fillStyle = rgba(col, (L ? 0.95 : 0.2) * (0.25 + 0.75 * p.z)); c.beginPath(); c.arc(p.X, p.Y, R * (L ? 0.013 : 0.007) * (0.5 + 0.5 * p.z), 0, TAU); c.fill(); }
    }
    c.save(); c.lineCap = "round";
    LINKS.forEach(([a, b], k) => {
      const p1 = pr(PINS[a][0], PINS[a][1]), p2 = pr(PINS[b][0], PINS[b][1]); if (p1.z < 0.05 || p2.z < 0.05) return;
      const mx = (p1.X + p2.X) / 2, my = (p1.Y + p2.Y) / 2, vx = mx - cx, vy = my - cy, len = Math.hypot(vx, vy) || 1, qx = mx + vx / len * R * 0.35, qy = my + vy / len * R * 0.35;
      c.setLineDash([R * 0.05, R * 0.04]); c.lineDashOffset = -t * R * 0.3; c.strokeStyle = rgba("#ffffff", 0.55); c.lineWidth = Math.max(1, R * 0.012);
      c.beginPath(); c.moveTo(p1.X, p1.Y); c.quadraticCurveTo(qx, qy, p2.X, p2.Y); c.stroke(); c.setLineDash([]);
      const u = (t * 0.3 + k * 0.17) % 1, bx = (1 - u) * (1 - u) * p1.X + 2 * (1 - u) * u * qx + u * u * p2.X, by = (1 - u) * (1 - u) * p1.Y + 2 * (1 - u) * u * qy + u * u * p2.Y;
      c.fillStyle = "#fff"; c.beginPath(); c.arc(bx, by, R * 0.018, 0, TAU); c.fill();
    });
    PINS.forEach((pn, i) => {
      const p = pr(pn[0], pn[1]); if (p.z < 0.1) return; const age = (t * 0.7 + i * 0.23) % 1;
      c.strokeStyle = rgba(NR, (1 - age) * 0.8); c.lineWidth = Math.max(1, R * 0.012); c.beginPath(); c.arc(p.X, p.Y, R * (0.02 + 0.08 * age), 0, TAU); c.stroke();
      c.fillStyle = NR; c.beginPath(); c.arc(p.X, p.Y, R * 0.024, 0, TAU); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(p.X, p.Y, R * 0.009, 0, TAU); c.fill();
    });
    c.restore();
  }

  /* ==========================================================
     1. ФОНЫ (10)
     ========================================================== */
  function bgTicker(c, w, h, t, pal) {
    const rows = 7, rh = h / rows, words = ["СРОЧНО", "LIVE", "НОВОСТИ", "ГЛАВНОЕ", "BREAKING", "ЭКСТРЕННО", "ЭФИР"], col = pal[1];
    c.save();
    for (let r = 0; r < rows; r++) {
      const y = r * rh, hot = r === 3, px = rh * (hot ? 0.5 : 0.42), unit = hot ? "СРОЧНО  •  BREAKING NEWS  •  " : words[r] + "   •   ";
      c.font = "800 " + px + "px " + FNT(); c.textAlign = "left"; c.textBaseline = "middle";
      const uw = c.measureText(unit).width || 100, sp = (hot ? 150 : 40 + r * 16) * (w / 540) * (hot ? -1 : (r % 2 ? 1 : -1)), off = (((t * sp) % uw) + uw) % uw;
      if (hot) { const g = c.createLinearGradient(0, y, 0, y + rh); g.addColorStop(0, "#ff3b4e"); g.addColorStop(1, "#a30f1d"); c.fillStyle = g; c.fillRect(0, y + rh * 0.06, w, rh * 0.88); }
      else if (r % 2 === 0) { c.fillStyle = rgba(col, 0.05); c.fillRect(0, y, w, rh); }
      c.fillStyle = hot ? "#ffffff" : rgba(col, 0.12 + 0.04 * (r % 3));
      for (let x = -off; x < w; x += uw) c.fillText(unit, x, y + rh / 2);
    }
    const sx = ((t * 0.4) % 1.4 - 0.2) * w, sg = c.createLinearGradient(sx - w * 0.15, 0, sx + w * 0.15, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,.18)"); sg.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = sg; c.fillRect(0, 3 * rh, w, rh); c.restore();
  }

  function bgGlobe(c, w, h, t, pal) { globe(c, w / 2, h * 0.5, Math.min(w, h) * 0.44, t, pal[1]); }

  function bgPaper(c, w, h, t, pal) {
    const ink = pal[2], page = h * 1.0, oy = (t * h * 0.07) % page;
    c.save(); c.translate(w / 2, h / 2); c.rotate(-0.05); c.translate(-w / 2, -h / 2);
    for (let p = -1; p <= 1; p++) {
      const y0 = p * page - oy + h * 0.05, colW = (w * 0.88 - 2 * w * 0.03) / 3, x0 = w * 0.06;
      txt(c, "ВЕСТНИК", w / 2, y0 + h * 0.06, h * 0.055, rgba(ink, 0.2), 900);
      c.fillStyle = rgba(ink, 0.3); c.fillRect(x0, y0 + h * 0.1, w * 0.88, h * 0.004); c.fillRect(x0, y0 + h * 0.108, w * 0.88, h * 0.0015);
      for (let col = 0; col < 3; col++) {
        let y = y0 + h * 0.13; const cx = x0 + col * (colW + w * 0.03); let k = 0;
        while (y < y0 + page - h * 0.04) {
          const kind = rnd((p + 10) * 37 + col * 11 + k * 3), lh = h * 0.011; k++;
          if (kind > 0.86) { const ph = h * 0.1; c.fillStyle = rgba(ink, 0.1); c.fillRect(cx, y, colW, ph); c.fillStyle = rgba(ink, 0.2); for (let a = 0; a < 6; a++) for (let b = 0; b < 8; b++) { c.beginPath(); c.arc(cx + (b + 0.5) / 8 * colW, y + (a + 0.5) / 6 * ph, colW * 0.012 * (0.4 + (a + b) / 12), 0, TAU); c.fill(); } y += ph + h * 0.012; }
          else if (kind > 0.7) { c.fillStyle = rgba(ink, 0.4); c.fillRect(cx, y, colW * (0.9 + 0.1 * rnd(k + 5)), h * 0.014); c.fillRect(cx, y + h * 0.02, colW * 0.6, h * 0.014); y += h * 0.05; }
          else { const n = 3 + Math.floor(rnd(k + 9) * 3); for (let l = 0; l < n; l++) { c.fillStyle = rgba(ink, 0.16); c.fillRect(cx, y, colW * (l === n - 1 ? 0.55 : 0.8 + 0.2 * rnd(l + k * 7)), lh * 0.55); y += lh * 1.8; } y += h * 0.012; }
        }
      }
    }
    c.restore();
  }

  function bgStudio(c, w, h, t, pal) {
    const col = pal[1], hz = h * 0.58, g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#071a4d"); g.addColorStop(0.58, mixc(pal[0], "#0b2a6f", 0.5)); g.addColorStop(1, pal[0]); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 3; k++) { c.save(); c.translate(w / 2, hz * 0.62); c.rotate(t * 0.1 * (k % 2 ? 1 : -1) + k); c.scale(1, 0.35 + 0.1 * k); c.strokeStyle = rgba(col, 0.35 - 0.07 * k); c.lineWidth = w * 0.006; c.beginPath(); c.arc(0, 0, Math.min(w, h) * (0.28 + 0.14 * k), 0, TAU); c.stroke(); c.restore(); }
    [-1, 1].forEach(s => { const a = sin(t * 0.6 + s) * 0.25 + s * 0.45, bx = w / 2 + s * w * 0.45, lg = c.createLinearGradient(bx, 0, bx - s * w * 0.3, h * 0.7); lg.addColorStop(0, "rgba(255,255,255,.2)"); lg.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = lg; c.beginPath(); c.moveTo(bx - w * 0.04, 0); c.lineTo(bx + w * 0.04, 0); c.lineTo(bx - s * Math.tan(a) * h * 0.7 - s * w * 0.35 + w * 0.12, h * 0.7); c.lineTo(bx - s * Math.tan(a) * h * 0.7 - s * w * 0.35 - w * 0.12, h * 0.7); c.closePath(); c.fill(); });
    const fg = c.createLinearGradient(0, hz, 0, h); fg.addColorStop(0, "rgba(10,30,80,.9)"); fg.addColorStop(1, "rgba(0,0,0,.7)"); c.fillStyle = fg; c.fillRect(0, hz, w, h - hz);
    c.strokeStyle = rgba(col, 0.5); c.lineWidth = Math.max(1, w * 0.003); c.beginPath(); c.moveTo(0, hz); c.lineTo(w, hz); c.stroke();
    for (let i = -8; i <= 8; i++) { c.strokeStyle = rgba(col, 0.2); c.beginPath(); c.moveTo(w / 2, hz); c.lineTo(w / 2 + i * w * 0.22, h); c.stroke(); }
    for (let j = 0; j < 10; j++) { const f = Math.pow((j + (t * 0.4) % 1) / 10, 2); c.strokeStyle = rgba(col, 0.1 + 0.3 * f); c.beginPath(); c.moveTo(0, hz + (h - hz) * f); c.lineTo(w, hz + (h - hz) * f); c.stroke(); }
  }

  function bgStream(c, w, h, t, pal) {
    const cols = 8, cw = w / cols, col = pal[1], gap = h * 0.11;
    for (let i = 0; i < cols; i++) {
      const sp = h * (0.08 + 0.12 * rnd(i + 3));
      for (let k = -1; k < h / gap + 2; k++) {
        const y = ((((k * gap + t * sp) % (h + gap)) + (h + gap)) % (h + gap)) - gap / 2, f = y / h; if (f < -0.05 || f > 1.05) continue;
        const hot = rnd(i * 31 + k * 7) > 0.88, a = 0.1 + 0.6 * clamp(f, 0, 1), x = i * cw + cw * 0.08;
        txt(c, (10 + Math.floor(rnd(i * 5 + k) * 13)) + ":" + String(Math.floor(rnd(i + k * 3) * 60)).padStart(2, "0"), x, y, cw * 0.15, rgba(hot ? NR : col, a), 700, "left");
        c.fillStyle = rgba(hot ? NR : col, a * 0.8); rrect(c, x, y + cw * 0.1, cw * (0.35 + 0.45 * rnd(i * 13 + k)), cw * 0.07, cw * 0.03); c.fill();
        if (hot) { c.fillStyle = rgba(NR, a); rrect(c, x + cw * 0.5, y - cw * 0.06, cw * 0.32, cw * 0.12, cw * 0.03); c.fill(); }
      }
    }
  }

  function bgSignal(c, w, h, t, pal) {
    const cx = w / 2, cy = h * 0.78, col = pal[1];
    for (let k = 0; k < 7; k++) { const age = (t * 0.5 + k / 7) % 1; c.strokeStyle = rgba(col, (1 - age) * 0.6); c.lineWidth = w * 0.012 * (1 - age) + 1; c.beginPath(); c.arc(cx, cy - h * 0.08, age * h * 0.9, -PI * 0.9, -PI * 0.1); c.stroke(); }
    c.strokeStyle = rgba("#ffffff", 0.7); c.lineWidth = w * 0.01; c.beginPath(); c.moveTo(cx - w * 0.05, cy + h * 0.1); c.lineTo(cx, cy - h * 0.08); c.lineTo(cx + w * 0.05, cy + h * 0.1); c.stroke();
    c.fillStyle = rgba(NR, 0.4 + 0.6 * (sin(t * 6) * 0.5 + 0.5)); c.beginPath(); c.arc(cx, cy - h * 0.08, w * 0.015, 0, TAU); c.fill();
    const n = 30, bw = w / n;
    for (let i = 0; i < n; i++) { const bh = h * 0.14 * (0.25 + 0.75 * Math.abs(sin(t * 3 + i * 0.6) * sin(t * 1.7 + i * 0.4))), g = c.createLinearGradient(0, h, 0, h - bh); g.addColorStop(0, rgba(col, 0.1)); g.addColorStop(1, rgba(col, 0.6)); c.fillStyle = g; c.fillRect(i * bw + bw * 0.15, h - bh, bw * 0.7, bh); }
    const sd = Math.floor(t * 12); c.fillStyle = "rgba(255,255,255,.07)"; for (let i = 0; i < 18; i++) c.fillRect(0, rnd(i + sd) * h, w, 1.5);
  }

  function bgMap(c, w, h, t, pal) {
    const col = pal[1];
    c.lineWidth = 1; for (let i = 0; i <= 12; i++) { c.strokeStyle = rgba(col, 0.1); c.beginPath(); c.moveTo(i * w / 12, 0); c.lineTo(i * w / 12, h); c.stroke(); }
    for (let j = 0; j <= 8; j++) { c.strokeStyle = rgba(col, j === 4 ? 0.3 : 0.1); c.beginPath(); c.moveTo(0, j * h / 8); c.lineTo(w, j * h / 8); c.stroke(); }
    const g = w / 46; c.fillStyle = rgba(col, 0.35);
    for (let y = 0; y < h; y += g) for (let x = 0; x < w; x += g) if (land((x / w) * TAU - PI, -(y / h - 0.5) * 2.9)) c.fillRect(x + g * 0.15, y + g * 0.15, g * 0.7, g * 0.7);
    const P = PINS.map(p => [(p[0] + PI) / TAU * w, h * (0.5 - p[1] / 2.9)]);
    c.save(); c.lineCap = "round";
    LINKS.forEach(([a, b], k) => {
      const p1 = P[a], p2 = P[b], mx = (p1[0] + p2[0]) / 2, my = Math.min(p1[1], p2[1]) - h * 0.1 - Math.abs(p1[0] - p2[0]) * 0.1;
      c.setLineDash([w * 0.02, w * 0.015]); c.lineDashOffset = -t * w * 0.1; c.strokeStyle = rgba("#ffffff", 0.5); c.lineWidth = Math.max(1.5, w * 0.004); c.beginPath(); c.moveTo(p1[0], p1[1]); c.quadraticCurveTo(mx, my, p2[0], p2[1]); c.stroke(); c.setLineDash([]);
      const u = (t * 0.25 + k * 0.3) % 1, bx = (1 - u) * (1 - u) * p1[0] + 2 * (1 - u) * u * mx + u * u * p2[0], by = (1 - u) * (1 - u) * p1[1] + 2 * (1 - u) * u * my + u * u * p2[1];
      c.fillStyle = "#fff"; c.beginPath(); c.arc(bx, by, w * 0.008, 0, TAU); c.fill();
    });
    P.forEach((p, i) => { const age = (t * 0.7 + i * 0.23) % 1; c.strokeStyle = rgba(NR, (1 - age) * 0.8); c.lineWidth = Math.max(1.5, w * 0.004); c.beginPath(); c.arc(p[0], p[1], w * (0.01 + 0.04 * age), 0, TAU); c.stroke(); c.fillStyle = NR; c.beginPath(); c.arc(p[0], p[1], w * 0.012, 0, TAU); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(p[0], p[1], w * 0.004, 0, TAU); c.fill(); });
    c.restore();
  }

  function bgTv(c, w, h, t, pal) {
    const bars = ["#e6e6e6", "#e6e600", "#00e6e6", "#00e600", "#e600e6", "#e60000", "#0000e6"], bw = w / 7, bh = h * 0.55, st = Math.floor(t * 20);
    bars.forEach((b, i) => { const dx = rnd(st + i * 3) > 0.9 ? (rnd(i + st) - 0.5) * w * 0.1 : 0; c.globalAlpha = 0.2; c.fillStyle = b; c.fillRect(i * bw + dx, 0, bw, bh); });
    c.globalAlpha = 0.15; bars.slice().reverse().forEach((b, i) => { c.fillStyle = b; c.fillRect(i * bw, bh + h * 0.02, bw, h * 0.06); });
    c.globalAlpha = 1; c.fillStyle = "rgba(0,0,0,.18)"; for (let y = 0; y < h; y += Math.max(3, h / 240)) c.fillRect(0, y, w, 1.2);
    const sd = Math.floor(t * 30); c.fillStyle = "#fff"; for (let i = 0; i < 420; i++) { c.globalAlpha = 0.05 + 0.2 * rnd(i + sd); c.fillRect(rnd(i * 3 + sd) * w, rnd(i * 7 + sd) * h, w * 0.006, w * 0.003); }
    c.globalAlpha = 1; const ry = ((t * 0.3) % 1) * h * 1.2 - h * 0.1, rg = c.createLinearGradient(0, ry - h * 0.06, 0, ry + h * 0.06); rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(0.5, "rgba(255,255,255,.16)"); rg.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = rg; c.fillRect(0, ry - h * 0.06, w, h * 0.12);
    if (rnd(Math.floor(t * 8)) > 0.75) { c.fillStyle = rgba(pal[1], 0.18); for (let k = 0; k < 3; k++) c.fillRect((rnd(k + st) - 0.5) * w * 0.2, rnd(k + 5 + st) * h, w, h * 0.02); }
  }

  function bgSocial(c, w, h, t, pal) {
    const col = pal[1], items = []; for (let i = 0; i < 10; i++) items.push({ i, d: rnd(i + 2) });
    items.sort((a, b) => a.d - b.d).forEach(({ i, d }) => {
      const sc = 0.55 + 0.5 * d, cw = w * 0.62 * sc, ch = h * 0.085 * sc, x = rnd(i + 9) * (w - cw) + sin(t * 0.5 + i) * w * 0.02, sp = h * (0.04 + 0.08 * d), y = (h + ch) - ((rnd(i + 14) * (h + 2 * ch) + t * sp) % (h + 2 * ch));
      c.globalAlpha = 0.25 + 0.5 * d; c.fillStyle = "rgba(255,255,255,.08)"; rrect(c, x, y, cw, ch, ch * 0.2); c.fill(); c.strokeStyle = rgba(col, 0.4); c.lineWidth = Math.max(1, w * 0.003); c.stroke();
      const g = c.createRadialGradient(x + ch * 0.4, y + ch * 0.4, 2, x + ch * 0.5, y + ch * 0.5, ch * 0.4); g.addColorStop(0, mixc(col, "#ffffff", 0.5)); g.addColorStop(1, col); c.fillStyle = g; c.beginPath(); c.arc(x + ch * 0.5, y + ch * 0.5, ch * 0.28, 0, TAU); c.fill();
      c.fillStyle = "rgba(255,255,255,.55)"; rrect(c, x + ch * 0.95, y + ch * 0.26, cw * 0.4, ch * 0.12, ch * 0.05); c.fill(); c.fillStyle = "rgba(255,255,255,.28)"; rrect(c, x + ch * 0.95, y + ch * 0.5, cw * 0.62, ch * 0.1, ch * 0.05); c.fill();
      c.save(); c.translate(x + cw - ch * 0.4, y + ch * 0.5); c.fillStyle = rnd(i + 3) > 0.5 ? NR : "rgba(255,255,255,.5)"; heartP(c, ch * 0.13); c.fill(); c.restore();
    });
    for (let i = 0; i < 14; i++) { const x = rnd(i + 40) * w, y = h - ((rnd(i + 50) * h + t * h * (0.08 + 0.08 * rnd(i + 60))) % (h * 1.1)); c.globalAlpha = 0.5 * (1 - y / h); c.save(); c.translate(x + sin(t * 2 + i) * 10, y); c.fillStyle = NR; heartP(c, w * 0.014); c.fill(); c.restore(); }
    c.globalAlpha = 1;
  }

  function bgMarket(c, w, h, t, pal) {
    const col = pal[1], N = 30, step = w / N, sp = 1.2, k0 = Math.floor(t * sp), frac = (t * sp) % 1, price = k => sin(k * 0.35) * 0.6 + sin(k * 0.13 + 2) * 0.9 + sin(k * 0.9) * 0.25, sc = h * 0.16, Y = v => h * 0.5 - v * sc;
    c.lineWidth = 1; for (let j = 0; j <= 8; j++) { c.strokeStyle = rgba(col, 0.08); c.beginPath(); c.moveTo(0, j * h / 8); c.lineTo(w, j * h / 8); c.stroke(); }
    for (let i = 0; i <= 12; i++) { c.strokeStyle = rgba(col, 0.06); c.beginPath(); c.moveTo(i * w / 12, 0); c.lineTo(i * w / 12, h); c.stroke(); }
    for (let i = -1; i <= N + 1; i++) {
      const k = k0 + i, x = (i - frac) * step, o = price(k), cl = price(k + 1), hi = Math.max(o, cl) + 0.15 * rnd(k), lo = Math.min(o, cl) - 0.15 * rnd(k + 99), up = cl >= o, cc = up ? "#19d37a" : "#ff3b57";
      c.globalAlpha = 0.6; c.strokeStyle = cc; c.fillStyle = cc; c.lineWidth = Math.max(1, step * 0.08); c.beginPath(); c.moveTo(x + step / 2, Y(hi)); c.lineTo(x + step / 2, Y(lo)); c.stroke(); c.fillRect(x + step * 0.2, Math.min(Y(o), Y(cl)), step * 0.6, Math.max(2, Math.abs(Y(o) - Y(cl))));
    }
    c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = Math.max(2, w * 0.005); c.beginPath();
    for (let i = -1; i <= N + 1; i++) { const k = k0 + i, m = (price(k) + price(k + 1) + price(k + 2)) / 3, x = (i - frac) * step + step / 2; i === -1 ? c.moveTo(x, Y(m)) : c.lineTo(x, Y(m)); } c.stroke();
    const last = price(k0 + N), ly = Y(last); c.setLineDash([w * 0.02, w * 0.015]); c.strokeStyle = rgba("#ffffff", 0.35); c.beginPath(); c.moveTo(0, ly); c.lineTo(w, ly); c.stroke(); c.setLineDash([]);
    c.fillStyle = rgba(col, 0.8 + 0.2 * sin(t * 4)); rrect(c, w - w * 0.2, ly - h * 0.015, w * 0.2, h * 0.03, h * 0.008); c.fill(); txt(c, (1200 + Math.round(last * 80)).toString(), w - w * 0.1, ly, h * 0.018, "#000", 800);
  }

  /* ==========================================================
     2. ВЕКТОРНЫЕ АНИМАЦИИ (10): fn(c, R, lt, pal), центр (0,0)
     ========================================================== */
  function aBreaking(c, R, lt) {
    const W = R * 2.5, H = R * 0.62, s = ease(clamp(lt / 0.55)), x = -(1 - s) * R * 3.2, fl = sin(lt * 9) > 0;
    c.save(); c.translate(x, 0);
    [-1, 1].forEach((sg, i) => { const on = i ? fl : !fl; c.fillStyle = on ? "#ff2a3d" : "#4a0a12"; c.shadowColor = "#ff2a3d"; c.shadowBlur = on ? R * 0.3 : 0; c.beginPath(); c.arc(sg * W * 0.42, -H * 0.95, R * 0.07, 0, TAU); c.fill(); c.shadowBlur = 0; });
    c.shadowColor = NR; c.shadowBlur = R * 0.25; const g = c.createLinearGradient(0, -H / 2, 0, H / 2); g.addColorStop(0, "#ff3b4e"); g.addColorStop(1, "#a30f1d"); c.fillStyle = g; rrect(c, -W / 2, -H / 2, W, H, R * 0.06); c.fill(); c.shadowBlur = 0;
    c.fillStyle = "#fff"; rrect(c, -W / 2, -H / 2, H, H, R * 0.06); c.fill(); txt(c, "!", -W / 2 + H / 2, 0, H * 0.85, NR, 900);
    txt(c, "СРОЧНО", H * 0.4, 0, H * 0.55, "#fff", 900);
    const ty = H / 2 + R * 0.05, th = R * 0.26; c.fillStyle = "#0b1220"; rrect(c, -W / 2, ty, W, th, R * 0.04); c.fill();
    c.save(); rrect(c, -W / 2, ty, W, th, R * 0.04); c.clip(); const unit = "ГЛАВНЫЕ НОВОСТИ  •  LIVE  •  ", px = th * 0.55; c.font = "700 " + px + "px " + FNT(); const uw = c.measureText(unit).width || 100, off = (lt * R * 0.9) % uw;
    for (let xx = -W / 2 - off; xx < W / 2; xx += uw) txt(c, unit, xx, ty + th / 2, px, "#fff", 700, "left"); c.restore();
    const sx = ((lt * 0.6) % 1.6 - 0.3) * W - W / 2, sg = c.createLinearGradient(sx - R * 0.3, 0, sx + R * 0.3, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,.35)"); sg.addColorStop(1, "rgba(255,255,255,0)");
    c.save(); rrect(c, -W / 2, -H / 2, W, H, R * 0.06); c.clip(); c.fillStyle = sg; c.fillRect(sx - R * 0.3, -H / 2, R * 0.6, H); c.restore(); c.restore();
  }

  function aGlobe(c, R, lt, pal) { globe(c, 0, 0, R * 0.95, lt, pal[1]); }

  function aPaper(c, R, lt) {
    const fl = cos(lt * 1.5), pw = R * 1.3, ph = R * 1.7;
    [2, 1].forEach(k => { c.save(); c.translate(k * R * 0.06, k * R * 0.05); c.rotate(k * 0.04); c.fillStyle = k === 2 ? "#cfc7b0" : "#ded6c0"; rrect(c, -pw / 2, -ph / 2, pw, ph, R * 0.03); c.fill(); c.restore(); });
    c.save(); c.scale(fl, 1); c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = R * 0.15; c.fillStyle = "#f4eedc"; rrect(c, -pw / 2, -ph / 2, pw, ph, R * 0.03); c.fill(); c.shadowBlur = 0;
    if (fl > 0) {
      txt(c, "ВЕСТНИК", 0, -ph / 2 + R * 0.17, R * 0.2, "#1a1a1a", 900); c.fillStyle = "#1a1a1a"; c.fillRect(-pw / 2 + R * 0.08, -ph / 2 + R * 0.3, pw - R * 0.16, R * 0.018); c.fillRect(-pw / 2 + R * 0.08, -ph / 2 + R * 0.33, pw - R * 0.16, R * 0.006);
      c.fillRect(-pw / 2 + R * 0.08, -ph / 2 + R * 0.4, pw * 0.8, R * 0.055); c.fillRect(-pw / 2 + R * 0.08, -ph / 2 + R * 0.48, pw * 0.5, R * 0.055);
      const ph0 = -ph / 2 + R * 0.6, g = c.createLinearGradient(0, ph0, 0, ph0 + R * 0.5); g.addColorStop(0, "#8aa0b8"); g.addColorStop(1, "#3a4a60"); c.fillStyle = g; c.fillRect(-pw / 2 + R * 0.08, ph0, pw - R * 0.16, R * 0.5); c.fillStyle = "#f2c94c"; c.beginPath(); c.arc(pw * 0.2, ph0 + R * 0.16, R * 0.09, 0, TAU); c.fill();
      const prog = clamp((lt % 5) / 3); let n = 0; for (let col = 0; col < 2; col++) for (let l = 0; l < 6; l++) { const f = clamp(prog * 12 - n); n++; c.fillStyle = "#444"; c.fillRect(-pw / 2 + R * 0.08 + col * (pw / 2 - R * 0.04), ph0 + R * 0.62 + l * R * 0.06, (pw / 2 - R * 0.16) * f * (0.7 + 0.3 * rnd(l + col * 7)), R * 0.028); }
    } else { c.fillStyle = "rgba(0,0,0,.08)"; for (let l = 0; l < 14; l++) c.fillRect(-pw / 2 + R * 0.1, -ph / 2 + R * 0.15 + l * R * 0.11, pw - R * 0.2, R * 0.03); }
    c.restore();
  }

  function aMic(c, R, lt) {
    for (let k = 0; k < 4; k++) { const age = (lt * 0.9 + k / 4) % 1, r = R * (0.45 + age * 0.9); c.strokeStyle = rgba("#ffffff", (1 - age) * 0.6); c.lineWidth = R * 0.04 * (1 - age) + 1; c.beginPath(); c.arc(0, -R * 0.45, r, PI * 0.78, PI * 1.22); c.stroke(); c.beginPath(); c.arc(0, -R * 0.45, r, -PI * 0.22, PI * 0.22); c.stroke(); }
    const hg = c.createLinearGradient(-R * 0.17, 0, R * 0.17, 0); hg.addColorStop(0, "#14181f"); hg.addColorStop(0.4, "#4a5260"); hg.addColorStop(1, "#14181f"); c.fillStyle = hg; rrect(c, -R * 0.17, -R * 0.1, R * 0.34, R * 1.25, R * 0.08); c.fill();
    for (let i = 0; i < 3; i++) { c.fillStyle = "#c9d3dc"; c.fillRect(-R * 0.18, R * 0.6 + i * R * 0.14, R * 0.36, R * 0.04); }
    const fg = c.createLinearGradient(0, 0, 0, R * 0.5); fg.addColorStop(0, "#ff3b4e"); fg.addColorStop(1, "#a30f1d"); c.fillStyle = fg; rrect(c, -R * 0.3, R * 0.05, R * 0.6, R * 0.42, R * 0.04); c.fill(); c.fillStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(-R * 0.3, R * 0.05); c.lineTo(-R * 0.2, -R * 0.02); c.lineTo(R * 0.4, -R * 0.02); c.lineTo(R * 0.3, R * 0.05); c.closePath(); c.fill(); txt(c, "N", 0, R * 0.26, R * 0.3, "#fff", 900);
    const hr = R * 0.38, hgr = c.createRadialGradient(-hr * 0.3, -R * 0.45 - hr * 0.3, hr * 0.1, 0, -R * 0.45, hr); hgr.addColorStop(0, "#f2f6fa"); hgr.addColorStop(0.6, "#8c97a6"); hgr.addColorStop(1, "#3a4452");
    c.fillStyle = hgr; c.beginPath(); c.arc(0, -R * 0.45, hr, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(0, -R * 0.45, hr, 0, TAU); c.clip(); c.strokeStyle = "rgba(20,24,32,.45)"; c.lineWidth = R * 0.018; for (let k = -8; k <= 8; k++) { c.beginPath(); c.moveTo(k * R * 0.07 - hr, -R * 0.45 - hr); c.lineTo(k * R * 0.07 + hr, -R * 0.45 + hr); c.stroke(); c.beginPath(); c.moveTo(k * R * 0.07 + hr, -R * 0.45 - hr); c.lineTo(k * R * 0.07 - hr, -R * 0.45 + hr); c.stroke(); } c.restore();
    c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = R * 0.03; c.beginPath(); c.arc(0, -R * 0.45, hr * 0.8, PI * 1.1, PI * 1.45); c.stroke();
    for (let i = 0; i < 5; i++) { const bh = R * 0.3 * (0.2 + 0.8 * Math.abs(sin(lt * 4 + i * 0.9))); c.fillStyle = rgba("#ffffff", 0.7); c.fillRect(-R * 0.5 + i * R * 0.1 - R * 0.0, R * 1.0 - bh + 0, R * 0.06, bh); }
  }

  function aCamera(c, R, lt) {
    const g1 = (x0, y0, x1, y1, a, b) => { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    c.save(); c.translate(-R * 0.2, 0); c.strokeStyle = "#3a4352"; c.lineWidth = R * 0.05; c.lineCap = "round";
    [-1, 0, 1].forEach(k => { c.beginPath(); c.moveTo(0, R * 0.42); c.lineTo(k * R * 0.5, R * 1.05); c.stroke(); });
    c.fillStyle = g1(0, -R * 0.45, 0, R * 0.4, "#3a4352", "#1d222c"); rrect(c, -R * 0.85, -R * 0.45, R * 1.2, R * 0.85, R * 0.1); c.fill();
    c.fillStyle = "#12161d"; rrect(c, -R * 0.97, -R * 0.3, R * 0.14, R * 0.6, R * 0.04); c.fill();
    c.fillStyle = g1(0, -R * 0.82, 0, -R * 0.44, "#2c3340", "#1a1f28"); rrect(c, -R * 0.72, -R * 0.82, R * 0.66, R * 0.38, R * 0.06); c.fill(); c.fillStyle = rgba("#4cc9f0", 0.5 + 0.2 * sin(lt * 3)); rrect(c, -R * 0.66, -R * 0.76, R * 0.4, R * 0.26, R * 0.03); c.fill();
    c.strokeStyle = "#2a303b"; c.lineWidth = R * 0.07; c.beginPath(); c.moveTo(-R * 0.3, -R * 0.45); c.quadraticCurveTo(0, -R * 0.85, R * 0.35, -R * 0.45); c.stroke();
    c.fillStyle = g1(0, -R * 0.3, 0, R * 0.3, "#2c3340", "#14181f"); rrect(c, R * 0.35, -R * 0.3, R * 0.45, R * 0.6, R * 0.04); c.fill();
    c.fillStyle = "#0f1319"; rrect(c, R * 0.8, -R * 0.38, R * 0.3, R * 0.76, R * 0.04); c.fill(); c.strokeStyle = "#3a4352"; c.lineWidth = R * 0.02; for (let k = 0; k < 9; k++) { const x = R * 0.82 + ((k * 0.03 + lt * 0.05) % 0.27) * R; c.beginPath(); c.moveTo(x, -R * 0.36); c.lineTo(x, R * 0.36); c.stroke(); }
    c.fillStyle = g1(0, -R * 0.34, 0, R * 0.34, "#3a4352", "#161a21"); rrect(c, R * 1.1, -R * 0.34, R * 0.18, R * 0.68, R * 0.04); c.fill();
    c.fillStyle = "#0b0e13"; c.beginPath(); c.moveTo(R * 1.25, -R * 0.38); c.lineTo(R * 1.62, -R * 0.56); c.lineTo(R * 1.62, R * 0.56); c.lineTo(R * 1.25, R * 0.38); c.closePath(); c.fill();
    const lg = c.createRadialGradient(R * 1.3, -R * 0.1, R * 0.02, R * 1.3, 0, R * 0.3); lg.addColorStop(0, "#9fe3f0"); lg.addColorStop(0.5, "#2a8aa0"); lg.addColorStop(1, "#0b2a38"); c.fillStyle = lg; c.beginPath(); c.ellipse(R * 1.27, 0, R * 0.09, R * 0.28, 0, 0, TAU); c.fill();
    const on = sin(lt * 5) > 0; c.fillStyle = on ? "#ff2a3d" : "#4a0a12"; c.shadowColor = "#ff2a3d"; c.shadowBlur = on ? R * 0.2 : 0; c.beginPath(); c.arc(-R * 0.62, -R * 0.28, R * 0.05, 0, TAU); c.fill(); c.shadowBlur = 0; txt(c, "REC", -R * 0.38, -R * 0.28, R * 0.1, "#fff", 800);
    c.restore();
  }

  function aAntenna(c, R, lt) {
    const top = -R * 0.8, base = R * 0.95; c.lineCap = "round";
    for (let k = 0; k < 4; k++) { const age = (lt * 0.8 + k / 4) % 1, r = R * (0.2 + age * 1.0); c.strokeStyle = rgba("#ffffff", (1 - age) * 0.7); c.lineWidth = R * 0.04 * (1 - age) + 1; c.beginPath(); c.arc(0, top, r, -PI * 0.35, PI * 0.35); c.stroke(); c.beginPath(); c.arc(0, top, r, PI * 0.65, PI * 1.35); c.stroke(); }
    const levels = 8; for (let i = 0; i < levels; i++) {
      const y0 = top + (base - top) * i / levels, y1 = top + (base - top) * (i + 1) / levels, w0 = R * (0.04 + 0.4 * i / levels), w1 = R * (0.04 + 0.4 * (i + 1) / levels), col = i % 2 ? "#f4f7fa" : NR;
      c.strokeStyle = col; c.lineWidth = R * 0.05; c.beginPath(); c.moveTo(-w0, y0); c.lineTo(-w1, y1); c.moveTo(w0, y0); c.lineTo(w1, y1); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = R * 0.02; c.beginPath(); c.moveTo(-w1, y1); c.lineTo(w1, y1); c.moveTo(-w0, y0); c.lineTo(w1, y1); c.moveTo(w0, y0); c.lineTo(-w1, y1); c.stroke();
    }
    c.fillStyle = "#e8edf3"; c.beginPath(); c.ellipse(R * 0.18, top + R * 0.55, R * 0.14, R * 0.2, 0.3, 0, TAU); c.fill(); c.strokeStyle = "#8896a6"; c.lineWidth = R * 0.02; c.stroke();
    const on = 0.4 + 0.6 * (sin(lt * 6) * 0.5 + 0.5); c.shadowColor = "#ff2a3d"; c.shadowBlur = R * 0.3 * on; c.fillStyle = rgba("#ff2a3d", on); c.beginPath(); c.arc(0, top - R * 0.03, R * 0.07, 0, TAU); c.fill(); c.shadowBlur = 0;
  }

  function aFeed(c, R, lt, pal) {
    const ww = R * 1.4, wh = R * 2.1, cardH = R * 0.85, gap = R * 0.12, off = (lt * R * 0.5) % (cardH + gap), col = pal[1];
    c.save(); rrect(c, -ww / 2, -wh / 2, ww, wh, R * 0.14); c.clip(); c.fillStyle = "rgba(10,16,28,.85)"; c.fillRect(-ww / 2, -wh / 2, ww, wh);
    for (let i = -1; i < 4; i++) {
      const y = -wh / 2 + i * (cardH + gap) - off + gap, id = Math.floor((lt * R * 0.5) / (cardH + gap)) + i;
      c.fillStyle = "rgba(255,255,255,.09)"; rrect(c, -ww / 2 + R * 0.08, y, ww - R * 0.16, cardH, R * 0.08); c.fill();
      const ag = c.createRadialGradient(-ww / 2 + R * 0.28, y + R * 0.2, 1, -ww / 2 + R * 0.28, y + R * 0.22, R * 0.14); ag.addColorStop(0, mixc(col, "#ffffff", 0.5)); ag.addColorStop(1, col); c.fillStyle = ag; c.beginPath(); c.arc(-ww / 2 + R * 0.28, y + R * 0.22, R * 0.12, 0, TAU); c.fill();
      c.fillStyle = "rgba(255,255,255,.7)"; rrect(c, -ww / 2 + R * 0.46, y + R * 0.12, R * 0.5, R * 0.06, R * 0.03); c.fill(); c.fillStyle = "rgba(255,255,255,.35)"; rrect(c, -ww / 2 + R * 0.46, y + R * 0.24, R * 0.32, R * 0.05, R * 0.025); c.fill();
      const ig = c.createLinearGradient(0, y + R * 0.38, 0, y + R * 0.7); ig.addColorStop(0, rgba(col, 0.6)); ig.addColorStop(1, rgba(NR, 0.5)); c.fillStyle = ig; rrect(c, -ww / 2 + R * 0.16, y + R * 0.38, ww - R * 0.32, R * 0.32, R * 0.05); c.fill();
      c.save(); c.translate(-ww / 2 + R * 0.28, y + R * 0.78); const liked = rnd(id + 4) > 0.4, pul = liked ? 1 + 0.2 * Math.max(0, sin(lt * 4 + id)) : 1; c.fillStyle = liked ? NR : "rgba(255,255,255,.5)"; heartP(c, R * 0.05 * pul); c.fill(); c.restore();
      txt(c, String(12 + Math.floor(rnd(id + 7) * 90)), -ww / 2 + R * 0.5, y + R * 0.78, R * 0.1, "rgba(255,255,255,.7)", 700, "left");
    }
    c.restore(); c.strokeStyle = rgba(col, 0.6); c.lineWidth = R * 0.03; rrect(c, -ww / 2, -wh / 2, ww, wh, R * 0.14); c.stroke();
    c.fillStyle = NR; c.beginPath(); c.arc(ww / 2, -wh / 2, R * 0.17, 0, TAU); c.fill(); txt(c, String(1 + Math.floor(lt * 2) % 9), ww / 2, -wh / 2, R * 0.2, "#fff", 900);
    for (let k = 0; k < 4; k++) { const u = (lt * 0.5 + k / 4) % 1; c.globalAlpha = 1 - u; c.save(); c.translate(ww / 2 + R * 0.1 + sin(u * 6 + k) * R * 0.1, wh / 2 - u * wh * 0.8); c.fillStyle = NR; heartP(c, R * 0.06); c.fill(); c.restore(); } c.globalAlpha = 1;
  }

  function aClock(c, R, lt) {
    const r = R * 0.9, p = (lt % 8) / 8, g = c.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, "#27324a"); g.addColorStop(1, "#0b1220");
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.fillStyle = rgba(NR, 0.5); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r * 0.92, -PI / 2, -PI / 2 + TAU * p); c.closePath(); c.fill();
    for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, l = i % 5 === 0 ? 0.12 : 0.05; c.strokeStyle = i % 5 === 0 ? "#fff" : "rgba(255,255,255,.5)"; c.lineWidth = r * (i % 5 === 0 ? 0.04 : 0.02); c.beginPath(); c.moveTo(cos(a) * r * 0.93, sin(a) * r * 0.93); c.lineTo(cos(a) * r * (0.93 - l), sin(a) * r * (0.93 - l)); c.stroke(); }
    c.lineCap = "round"; c.strokeStyle = "#fff"; c.lineWidth = r * 0.07; let a = lt * 0.08 - PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(cos(a) * r * 0.45, sin(a) * r * 0.45); c.stroke();
    c.lineWidth = r * 0.05; a = lt * 0.5 - PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(cos(a) * r * 0.68, sin(a) * r * 0.68); c.stroke();
    c.strokeStyle = "#ffd23f"; c.lineWidth = r * 0.025; a = lt * TAU / 4 - PI / 2; c.beginPath(); c.moveTo(-cos(a) * r * 0.15, -sin(a) * r * 0.15); c.lineTo(cos(a) * r * 0.82, sin(a) * r * 0.82); c.stroke();
    c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(0, 0, r * 0.06, 0, TAU); c.fill();
    c.strokeStyle = "#c9d3dc"; c.lineWidth = r * 0.06; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
    txt(c, "24/7", 0, r * 0.4, r * 0.24, "#fff", 900); c.fillStyle = rgba(NR, 0.4 + 0.6 * (sin(lt * 5) * 0.5 + 0.5)); c.beginPath(); c.arc(-r * 0.18, -r * 0.35, r * 0.05, 0, TAU); c.fill(); txt(c, "LIVE", r * 0.08, -r * 0.35, r * 0.14, "#fff", 800);
  }

  function pinPath(c, s) { c.beginPath(); c.moveTo(0, s * 1.3); c.bezierCurveTo(-s * 0.25, s * 0.7, -s, s * 0.4, -s, -s * 0.15); c.arc(0, -s * 0.15, s, PI, 0, false); c.bezierCurveTo(s, s * 0.4, s * 0.25, s * 0.7, 0, s * 1.3); c.closePath(); }
  function aPin(c, R, lt) {
    const per = 2.6, u = (lt % per) / per, fy = R * 0.8, s = R * 0.38;
    const fg = c.createRadialGradient(0, fy, R * 0.1, 0, fy, R * 1.1); fg.addColorStop(0, "rgba(60,110,200,.7)"); fg.addColorStop(1, "rgba(30,60,140,0)"); c.fillStyle = fg; c.beginPath(); c.ellipse(0, fy, R * 1.1, R * 0.3, 0, 0, TAU); c.fill();
    c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 1; for (let k = -2; k <= 2; k++) { c.beginPath(); c.ellipse(0, fy, R * (0.55 + 0.25 * Math.abs(k)), R * 0.3 * (0.3 + 0.2 * Math.abs(k)), 0, 0, TAU); c.stroke(); }
    let y; if (u < 0.35) { const f = u / 0.35; y = -R * 1.1 + (fy - s * 1.3 + R * 1.1) * f * f; } else if (u < 0.55) { const f = (u - 0.35) / 0.2; y = fy - s * 1.3 - R * 0.28 * Math.abs(sin(f * PI)) * (1 - f * 0.6); } else y = fy - s * 1.3 + sin(lt * 4) * R * 0.02;
    if (u > 0.35) { const f = (u - 0.35) / 0.65; for (let k = 0; k < 3; k++) { const a = clamp(f - k * 0.15); if (a > 0) { c.strokeStyle = rgba(NR, (1 - a) * 0.8); c.lineWidth = R * 0.03; c.beginPath(); c.ellipse(0, fy, R * (0.1 + a * 0.9), R * (0.03 + a * 0.22), 0, 0, TAU); c.stroke(); } } }
    c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.ellipse(0, fy, s * 0.5 * (1 - 0.3 * clamp((fy - s * 1.3 - y) / R)), s * 0.14, 0, 0, TAU); c.fill();
    c.save(); c.translate(0, y); c.shadowColor = NR; c.shadowBlur = R * 0.2; const g = c.createLinearGradient(-s, -s, s, s); g.addColorStop(0, "#ff6b7a"); g.addColorStop(0.5, "#e6192d"); g.addColorStop(1, "#7a0a16"); c.fillStyle = g; pinPath(c, s); c.fill(); c.shadowBlur = 0;
    c.fillStyle = "#fff"; c.beginPath(); c.arc(0, -s * 0.15, s * 0.38, 0, TAU); c.fill(); c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(-s * 0.5, -s * 0.55, s * 0.18, s * 0.1, -0.6, 0, TAU); c.fill(); c.restore();
    if (u > 0.55) { const f = ease(clamp((u - 0.55) / 0.15)); c.save(); c.translate(s * 1.3, fy - R * 1.0); c.scale(f, f); c.fillStyle = "rgba(255,255,255,.95)"; rrect(c, 0, -R * 0.3, R * 0.95, R * 0.5, R * 0.07); c.fill(); c.fillStyle = NR; rrect(c, R * 0.06, -R * 0.24, R * 0.2, R * 0.12, R * 0.03); c.fill(); c.fillStyle = "#1a1a1a"; c.fillRect(R * 0.06, -R * 0.06, R * 0.7, R * 0.05); c.fillStyle = "#777"; c.fillRect(R * 0.06, R * 0.04, R * 0.5, R * 0.04); c.restore(); }
  }

  function aStocks(c, R, lt, pal) {
    const W = R * 2.2, H = R * 1.5, n = 9, p = ease(clamp((lt % 6) / 4)), col = pal[1];
    const O = [0.1, 0.2, 0.1, 0.35, 0.3, 0.5, 0.45, 0.7, 0.65], C = [0.2, 0.1, 0.35, 0.3, 0.5, 0.45, 0.7, 0.65, 0.92], X = i => -W / 2 + (i + 0.5) / n * W, Y = v => H / 2 - v * H;
    c.strokeStyle = "rgba(255,255,255,.14)"; c.lineWidth = 1; for (let k = 0; k <= 4; k++) { c.beginPath(); c.moveTo(-W / 2, -H / 2 + k * H / 4); c.lineTo(W / 2, -H / 2 + k * H / 4); c.stroke(); }
    c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(-W / 2, -H / 2); c.lineTo(-W / 2, H / 2); c.lineTo(W / 2, H / 2); c.stroke();
    const cw = W / n * 0.55;
    for (let i = 0; i < n; i++) { const f = clamp(p * n - i), up = C[i] >= O[i], cc = up ? "#19d37a" : "#ff3b57", o = O[i], cl = O[i] + (C[i] - O[i]) * f, hi = Math.max(o, cl) + 0.06, lo = Math.min(o, cl) - 0.06; if (f <= 0) continue; c.strokeStyle = cc; c.fillStyle = cc; c.lineWidth = R * 0.03; c.beginPath(); c.moveTo(X(i), Y(hi)); c.lineTo(X(i), Y(lo)); c.stroke(); c.fillRect(X(i) - cw / 2, Math.min(Y(o), Y(cl)), cw, Math.max(2, Math.abs(Y(o) - Y(cl)))); }
    c.shadowColor = col; c.shadowBlur = R * 0.15; c.strokeStyle = col; c.lineWidth = R * 0.05; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); let ex = 0, ey = 0;
    for (let i = 0; i < n; i++) { const f = clamp(p * n - i); if (f <= 0) break; const v = O[i] + (C[i] - O[i]) * f; ex = X(i); ey = Y(v) - R * 0.1; i ? c.lineTo(ex, ey) : c.moveTo(ex, ey); } c.stroke();
    if (p > 0.2) { c.fillStyle = col; c.beginPath(); c.moveTo(ex + R * 0.2, ey - R * 0.1); c.lineTo(ex - R * 0.05, ey - R * 0.22); c.lineTo(ex - R * 0.05, ey + R * 0.02); c.closePath(); c.fill(); } c.shadowBlur = 0;
    if (p > 0.9) { c.fillStyle = "#19d37a"; rrect(c, W / 2 - R * 0.55, -H / 2 - R * 0.05, R * 0.6, R * 0.3, R * 0.06); c.fill(); txt(c, "+24%", W / 2 - R * 0.25, -H / 2 + R * 0.1, R * 0.2, "#04210f", 900); }
  }

  /* ==========================================================
     3. ИКОНКИ (10): контуры 24×24
     ========================================================== */
  const ICONS = {
    newspaper: ["Газета", "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2 M18 14h-8 M15 18h-5 M10 6h8v4h-8V6Z"],
    mic: ["Микрофон", "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3"],
    video: ["Видеокамера", "m22 8-6 4 6 4V8Z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"],
    radiotower: ["Радиовышка", "M4.9 16.1C1 12.2 1 5.8 4.9 1.9 M7.8 4.7a6.14 6.14 0 0 0-.8 7.5 M16.2 4.7a6.14 6.14 0 0 1 .8 7.5 M19.1 1.9a10.14 10.14 0 0 1 0 14.2 M9.5 18h5 M8 22l4-11 4 11 M12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
    rss: ["Лента RSS", "M4 11a9 9 0 0 1 9 9 M4 4a16 16 0 0 1 16 16 M5 18.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z"],
    tv: ["Телевизор", "M4 7h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M17 2l-5 5-5-5"],
    alert: ["Срочное", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01"],
    article: ["Статья", "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"],
    share: ["Поделиться", "M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4"],
    search: ["Поиск", "M21 21l-4.3-4.3 M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"]
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
  const lathe = (pts, seg) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg || 48);
  function roundedRect(w, h, r) { const T = THREE, s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function bar(a, b, r, mat) { const T = THREE, d = new T.Vector3().subVectors(b, a), len = d.length(), m = new T.Mesh(new T.CylinderGeometry(r, r, len, 10), mat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); return m; }
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const tubeOf = (pts, r, mat, seg) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V(p[0], p[1], p[2]))), seg || 48, r, 12, false), mat);
  function canvasTex(w, h, fn) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const x = cv.getContext("2d"); fn(x, w, h); const tex = new THREE.CanvasTexture(cv); return { tex, cv, x }; }
  const SERIF = "Georgia, 'Times New Roman', serif";

  function paperFace() {
    return canvasTex(512, 720, (x, w, h) => {
      x.fillStyle = "#efe7d2"; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 1500; i++) { x.fillStyle = `rgba(120,100,70,${0.03 + 0.05 * rnd(i)})`; x.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 1.5, 1.5); }
      x.fillStyle = "#1b1b1b"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "900 64px " + SERIF; x.fillText("THE DAILY", 256, 62);
      x.fillRect(30, 100, 452, 4); x.fillRect(30, 108, 452, 1.5); x.font = "13px " + SERIF; x.fillText("ВЫПУСК № 128   •   СЕГОДНЯ   •   ГЛАВНОЕ ЗА ДЕНЬ", 256, 124);
      x.font = "900 46px " + SERIF; x.fillText("BREAKING NEWS", 256, 176); x.font = "900 30px " + SERIF; x.fillText("EXCLUSIVE REPORT", 256, 216);
      const g = x.createLinearGradient(0, 240, 0, 420); g.addColorStop(0, "#8aa0b8"); g.addColorStop(1, "#3a4a60"); x.fillStyle = g; x.fillRect(30, 240, 260, 180); x.fillStyle = "#2a3444"; x.beginPath(); x.arc(160, 330, 36, 0, TAU); x.fill(); x.fillRect(110, 365, 100, 55);
      x.fillStyle = "#333"; for (let c = 0; c < 2; c++) for (let l = 0; l < 14; l++) x.fillRect(306, 244 + l * 13.5, 176 * (0.6 + 0.4 * rnd(l + c)), 5);
      for (let col = 0; col < 3; col++) for (let l = 0; l < 22; l++) { x.fillStyle = "#3a3a3a"; x.fillRect(30 + col * 154, 440 + l * 12.5, 138 * (l % 7 === 6 ? 0.5 : 0.85 + 0.15 * rnd(l * 3 + col)), 4.5); }
    });
  }

  const M3 = {};
  M3.n3_newspaper = pal => {
    const R = rig(pal), T = R.T, pf = paperFace(), side = new T.MeshStandardMaterial({ color: "#e8e0cb", roughness: 0.95 });
    const face = new T.MeshStandardMaterial({ map: pf.tex, roughness: 0.9 }), back = new T.MeshStandardMaterial({ color: "#e6dec9", roughness: 0.95 }), sheets = [];
    [-0.2, 0, 0.2].forEach((rz, i) => { const m = new T.Mesh(new T.BoxGeometry(2.0, 2.8, 0.03), [side, side, side, side, i === 1 ? face : new T.MeshStandardMaterial({ map: pf.tex, roughness: 0.9, color: i ? "#ddd" : "#fff" }), back]); m.rotation.z = rz; m.position.set(rz * 1.2, 0, i * 0.04); R.model.add(m); sheets.push(m); });
    R.fit(3.5);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.8) * 0.6; R.root.rotation.x = 0.15; sheets.forEach((s, i) => { s.rotation.x = sin(lt * 1.5 + i) * 0.03; }); } };
  };

  M3.n3_mic = pal => {
    const R = rig(pal), T = R.T, chrome = MC("#d5dde6", { gloss: 1, dark: "#222c36" }), black = MC("#1b2029", { gloss: 0.5 });
    R.model.add(new T.Mesh(lathe([[0, -1.6], [0.17, -1.6], [0.2, -1.5], [0.2, 0.3], [0.23, 0.45], [0.17, 0.7], [0.14, 0.7]], 40), black));
    [-0.9, -0.6, -0.3].forEach(y => { const r = new T.Mesh(new T.TorusGeometry(0.205, 0.025, 10, 40), chrome); r.rotation.x = PI / 2; r.position.y = y; R.model.add(r); });
    const col = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 0.12, 40), chrome); col.position.y = 0.4; R.model.add(col);
    const flag = canvasTex(256, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#ff3b4e"); g.addColorStop(1, "#a30f1d"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.fillRect(0, 196, w, 14); x.font = "900 150px Arial, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("N", 128, 104); });
    const fm = new T.MeshStandardMaterial({ map: flag.tex, roughness: 0.5 }), fcube = new T.Mesh(new T.BoxGeometry(0.8, 0.8, 0.8), [fm, fm, new T.MeshStandardMaterial({ color: "#c0182a" }), new T.MeshStandardMaterial({ color: "#8a0f1d" }), fm, fm]); fcube.position.y = 0.62; R.model.add(fcube);
    const head = new T.Mesh(new T.SphereGeometry(0.52, 40, 28), MC("#c9d3dc", { gloss: 1, dark: "#1d2630" })); head.position.y = 1.5; R.model.add(head);
    const grille = new T.Mesh(new T.SphereGeometry(0.535, 22, 16), new T.MeshBasicMaterial({ color: 0x20262f, wireframe: true, transparent: true, opacity: 0.55 })); grille.position.y = 1.5; R.model.add(grille);
    R.model.add(tubeOf([[0, -1.6, 0], [0.05, -1.9, 0.1], [-0.4, -2.2, 0.3], [-0.8, -2.5, 0.2]], 0.045, black, 40));
    R.fit(3.7);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.7; R.root.rotation.z = -0.25 + sin(lt * 1.2) * 0.05; } };
  };

  M3.n3_camera = pal => {
    const R = rig(pal), T = R.T, body = MC("#2b3340", { gloss: 0.7, dark: "#06080b" }), dark = MC("#10141b", { gloss: 0.4 }), metal = MC("#c9d3dc", { gloss: 1, dark: "#222c36" });
    const b = new T.Mesh(new T.ExtrudeGeometry(roundedRect(1.5, 1.1, 0.2), { depth: 2.0, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 10 }), body); b.geometry.center(); R.model.add(b);
    const zl = (r, len, z, mat) => { const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 40), mat); m.rotation.x = PI / 2; m.position.z = z; R.model.add(m); return m; };
    zl(0.5, 1.0, 1.5, MC("#1a1f28", { gloss: 0.6 })); const ring = zl(0.56, 0.3, 1.7, dark);
    for (let i = 0; i < 6; i++) { const t = new T.Mesh(new T.TorusGeometry(0.565, 0.018, 8, 40), metal); t.position.z = 1.58 + i * 0.05; R.model.add(t); }
    const glass = zl(0.47, 0.05, 2.03, MC("#2a8aa0", { gloss: 1, hi: "#bff3ff", dark: "#04141a" })), hood = new T.Mesh(new T.CylinderGeometry(0.78, 0.56, 0.5, 40, 1, true), new T.MeshBasicMaterial({ color: 0x07090c, side: T.DoubleSide })); hood.rotation.x = PI / 2; hood.position.z = 2.3; R.model.add(hood);
    const vf = new T.Mesh(new T.BoxGeometry(0.42, 0.36, 0.95), body); vf.position.set(-0.45, 0.85, 0.3); R.model.add(vf);
    const scr = new T.Mesh(new T.PlaneGeometry(0.34, 0.26), new T.MeshBasicMaterial({ color: 0x4cc9f0 })); scr.position.set(-0.45, 0.85, -0.18); scr.rotation.y = PI; R.model.add(scr);
    const hd = new T.Mesh(new T.BoxGeometry(0.14, 0.12, 1.3), metal); hd.position.set(0, 0.7, 0.2); R.model.add(hd);
    [-0.45, 0.45].forEach(x => { const p = new T.Mesh(new T.BoxGeometry(0.1, 0.2, 0.1), metal); p.position.set(x * 0.0, 0.62, x * 0.9); R.model.add(p); });
    const pad = new T.Mesh(new T.BoxGeometry(1.0, 0.25, 0.8), MC("#14181f", { gloss: 0.2 })); pad.position.set(0, -0.62, -0.5); R.model.add(pad);
    const bat = new T.Mesh(new T.BoxGeometry(0.9, 0.7, 0.28), dark); bat.position.set(0, 0, -1.15); R.model.add(bat);
    const tally = new T.Mesh(new T.SphereGeometry(0.07, 16, 12), new T.MeshBasicMaterial({ color: 0xff2a3d })); tally.position.set(0.5, 0.55, 1.05); R.model.add(tally);
    R.fit(3.7);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.75 + sin(lt * 0.6) * 0.5; R.root.rotation.x = 0.12; tally.material.color.setHex(sin(lt * 5) > 0 ? 0xff2a3d : 0x4a0a12); ring.rotation.y = sin(lt) * 0.4; } };
  };

  M3.n3_globe = pal => {
    const R = rig(pal), T = R.T, group = new T.Group();
    R.model.add(group);
    const ocean = new T.Mesh(new T.SphereGeometry(1.42, 48, 32), new T.MeshStandardMaterial({ color: 0x1769aa, metalness: 0.25, roughness: 0.42 }));
    group.add(ocean);
    const landMat = new T.MeshStandardMaterial({ color: 0x55a85a, roughness: 0.82 });
    const patches = [[-.45,.55,.34,.22],[.25,.35,.25,.42],[-.72,-.12,.18,.38],[.58,-.42,.3,.2],[-.1,-.62,.42,.16]];
    patches.forEach(([x,y,sx,sy]) => {
      const z = Math.sqrt(Math.max(.05, 1 - x*x - y*y));
      const m = new T.Mesh(new T.SphereGeometry(1, 20, 14), landMat);
      m.scale.set(sx, sy, .035); m.position.set(x*1.43, y*1.43, z*1.43); m.lookAt(x*2, y*2, z*2); group.add(m);
    });
    const gridMat = new T.MeshBasicMaterial({ color: 0x9bd8ff, transparent: true, opacity: .42 });
    [-.9,-.45,0,.45,.9].forEach(v => {
      const rr = 1.425 * Math.sqrt(1-v*v);
      const ring = new T.Mesh(new T.TorusGeometry(rr, .009, 6, 64), gridMat);
      ring.rotation.x = Math.PI/2; ring.position.y = v*1.425; group.add(ring);
    });
    const meridian = new T.Mesh(new T.TorusGeometry(1.43, .009, 6, 72), gridMat);
    meridian.rotation.y = Math.PI/2; group.add(meridian);
    const gold = new T.MeshStandardMaterial({ color: 0xd7b14f, metalness: .7, roughness: .25 });
    const axis = new T.Mesh(new T.CylinderGeometry(.025,.025,3.35,12), gold); axis.rotation.z=.22; group.add(axis);
    const base = new T.Mesh(new T.CylinderGeometry(.72,.82,.16,40), gold); base.position.y=-1.72; R.model.add(base);
    const collar = new T.Mesh(new T.CylinderGeometry(.18,.28,.35,32), gold); collar.position.y=-1.53; R.model.add(collar);
    R.fit(3.8);
    return { sc:R.sc, up:lt=>{group.rotation.y=lt*.48; group.rotation.x=.12+Math.sin(lt*.35)*.08;} };
  };

  function tvScreen(x, w, h, lt) {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#0a2a6e"); g.addColorStop(1, "#0b1a44"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(76,201,240,.25)"; x.lineWidth = 2; for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(w * 0.75, h * 0.42, 60 + i * 38 + (lt * 20) % 38, 40 + i * 24, 0, 0, TAU); x.stroke(); }
    x.fillStyle = "#223a6a"; x.beginPath(); x.arc(w * 0.28, h * 0.3, 54, 0, TAU); x.fill(); x.beginPath(); x.ellipse(w * 0.28, h * 0.62, 120, 90, 0, PI, 0); x.fill();
    x.fillStyle = NR; x.fillRect(40, 40, 230, 54); x.fillStyle = "#fff"; x.font = "900 36px Arial, sans-serif"; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("СРОЧНО", 56, 68);
    const on = sin(lt * 5) > 0; x.fillStyle = on ? "#ff2a3d" : "#5a0a12"; x.beginPath(); x.arc(w - 120, 66, 10, 0, TAU); x.fill(); x.fillStyle = "#fff"; x.font = "800 26px Arial, sans-serif"; x.fillText("LIVE", w - 100, 68);
    x.fillStyle = "rgba(255,255,255,.95)"; x.fillRect(0, h * 0.7, w * 0.8, 74); x.fillStyle = NR; x.fillRect(0, h * 0.7, 18, 74); x.fillStyle = "#101826"; x.font = "800 30px Arial, sans-serif"; x.fillText("ГЛАВНЫЕ НОВОСТИ ДНЯ", 40, h * 0.7 + 26); x.fillStyle = "#58647a"; x.font = "600 20px Arial, sans-serif"; x.fillText("Подробности в эфире и на сайте", 40, h * 0.7 + 56);
    x.fillStyle = "#0a0f1a"; x.fillRect(0, h - 60, w, 60); x.fillStyle = NR; x.fillRect(0, h - 60, 130, 60); x.fillStyle = "#fff"; x.font = "900 26px Arial, sans-serif"; x.fillText("NEWS", 24, h - 30);
    x.save(); x.beginPath(); x.rect(140, h - 60, w - 140, 60); x.clip(); x.font = "700 26px Arial, sans-serif"; const unit = "КУРС  •  ПОГОДА  •  СПОРТ  •  ЭКОНОМИКА  •  МИР  •  ", uw = x.measureText(unit).width, off = (lt * 120) % uw; for (let xx = 150 - off; xx < w; xx += uw) x.fillText(unit, xx, h - 30); x.restore();
  }
  M3.n3_tv = pal => {
    const R = rig(pal), T = R.T;
    const frameMat = new T.MeshStandardMaterial({ color:0x171d29, metalness:.72, roughness:.28 });
    const screenMat = new T.MeshBasicMaterial({ color:0x102c55 });
    const trimMat = new T.MeshStandardMaterial({ color:0x65758b, metalness:.85, roughness:.2 });
    const bezel = new T.Mesh(new T.ExtrudeGeometry(roundedRect(4.2,2.55,.18),{depth:.28,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:4}),frameMat);
    bezel.geometry.center(); R.model.add(bezel);
    const screen = new T.Mesh(new T.PlaneGeometry(3.82,2.16),screenMat); screen.position.z=.17; R.model.add(screen);
    const top = new T.Mesh(new T.BoxGeometry(3.82,.055,.025),trimMat); top.position.set(0,1.08,.19); R.model.add(top);
    const ticker = new T.Mesh(new T.BoxGeometry(3.82,.34,.035),new T.MeshBasicMaterial({color:0xb8172b})); ticker.position.set(0,-.79,.2); R.model.add(ticker);
    const headline = new T.Mesh(new T.BoxGeometry(2.7,.075,.025),new T.MeshBasicMaterial({color:0xffffff})); headline.position.set(-.35,-.72,.23); R.model.add(headline);
    const live = new T.Mesh(new T.SphereGeometry(.075,16,12),new T.MeshBasicMaterial({color:0xff253f})); live.position.set(1.72,.93,.23); R.model.add(live);
    const neck = new T.Mesh(new T.BoxGeometry(.34,.55,.24),frameMat); neck.position.y=-1.55; R.model.add(neck);
    const foot = new T.Mesh(new T.CylinderGeometry(.95,1.08,.14,40),frameMat); foot.scale.z=.52; foot.position.y=-1.88; R.model.add(foot);
    R.fit(4.0);
    return { sc:R.sc, up:lt=>{R.root.rotation.y=Math.sin(lt*.55)*.32; R.root.rotation.x=.04; live.material.color.setHex(Math.sin(lt*5)>0?0xff253f:0x52101b); ticker.scale.x=.96+.04*Math.sin(lt*2); } };
  };

  M3.n3_tower = pal => {
    const R = rig(pal), T = R.T, red = MC("#e6192d", { gloss: 0.8 }), white = MC("#f4f7fa", { gloss: 0.8 }), levels = 10, y0 = -3, y1 = 2.5, hw = i => 1.0 - 0.85 * i / levels, yy = i => y0 + (y1 - y0) * i / levels;
    for (let i = 0; i < levels; i++) {
      const m = i % 2 ? white : red, a = hw(i), b = hw(i + 1);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz]) => R.model.add(bar(V(sx * a, yy(i), sz * a), V(sx * b, yy(i + 1), sz * b), 0.045, m)));
      [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]].forEach(([ax, az, bx, bz]) => { R.model.add(bar(V(ax * b, yy(i + 1), az * b), V(bx * b, yy(i + 1), bz * b), 0.03, white)); R.model.add(bar(V(ax * a, yy(i), az * a), V(bx * b, yy(i + 1), bz * b), 0.022, m)); });
    }
    const plat = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.08, 32), MC("#c9d3dc", { gloss: 1 })); plat.position.y = yy(6); R.model.add(plat);
    const dish = new T.Mesh(new T.SphereGeometry(0.42, 28, 16, 0, TAU, 0, PI / 2.2), new T.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.35, metalness: 0.3, side: T.DoubleSide })); dish.rotation.z = -PI / 2.4; dish.position.set(0.65, yy(6) + 0.3, 0); R.model.add(dish);
    R.model.add(bar(V(0, y1, 0), V(0, y1 + 1.3, 0), 0.04, white));
    const beacon = new T.Mesh(new T.SphereGeometry(0.1, 16, 12), new T.MeshBasicMaterial({ color: 0xff2a3d })); beacon.position.y = y1 + 1.35; R.model.add(beacon);
    const rings = [0, 1, 2].map(() => { const m = new T.Mesh(new T.TorusGeometry(1, 0.025, 8, 60), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })); m.rotation.x = PI / 2; m.position.y = y1 + 1.35; R.model.add(m); return m; });
    R.fit(4.0);
    return { sc: R.sc, up: lt => { R.root.rotation.y = lt * 0.5; beacon.material.color.setHex(sin(lt * 6) > 0 ? 0xff2a3d : 0x4a0a12); rings.forEach((r, i) => { const a = (lt * 0.5 + i / 3) % 1; r.scale.setScalar(0.3 + a * 2.2); r.material.opacity = (1 - a) * 0.6; }); } };
  };

  M3.n3_pin = pal => {
    const R = rig(pal), T = R.T;
    const mapT = canvasTex(512, 512, (x, w, h) => { x.fillStyle = "#1a3f86"; x.fillRect(0, 0, w, h); x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 2; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); } x.fillStyle = "rgba(90,200,120,.55)"; for (let i = 0; i < 26; i++) { x.beginPath(); x.ellipse(rnd(i) * w, rnd(i + 3) * h, 20 + rnd(i + 5) * 50, 14 + rnd(i + 7) * 36, rnd(i + 9) * 3, 0, TAU); x.fill(); } x.strokeStyle = "#f2c94c"; x.lineWidth = 6; x.beginPath(); x.moveTo(0, 300); x.bezierCurveTo(150, 220, 300, 380, 512, 250); x.stroke(); });
    const tile = new T.Mesh(new T.BoxGeometry(3.2, 0.14, 3.2), [new T.MeshStandardMaterial({ color: "#16306a" }), new T.MeshStandardMaterial({ color: "#16306a" }), new T.MeshStandardMaterial({ map: mapT.tex, roughness: 0.8 }), new T.MeshStandardMaterial({ color: "#10244f" }), new T.MeshStandardMaterial({ color: "#16306a" }), new T.MeshStandardMaterial({ color: "#16306a" })]); R.model.add(tile);
    const pin = new T.Group(), red = MC("#e6192d", { gloss: 1, hi: "#ff9aa8", dark: "#3a0008" }); const sph = new T.Mesh(new T.SphereGeometry(0.58, 48, 36), red); sph.position.y = 1.35; const cone = new T.Mesh(new T.ConeGeometry(0.52, 1.4, 48), red); cone.rotation.x = PI; cone.position.y = 0.7;
    const dot = new T.Mesh(new T.SphereGeometry(0.22, 24, 16), MC("#ffffff", { gloss: 0.9 })); dot.position.set(0, 1.35, 0.5); pin.add(sph, cone, dot); pin.position.y = 0.07; R.model.add(pin);
    const rings = [0, 1, 2].map(() => { const m = new T.Mesh(new T.TorusGeometry(1, 0.03, 8, 64), new T.MeshBasicMaterial({ color: 0xe6192d, transparent: true, opacity: 0.7 })); m.rotation.x = PI / 2; m.position.y = 0.12; R.model.add(m); return m; });
    const sh = new T.Mesh(new T.CircleGeometry(0.4, 32), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })); sh.rotation.x = -PI / 2; sh.position.y = 0.075; R.model.add(sh);
    R.fit(3.4);
    return { sc: R.sc, up: lt => { const h = 0.3 * Math.abs(sin(lt * 2.5)); pin.position.y = 0.07 + h; sh.scale.setScalar(1 - h * 0.8); rings.forEach((r, i) => { const a = (lt * 0.6 + i / 3) % 1; r.scale.setScalar(0.3 + a * 1.4); r.material.opacity = (1 - a) * 0.7; }); R.root.rotation.y = lt * 0.5; R.root.rotation.x = 0.3; } };
  };

  function phoneScreen(x, w, h, lt) {
    x.clearRect(0, 0, w, h); x.save(); x.beginPath(); const r = 60; x.moveTo(r, 0); x.arcTo(w, 0, w, h, r); x.arcTo(w, h, 0, h, r); x.arcTo(0, h, 0, 0, r); x.arcTo(0, 0, w, 0, r); x.closePath(); x.clip();
    x.fillStyle = "#0b1220"; x.fillRect(0, 0, w, h); x.fillStyle = "#000"; x.beginPath(); x.arc(w / 2, 40, 18, 0, TAU); x.fill(); x.fillStyle = NR; x.fillRect(0, 80, w, 80); x.fillStyle = "#fff"; x.font = "900 44px Arial, sans-serif"; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("НОВОСТИ", 28, 122);
    x.fillStyle = "#4cc9f0"; for (let i = 0; i < 3; i++) { x.globalAlpha = i ? 0.35 : 1; x.fillRect(28 + i * 130, 176, 112, 8); } x.globalAlpha = 1;
    const off = (lt * 90) % 330;
    for (let i = -1; i < 5; i++) { const y = 200 + i * 330 - off; x.fillStyle = "rgba(255,255,255,.08)"; x.fillRect(20, y, w - 40, 310); const g = x.createLinearGradient(0, y, 0, y + 170); g.addColorStop(0, "#2a5ab0"); g.addColorStop(1, "#e6192d"); x.fillStyle = g; x.fillRect(20, y, w - 40, 170); x.fillStyle = "#fff"; x.fillRect(40, y + 190, w - 140, 16); x.fillStyle = "rgba(255,255,255,.55)"; x.fillRect(40, y + 224, w - 100, 10); x.fillRect(40, y + 248, w - 200, 10); x.fillStyle = NR; x.beginPath(); x.arc(52, y + 285, 9, 0, TAU); x.fill(); }
    x.fillStyle = "#0b1220"; x.fillRect(0, h - 90, w, 90); x.fillStyle = "rgba(255,255,255,.6)"; for (let i = 0; i < 4; i++) x.fillRect(60 + i * 110, h - 55, 40, 12);
    x.restore();
  }
  function notifTex(label, col) { return canvasTex(512, 160, (x, w, h) => { x.fillStyle = "rgba(20,28,46,.96)"; const r = 36; x.beginPath(); x.moveTo(r, 4); x.arcTo(w - 4, 4, w - 4, h - 4, r); x.arcTo(w - 4, h - 4, 4, h - 4, r); x.arcTo(4, h - 4, 4, 4, r); x.arcTo(4, 4, w - 4, 4, r); x.closePath(); x.fill(); x.strokeStyle = col; x.lineWidth = 6; x.stroke(); x.fillStyle = col; x.beginPath(); x.arc(70, h / 2, 34, 0, TAU); x.fill(); x.fillStyle = "#fff"; x.font = "900 40px Arial, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("!", 70, h / 2); x.textAlign = "left"; x.font = "900 34px Arial, sans-serif"; x.fillText(label, 130, 58); x.fillStyle = "rgba(255,255,255,.55)"; x.fillRect(130, 100, 260, 12); }); }
  M3.n3_phone = pal => {
    const R = rig(pal), T = R.T, scr = canvasTex(512, 1024, (x, w, h) => phoneScreen(x, w, h, 0));
    const body = new T.Mesh(new T.ExtrudeGeometry(roundedRect(1.9, 3.8, 0.28), { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 5, curveSegments: 12 }), MC("#252a33", { gloss: 0.9, dark: "#050608" })); body.geometry.center(); R.model.add(body);
    const sm = new T.Mesh(new T.PlaneGeometry(1.74, 3.64), new T.MeshBasicMaterial({ map: scr.tex, transparent: true })); sm.position.z = 0.16; R.model.add(sm);
    const cam = new T.Mesh(new T.BoxGeometry(0.8, 0.8, 0.06), MC("#14181f", { gloss: 0.8 })); cam.position.set(-0.45, 1.35, -0.16); R.model.add(cam);
    [[-0.65, 1.55], [-0.65, 1.15], [-0.28, 1.35]].forEach(([x, y]) => { const l = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.06, 28), MC("#0a0d12", { gloss: 1 })); l.rotation.x = PI / 2; l.position.set(x, y, -0.2); R.model.add(l); });
    [[1.0, 0.9, 0.5], [1.0, 0.2, 0.4], [-1.0, 0.7, 0.8]].forEach(([x, y, h]) => { const b = new T.Mesh(new T.BoxGeometry(0.05, h, 0.1), MC("#3a414d", { gloss: 0.8 })); b.position.set(x * 0.97, y, 0); R.model.add(b); });
    const cards = [["СРОЧНО", "#e6192d", 1.55, 1.2, 0.5], ["НОВОЕ", "#4cc9f0", -1.6, 0.1, 0.7], ["LIVE", "#ffd23f", 1.5, -1.3, 0.6]].map(([l, c, x, y, z]) => { const nt = notifTex(l, c), m = new T.Mesh(new T.PlaneGeometry(1.7, 0.53), new T.MeshBasicMaterial({ map: nt.tex, transparent: true })); m.position.set(x, y, z); R.model.add(m); return { m, y }; });
    R.fit(4.0);
    return { sc: R.sc, up: lt => { phoneScreen(scr.x, 512, 1024, lt); scr.tex.needsUpdate = true; R.root.rotation.y = sin(lt * 0.7) * 0.5; R.root.rotation.x = 0.08; cards.forEach((c, i) => { c.m.position.y = c.y + sin(lt * 1.6 + i * 2) * 0.12; c.m.rotation.y = sin(lt + i) * 0.2; }); } };
  };

  M3.n3_megaphone = pal => {
    const R = rig(pal), T = R.T, red = MC("#e6192d", { gloss: 0.95, hi: "#ff9aa8", dark: "#3a0008" }, { side: T.DoubleSide }), white = MC("#f4f7fa", { gloss: 0.9 }, { side: T.DoubleSide }), dark = MC("#1b2029", { gloss: 0.5 }), chrome = MC("#d5dde6", { gloss: 1, dark: "#222c36" });
    const horn = new T.Group(), prof = [[0.28, 0], [0.34, 0.3], [0.5, 0.9], [0.62, 1.2], [0.75, 1.5], [0.95, 1.9]];
    horn.add(new T.Mesh(lathe(prof.slice(0, 4), 56), red)); horn.add(new T.Mesh(lathe(prof.slice(3), 56), white));
    const rim = new T.Mesh(new T.TorusGeometry(0.95, 0.05, 12, 56), chrome); rim.rotation.x = PI / 2; rim.position.y = 1.9; horn.add(rim);
    const cup = new T.Mesh(new T.CylinderGeometry(0.34, 0.3, 0.5, 40), dark); cup.position.y = -0.25; horn.add(cup); const cap = new T.Mesh(new T.SphereGeometry(0.34, 32, 20, 0, TAU, PI / 2, PI / 2), dark); cap.position.y = -0.5; horn.add(cap);
    horn.rotation.z = -PI / 2; horn.position.x = -1; R.model.add(horn);
    const grip = new T.Mesh(new T.CylinderGeometry(0.11, 0.1, 0.95, 24), dark); grip.position.set(-0.55, -0.6, 0); grip.rotation.z = 0.2; R.model.add(grip);
    for (let i = 0; i < 4; i++) { const t = new T.Mesh(new T.TorusGeometry(0.105, 0.015, 8, 24), chrome); t.rotation.x = PI / 2; t.position.set(-0.55 - 0.02 * i + 0.0, -0.4 - i * 0.2, 0); t.rotation.z = 0.2; R.model.add(t); }
    const trig = new T.Mesh(new T.BoxGeometry(0.1, 0.3, 0.12), chrome); trig.position.set(-0.45, -0.05, 0); R.model.add(trig);
    const waves = [0, 1, 2].map(() => { const m = new T.Mesh(new T.TorusGeometry(0.8, 0.035, 8, 36, PI * 0.7), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })); m.rotation.set(0, PI / 2, -PI * 0.35); m.position.x = 1.5; R.model.add(m); return m; });
    R.fit(3.7);
    return { sc: R.sc, up: lt => { R.root.rotation.y = -0.6 + sin(lt * 0.7) * 0.4; R.root.rotation.x = 0.1; waves.forEach((w, i) => { const a = (lt * 0.8 + i / 3) % 1; w.position.x = 1.5 + a * 1.4; w.scale.setScalar(0.5 + a * 0.9); w.material.opacity = (1 - a) * 0.7; }); } };
  };

  M3.n3_notebook = pal => {
    const R = rig(pal), T = R.T, pageTex = canvasTex(512, 640, (x, w, h) => { x.fillStyle = "#fbfaf4"; x.fillRect(0, 0, w, h); x.strokeStyle = "rgba(60,110,200,.35)"; x.lineWidth = 2; for (let i = 0; i < 20; i++) { x.beginPath(); x.moveTo(0, 100 + i * 26); x.lineTo(w, 100 + i * 26); x.stroke(); } x.strokeStyle = "rgba(230,25,45,.5)"; x.beginPath(); x.moveTo(66, 0); x.lineTo(66, h); x.stroke(); x.fillStyle = "#1c2a55"; x.font = "italic 700 44px " + SERIF; x.textAlign = "left"; x.fillText("ЭКСКЛЮЗИВ!", 90, 76); x.font = "italic 400 30px " + SERIF; ["Источник: подтверждён", "Дедлайн: 18:00", "Звонок редактору", "Проверить факты"].forEach((s, i) => x.fillText(s, 90, 138 + i * 52)); x.strokeStyle = "#e6192d"; x.lineWidth = 5; x.beginPath(); x.moveTo(90, 86); x.lineTo(380, 86); x.stroke(); });
    const cover = new T.Mesh(new T.BoxGeometry(2.4, 3.2, 0.1), MC("#ffd23f", { gloss: 0.7, dark: "#3a2a00" })); cover.position.z = -0.17; R.model.add(cover);
    const side = new T.MeshStandardMaterial({ color: "#f3f0e4", roughness: 0.95 }), pages = new T.Mesh(new T.BoxGeometry(2.3, 3.1, 0.24), [side, side, side, side, new T.MeshStandardMaterial({ map: pageTex.tex, roughness: 0.9 }), side]); R.model.add(pages);
    for (let i = 0; i < 12; i++) { const r = new T.Mesh(new T.TorusGeometry(0.13, 0.026, 10, 28), MC("#c9d3dc", { gloss: 1, dark: "#222c36" })); r.position.set(-1.0 + i * 0.18, 1.58, 0.05); r.rotation.y = PI / 2; R.model.add(r); const hole = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.02, 12), new T.MeshBasicMaterial({ color: 0x222222 })); hole.rotation.x = PI / 2; hole.position.set(-1.0 + i * 0.18, 1.4, 0.125); R.model.add(hole); }
    const pen = new T.Group(), pb = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 2.0, 24), MC("#1c2a7a", { gloss: 1, dark: "#000010" })); const tip = new T.Mesh(new T.ConeGeometry(0.07, 0.35, 24), MC("#d5dde6", { gloss: 1 })); tip.position.y = -1.17; tip.rotation.x = PI;
    const nib = new T.Mesh(new T.ConeGeometry(0.018, 0.1, 12), MC("#222", { gloss: 0.5 })); nib.position.y = -1.4; nib.rotation.x = PI; const band = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 0.08, 24), MC("#e6192d", { gloss: 0.9 })); band.position.y = 0.6; const clip = new T.Mesh(new T.BoxGeometry(0.03, 0.7, 0.04), MC("#d5dde6", { gloss: 1 })); clip.position.set(0.09, 0.7, 0);
    pen.add(pb, tip, nib, band, clip); pen.rotation.set(0.3, 0.3, 1.0); pen.position.set(0.5, -0.2, 0.55); R.model.add(pen);
    R.fit(3.7);
    return { sc: R.sc, up: lt => { R.root.rotation.y = sin(lt * 0.7) * 0.6; R.root.rotation.x = 0.3 + sin(lt * 0.5) * 0.08; pen.position.y = -0.2 + sin(lt * 1.6) * 0.05; } };
  };

  /* ==========================================================
     РЕГИСТРАЦИЯ
     ========================================================== */
  const bgFns = { n_ticker: bgTicker, n_globe: bgGlobe, n_paper: bgPaper, n_studio: bgStudio, n_stream: bgStream, n_signal: bgSignal, n_map: bgMap, n_tv: bgTv, n_social: bgSocial, n_market: bgMarket };
  const shapeFns = { ns_breaking: aBreaking, ns_globe: aGlobe, ns_paper: aPaper, ns_mic: aMic, ns_camera: aCamera, ns_antenna: aAntenna, ns_feed: aFeed, ns_clock: aClock, ns_pin: aPin, ns_stocks: aStocks };
  const names = {
    n_ticker: "Бегущая строка", n_globe: "Глобус новостей", n_paper: "Газетная полоса", n_studio: "Телестудия", n_stream: "Лента новостей", n_signal: "Эфир и сигнал", n_map: "Карта событий", n_tv: "Помехи ТВ", n_social: "Соцсети", n_market: "Биржа и котировки",
    ns_breaking: "Плашка «Срочно»", ns_globe: "Вращающийся глобус", ns_paper: "Газета", ns_mic: "Микрофон репортёра", ns_camera: "Телекамера", ns_antenna: "Вышка вещания", ns_feed: "Лента соцсети", ns_clock: "Часы 24/7", ns_pin: "Метка на карте", ns_stocks: "Рост котировок",
    n3_newspaper: "Газеты 3D", n3_mic: "Микрофон репортёра 3D", n3_camera: "Телекамера 3D", n3_globe: "Глобус 3D", n3_tv: "Телевизор 3D", n3_tower: "Вышка вещания 3D", n3_pin: "Метка на карте 3D", n3_phone: "Смартфон с лентой 3D", n3_megaphone: "Рупор 3D", n3_notebook: "Блокнот репортёра 3D"
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

  const DOMAIN = "Новости";
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
    addCard({ id, cat: "Фон", name: "Новости: " + names[id], tags: "новости медиа сми фон " + names[id], mk: () => ({ dur: 6, bg: id, layers: [] }),
      act: scene({ dur: 4, bg: id, trans: "fade", sfx: [{ at: 0, id: "whoosh" }], layers: [{ type: "text", fx: "words", text: "Главное *за день*", y: 0.5, size: 0.09 }] }) });
  });
  Object.keys(NEWS_ICONS).forEach(id => {
    ICO[id] = NEWS_ICONS[id][1]; ICN.push([id, NEWS_ICONS[id][0]]);
    addCard({ id: "ico_" + id, cat: "Иконка", name: "Новости: " + NEWS_ICONS[id][0], tags: "новости медиа иконка " + id + " " + NEWS_ICONS[id][0], mk: () => ({ dur: 3, bg: "dotgrid", layers: [{ type: "icon", name: id, y: 0.5, size: 0.4 }] }),
      act: scene({ dur: 3.5, bg: "dotgrid", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "icon", name: id, y: 0.45, size: 0.4 }] }) });
  });
  Object.keys(shapeFns).forEach(id => {
    SHP.push(id); N[id] = names[id];
    addCard({ id: "shape_" + id, cat: "Анимация", name: "Новости: " + names[id], tags: "новости медиа анимация " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "shape", shape: id, x: 0.5, y: 0.5, size: 0.48 }] }),
      act: scene({ dur: 4.5, bg: "gradient", trans: "circle", sfx: [{ at: 0, id: "pop" }], layers: [{ type: "shape", shape: id, x: 0.5, y: 0.42, size: 0.8 }] }) });
  });
  Object.keys(M3).forEach(id => {
    TH3.push(id); N[id] = names[id];
    addCard({ id: "3d_" + id, cat: "3D", name: "Новости: " + names[id], tags: "новости медиа 3d три д " + names[id], mk: () => ({ dur: 6, bg: "gradient", layers: [{ type: "three", model: id, x: 0.5, y: 0.5, size: 0.52 }] }),
      act: scene({ dur: 5, bg: "gradient", trans: "circle", sfx: [{ at: 0.1, id: "whoosh" }], layers: [{ type: "three", model: id, x: 0.5, y: 0.42, size: 0.85 }] }) });
  });
  try { if (typeof filt === "function") filt(); } catch (e) {}
  try { const sel = document.getElementById("catfilter"); if (sel && !Array.from(sel.options).some(o => o.value === DOMAIN)) { const o = document.createElement("option"); o.value = DOMAIN; o.textContent = DOMAIN; sel.appendChild(o); } } catch (e) {}

  const HINT = "ПАК НОВОСТИ (используй для новостей, СМИ, журналистики, соцсетей, экономики, эфира): фоны n_ticker (бегущая строка, срочное), n_globe (мировые события), n_paper (газета), n_studio (телестудия), n_stream (лента), n_signal (эфир, вещание), n_map (карта событий), n_tv (помехи, архив, сенсация), n_social (соцсети), n_market (биржа, экономика). Анимации shape: ns_breaking (плашка СРОЧНО), ns_globe, ns_paper, ns_mic, ns_camera, ns_antenna, ns_feed, ns_clock, ns_pin, ns_stocks. Иконки icon: newspaper, mic, video, radiotower, rss, tv, alert, article, share, search. 3D three.model: n3_newspaper, n3_mic, n3_camera, n3_globe, n3_tv, n3_tower, n3_pin, n3_phone, n3_megaphone, n3_notebook.";
  if (!window.__hintPatch) {
    window.__hintPatch = []; const _f = window.fetch;
    window.fetch = function (u, o) { try { if (o && typeof o.body === "string" && /\/director$/.test(String(u))) { const b = JSON.parse(o.body); b.hint = window.__hintPatch.join("\n") + "\n" + (b.hint || ""); o.body = JSON.stringify(b); } } catch (e) {} return _f.apply(this, arguments); };
  }
  window.__hintPatch.push(HINT);
})();