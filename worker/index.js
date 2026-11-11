const AI_SYSTEM = "You are a scriptwriter for teleprompter videos and talks. Write words meant to be spoken aloud: short sentences, a natural rhythm and short paragraphs separated by blank lines. You may start sections with '## ' headings and add [pause] where a pause helps the delivery. Output only the script itself: no title line, no explanations, no other markdown.";
const CJK_LANGUAGES = new Set(['Simplified Chinese', 'Traditional Chinese', 'Japanese']);
const ALLOWED_TONES = new Set(['friendly', 'professional', 'energetic', 'calm']);
const ALLOWED_LANGUAGES = new Set(['English', 'Simplified Chinese', 'Traditional Chinese', 'Spanish', 'Portuguese', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Russian', 'Arabic', 'Hindi', 'Indonesian', 'Vietnamese', 'Thai', 'Turkish', 'Dutch', 'Polish']);
const CANONICAL_ORIGIN = 'https://cueprompt.io';
const LEGACY_PATH_REDIRECTS = new Map([
  ['/ja/record-video/', '/ja/teleprompter-with-camera/'],
  ['/ja/teleprompter/', '/ja/']
]);

export function canonicalRedirect(requestUrl) {
  const url = new URL(requestUrl);
  const productionHost = url.hostname === 'cueprompt.io' || url.hostname === 'www.cueprompt.io' || url.hostname.endsWith('.workers.dev');
  if (!productionHost) return null;
  const canonicalPath = LEGACY_PATH_REDIRECTS.get(url.pathname) || url.pathname;
  if (url.protocol === 'https:' && url.hostname === 'cueprompt.io' && canonicalPath === url.pathname) return null;
  return new URL(`${canonicalPath}${url.search}`, CANONICAL_ORIGIN).href;
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function cleanString(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function buildMessages(body) {
  const mode = body?.mode;
  if (!['generate', 'rewrite', 'translate'].includes(mode)) throw new Error('INVALID_MODE');

  if (mode === 'generate') {
    const topic = cleanString(body.topic, 2000);
    if (!topic) throw new Error('TOPIC_REQUIRED');
    const minutes = Math.min(20, Math.max(0.5, Number(body.durationMinutes) || 1));
    const language = ALLOWED_LANGUAGES.has(body.language) ? body.language : 'English';
    const tone = ALLOWED_TONES.has(body.tone) ? body.tone : 'friendly';
    const size = CJK_LANGUAGES.has(language) ? `${Math.round(minutes * 250)} characters` : `${Math.round(minutes * 150)} words`;
    return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Write a ${tone} teleprompter script in ${language} about:\n${topic}\n\nTarget length: about ${minutes} minute(s) when spoken, roughly ${size}.` }];
  }

  const script = cleanString(body.script, 12000);
  if (!script) throw new Error('SCRIPT_REQUIRED');
  if (mode === 'rewrite') {
    const instructions = {
      shorter: 'Make it about 30% shorter while keeping the key message.',
      conversational: 'Make it sound more natural and conversational, as if talking to one person.',
      clearer: 'Make it clearer and easier to follow, with simpler sentences.'
    };
    const instruction = instructions[body.rewriteMode] || cleanString(body.instruction, 500) || 'Improve it.';
    return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Rewrite the following teleprompter script. ${instruction} Keep the same language. Keep '## ' headings and [pause]/[slow] markers where they still make sense.\n\nSCRIPT:\n${script}` }];
  }

  const target = ALLOWED_LANGUAGES.has(body.target) ? body.target : 'English';
  return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Translate the following teleprompter script into ${target}. Make it sound natural when spoken. Keep '## ' headings and keep [pause]/[slow] markers in place with the bracket keywords in English.\n\nSCRIPT:\n${script}` }];
}

function errorCode(error) {
  return ['INVALID_MODE', 'TOPIC_REQUIRED', 'SCRIPT_REQUIRED'].includes(error?.message) ? error.message : 'INVALID_REQUEST';
}

async function generate(request, env) {
  if (request.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED' } }, 405, { Allow: 'POST' });
  if (!env.DEEPSEEK_API_KEY) return json({ error: { code: 'AI_NOT_CONFIGURED', retryable: false } }, 503);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 25000) return json({ error: { code: 'INPUT_TOO_LONG', retryable: false } }, 413);

  const deviceId = cleanString(request.headers.get('x-cueprompt-device'), 100);
  if (!/^[a-zA-Z0-9_-]{12,100}$/.test(deviceId)) return json({ error: { code: 'DEVICE_ID_REQUIRED', retryable: false } }, 400);

  const [deviceLimit, globalLimit] = await Promise.all([
    env.AI_DEVICE_LIMITER.limit({ key: deviceId }),
    env.AI_GLOBAL_LIMITER.limit({ key: 'hosted-ai' })
  ]);
  if (!deviceLimit.success || !globalLimit.success) return json({ error: { code: 'RATE_LIMITED', retryable: true } }, 429, { 'Retry-After': '60' });

  let body;
  try { body = await request.json(); }
  catch { return json({ error: { code: 'INVALID_JSON', retryable: false } }, 400); }

  let messages;
  try { messages = buildMessages(body); }
  catch (error) { return json({ error: { code: errorCode(error), retryable: false } }, 400); }

  let upstream;
  try {
    upstream = await fetch(`${String(env.DEEPSEEK_BASE_URL).replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: env.DEEPSEEK_MODEL || 'deepseek-flash', messages, temperature: 0.7, max_tokens: 2400, thinking: { type: 'disabled' } }),
      signal: AbortSignal.timeout(45000)
    });
  } catch {
    return json({ error: { code: 'PROVIDER_UNAVAILABLE', retryable: true } }, 502);
  }

  let data = null;
  try { data = await upstream.json(); } catch { /* Upstream may return an HTML error page. */ }
  if (!upstream.ok) {
    console.error('DeepSeek request failed', { status: upstream.status, code: data?.code || data?.error?.code });
    const code = upstream.status === 401 ? 'AI_AUTH_FAILED' : upstream.status === 429 ? 'RATE_LIMITED' : upstream.status >= 500 ? 'PROVIDER_UNAVAILABLE' : 'PROVIDER_ERROR';
    return json({ error: { code, retryable: upstream.status === 429 || upstream.status >= 500 } }, upstream.status === 429 ? 429 : 502);
  }

  const text = cleanString(data?.choices?.[0]?.message?.content, 30000).replace(/^```[a-z]*\n?|```\s*$/g, '').trim();
  if (!text) return json({ error: { code: 'EMPTY_RESPONSE', retryable: true } }, 502);
  return json({ text, model: env.DEEPSEEK_MODEL || 'deepseek-flash' });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirect = canonicalRedirect(url);
    if (redirect) return Response.redirect(redirect, 301);
    if (url.pathname === '/api/ai/generate') return generate(request, env);
    if (url.pathname.startsWith('/api/')) return json({ error: { code: 'NOT_FOUND' } }, 404);
    return env.ASSETS.fetch(request);
  }
};
