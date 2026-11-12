import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { AI_LANGUAGES, buildMessages, canonicalRedirect, dominantWritingSystem, outputLanguageMatches } from '../worker/index.js';

test('redirects every production URL variant to the HTTPS apex', async () => {
  const cases = [
    ['http://cueprompt.io/', 'https://cueprompt.io/'],
    ['http://cueprompt.io/privacy/?source=test', 'https://cueprompt.io/privacy/?source=test'],
    ['http://www.cueprompt.io/zh/', 'https://cueprompt.io/zh/'],
    ['https://www.cueprompt.io/teleprompter/', 'https://cueprompt.io/teleprompter/'],
    ['https://cueprompt.romandorian068.workers.dev/terms/', 'https://cueprompt.io/terms/']
  ];
  for (const [source, destination] of cases) {
    assert.equal(canonicalRedirect(source), destination);
    const response = await worker.fetch(new Request(source), { ASSETS: { fetch: assert.fail } });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), destination);
  }
});

test('serves the canonical HTTPS host without redirecting', async () => {
  assert.equal(canonicalRedirect('https://cueprompt.io/privacy/?source=test'), null);
  const expected = new Response('asset');
  const response = await worker.fetch(new Request('https://cueprompt.io/privacy/'), { ASSETS: { fetch: () => expected } });
  assert.equal(response, expected);
});

test('redirects retired Japanese routes to their closest current pages', async () => {
  const cases = [
    ['https://cueprompt.io/ja/record-video/', 'https://cueprompt.io/ja/teleprompter-with-camera/'],
    ['https://cueprompt.io/ja/teleprompter/', 'https://cueprompt.io/ja/'],
    ['http://cueprompt.io/ja/record-video/?source=old', 'https://cueprompt.io/ja/teleprompter-with-camera/?source=old']
  ];
  for (const [source, destination] of cases) {
    assert.equal(canonicalRedirect(source), destination);
    const response = await worker.fetch(new Request(source), { ASSETS: { fetch: assert.fail } });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), destination);
  }
});

test('builds a bounded Chinese generation prompt', () => {
  const messages = buildMessages({ mode: 'generate', topic: '介绍 CuePrompt', durationMinutes: 1, language: 'Simplified Chinese', tone: 'friendly' });
  assert.equal(messages.length, 2);
  assert.match(messages[1].content, /250 characters/);
  assert.match(messages[1].content, /介绍 CuePrompt/);
});

test('builds rewrite and translation prompts', () => {
  assert.match(buildMessages({ mode: 'rewrite', script: 'Hello', rewriteMode: 'shorter' })[1].content, /30% shorter/);
  assert.match(buildMessages({ mode: 'translate', script: 'Hello', target: 'Japanese' })[1].content, /into Japanese/);
});

test('builds generation and translation prompts for every supported AI language', () => {
  assert.equal(AI_LANGUAGES.length, 19);
  for (const language of AI_LANGUAGES) {
    const generated = buildMessages({ mode: 'generate', topic: 'CuePrompt', language });
    assert.ok(generated[1].content.includes(`in ${language}`));
    const translated = buildMessages({ mode: 'translate', script: 'Hello [pause]', target: language });
    assert.ok(translated[1].content.includes(`into ${language}`));
    assert.match(translated[1].content, /\[pause\]\/\[slow\]/);
  }
});

test('detects writing systems and blocks obvious output-language drift', () => {
  assert.equal(dominantWritingSystem('今天天气很好，我们去海边散步。'), 'cjk');
  assert.equal(dominantWritingSystem('Сегодня хорошая погода.'), 'cyrillic');
  assert.equal(dominantWritingSystem('안녕하세요. 오늘 날씨가 좋습니다.'), 'hangul');
  assert.equal(outputLanguageMatches({ mode: 'rewrite', script: '今天天气很好。' }, 'Сегодня хорошая погода.'), false);
  assert.equal(outputLanguageMatches({ mode: 'rewrite', script: '今天天气很好。' }, '今天天气非常好。'), true);
  assert.equal(outputLanguageMatches({ mode: 'translate', target: 'Russian' }, 'Сегодня хорошая погода.'), true);
  assert.equal(outputLanguageMatches({ mode: 'translate', target: 'Simplified Chinese' }, 'Today is sunny.'), false);
});

test('rejects empty inputs', () => {
  assert.throws(() => buildMessages({ mode: 'generate', topic: '' }), /TOPIC_REQUIRED/);
  assert.throws(() => buildMessages({ mode: 'rewrite', script: '' }), /SCRIPT_REQUIRED/);
});
