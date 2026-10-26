'use strict';
/* Shared local media processing and one-take handoff. No file upload occurs here. */
window.CueWorkflow = (() => {
  const scripts = new Map();
  function loadScript(src) {
    if (!scripts.has(src)) scripts.set(src, new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = src; s.onload = resolve;
      s.onerror = () => { scripts.delete(src); s.remove(); reject(new Error('Could not load the local processing engine. Please reload and try again.')); }; document.head.append(s);
    }));
    return scripts.get(src);
  }
  const db = () => new Promise((resolve, reject) => {
    const r = indexedDB.open('cueprompt-workflow', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('handoff');
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
  });
  async function transfer(mode, key, value) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction('handoff', mode); const s = tx.objectStore('handoff');
      const r = mode === 'readonly' ? s.get(key) : value === undefined ? s.delete(key) : s.put(value, key);
      tx.oncomplete = () => { d.close(); resolve(r.result); }; tx.onerror = () => { d.close(); reject(tx.error); };
    });
  }
  function download(blob, name) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); }
  async function engine(progress) {
    await loadScript('/vendor/creator/ffmpeg/ffmpeg.js');
    const f = new FFmpegWASM.FFmpeg();
    f.on('progress', ({progress:p}) => progress(Math.max(0, Math.min(99, Math.round(p * 100)))));
    // Split the single-thread WASM for static hosts with per-asset size limits.
    const pieces = await Promise.all(['aa', 'ab', 'ac', 'ad'].map(async part => {
      const r = await fetch('/vendor/creator/ffmpeg/core.wasm.' + part); if (!r.ok) throw new Error('Processing engine download failed.'); return r.arrayBuffer();
    }));
    const wasm = URL.createObjectURL(new Blob(pieces, {type:'application/wasm'}));
    try { await f.load({coreURL:location.origin + '/vendor/creator/ffmpeg/ffmpeg-core.js', wasmURL:wasm}); }
    catch (error) { f.terminate(); throw error; } finally { URL.revokeObjectURL(wasm); }
    return f;
  }
  const stamp = seconds => {
    const n = Math.max(0, Math.round(seconds * 1000));
    return [Math.floor(n / 3600000), Math.floor(n / 60000) % 60, Math.floor(n / 1000) % 60].map(x => String(x).padStart(2, '0')).join(':') + ',' + String(n % 1000).padStart(3, '0');
  };
  function toSrt(segments) { return segments.map((s, i) => `${i + 1}\n${stamp(s.start)} --> ${stamp(s.end)}\n${s.text.trim()}\n`).join('\n'); }
  return {loadScript, engine, download, stamp, toSrt, read:key => transfer('readonly', key), save:(key, value) => transfer('readwrite', key, value), remove:key => transfer('readwrite', key)};
})();
