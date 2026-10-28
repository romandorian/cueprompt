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
  // Small, dependency-free ZIP writer for text publishing packs. Files are
  // stored (not compressed), which keeps the browser-only bundle predictable.
  const crc32 = data => { let c = 0xffffffff; for (const b of data) { c ^= b; for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return (c ^ 0xffffffff) >>> 0; };
  const u16 = n => [n & 255, (n >>> 8) & 255], u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  function zipText(files) {
    const encoder = new TextEncoder(), entries = files.map(file => ({name: encoder.encode(file.name), data: encoder.encode(file.text), type:file.type || 'text/plain;charset=utf-8'}));
    let offset = 0; const locals = [], central = [];
    for (const file of entries) {
      const crc = crc32(file.data), local = new Uint8Array([0x50,0x4b,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(file.data.length),...u32(file.data.length),...u16(file.name.length),0,0,...file.name,...file.data]);
      locals.push(local); central.push(new Uint8Array([0x50,0x4b,0x01,0x02,20,0,20,0,0,0,0,0,0,0,...u32(crc),...u32(file.data.length),...u32(file.data.length),...u16(file.name.length),0,0,0,0,0,0,0,0,0,0,...u32(offset),...file.name])); offset += local.length;
    }
    const centralSize = central.reduce((n, part) => n + part.length, 0), end = new Uint8Array([0x50,0x4b,0x05,0x06,0,0,0,0,...u16(entries.length),...u16(entries.length),...u32(centralSize),...u32(offset),0,0]);
    return new Blob([...locals, ...central, end], {type:'application/zip'});
  }
  return {loadScript, engine, download, stamp, toSrt, zipText, read:key => transfer('readonly', key), save:(key, value) => transfer('readwrite', key, value), remove:key => transfer('readwrite', key)};
})();

/* Localized custom file controls. The native picker text follows the browser
   UI language, so pages render their own button and file-name labels. Wiring
   is delegated because some fields are injected after this script runs. */
(() => {
  document.addEventListener('click', event => {
    const button = event.target.closest?.('.file-field button[id$="-button"]');
    if (!button) return;
    const input = document.getElementById(button.id.slice(0, -'-button'.length));
    if (input && input.type === 'file') input.click();
  });
  document.addEventListener('change', event => {
    const input = event.target;
    if (!input.closest?.('.file-field') || input.type !== 'file') return;
    const name = document.getElementById(input.id + '-name');
    if (!name) return;
    if (!name.dataset.empty) name.dataset.empty = name.textContent;
    name.textContent = input.files[0] ? input.files[0].name : name.dataset.empty;
  });
})();
