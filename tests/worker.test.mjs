import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildMessages, canonicalRedirect } from '../worker/index.js';

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

test('rejects empty inputs', () => {
  assert.throws(() => buildMessages({ mode: 'generate', topic: '' }), /TOPIC_REQUIRED/);
  assert.throws(() => buildMessages({ mode: 'rewrite', script: '' }), /SCRIPT_REQUIRED/);
});
