import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMessages } from '../worker/index.js';

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
