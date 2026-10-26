'use strict';
(async () => {
  const $ = id => document.getElementById(id), W = window.CueWorkflow;
  const message = text => { $('status').textContent = text; };
  const inject = (target, html) => target.insertAdjacentHTML('beforeend', html);
  const titleOf = file => file.name.replace(/\.[^.]+$/, '');
  const result = (title, text) => { $('result-title').value = title; $('result').value = text; };
  let busy = false, stop = null;
  async function job(button, fn) {
    if (busy) return; busy = true; button.disabled = true; $('cancel-job').hidden = false;
    try { await fn(); } catch (e) { message(e.name === 'AbortError' ? 'Cancelled. Your editable draft is unchanged.' : e.message || 'Processing failed. Try a smaller file.'); }
    finally { busy = false; button.disabled = false; $('cancel-job').hidden = true; stop = null; }
  }
  inject($('status').parentElement, '<button id="cancel-job" hidden>Cancel processing</button>');
  $('cancel-job').onclick = () => stop?.();
  // A typed endpoint is explicit: files are sent only by the user's upload action.
  function endpoint(id) { const u = new URL($(id).value); if (u.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(u.hostname)) throw new Error('Use an HTTPS service endpoint.'); if (u.username || u.password) throw new Error('Do not embed credentials in the URL.'); return u.href; }
  if ($('transcript')) {
    document.querySelector('.hint').textContent = 'Paste a YouTube transcript or import TXT, MD, SRT or VTT (up to 5 MB). For pictures and recordings, use the tools below.';
    inject(document.querySelector('.card'), `<details open><summary>Image → text · local OCR</summary><label>Image<input id="ocr-file" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Text language<select id="ocr-language"><option value="eng">English</option><option value="chi_sim+eng">简体中文 + English</option></select></label><p class="hint">JPG, PNG or WebP, up to 10 MB. Printed text works best. Recognition runs on this device.</p><button id="ocr">Extract text from image</button></details><details><summary>Audio / video → transcript</summary><label>Recording<input id="speech-file" type="file" accept="audio/*,video/*"></label><label>Transcription endpoint<input id="speech-endpoint" type="url" placeholder="https://your-provider.example/v1/audio/transcriptions"></label><label>Model<input id="speech-model" placeholder="Model supported by your provider"></label><label>API key (kept in this tab only)<input id="speech-key" type="password" autocomplete="off"></label><label><input id="speech-consent" type="checkbox"> Send the selected recording to this service for transcription. Provider charges may apply.</label><p class="hint">Up to 25 MB. Requires a multipart transcription API with browser access (CORS). Choose a service that accepts your file format. URL fetching is not supported.</p><button id="transcribe">Upload & transcribe</button></details>`);
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
  const refine = document.createElement('button'); refine.textContent = 'Refine in AI writer →';
  $('use').after(refine);
  refine.onclick = () => {
    if (!$('result').value.trim()) return message('Create or paste a draft first.');
    try { sessionStorage.setItem('cueprompt-incoming', JSON.stringify({title:$('result-title').value, text:$('result').value, refine:true})); location.href = '/#studio'; } catch { message('Storage unavailable. Download the draft instead.'); }
  };
  if ($('publish-script')) {
    try { const draft = await W.read('publish'); if (draft) { $('video-title').value = draft.title; $('publish-script').value = draft.text; } } catch { /* Manual paste remains available. */ }
    inject(document.querySelector('.card'), `<details open><summary>Subtitle export</summary><p class="hint">Export timestamps from your last transcription, or create an estimated draft to adjust against your video. Estimated captions are not speech-aligned.</p><button id="timed-srt">Download last transcribed SRT</button><label>Video duration (seconds)<input id="caption-duration" type="number" min="1" max="14400" value="60"></label><button id="estimated-srt">Download estimated SRT draft</button></details>`);
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
  }
})();
