'use strict';
(async () => {
  const $ = id => document.getElementById(id), W = window.CueWorkflow;
  const isJapanese = document.documentElement.lang === 'ja';
  const isKorean = document.documentElement.lang === 'ko';
  const koMessages = {
    'Cancelled. Your editable draft is unchanged.': '작업을 취소했습니다. 편집 중인 초안은 그대로입니다.',
    'Processing failed. Try a smaller file.': '처리에 실패했습니다. 더 작은 파일로 다시 시도하세요.',
    'Page imported. Review quotes, headings and copyright before reading or publishing.': '페이지를 가져왔습니다. 읽거나 게시하기 전에 인용문, 제목, 저작권을 확인하세요.',
    'This site does not allow browser access (CORS). Copy the text and paste it above instead.': '이 사이트는 브라우저 접근(CORS)을 허용하지 않습니다. 내용을 복사해 위에 붙여넣으세요.',
    'No readable article text was found. Copy the transcript or page text and paste it above instead.': '읽을 수 있는 본문을 찾지 못했습니다. 녹취록이나 페이지 내용을 복사해 위에 붙여넣으세요.',
    'Use an HTTPS service endpoint.': 'HTTPS 서비스 주소를 사용하세요.',
    'Do not embed credentials in the URL.': 'URL에 인증 정보를 넣지 마세요.'
  };
  const message = text => { $('status').textContent = isKorean ? (koMessages[text] || text) : text; };
  // Injected fields cannot use the build-time labels, so the custom file
  // control carries its own runtime copy per page locale.
  const fileUi = {
    en: ['Choose file', 'No file selected'], 'zh-CN': ['选择文件', '未选择任何文件'], 'zh-TW': ['選擇檔案', '未選擇任何檔案'],
    ja: ['ファイルを選択', 'ファイルが選択されていません'], ko: ['파일 선택', '선택된 파일 없음'],
    es: ['Elegir archivo', 'Ningún archivo seleccionado'], pt: ['Escolher arquivo', 'Nenhum arquivo selecionado'],
    fr: ['Choisir un fichier', 'Aucun fichier choisi'], de: ['Datei auswählen', 'Keine Datei ausgewählt'],
    ru: ['Выбрать файл', 'Файл не выбран'], ar: ['اختيار ملف', 'لم يتم اختيار أي ملف'],
    hi: ['फ़ाइल चुनें', 'कोई फ़ाइल चुनी नहीं गई'], id: ['Pilih file', 'Tidak ada file yang dipilih'],
    vi: ['Chọn tệp', 'Không có tệp nào được chọn'], th: ['เลือกไฟล์', 'ไม่ได้เลือกไฟล์ไว้'],
  }[document.documentElement.lang] || ['Choose file', 'No file selected'];
  const fileField = (id, accept) => `<span class="file-field"><input id="${id}" type="file" accept="${accept}" hidden><button type="button" id="${id}-button">${fileUi[0]}</button><span id="${id}-name" class="file-name">${fileUi[1]}</span></span>`;
  const inject = (target, html) => target.insertAdjacentHTML('beforeend', html);
  const titleOf = file => file.name.replace(/\.[^.]+$/, '');
  const result = (title, text) => { $('result-title').value = title; $('result').value = text; };
  let busy = false, stop = null;
  async function job(button, fn) {
    if (busy) return; busy = true; button.disabled = true; $('cancel-job').hidden = false;
    try { await fn(); } catch (e) { message(e.name === 'AbortError' ? 'Cancelled. Your editable draft is unchanged.' : e.message || 'Processing failed. Try a smaller file.'); }
    finally { busy = false; button.disabled = false; $('cancel-job').hidden = true; stop = null; }
  }
  inject($('status').parentElement, `<button id="cancel-job" hidden>${isKorean ? '처리 취소' : 'Cancel processing'}</button>`);
  $('cancel-job').onclick = () => stop?.();
  // A typed endpoint is explicit: files are sent only by the user's upload action.
  function endpoint(id) { const u = new URL($(id).value); if (u.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(u.hostname)) throw new Error('Use an HTTPS service endpoint.'); if (u.username || u.password) throw new Error('Do not embed credentials in the URL.'); return u.href; }
  if ($('transcript')) {
    document.querySelector('.hint').textContent = 'Paste a YouTube transcript or import TXT, MD, SRT or VTT (up to 5 MB). For public webpages, pictures and recordings, use the import options below.';
    inject(document.querySelector('.card'), `<details open><summary>Public webpage → editable draft</summary><label>Public page URL<input id="source-url" type="url" placeholder="https://example.com/article"></label><p class="hint">Reads a publicly accessible page in your browser only. The page must allow browser access (CORS). YouTube transcript fetching is blocked by YouTube; use its transcript panel, then paste the text above.</p><button id="import-url">Import readable page</button></details><details><summary>Image → text · local OCR</summary><label>Image${fileField('ocr-file', 'image/png,image/jpeg,image/webp')}</label><label>Text language<select id="ocr-language"><option value="eng">English</option><option value="chi_sim+eng">简体中文 + English</option></select></label><p class="hint">JPG, PNG or WebP, up to 10 MB. Printed text works best. Recognition runs on this device.</p><button id="ocr">Extract text from image</button></details><details><summary>Audio / video → transcript</summary><label>Recording${fileField('speech-file', 'audio/*,video/*')}</label><label>Transcript language<select id="speech-language"><option value="">Auto-detect</option><option value="en">English</option><option value="zh">Chinese</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option><option value="ko">Korean</option></select></label><label>Transcription endpoint<input id="speech-endpoint" type="url" placeholder="https://your-provider.example/v1/audio/transcriptions"></label><label>Model<input id="speech-model" placeholder="Model supported by your provider"></label><label>API key (kept in this tab only)<input id="speech-key" type="password" autocomplete="off"></label><label><input id="speech-consent" type="checkbox"> Send the selected recording to this service for transcription. Provider charges may apply.</label><p class="hint">Up to 25 MB. Requires a multipart transcription API with browser access (CORS). The file is sent only after you confirm this checkbox. Ask your provider for a verbose JSON response to enable precise SRT captions.</p><button id="transcribe">Upload & transcribe</button></details>`);
    if (isJapanese) {
      const translations = {
        'Paste a YouTube transcript or import TXT, MD, SRT or VTT (up to 5 MB). For public webpages, pictures and recordings, use the import options below.': 'YouTube の文字起こしを貼り付けるか、TXT、MD、SRT、VTT（最大 5 MB）を読み込んでください。公開 Web ページ、画像、録画には下の読み込み機能を使えます。',
        'Public webpage → editable draft': '公開 Web ページ → 編集できる下書き', 'Public page URL': '公開ページ URL', 'Import readable page': '読みやすいページを読み込む',
        'Image → text · local OCR': '画像 → テキスト・ローカル OCR', 'Image': '画像', 'Text language': '文字の言語', 'Extract text from image': '画像からテキストを抽出',
        'Audio / video → transcript': '音声・動画 → 文字起こし', 'Recording': '録画ファイル', 'Transcript language': '文字起こしの言語', 'Auto-detect': '自動検出',
        'Transcription endpoint': '文字起こしエンドポイント', 'Model': 'モデル', 'API key (kept in this tab only)': 'API キー（このタブ内のみ）', 'Upload & transcribe': 'アップロードして文字起こし',
        'English': '英語', 'Chinese': '中国語', 'Spanish': 'スペイン語', 'French': 'フランス語', 'German': 'ドイツ語', 'Japanese': '日本語', 'Korean': '韓国語',
        'Paste your transcript or subtitle contents here': '文字起こしまたは字幕の内容をここに貼り付けてください'
      };
      const card = document.querySelector('.card');
      for (const [source, target] of Object.entries(translations).sort((a, b) => b[0].length - a[0].length)) card.innerHTML = card.innerHTML.split(source).join(target);
    }
    if (isKorean) {
      const translations = {
        'Paste a YouTube transcript or import TXT, MD, SRT or VTT (up to 5 MB). For public webpages, pictures and recordings, use the import options below.': 'YouTube 녹취록을 붙여넣거나 TXT, MD, SRT, VTT 파일(최대 5 MB)을 가져오세요. 공개 웹페이지, 이미지, 녹화 파일은 아래 기능을 이용하세요.',
        'Reads a publicly accessible page in your browser only. The page must allow browser access (CORS). YouTube transcript fetching is blocked by YouTube; use its transcript panel, then paste the text above.': '공개 페이지를 브라우저에서만 읽습니다. 해당 페이지가 브라우저 접근(CORS)을 허용해야 합니다. YouTube 녹취록은 직접 가져올 수 없으므로 동영상의 녹취록을 복사해 위에 붙여넣으세요.',
        'JPG, PNG or WebP, up to 10 MB. Printed text works best. Recognition runs on this device.': 'JPG, PNG, WebP 파일(최대 10 MB). 인쇄된 글자를 가장 잘 인식하며 이 기기에서 처리됩니다.',
        'Up to 25 MB. Requires a multipart transcription API with browser access (CORS). The file is sent only after you confirm this checkbox. Ask your provider for a verbose JSON response to enable precise SRT captions.': '최대 25 MB. 브라우저 접근(CORS)을 허용하는 multipart 전사 API가 필요합니다. 확인란에 동의한 뒤에만 파일이 전송됩니다. 정확한 SRT 자막을 위해 서비스의 상세 JSON 응답을 사용하세요.',
        'Send the selected recording to this service for transcription. Provider charges may apply.': '선택한 녹음 파일을 이 서비스로 전송해 전사합니다. 서비스 요금이 부과될 수 있습니다.',
        'Public webpage → editable draft': '공개 웹페이지 → 편집 가능한 초안',
        'Public page URL': '공개 페이지 URL', 'Import readable page': '페이지 내용 가져오기',
        'Image → text · local OCR': '이미지 → 글자 인식(기기 내 처리)',
        'Text language': '글자 언어', 'Extract text from image': '이미지에서 글자 추출',
        'Audio / video → transcript': '음성·영상 → 녹취록',
        'Transcript language': '녹취록 언어', 'Auto-detect': '자동 감지',
        'Transcription endpoint': '전사 서비스 주소', 'Model supported by your provider': '서비스에서 지원하는 모델',
        'API key (kept in this tab only)': 'API 키(이 탭에서만 사용)',
        'Upload & transcribe': '업로드하고 전사',
        'English': '영어', 'Chinese': '중국어', 'Spanish': '스페인어', 'French': '프랑스어',
        'German': '독일어', 'Japanese': '일본어', 'Korean': '한국어',
        'Image': '이미지', 'Recording': '녹음 파일', 'Model': '모델'
      };
      const card = document.querySelector('.card');
      for (const [source, target] of Object.entries(translations).sort((a, b) => b[0].length - a[0].length)) card.innerHTML = card.innerHTML.split(source).join(target);
    }
    $('import-url').onclick = () => job($('import-url'), async () => {
      const url = endpoint('source-url'), host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
      if (/(^|\.)youtube\.com$|youtu\.be$/.test(host)) throw new Error('YouTube does not allow direct browser transcript import. Open the video transcript, copy it, then paste it into the transcript box.');
      const controller = new AbortController(); stop = () => controller.abort();
      message('Reading ' + host + ' in your browser…');
      let response;
      try { response = await fetch(url, {signal: controller.signal, headers: {Accept: 'text/html,text/plain;q=0.9'}}); }
      catch (e) { if (e.name === 'AbortError') throw e; throw new Error('This site does not allow browser access (CORS). Copy the text and paste it above instead.'); }
      if (!response.ok) throw new Error('The page returned ' + response.status + '. Check that the link is public.');
      const source = await response.text();
      if (source.length > 5 * 1024 * 1024) throw new Error('This page is too large to import. Copy the relevant text instead.');
      const doc = new DOMParser().parseFromString(source, 'text/html');
      doc.querySelectorAll('script,style,noscript,svg,nav,header,footer,aside,form,button,iframe').forEach(node => node.remove());
      const root = doc.querySelector('article,main,[role="main"]') || doc.body;
      // HTML pages are often minified into one source line. Insert readable
      // boundaries before extracting text so headings, paragraphs and list items
      // remain useful as a teleprompter draft.
      root?.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,br').forEach(node => node.after(doc.createTextNode('\n\n')));
      const text = (root?.textContent || '').replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
      if (text.length < 80) throw new Error('No readable article text was found. Copy the transcript or page text and paste it above instead.');
      result((doc.querySelector('meta[property="og:title"]')?.content || doc.title || host).trim().slice(0, 180), text.slice(0, 200000));
      message('Page imported. Review quotes, headings and copyright before reading or publishing.');
    });
    $('ocr').onclick = () => job($('ocr'), async () => {
      const file = $('ocr-file').files[0];
      if (!file || file.size > 10 * 1024 * 1024 || !/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error('Select a JPG, PNG or WebP image under 10 MB.');
      message('Loading local OCR engine…');
      let worker, cancelled = false, cancelRecognition;
      stop = () => { cancelled = true; cancelRecognition?.(); worker?.terminate(); message('Cancelling…'); };
      await W.loadScript('/vendor/creator/ocr/tesseract.min.js');
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      try {
        worker = await Tesseract.createWorker($('ocr-language').value, 1, {workerPath:'/vendor/creator/ocr/worker.min.js', corePath:'/vendor/creator/ocr', langPath:'/vendor/creator/ocr', logger:m => { if (!cancelled) message(`${m.status} · ${Math.round((m.progress || 0) * 100)}%`); }});
        if (cancelled) throw new DOMException('Cancelled', 'AbortError');
        const data = await Promise.race([worker.recognize(file), new Promise((_, reject) => { cancelRecognition = () => reject(new DOMException('Cancelled', 'AbortError')); })]);
        if (cancelled) throw new DOMException('Cancelled', 'AbortError');
        if (!data.data.text.trim()) throw new Error('No readable text found. Try a sharper image with printed text.');
        result(titleOf(file), data.data.text); message('OCR complete. Review names, numbers and punctuation.');
      } finally { await worker?.terminate(); }
    });
    $('transcribe').onclick = () => job($('transcribe'), async () => {
      const file = $('speech-file').files[0];
      if (!file || file.size > 25 * 1024 * 1024) throw new Error('Choose an audio or video file under 25 MB.');
      if (!$('speech-consent').checked) throw new Error('Confirm the recording may be sent to your transcription service.');
      const url = endpoint('speech-endpoint'), key = $('speech-key').value.trim(), model = $('speech-model').value.trim();
      if (!key || !model) throw new Error('Enter the service API key and model.');
      const controller = new AbortController(); stop = () => controller.abort();
      const form = new FormData(); form.append('file', file); form.append('model', model); form.append('response_format', 'verbose_json');
      if ($('speech-language').value) form.append('language', $('speech-language').value);
      message('Sending recording to ' + new URL(url).host + '…');
      const timer = setTimeout(() => controller.abort(), 180000);
      try {
        const response = await fetch(url, {method:'POST', headers:{Authorization:'Bearer ' + key}, body:form, signal:controller.signal});
        if (!response.ok) throw new Error(`Service returned ${response.status}. Check model, format, quota and browser access.`);
        const data = await response.json(); if (typeof data.text !== 'string') throw new Error('The service did not return transcript text.');
        result(titleOf(file), data.text);
        const segments = (data.segments || []).filter(s => Number.isFinite(s.start) && Number.isFinite(s.end) && s.start >= 0 && s.end > s.start && typeof s.text === 'string');
        if (segments.length) await W.save('captions', {title:titleOf(file), segments});
        else await W.remove('captions');
        message(segments.length ? 'Transcript ready. Timed subtitles are available in Publishing Assistant.' : 'Transcript ready. This service returned no subtitle timestamps.');
      } catch (e) { if (e instanceof TypeError) throw new Error('Could not reach the service. Check its browser CORS support and your network.'); throw e; }
      finally { clearTimeout(timer); }
    });
  }
  // Send text through the existing AI writer, with no automatic paid request.
  const refine = document.createElement('button'); refine.textContent = isKorean ? 'AI 글쓰기에서 다듬기 →' : 'Refine in AI writer →';
  $('use').after(refine);
  refine.onclick = () => {
    if (!$('result').value.trim()) return message('Create or paste a draft first.');
    try {
      sessionStorage.setItem('cueprompt-incoming', JSON.stringify({title:$('result-title').value, text:$('result').value, refine:true}));
      const localeHome = {'zh-CN':'/zh/','zh-TW':'/zh-tw/',es:'/es/',pt:'/pt/',fr:'/fr/',de:'/de/',ja:'/ja/',ko:'/ko/',ru:'/ru/',ar:'/ar/',hi:'/hi/',id:'/id/',vi:'/vi/',th:'/th/'};
      location.href = (localeHome[document.documentElement.lang] || '/') + '#studio';
    } catch { message('Storage unavailable. Download the draft instead.'); }
  };
  if ($('publish-script')) {
    inject(document.querySelector('.card'), `<details open><summary>Subtitle export</summary><p class="hint">Export timestamps from your last transcription, or create an estimated draft to adjust against your video. Estimated captions are not speech-aligned.</p><button id="timed-srt">Download last transcribed SRT</button><label>Video duration (seconds)<input id="caption-duration" type="number" min="1" max="14400" value="60"></label><button id="estimated-srt">Download estimated SRT draft</button></details><details open><summary>One-click publishing pack</summary><p class="hint">Downloads a local ZIP containing your title, description, tags, publishing checklist and the latest timed SRT when available. Video files are not added to the pack.</p><button id="download-pack">Download publishing pack (.zip)</button></details>`);
    if (isKorean) {
      const translations = {
        'Export timestamps from your last transcription, or create an estimated draft to adjust against your video. Estimated captions are not speech-aligned.': '마지막 전사 결과의 시간 정보를 내보내거나 영상에 맞춰 조정할 예상 자막 초안을 만드세요. 예상 자막은 실제 음성과 동기화되지 않습니다.',
        'Downloads a local ZIP containing your title, description, tags, publishing checklist and the latest timed SRT when available. Video files are not added to the pack.': '제목, 설명, 태그, 게시 체크리스트와 최신 시간 자막을 ZIP 파일로 저장합니다. 동영상 파일은 포함되지 않습니다.',
        'Download last transcribed SRT': '마지막 전사 SRT 다운로드', 'Download estimated SRT draft': '예상 SRT 초안 다운로드',
        'Download publishing pack (.zip)': '게시 자료 ZIP 다운로드', 'Video duration (seconds)': '영상 길이(초)',
        'One-click publishing pack': '게시 자료 한 번에 저장', 'Subtitle export': '자막 내보내기'
      };
      const card = document.querySelector('.card');
      for (const [source, target] of Object.entries(translations).sort((a, b) => b[0].length - a[0].length)) card.innerHTML = card.innerHTML.split(source).join(target);
    }
    try { const draft = await W.read('publish'); if (draft) { $('video-title').value = draft.title; $('publish-script').value = draft.text; } } catch { /* Manual paste remains available. */ }
    $('timed-srt').onclick = async () => {
      try { const data = await W.read('captions'); if (!data?.segments?.length) return message('No timed transcript available. Transcribe the matching recording first.'); W.download(new Blob([W.toSrt(data.segments)], {type:'text/plain'}), 'transcribed-captions.srt'); message('Exported subtitles from: ' + data.title + '. Check they match this recording.'); } catch { message('Subtitle storage is unavailable.'); }
    };
    $('estimated-srt').onclick = () => {
      const duration = Number($('caption-duration').value), text = $('publish-script').value.replace(/^#+.*$/gm, '').replace(/\[(pause|slow)\]/g, '').trim();
      if (!text || !Number.isFinite(duration) || duration < 1 || duration > 14400) return message('Add a script and a duration from 1 to 14,400 seconds.');
      const words = text.split(/\s+/); const lines = []; let line = '';
      for (const word of words) { if (line && (line + ' ' + word).length > 70) { lines.push(line); line = ''; } line += (line ? ' ' : '') + word; }
      if (line) lines.push(line);
      const chunks = lines.flatMap(s => s.match(/.{1,70}/gu) || []), total = chunks.reduce((n, s) => n + s.length, 0); let cursor = 0;
      const segments = chunks.map(s => { const start = cursor; cursor += duration * s.length / total; return {start, end:cursor, text:s}; });
      W.download(new Blob([W.toSrt(segments)], {type:'text/plain'}), 'estimated-captions-review-required.srt'); message('Estimated timing only. Review and align before publishing.');
    };
    $('download-pack').onclick = async () => {
      const title = $('video-title').value.trim(), pack = $('result').value.trim();
      if (!title || !pack) return message('Build publishing copy first, then download the pack.');
      const safe = title.replace(/[^\p{L}\p{N}_-]/gu, '-').replace(/-+/g, '-').slice(0, 80) || 'cueprompt-release';
      const files = [
        {name: safe + '-publishing-copy.txt', text: pack + '\n'},
        {name: 'README.txt', text: 'CuePrompt publishing pack\n\n1. Review the title, description and tags.\n2. Upload your checked video manually.\n3. Upload captions when an SRT file is included.\n4. Confirm platform visibility, thumbnail, links and music rights.\n'}
      ];
      try { const captions = await W.read('captions'); if (captions?.segments?.length) files.push({name: safe + '-captions.srt', text: W.toSrt(captions.segments)}); W.download(W.zipText(files), safe + '-publishing-pack.zip'); message('Publishing pack downloaded locally' + (files.length > 2 ? ' with timed SRT.' : '. No timed SRT was available.')); }
      catch { message('Could not create the publishing pack. Try downloading the copy and SRT separately.'); }
    };
  }
})();
