'use strict';
(async () => {
  const $ = id => document.getElementById(id), W = CueWorkflow;
  let incoming, ff, busy = false, cancelled = false, outputURL;
  const status = text => { $('media-status').textContent = text; };
  try { incoming = await W.read('recording'); if (incoming?.blob) status('Ready: your latest studio recording. Choose a file to use a different video.'); } catch { status('Choose a video to get started.'); }
  const forget = document.createElement('button'); forget.textContent = 'Remove saved local take'; forget.hidden = !incoming?.blob;
  $('media-file').after(forget);
  forget.onclick = async () => { if (busy) return; try { await W.remove('recording'); incoming = null; forget.hidden = true; status('Saved local take removed. Downloaded files are unaffected.'); } catch { status('Could not remove the saved take. Try again.'); } };
  $('media-file').onchange = () => { incoming = null; status('File ready. Choose export settings.'); };
  $('media-cancel').onclick = () => { cancelled = true; ff?.terminate(); status('Cancelling…'); };
  $('convert').onclick = async () => {
    if (busy) return;
    const file = $('media-file').files[0] || incoming?.blob;
    if (!file || file.size > 150 * 1024 * 1024) return status('Choose a video under 150 MB.');
    busy = true; cancelled = false; $('convert').disabled = true; $('media-cancel').hidden = false; $('media-download').hidden = true;
    $('media-progress').value = 0;
    try {
      status('Loading local video engine…'); ff = await W.engine(p => { if (!cancelled) { $('media-progress').value = p; status(`Processing locally · ${p}%`); } });
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      await ff.writeFile('input', new Uint8Array(await file.arrayBuffer()));
      const format = $('media-format').value, canvas = $('media-canvas').value, quality = $('media-quality').value;
      const filter = canvas === 'portrait' ? 'scale=720:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1' : canvas === 'landscape' ? 'scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1' : 'scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1';
      const codecs = format === 'mp4' ? ['-c:v','libx264','-threads','1','-preset','fast','-crf',quality,'-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart'] : ['-c:v','libvpx','-threads','1','-deadline','realtime','-cpu-used','4','-b:v','1200k','-crf',quality,'-c:a','libopus','-b:a','96k'];
      const name = 'output.' + format;
      const code = await ff.exec(['-i','input','-map','0:v:0','-map','0:a:0?','-vf',filter,...codecs,name]);
      if (cancelled) throw new DOMException('Cancelled', 'AbortError');
      if (code !== 0) throw new Error('Could not convert this video. Try a smaller MP4 or WebM file.');
      const data = await ff.readFile(name), blob = new Blob([data], {type:'video/' + format});
      if (outputURL) URL.revokeObjectURL(outputURL); outputURL = URL.createObjectURL(blob);
      $('media-preview').src = outputURL; $('media-download').href = outputURL; $('media-download').download = 'cueprompt-export.' + format; $('media-download').hidden = false;
      const change = Math.round((1 - blob.size / file.size) * 100);
      const size = n => n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
      $('media-summary').textContent = `${size(file.size)} → ${size(blob.size)} · ${change >= 0 ? change + '% smaller' : -change + '% larger; padding, format and source quality affect file size'}`;
      $('media-progress').value = 100; status('Export ready. Play it back and check audio before downloading.');
    } catch (e) { status(cancelled ? 'Cancelled. Your original video is unchanged.' : e.message || 'Processing failed. Try a smaller recording.'); }
    finally { ff?.terminate(); ff = null; busy = false; $('convert').disabled = false; $('media-cancel').hidden = true; }
  };
  window.addEventListener('pagehide', () => { ff?.terminate(); if (outputURL) URL.revokeObjectURL(outputURL); });
})();
