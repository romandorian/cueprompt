import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const app = await readFile(new URL('../dist/app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../dist/style.css', import.meta.url), 'utf8');
const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const zhHome = await readFile(new URL('../dist/zh/index.html', import.meta.url), 'utf8');
const sw = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
const install = await readFile(new URL('../dist/install.js', import.meta.url), 'utf8');
const logoStat = await stat(new URL('../dist/assets/cuepromptlogo.jpeg', import.meta.url));
const i18nRuntime = await readFile(new URL('../dist/i18n.js', import.meta.url), 'utf8');

test('homepage quick start exposes the two primary journeys', () => {
  assert.match(app, /class="hero-start"/);
  assert.match(app, /class="hero-record"/);
  assert.match(app, /data-quick-template="youtube"/);
  assert.match(app, /quickScript\.addEventListener\('input'/);
});

test('a new visitor starts with an empty script while legacy drafts are preserved', () => {
  assert.match(app, /legacy && typeof legacy\.text === 'string'/);
  assert.match(app, /makeScript\(t\('script\.default'\), ''\)/);
});

test('reader controls are progressive disclosure and mobile actions stack', () => {
  assert.match(app, /reading-options quick-settings/);
  assert.match(css, /\.quick-settings/);
  assert.match(css, /\.hero-composer-actions\{grid-template-columns:1fr/);
});

test('duplicate studio templates collapse after a script has content', () => {
  assert.match(app, /classList\.toggle\('has-script'/);
  assert.match(css, /\.has-script \.script-panel>\.template-box\{display:none\}/);
});

test('mobile camera mode prioritizes the recording surface', () => {
  assert.match(app, /classList\.toggle\('camera-mode', camera\)/);
  assert.match(css, /\.camera-mode \.studio-body>\.script-panel\{display:none\}/);
});

test('desktop hero phrases do not split into orphan CJK characters', () => {
  assert.match(css, /html:lang\(zh-CN\)[^}]+white-space:nowrap;word-break:keep-all/);
  assert.match(css, /\.intro h1>span[^}]+white-space:normal;overflow-wrap:anywhere/);
  assert.match(css, /max-width:760px[^}]+\.intro h1/);
});

test('camera entry reports progress and always restores its trigger', () => {
  assert.match(app, /cueprompt:camera-state/);
  assert.match(app, /button\.disabled = true/);
  assert.match(app, /button\.disabled = false/);
  assert.match(css, /button:disabled\{cursor:progress/);
});

test('new dynamic controls reuse locale dictionaries instead of English fallback copy', () => {
  assert.match(app, /title: t\('editor\.placeholder'\)/);
  assert.match(app, /button\.textContent = t\('cam\.allow'\)/);
  assert.match(app, /quickSettingsLabels = \['settings\.speed'/);
});

test('reading guide label is localized at runtime', () => {
  assert.match(app, /dataset\.guideLabel = t\('options\.guide'\)/);
  assert.match(css, /content:attr\(data-guide-label\)/);
  assert.doesNotMatch(css, /content:"EYE LEVEL GUIDE"/);
});

test('camera mode has an explicit localized return action', () => {
  assert.match(app, /id = 'camera-back'/);
  assert.match(app, /cameraBackButton\.onclick = \(\) => \$\('prompt-tab'\)\.click\(\)/);
  assert.match(app, /cameraBackButton\.hidden = !camera/);
  assert.match(css, /\.camera-back-button/);
});

test('recording keeps supported mobile screens awake and releases the lock', () => {
  assert.match(app, /navigator\.wakeLock\?\.request/);
  assert.match(app, /keepScreenAwake\(\)/);
  assert.match(app, /function stopRecording\(\)[^}]+releaseScreenWake\(\)/);
  assert.match(app, /pagehide[^\n]+releaseScreenWake\(\)/);
});

test('built English and Chinese homepages retain the studio shell', () => {
  for (const page of [home, zhHome]) {
    assert.match(page, /id="studio"/);
    assert.match(page, /id="script"/);
    assert.match(page, /id="camera-tab"/);
    assert.match(page, /app\.js\?v=/);
  }
});

test('service worker activates new shells without waiting for every tab to close', () => {
  assert.match(sw, /cueprompt-shell-v3/);
  assert.match(sw, /self\.skipWaiting\(\)/);
  assert.match(sw, /self\.clients\.claim\(\)/);
  assert.match(install, /updateViaCache: 'none'/);
  assert.match(install, /registration\.update\(\)/);
});

test('dynamic editor controls inherit the static page locale', () => {
  assert.match(app, /staticEditorLabel = editorBar\.querySelector/);
  assert.match(app, /staticCloseLabel = document\.querySelector/);
  assert.doesNotMatch(app, /expand: 'Expand editor'/);
});

test('camera and recording changes expose assistive status', () => {
  assert.match(home, /id="camera-notice" role="status" aria-live="polite"/);
  assert.match(home, /id="rec-dot" hidden role="status" aria-live="assertive"/);
  assert.match(app, /setAttribute\('aria-busy', 'true'\)/);
  assert.match(app, /removeAttribute\('aria-busy'\)/);
});

test('dialogs focus their first task and return focus when closed', () => {
  assert.match(app, /function openDialog\(dialog, preferredFocus\)/);
  assert.match(app, /dialogReturnFocus\.set\(dialog, trigger\)/);
  assert.match(app, /trigger\?\.isConnected[\s\S]*trigger\.focus\(\)/);
  assert.match(app, /openDialog\(\$\('library-dialog'\), \$\('library-search'\)\)/);
  assert.match(app, /editorExpandDialog\.close\(\);\s*editorExpandButton\.focus\(\)/);
});

test('mobile camera and fullscreen controls respect device safe areas', () => {
  assert.match(css, /reading-console\{top:max\(12px,env\(safe-area-inset-top\)\)/);
  assert.match(css, /camera-mode \.playback\{padding-bottom:max\(12px,env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /camera-mode \.camera-notice\{bottom:max\(40px,calc\(env\(safe-area-inset-bottom\) \+ 16px\)\)/);
});

test('reading and recording controls reuse each locale terminology', () => {
  assert.match(app, /start: 'play\.start', mode: 'tab\.prompt', ready: 'state\.ready'/);
  assert.doesNotMatch(app, /start: '开始阅读'/);
  assert.match(app, /\$\('reading-record'\)\.textContent = \(recording \? '■ ' \+ t\('record\.stop'\) : '● ' \+ t\('record\.start'\)\)/);
  assert.doesNotMatch(app, /recording \? '■ STOP' : '● REC'/);
});

test('new blank script action is visible and keeps prior drafts in the library', () => {
  assert.match(app, /newScriptButton\.innerHTML = '<span aria-hidden="true">＋<\/span><span data-i18n="script\.new">New script<\/span>'/);
  assert.match(app, /\$\('new-script'\)\.onclick = \(\) => \{ addScript\(t\('script\.untitled'\), ''\)/);
  assert.doesNotMatch(app, /\$\('new-script'\)[\s\S]{0,120}library\.scripts\s*=\s*\[/);
});

test('editor creation actions are consolidated into a localized tools disclosure', () => {
  assert.match(app, /editorTools\.className = 'editor-tools-menu'/);
  assert.match(app, /editorToolsPanel\.append\(\.\.\.editorToolButtons\)/);
  assert.match(app, /editorToolsSummary\.textContent = editorToolButtons\.map/);
  assert.match(css, /\.editor-tools-panel\{display:grid;grid-template-columns:repeat\(3,1fr\)/);
});

test('homepage reserves the quick composer slot before JavaScript boots', () => {
  assert.match(home, /id="hero-composer-mount" class="hero-composer-mount"/);
  assert.match(zhHome, /id="hero-composer-mount" class="hero-composer-mount"/);
  assert.match(app, /\$\('hero-composer-mount'\) \|\| intro/);
  assert.match(css, /\.hero-composer-mount\{grid-column:2;grid-row:1\/7[^}]+min-height:420px/);
});

test('long translated labels can wrap without overflowing controls', () => {
  assert.match(css, /hero-composer-head strong,.editor-tools-menu>summary\{overflow-wrap:anywhere\}/);
  assert.match(css, /hero-composer-actions button\{white-space:normal;line-height:1\.35/);
  assert.match(css, /panel-actions\{display:flex[^}]+flex-wrap:wrap/);
});

test('the above-the-fold logo is appropriately sized for its rendered dimensions', () => {
  assert.ok(logoStat.size < 20_000, `logo should stay below 20 KB, got ${logoStat.size}`);
  assert.match(home, /cuepromptlogo\.jpeg" alt="" width="44" height="44"/);
});

test('language navigation only exposes the retained European, CJK and Russian locales', () => {
  for (const code of ['en', 'es', 'pt', 'fr', 'de', 'ja', 'ko', 'ru', 'zh-CN', 'zh-TW']) {
    assert.match(i18nRuntime, new RegExp(`"code": "${code}"`));
  }
  for (const code of ['ar', 'hi', 'id', 'vi', 'th']) {
    assert.doesNotMatch(i18nRuntime, new RegExp(`"code": "${code}"`));
    assert.doesNotMatch(home, new RegExp(`hreflang="${code}"`));
  }
});

test('fullscreen reading controls expose localized assistive labels', () => {
  assert.match(app, /reading-smaller-text'\)\.setAttribute\('aria-label', t\('settings\.size'\) \+ ' −'\)/);
  assert.match(app, /reading-play'\)\.setAttribute\('aria-label', t\('fs\.play'\)\)/);
  assert.match(app, /reading-exit'\)\.setAttribute\('aria-label', t\('fs\.exit'\)\)/);
});

test('very narrow mobile layouts stack dense controls without horizontal overflow', () => {
  assert.match(css, /html,body\{max-width:100%;overflow-x:clip\}/);
  assert.match(css, /max-width:430px[^}]+\.preview-toolbar\{align-items:stretch;flex-direction:column/);
  assert.match(css, /max-width:380px[^}]+\.header \.site-nav>a,\.header \.site-nav \.nav-menu:first-of-type\{display:none!important\}/);
  assert.match(css, /hero-template-chips button\{flex:1 1 calc\(50% - 7px\)\}/);
});

test('Smart Follow stops safely and cannot restart a stale speech recognizer', () => {
  assert.match(app, /recognizer === currentRecognizer[^}]+currentRecognizer\.start\(\)/);
  assert.match(app, /clearTimeout\(followEndTimer\); followEndTimer = 0/);
  assert.match(app, /visibilitychange[^\n]+document\.hidden && playing && settings\.mode === 'follow'\) pause\(\)/);
});

test('camera and recorder failures clean up safely across Chromium browsers', () => {
  assert.match(app, /if \(stream !== openedStream\) return;[\s\S]+if \(recording\) stopRecording\(\);[\s\S]+closeCamera\(\)/);
  assert.match(app, /const activeRecorder = new MediaRecorder/);
  assert.match(app, /activeRecorder\.onerror = \(\) => \{ recording = false; releaseScreenWake\(\); pause\(\); updateRecordUI\(\)/);
  assert.match(app, /if \(blob\.size\) openReview/);
});
