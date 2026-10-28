'use strict';
/* CuePrompt — browser-local teleprompter studio. Plain JS, no build step. */
const $ = id => document.getElementById(id);
const I18N = window.CueI18n;
const Align = window.CueAlign;

/* ---------- i18n ---------- */
let lang = 'en', dict = I18N.dicts.en;
function t(key, vars) {
  let s = (dict && dict[key] != null) ? dict[key] : (I18N.dicts.en[key] != null ? I18N.dicts.en[key] : key);
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] != null ? vars[k] : '');
  return s;
}
function readingUi(key) {
  const zh = lang === 'zh-CN' ? { start: '开始阅读', mode: '阅读模式', ready: '准备就绪', reading: '正在阅读', follow: '语音跟读', paused: '已暂停' } :
    lang === 'zh-TW' ? { start: '開始閱讀', mode: '閱讀模式', ready: '準備就緒', reading: '正在閱讀', follow: '語音跟讀', paused: '已暫停' } :
    { start: 'Start reading', mode: 'READING MODE', ready: 'READY', reading: 'READING', follow: 'SMART FOLLOW', paused: 'PAUSED' };
  return zh[key];
}
function detectLanguage() {
  const supported = I18N.languages.map(l => l.code);
  for (const raw of navigator.languages || [navigator.language || 'en']) {
    const l = String(raw).toLowerCase();
    if (l.startsWith('zh')) return /tw|hk|mo|hant/.test(l) ? 'zh-TW' : 'zh-CN';
    const base = l.split('-')[0];
    const hit = supported.find(c => c.toLowerCase() === base);
    if (hit) return hit;
  }
  return 'en';
}

/* ---------- storage ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
};

/* The editor remains the preparation space; this creates the focused performance space. */
const readingConsole = document.createElement('div');
readingConsole.className = 'reading-console'; readingConsole.id = 'reading-console';
readingConsole.setAttribute('aria-label', 'Reading mode controls');
readingConsole.innerHTML = '<span class="reading-console-title">CuePrompt <small>READING MODE</small></span><span class="reading-console-status" id="reading-console-status">READY</span><div class="reading-console-actions"><button id="reading-smaller-text" aria-label="Smaller text">A−</button><button id="reading-larger-text" aria-label="Larger text">A+</button><button id="reading-slower" aria-label="Slower">−</button><span class="fs-speed" id="reading-speed">40</span><button id="reading-faster" aria-label="Faster">+</button><button id="reading-play" class="fs-play" aria-label="Play or pause">▶</button><button id="reading-record" class="fs-record" aria-label="Start or stop recording" hidden>● REC</button><button id="reading-exit" aria-label="Exit reading mode">✕</button></div>';
$('prompter').append(readingConsole);
const readingButton = document.createElement('button');
readingButton.id = 'enter-reading'; readingButton.className = 'reading-button'; readingButton.setAttribute('aria-label', 'Open reading mode');
readingButton.innerHTML = '<span>⛶</span> Start reading';
$('play').before(readingButton);
const legacy = store.get('cueprompt-v1', null);
const settings = Object.assign({ speed: 40, size: 36, mirror: false, mode: 'steady', speechLang: '', uiLang: '', camera: '', mic: '', resolution: 'auto', format: 'auto', countdown: true, mirrorCamera: true },
  legacy && typeof legacy === 'object' ? { speed: legacy.speed || 40, size: legacy.size || 36, mirror: !!legacy.mirror } : {},
  store.get('cueprompt-settings', {}));
function saveSettings() { store.set('cueprompt-settings', settings); }

/* ---------- templates ---------- */
const TEMPLATES = {
  en: {
    youtube: { title: 'My next great video', text: "## Hook\nHey there, welcome back.\n\nYou know that feeling when you have something to say, but the words just don't come out right?\n\nToday, we're changing that. [pause]\n\n## Main idea\nI'm going to share three simple ideas that helped me show up with more confidence — and sound a little more like myself.\n\nNo perfect scripts. No endless retakes. Just a real conversation.\n\n## Close\n[slow] Let's get into it." },
    pitch: { title: 'A product worth talking about', text: "## Problem\nWhat if your next big idea didn't have to wait?\n\nWe built something for people like you. People who see a problem and think: there has to be a better way. [pause]\n\n## How it works\nStart with the thing you want to change. Take one small step. And let us help with the rest.\n\nLess friction. More possibility.\n\n## Call to action\nReady to give it a try? Let's make something great." },
    speech: { title: 'A moment to remember', text: "Thank you for being here today. [pause]\n\nBefore we begin, I'd like you to think of a moment when someone believed in you — before you believed in yourself.\n\nThat small act of encouragement can change everything.\n\nToday is a reminder that we all have the chance to be that person for someone else.\n\n[slow] So let's celebrate the progress we've made, the people beside us, and the possibilities ahead.\n\nHere's to what comes next. Thank you." },
    meeting: { title: 'Team update', text: "## Update\nHi everyone. Here is a quick update on [project].\n\nOur goal this week is [goal]. We have completed [milestone], and the main thing we learned is [insight].\n\n## Next steps\nThe next priority is [next step]. We need input on [decision] by [date].\n\n## Questions\nBefore we wrap up, what questions or blockers should we discuss?" },
    course: { title: 'Teach one useful idea', text: "## Outcome\nBy the end of this lesson, you will know how to [outcome].\n\n## Concept\nStart with this idea: [key concept]. It matters because [reason]. [pause]\n\n## Example\nLet me walk you through an example. First, [step one]. Next, [step two]. Finally, [step three].\n\n## Practice\nNow try it yourself: [exercise].\n\nThe main takeaway is [summary]. In the next lesson, we will explore [next topic]." },
    podcast: { title: 'Your next episode', text: "Welcome to [podcast name]. I am [name], and today we are talking about [topic].\n\nIf you have ever wondered [question], this episode is for you. [pause]\n\nWe will explore [first point], share [story or example], and leave you with [practical takeaway].\n\nSo get comfortable, and let us get into it." }
  },
  'zh-CN': {
    youtube: { title: '我的下一支视频', text: "## 开场\n嗨，欢迎回来。\n\n你有没有过这种感觉：心里有很多话想说，可一开口就是说不顺？\n\n今天，我们就来解决这个问题。[pause]\n\n## 正文\n我会分享三个简单的方法，它们帮我在镜头前更自信，也更像我自己。\n\n不需要完美的稿子，也不用一遍又一遍地重录，就像平常聊天一样。\n\n## 结尾\n[slow] 我们开始吧。" },
    pitch: { title: '一个值得聊聊的产品', text: "## 痛点\n如果你的下一个好点子，不用再等呢？\n\n我们为像你这样的人做了一款产品。你看到问题时会想：一定有更好的办法。[pause]\n\n## 怎么用\n先找到你最想改变的那件事，迈出一小步，剩下的交给我们。\n\n更少阻力，更多可能。\n\n## 行动\n想试试吗？一起做点了不起的事。" },
    speech: { title: '值得记住的时刻', text: "谢谢大家今天来到这里。[pause]\n\n开始之前，请你想一想：有没有那么一个时刻，在你还不相信自己的时候，有人先相信了你？\n\n那一点点鼓励，可能改变一切。\n\n今天也提醒我们：每个人都有机会，成为别人生命里的那个人。\n\n[slow] 让我们一起庆祝走过的路、身边的人，还有前方的可能。\n\n敬未来。谢谢大家。" },
    meeting: { title: '团队周会更新', text: "## 进展\n大家好，我简单同步一下[项目]的进展。\n\n本周目标是[目标]。我们已经完成了[里程碑]，最大的收获是[洞察]。\n\n## 下一步\n接下来的重点是[下一步]。我们需要在[日期]前确定[决策]。\n\n## 讨论\n最后，大家有什么问题或者卡点需要讨论吗？" },
    course: { title: '讲清楚一个知识点', text: "## 目标\n学完这节课，你将学会[目标]。\n\n## 概念\n先记住一个核心概念：[概念]。它之所以重要，是因为[原因]。[pause]\n\n## 示例\n我们来看一个例子。第一步，[步骤一]；第二步，[步骤二]；最后，[步骤三]。\n\n## 练习\n现在轮到你了：[练习]。\n\n这节课的重点是[总结]。下节课，我们会讲[下一个主题]。" },
    podcast: { title: '新一期节目', text: "欢迎收听[节目名称]，我是[名字]，今天我们聊聊[话题]。\n\n如果你也好奇过[问题]，这期节目就是为你准备的。[pause]\n\n我们会聊到[第一个观点]，分享[故事或案例]，最后给你一个[实用建议]。\n\n找个舒服的姿势，我们开始吧。" }
  },
  'zh-TW': {
    youtube: { title: '我的下一支影片', text: "## 開場\n嗨，歡迎回來。\n\n你有沒有過這種感覺：心裡有很多話想說，可一開口就是說不順？\n\n今天，我們就來解決這個問題。[pause]\n\n## 正文\n我會分享三個簡單的方法，它們幫我在鏡頭前更自信，也更像我自己。\n\n不需要完美的稿子，也不用一遍又一遍地重錄，就像平常聊天一樣。\n\n## 結尾\n[slow] 我們開始吧。" },
    pitch: { title: '一個值得聊聊的產品', text: "## 痛點\n如果你的下一個好點子，不用再等呢？\n\n我們為像你這樣的人做了一款產品。你看到問題時會想：一定有更好的辦法。[pause]\n\n## 怎麼用\n先找到你最想改變的那件事，邁出一小步，剩下的交給我們。\n\n更少阻力，更多可能。\n\n## 行動\n想試試嗎？一起做點了不起的事。" },
    speech: { title: '值得記住的時刻', text: "謝謝大家今天來到這裡。[pause]\n\n開始之前，請你想一想：有沒有那麼一個時刻，在你還不相信自己的時候，有人先相信了你？\n\n那一點點鼓勵，可能改變一切。\n\n今天也提醒我們：每個人都有機會，成為別人生命裡的那個人。\n\n[slow] 讓我們一起慶祝走過的路、身邊的人，還有前方的可能。\n\n敬未來。謝謝大家。" },
    meeting: { title: '團隊週會更新', text: "## 進展\n大家好，我簡單同步一下[專案]的進展。\n\n本週目標是[目標]。我們已經完成了[里程碑]，最大的收穫是[洞察]。\n\n## 下一步\n接下來的重點是[下一步]。我們需要在[日期]前確定[決策]。\n\n## 討論\n最後，大家有什麼問題或者卡點需要討論嗎？" },
    course: { title: '講清楚一個知識點', text: "## 目標\n學完這節課，你將學會[目標]。\n\n## 概念\n先記住一個核心概念：[概念]。它之所以重要，是因為[原因]。[pause]\n\n## 示例\n我們來看一個例子。第一步，[步驟一]；第二步，[步驟二]；最後，[步驟三]。\n\n## 練習\n現在輪到你了：[練習]。\n\n這節課的重點是[總結]。下節課，我們會講[下一個主題]。" },
    podcast: { title: '新一期節目', text: "歡迎收聽[節目名稱]，我是[名字]，今天我們聊聊[話題]。\n\n如果你也好奇過[問題]，這期節目就是為你準備的。[pause]\n\n我們會聊到[第一個觀點]，分享[故事或案例]，最後給你一個[實用建議]。\n\n找個舒服的姿勢，我們開始吧。" }
  }
};
const LOCAL_TEMPLATE_COPY = {
  es: { titles: ['Introducción de YouTube', 'Presentación de producto', 'Un breve discurso', 'Actualización de equipo', 'Lección en línea', 'Apertura de podcast'], body: 'Hola, gracias por estar aquí.\n\nHoy quiero compartir una idea clara y útil contigo. Empecemos por lo que importa, paso a paso. [pause]\n\nAl final tendrás una acción sencilla que puedes poner en práctica hoy.\n\n[slow] Empecemos.' },
  pt: { titles: ['Introdução para YouTube', 'Apresentação de produto', 'Um breve discurso', 'Atualização da equipe', 'Aula online', 'Abertura de podcast'], body: 'Olá, que bom ter você aqui.\n\nHoje quero compartilhar uma ideia clara e útil. Vamos ao que importa, passo a passo. [pause]\n\nNo final, você terá uma ação simples para colocar em prática hoje.\n\n[slow] Vamos começar.' },
  fr: { titles: ['Introduction YouTube', 'Présentation produit', 'Un court discours', "Point d’équipe", 'Cours en ligne', 'Ouverture de podcast'], body: 'Bonjour, merci d’être là.\n\nAujourd’hui, je veux partager une idée claire et utile. Allons à l’essentiel, pas à pas. [pause]\n\nÀ la fin, vous aurez une action simple à mettre en pratique dès aujourd’hui.\n\n[slow] Commençons.' },
  de: { titles: ['YouTube-Intro', 'Produktvorstellung', 'Eine kurze Rede', 'Team-Update', 'Online-Lektion', 'Podcast-Auftakt'], body: 'Hallo, schön, dass du da bist.\n\nHeute möchte ich eine klare und hilfreiche Idee mit dir teilen. Gehen wir Schritt für Schritt zum Wesentlichen. [pause]\n\nAm Ende hast du eine einfache Aktion, die du heute umsetzen kannst.\n\n[slow] Los geht’s.' },
  ja: { titles: ['YouTube の導入', '製品紹介', '短いスピーチ', 'チームの近況', 'オンライン講座', 'ポッドキャストの導入'], body: 'こんにちは。来てくださってありがとうございます。\n\n今日は、役に立つわかりやすいアイデアを一つお話しします。大切なところから、一歩ずつ進めましょう。[pause]\n\n最後には、今日からできるシンプルな行動を持ち帰れます。\n\n[slow] 始めましょう。' },
  ko: { titles: ['YouTube 인트로', '제품 소개', '짧은 연설', '팀 업데이트', '온라인 강의', '팟캐스트 오프닝'], body: '안녕하세요. 함께해 주셔서 감사합니다.\n\n오늘은 명확하고 유용한 한 가지 아이디어를 나누겠습니다. 중요한 것부터 차근차근 시작해 볼게요. [pause]\n\n마지막에는 오늘 바로 실천할 수 있는 간단한 행동을 얻어 가실 수 있습니다.\n\n[slow] 시작하겠습니다.' },
  ru: { titles: ['Вступление для YouTube', 'Презентация продукта', 'Короткая речь', 'Обновление команды', 'Онлайн-урок', 'Начало подкаста'], body: 'Здравствуйте, спасибо, что вы здесь.\n\nСегодня я хочу поделиться одной ясной и полезной идеей. Давайте начнём с главного, шаг за шагом. [pause]\n\nВ конце у вас будет простое действие, которое можно сделать уже сегодня.\n\n[slow] Начнём.' },
  ar: { titles: ['مقدمة يوتيوب', 'عرض منتج', 'خطاب قصير', 'تحديث الفريق', 'درس عبر الإنترنت', 'افتتاح بودكاست'], body: 'مرحباً، شكراً لوجودك هنا.\n\nأريد اليوم أن أشاركك فكرة واضحة ومفيدة. لنبدأ بالأهم، خطوة بخطوة. [pause]\n\nفي النهاية سيكون لديك إجراء بسيط يمكنك تطبيقه اليوم.\n\n[slow] لنبدأ.' },
  hi: { titles: ['YouTube परिचय', 'उत्पाद परिचय', 'छोटा भाषण', 'टीम अपडेट', 'ऑनलाइन पाठ', 'पॉडकास्ट शुरुआत'], body: 'नमस्ते, यहाँ आने के लिए धन्यवाद।\n\nआज मैं आपके साथ एक स्पष्ट और उपयोगी विचार साझा करना चाहता हूँ। आइए महत्वपूर्ण बात से, कदम-दर-कदम शुरू करें। [pause]\n\nअंत में आपके पास एक सरल काम होगा जिसे आप आज ही कर सकते हैं।\n\n[slow] शुरू करते हैं।' },
  id: { titles: ['Pembuka YouTube', 'Presentasi produk', 'Pidato singkat', 'Pembaruan tim', 'Kelas online', 'Pembuka podcast'], body: 'Halo, terima kasih sudah hadir.\n\nHari ini saya ingin membagikan satu ide yang jelas dan bermanfaat. Mari mulai dari yang penting, selangkah demi selangkah. [pause]\n\nDi akhir, Anda akan memiliki satu tindakan sederhana yang bisa dilakukan hari ini.\n\n[slow] Mari mulai.' },
  vi: { titles: ['Mở đầu YouTube', 'Giới thiệu sản phẩm', 'Bài phát biểu ngắn', 'Cập nhật nhóm', 'Bài học trực tuyến', 'Mở đầu podcast'], body: 'Xin chào, cảm ơn bạn đã có mặt.\n\nHôm nay tôi muốn chia sẻ một ý tưởng rõ ràng và hữu ích. Hãy bắt đầu từ điều quan trọng, từng bước một. [pause]\n\nCuối cùng, bạn sẽ có một hành động đơn giản để thực hiện ngay hôm nay.\n\n[slow] Hãy bắt đầu.' },
  th: { titles: ['เกริ่นนำ YouTube', 'นำเสนอผลิตภัณฑ์', 'สุนทรพจน์สั้น', 'อัปเดตทีม', 'บทเรียนออนไลน์', 'เปิดพอดแคสต์'], body: 'สวัสดี ขอบคุณที่มาร่วมกันวันนี้\n\nวันนี้ฉันอยากแบ่งปันแนวคิดที่ชัดเจนและเป็นประโยชน์ เริ่มจากสิ่งสำคัญทีละขั้นตอนกันเถอะ [pause]\n\nในตอนท้าย คุณจะมีสิ่งเล็ก ๆ ที่ทำได้ทันทีในวันนี้\n\n[slow] มาเริ่มกันเลย' }
};
function templateFor(key) {
  const set = TEMPLATES[lang]; if (set && set[key]) return set[key];
  const copy = LOCAL_TEMPLATE_COPY[lang];
  if (copy) { const order = ['youtube', 'pitch', 'speech', 'meeting', 'course', 'podcast']; const title = copy.titles[order.indexOf(key)] || copy.titles[0]; return { title, text: '## ' + title + '\n\n' + copy.body }; }
  return TEMPLATES.en[key];
}

/* ---------- script library ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const now = () => Date.now();
function makeScript(title, text) { const ts = now(); return { id: uid(), title: title || t('script.untitled'), text: text || '', createdAt: ts, updatedAt: ts }; }
let library = store.get('cueprompt-library', null);
function initLibrary() {
  if (!library || !Array.isArray(library.scripts) || !library.scripts.length) {
    const first = legacy && typeof legacy.text === 'string' ? makeScript(legacy.title || 'My next great video', legacy.text) : makeScript(templateFor('youtube').title, templateFor('youtube').text);
    library = { version: 1, currentId: first.id, scripts: [first] };
  }
  library.scripts = library.scripts.filter(s => s && typeof s.text === 'string' && s.id);
  if (!library.scripts.find(s => s.id === library.currentId)) library.currentId = library.scripts[0].id;
  saveLibrary();
}
function current() { return library.scripts.find(s => s.id === library.currentId); }
function saveLibrary() {
  const ok = store.set('cueprompt-library', library);
  $('save-state').textContent = ok ? t('save.saved') : t('save.unavailable');
  $('library-count').textContent = library.scripts.length;
  return ok;
}
let saveTimer;
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveLibrary, 250); }
function openScript(id) {
  if (recording) { toast(t('toast.stopFirst')); return; }
  if (!library.scripts.find(s => s.id === id)) return;
  library.currentId = id; saveLibrary();
  $('script').value = current().text; $('script-title').value = current().title;
  reset(); renderScript(); updateCounts();
}
function addScript(title, text, open = true) {
  const s = makeScript(title, text); library.scripts.unshift(s); saveLibrary();
  if (open) openScript(s.id);
  return s;
}

/* ---------- counting ---------- */
const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
function countScript(text) {
  const clean = text.replace(/^\s*#{1,6}\s+.*$/gm, ' ').replace(/\[[^\]\n]{1,30}\]/g, ' ');
  const cjk = (clean.match(CJK) || []).length; const rest = clean.replace(CJK, ' ').trim();
  const words = rest ? rest.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length : 0;
  return { cjk, words, minutes: cjk / 250 + words / 150 };
}
function updateCounts() {
  const c = countScript($('script').value);
  $('word-count').textContent = c.cjk && c.words ? t('count.mixed', { c: c.cjk, w: c.words }) : c.cjk ? t('count.chars', { n: c.cjk }) : t('count.words', { n: c.words });
  $('duration').textContent = t('count.duration', { n: Math.max(c.cjk || c.words ? 1 : 0, Math.ceil(c.minutes)) });
}

/* ---------- rendering the reading view ---------- */
let tokens = [], tokenNorms = [], sections = [], markers = [], paras = [], layoutDirty = true;
const PAUSE_RE = /^(pause|break|停顿|暂停|停頓|暫停|pausa|ポーズ|休止)$/i, SLOW_RE = /^(slow|slower|slowly|慢|放慢|慢一点|慢一點|lento|langsam|lent|ゆっくり)$/i;
function renderScript() {
  const text = $('script').value, root = $('reading-text');
  root.textContent = ''; tokens = []; sections = []; markers = []; paras = [];
  if (!text.trim()) { const p = document.createElement('div'); p.className = 'p placeholder'; p.textContent = t('editor.empty'); root.append(p); afterRender(); return; }
  const frag = document.createDocumentFragment();
  for (const line of text.split('\n')) {
    const div = document.createElement('div'); div.dir = 'auto';
    const h = line.match(/^\s*#{1,6}\s+(.*)$/);
    if (h) { div.className = 'p cue-heading'; div.textContent = h[1]; sections.push({ title: h[1], el: div, tokenIndex: tokens.length }); frag.append(div); continue; }
    if (!line.trim()) { div.className = 'p blank'; div.textContent = '\u00a0'; frag.append(div); continue; }
    div.className = 'p';
    const addText = seg => {
      let i = 0;
      for (const tk of Align.tokenize(seg)) {
        if (tk.s > i) div.append(seg.slice(i, tk.s));
        const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = seg.slice(tk.s, tk.e);
        tokens.push({ n: tk.n, el: sp }); div.append(sp); i = tk.e;
      }
      if (i < seg.length) div.append(seg.slice(i));
    };
    const re = /\[([^\]\n]{1,30})\]/g; let last = 0, m;
    while ((m = re.exec(line))) {
      addText(line.slice(last, m.index));
      const label = m[1].trim(), type = PAUSE_RE.test(label) ? 'pause' : SLOW_RE.test(label) ? 'slow' : 'cue';
      const pill = document.createElement('span'); pill.className = 'cue-pill cue-' + type;
      pill.textContent = (type === 'pause' ? '❙❙ ' : type === 'slow' ? '↓ ' : '') + label;
      div.append(pill);
      if (type === 'slow') div.classList.add('is-slow');
      if (type === 'pause') markers.push({ el: pill, done: false });
      last = re.lastIndex;
    }
    addText(line.slice(last));
    frag.append(div);
  }
  root.append(frag); afterRender();
}
function afterRender() {
  tokenNorms = tokens.map(x => x.n); layoutDirty = true; readMarked = 0;
  if (followPos > tokens.length) followPos = tokens.length;
  renderSections(); applyTextStyle();
}
function measure() {
  if (!layoutDirty) return;
  paras = [...$('reading-text').children].map(el => ({ el, top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight, slow: el.classList.contains('is-slow') }));
  for (const mk of markers) mk.top = mk.el.offsetTop;
  layoutDirty = false;
}
function guideCenter() { const g = document.querySelector('.reading-line'), sa = $('scroll-area'); return g.offsetTop + g.offsetHeight / 2 - sa.offsetTop; }
function paraAt(y) { measure(); let lo = 0, hi = paras.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1, p = paras[mid]; if (y < p.top) hi = mid - 1; else if (y >= p.bottom) lo = mid + 1; else return p; } return null; }
let currentPara = null;
function updateCurrentLine() {
  const p = paraAt($('scroll-area').scrollTop + guideCenter());
  if (p === currentPara) return;
  if (currentPara) currentPara.el.classList.remove('current');
  currentPara = p; if (p) p.el.classList.add('current');
}
new ResizeObserver(() => { layoutDirty = true; }).observe($('reading-text'));
window.addEventListener('resize', () => { layoutDirty = true; });

/* ---------- sections / jump list ---------- */
function renderSections() {
  const menu = $('sections-menu'); menu.textContent = '';
  const mk = (label, onClick, cls) => { const b = document.createElement('button'); b.textContent = label; if (cls) b.className = cls; b.onclick = () => { onClick(); toggleSections(false); }; menu.append(b); };
  mk(t('sections.start'), () => jumpTo(0, 0), 'muted');
  if (!sections.length) { const p = document.createElement('p'); p.textContent = t('sections.empty'); menu.append(p); }
  sections.forEach(s => mk(s.title, () => jumpTo(s.el.offsetTop, s.tokenIndex)));
}
function toggleSections(open) { const menu = $('sections-menu'); const o = open != null ? open : menu.hidden; menu.hidden = !o; $('sections-button').setAttribute('aria-expanded', String(o)); }
function jumpTo(top, tokenIndex) {
  const y = Math.max(0, top - guideCenter() + 20);
  $('scroll-area').scrollTop = y; scrollPosition = $('scroll-area').scrollTop; followTarget = scrollPosition;
  followPos = tokenIndex; markRead(true);
  measure(); for (const m of markers) m.done = m.top < scrollPosition + guideCenter() - 2;
  updateCurrentLine();
}
$('sections-button').onclick = e => { e.stopPropagation(); toggleSections(); };
document.addEventListener('click', e => { if (!$('sections-menu').hidden && !e.target.closest('.sections-wrap')) toggleSections(false); });

/* ---------- toast ---------- */
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3800); }

/* ---------- playback (steady + smart follow) ---------- */
let playing = false, elapsed = 0, last = 0, frame, scrollPosition = 0, holdUntil = 0, modeKey = 'state.ready';
function setModeLabel(key) { modeKey = key; $('mode-label').textContent = t(key); }
function playLabel() {
  if (settings.mode === 'follow') return playing ? t('play.stopListen') : t('play.listen');
  return playing ? t('play.pause') : elapsed ? t('play.continue') : t('play.start');
}
function syncPlayUI() {
  $('play').innerHTML = ''; const icon = document.createElement('span'); icon.textContent = playing ? 'Ⅱ' : '▶';
  $('play').append(icon, ' ' + playLabel());
  $('fs-play').textContent = playing ? 'Ⅱ' : '▶';
  $('reading-play').textContent = playing ? 'Ⅱ' : '▶';
  $('reading-console-status').textContent = playing ? (settings.mode === 'follow' ? readingUi('follow') : readingUi('reading')) : (elapsed ? readingUi('paused') : readingUi('ready'));
  $('prompter').classList.toggle('is-playing', playing);
  scheduleHide();
}
function formatTime(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }
function atEnd() { const sa = $('scroll-area'); return sa.scrollTop + sa.clientHeight >= sa.scrollHeight - 2; }
function tick(time) {
  if (!playing) return;
  const sa = $('scroll-area');
  if (last) {
    const dt = Math.min((time - last) / 1000, .1);
    elapsed += dt; $('elapsed').textContent = formatTime(elapsed);
    if (settings.mode === 'steady') {
      if (time < holdUntil) { /* holding on a [pause] cue */ }
      else {
        if (holdUntil) { holdUntil = 0; setModeLabel('state.playing'); }
        measure();
        const p = paraAt(sa.scrollTop + guideCenter());
        const speed = Number($('speed').value) * (p && p.slow ? .55 : 1);
        if (p && p.slow && modeKey !== 'state.slow') setModeLabel('state.slow'); else if ((!p || !p.slow) && modeKey === 'state.slow') setModeLabel('state.playing');
        scrollPosition += speed * dt; sa.scrollTop = scrollPosition;
        const y = sa.scrollTop + guideCenter();
        for (const m of markers) if (!m.done && m.top <= y) { m.done = true; holdUntil = time + 2000; setModeLabel('state.hold'); break; }
        if (atEnd()) { pause(); toast(t('toast.wrap')); return; }
      }
    } else {
      const d = followTarget - sa.scrollTop;
      if (Math.abs(d) > .5) { sa.scrollTop += d * Math.min(1, dt * 5); }
      scrollPosition = sa.scrollTop;
      updateFollowIndicator(time);
    }
    updateCurrentLine();
  }
  last = time; frame = requestAnimationFrame(tick);
}
function play() {
  if (!$('script').value.trim()) { toast(t('toast.addScript')); $('script').focus(); return; }
  if (playing) { pause(); return; }
  if (settings.mode === 'follow') { if (!startFollow()) return; }
  else if (atEnd()) reset();
  const sa = $('scroll-area'); scrollPosition = sa.scrollTop; followTarget = scrollPosition;
  measure(); for (const m of markers) m.done = m.top < scrollPosition + guideCenter() - 2;
  playing = true; holdUntil = 0; syncPlayUI();
  setModeLabel(settings.mode === 'follow' ? 'state.listening' : 'state.playing');
  last = 0; frame = requestAnimationFrame(tick);
}
function pause() {
  const was = playing; playing = false; cancelAnimationFrame(frame); last = 0; holdUntil = 0;
  stopFollow(); syncPlayUI();
  if (was || modeKey !== 'state.ready') setModeLabel(elapsed ? 'state.paused' : 'state.ready');
}
function reset() {
  pause(); elapsed = 0; $('elapsed').textContent = '00:00';
  $('scroll-area').scrollTop = 0; scrollPosition = 0; followPos = 0; followTarget = 0; markRead(true);
  for (const m of markers) m.done = false;
  syncPlayUI(); setModeLabel('state.ready'); updateCurrentLine();
}

/* ---------- Smart Follow ---------- */
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const SPEECH_LANGS = [
  ['zh-CN', '中文（普通话，中国大陆）'], ['zh-TW', '中文（國語，台灣）'], ['zh-HK', '粵語（香港）'], ['en-US', 'English (US)'], ['en-GB', 'English (UK)'], ['en-IN', 'English (India)'], ['en-AU', 'English (Australia)'],
  ['es-ES', 'Español (España)'], ['es-MX', 'Español (México)'], ['pt-BR', 'Português (Brasil)'], ['pt-PT', 'Português (Portugal)'], ['fr-FR', 'Français'], ['de-DE', 'Deutsch'], ['it-IT', 'Italiano'],
  ['ja-JP', '日本語'], ['ko-KR', '한국어'], ['ru-RU', 'Русский'], ['ar-SA', 'العربية'], ['hi-IN', 'हिन्दी'], ['id-ID', 'Bahasa Indonesia'], ['ms-MY', 'Bahasa Melayu'], ['vi-VN', 'Tiếng Việt'], ['th-TH', 'ไทย'],
  ['tr-TR', 'Türkçe'], ['nl-NL', 'Nederlands'], ['pl-PL', 'Polski'], ['uk-UA', 'Українська'], ['sv-SE', 'Svenska'], ['fil-PH', 'Filipino']
];
const UI_TO_SPEECH = { en: 'en-US', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', es: 'es-ES', pt: 'pt-BR', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', ko: 'ko-KR', ru: 'ru-RU', ar: 'ar-SA', hi: 'hi-IN', id: 'id-ID', vi: 'vi-VN', th: 'th-TH' };
let followEndTimer = 0, recognizer = null, followPos = 0, followTarget = 0, lastHeard = 0, followFatal = false, readMarked = 0, heardText = '';
function speechLang() { return settings.speechLang || UI_TO_SPEECH[lang] || 'en-US'; }
function setFollowStatus(key, vars, isError) { const el = $('follow-status'); el.textContent = t(key, vars); el.dataset.key = key; el.classList.toggle('error', !!isError); }
function tokenAtGuide() {
  const y = $('scroll-area').scrollTop + guideCenter() - 4;
  for (let i = 0; i < tokens.length; i++) if (tokens[i].el.offsetTop + tokens[i].el.offsetHeight >= y) return i;
  return tokens.length;
}
function startFollow() {
  if (!SpeechRec) { setFollowStatus('follow.unsupported', null, true); toast(t('follow.unsupported')); return false; }
  followFatal = false; heardText = '';
  followPos = Math.min(tokenAtGuide(), tokens.length); markRead(true);
  try {
    recognizer = new SpeechRec();
    recognizer.lang = speechLang(); recognizer.continuous = true; recognizer.interimResults = true; recognizer.maxAlternatives = 1;
    recognizer.onresult = onSpeech;
    recognizer.onerror = onSpeechError;
    recognizer.onend = () => { if (playing && settings.mode === 'follow' && !followFatal && recognizer) { try { recognizer.start(); } catch { } } };
    recognizer.start();
  } catch (err) { recognizer = null; setFollowStatus('follow.error', null, true); toast(t('follow.error')); return false; }
  lastHeard = performance.now(); setFollowStatus('follow.status.listening');
  $('follow-indicator').hidden = false;
  return true;
}
function stopFollow() {
  if (recognizer) { const r = recognizer; recognizer = null; r.onend = null; try { r.abort(); } catch { } }
  $('follow-indicator').hidden = true;
  if (settings.mode === 'follow' && !followFatal) setFollowStatus('follow.status.idle');
}
function onSpeech(e) {
  let text = '';
  for (let i = Math.max(0, e.results.length - 6); i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
  lastHeard = performance.now();
  heardText = text.trim(); if (heardText.length > 48) { heardText = heardText.slice(-48); const sp = heardText.indexOf(' '); if (sp > 0 && sp < 16) heardText = '…' + heardText.slice(sp + 1); }
  const spoken = Align.tokenize(text).map(x => x.n);
  const r = Align.align(tokenNorms, spoken, followPos);
  if (r) { followPos = r.pos; setFollowTarget(); markRead(); }
  if (followPos >= tokens.length && tokens.length && !followEndTimer) { followEndTimer = setTimeout(() => { followEndTimer = 0; if (playing && settings.mode === 'follow') { pause(); toast(t('toast.wrap')); } }, 1200); }
}
function onSpeechError(e) {
  if (e.error === 'no-speech' || e.error === 'aborted') return;
  followFatal = true;
  const key = e.error === 'network' ? 'follow.network' : (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') ? 'follow.denied' : e.error === 'language-not-supported' ? 'follow.langUnsupported' : 'follow.error';
  pause(); setFollowStatus(key, null, true); toast(t(key));
  if (e.error === 'network') setMode('steady', true);
}
function setFollowTarget() {
  const tok = tokens[Math.max(0, followPos - 1)]; if (!tok) return;
  followTarget = Math.max(0, tok.el.offsetTop + tok.el.offsetHeight / 2 - guideCenter());
}
function markRead(resetAll) {
  if (resetAll) { for (let i = 0; i < readMarked && i < tokens.length; i++) tokens[i].el.classList.remove('read'); readMarked = 0; if (settings.mode !== 'follow') return; }
  const target = Math.min(followPos, tokens.length);
  for (let i = readMarked; i < target; i++) tokens[i].el.classList.add('read');
  for (let i = target; i < readMarked; i++) tokens[i].el.classList.remove('read');
  readMarked = target;
}
function updateFollowIndicator(time) {
  const quiet = time - lastHeard > 1600;
  const key = quiet ? 'follow.status.waiting' : 'follow.status.listening';
  $('follow-indicator').classList.toggle('quiet', quiet);
  $('follow-indicator-text').textContent = t(key);
  const st = $('follow-status');
  if (!followFatal) { if (!quiet && heardText) { if (st.dataset.heard !== heardText) { st.dataset.heard = heardText; setFollowStatus('follow.status.heard', { text: heardText }); } } else if (st.dataset.key !== key && quiet) setFollowStatus(key); }
}
function setMode(mode, silent) {
  if (mode === 'follow' && !SpeechRec) { setFollowStatus('follow.unsupported', null, true); $('follow-panel').hidden = false; if (!silent) toast(t('follow.unsupported')); return; }
  if (playing) pause();
  settings.mode = mode; saveSettings();
  $('mode-steady').classList.toggle('active', mode === 'steady'); $('mode-steady').setAttribute('aria-pressed', String(mode === 'steady'));
  $('mode-follow').classList.toggle('active', mode === 'follow'); $('mode-follow').setAttribute('aria-pressed', String(mode === 'follow'));
  document.body.classList.toggle('follow-mode', mode === 'follow');
  $('follow-panel').hidden = mode !== 'follow' && !followFatal;
  if (mode === 'follow') { followFatal = false; setFollowStatus('follow.status.idle'); }
  markRead(true); syncPlayUI();
}
$('mode-steady').onclick = () => setMode('steady');
$('mode-follow').onclick = () => setMode('follow');
function fillSpeechLanguages() {
  const sel = $('speech-language'); sel.textContent = '';
  for (const [code, name] of SPEECH_LANGS) sel.append(new Option(name + ' · ' + code, code));
  sel.value = speechLang();
}
$('speech-language').onchange = () => { settings.speechLang = $('speech-language').value; saveSettings(); if (playing && settings.mode === 'follow') { pause(); play(); } };

/* ---------- editor wiring ---------- */
let renderQueued = false;
$('script').addEventListener('input', () => {
  const s = current(); s.text = $('script').value; s.updatedAt = now(); scheduleSave(); updateCounts();
  if (!renderQueued) { renderQueued = true; requestAnimationFrame(() => { renderQueued = false; const top = $('scroll-area').scrollTop; renderScript(); $('scroll-area').scrollTop = top; if (playing && settings.mode === 'follow') setFollowTarget(); updateCurrentLine(); }); }
});
$('script-title').addEventListener('input', () => { const s = current(); s.title = $('script-title').value; s.updatedAt = now(); scheduleSave(); });
function applyTextStyle() {
  $('reading-text').style.fontSize = $('font-size').value + 'px';
  $('prompter').style.setProperty('--reading-font-size', Math.round(Number($('font-size').value) * 1.5) + 'px');
  $('speed-value').textContent = $('speed').value; $('fs-speed').textContent = $('speed').value; $('reading-speed').textContent = $('speed').value; $('size-value').textContent = $('font-size').value + ' px';
  layoutDirty = true;
}
for (const id of ['speed', 'font-size', 'mirror']) $(id).addEventListener('input', () => {
  settings.speed = Number($('speed').value); settings.size = Number($('font-size').value); settings.mirror = $('mirror').checked; saveSettings(); applyTextStyle(); applyView();
  if (playing && settings.mode === 'follow') setFollowTarget();
});
// The primary CTA is the moment of performance: leave the editor and start in the
// distraction-free reader. Pause/continue remains available inside that reader.
async function startPerformance() {
  if (playing) { pause(); return; }
  if (!$('script').value.trim()) { toast(t('toast.addScript')); $('script').focus(); return; }
  if (!isFullscreen()) await enterReadingMode();
  play();
}
$('play').onclick = startPerformance; $('reset').onclick = reset;
document.querySelectorAll('[data-template]').forEach(b => b.onclick = () => {
  if (recording) { toast(t('toast.stopFirst')); return; }
  const tpl = templateFor(b.dataset.template);
  const s = current();
  if (s.text.trim()) addScript(tpl.title, tpl.text);
  else { s.title = tpl.title; s.text = tpl.text; s.updatedAt = now(); saveLibrary(); openScript(s.id); }
  toast(t('toast.template'));
});
$('new-script').onclick = () => { addScript(t('script.untitled'), ''); $('script').focus(); };

/* ---------- files: export, import ---------- */
function safeFileName(name) { return name.replace(/[\\/:*?"<>|\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().replace(/^\.+|\.+$/g, '').slice(0, 100) || 'cueprompt-script'; }
function download(blob, name) { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000); }
$('export-script').onclick = () => download(new Blob([$('script').value], { type: 'text/plain;charset=utf-8' }), safeFileName($('script-title').value) + '.txt');
const loadedScripts = {};
function loadScript(src) { return loadedScripts[src] || (loadedScripts[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => { delete loadedScripts[src]; rej(new Error('load ' + src)); }; document.head.append(s); })); }
function markdownToScript(md) {
  return md.replace(/\r\n?/g, '\n')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/gm, '## $1')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*([-*+]|\d+[.)])\s+/gm, '')
    .replace(/^\s*([-*_]\s*){3,}$/gm, '')
    .replace(/(\*\*|__)(.+?)\1/g, '$2').replace(/(^|[^\w*])[*_]([^*_\n]+)[*_](?=[^\w*]|$)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1').replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n').trim();
}
function htmlToScript(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html'); const out = [];
  doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td').forEach(el => {
    if (el.closest('li') && el.tagName !== 'LI') return;
    const text = el.textContent.replace(/\s+/g, ' ').trim(); if (!text) return;
    out.push(/^H\d$/.test(el.tagName) ? '## ' + text : text);
  });
  return out.join('\n\n');
}
async function pdfToScript(buffer) {
  await loadScript('/vendor/pdf.min.js');
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.js';
  const pdf = await window.pdfjsLib.getDocument({ data: buffer, isEvalSupported: false }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent();
    let text = '', lastY = null, lastH = 0;
    for (const item of content.items) {
      if (!('str' in item)) continue;
      const y = item.transform[5], h = Math.abs(item.transform[3]) || lastH || 10;
      if (lastY != null && Math.abs(y - lastY) > 1) {
        const gap = Math.abs(lastY - y);
        text += gap > h * 1.8 ? '\n\n' : (/[\u3000-\u9fff]$/.test(text) || /^[\u3000-\u9fff]/.test(item.str) ? '' : ' ');
      }
      text += item.str; lastY = y; lastH = h;
      if (item.hasEOL) { text += ' '; }
    }
    pages.push(text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim());
  }
  return pages.filter(Boolean).join('\n\n');
}
async function importFile(file) {
  const ext = (file.name.match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
  if (!['txt', 'md', 'markdown', 'docx', 'pdf'].includes(ext)) { toast(t('toast.unsupportedFile')); return; }
  const limit = ext === 'pdf' || ext === 'docx' ? 25 : 2;
  if (file.size > limit * 1024 * 1024) { toast(t('toast.fileTooBig', { n: limit })); return; }
  toast(t('toast.importing'));
  let text = '';
  try {
    if (ext === 'txt') text = await file.text();
    else if (ext === 'md' || ext === 'markdown') text = markdownToScript(await file.text());
    else if (ext === 'docx') { await loadScript('/vendor/mammoth.browser.min.js'); const res = await window.mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() }); text = htmlToScript(res.value); }
    else if (ext === 'pdf') { text = await pdfToScript(await file.arrayBuffer()); if (!text.trim()) { toast(t('toast.pdfEmpty')); return; } }
  } catch (err) { console.warn('Import failed', err); toast(t('toast.importFail')); return; }
  const title = file.name.replace(/\.[^.]+$/, '');
  // PDFs made by Chrome/Word often store CJK as Kangxi/radical code points (e.g. ⽂ U+2F42); fold them to normal ideographs.
  text = text.replace(/[\u2E80-\u2FDF\uF900-\uFAFF]/g, c => c.normalize('NFKC'));
  addScript(title, text.replace(/\r\n?/g, '\n').trim());
  toast(t('toast.imported', { name: title }));
}
$('import-button').onclick = () => $('import-file').click();
$('import-file').onchange = async e => { const file = e.target.files[0]; e.target.value = ''; if (file) await importFile(file); };

/* ---------- library dialog ---------- */
function formatDate(ts) { try { return new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(ts); } catch { return new Date(ts).toLocaleString(); } }
function renderLibrary() {
  const q = $('library-search').value.trim().toLowerCase(), list = $('library-list'); list.textContent = '';
  const items = library.scripts.slice().sort((a, b) => b.updatedAt - a.updatedAt).filter(s => !q || s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q));
  if (!items.length) { const li = document.createElement('li'); li.className = 'lib-empty'; li.textContent = t('lib.empty'); list.append(li); return; }
  for (const s of items) {
    const li = document.createElement('li'); li.className = 'lib-item' + (s.id === library.currentId ? ' is-current' : ''); li.dataset.id = s.id;
    const open = document.createElement('button'); open.className = 'lib-open';
    const title = document.createElement('strong'); title.textContent = s.title || t('script.untitled');
    const meta = document.createElement('span'); const c = countScript(s.text);
    meta.textContent = [s.id === library.currentId ? t('lib.current') : '', t('lib.updated', { date: formatDate(s.updatedAt) }), c.cjk && c.words ? t('count.mixed', { c: c.cjk, w: c.words }) : c.cjk ? t('count.chars', { n: c.cjk }) : t('count.words', { n: c.words })].filter(Boolean).join(' · ');
    open.append(title, meta); open.onclick = () => { openScript(s.id); $('library-dialog').close(); };
    const actions = document.createElement('div'); actions.className = 'lib-actions';
    const act = (label, cls, fn) => { const b = document.createElement('button'); b.textContent = label; b.className = cls; b.onclick = fn; actions.append(b); };
    act(t('lib.rename'), 'act-rename', () => startRename(li, s));
    act(t('lib.duplicate'), 'act-duplicate', () => { const copy = makeScript(t('lib.copy', { name: s.title }), s.text); library.scripts.unshift(copy); saveLibrary(); renderLibrary(); });
    act(t('lib.delete'), 'act-delete danger', () => deleteScript(s));
    li.append(open, actions); list.append(li);
  }
}
function startRename(li, s) {
  const strong = li.querySelector('strong'); const input = document.createElement('input'); input.className = 'lib-rename'; input.value = s.title; input.setAttribute('aria-label', t('lib.rename'));
  strong.replaceWith(input); input.focus(); input.select();
  let done = false;
  const commit = save => { if (done) return; done = true; if (save && input.value.trim()) { s.title = input.value.trim(); s.updatedAt = now(); saveLibrary(); if (s.id === library.currentId) $('script-title').value = s.title; } renderLibrary(); };
  input.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') commit(true); if (e.key === 'Escape') { e.preventDefault(); commit(false); } };
  input.onclick = e => e.stopPropagation();
  input.onblur = () => commit(true);
}
function deleteScript(s) {
  if (!confirm(t('lib.confirmDelete', { name: s.title }))) return;
  library.scripts = library.scripts.filter(x => x.id !== s.id);
  if (!library.scripts.length) library.scripts.push(makeScript(t('script.untitled'), ''));
  if (s.id === library.currentId) { library.currentId = library.scripts[0].id; saveLibrary(); openScript(library.currentId); } else saveLibrary();
  renderLibrary();
}
$('open-library').onclick = () => { $('library-search').value = ''; renderLibrary(); $('library-dialog').showModal(); };
$('close-library').onclick = () => $('library-dialog').close();
$('library-search').oninput = renderLibrary;
$('library-new').onclick = () => { addScript(t('script.untitled'), ''); $('library-dialog').close(); $('script').focus(); };
$('library-export').onclick = () => {
  saveLibrary();
  const data = { app: 'CuePrompt', version: 1, exportedAt: new Date().toISOString(), scripts: library.scripts };
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), 'cueprompt-library-' + new Date().toISOString().slice(0, 10) + '.json');
};
$('library-import').onclick = () => $('library-import-file').click();
$('library-import-file').onchange = async e => {
  const file = e.target.files[0]; e.target.value = ''; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || data.app !== 'CuePrompt' || !Array.isArray(data.scripts)) throw new Error('bad');
    let n = 0;
    for (const raw of data.scripts) {
      if (!raw || typeof raw.text !== 'string') continue;
      const s = { id: String(raw.id || uid()), title: String(raw.title || t('script.untitled')).slice(0, 200), text: raw.text, createdAt: Number(raw.createdAt) || now(), updatedAt: Number(raw.updatedAt) || now() };
      const existing = library.scripts.find(x => x.id === s.id);
      if (existing) { if (s.updatedAt > existing.updatedAt) { Object.assign(existing, s); n++; } }
      else { library.scripts.push(s); n++; }
    }
    saveLibrary(); renderLibrary(); openScript(library.currentId); toast(t('lib.imported', { n }));
  } catch { toast(t('lib.badBackup')); }
};

/* ---------- fullscreen (native or pseudo) ---------- */
const isFullscreen = () => $('prompter').classList.contains('is-fullscreen');
function nativeFullscreenElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
function setFullscreenState(on, pseudo) { const p = $('prompter'); p.classList.toggle('is-fullscreen', on); p.classList.toggle('pseudo-fullscreen', on && pseudo); document.body.classList.toggle('pseudo-fullscreen-open', on && pseudo); $('fullscreen').setAttribute('aria-label', on ? t('fs.exit') : t('fs.toggle')); layoutDirty = true; showControls(); requestAnimationFrame(() => { if (playing && settings.mode === 'follow') setFollowTarget(); }); }
async function fullscreen() {
  const p = $('prompter');
  try {
    if (nativeFullscreenElement()) { await (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (p.classList.contains('pseudo-fullscreen')) { setFullscreenState(false, true); return; }
    const request = p.requestFullscreen || p.webkitRequestFullscreen;
    if (request) { await request.call(p); return; }
  } catch { }
  setFullscreenState(true, true);
}
async function enterReadingMode() {
  if (!$('script').value.trim()) { toast(t('toast.addScript')); $('script').focus(); return; }
  await fullscreen();
  requestAnimationFrame(() => { measure(); updateCurrentLine(); });
}
for (const ev of ['fullscreenchange', 'webkitfullscreenchange']) document.addEventListener(ev, () => setFullscreenState(!!nativeFullscreenElement(), false));
let hideTimer;
function scheduleHide() { clearTimeout(hideTimer); $('prompter').classList.remove('controls-hidden'); if (playing && isFullscreen()) hideTimer = setTimeout(() => $('prompter').classList.add('controls-hidden'), 2500); }
function showControls() { scheduleHide(); }
$('prompter').addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && isFullscreen()) showControls(); });
$('scroll-area').addEventListener('click', () => { if (isFullscreen()) play(); });
$('scroll-area').addEventListener('scroll', () => { if (!playing) { scrollPosition = $('scroll-area').scrollTop; updateCurrentLine(); } });
$('fs-play').onclick = () => play();
$('fs-exit').onclick = fullscreen;
$('reading-play').onclick = () => play();
$('reading-exit').onclick = fullscreen;
$('enter-reading').onclick = enterReadingMode;
$('reading-smaller-text').onclick = () => { $('font-size').value = Math.max(22, Number($('font-size').value) - 2); $('font-size').dispatchEvent(new Event('input')); showControls(); };
$('reading-larger-text').onclick = () => { $('font-size').value = Math.min(64, Number($('font-size').value) + 2); $('font-size').dispatchEvent(new Event('input')); showControls(); };
function nudgeSpeed(delta) { $('speed').value = Number($('speed').value) + delta; settings.speed = Number($('speed').value); saveSettings(); applyTextStyle(); showControls(); }
$('fs-slower').onclick = () => nudgeSpeed(-5); $('fs-faster').onclick = () => nudgeSpeed(5);
$('reading-slower').onclick = () => nudgeSpeed(-5); $('reading-faster').onclick = () => nudgeSpeed(5);
$('fullscreen').onclick = fullscreen;

/* ---------- camera & recording ---------- */
let stream = null, recorder = null, chunks = [], recording = false, recStartedAt = 0, countdownActive = null, take = null;
function setTab(camera) { $('camera-tab').classList.toggle('active', camera); $('prompt-tab').classList.toggle('active', !camera); $('prompter').classList.toggle('camera-on', camera && !!stream); }
function videoConstraints() {
  const v = {};
  if (settings.camera) v.deviceId = { exact: settings.camera }; else v.facingMode = 'user';
  if (settings.resolution === '720') { v.width = { ideal: 1280 }; v.height = { ideal: 720 }; }
  if (settings.resolution === '1080') { v.width = { ideal: 1920 }; v.height = { ideal: 1080 }; }
  return v;
}
async function openCamera() {
  if (stream) stream.getTracks().forEach(tr => tr.stop());
  stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints(), audio: settings.mic ? { deviceId: { exact: settings.mic } } : true });
  $('camera').srcObject = stream; $('camera').style.display = 'block';
  $('camera').classList.toggle('mirrored', settings.mirrorCamera);
  await fillDevices();
}
async function fillDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  const devices = await navigator.mediaDevices.enumerateDevices();
  for (const [sel, kind, key] of [[$('camera-select'), 'videoinput', 'camera'], [$('mic-select'), 'audioinput', 'mic']]) {
    sel.textContent = ''; sel.append(new Option(t('rec.default'), ''));
    devices.filter(d => d.kind === kind && d.deviceId && d.deviceId !== 'default').forEach((d, i) => sel.append(new Option(d.label || (kind === 'videoinput' ? t('rec.camera') : t('rec.mic')) + ' ' + (i + 1), d.deviceId)));
    sel.value = [...sel.options].some(o => o.value === settings[key]) ? settings[key] : '';
  }
}
$('camera-tab').onclick = async () => {
  if (stream) { setTab(true); $('camera').style.display = 'block'; $('record').hidden = false; return; }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { toast(t('toast.camUnsupported')); return; }
  setTab(true); $('camera-notice').hidden = false; $('camera-notice').textContent = t('cam.allow');
  try { await openCamera(); $('record').hidden = false; $('camera-notice').hidden = true; setTab(true); updateRecordUI(); $('recording-options').open = true; toast(t('toast.camReady')); }
  catch (err) { stream = null; setTab(false); $('camera-notice').textContent = t('cam.unavailable'); toast(t('toast.camFail')); }
};
function closeCamera() { if (stream) { stream.getTracks().forEach(tr => tr.stop()); stream = null; } $('camera').srcObject = null; $('camera').style.display = 'none'; $('record').hidden = true; $('camera-notice').hidden = true; setTab(false); updateRecordUI(); }
$('prompt-tab').onclick = () => { if (recording || countdownActive) { toast(t('toast.stopFirst')); return; } closeCamera(); };
async function reopenIfOpen() { if (stream && !recording) { try { await openCamera(); setTab(true); } catch { toast(t('toast.camFail')); } } }
$('camera-select').onchange = () => { settings.camera = $('camera-select').value; saveSettings(); reopenIfOpen(); };
$('mic-select').onchange = () => { settings.mic = $('mic-select').value; saveSettings(); reopenIfOpen(); };
$('resolution').onchange = () => { settings.resolution = $('resolution').value; saveSettings(); reopenIfOpen(); };
$('rec-format').onchange = () => { settings.format = $('rec-format').value; saveSettings(); };
$('countdown-toggle').onchange = () => { settings.countdown = $('countdown-toggle').checked; saveSettings(); };
$('mirror-camera').onchange = () => { settings.mirrorCamera = $('mirror-camera').checked; saveSettings(); $('camera').classList.toggle('mirrored', settings.mirrorCamera); };
function pickMimeType() {
  const mp4 = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4'], webm = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const order = settings.format === 'webm' ? webm.concat(mp4) : mp4.concat(webm);
  return order.find(type => { try { return MediaRecorder.isTypeSupported(type); } catch { return false; } });
}
function runCountdown(seconds) {
  return new Promise(resolve => {
    const el = $('countdown'); let n = seconds; el.hidden = false; el.textContent = n;
    const timer = setInterval(() => { n--; if (n <= 0) { finish(true); } else el.textContent = n; }, 1000);
    const finish = ok => { clearInterval(timer); el.hidden = true; countdownActive = null; resolve(ok); };
    countdownActive = () => finish(false);
  });
}
async function startRecording() {
  if (!stream) return;
  if (!$('script').value.trim()) { toast(t('toast.addScript')); $('script').focus(); return; }
  reset();
  $('record').textContent = '■ ' + t('record.stop');
  if (settings.countdown && !(await runCountdown(3))) { $('record').textContent = '● ' + t('record.start'); return; }
  try {
    const type = pickMimeType();
    recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined); chunks = [];
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => { const mime = recorder.mimeType || type || 'video/webm'; openReview(new Blob(chunks, { type: mime }), mime, (performance.now() - recStartedAt) / 1000); };
    recorder.onerror = () => { recording = false; updateRecordUI(); toast(t('toast.recFail')); };
    recorder.start(1000); recording = true; recStartedAt = performance.now(); updateRecordUI();
    play();
  } catch { recording = false; updateRecordUI(); toast(t('toast.recUnavailable')); }
}
function stopRecording() { if (recorder && recorder.state !== 'inactive') recorder.stop(); recording = false; updateRecordUI(); pause(); }
function updateRecordUI() { $('record').textContent = recording ? '■ ' + t('record.stop') : '● ' + t('record.start'); $('rec-dot').hidden = !recording; $('prompter').classList.toggle('is-recording', recording); $('reading-record').hidden = !stream; $('reading-record').textContent = recording ? '■ STOP' : '● REC'; }
$('record').onclick = () => { if (countdownActive) { countdownActive(); return; } if (recording) { stopRecording(); return; } startRecording(); };
$('reading-record').onclick = () => $('record').click();
function openReview(blob, mime, seconds) {
  if (take) URL.revokeObjectURL(take.url);
  take = { blob, mime, url: URL.createObjectURL(blob), downloaded: false, ext: mime.includes('mp4') ? 'mp4' : 'webm' };
  $('review-video').src = take.url;
  $('review-meta').textContent = formatTime(seconds) + ' · ' + (blob.size / 1048576).toFixed(1) + ' MB · ' + take.ext.toUpperCase();
  $('review-dialog').showModal();
}
function closeReview(force) {
  if (take && !take.downloaded && !force && !confirm(t('review.confirmDiscard'))) return false;
  $('review-video').pause(); $('review-video').removeAttribute('src'); $('review-video').load();
  if (take) { URL.revokeObjectURL(take.url); take = null; }
  $('review-dialog').close(); return true;
}
$('review-download').onclick = () => { if (!take) return; download(take.blob, safeFileName('cueprompt-' + ($('script-title').value || 'take')) + '-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.' + take.ext); take.downloaded = true; toast(t('toast.downloaded')); };
$('review-retake').onclick = () => { if (closeReview(true)) startRecording(); };
$('review-discard').onclick = () => closeReview(false);
$('close-review').onclick = () => closeReview(false);
$('review-dialog').addEventListener('cancel', e => { e.preventDefault(); closeReview(false); });

/* ---------- AI writer (bring your own key) ---------- */
const AI_PRESETS = {
  dashscope: { base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', protocol: 'openai' },
  dashscopeIntl: { base: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', protocol: 'openai' },
  deepseek: { base: 'https://api.deepseek.com', model: 'deepseek-flash', protocol: 'openai' },
  openai: { base: 'https://api.openai.com/v1', model: 'gpt-4.1-mini', protocol: 'openai' },
  anthropic: { base: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-5', protocol: 'anthropic' }
};
const aiPresetOrder = ['openai', 'anthropic', 'deepseek', 'dashscope', 'dashscopeIntl', 'custom'];
const aiPresetSelect = $('ai-preset');
for (const value of aiPresetOrder) {
  const option = aiPresetSelect.querySelector(`option[value="${value}"]`);
  if (option) aiPresetSelect.append(option);
}
const ai = Object.assign({ base: AI_PRESETS.dashscope.base, model: 'qwen-plus', key: '', protocol: 'openai' }, store.get('cueprompt-ai', {}));
const AI_LANGS = [['English', 'English'], ['Simplified Chinese', '简体中文'], ['Traditional Chinese', '繁體中文'], ['Spanish', 'Español'], ['Portuguese', 'Português'], ['French', 'Français'], ['German', 'Deutsch'], ['Italian', 'Italiano'], ['Japanese', '日本語'], ['Korean', '한국어'], ['Russian', 'Русский'], ['Arabic', 'العربية'], ['Hindi', 'हिन्दी'], ['Indonesian', 'Bahasa Indonesia'], ['Vietnamese', 'Tiếng Việt'], ['Thai', 'ไทย'], ['Turkish', 'Türkçe'], ['Dutch', 'Nederlands'], ['Polish', 'Polski']];
const UI_TO_AI = { en: 'English', 'zh-CN': 'Simplified Chinese', 'zh-TW': 'Traditional Chinese', es: 'Spanish', pt: 'Portuguese', fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', id: 'Indonesian', vi: 'Vietnamese', th: 'Thai' };
let aiTab = 'generate';
function fillAiLanguages() {
  for (const sel of document.querySelectorAll('.ai-lang-select')) { const v = sel.value; sel.textContent = ''; for (const [en, native] of AI_LANGS) sel.append(new Option(native, en)); sel.value = v || UI_TO_AI[lang] || 'English'; }
  if (!$('ai-target').dataset.touched) $('ai-target').value = lang === 'en' ? 'Simplified Chinese' : 'English';
}
$('ai-target').onchange = () => { $('ai-target').dataset.touched = '1'; };
function openAi() {
  $('ai-base').value = ai.base; $('ai-model').value = ai.model; $('ai-key').value = ai.key; $('ai-preset').value = presetFor(ai.base);
  $('ai-connection').open = !ai.key; $('ai-error').hidden = true;
  $('ai-dialog').showModal();
}
function saveAi() { ai.base = $('ai-base').value.trim(); ai.model = $('ai-model').value.trim(); ai.key = $('ai-key').value.trim(); ai.protocol = AI_PRESETS[$('ai-preset').value]?.protocol || 'openai'; store.set('cueprompt-ai', ai); }
for (const id of ['ai-base', 'ai-model', 'ai-key']) $(id).addEventListener('change', saveAi);
function presetFor(base) { return Object.entries(AI_PRESETS).find(([, p]) => p.base === base)?.[0] || 'custom'; }
$('ai-preset').onchange = () => { const v = $('ai-preset').value, preset = AI_PRESETS[v]; if (!preset) { if (presetFor($('ai-base').value) !== 'custom') $('ai-base').value = ''; $('ai-base').focus(); } else { $('ai-base').value = preset.base; $('ai-model').value = preset.model; } saveAi(); };
$('ai-base').addEventListener('input', () => { $('ai-preset').value = presetFor($('ai-base').value.trim()); });
$('ai-forget').onclick = () => { $('ai-key').value = ''; saveAi(); };
$('ai-button').onclick = openAi; $('close-ai').onclick = () => $('ai-dialog').close();
document.querySelectorAll('[data-ai-tab]').forEach(b => b.onclick = () => {
  aiTab = b.dataset.aiTab;
  document.querySelectorAll('[data-ai-tab]').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('[data-ai-pane]').forEach(p => p.hidden = p.dataset.aiPane !== aiTab);
});
$('ai-rewrite-mode').onchange = () => { $('ai-instruction-wrap').hidden = $('ai-rewrite-mode').value !== 'custom'; };
const AI_SYSTEM = "You are a scriptwriter for teleprompter videos and talks. Write words meant to be spoken aloud: short sentences, a natural rhythm and short paragraphs separated by blank lines. You may start sections with '## ' headings and add [pause] where a pause helps the delivery. Output only the script itself: no title line, no explanations, no other markdown.";
const CJK_AI = ['Simplified Chinese', 'Traditional Chinese', 'Japanese'];
function aiMessages() {
  const script = $('script').value.trim();
  if (aiTab === 'generate') {
    const topic = $('ai-topic').value.trim(); if (!topic) throw new Error(t('ai.needTopic'));
    const minutes = Math.min(20, Math.max(0.5, Number($('ai-duration').value) || 1)), language = $('ai-language').value, tone = $('ai-tone').value;
    const size = CJK_AI.includes(language) ? Math.round(minutes * 250) + ' characters' : Math.round(minutes * 150) + ' words';
    return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Write a ${tone} teleprompter script in ${language} about:\n${topic}\n\nTarget length: about ${minutes} minute(s) when spoken, roughly ${size}.` }];
  }
  if (!script) throw new Error(t('ai.needScript'));
  if (aiTab === 'rewrite') {
    const mode = $('ai-rewrite-mode').value;
    const instruction = { shorter: 'Make it about 30% shorter while keeping the key message.', conversational: 'Make it sound more natural and conversational, as if talking to one person.', clearer: 'Make it clearer and easier to follow, with simpler sentences.' }[mode] || $('ai-instruction').value.trim() || 'Improve it.';
    return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Rewrite the following teleprompter script. ${instruction} Keep the same language. Keep '## ' headings and [pause]/[slow] markers where they still make sense.\n\nSCRIPT:\n${script}` }];
  }
  return [{ role: 'system', content: AI_SYSTEM }, { role: 'user', content: `Translate the following teleprompter script into ${$('ai-target').value}. Make it sound natural when spoken. Keep '## ' headings and keep [pause]/[slow] markers in place with the bracket keywords in English.\n\nSCRIPT:\n${script}` }];
}
$('ai-run').onclick = async () => {
  saveAi(); const err = $('ai-error'); err.hidden = true;
  const fail = msg => { err.textContent = msg; err.hidden = false; };
  if (!ai.base || !ai.model || !ai.key) { $('ai-connection').open = true; fail(t('ai.needKey')); return; }
  let messages; try { messages = aiMessages(); } catch (e) { fail(e.message); return; }
  const btn = $('ai-run'); btn.disabled = true; btn.lastElementChild.textContent = t('ai.running');
  try {
    let res;
    try {
      if (ai.protocol === 'anthropic') {
        const system = messages.find(m => m.role === 'system')?.content || '';
        const userMessages = messages.filter(m => m.role !== 'system');
        res = await fetch(ai.base.replace(/\/+$/, '') + '/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ai.key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: ai.model, system, messages: userMessages, max_tokens: 2400, temperature: 0.7 }) });
      } else {
        res = await fetch(ai.base.replace(/\/+$/, '') + '/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ai.key }, body: JSON.stringify({ model: ai.model, messages, temperature: 0.7 }) });
      }
    }
    catch { fail(ai.protocol === 'anthropic' ? 'Claude’s direct API blocks browser requests. Use a CORS-enabled proxy as the Base URL, or choose another provider.' : t('ai.errorCors')); return; }
    let data = null; try { data = await res.json(); } catch { }
    if (!res.ok) { fail(t('ai.errorHttp', { msg: (data && (data.error?.message || data.message)) || res.status + ' ' + res.statusText })); return; }
    let text = ai.protocol === 'anthropic' ? (data?.content || []).filter(part => part.type === 'text').map(part => part.text).join('\n') : (data?.choices?.[0]?.message?.content || '');
    text = text.replace(/^```[a-z]*\n?|```\s*$/g, '').trim();
    if (!text) { fail(t('ai.empty')); return; }
    $('ai-result').value = text; $('ai-result-wrap').hidden = false;
  } finally { btn.disabled = false; btn.lastElementChild.textContent = t('ai.run'); }
};
$('ai-replace').onclick = () => { const s = current(); s.text = $('ai-result').value; s.updatedAt = now(); saveLibrary(); openScript(s.id); $('ai-dialog').close(); };
$('ai-new').onclick = () => { const first = $('ai-result').value.split('\n').find(l => l.trim()) || t('script.untitled'); addScript(first.replace(/^#+\s*/, '').slice(0, 60), $('ai-result').value); $('ai-dialog').close(); };

/* ---------- help & keyboard ---------- */
$('help').onclick = () => $('help-dialog').showModal(); $('close-help').onclick = () => $('help-dialog').close();
function feedbackEmailBody() {
  const message = $('feedback-message').value.trim();
  const ja = document.documentElement.lang === 'ja';
  if (!message) { toast(ja ? '送信前にフィードバックを入力してください。' : 'Please add your feedback before sending.'); $('feedback-message').focus(); return null; }
  const lines = [
    'Feedback type: ' + $('feedback-type').value,
    '',
    message,
    '',
    'Reply email: ' + ($('feedback-email').value.trim() || 'Not provided')
  ];
  if ($('feedback-context').checked) {
    lines.push('', 'Technical context (shared by choice):', 'Page: ' + location.href, 'Browser: ' + navigator.userAgent);
  }
  return lines.join('\n');
}
$('feedback-button').onclick = () => $('feedback-dialog').showModal();
$('close-feedback').onclick = () => $('feedback-dialog').close();
$('feedback-send').onclick = () => {
  const body = feedbackEmailBody(); if (!body) return;
  const subject = '[CuePrompt feedback] ' + $('feedback-type').value;
  location.href = 'mailto:support@cueprompt.io?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  toast(document.documentElement.lang === 'ja' ? 'フィードバックを入力したメールアプリが開きます。' : 'Your email app should open with your feedback ready to send.');
};
for (const d of document.querySelectorAll('dialog')) d.addEventListener('click', e => { if (e.target === d && d.id !== 'review-dialog') d.close(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('prompter').classList.contains('pseudo-fullscreen')) { setFullscreenState(false, true); return; }
  if (e.key === 'Escape' && !$('sections-menu').hidden) { toggleSections(false); return; }
  if (['INPUT', 'TEXTAREA', 'BUTTON', 'SUMMARY', 'SELECT'].includes(e.target.tagName) || document.querySelector('dialog[open]')) return;
  const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); play(); }
  else if (k === 'r') reset();
  else if (k === 'f') fullscreen();
  else if (k === 'm') setMode(settings.mode === 'follow' ? 'steady' : 'follow');
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); nudgeSpeed(e.key === 'ArrowUp' ? 5 : -5); }
});
window.addEventListener('pagehide', () => { stream?.getTracks().forEach(tr => tr.stop()); stopFollow(); saveLibrary(); });

/* ---------- reading view options ---------- */
const viewDefaults = { textColor: '#e7ecdf', backgroundColor: '#1c241f', readingWidth: '100', lineSpacing: '1.6', mirrorVertical: false, readingGuide: true, highlight: true };
const view = Object.assign({}, viewDefaults, store.get('cueprompt-view', {}));
const viewFields = { 'text-color': 'textColor', 'background-color': 'backgroundColor', 'reading-width': 'readingWidth', 'line-spacing': 'lineSpacing', 'mirror-vertical': 'mirrorVertical', 'reading-guide': 'readingGuide', 'highlight-line': 'highlight' };
function applyView() {
  const rt = $('reading-text');
  rt.style.color = view.textColor; $('prompter').style.backgroundColor = view.backgroundColor;
  rt.style.width = view.readingWidth + '%'; rt.style.margin = '0 auto'; rt.style.lineHeight = view.lineSpacing;
  $('prompter-stage').style.transform = `scale(${$('mirror').checked ? -1 : 1},${view.mirrorVertical ? -1 : 1})`;
  document.querySelector('.reading-line').hidden = !view.readingGuide; document.querySelector('.reading-arrow').hidden = !view.readingGuide;
  rt.classList.toggle('highlight', !!view.highlight);
  layoutDirty = true; store.set('cueprompt-view', view);
}
for (const [id, key] of Object.entries(viewFields)) { const el = $(id); if (el.type === 'checkbox') el.checked = view[key]; else el.value = view[key]; el.addEventListener('input', () => { view[key] = el.type === 'checkbox' ? el.checked : el.value; applyView(); }); }

/* ---------- language switching ---------- */
function applyI18n() {
  const meta = I18N.languages.find(l => l.code === lang) || I18N.languages[0];
  document.documentElement.lang = lang; document.documentElement.dir = meta.dir || 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  // SEO metadata belongs to the static locale document. Changing UI copy
  // must not make title/description disagree with its canonical URL.
  $('enter-reading').lastChild.textContent = ' ' + readingUi('start');
  document.querySelector('.reading-console-title small').textContent = readingUi('mode');
  $('ui-language').value = lang;
  updateCounts(); syncPlayUI(); setModeLabel(modeKey); updateRecordUI(); saveLibrary(); fillAiLanguages(); renderSections();
  const st = $('follow-status'); if (st.dataset.key && st.dataset.key !== 'follow.status.heard') setFollowStatus(st.dataset.key, null, st.classList.contains('error'));
  if (!$('script').value.trim()) renderScript();
  if ($('library-dialog').open) renderLibrary();
  $('fullscreen').setAttribute('aria-label', isFullscreen() ? t('fs.exit') : t('fs.toggle'));
}
async function setLanguage(code, persist) {
  if (!I18N.languages.some(l => l.code === code)) code = 'en';
  try { dict = await I18N.load(code); lang = code; } catch { dict = I18N.dicts.en; lang = 'en'; }
  if (persist) {
    settings.uiLang = lang; saveSettings();
    const path = (I18N.languages.find(l => l.code === lang) || {}).path || '/';
    // Each locale has a crawlable, pre-rendered URL. Navigate to it instead of
    // merely changing the address bar so visitors and search engines see the
    // same language-specific document, canonical URL, and hreflang set.
    if (location.pathname !== path && /^\/([a-z]{2}(-[a-z]{2})?\/)?$/.test(location.pathname)) {
      location.assign(path + location.hash);
      return;
    }
  }
  applyI18n();
  if (!settings.speechLang) $('speech-language').value = speechLang();
}
function fillLanguagePicker() { const sel = $('ui-language'); sel.textContent = ''; for (const l of I18N.languages) sel.append(new Option(l.name, l.code)); }
$('ui-language').onchange = () => setLanguage($('ui-language').value, true);

/* ---------- boot ---------- */
(async function boot() {
  fillLanguagePicker();
  $('speed').value = settings.speed; $('font-size').value = settings.size; $('mirror').checked = settings.mirror;
  $('resolution').value = settings.resolution; $('rec-format').value = settings.format; $('countdown-toggle').checked = settings.countdown; $('mirror-camera').checked = settings.mirrorCamera;
  const pageLang = document.documentElement.dataset.locale || 'en';
  // Explicit locale paths win. On a first visit to /, use the browser's
  // preferred language and navigate to its pre-rendered static document.
  const initial = pageLang !== 'en' ? pageLang : (settings.uiLang || detectLanguage());
  if (pageLang === 'en' && location.pathname === '/' && initial !== 'en') {
    const target = I18N.languages.find(l => l.code === initial);
    if (target) { location.replace(target.path + location.hash); return; }
  }
  lang = initial; dict = I18N.dicts[initial] || I18N.dicts.en;
  initLibrary();
  $('script').value = current().text; $('script-title').value = current().title;
  fillSpeechLanguages(); fillAiLanguages();
  applyView(); renderScript();
  await setLanguage(initial, false);
  setMode(settings.mode === 'follow' && SpeechRec ? 'follow' : 'steady', true);
  if (!SpeechRec) $('mode-follow').classList.add('unsupported');
  reset();
  document.documentElement.classList.add('app-ready');
  try {
    const incoming = JSON.parse(sessionStorage.getItem('cueprompt-incoming') || 'null');
    if (incoming && typeof incoming.text === 'string' && incoming.text.trim()) {
      addScript(String(incoming.title || t('script.untitled')).slice(0, 200), incoming.text);
      sessionStorage.removeItem('cueprompt-incoming');
      if (incoming.refine) { openAi(); document.querySelector('[data-ai-tab="rewrite"]').click(); }
      if (incoming.read) setTimeout(() => startPerformance(), 80);
    }
  } catch { /* Existing scripts remain available if handoff storage is unavailable. */ }
  const creatorLinks = document.createElement('div');
  creatorLinks.className = 'creator-links';
  creatorLinks.innerHTML = '<a href="/script-templates/">Script builder ↗</a><a href="/script-extractor/">Transcript cleaner ↗</a><a href="/publishing-assistant/">Publishing assistant ↗</a>';
  document.querySelector('.template-box').after(creatorLinks);
  document.querySelectorAll('[data-open-camera]').forEach(link => link.addEventListener('click', () => {
    setTimeout(() => $('camera-tab').click(), 80);
  }));
  const videoLink = document.createElement('a'); videoLink.href = '/video-converter/'; videoLink.textContent = 'Video compressor ↗'; creatorLinks.append(videoLink);
  const publishButton = document.createElement('button'); publishButton.className = 'ghost-button'; publishButton.textContent = 'Prepare publishing copy →';
  publishButton.onclick = async () => {
    try { await CueWorkflow.save('publish', {title:$('script-title').value, text:$('script').value}); location.href = '/publishing-assistant/'; }
    catch { toast('Could not transfer the draft. Download or copy your script first.'); }
  };
  creatorLinks.append(publishButton);
  const processButton = document.createElement('button'); processButton.className = 'ghost-button'; processButton.textContent = 'Compress / convert →';
  processButton.onclick = async () => {
    if (!take) return;
    processButton.disabled = true;
    try {
      await CueWorkflow.save('recording', {blob:take.blob, title:$('script-title').value, createdAt:Date.now()});
      await CueWorkflow.save('publish', {title:$('script-title').value, text:$('script').value});
      location.href = '/video-converter/';
    } catch { toast('Could not save this take for processing. Download it first, then open Video compressor.'); }
    finally { processButton.disabled = false; }
  };
  $('review-download').after(processButton);
})();
