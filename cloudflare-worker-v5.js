// ============================================================
// MOTION STUDIO DIRECTOR v5
// Cloudflare Worker + Gemini Director/Edit + Gemini 3.8 Flash TTS
// Routes: GET /health, POST /director, POST /edit, POST /tts
// Required secret: GEMINI_API_KEY
// Optional vars: ALLOWED_ORIGIN, GEMINI_MODEL, STALL_MS, TOTAL_MS, REQUEST_BUDGET_MS
// ============================================================

const FAST_MODEL = "gemini-flash-lite-latest";
const SMART_MODEL = "gemini-flash-latest";
const TTS_MODEL = "gemini-3.8-flash-tts";
const STALL_MS = 30000;
const TOTAL_MS = 65000;
const REQUEST_BUDGET_MS = 145000;
const MAX_BRIEF = 1500;
const MAX_SCENES = 16;
const MAX_OUTPUT_TOKENS = 8000;
const MAX_TTS_CHARS = 9000;
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "GET" && path === "/health") {
      return json({ ok: true, service: "MOTION STUDIO DIRECTOR", version: "5.0", mode: "json+tts", models: modelList(env), ttsModel: TTS_MODEL, timestamp: new Date().toISOString() }, 200, cors);
    }

    if (request.method !== "POST" || !["/director", "/edit", "/tts"].includes(path)) {
      return json({ ok: false, error: "Not found" }, 404, cors);
    }

    if (!env.GEMINI_API_KEY) return json({ ok: false, error: "GEMINI_API_KEY is not configured" }, 500, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ ok: false, error: "Invalid JSON request" }, 400, cors); }

    if (path === "/tts") {
      try {
        const wav = await generateTTS(body, env);
        return new Response(wav, {
          status: 200,
          headers: {
            ...cors,
            "Content-Type": "audio/wav",
            "Content-Length": String(wav.byteLength),
            "Cache-Control": "no-store",
            "X-Motion-Studio-TTS-Model": TTS_MODEL
          }
        });
      } catch (error) {
        console.error("MOTION STUDIO TTS ERROR:", error);
        return json({ ok: false, error: error?.message || "TTS generation failed", code: error?.code || "TTS_ERROR" }, 502, cors);
      }
    }

    try {
      const result = path === "/director"
        ? await prepareDirector(body, env)
        : await prepareEdit(body, env);

      if (!result || !result.scenario) throw new Error("Не удалось создать сценарий");
      return json({ ok: true, scenario: result.scenario, plan: result.plan || null }, 200, cors);
    } catch (error) {
      console.error("MOTION STUDIO ERROR:", error);
      return json({ ok: false, error: error?.message || "Generation failed", code: error?.code || "GENERATION_ERROR" }, 502, cors);
    }
  }
};

// ============================================================
// RESPONSE + HELPERS
// ============================================================

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers }
  });
}

function modelList(env) {
  return [...new Set([env.GEMINI_MODEL, FAST_MODEL, SMART_MODEL].filter(Boolean))];
}

function safeString(value, max = 5000) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, max);
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function parseJSON(text) {
  if (!text) throw new Error("Gemini вернул пустой ответ");
  const value = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(value); } catch {}
  const first = value.indexOf("{"), last = value.lastIndexOf("}");
  if (first !== -1 && last > first) {
    try { return JSON.parse(value.slice(first, last + 1)); } catch {}
  }
  throw new Error("Gemini вернул некорректный JSON: " + value.slice(0, 300));
}

// ============================================================
// GEMINI TTS
// Gemini 3.8 Flash TTS unary GenerateContent returns a complete WAV.
// ============================================================

async function generateTTS(body, env) {
  const text = safeString(body.text || body.transcript, MAX_TTS_CHARS);
  if (!text) throw new Error("Не передан текст для озвучки");
  if (text.length > MAX_TTS_CHARS) throw new Error("Текст слишком длинный для одной генерации озвучки");

  const requestedVoice = safeString(body.voice || "Fenrir", 40);
  const allowedVoices = new Set([
    "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede",
    "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba",
    "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar",
    "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi",
    "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat"
  ]);
  const voice = allowedVoices.has(requestedVoice) ? requestedVoice : "Fenrir";
  const style = safeString(body.style || "Speak naturally in Russian with clear diction, lively pacing and expressive emphasis.", 700);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(Number(env.TTS_TIMEOUT_MS) || 110000, 120000));
  let response;
  try {
    response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: TTS_MODEL,
        input: [{
          type: "user_input",
          content: [{
            type: "text",
            text,
            annotations: [{
              type: "speech_metadata",
              style
            }]
          }]
        }],
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [{ voice }]
        }
      })
    });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Gemini TTS: превышено время ожидания");
    throw new Error("Не удалось подключиться к Gemini TTS: " + (error?.message || "network error"));
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error("Gemini TTS API " + response.status + ": " + message.slice(0, 1200));
  }

  const data = await response.json();

  // В REST API аудио находится в steps[].content[].
  // output_audio — удобное поле SDK, но REST его не добавляет.
  const stepAudio = (Array.isArray(data?.steps) ? data.steps : [])
    .filter(step => step?.type === "model_output")
    .flatMap(step => Array.isArray(step.content) ? step.content : [])
    .filter(item => item?.type === "audio" && typeof item.data === "string" && item.data.length > 0)
    .pop();
  const audioBase64 = data?.output_audio?.data || stepAudio?.data;

  if (!audioBase64) {
    const outputTypes = (Array.isArray(data?.steps) ? data.steps : [])
      .filter(step => step?.type === "model_output")
      .flatMap(step => Array.isArray(step.content) ? step.content : [])
      .map(item => item?.type || "unknown");
    const reason = data?.error?.message || data?.status || "NO_AUDIO";
    throw new Error("Gemini TTS: аудио не найдено (status=" + reason +
      ", output=" + (outputTypes.join(",") || "пусто") + ")");
  }

  const binary = atob(audioBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  if (bytes.length < 44 ||
      String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" ||
      String.fromCharCode(...bytes.slice(8, 12)) !== "WAVE") {
    throw new Error("Gemini вернул повреждённый WAV-файл");
  }
  return bytes;
}

// ============================================================
// GEMINI STREAM (DIRECTOR / EDIT)
// ============================================================

async function geminiStream(model, prompt, env, timeoutMs) {
  const controller = new AbortController();
  let totalTimer, stallTimer, timedOut = false, timeoutReason = "";
  const stallLimit = Math.min(Number(env.STALL_MS) || STALL_MS, timeoutMs);

  function abort(reason) {
    if (timedOut) return;
    timedOut = true;
    timeoutReason = reason;
    controller.abort();
  }
  function resetStall() {
    clearTimeout(stallTimer);
    stallTimer = setTimeout(() => abort("Gemini не отвечает: превышено время ожидания"), stallLimit);
  }

  totalTimer = setTimeout(() => abort("Gemini превысил общий лимит времени"), timeoutMs);
  resetStall();

  const requestBody = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: MAX_OUTPUT_TOKENS }
  };
  const endpoint = GEMINI_API + encodeURIComponent(model) + ":streamGenerateContent?alt=sse&key=" + encodeURIComponent(env.GEMINI_API_KEY);

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
  } catch (error) {
    clearTimeout(totalTimer); clearTimeout(stallTimer);
    if (timedOut) throw new Error(timeoutReason);
    throw new Error("Ошибка подключения к Gemini: " + (error?.message || "network error"));
  }

  if (!response.ok) {
    const message = await response.text();
    clearTimeout(totalTimer); clearTimeout(stallTimer);
    throw new Error("Gemini API " + response.status + ": " + message.slice(0, 1000));
  }
  if (!response.body) {
    clearTimeout(totalTimer); clearTimeout(stallTimer);
    throw new Error("Gemini вернул пустой поток");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", output = "";

  function processEvent(raw) {
    raw = raw.trim();
    if (!raw || raw === "[DONE]") return;
    let event;
    try { event = JSON.parse(raw); } catch { return; }
    const candidate = event?.candidates?.[0];
    for (const part of candidate?.content?.parts || []) {
      if (typeof part.text === "string") output += part.text;
    }
    const reason = candidate?.finishReason;
    if (reason === "SAFETY" || reason === "RECITATION") throw new Error("Gemini остановил генерацию: " + reason);
  }

  try {
    while (true) {
      if (timedOut) throw new Error(timeoutReason);
      const { value, done } = await reader.read();
      if (timedOut) throw new Error(timeoutReason);
      if (done) break;
      resetStall();
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";
      for (const eventText of events) {
        const lines = eventText.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trim());
        if (lines.length) processEvent(lines.join("\n"));
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) {
      const lines = buffer.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trim());
      if (lines.length) processEvent(lines.join("\n"));
    }
    if (timedOut) throw new Error(timeoutReason);
    if (!output.trim()) throw new Error("Gemini вернул пустой текст");
    return output;
  } catch (error) {
    try { await reader.cancel(); } catch {}
    if (timedOut) throw new Error(timeoutReason);
    throw error;
  } finally {
    clearTimeout(totalTimer); clearTimeout(stallTimer);
    try { reader.releaseLock(); } catch {}
  }
}

// ============================================================
// FALLBACK
// ============================================================

async function runWithFallback(prompt, env) {
  const models = modelList(env);
  const started = Date.now();
  const budget = Number(env.REQUEST_BUDGET_MS) || REQUEST_BUDGET_MS;
  const errors = [];

  for (const model of models) {
    const remaining = budget - (Date.now() - started);
    if (remaining < 10000) break;
    const timeout = Math.min(Number(env.TOTAL_MS) || TOTAL_MS, remaining - 2000);
    try {
      console.log("Gemini attempt:", model, "timeout:", timeout);
      return await geminiStream(model, prompt, env, timeout);
    } catch (error) {
      const message = error?.message || "Unknown error";
      console.error("Gemini model failed:", model, message);
      errors.push(model + ": " + message);
    }
  }
  const error = new Error("Все модели Gemini не смогли ответить. " + errors.join(" | "));
  error.code = "ALL_MODELS_FAILED";
  throw error;
}

// ============================================================
// SCENARIO VALIDATION
// ============================================================

function normalizeScenario(source) {
  if (!source || typeof source !== "object") throw new Error("Некорректный сценарий");
  if (!Array.isArray(source.scenes)) throw new Error("В сценарии отсутствует массив scenes");

  const scenes = source.scenes.slice(0, MAX_SCENES).map(scene => {
    if (!scene || typeof scene !== "object") scene = {};
    let layers = Array.isArray(scene.layers) ? scene.layers.slice(0, 6) : [];
    layers = layers.map(layer => {
      if (!layer || typeof layer !== "object") return { type: "text", text: "", y: 0.5, size: 0.08 };
      return {
        ...layer,
        type: safeString(layer.type || "text", 30),
        text: safeString(layer.text, 120),
        x: clamp(layer.x ?? 0.5, 0.05, 0.95),
        y: clamp(layer.y ?? 0.5, 0.08, 0.92),
        size: clamp(layer.size ?? 0.085, 0.03, 0.45),
        at: clamp(layer.at ?? 0, 0, 10)
      };
    });
    const sfx = (Array.isArray(scene.sfx) ? scene.sfx.slice(0, 6) : []).map(sound => ({
      id: safeString(sound?.id, 40),
      at: clamp(sound?.at ?? 0, 0, 10)
    }));
    return {
      dur: clamp(scene.dur ?? 4, 1.2, 15),
      bg: safeString(scene.bg || "gradient", 40),
      trans: safeString(scene.trans || "fade", 40),
      sfx, layers
    };
  });

  if (!scenes.length) throw new Error("Сценарий не содержит сцен");
  return {
    title: safeString(source.title || "Motion Studio Project", 200),
    music: safeString(source.music || "energetic", 40),
    scenes
  };
}

// ============================================================
// DIRECTOR
// ============================================================

async function prepareDirector(body, env) {
  const brief = safeString(body.brief || body.prompt || body.description || body.text, MAX_BRIEF);
  if (!brief) throw new Error("Не указано описание ролика");
  const duration = clamp(body.dur || 30, 15, 60);
  const sceneCount = duration <= 15 ? 5 : duration <= 30 ? 8 : 14;
  const style = safeString(body.style || "neon", 100);
  const format = safeString(body.format || "9:16", 20);
  const tone = safeString(body.tone || "auto", 50);
  const arc = safeString(body.arc || "auto", 50);
  const catalog = body.catalog || {};

  const prompt = `
${getSystemPrompt(catalog)}

СОЗДАЙ ПОЛНОЦЕННЫЙ СЦЕНАРИЙ ВИДЕО.
БРИФ:
${brief}

ПАРАМЕТРЫ:
Длительность: ${duration} секунд.
Количество сцен: примерно ${sceneCount}.
Формат: ${format}.
Стиль: ${style}.
Тон: ${tone}.
Структура: ${arc}.

${body.ad ? `
РЕКЛАМИРУЕМЫЙ ПРОДУКТ:
Название: ${safeString(body.ad.name, 100)}
Описание: ${safeString(body.ad.pitch, 300)}
Пометка рекламы: ${body.ad.label ? "да" : "нет"}
Включи продукт в финальную сцену.
` : ""}

${safeString(body.hint, 4000)}

ВАЖНО:
- Не копируй бриф дословно.
- Придумай оригинальную рекламную концепцию.
- Пиши на русском языке.
- Используй короткие выразительные фразы.
- Создай примерно ${sceneCount} сцен.
- Суммарная длительность должна быть близка к ${duration} секундам.
- Используй разнообразные фоны, переходы и анимации.
- В каждой сцене должно быть 1-3 визуальных слоя.
- Не выдумывай реальные гарантии и статистику о продукте.
- Для неподтверждённых цифр используй метафоры или явно условные значения.

ВЕРНИ ТОЛЬКО JSON:
{
  "title": "Название ролика",
  "music": "energetic",
  "scenes": [{
    "dur": 4, "bg": "gradient", "trans": "fade",
    "sfx": [{"at": 0, "id": "whoosh"}],
    "layers": [
      {"type":"text","fx":"zoomin","text":"Цепляющая фраза","y":0.5,"x":0.5,"size":0.09,"hl":true,"at":0},
      {"type":"char","who":"robot","state":"jump","x":0.5,"y":0.85,"size":0.3}
    ]
  }]
}

ДОПУСТИМЫЕ ТИПЫ СЛОЁВ: text, counter, chart, shape, icon, char, mega, three.
Для chart используй kind и values. Для counter используй to и suffix.
Для icon используй name. Для char используй who и state.
Для three используй model. Для mega используй text и dir.
Координаты x и y от 0 до 1, size от 0.03 до 0.45.
Для каждой сцены обязательно: dur, bg, trans, sfx, layers.
Поле music: energetic, calm, epic, tech, chill, game.
Верни валидный JSON. Никаких пояснений до или после JSON.
`;

  const raw = await runWithFallback(prompt, env);
  const parsed = parseJSON(raw);
  return { scenario: normalizeScenario(parsed), plan: parsed.plan || null };
}

// ============================================================
// EDIT
// ============================================================

async function prepareEdit(body, env) {
  const instruction = safeString(body.instruction || body.prompt || body.brief || body.text, MAX_BRIEF);
  if (!instruction) throw new Error("Не указана инструкция для редактирования");
  const source = body.scenario || body.project || body.data || {};
  const sourceText = JSON.stringify(source);
  if (sourceText.length > 25000) throw new Error("Проект слишком большой для редактирования");
  const catalog = body.catalog || {};

  const prompt = `
${getSystemPrompt(catalog)}

ТЫ РЕДАКТИРУЕШЬ УЖЕ СУЩЕСТВУЮЩИЙ ПРОЕКТ MOTION STUDIO.
ИНСТРУКЦИЯ ПОЛЬЗОВАТЕЛЯ:
${instruction}

ИСХОДНЫЙ ПРОЕКТ:
${sourceText}

ТРЕБОВАНИЯ:
1. Выполни именно указанную правку.
2. Сохрани исходную идею и структуру.
3. Не удаляй сцены без необходимости.
4. Сохрани все слои, которые не требуют изменений.
5. Сохрани музыку, фон, переходы и звуковые эффекты.
6. Не заменяй весь проект случайным новым сценарием.
7. Верни полный обновлённый проект.
8. Не добавляй пояснений.
9. Используй только совместимые с Motion Studio типы слоёв.

Верни JSON:
{
  "title": "Название",
  "music": "energetic",
  "scenes": [{
    "dur": 4, "bg": "gradient", "trans": "fade", "sfx": [],
    "layers": [{"type":"text","fx":"pop","text":"Текст","x":0.5,"y":0.5,"size":0.085,"at":0}]
  }]
}
Каждая сцена: dur, bg, trans, sfx, layers. Верни только JSON.
`;

  const raw = await runWithFallback(prompt, env);
  const parsed = parseJSON(raw);
  return { scenario: normalizeScenario(parsed), plan: parsed.plan || null };
}

// ============================================================
// SYSTEM PROMPT
// ============================================================

function getSystemPrompt(catalog) {
  const bg = list(catalog.bg), fx = list(catalog.fx), tr = list(catalog.tr);
  const ch = list(catalog.ch), shp = list(catalog.shp), ico = list(catalog.ico);
  const who = list(catalog.who), models = list(catalog.models);
  const sfx = list(catalog.sfx), music = list(catalog.music);

  return `
Ты — профессиональный креативный директор и сценарист Motion Studio.
Твоя задача — создавать качественные сценарии рекламных и презентационных видеороликов.

СТРОГО ИСПОЛЬЗУЙ ДОПУСТИМЫЕ ЗНАЧЕНИЯ ИЗ БИБЛИОТЕКИ:
Фоны: ${bg}
Текстовые эффекты: ${fx}
Переходы: ${tr}
Типы графиков: ${ch}
Фигуры: ${shp}
Иконки: ${ico}
Персонажи: ${who}
3D-модели: ${models}
Звуки: ${sfx}
Музыка: ${music}

Не придумывай идентификаторы, которых нет в библиотеке.
ПРАВИЛА СЦЕНАРИЯ:
- Первая сцена должна цеплять внимание.
- Вторая должна показывать проблему или потребность.
- Затем покажи решение.
- Добавь 3-5 преимуществ.
- Добавь визуальную демонстрацию результата.
- Финал должен содержать призыв к действию.
- Чередуй фоны, переходы и текстовые эффекты.
- Используй маскотов и 3D-объекты уместно.
- Не перегружай сцены текстом.
- Для текстовых слоёв выделяй важные слова звёздочками.
- Не используй эмодзи вместо иконок.
- Не повторяй один и тот же визуальный приём подряд.
СОВМЕСТИМОСТЬ:
Каждая сцена: dur, bg, trans, sfx, layers.
Каждый слой: type. Координаты — числа от 0 до 1, размеры — от 0.03 до 0.45.
Ответ — только валидный JSON.
`;
}

function list(value) {
  if (!Array.isArray(value)) return "Используй разумные значения из библиотеки";
  return value.slice(0, 100).join(", ");
}
